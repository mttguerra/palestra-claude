import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b05', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b05-book')) {
      gsap.fromTo(
        fragment,
        { y: -240, opacity: 0, rotate: -10 },
        { y: 0, opacity: 1, rotate: 0, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
