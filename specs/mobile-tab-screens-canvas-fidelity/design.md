---
feature: "mobile-tab-screens-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Diseño — [[mobile-tab-screens-canvas-fidelity]] (#173)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto. Todo el cambio vive en la
> capa de presentación de `mobile-pet-tracker/` (pantalla, componentes compartidos, tema, catálogo i18n).
> No toca dominio, aplicación, API ni backend.

## 1. Decisiones técnicas

### F0: cimientos reutilizables (R1–R4)

- **ExtraBold como sexto peso de Inter (R1)**.
  - Se registra igual que los cinco pesos actuales: el `.ttf` en `assets/fonts/`, el `require` en el
    `useFonts` de `src/app/_layout.tsx` y la variable `--font-extrabold` en `@theme`.
  - Uniwind genera `font-extrabold` a partir de la variable. No se añade ninguna utilidad propia.
  - El test compara bytes con los cinco ficheros existentes. Así un `cp Inter-Bold.ttf Inter-ExtraBold.ttf`
    se pone rojo.
  - **Origen del fichero**: release `v4.001` de `rsms/inter`, ruta `extras/ttf/Inter-ExtraBold.ttf`, licencia
    OFL. Si Codex no tiene red, el humano o el leader colocan el fichero antes de T1.2.
- **Radios por token (R2)**.
  - `--radius-hero: 28px` y `--radius-tile: 18px` siguen la regla de `--radius-card`: Uniwind genera
    `rounded-hero` y `rounded-tile`.
  - Ningún literal arbitrario (`rounded-[28px]`) entra en el código.
  - El inventario por fichero impide que los radios se extiendan sin una spec que lo diga.
- **Variantes de `Card` (R3)**.
  - `hero` y `flat` son entradas nuevas del mapa `variantClassNames`. No pasan por un `className` que pise
    `shadow-sm`.
  - Con tailwind-merge v3, `rounded-hero` no se fusiona con `rounded-card` (son utilidades que no conoce como
    radio), así que sobreescribir por `className` dejaría las dos clases.
  - Cada variante lleva su cadena completa y los 19 consumidores existentes no se tocan (D8).
- **`PetSwitcher` variante `avatars` (R4)**.
  - Es una rama dentro del mismo componente. La rama `default` queda literalmente igual, así que los describe
    existentes sirven de candado de no regresión.
  - El color sale del índice (`i % 5`) sobre una lista fija de cinco huecos de `CATEGORY_SLOTS` (D4,
    recomendación).
  - La inicial usa `font-extrabold` (R1).

### Perfil (R5–R12)

- **Cápsula «Añadir mascota» (R5)**.
  - Se usa `Pressable` y no `Button`. El inventario #166 R3 de botones neutros detecta `variant="secondary"` u
    `"outline"`, y #166 R2 inventaría los primarios con labio. Un `Pressable` tonal queda fuera de los dos
    inventarios, y la carta lo declara en la viñeta «Sin labio» (§13).
  - La cápsula no lleva `CONTINUOUS_CORNER`: es `rounded-full` y #62 R14 lo prohíbe en cápsulas.
- **Hero (R6)**.
  - `Card variant="hero"` contiene el anillo (`border-4 border-surface`), y la cámara va en posición absoluta
    dentro del anillo.
  - El control de foto pasa de `Button` a `Pressable` circular. Como el estado deshabilitado deja de venir de
    heroui, se declara con `disabled` y `accessibilityState={{ disabled }}`.
  - `photo-upload-error` sigue fuera de la tarjeta, justo detrás del envoltorio de entrada del hero (R12).
- **Chips (R7)**.
  - El texto del sexo sale de dos llamadas literales a `t()`. `checkUses` cuenta llamadas literales por
    (fichero, clave), así que un mapa indexado `t(SEX_KEYS[sex])` dejaría las filas de la tabla sin uso y
    rompería #65.
  - `font-extrabold` y `gap-1.5` acercan los chips al canvas sin cambiar los huecos de color.
