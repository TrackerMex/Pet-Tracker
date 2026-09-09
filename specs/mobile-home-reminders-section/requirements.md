---
feature: "mobile-home-reminders-section"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-reminders-section]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, las premisas verificadas y las
> alternativas descartadas; [[../../docs/ui-guidelines|ui-guidelines]] para la
> carta de UI que gobierna todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:425-449` — la sección
> "Recordatorios" de la Home del Figma Make. **El enunciado dice
> `App.tsx:429-451` y el informe de exploración dice `:425-450`: las dos citas
> están mal** ([[design]] §2 C1).
> Informe de origen: `progress/explore_design-gap-vs-make.md` §7 (Bloque 1),
> fechado el 2026-09-04 y desactualizado por siete features.
>
> **Esta feature entrega media sección del diseño, a propósito.** El Make dibuja
> dos filas: la próxima vacuna con los días que faltan, y una **barra de
> progreso de comidas**. La primera entra completa. La segunda **queda fuera**
> y R3 dice por qué, con la causa verificada —que **no** es la que dice el
> enunciado ([[design]] §2 C2)—. Es la decisión central de esta spec y se
> ratifica en §Aprobación.
>
> **Base de medición**: todo delta de esta spec se mide contra el commit base de
> la branch, **`b0ec5a8`** (merge del PR #115, #71). Ningún requisito congela un
> recuento absoluto: se fijan **deltas** y **consistencias internas**. Es la
> séptima vez que se dice en este repo; las anteriores costaron una sesión cada
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

Esta feature tiene tres modos de fallo reales, y los tres ya han costado un
rechazo en este bloque del rediseño: **inventar un dato que el contrato no da**
(la barra de comidas), **desplazar una fecha un día** al parsear la cadena cruda
(el defecto de `weekdayLabel` en #68) y **añadir un segundo camino al mismo
sitio en la misma pantalla** (el defecto que #71 corrigió). §0.1 cierra el
contrato campo a campo, §0.2 cierra la aritmética y §0.3 cierra la navegación.
Todo comprobado contra el árbol en `b0ec5a8`.

| # | Premisa del enunciado o del encargo | Veredicto |
|---|---|---|
| 1 | `nextVaccine` está poblado de verdad; el mapper lo tipa y lo pasa (`pet-profile-response.mapper.ts:43,59,83`) | **Cierta, y las tres líneas son exactas.** Pero **incompleta en algo que decide la implementación**: solo lo puebla `GET /v1/pets/:petId` (`pets.controller.ts:91-100`); `GET /v1/pets` pasa `null` fijo (`:77`). La Home llama a las dos ([[design]] §1 P2) |
| 2 | `nextReminder` y `activitySummary` están hardcodeados a `null` y tipados literalmente `null` (`:45,47,84,85`) | **Cierta y las cuatro líneas son exactas.** Son huecos reservados: `/** null hasta pet-reminders (#16). */` y `/** null hasta activity-summary (#10). */` |
| 3 | En el móvil `nextVaccine` está tipado `unknown` (`src/api/types.ts:72`) | **Cierta y la línea es exacta.** `nextReminder` (`:73`) y `activitySummary` (`:74`) también. El dato llega y el cliente no lo puede consumir sin tiparlo: eso es R2 |
| 4 | La barra de comidas no se puede construir **porque** `nextReminder` y `activitySummary` son `null` | **FALSA la causa, cierta la conclusión.** La barra lee `pet.meals / pet.totalMeals` (`design-src/App.tsx:441-443`), que no son ninguno de esos dos huecos. Las causas reales son otras dos, y son más fuertes (R3, [[design]] §2 C2) |
| 5 | La feature de backend que la desbloquea se llama `pet-profile-summary-slots` | **FALSA**: no existe ninguna feature con ese nombre en `feature_list.json` (el id máximo es 81). Es un nombre propuesto, no un id abierto. Decisión abierta **E2** |
| 6 | `daysLeft` es aritmética de cliente sobre `nextDoseAt` | **Cierta**, y `nextDoseAt` es una **fecha de calendario sin hora**: la columna es `date('next_dose_at')` (`db/schema/health.schema.ts:49`), así que el JSON trae `'YYYY-MM-DD'`. Eso es lo que hace que el parseo por componentes no sea opcional (R4, R5) |
| 7 | Cuidado con la zona horaria: en #68 el candado de `weekdayLabel` costó un rechazo por parsear con `new Date(cadena)` | **Cierta, y el R-id es #68 R4** (`specs/mobile-home-weekly-activity/requirements.md:235-256`). La corrección vive en `weekly-activity-chart.tsx:384-393` y **esta feature no la puede reutilizar**: devuelve el día de la semana, no un contador ([[design]] §3 D3) |
| 8 | Ya existe un `daysUntil` en el repo y conviene reutilizarlo | **Cierta que existe** (`src/utils/reminder-dates.ts:15`) **y falsa que sirva**: es `Math.ceil` sobre una resta de milisegundos, sin alinear a día de calendario — exactamente el defecto de #68. Reutilizarlo importaría el desfase. No se toca y no se usa ([[design]] §2 C4) |
| 9 | Una vacuna vencida (`nextDoseAt` en el pasado) "es el caso que más se ve en producción" | **FALSA para este endpoint.** El lector filtra `gt(petVaccines.nextDoseAt, after)` (`pet-vaccine.drizzle-reader.ts:27`) con `after = new Date().toISOString().slice(0, 10)` (`get-pet.use-case.ts:71-74`): **estrictamente posterior al hoy UTC del servidor**. El backend nunca devuelve una vencida en el momento de la petición. Sigue siendo alcanzable por caché rancia o reloj del dispositivo, y R7 la cubre — pero lo que **sí** se ve en producción es lo contrario ([[design]] §2 C3 y decisión abierta **E1**) |
| 10 | La lista completa va a la pantalla existente, sin ruta nueva; hay `reminders.tsx` y `add-reminder.tsx` y #71 ya puso un tile a `/add-reminder` | **Cierta las tres cosas.** Y **no** queda un tercer camino redundante: §0.3 |
| 11 | La Home ya vive en `src/screens/home/` | **Cierta** desde #68 R15. **No se migra nada** |
| 12 | `tabular-nums` es #62, y hay escala de tres radios | **Ciertas, con los R-id verificados**: cifras tabulares es **#62 R15** (candado en `consistency-classnames.test.ts:334-370`, con **dos** mandos que se mueven juntos); la escala de tres radios es **#62 R4** (`:149-178`) y la esquina continua es **#62 R14** (`:269-332`) |
| 13 | No hay candado global de hex | **Cierta, confirmada por cuarta vez**: `design-drift.test.ts` persigue hexadecimales solo sobre **listas nominales de ficheros** —`R9` (`:89`), `R11` (`:162`), `#68 R18` (`:189`), `#69 R13` (`:235`) y `#71 R13` (`:256`)—. R17 añade el suyo |
| 14 | `language-provider.test.tsx:41` cierra la longitud del catálogo y se omitió en #68 y #69 | **Cierta.** Hoy vale `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4)`. R18 la enumera **como primera fila** |
| 15 | *(premisa nueva, del propio proceso)* "la Home es el primer sitio donde se ve la próxima vacuna" | **FALSA**: `src/app/(tabs)/health.tsx:144` ya pinta `next-vaccine-card` con icono `Syringe`, nombre y fecha. No es duplicación —es otra pantalla y otra fuente— pero **las dos pueden discrepar el día de la dosis** ([[design]] §2 C3) |

### 0.1 Qué da el contrato y qué no, campo a campo

`PetProfileResponse` (`backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:18-51`) y su
consumo en el móvil (`mobile-pet-tracker/src/api/types.ts:52-77`):

| Campo del perfil | Backend | Móvil hoy | ¿Lo usa esta feature? |
|---|---|---|---|
| `nextVaccine` | `NextPetVaccine \| null` (`:43`), **poblado** en el detalle (`pets.controller.ts:100`) | `unknown` (`types.ts:72`) | **Sí**: R2 lo tipa, R6 lo pinta |
| `nextReminder` | `null` literal (`:45`, `:84`) | `unknown` (`:73`) | **No.** Se queda como está (R2) |
| `activitySummary` | `null` literal (`:47`, `:85`) | `unknown` (`:74`) | **No.** Se queda como está (R2) |

`NextPetVaccine` tiene **exactamente tres campos** y ninguno más
(`backend-pet-tracker/src/modules/pets/domain/ports/pet-vaccine-reader.ts:3-7`):

```ts
export interface NextPetVaccine {
  id: string;
  name: string;
  nextDoseAt: string;
}
```

**No trae `date` formateada ni `daysLeft`**, que es lo que el mock del Make
inventa (`design-src/App.tsx:34`: `{ name, date, daysLeft }`). Los dos se
derivan en cliente: la fecha con R6 y el contador con R4.

### 0.2 De dónde salen los días, y por qué el parseo no es opcional

`nextDoseAt` viene de `date('next_dose_at')` (`db/schema/health.schema.ts:49`),
un tipo **fecha de calendario sin hora ni zona**: el JSON trae `'2026-09-15'`.
Bajo `TZ=America/Mexico_City`, `new Date('2026-09-15')` es medianoche **UTC**, o
sea las 18:00 del día **14** en local: `getDate()` devuelve `14`. Es el mismo
desfase de un día que #68 R4 documentó midiéndolo.

El filtro del backend acota el rango de lo que puede llegar, pero **no** cierra
el caso: `gt(nextDoseAt, hoyUTC)` (`pet-vaccine.drizzle-reader.ts:27`) garantiza
que en el instante de la petición la fecha es futura en UTC, y la Home refresca
al enfocar (`useFocusEffect`, `src/screens/home/index.tsx:145-150`). Quedan dos
caminos vivos a un contador `≤ 0`: una pantalla montada que **cruza la
medianoche local** sin volver a enfocarse, y un **reloj de dispositivo
adelantado** respecto al servidor. R7 los cubre; ninguno de los dos justifica
pintar un número negativo.

### 0.3 La navegación: dos destinos distintos, no dos caminos al mismo

