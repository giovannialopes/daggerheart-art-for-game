import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { indexMapping, repairUpdate } from '../scripts/repair.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prefix = 'modules/daggerheart-art-complete/';
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'mappings/adversaries.json'), 'utf8'));
const aliases = JSON.parse(fs.readFileSync(path.join(root, 'mappings/legacy-paths.json'), 'utf8'));
const entries = Object.values(mapping['daggerheart.adversaries']);
assert.equal(entries.length, 264);
const check = src => {
  assert.ok(src.startsWith(prefix));
  assert.ok(fs.existsSync(path.join(root, src.slice(prefix.length))), src);
};
for (const art of entries) {
  for (const src of [art.actor, art.token.texture.src, art.dac.portrait, art.dac.circle, ...art.dac.variants]) check(src);
  assert.ok(!/\/[A-Za-z0-9]{16}\.(png|webp)$/.test(art.actor), art.dac.name);
}
const index = indexMapping(mapping, aliases);
for (const [oldPath, newPath] of Object.entries(aliases)) {
  check(oldPath); check(newPath);
  assert.equal(index.get(oldPath), index.get(newPath));
  const update = repairUpdate({ texture: { src: oldPath, scaleX: -2 } }, index,
    { mode: 'circle', rings: true, ringScale: 0.75 }, { placed: true });
  assert.ok(update);
  assert.equal(update['texture.scaleX'], -1);
  assert.equal(update['ring.enabled'], true);
  assert.equal(update['ring.subject.scale'], 0.75);
  check(update['texture.src']);
  assert.equal(update.width, undefined);
}
assert.equal(repairUpdate({ texture: { src: 'custom.webp' } }, index, {}), null);
console.log(`Verified ${entries.length} adversaries, ${Object.keys(aliases).length} legacy paths, circular token repair and preserved grid dimensions.`);
