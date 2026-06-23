import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, glowLoop } from '../animations/helpers.js';

registerBlock('b03', {
  onShow(section) {
    const center = section.querySelector('.b03-center circle');
    gsap.set(section.querySelectorAll('.b03-node'), { opacity: 0 });
    // Pulso contínuo no centro
    glowLoop(center);

    // Prepara linhas pra "desenhar" via stroke-dashoffset
    section.querySelectorAll('.b03-node line').forEach((line) => {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
    });
  },
  onFragmentShown({ fragment }) {
    if (fragment.classList.contains('b03-node')) {
      const line = fragment.querySelector('line');
      const circle = fragment.querySelector('circle');
      const text = fragment.querySelector('text');

      const tl = gsap.timeline();
      gsap.set(fragment, { opacity: 1 });
      tl.to(line, { strokeDashoffset: 0, duration: DURATION.base, ease: EASE.snappy });
      tl.fromTo(
        circle,
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: DURATION.base, ease: EASE.explosive },
        '-=0.2'
      );
      tl.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.2 }, '-=0.15');
    } else {
      gsap.fromTo(fragment, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive });
    }
  },
});
