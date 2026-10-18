---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: approved      # draft | approved
tags: [mobile, ui, canvas, alerts, spec]
---

# #180 — Detalle de alerta fiel al canvas

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden rojo/verde y
> [[traceability]] para la trazabilidad. Rutas de código relativas a `mobile-pet-tracker/` salvo que
> se diga otra cosa. Todas las órdenes se lanzan desde `mobile-pet-tracker/`.

## §0. Decisiones abiertas para el humano (cada una trae su valor por defecto)

La spec aplica el **valor por defecto** si el humano no dice otra cosa al firmar. La última columna nombra
qué requisito cambiaría.

| # | Pregunta | Por defecto (y por qué) | Toca |
|---|---|---|---|
| D1 | Tamaño del título. La descripción de la feature dice «24»; el artboard y la lista (#174) usan 26/900. | **26, peso 900, `tracking-title`**: es lo que pinta el canvas y lo que ya hace la lista; con 24 Alertas y su detalle no casarían. | R1 |
| D2 | Anillo de ping: ¿copia local o extraer `PingRing` de Welcome? ¿Duración con los tokens existentes (2400 ms) o la del canvas (1,8 s)? | **Copia local** `AlertPingRing` con los `MOTION_PING_*` existentes; Welcome intacto (sus tests de #167 R12 no se mueven). Extraer es una feature de refactor. | R4 |
| D3 | Píldora de distancia sobre el mapa: el canvas usa blanco 0,86 + desenfoque 12. | **`bg-glass-surface` (0,60, existente), sin desenfoque**: no hay token 0,86 ni `expo-blur`. Se ve algo más translúcida. | R5 |
| D4 | Botones mientras #177 (receta global 56/16/17-800) no esté mergeado. | **Convención #172 R20 ya en uso**: ack `h-14 rounded-xl`, secundario `h-13 rounded-xl`, etiquetas `text-17` / `text-base` en `font-extrabold`. #177 no se redefine aquí; quien mergee segundo reconcilia (radio 16). | R6, R7 |
| D5 | Radio del mapa 24: token `rounded-24` o `rounded-card` (20). | **`rounded-24`** (píxel exacto, token existente, con línea nominal en la carta). | R5 |
| D6 | Alerta leída o resuelta: ¿el héroe cambia de color? | **No**: sigue rosa/ámbar por tipo, sin ping; solo cambia la píldora (neutra o verde, como en la lista). | R3, R4 |
| D7 | Batería baja: el canvas no la dibuja. | **Héroe ámbar** (`disc` de la lista), disco `bg-warning-strong` con icono `background`, **sin mapa** (ya es así), CTA «Ver en el mapa» se mantiene, ping ámbar si está abierta. | R3, R4 |
| D8 | Formato de fecha: el canvas escribe «31 dic 2026, 13:00». | **Mes corto + hora**: `{day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'}` con el idioma de la app. La salida exacta en Hermes no se mide fuera del dispositivo: la cubre el humo. | R3 |
| D9 | Error de ack y ancla del botón. | El error (`alert-detail-action-error`) va **encima** del ack y el ack **se ancla abajo** con un espaciador `flex-1` (patrón de `forgot`). | R2, R7 |
| D10 | Esqueleto de carga. | `h-58 w-full rounded-hero` (altura aproximada del héroe); el título ya se ve. | R10 |
| D11 | Entrada: el canvas escalona 80 ms; el proyecto tiene `MOTION_STAGGER_MS = 60`. | **`HomeEntrance` con índices 0 (héroe) y 1 (mapa)**, 60 ms. | R9 |
| D12 | El humano pidió el 2026-10-15 «mejorar la pantalla de Detalle de alerta». ¿Quiere **algo más** que fidelidad al canvas? | **No**: la feature se limita al canvas. Cualquier extra (acciones nuevas, historial, compartir) es otra feature. | todos |
| D13 | `alerts.mapLabel` cuando la alerta no trae nombre de zona. | **Sin etiqueta** (el mapa queda como hoy, sin `accessibilityLabel`); no se inventa un nombre. | R5, R8 |
| D14 | Título en las pantallas de carga y de error. | **Se muestra en los tres estados** (cargando, error, contenido) para que la pantalla no salte. | R1 |
| D15 | Campo `surface` de `alert-meta.ts`: queda sin consumidor. | **Se elimina** (código muerto) junto con su columna de test. | R11 |

## §1. Base, fuente y premisas (no se reabren)

- **Base de redacción**: `origin/main` `44acd74b`. Branch `feature/180-mobile-alert-detail-canvas-fidelity`.
  Worktree `Pet-Tracker-wt-180`.
- **Fuente del diseño**: el canvas aprobado (`https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`), artboard
  del detalle de alerta. **Directiva** (2026-10-13): «el diseño final debe de quedar como el artifact».
  Píxel exacto con los tokens existentes: ningún valor entre corchetes (C8).
- **Alcance**: `src/screens/alert-detail/` (pantalla, un componente nuevo y sus tests), `src/app/_layout.tsx`
  (una línea), `src/utils/alert-meta.ts`, el catálogo i18n, la carta, las specs enmendadas y los candados
  agregados que se mueven (§4). **Sin cambios de backend ni de comportamiento** (ack, navegación al mapa,
  salida al desaparecer la alerta).
- **Premisas heredadas (decididas)**: D-H el título vive en el contenido con la cabecera nativa en
  `title: ''`; D-I iconos de `reicon-react-native`, nunca emoji; el detalle de **batería** es ámbar y
  **sin mapa**; el detalle **leído/resuelto** es rosa (por tipo) y **sin ping**; enmienda de la carta §13:
  el ack del detalle pasa a **primario con labio** (hoy figura en «Sin labio … confirmar alerta en el
  detalle»).
- **Piezas ya mergeadas en `44acd74b`** (P1–P10 de §2): `font-extrabold`, `--radius-hero`,
  `Card variant="hero"`, `disc` de `alert-meta.ts`, `PopIn`, `HomeEntrance`, `--tracking-title`,
  `--text-13/15/17/22/26`, `bg-glass-surface`.
- **#177 (receta global del botón 56/16/17-800) NO está mergeado** (`git log origin/main | grep -c 'cierra #177'`
  da `0` al redactar). #180 **no** redefine la receta: usa la convención de #172 R20 ya viva en
  `src/screens/login/index.tsx` y `src/screens/forgot/index.tsx` (D4). Si #177 mergea antes, el handoff
  re-mide R6/R7; el radio 16 manda y quien mergee segundo reconcilia los candados de `rounded-xl`.
- **Skill**: todo trabajo móvil carga `expo:expo-overview`; en el handoff a Codex se nombran las skills
  del catálogo de Codex (`leader.md` §Catálogo real de skills de Codex), no las nuestras.

## §2. Precondición y medidas en H0

«H0» es el commit del handoff a Codex. **Precondición** (si una falla, PARA y avisa al leader):

| # | Orden | Debe dar |
|---|---|---|
| P1 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | `1` |
| P2 | `grep -cF -- '--radius-hero: 28px;' src/theme/global.css` | `1` |
| P3 | `grep -cF -- '--text-22: 22px;' src/theme/global.css` | `1` |
| P4 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | `1` |
| P5 | `grep -cF -- '--tracking-title:' src/theme/global.css` | `1` |
| P6 | `grep -cF "hero: 'rounded-hero" src/components/card.tsx` | `1` |
| P7 | `grep -cF 'export function HomeEntrance' src/screens/home/home-entrance.tsx` | `1` |
| P8 | `grep -cF 'disc:' src/utils/alert-meta.ts` | `3` |
| P9 | `test -e src/__tests__/alerts-canvas-fidelity.test.ts; echo $?` | `0` |
| P10 | `test ! -e .expo/types/router.d.ts; echo $?` | `0` |

**Medidas de la base** (se re-miden en H0; cierre = base H0 + delta, nunca la cifra literal de esta
tabla si H0 difiere; si difiere de «Base `44acd74b`» se anota en `progress/impl_*.md` y se razona el
delta). Los recuentos `grep -rl … | wc -l` cuentan **ficheros** de producción (`.tsx`, sin tests) y los
`grep -rE/-rF … | wc -l` cuentan **líneas**:

| # | Orden (desde `mobile-pet-tracker/`) | Base `44acd74b` | Delta | R |
|---|---|---|---|---|
| M1 | `grep -cF "title: ''" src/app/_layout.tsx` | 7 | +1 | R1 |
| M2 | `grep -cF 'alerts.detailTitle' src/app/_layout.tsx` | 1 | -1 | R1 |
| M3 | `grep -cF 'alerts.detailTitle' src/screens/alert-detail/index.tsx` | 0 | +1 | R1 |
| M4 | `awk '/^export const R13_ALERT_DETAIL/{f=1} f&&/key:/{n++} f&&/^\];/{print n; exit}' src/__tests__/ui-copy-table.ts` | 10 | +1 | R8 |
| M5 | `grep -cE '^\s+surface:' src/utils/alert-meta.ts` | 3 | -3 | R11 |
| M6 | `grep -rlE 'variant="hero"' src --include=*.tsx \| grep -v test \| wc -l` | 1 | +1 | R3 |
| M7 | `grep -rlE '\btext-26\b' src --include=*.tsx \| grep -v test \| wc -l` | 4 | +1 | R1 |
| M8 | `grep -rlE '\btext-13\b' src --include=*.tsx \| grep -v test \| wc -l` | 11 | +1 | R3 |
| M9 | `grep -rlE '\btext-22\b' src --include=*.tsx \| grep -v test \| wc -l` | 1 | +1 | R3 |
| M10 | `grep -rlE '\btext-17\b' src --include=*.tsx \| grep -v test \| wc -l` | 5 | +1 | R7 |
| M11 | `grep -rlE '\btext-15\b' src --include=*.tsx \| grep -v test \| wc -l` | 9 | +1 | R3 |
| M12 | `grep -rlE '\btracking-title\b' src --include=*.tsx \| grep -v test \| wc -l` | 6 | +1 | R1 |
| M13 | `grep -rlE '\brounded-hero\b' src --include=*.tsx \| grep -v test \| wc -l` | 2 | +1 | R10 |
| M14 | `grep -rE 'rounded-xl bg-accent' src --include=*.tsx \| grep -v test \| wc -l` | 13 | +1 | R7 |
| M15 | `grep -rF 'border-b-4' src --include=*.tsx \| grep -v test \| wc -l` | 12 | +1 | R7 |
| M16 | `grep -rF 'border-black/25' src --include=*.tsx \| grep -v test \| wc -l` | 14 | +1 | R7 |
| M17 | `grep -cE '^### §2\.' ../specs/mobile-ui-language/design.md` | 34 | +1 | R12 |
| M18 | `grep -cF 'confirmar alerta en el detalle).' ../docs/ui-guidelines.md` | 1 | -1 | R12 |
| M19 | `grep -cF 'rounded-24' ../docs/ui-guidelines.md` | 2 | +1 | R12 |
| M20 | `grep -cE 'rounded-card\|min-h-44\|text-lg\|text-2xs\|text-sm\|h-52([^.0-9]\|$)\|bg-default\|min-h-11' src/screens/alert-detail/index.tsx` | 11 | → 1 | R3 |

M20 es una regla de borrado (ancla negativa): `grep -c` cuenta **líneas**; al cerrar queda **1**, la
línea de la píldora `acked` con `bg-default` (R3.4). Se verifica además con el `it` de R3.7, que es el
candado real. Los candados de los tests (`#62 R1`, `#166 R2`, `#166 R3`…) tienen su propio alcance y sus
propias cifras (§4, K7–K9): no se deducen de M14–M16.

## §3. Requisitos funcionales

Test de cada R-id: **F** pantalla `src/screens/alert-detail/index.test.tsx`; **A** componente
`src/screens/alert-detail/ping-ring.test.tsx` (nuevo); **L** `src/app/__tests__/layout.test.tsx`;
**C** candado nuevo `src/__tests__/alert-detail-canvas-fidelity.test.ts`; **X** candados agregados
existentes (§4). Un `it` por rama y por combinación; el id se cita en el título del `it`
(`#180 R3.2: …`). Los `it` de #100/#134/#170 que se modifican llevan el sufijo
`(enmendado por #180 Rn)` en el título.

### R1 — D-H: el título vive en el contenido

- **R1.1** THE SYSTEM SHALL declarar en `src/app/_layout.tsx` la pantalla `alerts/[alertId]` con `title: ''`
  en lugar de `t('alerts.detailTitle')`, conservando `headerShown`, `headerStyle`, `headerTintColor`,
  `headerTitleStyle` y `contentStyle` tal cual (back y gesto nativos intactos).
  - **Test (L)**: el `it` «le da la cabecera nativa de #95 R4 con el título del detalle» (línea ~429 de
    `layout.test.tsx`, `title: 't:alerts.detailTitle'`) pasa a esperar `title: ''` y se renombra
    `… con título vacío (enmendado por #180 R1)`. M1 y M2.
