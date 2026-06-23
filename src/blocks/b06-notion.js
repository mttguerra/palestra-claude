import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

let heartPulse = null;

registerBlock('b06', {
  onHide() {
    heartPulse?.kill();
    heartPulse = null;
  },
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b06-heart')) {
      heartPulse?.kill();
      gsap.fromTo(
        fragment,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.slow, ease: EASE.bounceIn }
      );
      heartPulse = gsap.to(fragment, { scale: 1.08, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
    } else if (fragment.classList.contains('b06-in')) {
      enterFrom(fragment, { x: -40, y: 0 });
    } else if (fragment.classList.contains('b06-out')) {
      enterFrom(fragment, { x: 40, y: 0 });
    } else {
      enterFrom(fragment);
    }
  },
});
