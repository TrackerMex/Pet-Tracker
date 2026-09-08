---
feature: "mobile-home-quick-actions"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-quick-actions]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, las premisas verificadas y las
> alternativas descartadas; [[../../docs/ui-guidelines|ui-guidelines]] para la
> carta de UI que gobierna todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:395-410` — la rejilla "Accesos
> rápidos" de la Home del Figma Make. **El enunciado dice `App.tsx:396-412`: la
> cita está desplazada** ([[design]] §2 C1).
> Informe de origen: `progress/explore_design-gap-vs-make.md` §7 (Bloque 1),
> fechado el 2026-09-04 y desactualizado por seis features.
>
> **De esta feature se toma del Make la FORMA, no los DESTINOS.** Los cuatro
> destinos que el diseño dibuja —Mapa, Actividad, Vacunas, Comidas— quedan
> **descartados los cuatro**: uno no existe y los otros tres ya son pestaña.
> El criterio que los sustituye lo fijó el humano el 2026-09-08 y está en R3.
> Es la desviación más grande que este bloque del rediseño ha aceptado hasta
> ahora, y se ratifica en §Aprobación.
>
> **Base de medición**: todo delta de esta spec se mide contra el commit base de
> la branch, **`f9163bf`** (merge del PR #114, #69). Ningún requisito congela un
> recuento absoluto: se fijan **deltas** y **consistencias internas**. Es la
> sexta vez que se dice en este repo; las anteriores costaron una sesión cada
> una.
>
> **Skills obligatorias antes de tocar código** (carta §Skills):
> `expo:expo-overview` → `expo:expo-native-ui` y `expo:expo-design-system`, más
> `appllama-app-design-skill`. En Codex CLI, las equivalentes del plugin `expo`.
> La carta gana sobre la skill en todo conflicto de estilo. SDK del proyecto:
> **Expo 57** (`mobile-pet-tracker/package.json`, `~57.0.14`); usar la
> documentación fijada a esa versión, nunca `latest`.

---

## 0. Premisas, verificadas una por una contra el árbol

Esta feature es **navegación pura** y tiene dos modos de fallo reales: llevar a
una ruta que no existe —el error de #68 con `/trips`—, y llevar a una ruta que
**ya está a un toque**, que es el que la primera redacción de esta spec estuvo a
punto de cometer. Por eso §0.1 enumera destino por destino con su fichero de
ruta, §0.2 comprueba qué pinta cada pantalla de verdad y a cuántos toques está
hoy, y §0.3 descarta uno por uno. Todo comprobado contra el árbol en `f9163bf`.

| # | Premisa del enunciado | Veredicto |
|---|---|---|
| 1 | El Make pone 4 tiles con fondo pastel a Mapa, Actividad, Vacunas y Comidas en `App.tsx:396-412` | **Cierta en el fondo, la cita desplazada**: el bloque real es `:395-410` ([[design]] §2 C1) |
| 2 | No necesita ningún dato: es navegación pura | **Cierta.** Ningún tile lee `detail`, `activity` ni `pets`. Lo único que consume es `selectedPetId`, que ya condiciona el render (R10) y que un destino necesita como parámetro de ruta (R2). Cero llamadas nuevas (R12) |
| 3 | Depende de #64: sin los tokens pastel habría que usar clases arbitrarias | **Cierta, y más fuerte de lo que dice**: además de los tokens, #64 dejó el candado **R9** (`consistency-classnames.test.ts:372-433`) que **prohíbe escribir `bg-category-*` fuera de `src/utils/category-palette.ts`** y prohíbe interpolarlas. No es solo que convenga usar los tokens: escribir la clase en la Home pone la suite roja ([[design]] §1 P4) |
| 4 | Área táctil ≥44pt por tile, "como fijó #61 R10" | **Cierta y el R-id acierta**: R10 de `specs/mobile-ui-legibility-polish/requirements.md:211-225` es el requisito de `hitSlop={TOUCH_SLOP}` y ≥44pt. **Su candado, en cambio, no es global**: vive replicado como `describe('#61 R10: ...')` en siete ficheros de test de pantalla, y la Home **no es uno de ellos** ([[design]] §1 P7). R6 pone el suyo |
| 5 | Escala de tres radios de #62: `rounded-card`, `rounded-xl`, `rounded-full` | **Cierta, y la carta ya resuelve cuál toca**: §Decisiones fijas 12 dice literalmente *"Control, **tile**, input, botón y píldora de dato → `rounded-xl`"*. No hay decisión que tomar aquí (R8) |
| 6 | La Home ya vive en `src/screens/home/` | **Cierta** desde #68 R15. **No se migra nada** |
| 7 | `language-provider.test.tsx` línea 41 cierra la longitud del catálogo y se ha omitido en las dos últimas specs | **Cierta las tres veces.** La línea 41 vale hoy `expect(englishKeys).toHaveLength(260 + 16 + 1)` = 277, y el catálogo tiene exactamente 277 claves. R14 la enumera **como primera fila de la tabla** |
| 8 | *(premisa nueva, del propio proceso)* "un tile a una pestaña vale porque etiqueta el tema, no la pantalla" | **FALSA, y es la corrección central de esta reescritura**: `src/app/(tabs)/_layout.tsx:26-30` registra `home`, `map`, `health`, `food`, `profile`, y `floating-tab-bar.tsx:49-54` los pinta con **los mismos glifos** `Map` y `ForkKnife` que llevarían los tiles de Mapa y Comidas. La fila serían tres botones duplicando tres de las cinco pestañas, con dos iconos idénticos, y la barra flotando en la misma pantalla ([[design]] §2 C5) |

### 0.1 Las siete rutas que NO son pestaña

Las **cinco pestañas** son `home`, `map`, `health`, `food` y `profile`
(`src/app/(tabs)/_layout.tsx:26-30`). Todo lo demás bajo `src/app/(tabs)/` es
ruta navegable pero **no** alcanzable desde la barra. El grupo de ruta `(tabs)`
no aparece en la URL, así que `src/app/(tabs)/weight-log.tsx` sirve
`/weight-log`.

| Ruta | Fichero de ruta | Pantalla | Toques desde la Home hoy |
|---|---|---|---|
| `/weight-log` | `src/app/(tabs)/weight-log.tsx` | inline | **2** — pestaña Salud → `weight-log-link` (`health.tsx:262-272`) |
| `/add-reminder` | `src/app/(tabs)/add-reminder.tsx` | `src/screens/add-reminder/` | **3** — pestaña Perfil → `reminders-link` (`profile/index.tsx:328`) → `reminders-add-link` (`reminders/index.tsx:147-149`) |
| `/pets/[petId]/docs` | `src/app/(tabs)/pets/[petId]/docs.tsx` | `src/screens/docs/` | **2** — pestaña Perfil → `documents-link` (`profile/index.tsx:293-299`), dentro de la tarjeta de la mascota |
| `/pairing` | `src/app/(tabs)/pairing.tsx` | `src/screens/pairing/` | **2** — pestaña Perfil → `pairing-link` (`:312`). Y **1** desde la propia Home (`collar-pair-link`, `home/index.tsx:359-362`) cuando no hay collar |
| `/pets/add` | `src/app/(tabs)/pets/add.tsx` | `src/screens/add-pet/` | **2** — pestaña Perfil → `profile-add-pet` (`:203-207`) |
| `/meal-schedule` | `src/app/(tabs)/meal-schedule.tsx` | inline | **2** — pestaña Nutrición → `meal-schedule-link` (`food.tsx:302-304`) |
| `/reminders` | `src/app/(tabs)/reminders.tsx` | `src/screens/reminders/` | **2** — pestaña Perfil → `reminders-link` (`:328`) |

### 0.2 Qué pinta de verdad cada candidata

Verificado leyendo cada pantalla, no deduciéndolo del nombre.

| Ruta | Qué renderiza | Naturaleza |
|---|---|---|
| `/weight-log` | Formulario de alta —`weight-input`, `weight-date-input`, `weight-bc-input`, `weight-submit` con `weightLog.logWeight` (`:158-208`)— más el histórico y la gráfica | **Acción recurrente**: cada pesaje |
| `/add-reminder` | Formulario de alta —tipo, título, fecha, hora, aviso, `add-reminder-submit` (`:144-300`)—; al guardar hace **`router.back()`** (`:89`), así que empujado desde la Home devuelve a la Home | **Acción recurrente**: uno por vacuna, desparasitación o medicación |
| `/pets/[petId]/docs` | Lista de documentos de la mascota con estados vacío y de error (`:102-132`), y alta de documento; vuelve con `router.back()` (`:83`) | **Consulta recurrente**: cada visita al veterinario |
| `/pairing` | Alta y estado del collar | **Configuración de una vez** por dispositivo |
| `/pets/add` | Formulario de alta de mascota | **Configuración de una vez** por mascota |
| `/meal-schedule` | Horario y porciones; **`<Redirect href="/food" />`** sin mascota (`:318`); vuelve con `router.back()` (`:132`) | **Pantalla hija** de la pestaña Nutrición |
| `/reminders` | Lista completa de recordatorios | Lista — **fuera por decisión**, §Fuera de alcance |

### 0.3 No existe candado global de hex

Confirmado en `f9163bf`, igual que declararon #68 y #69: el único test que
persigue hexadecimales es `src/__tests__/design-drift.test.ts`, y lo hace sobre
**listas nominales de ficheros** —bloques `R9` (`:89`), `R11` (`:162`),
`#68 R18` (`:189`) y `#69 R13` (`:235`)—. No hay barrido global. Por eso R13
añade su propio bloque en vez de confiar en uno que podría dejar de cubrir
estos ficheros.

