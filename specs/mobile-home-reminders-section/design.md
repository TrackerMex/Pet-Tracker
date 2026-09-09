---
feature: "mobile-home-reminders-section"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-reminders-section]]

> Decisiones técnicas de alto nivel. Los requisitos verificables viven en
> [[requirements]]; el orden de trabajo, en [[tasks]].
>
> **Todo lo de §1 se ha comprobado contra el árbol en `b0ec5a8`**, fichero por
> fichero y línea por línea. Nada de aquí sale de
> `progress/explore_design-gap-vs-make.md`, que es un informe fechado el
> 2026-09-04, anterior a siete features, y que ya metió más de una docena de
> premisas falsas entre #67, #68, #69 y #71. Todos los números de línea del
> enunciado están caducados por definición: #68 reescribió la Home entera y la
> movió a `src/screens/home/`, #69 le añadió una celda y #71 una sección.
>
> **Esta es la última feature del Bloque 1** del rediseño contra el Make.

---

## 1. Premisas verificadas

### P1 — La sección del Make: dos filas, una imposible — **CIERTA, con la cita desplazada dos veces**

`specs/mobile-figma-polish/design-src/App.tsx:425-449`:

```
425  <div className="px-4 mb-6">
426    <div className="flex items-center justify-between mb-3">
427      <p className="text-sm font-bold text-foreground">Recordatorios</p>
428      <button className="text-xs font-semibold" style={{ color: "#2AB87C" }}>Ver todos</button>
429    </div>
430    <div className="space-y-2">
431      {pet.nextVaccine && (
432        <div className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-2xl shadow-sm">
433          <div className="text-xl">💉</div>
434          <div className="flex-1 min-w-0"><p className="…">{pet.nextVaccine.name}</p><p className="…">{pet.nextVaccine.date}</p></div>
435          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFF7ED", color: "#C2410C" }}>{pet.nextVaccine.daysLeft}d</span>
436        </div>
437      )}
438      <div className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-2xl shadow-sm">
439        <div className="text-xl">🍽️</div>
440        <div className="flex-1 min-w-0">
441          <div className="flex justify-between mb-1.5"><p className="…">Alimentación</p><span className="…">{pet.meals}/{pet.totalMeals}</span></div>
442          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
443            <div className="h-full rounded-full" style={{ width: `${(pet.meals / pet.totalMeals) * 100}%`, background: "#2AB87C" }} />
444          </div>
445        </div>
446      </div>
447    </div>
448  </div>
449  </div>
```

(Se ha recortado alguna clase larga para que quepa; los números de línea son los
del fichero.) El rango real es **`:425-449`**. El enunciado dice `:429-451` y el
informe de exploración dice `:425-450`: **las dos citas están mal** (§2 C1).

Lo que el bloque enseña, y que decide toda la spec:

- La cabecera es **título + botón de texto verde**, no una tarjeta (R1, R10).
- La fila de vacuna es **condicional** (`{pet.nextVaccine && …}`, `:431`): el
  propio diseño admite que puede no haber ninguna. Lo que **no** dibuja es qué
  poner en su lugar — ese hueco es el que R8 cierra.
- La fila de vacuna lee **`name`, `date` y `daysLeft`** del mock (`:34`:
  `{ name: "Antirrábica", date: "15 Ago 2025", daysLeft: 26 }`). El contrato
  real solo da `{ id, name, nextDoseAt }`: `date` y `daysLeft` se derivan (P3).
- La píldora es **ámbar** (`#FFF7ED` sobre `#C2410C`) y **cápsula**
  (`rounded-full`), sobre una tarjeta con radio 16 (`rounded-2xl`).
- La segunda fila es la **barra de comidas**, y lee `pet.meals / pet.totalMeals`
  (`:441-443`). **Ni `nextReminder` ni `activitySummary` aparecen** en ninguna de
  las 25 líneas del bloque (§2 C2).

### P2 — `nextVaccine` está poblado, pero **solo en el detalle** — **CIERTA E INCOMPLETA**

El encargo dice que el mapper lo tipa y lo pasa, y las tres líneas que cita son
exactas:

```
backend-pet-tracker/…/pet-profile-response.mapper.ts
 43    nextVaccine: NextPetVaccine | null;
 59    nextVaccine: NextPetVaccine | null = null,     ← valor por defecto: null
 83      nextVaccine,
```

Lo que el encargo no dice y decide la implementación: **el parámetro tiene
valor por defecto `null`**, y de los cinco sitios que llaman al mapper solo
**uno** lo pasa de verdad:

| Endpoint | Línea | ¿Pasa `nextVaccine`? |
|---|---|---|
| `POST /v1/pets` | `pets.controller.ts:66` | no (dos argumentos) |
| **`GET /v1/pets`** (lista) | `:77` | **no** — `toPetProfileResponse(pet, role, now, null, photoUrl)` |
| **`GET /v1/pets/:petId`** (detalle) | `:94-101` | **sí** — `nextVaccine` viene de `getPet.execute()` |
| `PATCH /v1/pets/:petId` | `:120` | no |
| `POST /v1/pets/:petId/lost-mode` | `:145` | no |

