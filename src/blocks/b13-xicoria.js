import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, enterFrom } from '../animations/helpers.js';

registerBlock('b13', {
  onShow(section) {
    // Lado "antes" entra desaturado por padrão
    const before = section.querySelector('.b13-before');
    if (before) gsap.set(before, { filter: 'grayscale(1)', opacity: 1 });
  },
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b13-after')) {
      gsap.fromTo(
        fragment,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE.bounceIn }
      );
    } else if (fragment.classList.contains('b13-numbers')) {
      gsap.from(fragment.children, {
        y: 30,
        opacity: 0,
        duration: DURATION.base,
        stagger: 0.12,
        ease: EASE.explosive,
      });
    } else {
      enterFrom(fragment);
    }
  },
});
