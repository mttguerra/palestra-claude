import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b09', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const cols = section.querySelectorAll('.b09-col');
    const plus = section.querySelector('.b09-plus');
    const microcopy = section.querySelector('.b09-microcopy');

    gsap.set(title, { opacity: 0, y: 24 });
    gsap.set(cols, { opacity: 0, y: 30 });
    gsap.set(plus, { opacity: 0, scale: 0 });
    gsap.set(microcopy, { opacity: 0, y: 24 });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(cols[0], { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }, '-=0.1');
    tl.to(plus, { opacity: 1, scale: 1, duration: DURATION.base, ease: EASE.bounceIn }, '-=0.15');
    tl.to(cols[1], { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }, '-=0.15');
    tl.to(microcopy, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.1');
  },
});
