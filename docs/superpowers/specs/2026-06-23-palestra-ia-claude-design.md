# Spec — Palestra IA com Claude (web deck)

**Data:** 2026-06-23
**Status:** rascunho aguardando revisão do usuário
**Storyboard fonte:** `Downloads/palestra-ia-storyboard.md` (cópia será trazida pro projeto)
**Palestrante:** Pedro · **Plateia:** marketing leigo em tech · **Caso:** Thiago Xicória
**Prazo de palestra:** próximo mês (julho/2026)

---

## 1. Visão geral

Web deck (substituto moderno de PowerPoint) renderizado no navegador, navegado por teclado, com identidade visual própria e animações cinéticas. Os 14 blocos do storyboard viram uma timeline linear; cada seta direita revela o próximo passo (próximo fragmento dentro de um slide ou próximo slide), seta esquerda desfaz. Sem cliques, sem scroll — palestrante controla 100% com →/←.

### Objetivos

- **Memorável:** visual único, longe da estética genérica de slide
- **À prova de palco:** navegação só com seta, zero risco de erro, plano B em PDF
- **Iterável:** estrutura modular pra refinar bloco por bloco sem mexer no resto
- **Fiel ao storyboard:** microcopy, falas e progressão exatamente como Pedro descreveu

### Não-objetivos (escopo fora)

- Versão mobile / responsiva pra outras telas (palestra é tela única conhecida)
- Multi-idioma (português apenas)
- Áudio embutido (palestrante fala ao vivo)
- Edição interativa de slides em runtime
- Backend / login / persistência

---

## 2. Decisões fundamentais

| Decisão | Escolha | Por quê |
|---|---|---|
| Modelo de navegação | Eixo único linear (→/←) | Zero ambiguidade no palco. "Clique pra focar" vira fragmento sequencial. |
| Engine de slides | **Reveal.js** (NPM, via Vite) | Dá grátis: navegação, fragmentos, histórico, export PDF. Tema 100% custom. |
| Animações de elementos | **GSAP** (Timeline + helpers) | Padrão da indústria, controle fino de timing/easing, integra com eventos do Reveal. |
| Diagramas | **SVG inline** + GSAP | Escalável, animável, leve. Sem dependência de bibliotecas pesadas de gráfico. |
| Ilustrações animadas (opcional) | **Lottie** | Usado só nos blocos com ilustração desenhada (B1 uppercut, robôs do B12). |
| Bundler | **Vite** | Hot reload, ESM, build estático simples. |
| Framework UI | Nenhum (vanilla JS) | Reveal já lida com slides. Vue/React seria peso desnecessário pro escopo. |
| Mono pros blocos de terminal | **JetBrains Mono** | Bons números e ligaduras, gratuita. Confirmar com user. |

---

## 3. Identidade visual

### 3.1 Paleta (dark + acid)

```
Fundos
  BG-1            #0F0F0E   canvas do slide
  BG-2            #18181A   cards, painéis elevados, placeholder de imagem
  BG-3            #232326   modais, popovers, hover minibox

Texto
  TEXT-1          #F5F2EC   microcopy principal, headings
  TEXT-2          #B8B5AE   subtítulos, captions
  TEXT-3          #6E6B65   muted, footer, indicador de slide

Acento
  ACCENT          #E8FE03   palavras em DESTAQUE, ícones ativos, CTA, foco
  ACCENT-HOVER    #EEFE3E   hover/glow (HSL +12 de luminosidade)

Bordas
  BORDER          #2A2A2D   separadores sutis
  BORDER-FOCUS    #E8FE03   item ativo / em foco

Semânticas
  SUCCESS         #4ADE80   ✓ APROVADO, agents que validam (B11)
  DANGER          #F87171   REPROVADO / VOLTA (B11)
  MUTED-COOL      #5C5C60   lado "antes" do split B13 (contraste frio com acento quente)
```

Todos os tokens vão em `tokens.css` como CSS custom properties (`--bg-1`, `--accent`, …).

### 3.2 Tipografia

- **Clash Display** (display, títulos, microcopy de palco) — pesos 500/600/700, distribuída via Fontshare
- **Satoshi** (body, descrições, captions) — pesos 400/500/700, Fontshare
- **JetBrains Mono** (terminal nos B3, B4, B10) — peso 400/500, Google Fonts

Escala de tamanhos (rem com root 16px) — a afinar quando renderizar:

