import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b05', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b05-book')) {
      gsap.fromTo(
        fragment,
        { y: -240, opacity: 0, rotate: -10 },
        { y: 0, opacity: 1, rotate: 0, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else {
      enterFrom(fragment);
    }
  },
});