- **R1.2** WHEN la pantalla del detalle pinta (cargando, error o con alerta, D14), THE SYSTEM SHALL pintar
  como **primer hijo** del `ScrollView` un `Text` `testID="alert-detail-title"` con
  `accessibilityRole="header"`, `className="text-26 font-black tracking-title text-foreground"` y el texto
  `t('alerts.detailTitle')` (`Alert` / `Alerta`; la clave **ya existe**: no se añade copy).
  - **Test (F)**: tres `it` (`#180 R1.2: título en carga`, `… en error`, `… con alerta`) que buscan
    `alert-detail-title`, aseveran `props.accessibilityRole === 'header'`, el texto `Alerta` en es (y `Alert` en
    en en uno de ellos) y que es el primer hijo del ScrollView (`elementChild(scroll, 0)`); la clase exacta
    se aserta en el `it` de con alerta.
- **R1.3** THE SYSTEM SHALL mover la fila de `R13_ALERT_DETAIL` de `alerts.detailTitle` de
  `src/app/_layout.tsx` a `src/screens/alert-detail/index.tsx` (M2, M3).
  - **Test (X)**: `ui-language.test.ts` (K2, K3): el `it` de la línea ~252 se estrecha a
    `file === 'src/screens/alert-detail/index.tsx'`; en verde con la fila movida.

### R2 — Marco de la pantalla