- **Información (R8)**.
  - `Card variant="flat"` sin etiqueta de sección.
  - `InfoRow` gana `tone`. La clase de valor es una sola constante ternaria, así el recuento de
    `text-accent-strong` del fichero sube exactamente en uno por esta rama.
  - La fila del collar deja de mostrar el modelo y muestra el estado (P6).
- **Última señal (R9)**.
  - Función pura local `formatLastSignal`, con `nowMs` y `locale` inyectados para que el test controle reloj e
    idioma.
  - Reutiliza las claves `map.justNow`, `map.agoMinutes` y `map.agoHours`, que ya existen.
  - La fecha corta usa `toLocaleDateString` del `locale` activo (`es-MX` / `en-US`). Los literales de
    requirements R9 están medidos con Node 20.20.2.
- **Rejilla 2×2 (R10)**.
  - El componente local `ProfileTile` concentra el único `style={CONTINUOUS_CORNER}` del fichero, y el
    candado #62 R14 de Perfil baja de 8 a 1.
  - Las filas se construyen a partir de una lista que depende de si hay mascota. La rejilla agrupa de dos en
    dos, de modo que sin mascota queda una fila con un tile.
  - Si se prefiere escribir las filas a mano en JSX, vale igual siempre que se cumplan los testIDs y los
    recuentos de hijos de R10.1.
- **Cuenta (R11)**.
  - `Switch` de heroui-native con etiqueta fija (C10/P13).
  - Su estado accesible ya lo expone heroui como `accessibilityState: { checked, disabled }` en el nodo con
    `testID`. Es el mismo patrón que asevera `src/screens/geofences/index.test.tsx`.
  - La fila de idioma es un `Pressable` de fila completa que muestra el idioma ACTUAL (P14).
- **Entrada (R12)**.
  - Se reutiliza `HomeEntrance` de Inicio (escalonado de 60 ms y desplazamiento de 12). No se crea un
    componente nuevo.
  - Los índices son fijos para que el orden visual no dependa de si hay mascota.

### Perfil píxel exacto (decisión del 2026-10-13)

Fuente: el artboard Perfil del canvas aprobado (`Perfil.dc.html`, 390 pt de ancho). El esquema es el mismo
que usan #174 y #175:

1. **Tamaños de letra**: los de la escala de Tailwind conservan su clase. Los que caen fuera llevan un token
   `--text-N: Npx;` en `@theme` (R2.3: `--text-13` y `--text-26`). Nada de clases arbitrarias.
2. **Margen lateral y hueco**: 20 y el `gap` del artboard en el estilo del contenedor (R17), con la excepción
   nombrada de `docs/conventions.md` y de la regla 6 de la carta (R14.5).
3. **Espaciados fuera de la escala de 4**: clases fraccionarias de `--spacing` (4 × N), que el spike de §5
   valida: `py-2.75` = 11, `py-1.25` = 5, `p-0.75` = 3 y `-bottom-0.5` = −2. Sin tokens.
4. **Interlineado y tracking**: el artboard no fija ni `line-height` ni `letter-spacing` en ningún elemento
   propio de Perfil, así que no hay tokens. La diferencia con el 1.4 que hereda el canvas está en
   requirements §Fuera de alcance.
5. **Radios**: `--radius-hero` y `--radius-tile` (R2). Un radio nuevo seguiría `--radius-<px>`; Perfil no
   necesita más.

**Tamaño de caja**: el canvas no lleva un reset global. El `span` del avatar es content-box (96 + 2 × 4 = 104
por fuera) y los `<button>` son border-box (la cámara mide 34 por fuera con el borde de 3 dentro). RN siempre
es border-box: el anillo `border-4` alrededor del `PetAvatar` de 96 da 104, y la cámara `size-8.5` con
`border-3` da 34. Las dos coinciden.