| Destino | Fichero de ruta | Quién navega hoy | Qué añade esta feature |
|---|---|---|---|
| `/reminders` (**lista**) | `src/app/(tabs)/reminders.tsx` → `src/screens/reminders/index.tsx` | **solo** `profile/index.tsx:328` (`reminders-link`). La Home tiene **cero** | **el enlace de R10**, primer acceso desde la Home |
| `/add-reminder` (**alta**) | `src/app/(tabs)/add-reminder.tsx` → `src/screens/add-reminder/index.tsx` | `reminders/index.tsx:149` y el tile `quick-action-reminder` de #71 (`home/index.tsx:57`) | **nada** |

Las dos rutas ya existen y **ninguna se crea**. Que la Home tenga a la vez un
tile a `/add-reminder` y un enlace a `/reminders` **no** es el defecto de #71:
son **acciones distintas** —crear un recordatorio y consultar la lista—, y es
precisamente el reparto que #71 dejó escrito al descartar un cuarto tile a
`/reminders` (`specs/mobile-home-quick-actions/requirements.md` §Fuera de
alcance, primera entrada). El **único** camino a `/reminders` desde la Home
sigue siendo uno: el de R10.

`/reminders` **typechequea sin `as Href`** ([[design]] §3 D6): el cast que usan
`profile/index.tsx:328` y `add-reminder/index.tsx:317` es un ensanchamiento sin
efecto, y `home/index.test.tsx:1587` ya rechaza el cast en el camino de #71.

---

## Requisitos

### R1 — La sección existe: rótulo, enlace a la lista y **un solo** hijo en el cuerpo

- **R1**: WHEN la Home renderiza `home-content` con una mascota seleccionada
  THE SYSTEM SHALL renderizar una `View` con `testID="reminders-section"` y
  `className="gap-3"` que contenga, en este orden, **exactamente dos** hijos
  directos:
  1. una fila de cabecera (`className="flex-row items-center justify-between"`)
     con el rótulo `testID="reminders-section-title"` y el enlace
     `testID="reminders-see-all"` (R10);
  2. un cuerpo `testID="reminders-section-body"` con `className="gap-2"`;

  AND el rótulo SHALL ser un `Text` con `t('home.reminders')` y la receta
  tipográfica `className="text-base font-bold text-foreground"` —la misma que
  ya usa `summary-card-title` (`home/index.tsx:238-240`) para el otro título de
  sección de esta pantalla, y la que el Make pone aquí
  (`design-src/App.tsx:427`, `text-sm font-bold text-foreground`)—;
  AND **`reminders-section-body` SHALL tener como máximo un hijo directo en
  cualquier estado**, y **exactamente uno** cuando `detail.data` es `undefined`
  (el esqueleto de R9) o `kind === 'ok'` (la fila de R6 o el estado vacío de
  R8), y **cero** cuando `detail.data` es de error (R9);
  AND la sección SHALL ser una `View`, **no** una `Card`: la tarjeta la lleva
  cada fila del cuerpo, que es lo que hace el Make
  (`design-src/App.tsx:432`) y lo que evita una tarjeta dentro de otra.
  - **La cardinalidad se cierra contando hijos del contenedor, nunca
    coincidencias de `testID`.** Es la lección literal de #71: allí pasar de
    lista blanca a prefijo seguía dejando entrar un elemento sin `testID`
    (`specs/mobile-home-quick-actions/traceability.md`, corrección O7). Aquí el
    hijo que podría colarse tiene nombre y apellidos: la **barra de comidas**
    que R3 deja fuera. Un segundo hijo en el cuerpo tiene que poner la suite
    roja aunque no declare `testID` alguno.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#70 R1: la Home dibuja la sección de recordatorios')`, con un
    `it` que asserta los dos hijos de `reminders-section` y el rótulo, y un `it`
    que asserta `getByTestId('reminders-section-body').children` con longitud
    `1` en el escenario cargado, `1` en el escenario con esqueleto y `0` en el
    de error.

### R2 — El cliente se tipa contra el contrato real, sin inventar campos

- **R2**: WHEN esta feature toque `mobile-pet-tracker/src/api/types.ts` THE
  SYSTEM SHALL declarar una interfaz con **exactamente los tres campos** que
  `NextPetVaccine` tiene en el backend (§0.1), y **ninguno más**:

  ```ts
  export interface NextVaccine {
    id: string;
    name: string;
    nextDoseAt: string;
  }
  ```

  AND SHALL cambiar `nextVaccine: unknown` (`types.ts:72`) por
  `nextVaccine: NextVaccine | null`;
  AND THE SYSTEM SHALL **dejar `nextReminder` y `activitySummary` tal como
  están, en `unknown`** (`:73-74`), sin tiparlos, sin renombrarlos y sin
  borrarlos: son huecos reservados del contrato y **no tiparlos es la prueba
  por escrito de que esta feature no los consume** (R3);
  AND THE SYSTEM SHALL **no** añadir `date` ni `daysLeft` a la interfaz —los dos
  los inventa el mock del Make (`design-src/App.tsx:34`) y los dos se derivan en
  cliente (R4, R6)—, y **no** tocar ningún fichero de `backend-pet-tracker/`;
  AND THE SYSTEM SHALL **no** añadir validación en tiempo de ejecución: `getPet`
  comprueba solo `id` y `name` (`src/api/pets.ts:48-56`) y esta feature no
  cambia esa política. La guarda de render de R6 (`nextVaccine ? … : …`) cubre
  tanto `null` como un campo ausente.
  - **La fixture existente no se rompe**: `makePet` (`index.test.tsx:116-143`)
    ya declara `nextVaccine: null` (`:138`), que satisface el tipo nuevo.
  - Test: `src/screens/home/index.test.tsx` :: mismo `describe` que R1 →
    `it('tipa nextVaccine con los tres campos del contrato y ninguno más')`,
    que lee `src/api/types.ts` con `readFileSync` y asserta la presencia de los
    tres campos, la ausencia de `daysLeft` y de `date` dentro del bloque
    `NextVaccine`, y que `nextReminder` y `activitySummary` **siguen** en
    `unknown`; más el `tsc --noEmit` de R19, que es lo que prueba de verdad que
    el tipo compila contra el uso de R6.

### R3 — La barra de comidas queda **fuera**, y la razón verificada no es la del enunciado

- **R3**: WHEN esta feature implemente la sección THE SYSTEM SHALL **no**
  renderizar la barra de progreso de comidas que el Make dibuja en esta misma
  sección (`design-src/App.tsx:438-446`), y SHALL **no** inventar, estimar ni
  derivar el dato que le falta;
  AND THE SYSTEM SHALL **no** añadir ninguna llamada a la API de nutrición ni
  leer `mealsPerDay` desde la Home;
  AND la exclusión SHALL apoyarse en **estas dos causas verificadas**, no en la
  que dice el enunciado:

  | # | Causa | Verificación |
  |---|---|---|
  | 1 | **No existe ningún registro de comida servida** en el backend. `food.tsx:185` finge el estado comparando `mealTime <= hhmm` contra el reloj local del teléfono; no hay tabla, ni endpoint, ni columna | `src/app/(tabs)/food.tsx:185`; `progress/explore_design-gap-vs-make.md:432` |
  | 2 | El denominador `totalMeals` existe como `mealsPerDay` pero vive en el **plan de nutrición**, no en `PetProfile` | `src/api/types.ts:184`; `PetProfileResponse` (§0.1) no lo tiene |

  AND THE SYSTEM SHALL **no** justificar la exclusión con `nextReminder` ni con
  `activitySummary`: la barra no lee ninguno de los dos (§0 premisa 4), así que
  esa causa es **falsa** y repetirla dejaría escrito en la spec un hecho que no
  se sostiene —que es exactamente lo que este bloque del rediseño lleva siete
  features corrigiendo—.
  - **Los dos huecos `null` sí importan, pero para otra cosa**: son los que
    impedirían mostrar el *próximo recordatorio genérico* (el de `nextReminder`)
    y el *resumen de actividad del perfil* (`activitySummary`) sin llamadas
    extra. Ninguno de los dos entra aquí, y R2 los deja intactos como prueba.
  - **Qué hace falta para que entre**, para que la feature futura no tenga que
    redescubrirlo: una tabla y un endpoint de comida servida, más el hueco
    correspondiente en el perfil. Es trabajo de **backend** y va con id propio;
    el nombre `pet-profile-summary-slots` que da el enunciado **no corresponde a
    ninguna feature existente** (§0 premisa 5). Decisión abierta **E2**.
  - Test: mismo `describe` que R1 →
    `it('no dibuja la barra de comidas ni pide el plan de nutrición')`, que
    asserta que `reminders-section-body` tiene **un solo** hijo directo con el
    perfil cargado (R1), que no hay ningún nodo cuyo texto contenga `'/'` entre
    dos cifras dentro de la sección, y que el fuente de
    `src/screens/home/index.tsx` no importa nada de `../../api/nutrition`.

### R4 — Los días que faltan son aritmética de **calendario**, en un helper propio y puro

- **R4**: WHEN se calcule cuántos días faltan para `nextDoseAt` THE SYSTEM SHALL
  hacerlo con una función pura exportada desde
  `mobile-pet-tracker/src/screens/home/format.ts` con **exactamente** esta firma:

  ```ts
  export function calendarDaysUntil(date: string, now: Date): number;
  ```

  AND la implementación SHALL **descomponer la cadena `'YYYY-MM-DD'` en año, mes
  y día** y comparar **medianoches normalizadas a UTC** en los dos lados
  —`Date.UTC(year, month - 1, day)` para el objetivo y
  `Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())` para hoy—,
  dividiendo por `86_400_000`;
  AND THE SYSTEM SHALL **no** pasar nunca la cadena cruda a `new Date(...)` ni a
  `Date.parse(...)`, y **no** restar instantes sin normalizar a día de
  calendario;
  AND `now` SHALL ser un **parámetro**, nunca `new Date()` leído dentro de la
  función, para que el test pueda fijarlo sin tocar el reloj del runner;
  AND THE SYSTEM SHALL **no** reutilizar `daysUntil` de
  `src/utils/reminder-dates.ts:15` y **no** modificarlo: es `Math.ceil` sobre
  una resta de milisegundos, lo usan la píldora `pill-week` y el contador por
  fila de la pantalla de recordatorios (`reminders/index.tsx:235,275`), y
  cambiarlo sería cambiar la conducta de una pantalla que esta feature no toca
  ([[design]] §3 D3 y decisión abierta **E3**).
  - **Por qué normalizar a UTC y no a local**: dos medianoches UTC distan
    siempre un múltiplo exacto de 86 400 000 ms, así que el resultado es entero
    y **inmune al horario de verano**. Normalizar a local haría que un salto de
    DST entre las dos fechas devolviera 4,96 días.
  - Test: `src/screens/home/format.test.ts` ::
    `describe('#70 R4: calendarDaysUntil cuenta días de calendario')`, con los
    casos futuro (`'2026-09-15'` desde el 10 → `5`), mañana (`1`), hoy (`0`) y
    pasado (`-2`); más el candado de zona horaria de R5.

