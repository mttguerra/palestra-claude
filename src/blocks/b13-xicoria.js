import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b13', {
  onShow(section) {
    const before = section.querySelector('.b13-before');
    const arrow = section.querySelector('.b13-arrow');
    const after = section.querySelector('.b13-after');
    const numbers = section.querySelector('.b13-numbers');
    const numberItems = numbers ? numbers.children : [];
    const microcopy = section.querySelector('.b13-microcopy');

    if (before) gsap.set(before, { filter: 'grayscale(1)', opacity: 1 });
    gsap.set(arrow, { opacity: 0 });
    gsap.set(after, { opacity: 0, x: 60 });
    gsap.set(numbers, { opacity: 1 });
    gsap.set(numberItems, { opacity: 0, y: 30 });
    gsap.set(microcopy, { opacity: 0, y: 24 });

    const tl = gsap.timeline();
    tl.to(arrow, { opacity: 1, duration: DURATION.base, ease: EASE.snappy }, '+=0.2');
    tl.to(
      after,
      { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE.bounceIn },
      '-=0.2'
    );
    tl.to(
      numberItems,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.12 },
      '+=0.1'
    );
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.1'
    );
  },
});
