import { MODULE_ID, MAPPING_PATH } from './art.js';
const prefix = `modules/${MODULE_ID}/environments/`;
const uuidPrefix = 'Compendium.daggerheart.environments.Actor.';

export function environmentImageUpdate(actor, entries) {
  if (actor.type !== 'environment') return null;
  const current = actor.img ?? '';
  if (current && !current.startsWith(prefix) && !current.startsWith('systems/daggerheart/assets/icons/') && current !== 'icons/svg/mystery-man.svg') return null;
  const uuid = actor._stats?.compendiumSource ?? actor.flags?.core?.sourceId;
  let art = typeof uuid === 'string' && uuid.startsWith(uuidPrefix) ? entries[uuid.slice(uuidPrefix.length)] : null;
  art ??= Object.values(entries).find(a => [a.environmentArt?.name, a.environmentArt?.localizedName].includes(actor.name));
  if (!art?.actor?.startsWith(prefix) || current === art.actor) return null;
  return { img: art.actor };
}

export async function updateEnvironmentArt() {
  if (!game.user.isGM) throw new Error('Execute como GM.');
  const mapping = await foundry.utils.fetchJsonWithTimeout(MAPPING_PATH);
  const entries = mapping['daggerheart.environments'] ?? {};
  let count = 0;
  for (const actor of game.actors) {
    const update = environmentImageUpdate(actor, entries);
    if (update) { await actor.update(update); count++; }
  }
  ui.notifications.info(`Art for Game: ${count} ambientes atualizados.`);
  return count;
}
