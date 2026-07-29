# Plan 008: Salud — vacunas, próxima dosis, peso y recordatorios

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: deben existir `PetAccessGuard` (plan 004) y las tablas `vaccine_catalog`, `pet_vaccines`, `weights`, `reminders` (migradas en 002 según `docs/data-model.md`). La cola `notifications` debe existir. Si la Lambda `notifier` (plan 007) aún no existe, este plan PUEDE ejecutarse igualmente: los recordatorios encolan y quedan a la espera del consumidor (anotarlo en el reporte).

## Estado

- **Prioridad**: P1 · **Esfuerzo**: M · **Riesgo**: LOW–MED (integración con EventBridge Scheduler)
- **Depende de**: `plans/004-mascotas-crud-permisos.md` (y 007 para entrega push efectiva)
- **Categoría**: direction (MVP items 14–17 del brief §20)

## Por qué importa

Pilar 2 del brief: la salud organizada es la razón por la que muchos usuarios llegan (§3). MVP: registro de vacunas con próxima dosis calculada desde catálogo, registro de peso con variación, y el motor de recordatorios (vacunas/medicamentos/consultas) programado de forma serverless exacta con EventBridge Scheduler — sin cron propio que escanee la BD.

## Estado actual

- Tablas listas: `vaccine_catalog(species, name, scheme jsonb)`, `pet_vaccines`, `weights`, `reminders(schedule_name,…)` — ver `docs/data-model.md`.
- OpenAPI (plan 001): vaccine-catalog, vaccines CRUD, weights, reminders CRUD.
- Cola `notifications` (plan 002); notifier con contrato de mensaje `{kind, petId, title, body, data}` (plan 007).
- Perfil de mascota reserva `nextVaccine` y `nextReminder` (plan 004, hoy null).
- La Lambda API necesita permisos nuevos de Scheduler (paso 3) — cambio en `infra/lib/api.ts`.

## Comandos

Los de `plans/002` + `token:dev`. Seed nuevo: `npm -w apps/api run seed:vaccines`.

## Alcance

**Dentro**: `apps/api/scripts/seed-vaccines.ts`, `apps/api/src/modules/health/**` (vaccines, weights), `apps/api/src/modules/reminders/**`, `infra/lib/api.ts` (permisos scheduler + env `SCHEDULER_GROUP`, `NOTIFICATIONS_QUEUE_ARN`, `SCHEDULER_ROLE_ARN`) e `infra/lib/alerts.ts` o `messaging.ts` (grupo de Scheduler `pet-tracker-dev` + rol que permite `sqs:SendMessage` a la cola), pantallas `apps/mobile/app/pets/[petId]/health.tsx` (hub), `vaccines.tsx` (+form), `weight.tsx` (+form y gráfico), `reminders.tsx` (+form).

**Fuera**: desparasitación/medicamentos/consultas/alergias como entidades propias (post-MVP §21 — el `type` de reminders ya los contempla como recordatorio simple), documentos médicos y cartilla PDF (post-MVP), lectura IA de cartillas (post-MVP), veterinario habitual, condición corporal en UI (el campo existe en `weights`; la UI lo omite en MVP).

## Flujo git

`main`. Commits: `feat(api): vaccine catalog and pet vaccines with next dose`, `feat(api): weight tracking`, `feat(api): reminders with eventbridge scheduler`, `feat(mobile): health hub screens`.

## Pasos

### Paso 1: Seed del catálogo de vacunas

`seed:vaccines` (idempotente, upsert por (species,name)). Contenido mínimo — perro: Rabia (`{firstDoseMonths:3, boosterMonths:12}`), Polivalente/DHPPi (`{firstDoseMonths:2, series:[2,3,4], boosterMonths:12}`), Leptospirosis (`{firstDoseMonths:3, boosterMonths:12}`), Tos de las perreras (`{firstDoseMonths:3, boosterMonths:12}`); gato: Triple felina/FVRCP (`{firstDoseMonths:2, series:[2,3], boosterMonths:12}`), Leucemia felina/FeLV (`{firstDoseMonths:2, boosterMonths:12}`), Rabia (`{firstDoseMonths:3, boosterMonths:12}`). El `scheme` es orientativo; la UI siempre muestra "consulta a tu veterinario".

**Verificar**: `GET /v1/vaccine-catalog?species=dog` → 4 elementos; `species=cat` → 3.

### Paso 2: Vacunas y peso

- `POST /v1/pets/:petId/vaccines` `{catalogId? | name, appliedAt, vetName?, clinic?, notes?, nextDoseAt?}`: si viene catalogId y no nextDoseAt → calcular `next_dose_at = applied_at + boosterMonths` del scheme. GET (orden desc), PATCH, DELETE. Audit.
- `POST /v1/pets/:petId/weights` `{weightKg, measuredAt, bodyCondition?}` → insert + actualizar `pets.current_weight_kg` si es la medición más reciente. `GET .../weights?limit=` → lista + `variation`: delta contra la medición anterior.
- Perfil (plan 004): rellenar `nextVaccine` (mínima `next_dose_at` futura) y variación de peso.

