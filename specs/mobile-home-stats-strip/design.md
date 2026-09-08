---
feature: "mobile-home-stats-strip"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-stats-strip]]

> Decisiones técnicas de alto nivel. Los requisitos verificables viven en
> [[requirements]]; el orden de trabajo, en [[tasks]].
>
> **Todo lo de §1 se ha comprobado contra el árbol en `9358cc7`**, fichero por
> fichero y línea por línea. Nada de aquí sale de
> `progress/explore_design-gap-vs-make.md`, que es un informe fechado el
> 2026-09-04, anterior a cinco features, y que ya metió **diez** premisas falsas
> entre #67 y #68. Todos los números de línea de su enunciado están caducados
> por definición: #68 reescribió la Home entera y la movió a
> `src/screens/home/`.

---

## 1. Premisas verificadas

### P1 — La tira del Make: cuatro celdas con divisores — **CIERTA, con la cita mal**

`specs/mobile-figma-polish/design-src/App.tsx:368-383`:

```
368  <div className="mx-4 -mt-1 mb-5">
369    <div className="bg-white rounded-2xl border border-border shadow-sm flex overflow-hidden">
370      {[
371        { icon: "⚖️", label: "Peso",      value: `${pet.weight} kg` },
372        { icon: "⚡", label: "Activo",    value: `${pet.activity.activeMin} min` },
373        { icon: "🦮", label: "Paseos",    value: `${pet.activity.walks}` },
374        { icon: "📍", label: "Distancia", value: `${pet.activity.distance} km` },
375      ].map(({ icon, label, value }, i, arr) => (
376        <div key={label} className={`flex-1 flex flex-col items-center py-3 ${i < arr.length - 1 ? "border-r border-border" : ""}`}>
```

Cuatro celdas, `flex-1`, `border-r border-border` en todas menos la última —tres
divisores—, icono emoji arriba, valor en `text-sm font-bold` y etiqueta en
`text-[10px] text-muted-foreground`. **Sin gap entre celdas**: los divisores van
a ras. El rango real es `:368-383`, **no** `:366-384` (§2 C1).

### P2 — El `summary-card` de tres celdas — **CIERTA**

`mobile-pet-tracker/src/screens/home/index.tsx:282-353`. Estructura vigente:

| Elemento | Línea | `testID` |
|---|---|---|
| envoltorio condicional `selectedPetId ?` | `:282` | — |
| `Card` compartida | `:283` | `summary-card` |
| título `t('home.summaryTitle')` | `:284-289` | `summary-card-title` |
| skeleton mientras carga | `:291-293` | `summary-skeleton` |
| nota `no-tracking` | `:295-299` | `summary-note` |
| nota de error | `:301-307` | `summary-note` |
| fila `flex-row justify-between gap-3` | `:310` | — |
| celda actividad (`border-r`) | `:311-323` | `summary-activity` |
| celda sueño (`border-r`) | `:324-336` | `summary-sleep` |
| celda distancia (sin borde) | `:337-349` | `summary-distance` |

Los cuatro `testID` de valor y nota llevan ya `style={TABULAR_NUMS}` los que son
cifras (`:316`, `:329`, `:342`) y el icono va en `color={muted}` (`:312`,
`:325`, `:338`), con `muted` del `useThemeColors` de `:66-71`. Añadir una cuarta
celda **en primera posición** con `border-r` deja las tres existentes
literalmente sin tocar, porque la que no lleva borde sigue siendo la última.

### P3 — `walkCount` viene en `activity/daily` — **CIERTA en el dato, FALSA en su consecuencia**

`mobile-pet-tracker/src/api/types.ts:84` — `walkCount: number | null` dentro de
`DayEntry` (`:79-90`). El dato está.

Pero **ya se pinta**, y es lo que cambia el trabajo (§2 C2):
`src/screens/home/index.tsx:140-144` pasa al hero
`highlight={{ value: fmtCount(today.walkCount), label: t('home.walks') }}`, que
`pet-hero-header.tsx:137-152` renderiza en `text-3xl` con
`testID="pet-hero-highlight-value"`. Lo fijó **#67 R7**
(`specs/mobile-pet-hero-header/requirements.md:316-341`) y lo prueba
`src/screens/home/index.test.tsx:944-1002`.

