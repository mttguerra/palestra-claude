import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { enterFrom, staggerIn } from '../animations/helpers.js';

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

    const phases = section.querySelectorAll('.b04-phase');
    staggerIn(phases, { y: 18, stagger: 0.1 });

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
  onFragmentShown({ fragment }) {
    enterFrom(fragment);
  },
});
