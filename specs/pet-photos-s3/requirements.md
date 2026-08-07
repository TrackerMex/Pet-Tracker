---
feature: "pet-photos-s3"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[pet-photos-s3]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 6 (description + acceptance_criteria),
> `docs/data-model.md` fila `pets` (columna `photo_key`),
> `specs/pets-crud-permissions/requirements.md` R8 (contrato de perfil, clave
> `photoUrl` placeholder).
>
> Depende de: `pets-crud-permissions` (#5, `done`) — `PetAccessGuard` +
> `@RequirePetRole()` y el token `PET_REPOSITORY` que `PetsModule` **exporta**
> se reutilizan tal cual, NO se redefinen; la columna `pets.photo_key` **ya
> existe** en el schema (creada por #5, sin migración nueva para agregarla).
> `localstack-provisioning` (#2, `done`) — el bucket `pet-tracker-media-local`
> (`src/aws/constants.ts`) y el cliente `S3_CLIENT` (`src/aws/`, módulo
> `@Global()`) ya existen y quedan reutilizados tal cual; esta feature NO crea
> otro bucket ni otro cliente S3. `auth-registration` (#3) — el puerto
> `AuditLogger` / `AUDIT_LOGGER` (`src/audit/`, `@Global()`) ya existe.
>
> Endpoint nuevo: `POST /v1/pets/:petId/photo-upload-url`. Endpoint existente
> modificado: `GET /v1/pets/:petId` — sustituye el placeholder `photoUrl:
> null` del contrato R8 de #5 por una URL prefirmada real cuando `photo_key`
> no es nulo, sin cambiar la forma del contrato (mismas claves).
>
> Qué NO alimenta esta feature: `GET /v1/pets` (listado), `POST /v1/pets`
> (creación) y `PATCH /v1/pets/:petId` (edición) siguen devolviendo
> `photoUrl: null` aunque `photo_key` exista — mismo alcance ya aceptado para
> `device` en `devices-claim` (#7 R12, que solo lo resuelve en el detalle).
> Ver D2.

## Requisitos funcionales

### Solicitud de URL de subida

- **R1**: WHEN un usuario con `role = 'owner'` sobre `:petId` envía `POST
  /v1/pets/:petId/photo-upload-url` con un body `{ contentType }` que valida
  contra el schema zod (`contentType` ∈ `{'image/jpeg', 'image/png',
  'image/webp'}`), THE SYSTEM SHALL: (a) generar la clave S3
  `pets/<petId>/photo-<ts>` con `ts` = epoch en milisegundos del momento de
  la petición; (b) persistir esa clave en `pets.photo_key` (sobrescribe el
  valor anterior si existía); (c) responder `200` con `{ uploadUrl,
  expiresInSeconds }`, donde `uploadUrl` es una URL S3 `PUT` prefirmada
  contra el bucket `pet-tracker-media-local` válida por exactamente
  `expiresInSeconds = 600` segundos (10 min).

- **R2**: IF el body de `POST /v1/pets/:petId/photo-upload-url` no incluye
  `contentType`, o su valor no es exactamente uno de `image/jpeg`,
  `image/png`, `image/webp`, THEN THE SYSTEM SHALL responder `400` con el
  detalle mapeado desde `ZodError`, sin modificar `pets.photo_key` ni emitir
  ninguna URL.

### Autorización (reutiliza PetAccessGuard de #5)

- **R3**: IF el usuario autenticado tiene membresía activa sobre `:petId`
  pero su `role` no es `'owner'` THEN THE SYSTEM SHALL responder `403`
  (`@RequirePetRole('owner')`) sin modificar `pets.photo_key`. Ver D1.

- **R4**: IF `:petId` no existe, es sintácticamente inválido, o el usuario
  autenticado no tiene fila en `pet_users` con `status = 'active'` para esa
  mascota, THEN THE SYSTEM SHALL responder `404` con el mismo body genérico
  que produce `PetAccessGuard` (R9/R10 de #5) — la comprobación de membresía
  precede siempre a la de rol (R3), sin test nuevo del guard, solo e2e de
  esta ruta. Test e2e obligatorio: usuario B sobre mascota de A → `404`.

### Auditoría

- **R5**: WHEN `POST /v1/pets/:petId/photo-upload-url` responde `200` (R1),
  THE SYSTEM SHALL registrar vía el puerto `AuditLogger` existente una
  entrada `action = 'pet.photo_update'`, `entity = 'pet'`, `entityId` =
  `:petId`, `userId` = usuario autenticado, `meta = { key }` con la clave S3
  generada. IF la petición responde `400`, `403` o `404` THEN no se escribe
  nada en `audit_log`.

### Lectura del perfil (GET /v1/pets/:petId)

- **R6**: WHEN un usuario con membresía activa envía `GET /v1/pets/:petId`
  (R8 de #5) y la mascota tiene `photo_key` no nulo, THE SYSTEM SHALL incluir
  en la clave `photoUrl` del contrato una URL S3 `GET` prefirmada contra el
  bucket `pet-tracker-media-local` para esa clave, válida por exactamente
  3600 segundos (1 h), en lugar del placeholder `null`. El resto del
  contrato de perfil (R8 de #5) SHALL NOT cambiar de forma.

- **R7**: WHEN un usuario con membresía activa envía `GET /v1/pets/:petId` y
  la mascota tiene `photo_key` nulo (mascota sin foto subida), THE SYSTEM
  SHALL responder con `photoUrl: null` — comportamiento ya vigente de #5, sin
  cambio.

### Seguridad del bucket

- **R8**: THE SYSTEM SHALL exponer el acceso a fotos de mascotas
  exclusivamente a través de URLs S3 prefirmadas (`PUT` para subir, `GET`
  para leer) — nunca una URL pública o sin firmar. El `PutPublicAccessBlock`
  ya configurado por `localstack-provisioning` #2 rechaza el acceso público;
  esta feature no lo modifica ni lo bypasea.

  **Criterio de verificación en local (LocalStack)**: e2e contra LocalStack
  real — `GetPublicAccessBlock` sobre `pet-tracker-media-local` devuelve los
  4 flags (`BlockPublicAcls`, `IgnorePublicAcls`, `BlockPublicPolicy`,
  `RestrictPublicBuckets`) en `true`, y no existe una bucket policy con un
  statement `Allow` sobre el principal anónimo (`"*"`).

  > **Limitación del entorno local (documentada 2026-08-07)**: el criterio
  > original — un `GET` directo sobre
  > `http://<endpoint>/pet-tracker-media-local/<key>` sin parámetros de firma
  > responde `403` — **no es verificable contra LocalStack**. LocalStack
  > Community no aplica `PublicAccessBlock`, ACLs ni bucket policies en el
  > plano de datos de S3 (el enforcement de IAM es funcionalidad Pro): solo
  > persiste esa configuración como metadata y sirve el objeto con `200`
  > igualmente. Verificado experimentalmente contra LocalStack 4.14 con los 4
  > flags en `true` y también con una bucket policy `Deny` explícita. El
  > requisito **no cambia** — cambia solo cómo se verifica en local: se
  > comprueba la configuración que produce ese `403` en AWS real, en vez del
  > `403` en sí. **Pendiente de verificar en un despliegue AWS real**: que el
  > `GET` sin firma responde efectivamente `403`. Mismo precedente que
  > `localstack-provisioning` #2 R13; ver `docs/architecture.md`
  > §Adaptación local.

### Flujo end-to-end

- **R9**: WHEN se ejecuta el flujo completo — `POST
  /v1/pets/:petId/photo-upload-url` (R1) para obtener `uploadUrl`, un `PUT`
  con bytes reales de una imagen contra `uploadUrl`, y luego `GET
  /v1/pets/:petId` (R6) — THE SYSTEM SHALL devolver un `photoUrl` cuyo `GET`
  directo (sin pasar por la API, directo contra LocalStack) responde `200`
  con exactamente los mismos bytes subidos en el `PUT`. Test e2e obligatorio
  contra LocalStack (acceptance_criteria #6).

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — Rol exigido para `POST /v1/pets/:petId/photo-upload-url` (R3)**: el
  brief/`acceptance_criteria` de #6 no especifica qué rol puede subir foto,
  solo que "mascota ajena → 404". La spec propone `@RequirePetRole('owner')`
  por consistencia con `PATCH /v1/pets/:petId` (misma categoría: mutación de
  un campo compartido de la ficha). Alternativa: permitir cualquier rol con
  membresía activa (como `GET /v1/pets/:petId`, sin `@RequirePetRole`).
  **Confirmar `'owner'` o abrirlo a cualquier rol activo.**
- **D2 — `photoUrl` solo se resuelve en el detalle (R6), no en el listado**:
  `GET /v1/pets` sigue devolviendo `photoUrl: null` en cada elemento aunque
  `photo_key` exista, replicando el alcance ya aceptado para `device` en
  `devices-claim` (#7 R12: tampoco se resuelve en list/create/update).
  Calcular una URL prefirmada es barato (firma local, sin round-trip a S3),
  así que extenderlo al listado es viable si se prefiere. **Confirmar
  alcance solo-detalle o extender a `GET /v1/pets`.**
- **D3 — El `PUT` prefirmado no fija `Content-Type` en la firma**: se
  descarta incluir `ContentType` en el `PutObjectCommand` que se firma (R1)
  porque obligaría al cliente a reproducir exactamente ese header en el
  `PUT` o la firma no valida (fragilidad e2e). La validación de
  `contentType` (R2) ocurre solo sobre el body del `POST`, no la aplica S3
  al momento de subir — cualquier `Content-Type` real en el `PUT` es
  aceptado por el bucket. **Confirmar esta relajación o exigir que la firma
  también fije y valide `Content-Type` en el `PUT`.**

## Fuera de alcance

- **Borrado del objeto S3 anterior al reemplazar la foto**: `photo_key` se
  sobrescribe (R1); el objeto viejo queda huérfano en el bucket. Sin
  limpieza automática en el MVP.
- **Endpoint de confirmación de subida** (tipo "commit" tras el `PUT`):
  `photo_key` se persiste al emitir la URL (R1), no tras verificar que el
  `PUT` ocurrió de verdad — no está en `acceptance_criteria` de #6.
- **Redimensionado, compresión o generación de thumbnails**: se sirve el
  archivo tal cual se subió.
- **`DELETE` de foto** (volver a `photo_key = null`): no pedido por el
  brief ni por `acceptance_criteria` de #6.
- **Eventos al bus EventBridge** por cambio de foto: ningún plan lo pide.
- **`GET /v1/pets` con `photoUrl` resuelto**: ver D2.
- **Variables de entorno nuevas**: ninguna — `AWS_ENDPOINT_URL` y el resto ya
  existen desde #2; el bucket `pet-tracker-media-local` ya está provisionado.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-05) ← gate obligatorio antes de implementar

D1: confirmado `'owner'` (@RequirePetRole('owner')).
D2: confirmado alcance solo-detalle (GET /v1/pets/:petId); listado sigue con photoUrl: null.
D3: confirmado no fijar Content-Type en la firma del PUT.
