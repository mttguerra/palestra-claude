import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

let notionGlow = null;

registerBlock('b06', {
  onShow(section) {
    notionGlow?.kill();

    const title = section.querySelector('.b06-title');
    const inSide = section.querySelector('.b06-in');
    const outSide = section.querySelector('.b06-out');
    const inCards = inSide?.querySelectorAll('.b06-card') ?? [];
    const outCards = outSide?.querySelectorAll('.b06-card') ?? [];
    const center = section.querySelector('.b06-center');
    const punch = section.querySelector('.b06-punch');
    const complement = section.querySelector('.b06-complement');

    gsap.set([title, punch, complement], { opacity: 0, y: 24 });
    gsap.set([inSide, outSide], { opacity: 1 });
    gsap.set(inCards, { opacity: 0, x: -40 });
    gsap.set(outCards, { opacity: 0, x: 40 });
    gsap.set(center, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' });

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(
      inCards,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.08 },
      '-=0.15'
    );
    tl.to(
      outCards,
      { opacity: 1, x: 0, duration: DURATION.base, ease: EASE.explosive, stagger: 0.08 },
      '<'
    );
    tl.to(
      center,
      { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASE.bounceIn },
      '-=0.35'
    );
    tl.to(
      punch,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '+=0.1'
    );
    tl.to(
      complement,
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy },
      '-=0.2'
    );
    tl.add(() => {
      notionGlow = gsap.to(center, {
        boxShadow: '0 0 60px rgba(232, 254, 3, 0.55), 0 0 120px rgba(232, 254, 3, 0.25)',
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });
  },
  onHide() {
    notionGlow?.kill();
    notionGlow = null;
  },
});