La Home llama a **las dos**: `listPets` para el selector de mascota
(`home/index.tsx:99-102`) y `getPet` para el detalle (`:112-118`). Si la sección
leyera `pets.data`, `nextVaccine` sería `null` **siempre y para todas las
mascotas** — un estado vacío permanente que ningún test con fixture detectaría,
porque la fixture sí trae el campo. R15 obliga a leerlo de `detail`.

El origen del dato, verificado de punta a punta:

```
get-pet.use-case.ts:71-74
  nextVaccine: await this.vaccineReader.findNextVaccine(
    petId,
    new Date().toISOString().slice(0, 10),      ← hoy, en UTC del servidor
  ),

pet-vaccine.drizzle-reader.ts:19-32
  .where(and(eq(petVaccines.petId, petId), gt(petVaccines.nextDoseAt, after)))
  .orderBy(asc(petVaccines.nextDoseAt))
  .limit(1)
```

**`gt`, no `gte`**, y contra el hoy **UTC**. De ahí salen las dos consecuencias
de §2 C3.

### P3 — La forma de `NextPetVaccine`: tres campos, ni uno más — **VERIFICADO**

`backend-pet-tracker/src/modules/pets/domain/ports/pet-vaccine-reader.ts:3-7`:

```ts
export interface NextPetVaccine {
  id: string;
  name: string;
  nextDoseAt: string;
}
```

`nextDoseAt` es `string` y **no** es un `datetime`: la columna es
`nextDoseAt: date('next_dose_at')` (`db/schema/health.schema.ts:49`), un tipo de
fecha de calendario. Drizzle la devuelve como `'YYYY-MM-DD'` y el reader la pasa
tal cual (`pet-vaccine.drizzle-reader.ts:32`). Ese hecho es el que obliga a R4 y
R5: una cadena de fecha pura pasada a `new Date(...)` se interpreta como
medianoche **UTC** y se desplaza un día entero en cualquier offset negativo.

El mock del Make inventa además `date` (ya formateada) y `daysLeft`
(`design-src/App.tsx:34`). **Ninguno de los dos existe en el contrato**: los dos
se derivan en cliente, y R2 prohíbe explícitamente añadirlos al tipo.

### P4 — Los tres huecos del perfil en el móvil — **VERIFICADO**

`mobile-pet-tracker/src/api/types.ts:72-74`:

```ts
  nextVaccine: unknown;
  nextReminder: unknown;
  activitySummary: unknown;
```

Los tres. El dato de vacuna **llega por el cable** y el cliente no lo puede
consumir sin tiparlo — es trabajo de esta feature (R2). Los otros dos se quedan
como están, y eso es la prueba **en el árbol** de que la sección no los usa.

No hay validación en tiempo de ejecución que lo estorbe: `getPet` solo comprueba
que `id` y `name` sean cadenas (`src/api/pets.ts:48-56`) y luego castea. Tipar
es un cambio puramente de compilación; el `tsc --noEmit` de R19 es lo que lo
prueba.

### P5 — Las dos rutas de recordatorios y quién navega a ellas — **VERIFICADO leyendo cada fichero**

```
src/app/(tabs)/reminders.tsx      → src/screens/reminders/  (RemindersScreen, la LISTA)
src/app/(tabs)/add-reminder.tsx   → src/screens/add-reminder/ (AddReminderScreen, el ALTA)
```

Los dos son routes delgados de cinco líneas. Ninguno es pestaña
(`_layout.tsx:26-30` registra `home`, `map`, `health`, `food`, `profile`).

| Ruta | Quién navega hoy | ¿La Home? |
|---|---|---|
| `/reminders` | `profile/index.tsx:328` (`reminders-link`) y el `<Redirect>` de `add-reminder/index.tsx:317` cuando no hay mascota | **cero veces** |
| `/add-reminder` | `reminders/index.tsx:149` (`reminders-add-link`) y el tile `quick-action-reminder` de #71 (`home/index.tsx:57`) | una vez, al **alta** |

Conclusión: el enlace de R10 es el **primer** acceso a la lista desde la Home, y
**no** es un tercer camino. #71 lo dejó por escrito al descartar un cuarto tile:
*"un tile a `/reminders` sería un segundo camino al mismo sitio en la misma
pantalla"* — porque preveía **esta** feature.

Qué pinta la lista, leído y no deducido (`src/screens/reminders/index.tsx`):
lee la mascota seleccionada (`:47`), no toma parámetro de ruta, **no redirige**
sin mascota, y tiene su propia petición (`listReminders`, `:55-61`) con
esqueleto (`:166`), error con reintento (`:179-182`), estado vacío (`:190`),
tres píldoras de recuento y la lista con borrado. Es decir: **el enlace sigue
siendo útil aunque el perfil de la Home falle**, que es lo que R9 aprovecha.

### P6 — Dónde encaja en el árbol de la Home — **VERIFICADO**

Hijos directos de `home-content` hoy (`src/screens/home/index.tsx:224-483`), en
orden de render:

