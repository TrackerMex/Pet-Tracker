---
feature: "geofence-alert-consistency"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, backend]
---

# Tareas — [[geofence-alert-consistency]] (#145)

> **Disciplina TDD.** Por requisito: **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, **nunca implementación y test juntos**.
> La única producción que viaja en un rojo es la mutación versionada **MV** de
> R5 (requisito de verificación, [[design]] D10).
>
> **Anclas.** Por contenido (`grep -n`), nunca por número de línea.
>
> **Títulos.** Todo `describe` nuevo lleva el prefijo `#145 R<n>:`, y el padre
> `#145:`. Títulos y cuerpos de los tests: **literales** de [[requirements]].
>
> **Mensajes** en inglés:
>
> - `test(geofences): … (Rn)` el rojo;
> - `fix(geofences): … (Rn)` el verde;
> - `refactor(geofences): …`;
> - `docs(data-model): …`.
>
> **Trazabilidad.** Se rellena **una sola vez**, en el commit final
> `docs(geofences): fill #145 traceability`, después del último commit de
> código ([[traceability]]).
>
> Rutas relativas a la raíz del repo salvo que se diga «desde
> `backend-pet-tracker/`». `<e2e>` abrevia, en todo este fichero, este comando:
>
> ```bash
> pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json test/geofences.e2e-spec.ts; echo "exit=$?"
> ```

## Antes de empezar

- [ ] Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
      `feature/145-geofence-alert-consistency`, y
      `git merge-base --is-ancestor a8c8e449 HEAD; echo "exit=$?"` → `exit=0`.
- [ ] `pgrep -af 'init\.sh|test:e2e|jest-e2e'` no lista ningún proceso
      (aparte de la propia línea de `pgrep`). Si lista alguno, **parar y
      avisar al humano**: otra sesión comparte Postgres y LocalStack.
- [ ] **No lanzar `./init.sh` ni las suites e2e de LocalStack**
      (`alerts-engine`, `alerts-center-notifier`, ingestión…). Las corre el
      leader al cierre. Esta feature se verifica con `<e2e>`, que solo usa
      Postgres (la BD del worktree, `pet_tracker_wt`), y con jest unit, tsc y
      lint.
- [ ] Medir y **anotar en el reporte** las bases, sin pipe:
  - `<e2e>`: **1 suite / 20 tests**, `exit=0` en `a8c8e449`;
  - `pnpm -C backend-pet-tracker test; echo "exit=$?"`: anotar suites y tests.
      Esta feature no cambia ninguno (+0).

      Los deltas de esta spec van **sobre la base que midas**.
- [ ] Si `<e2e>` falla en la base sin llegar a correr tests (por ejemplo
      `ECONNREFUSED` a Postgres, o una relación inexistente porque falta una
      migración), **parar y pedir al humano**. No levantar contenedores, no
      migrar y no tocar `.env`.
- [ ] Sin dependencias nuevas, sin migraciones y sin tocar ficheros fuera de
      [[design]] §Archivos afectados.
- [ ] Sin comentarios nuevos en producción, salvo los cuatro que reescribe el
      refactor.
- [ ] `pnpm -C backend-pet-tracker run lint` lleva `--fix` y reescribe el
      formato. Correrlo **antes** de cada commit y commitear el formato con su
      paso, para que no quede un diff suelto al final.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → verde común → R3 → R4 → R5`, después el refactor de comentarios, el
de `docs/` y la trazabilidad.

- Cada `it` crea lo que asevera: su owner y su mascota (`seedUser`,
  `createPetViaApi`), sus zonas por la API (`createGeofenceViaApi`) y sus
  alertas y su estado en la BD (`seedAlert`, `seedState`). Ningún rojo
  depende de un nodo que cree un requisito posterior.
- El lint marca como error una variable sin usar, así que **cada helper entra
  en el commit rojo que lo usa por primera vez**:

  | Commit rojo | Entra | Dónde, dentro del `describe` padre `#145:` |
  |---|---|---|
  | R1 | import de `alertEvents`, `HISTORY_CLOSED_AT`, `seedAlert`, `deleteZone` | al principio, en ese orden |
  | R2 | `alertById` | justo después de `seedAlert` |
  | R3 | `SEEDED_STATE` | **antes** de `HISTORY_CLOSED_AT` |
  | R3 | `seedState`, `storedState` | después de `alertById` |
  | R3 | `patchZone` | después de `deleteZone` |

  Al cierre, el orden es el de [[requirements]] §Arnés: `SEEDED_STATE`,
  `HISTORY_CLOSED_AT`, `seedAlert`, `alertById`, `seedState`, `storedState`,
  `deleteZone`, `patchZone`, y después los cinco `describe` hijos en orden
  R1-R5.