Elemento a elemento. «Cambios» cuenta las decisiones que cambia #173 sobre lo que ya fijaba esta spec; en los
elementos repetidos se cuenta por hijo del contenedor, con un único molde para todos:

| Elemento | Artboard | Clase o estilo | Cambios | R |
|---|---|---|---|---|
| Contenedor `screen-profile` | padding lateral 20, gap 14 | `padding: 20`, `gap: 14` (los insets no cambian) | 2 | R17 |
| Cápsula «Añadir mascota» | — | la de R5 | 0 | R5 |
| Switcher, cada `pet-chip-<id>` (un hijo por mascota) | anillo de 3 de hueco y 2 de borde | `p-0.75` (antes `p-0.5`) | 1 por hijo | R4.2 |
| `profile-pet-card` | radio 28, padding 18, gap 10 | la variante `hero` de R3 con `items-center gap-2.5` | 0 | R6.1 |
| `profile-pet-avatar-ring` | borde 4 | `border-4 border-surface` | 0 | R6.1 |
| `change-photo` | 34 con borde 3, desplazado −2 | `-bottom-0.5 -right-0.5 size-8.5 … border-3` (antes `bottom-0 right-0`) | 2 | R6.2 |
| `profile-pet-name` | 26, peso 900 | `text-26 font-black` (antes `text-2xl`) | 1 | R6.1 |
| Cada chip de `profile-pet-chips` (hasta 4 hijos) | padding 5 × 10, texto 12 / 800 | `px-2.5 py-1.25` (antes `py-1`) | 1 por hijo | R7.2 |
| `pet-info-card` | padding 4 × 14 | variante `flat` | 0 | R8.1 |
| Cada `InfoRow` (4 hijos; el último sin borde) | padding vertical 11 | `py-2.75` (antes `py-3`) | 1 por hijo | R8.2 |
| Tiles de la rejilla (4 hijos) | — | los de R10 | 0 | R10 |
| `me-card` | padding 4 × 14 | variante `flat` sin `pt-3` | 1 | R11.1 |
| `me-identity` | padding vertical 10, gap 10 | `gap-2.5 py-2.5` | 2 | R11.5 |
| `me-avatar` | 34 | `size-8.5` | 1 | R11.5 |
| `me-avatar-initials` | 13, peso 800 | `text-13 font-extrabold` | 2 | R11.5 |
| `me-identity-text` (2 hijos) | sin hueco | `flex-1` (sin `gap-1`) | 1 | R11.5 |
| Nombre (hijo 0) | 14, peso 800 | `text-sm font-extrabold` | 2 | R11.5 |
| Correo (hijo 1) | 12, peso 400 | `text-xs font-normal text-muted` | 1 | R11.5 |
| `me-card-skeleton` | — (no dibujado) | `my-2.5 h-9`: ocupa los 56 pt de la fila de identidad en RN | 2 | R11.5 |
| `me-card-state` | — (no dibujado) | `py-2.5`, como una fila | 1 | R11.5 |
| `theme-row` y `language-toggle` (2 hijos) | padding vertical 10 | `py-2.5` (antes `py-3`) | 1 por hijo | R11.2, R11.3 |