| # | `testID` | Condición | Feature |
|---|---|---|---|
| 1 | `pet-hero-error` | `detail` en error | — |
| 2 | `summary-card` | `selectedPetId` | #69 |
| 3 | `collar-card` | `detail.kind === 'ok'` | — |
| 4 | `quick-actions` | `selectedPetId` | #71 |
| 5 | `weekly-activity-skeleton` | `selectedPetId && activity === undefined` | #68 |
| 6 | `weekly-activity-card` (+ `weekly-activity-day-map`) | `activity.kind === 'ok'` | #68 |
| 7 | `last-position-card` | `detail.kind === 'ok' && pet.device` | — |

La sección va **entre 6 y 7** (R14). El `gap: 16` del contenedor (`:224`) la
separa sin margen propio.

### P7 — Los tres candados de orden filtran a lista blanca — **VERIFICADO, y por eso ninguno se mueve**

- #68: `index.test.tsx:1205-1235`, lista blanca de **3**
  (`summary-card`, `weekly-activity-card`, `last-position-card`).
- #69: `:1401-1438`, lista blanca de **4** (añade `collar-card`).
- #71: `:1760-1798`, lista blanca de **5** (añade `quick-actions`).

Los tres construyen `relevantChildren` filtrando `.includes(testID)` **antes**
de comparar, así que un hermano nuevo es invisible para ellos. El de esta
feature usa una lista blanca de **6**. Cero deltas, cero ediciones.

### P8 — El helper de días que ya existe **no sirve** — **VERIFICADO leyendo el fichero entero**

`src/utils/reminder-dates.ts`, completo:

```ts
const DAY_MS = 86_400_000;

export function combineDateAndTime(date: Date, time: Date): Date { … }

export function daysUntil(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
}
```

Tres cosas lo descartan:

1. **Toma dos `Date`**, no una cadena de fecha. Nuestro dato es
   `'YYYY-MM-DD'`, y convertirlo a `Date` es precisamente el paso donde está la
   trampa.
2. **`Math.ceil` sobre una resta de instantes**, sin alinear a día de
   calendario: a las 23:30 del día 10, con objetivo el 15, devuelve **4** en un
   offset negativo y **5** en UTC. Es el mismo desfase que #68 R4 midió.
3. Lo consumen la píldora `pill-week` (`reminders/index.tsx:235`) y el contador
   por fila (`:275`) de **otra pantalla**. Arreglarlo cambia la conducta de esa
   pantalla y obliga a re-litigar sus tests.

Por eso R4 declara una función **nueva y con otro nombre**,
`calendarDaysUntil`, con otra firma (`string`, `Date`) — no es duplicación, es
otra semántica sobre otro tipo de entrada — y §Decisiones abiertas E3 deja
anotado el defecto del original.

### P9 — La pestaña Salud ya pinta la próxima vacuna — **CIERTA, y no es duplicación**

`src/app/(tabs)/health.tsx:69-79` y `:144-161`: la pantalla pide
`listVaccines(...)`, calcula en cliente la próxima con
`nextDoseAt !== null && nextDoseAt >= localTodayIso()` ordenando por
`localeCompare`, y la pinta en `next-vaccine-card` con un `Syringe`, el nombre y
**la cadena ISO cruda** (`:161`), sin localizar y sin contador.

No es el defecto de duplicación de #71 —son dos pantallas distintas, y la Home
es donde la carta pide responder *"¿tiene algún recordatorio pendiente?"*— pero
tiene una consecuencia real que §2 C3 recoge: las dos usan **filtros distintos**
y pueden discrepar el día de la dosis.

Lo que sí se hereda de ahí es el **glifo**: `Syringe` para el mismo concepto
(R13), por el mismo argumento con que #71 repitió `Weight`.

### P10 — Los tokens y el `Card` que la sección consume — **VERIFICADO**

`src/utils/category-palette.ts:17-27`:

```ts
export const CATEGORY_SLOTS: Record<CategorySlot, { surface: string; ink: string }> = {
  blue:    { surface: 'bg-category-blue',    ink: 'text-category-blue-strong' },
  amber:   { surface: 'bg-category-amber',   ink: 'text-category-amber-strong' },
  …
  neutral: { surface: 'bg-default',          ink: 'text-muted' },
};
```

El comentario `:5-7` es **cargante**: el escáner de utilidades solo genera las
clases que ve escritas enteras, así que `bg-category-${slot}` renderiza sin
estilo. Se consume **siempre** como `CATEGORY_SLOTS[slot].surface`, que es como
ya lo hacen `reminders/index.tsx:285` y `home/index.tsx:418`. La Home **ya lo
importa** (`:38`).

`src/components/card.tsx` da `rounded-card border border-border bg-surface p-4
shadow-sm` más `CONTINUOUS_CORNER` de fábrica, y **solo** se vuelve `Pressable`
si recibe `onPress` (`:31-40`). Las dos filas de la sección lo usan sin
`onPress`: obtienen la esquina continua sin sumar al inventario de #62 R14, y
son inertes sin declarar nada (R6).

### P11 — `Syringe` existe en `reicon` — **VERIFICADO en `index.d.ts`**

