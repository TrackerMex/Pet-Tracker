# review: weight-single-source-of-truth

Fecha: 2026-08-14
Branch: `feature/22-weight-single-source-of-truth` (9 commits, `6fef86d..e663746`)
Baseline de comparación: `afc522e` (main)
Veredicto: **APROBADO**

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `#22 weight-single-source-of-truth`, tanto
      en `HEAD:feature_list.json` como en el working tree. Verificado que no hay
      ninguna otra fila `in_progress`.
- [x] `progress/current.md` actualizado — describe la sesión activa (#22,
      implementador Codex CLI, estado y siguiente paso).
- [x] `progress/history.md` tiene la entrada de la sesión cerrada anterior (#16
      `pet-reminders`, estado final `done`).

> Nota de contexto aceptada del leader: `feature_list.json` aparece modificado
> en el working tree con las features nuevas #24 y #25. Es bookkeeping de
> backlog del leader, ajeno a esta feature; no se evalúa aquí. No afecta al
> conteo de `in_progress`.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — `pets/domain/` solo importa sus
      propias entidades (`pet.entity`, `pet-membership`). Sin ORM, HTTP ni IO.
- [x] Repositorios/contratos en `domain` son interfaces puras — `NewPet` y
      `PetFieldChanges` (`pet.repository.ts`) siguen siendo interfaces sin
      implementación; el cambio se limita a **quitar** `currentWeightKg?: number`
      de ambas.
- [x] `application` depende de interfaces, no implementaciones — grep de
      `drizzle` / `from '.*infrastructure` en `pets/application/` no devuelve
      nada. `CreatePetUseCase`/`UpdatePetUseCase` siguen inyectando
      `PET_REPOSITORY`.
- [x] `infrastructure` sin lógica de negocio — `PetDrizzleRepository.update()`
      queda más delgado (`.set({ ...changes, updatedAt })`); se elimina
      `toWeightColumn()`, que era la última conversión de peso en esta capa.
- [x] `scripts/backfill-weights.ts` fuera de `src/` no rompe capas: sigue el
      precedente ya existente de `seed-vaccines.ts` / `seed-devices.ts`
      (script standalone de datos), explícitamente sancionado por design D4.

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra:
  - R1 → `create-pet.dto.spec.ts`, `describe('R1 (weight-single-source-of-truth #22): POST ignora weightKg')`
  - R2 → `update-pet.dto.spec.ts` `it('descarta weightKg como campo no reconocido (R2 #22)')`;
        `update-pet.use-case.spec.ts` `it('PetFieldChanges no permite currentWeightKg (R2 #22)')`
        e `it('trata weightKg descartado como no-op (R2 #22)')`;
        `test/pets.e2e-spec.ts` `it('PATCH con weightKg es un no-op sobre current_weight_kg (R2 #22)')`
  - R3 → `test/backfill-weights.e2e-spec.ts`, `describe('R3 (weight-single-source-of-truth #22): crea el historial faltante')`
  - R4 → `test/backfill-weights.e2e-spec.ts`, `describe('R4 (weight-single-source-of-truth #22): conserva la proyeccion')`
  - R5 → documental; la trazabilidad lo declara `N/A` en la columna Test, que es
        la única excepción que la propia tabla autoriza. Verificado a mano abajo.
  - R6 → requisito de **no-regresión**; ver §Observaciones, punto 1.
- [x] Historial test-primero, no todo junto. Auditado commit a commit: **los
      commits `test(...)` tocan exclusivamente ficheros `*.spec.ts`, y los
      commits `feat(...)` exclusivamente `src/`**. Ni una sola mezcla.

| Requisito | Rojo (solo tests) | Verde (solo src) |
|---|---|---|
| R1 | `0f45ac4` — `create-pet.dto.spec.ts`, `create-pet.use-case.spec.ts`, `pet.drizzle.repository.spec.ts` | `13af2dc` — `create-pet.dto.ts`, `create-pet.use-case.ts`, `pet.repository.ts`, `pet.drizzle.repository.ts` |
| R2 | `bb5cf21` — `update-pet.dto.spec.ts`, `update-pet.use-case.spec.ts`, `pets.e2e-spec.ts` | `cf6f302` — `update-pet.use-case.ts`, `pet.repository.ts`, `pet.drizzle.repository.ts` |
| R3/R4 | `dbd4fae` — `backfill-weights.e2e-spec.ts` (183 líneas, archivo nuevo) | `79121d2` — `scripts/backfill-weights.ts`, `package.json` |

