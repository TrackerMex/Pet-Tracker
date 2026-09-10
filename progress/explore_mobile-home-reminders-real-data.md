# explore: mobile-home-reminders-real-data (#85)
Fecha: 2026-09-09
Rama: `feature/85-mobile-home-reminders-real-data` sobre `main` @ `20c7b3c` (#70 mergeado)
Alcance: **solo lectura**. No se ejecutó la suite (había un `./init.sh` en curso).
Método: `graphify query` para orientar + lectura directa del árbol. Cada premisa del
encargo se verificó contra el fichero; las que salieron matizadas están marcadas.

---

## Contexto encontrado

### 1. El módulo de recordatorios del backend: qué existe hoy

CRUD hexagonal completo, ya en producción desde #16 / #47.

| Capa | Fichero |
|---|---|
| esquema | `backend-pet-tracker/src/db/schema/reminders.schema.ts` |
| entidad | `backend-pet-tracker/src/modules/reminders/domain/entities/reminder.entity.ts` |
| puerto repo | `backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts` |
| adaptador | `backend-pet-tracker/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts` |
| casos de uso | `.../application/use-cases/{create,list,update,delete}-reminder.use-case.ts` |
| controladores | `.../infrastructure/reminders.controller.ts` |
| mapper HTTP | `.../infrastructure/mappers/reminder.mapper.ts` |
| módulo | `.../reminders.module.ts` |

**Tabla `reminders`** (`reminders.schema.ts:14-52`), columnas y CHECKs:

- `id` uuid PK, `petId` uuid FK→pets (cascade), `createdBy` uuid FK→users
- `type` varchar(20), CHECK ∈ `vaccine, deworming, medication, appointment, weight, food, custom`
- `title` varchar(120) NOT NULL — **texto libre del dueño**
- `dueAt` **`timestamp with time zone`** NOT NULL ← es un **instante**, no un día civil
- `advanceMinutes` int default 60, CHECK 0..10080
- `channel` varchar(10) default `'push'`, CHECK ∈ `('push')`
- `status` varchar(10) default `'scheduled'`, CHECK ∈ `scheduled, sent, cancelled`
- `scheduleName`, `enqueuedAt` — fontanería de EventBridge, no se serializan
- índices: `pet_id`, `created_by`, y parcial sobre `due_at` where `status='scheduled'`

**No hay recurrencia.** Declarada explícitamente fuera de alcance en
`specs/pet-reminders/requirements.md` (§Fuera de alcance, "Recordatorios recurrentes
(`recurrence`, medicación cada 8 h): el shape lo admite después sin romper").

**Lo que un recordatorio da para pintar una fila** — el contrato HTTP
(`reminder.mapper.ts:3-22`) expone exactamente 7 campos:
`{ id, petId, type, title, dueAt (ISO string), advanceMinutes, status }`.
Suficiente para una fila: `type` → icono/etiqueta/color (ya mapeado, ver §6),
`title` → texto principal, `dueAt` → fecha y cuenta atrás, `status` → activo/inactivo.
No expone `scheduleName`, `enqueuedAt` ni `createdBy`.

### 2. Qué endpoint alimenta hoy `/reminders`, con qué filtros y qué orden

`GET /v1/pets/:petId/reminders` — `PetRemindersController.list`
(`reminders.controller.ts:63-68`), protegido por `PetAccessGuard`, **sin
`@RequirePetRole`**: cualquier rol con membresía activa lo lee.

Cadena: controller → `ListRemindersUseCase.execute(petId)` (que es un passthrough de
una línea) → `ReminderDrizzleRepository.listByPet` (`reminder.drizzle.repository.ts:28-35`):

```ts
.select().from(reminders)
.where(eq(reminders.petId, petId))
.orderBy(asc(reminders.dueAt));
```

**Sin query params, sin filtro de estado, sin filtro de fecha, sin paginación.**
Devuelve *todo* el historial: los `sent`, los `cancelled` y los vencidos, ordenados
por `dueAt` ascendente — o sea, **los más viejos primero**.

Esa conducta está candada por nombre en
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts:143-144`:
`describe('R1: GET lista todos los reminders de la mascota por dueAt')` →
`it('responde todos los status ordenados por dueAt ascendente')`.

> **Conclusión para el encargo**: sí, el endpoint ya devuelve todo lo que la Home
> necesitaría. **No hace falta backend nuevo** si la Home filtra y ordena en cliente.
> Filtrar en servidor, en cambio, **rompe ese candado e2e**.

### 3. Cómo llega hoy `nextVaccine` a la Home — el precedente exacto

Camino completo, verificado línea a línea:

1. **Móvil**: `HomeScreen` monta `useApi(() => getPet(baseUrl, token, selectedPetId))`
   (`mobile-pet-tracker/src/screens/home/index.tsx:143-151`) y lee
   `detail.data.pet.nextVaccine` (`:154-155`).
2. **HTTP**: `GET /v1/pets/:petId` → `PetsController.detail`
   (`backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts:82-105`).
3. **Aplicación**: `GetPetUseCase.execute` (`get-pet.use-case.ts:52-76`) llama
   `this.vaccineReader.findNextVaccine(petId, new Date().toISOString().slice(0, 10))`
   — el segundo argumento es la **fecha UTC del servidor** en formato `YYYY-MM-DD`.
4. **Puerto**: `pets/domain/ports/pet-vaccine-reader.ts` — símbolo `PET_VACCINE_READER`,
   interfaz `PetVaccineReader`, tipo `NextPetVaccine = { id, name, nextDoseAt }`.
   El puerto **vive en `pets`**, aunque el dato sea de `health`.
5. **Adaptador**: `health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts:15-33`.
6. **Cableado**: `health/pet-vaccine-read.module.ts` — un módulo envoltorio de 10 líneas
   que provee y exporta el símbolo, sin importar `PetsModule` ni el resto de `health`;
   `PetsModule` lo importa (`pets.module.ts:25`).
7. **Serialización**: `toPetProfileResponse(pet, role, now, device, photoUrl, nextVaccine)`
   (`pet-profile-response.mapper.ts:53-88`), campo `nextVaccine` (`:83`).

**Detalle que la spec debe conocer**: **solo `GET /pets/:petId` rellena `nextVaccine`.**
El POST (`pets.controller.ts:66`), el listado (`:77`), el PATCH (`:120`) y el
lost-mode (`:145`) llaman al mapper sin ese argumento, así que sale `null` por defecto.

**Este es el patrón que #85 imitaría** si va por la opción (a): puerto en
`pets/domain/ports/`, adaptador en el módulo dueño del dato, módulo-envoltorio delgado
que solo provee y exporta el símbolo, importado desde `PetsModule`.

### 4. El contrato del perfil está congelado, y el candado es real

`pet-profile-response.mapper.ts:12-17`, comentario normativo en producción:

> *"Contrato congelado del perfil de mascota (R8): exactamente estas claves, en todas
> las respuestas del CRUD. Las features posteriores editan ESTE mapper **sustituyendo
> un `null` por un valor** — nunca agregan ni renombran claves, así el contrato HTTP no
> cambia de forma."*

Las **24 claves** están asertadas en seis ficheros:

- `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:34`
- `src/modules/pets/infrastructure/pets.controller.spec.ts:150`
- `test/pets.e2e-spec.ts:63` (lista `PROFILE_KEYS`), `:346`, `:356`, `:671-672`
- `test/devices.e2e-spec.ts:792-793`, `:843`
- `test/pet-lost-mode.e2e-spec.ts:50`
- `test/device-subscriptions.e2e-spec.ts:348`

Y hay **una ranura reservada, en singular**: `nextReminder: null`
(`pet-profile-response.mapper.ts:45` con el comentario `/** null hasta pet-reminders (#16). */`
y `:84`). Su nulidad se asegura en `test/pets.e2e-spec.ts:359` y
`mapper.spec.ts:67-72`. En el móvil está tipada `nextReminder: unknown`
(`mobile-pet-tracker/src/api/types.ts:79`) — #70 la dejó así a propósito (su A10).

`specs/pet-reminders/requirements.md:174-175` (aprobada 2026-08-11) lo dice también:
*"`nextReminder` en el perfil de mascota: `PetProfileResponse` es un contrato congelado
(ver #15 §Fuera de alcance); ampliarlo es otra feature."* — #85 **es** esa otra feature.

### 5. Vacunas y recordatorios son entidades DISTINTAS y DISJUNTAS

Es el hallazgo que más cambia el diseño. Verificado, no inferido:

- Son **dos tablas** en dos módulos: `pet_vaccines` (`health.schema.ts:39-66`,
  `nextDoseAt` columna **`date`** y **nullable**) y `reminders` (`dueAt` **timestamptz**
  NOT NULL).
- `grep -rln 'REMINDER_REPOSITORY|CreateReminderUseCase' backend-pet-tracker/src/`
  devuelve **solo** ficheros del propio módulo `reminders` y `workers/notifier/`.
  **Ningún caso de uso de vacunas escribe una fila de `reminders`**, y ninguno de
  recordatorios escribe en `pet_vaccines`. La única mención cruzada en todo `health/` y
  `pets/` es el comentario `/** null hasta pet-reminders (#16). */`.
- `reminders.type` admite `'vaccine'`, **pero es un recordatorio escrito a mano** en
  `/add-reminder`. No tiene FK a `pet_vaccines.id`; su único texto es `title`, libre.

**Consecuencias que la spec tiene que resolver por escrito:**

1. Registrar una vacuna en `/health` **no** crea recordatorio. Crear un recordatorio
   `type: 'vaccine'` **no** crea vacuna. Son dos flujos independientes.
2. La Home puede acabar enseñando **la misma vacuna dos veces** (una fila desde
   `nextVaccine`, otra desde el recordatorio que el dueño escribió) — y **no hay clave
   para deduplicar**: solo se podría comparar `title` con `name`, que es adivinar.
3. Si se fusionan en una lista ordenada por fecha, las dos fechas **no son comparables
   sin normalizar**: `nextDoseAt` es un **día civil** (`2026-09-12`) y `dueAt` es un
   **instante con hora y zona** (`2026-09-12T15:00:00.000Z`).

### 6. Qué queda de #70 en el móvil, y qué se reutiliza

`mobile-pet-tracker/src/screens/home/index.tsx`:

- `vaccineCountdown(days, t)` a nivel de módulo (`:90-108`) — tres ramas: vencida (`<0`),
  hoy (`=0`), y `{{days}} d` con `accessibilityLabel` expandido.
- Estado derivado (`:154-160`): `nextVaccine` ← `detail.data.pet.nextVaccine`;
  `nextVaccineDays` ← `calendarDaysUntil(nextVaccine.nextDoseAt, new Date())`;
  `nextVaccineCountdown`.
- `'category-blue-strong'` añadido al `useThemeColors` existente como `vaccineInk` (`:122-128`).
- JSX (`:504-582`): `reminders-section` → cabecera (`reminders-section-title` +
  `reminders-see-all` Pressable a `/reminders`) + `reminders-section-body` con **tres
  ramas mutuamente excluyentes**: `reminders-section-skeleton`, `reminders-next-vaccine`
  (con hijos `-name`, `-date`, `-days`), `reminders-none-upcoming`.

**Se reutiliza tal cual**: la cabecera entera, `reminders-section-body` como contenedor,
el esqueleto, el `Card` compartido, `CATEGORY_SLOTS`, `TABULAR_NUMS`, `fmtDate`, y la
posición vertical de la sección.

**Ya existe y no hay que reescribir**: `mobile-pet-tracker/src/utils/reminder-meta.ts`
mapea los 7 `ReminderType` a `{ labelKey, emoji, category }` con hueco de paleta
asignado. Lo usa `/reminders`. **Aviso**: usa **emoji**, y `#70 R13` exige en esta
sección *"el icono de reicon y ningún emoji"*. Choque real, ver decisión D-G.

**Candados de #70 que dejan de valer** (todos en `src/screens/home/index.test.tsx`):

| Candado | Dónde | Por qué muere |
|---|---|---|
| **R9** `deja el cuerpo con un solo hijo` | `:2060-2097` | asegura `reminders-section-body.children` **== 1** cargado, **== 1** cargando, **== 0** en error. Con varias filas, muere |
| **R3** barra de comidas fuera | `:2378-2396` | repite `expect(body.children).toHaveLength(1)` |
| **R6** datos de la vacuna | `:1918-1943` | `reminders-next-vaccine-{name,date,days}` |
| **R7** tres ramas del contador | `:1946-1990` | literales `5 d` / `Faltan 5 días` / `Vencida` |
| **R8** estado vacío | `:1995-2021` | `reminders-none-upcoming` + `Sin vacuna próxima` |
| **R11** accesibilidad | `:2186-2205` | nombres accesibles de los nodos de vacuna |
| **R15** `sin llamadas nuevas` | `:2338-2350` | **matiz**: el assert es `{pets:1, detail:1, activity:1}` sobre tres mocks; una 4ª llamada **no lo pone rojo por sí sola**, pero el *requisito escrito* deja de ser cierto y hay que enmendarlo |

**Sobreviven intactos**: **R1** (cabecera), **R10** (enlace a `/reminders`, incluido
`no añade un segundo camino a la lista desde la Home`), **R12** (Card + tokens),
**R14** (posición entre `weekly-activity-card` y `last-position-card`, y ausencia sin
mascota seleccionada — `:2300-2337`).

### 7. Claves `home.reminders*`, literales y sus candados

`mobile-pet-tracker/src/i18n/catalog.ts` (en `:53-59`, es `:346-352`):

| clave | `en` | `es` |
|---|---|---|
| `home.reminders` | `Next vaccine` | `Próxima vacuna` |
| `home.remindersSeeAll` | `See reminders` | `Ver recordatorios` |
| `home.nextVaccineDays` | `{{days}} d` | `{{days}} d` |
| `home.nextVaccineDaysLeft` | `In {{days}} days` | `Faltan {{days}} días` |
| `home.nextVaccineToday` | `Today` | `Hoy` |
| `home.nextVaccineOverdue` | `Overdue` | `Vencida` |
| `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` |

Las dos primeras son el parche D8 de #70 (antes: `Reminders`/`Recordatorios` y
`See all`/`Ver todos`, según `progress/review_mobile-home-reminders-section.md:35-40`).

**Candados de literal — solo en español**, en `src/screens/home/index.test.tsx`:
`:1898` `Próxima vacuna`, `:1903` `Ver recordatorios`, `:1998` `Sin vacuna próxima`,
`:1961-1963` y `:2173-2175` `5 d` / `Faltan 5 días` / `Vencida`.

**Registro de claves**, dos capas más:
- `src/__tests__/ui-copy-table.ts:72-78` — las 7 filas de `R3_HOME` para
  `src/screens/home/index.tsx`.
- `src/__tests__/ui-language.test.ts:88-119` (#70 R16) — lista literal de las 7 claves,
  `checkUses` sobre ellas, **y** exige que cada una tenga fila en
  `specs/mobile-ui-language/design.md` con el sufijo `← añadida por #70 (R16)`.

---

## Riesgos / ambigüedades

### R-A. Deuda #84 verificada: el veto sigue vivo, y `calendarDaysUntil` tampoco vale tal cual

`mobile-pet-tracker/src/utils/reminder-dates.ts:15-17` sigue exactamente así hoy:

```ts
export function daysUntil(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
}
```

Llamantes actuales, los dos en **otra pantalla**: `src/screens/reminders/index.tsx:235`
(píldora `pill-week`, ventana 0..7 días) y `:275` (contador por fila y píldora
`reminders.upcoming` en 0..10 días). **Cero llamantes en la Home** → #85 puede evitarlo
por completo y el veto no le bloquea.

**Pero el helper de #70 tampoco sirve sin más.** `src/screens/home/format.ts:3-10`:

```ts
export function calendarDaysUntil(date: string, now: Date): number {
  const [year, month, day] = date.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  ...
```

Parsea **por componentes de un `YYYY-MM-DD`**. `Reminder.dueAt` es un ISO **con hora**.
Ejecutado hoy contra el árbol:

```
calendarDaysUntil('2026-09-12',              new Date('2026-09-09T12:00:00Z')) === 3
calendarDaysUntil('2026-09-12T15:00:00.000Z', new Date('2026-09-09T12:00:00Z')) === NaN
```

`Number('12T15:00:00.000Z')` es `NaN` → `Date.UTC(…, NaN)` es `NaN`. **No lanza**: la
Home pintaría "Faltan NaN días" sin que nada se ponga rojo, porque `NaN < 0` y
`NaN === 0` son ambos `false` y `vaccineCountdown` cae en la tercera rama. Es una
trampa silenciosa exactamente del tipo que ya costó un veredicto rechazado.

→ **Decisión obligatoria de la spec**: cómo se convierte el instante `dueAt` a día civil
**local** antes de contar. Opciones: extraer el día local del `Date` (`getFullYear/
getMonth/getDate`) y reusar la aritmética de medianoches, o una función hermana
`calendarDaysUntilInstant(iso, now)`. Sea cual sea, el candado de zona horaria tiene que
copiar el patrón de **#70 R5**: espías de `Date.parse` / `Date.UTC` / constructor —
`progress/review_mobile-home-reminders-section.md:27` documenta que asignar
`process.env.TZ` dentro de un `it` **no llega a V8** bajo Jest y deja el candado inerte
(fue el rechazo B1 del primer pase de #70).

### R-B. Deuda #82 verificada — y **el repo de recordatorios NO la hereda**

Confirmado en el árbol de hoy:
- `pet-vaccine.drizzle-reader.ts:27`: `gt(petVaccines.nextDoseAt, after)`, estrictamente mayor.
- `get-pet.use-case.ts:73`: `after = new Date().toISOString().slice(0, 10)` → **día UTC del servidor**.
- `health.schema.ts:49`: `nextDoseAt: date('next_dose_at')` — columna `date`, nullable.
- Y en el móvil, `src/app/(tabs)/health.tsx:69-74` filtra `nextDoseAt >= localTodayIso()`
  — **inclusivo y en la zona del dispositivo**. La contradicción de #82, exacta.

**El repositorio de recordatorios no tiene ese defecto**: `listByPet`
(`reminder.drizzle.repository.ts:28-35`) **no filtra por fecha en absoluto**.

→ Si #85 va por la opción (b) (llamar al endpoint que ya existe y filtrar en cliente),
**no hereda el bug ni queda bloqueada por #82**. Lo heredaría si escribe un lector nuevo
con `gt`/`gte` contra un "ahora" de servidor. Recomendación: filtrar contra el día local
del dispositivo, que es lo que ya hace Salud, y así las dos pantallas coinciden sin
esperar a #82. **Pero entonces la fila de la vacuna sigue viniendo del backend con `gt`
UTC** — es decir, la vacuna de hoy sigue sin llegar a la Home aunque los recordatorios de
hoy sí. Esa incoherencia interna es una decisión abierta (ver D-I).

### R-C. O7 reproducido: la copy inglesa sigue sin candado

Verificado por búsqueda: `Next vaccine`, `See reminders`, `No upcoming vaccine` y
`Overdue` **no aparecen en ningún fichero fuera de `src/i18n/catalog.ts`**. El único
`nextVaccineOverdue` fuera del catálogo es la **clave**, no el texto
(`ui-copy-table.ts:77`, `home/index.tsx:95`, `ui-language.test.ts:96`).
`language-provider.test.tsx` compara **claves y marcadores `{{...}}`**, nunca textos.

→ Decisión abierta D-H. Aviso de calidad: si el candado inglés se escribiera asertando
`en['home.reminders']` desde `catalog.ts`, sería **tautológico** (el test leería el mismo
literal que quiere vigilar). El candado honesto es **renderizar la Home con el proveedor
en `en`** y asertar el texto pintado, como ya se hace con el español.

### R-D. Candados globales que se mueven — expresar SIEMPRE como delta, nunca como cifra

Un delta mal declarado ya paró la implementación tres veces. Los sitios exactos:

**Móvil**
1. `src/providers/__tests__/language-provider.test.tsx:41`:
   `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7)` — un sumando por feature.
   #85 añade el suyo (o resta, si retira claves de vacuna que dejen de usarse).
   *Este es el candado de longitud de catálogo que la memoria de sesión marca como
   "olvidado por el spec_author dos veces".*
2. `src/__tests__/ui-language.test.ts:82-86`:
   `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7)`. **Cada `t('...')` que #85 añada
   o quite en `screens/home/index.tsx` mueve este sumando Y la tabla de
   `src/__tests__/ui-copy-table.ts`** (las filas se cuentan por ocurrencia, no por clave:
   `checkUses` compara el número de llamadas `t('clave')` en el fichero).
3. `src/__tests__/ui-language.test.ts:88-119` (#70 R16): la lista literal de las 7 claves,
   más la exigencia de una fila en `specs/mobile-ui-language/design.md` marcada
   `← añadida por #70 (R16)` por cada una. Si #85 retira, renombra o añade claves, hay
   que tocar este bloque **y** ese design.md.
4. `src/__tests__/design-drift.test.ts`, bloque `#70 R17` (`:~275-292`): inventario de
   ficheros de la feature sin `text-[10px]` / hex / `StyleSheet`. #85 debería añadir su
   propio bloque con **su** lista de ficheros.
5. `src/__tests__/consistency-classnames.test.ts`, tres inventarios contados:
   - **`#62 R14` CONTINUOUS_CORNER** (`:270-285`): `screens/home/index.tsx` → **2**.
     Si las filas nuevas llevan esquina continua (como las de `screens/reminders/index.tsx`,
     fijado en 4), sube.
   - **TABULAR_NUMS** (`:335-352`): `screens/home/index.tsx` →
     `HOME_TABULAR_AT_9358CC7 + HOME_TABULAR_DELTA_69 + HOME_TABULAR_DELTA_70`, **y**
     un assert de la **suma total** de todos los ficheros del inventario. Un contador de
     días por fila mueve las dos cifras.
   - **`bg-accent-soft`** (`:433-445`): total **16** en todo `src/`, con
     `screens/reminders/index.tsx` fijado en 1 y `screens/docs/index.tsx` en 0. Si #85
     usa `bg-accent-soft` en la Home, el total revienta.
6. `src/__tests__/design-drift.test.ts:61-79`: la Home debe seguir importando el `Card`
   compartido desde `screens/home/index.tsx` (no desde `app/(tabs)/home.tsx`).

**Backend — solo si se elige la opción (a)**
7. Las **24 claves** del perfil: `pet-profile-response.mapper.spec.ts:34`,
   `pets.controller.spec.ts:150`, `test/pets.e2e-spec.ts:63/346/356/671-672`,
   `test/devices.e2e-spec.ts:792-793/843`, `test/pet-lost-mode.e2e-spec.ts:50`,
   `test/device-subscriptions.e2e-spec.ts:348`.
8. Los asserts de nulidad: `test/pets.e2e-spec.ts:359` (`expect(body.nextReminder).toBeNull()`)
   y `mapper.spec.ts:67-72`.

**Backend — solo si se toca el listado existente**
9. `test/pet-reminders.e2e-spec.ts:143-144`: *"responde **todos** los status ordenados
   por dueAt ascendente"*. Filtrar en servidor lo pone rojo por diseño.

### R-E. Ciclo de módulos si se elige la opción (a)

`RemindersModule` **ya importa `PetsModule`** (`reminders.module.ts:17`, para reusar
`PetAccessGuard`). Si `PetsModule` importase `RemindersModule`, hay ciclo. La salida es
la misma que usó `#14`: un módulo-envoltorio independiente
(`reminders/pet-reminder-read.module.ts`) que **no importa ni `PetsModule` ni
`RemindersModule`**, solo provee y exporta el símbolo del puerto declarado en
`pets/domain/ports/`. Es exactamente lo que hace `health/pet-vaccine-read.module.ts`.
La spec debe decirlo explícitamente o Codex hará el import directo y se comerá el ciclo.

### R-F. Elemento repetido nuevo — `docs/ui-guidelines.md` §Enmienda #70 (`:308-354`)

Con más de una fila, la sección estrena elemento repetido. La carta obliga a enumerar
**todas** las decisiones por fila, con el criterio *"cruzar cualquiera de ellas entre dos
elementos pone la suite roja"*, observado con `within(fila)`:

1. **el dato que muestra** — el más olvidado
2. componente de icono
3. etiqueta visible / clave de copy
4. **nombre accesible** (se cruza igual en nodos solo-icono)
5. color o hueco de fondo
6. **tinta del icono**
7. **color y receta tipográfica de CADA texto** — aquí son **tres** (título, fecha,
   contador), no uno
8. destino de navegación
9. **condición de render** — mueve la cardinalidad, así que se verifica en **más de un
   escenario**
10. **forma del contenedor** (`flex-row items-center gap-*`) **en todas sus ramas**,
    incluido el estado vacío si promete "la misma anatomía de fila"
11. **envoltorios de agrupación** (`flex-1`) que reparten el espacio
12. **orden de los hijos** — `within(fila).getByTestId(...)` es **agnóstico al orden**;
    se cierra con `fila.children[i]`

Del contenedor: identidad, orden y **cardinalidad con `children.length`, NUNCA contando
coincidencias de `testID`**. Invariantes compartidos a inventariar aparte: tamaño de
icono, objetivo táctil y reparto, radio, rol y agrupación accesible, sitio de render, y
feedback de pulsado.

**Dimensiones que #70 no tenía y #85 estrena** (la memoria avisa: una dimensión nueva
por ronda, contar por hijos y no por testID):
- **cuántas filas como máximo** y qué pasa al superarlo
- **el orden entre filas** (y que ese orden sea observable: cruzar dos filas debe romper)
- **el empate**: dos elementos con la misma fecha
- **la mezcla**: si la vacuna del perfil y los recordatorios comparten lista, una fila de
  cada origen debe distinguirse, y cruzar sus datos debe poner rojo

Y el método de la carta: *cada candado se demuestra con una sonda —cruzar el valor en
producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se escribe.*
La memoria añade que la sonda debe plantarse **en la zona ciega**, no donde es cómoda.

### R-G. Deuda de nombres que se resuelve sola

Los `testID` (`reminders-section*`, `reminders-see-all`) y las claves `home.reminders*`
ya dicen "recordatorios" mientras la copy dice "vacuna". Al ampliar la sección, los
nombres vuelven a cuadrar **sin renombrar nada** — salvo los cuatro nodos
`reminders-next-vaccine*` y `reminders-none-upcoming`, que sí son específicos de vacuna.

---

## Decisiones abiertas para el humano

Ordenadas: **D-A determina todo el resto del diseño de backend.**

| id | Pregunta | Por qué importa |
|---|---|---|
| **D-A** | ¿**Una** fila (la más próxima) o una **lista** de varias? | Es la bifurcación (a) vs (b). Con una fila, `nextReminder` es la ranura exacta que el contrato reserva y la opción (a) es la honesta. Con varias, el contrato congelado no da cabida y (b) gana |
| **D-B** | Si lista: ¿tope de filas (¿3?) o ventana temporal (¿próximos 30 días?) o los dos? | Sin tope, una mascota con 40 recordatorios ocupa toda la Home. Sin ventana, se pinta algo de dentro de un año como si fuese inminente |
| **D-C** | ¿La vacuna del perfil **sigue** en la sección, fusionada con los recordatorios, o **desaparece** de la Home? | §5: son disjuntas y **no hay clave para deduplicar**. Fusionar puede duplicar visualmente la misma vacuna; no fusionar puede perder el dato que #70 acaba de entregar |
| **D-D** | ¿Se filtran `sent` y `cancelled`, y los vencidos? ¿Con qué corte? | El endpoint devuelve **todo el historial**, lo más viejo primero. Sin filtro, la Home pinta un recordatorio de hace tres meses arriba del todo. `/reminders` los enseña con `opacity-50`; la Home puede optar por ocultarlos |
| **D-E** | ¿Las filas son **pulsables**? | #70 D8 dijo que no, para no abrir un camino Home→pestaña. Con recordatorios reales el destino natural es `/reminders`, que **ya** es el destino del enlace de la cabecera — pulsar la fila sería un segundo camino al mismo sitio, y **#70 R10 tiene un candado que lo prohíbe** (`no añade un segundo camino a la lista desde la Home`, `index.test.tsx:~2149-2160`) |
| **D-F** | Copy: ¿se vuelve a `Recordatorios`/`Reminders` y `Ver todos`/`See all` (los textos previos a D8), o a textos nuevos? | El criterio de aceptación de #85 dice "el título vuelve a ser Recordatorios en los dos idiomas y el enlace recupera su rótulo" — que apunta a los valores previos a D8. Confirmarlo por escrito evita reinventarlos |
| **D-G** | Icono: **reicon** (#70 R13 prohíbe emoji en esta sección) o los **emoji** de `REMINDER_TYPE_META` que ya usa `/reminders` | Elegir uno rompe la coherencia con la otra pantalla o rompe R13. Tercera vía: mapear cada `ReminderType` a un icono reicon, lo que **añade un mapa nuevo** y deja `reminder-meta.ts` con dos representaciones |
| **D-H** | **O7**: ¿se canda el inglés? ¿Solo en la sección de #85 o en toda la Home? | Ver R-C: el candado honesto es renderizar en `en`, no leer `catalog.ts` |
| **D-I** | Zona horaria: ¿el día civil se calcula con el reloj del **dispositivo** (como Salud) o se espera a #82? | Si los recordatorios se filtran en local y la vacuna sigue llegando con `gt` UTC del servidor, la propia sección queda incoherente consigo misma el día de la dosis |
| **D-J** | Orden de trabajo: ¿#85 **depende** de #84, o escribe su propio helper en `screens/home/format.ts` como hizo #70? | El veto de #84 no bloquea a #85 (cero llamantes en la Home). Pero `calendarDaysUntil` **tampoco vale** para un instante (R-A), así que hay que escribir algo igualmente. Merece decidirse si se aprovecha para **unificar** —que es el 4º criterio de aceptación de #84— o si se dejan tres implementaciones |
| **D-K** | ¿Se mantiene la promesa de **"sin llamadas nuevas"** (#70 R15)? | La opción (b) la incumple por definición: la Home pasaría de 3 peticiones al arranque (`listPets`, `getPet`, `getDailyActivity`) a 4. La spec debe **enmendar R15 explícitamente**, no ignorarlo |

---

## Recomendación

**Sobre las tres opciones de diseño.**

| opción | coste backend | coste móvil | candados que mueve | veredicto |
|---|---|---|---|---|
| **(a) extender el contrato del perfil** | puerto `pets/domain/ports/pet-reminder-reader.ts`, adaptador drizzle en `reminders/infrastructure/repositories/`, módulo envoltorio `reminders/pet-reminder-read.module.ts`, import en `pets.module.ts`, campo en `PetProfile` + `GetPetUseCase`, tipo y valor en el mapper | tipar `nextReminder` en `api/types.ts`, leerlo en la Home | **si es singular** (rellenar `nextReminder`): solo los asserts de nulidad (2 sitios). **Si es una lista o una clave 25ª**: las 24 claves en **6 ficheros** + la regla escrita en el propio mapper | **Honesta solo si D-A = una fila.** Es el precedente exacto de `nextVaccine` y la ranura existe para esto |
| **(b) la Home llama al endpoint que ya existe** | **cero** | un `useApi` más en `HomeScreen`, patrón idéntico al de `detail`/`activity`; `listReminders` de `src/api/reminders.ts` se reutiliza **sin tocar**; filtrado y orden en cliente | ninguno en backend; en móvil, enmendar #70 R15 | **La más barata y la que recomiendo** si D-A = lista |
| **(c) endpoint nuevo** | controller + use case + método de repo + e2e nuevos, y una segunda forma de leer lo mismo | igual que (b) | los suyos propios, nuevos | **Descartable**. Duplica una lectura que ya se sirve, y el filtrado que justificaría el endpoint cabe en el cliente sin coste medible (una mascota tiene decenas de recordatorios, no miles) |

**Enfoque sugerido (sin implementarlo):**

1. **Cerrar D-A primero.** Es una decisión de producto, no de arquitectura, y todo lo
   demás cuelga de ella. Mi lectura del encargo y del criterio de aceptación de #85
   ("los recordatorios reales", en plural, "no el estado vacío") es que se quiere una
   **lista corta**. Con esa lectura:
2. **Opción (b)**, con `listReminders` tal cual y filtro en cliente. Cero backend, cero
   contrato congelado tocado, cero dependencia de #82. La honestidad arquitectónica está
   a favor: `docs/architecture.md` no pide que el perfil sea un agregador, y el perfil es
   un contrato **explícitamente cerrado** cuya única ranura para esto (`nextReminder`) es
   **singular**. Meterle un array sería mentirle al nombre del campo; añadir una clave 25ª
   sería contradecir un comentario normativo que vive en producción.
3. **Aritmética de días propia**, en `src/screens/home/format.ts` junto a
   `calendarDaysUntil`, que acepte un **instante ISO** y lo normalice a día civil local
   antes de restar medianoches. Candado con espías de `Date`, no con `process.env.TZ`.
   Y proponer en la spec que **#84 se unifique contra ella** (es su 4º criterio de
   aceptación), en vez de dejar tres implementaciones.
4. **La vacuna se queda y se fusiona** (mi inclinación, sujeta a D-C): quitarla sería
   retroceder sobre #70 y perder el único dato que la Home ya tiene garantizado. Pero la
   spec debe decir por escrito que **la duplicación visual es posible y aceptada**, porque
   deduplicar sin FK es adivinar. Alternativa más limpia y también defendible: dejar la
   vacuna como **primera fila fija** (origen distinto, tratamiento distinto, sin mezclar
   en el orden), lo que elimina el problema del empate y el de comparar un día civil con
   un instante.
5. **Enumerar las 12 decisiones por fila de la Enmienda #70** más las cuatro nuevas de
   R-F, con recuento por `children.length` y aserciones de posición (`children[i]`), y
   **declarar todos los deltas de R-D como sumandos**, jamás como cifras absolutas.

**Para la parte móvil**, cargar `expo-native-ui` (pantalla, safe areas, HIG) y
`appllama-app-design-skill` (obligatoria en toda tarea de UI móvil según
`docs/ui-guidelines.md` §Skills), con el límite 1 de la carta: de la skill se toma el
**patrón**, nunca el sistema de estilos — aquí manda Tailwind v4 + uniwind +
heroui-native con tokens en `src/theme/global.css`. El proyecto está en **Expo SDK
~57.0.14 / RN 0.86.2**, con `@expo/ui ~57.0.11` y `heroui-native 1.0.8` ya instalados.
**No hace falta `FlatList`**: la lista es corta y va dentro del `ScrollView` de la Home,
igual que `/reminders`, que ya pinta sus filas con `.map`.

---

## Premisas del encargo, contrastadas

| # | premisa | veredicto |
|---|---|---|
| 8 | `reminder-dates.ts:15` usa `Math.ceil` sobre ms y está vetado | **Cierta y la línea es exacta.** Llamantes: `screens/reminders/index.tsx:235` y `:275`, ninguno en la Home |
| 8b | #85 puede evitarlo usando `calendarDaysUntil` de `screens/home/format.ts` | **Parcialmente falsa.** Existe y es correcto, pero **solo acepta `YYYY-MM-DD`**; con el ISO con hora de `dueAt` devuelve **`NaN` en silencio**. Hace falta una variante para instantes |
| 9 | `pet-vaccine.drizzle-reader.ts` usa `gt` y la vacuna de hoy no vuelve | **Cierta**, línea `:27`, y el `after` es el día **UTC** del servidor (`get-pet.use-case.ts:73`) sobre una columna `date` |
| 9b | ¿el repo de recordatorios tiene el mismo defecto? | **NO.** `listByPet` no filtra por fecha en absoluto. #85 no lo hereda por la opción (b) |
| 10 | O7: los candados de literal solo miran el español | **Cierta**, reproducida contra el árbol de hoy |
| — | "el contrato del perfil da UNA próxima vacuna y nada más" (#85) | **Cierta**, y además la ranura reservada `nextReminder` es **singular** por diseño documentado |
