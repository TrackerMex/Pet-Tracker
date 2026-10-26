# explore: vacunas en Salud + recordatorios recurrentes
Fecha: 2026-10-26 (base: `main` @ fa3f36c0, árbol limpio)

Investigación de solo lectura para planificar. No se tocó ningún fichero del repo.
Las rutas de backend son relativas a `backend-pet-tracker/` y las de móvil a
`mobile-pet-tracker/`, salvo que se indique otra cosa.

---

## A. ¿Quién genera las vacunas de la sección Salud?

### Respuesta corta

Las vacunas las registra el **dueño de la mascota, solo vía API**:
`POST /v1/pets/:petId/vaccines`, con `catalogId` o con nombre libre.
**La app móvil no tiene formulario de alta.** Lo decidió la spec: Salud es de
solo lectura, y el canvas aprobado tampoco dibuja el control.

El seed solo crea el **catálogo** (7 vacunas) y no crea ninguna vacuna de mascota.
En la práctica, los registros de `pet_vaccines` entran por curl, Postman, tests
e2e o inserciones directas en la base.

El backend no genera un calendario por especie ni por edad. Lo único
automático es esto: si la vacuna viene del catálogo, `nextDoseAt` vale
`appliedAt + 12 meses`.

### A.1 Backend: módulo health

**Endpoints** (`src/modules/health/infrastructure/vaccines.controller.ts`)
- `GET /v1/vaccine-catalog?species=dog|cat`: L35-45, controlador `VaccineCatalogController`.
- `@Controller('pets/:petId/vaccines')` con `@UseGuards(PetAccessGuard)`: L47-49.
  - `POST`: solo owner (`@RequirePetRole('owner')`), L57-77.
  - `GET`: cualquier rol activo, L79-84.
  - `PATCH :vaccineId`: owner, L86-108.
  - `DELETE :vaccineId`: owner, responde 204, L110-126.

**DTO** (`src/modules/health/application/dto/vaccine.dto.ts`)
- `CreateVaccineSchema` (strict) tiene estos campos:
  - `catalogId?` (uuid)
  - `name?` (texto de hasta 120)
  - `appliedAt` (IsoDate)
  - `nextDoseAt?`, `vetName?`, `clinic?`
  - `notes?` (hasta 2000)
- Un `refine` exige **exactamente uno** de `catalogId` o `name`.
- `UpdateVaccineSchema` admite `name` y `appliedAt`, más `nextDoseAt`, `vetName`, `clinic` y `notes` como nullables.

