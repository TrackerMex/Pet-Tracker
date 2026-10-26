# review: pet-members-api
Fecha: 2026-10-26
Veredicto: APROBADO

Feature #211, branch `feature/211-pet-members-api`, worktree
`/home/claude/sites/Pet-Tracker-wt-211`. Base de la implementación H0 =
`f1d0f320`; HEAD revisado = `ae73dda0` (28 commits de Codex + commits
solo-doc del leader: secciones «Reanudación» del handoff y errata E6 en
`design.md` D17 / `requirements.md`).

Restricción de esta revisión: el reviewer **no** corre `./init.sh` ni e2e
(otro Codex, #210, usa LocalStack/Postgres compartidos). El leader corre
`init.sh` sobre `ae73dda0` y entrega el log; hasta entonces el veredicto
es provisional. Las sondas y mutaciones se hicieron en un worktree de
scratch, nunca en wt-211.


## Lista cerrada de ficheros

- [x] `git diff --name-only f1d0f320..ae73dda0 -- backend-pet-tracker/ docs/`
      da **32 ficheros**, exactamente los de la lista cerrada del handoff
      (schema + spec, barrel, `.sql` + snapshot + journal, 4 de `domain/`,
      `invite-code` + spec, DTO, 6 casos de uso + 3 specs, repo drizzle,
      guard + spec, mapper, 2 controllers, módulo, `app.module.ts`, e2e,
      `docs/data-model.md`). Ni uno más ni uno menos.
- [x] Fuera de `backend-pet-tracker/` y `docs/` solo cambian
      `progress/handoff_pet-members-api.md` (leader),
      `progress/impl_pet-members-api.md` (Codex),
      `specs/pet-members-api/{design,requirements,traceability}.md`.
- [x] Guarda del handoff: `git diff --stat f1d0f320 ae73dda0 -- package.json
      pnpm-lock.yaml src/modules/pets src/audit src/modules/users src/main.ts
      test/pets.e2e-spec.ts` (desde `backend-pet-tracker/`) → vacío. Ningún
      test existente se toca.
- [x] `src/db/schema/index.ts`: una sola línea, `export * from
      './pet-invites.schema';`, entre `password-reset-tokens` y `pets`.
      `src/app.module.ts`: solo el import y `PetMembersModule,` tras
      `PetsModule,`.

## Migración

- [x] `0020_pet_invites.sql` + `meta/0020_snapshot.json` + entrada en
      `meta/_journal.json`, todo en el commit `769f46df` y en ningún otro.
      `grep -c '"tag"' _journal.json` → **21**; `ls | grep -c
      '_pet_invites\.sql$'` → 1. `prevId` del snapshot 0020 = `id` del 0019
      (`56584d4a…`); el snapshot solo añade `public.pet_invites` y no cambia
      ninguna otra tabla.
- [x] **Generada por drizzle-kit, sin editar** (prueba en el worktree de
      scratch): (a) `drizzle-kit generate --name pet_invites` sobre
      `ae73dda0` → «No schema changes, nothing to migrate», exit 0;
      (b) quitando `0020_*` y restaurando el journal de H0, el `generate`
      reproduce un `.sql` **idéntico byte a byte**, el snapshot idéntico
      salvo el `id` aleatorio y el journal idéntico salvo `when`.
- [x] El `.sql` solo crea `pet_invites`: 10 columnas, `UNIQUE("code_hash")`,
      `CHECK ("pet_invites"."role" in ('family'))`, 3 FKs (`pets` cascade,
      `users` cascade, `users` set null) y 3 índices btree.
- Nota (no bloquea): #210 también crea un `0020` en su rama. Es lo
      esperado; la receta para quien mergee segundo es D17 enmendada por E6.

## Checklist C2 — Estado coherente
- [x] Máximo una feature `in_progress`: hay **0** en el branch (`feature_list.json`
      → `[]`); #211 figura `spec_ready` en el branch y `pending` en
      `origin/main` y `origin/dev`. La guarda de `init.sh:156` no salta.
- [ ] `progress/current.md` en wt-211 es la plantilla de 4 líneas, sin la
      sesión de #211. No es defecto del implementer (el handoff le prohíbe
      tocarlo y el reporte lo confirma, línea 836); es tarea del leader al
      cerrar. Ver O1. No bloquea la implementación.

