import { MODULE_ID, MODES, applyTokenArt } from "./art.js";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "tokenMode", {
    name: "Estilo dos tokens",
    hint: "Circular usa o recorte circular quando disponível. Variantes alterna as artes existentes. Retrato usa a imagem da ficha. As novas artes usam a ilustração individual em todos os modos.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [MODES.CIRCLE]: "Circular",
      [MODES.VARIANTS]: "Variantes de corpo inteiro",
      [MODES.PORTRAIT]: "Retrato"
    },
    default: MODES.VARIANTS,
    requiresReload: true
  });
  game.settings.register(MODULE_ID, "dynamicRings", {
    name: "Anéis dinâmicos",
    hint: "Usa os anéis nativos do Foundry com as artes selecionadas. Desative para exibir somente a ilustração transparente, sem anel.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true
  });
});

Hooks.on("applyCompendiumArt", (documentClass, source, _pack, art) => {
  applyTokenArt(documentClass, source, art, {
    mode: game.settings.get(MODULE_ID, "tokenMode"),
    rings: game.settings.get(MODULE_ID, "dynamicRings")
  });
});

Hooks.once("ready", () => {
  if (game.user.isGM && game.modules.get("art-for-daggerheart")?.active) {
    ui.notifications.warn(
      "Daggerheart - Artes Completas: desative Art for Daggerheart em Gerenciar Módulos e recarregue o mundo. Ele também altera as imagens e o tamanho dos tokens.",
      { permanent: true }
    );
  }
});
