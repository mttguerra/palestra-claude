// Cada bloco registra suas timelines aqui.
// Convenção: registry[blockId] = { onShow(section), onHide(section), onFragmentShown(event), onFragmentHidden(event) }

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
