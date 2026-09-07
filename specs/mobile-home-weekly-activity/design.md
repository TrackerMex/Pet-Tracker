---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-weekly-activity]]

> Decisiones técnicas de alto nivel. Los requisitos verificables viven en
> [[requirements]]; el orden de trabajo, en [[tasks]].
>
> **Todo lo de §1 se ha comprobado contra el árbol en `4a5f6dd`**, no contra
> `progress/explore_design-gap-vs-make.md`. Un informe de exploración es una
> hipótesis fechada: el del 2026-09-04 metió cuatro premisas falsas en #67 y
> cada una se propagó a tres sitios. Además `main` avanzó cuatro features desde
> que se escribió, así que **ningún número de línea del informe se ha dado por
> bueno**: todos están rederivados.

---

## 1. Premisas verificadas

### P1 — Una entrada por día sin huecos, 7 días por defecto en la tz del dueño — **CIERTA**

`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts:84-98`
recorre `listDays(fromDay, toDay)` y empuja una entrada por cada día del rango:
la fila almacenada si existe, el cómputo al vuelo si el día es hoy, y
`missingEntry(day)` en cualquier otro caso. No hay rama que salte un día.

El rango por defecto está en `:73-78`: `timeZone` sale de
`this.store.findOwnerTimezone(input.petId)`, `today = localDayOf(now.getTime(),
timeZone)`, `toDay = input.to ?? today` y
`fromDay = input.from ?? shiftDay(toDay, -(ACTIVITY_DEFAULT_RANGE_DAYS - 1))`,
con `ACTIVITY_DEFAULT_RANGE_DAYS = 7` en
`backend-pet-tracker/src/modules/activity/activity.constants.ts:13`. Es la tz
del **dueño**, no la del dispositivo ni la del servidor.

### P2 — El cliente llama sin parámetros — **CIERTA, y la línea sigue vigente**

`mobile-pet-tracker/src/api/activity.ts:26-31`:
`getJson(baseUrl, `/pets/${petId}/activity/daily`, token, fetchFn)`. Sin query
string, sin `from`, sin `to`. La única referencia de línea del enunciado que ha
sobrevivido intacta a los cuatro merges.

### P3 — La Home descarta seis de siete — **CIERTA EN EL HECHO, LÍNEA CADUCADA**

El enunciado dice `home.tsx:86-89`. **Hoy es `home.tsx:100-103`**, porque #67
reescribió el fichero:

```
100  const today =
101    activity.data?.kind === 'ok'
102      ? activity.data.days[activity.data.days.length - 1]
103      : undefined;
```

