---
feature: "mobile-home-quick-actions"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-quick-actions]]

> Decisiones técnicas de alto nivel. Los requisitos verificables viven en
> [[requirements]]; el orden de trabajo, en [[tasks]].
>
> **Todo lo de §1 se ha comprobado contra el árbol en `f9163bf`**, fichero por
> fichero y línea por línea. Nada de aquí sale de
> `progress/explore_design-gap-vs-make.md`, que es un informe fechado el
> 2026-09-04, anterior a seis features, y que ya metió **diez** premisas falsas
> entre #67 y #68. Todos los números de línea de su enunciado están caducados
> por definición: #68 reescribió la Home entera y la movió a
> `src/screens/home/`, y #69 le añadió una celda.
>
> **Esta spec se reescribió el 2026-09-08** tras una decisión del humano que no
> era ninguna de las cuatro opciones que la primera redacción había planteado.
> El cambio está en §2 C5 y su consecuencia, en §3 D1. La forma del Make se
> conserva; sus cuatro destinos, no.

---

## 1. Premisas verificadas

### P1 — La rejilla del Make: cuatro tiles pastel — **CIERTA, con la cita desplazada**

`specs/mobile-figma-polish/design-src/App.tsx:395-410`:

```
395  <div className="px-4 mb-5">
396    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Accesos rápidos</p>
397    <div className="grid grid-cols-4 gap-2.5">
398      {[
399        { emoji: "🗺️", label: "Mapa", bg: "#EEF4FF" },
400        { emoji: "🏃", label: "Actividad", bg: "#FFF7ED" },
401        { emoji: "💉", label: "Vacunas", bg: "#FFF0F3" },
402        { emoji: "🍽️", label: "Comidas", bg: "#F0FBF6" },
403      ].map(({ emoji, label, bg }) => (
404        <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl" style={{ background: bg }}>
405          <span className="text-2xl">{emoji}</span>
406          <span className="text-[10px] font-semibold text-foreground">{label}</span>
407        </button>
408      ))}
409    </div>
410  </div>
```

(Se ha recortado la indentación de origen para que quepa; los números de línea
son los del fichero. La sección de actividad semanal empieza en `:411`.)

Cuatro tiles en rejilla de cuatro columnas, emoji arriba, etiqueta en
`text-[10px] font-semibold text-foreground` —es decir, **la etiqueta va en
`foreground`, no en el color de la categoría**—, `rounded-2xl`, `py-3`,
`gap-1.5` dentro del tile y `gap-2.5` entre tiles. El rótulo de sección es
`text-xs font-semibold uppercase tracking-widest` sobre `text-muted-foreground`.
El rango real es `:395-410`, **no** `:396-412` (§2 C1).

**Ninguno de los cuatro `<button>` declara destino**: el Make es un prototipo
estático. Ese hueco es el que esta spec cierra, y al cerrarlo resultó que
ninguno de los cuatro se sostiene (§2 C4 y C5).

### P2 — La barra de pestañas: cinco destinos, y dos glifos que chocan — **VERIFICADO**

`src/app/(tabs)/_layout.tsx:26-30` registra exactamente cinco pestañas:

```
26  <Tabs.Screen name="home" />
27  <Tabs.Screen name="map" />
28  <Tabs.Screen name="health" />
29  <Tabs.Screen name="food" />
30  <Tabs.Screen name="profile" />
```

y `src/components/floating-tab-bar.tsx:49-54` las pinta:

```
49  const TABS = [
50    { name: 'home', labelKey: 'tabs.home', Icon: Home },
51    { name: 'map', labelKey: 'tabs.map', Icon: Map },
52    { name: 'health', labelKey: 'tabs.health', Icon: HeartPulse },
53    { name: 'food', labelKey: 'tabs.food', Icon: ForkKnife },
54    { name: 'profile', labelKey: 'tabs.profile', Icon: Profile },
```

Los tiles de Mapa y Comidas del Make habrían llevado `Map` y `ForkKnife`: **los
mismos componentes**, no iconos parecidos. Es el hecho que hace insostenible la
primera redacción de esta spec (§2 C5).

La barra es además **flotante** y se pinta sobre el contenido, así que los tres
tiles y las tres pestañas equivalentes habrían estado visibles **a la vez**, a
unos centímetros, en la misma pantalla.

### P3 — Las siete rutas que no son pestaña — **VERIFICADO con `ls` y con lectura**

Inventario completo de `src/app/` en `f9163bf`:

```
src/app/                 _layout.tsx  index.tsx  reset-password.tsx  (auth)/  (tabs)/
src/app/(tabs)/          _layout.tsx  home.tsx  map.tsx  health.tsx  food.tsx  profile.tsx
                         meal-schedule.tsx  weight-log.tsx  reminders.tsx  add-reminder.tsx
                         pairing.tsx  pets/add.tsx  pets/[petId]/docs.tsx
```

Cinco son pestaña. Las otras siete —`meal-schedule`, `weight-log`, `reminders`,
`add-reminder`, `pairing`, `pets/add`, `pets/[petId]/docs`— son navegables pero
**no** alcanzables desde la barra. Las de `(auth)/` quedan fuera por definición:
son de usuario no autenticado.

