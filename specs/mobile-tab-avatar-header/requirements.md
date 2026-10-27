---
feature: "mobile-tab-avatar-header"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Requisitos — [[mobile-tab-avatar-header]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
> UI móvil: se rige por [[../../docs/ui-guidelines|ui-guidelines]] (la carta).
> Feature #222, ola 2 de `progress/plan_ui-2026-10-26.md` (gate G1 aprobado el
> 2026-10-27 sobre las cinco artboards congeladas en `canvas/`).

## Contexto y alcance

Hoy Salud, Nutrición y Perfil abren con un título grande («Salud»,
«Nutrición», «Perfil») y, a su lado o debajo, el selector de mascotas. El
título repite lo que ya dice la barra de pestañas y se come una fila entera.
Esta feature:

1. quita el título visible de las tres pestañas;
2. deja el selector de mascotas (avatares de 40) como única fila superior de
   Salud y Nutrición, **fija** (opción A del plan) y pintada encima del scroll
   con vidrio plano y línea inferior;
3. en Perfil, pone el selector `glass` a la izquierda y la cápsula «Añadir
   mascota» (con texto) a la derecha, en la misma fila superior del hero, que
   sigue desplazándose con la foto;
4. conserva un encabezado solo para lectores de pantalla (rol `header`, sin
   texto visible) con las claves `health.health`, `food.food` y
   `profile.profile`, para que las filas de `ui-copy-table.ts` mantengan su uso
   real y el lector siga anunciando la pantalla.

Es la **enmienda N1 de #168** (regla N1 de la carta, enmendada por #196):
Salud y Nutrición dejan de «abrir con el título grande». Toca además los
candados de #196, #197, #199, #200 y #173 que se nombran en R9.

### Artboards congelados (G1)

`specs/mobile-tab-avatar-header/canvas/`:

| Fichero | Lo que dibuja |
|---|---|
| `SaludSinTitulo.dc.html` | Salud con mascotas, cabecera fija de avatares |
| `NutricionSinTitulo.dc.html` | Nutrición con mascotas, misma cabecera |
| `PerfilSinTitulo.dc.html` | Perfil: selector a la izquierda, cápsula con texto a la derecha |
| `SaludSelectorMuchas.dc.html` | Muchas mascotas: scroll horizontal, 10 de separación, último chip cortado |
| `SaludUnaMascota.dc.html` | Una mascota: el chip solo |

Medidas del canvas que esta spec traduce (cabecera de Salud/Nutrición):
`position: absolute`, relleno `60px 20px 12px` (sobre un inset superior de 48),
fondo `var(--glass)` (blanco al 86 % en claro, `#161B22` al 86 % en oscuro),
`backdrop-filter: blur(20px)`, línea `1px solid var(--border)` abajo, chips de 40
con 10 de separación. La traducción a React Native y sus desviaciones
conscientes están en [[design]] §Mapa del canvas y §Desviaciones.

## Base medida (antes de tocar nada)

Todas las anclas se corren desde `mobile-pet-tracker/src/`. Ninguna depende de
un número de línea. «Antes» es el estado de `origin/dev` al redactar (HEAD
`73922b10`); «Después» es lo que debe medir el reviewer.