`node_modules/reicon-react-native/index.d.ts` exporta `Syringe` (y también
`Bell`, `BellRing`, `Pill`, `Stethoscope`, `Calendar*`). No coincide con ninguno
de los cinco glifos de la barra —`Home`, `Map`, `HeartPulse`, `ForkKnife`,
`Profile` (`floating-tab-bar.tsx:49-54`)—. **Cero dependencias nuevas.**

### P12 — El candado de longitud del catálogo, por cuarta vez — **CIERTA**

`src/providers/__tests__/language-provider.test.tsx:41` vale hoy
`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4)` = 281, y el catálogo tiene
exactamente 281 claves por idioma. Se omitió en #68 y en #69 y paró la
implementación las dos veces; #71 lo enumeró y no paró. R18 lo pone de **primera
fila**.

### P13 — No existe candado global de hex — **CIERTA, confirmada por cuarta vez**

El único test que persigue hexadecimales es `src/__tests__/design-drift.test.ts`,
y lo hace sobre **listas nominales de ficheros**: `R9` (`:89`), `R11` (`:162`),
`#68 R18` (`:189`), `#69 R13` (`:235`) y `#71 R13` (`:256`). No hay barrido
global. Y **`src/api/types.ts` no está en ninguna de las cinco**, así que sin el
bloque de R17 el fichero que esta feature tipa quedaría sin vigilar.

---

## 2. Correcciones — premisas que salieron falsas

### C1 — La cita del Make está desplazada, y las dos fuentes se equivocan distinto

El enunciado de `feature_list.json` dice `App.tsx:429-451`.
`progress/explore_design-gap-vs-make.md:83` dice `:425-450`. El bloque real es
**`:425-449`** (P1). Es la segunda vez en este bloque que la cita del Make no
cuadra: #71 §2 C1 corrigió `:396-412` → `:395-410`.

### C2 — "la barra de comidas no se puede construir **porque** `nextReminder` y `activitySummary` son `null`"

**La conclusión es correcta; la causa es falsa**, y es la corrección más
importante de esta spec.

La barra lee `pet.meals / pet.totalMeals` (`design-src/App.tsx:441-443`).
**Ninguno de los dos es `nextReminder` ni `activitySummary`.** Los huecos `null`
del perfil son otra cosa: `nextReminder` está reservado para el próximo
recordatorio genérico (`/** null hasta pet-reminders (#16). */`) y
`activitySummary` para el resumen de actividad (`/** null hasta
activity-summary (#10). */`).

Las causas reales, verificadas:

1. **No existe registro de comida servida en ningún sitio del backend.**
   `src/app/(tabs)/food.tsx:185` lo finge: `const served = mealTime <= hhmm;`,
   comparando la hora de la comida con el reloj **local del teléfono**. No hay
   tabla, ni endpoint, ni columna. El informe de exploración ya lo decía
   (`:432`, *"`meals` **FALTA-BACKEND**"*), y el enunciado no lo recogió.
2. **El denominador vive fuera del perfil.** `mealsPerDay` está en el plan de
   nutrición (`src/api/types.ts:184`), no en `PetProfileResponse` (§1 P4). La
   Home tendría que añadir una petición — que R15 prohíbe.

La diferencia importa: si se escribiera la causa falsa, la feature de backend
que desbloquee esto buscaría rellenar dos huecos del perfil y **seguiría sin
poder dibujar la barra**, porque lo que falta es el registro de comida servida.
Por eso R3 fija las dos causas verdaderas y §Decisiones abiertas E2 pregunta si
son una feature o dos.

### C3 — "una vacuna vencida es el caso que más se ve en producción"

**Falso para este endpoint**, y lo cierto es lo contrario.

El lector filtra `gt(petVaccines.nextDoseAt, after)` con
`after = hoy en UTC del servidor` (§1 P2). Consecuencias:

- **El backend nunca devuelve una vacuna vencida** en el instante de la
  petición. La Home refresca al enfocar (`useFocusEffect`,
  `home/index.tsx:145-150`), así que el estado normal es siempre futuro.
- Queda alcanzable por dos caminos estrechos pero reales: una pantalla montada
  que **cruza la medianoche local** sin reenfocarse, y un **reloj de dispositivo
  adelantado**. R7 los cubre con dos ternarios; el coste de no cubrirlos es
  pintar `-3 d`.
- **Lo que sí se ve en producción es el borde opuesto**: `gt` excluye la vacuna
  que vence **hoy**, mientras `health.tsx:71` la incluye (`>= hoy local`). El
  día de la dosis, la pestaña Salud la enseña y la Home ya no. Y el "hoy" del
  backend es **UTC**, no el del dueño. Es un cambio de backend con id propio:
  decisión abierta **E1**.

### C4 — "reutiliza el `daysUntil` que ya existe"

Existe y no sirve: §1 P8. Reutilizarlo importaría exactamente el desfase que el
encargo pide evitar, y en la zona ciega —un runner en UTC lo da por bueno—.

### C5 — "la Home es el primer sitio donde se ve la próxima vacuna"

Falso: `health.tsx:144` ya la pinta (§1 P9). No es duplicación —otra pantalla,
otra fuente— pero obliga a declarar la discrepancia de C3 en vez de descubrirla
en el smoke.

