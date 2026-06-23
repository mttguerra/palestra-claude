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