- **R2.1** THE SYSTEM SHALL pintar el `ScrollView` `testID="screen-alert-detail"` con `contentContainerStyle`
  exactamente `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 40, gap: 14, flexGrow: 1 }`
  (20 lateral = excepción nombrada de padding de la carta; 24 superior = el de la lista de #174 R5) y
  conservar `className={position ? 'flex-1' : 'flex-1 bg-background'}` y
  `contentInsetAdjustmentBehavior="automatic"`.
  - **Test (F)**: el `it` «respeta las métricas A11 bajo cabecera nativa» (~214, hoy
    `{padding:24,gap:16,paddingBottom:48}` con `insets.bottom = 24`) pasa a esperar
    `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 14, flexGrow: 1 }` y se renombra
    `(enmendado por #180 R2)`; un `it` hermano con `insets.bottom = 0` espera `paddingBottom: 40` (candado
    de que el 40 no es `24 + 16`).
- **R2.2** THE SYSTEM SHALL pintar, entre la CTA «Ver en el mapa» y el bloque del ack, un
  `View testID="alert-detail-spacer" className="flex-1"` hijo del `ScrollView`, para anclar el ack al fondo
  cuando el contenido es más corto que la pantalla. El espaciador se pinta en **todos** los estados con
  alerta (también leída/resuelta, sin ack) para que la CTA no cambie de índice al pulsar «Marcar leída».
  - **Test (F)**: `#180 R2.2: el espaciador va entre la CTA y el ack` (alerta abierta, orden de hijos) y
    `#180 R2.2: sin ack el espaciador sigue y la CTA conserva su índice` (alerta `acked`: mismo índice de
    `alert-detail-view-map` y de `alert-detail-spacer` que con la abierta).
- **R2.3** THE SYSTEM SHALL ordenar los hijos del `ScrollView` con alerta: título, héroe, mapa (con la
  píldora de distancia dentro, R5; solo con zona), CTA, espaciador, error de ack (solo si hay) y ack (solo
  si abierta). Sin zona no hay mapa y el resto no cambia.
  - **Test (F)**: reescribe el `it` `ordena tarjeta, mapa, distancia, CTA y ack` (~717) como
    `#180 R2.3: ordena título, héroe, mapa, CTA, espaciador, error y ack`: `it.each` de las cuatro
    combinaciones {con zona, sin zona} × {con error de ack, sin error}.

### R3 — Tarjeta héroe

La tarjeta (`testID="alert-detail-card"`) es `Card variant="hero"` con el color del tipo, centrada y sin
borde.

- **R3.1** THE SYSTEM SHALL pintar la tarjeta con `variant="hero"` y `className`
  `` `${meta.disc} items-center gap-2 px-4.5 py-5.5` `` (sin `min-h-44`, `gap-3` ni `border-2` en ningún
  estado), de modo que la clase final contiene `rounded-hero`, el `disc` del tipo y
  `items-center gap-2 px-4.5 py-5.5`, y **no** contiene `bg-surface-secondary`.
  - **Test (F)**: `it.each` sobre los tres tipos (`geofence_exit`, `battery_low`, desconocido): las tres
    afirmaciones positivas y `not` de `bg-surface-secondary`, `border-2` y `min-h-44`. Si en H0 el `twMerge`
    de `Card` no expulsa `bg-surface-secondary` ante `bg-category-rose`/`bg-default` (sonda de H0, no de la
    spec), el fallback es `View` + `CONTINUOUS_CORNER` con las mismas clases y `rounded-hero`; entonces M6
    queda en su base (sin delta) y K11 no cambia.
- **R3.2** THE SYSTEM SHALL pintar en la tarjeta, **en este orden de hijos** y sin fila de cabecera
  (`alert-detail-header` desaparece): (1) el disco (R3.3); (2) la píldora `alert-detail-status` (R3.4);
  (3) `alert-detail-type`, `className="text-22 font-black text-foreground text-center"`; (4)
  `alert-detail-pet`, `className={'text-15 font-bold ' + meta.heroInk}`, `selectable`; (5)
  `alert-detail-opened-at`, `className={'text-13 font-normal ' + meta.heroInk}`.
  - **Test (F)**: reescribe el `it` de la línea ~174 (`elementChild(card, 3).props.testID`) como
    `#180 R3.2: la tarjeta pinta disco, píldora, tipo, mascota y fecha en ese orden`: cinco hijos exactos
    (el quinto existe y no hay sexto), `queryByTestId('alert-detail-header') === null` y las clases de cada
    texto.
- **R3.3** THE SYSTEM SHALL pintar el disco de 72 px: un `View` de `className`
  `` `size-18 items-center justify-center rounded-full ${meta.solid}` `` con el icono `meta.Icon`
  (`testID="alert-detail-icon"`) de **tamaño 34** y color `meta.onSolid` (token resuelto con
  `useThemeColors`, no clase), sin emoji ni escape (candado `#174 R12 grep-limpio`).
  - **Test (F)**: `it.each` sobre los tres tipos: `size` 34, color igual al token de la tabla de R11.1 y,
    en el contenedor del disco (`elementChild(card, 0)`), `size-18` + el `solid` del tipo.
- **R3.4** THE SYSTEM SHALL pintar la píldora con una decisión por estado (elemento repetido: todas candadas):

  | Estado | Clases del `Text` | Texto |
  |---|---|---|
  | `open` | `` `rounded-full px-2.5 py-0.75 text-xs font-extrabold ${meta.solid} ${meta.onSolidText}` `` | `alerts.statusOpen` |
  | `acked` | `rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted` | `alerts.statusAcked` |
  | `closed` | `` `rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}` `` | `alerts.statusClosed` |

  (`acked` y `closed` son las píldoras de la lista, #174 R9; la abierta toma el color sólido del tipo.)
  - **Test (F)**: `it.each` 3 estados con `geofence_exit` (clase exacta y texto en es) y un `it` para
    `battery_low` abierta; la abierta no contiene `bg-default`. Los `it` de las líneas ~322/331/454 (solo
    texto) no se tocan.
- **R3.5** WHEN la alerta pasa de abierta a leída por el ack, THE SYSTEM SHALL repintar la píldora a la rama
  `acked` y retirar el ping (R4) en el mismo render, sin recargar.
  - **Test (F)**: `#180 R3.5: tras el ack la píldora pasa a «Leída» y el ping desaparece` (pulsa el botón
    real `alert-detail-ack` con `await fireEvent.press(...)` y `await waitFor`, RNTL 14).
- **R3.6** THE SYSTEM SHALL pintar la fecha como
  `new Date(alert.openedAt).toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })`
  dentro de `t('alerts.openedAt', { date })` (D8).
  - **Test (F)**: el `it` «formatea la apertura…» de #100 R3 se enmienda a mes corto: es
    `/^Detectada el 31 dic 2026, \d{2}:\d{2}/`, en `/^Detected Jan 2, 2027, /` (salida medida en node
    v20.20.2 con fixtures `12:00Z`; Hermes, por humo); un `it` nuevo espía `Date.prototype.toLocaleString` y
    aserta las **cinco** claves de las opciones.
- **R3.7** THE SYSTEM SHALL eliminar de `src/screens/alert-detail/index.tsx` las clases de la pantalla
  anterior: tras el cierre, la regex de M20 solo casa `bg-default` (una vez).
  - **Test (C)**: `#180 R3.7: el fichero no nombra las clases de la pantalla anterior`: `matchAll` de la
    regex de M20 (sin la alternativa `bg-default`) sobre el fuente da `[]`, y `bg-default` aparece
    exactamente una vez.

### R4 — Ping del héroe

- **R4.1** WHILE la alerta está `open` y `useReducedMotion()` es `false`, THE SYSTEM SHALL pintar detrás del
  disco **un** anillo `AlertPingRing` (`src/screens/alert-detail/ping-ring.tsx`, export nombrado) con
  `testID="alert-detail-ping"` y `className={'absolute size-23 rounded-full ' + meta.ring}`, `Animated.View`
  con `scale` de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE` y `opacity` de `MOTION_PING_FROM` a `0`, en
  bucle (`withRepeat(…, -1, false)`) con `MOTION_PING_TIMING` (2400 ms).
  - **Test (A)**: `ping-ring.test.tsx` con el doble de reanimated de Welcome (`__esModule: true`,
    `useReducedMotion` por `mockUseReducedMotion`, `withRepeat` identidad) y la técnica de #167 R12
    (`act(async () => { jest.advanceTimersByTime(n) })`, `getAnimatedStyle`): a 0 ms
    `{ opacity: 0.55, transform: [{ scale: 0.55 }] }`; a 2500 ms `{ opacity: 0, transform: [{ scale: 1.5 }] }`;
    a 1200 ms ninguno de los dos extremos (`not.toEqual` a cada uno).
- **R4.2** WHILE la alerta no está `open` (`acked` o `closed`), THE SYSTEM SHALL no pintar
  `alert-detail-ping`; WHILE `useReducedMotion()` es `true`, THE SYSTEM SHALL no pintarlo aunque esté abierta.
  - **Test (F)**: `it.each` `acked`/`closed` → `queryByTestId('alert-detail-ping')` `null`; y la pareja
    `#180 R4.2: abierta con movimiento normal sí hay ping` (control positivo, mismo montaje) /
    `… con movimiento reducido no hay ping` (el `null` solo vale con el control positivo en verde; la
    consulta usa `includeHiddenElements: true`).
- **R4.3** THE SYSTEM SHALL colorear el anillo con `meta.ring` (R11): `bg-danger/20` (salida de zona),
  `bg-warning-strong/20` (batería), `bg-muted/20` (desconocido).
  - **Test (F)**: `it.each` 3 tipos abiertos: la clase del anillo contiene el `ring` del tipo.
- **R4.4** THE SYSTEM SHALL no importar `PingRing` de Welcome ni tocar `src/screens/welcome/` (D2).
  - **Test (C)**: `#180 R4.4`: el fuente de `ping-ring.tsx` no contiene `welcome` (grep sobre el fichero) y
    `screens/welcome/index.tsx` sigue sin exportar `PingRing`.

### R5 — Mapa y píldora de distancia

- **R5.1** WHEN la alerta tiene geovalla y la consulta devolvió la zona, THE SYSTEM SHALL pintar el mapa
  `alert-detail-map` con `className="h-52.5 overflow-hidden rounded-24"` y `style={CONTINUOUS_CORNER}`
  (se pierden `h-52` y `rounded-card`). La batería baja no tiene mapa.
  - **Test (F)**: los `it` de #170 R8 (~459 y `pinta el mapa tras la tarjeta y antes del ack` ~503) se
    enmiendan: clase exacta y `style`; `it` de batería: `queryByTestId('alert-detail-map')` `null` **y**
    `alert-detail-view-map` presente (control positivo).
- **R5.2** WHILE `Math.round(d - zone.radiusM) >= 1`, THE SYSTEM SHALL pintar la distancia como píldora
  **dentro** del mapa (hija del `View` del mapa, no hermana): `Text testID="alert-detail-distance"`,
  `className="absolute bottom-3 left-3 rounded-full bg-glass-surface px-2.5 py-1.5 text-xs font-bold text-foreground"`,
  `style={TABULAR_NUMS}` y el texto actual de `alerts.distanceFromZone`. Si la distancia es < 1 m o falta
  la posición, no se pinta (comportamiento actual).
  - **Test (F)**: el `it` «pinta la distancia bajo el mapa» (~600) se renombra `… sobre el mapa
    (enmendado por #180 R5)` y comprueba con `within(map).getByTestId('alert-detail-distance')` (descendiente;
    `within` excluye la raíz y aquí no hace falta); el `it.each` de los umbrales 0 m / 1 m sigue vigente; la
    clase exacta en uno.
- **R5.3** THE SYSTEM SHALL conservar el mapa **sin** ancestro con fondo propio (#170 R9) y `PetMap` con las
  mismas props; la píldora es `children` del `View` del mapa, no de `PetMap`.
  - **Test (F)**: los `it` de #170 R9 (~517) siguen en verde sin cambios; uno nuevo
    `#180 R5.3: PetMap no recibe children` (props del doble de `pet-map`).
- **R5.4** WHEN existe el nombre de la zona, THE SYSTEM SHALL pintar el contenedor del mapa `accessible` con
  `accessibilityLabel={t('alerts.mapLabel', { zone })}`, donde `zone` es `alert.payload.geofenceName` si
  existe y, si no, `zone.name`. IF no hay ninguno, THEN THE SYSTEM SHALL omitir la etiqueta (D13).
  - **Test (F)**: tres `it` (nombre del payload, nombre de la zona, ninguno → `accessibilityLabel`
    `undefined`), el primero en es y en en con los literales exactos `Ubicación al salir de la zona Casa` /
    `Location when leaving Casa`.

### R6 — CTA «Ver en el mapa»

- **R6.1** THE SYSTEM SHALL pintar `alert-detail-view-map` con `variant="secondary"` y
  `className="h-13 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"` (sin `min-h-11`), con el
  icono `Map` de `reicon-react-native` (tamaño 18, color del token `foreground` vía `useThemeColors`)
  **antes** de la etiqueta, y la etiqueta `Button.Label className="text-base font-extrabold text-foreground"`
  con `alerts.viewOnMap`. La acción (`selectPet` + `router.dismissTo('/map')`) no cambia.
  - **Test (F)**: `#180 R6.1: la CTA lleva h-13, labio gris y el icono Map antes de la etiqueta` (el doble
    de `reicon-react-native` del test se amplía con `Map`, K17); los `it` de #170 R15 de la acción siguen
    en verde.
- **R6.2** THE SYSTEM SHALL mantener la CTA en **todos** los estados con alerta (abierta, leída, resuelta,
  con y sin mapa).
  - **Test (F)**: `it.each` 3 estados × con/sin zona (6) → `getByTestId('alert-detail-view-map')`.

### R7 — Ack primario con labio

- **R7.1** WHILE la alerta está `open`, THE SYSTEM SHALL pintar `alert-detail-ack` con
  `className="w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"` y la etiqueta
  `Button.Label className="text-17 font-extrabold text-accent-foreground"` con `alerts.ack` (precedente
  #172 R20, D4). El error de ack (`alert-detail-action-error`, `text-danger`) va **inmediatamente antes** del
  botón (R2.3). El ack no se pinta si la alerta no está `open`.
  - **Test (F)**: clase exacta del botón y de la etiqueta; `it.each` `acked`/`closed` sin `alert-detail-ack`
    (con el control positivo de la abierta); error antes del botón (orden de hijos).
- **R7.2** THE SYSTEM SHALL conservar íntegra la lógica del ack (guard `ackingRef`, `settleAlertAck`,
  `acking`, mensajes de error, salida con `router.dismissTo('/alerts')`).
  - **Test (F)**: los `it` de #100 R5 (~308), #134 R2 (~380), #170 R6 (~434) y R8–R14 no se tocan y siguen
    en verde.
- **R7.3** THE SYSTEM SHALL sumar la pantalla a los inventarios de «primario sólido con labio» y a nada más
  (K7–K9, K13).
  - **Test (X)**: `#62 R1`, `#166 R2` y `#166 R3` en verde con las cifras de §4.

### R8 — Copy `alerts.mapLabel`

- **R8.1** THE SYSTEM SHALL añadir al catálogo `src/i18n/catalog.ts` la clave `alerts.mapLabel` en orden
  alfabético dentro de `alerts.*`: en `'Location when leaving {{zone}}'`, es
  `'Ubicación al salir de la zona {{zone}}'`. Solo lectores de pantalla. **Ninguna otra clave nueva.**
  - **Test (X)**: `language-provider.test.tsx` (K4, K5): longitud del catálogo `+ 1`, con la cola actual
    `- 2 // #179 R5` / `+ 9, // #183 R1` (la última línea de H0 pierde su coma y se añade una línea nueva
    `+ 1, // #180 R8`; medido con `grep -n`), y las filas de copia
    `['alerts.mapLabel', 'Location when leaving {{zone}}', 'Ubicación al salir de la zona {{zone}}']` en los dos
    sitios donde viven las demás (~678 y ~732).
- **R8.2** THE SYSTEM SHALL añadir `{ file: 'src/screens/alert-detail/index.tsx', key: 'alerts.mapLabel' }, // #180 R8`
  a `R13_ALERT_DETAIL` (M4: 10 → 11).
  - **Test (X)**: `ui-language.test.ts` (K2): `toHaveLength(11 - 3 + 2 + 1); // #170 R16, #180 R8`.

### R9 — Entrada escalonada

- **R9.1** THE SYSTEM SHALL envolver el héroe en `HomeEntrance index={0} testID="alert-detail-card-entrance"`
  y el mapa (si existe) en `HomeEntrance index={1} testID="alert-detail-map-entrance"` (D11), sin `PopIn`; el
  título, la CTA y el ack no se envuelven.
  - **Test (F)**: `#180 R9.1: el héroe y el mapa entran con HomeEntrance 0 y 1` con el doble de
    `home-entrance` que registra `index`; control: el título no está envuelto (`getByTestId('alert-detail-title')`
    no es descendiente de ningún `*-entrance`).

### R10 — Carga y error

- **R10.1** WHILE se carga la alerta, THE SYSTEM SHALL pintar el título y
  `Skeleton testID="alert-detail-loading" className="h-58 w-full rounded-hero"` (D10).
  - **Test (F)**: el `it` de #100 R4 (~226) se enmienda con la clase nueva.
- **R10.2** IF la alerta no carga, THEN THE SYSTEM SHALL pintar el título, `alert-detail-error` y
  `alert-detail-retry` con `className="h-13"` (sin `min-h-11`); el reintento sigue funcionando.
  - **Test (F)**: el `it` de error de #100 R4 / #134 R2 se enmienda (clase) y el de reintento no se toca.

### R11 — Metadatos de `alert-meta.ts`

- **R11.1** THE SYSTEM SHALL **eliminar** el campo `surface` de los tres tipos de `src/utils/alert-meta.ts`
  (M5: 3 → 0) y añadir estos campos por tipo (literales exactos):

  | Tipo | `solid` | `onSolid` (token) | `onSolidText` | `heroInk` | `ring` |
  |---|---|---|---|---|---|
  | `geofence_exit` | `bg-danger` | `danger-foreground` | `text-danger-foreground` | `CATEGORY_SLOTS.rose.ink` | `bg-danger/20` |
  | `battery_low` | `bg-warning-strong` | `background` | `text-background` | `CATEGORY_SLOTS.amber.ink` | `bg-warning-strong/20` |
  | desconocido | `bg-muted` | `background` | `text-background` | `CATEGORY_SLOTS.neutral.ink` | `bg-muted/20` |

  El `disc` existente sirve de fondo del héroe. `danger-foreground` viene del tema de HeroUI (no de
  `global.css`): el test resuelve el token con el doble de `use-theme-colors`, no con un hex.
  - **Test (X)**: `src/utils/alert-meta.test.ts` **nuevo** con `it.each` por tipo que aserta los cinco campos
    exactos y, en el commit rojo de **R3** (hasta entonces el detalle aún lee `surface`), `'surface' in meta === false`; el candado `#174 R12 grep-limpio` (emoji y escapes) sigue en
    verde sobre este fichero.
- **R11.2** THE SYSTEM SHALL no nombrar `bg-category-*` / `text-category-*` fuera de
  `src/utils/category-palette.ts` (#64 R9): `heroInk` y `disc` se leen de `CATEGORY_SLOTS`.
  - **Test (X)**: `#64 R9` en verde sin cambios.

### R12 — Carta, `ui-language` y specs enmendadas

- **R12.1** THE SYSTEM SHALL añadir al final de cada fichero de la tabla el bloque canónico de `design.md`
  §4 (cercado ```` ```markdown ````), sustituyendo `<FEATURE>` y `<QUÉ CAMBIA>`. En la carta va detrás de la
  última sección `## Enmienda #` de H0 (`## Enmienda #174 — Alertas fieles al canvas`).

  | Fichero | `<FEATURE>` | `<QUÉ CAMBIA>` |
  |---|---|---|
  | `docs/ui-guidelines.md` | `ui-guidelines` | `§13: el ack del detalle de alerta es primario con labio (sale de «Sin labio»); §12: línea nominal de rounded-24 para el mapa del detalle (#180)` |
  | `specs/mobile-alert-detail-screen/requirements.md` | `mobile-alert-detail-screen` | `#100 R3: la tarjeta es un héroe centrado (disco de 72, píldora, tipo, mascota, fecha con mes corto), sin borde ni cabecera en fila; #100 R4: título en el contenido, esqueleto h-58 y reintento h-13` |
  | `specs/mobile-alerts-grouped-and-detail-map/requirements.md` | `mobile-alerts-grouped-and-detail-map` | `#170 R6: severidad en el héroe (color por tipo, sin borde); #170 R8: mapa h-52.5 rounded-24; #170 R10: la distancia es una píldora dentro del mapa; #170 R15: la CTA lleva el icono Map y h-13` |
  | `specs/mobile-reminders-alerts-to-stack/requirements.md` | `mobile-reminders-alerts-to-stack` | `#114 R4: el detalle declara title vacío; #114 R6: el detalle usa padding lateral 20, gap 14 y paddingBottom insets.bottom + 40` |
  | `specs/mobile-chunky-cta/requirements.md` | `mobile-chunky-cta` | `#166 R2: el ack del detalle de alerta es primario sólido con labio (h-14, border-b-4, border-black/25)` |
  | `specs/mobile-tab-screens-canvas-fidelity/requirements.md` | `mobile-tab-screens-canvas-fidelity` | `#173 R2.2/R2.4: el detalle de alerta entra en los inventarios de text-13, text-22 y text-26; #173 R3.3: Perfil y el detalle de alerta son los consumidores de Card hero` |
  | `specs/mobile-alerts-canvas-fidelity/requirements.md` | `mobile-alerts-canvas-fidelity` | `#174 R11: la frase de §13 «confirmar alerta en el detalle» deja de existir; #174 R12: los inventarios de text-15 y tracking-title suman el detalle` |

  Además, en cada spec, la línea `> Enmendado por #180 (ver «Enmienda #180» al final).` como párrafo propio
  justo después de cada encabezado citado; en `mobile-alerts-grouped-and-detail-map`, que usa viñetas, el
  marcador `_(Enmendado por #180.)_` va en la misma línea, detrás del rótulo en negrita:

  | Spec | Ancla (`grep -cF -e '…'` = 1, verificadas al redactar) |
  |---|---|
  | `mobile-alert-detail-screen` | `### R3 — El detalle pinta la alerta desde la caché del listado`; `### R4 — Carga, error y salida sin la alerta` |
  | `mobile-alerts-grouped-and-detail-map` | `- **R6 — Severidad en el detalle.**`; `- **R8 — Mini-mapa.**`; `- **R10 — Distancia a la zona.**`; `- **R15 — CTA «Ver en el mapa».**` |
  | `mobile-reminders-alerts-to-stack` | `### R4 — Cabecera nativa con el look de #95`; `### R6 — Métricas bajo cabecera nativa (A11)` |
  | `mobile-chunky-cta` | `### R2. Todo primario sólido lleva el labio` |
  | `mobile-tab-screens-canvas-fidelity` | `- **R2.2**`; `- **R2.4**`; `- **R3.3**` |
  | `mobile-alerts-canvas-fidelity` | `### R11 — Enmiendas a la carta y a specs aprobadas`; `### R12 — Candados agregados y grep-limpio` |

  El implementer repite cada `grep -cF` en H0; si una ancla no da `1`, para.
- **R12.2** Cambios en la carta (`docs/ui-guidelines.md`):
  - **§13**: en la viñeta «Sin labio», la cola `(reintentos, confirmar alerta en el detalle).` pasa a
    `(reintentos).` (M18: 1 → 0); y una viñeta nueva justo detrás de «Secundario compacto de fila (#174)»,
    con su sangría: `Primario del detalle de alerta (#180): ack con labio, h-14 rounded-xl, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 con el icono Map.`
  - **§12**: una línea nominal, detrás de las de #175/#179: `Fuera de la escala … (#180): el mapa del detalle de alerta usa rounded-24 (un View, no Card).` (M19: 2 → 3).
  - **Regla 2**: las líneas de tamaños y de tracking ya traen `--text-22/26/15` y `--tracking-title`
    (P3–P5); no se tocan.
- **R12.3** THE SYSTEM SHALL añadir `### §2.35 — Añadidos por #180` a `specs/mobile-ui-language/design.md`
  (número = M17 de H0 + 1) con la fila de `alerts.mapLabel` y la nota de que `alerts.detailTitle` se pinta ahora
  en `src/screens/alert-detail/index.tsx` (la cola de su fila deja de decir `src/app/_layout.tsx`).
- **R12.4** THE SYSTEM SHALL actualizar `alerts-canvas-fidelity.test.ts` (~144, K15).
- **Tests (C)**: describe `#180 R12: enmiendas` en el fichero nuevo `alert-detail-canvas-fidelity.test.ts`,
  con la técnica de `#174 R11` (describe homónimo de `src/__tests__/alerts-canvas-fidelity.test.ts`:
  mecanismo `AMENDED_DOCS` y bloque canónico leído del cercado de `design.md` §4): extrae el cercado de
  `specs/mobile-alert-detail-canvas-fidelity/design.md` §4; un `it` por fila de R12.1 (el bloque sin la línea
  de firma está en el fichero; la firma casa `/- \[[ xX]\] Enmienda #180 aprobada por humano/`); un `it` por
  spec de la tabla de anclas con el texto colapsado (`s.replace(/\s+/g, ' ')`) que contiene
  `<ancla> > Enmendado por #180 (ver «Enmienda #180» al final).` o, en las viñetas, `<ancla> _(Enmendado por #180.)_`;
  y un `it` de la carta (M18 en 0, viñeta nueva una vez, línea nominal de `rounded-24` una vez).
  Rojo: el bloque no está en `docs/ui-guidelines.md`.

### R13 — Candados agregados y fichero de candados

- **R13.1** THE SYSTEM SHALL actualizar los candados de §4 con la base medida en H0 y el delta nombrado, sin
  aflojar ninguna aserción a prefijo.
  - **Test (X)**: cada candado de §4 en verde; la sonda de mutación de `tasks.md` §«Sondas» los pone en rojo.
- **R13.2** THE SYSTEM SHALL crear `src/__tests__/alert-detail-canvas-fidelity.test.ts` con los candados C de
  R3.7, R4.4 y R12, y el grep-limpio de `ping-ring.tsx` (sin emoji ni escapes `\u`).
  - **Test (C)**: el fichero corre solo con `pnpm exec jest --config … src/__tests__/alert-detail-canvas-fidelity.test.ts`.

### R14 — Prueba de humo en dev build de Android (gate humano)

- **R14.1** WHEN el reviewer aprueba, THE SYSTEM SHALL superar la prueba de humo manual en **dev build de
  Android** (nunca Expo Go), en tema claro y oscuro, y en es y en:
  1. El detalle abre con el back nativo y el título «Alerta»/«Alert» grande (26, peso 900) en el contenido.
  2. El héroe rosa centra el disco de 72 con el anillo latiendo (alerta abierta); el texto cabe sin recorte.
  3. La píldora «Sin leer» es sólida; tras «Marcar leída» pasa a «Leída» neutra, el ping se detiene y el ack
     desaparece sin que la CTA salte.
  4. El mapa (alto 210, radio 24) muestra la píldora de distancia sobre él, legible en claro y oscuro (D3).
  5. «Ver en el mapa» lleva el icono y el ack queda anclado abajo; el error de ack, si aparece, queda encima.
  6. La fecha sale con mes corto y hora (D8); se anota el texto exacto de Hermes.
  7. Con una alerta de batería baja: héroe ámbar, sin mapa, CTA presente.
  8. TalkBack lee el mapa como «Ubicación al salir de la zona X».
- **R14.2** Casilla propia en §6: `- [ ] Smoke #180 en dev build de Android`. Ningún test la exige marcada;
  si un test la lee, usa la regex tolerante `/- \[[ xX]\] Smoke #180/`.

## §4. Candados que se mueven (base medida en H0 + delta)

Siglas: LP `src/providers/__tests__/language-provider.test.tsx`; UL `src/__tests__/ui-language.test.ts`;
CC `src/__tests__/consistency-classnames.test.ts`; PF `src/__tests__/profile-canvas-fidelity.test.ts`;
DD `src/__tests__/design-drift.test.ts`; AC `src/__tests__/alerts-canvas-fidelity.test.ts`;
LT `src/app/__tests__/layout.test.tsx`; DT `src/screens/alert-detail/index.test.tsx`.

| # | Fichero › candado | Base (`44acd74b`) | Cambio | R |
|---|---|---|---|---|
| K1 | LT › `le da la cabecera nativa de #95 R4 con el título del detalle` (~429) | `title: 't:alerts.detailTitle'` | `title: ''`, `// #180 R1` | R1 |
| K2 | UL › ~251/252 | `toHaveLength(11 - 3 + 2); // #170 R16` y `every(file === layout \|\| detail)` | `… + 1; // #170 R16, #180 R8`; `every(file === detail)` | R1, R8 |
| K3 | `ui-copy-table.ts` › `R13_ALERT_DETAIL` | fila `{ file: 'src/app/_layout.tsx', key: 'alerts.detailTitle' }` | `{ file: 'src/screens/alert-detail/index.tsx', key: 'alerts.detailTitle' }, // #180 R1`; fila nueva de `alerts.mapLabel` | R1, R8 |
| K4 | LP › longitud del catálogo (cola) | `- 2 // #179 R5` y `+ 9, // #183 R1` | la última línea pierde su coma; `+ 1, // #180 R8` (línea nueva) | R8 |
| K5 | LP › filas de copia (~678, ~732) | — | `['alerts.mapLabel', …]` en cada sitio | R8 |
| K6 | `specs/mobile-ui-language/design.md` | último `### §2.34` | `### §2.35` | R12 |
| K7 | CC › `#62 R1` (~102) | `toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1 - 1 - 1)` (16) | `+ 1` (H0 + 1), `// #180 R7` | R7 |
| K8 | CC › `#166 R2` `expected` | 16 ficheros | `+ [join('screens','alert-detail','index.tsx')]: 1`; `dieciséis`→`diecisiete` | R7 |
| K9 | CC › `border-b-4` (~583) y `border-black/25` (~584) | 17 y 19 | 18 y 20 | R7 |
| K10 | PF › `#173 R2.4` listas de `text-26` y `text-13` | 4 y 11 ficheros | `+ 'screens/alert-detail/index.tsx'` en cada una, en orden `.sort()` (comprobar con `node -e`: `alert-detail` < `alerts` porque `-` 0x2D < `s` 0x73) | R1, R3 |
| K11 | PF › `#173 R3` consumidores de `variant="hero"` | `['screens/profile/index.tsx']`; `it` «Perfil es el único consumidor de Card hero» | `['screens/alert-detail/index.tsx','screens/profile/index.tsx']`; el `it` se renombra «Perfil y el detalle de alerta son los consumidores de Card hero» | R3 |
| K12 | PF › `#173 R2` lista de `rounded-hero` | `['components/card.tsx','screens/profile/index.tsx']` | `+ 'screens/alert-detail/index.tsx'` (el esqueleto usa `rounded-hero`, R10.1) | R10 |
| K13 | DD › `limita text-22 a Horario y text-17 al inventario de E1.2` (~1179) | `text-22`: meal-schedule; `text-17`: forgot, login, meal-schedule, register, reset-password | `text-22` + `screens/alert-detail/index.tsx`; `text-17` + `screens/alert-detail/index.tsx` (primero) | R3, R7 |
| K14 | AC › `#174 R12 inventarios` (~175-210) | `text-15` (9 ficheros), `tracking-title` (6) | `+ 'screens/alert-detail/index.tsx'` en cada una, `// #180 R12` | R1, R3 |
| K15 | AC › ~144 | `toContain('confirmar alerta en el detalle).')` | `toContain('(reintentos).')` + `not.toContain('confirmar alerta en el detalle')` | R12 |
| K16 | DT › `#100 R3` filas de `it.each` | `['geofence_exit','LocationSlash','bg-danger-soft','--color-danger','Salió de la zona']` | se retira la columna `surface`; el resto de columnas sigue | R3, R11 |
| K17 | DT › mock de `reicon-react-native` | `BatteryLow, Bell, LocationSlash` | `+ Map` | R6 |
| K18 | DT › `ordena …` (~717) | 4 hijos | `it.each` de R2.3 | R2 |

Los números de línea (`~`) son orientativos y los desplazará el trabajo ajeno: **se localizan por contenido**
(`grep -nF`) en H0. Los candados que **no** cambian pero se re-ejecutan: `#64 R9`, `#174 R12 grep-limpio`,
`#134 R6/R7` (`'screens/alert-detail/index.tsx': 0` ~576, ~885, ~905), los contadores de `CONTINUOUS_CORNER` y
`TABULAR_NUMS` por fichero de `#62`, `#170 R9`, y las cuatro suites de ruta que montan `/alerts/<id>`
(`alert-detail.navigation`, `alert-detail.notification`, `detail-stack`, `detail-stack.guard` en
`src/app/__tests__/`): en H0 se corren; donde den rojo por `Animated.View` indefinido, se copia el doble de
`alert-detail.navigation.test.tsx` (líneas 47-51, con `__esModule: true`).

## §5. Fuera de alcance

Delimitaciones (diferencias conscientes con el canvas):

- Interlineado del `body` del canvas (1.4); los `text-13/15/22/26` no traen `line-height`.
- Desenfoque (12) y blanco 0,86 de la píldora de distancia (D3); duración 1,8 s del ping (D2); retardo 80 ms (D11).
- Radio 16 de los botones y receta 56/16/17-800 global: es #177 (D4).
- Chevron de back dentro del contenido: el back es el nativo (D-H).
- Tipos de alerta nuevos del backend: se pintan como desconocidos (neutro).

Features aparte:

- Acciones nuevas en el detalle (compartir, historial, silenciar), mapa interactivo o cualquier mejora que
  no sea fidelidad al canvas (D12).
- Otras pantallas que adopten D-H o D-I.
- Extraer `PingRing` de Welcome a un componente compartido (D2).
- Cambios de backend o de comportamiento del ack y de la navegación.

## §6. Prueba de humo (humano)

- [X] Smoke #180 en dev build de Android (fecha: 2026-10-18)

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-17) ← gate obligatorio antes de implementar

## Enmienda E1 — D2, D3, D4 al valor exacto del canvas

> Escrita el 2026-10-18 sobre la spec aprobada (firma del 2026-10-17), por la directiva del humano:
> «nos debemos acercar al diseño del canvas en D1 a D5; si es necesario cambiar cosas hazlo, igual instalar
> dependencias». No toca el texto de R1-R14 ni la firma original; **donde E1 y el texto de un R choquen,
> manda E1**. Su casilla va **sin marcar**: el humano reabre el gate solo para esta enmienda. Fuente única
> del diseño: el artboard `DetalleAlerta.dc.html` del canvas aprobado
> (`https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`). Detalle técnico en `design.md` §9; pasos en
> `tasks.md` §E1.

### E1.1 Qué decidía §0 y qué decide ahora

| # | Antes (firmado) | Canvas | Ahora (E1) | Requisitos |
|---|---|---|---|---|
| D1 | 26 / peso 900 / `tracking-title` | 26 / 900 / -0.02em | **Sin cambio** (ya era el valor exacto) | R1 |
| D2 | `AlertPingRing` con `MOTION_PING_TIMING` (2400 ms) | 1,8 s, ease-out | **1800 ms con ease-out**: token nuevo `MOTION_ALERT_PING_MS` y `MOTION_CELEBRATION_EASE_OUT` (la misma curva `cubic-bezier(0,0,.58,1)` que el `ease-out` de CSS). Welcome intacto | R4.1 (enmendado por E1), R4.5 |
| D3 | `bg-glass-surface` (0,60) sin desenfoque, sin dependencia | blanco 0,86 + desenfoque 12 | **`BlurView` de `expo-blur` (ya instalada, sin `bun add`) + relleno nuevo `bg-glass-surface-strong` (0,86)** | R5.2 (enmendado por E1), R5.5, R5.6 |
| D4 | botones `rounded-xl` hasta que #177 mergee | radio 16 | **`rounded-16` (token existente) en el ack y en «Ver en el mapa»**; alturas `h-14` / `h-13` y etiquetas como en R6/R7 | R6.1 y R7.1 (enmendados por E1), R7.3 (enmendado por E1), R7.4, R7.5 |
| D5 | `rounded-24`, `h-52.5` | radio 24, alto 210 | **Sin cambio** (ya era el valor exacto) | R5.1 |

D6-D15 **no cambian** (revisión solo informativa, en `progress/spec_E1_180.md`).

### E1.2 Requisitos nuevos y enmendados

Test de cada id: **F** `src/screens/alert-detail/index.test.tsx`; **A** `src/screens/alert-detail/ping-ring.test.tsx`;
**M** `src/theme/__tests__/motion.test.ts`; **G** `src/theme/__tests__/global-css.test.ts`; **C**
`src/__tests__/alert-detail-canvas-fidelity.test.ts`; **X** candados agregados (E1.4). Mismas reglas de §3: un
`it` por rama y por combinación, id en el título; los `it` de R4.1/R5.2/R6.1/R7.1 que cambian llevan el sufijo
`(enmendado por E1)`.

- **R4.1 (enmendado por E1)** WHILE la alerta está `open` y `useReducedMotion()` es `false`, THE SYSTEM SHALL
  pintar el anillo `AlertPingRing` como en R4.1, pero con la animación
  `withTiming(…, { duration: MOTION_ALERT_PING_MS, ...MOTION_CELEBRATION_EASE_OUT })` en bucle
  (`withRepeat(…, -1, false)`), en lugar de `MOTION_PING_TIMING`. `scale` y `opacity` conservan sus extremos
  (`MOTION_PING_FROM` a `MOTION_PING_TO_SCALE`; `MOTION_PING_FROM` a `0`).
  - **Test (A)**: el `it` de R4.1 se reescribe como `#180 R4.1 (enmendado por E1): el anillo late en 1800 ms con
    ease-out`, con la misma técnica (doble de reanimated de Welcome, `act(async () => { jest.advanceTimersByTime(n) })`,
    `getAnimatedStyle`): a **0 ms** `{ opacity: 0.55, transform: [{ scale: 0.55 }] }`; a **1900 ms**
    `{ opacity: 0, transform: [{ scale: 1.5 }] }` (con 2400 ms aún no habría llegado: mata la duración vieja);
    a **900 ms** ninguno de los dos extremos (`not.toEqual` a cada uno).
- **R4.5 (nuevo)** THE SYSTEM SHALL exportar de `src/theme/motion.ts` `MOTION_ALERT_PING_MS = 1800` y dejar
  `MOTION_PING_TIMING` (2400 ms, Welcome) y `MOTION_CELEBRATION_EASE_OUT` sin cambios.
  - **Test (M)**: `#180 R4.5: declara el ping del detalle de alerta en 1800 ms` (modelo: `'declara la duración del ping'`);
    la lista del `it` «no exporta nada más» suma `'MOTION_ALERT_PING_MS'` en su sitio `.sort()` (comprobado con
    `node -e`: va primera, `A` < `B`); los `it` existentes de `MOTION_PING_TIMING` (2400) y de
    `MOTION_CELEBRATION_EASE_OUT` siguen en verde (control de que Welcome y Celebration no se movieron).
  - **Test (C)**: `#180 R4.5: ping-ring.tsx no usa MOTION_PING_TIMING ni escribe 1800` (el fuente no contiene
    `MOTION_PING_TIMING` ni el literal `1800`).
- **R5.2 (enmendado por E1)** WHILE `Math.round(d - zone.radiusM) >= 1`, THE SYSTEM SHALL pintar la distancia
  como una píldora de cristal con desenfoque **dentro** del `View` del mapa: un
  `BlurView` (de `expo-blur`) `testID="alert-detail-distance-blur"`, `intensity={48}`,
  `blurMethod="dimezisBlurViewSdk31Plus"`, `tint={theme === 'dark' ? 'dark' : 'light'}` (el `theme` de
  `useUniwind` que ya lee `AlertDetailMap`) y
  `className="absolute bottom-3 left-3 overflow-hidden rounded-full"`, con un único hijo
  `Text testID="alert-detail-distance"`,
  `className="bg-glass-surface-strong px-2.5 py-1.5 text-xs font-bold text-foreground"`,
  `style={TABULAR_NUMS}` y el texto de `alerts.distanceFromZone`. Sin zona, con distancia < 1 m o sin
  posición, **no** se pinta ni el `BlurView` ni el texto. (En Android `intensity` 48 equivale a un radio
  de ~12 px con el `blurReduction` por defecto de 4: es el desenfoque 12 del canvas.)
  - **Test (F)**, con un doble local de `expo-blur` que renderiza un `View` con las props recibidas (precedente:
    `floating-tab-bar.test.tsx`):
    - `#180 R5.2 (enmendado por E1): la distancia es un BlurView dentro del mapa`: `within(map).getByTestId('alert-detail-distance-blur')`
      con `intensity` 48, `blurMethod` `dimezisBlurViewSdk31Plus` y la `className` exacta; y
      `within(blur).getByTestId('alert-detail-distance')` (el texto es hijo del desenfoque).
    - `it.each` tema `light`/`dark` (con `mockTheme`, como el `it` de `colorScheme` del mapa): `tint` `'light'` / `'dark'`.
    - La clase exacta del texto, y que su lista de clases **no contiene** `bg-glass-surface` suelto
      (`className.split(' ')`), para no confundir el prefijo de `bg-glass-surface-strong`.
    - El `it.each` de umbrales 0 m / 1 m sigue vigente y aserta también `queryByTestId('alert-detail-distance-blur')`
      `null` en 0 m, con su control positivo en 1 m (mismo montaje). Sin zona (batería): ambos `null`.
- **R5.5 (nuevo)** THE SYSTEM SHALL declarar en `src/theme/global.css`, junto al par `glass-surface` y en los
  dos temas, el par visual e imperativo del relleno fuerte: claro `--glass-surface-strong: rgba(255,255,255,0.86)`
  y `--color-glass-surface-strong: rgba(255,255,255,0.86)`; oscuro `rgba(22,27,34,0.86)` en ambos. El par
  `glass-surface` (0,60) no cambia (lo usa la barra de pestañas).
  - **Test (G)**: describe `#180 R5.5: token glass-surface-strong en light y dark` con `it.each` de los dos temas
    (`toMatchObject` sobre `parseVariables(extractVariant(theme))` con las dos claves) y un `it` de control: en los
    dos temas `glass-surface` sigue siendo `rgba(255,255,255,0.60)` / `rgba(22,27,34,0.60)`.
- **R5.6 (nuevo)** THE SYSTEM SHALL no añadir ni cambiar dependencias (`expo-blur ~57.0.2` ya está en
  `package.json` y en `node_modules`; la directiva humana de poder instalar no se usa) y limitar el import de
  `expo-blur` en código de producción a `src/components/floating-tab-bar.tsx` y
  `src/screens/alert-detail/index.tsx`.
  - **Test (C)**: `#180 R5.6: solo la barra de pestañas y el detalle importan expo-blur`: los ficheros `.tsx` de
    producción (sin tests) cuyo texto contiene `from 'expo-blur'` son exactamente esos dos, en orden `.sort()`.
    Comprobación del reviewer (no jest): `git diff <H0> -- package.json` y el lockfile, sin cambios.
- **R6.1 (enmendado por E1)** THE SYSTEM SHALL pintar `alert-detail-view-map` con
  `className="h-13 rounded-16 border-2 border-b-6 border-lip-gray bg-surface"` (la clase `rounded-xl` de R6.1
  pasa a `rounded-16`). Icono, etiqueta y acción no cambian.
  - **Test (F)**: `#180 R6.1 (enmendado por E1): la CTA lleva h-13, rounded-16, labio gris y el icono Map antes
    de la etiqueta` (la `className` exacta; el resto del `it` de R6.1 igual).
- **R7.1 (enmendado por E1)** WHILE la alerta está `open`, THE SYSTEM SHALL pintar `alert-detail-ack` con
  `className="w-full h-14 rounded-16 bg-accent border-b-4 border-black/25"` (la clase `rounded-xl` de R7.1 pasa
  a `rounded-16`); etiqueta, error de ack y orden no cambian.
  - **Test (F)**: la clase exacta del botón en el `it` de R7.1, con el sufijo `(enmendado por E1)`.
- **R7.3 (enmendado por E1)** THE SYSTEM SHALL sumar la pantalla a los inventarios de `border-b-4` y de
  `border-black/25` (K9, +1 cada uno) y **no** a los de `rounded-xl bg-accent` (K7, K8: sin delta) ni a la
  receta `rounded-xl … border-lip-gray` de `#166 R3` (R7.5). M14 queda sin delta; M15 y M16 conservan su +1.
  - **Test (X)**: `#62 R1` y `#166 R2` en verde con **las cifras de H0** (sin `+ 1` por `// #180`); los conteos de
    `border-b-4` y `border-black/25` de `#166 R2` suben en 1.
- **R7.4 (nuevo)** THE SYSTEM SHALL nombrar la pantalla del detalle como único consumidor de `rounded-16`
  fuera de Recordatorios (que conserva sus 3 usos): el radio 16 deja de ser exclusivo de #178.
  - **Test (X)**: `design-drift.test.ts` › `reserva los radios 14, 16 y 22 a Recordatorios …`:
    `outsideReminders(/\brounded-(?:16|22)\b/)` pasa de `[]` a
    `[join('screens', 'alert-detail', 'index.tsx')]` con el comentario `// #180 E1 R7.4 comparte rounded-16`;
    un `it` hermano `#180 R7.4: el detalle usa rounded-16 dos veces y ningún rounded-22 ni rounded-14` (cuenta con
    `match(/\brounded-16\b/g)` = 2, `rounded-22` = 0, `rounded-14` = 0). El conteo de Recordatorios (3, 1 y 1)
    no cambia.
- **R7.5 (nuevo)** THE SYSTEM SHALL conservar la receta con labio del ack y del secundario aunque ya no casen con
  las regexes de `rounded-xl`: los dos botones se candan por su tag de apertura.
  - **Test (X)**: `consistency-classnames.test.ts` › `#166 R3`: la fila `alert-detail-view-map` sale de `rows` (su
    receta usa `rounded-xl`, que ya no es la suya) y **dos `it` nuevos, uno por botón** (el orden rojo/verde de `tasks.md` los separa: la CTA se pinta en R6 y el
    ack en R7), que asertan sobre `openingTagWithTestId(readSource(join('screens','alert-detail','index.tsx')), …)`:
    `#180 R7.5: «Ver en el mapa» del detalle lleva rounded-16 con su labio gris`, con el tag de
    `alert-detail-view-map` conteniendo `variant="secondary"` y `rounded-16 border-2 border-b-6 border-lip-gray bg-surface`
    y no `rounded-xl`, `border-accent`, `bg-transparent` ni `border-black`; y
    `#180 R7.5: el ack del detalle lleva rounded-16 con su labio`, con el tag de `alert-detail-ack` conteniendo
    `rounded-16 bg-accent border-b-4 border-black/25` y no `rounded-xl`. El `it` de inventario
    `inventaría los cinco secundarios neutros` conserva `'alert-detail-view-map'` en su lista (lo casa
    `border-lip-gray`): sin cambio.
- **R10.2** no cambia: el reintento sigue `h-13` sin radio propio.
- **R12 (enmendado por E1)** THE SYSTEM SHALL aplicar a R12 estos cambios y ninguno más:
  - **R12.1, filas**: el `<QUÉ CAMBIA>` de tres filas pasa a:
    - `docs/ui-guidelines.md`: `§13: el ack del detalle de alerta es primario con labio, h-14 rounded-16 (sale de «Sin labio»); §12: línea nominal de rounded-24 para el mapa y de rounded-16 para los botones del detalle (#180)`;
    - `specs/mobile-alerts-grouped-and-detail-map/requirements.md`: `#170 R6: severidad en el héroe (color por tipo, sin borde); #170 R8: mapa h-52.5 rounded-24; #170 R10: la distancia es una píldora de cristal con desenfoque dentro del mapa; #170 R15: la CTA lleva el icono Map, h-13 y rounded-16`;
    - `specs/mobile-chunky-cta/requirements.md`: `#166 R2: el ack del detalle de alerta es primario sólido con labio (h-14 rounded-16, border-b-4, border-black/25) y queda fuera del inventario de rounded-xl bg-accent; #166 R3: «Ver en el mapa» del detalle pasa a rounded-16`.
  - **R12.1, anclas**: `mobile-chunky-cta` suma la ancla `### R3. El secundario neutro lleva el labio gris`
    (`grep -cF -e '…' specs/mobile-chunky-cta/requirements.md` da `1` al redactar E1; el implementer lo repite en
    H0). Su línea `> Enmendado por #180 (ver «Enmienda #180» al final).` va como párrafo propio justo después del
    encabezado, **detrás** de la de `> Enmendado por #174 …` que ya existe en esa spec. Las anclas de R12.1 pasan de
    catorce a **quince** (`mobile-chunky-cta` queda con dos).
  - **R12.2, literales** (sustituyen a los de `design.md` §5, que se actualiza):
    - §13, viñeta nueva: `Primario del detalle de alerta (#180): ack con labio, h-14 rounded-16, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 rounded-16 con el icono Map.`
    - §12, línea nominal: ``Fuera de la escala, por fidelidad al canvas (#180): `rounded-24` (24 px), mapa del detalle de alerta, que es un View y no un Card; `rounded-16` (16 px), ack y «Ver en el mapa» del detalle de alerta.``
    - Medidas: M19 (`rounded-24` en la carta) conserva su `+ 1` (una sola línea nueva); M21 nueva (E1.3).
  - **Tests (C)**: el `it` «de la carta» de `#180 R12: enmiendas` aserta además la viñeta nueva con `rounded-16`
    (una vez) y la línea nominal con las dos clases (una vez); el `it` de las anclas de `mobile-chunky-cta`
    cubre las dos (`### R2.` y `### R3.`); el `it` de fila de `mobile-chunky-cta` usa el `<QUÉ CAMBIA>` nuevo.

### E1.3 Medidas nuevas y medidas que cambian de delta

Se miden en H0 (desde `mobile-pet-tracker/`); cierre = base H0 + delta.

| # | Orden | Base al redactar | Delta | R |
|---|---|---|---|---|
| M14 | (ya existe) `grep -rE 'rounded-xl bg-accent' src --include=*.tsx \| grep -v test \| wc -l` | 13 | **0** (antes +1) | R7.3 |
| M21 | `grep -rE '\brounded-16\b' src --include=*.tsx \| grep -v test \| wc -l` (líneas) | 3 | +2 (ack y CTA) | R6.1, R7.1 |
| M22 | `grep -rlF "from 'expo-blur'" src --include=*.tsx \| grep -v test \| wc -l` | 1 | +1 | R5.6 |
| M23 | `grep -cF 'MOTION_ALERT_PING_MS' src/theme/motion.ts` | 0 | +1 | R4.5 |
| M24 | `grep -cF 'glass-surface-strong' src/theme/global.css` | 0 | +4 (dos por tema) | R5.5 |
| M25 | `grep -cF 'rounded-16' ../docs/ui-guidelines.md` (líneas) | 1 | +2 (§12 y §13) | R12 |

M15 y M16 (`border-b-4`, `border-black/25`) conservan su `+ 1`; M10 (`text-17`) también.

Precondiciones nuevas (P11-P14; si una falla, PARA como las de §2):

| # | Orden | Debe dar |
|---|---|---|
| P11 | `grep -cF '"expo-blur"' package.json` | `1` |
| P12 | `test -d node_modules/expo-blur; echo $?` | `0` |
| P13 | `grep -cF 'MOTION_CELEBRATION_EASE_OUT' src/theme/motion.ts` | `1` |
| P14 | `grep -cF -e '--radius-16: 16px;' src/theme/global.css` | `1` |

### E1.4 Candados (K) que cambian respecto de §4

| # | Fichero › candado | Cambio |
|---|---|---|
| K7 | CC › `#62 R1` | **Sin cambio** (antes `+ 1`): el ack ya no casa `rounded-xl bg-accent` (R7.3) |
| K8 | CC › `#166 R2` `expected` | **Sin cambio** (antes un fichero más, `dieciséis`→`diecisiete`): sigue en 16 ficheros |
| K9 | CC › `border-b-4` y `border-black/25` | Sin cambio respecto de §4: `+ 1` cada uno (el ack conserva las dos clases) |
| K19 | DD › reserva de `rounded-14/16/22` | `outsideReminders(/\brounded-(?:16\|22)\b/)` = `[detalle]` y el `it` hermano de R7.4 |
| K20 | CC › `#166 R3` | sale la fila `alert-detail-view-map` de `rows`; `it` nuevo de R7.5 |
| K21 | M › `motion.test.ts` | `it` del valor (R4.5) y la lista «no exporta nada más» suma `MOTION_ALERT_PING_MS` |
| K22 | G › `global-css.test.ts` | describe nuevo de R5.5 |
| K23 | C › `alert-detail-canvas-fidelity.test.ts` | `it` de R4.5 (ping-ring sin `MOTION_PING_TIMING`) y de R5.6 (importadores de `expo-blur`) |
| K24 | DT › `index.test.tsx` | doble local de `expo-blur` y los `it` de R5.2; clases exactas de R6.1 y R7.1 |

Candados que no cambian pero se **re-ejecutan** además de los de §4: `floating-tab-bar.test.tsx` (comparte
`expo-blur` y `glass-surface`), `design-drift` entero, `welcome` (R12 de #167: sigue en 2400 ms) y las cuatro
suites de ruta que montan `/alerts/<id>`: al importar ahora `expo-blur`, cualquiera que dé rojo por el módulo
nativo recibe el mismo doble local que `floating-tab-bar.test.tsx` (commit propio, como el del doble de
reanimated de H0).

### E1.5 Delimitaciones que cambian (sustituyen a las de §5 que nombran D2, D3 y D4)

- Ya **no** se delimitan: el desenfoque 12 y el blanco 0,86 de la píldora de distancia, la duración 1,8 s del
  ping, el radio 16 de los botones del detalle.
- Siguen delimitados: el retardo 80 ms de la entrada (D11), el interlineado del `body`, el chevron de back, la
  receta global 56/16/17-800 y la sombra en `--lip` (es #177: el ack del detalle ya cumple 56 y 16; si #177
  mergea antes, solo reconcilia `border-b-4 border-black/25` por la sombra de `--lip`), el alfa del anillo de ping
  (`/20` frente a 0,18 del canvas: ver pregunta 1 de `progress/spec_E1_180.md`).

### E1.6 Prueba de humo (enmienda de R14.1)

Se sustituyen y añaden estos puntos al humo de §6 (dev build de Android, nunca Expo Go; claro y oscuro):

- **R14.1.2**: el anillo late con ciclo de ~1,8 s.
- **R14.1.4**: la píldora de distancia muestra el desenfoque **sobre el mapa nativo** (el cristal deja de verse
  plano) y es legible en claro y oscuro. **Riesgo conocido**: el desenfoque de Android se pinta sobre una
  superficie nativa (`expo-maps`); si no desenfoca o parpadea, el relleno 0,86 mantiene la legibilidad (degrada
  a píldora opaca) y el humano decide si basta o abre feature.
- **R14.1.9 (nuevo)**: el ack y «Ver en el mapa» tienen esquina de 16 px y el ack queda a 56 de alto.

La casilla de §6 no cambia (`- [ ] Smoke #180 en dev build de Android (fecha: ____)`).

### Aprobación de la enmienda

- [x] Enmienda #180 aprobada por humano (fecha: 2026-10-18) ← gate de la enmienda E1 (firma en Notion, 2026-10-18T05:05:15Z)

## Enmienda E2 — bloqueo de Codex en H0: contradicciones de contrato

> Escrita el 2026-10-18 tras el reporte «BLOQUEADO» de Codex (`progress/impl_mobile-alert-detail-canvas-fidelity.md`, commit `508f0c04`). Codex paró en H0 con razón: las contradicciones eran reales y no implementó nada. Esta enmienda **no cambia ningún valor de diseño** (ni R1-R14 ni E1): reparte en qué paso TDD se pinta cada aserción, corrige R3.7, R7.2 y R13.2, y fija cómo reanudar. **Donde E2 choque con E1 o con el texto de un R, manda E2.** Las líneas de `index.test.tsx` que se citan son orientativas (H0): se busca por contenido. Su casilla va **sin marcar**; el humano la firma en Notion antes de que Codex reanude.

### E2.1 — R3.7 y el cierre de M20 pasan a R10

R3.7 exige que `index.tsx` no contenga ninguna clase de la pantalla anterior. Tras R3 siguen en el mapa y la distancia (R5), la CTA (R6), el ack (R7), el esqueleto y el reintento (R10). Con ese `it` en R3, el verde de R3 quedaría rojo. Cambios:

- **R3 rojo**: sin el `it` de R3.7.
- **R3 verde**: sin la aserción `M20 = 1`.
- **R10 rojo**: añade el `it` `#180 R3.7: el fichero no nombra las clases de la pantalla anterior` en `src/__tests__/alert-detail-canvas-fidelity.test.ts`. Debe quedar rojo ahí, porque el esqueleto y el reintento aún llevan `rounded-card` y `min-h-11`.
- **R10 verde**: al quitarlas, `M20 = 1` y el `it` de R3.7 pasan a verde. **M20 cierra en R10.** En §2, la columna R de la fila M20 pasa a `R10 (R3.7, enmendado por E2.1)`.
- **R13.2 (enmendado por E2.1)**: el fichero C existe desde R4 rojo. R13 lo corre entero y solo. Sus candados son R3.7 (en R10), R4.4, R4.5, R5.6, R12 y el grep-limpio de `ping-ring.tsx`. Comando: `bunx jest src/__tests__/alert-detail-canvas-fidelity.test.ts --testTimeout=30000`. Sustituye al `pnpm exec jest --config …`: el móvil va con bun.

### E2.2 — R7.2: qué aserciones se conservan

R7.2 protege los `it` de #100 R5, #134 R2, #170 R6 y R8-R14. Se lee así: se conservan íntegras las **aserciones de comportamiento** del ack (guard `ackingRef`, `settleAlertAck`, `acking`, mensajes de error y salida con `router.dismissTo('/alerts')`). Las **aserciones visuales** que contradicen R2, R3, R5, R6, R7 o R10 se reescriben en el paso que las cambia, con el sufijo `(enmendado por E2)`. Lista cerrada. #134 R2 no cambia. El resto de cada `it` sigue en verde.

| Aserción actual (buscar por contenido) | Motivo | Paso |
|---|---|---|
| #100 R5 «marca leída una vez y retira el botón»: `toContain('min-h-11')` sobre el ack | R7.1 (E1): `w-full h-14 rounded-16 bg-accent border-b-4 border-black/25` | R7 rojo |
| #170 R6, describe completo: bordes `border-danger`, `border-warning-strong`, `border-muted` y `rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3` | R3.1: el héroe no lleva borde ni `rounded-card` | R3 rojo |
| #170 R8: `toBe('h-52 overflow-hidden rounded-card')` | R5.1: `h-52.5 overflow-hidden rounded-24` | R5 rojo |
| #170 R10: `toBe('text-sm font-semibold text-foreground')` en la distancia | R5.2 (E1): clase de la distancia dentro del `BlurView` | R5 rojo |
| #170 R10 «pinta la distancia bajo el mapa» (`distanceIndex` = `mapIndex + 1`) | R5.2 (E1): la distancia va dentro del mapa | R5 rojo (E2.3) |
| #170 R15: `toContain('min-h-11')` sobre la CTA | R6.1 (E1): `h-13 rounded-16 …` | R6 rojo (E2.4) |
| #170 R15 «ordena tarjeta, mapa, distancia, CTA y ack» | R2.3 y R5.2: otro orden de hermanos | R2 rojo y R5 rojo (E2.3) |
| #100 R4, esqueleto: `toContain('h-44 w-full rounded-card')` | R10.1: `h-58 w-full rounded-hero` | R10 rojo |
| #100 R4, reintento: `toContain('min-h-11')` | R10.2: `h-13`, sin `min-h-11` | R10 rojo |
| `index.test.tsx` ~170-186 (hijos y cabecera de la tarjeta) | R3.2 y R3.3 | R3 rojo (E2.7) |
| ~199 (píldora de estado) | R3.4 | R3 rojo (E2.5) |
| ~221-222 (métricas y clase de la tarjeta) | R2.1 y R3.1 | R2 rojo y R3 rojo (E2.6) |
| K16, `#100 R3` (`it.each` de color) | R3.3 y R11.1 | R3 rojo (E2.8) |

### E2.3 — distancia y orden de hermanos

- «pinta la distancia bajo el mapa» (~600-609): en **R5 rojo** se sustituye por el `it` de R5.2 de E1, que aserta `within(map)` y `within(blur)`. Desaparece la comparación de índices de hermanos.
- «ordena tarjeta, mapa, distancia, CTA y ack» (~717-728): se parte en dos. (a) El `it.each` de R2.3 (cuatro combinaciones: con y sin zona, con y sin error) va en **R2 rojo**. (b) Un `it` nuevo, `#180 R5.2 (enmendado por E1): la distancia cuelga del mapa y no es hermana de la CTA`, va en **R5 rojo**.
- Verificado sin cambio: los `it` de ~481-482 no tienen `geofenceId`, así que no hay píldora y el `map.children` de ~489 sigue en 1.

### E2.4 — CTA con clase exacta

El `it` de ~696 (`min-h-11` sobre la CTA) pasa, en **R6 rojo**, a la clase exacta de R6.1 (E1): `h-13 rounded-16 border-2 border-b-6 border-lip-gray bg-surface`, sin `min-h-11`.

### E2.5 — píldora de estado

El `toBe` de la píldora reconocida (~199, con `bg-default`) pasa, en **R3 rojo**, a la clase de R3.4 para ese estado: `rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted`. Sin `self-start`.

### E2.6 — métricas del marco y clase de la tarjeta

- ~221, en **R2 rojo**: `toEqual` del `contentContainerStyle` con `insets.bottom = 0` → `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 14, flexGrow: 1 }` (R2.1).
- ~222, en **R3 rojo**: la tarjeta hero de R3.1 (`Card variant="hero"`, `className` `` `${meta.disc} items-center gap-2 px-4.5 py-5.5` ``). No contiene `rounded-card`, `bg-surface`, `min-h-44` ni borde.

### E2.7 — hijos y cabecera del héroe

En **R3 rojo** (`index.test.tsx`, ~170-186 y ~211):

- La tarjeta tiene `toHaveLength(5)`: disco, píldora, tipo, mascota y fecha, sin cabecera (R3.2). Se retira la aserción de la cabecera `flex-row items-center gap-3`.
- Padre del icono (disco): `size-18 items-center justify-center rounded-full ${meta.solid}` (R3.3).
- Tipo: `text-22 font-black text-foreground text-center` (R3.2).
- Mascota: `text-15 font-bold ${meta.heroInk}` (R3.2).
- Fecha (~211): `text-13 font-normal ${meta.heroInk}` (R3.2).

### E2.8 — color del icono del héroe

En K16 (`#100 R3`, `it.each`), en **R3 rojo**: se retira la columna `surface` y la del color del icono pasa a `meta.onSolid` (R3.3, R11.1):

- `geofence_exit`: `--color-danger` → `--color-danger-foreground`.
- `battery_low` y `unknown`: `--color-background`.

### E2.9 — conteo de anclas

En `tasks.md`, H0 paso 4: «las catorce anclas de R12.1» → «las quince anclas de R12.1» (E1.2 suma `### R3.` en `mobile-chunky-cta`).

### E2.10 — reanudación

Sustituye al arranque de H0 del handoff donde difieran:

- H0 es el HEAD al reanudar, no el commit que añade el handoff. Antes de implementar, el log del HEAD debe incluir la firma de esta enmienda: `docs(spec): firma la enmienda E2 de #180 desde Notion`.
- Repetir M1-M25 y P1-P14 sobre ese H0. Como no hay cambio de código, deben dar la base del reporte «BLOQUEADO». Si una difiere, PARA y reporta.
- El reporte de reanudación es una sección nueva en `progress/impl_mobile-alert-detail-canvas-fidelity.md`; la sección «BLOQUEADO» se conserva.
- Solo `bunx`. No `pnpm`, `npx`, `npm` ni `bun add`. No `./init.sh`.
- El humano relanza Codex solo después de firmar esta enmienda.

### Aprobación de la enmienda

- [x] Enmienda #180 E2 aprobada por humano (fecha: 2026-10-18) ← gate de la enmienda E2 (firma en Notion, 2026-10-18T06:22:27Z)

## Enmienda E3 — `alerts.mapLabel` se registra en R5, no en R8

Motivo: Codex paró en R8 (sección «Resultado de la reanudación», B3, `progress/impl_mobile-alert-detail-canvas-fidelity.md`, commit `3c099eaa`). El leader lo ha verificado:

- `checkUses` (`src/__tests__/ui-language.test.ts`, líneas 42–68) exige que el fichero registrado tenga tantas ocurrencias `t('<clave>')` o `labelKey: '<clave>'` como filas tenga la clave en la tabla de uso.
- `src/screens/alert-detail/index.tsx` no contiene `alerts.mapLabel` hasta R5.4.
- Con la fila de R8.2 en R8, el test «registra cada ocurrencia del detalle» (línea 255) y el candado global `checkUses(ALL_USES)` (línea 492) quedan rojos tras el verde de R8. R8 no puede cerrar en verde.
- `src/providers/__tests__/language-provider.test.tsx` no usa `checkUses` ni `ALL_USES`: K4 y K5 sí caben en R8.

Se mueve la fila a R5, donde se usa. No se implementa R5.4 dentro de R8: en tasks.md, R5.4 va después de R11, R3 y R4.

- **E3.1** La fila `alerts.mapLabel` de `R13_ALERT_DETAIL` (K3) y el `+ 1` de la longitud en UL (K2, R8.2) pasan de R8 a R5. Donde E3 choque con R8.2 o con las filas K2 y K3 de §4, manda E3.
- **E3.2** R8 queda con el catálogo y LP. Rojo: LP (K4 y K5). Verde: `catalog.ts` (en y es) y `specs/mobile-ui-language/design.md`.
- **E3.3** R5 rojo añade UL (K2 `+ 1`, comentario `#170 R16, #180 R5`) y K3. R5 verde añade `accessibilityLabel={t('alerts.mapLabel', { zone })}` de R5.4: una sola ocurrencia, que cumple `checkUses`.
- **E3.4** M4 (+1) se cuenta al cerrar R5, no al cerrar R8. Los valores finales no cambian.
- **E3.5** La prueba de R8.2 vive en R5 (sección E3 de `traceability.md`).
- **E3.6** Reanudación: R1 está hecho (`b07bc024` rojo, `e37300ec` verde). Codex retoma en R8. H0 y M1–M25 se miden sobre el HEAD al reanudar; la base es la columna «Al detenerse» del reporte.

### Aprobación de la enmienda E3

- [x] Enmienda #180 E3 aprobada por humano (fecha: 2026-10-18) ← gate de la enmienda E3 (firma en Notion, 2026-10-18T06:55:10Z)

## Enmienda E4 — corrección tras el veredicto RECHAZADO del reviewer

> Escrita el 2026-10-18 tras el veredicto RECHAZADO del `reviewer` (`progress/review_mobile-alert-detail-canvas-fidelity.md`). Cierra los bloqueantes **B1** y **B2** y las observaciones **O2**, **O4** y **O5**, que pedían decisión humana. Las observaciones O1, O3 y O6–O11 no bloquean y no cambian el alcance de la spec. **Donde E4 choque con E3, E2, E1 o con el texto de un R, manda E4.** Su casilla va **sin marcar**; el humano la firma en Notion antes de que Codex corrija nada.

### E4.1 — B1: candado de R13.1 que nació verde

El candado `not.toContain('alerts.detailTitle')` (`src/__tests__/ui-language.test.ts:255`) entró en `74f0fa9d` sin commit rojo previo: `src/app/_layout.tsx` ya no contenía la clave, que quitó `e37300ec` (R1). Incumple C4 puntos 2 (historia test-primero) y 5 (candado sobre código ya correcto, con mutación versionada en el rojo).

- **Excepción**: para ese candado, y solo para él, se aceptan C4 puntos 2 y 5 tal como están (CHECKPOINTS.md, C4, excepciones). La historia no se reescribe.
- **Verificación**: R13.1 se verifica por la vía (b) de C4 punto 3 (mutación). La sonda S15 (restaurar `title: t('alerts.detailTitle')` en `src/app/_layout.tsx`) la reprodujo Codex en `progress/impl_mobile-alert-detail-canvas-fidelity.md`: la primera pasada dejó el candado ciego (L389); repetida, dio rojo en `src/app/_layout.tsx:103` (L395) y se revirtió.
- `traceability.md`, fila R13, se corrige tras la firma para citar esta excepción en lugar de un rojo que no existe.

### E4.2 — B2: R2.3 y el mapa sin zona (opción a)

El código pinta el mapa desde la posición (`src/screens/alert-detail/index.tsx:169`, sin mirar la zona) y #170 R11 lo fija (`src/screens/alert-detail/index.test.tsx:670–680`, «sin geofenceId pinta el mapa sin zona»). R2.3 decía lo contrario, y su `it` usaba payload `{}` para «sin zona», que no tiene posición. Se elige la **opción a**: el mapa aparece si hay posición, con zona o sin ella. La zona solo añade círculo, zoom y píldora de distancia (R5.2, sin cambio). Sin posición no hay mapa.

- **R2.3 (texto)**: sustituye «solo con zona» y «Sin zona no hay mapa» por «mapa (`alert-detail-map`, si hay posición; la píldora de distancia dentro, R5, solo si hay zona)» y «Sin posición no hay mapa y el resto no cambia».
- **R2.3 (test)**: `it.each` de **seis** casos, {con zona, sin zona, sin posición} × {con error de ack, sin error}. «Sin zona» es una posición sin `geofenceId`; «sin posición» es el payload `{}` de antes. Esperado: `alert-detail-map` presente en los casos con posición y ausente en «sin posición».
- **S31 (C4 punto 5)**: el `it.each` nace verde sobre código ya correcto. El commit rojo de R2 versiona la mutación S31 en `src/screens/alert-detail/index.tsx`: la guarda del mapa (L169) pasa a `position && alert.geofenceId !== null`. Con S31 caen los dos casos «sin zona». El commit verde revierte S31; el código final no cambia.
- `#170 R11` no se reescribe: la opción a la hace verdadera, no contradictoria. R7.2 y la lista cerrada de E2.2 no cambian.

### E4.3 — O2: objetivos de M19 y M25

Codex midió M19 = 4 y M25 = 4 (`progress/impl_mobile-alert-detail-canvas-fidelity.md`, L488 y L494) con el bloque canónico de R12.1 (L353 del mismo informe). Esos valores pasan a ser el objetivo:

- **M19** `grep -cF 'rounded-24' ../docs/ui-guidelines.md`: base 2 (L186, L188), delta **+2**, **objetivo 4**. Manda sobre la fila M19 (L106) y sobre «(M19: 2 → 3)» (L398).
- **M25** `grep -cF 'rounded-16' ../docs/ui-guidelines.md`: base 1 (L187), delta **+3**, **objetivo 4**. Manda sobre la fila M25 (L649).

### E4.4 — O4: K17 también cubre el mock de la suite de navegación

K17 (`+ Map`) nombra solo el mock de `index.test.tsx`. El mismo doble se amplía en `src/app/__tests__/alert-detail.navigation.test.tsx:81` (`Map: icon()`, commit `00a609c6`). Es una ampliación de doble sin cambio de aserciones, que parece necesaria para que la suite monte el detalle (no comprobado sin jest). Se anota como parte de K17. La suite sigue en la lista «no cambia, se re-ejecuta» de §4 y su re-ejecución debe quedar en verde.

### E4.5 — O5: fecha de la casilla de E3

La casilla de E3 decía «fecha: 2026-10-17». La firma es del 2026-10-18 (Notion, 2026-10-18T06:55:10Z). Se corrige el texto de esa casilla.

### E4.6 — Reanudación

Codex no reimplementa nada. En R2 rojo cambia el `it.each` (seis casos) y añade S31; en R2 verde revierte S31. Su informe deja la evidencia de S15 de E4.1. `tasks.md` (R2 pasa de «cuatro combinaciones» a seis, y la tabla de sondas recoge S31), `traceability.md` (filas R2 y R13) y `progress/current.md` se actualizan tras la firma, no en esta enmienda.

### Aprobación de la enmienda E4

- [x] Enmienda #180 E4 aprobada por humano (fecha: 2026-10-18) ← gate de la enmienda E4 (firma en Notion, 2026-10-18T18:48:14Z)
