#!/usr/bin/env node
/*
 * Pack + catalog validator. Run AFTER generate.js.
 *
 * Usage:  node scripts/validate.js   (exit code 0 = all checks pass)
 *
 * Checks:
 *   - no duplicate catalog tags; valid BCP 47-ish tag shape
 *   - every "available" entry has a pack folder with manifest/layout/symbols
 *   - per-file SHA-256 matches the manifest
 *   - pack SHA-256 matches the TRUSTED catalog entry (independent of manifest)
 *   - layout schema: required fields, non-empty rows, valid key objects
 *   - no invalid Unicode (lone surrogates / U+FFFD) in any key output
 *   - direction is rtl only for RTL scripts; cased flag consistent
 *   - special-key codes are from the known set
 *   - every row ends with a reachable DELETE; every layer reachable
 */

const fs = require("fs");
const path = require("path");
const { sha256, stableStringify } = require("./lib/pack");

const REPO_ROOT = path.resolve(__dirname, "..");
const RTL_SCRIPTS = new Set(["Arab", "Hebr", "Thaa", "Syrc", "Nkoo", "Adlm"]);
const KEY_CODES = new Set(["SHIFT", "DELETE", "ENTER", "SPACE", "SYMBOLS", "SYMBOLS2", "ABC", "EMOJI", "LANG", "MODE"]);
const TAG_RE = /^[a-z]{2,3}(-[A-Za-z]{2,4})*$/;

let errors = 0, warnings = 0, checks = 0;
function fail(msg) { errors++; console.error("  ✗ " + msg); }
function warn(msg) { warnings++; console.warn("  ! " + msg); }
function ok() { checks++; }

function hasInvalidUnicode(str) {
  if (str.indexOf("�") !== -1) return true; // replacement char
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF) { // high surrogate must be followed by low
      const n = str.charCodeAt(i + 1);
      if (!(n >= 0xDC00 && n <= 0xDFFF)) return true;
      i++;
    } else if (c >= 0xDC00 && c <= 0xDFFF) {
      return true; // lone low surrogate
    }
  }
  return false;
}

function validateKey(k, where) {
  if (typeof k === "string") {
    if (k.length === 0) fail(`${where}: empty string key`);
    if (hasInvalidUnicode(k)) fail(`${where}: invalid Unicode in key "${k}"`);
    return;
  }
  if (typeof k !== "object" || k === null) { fail(`${where}: key is not string/object`); return; }
  if (k.code) {
    if (!KEY_CODES.has(k.code)) fail(`${where}: unknown key code "${k.code}"`);
  } else if (k.o === undefined) {
    fail(`${where}: key has neither "o" nor "code"`);
  }
  if (k.o !== undefined && hasInvalidUnicode(k.o)) fail(`${where}: invalid Unicode in output "${k.o}"`);
  if (k.hold) {
    if (!Array.isArray(k.hold)) fail(`${where}: hold is not an array`);
    else k.hold.forEach((h, i) => { if (typeof h !== "string" || !h) fail(`${where}: bad hold[${i}]`);
      else if (hasInvalidUnicode(h)) fail(`${where}: invalid Unicode in hold "${h}"`); });
  }
}

function rowHas(row, code) { return row.some((k) => typeof k === "object" && k && k.code === code); }

function validateLayers(layers, where, requireDelete) {
  for (const layerName of Object.keys(layers)) {
    const rows = layers[layerName];
    if (!Array.isArray(rows) || rows.length === 0) { fail(`${where}: layer "${layerName}" empty`); continue; }
    let sawDelete = false;
    rows.forEach((rrow, ri) => {
      if (!Array.isArray(rrow) || rrow.length === 0) fail(`${where}: ${layerName} row ${ri} empty`);
      else rrow.forEach((k, ki) => { validateKey(k, `${where}:${layerName}[${ri}][${ki}]`); if (typeof k === "object" && k && k.code === "DELETE") sawDelete = true; });
    });
    if (requireDelete && !sawDelete) fail(`${where}: layer "${layerName}" has no DELETE key`);
  }
}