### P4 — `currentWeightKg` en el perfil, y la Home ya lo descarga — **CIERTA**

Cadena completa, verificada de punta a punta:

- **Columna**: `backend-pet-tracker/src/db/schema/pets.schema.ts:36` —
  `numeric('current_weight_kg', { precision: 5, scale: 2 })`, nullable.
- **Se rellena** al registrar un peso:
  `backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts:34`.
- **Entidad**: `pets/domain/entities/pet.entity.ts:35`.
- **Repositorio**: `pet.drizzle.repository.ts:140-141` lo convierte a `number`.
- **Respuesta**: `pets/infrastructure/mappers/pet-profile-response.mapper.ts:70`,
  campo declarado en `:27`.
- **Endpoint**: `pets.controller.ts:82-94` (`@Get(':petId')`) llama a
  `toPetProfileResponse`, igual que `@Get()` en `:69-77`.
- **Cliente**: `mobile-pet-tracker/src/api/types.ts:61` —
  `currentWeightKg: number | null` en `PetProfile`.
- **Ya descargado**: la Home hace `getPet(baseUrl, token, selectedPetId)`
  (`src/screens/home/index.tsx:78-84`) y guarda el resultado en `detail`
  (`:92`). El campo llega y **no se lee en ninguna parte**: cero ocurrencias de
  `currentWeightKg` en código de producción de `mobile-pet-tracker/src/`, solo
  en fixtures de test.

**Conclusión: cero backend.** La premisa 4 del enunciado es cierta y no hay
hallazgo que pare la feature.

### P5 — `restMinutes` no tiene `weekComparison` — **CIERTA, re-verificada**

`mobile-pet-tracker/src/api/types.ts:92-96`:

```
92  export interface WeekComparison {
93    distanceM: number | null;
94    activeMinutes: number | null;
95    walkCount: number | null;
96  }
```

Tres campos. Origen backend en
`backend-pet-tracker/src/modules/activity/domain/week-comparison.ts:12-16`.
Sigue sin haber `restMinutes`, exactamente como declaró #68 §0.2.

### P6 — Dónde se pinta hoy `restMinutes` — **DOS SITIOS, y no son equivalentes**

Cero ocurrencias en producción fuera de estas dos:

1. `src/screens/home/index.tsx:331` — celda `summary-sleep`, **siempre visible**
   cuando la actividad resuelve `ok`.
2. `src/screens/home/weekly-activity-chart.tsx:713-714` —
   `weekly-activity-detail-rest`, dentro del panel `weekly-activity-detail`
   (`:680`), que **solo se monta cuando `selectedDay` existe**, es decir tras
   tocar una barra.

La diferencia decide R4: mover el sueño al panel es cambiar "visible al abrir la
app" por "visible si descubres que las barras se tocan". Eso **sí** es pérdida
de información en el sentido de la carta §Dirección de arte 5.

### P7 — Los candados que esta feature toca — **CIERTOS**

- `src/__tests__/consistency-classnames.test.ts:334-358` (#62 R15, cifras
  tabulares): tabla `counters` en `:335-342` con
  `[join('screens','home','index.tsx'), 4]`, y total cerrado en `:355-357`
  como `.toBe(14 + 4)`. Las cuatro ocurrencias actuales de
  `style={TABULAR_NUMS}` en la Home son `:246` (batería), `:316`, `:329` y
  `:342`.
- `src/__tests__/consistency-classnames.test.ts:269-332` (#62 R14, esquinas
  continuas): `directUses` en `:270-285` con
  `[join('screens','home','index.tsx'), 1]` —la única es `:270` del fuente, el
  `collar-pair-link`— y total `.toBe(33 + 1)` en `:330`. **No se mueve**: las
  celdas no dibujan radio propio.
