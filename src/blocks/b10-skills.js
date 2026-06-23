import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b10', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b10-skill')) {
      const tl = gsap.timeline();
      tl.fromTo(
        fragment,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: DURATION.base, ease: EASE.explosive }
      );
      tl.to(
        fragment,
        {
          boxShadow: '0 0 0 2px var(--accent), 0 0 24px rgba(232,254,3,0.4)',
          duration: 0.2,
        },
        '-=0.1'
      );
    } else {
      enterFrom(fragment);
    }
  },
});
