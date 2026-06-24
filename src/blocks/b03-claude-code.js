import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, glowLoop } from '../animations/helpers.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CENTER = { x: 400, y: 250 };

// Cada nó vagueia pelo slide numa trajetória ampla (Lissajous): centro de
// passeio, amplitude e frequências distintas por eixo → movimento fluido que
// nunca se repete na cara. Frequências em rad/s (lentas: ~10-15s por ciclo).
// Amplitudes calibradas pra ficarem dentro do viewBox 800x500 sem precisar
// de clamp (que "gruda" o nó na parede).
const ROAM = [
  // github — direita
  { cx: 575, cy: 205, ax: 135, ay: 120, fx: 0.62, fy: 0.41, px: 0.0, py: 1.1 },
  // notion — sup. direito
  { cx: 515, cy: 150, ax: 150, ay: 85, fx: 0.45, fy: 0.66, px: 1.7, py: 0.4 },
  // files — sup. esquerdo
  { cx: 285, cy: 150, ax: 150, ay: 85, fx: 0.55, fy: 0.48, px: 3.0, py: 2.2 },
  // wpp — esquerda
  { cx: 225, cy: 205, ax: 135, ay: 120, fx: 0.5, fy: 0.6, px: 0.8, py: 3.3 },
  // terminal — inf. esquerdo
  { cx: 285, cy: 350, ax: 150, ay: 85, fx: 0.58, fy: 0.44, px: 2.3, py: 1.5 },
  // sheet — inf. direito
  { cx: 515, cy: 350, ax: 150, ay: 85, fx: 0.42, fy: 0.63, px: 4.1, py: 0.9 },
];

const nodePos = (i, t) => {
  const r = ROAM[i];
  return {
    x: r.cx + r.ax * Math.sin(r.fx * t + r.px),
    y: r.cy + r.ay * Math.sin(r.fy * t + r.py),
  };
};

const lerp = (a, b, p) => a + (b - a) * p;

let centerGlow = null;
let tickerFn = null;
const loopTweens = [];
const createdEls = [];

function killAll() {
  centerGlow?.kill();
  centerGlow = null;
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  loopTweens.forEach((t) => t.kill());
  loopTweens.length = 0;
  createdEls.forEach((el) => el.remove());
  createdEls.length = 0;
}

