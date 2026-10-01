import { MAPPING_PATH, isOurAsset, selectTokenArt, tokenArtChanges } from "./art.js";

/** Index every image of the mapping by path, so a token can be traced back to its adversary. */
export function indexMapping(mapping, aliases = {}) {
  const index = new Map();
  for (const entries of Object.values(mapping ?? {})) {
    for (const art of Object.values(entries)) {
      const { portrait, circle, variants = [], variantPattern } = art.dac ?? {};
      for (const src of [portrait, circle, variantPattern, art.token?.texture?.src, ...variants]) {
        if (isOurAsset(src)) index.set(src, art);
      }
    }
  }
  for (const [oldPath, newPath] of Object.entries(aliases)) {
    if (isOurAsset(oldPath) && index.has(newPath)) index.set(oldPath, index.get(newPath));
  }
  return index;
}

/** Update data for one token or prototype token, or null when it does not use this module's art. */
export function repairUpdate(token, index, options, { placed = false, prefix = "" } = {}) {
  const src = token?.texture?.src;
  if (!isOurAsset(src)) return null;
  const art = index.get(src);
  const selected = art ? selectTokenArt(art, options) : null;
  if (!selected) return null;
  // A placed token needs a concrete file; keep its current variant when it already is one.
  if (placed && selected.randomImg) {
    const variants = art.dac.variants.filter(isOurAsset);
    selected.src = variants.includes(src) ? src : variants[Math.floor(Math.random() * variants.length)];
    selected.randomImg = false;
  }
  const changes = tokenArtChanges(selected, token, options.ringScale);
  return Object.fromEntries(Object.entries(changes).map(([key, value]) => [prefix + key, value]));
}

/** Reapply the module's token art to world actors and to tokens in every scene. */
export async function fixTokenFraming(options) {
  if (!game.user.isGM) throw new Error("Execute a correção como GM.");
  const [mapping, aliases] = await Promise.all([
    foundry.utils.fetchJsonWithTimeout(MAPPING_PATH),
    foundry.utils.fetchJsonWithTimeout(MAPPING_PATH.replace('adversaries.json', 'legacy-paths.json'))
  ]);
  const index = indexMapping(mapping, aliases);
  let actors = 0, tokens = 0;
  for (const actor of game.actors) {
    const update = repairUpdate(actor.prototypeToken, index, options, { prefix: "prototypeToken." });
    const portrait = index.get(actor.img)?.dac?.portrait;
    if (!update && !portrait) continue;
    await actor.update({ ...(update ?? {}), ...(portrait ? { img: portrait } : {}) });
    actors++;
  }
  for (const scene of game.scenes) {
    const updates = [];
    for (const token of scene.tokens) {
      const update = repairUpdate(token, index, options, { placed: true });
      if (update) updates.push({ _id: token.id, ...update });
    }
    if (updates.length) await scene.updateEmbeddedDocuments("Token", updates);
    tokens += updates.length;
  }
  ui.notifications.info(`Art for Game: ${actors} atores e ${tokens} tokens atualizados.`);
  return { actors, tokens };
}
