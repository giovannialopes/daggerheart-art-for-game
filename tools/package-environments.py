from pathlib import Path
import json
import hashlib
import zipfile
import subprocess

root = Path(__file__).resolve().parent.parent
subprocess.run(['node', 'tools/verify-art.mjs'], cwd=root, check=True)
subprocess.run(['node', 'tools/test-environments.mjs'], cwd=root, check=True)
subprocess.run(['python', 'tools/verify-environments.py'], cwd=root, check=True)
manifest = json.loads((root/'module.json').read_text(encoding='utf-8'))
target = root/'dist'/f"daggerheart-art-for-game-{manifest['version']}.zip"
target.parent.mkdir(exist_ok=True)
files = [root/n for n in ['module.json','README.md','CREDITS.md','coverage.json','environments-coverage.json','galeria.html','galeria-ambientes.html']]
for folder in ['scripts','mappings','adversaries','environments']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file())
with zipfile.ZipFile(target, 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=3) as archive:
    for file in files: archive.write(file, f"{manifest['id']}/{file.relative_to(root).as_posix()}")
with zipfile.ZipFile(target) as archive:
    assert archive.testzip() is None
    assert len(archive.infolist()) == len(files)
with target.open('rb') as stream: digest = hashlib.file_digest(stream,'sha256').hexdigest()
target.with_suffix('.zip.sha256').write_text(f'{digest}  {target.name}\n',encoding='utf-8')
print(json.dumps({'path':str(target),'files':len(files),'bytes':target.stat().st_size,'sha256':digest}))
