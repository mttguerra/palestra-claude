import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, enterFrom } from '../animations/helpers.js';

registerBlock('b02', {
  onFragmentShown({ fragment }) {
    enterFrom(fragment);
  },
  onFragmentHidden({ fragment }) {
    gsap.to(fragment, { opacity: 0, y: 30, duration: 0.25, ease: EASE.exit });
  },
});
