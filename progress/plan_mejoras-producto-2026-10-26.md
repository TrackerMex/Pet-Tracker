# Plan: mejoras de producto tras la paridad (2026-10-26)

> Petición del humano (2026-10-26), literal: «ya terminamos de implementar todo
> la parte de UI. Mejoras: Como funcionan los roles · Quien genera las vacunas
> en la parte de salud · En nutricion se planea que el que genere el plan sea el
> usuario a traves de un formualrio y con la ia genere el plan de acuerdo a las
> respuestas del usuario · En la app no existe la forma de compartir una moscota
> · Recordatorios recurrentes».
>
> Escrito por el leader sobre `origin/main` = `fa3f36c0`. Evidencia con
> file:line en los tres informes de exploración:
> - `progress/explore_roles-sharing-2026-10-26.md`
> - `progress/explore_vaccines-reminders-2026-10-26.md`
> - `progress/explore_nutrition-questionnaire-2026-10-26.md`
>
> Las líneas citadas en esos informes caducan al mergear; cada spec re-mide sus
> anclas por contenido.

## 0. Estado de partida

| Tema | Hoy |
|---|---|
| Roles | `pet_users` admite owner/family/walker/vet, pero el código solo distingue **owner frente al resto**. Family, walker y vet son idénticos: leen todo, sirven comidas, reconocen alertas y reciben todos los push. `permissions` jsonb nunca se lee. |
| Compartir | No existe ningún endpoint ni pantalla para invitar, listar, quitar o cambiar de rol. La única fila de `pet_users` que crea la API es la del owner. El lado receptor ya funciona (`myRole`, push, mapa sin pagar). |
| Vacunas | Solo el owner las registra, y solo por API. La app es de solo lectura (decisión de #37) y el canvas no dibuja el alta. El catálogo (7 vacunas) se siembra a mano: `init.sh` no corre `seed:vaccines`. En la app real Salud siempre sale vacía. |
| Nutrición | El motor determinista calcula el plan y la IA (Anthropic, `ANTHROPIC_MODEL`) solo escribe `ai_explanation`, y solo con collar activo (OV3 de #18). **No hay formulario del perfil**, así que «Generar plan» acaba en 422 en la app real. |
| Recurrentes | No existen en ninguna capa. Cada recordatorio se dispara una sola vez (`scheduled` → `sent`). El toque en el push de un recordatorio lleva a `/alerts`. |

## 1. Decisiones del humano (2026-10-26, cuestionario de opción cerrada)

| Tema | Elegido | Consecuencia |
|---|---|---|
| IA en nutrición | **B híbrida** | El cuestionario alimenta al motor. El motor fija como cotas las kcal, los gramos y el número de comidas. La IA propone **dentro** de esas cotas, con salida estructurada validada: reparto por comida, recomendaciones de seguimiento y fecha de revisión. Si algo cae fuera de cota, se usa el plan del motor. **Enmienda el mandato** «las reglas calculan, la IA solo explica» (brief §16, plan 009). |
| Invitación | **Código + Share** | El owner genera un código de un solo uso con caducidad y lo comparte con el `Share` nativo. El invitado, con cuenta, lo escribe en la app. Sin email, hosting ni deep links. Email + enlace quedan para una v2. |
| Roles v1 | **Solo Familiar** | El owner solo invita como `family`. `walker` y `vet` siguen en el CHECK sin usarse hasta que se definan. La matriz no cambia: family = lo que hoy tiene «cualquier miembro activo». |
| Repetición | **Calendario + cada N h** | Una vez, Diario, Semanal, Mensual, Anual y «cada N horas» (medicación). Modelo de intervalo `{unidad, cada}`. La hora se ancla a la zona del owner. Sin fin, o hasta una fecha. |
| Flujo | **Extender el mandato del 2026-10-23** | El leader firma las specs con la checklist de firma delegada (`plan_canvas-parity-2026-10-23.md` §4), lanza Codex en herdr, abre las PRs a `dev` y las mergea con CI verde y veredicto «aprobado» del `reviewer`. `dev` → `main` lo mergea el humano. |
| Diseño | **Artboards nuevos** | El leader añade artboards al canvas «Pet Tracker: propuesta de UI» con el lenguaje actual y el copy en Voz B. El humano los aprueba antes de cada spec móvil (gate G1). |
| Costo IA | **Collar + límite diario** | Se mantiene OV3 (IA solo con collar activo) y se añade un límite de N generaciones con IA por mascota y día. Pasado el límite, se sirve el plan del motor sin IA y sin llamada. **N = 3**, elegido por el humano el 2026-10-26 («3 por día», gate G3 cerrado). |
| Vacuna → aviso | **Toggle opt-in** | En el formulario, un switch «Recordarme la próxima dosis», encendido por defecto, crea un recordatorio de tipo `vaccine` con el endpoint que ya existe. Es solo móvil y no acopla módulos. |

Valores por defecto del leader, sin pregunta (el humano puede revertirlos):
- AWS real (EventBridge Scheduler, CDK, IAM) queda **fuera**. La recurrencia
  corre en el despachador local (`setInterval` + SQS de LocalStack).
- Editar o borrar vacunas desde la app queda fuera de #208. Si se pide, será una
  feature aparte.
- `firstDoseMonths` y `series` del catálogo siguen como dato muerto. Un
  calendario por edad es una decisión clínica.
- Las fechas siguen en el día local del owner, también para los miembros.
- Los push siguen yendo a todos los miembros activos, sin filtro por rol.

## 2. Features

Ids verificados contra `origin/main` (máximo 207). Las rutas móviles son
relativas a `mobile-pet-tracker/src/` y las de backend a `backend-pet-tracker/src/`.

| Ola | id | name | Capa | Depende de | Cubre |
|---|---|---|---|---|---|
| 1 | 210 | `reminders-recurrence` | backend | — | Recurrentes |
| 1 | 211 | `pet-members-api` | backend | — | Compartir |
| 1 | 212 | `nutrition-ai-structured-plan` | backend | — | Nutrición B |
| 2 | 208 | `mobile-vaccine-create` | móvil (+ `init.sh`) | G1 | Vacunas |
| 2 | 209 | `mobile-nutrition-questionnaire` | móvil | G1 | Nutrición (formulario) |
| 2 | 213 | `mobile-reminders-recurrence` | móvil | 210, G1 | Recurrentes |
| 2 | 214 | `mobile-pet-members` | móvil | 211, G1 | Compartir |
| 3 | 215 | `mobile-nutrition-ai-plan` | móvil | 212, 209, G1 | Nutrición B |
| 3 | 216 | `mobile-role-aware-actions` | móvil | 214 | Coherencia de roles |

### 208 `mobile-vaccine-create`
- Ruta delgada `app/pets/[petId]/vaccines/new.tsx` más `screens/vaccine-create/`
  (convención de #39).
- Clientes nuevos en `api/health-records.ts`: `getVaccineCatalog(species)` y
  `createVaccine`.
- Campos:
  - catálogo por especie **o** nombre libre (el backend exige exactamente uno);
  - `appliedAt` no futuro, con `ExpoDateTimePicker` como en `add-reminder`;
  - `nextDoseAt` opcional, para corregir el cálculo;
  - veterinario, clínica y notas.
- Toggle «Recordarme la próxima dosis», encendido por defecto:
  - tras el 201, si la respuesta trae `nextDoseAt` futuro, se hace
    `POST /pets/:petId/reminders` con `type: 'vaccine'`;
  - la hora del aviso la fija la spec (propuesta: 09:00 local del owner);
  - si el recordatorio falla, la vacuna se queda y se muestra un toast de error,
    sin rollback.
- Entrada desde Salud (CTA en la sección de vacunas y en el vacío), solo para el
  owner (`myRole`).
- `init.sh` ejecuta `seed:vaccines`, que es idempotente. Sin eso, el selector
  sale vacío en un entorno nuevo.
- Disclaimer del plan 008: «Esquema orientativo. Consulta a tu veterinario.»
  Pasado a Voz B en el artboard.

### 209 `mobile-nutrition-questionnaire`
- Wizard por pasos (patrón del alta de mascota) sobre el
  `PUT /v1/pets/:petId/nutrition-profile` que ya existe.
- Preguntas = campos del perfil actual: actividad, condición corporal (BCS 1-9,
  con descripción), peso objetivo (si BCS ≥ 7), tipo de alimento y kcal/100 g
  (precarga 350 para seco y 90 para húmedo, según la respuesta a Q1 de
  `progress/design_ola0-mejoras-2026-10-26.md`), alergias y enfermedades.
- Alergias y enfermedades: chips de lista cerrada más «otra» con límite de
  longitud. El texto libre es superficie de inyección de prompt.
- `putJson` nuevo en `api/http.ts`. Al guardar se llama a
  `POST .../nutrition-plan/generate`.
- Entradas:
  - desde el estado «sin perfil» de Nutrición y de Horario;
  - «Editar perfil» desde las píldoras de Horario.
- «Generar plan» se oculta a quien no es owner (`canGenerate` hoy no mira el rol).
- Preguntas nuevas que el motor no modela (premios, alimentación mixta, objetivo
  explícito): **fuera**. Si hacen falta, piden una columna y una feature de
  backend.

### 210 `reminders-recurrence`
- Migración nueva: `recurrence` jsonb nullable
  `{unit: 'hour'|'day'|'week'|'month'|'year', every: int}` y `recurrence_until`
  date nullable, con CHECK de cotas que fija la spec.
- `CreateReminderSchema` y `UpdateReminderSchema` (strict) admiten los dos
  campos. `GET` los devuelve.
- En `notifyReminder`, tras el push:
  - si el recordatorio es recurrente y la siguiente ocurrencia no pasa de
    `until`, se llama a `reschedule` con un `scheduleName` nuevo y
    `enqueuedAt = null`;
  - si no, `markSent` como hoy.
- La siguiente ocurrencia es la **primera futura**: las perdidas no se disparan
  en ráfaga.
  - `day`, `week`, `month` y `year` se calculan sobre la hora local del owner
    (`addCalendarMonths`, `findOwnerTimezone`).
  - `hour` usa aritmética absoluta.
- Se reutiliza el candado `stale_schedule` tal cual.
- «Cancelar serie» = el `PATCH {status: 'cancelled'}` que ya existe.
- El mensaje de push lleva `kind: 'reminder'` y `reminderId` en `data`, para que
  el móvil pueda enrutar.
- La vuelta a EventBridge (D9 de pet-reminders) con `rate/cron` queda anotada en
  `design.md`, sin implementar.

### 211 `pet-members-api`
- Migración nueva: tabla `pet_invites` con estos campos:
  - `id`, `pet_id` (FK con cascade), `code_hash`;
  - `role` con CHECK `'family'`;
  - `created_by`, `expires_at`;
  - `accepted_by`, `accepted_at`, `revoked_at`, `created_at`.
- Endpoints:
  - `POST /v1/pets/:petId/invites` (owner): devuelve el código en claro **una
    sola vez**. El código es corto, sin caracteres ambiguos, de un solo uso y
    con caducidad.
  - `GET /v1/pets/:petId/invites` y `DELETE .../invites/:id` (owner): ver y
    revocar las invitaciones pendientes.
  - `POST /v1/invites/accept {code}`: sin `:petId`, mismo patrón D1 que
    `devices/claim`. Inserta `pet_users` con `family` y `active`.
    - Código inválido, caducado o usado: el mismo error genérico.
    - Ya es miembro: 409.
    - **Rate limit contra fuerza bruta**, con el patrón de `EmailRateLimitGuard`.
  - `GET /v1/pets/:petId/members` (cualquier miembro): nombre y rol. **No
    expone email.**
  - `DELETE /v1/pets/:petId/members/:userId`: el owner quita a un family, o un
    miembro se sale solo. **Nunca deja la mascota sin owner** (409).
- La revocación borra la fila de `pet_users` y la audita (`AuditLogger`).
  Borrarla deja que un re-invite no choque con la PK.
- La spec fija los límites: miembros por mascota, invitaciones pendientes y
  caducidad del código.
- `PetAccessGuard` y `@RequirePetRole('owner')` no cambian. Las lecturas, los
  push y el mapa ya funcionan para el nuevo miembro.

### 212 `nutrition-ai-structured-plan`
- **Enmienda documental en la misma PR**: brief §16 y plan 009 pasan de «la IA
  solo explica» a «el motor fija las cotas y la IA propone dentro». La razón:
  la decisión B del 2026-10-26.
- Salida estructurada (tool use / JSON schema) validada con zod:
  - gramos por franja, sobre las franjas **existentes** (respeta los horarios
    editados de #103; la IA no propone horarios). La suma debe quedar dentro de
    ±X % de los gramos del motor;
  - de 1 a K recomendaciones de seguimiento;
  - una fecha de próxima revisión dentro de un rango;
  - la explicación.
  - Si algo cae fuera de cota o la salida es inválida, se sirve el plan del
    motor, con explicación o `null` como hoy.
- Filtro determinista de alimentos tóxicos sobre las recomendaciones: si una
  menciona uno, se descarta. La lista de partida la valida el humano (gate G2).
- Entra en el prompt **y en el hash** (OV2) la tendencia de peso, que ya está en
  `weights`.
- Gate: collar activo (OV3) más un límite diario de N generaciones con IA por
  mascota (gate G3). Pasado el límite, no hay llamada.
- Cotas en el DTO: `allergies` y `diseases` llevan `.max()` (hoy no tienen).
- Columnas nuevas en `nutrition_plans` para la propuesta, en una migración nueva.
- El system prompt nuevo **lo aprueba el humano** (gate G2;
  `nutrition-prompt.ts` dice que cambiarlo es decisión suya).
- El `spec_author` carga la skill `claude-api`.

### 213 `mobile-reminders-recurrence`
- Chips de Repetición en `add-reminder`: Una vez, Diario, Semanal, Mensual,
  Anual y «Cada N horas» con stepper. Campo «Hasta» opcional.
- Etiqueta «Se repite…» en la lista. Los recurrentes siguen en «programados».
- Acción «Cancelar serie» con `patchJson` (ya existe en `api/http.ts`).
- `notificationHref` (`hooks/use-push-registration.ts`): un push de recordatorio
  abre Recordatorios, no `/alerts`.

### 214 `mobile-pet-members`
- Quinta tarjeta «Familia» en la rejilla de Perfil, que abre
  `app/pets/[petId]/members.tsx` con su pantalla en `screens/`.
- Owner: lista de miembros, «Invitar» (genera el código y abre el `Share`
  nativo con un texto en Voz B que incluye código y caducidad), revocar
  invitaciones pendientes y quitar miembros.
- Family: lista y «Salir de esta mascota».
- «Unirme con código» desde Perfil y desde el estado sin mascotas. Reutiliza el
  patrón del input de código de `pairing`. Tras aceptar, invalida la query de
  mascotas y selecciona la nueva.

### 215 `mobile-nutrition-ai-plan`
- Nutrición muestra los gramos por comida, las recomendaciones y la fecha de
  revisión cuando hay propuesta de la IA. Si no la hay, muestra el plan del motor.
- Estados: límite diario alcanzado, sin collar (la IA no está disponible) y
  propuesta descartada por cota.
- Sustituye el copy de ejemplo del canvas («Reduce la porción de la cena a 90 g…»)
  por datos reales.
- El formato de la recomendación IA **no** es de esta feature. El 2026-10-26 el
  humano se lo asignó a la sesión Frontend dentro de sus mejoras de UI (punto 5,
  `progress/plan_ui-2026-10-26.md`), y lo quiere ya. La spec de #215 se escribe
  sobre lo que ese cambio haya dejado en `dev`.

### 216 `mobile-role-aware-actions`
- Ocultar a family las acciones de owner en las pantallas que hoy muestran el
  botón y responden 403: registro de peso, alta de recordatorio, borrado en
  Recordatorios, vincular collar y subir documentos. Se sigue el patrón de solo
  lectura que ya existe (`ZonasSoloLectura`).
- El 403 del backend se queda como red de seguridad.
- Va al final porque solo se nota cuando ya existen miembros (#214).

## 3. Olas y paralelismo

- **Ola 0 (diseño, gate G1)**: el leader añade al canvas los artboards
  AltaVacuna, CuestionarioNutricion (sus pasos), NuevoRecordatorio con
  Repetición, Familia (owner, family, invitar, unirse, estados) y PlanIA (con
  sus estados). Publica una versión nueva y el humano aprueba artboards y copy.
  Mientras tanto corre la ola 1, que no necesita diseño.
- **Ola 1**: #210, #211 y #212 en paralelo (3 Codex como máximo; memoria
  `jest-timeout-por-carga-entre-codex`).
- **Ola 2**: #208, #209 y #213 primero. #214 entra cuando quede un hueco y #211
  esté en `dev`.
- **Ola 3**: #215 y #216.

**Migraciones paralelas**: #210, #211 y #212 añaden cada una una migración (la
siguiente libre hoy es `0020`). Drizzle encadena los snapshots, así que la
segunda y la tercera en mergear hacen `merge` de `origin/dev`, borran su
migración y la **regeneran** encima. Nunca se renumera a mano ni se hace rebase
(memoria `rebase-invalida-hashes-traceability`). Lo resuelve el Codex de la
feature con un prompt corto del leader.

**Catálogos compartidos en móvil**: `i18n/catalog.ts`, la tabla de copy,
`SCREEN_FILES` y `app/_layout.tsx`. La segunda PR mergea `origin/dev` en su
branch, igual que en la paridad.

**Antes de la primera feature**: `dev` va 1 commit por detrás de `main` (el
merge #255). Primero va una PR de sincronización `main` → `dev` (memoria
`rama-dev-integracion-paridad`).

## 4. Ciclo por feature

Idéntico a `plan_canvas-parity-2026-10-23.md` §4: worktree desde `origin/dev`,
`spec_author`, firma delegada con su checklist, handoff, Codex en herdr,
`reviewer`, `./init.sh` corrido por el leader, PR `--base dev` y merge del
leader. En el commit de firma va: `chore(spec): firma delegada #<id> (mandato
del humano 2026-10-23, ampliado 2026-10-26)`.

La checklist suma dos puntos para este plan:
- [ ] Las features de backend declaran su migración y cómo la regeneran si otra
      mergea antes (§3).
- [ ] Ningún endpoint nuevo revela si existe un usuario o un código (404 o error
      genérico).

## 5. Gates humanos

| Gate | Qué | Cuándo | Casilla |
|---|---|---|---|
| G1 | Aprobar los artboards nuevos y su copy | Antes de la spec de cada feature móvil | `progress/plan_mejoras-producto-2026-10-26.md` §5, abajo |
| G2 | Aprobar el system prompt nuevo y la lista de alimentos tóxicos | Antes del handoff de #212 | `specs/nutrition-ai-structured-plan/requirements.md` |
| G3 | Confirmar N (generaciones con IA por mascota y día) | **Cerrado el 2026-10-26: N = 3** («3 por día») | este plan, §1 |
| G4 | Smoke en el dev build de Android: push recurrente real (`PUSH_ENABLED=true`), `Share` nativo e invitación entre dos cuentas | Por lotes, al final de cada ola (`progress/smoke_mejoras-producto.md`) | ese fichero |
| G5 | Mergear `dev` → `main` | Cuando el humano dé la app por lista | PR en GitHub |

- [x] G1 aprobado por humano: artboards y copy de la ola 0 (versión del canvas: v140)
  - El humano lo aprobó en la sesión del leader el 2026-10-26 con estas palabras: «G1 aprobado, v140 contesta la preguntas y
    dime que recomiendas». Las respuestas a las preguntas abiertas están en
    `progress/design_ola0-mejoras-2026-10-26.md` §Preguntas abiertas.

## 6. Riesgos

- **Fuerza bruta sobre los códigos de invitación**: rate limit y códigos de
  entropía suficiente en #211. Lo revisa el `reviewer`.
- **IA fuera de cota o con alimentos tóxicos**: validación determinista en
  #212. La salida de la IA nunca llega sin pasar por zod y por el filtro.
- **Coste de la IA**: OV3 más el límite diario. Sin G3, #212 no pasa al handoff.
- **Push duplicado al reprogramar**: hoy ya existe el riesgo (push y luego
  marcar). La recurrencia lo multiplica. La spec de #210 decide si lo acepta o
  lo cierra.
- **Último owner**: #211 lo protege. El esquema no impide varios owners, pero
  esta v1 no los crea.
