# Plan 004: Mascotas — CRUD, fotos en S3 y permisos por mascota

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: deben existir el guard `auth.guard.ts` con `@CurrentUser()` (plan 003) y un `GET /v1/me` funcionando contra dev con token real. Si no, STOP.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: M · **Riesgo**: LOW
- **Depende de**: `plans/003-autenticacion-usuarios.md`
- **Categoría**: direction (MVP items 3–5 del brief §20)

## Por qué importa

La mascota es la entidad raíz de todos los pilares. Este plan implementa alta, listado "Mis mascotas" y perfil (brief §7–8), la subida de foto a S3 con URL prefirmada, y — lo más importante — el **guard de acceso por mascota** (`PetAccessGuard`): el brief exige que conocer un `petId` no otorgue acceso (§4). Todos los módulos posteriores (dispositivos, posiciones, salud, alimentación) reutilizan ese guard.

## Estado actual

- Tablas `pets`, `pet_users`, `audit_log` migradas (`docs/data-model.md`); bucket S3 `MediaBucket` desplegado con CORS (plan 002); env `MEDIA_BUCKET` ya llega a la Lambda API.
- Contrato en `docs/api/openapi.yaml`: `POST/GET /v1/pets`, `GET/PATCH/DELETE /v1/pets/{petId}`, `POST /v1/pets/{petId}/photo-upload-url`.
- Matriz de roles en `docs/roles-permissions.md`; en MVP solo se ejerce `owner` (el creador de la mascota).
- App: tabs con placeholders, cliente HTTP con token (plan 003), tokens de tema pastel en `apps/mobile/src/theme/tokens.ts`.

## Comandos

Los de `plans/002`: `npm run verify`, `npm -w apps/api test`, `npm -w infra run deploy:dev`, `npm -w apps/mobile run start`, y `npm -w apps/api run token:dev` (plan 003) para pruebas curl.

## Alcance

**Dentro**: `apps/api/src/modules/pets/**` (controller, service, dtos, `pet-access.guard.ts`, decorador `@RequirePetRole(...roles)`), `apps/api/src/modules/media/**` (servicio de URLs prefirmadas), catálogo estático de razas `packages/shared/src/breeds.ts` (perro y gato, ~30 razas comunes cada uno + "Mestizo/Otro"), pantallas `apps/mobile/app/(tabs)/index.tsx` (Mis mascotas), `apps/mobile/app/pets/new.tsx` (alta), `apps/mobile/app/pets/[petId]/index.tsx` (perfil), componentes en `apps/mobile/src/components/pets/`.

**Fuera**: invitaciones/miembros (post-MVP, brief §21), collar y posiciones (plan 005), datos de salud/alimentación en el perfil (se muestran como secciones vacías con CTA), borrado de fotos huérfanas en S3.

## Flujo git

`main`. Commits: `feat(api): pets module with per-pet access guard`, `feat(api): presigned photo uploads`, `feat(mobile): pet list, creation wizard and profile`.

## Pasos

### Paso 1: `PetAccessGuard` + decorador

`pet-access.guard.ts`: lee `petId` de `request.params`, busca `pet_users` por (petId, `req.user.id`); sin fila → **404** (`code: 'PET_NOT_FOUND'` — no revelar existencia); con fila → adjunta `req.petMembership = {role, permissions}`. `@RequirePetRole('owner')` (metadata + chequeo en el guard): rol insuficiente → 403. Aplicar a todas las rutas `/v1/pets/:petId/*` presentes y futuras.

**Verificar**: tests unitarios: miembro owner → pasa; no miembro → 404; miembro family con `@RequirePetRole('owner')` → 403. `npm -w apps/api test` verde.

### Paso 2: CRUD de mascotas

- `POST /v1/pets` — DTO del brief §7: name (req), species ('dog'|'cat', req), breed (del catálogo o libre), birthDate **o** approxAgeMonths (al menos uno), sex, weightKg, size, color, sterilized, microchip?. Transacción: insert `pets` + insert `pet_users` (creador como 'owner') + `audit_log` 'pet.create'.
- `GET /v1/pets` — join `pet_users` del usuario: id, name, species, breed, photoUrl (prefirmada GET 1 h si hay `photo_key`), role, lastCommunicationAt.
- `GET /v1/pets/:petId` — perfil §8: todos los campos + edad calculada (desde birth_date o approx_age_months) + `currentWeightKg` + secciones `device`, `nextVaccine`, `nextReminder`, `activitySummary` que devuelven `null` por ahora (los planes 005–008 las rellenan; dejar el shape en el DTO de respuesta ya definido según OpenAPI).
- `PATCH /v1/pets/:petId` (owner) y `DELETE /v1/pets/:petId` (owner; ON DELETE CASCADE limpia hijas; audit 'pet.delete').

