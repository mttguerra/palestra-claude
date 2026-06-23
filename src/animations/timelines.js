// Cada bloco registra suas timelines aqui.
//
// Convenção: registry[blockId] = {
//   onShow(section)              — disparado ao entrar no slide
//   onHide(section)              — disparado ao sair do slide. USE pra .kill() tweens contínuos (glowLoop, pulse infinito, delayedCall agendado).
//   onFragmentShown(event)       — disparado ao avançar fragmento
//   onFragmentHidden(event)      — disparado ao voltar fragmento
// }
//
// Sem cleanup em onHide, tweens infinitos sobrevivem entre slides e duplicam ao reentrar.

const registry = new Map();

export function registerBlock(blockId, handlers) {
  registry.set(blockId, handlers);
}

export function getHandlers(blockId) {
  return registry.get(blockId) || null;
}

export function getBlockIdFromSection(section) {
  return section?.dataset?.block || null;
}
