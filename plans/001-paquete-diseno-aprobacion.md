# Plan 001: Producir el paquete de diseño y detenerse para aprobación

> **Instrucciones para el ejecutor**: sigue este plan paso a paso. Ejecuta cada comando de verificación y confirma el resultado esperado antes del siguiente paso. Si ocurre algo de la sección "Condiciones de STOP", detente y reporta — no improvises. Al terminar, actualiza la fila de este plan en `plans/README.md`.
>
> **Chequeo de deriva (ejecutar primero)**: este plan se escribió contra un directorio vacío (sin git, 2026-07-28). Si `C:\Users\alex\Documents\sites\pet-tracker` contiene algo más que la carpeta `plans/`, detente y reporta qué hay.

## Estado

- **Prioridad**: P1
- **Esfuerzo**: M
- **Riesgo**: LOW (solo produce documentos; no despliega nada, no instala dependencias del producto)
- **Depende de**: ninguno
- **Categoría**: direction
- **Planeado en**: sin repo (directorio vacío), 2026-07-28

## Por qué importa

El brief maestro (§22) es explícito: "No comenzar a programar todo el producto inmediatamente. Primero presentar para aprobación: supuestos, alcance del MVP, riesgos técnicos, dependencias del hardware, modelo de datos, arquitectura, endpoints, backlog de implementación." Este plan produce exactamente ese paquete dentro del repo, versionado en git, y termina en un gate: **nada del plan 002 en adelante se ejecuta sin aprobación del usuario**. Además convierte el repo en autosuficiente: copia el brief a `docs/` para que ningún plan posterior dependa de archivos en `Downloads`.

## Estado actual

- Directorio del proyecto: `C:\Users\alex\Documents\sites\pet-tracker` — vacío salvo `plans/`.
- No hay git, no hay package.json, no hay código.
- El brief vive en `C:\Users\alex\Downloads\Pet Tracker Brief (1).md` (markdown, en español). Si no existe en esa ruta, ver STOP.
- Las decisiones de arquitectura (servicios AWS elegidos y por qué) están en `plans/README.md`, sección "Decisiones de arquitectura". Este plan las traslada a `docs/architecture.md` con el detalle técnico.

## Comandos necesarios

| Propósito | Comando | Esperado |
|---|---|---|
| Inicializar git | `git init -b main` | repo creado en `main` |
| Validar OpenAPI | `npx -y @apidevtools/swagger-cli validate docs/api/openapi.yaml` | `docs/api/openapi.yaml is valid` |
| Commit | `git add -A && git commit -m "..."` | exit 0 |

(No se instala nada más; `npx -y` descarga el validador de forma efímera.)

## Alcance

**Dentro** (únicos archivos a crear/modificar):
- `.gitignore`, `STATUS.md`
- `docs/brief.md` (copia del brief), `docs/architecture.md`, `docs/data-model.md`, `docs/api/openapi.yaml`, `docs/roles-permissions.md`, `docs/wialon-module.md`, `docs/assumptions-risks.md`, `docs/backlog.md`
- `plans/README.md` (solo la fila de estado)

**Fuera** (NO tocar): cualquier código de aplicación, `package.json`, infraestructura, instalación de dependencias. Ese trabajo pertenece a los planes 002+ y está bloqueado por la aprobación.

## Flujo git

- Trabajar directamente en `main` (repo nuevo, sin remoto). No crear remoto ni hacer push.
- Conventional commits en inglés. Sugeridos: `chore: init repository with plans`, `docs: add design package for approval`.

## Pasos

### Paso 1: Inicializar el repo

En `C:\Users\alex\Documents\sites\pet-tracker`: `git init -b main`. Crear `.gitignore` con al menos: `node_modules/`, `.env`, `.env.*`, `dist/`, `cdk.out/`, `.expo/`, `coverage/`, `*.log`. Crear `STATUS.md` con: fecha, "Fase actual: diseño (plan 001)", y una línea por plan con su estado (copiar la tabla de `plans/README.md`). Commit: `chore: init repository with plans`.

**Verificar**: `git log --oneline` → 1 commit.

### Paso 2: Copiar el brief al repo

Copiar `C:\Users\alex\Downloads\Pet Tracker Brief (1).md` → `docs/brief.md` sin modificar el contenido.

**Verificar**: el archivo existe y contiene la sección "## 20\. Alcance del MVP" con 20 puntos.

### Paso 3: `docs/architecture.md`

