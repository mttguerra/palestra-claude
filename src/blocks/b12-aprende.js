import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b12', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const cmds = section.querySelectorAll('.b12-cmd');
    const level = section.querySelector('.b12-level');
    const fill = level?.querySelector('.b12-fill');
    const final = section.querySelector('.b12-final');
    const glow = final?.querySelector('.accent-glow');
    const microcopy = section.querySelector('.b12-microcopy');

    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(level, { opacity: 0 });
    gsap.set(fill, { width: '20%' });
    gsap.set(final, { opacity: 0, y: 30 });

    // Cards começam ESPALHADOS ao redor, rotacionados, escala reduzida
    const scattered = [
      { x: -260, y: -120, rotation: -14 },
      { x:  240, y: -150, rotation:  16 },
      { x: -200, y:  130, rotation:  11 },
      { x:  280, y:   90, rotation:  -9 },
    ];
    cmds.forEach((cmd, i) => {
      gsap.set(cmd, {
        ...scattered[i],
        opacity: 0,
        scale: 0.8,
        transformOrigin: '50% 50%',
      });
    });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    // Convergência: cards voam dos cantos e se alinham na fila
    tl.to(
      cmds,
      {
        x: 0, y: 0, rotation: 0, opacity: 1, scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.13,
      },
      '-=0.1'
    );
    tl.to(level, { opacity: 1, duration: 0.3 }, '+=0.1');
    tl.to(fill, { width: '92%', duration: 1.0, ease: EASE.snappy }, '-=0.1');
    tl.to(
      final,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive },
      '-=0.4'
    );
    if (glow) {
      tl.to(glow, { textShadow: '0 0 24px var(--accent)', duration: 0.4 }, '-=0.1');
    }
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.1'
    );
  },
});