- El verde de R3 cambia la firma del puerto. Puerto, repositorio y caso de
  uso van **en el mismo commit**, o `tsc` se rompe. ts-jest no lo vería, porque
  usa `isolatedModules` (P10).
- Rojos esperados de los `it` nuevos: todos **por aserción**. Si alguno falla
  por `ReferenceError`, por `TypeError`, por timeout o por un error de
  consulta en el propio test, el paso está mal hecho: parar y revisar contra
  esta lista.

---

## R1 — El DELETE de la segunda zona con alerta no cerrada responde 204

- [ ] **(1) Commit rojo** `test(geofences): reproduce the 500 on deleting a second zone with an unclosed alert (R1)`.
  Solo `backend-pet-tracker/test/geofences.e2e-spec.ts`:
  - justo después de `import { DRIZZLE } from '@/db/drizzle.constants';`,
    añadir `import { alertEvents } from '@/db/schema/alerts.schema';`;
  - dentro de `describe('Geofences CRUD (e2e)'`, **después** del cierre de
    `describe('R15: DELETE sobre id inexistente/malformado/ajeno responde 404 sin auditar'`,
    abrir `describe('#145: consistencia entre geocercas y alertas', () => {`
    con `HISTORY_CLOSED_AT`, `seedAlert` y `deleteZone`, y el `describe` de
    R1, todo literal de [[requirements]].

  Rojo esperado: **1 de 21**, el `it` de R1, por `toEqual` (recibe
  `[204, 500]`). La salida puede mostrar el error que registra la app (un
  `DrizzleQueryError` del `DELETE`, con causa `23505` en
  `alert_events_open_anti_spam_idx`): **es el defecto**, no un fallo del test.
- [ ] (2) Verde: compartido con R2 (abajo).

## R2 — El DELETE cierra las alertas no cerradas de la zona

- [ ] **(1) Commit rojo** `test(geofences): expect deleting a zone to close its unclosed alerts (R2)`.
  Solo el e2e: `alertById` justo después de `seedAlert`, y el `describe` de
  R2 después del de R1, literal.
  Rojo esperado: **3 de 23**: R1 (sigue, `toEqual`) y las 2 filas de R2
  (`toMatchObject`).
- [ ] **(2) Commit verde (R1 + R2)** `fix(geofences): close a zone's unclosed alerts before deleting it (R1, R2)`.
  Solo `backend-pet-tracker/src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts`:
  - `import { and, asc, count, eq } from 'drizzle-orm';` →
    `import { and, asc, count, eq, ne } from 'drizzle-orm';`;
  - justo después de `import { DRIZZLE } from '@/db/drizzle.constants';`,
    añadir `import { alertEvents } from '@/db/schema/alerts.schema';`;
  - el cuerpo de `delete`:

    ```ts
      async delete(id: string): Promise<void> {
        await this.db.transaction(async (tx) => {
          await closeOpenAlerts(tx, id, new Date());
          await tx.delete(geofences).where(eq(geofences.id, id));
        });
      }
    ```

  - entre el cierre de la clase y `function toDomain(row: GeofenceRow): Geofence {`:

    ```ts
    function closeOpenAlerts(
      db: Pick<NodePgDatabase, 'update'>,
      geofenceId: string,
      closedAt: Date,
    ) {
      return db
        .update(alertEvents)
        .set({ status: 'closed', closedAt })
        .where(
          and(
            eq(alertEvents.geofenceId, geofenceId),
            ne(alertEvents.status, 'closed'),
          ),
        );
    }
    ```

  Verde: `<e2e>` → **23 / 23**, `exit=0`.