Redactar la arquitectura funcional y técnica. Contenido obligatorio:

1. **Arquitectura funcional**: los tres pilares del brief (localización/actividad, salud, alimentación) sobre un núcleo común (usuarios, mascotas, permisos, dispositivos, notificaciones), citando `docs/brief.md` §5.
2. **Arquitectura técnica**: reproducir la tabla de servicios y el diagrama mermaid de `plans/README.md` (sección "Decisiones de arquitectura") y ampliar con:
   - Runtime: Node.js 20, TypeScript estricto en todo (API, workers, infra, app).
   - API síncrona: Expo app → API Gateway HTTP API (JWT authorizer de Cognito) → una Lambda con NestJS (`@codegenie/serverless-express`). Monolito modular: módulos NestJS `auth`, `users`, `pets`, `devices`, `positions`, `geofences`, `alerts`, `health`, `nutrition`, `notifications`.
   - Pipeline asíncrono de telemetría: EventBridge Scheduler (1 min) → Lambda `wialon-poller` → SQS `positions-raw` (+ DLQ) → Lambda `position-processor` → DynamoDB `positions` + Postgres (estado del dispositivo, caché de última posición) + evento `position.updated` en el bus EventBridge `pet-tracker`.
   - Motor de eventos: reglas de EventBridge → Lambda `geofence-engine` (emite `geofence.entered/exited`, `battery.low`) → SQS `notifications` → Lambda `notifier` → Expo Push.
   - Recordatorios: EventBridge Scheduler one-shot por recordatorio → SQS `notifications`.
   - Datos: Aurora Serverless v2 PostgreSQL 16 (Data API, min 0 ACU dev / 0.5 prod, max 2 ACU dev) para dominio; DynamoDB on-demand para `positions` (TTL 90 días); S3 para fotos y documentos con URLs prefirmadas.
   - Secretos en SSM Parameter Store (SecureString): `/pet-tracker/dev/wialon-token`, `/pet-tracker/dev/openai-api-key`, `/pet-tracker/dev/google-maps-key`. Nunca en la app móvil (brief §19).
   - Entornos: `dev` ahora; `prod` es el mismo stack CDK parametrizado por stage (no se despliega en el MVP).
3. **Escalabilidad**: por qué cada pieza escala sola (Lambda concurrencia, SQS buffer, DynamoDB on-demand, Aurora ACU) y los dos cuellos conocidos: cold start de NestJS (~2–4 s, mitigable con provisioned concurrency en prod) y rate limits de la API de Wialon (mitigado por polling batched, ver `docs/wialon-module.md`).

