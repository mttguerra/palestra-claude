import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

let notionGlow = null;
let arteryResizeRO = null;

const ARTERY_IDS = {
  in:  ['#b06-art-l-top', '#b06-art-l-mid', '#b06-art-l-bot'],
  out: ['#b06-art-r-top', '#b06-art-r-mid', '#b06-art-r-bot'],
};

function drawArteries(section) {
  const hub = section.querySelector('.b06-hub');
  const svg = section.querySelector('.b06-arteries');
  const heart = section.querySelector('.b06-heart');
  const inCards = section.querySelectorAll('.b06-in .b06-card');
  const outCards = section.querySelectorAll('.b06-out .b06-card');
  if (!hub || !svg || !heart || inCards.length !== 3 || outCards.length !== 3) return;

  const hubRect = hub.getBoundingClientRect();
  const heartRect = heart.getBoundingClientRect();
  if (!hubRect.width || !hubRect.height) return;

  svg.setAttribute('viewBox', `0 0 ${hubRect.width} ${hubRect.height}`);

  const heartCx = heartRect.left + heartRect.width / 2 - hubRect.left;
  const heartCy = heartRect.top + heartRect.height / 2 - hubRect.top;
  // Borda do PNG do coração (≈80% do box visualmente)
  const heartR = (heartRect.width / 2) * 0.82;

  function buildPath(cardRect, side) {
    const cardEdgeX = side === 'in' ? cardRect.right : cardRect.left;
    const cardX = cardEdgeX - hubRect.left;
    const cardY = cardRect.top + cardRect.height / 2 - hubRect.top;

    const dx = cardX - heartCx;
    const dy = cardY - heartCy;
    const len = Math.hypot(dx, dy) || 1;
    const heartX = heartCx + (dx / len) * heartR;
    const heartY = heartCy + (dy / len) * heartR;

    // Bézier cúbico — sai horizontal do card, curva pra borda do coração
    const dirX = side === 'in' ? 1 : -1;
    const dist = Math.abs(heartX - cardX);
    const c1x = cardX + dirX * dist * 0.55;
    const c1y = cardY;
    const c2x = heartX - dirX * dist * 0.30;
    const c2y = heartY;

    const m = side === 'in'
      ? [cardX, cardY, c1x, c1y, c2x, c2y, heartX, heartY]
      : [heartX, heartY, c2x, c2y, c1x, c1y, cardX, cardY];
    const f = m.map((v) => v.toFixed(1));
    return `M ${f[0]} ${f[1]} C ${f[2]} ${f[3]}, ${f[4]} ${f[5]}, ${f[6]} ${f[7]}`;
  }

  inCards.forEach((card, i) => {
    const path = svg.querySelector(ARTERY_IDS.in[i]);
    if (path) path.setAttribute('d', buildPath(card.getBoundingClientRect(), 'in'));
  });
  outCards.forEach((card, i) => {
    const path = svg.querySelector(ARTERY_IDS.out[i]);
    if (path) path.setAttribute('d', buildPath(card.getBoundingClientRect(), 'out'));
  });
}

registerBlock('b06', {
  onShow(section) {
    notionGlow?.kill();
    arteryResizeRO?.disconnect();

    const title = section.querySelector('.b06-title');
    const inSide = section.querySelector('.b06-in');
    const outSide = section.querySelector('.b06-out');
    const inCards = inSide?.querySelectorAll('.b06-card') ?? [];
    const outCards = outSide?.querySelectorAll('.b06-card') ?? [];
    const center = section.querySelector('.b06-heart');
    const arteries = section.querySelector('.b06-arteries');
    const hub = section.querySelector('.b06-hub');
    const punch = section.querySelector('.b06-punch');
    const complement = section.querySelector('.b06-complement');

    // Mede posições reais ANTES de aplicar transforms iniciais
    drawArteries(section);
    if (hub && 'ResizeObserver' in window) {
      arteryResizeRO = new ResizeObserver(() => drawArteries(section));
      arteryResizeRO.observe(hub);
    }

    gsap.set([title, punch, complement], { opacity: 0, y: 24 });
    gsap.set([inSide, outSide], { opacity: 1 });
    gsap.set(inCards, { opacity: 0, x: -40 });
    gsap.set(outCards, { opacity: 0, x: 40 });
    gsap.set(center, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(
      inCards,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.08 },
      '-=0.15'
    );
    tl.to(
      outCards,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.08 },
      '<'
    );
    tl.to(
      center,
      { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn },
      '-=0.35'
    );
    tl.to(punch,      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.1');
    tl.to(complement, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.2');

    tl.add(() => {
      const REST = '#0a0a0a';
      const BEAT = '#C9202C';
      const allCards = [...inCards, ...outCards];
      const arteryBase = section.querySelectorAll('.b06-art-base use');
      const arteryFlow = section.querySelectorAll('.b06-art-flow use');

      // Estado inicial das artérias (inline style → vence o CSS)
      gsap.set(arteryBase, { stroke: REST, strokeWidth: 9 });
      gsap.set(arteryFlow, { stroke: REST, strokeWidth: 6 });

      notionGlow = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });

      // BATIDA — coração, artérias e bolsões TUDO preto → vermelho ao mesmo tempo
      notionGlow.to(center, { backgroundColor: BEAT, scale: 1.04, duration: 0.9 }, 0);
      if (arteryBase.length) notionGlow.to(arteryBase, { stroke: BEAT, strokeWidth: 11, duration: 0.9 }, 0);
      if (arteryFlow.length) notionGlow.to(arteryFlow, { stroke: BEAT, strokeWidth: 8,  duration: 0.9 }, 0);
      if (allCards.length)   notionGlow.to(allCards,   { backgroundColor: BEAT, scale: 1.03, duration: 0.9 }, 0);

      // RELAXAMENTO — todos voltam ao preto juntos
      notionGlow.to(center, { backgroundColor: REST, scale: 1.0, duration: 1.1 }, 0.9);
      if (arteryBase.length) notionGlow.to(arteryBase, { stroke: REST, strokeWidth: 9, duration: 1.1 }, 0.9);
      if (arteryFlow.length) notionGlow.to(arteryFlow, { stroke: REST, strokeWidth: 6, duration: 1.1 }, 0.9);
      if (allCards.length)   notionGlow.to(allCards,   { backgroundColor: REST, scale: 1.0, duration: 1.1 }, 0.9);

      // PAUSA entre batidas
      notionGlow.to(center, { duration: 0.4 });
    });
  },
  onHide() {
    notionGlow?.kill();
    notionGlow = null;
    arteryResizeRO?.disconnect();
    arteryResizeRO = null;
  },
});
