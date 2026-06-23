import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION, staggerIn } from '../animations/helpers.js';

const FAKE_LINES = [
  '$ claude-code "analisa esse reel pra mim"',
  '',
  '> lendo viral_x.mp4...',
  '> transcrevendo audio (1:24)...',
  '> extraindo gancho (0-3s)...',
  '> casando voz: xicoria',
  '> gerando roteiro v1...',
  '',
  '> /validar-criativo',
  '> agent: memoria   [ok]',
  '> agent: hook      [ok]',
  '> agent: corpo     [ok]',
  '> agent: criativo  [ok]',
  '> agent: oferta    [ok]',
  '> agent: voz       [ok]',
  '> agent: refino    [ok]',
  '',
  '> CCO: nota 96/100  ✓',
  '> done.',
];

let scheduled = null;

registerBlock('b04', {
  onShow(section) {
    scheduled?.kill();
    const stream = section.querySelector('#b04-stream');
    stream.textContent = '';

    const headline = section.querySelector('.b04-headline');
    const phases = section.querySelectorAll('.b04-phase');
    const punch = section.querySelector('.b04-punch');

    gsap.set(headline, { opacity: 0, y: 24 });
    gsap.set(punch, { opacity: 0, y: 20 });

    const tl = gsap.timeline();
    tl.to(headline, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.add(() => staggerIn(phases, { y: 18, stagger: 0.1 }), '-=0.15');
    tl.to(punch, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=0.5');

    let i = 0;
    let buffer = '';
    const tick = () => {
      if (i >= FAKE_LINES.length) {
        scheduled = null;
        return;
      }
      buffer += FAKE_LINES[i] + '\n';
      stream.textContent = buffer;
      i++;
      scheduled = gsap.delayedCall(0.13, tick);
    };
    scheduled = gsap.delayedCall(0.25, tick);
  },
  onHide() {
    scheduled?.kill();
    scheduled = null;
  },
});