Lo que cada una hace de verdad, leído y no deducido, está en §0.2 de
[[requirements]]. Tres hechos deciden el reparto de R3:

- **`/weight-log`** es un formulario de alta de pesaje (`weight-input`,
  `weight-date-input`, `weight-bc-input`, `weight-submit` con
  `weightLog.logWeight`, `:158-208`) con el histórico debajo. Se llega desde
  `/health` (`health.tsx:262-272`), y su `router.push('/weight-log')` va **sin
  `as Href`**: la ruta typechequea sola.
- **`/add-reminder`** es un formulario de alta que al guardar hace
  **`router.back()`** (`src/screens/add-reminder/index.tsx:89`). Empujado desde
  la Home, guardar devuelve a la Home. Su call site actual usa `as Href`
  (`reminders/index.tsx:149`).
- **`/pets/[petId]/docs`** es la lista de documentos de una mascota, con estados
  vacío y de error, y vuelve con `router.back()` (`docs/index.tsx:83`). Su call
  site actual construye la ruta con plantilla y `as Href`
  (`profile/index.tsx:299`).

Y dos que las descartan:

- **`/meal-schedule`** declara `<Redirect href="/food" />` sin mascota (`:318`)
  y su botón de volver es `router.back()` hacia Food (`:132`): es pantalla hija
  de una pestaña.
- **`/pairing`** ya está a **un** toque desde la propia Home cuando hace falta
  —`collar-pair-link`, `home/index.tsx:359-362`, visible cuando
  `device === null`—.

### P4 — Los tokens de #64 existen, y traen candado — **CIERTA, y más restrictiva de lo que dice el enunciado**

`src/theme/global.css` declara los **diez** tokens categóricos en los dos temas
(cinco superficies + cinco tintas), más el hueco `neutral` que no es token sino
`bg-default`/`text-muted`:

```
--color-category-blue: #EFF6FF    --color-category-blue-strong: #0768E0     (claro)
--color-category-amber: #FFF7ED   --color-category-amber-strong: #A55E07
--color-category-green: #F0FBF6   --color-category-green-strong: #107148
--color-category-violet: #F5F3FF  --color-category-violet-strong: #7549F7
--color-category-rose: #FFF0F3    --color-category-rose-strong: #D80B34
--color-category-blue: #0B203A    --color-category-blue-strong: #4A8DDF     (oscuro)
--color-category-amber: #271E14   --color-category-amber-strong: #C17B22
--color-category-green: #12231B   --color-category-green-strong: #2AB87C
--color-category-violet: #221C33  --color-category-violet-strong: #9579E7
--color-category-rose: #39131A    --color-category-rose-strong: #E35E78
```

Los nombres de clase viven **solo** en `src/utils/category-palette.ts`
(`CATEGORY_SLOTS`), y hay dos candados vivos que lo imponen:

- **#64 R9** (`consistency-classnames.test.ts:372-433`):
  `filesMatching(/bg-category-|text-category-/)` debe ser **exactamente**
  `['utils/category-palette.ts']`, la lista de las diez clases debe estar
  completa y en orden, y **ninguna** fuente puede interpolar
  `bg-category-${...}` ni `text-category-${...}`.
- **#64 R10** (`:436-…`): la tabla de huecos de `docs/ui-guidelines.md` no se
  toca.

Es decir: el enunciado dice "sin los tokens habría que usar clases arbitrarias";
la realidad es más dura, **escribir la clase completa en la Home también pone la
suite roja**. La única vía es consumir `CATEGORY_SLOTS[slot].surface`.

### P5 — Los iconos que la feature necesita existen — **VERIFICADO en `index.d.ts`**

Comprobados uno por uno en `node_modules/reicon-react-native/index.d.ts` antes
de nombrarlos: `Weight`, `CalendarPlus`, `FileText`. También existen `Scale`,
`Bell`, `BellRing`, `AlarmClock`, `Files`, `Folder`, `Document`, `Notebook` y
`ClipboardList`, que son las alternativas evaluadas en §6 A5.

**No existe `MapPin`** en el paquete, dato que la primera redacción necesitó y
que se conserva aquí por si alguien vuelve a buscarlo.

### P6 — El sitio exacto donde entra la rejilla — **VERIFICADO**

`src/screens/home/index.tsx` (432 líneas) monta dentro de
`<View testID="home-content" style={{ paddingHorizontal: 24, gap: 16 }}>`:

