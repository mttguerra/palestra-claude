import 'reveal.js/reveal.css';

// Clash Display + Satoshi: self-hosted em public/fonts/ via @font-face em typography.css.
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/reveal-overrides.css';
import './styles/components.css';

import './components/slide-image.js';

import './blocks/b00-capa.js';
import './blocks/b01-uppercut.js';
import './blocks/b02-claude.js';
import './blocks/b03-claude-code.js';
import './blocks/b04-terminal.js';
import './blocks/b05-biblioteca.js';
import './blocks/b06-notion.js';
import './blocks/b07-agent.js';
import './blocks/b08-praticas.js';
import './blocks/b09-soul-voice.js';
import './blocks/b10-skills.js';
import './blocks/b11-filtro.js';
import './blocks/b12-aprende.js';
import './blocks/b13-xicoria.js';
import './blocks/b14-fechamento.js';

import Reveal from 'reveal.js';
import { revealConfig } from './reveal-config.js';
import { getHandlers, getBlockIdFromSection } from './animations/timelines.js';

async function loadBlocks() {
  const blockModules = import.meta.glob('./blocks/*.html', {
    query: '?raw',
    import: 'default',
    eager: true,
  });
  const root = document.getElementById('slides-root');

  const sorted = Object.entries(blockModules).sort(([a], [b]) => a.localeCompare(b));
  for (const [, html] of sorted) {
    const section = document.createElement('section');
    section.innerHTML = html;
    root.appendChild(section);
  }
}

async function bootstrap() {
  await loadBlocks();
  const deck = new Reveal(revealConfig);
  await deck.initialize();
  if (import.meta.env.DEV) window.__deck = deck;

  deck.on('slidechanged', (event) => {
    const id = getBlockIdFromSection(event.currentSlide);
    if (!id) return;
    const handlers = getHandlers(id);
    if (handlers?.onShow) handlers.onShow(event.currentSlide);

    const prevId = getBlockIdFromSection(event.previousSlide);
    if (prevId) {
      const prev = getHandlers(prevId);
      if (prev?.onHide) prev.onHide(event.previousSlide);
    }
  });

  deck.on('fragmentshown', (event) => {
    const section = event.fragment.closest('section');
    const id = getBlockIdFromSection(section);
    if (!id) return;
    const handlers = getHandlers(id);
    if (handlers?.onFragmentShown) handlers.onFragmentShown(event);
  });

  deck.on('fragmenthidden', (event) => {
    const section = event.fragment.closest('section');
    const id = getBlockIdFromSection(section);
    if (!id) return;
    const handlers = getHandlers(id);
    if (handlers?.onFragmentHidden) handlers.onFragmentHidden(event);
  });

  // Dispara onShow do primeiro slide manualmente (porque slidechanged não dispara no boot)
  const first = deck.getCurrentSlide();
  const firstId = getBlockIdFromSection(first);
  if (firstId) {
    const handlers = getHandlers(firstId);
    if (handlers?.onShow) handlers.onShow(first);
  }
}

bootstrap().catch((err) => {
  console.error('deck boot failed', err);
  document.body.replaceChildren();
  const pre = document.createElement('pre');
  pre.style.cssText = 'padding:2rem;color:#F5F2EC;background:#0F0F0E;font-family:monospace;white-space:pre-wrap';
  pre.textContent = 'Falha ao carregar deck. Abra o console (F12) para detalhes.\n\n' + (err?.stack || String(err));
  document.body.appendChild(pre);
});
