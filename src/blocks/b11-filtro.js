import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b11', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b11-station')) {
      const tl = gsap.timeline();
      tl.fromTo(
        fragment,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: EASE.explosive }
      );
      tl.to(fragment, { background: 'var(--success)', color: 'var(--bg-1)', duration: 0.2 });
    } else if (fragment.classList.contains('b11-verdict')) {
      gsap.fromTo(
        fragment,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else {
      enterFrom(fragment);
    }
  },
});
