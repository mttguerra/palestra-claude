import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b14', {
  onShow(section) {
    const recap = section.querySelector('.b14-recap');
    const recapChildren = recap ? recap.children : [];
    const punch = section.querySelector('.b14-punch');
    const cta = section.querySelector('.b14-cta');
    const finalImg = section.querySelector('.b14-final');
    const microcopy = section.querySelector('.b14-microcopy');

    gsap.set(recap, { opacity: 1 });
    gsap.set(recapChildren, { opacity: 0, x: -10 });
    gsap.set([punch, cta, finalImg, microcopy], { opacity: 0, y: 24 });

    const tl = gsap.timeline();
    tl.to(recapChildren, { opacity: 1, x: 0, duration: 0.2, ease: EASE.snappy, stagger: 0.04 });
    tl.to(
      punch,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive },
      '+=0.15'
    );
    tl.to(
      cta,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.1'
    );
    tl.to(
      finalImg,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.1'
    );
    tl.to(
      microcopy,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.05'
    );
  },
});
