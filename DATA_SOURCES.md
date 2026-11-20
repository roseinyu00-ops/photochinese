# PhotoChinese: sources and data quality

This file records which sources currently power character cards and how their data must be presented.

## Character structure: Make Me a Hanzi

- Project: https://github.com/skishore/makemeahanzi
- Data used by the site: `dictionary.txt`, loaded at runtime from the upstream repository.
- Coverage stated by the project: more than 9,000 common simplified and traditional Chinese characters.
- Fields used by PhotoChinese: character, learner definition, pinyin, IDS decomposition, etymology annotation and primary radical.
- License: GNU LGPL v3 or later for `dictionary.txt`. The upstream `COPYING` file distinguishes this from `graphics.txt`, which has a separate Arphic Public License.
- Important limitation: etymology may be null. A decomposition or mnemonic is not proof of historical origin.

## Dictionary cross-check: MDBG / CC-CEDICT

- Lookup: https://www.mdbg.net/chinese/dictionary
- CC-CEDICT project and download information: https://cc-cedict.org/editor/editor.php?handler=Download
- License: CC BY-SA 4.0.
- Current use: character-specific external lookup link only. CC-CEDICT is not yet bundled as a local dictionary in this version.
- Any future import must preserve attribution to MDBG, CC-CEDICT editors and contributors, and comply with ShareAlike requirements.

## Character properties: Unicode Unihan

- Official lookup: https://unicode.org/charts/unihan.html
- Documentation: https://www.unicode.org/reports/tr38/
- Current use: external verification link. Unihan is not yet imported as a separate local data file.

## HSK vocabulary and Russian meanings

- Current local file: `hsk_uz_ru.csv`.
- It supplies Russian word meanings, pinyin, HSK fields and frequency rank where present.
- Character cards may show the lowest HSK level among words containing a character when the character itself has no direct HSK row. The interface labels this as a word-derived level, not as an official character level.
- The original provenance and license of this CSV still need to be recorded. Until confirmed, do not claim it is an official HSK publication.

## PhotoChinese data-quality rules

1. Never invent a Russian translation, part of speech, synonym, usage example or historical etymology when a source does not provide one.
2. Keep word compounds separate from true synonyms.
3. Label English-only definitions as English; do not present them as Russian translations.
4. Keep historical etymology separate from memory aids. A mnemonic is a learning device, not a historical claim.
5. Show the source or a clear limitation when a field is missing.
6. Keep simplified and traditional glyphs available as separate searchable character records when the upstream dataset provides them.

## Next enrichment priorities

- Import a versioned, license-compliant dictionary layer with explicit per-entry provenance.
- Add reliable example sentences with their original authors/source attribution and translations.
- Expand Russian gloss coverage beyond the current HSK vocabulary file.
- Add a repeatable coverage report for all Make Me a Hanzi records: meanings, readings, decomposition, radical, etymology, stroke count, examples and source links.