### C6 — "`pet-profile-summary-slots` es la feature de backend que lo desbloquea"

**No existe.** `feature_list.json` no tiene ninguna feature con ese nombre y su
id máximo es 81. Es un nombre propuesto en el enunciado, no un id abierto:
decisión abierta **E2**.

---

## 3. Decisiones técnicas

### D1 — Qué se toma del Make, y qué no

| Del Make | Veredicto |
|---|---|
| Cabecera "Recordatorios" + botón de texto verde "Ver todos" | **entra** (R1, R10) — incluidas las dos palabras, que es lo que manda la carta |
| Fila de próxima vacuna: icono, nombre, fecha, píldora con los días | **entra** (R6), con el icono en `reicon` en vez del emoji (R13) |
| Píldora ámbar en cápsula | **entra** (R12), con los tokens de #64 en vez de los dos hex |
| `rounded-2xl` en la tarjeta | **fuera**: #62 fijó la escala; se usa `rounded-card` vía el `Card` compartido (R12) |
| Emoji `💉` y `🍽️` | **fuera**: #62 R7 (R13) |
| **Barra de progreso de comidas** | **fuera** (R3), con las dos causas verificadas de §2 C2 |
| Ausencia de estado vacío | **corregido**: el Make deja el hueco condicional sin llenar; R8 lo llena |

### D2 — La sección entrega media parte del diseño, y lo dice en la spec en vez de rellenar el hueco

Es la decisión central. Había tres salidas y solo una es honesta:

1. **Inventar el dato** — derivar "comidas servidas" del reloj como hace
   `food.tsx:185`. Descartada: la Home diría "2/3 comidas" con la misma
   confianza con la que dice la vacuna, y el usuario no puede distinguir un dato
   medido de uno fingido. La carta §Dirección de arte 4 prohíbe enseñar lo que
   no se puede explicar.
2. **Aplazar la sección entera** hasta que el backend dé la mitad que falta.
   Descartada: la mitad que **sí** existe responde una de las siete preguntas de
   la Home y lleva desde #14 sin usarse.
3. **Entregar la mitad construible y declarar la otra imposible por escrito**,
   con la causa verificada. Es lo que hace R3.

### D3 — `calendarDaysUntil`: función nueva, no reutilización

Firma exacta (R4):

```ts
export function calendarDaysUntil(date: string, now: Date): number
```

Tres decisiones dentro:

- **Entrada `string`, no `Date`.** El dato es `'YYYY-MM-DD'` y el propio acto de
  convertirlo a `Date` es donde vive el fallo. Que la firma tome la cadena
  obliga a que la conversión ocurra dentro, donde el test la vigila.
- **`now` es parámetro.** El test fija el día sin tocar el reloj del runner ni
  depender de `jest.useFakeTimers()` para la parte pura.
- **Se normaliza a medianoche UTC en los dos lados.** Dos `Date.UTC(...)`
  distan siempre un múltiplo exacto de 86 400 000 ms: el resultado es entero y
  **inmune al horario de verano**. Normalizar a medianoche local haría que un
  salto de DST entre las dos fechas devolviera 4,96 días.

**Por qué no se toca `reminder-dates.daysUntil`**: §1 P8 y §Decisiones abiertas
E3. Arreglar el original sería el fix de raíz —hay dos llamantes y los dos
heredarían la corrección— pero los dos están en **otra pantalla**, con sus
propios tests aprobados en #39/#47, y cambiarlos de paso dentro de una feature
de la Home es exactamente la clase de alcance que este harness rechaza. Se
reporta y se deja.

El nombre es deliberadamente distinto (`calendarDaysUntil`, no `daysUntil`) para
que nadie confunda las dos en un `grep`.

### D4 — Tres ramas de contador, no dos y no una

| `days` | Texto | Por qué existe |
|---|---|---|
| `> 0` | `5 d` | el caso normal; es lo que el Make dibuja |
| `=== 0` | `Hoy` | alcanzable por caché que cruza medianoche; y es el borde donde Salud y la Home discrepan (§2 C3) |
| `< 0` | `Vencida` | alcanzable por reloj adelantado o caché de más de un día |

Descartadas: **truncar a cero** (diría "hoy" de una dosis que pasó hace tres
días — la carta §Dirección de arte 5 prohíbe perder información por parecerse al
diseño) y **ocultar la fila** (caería al estado vacío de R8, que afirma que no
hay vacuna próxima, y es falso).

Las tres ramas se resuelven en **una** función de módulo que devuelve
`{ text, label }`, para que el texto visible y el nombre accesible salgan del
mismo sitio y no puedan divergir (R7, R11).

### D5 — El estado vacío tiene la **forma de una fila**, no la de un mensaje suelto

El Make no lo dibuja: su fila es condicional y debajo queda la barra de comidas.
Al quitar la barra, sin estado vacío la sección se quedaría con un rótulo, un
enlace y nada — un hueco.

Se descarta el `Text` suelto en `text-muted` (el idioma de `home-empty`,
`home/index.tsx:216-218`) porque la sección **cambiaría de forma** al vaciarse:
una tarjeta de 64 px se convertiría en una línea de 18. Con la misma anatomía
—disco de icono + texto en una `Card`— la sección conserva su altura y su peso
visual, que es lo que pide el check de *repetición* de la carta §Checklist de
autocrítica.