Este es el punto que falló en #19 (implementación + tests + docs en un commit).
Aquí está corregido de forma inequívoca.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" — las 6 filas (R1-R6) tienen
      commit registrado. Verificado que cada hash citado existe y que cada
      nombre de test citado existe literalmente en el archivo que dice.
- [x] Commits siguen el formato `<tipo>(weight-single-source-of-truth): <desc> (R-ids)`
      en los 9 commits. Scope correcto y R-ids presentes en todos.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter.
- [x] Casilla humana marcada: `- [X] Aprobado por humano (fecha: 2026-08-14)`.
- [x] Ningún requisito modificado después de la aprobación — `requirements.md`
      entra en el branch en `6fef86d` (commit de aprobación, previo al primer
      commit de implementación) y no vuelve a tocarse en ningún commit posterior.

## Checklist C7 — Sin código huérfano

Esta feature **sí** reemplaza comportamiento existente (los dos escritores de
`pets.current_weight_kg` de #5), así que C7 aplica en pleno.

- [x] Componentes reemplazados eliminados, no dejados "por si acaso":
  - `toNewPet()` (`create-pet.use-case.ts`) — eliminada, `dto` va directo a `createWithOwner()`
  - `toWeightColumn()` (`pet.drizzle.repository.ts`) — eliminada, se quedaba sin callers
  - rama `currentWeightKg` de `toFieldChanges()` (`update-pet.use-case.ts`) — eliminada
  - desestructurado `const { currentWeightKg, ...rest }` de `update()` — eliminado
  - `currentWeightKg?: number` de `NewPet` y de `PetFieldChanges` — eliminado
- [x] Búsqueda de referencias huérfanas: `grep -rn "weightKg|currentWeightKg|current_weight_kg"`
      sobre `backend-pet-tracker/` **no deja ni una escritura** de peso desde el
      módulo `pets`. Lo que queda es legítimo y esperado:
      la columna del schema, la lectura de `toDomain()` (R6), los `PROFILE_KEYS`
      intactos, `health-weights` (#15) sin tocar, el script de backfill nuevo y
      los snapshots históricos de migraciones.
- [x] Tests **actualizados, no borrados** — requisito explícito de la spec y del
      acceptance criteria de #22. Auditado el diff pieza por pieza: cada
      assertion vieja sobre `weightKg` tiene sustituta, y la cobertura neta
      **sube**, no baja:

| Archivo | Assertion vieja retirada | Sustituta |
|---|---|---|
| `create-pet.dto.spec.ts` | 3 casos `it.each` de `weightKg` inválido (cero/negativo/>999.99) + `weightKg: 25.5` de la ficha completa | `describe('R1 ... POST ignora weightKg')` afirma `success: true` y `'weightKg' in data === false` |
| `update-pet.dto.spec.ts` | casos `'solo weightKg'` y `'weightKg cero'` | `it('descarta weightKg como campo no reconocido (R2 #22)')` → `data` `toEqual({})` |
| `create-pet.use-case.spec.ts` | `currentWeightKg: 25.5` esperado en `toHaveBeenCalledWith` | el mismo test sin esa clave (data-only) |
| `update-pet.use-case.spec.ts` | R13 con `weightKg` mapeado; R15 con `fields: ['name','weightKg']` | R13 sin weight + **2 tests nuevos**: guarda de tipo `@ts-expect-error` sobre `PetFieldChanges` y no-op de `weightKg` |
| `pet.drizzle.repository.spec.ts` | `captured.petInsert?.currentWeightKg === '25.5'` | test invertido: `expect(captured.petInsert).not.toHaveProperty('currentWeightKg')` |
| `test/pets.e2e-spec.ts` | R13 con `weightKg: 22.5`; R13b con `weightKg: -5` → 400 | R13 con `color: 'golden'` + `currentWeightKg` `toBeNull()`; R13b con `microchip: 'a'.repeat(33)` (sigue probando "un campo inválido rechaza el body completo"); **+1 test nuevo** de no-op |

- [x] No quedan ficheros `.spec`/`.test` de código eliminado (no se borró ningún
      archivo en toda la feature).

---

## Verificación de los puntos de atención de la feature

### R1/R2 — `weightKg` fuera del contrato de escritura
- `PetFieldsSchema` (`create-pet.dto.ts`) ya no declara `weightKg`; `UpdatePetSchema`
  lo pierde por herencia de `PetFieldsSchema.partial()`, sin tocar `update-pet.dto.ts`.
- `z.object` (no `z.strictObject`) → la clave se descarta en silencio, **no 400**.
  Confirmado por test unitario y por el e2e (`PATCH { weightKg: 99 }` → `200`).
- `CreatePetUseCase`, `UpdatePetUseCase.toFieldChanges()` y `PetDrizzleRepository`
  (`createWithOwner` y `update`) ya no escriben `current_weight_kg`. Verificado
  leyendo los cuatro ficheros, no solo el reporte.

### R2 caso (b) — `meta.fields` nunca lista `weightKg`
Verificado por mecanismo, no solo por test: `meta.fields` se deriva de
`Object.keys(dto)` (`update-pet.use-case.ts:32,54`), y `dto` es el resultado de
`UpdatePetSchema.parse()`, que ya descartó `weightKg` en el borde HTTP. No existe
ninguna rama por la que la clave pueda reaparecer. Ver Observaciones punto 2.

### R2 caso (a) — no-op de R15 de #5
- Unitario: `update` y `record` **no** se llaman; `findById` sí (`it('trata weightKg descartado como no-op (R2 #22)')`).
- E2E: `PATCH { weightKg: 99 }` → `200`, `currentWeightKg` `null`.
Consistente con el no-op original de #5, sin `UPDATE` ni fila en `audit_log`.

### R3/R4 — Backfill
Leído `scripts/backfill-weights.ts` y su e2e completo. Cumple los seis extremos:
- **Idempotente**: `LEFT JOIN weights` + `isNull(weights.id)`; test explícito de
  segunda corrida → devuelve `0` y el conteo sigue en 1.
- **`measured_at` = fecha de calendario de `pets.created_at`**: `toISOString().slice(0,10)`.
  El test siembra `created_at` a las `23:45:00Z` a propósito y espera `'2025-03-04'`,
  lo que detectaría una conversión de zona horaria indebida.
- **`created_by` = owner activo**: `innerJoin` con `role='owner'` y `status='active'`.
- **Mascotas sin owner activo se omiten sin abortar**: test `'omite mascotas sin owner activo'` → `0`, sin excepción.
- **No toca `pets.current_weight_kg` ni `pets.updated_at`**: test R4 afirma ambos
  contra los valores sembrados. El script no contiene ningún `UPDATE`.
- **Sin migración de schema**: `git diff --name-only afc522e..HEAD -- src/db` está
  **vacío**. El backfill es DML, como exige la spec.
- `package.json` gana `backfill:weights` con el mismo patrón que `seed:*`.

### R6 (CRÍTICO) — el contrato de GET /v1/pets/:petId no cambia
Comprobado con `git diff --stat afc522e..HEAD` sobre las rutas exactas:

```
backend-pet-tracker/src/modules/pets/infrastructure/mappers/   → sin cambios
backend-pet-tracker/test/devices.e2e-spec.ts                   → sin cambios
backend-pet-tracker/src/modules/pets/domain/entities/pet.entity.ts → sin cambios
```

Salida vacía: `pet-profile-response.mapper.ts`, `pet-profile-response.mapper.spec.ts`
y el `PROFILE_KEYS` de `devices.e2e-spec.ts` **no aparecen en el diff de la feature**.
En `pets.e2e-spec.ts` el diff está confinado a las líneas 486-529 (bloque `R13`/`R13b`);
el array `PROFILE_KEYS` (línea 72) y el tipo `currentWeightKg: number | null`
(línea 26) están intactos. Las 24 claves y la nulabilidad se conservan, y las
tres suites quedaron verdes en mi corrida de `init.sh`.

### Fuera de alcance respetado
- `health-weights` (#15): `git diff --name-only afc522e..HEAD -- src/modules/health`
  **vacío**. `WeightDrizzleRepository`, `CreateWeightUseCase` y `WeightsController`
  sin tocar. Queda como único escritor, que es exactamente la tesis de la feature.
- Sin migración, sin dependencia nueva, sin variable de entorno nueva.

### R5 — documentación
`docs/data-model.md` fila `pets` ahora dice: *"`current_weight_kg` tiene un único
escritor: `WeightDrizzleRepository.create()` de `health-weights` (#15); POST/PATCH
`/v1/pets` ya no aceptan `weightKg`"*. Fila `weights` añade la referencia al
backfill de #22. Ambas mitades de R5 cubiertas.

---

## Observaciones

Ninguna bloqueante. Tres notas para el registro:

1. **R6 no tiene un test que lo nombre, por diseño y de forma irresoluble.**
   R6 exige que `pet-profile-response.mapper.spec.ts` y los `PROFILE_KEYS`
   permanezcan **sin ninguna modificación**; añadirles un `describe('R6...')`
   sería violar el propio requisito que verifican. La spec aprobada resuelve la
   tensión declarando que el método de verificación de R6 es el diff, no un test
   nuevo (`tasks.md` R6, items 1 y 2 marcados `N/A` con justificación). Lo he
   verificado por ese método y de forma independiente. No es un incumplimiento
   de C4 sino un requisito de no-regresión cuya naturaleza excluye el patrón.

2. **Caso (b) de R2 no tiene test end-to-end dedicado.** No hay ningún test que
   mande `PATCH { name, weightKg }` juntos y lea `meta.fields` del `audit_log`.
   No es un hueco real: tras R1 el tipo `UpdatePetDto` ya no admite `weightKg`,
   así que el caso solo es construible por HTTP, y la garantía viene del
   `UpdatePetSchema.parse()` que sí está probado directamente. El design D3
   (aprobado) dirigió explícitamente a quitar `weightKg` de ese test en vez de
   conservarlo. Si en el futuro se quiere blindar el borde HTTP, el test sería
   un e2e que envía ambos campos y afirma `meta.fields === ['name']`.

3. **Commit `86040d5` va prefijado `test(...)` pero no contiene ningún test.**
   Solo mueve bookkeeping (`current.md`, `tasks.md`, `traceability.md`). Es el
   registro de la verificación de R6 (item 3 de `tasks.md`), así que el contenido
   es correcto; el prefijo hubiera sido más honesto como `docs(...)` o `chore(...)`.
   Nota de higiene, sin efecto sobre C4 ni C5.

4. Nota informativa, no atribuible a esta feature: `plans/004-mascotas-crud-permisos.md:48`
   sigue listando `weightKg` en el DTO de `POST /v1/pets`. Los `plans/` son
   documentos históricos de planificación, no contrato vivo, y R5 acotaba la
   actualización documental a `docs/data-model.md`. No se pide cambio.

---

## Output de `./init.sh`

Corrido por el reviewer, no tomado del reporte de Codex. Infra caliente y
verificada antes de correr (para descartar la carrera de arranque conocida y el
salto silencioso de e2e por puerto no publicado):

```
NAMES                    STATUS                       PORTS
pet-tracker-postgres     Up About an hour (healthy)   0.0.0.0:5432->5432/tcp
pet-tracker-localstack   Up 16 minutes (healthy)      0.0.0.0:4566->4566/tcp
docker port pet-tracker-postgres → 5432/tcp -> 0.0.0.0:5432
```

Cola de la salida (exit code 0):

```
Test Suites: 2 passed, 2 total          ← infra
Tests:       14 passed, 14 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 16 passed, 16 of 18 total
Tests:       6 skipped, 245 passed, 251 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 19/25 completadas | 5 pendientes

[exited with code 0]
```

Notas sobre la corrida:

- **Exit code 0.** Cero tests fallando. Las 2 suites / 6 tests omitidos son el
  gate preexistente de AWS real, no un salto silencioso.
- El log incluye un `ERROR` de Nest con violación de FK
  `pet_users_user_id_users_id_fk` (`Key (user_id)=... is not present in table "users"`).
  **No es una regresión de esta feature y no falló ningún test**: es la carrera
  de datos de test ya registrada en el histórico del proyecto, ajena al peso (la
  FK es de `user_id`, no de `current_weight_kg`). Queda anotada por transparencia.
- El typecheck verde es parte sustantiva de la verificación aquí: la guarda
  `@ts-expect-error` de `update-pet.use-case.spec.ts` **solo pasa si
  `PetFieldChanges` realmente perdió `currentWeightKg`** — si el campo volviera,
  la directiva quedaría sin usar y el typecheck fallaría.

---

## Veredicto

**APROBADO.** Los 6 requisitos están implementados, probados y trazados; C2-C7
se cumplen; `init.sh` corrido por el reviewer termina en 0 sin regresiones. El
punto crítico (R6, contrato de lectura intacto) está verificado por diff vacío
contra `afc522e`, y el punto que falló en #19 (historial test-primero) está
resuelto con separación limpia entre commits de test y de implementación.
