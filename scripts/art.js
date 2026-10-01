export const MODULE_ID = "daggerheart-art-complete";
export const ASSET_PREFIX = `modules/${MODULE_ID}/adversaries/`;
export const MAPPING_PATH = `modules/${MODULE_ID}/mappings/adversaries.json`;
export const MODES = Object.freeze({ CIRCLE: "circle", VARIANTS: "variants", PORTRAIT: "portrait" });
export const DEFAULT_RING_SCALE = 0.75;

export const isOurAsset = value => typeof value === "string" && value.startsWith(ASSET_PREFIX);

/**
 * Select visual changes only. Missing art.token means core token mappings are disabled.
 * Foundry draws the ring over the token without clipping it, so only the circular crops
 * fit inside a ring. Variants and portraits (landscape art, painted backgrounds) never get one.
 */
export function selectTokenArt(art, { mode = MODES.CIRCLE, rings = true, facing = "original" } = {}) {
  const metadata = art?.dac;
  if (metadata?.moduleId !== MODULE_ID || !isOurAsset(art?.token?.texture?.src)) return null;
  const portrait = isOurAsset(metadata.portrait) ? metadata.portrait : null;
  const circle = isOurAsset(metadata.circle) ? metadata.circle : null;
  const variants = (metadata.variants ?? []).filter(isOurAsset);
  let src;
  let randomImg = false;
  let ringEnabled = false;

  if (mode === MODES.PORTRAIT) src = portrait;
  else if (mode === MODES.VARIANTS) {
    if (variants.length > 1 && isOurAsset(metadata.variantPattern)) {
      src = metadata.variantPattern;
      randomImg = true;
    } else src = variants[0] ?? portrait;
  } else {
    src = circle ?? portrait;
    ringEnabled = !!rings && !!circle;
  }

  src ??= art.token.texture.src;
  if (isOurAsset(metadata.leftPortrait) && ["left", "right"].includes(facing)) {
    const mirroredCircle = mode === MODES.CIRCLE && !!circle;
    src = mirroredCircle ? circle : facing === "left" ? metadata.leftPortrait : portrait;
    return { src, randomImg: false, ringEnabled, scaleX: mirroredCircle && facing === "left" ? -1 : 1 };
  }
  return { src, randomImg, ringEnabled };
}

/** Image-related token fields for a selection, as a flat update or nested source data. */
export function tokenArtChanges(selected, previous = {}, ringScale = DEFAULT_RING_SCALE) {
  return {
    "texture.src": selected.src,
    "texture.fit": "contain",
    "texture.scaleX": selected.scaleX ?? (previous.texture?.scaleX < 0 ? -1 : 1),
    "texture.scaleY": previous.texture?.scaleY < 0 ? -1 : 1,
    randomImg: selected.randomImg,
    "ring.enabled": selected.ringEnabled,
    // Clear a previous mapped subject, which would otherwise hide the selected artwork.
    "ring.subject.texture": null,
    "ring.subject.scale": selected.ringEnabled ? ringScale : 1
  };
}

/** Mutate only the image-related fields of a compendium source. Never persist documents. */
export function applyTokenArt(documentClass, source, art, { ringScale, ...options } = {}) {
  if (documentClass?.documentName !== "Actor") return false;
  const selected = selectTokenArt(art, options);
  if (!selected) return false;
  const token = source.prototypeToken ??= {};
  for (const [path, value] of Object.entries(tokenArtChanges(selected, token, ringScale))) {
    const keys = path.split(".");
    const last = keys.pop();
    let target = token;
    for (const key of keys) target = target[key] ??= {};
    target[last] = value;
  }
  return true;
}