**Verificar**: el archivo contiene las cadenas "API Gateway", "EventBridge", "Aurora Serverless v2", "positions-raw" y un bloque ` ```mermaid `.

### Paso 4: `docs/data-model.md` — modelo entidad-relación y catálogo de tablas

Documento con: (a) diagrama mermaid `erDiagram`, (b) catálogo de tablas con columnas, tipos y restricciones, (c) DDL PostgreSQL de referencia en un bloque sql. Modelo (snake_case en BD; el brief §4, §7, §15–17 es la fuente):

**PostgreSQL (dominio):**
- `users` — id uuid PK default gen_random_uuid(), cognito_sub text UNIQUE NOT NULL, email citext UNIQUE NOT NULL, phone text, first_name text NOT NULL, last_name text NOT NULL, country text, timezone text NOT NULL DEFAULT 'UTC', created_at/updated_at timestamptz.
- `pets` — id uuid PK, name text NOT NULL, species text NOT NULL CHECK (species IN ('dog','cat')), breed text, birth_date date, approx_age_months int, sex text CHECK (sex IN ('male','female','unknown')), current_weight_kg numeric(5,2), size text CHECK (size IN ('small','medium','large')), color text, sterilized boolean, microchip text, photo_key text, lost_mode boolean NOT NULL DEFAULT false, last_position jsonb, last_communication_at timestamptz, created_at/updated_at. (`last_position`/`last_communication_at` = caché desnormalizada para el perfil; la serie completa vive en DynamoDB.)
- `pet_users` — pet_id FK→pets ON DELETE CASCADE, user_id FK→users ON DELETE CASCADE, role text NOT NULL CHECK (role IN ('owner','family','walker','vet')), permissions jsonb NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'active', created_at. PK (pet_id, user_id). **Toda autorización pasa por esta tabla** (brief §4: permisos por mascota; conocer un id no da acceso).
- `devices` — id uuid PK, esn text UNIQUE, imei text UNIQUE, serial_number text, activation_code text, wialon_unit_id bigint UNIQUE, model text, status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','assigned','inactive')), battery_pct int, connectivity text, last_message_at timestamptz, ingest_watermark timestamptz, is_simulated boolean NOT NULL DEFAULT false.
- `pet_devices` — id uuid PK, pet_id FK, device_id FK, assigned_at timestamptz NOT NULL, released_at timestamptz NULL. Índice único parcial: `CREATE UNIQUE INDEX ON pet_devices(device_id) WHERE released_at IS NULL` (un collar activo en una sola mascota — brief §7).
- `geofences` — id uuid PK, pet_id FK ON DELETE CASCADE, name text NOT NULL, type text NOT NULL CHECK (type IN ('safe_circle','safe_polygon','restricted','home','park','vet','daycare')), geometry jsonb NOT NULL (círculo: `{"lat":..,"lng":..,"radius_m":..}`; polígono: `{"points":[{lat,lng},...]}`), active boolean NOT NULL DEFAULT true, created_at.
- `alert_events` — id uuid PK, pet_id FK, geofence_id FK NULL, type text NOT NULL (p. ej. 'geofence_exit','geofence_enter','battery_low','device_offline','position_stale','reminder'), status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acked','closed')), payload jsonb, opened_at, acked_at NULL, closed_at NULL. Índice único parcial anti-spam: `(pet_id, type, coalesce(geofence_id, '00000000-0000-0000-0000-000000000000')) WHERE status = 'open'` — implementa el "evento abierto, no volver a alertar" del brief §12.
- `vaccine_catalog` — id uuid PK, species text NOT NULL, name text NOT NULL, scheme jsonb (dosis y refuerzos en meses), UNIQUE(species, name).
- `pet_vaccines` — id uuid PK, pet_id FK, catalog_id FK NULL, name text NOT NULL, applied_at date NOT NULL, next_dose_at date NULL, vet_name text, clinic text, notes text, document_key text, created_by FK→users.
- `weights` — id uuid PK, pet_id FK, weight_kg numeric(5,2) NOT NULL, body_condition int CHECK (body_condition BETWEEN 1 AND 9), measured_at date NOT NULL, created_by FK.
- `reminders` — id uuid PK, pet_id FK, type text NOT NULL ('vaccine','deworming','medication','appointment','weight','food','custom'), title text NOT NULL, due_at timestamptz NOT NULL, advance_minutes int NOT NULL DEFAULT 60, channel text NOT NULL DEFAULT 'push', status text NOT NULL DEFAULT 'scheduled' ('scheduled','sent','cancelled'), schedule_name text (nombre del schedule en EventBridge Scheduler), created_by FK.
- `nutrition_profiles` — pet_id PK FK, activity_level text ('low','medium','high'), body_condition int, target_weight_kg numeric(5,2), food_type text, kcal_per_100g numeric(6,1), allergies jsonb DEFAULT '[]', diseases jsonb DEFAULT '[]', updated_at.
- `nutrition_plans` — id uuid PK, pet_id FK, rer_kcal int, mer_kcal int, daily_grams int, meals_per_day int, meal_times jsonb, objective text, warnings jsonb, ai_explanation text NULL, inputs_hash text, generated_at.
- `push_tokens` — id uuid PK, user_id FK ON DELETE CASCADE, expo_token text UNIQUE NOT NULL, platform text, created_at, last_seen_at.
- `audit_log` — id bigserial PK, user_id uuid NULL, action text, entity text, entity_id text, meta jsonb, at timestamptz DEFAULT now(). (Brief §19: historial de accesos y cambios.)

**DynamoDB:**
- Tabla `positions`: PK `pk` = `PET#<petId>`, SK `sk` = timestamp epoch ms (number, momento del dispositivo). Atributos: lat, lng, speed_kmh, course, altitude, sats, accuracy_m, battery_pct, device_ts, received_ts, processed_ts, flags (lista: 'suspect_jump','low_accuracy'…). TTL `expires_at` = device_ts + 90 días. Facturación on-demand. Justificación: acceso siempre por mascota + rango temporal; volumen incompatible con Aurora barata.
- Tabla `ws_connections` (fase 010): PK `user_id`, SK `connection_id`.

