import gsap from 'gsap';
import { registerBlock } from '../animations/timelines.js';
import { EASE, DURATION } from '../animations/helpers.js';

/**
 * Roteiro do chat. Cada item vira uma mensagem na conversa.
 *  - who: 'agent' | 'user' | 'system'
 *  - prefix: rótulo curto antes do texto (claude>, você>, etc.)
 *  - text: texto final, depois das correções
 *  - typo (opcional, só pra 'user'): simula erro de digitação
 *      { at: índice onde o erro acontece, wrong: o que digita errado, correct: o que sobrescreve }
 *  - instant (opcional): aparece já digitado, sem efeito de typing (usado em status do system)
 *  - hold: ms de pausa antes da próxima mensagem
 */
const SCRIPT = [
  {
    who: 'user',
    prefix: 'você>',
    text: 'crie 3 criativos pro xicória',
    typo: { at: 21, wrong: 'xivória', correct: 'xicória' },
    hold: 520,
  },
  {
    who: 'agent',
    prefix: 'claude>',
    text: 'fechou. qual formato? Roteiro Reels, Formato Notícia ou Formato Fofoca?',
    hold: 520,
  },
  {
    who: 'user',
    prefix: 'você>',
    text: 'Fofoca',
    hold: 420,
  },
  {
    who: 'agent',
    prefix: 'claude>',
    text: 'fazendo clone do xicória. chamando os 7 agentes…',
    hold: 320,
  },
  {
    who: 'system',
    prefix: '··',
    text: 'memoria <ok> hook <ok> corpo <ok> criativo <ok> oferta <ok> voz <ok> refino <ok>',
    instant: true,
    hold: 360,
  },
  {
    who: 'agent',
    prefix: 'claude>',
    text: 'CCO: nota 96/100 ✓ — criativo pronto.',
    reveal: true,    // dispara o slide-in do card do criativo
    hold: 0,
  },
];

// velocidade de digitação (ms por caractere). Levemente randomizado pra não parecer robô.
const TYPE = {
  agent: { min: 18, max: 36 },
  user:  { min: 55, max: 110 },
};
const BACKSPACE_MS = 55;

let activeTokens = null; // controla cancelamento ao trocar de slide