### R5 — La zona horaria no desplaza el resultado, y el candado lo mata

- **R5**: WHEN el proceso corre en una zona horaria de **offset negativo** THE
  SYSTEM SHALL devolver, para la misma fecha objetivo y el mismo día de
  calendario local, **el mismo número** que devolvería en UTC;
  AND THE SYSTEM SHALL devolver **el mismo número a cualquier hora del mismo día
  local**: `calendarDaysUntil` depende del **día** de `now`, nunca de su hora;
  AND la misma disciplina de parseo SHALL aplicarse a la fecha visible de R6:
  `fmtDate` descompone la cadena en componentes y **no** pasa la cadena cruda a
  `new Date(...)`.
  - **Motivo medido, no estimado.** Bajo `TZ='America/Mexico_City'`, con
    `now = new Date(2026, 8, 10, 23, 30)` (23:30 del 10 de septiembre, local) y
    objetivo `'2026-09-15'`:
    - la implementación correcta devuelve **5**;
    - `Math.ceil((Date.parse('2026-09-15') - now.getTime()) / 86_400_000)`
      devuelve **4** —es lo que devolvería reutilizar `reminder-dates.daysUntil`
      (R4)—;
    - una implementación que saque los componentes de `new Date('2026-09-15')`
      lee día **14** y devuelve **4**.

    Bajo `TZ='UTC'` las tres devuelven 5, así que **este desfase no se ve en un
    runner en UTC**: sin fijar la zona el candado no vigila nada. Es literalmente
    lo que pasó en #68 y costó un rechazo.
  - **El mecanismo está probado en este repo**: #68 R4
    (`weekly-activity-chart.test.tsx`) ya guarda `process.env.TZ`, lo fija a
    `'America/Mexico_City'`, llama al helper y lo restaura en un `finally`, y
    está verde. Se usa el mismo patrón.
  - Test: mismo `describe` que R4 →
    `it('no se desplaza un día en una zona horaria negativa')`, con el par
    `new Date(2026, 8, 10, 23, 30)` → `5` y `new Date(2026, 8, 10, 0, 30)` → `5`
    bajo `TZ='America/Mexico_City'`, y la restauración en `finally`; más
    `it('formatea la fecha visible sin desplazarla')`, que espera
    `fmtDate('2026-09-15', 'es-MX')` con el día **15**, no el 14. **Éstos son
    los únicos candados que matan la mutación M2 de R19b**: si con esa mutación
    plantada la suite sigue verde, están mal escritos y se arreglan **antes** de
    seguir.

### R6 — La fila de la próxima vacuna: qué nodo muestra qué dato, y cuál no muestra ninguno

- **R6**: WHEN `detail.data.kind === 'ok'` y `detail.data.pet.nextVaccine` no es
  nulo THE SYSTEM SHALL renderizar en `reminders-section-body` **una** `Card`
  compartida (`src/components/card.tsx`) con `testID="reminders-next-vaccine"` y
  `className="flex-row items-center gap-3"`, que ligue **cada dato a un solo
  nodo** según esta tabla, y ningún nodo a un dato de otra fila:

  | Nodo | `testID` | Qué muestra | Receta |
  |---|---|---|---|
  | disco de icono | — | `Syringe` de `reicon-react-native`, `size={20}` (R13) | `size-9 items-center justify-center rounded-full` + `CATEGORY_SLOTS.blue.surface` |
  | nombre | `reminders-next-vaccine-name` | **`nextVaccine.name`**, tal cual | `text-sm font-semibold text-foreground` |
  | fecha | `reminders-next-vaccine-date` | **`fmtDate(nextVaccine.nextDoseAt, locale)`** (R5) | `text-xs font-normal text-muted` |
  | contador | `reminders-next-vaccine-days` | **el texto de R7**, derivado de `calendarDaysUntil(nextVaccine.nextDoseAt, new Date())` | `rounded-full px-2.5 py-1 text-xs font-bold` + `CATEGORY_SLOTS.amber.surface` + `CATEGORY_SLOTS.amber.ink`, con `style={TABULAR_NUMS}` (R12) |

  AND THE SYSTEM SHALL **no** renderizar `nextVaccine.id` en ningún nodo: es el
  tercer campo del contrato y es un UUID, no copy;
  AND la fila SHALL ser **no pulsable**: sin `onPress`, sin
  `accessibilityRole="button"` y sin navegación. La `Card` compartida solo se
  vuelve `Pressable` si recibe `onPress` (`card.tsx:31-40`), así que basta con
  no pasarlo. Llevarla a `/health` añadiría desde la Home un camino a una
  **pestaña**, que es exactamente el defecto que #71 R3 eliminó;
  AND `fmtDate(date: string, locale: string): string` SHALL exportarse desde
  `src/screens/home/format.ts`, junto a `fmtKg` y compañía, formateando con
  `toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`
  sobre la fecha descompuesta por componentes (R5), y con el `locale` de
  `useLocale()` —`'es-MX'` o `'en-US'`, carta §Dirección de arte 6—.
  - **El dato que muestra es la dimensión que más se olvida**, y es la lección
    literal de #69: allí el candado vigilaba icono y etiqueta y **no** el valor.
    Por eso la fixture de test usa tres valores mutuamente distinguibles —nombre
    `'Antirrábica'`, fecha `'2026-09-15'`, contador `5`— y el test los observa
    **con `within(row)`**, uno por nodo: intercambiar nombre y fecha, o pintar
    el contador donde va la fecha, tiene que poner la suite roja.
  - Test: mismo `describe` que R1 →
    `it('liga nombre, fecha y contador a su nodo y a ninguno más')`, que con
    `within(getByTestId('reminders-next-vaccine'))` asserta los tres `testID`
    con su texto exacto, que ninguno contiene el texto de otro, y que el `id`
    `'vac-9'` de la fixture **no** aparece en el árbol de la sección; más
    `it('no hace pulsable la fila de la vacuna')`, que asserta ausencia de
    `accessibilityRole="button"` en la fila y que pulsarla no llama a
    `mockRouter.push`.

### R7 — Tres estados del contador, y ninguno pinta un número negativo

- **R7**: WHEN se resuelve el texto del contador THE SYSTEM SHALL aplicar
  **estas tres ramas y ninguna otra**, sobre el resultado de
  `calendarDaysUntil`:

  | Rama | Texto visible | Nombre accesible |
  |---|---|---|
  | `days > 0` | `t('home.nextVaccineDays', { days })` → `5 d` | `t('home.nextVaccineDaysLeft', { days })` → `Faltan 5 días` |
  | `days === 0` | `t('home.nextVaccineToday')` → `Hoy` | el mismo texto |
  | `days < 0` | `t('home.nextVaccineOverdue')` → `Vencida` | el mismo texto |

  AND THE SYSTEM SHALL **no** renderizar nunca un número negativo ni un signo
  `-` en el contador, y **no** truncar la rama negativa a `0` —que diría "hoy"
  de una dosis que pasó hace tres días, y la carta §Dirección de arte 5 prohíbe
  perder información por parecerse al diseño—;
  AND THE SYSTEM SHALL **no** ocultar la fila cuando la dosis está vencida: caer
  al estado vacío de R8 afirmaría que no hay vacuna próxima, que es falso;
  AND las tres ramas SHALL resolverse en una función de módulo
  `vaccineCountdown(days, t): { text: string; label: string }` declarada junto a
  `fmtLastSeen` en `src/screens/home/index.tsx`, de modo que **el texto visible y
  el nombre accesible salgan del mismo sitio** y no puedan divergir.
  - **Por qué las tres ramas existen aunque el backend no mande vencidas**: el
    filtro `gt(nextDoseAt, hoyUTC)` (§0.2) las descarta **en el instante de la
    petición**, no después. Una Home montada que cruza la medianoche local sin
    reenfocarse, o un reloj de dispositivo adelantado, producen `0` y negativos
    con datos perfectamente válidos. Son dos ternarios; el coste de no tenerlos
    es pintar `-3 d` en producción.
  - **`days === 0` es además el borde donde la Home y la pestaña Salud
    discrepan**, y no es un defecto de esta feature: `health.tsx:71` filtra
    `nextDoseAt >= hoy local` y el backend filtra `> hoy UTC`, así que el día de
    la dosis la pestaña Salud la enseña y el perfil ya no. Decisión abierta
    **E1**; esta spec **no** toca el backend.
  - Test: mismo `describe` que R1 →
    `it('resuelve las tres ramas del contador')`, con tres renders —dosis a 5
    días, dosis hoy, dosis hace 2 días— fijando el reloj con
    `jest.useFakeTimers().setSystemTime(...)`, que asserta el texto visible y el
    `accessibilityLabel` de cada rama, y que **en ninguna** el texto del
    contador contiene `'-'`.

### R8 — Sin vacuna próxima, un estado vacío diseñado, no un hueco