**Verificar**: `docs/data-model.md` contiene un bloque ` ```mermaid ` con `erDiagram`, y las 16 tablas listadas arriba aparecen en el catálogo.

### Paso 5: `docs/api/openapi.yaml` — contrato de la API

OpenAPI 3.0.3, `title: Pet Tracker API`, server `https://{apiId}.execute-api.us-east-1.amazonaws.com`, security scheme `bearerAuth` (JWT de Cognito). Prefijo `/v1`. El registro/login/recuperación ocurre contra Cognito con el SDK (no son endpoints propios); documentarlo en la `description` del spec. Endpoints (todos con 401 sin token y 403/404 sin membresía en `pet_users`):

- `GET /v1/health` (sin auth) — liveness.
- `GET /v1/me` · `PATCH /v1/me` — perfil (nombre, país, zona horaria).
- `POST /v1/me/push-tokens` `{expoToken, platform}` · `DELETE /v1/me/push-tokens/{token}`.
- `POST /v1/pets` · `GET /v1/pets` (lista con rol propio, foto, especie, última comunicación) · `GET /v1/pets/{petId}` (perfil completo del brief §8: datos + batería + última posición + próxima vacuna + próximo recordatorio + resumen actividad) · `PATCH /v1/pets/{petId}` · `DELETE /v1/pets/{petId}` (solo owner).
- `POST /v1/pets/{petId}/photo-upload-url` `{contentType}` → `{uploadUrl, key}` (S3 prefirmada, PUT, máx 5 MB, content-type image/*).
- `POST /v1/devices/claim` `{petId, esn|imei|serialNumber|activationCode}` → asocia collar validando que exista, esté `available` y no esté asignado (brief §7). · `GET /v1/pets/{petId}/device` → `{model, batteryPct, connectivity, lastMessageAt}` · `DELETE /v1/pets/{petId}/device` (desasociar).
- `GET /v1/pets/{petId}/positions/last` · `GET /v1/pets/{petId}/positions?from&to` (máx 24 h por página, cursor) · `GET /v1/pets/{petId}/trips?date` (paseos agrupados) · `GET /v1/pets/{petId}/activity/daily?from&to` (KPIs: distancia, tiempo activo/reposo, paseos, comparativa 7 días).
- `POST /v1/pets/{petId}/geofences` (MVP: `type=safe_circle`) · `GET .../geofences` · `PATCH .../geofences/{id}` · `DELETE .../geofences/{id}`.
- `GET /v1/alerts?status=` (centro de alertas de todas mis mascotas) · `POST /v1/alerts/{id}/ack`.
- `GET /v1/vaccine-catalog?species=` · `POST /v1/pets/{petId}/vaccines` · `GET .../vaccines` · `PATCH .../vaccines/{id}` · `DELETE .../vaccines/{id}`.
- `POST /v1/pets/{petId}/weights` · `GET .../weights`.
- `POST /v1/pets/{petId}/reminders` · `GET .../reminders` · `PATCH /v1/reminders/{id}` (incluye cancelar).
- `PUT /v1/pets/{petId}/nutrition-profile` · `GET .../nutrition-profile` · `POST /v1/pets/{petId}/nutrition-plan/generate` · `GET .../nutrition-plan`.

Esquema de error uniforme: `{statusCode, code, message}`.

**Verificar**: `npx -y @apidevtools/swagger-cli validate docs/api/openapi.yaml` → "is valid".

### Paso 6: `docs/roles-permissions.md`

Matriz rol × recurso (filas: pets, device, positions, geofences, alerts, vaccines, weights, reminders, nutrition, members; columnas: owner, family, walker, vet). Reglas del brief §4: owner todo; family solo lectura de lo permitido en `pet_users.permissions`; walker lectura de posición/recorrido con ventana temporal; vet lectura/escritura solo de salud con autorización. MVP: solo se implementa `owner` (los demás roles quedan en el modelo y el guard, sin UI). Documentar el mecanismo: guard NestJS `PetAccessGuard` que resuelve (userId del JWT, petId de la ruta) contra `pet_users` y devuelve 404 (no 403) cuando no hay fila, para no revelar existencia de la mascota.

**Verificar**: el archivo existe y contiene "PetAccessGuard" y la matriz.

### Paso 7: `docs/wialon-module.md`

Diseño del módulo de integración (brief §10–11): interfaz TypeScript `WialonClient` (`login()`, `listUnits()`, `getMessages(unitId, fromTs, toTs)`), implementación real contra `https://hst-api.wialon.com/wialon/ajax.html` (login por token `svc=token/login`, sesión `sid`, mensajes `svc=messages/load_interval`) e implementación `FakeWialonClient` (simulador: genera paseos realistas alrededor de un punto "casa" con ruido GPS, saltos ocasionales y batería descendente — activado con `SIM_MODE=true`). Estrategia de sincronización: watermark `devices.ingest_watermark` por dispositivo, poll cada minuto, lotes a SQS, idempotencia por clave `(pet_id, device_ts)` (DynamoDB PutItem sobrescribe el mismo SK — reintentos seguros). Pipeline de validación (brief §11) con umbrales concretos: descartar lat/lng fuera de rango o (0,0); descartar sin device_ts; marcar `low_accuracy` si accuracy_m > 100 o sats < 4; marcar `suspect_jump` si la velocidad implícita entre puntos > 60 km/h sostenida en un solo salto (mascota en coche existe: se marca, no se descarta); descartar duplicados exactos; ordenar por device_ts. Distinguir siempre device_ts / received_ts / processed_ts y zona horaria del usuario solo en presentación.

**Verificar**: el archivo contiene "FakeWialonClient", "ingest_watermark" y "load_interval".

### Paso 8: `docs/assumptions-risks.md` y `docs/backlog.md`

`assumptions-risks.md`: copiar los 5 supuestos globales de `plans/README.md` y añadir riesgos con mitigación: (1) hardware/SIM del collar no disponible → simulador (plan 005); (2) límites y latencia de la API de Wialon desconocidos hasta tener token → poller con backoff y watermark; (3) cold start NestJS → aceptado en MVP, provisioned concurrency en prod; (4) coste Aurora si se olvida el scale-to-zero → alarma Budgets (plan 002); (5) Expo Go no soporta push en Android SDK 53+ → probar push en development build (EAS), documentado en plan 007; (6) los planes de alimentación e IA no sustituyen al veterinario → disclaimers obligatorios en UI (brief §15–16).

`backlog.md`: tabla que mapea los 20 puntos del MVP (brief §20) → plan que lo implementa (1–2→003, 3–5→004, 6–8→005, 9→005/006, 10–11→007, 12–13→006, 14–16→008, 17→008, 18–19→009, 20→007) y lista post-MVP (brief §21) sin plan asignado.

**Verificar**: ambos archivos existen; `backlog.md` referencia los planes 003–009.

### Paso 9: Commit y gate de aprobación

Actualizar `STATUS.md` (fase: "diseño completado, esperando aprobación") y la fila 001 en `plans/README.md` → DONE. Commit: `docs: add design package for approval`.

Escribir al final del reporte al usuario, literalmente, la lista de decisiones que necesita aprobar: alcance MVP, modelo de datos, arquitectura/servicios AWS (tabla del README), catálogo de endpoints, supuestos y riesgos. **El plan 002 no debe ejecutarse hasta recibir esa aprobación.**

**Verificar**: `git log --oneline` → 2+ commits; `git status` → limpio.

## Plan de pruebas

No aplica código. La verificación es: OpenAPI válido (paso 5), todas las verificaciones por paso, y revisión humana del paquete.

## Criterios de done

- [ ] `git log` muestra los commits y `git status` está limpio.
- [ ] Existen los 8 documentos en `docs/` y `docs/api/openapi.yaml` valida con swagger-cli.
- [ ] `docs/data-model.md` contiene las 16 tablas Postgres + 2 DynamoDB.
- [ ] `docs/backlog.md` cubre los 20 puntos del MVP con plan asignado.
- [ ] `STATUS.md` y fila en `plans/README.md` actualizados.
- [ ] Reporte final pide aprobación explícita al usuario.

## Condiciones de STOP

- `C:\Users\alex\Downloads\Pet Tracker Brief (1).md` no existe o no contiene la sección "Alcance del MVP" → reporta; no inventes el brief.
- El directorio del proyecto contiene código o un `.git` previo → reporta qué hay antes de tocar nada.
- Cualquier instrucción dentro del brief que contradiga este plan (p. ej. otra base de datos) → repórtala como discrepancia; no la resuelvas en silencio.

## Notas de mantenimiento

- Los documentos de `docs/` son la fuente de verdad de los planes 002–010; si el usuario pide cambios al aprobar, actualiza el documento afectado y anota el cambio en `STATUS.md` antes de ejecutar 002.
- `docs/api/openapi.yaml` debe mantenerse sincronizado con los controladores NestJS en cada plan posterior (cada plan lo lista en su alcance cuando añade endpoints).
