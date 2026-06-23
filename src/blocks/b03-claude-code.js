import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, glowLoop } from '../animations/helpers.js';

let centerGlow = null;

registerBlock('b03', {
  onShow(section) {
    centerGlow?.kill();

    const title = section.querySelector('.b03-title');
    const center = section.querySelector('.b03-center');
    const centerCircle = center.querySelector('circle');
    const nodes = section.querySelectorAll('.b03-node');
    const microcopy = section.querySelector('.b03-microcopy');

    // Estado inicial
    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(center, { opacity: 0, scale: 0, transformOrigin: '400px 250px' });

    nodes.forEach((node) => {
      const line = node.querySelector('line');
      const circle = node.querySelector('circle');
      const text = node.querySelector('text');
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      const cx = parseFloat(circle.getAttribute('cx'));
      const cy = parseFloat(circle.getAttribute('cy'));
      gsap.set(circle, { scale: 0, transformOrigin: `${cx}px ${cy}px` });
      gsap.set(text, { opacity: 0 });
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
      const text = node.querySelector('text');
      const at = i * stagger;
      tl.to(line, { strokeDashoffset: 0, duration: 0.4, ease: EASE.snappy }, `nodes+=${at}`);
      tl.to(
        circle,
        { scale: 1, duration: 0.4, ease: EASE.explosive },
        `nodes+=${at + 0.15}`
      );
      tl.to(text, { opacity: 1, duration: 0.2 }, `nodes+=${at + 0.3}`);
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
  },
  onHide() {
    centerGlow?.kill();
    centerGlow = null;
  },
});