registerBlock('b03', {
  onShow(section) {
    killAll();

    const svg = section.querySelector('.b03-hub');
    const title = section.querySelector('.b03-title');
    const center = section.querySelector('.b03-center');
    const centerCircle = center.querySelector('circle');
    const orbit = section.querySelector('.b03-orbit');
    const nodes = [...section.querySelectorAll('.b03-node')];
    const microcopy = section.querySelector('.b03-microcopy');
    const bullets = [...section.querySelectorAll('.b03-bullets li')];

    // Posição viva de cada nó (atualizada no ticker, lida pelos pulsos)
    const state = nodes.map((_, i) => nodePos(i, 0));

    // Estado inicial
    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(bullets, { opacity: 0, y: 14 });
    gsap.set(center, { opacity: 0, scale: 0, svgOrigin: `${CENTER.x} ${CENTER.y}` });

    nodes.forEach((node, i) => {
      const start = state[i];
      const line = node.querySelector('line');
      const circle = node.querySelector('circle');
      const image = node.querySelector('image');

      // Começa exatamente onde o ticker continuará (nodePos em t=0) → sem salto
      line.setAttribute('x2', start.x);
      line.setAttribute('y2', start.y);
      circle.setAttribute('cx', start.x);
      circle.setAttribute('cy', start.y);
      if (image) {
        const w = parseFloat(image.getAttribute('width'));
        const h = parseFloat(image.getAttribute('height'));
        image.setAttribute('x', start.x - w / 2);
        image.setAttribute('y', start.y - h / 2);
        // Ícone escondido (scale 0) — estoura junto do disco na hora do nó,
        // senão os 6 ícones já aparecem todos antes de qualquer conexão.
        gsap.set(image, { rotation: 0, scale: 0, svgOrigin: `${start.x} ${start.y}` });
      }

      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      gsap.set(circle, { scale: 0, svgOrigin: `${start.x} ${start.y}` });
      gsap.set(node, { opacity: 1 });
    });

    const tl = gsap.timeline();

    // 1. Título entra de cima
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });

    // 1b. Bullets entram em cascata logo abaixo do título
    tl.to(bullets, { opacity: 1, y: 0, duration: DURATION.base, stagger: 0.08, ease: EASE.snappy }, '-=0.2');

    // 2. Núcleo "Claude" estoura no centro
    tl.to(center, { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn }, '-=0.15');

    // 3. 6 nós surgindo UM A UM — pra cada nó: a linha estica do centro até a
    // posição, o disco estoura no fim da linha e o ícone aparece junto. O passo
    // (step) é maior que antes pra cada nó completar antes do próximo começar →
    // leitura sequencial de "conexão sendo feita", não tudo de uma vez.
    tl.addLabel('nodes', '-=0.1');
    const step = 0.42;
    nodes.forEach((node, i) => {
      const line = node.querySelector('line');
      const circle = node.querySelector('circle');
      const image = node.querySelector('image');
      const at = i * step;
      tl.to(line, { strokeDashoffset: 0, duration: 0.32, ease: EASE.snappy }, `nodes+=${at}`);
      tl.to(circle, { scale: 1, duration: 0.34, ease: EASE.explosive }, `nodes+=${at + 0.26}`);
      if (image) tl.to(image, { scale: 1, duration: 0.3, ease: EASE.explosive }, `nodes+=${at + 0.3}`);
    });

    // 4. Microcopy final fecha
    tl.to(microcopy, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.15');

    // 5. Vida contínua: glow + nós vagando pelo slide + pulsos + scan radial
    tl.add(() => {
      centerGlow = glowLoop(centerCircle);

      // Destrava o dash pra linha não cortar quando esticar atrás do nó
      nodes.forEach((node) => {
        const line = node.querySelector('line');
        line.style.strokeDasharray = 'none';
        line.style.strokeDashoffset = 0;
      });

      // --- Scan radial (sonar) saindo do centro ---
      const scan = document.createElementNS(SVG_NS, 'g');
      scan.classList.add('b03-scan');
      svg.insertBefore(scan, orbit); // atrás dos nós → ambiente
      createdEls.push(scan);

      for (let r = 0; r < 2; r++) {
        const ring = document.createElementNS(SVG_NS, 'circle');
        ring.setAttribute('cx', CENTER.x);
        ring.setAttribute('cy', CENTER.y);
        ring.setAttribute('r', 60);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', 'var(--accent)');
        ring.setAttribute('stroke-width', '1.5');
        scan.appendChild(ring);
        const t = gsap.fromTo(
          ring,
          { attr: { r: 60 }, opacity: 0.35 },
          { attr: { r: 240 }, opacity: 0, duration: 2.6, ease: 'power1.out', repeat: -1, delay: r * 1.3 }
        );
        loopTweens.push(t);
      }

      // --- Refs por nó + pulso de luz viajando até a posição ATUAL do nó ---
      const refs = nodes.map((node, i) => {
        const line = node.querySelector('line');
        const circle = node.querySelector('circle');
        const image = node.querySelector('image');
        const imgW = image ? parseFloat(image.getAttribute('width')) : 0;
        const imgH = image ? parseFloat(image.getAttribute('height')) : 0;

        const pulse = document.createElementNS(SVG_NS, 'circle');
        pulse.classList.add('b03-pulse');
        pulse.setAttribute('r', '5');
        pulse.setAttribute('cx', CENTER.x);
        pulse.setAttribute('cy', CENTER.y);
        pulse.setAttribute('fill', 'var(--accent)');
        pulse.setAttribute('opacity', '0');
        node.insertBefore(pulse, circle); // sob o ícone → "chega atrás"
        createdEls.push(pulse);

        const pt = gsap.to(
          { p: 0 },
          {
            p: 1,
            duration: 1.2,
            ease: 'power1.inOut',
            repeat: -1,
            repeatDelay: 0.5,
            delay: i * 0.32,
            onUpdate() {
              const p = this.targets()[0].p;
              const s = state[i]; // posição viva do nó neste frame
              pulse.setAttribute('cx', lerp(CENTER.x, s.x, p));
              pulse.setAttribute('cy', lerp(CENTER.y, s.y, p));
              let o = 1;
              if (p < 0.18) o = p / 0.18;
              else if (p > 0.8) o = (1 - p) / 0.2;
              pulse.setAttribute('opacity', o);
            },
          }
        );
        loopTweens.push(pt);

        return { line, circle, image, imgW, imgH };
      });

      // --- Clock contínuo: move cada nó pela sua trajetória ampla ---
      // gsap.ticker entrega o tempo GLOBAL (desde o load), não 0. Ancoramos no
      // primeiro frame pra a roam começar em t=0 — exatamente onde a intro
      // deixou os nós (nodePos(i,0)). Sem isso, os 6 nós teletransportam de uma
      // vez no instante em que o ticker assume → glitch visível.
      let t0 = null;
      tickerFn = (time) => {
        if (t0 === null) t0 = time;
        const t = time - t0;
        for (let i = 0; i < nodes.length; i++) {
          const pos = nodePos(i, t);
          state[i] = pos;
          const { line, circle, image, imgW, imgH } = refs[i];
          line.setAttribute('x2', pos.x);
          line.setAttribute('y2', pos.y);
          circle.setAttribute('cx', pos.x);
          circle.setAttribute('cy', pos.y);
          if (image) {
            image.setAttribute('x', pos.x - imgW / 2);
            image.setAttribute('y', pos.y - imgH / 2);
          }
        }
      };
      gsap.ticker.add(tickerFn);
    }, '+=0.3');
  },
  onHide() {
    killAll();
  },
});
