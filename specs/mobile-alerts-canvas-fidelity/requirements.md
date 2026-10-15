---
feature: mobile-alerts-canvas-fidelity
id: 174
status: approved
tags: [mobile, ui, canvas, alerts, spec]
---

# #174 — Alertas fieles al canvas (lista)

## §0. Base, fuente y decisiones del humano (no se reabren)

- **Base de redacción**: `origin/main` `788d1f89`. Branch `feature/174-mobile-alerts-canvas-fidelity`.
- **Fuente del diseño**: canvas aprobado `https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`, versión
  `1791913045-37f1`, artboard `Alertas.dc.html` (sha256 `e1e546de…ebe0b0`). Inventario del artboard en
  `progress/explore_mobile-alerts-canvas-fidelity.md` §«Inventario del artboard».
- **Directiva** (2026-10-13): «el diseño final debe de quedar como el artifact».
- **Alcance**: solo la lista `mobile-pet-tracker/src/screens/alerts/index.tsx`, sus tests,
  `src/utils/alert-meta.ts`, el catálogo i18n, tokens de `src/theme/global.css`, la carta y las specs
  enmendadas. **El detalle `src/screens/alert-detail/` es #180** y no se toca (R12.6).
- **Decisiones del humano**:
  - D-P «Píxel exacto»: padding lateral 20, tamaños 13/15/26, ack de fila de 34 de alto, radios del
    artboard. Tokens nuevos sin redondear a la escala; cada candado que se mueve se nombra (§2).
  - D-C Copy: `alerts.daysAgo` = `Hace {{days}} días` / `{{days}} days ago`; clave nueva `alerts.dayAgo` =
    `Hace 1 día` / `1 day ago`. Sin maquinaria de plurales: el formateador de la pantalla ramifica.
    Ningún otro copy del canvas está aprobado: no se añade ninguna otra clave.
  - D-H: la cabecera nativa se queda (back y gesto) con `title: ''`; el título es un `Text` de peso 900 en
    el contenido. Enmienda la carta para toda la app (R11.2); las demás pantallas migran en su feature.
  - D-I: iconos de `reicon-react-native`, nunca emoji. Enmienda la carta para toda la app (R11.2).
  - Sin cambios de backend. Se conserva la sección «Anteriores» (#170 R3) y los tokens de movimiento
    existentes (`MOTION_STAGGER_MS`, `PopIn`, `HomeEntrance`). Las filas pierden la sombra.
  - «Rocky · Hace 5 min» son dos `Text` unidos por el literal `' · '`.
  - Fuera: `--danger`/`--warning` globales y el desenfoque del canvas.
  - La viñeta «Sin labio» de §13 de la carta se enmienda (el ack de la lista deja de ser primaria sin labio).
- **Dependencia de #173** (Pregunta abierta Q1, se aplica la recomendación): #174 se implementa **sobre #173
  mergeado**. De #173 reutiliza `font-extrabold`, `--text-13`, `--text-26`, la línea de tamaños numéricos
  de la carta y las dos excepciones de márgenes 20. No lleva copias propias.
- **Compartido con #175** (`origin/feature/175-mobile-docs-canvas-fidelity` @ `192329aa`, `specs/mobile-docs-canvas-fidelity/requirements.md`
  §R1 y §«Texto de la enmienda R2»): `--text-15`, `--tracking-title`, la sección
  `## Enmienda de fidelidad al canvas (2026-10-13)`, las dos sustituciones de la carta (micro-regla de títulos
  y frase de la paleta) y las líneas de tamaños y de tracking de la regla 2. Cada pieza es «presente en `main`
  en H0; si no, se añade literal desde `192329aa`», con su ancla S1–S7 (§1). Mismos nombres y textos que #175.
