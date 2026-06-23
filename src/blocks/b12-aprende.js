import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b12', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b12-cmd')) {
      enterFrom(fragment, { x: -60, y: 0 });
    } else if (fragment.classList.contains('b12-level')) {
      const fill = fragment.querySelector('.b12-fill');
      gsap.fromTo(fragment, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        fill,
        { width: '20%' },
        { width: '92%', duration: 1.2, ease: EASE.snappy, delay: 0.2 }
      );
    } else if (fragment.classList.contains('b12-final')) {
      const tl = gsap.timeline();
      tl.fromTo(
        fragment,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }
      );
      tl.to(fragment.querySelector('.accent-glow'), {
        textShadow: '0 0 24px var(--accent)',
        duration: 0.4,
      });
    } else {
      enterFrom(fragment);
    }
  },
});