- [ ] **(3) Refactor**: ninguno aquí. Los comentarios caducados van en el
      commit `refactor` final.

## R3 — Cambiar `active` reinicia y cierra

- [ ] **(1) Commit rojo** `test(geofences): expect toggling active to reset the zone evaluation (R3)`.
  Solo el e2e:
  - `SEEDED_STATE` al principio del `describe` padre (antes de
    `HISTORY_CLOSED_AT`);
  - `seedState` y `storedState` después de `alertById`;
  - `patchZone` después de `deleteZone`;
  - el `describe` de R3 después del de R2, literal.

  Rojo esperado: **2 de 25**, los 2 `it` de R3, por `toMatchObject` del
  cuerpo (`state.value` llega `'outside'`).
- [ ] **(2) Commit verde** `fix(geofences): reset the evaluation and close alerts when active changes (R3)`.
  Tres ficheros, en el mismo commit:
  - **Puerto** `src/modules/geofences/domain/repositories/geofence.repository.ts`:
    `update(id: string, changes: GeofenceFieldChanges): Promise<Geofence>;` →

    ```ts
      update(
        id: string,
        changes: GeofenceFieldChanges,
        options: { resetEvaluation: boolean },
      ): Promise<Geofence>;
    ```

  - **Repositorio**. `update` queda así, con la firma de tres parámetros, la
    constante `now` y la transacción:

    ```ts
      async update(
        id: string,
        changes: GeofenceFieldChanges,
        options: { resetEvaluation: boolean },
      ): Promise<Geofence> {
        const { centerLat, centerLng, radiusM, ...columns } = changes;
        const geometryChanges =
          centerLat !== undefined ||
          centerLng !== undefined ||
          radiusM !== undefined;

        // centerLat/centerLng/radiusM comparten el jsonb `geometry`: si el
        // caller toca cualquiera, se lee el geometry actual para mergear los
        // campos ausentes — el resto de la fila no necesita este paso extra.
        const geometry = geometryChanges
          ? await this.mergedGeometry(id, { centerLat, centerLng, radiusM })
          : undefined;

        const now = new Date();

        try {
          return await this.db.transaction(async (tx) => {
            const [row] = await tx
              .update(geofences)
              .set({
                ...columns,
                ...(geometry ? { geometry } : {}),
                ...(options.resetEvaluation
                  ? { geofenceState: { state: 'unknown', updatedAt: null } }
                  : {}),
                updatedAt: now,
              })
              .where(eq(geofences.id, id))
              .returning();

            if (options.resetEvaluation) {
              await closeOpenAlerts(tx, id, now);
            }

            return toDomain(row);
          });
        } catch (error) {
          throw translateUniqueViolation(error, undefined, columns.name);
        }
      }
    ```

    El comentario de `geometry` es el que ya existe. No se añade ninguno.
  - **Caso de uso** `src/modules/geofences/application/use-cases/update-geofence.use-case.ts`:
    `const updated = await this.geofences.update(geofenceId, dto);` →

    ```ts
        const updated = await this.geofences.update(geofenceId, dto, {
          resetEvaluation: resetsEvaluation(existing, dto),
        });
    ```

    y al final del fichero, después del cierre de la clase:

    ```ts
    function resetsEvaluation(existing: Geofence, dto: UpdateGeofenceDto): boolean {
      return (['active'] as const).some(
        (key) => dto[key] !== undefined && dto[key] !== existing[key],
      );
    }
    ```

    `Geofence` y `UpdateGeofenceDto` ya están importados.

  Verde: `<e2e>` → **25 / 25**, y
  `pnpm -C backend-pet-tracker exec tsc --noEmit; echo "exit=$?"` → `exit=0`.
