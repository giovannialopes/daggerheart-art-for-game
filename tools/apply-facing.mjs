import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const write = (name, data) => fs.writeFileSync(path.join(root, name), JSON.stringify(data, null, 2) + '\n');
const mapping = read('mappings/adversaries.json');
const coverage = read('coverage.json');
const records = read('art-review/left-facing.json');
for (const record of records) {
  const relative = `adversaries/generated/${record.name} - Left.png`;
  fs.copyFileSync(record.source, path.join(root, relative));
  const art = Object.values(mapping['daggerheart.adversaries']).find(a => a.dac.name === record.name);
  assert.ok(art);
  art.dac.leftPortrait = `modules/daggerheart-art-complete/${relative}`;
  art.dac.variants = [art.dac.portrait, art.dac.leftPortrait];
  art.dac.variantPattern = art.dac.portrait.replace(/\.png$/, '*.png');
  const matches = fs.readdirSync(path.join(root, 'adversaries/generated')).filter(f => f.startsWith(record.name) && f.endsWith('.png')).sort();
  assert.deepEqual(matches, [`${record.name}.png`, `${record.name} - Left.png`].sort());
  coverage.adversaries.find(a => a.name === record.name).variants = 2;
}
write('mappings/adversaries.json', mapping);
write('coverage.json', coverage);
const manifest = read('module.json');
manifest.version = '1.2.1';
write('module.json', manifest);
console.log(`Added left-facing variants for ${records.length} adversaries.`);
