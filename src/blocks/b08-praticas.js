import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b08', {
  onFragmentShown({ fragment }) {
    const num = fragment.querySelector('.b08-num');
    if (num) {
      const tl = gsap.timeline();
      tl.fromTo(
        fragment,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive }
      );
      tl.fromTo(
        num,
        { scale: 0 },
        { scale: 1, duration: DURATION.base, ease: EASE.bounceIn },
        '-=0.3'
      );
    } else {
      enterFrom(fragment);
    }
  },
});