- [ ] **(3) Refactor**: ninguno.

## R4 — Cambiar la geometría reinicia y cierra

- [ ] **(1) Commit rojo** `test(geofences): expect a geometry change to reset the zone evaluation (R4)`.
  Solo el e2e: el `describe` de R4 después del de R3, literal.
  Rojo esperado: **3 de 28**, las 3 filas de R4, por `toMatchObject` del
  cuerpo.
- [ ] **(2) Commit verde** `fix(geofences): reset the evaluation and close alerts when the geometry changes (R4)`.
  Solo el caso de uso: `(['active'] as const)` →
  `(['active', 'centerLat', 'centerLng', 'radiusM'] as const)`.
  Verde: `<e2e>` → **28 / 28**. **Anotar el hash de este commit**: el verde
  de R5 se compara contra él.
- [ ] **(3) Refactor**: ninguno.

## R5 — Renombrar conserva la evaluación (requisito de verificación)

- [ ] **(1) Commit rojo** `test(geofences): lock that a rename keeps the zone evaluation (R5)`.
  - El e2e: el `describe` de R5 después del de R4, literal.
  - **MV**, versionada en este commit, en el caso de uso:
    `(['active', 'centerLat', 'centerLng', 'radiusM'] as const)` →
    `(['name', 'active', 'centerLat', 'centerLng', 'radiusM'] as const)`.
    `lint --fix` la reparte en tres líneas (`return (` / la lista / `).some(…)`).
    Se commitea así.

  Rojo esperado: **2 de 30**, las 2 filas de R5, por `toMatchObject` del
  cuerpo (`state.value` llega `'unknown'`).
- [ ] **(2) Commit verde** `fix(geofences): revert the R5 probe mutation, rename keeps the evaluation (R5)`.
  Devolver el caso de uso exactamente al verde de R4. Se puede reescribir a
  mano, o con `git show <hash verde R4>:backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts > backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts`,
  que no toca el índice. **No** usar `git checkout <hash> -- <ruta>`.
  Comprobar:
  - `git diff <hash verde R4> -- backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts; echo "exit=$?"`
    → sin salida y `exit=0`;
  - `<e2e>` → **30 / 30**.
- [ ] **(3) Refactor**: el commit siguiente.

---

## Refactor — comentarios que #145 deja falsos

- [ ] **Commit** `refactor(geofences): update the comments that said nothing references geofences`.
  Solo comentarios, sin una línea de código. Cuatro sustituciones literales,
  sin acentos (como el resto de comentarios de `src/`):
  1. Puerto, encima de `update(`:
     `/** Actualiza solo las claves presentes en \`changes\` y refresca \`updated_at\` (R10). */` →

     ```ts
       /**
        * Actualiza solo las claves presentes en `changes` y refresca `updated_at`
        * (R10). Con `resetEvaluation` (#145), en la misma transaccion devuelve
        * `geofence_state` al default y cierra las alertas no cerradas de la zona.
        */
     ```

  2. Puerto, encima de `delete(`:
     `/** Hard delete (R14): nada referencia todavia a \`geofences\`. */` →
     `/** Hard delete (R14); antes cierra sus alertas no cerradas (#145 R2). */`
  3. `src/modules/geofences/application/use-cases/delete-geofence.use-case.ts`,
     las dos líneas
     ` * DELETE /v1/pets/:petId/geofences/:geofenceId (R14, R15). Hard delete: nada`
     y ` * referencia todavia a \`geofences\`, no hay cascada que disparar.` →

     ```ts
      * DELETE /v1/pets/:petId/geofences/:geofenceId (R14, R15). Hard delete; el
      * repositorio cierra antes las alertas no cerradas de la zona (#145 R2).
     ```

  4. `src/workers/alerts-engine/alerts-engine-store.ts`, el bloque de cinco
     líneas que empieza en `// Puerto propio del worker (D2, mismo criterio D14 de wialon-ingestion-`
     y termina en `// interface (docs/conventions.md §Tokens de inyeccion).` →

     ```ts
     // Puerto propio del worker (D2, mismo criterio D14 de wialon-ingestion-
     // pipeline): el motor es el unico que escribe un geofence_state evaluado.
     // GeofenceRepository (#11) no lo evalua; desde #145 solo lo devuelve al
     // default cuando un PATCH cambia la geometria o `active`. Token junto a la
     // interface (docs/conventions.md §Tokens de inyeccion).
     ```

  Comprobar: `<e2e>` → 30 / 30, tsc y lint `exit=0`, y los greps de
  comentarios de §Cierre.

