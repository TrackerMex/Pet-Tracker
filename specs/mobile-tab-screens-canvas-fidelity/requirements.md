---
feature: "mobile-tab-screens-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Requisitos — [[mobile-tab-screens-canvas-fidelity]] (#173)

Perfil queda fiel al canvas aprobado. La feature añade también los cimientos F0 que Salud y Nutrición
reutilizarán en features hermanas:

- el peso Inter-ExtraBold;
- los radios `hero` y `tile`;
- dos variantes nuevas de `Card`;
- la variante `avatars` de `PetSwitcher`.

Se rige por `docs/ui-guidelines.md` (carta de UI).

## §0. Contexto y decisiones del humano (no se reabren)

- **Base medida**: worktree `Pet-Tracker-wt-173`, branch `feature/173-mobile-tab-screens-canvas-fidelity`,
  HEAD `57a61544` (merge de `origin/main` `788d1f89`, que trae #169 y #170). Todas las medidas de §1 son
  de ese HEAD.
- **Fuentes**: `progress/explore_mobile-tab-screens-canvas-fidelity.md` §8 (decisiones cerradas por el humano)
  y el canvas aprobado (memoria «Canvas propuesta UI aprobado»).
- **Alcance**: la pantalla Perfil (`mobile-pet-tracker/src/screens/profile/index.tsx`) y los cimientos F0.
  Salud y Nutrición quedan fuera (§Fuera de alcance).
- **Decisiones cerradas por el humano** (la spec las ejecuta; no se reabren):
  - D1: el peso ExtraBold se carga con `useFonts` y se expone como `--font-extrabold`.
  - D2: tokens nuevos `--radius-hero` (28 px) y `--radius-tile` (18 px). Esto enmienda la §12 de la carta
    y el candado #62 R4.
  - D8: una variante de `Card` sin sombra, solo para Perfil. Los consumidores actuales de `Card` no cambian.
  - D3: `PetSwitcher` gana la variante `avatars`: avatar de 40 pt, color por mascota y anillo doble. Solo
    Perfil la usa. Los demás consumidores siguen con la apariencia por defecto.
  - C10/P13/P14:
    - fila «Usar tema oscuro» con un `Switch` de heroui-native y etiqueta fija;
    - fila de idioma que muestra el idioma ACTUAL como valor y lo alterna al pulsarla.
  - P9: se retiran las etiquetas de sección «Información» y «Cuenta». Esto enmienda #61 R9.
  - P6: la fila del collar muestra un estado (vinculado / sin collar) y no el modelo.
  - El chip de sexo se localiza.
  - Se autorizan cambios estructurales en Perfil.
  - **Píxel exacto** (2026-10-13, cerrada en §Preguntas abiertas): Perfil queda con las medidas del artboard
    del canvas, con los mismos tokens y clases que #174 (Alertas). Directiva literal del humano: «si, dale
    aclara en las otras sesiones que el diseño final debe de quedar como el artifac». Lo ejecutan R2.3,
    R4.2, R6, R7.2, R8.2, R11.5, R14.5 y R17. Las diferencias que quedan están en §Fuera de alcance, cada
    una con su causa.
- **Convenciones de esta spec**:
  - Las rutas de código son relativas a `mobile-pet-tracker/`. Las rutas `specs/…`, `docs/…` y
    `feature_list.json` son relativas a la raíz del repo.
  - Las anclas se escriben como `grep -cF '<literal>' <ruta>` con la salida esperada. Nunca se dan números
    de línea.
  - Todo copy nuevo es una **propuesta**: lleva su literal ES y EN y su casilla en §Aprobación.
  - Los tests de componentes siguen RNTL 14:
    - `await fireEvent.press(...)` y `await act(...)`;
    - `includeHiddenElements: true` para nodos ocultos a accesibilidad;
    - `within(x)` no incluye la raíz `x`.
- **Jest no se ejecutó durante la redacción**: el worktree no tiene `node_modules` y el coordinador lo
  ordenó así. Las medidas que solo jest da quedan marcadas «pendiente de medir» en `tasks.md` §H0.
- **Dependencias**: cero dependencias nuevas de npm. El único fichero binario nuevo es
  `assets/fonts/Inter-ExtraBold.ttf` (R1).

## §1. Medidas en la base (`57a61544`)

Comandos desde `mobile-pet-tracker/`. «Al cerrar» es el valor que debe dar el mismo comando con #173 terminada.

| # | Comando | Base | Al cerrar | Lo mueve |
|---|---|---|---|---|
| M1 | `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx` | 8 | 1 | R10 |
| M2 | `grep -cF 'ChevronRight' src/screens/profile/index.tsx` | 5 | 0 | R10 |
| M3 | `grep -cF 'bg-accent-soft' src/screens/profile/index.tsx` | 1 | 0 | R6 |
| M4 | `grep -cF 'text-accent-strong' src/screens/profile/index.tsx` | 1 | 3 | R5, R6, R8, R11 |
| M5 | `grep -cF 'border-b-4 border-black/25' src/screens/profile/index.tsx` | 1 | 0 | R5 |
| M6 | `grep -cF 'rounded-card' src/screens/profile/index.tsx` | 2 | 1 | R6 |
| M7 | `grep -cF 'hitSlop={TOUCH_SLOP}' src/screens/profile/index.tsx` | 3 | 4 | R5, R6, R10, R11 |
| M8 | `grep -cF 'variant="secondary"' src/screens/profile/index.tsx` | 4 | 0 | R6, R11 |
| M9 | `grep -cF "t('profile.useLightTheme')" src/screens/profile/index.tsx` | 1 | 0 | R11 |
| M10 | `grep -cF "t('profile.information')" src/screens/profile/index.tsx` | 1 | 0 | R8 |
| M11 | `grep -cF "t('profile.account')" src/screens/profile/index.tsx` | 1 | 0 | R11 |
| M12 | `grep -cF "t('profile.gpsSettings')" src/screens/profile/index.tsx` | 1 | 0 | R10 |
| M13 | `grep -cF 'pet.sex' src/screens/profile/index.tsx` | 1 | 2 | R7 |
| M14 | `grep -cF "import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx` | 1 | 0 | R10 |
| M15 | `grep -cF "import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx` | 0 | 1 | R5, R6, R10 |
| M16 | `grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4], // #41 R9; #168 R6" src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M17 | `grep -cF 'toBe(31 + 1 + 4 + 1)' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M18 | `grep -cF 'toBe(13 + 1 + 1 + 1 + 1 + 1 + 1)' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M19 | `grep -cF 'expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1);' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M20 | `grep -cF 'expect(accentSoftCount).toBe(16 + 2 + 1 - 1);' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M21 | `grep -cF "[join('screens', 'profile', 'index.tsx')]: 1," src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M22 | `grep -cF 'expect(count(/\bborder-b-4\b/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M23 | `grep -cF 'expect(count(/border-black\/25/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M24 | `grep -cF "[join('screens', 'profile', 'index.tsx'), 1]," src/__tests__/legibility-classnames.test.ts` | 1 | 0 | R15 |
| M25 | `grep -cF 'expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1 + 16);' src/__tests__/ui-language.test.ts` | 1 | 0 | R13 |
| M26 | `grep -c "file: 'src/screens/profile/index.tsx'" src/__tests__/ui-copy-table.ts` | 31 | 35 | R13 |
| M27 | `grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx` | 1 | 0 | R13 |
| M28 | `grep -cF "expect(rawEnumList).toContain('\`pet.sex\`');" src/__tests__/design-drift.test.ts` | 1 | 0 | R7 |
| M29 | `grep -cF "'screens/profile/index.tsx': 2," src/__tests__/design-drift.test.ts` | 1 | 1 | — (no cambia, R11) |
| M30 | `grep -cF -- "--font-black: 'Inter-Black';" src/theme/global.css` | 1 | 1 | — |
| M31 | `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` | 0 | 1 | R1 |
| M32 | `grep -cF -- '--radius-card: 20px;' src/theme/global.css` | 1 | 1 | — |
| M33 | `grep -cF -- '--radius-hero: 28px;' src/theme/global.css` | 0 | 1 | R2 |
| M34 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | 0 | 1 | R2 |
| M35 | `ls assets/fonts/ \| grep -c 'Inter-'` | 5 | 6 | R1 |
| M36 | `grep -cF 'border-2 border-accent bg-accent-soft p-1' src/components/pet-switcher.tsx` | 1 | 1 | — (default intacta, R4) |
| M37 | `grep -cF 'toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1);' src/__tests__/consistency-classnames.test.ts` | 1 | 0 | R15 |
| M38 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | 0 | 1 | R2 |
| M39 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | 0 | 1 | R2 |
| M40 | `grep -cF -- '--text-2xs: 10px;' src/theme/global.css` | 1 | 1 | — (punto de inserción de R2.3) |
| M41 | `grep -cF 'padding: 24,' src/screens/profile/index.tsx` | 1 | 0 | R17 |
| M42 | `grep -cF 'gap: 16,' src/screens/profile/index.tsx` | 1 | 0 | R17 |
| M43 | `grep -cF 'padding: 20,' src/screens/profile/index.tsx` | 0 | 1 | R17 |
| M44 | `grep -cF 'gap: 14,' src/screens/profile/index.tsx` | 0 | 1 | R17 |
| M45 | `grep -cF 'text-2xl' src/screens/profile/index.tsx` | 1 | 0 | R6 |
| M46 | `grep -cF 'py-3' src/screens/profile/index.tsx` | 2 | 0 | R8, R11 |
| M47 | `grep -cF 'size-10' src/screens/profile/index.tsx` | 1 | 0 | R11 |
| M48 | `grep -cF 'text-lg font-bold text-foreground' src/screens/profile/index.tsx` | 1 | 0 | R11 |
| M49 | `grep -cF 'h-12 w-full rounded-xl' src/screens/profile/index.tsx` | 1 | 0 | R11 |
| M50 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/conventions.md` | 0 | 1 | R14 |
| M51 | `grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/ui-guidelines.md` | 0 | 1 | R14 |

Notas de medida:

- **R7_PROFILE**: la tabla `R7_PROFILE` de `src/__tests__/ui-copy-table.ts` tiene **53** filas en la base
  (31 de `src/screens/profile/index.tsx`).
- **Valores globales en la base**:
  - `style={CONTINUOUS_CORNER}`: 37 en total (`31 + 1 + 4 + 1`).
  - Suma de la tabla `directUses` de `#62 R14`: 39 (`33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1`).
  - `rounded-xl bg-accent(?=…)`: 19.
  - `bg-accent-soft`: 18.
  - `text-accent-strong`: 18 en suma de `inkSites`.
  - `border-b-4` y `border-black/25`: 19 cada uno.
  - Los da la fórmula de cada candado. Nadie los reescribe a mano.
- **#170 (PR #213) ya está en la base**: añadió `+ 7, // #170 R1` como último término de `englishKeys`
  (M27), ocupa §2.26 de `specs/mobile-ui-language/design.md` y sumó una esquina continua en
  `alert-detail` (M17, M37).
- **Si #171 mergea antes que #173**: la base se vuelve a medir en H0 y se conserva el **delta** de #173
  (R15).
- **M50 y M51 con #174 o #175 delante**: las dos excepciones de R14.5 las comparten #173, #174 y #175, y las
  lleva quien mergea primero. Si en H0 ya dan `1`, el paso de R14.5 no hace nada y el valor al cerrar sigue
  siendo `1`.

## Requisitos funcionales

Cada R-id nombra el test que lo prueba y su `describe`. Las clases son literales exactos: los tests las
comparan escritas en el propio test, nunca importando una constante de producción.

### R1 — Peso Inter-ExtraBold (F0, D1)

- **R1.1** THE SYSTEM SHALL versionar `assets/fonts/Inter-ExtraBold.ttf`.
  - El fichero es el `Inter-ExtraBold.ttf` del release Inter **4.001** (rsms/inter, `extras/ttf/`, licencia
    OFL), el mismo release que los cinco existentes.
  - Su contenido no es idéntico en bytes a ninguno de los cinco `Inter-*.ttf` existentes.
- **R1.2** THE SYSTEM SHALL registrar el peso en el `useFonts({...})` de `src/app/_layout.tsx`, entre
  `'Inter-Bold'` y `'Inter-Black'`, con el literal
  `'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),`.
- **R1.3** THE SYSTEM SHALL declarar `--font-extrabold: 'Inter-ExtraBold';` en el bloque `@theme` de
  `src/theme/global.css`, justo después de `--font-bold`. Así la clase `font-extrabold` resuelve a esa familia.
- **Test**: `src/theme/__tests__/font-registration.test.ts`, describe nuevo
  `#173 R1: registra Inter-ExtraBold como sexto peso`. Comprueba:
  - `existsSync` del fichero;
  - que el fichero no es igual en bytes a ninguno de los cinco existentes;
  - el literal `require` en `_layout.tsx`;
  - el literal `--font-extrabold` en `global.css`.

  El describe `R3` existente y su array `interFonts` no se tocan.

### R2 — Radios `hero` y `tile` y tamaños de letra `13` y `26` (F0, D2, píxel exacto)

- **R2.1** THE SYSTEM SHALL declarar `--radius-hero: 28px;` y `--radius-tile: 18px;` en el bloque `@theme` de
  `src/theme/global.css`, justo después de `--radius-card: 20px;`.
- **R2.2** THE SYSTEM SHALL usar las clases solo donde esta spec lo indica, en ficheros de producción
  (excluye `*.test.ts(x)` y `__tests__/`):
  - `rounded-hero`: exactamente en `components/card.tsx` (variante `hero`, R3) y
    `screens/profile/index.tsx` (`profile-hero-skeleton`, R6);
  - `rounded-tile`: exactamente en `screens/profile/index.tsx` (`ProfileTile`, R10).
- **R2.3** THE SYSTEM SHALL declarar `--text-13: 13px;` y `--text-26: 26px;` en el bloque `@theme` de
  `src/theme/global.css`, justo después de `--text-2xs: 10px;` y en ese orden.
  - No se declara `--text-13--line-height` ni `--text-26--line-height`: la clase solo fija `fontSize`
    (spike de `design.md` §5).
  - Los tamaños de la escala de Tailwind conservan su clase: `text-xs` 12, `text-sm` 14, `text-base` 16,
    `text-lg` 18, `text-2xl` 24 y `text-3xl` 30.
  - Las clases arbitrarias (`text-[13px]`) siguen prohibidas (R15.2).
- **R2.4** THE SYSTEM SHALL usar las clases nuevas solo en `screens/profile/index.tsx` entre los ficheros de
  producción (mismo alcance que R2.2):
  - `text-26`: en `profile-pet-name` (R6.1);
  - `text-13`: en `me-avatar-initials` (R11.5).
- **Tests**:
  - `src/theme/__tests__/global-css.test.ts`, describe nuevo `#173 R2: tokens de radio hero y tile`. Usa el
    mismo parser que ya verifica `'radius-card': '20px'` y comprueba
    `toMatchObject({ 'radius-hero': '28px', 'radius-tile': '18px' })`.
  - Mismo fichero, describe nuevo `#173 R2.3: tamaños de letra 13 y 26`. Con el mismo parser comprueba
    `toMatchObject({ 'text-13': '13px', 'text-26': '26px' })`. Se escribe en el rojo de T2.
  - `src/__tests__/profile-canvas-fidelity.test.ts`, describe `#173 R2.4: inventario de tamaños nuevos`.
    Compara la lista de ficheros de producción que casan `/\btext-26\b/` y `/\btext-13\b/` con
    `['screens/profile/index.tsx']`.
    - El `it` de `text-26` se escribe en el rojo de R6.
    - El de `text-13` se escribe en el rojo de R11.
  - `src/__tests__/profile-canvas-fidelity.test.ts` (nuevo), describe `#173 R2: inventario de radios nuevos`.
    Compara la lista de ficheros que casan `/\brounded-hero\b/` y `/\brounded-tile\b/` con las del R2.2,
    ordenadas.
    - El `it` de `rounded-hero` se escribe en el rojo de R6, cuando ya existen sus dos sujetos.
    - El de `rounded-tile` se escribe en el rojo de R10.

    Ver `tasks.md`: en T2 los sujetos aún no existen.

### R3 — Variantes `hero` y `flat` de `Card` (F0, D8)

- **R3.1** THE SYSTEM SHALL ampliar `variant` de `src/components/card.tsx` a
  `'surface' | 'accent' | 'secondary' | 'hero' | 'flat'`, con estas clases base:
  - `hero`: `'rounded-hero bg-surface-secondary p-4.5'`;
  - `flat`: `'rounded-card border border-border bg-surface px-3.5 py-1'`.

  Ninguna de las dos lleva `shadow-*`.
- **R3.2** THE SYSTEM SHALL conservar sin cambios las tres variantes existentes:
  - el literal de cada una;
  - la variante por defecto `surface`;
  - la fusión `twMerge(variantClassNames[variant], className)`;
  - `StyleSheet.flatten([CONTINUOUS_CORNER, style])`.
- **R3.3** WHEN Perfil renderiza, THE SYSTEM SHALL usar `variant="hero"` exactamente 1 vez y `variant="flat"`
  exactamente 2 veces en todo `src/` de producción, las tres en `screens/profile/index.tsx`.
- **Tests**:
  - `src/components/__tests__/card.test.tsx`, describe nuevo `#173 R3: variantes hero y flat sin sombra`.
    - `hero` sin `className` da `'rounded-hero bg-surface-secondary p-4.5'`.
    - `hero` con `className="items-center gap-2.5"` da `'rounded-hero bg-surface-secondary p-4.5 items-center gap-2.5'`.
    - `flat` sin `className` da `'rounded-card border border-border bg-surface px-3.5 py-1'`.
    - `flat` con `className="pt-3"` da `'rounded-card border border-border bg-surface px-3.5 py-1 pt-3'`.
    - Las dos variantes reciben `style` con `borderCurve: 'continuous'`.
    - Ninguna clase contiene `shadow`.
  - `src/__tests__/profile-canvas-fidelity.test.ts`, describe `#173 R3: Card hero y flat solo en Perfil`,
    con el recuento de R3.3.
    - El `it` de `hero` se escribe en el rojo de R6.
    - El de `flat` se escribe en el rojo de R11, cuando su recuento pasa de 1 a 2.

### R4 — `PetSwitcher` con variante `avatars` (F0, D3)

- **R4.1** THE SYSTEM SHALL añadir a `src/components/pet-switcher.tsx` la prop opcional
  `variant?: 'default' | 'avatars'`, con `'default'` por defecto.
  - WHEN `variant` se omite o vale `'default'`, el render es idéntico al actual: chips con
    `border-2 border-accent bg-accent-soft p-1` y `Avatar` de heroui.
  - Los describe existentes de `src/components/__tests__/pet-switcher.test.tsx` siguen verdes sin tocarlos.
- **R4.2** WHEN `variant="avatars"`, THE SYSTEM SHALL renderizar el `View` interior del `ScrollView` con
  `className="flex-row gap-1.5"`. Por cada mascota en la posición `i` del array `pets`:
  - **El `Pressable`**:
    - conserva `testID="pet-chip-<id>"`, `accessibilityRole="button"`, `accessibilityLabel={pet.name}`,
      `accessibilityState={{ selected }}` y el `onPress` que llama a `onSelect(pet.id)`;
    - `className`:
      - seleccionado: `'rounded-full border-2 border-accent p-0.75'`;
      - no seleccionado: `'rounded-full border-2 border-transparent p-0.75'`;
      - el anillo mide 3 pt de hueco más 2 pt de borde, como el artboard (Salud dibuja
        `box-shadow: 0 0 0 3px` del fondo y `0 0 0 5px` del accent);
    - tiene **exactamente un** hijo: el `View` `testID="pet-avatar-<id>"`.
  - **El `View` `pet-avatar-<id>`**:
    - `className` `` `size-10 items-center justify-center overflow-hidden rounded-full ${CATEGORY_SLOTS[slot].surface}` ``,
      con `slot = (['amber', 'violet', 'blue', 'green', 'rose'] as const)[i % 5]`;
    - tiene **exactamente un** hijo:
      - IF `pet.photoUrl` no es nulo: `` <PetAvatar name={pet.name} photoUrl={pet.photoUrl} size={40} cacheKey={pet.id} testID={`pet-avatar-image-${pet.id}`} /> ``;
      - IF `pet.photoUrl` es nulo: `` <Text testID={`pet-avatar-fallback-${pet.id}`}> `` con
        `className` `` `text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}` `` y texto
        `pet.name.charAt(0).toUpperCase()`.
  - La variante `avatars` no usa el `Avatar` de heroui.
- **R4.3** WHEN Perfil renderiza el switcher, THE SYSTEM SHALL pasarle `variant="avatars"`.
  - Ningún otro fichero de producción contiene `variant="avatars"`.
  - Los otros cinco consumidores de `PetSwitcher` no cambian.
- **Tests**:
  - `src/components/__tests__/pet-switcher.test.tsx`, describe nuevo `#173 R4: variante avatars`. Usa
    `await fireEvent.press` y cubre una rama y combinación por `it`:
    - **Seis mascotas, `pet-1` seleccionada**:
      - los `className` de `pet-avatar-pet-1`…`pet-6` usan `bg-category-amber`, `bg-category-violet`,
        `bg-category-blue`, `bg-category-green`, `bg-category-rose` y `bg-category-amber` (la sexta da la
        vuelta);
      - el chip `pet-1` lleva la clase de seleccionado y los otros cinco la de no seleccionado;
      - `accessibilityState` es `{ selected: true }` o `{ selected: false }` según corresponda.
    - **Una sola mascota**: exactamente un `pet-chip-*` y su avatar en `bg-category-amber`.
    - **Foto frente a sin foto** (fixture mixto): con `photoUrl` existe `pet-avatar-image-<id>` y no existe
      `pet-avatar-fallback-<id>`; sin `photoUrl`, al revés. El fallback de una mascota llamada `luna` muestra
      `L` con `text-sm font-extrabold text-category-amber-strong`.
    - **Recuento por hijos**: cada `pet-chip-<id>` tiene `children.length === 1` y cada `pet-avatar-<id>`
      también.
    - **Pulsar**: pulsar `pet-chip-pet-2` llama a `onSelect('pet-2')`.
    - **Sin variante**: con `variant` omitido no existe ningún `pet-avatar-<id>` y el chip seleccionado
      contiene `bg-accent-soft p-1`.
  - `src/screens/profile/index.test.tsx`: el doble de `../../components/pet-switcher` pasa a ser
    `mockPetSwitcher = jest.fn(...)`, con el mismo render y el patrón `mockHomeEntrance` de
    `src/screens/login/index.test.tsx`. El describe nuevo `#173 R4: Perfil pide la variante avatars` comprueba
    `mockPetSwitcher.mock.lastCall?.[0].variant` `toBe('avatars')`.
  - `src/__tests__/profile-canvas-fidelity.test.ts`, describe `#173 R4: avatars solo en Perfil`: la lista de
    ficheros de producción que contienen `variant="avatars"` es `['screens/profile/index.tsx']`.

### R5 — Cápsula «Añadir mascota» en la cabecera

- **R5.1** THE SYSTEM SHALL sustituir el `Button` primario `profile-add-pet` de la cabecera, el que lleva
  `rounded-xl bg-accent border-b-4 border-black/25`.
  - El sustituto es un `Pressable` con `testID="profile-add-pet"`, `accessibilityRole="button"`,
    `hitSlop={TOUCH_SLOP}`, `className="h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5"` y
    sin `style={CONTINUOUS_CORNER}` (es cápsula).
  - Ocupa el mismo sitio: segundo hijo de la fila de cabecera, detrás de `profile-title`.
- **R5.2** THE SYSTEM SHALL dar a la cápsula exactamente dos hijos, en este orden:
  - un `View` `testID="profile-add-pet-icon"` oculto a accesibilidad
    (`accessibilityElementsHidden` e `importantForAccessibility="no-hide-descendants"`) que contiene
    `<Plus size={16} color={accentStrong} />`;
  - un `Text` `className="text-sm font-extrabold text-accent-strong"` con `t('profile.addPet')`. Es la única
    llamada a esa clave en el fichero.
- **R5.3** WHEN el usuario pulsa la cápsula, THE SYSTEM SHALL hacer `router.push('/pets/add')`.
- **R5.4** THE SYSTEM SHALL pedir los colores con una sola llamada:
  `useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground'])`,
  desestructurada como `[blue, green, amber, violet, accentStrong, accentForeground]`. `'muted'` sale de la
  llamada porque sin `ChevronRight` no queda uso.
- **Test**: `src/screens/profile/index.test.tsx`, describe nuevo `#173 R5: cápsula de añadir mascota`. Comprueba:
  - el `className` literal y `hitSlop` `toEqual(TOUCH_SLOP)`;
  - que `children` son los dos de R5.2, buscando el icono con `includeHiddenElements: true`;
  - el texto `Añadir mascota` (es) y `Add pet` (en);
  - que la pulsación hace `router.push('/pets/add')`.

  El doble de `reicon-react-native` del fichero gana
  `Plus: icon('profile-icon-plus')` y `Camera: icon('profile-icon-camera')`.

### R6 — Hero de la mascota: `Card` `hero`, anillo y cámara superpuesta

- **R6.1** WHEN hay mascota activa, THE SYSTEM SHALL renderizar
  `<Card variant="hero" testID="profile-pet-card" className="items-center gap-2.5">`. Su `className` efectivo
  es `'rounded-hero bg-surface-secondary p-4.5 items-center gap-2.5'` y tiene **exactamente tres** hijos, en
  orden:
  1. `View` `testID="profile-pet-avatar-ring"` con `className="relative rounded-full border-4 border-surface"`;
  2. `Text` `profile-pet-name` con `className="text-26 font-black text-foreground"` (antes `text-2xl`; 26 pt
     del artboard, R2.3);
  3. `View` `profile-pet-chips` (R7).
- **R6.2** THE SYSTEM SHALL dar al anillo exactamente dos hijos:
  - el `PetAvatar` actual (`size={96}`, `cacheKey={pet.id}`, `testID="profile-pet-avatar"`);
  - el control `change-photo`, un `Pressable` con:
    - `testID="change-photo"`, `accessibilityRole="button"` y
      `accessibilityLabel={t('profile.changePhoto')}` (única llamada a esa clave);
    - `accessibilityState={{ disabled: photoUploading }}`, `disabled={photoUploading}` y
      `hitSlop={TOUCH_SLOP}`;
    - `className="absolute -bottom-0.5 -right-0.5 size-8.5 items-center justify-center rounded-full border-3 border-surface-secondary bg-accent"`
      (sobresale 2 pt del anillo, como en el artboard);
    - un único hijo `<Camera size={16} color={accentForeground} />`.
  - El `Button` `change-photo` anterior (`rounded-xl bg-accent-soft`, `variant="secondary"`) desaparece.
- **R6.3** IF la subida falla, THE SYSTEM SHALL pintar `photo-upload-error` (sin cambios de clase ni de copy)
  como el hermano **inmediatamente siguiente** del bloque del hero en el contenido del `ScrollView`. Ese
  bloque es `profile-pet-card` hasta R12 y `profile-entrance-hero` desde R12. El verde de R12 reescribe esta
  aserción.
- **R6.4** WHILE la mascota carga, THE SYSTEM SHALL pintar `profile-hero-skeleton` con
  `className="h-52 w-full rounded-hero"`. Su clase efectiva es `'skeleton__root h-52 w-full rounded-hero'`.
  `pet-info-skeleton` conserva `rounded-card`.
- **Test**: `src/screens/profile/index.test.tsx`. El describe `#168 R4` se reescribe como
  `#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara`. Comprueba:
  - las clases y el orden de hijos de R6.1 y R6.2;
  - que `change-photo` no tiene `variant`;
  - `accessibilityState` `{ disabled: false }` en reposo y `{ disabled: true }` durante la subida (dos `it`,
    con el doble de subida existente del describe `R7: cambiar foto`);
  - el índice de `photo-upload-error` igual al índice del bloque del hero + 1 (R6.3);
  - el skeleton de R6.4.

  El describe `R7: cambiar foto` conserva sus casos y los adapta a `Pressable`: se pulsa con `await` y el
  estado deshabilitado se lee de `accessibilityState`.

### R7 — Chips con sexo localizado

- **R7.1** THE SYSTEM SHALL calcular el texto del chip `profile-pet-chip-sex` así:
  - IF `pet.sex === 'male'`: `t('addPet.male')`;
  - IF `pet.sex === 'female'`: `t('addPet.female')`;
  - en cualquier otro caso (`null` o cualquier otro valor), `null`: el chip no se pinta.

  Las dos llamadas son literales `t('addPet.male')` y `t('addPet.female')`, una vez cada una. No vale un mapa
  indexado.
- **R7.2** THE SYSTEM SHALL pintar los chips así:
  - contenedor `profile-pet-chips`: `className="flex-row flex-wrap justify-center gap-1.5"`;
  - cada chip: `className` `` `rounded-full px-2.5 py-1.25 ${surface}` `` (5 × 10 pt del artboard);
  - el texto de cada chip: `` `text-xs font-extrabold ${ink}` ``.

  Huecos, testIDs, orden y reglas de los otros tres chips (esterilizado, edad, peso) no cambian.
- **Tests**: `src/screens/profile/index.test.tsx`, describe `#168 R5` reescrito como
  `#168 R5 (enmendado por #173 R7): chips pastel con sexo localizado`.
  - El helper `expectProfileChip168` pasa a esperar `rounded-full px-2.5 py-1.25 <surface>` y
    `text-xs font-extrabold <ink>`.
  - Un `it` por combinación:

    | Idioma | `'male'` | `'female'` |
    |---|---|---|
    | es | `Macho` | `Hembra` |
    | en | `Male` | `Female` |

  - `null` y `'other'`: no existe `profile-pet-chip-sex` y existen los otros tres.
  - Ningún texto del árbol es el valor crudo `female` ni `male`.
  - Los casos actuales (sin peso, edad no finita, no esterilizado, 0 meses / 0 kg) se conservan con las
    clases nuevas.
- **R7.3** THE SYSTEM SHALL enmendar la viñeta de enums crudos de la carta (R14): `pet.sex` sale de la lista.
  - `src/__tests__/design-drift.test.ts`:
    - `#68 E1` pasa a `` expect(rawEnumList).not.toContain('`pet.sex`'); ``;
    - el título del `it` pasa a `'conserva crudos solo los tres ámbitos aún pendientes'`;
    - el mismo `it` asevera, sobre `corollary` (no sobre `rawEnumList`),
      `` expect(corollary).toContain('`pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`'); ``.
  - La viñeta de la carta se edita en el verde de R7, no en R14: el test de R7.3 la necesita.
  - La viñeta queda así:
    - la lista anterior a `. Siguen` pasa a `` `document.type`, `foodType`, `activityLevel` ``;
    - la frase nueva va **detrás** de la frase de `device.connectivity` (#68 R16), fuera del tramo que #68
      E1 extrae como `rawEnumList` (todo lo anterior a `'. Siguen'`).

    Si la frase cayera antes de `. Siguen`, `not.toContain` se pondría rojo.

### R8 — Tarjeta de información `flat` sin etiqueta, con estado del collar

- **R8.1** WHEN hay mascota activa, THE SYSTEM SHALL renderizar `<Card variant="flat" testID="pet-info-card">`
  sin `className`.
  - Clase efectiva: `'rounded-card border border-border bg-surface px-3.5 py-1'`.
  - Hijos: **exactamente cuatro** `InfoRow` (raza, microchip, collar, última señal) y ninguna etiqueta de
    sección.
  - `t('profile.information')` desaparece del fichero.
- **R8.2** THE SYSTEM SHALL cambiar el `Text` de valor de `InfoRow`:
  - clase por defecto: `'flex-1 text-right text-sm font-bold text-foreground'`;
  - nueva prop `tone?: 'default' | 'accent'`; con `tone="accent"`, la clase es
    `'flex-1 text-right text-sm font-bold text-accent-strong'`;
  - el `View` raíz de `InfoRow` pasa de `py-3` a `py-2.75` (11 pt del artboard):
    - sin `isLast`: `'flex-row items-center justify-between gap-4 border-b border-separator py-2.75'`;
    - con `isLast`: `'flex-row items-center justify-between gap-4 py-2.75'`.

  El separador por `isLast` y la etiqueta `text-sm font-normal text-muted` no cambian.
- **R8.3** THE SYSTEM SHALL pintar la fila del collar con la etiqueta `t('profile.gpsDevice')` (sin cambio):
  - IF `pet.device` no es nulo: valor `t('profile.gpsLinked')` con `tone="accent"`;
  - IF `pet.device` es nulo: valor `t('profile.gpsNoCollar')` con `tone` por defecto.

  El modelo (`pet.device.model`) ya no se pinta.
- **Tests**: `src/screens/profile/index.test.tsx`, describe nuevo `#173 R8: información en Card flat`.
  - `children.length === 4` y ningún hijo es texto de sección.
  - `queryByText('Información')` y `queryByText('Information')` son `null`.
  - Con collar: texto `Vinculado` (es) / `Linked` (en) con la clase accent. Sin collar: `Sin collar` /
    `No collar` con la clase foreground. Un `it` por idioma y rama.
  - `queryByText('PetTrack One')` es `null`.
  - La fila de raza (`(await findByText('Raza')).parent`) y la de última señal
    (`getByText('Última señal').parent`) tienen, con `toBe`, las dos clases de fila de R8.2.
  - El describe `#61 R9` se sustituye por `#61 R9 (enmendado por #173 R8): pet-info-card no lleva etiqueta de sección`,
    que comprueba lo mismo que este R8.
  - `R2: estructura Figma` actualiza:
    - la cuenta de `No registrado` del fixture nulo: de 4 a 3;
    - `PetTrack One`, que pasa a `Vinculado`.
  - `#62 R6` (última fila sin separador) sigue sin cambios.

### R9 — Última señal relativa

- **R9.1** THE SYSTEM SHALL calcular el valor de la fila `t('profile.lastSignal')` con una función local no
  exportada de `src/screens/profile/index.tsx`:

  ```
  formatLastSignal(iso: string | null, nowMs: number, t: ReturnType<typeof useTranslate>, locale: string): string | null
  ```

  - Se llama con `Date.now()` en el render y con el `locale` de `useLocale()`.
  - Con `s = Math.floor((nowMs - Date.parse(iso)) / 1000)`:
    - IF `iso` es `null`: `null` (la fila pinta `t('profile.notRegistered')`, como hoy);
    - IF `s < 60`, incluido negativo (reloj adelantado): `t('map.justNow')`;
    - IF `60 <= s < 3600`: `t('map.agoMinutes', { minutes: Math.floor(s / 60) })`;
    - IF `3600 <= s < 86400`: `t('map.agoHours', { hours: Math.floor(s / 3600) })`;
    - IF `s >= 86400` y el año local de `iso` es el de `nowMs`:
      `new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })`;
    - IF `s >= 86400` y el año es distinto:
      `new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`.
  - No se importa `fmtAgo` de `screens/map` (arrastraría el módulo nativo de mapas).
- **Test**: `src/screens/profile/index.test.tsx`, describe nuevo `#173 R9: última señal relativa`.
  - `jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-10-13T12:00:00.000Z'))`, restaurado en
    `afterEach`.
  - Un `it.each` por idioma con estas filas (`lastCommunicationAt` → es / en):

    | `lastCommunicationAt` | es | en |
    |---|---|---|
    | `2026-10-13T11:59:30.000Z` | `Justo ahora` | `Just now` |
    | `2026-10-13T12:05:00.000Z` | `Justo ahora` | `Just now` |
    | `2026-10-13T11:59:01.000Z` | `Justo ahora` | `Just now` |
    | `2026-10-13T11:59:00.000Z` | `hace 1 min` | `1m ago` |
    | `2026-10-13T11:15:00.000Z` | `hace 45 min` | `45m ago` |
    | `2026-10-13T11:00:01.000Z` | `hace 59 min` | `59m ago` |
    | `2026-10-13T11:00:00.000Z` | `hace 1 h` | `1h ago` |
    | `2026-10-13T06:30:00.000Z` | `hace 5 h` | `5h ago` |
    | `2026-10-12T12:00:01.000Z` | `hace 23 h` | `23h ago` |
    | `2026-10-12T12:00:00.000Z` | `12 oct` | `Oct 12` |
    | `2026-08-21T12:00:00.000Z` | `21 ago` | `Aug 21` |
    | `2025-12-30T12:00:00.000Z` | `30 dic 2025` | `Dec 30, 2025` |

    Medido con Node 20.20.2 ICU, `es-MX` y `en-US`, TZ UTC. Las horas 12:00Z mantienen día y año en
    cualquier TZ entre −11 y +11.
  - `null` pinta `No registrado` / `Not registered`.
  - Ningún test de la base asevera el formato absoluto: `grep -c 'toLocaleString' src/screens/profile/index.test.tsx`
    da `0`.

### R10 — Rejilla 2×2 de accesos

- **R10.1** THE SYSTEM SHALL sustituir las cuatro filas de navegación (`documents-link`, `pairing-link`,
  `geofences-link`, `reminders-link`) por una rejilla `View` `testID="profile-links"` `className="gap-2"`:
  - **Con mascota activa**: dos filas.
    - `profile-links-row-0` (`className="flex-row gap-2"`) con `[documents-link, pairing-link]`.
    - `profile-links-row-1` (mismas clases) con `[geofences-link, reminders-link]`.
  - **Sin mascota activa**: una sola fila `profile-links-row-0` con `[reminders-link]`, que ocupa el ancho
    entero gracias a `flex-1`.
- **R10.2** THE SYSTEM SHALL pintar cada acceso con un componente local no exportado `ProfileTile`, que es la
  **única** fuente de `style={CONTINUOUS_CORNER}` del fichero. Props:
  `{ testID: string; slot: CategorySlot; icon: ReactNode; label: string; onPress: () => void }`. Renderiza
  un `Pressable` con:
  - `testID={testID}`, `accessibilityRole="button"`, `hitSlop={TOUCH_SLOP}`, `style={CONTINUOUS_CORNER}`;
  - `className` `` `flex-1 gap-1.5 rounded-tile p-3 ${CATEGORY_SLOTS[slot].surface}` ``;
  - **exactamente dos** hijos:
    - `View` `` testID={`${testID}-icon`} `` oculto a accesibilidad, que contiene `icon`;
    - `Text` con `className` `` `text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}` `` y `label`.

  Sin `ChevronRight`, sin tile interior y sin `-tile`.
- **R10.3** THE SYSTEM SHALL pasar a cada acceso estos datos (tamaño de icono 22, color `*-strong` del hueco):

  | testID | hueco | icono | etiqueta | destino |
  |---|---|---|---|---|
  | `documents-link` | `blue` | `<FileText size={22} color={blue} />` | `t('profile.documents')` | `` `/pets/${pet.id}/docs` `` |
  | `pairing-link` | `green` | `<Wifi size={22} color={green} />` | `t('profile.gpsCollar')` | `'/pairing'` |
  | `geofences-link` | `amber` | `<MapIcon size={22} color={amber} />` | `t('geofences.title')` | `` `/pets/${pet.id}/geofences` `` |
  | `reminders-link` | `violet` | `<Bell size={22} color={violet} />` | `t('profile.reminders')` | `'/reminders'` |

  - `t('profile.gpsSettings')` desaparece del fichero.
  - El import de reicon queda en
    `import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';`.
- **Tests**: `src/screens/profile/index.test.tsx`.
  - `#168 R6` se reescribe como `#168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2`,
    con un `it.each` por fila de la tabla R10.3 que comprueba:
    - el `className` literal, por ejemplo `'flex-1 gap-1.5 rounded-tile p-3 bg-category-blue'`;
    - `style` `{ borderCurve: 'continuous' }` y `hitSlop` `toEqual(TOUCH_SLOP)`;
    - `children.length === 2`;
    - `<id>-icon` oculto, con `includeHiddenElements: true`; contiene `profile-icon-<glifo>` con
      `size` 22 y `color` `category-<hueco>-strong`;
    - el `className` y el texto de la etiqueta;
    - la navegación con `await fireEvent.press`.
  - Hay un `it` por rama de la rejilla:
    - con mascota: `profile-links` tiene 2 hijos y cada fila tiene 2;
    - sin mascota: 1 fila con 1 hijo, que es `reminders-link`.
  - `#41 R9` y `R10 (mobile-device-pairing)` cambian sus expectativas de clase y copy a las de esta tabla; el
    orden `getAllByTestId(/-link$/)` sigue siendo documents, pairing, geofences, reminders.
  - `#61 R10` (hitSlop de documents y reminders) sigue sin cambios.
  - No queda ningún `-link-tile`: `queryAllByTestId(/-link-tile$/, { includeHiddenElements: true })` tiene
    longitud 0.
  - En `src/__tests__/consistency-classnames.test.ts`, el `it` `'profile usa cuatro ChevronRight de reicon'`
    pasa a `'profile usa los glifos de reicon sin ChevronRight (#173 R10)'`. Espera el import nuevo y
    `profile.match(/ChevronRight/g)` `toBeNull()`.

### R11 — Tarjeta de cuenta `flat`: interruptor de tema y fila de idioma

- **R11.1** THE SYSTEM SHALL renderizar `<Card variant="flat" testID="me-card">` sin `className`.
  - Clase efectiva: `'rounded-card border border-border bg-surface px-3.5 py-1'`.
  - No lleva etiqueta de sección: `t('profile.account')` desaparece del fichero.
  - Sus hijos son, en orden:

    | Estado de `me.data` | Hijos |
    |---|---|
    | `undefined` | `[me-card-skeleton, theme-row, language-toggle]` |
    | `kind === 'ok'` | `[me-identity, theme-row, language-toggle]` |
    | otro `kind` que no sea `'unauthorized'` | `[me-card-state, theme-row, language-toggle]` |
    | `kind === 'unauthorized'` | `[theme-row, language-toggle]` |

  - `me-identity`, `me-avatar`, `me-card-skeleton` y `me-card-state` toman las medidas del artboard (R11.5).
- **R11.2** THE SYSTEM SHALL pintar `theme-row` así:
  - `View` `testID="theme-row"`,
    `className="flex-row items-center justify-between gap-4 border-t border-separator py-2.5"`;
  - **exactamente dos** hijos:
    - `Text` `className="text-sm font-semibold text-foreground"` con la etiqueta fija;
    - `Switch` de `heroui-native` con:
      - `testID="theme-toggle"`, `isSelected={theme === 'dark'}`;
      - `onSelectedChange={(selected) => switchTheme(selected ? 'dark' : 'light')}`;
      - `accessibilityLabel` igual a la etiqueta;
      - `hitSlop={TOUCH_SLOP}`.
  - La etiqueta sale de **una** llamada `t('profile.useDarkTheme')` guardada en una constante. Se lee igual en
    claro y en oscuro.
  - `t('profile.useLightTheme')` desaparece del fichero.
- **R11.3** THE SYSTEM SHALL pintar `language-toggle` como `Pressable` con:
  - `testID="language-toggle"`, `accessibilityRole="button"`;
  - `accessibilityLabel={changeLanguageLabel}` y `accessibilityValue={{ text: currentLanguageName }}`;
  - `className="flex-row items-center justify-between gap-4 border-t border-separator py-2.5"`;
  - `onPress={() => setLanguage(language === 'es' ? 'en' : 'es')}`;
  - **exactamente dos** hijos:
    - `Text` `className="text-sm font-semibold text-foreground"` con `changeLanguageLabel`;
    - `Text` `testID="language-value"` `className="text-sm font-extrabold text-accent-strong"` con
      `currentLanguageName`.

  Las constantes valen:
  - `changeLanguageLabel = t('profile.changeLanguage')`;
  - `currentLanguageName = language === 'es' ? t('profile.languageSpanish') : t('profile.languageEnglish')`.

  El valor es el idioma **actual**, no el de destino.
- **R11.4** THE SYSTEM SHALL dejar `profile-sign-out` donde está y sin cambios. #87 R19 sigue con
  `'screens/profile/index.tsx': 2,`.
- **R11.5** THE SYSTEM SHALL pintar la identidad y sus estados con las medidas del artboard: filas con 10 pt
  de padding vertical, avatar de 34 pt, iniciales de 13, nombre de 14 y correo de 12.
  - No cambian: los testIDs, los textos, la regla que decide si se pinta `me-avatar`, sus props
    `accessibilityElementsHidden` e `importantForAccessibility` ni el orden de hijos.
  - `me-identity` tiene uno o dos hijos (`me-avatar` si se pinta, y `me-identity-text`); `me-avatar` tiene
    **exactamente un** hijo (`me-avatar-initials`); `me-identity-text` tiene **exactamente dos** hijos
    `Text` (nombre y correo).

  | Nodo | `className` |
  |---|---|
  | `me-identity` | `flex-row items-center gap-2.5 py-2.5` |
  | `me-avatar` | `size-8.5 items-center justify-center rounded-full bg-default` |
  | `me-avatar-initials` | `text-13 font-extrabold text-foreground` |
  | `me-identity-text` | `flex-1` |
  | hijo 0 de `me-identity-text` (nombre) | `text-sm font-extrabold text-foreground` |
  | hijo 1 de `me-identity-text` (correo) | `text-xs font-normal text-muted` |
  | `me-card-skeleton` | `my-2.5 h-9 w-full rounded-xl` (efectiva `'skeleton__root my-2.5 h-9 w-full rounded-xl'`) |
  | `me-card-state` | `py-2.5 font-normal text-muted` |
- **Tests**: `src/screens/profile/index.test.tsx`, describe nuevo `#173 R11: cuenta en Card flat con Switch e idioma`.
  - Un `it` por fila de la tabla de R11.1 con `children` exactos.
  - **Tema**:
    - claro: `getByTestId('theme-toggle').props.accessibilityState.checked` `toBe(false)`;
    - oscuro (`mockTheme = 'dark'`): `.checked` `toBe(true)`;
    - no se asevera `disabled`: R11.2 no pasa `isDisabled` y heroui-native 1.0.8 deja entonces
      `accessibilityState.disabled` en `undefined` (primitivo `Switch.Root`), así que un
      `toEqual({ checked, disabled: false })` daría rojo. `geofence-editor` sí lo asevera porque pasa
      `isDisabled` booleano;
    - la etiqueta es `Usar tema oscuro` en los dos temas y `Use dark theme` en inglés.
  - **Idioma**:
    - es: `language-value` muestra `Español` y `accessibilityValue` es `{ text: 'Español' }`;
    - en: `English` y `{ text: 'English' }`;
    - pulsar en es llama `setLanguage('en')`; pulsar en en llama `setLanguage('es')`.
  - Los tres `it` de `R4: toggle persiste` se conservan y pasan a `await fireEvent.press`.
  - `#65 R14` se reescribe como `#65 R14 (enmendado por #173 R11)`: tras pulsar, `language-value` repinta el
    idioma nuevo sin reiniciar.
  - `theme-row` y `language-toggle` se comprueban con `toBe` sobre las clases de R11.2 y R11.3.
  - **Identidad (R11.5)**: el describe `#168 R7` se reescribe como
    `#168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard`.
    - Conserva sus ramas (con y sin `me-avatar`) y su técnica (`profileChild`, `includeHiddenElements: true`
      para `me-avatar` y `me-avatar-initials`).
    - Cambia las clases que asevera con `toBe` por las de la tabla de R11.5.
    - Suma un `it` para `me-card-skeleton` (`me.data` `undefined`) y otro para `me-card-state` (otro `kind`),
      cada uno con `toBe` sobre su clase.

### R12 — Entrada escalonada (rise)

- **R12.1** THE SYSTEM SHALL envolver cuatro bloques en `HomeEntrance`, importado de `'../home/home-entrance'`:

  | `testID` | `index` | Bloque | Cuándo se pinta |
  |---|---|---|---|
  | `profile-entrance-hero` | 0 | exactamente `[profile-pet-card]` | con mascota |
  | `profile-entrance-info` | 1 | exactamente `[pet-info-card]` | con mascota |
  | `profile-entrance-links` | 2 | exactamente `[profile-links]` | siempre |
  | `profile-entrance-account` | 3 | exactamente `[me-card]` | siempre |

  - Los índices son fijos: sin mascota, links y account conservan 2 y 3.
  - Cabecera, aviso de notificaciones, switcher, skeletons, errores, `photo-upload-error` y
    `profile-sign-out` no se envuelven.
- **Test**: `src/screens/profile/index.test.tsx`, describe nuevo `#173 R12: entrada escalonada`.
  - Doble `jest.mock('../home/home-entrance', …)` con `mockHomeEntrance`, copiado del patrón de
    `src/screens/login/index.test.tsx`. Pinta un `View` con `testID` y `children` y registra props.
  - Con mascota: el mapa `testID → index` es exactamente el de la tabla y cada envoltorio tiene
    `children.length === 1` con el bloque esperado.
  - Sin mascota: solo `profile-entrance-links` → 2 y `profile-entrance-account` → 3.

### R13 — Catálogo y tabla de copy

- **R13.1** THE SYSTEM SHALL retirar de `src/i18n/catalog.ts`, en `en` y `es`, las claves que solo usaba
  Perfil:
  - `profile.information`;
  - `profile.account`;
  - `profile.gpsSettings`;
  - `profile.useLightTheme`.
- **R13.2** THE SYSTEM SHALL añadir en `en` y `es` estas claves. Los literales son **propuestas** pendientes de
  la casilla de §Aprobación:

  | Clave | `en` | `es` | Usada en |
  |---|---|---|---|
  | `profile.gpsLinked` | `Linked` | `Vinculado` | R8 |
  | `profile.gpsNoCollar` | `No collar` | `Sin collar` | R8 |
  | `profile.gpsCollar` | `GPS collar` | `Collar GPS` | R10 |

- **R13.3** THE SYSTEM SHALL mover la longitud del catálogo por delta (−4 +3 = −1). En
  `src/providers/__tests__/language-provider.test.tsx`, el término `- 4 + 3 // #173 R13` se añade como
  **último** término de la fórmula de `englishKeys`. En la base va detrás de `+ 7, // #170 R1` (M27).
- **R13.4** THE SYSTEM SHALL actualizar `R7_PROFILE` en `src/__tests__/ui-copy-table.ts`.
  - Quita las filas de `profile.information`, `profile.gpsSettings`, `profile.account` y
    `profile.useLightTheme` (−4).
  - Añade, con `// #173 R13` y `file: 'src/screens/profile/index.tsx'` (+8):
    - `profile.gpsLinked`, `profile.gpsNoCollar`, `profile.gpsCollar`;
    - `addPet.male`, `addPet.female`;
    - `map.justNow`, `map.agoMinutes`, `map.agoHours`.
  - La fórmula de `src/__tests__/ui-language.test.ts` pasa de
    `toHaveLength(35 - 1 + 2 + 1 + 16)` a `toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8)` con
    `// #173 R13`: 53 → **57**.
  - `SCREEN_FILES` no cambia: Perfil ya está.
  - Las claves de idioma (`profile.changeLanguage`, `profile.languageSpanish`, `profile.languageEnglish`)
    siguen fuera de la tabla, como en la base.
- **R13.5** THE SYSTEM SHALL documentar el cambio en `specs/mobile-ui-language/design.md`.
  - Las cuatro filas retiradas llevan ` ← retirada por #173 (R13)` tras el code span de la clave, en el
    formato de la fila `map.trackingNeedsCollar` de §2.23.
  - Se añade una sección `### §2.<n> — Añadidos por #173 — Perfil fiel al canvas`, donde `<n>` es el
    **siguiente número libre tras §2.26**, que ocupa #170. Lleva las tres filas
    `` | — | `clave` | `en` | `es` | ← añadida por #173 (R13) | ``.
- **Tests**: `src/providers/__tests__/language-provider.test.tsx`, describe nuevo
  `#173 R13: Perfil retira cuatro claves y añade tres`. Comprueba:
  - las tres claves en `en` y `es` con los literales de R13.2;
  - las cuatro retiradas ausentes de los dos idiomas;
  - cada clave nueva con su fila `← añadida por #173 \(R13\)` en el design.md, con el patrón de regex de los
    describe hermanos;
  - cada retirada con `← retirada por #173 \(R13\)`.

  `checkUses(ALL_USES)` cubre las filas de R13.4.

### R14 — Enmiendas a carta y specs aprobadas

- **R14.1** THE SYSTEM SHALL añadir al final de cada fichero de la tabla el bloque canónico de
  `design.md` §2. El bloque se copia del cercado canónico y se sustituyen `<FEATURE>` y `<QUÉ CAMBIA>`. El
  título es `## Enmienda #173 — Perfil fiel al canvas`. En la carta va detrás de la última sección
  `## Enmienda` que exista al arrancar. En la base es
  `## Enmienda #168 — título grande en Salud, Nutrición y Perfil`; si #171 añade la suya antes, va
  detrás de esa.

  | Fichero | `<FEATURE>` | `<QUÉ CAMBIA>` |
  |---|---|---|
  | `docs/ui-guidelines.md` | `ui-guidelines` | ver «Cambios en la carta» |
  | `specs/mobile-pets-profile/requirements.md` | `mobile-pets-profile` | `R2: estructura de Perfil (hero, rejilla, Card flat) y métricas del artboard (padding 20, gap 14); R4: el tema se alterna con un Switch de etiqueta fija` |
  | `specs/mobile-ui-legibility-polish/requirements.md` | `mobile-ui-legibility-polish` | `#61 R9: pet-info-card y me-card dejan de llevar etiqueta de sección` |
  | `specs/mobile-ui-consistency-polish/requirements.md` | `mobile-ui-consistency-polish` | `#62 R4: la escala suma rounded-hero y rounded-tile; #62 R7: Perfil deja ChevronRight; #62 R14: Perfil aplica CONTINUOUS_CORNER una vez (ProfileTile)` |
  | `specs/mobile-ui-language/requirements.md` | `mobile-ui-language` | `#65 R14: la fila de idioma muestra el idioma actual como valor` |
  | `specs/mobile-tab-headers-canvas/requirements.md` | `mobile-tab-headers-canvas` | `#168 R4: profile-pet-card pasa a Card hero con anillo y cámara; #168 R5: chips con sexo localizado y font-extrabold; #168 R6: las filas pasan a tiles en rejilla 2×2; #168 R7: la identidad de la cuenta toma las medidas del artboard` |
  | `specs/mobile-device-pairing/requirements.md` | `mobile-device-pairing` | `R10: la fila de configuración GPS pasa al tile «Collar GPS»` |
  | `specs/mobile-geofences/requirements.md` | `mobile-geofences` | `#41 R9: la fila de zonas seguras pasa a tile de la rejilla` |
  | `specs/mobile-chunky-cta/requirements.md` | `mobile-chunky-cta` | `#166 R2: el primario de Perfil pasa a cápsula tonal sin labio (19 → 18 primarios)` |
  | `specs/mobile-home-weekly-activity/requirements.md` | `mobile-home-weekly-activity` | `#68 E1: pet.sex deja de pintarse crudo` |

- **R14.2** Cambios en la carta (`docs/ui-guidelines.md`). THE SYSTEM SHALL editar el texto vigente
  además de añadir el bloque:
  - **Regla 2** (tokens): se añade al final de la regla una línea propia con el texto
    «Tamaños de letra fuera de la escala de Tailwind (fidelidad al canvas, #173): `--text-13: 13px`, `--text-26: 26px`; cada uno es token aunque se use una vez, porque la clase arbitraria está prohibida.»
    - Si al arrancar ya existe una línea que empieza por «Tamaños de letra fuera de la escala de Tailwind»
      (la puede traer #174 o #175), se añaden a su lista `--text-13: 13px` y `--text-26: 26px`, sin duplicar
      los que ya estén, en vez de crear otra.
  - **§12 Escala de radios**: declara cinco radios. A los tres actuales se suman:
    - `rounded-hero` (28 px): tarjeta hero de Perfil, vía `Card variant="hero"`;
    - `rounded-tile` (18 px): tiles de acceso de Perfil.

    La lista de cápsulas suma la cápsula de acción de cabecera y el botón de cámara.
  - **§13 Botón con cuerpo**: la viñeta «Sin labio» suma el tonal `bg-tab-pill` (cápsula «Añadir mascota»).
  - **Decisión fija 4** (`card.tsx`): las variantes pasan a ser `surface | accent | secondary | hero | flat`.
    `hero` y `flat` no llevan sombra y solo las usa Perfil.
  - **Viñeta de enums crudos**: `pet.sex` sale de la lista, que queda en `document.type`, `foodType` y
    `activityLevel`. La frase «`pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`.» se
    añade como **última línea de la viñeta**, detrás de la que termina en
    `` `src/utils/device-connectivity.ts`. ``, y entera en una sola línea. Tiene que quedar detrás de
    `. Siguen`: el test corta `rawEnumList` en ese punto, y si la frase cae antes, `rawEnumList` vuelve a
    contener `` `pet.sex` `` y el `not.toContain` de R7.3 se pone rojo.
  - **Cambios solo aditivos en §12 y §13**: se conservan **literalmente** las frases que ya aseveran dos `it`
    de `src/__tests__/consistency-classnames.test.ts`:
    - `'declara en la carta los tres radios y prohíbe el drift'` (#62 R4);
    - `'declara las dos recetas y el orden del labio'` (#166 R4).

    Por ejemplo, `` **Control, tile, input, botón y píldora de dato** → `rounded-xl` `` se queda: sigue
    rigiendo fuera de Perfil, y la excepción de los tiles de Perfil entra como frase nueva.
    Ancla: `` grep -cF '**Control, tile, input, botón y píldora de dato** → `rounded-xl`' docs/ui-guidelines.md ``
    da `1` antes y después.
- **R14.3** THE SYSTEM SHALL verificar cada bloque con `src/__tests__/profile-canvas-fidelity.test.ts`
  (el mismo fichero nuevo de R2–R4 y R15), describe `#173 R14: enmiendas`, con la técnica de
  `src/__tests__/hero-header-amendments.test.ts`:
  - extrae el cercado canónico de `specs/mobile-tab-screens-canvas-fidelity/design.md`;
  - sustituye los marcadores y compara el bloque de cada fichero sin la línea de firma;
  - comprueba la firma aparte con la regex tolerante
    `/- \[[ xX]\] Enmienda #173 aprobada por humano/`.

  La regex pasa con la casilla vacía y con la firmada. Un `it` por fila de R14.1.
- **R14.4** THE SYSTEM SHALL comprobar el texto de R14.2 en ese mismo fichero, describe
  `#173 R14: la carta declara los cambios`, con `toContain` sobre:
  - `rounded-hero` y `rounded-tile` dentro de la §12;
  - `bg-tab-pill` dentro de la §13;
  - `hero | flat`;
  - `--text-13: 13px` y `--text-26: 26px`, sobre el texto completo de la carta;
  - los dos textos de R14.5, cada uno en su fichero, con el espacio en blanco normalizado en los dos lados
    (`s.replace(/\s+/g, ' ')`): el texto puede estar partido en varias líneas.

  La frase de `pet.sex` la asevera R7.3.
- **R14.5** THE SYSTEM SHALL añadir la excepción de márgenes que comparten #173, #174 y #175. La lleva quien
  mergea primero: si en H0 el ancla ya da `1`, el paso no hace nada. Al cerrar, cada ancla da `1` (M50, M51).
  - **`docs/conventions.md`**, viñeta «Dimensiones de pantalla uniformes»: párrafo nuevo detrás del párrafo
    A11 (el que termina en `` `reset-password`. ``) y antes de la línea en blanco que precede a
    `## Enmienda #67 — cabecera fotográfica compartida`. Va precedido de una línea en blanco y con sangría de
    dos espacios. Texto literal:

    «**Excepción nombrada (fidelidad al canvas, 2026-10-13)**: una pantalla llevada al canvas aprobado (directiva del humano «el diseño final debe de quedar como el artifact») usa las métricas de su artboard: padding lateral 20 en vez de 24 y el `gap` que el artboard dibuja. El resto de reglas de esta viñeta se mantiene; la spec de cada pantalla nombra sus valores.»
  - **`docs/ui-guidelines.md`**, regla 6: párrafo nuevo detrás del párrafo A11 (el que termina en
    `` `reset-password`. ``) y justo antes de `7. **Estados de carga**`. Va precedido de una línea en blanco
    y con sangría de tres espacios. Texto literal:

    «**Excepción nombrada (fidelidad al canvas, 2026-10-13)**: una pantalla llevada al canvas aprobado usa padding lateral 20 y el `gap` de su artboard; ver conventions.md §Dimensiones, misma excepción.»
  - Se puede partir en varias líneas, pero el marcador en negrita
    `**Excepción nombrada (fidelidad al canvas, 2026-10-13)**` queda entero en una línea: es el ancla de M50 y
    M51.
  - Ningún test existente lee el párrafo A11 de ninguno de los dos ficheros (medido en la base), así que no hay
    candado que mover. La aserción es la de R14.4.

### R15 — Candados globales por delta y grep-limpio

- **R15.1** THE SYSTEM SHALL mover cada candado global **por delta sobre la base medida en H0**. Cada término
  nuevo lleva `// #173 Rn`. Las cifras de la base se escriben tal cual; ninguna se recalcula a mano.

  | Candado (fichero de test) | Cambio | Base → cierre |
  |---|---|---|
  | `#62 R14` fila de Perfil (consistency) | `3 + 1 + 4` → `3 + 1 + 4 - 7, // … #173 R10: ProfileTile` | 8 → 1 |
  | `#62 R14` suma de `directUses` (M37) | `toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 7)`, `// … #173 R10: ProfileTile` | 39 → 32 |
  | `#98 R10` `style={CONTINUOUS_CORNER}` global | `toBe(31 + 1 + 4 + 1 - 7)` | 37 → 30 |
  | `#98 R10` `rounded-xl bg-accent` global | `toBe(13 + 1 + 1 + 1 + 1 + 1 + 1 - 1)` | 19 → 18 |
  | `#98 R10` `bg-accent-soft` (dos sitios, M19 y M20) | `16 + 2 + 1 - 1 - 1` | 18 → 17 |
  | `#166 R2` mapa `expected` | se quita la fila de Perfil (M21); título `'inventaría los dieciocho primarios con labio, fichero a fichero'` | 19 → 18 |
  | `#166 R2` `border-b-4` y `border-black/25` | `toBe(19 - 1)` | 19 → 18 |
  | `#61 R4` fila de Perfil (legibility) | `1 - 1 + 3, // #173 R6 (−1), R5, R8, R11 (+1 cada uno)` | 1 → 3 |
  | `#61 R4` suma de `inkSites` | `+ 2, // #173 R5, R6, R8, R11` como último término | 18 → 20 |
  | `#62 R7` (consistency) | ver R10 | — |
  | `#68 E1` (design-drift) | ver R7.3 | — |
  | `englishKeys` (language-provider) | ver R13.3 | −1 |
  | `R7_PROFILE` (ui-language) | ver R13.4 | 53 → 57 |
  | `R2: estructura Figma`, `it` de métricas (profile) | ver R17 | 24/16 → 20/14 |
  | `#168 R4` clase del nombre (profile) | ver R6.1: `text-2xl` → `text-26` | — |
  | `#168 R5` helper `expectProfileChip168` (profile) | ver R7.2: `py-1` → `py-1.25` | — |
  | `#168 R7` identidad de cuenta (profile) | ver R11.5 | — |

  Si #171 mergea antes y mueve alguno de estos candados, en H0 se vuelve a medir la base y se aplica el
  mismo delta. Las cifras «Base → cierre» de la tabla son las de `57a61544`.
- **R15.2** THE SYSTEM SHALL dejar `screens/profile/index.tsx`, `components/card.tsx` y
  `components/pet-switcher.tsx` sin:
  - clases arbitrarias (`[...]`);
  - colores hex;
  - `StyleSheet.create`;
  - `shadow-*`.

  Se verifica con los candados existentes `R9: mobile-pets-profile sin drift` (design-drift) y con
  `src/__tests__/profile-canvas-fidelity.test.ts`, describe `#173 R15: grep-limpio`. Ese describe
  comprueba que los tres ficheros no casan `/\[[^\]]*\]/` dentro de `className`, `/#[0-9a-fA-F]{3,8}\b/`,
  `/StyleSheet\.create/` ni `/\bshadow-/`. `card.tsx` sí usa `StyleSheet.flatten`, que está permitido.
- **R15.3** THE SYSTEM SHALL dejar M1–M15, M29–M36 y M38–M51 con su valor «Al cerrar» de §1. El reviewer los mide con
  el mismo comando.

### R16 — Prueba de humo en dispositivo (gate humano)

- **R16.1** WHEN la implementación está aprobada por el reviewer, THE SYSTEM SHALL superar una prueba de humo
  manual en **dev build de Android** (nunca Expo Go), en tema claro **y** oscuro y en es y en:
  1. Perfil abre con la entrada escalonada: hero, información, rejilla y cuenta, en ese orden.
  2. El hero muestra el radio grande, el anillo y la cámara superpuesta. Pulsar la cámara abre el selector de
     foto.
  3. Los chips muestran el sexo en el idioma activo.
  4. La fila del collar dice «Vinculado» con collar y «Sin collar» sin él. La última señal es relativa.
  5. La rejilla 2×2 navega a documentos, emparejamiento, zonas seguras y recordatorios.
  6. El switcher muestra avatares de color con el anillo doble en la mascota activa.
  7. El `Switch` alterna el tema con el fundido. La etiqueta no cambia.
  8. La fila de idioma muestra el idioma actual y lo alterna.
  9. Los títulos de los tiles, la cápsula y el idioma se ven en ExtraBold, distinguible de Bold.
  10. Comparada lado a lado con el artboard Perfil del canvas a 390 pt de ancho, solo quedan las diferencias
      de §Fuera de alcance.
- Ninguna prueba contra AWS. La casilla vive en §Aprobación.

### R17 — Contenedor de Perfil con las métricas del artboard (píxel exacto)

- **R17.1** THE SYSTEM SHALL pasar al `contentContainerStyle` del `ScrollView` `screen-profile`
  `{ padding: 20, gap: 14, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }`.
  - Padding lateral 20 y hueco 14 entre bloques: los del artboard. Es la excepción nombrada de
    `docs/conventions.md` (R14.5); las demás pantallas siguen con 24 / 16.
  - `paddingTop` y `paddingBottom` no cambian: dependen del dispositivo y de la tab bar.
- **Test**: `src/screens/profile/index.test.tsx`, describe `R2: estructura Figma`. El `it`
  `'uses uniform dimensions and content-sized skeletons while loading'` se renombra a
  `'uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading'` y su `toEqual`
  pasa a `{ padding: 20, gap: 14, paddingTop: 52, paddingBottom: 120 }` (el doble de insets da 40 y 24). Las
  dos aserciones de skeleton no cambian.

## Fuera de alcance

Cada viñeta está clasificada como **delimitación** (diferencia consciente con el canvas) o **feature
aparte**.

Desde la decisión «Píxel exacto» (§0), espaciado, tamaños, anillo y cámara siguen el artboard. Lo que queda
es esto:

- **Delimitación — altura de línea**:
  - las clases de la escala traen su `lineHeight` (16 en `text-xs`, 20 en `text-sm`) y los tokens de R2.3 no
    fijan ninguno; el canvas hereda 1.4 del `body`;
  - por eso la fila de identidad mide 56 pt y no 54, y los chips unos 26 y no unos 24,5;
  - ningún elemento propio de Perfil fija en el artboard un `line-height` ni un `letter-spacing` propios, así
    que no hay token de interlineado.
- **Delimitación — paleta**: `--border` en claro es 0.07 en el canvas y 0.08 en la app. Igualarlo es un cambio
  global de token, no de Perfil.
- **Delimitación — controles**: el `Switch` (C10) sustituye a la casilla de 20 × 20 del canvas. La altura de
  la fila la marca el control.
- **Delimitación — switcher**: el artboard de Perfil no lo dibuja. El anillo de R4 ocupa sitio en RN (en el
  canvas es `box-shadow`), así que los centros de dos avatares quedan a 56 pt y no a 46.
- **Delimitación — márgenes verticales**: `paddingTop` (`insets.top + 12`) y `paddingBottom`
  (`insets.bottom + 96`) dependen del dispositivo y de la tab bar, no del artboard (R17).
- **Delimitación — hero**: sin sombra en el avatar.
  - El canvas usa `box-shadow: var(--shadow)`: en claro `0 1px 2px rgba(13,17,23,0.04), 0 8px 24px
    rgba(13,17,23,0.06)` y en oscuro `0 1px 2px rgba(0,0,0,0.4)`.
  - Pediría un token por tema, y R15.2 prohíbe `shadow-*` en Perfil (D8).
- **Delimitación — entrada**: escalonado de 60 ms y desplazamiento de 12 pt (`HomeEntrance`), no los 80 ms y
  14 pt del canvas.
- **Delimitación — formato de tiempo**: `fmtAgo` de `screens/map` no se extrae a un módulo compartido. Perfil
  tiene su propia función, que comparte las claves `map.*`.
- **Delimitación — estados no dibujados**: el aviso, «Cerrar sesión» y los estados de carga y de error no
  están en el artboard. Usan las métricas de esta spec.
- **Delimitación — cabecera y tab bar**: el título compartido de las pestañas (#168) y la tab bar no entran.
  El `gap-3` de la fila de cabecera no se ve porque la fila usa `justify-between`.
- **Feature aparte**:
  - Salud y Nutrición fieles al canvas;
  - el vidrio de la tab bar.
- **Fuera de esta feature**: las claves de idioma no entran en la tabla de copy.

## Preguntas abiertas

Cada pregunta trae una recomendación. La casilla de reversión correspondiente está en §Aprobación: si el
humano no la marca, rige la recomendación.

- **Píxel exacto — cerrada (2026-10-13)**. Sin casilla: no se reabre.
  - Pregunta al humano (AskUserQuestion): ¿alinear #173 con el criterio «Píxel exacto» de #174?
  - Opción elegida, literal: «Píxel exacto también (Recommended)», con la descripción «Corrijo la spec de
    #173 antes de que la firmes, reutilizando los mismos tokens o clases que use #174, para que Perfil y
    Alertas queden con las mismas medidas.»
  - Directiva literal: «si, dale aclara en las otras sesiones que el diseño final debe de quedar como el
    artifac».
  - Lo ejecutan R2.3, R4.2, R6, R7.2, R8.2, R11.5, R14.5 y R17.
- **D4 — Color de avatar**: por índice o por hash del id. Recomendado: **por índice**
  (`i % 5`, R4.2). Es estable mientras el orden de `pets` lo sea y se puede probar con literales.
- **D12/P10 — Cerrar sesión**: el canvas no lo muestra. Recomendado: **mantenerlo** tal cual (R11.4).
- **D14 — Temas del smoke**: recomendado **claro y oscuro** (R16).
- **P5 — Etiqueta del tile de emparejamiento**: clave nueva `profile.gpsCollar` («Collar GPS» / «GPS collar»)
  o reutilizar `profile.gpsDevice` («Dispositivo GPS» / «GPS device»). Recomendado: **clave nueva**.
- **P7 — Última señal**: recomendado **relativa** con las claves `map.*` y fecha corta a partir de 1 día (R9).
- **P8 — Sexo localizado**: recomendado **reutilizar `addPet.male` / `addPet.female`** («Macho» / «Hembra»).
- **Copy nuevo** (R13.2): `Vinculado`/`Linked`, `Sin collar`/`No collar`, `Collar GPS`/`GPS collar`.
- **Etiqueta de la fila de idioma**: recomendado **reutilizar `profile.changeLanguage`** («Cambiar idioma»).
  La alternativa es crear `profile.language` («Idioma» / «Language»), que es copy nuevo.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Copy nuevo de R13.2 aprobado tal cual (si no, escribir aquí los literales: ____)
- [ ] Revertir D4: color por hash del id en vez de por índice
- [ ] Revertir D12/P10: quitar «Cerrar sesión» de Perfil
- [ ] Revertir D14: smoke solo en tema claro
- [ ] Revertir P5: reutilizar `profile.gpsDevice` en vez de `profile.gpsCollar`
- [ ] Revertir P7: fecha y hora absolutas en vez de relativa
- [ ] Revertir P8: claves nuevas para el sexo en vez de `addPet.*`
- [ ] Revertir etiqueta de idioma: clave nueva `profile.language` en vez de `profile.changeLanguage`
- [ ] Enmiendas R14 revisadas (la firma de cada bloque es `- [ ] Enmienda #173 aprobada por humano`, en su
  fichero)
- [ ] Prueba de humo R16 superada en dev build de Android (fecha: ____, dispositivo: ____, temas: ____)
