import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b07', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b07-worker')) {
      gsap.fromTo(
        fragment,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATION.base, ease: EASE.explosive }
      );
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
