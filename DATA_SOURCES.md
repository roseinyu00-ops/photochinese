# PhotoChinese: sources and data quality

This file records which sources currently power character cards and how their data must be presented.

## Character structure: Make Me a Hanzi

- Project: https://github.com/skishore/makemeahanzi
- Data used by the site: `dictionary.txt`, loaded at runtime from the upstream repository.
- Coverage stated by the project: more than 9,000 common simplified and traditional Chinese characters.
- Fields used by PhotoChinese: character, learner definition, pinyin, IDS decomposition, etymology annotation and primary radical.
- License: GNU LGPL v3 or later for `dictionary.txt`. The upstream `COPYING` file distinguishes this from `graphics.txt`, which has a separate Arphic Public License.
- Important limitation: etymology may be null. A decomposition or mnemonic is not proof of historical origin.
- Stroke graphics are loaded through Hanzi Writer (`hanzi-writer-data`), which uses the Make Me a Hanzi stroke data. The Hanzi Writer library is MIT-licensed; the character stroke data has a separate Arphic Public License.

## Dictionary cross-check: MDBG / CC-CEDICT

- Lookup: https://www.mdbg.net/chinese/dictionary
- CC-CEDICT project and download information: https://cc-cedict.org/editor/editor.php?handler=Download
- License: CC BY-SA 4.0.
- Current use: verified reference for editorial checks; the learner-facing card no longer displays a technical source list. CC-CEDICT is not yet bundled as a local dictionary in this version.
- The current CC-CEDICT release is published by MDBG and maintained by its contributors. The project states the CC BY-SA 4.0 terms and requires attribution and ShareAlike for redistributed adaptations.
- Any future import must preserve attribution to MDBG, CC-CEDICT editors and contributors, and comply with ShareAlike requirements.

## Character-specific verification and examples

- Example entry `狗`: verified against Dong Chinese, which identifies 犭 as the meaning component and 句 as the sound component, and records the historical phonetic relationship; see https://www.dong-chinese.com/dictionary/狗.
- `狗` has 8 strokes; cross-check: HanziFun character entry and Hanzi Writer / Make Me a Hanzi stroke data.
- Example usage sentences and words are added only when checked against a dictionary or corpus. For `狗`, the examples `小狗` and the sentences `他家里养了一只小狗。` / `小狗的鼻子很灵。` are based on the Dong Chinese entry: https://www.dong-chinese.com/dictionary/狗.
- This is an initial curated entry, not a claim that all 9,000+ cards are already fully enriched.

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
5. Keep source provenance in project documentation and data metadata. In the learner-facing card, avoid technical source notes; show a concise, natural message only when a useful field is genuinely unavailable.
6. Keep simplified and traditional glyphs available as separate searchable character records when the upstream dataset provides them.
7. Prefer the Make Me a Hanzi `matches` stroke mapping for immediate stroke counts when available; load Hanzi Writer stroke paths separately for the visual sequence so a slow animation asset does not delay the count.

## Next enrichment priorities

- Import a versioned, license-compliant dictionary layer with explicit per-entry provenance.
- Add reliable example sentences with their original authors/source attribution and translations.
- Expand Russian gloss coverage beyond the current HSK vocabulary file.
- Add a repeatable coverage report for all Make Me a Hanzi records: meanings, readings, decomposition, radical, etymology, stroke count, examples and source links.
