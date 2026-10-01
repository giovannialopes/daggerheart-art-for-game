import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prefix = 'modules/daggerheart-art-complete/';
const mappingFile = path.join(root, 'mappings/adversaries.json');
const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
const replacements = new Map();
for (const [id, art] of Object.entries(mapping['daggerheart.adversaries'])) {
  const name = art.dac.name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim();
  for (const folder of ['generated', 'circle']) {
    const ext = folder === 'generated' ? '.png' : '.webp';
    const oldRelative = `adversaries/${folder}/${id}${ext}`;
    const newRelative = `adversaries/${folder}/${name}${ext}`;
    const oldFile = path.join(root, oldRelative);
    if (!fs.existsSync(oldFile)) continue;
    const newFile = path.join(root, newRelative);
    if (!fs.existsSync(newFile)) fs.copyFileSync(oldFile, newFile);
    replacements.set(oldRelative, newRelative);
  }
}
// Retain the previous filenames as compatibility aliases for existing worlds.
// New mappings and gallery links use readable names exclusively.
for (const file of ['mappings/adversaries.json', 'coverage.json', 'galeria.html']) {
  const target = path.join(root, file);
  let content = fs.readFileSync(target, 'utf8');
  for (const [oldPath, newPath] of replacements) content = content.split(oldPath).join(newPath);
  fs.writeFileSync(target, content);
}
const aliases = Object.fromEntries([...replacements].map(([a, b]) => [prefix + a, prefix + b]));
const aliasFile = path.join(root, 'mappings/legacy-paths.json');
if (fs.existsSync(aliasFile)) Object.assign(aliases, JSON.parse(fs.readFileSync(aliasFile, 'utf8')));
fs.writeFileSync(path.join(root, 'mappings/legacy-paths.json'), JSON.stringify(aliases, null, 2) + '\n');
console.log(`${replacements.size} assets now referenced by adversary name; existing world paths retained.`);
