import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b02', {
  onShow(section) {
    const eyebrow = section.querySelector('.b02-eyebrow');
    const art = section.querySelector('.b02-art');
    const title = section.querySelector('.b02-title');
    const sub = section.querySelector('.b02-sub');

    gsap.set(eyebrow, { opacity: 0, y: -10 });
    gsap.set(art, { opacity: 0, scale: 0.94, y: 24 });
    gsap.set(title, { opacity: 0, y: 18 });
    gsap.set(sub, { opacity: 0, y: 14 });

    const tl = gsap.timeline();
    tl.to(eyebrow, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(
      art,
      { opacity: 1, scale: 1, y: 0, duration: DURATION.slow, ease: EASE.bounceIn },
      '-=0.1'
    );
    tl.to(
      title,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive },
      '-=0.2'
    );
    tl.to(
      sub,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.25'
    );
  },
});
