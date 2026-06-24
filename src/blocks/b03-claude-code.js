import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, glowLoop } from '../animations/helpers.js';

let centerGlow = null;
let orbitTween = null;
const counterTweens = [];

registerBlock('b03', {
  onShow(section) {
    centerGlow?.kill();
    orbitTween?.kill();
    counterTweens.forEach((t) => t.kill());
    counterTweens.length = 0;

    const title = section.querySelector('.b03-title');
    const center = section.querySelector('.b03-center');
    const centerCircle = center.querySelector('circle');
    const orbit = section.querySelector('.b03-orbit');
    const nodes = section.querySelectorAll('.b03-node');
    const microcopy = section.querySelector('.b03-microcopy');

    // Estado inicial
    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(center, { opacity: 0, scale: 0, svgOrigin: '400 250' });

    nodes.forEach((node) => {
      const line = node.querySelector('line');
      const circle = node.querySelector('circle');
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      const cx = parseFloat(circle.getAttribute('cx'));
      const cy = parseFloat(circle.getAttribute('cy'));
      gsap.set(circle, { scale: 0, svgOrigin: `${cx} ${cy}` });
      gsap.set(node, { opacity: 1 });
    });

    const tl = gsap.timeline();

    // 1. Título entra de cima
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });

    // 2. Núcleo "Claude" estoura no centro
    tl.to(
      center,
      { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn },
      '-=0.15'
    );

    // 3. 6 nós em cascata radial — linha desenha, círculo bounce, texto fade
    tl.addLabel('nodes', '-=0.2');
    const stagger = 0.1;
    nodes.forEach((node, i) => {
      const line = node.querySelector('line');
      const circle = node.querySelector('circle');
      const at = i * stagger;
      tl.to(line, { strokeDashoffset: 0, duration: 0.4, ease: EASE.snappy }, `nodes+=${at}`);
      tl.to(
        circle,
        { scale: 1, duration: 0.4, ease: EASE.explosive },
        `nodes+=${at + 0.15}`
      );
    });

    // 4. Microcopy final fecha
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.15'
    );

    // 5. Glow contínuo no núcleo
    tl.add(() => {
      centerGlow = glowLoop(centerCircle);
    });

    // 6. Órbita contínua dos nós ao redor do centro — 20s/volta (visível mas não tonto)
    tl.add(() => {
      const ORBIT_DUR = 20;
      orbitTween = gsap.to(orbit, {
        rotation: 360,
        duration: ORBIT_DUR,
        ease: 'none',
        repeat: -1,
        svgOrigin: '400 250',
      });

      // Contra-rotação dos ícones pra ficarem sempre em pé
      nodes.forEach((node) => {
        const image = node.querySelector('image');
        if (!image) return;
        const x = parseFloat(image.getAttribute('x'));
        const y = parseFloat(image.getAttribute('y'));
        const w = parseFloat(image.getAttribute('width'));
        const h = parseFloat(image.getAttribute('height'));
        const cx = x + w / 2;
        const cy = y + h / 2;
        const t = gsap.to(image, {
          rotation: -360,
          duration: ORBIT_DUR,
          ease: 'none',
          repeat: -1,
          svgOrigin: `${cx} ${cy}`,
        });
        counterTweens.push(t);
      });
    }, '+=0.3');
  },
  onHide() {
    centerGlow?.kill();
    centerGlow = null;
    orbitTween?.kill();
    orbitTween = null;
    counterTweens.forEach((t) => t.kill());
    counterTweens.length = 0;
  },
});
