"""Extract the text of each "Story Behind the Criterion" report for the criteria copy editor.

Reads each .docx (standard library only), keeps headings, paragraphs, list items, and
tables in order, and writes editorial/criteria-sources/<criterion>.json. The editor at
/pages/criteria-copy shows these passages beside each section, so Claude, GPT, and the
user can check drafts against the report. Rerun when a report is updated:

    python scripts/extract-criterion-reports.py
"""

import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
TARGET = Path('editorial/criteria-sources')

# The report each criterion page was condensed from. Update a path when a team sends a new version.
REPORTS = {
    'ecology': 'tmp/pdfs/Ecology/Copy of ECOLOGY_ The Story Behind the Criterion.docx',
    'environmental-justice': 'tmp/pdfs/EJ and vulnerable communities/Environmental Justice_ The Story Behind the Criterion.docx',
    'ecocultural-restoration': 'tmp/pdfs/Eco-cultural/Eco-cultural Restoration and Indigenous Sovereignty_ The Story Behind the Criterion.docx',
    'recreation': 'tmp/pdfs/Recreation/Copy of Recreation_ The Story Behind the Criterion.docx',
    'economy': 'tmp/pdfs/Economy/Economic_Analysis__ The Story Behind the Criterion.docx',
}


def text_of(element) -> str:
    parts = []
    for node in element.iter():
        if node.tag == f'{W}t' and node.text:
            parts.append(node.text)
        elif node.tag in (f'{W}tab',):
            parts.append(' ')
        elif node.tag in (f'{W}br', f'{W}cr'):
            parts.append('\n')
    return re.sub(r'[ \t]+', ' ', ''.join(parts)).strip()


def heading_level(paragraph, styles: dict) -> int | None:
    style = paragraph.find(f'{W}pPr/{W}pStyle')
    name = styles.get(style.get(f'{W}val'), '') if style is not None else ''
    if name.lower() == 'title':
        return 1
    match = re.match(r'heading\s*(\d)', name.lower())
    return int(match.group(1)) if match else None


def read_styles(archive: zipfile.ZipFile) -> dict:
    try:
        root = ElementTree.fromstring(archive.read('word/styles.xml'))
    except KeyError:
        return {}
    styles = {}
    for style in root.iter(f'{W}style'):
        name = style.find(f'{W}name')
        styles[style.get(f'{W}styleId')] = name.get(f'{W}val') if name is not None else ''
    return styles


def extract(path: Path) -> list[dict]:
    with zipfile.ZipFile(path) as archive:
        styles = read_styles(archive)
        body = ElementTree.fromstring(archive.read('word/document.xml')).find(f'{W}body')
    blocks = []
    for element in body:
        if element.tag == f'{W}p':
            text = text_of(element)
            if not text:
                continue
            level = heading_level(element, styles)
            # The Economy report (v18) lost the Heading 1 style on its first chapter title.
            if not level and re.match(r'what is the criterion\b', text, re.I):
                level = 1
            # ...and types its bullets as a Wingdings "l" instead of list formatting.
            typed_bullet = re.match(r'[l•▪]\s+(?=\S)', text)
            if level:
                blocks.append({'type': 'heading', 'level': level, 'text': text})
            elif element.find(f'{W}pPr/{W}numPr') is not None:
                blocks.append({'type': 'item', 'text': text})
            elif typed_bullet:
                blocks.append({'type': 'item', 'text': text[typed_bullet.end():]})
            else:
                blocks.append({'type': 'paragraph', 'text': text})
        elif element.tag == f'{W}tbl':
            rows = [
                [text_of(cell) for cell in row.findall(f'{W}tc')]
                for row in element.findall(f'{W}tr')
            ]
            if any(any(cell for cell in row) for row in rows):
                blocks.append({'type': 'table', 'rows': rows})
    return blocks


def chapters(blocks: list[dict]) -> list[dict]:
    """Split at top-level headings; each chapter keeps its heading and everything under it."""
    out: list[dict] = []
    for block in blocks:
        if block['type'] == 'heading' and block['level'] == 1:
            out.append({'title': block['text'], 'blocks': [block]})
        elif out:
            out[-1]['blocks'].append(block)
    return out


def without_subsections(blocks: list[dict], pattern: str) -> list[dict]:
    """Drops each subsection whose heading matches, down to the next heading at its level or above."""
    kept, skip_level = [], None
    for block in blocks:
        if block['type'] == 'heading':
            if skip_level is not None and block['level'] <= skip_level:
                skip_level = None
            if skip_level is None and block['level'] > 1 and re.match(pattern, block['text'], re.I):
                skip_level = block['level']
        if skip_level is None:
            kept.append(block)
    return kept


def subsections(blocks: list[dict], pattern: str) -> list[dict]:
    """Keeps only subsections whose heading matches, each with the chapter heading it sits in."""
    kept, keep_level, chapter = [], None, None
    for block in blocks:
        if block['type'] == 'heading':
            if block['level'] == 1:
                chapter = block
            if keep_level is not None and block['level'] <= keep_level:
                keep_level = None
            if keep_level is None and block['level'] > 1 and re.match(pattern, block['text'], re.I):
                keep_level = block['level']
                if chapter and chapter not in kept:
                    kept.append(chapter)
        if keep_level is not None:
            kept.append(block)
    return kept


# Report chapters behind each editor section (ids match src/internal/criteria-copy/fields.ts).
# Scenario results are left out: the criterion pages describe the criterion, not its findings.
RESULTS = r'(results|adaptation scenario|tiered outflow|comparative|seasonal|overall)'
LOCATIONS = r'(location of measurement|measurement locations)'


def by_section(blocks: list[dict]) -> dict:
    parts = chapters(blocks)

    def pick(pattern: str) -> list[dict]:
        return [b for c in parts if re.match(pattern, c['title'], re.I) for b in c['blocks']]

    what, why = pick(r'what is the criterion'), pick(r'why does this criterion')
    metrics = pick(r'(what are the components|what are the metrics|metric)')
    return {
        'summary': what + why,
        'what': what,
        'why': why,
        'regions': pick(r'subregional map') + subsections(metrics, LOCATIONS),
        'components': without_subsections(without_subsections(metrics, RESULTS), LOCATIONS),
        'construction': pick(r'how was this criterion'),
        'references': pick(r'references'),
    }


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    for criterion, report in REPORTS.items():
        path = Path(report)
        if not path.exists():
            print(f'{criterion}: missing {report}', file=sys.stderr)
            continue
        blocks = extract(path)
        out = TARGET / f'{criterion}.json'
        out.write_text(
            json.dumps({'report': path.name, 'sections': by_section(blocks)}, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )
        headings = sum(block['type'] == 'heading' for block in blocks)
        print(f'{criterion}: {len(blocks)} blocks, {headings} headings')


if __name__ == '__main__':
    main()
