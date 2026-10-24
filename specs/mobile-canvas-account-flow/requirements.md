---
feature: "mobile-canvas-account-flow"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec, canvas-parity]
---

# Requisitos — [[mobile-canvas-account-flow]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

#205 lleva al canvas (copia congelada `specs/mobile-canvas-account-flow/canvas/`,
versión 1792777983-cd94) el flujo de cuenta entero: bienvenida (Main), login,
registro, recuperar en sus dos estados, nueva contraseña (formulario, éxito y la
rama sin token) y nueva mascota en sus dos pasos. Es la primera feature que
monta los cimientos de #197 (`RiseIn`, `useShadows`, `ScreenHeader`), añade tres
tokens (`--text-34`, `--radius-32`, `--radius-40`) y enmienda la carta
(`## Enmienda #205` en `docs/ui-guidelines.md`).

Precedencia: el canvas manda en lo visual y en el motion; el copy sigue la Voz B
de Pingo; lo que el canvas no dibuja se conserva tal cual está hoy.

Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y `specs/`. Sin
dependencias nuevas (veto vigente a `expo-linear-gradient`), sin coste, sin AWS.
Deuda que toca: ninguna.

Dependencias: #197 (mergeada en `dev`, base de esta rama). Features paralelas
aún fuera de `dev` (#196, #198, #199, #200, #201, #202, #203, #204, #206): esta
feature no toca sus pantallas; los únicos puntos de contacto son la línea
`--text-34: 34px;` que también añade #199, `PopIn` (que #201 usa sin cambios y
aquí tampoco cambia) y la supresión del describe `#197 R20` (ver D12).

## Decisiones con defecto (cerradas)

Cada decisión está cerrada con su defecto; el humano puede cambiarla al firmar.

