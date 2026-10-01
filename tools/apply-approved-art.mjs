import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prefix = 'modules/daggerheart-art-complete/';
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const write = (p, v) => fs.writeFileSync(path.join(root, p), JSON.stringify(v, null, 2) + '\n');
const mapping = read('mappings/adversaries.json');
const aliases = read('mappings/legacy-paths.json');
const coverage = read('coverage.json');
const records = read('art-review/approved-art.json');
for (const record of records) {
  const art = Object.values(mapping['daggerheart.adversaries']).find(a => a.dac.name === record.name);
  if (!art) throw new Error(record.name);
  const portrait = `adversaries/generated/${record.name}.png`;
  const circle = `adversaries/circle/${record.name}.png`;
  fs.copyFileSync(record.portrait.source, path.join(root, portrait));
  fs.copyFileSync(record.circle.source, path.join(root, circle));
  const oldCircle = art.dac.circle;
  const newCircle = prefix + circle;
  for (const [key, value] of Object.entries(aliases)) if (value === oldCircle) aliases[key] = newCircle;
  if (oldCircle !== newCircle) aliases[oldCircle] = newCircle;
  art.actor = art.dac.portrait = prefix + portrait;
  art.token.texture.src = art.dac.circle = newCircle;
  art.dac.variants = [art.actor];
  art.dac.variantPattern = null;
  art.dac.artRevision = 'animation-wyvern-reference-2026-10-01';
  const row = coverage.adversaries.find(a => a.name === record.name);
  row.portrait = art.actor;
  row.circle = newCircle;
  // Named paths and historic aliases display the same approved art in existing worlds.
  for (const [oldPath, newPath] of Object.entries(aliases)) {
    if (newPath === art.actor && oldPath.endsWith('.png'))
      fs.copyFileSync(record.portrait.source, path.join(root, oldPath.slice(prefix.length)));
  }
}
write('mappings/adversaries.json', mapping);
write('mappings/legacy-paths.json', aliases);
write('coverage.json', coverage);
const manifest = read('module.json');
manifest.version = '1.2.0';
write('module.json', manifest);
console.log(`Applied ${records.length} approved-style portraits and circular tokens.`);
