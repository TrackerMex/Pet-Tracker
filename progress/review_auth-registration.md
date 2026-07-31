# review: auth-registration
Fecha: 2026-07-30
Veredicto: APROBADO

Feature id 3, branch `feature/3-auth-registration`, commits `aa584e4`..`b2131a1`.
Reporte revisado: `progress/impl_auth-registration.md`. Working tree limpio.
Verificación hecha leyendo el código real, no sólo el reporte.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress — `feature_list.json`: #1 y #2 `done`, #3
  `auth-registration` `in_progress`, ninguna otra. No lo modifiqué (es del leader).
- [x] `progress/current.md` actualizado — describe la sesión activa de #3, con
  el riesgo de Docker declarado explícitamente y el reviewer marcado "en curso".
- [x] `progress/history.md` tiene entrada de cada sesión cerrada (#1, #2).
- [x] Toda feature `done` tiene tests que la cubren (sin cambios en #1/#2; sus
  suites siguen pasando dentro de las 30).

## Checklist C3 — Arquitectura
- [x] **domain sin imports de infrastructure** — verificado por barrido de
  imports sobre `modules/auth/domain/**`: los únicos dos imports de toda la capa
  son `entities/*.entity` desde sus propios repositorios. Cero `@nestjs/*`, cero
  `drizzle-orm`, cero `argon2`, cero `node:crypto`, cero `zod`.
- [x] **repositories/contratos en domain son interfaces puras** —
  `user.repository.ts` y `email-verification-token.repository.ts` exportan
  `interface` + `Symbol` de token + tipo `New*`, sin implementación. Igual los
  puertos `password-hasher.ts` y `email-verification-sender.ts`.
- [x] **application depende de interfaces, no implementaciones** — ambos
  use-cases inyectan por token (`USER_REPOSITORY`, `PASSWORD_HASHER`,
  `EMAIL_VERIFICATION_TOKEN_REPOSITORY`, `EMAIL_VERIFICATION_SENDER`,
  `AUDIT_LOGGER`) y tipan con `import type` de la interface. Ninguna clase
  concreta de `infrastructure/` aparece importada en `application/`.
- [x] **infrastructure sin lógica de negocio** — los repositorios Drizzle sólo
  mapean fila↔entidad y generan el UUIDv7; las reglas (email único, expiración,
  un-solo-uso, auditoría) viven en los use-cases.
- [x] `argon2` sólo en `infrastructure/security/argon2-password-hasher.ts`
  (único import real del paquete en todo `src/`); `drizzle-orm` sólo en
  `infrastructure/repositories/`; `@nestjs/common` en `application/` se limita a
  `Inject`/`Injectable`, que es el precedente ya aprobado del módulo `health`
  (`check-health.use-case.ts`) y que `docs/architecture.md` sólo prohíbe
  explícitamente en `domain/` (línea 51).
- [x] El puerto compartido `src/audit/audit-log.repository.ts` es interface +
  Symbol puros, sin ORM — por eso que `application/` lo importe no rompe la
  regla de dependencia.

**Sobre `application/verification-token.ts` (archivo no listado en `design.md`):
aceptado.** Es aditivo y está en la capa correcta. Contiene
`generateVerificationToken()`, `hashVerificationToken()` y
`VERIFICATION_TOKEN_TTL_MS`, compartidos por los dos use-cases. Meterlo en
`domain/` habría metido `node:crypto` en el núcleo — justo lo que C3 prohíbe.
No cambia ninguna decisión del design (token opaco, SHA-256, sólo el hash se
persiste); sólo evita duplicar el hasheo entre registro y verificación.

## Checklist C4 — TDD
- [x] **Cada R1-R15 tiene al menos un test que lo nombra** — verificado por
  barrido de `describe('R<n>: ...')` sobre `backend-pet-tracker/src`. Los 15
  aparecen, y los nombres coinciden literalmente con los de `traceability.md`:
  R1 (4 tests), R2, R3, R4, R5, R6 (3), R7 (3), R8, R9, R10, R11, R12, R13,
  R14 (2), R15 (2).
- [x] **Historial de commits muestra test-primero, no todo junto** — 5 commits
  de código repartidos por grupo de requisitos (`aa584e4` setup, `92dbda4`
  R1-R5+R14+R15, `870f253` R6-R7, `e964260` R12, `c21ce31` R8-R11+R13,
  `b2131a1` wiring/cierre), no un único commit monolítico.
  Matiz honesto: dentro de cada commit el test y su implementación viajan
  juntos, así que la transición rojo→verde no es observable *dentro* del
  commit; lo observable es la partición por requisito, que es la barra que fija
  el checkpoint ("no todo en un commit").
- [x] `auth.module.spec.ts` sin R-id es aceptable: es red de seguridad de DI, y
  los 15 requisitos están cubiertos por otros specs.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" — las 15 filas tienen test y
  commit. Comprobé que los tests referenciados **existen** con ese nombre exacto,
  no sólo que la fila esté rellena.
- [x] Cada requisito tiene su test y su commit registrados.
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` —
  p.ej. `feat(auth-registration): POST /v1/auth/verify-email single-use token
  flow (R8,R9,R10,R11,R13)`. Los dos no-`feat` (`chore` de setup, `test` de
  cierre) no declaran R-ids porque no cierran requisitos, lo cual es correcto.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter.
- [x] Casilla "Aprobado por humano" marcada con fecha (2026-07-30).
- [x] Ningún requisito modificado después de la aprobación: el último commit que
  toca `requirements.md` es `3baa04e` (el propio gate); ningún commit de
  implementación (`aa584e4`..`b2131a1`) lo modifica.

## Checklist C7 — Sin código huérfano
- [x] Componente reemplazado eliminado — `src/db/schema/bootstrap.schema.ts`
  (placeholder `schema_bootstrap` de #1, que su propio comentario mandaba borrar
  al aterrizar la primera feature con tablas reales) está borrado en `aa584e4`,
  y el barrel `index.ts` ya no lo re-exporta.
- [x] Tests del código eliminado también eliminados — no existía ningún
  `bootstrap.schema.spec.ts`.
- [x] Búsqueda de importadores no devuelve resultados vivos. Las únicas
  ocurrencias restantes de `schemaBootstrap`/`schema_bootstrap` son legítimas:
  (a) `db/schema/index.spec.ts`, que **afirma que ya no se exporta** — es un
  guard de regresión, no un huérfano; (b) `migrations/0000_*.sql` y sus
  snapshots, que son historia append-only y no se pueden reescribir;
  (c) documentos históricos (`progress/`, `specs/`, `design.md`).
  La migración `0002` hace el `DROP TABLE "schema_bootstrap" CASCADE`.

## Verificaciones adicionales pedidas

**Migraciones (0001 CREATE + 0002 DROP).** Ambas son salida del generador, no
escritas a mano: `meta/_journal.json` tiene las 3 entradas coherentes
(`0000`, `0001_auth_registration_tables`, `0002_drop_schema_bootstrap_placeholder`)
con sus `meta/000X_snapshot.json`, y el SQL trae el formato de drizzle-kit
(`--> statement-breakpoint`, nombres de constraint autogenerados como
`users_email_unique`, `audit_log_user_id_users_id_fk`). El resultado combinado
es exactamente el schema de `docs/data-model.md`: comparé columna por columna
`users` (12 columnas, `email` UNIQUE, `timezone` DEFAULT 'UTC',
`terms_accepted_at` NOT NULL, `email_verified_at` NULL, sin columna de
`passwordConfirmation`, sin `cognito_sub`) y `audit_log` (bigint identity,
`user_id` NULL con FK SET NULL). Partir en dos migraciones para esquivar el
prompt interactivo de rename es una solución legítima y deja historia lineal.

**`docs/data-model.md`.** La fila `email_verification_tokens` añadida describe
la tabla realmente creada: `id PK, user_id FK CASCADE, token_hash char(64)
UNIQUE NOT NULL, expires_at timestamptz NOT NULL, used_at timestamptz NULL,
created_at` — coincide con `email-verification-tokens.schema.ts` y con el SQL
de `0001`. La edición es correcta y estaba justificada (la spec exige la tabla
y el catálogo no la tenía). Nit menor, no bloqueante: la nota dice "`used_at`
NOT NULL = ya consumido", que se lee raro; quiere decir "`used_at` no nulo =
consumido". La definición de la columna en la misma fila ya dice `NULL`.

**R7 y R14 (seguridad), confirmado por lectura del código, no sólo por el test.**
No existe ruta desde el token en claro ni desde `password_hash` al body HTTP:
- El token en claro nace en `generateVerificationToken()` y sólo va a dos
  sitios: `verificationTokens.create({ tokenHash: hashVerificationToken(token) })`
  (a la base va el hash, no el token) y `verificationSender.send({ token })`
  (log del servidor). `RegisterUserUseCase.execute()` devuelve `User`, un tipo
  que no tiene campo de token.
- El controller hace `toUserResponse(await this.registerUser.execute(dto))`, y
  `toUserResponse` es una lista explícita de 8 campos construida por
  enumeración — `passwordHash` no se omite borrándolo, es que nunca se copia.
- `verifyEmail` devuelve el literal `{ verified: true }`.
- Los tests que lo fijan no son vacuos: R7 compara `Object.keys(body).sort()`
  contra la lista exacta de 8 campos **y** asserta que el JSON no contiene
  "token"; R14 usa un doble cuyo `passwordHash` es un PHC `$argon2id$...` real
  y asserta que el JSON no contiene "argon2id". Cualquier campo nuevo en el
  mapper rompe R7 a propósito.
- Bonus correcto: el 409 de email duplicado devuelve mensaje genérico y el token
  usado se mapea al mismo 400 que el inexistente, sin filtrar si existió.

**Lógica de verificación (R8-R11, R13).** `VerifyEmailUseCase` busca por hash,
trata `null` y `isUsed()` con el mismo `InvalidVerificationTokenError` (400),
luego `isExpired()` → 410, y sólo en el camino feliz marca verificado + usado +
auditoría. Consistente con los requisitos, incluida la precedencia deliberada
usado-sobre-expirado.

## Observaciones

Ninguna bloqueante. Una limitación documentada y dos notas de seguimiento:

1. **Sin verificación contra Postgres real — limitación documentada, NO
   bloqueante.** Intenté levantar Docker yo mismo, como pedía el encargo:
   `docker compose ps` y `docker compose up -d` fallan con
   `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine`
   — el mismo error que reportó el implementer. **No pude aplicar las
   migraciones ni verificar la creación del schema.** Sigue sin ejecutarse: el
   SQL real de `0001`/`0002`, el `returning()` del insert de `users` y los
   `update ... where` de `markEmailVerified`/`markUsed`.

   Por qué apruebo igualmente, en vez de rechazar:
   - Ningún criterio de C1-C7 exige verificación contra infraestructura viva.
   - `tasks.md` (la spec aprobada por el humano) **no pide un e2e** ni una
     verificación con base real; sus 15+6 checkboxes están todas cumplidas.
   - `./init.sh` pasa en mi propia ejecución, incluido typecheck, que valida el
     código no ejecutado contra `$inferSelect`/`$inferInsert` derivados del
     mismo schema que generó el SQL.
   - El SQL es salida del generador y coincide columna por columna con
     `docs/data-model.md`; no es SQL a mano sin revisar.
   - Existe precedente explícito del proyecto: la feature #2
     (`localstack-provisioning`) se cerró como `done` con 10 de 19 requisitos
     sin ejecutar contra infra real, registrado como "Nota de entorno" en
     `progress/history.md`.
   - Coincido además con la decisión de **no** versionar un e2e que nadie ha
     visto pasar: un test verde-por-no-ejecutarse es peor que no tenerlo.

   Seguimiento recomendado (para el leader, no para el implementer): en una
   máquina con Docker, correr `docker compose up -d` y
   `pnpm -C backend-pet-tracker exec drizzle-kit migrate`, y confirmar que las
   3 tablas se crean y que `schema_bootstrap` desaparece. Dejar constancia en
   `progress/history.md` al cerrar, igual que se hizo con #2.

2. **Nota heredada del implementer que conviene no perder**: la spec de
   `pets-crud-permissions` (#5) dice que crea `audit_log`. Ya existe desde esta
   feature. Hay que ajustar esa descripción para que la reutilice y no genere
   una migración duplicada.

3. **No hay script `db:migrate`** en `package.json` (sólo `db:generate`).
   Aplicar migraciones exige hoy `exec drizzle-kit migrate` a mano. Fuera del
   alcance de esta feature; candidato a tarea propia.

## Output de ./init.sh

Ejecutado por el reviewer (no copiado del reporte). Exit code 0.

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
Lockfile is up to date, resolution step is skipped
Already up to date

╭ Warning ─────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Ignored build scripts: argon2@0.45.1, esbuild@0.18.20, esbuild@0.25.12,    │
│   esbuild@0.28.1, unrs-resolver@1.12.2.                                      │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
Done in 1.4s using pnpm v10.33.4
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: auth-registration
✅ STATUS.md sincronizado con feature_list.json

→ Build...

> backend-pet-tracker@0.0.1 build C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> nest build && tsc-alias -p tsconfig.build.json

✅ Build exitoso

→ Ejecutando tests...

> backend-pet-tracker@0.0.1 test C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> jest "--passWithNoTests"


Test Suites: 30 passed, 30 total
Tests:       99 passed, 99 total
Snapshots:   0 total
Time:        5.437 s
Ran all test suites.
✅ Tests pasados

→ Lint...

> backend-pet-tracker@0.0.1 lint C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix

✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 2/18 completadas | 15 pendientes

  Próxima feature:
  [#4] auth-login-me (P1)
```

30 suites / 99 tests, coincide con lo reportado por el implementer. Baseline
previo 19 suites / 33 tests: **sin regresiones**, las 19 suites anteriores
siguen pasando.

## Nota de entorno del reviewer

```
docker compose ps
→ failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine;
  check if the path is correct and if the daemon is running:
  open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.

docker compose up -d
→ unable to get image 'postgres:17-alpine': failed to connect to the docker API at
  npipe:////./pipe/dockerDesktopLinuxEngine; ...
```
