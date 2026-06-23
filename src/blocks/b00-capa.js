import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b00', {
  onShow(section) {
    const eyebrow = section.querySelector('.b00-eyebrow');
    const title = section.querySelector('.b00-title');
    const divider = section.querySelector('.b00-divider');
    const presenter = section.querySelector('.b00-presenter');
    const photo = section.querySelector('.b00-photo');

    gsap.set([eyebrow, title, divider, presenter, photo], { opacity: 0 });

    const tl = gsap.timeline();
    tl.fromTo(
      photo,
      { opacity: 0, x: 40, scale: 0.96 },
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: EASE.snappy }
    );
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: -16, letterSpacing: '0.4em' },
      { opacity: 1, y: 0, letterSpacing: '0.2em', duration: DURATION.slow, ease: EASE.snappy },
      '-=0.5'
    );
    tl.fromTo(
      title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: EASE.explosive },
      '-=0.3'
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