---

## Requisitos

### R1 — La rejilla existe: una sección con tres tiles, y cada tile decide cuatro cosas en un solo sitio

- **R1**: WHEN la Home renderiza `home-content` con una mascota seleccionada
  THE SYSTEM SHALL renderizar una sección con `testID="quick-actions"` que
  contenga un rótulo de sección y **exactamente tres** tiles, en este orden y
  con este reparto exacto:

  | # | `testID` del tile | Icono (`reicon-react-native`) | Etiqueta (clave de catálogo) | Hueco de paleta (#64) | Destino |
  |---|---|---|---|---|---|
  | 1 | `quick-action-weight` | `Weight` | `home.quickActionWeight` (**nueva**, R11) | `violet` | `/weight-log` |
  | 2 | `quick-action-reminder` | `CalendarPlus` | `home.quickActionReminder` (**nueva**, R11) | `amber` | `/add-reminder` |
  | 3 | `quick-action-documents` | `FileText` | `home.quickActionDocuments` (**nueva**, R11) | `blue` | `/pets/<selectedPetId>/docs` |

  AND las cuatro decisiones de cada fila —**icono, etiqueta, hueco de paleta y
  destino**— SHALL escribirse **una sola vez**, en una constante de módulo
  `QUICK_ACTIONS` declarada en `mobile-pet-tracker/src/screens/home/index.tsx`,
  con **exactamente** estos nombres de campo:
  `{ testID, Icon, labelKey, slot, href }`;
  AND el campo `href` SHALL ser una **función** `(petId: string) => string`, la
  misma forma en las tres filas, porque el destino 3 lleva el `petId` en la
  ruta y una fila con forma distinta a las otras dos rompe el `.map()` y con él
  el candado de R4 ([[design]] §3 D3);
  AND el campo SHALL llamarse **`labelKey`** y no otra cosa: el candado de copy
  de #65 (`ui-language.test.ts:48-55`) solo reconoce una clave usada fuera de un
  `t('...')` literal si aparece como `labelKey: '<clave>'`, y con cualquier otro
  nombre de campo la clave contaría **cero usos** y el candado se pondría rojo
  ([[design]] §3 D7);
  AND los tres tiles SHALL renderizarse recorriendo esa constante con `.map()`,
  de modo que **no exista ninguna otra fuente** de la que un tile pueda sacar su
  icono, su etiqueta, su color o su destino;
  AND el rótulo SHALL ser un `Text` con `testID="quick-actions-title"`,
  `t('home.quickActions')` y la receta canónica de rótulo de sección del repo,
  `className="text-xs font-semibold uppercase tracking-widest text-muted"` —la
  misma que ya usan diez sitios, entre ellos `health.tsx:130` y
  `profile/index.tsx:337`—, que es además la del Make
  (`design-src/App.tsx:396`);
  AND la sección SHALL ser una `View` con `className="gap-3"`, **no** una
  `Card`: el Make no le pone tarjeta y envolverla obligaría a re-litigar el
  tratamiento de título de #62 R5 a cambio de nada ([[design]] §3 D6).
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos')`, con un
    `it` que asserta los tres `testID` **en el orden del árbol** y que
    `queryByTestId` de un cuarto tile devuelve `null`, y un `it` que asserta el
    rótulo.

### R2 — Cada tile navega a su ruta y a ninguna otra

- **R2**: WHEN el usuario pulsa un tile THE SYSTEM SHALL llamar a
  `router.push()` con **la ruta de su fila de R1 y solo esa**: `/weight-log`,
  `/add-reminder` y `` `/pets/${selectedPetId}/docs` `` respectivamente;
  AND THE SYSTEM SHALL usar exclusivamente rutas que ya existen en
  `src/app/`, verificadas fichero a fichero en §0.1;
  AND THE SYSTEM SHALL **no** crear ningún fichero de ruta nuevo en
  `src/app/`, **no** registrar ninguna `Tabs.Screen` nueva en
  `src/app/(tabs)/_layout.tsx` y **no** modificar
  `src/components/floating-tab-bar.tsx`;
  AND el uso de `as Href` SHALL limitarse a los **dos** sitios donde el repo ya
  lo usa por la misma causa —`/add-reminder` (`reminders/index.tsx:149`) y la
  ruta dinámica de documentos (`profile/index.tsx:299`)—, y **nunca** para
  silenciar el error de una ruta que no existe: `/weight-log` typechequea sin
  cast (`health.tsx:268`) y debe seguir sin él. IF una ruta necesita un cast que
  esta lista no prevé THEN **para y repórtalo**.
  - **El destino 3 es una ruta dinámica**, y su parámetro es el `selectedPetId`
    que R10 ya exige para renderizar la sección. Dentro de la sección
    `selectedPetId` no es `null`, así que la ruta siempre se construye completa;
    no hay rama de "sin mascota" dentro del `.map()`.
  - Test: mismo `describe` que R1 →
    `it('lleva cada tile a su ruta existente')`, que pulsa los tres tiles y
    espera `mockRouter.push` llamado con `'/weight-log'`, `'/add-reminder'` y
    `'/pets/pet-1/docs'` —el id de la fixture—, **una vez cada uno y en ese
    orden** (`toHaveBeenNthCalledWith`); más
    `it('no apunta a ninguna ruta inexistente')`, que cruza los destinos con los
    ficheros reales de `src/app/(tabs)/` leídos con `readdirSync`, de modo que
    borrar una pantalla ponga la suite roja en vez de dejar un tile muerto.

