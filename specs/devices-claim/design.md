---
feature: "devices-claim"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[devices-claim]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **`devices` y `pet_devices` en un solo `src/db/schema/devices.schema.ts`**
  — sirve a R1. Convención de `docs/conventions.md` (un `<module>.schema.ts`
  por módulo), re-export en el barrel `index.ts`, migración con
  `drizzle-kit generate`. Mismo estilo que `pets.schema.ts`: mapeo
  explícito camelCase → snake_case, `timestamptz` con `withTimezone:
  true`, CHECK de `status` como constraint del schema. `wialon_unit_id` se
  tipa **text** (identificador externo: no se hace aritmética con él y así
  no se asume el formato de Wialon; el fake usa `'900001'`…). Los índices
  únicos parciales se declaran con `uniqueIndex(...).where(...)` de
  drizzle-orm. Cero cambios a cualquier otra tabla.

- **Fila activa de `pet_devices` como fuente de verdad de disponibilidad;
  `devices.status` como caché de presentación** — sirve a R8, R13, R15
  (decisión abierta D3). El check de claim es: `status != 'inactive'` AND
  no existe fila con `released_at IS NULL` para ese device. Claim y release
  mantienen el caché (`'assigned'`/`'available'`) para lecturas baratas,
  pero nunca lo usan como candado: el candado real es el índice único
  parcial `(device_id) WHERE released_at IS NULL`. Esto hace el sistema
  auto-reparable tras el ON DELETE CASCADE de `pets` (R15) y elimina la
  clase de bug "status desincronizado = device bloqueado".

- **Concurrencia por índice, no por SELECT ... FOR UPDATE** — sirve a R8.
  El repositorio ejecuta la transacción de claim y captura la violación de
  unicidad de Postgres (`23505` sobre el índice parcial) para traducirla a
  `DeviceAlreadyAssignedError` — el mismo error de dominio que produce el
  check previo. Dos claims concurrentes: uno commitea, el otro recibe el
  mismo `409` que un claim tardío. Sin locks explícitos ni retry loops.