## Documentación

- [ ] **Commit** `docs(data-model): describe the real anti-spam predicate and the #145 closes`.
  Solo `docs/data-model.md`: las **tres** sustituciones literales de
  [[requirements]] §Entregable de documentación. Cada texto «antes» aparece
  una sola vez en el fichero. Si no aparece, **parar**: alguien lo movió
  desde `a8c8e449`. Comprobar con los greps de esa sección.

---

## Sondas (no se commitean; cada una roja y restaurada con `git diff` vacío)

Las corre Codex **después** del commit de documentación, y las repite el
`reviewer`. Por cada sonda:

1. aplicar la sustitución;
2. correr `<e2e>`;
3. anotar en el reporte cuántos tests caen y cuáles, y con qué aserción;
4. restaurar con `git checkout HEAD -- <ruta>`, y verificar que
   `git status --short` queda vacío.

Lo que se espera de **cada** sonda:

- los rojos de la tabla, **todos por aserción** (`toEqual`, `toMatchObject` o
  `toBeGreaterThanOrEqual`);
- **ningún** `it` de la base en rojo.

Con M1 y M2 la app registra un `DrizzleQueryError` (el `23505`). Es esperado:
el test asevera el 500 que provoca.

`R` = `backend-pet-tracker/src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts`;
`U` = `backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts`.

| Id | Fichero | Sustitución | Rojos esperados (de 30) |
|---|---|---|---|
| M1 | R | borrar la línea `      await closeOpenAlerts(tx, id, new Date());` (en `delete`) | 3: R1 y las 2 filas de R2 |
| M2 | R | en `delete`, mover esa línea **debajo** de `      await tx.delete(geofences).where(eq(geofences.id, id));` | 3: igual que M1 |
| M3 | R | `ne(alertEvents.status, 'closed')` → `eq(alertEvents.status, 'open')` | 4: fila `acked` de R2 y las 3 de R4 |
| M4 | R | todo el `.where(` de `closeOpenAlerts` (de `.where(` a `);`) → `.where(eq(alertEvents.geofenceId, geofenceId));` | 2: las 2 filas de R2 |
| M5 | R | `eq(alertEvents.geofenceId, geofenceId),` → `` eq(alertEvents.petId, sql`(select pet_id from geofences where id = ${geofenceId})`), `` y `import { and, asc, count, eq, ne } from 'drizzle-orm';` → `import { and, asc, count, eq, ne, sql } from 'drizzle-orm';` | 6: las 2 de R2, `desactivar con alerta open…` de R3 y las 3 de R4 |
| M6 | U | quitar `, 'radiusM'` de la lista de claves | 1: fila `radiusM` de R4 |
| M7 | U | quitar `'centerLat', ` de la lista | 1: fila `centerLat` de R4 |
| M8 | U | quitar `'centerLng', ` de la lista | 1: fila `centerLng` de R4 |
| M9 | U | `dto[key] !== undefined && dto[key] !== existing[key]` → `dto[key] !== undefined` | 1: fila `name con la misma geometría y el mismo active que ya tiene` de R5 |
| M10 | U | `dto[key] !== undefined && dto[key] !== existing[key]` → `dto[key] !== undefined && dto[key] !== existing[key] && dto[key] !== true` | 1: `reactivar una zona inactiva…` de R3 |
| M11 | R | borrar las tres líneas `if (options.resetEvaluation) {` / `await closeOpenAlerts(tx, id, now);` / `}` de `update` | 4: `desactivar con alerta open…` de R3 y las 3 de R4 |
| M12 | R | `? { geofenceState: { state: 'unknown', updatedAt: null } }` → `? {}` | 5: los 2 de R3 y las 3 de R4 |
| M13 | R | `.set({ status: 'closed', closedAt })` → `.set({ status: 'closed', closedAt, geofenceId: null })` | 4: `desactivar con alerta open…` de R3 y las 3 de R4 |
| M14 | R | `.set({ status: 'closed', closedAt })` → `.set({ status: 'closed' })` | 6: las 2 de R2, `desactivar con alerta open…` de R3 y las 3 de R4 (`toBeGreaterThanOrEqual`, recibe `0`) |

