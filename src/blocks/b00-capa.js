import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b00', {
  onShow(section) {
    const title = section.querySelector('.b00-title');
    const divider = section.querySelector('.b00-divider');
    const presenter = section.querySelector('.b00-presenter');
    const photo = section.querySelector('.b00-photo');

    gsap.set([title, divider, presenter, photo], { opacity: 0 });

    const tl = gsap.timeline();
    tl.fromTo(
      photo,
      { opacity: 0, x: 40, scale: 0.96 },
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: EASE.snappy }
    );
    tl.fromTo(
      title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: EASE.explosive },
      '-=0.2'
    );
    tl.fromTo(
      divider,
      { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
      { opacity: 1, scaleX: 1, duration: 0.5, ease: EASE.snappy },
      '-=0.2'
    );
    tl.fromTo(
      presenter,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: DURATION.slow, ease: EASE.explosive },
      '-=0.1'
    );
  },
});
