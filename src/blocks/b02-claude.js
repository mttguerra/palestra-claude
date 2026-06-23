import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b02', {
  onShow(section) {
    const art = section.querySelector('.b02-art');
    const copy = section.querySelector('.b02-copy');
    gsap.set([art, copy], { opacity: 0 });
  },
  onFragmentShown({ fragment }) {
    gsap.fromTo(
      fragment,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }
    );
  },
  onFragmentHidden({ fragment }) {
    gsap.to(fragment, { opacity: 0, y: 30, duration: 0.25, ease: EASE.exit });
  },
});
