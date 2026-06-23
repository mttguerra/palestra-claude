import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b08', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const items = section.querySelectorAll('.b08-list li');

    gsap.set(title, { opacity: 0, y: 24 });
    items.forEach((item) => {
      gsap.set(item, { opacity: 0, x: -40 });
      const num = item.querySelector('.b08-num');
      if (num) gsap.set(num, { scale: 0, transformOrigin: '50% 50%' });
    });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.addLabel('items', '-=0.15');

    const stagger = 0.14;
    items.forEach((item, i) => {
      const at = i * stagger;
      const num = item.querySelector('.b08-num');
      tl.to(
        item,
        { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive },
        `items+=${at}`
      );
      if (num) {
        tl.to(
          num,
          { scale: 1, duration: DURATION.base, ease: EASE.bounceIn },
          `items+=${at + 0.15}`
        );
      }
    });
  },
});
