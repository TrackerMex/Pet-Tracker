---
feature: "mobile-pet-hero-header"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-pet-hero-header]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y sus alternativas descartadas,
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI que gobierna
> todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:334-365` — el hero de la Home
> del Figma Make. Informe de origen: `progress/explore_design-gap-vs-make.md`
> §2 y §7 (Bloque 1).
>
> **Base de medición**: todo delta de esta spec se mide contra `main` en el
> commit **`303fc19`** (merge del PR #111, #66). Ningún requisito congela un
> recuento absoluto: se fijan deltas y consistencias internas, porque un número
> absoluto caduca entre que se escribe la spec y se implementa.
>
> **Esta feature rompe a propósito el invariante de #46/#61/#62.** Aquéllas
> prohibían cambiar estructura, testIDs y conducta; #67 **es** un cambio de
> estructura de pantalla, y por eso enumera en R10 las enmiendas que necesita
> de specs ya aprobadas.

---

## 0. Premisas corregidas antes de empezar

Dos afirmaciones del enunciado de #67 en `feature_list.json` son **falsas contra
el código real** y esta spec las corrige por escrito. No se re-litigan: el
humano ya cerró la sustitución el 2026-09-06.

### 0.1 El respaldo sin foto es **blobatar**, no una inicial (decisión D1)

El enunciado de #67 dice que el hero sin foto va *"degradado con la inicial, que
es el patrón que ya usa pet-avatar"*. **`pet-avatar` no pinta ninguna inicial.**
`mobile-pet-tracker/src/components/pet-avatar.tsx:29-36` pinta
`blobatar(name)` como SVG con `SvgXml` de `react-native-svg`, y eso es
exactamente lo que la **R5 aprobada de #40**
(`specs/mobile-pets-profile/requirements.md:121-133`, decisión humana del
2026-08-21) mandó hacer **sustituyendo** el fallback de inicial.

El error viene de más arriba: `progress/explore_design-gap-vs-make.md:659-661`
afirma que *"`PetAvatar` degrada a una inicial sobre `accent-soft`"*, y de ahí
pasó a `docs/ui-guidelines.md:215-217` §Dirección de arte 2 y al enunciado de
#67. Son **tres** sitios con la misma premisa falsa.

**Lo que se hace en su lugar**: el hero sin foto pinta el **blobatar** de la
mascota, escalado al alto de la zona de medios y centrado, reusando el
componente existente. **La R5 de #40 queda intacta y sin enmendar** en su
decisión; solo se enmienda el nombre del `testID` y el componente anfitrión
(R10, enmienda A7).

El criterio de aceptación 2 de #67 —*"Sin foto, el hero pinta degradado con la
inicial y sigue siendo legible"*— se lee contra **blobatar**: lo que se exige es
la legibilidad (R3), no la inicial.

### 0.2 Home no toma `photoUrl` del listado, lo toma del detalle

`home.tsx:174` lee `detail.data.pet.photoUrl`, resultado de `getPet`
(`src/api/pets.ts:85`), no de `listPets` (`:57`). Lo que #66 desbloqueó en Home
es **`pet-switcher`**, que sí lee `pet.photoUrl` del listado
(`pet-switcher.tsx:39`) y hasta hoy lo recibía siempre `null`. **El hero no
añade ninguna petición**: consume el detalle que Home ya pide y el que Profile
ya pide. Ver [[design]] §7.

---

## Requisitos funcionales

### R1 — Existe un componente compartido de cabecera fotográfica

- **R1**: WHEN una pantalla necesita una cabecera fotográfica de mascota THE
  SYSTEM SHALL ofrecer un único componente compartido en
  `mobile-pet-tracker/src/components/pet-hero-header.tsx` que exporte
  `PetHeroHeader`, `PetHeroHeaderProps`, `PetHeroHighlight`,
  `PET_HERO_MEDIA_HEIGHT` y `PET_HERO_FADE_HEIGHT`, con exactamente esta API y
  sin ninguna prop de contenido añadida:

  ```ts
  export interface PetHeroHighlight { value: string; label: string }

  export interface PetHeroHeaderProps {
    /** null mientras el detalle de la mascota no ha resuelto (R8). */
    pet: PetProfile | null;
    /** 'bleed' = a sangre, sin radio (Home). 'card' = dentro del ancho
     *  con `rounded-card` (Profile). Default 'card'. */
    variant?: 'bleed' | 'card';
    /** Dato destacado YA FORMATEADO por el llamante (R7). */
    highlight?: PetHeroHighlight;
    /** Slot de la zona superior. El hero NO conoce a su contenido (D2). */
    children?: ReactNode;
  }
  ```

  El componente SHALL NOT importar `pet-switcher`, `activity`, `pets` ni ningún
  módulo de `src/api/` salvo el tipo `PetProfile` de `src/api/types.ts`.

  *Test: `src/components/__tests__/pet-hero-header.test.tsx`,
  `describe('R1: PetHeroHeader es el único hero compartido')` — renderiza con
  `variant="bleed"` y con `variant="card"`, comprueba que ambos montan
  `testID="pet-hero"`; más una aserción de que el fuente del fichero no casa
  `/from '\.\.\/(api\/(pets|activity)|components\/pet-switcher)'/`. ROJO
  primero.*

### R2 — La capa de medios: foto a sangre, blobatar sin foto, blobatar si la foto falla

- **R2**: WHEN `pet.photoUrl` no es `null` THE SYSTEM SHALL pintar la foto
  ocupando el 100 % del ancho y `PET_HERO_MEDIA_HEIGHT` de alto con
  `contentFit="cover"` y **sin radio de esquina** (la foto llena el rectángulo,
  no un círculo), bajo `testID="pet-hero-media"`; IF `pet.photoUrl` es `null`
  THEN THE SYSTEM SHALL pintar el blobatar determinista de la mascota bajo el
  **mismo** `testID="pet-hero-media"`, escalado al alto de la zona de medios y
  centrado horizontalmente, sobre el fondo `bg-default` del hero.

  El render de ambas ramas SHALL vivir en `src/components/pet-avatar.tsx`
  —el componente compartido que fijó la R5 de #40— extendido con **exactamente**
  estas tres cosas y ninguna más:

  1. `size: number | { width: number; height: number }`. Con `number` el
     comportamiento actual no cambia (círculo de lado `size`,
     `borderRadius: size / 2`, `SvgXml` cuadrado). Con objeto: `width`/`height`
     del objeto, **sin** `borderRadius` en la rama de foto, y `SvgXml`
     conservando su `preserveAspectRatio` por defecto (`xMidYMid meet`), que es
     lo que escala el blob al lado menor y lo centra.
  2. `cacheKey?: string`, que se pasa dentro de `source`
     (`source={{ uri: photoUrl, cacheKey }}`). Sin `cacheKey` el `source` SHALL
     seguir siendo `{ uri: photoUrl }`, byte a byte como hoy.
  3. Estado interno de fallo de carga: `onError` del `Image` de `expo-image`
     SHALL conmutar el componente a la rama blobatar. No se añade prop para
     esto.

- **R2b**: IF la carga de `pet.photoUrl` falla —el caso real es una URL
  prefirmada caducada, TTL 3600 s desde #66— THEN THE SYSTEM SHALL pintar el
  blobatar en su lugar, sin hueco, sin error visible y sin romper el layout.

  *Tests:*
  - *`src/components/__tests__/pet-avatar.test.tsx`, `describe('R2: PetAvatar
    acepta tamaño rectangular, cacheKey y degrada al fallar la foto')` — tres
    `it`: (a) con `size={{ width: 300, height: 260 }}` y foto, el `Image` no
    lleva `borderRadius` y su `style` declara ese ancho y alto; (b) con
    `cacheKey="pet-1"`, `props.source` es `[{ uri, cacheKey: 'pet-1' }]`, y sin
    `cacheKey` sigue siendo `[{ uri }]`; (c) tras disparar `onError` sobre el
    `Image`, el nodo pasa a tener `props.xml` conteniendo `'<svg'`.*
  - *`src/components/__tests__/pet-hero-header.test.tsx`, `describe('R2:
    el hero pinta foto a sangre o blobatar')` — con foto,
    `getByTestId('pet-hero-media').props.source` es
    `[{ uri: pet.photoUrl, cacheKey: pet.id }]`; sin foto,
    `.props.xml` contiene `'<svg'` y es igual a `blobatar(pet.name)`.*
  - *ROJO primero en los dos ficheros.*

### R3 — Contraste AA garantizado por construcción, no por la suerte de la imagen

- **R3**: WHILE el hero está montado THE SYSTEM SHALL renderizar **todo texto**
  sobre una superficie **opaca** de `bg-background`, nunca sobre la imagen ni
  sobre un velo translúcido encima de la imagen, de modo que el contraste del
  texto sea **independiente de la foto y del blobatar**. Concretamente:

  - La **zona inferior** (`testID="pet-hero-caption"`) SHALL declarar
    `bg-background` opaco y contener el nombre, la raza y el dato destacado.
  - La **zona superior** (`testID="pet-hero-slot"`, solo si hay `children`)
    SHALL declarar `bg-background` opaco y contener el slot.
  - Entre cada zona opaca y la imagen SHALL haber una franja de degradado de
    `PET_HERO_FADE_HEIGHT` de alto, absoluta sobre la zona de medios
    (`testID="pet-hero-fade-top"` y `testID="pet-hero-fade-bottom"`), que va del
    token `background` **con alfa 0** al token `background` opaco, en el sentido
    que corresponda.

  Ratios **calculados** (método de #61: WCAG 2.x, luminancia relativa sRGB), con
  los valores literales de `src/theme/global.css`:

  | Par | Tema claro | Tema oscuro | AA (≥4,5:1) |
  |---|---:|---:|:--:|
  | `text-foreground` sobre `bg-background` (nombre, dato destacado) | `#0D1117` / `#FFFFFF` = **18,93:1** | `#F7F8FA` / `#0D1117` = **17,81:1** | ✅ |
  | `text-muted` sobre `bg-background` (raza, etiqueta del dato) | `#667085` / `#FFFFFF` = **4,98:1** | `#9CA3AF` / `#0D1117` = **7,45:1** | ✅ |

  Los cuatro valen igual **con foto y sin foto**, que es justo lo que exige el
  criterio de aceptación: la banda es opaca, así que la imagen de debajo no
  entra en el cálculo. Ese es el mecanismo, y por eso R3 lo formula como
  requisito de estructura y no como "el degradado debe ser suficiente".

- **R3b**: THE SYSTEM SHALL NOT renderizar texto ni iconografía directamente
  sobre la capa de medios. La alternativa fiel al Make —velo
  `rgba(0,0,0,0.28)` con texto encima, `design-src/App.tsx:337`— queda
  **descartada con el contraste calculado**, no estimado: compuesta sobre el
  peor caso de foto casi blanca da `#B8B8B8`, y encima **blanco = 1,98:1** y
  `--accent` `#178255` **= 2,43:1**. Para que el blanco llegara a 4,5:1 el velo
  tendría que subir a α ≈ **0,54** (compuesto `#757575`, 4,61:1), que destruye
  la fotografía; y para 3,0:1 (WCAG 1.4.11, elemento no textual) a α ≈ **0,42**
  (compuesto `#949494`, 3,03:1) — pero el anillo verde `border-accent` **empeora**
  al oscurecer el velo (2,43 → 1,59:1), porque el velo se acerca a la luminancia
  del propio acento. Ver [[design]] §3.

  *Tests: `src/components/__tests__/pet-hero-header.test.tsx`,
  `describe('R3: el texto del hero va sobre fondo opaco')` — cuatro `it`:*
  - *`getByTestId('pet-hero-caption')` declara la clase `bg-background` y NO
    declara ninguna clase con sufijo de opacidad (`/bg-background\/\d/`).*
  - *idem para `pet-hero-slot` cuando se pasan `children`.*
  - *`getByTestId('pet-hero-fade-bottom').props.style` contiene una
    `experimental_backgroundImage` que casa
    `/^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6} 100%\)$/`,
    y `pet-hero-fade-top` la misma con los stops invertidos.*
  - *`useThemeColors(['background'])` resuelve a `/^#[0-9A-Fa-f]{6}$/` en tema
    claro y en tema oscuro (candado de forma del token: si deja de ser hex de 6
    dígitos, la concatenación del stop transparente deja de ser válida y el
    implementer debe parar y reportar, no improvisar).*
  - *ROJO primero.*

### R4 — Slot de la zona superior y safe area

- **R4**: IF se pasan `children` THEN THE SYSTEM SHALL renderizarlos en la zona
  superior del hero con `paddingTop: insets.top + 12` obtenido de
  `useSafeAreaInsets()` de `react-native-safe-area-context`, **jamás** un valor
  fijo; IF no se pasan `children` THEN la zona superior SHALL NOT renderizarse
  en absoluto (ni la banda opaca ni `pet-hero-fade-top`), para no gastar alto de
  foto en Profile.

  El hero SHALL NOT importar ni conocer `pet-switcher`: quien lo monta dentro es
  `home.tsx` (D2, decisión humana del 2026-09-06). El hero mismo SHALL NOT
  declarar `paddingTop: insets.top + 12` cuando no hay slot: en `variant="bleed"`
  la imagen sangra bajo la barra de estado por diseño.

  *Test: `src/components/__tests__/pet-hero-header.test.tsx`,
  `describe('R4: el slot superior respeta la safe area')` — con el mock de
  `useSafeAreaInsets` en `{ top: 40, bottom: 24, left: 0, right: 0 }`:
  `getByTestId('pet-hero-slot').props.style` declara `paddingTop: 52`; sin
  `children`, `queryByTestId('pet-hero-slot')` y
  `queryByTestId('pet-hero-fade-top')` son `null`. ROJO primero.*

### R5 — Home sustituye su pet-card por el hero, sin perder ningún testID

- **R5**: WHEN se abre la pestaña Home con una mascota seleccionada THE SYSTEM
  SHALL renderizar `PetHeroHeader` con `variant="bleed"` como **primer hijo** del
  contenido del `ScrollView`, con `pet-switcher` dentro de su slot, y SHALL
  eliminar por completo el bloque de pet-card inline de
  `src/app/(tabs)/home.tsx:168-190` junto con el `<PetSwitcher>` suelto de
  `:145-151`.

  Los `testID` que **desaparecen** y su sustituto, uno a uno. Ninguno se pierde
  sin un test de conducta anclado en su lugar:

  | Muere | `home.tsx` | Sustituto | Test de conducta que se ancla en su lugar |
  |---|---:|---|---|
  | `pet-card` | 170 | `pet-hero` | El hero se monta cuando el detalle resuelve `ok` |
  | `pet-card-photo` | 176 | `pet-hero-media` | **Mismo contrato de dos ramas de la R5 de #40**: con foto `.props.source` es `[{ uri, cacheKey: pet.id }]`; sin foto `.props.xml` contiene `'<svg'`; y `pet-hero-media` es descendiente de `pet-hero` — sustituye literalmente a `home.test.tsx:310` |
  | `pet-card-name` | 180 | `pet-hero-name` | Pinta `pet.name` de la mascota seleccionada |
  | `pet-card-breed` | 185 | `pet-hero-breed` | Pinta `pet.breed ?? '—'` (se conserva el guion largo de hoy) |
  | `pet-card-skeleton` | 154 | `pet-hero-skeleton` | Skeleton dimensionado como el hero (R8) |
  | `pet-card-error` | 158 | `pet-hero-error` | Card de error del detalle, alcanzable con el hero en pantalla (R8) |
  | `pet-card-retry` | 162 | `pet-hero-retry` | `onPress` dispara `detail.refetch()` |

  Los `testID` de `pet-switcher` (`pet-chip-*`, `pet-avatar-image-*`,
  `pet-avatar-fallback-*`) SHALL NOT cambiar: el componente no se toca, solo
  cambia dónde se monta. Los `testID` `collar-*`, `summary-*`,
  `last-position-*`, `home-loading`, `home-error`, `home-retry`, `home-empty` y
  `screen-home` SHALL NOT cambiar ni desaparecer.

- **R5b**: WHILE Home renderiza el hero a sangre THE SYSTEM SHALL conservar las
  métricas de `docs/conventions.md` §Dimensiones con esta única desviación
  declarada: `contentContainerStyle` conserva `gap: 16` y
  `paddingBottom: insets.bottom + 96` y **pierde** `padding: 24` y
  `paddingTop: insets.top + 12`, porque un hero a sangre no puede vivir dentro
  de un padre con padding horizontal. En su lugar:
  - el contenido que va **debajo** del hero se envuelve en un `View` con
    `{ paddingHorizontal: 24, gap: 16 }`;
  - las ramas de estado del listado (`home-loading`, `home-error`, `home-empty`)
    se envuelven en un `View` con
    `{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }`, porque
    cuando se muestran no hay hero que ocupe la safe area.

  Requiere la enmienda A9 de R10 sobre la carta y sobre `conventions.md`.

  *Tests: `src/app/(tabs)/__tests__/home.test.tsx`, `describe('R5: Home usa el
  hero compartido')` — los siete sustitutos de la tabla, más
  `queryByTestId('pet-card')` y `queryByTestId('pet-card-photo')` a `null`, más
  `expect(within(getByTestId('pet-hero')).getByTestId('pet-hero-media'))`, más
  `getByTestId('screen-home').props.contentContainerStyle` igual a
  `{ gap: 16, paddingBottom: 120 }` con el mock de insets actual. ROJO primero.*

### R6 — Profile sustituye su `PetHero` local por el compartido

- **R6**: WHEN se abre la pestaña Profile con una mascota seleccionada THE
  SYSTEM SHALL renderizar `PetHeroHeader` con `variant="card"` y **sin slot**, y
  SHALL eliminar por completo la función local `PetHero`
  (`src/screens/profile/index.tsx:62-84`) y su llamada de `:277`.

  | Muere | `profile/index.tsx` | Sustituto |
  |---|---:|---|
  | `profile-pet-photo` | 73 | `pet-hero-media` (el compartido) — `profile/index.test.tsx:364` y `:588` se reanclan a él |

  `profile-hero-skeleton` (`:261`) **conserva su nombre**: sigue siendo el
  skeleton del hero de Profile y solo cambia de dimensión (R8). Renombrarlo no
  aportaría nada y rompería `profile/index.test.tsx:352` sin motivo.

  Los `testID` `change-photo`, `pet-info-card`, `documents-link`,
  `pairing-link`, `reminders-link`, `me-card`, `theme-toggle`,
  `language-toggle`, `profile-add-pet`, `profile-sign-out`, `screen-profile` y
  el resto de `profile/index.tsx` SHALL NOT cambiar. El
  `contentContainerStyle` de `screen-profile` SHALL NOT cambiar: en Profile el
  hero es `variant="card"` y vive dentro del padding de 24, de modo que
  `profile/index.test.tsx:346-351` sigue verde sin tocarse.

  *Tests: `src/screens/profile/index.test.tsx`, `describe('R6: Profile usa el
  hero compartido')` — `getByTestId('pet-hero')` presente,
  `getByTestId('pet-hero-media').props.source` con la foto,
  `queryByTestId('profile-pet-photo')` a `null`,
  `queryByTestId('pet-hero-slot')` a `null` (Profile no pasa slot), y
  `getByTestId('change-photo')` sigue presente y fuera de `pet-hero`. ROJO
  primero.*

### R7 — Dato destacado: paseos de hoy en Home, ninguno en Profile

- **R7**: WHEN Home renderiza el hero THE SYSTEM SHALL pasarle
  `highlight={{ value: <paseos de hoy>, label: t('home.walks') }}` tomando el
  número de `today.walkCount` —el mismo `DayEntry` que ya alimenta
  `summary-activity`, `summary-sleep` y `summary-distance`
  (`home.tsx:96-99`)— con `'—'` cuando es `null`, igual que devuelven
  `fmtMinutes` (`home.tsx:39-43`) y `fmtKm` (`:45-47`); IF Profile renderiza el
  hero THEN THE SYSTEM SHALL NOT pasar `highlight`, y el hero SHALL renderizar
  solo el bloque de nombre y raza.

  El hero SHALL recibir el dato **ya formateado** y SHALL NOT conocer su origen:
  ni importa `src/api/activity.ts`, ni recibe `DayEntry`, ni formatea números.

  **`pasos` no se pinta y no puede pintarse**: no existe el dato en ningún punto
  de la cadena — cero ocurrencias de `steps` en `mobile-pet-tracker/src/`,
  `DayEntry` (`src/api/types.ts:79-90`) no lo trae, y
  `PetProfileResponse.activitySummary` sale siempre `null` del backend
  (`backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:46`).
  Es la decisión abierta **D** del informe de origen y es una pregunta de
  hardware (¿el collar reporta podómetro?), no de backend. `walkCount` es el
  análogo más cercano —métrica de "hoy", ya descargada, y el propio Make la
  pinta como **"Paseos"** en su tira de estadísticas
  (`design-src/App.tsx:373`)— y además **no se pinta hoy en ninguna pantalla**,
  así que el hero no duplica ningún dato ya visible.

- **R7b**: WHEN se introduce la copy nueva THE SYSTEM SHALL añadir **una** clave
  al catálogo en los **dos** idiomas: `'home.walks'` → `en: 'Walks'`,
  `es: 'Paseos'` (la palabra del diseño, regla D4 de
  `specs/mobile-ui-language/design.md` §2.0), en `src/i18n/catalog.ts` dentro de
  los dos bloques `en` y `es`, y SHALL registrarla en la tabla §2.3 de
  `specs/mobile-ui-language/design.md`. Ninguna pantalla escribe literal.

  *Tests: `src/app/(tabs)/__tests__/home.test.tsx`, `describe('R7: el hero pinta
  los paseos de hoy')` — con `walkCount: 3`,
  `getByTestId('pet-hero-highlight-value')` da `'3'` y
  `getByTestId('pet-hero-highlight-label')` da la etiqueta traducida; con
  `walkCount: null`, el valor es `'—'`. En
  `src/screens/profile/index.test.tsx`,
  `queryByTestId('pet-hero-highlight-value')` es `null`. El candado de catálogo
  ya existente (`src/__tests__/ui-language.test.ts`) cubre que la clave exista
  en los dos idiomas. ROJO primero.*

### R8 — Estados: skeleton dimensionado y error del detalle alcanzable

- **R8**: WHILE `pet` es `null` THE SYSTEM SHALL renderizar la zona de medios y
  la zona inferior como `Skeleton` de heroui **dimensionados como el contenido
  final** —la zona de medios con `PET_HERO_MEDIA_HEIGHT` de alto, la zona
  inferior con la altura de sus dos líneas de texto— bajo
  `testID="pet-hero-skeleton"`, SHALL seguir renderizando el slot si hay
  `children`, y SHALL NOT usar un `Spinner` suelto ni dejar que el layout salte
  al resolver (carta §Decisiones fijas 7).

- **R8b**: IF el detalle de la mascota falla en Home THEN THE SYSTEM SHALL
  renderizar el hero con `pet={null}` **y** la card de error
  `pet-hero-error` / `pet-hero-retry` debajo, de modo que `pet-switcher` siga
  montado y el usuario pueda cambiar de mascota sin salir de la pantalla. Hoy,
  con `pet-card-error` sustituyendo la card, el selector seguía arriba; al
  moverse el selector dentro del hero, el hero tiene que sobrevivir al error o
  la pantalla se queda sin salida.

  *Tests: `src/components/__tests__/pet-hero-header.test.tsx`, `describe('R8: el
  hero sin mascota es un skeleton dimensionado')` — con `pet={null}`,
  `getByTestId('pet-hero-skeleton')` existe, su `style` declara
  `height: PET_HERO_MEDIA_HEIGHT`, y `queryByTestId('pet-hero-media')` es
  `null`; con `children`, `pet-hero-slot` sigue presente. En
  `src/app/(tabs)/__tests__/home.test.tsx`, con el detalle en error:
  `pet-hero-error`, `pet-hero-retry` y `pet-chip-pet-1` están todos presentes a
  la vez. ROJO primero.*

### R9 — Grep-clean intacto y candados actualizados por delta

- **R9**: WHEN la feature se cierra THE SYSTEM SHALL mantener el grep-clean de
  #46/#61/#62/#64 sin ninguna excepción nueva: cero hex fuera de `src/theme/`,
  cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero sombras
  legacy, y ningún radio fuera de `rounded-card` / `rounded-xl` /
  `rounded-full`. En concreto:
  - `PET_HERO_MEDIA_HEIGHT` y `PET_HERO_FADE_HEIGHT` SHALL ser constantes
    numéricas del propio fichero aplicadas por `style`, **no** clases
    arbitrarias `h-[260px]` (prohibidas por `design-drift.test.ts:48-52`) y
    **no** tokens de `global.css`: cada una se usa una sola vez, y la carta pide
    token a partir de la segunda repetición (§Decisiones fijas 2);
  - los colores de los dos degradados SHALL salir de
    `useThemeColors(['background'])` y nunca de un literal;
  - `src/components/pet-hero-header.tsx` SHALL añadirse a la lista de ficheros
    con candado de la lista de la R9 de `src/__tests__/design-drift.test.ts:90-98`.

- **R9b**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `303fc19`**, nunca números nuevos escritos a mano en
  esta spec. Los deltas exactos y su motivo:

  | Candado | Fichero del candado | Delta contra `303fc19` | Motivo |
  |---|---|---|---|
  | `style={CONTINUOUS_CORNER}` en `screens/profile/index.tsx` | `consistency-classnames.test.ts` #62 R14 | **−1** | desaparece con `PetHero` (`index.tsx:66`) |
  | `style={CONTINUOUS_CORNER}` en el fichero nuevo | idem | **+1** (fila nueva) | `variant="card"` lo declara |
  | total de `CONTINUOUS_CORNER` | idem | **sin cambio** (−1 y +1) | consistencia interna |
  | `bg-accent-soft` global | `consistency-classnames.test.ts` #64 R9 | **−1** | desaparece con `PetHero` (`index.tsx:68`) |
  | `text-accent-strong` (por fichero y total) | `legibility-classnames.test.ts` #61 R4 | **sin cambio** | el hero no usa el acento como tinta |
  | filas de `R3_HOME` en `ui-copy-table.ts` y su `toHaveLength` | `ui-language.test.ts` | **+1** | la clave nueva `home.walks` (R7b) |
  | filas de `R7_PROFILE` | idem | **sin cambio** | `PetHero` no llamaba a `t()` |
  | fila del skeleton de Home en #62 R2 | `consistency-classnames.test.ts:107-137` | **editada, no contada** | `pet-card-skeleton` con `className="h-32 w-full rounded-card"` pasa a `pet-hero-skeleton` con altura por `style`, sin radio (a sangre) |

  El implementer sustituye cada número por el que devuelva el propio grep; el
  reviewer comprueba el **delta**, no el valor.

  *Test: la suite móvil completa verde
  (`bun test` desde `mobile-pet-tracker/`), incluidos
  `src/__tests__/design-drift.test.ts`,
  `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/legibility-classnames.test.ts`,
  `src/theme/__tests__/global-css.test.ts` y
  `src/__tests__/ui-language.test.ts`, sin debilitar ni eliminar ningún assert
  de conducta.*

### R10 — Enmiendas a specs aprobadas y a la carta de UI

- **R10**: WHEN esta spec se implemente THE SYSTEM SHALL insertar, en cada
  documento de la tabla, el bloque canónico de enmienda que vive en
  [[design]] §9 dentro de una valla ` ```markdown `, con su línea de firma
  `- [ ] Enmienda aprobada por humano` **sin marcar** al entregar, siguiendo el
  mismo mecanismo que estableció la R19 de #65
  (`src/__tests__/ui-language.test.ts:144-183`). **Ningún agente marca la
  casilla.**

  | # | Fichero | Líneas en `303fc19` | Qué dice hoy | Qué pasa a decir |
  |---|---|---|---|---|
  | A1 | `specs/mobile-figma-polish/design.md` | 102-104 | "Headers hero (foto 280–340px con overlay): fuera de #46 (ver [[requirements]] §Fuera de alcance). Las pantallas conservan su estructura de encabezado actual con los nuevos tokens." | Añade: "**Enmendado por #67**: la cabecera fotográfica compartida entra en `mobile-pet-hero-header`; Home y Profile dejan de conservar su encabezado actual." |
  | A2 | `specs/mobile-figma-polish/requirements.md` | 182-186 | "**Headers hero con foto de mascota a 280–340px + overlay de gradiente** … Si el humano quiere fidelidad total de los heros, es una feature aparte — decisión visible para el gate." | Se marca como **resuelta**: la feature aparte existe y es #67; el punto sale de §Fuera de alcance de #46 por enmienda, sin reabrir ningún R de #46 |
  | A3 | `specs/mobile-figma-polish/design.md` | 95 | `### 5. Sin gradientes ni headers hero — restricción de alcance` | El título deja de ser cierto: se anota "(§5 enmendada por #67)" |
  | A4 | `specs/mobile-figma-polish/design.md` | 97-101 | "`expo-linear-gradient` no está instalado y no se añade. Única excepción: el degradado del área del weight-chart (R5), que `react-native-svg` resuelve con `<LinearGradient>` dentro del propio SVG." | La prohibición de `expo-linear-gradient` **se mantiene íntegra**; se añade una **segunda** excepción: `experimental_backgroundImage` de React Native, que no es dependencia nueva ([[design]] §2) |
  | A5 | `specs/mobile-figma-polish/requirements.md` | 187-190 | "**Gradientes** … requerirían `expo-linear-gradient` (dep nueva, prohibido) o SVG ad-hoc." | Se corrige la premisa: en RN 0.86.2 hay una tercera vía nativa; sigue prohibido `expo-linear-gradient` |
  | A6 | `specs/mobile-figma-polish/design.md` | 151-153 | "**Rehacer las pantallas con la estructura hero del Make**: … va como feature aparte si el humano la quiere." | Se anota que la feature aparte es #67 y está ejecutada |
  | A7 | `specs/mobile-pets-profile/requirements.md` | 121-133 (R5 de #40) | "…y el pet card de Home (`src/app/(tabs)/home.tsx`, reemplazando el fallback de inicial bajo el mismo `testID="pet-card-photo"`)" | **La decisión de blobatar NO se toca.** Solo cambia el anfitrión y el nombre del ancla: el pet card de Home desaparece y el blobatar pasa al hero compartido bajo `testID="pet-hero-media"`; `src/components/pet-avatar.tsx` sigue siendo el único sitio donde vive el render |
  | A8 | `docs/ui-guidelines.md` | 215-217 (§Dirección de arte 2) | "Cuando no la tiene, el respaldo es **degradado con la inicial** —el patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04." | **Corrección de un hecho falso**: `pet-avatar.tsx:29-36` pinta `blobatar(name)` con `SvgXml`, nunca una inicial; el respaldo es el **blobatar**, decidido el 2026-08-21 (R5 de #40) y ratificado el 2026-09-06 |
  | A9 | `docs/ui-guidelines.md` §Decisiones fijas 6 y `docs/conventions.md` §Dimensiones | — | "toda pantalla nueva usa las mismas métricas … `paddingTop: insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 96` en `contentContainerStyle`" | Excepción nombrada: si el primer hijo del scroll es una **cabecera a sangre**, `contentContainerStyle` conserva `gap` y `paddingBottom`, el padding horizontal baja a un envoltorio interior y el `paddingTop` lo asume la cabecera vía su slot (R5b) |

  **A10 — no la aplica ningún agente**: el enunciado de #67 en
  `feature_list.json` repite la premisa falsa de A8. La corrección propuesta
  está en [[design]] §10, redactada lista para pegar; **el humano la aplica**.

  *Test: `src/__tests__/hero-header-amendments.test.ts`,
  `describe('R10: las specs enmendadas por #67 llevan su bloque')` — lee el
  bloque canónico de `specs/mobile-pet-hero-header/design.md` §9 (misma técnica
  que `ui-language.test.ts:166-183`), comprueba que aparece en cada fichero de
  la tabla A1–A9 y que cada uno conserva su línea de firma
  `- [ ] Enmienda aprobada por humano`, marcada o no. ROJO primero.*

---

## Las siete preguntas de la Home (carta §Dirección de arte 3)

Obligatorio para toda spec que toque la Home. #67 no añade ninguna respuesta
nueva salvo media: reordena y hace legible lo que ya se respondía.

| Pregunta del brief | ¿La responde #67? | Dónde |
|---|:--:|---|
| ¿Está segura? | **No** | Geocercas y modo perdido; no entran aquí |
| ¿Dónde está? | **No** | Sigue en `last-position-card` (`home.tsx:342`), sin tocar |
| ¿El collar está conectado? | **No** | Sigue en `collar-status` (`:207`). La píldora "En línea" del Make **no entra** (ver §Fuera de alcance) |
| ¿Tiene batería? | **No** | Sigue en `collar-battery` (`:230`), sin tocar |
| ¿Tiene recordatorio pendiente? | **No** | Es #70 |
| ¿Cómo fue su actividad hoy? | **Parcialmente sí** | El hero estrena los **paseos de hoy** (R7), que hoy no se pintan en ninguna pantalla; el resto sigue en `summary-card` |
| ¿Hay alguna alerta? | **No** | No existe centro de alertas en la app; la campana del Make queda fuera (§Fuera de alcance) |

Y el hero responde una que las siete no listan y que es su razón de ser:
**¿de qué mascota estoy viendo todo esto?**

---

## Fuera de alcance

Elementos del hero del Make (`design-src/App.tsx:334-365`) que **no** entran, y
por qué:

- **Píldora "En línea"** (`:358`). Depende del pestillo `'online'` de la ingesta,
  que está roto (`backend-pet-tracker/src/modules/ingestion/…/ingestion.drizzle.store.ts:97`),
  y de un umbral de segundos de silencio que **nadie ha definido**: es la
  decisión abierta **G** del informe de origen y es feature de backend
  (`device-connectivity-signal`). No se pierde información: el estado del collar
  sigue visible en `collar-status` (`home.tsx:207`), que es lo que exige la
  carta §Dirección de arte 5.
- **Campana de notificaciones con punto rojo** (`:351-356`). La app **no tiene
  pantalla ni ruta de alertas**: no hay nada bajo `src/app/` que la campana
  pueda abrir. Un botón que no navega a ninguna parte es peor que su ausencia.
  Entra cuando exista una feature `mobile-alerts-center` que le dé destino; el
  backend ya tiene el módulo de alertas y el notifier, así que el dato existe y
  lo que falta es la pantalla.
- **Botón `+` de alta rápida sobre el hero** (`:347-349`). El alta de mascota ya
  vive en Profile (`profile-add-pet`, `profile/index.tsx:228`). Duplicarla en el
  hero es una decisión de navegación que no aporta a #67 y que #71 (accesos
  rápidos) resolverá con criterio propio.
- **Botón flotante "Cambiar foto" sobre la foto** en Profile
  (`design-src/App.tsx:683`). `change-photo` se queda donde está hoy
  (`profile/index.tsx:279-289`), **debajo** del hero: es un botón con texto, y
  R3b prohíbe texto sobre la imagen. Ponerlo encima obligaría a resolver el
  mismo problema de contraste que R3b descarta con números.
- **La tira de estadísticas de 4 tiles** que el Make pinta bajo el hero
  (`:370-380`). Es la feature **#69** (`mobile-stats-strip`). #67 no toca
  `summary-card`.
- **Cabecera fotográfica en las pantallas de detalle** (docs, reminders,
  meal-schedule, weight-log, pairing, health, food, auth). Es
  `mobile-detail-screens-hero`, que depende de ésta y va después
  (informe de origen §7, Bloque 4).
- **Contador de pasos** (`:362-365`). Ver R7: el dato no existe en ninguna capa
  y su origen es una pregunta de hardware (decisión **D**).
- **Cambios en `pet-switcher.tsx`.** El chip seleccionado usa `bg-accent-soft`,
  que es translúcido (`color-mix(in oklab, var(--accent) 15%, transparent)`,
  `node_modules/heroui-native/src/styles/theme.css:83`), y su anillo
  `border-accent` no llega a 3:1 sobre una foto clara a ninguna intensidad de
  velo (R3b). #67 **no lo expone a ese riesgo**: el slot va sobre banda opaca
  (R3), que es la superficie para la que el switcher ya está validado. Tocar el
  componente afectaría a cinco pantallas y no hace falta.
- **Backend, API, navegación, dependencias nuevas y configuración de Expo.**
  Cero. `expo-linear-gradient` sigue sin instalarse.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. La corrección de la premisa falsa de §0.1: el respaldo sin foto es
   **blobatar**, no una inicial, en los tres sitios donde está mal escrita
   (`feature_list.json` #67, `docs/ui-guidelines.md:215-217`,
   `progress/explore_design-gap-vs-make.md:659-661`).
2. Las nueve enmiendas A1–A9 de R10 a specs aprobadas y a la carta, cada una con
   su firma en el fichero enmendado.
3. La **desviación declarada respecto al Make** que impone R3: el texto del hero
   va sobre banda opaca en vez de sobre la foto velada, y el hero resultante es
   más alto que los 340 px del Make en Home. El motivo está **medido**
   (1,98:1 contra los 4,5:1 que exige AA), y el smoke lado a lado lo verá — es
   esperado, no un defecto, igual que la desviación de `--accent` que fijó #61.
4. Que `walkCount` es el dato destacado en lugar de los pasos del Make, y por
   qué (R7).

**Gate humano de verificación, no delegable a IA**: smoke en **dev build de
Android** (nunca Expo Go), con mascota **con foto** y **sin foto**, en tema
**claro** y **oscuro** — cuatro combinaciones. Se comprueba: que el nombre, la
raza y el dato destacado se leen en las cuatro; que el degradado no deja una
banda gris ni oscura en la transición a la banda opaca; que el selector de
mascota sigue alcanzable y utilizable en la zona superior; que la foto no se
recorta por arriba dejando fuera la cara del animal; y que al errar el detalle
se puede cambiar de mascota sin salir de la pantalla.
