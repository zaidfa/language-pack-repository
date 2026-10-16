#!/usr/bin/env node
/*
 * Reproducible catalog + pack generator.
 *
 * Usage:  node scripts/generate.js
 *
 * Outputs (all under the repository root, ../ from this script):
 *   catalog/languages.json         - full catalog (all listed languages)
 *   catalog/catalog-version.json   - catalog version + counts
 *   packs/<tag>/*.json             - one folder per available language
 *   coverage-report.json           - machine-readable coverage
 *   docs/COVERAGE.md               - human-readable coverage report
 *
 * It ALSO writes an offline-first bundle into the Android app so the keyboard
 * works before any download:
 *   app/src/main/assets/catalog/languages.json
 *   app/src/main/assets/catalog/catalog-version.json
 *   app/src/main/assets/packs/<tag>/*.json   (BUNDLED_DEFAULTS only)
 */

const fs = require("fs");
const path = require("path");
const { buildPack, catalogOnlyEntry, PACK_FORMAT_VERSION } = require("./lib/pack");
const META_ROWS = require("./data/languages");
const { LAYOUTS } = require("./data/layouts");

const REPO_ROOT = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(REPO_ROOT, "..");
const APP_ASSETS = path.join(PROJECT_ROOT, "app", "src", "main", "assets");

const PACK_VERSION = "1.0.0";
const MIN_APP_VERSION = 6; // matches app versionCode in app/build.gradle
const CATALOG_VERSION = "1.0.0";

// Packs bundled inside the APK for offline-first startup.
const BUNDLED_DEFAULTS = ["en", "bn", "ar"];

