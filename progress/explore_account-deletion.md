# explore: account-deletion (#247 `users-account-deletion-api` + #248 `mobile-account-deletion`)
Fecha: 2026-11-06

Árbol leído: `/home/claude/sites/Pet-Tracker-wt-prod`, rama `docs/plan-produccion-aws`,
HEAD `aacfab9a` (= `origin/dev`). Solo lectura: no se corrió `init.sh`, ni tests, ni se
instaló nada. `graphify-out/graph.json` no existe en este worktree (`graphify query` falla
con «graph file not found»), así que todo sale de lectura directa. Rutas relativas a la
raíz del repo salvo que se diga otra cosa. Las líneas son las de `aacfab9a`: caducan al
mergear; la spec debe anclar por contenido.

Plan que origina el trabajo: `progress/plan_produccion-aws-2026-11-06.md` §2 (#247, #248)
y §5 (D3, G1). Features en `feature_list.json` ids 247 y 248 (ambas `pending`).

---

## 1. Mapa de datos del usuario (Postgres)

Fuente: `backend-pet-tracker/src/db/schema/*.schema.ts`, confirmado contra las migraciones
SQL de `backend-pet-tracker/src/db/migrations/`. Barrel: `src/db/schema/index.ts:10-25`
(16 ficheros de tablas; no hay más).

### 1a. Tablas con FK directa a `users.id`

| Tabla | Columna | onDelete actual | Evidencia | Qué pasa al hacer `DELETE FROM users` |
|---|---|---|---|---|
| `users` | — | — | `users.schema.ts:13-32` | Fila con email (UNIQUE), password_hash, nombre, teléfono, país, timezone. Sin `deleted_at` ni columna de estado. |
| `pet_users` (membresías) | `user_id` | **cascade** | `pets.schema.ts:71-73`; mig `0003_pets_crud_tables.sql:35` | Desaparecen todas sus membresías, **incluida la de `owner`**: la mascota queda viva y, si no tenía más miembros, huérfana (sin nadie que la vea). |
| `push_tokens` | `user_id` | **cascade** | `push-tokens.schema.ts:28-30`; mig `0008_stormy_moira_mactaggert.sql:13` | Se borran sus tokens Expo. |
| `password_reset_tokens` | `user_id` | **cascade** | `password-reset-tokens.schema.ts:10-12`; mig `0015_auth_password_reset_tokens.sql:11` | Se borran. |
| `email_verification_tokens` | `user_id` | **cascade** | `email-verification-tokens.schema.ts:11-13`; mig `0001_auth_registration_tables.sql:38` | Se borran. |
| `pet_invites` | `created_by` | **cascade** | `pet-invites.schema.ts:23-25`; mig `0020_pet_invites.sql:17` | Se borran las invitaciones que creó (pendientes o ya aceptadas: la fila es historial). |
| `pet_invites` | `accepted_by` | **set null** | `pet-invites.schema.ts:27-29` | La invitación que aceptó queda con `accepted_by = NULL`. |
| `audit_log` | `user_id` | **set null** | `audit-log.schema.ts:23-25`; mig `0001_auth_registration_tables.sql:37` | Diseñado para esto (comentario `audit-log.schema.ts:15-16`: «el usuario puede borrarse sin perder la traza»). Ver nota de `entity_id`/`meta` abajo. |
| `reminders` | `created_by` | **NO ACTION** (sin `onDelete`) | `reminders.schema.ts:36-38`; mig `0011_fancy_turbo.sql:20` | **Bloquea** el `DELETE` (error 23503) si queda algún recordatorio creado por él en una mascota que no se borra en la misma transacción. |
| `pet_vaccines` | `created_by` | **NO ACTION** | `health.schema.ts:54-56`; mig `0009_shallow_dust.sql:25` | Igual: bloquea. |
| `weights` | `created_by` | **NO ACTION** | `health.schema.ts:78-80`; mig `0010_low_miracleman.sql:12` | Igual: bloquea. |
| `pet_documents` | `created_by` | **NO ACTION** | `media.schema.ts:26-28`; mig `0014_late_lord_tyger.sql:13` | Igual: bloquea. |
| `meal_servings` | `created_by` | **NO ACTION** | `nutrition.schema.ts:146-148`; mig `0017_meal_servings.sql:11` | Igual: bloquea. **Este es el que muerde a un miembro `family`/`walker`**, ver abajo. |

Ninguna migración posterior cambia esas cinco FKs `NO ACTION` (la última es
`0023_vaccine_catalog_data.sql`).

**Quién escribe cada `created_by`** (determina a quién bloquea la FK `NO ACTION`):

- `reminders`, `pet_vaccines`, `weights`, `pet_documents`: solo el `owner`
  (`reminders.controller.ts:47-48`, `vaccines.controller.ts:58`, `weights.controller.ts:36`,
  `pet-media.controller.ts:67-68`, todos `@RequirePetRole('owner')`, rutas bajo
  `backend-pet-tracker/src/modules/*/infrastructure/`). Como hoy no existe transferencia de
  propiedad (§2), estas filas solo cuelgan de mascotas de las que el usuario es dueño: si
  esas mascotas se borran en la misma transacción, el cascade por `pet_id` las elimina y la
  FK no estorba.
- `meal_servings`: **cualquier miembro**. `meals.controller.ts:33-34` pone solo
  `PetAccessGuard` a nivel de clase y el `@Post()` de `:57` no lleva `@RequirePetRole`; el
  e2e `test/meals.e2e-spec.ts:391` («family sirve y walker deshace una franja servida por
  otro miembro») lo fija. Consecuencia: **un miembro `family` que alguna vez marcó una
  comida servida en una mascota ajena no se puede borrar con un `DELETE` simple**: Postgres
  devuelve 23503 y, sin mapeo, un 500.
- `meal_servings.created_by` sale en la respuesta HTTP
  (`nutrition/infrastructure/mappers/nutrition.mapper.ts:57,112`), pero el móvil no lo lee
  (`grep createdBy mobile-pet-tracker/src` sin resultados fuera de tests).

### 1b. Tablas que cuelgan del usuario solo vía mascota (`pet_id` → `pets.id`)

Todas con `onDelete: 'cascade'` sobre `pets.id`; se borran solas **si y solo si se borra
la mascota**. Borrar el usuario no las toca.

| Tabla | Evidencia | Nota |
|---|---|---|
| `pets` | `pets.schema.ts:26-57` | La mascota no tiene `owner_id`: la propiedad vive solo en `pet_users.role`. Lleva `photo_key` (S3) y `last_position` (caché). |
| `reminders` | `reminders.schema.ts:19-21` | Además `created_by` (1a). |
| `pet_vaccines` | `health.schema.ts:43-45` | `document_key text` (`health.schema.ts:53`). |
| `weights` | `health.schema.ts:72-74` | |
| `nutrition_profiles` | `nutrition.schema.ts:26-28` | |
| `nutrition_plans` | `nutrition.schema.ts:80-82` | |
| `nutrition_ai_generations` (contador del límite diario de IA, #208–#216) | `nutrition.schema.ts:119-131` | PK `(pet_id, local_day)`, **por mascota y no por usuario**: borrar el usuario no resetea ni libera nada; borrar la mascota sí. |
| `meal_servings` | `nutrition.schema.ts:138-140` | Además `created_by` (1a). |
| `geofences` | `geofences.schema.ts:45-47` | Sin columna de usuario. |
| `alert_events` | `alerts.schema.ts:34-36` | Sin columna de usuario (`acked_at` sin `acked_by`, `alerts.schema.ts:44`). `geofence_id` → `set null`. |
| `activity_daily` | `activity.schema.ts:31-33` | Sin columna de usuario. |
| `pet_documents` | `media.schema.ts:17-19` | Además `created_by` (1a). `key text` → S3. |
| `pet_invites` | `pet-invites.schema.ts:18-20` | |
| `pet_users` | `pets.schema.ts:68-70` | |
| `pet_devices` (historial collar-mascota) | `devices.schema.ts:69-71` | Cascade por `pet_id`; `device_id` sin cascade (`:72-74`). Ver §3 (collares). |

### 1c. Tablas sin relación con el usuario

- `devices` (`devices.schema.ts:27-55`) y `device_subscriptions`
  (`subscriptions.schema.ts:7-35`): el collar y su suscripción son **por dispositivo**, no
  por usuario. No hay tabla de pagos ligada al usuario. `vaccine_catalog`
  (`health.schema.ts:19`) es catálogo global.

### 1d. Lo que no existe

- **No hay tabla de sesiones ni de refresh tokens.** El único token es el JWT de acceso
  (ver §4). `grep -rn refresh backend-pet-tracker/src/db/schema` vacío; el comentario de
  `jwt-token-service.ts:10-13` dice «refresh tokens fuera de alcance».
- No hay soft delete en ninguna tabla (ni `deleted_at` ni `status` en `users`).

### 1e. Rastro que sobrevive al cascade

- `audit_log.entity_id` (`audit-log.schema.ts:28`) es `uuid NOT NULL` sin FK: las filas
  `user.register`, `user.update`, `user.email_verified`, `user.password_reset*` tienen
  `entity='user'` y `entity_id = <id del usuario>`
  (`register-user.use-case.ts:62-65`, `request-password-reset.use-case.ts:60-63`). Tras el
  borrado, `user_id` pasa a NULL pero `entity_id` conserva el uuid.
- `audit_log.meta` de `pet_member.remove` guarda `{ memberUserId }`
  (`remove-pet-member.use-case.ts:39`). Otros `meta` no llevan email ni nombre (solo ids y
  nombres de campos, p. ej. `update-profile.use-case.ts:51` `{ fields }`).
- El uuid es pseudónimo: sin la fila de `users` no se resuelve a email ni nombre. Si eso
  basta o hay que anonimizar también `entity_id`/`meta` es una decisión abierta (D-AUD).

---
## 2. Mascotas compartidas: owner frente a miembro

### Hallazgos

- **La propiedad vive solo en `pet_users.role`.** `pets` no tiene `owner_id` (§1b). Los roles
  son `owner`, `family`, `walker` y `vet`. Crear una mascota abre una transacción que inserta
  la mascota y una sola membresía `owner` (`pet.drizzle.repository.ts:36`, rol en `:57`).
- **Las invitaciones solo crean `family`.** Lo fija el check
  `pet_invites_role_check ... in ('family')` (`pet-invites.schema.ts:37`).
- **No existe la transferencia de propiedad.** Ningún caso de uso cambia `pet_users.role`. El
  único `DELETE` de miembros es `DELETE pets/:petId/members/:userId`
  (`pet-members.controller.ts:36`).
- **Salir y expulsar** (`remove-pet-member.use-case.ts:27-33`):
  - Un miembro que no es `owner` puede salirse él mismo.
  - El `owner` puede expulsar a otros.
  - **Nadie puede quitar al `owner`** (`OwnerNotRemovableError`, `pet-member.errors.ts:1-8`).
  - El caso de uso escribe auditoría `pet_member.remove` con `{ memberUserId }` (`:39`).
- **Borrar una mascota** es solo del `owner` (`pets.controller.ts:167-173`,
  `@RequirePetRole('owner')`). El caso de uso es `delete-pet.use-case.ts:21-30`. El repositorio
  hace únicamente `DELETE FROM pets` (`pet.drizzle.repository.ts:145-147`):
  - no borra objetos S3;
  - no libera el collar (§3);
  - no toca DynamoDB.
- **El «día local» de una mascota sale de la zona horaria de su `owner`**
  (`findOwnerTimezone`, `pet.drizzle.repository.ts:114-130`). Sin `owner`, `owner-local-day.ts:7-24`
  cae a una zona por defecto. Lo usan, entre otros, el límite diario de IA
  (`nutrition_ai_generations`, PK `(pet_id, local_day)`).

### Los tres casos al borrar al usuario U

| Caso | Qué hace hoy un `DELETE FROM users` | Qué falta |
|---|---|---|
| (i) U es miembro (no `owner`) de la mascota P | El cascade de `pet_users` borra su membresía. Equivale a «salir», pero sin la fila de auditoría `pet_member.remove`. `pet_invites.accepted_by` pasa a NULL. | Si U marcó alguna comida servida en P, la FK `NO ACTION` de `meal_servings.created_by` lo **bloquea** (§1a). |
| (ii) U es `owner` de P y no hay más miembros | La membresía desaparece y P queda **huérfana**: nadie la ve, pero sigue viva. | Hay que borrar P. Si no:<br>- el poller sigue ingiriendo sus posiciones;<br>- el collar sigue `assigned`;<br>- los objetos S3 se quedan;<br>- las FKs `NO ACTION` de sus recordatorios, vacunas, pesos y documentos bloquean el `DELETE`. |
| (iii) U es `owner` de P y hay otros miembros | P se queda **sin owner** y nadie puede usar los endpoints `@RequirePetRole('owner')`:<br>- editar o borrar P;<br>- recordatorios, vacunas y pesos;<br>- documentos;<br>- invitar.<br>Además, el día local cae a la zona por defecto. Y las filas `created_by = U` bloquean el `DELETE`. | Es la **decisión D3** (§Decisiones). |

### Opciones para el caso (iii)

Solo las describo; la decisión es D3.

- **(a) Borrar todas las mascotas de las que U es `owner`.** Es lo más simple: reutiliza el
  borrado de mascota y el cascade se lleva todo lo que cuelga de `pet_id`, también las filas
  `created_by = U`. Consecuencias:
  - los demás miembros pierden la mascota y todo su historial sin haberlo decidido ellos;
  - hace falta avisarles: hoy no hay notificación por push de «mascota borrada».
- **(b) Transferir la propiedad a otro miembro.** Es lógica nueva:
  - hay que decidir quién hereda (por ejemplo, el miembro más antiguo; verificar si `pet_users`
    guarda la fecha de alta) y si un `walker` o un `vet` puede heredar;
  - el día local cambia a la zona del nuevo `owner`, lo que afecta al límite de IA y a la
    actividad;
  - **las filas `created_by = U` en P siguen bloqueando el `DELETE`** (recordatorios, vacunas,
    pesos, documentos y comidas). Esta opción obliga además a decidir D-FK.
- **(c) Bloquear el borrado (409) mientras U sea `owner` de una mascota compartida.** Como no
  hay transferencia, la única salida del usuario es borrar esas mascotas a mano, así que en la
  práctica es (a) en manual. Consecuencias:
  - hacen falta un error nuevo, copy móvil y probablemente una lista de las mascotas que
    bloquean;
  - riesgo de revisión: Apple pide que el borrado no sea innecesariamente difícil (verificar
    contra el texto vigente de la guía 5.1.1(v)).
- **(d) Dejar las mascotas sin `owner`.** No es viable: queda inservible (ver la tabla) y la
  FK bloquea igualmente.

---

## 3. Fuera de Postgres

### S3 (bucket de medios)

- **Claves:**
  - fotos: `pets/${petId}/photo-${now.getTime()}` (`media/domain/photo-key.ts:7`);
  - documentos: `pets/${petId}/docs/${documentId}` (`media/domain/document-key.ts:2`).
  Todo cuelga del prefijo `pets/<petId>/`; **ninguna clave lleva el id del usuario**.
- **Las fotos se acumulan.** Cada subida genera una clave nueva y la anterior nunca se borra
  (`request-photo-upload-url.use-case.ts:41-43`). Para purgar una mascota hay que **listar el
  prefijo**: no basta con leer `pets.photo_key`.
- **`pet_vaccines.document_key`** existe en el esquema, pero hoy siempre se escribe `null`
  (`create-vaccine.use-case.ts:65`).
- **El puerto no puede borrar.** `PhotoStorage` (`photo-storage.ts:9-13`) solo firma
  Get, Head y Put; el adaptador solo importa `GetObjectCommand`, `HeadObjectCommand` y
  `PutObjectCommand`. Purgar exige:
  - un método nuevo en el puerto (`ListObjectsV2` sobre el prefijo y luego `DeleteObjects`,
    hasta 1000 claves por llamada);
  - **permisos IAM** `s3:ListBucket` y `s3:DeleteObject` en el rol de la tarea, que define
    #246. Hoy `infra/` no tiene grants.
- **Bucket:** `MediaBucket` en `infra/lib/pet-tracker-dev-stack.ts:93-97`, sin versionado en el
  stack de dev (`grep versioned` vacío). Hay dos cosas que verificar contra la doc de AWS antes
  de firmar #247:
  - si #246 o #249 activan versionado (la CRR de #249 lo exige), un `DeleteObjects` sin
    `VersionId` deja *delete markers* y los datos siguen recuperables hasta que actúe una
    regla de ciclo de vida;
  - con CRR, la replicación de *delete markers* va desactivada por defecto en las
    configuraciones con `Filter`, y los borrados con `VersionId` no se replican nunca.

### DynamoDB (posiciones)

- **Clave:** pk `PET#<petId>` (`positions-consumer.service.ts:403`), sk en milisegundos. TTL en
  `expires_at` a 90 días (`:51`, `:418-419`). Constantes en `aws/constants.ts:30-32`. Tabla CDK
  en `pet-tracker-dev-stack.ts:70-86`, con `RETAIN`.
- Las posiciones son **por mascota**, no por usuario: borrar el usuario no las toca, borrar la
  mascota tampoco. Revelan dónde vive el usuario, así que son dato personal en la práctica.
- **Dos opciones** (D-EXT):
  - dejarlas expirar por TTL (hasta 90 días);
  - `Query` sobre `PET#<petId>` más `BatchWriteItem` de borrado, de 25 en 25. Necesita un
    puerto nuevo e IAM `dynamodb:Query` y `dynamodb:BatchWriteItem`.
- **Copias:** el PITR de #246/#249 y la tabla global de #249 conservan copias hasta que vence
  la retención (D-RET).

### Wialon y collares

- **Wialon:**
  - el cliente es solo de lectura (`wialon-http.client.ts:80,91`); no escribimos datos del
    usuario en Wialon y **no hay nada que borrar allí**;
  - el poller lee las filas activas de `pet_devices` (`ingestion.drizzle.store.ts:44,71`): al
    borrar la mascota, el cascade de `pet_devices` corta la ingesta;
  - si la mascota queda huérfana (caso ii sin borrarla), la ingesta sigue.
- **Collares:**
  - el cascade de `pet_devices` deja `devices.status = 'assigned'` obsoleto;
  - el collar sigue pudiéndose reclamar porque la disponibilidad se deriva de la fila activa
    (`claim-device.use-case.ts:70-84`);
  - la transacción de liberación (`device.drizzle.repository.ts:112-125`) es el patrón a
    reutilizar para dejar el estado coherente;
  - `device_subscriptions` es por dispositivo, no por usuario (§1c).

### Expo Push

- `push_tokens` cae por cascade (§1a). En Expo no hay que dar nada de baja: el token es solo
  un identificador.
- **Notifier:**
  - `findActiveMembersTokens` (`notifier-consumer.service.ts:241`) dejará de encontrar los
    tokens de U;
  - los recordatorios de mascotas borradas se saltan con `not_found` (`:170-173`);
  - los tokens que Expo rechaza se limpian con `deleteByToken` (`:268`).
- No veo trabajo extra aquí.

### Login social

- **No hay** inicio de sesión con Apple ni con Google: `package.json` del móvil no tiene
  `expo-apple-authentication`, `google-signin` ni `auth-session`. Por eso no aplica la
  revocación de tokens de Sign in with Apple que Apple exige al borrar cuentas que lo usan.

---

## 4. Autenticación

### Cómo funciona hoy

- **JWT HS256 de acceso, con TTL de 24 h**: `ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60`
  (`jwt-token-service.ts:14`). Se firma y verifica en `:29-44` con payload `sub` y `email`.
- **No hay refresh tokens, ni tabla de sesiones, ni revocación** (§1d).
- **El guard global no consulta `users`.** `auth.guard.ts:18-24` y `:49-55` lo dicen
  expresamente: «sin consultar users (R8)». Es un requisito de una feature anterior; cambiarlo
  es una enmienda.
- **Precedente:** cambiar la contraseña tampoco invalida los JWT emitidos
  (`updatePasswordHash`, `user.drizzle.repository.ts:46-55`).
- **El puerto no sabe borrar:** `user.repository.ts:30-48` no tiene método de borrado.

### Qué pasa con un JWT de un usuario ya borrado (hasta 24 h)

- **`GET /v1/me`**: `UserNotFoundError` responde 404 (`users.controller.ts:102-109`; el
  comentario ya contempla al usuario borrado tras emitir el JWT). En el móvil, `getMe`
  (`src/api/users.ts:41-64`) mapea el 404 a `error`, **no** a `unauthorized`. Por eso:
  - Editar perfil muestra `profile.accountUnavailable`;
  - la `QueryCache` **no** cierra la sesión, porque solo lo hace con `unauthorized`
    (`src/providers/query-provider.tsx:18-27`).
  Afecta a **un segundo dispositivo** con sesión abierta: el que borra limpia su token, el otro
  no.
- **Rutas de mascota**: `PetAccessGuard` no encuentra membresía y responde 404/403. La lista de
  mascotas sale vacía.
- **Escrituras que insertan con FK a `users`** fallan con 23503 y, como no existe ningún mapeo
  de 23503 en `backend-pet-tracker/src` (`grep` vacío), salen como **500**:
  - `POST /v1/me/push-tokens`: el móvil lo hace al arrancar o al conceder permiso;
  - `POST /v1/pets`: `createWithOwner` inserta en `pet_users`.
- **El email vuelve a quedar libre.** Un registro nuevo con el mismo email recibe un uuid
  nuevo (UUIDv7); el `sub` viejo no coincide, así que no hay confusión de identidad.

### Reautenticación

- **No existe ningún patrón** de «confirma tu contraseña» en el backend.
- **Piezas reutilizables:**
  - el puerto `PasswordHasher` (`password-hasher.ts:7-15`);
  - la verificación del login (`login-user.use-case.ts:29-37`).
- **Trampa:** si una contraseña incorrecta respondiera **401**, el móvil cerraría la sesión:
  - Editar perfil hace `signOut()` con `unauthorized` (`edit-profile/index.tsx:90-91`);
  - la `QueryCache` hace lo mismo con las queries.
  La contraseña incorrecta tiene que ir por otro código (403 o 422, D-HTTP).
- **Cuerpo de la petición:** `deleteJson` del móvil ya acepta cuerpo opcional
  (`src/api/http.ts:107-133`). NestJS parsea cuerpos en `DELETE`.

---

## 5. Patrones del backend a reutilizar

Rutas bajo `backend-pet-tracker/src/modules/` salvo que se diga otra cosa.

| Necesidad | Patrón existente |
|---|---|
| Endpoint | `users/infrastructure/users.controller.ts`:<br>- `@Controller('me')` en `:40`;<br>- `DELETE push-tokens` en `:90-99` como plantilla de `@Delete()` con 204;<br>- `mapProfileError` en `:102-109`;<br>- `parseBody` en `:116-131`, si se pide la contraseña en el cuerpo. |
| Caso de uso con borrado | `pets/application/use-cases/delete-pet.use-case.ts:21-30` y su spec `delete-pet.use-case.spec.ts:26-44`. |
| Reglas por rol y errores de dominio | `remove-pet-member.use-case.ts:27-33`; `pet-member.errors.ts:1-8`. |
| Transacción Drizzle | `pet.drizzle.repository.ts:36`; device `:83` y `:114`; geofence `:115` y `:141`; weight `:21`; nutrition `:129`. |
| Liberar collar | `device.drizzle.repository.ts:112-125`. |
| Verificar contraseña | `PasswordHasher` (`password-hasher.ts:7-15`); `login-user.use-case.ts:29-37`. |
| Auditoría | `AUDIT_LOGGER`, como en `register-user.use-case.ts:62-65` y `update-profile.use-case.ts:51`. Si se registra un `user.delete`, hay que escribirlo **antes** del borrado. `user_id` pasará a NULL y `entity_id` conserva el uuid (D-AUD). |
| Puerto S3 | `photo-storage.ts:9-13`. Le falta el método de listar y borrar (§3). |
| e2e | `test/pets.e2e-spec.ts:675-714` (R16, borrado de mascota):<br>- `seedUser`, `createPetViaApi` y `seedMembership`;<br>- aserciones directas sobre la base;<br>- `TestingModule` en `:159-160`.<br>No hay un `users.e2e-spec.ts` propio: `/v1/me` se ejercita en los e2e de alerts-center-notifier, pet-members y pet-reminders. Existe `users.controller.spec.ts`. |

### Riesgo de arquitectura

El borrado cruza los módulos `users`, `pets`, `devices`, `media` y `positions`. No encontré una
unidad de trabajo o transacción compartida entre módulos: cada repositorio abre la suya. La spec
tiene que decidir quién orquesta y cómo comparte la transacción, sin romper las reglas de capas
de `docs/architecture.md`, que no releí para esta pregunta.

---

## 6. Móvil

Antes de esta parte cargué la skill `expo:expo-overview` y leí las secciones pertinentes de
`docs/ui-guidelines.md`. Rutas bajo `mobile-pet-tracker/`.

### Editar perfil (`src/screens/edit-profile/index.tsx`, 134 líneas)

- **`EditProfileScreen`** (`:18-49`):
  - `KeyboardAvoidingView` con `ScrollView` `screen-edit-profile`;
  - `contentContainerStyle` con `padding: 24, gap: 16, paddingBottom: insets.bottom + 24`;
  - título `profile.editProfile`;
  - `Skeleton` mientras carga;
  - `profile.accountUnavailable` si `getMe` no da `ok`.
- **`EditProfileForm`** (`:51-134`): `useAuth()` (`token`, `signOut`), `useQueryClient()` y
  `useChunkyLip()`.
  - `handleSubmit` (`:67-104`) mapea los kinds:
    - `unauthorized` llama a `signOut()`;
    - `validation` muestra `validation.checkDetails`;
    - `unreachable` muestra `common.cannotReachServer`;
    - el resto muestra `common.somethingWentWrong`.
  - El error se pinta con `FormError` (`:128`).
  - El botón Guardar está en `:129-131`: `h-14 rounded-16 bg-accent` con `chunkyLip.primary`.
- **Dónde colocar la acción:** si va dentro de `EditProfileForm`, debajo de Guardar, **solo
  aparece cuando el perfil cargó**. Si `getMe` falla, el usuario no ve la opción de borrar
  (ver D-UI).
- **Ruta:** `src/app/edit-profile.tsx` es una ruta delgada. Está en el `Stack.Protected` con
  `guard={status === 'authenticated'}` (`src/app/_layout.tsx:99-120`, `edit-profile` en
  `:117`). La guarda de bienvenida está en `:121-123`.

### Perfil (`src/screens/profile/index.tsx`, 605 líneas)

- Enlace `edit-profile-link` en `:554-561`.
- Filas de tema e idioma en `:563-587`.
- **Botón Cerrar sesión** `profile-sign-out` en `:591-600`:
  - `variant="danger-soft"`;
  - `h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}`;
  - etiqueta `text-15 font-extrabold text-danger`.

### Patrones destructivos ya en el árbol

- **BottomSheet de `@expo/ui/community/bottom-sheet`.** Es el camino que manda la carta
  (`docs/ui-guidelines.md:20` y `:101`; prohíbe importar `@gorhom` directamente).
  - **Salir de la mascota** (`src/screens/pet-members/index.tsx:349-366`):
    - `snapPoints={['50%', '100%']}` y `enablePanDownToClose`;
    - confirmar: `h-13.5 rounded-16 bg-danger` con `chunkyLip.danger` (`:357`);
    - cancelar: `variant="outline" ... border-2 border-lip-gray bg-surface` con
      `chunkyLip.neutral` (`:360`).
    - El disparador `pet-members-leave` (`:317`) es `variant="outline"` con
      `h-13.5 rounded-16 border-2 border-danger bg-surface` y `chunkyLip.neutral`. Es el análogo
      más cercano a «eliminar cuenta».
  - **Expulsar miembro**: `:326-348`.
  - **Borrar recordatorio**: `src/screens/reminders/index.tsx:570` (`confirmDelete` en `:210`).
- **`ConfirmDialog`** (`src/components/confirm-dialog.tsx:11-50`):
  - es un `Modal` con `role="alertdialog"` y confirmar en `text-danger`;
  - props: `testID`, `visible`, `title`, `body`, `cancelLabel`, `confirmLabel`, `onCancel` y
    `onConfirm`;
  - lo usan `geofences/index.tsx:202` y `geofence-editor/index.tsx:222`.
- No hay `Alert.alert` en el código de producción.
- **Tensión en la carta:**
  - `docs/ui-guidelines.md:~240` dice que los destructivos (`bg-danger`, `danger-soft`) van
    «sin labio»;
  - la Enmienda #203 (`:933-954`) añade `chunkyLip.danger` al botón destructivo de las hojas
    del canvas, y el árbol lo sigue (pet-members, reminders);
  - la regla de la carta es «gana el más específico»: la spec debe citar #203 de forma
    explícita.
- **Inventarios:** el botón nuevo entra en los inventarios de
  `src/__tests__/consistency-classnames.test.ts`.

### Cliente de API y cierre de sesión

- **`src/api/http.ts` `deleteJson`** (`:107-133`): firma
  `(baseUrl, path, token, fetchFn, body?)`; devuelve `{kind:'response'}` o
  `{kind:'unreachable'}`. Ejemplo de uso: `deletePushToken` (`src/api/push-tokens.ts:37+`).
- **`src/api/users.ts`**: `getMe` (`:41-64`) y `updateMe` (`:77-93`). Un `deleteMe` seguiría
  la forma de `updateMe`, con su propio kind para la contraseña incorrecta (o para el 409 de
  D3).
- **`signOut`** (`src/providers/auth-provider.tsx:73-88`):
  1. Si hay `pushTokenRef`, llama a `deletePushToken`.
  2. Borra el token de SecureStore (`'auth_token'`, `:15`).
  3. Pasa a `unauthenticated`.

  Después:
  - `query-provider.tsx:50-52` hace `client.clear()`;
  - el `Stack.Protected` desmonta las pantallas autenticadas;
  - `(tabs)/_layout.tsx:13-14` y `app/index.tsx:10-14` redirigen a `/welcome`.

  **Tras un DELETE correcto basta con llamar a `signOut()`**: no hace falta `router.replace`.
  - La llamada a `deletePushToken` irá con el JWT de un usuario ya borrado. Su token de push
    ya cayó por cascade, así que es una petición inútil. Su resultado no rompe `signOut`
    porque `deleteJson` no lanza en error de red. Queda por verificar qué responde el
    endpoint con un usuario inexistente.
  - Hay una alternativa: un `signOut` que se salte ese paso.
- **Teclado:** si D-PWD pide la contraseña dentro de una BottomSheet, hay que verificar cómo
  gestiona el teclado el wrapper community. `@gorhom` usa su propio `BottomSheetTextInput`, y
  la carta prohíbe importar `@gorhom` directamente. Hay precedente de problemas de teclado con
  edge-to-edge (SDK 57) en la memoria del proyecto.
- **Tests:** `renderRouter` necesita `await app;` y RNTL 14 tiene `fireEvent`/`act` asíncronos
  (notas de memoria). Que la sesión se cierre y se llegue a `/welcome` se prueba con
  `renderRouter`, no con mocks del router.

---

## 7. Copy

### Claves existentes reutilizables

Las líneas de `src/i18n/catalog.ts` van en formato en / es.

| Clave | Líneas | Uso posible |
|---|---|---|
| `common.somethingWentWrong` | `:81` / `:786` | Error genérico |
| `common.cannotReachServer` | `:80` / `:785` | Sin red |
| `login.password` | `:87` / `:792` | Etiqueta, si se pide contraseña (D-PWD) |
| `register.password` | `:107` / `:812` | Ídem |
| `login.invalidCredentials` | `:79` / `:784` | Posible error de contraseña incorrecta. Su texto genérico puede no encajar: lo decide G1. |
| `profile.editProfile` | `:399` / `:1104` | Título de la pantalla, ya en uso |
| `profile.accountUnavailable` | `:398` / `:1103` | Ya en uso |
| `reminders.deleteSheetBody` | `:443` / `:1148` | Precedente de «Esta acción no se puede deshacer». Es una clave de otra pantalla: copiar el criterio, no reutilizar la clave. |
| `members.leaveTitle` / `members.leaveBody` / `members.leaveConfirm` | `:601-604` / `:1306-1309` | Precedente de tono para una acción destructiva sobre la relación con la mascota |

**No existe `common.cancel`.** La convención es una clave de cancelar por pantalla:
`members.cancel` (`:597` / `:1302`), `reminders.cancel` (`:444` / `:1149`), `docs.cancel`,
`geofences.cancel`, `pairing.cancel` y `dateField.cancel`.

### Claves nuevas necesarias

Los nombres son orientativos. **Los literales son G1** (plan `:155`) y van en en y es dentro de
la R1 de la spec, para que Codex no los invente.

- Disparador de la acción (en Editar perfil).
- Título de la hoja o diálogo de confirmación.
- Cuerpo con las consecuencias. **Depende de D3**: debe decir qué pasa con las mascotas
  propias y con las compartidas.
- Botón de confirmar.
- Cancelar (`editProfile.cancel` o similar, por la convención anterior).
- Solo si D-PWD pide contraseña: la etiqueta del campo (o reutilizar `login.password`) y el
  error de contraseña incorrecta.
- Solo si D3 = (c): el error de «tienes mascotas compartidas», y quizá su lista.

### Candados que mueve el copy nuevo

- Cada fila nueva va en `src/__tests__/ui-copy-table.ts`; `profile.signOut` está registrada
  en `:325` como referencia.
- Esas filas mueven las cuentas `ALL_USES` y `SCREEN_FILES` del candado #65 R18 (nota de
  memoria).

---

## Riesgos

1. **Un `DELETE FROM users` a secas da 500 a un miembro `family` o `walker`** que alguna vez
   marcó una comida (`meal_servings.created_by` es `NO ACTION`, §1a). Tampoco existe ningún
   mapeo de 23503. Es el caso más común entre los invitados.
2. **Mascotas huérfanas.** Borrar el usuario no borra sus mascotas. Si no se borran a la vez:
   - el poller sigue ingiriendo;
   - el collar sigue `assigned`;
   - los objetos S3 y las posiciones se quedan;
   - sus filas `created_by` bloquean el `DELETE`.
3. **Transferir la propiedad (D3 b) no evita el bloqueo de la FK.** Las filas creadas por el
   owner en la mascota que sobrevive siguen apuntando a él; esa opción obliga a decidir D-FK.
4. **El JWT vive hasta 24 h tras el borrado.**
   - Un segundo dispositivo no cierra sesión: `GET /me` da 404, que el móvil trata como
     `error` y no como `unauthorized`.
   - Además, `POST /me/push-tokens` y `POST /pets` dan 500.
5. **Contraseña incorrecta con 401 cerraría la sesión** en el móvil (§4).
6. **S3 no sabe borrar todavía** y necesita IAM de #246. Con versionado o CRR (#249), borrar
   no elimina las versiones previas.
7. **Las copias de seguridad conservan los datos borrados** hasta que vence su retención: PITR
   de Aurora y DynamoDB, más las réplicas de #249. Hay que reflejarlo en la política de
   privacidad (D-RET).
8. **No hay atomicidad entre Postgres y los sistemas externos.**
   - Si Postgres confirma y S3 falla, los objetos quedan sin referencia y no se pueden
     reintentar, salvo que se guarden los prefijos.
   - Si S3 va primero y Postgres falla, un usuario vivo se queda sin fotos.

   El orden y el reintento son una decisión técnica para `spec_author`.
9. **Duración de la petición.** Un usuario con muchas mascotas y muchos objetos puede acercar
   la petición al timeout de inactividad del ALB (60 s por defecto; verificar en #246).
10. **Acoplamiento entre módulos** (§5): no hay unidad de trabajo compartida.
11. **Auditoría:** un `user.delete` con `entity_id = uuid` contradice la anonimización si
    D-AUD la elige. `audit_log.entity_id` es `NOT NULL`, así que anonimizarlo exige una
    migración o borrar las filas.
12. **Tensión en la carta** entre «destructivos sin labio» y la Enmienda #203 (§6).
13. **Teclado** dentro de la BottomSheet si se pide la contraseña (§6).
14. **Revisión de Apple:** con un bloqueo como el de D3 (c), o con una desactivación sin
    borrado real, hay riesgo de que la app no pase 5.1.1(v). Verificar contra el texto vigente
    de la guía.
15. **Calendario.** La app se presenta el miércoles 2026-11-11:
    - #247 no puede firmarse sin D3 (plan `:154`);
    - #248 no puede firmarse sin G1 (`:155`) y depende del contrato HTTP de #247.
16. **Las líneas citadas son las de `aacfab9a`** y caducan al mergear; hay que anclar por
    contenido.

---

## Decisiones abiertas para el humano

Solo las enumero, con sus opciones y consecuencias; no elijo ninguna. Las marcadas «técnica»
puede cerrarlas `spec_author` si el humano lo prefiere.

### D3. Mascotas de las que el usuario es owner y que comparte con otros

Opciones (a) a (d) de §2:

- **(a) Borrarlas.** Los demás miembros pierden la mascota y su historial.
- **(b) Transferirlas.** Lógica nueva: quién hereda, qué roles son elegibles y el cambio de
  zona horaria. Obliga también a D-FK.
- **(c) Bloquear con 409.** Hacen falta copy y un error nuevos; en la práctica es (a) en
  manual, y hay riesgo en la revisión de Apple.
- **(d) Dejarlas sin owner.** No es viable.

### D-FK. FKs `created_by` `NO ACTION`

Afecta a cinco tablas; como mínimo a `meal_servings`.

- **(1) Migración a `set null`, con columnas nullable.** Hay que cambiar el mapper de
  `meal_servings.createdBy`, que sale en la respuesta HTTP y el móvil no lee. Conserva el
  historial de los demás.
- **(2) Borrar las filas de U en las mascotas que sobreviven**, en código o con `cascade`. Los
  otros miembros pierden parte del historial de comidas.
- **(3) Reasignar al nuevo owner** (solo si D3 = b). Falsea la autoría.

### D-PWD. Reautenticación

- **(1) Contraseña en el cuerpo del `DELETE`.** Reutiliza `PasswordHasher`. Necesita un campo
  y copy nuevos y no puede responder con 401.
- **(2) Solo la confirmación en la UI.** Es lo más simple. Con el teléfono desbloqueado y la
  sesión abierta, un tercero podría borrar la cuenta.
- **(3) Escribir una palabra de confirmación.** Necesita copy nuevo y no verifica identidad.

### D-JWT. El JWT tras el borrado

- **(1) Aceptar la ventana de 24 h.** El dispositivo que borra limpia su token. Opcionalmente,
  el móvil puede tratar el 404 de `/me` como cierre de sesión (cambio en `getMe` y en sus
  tests). El otro dispositivo sigue con 500 en algunas escrituras.
- **(2) El guard comprueba que el usuario existe.** Cuesta una consulta por PK en cada
  petición y es una enmienda a R8 del guard.
- **(3) Versión del token o `tokens_valid_after`.** Es más útil para la contraseña que para el
  borrado, porque la fila ya no existe.
- **(4) Mapear 23503 a 401** en las escrituras que insertan con FK a `users`.

### D-HARD. Borrado inmediato o diferido

- **(1) Borrado duro inmediato.** Es lo más simple.
- **(2) Desactivación con un periodo de gracia y una purga programada.** Hace falta:
  - una columna de estado;
  - filtrarla en todas las consultas y en el login;
  - un job;
  - avisar al usuario del plazo.

  Verificar qué permite Apple.

### D-EXT. Purga de S3 y DynamoDB

- **(1) Purga inmediata** en la misma petición o en segundo plano. Necesita puertos nuevos e
  IAM de #246.
- **(2) S3 por regla de ciclo de vida y DynamoDB por TTL** (hasta 90 días). Hay que declarar el
  plazo.
- **(3) Mixto**, por ejemplo S3 inmediato y DynamoDB por TTL.

### D-RET. Copias de seguridad

PITR y backups de Aurora y DynamoDB, versiones de S3 y réplicas de #249. Decidir la retención y
cómo se comunica en la política de privacidad. Con la infraestructura actual no se puede
borrar de una copia concreta.

### D-AUD. Auditoría

- **(1) Mantener el uuid** en `entity_id` y `meta`. Es pseudónimo.
- **(2) Anonimizar `entity_id`.** Es `NOT NULL`: necesita una migración o un valor centinela.
- **(3) Borrar las filas** de auditoría del usuario.

En cualquiera de las tres hay que decidir además si se registra un `user.delete`.

### D-UI. Presentación (decisión de G1)

- **Contenedor de la confirmación:**
  - una BottomSheet: patrón de pet-members y reminders;
  - o `ConfirmDialog`: patrón de geofences.
- **Estilo del disparador:**
  - `outline` con borde `danger`, como `pet-members-leave`;
  - o `danger-soft`, como Cerrar sesión.
- **Dónde va:**
  - debajo de Guardar, y por tanto invisible si el perfil no carga;
  - o fuera del formulario, siempre visible.

### D-HTTP. Contrato (técnica)

- La ruta: `DELETE /v1/me` con 204, o `POST /v1/me/delete` si se prefiere evitar cuerpo en el
  `DELETE`.
- El código de la contraseña incorrecta: 403 o 422, nunca 401.
- El 409 si D3 = (c).
- Qué ve el móvil en cada caso.

---

## Recomendación

Es el enfoque sugerido, sin implementarlo. Queda sujeto a las decisiones de arriba.

### Backend (#247)

- `DELETE /v1/me` en `users.controller.ts` (204) y un caso de uso nuevo en el módulo `users`.
- En **una sola transacción de Postgres**:
  1. Si D-PWD lo pide, verificar la contraseña.
  2. Escribir la auditoría `user.delete`, si D-AUD la mantiene.
  3. Aplicar D3 a las mascotas de las que U es owner. Si se borran, reutilizar el borrado de
     mascota y **liberar sus collares** con la transacción de `device.drizzle.repository.ts:112-125`.
  4. Resolver las filas `created_by` según D-FK.
  5. `DELETE FROM users`, cuyo cascade se lleva membresías, push tokens, tokens de verificación
     y reset, e invitaciones creadas.
- **Tras el commit**, purgar los prefijos `pets/<petId>/` de las mascotas borradas, y DynamoDB
  según D-EXT. La purga es *best effort* y deja registro de cada prefijo para poder
  reintentarlo.
- **Tests:**
  - un `test/users.e2e-spec.ts` nuevo, sobre el patrón de `pets.e2e-spec.ts:675-714`;
  - un candado por caso:
    - usuario sin mascotas;
    - owner con una mascota en solitario;
    - owner de una mascota compartida (según D3);
    - **family con `meal_servings` en una mascota ajena** (regresión del 23503);
    - JWT usado tras el borrado;
    - contraseña incorrecta, si aplica.

### Móvil (#248)

- `deleteMe` en `src/api/users.ts` sobre `deleteJson`.
- En Editar perfil:
  - un disparador destructivo;
  - una BottomSheet community con confirmar `bg-danger` y `chunkyLip.danger`, citando la
    Enmienda #203;
  - cancelar con el estilo neutro de `pet-members/index.tsx:349-366`.
- Si el DELETE da 204, `signOut()`; el `Stack.Protected` lleva a `/welcome`. Los errores
  reutilizan `common.*`.
- Literales de G1 en R1, y filas nuevas en `ui-copy-table.ts`.

### Orden

1. D3, D-FK, D-PWD y D-JWT antes de la spec de #247.
2. La spec de #248, después de fijar el contrato HTTP de #247 y de G1.
3. #248 puede implementarse en paralelo con un doble del API.