| Token | Tamanho | Família | Uso |
|---|---|---|---|
| `T-PUNCH` | 5.5–7rem | Clash Bold 700 | "TEM UM NOVO CAMPEÃO", "1 CLIQUE", punches |
| `T-TITLE` | 3.5–4.5rem | Clash Semibold 600 | Títulos de bloco |
| `T-MICROCOPY` | 2–2.5rem | Clash Bold 700 | Microcopy do storyboard (máx 6 palavras) |
| `T-BODY` | 1.25–1.5rem | Satoshi Regular 400 | Captions, descrição |
| `T-CAPTION` | 0.875–1rem | Satoshi Medium 500 | Labels, IDs, footer |
| `T-MONO` | 1.25rem | JetBrains Mono | Comandos `/skill`, texto de terminal |

### 3.3 Mood de animação

**Cinético & explosivo** (escolha B do brainstorm), com pitada snappy nos momentos de leitura.

Defaults sugeridos:
- **Entrada de fragmento:** 450–650ms, `back.out(1.5)` (overshoot sutil), stagger 80ms quando vários itens
- **Saída de fragmento** (quando volta com ←): 250ms, `power2.in`, sem overshoot
- **Transição entre slides:** 400ms, `power3.out`, slide horizontal (Reveal `transition: 'slide'`)
- **Micro-interações (hover):** 200ms ease-out
- **Pulse / glow do acento:** loop infinito 1.6s `sine.inOut` em itens "ativos"

Princípio: **nenhuma animação importante leva mais de 800ms** (não cansa plateia).

---

## 4. Componente central: `<slide-image>`

Custom element (web component vanilla, kebab-case porque a stack não usa framework JSX) que ocupa a área de uma imagem futura no slide. Tem dois estados:

```html
<!-- Estado A: dev, sem imagem ainda -->
<slide-image id="B1.uppercut" aspect="16:9" brief="Ilustração estilo HQ: Claude (laranja) dando uppercut no ChatGPT. Cena de nocaute, cômica."></slide-image>

<!-- Estado B: produção, com imagem -->
<slide-image id="B1.uppercut" aspect="16:9" brief="..." src="/img/b1-uppercut.png"></slide-image>
```

### Comportamento

| Estado | Renderização | Hover |
|---|---|---|
| Sem `src` | Retângulo sólido `BG-2`, ícone discreto 🖼 ao centro | Minibox flutuante com `brief` aparece acima da div |
| Com `src` | `<img>` ocupando o container, lazy loading | Desligado (palco não tem mouse) |

### Minibox (hover, dev mode)

- Fundo `BG-3`, texto `TEXT-1`, padding 12–16px, border-radius 6px
- Largura máxima 320px, line-height confortável
- Aparece com fade 200ms, position absoluta acima da div, seta apontando pra baixo
- Não interativo (só leitura)

### Atributos HTML

| Atributo | Valores | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | sim | Identificador único, ex: `B6.coracao-notion` |
| `aspect` | `16:9` \| `1:1` \| `9:16` \| `4:3` | sim | Aspect ratio do container |
| `brief` | string | sim | Texto da sugestão visual (extraído do storyboard) |
| `src` | string | não | Caminho da imagem real. Quando presente, vira estado B. |
| `alt` | string | não | Alt text quando `src` existe. Default: deriva do `brief`. |

---

## 5. Estrutura do projeto

```
palestra-claude/
├── docs/
│   ├── superpowers/
│   │   └── specs/
│   │       └── 2026-06-23-palestra-ia-claude-design.md   <- esse arquivo
│   └── palestra-ia-storyboard.md   <- cópia do .md fonte
├── public/
│   ├── fonts/                      <- Clash/Satoshi self-hosted (fallback ao Fontshare CDN)
│   └── img/                        <- imagens reais (b1-uppercut.png, etc)
├── src/
│   ├── main.js                     <- entry: inicializa Reveal + GSAP + componentes
│   ├── reveal-config.js            <- config do Reveal (transição, fragmentos, plugins)
│   ├── styles/
│   │   ├── reset.css
│   │   ├── tokens.css              <- variáveis CSS (paleta)
│   │   ├── typography.css          <- @font-face + classes T-PUNCH, T-TITLE, …
│   │   ├── reveal-overrides.css    <- mata o tema do Reveal
│   │   └── components.css          <- SlideImage, minibox, etc.
│   ├── components/
│   │   ├── slide-image.js          <- web component <slide-image>
│   │   ├── slide-image.css
│   │   └── (outros componentes conforme blocos precisarem)
│   ├── animations/
│   │   ├── timelines.js            <- timelines GSAP nomeadas por bloco
│   │   └── helpers.js              <- easings nomeados, pulse, glow
│   └── blocks/
│       ├── b01-uppercut.html       <- 1 arquivo por bloco
│       ├── b02-claude.html
│       ├── b03-claude-code.html
│       └── ... b14-fechamento.html
├── index.html                      <- carrega slides em ordem
├── vite.config.js
└── package.json
```

