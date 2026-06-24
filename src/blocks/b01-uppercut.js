import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, pulse } from '../animations/helpers.js';

registerBlock('b01', {
  onShow(section) {
    const art = section.querySelector('.b01-art');
    const eyebrow = section.querySelector('.b01-eyebrow');
    const lineSm = section.querySelector('.b01-line--sm');
    const lineXl = section.querySelector('.b01-line--xl');
    const winner = section.querySelector('.b01-winner');

    // Se for vídeo, reinicia do zero a cada entrada no slide
    if (art && art.tagName === 'VIDEO') {
      try { art.currentTime = 0; art.play(); } catch (_) {}
    }

    gsap.set(art, { opacity: 0 });
    gsap.set([eyebrow, lineSm, lineXl, winner], { opacity: 0, y: 16 });

    const tl = gsap.timeline();
    tl.fromTo(
      art,
      { opacity: 0, scale: 0.7, rotate: -8 },
      { opacity: 1, scale: 1, rotate: 0, duration: DURATION.slow, ease: EASE.bounceIn }
    );
    tl.to(eyebrow, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.3');
    tl.to(lineSm,  { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.25');
    tl.to(lineXl,  { opacity: 1, y: 0, duration: DURATION.slow, ease: EASE.explosive }, '-=0.2');
    tl.to(winner,  { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.15');
    tl.add(() => {
      const accent = lineXl?.querySelector('.accent');
      if (accent) pulse(accent, { scale: 1.12 });
    }, '+=0.1');
  },
});
