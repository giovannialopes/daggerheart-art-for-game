import assert from 'node:assert/strict';
import { ASSET_PREFIX, MODULE_ID, selectTokenArt, tokenArtChanges } from '../scripts/art.js';
import { indexMapping, repairUpdate } from '../scripts/repair.js';
const portrait = ASSET_PREFIX + 'generated/Wyvern.png';
const left = ASSET_PREFIX + 'generated/Wyvern - Left.png';
const circle = ASSET_PREFIX + 'circle/Wyvern.png';
const art = { token: { texture: { src: circle } }, dac: {
  moduleId: MODULE_ID, portrait, leftPortrait: left, circle,
  variants: [portrait, left], variantPattern: ASSET_PREFIX + 'generated/Wyvern*.png'
} };
for (const mode of ['circle', 'portrait', 'variants']) {
  for (const facing of ['left', 'right']) {
    const selected = selectTokenArt(art, { mode, facing });
    assert.equal(selected.randomImg, false);
    assert.equal(selected.src, mode === 'circle' ? circle : facing === 'left' ? left : portrait);
    const update = tokenArtChanges(selected, { texture: { scaleX: -1, scaleY: -1 } });
    assert.equal(update['texture.scaleX'], mode === 'circle' && facing === 'left' ? -1 : 1);
    assert.equal(update['texture.scaleY'], -1);
    assert.equal(update.width, undefined);
  }
}
const random = selectTokenArt(art, { mode: 'variants' });
assert.equal(random.randomImg, true);
const index = indexMapping({ pack: { id: art } });
const placed = repairUpdate({ texture: { src: left } }, index, { mode: 'variants' }, { placed: true });
assert.equal(placed['texture.src'], left);
assert.equal(placed.randomImg, false);
const ordinary = structuredClone(art);
delete ordinary.dac.leftPortrait;
assert.equal(selectTokenArt(ordinary, { facing: 'left' }).scaleX, undefined);
console.log('Facing verified in all three token modes; ordinary art and grid dimensions preserved.');
