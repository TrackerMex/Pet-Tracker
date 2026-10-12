---
feature: "mobile-chunky-cta"
status: approved   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-chunky-cta]] (#166)

> Notación EARS. Ver [[design]] y [[tasks]]. Rutas relativas a
> `mobile-pet-tracker/` salvo que digan otra cosa. Base medida en el commit
> **c202b1ca** (branch `feature/166-mobile-chunky-cta`, que es origin/main
> más el registro de #166). Todas las anclas son por contenido (`grep -cF`
> con su salida esperada), nunca por número de línea.

Origen: decisión del humano del 2026-10-11, opción literal «Toda la app +
secundario gris» (`progress/explore_ui-canvas-parity.md` §4, D4 + N3;
candidata C1 de §5). Canvas de referencia:
`specs/mobile-welcome-pingo/design-src/welcome.dc.html` y
`celebration.dc.html`, copia del artifact aprobado el 2026-10-06.

## Base medida (premisas verificadas)

Medido en c202b1ca desde `mobile-pet-tracker/`. **Producción** es el
conjunto que recorre `sourceFiles()` de `src/__tests__/consistency-classnames.test.ts`:
`.ts`/`.tsx` bajo `src/`, sin carpetas `__tests__/` y sin `*.test.ts(x)`.
Los greps de abajo lo reproducen con esta variable (se usa sin comillas):

```bash
PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"
```

### M1. Primarios sólidos: 19 en 17 ficheros, todos `Button` de heroui

- `grep -rhoE "rounded-xl bg-accent([[:space:]]|\"|'|\`)" src $PROD | wc -l` → **19**.
  Es el mismo conjunto y el mismo número que ya cuentan dos candados de
  `consistency-classnames.test.ts`: `it('deja todos los botones primarios sólidos en un único radio')`
  (`toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1)`) y el de `#98 R10`
  (`count(/rounded-xl bg-accent(?=[\s'"\`])/g)` → `13 + 1 + 1 + 1 + 1 + 1 + 1`).
- El «26 líneas en 17 ficheros» del explore incluye las 7 de `bg-accent-soft`
  (tiles y botones tonales). **No** son primarios.
- Los 19 son `<Button>` de heroui-native y ninguno lleva `variant`: todos
  usan la primaria por defecto. **En los 18 que no son Bienvenida el
  className termina en `bg-accent"`**:
  `grep -rhoF 'rounded-xl bg-accent"' src $PROD | wc -l` → **18**.
  Bienvenida (`welcome-get-started`) ya lleva
  `w-full rounded-xl bg-accent border-b-4 border-black/25` (#153 R7).
- Inventario por fichero: `grep -rcE` con el patrón de arriba, sin las
  líneas a 0.

| Fichero (bajo `src/`) | Nº | testID(s) | Forma propia |
|---|---|---|---|
| `app/(auth)/login.tsx` | 1 | `login-submit` | `w-full`, `isDisabled` |
| `app/(auth)/register.tsx` | 1 | `register-submit` | `w-full`, `isDisabled` |
| `components/empty-state.tsx` | 1 | `` `${testID}-action` `` | componente compartido |
| `screens/add-pet/index.tsx` | 1 | `add-pet-submit` | `isDisabled` |
| `screens/add-reminder/index.tsx` | 1 | `add-reminder-submit` | `isDisabled` |
| `screens/docs/index.tsx` | 2 | `docs-upload`, `docs-upload-submit` | el segundo con `isDisabled`, dentro del formulario |
| `screens/forgot/index.tsx` | 1 | `forgot-submit` | `w-full`, `isDisabled` |
| `screens/geofence-editor/index.tsx` | 1 | `geofence-editor-save` | `isDisabled` |
| `screens/geofences/index.tsx` | 1 | `geofences-add` | `isDisabled` |
| `screens/home/index.tsx` | 1 | `weekly-activity-day-map` | `min-h-11 w-full` |
| `screens/meal-schedule/index.tsx` | 1 | `generate-plan-button` | `isDisabled` |
| `screens/pairing/index.tsx` | 2 | `ready-map`, `pairing-submit` | los dos `min-h-11 w-full`; el segundo con `isDisabled` |
| `screens/profile/index.tsx` | 1 | `profile-add-pet` | `size="sm"` |
| `screens/reminders/index.tsx` | 1 | `reminders-add-link` | sin forma propia |
| `screens/reset-password/index.tsx` | 1 | `reset-submit` | `w-full`, `isDisabled` |
| `screens/weight-log/index.tsx` | 1 | `weight-submit` | `isDisabled` |
| `screens/welcome/index.tsx` | 1 | `welcome-get-started` | ya con labio |

### M2. El labio hoy

- `grep -rhoE 'border-b-[0-9]' src $PROD | wc -l` → **1** (Bienvenida).
- `grep -rhoF 'border-black/25' src $PROD | wc -l` → **1** (Bienvenida).
- `grep -rhoF 'lip-gray' src | wc -l` → **0**.
- El fichero de tokens es `src/theme/global.css`; no hay `global.css` en la
  raíz de `mobile-pet-tracker/` (el explore citaba la ruta equivocada).
  `grep -cF -- '--color-lip-gray' src/theme/global.css` → **0**.
  Ancla de inserción: `grep -cF -- '--color-tab-pill:' src/theme/global.css`
  → **2**, una línea en `@variant light` y otra en `@variant dark`.
- `bg-surface` ya es una utilidad en uso:
  `grep -rhoE 'bg-surface([[:space:]]|")' src $PROD | wc -l` → **9**.

### M3. Todos los `Button` de producción: 58 tags

`grep -rhoE '<Button([[:space:]]|>|$)' src $PROD | wc -l` → **58**: los 19
primarios de M1 y 39 más. Los 39, clasificados leyendo cada tag de apertura
en c202b1ca:

| Familia | testIDs | Nº |
|---|---|---|
| Secundario neutro por `variant` | `forgot-resend` (`variant="secondary"`, `w-full rounded-xl`), `docs-upload-cancel` (`variant="outline"`, `rounded-xl`), `reminders-delete-cancel` (`variant="outline"`, `w-full rounded-xl`) | 3 |
| Secundario de Bienvenida, sin `variant` | `welcome-have-account` (`w-full rounded-xl border border-accent bg-transparent`) | 1 |
| Tonal acento (`variant="secondary"` + `bg-accent-soft`) | `add-pet-photo`, `change-photo`, `add-meal-time-button`, `` `meal-time-edit-${index}` `` | 4 |
| Tonal neutro (`variant="secondary"` + `bg-default`) | `theme-toggle`, `language-toggle` | 2 |
| Destructivo sólido | `device-unpair` (sin `variant`, `rounded-xl bg-danger`), `reminders-delete-confirm` (`variant="danger"`, `rounded-xl bg-danger`) | 2 |
| Destructivo tonal (`variant="danger-soft"`) | `geofence-editor-delete`, `` `geofence-${geofence.id}-delete` ``, `profile-sign-out`, `` `reminder-delete-${reminder.id}` ``, `lost-mode-button` | 5 |
| Primaria de heroui sin color en `className` | 19 reintentos (`food-retry`, `food-plan-retry`, `alerts-retry`, `alert-detail-retry`, `docs-retry`, `geofence-editor-retry`, `geofences-retry`, `health-retry`, `vaccines-retry`, `home-retry`, `pet-hero-retry`, `map-retry`, `map-last-retry`, `meal-schedule-retry`, `meals-history-retry`, `pairing-retry`, `profile-pet-retry`, `reminders-retry`, `weight-log-retry`), `notifications-open-settings`, `alert-detail-ack` y `` `${rowId}-ack` `` | 22 |

Total: 3 + 1 + 4 + 2 + 2 + 5 + 22 = 39.

### M4. Candados que esta feature mueve

| Candado | Ancla (`grep -cF` → salida) | Qué le pasa |
|---|---|---|
| `src/screens/welcome/index.test.tsx`, describe `#153 R7`, `it('deja el CTA secundario sin labio')` | `grep -cF "expect(secondary.props.className).not.toContain('border-b-4');" src/screens/welcome/index.test.tsx` → 1 | Se **revierte** y se sustituye (R3) |
| `src/screens/welcome/index.test.tsx`, describe `R8`, `it('es un botón hueco con tinta accent-strong')` | `grep -cF "toBe('w-full rounded-xl border border-accent bg-transparent')" src/screens/welcome/index.test.tsx` → 1 | Cambian su className esperado y su nombre (R3) |
| `src/components/__tests__/empty-state.test.tsx`, `it('declara el botón primario sin labio')` | `grep -cF 'expect(source).not.toMatch(/border-b-4/);' src/components/__tests__/empty-state.test.tsx` → 1 | Se **revierte**. El explore no lo inventariaba (R2) |
| `src/components/__tests__/empty-state.test.tsx`, `it('declara el botón sin size ni variant')` | `` grep -cF '<Button testID={`${testID}-action`} className="rounded-xl bg-accent" onPress={action.onPress}>' src/components/__tests__/empty-state.test.tsx `` → 1 | Cambia el tag esperado (R2) |
| className exacto renderizado (`toBe`) de `login-submit`, `register-submit`, `forgot-submit`, `reset-submit`, `geofence-editor-save` y `geofences-add` | ver [[tasks]] T2.1, tabla de sustituciones | A cada cadena se le añade ` border-b-4 border-black/25` al final (R2) |
| `consistency-classnames`: `#62 R1` (19) y `#98 R10` (19), regex `rounded-xl bg-accent(?=[\s'"\`])` | `grep -cF "toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1)" src/__tests__/consistency-classnames.test.ts` → 1 | **No se mueven**: el labio va detrás de `bg-accent` y el lookahead sigue viendo un espacio |

Comprobado que no tienen efecto:

- **Clases nuevas frente a los guards globales.** Se grepeó cada clase
  nueva (`border-b-4`, `border-black`, `border-2`, `border-b-6`, `lip`) en
  `consistency-classnames.test.ts`, `design-drift.test.ts` y
  `legibility-classnames.test.ts`. Salida 0 en los tres.
- **`design-drift`** prohíbe corchetes, hex fuera de `src/theme/` y
  `StyleSheet`. `border-black/25` no es ninguna de las tres cosas y ya pasa
  hoy en Bienvenida.
- **`legibility-classnames`, `#61 R3`**, prohíbe `opacity-70` y
  `opacity-80` en el texto de dos cards de acento, no en bordes.
- **`global-css.test.ts`** compara con `toMatchObject`, así que un token
  añadido no rompe ningún describe previo.
- **Tests de `forgot-resend` y `reminders-delete-cancel`**: ninguno asevera
  su className. El de `docs-upload-cancel` usa
  `stringContaining('rounded-xl')` y `'button__root--variant-outline'`, y
  los dos siguen verdes porque se conservan el radio y la variante.

## Decisiones por variante (cerradas aquí)

| Variante | Decisión |
|---|---|
| Primario sólido (los 19 de M1), cualquier forma: `w-full`, `min-h-11`, `size="sm"`, dentro de un formulario o del componente compartido | Lleva el labio. La receta se escribe **justo detrás** de `bg-accent`: `rounded-xl bg-accent border-b-4 border-black/25`. El resto del className no cambia |
| Primario deshabilitado (`isDisabled`, 12 de los 19) | Mismo className, sin rama condicional. heroui atenúa el botón entero, labio incluido |
| Primario «cargando» | No existe como variante: las pantallas usan `isDisabled` mientras envían. Se rige por la fila anterior |
| Secundario neutro (los 4 de M3: 3 por `variant` más Bienvenida) | Lleva el labio gris, `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, en el sitio de sus clases de borde y fondo. Conserva su `variant`, su ancho y su `Button.Label` |
| Tonal acento, tonal neutro, destructivo sólido, destructivo tonal | Sin labio (ver P2) |
| Primaria de heroui sin color en `className` (reintentos, ack, ajustes) | Sin labio: no llevan `rounded-xl bg-accent`, que es como el registro de #166 define «primario sólido» (ver P1) |
| Feedback de pulsación (que el botón se hunda y se coma el labio) | Fuera: es `PressableScale` (auditoría A1) |

## Requisitos funcionales

### R1. Token del labio gris

- **R1.1** THE SYSTEM SHALL declarar en `src/theme/global.css` el token
  `--color-lip-gray` con valor exacto `#E4E7EC` dentro de `@variant light`
  y `#0A0D12` dentro de `@variant dark` (los valores `--lip-gray` del
  canvas), de modo que exista la utilidad `border-lip-gray`.
- **R1.2** THE SYSTEM SHALL no escribir ningún hex nuevo fuera de
  `src/theme/`: el color del labio solo se nombra por la clase.

Test: `src/theme/__tests__/global-css.test.ts`, describe
`'#166 R1: global.css declara el labio gris en los dos temas'`,
`it.each` `'declara --color-lip-gray exacto en %s'`. R1.2 lo cubre el
`design-drift` existente (criterio CA-1).

### R2. Todo primario sólido lleva el labio

- **R2.1** WHEN se pinta cualquiera de los primarios sólidos de M1 THE
  SYSTEM SHALL llevar en su `className` la secuencia contigua
  `rounded-xl bg-accent border-b-4 border-black/25`, con el labio detrás de
  `bg-accent`. El resto del className (ancho, alto mínimo) queda igual.
- **R2.2** THE SYSTEM SHALL mantener en 19 los primarios sólidos de
  producción, con el reparto por fichero de M1 (17 ficheros), y que los 19
  lleven el labio.
- **R2.3** IF un elemento de producción no es uno de esos 19 primarios THEN
  THE SYSTEM SHALL no llevar `border-b-4` ni `border-black/25`. En
  producción hay exactamente 19 de cada uno.
- **R2.4** THE SYSTEM SHALL reflejar el labio en los candados que hoy fijan
  el className exacto de un primario (M4): el `toBe` renderizado de
  `login-submit`, `register-submit`, `forgot-submit`, `reset-submit`,
  `geofence-editor-save` y `geofences-add`, y los dos `it` de fuente de
  `empty-state.test.tsx`, cuyo `not.toMatch(/border-b-4/)` se revierte.

Tests: `src/__tests__/consistency-classnames.test.ts`, describe
`'#166 R2: todo primario sólido lleva el labio detrás de bg-accent'`:

- `it('inventaría los diecinueve primarios con labio, fichero a fichero')`
  cubre R2.1 y R2.2.
- `it('no deja la receta del labio fuera de un primario')` cubre R2.3.

R2.4 lo cubren los ocho `it` existentes de la tabla de [[tasks]] T2.1, con
su cadena nueva.

### R3. El secundario neutro lleva el labio gris

- **R3.1** WHEN se pinta `welcome-have-account`, `forgot-resend`,
  `docs-upload-cancel` o `reminders-delete-cancel` THE SYSTEM SHALL llevar
  en su tag de apertura la secuencia contigua
  `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, sin
  `border-accent`, `bg-transparent` ni `border-black`. Cada uno conserva su
  `variant`: `welcome-have-account` ninguna, `forgot-resend`
  `variant="secondary"`, y los otros dos `variant="outline"`.
- **R3.2** THE SYSTEM SHALL que el conjunto de `Button` de producción que
  son secundarios neutros sea exactamente esos cuatro testIDs. Un tag es
  secundario neutro si lleva `variant="outline"` o `variant="secondary"` y
  no lleva `bg-accent-soft` ni `bg-default`, o si lleva `border-lip-gray`.
- **R3.3** IF un elemento de producción no es uno de esos cuatro THEN THE
  SYSTEM SHALL no llevar `border-lip-gray` ni `border-b-6`. En producción
  hay exactamente 4 de cada uno.
- **R3.4** WHEN se renderiza Bienvenida THE SYSTEM SHALL pintar
  `welcome-have-account` con className exacto
  `w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, y su
  etiqueta con `font-semibold text-accent-strong` (sin cambio).

Tests en `src/__tests__/consistency-classnames.test.ts`, describe
`'#166 R3: el secundario neutro lleva el labio gris'`:

- `it.each` `'%s pinta %s con la receta del secundario en su tag de apertura'`
  cubre R3.1.
- `it('inventaría los cuatro secundarios neutros de toda la app')` cubre
  R3.2 y R3.3.

R3.4 lo cubren `src/screens/welcome/index.test.tsx`, describe
`'#166 R3: el CTA secundario lleva el labio gris'`,
`it('lleva el labio gris en el CTA secundario')`, y el `it` del describe
`R8` renombrado (ver [[tasks]] T3.1).

### R4. La carta declara el botón con cuerpo

- **R4.1** THE SYSTEM SHALL añadir a `docs/ui-guidelines.md`, §Decisiones
  fijas, el punto `13. **Botón con cuerpo** (feature #166, 2026-10-11).`
  justo detrás del punto 12. Debe llevar:
  - las dos recetas literales de R2.1 y R3.1, cada una entera en una sola
    línea y entre comillas invertidas;
  - el token `--color-lip-gray`;
  - la lista de familias sin labio (M3);
  - la regla de que el labio va detrás de `bg-accent`.

  El texto exacto está en [[design]] D5.

Test: `src/__tests__/consistency-classnames.test.ts`, describe
`'#166 R4: la carta declara el botón con cuerpo'`,
`it('declara las dos recetas y el orden del labio')`.

### R5. Prueba de humo humana en dev build de Android

- **R5.1** El humano comprueba en un **dev build de Android** (nunca Expo
  Go), en tema claro y en oscuro:
  1. Bienvenida: `Comenzar ahora` sigue igual que hoy. `Ya tengo una
     cuenta` es un botón de superficie con borde gris y un labio gris
     inferior más grueso que los laterales, y su etiqueta se lee entera,
     sin recorte.
  2. Login: `login-submit` lleva labio, también mientras está deshabilitado
     durante el envío.
  3. Perfil: `profile-add-pet` (`size="sm"`) lleva labio y su etiqueta no
     se recorta.
  4. Recuperar contraseña, tras enviar: `forgot-resend` lleva el labio
     gris.
  5. Documentos, formulario de subida: `docs-upload-submit` con labio y
     `docs-upload-cancel` con labio gris, uno al lado del otro.
  6. Recordatorios, hoja de borrar: `reminders-delete-cancel` con labio
     gris y `reminders-delete-confirm` (rojo) **sin** labio.

  Se firma en su casilla propia de §Aprobación. El leader no marca `done`
  sin ella.

## Criterios de aceptación transversales (carta, C8)

- **CA-1. Grep-clean**: cero hex fuera de `src/theme/`, cero clases entre
  corchetes y cero `StyleSheet.create`. Lo verifican los `it` existentes de
  `src/__tests__/design-drift.test.ts`
  (`'no deja ninguna clase Tailwind con valores entre corchetes'` y los
  `'keeps arbitrary text, hex colors, and StyleSheet out of feature sources'`),
  que siguen verdes.
- **CA-2. Sin sombra legacy**: el labio es un borde, no una sombra. Ningún
  fichero tocado gana `shadow-`, `elevation` ni `boxShadow`.
- **CA-3. Dimensiones y componentes compartidos**: ninguna pantalla cambia
  su layout y no se toca la sección de dimensiones de
  `docs/conventions.md`. `empty-state.tsx` recibe el labio en su único
  `Button` y no se crea ningún componente de botón nuevo.
- **CA-4. Sin dependencias**: `package.json` y `bun.lock` sin diff.
- **CA-5. Sin copy**: `src/i18n/catalog.ts` y `src/__tests__/ui-copy-table.ts`
  sin diff.

## Fuera de alcance

Cada viñeta es una delimitación de esta feature, no deuda nueva.

- **Feedback de pulsación chunky** (`PressableScale`, auditoría A1): el
  botón no se hunde ni se come el labio al pulsarlo. Ya está registrado
  como A1.
- **Etiquetas**: no cambia ningún `Button.Label` (peso, color ni tamaño).
  El canvas pinta `Ya tengo una cuenta` con peso 700 y la app con
  `font-semibold`; se queda así.
- **Alto y radio**: el canvas dibuja 56 px de alto y 16 px de radio. La app
  mantiene la altura de heroui y `rounded-xl` (#62, punto 12 de la carta).
  No se relitiga.
- **Labio del primario como token**: el primario conserva el
  `border-black/25` de #153, por la decisión del humano de que el labio del
  primario de Bienvenida pasa a todos. No se crea el `--lip` verde del
  canvas.
- **Familias sin labio** de M3 (tonales, destructivos y primarias de heroui
  sin color): delimitación cerrada en §Decisiones por variante. P1 y P2 se
  las presentan al humano.
- **Trazabilidad histórica**: no se edita la de #152/#153 ni la de la spec
  dueña de `empty-state.test.tsx`. Los `it` renombrados o revertidos se
  registran en la trazabilidad de esta feature.

## Preguntas abiertas

Cada pregunta trae la opción por defecto que esta spec ya aplica. Si el
humano aprueba la spec tal cual, queda cerrada; si elige la otra opción, la
spec se enmienda antes del handoff.

- **P1. Primarias de heroui sin color en `className`** (las 22 de M3:
  reintentos, `alert-detail-ack`, `${rowId}-ack` y
  `notifications-open-settings`). Se ven como botones de acento sólidos,
  pero no llevan `rounded-xl bg-accent` ni el radio de #62. **Por defecto:
  fuera.** Meterlas exige darles antes la receta primaria entera, radio
  incluido, y mueve los recuentos de `#62 R1` y `#98 R10`: es otra feature.
- **P2. Destructivo sólido** (`device-unpair`, `reminders-delete-confirm`).
  **Por defecto: sin labio.** La decisión del humano habla del primario
  (acento) y del secundario. En la hoja de borrar recordatorio, cancelar
  tendrá labio gris y borrar (rojo) no.
- **P3. Qué es «el secundario»**. **Por defecto: los cuatro neutros de M3**
  (Bienvenida, `forgot-resend`, `docs-upload-cancel` y
  `reminders-delete-cancel`). La alternativa estrecha es solo Bienvenida,
  que es el único secundario que el canvas dibuja sobre una pantalla que ya
  existe (el otro es el de la celebración, que aún no existe).

## Aprobación

- [x] Aprobado por humano, con P1 a P3 resueltas (fecha: 2026-10-11) ← gate obligatorio antes de implementar
- [X] Prueba de humo R5 superada en dev build de Android (fecha: 2026-10-11) ← gate de cierre; el leader no marca `done` sin ella
