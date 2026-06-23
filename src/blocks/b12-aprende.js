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
    gsap.set(cmds, { opacity: 0, x: -60 });
    gsap.set(level, { opacity: 0 });
    gsap.set(fill, { width: '20%' });
    gsap.set(final, { opacity: 0, y: 30 });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(
      cmds,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.14 },
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
