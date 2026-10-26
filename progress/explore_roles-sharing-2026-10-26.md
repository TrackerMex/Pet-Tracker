# explore: roles y compartir mascota
Fecha: 2026-10-26 · Base: `main` = `fa3f36c0` · Solo lectura (no se editó nada del repo)

## TL;DR
- Los roles **existen en datos y en autorización**, pero solo hay una distinción real: **owner frente al resto**. `family`, `walker` y `vet` tienen hoy exactamente los mismos permisos: leen todo, sirven/desmarcan comidas y reconocen alertas.
- **No hay manera de dar acceso.** No existe endpoint ni pantalla para invitar, listar, quitar o cambiar el rol de un miembro. La única fila `pet_users` que crea la API es la del owner al dar de alta la mascota. Los tests e2e insertan miembros con `db.insert(petUsers)` directamente. El recorte fue a propósito («Fuera de alcance» de #5).
- **El lado receptor ya funciona.** Un miembro activo ve la mascota en `GET /v1/pets` con `myRole`, recibe los push, ve el mapa sin pagar aparte (la suscripción va por collar, #25) y la app móvil ya oculta las acciones de owner en 5 pantallas. Lo que falta es **el lado que concede el acceso**.

---

## 1. Modelo de datos

| Qué | Evidencia |
|---|---|
| Tabla `pet_users` en Drizzle | `backend-pet-tracker/src/db/schema/pets.schema.ts:65-89` |
| Migración | `backend-pet-tracker/src/db/migrations/0003_pets_crud_tables.sql:1-10,34-36` (no hay migraciones posteriores que la toquen) |
| PK `(pet_id, user_id)`; FK con `ON DELETE CASCADE` a pets y users | `pets.schema.ts:68-73,82` |
| `role varchar(10)` con CHECK `('owner','family','walker','vet')` | `pets.schema.ts:74,83-86` |
| `permissions jsonb NULL`: **nunca se escribe ni se lee** | `pets.schema.ts:63-64,75`; `pet-membership.ts:6-7`. Un grep de `permissions` en `src/` solo da comentarios |
| `status varchar(20) NOT NULL DEFAULT 'active'`, **sin CHECK** | `pets.schema.ts:76`. El único valor que se escribe es `'active'` (`pet.drizzle.repository.ts:54-59`, en `createWithOwner`). El guard bloquea cualquier otro valor (`pet-access.guard.ts:57`; `pet-membership.ts:13`) |
| Tipo de dominio | `backend-pet-tracker/src/modules/pets/domain/entities/pet-membership.ts:1-15` |
| Documentación | `docs/data-model.md:23-24,53` («Toda autorización pasa por aquí») |
| **Tabla o flujo de invitación** | **No existe.** Un grep de `invit` en `backend-pet-tracker/src` da 0 resultados; tampoco hay ninguna feature `pending` sobre miembros en `feature_list.json` |
| Siembra de miembros en tests | `test/meal-times.e2e-spec.ts:346-350`, `test/meals-history.e2e-spec.ts:69-71`, `test/backfill-weights.e2e-spec.ts:60` |

Notas:
- `status` podría guardar `'pending'` o `'revoked'` sin migración porque no tiene CHECK. Pero `user_id` es NOT NULL con FK, así que una invitación a un email **sin cuenta** no cabe en `pet_users` y pide una tabla aparte.
- Nada impide **varios owners**: no hay unique sobre el rol. `findOwnerTimezone` ya asume que puede haber más de uno y toma el primero por `created_at` (`pet.repository.ts:47`; `pet.drizzle.repository.ts:114-130`).

## 2. Autorización

**Mecanismo.** `PetAccessGuard` (`backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts:35-80`) sigue estos pasos:
1. Si el `:petId` no es un UUID, responde 404 (`:49`).
2. Hace una sola consulta `findMembership`. Si no hay fila o el status no es `'active'`, responde **404**: «no existe» y «no eres miembro» dan el mismo 404 (`:55-58`).
3. Si el handler lleva `@RequirePetRole(...)` y el rol no está en la lista, responde **403** (`:61-73`). Sin decorador entra cualquier rol activo (`:75`).
4. Adjunta `request.petMembership` a la petición (`:76`).

El decorador está en `infrastructure/decorators/require-pet-role.decorator.ts:13`. **En todo el código solo se usa `@RequirePetRole('owner')`.** Ninguna ruta pide `'vet'`, `'family'` ni `'walker'`.

Las rutas sin `:petId` replican la misma lógica a mano:
- `POST /v1/devices/claim`: owner, en `claim-device.use-case.ts:50-58`.
- `PATCH /v1/reminders/:id`: owner, en `update-reminder.use-case.ts:37-41`.
- Alertas: `INNER JOIN pet_users` activo sin filtrar por rol, en `alert.drizzle.repository.ts:40,69-73,99-111`.

### Matriz rol × acción (hoy)
O = solo owner (403 al resto) · T = cualquier miembro activo · (+402) = exige además `PetTrackingGuard` (suscripción del collar)

| Área | Acción | Rol | Evidencia |
|---|---|---|---|
| Mascota | listar las mías (con `myRole`) | T | `pets.controller.ts:78`; `pet.drizzle.repository.ts:67-77` |
| | leer ficha | T | `pets.controller.ts:90-92` |
| | editar ficha | O | `pets.controller.ts:118-120` |
| | modo perdido | O | `pets.controller.ts:141-144` |
| | borrar (por cascada caen todas las membresías) | O | `pets.controller.ts:167-170`; `pet.repository.ts:59-63` |
| | subir foto | O | `media/infrastructure/media.controller.ts:29-31` |
| Salud | vacunas: leer | T | `health/infrastructure/vaccines.controller.ts:79` |
| | vacunas: crear, editar, borrar | O | `vaccines.controller.ts:57-58,86-87,110-112` |
| | peso: leer / registrar | T / O | `weights.controller.ts:62` / `:35-36` |
| Nutrición | perfil y plan: leer | T | `nutrition.controller.ts:67,139` |
| | perfil (PUT), generar plan, crear o editar horarios | O | `nutrition.controller.ts:52-53,80-82,95-96,115-116` |
| | **servir / desmarcar comida, historial** | **T** (walker y vet incluidos) | `nutrition/infrastructure/meals.controller.ts:42,57,78` (sin decorador; guarda `created_by`) |
| Recordatorios | leer | T | `reminders.controller.ts:63` |
| | crear, borrar, editar o cancelar | O | `reminders.controller.ts:47-48,70-72`; `update-reminder.use-case.ts:41` |
| Zonas | leer lista o detalle (+402) | T | `geofences.controller.ts:42,73-74,83-84` |
| | crear, editar, borrar (+402) | O | `geofences.controller.ts:52-53,101-102,124-126` |
| Collar | ver estado | T | `devices/infrastructure/pet-device.controller.ts:33-34` |
| | vincular / liberar | O | `claim-device.use-case.ts:56`; `pet-device.controller.ts:48-50` |
| Rastreo | posiciones, trayectos, actividad (+402) | T | `positions.controller.ts:34`; `trips.controller.ts:32`; `activity.controller.ts:26` |
| Documentos | listar (con URL de descarga) | T | `pet-media.controller.ts:41` |
| | subir / confirmar | O | `pet-media.controller.ts:50-51,67-68` |
| Alertas | listar (todas mis mascotas) | T | `alerts.controller.ts:41`; `alert.drizzle.repository.ts:69-73` |
| | **reconocer (ack)** | **T** | `ack-alert.use-case.ts:46`; `alert.drizzle.repository.ts:99-111` |

**Conclusión.** Fuera de owner no hay nada específico por rol. Los nombres `walker` y `vet` no tienen semántica propia: el brief §4 les da acceso temporal (paseador) y escritura clínica (veterinario), pero el código no implementa ninguna de las dos (`docs/brief.md:80-90`).

## 3. Endpoints de gestión de miembros

- **No hay ninguno**: ni añadir, quitar, listar, aceptar invitación ni cambiar rol. Los controladores completos son los que aparecen arriba más `auth` y `me` (`users.controller.ts:49,58,76,90`: perfil propio y push-tokens).
- **Búsqueda por email**: `UserRepository.findByEmail` existe (`auth/domain/repositories/user.repository.ts:41`) pero solo la usan el login y la recuperación de contraseña (`login-user.use-case.ts:29`, `request-password-reset.use-case.ts:32`). No está expuesta por API, lo cual es correcto porque evita la enumeración de usuarios.
- Spec `specs/pets-crud-permissions/requirements.md`:
  - Especificado: R9-R12 (guard, 404 antes que 403, `@RequirePetRole('owner')`, «sin decorador entra cualquier rol», con GET accesible a los 4 roles: `:147-156`).
  - **Diferido** («Fuera de alcance», `:195-203`):
    - «**Gestión de miembros** (invitar a family/walker/vet, cambiar rol, revocar membresía, endpoints de "usuarios autorizados" del brief §8) … Feature futura».
    - «**Permisos granulares** (`pet_users.permissions` jsonb …) la columna se crea pero no se interpreta … Feature futura».
    - «Rol administrador de plataforma … post-MVP» (`:219-220`).
  - El plan 004 dice lo mismo: «Fuera: invitaciones/miembros (post-MVP, brief §21)» (`plans/004-mascotas-crud-permisos.md:32`).
- El brief pone «Planes familiares» y «Acceso veterinario» en §21, posteriores al MVP (`docs/brief.md:870-898`), y «Usuarios autorizados» en el perfil de la mascota (§8, `:352`).

## 4. Lógica específica del owner

**Zona horaria: manda el día local del owner, nunca el del miembro.**
- `ownerLocalDay` (`pets/application/owner-local-day.ts:7-16`) usa `findOwnerTimezone`: primer owner activo, o UTC con un warn (`pet.drizzle.repository.ts:114-130`).
- Lo usan:
  - `get-pet.use-case.ts:77` (cálculo de la edad).
  - `update-pet.use-case.ts:40` (validación de que la fecha de nacimiento no sea futura).
  - `health/.../update-vaccine.use-case.ts:12`.
  - La activity store tiene una copia propia (`activity.drizzle.store.ts:217-232`) que usan `list-trips.use-case.ts:96` y `get-daily-activity.use-case.ts:73`.
  - `reminders-dispatch.service.ts:44`: **el texto del push se formatea con la zona del owner** también para los miembros que viven en otra.
- Única excepción: el alta usa la zona de quien da de alta (`create-pet.use-case.ts:34`, `requester-local-day.ts`).

**Push: van a todos los miembros activos, sin filtrar por rol.**
- `notifier-consumer.service.ts:145-155,193-198` llama a `findActiveMembersTokens(petId)` tanto para alertas como para recordatorios.
- `push-token.drizzle.repository.ts:66-79` («R8: INNER JOIN con `pet_users` activo, sin filtrar por `role`») y `push-token.repository.ts:47-48` («MVP: todos los miembros»).
- Así que un walker recibiría los recordatorios de vacunas y las alertas de zona a cualquier hora.
- Revocar una membesía (status distinto de `active`) corta los push sin tocar nada más.

**Suscripción.** `device-subscriptions` (#25, `feature_list.json`) decidió que la suscripción va por collar para que «la mascota compartida se resuelva sola»: todos los miembros ven el mapa sin pagar. No hay límite de miembros.

## 5. Móvil

- **El cliente ya conoce el rol**: `myRole` en `mobile-pet-tracker/src/api/types.ts:85`.
- **Pantallas que ocultan acciones de owner**:
  - `screens/geofences/index.tsx:47`
  - `screens/geofence-editor/index.tsx:59,85,92` (modo `readOnly`)
  - `screens/map/index.tsx:164-171` (modo perdido)
  - `screens/docs/index.tsx:114,195,241`
  - `screens/meal-schedule/index.tsx:79,300,365`
- **Pantallas que muestran la acción y manejan el 403 con un texto**: `weight-log/index.tsx:157`, `add-reminder/index.tsx:104`, `reminders/index.tsx:117`, `pairing/index.tsx:194,242`, `docs-upload-form/index.tsx:68`. Es inconsistente: un family ve el botón de vincular collar y luego recibe un error.
- **No hay ninguna UI de miembros, compartir, roles o invitar.** El catálogo i18n no tiene ni una clave para eso; lo único parecido es `'docs.vet'` (`src/i18n/catalog.ts:762`). Tampoco hay edición ni borrado de mascota en móvil (`src/app/pets/` solo tiene `add`, `docs`, `docs-upload`, `geofences` y `geofence-editor`).
- **Dónde encajaría**: en Perfil. `screens/profile/index.tsx:436-470` tiene una rejilla de enlaces de la mascota: Documentos, Collar GPS, Zonas y Recordatorios (este último en `:266-269`). Una quinta tarjeta, «Familia» o «Compartir», que abra `/pets/[petId]/members` seguiría el patrón de rutas de `docs` y `geofences`.
- **Canvas**:
  - La versión aprobada `1792777983-cd94` tiene 55 artboards, todos congelados en `specs/*/canvas/` (`progress/plan_canvas-parity-2026-10-23.md:30-33,61`).
  - El grep de `compartir|miembro|familia|invit|paseador|cuidador|share` en todos los `*.dc.html` da **0**.
  - `Perfil`, `PerfilCuenta` y `PerfilNotificaciones` (`specs/mobile-profile-photo-hero-canvas/canvas/`) solo dibujan esas 4 tarjetas más la cuenta.
  - **El canvas no dibuja ninguna pantalla de miembros.** Sí dibuja el estado de solo lectura para quien no es owner: `specs/mobile-canvas-zones/canvas/ZonasSoloLectura.dc.html` y `EditorZonaSoloLectura.dc.html`.
  - `docs/ui-guidelines.md` y el plan de paridad tampoco mencionan el tema.
  - El «Compartir» del mapa es otra cosa: compartir una ubicación, que se dejó fuera en `specs/mobile-map-gps-pill-battery/requirements.md:351` («`Share` está en el core de `react-native`»).

## 6. Email y deep links: ¿se pueden reutilizar?

**Email** (#auth-email-delivery):
- `ResendClient.deliver({event,userId,to,subject,text})` es genérico (`auth/infrastructure/email/resend-client.ts:17-43`).
- Cada mensaje tiene su puerto y su adaptador consola/Resend, conmutados por `EMAIL_ENABLED` (`auth.module.ts:62-89`). Ejemplos: `domain/ports/password-reset-sender.ts`, `email-verification-sender.ts`.
- Una invitación sería un tercer puerto con el mismo patrón, pero el cliente vive dentro de `auth/`: habría que exportarlo o moverlo.
- `EmailRateLimitGuard` (`auth/infrastructure/guards/email-rate-limit.guard.ts:28`) sirve para limitar los envíos.
- Las credenciales reales de Resend son un gate humano. En local, el adaptador de consola basta.

**Deep link** (#auth-reset-deep-link):
- El enlace se construye como `https://<RESET_LINK_HOST>/reset-password?token=…` (`password-reset-link.ts:1-7`).
- Android App Links con `pathPrefix: '/reset-password'` solamente (`mobile-pet-tracker/app.config.ts:61-77`). **No hay `associatedDomains` para iOS.**
- Página estática de respaldo y `assetlinks.json` en `hosting/` (`hosting/README.md:3-5`). Se suben a mano a Hostinger y hay que poner el fingerprint real (gates humanos G1-G4).
- Existe el scheme `mobilepettracker` (`app.json:8`).
- Para invitar con enlace haría falta: otro `pathPrefix` (`/invite`), otra página en `hosting/`, una ruta nueva en la app y **otra ronda de gates humanos**. Se puede reutilizar, pero no sale gratis.

---

## Riesgos y ambigüedades
- La spec `specs/nutrition-profile-engine/requirements.md:588` habla de un miembro `viewer`, un rol que no existe (el CHECK lo rechazaría). Es una inconsistencia menor de una spec antigua y conviene no arrastrarla.
- `meal_servings.created_by` apunta a `users.id` sin `ON DELETE` (`nutrition.schema.ts:128-130`). Hoy no importa porque no se pueden borrar cuentas, pero lo hará si algún día se añade.
- Si el único owner pierde la membresía, la mascota queda sin owner: nadie puede editarla y la zona horaria cae a UTC. Hoy no pasa porque no hay forma de quitar miembros, pero en cuanto exista hará falta proteger al «último owner».
- Un endpoint de invitación por email no debe revelar si el email tiene cuenta. Debe aplicar la misma regla del 404 genérico que siguen el guard y la recuperación de contraseña.

## Decisiones abiertas para el humano
1. **Mecanismo de invitación**:
   - (a) **Código corto** de un solo uso con caducidad, compartido con el `Share` nativo de RN (no necesita email, hosting ni deep link).
   - (b) **Email + enlace** (Resend + App Link `/invite`; más gates humanos; en iOS hoy no funciona).
   - (c) Las dos, en dos fases.
2. **Invitado sin cuenta**: ¿se le exige cuenta antes de aceptar, o la invitación queda pendiente ligada a un email hasta que se registre? (Pide una tabla de invitaciones; `pet_users` no puede guardarla.)
3. **Roles en la v1**: ¿solo `family`? ¿Siguen `walker` y `vet` aunque hoy sean idénticos a family? ¿O se definen sus diferencias ya (acceso temporal del paseador, escritura clínica del veterinario)?
4. **Matriz para quien no es owner**: hoy cualquier miembro sirve comidas y reconoce alertas, y no puede registrar peso, crear recordatorios ni vincular el collar. ¿Se confirma o se cambia (por ejemplo, family registra peso)?
5. **Push por rol**: ¿todos los miembros reciben todo, como hoy, o se filtra por rol o con un silencio por miembro?
6. **Zona horaria**: ¿se queda «manda el día del owner» para los miembros que viven en otra zona (incluido el texto de los recordatorios)?
7. **Gestión**: ¿quién ve la lista de miembros (todos u solo el owner) y qué datos de cada uno (nombre, email)? ¿Puede un miembro salirse solo? ¿Se permite **transferir o compartir la propiedad** (varios owners)? ¿Se protege al último owner?
8. **Revocación**: ¿borrar la fila o marcar `status='revoked'` y auditarlo? ¿Acceso temporal con caducidad (pide una columna nueva)?
9. **Límites**: número máximo de miembros por mascota y límite de invitaciones; posible relación con «planes familiares» (brief §21).
10. **Diseño**: el canvas no tiene artboard. ¿Se dibuja primero (Perfil → «Familia», lista de miembros, invitar, aceptar) y se aprueba el copy en/es? El copy del canvas nunca queda aprobado solo, hay que aprobarlo aparte.
11. **Coherencia de la UI de solo lectura**: ¿se ocultan las acciones de owner también en las pantallas que hoy enseñan el botón y responden 403 (vincular collar, peso, recordatorios)?

## Recomendación (sin implementar)
- **Separar el trabajo en dos features** con dependencia: backend «pet-members» primero y móvil «mobile-pet-members» detrás. Las dos van fuera del plan de paridad, que ya está cerrado.
- **Versión mínima del backend**:
  - Tabla `pet_invites`: `pet_id`, `code_hash`, `role`, `created_by`, `expires_at`, `accepted_by`, `accepted_at`, `revoked_at`.
  - Endpoints:
    - `POST /v1/pets/:petId/invites` (owner)
    - `GET /v1/pets/:petId/members` (lo que se decida en el punto 7)
    - `DELETE /v1/pets/:petId/members/:userId` (owner, o el propio usuario para salirse)
    - `POST /v1/invites/accept {code}` (sin `:petId`: mismo patrón D1 que `devices/claim`)
  - Se reutiliza `PetAccessGuard` y `@RequirePetRole('owner')` sin cambios. La aceptación inserta en `pet_users` con `status='active'` y se audita con `AuditLogger`, como `pet.delete`.
  - Todo el resto (lecturas, push, mapa sin pagar, `myRole` en móvil) ya funciona para el nuevo miembro **sin tocarlo**.
- **Móvil**: una quinta tarjeta en Perfil que abra `/pets/[petId]/members` (lista + «Invitar» con `Share` + «Unirme con código», reutilizando el patrón del input de código de `pairing`). Requiere un artboard nuevo antes de la spec (punto 10).
- **Lo que se deja para después**: email + deep link (la invitación por email puede llegar en una v2 reutilizando `ResendClient` y el patrón de `/reset-password`) y `permissions` jsonb (no se interpreta hoy; añadirlo solo si la matriz del punto 4 no cabe en roles fijos).