La cabecera compartida de las pestañas (#168) y la tab bar no entran.

### Catálogo, tabla de copy y candados (R13, R15)

- El catálogo baja de forma neta en 1 clave (−4 +3). La tabla `R7_PROFILE` sube 4 (−4 +8): además de las 3
  claves nuevas, Perfil pasa a usar `addPet.male`, `addPet.female`, `map.justNow`, `map.agoMinutes` y
  `map.agoHours`.
- Todos los candados globales se mueven **por delta** con `// #173 Rn`. La tabla está en requirements R15.1.
  #170 ya está en la base (`57a61544`). Si #171 mergea antes, H0 vuelve a medir la base y el delta no cambia.

## 2. Bloque canónico de enmienda (R14)

Fuente única del bloque. `src/__tests__/profile-canvas-fidelity.test.ts` lo extrae de este fichero buscando
el cercado que empieza en la línea ```` ```markdown ```` seguida del título, sustituye `<FEATURE>` y
`<QUÉ CAMBIA>` y lo compara con cada documento sin la línea de firma.

```markdown
## Enmienda #173 — Perfil fiel al canvas

`mobile-tab-screens-canvas-fidelity` (#173) modifica una decisión que esta spec
dejó aprobada. La spec de origen es `specs/mobile-tab-screens-canvas-fidelity/`;
el detalle de la enmienda está en su `requirements.md` §R14.

- Spec enmendada: `<FEATURE>`
- Qué cambia: `<QUÉ CAMBIA>`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #173 (lista
  en su `tasks.md`).

- [X] Enmienda #173 aprobada por humano
```

**Dónde va cada bloque**:

- En las nueve specs, al **final** del documento.
- En la carta, también al final, tras la última sección `## Enmienda` que exista al arrancar. En la base es
  `## Enmienda #168 — título grande en Salud, Nutrición y Perfil`. Si #171 añade la suya antes, va
  detrás de esa.
- La firma se comprueba con `/- \[[ xX]\] Enmienda #173 aprobada por humano/`, para que el test no se ponga
  rojo cuando el humano firma.

**Cambios de texto en la carta** (además del bloque): ver requirements R14.2. Son aditivos. Las frases que ya
aseveran #62 R4 y #166 R4 se conservan literalmente.

## 3. Archivos afectados (todos en presentación)

Rutas relativas a `mobile-pet-tracker/` salvo las de `docs/` y `specs/`.

| Archivo | Cambio | R |
|---|---|---|
| `assets/fonts/Inter-ExtraBold.ttf` | nuevo (binario, OFL) | R1 |
| `src/app/_layout.tsx` | `+1` entrada en `useFonts` | R1 |
| `src/theme/global.css` | `--font-extrabold`, `--radius-hero`, `--radius-tile`, `--text-13`, `--text-26` | R1, R2 |
| `src/components/card.tsx` | variantes `hero` y `flat` | R3 |
| `src/components/pet-switcher.tsx` | prop `variant`, rama `avatars` | R4 |
| `src/screens/profile/index.tsx` | cápsula, hero, chips, info, `formatLastSignal`, `ProfileTile`, cuenta, entrada, contenedor | R5–R12, R17 |
| `src/i18n/catalog.ts` | −4 / +3 claves en `en` y `es` | R13 |
| `src/theme/__tests__/font-registration.test.ts` | describe `#173 R1` | R1 |
| `src/theme/__tests__/global-css.test.ts` | describes `#173 R2` y `#173 R2.3` | R2 |
| `src/components/__tests__/card.test.tsx` | describe `#173 R3` | R3 |
| `src/components/__tests__/pet-switcher.test.tsx` | describe `#173 R4` | R4 |
| `src/screens/profile/index.test.tsx` | dobles (`mockPetSwitcher`, `mockHomeEntrance`, `Plus`, `Camera`) y describes R4–R12 nuevos o reescritos; `it` de métricas de `R2: estructura Figma` | R4–R12, R17 |
| `src/__tests__/profile-canvas-fidelity.test.ts` | nuevo: inventarios R2–R4, enmiendas R14, grep-limpio R15 | R2–R4, R14, R15 |
| `src/__tests__/consistency-classnames.test.ts` | deltas #62 R7, #62 R14, #98 R10, #166 R2 | R10, R15 |
| `src/__tests__/legibility-classnames.test.ts` | delta #61 R4 | R15 |
| `src/__tests__/design-drift.test.ts` | #68 E1 | R7 |
| `src/__tests__/ui-copy-table.ts` | `R7_PROFILE` −4 +8 | R13 |
| `src/__tests__/ui-language.test.ts` | longitud `R7_PROFILE` | R13 |
| `src/providers/__tests__/language-provider.test.tsx` | longitud del catálogo, describe `#173 R13` | R13 |
| `docs/ui-guidelines.md` | regla 2, regla 6 (excepción), §12, §13, decisión 4, viñeta de enums y bloque | R14 |
| `docs/conventions.md` | excepción nombrada en «Dimensiones de pantalla uniformes» (si no la trajo #174 o #175) | R14 |
| `specs/mobile-ui-language/design.md` | 4 filas retiradas y sección §2.<n> | R13 |
| `specs/{mobile-pets-profile,mobile-ui-legibility-polish,mobile-ui-consistency-polish,mobile-ui-language,mobile-tab-headers-canvas,mobile-device-pairing,mobile-geofences,mobile-chunky-cta,mobile-home-weekly-activity}/requirements.md` | bloque de enmienda al final | R14 |

No cambian:

- los otros cinco consumidores de `PetSwitcher` y los 19 de `Card`;
- `src/screens/home/home-entrance.tsx`;
- `screens/map`.

## 4. Alternativas descartadas

- **Color de avatar por hash del id** (D4): da un color estable aunque cambie el orden, pero obliga a calcular
  el hash en el test para saber qué color esperar. Por índice, el test asevera literales. Queda como casilla
  de reversión.
- **Extraer `fmtAgo` de `screens/map` a un módulo compartido**: obliga a tocar el mapa y su suite, que
  importa un módulo nativo. Las claves `map.*` ya se comparten; la función son ocho líneas.
- **Cuatro tiles literales en JSX con `style={CONTINUOUS_CORNER}` cada uno**: el candado #62 R14 pasaría de
  8 a 4 en vez de a 1, y las clases se repetirían cuatro veces. `ProfileTile` es local, no exportado y
  tiene un solo uso: no es abstracción especulativa.
- **`className` sobre `Card` existente en vez de variantes nuevas**: tailwind-merge no quita `shadow-sm` ni
  fusiona `rounded-hero` con `rounded-card`. Además, cambiar el default tocaría 19 consumidores (contradice
  D8).
- **`Button` de heroui para la cápsula y la cámara**: el `Button` trae padding, altura y estados propios, que
  habría que pisar con `className`. Con `variant="secondary"` entraría además en el inventario #166 R3 de
  botones neutros.
- **Fila de tema con `Pressable` y etiqueta que cambia** (estado actual): descartada por el humano
  (C10/P13).
- **Clave nueva `profile.language` («Idioma»)** para la fila de idioma: añade copy sin necesidad. Se
  recomienda `profile.changeLanguage`; queda como casilla.

## 5. Spike uniwind: tamaños numéricos

Hecho el 2026-10-13, **fuera del árbol**, antes de fijar las clases de §1 «Perfil píxel exacto». Veredicto:
**funciona**.

**Versiones**: `uniwind@1.11.0` (con `@tailwindcss/node@4.3.2` y `@tailwindcss/oxide@4.3.2`) y
`tailwindcss@4.3.3`. Son las del `bun.lock` de la branch y las instaladas en `node_modules/` del árbol
principal; el worktree de #173 no tiene `node_modules/`.

**Cómo compila uniwind**: `withUniwindConfig` (en `metro.config.js`, `cssEntryFile: './src/theme/global.css'`)
instala `uniwind/dist/metro/transformer.cjs`. Cuando Metro transforma el fichero de entrada CSS, llama a
`compileCSS`. Esa función pasa el CSS por `@tailwindcss/node.compile` y lo escanea con `oxide` (`@source` más
`**/*` bajo `src/theme/`). Después `compileNativeCSS` lo convierte en un objeto JS
`{ vars, stylesheet }` que se inyecta con `Uniwind.__reinit`. En jest no interviene: `\.css$` va a
`test/css-stub.js`, así que los tests solo ven la cadena `className`.

**Método**:

1. Copia en el scratchpad (`…/scratchpad/spike173/`) de `src/theme/global.css` de la branch, con
   `node_modules` enlazado al del árbol principal. En `@theme` se añadieron `--text-13: 13px;`,
   `--text-15: 15px;`, `--text-26: 26px;`, `--tracking-title: -0.02em;` y `--radius-hero: 28px;`.
2. `src/probe.tsx` con las clases `text-13 text-15 text-26 text-2xs text-sm size-8.5 size-9 size-13 p-4.5
   py-2.75 px-5 gap-3.5 tracking-title rounded-hero`.
3. Script de Node que carga `transformer.cjs` con su ruta real, expone `compileCSS` y lo ejecuta con
   `UniwindBundlerConfig.fromMetroConfig({ cssEntryFile }, 'android')` y `cwd` = la copia. Sale con
   `exit=0`.

**Resultado** (extracto literal del objeto generado):

| Clase | Entrada generada | Variable resuelta | px |
|---|---|---|---|
| `text-13` | `["fontSize", vars["--text-13"]]`, `["--uniwind-em", vars["--text-13"]]` | `"--text-13": vars => 13` | 13 |
| `text-15` | ídem con `--text-15` | `"--text-15": vars => 15` | 15 |
| `text-26` | ídem con `--text-26` | `"--text-26": vars => 26` | 26 |
| `size-8.5` | `["width", vars["--spacing"] * 8.5]` (y `height`) | `"--spacing": vars => 4` | 34 |
| `size-9` | `["width", vars["--spacing"] * 9]` | ídem | 36 |
| `size-13` | `["width", vars["--spacing"] * 13]` | ídem | 52 |
| `p-4.5` | `["padding", vars["--spacing"] * 4.5]` | ídem | 18 |
| `py-2.75` | `["paddingVertical", vars["--spacing"] * 2.75]` | ídem | 11 |
| `px-5` | `["paddingHorizontal", vars["--spacing"] * 5]` | ídem | 20 |
| `gap-3.5` | `["gap", vars["--spacing"] * 3.5]` | ídem | 14 |
| `tracking-title` | `["letterSpacing", vars["--tracking-title"]]` | `vars["--uniwind-em"] * -0.02` | −0,02 × tamaño de letra |
| `rounded-hero` | `["borderRadius", vars["--radius-hero"]]` | `"--radius-hero": vars => 28` | 28 |

**Diferencia con las clases de la escala**: `text-sm` genera además
`["lineHeight", vars["--tw-leading"] ?? vars["--text-sm--line-height"]]`. Un `--text-N` sin
`--text-N--line-height` **no** emite `lineHeight`: el texto usa la altura de línea por defecto de RN salvo que
el elemento lleve `leading-*`. Por eso §1 «Perfil píxel exacto» solo define `--text-N--line-height` donde el
artboard fija una altura de línea, y no donde no la fija.

**Letter-spacing en em**: uniwind lo convierte (`--uniwind-em` × factor, y `--uniwind-em` lo fija cada
`text-*`). Se puede usar, pero solo si un elemento local de Perfil lo necesita; ver §1.

**Segunda sonda** (misma copia, `src/probe2.tsx`), para las clases fraccionarias y negativas de §1 «Perfil
píxel exacto». Sale con `exit=0` y todas generan su entrada:

| Clase | Propiedad | px |
|---|---|---|
| `-bottom-0.5` | `bottom` | −2 |
| `-right-0.5` | `right` | −2 |
| `p-0.75` | `padding` | 3 |
| `py-1.25` | `paddingVertical` | 5 |
| `py-2.5` | `paddingVertical` | 10 |
| `gap-2.5` | `gap` | 10 |
| `h-9` | `height` | 36 |
| `border-3` | `borderWidth` | 3 |

Las clases de espaciado de la escala bastan con valores fraccionarios y negativos: no hacen falta tokens de
espaciado.
