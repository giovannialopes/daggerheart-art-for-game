import { MODULE_ID, MODES, DEFAULT_RING_SCALE, applyTokenArt } from "./art.js";
import { fixTokenFraming } from "./repair.js";

const currentOptions = () => ({
  mode: game.settings.get(MODULE_ID, "tokenMode"),
  rings: game.settings.get(MODULE_ID, "dynamicRings"),
  ringScale: game.settings.get(MODULE_ID, "ringScale"),
  facing: game.settings.get(MODULE_ID, "tokenFacing")
});

Hooks.once("init", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { fixTokenFraming: () => fixTokenFraming(currentOptions()) };
  game.settings.register(MODULE_ID, "tokenFacing", {
    name: "Direção dos dragões revisados",
    hint: "Esquerda ou direita fixa a direção nos cinco adversários revisados. Original mantém o espelhamento atual e permite alternar lados no estilo Variantes.",
    scope: "world", config: true, type: String,
    choices: { original: "Original / variantes", left: "Esquerda", right: "Direita" },
    default: "original", requiresReload: true
  });
  game.settings.register(MODULE_ID, "tokenMode", {
    name: "Estilo dos tokens",
    hint: "Circular usa o recorte redondo de cada adversário e é o único estilo com anel. Variantes alterna as artes de corpo inteiro, sem anel. Retrato usa a imagem da ficha, sem anel.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [MODES.CIRCLE]: "Circular",
      [MODES.VARIANTS]: "Variantes de corpo inteiro",
      [MODES.PORTRAIT]: "Retrato"
    },
    default: MODES.CIRCLE,
    requiresReload: true
  });
  game.settings.register(MODULE_ID, "dynamicRings", {
    name: "Anéis dinâmicos",
    hint: "Coloca o anel nativo do Foundry em volta dos tokens circulares. Desative para exibir só o recorte redondo.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true
  });
  game.settings.register(MODULE_ID, "ringScale", {
    name: "Tamanho da arte dentro do anel",
    hint: "Diminua se a borda da arte aparecer fora do anel; aumente se sobrar fundo entre a arte e o anel.",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0.5, max: 1, step: 0.05 },
    default: DEFAULT_RING_SCALE,
    requiresReload: true
  });
});

Hooks.on("applyCompendiumArt", (documentClass, source, _pack, art) => {
  applyTokenArt(documentClass, source, art, currentOptions());
});

Hooks.once("ready", () => {
  if (game.user.isGM && game.modules.get("art-for-daggerheart")?.active) {
    ui.notifications.warn(
      "Daggerheart - Art for Game: desative Art for Daggerheart em Gerenciar Módulos e recarregue o mundo. Ele também altera as imagens e o tamanho dos tokens.",
      { permanent: true }
    );
  }
});
