import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b09', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const pillars = section.querySelectorAll('.b09-pillar');
    const plus = section.querySelector('.b09-plus');
    const voicespec = section.querySelector('.b09-voicespec');
    const compare = section.querySelector('.b09-compare');
    const microcopy = section.querySelector('.b09-microcopy');

    gsap.set(title, { opacity: 0, y: 24 });
    gsap.set(pillars, { opacity: 0, y: 30 });
    gsap.set(plus, { opacity: 0, scale: 0 });
    gsap.set([voicespec, compare, microcopy], { opacity: 0, y: 24 });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(pillars[0], { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }, '-=0.1');
    tl.to(plus, { opacity: 1, scale: 1, duration: DURATION.base, ease: EASE.bounceIn }, '-=0.15');
    tl.to(pillars[1], { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }, '-=0.15');
    tl.to(voicespec, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.1');
    tl.to(compare, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.25');
    tl.to(microcopy, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.1');
  },
});
