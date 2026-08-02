# review: pets-crud-permissions

Fecha: 2026-08-01
Veredicto: **RECHAZADO** (un único hallazgo bloqueante, de nivel docs — no requiere tocar código)

Revisé el branch `feature/5-pets-crud-permissions` (12 commits de trabajo +
reporte, merge-base `bd66246` = HEAD de `main`: main NO fue tocado) contra
`specs/pets-crud-permissions/requirements.md` (R1-R16, casilla humana marcada
2026-08-01), `design.md`, `CHECKPOINTS.md` y `docs/architecture.md`. Leí el
código real (guard, controller, use cases, DTOs, entidad, repositorio, mapper,
módulo, migración SQL, e2e), corrí `./init.sh` y los e2e yo mismo, y validé
las 5 decisiones humanas aprobadas. Todo lo ejecutable está verde; el rechazo
es exclusivamente por C6 (frontmatter de la spec en `status: draft`).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#5, en el working tree del leader; en HEAD de la branch sigue `pending` — cambio sin commitear, ver observación O4)
- [x] `progress/current.md` describe la sesión activa (#5, "review en curso")
- [x] `progress/history.md` tiene entradas de las sesiones cerradas (última: cierre de #4)
- [x] `STATUS.md` sincronizado con `feature_list.json` (verificado por init.sh)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `pet.entity.ts` y `pet-membership.ts` sin ningún import; `pet.errors.ts` sin `@nestjs/common`; `pet.repository.ts` solo importa entidades del propio domain
- [x] `PetRepository` es interface pura + token `PET_REPOSITORY` (Symbol), sin implementación en domain
- [x] application depende de interfaces: use cases inyectan `PET_REPOSITORY` (interface) y `AUDIT_LOGGER` (puerto de #3), nunca `PetDrizzleRepository` — mismo patrón DI que auth/users aprobado en #3/#4
- [x] infrastructure implementa el contrato (`PetDrizzleRepository implements PetRepository`); Drizzle/Express/Nest solo aparecen en infrastructure; validación zod en el borde HTTP (`parseBody`), no en application

## Checklist C4 — TDD
- [x] Cada R1-R16 tiene al menos un `describe`/`it` que lo nombra. Conteo por grep en `src/modules/pets`, `src/db/schema/pets.schema.spec.ts` y `test/pets.e2e-spec.ts`:
  R1×3, R2×4, R3×2, R4×4, R5×2, R6×2, R7×3, R8×4, R9×4, R10×2, R11×2, R12×2, R13×4, R14×4, R15×3, R16×3
- [x] Historial en 8 verticales incrementales (R1 → R6 → R4,R5 → R2,R3 → R7 → R8-R12 → R13-R15 → R16), cada commit con su spec incluida — no todo en un commit. (Test rojo previo a implementación no es verificable desde el historial porque test+impl van juntos por vertical; mismo patrón aceptado en #3/#4.)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` con las 16 filas completas, ninguna "pendiente"
- [x] Cada fila referencia archivo::describe y commit; verifiqué que los archivos citados existen y los `describe` nombran su R-id
- [x] Commits `feat(pets): <desc> (R-ids)` en los 8 feat; `test(pets): ... (R2-R5,R7-R16)`; `docs(pets)` ×2. `b626327 fix(pets)` sin R-id (corrección de tipos/lint transversal — aceptable, ver O5)

Mapa resumido R → test (detalle completo en `specs/pets-crud-permissions/traceability.md`, validado):
| R | Evidencia principal |
|---|---|
| R1 | `pets.schema.spec.ts` (columnas/PK/FK/CHECK/índice + "no toca audit_log") + migración `0003_pets_crud_tables.sql` leída: solo `pets` y `pet_users`, cero menciones a `audit_log` |
| R2, R3 | `create-pet.use-case.spec.ts`, `pet.drizzle.repository.spec.ts` (transacción), e2e rollback FK 23503 (500 y 0 filas) + audit post-commit |
| R4, R5 | `create-pet.dto.spec.ts` (límites + XOR), controller.spec, e2e |
| R6 | `pet.entity.spec.ts` (función pura `calculateAgeMonths`, fechas fijas UTC) |
| R7 | `list-pets.use-case.spec.ts`, e2e (incluye membresía revoked fuera del listado) |
| R8 | `pet-profile-response.mapper.spec.ts` (24 claves exactas, placeholders null), e2e |
| R9 | **e2e IDOR obligatorio verificado línea a línea** (`pets.e2e-spec.ts:369-419`): usuario B → 404 en GET/PATCH/DELETE de mascota de A, body comparado con `toEqual` contra el baseline de un uuidv7 inexistente, mascota intacta después; + caso membresía `revoked` → mismo 404 |
| R10 | guard.spec (no-UUID → 404 sin tocar la base; param no-string igual), e2e |
| R11 | guard.spec + e2e (family 403 en PATCH, vet 403 en DELETE; 404 precede a 403) |
| R12 | guard.spec (4 roles pasan sin decorador), e2e |
| R13-R15 | `update-pet.dto.spec.ts`, `update-pet.use-case.spec.ts` (NULL cruzado, meta.fields solo nombres, no-op sin audit), e2e |
| R16 | `delete-pet.use-case.spec.ts`, e2e (204, cascade, audit, 404 posterior) |

## Checklist C6 — Spec aprobada
- [ ] **FALLA**: `specs/pets-crud-permissions/requirements.md` tiene `status: draft` en el frontmatter (línea 3), no `status: approved`. Los otros 3 archivos de la spec (design/tasks/traceability) también quedaron en `draft`
- [x] Casilla "Aprobado por humano (fecha: 2026-08-01)" marcada
- [x] Ningún requisito modificado tras la aprobación: `requirements.md` tiene un único commit en la branch (`597dfd1`) y la tabla de trazabilidad corresponde 1:1 a R1-R16

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente. El diff contra main son solo archivos nuevos + 2 líneas en `app.module.ts` (import/registro de `PetsModule`) + 1 línea en `db/schema/index.ts` (re-export). El módulo auth de #4 (`AuthGuard` global, `@Public()`, `@CurrentUser()`) no tiene ni una línea modificada; sus specs siguen en los 275 tests verdes

## Verificaciones adicionales pedidas por el leader
- **main intacto**: `git merge-base main HEAD` = `git rev-parse main` = `bd66246`. Cero commits nuevos en main.
- **audit_log sin migración nueva**: leí `0003_pets_crud_tables.sql` completo — solo `CREATE TABLE pet_users`, `CREATE TABLE pets`, 2 FKs CASCADE y el índice `pet_users_user_id_idx`. Además el test R1 lo asserta.
- **Guard global de #4 intacto**: ningún archivo de `src/modules/auth/` en el diff; todas las rutas de pets exigen token en el e2e (tokens firmados con el `TokenService` real).
- **Decisiones humanas 1-5 respetadas**: (1) `createWithOwner` transaccional en el repo + `AuditLogger.record('pet.create')` post-commit en el use case, sin bypass del puerto, sin migración de audit; (2) `CreatePetSchema`: obligatorios solo `name`, `species` y XOR `birthDate`/`approxAgeMonths` vía superRefine; (3) enums `sex {male,female}`, `size {small,medium,large}`; (4) `UpdatePetSchema` rechaza ambos a la vez (400) y `toFieldChanges` anula en cruz; (5) GET detalle sin `@RequirePetRole` (cualquier rol activo) y mapper con `device`/`nextVaccine`/`nextReminder`/`activitySummary` = null tipados como `null` literal.

## Observaciones

**Bloqueante**
- **B1 (C6)**: el frontmatter de los 4 archivos de `specs/pets-crud-permissions/` dice `status: draft` con la casilla humana ya marcada. CHECKPOINTS C6 exige `status: approved` en `requirements.md` y "el reviewer rechaza el cierre si queda alguno vacío en C1-C7". Nota importante: el impl report (nota 1) alega precedente de #3/#4 — **es falso**: `specs/auth-registration/requirements.md` y `specs/auth-login-me/requirements.md` dicen ambos `status: approved` en el repo, y el review de #4 marcó C6 verificando exactamente eso. Corrección: 1 línea por archivo (4 archivos), editable por el leader directamente (specs/ es suyo según CLAUDE.md); no hace falta relanzar al implementer ni tocar código. Con eso corregido, el resto de este review queda válido tal cual.

**Mayor**
- (ninguno)

**Menor**
- **M1**: `PetDrizzleRepository.update()` (`pet.drizzle.repository.ts:114-130`): si la fila desaparece entre el guard y el UPDATE (delete concurrente), `.returning()` devuelve `[]` y `toDomain(undefined)` lanza TypeError → 500, no el 404 de `PetNotFoundError` que `pets.controller.ts::mapPetError` está preparado para traducir (y que el docblock de `pet.errors.ts` promete para este caso exacto). El camino GET sí lo cubre (`findById` → null → `PetNotFoundError`). Ventana de carrera mínima y sin R-id que lo exija explícitamente — no bloquea; candidato a fix de 3 líneas cuando alguna feature toque el repo.
- **M2**: la spec entró al repo en `597dfd1`, después de los commits de implementación (el spec_author la dejó untracked). El gate humano se verificó sobre el working tree y el contenido committeado corresponde 1:1 con lo implementado, pero el orden ideal es spec committeada antes del primer commit de código. Proceso del spec_author, no del implementer.
- **M3**: el impl report cita como "precedente" un estado draft de #3/#4 que no existe (ver B1) — cuidado con dar por buenas afirmaciones de reportes sin verificarlas.
- **O4** (proceso, leader): `feature_list.json` (#5 `pending`→`in_progress`) y `progress/current.md` están modificados sin commitear en el working tree — cierre pendiente del leader, correcto que el implementer no los tocara.
- **O5**: `b626327 fix(pets)` sin R-ids en el mensaje — es una corrección transversal de tipos/lint (normalización de `request.params.petId`, `string | string[]` en Express 5); los 8 `feat` sí cumplen el formato. Aceptable, mismo criterio que los `docs(...)`/`chore(...)` aceptados en #4.

## Output de ./init.sh

Ejecutado por mí en la branch (exit 0):

```
→ Verificando entorno...            ✅ node / pnpm
→ Verificando variables de entorno... ✅ .env + DATABASE_URL
→ Instalando dependencias...        ✅ (lockfile up to date)
→ Verificando coherencia del harness... ✅ (⚠️ Feature en progreso: pets-crud-permissions)
                                    ✅ STATUS.md sincronizado con feature_list.json
→ Build...                          ✅ nest build && tsc-alias
→ Ejecutando tests...
Test Suites: 56 passed, 56 total
Tests:       275 passed, 275 total
→ Lint...                           ✅ sin errores
→ Typecheck...                      ✅ sin errores
✅ Todo verde. Listo para trabajar.
```

Baseline de main era 43 suites / 179 tests: +13 suites / +96 tests, cero regresiones.

## Output de e2e (ejecutado por mí, Postgres 17 en Docker healthy)

`pnpm run test:e2e -- --testPathPatterns pets`:

```
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Time:        5.19 s
```

El stack trace FK 23503 (`pet_users_user_id_users_id_fk`) que aparece en el
output es el log esperado del test de rollback transaccional de R2 (usuario
fantasma → 500 y `pets` sin fila), no un fallo.
