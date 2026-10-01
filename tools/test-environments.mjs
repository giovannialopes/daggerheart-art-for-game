import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { environmentImageUpdate } from '../scripts/environments.js';
import { applyTokenArt, MODULE_ID } from '../scripts/art.js';

const id = '1234567890abcdef';
const packId = 'daggerheart.environments';
const uuid = `Compendium.${packId}.Actor.${id}`;
const url = `modules/${MODULE_ID}/environments/Local Tavern.png`;
const art = { actor: url, environmentArt: { name: 'Local Tavern', localizedName: 'Taverna Local' } };
const entries = { [id]: art };
const actor = { type: 'environment', name: 'Renamed', img: 'systems/daggerheart/assets/icons/documents/actors/forest.svg', _stats: { compendiumSource: uuid }, prototypeToken: { texture: { src: 'token.svg' } }, system: { tier: 2 } };
assert.deepEqual(environmentImageUpdate(actor, entries), { img: url });
assert.deepEqual(environmentImageUpdate({ ...actor, _stats: {}, name: 'Taverna Local' }, entries), { img: url });
assert.equal(environmentImageUpdate({ ...actor, img: 'worlds/custom/my-landscape.webp' }, entries), null);
assert.equal(environmentImageUpdate({ ...actor, type: 'adversary' }, entries), null);
assert.equal(environmentImageUpdate({ ...actor, img: url }, entries), null);

const corePath = 'D:/Foundry - Original/Foundry Virtual Tabletop/resources/app/client/helpers/media/compendium-art.mjs';
const core = fs.readFileSync(corePath, 'utf8').replace(/^import .*;\r?\n/gm, '').replace('export default class CompendiumArt', 'class CompendiumArt');
for (const portraits of [false, true]) for (const tokens of [false, true]) {
  const entry = { uuid, img: 'original.svg' };
  const game = { settings: { get: () => ({ [MODULE_ID]: { portraits, tokens } }) }, packs: new Map([[packId, { documentName: 'Actor', getUuid: () => uuid }]]) };
  const mergeObject = (target, incoming) => { for (const [k,v] of Object.entries(incoming)) { if (v && typeof v === 'object') mergeObject(target[k] ??= {}, v); else target[k]=v; } return target; };
  const context = { game, foundry: { utils: { mergeObject, fetchJsonWithTimeout: async () => ({ [packId]: { [id]: structuredClone(art) } }) } }, fromUuidSync: () => entry,
    Hooks: { callAll: (_event, cls, source, _pack, info) => applyTokenArt(cls, source, info), onError: (_event, error) => { throw error; } } };
  const Native = vm.runInNewContext(core+'\nCompendiumArt', context);
  const registry = new Native();
  game.compendiumArt = registry;
  registry.getPackages = () => [{ packageId: MODULE_ID, mapping: 'fixture' }];
  await registry._registerArt();
  const source = { ...structuredClone(actor), _id: id };
  const before = structuredClone(source);
  registry.applyArt({ documentName: 'Actor' }, source, packId);
  assert.equal(source.img, portraits ? url : before.img);
  assert.deepEqual(source.prototypeToken, before.prototypeToken);
  assert.deepEqual(source.system, before.system);
}
console.log('Environment portrait integration verified against installed Foundry core in all four portrait/token preference combinations; custom images and token data preserved.');