El hueco es **neutral** (`bg-default` / `text-muted`), no azul: el azul es la
categoría *vacunación* y aquí no hay ninguna. Además `CATEGORY_SLOTS.neutral` no
resuelve a clases `bg-category-*`, así que no roza el candado #64 R9.

### D6 — La ruta se escribe sin `as Href`

`app.json:39-42` activa `typedRoutes`, pero los tipos generados **no existen**:
`.expo/types/` está vacío y gitignorado, así que `ExpoRouter.__routes` queda como
la interfaz vacía y `Href` colapsa a `string | HrefObject`. **Todo literal de
cadena es asignable** y `as Href` es un ensanchamiento sin efecto.

El repo está dividido —`profile/index.tsx:328` y `add-reminder/index.tsx:317`
castean para `/reminders`; `home/index.tsx:392,457,471` y `health.tsx:268` no
castean nada— y el código nuevo va **sin cast**: #71 lo cerró con una corrección
(`da9a847` → `ba92380`) y dejó el candado `index.test.tsx:1587`, que rechaza el
cast en el camino de la rejilla.

Consecuencia práctica: **borrar `.expo/types/router.d.ts` antes de empezar**. Si
existe con contenido rancio, `/reminders` puede dejar de typechequear por una
ruta fantasma. Está en R19 y en [[tasks]].

### D7 — Dos huecos de paleta en una fila, y por qué no es ruido

El disco es **azul** y el contador es **ámbar**. Son dos ejes distintos:

- **azul = qué es.** La carta §Dirección de arte 1 asigna la vacunación al hueco
  azul, y `reminder-meta.ts` ya lo encarna para `reminder.vaccine`.
- **ámbar = cuándo es.** Es urgencia, no categoría, y es exactamente el color
  que el Make le da a esa píldora (`#FFF7ED` / `#C2410C`).

Descartado usar un solo hueco: con el ámbar en los dos sitios la píldora deja de
destacar; con el azul en los dos se pierde la señal de urgencia y se contradice
el diseño.

**No se importa `REMINDER_TYPE_META`** para sacar el hueco: es un mapa indexado
por `ReminderType` y `nextVaccine` **no es un `Reminder`** —no tiene campo de
tipo—. Forzar la traducción ataría dos dominios que el contrato mantiene
separados. Se usa `CATEGORY_SLOTS.blue` directamente, que es el acceso que #64
R9 sanciona.

### D8 — La fila no es pulsable