**Caso de uso de alta** (`src/modules/health/application/use-cases/create-vaccine.use-case.ts`)
- Rechaza un `appliedAt` futuro respecto a `ownerLocalDay` (#88).
- Si llega `catalogId`, busca la entrada y lanza `VaccineSpeciesMismatchError` si la especie no coincide.
- Calcula la próxima dosis así (~L57-61): `nextDoseAt = dto.nextDoseAt ?? (catalog ? addCalendarMonths(dto.appliedAt, catalog.scheme.boosterMonths) : null)`.
- Audita la operación como `vaccine.create`.

**Helper de fechas**
- `src/modules/health/application/vaccine-date.ts:1-8`: `addCalendarMonths(date, months)`. Recorta al último día válido del mes.

**Caso de uso de edición**
- `update-vaccine.use-case.ts` solo cambia lo que recibe y **no recalcula** `nextDoseAt`.
- Fue deliberado: `specs/health-vaccines/requirements.md` lo deja fuera de alcance (L99-106).

**Esquema de base** (`src/db/schema/health.schema.ts`)
- `vaccine_catalog` (L19-37): `species` con CHECK dog/cat, `name`, `scheme` jsonb y unique `(species, name)`.
- `pet_vaccines` (L39-66):
  - `catalog_id`: FK nullable.
  - `name`, `applied_at` (date) y `next_dose_at` (date null).
  - `vet_name`, `clinic`, `notes`, `document_key`, `created_by`.

**Esquema de dosis** (`src/modules/health/domain/entities/vaccine.entity.ts:3-7`)
- Tipo: `VaccineScheme {firstDoseMonths; series?; boosterMonths}`.
- **Solo se usa `boosterMonths`.** `firstDoseMonths` y `series` son datos muertos: un grep confirma que ningún código los lee.

**Seed del catálogo** (`src/db/seed/vaccine-catalog.ts`)
- L15-51 definen 7 entradas, todas con `boosterMonths: 12`.
  - Perro: Rabia, Polivalente (DHPPi) con `series [2,3,4]`, Leptospirosis y Tos de las perreras.
  - Gato: Triple felina (FVRCP) con `series [2,3]`, Leucemia felina (FeLV) y Rabia.
- `seedVaccineCatalog` (L53-73) es idempotente: borra las entradas no canónicas y hace upsert.
- Se lanza con `package.json:27` (`seed:vaccines`, que ejecuta `scripts/seed-vaccines.ts`).
- **No lo ejecuta `init.sh`.** Está documentado como paso manual en `docs/demo-runbook.md:180`.

**Lectura en el perfil**
- El perfil de la mascota expone `nextVaccine` (`src/modules/pets/application/use-cases/get-pet.use-case.ts:83`).
- Lo lee `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts:15-33` con `gte(nextDoseAt, from)`. Es inclusivo con hoy desde #82.

### A.2 Móvil

**Cliente de API** (`src/api/health-records.ts`)
- Solo existe `listVaccines`: L33-65, hace `GET /pets/${petId}/vaccines` en L43-48.
- El único POST del fichero es `createWeight` (L103-161).
- **No existe `createVaccine` ni un cliente del catálogo** (grep sobre todo `src/`).

**Pantalla Salud** (`src/screens/health/index.tsx`, 324 líneas)
- Consulta de vacunas: L66-70.
- La próxima vacuna se calcula en el cliente con `nextDoseAt >= hoy` (L78-91).
- `next-vaccine-card` está en L122, `vaccines-section` en L143 y las filas en L179-215. Todo es de solo lectura.
- El único `router.push` va al registro de peso (L271).
- No hay ninguna ruta de vacunas en `src/app/`.

**Tipo**
- `src/api/types.ts:155-166`: interfaz `Vaccine`.

### A.3 Specs y planes: qué dejaron fuera

**`specs/mobile-health/requirements.md`**
- L343-345, cita literal: «Alta/edición/borrado de vacunas desde la app — feature_list define 'vacunas (lista, próximas)': solo lectura. Por eso tampoco se crea cliente del catálogo».
- L347: también deja fuera los documentos de vacuna.
- `design.md:29` y `:415` dicen: «se creará con la feature de alta de vacunas».

**`specs/health-vaccines/requirements.md`**
- Requisitos:
  - R6 (L53-58): `nextDoseAt` automático.
  - R7 (L60-63): override de `nextDoseAt` o nombre libre.
  - R13 (L93-97): `nextVaccine` en el perfil.
- Fuera de alcance (L99-106): pantallas móviles, cambios al catálogo por API, rol veterinario y recálculo al editar.

**`specs/mobile-health-make-parity/requirements.md:559`**
- Deja fuera «Expediente médico» porque no tiene backend.

**Canvas de `specs/mobile-canvas-health-weight`**
- `canvas/Salud.dc.html` y `canvas/SaludEstados.dc.html` **no dibujan ningún control para añadir vacunas**.
- R15-R19 de esa spec son solo de visualización.

**`plans/008-salud-recordatorios.md`**
- L31 y L69 prevén un `vaccines.tsx` con formulario de alta:
  - selector del catálogo por especie o nombre libre;
  - fecha, veterinario y notas;
  - el disclaimer «Esquema orientativo. Consulta a tu veterinario.».
- **Nunca se construyó.**

**`docs/brief.md`**
- L992 lista «Registrar una vacuna» como acción del usuario.
- L170-172 hablan del catálogo y de la «Próxima dosis calculada».

**`progress/explore_vaccine-due-today-inclusive.md:62-66`**
- Ya lo constataba: «La app móvil no crea vacunas… Hoy las vacunas entran por API directa / e2e».

**`feature_list.json`**
- No hay ninguna feature de alta de vacunas en móvil (el id más alto es 207).

### A.4 Vacunas, recordatorios y alertas (#82)

- **No hay vínculo.** `src/modules/reminders/domain/entities/reminder.entity.ts:2` admite el tipo `'vaccine'`, pero nada crea un recordatorio a partir de una vacuna ni de su `nextDoseAt`.
- #82 solo corrigió la visualización: `nextVaccine` ahora incluye hoy. No añadió push ni alerta.
- El motor de alertas (`alertMessageSchema`) no trata las vacunas.
- Hoy, para recibir un aviso de una vacuna, el usuario tiene que crear a mano un recordatorio de tipo `vaccine`.

---

## B. Recordatorios recurrentes

### Respuesta corta

**La recurrencia no existe en ninguna capa:**
- tabla;
- DTO;
- dispatcher;
- notifier;
- formulario móvil;
- canvas.

Se aplazó de forma explícita dos veces: en pet-reminders §Fuera de alcance y en
el plan 008 §Notas. Cuando mobile-reminders encontró el chip «Repetición» del
diseño Make, lo descartó.

Cada recordatorio es un disparo único: pasa de `scheduled` a `sent`.

### B.1 Backend: módulo reminders (#16, #47, #125)

**Tabla** (`src/db/schema/reminders.schema.ts:14-53`)
- Columnas:
  - `id`, `pet_id`, `type` (varchar 20), `title` (120), `due_at` (timestamptz);
  - `advance_minutes`: por defecto 60, CHECK 0..10080 (L38-41);
  - `channel`: CHECK `'push'` (L42);
  - `status`: CHECK scheduled/sent/cancelled (L43-46);
  - `schedule_name` (varchar 64), `enqueued_at`, `created_by`.
- `type` acepta 7 valores (CHECK en L34-37).
- Índice parcial sobre `due_at` donde `status = 'scheduled'` (L49-51).
- **No hay columna de recurrencia.**

**DTO** (`src/modules/reminders/application/dto/reminder.dto.ts`)
- `FutureDueAtSchema`: fecha ISO con offset, posterior a ahora.
- `CreateReminderSchema = z.strictObject({type, title, dueAt, advanceMinutes?})`. Es strict: hoy rechazaría un campo `recurrence`.
- `UpdateReminderSchema` es una unión de dos formas: `{status:'cancelled'}` o `{dueAt?, advanceMinutes?, title?}`.

**Casos de uso**
- Alta (`create-reminder.use-case.ts:15-31`): `advanceMinutes` vale 60 por defecto, `status` arranca en `'scheduled'`, `scheduleName` es `reminder-${uuidv7()}` y `enqueuedAt` es null.
- Edición (`update-reminder.use-case.ts`):
  - solo owner, y el recordatorio tiene que estar `scheduled`;
  - o cancela, o llama a `reminders.reschedule(id, changes, 'reminder-'+uuidv7())`.

**Controlador** (`reminders.controller.ts`)
- `@Controller('pets/:petId/reminders')` en L38, con guard en L39.
  - `POST`: owner, L47-48.
  - `GET`: L63.
  - `DELETE`: owner, L70-72.
- `@Controller('reminders')` en L87, con `PATCH :id` en L91.

**Repositorio** (`reminder.drizzle.repository.ts`)
- `reschedule` (L54-65): pone el `scheduleName` nuevo y `enqueuedAt = null`, con condición `status = 'scheduled'`. **Este es el mecanismo para «rearmar» una fila.**
- `cancel`: L67-74.
- `findDue` (L76-89): `due_at - advance_minutes * interval '1 minute' <= now`, con `status = 'scheduled'` y `enqueued_at` null.
- `markEnqueued`: L91.
- `markSent` (L98-104): condicionado a `status = 'scheduled'`.

**Cómo se disparan**
1. **Planificador** (`reminders-scheduler.service.ts:20-40`): `setInterval(dispatchOnce, 60_000)`. Solo corre si `REMINDERS_ENABLED==='true'` y `NODE_ENV!=='test'`.
2. **Despacho** (`reminders-dispatch.service.ts:70-110`):
   - `findDue`, luego `findOwnerTimezone`;
   - SQS `SendMessage` con `{version:1, kind:'reminder', reminderId, petId, scheduleName, title, body, data}`;
   - después `markEnqueued`. Primero envía y luego marca: el orden es intencional.
3. **Texto del push** (`src/modules/reminders/application/reminder-push-body.ts`):
   - es-MX, con la forma `Recordatorio: <título> · <día> de <mes> a las HH:mm`;
   - en la tz del dueño, con UTC como respaldo (#125).
4. **Notifier** (`src/workers/notifier/notifier-consumer.service.ts`):
   - `notify` (L145) delega en `notifyReminder` (L157-178).
   - `notifyReminder` descarta los casos `not_found`, `not_scheduled` y `stale_schedule` (un `scheduleName` que no coincide).
   - Si no descarta, llama a `sendPush` (L176) y después a `reminders.markSent` (L177).
   - `sendPush` (L193) usa `findActiveMembersTokens(petId)`: el push va a **todos los miembros activos**.
   - Intervalo de 60 s.
5. **Emisor de push** (`src/workers/notifier/notifier.module.ts:25-32`):
   - si `PUSH_ENABLED==='true'`, usa `ExpoPushSender` (expo-server-sdk);
   - si no, `ConsolePushSender`.
   - Esquema de mensajes: `notification-message.schema.ts:28-42` (`reminderMessageSchema` dentro de un discriminatedUnion).

**Semántica del aviso**
- El aviso se dispara en `due_at - advance_minutes`.
- Si ese momento ya pasó, sale en el siguiente tick (pet-reminders `design.md` D4, L48).
- `specs/reminder-advance-already-past` D5: un aviso que cae exactamente en «ahora» cuenta como pasado.
- En móvil, `isAdvancePast` (`src/screens/add-reminder/index.tsx:45`) desactiva los chips cuyo aviso ya pasó (L293).

### B.2 Formulario móvil de crear y editar

**Pantalla de alta** (`src/screens/add-reminder/index.tsx`, 362 líneas)
- `ADVANCE_OPTIONS` (L33-38): 0, 1440, 4320 y 10080 minutos.
- `REMINDER_TYPES`: L40.
- Estado inicial (L69-80):
  - `type`: `'vaccine'`;
  - `title`;
  - `date` y `time`;
  - `advanceMinutes`: 10080.
- Selectores de fecha y hora: `ExpoDateTimePicker` de `@expo/ui/community/datetime-picker` (L253 y L271).
- `handleSubmit`: L82, con `createReminder` en L93.
- **No hay selector de recurrencia.**

**Edición**
- **No hay pantalla de edición ni cliente PATCH.**
- `src/api/reminders.ts` solo tiene `listReminders` (L37), `createReminder` (L73) y `deleteReminder` (L122).

**Lista** (`src/screens/reminders/index.tsx`, 468 líneas)
- Separa programados de inactivos (L271, L317, L332-342).
- Etiqueta «sent» en L380.
- Borrado en L105.

**Diseño Make original**
- `specs/mobile-figma-polish/design-src/App.tsx:1061-1071` tenía chips de «Repetición» con las opciones `["Una vez","Mensual","Semestral","Anual"]`.

**Canvas aprobado**
- `specs/mobile-canvas-routine/canvas/NuevoRecordatorio.dc.html` **no dibuja Repetición**.
- Solo muestra: Tipo (7), Título, Fecha, Hora, Aviso (4 chips), «Te avisaremos el…» y Guardar.

**Toque en el push**
- `src/hooks/use-push-registration.ts:12-17`: `notificationHref` manda a `/alerts/[alertId]` si hay `alertId` y a `/alerts` en cualquier otro caso.
- **Al tocar el push de un recordatorio se cae en `/alerts`, no en Recordatorios.**

### B.3 Specs: qué dejaron fuera sobre la recurrencia

**`specs/pet-reminders/requirements.md`, §Fuera de alcance (L160-183)**
- L168-169, cita literal: «**Recordatorios recurrentes** (`recurrence`, medicación cada 8 h — plan 008 §Notas): el shape lo admite después sin romper».
- L165-167: EventBridge y CDK.
- L181-182: push real de Expo.

**`plans/008-salud-recordatorios.md`, §Notas (L103)**
- Cita literal: «Recordatorios recurrentes = schedules con expresión `rate/cron` + no borrar al completar: la columna `recurrence` puede añadirse después sin romper el shape».
- Esa cita asume EventBridge Scheduler en AWS real.
- El plan tiene además una condición STOP contra un cron que escanee la base. Aplica al camino de AWS real, no al local actual.

**`specs/mobile-reminders/requirements.md`**
- L363-365: «Campos del diseño sin respaldo en backend: veterinario, clínica, teléfono de emergencia, notas y **repetición** — el schema strict los rechazaría». `design.md:188-189` dice lo mismo.
- L356-359: el push en el dispositivo queda fuera.
- L360-362: editar y cancelar quedan fuera.

**`specs/reminder-advance-already-past/requirements.md` §0**
- C1: el push va a todos los miembros activos, con la hora en la tz del dueño.
- C2: el backend no tiene locale por usuario.
- C9: no hay UI de edición ni cliente PATCH.

**`docs/brief.md` §17 (L702-740)**
- Describe un «motor central» de recordatorios para vacunas, desparasitación, medicamentos, consultas, peso, alimentación, etc.
- Lo que el usuario configura: activación, canal, anticipación y horario silencioso.
- **No menciona la recurrencia de forma explícita**, aunque «medicamentos» la implica.

**`feature_list.json`**
- No hay ninguna feature de recurrencia.

### B.4 Comidas (#103): un patrón diario reutilizable

**Modelo** (`src/db/schema/nutrition.schema.ts`)
- `nutrition_plans.meal_times`: jsonb `string[]` en formato `"HH:mm"` (L85), con `meals_per_day` CHECK 1-6.
- `meal_servings` (L116-140): `served_on` (date) y `meal_time`, con unique `(pet, served_on, meal_time)`.

**Cómo se repite**
- La recurrencia diaria es implícita: el mismo `mealTimes` vale para todos los días.
- El estado de «servida» se calcula por día local del dueño.
- **Las comidas no envían push** (grep sobre `modules/nutrition`).

**Relación con recordatorios**
- `specs/meals-served-tracking/requirements.md:613-615`: marcar un recordatorio de tipo `food` como comida servida es una feature aparte, porque `reminders.status` no tiene un valor `completed`.

**Piezas reutilizables para la recurrencia**
- Día local y tz del dueño: `src/pipeline/local-day.ts` y `src/modules/pets/application/owner-local-day.ts` (`ownerLocalDay`, `findOwnerTimezone`).
- Meses de calendario: `addCalendarMonths` en `src/modules/health/application/vaccine-date.ts`.

### B.5 Entrega del push: qué corre en local y qué en AWS

**Local** (lo que hay hoy)
- Todo corre en local: Docker más LocalStack, sin AWS real (`docs/architecture.md:92-93`).
- Los workers corren dentro del proceso (`docs/architecture.md:104`).
- El cron es un `setInterval`. La cola SQS `notifications` vive en LocalStack (`AWS_ENDPOINT_URL=http://localhost:4566`, `.env.example:36`).
- Flags en `.env.example`:
  - `NOTIFIER_ENABLED=true` (L89);
  - `REMINDERS_ENABLED=true` (L93);
  - `PUSH_ENABLED=false` (L98).
  - Ver también `docs/conventions.md:552-553`.
- Con `PUSH_ENABLED=false`, el push solo sale en consola.

**Push real a un teléfono**
- Requiere `PUSH_ENABLED=true` más un build de EAS (`docs/architecture.md:106`).
- El servicio de push de Expo es externo, pero no es AWS.

**AWS real** (no existe)
- EventBridge Scheduler no está en LocalStack community (`docs/architecture.md:105`).
- El camino de vuelta a AWS está diseñado en pet-reminders `design.md` D9 (L100-114):
  - schedules `at(due_at - advance)` de un solo disparo;
  - `ActionAfterCompletion: DELETE`;
  - rol IAM más `PassRole`;
  - `REMINDERS_ENABLED=false`.
- `infra/lib/pet-tracker-dev-stack.ts:48-55` solo tiene la cola SQS y su DLQ. No hay Scheduler.
- Cualquier cosa sobre AWS real (CDK deploy, IAM) **es exclusiva del humano** (CLAUDE.md §Excepciones).

---

## Riesgos / ambigüedades

1. **Vocabulario de la recurrencia sin decidir.**
   - Las fuentes no coinciden:
     - el Make tiene Una vez/Mensual/Semestral/Anual;
     - el plan 008 habla de «medicación cada 8 h»;
     - las comidas son diarias.
   - El modelo que se elija cambia el diseño entero. Opciones: enum, intervalo `{unit, every}` o RRULE.
2. **El canvas aprobado no tiene control de Repetición.**
   - Añadirlo rompe la paridad con el canvas recién cerrada (#196-#206).
   - Hace falta una decisión de diseño humana, o un dibujo nuevo en el canvas.
3. **Estrategia de ocurrencias.**
   - Opción A: rodar la misma fila. Es barato, pero se pierde el histórico de envíos.
   - Opción B: crear una fila nueva por ocurrencia. Conserva el histórico, pero hace crecer la tabla y complica la lista móvil.
   - La lista móvil separa programados de inactivos (`screens/reminders/index.tsx:332-342`). Con la opción A, un recurrente nunca pasaría a «enviado».
4. **Ancla temporal y DST.**
   - Opción 1: sumar meses o días sobre la hora local del dueño. Mantiene «las 9:00» aunque cambie el horario.
   - Opción 2: aritmética en UTC. Es más simple, pero se desplaza una hora con el DST.
   - México ya no tiene DST en la mayoría del país, pero no es universal.
5. **Idempotencia al rearmar.**
   - Hoy `markSent` es condicional a `scheduled`, y el token `scheduleName` descarta los mensajes viejos (`stale_schedule`).
   - Rearmar con un `scheduleName` nuevo dentro de `notifyReminder`, en lugar de `markSent`, reutiliza ese candado.
   - Pero el orden «push y luego marcar» admite un push duplicado si el proceso cae entre los dos pasos. Ese riesgo ya existe hoy.
6. **Condición de fin.**
   - Opciones: sin fin, hasta una fecha o N veces. Hoy no hay ningún campo.
   - Y si `dueAt` ya pasó al rearmar (el backend estuvo caído varios ciclos): ¿se salta al siguiente futuro o se dispara cada ocurrencia perdida?
7. **Editar y cancelar desde la app.**
   - No hay cliente PATCH ni UI de edición (C9).
   - Un recurrente sin forma de pararlo, salvo borrarlo, es mala experiencia. Probablemente necesita al menos «cancelar serie».
8. **Toque en el push.**
   - El toque en un recordatorio lleva a `/alerts` (`use-push-registration.ts:12-17`).
   - Con recurrentes habrá más pushes, así que el defecto se notará más.
9. **Vacunas: el alta en la app choca con el canvas.**
   - El canvas de Salud no dibuja el alta. Construirla exige un diseño nuevo, o reutilizar el patrón de «Registrar peso» (`router.push` en `screens/health/index.tsx:271`).
10. **Vacunas: el esquema por edad es dato muerto.**
    - `firstDoseMonths` y `series` existen en el seed pero no se usan.
    - Usarlos (por ejemplo, una serie de cachorro según la fecha de nacimiento) es una decisión clínica y de producto, no técnica. El plan 008 insiste en «Esquema orientativo. Consulta a tu veterinario».
11. **Vacunas a recordatorio automático.**
    - Generar un recordatorio desde `nextDoseAt` acopla dos módulos.
    - Quedaría por definir qué pasa si se edita la vacuna o se borra el recordatorio, y si el aviso va a todos los miembros o solo al owner.
12. **El seed del catálogo no corre con `init.sh`.**
    - En un entorno nuevo, el selector del catálogo saldría vacío sin `seed:vaccines`.
    - Hay que decidir si el handoff lo exige o si `init.sh` lo incorpora.

---

## Recomendación (enfoque sugerido, sin implementarlo)

**Vacunas**
1. Una feature móvil de alta, siguiendo el patrón #83/#98 (backend existente y feature solo móvil):
   - Cliente nuevo `createVaccine` más `getVaccineCatalog`, en `src/api/health-records.ts`.
   - Ruta nueva bajo `src/app/` con su pantalla en `src/screens/`.
   - El formulario usa el selector del catálogo por especie o un nombre libre. El backend ya valida «exactamente uno».
   - Campo `appliedAt` no futuro, con `ExpoDateTimePicker` como en `add-reminder`.
   - El backend ya calcula `nextDoseAt` y ya tiene todos los endpoints. No hace falta tocarlo.
2. El borrado y la edición pueden ir en una feature posterior.
3. No vincular vacunas con recordatorios en esa feature.

**Recurrencia** (solo local, sin recursos AWS)
1. Una feature de backend con:
   - columna nullable `recurrence` en una migración nueva (la siguiente del journal; verificar el número contra `origin/main`);
   - DTO strict ampliado;
   - en `notifyReminder`: tras el push, si el recordatorio es recurrente, `reschedule` al siguiente `dueAt` futuro con un `scheduleName` nuevo y `enqueuedAt = null`, en lugar de `markSent`;
   - la fecha siguiente calculada con `addCalendarMonths` y los helpers de tz del dueño.
   - Eso reutiliza el candado `stale_schedule` y `findDue` tal cual.
2. Una feature móvil, que depende de la anterior:
   - chips de Repetición en `add-reminder`;
   - etiqueta en la lista;
   - idealmente «cancelar serie» (cliente PATCH `{status:'cancelled'}`, que ya existe en el backend).
3. Aplazar EventBridge (D9) hasta que el humano decida desplegar en AWS real. Con schedules `rate/cron` sin `ActionAfterCompletion: DELETE`, el modelo de columna sigue sirviendo.
4. Arreglar el destino del toque en el push (que lleve a `/reminders`) como un cambio pequeño aparte, o dentro de la feature móvil.

**Ids**
- Las features nuevas empezarían en #208 o más.
- Verificar contra `origin/main` antes de asignarlas (memoria «Ids de feature: asignación única»).

---

## Decisiones abiertas para el humano

**Vacunas**
- [ ] ¿Se construye el alta de vacunas en la app? ¿Con selector de catálogo, nombre libre o ambos?
- [ ] ¿Con qué diseño? El canvas de Salud no lo dibuja: ¿se dibuja una pantalla nueva o se reutiliza el patrón de «Registrar peso»?
- [ ] ¿La edición y el borrado van en la misma feature o en otra?
- [ ] ¿Una vacuna con `nextDoseAt` crea sola un recordatorio o un push? ¿Para quién: owner o todos los miembros?
- [ ] ¿Se usan `firstDoseMonths` y `series` según la edad de la mascota, o siguen como dato muerto? Es una decisión clínica y de producto.
- [ ] ¿Se recalcula `nextDoseAt` al editar `appliedAt`? Hoy no se hace, por decisión de health-vaccines.
- [ ] ¿`init.sh` debe ejecutar `seed:vaccines`?

**Recordatorios recurrentes**
- [ ] ¿Qué vocabulario se usa?
  - Una vez/Mensual/Semestral/Anual (Make).
  - Diario/Semanal.
  - Cada N horas (medicación).
- [ ] ¿Qué modelo de datos: enum, intervalo o RRULE?
- [ ] ¿Rodar la misma fila o crear una fila por ocurrencia (histórico)?
- [ ] ¿Qué condición de fin: ninguna, una fecha o N veces?
- [ ] ¿La hora se ancla a la hora local del dueño (inmune al DST) o se calcula en UTC?
- [ ] ¿Qué se hace con las ocurrencias perdidas si el backend estuvo caído: saltar al siguiente futuro o dispararlas todas?
- [ ] ¿Cómo entra el control de Repetición en el diseño, si el canvas aprobado no lo tiene?
- [ ] ¿Entra «cancelar serie» o editar en la misma feature? (Hoy no existe el cliente PATCH.)
- [ ] ¿El toque en el push de un recordatorio debe llevar a Recordatorios en lugar de `/alerts`?
- [ ] ¿Se divide en una feature de backend y otra móvil, al estilo #83/#98?
- [ ] ¿Se confirma que AWS real (EventBridge Scheduler, CDK, IAM) queda aplazado y lo decide y despliega solo el humano?
