---
feature: "mobile-account-screens-polish"
status: approved   # draft | spec_ready | approved
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

- **D1 — Cuatro componentes compartidos en `src/components/`** (R2, R4, R8,
  R9). `BackButton`, `PingoFloat`, `PasswordInput` y `FormError` se usan en
  dos o más pantallas, así que la carta (C8) los exige compartidos. Cada uno es
  un fichero pequeño, sin variantes ni props de estilo: el `className` es fijo
  dentro del componente.
- **D2 — `BackButton` decide entre `back` y `replace`** (R2, R3). Las tres
  pantallas con «Volver» pueden abrirse sin historial (enlace profundo,
  redirección del guard de auth). Con `router.canGoBack()` se vuelve atrás
  cuando hay pila, y si no, se reemplaza por el `fallback` de cada pantalla:
  bienvenida para login y registro, login para recuperar. `replace` y no
  `push`, para no apilar una bienvenida encima de la pantalla. Nueva contraseña
  no lleva «Volver»: su canvas no lo dibuja, y la vuelta es el enlace al login
  bajo la CTA (R19).
- **D3 — `PingoFloat` usa constantes propias con los valores del canvas** (R4;
  P8). `MOTION_PINGO_FLOAT_OFFSET_Y` (10) y `MOTION_PINGO_FLOAT_TIMING`
  (1500 ms por tramo, `ease-in-out`, `ReduceMotion.System`) viven en
  `motion.ts`, junto a las de la bienvenida, que no cambian. El
  `if (!reduceMotion)` explícito con `useReducedMotion()` hace que el test
  pueda verificar que no arranca. La bienvenida **no** migra a `PingoFloat`:
  tiene sus propios candados de fuente (#153) y migrarla sería alcance ajeno.
- **D4 — `FormError` pinta icono y texto en una fila** (R9, R10). Es un solo
  componente para el error general de las cuatro pantallas y para el de cada
  campo de registro. El de cada campo va dentro del `FieldError` de heroui como
  hijo no-string, así que `FieldError` no lo envuelve en su propio texto.
  `w-full` en la fila evita que se encoja en la columna centrada de recuperar.
- **D5 — El borde `danger` lo pone heroui** (R10). `Input` ya lo aplica cuando
  su `TextField` lleva `isInvalid`, que registro ya pasa (B12). No se añade
  clase de borde a mano.
- **D6 — Tokens de texto `13`, `15` y `17`** (R1, R6; Enmienda E1). El canvas
  usa 13, 15 y 17 px, que no existen en la escala de Tailwind. Tres tokens en
  `@theme` de `global.css`, junto a `text-2xs` de #61. Se nombran por su valor
  (`--text-<px>`), la regla compartida del 2026-10-13: #173 declara
  `--text-13` y #171 `--text-15` con la misma línea, y el spike de #173 (su
  design.md §5) confirmó que uniwind compila los tamaños numéricos.
- **D7 — Títulos en `text-3xl`** (R6). El canvas dibuja 30 px en login y
  registro, y 28 px en recuperar y nueva contraseña. Un token para 2 px no se
  justifica: los cuatro van a `text-3xl`.
- **D8 — `Label.Text` en lugar de `className` en `Label`** (R6). Hoy la clase va
  a la raíz `Pressable` del `Label` y no llega al texto. `Label.Text` la aplica
  donde hace falta.
- **D9 — El ojo vive en `PasswordInput`, sobre `InputGroup` de heroui** (R8;
  P6). Cinco campos en tres pantallas comparten el mismo botón, así que va en
  un componente con su estado por instancia (`useState` dentro), y sus dos
  claves son `common.*`. `InputGroup.Suffix` mide su ancho y lo suma al padding
  del input, así que el texto nunca queda debajo del icono. Es un componente ya
  instalado.
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
- **D14 — Inter ExtraBold es un asset, no una dependencia** (R6; P2). Los cinco
  pesos de hoy son ficheros `.ttf` en `assets/fonts/` cargados con `useFonts`;
  el sexto entra igual, con su token `--font-extrabold` en `@theme`. El
  fichero sale del mismo zip de Inter 4.1 que los otros pesos, y su sha256
  queda fijado en R6. Codex lo descarga fuera del árbol y lo copia; no se
  instala ningún paquete.
- **D15 — Alturas con clase (`h-14`, `h-13`), no con `size="lg"`** (R20; P5).
  `size="lg"` cambiaría el padding y el tamaño de letra de heroui además de la
  altura, y movería las cuatro clases exactas de `#127 R1` por partida doble.
  `h-14` gana a la altura de `button__root--size-md` por el mismo mecanismo con
  el que `rounded-xl` gana a su radio (CSS de heroui sin capa). En los inputs,
  `h-13` (52) es mayor que el `min-height` de 48 de `input__input`, así que no
  choca. Ninguna de las dos es una clase arbitraria, y `design-drift` las
  admite.