Las sondas no pasan por lint ni por tsc: ts-jest no comprueba tipos (P10).
MV ya quedó probada en el historial (rojo de R5).

---

## Cierre (Codex, antes de escribir `progress/impl_geofence-alert-consistency.md`)

Todo **sin pipe**, porque el código de salida de un pipe es el del último
comando:

- [ ] `<e2e>` → `exit=0`, **1 suite / 30 tests** (base + 10).
- [ ] `pnpm -C backend-pet-tracker test; echo "exit=$?"` → `exit=0`, **+0
      suites y +0 tests** sobre la base anotada.
- [ ] `pnpm -C backend-pet-tracker exec tsc --noEmit; echo "exit=$?"` y
      `pnpm -C backend-pet-tracker run lint; echo "exit=$?"` → `exit=0`, y
      `git status --short` vacío después (el `--fix` no deja nada suelto).
- [ ] Greps del repositorio (desde `backend-pet-tracker/`, sobre
      `src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts`):

      | `grep -cF` | Resultado |
      |---|---|
      | `"this.db.transaction("` | `2` |
      | `"closeOpenAlerts("` | `3` |
      | `"ne(alertEvents.status, 'closed')"` | `1` |
      | `"geofenceState: { state: 'unknown', updatedAt: null }"` | `1` |
      | `"tx.delete(geofences)"` | `1` |
      | `"this.db.delete(geofences)"` | `0` |
      | `"options: { resetEvaluation: boolean },"` | `1` |

- [ ] Greps del puerto y del caso de uso (desde `backend-pet-tracker/`):

      | `grep -cF` | Fichero | Resultado |
      |---|---|---|
      | `"options: { resetEvaluation: boolean },"` | `src/modules/geofences/domain/repositories/geofence.repository.ts` | `1` |
      | `"resetEvaluation: resetsEvaluation(existing, dto)"` | `src/modules/geofences/application/use-cases/update-geofence.use-case.ts` | `1` |
      | `"['active', 'centerLat', 'centerLng', 'radiusM'] as const"` | ídem | `1` |
      | `"'name'"` | ídem | `0` |

- [ ] Greps de comentarios (desde `backend-pet-tracker/`):
      `grep -rn "referencia todavia" src/modules/geofences` → sin salida;
      `grep -c "se deja intacto" src/workers/alerts-engine/alerts-engine-store.ts` → `0`.
- [ ] Greps de `docs/data-model.md`: los cuatro de [[requirements]]
      §Entregable de documentación (`0`, `1`, `0`, `2`).
- [ ] `git diff --stat origin/main...HEAD -- backend-pet-tracker` →
      exactamente los **seis** ficheros de backend de [[design]] §Archivos
      afectados. Ni `package.json`, ni `pnpm-lock.yaml`, ni `src/db/`, ni
      `src/modules/alerts/`.
- [ ] `git diff --stat <hash del handoff>..HEAD -- docs` → solo
      `docs/data-model.md`.
- [ ] Commit final `docs(geofences): fill #145 traceability` con los hashes
      en [[traceability]]. El reporte lleva las bases, los diez recuentos de
      rojo y verde, las 14 sondas y los recuentos finales.
