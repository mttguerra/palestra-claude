import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, enterFrom } from '../animations/helpers.js';

registerBlock('b14', {
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b14-recap')) {
      gsap.from(fragment.children, {
        opacity: 0,
        x: -10,
        stagger: 0.04,
        duration: 0.2,
        ease: EASE.snappy,
      });
    } else {
      enterFrom(fragment);
    }
  },
});
