---
feature: "mobile-home-reminders-real-data"
status: approved         # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-reminders-real-data]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y las alternativas descartadas;
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI que gobierna
> todo trabajo móvil (**gana sobre cualquier skill**) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Decisiones ya cerradas, no se reabren**:
> `progress/decisions_mobile-home-reminders-real-data.md` (D-A…D-K; las cuatro
> primeras las tomó el humano el 2026-09-09).
> **Investigación de origen**: `progress/explore_mobile-home-reminders-real-data.md`.
> **Feature que esta reescribe**: `specs/mobile-home-reminders-section/` (#70),
> con sus ocho enmiendas D1-D8.
>
> **Base de medición**: todo delta de esta spec se mide contra
> **`20c7b3c`** (merge del PR #116, #70). Ningún requisito congela un recuento
> absoluto: se fijan **sumandos** y **consistencias internas**. Es la octava vez
> que se dice en este repo; las tres últimas costaron una parada cada una.
>
> **Skills obligatorias antes de tocar código** (carta §Skills):
> `expo:expo-overview` → `expo:expo-native-ui`, más `appllama-app-design-skill`.
> En Codex CLI, las equivalentes del plugin `expo`. **La carta gana sobre la
> skill en todo conflicto de estilo**: aquí manda Tailwind v4 + uniwind +
> heroui-native con tokens en `src/theme/global.css`; nada de `Color` de
> `expo-router`, `StyleSheet.create`, hex ni clases arbitrarias. SDK del
> proyecto: **Expo ~57.0.14 / RN 0.86.2**; usar la documentación fijada a esa
> versión, nunca `latest`.

---

## 0. Qué cambia, en una frase

Hoy la sección "Recordatorios" de la Home pinta **una sola fila**: la próxima
vacuna que viene en el contrato del perfil. A partir de #85 pinta **esa misma
fila, fija y primera**, y **debajo hasta tres recordatorios reales** de la
mascota —solo pendientes y futuros, por fecha ascendente— leídos del endpoint
que **ya existe** y filtrados **en cliente**. **Cero backend.**

---

## 0.1 Premisas, verificadas una por una contra el árbol en `20c7b3c`

| # | Premisa | Veredicto |
|---|---|---|
| 1 | `GET /v1/pets/:petId/reminders` ya existe y devuelve **todo** el historial ordenado por `dueAt` ascendente | **Cierta.** `reminder.drizzle.repository.ts:28-35` (`.where(eq(petId)).orderBy(asc(dueAt))`), sin query params, sin filtro de estado, sin paginación. La conducta está candada por nombre en `backend-pet-tracker/test/pet-reminders.e2e-spec.ts:143-144`: **filtrar en servidor lo pondría rojo por diseño** |
| 2 | El cliente móvil ya sabe llamarlo | **Cierta.** `mobile-pet-tracker/src/api/reminders.ts:37` exporta `listReminders(baseUrl, token, petId, fetchFn?): Promise<RemindersState>`, con `RemindersState = { kind: 'ok'; reminders: Reminder[] } \| 'not-found' \| 'unauthorized' \| 'error' \| 'unreachable' \| 'missing-config'`. **No se toca** |
| 3 | `Reminder` ya está tipado en el móvil | **Cierta.** `src/api/types.ts:209-217`: `{ id, petId, type, title, dueAt, advanceMinutes, status }`, con `ReminderType` (`:198-205`, siete valores) y `ReminderStatus` (`:207`, `scheduled \| sent \| cancelled`). **`src/api/types.ts` no se toca en esta feature** |
| 4 | `dueAt` es un **instante** ISO con hora, no un día civil | **Cierta.** Columna `timestamp with time zone` (`reminders.schema.ts`), serializada como ISO por `reminder.mapper.ts:3-22` |
| 5 | `calendarDaysUntil` de `src/screens/home/format.ts` **no vale** para `dueAt` | **Cierta y medida.** `format.ts:3-10` parte la cadena por `-` y llama `Number` sobre los trozos: con `'2026-09-12T15:00:00.000Z'` el tercer trozo es `'12T15:00:00.000Z'` → `NaN` → `Date.UTC(…, NaN)` → **`NaN`, sin lanzar**. `fmtDate` (`:12-20`) cae en la misma trampa y devuelve `Invalid Date`. La Home pintaría `NaN d` sin que nada se ponga rojo. **De aquí sale R2** |
| 6 | `src/utils/reminder-dates.ts:15` (`Math.ceil` sobre ms) sigue vetado | **Cierta**, y **no molesta**: sus únicos llamantes están en `src/screens/reminders/index.tsx:235,275`. La Home tiene **cero**. Esta feature **no lo usa y no lo toca** (#84) |
| 7 | `REMINDER_TYPE_META` ya reparte los siete tipos a `{ labelKey, emoji, category }` | **Cierta.** `src/utils/reminder-meta.ts`. Usa **emoji**, y #70 R13 exige en esta sección *"el icono de reicon y ningún emoji"*. Choque real, cerrado por **D-G**: se añade un mapa de iconos; la categoría la sigue mandando `reminder-meta.ts` (R6) |
| 8 | Vacunas y recordatorios son entidades **disjuntas** | **Cierta.** Dos tablas, dos módulos, **sin FK** entre `pet_vaccines` y `reminders`. Ningún caso de uso de una escribe en la otra. **Deduplicar sería comparar `title` con `name`, que es adivinar** — ver §0.3 |
| 9 | El repositorio de recordatorios **no** hereda el defecto de #82 | **Cierta.** `listByPet` no filtra por fecha en absoluto. El defecto de #82 vive solo en el camino de la vacuna — ver §0.4 |
| 10 | La mitad **inglesa** de la copy de esta sección no tiene candado (hallazgo O7 de #70) | **Cierta.** `Next vaccine`, `See reminders`, `No upcoming vaccine` y `Overdue` no aparecen fuera de `src/i18n/catalog.ts`; `language-provider.test.tsx` compara **claves y marcadores**, nunca textos. **De aquí sale R1** |
| 11 | `process.env.TZ` asignado dentro de un `it` **no llega a V8** bajo Jest | **Cierta y medida** (#70 D5: `PROBE changed= false`). Costó el rechazo del primer pase de #70. **Todos los candados de fecha de esta spec usan espías de `Date`**, nunca `process.env.TZ` |
| 12 | No existe candado global de "cero hex fuera de `src/theme/`" | **Cierta, por quinta vez.** `design-drift.test.ts` persigue hexadecimales solo sobre **listas nominales de ficheros** (`R9`, `R11`, `#68 R18`, `#69 R13`, `#71 R13`, `#70 R17`). **R12 añade la de #85** |

### 0.2 Las siete preguntas de la Home (carta §Dirección de arte 3)

Obligatorio declararlo. #85 responde **una**, y la responde entera:

| Pregunta | ¿La responde #85? |
|---|---|
| ¿tiene algún recordatorio pendiente? | **Sí, y es el objeto de la feature.** #70 la respondía a medias —solo vacunas— y por eso D8 tuvo que renombrar el título. Ahora la sección enseña la próxima vacuna **y** los recordatorios reales |
| ¿está segura? / ¿dónde está? / ¿el collar está conectado? / ¿tiene batería? | No. Las responden `collar-card` y `last-position-card`, que esta feature **no toca** |
| ¿cómo fue su actividad hoy? | No. La responde `weekly-activity-card` (#68), que esta feature **no toca** |
| ¿hay alguna alerta? | No. Sigue sin responderse en la Home; fuera de alcance |

### 0.3 La duplicación visual está aceptada por escrito

Si el dueño registró una vacuna en `/health` **y además** escribió un
recordatorio para esa misma vacuna, la Home enseñará **dos filas**: la de
`nextVaccine` y la del recordatorio `type: 'vaccine'`. **Es esperado, no un
defecto**, y se acepta explícitamente (decisión **D-C**):

- No hay **ninguna clave** para deduplicar: `reminders` no tiene FK a
  `pet_vaccines`, y su único texto es `title`, libre. Lo único comparable sería
  `title` contra `name`, que es **adivinar** —dos cadenas escritas por personas
  distintas en momentos distintos—.
- Registrar una vacuna **no** crea un recordatorio, y crear un recordatorio
  `type: 'vaccine'` **no** crea una vacuna. Son dos flujos independientes y el
  dueño que hizo los dos **quiso** hacer los dos.
- La fila de la vacuna se queda **primera y fija**, sin fusionarse en el orden
  (D-C). Eso elimina de raíz los otros dos problemas que el informe señalaba:
  comparar un **día civil** (`nextDoseAt`) con un **instante** (`dueAt`), y el
  empate de orden entre dos orígenes distintos.

### 0.4 Defecto heredado y declarado: el día de la dosis, la sección puede contradecirse

**Se declara, no se arregla aquí.** Mientras **#82** siga viva:

- Los **recordatorios** los filtra #85 contra el día civil **local del
  dispositivo**, de forma **inclusiva** (`>= 0` días, R3) — igual que ya hace la
  pestaña Salud (`src/app/(tabs)/health.tsx:69-74`).
- La **vacuna** llega ya filtrada por el backend con `gt(petVaccines.nextDoseAt,
  after)` (`pet-vaccine.drizzle-reader.ts:27`) y `after` = **día UTC del
  servidor** (`get-pet.use-case.ts:73`), o sea **estrictamente posterior**.

Consecuencia: **el día de la dosis**, un recordatorio que vence hoy **sí** sale
en la sección y la vacuna que vence hoy **no**. La sección puede quedar
incoherente consigo misma ese día. Es un defecto **heredado** del backend, no
introducido por #85, y se cierra en **#82**. Alinear #85 al `gt` UTC para
"quedar coherente" sería propagar el bug a la mitad que hoy está sana; la
decisión **D-I** lo descarta por escrito.

---

## Requisitos

### R1 — La copy vuelve a "Recordatorios" / "Ver todos", y el candado cubre los **dos** idiomas

- **R1**: WHEN la Home renderice la sección THE SYSTEM SHALL resolver
  `home.reminders` y `home.remindersSeeAll` a estos **valores**, cambiando
  únicamente los valores del catálogo y **ningún nombre de clave**:

  | clave | `en` | `es` |
  |---|---|---|
  | `home.reminders` | `Reminders` | `Recordatorios` |
  | `home.remindersSeeAll` | `See all` | `Ver todos` |

  AND THE SYSTEM SHALL **no** añadir, quitar ni renombrar ninguna clave del
  catálogo: el número de claves **no se mueve** (R11);
  AND THE SYSTEM SHALL **no** tocar `home.noUpcomingVaccine` ni ninguna de las
  cuatro claves del contador;
  AND el candado de literal SHALL observar **el texto pintado por la app en los
  dos idiomas**, renderizando la Home con `LanguageProvider initial="en"` además
  del `initial="es"` que ya se usa — **nunca** leyendo `catalog.ts` desde el
  test, que sería tautológico (decisión **D-H**, aviso R-C del informe).
  - **Esto enmienda #70 D8**, que había puesto `Próxima vacuna` / `Ver
    recordatorios` como parche al síntoma. El parche muere aquí porque la causa
    se arregla: la sección ya **sí** enseña recordatorios. Es el tercer criterio
    de aceptación de #85, y **D-F** lo cierra sobre los valores previos a D8.
  - **Alcance del candado inglés**: solo los textos de **esta sección**
    (D-H). Cerrar toda la Home en inglés es deuda aparte y **no entra**.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R1: la sección recupera su rótulo en los dos idiomas')`
    - `it('rotula en español')`: con el wrapper `es` ya existente, asserta
      `reminders-section-title` con texto `'Recordatorios'` y
      `reminders-see-all` con `'Ver todos'`.
    - `it('rotula en inglés')`: con un wrapper nuevo `HomeWrapperEn`
      (idéntico a `HomeWrapper` pero `<LanguageProvider initial="en">`),
      asserta `'Reminders'`, `'See all'`, el estado vacío
      `'No upcoming vaccine'` (escenario `nextVaccine: null`) y el
      `accessibilityLabel` del contador de la primera fila de recordatorio
      igual a `'In 1 days'`.
    - **Los dos literales del `describe('#70 R1: …')` existentes se
      actualizan** de `'Próxima vacuna'` → `'Recordatorios'` y de
      `'Ver recordatorios'` → `'Ver todos'` (`index.test.tsx:1898` y `:1903`).
      Es la adaptación mecánica de R1; no se relaja nada más de ese `it`.

### R2 — `localDayOf`: el instante ISO se reduce a día civil **local** antes de contar

- **R2**: WHEN el sistema necesite el día de calendario de un `dueAt` THE SYSTEM
  SHALL usar una función nueva exportada desde
  `mobile-pet-tracker/src/screens/home/format.ts`, **con esta firma exacta**:

  ```ts
  export function localDayOf(instant: string): string
  ```

  que devuelve el día civil **del dispositivo** en formato `YYYY-MM-DD` con mes
  y día a **dos dígitos**, construyendo el `Date` **desde la cadena del instante**
  y leyendo el día con los getters **locales** `getFullYear()`, `getMonth()` y
  `getDate()`;
  AND THE SYSTEM SHALL **no** usar `getUTCFullYear`, `getUTCMonth` ni
  `getUTCDate` dentro de `localDayOf`;
  AND `calendarDaysUntil` y `fmtDate` SHALL quedar **intactos** y recibir
  siempre `localDayOf(dueAt)`, **nunca** `dueAt` crudo;
  AND THE SYSTEM SHALL **no** tocar `src/utils/reminder-dates.ts` ni sus
  llamantes.
  - **Por qué `new Date(cadena)` aquí sí y en #70 no.** #70 R5 prohíbe
    `new Date('2026-09-15')` porque una cadena **solo-fecha** la parsea el motor
    como **medianoche UTC**, y en offset negativo eso es el día anterior. Un ISO
    **con hora y zona** (`'2026-09-12T15:00:00.000Z'`) es un **instante
    inequívoco**: `new Date(instante)` es la forma correcta —y la única— de
    parsearlo. La disciplina que #70 exige se conserva entera: el día civil sale
    de los **getters locales** y la aritmética de días la sigue haciendo
    `calendarDaysUntil`, que construye **por componentes** con `Date.UTC`.
  - **El candado NO usa `process.env.TZ`** (§0.1 premisa 11). Usa el espía de
    `Date` de `format.test.ts:38-52` (patrón heredado de #68 R4 y afinado por
    #70 D7/O4), que muerde **en cualquier zona horaria**.
  - Test: `src/screens/home/format.test.ts` ::
    `describe('#85 R2: localDayOf reduce el instante a día civil local')`
    - `it('pasa el instante crudo al constructor y no a Date.parse ni a Date.UTC')`:
      con el espía de paso (`Reflect.construct`), asserta
      `dateConstructor.mock.calls` igual a `[['2026-09-12T12:00:00.000Z']]`, y
      `dateParse` y `dateUtc` **no llamados**.
    - `it('toma el día civil de los getters locales, nunca de los UTC')`: mockea
      el constructor para devolver un doble **sesgado**
      `{ getFullYear: () => 2026, getMonth: () => 8, getDate: () => 11,
      getUTCFullYear: () => 2026, getUTCMonth: () => 8, getUTCDate: () => 12 }`
      y espera `localDayOf('2026-09-12T02:00:00.000Z') === '2026-09-11'`.
      **Este `it` es el que mata M1 y lo hace en cualquier zona horaria**: el
      doble sesgado hace que local y UTC discrepen por construcción.
    - `it('rellena mes y día a dos dígitos')`: doble sesgado con
      `getMonth: () => 0, getDate: () => 5` → `'2026-01-05'`.

### R3 — `upcomingReminders`: solo pendientes y futuros, por fecha ascendente, tope 3

- **R3**: WHEN el sistema derive la lista que la Home pinta THE SYSTEM SHALL
  usar una función nueva exportada desde
  `mobile-pet-tracker/src/screens/home/format.ts`, **con esta firma exacta**:

  ```ts
  export function upcomingReminders(reminders: Reminder[], now: Date): Reminder[]
  ```

  que aplique, **en este orden y ninguna otra regla**:

  1. **filtro de estado**: conserva solo `status === 'scheduled'`; descarta
     `sent` y `cancelled`;
  2. **filtro de futuro**: conserva solo aquellos cuyo
     `calendarDaysUntil(localDayOf(dueAt), now) >= 0` — **inclusivo del día de
     hoy**, en el día civil **local** del dispositivo (R2, §0.4);
  3. **orden ascendente por `dueAt`**, comparando las cadenas ISO con
     `localeCompare`;
  4. **desempate por `id` ascendente** cuando dos `dueAt` sean idénticos;
  5. **tope de 3**, quedándose con los **tres primeros** del orden anterior;

  AND THE SYSTEM SHALL **no** aplicar ninguna ventana temporal superior (no hay
  "próximos 30 días"): el tope de 3 ya acota la altura de la sección, y una
  ventana añadiría una regla más que candar sin resolver nada (decisión
  **D-B**);
  AND THE SYSTEM SHALL **no** ordenar en el servidor ni añadir query params al
  endpoint: eso pondría rojo `test/pet-reminders.e2e-spec.ts:143-144`
  (§0.1 premisa 1);
  AND `format.ts` SHALL importar `Reminder` **solo como tipo**
  (`import type { Reminder } from '../../api/types';`).
  - **Por qué el orden se rehace en cliente aunque el endpoint ya ordene**: el
    orden del servidor es una conducta candada de otra feature, no un contrato
    que #85 pueda dar por suyo. Reordenar son dos líneas y hace el orden
    **observable** desde el test de #85, que es lo que la carta §Enmienda #70
    exige del elemento repetido.
  - **Por qué hay desempate explícito**: dos recordatorios con el mismo `dueAt`
    son perfectamente posibles y `Array.prototype.sort` estable conservaría el
    orden **del servidor**, que para el empate no está especificado. El
    desempate por `id` hace el resultado determinista y, sobre todo,
    **observable**.
  - **Fixtures normativas** (`now = new Date(2026, 8, 10, 12, 0)`), con
    `dueAt` construido **siempre** con el helper de test
    `localIso(y, mIndex, d) => new Date(y, mIndex, d, 12, 0).toISOString()`:
    un instante de **mediodía local** cae en el día civil pretendido **en
    cualquier zona horaria**, y eso es lo que hace el test independiente del
    `TZ` del runner. **Escribir `dueAt` como literal `'2026-09-11T12:00:00.000Z'`
    en un test de render está prohibido**: en offsets grandes cambia de día y el
    test se vuelve verde o rojo según la máquina.
  - Test: `src/screens/home/format.test.ts` ::
    `describe('#85 R3: upcomingReminders filtra, ordena y acota')`
    - `it('descarta enviados, cancelados y pasados, y conserva el de hoy')`:
      entrada `[rem-sent(sent, +2d), rem-cancelled(cancelled, +3d),
      rem-past(scheduled, −1d), rem-today(scheduled, +0d),
      rem-next(scheduled, +1d)]` → `['rem-today', 'rem-next']`.
      **`rem-today` es el que prueba que el corte es `>= 0` y no `> 0`.**
    - `it('ordena por fecha ascendente')`: entrada `[+3d, +6d, +1d]` →
      ids en orden `[+1d, +3d, +6d]`.
    - `it('desempata por id ascendente')`: entrada
      `[{ id: 'rem-z', dueAt: +4d }, { id: 'rem-a', dueAt: +4d }]`
      —**en ese orden, deliberadamente invertido respecto al alfabético**— →
      `['rem-a', 'rem-z']`. Ver R15/M6.
    - `it('devuelve como mucho tres')`: cinco elegibles a +1..+5 días →
      exactamente los tres primeros.

### R4 — La Home pide los recordatorios: una llamada más, declarada

- **R4**: WHEN `selectedPetId` no sea nulo THE SYSTEM SHALL montar en
  `HomeScreen` (`src/screens/home/index.tsx`) una cuarta petición con **el mismo
  patrón** que `detailFn` y `activityFn` (`index.tsx:130-151`):

  ```ts
  const remindersFn = useMemo(
    () =>
      selectedPetId
        ? () => listReminders(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const reminders = useApi(remindersFn);
  ```

  AND THE SYSTEM SHALL importar `listReminders` de `'../../api/reminders'` y
  **no modificar ese fichero**;
  AND THE SYSTEM SHALL hacer **exactamente una** llamada a `listReminders` por
  mascota seleccionada, ni más ni menos, y **no** añadir ninguna otra petición;
  AND THE SYSTEM SHALL **no** tocar `src/api/pets.ts`, `src/api/activity.ts`,
  `src/api/nutrition.ts`, `src/api/health-records.ts`, `src/api/types.ts` ni
  `src/hooks/use-api.ts`;
  AND THE SYSTEM SHALL **no** tocar `backend-pet-tracker/`, `infra/` ni
  `hosting/`: **cero backend** (decisión **D-A**, opción (b) del informe).
  - **Esto enmienda #70 R15 de frente.** R15 prometía *"cero llamadas nuevas"*
    y la Home pasa de **3** peticiones al arranque (`listPets`, `getPet`,
    `getDailyActivity`) a **4**. La promesa se rompe **a propósito** y por la
    razón que la justifica: el contrato del perfil reserva una ranura
    `nextReminder` **singular** por diseño documentado
    (`pet-profile-response.mapper.ts:45`, `specs/pet-reminders/requirements.md:174-175`),
    y meterle un array sería mentirle al nombre del campo; añadir una clave 25ª
    contradiría un comentario normativo que vive en producción
    (`pet-profile-response.mapper.ts:12-17`) y movería las **24 claves**
    asertadas en **seis ficheros**. Una petición más a un endpoint que ya se
    sirve cuesta menos que todo eso (decisión **D-K**).
  - El requisito de R15 **no se debilita, se sustituye**: pasa de "tres
    llamadas" a "**exactamente estas cuatro, una cada una**", que es una
    aserción más fuerte, no más laxa.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R4: la Home pide los recordatorios de la mascota')`
    - `it('llama a listReminders una vez con la mascota seleccionada')`:
      asserta `mockListReminders` llamado **una** vez y con
      `(apiUrl, 'jwt-token', 'pet-1')`.
    - `it('no pide nada sin mascota seleccionada')`: con `pets: []`, asserta
      `mockListReminders` **no llamado**.
    - **El `it('no añade ninguna llamada a la API')` de `#70 R15`
      (`index.test.tsx:2340-2350`) se amplía** a
      `{ pets: 1, detail: 1, activity: 1, reminders: 1 }`. Es la adaptación
      mecánica de la enmienda; no se borra el test.
  - **Andamiaje de test obligatorio** (fichero de test, no cuenta como rojo):

    ```ts
    jest.mock('../../api/reminders', () => ({
      listReminders: jest.fn(async () => ({ kind: 'ok', reminders: [] })),
    }));
    ```

    La implementación por defecto vive **en la factoría** para que los ~20
    `describe` del fichero que ya renderizan la Home sigan verdes sin tocarlos:
    `jest.clearAllMocks()` limpia llamadas pero **no** implementaciones, y la
    config de Jest del proyecto (`package.json` §jest) no activa `resetMocks`
    ni `restoreMocks`.

### R5 — Las filas: hasta tres, con su título, su fecha y su contador

- **R5**: WHEN `reminders.data.kind === 'ok'` THE SYSTEM SHALL renderizar dentro
  de `reminders-section-body`, **después** de la fila de la vacuna, una `Card`
  compartida (`src/components/card.tsx`) por cada elemento de
  `upcomingReminders(reminders.data.reminders, new Date())`, con
  `className="flex-row items-center gap-3"`, `key={reminder.id}` y
  `testID={`reminders-item-${reminder.id}`}`, que ligue **cada dato a un solo
  nodo** según esta tabla:

  | Nodo | `testID` | Qué muestra | Receta |
  |---|---|---|---|
  | disco de icono | — (R6) | el icono del tipo | `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}` |
  | agrupador | — | — | `flex-1` |
  | título | `reminders-item-<id>-title` | **`reminder.title`**, tal cual | `text-sm font-semibold text-foreground` |
  | fecha | `reminders-item-<id>-date` | **`fmtDate(localDayOf(reminder.dueAt), locale)`** | `text-xs font-normal text-muted` |
  | contador | `reminders-item-<id>-days` | **el `text` de `dueCountdown(calendarDaysUntil(localDayOf(reminder.dueAt), new Date()), t)`** | `rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}` + `style={TABULAR_NUMS}` |

  AND THE SYSTEM SHALL **no** renderizar `reminder.id`, `reminder.petId`,
  `reminder.advanceMinutes` ni `reminder.status` en ningún nodo;
  AND THE SYSTEM SHALL **no** renderizar la **hora** del recordatorio: la fila
  muestra el **día civil**, igual que la fila de la vacuna y que la propia
  pantalla `/reminders` (`screens/reminders/index.tsx:309`,
  `toLocaleDateString`). No se pierde información respecto a lo que la app
  enseña hoy en ningún sitio;
  AND THE SYSTEM SHALL **no** renderizar etiqueta de tipo: el tipo lo porta el
  icono y su hueco de color (R6), y el texto que acompaña al hueco —lo que la
  carta §Dirección de arte 1 pide— es el **título** del recordatorio, igual que
  en la fila de la vacuna el texto que acompaña al hueco azul es el nombre de la
  vacuna (precedente #70 R6, ya aprobado contra esta misma cláusula);
  AND la función de contador `vaccineCountdown` (`index.tsx:90-108`) SHALL
  **renombrarse a `dueCountdown`**, con la **misma firma, las mismas tres ramas
  y las mismas cuatro claves de copy**, y SHALL usarse desde los **dos** sitios
  —la fila de la vacuna y las filas de recordatorio—;
  AND `reminders-section-body` SHALL contener, en este orden y sin ningún otro
  hijo: **la ranura de la vacuna** (cero o un hijo, según #70 R9) seguida de
  **cero a tres** filas de recordatorio.
  - **Por qué se comparte `dueCountdown` en vez de escribir un contador nuevo**:
    es el mismo cálculo y el mismo texto, y compartirlo deja el número de
    ocurrencias de `t('home.nextVaccineDays')` y compañía **en uno**, que es lo
    que mantiene el delta de `R3_HOME` en **+0** (R11). Escribir un segundo
    contador duplicaría cuatro llamadas `t()`, movería dos candados globales y
    abriría la puerta a que los dos textos divergieran.
  - **Las cuatro claves `home.nextVaccine*` conservan su nombre** aunque ahora
    sirvan también a las filas de recordatorio. Renombrarlas obligaría a
    enmendar la lista literal de siete claves de `#70 R16`
    (`ui-language.test.ts:88-119`) y la tabla de
    `specs/mobile-ui-language/design.md` §2, a cambio de **cero** valor para el
    usuario: las claves del catálogo son identificadores de código, no texto
    visible (carta §Dirección de arte 6, primer corolario). Queda anotado como
    deuda en §Decisiones abiertas.
  - **Cardinalidad: se cuenta con `children.length` del contenedor, JAMÁS
    contando coincidencias de `testID`.** Un recuento por prefijo deja pasar
    cualquier hijo sin `testID` — es la lección literal de #71 (corrección O7) y
    de #70 M5, y R15/M11 la vuelve a plantar.
  - **Fixture normativa de tres filas** (`jest.useFakeTimers()`,
    `setSystemTime(new Date(2026, 8, 10, 12, 0))`), entregada al mock
    **desordenada** para que el orden sea observable:

    | orden de entrada | id | `type` | `title` | `dueAt` | día | fecha visible | contador |
    |---|---|---|---|---|---|---|---|
    | 1º | `rem-a` | `appointment` | `Consulta anual` | `localIso(2026, 8, 13)` | +3 | `13 sep 2026` | `3 d` |
    | 2º | `rem-c` | `food` | `Comprar croquetas` | `localIso(2026, 8, 16)` | +6 | `16 sep 2026` | `6 d` |
    | 3º | `rem-b` | `medication` | `Pastilla antipulgas` | `localIso(2026, 8, 11)` | +1 | `11 sep 2026` | `1 d` |

    Orden esperado en el árbol: **`rem-b`, `rem-a`, `rem-c`**. Los tres tipos,
    los tres títulos, las tres fechas y los tres contadores son **mutuamente
    distinguibles a propósito**: cruzar cualquier par tiene que poner la suite
    roja (R7).
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R5: la sección pinta los recordatorios reales')`
    - `it('pinta las tres filas con su título, su fecha y su contador')`: con la
      fixture de arriba, asserta los nueve nodos por `testID` y su texto exacto.
    - `it('las ordena por fecha ascendente bajo la fila de la vacuna')`: asserta
      que `body.children[0]` es `reminders-next-vaccine` y que
      `[body.children[1], body.children[2], body.children[3]]` tienen
      `props.testID` `['reminders-item-rem-b', 'reminders-item-rem-a',
      'reminders-item-rem-c']`. **Se lee la posición, no `getAllByTestId`.**
    - `it('cuenta los hijos del cuerpo en tres escenarios')`: `children.length`
      igual a **1** con cero recordatorios elegibles, **2** con uno y **4** con
      tres — es decir `1 + n`, y con la ranura de la vacuna presente en los tres.
    - `it('corta en tres aunque haya cinco')`: cinco elegibles a +1..+5 días →
      `body.children.length === 4` y los tres `testID` son los de +1, +2 y +3.
    - `it('pinta fecha y contador reales para un dueAt con hora')`: una sola
      fila, y asserta que el texto de la fecha **no** contiene `'Invalid'` y que
      el del contador **no** contiene `'NaN'`. Es el candado directo de la
      trampa silenciosa de §0.1 premisa 5 y el que mata M2.

### R6 — Un icono de `reicon` por tipo, con su hueco de color y su tinta

- **R6**: WHEN se renderice el disco de icono de una fila de recordatorio THE
  SYSTEM SHALL resolverlo con **este mapa exacto**, declarado como constante de
  módulo en `src/screens/home/index.tsx`:

  ```ts
  const REMINDER_ROW_ICONS: Record<ReminderType, IconComponent> = {
    vaccine: Syringe,
    deworming: Bacteria,
    medication: Pill,
    appointment: Stethoscope,
    weight: Weight,
    food: Bone,
    custom: Bell,
  };
  ```

  | `ReminderType` | icono `reicon` | hueco (de `REMINDER_TYPE_META`) | superficie | tinta |
  |---|---|---|---|---|
  | `vaccine` | **`Syringe`** | `blue` | `bg-category-blue` | `category-blue-strong` |
  | `deworming` | **`Bacteria`** | `violet` | `bg-category-violet` | `category-violet-strong` |
  | `medication` | **`Pill`** | `amber` | `bg-category-amber` | `category-amber-strong` |
  | `appointment` | **`Stethoscope`** | `green` | `bg-category-green` | `category-green-strong` |
  | `weight` | **`Weight`** | `neutral` | `bg-default` | `muted` |
  | `food` | **`Bone`** | `rose` | `bg-category-rose` | `category-rose-strong` |
  | `custom` | **`Bell`** | `neutral` | `bg-default` | `muted` |

  AND el icono SHALL renderizarse con `size={20}` y
  `color={<tinta resuelta>}`, **a través de una variable**
  (`<Icon size={20} color={ink} />`), **nunca** con siete etiquetas JSX
  literales: `#70 R13` asserta `source.match(/<Syringe\s+size=\{20\}/g)` con
  longitud **2** y siete literales lo romperían;
  AND el **hueco de color** SHALL leerse de `REMINDER_TYPE_META[type].category`
  —**el mapa nuevo aporta solo el icono**, la categoría la sigue mandando
  `src/utils/reminder-meta.ts`, que ya la reparte y ya la usa `/reminders`—;
  AND la **tinta** SHALL resolverse con `useThemeColors`, en **una sola llamada
  de longitud fija**, traduciendo el hueco así:
  `slot === 'neutral' ? 'muted' : \`category-${slot}-strong\`` —porque
  `category-neutral-strong` **no es un token**: `CATEGORY_SLOTS.neutral` vale
  `{ surface: 'bg-default', ink: 'text-muted' }`—;
  AND THE SYSTEM SHALL **no** escribir en `src/screens/home/index.tsx` ninguna
  clase literal `bg-category-*` ni `text-category-*`, ni interpolarlas: se
  consumen por `CATEGORY_SLOTS[...]`, que es lo único que el candado `#64 R9`
  (`consistency-classnames.test.ts:404`) admite;
  AND THE SYSTEM SHALL **no** usar emoji como icono, ni el de
  `REMINDER_TYPE_META[type].emoji`, ni ningún glifo tipográfico (`#70 R13`,
  `#62 R7`);
  AND THE SYSTEM SHALL **no** instalar ninguna dependencia:
  `reicon-react-native` ya lo es, y los siete nombres están verificados
  presentes en `node_modules/reicon-react-native/index.d.ts`. El veto **nominal**
  a `expo-linear-gradient` sigue vivo y aquí no se ejerce ninguna autorización.
  - **`reminder-meta.ts` queda con dos representaciones a propósito** —emoji
    para `/reminders`, icono para la Home— y **no se toca**: es el coste que la
    decisión **D-G** acepta por escrito para no romper #70 R13 ni la coherencia
    de la Home consigo misma.
  - **Ninguno de los siete choca con los cinco glifos de la barra de
    pestañas** —`Home`, `Map`, `HeartPulse`, `ForkKnife`, `Profile`
    (`floating-tab-bar.tsx:49-54`)—, que es la coincidencia que sí importa. Por
    eso `food` es **`Bone`** y no `ForkKnife`.
  - **`Syringe` y `Weight` se repiten a propósito** con la fila de la vacuna y
    con el tile `quick-action-weight`: dos glifos distintos para un mismo
    concepto en una misma app es peor que uno repetido (precedente #71 R7). Las
    aserciones se hacen **con `within(fila)`**, que es lo que hace inofensiva la
    repetición.
  - **El doble de `reicon`** de `index.test.tsx:86-102` SHALL ganar **cinco**
    entradas nuevas, siguiendo la convención de nombre por icono:
    `Bacteria: mockIcon('icon-bacteria')`, `Pill: mockIcon('icon-pill')`,
    `Stethoscope: mockIcon('icon-stethoscope')`, `Bone: mockIcon('icon-bone')`,
    `Bell: mockIcon('icon-bell')`. `Syringe` y `Weight` ya están y **no se
    renombran**. Es fichero de test: no cuenta como rojo.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R6: cada tipo trae su icono, su hueco y su tinta')`
    - `it('liga icono, superficie y tinta a su tipo')`: con la fixture de tres
      filas (`appointment`, `food`, `medication`) y
      `jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((token) => token)`,
      asserta por cada fila, **con `within(fila)`**: el `testID` del icono
      (`icon-stethoscope`, `icon-bone`, `icon-pill`), `icon.props.color`
      (`'--color-category-green-strong'`, `'--color-category-rose-strong'`,
      `'--color-category-amber-strong'`) y el `className` del disco
      (`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.green.surface}`,
      … `.rose.`, … `.amber.`).
    - `it('resuelve el hueco neutral con bg-default y tinta muted')`: una fila
      `custom` → `icon-bell`, `icon.props.color === '--color-muted'` y disco con
      `${CATEGORY_SLOTS.neutral.surface}`.
    - `it('cubre los siete tipos y no inventa la categoría')`: lee
      `src/screens/home/index.tsx` con `readFileSync` y asserta que el bloque
      `REMINDER_ROW_ICONS` nombra los **siete** `ReminderType` y **no** contiene
      ningún literal `'blue'`/`'amber'`/`'green'`/`'violet'`/`'rose'`/`'neutral'`
      —la categoría no se duplica, se lee de `REMINDER_TYPE_META`—.

### R7 — Cruzar cualquier decisión entre dos filas pone la suite roja

- **R7**: WHEN dos filas de recordatorio coexistan THE SYSTEM SHALL mantener
  cada una de estas **doce decisiones de conducta** (carta §Enmienda #70) ligada
  a su propia fila, observado **siempre con `within(fila)`**, y cruzarlas entre
  dos filas SHALL poner la suite roja:

  | # | Decisión de la fila | Dónde se cierra |
  |---|---|---|
  | 1 | **el dato que muestra** (título, fecha, contador) | R5 + este R7, tres `testID` por fila con texto exacto y `not.toHaveTextContent` cruzado |
  | 2 | componente de icono | R6, `within(fila).getByTestId('icon-…')` |
  | 3 | etiqueta visible / clave de copy | R5: **no hay etiqueta de tipo**; el contador sale de `dueCountdown` y de las cuatro claves `home.nextVaccine*` |
  | 4 | **nombre accesible** | R8: solo el contador declara `accessibilityLabel`; título, fecha, disco e icono **no** |
  | 5 | color o hueco de fondo | R6, `disco.props.className` por fila |
  | 6 | **tinta del icono** | R6, `icon.props.color` por fila |
  | 7 | **color y receta tipográfica de CADA texto** (son **tres**) | R10, `props.className` con `toBe` en título, fecha y contador |
  | 8 | destino de navegación | R8: **ninguno**, las filas no son pulsables |
  | 9 | **condición de render** | R3 + R5, verificada en **cuatro** escenarios: 0, 1, 3 y 5-recortado-a-3 |
  | 10 | **forma del contenedor** en **todas** sus ramas | R10, `flex-row items-center gap-3` en cada fila de recordatorio, y las dos ramas de #70 (fila de vacuna y estado vacío) siguen candadas por #70 R12/D7-O5 |
  | 11 | **envoltorio de agrupación** `flex-1` | este R7, `fila.children[1]` |
  | 12 | **orden de los hijos** | este R7, `fila.children[i]` y `grupo.children[i]` |

  AND THE SYSTEM SHALL fijar la **posición** de los hijos, no solo su presencia:
  `fila.children[0]` es el disco, `fila.children[1]` es el agrupador con
  `props.className === 'flex-1'`, `fila.children[2]` es el contador; y dentro
  del agrupador, `grupo.children[0]` es el título y `grupo.children[1]` es la
  fecha;
  AND THE SYSTEM SHALL fijar las **cuatro dimensiones que #70 no tenía**:
  **cuántas filas como máximo** (3, R5), **el orden entre filas** (ascendente y
  observable, R5), **el empate** (por `id`, R3) y **la mezcla** (la ranura de la
  vacuna es `body.children[0]` y **nunca** lleva el dato de un recordatorio, ni
  al revés);
  AND del **contenedor** SHALL cerrarse identidad, orden y **cardinalidad con
  `children.length`**, nunca contando coincidencias de `testID` (R5).
  - **La posición es la dimensión que O6 dejó abierta en #70**:
    `within(fila).getByTestId(...)` es **agnóstico al orden**, así que
    intercambiar el título y la fecha deja la suite **entera** verde. Solo
    `grupo.children[i]` lo mata. Es el mismo mecanismo por el que #69, #71 y #70
    destaparon una dimensión por ronda.
  - **Invariantes compartidos, inventariados aparte** (no son decisiones por
    fila; se assertan una vez): tamaño de icono `20`; objetivo táctil **no
    aplica**, las filas no son tappables (R8); radio `rounded-card` vía el `Card`
    compartido y `rounded-full` en disco y píldora (R10); rol y agrupación
    accesible **ausentes** en sección, cuerpo y filas (R8); sitio de render
    dentro de `reminders-section-body` (R5); feedback de pulsado **no aplica**
    (R8).
  - **Este requisito añade candados sobre código que R5 y R6 acaban de dejar
    correcto**, así que su rojo legítimo es la **mutación de producción**: se
    versiona en el commit rojo y se revierte en el verde (`CHECKPOINTS.md` C4,
    quinto punto). Las mutaciones son **M9** (cruce de dato) y **M10** (cruce de
    posición); ver R15.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R7: ninguna fila lleva el dato ni el sitio de otra')`
    - `it('no cruza ningún dato entre las tres filas ni con la vacuna')`: para
      cada una de las tres filas y `within(fila)`, asserta que su título, su
      fecha y su contador tienen **su** texto y que **ninguno** contiene el
      texto de otro nodo de la misma fila ni de otra fila ni de
      `reminders-next-vaccine`; y que `'Antirrábica'` no aparece en ninguna fila
      de recordatorio.
    - `it('fija la posición de los hijos de cada fila')`: por cada fila,
      `fila.children` con longitud **3**, `fila.children[1]` con
      `props.className === 'flex-1'`, `fila.children[0]` conteniendo el icono,
      `fila.children[2]` con el `testID` `…-days`; y `grupo.children[0]` /
      `grupo.children[1]` con los `testID` `…-title` / `…-date`.

### R8 — Las filas no son pulsables, y la sección se sigue anunciando por partes

- **R8**: WHEN un lector de pantalla recorra la sección THE SYSTEM SHALL dejar
  que anuncie el rótulo, **un solo botón** (el enlace `reminders-see-all` de
  #70 R10) y el contenido de cada fila por separado;
  AND las filas de recordatorio SHALL ser **no pulsables**: sin `onPress`, sin
  `accessibilityRole="button"` y sin navegación. La `Card` compartida solo se
  vuelve `Pressable` si recibe `onPress` (`card.tsx:31-40`), así que basta con
  no pasarlo;
  AND THE SYSTEM SHALL **no** declarar `accessible` ni `accessibilityLabel` en
  `reminders-section`, en `reminders-section-body` ni en ninguna fila de
  recordatorio, que colapsarían el nodo en uno solo;
  AND `reminders-item-<id>-days` SHALL declarar `accessibilityLabel` con el
  `label` de `dueCountdown` —el texto expandido—, porque su texto visible es una
  **abreviatura** (`3 d`) que un lector de pantalla no puede desplegar solo;
  AND el título y la fecha SHALL bastar con su texto visible: **no** se añade
  `accessibilityLabel` redundante;
  AND el **icono** SHALL quedar sin nombre accesible: el tipo es una
  categorización redundante de un título que el propio dueño escribió, y
  nombrarlo obligaría a meter siete `labelKey` de ámbito `reminderType.*` en la
  Home, moviendo `R3_HOME` **+7** para no aportar información nueva. Queda
  declarado, no olvidado (§Decisiones abiertas).
  - **Por qué las filas no son pulsables** (decisión **D-E**): #70 R10 tiene un
    candado vivo —`it('no añade un segundo camino a la lista desde la Home')`,
    `index.test.tsx:2123`— que prohíbe un segundo camino a `/reminders`
    desde la Home, y el enlace de la cabecera ya va ahí. Hacer la fila pulsable
    duplicaría el destino y rompería ese candado. Abrir el **detalle** de un
    recordatorio —destino distinto, que hoy no existe— sería otra feature.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R8: las filas no son pulsables y se anuncian por partes')`
    - `it('deja un único botón en la sección')`: con las tres filas presentes,
      `within(section).getAllByRole('button').map((n) => n.props.testID)` igual a
      `['reminders-see-all']`. **Extiende a un escenario con filas el candado que
      `#70 R11` solo ejercía con la sección vacía de recordatorios.**
    - `it('no navega al pulsar una fila')`: `fireEvent.press` sobre cada fila y
      `mockRouter.push` **no llamado**; `props.onPress` y
      `props.accessibilityRole` **undefined** en las tres.
    - `it('expande la abreviatura del contador y no añade nombres redundantes')`:
      `accessibilityLabel` de los tres contadores igual a `'Faltan 1 días'`,
      `'Faltan 3 días'`, `'Faltan 6 días'`; `accessibilityLabel` **undefined** en
      títulos, fechas y discos; `accessible` y `accessibilityLabel`
      **undefined** en `reminders-section`, `reminders-section-body` y las tres
      filas.

### R9 — Cargando y fallando: ni fila fantasma, ni error propio

- **R9**: WHILE `reminders.data === undefined` THE SYSTEM SHALL renderizar
  **cero** filas de recordatorio y **ningún** esqueleto adicional;
  AND IF `reminders.data.kind` es distinto de `'ok'` —`'not-found'`,
  `'unauthorized'`, `'error'`, `'unreachable'` o `'missing-config'`— THEN THE
  SYSTEM SHALL renderizar **cero** filas, **sin** mensaje de error propio y
  **sin** botón de reintento;
  AND en los dos casos la cabecera de la sección —rótulo y enlace— y la ranura
  de la vacuna SHALL seguir renderizándose exactamente como hoy: el fallo de
  `listReminders` **no** puede apagar el dato del perfil, ni al revés.
  - **Por qué ningún esqueleto propio para la lista.** La sección ya pinta el
    esqueleto de la ranura de la vacuna durante la misma carga (#70 R9): las dos
    peticiones arrancan juntas con el mismo `selectedPetId`, así que el cuerpo
    nunca está vacío mientras carga. Un esqueleto para un número de filas que
    todavía no se conoce prometería filas que pueden no existir —peor mentira
    que una ausencia breve— y la sección crece **hacia abajo**, sin reflujo de
    lo que el usuario está leyendo. C8 prohíbe el **spinner suelto**, no exige un
    esqueleto por cada trozo asíncrono. **Declarado, no omitido.**
  - **Por qué ningún error propio**: es el mismo argumento de #70 R9. La Home ya
    monta `pet-hero-error` con su `pet-hero-retry` justo arriba, en el mismo
    `home-content`; y el enlace `reminders-see-all` lleva a `/reminders`, que
    tiene su propia petición y su propio reintento. Un tercer mensaje sería el
    mismo fallo dicho tres veces en una pantalla.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R9: la sección aguanta la carga y el fallo de los recordatorios')`
    - `it('no pinta filas mientras carga')`: `mockListReminders` devolviendo
      `pending()` → `body.children.length === 1`, ranura de la vacuna presente,
      **cero** nodos cuyo `testID` empiece por `reminders-item-`, y **un solo**
      `reminders-section-skeleton` en el escenario de carga del perfil.
    - `it.each` sobre los **cinco** kinds de fallo →
      `body.children.length === 1`, `reminders-section-title` y
      `reminders-see-all` visibles, y **ningún** `testID` de la sección
      terminado en `-error` o `-retry`.

### R10 — Estilo: `Card` compartido, escala de radios, tintas de #64 y cifras tabulares

- **R10**: WHEN se renderice cualquier superficie de las filas nuevas THE SYSTEM
  SHALL usar el **`Card` compartido** de `src/components/card.tsx`, que ya trae
  `rounded-card`, el borde, el fondo y `CONTINUOUS_CORNER`, y SHALL **no**
  repetir esas clases a mano ni envolverlo para añadirle la esquina;
  AND SHALL usar **solo** la escala de tres radios de #62 R4: `rounded-card`
  (el `Card`), `rounded-full` (disco y píldora del contador) y `rounded-xl`
  (ninguno aquí). `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm`
  siguen **prohibidos**;
  AND la píldora del contador SHALL llevar el hueco **ámbar** en **todas** las
  filas, sea cual sea el tipo —el ámbar significa *urgencia*, no *tipo*; el tipo
  lo porta el disco (R6)—, con `style={TABULAR_NUMS}` de
  `src/theme/native-styles.ts`;
  AND SHALL **no** usar `bg-accent-soft` (el total de 16 de
  `consistency-classnames.test.ts:433` no se mueve), **no** usar
  `text-accent-strong` fuera del enlace que ya existe, y **no** añadir,
  renombrar ni cambiar ningún token de `src/theme/global.css`;
  AND SHALL mantener el `gap-2` de `reminders-section-body` y el `gap-3` de
  `reminders-section` tal cual: la separación entre filas ya la da el `gap-2` y
  **no** se añade separador, margen negativo ni borde entre filas.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#85 R10: viste las filas con el Card compartido y los tokens')`
    - `it('aplica la receta de cada nodo y ninguna otra')`: por cada una de las
      tres filas, `fila.props.className` contiene
      `'rounded-card border border-border bg-surface p-4 shadow-sm'` y
      `'flex-row items-center gap-3'`; `titulo.props.className` **`toBe`**
      `'text-sm font-semibold text-foreground'`;
      `fecha.props.className` **`toBe`** `'text-xs font-normal text-muted'`;
      `contador.props.className` **`toBe`**
      `` `rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}` ``;
      `contador.props.style` **`toEqual(TABULAR_NUMS)`**; y `props.style`
      **undefined** en título y fecha.
    - **Se asserta con `toBe`, no con `toContain`**: intercambiar la receta del
      título con la de la fecha no mueve ningún inventario global —las mismas
      clases siguen presentes, solo cambian de nodo— y con `toContain` la suite
      quedaría verde. Es el defecto #81, y el que #70 D6 tuvo que cerrar a
      posteriori en la fila de la vacuna.

### R11 — Copy: cero claves nuevas, cero ocurrencias nuevas, y los dos idiomas registrados

- **R11**: WHEN esta feature toque la copy THE SYSTEM SHALL **no** añadir,
  quitar ni renombrar **ninguna** clave de `src/i18n/catalog.ts`: solo cambia el
  **valor** de `home.reminders` y `home.remindersSeeAll` en los dos idiomas
  (R1);
  AND THE SYSTEM SHALL **no** añadir ni quitar ninguna ocurrencia de
  `t('<clave>')` ni de `labelKey: '<clave>'` en
  `src/screens/home/index.tsx`: las filas de recordatorio no llevan etiqueta de
  tipo (R5, R8) y comparten `dueCountdown` con la fila de la vacuna (R5), así
  que las cuatro claves del contador siguen con **una** ocurrencia cada una;
  AND en consecuencia:
  - `src/providers/__tests__/language-provider.test.tsx:41` —el **candado de
    longitud del catálogo**— **no se toca**: su suma
    `260 + 16 + 1 + 4 + 7` se queda **igual**. **Delta de #85: `+ 0`.**
  - `src/__tests__/ui-copy-table.ts` §`R3_HOME` **no gana ni pierde filas**, y
    `src/__tests__/ui-language.test.ts:83` conserva su suma
    `21 + 15 + 1 + 4 + 7`. **Delta de #85: `+ 0`.**
  - `src/__tests__/ui-language.test.ts:88-119` (bloque `#70 R16`) **no se
    toca**: sigue enumerando las mismas siete claves y exigiendo su fila en
    `specs/mobile-ui-language/design.md`.
  - `specs/mobile-ui-language/design.md` §2 **no se toca**: sus filas de
    `home.reminders` y `home.remindersSeeAll` (`:312-313`) **ya leen**
    `Reminders`/`Recordatorios` y `See all`/`Ver todos` —D8 cambió el catálogo y
    dejó la carta sin actualizar—, así que R1 devuelve el catálogo a lo que la
    carta de idioma ya decía. **Verificado contra el árbol; si al implementar no
    fuera así, se corrige el valor de la fila, nunca un recuento.**

  IF algún candado de recuento de copy se mueve THEN **para y repórtalo**: sería
  la señal de que se ha colado una clave o una ocurrencia que esta spec no
  prevé. **No lo absorbas subiendo el número.**
  - **La fila del catálogo va la primera a propósito.**
    `language-provider.test.tsx:41` se omitió en las specs de #68 y de #69 y
    **paró la implementación las dos veces**. Aquí su delta es cero, pero se
    declara igual: *"no aplica"* sin nombrarlo es exactamente lo que falló.
  - Test: los propios candados, en verde y sin editar, más el `it` en inglés de
    R1 y la mutación **M13** de R15, que demuestra que ese `it` muerde.

### R12 — Cero drift de estilo en los ficheros de esta feature

- **R12**: WHEN esta feature termine THE SYSTEM SHALL mantener, en **todos** los
  ficheros que toca, cero literales hexadecimales, cero clases arbitrarias
  `[...]`, cero `StyleSheet` y cero clases de radio fuera de la escala de
  #62 R4;
  AND SHALL añadir a `src/__tests__/design-drift.test.ts` un bloque propio
  `describe('#85 R12: la sección de recordatorios reales no mete drift de estilo')`
  con **su** lista nominal de ficheros —`i18n/catalog.ts`,
  `screens/home/format.test.ts`, `screens/home/format.ts`,
  `screens/home/index.test.tsx`, `screens/home/index.tsx`— y el mismo patrón
  `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` que ya usan los bloques `R9`,
  `#68 R18`, `#69 R13`, `#71 R13` y `#70 R17`;
  AND el título del `it` SHALL **no** contener el número de ficheros escrito con
  letra —dos títulos anteriores lo hicieron y caducan en cuanto la lista
  cambia—: es `'mantiene sus ficheros sin escapes de estilo literales'`.
  - **Por qué un bloque propio pudiendo confiar en el de #70.** La lista de #70
    R17 cubre hoy casi los mismos ficheros, pero **no hay barrido global de hex
    fuera de `src/theme/`** (§0.1 premisa 12): si mañana alguien reordena o
    recorta la lista de #70, la cobertura de #85 desaparecería **en silencio**.
    Es el mismo argumento que #70 escribió contra las listas de #68, #69 y #71,
    y sigue siendo cierto. La lista de #85 **difiere** de la de #70 en que
    **no** incluye `api/types.ts`: esta feature no lo toca.
  - **Declarado por escrito**: R12 es un candado de **cadena literal**, no de
    conducta. Lo mismo vale para la lectura de fuente de R6. Los requisitos de
    **conducta** —R1..R11— se fijan sobre la salida renderizada o sobre el valor
    devuelto por una función pura, y son ésos los que llevan mutación (R15).
  - Test: `src/__tests__/design-drift.test.ts` :: el bloque nuevo.

### R13 — Los candados globales se mueven por **sumando** declarado contra `20c7b3c`

- **R13**: WHEN se actualicen los candados de recuento THE SYSTEM SHALL
  registrar **sumandos contra `20c7b3c`**, nunca cifras absolutas escritas a
  mano, y SHALL distinguir **reubicación** (la ruta cambia, la cifra no) de
  **delta real**. Esta feature **no reubica nada**: no mueve ni crea ningún
  fichero de producción.

  | # | Candado | Fichero del candado | Delta de #85 | Motivo |
  |---|---|---|---|---|
  | 1 | **longitud del catálogo** | `src/providers/__tests__/language-provider.test.tsx:41` | **`+ 0`** — la suma `260 + 16 + 1 + 4 + 7` **no se toca** | R1 cambia **valores**, no claves (R11). *Éste es el candado que se olvidó en #68 y en #69 y paró el trabajo las dos veces; se enumera el primero aunque su delta sea cero.* |
  | 2 | filas de `R3_HOME` | `src/__tests__/ui-copy-table.ts:45-87` y `ui-language.test.ts:83` | **`+ 0`** — la suma `21 + 15 + 1 + 4 + 7` **no se toca** | R11: cero ocurrencias `t()` nuevas, porque `dueCountdown` se comparte y las filas no llevan etiqueta de tipo |
  | 3 | lista literal de claves de `#70 R16` | `ui-language.test.ts:88-119` | **sin cambio** | R11: las siete claves siguen existiendo con el mismo nombre |
  | 4 | **`#62 R15` cifras tabulares** | `consistency-classnames.test.ts:334-382` | **cuatro mandos que se mueven juntos**: constante nueva `HOME_TABULAR_DELTA_85 = 1` junto a `HOME_TABULAR_DELTA_70` (`:337`); la fila de `screens/home/index.tsx` (`:340-343`) pasa a `HOME_TABULAR_AT_9358CC7 + HOME_TABULAR_DELTA_69 + HOME_TABULAR_DELTA_70 + HOME_TABULAR_DELTA_85`; el total cerrado (`:360`) `14 + 4 + 1 + 1` → **`14 + 4 + 1 + 1 + 1`**; la guarda `#69 R14` (`:365-368`) pasa a `.toBe(HOME_TABULAR_DELTA_69 + HOME_TABULAR_DELTA_70 + HOME_TABULAR_DELTA_85)`; y la guarda `#70 R18` (`:373-381`) pasa a `.toBe(HOME_TABULAR_DELTA_70 + HOME_TABULAR_DELTA_85)` | el `style={TABULAR_NUMS}` de la píldora de las filas (R10). Es **un solo literal en el fuente**, dentro del `.map`, aunque pinte hasta tres filas: el candado cuenta ocurrencias de texto, no nodos |
  | 5 | bloque de drift de estilo | `design-drift.test.ts` | **`+ 1` `describe`** | R12 |
  | 6 | doble de `reicon` de la Home | `screens/home/index.test.tsx:86-102` | **`+ 5` entradas** (`Bacteria`, `Pill`, `Stethoscope`, `Bone`, `Bell`) | R6. Es fichero de **test**: no cuenta como rojo |
  | 7 | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:273` y total en `:328-330` | **sin cambio** (`screens/home/index.tsx` sigue en `2`; total `33 + 1 + 1`) | R10: las filas usan el `Card` compartido, que ya trae la esquina; disco y píldora son **cápsula** (`rounded-full`) y no la llevan |
  | 8 | `#64 R9` clases categóricas | `consistency-classnames.test.ts:404` | **sin cambio**: `inventory.files` sigue siendo `['utils/category-palette.ts']` y `interpolatedFiles` sigue `[]` | R6: se consumen por `CATEGORY_SLOTS[...]`; el token de tinta se compone como `` `category-${slot}-strong` ``, que **no** casa con `/(?:bg\|text)-category-\$\{/` — es el mismo patrón que `quickActionInks` ya usa (`index.tsx:128-130`) |
  | 9 | `#64 R9` usos de `bg-accent-soft` | `consistency-classnames.test.ts:433` | **sin cambio** (16) | R10 |
  | 10 | `#61 R4` acento como tinta | `legibility-classnames.test.ts:123` y `:135-139` | **sin cambio** (`screens/home/index.tsx` sigue en `2`; total `13 + 1`) | R10: no hay `text-accent-strong` nuevo |
  | 11 | `#61 R5` `text-warning-strong` | `legibility-classnames.test.ts:152-172` | **sin cambio** | es `toContain`, sin recuento, y las filas no usan esa tinta |
  | 12 | `#62 R1` botones primarios | `consistency-classnames.test.ts:97-104` | **sin cambio** (13) | R8: las filas no son botones |
  | 13 | `#62 R4` escala de radios | `consistency-classnames.test.ts:150-155` | **sin cambio** (listas vacías) | R10 |
  | 14 | `#62 R7` glifos como icono | `consistency-classnames.test.ts:194-216` | **sin cambio** (`[]` y 3) | R6: iconos de reicon, cero emoji, cero `›` |
  | 15 | `#70 R13` icono y emoji en la Home | `index.test.tsx:2270-2285` | **sin cambio**: `<Syringe size={20}` sigue apareciendo **2** veces y `💉` cero | R6: el icono de fila se renderiza **por variable**, no con siete etiquetas literales |
  | 16 | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:357` | **sin cambio** (`19 + 2`) | toda la copy sigue en `src/screens/home/index.tsx`; **por eso la sección no se saca a un módulo propio** |
  | 17 | orden de `home-content` (#68, #69, #71, #70 R14) | `index.test.tsx:1205-1235`, `:1401-1438`, `:1760-1798`, `:2286-2337` | **sin cambio** | la sección no cambia de sitio ni gana hermanos |
  | 18 | rutas delgadas | `design-drift.test.ts:112-134` | **sin cambio** | `src/app/(tabs)/home.tsx` no se toca |
  | 19 | consistencia entre idiomas | `language-provider.test.tsx:42-47` y `ui-language.test.ts:347-350` | **cuadran solos** | comparaciones relativas, sin cifra |
  | 20 | `ALL_USES` vs. suma de bloques | `ui-copy-table.ts:407-415` | **cuadra solo** | ya es consistencia interna |
  | 21 | e2e del listado de recordatorios | `backend-pet-tracker/test/pet-reminders.e2e-spec.ts:143-144` | **sin cambio** | R4: cero backend. Si este test se mueve, alguien filtró en servidor |

  El implementer sustituye cada número por el que devuelva el propio `grep`; el
  reviewer comprueba el **sumando**, no el valor. IF un total cerrado se mueve
  por una causa que esta tabla no prevé THEN **para y repórtalo**.
  - **La fila 4 es la más delicada**: cinco expresiones en el mismo fichero que
    solo cuadran si se mueven a la vez, y dos de ellas viven dentro de `it`
    titulados `#69 R14` y `#70 R18`. Tocarlos **no** es enmendar #69 ni #70: es
    el uso previsto del mecanismo de delta que esas features dejaron montado con
    constantes nombradas.
  - Test: los propios candados, en verde, con los deltas aplicados.

### R14 — Verificación: suite verde, typecheck y grep-clean

- **R14**: WHEN el reviewer valide la feature THE SYSTEM SHALL presentar la
  suite móvil completa en verde —`bun run test` y `bun run typecheck` desde
  `mobile-pet-tracker/`— **sin exportar `TZ`**, sin debilitar ni eliminar ningún
  assert de conducta y sin renombrar ningún `testID` **de producción** que ya
  existiera;
  AND SHALL mantener el grep-clean de la carta §Decisiones fijas 3 intacto:
  **cero** hex fuera de `src/theme/`, **cero** clases arbitrarias `[...]`,
  **cero** `StyleSheet.create`, **cero** shadow/elevation legacy y **cero**
  clases de radio fuera de la escala de #62 R4;
  AND `git diff --stat` SHALL no mostrar ficheros fuera de
  `mobile-pet-tracker/`, `specs/`, `progress/` y `feature_list.json`.
  - Antes de tocar código: borrar `mobile-pet-tracker/.expo/types/router.d.ts`
    si existe (está gitignorado y rompe el typecheck con rutas fantasma), y
    comprobar con `pgrep -f init.sh` que no hay otro gate corriendo en un
    worktree hermano, porque comparten el Postgres de docker.
  - **Gate humano, no delegable**: prueba de humo en **dev build de Android**
    (no Expo Go), en los **dos temas**, con al menos: una mascota **con**
    recordatorios y **sin** vacuna próxima; una **con** las dos cosas; y una
    **sin** ninguna de las dos.

### R15 — Prueba de mutación: cada candado ha de haberse visto fallar

- **R15**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar, con
  estas **trece** mutaciones plantadas **de una en una** y la evidencia en
  `progress/impl_mobile-home-reminders-real-data.md` §prueba de mutación, que la
  suite se pone **roja** con cada una y que el rojo cae **por el `it` que la
  tabla nombra**:

  | # | Mutación (en código de **producción**) | Test que DEBE caer | ¿Muere siempre? |
  |---|---|---|---|
  | M1 | `localDayOf` usa `getUTCFullYear/getUTCMonth/getUTCDate` en vez de los getters locales | `format.test.ts` :: `#85 R2` → `it('toma el día civil de los getters locales, nunca de los UTC')` | **Sí, en cualquier `TZ`.** El doble sesgado hace discrepar local y UTC por construcción. **Si solo muere exportando `TZ`, el candado no vale y se para** |
  | M2 | la Home pasa `reminder.dueAt` **crudo** a `calendarDaysUntil` y a `fmtDate`, sin `localDayOf` | `index.test.tsx` :: `#85 R5` → `it('pinta fecha y contador reales para un dueAt con hora')` | **Sí.** `NaN d` e `Invalid Date` en cualquier zona |
  | M3 | el filtro pierde la cláusula `status === 'scheduled'` | `format.test.ts` :: `#85 R3` → `it('descarta enviados, cancelados y pasados, y conserva el de hoy')` | **Sí.** Entran `rem-sent` y `rem-cancelled` |
  | M4 | el filtro pierde la cláusula de futuro (`>= 0`) | mismo `it` que M3 | **Sí.** Entra `rem-past`. **M3 y M4 caen por motivos distintos y con ids distintos**: si las dos producen el mismo fallo, la fixture está mal construida |
  | M5 | el corte pasa de `>= 0` a `> 0` | mismo `it` que M3 | **Sí.** Desaparece `rem-today`, que es el que prueba que el día de hoy entra (§0.4) |
  | M6 | el comparador pierde el **desempate por `id`** y devuelve `0` en el empate | `format.test.ts` :: `#85 R3` → `it('desempata por id ascendente')` | **Condicional.** Muere **solo** porque la fixture entrega el par empatado en orden **invertido** (`rem-z` antes que `rem-a`): el `sort` estable conservaría ese orden. **Verde esperado en la condición contraria**: si alguien "ordena" la fixture y entrega `rem-a` antes que `rem-z`, esta misma mutación deja la suite **verde**. Por eso el orden de la fixture es normativo y **no se toca** |
  | M7 | el comparador se invierte (`b.dueAt.localeCompare(a.dueAt)`) | `format.test.ts` :: `it('ordena por fecha ascendente')` **y** `index.test.tsx` :: `it('las ordena por fecha ascendente bajo la fila de la vacuna')` | **Sí** |
  | M8 | `slice(0, 3)` pasa a `slice(0, 4)` | `format.test.ts` :: `it('devuelve como mucho tres')` **y** `index.test.tsx` :: `it('corta en tres aunque haya cinco')` | **Sí** |
  | M9 | se **cruza el dato** dentro de la fila: el nodo del título pinta la fecha y el de la fecha pinta `reminder.title` | `index.test.tsx` :: `#85 R7` → `it('no cruza ningún dato entre las tres filas ni con la vacuna')` | **Sí.** *Ésta se versiona en el commit rojo de R7 y se revierte en el verde* |
  | M10 | se **intercambia la posición** de los dos hijos del agrupador (fecha primero, título después), **sin tocar los `testID`** | `index.test.tsx` :: `#85 R7` → `it('fija la posición de los hijos de cada fila')` | **Condicional por diseño.** **Verde esperado en la condición contraria**: con solo aserciones `within(fila).getByTestId(...)` la suite queda **entera verde**, porque son agnósticas al orden. Si M10 no pone rojo, R7 está mal escrito y **se para antes de seguir**. *Se versiona en el commit rojo de R7* |
  | M11 | se añade a `reminders-section-body` un hijo intruso **sin `testID`**: `<View className="h-1.5 rounded-full bg-default" />` | `index.test.tsx` :: `#85 R5` → `it('cuenta los hijos del cuerpo en tres escenarios')` | **Sí** — *si el recuento se hace con `children.length`*. **Si queda verde, la cardinalidad se está contando por coincidencias de `testID` y hay que arreglarlo antes de seguir** (lección #71 O7, re-armada) |
  | M12 | se cruza el icono de dos tipos en `REMINDER_ROW_ICONS` (`medication: Stethoscope`, `appointment: Pill`) | `index.test.tsx` :: `#85 R6` → `it('liga icono, superficie y tinta a su tipo')` | **Sí.** La fixture incluye los dos tipos |
  | M13 | `en['home.reminders']` pasa de `Reminders` a `Recordatorios` en `src/i18n/catalog.ts` | `index.test.tsx` :: `#85 R1` → `it('rotula en inglés')` | **Sí.** Es la prueba de que el candado inglés de D-H **muerde de verdad** y no es decorativo (hallazgo O7) |

  - **Las trece son mutaciones de código de producción**, y **ninguna puede
    plantarse en el doble de `reicon`, en `makePet`, en `makeReminder` ni en
    ningún otro mock**: `CHECKPOINTS.md` C4, quinto punto, añadido el 2026-09-08
    tras #69 precisamente por eso. Mutar un doble demuestra que la aserción
    puede fallar, no que vigile la app.
  - **Una mutación que muere siempre, o que muere por la razón equivocada, no
    demuestra nada.** Por eso M6 y M10 llevan escrito **cuál es el verde
    esperado en la condición contraria**, y por eso M1 lleva escrito que su rojo
    **no puede depender del `TZ` del runner** (es literalmente el fallo que
    costó el rechazo del primer pase de #70, y el que #70 D7/O4 tuvo que
    reabrir).
  - **M9, M10 y las de R7 se versionan en el commit rojo y se revierten en el
    verde** (C4 vía (b) más el quinto punto). Las demás se plantan como
    verificación de cierre, con su evidencia escrita: qué se mutó, qué `it`
    cayó, con qué mensaje, y el `git diff` vacío después de restaurar.
  - Test: requisito de verificación; la evidencia es el informe.

---

## Enmiendas a specs aprobadas

Seis, **todas a #70**, y ninguna toca su estado de aprobación ni ningún
requisito distinto de los que se nombran. `docs/ui-guidelines.md`,
`docs/conventions.md`, #61, #62, #64, #65, #67, #68, #69, #71 y #39/#47
**no se enmiendan**: ninguna decisión de esta spec las contradice.

### A0 — Qué candados de #70 se borran, cuáles se adaptan y cuáles siguen intactos

El informe §6 avisaba de siete candados en riesgo. Contrastados uno a uno contra
`src/screens/home/index.test.tsx` en `20c7b3c`, **ninguno se borra**: la fila de
la vacuna sigue existiendo exactamente igual, y por eso casi todo sobrevive.

| Candado de #70 | Dónde | Veredicto | Por qué |
|---|---|---|---|
| **R1** cabecera y estructura | `:1882-1905` | **se adapta** (dos literales) | A4: `'Próxima vacuna'` → `'Recordatorios'`, `'Ver recordatorios'` → `'Ver todos'`. La estructura de dos hijos de `reminders-section` **no cambia** |
| **R9** `deja el cuerpo con un solo hijo` | `:2061-2097` | **se adapta** (solo el título) | A3: sus tres aserciones siguen valiendo tal cual —son el caso `n = 0`—; el título prometía un invariante general que ya no existe |
| **R15** `sin llamadas nuevas` | `:2339-2352` | **se adapta** (se refuerza) | A1: `{ pets, detail, activity }` → `{ pets, detail, activity, reminders }`, una cada uno |
| **R7** función del contador | `index.tsx:90-108` | **se adapta** (solo el nombre) | A2: `vaccineCountdown` → `dueCountdown`; ningún test la nombra, verificado con `grep` |
| **R6** datos de la vacuna | `:1908-1949` | **intacto** | La fila de la vacuna no se toca. Sus tres nodos, sus recetas y su fixture siguen igual |
| **R7** tres ramas del contador | `:1955-1984` | **intacto** | Mismas ramas, mismos literales `5 d` / `Faltan 5 días` / `Vencida`, misma función |
| **R8** estado vacío | `:1986-2022` | **intacto** | `reminders-none-upcoming` y `'Sin vacuna próxima'` siguen igual: es la rama vacía de **la ranura de la vacuna**, no de la sección (R9, §Fuera de alcance) |
| **R11** accesibilidad | `:2167-2214` | **intacto y reforzado** | A6: se conserva y R8 añade el mismo assert en un escenario **con filas**, que es donde podía colarse un segundo botón |
| **R3** barra de comidas fuera | `:2353-2370` | **intacto** | Su `body.children` con longitud 1 sigue siendo cierto: su escenario no tiene recordatorios elegibles (la factoría del mock devuelve `[]`) |
| **R10** enlace a `/reminders` | `:2103-2165` | **intacto** | R8/D-E: las filas no son pulsables, así que sigue habiendo **un solo** camino a la lista |
| **R12** `Card` y tokens | `:2216-2269` | **intacto** | La fila de la vacuna y el estado vacío conservan sus recetas; las filas nuevas tienen las suyas en R10 |
| **R13** icono y cero emoji | `:2270-2285` | **intacto** | R6: el icono de fila se renderiza **por variable**, así que `<Syringe size={20}` sigue apareciendo **2** veces |
| **R14** posición de la sección | `:2286-2337` | **intacto** | La sección no se mueve ni gana hermanos |
| **R2** tipado de `nextVaccine` | `:1859-1879` | **intacto** | `src/api/types.ts` **no se toca**: `Reminder` ya está tipado desde #47 |
| **R17** bloque de drift | `design-drift.test.ts:275-295` | **intacto** | R12 añade el suyo **aparte**, con su propia lista |
| **R18** tabla de deltas | — | **intacto** | R13 es la tabla de #85; la fila tabular de #70 se mueve por el mecanismo de constantes nombradas que la propia #70 montó |

**Ni un solo assert de #70 se debilita o se borra.** Los cuatro que se adaptan
lo hacen porque su *sujeto* cambió (la copy, el número de llamadas) o porque su
*nombre* prometía algo que dejó de ser cierto — nunca porque estorbaran.

### A1 — #70 R15 pierde la promesa de "cero llamadas nuevas"

- **Qué cambia**: la Home pasa de **3** peticiones al arranque a **4**. El `it`
  de R15 (`index.test.tsx:2340-2350`) pasa a asertar
  `{ pets: 1, detail: 1, activity: 1, reminders: 1 }`.
- **Por qué**: R4, decisión **D-K**. Es la consecuencia directa de la opción (b)
  y se dice de frente en vez de ignorar el requisito.
- **Qué NO cambia**: el resto de R15 sigue vivo —cero backend, cero ficheros de
  producción nuevos, `src/api/` intacto salvo el consumo de `listReminders`—.
  La aserción **se refuerza**, no se relaja: pasa de "tres" a "exactamente estas
  cuatro, una cada una".

### A2 — #70 R7: `vaccineCountdown` se llama `dueCountdown`

- **Qué cambia**: **solo el nombre** de la función de módulo, y que ahora la
  usan los dos tipos de fila.
- **Qué NO cambia**: la firma, las tres ramas, las cuatro claves de copy, los
  textos, el `accessibilityLabel` ni ningún test de #70 —ningún fichero fuera de
  `src/screens/home/index.tsx` nombra `vaccineCountdown`, verificado con `grep`—.

### A3 — #70 R9: la cardinalidad del cuerpo pasa de `1` a `1 + n`

- **Qué cambia**: `reminders-section-body` puede tener de **0** a **4** hijos:
  la ranura de la vacuna (0 en error, 1 en carga y en `ok`) más **0..3** filas
  de recordatorio. El `it('deja el cuerpo con un solo hijo')`
  (`index.test.tsx:2061-2097`) **conserva sus tres aserciones intactas** —siguen
  siendo el caso `n = 0`— y **solo se le corrige el título** a
  `it('deja el cuerpo con la fila de la vacuna y nada más cuando no hay recordatorios')`,
  porque el título prometía un invariante general que ya no es cierto (lección
  de D8: un nombre que promete lo que no hay es un defecto).
- **Qué NO cambia**: se sigue contando con `children.length` y **jamás** con
  coincidencias de `testID`; siguen siendo las mismas tres longitudes en los
  mismos tres escenarios; y M11 sigue plantando un intruso **sin `testID`**.
- **Nota**: el `it` de `#70 R3` (`:2353-2370`), que también asserta
  `body.children` con longitud **1**, **queda intacto y verde**: su escenario no
  tiene recordatorios elegibles porque la factoría del mock devuelve
  `{ kind: 'ok', reminders: [] }` por defecto (R4).

### A4 — #70 D8 queda revertida: la copy vuelve a "Recordatorios" / "Ver todos"

- **Qué cambia**: los **valores** de `home.reminders` y `home.remindersSeeAll`
  en los dos idiomas (R1), y los dos literales que el `describe('#70 R1: …')`
  asserta.
- **Por qué**: D8 fue un parche al **síntoma** —el título prometía
  recordatorios y la sección enseñaba vacunas— y dejó dicho por escrito que el
  arreglo de fondo era **#85**. Éste es #85.
- **Qué NO cambia**: las **claves** siguen llamándose igual, el número de claves
  del catálogo no se mueve, `home.noUpcomingVaccine` se queda como está, y
  ningún `testID` se renombra.

### A5 — #70 R16: las cuatro claves del contador sirven ahora a dos tipos de fila

- **Qué cambia**: nada en el árbol. Se **declara** que `home.nextVaccineDays`,
  `home.nextVaccineDaysLeft`, `home.nextVaccineToday` y
  `home.nextVaccineOverdue` resuelven también el contador de las filas de
  recordatorio, a través de `dueCountdown` (A2).
- **Por qué no se renombran**: obligaría a enmendar la lista literal de siete
  claves de `ui-language.test.ts:88-119` y la tabla de
  `specs/mobile-ui-language/design.md` §2, a cambio de cero valor para el
  usuario —las claves son identificadores de código, no texto visible—. Queda
  como deuda nombrada en §Decisiones abiertas.

### A6 — #70 R1 y R11: el andamiaje del test gana el mock de `listReminders`

- **Qué cambia**: el fichero `index.test.tsx` gana
  `jest.mock('../../api/reminders', …)` con implementación por defecto en la
  factoría (R4), y el `beforeEach` del `describe('#70 R1: …')` puede fijar
  fixtures propias de recordatorios cuando el `it` las necesite.
- **Qué NO cambia**: ningún assert de #70 se debilita. El `it` de `#70 R11`
  (`getAllByRole('button')`) se conserva **y se refuerza** con un escenario
  nuevo **con filas** en R8.

  - [X] Enmiendas A1-A6 aprobadas por humano

---

## Decisiones abiertas para el humano

Ninguna bloquea la implementación. Las tres son hallazgos verificados que
exceden el alcance.

- **E1 — Las cuatro claves `home.nextVaccine*` ya no son solo de vacuna.**
  Sirven al contador de las dos clases de fila (A5). Renombrarlas a
  `home.due*` es cosmética de código con coste real en dos candados y una
  tabla de spec. ¿Se hace en una feature de limpieza o se deja documentado?
- **E2 — `localTodayIso` está duplicado tres veces.**
  `src/app/(tabs)/health.tsx:28-33`, `src/app/(tabs)/weight-log.tsx:38-43` y
  `src/app/(tabs)/__tests__/weight-log.test.tsx:80`. `localDayOf` de #85 (R2) es
  su generalización parametrizada: `localTodayIso()` es exactamente
  `localDayOf(new Date().toISOString())`. Unificarlas tocaría dos pantallas
  fuera de alcance y sus tests. **Encaja de forma natural con #84**, cuyo cuarto
  criterio de aceptación ya pide unificar la aritmética de días: la propuesta es
  que **#84 unifique `daysUntil`, `calendarDaysUntil` y `localDayOf`** en vez de
  dejar cuatro implementaciones. #85 **no lo hace**.
- **E3 — La carta dice "emoji" donde esta sección usa "icono".**
  `docs/ui-guidelines.md` §Dirección de arte 1 dice *"la superficie siempre
  acompaña a un emoji y a un texto"*, mientras #70 R13 prohíbe el emoji en esta
  sección y exige `reicon`. Las dos features han pasado el gate con icono, así
  que la práctica ya está decidida; lo que falta es que la carta lo diga. ¿Se
  enmienda la frase a *"a un icono o un emoji, y a un texto"* en una tarea de
  documentación? **#85 no enmienda la carta**: no quiere colar un cambio de
  norma dentro de una feature de producto.

---

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **Tocar `backend-pet-tracker/`**, `infra/` o `hosting/`. **Cero backend**
  (D-A). En particular: no se puebla `nextReminder`, no se añade una clave 25ª
  al perfil, no se filtra ni se ordena en servidor, y no se crea un endpoint
  nuevo. Las tres opciones y su coste están en el informe §Recomendación.
- **Arreglar el `gt` UTC del lector de vacunas.** Es **#82**, y §0.4 lo declara
  como defecto heredado.
- **Arreglar `src/utils/reminder-dates.ts`** o unificar la aritmética de días.
  Es **#84**; E2 propone el alcance.
- **Deduplicar la vacuna y un recordatorio de la misma vacuna.** §0.3: no hay
  clave para hacerlo y comparar `title` con `name` es adivinar.
- **Fusionar la fila de la vacuna con los recordatorios en un solo orden.**
  D-C: se queda **primera y fija**.
- **Hacer pulsables las filas**, o abrir el detalle de un recordatorio. D-E; no
  existe pantalla de detalle.
- **Un segundo enlace a `/reminders` desde la Home**, o cualquier ruta nueva en
  `src/app/`. #70 R10 sigue mandando: exactamente uno.
- **Una ventana temporal** ("próximos 30 días") además del tope de 3. D-B.
- **Mostrar la hora del recordatorio**, o `advanceMinutes`, o el `status` en la
  fila. R5.
- **Etiqueta de tipo visible o nombre accesible del icono.** R5, R8; E1 y el
  coste en `R3_HOME` están escritos.
- **Un estado vacío propio de la lista de recordatorios.** La ranura de la
  vacuna (#70 R6/R8) ya garantiza que el cuerpo nunca es un hueco.
- **Un esqueleto propio para la lista.** R9, con su motivo.
- **Un mensaje de error o un botón de reintento propios de la sección.** R9.
- **Renombrar `testID` de producción existentes** (`reminders-section*`,
  `reminders-next-vaccine*`, `reminders-none-upcoming`, `reminders-see-all`).
  R14. La deuda de nombres que el informe señala (R-G) **se resuelve sola**: al
  ampliar la sección, `reminders-*` vuelve a decir la verdad.
- **Renombrar las claves `home.nextVaccine*`.** A5, E1.
- **Tocar `src/utils/reminder-meta.ts`, `src/utils/category-palette.ts`,
  `src/theme/global.css`, `src/components/` o `src/screens/reminders/`.**
- **Sacar la sección, el mapa de iconos o los helpers a ficheros nuevos.**
  R13 fila 16: haría crecer `SCREEN_FILES` a cambio de nada.
- **Dependencias nuevas.** Los siete iconos ya están en `reicon-react-native`.
  El veto **nominal** a `expo-linear-gradient` sigue vivo.
- **Animación de entrada de las filas.** La carta no la pide y la sección no
  tiene ninguna hoy; añadirla sería alcance nuevo con su propio candado.
- **Cerrar el candado inglés de toda la Home.** D-H limita O7 a los textos de
  esta sección.

---


### A7 — la aserción inglesa del contador se traslada de R1 a R8

**Codex paró antes de escribir una línea de código, y paró bien.** R1 exige que
`it('rotula en inglés')` asserte, además de los rótulos, el
`accessibilityLabel` **del contador de la primera fila de recordatorio**
(`'In 1 days'`). Pero en R1 no existe ni la petición —llega en **R4**— ni la
fila —llega en **R5**—. Ese `it` fallaría por **sujeto ausente**, no por la copy
que R1 arregla, y su verde exigiría adelantar dos requisitos.

Es el mismo fallo que la enmienda **D1 de #70** tuvo que corregir. Se repitió
porque al escribir R1 pensé en "todo lo que la sección enseña en inglés" en vez
de "lo que existe cuando R1 se implementa".

- **Qué cambia, y solo esto**: `it('rotula en inglés')` de R1 **conserva** los
  tres literales cuyo sujeto sí existe en R1 —`Reminders`, `See all` y el estado
  vacío `No upcoming vaccine`, que #70 ya renderiza— y **pierde** la aserción
  del `accessibilityLabel` del contador.
- **A dónde va**: a **R8**, que es donde ya vive el candado del
  `accessibilityLabel` del contador en español
  —`it('expande la abreviatura del contador y no añade nombres redundantes')`,
  que asserta `'Faltan 1 días'`, `'Faltan 3 días'` y `'Faltan 6 días'`—. Allí las
  tres filas existen, y la aserción inglesa es **una locale más sobre el mismo
  sujeto**, no un test nuevo: se renderiza el mismo escenario con
  `HomeWrapperEn` y se asserta el contador de la primera fila.
- **Qué NO cambia**: R1 sigue candando los dos idiomas —que es lo que **D-H**
  decidió y lo que cierra el hallazgo **O7** de #70—, sigue observando **el texto
  pintado por la app** y nunca `catalog.ts`, y **M13 no se toca**: sigue
  mutando `en['home.reminders']` y muriendo en `it('rotula en inglés')`.
  El alcance del candado inglés sigue limitado a esta sección.
- **Por qué no la otra salida**: adelantar R4 y R5 dentro de R1 juntaría en un
  requisito la copy, la petición y el render de las filas, y dejaría a R1 sin un
  rojo que hable de lo suyo. Mover la aserción al punto donde su sujeto existe es
  lo que C4 pide.

**Corolario para el harness**, porque van dos veces: cuando un requisito de copy
o de accesibilidad enumere lo que se observa en pantalla, la spec tiene que
verificar **contra su propio `tasks.md`** que cada sujeto nombrado ya existe en
ese punto del orden. Es exactamente la comprobación que el encargo del
`spec_author` pedía y que no se aplicó a R1.

  - [X] Aprobado por humano


### A8 — la evidencia prescrita de M3 estaba mal contada

**Codex volvió a parar bien**, y esta vez el defecto es **solo de la evidencia
escrita**, no del candado.

La tabla de R15 dice que con M3 plantada —el filtro pierde la cláusula
`status === 'scheduled'`— *"Entran `rem-sent` y `rem-cancelled`"*. **Falso.** Con
la fixture normativa y el tope de tres, la salida ordenada es
`rem-today(+0d)`, `rem-next(+1d)`, `rem-sent(+2d)`, `rem-cancelled(+3d)`: el
cuarto **lo recorta el tope**. Solo aflora `rem-sent`. Codex midió 1 fallo/12
verdes, exactamente por él.

**El candado NO se debilita, y esto es lo que había que decidir.** La salida
esperada del `it` son **exactamente dos ids**, así que cualquier intruso lo pone
rojo. Verificado caso por caso:

| mutación | salida con el tope aplicado | resultado |
|---|---|---|
| quitar solo la exclusión de `sent` | `[rem-today, rem-next, rem-sent]` | **rojo** |
| quitar solo la exclusión de `cancelled` | `[rem-today, rem-next, rem-cancelled]` | **rojo** |
| quitar las dos (M3 tal cual) | `[rem-today, rem-next, rem-sent]` | **rojo** |

No hay zona ciega: el tope nunca esconde a los dos a la vez, porque en el caso
"solo `cancelled`" el hueco que deja `sent` lo deja entrar.

- **Qué se corrige, y solo esto**: la celda "¿Muere siempre?" de **M3** pasa a
  decir *"**Sí.** Aflora `rem-sent`; `rem-cancelled` queda cuarto y lo recorta el
  tope de tres. El `it` falla igual porque espera **exactamente dos** ids"*.
- **Qué NO cambia**: la fixture normativa **se queda como está** —tocarla
  arrastraría a M4, M5 y M6, y M6 depende del orden invertido del par
  empatado—; M3 sigue siendo la misma mutación, sigue cayendo por el mismo `it`,
  y M4 y M5 no se tocan.
- **Corolario, y es la parte que importa**: prescribir la evidencia exacta de una
  mutación es bueno —obliga a mirar— pero **la evidencia hay que contarla
  aplicando todas las cláusulas del pipeline**, no solo la que la mutación
  rompe. Aquí se contó el filtro y se olvidó el tope, que es la cláusula
  siguiente. Vale para cualquier mutación sobre una tubería de
  filtrar-ordenar-cortar.

  - [X] Aprobado por humano


### A9 — la verificación de M7 y M8 se aplaza de R3 a R5

`tasks.md:95-96` manda plantar **M3-M8** durante **R3** y comprobar que cada una
cae por **todos** los `it` que R15 nombra. Pero **M7** y **M8** nombran, además
de los `it` de `format.test.ts`, dos de la Home
—`it('las ordena por fecha ascendente bajo la fila de la vacuna')` y
`it('corta en tres aunque haya cinco')`— que **el propio orden normativo no crea
hasta R5**. En R3 solo existen los candados del helper.

Es la **misma clase de fallo que A7**: prescribir una observación sobre un
sujeto que el orden de tareas todavía no ha creado. Allí era un `it`, aquí es la
evidencia de una mutación.

- **Qué cambia, y solo esto**: **M7 y M8 se plantan y se verifican en el paso de
  refactor de R5**, no en el de R3. Allí existen **los cuatro** `it` que R15 les
  nombra —los dos del helper siguen vivos— así que la comprobación es la
  completa, no una a medias.
- **R3 conserva M3, M4, M5 y M6**, que nombran únicamente `it` de
  `format.test.ts` y son verificables donde están.
- **Qué NO cambia**: ninguna mutación se retira, ninguna pierde un `it`, la
  fixture normativa sigue intacta y M6 conserva su orden invertido. R15 sigue
  exigiendo las trece.
- **Por qué no la otra salida**: verificar M7 y M8 en R3 contra los `it` del
  helper y **repetirlas** en R5 no añade garantía —la verificación de R5 incluye
  los mismos `it` del helper, que no desaparecen— y duplica trabajo.

**Comprobación de las trece, para que no haya una quinta parada.** El leader
recorrió la tabla de R15 contra el orden de `tasks.md`:

| mutación | se planta en | `it` que nombra | ¿existe ya? |
|---|---|---|---|
| M1 | R2 | `format.test.ts :: #85 R2` | sí |
| M3, M4, M5, M6 | R3 | solo `format.test.ts :: #85 R3` | sí |
| **M7, M8** | **R3 → R5 por esta enmienda** | `format.test.ts` **y** `index.test.tsx :: #85 R5` | **no en R3; sí en R5** |
| M2, M11 | R5 | `index.test.tsx :: #85 R5` | sí |
| M12 | R6 | `index.test.tsx :: #85 R6` | sí |
| M9, M10 | R7 | `index.test.tsx :: #85 R7` | sí |
| M13 | R11 | `index.test.tsx :: #85 R1` | sí, desde R1 |

Solo M7 y M8 estaban mal colocadas.

  - [X] Aprobado por humano


### A10 — el doble posicional de `useApi` se adapta a la cuarta llamada

R4 añade la cuarta petición de la Home y eso rompe un test **heredado** que
`tasks.md:115-118` manda dejar verde **sin tocarlo**. La contradicción es real y
no tiene salida sin enmienda.

**Por qué se rompe.** `index.test.tsx:790-800`
(`describe('R10: preserva la mascota durante el refetch')`) sustituye `useApi`
entero por un doble **posicional**:

```js
let hookCall = 0;
jest.spyOn(apiHooks, 'useApi').mockImplementation(() => {
  const result = hookCall++ % 3 === 0 ? petsResult : emptyResult;
  return result;
});
```

El `% 3` **codifica el número de llamadas por render**: la primera devuelve la
lista de mascotas y las otras dos, vacío. Con cuatro llamadas el ciclo se
desalinea en el segundo render y el hook de la lista recibe `emptyResult`, de
donde sale el `TypeError: Cannot read properties of undefined (reading
'nextVaccine')` que Codex observó. El mock por defecto de `listReminders` que
prescribe **A6** no interviene, porque este test sustituye el hook entero y
nunca llega a la capa de API.

- **Qué se autoriza, y solo esto**: cambiar `% 3` por `% 4` en
  `index.test.tsx:797`. **Un carácter.**
- **La intención del test se conserva exacta**: la primera llamada de cada
  render sigue siendo la de la lista de mascotas y el resto sigue devolviendo
  vacío. Lo que el `it` prueba —que un refetch de la lista no vuelve a llamar a
  `selectPet`— no se toca, y sus dos `expect(selectPet).not.toHaveBeenCalled()`
  siguen intactos.
- **Esto NO es mutar un doble para fabricar un rojo**, que es lo que prohíbe el
  quinto punto de C4. Es al revés: el doble codifica una aridad que la feature
  cambia legítimamente, y se actualiza para que siga midiendo lo mismo.
- **Qué NO cambia**: ningún otro `describe` heredado, ninguna aserción, ningún
  otro doble. Si al cambiar el `% 4` cae algo más, **para y repórtalo**.

**Deuda que esto destapa, registrada como #86**: el doble es frágil por diseño.
Acopla el test al **número** de llamadas a `useApi` de la pantalla, así que
**cualquier** feature futura que añada una petición a la Home lo romperá igual,
y el síntoma será un `TypeError` opaco a tres capas de distancia de la causa.
Lo honesto es indexar por la **función pasada** al hook y no por el orden de
llamada. No entra aquí: es una refactorización de un test heredado y esta
feature ya lleva cuatro paradas.

  - [X] Aprobado por humano


### A11 — el valor por defecto de `listReminders` se restaura en cada test

La fixture de R5 se filtra a tres `describe` heredados de #70, que esperaban un
cuerpo **sin** recordatorios y reciben `rem-1`.

**La causa, y es una premisa falsa mía.** `tasks.md:115-118` y A6 dan por hecho
que la factoría del mock —`index.test.tsx:73`,
`listReminders: jest.fn(async () => ({ kind: 'ok', reminders: [] }))`— conserva
sola el `[]` para los `describe` heredados. **No lo hace.** Los tests de R5
llaman a `mockListReminders.mockResolvedValue(...)`, que **sustituye la
implementación de forma permanente**, y los `beforeEach` heredados solo corren
`jest.clearAllMocks()`, que **limpia llamadas pero no implementaciones**. El
`[]` de la factoría no vuelve nunca.

- **Qué se añade**: un `beforeEach` **de nivel de fichero**, justo después de
  `const mockListReminders = jest.mocked(listReminders);` (`:120`):

  ```ts
  beforeEach(() => {
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
  });
  ```

  Jest ejecuta los `beforeEach` de fuera adentro, así que éste corre **antes**
  que el `jest.clearAllMocks()` de cada `describe`, y sobrevive a él
  precisamente porque `clearAllMocks` no toca implementaciones. Cualquier
  `describe` que quiera otra respuesta la fija después, como ya hace R5.
- **Por qué así y no un `afterEach` en R5**: un `afterEach` local arregla solo
  los `describe` que van **después** de R5, deja el resultado dependiente del
  **orden de declaración**, y obliga a repetir la limpieza en cada futuro
  `describe` que sobrescriba el mock. El `beforeEach` de fichero es
  **independiente del orden** y no hay que acordarse de él nunca más.
- **Qué NO cambia**: ningún `describe` heredado se toca —ni sus `beforeEach`, ni
  sus aserciones—, la factoría de `:73` se queda como está, y R5 sigue fijando
  su fixture como la fija hoy. **A6 no se modifica**: se le añade este `beforeEach`
  como el mecanismo que hace cierta su promesa.
- **Si tras añadirlo cae algo más, para y repórtalo.**

**Corolario para el harness**, y vale para cualquier mock de módulo de este
repo: **`jest.clearAllMocks()` no restaura el valor por defecto de una
factoría**. Si un `describe` usa `mockResolvedValue` o `mockImplementation`, ese
valor **contamina todo lo que venga después** salvo que algo lo reponga
explícitamente. Dar por hecho lo contrario es lo que produjo esta parada.

  - [X] Aprobado por humano


### A12 — R9 y R10 son requisitos de verificación, y llevan su propia sonda

**Codex paró bien y el análisis es suyo, no mío.** R9 y R10 asertan propiedades
que **R5 y R6 ya dejaron puestas**: la guarda
`reminders.data?.kind === 'ok' ? … : []` vive en producción desde R5
(`index.tsx:182-185`), y las recetas exactas de fila, título, fecha y contador
—`TABULAR_NUMS` incluida— desde R5 y R6. Sus tests **nacerían verdes por
construcción**, y `tasks.md` les ordena igualmente "escribir test que falla".

Eso es exactamente el caso que cubre el **quinto punto de C4**: un candado que
se añade sobre código **ya correcto**. El rojo legítimo no es un test previo
—no lo hay— sino una **mutación de producción** versionada en el commit rojo y
revertida en el verde. R7 ya lo hace con M9 y M10; R12 prescribe una sonda. R9 y
R10 se quedaron sin ninguna de las dos cosas. Es un descuido mío al escribir la
spec, no un problema de la implementación.

- **Qué se declara**: R9 y R10 pasan a ser **requisitos de verificación por
  C4(b)**. Cada uno lleva **una sonda de producción versionada en su commit
  rojo y revertida en el verde**, con su evidencia en el informe.

- **Sonda P9 — el fallo de una petición no puede apagar la otra.** En la ranura
  de la vacuna, condicionar su render al estado de los recordatorios:

  ```diff
  -{nextVaccine && nextVaccineCountdown ? (
  +{reminders.data?.kind === 'ok' && nextVaccine && nextVaccineCountdown ? (
  ```

  **Rojo esperado**: cae `it('no pinta filas mientras carga')` —desaparece el
  `reminders-section-skeleton`— y cae el `it.each` de los cinco kinds de fallo
  —`body.children.length` pasa de `1` a `0`—. Es justo lo que R9 promete: *"el
  fallo de `listReminders` no puede apagar el dato del perfil, ni al revés"*.

- **Sonda P10 — el ámbar significa urgencia, no tipo.** En la píldora del
  contador de la fila, sustituir el hueco ámbar fijo por el del tipo:

  ```diff
  -${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}
  +${CATEGORY_SLOTS[REMINDER_TYPE_META[reminder.type].category].surface} …
  ```

  **Rojo esperado**: cae `it('aplica la receta de cada nodo y ninguna otra')`
  por el `toBe` del `className` del contador. Ataca la frase normativa de R10
  —*"el ámbar significa **urgencia**, no **tipo**; el tipo lo porta el disco"*—
  y no una clase cualquiera.

- **Las dos sondas quedan FUERA de las trece M1-M13.** R15 no se renumera ni
  cambia: su tabla, sus trampas declaradas y su recuento siguen igual. P9 y P10
  se documentan en el informe bajo R9 y R10, no bajo R15.

- **Si una sonda pone rojo algún `it` de más, no es problema** —lo que se exige
  es que caiga el del requisito—. **Lo que invalida la sonda es que su requisito
  quede verde**: entonces el test está mal escrito y se para.

**Corolario para el harness, y es el tercero de esta feature**: al escribir una
spec hay que marcar, requisito por requisito, **cuáles asertan algo que un
requisito anterior ya implementa**. Ésos no pueden pedir "test que falla": son
de verificación y necesitan sonda. Aquí se detectó en R9 y R10; R7 y R12 sí lo
llevaban, lo que prueba que la distinción se conocía y se aplicó de forma
desigual.

  - [X] Aprobado por humano

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-09) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. **Que la Home pasa de 3 a 4 peticiones al arranque** (R4, A1), y que ése es
   el precio de no meterle un array a una ranura del perfil que está
   documentada como **singular**.
2. **Que la duplicación visual es posible y aceptada** (§0.3): una vacuna
   registrada en Salud y un recordatorio escrito para esa misma vacuna se verán
   como **dos filas**, porque deduplicar sin FK es adivinar.
3. **Que el día de la dosis la sección puede contradecirse consigo misma**
   (§0.4): los recordatorios de hoy salen y la vacuna de hoy no. Es defecto
   **heredado** de #82, declarado y no introducido.
4. **Que las filas no son pulsables** (R8, D-E) y que abrir el detalle de un
   recordatorio es otra feature.
5. **Que las filas no llevan etiqueta de tipo ni nombre accesible en el icono**
   (R5, R8), y que el tipo lo portan el icono y su hueco de color.
6. **El mapa de iconos por tipo** de R6, incluido que `food` sea **`Bone`** y no
   `ForkKnife` (colisión con la barra de pestañas) y que `custom` sea **`Bell`**.
7. **Que las cuatro claves `home.nextVaccine*` conservan su nombre** aunque
   ahora sirvan a los dos tipos de fila (A5, E1).
8. **Las tres decisiones abiertas E1, E2 y E3**, que quedan anotadas como
   hallazgos y **no** se resuelven aquí.
