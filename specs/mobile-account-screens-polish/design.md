---
feature: "mobile-account-screens-polish"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-account-screens-polish]] (#172)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta que manda sobre el
> canvas. Todo es capa de presentación (`mobile-pet-tracker/src`): no hay
> dominio, API ni backend nuevos.

## Entorno

- El worktree `Pet-Tracker-wt-172` no trae `node_modules` (B2). Antes de H0:
  `cd mobile-pet-tracker && bun install --frozen-lockfile`. Nunca uses `npm` ni
  `npx`.
- Antes de cualquier typecheck, comprueba con `test ! -e
  mobile-pet-tracker/.expo/types/router.d.ts` que no hay tipos de rutas
  obsoletos. Si el fichero existe, para y avisa.
- Jest se corre fichero a fichero con `--testTimeout=30000`. La suite entera la
  corre el leader con `./init.sh` al final, no Codex.

## Decisiones técnicas

- **D1 — Tres componentes compartidos en `src/components/`** (R2, R4, R9).
  `BackButton`, `PingoFloat` y `FormError` se usan en dos o más pantallas, así
  que la carta (C8) los exige compartidos. Cada uno es un fichero pequeño, sin
  variantes ni props de estilo: el `className` es fijo dentro del componente.
- **D2 — `BackButton` decide entre `back` y `replace`** (R2, R3). Las tres
  pantallas pueden abrirse sin historial (enlace profundo, redirección del
  guard de auth). Con `router.canGoBack()` se vuelve atrás cuando hay pila, y si
  no, se reemplaza por el `fallback` de cada pantalla: bienvenida para login y
  registro, login para recuperar. `replace` y no `push`, para no apilar una
  bienvenida encima de la pantalla.
- **D3 — `PingoFloat` reutiliza las constantes de la bienvenida** (R4; P8). `MOTION_FLOAT_OFFSET_Y` y `MOTION_FLOAT_TIMING` ya llevan
  `ReduceMotion.System`; el `if (!reduceMotion)` explícito con
  `useReducedMotion()` hace que el test pueda verificar que no arranca. La
  bienvenida **no** migra a `PingoFloat`: tiene sus propios candados de fuente
  (#153) y migrarla sería alcance ajeno.
- **D4 — `FormError` pinta icono y texto en una fila** (R9, R10). Es un solo
  componente para el error general y para el de cada campo. El de cada campo va
  dentro del `FieldError` de heroui como hijo no-string, así que `FieldError`
  no lo envuelve en su propio texto. `w-full` en la fila evita que se encoja en
  la columna centrada de recuperar.
- **D5 — El borde `danger` lo pone heroui** (R10). `Input` ya lo aplica cuando
  su `TextField` lleva `isInvalid`, que registro ya pasa (B12). No se añade
  clase de borde a mano.
- **D6 — Tokens de texto `label`, `body` y `cta`** (R1, R6). El canvas usa
  13, 15 y 17 px, que no existen en la escala de Tailwind. Tres tokens en
  `@theme` de `global.css`, junto a `text-2xs` de #61.
- **D7 — Títulos en `text-3xl`** (R6). El canvas dibuja 30 px en login y
  registro, y 28 px en recuperar. Un token para 2 px no se justifica: los tres
  van a `text-3xl`.
- **D8 — `Label.Text` en lugar de `className` en `Label`** (R6). Hoy la clase va
  a la raíz `Pressable` del `Label` y no llega al texto. `Label.Text` la aplica
  donde hace falta.
- **D9 — El ojo usa `InputGroup` de heroui** (R8). `InputGroup.Suffix` mide su
  ancho y lo suma al padding del input, así que el texto nunca queda debajo del
  icono. Es un componente ya instalado.
- **D10 — La rejilla de registro usa filas `flex-row` con `flex-1` y `flex-2`**
  (R11). `flex-2` es la clase estándar de Tailwind (`flex: 2`). Hoy no se usa
  en el repo (B13), así que la prueba de humo comprueba que uniwind la genera.
- **D11 — Validación del correo antes de la API** (R12). Es un patrón sencillo
  (algo@algo.algo), igual que el que dibuja el canvas. Reutiliza
  `forgot.invalidEmail` para no crear copy nuevo.
- **D12 — El tile del candado lleva labio, y el labio va delante de
  `bg-accent`** (R14). El canvas dibuja un tile acento con labio. El inventario
  de primarios de #166 cuenta `rounded-xl bg-accent` seguido de un separador,
  así que con el labio delante el tile no cuenta como botón. Los dos recuentos
  globales del labio suben en 1, y la carta lo declara como excepción (R18).
- **D13 — `accessibilityLiveRegion` en la tarjeta de éxito** (R13). `Card`
  reenvía sus `ViewProps`. `polite` no interrumpe al lector de pantalla.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/` salvo las de `docs/` y `specs/`.
Todo es capa de presentación.

**Nuevos**

| Fichero | R |
|---|---|
| `src/components/back-button.tsx` | R2 |
| `src/components/pingo-float.tsx` | R4 |
| `src/components/form-error.tsx` | R9 |
| `src/components/__tests__/back-button.test.tsx` | R2 |
| `src/components/__tests__/pingo-float.test.tsx` | R4 |
| `src/components/__tests__/form-error.test.tsx` | R9 |
| `src/__tests__/account-screens-polish.test.ts` | R6, R7, R10, R18 |

**Modificados (producción)**

| Fichero | Qué cambia | R |
|---|---|---|
| `src/theme/global.css` | tres tokens de texto | R1 |
| `src/screens/login/index.tsx` | `BackButton`, título, `Label.Text`, burbuja, CTA, enlaces y orden, ojo, `FormError` | R3, R6, R7, R8, R9 |
| `src/screens/register/index.tsx` | cabecera con `register-top`, `PingoFloat`, título, `Label.Text`, términos, CTA, rejilla, `FormError` por campo y general, validación del correo; deja de importar `AlertCircle` y `useThemeColors` | R3, R5, R6, R9–R12 |
| `src/screens/forgot/index.tsx` | `forgot-top`, `PingoFloat`, título, cuerpo, `Label.Text`, CTA, reenviar, `link-login`, `FormError`, tile del candado | R3, R5, R6, R7, R9, R14 |
| `src/screens/reset-password/index.tsx` | `PingoFloat` en `reset-header`; `accessibilityLiveRegion` | R5, R13 |
| `src/i18n/catalog.ts` | tres claves en `en` y `es` | R16 |
| `../docs/ui-guidelines.md` | Enmienda #172 al final | R18 |
| `../specs/mobile-ui-language/design.md` | `### §2.N — Añadidos por #172 — …` | R16 |

**Modificados (tests)**: los de §Deltas de candados de requirements.md y los
cuatro tests de pantalla.

**Sin cambios**: `src/theme/motion.ts`, `src/components/card.tsx`, la
bienvenida y `package.json`.

## Alternativas descartadas

- **Token de 28 px para los títulos**: 2 px de diferencia con `text-3xl` no
  justifican un token más (D7).
- **Labio detrás de `bg-accent` en el tile**: haría que el tile contara como
  primario en el inventario de #166 y obligaría a cambiar su título
  («diecinueve primarios»).
- **Constantes de flotación nuevas (10 px, 3 s) del canvas**: añaden dos
  exportaciones a `motion.ts` y dos bucles distintos en la app. Queda como P8.
- **Pingo flotando sin doble en los tests de pantalla**: el `translateY` ya lo
  verifica `pingo-float.test.tsx`; en pantalla basta con ver el envoltorio.
- **`Pressable` absoluto encima del input para el ojo**: necesita un padding a
  mano y un valor fijo; `InputGroup` lo resuelve sin números (D9).
- **Validar el correo con una librería**: no hay ninguna instalada para eso, y
  una línea basta (D11).
- **Migrar la bienvenida a `PingoFloat`**: fuera de alcance; tiene candados
  propios (D3).
- **Un `FieldError` con `className` en lugar de `FormError`**: `FieldError` no
  admite icono, y el canvas lo dibuja.
