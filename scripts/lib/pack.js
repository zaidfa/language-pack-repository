/*
 * Pack builder: turns authored layout data (data/layouts.js) into the on-disk
 * pack format (schema v1) consumed by the Android app's PackParser.
 *
 * Pack format, per language <tag>/:
 *   manifest.json   - metadata + per-file SHA-256 + pack SHA-256 (trusted hash)
 *   layout.json     - letter layers (the engine frames/uppercases at runtime)
 *   symbols.json    - number / symbol layers
 *   composition.json- (optional) dead keys / transforms
 *
 * The pack SHA-256 is computed over the sorted "<file>:<sha256>" lines of the
 * content files (layout/symbols/composition). It is published in the trusted
 * catalog so the downloader can verify integrity INDEPENDENTLY of the pack's
 * own manifest (never trust a checksum supplied only by the pack itself).
 */

const crypto = require("crypto");

const SCHEMA_VERSION = 1;
const PACK_FORMAT_VERSION = 1;

function sha256(str) {
  return crypto.createHash("sha256").update(Buffer.from(str, "utf8")).digest("hex");
}

// Stable JSON serialization (sorted keys) so hashes are reproducible.
function stableStringify(value) {
  return JSON.stringify(sortKeys(value), null, 2);
}
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortKeys(v[k]);
    return out;
  }
  return v;
}

// Normalize a raw key (string or object) into an emitted key.
function normKey(k) {
  if (typeof k === "string") return k; // compact: label == output, no holds
  const out = {};
  if (k.o !== undefined) out.o = k.o;
  if (k.l !== undefined) out.l = k.l;
  if (k.hold && k.hold.length) out.hold = k.hold;
  if (k.code) out.code = k.code;
  if (k.w) out.w = k.w;
  return out;
}

function letterKey(ch, holds) {
  const h = holds && holds[ch];
  if (h && h.length) return { o: ch, hold: h };
  return ch;
}

const K = {
  shift: (w) => ({ code: "SHIFT", l: "⇧", w: w || 1.5 }),
  del:   (w) => ({ code: "DELETE", l: "⌫", w: w || 1.5 }),
  enter: (w) => ({ code: "ENTER", l: "⏎", w: w || 1.5 }),
  space: (w) => ({ code: "SPACE", o: " ", l: "", w: w || 4 }),
  symbols: (l) => ({ code: "SYMBOLS", l: l || "?123", w: 1.5 }),
  symbols2:(l) => ({ code: "SYMBOLS2", l: l || "=\\<", w: 1.5 }),
  abc:   (l) => ({ code: "ABC", l: l || "ABC", w: 1.5 }),
  lang:  ()  => ({ code: "LANG", l: "🌐" }),
  emoji: ()  => ({ code: "EMOJI", l: "☺" }),
};

// Bottom function row shared by every layer.
function functionRow(modeKey, commaKey, periodKey) {
  return [modeKey, K.lang(), K.emoji(), commaKey || ",", K.space(), periodKey || ".", K.enter()];
}

/**
 * Build layout.json content for a language spec.
 */
function buildLayout(tag, meta, spec) {
  const [r1, r2, r3] = spec.rows;
  const holds = spec.holds || {};
  const row1 = r1.map((c) => normKey(letterKey(c, holds)));
  const row2 = r2.map((c) => normKey(letterKey(c, holds)));
  // Row 3: SHIFT (cased only) + letters + DELETE
  const row3 = [];
  if (spec.cased) row3.push(K.shift());
  r3.forEach((c) => row3.push(normKey(letterKey(c, holds))));
  row3.push(K.del());
  const fnRow = functionRow(K.symbols());

  const layout = {
    schemaVersion: SCHEMA_VERSION,
    tag,
    script: spec.script || meta.script,
    direction: spec.direction || meta.direction,
    cased: !!spec.cased,
    layoutType: spec.layoutType || "direct",
    inputMethod: spec.inputMethod || "direct",
    layers: { default: [row1, row2, row3, fnRow] },
  };
  if (spec.note) layout.note = spec.note;
  return layout;
}

