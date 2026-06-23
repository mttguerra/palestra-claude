import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b02', {
  onShow(section) {
    const art = section.querySelector('.b02-art');
    const copy = section.querySelector('.b02-copy');
    const title = copy?.querySelector('h2');
    const sub = copy?.querySelector('p');

    gsap.set([art, title, sub], { opacity: 0 });

    const tl = gsap.timeline();
    tl.fromTo(
      art,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: DURATION.slow, ease: EASE.bounceIn }
    );
    tl.fromTo(
      title,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive },
      '-=0.2'
    );
    tl.fromTo(
      sub,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.25'
    );
  },
});
