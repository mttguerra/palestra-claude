import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b07', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const workers = section.querySelectorAll('.b07-worker');
    const microcopy = section.querySelector('.b07-microcopy');

    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(workers, { opacity: 0, x: 80 });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(
      workers,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.12 },
      '-=0.15'
    );
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.1'
    );
  },
});