/**
 * Build symbols.json content.
 */
function buildSymbols(tag, spec) {
  const s = spec.symbols;
  const toKeys = (arr) => arr.map((c) => normKey(typeof c === "string" ? c : c));
  const symRow3 = [K.symbols2()].concat(toKeys(s.symbols[2])).concat([K.del()]);
  const sym2Row3 = [K.symbols()].concat(toKeys(s.symbols2[2])).concat([K.del()]);
  return {
    schemaVersion: SCHEMA_VERSION,
    tag,
    layers: {
      symbols: [toKeys(s.symbols[0]), toKeys(s.symbols[1]), symRow3, functionRow(K.abc())],
      symbols2: [toKeys(s.symbols2[0]), toKeys(s.symbols2[1]), sym2Row3, functionRow(K.abc())],
    },
  };
}

/**
 * Build a complete pack (file contents + manifest + catalog entry).
 * Returns { files: {name: contentString}, manifest, catalogEntry }.
 */
function buildPack(meta, spec, packVersion, minAppVersion) {
  const tag = meta.tag;
  const layout = buildLayout(tag, meta, spec);
  const symbols = buildSymbols(tag, spec);

  const files = {
    "layout.json": stableStringify(layout),
    "symbols.json": stableStringify(symbols),
  };
  // composition.json only when a spec defines transforms/dead keys (none yet in
  // the authored subset -> omit, keeping "features.composition" honest).
  const hasComposition = !!(spec.composition);
  if (hasComposition) files["composition.json"] = stableStringify(spec.composition);

  // Per-file hashes
  const fileEntries = Object.keys(files).sort().map((name) => ({
    name,
    sha256: sha256(files[name]),
    bytes: Buffer.byteLength(files[name], "utf8"),
  }));
  const totalBytes = fileEntries.reduce((n, f) => n + f.bytes, 0);
  // Trusted pack hash over sorted "name:hash" lines.
  const packSha = sha256(fileEntries.map((f) => `${f.name}:${f.sha256}`).join("\n"));

  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    packFormat: PACK_FORMAT_VERSION,
    tag,
    name: { english: meta.englishName, native: meta.nativeName },
    script: layout.script,
    direction: layout.direction,
    cased: layout.cased,
    layoutType: layout.layoutType,
    inputMethod: layout.inputMethod,
    packVersion,
    minAppVersion,
    bytes: totalBytes,
    sha256: packSha,
    files: fileEntries,
    features: {
      layout: true,
      symbols: true,
      composition: hasComposition,
      dictionary: false,
    },
  };
  files["manifest.json"] = stableStringify(manifest);

  const catalogEntry = {
    tag,
    englishName: meta.englishName,
    nativeName: meta.nativeName,
    script: layout.script,
    direction: layout.direction,
    family: meta.family,
    implemented: true,
    validated: true,
    availableForDownload: true,
    status: "available",
    packVersion,
    minAppVersion,
    layoutType: layout.layoutType,
    inputMethod: layout.inputMethod,
    sizeBytes: totalBytes,
    sha256: packSha,
    path: `packs/${tag}/`,
  };

  return { files, manifest, catalogEntry };
}

function catalogOnlyEntry(meta) {
  return {
    tag: meta.tag,
    englishName: meta.englishName,
    nativeName: meta.nativeName,
    script: meta.script,
    direction: meta.direction,
    family: meta.family,
    implemented: false,
    validated: false,
    availableForDownload: false,
    status: "catalog-only",
    packVersion: null,
    minAppVersion: null,
    layoutType: null,
    inputMethod: null,
    sizeBytes: null,
    sha256: null,
    path: null,
  };
}

module.exports = {
  SCHEMA_VERSION, PACK_FORMAT_VERSION,
  sha256, stableStringify, buildPack, catalogOnlyEntry,
};