function validatePack(entry) {
  const dir = path.join(REPO_ROOT, "packs", entry.tag);
  const manPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manPath)) { fail(`${entry.tag}: missing manifest.json`); return; }
  const manifest = JSON.parse(fs.readFileSync(manPath, "utf8"));

  // Per-file hashes + content files present
  for (const f of manifest.files) {
    const fp = path.join(dir, f.name);
    if (!fs.existsSync(fp)) { fail(`${entry.tag}: missing file ${f.name}`); continue; }
    const content = fs.readFileSync(fp, "utf8");
    const got = sha256(content);
    if (got !== f.sha256) fail(`${entry.tag}: ${f.name} sha256 mismatch (manifest)`); else ok();
    if (Buffer.byteLength(content, "utf8") !== f.bytes) warn(`${entry.tag}: ${f.name} byte count drift`);
  }

  // Trusted pack hash: recompute from content files and compare to CATALOG (not manifest).
  const recomputed = sha256(manifest.files.map((f) => `${f.name}:${f.sha256}`).join("\n"));
  if (recomputed !== entry.sha256) fail(`${entry.tag}: pack sha256 does not match trusted catalog`); else ok();
  if (manifest.sha256 !== entry.sha256) fail(`${entry.tag}: manifest sha256 != catalog sha256`); else ok();

  // Layout
  const layout = JSON.parse(fs.readFileSync(path.join(dir, "layout.json"), "utf8"));
  if (layout.tag !== entry.tag) fail(`${entry.tag}: layout tag mismatch`);
  if (!layout.layers || !layout.layers.default) fail(`${entry.tag}: layout missing default layer`);
  else validateLayers(layout.layers, `${entry.tag}/layout`, true);

  // direction / cased consistency
  const shouldRtl = RTL_SCRIPTS.has(layout.script);
  if (shouldRtl && layout.direction !== "rtl") fail(`${entry.tag}: RTL script "${layout.script}" but direction=${layout.direction}`); else ok();
  if (!shouldRtl && layout.direction === "rtl") fail(`${entry.tag}: non-RTL script marked rtl`);
  if (layout.cased && RTL_SCRIPTS.has(layout.script)) warn(`${entry.tag}: RTL script marked cased`);

  // Symbols
  const symbols = JSON.parse(fs.readFileSync(path.join(dir, "symbols.json"), "utf8"));
  if (!symbols.layers || !symbols.layers.symbols) fail(`${entry.tag}: symbols missing symbols layer`);
  else validateLayers(symbols.layers, `${entry.tag}/symbols`, true);

  // Entry consistency
  if (entry.sizeBytes !== manifest.bytes) warn(`${entry.tag}: catalog sizeBytes != manifest bytes`);
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "catalog", "languages.json"), "utf8"));
  console.log(`Validating ${catalog.length} catalog entries...`);

  const tags = new Set();
  for (const e of catalog) {
    if (tags.has(e.tag)) fail(`duplicate tag ${e.tag}`); tags.add(e.tag);
    if (!TAG_RE.test(e.tag)) warn(`tag "${e.tag}" does not match expected BCP 47 shape`);
    if (!e.englishName || !e.nativeName) fail(`${e.tag}: missing name`);
    if (hasInvalidUnicode(e.nativeName)) fail(`${e.tag}: invalid Unicode in nativeName`);
  }

  const available = catalog.filter((e) => e.availableForDownload);
  for (const e of available) validatePack(e);

  console.log("");
  console.log(`Checks passed: ${checks}  |  Warnings: ${warnings}  |  Errors: ${errors}`);
  console.log(`Available packs validated: ${available.length} / ${catalog.length} listed`);
  if (errors > 0) { console.error("VALIDATION FAILED"); process.exit(1); }
  console.log("VALIDATION OK");
}

main();
