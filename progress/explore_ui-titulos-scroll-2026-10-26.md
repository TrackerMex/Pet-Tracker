# explore: ui-titulos-scroll (quitar títulos de pestaña a favor del selector de avatares + scroll con algo fijo)
Fecha: 2026-10-26
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui` (branch `docs/ui-ola0-mejoras`). Solo lectura de código.

Convención de evidencia: rutas relativas a `mobile-pet-tracker/` salvo `specs/` y `docs/`. Cada ancla lleva el contenido a buscar con `grep -nF`; los números de línea son los medidos hoy y **caducan** (memoria `lo-que-se-desplaza-no-es-ancla`). Premisas verificadas contra el árbol, no contra explores previos.

---

## 0. Resumen ejecutivo

1. Los «avatares» de Salud, Nutrición, Perfil, Inicio, Recordatorios y Vinculación son **siempre el selector de mascotas** (`PetSwitcher`), un chip por mascota. Corrección del humano confirmada por el código: en Salud los dos avatares son **dos mascotas distintas** (misma foto de prueba), no un duplicado. No existe ningún avatar de usuario salvo `me-avatar` (iniciales) dentro de la `me-card` al final de Perfil.
2. El título grande comparte fila con el selector en **Salud** (`health-header`) y **Nutrición** (`food-title-row`), con la cápsula «Añadir mascota» en **Perfil** (`profile-title` + `profile-add-pet`), y con el CTA «+ Nuevo» en **Recordatorios** (`ScreenHeader` + `PetSwitcher` debajo). Quitar el título libera la fila para el selector.
3. Quitar el título **revierte la decisión N1 de #168** (canvas) y toca 9+ specs, ~12 ficheros de test, 3 filas de `ui-copy-table.ts` y la carta `docs/ui-guidelines.md`. Todo está listado en §3. El título de **navegación/accesibilidad** (etiqueta de pestaña, `title: ''` de las cabeceras nativas, `accessibilityRole="header"` de las secciones) **no se toca**.
4. El engranaje flotante de Inicio es **casi seguro** el botón de herramientas de `expo-dev-client` (no existe en el código de la app). Confirmación definitiva: abrir un build de producción/preview y ver que desaparece.
5. Scroll: hoy **todo** lo que no es la barra flotante ni `add-pet`/`geofence-editor` se va con el scroll (cabecera, CTA, selector). No hay código ligado al scroll (cero `useAnimatedScrollHandler`, `Animated.ScrollView`, `onScroll`, `stickyHeaderIndices`). Se proponen 3 opciones cerradas (§6) y se recomienda **una** (A: cabecera fija con el selector de avatares, hermana del `ScrollView`).

---

## 1. Contexto encontrado: título, avatar y layout por pantalla

### 1.1 Qué es cada avatar (respuesta a las dudas del coordinador y el humano)

`src/components/pet-switcher.tsx` tiene tres variantes. Ancla: `variant` en las props y las ramas `avatars`, `glass`, default.

| Variante | Aspecto | Quién la usa |
|---|---|---|
| `default` | `Avatar` de HeroUI `sm` con inicial de fallback | Recordatorios (`screens/reminders/index.tsx`), Vinculación (`screens/pairing`) |
| `avatars` | círculos de 40 px, el seleccionado con `border-2 border-accent p-0.75` (el «anillo verde»), un `testID="pet-chip-<id>"` por mascota | Salud (`screens/health/index.tsx`) y Nutrición (`screens/food/index.tsx`) |
| `glass` | no seleccionada = `GlassCircle` con inicial; seleccionada = anillo 44 px + `PetAvatar` 36 + punto online opcional + `trailing` | Inicio (slot `home-hero-actions`) y Perfil (`profile-hero-top`) |

Respuestas a lo que vio el humano en las capturas:

- **Salud, dos avatares**: dos mascotas, no un duplicado. Un `pet-chip-<id>` por elemento de la lista; el anillo verde marca `selectedPetId`. Se parecen porque comparten la foto de prueba (`PetAvatar` usa la foto con `expo-image` o, sin foto, `blobatar(name)`).
- **Perfil, chip «J»**: **no es el usuario**. Es la mascota no seleccionada «J» pintada como `GlassCircle` con su inicial; la seleccionada es el anillo con foto en la misma fila. «+ Añadir mascota» es `profile-add-pet`, no tiene que ver con el usuario.
- **Recordatorios, «J / C»**: `PetSwitcher` variante `default` con las iniciales de dos mascotas (J y C).
- **Avatar de usuario**: solo `me-avatar` / `me-avatar-initials` (iniciales del usuario, `size-8.5`, oculto a accesibilidad) dentro de `me-card`, al final de `screens/profile/index.tsx`. No hay avatar de usuario en ninguna cabecera.
- **Selección global**: `src/hooks/use-pet-selection.ts` + `providers/selected-pet-provider.tsx` guardan un único `selectedPetId` (se reinicia al cambiar el token). Cambiar de mascota en una pestaña la cambia en todas; por eso el mismo selector aparece en seis pantallas.

### 1.2 Inventario de pantallas: dónde está el título, dónde el avatar, qué layout hay

Pestañas (`src/app/(tabs)/_layout.tsx`: `Tabs screenOptions={{ headerShown: false, animation: 'fade' }}` con `tabBar` = `FloatingTabBar`; **JS Tabs, no NativeTabs**):

| Pantalla | Título visible hoy | Avatar hoy | Layout hoy (ancla) | Cabecera con el avatar en el hueco del título |
|---|---|---|---|---|
| Inicio `screens/home/index.tsx` | Ninguno con mascotas (la rama sin mascotas pinta `home.home` con `text-26`) | `PetSwitcher glass` + `home-add-pet` + `home-alerts-bell` en el slot `home-hero-actions` de `PetHeroHeader variant="bleed"` | `ScrollView` sin `paddingTop`; el hero (`PET_HERO_MEDIA_HEIGHT = 430`) lo absorbe | Ya cumple: no hay título, el avatar ocupa el slot superior. **Sin cambio de título.** |
| Mapa `screens/map` | Ninguno | `map-pet-pill` flotante | Overlays absolutos (`map-stats` a `bottom: insets.bottom + 96`) | Sin cambio. No hay `ScrollView`. |
| Salud `screens/health/index.tsx` | `health-title` («Salud», `text-3xl font-black tracking-title text-foreground`, `t('health.health')`) | `PetSwitcher variant="avatars"` a la derecha de la misma fila, solo si hay mascotas | `ScrollView testID="screen-health"` con `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96`; fila `health-header` = `flex-row items-center justify-between` | Quitar `health-title`; `health-header` queda con el selector (ver §2) |
| Nutrición `screens/food/index.tsx` | `food-title` (misma clase literal, `t('food.food')`) | `PetSwitcher variant="avatars"`, igual | `ScrollView testID="screen-food"` con `paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96, gap: 14`; fila `food-title-row` | Quitar `food-title`; `food-title-row` queda con el selector |
| Perfil `screens/profile/index.tsx` | `profile-title` («Perfil»): con hero `text-accent-foreground` (blanco sobre la foto), sin hero `text-foreground` | Con hero: `PetSwitcher glass` justo debajo de la fila de título, dentro de `profile-hero-top` (slot `pet-hero-slot` a `top: insets.top + 12`). Sin hero: ninguno | `titleRow` = `profile-title` + `profile-add-pet` (cápsula `h-11 … bg-glass-surface-strong px-4` con hero; `h-9 … bg-tab-pill px-3.5` sin hero) | Quitar `profile-title`; la fila queda con el selector `glass` + `profile-add-pet` (el CTA necesita sitio, ver §2.3) |

Pantallas empujadas (todas con `headerShown: false` salvo las dos indicadas; el título vive en el contenido):

| Pantalla | Título | Avatar | Notas |
|---|---|---|---|
| Recordatorios `screens/reminders/index.tsx` | `ScreenHeader testID="reminders"` (volver + título, `accessibilityRole="header"`) con accesorio `reminders-add-link` («+ Nuevo») | `PetSwitcher` default **debajo** del header, dentro del `ScrollView` | El patrón «título + selector» existe también aquí, pero con `ScreenHeader` y flecha de volver; es pantalla empujada, no pestaña |
| Vinculación `screens/pairing` | Cabecera condicional | `PetSwitcher` default | Idem |
| Docs, peso (`weight-log`), horario de comidas, historial de comidas, geocercas, detalle de alerta, añadir recordatorio | `ScreenHeader` dentro del scroll | Sin selector (la mascota viene por ruta) | Fuera del alcance del cambio de avatar |
| Alertas | `ScreenHeader` en `ListHeaderComponent` de un `FlatList` | Sin selector | `onEndReached` |
| `edit-profile`, `docs-upload` / `docs-upload-form` | Cabecera **nativa** con `title: ''` (`headerOptions` en `src/app/_layout.tsx`); `edit-profile` pinta además `edit-profile-title` (`text-3xl`) en contenido | Sin selector | Excepción A11 de la carta; fuera del alcance |
| Auth (login, register, forgot, reset-password), welcome | Título en contenido | Sin | Fuera del alcance |
| `add-pet` | `ScreenHeader` **fijo** + barra de pasos fijos sobre el `ScrollView`, pie fijo `add-pet-footer` | Sin | Es el único patrón «algo fijo» ya existente en una pantalla de formulario |
| `geofence-editor` | Fila flotante (volver + título) con blur sobre el mapa | Sin | Hoja inferior con `ScrollView` y `geofence-editor-save` |

**Patrón repetido a tratar**: «fila superior con título + selector de mascotas» solo existe como fila única en Salud, Nutrición y Perfil. Recordatorios y Vinculación tienen selector pero **debajo** de un `ScreenHeader` con flecha de volver (no se pierde espacio del título; el título ahí es un título de pantalla empujada y se queda). Inicio ya tiene el avatar en el hueco superior.

---

## 2. Propuesta de cabecera sin título (para decidir con el humano)

### 2.1 Salud y Nutrición

Fila superior = solo el selector, con el mismo `paddingTop: insets.top + 12`. Cierres de decisión posibles (marcar una):

- **H1 (mínima)**: `health-header` / `food-title-row` se quedan, sin el hijo `*-title`; el selector `variant="avatars"` (40 px) alineado a la izquierda (`justify-start`). Cambio más pequeño, mismo componente.
- **H2 (avatares más grandes)**: igual que H1 pero subiendo el chip a 44-48 px, ahora que la fila está libre. Exige tocar `pet-switcher.tsx` (la variante `avatars` es compartida) y su test `components/__tests__/pet-switcher.test.tsx`.
- **H3 (avatar + nombre)**: el selector más el nombre de la mascota seleccionada como texto grande en la misma fila (el «título» pasa a ser el nombre de la mascota). Conserva identidad de pantalla pero **reintroduce un texto grande**, que es lo que el humano quiere quitar. Solo si el humano lo pide.

Detalles que la spec debe cerrar:

- **Sin mascotas** (rama vacía / carga): hoy la fila solo lleva el título. Sin título ni selector la fila queda **vacía**. Cierre: (a) la fila no se pinta y la primera sección sube; (b) se pinta un encabezado oculto a la vista pero accesible. Ver §2.4.
- **Una sola mascota**: el selector es un único círculo con anillo. Decidir si se pinta (consistente) o se oculta (sin función: no hay a quién cambiar).
- **Desbordamiento**: la variante `avatars` es una fila de círculos de 40 px. Con muchas mascotas se sale de 390 px (`24` de padding en Salud, `20` en Nutrición). Hoy el título comparte el ancho; sin título hay más sitio pero sigue sin haber scroll horizontal ni `flex-wrap`. Medir en el código de la variante antes de firmar.

### 2.2 Perfil

Con hero (foto, `PetHeroHeader variant="bleed"`): `profile-hero-top` pasa a contener solo el `PetSwitcher glass` y `profile-add-pet`. Decisión de colocación de «Añadir mascota»:
- **P1**: misma fila que el selector, a la derecha (como hoy el selector `glass` admite `trailing`; Inicio ya lo usa para `home-add-pet`). Reutiliza la variante `trailing`.
- **P2**: icono-solo (`GlassCircle` con `Plus`) como `home-add-pet`, para igualar a Inicio. Cambia el texto visible «Añadir mascota» (copy bloqueado por `ui-copy-table.ts`, `profile.addPet`).

Sin hero: la fila queda como primer hijo de `profile-content`, con `PetSwitcher` (hoy no lo lleva sin hero porque no hay mascotas: R2.2 de #196 dice «sin `PetSwitcher`»; sin mascotas solo quedaría `profile-add-pet`).

Importante: con el título fuera, la foto del hero queda sin texto superpuesto; el contraste del selector `glass` sobre la foto ya está resuelto (Inicio lo usa igual).

### 2.3 Recordatorios, Vinculación (otras pantallas con el patrón)

No hay título que quitar en el sentido del humano (el título está en `ScreenHeader` con flecha de volver, y es pantalla empujada). Si se quiere uniformidad: poner el `PetSwitcher` a la derecha de `ScreenHeader` en el hueco del `accessory`, desplazando «+ Nuevo». Es una **decisión aparte**; no se recomienda en este corte (la flecha de volver necesita su título a la vista para orientar).

### 2.4 Título de navegación / accesibilidad que **debe quedarse**

| Elemento | Dónde | Por qué se queda |
|---|---|---|
| Etiqueta de pestaña | `src/components/floating-tab-bar.tsx`, array `TABS` con `labelKey: 'tabs.health' \| 'tabs.food' \| 'tabs.profile'`; `accessibilityRole="tablist"` | Es la navegación; las claves `tabs.*` son otras claves del catálogo que `health.health` |
| Títulos de cabecera nativa | `src/app/_layout.tsx`: `title: ''` en `docs-upload` y `edit-profile`; `Tabs` con `headerShown: false` | Ya están vacíos o ausentes |
| Encabezados de sección | `vaccines-title` con `accessibilityRole="header"` (Salud) y los de Nutrición | Sirven de ancla al lector de pantalla |
| `ScreenHeader` | `src/components/screen-header.tsx`, título con `accessibilityRole="header"` | Pantallas empujadas |

Hecho verificado: `health-title` y `food-title` **no tienen `accessibilityRole`** hoy, así que quitarlos no elimina un encabezado accesible. Pero sí quita el **único texto** que anuncia la pantalla al abrirla. Cierre posible:
- **A1**: el selector lleva `accessibilityLabel` por chip (ya existe por mascota) y se acepta que el lector anuncie la pestaña por la tabla de pestañas.
- **A2**: añadir un `Text` oculto visualmente con `accessibilityRole="header"` y el literal actual (`t('health.health')`). Mantiene `ui-copy-table.ts` vivo (la clave sigue usada) y evita borrar copy. Contra: un texto «sr-only» no se ve en pantalla y los candados visuales del test hay que reescribirlos.

---

## 3. Candados que el cambio revierte (para nombrarlos en la spec nueva)

Es una reversión de la decisión **N1 de #168** («Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader»). La spec nueva debe ser una **enmienda** a #168 y a las specs que la heredaron, con aprobación humana. Lista cerrada:

### 3.1 Specs en `specs/`

| Spec | Qué fija | Ancla |
|---|---|---|
| `mobile-tab-headers-canvas` (#168) | R1.1-R1.3 título grande en las tres pestañas; R2.3/R2.4; R11 (enmiendas); `**Regla N1 (enmienda B4 de #168)**` (~L403); `design.md`, `tasks.md`, `traceability.md` | `grep -nF "título grande" specs/mobile-tab-headers-canvas/requirements.md` |
| `mobile-canvas-foundations` (#197) | R4 `tracking-title` del literal en food/celebration/health/profile (~L229, L612, L716) | `grep -nF "tracking-title" specs/mobile-canvas-foundations/requirements.md` |
| `mobile-canvas-health-weight` (#199) | R12 `health-header`; R13 selector dentro de la cabecera (~L714, L751-754) | `grep -nF "health-header" specs/mobile-canvas-health-weight/requirements.md` |
| `mobile-canvas-nutrition` (#200) | R2: `food-title-row` con className exacta `flex-row items-center justify-between`, primer hijo `food-title`, segundo `PetSwitcher variant="avatars"`; tests `#200 R2: los avatares comparten fila con el título` y `#200 R2: sin mascotas la fila solo lleva el título` (~L126, L194-212, L703) | `grep -nF "food-title-row" specs/mobile-canvas-nutrition/requirements.md` |
| `mobile-profile-photo-hero-canvas` (#196) | R2.1 (`profile-title` con `text-accent-foreground`), R2.2 (sin hero), R2.3 icono `profile-add-pet-icon`, R5 (K2, K9, K11, K39, E1.2 `toBeVisible()` del título «Perfil» con `listPets` pendiente, E3); regla N1 enmendada (~L213, L287-295, L523, L594) | `grep -nF "profile-title" specs/mobile-profile-photo-hero-canvas/requirements.md` |
| `mobile-tab-screens-canvas-fidelity` (#173) | R5 cápsula tras el título; R4 `avatars` solo en Perfil (enmendado por #200 R2); ~L311, L720 | `grep -nF "avatars" specs/mobile-tab-screens-canvas-fidelity/requirements.md` |
| Bloques de enmienda de #168 en otras specs | `mobile-health-make-parity` (~L137, L610-617), `mobile-pet-hero-header` (~L563), `mobile-kcal-consumed-bar` (~L485), `mobile-celebrations-and-living-empty` (~L1089), `mobile-ui-language` (~L400) | `grep -rnF "Enmienda #168" specs/` |
| `mobile-empty-states-pingo` (#155 R4) | Orden de hermanos de las ramas vacías (puede cambiar al quitar el primer hijo de la fila) | `grep -nF "R4" specs/mobile-empty-states-pingo/requirements.md` |

`mobile-edit-profile` (`edit-profile-title`) es pantalla empujada: **fuera**.

### 3.2 Tests y candados en `mobile-pet-tracker/src`

| Fichero | Qué fija | Ancla |
|---|---|---|
| `__tests__/tab-headers-canvas.test.ts` | `#168 R1` (dos `it` sobre el recuento y la lista de ficheros del literal `TAB_TITLE_168`), vetos `#168 R12` sobre `TAB_SCREENS_168`, `#196 R11` (texto de la carta `**Regla N1 (enmienda #196)**`) | `grep -nF "TAB_TITLE_168" src/__tests__/tab-headers-canvas.test.ts` |
| `__tests__/canvas-foundations.test.ts` | `#197 R4`: el literal `text-3xl font-black tracking-title text-foreground` en food/celebration/health/profile (~L136-143) | `grep -nF "tracking-title" src/__tests__/canvas-foundations.test.ts` |
| `__tests__/profile-photo-hero-canvas.test.ts` | Fila `n:3` con el literal `text-3xl font-black tracking-title text-accent-foreground` | `grep -nF "text-accent-foreground" src/__tests__/profile-photo-hero-canvas.test.ts` |
| `__tests__/profile-canvas-fidelity.test.ts` | `#173 R4`/`#196` `variant="avatars"` solo en food y health (~L37-40) | `grep -nF 'variant="avatars"' src/__tests__/profile-canvas-fidelity.test.ts` |
| `__tests__/hero-header-amendments.test.ts` | `AMENDED_DOCS_168`; el 4.º marcador es el texto N1 de `docs/ui-guidelines.md` (~L131-215) | `grep -nF "AMENDED_DOCS_168" src/__tests__/hero-header-amendments.test.ts` |
| `__tests__/ui-copy-table.ts` + `__tests__/ui-language.test.ts` | Filas `health.health` (~L162), `food.food` (~L211), `profile.profile` (~L296) con `checkUses(ALL_USES)`; el recuento `SCREEN_FILES` (~L494-515). Si el literal deja de usarse, la fila **tiene que borrarse** o el candado falla | `grep -nE "health\.health\|food\.food\|profile\.profile" src/__tests__/ui-copy-table.ts` |
| `i18n/catalog.ts` | Claves `health.health` (~L186/L646), `food.food` (~L218/L678), `profile.profile` (~L266/L726), en inglés y español | `grep -nE "'(health\|food\|profile)\.(health\|food\|profile)'" src/i18n/catalog.ts` |
| `__tests__/design-drift.test.ts` | Literales D-H (~L33/38/70/75/115/123) — **se quedan** para pantallas empujadas; `#87 R19` recuentos por pantalla | `grep -nF "text-3xl" src/__tests__/design-drift.test.ts` |
| `screens/health/index.test.tsx` | Salud: ~L237, L1002, L1016, L1031-1047, L1056-1063, L1154-1177 (título, `health-header`, selector) | `grep -nF "health-title" src/screens/health/index.test.tsx` |
| `screens/food/index.test.tsx` | ~L269, L1185, L1248, L1529, L1540 | `grep -nF "food-title" src/screens/food/index.test.tsx` |
| `screens/profile/index.test.tsx` | ~L312-324, L698, L707, L1333-1339, L1969, L2242, L2314-2345, L2359-2373, L2407-2412 | `grep -nF "profile-title" src/screens/profile/index.test.tsx` |
| `components/__tests__/pet-switcher.test.tsx` | ~L105 (variantes) | `grep -nF "variant" src/components/__tests__/pet-switcher.test.tsx` |
| `app/(tabs)/__tests__/food.test.tsx`, `app/(tabs)/__tests__/screens.test.tsx` | `#168 R1 pinta el título grande ($name)`; `R5: placeholders de tabs` (`getByText('Perfil')`) | `grep -rnF "título grande" "src/app/(tabs)/__tests__"` |
| `components/__tests__/celebration.test.tsx` | `#171 R20`: la celebración usa el mismo literal `TAB_TITLE_168`. **La celebración también lleva ese título**: decidir si cae con las tres pestañas | `grep -nF "#171 R20" src/components/__tests__/celebration.test.tsx` |

Antes de firmar, recontar con `grep` los `it` que citan `health-title`, `food-title` y `profile-title` en **todo** `src/` (memoria `candado-catalogo-omitido-en-specs`): los números de arriba son medidos hoy y caducan.

### 3.3 `docs/ui-guidelines.md`

- Sección `## Enmienda #168 …` y párrafo `**Regla N1 (enmienda #196)**` (~L556-570): se reemplaza por la regla nueva. Está candado por `hero-header-amendments.test.ts` y `tab-headers-canvas.test.ts` (`#196 R11`).
- ~L279: «Títulos de pantalla: título en contenido y cabecera nativa con `title: ''`» — se queda para pantallas empujadas; añadir la excepción de las pestañas.
- ~L660 (D-H) y ~L892 (`tracking-title`), ~L897 (`ScreenHeader`): se quedan para pantallas empujadas; revisar que no digan «todas las pestañas».
- ~L110-140 (regla 6 de dimensiones, excepciones A9, A11, #202): revisar si la fila con el selector necesita su excepción.
- ~L794-798 frente a ~L960: **inconsistencia previa** (CTA de `add-pet` «dentro del scroll» frente a «pie fijo»). Registrar como deuda; la opción C (§6) la zanja.

---

## 4. Engranaje flotante de Inicio

Evidencia a favor de «herramientas de `expo-dev-client`»:
- `package.json`: `expo-dev-client ~57.0.14`; `eas.json`: `build.development.developmentClient: true`.
- En todo `src/` no hay icono de engranaje propio. Solo `Linking.openSettings` (permisos) y `uiSettings` del mapa (opciones del SDK de mapas, sin botón).
- El botón flota sobre **todas** las pantallas, no solo Inicio, lo que es típico de una capa nativa, no de una pantalla.

**Conclusión**: herramienta de desarrollo, no UI de la app. No requiere cambio de spec. Salvedad: `node_modules` no estaba instalado en el worktree, por lo que no pude leer el fichero del paquete; la confirmación definitiva es abrir un build `preview` o `production` y comprobar que desaparece. Si el humano lo molesta para los smokes, `expo-dev-client` ofrece ocultarlo desde su menú (no es un cambio de código).

---

## 5. Inventario de scroll

Reglas comunes: `paddingTop: insets.top + 12` y `paddingBottom: insets.bottom + 96` en pestañas (la barra flotante mide `h-16` con `bottom: insets.bottom + 12`); `+ 24/32/40` en pantallas empujadas. Edge-to-edge activo por defecto (RN 0.86 / SDK 57): `adjustResize` **no** encoge la raíz; todos los formularios envuelven en `KeyboardAvoidingView behavior="padding"` (`keyboardVerticalOffset` = alto de cabecera en `edit-profile` y `docs-upload-form`, 0 en el resto). Memoria `teclado-edge-to-edge-kav`.

| Pantalla | Contenedor | Cabecera | CTA / selector | Fijo hoy |
|---|---|---|---|---|
| Inicio | `ScrollView`, hero bleed | Hero + slot de acciones (avatar, `home-add-pet`, campana) | Sin CTA propio | Nada: el hero y sus acciones **se van con el scroll** |
| Salud | `ScrollView` | `health-header` (título + selector) | `health-retry` / `vaccines-retry` en el contenido | Nada |
| Nutrición | `ScrollView` | `food-title-row` | CTAs en `food-plan-card`/`food-plan-empty` | Nada |
| Perfil | `ScrollView` | `profile-hero-top` (con hero) o `titleRow` | `profile-add-pet`, `change-photo` (píldora de cámara en la foto), `profile-sign-out` | Nada |
| Recordatorios | `ScrollView` | `ScreenHeader` + selector | `reminders-add-link` («+ Nuevo») en el `ScreenHeader` | Nada |
| Docs | `KeyboardAvoidingView` + `ScrollView` | `ScreenHeader` | — | Nada |
| Peso (`weight-log`) | KAV | `ScreenHeader` | `weight-submit` **dentro** del scroll | Nada |
| Horario / historial de comidas | `ScrollView` | `ScreenHeader` | CTAs «Editar», «Añadir comida» | Nada |
| Geocercas | `ScrollView` | `ScreenHeader` | `geofences-add` (`mt-auto`, al final del contenido) | Nada |
| Alertas | `FlatList` (`ListHeaderComponent` = `ScreenHeader`, `onEndReached`) | En el header de la lista | Reconocer por fila | Nada |
| Detalle de alerta | `ScrollView` | `ScreenHeader` | — | Nada |
| Añadir recordatorio | KAV | `ScreenHeader` | `add-reminder-submit` dentro del scroll | Nada |
| Vinculación | KAV | Condicional | — | Nada |
| `edit-profile`, `docs-upload-form` | KAV + `ScrollView` | Cabecera **nativa** (`title: ''`) | Guardar en contenido | Cabecera nativa |
| Auth (login, register, forgot, reset-password), welcome | KAV + `ScrollView` | Título en contenido | CTA dentro | Nada |
| `add-pet` | `ScrollView` | `ScreenHeader` + barra de pasos **fijos** | `add-pet-continue` / `add-pet-submit` en `add-pet-footer` **fijo** | Cabecera, pasos y pie |
| `geofence-editor` | Hoja inferior con `ScrollView` sobre un mapa | Fila volver+título con blur | `geofence-editor-save` en la hoja | Mapa, fila superior |
| Mapa | Sin scroll | Overlays absolutos | `map-stats`, `map-pet-pill` | Todo |
| Barra de pestañas | `FloatingTabBar` (`absolute`, `BlurView`/`GlassView`) | — | — | **Siempre fija** |

Hechos relevantes para las opciones:
- **No hay código ligado al scroll** (verificado: cero `useAnimatedScrollHandler`, `Animated.ScrollView`, `onScroll`, `stickyHeaderIndices` en `src/`). Todo es estático.
- Instalado: `react-native-reanimated 4.5.1`, `react-native-gesture-handler ~2.32`, `react-native-screens ~4.26`, `react-native-safe-area-context ~5.7`, `expo-blur`, `expo-glass-effect`. **No** hay `flash-list` ni `keyboard-controller`.
- Los tests de pantalla usan un doble de Reanimated (memoria `doble-reanimated-sin-esmodule`): cualquier `useAnimatedScrollHandler` obliga a ampliar ese doble en cada fichero de test de pantalla afectado.

---

## 6. Opciones para «algo fijo al hacer scroll» (propuesta, no implementación)

Todas son compatibles con **JS `Tabs` + `FloatingTabBar`** (no hay NativeTabs): la barra ya es una capa absoluta fuera del scroll. Con NativeTabs el contenido cambiaría de padre y habría que revisar la inserción inferior; no aplica hoy.

### Opción A — Cabecera fija con el selector de avatares (hermana del `ScrollView`)

La fila `health-header` / `food-title-row` / `profile-hero-top` (selector sin título) sale del `ScrollView` y se pinta encima, como `add-pet` ya hace con su `ScreenHeader`. El contenido scrollea debajo.
- Pros: cambiar de mascota al instante en cualquier punto del scroll; patrón ya existente (`add-pet`), cero dependencia nueva, no necesita Reanimated (sin `onScroll`); resuelve el uso real del avatar (cambiar mascota). Sin título, la fila fija mide solo ~52-60 px.
- Contras: roba altura al contenido (se resta siempre); el `paddingTop` del `ScrollView` baja de `insets.top + 12` a ~0 (candado `#200 R2`: el `contentContainerStyle` exacto se reescribe); en Perfil con hero el selector está sobre la foto, que scrollea (la fila fija tendría que ser translúcida o repetirse).
- Coste: medio-bajo. Tocar 3 pantallas y sus tests; alto en Perfil (hero). Variante A+: borde de 1 px que aparece al hacer scroll (necesita `onScroll`, sube el coste).
- Cabecera translúcida con `BlurView`/`GlassView` (como `FloatingTabBar`): posible; en Android el blur de `expo-blur` es menos fiable que en iOS, y el rendimiento hay que medir.

### Opción B — Cabecera colapsable con el avatar

El selector se encoge/oculta al bajar y reaparece al subir (Reanimated 4.5.1: `useAnimatedScrollHandler` + `Animated.ScrollView` + `interpolate`/`useAnimatedStyle`).
- Pros: la mejor sensación; el contenido gana altura al bajar; coherente con el hero de Inicio.
- Contras: es el coste más alto: no existe nada ligado al scroll hoy; cada test de pantalla necesita el doble de Reanimated ampliado y las sondas de animación; riesgo de parpadeo en Android con teclado/edge-to-edge; la memoria `ventana-de-timer-en-specs-de-spring` y `toHaveAnimatedStyle` aplican (medir con `shouldMatchAllProps`).
- Coste: alto. Recomendable solo si A se queda corta tras probarla.

### Opción C — CTA fijo inferior y selector «pegajoso» (formularios y listas)

Pantallas con CTA dentro del scroll (`weight-submit`, `add-reminder-submit`, `geofences-add`, `docs-upload-form`, `edit-profile`) pasan a un pie fijo como `add-pet-footer` (con `insets.bottom` + KAV). En listas largas, `stickyHeaderIndices` fija un sub-encabezado (un selector o segmentado).
- Pros: patrón ya aprobado (`add-pet-footer`); el CTA nunca se pierde; zanja la inconsistencia de la carta (~L794-798 frente a ~L960); `stickyHeaderIndices` es nativo de `ScrollView`/`FlatList`, sin Reanimated.
- Contras: no resuelve el avatar de las pestañas (las pestañas **no** tienen CTA inferior: ya tienen la barra flotante abajo); en pestañas el pie fijo chocaría con `FloatingTabBar`; hay que cuadrar el teclado en edge-to-edge (memoria `teclado-edge-to-edge-kav`).
- Coste: medio por pantalla (~6 pantallas), pero independiente de la pregunta de avatares.

### Recomendación (una)

**Opción A** para las pestañas: cabecera fija con el selector de avatares, sin título, hermana del `ScrollView`. Es lo único que responde a la petición del humano («algo fijo en todas las vistas» + «avatar en el hueco del título») con el menor coste y sin tocar Reanimated. **C** queda como segundo corte para los formularios (no se mezcla en la misma spec: toca otras pantallas y otros candados). **B** solo si, probada A en dispositivo, el humano echa de menos el colapso.

Para Perfil con hero y para Inicio queda una **decisión abierta** (ver §7, D4): ahí el selector está sobre la foto y la fila fija requiere una de dos soluciones.

---

## 7. Riesgos y decisiones abiertas (opciones cerradas)

### Riesgos

- **R-1 Reversión amplia**: revierte N1 de #168 (canvas). Spec nueva = enmienda a #168, #196, #197, #199, #200, #173 con bloque de enmienda verificable por `hero-header-amendments.test.ts`. Sin la enmienda el candado `#196 R11` y `AMENDED_DOCS_168` se ponen en rojo.
- **R-2 Copy huérfano**: si el título desaparece, las filas `health.health`, `food.food`, `profile.profile` de `ui-copy-table.ts` dejan de tener uso y `checkUses(ALL_USES)` falla, y el recuento `SCREEN_FILES` de `ui-language.test.ts` cambia (memoria `candados-agregados-65-r18`). Decidir de entrada si las claves se borran o se conservan para el texto oculto (A2).
- **R-3 Pérdida del único anuncio de pantalla** para lector de accesibilidad si no se decide A1/A2.
- **R-4 Fila vacía** sin mascotas (carga y estado vacío) y **desbordamiento** con muchas mascotas en la variante `avatars`.
- **R-5 Contraste en Perfil** (selector sobre la foto) y colocación de «Añadir mascota» sin título que la acompañe.
- **R-6 Hoja de cálculo de dimensiones**: la opción A baja el `paddingTop` del scroll a casi 0; tocar el `contentContainerStyle` exacto de `#200 R2` y de Salud (`padding: 24`), y revisar la regla 6 de la carta (`insets.top + 12`) y las excepciones A9/A11/#202.
- **R-7 Premisas de explore sin verificar** (memoria `premisas-de-explore-sin-verificar`): números de línea y recuentos de §3 son de hoy; el `spec_author` debe recontar con `grep` por contenido antes de firmar.
- **R-8 Los tests de pantalla** con doble de Reanimated y `renderRouter` (memorias `renderrouter-sin-await-fuga-entre-its`, `rntl14-fireevent-asincrono`) aplican si se añade cualquier cosa animada (opción B o A+).

### Decisiones abiertas (marcar una por línea)

- **D1 — Contenido de la fila superior**: H1 solo selector 40 px / H2 selector más grande (44-48 px) / H3 selector + nombre de la mascota.
- **D2 — Título para lectores**: A1 sin encabezado (la pestaña basta) / A2 encabezado oculto con el literal actual.
- **D3 — Perfil, «Añadir mascota»**: P1 cápsula con texto a la derecha del selector / P2 icono-solo como Inicio.
- **D4 — Cabecera fija en Perfil con hero e Inicio**: (a) mantener hero y selector scrolleando con la foto (solo Salud y Nutrición pasan a cabecera fija) / (b) añadir un selector translúcido fijo que aparece al bajar (sube el coste, requiere `onScroll`).
- **D5 — Una sola mascota**: pintar el selector igualmente / ocultarlo.
- **D6 — Celebración** (`celebration`, comparte el literal de título): cae con las tres pestañas / se queda con su título.
- **D7 — Alcance del scroll**: solo opción A en pestañas / A + C para formularios en la misma spec / A ahora y C en spec aparte (recomendado).
- **D8 — Engranaje**: se descarta como dev-client / se pide al humano confirmarlo en un build `preview` antes de cerrar.

---

## 8. Recomendación

- Spec única `mobile-tab-avatar-header` (nombre a decidir por el `spec_author`) que **enmiende** N1 de #168 para Salud, Nutrición y Perfil y especifique: fila superior con el selector sin título (H1 por defecto), `health-title`, `food-title` y `profile-title` eliminados, el título de navegación intacto, copy de `ui-copy-table.ts` decidido por D2, y la lista cerrada de §3 con cada `it` que cambia.
- Cabecera fija (opción A) para Salud y Nutrición. Perfil: decidir D4 antes de especificar, porque cambia el árbol (`pet-hero-slot` y `PetHeroHeader`).
- No mezclar el cambio visual de avatares con el cambio de scroll de formularios (opción C): dos specs, dos conjuntos de candados.
- Recontar por `grep` por contenido los candados al escribir la spec; el implementador (Codex) necesita `testID`, clase y literal de cada fila de §3.
