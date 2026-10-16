---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: draft        # draft | approved
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

- [ ] Smoke #180 en dev build de Android (fecha: ____)

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
