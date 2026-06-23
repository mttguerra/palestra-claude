import { describe, it, expect, beforeAll } from 'vitest';
import '../src/components/slide-image.js';

describe('<slide-image>', () => {
  beforeAll(() => {
    customElements.upgrade(document.body);
  });

  it('renderiza placeholder quando não tem src', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1.uppercut');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', 'Claude dando uppercut no ChatGPT');
    document.body.appendChild(el);

    const placeholder = el.shadowRoot.querySelector('.placeholder');
    expect(placeholder).not.toBeNull();
    expect(el.shadowRoot.querySelector('img')).toBeNull();
  });

  it('expõe o brief no minibox de hover', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B2');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', 'Sala de aula com Claude lecionando');
    document.body.appendChild(el);

    const tip = el.shadowRoot.querySelector('.minibox');
    expect(tip.textContent).toContain('Sala de aula com Claude lecionando');
  });

  it('vira <img> quando src é fornecido', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1');
    el.setAttribute('aspect', '16:9');
    el.setAttribute('brief', '...');
    el.setAttribute('src', '/img/b1.png');
    el.setAttribute('alt', 'Uppercut');
    document.body.appendChild(el);

    const img = el.shadowRoot.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/img/b1.png');
    expect(img.getAttribute('alt')).toBe('Uppercut');
    expect(el.shadowRoot.querySelector('.placeholder')).toBeNull();
  });

  it('respeita aspect ratio no container', () => {
    const el = document.createElement('slide-image');
    el.setAttribute('id', 'B1');
    el.setAttribute('aspect', '9:16');
    el.setAttribute('brief', '...');
    document.body.appendChild(el);

    const container = el.shadowRoot.querySelector('.container');
    expect(container.style.aspectRatio).toBe('9 / 16');
  });
});
