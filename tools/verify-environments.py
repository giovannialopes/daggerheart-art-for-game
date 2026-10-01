from pathlib import Path
from PIL import Image
import json
import hashlib

root = Path(__file__).resolve().parent.parent
catalog = json.loads((root/'generation/environments/catalog.json').read_text(encoding='utf-8'))
mapping = json.loads((root/'mappings/adversaries.json').read_text(encoding='utf-8'))['daggerheart.environments']
assert len(catalog) == len(mapping) == 47
hashes = set()
report = []
for row in catalog:
    file = root/'environments'/row['filename']
    art = mapping[row['id']]
    assert art['actor'] == 'modules/daggerheart-art-complete/environments/'+row['filename']
    assert 'token' not in art
    with Image.open(file) as image:
        image.load()
        w, h = image.size
        assert w/h > 1.5 and w >= 1024
        if 'A' in image.getbands(): assert image.getchannel('A').getextrema() == (255, 255)
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    assert digest not in hashes
    hashes.add(digest)
    record = json.loads((root/'generation/environments/results'/(row['id']+'.json')).read_text(encoding='utf-8'))
    assert hashlib.sha256(Path(record['source']).read_bytes()).hexdigest() == digest
    report.append({'name': row['name'], 'size': [w,h], 'sha256': digest})
(root/'generation/environments/verification.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('47 unique, opaque landscape PNGs verified; mappings and generation sources match.')
