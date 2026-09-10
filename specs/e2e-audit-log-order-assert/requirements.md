---
feature: "e2e-audit-log-order-assert"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[e2e-audit-log-order-assert]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #76 (`description` + los 4 `acceptance_criteria`).
> Todas las rutas de esta spec son relativas a `backend-pet-tracker/` salvo
> que se indique lo contrario. Las líneas citadas son las del commit base
> `5666b85` (`origin/main` tras #117, 2026-09-10); si el archivo se movió,
> manda el símbolo, no el número.

## Contexto — el fallo exacto

`test/health-vaccines.e2e-spec.ts:493-505` (describe `R12: auditoria de
mutaciones` de #14, `it 'registra create/update/delete y no audita PATCH
vacio'`) hace:

```ts
const rows = await db
  .select()
  .from(auditLog)
  .where(and(eq(auditLog.entity, 'vaccine'), eq(auditLog.entityId, id)));
expect(rows.map((row) => row.action)).toEqual([
  'vaccine.create',
  'vaccine.update',
  'vaccine.delete',
]);
expect(rows[1].meta).toEqual({ petId: pet.id, fields: ['name', 'notes'] });
```

Sin `ORDER BY`, el orden de un `SELECT` en Postgres **no está definido**:
depende del plan (seq scan sobre el heap o index scan por
`audit_log_entity_idx`) y de dónde cayó físicamente cada fila. En una corrida
aislada las tres filas se insertan seguidas y salen en orden de inserción; con
la suite entera, el heap de `audit_log` tiene huecos de filas borradas por
suites anteriores y las inserciones nuevas los rellenan fuera de orden. Así
cayó `init.sh` en `main` `9358cc7` el 2026-09-08 (15/15 verde aislada, rojo en
la suite completa). El test lleva pasando por suerte desde #14.

Hechos verificados en el árbol (no supuestos):

- `src/db/schema/audit-log.schema.ts:17-35`: la tabla `audit_log` tiene
  `id: bigint generatedAlwaysAsIdentity` (línea 20-22) y
  `at: timestamp with time zone NOT NULL DEFAULT now()` (línea 29).
  **No** existe `createdAt` ni un id uuidv7: la columna cronológica es `at`
  y el desempate es `id` (secuencia de identidad, monótona en orden de
  asignación).
- `src/audit/audit-log.drizzle.repository.ts:12-20` (`record()`) no fija ni
  `id` ni `at`: los dos los asigna la base en el `INSERT`. Cada uno de los
  tres pasos del test (POST, PATCH, DELETE) es una petición HTTP distinta, es
  decir, una transacción distinta, así que `at` (= `now()` de la transacción)
  es estrictamente creciente entre las tres filas y `id` también.
- `drizzle-orm` ya exporta `asc` y el backend ya lo usa
  (`src/modules/health/infrastructure/repositories/vaccine.drizzle.repository.ts:2`,
  `.../geofences/infrastructure/repositories/geofence.drizzle.repository.ts:2`).
  El único `orderBy` de `test/` es `test/devices.e2e-spec.ts:192`.

## Requisitos funcionales

### Bloque A — la consulta se ordena

- **R1**: WHEN el `it` `'registra create/update/delete y no audita PATCH
  vacio'` del describe `R12: auditoria de mutaciones` de
  `test/health-vaccines.e2e-spec.ts` consulta `audit_log` para la vacuna
  recién mutada, THE SYSTEM SHALL construir la consulta con
  `.orderBy(asc(auditLog.at), asc(auditLog.id))` a continuación del
  `.where(...)` existente — `at` da el orden cronológico real y `id` desempata
  dos filas que compartieran `at` —, importando `asc` desde `'drizzle-orm'`
  en la línea de import ya existente
  (`import { and, eq, inArray } from 'drizzle-orm';` → `import { and, asc, eq,
  inArray } from 'drizzle-orm';`). WHILE la consulta lleva ese `orderBy`,
  las dos aserciones que la siguen (`rows.map(action)` igual a
  `['vaccine.create', 'vaccine.update', 'vaccine.delete']` y `rows[1].meta`
  igual a `{ petId, fields: ['name', 'notes'] }`) SHALL conservarse **tal
  cual**: con el orden garantizado, el índice `1` es legítimamente el
  `update`. El `it` SHALL renombrarse a
  `'registra create/update/delete en orden cronologico y no audita PATCH
  vacio (e2e-audit-log-order-assert #76: R1,R2)'` para que el test nombre
  esta feature (CHECKPOINTS C4); el `describe` `R12: ...` de #14 no cambia.

  - Test: ese mismo `it`, verde con
    `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`. Es el
    único test de esta feature; no se crea ningún archivo de test nuevo.

### Bloque B — el candado se demuestra vivo (verificación, C4 vía (b))

- **R2**: Requisito **de verificación** (CHECKPOINTS C4, vía **(b)**,
  declarado aquí antes del handoff): no existe un rojo reproducible para un
  test que pasa por suerte — el defecto vive en el propio test, no hay código
  de producción que mutar y forzar el orden físico del heap exigiría borrar
  filas y pasar `VACUUM` dentro del test. En su lugar, IF la consulta de R1 se
  ejecuta con el orden invertido —`.orderBy(desc(auditLog.at),
  desc(auditLog.id))`, `desc` también de `'drizzle-orm'`— THEN el `it` SHALL
  fallar **por su aserción** `expect(rows.map((row) => row.action)).toEqual(
  [...])` (recibido `['vaccine.delete', 'vaccine.update', 'vaccine.create']`),
  no por `ReferenceError` ni por timeout. Esa corrida es la evidencia que
  sustituye al commit rojo: la mutación **no se versiona** (se aplica, se
  ejecuta el archivo, se captura la salida, se revierte con `git checkout --
  test/health-vaccines.e2e-spec.ts`). Codex la registra en
  `progress/impl_e2e-audit-log-order-assert.md` (raíz del repo) y el
  `reviewer` la reproduce él mismo y la deja en
  `progress/review_e2e-audit-log-order-assert.md`.

  - Test: el `it` de R1 en rojo por aserción con el orden invertido, y verde
    con el orden de R1. Evidencia: los dos extractos de salida de jest en el
    reporte de implementación y en el de revisión.

### Bloque C — el patrón no se repite en otro sitio

- **R3**: Requisito **de verificación**. El barrido de `test/*.e2e-spec.ts`
  y `src/**/*.spec.ts` hecho para esta spec ([[design]] §Barrido) encontró
  **una sola** aserción ordenada sobre un `select` sin `orderBy`: la de R1.
  THE SYSTEM SHALL dejar intacto todo otro archivo bajo `backend-pet-tracker/`:
  `git diff --name-only 5666b85...HEAD -- backend-pet-tracker/` SHALL listar
  exactamente `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`. IF al
  implementar aparece en `HEAD` algún `db.select()` sin `orderBy` que no
  estuviera en `5666b85` (delta contra el commit base, no recuento absoluto)
  THEN Codex SHALL clasificarlo con los criterios de [[design]] §Barrido en
  `progress/impl_e2e-audit-log-order-assert.md` y **parar** si resulta
  order-dependent, en vez de arreglarlo fuera de spec. El reporte de
  implementación SHALL contener la sección `## Barrido (R3)` con el resultado
  del comando `grep -n "orderBy" test/*.e2e-spec.ts` (debe listar
  `devices.e2e-spec.ts` y `health-vaccines.e2e-spec.ts`, ninguno más salvo
  delta declarado) y la confirmación del `git diff --name-only`.

  - Test: sin test nuevo — `git diff --name-only 5666b85...HEAD --
    backend-pet-tracker/` y la sección `## Barrido (R3)` del reporte. El
    reviewer repite los dos comandos.

### Bloque D — la suite entera es estable

- **R4**: Requisito **de verificación**. WHEN el `reviewer` ejecuta la suite
  e2e completa (`pnpm -C backend-pet-tracker run test:e2e`, con Docker
  arriba en los puertos `5432` y `4566` de `E2E_REQUIRED_PORTS`) **tres
  veces consecutivas** en el mismo worktree, THE SYSTEM SHALL terminar las
  tres en verde con el **mismo** número de tests pasados (consistencia
  interna entre corridas; no se congela el total). Precondiciones que el
  reviewer SHALL comprobar y anotar antes de la primera corrida:
  `pgrep -af 'init\.sh'` y `pgrep -af 'test:e2e'` sin resultados (los
  worktrees comparten el Postgres de docker y dos suites a la vez dan rojos
  falsos, 2026-09-06). Tras las tres corridas, el gate estándar se cierra con
  **una** corrida de `env -u FORCE_COLOR bash ./init.sh` desde la raíz:
  `FORCE_COLOR` rompe la comparación de `init.sh:127-148` (bug #75, abierto)
  y aborta con «Mas de 1 feature en in_progress (1)» aunque haya una sola.
  Codex, por su parte, SHALL correr la suite completa al menos **una** vez y
  registrar la línea `Tests: ... passed` en el reporte de implementación.

  - Test: sin test nuevo — las tres líneas `Tests: N passed, N total` (mismo
    `N`) y la línea de cierre de `init.sh` en
    `progress/review_e2e-audit-log-order-assert.md`.

## Fuera de alcance

- **Ordenar listados de la API** (`GET .../geofences`, `.../reminders`,
  etc.) y sus aserciones `expect(body).toEqual([...])`: el orden ahí es un
  contrato del repositorio de producción (los repositorios ya usan `asc`),
  no del `db.select()` del test. Causa distinta, sitio distinto, feature
  distinta si alguna vez falla.
- **Añadir `orderBy` a los `select` multi-fila que ya son order-safe**
  (guardados por `toHaveLength(0|1)`, `.find()`, `.every()`, `.filter()`,
  `expect.arrayContaining` o conteo `before.length`; lista en [[design]]
  §Barrido). No dependen del orden; tocarlos es ruido en el diff.
- **Comparar como conjunto** (`expect.arrayContaining`) en vez de ordenar:
  el R12 de #14 afirma justamente la secuencia create→update→delete; un
  conjunto la perdería. Ver [[design]] D2.
- **Cambios en producción**: ni `AuditLogDrizzleRepository`, ni el schema de
  `audit_log` (índice sobre `at`, id uuidv7), ni migraciones. Cero archivos
  bajo `src/`.
- **Regla de lint** que prohíba `select` sin `orderBy` en tests. Un solo
  caso en todo `test/` no justifica una regla.
- **Arreglar #75** (`FORCE_COLOR` en `init.sh`): aquí solo se documenta el
  rodeo `env -u FORCE_COLOR`.
- **Reproducir el orden físico** del heap (huecos + `VACUUM`) dentro del
  test para tener un rojo «real». Ver R2.
- **`src/**/*.spec.ts`**: ninguno hace `db.select()` (verificado con
  `grep -rln "\.select(" src --include=*.spec.ts` → vacío en `5666b85`).
  Nada que barrer ahí.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Excepción C4 de R2 (sin commit rojo; evidencia por mutación no
      versionada) aceptada por humano con esta misma firma
