import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b06', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b06-heart')) {
      gsap.fromTo(
        fragment,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.slow, ease: EASE.bounceIn }
      );
      // Pulse contínuo
      gsap.to(fragment, { scale: 1.08, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
    } else {
      gsap.fromTo(fragment, { opacity: 0, x: fragment.classList.contains('b06-in') ? -40 : 40 }, { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
