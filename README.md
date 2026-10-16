# Ekushey Multilingual Keyboard — Language Pack Repository

This folder is a **self-contained, upload-ready GitHub repository** that hosts the
downloadable language packs and the trusted catalog consumed by the Android app.

```
language-pack-repository/
├── README.md
├── LICENSES/                 license texts for bundled reference data
├── catalog/
│   ├── languages.json        trusted catalog (all listed languages + status)
│   └── catalog-version.json  catalog version + counts
├── packs/<tag>/              one folder per AVAILABLE language
│   ├── manifest.json         metadata + per-file + pack SHA-256
│   ├── layout.json           letter layers
│   └── symbols.json          number / symbol layers
├── schemas/                  JSON Schemas for catalog, manifest, layout
├── scripts/                  reproducible generator + validator (Node.js)
│   ├── data/languages.js     master language metadata (264 languages)
│   ├── data/layouts.js       authored layouts for the available subset
│   ├── lib/pack.js           pack builder (hashes, manifests, catalog)
│   ├── generate.js           (re)build catalog + packs + app bundle
│   └── validate.js           verify every pack against the trusted catalog
├── tests/                    character-inventory + Unicode test
├── docs/                     COVERAGE.md, CHARACTER-INVENTORY.md, ATTRIBUTION.md
├── coverage-report.json      machine-readable coverage
└── .github/workflows/        CI: regenerate + validate on every push
```

## Rebuild everything (reproducible)

Requires Node.js 18+ (no third-party npm dependencies).

```bash
cd language-pack-repository
node scripts/generate.js            # rebuild catalog + packs + app asset bundle
node scripts/validate.js            # verify hashes, schema, RTL, Unicode  (exit 0 = OK)
node tests/character-inventory.js   # character inventory + Unicode assertions
```

`generate.js` also writes an offline-first bundle into the app
(`app/src/main/assets/catalog/` and `app/src/main/assets/packs/<default>`), so the
keyboard works before any download.

## Publish to GitHub

1. Create a **public** GitHub repository, e.g. `ekushey-language-packs`.
2. Copy the **contents of this folder** into that repository and push to `main`:
   ```bash
   git init && git add . && git commit -m "Language packs v1"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/ekushey-language-packs.git
   git push -u origin main
   ```
3. In the Android app, open
   `app/src/main/java/com/ekushey/bangla/keyboard/ml/RepoConfig.java` and set:
   ```java
   public static final String OWNER = "<YOUR_USERNAME>";
   public static final String REPO  = "ekushey-language-packs";
   ```
   Leave `USE_RELEASES = false` to serve files from the `main` branch (simple), or
   see below for immutable release assets (recommended for production).

### Recommended: immutable release assets

Raw branch URLs are **mutable** and not ideal as production assets. For a stable
release:

1. Set `USE_RELEASES = true` and `RELEASE_TAG = "catalog-v1"` in `RepoConfig.java`.
2. Create a GitHub Release tagged `catalog-v1`.
3. Upload `catalog/languages.json` as a release asset named `languages.json`, and
   each pack file as `<tag>__<file>` (e.g. `fr__manifest.json`, `fr__layout.json`,
   `fr__symbols.json`). A helper to rename pack files for upload:
   ```bash
   mkdir -p release && for d in packs/*/; do t=$(basename "$d"); \
     for f in "$d"*.json; do cp "$f" "release/${t}__$(basename "$f")"; done; done
   cp catalog/languages.json release/languages.json
   ```
   Then attach everything in `release/` to the release.

## Security / trust model

- The app downloads over **HTTPS only**.
- The trusted pack hash lives in `catalog/languages.json` (fetched independently
  of the pack). The app recomputes the hash from the downloaded files and
  compares it to that trusted value — it never trusts a hash supplied only by the
  downloaded pack.
- No tokens or secrets are needed or stored; packs are public.
- Packs are validated (schema + hashes + size caps + path safety) before being
  installed atomically into the app's private storage.