## Checklist C3 — Arquitectura
- [x] `domain/` sin imports de infraestructura ni de framework: solo
      `import type` de sus propias entidades y de
      `@/modules/pets/domain/entities/pet-membership` (dominio de otro módulo).
- [x] `PetMemberRepository` en `domain/repositories/` es interfaz pura con
      token; la implementación vive en
      `infrastructure/repositories/pet-member.drizzle.repository.ts`.
- [x] `application/` inyecta tokens (`@Inject(...)`) de interfaces
      (`PetMemberRepository`, `PetRepository`, `AuditLogger`); de Nest solo
      usa `Inject`/`Injectable`, igual que los 6 casos de uso de `pets`. Ningún
      import de `infrastructure/` ni de drizzle en `application/`.
- [x] `infrastructure/` sin lógica de negocio: controllers validan UUID /
      `parseBody` y delegan; el mapper traduce errores de dominio a los
      literales E-*; el repo hace la transacción `FOR UPDATE` (D8) sin
      reglas de negocio propias. El guard de R10 es infraestructura HTTP.
- [x] Seguridad: R8, R13, R14 y R16 responden cuerpos literales idénticos
      por rama (it.each por rama con `toEqual`), salvo la excepción D9 (409
      para quien ya es miembro). `remove` lanza el 403 **antes** de
      `findMembership` (candado unitario R13). Solo se persiste
      `code_hash` (SHA-256 hex); el código en claro solo sale en la
      respuesta de `POST …/invites`. El `meta` de auditoría es
      `{ petId }` (create, revoke, accept) y `{ memberUserId }` (remove):
      ni código ni hash; candado e2e `toHaveLength(4)` sobre las 4 acciones.
- [x] Sin dependencias nuevas (diff de `package.json` y `pnpm-lock.yaml`
      vacío), sin `process.env`/`ConfigService` en el módulo, sin secretos.

## Checklist C4 — TDD
- [x] Cada R1–R21 tiene al menos un test que lo nombra (`#211 R<n>: …`),
      tanto en unitarios como en e2e; el describe e2e de nivel superior es
      `#211 R16: pet members API` y cada `it` lleva su propio R-id.
- [x] Historial test-primero: 13 pares rojo→verde (R19 tiene dos: 23–24 y
      25–26) en el orden de `tasks.md`. Los commits `test(...)` solo traen
      tests y stubs de forma E4 (o la mutación prescrita en el 25); los
      `feat(...)` no tocan tests.
- [x] **Rojo por commit verificado por el reviewer** (worktree de scratch,
      `pnpm exec jest <spec>` en el commit rojo, exit 1, todo por aserción,
      ninguno por compilación ni por módulo ausente):

      | Commit rojo | R | Resultado | Motivo |
      |---|---|---|---|
      | `33d4b890` | R1 | 3 failed, 3 total | `toEqual` columnas, `Received: undefined`, `Expected length: 1 / Received length: 0` |
      | `ce507984` | R2 | 13 failed | regex sobre `""`, `Expected "ABCDEFGHJK" / Received " abcde-fghjk "`, `toBeNull` |
      | `0dd15da6` | R3 | 1 failed, 1 total | `resolves.toEqual` recibe `[Error: Not implemented]` |
      | `62b8e563` | R8 | 1 failed, 1 total | `rejects.toBeInstanceOf(InviteNotAcceptableError)`, recibe `Error` |
      | `e158a41b` | R10 | 3 failed, 3 total | `toThrow(HttpException)`: «Received function did not throw» |
      | `2379a015` | R13 | 1 failed, 1 total | `rejects.toBeInstanceOf(MemberRemovalForbiddenError)`, recibe `Error` |