- `src/__tests__/consistency-classnames.test.ts:102` (#62 R1): `toHaveLength(13)`
  de `rounded-xl bg-accent`. **No se mueve.**
- `src/__tests__/consistency-classnames.test.ts:186-217` (#62 R7): prohíbe
  glifos tipográficos como icono. Es el que obliga a `reicon` en vez de los
  emoji del Make (R9).
- `src/__tests__/legibility-classnames.test.ts:118-138` (#61 R4): `inkSites`
  con `screens/home/index.tsx: 1` y total `.toBe(13)`. **No se mueve.**
  `:145-149` prohíbe `useThemeColors([… 'accent' …])` en cualquier fuente.
- `src/__tests__/ui-copy-table.ts:45-82` (`R3_HOME`) y
  `src/__tests__/ui-language.test.ts:83` (`toHaveLength(21 + 15)`): **+1** por
  `home.weight`. `SCREEN_FILES` en `:357` (`toHaveLength(19 + 2)`) **no se
  mueve**: `src/screens/home/index.tsx` ya está en la lista.
- `src/screens/home/index.test.tsx:1121-1150` (#68 R14, orden de
  `home-content`): filtra a `summary-card` → `weekly-activity-card` →
  `last-position-card`. Subir `summary-card` por encima de `collar-card`
  **no altera esa secuencia relativa**, así que el candado sigue verde sin
  tocarlo. Comprobado leyendo el filtro (`:1136-1144`), no supuesto.

### P8 — No existe candado global de hex — **CIERTA, confirmada de nuevo**

`src/__tests__/design-drift.test.ts` es el único fichero que persigue
hexadecimales, y siempre sobre **listas nominales**: `R9` (`:90-110`), `R11`
(`:182-186`) y `#68 R18` (`:190-213`). No hay barrido global de `src/`.

**Matiz que importa para R13**: los cinco ficheros de esta feature ya están
dentro de la lista de `#68 R18` (`:190-202`). La cobertura existe **hoy**, pero
es prestada: depende de que nadie recorte una lista que pertenece a otra
feature. Por eso #69 pone su bloque propio.

### P9 — El icono `Weight` existe — **CIERTA**

`node_modules/reicon-react-native/index.d.ts:2642` —
`export { Weight } from './icons/Weight.js';`. También existen `Scale`
(`:2025`), `Bolt` (`:300`) y `Activity` (`:8`). `Walk` (`:2601`), `Moon`
(`:1611`) y `Map` (`:1456`) son los que la Home ya importa. **Ninguna
dependencia nueva.**

---

## 2. Correcciones — premisas del enunciado que salieron falsas

Ninguna corrección de aquí toca una spec aprobada. Esta feature no necesita
ninguna enmienda ([[requirements]] §Enmiendas).

| # | Dice el enunciado de #69 | Lo que hay en el árbol en `9358cc7` | Consecuencia |
|---|---|---|---|
| **C1** | *"una tira de 4 celdas … (`App.tsx:366-384`)"* | El fichero no está en la raíz: es `specs/mobile-figma-polish/design-src/App.tsx`, y el rango real de la tira es **`:368-383`**. `:366-367` cierran el bloque del hero y `:384` abre ya la fila de collar/ubicación | Cita corregida. El fondo —cuatro celdas, tres divisores, Peso/Activo/Paseos/Distancia— es **exacto** |
| **C2** | *"la app … no muestra paseos"*, y de ahí *"las cuatro celdas del diseño, incluida Paseos"* | **Falso desde #67.** `src/screens/home/index.tsx:140-144` pasa `walkCount` al hero como dato destacado, en `text-3xl`, con la clave `home.walks`; lo fija #67 R7 y lo prueba `index.test.tsx:944-1002` | **Cambia el trabajo.** La tira **no** lleva celda de Paseos (R5): la llevaría a duplicar, a 40 px de distancia y en cuerpo menor, el número que el hero ya destaca. La celda 3 la ocupa el **descanso** (R4), que es lo que además resuelve la decisión E |
| **C3** | *"la app tiene un summary-card con 3 … actividad, sueño y distancia"*, ubicándolo donde el informe decía | Cierto **en el contenido**, falso **en la ubicación** que el informe daba: la Home ya no está en `src/app/(tabs)/home.tsx` —que hoy son 5 líneas de route delgado— sino en `src/screens/home/index.tsx:282-353`, migrada por **#68 R15** | Todas las rutas de esta spec apuntan a `src/screens/home/`. **No se migra nada**: ya está hecho |
| **C4** | *"no hace falta backend nuevo"* | **Cierta**, verificada de la columna a la respuesta HTTP (§1 P4) | Ningún hallazgo que pare la feature. Cero ficheros de `backend-pet-tracker/` |

Corrección adicional, menor: el enunciado llama a la feature
`mobile-stats-strip` en el §Fuera de alcance de #67
(`specs/mobile-pet-hero-header/requirements.md:513`). El nombre real en
`feature_list.json` es **`mobile-home-stats-strip`**, que es el que usa esta
spec y el que debe llevar el scope de los commits.

---

## 3. Decisiones técnicas

### D1 — El reparto de las cuatro celdas, y por qué éste y no el del Make

Es la decisión que ordena todas las demás. Hay cinco datos "de hoy" disponibles
y cuatro celdas:

| Dato | Origen | ¿Dónde acaba? |
|---|---|---|
| `currentWeightKg` | perfil (`detail`) | **celda 1** — hoy no se pinta en ninguna parte de la Home |
| `activeMinutes` | día (`activity`) | **celda 2** — donde ya estaba |
| `restMinutes` | día (`activity`) | **celda 3** — donde ya estaba (R4) |
| `distanceM` | día (`activity`) | **celda 4** — donde ya estaba |
| `walkCount` | día (`activity`) | **el hero**, donde ya está desde #67 R7 (R5) |

El Make no tiene este problema porque su hero destaca **pasos**, un dato
distinto de los paseos. Aquí los pasos **no existen en ninguna capa** —#67 R7 lo
verificó: cero ocurrencias de `steps` en `mobile-pet-tracker/src/` y
`activitySummary` sale `null` del backend— así que #67 puso los paseos en el
hero. Copiar la tira del Make literalmente ahora significaría pintar el mismo
número dos veces en la misma pantalla.

Con este reparto la Home enseña **los cinco datos, cada uno una sola vez**, con
exactamente **cuatro celdas y tres divisores**, que es la forma del diseño. Lo
único que se cede es la palabra de la celda 3.

### D2 — El diff mínimo: una celda nueva delante, y nada más

Colocar el peso en **primera** posición no es estética, es lo que hace el cambio
trivial: la regla del Make es *"todas las celdas llevan `border-r` menos la
última"*, y hoy la última es distancia. Insertando delante:

```
antes:  [activity·border-r] [sleep·border-r] [distance]
después:[weight·border-r]   [activity·border-r] [sleep·border-r] [distance]
```

Las tres celdas existentes quedan **byte a byte iguales**. El diff de producción
es: un `<View>` nuevo, un import (`Weight`), una función de cuatro líneas
(`fmtKg`), una clave de catálogo, el `className` de la fila y mover el bloque
`{selectedPetId ? …}` por encima de `{detail.data?.kind === 'ok' ? …}`.

### D3 — El peso sale de `detail`, y el estado lo manda `activity`

Las cuatro celdas se alimentan de **dos** `useApi` distintos que ya existen:
`detailFn` (`index.tsx:78-84`) y `activityFn` (`:85-91`). Eso abre una pregunta
que la spec cierra en R7: ¿qué pasa cuando la actividad falla pero el perfil
está bien?

La respuesta es **la fila entera desaparece, como hoy**, y la celda de peso con
ella. Es deliberado:

- **No se pierde nada relativo a hoy**: el peso no se pinta en la Home en ningún
  estado, ni siquiera cuando todo va bien.
- La alternativa —peso siempre, las otras tres a `'—'`— obliga a una fila que a
  veces tiene una celda útil y tres guiones, con tres divisores separando
  huecos, y a reescribir los cinco `it` de
  `describe('R9: summary degrada con gracia')` (`index.test.tsx:441-560`).
- Y hay un caso real donde se notaría: una mascota **sin collar** devuelve `402`
  → `no-tracking`, así que vería la nota "La actividad requiere un collar" y
  ningún peso. Es una decisión de producto legítima, pero es **otra** decisión;
  va a feature propia y está en §Fuera de alcance, no escondida aquí.

Dentro del estado `ok`, el peso puede seguir siendo `null` (mascota sin peso
registrado): entonces la celda pinta `'—'`, igual que las otras tres cuando su
métrica es `null`.

### D4 — Sin margen negativo, sin solape con el hero

El Make monta la tira con `mx-4 -mt-1` (`design-src/App.tsx:368`): 4 px de
solape sobre una foto que llega a sangre. Aquí no aplica:

- El hero de #67 no termina en foto: termina en `pet-hero-caption`, una banda
  **opaca** con `pb-4` (`pet-hero-header.tsx:112-115`). No hay imagen sobre la
  que solapar.
- El `ScrollView` de la Home reparte `gap: 16` entre sus hijos
  (`index.tsx:126-129`) y el envoltorio `home-content` lleva
  `paddingHorizontal: 24` (`:193`), no los 16 px del `mx-4` del Make. Meter un
  margen negativo rompería el ritmo uniforme que fija `conventions.md`
  §Dimensiones y que la carta §Decisiones fijas 6 declara.

Lo que sí se copia, y es lo que se ve, es **la posición relativa**: la tira es lo
primero bajo el hero, encima del collar (R6).

### D5 — Por qué la fila pierde el `gap-3`

Hoy la fila es `flex-row justify-between gap-3` (`index.tsx:310`). Con cuatro
celdas hay que quitarlo, por dos motivos que van en la misma dirección:

- **Fidelidad**: el Make no tiene gap (`className="… flex overflow-hidden"`,
  `:369`). Sus divisores van a ras entre celda y celda; con `gap-3` cada borde
  queda a 12 px de la celda siguiente y el divisor parece pegado a la celda
  izquierda en vez de separar las dos.
- **Espacio**: en la pantalla más estrecha que este repo considera (320 px) el
  ancho útil es `320 − 48 (padding de pantalla) − 32 (p-4 del Card) = 240` px.
  Con `gap-3` quedan `240 − 36 = 204` px para cuatro celdas: **51 px cada una**,
  y `'12.4 kg'` en `text-sm font-bold` no cabe —se parte en dos líneas—. Sin
  gap, **60 px**, que sí. En 375 px la diferencia es 64 → 74 px.

`justify-between` desaparece con él: es un no-op cuando los cuatro hijos son
`flex-1` y llenan la fila.

Ningún test asserta ese `className` hoy —comprobado: cero ocurrencias de
`justify-between`, `flex-row` o `border-r` en `index.test.tsx`,
`consistency-classnames.test.ts` y `legibility-classnames.test.ts`—, así que
cambiarlo no debilita ningún candado.

### D6 — `fmtKg` va en `format.ts`, junto a sus tres hermanas, y no formatea por locale

`src/screens/home/format.ts` ya existe desde #68 R15 con `fmtMinutes`, `fmtKm` y
`fmtCount`, las tres con la misma forma: `null → '—'`, número → cadena con
unidad. `fmtKg` es la cuarta y se escribe igual. No se crea módulo nuevo, no se
duplica en la pantalla.

**No lleva `Intl.NumberFormat`** por consistencia interna, no por pereza:
`fmtKm` usa `.toFixed(1)` con punto decimal (`format.ts:8`), y el repo pinta el
peso como `` `${weightKg} kg` `` en `weight-log.tsx:277` y `health.tsx:233`. Un
separador por locale solo en la celda de peso dejaría `12,4 kg` al lado de
`2.4 km` en la misma fila, que es peor que cualquiera de las dos opciones
aplicadas a todo. Homogeneizar los cuatro formateadores por locale es una
feature de copy propia, no un efecto colateral de ésta.

Tampoco fuerza decimales: `12 → '12 kg'`, no `'12.0 kg'`. La columna es
`numeric(5,2)` y el repositorio devuelve `Number(row.currentWeightKg)`
(`pet.drizzle.repository.ts:141`), así que `12.40` llega ya como `12.4`.

### D7 — Iconos de `reicon`, no los emoji del Make

El Make usa `⚖️ ⚡ 🦮 📍` (`:371-374`). Aquí van iconos reales porque **#62 R7**
lo exige, con candado en `consistency-classnames.test.ts:186-217`, y porque un
emoji se pinta con la fuente del sistema: cambia de forma entre Android y iOS y
no responde al tema. `Weight` es el único import nuevo; `Walk`, `Moon` y `Map`
ya están en el fichero (`index.tsx:9-11`). Los cuatro van en `color={muted}`,
que es lo que ya hacen las tres celdas actuales — así que el inventario de
#61 R4 (acento como tinta) no se mueve.

### D8 — La accesibilidad no cambia de modelo, y por eso no lleva `accessible`

Las celdas hoy no declaran nada de accesibilidad: son `View` + `Text`, y el
lector de pantalla las recorre como texto suelto, un nodo por `Text`. Eso ya
anuncia valor y etiqueta por separado. Lo que R12 prohíbe es lo que estropearía
ese comportamiento: poner `accessible` o un `accessibilityLabel` en la fila
contenedora **colapsa el subárbol en un nodo único**, que es exactamente el
defecto que #68 D5 documentó para el gráfico
(`weekly-activity-chart` tuvo que sacar sus siete columnas fuera del `BarChart`
por esa razón). Se declara explícitamente para que nadie lo "mejore".

Las celdas tampoco se vuelven táctiles: no navegan a ningún sitio. Un
`Pressable` sin destino es un objetivo de 44 pt que no hace nada, peor que
ninguno.

### D9 — El título se queda

El Make no titula la tira. Aquí `summary-card-title` con `t('home.summaryTitle')`
se conserva, por tres razones que se suman:

1. Quitarlo **enmienda #62 R5**, que enumera los títulos de card del repo con su
   receta canónica (`specs/mobile-ui-consistency-polish/requirements.md:137-153`,
   candado en `index.test.tsx:766-792`). Una enmienda firmada a cambio de
   ninguna información nueva.
2. Sin título, cuatro cifras sueltas bajo el hero no dicen **de cuándo** son. El
   Make se lo puede permitir porque su pantalla completa lo contextualiza; aquí
   la tira convive con una gráfica semanal justo debajo, y "hoy" frente a "los
   siete días" es precisamente la distinción que hay que dejar clara.
3. Cuesta una fila de `R3_HOME` y un `it` en verde. Cero beneficio.

Va como desviación declarada, ratificada en [[requirements]] §Aprobación.

---

## 4. Las siete preguntas de la Home

Declaración obligatoria de la carta §Dirección de arte 3 para toda spec que
toque la Home:

| Pregunta del brief | ¿La responde #69? |
|---|---|
| ¿Está segura? | **No.** Sigue sin responderse; depende de geocercas y alertas |
| ¿Dónde está? | **No.** La responde `last-position-card`, intacta |
| ¿El collar está conectado? | **No.** La responde `collar-card`, intacta. #69 solo la mueve un puesto hacia abajo en el árbol (R6) |
| ¿Tiene batería? | **No.** La responde `collar-card`, intacta |
| ¿Tiene recordatorio pendiente? | **No.** Sigue sin responderse en la Home |
| **¿Cómo fue su actividad hoy?** | **Sí, la mejora**: la tira sube a lo primero bajo el hero —donde el diseño la pone— y estrena el **peso**, un dato que la app ya descargaba y tiraba. Los otros cuatro datos siguen exactamente donde estaban |
| ¿Hay alguna alerta? | **No.** Sigue sin responderse, como declararon #67 y #68 |

#69 mejora una de las siete y **no degrada ninguna**. En particular, ningún dato
visible hoy deja de verse: el descanso se queda (R4) y los paseos siguen en el
hero (R5).

---

## 5. Archivos afectados por capa

`mobile-pet-tracker/` es la única raíz de código tocada. **Cero ficheros de
`backend-pet-tracker/`**, cero infraestructura, cero configuración de Expo, cero
dependencias.

**Presentación**
- `src/screens/home/index.tsx` — **editado**: celda nueva, import de `Weight`,
  `className` de la fila, y el bloque de `summary-card` movido por encima de
  `collar-card`. No se crea ningún fichero de componente: la tira son ~12 líneas
  de JSX en un solo sitio y la regla de extracción de la carta (§Decisiones
  fijas 4) pide **≥2 pantallas** para promover a `src/components/`.
- `src/screens/home/index.test.tsx` — **editado**: `describe` nuevo de #69 y un
  `it` ampliado en `describe('R9: summary degrada con gracia')`.

**Formato**
- `src/screens/home/format.ts` — **editado**: `fmtKg`.
- `src/screens/home/format.test.ts` — **nuevo**. Hoy `format.ts` no tiene test
  propio: sus tres funciones se prueban indirectamente por la pantalla. `fmtKg`
  estrena el fichero, y las otras tres **no se tocan**.

**Contenido y catálogo**
- `src/i18n/catalog.ts` — **editado**: `home.weight` en `en` y en `es`.
- `specs/mobile-ui-language/design.md` §2 — **editado**: registro de la clave.

**Candados**
- `src/__tests__/ui-copy-table.ts` — **+1 fila** en `R3_HOME`.
- `src/__tests__/ui-language.test.ts` — **+1** en el `toHaveLength` de `:83`.
- `src/__tests__/consistency-classnames.test.ts` — fila de
  `screens/home/index.tsx` de 4 a 5 en `counters` y el total cerrado **+1**.
- `src/__tests__/design-drift.test.ts` — bloque nuevo de R13.

**Sin tocar, y es deliberado**: `src/api/*`, `src/hooks/use-api.ts`,
`src/theme/global.css`, `src/theme/native-styles.ts`,
`src/components/pet-hero-header.tsx`, `src/components/card.tsx`,
`src/screens/home/weekly-activity-chart.tsx`, `src/app/(tabs)/home.tsx`
(el route delgado de #68 no cambia), `package.json`.

---

## 6. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Copiar la tira del Make literal: Peso / Activo / **Paseos** / Distancia | Duplicaría `walkCount` en la misma pantalla: el hero ya lo pinta en `text-3xl` desde #67 R7 (§2 C2). Invalidaría por escrito la justificación con la que #67 R7 se aprobó |
| Cinco celdas: las cuatro del Make **más** el descanso | Rompe la forma del diseño —que es el objeto de la feature— y en 320 px deja 42 px por celda: `'12.4 kg'` y `'1h 35m'` se parten en dos líneas. Se descarta por medida, no por gusto (D5) |
| Mover el descanso al panel de detalle de la gráfica, que ya lo pinta | Ese panel solo existe **tras tocar una barra** (§1 P6). Cambiaría "visible al abrir la app" por "visible si lo descubres": es pérdida de información en el sentido de la carta §Dirección de arte 5 |
| Quitar el dato destacado del hero y dejar los paseos solo en la tira | Enmienda #67 R7, una spec aprobada, y deja el hero sin la cifra grande que el Make sí tiene. Más trabajo y peor jerarquía |
| Cambiar el dato destacado del hero a `restMinutes` y dejar Paseos en la tira | Resuelve el mismo problema, pero enmienda #67 R7 y convierte "4h 20m de descanso" en el titular de la pantalla de un rastreador de mascotas. La cifra grande debe ser de actividad |
| Poner los pasos en el hero, como el Make | El dato **no existe en ninguna capa**: cero `steps` en `mobile-pet-tracker/src/` y `activitySummary` siempre `null` desde el backend. Es una pregunta de hardware (decisión **D**), no de software |
| Extraer la tira a `src/components/stats-strip.tsx` | Una sola pantalla la usa. La regla de extracción de la carta (§Decisiones fijas 4) pide ≥2 pantallas y una API menor que la implementación; aquí la API sería mayor que las doce líneas que ahorra |
| Quitar el título `Resumen de hoy` para parecerse al Make | Enmienda #62 R5 a cambio de cero información, y deja cuatro cifras sin decir de cuándo son, justo encima de una gráfica semanal (D9) |
| Cambiar `home.activity` de `Actividad` a `Activo` | Copy ya aprobada por #65. Cambiar un valor obliga a tocar tests verdes y no añade información |
| Reutilizar `health.weight` o `weightLog.weight` en vez de crear `home.weight` | Cruza ámbitos del catálogo; #68 descartó por escrito el caso simétrico (`home.online` para la pantalla de emparejado) |
| Emancipar la celda de peso del estado de la actividad | Fila con una celda útil y tres huecos separados por divisores, y reescritura de los cinco `it` de `R9: summary degrada con gracia`. Relativo a hoy no se pierde nada (D3). Si el humano lo quiere, feature propia |
| Emoji como icono, como el Make | Prohibido por #62 R7, con candado. Además cambia de forma entre plataformas y no sigue el tema (D7) |
| Margen negativo para solapar el hero, como el `-mt-1` del Make | El hero termina en banda opaca, no en foto: no hay nada que solapar, y rompería el `gap: 16` uniforme (D4) |
| Confiar en el bloque `#68 R18` de `design-drift.test.ts`, que ya cubre estos cinco ficheros | Es una lista nominal de **otra** feature. Si alguien la recorta, la cobertura de #69 desaparece en silencio y no hay barrido global que la sustituya (§1 P8) |
| Hacer las celdas táctiles, cada una hacia su pantalla | Ninguna tiene destino obvio —¿el peso a `weight-log`? ¿la distancia a `map`?— y #71 (accesos rápidos) va a resolver la navegación de la Home con criterio propio. Un objetivo táctil sin destino es peor que ninguno (D8) |
| Formatear el peso con `Intl.NumberFormat` por locale | Dejaría `12,4 kg` al lado de `2.4 km` en la misma fila. Homogeneizar los cuatro formateadores es una feature de copy propia (D6) |

---

## 7. Riesgos y cómo se cierran

| Riesgo | Cierre |
|---|---|
| Alguien "completa" el diseño añadiendo la celda de Paseos y duplica el dato del hero | R5 lo prohíbe con test: `queryByTestId('summary-walks')` a `null` y `summary-card` sin el texto de `home.walks` |
| Dos celdas se intercambian y ningún test lo ve porque la fixture tiene valores repetidos | R3 obliga a una fixture con los cuatro valores distintos, y R15b planta la mutación **en las cuatro celdas, una por una**. Es la lección de #68 aplicada por adelantado |
| Cuatro valores no caben en una pantalla estrecha y se parten en dos líneas | D5 lo mide: sin `gap-3` quedan 60 px por celda en 320 px. Y el gate de smoke lo comprueba en dispositivo con `12.4 kg` y `1h 35m` |
| El peso llega `null` y la celda desaparece o rompe la fila de cuatro | R2 fija `null → '—'` y exige un `it` con `mockGetPet` en `unreachable` que comprueba la fila **completa** |
| Se absorbe en silencio el movimiento de un total cerrado | R14 declara el delta esperado de cada candado contra `9358cc7` y ordena parar si alguno se mueve por otra causa |
| Se confunde reubicación con delta real, como pasó en #68 | Esta feature **no mueve ningún fichero**: R14 lo dice explícitamente y su tabla no tiene fila de reubicación. Si aparece una, es señal de que alguien está migrando algo que no toca |
| Alguien vuelve a migrar la Home a `src/screens/home/` | Ya está migrada desde #68 R15. §Fuera de alcance lo prohíbe y el route delgado de `app/(tabs)/home.tsx` (5 líneas) lo evidencia |
| El bloque de drift de #68 se recorta y #69 queda sin cobertura de hex | R13 añade bloque propio (§1 P8) |
| Se rompe el candado de orden de #68 al subir `summary-card` | Comprobado leyendo el filtro (`index.test.tsx:1136-1144`): solo mira la secuencia relativa de tres `testID` que no cambia. R6 añade su propio `it` con los cuatro |
| Aparece un dato que exige una llamada nueva a la API | [[requirements]] R8 y §Fuera de alcance: **la feature se para y se reporta** |