**Verificar**: tests de servicio (cálculo next_dose con scheme; variación de peso con 0/1/2 mediciones); curls: alta vacuna con catálogo → next_dose_at correcto; mascota ajena → 404.

### Paso 3: Recordatorios con EventBridge Scheduler

Infra: grupo de Scheduler `pet-tracker-dev`, rol IAM asumible por `scheduler.amazonaws.com` con `sqs:SendMessage` a `notifications`; la Lambda API recibe `scheduler:CreateSchedule/DeleteSchedule/GetSchedule` limitado al grupo + `iam:PassRole` de ese rol.

- `POST /v1/pets/:petId/reminders` `{type, title, dueAt, advanceMinutes=60}`: valida dueAt futuro; crea schedule one-shot `at(dueAt - advanceMinutes)` (UTC), nombre `reminder-<uuid>`, target = cola `notifications`, input JSON `{kind:'reminder', reminderId, petId, title, body:'Recordatorio: <title>', data:{petId, reminderId}}`, `ActionAfterCompletion: DELETE`; guarda fila con `schedule_name`.
- `PATCH /v1/reminders/:id` (dueAt/title/cancel): cancelar → DeleteSchedule (tolerar NotFound) + status 'cancelled'; reprogramar → delete + create.
- El notifier (007), al procesar `kind:'reminder'`, marca `reminders.status='sent'` (añadir ese branch si 007 ya está DONE; si no, dejar TODO comentado y anotarlo en el reporte y en la fila de 007).
- Autorización de PATCH sin petId en ruta: cargar reminder → PetAccessGuard manual vía servicio (membresía sobre reminder.pet_id; sin acceso → 404).

**Verificar**: test de servicio con cliente Scheduler mockeado (create con nombre y hora correctos; cancel tolera NotFound). E2E real: crear recordatorio con dueAt = now + 3 min, advance 1 → en ~2 min mensaje visible en la cola (o log del notifier); evidencia en el reporte.

### Paso 4: Pantallas

- `health.tsx` (hub desde el perfil): tarjetas Vacunas (próxima dosis destacada con color de urgencia), Peso (último + flecha de variación), Recordatorios (próximos 3).
- `vaccines.tsx`: lista cronológica (nombre, fecha, próxima dosis con badge "vence en X días"), form de alta (selector del catálogo por especie o nombre libre, fecha, veterinario, notas). Disclaimer fijo: "Esquema orientativo. Consulta a tu veterinario."
- `weight.tsx`: gráfico de línea (misma lib elegida en el plan 006), lista, form (peso, fecha).
- `reminders.tsx`: lista (título, tipo con icono, fecha, estado), form (tipo, título, fecha/hora con picker, anticipación 15 min/1 h/1 día), cancelar con confirmación.

**Verificar**: typecheck exit 0; manual: alta de vacuna → aparece próxima dosis en el hub y en el perfil. Si no hay dispositivo: typecheck + pendiente manual.

### Paso 5: Cierre

OpenAPI, `STATUS.md`, fila 008 DONE (y nota en 007 si quedó el TODO del branch reminder), commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios: next_dose desde scheme (con y sin catalogId, con override manual), variación de peso (3 casos), reminders service (create/cancel/reprogram con mock), guard indirecto del PATCH de reminders (sin membresía → 404).
- E2E con evidencia: recordatorio de 3 min llegando a la cola/notifier.

## Criterios de done

- [ ] `npm run verify` exit 0 con las suites nuevas.
- [ ] Catálogo seedeado (curls dog=4, cat=3 en el reporte).
- [ ] Vacuna con próxima dosis calculada y visible en perfil y hub.
- [ ] Evidencia del recordatorio e2e (mensaje en cola o push/log del notifier).
- [ ] Cancelar recordatorio elimina el schedule (GetSchedule → NotFound, en el reporte).
- [ ] OpenAPI, `STATUS.md`, filas 008 (y nota 007 si aplica) al día.

## Condiciones de STOP

- `CreateSchedule` falla por permisos/PassRole tras revisar una vez rol y grupo → STOP con el error IAM exacto.
- La cuenta acumula schedules huérfanos (create sin fila en BD por fallo posterior) → envolver en saga simple (crear schedule después del insert, borrar fila si falla) — si aún así quedan huérfanos, STOP y repórtalo.
- Cualquier tentación de implementar el recordatorio como cron que escanea `reminders` cada minuto → STOP: contradice la decisión de arquitectura registrada (plans/README.md); repórtalo si Scheduler resulta inviable.

## Notas de mantenimiento

- Recordatorios recurrentes (medicación cada 8 h, §17) = schedules con expresión `rate/cron` + no borrar al completar: la columna `recurrence` puede añadirse después sin romper el shape.
- Si el volumen de schedules preocupa (miles), la alternativa barata es una sola regla cada 5 min + cola diferida — decisión ya documentada como plan B en README.
- La lectura IA de cartillas (post-MVP) escribirá en `pet_vaccines` con `document_key`: mantener `name` libre (no FK dura al catálogo) fue deliberado para eso.
