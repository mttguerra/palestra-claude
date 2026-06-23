# Palestra IA Claude — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um web deck navegável por →/←, com identidade visual própria (dark + amarelo neon), animações cinéticas via GSAP, componente `<slide-image>` reutilizável e os 14 blocos do storyboard do Pedro implementados como slides do Reveal.js.

**Architecture:** Vite + Reveal.js (engine de navegação, tema 100% custom) + GSAP (animações de elementos) + Web Components vanilla. Cada bloco vive em arquivo HTML próprio, carregado pelo `index.html` no boot. Timelines GSAP são registradas por bloco e disparadas pelos eventos `fragmentshown` / `fragmenthidden` / `slidechanged` do Reveal.

**Tech Stack:** Vite, Reveal.js, GSAP, JetBrains Mono + Clash Display + Satoshi (via Fontshare), Vitest pros testes de unidade do web component.

**Spec fonte:** `docs/superpowers/specs/2026-06-23-palestra-ia-claude-design.md`

---

## Convenções deste plano

- **Working directory:** `C:\Users\matheus\Desktop\palestra-claude`
- Todos os comandos `npm` rodam na raiz do projeto
- Testes do web component usam **Vitest** com JSDOM
- Smoke tests "manuais" rodam o `npm run dev` em porta 8080 (preferência do usuário) e validam visualmente no navegador
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `chore:`, `refactor:`, `test:`, `style:`, `docs:`
- Sempre que um step disser "commit", o engenheiro faz `git add -A && git commit -m "<msg>"` na raiz do projeto

---

## Fase 0 — Scaffold do projeto

### Task 1: Inicializar package.json e dependências

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Criar `package.json` inicial**

Rodar na raiz:

```bash
npm init -y
```

- [ ] **Step 2: Instalar dependências de runtime**

```bash
npm install reveal.js gsap
```

- [ ] **Step 3: Instalar dependências de fonte**

```bash
npm install @fontsource-fontshare/clash-display @fontsource-fontshare/satoshi @fontsource/jetbrains-mono
```

- [ ] **Step 4: Instalar dependências de dev**

```bash
npm install -D vite vitest jsdom @vitest/ui
```

- [ ] **Step 5: Criar `.gitignore`**

```
node_modules/
dist/
.vite/
.DS_Store
*.log
.env
.env.local
```

- [ ] **Step 6: Editar `package.json` adicionando scripts**

Substituir o bloco `"scripts"` por:

```json
"scripts": {
  "dev": "vite --port 8080 --host",
  "build": "vite build",
  "preview": "vite preview --port 8080",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui"
},
"type": "module"
```

- [ ] **Step 7: Inicializar git e fazer commit inicial**

```bash
git init
git add -A
git commit -m "chore: scaffold project with vite + reveal.js + gsap"
```

---

### Task 2: Estrutura de pastas

**Files:**
- Create: `src/`, `src/styles/`, `src/components/`, `src/animations/`, `src/blocks/`
- Create: `public/img/`, `public/fonts/`
- Create: `tests/`

- [ ] **Step 1: Criar todas as pastas**

```powershell
New-Item -ItemType Directory -Force -Path src/styles, src/components, src/animations, src/blocks, public/img, public/fonts, tests | Out-Null
```

- [ ] **Step 2: Criar arquivos placeholder pra git rastrear pastas vazias**

```powershell
"" | Out-File -Encoding utf8 src/blocks/.gitkeep
"" | Out-File -Encoding utf8 public/img/.gitkeep
"" | Out-File -Encoding utf8 public/fonts/.gitkeep
```

- [ ] **Step 3: Copiar storyboard pra dentro do projeto**

```powershell
Copy-Item "C:\Users\matheus\Downloads\palestra-ia-storyboard.md" "docs\palestra-ia-storyboard.md"
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: project folder structure + storyboard copy"
```

---

### Task 3: Configuração do Vite

**Files:**
- Create: `vite.config.js`

- [ ] **Step 1: Criar `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 8080,
    host: true,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.js
git commit -m "chore: vite config with port 8080 and vitest jsdom"
```

---

## Fase 1 — Tokens e tipografia

### Task 4: Tokens de cor

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Criar `src/styles/tokens.css`**

```css
:root {
  /* Fundos */
  --bg-1: #0F0F0E;
  --bg-2: #18181A;
  --bg-3: #232326;

  /* Texto */
  --text-1: #F5F2EC;
  --text-2: #B8B5AE;
  --text-3: #6E6B65;

  /* Acento */
  --accent: #E8FE03;
  --accent-hover: #EEFE3E;

  /* Bordas */
  --border: #2A2A2D;
  --border-focus: #E8FE03;

  /* Semânticas */
  --success: #4ADE80;
  --danger: #F87171;
  --muted-cool: #5C5C60;

  /* Timing/easing — referenciados em CSS animations */
  --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-explosive: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 200ms;
  --duration-base: 450ms;
  --duration-slow: 650ms;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(style): paleta dark + acid em CSS custom properties"
```

---

### Task 5: Reset CSS

**Files:**
- Create: `src/styles/reset.css`

- [ ] **Step 1: Criar `src/styles/reset.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--bg-1);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button { font: inherit; cursor: pointer; background: none; border: none; color: inherit; }

img, svg, video { display: block; max-width: 100%; }

h1, h2, h3, h4, h5, h6, p, ul, ol { margin: 0; }
ul, ol { padding: 0; list-style: none; }

::selection { background: var(--accent); color: var(--bg-1); }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/reset.css
git commit -m "feat(style): reset css base"
```

---

### Task 6: Tipografia

**Files:**
- Create: `src/styles/typography.css`

- [ ] **Step 1: Criar `src/styles/typography.css`**

```css
/* Imports das fontes vêm via npm em main.js — aqui só as classes utilitárias */

:root {
  --font-display: 'ClashDisplay-Variable', 'Clash Display', system-ui, sans-serif;
  --font-body: 'Satoshi-Variable', 'Satoshi', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
}

html { font-family: var(--font-body); font-size: 16px; }

.t-punch {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(4rem, 8vw, 7rem);
  line-height: 1;
  letter-spacing: -0.02em;
}

.t-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.75rem, 5vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.015em;
}

.t-microcopy {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.t-body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1.125rem, 1.5vw, 1.5rem);
  line-height: 1.5;
}

.t-caption {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(0.875rem, 1vw, 1rem);
  line-height: 1.4;
  color: var(--text-3);
}

.t-mono {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: clamp(1rem, 1.3vw, 1.25rem);
}

.accent { color: var(--accent); }
.muted { color: var(--text-2); }
.bold { font-weight: 700; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/typography.css
git commit -m "feat(style): tipografia (clash + satoshi + jetbrains mono) com escala fluida"
```

---

## Fase 2 — Shell do Reveal

### Task 7: `index.html` shell

**Files:**
- Create: `index.html`

- [ ] **Step 1: Criar `index.html` na raiz**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Palestra IA · Pedro</title>
    <link rel="preconnect" href="https://api.fontshare.com" />
  </head>
  <body>
    <div class="reveal">
      <div class="slides" id="slides-root">
        <!-- Slides serão injetados via main.js a partir de src/blocks/ -->
      </div>
    </div>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: index.html shell com div.reveal vazia"
```

---

### Task 8: Overrides do Reveal

**Files:**
- Create: `src/styles/reveal-overrides.css`

- [ ] **Step 1: Criar `src/styles/reveal-overrides.css`**

```css
/* Desliga o tema do Reveal e força a paleta própria */

.reveal {
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--text-1);
  background: var(--bg-1);
}

.reveal .slides {
  text-align: left;
}