| Bloque | Línea del `testID` | Condición de render |
|---|---|---|
| `home-content` (contenedor) | `:194` | siempre |
| `pet-hero-error` | `:196` | detalle en `error`/`unreachable` |
| `summary-card` (tira de #69) | `:207` | `selectedPetId` |
| `collar-card` | `:299` | `detail.data?.kind === 'ok'` (dentro de un fragmento) |
| `weekly-activity-skeleton` | `:375` | `selectedPetId && activity.data === undefined` |
| `WeeklyActivityChart` (`weekly-activity-card`) | `:383` | `activity.data?.kind === 'ok'` |
| `weekly-activity-day-map` | `:395` | día de hoy seleccionado |
| `last-position-card` | `:409` | detalle `ok` **y** con dispositivo |

La rejilla entra **entre `collar-card` y el skeleton de la gráfica**, es decir
después del fragmento que cierra en `:372` y antes del `:374` (R10). El
`gap: 16` del contenedor le da la separación; no hace falta margen.

Los fragmentos importan para el candado de orden: `collar-card` y la gráfica van
envueltos en `<>…</>`, que **no** crea nodo, así que los dos siguen siendo hijos
directos de `home-content` y la lista de `children` que leen los tests de #68 y
#69 los ve.

La Home además **sigue navegando a `/map` en dos sitios** (`:397` y `:411`) y a
`/pairing` en uno (`:362`). Esos usos son legítimos y no los toca esta feature;
por eso la comprobación de rutas prohibidas de R3 se acota al bloque
`QUICK_ACTIONS` y no barre el fichero entero.

### P7 — Los candados que esta feature roza — **CIERTOS, y uno no existe donde se creía**

| Candado | Dónde | Estado verificado |
|---|---|---|
| #64 R9 clases categóricas | `consistency-classnames.test.ts:372-433` | vivo; R5 depende de que **no** se mueva |
| #62 R14 esquinas continuas | `consistency-classnames.test.ts:269-332`, total cerrado en `:330` (`33 + 1`) | vivo; home vale hoy **1** |
| #62 R15 cifras tabulares | `consistency-classnames.test.ts:334-370` | vivo; sin cambio (la rejilla no pinta cifras) |
| #62 R4 escala de radios | `consistency-classnames.test.ts:149-155` | vivo; prohíbe `rounded-2xl` en producción |
| #62 R7 glifos como icono | `consistency-classnames.test.ts:186-217` | vivo |
| #61 R4 acento como tinta | `legibility-classnames.test.ts:117-150` | vivo; home vale **1**, total **13**; prohíbe `useThemeColors([...'accent'...])` |
| #65 copy por clave | `ui-copy-table.ts` + `ui-language.test.ts` | vivo; `checkUses` cuenta `t('k')` **y** `labelKey: 'k'` (`:48-55`) |
| longitud del catálogo | `providers/__tests__/language-provider.test.tsx:41` | vivo, `260 + 16 + 1` = **277**, y el catálogo tiene **277** claves. **Omitido en las specs de #68 y #69** |
| orden de `home-content` | `screens/home/index.test.tsx:1181-1209` (#68) y `:1364-1414` (#69) | vivos; **ambos filtran a lista blanca**, así que un hermano nuevo no los mueve |
| **#61 R10 objetivos táctiles** | `describe('#61 R10: …')` en `health.test.tsx:567`, `docs/index.test.tsx:163`, `meal-schedule.test.tsx:435`, `weight-log.test.tsx:432`, `add-pet/index.test.tsx:285`, `profile/index.test.tsx:769`, `add-reminder/index.test.tsx:431` | **replicado por pantalla, y la Home NO está** entre las siete. No hay inventario global de `TOUCH_SLOP` ni de `min-h-11`. Por eso R6 pone el suyo |

### P8 — El doble de `reicon` de la Home ignora props y nombra por sitio de uso — **CIERTA, y es un problema para esta feature**

`src/screens/home/index.test.tsx:62-82`:

```ts
const mockIcon = (testID: string) =>
  function MockIcon() { return React.createElement(View, { testID }); };
return { ...actual, Weight: mockIcon('summary-icon-weight'), Walk: …,
         Moon: …, Map: mockIcon('summary-icon-distance') };
```

Dos consecuencias, las dos verificadas:

1. **El doble descarta `size` y `color`.** No hay forma de asertar el color del
   icono desde el árbol renderizado sin reescribir el doble **y** mockear
   `useThemeColors`, que hoy **no** está mockeado en este fichero y devuelve el
   fallback `foreground` para todos los tokens en el entorno de test. Por eso
   §3 D9 resuelve la tinta **por construcción** en vez de por aserción.
2. **`Weight` está nombrado por su sitio de uso**, `summary-icon-weight`, y el
   tile 1 lo usa por segunda vez (§3 D8). El nombre deja de describir nada. R7
   lo renombra a `icon-weight` y actualiza las cuatro referencias del `it` de
   #69 (`:1341-1344`).

Comprobado también que el `it` de #69 asserta el icono con
`within(value.parent!).getByTestId(iconTestID)` (`:1349-1351`): está **acotado a
la celda**, así que un segundo `Weight` en el árbol no lo rompe ni antes ni
después del renombrado. Lo que **sí** rompería es un `getByTestId` global, y por
eso R4 lo prohíbe explícitamente.

### P9 — La fixture de la Home usa `id: 'pet-1'` — **VERIFICADO**

`makePet` (`index.test.tsx:92-…`) devuelve `id: 'pet-1'`, así que el destino del
tile 3 en los tests es `'/pets/pet-1/docs'`. Lo dice R2 con ese literal para que
nadie tenga que adivinarlo.

### P10 — No existe candado global de hex — **CIERTA, confirmada de nuevo**

`src/__tests__/design-drift.test.ts` es el único que persigue hexadecimales, y
lo hace sobre listas nominales: bloque `R9` (`:89`), `R11` (`:162`),
`#68 R18` (`:189`) y `#69 R13` (`:235`). Sin barrido global. R13 añade su
bloque.

---

## 2. Correcciones — premisas que salieron falsas

### C1 — La cita del Make está desplazada

El enunciado y `feature_list.json` dicen `App.tsx:396-412`. El bloque real es
**`:395-410`** (§1 P1). No cambia el trabajo, pero se corrige para que nadie lea
el rango equivocado.

### C2 — "los cuatro fondos se implementarían con clases arbitrarias"

Falso por defecto: hoy **no se pueden implementar de ninguna manera** salvo
consumiendo `CATEGORY_SLOTS`, porque #64 R9 prohíbe además la clase **completa**
fuera del módulo de paleta, no solo la arbitraria (§1 P4). La dependencia de #71
sobre #64 es más fuerte de lo que dice el enunciado, y R5 la escribe en su forma
real.

### C3 — "las rutas están en `src/app/`"

Cierto a medias: las once rutas de pantalla viven en `src/app/(tabs)/`, no
directamente en `src/app/`. Como `(tabs)` es un **grupo de ruta**, no aparece en
la URL y `router.push('/weight-log')` sigue siendo correcto; pero quien busque
`src/app/weight-log.tsx` no lo encuentra.

### C4 — "cuatro tiles a Mapa, Actividad, Vacunas y Comidas"

**Los cuatro se caen.** Actividad no tiene destino —no hay pantalla de actividad
ni ruta `/trips`, cero ocurrencias en `mobile-pet-tracker/src/`; la actividad
vive dentro de la propia Home desde #68—. Y los otros tres, por C5.

### C5 — "un tile a una pestaña vale porque etiqueta el tema, no la pantalla"

**Ésta es la premisa de la primera redacción de esta spec, y es falsa.** El
argumento era que "Vacunas" y "Comidas" son más específicos que "Salud" y
"Nutrición", así que el tile nombraría un tema y no una pantalla. Lo que ese
argumento no miró es §1 P2: los tiles habrían llevado **los mismos componentes
de icono** que la barra —`Map` y `ForkKnife`—, y la barra es flotante y está
visible en la misma pantalla. El resultado no es "un atajo por tema": son tres
botones que duplican tres de las cinco pestañas, dos de ellos con el glifo
idéntico, a unos centímetros de distancia.

**Criterio que lo sustituye, fijado por el humano el 2026-09-08**: un tile solo
se gana el sitio si su destino **no es alcanzable desde la barra de pestañas**.
Se acepta desviarse del Make en las etiquetas; lo que la fila tiene que ganarse
es **acortar un camino real**. Está en R3, con su tabla de veredictos.

---

## 3. Decisiones técnicas

### D1 — Qué se toma del Make, y qué no

Se conserva la **forma**: rótulo de sección en muted mayúsculas, una fila de
tiles con fondo pastel, icono arriba y etiqueta debajo, sobre el fondo de la
pantalla y sin tarjeta. Se conserva su **sitio** en el orden de la Home (R10).

No se conserva **ni un destino ni una etiqueta**. Es la desviación más grande
que este bloque del rediseño ha aceptado, y va al gate humano explícitamente
(§Aprobación punto 3) porque el smoke lado a lado deja de coincidir en esta
sección — que es la herramienta con la que se ha verificado todo el bloque.

La justificación es que los cuatro destinos del Make fallan por dos causas
distintas y ninguna es opinable: uno no existe en el producto, y tres ya están a
un toque en una barra que se ve al mismo tiempo (§2 C4 y C5).

### D2 — Los tres destinos, y por qué exactamente tres

El filtro de R3 tiene tres condiciones —ni pestaña, ni pantalla hija, ni
configuración de una vez— y se aplica a las once rutas de la app. Pasan tres.
**El número sale del filtro, no de copiar las cuatro casillas del diseño.**

| Destino | Frecuencia plausible | Camino hoy | Por qué en esta posición |
|---|---|---|---|
| 1. Peso → `/weight-log` | pesajes periódicos | 2 toques | Es el único cuyo **valor ya está en esta pantalla**, en la celda 1 de la tira de #69, sin forma de abrirlo: #69 R12 dejó las celdas no interactivas a propósito. El tile cierra ese bucle y va pegado debajo de lo que enseña el dato |
| 2. Recordatorio → `/add-reminder` | uno por vacuna, desparasitación o medicación | **3 toques**, el camino más largo de la app | Acción de alta recurrente y la ruta más enterrada. Al guardar hace `router.back()`, así que devuelve a la Home |
| 3. Documentos → `/pets/[petId]/docs` | consulta en cada visita al veterinario | 2 toques, dentro de la tarjeta de la mascota en Perfil | Recurrente, pero menos que las dos anteriores |

**Los descartados y su motivo exacto** están en la tabla de R3. Los dos que más
cuesta descartar:

- **`/pairing`** cumple (1) y (2) pero falla (3): se configura una vez por
  dispositivo. Y ya está a **un** toque en la propia Home cuando hace falta
  (`collar-pair-link`). Un acceso permanente a una acción que se hace una vez
  ocupa sitio siempre a cambio de ahorrar una vez.
- **`/pets/add`** falla (3) por lo mismo. Es el ejemplo que el propio
  coordinador puso.

### D3 — `href` es una función, en las tres filas

El destino 3 lleva el `petId` en la ruta. Tres formas de resolverlo, y la
elegida es la tercera:

1. `href` estático en dos filas y una rama especial para la tercera → rompe el
   `.map()` uniforme y con él el candado de R4, que es lo único que impide
   cruzar decisiones entre tiles. Descartada.
2. `href: '/pets/[petId]/docs'` con un `.replace('[petId]', petId)` al
   renderizar → cirugía de cadenas sobre una ruta. Descartada: la carta prefiere
   aburrido a listo, y una sustitución textual sobre una URL es exactamente el
   tipo de cosa que alguien descifra a las 3 de la mañana.
3. **`href: (petId: string) => string` en las tres filas**, y
   `onPress={() => router.push(href(selectedPetId))}`. Dos de las tres ignoran
   el argumento. Cuesta cuatro caracteres de ruido en dos filas y deja las tres
   con **la misma forma**, que es lo que el `.map()` y R4 necesitan.

### D4 — El `as Href` se autoriza en dos sitios y en ninguno más

La primera redacción prohibía el cast en absoluto. Con el reparto nuevo eso es
insostenible: `/add-reminder` y la ruta dinámica de documentos ya lo llevan en
sus call sites actuales (`reminders/index.tsx:149`, `profile/index.tsx:299`),
mientras que `/weight-log` typechequea sin él (`health.tsx:268`).

La regla queda afinada, no relajada: **el cast se autoriza donde el repo ya lo
usa por la misma causa** —una ruta que el tipado de expo-router no resuelve
sola— y **nunca** para silenciar una ruta que no existe. Ésa es la distinción
que importa: el cast de #68 sobre `/trips` habría ocultado un destino
inexistente; éste no oculta nada, porque R2 comprueba además con `readdirSync`
que cada destino tiene fichero.

### D5 — Tres tiles a lo ancho con `flex-row`, no una rejilla de cuatro con un hueco

El Make usa `grid grid-cols-4`. Con tres tiles se reparte a lo ancho:
`<View className="flex-row gap-3">` con cada tile `flex-1`. Razones:

1. Un hueco vacío en una rejilla es un defecto de alineación que la carta
   §Checklist de autocrítica busca explícitamente.
2. React Native no tiene `grid`; portar cuatro columnas obligaría a `basis-1/4`
   o a un ancho calculado, más código para un resultado peor.
3. El objetivo táctil sale gratis: en la pantalla más estrecha soportada
   (320 px), `320 − 48` de padding `− 2 × 12` de gap `= 248 / 3 ≈ 82 pt` de
   ancho por tile. R6 se cumple por construcción en el eje horizontal, y
   `min-h-11` lo fija en el vertical.

`gap-3` (12 px) en vez del `gap-2.5` (10 px) del Make: 12 es el paso que el
resto de la Home ya usa y no introduce un cuarto valor de espaciado.

### D6 — Sección con rótulo, sin `Card`

El Make no envuelve la rejilla en tarjeta: es un rótulo de sección en muted
mayúsculas y una fila de tiles sobre el fondo de la pantalla. Se porta igual:
`View` + `Text` con la receta canónica de rótulo de sección que el repo ya usa
en diez sitios (`health.tsx:130`, `profile/index.tsx:337`, `docs/index.tsx:88`,
`add-pet/index.tsx:76`, …).

Envolverla en el `Card` compartido tendría dos costes y ningún beneficio:
metería el tratamiento de título de #62 R5 en una discusión que el diseño no
plantea, y añadiría una superficie `bg-surface` con `p-4` bajo tres superficies
pastel, que es exactamente el ruido visual que la carta llama drift.

### D7 — `labelKey`, y por qué la rejilla se queda dentro de `index.tsx`

Dos restricciones de candado deciden la forma del código, y las dos apuntan al
mismo sitio:

1. `checkUses` (`ui-language.test.ts:48-55`) reconoce una clave usada de dos
   maneras: `t('clave')` literal, o **`labelKey: 'clave'`**. Con cualquier otro
   nombre de campo —`label`, `key`, `copyKey`— las tres claves de tile contarían
   **cero** usos y el candado se pondría rojo. El precedente en el repo es
   `REMINDER_TYPE_META` (`src/utils/reminder-meta.ts`), que ya usa `labelKey`
   por esta misma razón. Y también `TABS` de la propia barra de pestañas
   (`floating-tab-bar.tsx:50-54`), que es la misma forma de tabla que esta
   feature adopta.
2. `SCREEN_FILES` (`ui-language.test.ts:357`) cuenta los ficheros distintos con
   copy y está cerrado en `19 + 2`. Sacar la rejilla a
   `src/screens/home/quick-actions.tsx` lo movería a `19 + 2 + 1` a cambio de
   nada: son ~35 líneas dentro de un fichero de 432 que ya monta cinco bloques.

La regla de extracción de la carta (§Decisiones fijas 4) pide **≥2 pantallas**
para promover un componente. La rejilla se usa en una.

### D8 — Los iconos: ninguno de la barra, y `Weight` repetido a propósito

Los tres se eligieron contra dos restricciones: **ninguno puede ser un glifo de
la barra de pestañas** (`Home`, `Map`, `HeartPulse`, `ForkKnife`, `Profile`) y
todos tienen que existir en `reicon` (§1 P5).

| Tile | Icono | Por qué éste |
|---|---|---|
| Peso | `Weight` | Es **el mismo** que la celda `summary-weight` de #69, y eso es deliberado: la celda muestra el valor y el tile abre su histórico, mismo concepto. Elegir `Scale` daría dos glifos distintos para un solo concepto en una misma pantalla, que es peor (§6 A5) |
| Recordatorio | `CalendarPlus` | El destino es un formulario de alta con fecha y hora. El `Plus` comunica **crear**, lo que además lo distingue de la futura sección de recordatorios de #70, que es de **leer**. `Bell` diría "recordatorios" a secas y se confundiría con ella |
| Documentos | `FileText` | Inequívoco y distinto de todo lo demás en la Home |

**Repetir `Weight` dentro de la Home no es el defecto que R3 elimina.** El
defecto era glifo idéntico *más* destino ya alcanzable. Aquí el glifo se repite
porque el concepto es el mismo y los destinos son distintos; es señal, no ruido.
La consecuencia obligatoria es que R4 exige `within(tile)` y prohíbe el
`getByTestId` global para el icono, porque `icon-weight` aparece dos veces en el
árbol.

### D9 — El color: superficie por clase, tinta derivada del mismo hueco

La superficie sale de `CATEGORY_SLOTS[slot].surface` (obligatorio, §1 P4). La
tinta del icono **no puede** salir de `CATEGORY_SLOTS[slot].ink`, porque `ink` es
un nombre de clase Tailwind y los iconos de `reicon` reciben un `color`
resuelto, no un `className`. La carta §Decisiones fijas 9 ya dice qué hacer con
el color en código imperativo: `useThemeColors`.

La decisión es **derivar el token del mismo `slot`**:

```
useThemeColors(QUICK_ACTIONS.map(({ slot }) => `category-${slot}-strong`))
```

Tres propiedades que esto compra:

- **La superficie y la tinta de un tile no pueden divergir**: las dos salen del
  mismo campo `slot` de la misma fila. La mutación de color de R15b (cambiar
  `slot`) mueve las dos a la vez, que es lo correcto.
- **No dispara #64 R9**: el patrón prohibido es `/(?:bg|text)-category-\$\{/`, y
  esta plantilla no lleva prefijo `bg-` ni `text-`. Es un nombre de variable
  CSS, no una utilidad de Tailwind, así que tampoco depende del escaneo de
  clases: `--color-category-*-strong` se emite siempre porque se declara en
  `@layer theme`.
- **No dispara #61 R4**: la llamada no contiene el literal `'accent'`.

Lo que **no** se hace, y por qué: no se asierta el color del icono desde el
árbol renderizado. El doble de `reicon` descarta las props y `useThemeColors`
devuelve el mismo fallback para todos los tokens en el entorno de test (§1 P8),
así que un test de color sería verde con los tres iconos del mismo color —un
candado que miente—. La derivación se cubre con una aserción de **forma** sobre
el fuente, declarada como tal en R13, y el color observable de verdad se
verifica en el smoke humano, que es donde se ve.

### D10 — El reparto hueco↔destino

Tres huecos distintos, elegidos para no chocar con lo que ya significan en el
dominio de #64 y, donde se puede, para reforzarlo:

| Tile | Hueco | Qué significa ese hueco en #64 | Veredicto |
|---|---|---|---|
| Peso | `violet` | análisis (documento), desparasitación (recordatorio) | Libre respecto al peso: #64 manda los recordatorios de peso a `neutral`, que es `bg-default` y se vería apagado junto a dos pasteles |
| Recordatorio | `amber` | medicación (recordatorio), desparasitación (documento) | **Coherente**: ámbar ya es color de recordatorio |
| Documentos | `blue` | vacunación (recordatorio y documento) | **Coherente**: azul ya es color de documento |

`green` y `rose` quedan libres. Los huecos sirven a **tres dominios
independientes** —tipos de recordatorio, tipos de documento y destinos de
acceso rápido—, y la carta §Dirección de arte 1 los declara así: no hay regla
que prohíba reutilizar un hueco entre dominios.

### D11 — La rejilla se muestra solo con mascota seleccionada, y no tiene estados

Se condiciona a `selectedPetId !== null`, por dos razones —una de producto y una
mecánica—: los tres destinos son pantallas con ámbito de mascota, y el destino 3
**necesita el `petId` como parámetro de ruta**, así que sin él el tile no podría
construir su destino.

No se condiciona a `detail.data?.kind === 'ok'` ni a `activity`: la rejilla no
lee ningún dato, y atarla al éxito de una petición la haría desaparecer por un
fallo que no le concierne.

Consecuencia deliberada, y única en la Home: **la rejilla no tiene skeleton, ni
nota de error, ni estado degradado**. Es lo que significa "navegación pura". Si
en la revisión alguien echa de menos un skeleton, la respuesta es que no hay
nada que cargar.

### D12 — Icono a 24 px, etiqueta en `foreground`

- **24 px** y no los 20 de la tira de #69: el Make pinta el emoji en `text-2xl`
  (24 px) y el tile tiene sitio de sobra. No hay ningún candado que fije el
  tamaño de icono en la Home.
- **La etiqueta va en `text-foreground`**, como en el Make (`:406`), no en la
  tinta de la categoría: sobre las tres superficies da entre 15,4 y 17,8 de
  contraste, y deja que el color sea señal de categoría en vez de convertirse en
  jerarquía tipográfica. La tinta se reserva al icono.
- `text-2xs` (10 px, token de #46) y `font-semibold`, como el Make.

### D13 — Cero animación

El Make no anima los tiles y la carta §Animación no pide nada aquí. #68 pagó una
animación porque las barras entraban con datos; un tile estático no entra, ya
está. Fuera de alcance explícito.

---

## 4. Contrastes, calculados

Método de #61: luminancia relativa WCAG sobre los hex de `global.css`, calculado
y no estimado. Los tres huecos del reparto de D10.

| Par | Claro | Oscuro | AA (≥4,5) |
|---|---|---|---|
| `category-violet-strong` sobre `category-violet` | **4,72** | **4,81** | sí / sí |
| `category-amber-strong` sobre `category-amber` | **4,70** | **4,78** | sí / sí |
| `category-blue-strong` sobre `category-blue` | **4,75** | **4,81** | sí / sí |
| `foreground` sobre `category-violet` | 17,25 | 15,42 | sí / sí |
| `foreground` sobre `category-amber` | 17,82 | 15,41 | sí / sí |
| `foreground` sobre `category-blue` | 17,39 | 15,42 | sí / sí |

Un aviso que el smoke humano tiene que mirar y ningún test puede: **la
superficie pastel contra el fondo de la pantalla** da 1,06-1,10 en claro y 1,16
en oscuro. Eso es correcto —un fondo de tile no es texto y no le aplica el
criterio AA— pero significa que en tema oscuro los tiles se distinguen del fondo
por muy poco. Es el mismo compromiso que #64 aceptó para las filas de
recordatorio y no se re-litiga aquí; se comprueba en el gate.

---

## 5. Las siete preguntas de la Home

Obligatorio por la carta §Dirección de arte 3.

| Pregunta | Antes de #71 | Después | Efecto |
|---|---|---|---|
| ¿está segura? | parcial (última posición) | igual | — |
| ¿dónde está? | sí (`last-position-card`, gráfica) | igual | — |
| ¿el collar está conectado? | sí (`collar-card`) | igual | — |
| ¿tiene batería? | sí (`collar-battery`) | igual | — |
| ¿tiene algún recordatorio pendiente? | **no** | **sigue sin responderse** | es la feature #70. #71 añade el camino para **crear** uno, que no es lo mismo que responder si hay alguno |
| ¿cómo fue su actividad hoy? | sí (#69 + #68) | igual | — |
| ¿hay alguna alerta? | no | igual | fuera de alcance |

**#71 no responde ninguna pregunta nueva y no degrada ninguna.** Es navegación,
no información. Se declara así de explícito porque una feature que no responde
ninguna de las siete tiene que justificar su sitio en la pantalla, y con el
criterio nuevo su justificación es medible: **acorta 2, 3 y 2 toques a 1**.

---

## 6. Alternativas descartadas

### A1 — Los cuatro destinos del Make

Descartada por §2 C4 y C5: uno no existe, tres ya son pestaña y dos de esos
llevarían el glifo idéntico al de su pestaña. Es la alternativa que la primera
redacción de esta spec defendía.

### A2 — Cuatro tiles, con "Actividad" desplazando el scroll a la gráfica

Descartada. No es navegación: es una interacción nueva —medir la posición de un
hijo y llamar a `scrollTo`— que no existe en ningún otro sitio del repo, que el
Make no pide, y que necesitaría su propia `ref`, su propio `onLayout` y su
propio test. Y un atajo a algo visible en la misma pantalla no ahorra nada.

### A3 — Un cuarto tile a `/reminders`

Descartada por decisión del coordinador, con razón concreta: **#70** pone en
esta misma Home una sección de recordatorios **con enlace a la lista completa**.
Un tile a la lista sería un segundo camino al mismo sitio en la misma pantalla —
el defecto que #69 R5 tuvo que corregir con `walkCount`. El tile 2 va a
`/add-reminder`, que es **alta** y no un segundo camino a la lista.

### A4 — Un cuarto tile a `/pairing` o a `/pets/add`

Descartada por la condición (3) de R3: configuración de una sola vez.
`/pairing` además ya está en la Home cuando hace falta.

### A5 — `Scale` en vez de `Weight` para el tile 1

Descartada (§3 D8). `Scale` existe en `reicon` y evitaría repetir un glifo
dentro de la Home, pero a cambio pondría **dos glifos distintos para un mismo
concepto** —el peso— en una misma pantalla, a 150 px de distancia. La repetición
aquí es señal de que el tile abre lo que la celda enseña. También se evaluaron
`Bell`, `BellRing` y `AlarmClock` para el tile 2, descartados frente a
`CalendarPlus` porque no comunican "crear" y se confundirían con la sección de
#70.

### A6 — Sacar la rejilla a `src/screens/home/quick-actions.tsx`

Descartada: mueve `SCREEN_FILES` (§3 D7) y la regla de extracción de la carta
pide ≥2 pantallas. Son ~35 líneas.

### A7 — Envolver la rejilla en el `Card` compartido

Descartada (§3 D6): el diseño no lo hace, y añadiría una superficie neutra bajo
tres superficies pastel.

### A8 — Asertar el color del icono en el árbol renderizado

Descartada por imposible sin reescribir el doble de `reicon` **y** mockear
`useThemeColors` (§1 P8, §3 D9). El riesgo que cubriría —que el icono coja el
color de otro hueco— se elimina por construcción derivando la tinta del mismo
`slot`, que es mejor que un test.

### A9 — Añadir un token nuevo para el fondo de los tiles

Descartada: los cinco huecos de #64 cubren el caso y la carta §Dirección de arte
1 ya nombra los "destinos de acceso rápido" como su tercer consumidor previsto.

### A10 — Hacer interactiva la celda `summary-weight` de #69 en vez de poner un tile

Es la alternativa honesta al tile 1: si lo que falta es abrir el histórico desde
la Home, la celda que muestra el peso podría ser el botón. Descartada porque
**#69 R12 dejó las cuatro celdas no interactivas por escrito** —*"un objetivo
táctil que no hace nada es peor que ninguno"*, y hacer una sola de las cuatro
pulsable rompe la simetría de la tira—; cambiarlo sería enmendar una spec
aprobada para ahorrarse un tile que la sección va a tener de todos modos.

---

## 7. Archivos afectados por capa

Todo es capa de **presentación** de `mobile-pet-tracker/`. Cero dominio, cero
aplicación, cero infraestructura, cero backend.

| Fichero | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/screens/home/index.tsx` | **producción**: la constante `QUICK_ACTIONS`, la llamada a `useThemeColors` derivada, la sección `quick-actions` entre `collar-card` y el skeleton de la gráfica, y tres imports de icono |
| `mobile-pet-tracker/src/i18n/catalog.ts` | **producción**: cuatro claves en `en` y cuatro en `es` (R11) |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | tests de R1-R7, R9, R10, R12; renombrado del doble de `reicon` (R7) y actualización de las cuatro referencias del `it` de #69 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | cuatro filas en `R3_HOME` |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | delta de `R3_HOME` (`:83`) |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | **delta de longitud de catálogo (`:41`)** — el que se omitió en #68 y #69 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | delta de #62 R14 (fila de home y total cerrado) |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | bloque nuevo de R13 |
| `specs/mobile-ui-language/design.md` | registro de las cuatro claves (§2) |
| `specs/mobile-home-quick-actions/traceability.md` | el implementer rellena la columna Commit |
| `progress/impl_mobile-home-quick-actions.md` | informe del implementer, con §prueba de mutación |

**Ningún fichero de `src/theme/`, `src/utils/`, `src/components/`, `src/api/`,
`src/app/` ni `backend-pet-tracker/` se toca.** En particular **no** se toca
`src/components/floating-tab-bar.tsx` ni `src/app/(tabs)/_layout.tsx`: que tres
destinos del diseño ya sean pestaña es el hecho que R3 **usa**, no un problema
que esta feature arregle. Y que `src/app/(tabs)/home.tsx` siga intacto es parte
del candado de rutas delgadas (`design-drift.test.ts` `R9`, `<10` líneas).

---

## 8. Riesgos y cómo se cierran

| Riesgo | Cómo se cierra |
|---|---|
| Un tile navega a una ruta que no existe | §0.1 de [[requirements]] enumera las siete rutas no-pestaña con su fichero; R2 lo prueba pulsando los tres y cruzando además cada destino con los ficheros reales de `src/app/(tabs)/` |
| Un tile duplica una pestaña | R3 lo prohíbe con criterio explícito y tabla de veredictos sobre las once rutas; la mutación 5 de R15b planta un tile a `/map` y tiene que poner la suite roja |
| Un tile hereda el icono, la etiqueta o el color de otro | R4: cuatro dimensiones observadas en el árbol renderizado, con `within(tile)`; R15b las cruza una por una con mutaciones de producción |
| El `getByTestId` global del icono encuentra dos nodos | R4 lo prohíbe explícitamente: `icon-weight` sale dos veces (celda de #69 y tile 1). El `it` de #69 ya usa `within()` y por eso sigue verde |
| La clase categórica se escribe en la Home y rompe #64 R9 | R5 obliga a `CATEGORY_SLOTS`; el propio #64 R9 es el candado, y R14 fila 6 dice que si se mueve, alguien lo escribió |
| El implementer se para en el candado de longitud del catálogo | R14 lo pone **de primera fila** con el delta exacto. Es la tercera vez que aparece: #68 y #69 lo omitieron |
| El rojo de un candado nuevo se planta en el mock | R15b lo prohíbe explícitamente y las siete mutaciones son de producción (`CHECKPOINTS.md` C4, quinto punto) |
| Un `as Href` esconde una ruta inexistente | D4 acota el cast a los dos sitios donde el repo ya lo usa, y R2 comprueba la existencia del fichero con `readdirSync` — el cast no puede tapar eso |
| El typecheck rompe por rutas fantasma | R15: borrar `.expo/types/router.d.ts` antes de empezar. Esta feature toca rutas, dos con cast: es donde más muerde |
| Dos gates concurrentes se pisan en el Postgres de docker | R15: `pgrep -f init.sh` antes de lanzar |
