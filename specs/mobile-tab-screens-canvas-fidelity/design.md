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

### Catálogo, tabla de copy y candados (R13, R15)

- El catálogo baja de forma neta en 1 clave (−4 +3). La tabla `R7_PROFILE` sube 4 (−4 +8): además de las 3
  claves nuevas, Perfil pasa a usar `addPet.male`, `addPet.female`, `map.justNow`, `map.agoMinutes` y
  `map.agoHours`.
- Todos los candados globales se mueven **por delta** con `// #173 Rn`. La tabla está en requirements R15.1.
  Si #170 (PR #213) o #171 mergean antes, H0 vuelve a medir la base y el delta no cambia.

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

- [ ] Enmienda #173 aprobada por humano
```

**Dónde va cada bloque**:

- En las nueve specs, al **final** del documento.
- En la carta, también al final, tras la última sección `## Enmienda` que exista al arrancar. En la base es
  `## Enmienda #168 — título grande en Salud, Nutrición y Perfil`. Si #170 o #171 añaden la suya antes, va
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
| `src/theme/global.css` | `--font-extrabold`, `--radius-hero`, `--radius-tile` | R1, R2 |
| `src/components/card.tsx` | variantes `hero` y `flat` | R3 |
| `src/components/pet-switcher.tsx` | prop `variant`, rama `avatars` | R4 |
| `src/screens/profile/index.tsx` | cápsula, hero, chips, info, `formatLastSignal`, `ProfileTile`, cuenta, entrada | R5–R12 |
| `src/i18n/catalog.ts` | −4 / +3 claves en `en` y `es` | R13 |
| `src/theme/__tests__/font-registration.test.ts` | describe `#173 R1` | R1 |
| `src/theme/__tests__/global-css.test.ts` | describe `#173 R2` | R2 |
| `src/components/__tests__/card.test.tsx` | describe `#173 R3` | R3 |
| `src/components/__tests__/pet-switcher.test.tsx` | describe `#173 R4` | R4 |
| `src/screens/profile/index.test.tsx` | dobles (`mockPetSwitcher`, `mockHomeEntrance`, `Plus`, `Camera`) y describes R4–R12 nuevos o reescritos | R4–R12 |
| `src/__tests__/profile-canvas-fidelity.test.ts` | nuevo: inventarios R2–R4, enmiendas R14, grep-limpio R15 | R2–R4, R14, R15 |
| `src/__tests__/consistency-classnames.test.ts` | deltas #62 R7, #62 R14, #98 R10, #166 R2 | R10, R15 |
| `src/__tests__/legibility-classnames.test.ts` | delta #61 R4 | R15 |
| `src/__tests__/design-drift.test.ts` | #68 E1 | R7 |
| `src/__tests__/ui-copy-table.ts` | `R7_PROFILE` −4 +8 | R13 |
| `src/__tests__/ui-language.test.ts` | longitud `R7_PROFILE` | R13 |
| `src/providers/__tests__/language-provider.test.tsx` | longitud del catálogo, describe `#173 R13` | R13 |
| `docs/ui-guidelines.md` | §12, §13, decisión 4, viñeta de enums y bloque | R14 |
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