### R3 — Los destinos se ganan el sitio: ni pestaña, ni de uso único, ni pantalla hija

- **R3**: WHEN se decide qué destinos entran en la rejilla THE SYSTEM SHALL
  admitir **solo** rutas que cumplan **las tres** condiciones, verificadas en
  §0.1 y §0.2:
  1. **No son alcanzables desde la barra de pestañas.** Las cinco pestañas son
     `home`, `map`, `health`, `food` y `profile`
     (`src/app/(tabs)/_layout.tsx:26-30`);
  2. **no son pantalla hija** de una pestaña, con su propio botón de volver
     hacia ella;
  3. **no son configuración de una sola vez**, sino una acción o consulta que
     el dueño repite.

  AND en consecuencia THE SYSTEM SHALL **no** renderizar tile alguno para
  ninguno de los cuatro destinos del Make, ni para ninguna de las cuatro rutas
  no-pestaña descartadas, según esta tabla —que es exhaustiva sobre §0.1 y
  §0.2 y no deja ninguna ruta de la app sin veredicto—:

  | Destino | Veredicto | Motivo, verificado |
  |---|---|---|
  | Mapa (`/map`) | **fuera** | falla (1): es pestaña, y su glifo de barra es **el mismo `Map`** (`floating-tab-bar.tsx:51`) |
  | Vacunas (`/health`) | **fuera** | falla (1): es pestaña |
  | Comidas (`/food`) | **fuera** | falla (1): es pestaña, y su glifo de barra es **el mismo `ForkKnife`** (`:53`) |
  | Actividad | **fuera** | **no existe destino**: no hay pantalla de actividad ni ruta `/trips` (cero ocurrencias en `mobile-pet-tracker/src/`); la actividad vive dentro de la propia Home desde #68 |
  | `/meal-schedule` | **fuera** | falla (2): pantalla hija de Nutrición, con `<Redirect href="/food" />` (`:318`) y vuelta con `router.back()` (`:132`) |
  | `/pairing` | **fuera** | falla (3): configuración de una vez por dispositivo. Y ya está **a un toque en la propia Home** (`collar-pair-link`) exactamente cuando hace falta |
  | `/pets/add` | **fuera** | falla (3): añadir mascota es casi siempre acción única |
  | `/reminders` | **fuera** | decisión del coordinador: **#70** pone en esta misma Home una sección de recordatorios **con enlace a la lista completa** (su criterio de aceptación 2). Un tile a la lista sería un segundo camino al mismo sitio en la misma pantalla |
  | **`/weight-log`** | **DENTRO** | cumple las tres |
  | **`/add-reminder`** | **DENTRO** | cumple las tres |
  | **`/pets/[petId]/docs`** | **DENTRO** | cumple las tres |

  AND el número de tiles SHALL ser **tres porque tres destinos pasan el filtro**,
  no porque el diseño dibuje cuatro: la rejilla se reparte a lo ancho
  (`flex-row gap-3`, cada tile `flex-1`), **no** en una rejilla de cuatro
  columnas con un hueco vacío ([[design]] §3 D5).
  - **El orden de los tres es por frecuencia plausible de uso**, y se defiende:
    1. **Peso** — el pesaje es el dato de salud que la app pide llevar al día, y
       es el único de los tres cuyo valor **ya se pinta en esta misma pantalla**
       (celda 1 de la tira de #69) sin forma de abrirlo, porque #69 R12 dejó las
       celdas deliberadamente no interactivas. El tile cierra ese bucle y va
       primero, adyacente a lo que hay justo encima.
    2. **Recordatorio** — se crea uno por vacuna, desparasitación o medicación:
       varias veces al año. Es además **la ruta más enterrada de la app**: tres
       toques desde la Home (§0.1), más que ninguna otra.
    3. **Documentos** — se consultan en cada visita al veterinario y se suben
       unas pocas veces al año: recurrente, pero menos que las dos anteriores.
  - **Por qué `/pairing` y `/pets/add` no entran aunque cumplan (1) y (2)**: son
    configuración inicial. Un acceso rápido permanente a una acción que se hace
    una vez ocupa sitio el resto de la vida del producto a cambio de un ahorro
    que ocurre una vez. `/pairing` además ya está en la Home.
  - Test: mismo `describe` que R1 →
    `it('no dibuja ningún tile a una pestaña ni a un destino inexistente')`, que
    asserta exactamente tres hijos en la fila de tiles y que el fuente de
    `src/screens/home/index.tsx` no contiene, **dentro del bloque
    `QUICK_ACTIONS`**, ninguno de `'/map'`, `'/health'`, `'/food'`, `'/trips'`,
    `'/reminders'`, `'/pairing'`, `'/pets/add'` ni `'/meal-schedule'`. La
    comprobación se acota al bloque de la constante porque la Home **sigue
    navegando a `/map` y a `/pairing`** desde `last-position-card`,
    `weekly-activity-day-map` y `collar-pair-link`, y esos usos son legítimos y
    no se tocan.

### R4 — Cruzar cualquiera de las cuatro decisiones entre dos tiles pone la suite roja

- **R4**: WHEN se renderizan los tres tiles THE SYSTEM SHALL ligar, **dentro
  del nodo de cada tile**, las cuatro decisiones de su fila de R1 y ninguna de
  otra fila, de modo que **intercambiar cualquiera de las cuatro entre dos
  tiles cualesquiera ponga la suite roja**;
  AND el test que lo prueba SHALL verificar las cuatro dimensiones **sobre el
  árbol renderizado**, una por una y con el tile como ámbito
  (`within(tile)`):

  | Dimensión | Cómo se observa |
  |---|---|
  | icono | `within(tile).getByTestId('icon-weight' \| 'icon-calendar-plus' \| 'icon-file-text')`, con el doble de `reicon` de R7 |
  | etiqueta | `within(tile).getByText('Peso' \| 'Recordatorio' \| 'Documentos')` |
  | color de fondo | `tile.props.className` contiene `bg-category-violet` \| `bg-category-amber` \| `bg-category-blue` |
  | destino | `fireEvent.press(tile)` → `mockRouter.push` con `/weight-log` \| `/add-reminder` \| `/pets/pet-1/docs` |

  AND las tres etiquetas, los tres colores y los tres destinos SHALL ser
  **distintos entre sí**, de modo que un cruce sea observable; ninguna dimensión
  SHALL compartir valor entre dos tiles;
  AND el test SHALL usar **`within(tile)`** y nunca un `getByTestId` global para
  el icono, porque `icon-weight` aparece **dos veces** en el árbol de la Home:
  en la celda `summary-weight` de #69 y en el tile 1 (R7).
  - **Esto es la lección de #69 aplicada por adelantado**: allí el reviewer
    encontró que R1 decidía **tres** cosas por celda —icono, etiqueta y valor— y
    solo una estaba vigilada. Aquí cada tile decide **cuatro**, y el criterio de
    aceptación es plantar la mutación en las cuatro, una por una, y que las
    cuatro pongan la suite roja **por separado** (R15b, mutaciones 1-4). Un
    test que solo comprueba que "hay tres tiles" no es un candado de conducta.
  - **Las cuatro dimensiones son observables en el árbol renderizado**, no en
    el fuente: éste **sí** es un candado de conducta, a diferencia de R13.
  - Test: mismo `describe` que R1 →
    `it('liga icono, etiqueta, color y destino de cada tile y de ninguno más')`.

### R5 — Los fondos salen de los tokens de #64, y la tinta se deriva del mismo hueco

- **R5**: WHEN se pinta el fondo de un tile THE SYSTEM SHALL tomarlo de
  **`CATEGORY_SLOTS[slot].surface`** de
  `mobile-pet-tracker/src/utils/category-palette.ts`, con el `slot` de su fila
  de R1, y SHALL **no** escribir en `src/screens/home/index.tsx` ninguna de las
  cadenas `bg-category-…` ni `text-category-…` ni interpolarlas;
  AND los tokens usados SHALL ser **exactamente** los que #64 dejó en
  `src/theme/global.css` —`--color-category-violet`, `--color-category-amber`,
  `--color-category-blue` y sus tres `-strong`—, **sin añadir, renombrar ni
  cambiar el valor de ningún token**, y sin ocupar los huecos `green` y `rose`,
  que quedan libres;
  AND WHEN se pinta el icono de un tile THE SYSTEM SHALL resolver su color con
  `useThemeColors` (carta §Decisiones fijas 9: el color para código imperativo
  siempre por ahí), pidiendo el token **derivado del mismo `slot`** —
  `` `category-${slot}-strong` `` — de forma que el fondo y la tinta de un tile
  **no puedan divergir por construcción**;
  AND THE SYSTEM SHALL **no** pedir `useThemeColors([... 'accent' ...])`, que el
  candado de #61 R4 (`legibility-classnames.test.ts:145-149`) rechaza en
  cualquier fuente de producción.
  - **Por qué esto no es opcional**: el candado **#64 R9**
    (`consistency-classnames.test.ts:372-433`) exige que
    `filesMatching(/bg-category-|text-category-/)` sea **exactamente**
    `['utils/category-palette.ts']` y que **ninguna** fuente interpole
    `bg-category-${...}`. Escribir la clase en la Home no es "menos limpio":
    pone la suite roja. La carta §Dirección de arte 1 nombra además los
    *"destinos de acceso rápido"* como uno de los tres consumidores previstos
    de esta paleta.
  - **El reparto hueco↔destino no choca con el de #64**, comprobado contra su
    tabla: violeta es análisis/desparasitación, ámbar es medicación y azul es
    vacunación. Peso→violeta es hueco libre en su dominio; recordatorio→ámbar y
    documentos→azul son **coherentes** con lo que esos huecos ya significan.
    Los huecos sirven a tres dominios independientes —tipos de recordatorio,
    tipos de documento y destinos de acceso rápido— y la carta los declara así.
  - **Contrastes calculados, no estimados** (método de #61, recalculados para
    este reparto en [[design]] §4): tinta sobre su superficie —claro / oscuro—
    violeta **4,72 / 4,81**, ámbar **4,70 / 4,78**, azul **4,75 / 4,81**; los
    tres pasan AA en los dos temas. La etiqueta va en `text-foreground`, que
    sobre las tres superficies da entre **15,4** y **17,8**.
  - Test: mismo `describe` que R1 →
    el `it` de R4 cubre la clase de fondo por tile; más
    `src/__tests__/consistency-classnames.test.ts` (#64 R9) **en verde y sin
    tocar**, que es lo que prueba que la Home no escribió ninguna clase
    categórica; más un `it` que lee el fuente y exige la derivación
    `` `category-${…}-strong` `` (candado de forma, declarado como tal en R13).

### R6 — Cada tile mide ≥44pt de área táctil

- **R6**: WHEN se renderiza un tile THE SYSTEM SHALL declarar en su `className`
  la clase **`min-h-11`** (44 px = 44 pt), que es la receta que el repo ya usa
  para garantizar el objetivo táctil sin `hitSlop` en controles que ocupan su
  propia caja —`home/index.tsx:360` (`collar-pair-link`),
  `pairing/index.tsx:332,342,390,481` y las columnas de la gráfica de #68—;
  AND cada tile SHALL ser `flex-1` dentro de una fila de tres, de modo que su
  ancho en la pantalla más estrecha soportada (320 px menos los 48 px de padding
  horizontal, menos dos `gap-3`) sea **≈ 82 pt**, muy por encima de 44 en el eje
  horizontal ([[design]] §3 D5);
  AND THE SYSTEM SHALL **no** añadir `hitSlop={TOUCH_SLOP}` a los tiles: la
  constante de #61 existe para agrandar el área de controles cuya caja visible
  se queda corta, y aquí la caja visible ya mide ~67 pt de alto (12 + 24 + 6 +
  ~13 + 12); añadirlo solaparía las áreas táctiles de tiles contiguos.
  - **El candado de #61 R10 no es global**: vive replicado como
    `describe('#61 R10: los controles táctiles declaran TOUCH_SLOP')` en siete
    ficheros de test de pantalla —`health`, `weight-log`, `meal-schedule`,
    `docs`, `profile`, `add-pet`, `add-reminder`— y **la Home no está entre
    ellos** ([[design]] §1 P7). Por eso R6 pone su propia aserción en vez de
    dar por hecho que algo lo vigila.
  - Test: mismo `describe` que R1 →
    `it('da a cada tile 44 pt de objetivo táctil')`, que asserta `min-h-11` y
    `flex-1` en el `className` de los tres tiles y que ninguno declara
    `hitSlop`.

### R7 — Iconos reales de `reicon`, nunca el emoji del Make, y ninguno repetido del tab bar

- **R7**: WHEN se renderiza el icono de un tile THE SYSTEM SHALL usar un
  componente de `reicon-react-native` con `size={24}` y el color de tinta de R5
  —`Weight`, `CalendarPlus` y `FileText`, los tres **verificados presentes** en
  `node_modules/reicon-react-native/index.d.ts`—;
  AND ninguno de los tres SHALL coincidir con un glifo de la barra de pestañas
  —`Home`, `Map`, `HeartPulse`, `ForkKnife`, `Profile`
  (`floating-tab-bar.tsx:49-54`)—, porque repetir un glifo de la barra en un
  tile es exactamente el defecto que R3 elimina;
  AND THE SYSTEM SHALL **no** usar los emoji del Make (`🗺️ 🏃 💉 🍽️`,
  `design-src/App.tsx:399-402`) ni ningún glifo tipográfico como icono, que es
  lo que prohíbe **#62 R7** (candado en
  `consistency-classnames.test.ts:186-217`);
  AND THE SYSTEM SHALL **no** instalar ninguna dependencia: `reicon-react-native`
  ya lo es, y el veto nominal a `expo-linear-gradient` sigue vivo.
  - **`Weight` se repite a propósito dentro de la Home**, y esto es distinto de
    repetir un glifo del tab bar: la celda `summary-weight` de #69 muestra el
    **valor** del peso y el tile 1 abre su **histórico**; es el mismo concepto,
    así que el mismo glifo es la señal correcta de que el tile abre lo que la
    celda enseña. Elegir `Scale` para el tile daría dos glifos distintos para un
    solo concepto en una misma pantalla, que es peor. Consecuencia obligatoria:
    R4 exige `within(tile)` y prohíbe el `getByTestId` global para el icono.
  - **Un ajuste obligatorio en el doble de `reicon` de la Home**: hoy el mock
    de `src/screens/home/index.test.tsx:62-82` nombra los dobles **por su sitio
    de uso** (`Weight` → `summary-icon-weight`), y ese nombre deja de ser único
    en cuanto aparece un segundo sitio que usa `Weight`. El doble SHALL
    renombrarse a nombres **por icono**: `Weight`→`icon-weight`,
    `Walk`→`icon-walk`, `Moon`→`icon-moon`, `Map`→`icon-map`, y añadir
    `CalendarPlus`→`icon-calendar-plus` y `FileText`→`icon-file-text`. Las
    **cuatro** referencias del `it` de #69 (`index.test.tsx:1341-1344`) se
    actualizan al nombre nuevo **sin debilitar su aserción**, que ya está
    acotada con `within(value.parent!)` y por tanto sigue siendo correcta con un
    segundo `Weight` en el árbol. Es un cambio **solo de fichero de test**:
    ningún `testID` de producción se renombra ni se elimina.
  - Test: mismo `describe` que R1 → el `it` de R4 (dimensión icono), más un
    `it` que lee el fuente con `readFileSync` y asserta el import de los tres
    iconos, sus tres usos con `size={24}`, la ausencia de los cuatro emoji y la
    ausencia de `HeartPulse` y `ForkKnife` en el bloque `QUICK_ACTIONS`.

### R8 — Radio `rounded-xl` y esquina continua

- **R8**: WHEN se renderiza un tile THE SYSTEM SHALL darle `rounded-xl` —la
  carta §Decisiones fijas 12 dice literalmente *"Control, **tile**, input,
  botón y píldora de dato → `rounded-xl`"*, así que no hay decisión abierta— y
  `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts`, porque es una
  esquina no-cápsula que el repo dibuja por su cuenta (#62 R14);
  AND THE SYSTEM SHALL **no** usar `rounded-2xl`, que es lo que trae el Make
  (`design-src/App.tsx:404`) y lo que el candado de #62 R4
  (`consistency-classnames.test.ts:149-155`) prohíbe en producción;
  AND el `style={CONTINUOUS_CORNER}` SHALL escribirse **una sola vez** en el
  `.map()` de R1, no tres veces: es una consecuencia directa de renderizar los
  tiles desde la tabla, y es lo que hace que el delta del inventario de #62 R14
  sea **+1** y no +3 (R14).
  - **Desviación declarada respecto al Make**: los tiles tienen 12 px de radio
    en vez de los 16 del diseño. Es la misma desviación que #62 ya cerró para
    toda la app; no se re-litiga aquí.
  - Test: `src/__tests__/consistency-classnames.test.ts` (#62 R14) con el delta
    de R14, y (#62 R4) en verde sin cambio.

### R9 — Tres botones anunciados por separado

- **R9**: WHEN un lector de pantalla recorre la rejilla THE SYSTEM SHALL dejar
  que anuncie **tres botones**, uno por tile, cada uno leyendo su etiqueta;
  AND cada tile SHALL declarar `accessibilityRole="button"` —el patrón que la
  propia Home ya usa en `collar-pair-link` (`:358-359`)—;
  AND THE SYSTEM SHALL **no** declarar `accessible` ni `accessibilityLabel` en
  la fila contenedora ni en la sección, que colapsarían los tres tiles en un
  nodo único e impedirían pulsarlos por separado —el mismo defecto que #68 D5
  documentó para la gráfica y que #69 R12 evitó para la tira—;
  AND las etiquetas visibles SHALL bastar como nombre accesible: no se añade
  `accessibilityLabel` redundante.
  - Test: mismo `describe` que R1 →
    `it('anuncia los tres tiles como botones independientes')`, que asserta
    `accessibilityRole` `'button'` en los tres, y que ni `quick-actions` ni la
    fila de tiles declaran `accessible` ni `accessibilityLabel`.

### R10 — Dónde va la rejilla en el árbol, y cuándo aparece

- **R10**: WHEN se renderiza `home-content` THE SYSTEM SHALL colocar
  `quick-actions` **entre `collar-card` y `weekly-activity-card`**, que es el
  orden del diseño: tira de datos (`:368-383`) → fila de collar/ubicación
  (`:384-394`) → accesos rápidos (`:395-410`) → actividad semanal (`:411-424`);
  AND el orden completo SHALL quedar
  `summary-card` → `collar-card` → `quick-actions` → `weekly-activity-card` →
  `last-position-card`;
  AND la sección SHALL renderizarse **solo si hay mascota seleccionada**
  (`selectedPetId !== null`), igual que `summary-card`, por dos razones: los
  tres destinos son pantallas con ámbito de mascota, y el destino 3 **necesita
  el `petId` como parámetro de ruta** (R2), así que sin él el tile no podría
  construir su destino;
  AND la sección SHALL renderizarse **sin depender de `detail` ni de
  `activity`**: no tiene skeleton, no tiene estado de error y no desaparece
  cuando una petición falla. Es el único bloque de la Home sin estados, y ésa
  es la consecuencia directa de ser navegación pura;
  AND THE SYSTEM SHALL **no** añadir margen negativo ni solape: el
  `gap: 16` de `home-content` ya separa la sección de sus vecinas.
  - **Los dos candados de orden que ya existen siguen verdes sin tocarlos**,
    comprobado y no supuesto: el de #68 (`index.test.tsx:1181-1209`) y el de
    #69 (`:1364-1414`) filtran a una **lista blanca** de `testID` antes de
    comparar, así que un hermano nuevo no los mueve.
  - Test: mismo `describe` que R1 →
    `it('coloca la rejilla entre el collar y la actividad semanal')`, que lee
    los `testID` de los hijos de `home-content`, filtra a los cinco y espera la
    secuencia completa; más un `it` que asserta que sin `selectedPetId` la
    sección no se renderiza.

### R11 — Cuatro claves de copy nuevas, en los dos idiomas y registradas

- **R11**: WHEN esta feature introduce copy THE SYSTEM SHALL añadir a
  `mobile-pet-tracker/src/i18n/catalog.ts` **exactamente cuatro** claves
  nuevas, en los bloques `en` **y** `es`:

  | Clave | `en` | `es` |
  |---|---|---|
  | `home.quickActions` | `Quick actions` | `Accesos rápidos` |
  | `home.quickActionWeight` | `Weight` | `Peso` |
  | `home.quickActionReminder` | `Reminder` | `Recordatorio` |
  | `home.quickActionDocuments` | `Documents` | `Documentos` |

  AND las tres etiquetas de tile SHALL resolverse por el campo
  `labelKey` de la tabla de R1 y el rótulo por un `t('home.quickActions')`
  literal, sin dejar ningún literal de copy en el fuente (carta §Dirección de
  arte 6);
  AND SHALL añadirse **cuatro** filas
  `{ file: 'src/screens/home/index.tsx', key: '<clave>' }` al bloque `R3_HOME`
  de `src/__tests__/ui-copy-table.ts:45-83`;
  AND SHALL registrarse las cuatro claves en la tabla de
  `specs/mobile-ui-language/design.md` §2, bloque de
  `src/screens/home/index.tsx`, con el formato literal de las filas que ya
  añadieron #67 y #69 (`← añadida por #71 (R11)`);
  AND THE SYSTEM SHALL **no** reutilizar `home.weight` —que es la etiqueta de la
  celda de #69, dentro de la misma pantalla, y cambiarla o compartirla ataría
  dos textos que pueden divergir—, ni `health.weightLog`, `profile.documents`,
  `profile.reminders` ni `reminders.new`: cruzarían ámbito del catálogo, que es
  lo que #68 y #69 ya descartaron por escrito.
  - **`home.quickActionWeight` vale `Peso`, igual que `home.weight`**. Son dos
    claves con el mismo valor a propósito: una etiqueta una celda de dato y la
    otra un botón de navegación, y el candado de #65 no prohíbe valores
    repetidos, solo claves ausentes en un idioma.
  - **Las etiquetas ya no salen del Make**, porque los destinos tampoco (R3).
    Se nombran por el destino en el idioma de la app, en singular para las dos
    que son acciones de alta (`Peso`, `Recordatorio`) y en plural para la que
    es una lista (`Documentos`).
  - Test: `src/__tests__/ui-language.test.ts` (candados de #65: una clave
    presente en un idioma y ausente en el otro no compila, `:348`;
    `checkUses(R3_HOME)` exige una fila por uso, contando tanto `t('clave')`
    como `labelKey: 'clave'`) más el delta de R14.

### R12 — Cero datos, cero llamadas nuevas, cero backend

- **R12**: WHEN esta feature se implemente THE SYSTEM SHALL **no** leer ningún
  dato: ni `detail`, ni `activity`, ni `pets`. Lo único que consume es
  `selectedPetId`, que ya existe en la pantalla vía `useSelectedPet()` y que R10
  y R2 necesitan;
  AND SHALL **no** añadir ninguna llamada a la API, ningún parámetro nuevo, y
  **no** tocar `src/api/`, `src/hooks/use-api.ts` ni ningún fichero de
  `backend-pet-tracker/`, `infra/` ni `hosting/`;
  AND SHALL **no** tocar `src/components/` —ni `card.tsx`, ni
  `pet-hero-header.tsx`, ni `floating-tab-bar.tsx`—,
  `src/screens/home/format.ts` ni `src/screens/home/weekly-activity-chart.tsx`.
  - IF durante la implementación aparece algo en la rejilla que exija un dato
    THEN **la feature se para y se reporta**: una rejilla que necesita datos ya
    no es esta feature.
  - Test: mismo `describe` que R1 →
    `it('no añade ninguna llamada a la API')`, que compara el recuento de
    `mockGetPet`, `mockGetDailyActivity` y `mockListPets` con el escenario
    equivalente sin rejilla y espera **el mismo número**; más `git diff --stat`
    limpio fuera de `mobile-pet-tracker/` y `specs/`, que verifica el reviewer.

### R13 — Cero drift de estilo en los ficheros de esta feature

- **R13**: WHEN esta feature termine THE SYSTEM SHALL mantener, en **todos** los
  ficheros que toca, cero literales hexadecimales, cero clases arbitrarias
  `[...]`, cero `StyleSheet` y cero clases de radio fuera de la escala de
  #62 R4 (`rounded-card`, `rounded-xl`, `rounded-full`);
  AND SHALL añadir a `src/__tests__/design-drift.test.ts` un bloque propio
  `describe('#71 R13: la rejilla de accesos rápidos no mete drift de estilo')`
  con la lista nominal de sus ficheros —`i18n/catalog.ts`,
  `screens/home/index.test.tsx`, `screens/home/index.tsx`— y el mismo patrón
  `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` que ya usan los bloques `R9`,
  `#68 R18` y `#69 R13`.
  - **Por qué un bloque propio y no confiar en el de #68 o el de #69**: los
    tres ficheros de esta feature están hoy cubiertos por listas nominales de
    **otras** features; si mañana alguien las reordena o las recorta, la
    cobertura de #71 desaparece **en silencio**, y no hay barrido global que la
    sustituya (§0.3).
  - **Declarado por escrito, como piden las lecciones del encargo**: R13 y la
    aserción de forma de R5 son candados de **cadena literal**, no de conducta,
    y no pueden ser otra cosa —"no hay un hex en el fuente" no es un
    comportamiento observable en el árbol renderizado, porque un hex y un token
    resuelven al mismo color en pantalla—. Los requisitos de **conducta** de
    esta feature (R1, R2, R3, R4, R6, R9, R10, R12) se fijan sobre la salida
    renderizada, y son ésos los que llevan mutación (R15b).
  - Test: `src/__tests__/design-drift.test.ts` :: el bloque nuevo.

### R14 — Los candados se mueven por delta declarado contra `f9163bf`

- **R14**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `f9163bf`**, nunca cifras absolutas escritas a
  mano, y SHALL distinguir **reubicación** (la ruta cambia, la cifra no) de
  **delta real** (la cifra cambia). Esta feature **no reubica nada** —no mueve
  ni crea ningún fichero de producción— así que toda la tabla es delta real:

  | # | Candado | Fichero del candado | Delta | Motivo |
  |---|---|---|---|---|
  | 1 | **longitud del catálogo** | `src/providers/__tests__/language-provider.test.tsx:41` | `260 + 16 + 1` → **`260 + 16 + 1 + 4`** | las cuatro claves de R11 |
  | 2 | filas de `R3_HOME` | `src/__tests__/ui-copy-table.ts:45-83` y `ui-language.test.ts:83` | **+4** (`21 + 15 + 1` → `21 + 15 + 1 + 4`) | ídem |
  | 3 | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:269-332` y total cerrado en `:330` | fila `screens/home/index.tsx`: **1 → 2**; total cerrado **`33 + 1` → `33 + 1 + 1`** | el único `style={CONTINUOUS_CORNER}` del `.map()` de R8 |
  | 4 | bloque de drift de estilo | `design-drift.test.ts` | **+1 `describe`** | R13 |
  | 5 | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:357` | **sin cambio** (`19 + 2`) | la copy vive en `src/screens/home/index.tsx`, que ya está en la lista: **por eso la rejilla no se saca a un módulo propio** |
  | 6 | `#64 R9` clases categóricas | `consistency-classnames.test.ts:404` | **sin cambio**: `inventory.files` sigue siendo `['utils/category-palette.ts']` | R5. Si este candado se mueve, alguien escribió la clase en la Home |
  | 7 | `#64 R9` usos de `bg-accent-soft` | `consistency-classnames.test.ts:422-430` | **sin cambio** (16) | los tiles usan superficies categóricas, no el acento suave |
  | 8 | `#62 R15` cifras tabulares | `consistency-classnames.test.ts:334-370` | **sin cambio** | los tiles no pintan ninguna cifra |
  | 9 | `#61 R4` acento como tinta | `legibility-classnames.test.ts:117-150` | **sin cambio** (home: 1; total: 13) | la tinta de los tiles es categórica, no el acento |
  | 10 | `#62 R1` botones primarios | `consistency-classnames.test.ts:65-105` | **sin cambio** | no se añade ningún `rounded-xl bg-accent` |
  | 11 | `#62 R4` escala de radios | `consistency-classnames.test.ts:149-155` | **sin cambio** (lista vacía) | R8: `rounded-xl`, nunca `rounded-2xl` |
  | 12 | `ALL_USES` vs. suma de bloques | `ui-copy-table.ts:381-393` | **cuadra solo** | el candado ya es consistencia interna |
  | 13 | orden de `home-content` (#68 y #69) | `index.test.tsx:1181-1209` y `:1364-1414` | **sin cambio** | filtran a lista blanca (R10) |
  | 14 | `#62 R7` glifos como icono | `consistency-classnames.test.ts:186-217` | **sin cambio** | R7: iconos de reicon, cero emoji |

  El implementer sustituye cada número por el que devuelva el propio `grep`; el
  reviewer comprueba el **delta**, no el valor. IF un total cerrado se mueve por
  una causa que esta tabla no prevé THEN **para y repórtalo**: no lo absorbas
  subiendo el número.
  - **La fila 1 va la primera a propósito.** `language-provider.test.tsx:41` se
    omitió en las specs de #68 y de #69, y **paró la implementación las dos
    veces**. No es una decisión de producto: es la consecuencia mecánica de
    R11. Se autoriza **solo** cambiar `260 + 16 + 1` por `260 + 16 + 1 + 4`,
    conservando la base histórica **visible como suma**, sin tocar ninguna otra
    línea de ese fichero y sin debilitar el `toEqual` que compara los dos
    idiomas. Reescribir la base como un `281` plano **no** se autoriza.
  - Test: los propios candados, en verde, con los deltas aplicados.

### R15 — Verificación: suite verde y grep-clean

- **R15**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa en verde —`bun run test` y `bun run typecheck` desde
  `mobile-pet-tracker/`— sin debilitar ni eliminar ningún assert de conducta y
  sin renombrar ningún `testID` **de producción**; AND SHALL mantener el
  grep-clean de la carta §Decisiones fijas 3 intacto: **cero** hex fuera de
  `src/theme/`, **cero** clases arbitrarias `[...]`, **cero**
  `StyleSheet.create`, **cero** shadow/elevation legacy y **cero** clases de
  radio fuera de la escala de #62 R4.
  - Antes de tocar código: borrar `mobile-pet-tracker/.expo/types/router.d.ts`
    si existe (está gitignorado y rompe el typecheck con rutas fantasma — y
    esta feature toca rutas, dos de ellas con `as Href`, así que es
    especialmente probable que muerda) y comprobar con `pgrep -f init.sh` que no
    hay otro gate corriendo en un worktree hermano, porque comparten el Postgres
    de docker.

- **R15b**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar,
  con las **siete** mutaciones plantadas **de una en una** y la evidencia en
  `progress/impl_mobile-home-quick-actions.md` §prueba de mutación, que la
  suite se pone **roja** con cada una:
  1. el tile 1 apunta a `/add-reminder` en vez de a `/weight-log` (cruce de
     **destino**; mata R2 y R4);
  2. los tiles 2 y 3 intercambian su `Icon` (cruce de **icono**; mata R4 y R7);
  3. los tiles 2 y 3 intercambian su `labelKey` (cruce de **etiqueta**; mata R4
     y R11);
  4. el tile 1 pasa de `slot: 'violet'` a `slot: 'amber'` (cruce de **color**;
     mata R4 y R5);
  5. se añade un cuarto tile a `/map` a `QUICK_ACTIONS` (mata R1 y R3);
  6. `quick-actions` se monta **detrás** de `weekly-activity-card` (mata R10);
  7. el tile pierde `min-h-11` (mata R6).
  - **Las cuatro primeras son la lección de #69 aplicada por adelantado**: cada
    tile decide **cuatro** cosas, y el criterio de aceptación es que las cuatro
    mutaciones pongan la suite roja **por separado**. Si alguna deja la suite
    verde, el candado de R4 está mal escrito y se arregla **antes** de seguir.
  - **La mutación 5 es la que vigila el criterio nuevo de R3**: un tile a `/map`
    es precisamente la duplicación de pestaña que esta reescritura elimina, y
    tiene que poner la suite roja por dos sitios —el recuento de tres tiles y la
    lista de rutas prohibidas dentro de `QUICK_ACTIONS`—.
  - **Las siete son mutaciones de código de producción**, versionadas en el
    commit rojo y revertidas en el verde. **Ninguna puede plantarse en el doble
    de `reicon` ni en ningún otro mock**: `CHECKPOINTS.md` C4, quinto punto,
    añadido el 2026-09-08 tras #69 precisamente por eso. La mutación 2
    intercambia el `Icon` **en la tabla `QUICK_ACTIONS` de producción**, no las
    entradas del mock.
  - Test: requisito de verificación (`CHECKPOINTS.md` C4 vía (b)); la evidencia
    es el informe.

---

## Enmiendas a specs aprobadas

**Esta feature no necesita ninguna enmienda.** Se ha comprobado uno por uno:

- **#64** (paleta pastel categórica): **no se toca**. R5 consume
  `CATEGORY_SLOTS` tal cual está; no añade tokens, no añade huecos, no toca
  `src/utils/category-palette.ts` ni `src/theme/global.css`. El candado #64 R9
  queda **sin cambio**, y ése es justamente el requisito.
- **#61 R10** (objetivos táctiles): **no se toca**. R6 alcanza los 44 pt por
  tamaño de caja, que es el otro camino que la propia #61 reconoce; no añade ni
  quita ningún `hitSlop` de los trece controles que #61 enumera.
- **#62 R4, R7, R14, R15** y **#61 R4**: sin cambio salvo el delta de esquinas
  continuas de R14 fila 3, que es el uso previsto del candado, no una enmienda.
- **#68 R15** (Home en `src/screens/home/`): **no se toca**. No se migra nada.
- **#69** (tira de estadísticas): **no se toca**. La rejilla es un hermano
  nuevo; ni un `testID` ni un assert de #69 cambia, salvo el renombrado de los
  **dobles de test** de `reicon` que R7 prescribe, que no toca producción y no
  debilita ninguna aserción —la de #69 ya está acotada con `within()`—.
- **#65** (catálogo): R11 añade cuatro claves, que es el procedimiento normal,
  no una enmienda.
- **`docs/ui-guidelines.md`**: sin cambio. Ninguna decisión de esta spec
  contradice la carta; al contrario, §Dirección de arte 1 ya nombra los
  *"destinos de acceso rápido"* como consumidores de la paleta categórica, y
  §Dirección de arte 5 —*"fidelidad no es pérdida de información"*— es
  compatible con R3: no se pierde ningún dato, se cambian tres enlaces
  redundantes por tres que no lo son.

---

## Decisiones abiertas para el humano

**Ninguna.** La única que quedaba —E1, tres tiles o un cuarto destino— la
resolvió el humano el 2026-09-08 con un criterio distinto a las cuatro opciones
que esta spec había planteado, y ese criterio es ahora R3. El número de tiles
deja de ser una elección: son **tres porque tres destinos pasan el filtro**, y
la tabla de R3 da veredicto a las once rutas de la app sin dejar ninguna sin
juzgar.

Lo que queda para el gate no es una decisión abierta sino una **ratificación**,
en §Aprobación: que la desviación respecto al Make sea total —forma sí,
destinos y etiquetas no— es la desviación más grande de este bloque del
rediseño y el humano tiene que firmarla sabiendo que el smoke lado a lado ya no
va a coincidir en esta sección.

---

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **Un tile a `/reminders`.** Lo decide el coordinador y la razón es concreta:
  **#70** (`mobile-home-reminders-section`, `pending`) va a poner en **esta
  misma Home** una sección de recordatorios **con enlace a la lista completa**
  —es su criterio de aceptación 2, *"el acceso a la lista completa navega a la
  pantalla de recordatorios existente"*—. Un tile a `/reminders` sería un
  segundo camino al mismo sitio en la misma pantalla: exactamente el defecto de
  duplicación que #69 R5 tuvo que corregir con `walkCount`, y que esta
  reescritura existe para evitar. El tile 2 va a `/add-reminder`, que es una
  acción de **alta** y no un segundo camino a la lista.
- **Un tile a cualquiera de los cuatro destinos del Make** —`/map`, `/health`,
  `/food` y la Actividad inexistente—. R3.
- **Un tile a `/pairing` o a `/pets/add`.** R3: configuración de una sola vez.
- **Un tile a `/meal-schedule`.** R3: pantalla hija de la pestaña Nutrición.
- **Crear la pantalla de actividad, o una ruta `/trips`.** No existe ninguna de
  las dos y ésta no es la feature que las trae.
- **Tocar la barra de pestañas** (`src/components/floating-tab-bar.tsx`) o
  registrar pestañas nuevas en `src/app/(tabs)/_layout.tsx`. Que tres destinos
  del diseño ya sean pestaña es el hecho que R3 usa, no un problema que esta
  feature arregle.
- **La sección "Recordatorios" de la Home** (a partir de `design-src/App.tsx:425`).
  Feature **#70**.
- **La píldora "En línea"** y el pestillo de conectividad. Feature **#73**.
- **Tocar la tira de estadísticas de #69, la gráfica de #68, el hero de #67 o
  cualquiera de sus `testID`.** Están cerradas; esta feature solo añade un
  hermano.
- **Hacer interactiva la celda `summary-weight` de #69** para que abra el
  histórico. #69 R12 la dejó no interactiva a propósito; el tile 1 es lo que
  resuelve ese acceso, y cambiar la celda sería enmendar #69.
- **Tocar `src/components/`**, `format.ts` o `weekly-activity-chart.tsx`. R12.
- **Añadir, renombrar o cambiar tokens en `src/theme/global.css`.** R5: los
  seis huecos de #64 ya existen y esta feature consume tres.
- **Escribir clases `bg-category-*` fuera de `src/utils/category-palette.ts`.**
  Lo prohíbe #64 R9 y lo repite R5.
- **Cualquier llamada nueva a la API, cualquier dato y cualquier ruta nueva.**
  R12 y R2.
- **Backend, infraestructura y configuración de Expo.** Cero ficheros.
- **Dependencias nuevas.** Ninguna hace falta: `Weight`, `CalendarPlus` y
  `FileText` ya están en `reicon-react-native`. `expo-linear-gradient` sigue
  vetado por nombre.
- **Migrar ninguna pantalla ni mover ningún fichero.** La Home ya vive en
  `src/screens/home/` con route delgado desde #68 R15. Por eso R14 no tiene
  reubicaciones. Y por eso la rejilla **no** se saca a
  `src/screens/home/quick-actions.tsx`: haría crecer `SCREEN_FILES` (R14 fila
  5) a cambio de nada.
- **Animación de entrada de los tiles.** El Make no la tiene y la carta no la
  pide.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-08) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. **El criterio de R3**, que él mismo fijó el 2026-09-08: un tile solo se gana
   el sitio si su destino **no es alcanzable desde la barra de pestañas**, no es
   pantalla hija de una pestaña y no es configuración de una sola vez.
2. **Los tres destinos y su orden** (R1, R3): `Peso → /weight-log`,
   `Recordatorio → /add-reminder`, `Documentos → /pets/<petId>/docs`, ordenados
   por frecuencia plausible de uso y con el peso primero porque su valor ya está
   en la pantalla, en la celda de #69, sin forma de abrirlo.
3. **Que los cuatro destinos del Make quedan fuera los cuatro** y que esto es
   **la desviación más grande de este bloque del rediseño**: del diseño se toma
   la forma —rótulo, fila de tiles pastel, icono sobre etiqueta— y ni un solo
   destino ni una sola etiqueta. El smoke lado a lado **no** va a coincidir en
   esta sección, y es esperado, no un defecto.
4. **Que `/reminders` queda fuera por la colisión con #70**, y que el tile 2 va
   a la acción de alta y no a la lista.
5. **Que `/pairing` y `/pets/add` quedan fuera por ser de uso único**, aunque
   cumplan el criterio de no-pestaña.
6. **Las dos desviaciones de estilo respecto al Make**: los tiles llevan
   `rounded-xl` (12 px) en vez de `rounded-2xl` (16 px), porque #62 fijó la
   escala; y los emoji se sustituyen por iconos de `reicon` (R7).
7. **Que el glifo `Weight` se repite dentro de la Home a propósito** —celda de
   dato y tile que la abre son el mismo concepto— y que eso es distinto de
   repetir un glifo de la barra de pestañas, que es lo que R3 prohíbe.
8. **Que las siete preguntas de la Home** (carta §Dirección de arte 3) quedan
   como las declara [[design]] §5: #71 **no responde ninguna nueva** —es
   navegación, no información— y **no degrada ninguna**.
9. **Que esta feature no necesita ninguna enmienda** a spec aprobada, según la
   sección §Enmiendas.

**Gate humano de verificación, no delegable a IA**: smoke en **dev build de
Android** (nunca Expo Go), en tema **claro** y **oscuro**. Se comprueba: que la
rejilla aparece **entre la tarjeta del collar y la gráfica semanal**; que se
pulsan **los tres** tiles y cada uno abre la pantalla que promete; que al
guardar un recordatorio se vuelve a la **Home** y no a la lista —`router.back()`
de `add-reminder/index.tsx:89`—; que el tile de Documentos abre los de la
mascota **seleccionada** y no los de otra, probándolo con dos mascotas; que
ninguno de los tres iconos se confunde con uno de la barra de pestañas, que
sigue flotando debajo; que los tres pasteles se distinguen entre sí **y del
fondo** en los dos temas —el contraste superficie/fondo es 1,06-1,10 en claro y
1,16 en oscuro, correcto pero apretado ([[design]] §4)— y que el icono se lee
encima; que las tres etiquetas no se truncan en la pantalla más estrecha
disponible; y que TalkBack anuncia **tres botones** con sus etiquetas y no un
bloque único.
