import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b05', {
  onShow(section) {
    const title = section.querySelector('.b05-title');
    const books = section.querySelectorAll('.b05-book');
    const microcopy = section.querySelector('.b05-microcopy');

    gsap.set([title, microcopy], { opacity: 0, y: 24 });
    gsap.set(books, { opacity: 0, y: -260, rotate: -10 });

    const tl = gsap.timeline();

    // 1. Título entra
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });

    // 2. Livros caem em cascata, um por um, com bounce
    tl.to(
      books,
      {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: DURATION.slow,
        ease: EASE.bounceIn,
        stagger: 0.18,
      },
      '-=0.1'
    );

    // 3. Microcopy fecha
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.2'
    );
  },
});