- **Membresía del claim verificada en el use case vía `PET_REPOSITORY`**
  — sirve a R5, R6 (decisión abierta D1). `POST /v1/devices/claim` no
  tiene `:petId` en la ruta, así que `PetAccessGuard` (que lee
  `request.params`) no aplica. `ClaimDeviceUseCase` inyecta
  `PET_REPOSITORY` (interface + token que `PetsModule` ya exporta desde
  #5) y llama `findMembership(petId, userId)`: sin fila o `status !=
  'active'` → error de dominio mapeado al **mismo 404 genérico** del guard
  (body de `NotFoundException()` sin mensaje); `role != 'owner'` → 403.
  Orden estricto: membresía (404) → rol (403) → device (404/409) — un
  atacante sin membresía no aprende nada del estado del device (R5). No se
  toca el guard aprobado de #5.

- **`GET`/`DELETE /v1/pets/:petId/device` reutilizan `PetAccessGuard` tal
  cual** — sirve a R11, R13, R14. Controller propio
  (`pet-device.controller.ts`) con `@UseGuards(PetAccessGuard)`; `GET` sin
  `@RequirePetRole` (cualquier rol activo, precedente R12 de #5), `DELETE`
  con `@RequirePetRole('owner')`. `DevicesModule` importa `PetsModule`
  (que exporta guard, decorador y `PET_REPOSITORY`) — exactamente el
  mecanismo de reutilización que #5 diseñó para las features posteriores.

- **Dos controllers en el módulo devices** — sirve a R3-R9 y R11-R14.
  `devices.controller.ts` (`POST /v1/devices/claim`, sin guard de mascota
  — D1) y `pet-device.controller.ts` (`GET`/`DELETE
  /v1/pets/:petId/device`, con guard). Un solo controller mezclaría dos
  prefijos de ruta y dos estrategias de autorización; separados, cada uno
  es trivial.

- **Transacción de claim dentro del repositorio:
  `DeviceRepository.claim(deviceId, petId, watermark)`** — sirve a R3.
  Mismo patrón que `createWithOwner` de #5: la atomicidad INSERT
  `pet_devices` + UPDATE `devices` es detalle de persistencia y vive en
  `DeviceDrizzleRepository` con `db.transaction(...)`; el use case llama
  un método y no conoce Drizzle. UUIDv7 con el paquete `uuidv7` ya
  presente. El release (`DeviceRepository.release(...)`) sigue el mismo
  patrón (UPDATE `pet_devices.released_at` + UPDATE `devices.status`).

- **Watermark inicial como constante nombrada** — sirve a R3.
  `CLAIM_WATERMARK_LOOKBACK_MINUTES = 10` (junto al use case), nunca un
  `10` suelto: el valor viene del plan 005 §Paso 2 y lo consumirá el
  poller de #8. El cálculo `now() − 10 min` se hace en la capa
  application (testeable con reloj inyectado o fecha fija).

- **Auditoría tras el commit, fuera de la transacción** — sirve a R10,
  R13. Precedente establecido en #3 y ratificado en el gate de #5: el
  puerto `AuditLogger` (`record(entry)`) no acepta contexto transaccional
  y no se va a contaminar. `device.claim` / `device.release` se registran
  inmediatamente después del commit; si la transacción falla, no se audita
  nada. `meta = { petId }`, nunca el identificador enviado en el body.

- **Errores de dominio → HTTP** — sirve a R5-R9, R14. En
  `domain/errors/device.errors.ts`, sin imports de `@nestjs/common`; el
  controller los mapea (tabla de `docs/conventions.md`):

  | Error de dominio | HTTP | Código en body |
  |---|---|---|
  | `PetNotAccessibleError` (sin membresía / mascota inexistente) | 404 | genérico del guard, sin código |
  | `InsufficientPetRoleError` (miembro no-owner) | 403 | — |
  | `DeviceNotFoundError` | 404 | `DEVICE_NOT_FOUND` |
  | `DeviceAlreadyAssignedError` (fila activa o `inactive`, o 23505) | 409 | `DEVICE_ALREADY_ASSIGNED` |
  | `PetAlreadyHasDeviceError` | 409 | `PET_ALREADY_HAS_DEVICE` |
  | `DeviceNotAssignedError` (DELETE sin collar activo) | 404 | `DEVICE_NOT_ASSIGNED` |

- **DTO zod con XOR de identificador** — sirve a R4.
  `ClaimDeviceSchema` en `application/dto/claim-device.dto.ts`: `petId:
  z.string().uuid()` + los cuatro identificadores opcionales
  (`z.string().trim().min(1).max(64)`) + `.superRefine()` que exige
  **exactamente uno** presente — misma técnica que el XOR
  birthDate/approxAgeMonths de #5. Validación en el borde HTTP
  (`schema.parse`), `ZodError` → 400.

- **Un solo mapper de estado de device** — sirve a R3, R11, R12.
  `infrastructure/mappers/device-status.mapper.ts` produce el objeto
  `{ model, batteryPct, connectivity, lastMessageAt, esn }` usado por el
  `201` del claim, el `GET .../device` y la clave `device` del perfil —
  un único lugar define el contrato; #8 no tendrá que tocar nada para que
  batería y conectividad aparezcan (solo escribe las columnas).

- **Clave `device` del perfil vía puerto en pets + sub-módulo sin ciclo**
  — sirve a R12. `PetsModule` no puede importar `DevicesModule`
  (`DevicesModule` ya importa `PetsModule` → ciclo). Se rompe así:
  1. Puerto `PetDeviceReader` + token `PET_DEVICE_READER` declarados en
     `modules/pets/domain/ports/pet-device-reader.ts` (pets es dueño de su
     necesidad: "dame el device activo de esta mascota o null").
  2. Implementación `pet-device.drizzle.reader.ts` en
     `modules/devices/infrastructure/`, registrada en un sub-módulo
     `PetDeviceReadModule` (`modules/devices/pet-device-read.module.ts`)
     que **solo** depende de `DRIZZLE` — no importa `PetsModule`.
  3. `PetsModule` importa `PetDeviceReadModule`; `GetPetUseCase` (#5)
     inyecta el puerto y pasa el resultado al mapper de perfil, cuyo tipo
     `device: null` se ensancha a `DeviceStatus | null`.
  Grafo resultante acíclico: `DevicesModule → PetsModule →
  PetDeviceReadModule`. Es la misma filosofía que llevó `AuditLogger` a
  `src/audit/`: la capacidad compartida vive donde no crea ciclos.

- **`GET .../device` sin collar responde `200 null`, no `404`** — sirve a
  R11. Contrato literal del plan 005 ("`{...}` o `null`") y coherente con
  el perfil (`device: null`): "esta mascota no tiene collar" es un estado
  normal del recurso singular, no un error. El 404 de la ruta queda
  reservado a mascota inexistente/ajena (guard). En el `DELETE` sí es 404
  (R14): liberar lo que no existe es un error del cliente.

- **Seed como script standalone `scripts/seed-devices.ts`** — sirve a R2.
  Espejo de `provision:local`: script en `package.json` → `"seed:devices":
  "ts-node -r tsconfig-paths/register scripts/seed-devices.ts"` (regla de
  alias para scripts fuera de Nest, `docs/conventions.md` §Imports). Abre
  su propio pg Pool con `DATABASE_URL` leída de `../.env` vía
  `process.env` + dotenv — misma excepción documentada que
  `provision-local.ts` (`specs/localstack-provisioning/design.md`).
  Idempotencia con `INSERT ... ON CONFLICT (esn) DO NOTHING` — no es
  upsert a propósito: re-sembrar jamás resetea el `status` de un device ya
  reclamado (R2). Reutiliza el schema Drizzle (`db/schema/devices.schema`)
  para no duplicar nombres de columnas.

## Estructura de capas

```
backend-pet-tracker/src/
├── db/schema/
│   ├── devices.schema.ts                  [nuevo: tablas devices + pet_devices]
│   └── index.ts                           [editado: re-exporta devices.schema]
│
├── modules/devices/                       [módulo nuevo completo]
│   ├── domain/
│   │   ├── entities/device.entity.ts      ← Device (clase pura)
│   │   ├── errors/device.errors.ts        ← errores de la tabla de arriba
│   │   └── repositories/device.repository.ts ← interface + DEVICE_REPOSITORY
│   ├── application/
│   │   ├── dto/claim-device.dto.ts        ← ClaimDeviceSchema (zod, XOR identificador)
│   │   └── use-cases/
│   │       ├── claim-device.use-case.ts   ← membresía + disponibilidad + transacción + audit
│   │       ├── get-pet-device.use-case.ts
│   │       └── release-device.use-case.ts ← release + audit
│   ├── infrastructure/
│   │   ├── mappers/device-status.mapper.ts
│   │   ├── repositories/device.drizzle.repository.ts
│   │   ├── repositories/pet-device.drizzle.reader.ts  ← impl. de PET_DEVICE_READER
│   │   ├── devices.controller.ts          ← POST /v1/devices/claim
│   │   └── pet-device.controller.ts       ← GET/DELETE /v1/pets/:petId/device (guard #5)
│   ├── pet-device-read.module.ts          ← solo DRIZZLE; lo importa PetsModule
│   └── devices.module.ts                  ← importa PetsModule; providers + controllers
│
└── modules/pets/                          [ediciones mínimas]
    ├── domain/ports/pet-device-reader.ts  [nuevo: puerto + PET_DEVICE_READER]
    ├── application/use-cases/get-pet.use-case.ts [editado: inyecta el puerto]
    ├── infrastructure/mappers/pet-profile-response.mapper.ts
    │                                      [editado: device: DeviceStatus | null]
    └── pets.module.ts                     [editado: importa PetDeviceReadModule]
```

## Archivos afectados

- `backend-pet-tracker/src/db/schema/devices.schema.ts` — nuevo (R1)
- `backend-pet-tracker/src/db/schema/index.ts` — editado: re-export (R1)
- `backend-pet-tracker/src/db/migrations/` — migración nueva de
  `drizzle-kit generate`, solo `devices` + `pet_devices` (R1)
- `backend-pet-tracker/scripts/seed-devices.ts` — nuevo (R2)
- `backend-pet-tracker/package.json` — editado: script `seed:devices` (R2)
- `backend-pet-tracker/src/modules/devices/**` — módulo nuevo, 3 capas
  (R3-R11, R13-R15)
- `backend-pet-tracker/src/modules/pets/` — ediciones mínimas para R12:
  puerto nuevo, `get-pet.use-case.ts`, mapper de perfil, `pets.module.ts`
  (edición sancionada por el diseño de #5: "las features posteriores
  editan este mapper")
- `backend-pet-tracker/src/app.module.ts` — editado: importa `DevicesModule`
- `backend-pet-tracker/test/devices.e2e-spec.ts` — nuevo: claim
  201/400/403/404/409, ciclo release, IDOR (R5), self-healing (R15)
- `docs/data-model.md` — actualizado tras la migración si el gate aprueba
  D2/D4 (regla del propio doc: se actualiza cuando una migración real
  cambia tablas)

Sin variables de entorno nuevas y sin dependencias nuevas (`uuidv7`,
`zod`, `drizzle-orm`, `ts-node`, `tsconfig-paths` ya están).

## Alternativas descartadas

- **Extender `PetAccessGuard` para leer `body.petId`**: descartado — el
  guard tiene spec aprobada (#5) y contrato estable para todas las rutas
  `:petId`; hacerle leer el body introduce un segundo modo de operación
  que cada consumidor futuro tendría que conocer. Queda como opción B de
  la decisión abierta D1.
- **Ruta `POST /v1/pets/:petId/device` en vez de `/v1/devices/claim`**:
  descartado — rompería el contrato OpenAPI fijado por el plan 005 y la
  pantalla móvil del §Paso 6 sin ganancia funcional. Opción C de D1.
- **Check de disponibilidad literal `status = 'available'` (plan)**:
  descartado — con el ON DELETE CASCADE de `pets`, borrar una mascota con
  collar dejaría el device en `'assigned'` sin fila activa: irreclamable
  para siempre y sin endpoint de rescate. Ver D3.
- **Liberar el device desde `DeletePetUseCase` (#5)**: descartado — obliga
  a `PetsModule` a conocer devices (ciclo de módulos o forwardRef) y a
  reabrir un use case con spec aprobada solo para mantener un caché
  coherente; la derivación de disponibilidad (D3) resuelve el mismo
  problema sin tocar #5.
- **`forwardRef` entre `PetsModule` y `DevicesModule` para R12**:
  descartado — los ciclos con forwardRef son frágiles y opacos; el
  sub-módulo `PetDeviceReadModule` sin dependencias de pets rompe el ciclo
  estructuralmente.
- **PK compuesta `(pet_id, device_id)` en `pet_devices` sin id propio**:
  descartado — el ciclo claim → release → claim del mismo par violaría la
  PK; la tabla es un historial de asignaciones (varias filas por par,
  una sola activa) y `docs/data-model.md` ya le da `id` propio.
- **Borrar la fila de `pet_devices` en el release en vez de
  `released_at`**: descartado — pierde el historial de asignaciones
  (quién llevó qué collar y cuándo), que es exactamente lo que la columna
  `released_at` modela.
- **`SELECT ... FOR UPDATE` para la carrera de claims**: descartado — el
  índice único parcial ya da la garantía con menos código y sin riesgo de
  deadlock; el lock explícito sería un segundo mecanismo para el mismo
  invariante.
- **Upsert (`DO UPDATE`) en el seed**: descartado — re-sembrar debe ser
  inocuo; un upsert revertiría `status`/asignaciones de devices en uso
  (violaría R2).
- **Endpoint admin para dar de alta devices en vez de seed**: descartado —
  no hay rol admin en el MVP (fuera de alcance de #5) y el plan pide
  exactamente un seed idempotente.
- **`404` cuando la mascota no tiene collar en `GET .../device`**:
  descartado — el plan dice "o null"; "sin collar" es estado, no error, y
  el móvil renderiza el formulario de asociación a partir del `null`.
