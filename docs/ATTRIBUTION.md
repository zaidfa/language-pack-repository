# Data Sources & Attribution

## Language metadata (names, scripts, directions)

Language identifiers follow **BCP 47**; script codes follow **ISO 15924**; script
direction and native names cross-check against the **Unicode CLDR** project.

- Unicode CLDR — <https://cldr.unicode.org/> — Unicode License (permissive;
  redistribution permitted with notice). See `../LICENSES/UNICODE-LICENSE.txt`.
- ISO 639 language codes and ISO 15924 script codes — public registries
  maintained by the ISO registration authorities (code lists are facts, not
  copyrightable).

Only short, factual metadata (codes, endonyms, script, direction) is used. No
bulk CLDR data files are redistributed in this repository.

## Keyboard layouts

The authored layouts in `scripts/data/layouts.js` are **original arrangements**
written for this project, informed by widely documented, non-proprietary national
keyboard conventions (e.g. QWERTY/AZERTY/QWERTZ, Russian ЙЦУКЕН, standard Arabic
and Hebrew layouts, InScript-style Indic key groupings). No proprietary or
commercial keyboard layout files or dictionaries were copied.

## Dictionaries / predictions

No third-party dictionaries are bundled. Pack `features.dictionary` is `false`
everywhere until a properly licensed word list is added for a given language
(see `../docs/COVERAGE.md`).

## How to add a new data source

Before integrating any dataset, record here: the source URL, its license, whether
redistribution is permitted, the required attribution, and the dataset version.
Do not assume an open-source tool makes its bundled data redistributable.