- [x] R solo-e2e, verificado por diff (sin correr e2e): en cada commit rojo
      la ruta aún es stub (500) o no existe (404 de Nest con cuerpo
      `Cannot …`), y las aserciones son literales con `toEqual`/`toBe`, sin
      filtro global de excepciones que pueda normalizar el cuerpo:
      R16–R18 en `4e53c084` (módulo aún no registrado; R16 exige
      `toEqual({ statusCode: 404, message: 'Not Found' })`, R17 403, R18 401);
      R4 en `341cb1c2` (create sin límites, la 6.ª da 201); R5, R6, R7, R9,
      R11, R12, R14, R15, R20, R21 contra stubs; R8 400 sin `parseBody` en
      `62b8e563` (llega en `ee0320de`); R10 «otro usuario» exige primero el
      429 del primero; R19 en `5fdd75b6` sin auditoría. Coincide con la
      tabla de rojos observados del reporte (líneas 694–793).
- [x] Mutación R19: `03e832a5` añade como primera línea de `execute` el
      `audit.record({ … entityId: userId, meta: {} })` prescrito en
      `tasks.md`; `3639b7af` la quita y `git diff fde4820e 3639b7af --
      …/accept-pet-invite.use-case.ts` es vacío. Los its 404/409 filtran por
      `action` + `userId`, así que la mutación los pone rojos; los cinco
      its previos filtran por `entity_id` y siguen verdes, como dice el
      reporte.
- [x] Candados no tautológicos: el hash de R2 es un literal fijo; R3 (unit y
      e2e) recalcula el hash con `createHash` de `node:crypto` en el test,
      sin importar `hashInviteCode`; R1 lee `getTableConfig` y el `.sql`
      generado; R8 y R13 afirman además que el repositorio no se consulta.

## Checklist C5 — Trazabilidad
- [x] `traceability.md`: 21 filas, ninguna «pendiente»; cada fila cita el
      hash rojo y el verde (R19 los cuatro); todos son ancestros de HEAD y
      sus mensajes coinciden con `git log`. Los nombres citados coinciden
      con los `it`/`it.each` reales.
