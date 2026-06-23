import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b10', {
  onShow(section) {
    const coffee = section.querySelector('.b10-coffee');
    const title = section.querySelector('.t-title');
    const skills = section.querySelectorAll('.b10-skill');
    const microcopy = section.querySelector('.b10-microcopy');

    gsap.set([coffee, title, microcopy], { opacity: 0, y: 24 });
    gsap.set(skills, { opacity: 0, x: 80 });

    const tl = gsap.timeline();
    tl.to(coffee, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.2');
    tl.to(
      skills,
      {
        opacity: 1,
        x: 0,
        duration: DURATION.base,
        ease: EASE.explosive,
        stagger: 0.09,
      },
      '-=0.1'
    );
    tl.to(
      skills,
      {
        boxShadow: '0 0 0 2px var(--accent), 0 0 24px rgba(232,254,3,0.4)',
        duration: 0.25,
        stagger: 0.09,
      },
      '-=0.45'
    );
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.1'
    );
  },
});