**Verificar**: con dos usuarios de prueba (A y B, creados con `token:dev --signup`): A crea mascota → 201; A la lista y la lee → 200; **B con el mismo petId → 404**; B PATCH → 404. Pegar los curls en el reporte. Tests de servicio para edad calculada (birth_date vs approx).

### Paso 3: Foto con URL prefirmada

`media.service.ts` con `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`: `POST /v1/pets/:petId/photo-upload-url` `{contentType}` → valida `image/jpeg|png|webp` → key `pets/<petId>/photo-<ts>.<ext>` → URL PUT prefirmada 10 min + guarda `photo_key` al confirmar (simplificación MVP: se guarda el key al emitir la URL; si la subida falla, la próxima emisión lo reemplaza). Respuestas de lectura usan URL GET prefirmada 1 h.

**Verificar**: curl: pedir URL → `curl -X PUT -H "Content-Type: image/jpeg" --data-binary @foto.jpg "<uploadUrl>"` → 200; `GET /v1/pets/:petId` devuelve `photoUrl` descargable.

### Paso 4: Pantallas Expo

- **Mis mascotas** (`(tabs)/index.tsx`): lista de cards (foto circular, nombre, especie con icono, última comunicación "hace X min" o "Sin collar"), estado vacío ilustrado ("Aún no tienes mascotas" + botón Agregar), pull-to-refresh.
- **Alta** (`pets/new.tsx`): wizard de 2 pasos (1: nombre, especie con selector perro/gato grande e ilustrado, raza con buscador del catálogo, nacimiento/edad; 2: sexo, peso, talla, color, esterilizado, microchip, foto con `expo-image-picker` → pedir URL prefirmada → PUT). Validación en cliente + mensajes de error del API.
- **Perfil** (`pets/[petId]/index.tsx`): cabecera con foto/nombre/edad/peso, grid de accesos (Ubicación, Actividad, Salud, Alimentación, Recordatorios, Ajustes — los no implementados navegan a un placeholder "Próximamente"), diseño pastel amigable (brief §2, §18).

**Verificar**: `npm -w apps/mobile run typecheck` exit 0; flujo manual: alta con foto → aparece en lista → perfil correcto. Si no hay dispositivo, typecheck + reporte de pendiente manual.

### Paso 5: Cierre

OpenAPI al día si hubo ajustes de shapes. `STATUS.md`, fila 004 DONE, commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios: PetAccessGuard (3 casos del paso 1), pets service (crear con transacción owner, edad calculada ×2, update parcial), media service (rechaza `application/pdf`).
- E2E curl del paso 2 (dos usuarios, IDOR negado con 404) — evidencia obligatoria en el reporte: es el requisito de seguridad central del brief §4/§19.

## Criterios de done

- [ ] `npm run verify` exit 0 con los tests nuevos.
- [ ] Evidencia curl: usuario B recibe 404 sobre la mascota de A (IDOR bloqueado).
- [ ] Subida y lectura de foto vía URLs prefirmadas funcionando contra S3 dev.
- [ ] Lista/alta/perfil operativos en la app (o typecheck + pendiente manual reportado).
- [ ] OpenAPI, `STATUS.md`, fila 004 al día.

## Condiciones de STOP

- El PUT prefirmado devuelve 403 tras revisar una vez CORS del bucket y `Content-Type` firmado vs enviado → STOP con la respuesta XML de S3.
- Cualquier solución que implique hacer público el bucket o servir fotos sin URL prefirmada → STOP: contradice brief §19 (protección de documentos).
- El guard exige tocar rutas fuera de `pets` (p. ej. reestructurar auth) → STOP y explica.

## Notas de mantenimiento

- `PetAccessGuard` + `@RequirePetRole` son el mecanismo de autorización de TODOS los planes siguientes; el revisor debe verificar que ninguna ruta con `:petId` quede sin él (test de convención recomendable a futuro).
- El shape del perfil (§8) ya reserva `device/nextVaccine/nextReminder/activitySummary`: los planes 005/008 solo rellenan, no cambian el contrato.
- Deuda aceptada: keys de fotos reemplazadas quedan huérfanas en S3 (lifecycle rule en plan 010).
