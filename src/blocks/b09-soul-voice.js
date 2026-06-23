import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b09', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b09-plus')) {
      gsap.fromTo(
        fragment,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.base, ease: EASE.bounceIn }
      );
    } else {
      enterFrom(fragment);
    }
  },
});
