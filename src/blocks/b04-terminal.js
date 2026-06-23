import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

const FAKE_LINES = [
  '$ claude-code analisar-reel viral_x.mp4',
  '> reading...',
  '> transcribing 1:24...',
  '> extracting hook (0-3s)...',
  '> matching voice profile: xicoria',
  '> generating script v1...',
  '> running /validar-criativo',
  '> agent: memoria   [ok]',
  '> agent: hook      [ok]',
  '> agent: corpo     [ok]',
  '> agent: criativo  [ok]',
  '> agent: oferta    [ok]',
  '> agent: voz       [ok]',
  '> agent: refino    [ok]',
  '> CCO: nota 96/100',
  '> done.',
];

registerBlock('b04', {
  onShow(section) {
    const stream = section.querySelector('#b04-stream');
    stream.textContent = '';

    let i = 0;
    let buffer = '';
    const tick = () => {
      if (i >= FAKE_LINES.length) return;
      buffer += FAKE_LINES[i] + '\n';
      stream.textContent = buffer;
      const lines = stream.textContent.split('\n');
      if (lines.length > 12) stream.textContent = lines.slice(-12).join('\n');
      i++;
      gsap.delayedCall(0.18, tick);
    };
    tick();
  },
  onFragmentShown({ fragment }) {
    gsap.fromTo(
      fragment,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.explosive }
    );
  },
});