- **Spike de uniwind** (#173, `origin/feature/173-mobile-tab-screens-canvas-fidelity`, commit `164909de`,
  `specs/mobile-tab-screens-canvas-fidelity/design.md` §«Spike uniwind: tamaños numéricos»): `text-N` compila
  a `fontSize` sin `lineHeight`; los espaciados fraccionarios compilan; la fila `tracking-title` compila a
  `["letterSpacing", vars["--tracking-title"]]`, que resuelve a `vars["--uniwind-em"] * -0.02`, y su párrafo
  «Letter-spacing en em» explica que cada `text-*` fija `--uniwind-em`. **Regla**: todo `tracking-*` va en
  el mismo `Text` que una clase `text-*` (candado R12.4; #175 dice lo mismo en su R2.5 y su §Convenciones).
  El artboard de Alertas **no fija `line-height`** en ningún elemento: no hay token de interlineado
  (delimitación en §4).

## §1. Precondición y medidas en H0

Todas las órdenes se lanzan desde `mobile-pet-tracker/`. «H0» es el commit del handoff a Codex.

**Precondición (si una falla, PARA y avisa al leader; no se implementa nada):**

| # | Orden | Debe dar |
|---|---|---|
| P1 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | `1` |
| P2 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | `1` |
| P3 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | `1` |
| P4 | `test -e src/__tests__/profile-canvas-fidelity.test.ts; echo $?` | `0` |
| P5 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/conventions.md` | `1` |
| P6 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/ui-guidelines.md` | `1` |
| P7 | `grep -cF 'Tamaños de letra fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | `1` |
| P8 | `test ! -e .expo/types/router.d.ts; echo $?` | `0` |

P1–P7 las trae #173. P5 y P6 son los textos literales compartidos con #173 y #175 (excepción de padding
20); #174 no los escribe, solo los verifica.

**Piezas compartidas con #175 (presente en H0 o se añade literal desde `192329aa`; textos en `design.md` §5):**

| # | Orden | En H0 | Al cerrar | R |
|---|---|---|---|---|
| S1 | `grep -cF -- '--text-15: 15px;' src/theme/global.css` | 0 o 1 | 1 | R1 |
| S2 | `grep -cF -- '--tracking-title: -0.02em;' src/theme/global.css` | 0 o 1 | 1 | R1 |
| S3 | `grep -cF '## Enmienda de fidelidad al canvas (2026-10-13)' ../docs/ui-guidelines.md` | 0 o 1 | 1 | R11 |
| S4 | `` grep -cF -- "- Títulos de pantalla: título en contenido y cabecera nativa con \`title: ''\` (Enmienda de fidelidad al canvas)." ../docs/ui-guidelines.md `` | 0 o 1 | 1 | R11 |
| S5 | `grep -cF 'la superficie siempre acompaña a un icono de reicon-react-native y a un texto.' ../docs/ui-guidelines.md` | 0 o 1 | 1 | R11 |
| S6 | `grep -cF 'Tracking fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | 0 o 1 | 1 | R11 |
| S7 | `` grep -cF -- '`--text-15: 15px`' ../docs/ui-guidelines.md `` | 0 o 1 | 1 | R11 |

Si una pieza existe en H0 con **otro** texto o valor que el de `192329aa`, PARA y avisa al leader.

**Anclas (valor en la base `788d1f89`; las marcadas «H0» se miden al arrancar y se anotan en
`progress/impl_mobile-alerts-canvas-fidelity.md`):**

| # | Orden | Base | Al cerrar | R |
|---|---|---|---|---|
| M1 | (= S1) | 0 o 1 | 1 | R1 |
| M2 | `grep -cF -- '--radius-10: 10px;' src/theme/global.css` | 0 | 1 | R1 |
| M3 | (= S2) | 0 o 1 | 1 | R1 |
| M4 | `grep -cF -- '--tracking-caps: 0.06em;' src/theme/global.css` | 0 | 1 | R1 |
| M5 | `grep -cF -- "'alerts.dayAgo'" src/i18n/catalog.ts` | 0 | 2 | R2 |
| M6 | `grep -cF -- "'alerts.daysAgo': '{{days}} d ago'," src/i18n/catalog.ts` | 1 | 0 | R2 |
| M7 | `grep -cF -- "'alerts.daysAgo': 'Hace {{days}} d'," src/i18n/catalog.ts` | 1 | 0 | R2 |
| M8 | `grep -cF -- "'alerts.daysAgo': '{{days}} days ago'," src/i18n/catalog.ts` | 0 | 1 | R2 |
| M9 | `grep -cF -- "'alerts.daysAgo': 'Hace {{days}} días'," src/i18n/catalog.ts` | 0 | 1 | R2 |
| M10 | `grep -cF "title: t('alerts.title')" src/app/_layout.tsx` | 1 | 0 | R3 |
| M11 | `grep -cF "t('alerts.title')" src/screens/alerts/index.tsx` | 0 | 1 | R3 |
| M12 | `grep -cF 'testID="alerts-title"' src/screens/alerts/index.tsx` | 0 | 1 | R3 |
| M13 | `grep -cF '<PopIn' src/screens/alerts/index.tsx` | 0 | 1 | R4 |
| M14 | `grep -cF 'padding: 24,' src/screens/alerts/index.tsx` | 1 | 0 | R5 |
| M15 | `grep -cF 'paddingHorizontal: 20,' src/screens/alerts/index.tsx` | 0 | 1 | R5 |
| M16 | `grep -cF 'className="gap-4"' src/screens/alerts/index.tsx` | 1 | 0 | R6 |
| M17 | `grep -cF 'min-h-20' src/screens/alerts/index.tsx` | 1 | 0 | R7 |
| M18 | `grep -cF 'size={20}' src/screens/alerts/index.tsx` | 1 | 0 | R7 |
| M19 | `grep -cF 'size={22}' src/screens/alerts/index.tsx` | 0 | 1 | R7 |
| M20 | `grep -cF 'disc:' src/utils/alert-meta.ts` | 0 | 3 | R7 |
| M21 | `grep -cF "surface: 'bg-danger-soft'," src/utils/alert-meta.ts` | 1 | 1 | R7 |
| M22 | `grep -cF 'border-b-5' src/screens/alerts/index.tsx` | 0 | 1 | R8 |
| M23 | `grep -cF 'text-2xs' src/screens/alerts/index.tsx` | 1 | 0 | R9 |
| M24 | `grep -cF '<HomeEntrance' src/screens/alerts/index.tsx` | 0 | 1 | R10 |
| M25 | `grep -cF 'TABULAR_NUMS}' src/screens/alerts/index.tsx` | 1 | 1 | R4 |
| M26 | `grep -c '^## Enmienda #' ../docs/ui-guidelines.md` | 6 (H0) | H0 + 1 | R11 |
| M27 | `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` | 26 (H0) | H0 + 1 | R2 |
| M28 | `grep -c '^## Enmienda' ../specs/mobile-alerts-center/requirements.md` | 4 (H0) | H0 + 1 | R11 |
| M29 | `grep -c '^## Enmienda' ../specs/mobile-reminders-alerts-to-stack/requirements.md` | 1 (H0) | H0 + 1 | R11 |
| M30 | `grep -c '^## Enmienda' ../specs/mobile-alerts-grouped-and-detail-map/requirements.md` | 3 (H0) | H0 + 1 | R11 |
| M31 | `grep -c '^## Enmienda' ../specs/mobile-alert-detail-screen/requirements.md` | 1 (H0) | H0 + 1 | R11 |
| M32 | `grep -c '^## Enmienda' ../specs/mobile-chunky-cta/requirements.md` | 0 (H0; #173 le suma 1) | H0 + 1 | R11 |
| M33 | `grep -cF 'confirmar alerta).' ../docs/ui-guidelines.md` | 1 | 0 | R11 |
| M34 | `grep -cF 'Títulos de pantalla: header del stack cuando exista, no Text suelto.' ../docs/ui-guidelines.md` | 1 | 0 | R11 |
| M35 | `grep -cF 'categoría: la superficie siempre acompaña a un emoji y a un texto.' ../docs/ui-guidelines.md` | 1 | 0 | R11 |
| M36 | `grep -cF 'Enmienda #174' ../docs/ui-guidelines.md` | 0 | 2 | R11 |
| M37 | `git diff --quiet <H0> -- src/screens/alert-detail/; echo $?` | — | 0 | R12 |
| M38 | `git diff --stat <H0> -- ../backend-pet-tracker/ ../infra/` | — | vacío | R12 |

Los valores «(H0)» de la base cambian si #173 u otra feature mergea antes: se mide en H0 y el cierre es
H0 + delta. Ninguna cifra se recalcula a mano.

## §2. Requisitos funcionales

Ficheros de test (abreviaturas usadas abajo, todas bajo `mobile-pet-tracker/src/`):

- **A** = `screens/alerts/index.test.tsx`
- **G** = `theme/__tests__/global-css.test.ts`
- **LP** = `providers/__tests__/language-provider.test.tsx`
- **L** = `app/__tests__/layout.test.tsx`
- **CC** = `__tests__/consistency-classnames.test.ts`
- **PF** = `__tests__/profile-canvas-fidelity.test.ts` (de #173)
- **F** = `__tests__/alerts-canvas-fidelity.test.ts` (**nuevo**, patrón de `__tests__/tab-headers-canvas.test.ts`:
  `declare function require` para `fs`/`path`, `sourceFiles()` sin `__tests__` ni `.test.`, `readSource(rel)`)

Jest con paréntesis en la ruta: escapar `\(tabs\)` si se cita alguna. Todo `fireEvent`/`act` de RNTL 14 va
con `await`.

### R1 — Tokens del artboard

- **R1.1** THE SYSTEM SHALL tener en el bloque `@theme` de `src/theme/global.css`, una sola vez cada uno:
  - `--text-15: 15px;` (S1): si no está en H0, tras la última línea `--text-<n>: <n>px;` (con #173: tras
    `--text-26: 26px;`); es el de #175;
  - `--radius-10: 10px;` (M2, propio): tras la última línea `--radius-*` de H0;
  - `--tracking-title: -0.02em;` (S2): si no está en H0, justo después de `--radius-10: 10px;`; es el de #175;
  - `--tracking-caps: 0.06em;` (M4, propio, Q2): tras la última línea `--tracking-*` (con #175:
    `--tracking-eyebrow: 0.08em;`; sin #175: `--tracking-title: -0.02em;`).
  - Sin `--text-15--line-height` (el artboard no fija interlineado).
- **R1.2** THE SYSTEM SHALL no redeclarar `--text-13`, `--text-26` (de #173) ni `--tracking-eyebrow`
  (de #175, 0.08em: no es el valor de Alertas).
- **Test**: G, describe nuevo `#174 R1: tokens del canvas de Alertas`:
  - `it('declara los tokens que usa Alertas')`: `parseVariables(extractTheme())` con
    `toMatchObject({ 'text-13': '13px', 'text-15': '15px', 'text-26': '26px', 'radius-10': '10px', 'tracking-title': '-0.02em', 'tracking-caps': '0.06em' })`;
  - `it('declara cada token una sola vez')`: `match(/--text-15:/g)`, `/--radius-10:/g`, `/--tracking-title:/g`
    y `/--tracking-caps:/g` tienen longitud 1.
- **Rojo**: el `toMatchObject` falla al menos por `radius-10` y `tracking-caps` (ausentes con y sin #175).

### R2 — Copy de días: `alerts.dayAgo` y `alerts.daysAgo`

- **R2.1** THE SYSTEM SHALL dejar en `src/i18n/catalog.ts`:

  | Clave | `en` | `es` |
  |---|---|---|
  | `alerts.dayAgo` (nueva) | `1 day ago` | `Hace 1 día` |
  | `alerts.daysAgo` (valor cambiado) | `{{days}} days ago` | `Hace {{days}} días` |

  La clave nueva va justo detrás de `alerts.daysAgo` en los dos idiomas.
- **R2.2** WHEN han pasado al menos 24 h desde `openedAt`, THE SYSTEM SHALL formatear con
  `days = Math.floor(hours / 24)`:
  - IF `days === 1` THEN `t('alerts.dayAgo')`;
  - en otro caso, `t('alerts.daysAgo', { days })`.
  Los tramos «ahora», minutos y horas no cambian.
- **R2.3** THE SYSTEM SHALL documentar en `specs/mobile-ui-language/design.md`:
  - sección nueva `### §2.<N> — Añadidos por #174 — Alertas fieles al canvas` justo antes de
    `## 3. La infraestructura`, con `<N>` = la siguiente libre en H0 (M27; en la base, `27`), cabecera
    `` | # | Clave | `en` | `es` | Origen | `` y la fila
    `` | — | `alerts.dayAgo` | `1 day ago` | `Hace 1 día` | ← añadida por #174 (R2) | ``;
  - en la fila existente de `alerts.daysAgo`: los valores nuevos, conservando su sufijo
    `← añadida por #78 (R3)` y añadiendo detrás ` · valor cambiado por #174 (R2)`.
- **Tests**:
  - A, `it('formatea ahora, minutos, horas y días por la clave correspondiente')` se reescribe en su sitio
    con el sufijo ` (enmendado por #174 R2)`. Ahora = `2026-09-11T12:00:00.000Z` (el mismo `Date.now` que ya
    usa). Las filas de «ahora», minutos y horas se conservan; la fila de días (`2026-09-08T12:00:00.000Z`)
    se sustituye por estas cuatro, cada una en es (`renderAlerts()`) y en en (`renderAlertsInEnglish()`),
    con `toHaveTextContent` exacto sobre `` `${rowId}-time` ``:

    | `openedAt` | horas | es | en |
    |---|---|---|---|
    | `2026-09-10T12:00:00.000Z` | 24 | `Hace 1 día` | `1 day ago` |
    | `2026-09-09T13:00:00.000Z` | 47 | `Hace 1 día` | `1 day ago` |
    | `2026-09-09T12:00:00.000Z` | 48 | `Hace 2 días` | `2 days ago` |
    | `2026-09-04T12:00:00.000Z` | 168 | `Hace 7 días` | `7 days ago` |

  - LP, describe nuevo `#174 R2: días con palabra completa` (patrón de `#170 R1: claves de alertas agrupadas y mini-mapa`):
    - `it.each` sobre la tabla de R2.1 contra los catálogos `en` y `es`;
    - `it('documenta alerts.dayAgo con el sufijo de #174')`: regex
      `'\\| — \\| `' + escapeRegExp('alerts.dayAgo') + '`[^\\n]*← añadida por #174 \\(R2\\)'` sobre el design.md;
    - `it('marca el valor cambiado de alerts.daysAgo')`: la fila de `alerts.daysAgo` del design.md contiene
      `` `{{days}} days ago` ``, `` `Hace {{days}} días` `` y `valor cambiado por #174 (R2)`.
- **Rojo** (primera aserción que falla): en A, `toHaveTextContent('Hace 1 día')` recibe `Hace 1 d`; en LP,
  la fila `alerts.dayAgo` recibe `undefined`.
- **Candados que se mueven**: §3 filas L1, L2, L3, L4.

### R3 — D-H: el título vive en el contenido

- **R3.1** THE SYSTEM SHALL declarar en `src/app/_layout.tsx` la ruta `alerts` con `title: ''`
  (`options={{ ...headerOptions, title: '' }}`). La cabecera nativa conserva `headerShown`, el back y el
  resto de `headerOptions`.
- **R3.2** THE SYSTEM SHALL pasar a la `FlatList` `alerts-list`, en todos los estados (carga, error, vacía,
  con filas), un `ListHeaderComponent` que es siempre:
  - `<View testID="alerts-header" className="gap-3">`, con dos hijos como máximo:
    1. `<View testID="alerts-title-row" className="flex-row items-center gap-2">`, cuyo hijo 0 es
       `<Text testID="alerts-title" accessibilityRole="header" className="flex-1 text-26 font-black tracking-title text-foreground">`
       con `t('alerts.title')` (`Alertas` / `Alerts`);
    2. el `Text` `alerts-action-error` existente, sin cambios, solo cuando hay error de acción.
- **Tests**:
  - A, el describe anidado `#114 R5: el título vive en la cabecera nativa` (con su `it` «no pinta título en
    carga ni con filas…») se **sustituye** por `describe('#174 R3: el título vive en el contenido')` con:
    - `it.each` sobre cuatro estados, preparando `mockListAlerts` así:
      carga `mockReturnValue(pending())`; error `mockResolvedValue({ kind: 'error' })`; vacía
      `mockResolvedValue({ kind: 'ok', items: [], nextCursor: null })`; filas
      `mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null })`.
      En cada uno: `await screen.findByTestId('alerts-title')`, texto exacto `Alertas`, `accessibilityRole`
      `header`, `className` exacto `flex-1 text-26 font-black tracking-title text-foreground`, padre
      `alerts-title-row` con `className` exacto `flex-row items-center gap-2`, abuelo `alerts-header` con
      `className` exacto `gap-3`;
    - `it('traduce el título en inglés')`: con `renderAlertsInEnglish()`, texto exacto `Alerts`.
  - A, `#78 R8` `it('mantiene la fila en not-found, muestra el error y lo limpia al reintentar')` suma: el
    padre de `alerts-action-error` es `alerts-header` y es su hijo 1.
  - L, `#114 R4`: la fila `['alerts', 't:alerts.title'],` pasa a `['alerts', ''], // #174 R3`.
- **Rojo**: `getByTestId('alerts-title')` / `findByTestId('alerts-title')` no encuentra el nodo; en L, el
  `toEqual` recibe `title: 't:alerts.title'`.
- **Candados que se mueven**: §3 filas L5, L6, L7.

### R4 — Contador «N nuevas» junto al título

- **R4.1** WHEN hay al menos una alerta abierta (`count > 0`), THE SYSTEM SHALL pintar como hijo 1 de
  `alerts-title-row`:
  - `<PopIn testID="alerts-new-count" className="rounded-full bg-danger px-2.5 py-1">` (de
    `src/components/pop-in.tsx`);
  - dentro, el `Text` `alerts-new-count-text` con `className` exacto
    `text-13 font-extrabold text-danger-foreground`, `style={TABULAR_NUMS}` y el copy actual
    (`alerts.newOne` / `alerts.newMany`, sin cambios).
- **R4.2** IF `count === 0` THEN `alerts-title-row` tiene un solo hijo (el título).
- **R4.3** THE SYSTEM SHALL dejar la `FlatList` como único hijo de `screen-alerts`.
- **Tests**: A, `#170 R4` `it('pinta el contador como hermano anterior de la lista con su anatomía')` se
  reescribe en su sitio como `it('pinta el contador junto al título con su anatomía (enmendado por #174 R4)')`.
  Se añade al fichero el doble de `PopIn` del patrón de `screens/forgot/index.test.tsx` (`mockPopIn`
  registra las props y pinta un `View` con ellas). Asevera:
  - con dos abiertas: hijo 1 de `alerts-title-row` es `alerts-new-count`; `mockPopIn` recibió
    `className: 'rounded-full bg-danger px-2.5 py-1'`; el `Text` tiene el `className` exacto de R4.1, su
    `style` es `TABULAR_NUMS` y el texto exacto `2 nuevas`;
  - con cero abiertas: `alerts-title-row` tiene un hijo y `queryByTestId('alerts-new-count')` es `null`;
  - `screen-alerts` tiene un solo hijo, `alerts-list`.
- **Rojo**: `alerts-title-row` tiene 1 hijo cuando se esperan 2.

### R5 — Dimensiones del artboard

- **R5.1** THE SYSTEM SHALL pasar a `alerts-list`
  `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 24, gap: 12 }}`.
  `className` (`flex-1 bg-background`) y `contentInsetAdjustmentBehavior="automatic"` no cambian.
- **R5.2** La excepción de padding 20 es la de P5/P6 (la trae #173); #174 no edita esos párrafos.
- **Test**: A, `it('respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6)')`
  se renombra con el sufijo `(#114 R6, enmendado por #174 R5)` y espera
  `toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48, gap: 12 })` (inset inferior del doble = 24).
- **Rojo**: el `toEqual` recibe `{ padding: 24, gap: 16, paddingBottom: 48 }`.

### R6 — Secciones

- **R6.1** THE SYSTEM SHALL envolver cada cabecera de sección con la primera fila de su sección en
  `<View className="gap-3">`.
- **R6.2** THE SYSTEM SHALL pintar la cabecera `alerts-section-<sección>` (`accessibilityRole="header"`) con
  `className` exacto `mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted`. El copy («Hoy»,
  «Esta semana», «Anteriores») no cambia.
- **Test**: A, `#170 R3` `it('envuelve cada cabecera con la primera fila de su sección en un View gap-4')` se
  reescribe como `it('envuelve cada cabecera con la primera fila de su sección en un View gap-3 (enmendado por #174 R6)')`:
  `className` del envoltorio exacto `gap-3` y de cada cabecera exacto el de R6.2, para las tres secciones.
- **Rojo**: el envoltorio recibe `gap-4`.

### R7 — Anatomía de la fila (todas sus decisiones)

- **R7.1** THE SYSTEM SHALL pasar a la `Card` de cada fila (`testID` `` `alert-row-${id}` ``) el `className`
  `` `flex-row items-center gap-3 px-3.5 py-3 shadow-none${open ? ` border-2 ${meta.border}` : ''}` ``.
  Sale `min-h-20`. La variante sigue siendo `surface` (radio `rounded-card` = 20).
- **R7.2** THE SYSTEM SHALL añadir a cada entrada de `src/utils/alert-meta.ts` un campo `disc`, sin tocar
  los existentes (`surface`, `ink`, `border`, `Icon`, `labelKey` los lee #180):

  | Tipo | `disc` |
  |---|---|
  | `geofence_exit` | `CATEGORY_SLOTS.rose.surface` |
  | `battery_low` | `CATEGORY_SLOTS.amber.surface` |
  | desconocido (`UNKNOWN_ALERT_META`) | `CATEGORY_SLOTS.neutral.surface` |

  `CATEGORY_SLOTS` se importa de `./category-palette`; ningún literal `bg-category-*` fuera de ese fichero
  (#64 R9).
- **R7.3** THE SYSTEM SHALL pintar el disco como hijo 0 de la fila:
  `` `size-11 items-center justify-center rounded-full ${meta.disc}` `` con el icono
  `` <Icon testID={`${rowId}-icon`} size={22} color={color} /> `` (color sin cambios).
- **R7.4** THE SYSTEM SHALL pintar el enlace `` `${rowId}-link` `` como hijo 1, con `className` exacto
  `min-h-11 min-w-0 flex-1 justify-center gap-0.5` (rol, `opacity` 0.8 al pulsar y navegación sin cambios) y
  exactamente dos hijos:
  1. `` `${rowId}-type` ``: `className` exacto `text-15 font-extrabold text-foreground`;
  2. `` <Text testID={`${rowId}-subtitle`} className="text-xs font-normal text-muted"> `` que contiene, en
     este orden, `` <Text testID={`${rowId}-pet`}> `` (nombre de la mascota), el literal `{' · '}` y
     `` <Text testID={`${rowId}-time`}> `` (R2). Los dos `Text` anidados no llevan `className`.
- **R7.5** El hijo 2 de la fila es el ack (R8) o la píldora de estado (R9).
- **Tests** (A, todos reescritos en su sitio con el sufijo ` (enmendado por #174 R7)`):
  - `#78 R6` `it.each` `'canda las doce decisiones para $type'`: columna `surface` pasa a `disc` con
    `bg-category-rose` / `bg-category-amber` / `bg-default`; icono `size` 22; enlace con 2 hijos; el
    `className` de la fila contiene `flex-row`, `items-center`, `gap-3`, `px-3.5`, `py-3`, `shadow-none` y
    no contiene `min-h-20` ni `shadow-sm`; `type` con el `className` exacto de R7.4; `subtitle` con
    `className` exacto, texto exacto compuesto en el test desde el fixture (`petName: 'Rocky'` y `openedAt` 2 h antes
    de ahora dan `Rocky · Hace 2 h`) y sus dos hijos `pet` y `time` sin `className`;
  - `#100 R6` `it('da rol, altura y opacidad de pulsado solo al enlace')`: `className` exacto del enlace de R7.4;
  - `#170 R5`: la columna de superficie de su tabla pasa a `bg-category-rose` / `bg-category-amber` /
    `bg-default` (el borde de abiertas, `acked` y `closed` no cambia).
- **Rojo**: ``getByTestId(`${rowId}-subtitle`)`` no encuentra el nodo (primera consulta del `it.each`).

### R8 — Ack de fila: secundario compacto con labio

- **R8.1** WHILE la fila está abierta, THE SYSTEM SHALL pintar como hijo 2:
  `` <Button testID={`${rowId}-ack`} accessibilityRole="button" variant="secondary" className="h-8.5 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3" hitSlop={TOUCH_SLOP} isDisabled={ackingId !== null} onPress={() => void handleAck(item)}> ``
  con `<Button.Label className="text-xs font-extrabold text-foreground">{t('alerts.ack')}</Button.Label>`.
  `TOUCH_SLOP` viene de `src/theme/touch-target.ts` (6 por lado: 34 + 12 = 46 de diana). Sale `min-h-11`.
- **Tests**:
  - A, `#78 R6` (mismo `it.each` de R7) y `it('alterna el tercer hijo entre ack y la píldora traducida')`
    (sufijo ` (enmendado por #174 R8)`): el `className` del ack contiene cada una de
    `h-8.5`, `rounded-10`, `border-2`, `border-b-5`, `border-lip-gray`, `bg-surface`, `px-3` y no contiene
    `min-h-11`; `props.hitSlop` `toEqual({ top: 6, bottom: 6, left: 6, right: 6 })`; la etiqueta tiene
    el texto de `es['alerts.ack']` (copy sin cambios) y su `className` contiene `text-xs`,
    `font-extrabold` y `text-foreground`.
  - CC, `#166 R3` (sufijo de `it` sin cambiar; comentarios `// #174 R8`):
    - en `'inventaría los cuatro secundarios neutros de toda la app'`, el `match` pasa a
      `` tag.match(/testID=(?:"([^"]+)"|\{`([^`]+)`\})/) `` y devuelve `m?.[1] ?? m?.[2]`; la lista esperada
      suma `'${rowId}-ack'` (literal con `$`, ordena primero; regex y recuento reales de H0 en E1.2);
    - `expect(count(/border-lip-gray/g)).toBe(<expresión H0> + 1); // … #174 R8` (base `4 + 1`, cierre `4 + 1 + 1`);
    - `expect(count(/\bborder-b-6\b/g))` **no** cambia (el ack usa `border-b-5`);
    - `it` nuevo `'#174 R8: el ack de fila es el secundario compacto'`: el tag de apertura del `<Button` de
      `screens/alerts/index.tsx` contiene `variant="secondary"`, `hitSlop={TOUCH_SLOP}` y el `className`
      literal de R8.1.
- **Rojo**: en A, `toContain('h-8.5')` recibe `min-h-11`; en CC, la lista del inventario no contiene
  `'${rowId}-ack'`.
- **Candado que se mueve**: §3 fila L8.

### R9 — Píldoras de estado

- **R9.1** WHEN la fila está confirmada (`acked`), THE SYSTEM SHALL pintar `` `${rowId}-status` `` con
  `className` exacto `rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted`.
- **R9.2** WHEN la fila está cerrada (`closed`), THE SYSTEM SHALL pintar `` `${rowId}-status` `` con
  `` `rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}` ``
  (en test: `rounded-full bg-category-green px-2.5 py-1 text-xs font-extrabold text-category-green-strong`).
- El copy de las dos píldoras no cambia.
- **Test**: A, `it('alterna el tercer hijo entre ack y la píldora traducida')` (ya renombrado en R8): un caso
  por rama, `acked` y `closed`, con `className` exacto.
- **Rojo**: la píldora `acked` recibe `… text-2xs …`.

### R10 — Entrada escalonada de filas

- **R10.1** WHEN el índice de la fila en la lista aplanada es menor que 5, THE SYSTEM SHALL envolver la
  `Card` en `` <HomeEntrance index={index} testID={`${rowId}-entrance`}> `` (de `../home/home-entrance`). La
  constante `ALERT_ROW_ENTRANCE_LIMIT = 5` vive en `screens/alerts/index.tsx`.
- **R10.2** IF el índice es 5 o mayor THEN la `Card` va sin envoltorio.
- **R10.3** El envoltorio va dentro del `View` `gap-3` de R6 (la cabecera de sección no se anima).
- **Test**: A, describe nuevo `#174 R10: entrada escalonada de las cinco primeras filas`, con el doble de
  `HomeEntrance` del patrón del test de login (`mockHomeEntrance` registra props y pinta un `View`).
  Seis alertas de la misma sección con ids `e0`…`e5`:
  - para `e0`…`e4`, `getByTestId('alert-row-eN-entrance')` contiene `alert-row-eN` (`within`) y la última
    llamada de `mockHomeEntrance` con ese `testID` tiene `index` `N`;
  - `queryByTestId('alert-row-e5-entrance')` es `null` y `alert-row-e5` existe.
- **Rojo**: `getByTestId('alert-row-e0-entrance')` no encuentra el nodo.

### R11 — Enmiendas a la carta y a specs aprobadas

- **R11.1** THE SYSTEM SHALL añadir al final de cada fichero de la tabla el bloque canónico de
  `design.md` §4 (cercado ```` ```markdown ````), sustituyendo `<FEATURE>` y `<QUÉ CAMBIA>`. En la carta va
  detrás de la última sección `## Enmienda #` que exista en H0 (con #173 mergeado,
  `## Enmienda #173 — Perfil fiel al canvas`).

  | Fichero | `<FEATURE>` | `<QUÉ CAMBIA>` |
  |---|---|---|
  | `docs/ui-guidelines.md` | `ui-guidelines` | `ver «Cambios en la carta» de #174 R11.2` |
  | `specs/mobile-alerts-center/requirements.md` | `mobile-alerts-center` | `#78 R3: alerts.daysAgo con palabra completa y alerts.dayAgo nueva; #78 R4: título en el contenido, padding lateral 20 y gap 12; #78 R6: la fila toma las medidas del artboard (disco de categoría, icono 22, subtítulo en una línea, ack compacto con labio)` |
  | `specs/mobile-reminders-alerts-to-stack/requirements.md` | `mobile-reminders-alerts-to-stack` | `#114 R4: alerts declara title vacío; #114 R5: en Alertas el título vuelve al contenido como Text de peso 900; #114 R6: Alertas usa padding lateral 20 y gap 12` |
  | `specs/mobile-alerts-grouped-and-detail-map/requirements.md` | `mobile-alerts-grouped-and-detail-map` | `#170 R3: secciones con gap-3 y cabecera text-13 extrabold con tracking-caps; #170 R4: el contador entra en la fila del título con PopIn; #170 R5: el disco de la fila toma la superficie de categoría` |
  | `specs/mobile-alert-detail-screen/requirements.md` | `mobile-alert-detail-screen` | `#100 R6: la columna de texto de la fila pasa a dos hijos (tipo y subtítulo) con justify-center y gap-0.5` |
  | `specs/mobile-chunky-cta/requirements.md` | `mobile-chunky-cta` | `#166 R3: el ack de fila de Alertas es secundario compacto (h-8.5, rounded-10, border-b-5) y entra en el inventario de secundarios neutros` |

  Además, en cada spec, la línea `> Enmendado por #174 (ver «Enmienda #174» al final).` como párrafo propio
  justo después de cada encabezado citado; en `mobile-alerts-grouped-and-detail-map`, que usa viñetas, el
  marcador `_(Enmendado por #174.)_` va en la misma línea, justo detrás del rótulo en negrita:

  | Spec | Ancla (`grep -cF … = 1`) |
  |---|---|
  | `mobile-alerts-center` | `### R3 — catálogo: las catorce claves nuevas, en los dos idiomas`; `### R4 — pantalla: cuerpo, dimensiones y estados`; `### R6 — anatomía de la fila (elemento repetido: todas sus decisiones, candadas)` |
  | `mobile-reminders-alerts-to-stack` | `### R4 — Cabecera nativa con el look de #95`; `### R5 — El título sale del cuerpo`; `### R6 — Métricas bajo cabecera nativa (A11)` |
  | `mobile-alerts-grouped-and-detail-map` | `- **R3 — Secciones en la lista.**`; `- **R4 — Contador «N nuevas».**`; `- **R5 — Severidad en la fila.**` |
  | `mobile-alert-detail-screen` | `### R6 — La columna de texto de cada fila abre su detalle` |
  | `mobile-chunky-cta` | `### R3. El secundario neutro lleva el labio gris` |

- **R11.2** Cambios en la carta (`docs/ui-guidelines.md`). Las piezas compartidas usan el texto de #175
  (`design.md` §5.1, copiado de `192329aa`); las propias, `design.md` §5.2:
  - **Sección de fidelidad** (S3): si no está en H0, se añade literal al final del fichero, antes del bloque
    `## Enmienda #174`. Si está, no se toca.
  - **Micro-regla de títulos** (S4, D-H): si M34 da `1` en H0, la línea se sustituye por la de §5.1.
  - **Frase de la paleta** (S5, D-I): si M35 da `1` en H0, la frase
    `la superficie siempre acompaña a un emoji y a un texto.` se sustituye por la de §5.1. Las dos líneas
    anteriores de la paleta (candadas por #64 R9) no se tocan.
  - **Regla 2, tamaños** (S7): en la línea que empieza por `Tamaños de letra fuera de la escala de Tailwind`
    (P7), `` `--text-15: 15px` `` al final de la lista, antes del `;`, separado por `, `, si no está.
  - **Regla 2, tracking** (S6): si existe la línea que empieza por `Tracking fuera de la escala de Tailwind`,
    se añade `` , `--tracking-caps: 0.06em` `` al final de su lista, antes del `;`; si no existe, se crea
    justo debajo de la de tamaños con el texto D5-a de §5.2.
  - **§12** (propio): como última línea de la regla `12. **Escala de radios**`, antes de
    `13. **Botón con cuerpo**` (y detrás de la de #175 si está), la línea D5-d.
  - **§13** (propio): en la viñeta «Sin labio», `confirmar alerta).` pasa a `confirmar alerta en el detalle).`
    (M33); viñeta nueva D5-e justo detrás, con su misma sangría.
- **R11.3** Sin regla de pantallas que no migran: las que aún usan emoji o título en cabecera migran en su
  propia feature (§4).
- **Tests**: F, describe `#174 R11: enmiendas` con la técnica de `src/__tests__/hero-header-amendments.test.ts`:
  - extrae el cercado canónico de `specs/mobile-alerts-canvas-fidelity/design.md` §4;
  - un `it` por fila de R11.1: el bloque (sin la línea de firma) está en el fichero, y la firma casa
    `/- \[[ xX]\] Enmienda #174 aprobada por humano/`;
  - un `it` por spec de la tabla de anclas: con el texto colapsado (`s.replace(/\s+/g, ' ')`), contiene
    `<ancla> > Enmendado por #174 (ver «Enmienda #174» al final).` o, para las viñetas,
    `<ancla> _(Enmendado por #174.)_`;
  - describe `#174 R11: la carta declara los cambios` (líneas por `split('\n').find(l => l.trimStart().startsWith(…))`,
    tramos por `indexOf`, texto colapsado `s.replace(/\s+/g, ' ')`):
    - `## Enmienda de fidelidad al canvas (2026-10-13)` aparece una vez y su casilla casa
      `/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/`;
    - contiene las frases nuevas de S4 y S5 una vez cada una, y no contiene los textos de M34, M35 ni M33;
    - la línea de tamaños contiene `` `--text-13: 13px` ``, `` `--text-26: 26px` `` y `` `--text-15: 15px` ``;
    - la línea de tracking contiene `` `--tracking-title: -0.02em` `` y `` `--tracking-caps: 0.06em` ``;
    - el tramo entre `12. **Escala de radios**` y `13. **Botón con cuerpo**` contiene D5-d;
    - contiene D5-e y `confirmar alerta en el detalle).`.
- **Rojo**: el bloque no está en `docs/ui-guidelines.md` (`toContain` falla con el primer fichero).

### R12 — Candados agregados y grep-limpio

- **R12.1** THE SYSTEM SHALL dejar las clases en estos ficheros de producción, y solo en ellos (F, describe
  `#174 R12: inventarios`, regex con `(?<![\w-])` delante, listas ordenadas):
  - `/(?<![\w-])rounded-10\b/`, `/(?<![\w-])border-b-5\b/`, `/(?<![\w-])tracking-caps\b/` →
    `['screens/alerts/index.tsx']`; `border-b-5` aparece una vez;
  - `/(?<![\w-])text-15\b/` y `/(?<![\w-])tracking-title\b/` → la lista medida en H0 más
    `'screens/alerts/index.tsx'` (sin #175: solo ese fichero; con #175: también `screens/docs/index.tsx`).
  - Si #175 está en H0 y tiene inventarios propios de `text-15` o `tracking-title`, sus listas suman
    `'screens/alerts/index.tsx'` con `// #174 R12` (§3 L10).
- **R12.2** THE SYSTEM SHALL mover los inventarios de #173 (PF, describe `#173 R2.4: inventario de tamaños nuevos`):
  las listas esperadas de `text-13` y de `text-26` suman `'screens/alerts/index.tsx'` en orden
  (`['screens/alerts/index.tsx', 'screens/profile/index.tsx']`), con `// #174 R4, R6` y `// #174 R3`. **Lista real de H0 y rojo de cada una: E1.1.**
- **R12.3** THE SYSTEM SHALL dejar `screens/alerts/index.tsx` y `utils/alert-meta.ts` sin emoji
  (`/\p{Extended_Pictographic}/u`), sin `[`…`]` dentro de `className`, sin hex, sin `StyleSheet.create` y
  con `screens/alerts/index.tsx` sin `min-h-20`, `text-2xs` ni `shadow-sm` (F, describe `#174 R12: grep-limpio`).
- **R12.4** THE SYSTEM SHALL poner toda clase `tracking-*` de `screens/alerts/index.tsx` en el mismo
  `className` que una clase `text-13|text-15|text-26` (F, mismo describe, `it('cada tracking-* va con su
  text-*')`: por cada literal `className` que casa `/(?<![\w-])tracking-/`, casa también
  `/(?<![\w-])text-(?:13|15|26)\b/`; el recuento de esos literales es 2: título y cabecera de sección).
  Fuente: spike de #173 (§0); misma regla en #175 R2.5 y §Convenciones.
- **R12.5** Candados que **no** cambian (se corren y quedan verdes sin editar): #62 R1/R4 (escala de radios
  y drift `/\brounded-(?:2xl|lg|md|sm)\b/`), #64 R9 (`categoryClassInventory`), TABULAR_NUMS (fila de
  alertas = 1), #87 R19 (design-drift, `'screens/alerts/index.tsx': 0,`), #134 R6/R7, `R13_ALERT_DETAIL`,
  #166 R2, `SCREEN_FILES` y «catorce claves» (ui-language), #61 R4.
- **R12.6** THE SYSTEM SHALL no tocar `src/screens/alert-detail/` (M37) ni backend/infra (M38).
- **Rojo**: las filas de R12 nacen verdes tras R1–R11; su rojo se demuestra con las sondas de `tasks.md`
  §Sondas (cada una con su aserción que falla y su recuento esperado).

### R13 — Prueba de humo en dev build de Android (gate humano)

- **R13.1** WHEN el reviewer aprueba, THE SYSTEM SHALL superar la prueba de humo manual en **dev build de
  Android** (nunca Expo Go), en tema claro y oscuro, y en es y en:
  1. Alertas abre con el back nativo y el título «Alertas»/«Alerts» grande (26, peso 900) en el contenido.
  2. El contador «N nuevas» aparece a la derecha del título con su pop.
  3. El título se ve más apretado y las cabeceras de sección más abiertas que el texto normal.
  4. Las filas abiertas muestran disco rosa/ámbar, icono 22, subtítulo «Rocky · Hace …» en una línea y el
     ack compacto con labio gris; se pulsa y confirma.
  5. Las cinco primeras filas entran escalonadas.
  6. Una alerta de hace 1 día dice «Hace 1 día» / «1 day ago».
- **R13.2** Casilla propia, en §6: `- [ ] Smoke #174 en dev build de Android`. Ningún
  test la exige marcada; si un test la lee, usa la regex tolerante `/- \[[ xX]\] Smoke #174/`.

## §3. Candados que se mueven (base medida en H0 + delta)

| # | Fichero › candado | Base (`788d1f89`) | Cambio | R |
|---|---|---|---|---|
| L1 | LP › longitud del catálogo | última línea `+ 7, // #170 R1` | la última línea de H0 pierde su coma; se añade `+ 1, // #174 R2` | R2 |
| L2 | LP › `#78 R3` | `['alerts.daysAgo', '{{days}} d ago', 'Hace {{days}} d'],` | `['alerts.daysAgo', '{{days}} days ago', 'Hace {{days}} días'], // #174 R2` | R2 |
| L3 | `ui-copy-table.ts` › `R12_ALERTS` | — | fila nueva `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.dayAgo' }, // #174 R2` | R2 |
| L4 | `specs/mobile-ui-language/design.md` | fila de `alerts.daysAgo` | valores nuevos + ` · valor cambiado por #174 (R2)` | R2 |
| L5 | `ui-copy-table.ts` › `R12_ALERTS` | `{ file: 'src/app/_layout.tsx', key: 'alerts.title' }, // #114 R4` | `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.title' }, // #174 R3` | R3 |
| L6 | L › `#114 R4` | `['alerts', 't:alerts.title'],` | `['alerts', ''], // #174 R3` | R3 |
| L7 | `specs/mobile-ui-language/design.md` | fila completa de `alerts.title` (la que termina en `` · se pinta desde `src/app/_layout.tsx` por #114 (R4) ``) | la cola pasa a `` · se pinta en `src/screens/alerts/index.tsx` por #174 (R3) ``; la fila de `reminders.title` no se toca | R3 |
| L8 | CC › `#166 R3` | `toBe(4 + 1); // #170 R16` (lip-gray) | `<H0> + 1`, `// #170 R16, #174 R8`; regex e inventario de R8 | R8 |
| L9 | PF › `#173 R2.4` | (de #173) | R12.2 | R3, R4, R6 |
| L10 | inventarios de #175 de `text-15` / `tracking-title` (solo si #175 está en H0) | lista de H0 | `+ 'screens/alerts/index.tsx'`, `// #174 R12` | R3, R7 |

Las filas L1, L8 y L9 las corrige la Enmienda E1 (E1.3, E1.2 y E1.1): manda E1.

`SCREEN_FILES` no cambia: `src/app/_layout.tsx` sigue en la tabla por `reminders.title` y
`alerts.detailTitle`, y `screens/alerts/index.tsx` ya estaba.

## §4. Fuera de alcance

Delimitaciones (diferencias conscientes con el canvas):

- **Interlineado**: el artboard hereda 1.4 del `body` y no fija `line-height`; las clases `text-xs` traen su
  `lineHeight` y `text-13/15/26` ninguno. No hay token de interlineado.
- **Chevron del canvas**: el back es el nativo (D-H); no hay botón atrás en el contenido.
- **Retraso del pop** (300 ms en el canvas) y retardos de `rise` (70 ms): se usan `PopIn` y
  `MOTION_STAGGER_MS` (60) existentes.
- **Fila «Aviso» del artboard**: sin tipo de backend; la app la pinta como desconocida (#170).
- **Alto medido del ack**: 34 de alto por `h-8.5`; el render del canvas suma el borde (content-box).
- **Colores globales** `--danger`/`--warning` y el desenfoque del canvas.

Features aparte:

- Detalle de alerta (#180).
- Otras pantallas que adopten D-H o D-I.
- Plurales con maquinaria i18n; `--text-22`; copy del canvas no listado en R2.1.
- Cambios de backend, de comportamiento o de colores de icono; variantes `hero`/`flat` de `Card` en Alertas.

## §5. Preguntas abiertas (la spec aplica la recomendación)

- **Q1 — Dependencia de #173.** ¿#174 espera al merge de #173 o lleva copias propias de `font-extrabold`,
  `--text-13`, `--text-26`, la línea de tamaños y las dos excepciones de padding, para quitarlas al mergear?
  **Recomendación**: esperar al merge (P1–P7). `font-extrabold` exige el `.ttf` y el `useFonts` de #173 R1, y
  sin copias no hay duplicados que reconciliar ni candados de #173 en rojo. Lo compartido con #175 no espera:
  va como «presente o literal» (S1–S7).
- **Q2 — ¿Unificar con el 0.08 de #175?** Las cabeceras de sección del artboard de Alertas usan `.06em`;
  la spec propone el token nuevo `--tracking-caps: 0.06em`. #175 define `--tracking-eyebrow: 0.08em`.
  **Recomendación**: no unificar («Píxel exacto»: 0.08em × 13 da 1,04 px frente a 0,78 px). Si el humano
  unifica, el cambio es mecánico: R1, R6.2, R11.2, R12.1, R12.4 y M4 pasan a `tracking-eyebrow`.

## §6. Prueba de humo (humano)

- [ ] Smoke #174 en dev build de Android (fecha: ____)

## Enmienda E1 — premisas de la firma que caducaron al mergear #173

La spec se firmó el 2026-10-13 contra `788d1f89`, con #173 sin mergear. #173 (PR #216)
y #172 entraron después y la branch absorbió `main` en `5fae110b` (`origin/main`
`dea11875`). El leader midió P1–P8 contra ese árbol y pasan todas, pero tres
premisas de la firma ya no coinciden con los ficheros. Cada una habría parado a
Codex en su primer rojo o en su verde. Esta enmienda las corrige; **donde choque con
R8, R12.2, L1 o L8, manda E1.** Ningún R-id nuevo, ninguna clase ni copy cambian.

### E1.1 — R12.2: las listas reales de `text-13` y `text-26`

En `src/__tests__/profile-canvas-fidelity.test.ts` › describe
`#173 R2.4: inventario de tamaños nuevos`, la lista de `text-13` ya no es
`['screens/profile/index.tsx']`: #172 (E8) la amplió a seis ficheros
(`it('limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)'`). La de
`text-26` sí sigue con un solo fichero. Tras R3, R4 y R6 las dos listas esperadas
quedan así (orden de `.sort()` verificado con node; los títulos de los `it` no cambian):

```
    expect(filesMatching(/\btext-26\b/)).toEqual([
      'screens/alerts/index.tsx', // #174 R3
      'screens/profile/index.tsx',
    ]);
```

```
    expect(filesMatching(/\btext-13\b/)).toEqual([
      'components/form-error.tsx',
      'screens/alerts/index.tsx', // #174 R4, R6
      'screens/forgot/index.tsx',
      'screens/login/index.tsx',
      'screens/profile/index.tsx',
      'screens/register/index.tsx',
      'screens/reset-password/index.tsx',
    ]);
```

La lista de `text-13` va en el commit rojo de R4 (primer uso, el contador); la de
`text-26`, en el de R3. R6 no vuelve a editarla.

### E1.2 — R8 / L8: el regex y el recuento de `#166 R3` en H0

En `src/__tests__/consistency-classnames.test.ts` › describe
`#166 R3: el secundario neutro lleva el labio gris`, el `it` se llama ya
`'inventaría los cinco secundarios neutros de toda la app'` (el título no cambia) y
#171 R14 ya cambió el regex a
`/testID=(?:"([^"]+)"|\{([^}]+)\})/` con `match?.[1] ?? match?.[2]`. El regex que
prescribía R8 (`\{`([^`]+)`\}`, sin la rama `\{([^}]+)\}`) devuelve `undefined` para
`secondary.testID`; y el de H0 devuelve `` `${rowId `` para el ack, porque `[^}]+` se
corta en la primera llave. Se comprobó con node. La línea nueva casa las tres formas:

```
        const match = tag.match(/testID=(?:"([^"]+)"|\{`([^`]+)`\}|\{([^}]+)\})/); // #171 R14: testID dinámico; #174 R8: plantilla
        return neutral ? [match?.[1] ?? match?.[2] ?? match?.[3]] : [];
```

La lista esperada del inventario suma el ack **primero** (`$` ordena antes que `a`,
comprobado con node) y conserva `'secondary.testID', // #171 R14`:

```
    expect(testIds.sort()).toEqual([
      '${rowId}-ack', // #174 R8
      'alert-detail-view-map',
      'docs-upload-cancel',
      'forgot-resend',
      'reminders-delete-cancel',
      'secondary.testID', // #171 R14
      'welcome-have-account',
    ]);
```

El recuento de `border-lip-gray` pasa de `4 + 1 + 1` a un tercer sumando; el de
`border-b-6` **no** cambia (el ack lleva `border-b-5`):

```
    expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1 + 1); // #170 R16; #171 R14; #174 R8
```

El `it` nuevo `'#174 R8: el ack de fila es el secundario compacto'` y el resto de R8
quedan como están. Con el ack la lista tiene siete testIDs; el título `cinco` ya no
cuadraba con la lista desde #171 R14 y no se toca. Eslint acepta `'${rowId}-ack'` entre comillas
simples (probado con `bunx eslint --stdin`, salida vacía).

### E1.3 — L1: la última línea del catálogo en H0

La última línea de la expresión de longitud de
`src/providers/__tests__/language-provider.test.tsx` es hoy
`        - 4 + 3, // #173 R13`, no `+ 7, // #170 R1`. R2 la deja así (la anterior pierde la
coma, la nueva cierra):

```
        - 4 + 3 // #173 R13
        + 1, // #174 R2
```

Si otra feature mergeada antes de H0 añade líneas, la regla de §3 no cambia: la
última línea de H0 pierde su coma y `+ 1, // #174 R2` cierra la expresión.

### E1.4 — Barrido de los demás candados globales

El leader barrió contra el árbol de `5fae110b` los recuentos globales de producción
que las clases de esta feature podrían mover. `screens/alerts/index.tsx` y
`utils/alert-meta.ts` aportan cero a todos, y ninguno cambia:

- `bg-accent-soft` y `rounded-xl bg-accent` (`#98 R10`, `#166 R2`);
- `border-b-4` y `border-black/25` (`#166 R2`);
- `text-accent-strong` (`#61 R4`);
- `style={CONTINUOUS_CORNER}` (`#98 R10`);
- design-drift: `#87 R19` (`'screens/alerts/index.tsx': 0,`), `#134 R6` y `#134 R7`.

### E1.5 — Base de las medidas

La columna «Base (`788d1f89`)» de §1 y de §3 es la de la firma. Las filas marcadas
«H0» se miden al arrancar sobre el árbol del commit del handoff, como ya decía §1,
y la tabla de H0 manda sobre cualquier valor de base que haya caducado. P1–P8 se
midieron el 2026-10-15 en `5fae110b` y pasan.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-13, vía Notion) ← gate obligatorio antes de implementar
- [ ] Enmienda E1 aprobada por humano (fecha: ____)
