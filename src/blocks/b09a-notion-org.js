import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

const SCAN_END = -1160;
const SCAN_HOLD = 4;        // pausa na coluna Nome antes de começar a ir pra direita
const SCAN_FORWARD = 60;    // duração do scan linear pra direita
const SCAN_RETURN = 4;      // duração do retorno suave pro início

let scanTween = null;

registerBlock('b09a', {
  onShow(section) {
    scanTween?.kill();

    const badge    = section.querySelector('.b09a-notion-badge');
    const title    = section.querySelector('.b09a-headline .t-title');
    const window_  = section.querySelector('.b09a-window');
    const track    = section.querySelector('.b09a-table-track');
    const rows     = section.querySelectorAll('.b09a-tr');

    gsap.set([badge, title], { opacity: 0, y: 18 });
    gsap.set(window_, { opacity: 0, y: 24, scale: 0.985, transformOrigin: '50% 50%' });
    gsap.set(rows, { opacity: 0, y: 6 });
    // Garante que o track começa SEMPRE na coluna Nome
    gsap.set(track, { x: 0 });

    const tl = gsap.timeline();
    tl.to(badge,   { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(title,   { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.2');
    tl.to(window_, { opacity: 1, y: 0, scale: 1, duration: DURATION.slow, ease: EASE.snappy }, '-=0.15');
    tl.to(rows,    { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', stagger: 0.06 }, '-=0.4');

    // Loop: hold 4s na coluna Nome → scan linear → retorno suave pro início
    tl.add(() => {
      scanTween = gsap.timeline({ repeat: -1 });
      scanTween.to(track, { x: 0,         duration: SCAN_HOLD });
      scanTween.to(track, { x: SCAN_END,  duration: SCAN_FORWARD, ease: 'none' });
      scanTween.to(track, { x: 0,         duration: SCAN_RETURN,  ease: 'power2.inOut' });
    });
  },
  onHide() {
    scanTween?.kill();
    scanTween = null;
  },
});