Y hay un segundo desplazamiento que el enunciado no podía saber: en `303fc19`
ese `today` alimentaba solo al `summary-card`; **hoy alimenta también al hero**
(`home.tsx:133-137`, el `highlight` con `fmtCount(today.walkCount)` que fijó
#67 R7) además de las tres celdas del resumen (`:311`, `:324`, `:337`). Así que
"se queda con la última" ya tiene tres consumidores, no uno.

Consecuencia para #68: **no se toca**. La derivación de `today` se queda tal
cual y la gráfica consume `activity.data.days` entero en paralelo. Quitar
`today` rompería el hero de #67 y las tres celdas que #69 va a heredar.

### P4 — Día pasado sin datos: `source: 'missing'` con todo `null` — **CIERTA, con un matiz que cambia el requisito**

Comprobado en el **mapper del backend**, no solo en el tipo del cliente, como
pedía el encargo:

- `get-daily-activity.use-case.ts:194-207` — `missingEntry(day)` construye la
  entrada con las **nueve** métricas a `null` y `source: 'missing'`.
- `get-daily-activity.use-case.ts:95-96` — el comentario que lo declara: *"un
  dia pasado sin fila es `missing` con metricas null, nunca ceros — un cero
  significa 'reposo confirmado' y mentiria"*.
- Tipo de dominio: `daily-activity.entity.ts:42-58` (`DayEntrySource` y las diez
  claves de `DayEntry`).
- Tipo del cliente: `mobile-pet-tracker/src/api/types.ts:79-90`, idéntico.

**El matiz**: la implicación **no** es reversible. Un día `stored` nunca trae
`null` en `activeMinutes` —`DailyActivityRow.activeMinutes` es `number` no nulo,
`daily-activity.entity.ts:10`— y un día `computed` tampoco: cuando no hay
posiciones, `computeDailyActivity` devuelve ceros
(`backend-pet-tracker/src/pipeline/activity.ts:84-87`). Es decir: hoy
`activeMinutes === null` ⟺ `source === 'missing'`, y una implementación que
ramifique por el `null` pasaría todos los tests siendo semánticamente falsa.
Por eso [[requirements]] R3 obliga a ramificar por `source` y R10c planta la
mutación que lo comprueba.

### P5 — Cronológico terminando hoy, no lunes a domingo — **CIERTA**

`backend-pet-tracker/src/pipeline/local-day.ts:108-116`:

```ts
for (let day = fromDay; day <= toDay; day = shiftDay(day, 1)) days.push(day);
```

Ascendente desde `fromDay`, y `toDay` es hoy cuando el cliente no manda `to`
(P1). La semana **no** empieza en lunes: empieza el día que toque seis días
antes de hoy. De ahí R4.

### P6 — `weekComparison` trae la variación — **CIERTA, con forma más estrecha**

`backend-pet-tracker/src/modules/activity/domain/week-comparison.ts`:

- `:12-16` — `WeekComparison` tiene **tres** campos: `distanceM`,
  `activeMinutes`, `walkCount`, todos `number | null`. **No hay `restMinutes`.**
- `:24-51` — `compareWeek` devuelve, por métrica, el **delta porcentual a un
  decimal de la media diaria** del rango contra la de la base
  (`Math.round(ratio * 1000) / 10`), y `null` si alguna ventana no tiene
  muestras o la media base es 0.
- `get-daily-activity.use-case.ts:144-157` — la base son los 7 días naturales
  inmediatamente anteriores a `from` (`ACTIVITY_BASELINE_DAYS = 7`), leídos
  solo de filas almacenadas; y `samplesOfRange` (`:209-217`) **excluye los días
  `missing`** del rango antes de promediar.

El cliente ya lo tipa (`mobile-pet-tracker/src/api/types.ts:92-96`) y
`getDailyActivity` ya lo devuelve en su estado `ok`
(`src/api/activity.ts:5, 56`). **La Home no lo lee en ningún sitio**: cero
referencias a `weekComparison` en `home.tsx`. Así que sí, la tendencia sale
gratis — pero solo para las tres métricas que existen, y como porcentaje, no
como diferencia.

### P7 — `weight-chart.tsx` existe y su patrón sirve — **CIERTA, con matiz sobre qué es "el patrón"**

`mobile-pet-tracker/src/components/weight-chart.tsx:1-68` existe y está
declarado componente compartido en la carta §Decisiones fijas 4. Pero dibuja
con **`react-native-svg`** (`Svg`, `Polyline`, `Polygon`, `Circle`, `Defs`,
`LinearGradient`), que está instalado (`package.json`,
`react-native-svg@15.15.4`) y **no** es una librería de gráficas.

Lo reutilizable, punto por punto:

| De `weight-chart.tsx` | ¿Se reutiliza? |
|---|---|
| No añadir librería de gráficas | **Sí**, es el criterio entero |
| `useThemeColors(['accent-strong'])` para el color de la marca (`:16`) | **Sí** (D5) |
| Vacío resuelto con un `Text` con `testID` propio (`:19-25`) | **Sí** (R7) |
| Copy resuelta dentro con `useTranslate()` (`:12,17,22`) + registro en `ui-copy-table.ts:124` | **Sí** (R9) |
| Componente puro de sus props, sin `useApi` ni `fetch` | **Sí** (R1) |
| El SVG | **No** (D7) |

---

## 2. Correcciones propuestas

Ninguna toca una spec aprobada, así que **no hay enmiendas que firmar** más allá
de la aprobación de esta spec. Todas son al enunciado de #68 en
`feature_list.json`; el leader las enruta, esta spec no edita el fichero.
C1–C4 son de fondo —cambian lo que hay que implementar— y C5 es una imprecisión
de cita que se corrige de paso.

| # | Dice el enunciado | Debe decir | Origen del error |
|---|---|---|---|
| C1 | *"la Home descarta seis de las siete entradas quedandose con la ultima (`home.tsx:86-89`)"* | `home.tsx:100-103`, y ese `today` alimenta hoy **tres** consumidores (hero de #67 incluido), no solo el resumen | #67 reescribió `home.tsx`; el enunciado se escribió contra `303fc19` |
| C2 | *"`weekComparison` ya trae la variacion contra los 7 dias previos"* | delta **porcentual de la media diaria a un decimal**, solo para `distanceM`, `activeMinutes` y `walkCount`; **`restMinutes` no tiene comparación**; `null` si no hay base | el informe no bajó a `week-comparison.ts` |
| C3 | *"un dia pasado sin datos vuelve con source 'missing' y todas las metricas en null"* | cierto, **y además** ningún día medido vuelve con `null`, así que el discriminante correcto es `source` y no `null` — la equivalencia actual es una coincidencia, no un contrato | el informe miró el tipo, no el mapper ni `computeDailyActivity` |
| C4 | *"Reutiliza el patron de `weight-chart.tsx` en vez de anadir libreria de graficas"* | el patrón reutilizable es "sin librería de gráficas + color por `useThemeColors` + copy por catálogo"; **no** "con `react-native-svg`", que ahí está por la polilínea | ambigüedad de "patrón" |
| C5 | *"la grafica de barras de 7 dias que el Make pone en la Home (`App.tsx:413-428`)"* | el bloque completo es `design-src/App.tsx:411-424`; `:413` es el título y `:428` cae ya dentro de la tarjeta de recordatorios | imprecisión menor, no caducidad: ese fichero no ha cambiado |

---

## 3. Decisiones técnicas

### D1 — La barra pinta `activeMinutes`. Y solo eso

Tres razones, en orden de peso:

1. La tarjeta se llama *Actividad semanal* (`design-src/App.tsx:413`). Minutos
   activos **es** la actividad; los paseos son su recuento y la distancia su
   consecuencia.
2. **La tendencia solo es gratis para tres métricas** (P6). Si la barra pintara
   `restMinutes`, `weekComparison` no la cubre y D4 se cae. Esto elimina el
   descanso como candidato por razón técnica, no estética.
3. Las otras dos candidatas ya están pintadas en la Home: `walkCount` es el
   dato destacado del hero desde #67 R7 (`home.tsx:133-137`) y `distanceM` es
   la tercera celda del resumen (`home.tsx:337`). Repetirlas en la gráfica sería
   decir lo mismo dos veces en la misma pantalla.

**Qué pasa con las otras cinco métricas del día** (`distanceM`, `restMinutes`,
`walkCount`, `avgWalkMinutes`, `timeAwayMinutes`): **nada, y esa es la
decisión**. No se pierde ninguna —la carta §Dirección de arte 5 lo prohíbe—
porque #68 no borra nada: `summary-card` sigue mostrando actividad, descanso y
distancia de hoy, y el hero sigue mostrando los paseos. Las que hoy no se
muestran (`avgWalkMinutes`, `timeAwayMinutes`) tampoco se mostraban antes; siguen
llegando en el payload y una feature futura las tiene a mano sin pedir nada. Lo
que **no** se hace es un selector de métrica: es interacción nueva sin diseño,
convierte un componente puro en uno con estado, y ninguna de las siete preguntas
de la Home la pide.

### D2 — Un día `missing` no dibuja barra: dibuja un guion

Un cero significa **descanso confirmado** y es información real; una barra de
altura 0 es invisible, así que ni siquiera el cero se puede pintar "a escala".
El reparto:

| Caso | Qué se pinta | `testID` | Portador no cromático |
|---|---|---|---|
| `source !== 'missing'`, `activeMinutes > 0` | cápsula de acento, altura proporcional | `weekly-activity-bar-<fecha>` | altura |
| `source !== 'missing'`, `activeMinutes === 0` | cápsula de acento de `WEEKLY_BAR_MIN_HEIGHT` (6 px) | `weekly-activity-bar-<fecha>` | **hay** barra |
| `source === 'missing'` | glifo `'—'` en `text-2xs text-muted`, sin barra | `weekly-activity-missing-<fecha>` | **no hay** barra |

Los tres portadores son independientes del color: **presencia o ausencia de
barra**, `testID` distinto, y `accessibilityLabel` distinto (R5). Quien mire la
pantalla en escala de grises, quien lea el árbol de tests y quien use TalkBack
distinguen los tres casos sin depender del verde.

El `'—'` **no** es copy y no entra al catálogo: es el mismo símbolo que ya usan
`home.tsx:39,44,48` y `pet-hero-header.tsx:126` para "sin dato", y el candado
de #65 R18 solo persigue valores del catálogo aparecidos como literal entero.

Descartado el borde discontinuo (`borderStyle: 'dashed'`) como marca de "sin
dato": sobre una esquina redondeada, Android lo renderiza de forma inconsistente
y sería un fallo que solo se ve en el smoke.

### D3 — La letra del eje: de la fecha, con `short`, y parseada por componentes

**De dónde sale**: de `day.date`, nunca del índice. El propio `testID` de la
columna es la fecha (`weekly-activity-day-2026-09-06`), así que una
implementación por índice ni siquiera puede fingir.

**Cómo se convierte**: `weekdayLabel` descompone `'YYYY-MM-DD'` en tres números
y construye `new Date(year, month - 1, day)`. **Nunca `new Date(cadena)`.**
Medido, no supuesto:

```
TZ=America/Mexico_City
new Date('2026-09-06').toLocaleDateString('es-MX',{weekday:'short'})  → 'sáb'   ✗
new Date(2026, 8, 6).toLocaleDateString('es-MX',{weekday:'short'})    → 'dom'   ✓
```

Un día entero de desfase, y **invisible en un runner en UTC**: por eso el `it`
de R4 fuerza `process.env.TZ` a una zona de offset negativo antes de llamar. Es
la lección de `prueba-de-mutacion-en-zona-ciega` aplicada por adelantado: el
candado se planta donde el bug puede esconderse, no donde ya se ve.

**Qué locale**: el de `useLocale()`
(`src/providers/language-provider.tsx:82-85` → `LOCALES` de
`src/i18n/catalog.ts:529`, `es-MX` / `en-US`). Nunca el del sistema: la carta
§Dirección de arte 6 lo cierra —"las fechas y las horas siguen al idioma
elegido, no al locale del sistema"— y el repo ya lo hace así en cinco sitios
(`home.tsx:60`, `add-pet/index.tsx:391`, `add-reminder/index.tsx:203,220`,
`reminders/index.tsx:309`, `profile/index.tsx:287`), incluido uno con opciones
(`add-reminder/index.tsx:220`), así que `Intl` con opciones ya está probado en
dispositivo y no estrena riesgo.

**Qué formato**: `weekday: 'short'` para la etiqueta visible, `'long'` para la
etiqueta accesible. `'narrow'` queda **descartado por ambiguo en los dos
idiomas**, medido:

| Locale | `narrow`, 2026-09-02…08 | `short`, 2026-09-02…08 |
|---|---|---|
| `es-MX` | `M J V S D L M` — dos `M` | `mié jue vie sáb dom lun mar` |
| `en-US` | `W T F S S M T` — dos `T`, dos `S` | `Wed Thu Fri Sat Sun Mon Tue` |

Con un eje fijo lunes-a-domingo la posición desambiguaría; con un eje
cronológico que termina hoy (P5), **no**. Y `short` cabe: siete columnas en el
ancho interior de la tarjeta (pantalla de 375 px − 48 de `paddingHorizontal` −
32 del `p-4` del `Card` = 295 px) dan ~42 px por columna para tres o cuatro
caracteres a 10 px.

**Desviación declarada respecto al Make**: el Make escribe `L M X J V S D`
(`design-src/App.tsx:43-44`), con la `X` de miércoles. `Intl` no produce `X` en
ningún locale, así que copiarlo exige una tabla de siete letras escrita a mano
— que además **solo existe en español**, y el catálogo obliga a las dos lenguas
(carta §Dirección de arte 6), con lo que serían catorce entradas mantenidas a
mano para reemplazar una llamada de una línea. Se declara la desviación y se
usa `short`.

### D4 — La tendencia entra: una sola fila, sin color semántico

**Entra**, aunque el Make no la dibuje, por tres motivos: el dato ya está
descargado y tipado (P6), responde a la pregunta que la Home hace peor —*¿cómo
fue su actividad?* mirando solo hoy— y cuesta seis líneas. Es la misma economía
que hace valiosa a #68 entera.

Cómo, exactamente:

- **Una sola** fila (`weekly-activity-trend`), la de `weekComparison.activeMinutes`,
  que es la métrica que pinta la barra (D1). Las otras dos comparaciones no se
  dibujan: la tarjeta habla de una métrica.
- Icono **real** de `reicon-react-native` (`TrendUp` / `TrendDown`, ambos
  existen en `node_modules/reicon-react-native/index.d.ts`), nunca un glifo
  tipográfico: #62 R7 lo prohíbe y tiene test.
- **Sin color semántico.** Ni `success` al subir ni `danger` al bajar. Una
  semana con menos actividad no es un error: puede ser una mascota
  convaleciente, un dueño de viaje o mal tiempo. La app no editorializa sobre
  eso, y el rojo en una tarjeta de la Home alarma. El signo (`+` / `−`, vía
  `signDisplay: 'exceptZero'`) es el portador de dirección; el color es
  `text-muted` en toda la fila.
- `null` ⇒ **la fila no existe**. Sin hueco, sin "—", sin texto de relleno. Una
  mascota nueva no tiene semana previa y no debe ver un cero falso.
- `TABULAR_NUMS` en el `Text` del porcentaje (#62 R15): es un número que se
  recompara en cada refresco, exactamente el supuesto del requisito.

### D5 — El color de la barra es `accent-strong`, resuelto con `useThemeColors`

Precedente literal: `weight-chart.tsx:16` resuelve el color de su marca con
`useThemeColors(['accent-strong'])`. Una barra es una marca de datos igual que
un trazo, no una superficie: nada se pinta encima de ella. Se copia el
precedente y no se re-litiga la regla mecánica de la carta §11 ("fondo ⇒
`--accent`; encima de otra cosa ⇒ `--accent-strong`"), que está escrita para
superficies que llevan texto.

Contraste **calculado**, no estimado (método de #61), contra `--surface` en los
dos temas. Una barra es un objeto gráfico: el listón aplicable es 3:1 (WCAG
1.4.11), y las dos opciones lo pasan — pero una lo pasa raspando:

| Color de barra | Claro (`#FFFFFF`) | Oscuro (`#161B22`) |
|---|---|---|
| `accent-strong` (`#107148` / `#2AB87C`) | **6,04:1** | **6,79:1** |
| `accent` (`#178255` en los dos temas) | 4,82:1 | **3,59:1** |

La etiqueta del eje en `text-muted` (`#667085` / `#9CA3AF`) da **4,97:1** y
**6,81:1**: pasa AA de texto normal (4,5:1) en los dos temas, que es el listón
correcto porque 10 px no es texto grande.

Consecuencia de #61 asumida y ya declarada: en tema claro la barra es
`#107148`, no el `#2AB87C` del Make. El smoke lado a lado lo verá; es esperado.

Efecto secundario buscado: al no usar la clase `text-accent-strong`, el candado
de #61 R4 (`legibility-classnames.test.ts:117-138`, inventario cerrado de 13) no
se mueve.

### D6 — Las barras son cápsulas, y eso mantiene un candado quieto

El Make usa `radius=[5, 5, 0, 0]` (`design-src/App.tsx:419`): 5 px arriba,
esquina viva abajo. **5 px es un cuarto radio** y #62 fijó tres roles y ninguno
más (carta §Decisiones fijas 12), con test que lo persigue
(`consistency-classnames.test.ts:149-178`). De los tres, el que le corresponde a
una barra estrecha es la **cápsula**: `rounded-full`.

Consecuencia mecánica, no estética: una cápsula está **explícitamente excluida**
de #62 R14, y el `Card` compartido ya fusiona `CONTINUOUS_CORNER` por su cuenta
(`card.tsx:29`). Así que #68 añade **cero** `style={CONTINUOUS_CORNER}` y el
inventario cerrado de 33 (`consistency-classnames.test.ts:325-330`) **no se
toca**. Elegir la cápsula es a la vez lo correcto por la carta y lo que menos
mueve.

Desviación declarada respecto al Make: el fondo de las barras queda redondeado
en lugar de vivo. En una barra de 24 px de ancho apoyada en la línea de base, la
diferencia es de unos pocos píxeles.

### D7 — Se dibuja con `View`, no con SVG

`react-native-svg` está instalado, así que usarlo no añadiría dependencia. Aun
así no se usa, por tres razones concretas:

1. **Accesibilidad.** R5 exige una etiqueta por columna. `accessibilityLabel`
   sobre un `View` es la ruta soportada en las dos plataformas; sobre nodos de
   `react-native-svg` el soporte en Android es parcial y depende de la versión.
   Una gráfica muda es exactamente lo que el encargo prohíbe.
2. **Radio.** `rounded-full` (D6) es una clase de uniwind sobre un `View`. Un
   `<Rect>` de SVG necesitaría `rx`/`ry` a mano, que es un radio escrito en
   números — justo lo que la escala de #62 existe para evitar.
3. **Menos código.** Siete `View` con `height` y `flex-1` frente a un `viewBox`,
   un escalado manual y un `preserveAspectRatio`. Una barra es un rectángulo;
   el layout de React Native ya sabe dibujar rectángulos.

`weight-chart.tsx` usa SVG porque una polilínea no se puede componer con
`View`. No es el caso aquí.

### D8 — Dónde se monta, y el hueco que se le deja a #69

Orden del Make: hero (`:334-365`) → tira de 4 celdas (`:366-384`) → … → gráfica
semanal (`:411-424`).

Orden de la Home hoy, tras #67: hero a sangre (primer hijo del `ScrollView`,
`home.tsx:129-145`) → `home-content` (`:186`) con `collar-card` → `summary-card`
(`:276`) → `last-position-card` (`:350`).

**#68 inserta la tarjeta dentro de `home-content`, inmediatamente después de
`summary-card` y antes de `last-position-card`.** No toca el hero, ni
`collar-card`, ni `summary-card`, ni el `contentContainerStyle` (la excepción A9
de #67 sigue igual: `gap` y `paddingBottom` arriba, `paddingHorizontal: 24` en
`home-content`).

Por qué ahí y no bajo el hero: **#69** va a montar la tira de 4 celdas
—Peso/Activo/Paseos/Distancia— sustituyendo o reubicando a `summary-card`, que
es su antecesor de 3 celdas. Anclando la gráfica *detrás de `summary-card`*, el
día que #69 lo suba bajo el hero la gráfica lo sigue sin que nadie reescriba
#68. Si en cambio #68 se metiera entre el hero y `summary-card`, #69 tendría que
saltarla o moverla. El hueco de #69 queda abierto por construcción.

Aviso para #69, que esta spec no puede imponer pero sí dejar escrito: los
mensajes de "actividad no disponible" y "requiere collar" viven hoy dentro de
`summary-card` (`home.tsx:288-299`) y #68 se apoya en ellos para no duplicarlos
(D9). Quien sustituya `summary-card` hereda el deber de conservarlos (carta
§Dirección de arte 5).

### D9 — Estados: skeleton al cargar, silencio al fallar

`activity` tiene seis estados (`src/api/activity.ts:4-10`). El reparto:

| Estado | Gráfica |
|---|---|
| `undefined` (cargando) | `Skeleton` `w-full rounded-card` con la altura del contenido final |
| `ok` | la tarjeta |
| `no-tracking`, `error`, `unreachable`, `missing-config` | **nada** |

No se duplica el mensaje de error: `summary-card` ya lo pinta
(`home.tsx:288-299`) y dos "No se pudo cargar la actividad" seguidos en la misma
pantalla es ruido, no robustez. El `rounded-card` del skeleton es corolario
mecánico de #62 (carta §Decisiones fijas 12: el skeleton lleva el radio del
contenido que sustituye), y la altura va por `style` para no estrenar una clase
arbitraria.

### D10 — Dónde vive el componente, y por qué la Home no se migra

**`mobile-pet-tracker/src/components/weekly-activity-chart.tsx`.**

La regla de extracción de la carta §Decisiones fijas 4 pide "≥2 pantallas + rol
nombrable + API menor que implementación", y esto es **una** pantalla. El
desempate es el precedente literal: `weight-chart.tsx` vive en
`src/components/`, lo consume una sola ruta (`weight-log.tsx`) y la carta lo
lista como componente compartido. Es exactamente el mismo caso —una gráfica de
una ruta no migrada a `src/screens/`—, la ruta que da el enunciado
(`files_affected`), y lo que permite probar el componente aislado del `useApi`
de la Home.

**La Home no se migra a `src/screens/home/`.** `docs/conventions.md` §Estructura
dice que las pantallas anteriores a #39 se migran "solo cuando una feature las
toque de fondo"; #68 le añade seis líneas, y #67 —que la reescribió entera hace
un commit— tampoco la migró. Hacerlo aquí sería mezclar una migración de
estructura con una feature de datos.

El helper `weekdayLabel` se **exporta desde el propio componente** en vez de
vivir en `src/utils/`: tiene un solo consumidor, su test necesita el mismo
fichero de tests que el resto de R4, y `src/utils/` es para helpers con más de
un consumidor (`reminder-dates.ts`, `category-palette.ts`, `theme-preference.ts`).

### D11 — Las siete preguntas de la Home

Declaración obligatoria de la carta §Dirección de arte 3 para toda spec que
toque la Home:

| Pregunta del brief | ¿La responde #68? |
|---|---|
| ¿Está segura? | **No.** Sigue sin responderse; depende de geocercas y alertas |
| ¿Dónde está? | **No.** La responde `last-position-card`, intacta |
| ¿El collar está conectado? | **No.** La responde `collar-card`, intacta |
| ¿Tiene batería? | **No.** La responde `collar-card`, intacta |
| ¿Tiene recordatorio pendiente? | **No.** Sigue sin responderse en la Home |
| **¿Cómo fue su actividad hoy?** | **Sí, y la ensancha**: de "hoy" a "los siete días", con la tendencia contra la semana previa |
| ¿Hay alguna alerta? | **No.** Sigue sin responderse, como declaró #67 |

#68 mejora una de las siete y no degrada ninguna.

---

## 4. Archivos afectados por capa

`mobile-pet-tracker/` es la única raíz tocada. **Cero ficheros de
`backend-pet-tracker/`**, cero infraestructura, cero configuración de Expo, cero
dependencias nuevas.

**Presentación — componente nuevo**
- `src/components/weekly-activity-chart.tsx` — **nuevo**. `WeeklyActivityChart`,
  `WEEKLY_CHART_HEIGHT`, `WEEKLY_BAR_MIN_HEIGHT`, `weekdayLabel`.
- `src/components/__tests__/weekly-activity-chart.test.tsx` — **nuevo**.

**Presentación — pantalla**
- `src/app/(tabs)/home.tsx` — **editado**: un `import`, y el bloque de montaje
  entre `summary-card` y `last-position-card` (R8, R8b). Nada más.
- `src/app/(tabs)/__tests__/home.test.tsx` — **editado**: un `describe` nuevo.

**Contenido**
- `src/i18n/catalog.ts` — **editado**: seis claves en `en` y seis en `es`.
- `src/__tests__/ui-copy-table.ts` — **editado**: seis filas en `R3_HOME`.
- `src/__tests__/ui-language.test.ts` — **editado**: dos `toHaveLength` (+6 y +1).
- `specs/mobile-ui-language/design.md` §2 — **editado**: registro de las claves.

**Candados**
- `src/__tests__/consistency-classnames.test.ts` — **editado**: una fila en
  `#62 R15` y su inventario (+1). `#62 R14` **no se toca**.

**Sin tocar, y es deliberado**: `src/api/*` (el contrato ya sirve),
`src/theme/global.css` (no hace falta ningún token nuevo),
`src/components/pet-hero-header.tsx`, `src/components/card.tsx`,
`src/components/weight-chart.tsx`, `src/hooks/use-api.ts`.

---

## 5. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Añadir `victory-native`, `gifted-charts` o similar | Criterio de aceptación explícito del enunciado. Siete rectángulos no justifican una dependencia con su propio ciclo de vida |
| Dibujar con `react-native-svg` como `weight-chart.tsx` | D7: rompe la accesibilidad por barra en Android, obliga a un radio escrito en números y es más código que siete `View` |
| Pedir el rango a la API con `?from=&to=` para forzar lunes-a-domingo | Sería **una llamada distinta** a la que ya se hace y cambia el contrato de la Home. El enunciado prohíbe llamadas nuevas, y el eje cronológico terminando hoy es más útil: la última barra es siempre hoy |
| Barra de `restMinutes` o de `distanceM` | D1. `restMinutes` además dejaría a la tendencia sin dato (P6) |
| Selector de métrica tocando la tarjeta | Interacción sin diseño, estado nuevo en un componente puro, y ninguna pregunta de la Home la pide |
| Tabla de siete letras `L M X J V S D` en el catálogo | D3: catorce entradas a mano en dos idiomas, y la `X` solo existe en español, para sustituir una llamada de una línea |
| `weekday: 'narrow'` | D3: ambiguo en los dos idiomas y el eje no es lunes-a-domingo, así que la posición no desambigua |
| Día `missing` con borde discontinuo | Android renderiza mal `borderStyle: 'dashed'` sobre esquina redondeada; sería un fallo que solo aparece en el smoke |
| Día `missing` con barra gris de altura fija | Una barra gris sigue siendo una barra: a distancia se lee como "poca actividad", que es justo la mentira que P4 quiere evitar |
| Tendencia en `success` / `danger` | D4: una semana menos activa no es un error y el rojo alarma |
| Tres tendencias (distancia, minutos, paseos) | La tarjeta habla de una métrica; tres flechas piden tres barras |
| Gráfica dentro de `summary-card` | Es territorio de #69 y #68 no lo toca (D8) |
| Gráfica entre el hero y `summary-card` | Cerraría el hueco donde #69 monta su tira (D8) |
| Migrar la Home a `src/screens/home/` | D10: seis líneas no son "tocarla de fondo", y #67 la reescribió sin migrarla |
| Animar el crecimiento de las barras al montar | No pedido, y compite con el hero recién estrenado. Va al backlog de `progress/audit_animations_mobile.md` |

---

## 6. Riesgos y cómo se cierran

| Riesgo | Cierre |
|---|---|
| El desfase de zona horaria pasa desapercibido porque el runner del VPS está en UTC | El `it` de R4 fuerza `process.env.TZ` a offset negativo; verificado en Node 20 que el cambio en caliente sí surte efecto. Es además la mutación 2 de R10c |
| Ramificar por `activeMinutes === null` en vez de por `source` pasa los tests | Mutación 3 de R10c, y R3 lo escribe como obligación explícita |
| `Intl` con `weekday` no soportado en Hermes | Ya se usa en producción con opciones en `add-reminder/index.tsx:220`; el smoke en dev build lo confirma en las dos lenguas |
| Se rompe el candado de copy de #65 al no registrar el fichero nuevo | R9 fija las seis filas y R10b los dos `toHaveLength` como **delta**, no como cifra |
| Alguien "arregla" el `#62 R14` de 33 sin necesidad | R10b lo declara **sin cambio** y explica por qué (cápsulas + `Card`) |
| Aparece un dato que exige una llamada nueva a la API | [[requirements]] §Fuera de alcance: **la feature se para y se reporta**. No se añade la llamada |