- **D16 — La CTA al pie con un espaciador `flex-1`** (R19; P5). El canvas
  ancla la CTA al pie de la pantalla. Con `flexGrow: 1` en el
  `contentContainerStyle` (que login, recuperar y nueva contraseña ya tienen, y
  registro gana) y un `View` vacío `flex-1` justo antes de la CTA, el hueco
  sobrante se queda encima de la CTA. Si el contenido no cabe, el espaciador
  mide 0 y el `ScrollView` desplaza como hoy. Se quita `justifyContent:
  'center'` porque con el espaciador no tiene efecto y la carta ya no lo pide
  en estas pantallas (enmienda #172). El `ScrollView`,
  `keyboardShouldPersistTaps` y el `KeyboardAvoidingView` no cambian.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/` salvo las de `docs/` y `specs/`.
Todo es capa de presentación.

**Nuevos**

| Fichero | R |
|---|---|
| `assets/fonts/Inter-ExtraBold.ttf` | R6 |
| `src/components/back-button.tsx` | R2 |
| `src/components/pingo-float.tsx` | R4 |
| `src/components/password-input.tsx` | R8 |
| `src/components/form-error.tsx` | R9 |
| `src/components/__tests__/back-button.test.tsx` | R2 |
| `src/components/__tests__/pingo-float.test.tsx` | R4 |
| `src/components/__tests__/password-input.test.tsx` | R8 |
| `src/components/__tests__/form-error.test.tsx` | R9 |
| `src/__tests__/account-screens-polish.test.ts` | R6, R7, R10, R18, R19, R20 |

**Modificados (producción)**

| Fichero | Qué cambia | R |
|---|---|---|
| `src/theme/global.css` | tres tokens de texto y `--font-extrabold` | R1, R6 |
| `src/theme/motion.ts` | `MOTION_PINGO_FLOAT_OFFSET_Y` y `MOTION_PINGO_FLOAT_TIMING` | R4 |
| `src/app/_layout.tsx` | `'Inter-ExtraBold'` en `useFonts` | R6 |
| `src/screens/login/index.tsx` | `BackButton`, título, `Label.Text`, burbuja, CTA, enlaces y orden, `PasswordInput`, `FormError`, espaciador, sin centrado, alturas | R3, R6–R9, R19, R20 |
| `src/screens/register/index.tsx` | cabecera con `register-top`, `PingoFloat`, título, `Label.Text`, términos, CTA, rejilla, dos `PasswordInput`, `FormError` por campo y general, validación del correo, espaciador, `flexGrow`, alturas; deja de importar `AlertCircle` y `useThemeColors` | R3, R5, R6, R8–R12, R19, R20 |
| `src/screens/forgot/index.tsx` | `forgot-top`, `PingoFloat`, título, cuerpo, `Label.Text`, CTA, reenviar, `link-login`, `FormError`, tile del candado, espaciador, sin centrado vertical, alturas | R3, R5, R6, R7, R9, R14, R19, R20 |
| `src/screens/reset-password/index.tsx` | en las ramas con token: `PingoFloat` en `reset-header`, títulos, `Label.Text`, CTA, dos `PasswordInput`, `FormError`, `accessibilityLiveRegion`, espaciadores, enlace al login bajo la CTA, sin centrado, alturas. La rama sin token no cambia | R5, R6, R8, R9, R13, R19, R20 |
| `src/i18n/catalog.ts` | tres claves nuevas y `register.country` en `en` y `es` | R16 |
| `../docs/ui-guidelines.md` | Enmienda #172 al final | R18 |
| `../specs/mobile-ui-language/design.md` | `### §2.N — Añadidos por #172 — …` y la fila de `register.country` | R16 |

**Modificados (tests)**: los de §Deltas de candados de requirements.md
(`consistency-classnames`, `legibility-classnames`, `design-drift`,
`ui-language`, `ui-copy-table.ts`, `language-provider`, `motion` y los cuatro
tests de pantalla) y `src/theme/__tests__/font-registration.test.ts` (R6).

**Sin cambios**: `src/components/card.tsx`, la bienvenida y `package.json`.

## Alternativas descartadas

- **Token de 28 px para los títulos**: 2 px de diferencia con `text-3xl` no
  justifican un token más (D7).
- **Labio detrás de `bg-accent` en el tile**: haría que el tile contara como
  primario en el inventario de #166 y obligaría a cambiar su título
  («diecinueve primarios»).
- **Reutilizar las constantes de flotación de la bienvenida (4 px, 1200 ms)**:
  el humano eligió los valores del canvas (P8).
- **Pingo flotando sin doble en los tests de pantalla**: el `translateY` ya lo
  verifica `pingo-float.test.tsx`; en pantalla basta con ver el envoltorio.
- **`Pressable` absoluto encima del input para el ojo**: necesita un padding a
  mano y un valor fijo; `InputGroup` lo resuelve sin números (D9).
- **Un ojo distinto por pantalla**: cinco copias del mismo estado y del mismo
  botón; `PasswordInput` lo pinta una vez (D9).
- **`size="lg"` en los botones de cuenta**: cambia más que la altura (D15).
- **`justifyContent: 'space-between'` en lugar del espaciador**: reparte el
  hueco entre todos los hijos del contenedor, no solo encima de la CTA, y en
  registro separaría los campos (D16).
- **Validar el correo con una librería**: no hay ninguna instalada para eso, y
  una línea basta (D11).
- **Migrar la bienvenida a `PingoFloat`**: fuera de alcance; tiene candados
  propios (D3).
- **Un `FieldError` con `className` en lugar de `FormError`**: `FieldError` no
  admite icono, y el canvas lo dibuja.