- **R8**: WHEN `detail.data.kind === 'ok'` y `detail.data.pet.nextVaccine` es
  nulo THE SYSTEM SHALL renderizar en `reminders-section-body` **una** `Card`
  compartida con `testID="reminders-none-upcoming"` y la misma anatomía de fila
  que R6 —disco de icono a la izquierda, texto a la derecha— para que la sección
  **no cambie de forma** al vaciarse:

  | Nodo | Qué muestra | Receta |
  |---|---|---|
  | disco de icono | `Syringe`, `size={20}`, tinta `muted` | `size-9 items-center justify-center rounded-full` + `CATEGORY_SLOTS.neutral.surface` (= `bg-default`) |
  | texto | `t('home.noUpcomingVaccine')` | `flex-1 text-sm font-normal text-muted` |

  AND el estado vacío SHALL **no** renderizar contador, ni nombre, ni fecha, ni
  ninguno de los tres `testID` de R6;
  AND la sección SHALL seguir mostrando su rótulo y su enlace a la lista: sin
  vacuna próxima el usuario **sigue** pudiendo tener recordatorios, y el enlace
  es la forma de verlos (R10).
  - **Por qué el hueco neutral y no el azul**: el azul es el hueco de la
    categoría *vacunación* (carta §Dirección de arte 1) y aquí no hay ninguna.
    `CATEGORY_SLOTS.neutral` resuelve a `bg-default` / `text-muted`, que no son
    clases `bg-category-*` y por tanto tampoco tocan el candado #64 R9.
  - Test: mismo `describe` que R1 →
    `it('dibuja un estado vacío con forma de fila cuando no hay vacuna')`, que
    con `nextVaccine: null` asserta `reminders-none-upcoming` presente con su
    texto, `reminders-next-vaccine` ausente, los tres `testID` de R6 ausentes, y
    que `reminders-section-title` y `reminders-see-all` **siguen** presentes.

### R9 — Los estados de `detail`: esqueleto al cargar, silencio al fallar

- **R9**: WHILE `detail.data === undefined` THE SYSTEM SHALL renderizar en el
  cuerpo un `Skeleton` de heroui con `testID="reminders-section-skeleton"` y
  `className="h-16 w-full rounded-card"` —dimensionado como la fila que
  sustituye y con **su** radio, corolario de #62 R14—, y **ningún** otro hijo;
  AND IF `detail.data.kind` es `'error'`, `'unreachable'`, `'missing-config'` o
  `'unauthorized'` THEN THE SYSTEM SHALL dejar el cuerpo **vacío**, sin mensaje
  de error propio y sin botón de reintento;
  AND en ese caso la cabecera de la sección —rótulo y enlace— SHALL seguir
  renderizándose.
  - **Por qué no hay error propio.** La Home ya monta `pet-hero-error` con su
    `pet-hero-retry` para exactamente el mismo fallo de la misma petición
    (`home/index.tsx:225-236`), justo arriba en el mismo `home-content`. Un
    segundo mensaje sería el mismo fallo dicho dos veces en una pantalla.
  - **Por qué la cabecera sobrevive al error.** La pantalla de recordatorios
    tiene su propia petición (`listReminders`) y no depende del perfil: el
    enlace sigue siendo útil justo cuando el perfil no carga. Es la única parte
    de la sección que no depende de `detail`.
  - Test: mismo `describe` que R1 →
    `it('esqueletiza mientras carga y calla cuando el perfil falla')`, con dos
    renders —`pending()` y `{ kind: 'error' }`— que assertan el esqueleto y su
    clase en el primero, el cuerpo con **cero** hijos en el segundo, la ausencia
    de cualquier `testID` de sección terminado en `-error` o `-retry` dentro de
    `reminders-section` en los dos, y `reminders-see-all` presente en los dos.

### R10 — "Ver todos" navega a la lista existente, sin ruta nueva y sin segundo camino

- **R10**: WHEN el usuario pulsa `reminders-see-all` THE SYSTEM SHALL llamar a
  `router.push('/reminders')` —**la lista**, servida por
  `src/app/(tabs)/reminders.tsx` → `src/screens/reminders/index.tsx` (§0.3)— y a
  ninguna otra ruta;
  AND THE SYSTEM SHALL escribir la ruta **sin `as Href`** y sin importar `Href`:
  `/reminders` typechequea sola ([[design]] §3 D6) y el repo prefiere el camino
  sin cast en código nuevo;
  AND THE SYSTEM SHALL **no** crear ningún fichero de ruta en `src/app/`, **no**
  registrar ninguna `Tabs.Screen` nueva y **no** tocar
  `src/components/floating-tab-bar.tsx`;
  AND el control SHALL ser un `Pressable` con `accessibilityRole="button"`,
  `className="min-h-11 justify-center"` (44 pt, la receta que #71 R6 ya usa en
  esta pantalla) y un `Text` hijo con
  `className="text-xs font-semibold text-accent-strong"` y
  `t('home.remindersSeeAll')`;
  AND THE SYSTEM SHALL **no** añadir ningún glifo tipográfico —`›`, `→`— junto
  al texto: el candado #62 R7 (`consistency-classnames.test.ts:194-196`) exige
  que `filesMatching(/[←›]/)` sea `[]` en todo el árbol.
  - **Ésta es la feature que rompe el invariante de #46/#61/#62** ("cero
    navegación nueva"), y lo rompe **una vez**: un destino, ya existente,
    alcanzado hoy solo desde Perfil (§0.3). No es un tercer camino: el tile
    `quick-action-reminder` de #71 va al **alta** (`/add-reminder`) y éste a la
    **lista** (`/reminders`), y #71 dejó por escrito que el enlace a la lista lo
    pone esta feature.
  - **El acento va como tinta, no como fondo**, que es la regla mecánica de la
    carta §Decisiones fijas 11: `text-accent-strong`, nunca `text-accent` —que
    el candado #61 R4 rechaza en cualquier fuente
    (`legibility-classnames.test.ts:141-143`)—. El delta del inventario está en
    R18 fila 4.
  - Test: mismo `describe` que R1 →
    `it('lleva a la lista de recordatorios existente')`, que pulsa
    `reminders-see-all` y espera `mockRouter.push` llamado **una vez** con
    `'/reminders'`, que cruza esa ruta con los ficheros reales de
    `src/app/(tabs)/` leídos con `readdirSync` —el helper `appRoutes` ya existe
    en `index.test.tsx:42-57`—, y que el fuente no contiene `'/reminders' as Href`
    ni un `import { ... Href ... }`; más
    `it('no añade un segundo camino a la lista desde la Home')`, que asserta que
    `'/reminders'` aparece **exactamente una vez** en
    `src/screens/home/index.tsx` y que el bloque `QUICK_ACTIONS` sigue sin
    contenerlo —el candado de #71 (`index.test.tsx:1601-1612`) queda **verde y
    sin tocar**—.

### R11 — La sección se anuncia por partes, y el contador abreviado se expande

- **R11**: WHEN un lector de pantalla recorre la sección THE SYSTEM SHALL dejar
  que anuncie el rótulo, un **botón** (el enlace de R10) y el contenido de la
  fila por separado;
  AND THE SYSTEM SHALL **no** declarar `accessible` ni `accessibilityLabel` en
  `reminders-section` ni en `reminders-section-body`, que colapsarían la sección
  en un nodo único —el mismo defecto que #68 D5 documentó para la gráfica, #69
  R12 evitó para la tira y #71 R9 evitó para la rejilla—;
  AND `reminders-next-vaccine-days` SHALL declarar `accessibilityLabel` con el
  texto expandido de R7, porque su texto visible es una **abreviatura** (`5 d`)
  que un lector de pantalla no puede desplegar solo;
  AND el nombre y la fecha SHALL bastar con su texto visible: no se añade
  `accessibilityLabel` redundante;
  AND THE SYSTEM SHALL **no** dar `accessibilityRole="button"` a la fila de R6
  ni al estado vacío de R8: no son pulsables (R6).
  - Test: mismo `describe` que R1 →
    `it('anuncia el enlace como botón y expande la abreviatura del contador')`,
    que asserta `accessibilityRole` `'button'` solo en `reminders-see-all`, el
    `accessibilityLabel` del contador en las tres ramas de R7, y que ni
    `reminders-section` ni `reminders-section-body` declaran `accessible` o
    `accessibilityLabel`.

### R12 — Estilo: `Card` compartido, escala de radios, tinta de #64 y cifras tabulares