| # | Decisión | Defecto | Riesgo de choque |
|---|---|---|---|
| D1 | Saludo de bienvenida. El canvas pinta el marcador `¡Guau! Soy [NOMBRE]`, que no es copy | `welcome.pingoGreeting` pasa a es `Hola, soy Pingo.` / en `Hi, I'm Pingo.` (Voz B: sin exclamación, punto final, cabe en el bocadillo absoluto del canvas). Se acorta el copy actual | Ninguno: misma clave, misma fila de `ui-copy-table.ts` |
| D2 | Entradas | `RiseIn` (de #197, `MOTION_RISE_TIMING`) con los retardos de cada artboard. Se retiran el fundido y muelle de contenido de welcome (`entranceStyle`) y `HomeEntrance` en login, registro y nueva contraseña. El muelle de escala de Pingo en welcome (#153 R9) se conserva: el canvas no lo dibuja | Ninguno |
| D3 | Flotación de Pingo | `PingoFloat` en Main (nuevo) y Registro (se queda). Se retira de recuperar y nueva contraseña (el canvas no las hace flotar). Se retira la flotación de 4 puntos de welcome (#153 R10): la sustituye `PingoFloat` | Enmienda la carta #172 (D11) |
| D4 | Bocadillos de welcome y login | Dejan de ser `Card` y pasan a `View` con esquinas asimétricas (pico de 4) y `CONTINUOUS_CORNER`. Sin componente nuevo: dos usos con el pico en lados distintos | Ninguno |
| D5 | Retardo de los pops | `PopIn` no cambia (retardo fijo 250 ms). El canvas pide 600 (Main), 300 (Recuperar) y 500 (NuevaContrasena): desviación consciente | #201 usa `PopIn` sin cambios; añadirle una prop chocaría |
| D6 | Tokens | `--text-34: 34px;`, `--radius-32: 32px;` y `--radius-40: 40px;` en `src/theme/global.css`. 32 y 40 quedan fuera de la escala de radios por fidelidad al canvas (enmienda de carta) | #199 añade la misma línea `--text-34: 34px;`: quien mergee segundo deja una sola |
| D7 | `SegmentedControl` (componente compartido) | La opción seleccionada pierde `shadow-sm` y toma `useShadows().segment` (la sombra exacta del canvas). Único consumidor medido: add-pet | Una feature paralela que lo monte hereda la sombra nueva |
| D8 | Cabecera de nueva mascota | `pets/add` pasa a `{ headerShown: false }`; cabecera `ScreenHeader testID="add-pet" size={24}` con el paso como `accessory`; barra de progreso fija bajo la cabecera; CTA en pie fijo | Ninguno: `_layout.tsx` solo cambia la línea de `pets/add` |
| D9 | Chips del paso 2 | Seleccionado `bg-tab-pill` (el `--pill` del canvas), resto `bg-default`; alto 44 (`h-11`), padding 16 (`px-4`). `bg-accent-soft` pierde sus 2 usos en add-pet | Agregados de `bg-accent-soft` (ver inventario) |
| D10 | Altos de campo | Se conservan los de hoy: 52 (`h-13`) en cuenta, incluido registro (canvas 50), y los de #191 R6 en add-pet (canvas 48). Desviación consciente | Ninguno |
| D11 | Carta | `## Enmienda #205` en `docs/ui-guidelines.md` con su propia casilla de aprobación | Ninguno |
| D12 | `describe('#197 R20: cimientos sin cablear')` | Se borra entero, sin sufijo, en el primer commit rojo que monta un cimiento (R2) | Las paralelas que monten cimientos lo borran también: quien mergee segundo resuelve quedándose sin el describe |
| D13 | Márgenes laterales | `paddingHorizontal: 20` en login, registro, recuperar y nueva contraseña; `16` en welcome (canvas). Antes, `padding: 24` | Ninguno |
| D14 | Sombra del suelo de Main | `bg-border` (token existente; el canvas pinta `rgba(13,17,23,0.08)`, sin token propio) | Ninguno |
| D15 | Test de fidelidad | Fichero nuevo `src/__tests__/account-flow-canvas-fidelity.test.ts` que lee los artboards de la copia congelada | Ninguno |

## Base medida

Medida en `feature/205-mobile-canvas-account-flow` sobre `origin/dev` 81cb6d6b,
desde `mobile-pet-tracker/`. Anclas por contenido, nunca por línea. Antes del
primer commit, el implementador repite cada comando y compara: si una cifra no
coincide, para y lo apunta en su informe.

| Comando | Base |
|---|---|
| `grep -cF -- '--text-34' src/theme/global.css` | 0 (#199: 0 → 1) |
| `grep -cF -- '--radius-32' src/theme/global.css` | 0 |
| `grep -cF -- '--radius-40' src/theme/global.css` | 0 |
| `grep -cF -- '--radius-4:' src/theme/global.css` | 1 |
| `grep -cF -- '--text-24:' src/theme/global.css` | 1 |
| `grep -cF -- '--tracking-display: -0.5px;' src/theme/global.css` | 1 |
| `grep -cF '<Card' src/screens/welcome/index.tsx` | 2 |
| `grep -cF 'entranceStyle' src/screens/welcome/index.tsx` | 2 |
| `grep -cF "justifyContent: 'center'" src/screens/welcome/index.tsx` | 1 |
| `grep -cF 'width: 200' src/screens/welcome/index.tsx` | 3 |
| `grep -cF 'PingoFloat' src/screens/welcome/index.tsx` | 0 |
| `grep -cF 'HomeEntrance' src/screens/login/index.tsx` | 5 |
| `grep -cF '<Card' src/screens/login/index.tsx` | 1 |
| `grep -cF 'padding: 24' src/screens/login/index.tsx` | 1 |
| `grep -cF 'login-title' src/screens/login/index.tsx` | 0 |
| `grep -cF 'HomeEntrance' src/screens/register/index.tsx` | 3 |
| `grep -cF 'PingoFloat' src/screens/register/index.tsx` | 3 |
| `grep -cF -- '-ml-2.5' src/screens/register/index.tsx` | 0 |
| `grep -cF 'PingoFloat' src/screens/forgot/index.tsx` | 3 |
| `grep -cF 'PopIn' src/screens/forgot/index.tsx` | 3 |
| `grep -cF 'CONTINUOUS_CORNER' src/screens/forgot/index.tsx` | 2 |
| `grep -cF 'forgot-scene' src/screens/forgot/index.tsx` | 0 |
| `grep -cF 'PingoFloat' src/screens/reset-password/index.tsx` | 5 |
| `grep -cF 'HomeEntrance' src/screens/reset-password/index.tsx` | 7 |
| `grep -cF '<Card' src/screens/reset-password/index.tsx` | 1 |
| `grep -cF 'padding: 24' src/screens/reset-password/index.tsx` | 3 |
| `grep -cF 'className="flex-1 text-3xl font-black text-foreground"' src/screens/reset-password/index.tsx` | 2 |
| `grep -cF 'rounded-16' src/screens/reset-password/index.tsx` | 1 |
| `grep -cF 'bg-accent-soft' src/screens/add-pet/index.tsx` | 2 |
| `grep -cF 'className="text-lg font-bold text-foreground"' src/screens/add-pet/index.tsx` | 2 |
| `grep -cF 'keyboardVerticalOffset={headerHeight}' src/screens/add-pet/index.tsx` | 1 |
| `grep -cF 'ScreenHeader' src/screens/add-pet/index.tsx` | 0 |
| `grep -cF 'RiseIn' src/screens/add-pet/index.tsx` | 0 |
| `grep -cF 'shadow-sm' src/components/segmented-control.tsx` | 1 |
| `grep -cF 'style={CONTINUOUS_CORNER}' src/components/segmented-control.tsx` | 2 |
| `grep -rlF 'SegmentedControl' src --include=*.tsx \| grep -v test` | `segmented-control.tsx`, `add-pet/index.tsx` |
| `grep -cF '<Stack.Screen name="pets/add" options={{ ...headerOptions, title: '"''"' }} />' src/app/_layout.tsx` | 1 |
| `grep -cF "['pets/add', '']" src/app/__tests__/layout.test.tsx` | 1 |
| `grep -cF '#197 R20: cimientos sin cablear' src/__tests__/canvas-foundations.test.ts` | 1 |
| `grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts` | 2 |
| `grep -cF '## Enmienda #205' ../docs/ui-guidelines.md` | 0 |
| `test ! -e src/__tests__/account-flow-canvas-fidelity.test.ts` | sale 0 |

`RiseIn` (`src/components/rise-in.tsx`), `PopIn` (`src/components/pop-in.tsx`),
`PingoFloat` (`src/components/pingo-float.tsx`), `useShadows`
(`src/theme/shadows.ts`), `ScreenHeader` (`src/components/screen-header.tsx`) y
`CONTINUOUS_CORNER` (`src/theme/native-styles.ts`) existen y no cambian.
`ScreenHeader` pinta el volver como `${testID}-back` y el título como
`${testID}-title` con `TITLE_CLASSES[24]` = `text-24 font-black tracking-title
text-foreground`.

## TestIDs

Nuevos (los crea el R indicado):

| testID | Nodo | R |
|---|---|---|
| `welcome-rise-scene`, `welcome-rise-chips`, `welcome-rise-heading`, `welcome-rise-actions` | `RiseIn` de cada bloque de Main | R2 |
| `welcome-spacer` | `View className="flex-1"` entre marca y CTAs | R2 |
| `welcome-ground` | elipse del suelo | R3 |
| `welcome-pingo-float` | `PingoFloat` alrededor de `welcome-pingo` | R3 |
| `welcome-bubble-pop` | `PopIn` alrededor de `welcome-bubble` | R4 |
| `login-top` | fila del volver | R8 |
| `login-title` | título `Iniciar sesión` | R8 |
| `login-actions` | `RiseIn` de envío + crear cuenta | R8 |
| `register-body` | `RiseIn` del formulario | R9 |
| `forgot-scene` | `RiseIn` de la escena 168x150 | R10 |
| `forgot-scene-backdrop` | fondo absoluto radio 40 | R10 |
| `forgot-actions` | columna de CTAs (ambos estados) | R10 |
| `add-pet-back` | volver de `ScreenHeader` (`${testID}-back`) | R16 |
| `add-pet-intro` | `RiseIn` de la fila foto + burbuja | R16 |
| `add-pet-rise-medical`, `add-pet-rise-age`, `add-pet-rise-sterilized`, `add-pet-rise-microchip` | `RiseIn` de cada bloque del paso 2 | R18 |
| `add-pet-footer` | pie fijo con la CTA | R19 |

Conservados con otro nodo: `welcome-content` (`View` sin animación), `welcome-scene`
y `welcome-bubble` (`View`, ya no `Card`), `login-header`, `login-body`,
`reset-header`, `reset-body` (`RiseIn`, ya no `HomeEntrance`), `register-header`
(`View`), `login-bubble` y `reset-success-card` (`View`, ya no `Card`),
`add-pet-title` (ahora lo pinta `ScreenHeader` como `${testID}-title`).

Retirados: `forgot-pingo-float`, `reset-pingo-float`.

Sin cambio: el resto (`screen-*`, campos, `*-submit`, `link-*`, `*-error`,
`*-spacer`, `welcome-ring-<i>`, `welcome-pingo*`, `welcome-chips`,
`welcome-brand`, `welcome-tagline`, `welcome-get-started`,
`welcome-have-account`, `welcome-legal`, `forgot-lock-tile`, `forgot-resend`,
`reset-success-pop`, `reset-success-check`, `reset-success`,
`reset-missing-token`, `add-pet-step-label`, `add-pet-step-bar`,
`add-pet-step-segment-*`, `add-pet-continue`, `add-pet-submit`,
`add-pet-celebration`).

## Requisitos funcionales

Convenciones para todos los R:

- `F` = `src/__tests__/account-flow-canvas-fidelity.test.ts` (nuevo, D15). Lee
  cada artboard con
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-account-flow/canvas/<Artboard>.dc.html'), 'utf8')`
  y el fuente de producción con `readFileSync(join(process.cwd(), 'src', …), 'utf8')`.
  Cada `it` de fidelidad hace dos grupos de aserciones: el artboard **contiene**
  el literal CSS citado (medido en la copia congelada; si falla, el canvas no es
  el congelado y se para) y el fuente **contiene** el literal de producción
  citado. Ningún literal de canvas sale de una constante de producción.
- Las clases se asertan con `props.className` exacto, como hacen ya los tests de
  cada pantalla; los tamaños de Pingo con `toHaveStyle`.
- Todo `it` nuevo empieza por `#205 R<n>` y vive en un `describe` nuevo que
  también empieza por `#205 R<n>`.
- Ningún literal de copy cambia salvo el de R5. CTAs, enlaces, etiquetas,
  errores y cuerpos conservan clave y texto.

### R1 — Tokens del canvas

THE SYSTEM SHALL declarar en `src/theme/global.css`, en el mismo bloque que
`--radius-16` y `--text-28`, las líneas `--text-34: 34px;`, `--radius-32: 32px;`
y `--radius-40: 40px;`, una vez cada una.

- `F` › `describe('#205 R1: tokens del canvas de cuenta')` ›
  `it('#205 R1: global.css declara text-34, radius-32 y radius-40 una sola vez')`.
  Canvas: `Main` contiene `font-size: 34px` y `border-radius: 32px`;
  `Recuperar` contiene `border-radius: 40px`. Producción: cada línea con
  `match(/…/g)` de longitud 1.

### R2 — Main: bloques y entradas

WHEN se pinta `/welcome` THE SYSTEM SHALL:

1. dar a `screen-welcome` el `contentContainerStyle` exacto
   `{ flexGrow: 1, paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }`
   (sin `justifyContent`, `padding` ni `gap`);
2. pintar `welcome-content` como `View` con `className="flex-1"` y sin estilo
   animado, con estos hijos en este orden: `welcome-rise-scene`,
   `welcome-rise-chips`, `welcome-rise-heading`, `welcome-spacer`,
   `welcome-rise-actions`, `welcome-legal`;
3. envolver: `<RiseIn testID="welcome-rise-scene" delayMs={0}>` a `welcome-scene`;
   `<RiseIn testID="welcome-rise-chips" delayMs={120} className="mt-6">` a
   `welcome-chips` (sin cambios dentro);
   `<RiseIn testID="welcome-rise-heading" delayMs={200} className="mt-4.5 items-center gap-2">`
   a `welcome-brand` y `welcome-tagline`; `<View testID="welcome-spacer" className="flex-1" />`;
   `<RiseIn testID="welcome-rise-actions" delayMs={280} className="gap-3.5">` a
   `welcome-get-started` y `welcome-have-account` (literales sin cambios).

- `src/screens/welcome/index.test.tsx` › `describe('#205 R2: Main apila sus bloques con RiseIn')` ›
  `it('#205 R2: el contenido apila escena, chips, marca, espaciador, CTAs y legal')` y
  `it('#205 R2: el scroll usa márgenes 16 y los insets sin centrar')`.
- `F` › `describe('#205 R2: entradas de Main')` ›
  `it('#205 R2: Main sube sus bloques a 0, 120, 200 y 280 ms como el artboard')`.
  Canvas `Main`: `animation: rise 400ms ease-out both`, `animation: rise 400ms ease-out 120ms both`,
  `animation: rise 400ms ease-out 200ms both`, `animation: rise 400ms ease-out 280ms both`,
  `padding: 56px 16px 34px`, `margin-top: 24px`, `gap: 14px`. Producción: los
  cuatro `<RiseIn testID="welcome-rise-…" delayMs={…}` literales de arriba.

### R3 — Main: escena

WHEN se pinta `/welcome` THE SYSTEM SHALL pintar `welcome-scene` como `View`
(no `Card`) con `className="h-95 w-full items-center justify-center overflow-hidden rounded-32 bg-surface-secondary"`
y `style={CONTINUOUS_CORNER}`; dentro, `<View testID="welcome-ground" className="absolute bottom-7.5 h-3.5 w-30 rounded-full bg-border" />`
antes de `welcome-stage`; dentro de `welcome-stage`, los anillos sin cambios y
`<PingoFloat testID="welcome-pingo-float">` envolviendo a `welcome-pingo`, que
mide `{ width: 220, height: 220 }` igual que `welcome-pingo-wave` y
`welcome-pingo-blink-image`.

- `src/screens/welcome/index.test.tsx` › `describe('#205 R3: la escena de Main')` ›
  `it('#205 R3: la escena es una vista de 380 con radio 32 y esquina continua')` y
  `it('#205 R3: Pingo mide 220, flota y pisa la sombra del suelo')` (asierta que
  el índice de `welcome-ground` es menor que el de `welcome-stage`, no la lista
  exacta de hijos: R4 añade uno).
- `F` › `describe('#205 R3: escena de Main')` ›
  `it('#205 R3: la escena y Pingo miden lo que el artboard')`. Canvas `Main`:
  `height: 380px`, `border-radius: 32px`, `width: 220px`, `width: 120px`,
  `bottom: 30px`, `animation: float 3s ease-in-out infinite`. Producción:
  `h-95`, `rounded-32`, `width: 220`, `w-30`, `bottom-7.5`,
  `<PingoFloat testID="welcome-pingo-float">`.

### R4 — Main: bocadillo

WHEN se pinta `/welcome` THE SYSTEM SHALL pintar, como último hijo de
`welcome-scene`, `<PopIn testID="welcome-bubble-pop" className="absolute top-7 right-5.5">`
con `welcome-bubble` como `View` (no `Card`) de
`className="rounded-tl-16 rounded-tr-16 rounded-bl-16 rounded-br-4 bg-surface px-3.5 py-2.5"`
y `style={[CONTINUOUS_CORNER, shadows.card]}` (`const shadows = useShadows();`),
y `welcome-bubble-text` con `className="text-sm font-bold text-foreground"`.

- `src/screens/welcome/index.test.tsx` › `describe('#205 R4: bocadillo de Main')` ›
  `it('#205 R4: el bocadillo flota arriba a la derecha con el pico abajo a la derecha')`.
- `F` › `describe('#205 R4: bocadillo de Main')` ›
  `it('#205 R4: el bocadillo copia posición, radios y sombra del artboard')`.
  Canvas `Main`: `top: 28px; right: 22px`, `border-radius: 16px 16px 4px 16px`,
  `animation: pop 400ms ease-out 600ms both`. Producción:
  `className="absolute top-7 right-5.5"`, `rounded-br-4`, `shadows.card`.

### R5 — Main: saludo (copy)

THE SYSTEM SHALL pintar en `welcome-bubble-text` la clave `welcome.pingoGreeting`
con los literales es `Hola, soy Pingo.` y en `Hi, I'm Pingo.` en
`src/i18n/catalog.ts`.

- Fila de `src/__tests__/ui-copy-table.ts`: sin cambio
  (`{ file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }` sigue).
  `SCREEN_FILES`: sin cambio. Longitud del catálogo: sin cambio (misma clave).
- `src/screens/welcome/index.test.tsx` › `describe('#205 R5: saludo de Main')` ›
  `it('#205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I\'m Pingo.»')` (lee
  ambos idiomas del catálogo y pinta el de español).

### R6 — Main: marca, CTAs y legal

WHEN se pinta `/welcome` THE SYSTEM SHALL dar a `welcome-brand`
`className="text-34 leading-10 font-black tracking-display text-foreground"`, a
`welcome-tagline` `className="max-w-75 text-center text-base text-muted"` y a
`welcome-legal` `className="mt-4 text-center text-xs text-muted"`, sin tocar los
literales de `welcome-get-started` ni `welcome-have-account`.

- `src/screens/welcome/index.test.tsx` › `describe('#205 R6: marca y legal de Main')` ›
  `it('#205 R6: la marca pesa 34/900, el subtítulo se limita a 300 y el legal baja 16')`.
- `F` › `describe('#205 R6: marca de Main')` ›
  `it('#205 R6: la marca copia tamaño, ancho y margen del artboard')`. Canvas
  `Main`: `font-size: 34px`, `max-width: 300px`, `margin-top: 18px`. Producción:
  `text-34 leading-10`, `max-w-75`, `mt-4.5 items-center gap-2`.

### R7 — Main: entradas retiradas

WHEN se pinta `/welcome` THE SYSTEM SHALL no animar `welcome-content` (sin
`entranceStyle`, ni fundido ni desplazamiento de entrada) y no aplicar a
`welcome-pingo` la flotación de 4 puntos; el muelle de escala de Pingo (#153 R9)
se conserva.

- `src/screens/welcome/index.test.tsx` › `describe('#205 R7: Main sin entradas antiguas')` ›
  `it('#205 R7: el contenido no lleva fundido ni Pingo la flotación de 4 puntos')`
  (fuente sin `entranceStyle`; tras avanzar 1500 ms sin reduce motion,
  `welcome-pingo` no tiene `translateY` distinto de 0).

### R8 — Login

WHEN se pinta `/login` THE SYSTEM SHALL:

1. dar a `login-form` el `contentContainerStyle`
   `{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }`
   (KAV sin cambios);
2. apilar en el scroll, en orden: `login-header`, `login-title`, `login-body`,
   `login-spacer`, `login-actions`;
3. `<RiseIn testID="login-header" delayMs={0}>` con
   `<View testID="login-top" className="-ml-2.5 flex-row">` (que lleva
   `login-back`) y `login-greeting` con `className="mt-2 flex-row items-end gap-3"`:
   `login-pingo` con `{ width: 88, height: 88, transform: [{ rotate: '-8deg' }] }`
   y `login-bubble` como `View` (no `Card`) de
   `className="mb-4.5 flex-1 rounded-tl-16 rounded-tr-16 rounded-br-16 rounded-bl-4 bg-surface-secondary px-3.5 py-2.5"`
   y `style={CONTINUOUS_CORNER}`; `login-bubble-text` sin cambios;
4. `<Text testID="login-title" className="mt-5 text-3xl font-black tracking-display text-foreground">`
   con el mismo copy de hoy;
5. `<RiseIn testID="login-body" delayMs={100} className="mt-6 gap-4">` con
   correo, contraseña, `link-forgot` y `login-error` en ese orden;
6. `login-spacer` sin cambios y
   `<RiseIn testID="login-actions" delayMs={200} className="gap-3.5">` con
   `login-submit` y `link-register` (literales sin cambios). `HomeEntrance` y
   `Card` salen de login.

- `src/screens/login/index.test.tsx` › `describe('#205 R8: Login como el artboard')` ›
  `it('#205 R8: el scroll apila cabecera, título, cuerpo, espaciador y acciones')`,
  `it('#205 R8: la burbuja es una vista con el pico abajo a la izquierda')` y
  `it('#205 R8: Pingo mide 88 y gira -8 grados')`.
- `F` › `describe('#205 R8: Login')` ›
  `it('#205 R8: Login sube a 0, 100 y 200 ms y copia radios y márgenes')`.
  Canvas `Login`: `animation: rise 400ms ease-out both`,
  `animation: rise 400ms ease-out 100ms both`, `animation: rise 400ms ease-out 200ms both`,
  `border-radius: 16px 16px 16px 4px`, `rotate(-8deg)`, `width: 88px`,
  `padding: 56px 20px 34px`, `margin-top: 24px`, `gap: 14px`. Producción: los
  tres `<RiseIn testID="login-…" delayMs={…}` de arriba, `rounded-bl-4`,
  `paddingHorizontal: 20`.

### R9 — Registro

WHEN se pinta `/register` THE SYSTEM SHALL dar al scroll el `contentContainerStyle`
`{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }`;
pintar `register-header` como `View` (no `HomeEntrance`) con `className="gap-2"`,
`register-top` con `className="-ml-2.5 flex-row items-center justify-between"`
(conserva `PingoFloat` y el Pingo de 56) y el título con
`className="text-3xl font-black tracking-display text-foreground"`; envolver
desde `register-names-row` hasta el error, en el orden de hoy, en
`<RiseIn testID="register-body" delayMs={0} className="mt-4.5 gap-3">`; dar a la
fila de términos `className="min-h-11 flex-row items-center gap-3"`; dejar
`register-spacer` y `register-submit` fuera del `RiseIn`.

- `src/screens/register/index.test.tsx` › `describe('#205 R9: Registro como el artboard')` ›
  `it('#205 R9: la cabecera no entra animada y el formulario sube con RiseIn')` y
  `it('#205 R9: el scroll usa márgenes 20 y conserva el colchón inferior de 96')`.
- `F` › `describe('#205 R9: Registro')` ›
  `it('#205 R9: Registro flota, sube a 0 ms y copia márgenes y términos')`. Canvas
  `Registro`: `animation: float 3s ease-in-out infinite`,
  `animation: rise 400ms ease-out both`, `margin-top: 18px`, `min-height: 44px`,
  `width: 56px`, `padding: 56px 20px 34px`. Producción:
  `<RiseIn testID="register-body" delayMs={0} className="mt-4.5 gap-3">`,
  `min-h-11`, `<PingoFloat`.

### R10 — Recuperar (formulario)

WHEN se pinta `/forgot` sin haber enviado THE SYSTEM SHALL:

1. dar al scroll el `contentContainerStyle`
   `{ flexGrow: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }`
   (conserva `keyboardShouldPersistTaps`);
2. dar a `forgot-top` `className="-ml-2.5 w-full"`;
3. pintar `<RiseIn testID="forgot-scene" delayMs={0} className="mt-4 h-37.5 w-42">`
   con, en orden: `<View testID="forgot-scene-backdrop" className="absolute inset-x-2.5 top-3.5 bottom-0 rounded-40 bg-surface-secondary" style={CONTINUOUS_CORNER} />`;
   `forgot-pingo` sin `PingoFloat`, absoluto (`className="absolute left-6 top-0"`)
   y con `{ width: 120, height: 120, transform: [{ rotate: '6deg' }] }`; y
   `forgot-lock-tile` con `absolute bottom-1.5 right-0 ` antepuesto a su
   `className` de hoy (estilo, icono y `PopIn` sin cambios);
4. dar a `forgot-title` `className="mt-7 text-center text-28 leading-8.5 font-black tracking-display text-foreground"`,
   a `forgot-body` `className="mt-2.5 max-w-80 text-center text-15 leading-5.5 font-normal text-muted"`
   y al `TextField` del correo `className="mt-7 w-full"`;
5. conservar `forgot-error` y `forgot-spacer` y pintar
   `<View testID="forgot-actions" className="w-full gap-3.5">` con
   `forgot-submit` y `link-login` (literales sin cambios).

- `src/screens/forgot/index.test.tsx` › `describe('#205 R10: Recuperar como el artboard')` ›
  `it('#205 R10: la escena apila fondo, Pingo y candado en 168x150')`,
  `it('#205 R10: Pingo no flota y mide 120 girado 6 grados')` y
  `it('#205 R10: título, cuerpo, campo y acciones siguen las medidas del artboard')`.
- `F` › `describe('#205 R10: Recuperar')` ›
  `it('#205 R10: Recuperar copia escena, tile y márgenes')`. Canvas `Recuperar`:
  `width: 168px; height: 150px`, `inset: 14px 10px 0`, `border-radius: 40px`,
  `right: 0; bottom: 6px; width: 52px; height: 52px; border-radius: 16px`,
  `rotate(6deg)`, `width: 120px`, `font-size: 28px`, `max-width: 320px`,
  `margin-top: 28px`, `animation: pop 400ms ease-out 300ms both`. Producción:
  `h-37.5 w-42`, `inset-x-2.5 top-3.5 bottom-0 rounded-40`,
  `absolute bottom-1.5 right-0`, `text-28 leading-8.5`, `max-w-80`.

### R11 — RecuperarEnviado

WHEN el envío de `/forgot` termina en éxito THE SYSTEM SHALL conservar
`forgot-top`, `forgot-scene` (fondo, Pingo y candado de R10), `forgot-title` y
`forgot-body` con las clases de R10, no pintar el campo ni `forgot-submit`, y
pintar en `forgot-actions` `forgot-resend` y después `link-login` (literales sin
cambios).

- `src/screens/forgot/index.test.tsx` › `describe('#205 R11: RecuperarEnviado como el artboard')` ›
  `it('#205 R11: tras enviar, la escena sigue y las acciones son Reenviar y volver')`.
- `F` › `describe('#205 R11: RecuperarEnviado')` ›
  `it('#205 R11: RecuperarEnviado dibuja la misma escena que Recuperar')`. Canvas
  `RecuperarEnviado`: `width: 168px; height: 150px`, `rotate(6deg)`,
  `width: 120px`, `font-size: 28px`, `max-width: 320px`, `gap: 14px`.
  Producción: `testID="forgot-actions" className="w-full gap-3.5"`.

### R12 — NuevaContrasena (formulario)

WHEN se pinta `/reset-password` con token y sin éxito THE SYSTEM SHALL dar al
scroll `reset-password-form` el `contentContainerStyle`
`{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 }`;
pintar `<RiseIn testID="reset-header" delayMs={0} className="flex-row items-center gap-3.5">`
con `reset-pingo` sin `PingoFloat` y con `{ width: 72, height: 72 }`, y el título
con `className="flex-1 text-28 leading-8 font-black tracking-display text-foreground"`;
y pintar `<RiseIn testID="reset-body" delayMs={100} className="mt-8 flex-1 gap-4">`
con contraseña, confirmación, `reset-error`, `reset-spacer`, `reset-submit` y
`link-login` en el orden de hoy.

- `src/screens/reset-password/index.test.tsx` › `describe('#205 R12: NuevaContrasena, formulario')` ›
  `it('#205 R12: el formulario apila cabecera sin flotación y cuerpo con RiseIn')` y
  `it('#205 R12: el scroll arranca 56 por debajo del inset y usa márgenes 20')`.
- `F` › `describe('#205 R12: NuevaContrasena')` ›
  `it('#205 R12: NuevaContrasena sube a 0 y 100 ms con Pingo de 72')`. Canvas
  `NuevaContrasena`: `padding: 100px 20px 34px`, `width: 72px`,
  `margin-top: 32px`, `font-size: 28px`, `animation: rise 400ms ease-out 100ms both`.
  Producción: `<RiseIn testID="reset-body" delayMs={100} className="mt-8 flex-1 gap-4">`,
  `paddingTop: insets.top + 56`, `width: 72`.

### R13 — NuevaContrasena (éxito)

WHEN el reset termina en éxito THE SYSTEM SHALL dar al scroll el mismo
`contentContainerStyle` de R12; pintar el mismo `reset-header` de R12 (`RiseIn`
0 ms, sin `PingoFloat`, título de R12); pintar
`<PopIn testID="reset-success-pop" className="mt-6 w-full">` con
`<View testID="reset-success-card" accessibilityLiveRegion="polite" className="flex-row items-center gap-3 rounded-16 bg-surface-secondary px-4 py-3.5" style={CONTINUOUS_CORNER}>`
(no `Card`; `reset-success-check` y `reset-success` sin cambios); y conservar
`reset-spacer` y `link-login`.

- `src/screens/reset-password/index.test.tsx` › `describe('#205 R13: NuevaContrasena, éxito')` ›
  `it('#205 R13: la tarjeta de estado es una vista de radio 16 bajo la cabecera')` y
  `it('#205 R13: el éxito conserva la cabecera sin flotación')`.
- `F` › `describe('#205 R13: NuevaContrasena, éxito')` ›
  `it('#205 R13: el éxito copia radio, fondo y margen del artboard')`. Canvas
  `NuevaContrasena`: `border-radius: 16px; background: var(--surface2)`,
  `margin-top: 24px`, `animation: pop 400ms ease-out 500ms both`. Producción:
  `className="mt-6 w-full"`, `rounded-16 bg-surface-secondary px-4 py-3.5`.

### R14 — NuevaContrasena (sin token)

WHILE `/reset-password` no recibe token THE SYSTEM SHALL pintar la rama de hoy
sin cambios: `contentContainerStyle` con `justifyContent: 'center'`,
`alignItems: 'center'`, `padding: 24` y `gap: 16`; título
`className="text-center text-2xl font-black text-foreground"`;
`reset-missing-token` y `link-login` como hoy.

- `src/screens/reset-password/index.test.tsx` › `describe('#205 R14: NuevaContrasena sin token')` ›
  `it('#205 R14: la rama sin token conserva su contenedor y su título')`.
  Candado de conservación: nace verde; el rojo se demuestra con mutación plantada
  (ver tasks.md).

### R15 — Cabecera nativa de nueva mascota

THE SYSTEM SHALL declarar en `src/app/_layout.tsx`
`<Stack.Screen name="pets/add" options={{ headerShown: false }} />`; el resto de
`Stack.Screen` no cambia.

- `src/app/__tests__/layout.test.tsx` › `describe('#205 R15: nueva mascota sin cabecera nativa')` ›
  `it('#205 R15: pets/add declara solo headerShown false')`.

### R16 — NuevaMascota (paso 1)

WHEN se pinta `/pets/add` en el paso 1 THE SYSTEM SHALL:

1. pintar, dentro del KAV y antes del scroll `add-pet-form`, un bloque fijo
   `<View className="gap-3 bg-background px-5" style={{ paddingTop: insets.top + 12 }}>`
   con `<ScreenHeader testID="add-pet" backFallback="/" title={…} size={24} accessory={…} />`
   (`title` = la misma clave que pinta hoy `add-pet-title`; `accessory` =
   `add-pet-step-label` con su `Text` de hoy) y después `add-pet-step-bar` (sin
   cambios dentro); la fila de título y paso de hoy desaparece del scroll;
2. envolver la fila de foto y burbuja en
   `<RiseIn testID="add-pet-intro" delayMs={0} className="flex-row items-center gap-3.5">`;
3. dar al título `Datos básicos` `className="text-base font-black text-foreground"`.

- `src/screens/add-pet/index.test.tsx` › `describe('#205 R16: NuevaMascota con ScreenHeader')` ›
  `it('#205 R16: la cabecera es ScreenHeader con título, paso y volver')`,
  `it('#205 R16: la barra de paso queda fuera del scroll')` y
  `it('#205 R16: la fila de foto sube con RiseIn y Datos básicos pesa 16/900')`.
- `F` › `describe('#205 R16: NuevaMascota')` ›
  `it('#205 R16: NuevaMascota copia cabecera, entrada y sección del artboard')`.
  Canvas `NuevaMascota`: `animation: rise 400ms ease-out both`,
  `font-size: 16px; font-weight: 900`, `width: 88px`, `gap: 14px`. Producción:
  `<ScreenHeader testID="add-pet"`, `size={24}`,
  `<RiseIn testID="add-pet-intro" delayMs={0}`, `text-base font-black`.

### R17 — Sombra del selector segmentado

WHEN una opción de `SegmentedControl` está seleccionada THE SYSTEM SHALL darle
`style={[CONTINUOUS_CORNER, selected ? shadows.segment : null]}`
(`const shadows = useShadows();`) y `className` sin `shadow-sm`
(`h-9.5 flex-1 items-center justify-center rounded-10` más ` bg-surface` si está
seleccionada).

- `F` › `describe('#205 R17: selector segmentado')` ›
  `it('#205 R17: la opción seleccionada lleva la sombra segment del canvas')`.
  Canvas `NuevaMascota`: `rgba(13,17,23,0.10)`. Producción
  (`src/components/segmented-control.tsx`): contiene `shadows.segment` y
  `useShadows()`, no contiene `shadow-sm`.

### R18 — NuevaMascota2 (paso 2)

WHEN se pinta `/pets/add` en el paso 2 THE SYSTEM SHALL dar al scroll `gap: 16`
(el paso 1 conserva `gap: 12`); envolver cada bloque, en orden, en
`<RiseIn testID="add-pet-rise-medical" delayMs={0} className="mt-3">` (título
`Datos médicos` con `className="text-lg font-black text-foreground"`),
`<RiseIn testID="add-pet-rise-age" delayMs={60}>` (edad, fecha o meses y sus
errores), `<RiseIn testID="add-pet-rise-sterilized" delayMs={120}>` y
`<RiseIn testID="add-pet-rise-microchip" delayMs={180}>`; y dar a todo chip del
paso (modo de edad y Sí/No) `className` seleccionado
`h-11 justify-center rounded-full border border-accent bg-tab-pill px-4` con
texto `text-sm font-bold text-foreground`, o no seleccionado
`h-11 justify-center rounded-full border border-border bg-default px-4` con texto
`text-sm font-semibold text-foreground`.

- `src/screens/add-pet/index.test.tsx` › `describe('#205 R18: NuevaMascota2')` ›
  `it('#205 R18: Datos médicos, Edad, Esterilizado y Microchip suben en ese orden')`,
  `it('#205 R18: el chip elegido lleva borde acento y pastilla')` y
  `it('#205 R18: el chip sin elegir lleva borde y fondo neutros')`.
- `F` › `describe('#205 R18: NuevaMascota2')` ›
  `it('#205 R18: el paso 2 sube a 0, 60, 120 y 180 ms con chips de 44')`. Canvas
  `NuevaMascota2`: `animation: rise 400ms ease-out 60ms both`,
  `animation: rise 400ms ease-out 120ms both`, `animation: rise 400ms ease-out 180ms both`,
  `font-size: 18px; font-weight: 900`, `height: 44px; padding: 0 16px; border-radius: 999px`.
  Producción: los cuatro `<RiseIn testID="add-pet-rise-…" delayMs={…}`, `bg-tab-pill`, `h-11`.

### R19 — Pie fijo de nueva mascota

WHILE `/pets/add` pinta el formulario THE SYSTEM SHALL pintar, dentro del KAV y
después del scroll, `<View testID="add-pet-footer" className="bg-background px-5 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>`
con `add-pet-continue` en el paso 1 o `add-pet-submit` en el paso 2 (literales
sin cambios, fuera del scroll). WHILE pinta la celebración THE SYSTEM SHALL no
pintar `add-pet-footer`. El KAV pasa a `keyboardVerticalOffset={0}`.

- `src/screens/add-pet/index.test.tsx` › `describe('#205 R19: pie fijo de NuevaMascota')` ›
  `it('#205 R19: el paso 1 lleva Continuar en el pie, fuera del scroll')`,
  `it('#205 R19: el paso 2 lleva Guardar en el pie, fuera del scroll')` y
  `it('#205 R19: la celebración no pinta el pie')`.
- `F` › `describe('#205 R19: pie fijo')` ›
  `it('#205 R19: los dos pasos fijan la CTA abajo como el artboard')`. Canvas
  `NuevaMascota` y `NuevaMascota2`: `padding: 16px 20px 34px`. Producción:
  `testID="add-pet-footer" className="bg-background px-5 pt-4"`,
  `keyboardVerticalOffset={0}`.

### R20 — Enmienda de carta

THE SYSTEM SHALL contener en `docs/ui-guidelines.md` una sección
`## Enmienda #205 — el flujo de cuenta como el canvas` que fije: (a) las
pantallas de cuenta y nueva mascota entran con `RiseIn` y los retardos del
artboard; (b) `PingoFloat` vive en bienvenida y registro y sale de recuperar y
nueva contraseña, y la flotación de 4 puntos de bienvenida se retira (enmienda
#172 y #153 R10); (c) nueva mascota usa `ScreenHeader` con
`headerShown: false` y CTA en pie fijo (enmienda #191); (d) `--radius-32` y
`--radius-40` quedan fuera de la escala de radios por fidelidad al canvas, y
`--text-34` entra para la marca; (e) los pops conservan el retardo fijo de
`PopIn`; (f) cita `specs/mobile-canvas-account-flow/requirements.md`.

- `F` › `describe('#205 R20: carta')` ›
  `it('#205 R20: la carta registra la enmienda #205')`. Corta la sección desde
  `## Enmienda #205` hasta el siguiente `\n## ` y asierta que contiene
  `RiseIn`, `PingoFloat`, `ScreenHeader`, `headerShown: false`, `--radius-32`,
  `--radius-40`, `--text-34`, `PopIn` y
  `specs/mobile-canvas-account-flow/requirements.md`.

## Candados que esta feature revierte

Inventario cerrado. Cada fila se enmienda en el commit rojo de su R: el título
del `it` recibe el sufijo ` (enmendado por #205 R<n>)` y su cuerpo pasa a asertar
el valor nuevo (o se borra la aserción que el R deja sin sujeto). «Seguro» = se
pone rojo; «condicional» = puede ponerse rojo según cómo quede el árbol; si no
se pone rojo, no se toca. Los títulos están copiados literalmente; donde el
describe padre no se midió por nombre, se da el más cercano por posición y el
implementador lo confirma con `grep -n`.

Rutas bajo `src/`. `W` = `screens/welcome/index.test.tsx`,
`L` = `screens/login/index.test.tsx`, `G` = `screens/register/index.test.tsx`,
`P` = `screens/forgot/index.test.tsx`, `N` = `screens/reset-password/index.test.tsx`,
`A` = `screens/add-pet/index.test.tsx`.

| Fichero › describe › it | R | Tipo |
|---|---|---|
| `__tests__/canvas-foundations.test.ts` › `#197 R20: cimientos sin cablear` (describe entero, con sus dos `it`) | R2 | **Se borra entero, sin sufijo**, en el primer commit rojo que monta un cimiento o toca `_layout.tsx` (es el de R2) |
| `W` › `R5` › `aplica las dimensiones del grupo sin tab bar` | R2 | seguro |
| `W` › `R5` › `apila los siete bloques en orden` | R2 | seguro |
| `W` › `#153 R5: la escena de Pingo sustituye al logo` › `apila la escena y los seis bloques de #118 en orden` | R2 | seguro |
| `W` › `#153 R5: la escena de Pingo sustituye al logo` › `pinta la escena como card secundaria con el bocadillo y Pingo` | R3 | seguro |
| `W` › `#153 R9: Pingo entra con un muelle de escala` › `arranca al 90 % sin reduce motion` | R3 | condicional (ancho 200) |
| `W` › `#153 R9: Pingo entra con un muelle de escala` › `termina a tamaño completo sin reduce motion` | R3 | condicional (ancho 200) |
| `W` › `#153 R9: Pingo entra con un muelle de escala` › `con reduce motion nace a tamaño completo y no escala` | R3 | condicional (ancho 200) |
| `W` › `#153 R6: Pingo se pinta con su pose y su capa de parpadeo` › `#167 R12: el anillo %i es un círculo de borde acento` | R3 | condicional |
| `W` › (describe por confirmar) › `ya no pinta el logo` | R3 | condicional |
| `W` › (describe por confirmar) › `exporta solo la pantalla` | R3 | condicional |
| `W` › `#153 R5: la escena de Pingo sustituye al logo` › `pinta el bocadillo como card de superficie con el saludo` | R4 | seguro |
| `W` › `#153 R1: el saludo de Pingo existe en los dos idiomas` › `declara el saludo en inglés y en español` | R5 | seguro |
| `W` › `#153 R1: el saludo de Pingo existe en los dos idiomas` › `pinta el saludo en el bocadillo en español` | R5 | seguro |
| `W` › `R5` › `pinta marca, tagline y legal con sus clases` | R6 | seguro |
| `W` › `#153 R8: el contenido entra con las constantes de motion.ts` › `usa el fundido y el muelle de motion.ts` | R7 | seguro |
| `W` › `#153 R8: el contenido entra con las constantes de motion.ts` › `arranca invisible y desplazado 12 puntos sin reduce motion` | R7 | seguro |
| `W` › `#153 R8: el contenido entra con las constantes de motion.ts` › `termina visible y en su sitio sin reduce motion` | R7 | seguro |
| `W` › `#153 R8: el contenido entra con las constantes de motion.ts` › `con reduce motion aparece sin desplazarse` | R7 | seguro |
| `W` › `#153 R10: Pingo flota en bucle` › `usa la flotación de motion.ts` | R7 | seguro |
| `W` › `#153 R10: Pingo flota en bucle` › `sube 4 puntos en medio ciclo sin reduce motion` | R7 | seguro |
| `W` › `#153 R10: Pingo flota en bucle` › `con reduce motion no flota` | R7 | seguro |
| `L` › `#61 R8: login tiene contenedor de scroll con safe areas` › `#172 R19: ancla el contenido al pie dentro de un ScrollView con los insets aplicados` | R8 | seguro |
| `L` › `#61 R8: login tiene contenedor de scroll con safe areas` › `no centra horizontalmente, que no lo hacía el View de hoy` | R8 | condicional |
| `L` › `#167 R6: Pingo saluda en login y la pantalla entra en dos tiempos` › `#167 R6: entra en dos tiempos, cabecera y cuerpo` | R8 | seguro |
| `L` › ídem › `#172 R3: la cabecera lleva Volver, el saludo y el título` | R8 | seguro |
| `L` › ídem › `#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro` | R8 | seguro |
| `L` › ídem › `#172 R7: con error, el error va entre el olvido y el envío` | R8 | seguro |
| `L` › ídem › `#172 R19: el espaciador empuja el envío al pie` | R8 | seguro |
| `L` › ídem › `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R8 | seguro |
| `L` › ídem › `#167 R6: el saludo pone a Pingo junto a su burbuja` | R8 | seguro |
| `L` › ídem › `#167 R6: la burbuja es una card secondary que ocupa el resto` | R8 | seguro |
| `L` › ídem › `#167 R6: la cabecera va antes que el cuerpo en el scroll` | R8 | condicional |
| `L` › ídem › `#172 R15: el error cuelga del scroll y no del contenedor del teclado` | R8 | condicional |
| `L` › ídem › `#167 R6: la burbuja dice el saludo en español` | R8 | condicional |
| `L` › ídem › `#167 R6: la burbuja dice el saludo en inglés` | R8 | condicional |
| `G` › `#61 R7: register usa las métricas de pantalla uniformes` › `aplica el padding del contentContainerStyle con los safe-area insets` | R9 | seguro |
| `G` › `#167 R7: Pingo en la cabecera del registro` › `#167 R7: la cabecera entra con rise` | R9 | seguro |
| `G` › ídem › `#172 R3: la cabecera lleva la fila Volver-Pingo y después el título` | R9 | seguro |
| `G` › ídem › `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R9 | seguro |
| `G` › ídem › `#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll` | R9 | seguro |
| `G` › ídem › `#172 R19: el espaciador empuja el envío al pie` | R9 | condicional |
| `P` › `#61 R8: forgot tiene contenedor de scroll con safe areas` › `#172 R19: centra en horizontal pero no en vertical dentro de un ScrollView con insets` | R10 | seguro |
| `P` › `#172 R5: flotación de recuperar` › `#172 R5: Pingo de recuperar flota` | R10 | seguro |
| `P` › `#172 R3: Volver en recuperar` › `#172 R3: la fila Volver encabeza el scroll en los dos estados` | R10 | seguro |
| `P` › `#172 R9: error de recuperar` › `#172 R14: el candado es un tile acento con labio y Lock de 26` | R10 | seguro |
| `P` › `#172 R9: error de recuperar` › `#172 R19: el espaciador empuja la CTA al pie en los dos estados` | R10 | seguro |
| `P` › `#117 R5: enviar pasa la pantalla a «Revisa tu correo»` › `el tile Lock sigue en pie en los dos estados` | R10 | condicional |
| `P` › `#117 R4: el formulario pide el correo` › `sin enviar no existen forgot-resend ni forgot-error` | R10 | condicional |
| `P` › `#117 R9: las métricas del stub sobreviven al cambio de estado` › `«Revisa tu correo» conserva el mismo contentContainerStyle y keyboardShouldPersistTaps` | R10 | condicional |
| `P` › `#117 R11: la pantalla de éxito es la misma para cualquier correo` › `dos correos distintos reciben «Revisa tu correo» con el mismo cuerpo salvo el correo citado` | R11 | seguro |
| `N` › `#61 R8: las tres ramas de reset tienen contenedor de scroll` › `#172 R19: la rama del formulario ancla el envío al pie y no centra` | R12 | seguro |
| `N` › `#167 R10: Pingo y tarjeta de estado en nueva contraseña` › `#172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito` | R12 | seguro |
| `N` › ídem › `#167 R10: el formulario entra en dos tiempos` | R12 | seguro |
| `N` › ídem › `#167 R10: la cabecera lleva a Pingo y después el título` | R12 | seguro |
| `N` › `R8: el submit completa el reset y mapea los errores` › `deshabilita el boton mientras la peticion esta en vuelo` | R12 | condicional |
| `N` › `#61 R8: las tres ramas de reset tienen contenedor de scroll` › `#172 R19: la rama de éxito ancla el enlace al pie y no centra` | R13 | seguro |
| `N` › `#167 R10: Pingo y tarjeta de estado en nueva contraseña` › `#167 R10: el éxito conserva la cabecera del formulario` | R13 | seguro |
| `N` › ídem › `#167 R10: la tarjeta de estado es secondary con check y texto` | R13 | seguro |
| `N` › ídem › `#167 R10: la tarjeta de estado entra con pop` | R13 | condicional |
| `N` › ídem › `#167 R10: el disco del check es acento con Check de 18` | R13 | condicional |
| `app/__tests__/layout.test.tsx` › `#95 R4: cada pantalla de detalle declara su cabecera nativa` › `#194 R4: %s usa exactamente las opciones de cabecera acordadas` | R15 | seguro: se borra la fila `['pets/add', '']` |
| `A` › `R6: alta de mascota` › `#191 R4: el paso 1 pinta foto, burbuja y datos básicos` | R16 | seguro |
| `A` › `#191 R2: el título vive en el contenido` › `pinta el título antes de la foto y conserva el botón atrás nativo` | R16 | seguro |
| `A` › `#191 R6: métricas y receta de campos` › `aplica las métricas, etiquetas y controles exactos en ambos pasos` | R16 (y R18 si vuelve a romper: segundo sufijo) | seguro |
| `A` › `R6: alta de mascota` (por confirmar) › `#191 R5: Tipo, Sexo y Tamaño usan el selector` | R16 | condicional |
| `A` › `R6: alta de mascota` (por confirmar) › `#191 R3: el indicador de paso muestra el primero con un segmento lleno` | R16 | condicional |
| `A` › `R6: alta de mascota` (por confirmar) › `#191 R3: el indicador de paso llena ambos segmentos en el segundo` | R16 | condicional |
| `A` › `#62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5)` › `%s coincide con los demás chips del formulario` | R18 | seguro |
| `A` › `#148 R4: add-pet se aparta del teclado en Android` › `el host screen-add-pet añade paddingBottom 291 al abrir el teclado` | R19 | condicional (el offset pasa a 0; se aserta la cifra que da el propio montaje del test) |
| `L`, `G`, `N`: `jest.mock` de `../home/home-entrance` | R8, R9, R12 | opcional: si el mock queda sin consumidor, se puede borrar en el mismo commit; no es un `it` |

Los agregados se enmiendan según «Candados agregados revisados».

**Regla de parada**: si un `it` que no está en esta tabla ni en «Candados
agregados revisados» se pone rojo, el implementador para, no lo toca y lo apunta
en su informe.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Candados agregados revisados

Se enmiendan (cada término nuevo lleva un comentario `// #205 R<n>`; el título
del `it` recibe el sufijo una sola vez, en el commit rojo del primer R que lo
toca):

| Fichero › describe › it | Cambio | R |
|---|---|---|
| `__tests__/consistency-classnames.test.ts` › `#62 R14: toda esquina no-cápsula que dibuja el repo es continua` › `%s importa y aplica sus %i esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | filas nuevas `[join('screens', 'welcome', 'index.tsx'), 1]` (R3), `[join('screens', 'login', 'index.tsx'), 1]` (R8), `[join('screens', 'reset-password', 'index.tsx'), 1]` (R13); `forgot` 0 → `0 + 1` (R10); `segmented-control` 2 → `2 - 1` (R17). Sufijo en R3 | R3, R8, R10, R13, R17 |
| ídem › `fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | a la expresión de `toBe(…)` se añaden `+ 1` (R3), `+ 1` (R8), `+ 1` (R10), `+ 1` (R13) y `- 1` (R17): neto `+ 3`. Sufijo en R3 | R3, R8, R10, R13, R17 |
| ídem › `#98 R10: los candados que esta feature no mueve` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | `count(/style=\{CONTINUOUS_CORNER\}/g)`: los mismos cinco términos (neto `+ 3`); `count(/bg-accent-soft/g)`: `- 2` (R18). Sufijo en R3 | R3, R8, R10, R13, R17, R18 |
| ídem › `#64 R9: el color categórico solo se nombra en el módulo de paleta` (describe por posición, confirmar) › `conserva los usos de bg-accent-soft que sí son acento` | `accentSoftCount`: `- 2` | R18 |
| `__tests__/design-drift.test.ts` › `#178 R13: Recordatorios sin deriva` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)` | `rounded16['screens/reset-password/index.tsx']` 1 → `1 + 1`. Condicional: si su regex también cuenta `rounded-tl-16`/`rounded-tr-16`/`rounded-br-16`/`rounded-bl-16`, se suman en las filas de welcome (R4) y login (R8) | R13 (R4, R8) |
| `__tests__/add-pet-two-steps.test.ts` › (describe padre) › `#191 R11: add-pet y el selector cumplen los inventarios` | `selector.match(/style=\{CONTINUOUS_CORNER\}/g)` 2 → `2 - 1` | R17 |
| `__tests__/account-screens-polish.test.ts` › `#172 R6: recetas de texto de cuenta` › `#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta` | vectores: login `[1,0,0,…]` → índice 0 a 0 (R8); register índice 0 a 0 (R9); forgot índices 1 y 8 a 0 (R10); reset índice 2: 2 → 1 (R12) y 1 → 0 (R13). Vectores finales: login `[0,0,0,2,2,0,1,0,0,0,1,0,0,0,0]`, register `[0,0,0,7,7,0,0,1,0,0,1,0,0,0,0]`, forgot `[0,0,0,1,1,0,0,0,0,0,1,1,0,0,0]`, reset `[0,0,0,2,2,0,0,0,0,1,1,0,0,1,0]`. Sufijo en R8 | R8, R9, R10, R12, R13 |

Revisados y **sin cambio** (con las decisiones de arriba):

- `account-screens-polish.test.ts`: `#172 R7` (`self-center` sigue en 0 en
  login; enlaces con sus literales), `#172 R10`, `#172 R18` (carta), `#172 R19`
  (cuentas de `justifyContent`, `alignItems`, espaciador
  `-spacer" className="flex-1" />`, `link-login`, etiqueta y `self-center`: login
  `[0,0,1,0,1,0]`, register `[0,0,1,0,0,0]`, forgot `[0,1,1,1,1,0]`, reset
  `[1,1,2,2,2,0]`: los espaciadores y `alignItems` se conservan), `#172 R20`
  (`h-13` se conserva).
- `add-pet-two-steps.test.ts` `#191 R11`: `rounded-16` 2, `CONTINUOUS_CORNER` 6,
  `FieldErrorMessage` 4 y `usePreventRemove` 1 en add-pet.
- `chunky-cta-canvas-fidelity.test.ts`: literales y cuentas de CTA por fichero
  (welcome 2, forgot 3, login 1, add-pet 2) no cambian; las CTA solo cambian de
  padre.
- `legibility` `#61 R4` (`inkSites`: login 2, forgot 1, reset 4, add-pet 1,
  welcome 2).
- `design-drift.test.ts` `#118 R11: la bienvenida no mete drift de estilo`
  (sin hex, sin clases `[…]`, sin `shadowColor`/`elevation`, sin
  `rounded-2xl|lg|md|sm`, sin `text-accent` suelto; `shadows.card` está
  permitido); inventario de `text-17`; `R9: mobile-pets-profile sin drift` ›
  `keeps the four Expo Router entrypoints thin` (`app/pets/add.tsx` sigue fino).
  Las guardas `#175 R10` y `#179 R13` que vetan `shadow` y radios fuera de
  escala miran solo sus propios ficheros.
- `src/app/__tests__/layout.test.tsx`: los describes de recuento de rutas
  (`#114 R1`, `#100 R2`, `#41 R4`, `#146 R5`, `#105 R8`).
- `pingo-float.test.tsx` (`#172 R4`): no lleva lista de consumidores.
- `home-photo-hero-canvas.test.ts`: sus filas de `bg-accent-soft` son de home y
  `pet-switcher`.
- `ui-copy-table.ts`, `SCREEN_FILES`, longitud del catálogo, inventario de
  constantes de `motion.ts`.

Guardas cruzadas con las clases nuevas: ninguna clase nueva es arbitraria
(`[…]`), ningún comentario nuevo lleva `#` seguido de 3 a 8 dígitos hex salvo la
forma `#205 R<n>` que `HEX_LITERAL` exime, no hay `StyleSheet.create`, no hay
`shadowColor`/`elevation` (las sombras salen de `useShadows`), y ningún
`text-13/15/17` nuevo va dentro de un componente HeroUI (todos van en `Text` de
React Native).

## Erratas del leader (2026-10-24)

Firmadas por delegación (mandato del humano del 2026-10-23, `progress/plan_canvas-parity-2026-10-23.md` §4).


**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #205 Rn`, o `; #205 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #205 Rn)`, o añade `Rn` al paréntesis de #205 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#205): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

## Desviaciones conscientes del canvas

| Canvas | Producción | Motivo |
|---|---|---|
| Pop del bocadillo de Main a 600 ms, del candado de Recuperar a 300 ms, de la tarjeta de éxito a 500 ms | `PopIn` con su retardo fijo de 250 ms | D5: `PopIn` es compartido y #201 lo usa sin cambios |
| Copy del bocadillo `¡Guau! Soy [NOMBRE]` | `Hola, soy Pingo.` / `Hi, I'm Pingo.` | D1: es un marcador; Voz B sin exclamación |
| Campos de Registro de 50; de NuevaMascota de 48 | 52 (`h-13`) en registro; los altos de #191 R6 en add-pet | D10: carta #172 fija 52 en cuenta; #191 R6 fija los de add-pet |
| Columna de CTAs de NuevaContrasena con gap 14 | `reset-body` con `gap-4` (16) porque las CTA viven en el mismo `RiseIn` que los campos | El canvas las mete en el mismo bloque de `rise` 100 ms |
| CTA fija de NuevaMascota con su propio fundido | `add-pet-footer` sin animación | El pie es fijo; animarlo no aporta y añade un `RiseIn` sin canvas que lo pida |
| Sombra del suelo `rgba(13,17,23,0.08)` (igual en oscuro) | `bg-border` (cambia con el tema) | D14: sin token propio; un hex rompería `HEX_LITERAL` |
| Muelle de escala de Pingo en Main: no dibujado | Se conserva (#153 R9) | Lo que el canvas no dibuja se conserva |
| Interlineado 20 del texto del bocadillo de login | `text-15 font-semibold` sin `leading` (se conserva) | Cambiarlo movería `#172 R6` (índice 6) sin ganancia visible |
| Peso 600 del País en el registro | Se conserva el de hoy | Fuera del alcance visual de este canvas |

## Fuera de alcance

- Cambiar `PopIn` (prop de retardo) o `PingoFloat`, `RiseIn`, `ScreenHeader`,
  `BackButton`, `useShadows`: se usan tal cual son en `dev`.
- Validación, navegación, peticiones, mapeo de errores y `usePreventRemove` de
  las seis pantallas: no cambian.
- La rama sin token de nueva contraseña (R14 solo la protege tal cual está).
- Las pantallas de #196, #198, #199, #200, #201, #202, #203, #204 y #206.
- Altos de campo (D10) y copy distinto del saludo de Main (D1).
- Un componente `Bubble` compartido para los bocadillos (dos usos con el pico en
  lados distintos; no hace falta todavía).
- Modo oscuro específico del canvas: se usan los tokens del tema, que ya tienen
  par oscuro.

## Cierre del humano

Smoke en dev build Android en el PC del humano (no Expo Go, no la VPS). No es
gate de implementación: cierra la feature. Lista (también en design.md
§Supuestos):

1. Bienvenida: escena redonda de 32 con anillos, Pingo de 220 flotando sobre la
   sombra del suelo, bocadillo arriba a la derecha con `Hola, soy Pingo.`; los
   bloques suben escalonados; con «Reducir movimiento» del sistema, nada sube ni
   flota.
2. Login: Pingo girado con su burbuja, título, cuerpo y acciones suben en tres
   tiempos; el teclado no tapa el campo ni el envío.
3. Registro: Pingo flota; el formulario sube; el envío queda al pie con el
   teclado cerrado y accesible con él abierto.
4. Recuperar y «Revisa tu correo»: escena con fondo redondeado, Pingo quieto y
   girado, candado con pop; tras enviar, Reenviar y volver.
5. Nueva contraseña (deep link con token): cabecera sin flotación; éxito con la
   tarjeta de radio 16. Sin token: la pantalla de hoy.
6. Nueva mascota: cabecera propia con volver, `1 de 2` y barra; Continuar fijo
   abajo; con el teclado abierto el pie sube sobre él; en el paso 2 los bloques
   suben escalonados y los chips miden 44; volver con datos pide confirmación
   como hoy; la celebración no lleva pie.

## Aprobación

Spec (R1–R20, decisiones D1–D15):

- [ ] Aprobado por humano (fecha: ____)

Enmienda de carta `## Enmienda #205` (R20, D11):

- [ ] Aprobado por humano (fecha: ____)

Smoke de cierre (§Cierre del humano):

- [ ] Smoke de R2–R19 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
