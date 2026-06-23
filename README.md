# Palestra IA · Pedro

Web deck da palestra "IA na Criação de Conteúdo" (~20-30min, plateia leiga de marketing).

Substituto moderno de PowerPoint, navegado só por →/← (palestrante usa só teclado, zero risco no palco).

## Stack

- **Vite 8** — bundler e dev server
- **Reveal.js 6** — engine de slides (eixo único linear, fragmentos progressivos)
- **GSAP 3** — animações de elementos (entradas cinéticas, glow, pulse)
- **Web Components vanilla** — `<slide-image>` é placeholder de imagem com hover de brief
- **Tipografia self-hostada:** Clash Display + Satoshi (Fontshare WOFF2) + JetBrains Mono
- **Identidade:** dark `#0F0F0E` + acento amarelo neon `#E8FE03`

## Rodar

```bash
npm install
npm run dev          # dev server em http://localhost:8080
npm run build        # build estático em dist/
npm run preview      # preview do build em http://localhost:8080
npm test             # testes Vitest do <slide-image>
```

## Navegação

- `→` ou `Space`: próximo passo (fragmento ou slide)
- `←`: passo anterior
- `S`: notas do palestrante (janela separada)
- `F`: tela cheia
- `Esc` / `O`: **desabilitados** (evita saída acidental no palco)

## Estrutura

```
palestra-claude/
├── docs/
│   ├── palestra-ia-storyboard.md       # storyboard fonte
│   └── superpowers/
│       ├── specs/  # spec de design
│       └── plans/  # plano de implementação
├── public/
│   ├── fonts/      # WOFF2 self-hostado (Clash + Satoshi)
│   └── img/        # imagens reais entram aqui
├── src/
│   ├── main.js                     # boot + hooks Reveal->GSAP
│   ├── reveal-config.js            # config do Reveal
│   ├── styles/
│   │   ├── tokens.css              # paleta + timing/easing
│   │   ├── reset.css               # reset CSS
│   │   ├── typography.css          # @font-face + classes T-PUNCH, T-TITLE, ...
│   │   ├── reveal-overrides.css    # mata o tema padrão do Reveal
│   │   └── components.css          # estilos por bloco
│   ├── components/
│   │   └── slide-image.js          # web component placeholder de imagem
│   ├── animations/
│   │   ├── helpers.js              # easings/durations + enterFrom/pulse/glowLoop
│   │   └── timelines.js            # registry de handlers por bloco
│   └── blocks/
│       ├── b01-uppercut.{html,js}  # 14 blocos (1 par por bloco)
│       └── ... b14-fechamento.{html,js}
├── tests/
│   └── slide-image.test.js         # testes Vitest do componente
├── index.html
├── vite.config.js
└── package.json
```

## Sistema de placeholder de imagem

Onde uma imagem deve entrar, há um `<slide-image>`:

```html
<!-- Modo dev: ainda não tem imagem real -->
<slide-image id="B1.uppercut" aspect="16:9"
  brief="HQ: Claude dando uppercut no ChatGPT, cena de nocaute cômica">
</slide-image>

<!-- Final: você plugou o arquivo em public/img/ -->
<slide-image id="B1.uppercut" aspect="16:9" brief="..."
  src="/img/b1-uppercut.png">
</slide-image>
```

Sem `src`: renderiza retângulo cinza com 🖼 ao centro. Hover mostra minibox com o brief.
Com `src`: renderiza `<img>` real, hover desligado.

## Plano B no palco

Sempre leve dois fallbacks no pendrive:

1. **Build estático:** `npm run build` → copie `dist/` pro pendrive. Abre offline em qualquer browser moderno.
2. **PDF exportado:** abrir `http://localhost:8080/?print-pdf`, `Ctrl+P` → "Salvar como PDF", tamanho personalizado 1920×1080px, margens "Nenhum". Salve como `palestra.pdf` no pendrive.

Testar tudo em outro notebook **1 semana antes** da palestra.

## Identidade visual

Tokens em `src/styles/tokens.css`:

| Token | Valor | Uso |
|---|---|---|
| `--bg-1` | `#0F0F0E` | canvas |
| `--bg-2` | `#18181A` | cards |
| `--bg-3` | `#232326` | popovers, hover minibox |
| `--text-1` | `#F5F2EC` | microcopy principal |
| `--text-2` | `#B8B5AE` | subtítulo |
| `--text-3` | `#6E6B65` | muted |
| `--accent` | `#E8FE03` | acento amarelo neon |
| `--accent-hover` | `#EEFE3E` | hover/glow |
| `--success` | `#4ADE80` | ✓ aprovado |
| `--danger` | `#F87171` | ✗ reprovado |

## Pendências de conteúdo

Antes de apresentar:

- [ ] Confirmar número real de seguidores Xicória antes/depois (B13)
- [ ] Pedro fornecer prints reais: tela do Notion (B6), voice-spec do Git (B9), perfis Xicória antes/depois (B13)
- [ ] Confirmar nome exato da skill `modelar-video` (B10)
- [ ] Decidir versão 20min vs 30min (corte/expansão B11-B12)
- [ ] Plugar imagens reais nos `<slide-image>` (basta adicionar `src="..."`)