- **R12**: WHEN se renderice cualquier superficie de esta sección THE SYSTEM
  SHALL usar el **`Card` compartido** de `src/components/card.tsx` para las dos
  filas (R6, R8), que ya trae `rounded-card`, el borde, el fondo y
  `CONTINUOUS_CORNER`; y SHALL **no** repetir esas clases a mano ni envolver el
  `Card` para añadirle la esquina;
  AND SHALL usar `rounded-full` para el disco de icono y para el contador, que
  son **cápsulas** y por tanto **no** llevan `style={CONTINUOUS_CORNER}` (#62
  R14 asserta que ninguna etiqueta con esa constante lleva `rounded-full`);
  AND SHALL **no** usar `rounded-2xl` —lo que trae el Make
  (`design-src/App.tsx:432`)— ni `rounded-lg`, `rounded-md` o `rounded-sm`, que
  #62 R4 prohíbe en `mobile-pet-tracker/src/`;
  AND SHALL tomar superficie y tinta de `CATEGORY_SLOTS`
  (`src/utils/category-palette.ts`) con los huecos de R6 y R8, y SHALL **no**
  escribir ni interpolar en `src/screens/home/index.tsx` ninguna cadena
  `bg-category-…` ni `text-category-…` —lo prohíbe el candado #64 R9
  (`consistency-classnames.test.ts:372-433`), que exige que esas clases vivan
  **solo** en `category-palette.ts`—;
  AND SHALL resolver el color del icono de R6 con `useThemeColors`, **añadiendo
  `'category-blue-strong'` a la llamada que la Home ya hace**
  (`home/index.tsx:91-96`) en vez de abrir una segunda; y SHALL **no** pedir
  `'accent'` en esa lista, que el candado #61 R4
  (`legibility-classnames.test.ts:145-149`) rechaza;
  AND el contador SHALL declarar `style={TABULAR_NUMS}` de
  `src/theme/native-styles.ts` (#62 R15), porque es el único nodo de la sección
  que pinta una cifra; el nombre, la fecha y el texto vacío **no**;
  AND SHALL mantener **cero** hex, **cero** clases arbitrarias `[...]`, **cero**
  `StyleSheet` y **cero** shadow/elevation legacy en todos sus ficheros (carta
  §Decisiones fijas 3).
  - **Contrastes: no se recalculan, se heredan.** Los pares que esta sección usa
    —azul sobre su superficie, ámbar sobre la suya— son **exactamente** los que
    #71 §4 calculó con el método de #61: azul **4,75 / 4,81** y ámbar
    **4,70 / 4,78** (claro / oscuro), los dos por encima de 4,5 en los dos
    temas. `text-foreground` y `text-muted` sobre `bg-surface` son los pares que
    toda la app ya usa. **No se añade ni se cambia ningún token** de
    `src/theme/global.css`.
  - **Por qué ámbar para el contador y azul para el icono**: son dos roles
    distintos y la sección los separa a propósito —el azul dice **qué es**
    (vacunación, carta §Dirección de arte 1) y el ámbar dice **cuándo es**
    (urgencia), que es además el color que el Make le da a esa píldora
    (`design-src/App.tsx:435`, `#FFF7ED` / `#C2410C`)—.
  - Test: mismo `describe` que R1 →
    `it('viste la sección con el Card compartido y los tokens')`, que asserta la
    clase del contador (fondo y tinta categóricos resueltos), la del disco, la
    presencia de `TABULAR_NUMS` en el contador y su ausencia en nombre y fecha;
    más los candados heredados **en verde y sin tocar** —#64 R9 (`:404`), #62 R4
    (`:150-155`)— y los deltas declarados de #62 R15 y #61 R4 (R18).

### R13 — Icono real de `reicon`, cero emoji, y el mismo glifo que ya nombra el concepto

- **R13**: WHEN se renderice el icono de la fila o del estado vacío THE SYSTEM
  SHALL usar el componente **`Syringe`** de `reicon-react-native` con
  `size={20}` —verificado presente en
  `node_modules/reicon-react-native/index.d.ts`—;
  AND THE SYSTEM SHALL **no** usar el emoji `💉` que trae el Make
  (`design-src/App.tsx:433`) ni el que trae `REMINDER_TYPE_META`
  (`src/utils/reminder-meta.ts`), ni ningún glifo tipográfico como icono, que es
  lo que prohíbe #62 R7;
  AND THE SYSTEM SHALL **no** instalar ninguna dependencia: `reicon-react-native`
  ya lo es, y el veto **nominal** a `expo-linear-gradient` sigue vivo;
  AND el doble de `reicon` de `src/screens/home/index.test.tsx:82-102` SHALL
  añadir una entrada `Syringe: mockIcon('icon-syringe')` **siguiendo la
  convención de nombre por icono** que #71 R7 dejó establecida, sin renombrar ni
  eliminar ninguna de las seis que ya hay.
  - **`Syringe` se repite a propósito con la pestaña Salud**, que ya lo usa para
    el mismo concepto en `next-vaccine-card` (`health.tsx:144-161`). Es el mismo
    argumento de #71 R7 con `Weight`: dos glifos distintos para un solo concepto
    en una misma app es peor que uno repetido. Y **no** coincide con ninguno de
    los cinco glifos de la barra de pestañas —`Home`, `Map`, `HeartPulse`,
    `ForkKnife`, `Profile` (`floating-tab-bar.tsx:49-54`)—, que es la
    coincidencia que sí importa.
  - **`icon-syringe` es único en el árbol de la Home**: ningún otro nodo de esta
    pantalla usa `Syringe`. Aun así el test de R6 observa **con `within(row)`**,
    porque la fila y el estado vacío nunca coexisten pero el hábito es el que
    #71 tuvo que aprender por corrección.
  - Test: mismo `describe` que R1 →
    `it('usa el icono de reicon y ningún emoji')`, que lee el fuente con
    `readFileSync` y asserta el import de `Syringe`, sus dos usos con
    `size={20}`, y la ausencia de `💉` en `src/screens/home/index.tsx`.

### R14 — Dónde se ancla la sección, y cuándo aparece

- **R14**: WHEN se renderiza `home-content` THE SYSTEM SHALL colocar
  `reminders-section` **después del bloque de actividad semanal y antes de
  `last-position-card`**, de modo que el orden completo quede:

  `summary-card` → `collar-card` → `quick-actions` → `weekly-activity-card` →
  **`reminders-section`** → `last-position-card`;

  AND THE SYSTEM SHALL **no** tocar `src/screens/home/weekly-activity-chart.tsx`
  (#68), ni la tira de cuatro celdas de `summary-card` (#69), ni la constante
  `QUICK_ACTIONS` ni la sección `quick-actions` (#71): la sección es un
  **hermano nuevo** de los tres y no mueve ninguno;
  AND la sección SHALL renderizarse **solo si hay mascota seleccionada**
  (`selectedPetId !== null`), igual que `summary-card` y `quick-actions`: la
  próxima vacuna es un dato con ámbito de mascota;
  AND THE SYSTEM SHALL **no** añadir margen negativo, solape ni separador: el
  `gap: 16` de `home-content` (`home/index.tsx:224`) ya separa la sección de sus
  vecinas.
  - **Por qué ahí y no al final del todo.** El Make pone Recordatorios como
    **última** sección (`:425-449`), después de la actividad semanal
    (`:411-424`). La app tiene además `last-position-card`, que el Make dibuja
    arriba, dentro de la fila de collar (`:384-394`), y que #67/#68 dejaron
    cerrando el scroll. Anclar la sección **antes** de esa tarjeta conserva el
    orden relativo del diseño entre las secciones que existen en los dos y **no
    mueve** una tarjeta que esta feature no toca. Alternativa descartada en
    [[design]] §6 A2; se ratifica en §Aprobación.
  - **Los tres candados de orden que ya existen siguen verdes sin tocarlos**,
    comprobado y no supuesto: el de #68 (`index.test.tsx:1205-1235`, lista
    blanca de 3), el de #69 (`:1401-1438`, de 4) y el de #71 (`:1760-1798`, de
    5) **filtran a una lista blanca** de `testID` antes de comparar, así que un
    hermano nuevo no los mueve. El de esta feature usa una lista blanca de
    **6**.
  - Test: mismo `describe` que R1 →
    `it('coloca la sección entre la actividad semanal y la última posición')`,
    que lee los `testID` de los hijos de `home-content`, filtra a los seis y
    espera la secuencia completa; más
    `it('no dibuja la sección sin mascota seleccionada')`.

### R15 — Cero llamadas nuevas, cero backend, cero ficheros nuevos de producción

- **R15**: WHEN esta feature se implemente THE SYSTEM SHALL leer **únicamente**
  `detail.data.pet.nextVaccine`, que ya viaja en la respuesta que la Home pide
  hoy (`getPet`, `home/index.tsx:112-118`), y `selectedPetId`;
  AND SHALL **no** añadir ninguna llamada a la API, ningún parámetro nuevo,
  ningún hook de datos nuevo, y **no** tocar `src/api/pets.ts`,
  `src/api/reminders.ts`, `src/api/nutrition.ts`, `src/api/health-records.ts` ni
  `src/hooks/use-api.ts` — el **único** fichero de `src/api/` que cambia es
  `types.ts`, y solo para tipar (R2);
  AND SHALL **no** tocar `backend-pet-tracker/`, `infra/` ni `hosting/`;
  AND SHALL **no** crear ningún fichero de producción nuevo: la sección vive
  dentro de `src/screens/home/index.tsx` y los dos helpers dentro de
  `src/screens/home/format.ts`, los dos ya existentes. Sacarla a
  `src/screens/home/reminders-section.tsx` haría crecer `SCREEN_FILES`
  (R18 fila 12) a cambio de nada;
  AND SHALL **no** tocar `src/components/`, `src/theme/`, `src/utils/`,
  `src/app/` ni `src/screens/reminders/`.
  - IF durante la implementación aparece algo en la sección que exija un dato
    que el perfil no trae THEN **la feature se para y se reporta**. Es
    literalmente el modo de fallo que R3 existe para evitar.
  - Test: mismo `describe` que R1 →
    `it('no añade ninguna llamada a la API')`, que compara el recuento de
    `mockGetPet`, `mockGetDailyActivity` y `mockListPets` con el escenario
    equivalente sin sección y espera **el mismo número**; más `git diff --stat`
    sin ficheros fuera de `mobile-pet-tracker/`, `specs/` y `progress/`, que
    verifica el reviewer.

### R16 — Siete claves de copy nuevas, en los dos idiomas y registradas

- **R16**: WHEN esta feature introduce copy THE SYSTEM SHALL añadir a
  `mobile-pet-tracker/src/i18n/catalog.ts` **exactamente siete** claves nuevas,
  en los bloques `en` **y** `es`:

  | Clave | `en` | `es` |
  |---|---|---|
  | `home.reminders` | `Reminders` | `Recordatorios` |
  | `home.remindersSeeAll` | `See all` | `Ver todos` |
  | `home.nextVaccineDays` | `{{days}} d` | `{{days}} d` |
  | `home.nextVaccineDaysLeft` | `In {{days}} days` | `Faltan {{days}} días` |
  | `home.nextVaccineToday` | `Today` | `Hoy` |
  | `home.nextVaccineOverdue` | `Overdue` | `Vencida` |
  | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` |

  AND las siete SHALL resolverse con `t('<clave>')` **literal** en
  `src/screens/home/index.tsx` —esta feature no usa el campo `labelKey`, porque
  no tiene tabla de elementos repetidos—, dejando **cero** literales de copy en
  el fuente (carta §Dirección de arte 6);
  AND SHALL añadirse **siete** filas
  `{ file: 'src/screens/home/index.tsx', key: '<clave>' }` al bloque `R3_HOME`
  de `src/__tests__/ui-copy-table.ts:45-87`, **una por uso**;
  AND SHALL registrarse las siete claves en la tabla de
  `specs/mobile-ui-language/design.md` §2, bloque de
  `src/screens/home/index.tsx`, con el formato literal de las filas que ya
  añadieron #67, #69 y #71 (`← añadida por #70 (R16)`);
  AND THE SYSTEM SHALL **no** reutilizar ninguna clave del ámbito
  `reminders.*` —ni `reminders.reminders`, ni `reminders.dueInDays`, ni
  `reminders.noRemindersYet`—: cruzarían ámbito del catálogo, que es lo que #68,
  #69 y #71 ya descartaron por escrito. `reminders.dueInDays` es además
  inutilizable aquí, porque vale `'· en {{days}} días'`, **con un separador `·`
  incorporado** que solo tiene sentido dentro de la fila de la otra pantalla.
  - **`home.reminders` vale `Recordatorios`, igual que `reminders.reminders`.**
    Son dos claves con el mismo valor a propósito: una rotula una sección de la
    Home y la otra el título de otra pantalla, y el candado de #65 no prohíbe
    valores repetidos, solo claves ausentes en un idioma.
  - **Las palabras salen del Make**, como manda la carta: `Recordatorios`
    (`design-src/App.tsx:427`) y `Ver todos` (`:428`).
  - **`{{days}} d` es idéntica en los dos idiomas** a propósito: es una
    abreviatura de unidad, no una palabra. Su expansión accesible
    (`home.nextVaccineDaysLeft`) sí se traduce, y es la razón por la que son dos
    claves y no una (R11). El candado de marcadores de
    `language-provider.test.tsx:43-47` exige que las dos versiones usen el mismo
    nombre de marcador, y `{{days}}` lo cumple.
  - Test: `src/__tests__/ui-language.test.ts` (candados de #65: una clave
    presente en un idioma y ausente en el otro no compila, `:347-350`;
    `checkUses(R3_HOME)` exige una fila por uso, `:84`) más el delta de R18.

### R17 — Cero drift de estilo en los ficheros de esta feature

- **R17**: WHEN esta feature termine THE SYSTEM SHALL mantener, en **todos** los
  ficheros que toca, cero literales hexadecimales, cero clases arbitrarias
  `[...]`, cero `StyleSheet` y cero clases de radio fuera de la escala de #62 R4
  (`rounded-card`, `rounded-xl`, `rounded-full`);
  AND SHALL añadir a `src/__tests__/design-drift.test.ts` un bloque propio
  `describe('#70 R17: la sección de recordatorios no mete drift de estilo')` con
  la lista nominal de sus ficheros —`api/types.ts`, `i18n/catalog.ts`,
  `screens/home/format.test.ts`, `screens/home/format.ts`,
  `screens/home/index.test.tsx`, `screens/home/index.tsx`— y el mismo patrón
  `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` que ya usan los bloques `R9`,
  `#68 R18`, `#69 R13` y `#71 R13`;
  AND el título del `it` de ese bloque SHALL **no** contener el número de
  ficheros escrito con letra —`#69 R13` dice *"sus cinco ficheros"* (`:244`) y
  `#71 R13` dice *"sus tres ficheros"* (`:263`), y las dos cifras caducan en
  cuanto la lista cambia—: el título es
  `'mantiene sus ficheros sin escapes de estilo literales'`.
  - **Por qué un bloque propio y no confiar en el de #68, #69 o #71**: los
    ficheros de esta feature están hoy cubiertos por listas nominales de **otras**
    features; si mañana alguien las reordena o las recorta, la cobertura de #70
    desaparece **en silencio**, y no hay barrido global que la sustituya
    (§0 premisa 13). `src/api/types.ts` no está hoy en **ninguna** de las cinco
    listas.
  - **Declarado por escrito, como pide el encargo**: R17 es un candado de
    **cadena literal**, no de conducta, y no puede ser otra cosa —"no hay un hex
    en el fuente" no es un comportamiento observable en el árbol renderizado—.
    Lo mismo vale para la lectura de fuente de R2 y de R13. Los requisitos de
    **conducta** de esta feature (R1, R3, R4, R5, R6, R7, R8, R9, R10, R11, R14,
    R15) se fijan sobre la salida renderizada o sobre el valor devuelto por una
    función pura, y son ésos los que llevan mutación (R19b).
  - Test: `src/__tests__/design-drift.test.ts` :: el bloque nuevo.

### R18 — Los candados se mueven por delta declarado contra `b0ec5a8`

- **R18**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `b0ec5a8`**, nunca cifras absolutas escritas a mano,
  y SHALL distinguir **reubicación** (la ruta cambia, la cifra no) de **delta
  real** (la cifra cambia). Esta feature **no reubica nada** —no mueve ni crea
  ningún fichero de producción (R15)— así que toda la tabla es delta real o
  "sin cambio":

  | # | Candado | Fichero del candado | Delta | Motivo |
  |---|---|---|---|---|
  | 1 | **longitud del catálogo** | `src/providers/__tests__/language-provider.test.tsx:41` | `260 + 16 + 1 + 4` → **`260 + 16 + 1 + 4 + 7`** | las siete claves de R16 |
  | 2 | filas de `R3_HOME` | `src/__tests__/ui-copy-table.ts:45-87` y `ui-language.test.ts:83` | **+7** (`21 + 15 + 1 + 4` → `21 + 15 + 1 + 4 + 7`) | ídem |
  | 3 | `#62 R15` cifras tabulares | `consistency-classnames.test.ts:335-369` | **tres mandos, se mueven juntos**: constante nueva `HOME_TABULAR_DELTA_70 = 1` junto a `HOME_TABULAR_DELTA_69` (`:336`); la fila de `screens/home/index.tsx` (`:340-343`) pasa a `HOME_TABULAR_AT_9358CC7 + HOME_TABULAR_DELTA_69 + HOME_TABULAR_DELTA_70`; el total cerrado (`:360`) `14 + 4 + 1` → **`14 + 4 + 1 + 1`**; y la guarda de `#69 R14` (`:365-368`) pasa a `.toBe(HOME_TABULAR_DELTA_69 + HOME_TABULAR_DELTA_70)` | el `style={TABULAR_NUMS}` del contador (R12) |
  | 4 | `#61 R4` acento como tinta | `legibility-classnames.test.ts:123` y `:135-139` | fila `screens/home/index.tsx`: **1 → 2**; total cerrado **`.toBe(13)` → `.toBe(13 + 1)`** | el `text-accent-strong` del enlace de R10 |
  | 5 | bloque de drift de estilo | `design-drift.test.ts` | **+1 `describe`** | R17 |
  | 6 | doble de `reicon` de la Home | `screens/home/index.test.tsx:82-102` | **+1 entrada** (`Syringe: mockIcon('icon-syringe')`) | R13. Es fichero de **test**: no cuenta como rojo |
  | 7 | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:273` y total en `:328-330` | **sin cambio** (`screens/home/index.tsx` sigue en `2`; total `33 + 1 + 1`) | R12: las dos filas usan el `Card` compartido, que ya trae la esquina; disco y contador son **cápsula** y no la llevan |
  | 8 | `#64 R9` clases categóricas | `consistency-classnames.test.ts:404` | **sin cambio**: `inventory.files` sigue siendo `['utils/category-palette.ts']` | R12. Si este candado se mueve, alguien escribió la clase en la Home |
  | 9 | `#64 R9` usos de `bg-accent-soft` | `consistency-classnames.test.ts:420-433` | **sin cambio** (16) | la sección usa superficies categóricas y `bg-default`, no el acento suave |
  | 10 | `#62 R1` botones primarios | `consistency-classnames.test.ts:97-104` | **sin cambio** (13) | R10 es un enlace de texto, no un `rounded-xl bg-accent` |
  | 11 | `#62 R4` escala de radios | `consistency-classnames.test.ts:150-155` | **sin cambio** (listas vacías) | R12: `rounded-card` y `rounded-full`, nunca `rounded-2xl` |
  | 12 | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:357` | **sin cambio** (`19 + 2`) | toda la copy vive en `src/screens/home/index.tsx`, que ya está en la lista: **por eso la sección no se saca a un módulo propio** (R15) |
  | 13 | `#62 R7` glifos como icono | `consistency-classnames.test.ts:194-216` | **sin cambio** (`[]` y 3) | R13 y R10: iconos de reicon, cero emoji, cero `›` |
  | 14 | `#61 R5` `text-warning-strong` | `legibility-classnames.test.ts:152-172` | **sin cambio** | es `toContain`, sin recuento, y la sección no usa esa tinta |
  | 15 | orden de `home-content` (#68, #69, #71) | `index.test.tsx:1205-1235`, `:1401-1438`, `:1760-1798` | **sin cambio** | filtran a lista blanca (R14) |
  | 16 | consistencia entre idiomas | `language-provider.test.tsx:42-47` y `ui-language.test.ts:347-350` | **cuadran solos** | son comparaciones relativas, sin cifra |
  | 17 | `ALL_USES` vs. suma de bloques | `ui-copy-table.ts:407-415` | **cuadra solo** | el candado ya es consistencia interna |
  | 18 | rutas delgadas | `design-drift.test.ts:112-134` | **sin cambio** | `src/app/(tabs)/home.tsx` no se toca (R15) |

  El implementer sustituye cada número por el que devuelva el propio `grep`; el
  reviewer comprueba el **delta**, no el valor. IF un total cerrado se mueve por
  una causa que esta tabla no prevé THEN **para y repórtalo**: no lo absorbas
  subiendo el número.
  - **La fila 1 va la primera a propósito.** `language-provider.test.tsx:41` se
    omitió en las specs de #68 y de #69 y **paró la implementación las dos
    veces**; #71 sí la enumeró y no paró. No es una decisión de producto: es la
    consecuencia mecánica de R16. Se autoriza **solo** cambiar
    `260 + 16 + 1 + 4` por `260 + 16 + 1 + 4 + 7`, conservando la base histórica
    **visible como suma**, sin tocar ninguna otra línea de ese fichero y sin
    debilitar el `toEqual` que compara los dos idiomas. Reescribir la base como
    un `288` plano **no** se autoriza.
  - **La fila 3 es la más delicada de la tabla**: tres expresiones en el mismo
    fichero que solo cuadran si se mueven a la vez, y una de ellas vive dentro
    de un `it` titulado `#69 R14`. Tocar ese `it` **no** es enmendar #69: es el
    uso previsto del mecanismo de delta que la propia #69 dejó montado con
    constantes nombradas.
  - Test: los propios candados, en verde, con los deltas aplicados.

### R19 — Verificación: suite verde y grep-clean

- **R19**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa en verde —`bun run test` y `bun run typecheck` desde
  `mobile-pet-tracker/`— sin debilitar ni eliminar ningún assert de conducta y
  sin renombrar ningún `testID` **de producción**; AND SHALL mantener el
  grep-clean de la carta §Decisiones fijas 3 intacto: **cero** hex fuera de
  `src/theme/`, **cero** clases arbitrarias `[...]`, **cero**
  `StyleSheet.create`, **cero** shadow/elevation legacy y **cero** clases de
  radio fuera de la escala de #62 R4.
  - Antes de tocar código: borrar `mobile-pet-tracker/.expo/types/router.d.ts`
    si existe (está gitignorado y rompe el typecheck con rutas fantasma — y esta
    feature **toca una ruta**, así que muerde) y comprobar con
    `pgrep -f init.sh` que no hay otro gate corriendo en un worktree hermano,
    porque comparten el Postgres de docker.

- **R19b**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar,
  con las **ocho** mutaciones plantadas **de una en una** y la evidencia en
  `progress/impl_mobile-home-reminders-section.md` §prueba de mutación, que la
  suite se pone **roja** con cada una:

  | # | Mutación (en código de **producción**) | Requisitos que debe matar |
  |---|---|---|
  | M1 | `calendarDaysUntil` pasa a `Math.ceil((Date.parse(date) - now.getTime()) / 86_400_000)` | R4, R5 |
  | M2 | `fmtDate` pasa a `new Date(date).toLocaleDateString(locale, …)` (cadena cruda) | R5, R6 |
  | M3 | el nodo del nombre pinta `nextVaccine.nextDoseAt` y el de la fecha `nextVaccine.name` (cruce de **dato**) | R6 |
  | M4 | la rama `days < 0` desaparece y el contador pinta `t('home.nextVaccineDays', { days })` con `days` negativo | R7 |
  | M5 | se añade al cuerpo un segundo hijo —una barra de comidas de mentira, `<View className="h-1.5 rounded-full bg-default" />`, **sin `testID`**— | R1, R3 |
  | M6 | `reminders-see-all` navega a `/add-reminder` en vez de a `/reminders` | R10 |
  | M7 | `reminders-section` se monta **delante** de `quick-actions` | R14 |
  | M8 | el contador pierde `style={TABULAR_NUMS}` | R12, R18 fila 3 |

  - **M5 es la mutación de la lección de #71**: el hijo intruso **no lleva
    `testID`**, que es exactamente por donde se coló el cuarto tile en la
    corrección O7 de aquella feature. Si la cardinalidad se comprueba contando
    coincidencias de `testID` en vez de hijos del contenedor, M5 deja la suite
    verde y R1 está mal escrito. Se arregla **antes** de seguir.
  - **M1 y M2 se plantan en la zona ciega a propósito**: las dos dejan la suite
    verde bajo un runner en UTC. Si no se ponen rojas, el `it` de R5 no está
    fijando la zona horaria y no vigila nada.
  - **Las ocho son mutaciones de código de producción**, versionadas en el commit
    rojo y revertidas en el verde. **Ninguna puede plantarse en el doble de
    `reicon`, en `makePet` ni en ningún otro mock**: `CHECKPOINTS.md` C4, quinto
    punto, añadido el 2026-09-08 tras #69 precisamente por eso.
  - Test: requisito de verificación (`CHECKPOINTS.md` C4 vía (b)); la evidencia
    es el informe.

---

## Enmiendas a specs aprobadas

**Esta feature no necesita ninguna enmienda.** Se ha comprobado una por una:

- **#68** (actividad semanal): **no se toca**. Ni `weekly-activity-chart.tsx`,
  ni su `weekdayLabel`, ni ninguno de sus `testID`. Su candado de orden
  (`index.test.tsx:1205-1235`) filtra a lista blanca y sigue verde.
- **#69** (tira de estadísticas): **no se toca** ninguna celda ni ningún assert.
  La guarda `#69 R14` de cifras tabulares se mueve por su **delta declarado**
  (R18 fila 3), que es el mecanismo que la propia #69 montó con constantes
  nombradas, no una enmienda.
- **#71** (accesos rápidos): **no se toca** `QUICK_ACTIONS` ni la sección
  `quick-actions`. Su prohibición de `/reminders` **dentro del bloque
  `QUICK_ACTIONS`** (`index.test.tsx:1601-1612`) queda verde y sin tocar: el
  enlace de R10 vive fuera de esa constante, que es justo lo que #71 previó.
- **#64** (paleta pastel): **no se toca**. R12 consume `CATEGORY_SLOTS` tal cual;
  no añade huecos, no añade tokens, no toca `category-palette.ts` ni
  `global.css`. El candado #64 R9 queda **sin cambio**.
- **#62 R4, R7, R14** y **#61 R10**: sin cambio. **#62 R15** y **#61 R4** se
  mueven por los deltas de R18, que es su uso previsto.
- **#65** (catálogo): R16 añade siete claves, que es el procedimiento normal.
- **#39/#47** (pantalla de recordatorios): **no se toca**, y en particular
  **no** se arregla `src/utils/reminder-dates.ts:15`, aunque tenga el mismo
  defecto que #68 corrigió. Decisión abierta **E3**.
- **`docs/ui-guidelines.md`**: sin cambio. Ninguna decisión de esta spec
  contradice la carta. Al contrario: §Dirección de arte 3 nombra *"¿tiene algún
  recordatorio pendiente?"* entre las siete preguntas de la Home, y ésta es la
  **primera** feature que la responde ([[design]] §5).

---

## Decisiones abiertas para el humano

Tres, y ninguna bloquea la implementación de esta feature. Las tres son
**hallazgos verificados contra el árbol** que exceden su alcance.

- **E1 — `gt` contra `gte`: el día de la dosis, la Home y Salud discrepan.**
  `pet-vaccine.drizzle-reader.ts:27` filtra `gt(nextDoseAt, hoyUTC)`, así que
  una vacuna que vence **hoy** no llega en `pet.nextVaccine`; `health.tsx:71`
  filtra `nextDoseAt >= hoy local` y sí la enseña. El día de la dosis, la Home
  muestra la **siguiente** vacuna (o el estado vacío de R8) mientras la pestaña
  Salud muestra la de hoy. Además el "hoy" del filtro es **UTC del servidor**,
  no local del dueño. Es un cambio de **backend** con su propio id; esta spec no
  lo toca y R7 se limita a no pintar un número raro cuando el borde se cruza.
- **E2 — La feature que desbloquea la barra de comidas no existe todavía, y
  necesita dos cosas, no una.** El enunciado la llama
  `pet-profile-summary-slots`, pero **no hay ninguna feature con ese nombre** en
  `feature_list.json`. Y hacen falta dos piezas independientes (R3): un
  **registro de comida servida** (tabla + endpoint; hoy `food.tsx:185` lo finge
  con el reloj) y **`mealsPerDay` en el perfil** (hoy vive en el plan de
  nutrición). ¿Una feature o dos, y con qué ids?
- **E3 — `daysUntil` de `src/utils/reminder-dates.ts:15` tiene el mismo defecto
  que #68 corrigió.** Es `Math.ceil` sobre una resta de milisegundos, sin
  alinear a día de calendario, y lo consumen la píldora `pill-week` y el
  contador por fila de la pantalla de recordatorios
  (`reminders/index.tsx:235,275`). Esta feature **no lo usa y no lo toca** (R4),
  porque arreglarlo cambiaría la conducta de una pantalla fuera de alcance y
  obligaría a re-litigar los tests de #39/#47. Merece feature propia.

Lo que **no** es una decisión abierta sino una **ratificación**, en §Aprobación:
que esta feature entregue **media sección** del diseño, con la otra mitad
declarada imposible por escrito en vez de inventada.

---

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **La barra de progreso de comidas** del Make (`design-src/App.tsx:438-446`).
  R3, con sus dos causas verificadas. No se estima, no se finge y no se deriva
  del reloj como hace `food.tsx:185`.
- **Poblar, tipar o consumir `nextReminder` y `activitySummary`.** R2 los deja
  en `unknown` a propósito, y eso es la prueba en el árbol de que esta feature
  no los toca. Poblarlos es backend (#16 y #10 ya cerradas dejaron los huecos;
  llenarlos es otra feature).
- **Tocar `backend-pet-tracker/`**, y en particular el `gt` del lector de
  vacunas. Decisión abierta E1.
- **Arreglar `src/utils/reminder-dates.ts`.** Decisión abierta E3.
- **Hacer pulsable la fila de la vacuna**, o llevarla a `/health`. R6: sería un
  camino desde la Home a una **pestaña**, el defecto que #71 R3 eliminó.
- **Un segundo enlace a `/reminders` desde la Home**, en la rejilla de #71 o en
  cualquier otro sitio. R10: exactamente uno.
- **Crear cualquier ruta nueva en `src/app/`**, registrar pestañas o tocar
  `floating-tab-bar.tsx`. R10.
- **Tocar la gráfica de #68, la tira de #69, los tiles de #71 o el hero de
  #67**, o cualquiera de sus `testID`. R14: la sección es un hermano nuevo.
- **Mover `last-position-card`.** R14 la deja donde está y se ancla antes.
- **Un mensaje de error o un botón de reintento propios de la sección.** R9: el
  `pet-hero-error` de la Home ya cubre el mismo fallo de la misma petición.
- **Listar más de una vacuna, o cualquier otro tipo de recordatorio en la
  sección.** El contrato del perfil da **una** próxima vacuna y nada más; la
  lista completa es la pantalla a la que lleva R10.
- **Animación de entrada.** El Make no la tiene y la carta no la pide.
- **Sacar la sección o los helpers a ficheros nuevos.** R15 y R18 fila 12.
- **Añadir, renombrar o cambiar tokens en `src/theme/global.css`.** R12: los
  huecos de #64 ya existen y esta feature consume dos.
- **Dependencias nuevas.** Ninguna hace falta: `Syringe` ya está en
  `reicon-react-native`. El veto **nominal** a `expo-linear-gradient` sigue
  vivo; la autorización general de dependencias declaradas no se ejerce aquí.
- **La píldora "En línea"** y el pestillo de conectividad. Feature **#73**.
- **Traducir los enum crudos** que la carta deja crudos a propósito. No aplica:
  esta sección no pinta ninguno.

---

## Decisiones de implementación

### D1 — la aserción de cardinalidad se traslada de R1 a R9

**Codex paró antes de escribir una línea de código y paró bien.** `tasks.md`
§R1 se contradice consigo mismo: su test rojo exige que
`reminders-section-body.children` tenga longitud **1** en el escenario cargado
y **1** en el pendiente (`:358`), pero su implementación mínima manda dejar el
cuerpo **vacío** (`:363`). Los hijos reales no existen hasta **R6** (la fila),
**R8** (el estado vacío) y **R9** (el esqueleto). Con el orden aprobado, ese
test no puede ponerse verde sin un placeholder que nadie autorizó, sin
adelantar requisitos o sin diferir el assert.

- **Qué se cambia, y solo esto**: R1 conserva su primer `it` —cabecera, rótulo,
  receta tipográfica y `reminders-see-all`— y **pierde** el `it('deja el cuerpo
  con un solo hijo')`. Esa aserción de cardinalidad **se traslada íntegra a
  R9**, que es el último de los tres requisitos que introduce un hijo del
  cuerpo: al llegar ahí, los tres escenarios ya tienen su hijo real y el assert
  mide lo que dice medir.
- **Qué NO cambia**: la cardinalidad se sigue contando sobre `children` del
  contenedor y **nunca** sobre coincidencias de `testID`; siguen siendo las
  mismas tres longitudes —1 cargado, 1 pendiente, 0 error—; y **M5 sigue
  plantando un elemento sin `testID`**, ahora contra el candado de R9. No se
  relaja ningún assert: se mueve de sitio para que pueda existir.
- **Por qué no la otra salida**: autorizar un placeholder transitorio en R1
  daría un verde que no prueba nada y habría que borrarlo tres requisitos
  después. Mover el assert al sitio donde el sujeto existe es lo que C4 pide.

### D2 — dos correcciones a premisas de la spec, sin efecto en el alcance

Detectadas por Codex al leer la spec contra el árbol. Se corrigen aquí para que
no se propaguen, como manda el precedente de #67:

1. La spec dice que `pet-profile-summary-slots` **no existe** como id. Era
   cierto al escribirla; desde entonces el leader abrió **#83**
   (`meals-served-tracking`) y **#84** (`reminder-dates-days-until-drift`). Las
   citas a "feature propia" de §Fuera de alcance apuntan a esos dos ids.
2. Las líneas citadas de `food.tsx` se desplazaron. El hecho —que la comida
   servida se finge con el reloj local— se sostiene; el número no. Quien
   implemente re-deriva la línea, no la copia.

### D3 — M1 no distingue lo que dice distinguir

Codex encontró que **M1 falla también en UTC**, por `-0` frente a `0`: en Jest
`expect(-0).toBe(0)` es rojo. Una mutación que debía morir **solo** bajo una
zona horaria negativa muere siempre, y por una razón que no tiene nada que ver
con la zona horaria. Eso la invalida como prueba de zona ciega.

- **Qué se autoriza**: que `calendarDaysUntil` normalice el cero —devolver `0`
  y nunca `-0`— y que M1 se replantee para que su rojo dependa **de verdad** de
  la zona horaria. La conducta que R5 exige no cambia; lo que se arregla es que
  el candado pueda demostrarla.

  - [X] Aprobado por humano


### D4 — el feedback `pressed` de R10 se ratifica por escrito

R10 prescribe la anatomía exacta del enlace `reminders-see-all` —`Pressable`,
`accessibilityRole="button"`, `className="min-h-11 justify-center"`, un `Text`
hijo— y **omite el feedback de pulsado que C8 exige a todo elemento tappable**.
Codex lo detectó, el humano lo autorizó de palabra el 2026-09-09, y el cambio
está implementado y con candado (`index.tsx:517`, `index.test.tsx:2118-2141`).

El fondo es correcto —la carta gana sobre el JSX literal de una spec, que es lo
que manda `CLAUDE.md` §UI móvil— pero la forma no: una autorización que solo
vive en prosa dentro de `progress/impl_*.md` no es el artefacto del gate.
`requirements.md` lo es, y esta spec ya tenía el mecanismo montado y usado tres
veces.

- **Qué se ratifica**: el enlace lleva
  `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` además de lo que
  R10 prescribe, y su candado. **Nada más se toca de R10.**
- **Sin trabajo nuevo**: ya está hecho. Esta entrada cierra el hueco de proceso.

### D5 — el candado de zona horaria de R5 es inerte y cambia de mecanismo

**Bloqueante, y verificado por el leader además del reviewer.** R5 fija la zona
con `process.env.TZ = 'America/Mexico_City'` dentro del `it`. **Bajo Jest esa
asignación no llega a V8.** Sonda corrida en el runner del proyecto:

```
PROBE before= 2026-09-10T12:00:00.000Z offset= 0
PROBE after = 2026-09-10T12:00:00.000Z offset= 0
PROBE changed= false
```

El epoch y el offset son idénticos después de asignar. En Node pelado sí
funciona, y por eso el defecto es invisible a simple vista. Consecuencia
medida: con M1 o M2 plantadas, **el gate completo pasa en verde** en la
invocación por defecto, que es la única que corre `init.sh`. Es exactamente la
condición de parada que R5 y R19b pre-declaran, y no se aplicó.

La premisa que R5 tomó de #68 se leyó a medias: allí el `process.env.TZ` tampoco
muerde —lo que muerde es el espía del constructor,
`weekly-activity-chart.test.tsx:566-567`, que asserta
`expect(dateConstructor.mock.calls).toEqual([[2026, 8, 6]])` y está vivo en
cualquier zona horaria. #70 copió el andamiaje inerte y dejó fuera los dientes.

- **Qué se cambia**: los dos `it` de R5 en `format.test.ts` sustituyen el
  `try/finally` sobre `process.env.TZ` por el **espía del constructor `Date`**
  de #68, asertando que `calendarDaysUntil` y `fmtDate` construyen la fecha
  **por componentes** y **nunca** reciben la cadena cruda `'YYYY-MM-DD'`.
  El `try/finally` de `process.env.TZ` se **borra**: documenta un mecanismo que
  no existe y engaña al siguiente que lo lea.
- **Criterio de aceptación, no negociable**: con M1 plantada, y por separado con
  M2 plantada, `bun run test` **sin exportar `TZ`** deja la suite **roja**.
  Si hace falta exportar `TZ` a mano para que muerda, el candado sigue sin
  vigilar nada y **se para otra vez**.
- **La evidencia de M1 y M2 en el informe se borra y se rehace** bajo ese
  criterio. La conducta que R5 exige no cambia; cambia lo que la demuestra.
- **Alternativa admitida** si el espía no cubriera algún caso: fijar `TZ` en
  `globalSetup` de Jest o en el script `test` de `package.json` —antes de que
  arranquen los workers—, nunca dentro del `it`.

### D6 — dos dimensiones de la fila entran en alcance

Precedente de #69 y #71: cada revisión de un elemento repetido destapa una
dimensión más. De las once decisiones que toma la fila de recordatorio, nueve
están vigiladas; dos no, y las dos dejan la suite **entera** verde al cruzarse:

1. **Tinta del icono.** Producción usa `color={vaccineInk}` en la fila
   (`index.tsx:541`) y `color={muted}` en el estado vacío (`:576`).
   Nadie asserta `icon.props.color`: cruzarlos pintaría la vacuna gris apagado y
   el estado vacío azul de vacunación, sin un test rojo. El doble de `reicon`
   ya propaga las props (`index.test.tsx:96-99`).
2. **Recetas tipográficas de nombre, fecha y texto vacío.** R6 prescribe
   `text-sm font-semibold text-foreground` y `text-xs font-normal text-muted`;
   R8 prescribe `flex-1 text-sm font-normal text-muted`. Los tests obtienen esos
   nodos pero solo assertan `children` y `style`, **nunca `className`**.
   Intercambiar las recetas de nombre y fecha no mueve ningún inventario global
   —las mismas clases siguen presentes, solo cambian de nodo— y deja la suite
   verde. Es el defecto ya registrado como **#81** una feature antes, repetido
   con nodos distintos.

- **Qué se añade**: aserciones de `icon.props.color` en la fila y en el estado
  vacío, y de `props.className` en nombre, fecha y texto vacío, observadas con
  `within(fila)`. El patrón ya está escrito en este mismo fichero
  (`index.test.tsx:1669-1671`, de #71). Se añade también
  `within(row).getByTestId('icon-syringe')` en R6 y R8, que ancla el icono al
  árbol y no solo a una cuenta de cadenas en el fuente.
- **Sin mutación nueva obligatoria**, pero cada aserción debe demostrarse con una
  sonda: cruzar el valor y ver el rojo antes de dejarla.
- **#81 no se cierra con esto**: aquello es el tile de acciones rápidas y sigue
  abierto.

  - [X] Aprobado por humano

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-08) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. **Que esta feature entrega media sección del diseño** (R3): entra la próxima
   vacuna con su contador, no entra la barra de comidas. El smoke lado a lado
   **no** va a coincidir en esta sección, y es esperado, no un defecto.
2. **Que la causa por la que no entra es otra que la del enunciado**: no es que
   `nextReminder` y `activitySummary` sean `null` —la barra no los lee—, sino
   que **no existe registro de comida servida** en el backend y que
   `mealsPerDay` vive fuera del perfil (R3). La causa se corrige por escrito en
   vez de repetirse.
3. **Que la sección se ancla entre la actividad semanal y `last-position-card`**
   (R14), y no al final del scroll, para conservar el orden relativo del diseño
   sin mover una tarjeta que esta feature no toca.
4. **Que esta feature rompe el invariante de #46/#61/#62 una sola vez** (R10):
   un enlace, a una ruta existente, sin cast, sin ruta nueva y sin segundo
   camino desde la misma pantalla.
5. **Las tres ramas del contador** (R7), incluida `Vencida` para un caso que el
   backend hoy no puede producir en el instante de la petición pero que la caché
   y el reloj del dispositivo sí alcanzan.
6. **Las tres decisiones abiertas E1, E2 y E3**, que quedan anotadas como
   hallazgos y **no** se resuelven aquí.