**Por que arquivos separados por bloco:** facilita iteração paralela, mantém cada bloco focado e legível, e permite refatorar um sem tocar nos vizinhos. `index.html` ou `main.js` faz `fetch` + `innerHTML` (ou import HTML via Vite plugin) montando o `<div class="slides">` do Reveal.

---

## 6. Mapeamento dos 14 blocos (esqueleto)

Cada entrada tem: **fragmentos** (quantos passos de → dentro do slide), **animação principal**, **imagens** (com brief curto), **notas técnicas**. Detalhes finos vão no plano de implementação.

### B1 — Uppercut
- **Fragmentos:** 1
- **Animação:** SlideImage entra com `scale(0.7) rotate(-8deg) → 1, 0` em `back.out(2)`. Microcopy 🥊 bate com pulse 200ms depois.
- **Imagens:** 1× SlideImage 16:9 — *"HQ: Claude (laranja) dando uppercut no ChatGPT, nocaute cômico"*
- **Notas:** primeiro slide, precisa de impacto. Sem fade tímido.

### B2 — O que é Claude
- **Fragmentos:** 2 (imagem → microcopy)
- **Animação:** entrada limpa, microcopy aparece com stagger ("CLAUDE = a IA que **PENSA** com você")
- **Imagens:** 1× SlideImage 16:9 — *"Claude no quadro-negro dando aula, ChatGPT de aluno na carteira"*

### B3 — Claude Code (hub)
- **Fragmentos:** 7 (Claude central + 6 fios conectando a: arquivos, Notion, WhatsApp, GitHub, terminal, planilha)
- **Animação:** SVG inline. Claude pulsa no centro; cada fio entra com `stroke-dasharray` animado conectando a um nó por →
- **Imagens:** 0 (SVG construído)
- **Notas:** ícones dos nós ficam em `src/components/icons/`

### B4 — Desmistificando terminal
- **Fragmentos:** 3 (terminal vazio → "código rolando" → resultado limpo)
- **Animação:** terminal CSS/JS com texto fake-typing (caracteres random em `JetBrains Mono`), corte hard pro resultado
- **Imagens:** 0

### B5 — Biblioteca (GitHub)
- **Fragmentos:** 3 (estante → livros caem nas prateleiras com stagger → microcopy "GitHub = memória que não esquece")
- **Animação:** SVG ou ilustração de estante; livros entram com `y: -200 → 0`, `back.out(1.8)`
- **Imagens:** opcional — 1× SlideImage 16:9 caso ilustração externa fique melhor que SVG construído

### B6 — Notion: coração
- **Fragmentos:** 5 (coração pulsando → "tudo entra" → "passa pelo coração" → "tudo sai" → comparação GITHUB cofre vs NOTION coração)
- **Animação:** coração SVG com pulse contínuo; partículas/ícones entram pela esquerda, atravessam o coração, saem pela direita
- **Imagens:** 1× SlideImage 16:9 opcional — *"tela real do Notion 3s"* (depende de Pedro fornecer print)

### B7 — Agent (escritório de especialistas)
- **Fragmentos:** 5 (escritório vazio → cada funcionário entra: 🪪 copywriter → revisor → analista → pesquisador → contraste "ChatGPT = estagiário, Agent = especialista")
- **Animação:** silhuetas com crachá entram em fila vinda da direita
- **Imagens:** 1× SlideImage 16:9 — *"escritório com funcionários de crachá"* OU construído em SVG

### B8 — Boas práticas
- **Fragmentos:** 5 (1 por boa prática: função única / contexto enxuto / regras / memória / ferramenta)
- **Animação:** cada item aparece com pulse + ícone, posicionado em coluna vertical
- **Imagens:** 0