.reveal .slides > section,
.reveal .slides > section > section {
  padding: 4rem 6rem;
  background: var(--bg-1);
}

/* Indicador de slide minimalista */
.reveal .progress {
  height: 2px;
  color: var(--accent);
  background: var(--border);
}

.reveal .slide-number {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-3);
  background: transparent;
}

/* Esconde controles padrão (palestrante usa só teclado) */
.reveal .controls { display: none; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/reveal-overrides.css
git commit -m "feat(style): overrides matando o tema do reveal"
```

---

### Task 9: `main.js` boot do Reveal

**Files:**
- Create: `src/main.js`
- Create: `src/reveal-config.js`

- [ ] **Step 1: Criar `src/reveal-config.js`**

```js
export const revealConfig = {
  hash: true,
  history: false,
  controls: false,
  progress: true,
  slideNumber: 'c/t',
  transition: 'slide',
  transitionSpeed: 'default',
  backgroundTransition: 'none',
  keyboard: {
    27: null, // ESC desabilitado (evita sair sem querer)
    79: null, // O (overview) desabilitado
  },
  // Eixo único: trata ↓ como → e ↑ como ←
  navigationMode: 'linear',
};
```

- [ ] **Step 2: Criar `src/main.js`**

```js
import 'reveal.js/dist/reveal.css';

// Fontes via npm
import '@fontsource-fontshare/clash-display/500.css';
import '@fontsource-fontshare/clash-display/600.css';
import '@fontsource-fontshare/clash-display/700.css';
import '@fontsource-fontshare/satoshi/400.css';
import '@fontsource-fontshare/satoshi/500.css';
import '@fontsource-fontshare/satoshi/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

// Estilos da apresentação
import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/reveal-overrides.css';

import Reveal from 'reveal.js';
import { revealConfig } from './reveal-config.js';

async function loadBlocks() {
  // Carrega cada bloco como HTML estático e injeta como <section>
  const blockModules = import.meta.glob('./blocks/*.html', { as: 'raw', eager: true });
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
  window.__deck = deck; // útil pra debug no console
}

bootstrap();
```

- [ ] **Step 3: Criar um bloco placeholder pra ter algo renderizado**

Criar `src/blocks/b00-placeholder.html`:

```html
<h1 class="t-title">Palestra IA</h1>
<p class="t-body muted">Deck em construção · Pedro · 14 blocos</p>
```

- [ ] **Step 4: Rodar dev server e validar deck inicial**

```bash
npm run dev
```

Abrir `http://localhost:8080`. Verificar:
- Fundo preto-quente (`BG-1`)
- Texto "Palestra IA" em Clash Display, claro
- Barra de progresso amarela no topo
- Apertar →/←: como só tem 1 slide, nada muda mas sem erro no console

Parar o dev server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: boot do reveal + loader de blocos via import.meta.glob"
```

---

## Fase 3 — Componente `<slide-image>`

### Task 10: Test do componente (estado A — sem `src`)

**Files:**
- Create: `tests/slide-image.test.js`

- [ ] **Step 1: Escrever teste para placeholder**

```js
import { describe, it, expect, beforeAll } from 'vitest';
import '../src/components/slide-image.js';

describe('<slide-image>', () => {
  beforeAll(() => {
    customElements.upgrade(document.body);
  });

  it('renderiza placeholder quando não tem src', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1.uppercut');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', 'Claude dando uppercut no ChatGPT');
    document.body.appendChild(el);

    const placeholder = el.shadowRoot.querySelector('.placeholder');
    expect(placeholder).not.toBeNull();
    expect(el.shadowRoot.querySelector('img')).toBeNull();
  });

  it('expõe o brief no minibox de hover', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B2');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', 'Sala de aula com Claude lecionando');
    document.body.appendChild(el);

    const tip = el.shadowRoot.querySelector('.minibox');
    expect(tip.textContent).toContain('Sala de aula com Claude lecionando');
  });

  it('vira <img> quando src é fornecido', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', '...');
    el.setAttribute('src', '/img/b1.png');
    el.setAttribute('alt', 'Uppercut');
    document.body.appendChild(el);

    const img = el.shadowRoot.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/img/b1.png');
    expect(img.getAttribute('alt')).toBe('Uppercut');
    expect(el.shadowRoot.querySelector('.placeholder')).toBeNull();
  });

  it('respeita aspect ratio no container', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1');
    el.setAttribute('aspect', '9:16');
    el.setAttribute('brief', '...');
    document.body.appendChild(el);

    const container = el.shadowRoot.querySelector('.container');
    expect(container.style.aspectRatio).toBe('9 / 16');
  });
});
```

- [ ] **Step 2: Rodar o teste pra confirmar que falha**

```bash
npm test
```

Esperado: **FAIL** — `Cannot find module '../src/components/slide-image.js'` ou erro de import.

---

### Task 11: Implementar `<slide-image>`

**Files:**
- Create: `src/components/slide-image.js`

- [ ] **Step 1: Criar `src/components/slide-image.js`**

```js
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; position: relative; }

    .container {
      width: 100%;
      background: var(--bg-2, #18181A);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-3, #6E6B65);
      font-size: 2rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .minibox {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      max-width: 320px;
      padding: 12px 16px;
      background: var(--bg-3, #232326);
      color: var(--text-1, #F5F2EC);
      font-family: var(--font-body, system-ui, sans-serif);
      font-size: 0.95rem;
      line-height: 1.4;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease-out;
      white-space: normal;
      z-index: 10;
    }

    :host(:hover) .minibox { opacity: 1; }

    /* Esconde o minibox quando há imagem real */
    :host([src]) .minibox { display: none; }
  </style>

  <div class="container">
    <div class="placeholder">🖼</div>
    <div class="minibox"></div>
  </div>
`;

class SlideImage extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'brief', 'aspect', 'alt'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const container = this.shadowRoot.querySelector('.container');
    const aspect = this.getAttribute('aspect') || '16:9';
    container.style.aspectRatio = aspect.replace(':', ' / ');

    const minibox = this.shadowRoot.querySelector('.minibox');
    minibox.textContent = this.getAttribute('brief') || '';

    const src = this.getAttribute('src');
    const existingImg = this.shadowRoot.querySelector('img');
    const placeholder = this.shadowRoot.querySelector('.placeholder');

    if (src) {
      if (placeholder) placeholder.remove();
      if (!existingImg) {
        const img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', this.getAttribute('alt') || this.getAttribute('brief') || '');
        img.setAttribute('loading', 'lazy');
        container.appendChild(img);
      } else {
        existingImg.setAttribute('src', src);
        existingImg.setAttribute('alt', this.getAttribute('alt') || this.getAttribute('brief') || '');
      }
    } else {
      if (existingImg) existingImg.remove();
      if (!placeholder) {
        const p = document.createElement('div');
        p.className = 'placeholder';
        p.textContent = '🖼';
        container.insertBefore(p, minibox);
      }
    }
  }
}

customElements.define('slide-image', SlideImage);
```

- [ ] **Step 2: Rodar testes**

```bash
npm test
```

Esperado: **PASS** todos os 4 testes.

- [ ] **Step 3: Importar o componente no `main.js`**

Adicionar perto do topo de `src/main.js`, depois dos imports de estilo:

```js
import './components/slide-image.js';
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(component): <slide-image> com estados placeholder/img + hover minibox"
```

---

## Fase 4 — Animações (helpers + integração GSAP × Reveal)

### Task 12: Helpers de animação

**Files:**
- Create: `src/animations/helpers.js`

- [ ] **Step 1: Criar `src/animations/helpers.js`**

```js
import gsap from 'gsap';

export const EASE = {
  snappy: 'power3.out',
  explosive: 'back.out(1.5)',
  bounceIn: 'back.out(2)',
  exit: 'power2.in',
  smooth: 'sine.inOut',
};

export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.65,
  pulse: 1.6,
};

export function pulse(target, options = {}) {
  const { scale = 1.05, duration = DURATION.fast } = options;
  return gsap.fromTo(
    target,
    { scale: 1 },
    { scale, duration, yoyo: true, repeat: 1, ease: EASE.smooth }
  );
}

export function glowLoop(target, color = 'var(--accent)') {
  return gsap.to(target, {
    boxShadow: `0 0 24px ${color}, 0 0 48px ${color}`,
    duration: DURATION.pulse,
    yoyo: true,
    repeat: -1,
    ease: EASE.smooth,
  });
}

export function staggerIn(targets, options = {}) {
  const { y = 40, stagger = 0.08, duration = DURATION.base } = options;
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, ease: EASE.explosive }
  );
}

export function fadeOut(target, options = {}) {
  const { duration = 0.25 } = options;
  return gsap.to(target, { opacity: 0, duration, ease: EASE.exit });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/animations/helpers.js
git commit -m "feat(anim): helpers gsap (pulse, glowLoop, staggerIn, fadeOut)"
```

---

### Task 13: Registry de timelines por bloco

**Files:**
- Create: `src/animations/timelines.js`

- [ ] **Step 1: Criar `src/animations/timelines.js`**

```js
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
```

- [ ] **Step 2: Hookar eventos do Reveal no `main.js`**

Atualizar `src/main.js`. Substituir a função `bootstrap` por:

```js
import { getHandlers, getBlockIdFromSection } from './animations/timelines.js';

async function bootstrap() {
  await loadBlocks();
  const deck = new Reveal(revealConfig);
  await deck.initialize();
  window.__deck = deck;

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

  // Dispara onShow do primeiro slide manualmente
  const first = deck.getCurrentSlide();
  const firstId = getBlockIdFromSection(first);
  if (firstId) {
    const handlers = getHandlers(firstId);
    if (handlers?.onShow) handlers.onShow(first);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(anim): registry de timelines + hooks reveal->gsap em main.js"
```

---

## Fase 5 — Bloco 1 (Uppercut) como sprint piloto

Este bloco é o template que os blocos 2–14 vão seguir. Por isso é detalhado: depois de validá-lo, os próximos ficam mais sucintos.

### Task 14: Bloco 1 — HTML

**Files:**
- Delete: `src/blocks/b00-placeholder.html`
- Create: `src/blocks/b01-uppercut.html`
- Create: `src/blocks/b01-uppercut.js`

- [ ] **Step 1: Remover o placeholder**

```powershell
Remove-Item src/blocks/b00-placeholder.html -Force
```

- [ ] **Step 2: Criar `src/blocks/b01-uppercut.html`**

```html
<section data-block="b01" data-transition="slide" class="block block--b01">
  <div class="b01-stage">
    <slide-image
      id="B1.uppercut"
      aspect="16:9"
      brief="Ilustração estilo HQ: Claude (laranja) dando uppercut no ChatGPT. Cena de nocaute, cômica e provocativa."
      class="b01-art"
    ></slide-image>

    <h2 class="t-microcopy b01-microcopy">
      🥊 Tem um novo <span class="accent">campeão</span>
    </h2>
  </div>
</section>
```

Observação: `data-block="b01"` é a chave que liga este slide à timeline registrada via `registerBlock('b01', ...)`.

- [ ] **Step 3: Criar `src/blocks/b01-uppercut.js` com a timeline**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, pulse } from '../animations/helpers.js';

registerBlock('b01', {
  onShow(section) {
    const art = section.querySelector('.b01-art');
    const copy = section.querySelector('.b01-microcopy');

    gsap.set([art, copy], { opacity: 0 });

    const tl = gsap.timeline();
    tl.fromTo(
      art,
      { opacity: 0, scale: 0.7, rotate: -8 },
      { opacity: 1, scale: 1, rotate: 0, duration: DURATION.slow, ease: EASE.bounceIn }
    );
    tl.fromTo(
      copy,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive },
      '-=0.15'
    );
    tl.add(() => pulse(copy.querySelector('.accent'), { scale: 1.1 }), '+=0.1');
  },
});
```

- [ ] **Step 4: Importar a timeline no `main.js`**

Adicionar no topo de `src/main.js`, depois do import do `slide-image`:

```js
import './blocks/b01-uppercut.js';
```

- [ ] **Step 5: Adicionar estilos específicos do bloco em `src/styles/components.css`**

Criar arquivo:

```css
/* Estilos específicos de cada bloco — agrupados aqui ou separados conforme crescer */

.block { width: 100%; height: 100%; display: flex; }

/* B1 — uppercut */
.b01-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  width: 100%;
}

.b01-art { width: 60%; max-width: 720px; }

.b01-microcopy { text-align: center; max-width: 16ch; }
```

Importar em `src/main.js`, depois do `reveal-overrides.css`:

```js
import './styles/components.css';
```

- [ ] **Step 6: Smoke test**

```bash
npm run dev
```

Abrir `http://localhost:8080`. Validar:
- Slide B1 aparece
- A imagem placeholder (retângulo cinza com 🖼) entra com escala+rotação
- O microcopy bate depois com bounce
- A palavra "campeão" (em amarelo neon) pulsa uma vez
- Passar mouse no placeholder: minibox sobe mostrando o brief
- Apertar →: nada muda (só 1 slide ainda), sem erro
- Apertar `←`: nada, sem erro

Parar dev server (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(b01): bloco uppercut com timeline gsap + slide-image placeholder"
```

---

## Fase 6 — Blocos 2 a 14

A partir daqui, cada bloco segue o mesmo padrão: HTML em `src/blocks/bNN-*.html`, timeline em `src/blocks/bNN-*.js`, estilos em `src/styles/components.css` (adicionar seção), import no `main.js`, smoke test e commit.

### Task 15: Bloco 2 — O que é Claude

**Files:**
- Create: `src/blocks/b02-claude.html`
- Create: `src/blocks/b02-claude.js`
- Modify: `src/styles/components.css`
- Modify: `src/main.js` (adicionar import)

- [ ] **Step 1: Criar `src/blocks/b02-claude.html`**

```html
<section data-block="b02" class="block block--b02">
  <div class="b02-stage">
    <slide-image
      id="B2.classroom"
      aspect="16:9"
      brief="Claude no quadro-negro DANDO AULA. ChatGPT sentado na carteira, de aluno. Sala de aula tradicional."
      class="b02-art fragment"
    ></slide-image>

    <div class="b02-copy fragment">
      <h2 class="t-microcopy">
        <span class="accent">Claude</span> = a IA que <span class="bold">pensa</span> com você
      </h2>
      <p class="t-body muted">Mesma ideia do ChatGPT. Outro nível.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Criar `src/blocks/b02-claude.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b02', {
  onShow(section) {
    const art = section.querySelector('.b02-art');
    const copy = section.querySelector('.b02-copy');
    gsap.set([art, copy], { opacity: 0 });
  },
  onFragmentShown({ fragment }) {
    gsap.fromTo(
      fragment,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }
    );
  },
  onFragmentHidden({ fragment }) {
    gsap.to(fragment, { opacity: 0, y: 30, duration: 0.25, ease: EASE.exit });
  },
});
```

- [ ] **Step 3: Adicionar estilos em `src/styles/components.css`**

Anexar ao final do arquivo:

```css
/* B2 — Claude lecionando */
.b02-stage {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

.b02-art { width: 100%; }

.b02-copy { display: flex; flex-direction: column; gap: 1.5rem; }
.b02-copy h2 { max-width: 14ch; }
```

- [ ] **Step 4: Importar no `main.js`**

Adicionar:

```js
import './blocks/b02-claude.js';
```

- [ ] **Step 5: Smoke test + commit**

```bash
npm run dev
```

Validar: navegar com → do B1 ao B2; ver imagem entrar com fragmento, copy entrar com fragmento. Voltar com ← desfaz cada um.

```bash
git add -A
git commit -m "feat(b02): claude lecionando (fragmentos imagem -> copy)"
```

---

### Task 16: Bloco 3 — Claude Code (hub SVG)

**Files:**
- Create: `src/blocks/b03-claude-code.html`
- Create: `src/blocks/b03-claude-code.js`
- Modify: `src/styles/components.css`
- Modify: `src/main.js`

- [ ] **Step 1: Criar `src/blocks/b03-claude-code.html`**

```html
<section data-block="b03" class="block block--b03">
  <div class="b03-stage">
    <h2 class="t-title">Claude Code = o Claude ligado em <span class="accent">tudo</span></h2>

    <svg viewBox="0 0 800 500" class="b03-hub" aria-hidden="true">
      <!-- Nó central -->
      <g class="b03-center">
        <circle cx="400" cy="250" r="60" fill="var(--accent)" />
        <text x="400" y="258" text-anchor="middle" font-family="var(--font-display)" font-weight="700" font-size="22" fill="var(--bg-1)">Claude</text>
      </g>

      <!-- 6 nós + 6 fios. Cada par é um fragment. -->
      <g class="b03-node fragment" data-node="files">
        <line x1="400" y1="250" x2="120" y2="100" stroke="var(--accent)" stroke-width="2" />
        <circle cx="120" cy="100" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="120" y="106" text-anchor="middle" font-size="14" fill="var(--text-1)">arquivos</text>
      </g>

      <g class="b03-node fragment" data-node="notion">
        <line x1="400" y1="250" x2="680" y2="100" stroke="var(--accent)" stroke-width="2" />
        <circle cx="680" cy="100" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="680" y="106" text-anchor="middle" font-size="14" fill="var(--text-1)">Notion</text>
      </g>

      <g class="b03-node fragment" data-node="wpp">
        <line x1="400" y1="250" x2="80" y2="250" stroke="var(--accent)" stroke-width="2" />
        <circle cx="80" cy="250" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="80" y="256" text-anchor="middle" font-size="14" fill="var(--text-1)">WhatsApp</text>
      </g>

      <g class="b03-node fragment" data-node="github">
        <line x1="400" y1="250" x2="720" y2="250" stroke="var(--accent)" stroke-width="2" />
        <circle cx="720" cy="250" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="720" y="256" text-anchor="middle" font-size="14" fill="var(--text-1)">GitHub</text>
      </g>

      <g class="b03-node fragment" data-node="terminal">
        <line x1="400" y1="250" x2="120" y2="400" stroke="var(--accent)" stroke-width="2" />
        <circle cx="120" cy="400" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="120" y="406" text-anchor="middle" font-size="14" fill="var(--text-1)">terminal</text>
      </g>

      <g class="b03-node fragment" data-node="sheet">
        <line x1="400" y1="250" x2="680" y2="400" stroke="var(--accent)" stroke-width="2" />
        <circle cx="680" cy="400" r="38" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
        <text x="680" y="406" text-anchor="middle" font-size="14" fill="var(--text-1)">planilha</text>
      </g>
    </svg>

    <p class="t-microcopy fragment">Não responde. <span class="accent">Faz.</span></p>
  </div>
</section>
```

- [ ] **Step 2: Criar `src/blocks/b03-claude-code.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, glowLoop } from '../animations/helpers.js';

registerBlock('b03', {
  onShow(section) {
    const center = section.querySelector('.b03-center circle');
    gsap.set(section.querySelectorAll('.b03-node'), { opacity: 0 });
    // Pulso contínuo no centro
    glowLoop(center);

    // Prepara linhas pra "desenhar" via stroke-dashoffset
    section.querySelectorAll('.b03-node line').forEach((line) => {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
    });
  },
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b03-node')) {
      const line = fragment.querySelector('line');
      const circle = fragment.querySelector('circle');
      const text = fragment.querySelector('text');

      const tl = gsap.timeline();
      gsap.set(fragment, { opacity: 1 });
      tl.to(line, { strokeDashoffset: 0, duration: DURATION.base, ease: EASE.snappy });
      tl.fromTo(
        circle,
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: DURATION.base, ease: EASE.explosive },
        '-=0.2'
      );
      tl.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.2 }, '-=0.15');
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Adicionar estilos em `components.css`**

```css
/* B3 — hub Claude Code */
.b03-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.b03-hub { width: 100%; max-width: 900px; height: auto; }
```

- [ ] **Step 4: Importar em `main.js` + smoke test + commit**

```js
import './blocks/b03-claude-code.js';
```

```bash
npm run dev
```

Validar: cada → desenha um fio e o ícone do nó faz "pop". Claude central pulsa amarelo constante.

```bash
git add -A
git commit -m "feat(b03): hub claude code com 6 nós em svg + fios animados por fragment"
```

---

### Task 17: Bloco 4 — Desmistificando terminal

**Files:**
- Create: `src/blocks/b04-terminal.html`
- Create: `src/blocks/b04-terminal.js`
- Modify: `src/styles/components.css`
- Modify: `src/main.js`

- [ ] **Step 1: `src/blocks/b04-terminal.html`**

```html
<section data-block="b04" class="block block--b04">
  <div class="b04-stage">
    <div class="b04-terminal" aria-label="terminal">
      <div class="b04-terminal-bar">
        <span></span><span></span><span></span>
      </div>
      <pre class="b04-terminal-body t-mono"><code id="b04-stream"></code></pre>
    </div>

    <div class="b04-result fragment">
      <div class="b04-result-card">
        <div class="t-caption">RESULTADO</div>
        <div class="t-title">Criativo aprovado <span class="accent">96/100</span></div>
      </div>
    </div>

    <p class="t-microcopy fragment">Parece hacker. <span class="accent">É só conversa.</span></p>
    <p class="t-microcopy fragment">Você não programa. Você <span class="accent">pede.</span></p>
  </div>
</section>
```

- [ ] **Step 2: `src/blocks/b04-terminal.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

const FAKE_LINES = [
  '$ claude-code analisar-reel viral_x.mp4',
  '> reading...',
  '> transcribing 1:24...',
  '> extracting hook (0-3s)...',
  '> matching voice profile: xicoria',
  '> generating script v1...',
  '> running /validar-criativo',
  '> agent: memoria   [ok]',
  '> agent: hook      [ok]',
  '> agent: corpo     [ok]',
  '> agent: criativo  [ok]',
  '> agent: oferta    [ok]',
  '> agent: voz       [ok]',
  '> agent: refino    [ok]',
  '> CCO: nota 96/100',
  '> done.',
];

registerBlock('b04', {
  onShow(section) {
    const stream = section.querySelector('#b04-stream');
    stream.textContent = '';

    let i = 0;
    let buffer = '';
    const tick = () => {
      if (i >= FAKE_LINES.length) return;
      buffer += FAKE_LINES[i] + '\n';
      stream.textContent = buffer;
      const lines = stream.textContent.split('\n');
      if (lines.length > 12) stream.textContent = lines.slice(-12).join('\n');
      i++;
      gsap.delayedCall(0.18, tick);
    };
    tick();
  },
  onFragmentShown({ fragment }) {
    gsap.fromTo(
      fragment,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }
    );
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B4 — terminal */
.b04-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b04-terminal {
  width: 100%;
  max-width: 800px;
  background: var(--bg-2);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.b04-terminal-bar {
  display: flex; gap: 6px; padding: 10px 14px;
  background: var(--bg-3);
}
.b04-terminal-bar span {
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--text-3);
}
.b04-terminal-bar span:first-child { background: var(--danger); }
.b04-terminal-bar span:nth-child(2) { background: var(--accent); }
.b04-terminal-bar span:nth-child(3) { background: var(--success); }

.b04-terminal-body {
  margin: 0; padding: 1.5rem;
  color: var(--text-1);
  min-height: 14em;
  white-space: pre-wrap;
}

.b04-result-card {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: var(--bg-2);
  border-left: 4px solid var(--accent);
  border-radius: 6px;
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b04-terminal.js';
```

```bash
npm run dev
git add -A
git commit -m "feat(b04): terminal com fake-typing + reveal do resultado"
```

---

### Task 18: Bloco 5 — Biblioteca (GitHub)

**Files:**
- Create: `src/blocks/b05-biblioteca.html`
- Create: `src/blocks/b05-biblioteca.js`
- Modify: estilos e main

- [ ] **Step 1: `b05-biblioteca.html`**

```html
<section data-block="b05" class="block block--b05">
  <div class="b05-stage">
    <h2 class="t-title">📚 Nossa <span class="accent">biblioteca</span></h2>

    <div class="b05-shelf" aria-hidden="true">
      <div class="b05-book fragment" style="--book-color: var(--accent)">REGRAS</div>
      <div class="b05-book fragment" style="--book-color: var(--success)">ACERTOS</div>
      <div class="b05-book fragment" style="--book-color: var(--danger)">ERROS</div>
      <div class="b05-book fragment" style="--book-color: var(--text-2)">REFERÊNCIAS</div>
      <div class="b05-book fragment" style="--book-color: var(--accent-hover)">VOZ</div>
    </div>

    <p class="t-microcopy fragment">GitHub = <span class="accent">memória que não esquece</span></p>
  </div>
</section>
```

- [ ] **Step 2: `b05-biblioteca.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b05', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b05-book')) {
      gsap.fromTo(
        fragment,
        { y: -240, opacity: 0, rotate: -10 },
        { y: 0, opacity: 1, rotate: 0, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B5 — biblioteca */
.b05-stage { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; width: 100%; }

.b05-shelf {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  height: 280px;
  padding: 0 2rem 1rem;
  border-bottom: 6px solid var(--text-3);
}

.b05-book {
  width: 60px;
  height: 240px;
  background: var(--book-color);
  color: var(--bg-1);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b05-biblioteca.js';
```

```bash
npm run dev
git add -A
git commit -m "feat(b05): biblioteca github com livros caindo na prateleira"
```

---

### Task 19: Bloco 6 — Coração do Notion

**Files:**
- Create: `src/blocks/b06-notion.html`
- Create: `src/blocks/b06-notion.js`
- Modify: estilos e main

- [ ] **Step 1: `b06-notion.html`**

```html
<section data-block="b06" class="block block--b06">
  <div class="b06-stage">
    <h2 class="t-title">❤️ O <span class="accent">coração</span> da operação</h2>

    <div class="b06-diagram">
      <div class="b06-in fragment">
        <ul class="t-body">
          <li>vídeos virais</li>
          <li>ideias</li>
          <li>insights</li>
        </ul>
      </div>

      <svg viewBox="0 0 200 200" class="b06-heart fragment" aria-hidden="true">
        <path d="M100 175 C 30 130, 30 70, 70 50 C 90 40, 100 60, 100 75 C 100 60, 110 40, 130 50 C 170 70, 170 130, 100 175 Z" fill="var(--accent)" />
      </svg>

      <div class="b06-out fragment">
        <ul class="t-body">
          <li>criativos prontos</li>
          <li>relatórios</li>
          <li>painéis</li>
        </ul>
      </div>
    </div>

    <div class="b06-comparison fragment">
      <div><span class="t-caption">GitHub</span><br/><span class="t-microcopy">🔒 o <span class="accent">cofre</span></span></div>
      <div><span class="t-caption">Notion</span><br/><span class="t-microcopy">❤️ o <span class="accent">coração</span></span></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `b06-notion.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b06', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b06-heart')) {
      gsap.fromTo(
        fragment,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.slow, ease: EASE.bounceIn }
      );
      // Pulse contínuo
      gsap.to(fragment, { scale: 1.08, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
    } else {
      gsap.fromTo(fragment, { opacity: 0, x: fragment.classList.contains('b06-in') ? -40 : 40 }, { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B6 — coração notion */
.b06-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b06-diagram {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 3rem;
  align-items: center;
  width: 100%;
  max-width: 900px;
}

.b06-in, .b06-out { text-align: center; }
.b06-in li, .b06-out li { padding: 0.4rem 0; }

.b06-heart { width: 200px; height: 200px; }

.b06-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  text-align: center;
  margin-top: 2rem;
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b06-notion.js';
```

```bash
git add -A
git commit -m "feat(b06): coração notion pulsando + entradas/saídas + comparação cofre x coração"
```

---

### Task 20: Bloco 7 — Agent (escritório)

**Files:**
- Create: `src/blocks/b07-agent.html`, `src/blocks/b07-agent.js`

- [ ] **Step 1: `b07-agent.html`**

```html
<section data-block="b07" class="block block--b07">
  <div class="b07-stage">
    <h2 class="t-title">🪪 Agent = <span class="accent">funcionário especialista</span></h2>

    <div class="b07-office">
      <div class="b07-worker fragment">
        <div class="b07-badge accent">COPYWRITER</div>
        <div class="b07-role">só escreve</div>
      </div>
      <div class="b07-worker fragment">
        <div class="b07-badge accent">REVISOR</div>
        <div class="b07-role">só revisa</div>
      </div>
      <div class="b07-worker fragment">
        <div class="b07-badge accent">ANALISTA</div>
        <div class="b07-role">só analisa</div>
      </div>
      <div class="b07-worker fragment">
        <div class="b07-badge accent">PESQUISADOR</div>
        <div class="b07-role">só pesquisa</div>
      </div>
    </div>

    <p class="t-microcopy fragment">
      ChatGPT = estagiário · Agent = <span class="accent">especialista</span>
    </p>
  </div>
</section>
```

- [ ] **Step 2: `b07-agent.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b07', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b07-worker')) {
      gsap.fromTo(
        fragment,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATION.base, ease: EASE.explosive }
      );
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B7 — agents/escritório */
.b07-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b07-office {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
}

.b07-worker {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--bg-2);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.b07-badge {
  background: var(--accent);
  color: var(--bg-1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.b07-role {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-2);
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b07-agent.js';
```

```bash
git add -A
git commit -m "feat(b07): escritório de agents com funcionários entrando em fila"
```

---

### Task 21: Bloco 8 — Boas práticas

**Files:**
- Create: `src/blocks/b08-praticas.html`, `src/blocks/b08-praticas.js`

- [ ] **Step 1: `b08-praticas.html`**

```html
<section data-block="b08" class="block block--b08">
  <div class="b08-stage">
    <h2 class="t-title">Como contratar um <span class="accent">bom agent</span></h2>
    <ol class="b08-list">
      <li class="fragment"><span class="b08-num">1</span><span class="t-microcopy"><span class="accent">uma</span> função só</span><span class="b08-hint">não peça tudo pra um</span></li>
      <li class="fragment"><span class="b08-num">2</span><span class="t-microcopy">contexto <span class="accent">enxuto</span></span><span class="b08-hint">só o que ele precisa saber</span></li>
      <li class="fragment"><span class="b08-num">3</span><span class="t-microcopy">regras <span class="accent">inegociáveis</span></span><span class="b08-hint">o que ele nunca pode fazer</span></li>
      <li class="fragment"><span class="b08-num">4</span><span class="t-microcopy">tem <span class="accent">memória</span></span><span class="b08-hint">lembra do que aprendeu</span></li>
      <li class="fragment"><span class="b08-num">5</span><span class="t-microcopy">ferramenta <span class="accent">certa</span></span><span class="b08-hint">acesso só ao necessário</span></li>
    </ol>
  </div>
</section>
```

- [ ] **Step 2: `b08-praticas.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b08', {
  onFragmentShown({ fragment }) {
    const num = fragment.querySelector('.b08-num');
    const tl = gsap.timeline();
    tl.fromTo(fragment, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive });
    if (num) {
      tl.fromTo(num, { scale: 0 }, { scale: 1, duration: DURATION.base, ease: EASE.bounceIn }, '-=0.3');
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B8 — boas práticas */
.b08-stage { display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 900px; margin: 0 auto; }

.b08-list { display: flex; flex-direction: column; gap: 1rem; }

.b08-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: var(--bg-2);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.b08-num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--accent);
  width: 2.5rem;
  text-align: center;
}

.b08-hint {
  color: var(--text-2);
  font-size: 0.95rem;
  text-align: right;
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b08-praticas.js';
```

```bash
git add -A
git commit -m "feat(b08): boas práticas em lista numerada com entradas escalonadas"
```

---

### Task 22: Bloco 9 — Soul + Voice

**Files:**
- Create: `src/blocks/b09-soul-voice.html`, `src/blocks/b09-soul-voice.js`

- [ ] **Step 1: `b09-soul-voice.html`**

```html
<section data-block="b09" class="block block--b09">
  <div class="b09-stage">
    <h2 class="t-title">Clonar um <span class="accent">expert</span> = 🧠 + 🗣️</h2>

    <div class="b09-equation">
      <div class="b09-pillar fragment">
        <div class="b09-icon">🧠</div>
        <div class="t-microcopy"><span class="accent">SOUL</span></div>
        <div class="t-body muted">como ele <strong>pensa</strong></div>
      </div>
      <div class="b09-plus fragment">+</div>
      <div class="b09-pillar fragment">
        <div class="b09-icon">🗣️</div>
        <div class="t-microcopy"><span class="accent">VOICE</span></div>
        <div class="t-body muted">como ele <strong>fala</strong></div>
      </div>
    </div>

    <slide-image
      class="b09-voicespec fragment"
      id="B9.voicespec"
      aspect="9:16"
      brief="Print real do Git/Notion mostrando o voice-spec do Xicória: bordões (mano, garoto, pra carai, 0% Talent), tamanho de frase (5-10 palavras), proibições (cara, textão, papo corporativo)."
    ></slide-image>

    <div class="b09-compare fragment">
      <div class="b09-col">
        <div class="t-caption accent">DIZ</div>
        <ul class="t-body">
          <li>mano</li><li>garoto</li><li>0% Talent</li><li>pra carai</li>
        </ul>
      </div>
      <div class="b09-col">
        <div class="t-caption" style="color: var(--danger)">NUNCA</div>
        <ul class="t-body">
          <li>"cara"</li><li>textão</li><li>papo corporativo</li>
        </ul>
      </div>
    </div>

    <p class="t-microcopy fragment">não parece IA. parece <span class="accent">o Xicória</span>.</p>
  </div>
</section>
```

- [ ] **Step 2: `b09-soul-voice.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b09', {
  onFragmentShown({ fragment }) {
    gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    if (fragment.classList.contains('b09-plus')) {
      gsap.fromTo(fragment, { scale: 0 }, { scale: 1, duration: DURATION.base, ease: EASE.bounceIn });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B9 — soul + voice */
.b09-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b09-equation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.b09-pillar {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: var(--bg-2);
  border-radius: 8px;
  min-width: 200px;
  text-align: center;
}

.b09-icon { font-size: 3rem; }

.b09-plus {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 3rem;
  color: var(--accent);
}

.b09-voicespec { width: 45%; max-width: 360px; }

.b09-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.b09-col { display: flex; flex-direction: column; gap: 0.5rem; }
.b09-col ul { display: flex; flex-direction: column; gap: 0.4rem; }
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b09-soul-voice.js';
```

```bash
git add -A
git commit -m "feat(b09): soul + voice + slide-image voice-spec + tabela diz/nunca"
```

---

### Task 23: Bloco 10 — Skills (arsenal)

Este é o bloco mais longo. Tem 6 sub-cenas. Vou organizar os fragmentos em ordem.

**Files:**
- Create: `src/blocks/b10-skills.html`, `src/blocks/b10-skills.js`

- [ ] **Step 1: `b10-skills.html`**

```html
<section data-block="b10" class="block block--b10">
  <div class="b10-stage">

    <div class="b10-coffee fragment">
      <div class="b10-coffee-icon">☕</div>
      <div class="t-body">um botão · processo inteiro · sozinho</div>
    </div>

    <h2 class="t-title fragment">Meu <span class="accent">arsenal</span> de skills</h2>

    <div class="b10-grid">
      <div class="b10-group">
        <div class="t-caption">🔍 INTELIGÊNCIA</div>
        <button class="b10-skill fragment" data-name="/swipe-file"><code>/swipe-file</code><span>caça virais 🎣</span></button>
        <button class="b10-skill fragment" data-name="/analisar-perfil"><code>/analisar-perfil</code><span>raio-x do criador 🔬</span></button>
        <button class="b10-skill fragment" data-name="/transcrever-anuncios"><code>/transcrever-anuncios</code><span>espiona concorrente 🔍</span></button>
      </div>

      <div class="b10-group">
        <div class="t-caption">✍️ PRODUÇÃO</div>
        <button class="b10-skill fragment" data-name="/modelar-video"><code>/modelar-video</code><span>vira a voz 🗣️</span></button>
        <button class="b10-skill fragment" data-name="/validar-criativo"><code>/validar-criativo</code><span>8 agents validam ✅</span></button>
      </div>

      <div class="b10-group">
        <div class="t-caption">📊 OPERAÇÃO</div>
        <button class="b10-skill fragment" data-name="/relatorio-xicoria"><code>/relatorio-xicoria</code><span>relatório auto 📊</span></button>
      </div>
    </div>

    <p class="t-microcopy fragment">horas de trabalho → <span class="accent">1 clique</span></p>
  </div>
</section>
```

- [ ] **Step 2: `b10-skills.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b10', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b10-skill')) {
      const tl = gsap.timeline();
      tl.fromTo(fragment, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: DURATION.base, ease: EASE.explosive });
      tl.to(fragment, { boxShadow: '0 0 0 2px var(--accent), 0 0 24px rgba(232,254,3,0.4)', duration: 0.2 }, '-=0.1');
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B10 — skills arsenal */
.b10-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b10-coffee {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-2);
  border-radius: 8px;
}
.b10-coffee-icon { font-size: 2.5rem; }

.b10-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1100px;
}

.b10-group { display: flex; flex-direction: column; gap: 0.75rem; }

.b10-skill {
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  text-align: left;
  color: var(--text-1);
  transition: transform 200ms var(--ease-snappy);
}

.b10-skill code {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent);
}

.b10-skill span {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-2);
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b10-skills.js';
```

```bash
git add -A
git commit -m "feat(b10): arsenal de skills com 6 botões em 3 grupos, glow ao 'clicar'"
```

---

### Task 24: Bloco 11 — Filtro de 8 agents

**Files:**
- Create: `src/blocks/b11-filtro.html`, `src/blocks/b11-filtro.js`

- [ ] **Step 1: `b11-filtro.html`**

```html
<section data-block="b11" class="block block--b11">
  <div class="b11-stage">
    <h2 class="t-title">Validar = <span class="accent">8 especialistas</span></h2>

    <div class="b11-conveyor" aria-hidden="true">
      <div class="b11-card fragment">📄 criativo</div>
      <div class="b11-station fragment" data-i="1">🧠<br/><span>memória</span></div>
      <div class="b11-station fragment" data-i="2">🎣<br/><span>hook</span></div>
      <div class="b11-station fragment" data-i="3">🧵<br/><span>corpo</span></div>
      <div class="b11-station fragment" data-i="4">🎬<br/><span>criativo</span></div>
      <div class="b11-station fragment" data-i="5">💰<br/><span>oferta</span></div>
      <div class="b11-station fragment" data-i="6">🗣️<br/><span>voz</span></div>
      <div class="b11-station fragment" data-i="7">✏️<br/><span>refino</span></div>
      <div class="b11-station fragment" data-i="8">👑<br/><span>CCO</span></div>
    </div>

    <div class="b11-verdict fragment">
      <div class="b11-stamp">APROVADO</div>
      <div class="t-punch accent">96/100</div>
    </div>

    <p class="t-microcopy fragment">nada medíocre escapa.</p>
  </div>
</section>
```

- [ ] **Step 2: `b11-filtro.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b11', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b11-station')) {
      const tl = gsap.timeline();
      tl.fromTo(fragment, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: EASE.explosive });
      tl.to(fragment, { background: 'var(--success)', color: 'var(--bg-1)', duration: 0.2 });
    } else if (fragment.classList.contains('b11-verdict')) {
      gsap.fromTo(
        fragment,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B11 — esteira de 8 agents */
.b11-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b11-conveyor {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1.5rem;
  background: var(--bg-2);
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
}

.b11-card {
  padding: 0.75rem 1rem;
  background: var(--accent);
  color: var(--bg-1);
  border-radius: 4px;
  font-family: var(--font-display);
  font-weight: 700;
}

.b11-station {
  padding: 0.5rem 0.75rem;
  background: var(--bg-3);
  border-radius: 6px;
  text-align: center;
  font-size: 1.5rem;
  min-width: 80px;
}

.b11-station span { font-size: 0.75rem; display: block; }

.b11-verdict {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: var(--bg-2);
  border: 2px solid var(--success);
  border-radius: 8px;
}

.b11-stamp {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--success);
  letter-spacing: 0.1em;
}
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b11-filtro.js';
```

```bash
git add -A
git commit -m "feat(b11): esteira de validação com 8 estações + carimbo aprovado 96/100"
```

---

### Task 25: Bloco 12 — IA que aprende sozinha

**Files:**
- Create: `src/blocks/b12-aprende.html`, `src/blocks/b12-aprende.js`

- [ ] **Step 1: `b12-aprende.html`**

```html
<section data-block="b12" class="block block--b12">
  <div class="b12-stage">
    <h2 class="t-title">A IA que <span class="accent">aprende sozinha</span></h2>

    <div class="b12-commands">
      <div class="b12-cmd fragment" data-kind="aprova"><code class="t-mono">APROVA</code> → referência</div>
      <div class="b12-cmd fragment" data-kind="corrige"><code class="t-mono">CORRIGE</code> → correção</div>
      <div class="b12-cmd fragment" data-kind="nunca"><code class="t-mono">NUNCA</code> → restrição</div>
      <div class="b12-cmd fragment" data-kind="sempre"><code class="t-mono">SEMPRE</code> → preferência</div>
    </div>

    <div class="b12-level fragment">
      <div class="t-caption">nível</div>
      <div class="b12-bar"><div class="b12-fill"></div></div>
    </div>

    <div class="b12-final fragment">
      <div class="b12-bot">🤖<div class="t-caption">DIA 1</div></div>
      <div class="b12-arrow">→</div>
      <div class="b12-bot accent-glow">🤖<div class="t-caption accent">DIA 90</div></div>
    </div>

    <p class="t-microcopy fragment">não é uma ferramenta. é um sistema que <span class="accent">cresce</span>.</p>
  </div>
</section>
```

- [ ] **Step 2: `b12-aprende.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b12', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b12-cmd')) {
      gsap.fromTo(
        fragment,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATION.base, ease: EASE.explosive }
      );
    } else if (fragment.classList.contains('b12-level')) {
      const fill = fragment.querySelector('.b12-fill');
      gsap.fromTo(fragment, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(fill, { width: '20%' }, { width: '92%', duration: 1.2, ease: EASE.snappy, delay: 0.2 });
    } else if (fragment.classList.contains('b12-final')) {
      const tl = gsap.timeline();
      tl.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
      tl.to(fragment.querySelector('.accent-glow'), { textShadow: '0 0 24px var(--accent)', duration: 0.4 });
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B12 — feedback loop */
.b12-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b12-commands {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 700px;
}

.b12-cmd {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-2);
  border-left: 4px solid var(--accent);
  border-radius: 6px;
  font-family: var(--font-body);
  color: var(--text-2);
}

.b12-cmd code { color: var(--accent); }

.b12-level { width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 0.5rem; }

.b12-bar {
  height: 12px;
  background: var(--bg-2);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.b12-fill {
  height: 100%;
  width: 20%;
  background: var(--accent);
}

.b12-final {
  display: flex; align-items: center; gap: 2rem;
  font-size: 4rem;
}

.b12-arrow { font-size: 2rem; color: var(--text-3); }
.b12-bot { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b12-aprende.js';
```

```bash
git add -A
git commit -m "feat(b12): feedback loop com comandos, barra de nível e dia1 vs dia90"
```

---

### Task 26: Bloco 13 — Antes e depois Xicória

**Files:**
- Create: `src/blocks/b13-xicoria.html`, `src/blocks/b13-xicoria.js`

- [ ] **Step 1: `b13-xicoria.html`**

```html
<section data-block="b13" class="block block--b13">
  <div class="b13-stage">
    <div class="b13-split">
      <div class="b13-before">
        <div class="t-caption">ANTES</div>
        <slide-image
          id="B13.before"
          aspect="9:16"
          brief="Print real do perfil do Xicória ANTES: poucos seguidores, conteúdo de atração genérico, posts rasos tipo 'me siga'."
        ></slide-image>
        <div class="t-body muted">conteúdo de atração (raso)</div>
      </div>

      <div class="b13-arrow fragment">→</div>

      <div class="b13-after fragment">
        <div class="t-caption accent">DEPOIS</div>
        <slide-image
          id="B13.after"
          aspect="9:16"
          brief="Print real do perfil do Xicória DEPOIS: ~40k seguidores, conteúdo de conscientização, reels educativos, vibe de autoridade."
        ></slide-image>
        <div class="t-body accent">conscientização (autoridade)</div>
      </div>
    </div>

    <div class="b13-numbers fragment">
      <div><span class="t-punch accent">22</span><span class="t-caption">criativos</span></div>
      <div><span class="t-punch accent">96,2</span><span class="t-caption">/100 média</span></div>
      <div><span class="t-punch accent">0</span><span class="t-caption">reprovados</span></div>
      <div><span class="t-punch accent">~40k</span><span class="t-caption">📈</span></div>
    </div>

    <p class="t-microcopy fragment">e isso é só <span class="accent">UM</span> expert.</p>
  </div>
</section>
```

- [ ] **Step 2: `b13-xicoria.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b13', {
  onShow(section) {
    // Lado "antes" entra desaturado por padrão
    gsap.set(section.querySelector('.b13-before'), { filter: 'grayscale(1)', opacity: 1 });
  },
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b13-after')) {
      gsap.fromTo(
        fragment,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else if (fragment.classList.contains('b13-numbers')) {
      gsap.from(fragment.children, {
        y: 30, opacity: 0, duration: DURATION.base, stagger: 0.12, ease: EASE.explosive,
      });
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B13 — antes/depois */
.b13-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b13-split {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  width: 100%;
  max-width: 1000px;
}

.b13-before, .b13-after { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }

.b13-arrow {
  font-size: 3rem;
  color: var(--accent);
  font-family: var(--font-display);
}

.b13-numbers {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 1rem;
}

.b13-numbers > div {
  display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  padding: 1rem;
  background: var(--bg-2);
  border-radius: 8px;
}

.b13-numbers .t-punch { font-size: 3rem; }
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b13-xicoria.js';
```

```bash
git add -A
git commit -m "feat(b13): antes/depois xicória com split + números + punch"
```

---

### Task 27: Bloco 14 — Fechamento

**Files:**
- Create: `src/blocks/b14-fechamento.html`, `src/blocks/b14-fechamento.js`

- [ ] **Step 1: `b14-fechamento.html`**

```html
<section data-block="b14" class="block block--b14">
  <div class="b14-stage">
    <div class="b14-recap fragment">
      <span>ferramenta</span><span>·</span><span>biblioteca</span><span>·</span><span>coração</span><span>·</span><span>agents</span><span>·</span><span>voz</span><span>·</span><span>skills</span><span>·</span><span>filtro</span><span>·</span><span>aprende</span>
    </div>

    <h2 class="t-punch fragment">não é prompt. é <span class="accent">SISTEMA</span>.</h2>

    <div class="b14-cta fragment">
      <div class="t-microcopy">1. <span class="accent">segue</span> aqui 👆</div>
      <div class="t-microcopy">2. manda "<span class="accent">ARQUITETURA</span>" no direct</div>
      <div class="t-caption muted">→ eu te mando toda a estrutura</div>
    </div>

    <slide-image
      class="b14-final fragment"
      id="B14.glove"
      aspect="16:9"
      brief="Callback ao Bloco 1: Claude com a luva de boxe, mas agora ESTENDE a luva pra plateia. Convite, não soco."
    ></slide-image>

    <p class="t-microcopy fragment">a IA não te substitui. quem <span class="accent">orquestra</span>, sim.</p>
  </div>
</section>
```

- [ ] **Step 2: `b14-fechamento.js`**

```js
import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b14', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b14-recap')) {
      gsap.from(fragment.children, {
        opacity: 0, x: -10, stagger: 0.04, duration: 0.2, ease: EASE.snappy,
      });
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
```

- [ ] **Step 3: Estilos**

```css
/* B14 — fechamento */
.b14-stage { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }

.b14-recap {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
  font-family: var(--font-body);
  color: var(--text-2);
  font-size: 1.1rem;
}

.b14-cta { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; text-align: center; }

.b14-final { width: 60%; max-width: 720px; }
```

- [ ] **Step 4: Importar + smoke + commit**

```js
import './blocks/b14-fechamento.js';
```

```bash
git add -A
git commit -m "feat(b14): fechamento com recap, sistema vs prompt, cta e callback luva"
```

---

## Fase 7 — Polimento e entrega

### Task 28: Garantir export PDF funcional

- [ ] **Step 1: Rodar dev com `?print-pdf`**

```bash
npm run dev
```

Abrir `http://localhost:8080/?print-pdf`. Verificar que o Reveal renderiza no modo print-friendly (cada slide vira uma página).

- [ ] **Step 2: Imprimir como PDF**

No Chrome/Edge: `Ctrl+P` → destino "Salvar como PDF" → tamanho de papel: "Personalizado" → 1920×1080px (ou A4 paisagem) → margens "Nenhum" → "Salvar" em `dist/palestra.pdf`.

- [ ] **Step 3: Validar PDF**

Abrir o PDF. Cada slide deve estar em uma página. Animações naturalmente não aparecem (estado final estático). Verificar que microcopy, cores e tipografia estão corretos.

---

### Task 29: Build de produção

- [ ] **Step 1: Build**

```bash
npm run build
```

Espera-se gerar `dist/` com `index.html` + bundles JS/CSS + assets.

- [ ] **Step 2: Validar build localmente**

```bash
npm run preview
```

Abrir `http://localhost:8080`. Navegar com →/← do B1 ao B14. Verificar que nenhuma animação quebrou.

- [ ] **Step 3: Commit do build artifact (opcional — só se for hospedar)**

Se for servir via GitHub Pages/Netlify, normalmente `dist/` fica fora do git (já está no `.gitignore`). Pular esse step se não for o caso.

---

### Task 30: README do projeto

**Files:**
- Create: `README.md`

- [ ] **Step 1: Criar `README.md`**

```markdown
# Palestra IA · Pedro

Web deck da palestra "IA na Criação de Conteúdo" (~20-30min, plateia leiga de marketing).

## Stack

- Vite + Reveal.js + GSAP
- Web Components vanilla (`<slide-image>`)
- Clash Display + Satoshi + JetBrains Mono

## Rodar

```bash
npm install
npm run dev          # dev server em http://localhost:8080
npm run build        # build estático em dist/
npm run preview      # preview do build
npm test             # testes do componente
```

## Estrutura

- `docs/superpowers/specs/` — spec de design
- `docs/superpowers/plans/` — plano de implementação
- `docs/palestra-ia-storyboard.md` — storyboard fonte
- `src/blocks/bNN-*.html` + `bNN-*.js` — slides + timelines GSAP
- `src/components/slide-image.js` — placeholder de imagem com hover
- `src/animations/` — helpers e registry de timelines
- `src/styles/tokens.css` — paleta CSS

## Plano B no palco

- `npm run build` → `dist/` no pendrive
- `http://localhost:8080/?print-pdf` → "Imprimir como PDF" → `palestra.pdf` no pendrive
- Testar em outro notebook 1 semana antes
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: readme com instruções de execução"
```

---

## Self-review do plano

(Esta seção fica registrada pra rastreabilidade do brainstorm; o engenheiro não precisa executar.)

**1. Cobertura do spec:**
- §2 Decisões (stack, navegação, render): cobertas em Fases 0-2.
- §3.1 Paleta: Task 4.
- §3.2 Tipografia: Task 6 (Clash + Satoshi + JetBrains Mono via npm).
- §3.3 Mood de animação: Task 12 (helpers com `back.out`/`power3.out` etc).
- §4 `<slide-image>`: Tasks 10-11 (com testes Vitest).
- §5 Estrutura de pastas: Task 2.
- §6 14 blocos: Tasks 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27.
- §7 Atalhos + teclas desabilitadas: Task 9 (revealConfig com 27/79 = null).
- §8 Plano B: Tasks 28-29.
- §9 Pendências de conteúdo: documentadas no README e no spec (fora do escopo de código).

**2. Placeholders:** scan feito — sem "TBD", "TODO" ou "implementar depois" nos steps. Todo código é literal.

**3. Consistência de tipos:** `slide-image` é referenciado com mesmo nome em todos os blocos. `registerBlock(id, handlers)` tem assinatura uniforme. Helpers `EASE.*`, `DURATION.*`, `pulse`, `glowLoop`, `staggerIn`, `fadeOut` usados consistentemente.
