export const MODULE_ID = "daggerheart-art-complete";
export const ASSET_PREFIX = `modules/${MODULE_ID}/adversaries/`;
export const MODES = Object.freeze({ CIRCLE: "circle", VARIANTS: "variants", PORTRAIT: "portrait" });

const isOurAsset = value => typeof value === "string" && value.startsWith(ASSET_PREFIX);

/** Select visual changes only. Missing art.token means core token mappings are disabled. */
export function selectTokenArt(art, { mode = MODES.VARIANTS, rings = true } = {}) {
  const metadata = art?.dac;
  if (metadata?.moduleId !== MODULE_ID || !isOurAsset(art?.token?.texture?.src)) return null;
  const portrait = isOurAsset(metadata.portrait) ? metadata.portrait : null;
  const circle = isOurAsset(metadata.circle) ? metadata.circle : null;
  const variants = (metadata.variants ?? []).filter(isOurAsset);
  let src;
  let randomImg = false;

  if (mode === MODES.PORTRAIT) src = portrait;
  else if (mode === MODES.VARIANTS) {
    if (variants.length > 1 && isOurAsset(metadata.variantPattern)) {
      src = metadata.variantPattern;
      randomImg = true;
    } else src = variants[0] ?? portrait;
  } else src = circle ?? portrait;

  src ??= art.token.texture.src;
  // The original circle files are circular crops, not baked-in token frames.
  return { src, randomImg, ringEnabled: !!rings };
}

/** Mutate only the image-related fields of a compendium source. Never persist documents. */
export function applyTokenArt(documentClass, source, art, options) {
  if (documentClass?.documentName !== "Actor") return false;
  const selected = selectTokenArt(art, options);
  if (!selected) return false;
  const token = source.prototypeToken ??= {};
  const texture = token.texture ??= {};
  texture.src = selected.src;
  texture.fit = "contain";
  token.randomImg = selected.randomImg;
  const ring = token.ring ??= {};
  ring.enabled = selected.ringEnabled;
  // Clear a previous mapped subject, which would otherwise hide the selected artwork.
  (ring.subject ??= {}).texture = null;
  return true;
}