| # | Ancla | Antes | Después |
|---|---|---|---|
| B1 | `grep -cF 'testID="health-title"' screens/health/index.tsx` | 1 | 0 |
| B2 | `grep -cF 'testID="food-title"' screens/food/index.tsx` | 1 | 0 |
| B3 | `grep -cF 'testID="food-title-row"' screens/food/index.tsx` | 1 | 0 |
| B4 | `grep -cF 'testID="profile-title"' screens/profile/index.tsx` | 1 | 0 |
| B5 | `grep -cF 'variant="avatars"' screens/health/index.tsx` | 1 | 0 |
| B6 | `grep -cF 'variant="avatars"' screens/food/index.tsx` | 1 | 0 |
| B7 | `grep -cF 'variant="avatars"' components/tab-pet-header.tsx` | (no existe) | 1 |
| B8 | `grep -cF "t('health.health')" screens/health/index.tsx` | 1 | 1 |
| B9 | `grep -cF "t('food.food')" screens/food/index.tsx` | 1 | 1 |
| B10 | `grep -cF "t('profile.profile')" screens/profile/index.tsx` | 1 | 1 |
| B11 | `grep -cF 'flex-row gap-1.5' components/pet-switcher.tsx` | 1 | 0 |
| B12 | `grep -cF "toBe('flex-row gap-1.5')" components/__tests__/pet-switcher.test.tsx` | 1 | 0 |
| B13 | `grep -cF 'tracking-title' screens/health/index.tsx` (y `food`, `profile`) | 1 cada una | 0 cada una |
| B14 | `grep -cF 'testID="profile-add-pet"' screens/profile/index.tsx` | 1 | 1 |
| B15 | `grep -cF 'testID="profile-hero-top"' screens/profile/index.tsx` | 1 | 1 |
| B16 | `grep -cF 'testID="screen-food"' screens/food/index.tsx` | 1 | 1 |
| B17 | `grep -cF '**Regla N1 (enmienda #196)**' ../../docs/ui-guidelines.md` | 1 | 0 (tras G4, R12) |
| B18 | `grep -cF '**Regla N1 (enmienda #222)**' ../../docs/ui-guidelines.md` | 0 | 1 (tras G4, R12) |
| B19 | `grep -rlF 'expo-blur' --include=*.tsx components screens` sin los `*.test.tsx` | `components/floating-tab-bar.tsx`, `screens/alert-detail/index.tsx`, `screens/geofence-editor/index.tsx` | idéntico (lista de #180 R5.6, intacta) |
| B20 | `grep -cF "'tabs.bar'" i18n/catalog.ts` | 2 | 2 |
| B21 | `grep -cF "tabHeader.petsScroll" i18n/catalog.ts` | 0 | 2 |

Los recuentos de B1 a B6 se miden con `grep -cF` sobre el fichero de
producción, nunca sobre su test (los tests conservan los ids viejos solo en
aserciones negativas, ver R3, R4, R5).

## Requisitos funcionales

### R1 — Componente `TabPetHeader`

- **R1.1**: THE SYSTEM SHALL crear `src/components/tab-pet-header.tsx` que
  exporta `TabPetHeader`, `TAB_PET_HEADER_HEIGHT` (valor `65`) y
  `TAB_PET_HEADER_SCROLL_MIN` (valor `7`), con las props
  `{ testID: string; pets: PetProfile[]; selectedPetId: string | null;
  onSelect: (petId: string) => void; horizontalInset: number;
  scrollHint?: string }`. `PetProfile` sale de `../api/types`.
- **R1.2**: WHEN `pets.length === 0`, THE SYSTEM SHALL devolver `null` (la fila
  no se pinta; el contenido de la pantalla sube, ver R3.4 y R4.4).
- **R1.3**: WHEN `pets.length >= 1`, THE SYSTEM SHALL pintar una `View` raíz con
  el `testID` recibido, `className` exactamente
  `absolute inset-x-0 top-0 border-b border-border bg-glass-surface-strong`
  y `style` exactamente `{ paddingTop: insets.top + 7, paddingBottom: 7 }`
  (`useSafeAreaInsets` de `react-native-safe-area-context`). La raíz no lleva
  padding horizontal: el scroll del selector llega hasta el borde de la
  pantalla.
- **R1.4**: THE SYSTEM SHALL pintar dentro de la raíz un único hijo,
  `<PetSwitcher variant="avatars" ... edgeInset={horizontalInset - 5}
  scrollHint={scrollHint} />`, y ningún otro.
- **R1.5**: THE SYSTEM SHALL dar a la cabecera una altura total de
  `insets.top + TAB_PET_HEADER_HEIGHT`, donde `65 = 7 + 50 + 7 + 1` (relleno
  superior, caja del chip, relleno inferior, línea).
- **R1.6**: THE SYSTEM SHALL pintar el vidrio como **vidrio plano** (relleno
  `bg-glass-surface-strong` más línea `border-b border-border`), sin importar
  `expo-blur` ni `BlurView`, y sin `StyleSheet`, hex ni clases con corchetes.
- **R1.7**: THE SYSTEM SHALL NOT llamar a `t()` ni a `useTranslate` en
  `tab-pet-header.tsx` (el rótulo del scroll lo pasa cada pantalla, R8).

Tests (todos en `src/components/__tests__/tab-pet-header.test.tsx`, fichero
nuevo; doble de insets `{ top: 40, bottom: 24 }`):

- `#222 R1: con cero mascotas no pinta nada` (R1.2): `queryByTestId('x-header')` es `null`.
- `#222 R1: con mascotas pinta la raíz con la receta de vidrio plano y sus rellenos` (R1.3): `className` contra el literal de R1.3 y `style` `toEqual({ paddingTop: 47, paddingBottom: 7 })`.
- `#222 R1: TAB_PET_HEADER_HEIGHT suma 7 + 50 + 7 + 1` (R1.5): `expect(TAB_PET_HEADER_HEIGHT).toBe(65)` y `expect(TAB_PET_HEADER_SCROLL_MIN).toBe(7)`.
- `#222 R1: monta el selector avatars con edgeInset = horizontalInset - 5` (R1.4): con `horizontalInset={24}`, el `ScrollView` `pet-switcher-scroll` lleva `contentContainerStyle` `{ paddingHorizontal: 19 }`; con `20`, `{ paddingHorizontal: 15 }`; la raíz tiene un solo hijo.
- `#222 R1: pasa scrollHint al selector` (R1.4): `accessibilityLabel` del `ScrollView` `pet-switcher-scroll` igual al literal recibido; sin prop, `undefined`.
- `#222 R1: no importa expo-blur ni llama a t()` (R1.6, R1.7): lectura del fichero fuente con `readFileSync`, `not.toContain('expo-blur')`, `not.toContain('StyleSheet')`, `not.toMatch(/\bt\(/)`.

### R2 — `PetSwitcher` variante `avatars`

- **R2.1**: THE SYSTEM SHALL cambiar en `src/components/pet-switcher.tsx` el
  `className` de la `View` interior de la rama `avatars` de
  `flex-row gap-1.5` a exactamente `flex-row`. Con el chip de 50 de caja
  (`size-10` de avatar + `p-0.75` + `border-2`: 40 + 2 x 3 + 2 x 2), dos
  círculos contiguos quedan a **10** de separación, la medida del canvas.
- **R2.2**: THE SYSTEM SHALL añadir a `PetSwitcherProps` dos props opcionales,
  `edgeInset?: number` y `scrollHint?: string`, y aplicarlas **solo** en la
  rama `avatars`: el `ScrollView` horizontal lleva `testID="pet-switcher-scroll"`,
  `contentContainerStyle={edgeInset === undefined ? undefined : { paddingHorizontal: edgeInset }}`
  y `accessibilityLabel={scrollHint}`.
- **R2.3**: THE SYSTEM SHALL dejar intactas las ramas `default` y `glass`:
  `glass` sigue con `className="-m-1"` en el `ScrollView`, fila
  `flex-row items-center gap-2 p-1`, chip seleccionado `size-11` y el slot
  `trailing`; `default` sigue con la fila `flex-row gap-2`.
- **R2.4**: THE SYSTEM SHALL NOT cambiar los `testID` `pet-chip-<id>`,
  `pet-avatar-<id>`, `pet-avatar-image-<id>` ni `pet-avatar-fallback-<id>`.

Tests en `src/components/__tests__/pet-switcher.test.tsx`:

- Reescritura de `reparte los cinco colores y vuelve a ámbar en la sexta mascota` (R2.1): la aserción `first.parent!.props.className).toBe('flex-row gap-1.5')` pasa a `toBe('flex-row')`; el título gana el sufijo `(enmendado por #222 R2)`.
- `#222 R2: la caja del chip mide 50 y la fila no lleva gap` (R2.1): `pet-chip-<id>` con `className` que contiene `p-0.75` y `border-2`, `pet-avatar-<id>` con `size-10`, y la fila con `className` `flex-row` sin `gap`.
- `#222 R2: sin edgeInset ni scrollHint el ScrollView no lleva relleno ni etiqueta` (R2.2).
- `#222 R2: edgeInset y scrollHint llegan al ScrollView pet-switcher-scroll` (R2.2): `edgeInset={19}` da `{ paddingHorizontal: 19 }`; `scrollHint="Mascotas, desliza para ver más"` da ese `accessibilityLabel`.
- `#222 R2: las variantes default y glass no cambian` (R2.3): literales `flex-row gap-2` (`default`) y `flex-row items-center gap-2 p-1` (`glass`), y `pet-switcher-scroll` ausente en ambas.

### R3 — Salud

- **R3.1**: THE SYSTEM SHALL quitar de `src/screens/health/index.tsx` el
  `View testID="health-header"` entero, el `Text testID="health-title"` y el
  `PetSwitcher` suelto. `queryByTestId('health-title')` y
  `queryByTestId('health-header')` devuelven `null`, y `queryByText('Salud')`
  devuelve `null` (el título visible ya no existe).
- **R3.2**: WHEN hay al menos una mascota (`pets.data?.kind === 'ok' &&
  pets.data.pets.length > 0`), THE SYSTEM SHALL pintar
  `<TabPetHeader testID="health-pet-header" horizontalInset={24} ... />` como
  **hijo de `health-root` inmediatamente posterior al `ScrollView`
  `screen-health` y anterior a `vaccine-reminder-notice`** (así se pinta encima
  sin `zIndex`; el aviso es `absolute` abajo y no se solapa), con `selectedPetId` y `onSelect={selectPet}` y
  las `pets` de la consulta.
- **R3.3**: THE SYSTEM SHALL dar al `ScrollView` `screen-health` el
  `contentContainerStyle` `{ padding: 24, gap: 16, paddingTop: P, paddingBottom:
  insets.bottom + 96 }` con `P = insets.top + TAB_PET_HEADER_HEIGHT + 16` cuando
  hay mascotas (121 con el doble de insets) y `P = insets.top + 12` (52) en
  los demás estados.
- **R3.4**: WHILE la lista de mascotas está pendiente, en error o vacía, THE
  SYSTEM SHALL NOT pintar `health-pet-header` y SHALL conservar
  `paddingTop: insets.top + 12`: el contenido sube.
- **R3.5**: THE SYSTEM SHALL dejar `health-content` como único hijo del scroll
  cuando hay mascotas y SHALL conservar sin tocar `health-states`,
  `vaccines-add`, `vaccine-reminder-notice` y todo el contenido interior.
- **R3.6**: IF hay `TAB_PET_HEADER_SCROLL_MIN` (7) o más mascotas, THEN THE
  SYSTEM SHALL pasar `scrollHint={t('tabHeader.petsScroll')}` al
  `TabPetHeader`; con 6 o menos, `scrollHint={undefined}` (R8).
- **R3.7**: WHEN el usuario pulsa un chip del `health-pet-header`, THE SYSTEM
  SHALL llamar a `selectPet` y mostrar los datos de esa mascota (el
  comportamiento de hoy, ahora desde la cabecera fija).

Tests en `src/screens/health/index.test.tsx` (se ejecutan con
`renderRouter` y el doble de insets `{ top: 40, bottom: 24 }`):

- Nuevo `#222 R3: sin título visible y sin health-header` (R3.1).
- Nuevo `#222 R3: con mascotas la cabecera fija va tras el scroll` (R3.2): los hijos de `health-root` son `['health-heading', 'screen-health', 'health-pet-header']` (y `vaccine-reminder-notice` en último lugar cuando existe).
- Nuevo `#222 R3: el scroll arranca bajo la cabecera con mascotas y arriba sin ellas` (R3.3, R3.4): `contentContainerStyle` `toEqual({ padding: 24, gap: 16, paddingTop: 121, paddingBottom: 120 })` con mascotas; `paddingTop: 52` pendiente, error y vacío, y `queryByTestId('health-pet-header')` `null` en esos tres.
- Nuevo `#222 R3: health-content es el único hijo del scroll` (R3.5), sustituye a `#199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll`.
- Nuevo `#222 R3: el selector vive solo en health-pet-header` (R3.2, R3.7): los `pet-chip-*` están dentro de `health-pet-header` y no dentro de `health-content`; pulsar el segundo chip cambia la mascota mostrada.
- Nuevo `#222 R3: seis mascotas sin pista, siete con ella` (R3.6): `pet-switcher-scroll.props.accessibilityLabel` es `undefined` con 6 y `'Mascotas, desliza para ver más'` con 7.
- Reescrituras: ver R9.

### R4 — Nutrición

- **R4.1**: THE SYSTEM SHALL quitar de `src/screens/food/index.tsx` el
  `View testID="food-title-row"`, el `Text testID="food-title"` y el
  `PetSwitcher` suelto. `queryByTestId('food-title')` y
  `queryByTestId('food-title-row')` devuelven `null`, y
  `queryByText('Nutrición')` devuelve `null`.
- **R4.2**: THE SYSTEM SHALL envolver el `ScrollView` `screen-food` en una
  `View testID="food-root" className="flex-1"` (el `ScrollView` conserva su
  `testID`, `className` y props) y pintar, como hijos de `food-root` en este
  orden: `food-heading` (R7), el `ScrollView` `screen-food` y, solo con
  mascotas, `<TabPetHeader testID="food-pet-header" horizontalInset={20} ... />`.
- **R4.3**: THE SYSTEM SHALL dar al `ScrollView` `screen-food` el
  `contentContainerStyle` `{ paddingHorizontal: 20, gap: 14, paddingTop: P,
  paddingBottom: insets.bottom + 96 }` con `P = insets.top +
  TAB_PET_HEADER_HEIGHT + 14` con mascotas (119) y `P = insets.top + 12` (52)
  en los demás estados.
- **R4.4**: WHILE la lista de mascotas está pendiente, en error o vacía, THE
  SYSTEM SHALL NOT pintar `food-pet-header` y SHALL conservar
  `paddingTop: insets.top + 12`.
- **R4.5**: IF hay 7 o más mascotas, THEN THE SYSTEM SHALL pasar
  `scrollHint={t('tabHeader.petsScroll')}`; con 6 o menos, `undefined` (R8).
- **R4.6**: THE SYSTEM SHALL conservar sin tocar todo lo que Nutrición pinta
  bajo el selector (`food-links`, `food-loading`, `food-error`, `food-retry`,
  `food-empty`, `food-plan-*`, la tarjeta del anillo y los accesos). La
  diferencia con hoy es solo que el primer hijo del scroll deja de ser la fila
  del título.
- **R4.7**: WHEN el usuario pulsa un chip del `food-pet-header`, THE SYSTEM
  SHALL cambiar la mascota (comportamiento de hoy).

Tests en `src/screens/food/index.test.tsx`:

- Nuevo `#222 R4: sin título visible y sin food-title-row` (R4.1).
- Nuevo `#222 R4: food-root envuelve al scroll y la cabecera va después` (R4.2): hijos de `food-root` `['food-heading', 'screen-food', 'food-pet-header']`; con la lista vacía, solo los dos primeros.
- Nuevo `#222 R4: el scroll arranca bajo la cabecera con mascotas y arriba sin ellas` (R4.3, R4.4): `paddingTop` 119 con mascotas y 52 en pendiente, error y vacío; `paddingHorizontal: 20`, `gap: 14`.
- Nuevo `#222 R4: el selector vive solo en food-pet-header` (R4.2, R4.7).
- Nuevo `#222 R4: seis mascotas sin pista, siete con ella` (R4.5).
- Reescrituras: ver R9.

### R5 — Perfil con hero

- **R5.1**: WHEN `showHero` es verdadero (lista pendiente, o lista `ok` con al
  menos una mascota), THE SYSTEM SHALL pintar `profile-hero-top` con
  `className` exactamente `flex-row items-center justify-between gap-3 px-1`
  y exactamente dos hijos, en este orden: `View testID="profile-hero-selector"
  className="min-w-0 flex-1"` y el `Pressable testID="profile-add-pet"`.
- **R5.2**: WHEN hay mascotas en la lista `ok`, THE SYSTEM SHALL pintar dentro
  de `profile-hero-selector` el `PetSwitcher variant="glass"` con las mismas
  props de hoy. WHILE la lista está pendiente, `profile-hero-selector` se pinta
  vacío (sin selector), de modo que la cápsula queda a la derecha.
- **R5.3**: THE SYSTEM SHALL conservar la cápsula `profile-add-pet` tal cual:
  mismo `className` ternario (`h-11 flex-row items-center gap-1.5 rounded-full
  bg-glass-surface-strong px-4` con hero), mismo `hitSlop`, icono
  `profile-add-pet-icon` oculto a accesibilidad con `Plus size={16}
  strokeWidth={2.6}`, texto `t('profile.addPet')` en `text-sm font-extrabold
  text-accent-strong` y `onPress` a `router.push('/pets/add')`. La cápsula pasa
  a una constante (`addPetCapsule`) declarada donde hoy se declara `titleRow`;
  `titleRow` desaparece.
- **R5.4**: THE SYSTEM SHALL NOT pintar `profile-title` ni texto «Perfil»
  visible en ninguna rama (`queryByTestId('profile-title')` y
  `queryByText('Perfil')` son `null`).
- **R5.5**: THE SYSTEM SHALL dejar intactos `PetHeroHeader` (`variant="bleed"`,
  `caption`, hijos), `profile-pet-card`, `profile-pet-name`, `PetPills`,
  `change-photo` y el resto del contenido.

Tests en `src/screens/profile/index.test.tsx`:

- Nuevo `#222 R5: profile-hero-top es una fila con el selector a la izquierda y la cápsula a la derecha` (R5.1): `className` contra el literal y los hijos `['profile-hero-selector', 'profile-add-pet']`.
- Nuevo `#222 R5: el selector glass vive en profile-hero-selector` (R5.2): con mascotas, `within(selector)` encuentra los `pet-chip-*`; con la lista pendiente, `queryAllByTestId(/^pet-chip-/)` vacío y el slot sigue montado.
- Nuevo `#222 R5: la cápsula conserva su receta y su ruta` (R5.3): `className` literal, `getByText('Añadir mascota')`, icono oculto y `router.push('/pets/add')` al pulsar.
- Nuevo `#222 R5: no hay título visible en ninguna rama` (R5.4): bucle sobre `PROFILE_BRANCHES_168`, `queryByTestId('profile-title')` y `queryByText('Perfil')` `null`.
- Reescrituras: ver R9.

### R6 — Perfil sin hero

- **R6.1**: WHEN `showHero` es falso (lista vacía o en error), THE SYSTEM SHALL
  pintar como **primer hijo** de `profile-content` una
  `View testID="profile-top-row" className="flex-row justify-end"` con un solo
  hijo: la misma constante `addPetCapsule` (R5.3), cuyo `className` en esta rama
  es `h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5`.
- **R6.2**: THE SYSTEM SHALL conservar en esta rama
  `style={{ paddingTop: insets.top + 12 }}` en `profile-content` (52).
- **R6.3**: THE SYSTEM SHALL NOT pintar selector de mascotas ni título en esta
  rama.

Tests en `src/screens/profile/index.test.tsx`:

- Nuevo `#222 R6: sin hero, profile-top-row lleva solo la cápsula pastilla a la derecha` (R6.1, R6.3): primer hijo de `profile-content`, `className` `flex-row justify-end`, hijo único `profile-add-pet` con el literal `h-9 ...`.
- Nuevo `#222 R6: sin hero, profile-content conserva paddingTop 52` (R6.2).
- Reescrituras: ver R9.

### R7 — Encabezado solo para lectores de pantalla

- **R7.1**: THE SYSTEM SHALL pintar en cada una de las tres pantallas una `View`
  con `testID` `health-heading`, `food-heading` o `profile-heading`,
  `accessible`, `accessibilityRole="header"`,
  `accessibilityLabel={t('health.health')}` (respectivamente
  `t('food.food')`, `t('profile.profile')`) y `className="absolute size-px"`.
  No lleva hijos: no hay nodo `Text`, así que no hay texto visible.
- **R7.2**: THE SYSTEM SHALL pintarlo **en todos los estados** (con mascotas,
  sin ellas, pendiente, error), porque el lector debe anunciar siempre la
  pantalla.
- **R7.3**: THE SYSTEM SHALL colocarlo como primer hijo de `health-root` (Salud),
  de `food-root` (Nutrición) y del contenido del `ScrollView` `screen-profile`
  (Perfil, antes de `profile-hero`/`profile-content`). Al ser `absolute` no
  consume `gap`.
- **R7.4**: THE SYSTEM SHALL conservar exactamente **una** llamada
  `t('health.health')`, **una** `t('food.food')` y **una** `t('profile.profile')`
  (B8 a B10), de modo que las filas de `ui-copy-table.ts` no cambian.

Tests (uno por pantalla, en cada `index.test.tsx`):

- `#222 R7: Salud anuncia su encabezado sin texto visible` (R7.1, R7.3): `getByRole('header', { name: 'Salud' })` es el nodo `health-heading`, `className` `absolute size-px`, `children` vacío. Equivalente con `food-heading`/`Nutrición` y `profile-heading`/`Perfil`.
- `#222 R7: el encabezado sale en inglés` (R7.1): tras cambiar el idioma a inglés, `getByRole('header', { name: 'Health' })` (`Food`, `Profile`).
- `#222 R7: el encabezado existe en todos los estados` (R7.2): para Salud y Nutrición, con mascotas, vacío, error y pendiente; para Perfil, sobre `PROFILE_BRANCHES_168`.
- `#222 R7: el encabezado es el primer hijo` (R7.3).
- La cuenta de `t()` (R7.4) la prueba `ui-language.test.ts` (`resuelve cada ocurrencia de la tabla contra la clave exacta`), que ya exige una llamada por fila.

### R8 — Copy `tabHeader.petsScroll` y filas de la tabla

- **R8.1**: THE SYSTEM SHALL añadir a `src/i18n/catalog.ts` la clave
  `tabHeader.petsScroll`:
  - `es`: `Mascotas, desliza para ver más`
  - `en`: `Pets, swipe to see more`
  Se inserta justo después de la entrada `'tabs.bar'` de cada bloque (`en` y
  `es`).
- **R8.2**: THE SYSTEM SHALL añadir a `src/__tests__/ui-copy-table.ts` una fila
  `{ file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8`
  al final de `R5_HEALTH` y
  `{ file: 'src/screens/food/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8`
  al final de `R6_FOOD`, y llamar a `t('tabHeader.petsScroll')` exactamente
  una vez en cada pantalla (R3.6, R4.5).
- **R8.3**: THE SYSTEM SHALL actualizar en `src/__tests__/ui-language.test.ts`
  las sumas manuales `expect(R5_HEALTH).toHaveLength(...)` y
  `expect(R6_FOOD).toHaveLength(...)` añadiéndoles `+ 1` con el comentario
  `#222 R8` y el sufijo `(enmendado por #222 R8)` en el título de cada `it`.
- **R8.4**: THE SYSTEM SHALL NOT cambiar la suma de `SCREEN_FILES`
  (`it('#194 R5: no deja ningún valor fijo del catálogo...')`): ningún fichero
  nuevo llama a `t()` (R1.7) y `health/index.tsx`, `food/index.tsx` y
  `profile/index.tsx` ya figuran en ella. El test `#194 R5: cuadra ALL_USES con
  la suma de sus bloques` no cambia.
- **R8.5**: THE SYSTEM SHALL NOT repetir el literal `Mascotas, desliza para ver
  más` ni `Pets, swipe to see more` entero en ningún fichero de `SCREEN_FILES`
  (el candado `FIXED_COPY` de `ui-language.test.ts` lo vigila).

Tests:

- `src/__tests__/ui-language.test.ts` › nuevo `#222 R8: la clave tabHeader.petsScroll dice el literal en es y en` (R8.1): `es['tabHeader.petsScroll']` `toBe('Mascotas, desliza para ver más')` y `en[...]` `toBe('Pets, swipe to see more')`.
- `src/__tests__/ui-language.test.ts` › `resuelve cada ocurrencia de la tabla contra la clave exacta` (R8.2, R7.4, sin cambios): falla si falta o sobra una llamada.
- `src/__tests__/ui-language.test.ts` › los `toHaveLength` de `R5_HEALTH` y `R6_FOOD` reescritos (R8.3).
- `src/providers/__tests__/language-provider.test.tsx` › paridad de claves (R8.1, sin cambios).

### R9 — Candados que cambian

Cada candado se nombra con su ruta y su `it`. La columna «Ahora» es la
aserción vigente; «Después» es la que debe quedar. Cada título de `it` gana el
sufijo `(enmendado por #222 R9)` salvo que se indique otro.

| # | Fichero › `it` | Ahora | Después |
|---|---|---|---|
| L1 | `src/__tests__/tab-headers-canvas.test.ts` › `#168 R1: el título grande vive en las tres pestañas` › `pinta una ocurrencia del literal en cada fichero de pestaña` | 1 ocurrencia de `TAB_TITLE_168` (`text-3xl font-black tracking-title text-foreground`) en cada una de `health`, `profile`, `food` | 0 ocurrencias en cada una |
| L2 | mismo fichero › `limita el literal a las tres pestañas y a la celebración` | `['components/celebration.tsx','screens/food/index.tsx','screens/health/index.tsx','screens/profile/index.tsx']` | `['components/celebration.tsx']` |
| L3 | mismo fichero › `#196 R11: la carta recoge la enmienda N1 de #196` | contiene `**Regla N1 (enmienda #196)**` y no contiene `Inicio es la única pestaña con PetHeroHeader` | se reescribe en R12 (contiene `**Regla N1 (enmienda #222)**`) |
| L4 | `src/__tests__/canvas-foundations.test.ts` › `#197 R4: ningún fichero de producción usa tracking-tight` | el bucle comprueba `toContain('text-3xl font-black tracking-title text-foreground')` en `screens/food`, `components/celebration`, `screens/health`, `screens/profile` | el bucle conserva solo `components/celebration` |
| L5 | `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R4: limita la variante nueva al consumidor ...` (`filesMatching(/variant="avatars"/)`) | `['screens/food/index.tsx','screens/health/index.tsx']` | `['components/tab-pet-header.tsx']` |
| L6 | `src/__tests__/profile-photo-hero-canvas.test.ts` › `#196 R10: fila 3 ...` (tabla `FILAS`, `n: 3`, literal `text-3xl font-black tracking-title text-accent-foreground`) | el literal de producción existe | se **elimina la fila `n: 3`** y `expect(FILAS).toHaveLength(24)` baja a `23` (se conservan los tres artboards) |
| L7 | `src/__tests__/profile-photo-hero-canvas.test.ts` › fila `n: 4` (cápsula `h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4`) | existe | **sin cambio**: la cápsula conserva su receta (R5.3); la fila debe seguir verde |
| L8 | `src/__tests__/alerts-canvas-fidelity.test.ts` › `limita $token a su inventario de producción` con `token: 'tracking-title'` | incluye `screens/food/index.tsx`, `screens/health/index.tsx`, `screens/profile/index.tsx` | las tres desaparecen del inventario; quedan `components/celebration.tsx`, `components/empty-state.tsx`, `components/pet-hero-header.tsx`, `components/screen-header.tsx`, `screens/home/index.tsx`, `screens/pairing/index.tsx` |
| L9 | `src/components/__tests__/pet-switcher.test.tsx` › `reparte los cinco colores y vuelve a ámbar en la sexta mascota` | `toBe('flex-row gap-1.5')` | `toBe('flex-row')` (R2.1) |
| L10 | `src/screens/health/index.test.tsx` y `src/screens/food/index.test.tsx` y `src/screens/profile/index.test.tsx` | ver tabla R9.1 | ver tabla R9.1 |

**R9.1 — Tests de pantalla que se reescriben.** Localizarlos con
`grep -nE "health-title|food-title|profile-title|getByText\('(Salud|Nutrición|Perfil|Health|Profile)'\)" <fichero>`
y con `grep -n "contentContainerStyle" <fichero>`. Los `it` conocidos:

| Fichero › `it` | Cambio |
|---|---|
| `health/index.test.tsx` › `shows the hub and a loading state while pets are pending` | `getByText('Salud')` pasa a `getByRole('header', { name: 'Salud' })`; `contentContainerStyle` pasa a `paddingTop: 52` (cargando no hay cabecera) |
| `health/index.test.tsx` › `it.each(HEALTH_BRANCHES_168)('pinta el título grande ($name) (enmendado por #197 R4)')` | se reescribe como `pinta el encabezado oculto ($name)` (R7.2): `health-heading` presente, `health-title` ausente, en cada rama |
| `health/index.test.tsx` › `con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden (enmendado por #199 R12)` | se sustituye por el nuevo `#222 R3: health-content es el único hijo del scroll` |
| `health/index.test.tsx` › `it.each(HEALTH_BRANCHES_168.slice(0, 5))('sin contenido ($name), health-title precede a health-states ...')` | se reescribe: sin contenido, `health-states` es el primer hijo del scroll |
| `health/index.test.tsx` › `#199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll` | se elimina (lo cubre el nuevo `#222 R3`) |
| `health/index.test.tsx` › `#199 R12 health-header es una fila justify-between que empieza por health-title` | se elimina; lo sustituye `#222 R3: con mascotas la cabecera fija va tras el scroll` |
| `health/index.test.tsx` › `#199 R13 el selector va en health-header tras health-title en su variante avatars` | se reescribe como `#222 R3: el selector vive solo en health-pet-header` |
| `health/index.test.tsx` › los `it` que buscan `/^pet-chip-/` (dos) | `within(screen.getByTestId('health-pet-header'))` en lugar de `health-header` |
| `health/index.test.tsx` › los `it` con `contentContainerStyle` `paddingTop: 52` | `121` con mascotas, `52` sin ellas (R3.3) |
| `food/index.test.tsx` › `shows the hub and a loading state while pets are pending (enmendado por #200 R2)` | `getByText('Nutrición')` pasa a `getByRole('header', { name: 'Nutrición' })`; `paddingTop: 52` |
| `food/index.test.tsx` › `it.each(FOOD_BRANCHES_168)('pinta el título grande ($name) (enmendado por #197 R4)')` | se reescribe como `pinta el encabezado oculto ($name)` |
| `food/index.test.tsx` › `#200 R2: los avatares comparten fila con el título` | se sustituye por `#222 R4: el selector vive solo en food-pet-header` |
| `food/index.test.tsx` › `#200 R2: sin mascotas la fila solo lleva el título` | se sustituye por `#222 R4: ... sin mascotas no hay food-pet-header` (R4.4) |
| `food/index.test.tsx` › `queda en el sitio del vacío que sustituye (enmendado por #200 R2)` | la lista de hijos del contenedor ya no incluye `food-title-row`; se actualiza el arreglo esperado |
| `food/index.test.tsx` › los `it` con `contentContainerStyle` | `paddingTop` 119 con mascotas, 52 sin ellas (R4.3) |
| `profile/index.test.tsx` › `pinta la cápsula tras el título con icono oculto y texto en español (enmendado por #196 R2)` | se reescribe como `#222 R5: la cápsula conserva su receta y su ruta` |
| `profile/index.test.tsx` › `shows the current endonym and changes the live Profile copy (enmendado por #196 R2)` | `getByText('Perfil')`/`getByText('Profile')` pasan a `getByRole('header', { name })` |
| `profile/index.test.tsx` › `R5.2 R5.3: centra en horizontal dentro del scroll ...` | la lista de `testID` quita `profile-title` y añade `profile-heading` |
| `profile/index.test.tsx` › `it.each(PROFILE_BRANCHES_168)('#196 R1: en la rama $name monta el hero = $hero')` | los índices de los hijos del scroll cuentan con `profile-heading` en la posición 0 |
| `profile/index.test.tsx` › `it.each(PROFILE_BRANCHES_168)('pinta el título grande ($name) ...')` | se reescribe como `pinta el encabezado oculto ($name)` |
| `profile/index.test.tsx` › `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot` | se sustituye por `#222 R5: profile-hero-top ...` |
| `profile/index.test.tsx` › `#196 R2: con la lista pendiente el slot no monta el selector` | se conserva con la nueva estructura (`profile-hero-selector` vacío) |
| `profile/index.test.tsx` › `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título` | «tras el título» pasa a «tras profile-top-row» |
| `profile/index.test.tsx` › `pasa avatars al selector compartido cuando carga la mascota` | se reescribe: Perfil pasa `glass`, no `avatars`; `variant="avatars"` no aparece en `profile/index.tsx` |
| `profile/index.test.tsx` › `renders the active pet hero, switcher, pills and information rows` | `contentContainerStyle` sin cambios; los índices cuentan con `profile-heading` |

El `reviewer` verifica L1 a L10 ejecutando la suite y con `grep -cF` sobre los
títulos reescritos: ningún test conserva `health-title`, `food-title`,
`food-title-row` ni `profile-title` salvo en una aserción negativa
(`queryByTestId(...)` `toBeNull()`).

### R10 — Grep-clean

- **R10.1**: THE SYSTEM SHALL NOT contener, en ningún fichero de producción de
  `src/`, los ids `health-title`, `food-title`, `food-title-row` ni
  `profile-title` (regex `(?<![\w-])(?:health-title|food-title-row|food-title|profile-title)(?![\w-])`,
  que no confunde `edit-profile-title` ni `nutrition-profile-title`).
- **R10.2**: THE SYSTEM SHALL dejar `text-3xl font-black tracking-title
  text-foreground` solo en `components/celebration.tsx` (L2).
- **R10.3**: THE SYSTEM SHALL dejar `variant="avatars"` solo en
  `components/tab-pet-header.tsx` (L5).
- **R10.4**: THE SYSTEM SHALL NOT añadir `expo-blur` a ningún fichero nuevo; la
  lista de B19 no cambia (candado `#180 R5.6` de
  `alert-detail-canvas-fidelity.test.ts`).
- **R10.5**: THE SYSTEM SHALL NOT usar `StyleSheet`, hex ni clases con corchetes
  en `tab-pet-header.tsx`, `pet-switcher.tsx`, las tres pantallas ni sus tests
  (candados `#168 R12` y `design-drift.test.ts`).
- **R10.6**: THE SYSTEM SHALL usar solo clases ya presentes en el repo o en la
  escala de Tailwind: `absolute`, `inset-x-0`, `top-0`, `border-b`,
  `border-border`, `bg-glass-surface-strong`, `size-px`, `min-w-0`, `flex-1`,
  `flex-row`, `justify-end`, `justify-between`, `items-center`, `gap-3`, `px-1`.

Tests en `src/__tests__/tab-headers-canvas.test.ts` (describe nuevo
`#222 R10: grep-limpio`):

- `#222 R10: ningún fichero de producción nombra los ids del título` (R10.1): `filesMatching(regex)` `toEqual([])`.
- `#222 R10: variant="avatars" solo vive en TabPetHeader` (R10.3): `toEqual(['components/tab-pet-header.tsx'])`.
- `#222 R10: las pantallas y el componente nuevo no usan StyleSheet, hex ni corchetes` (R10.5, R10.6): sobre `TAB_SCREENS_168` más `components/tab-pet-header.tsx` más `components/pet-switcher.tsx`.
- L1 y L2 cubren R10.2; `alert-detail-canvas-fidelity.test.ts` (sin cambios) cubre R10.4.

### R11 — Enmienda a las specs que esta feature modifica

- **R11.1**: THE SYSTEM SHALL insertar al **final** de cada uno de los seis
  documentos siguientes el bloque literal de [[design]] §Bloque canónico de la
  enmienda, sustituyendo `<FEATURE>` y `<QUÉ CAMBIA>` por los valores de la
  tabla, con su línea de firma `- [ ] Enmienda #222 aprobada por humano`
  **sin marcar** (la marca el humano; ver `Aprobación`):

  | Documento | `<FEATURE>` | `<QUÉ CAMBIA>` | Marcador en prosa (línea siguiente al encabezado citado) |
  |---|---|---|---|
  | `specs/mobile-tab-headers-canvas/requirements.md` | `mobile-tab-headers-canvas` | `R1: el título grande sale de Salud, Nutrición y Perfil` | `**Enmendado por #222 (C1)**: las tres pestañas ya no pintan el título grande; conservan un encabezado oculto para lectores de pantalla (#222 R3, R4, R5, R7). El literal de R1.3 solo sigue en la celebración.` bajo `- **R1.1**` |
  | `specs/mobile-profile-photo-hero-canvas/requirements.md` | `mobile-profile-photo-hero-canvas` | `R2: el slot superior del hero lleva el selector y la cápsula, sin título` | `**Enmendado por #222 (C2)**: el slot superior del hero ya no lleva el título «Perfil»; lleva el selector glass a la izquierda y la cápsula «Añadir mascota» a la derecha (#222 R5, R6).` bajo `- **R2.1**` |
  | `specs/mobile-canvas-health-weight/requirements.md` | `mobile-canvas-health-weight` | `R12 y R13: Salud sin título, con cabecera fija de avatares` | `**Enmendado por #222 (C3)**: health-header y health-title desaparecen; el selector avatars vive en la cabecera fija health-pet-header (#222 R3).` bajo `**R12 — Cabecera de Salud.**` |
  | `specs/mobile-canvas-nutrition/requirements.md` | `mobile-canvas-nutrition` | `R2: Nutrición sin fila de título, con cabecera fija de avatares` | `**Enmendado por #222 (C4)**: food-title-row y food-title desaparecen; el selector avatars vive en la cabecera fija food-pet-header (#222 R4).` bajo `### R2 — Marco y fila de título` |
  | `specs/mobile-canvas-foundations/requirements.md` | `mobile-canvas-foundations` | `R4: el título de las pestañas ya no usa tracking-title` | `**Enmendado por #222 (C5)**: el literal text-3xl font-black tracking-title text-foreground solo sigue en components/celebration.tsx (#222 R9, L4).` bajo `- **R4**` |
  | `specs/mobile-tab-screens-canvas-fidelity/requirements.md` | `mobile-tab-screens-canvas-fidelity` | `R4 y R5: avatars deja las pantallas y la cápsula pierde el título` | `**Enmendado por #222 (C6)**: variant="avatars" solo vive en components/tab-pet-header.tsx y la cápsula profile-add-pet ya no sigue a un título (#222 R2, R5, R9 L5).` bajo `- **R4.3**` |

- **R11.2**: THE SYSTEM SHALL respetar el estilo de cada documento: el marcador
  en prosa va en la línea siguiente al requisito citado y **no reescribe** el
  texto original (queda legible como historia).
- **R11.3**: THE SYSTEM SHALL añadir a
  `src/__tests__/hero-header-amendments.test.ts` un `describe('#222 R11: las
  specs enmendadas por #222 llevan su bloque', ...)` hermano del de #168, con
  `SIGNATURE_LINE_222 = '- [ ] Enmienda #222 aprobada por humano'`, la tabla
  `AMENDED_DOCS_222` de **siete** filas (las seis de arriba más
  `docs/ui-guidelines.md`, R12) y la función `canonicalAmendment222(feature,
  change)` que lee el fence de `specs/mobile-tab-avatar-header/design.md` §2
  (mismo patrón que `canonicalAmendment168`, con el prefijo de fence
  ```` ```markdown\n## Enmienda #222 — avatares fijos y sin título en las pestañas ````).

Tests en `src/__tests__/hero-header-amendments.test.ts`:

- `#222 R11: inserta el bloque literal de design.md §2 en los siete documentos` (R11.1, R11.3): `expect(AMENDED_DOCS_222).toHaveLength(7)` y, por documento, `source.includes(canonicalAmendment222(feature, change))`.
- `#222 R11: deja en cada documento su línea de firma propia, marcada o no` (R11.1): acepta `- [ ] Enmienda #222 aprobada por humano` o `- [X] ...`.
- `#222 R11: aplica además el marcador en prosa de la tabla R11.1` (R11.2): normalizando espacios, cada documento contiene su marcador.

Nota de ejecución (R11 y R12): las seis ediciones de specs son documentos de
`specs/`, no código; las hace Codex en el mismo commit verde que su test, como
hizo #168 con `AMENDED_DOCS_168`. La edición de `docs/ui-guidelines.md` espera a
G4 (R12).

### R12 — Carta: regla N1 (gate G4)

- **R12.1** (solo con G4 marcada): THE SYSTEM SHALL reescribir en
  `docs/ui-guidelines.md` la regla N1 de modo que la línea que hoy empieza por
  `**Regla N1 (enmienda #196)**` pase a ser exactamente:

  `**Regla N1 (enmienda #222)**: Inicio y Perfil abren con PetHeroHeader a sangre. Salud y Nutrición abren con el selector de mascotas (avatares de 40) en una cabecera fija de vidrio plano, sin título visible; si no hay mascotas la cabecera no se pinta. En Perfil el selector glass y «Añadir mascota» comparten la fila superior del hero. Las tres pestañas conservan un encabezado solo para lectores de pantalla. Devolver el título a una pestaña, el hero a Salud o a Nutrición, o quitárselo a Inicio o a Perfil, es una enmienda a #222.`

- **R12.2** (solo con G4 marcada): THE SYSTEM SHALL añadir al final de
  `docs/ui-guidelines.md`, tras la última sección `## Enmienda` que exista al
  arrancar, el bloque canónico de R11 con `<FEATURE>` = `docs/ui-guidelines.md`
  y `<QUÉ CAMBIA>` = `regla N1: avatares fijos y sin título en Salud y Nutrición`,
  con su línea de firma marcada `- [X]` por el leader en el mismo commit que
  mueve la carta **solo si** la casilla G4 de `Aprobación` ya está marcada por el
  humano, y la nota de firma que usan #205 y #206
  (`Firma delegada ...` no aplica: G4 es del humano, la nota cita la fecha y la
  casilla G4).
- **R12.3** (solo con G4 marcada): THE SYSTEM SHALL reescribir, en el mismo
  commit y no antes, tres aserciones que hoy leen la regla vieja:
  1. `tab-headers-canvas.test.ts` › `#196 R11: la carta recoge la enmienda N1 de #196` pasa a `#222 R12: la carta recoge la enmienda N1 de #222`: exige `**Regla N1 (enmienda #222)**` y no contiene `**Regla N1 (enmienda #196)**` ni `Inicio es la única pestaña con PetHeroHeader`.
  2. `hero-header-amendments.test.ts` › `AMENDED_DOCS_168`, fila de `docs/ui-guidelines.md`: su `marker` se reescribe con el texto exacto de R12.1 (precedente #196).
  3. La fila de `docs/ui-guidelines.md` de `AMENDED_DOCS_222` usa el mismo texto de R12.1 como `marker`; para no duplicarlo, ambos leen una constante `CHARTER_N1_222` declarada una vez en el fichero.
- **R12.4**: IF la casilla G4 no está marcada cuando Codex llega a R12, THEN
  Codex SHALL parar antes de ese commit, dejar R12 y R13 sin marcar en
  `tasks.md`, y decirlo en `progress/impl_mobile-tab-avatar-header.md`. R1 a R11
  y R14 se entregan igualmente. El `reviewer` no aprueba la feature con R12 o
  R13 pendientes (ver `Aprobación`).

Tests:

- `src/__tests__/tab-headers-canvas.test.ts` › `#222 R12: la carta recoge la enmienda N1 de #222` (R12.1, R12.3).
- `src/__tests__/hero-header-amendments.test.ts` › `aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11) (enmendado por #222 R12)` (R12.3 punto 2).
- `src/__tests__/hero-header-amendments.test.ts` › los tres `it` de R11 (R12.2: el bloque de la carta y su firma).

### R13 — Convenciones: excepción de la cabecera fija

- **R13.1**: THE SYSTEM SHALL añadir a
  `docs/conventions.md`, en la viñeta «Dimensiones de pantalla uniformes»,
  justo después de la excepción «fidelidad al canvas, 2026-10-13» y antes de la
  de «A20 de #181», este párrafo exacto:

  `**Excepción nombrada (enmienda #222, 2026-10-27)**: una pestaña con cabecera fija de avatares (hoy Salud y Nutrición, vía src/components/tab-pet-header.tsx) sustituye el paddingTop: insets.top + 12 del scroll por insets.top + TAB_PET_HEADER_HEIGHT + gap de la pantalla mientras la cabecera esté pintada (65 más el gap: 16 en Salud, 14 en Nutrición); sin cabecera (lista pendiente, en error o vacía) vuelve a insets.top + 12. La cabecera es absoluta, se pinta tras el scroll y no lleva padding horizontal propio. El resto de la viñeta se mantiene.`

- **R13.2**: THE SYSTEM SHALL añadir un `it` que lea
  `docs/conventions.md` y exija el literal `**Excepción nombrada (enmienda #222, 2026-10-27)**`.
> Sin gate humano (decisión del leader, 2026-10-27): `docs/conventions.md` no es
> un documento de la carta y el mandato delega al leader los cambios en `docs/`;
> solo `docs/ui-guidelines.md` (G4) queda fuera de la delegación.

Test: `src/__tests__/tab-headers-canvas.test.ts` › `#222 R13: conventions.md recoge la excepción de la cabecera fija` (R13.2).

### R14 — Reparto de ficheros con otras features

- **R14.1**: THE SYSTEM SHALL tocar, en `src/screens/health/index.tsx`,
  `src/screens/food/index.tsx` y `src/screens/profile/index.tsx`, **solo** la
  región que va desde el inicio del `return` hasta el primer hijo de contenido
  (cabecera, encabezado, `paddingTop` del scroll, envoltorio `food-root`), más
  el cálculo de `scrollHint` y la constante `addPetCapsule`/`profile-top-row`.
  El interior de `health-content`, `health-states`, el contenido de Nutrición
  tras el selector y `profile-content` más allá de su primer hijo **no se
  toca** (lo tocan #208, #209, #214 y #224).
- **R14.2**: THE SYSTEM SHALL NOT definir ni referirse a ningún `testID` de
  otra feature en curso. En particular, no inventa los de #224 (tarjeta de IA
  de Nutrición, `food-ai-*`): si #224 aterriza antes que #222, su tarjeta
  queda dentro del `ScrollView` `screen-food`, bajo el primer hijo de
  contenido, sin cambios; si aterriza después, hereda `food-root`.
- **R14.3**: WHEN #222 envuelve el `ScrollView` de Nutrición en `food-root`,
  THE SYSTEM SHALL hacerlo con un diff mínimo: añadir la apertura
  `<View testID="food-root" className="flex-1">` y su cierre, **sin
  reindentar** el `ScrollView` ni su contenido (el móvil no tiene prettier).
- **R14.4**: THE SYSTEM SHALL conservar presentes, tras el cambio, los
  `testID` ajenos que la medida verifica: `vaccines-add`, `health-content`,
  `health-states` y `vaccine-reminder-notice` en Salud; `food-links`,
  `food-loading`, `food-error`, `food-retry`, `food-empty` y `food-plan-card`
  en Nutrición; `profile-hero`, `profile-pet-card`, `profile-content` y
  `screen-profile` en Perfil.
- **R14.5**: THE SYSTEM SHALL NOT añadir ninguna dependencia ni coste.
  Reutiliza `react-native-safe-area-context` (ya instalada) y no usa `expo-blur`.

Tests en `src/__tests__/tab-headers-canvas.test.ts` (mismo describe `#222`):

- `#222 R14: los testID de otras features siguen en su pantalla` (R14.4): `readSource(...)` `toContain` cada ancla.
- `#222 R14: TabPetHeader no llama a t() y SCREEN_FILES no crece` (R14.5, R1.7): `readSource('components/tab-pet-header.tsx')` `not.toMatch(/\bt\(/)`; el candado de suma de `SCREEN_FILES` (R8.4) se queda como está.

## Fuera de alcance

- **Opción B** (cabecera que se colapsa al desplazar) y **opción C** (pies de
  CTA fijos): descartadas en G1. Cada una sería otra feature.
- **El engranaje de Inicio** (el icono de ajustes del hero de Inicio): no se
  toca; Inicio mantiene su `PetSwitcher variant="glass"` con `trailing`.
- **Cabecera fija en Perfil**: Perfil conserva el hero que se desplaza con la
  foto (decisión D4 a de G1); no hay `TabPetHeader` en Perfil.
- **El título de `components/celebration.tsx`**: conserva
  `text-3xl font-black tracking-title text-foreground`.
- **La variante `glass` de `PetSwitcher`** (chips de 44, `gap-2`): el canvas de
  Perfil dibuja 40 y 8, pero #195 R9 y R10 fijan 44; no se enmienda aquí
  (ver [[design]] §Desviaciones).
- **Desenfoque real** (`BlurView`) de la cabecera: vidrio plano (D2).
- **El resto de pestañas y pantallas empujadas** (`Mapa`, `Alertas`,
  Recordatorios...): no se tocan.
- **Cambios de contenido** de Salud, Nutrición y Perfil bajo el primer hijo:
  son de #208, #209, #214 y #224.
- **Prueba de humo en dispositivo** (geometría del último chip cortado,
  lectura con TalkBack y VoiceOver, vidrio en claro y oscuro): gate humano G2,
  en lote al final de la ola (`progress/plan_ui-2026-10-26.md`). Jest no mide
  píxeles.

## Aprobación

> La spec la firma el leader por mandato delegado (CLAUDE.md, ampliación del
> 2026-10-26 UI), tras la checklist de `progress/plan_canvas-parity-2026-10-23.md`
> §4 y los tres puntos de `progress/plan_ui-2026-10-26.md` §4. Las enmiendas a
> los documentos de la carta no se delegan: llevan su casilla propia.

- [x] Aprobado por humano (fecha: 2026-10-27, firma delegada del leader: mandato 2026-10-23 ampliado 2026-10-26; G1 aprobado por el humano sobre canvas v153)
- [ ] G4 — Enmienda #222 a `docs/ui-guidelines.md` (regla N1, R12) aprobada por humano (fecha: ____) ← gate humano, no delegado; sin marcar, R12 no se ejecuta
- [ ] G2 — Prueba de humo en dev build de Android (R1 a R7: cabecera fija, 10 de separación, último chip cortado con 8 o más mascotas, encabezado leído por TalkBack, claro y oscuro) superada por el humano (fecha: ____) ← en lote, al final de la ola

Tras la implementación, el humano marca la línea de firma de cada bloque
`## Enmienda #222` (`- [ ]` a `- [X]`) en los siete documentos de R11 y R12. El
leader no cierra la feature mientras G4 o G2 estén sin marcar.