Tres destinos posibles y ninguno se sostiene: `/health` es **pestaña** (el
defecto que #71 R3 eliminó), `/reminders` sería un **segundo camino** desde la
misma sección que ya lo enlaza, y no existe pantalla de detalle de vacuna. El
Make tampoco la hace pulsable (`:432` es un `div`).

Basta con no pasar `onPress` al `Card`: solo entonces renderiza un `View` sin
`accessibilityRole` (`card.tsx:42`). No hay nada que declarar; hay algo que **no**
declarar, y R6 lo dice para que nadie lo añada "de paso".

### D9 — Sin error propio, con cabecera superviviente

La Home ya monta `pet-hero-error` + `pet-hero-retry` para el mismo fallo de la
misma petición, arriba en el mismo `home-content` (`:225-236`). Un segundo
mensaje sería el mismo fallo dicho dos veces.

Pero la **cabecera sí sobrevive**: la pantalla de recordatorios tiene su propia
petición y no depende del perfil (§1 P5), así que el enlace sigue llevando a
algo que funciona justo cuando el perfil no carga. Es la única parte de la
sección independiente de `detail`, y R9 lo fija.

### D10 — La sección se queda dentro de `index.tsx`

Sacarla a `src/screens/home/reminders-section.tsx` haría crecer `SCREEN_FILES`
(`ui-language.test.ts:357`, hoy `19 + 2`) porque la copy se mudaría con ella, y
obligaría a un delta más a cambio de nada. Los dos helpers puros sí van a
`format.ts`, que ya existe, ya tiene su `format.test.ts` y **no** contiene copy,
así que no mueve `SCREEN_FILES`.

Es la misma decisión que #71 D7, por la misma razón mecánica.

### D11 — El contador es el único nodo con cifras tabulares

`TABULAR_NUMS` (#62 R15) es para **cifras que se alinean o cambian**: el
contador cambia cada día y vive en una píldora de ancho variable. El nombre no
tiene cifras y la fecha es un dato de una sola aparición, no una columna. Por eso
el delta de R18 fila 3 es **+1**, no +2.

### D12 — Cero animación

El Make no la tiene, la carta no la pide y la sección no entra ni sale por
gesto. `expo-haptics` no está instalado y nada aquí lo necesita.

---

## 4. Contrastes: heredados, no recalculados

Los pares que esta sección usa son **exactamente** los que #71 §4 calculó con el
método de #61 (contraste **calculado**, no estimado), sobre los mismos tokens de
`src/theme/global.css` sin cambiar ninguno:

| Par | Claro | Oscuro | Dónde |
|---|---|---|---|
| `text-category-blue-strong` sobre `bg-category-blue` | **4,75** | **4,81** | icono de R6 |
| `text-category-amber-strong` sobre `bg-category-amber` | **4,70** | **4,78** | contador de R6/R7 |
| `text-foreground` sobre `bg-surface` | ≥ 15 | ≥ 15 | nombre de la vacuna |
| `text-muted` sobre `bg-surface` | par ya usado en toda la app | | fecha, estado vacío |
| `text-muted` sobre `bg-default` | par ya usado en `collar-card` | | estado vacío de R8 |
| `text-accent-strong` sobre `bg-background` | par de #61, regla mecánica "encima de otra cosa ⇒ `-strong`" | | enlace de R10 |

Los seis pasan AA en los dos temas. **No se añade, renombra ni cambia ningún
token.**

---

## 5. Las siete preguntas de la Home

La carta §Dirección de arte 3 exige que toda spec que toque la Home declare
cuáles de las siete responde.

| # | Pregunta | ¿La responde esta feature? |
|---|---|---|
| 1 | ¿está segura? | no — modo perdido, fuera |
| 2 | ¿dónde está? | no — `last-position-card` y el mapa, ya existentes |
| 3 | ¿el collar está conectado? | no — `collar-card`, ya existente |
| 4 | ¿tiene batería? | no — `collar-battery`, ya existente |
| 5 | **¿tiene algún recordatorio pendiente?** | **SÍ, y es la primera feature que la responde.** La próxima vacuna con sus días (R6, R7), el estado vacío cuando no hay (R8) y el acceso a la lista completa (R10) |
| 6 | ¿cómo fue su actividad hoy? | no — #68 y #69 |
| 7 | ¿hay alguna alerta? | no — feature #78 (`mobile-alerts-center`) |

Con esta feature el Bloque 1 deja **cinco** de las siete respondidas en la Home;
quedan 1 y 7, las dos con feature propia.

---

## 6. Alternativas descartadas

### A1 — Dibujar la barra de comidas derivando "servido" del reloj

Es lo que hace `food.tsx:185`. Descartada: la Home presentaría un dato fingido
con la misma autoridad visual que uno medido, y el usuario no puede distinguir
los dos. Carta §Dirección de arte 4.

### A2 — Anclar la sección al final del scroll, después de `last-position-card`

Es lo que hace el Make, donde Recordatorios es la última sección. Descartada:
`last-position-card` no está en el Make en esa posición —el Make la pone arriba,
en la fila de collar (`:384-394`)— y moverla no es asunto de esta feature.
Anclar antes conserva el orden relativo del diseño entre las secciones que
existen en los dos árboles y deja las tres features anteriores intactas. Se
ratifica en §Aprobación.

### A3 — Anclar la sección arriba, junto a `summary-card`

Argumento a favor: "¿tiene algún recordatorio pendiente?" es una de las siete
preguntas y merece estar alta. Descartada: contradice el orden del Make sin
ninguna evidencia de que el orden del Make sea malo, y las tres features
anteriores del bloque se anclaron **por el orden del diseño**. Cambiar el
criterio en la última rompe la coherencia del bloque.

### A4 — Reutilizar `daysUntil` de `src/utils/reminder-dates.ts`

Descartada: §1 P8. Importaría el desfase de un día, en la zona ciega de un
runner en UTC.

### A5 — Arreglar `reminder-dates.daysUntil` de paso

El fix de raíz, y tentador: dos llamantes, una línea. Descartada porque los dos
llamantes están en **otra pantalla** con tests aprobados en #39/#47, y el
harness pide una feature por cambio de conducta. Se reporta como **E3**.

### A6 — Hacer pulsable la fila de la vacuna, hacia `/health`

Descartada: §3 D8. Sería un camino desde la Home a una pestaña.

### A7 — Un tile a `/reminders` en la rejilla de #71 en vez de una sección

Descartada por #71, que ya la juzgó y la dejó fuera **precisamente** porque esta
feature pone el enlace aquí. Un tile daría el acceso pero no el dato: la
pregunta 5 quedaría sin responder.

### A8 — Mensaje de error y botón de reintento propios de la sección

Descartada: §3 D9. `pet-hero-error` ya cubre el mismo fallo de la misma
petición.

### A9 — Un `Text` suelto como estado vacío

Descartada: §3 D5. La sección cambiaría de forma al vaciarse.

### A10 — Tipar `nextReminder` y `activitySummary` como `null` "ya que estamos"

Descartada: no lo necesita ningún requisito, ataría el cliente a un valor que el
backend cambiará en cuanto los rellene, y borraría la señal en el árbol de que
esta feature no los usa (R2). Dejarlos en `unknown` **es** la prueba.

### A11 — Un solo hueco de paleta para toda la fila

Descartada: §3 D7. El disco dice qué es y el contador dice cuándo es.

### A12 — Sacar la sección a `src/screens/home/reminders-section.tsx`

Descartada: §3 D10. Haría crecer `SCREEN_FILES` a cambio de nada.

### A13 — Una sola clave para el contador, sin nombre accesible expandido

Descartada: `5 d` es una abreviatura que un lector de pantalla no despliega. La
carta obliga a que el `accessibilityLabel` salga del catálogo, así que son dos
claves (R11, R16).

---

## 7. Archivos afectados por capa

Todo es capa de **presentación** de `mobile-pet-tracker/`. Cero dominio, cero
aplicación, cero infraestructura, cero backend.

| Fichero | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/api/types.ts` | **producción**: la interfaz `NextVaccine` y el campo `nextVaccine` (R2). `nextReminder` y `activitySummary` **no se tocan** |
| `mobile-pet-tracker/src/screens/home/format.ts` | **producción**: `calendarDaysUntil` (R4) y `fmtDate` (R6) |
| `mobile-pet-tracker/src/screens/home/index.tsx` | **producción**: `vaccineCountdown` a nivel de módulo, `'category-blue-strong'` añadido al `useThemeColors` existente, la sección `reminders-section` entre la actividad semanal y `last-position-card`, y el import de `Syringe` |
| `mobile-pet-tracker/src/i18n/catalog.ts` | **producción**: siete claves en `en` y siete en `es` (R16) |
| `mobile-pet-tracker/src/screens/home/format.test.ts` | tests de R4 y R5 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | tests de R1-R3, R6-R15; una entrada nueva en el doble de `reicon` (R13) |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | siete filas en `R3_HOME` |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | delta de `R3_HOME` (`:83`) |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | **delta de longitud de catálogo (`:41`)** — el que paró #68 y #69 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | delta de #62 R15: constante nueva, fila de home, total cerrado y guarda de #69 R14 |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | delta de #61 R4: fila de home y total cerrado |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | bloque nuevo de R17 |
| `specs/mobile-ui-language/design.md` | registro de las siete claves (§2) |
| `specs/mobile-home-reminders-section/traceability.md` | el implementer rellena la columna Commit |
| `progress/impl_mobile-home-reminders-section.md` | informe del implementer, con §prueba de mutación |

**Ningún fichero de `src/theme/`, `src/utils/`, `src/components/`, `src/app/`,
`src/screens/reminders/`, `src/screens/health/` ni `backend-pet-tracker/` se
toca.** En particular: `src/api/types.ts` es el **único** fichero de `src/api/`
que cambia, y solo para tipar; y `src/app/(tabs)/home.tsx` sigue intacto, que es
parte del candado de rutas delgadas (`design-drift.test.ts:112-134`, `<10`
líneas).

---

## 8. Riesgos y cómo se cierran

| Riesgo | Cómo se cierra |
|---|---|
| Se inventa el dato que falta y se dibuja la barra de comidas | R3 con las dos causas verificadas; R1 cierra la cardinalidad **contando hijos del contenedor**, y la mutación M5 de R19b planta un segundo hijo **sin `testID`** —el hueco exacto por el que #71 se coló— |
| El contador se desplaza un día en una zona negativa | R4 y R5; el `it` fija `TZ='America/Mexico_City'` con el patrón ya verde de #68 R4, y las mutaciones M1 y M2 comprueban que ese `it` vigila de verdad |
| Se reutiliza `reminder-dates.daysUntil` y se importa el defecto | R4 lo prohíbe por nombre; §1 P8 explica por qué; E3 deja el original anotado |
| La sección lee `nextVaccine` de `pets` en vez de `detail` y queda vacía siempre | §1 P2 documenta que la lista pasa `null` fijo; R15 obliga a `detail`; el `it` de R6 usa la fixture del detalle |
| El tipo del cliente inventa `daysLeft` o `date` copiando el mock del Make | R2 fija los tres campos y prohíbe los dos inventados; el `it` de R2 lee el fuente |
| Se pinta un número negativo en producción | R7 con sus tres ramas; la mutación M4 quita la rama negativa |
| El enlace crea un segundo camino a la lista | §0.3 y §1 P5 verifican que hoy hay cero desde la Home; R10 asserta que `'/reminders'` aparece **una** vez en el fuente, y el candado de #71 (`index.test.tsx:1601-1612`) queda verde sin tocar |
| Un `as Href` esconde una ruta que no existe | §3 D6 y R10: sin cast, y el `it` cruza la ruta con los ficheros reales de `src/app/(tabs)/` con `readdirSync` |
| El implementer se para en el candado de longitud del catálogo | R18 lo pone de **primera fila** con el delta exacto. Es la cuarta vez que aparece |
| Se rompe la guarda de cifras tabulares por mover solo uno de sus tres mandos | R18 fila 3 los enumera los tres y dice que se mueven juntos |
| El rojo de un candado nuevo se planta en un mock | R19b lo prohíbe y las ocho mutaciones son de producción (`CHECKPOINTS.md` C4, quinto punto) |
| El typecheck rompe por rutas fantasma | R19: borrar `.expo/types/router.d.ts` antes de empezar. Esta feature toca una ruta |
| Dos gates concurrentes se pisan en el Postgres de docker | R19: `pgrep -f init.sh` antes de lanzar |
| La Home y la pestaña Salud discrepan el día de la dosis y parece un bug | §2 C3 lo documenta y **E1** lo eleva al humano; no es defecto de esta feature |