### B9 — Soul + Voice (clonando Xicória)
- **Fragmentos:** 7 (🧠 SOUL → 🗣️ VOICE → soma = pessoa clonada → slide do voice-spec real → tabela DIZ × NUNCA → punch "não parece IA, parece Xicória")
- **Animação:** SOUL e VOICE entram nos dois lados, somam ao centro com glow do ACCENT
- **Imagens:** 1× SlideImage 9:16 — *"print real do voice-spec / Git mostrando restrições do Xicória"* (Pedro precisa fornecer print)

### B10 — Skills (arsenal) ~90s
- **Fragmentos:** ~12 (cena 1 máquina de café → cena 2 arsenal aparece → 3 cliques inteligência → 2 cliques produção → 1 clique operação → fechamento "horas → 1 clique")
- **Animação:** mais elaborada do deck. Máquina de café Lottie ou SVG → corte pro arsenal de 6 botões. Cada → "clica" num botão (acende `ACCENT`, card desliza da direita com `power3.out`).
- **Imagens:** 0 (tudo construído)
- **Notas:** os 6 cards de skill são componentes reutilizados, conteúdo diferente em cada um.

### B11 — Filtro de 8 agents ~50s
- **Fragmentos:** ~10 (criativo entra → 8 carimbos sequenciais (memória/hook/corpo/criativo/oferta/voz/refino/CCO) → veredito 96/100 APROVADO → flash do caso REPROVADO → punch)
- **Animação:** esteira horizontal SVG; card do criativo desliza por 8 estações, cada uma acende e carimba ✓ com som visual (flash). CCO ergue placa "96/100".
- **Imagens:** 0

### B12 — IA aprende sozinha ~48s
- **Fragmentos:** ~8 (robô errando 3x → 4 comandos APROVA/CORRIGE/NUNCA/SEMPRE → cartões voam pra biblioteca (callback B5) → loop com barra de nível subindo → 2 robôs lado a lado "Dia 1" × "Dia 90")
- **Animação:** comando digitado vira cartão que voa em arco até a estante do B5 (visualmente referenciada)
- **Imagens:** 0

### B13 — Antes/depois Xicória ~50s
- **Fragmentos:** 5 (lado esquerdo cinza com perfil pequeno → "ligamos o sistema" → lado direito ganha cor → números 22/96/0/40k → punch "isso é um expert")
- **Animação:** split screen. Lado esquerdo permanece com `MUTED-COOL`. Lado direito desbota cinza → cor `ACCENT` aparecendo gradualmente.
- **Imagens:** 2× SlideImage 9:16 — *"perfil Xicória antes"* e *"perfil Xicória depois"* (Pedro fornece prints)
- **Notas:** conferir número real de seguidores antes da palestra (pendência já listada no storyboard).

### B14 — Fechamento ~40s
- **Fragmentos:** 4 (recap relâmpago → "não é prompt, é SISTEMA" → CTA (segue + ARQUITETURA) → último frame Claude estendendo a luva)
- **Animação:** no recap, miniaturas dos blocos passam em flash horizontal. Frame final é callback ao B1 com a luva agora estendida pra plateia.
- **Imagens:** 1× SlideImage 16:9 — *"Claude com luva estendendo pro espectador"* (callback B1)

---

## 7. Navegação e atalhos

- `→` ou `Space`: próximo passo (fragmento ou slide)
- `←`: passo anterior
- `S`: notas do palestrante (Reveal nativo, abre janela separada)
- `F`: tela cheia
- `?print-pdf` na URL: gera PDF do deck (export pro pendrive)
- `Esc` e `O`: visão geral de slides — **desabilitar** pra evitar saída acidental no palco

---

## 8. Plano B no palco

- Build estático (`vite build`) levado em pendrive
- PDF exportado (`?print-pdf` → imprimir como PDF) também no pendrive
- Testar deck final em outro notebook 1 semana antes da palestra
- Não vamos planejar fallback PowerPoint (escopo fora)

---

## 9. Pendências de conteúdo (do storyboard, mantidas aqui)

- [ ] Confirmar número real de seguidores Xicória antes × depois (B13)
- [ ] Confirmar nome exato da skill de migração citada (`modelar-video`) (B10)
- [ ] Decidir versão de 20 min vs 30 min (corte/expansão dos B11–B12)
- [ ] Pedro fornecer prints reais: tela do Notion (B6), voice-spec do Git (B9), perfis Xicória antes/depois (B13)
- [ ] Confirmar JetBrains Mono como mono dos blocos de terminal

---

## 10. Próximo passo

Plano de implementação detalhado (sprint por sprint, com tarefas verificáveis) será criado via skill `writing-plans` após aprovação desse spec.