function wait(ms, tokens) {
  return new Promise((resolve, reject) => {
    if (tokens?.cancelled) return reject(new Error('cancelled'));
    const id = setTimeout(() => {
      if (tokens?.cancelled) return reject(new Error('cancelled'));
      resolve();
    }, ms);
    tokens?.timers.push(id);
  });
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeMsg(item) {
  const wrap = document.createElement('div');
  wrap.className = `b04-msg b04-msg--${item.who}`;

  const prefix = document.createElement('span');
  prefix.className = 'b04-msg__prefix';
  prefix.textContent = item.prefix;

  const text = document.createElement('span');
  text.className = 'b04-msg__text';

  wrap.appendChild(prefix);
  wrap.appendChild(text);
  return { wrap, text };
}

function appendChar(textEl, ch) {
  // mantém o cursor sempre como último filho — adiciona caractere antes do cursor
  const cursor = textEl.querySelector('.b04-cursor');
  if (cursor) {
    cursor.insertAdjacentText('beforebegin', ch);
  } else {
    textEl.appendChild(document.createTextNode(ch));
  }
}

function setRawText(textEl, str) {
  const cursor = textEl.querySelector('.b04-cursor');
  textEl.textContent = str;
  if (cursor) textEl.appendChild(cursor);
}

function getRawText(textEl) {
  const cursor = textEl.querySelector('.b04-cursor');
  if (!cursor) return textEl.textContent;
  // textContent inclui o cursor (que é vazio), então só funciona
  return textEl.textContent;
}

function attachCursor(textEl) {
  const cursor = document.createElement('span');
  cursor.className = 'b04-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  textEl.appendChild(cursor);
  return cursor;
}

function detachCursor(textEl) {
  const cursor = textEl.querySelector('.b04-cursor');
  if (cursor) cursor.remove();
}

async function typeText(textEl, str, speed, tokens) {
  for (const ch of str) {
    if (tokens?.cancelled) throw new Error('cancelled');
    appendChar(textEl, ch);
    await wait(rand(speed.min, speed.max), tokens);
  }
}

async function backspaceN(textEl, n, tokens) {
  for (let i = 0; i < n; i++) {
    if (tokens?.cancelled) throw new Error('cancelled');
    const current = getRawText(textEl);
    setRawText(textEl, current.slice(0, -1));
    await wait(BACKSPACE_MS + rand(0, 30), tokens);
  }
}

function renderSystemTokens(textEl, raw) {
  // converte "<ok>" em span.b04-ok com check
  textEl.textContent = '';
  const parts = raw.split(/(<ok>)/g);
  for (const part of parts) {
    if (part === '<ok>') {
      const span = document.createElement('span');
      span.className = 'b04-ok';
      span.textContent = '✓';
      textEl.appendChild(span);
    } else if (part) {
      textEl.appendChild(document.createTextNode(part));
    }
  }
}

async function revealSystemSequential(textEl, raw, tokens) {
  // mostra "memoria ✓ hook ✓ ..." aparecendo em pares (rótulo + ok) com stagger
  textEl.textContent = '';
  const tokensList = raw.split(/\s+/); // ["memoria", "<ok>", "hook", "<ok>", ...]
  for (let i = 0; i < tokensList.length; i++) {
    if (tokens?.cancelled) throw new Error('cancelled');
    const t = tokensList[i];
    if (t === '<ok>') {
      const span = document.createElement('span');
      span.className = 'b04-ok';
      span.textContent = ' ✓';
      span.style.opacity = '0';
      textEl.appendChild(span);
      span.animate(
        [{ opacity: 0, transform: 'translateY(-2px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, fill: 'forwards', easing: 'ease-out' }
      );
      await wait(150, tokens);
    } else {
      const node = document.createTextNode((i === 0 ? '' : '  ') + t);
      textEl.appendChild(node);
      await wait(40, tokens);
    }
  }
}

async function playMsg(item, chatEl, tokens) {
  const { wrap, text } = makeMsg(item);
  chatEl.appendChild(wrap);

  // animação de entrada do balão
  requestAnimationFrame(() => wrap.classList.add('is-in'));
  await wait(160, tokens);

  if (item.instant) {
    await revealSystemSequential(text, item.text, tokens);
  } else {
    const cursor = attachCursor(text);
    const speed = TYPE[item.who] || TYPE.agent;

    if (item.typo) {
      const { at, wrong, correct } = item.typo;
      const before = item.text.slice(0, at);
      const after = item.text.slice(at + correct.length);

      await typeText(text, before, speed, tokens);
      await typeText(text, wrong, speed, tokens);
      await wait(420, tokens); // "notou o erro"
      await backspaceN(text, wrong.length, tokens);
      await wait(140, tokens);
      await typeText(text, correct, speed, tokens);
      await typeText(text, after, speed, tokens);
    } else {
      await typeText(text, item.text, speed, tokens);
    }

    await wait(item.hold || 0, tokens);
    detachCursor(text);
  }

  if (item.hold && item.instant) {
    await wait(item.hold, tokens);
  }
}

async function runScript(chatEl, deckEl, tokens) {
  for (const item of SCRIPT) {
    if (tokens.cancelled) return;
    try {
      await playMsg(item, chatEl, tokens);
      if (item.reveal && !tokens.cancelled) {
        // pequena pausa pra dar peso à última frase antes da revelação
        await wait(480, tokens);
        if (!tokens.cancelled) deckEl.classList.add('is-revealed');
      }
    } catch (err) {
      if (err.message === 'cancelled') return;
      throw err;
    }
  }
}

function cancelTokens(tokens) {
  if (!tokens) return;
  tokens.cancelled = true;
  for (const id of tokens.timers) clearTimeout(id);
  tokens.timers.length = 0;
}

registerBlock('b04', {
  onShow(section) {
    cancelTokens(activeTokens);
    activeTokens = { cancelled: false, timers: [] };

    const chat = section.querySelector('#b04-chat');
    const deck = section.querySelector('#b04-deck');
    chat.innerHTML = '';
    deck.classList.remove('is-revealed');

    const headline = section.querySelector('.b04-headline');
    const terminal = section.querySelector('.b04-terminal');
    const punch = section.querySelector('.b04-punch');

    gsap.set(headline, { opacity: 0, y: 24 });
    gsap.set(terminal, { opacity: 0, y: 16 });
    gsap.set(punch, { opacity: 0, y: 20 });

    const tl = gsap.timeline();
    tl.to(headline, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy });
    tl.to(terminal, { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '-=0.2');
    tl.to(punch,    { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.snappy }, '+=2.2');

    // espera o terminal entrar antes de começar a digitar
    const startTokens = activeTokens;
    setTimeout(() => {
      if (startTokens.cancelled) return;
      runScript(chat, deck, startTokens);
    }, 350);
  },
  onHide(section) {
    cancelTokens(activeTokens);
    activeTokens = null;
    const deck = section?.querySelector?.('#b04-deck');
    if (deck) deck.classList.remove('is-revealed');
  },
});
