const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; position: relative; }

    .container {
      width: 100%;
      background: var(--bg-2, #18181A);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-3, #6E6B65);
      font-size: 2rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .minibox {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      max-width: 320px;
      padding: 12px 16px;
      background: var(--bg-3, #232326);
      color: var(--text-1, #F5F2EC);
      font-family: var(--font-body, system-ui, sans-serif);
      font-size: 0.95rem;
      line-height: 1.4;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease-out;
      white-space: normal;
      z-index: 10;
    }

    :host(:hover) .minibox { opacity: 1; }

    /* Esconde o minibox quando há imagem real */
    :host([src]) .minibox { display: none; }

    /* Container transparente quando há imagem real, pra PNGs com alpha */
    :host([src]) .container { background: transparent; }

    /* Imagem respeita transparência: contain ao invés de cover */
    :host([src]) img { object-fit: contain; }
  </style>

  <div class="container">
    <div class="placeholder">🖼</div>
    <div class="minibox"></div>
  </div>
`;

class SlideImage extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'brief', 'aspect', 'alt'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const container = this.shadowRoot.querySelector('.container');
    const aspect = this.getAttribute('aspect') || '16:9';
    container.style.aspectRatio = aspect.replace(':', ' / ');

    const minibox = this.shadowRoot.querySelector('.minibox');
    minibox.textContent = this.getAttribute('brief') || '';

    const src = this.getAttribute('src');
    const existingImg = this.shadowRoot.querySelector('img');
    const placeholder = this.shadowRoot.querySelector('.placeholder');

    if (src) {
      if (placeholder) placeholder.remove();
      if (!existingImg) {
        const img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', this.getAttribute('alt') || this.getAttribute('brief') || '');
        img.setAttribute('loading', 'lazy');
        container.insertBefore(img, minibox);
      } else {
        existingImg.setAttribute('src', src);
        existingImg.setAttribute('alt', this.getAttribute('alt') || this.getAttribute('brief') || '');
      }
    } else {
      if (existingImg) existingImg.remove();
      if (!placeholder) {
        const p = document.createElement('div');
        p.className = 'placeholder';
        p.textContent = '🖼';
        container.insertBefore(p, minibox);
      }
    }
  }
}

customElements.define('slide-image', SlideImage);
