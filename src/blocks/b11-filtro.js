import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b11', {
  onShow(section) {
    const title = section.querySelector('.t-title');
    const criativo = section.querySelector('.b11-card');
    const stations = section.querySelectorAll('.b11-station');
    const verdict = section.querySelector('.b11-verdict');
    const microcopy = section.querySelector('.b11-microcopy');

    gsap.set([title, criativo, microcopy], { opacity: 0, y: 24 });
    gsap.set(stations, { opacity: 0, y: -20 });
    gsap.set(verdict, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(criativo, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.2');
    tl.to(
      stations,
      { opacity: 1, y: 0, duration: 0.3, ease: EASE.explosive, stagger: 0.08 },
      '-=0.1'
    );
    tl.to(
      stations,
      {
        background: 'var(--success)',
        color: 'var(--bg-1)',
        duration: 0.2,
        stagger: 0.08,
      },
      '-=0.55'
    );
    tl.to(
      verdict,
      { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn },
      '+=0.1'
    );
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.1'
    );
  },
});