- [x] Commits con formato `test|feat(<scope>): <desc> (R-ids)`; los de
      harness/docs (`chore(harness)`, `docs(...)`) no llevan R ni código.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`, casilla marcada el 2026-10-26
      con la firma delegada del leader (mandato de la ampliación del
      2026-10-26 para #208–#216). Erratas E1–E6 registradas; E6 (commit
      `ae73dda0`) solo toca la receta D17 y no cambia ninguna R.

## Checklist C7 — Sin código huérfano
- [x] N/A — #211 no reemplaza nada existente (módulo nuevo; la guarda del
      handoff confirma que `pets`, `audit`, `users` y sus tests no cambian).

## Verificación del reviewer en HEAD `ae73dda0` (scratch)
- [x] `pnpm exec tsc --noEmit -p tsconfig.json` → exit 0, 0 líneas.
- [x] `pnpm exec eslint src/modules/pet-members src/db/schema
      test/pet-members.e2e-spec.ts src/app.module.ts` → exit 0, 0 líneas.
- [x] `pnpm exec jest` (unitario completo, sin DB) → exit 0:
      `Test Suites: 193 passed, 193 total` / `Tests: 1496 passed, 1496
      total`. T0 = 187/1474; +6 suites y +22 its (R1 3, R2 13, R3 1, R8 1,
      R10 3, R13 1). Coincide con el reporte. Sin regresiones unitarias.
- [x] `Not implemented` en el módulo → 0; `parseBody` 12 → 13.
- [x] `docs/data-model.md`: fila `pet_invites` tras `pet_users` y línea ERD
      `pets ||--o{ pet_invites : "invites"`.
- [x] E2E (`pet-members` y regresión e2e global): no los corrió el
      reviewer, por la restricción de esta sesión. Quedan cubiertos por el
      `init.sh` que corrió el leader, verde en la corrida 2 (ver §init.sh).

## Observaciones
- **O1 (leader, no bloquea la implementación):** `progress/current.md` en
  wt-211 sigue siendo la plantilla. Antes de cerrar, el leader debe dejar
  constancia de la sesión de #211 (o registrar que vive en el tablero).
- **O2 (cosmético, no bloquea):** la cabecera de
  `progress/impl_pet-members-api.md` dice todavía «BLOQUEADO en el commit
  16; implementación incompleta». El estado real está en
  `## Cierre completo (Reanudación 2)` (línea 559). Quien lea solo la
  cabecera se lleva un estado falso.
- **O3 (cosmético, no bloquea):** los comentarios de atajo deliberado usan
  `// shortcut:` donde el diseño pedía la etiqueta `ponytail:`. No cambia
  comportamiento.
- **O4 (límite aprobado, informativo):** D8 deja documentado que dos
  aceptaciones simultáneas de dos códigos distintos para el mismo usuario
  y mascota pueden chocar en la PK de `pet_users` y dar 500 (design.md
  línea 116). El contador de R10 es por proceso (D4). Ambos están
  aprobados en la spec.
- **O5 (merge):** la colisión `0020` con #210 se resuelve con D17/E6 al
  mergear el segundo; no se debe editar el `.sql` a mano.
- **O6 (flake ajeno a #211, no bloquea):** la corrida 1 de `init.sh` salió
  con exit 1 por un único fallo en el móvil:
  `src/screens/food/index.test.tsx` ›
  `#200 R9: pulsar cada enlace navega como hoy (meals-history-link)`
  («Number of calls: 0»). Es el flake de carrera conocido de Nutrición
  #200 (food-links sin esperar al plan), y en ese momento había otro jest
  concurrente (codex-220). #211 no toca `mobile-pet-tracker/`: la lista
  cerrada de 32 ficheros no tiene ninguno. Sus e2e no llegaron a correr en
  esa corrida. La corrida 2, sobre el mismo HEAD, salió verde entera. El
  flake sigue como deuda de #200.

## Output de ./init.sh
El reviewer no lo corrió: el leader lo corrió sobre `ae73dda0`, sin pipe,
mientras #210 usaba LocalStack/Postgres compartidos. Se verificó el log
de la corrida 2. El HEAD que registra el log es el HEAD de wt-211:
`git rev-parse HEAD` = `ae73dda0b15bf8a5b438f4efb899cf85e359f6a7`.

Corrida 2, verde
(`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/init-211-ae73dda0-run2.log`):
```
60:     ✅ Build exitoso
221:    Test Suites: 193 passed, 193 total          (backend unit)
222:    Tests:       1496 passed, 1496 total
103564: Test Suites: 155 passed, 155 total          (mobile)
103565: Tests:       5450 passed, 5450 total
103894: Test Suites: 3 skipped, 31 passed, 31 of 34 total   (backend e2e)
103895: Tests:       8 skipped, 544 passed, 552 total
        ✅ Tests e2e pasados
103925: ae73dda0b15bf8a5b438f4efb899cf85e359f6a7
103926: exit=0
```
Cómo se sabe que corrieron los e2e de #211, aunque el log no lista suites
una a una:
- Hay 34 suites e2e: 33 en H0 más `pet-members.e2e-spec.ts`.
- Las 3 suites saltadas son `aws-real-{smoke,media,ingest}` (2 + 2 + 4 = 8
  its, exactamente los 8 skipped). Ya se saltaban antes de #211.
- `pet-members.e2e-spec.ts` no tiene `.skip`, `.only` ni `.todo`, así que
  está entre las 31 suites que pasaron.
- El unitario coincide con lo que midió el reviewer: 193/1496.
- La línea «A worker process has failed to exit gracefully» del móvil es
  el aviso preexistente de siempre.

Corrida 1, roja
(`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/init-211-ae73dda0-run1-rojo.log`),
mismo HEAD `ae73dda0…`, exit 1:
```
103085:   ● #200 R9: enlaces del canvas › #200 R9: pulsar cada enlace navega como hoy (meals-history-link)
103106: Test Suites: 1 failed, 154 passed, 155 total
103107: Tests:       1 failed, 5449 passed, 5450 total
103113: exit=1
```
Es un flake móvil ajeno a #211 (ver O6). En esa corrida el unitario del
backend también dio 193/1496 en verde.

**Veredicto final: APROBADO.** Ningún defecto bloquea:
- `init.sh` sale verde (exit 0) sobre el HEAD revisado;
- no hay regresiones;
- R1–R21 tienen tests con nombre y sin filas «pendiente»;
- test-primero verificado;
- spec aprobada.

Antes de marcar done, el leader cierra O1 (`progress/current.md`).
