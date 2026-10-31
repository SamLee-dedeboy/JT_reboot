"""Print each sheet of an .xlsx (cached values) as rows; standard library only."""
import re
import sys
import zipfile
from xml.etree import ElementTree

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
z = zipfile.ZipFile(sys.argv[1])
want = sys.argv[2].lower() if len(sys.argv) > 2 else None
shared = []
if 'xl/sharedStrings.xml' in z.namelist():
    for si in ElementTree.fromstring(z.read('xl/sharedStrings.xml')).iter(f'{NS}si'):
        shared.append(''.join(t.text or '' for t in si.iter(f'{NS}t')))
book = ElementTree.fromstring(z.read('xl/workbook.xml'))
rels = ElementTree.fromstring(z.read('xl/_rels/workbook.xml.rels'))
target = {r.get('Id'): r.get('Target') for r in rels}
for sheet in book.iter(f'{NS}sheet'):
    name = sheet.get('name')
    print('#####', name)
    if want and want not in name.lower():
        continue
    path = 'xl/' + target[sheet.get(f'{R}id')].lstrip('/').replace('xl/', '')
    root = ElementTree.fromstring(z.read(path))
    for row in root.iter(f'{NS}row'):
        cells = []
        for c in row.iter(f'{NS}c'):
            v = c.find(f'{NS}v')
            if v is None:
                t = c.find(f'{NS}is')
                val = ''.join(x.text or '' for x in t.iter(f'{NS}t')) if t is not None else ''
            elif c.get('t') == 's':
                val = shared[int(v.text)]
            else:
                val = v.text
            if val not in ('', None):
                cells.append(f'{c.get("r")}={val}')
        if cells:
            print('  ' + ' | '.join(cells)[:400])
