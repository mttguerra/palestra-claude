import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b05', {
  onShow(section) {
    const title = section.querySelector('.b05-title');
    const desc = section.querySelector('.b05-desc');
    const microcopy = section.querySelector('.b05-microcopy');
    const books = section.querySelectorAll('.b05-book');

    gsap.set([title, desc, microcopy], { opacity: 0, y: 24 });
    gsap.set(books, { opacity: 0, y: -200 });

    const tl = gsap.timeline();

    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });

    tl.to(
      books,
      {
        opacity: 1,
        y: 0,
        duration: DURATION.slow,
        ease: EASE.bounceIn,
        stagger: 0.14,
      },
      '-=0.15'
    );

    tl.to(
      desc,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.45'
    );

    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.2'
    );
  },
});