function meta(row) {
  const [tag, englishName, nativeName, script, direction, family] = row;
  return { tag, englishName, nativeName, script, direction, family };
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeFile(p, content) { ensureDir(path.dirname(p)); fs.writeFileSync(p, content); }

function main() {
  const metas = META_ROWS.map(meta);

  // Duplicate-tag guard (fail fast).
  const seen = new Set();
  for (const m of metas) {
    if (seen.has(m.tag)) throw new Error("Duplicate catalog tag: " + m.tag);
    seen.add(m.tag);
  }

  const catalog = [];
  const coverage = { available: [], catalogOnly: [] };
  let availableCount = 0;

  for (const m of metas) {
    const spec = LAYOUTS[m.tag];
    if (spec) {
      const { files, catalogEntry } = buildPack(m, spec, PACK_VERSION, MIN_APP_VERSION);
      // Write pack files to repo.
      for (const name of Object.keys(files)) {
        writeFile(path.join(REPO_ROOT, "packs", m.tag, name), files[name]);
      }
      // Bundle defaults into the app assets.
      if (BUNDLED_DEFAULTS.includes(m.tag)) {
        for (const name of Object.keys(files)) {
          writeFile(path.join(APP_ASSETS, "packs", m.tag, name), files[name]);
        }
      }
      catalog.push(catalogEntry);
      coverage.available.push({ tag: m.tag, englishName: m.englishName, script: m.script,
        direction: m.direction, layoutType: catalogEntry.layoutType, sizeBytes: catalogEntry.sizeBytes });
      availableCount++;
    } else {
      catalog.push(catalogOnlyEntry(m));
      coverage.catalogOnly.push({ tag: m.tag, englishName: m.englishName, script: m.script,
        direction: m.direction, reason: reasonFor(m) });
    }
  }

  catalog.sort((a, b) => a.tag.localeCompare(b.tag));

  const catalogVersion = {
    catalogVersion: CATALOG_VERSION,
    packFormat: PACK_FORMAT_VERSION,
    generatedAt: new Date().toISOString(),
    counts: { total: catalog.length, available: availableCount, catalogOnly: catalog.length - availableCount },
    note: "'available' entries have validated, downloadable packs. 'catalog-only' entries are listed but not yet packaged.",
  };

  // Repo catalog
  writeFile(path.join(REPO_ROOT, "catalog", "languages.json"), JSON.stringify(catalog, null, 2));
  writeFile(path.join(REPO_ROOT, "catalog", "catalog-version.json"), JSON.stringify(catalogVersion, null, 2));

  // App bundled catalog (offline-first)
  writeFile(path.join(APP_ASSETS, "catalog", "languages.json"), JSON.stringify(catalog, null, 2));
  writeFile(path.join(APP_ASSETS, "catalog", "catalog-version.json"), JSON.stringify(catalogVersion, null, 2));

  // Coverage report (machine-readable)
  const coverageReport = {
    generatedAt: catalogVersion.generatedAt,
    catalogVersion: CATALOG_VERSION,
    totals: catalogVersion.counts,
    byScript: byScript(catalog),
    available: coverage.available.sort((a, b) => a.tag.localeCompare(b.tag)),
    catalogOnly: coverage.catalogOnly.sort((a, b) => a.tag.localeCompare(b.tag)),
  };
  writeFile(path.join(REPO_ROOT, "coverage-report.json"), JSON.stringify(coverageReport, null, 2));
  writeFile(path.join(REPO_ROOT, "docs", "COVERAGE.md"), renderCoverageMd(coverageReport));

  console.log(`Catalog: ${catalog.length} languages listed, ${availableCount} available (validated packs).`);
  console.log(`Bundled into app assets: ${BUNDLED_DEFAULTS.join(", ")}`);
  console.log(`Wrote packs to ${path.relative(PROJECT_ROOT, path.join(REPO_ROOT, "packs"))}/`);
}

function reasonFor(m) {
  const complex = { Hans: "requires input-method engine (candidate selection)",
    Hant: "requires input-method engine (candidate selection)",
    Jpan: "requires kana/kanji conversion engine", Kore: "requires Hangul syllable composition engine",
    Taml: "complex script - needs dedicated validated layout",
    Telu: "complex script - needs dedicated validated layout",
    Knda: "complex script - needs dedicated validated layout",
    Mlym: "complex script - needs dedicated validated layout",
    Guru: "complex script - needs dedicated validated layout",
    Gujr: "complex script - needs dedicated validated layout",
    Orya: "complex script - needs dedicated validated layout",
    Sinh: "complex script - needs dedicated validated layout",
    Khmr: "complex script - needs dedicated validated layout",
    Mymr: "complex script - needs dedicated validated layout",
    Laoo: "complex script - needs dedicated validated layout",
    Tibt: "complex script - needs dedicated validated layout",
    Ethi: "syllabic script - needs dedicated validated layout",
    Armn: "layout not yet authored to a verified standard",
    Thaa: "RTL complex script - needs dedicated validated layout",
    Syrc: "RTL complex script - needs dedicated validated layout",
    Nkoo: "RTL script - needs dedicated validated layout",
    Adlm: "RTL script - needs dedicated validated layout",
    Cher: "syllabary - needs dedicated validated layout",
    Cans: "syllabics - needs dedicated validated layout",
    Olck: "needs dedicated validated layout" };
  return complex[m.script] || "layout not yet authored";
}

function byScript(catalog) {
  const map = {};
  for (const e of catalog) {
    map[e.script] = map[e.script] || { total: 0, available: 0 };
    map[e.script].total++;
    if (e.availableForDownload) map[e.script].available++;
  }
  return map;
}

function renderCoverageMd(r) {
  const lines = [];
  lines.push("# Language Coverage Report");
  lines.push("");
  lines.push(`Generated: ${r.generatedAt}`);
  lines.push(`Catalog version: ${r.catalogVersion}`);
  lines.push("");
  lines.push(`- **Total languages listed:** ${r.totals.total}`);
  lines.push(`- **Available (validated downloadable packs):** ${r.totals.available}`);
  lines.push(`- **Catalog-only (listed, not yet packaged):** ${r.totals.catalogOnly}`);
  lines.push("");
  lines.push("## Coverage by script");
  lines.push("");
  lines.push("| Script | Available | Listed |");
  lines.push("|--------|-----------|--------|");
  for (const s of Object.keys(r.byScript).sort()) {
    lines.push(`| ${s} | ${r.byScript[s].available} | ${r.byScript[s].total} |`);
  }
  lines.push("");
  lines.push("## Available languages (functional, validated packs)");
  lines.push("");
  lines.push("| Tag | Language | Script | Dir | Layout | Size (bytes) |");
  lines.push("|-----|----------|--------|-----|--------|--------------|");
  for (const a of r.available) {
    lines.push(`| ${a.tag} | ${a.englishName} | ${a.script} | ${a.direction} | ${a.layoutType} | ${a.sizeBytes} |`);
  }
  lines.push("");
  lines.push("## Catalog-only languages (listed, not yet downloadable)");
  lines.push("");
  lines.push("These are genuine languages with correct metadata (BCP 47 tag, native name, script, direction) but no authored/validated keyboard pack yet. Each row states why.");
  lines.push("");
  lines.push("| Tag | Language | Script | Dir | Reason |");
  lines.push("|-----|----------|--------|-----|--------|");
  for (const c of r.catalogOnly) {
    lines.push(`| ${c.tag} | ${c.englishName} | ${c.script} | ${c.direction} | ${c.reason} |`);
  }
  lines.push("");
  return lines.join("\n");
}

main();
