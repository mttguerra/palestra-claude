import 'reveal.js/reveal.css';

// Clash Display + Satoshi: self-hosted em public/fonts/ via @font-face em typography.css.
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/reveal-overrides.css';

import Reveal from 'reveal.js';
import { revealConfig } from './reveal-config.js';

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
}

bootstrap();
