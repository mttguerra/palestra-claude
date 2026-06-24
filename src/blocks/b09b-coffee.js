import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

registerBlock('b09b', {
  onShow(section) {
    const headline = section.querySelector('.b09b-headline');
    const machine = section.querySelector('.b09b-machine-wrap');
    const steps = section.querySelectorAll('.b09b-steps li');
    const press = section.querySelector('.b09b-press');

    gsap.set([headline, press], { opacity: 0, y: 24 });
    gsap.set(machine, { opacity: 0, scale: 0.94 });
    gsap.set(steps, { opacity: 0, x: -16 });

    const tl = gsap.timeline();
    tl.to(headline, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(machine,  { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn }, '-=0.15');
    tl.to(steps,    { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.snappy, stagger: 0.1 }, '-=0.45');
    tl.to(press,    { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.1');
  },
});
