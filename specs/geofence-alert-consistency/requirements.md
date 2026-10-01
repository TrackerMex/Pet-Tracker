---
feature: "geofence-alert-consistency"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, backend]
---

# Requisitos — [[geofence-alert-consistency]] (#145)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[traceability]] para la trazabilidad.

> Fuente: `feature_list.json` #145 (description y seis criterios), registrada
> el 2026-10-01 desde `progress/explore_mobile-geofences.md`
> «**R12. Agujeros del backend**». Cada premisa del encargo se verificó contra
> el árbol antes de escribir un requisito (§0). Las que no cuadraban se
> corrigen en §0.2. Cada rojo, cada verde y cada mutación de las tablas se
> **midió** con una sonda del spec_author: una copia del árbol en el
> scratchpad, fuera del repo, contra la BD del worktree. No se supuso ninguno.
> R12.3 se reprodujo **primero** con un e2e rojo, como pedía el encargo.

> Feature **solo backend**, P2.
>
> - **Cero** dependencias, migraciones o cambios de esquema.
> - **Cero** cambios de contrato HTTP: mismos códigos, misma forma del cuerpo
>   y la misma auditoría.
> - **Un** parámetro nuevo en un método de puerto, sin dobles que romper (P9).
> - Tests: **+10 e2e** en un solo fichero y **+0 unit**.

> Base: `a8c8e449` (HEAD de la branch; `origin/main` = `3db47fb0`, ancestro).
> Branch `feature/145-geofence-alert-consistency`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`.
>
> Las rutas son relativas a `backend-pet-tracker/`, salvo las de `docs/`,
> `specs/` y `progress/`. **Ninguna cita usa número de línea**: toda ancla es
> un texto literal que se encuentra con `grep -n`.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `a8c8e449`) |
|---|---|---|
| P1 | El índice anti-spam es parcial sobre las alertas **no cerradas** | En `src/db/schema/alerts.schema.ts`, `uniqueIndex('alert_events_open_anti_spam_idx')` cubre `table.petId`, `table.type` y `` sql`coalesce(${table.geofenceId}, '00000000-0000-0000-0000-000000000000'::uuid)` ``, con `` .where(sql`${table.status} <> 'closed'`) ``. El comentario dice «#13 (D1) amplio el predicado de `status = 'open'` a». `src/db/migrations/0007_narrow_whirlwind.sql` lo creó con `WHERE "alert_events"."status" = 'open'`, y `0008_stormy_moira_mactaggert.sql` lo recrea con `<> 'closed'` |
| P2 | `alert_events.geofence_id` hace `SET NULL` al borrar la zona, y `pet_id` hace cascada | En el mismo fichero: `onDelete: 'set null',` en `geofenceId` y `onDelete: 'cascade'` en `petId`. `check('alert_events_status_check'` admite `('open', 'acked', 'closed')`. «No cerrada» = `open` o `acked` |
| P3 | El DELETE es una sentencia suelta, sin transacción ni tratamiento de errores | `src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts`: `await this.db.delete(geofences).where(eq(geofences.id, id));`. Dos comentarios lo justifican con algo falso desde #12. En el puerto: `/** Hard delete (R14): nada referencia todavia a \`geofences\`. */`. En `delete-geofence.use-case.ts`: «Hard delete: nada» + «referencia todavia a `geofences`, no hay cascada que disparar.» |
| P4 | El PATCH no toca `geofence_state` | En el mismo repositorio, `async update(id: string, changes: GeofenceFieldChanges): Promise<Geofence> {` escribe `...columns`, `geometry` y `updatedAt: new Date()`, y nada más. En `update-geofence.use-case.ts` se llama `const updated = await this.geofences.update(geofenceId, dto);` **después** del no-op `if (fieldsPresent.length === 0) {` (R13 de #11) |
| P5 | El motor solo evalúa zonas activas | `src/workers/alerts-engine/alerts-engine.drizzle.store.ts` filtra con `.where(and(eq(geofences.petId, petId), eq(geofences.active, true)));`. Una zona desactivada no se vuelve a evaluar, así que nadie cierra su alerta |
| P6 | El motor solo cierra una `geofence_exit` por su `geofence_id` exacto | `alerts-engine-consumer.service.ts` cierra con `geofenceId: geofence.id,` y `closedAt: new Date(position.ts),`, y encola `kind: 'alert_resolved'`. `closeOpenAlert` del store filtra con `eq(alertEvents.geofenceId, input.geofenceId)` (o `isNull` si es `null`) y `inArray(alertEvents.status, ['open', 'acked'])`. Una `geofence_exit` con `geofence_id` nulo no la cierra nadie |
| P7 | Desde `unknown`, la primera evaluación es silenciosa | `src/pipeline/geofence-eval.ts`: `// R18: unknown nunca emite enter/exit — primera evaluacion silenciosa.`. Lo fija `describe('R18: unknown transiciona silenciosamente (event null) a inside/outside'` de `geofence-eval.spec.ts`. El consumidor solo descarta una posición si `previousUpdatedAtMs !== null &&` y la posición no es más nueva. Con `updatedAt: null`, la siguiente posición se evalúa |
| P8 | El default de `geofence_state` es `{state: 'unknown', updatedAt: null}`, y la API lo expone | `src/db/schema/geofences.schema.ts`: `.default({ state: 'unknown', updatedAt: null }),`. La respuesta lleva `state` (`GEOFENCE_KEYS` de `test/geofences.e2e-spec.ts`) con forma `{ value, updatedAt }` |
| P9 | `GeofenceRepository` no tiene dobles | `git grep -n "GeofenceRepository\|GEOFENCE_REPOSITORY" -- backend-pet-tracker` da solo el puerto, los cinco casos de uso, `geofences.module.ts`, el repositorio Drizzle y un comentario de `src/workers/alerts-engine/alerts-engine-store.ts`. `find src/modules/geofences -name '*.spec.ts'` sale vacío. El único llamador de `update` es `UpdateGeofenceUseCase`. Un parámetro nuevo y obligatorio no rompe ningún doble |
| P10 | ts-jest no comprueba tipos | `tsconfig.json` tiene `"isolatedModules": true`. El candado de tipos es `pnpm exec tsc --noEmit` ([[tasks]] §Cierre) |
| P11 | El e2e de geocercas solo usa Postgres, con helpers reutilizables | `test/geofences.e2e-spec.ts` (`describe('Geofences CRUD (e2e)'`) usa la BD del worktree (`.env` → `localhost:5433/pet_tracker_wt`) y no está entre las suites de LocalStack. Helpers: `seedUser(label)`, `createPetViaApi(owner, name)` (siembra collar y suscripción), `createGeofenceViaApi(user, petId, overrides)` y `api()`. `createGeofenceViaApi` usa `validBody`: `centerLat: 19.4326`, `centerLng: -99.1332`, `radiusM: 100` y un nombre aleatorio. También están `RUN_ID`, `interface TestUser` y `db`. `afterAll` borra las mascotas, y eso cascada a `alert_events` por `pet_id` (P2). No hace falta limpieza nueva |
| P12 | Lint con `--fix` y variables sin usar como error | `"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"`. Cada helper de test entra en el commit que lo usa por primera vez ([[tasks]]) |
| P13 | Base del e2e de geocercas | `pnpm run test:e2e -- geofences`: **1 suite / 20 tests**, exit 0. Medido en la copia del scratchpad sobre `a8c8e449`. Codex vuelve a medir la base al arrancar, y los deltas de esta spec van sobre lo que mida |

### §0.2 Premisas corregidas o precisadas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | R12.3 «INFERIDO, sin reproducir» | **Reproducido.** En `a8c8e449`, DELETE de la zona A (alerta `open`) da 204 y DELETE de la zona B (alerta `acked`) da **500**. El `cause` es `23505` en `alert_events_open_anti_spam_idx`, la zona B **sobrevive** y no se audita | Es el e2e de R1: en la base falla **por aserción**, `[204, 500]` en vez de `[204, 204]` |
| C2 | «si ya hay otra no cerrada con geofence_id nulo» | Hay que precisarlo: la colisión pide otra **`geofence_exit`** no cerrada con `geofence_id` nulo **en la misma mascota**. `battery_low` cae en el mismo hueco `nil` pero tiene otro `type`, así que **no** choca (sonda: `battery_low` abierta + DELETE de una zona con salida abierta da 204). El primer DELETE de una mascota nunca choca, y por eso R14 de #11 (borra sin alertas) no lo vio | Sonda del spec_author |
| C3 | `files_affected`: `src/modules/geofences/`, `src/modules/alerts/`, `test/` y `docs/data-model.md` | `src/modules/alerts/` **no** cambia: el cierre vive en el repositorio de geocercas (D6). Falta `src/workers/alerts-engine/alerts-engine-store.ts`, que solo cambia un comentario que #145 deja falso. De `test/` cambia un solo fichero | [[design]] §Archivos afectados |
| C4 | Criterio 1: «la siguiente posición no genera una alerta espuria» | Se observa por el **reinicio a `{unknown, null}`** (R3, R4). Que la primera evaluación desde `unknown` es silenciosa ya lo fija R18 del motor (P7). No hay e2e del motor en esta spec: es una suite de LocalStack (D9) | [[design]] D9 |
| C5 | Criterio 2: «desactivar una zona cierra su alerta **abierta**» | Cierra las **no cerradas** (`open` y `acked`), el mismo «activa» del índice (P1) y del motor (P6). **Reactivar** también reinicia (D2) | — |
| C6 | Criterio 4: «ninguna alerta queda abierta y huérfana tras borrar su zona» | Vale para los DELETE desde #145. Las huérfanas que ya existan en la BD (de DELETE anteriores) **no** se limpian (D7). [[design]] D7 da una consulta de solo lectura para contarlas | [[design]] D7 |
| C7 | «`docs/data-model.md` sigue diciendo `WHERE status='open'`» | Confirmado, y hay más texto caducado. La fila `geofences` dice «(no `GeofenceRepository`, que se deja intacto)», que #145 hace falso. También `alerts-engine-store.ts` («GeofenceRepository (#11) se deja intacto» … «no expone forma alguna de tocar geofence_state») y los dos comentarios de P3. Los cuatro comentarios se corrigen en un commit `refactor` | §Entregable de documentación |
| C8 | (implícito) borrar la **mascota** tiene el mismo agujero | **Refutado.** `pet_id` hace cascada (P2): DELETE de una mascota con dos zonas con alertas no cerradas y una de batería da 204 y deja 0 filas en `alert_events` (sonda) | §Fuera de alcance |

### §0.3 Agujeros R12 del explorer: veredicto medido

| Agujero | Veredicto | Medida (sonda en `a8c8e449`) | Lo cierra |
|---|---|---|---|
| R12.1 PATCH de geometría no reinicia `geofence_state` | **Confirmado** | Estado sembrado `outside`. `PATCH {radiusM: 500}` da 200, y el estado sigue `outside` con su `updatedAt` viejo | R4 |
| R12.2 `active: false` no cierra la alerta | **Confirmado** | `PATCH {active: false}` da 200, la alerta sigue `open` y el estado no cambia. La zona deja de evaluarse (P5) | R3 |
| R12.3 DELETE de la segunda zona da 23505 y 500 | **Confirmado y reproducido** (C1) | `[204, 500]`, `23505` en `alert_events_open_anti_spam_idx`, la zona B sobrevive | R1, R2 |
| R12.4 huérfanas que nadie cierra | **Confirmado** | Tras un DELETE queda `{geofence_id: null, status: 'open'}` para siempre (P6) | R2 |
| `docs/data-model.md` con el predicado viejo | **Confirmado** (C7) | `grep -c "WHERE status='open'" docs/data-model.md` → `1` | §Entregable de documentación |

---

## Qué firma el humano al aprobar esta spec (decisiones para el gate humano)

Firmar sin editar = aceptar **D1-D11** de [[design]] tal cual. Esta tabla
lista solo las decisiones que fijan comportamiento o alcance. D6 (dónde vive
el cierre) es técnica, y D9 y D10 son de arnés de test.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **DELETE: cerrar y después borrar, en una transacción** | Antes del `DELETE` de la zona se cierran sus alertas no cerradas. El `SET NULL` solo alcanza filas `closed`, que el índice no mira, y el 500 desaparece. Se descartan: borrar las alertas (se pierde el historial del centro de alertas), mapear el `23505` a un 409 (la zona no se podría borrar nunca) y cambiar el índice (migración, y dejaría huérfanas abiertas) |
| **D2** | **Cambiar `active`, en los dos sentidos, reinicia** | Desactivar o reactivar devuelve `geofence_state` a `{unknown, null}` y cierra las alertas no cerradas de la zona. Esas alertas **conservan su `geofence_id`**: la zona sigue existiendo y el historial la sigue nombrando. Reactivar parte de cero, porque el estado guardado es de cuando se dejó de evaluar |
| **D3** | **Cambiar la geometría reinicia igual** | Basta un cambio en `centerLat`, `centerLng` o `radiusM`. Criterio: «editar la zona = zona nueva». La primera posición después del cambio sitúa a la mascota sin avisar (P7). Así no hay salida espuria al mover o encoger la zona, ni «regresó» espurio al agrandarla |
| **D4** | **«Cambiar» es un valor distinto del guardado, no una clave presente** | Si un `PATCH` reenvía los valores que la zona ya tiene (el editor de #146 puede mandar el formulario entero), no reinicia nada. `name` nunca reinicia. El no-op de `{}` (R13 de #11) no cambia |
| **D5** | **Cierre silencioso** | Ni push, ni `alert_resolved`, ni mensaje en SQS. El cambio lo hizo el propio owner, y un «regresó» falso sería peor. El centro de alertas la muestra `closed` |
| **D7** | **Sin migración y sin limpiar las huérfanas ya existentes** | Las `geofence_exit` con `geofence_id` nulo y no cerradas de antes de #145 se quedan como están. [[design]] D7 da la consulta para contarlas. Si hay alguna, limpiarla es una decisión del humano aparte |
| **D8** | **`closed_at` = reloj de la app en el momento del CRUD** | En el PATCH es el mismo instante que `updated_at`. **No** es el `ts` de la última posición: no hay posición que lo cause |
| **D11** | **El contrato HTTP no cambia** | Mismos códigos (204, 200, 404, 409, 400, 402), misma forma del cuerpo y la misma auditoría (`geofence.update` con `fields`, `geofence.delete`). Lo único observable nuevo es que el `state` del 200 del PATCH refleja el reinicio. El cierre de alertas no se audita |

**Si el humano no firma**:

- **Prefiere que solo desactivar reinicie (D2):** el segundo `it` de R3
  desaparece, y la mutación M10 pasa a ser la implementación.
- **Quiere un push o `alert_resolved` al cerrar (D5):** la spec se reabre. El
  CRUD necesitaría un productor de SQS y un e2e con LocalStack, que es otro
  alcance.
- **Prefiere «clave presente» en vez de «valor distinto» (D4):** la fila 2 de
  R5 se invierte.

---

## Contrato (normativo)

- **Puerto** (`src/modules/geofences/domain/repositories/geofence.repository.ts`):

  ```ts
  update(
    id: string,
    changes: GeofenceFieldChanges,
    options: { resetEvaluation: boolean },
  ): Promise<Geofence>;
  ```

  `delete(id: string): Promise<void>;` no cambia de firma.
- **`GeofenceDrizzleRepository.update`**:
  - Con `options.resetEvaluation === true`, todo va en **una** transacción
    (`this.db.transaction`). El `UPDATE geofences` escribe además
    `geofenceState: { state: 'unknown', updatedAt: null }`. Después pasa a
    `status: 'closed'` toda fila de `alert_events` con
    `geofence_id = id AND status <> 'closed'`, con `closedAt` = el mismo
    `now` que `updatedAt`. **No** toca su `geofence_id`.
  - Con `false`, ni `geofence_state` ni `alert_events` cambian.
  - Un `23505` de nombre duplicado sigue saliendo como
    `GeofenceNameTakenError`, por el mismo `translateUniqueViolation`, y la
    transacción se deshace entera.
- **`GeofenceDrizzleRepository.delete`**: todo va en **una** transacción.
  Primero cierra (`status: 'closed'`, `closedAt: new Date()`) las filas de
  `alert_events` con `geofence_id = id AND status <> 'closed'`, y después
  hace `DELETE` de la zona.
- Las dos operaciones comparten la misma función de módulo `closeOpenAlerts`
  del repositorio. Su filtro es
  `and(eq(alertEvents.geofenceId, geofenceId), ne(alertEvents.status, 'closed'))`,
  el mismo predicado que el índice (P1).
- **`UpdateGeofenceUseCase.execute`**: después del no-op de R13, llama a
  `this.geofences.update(geofenceId, dto, { resetEvaluation: resetsEvaluation(existing, dto) })`.
  `resetsEvaluation(existing: Geofence, dto: UpdateGeofenceDto): boolean` es
  una función de módulo del mismo fichero. Devuelve `true` si y solo si alguna
  de `active`, `centerLat`, `centerLng` o `radiusM` viene en `dto` con un
  valor `!==` al de `existing`.
- **Sin cambios**:
  - `src/modules/alerts/`, el esquema, las migraciones, el motor, el
    controlador, el DTO y el mapper;
  - la auditoría y los códigos HTTP;
  - `GeofenceFieldChanges` y la entidad `Geofence`.

---

## Requisitos funcionales

Todos los tests viven en `test/geofences.e2e-spec.ts`, dentro de
`describe('Geofences CRUD (e2e)'`. Van en un `describe` padre nuevo,
`describe('#145: consistencia entre geocercas y alertas'`, colocado **después**
de `describe('R15: DELETE sobre id inexistente/malformado/ajeno responde 404 sin auditar'`.
Cada `describe` hijo lleva el prefijo `#145 R<n>:`, porque el fichero ya
tiene los R1-R15 de #11 (`docs/conventions.md` §Prefijo de feature cuando un
fichero acumula R-ids de dos specs). Los tests siembran alertas y estado
**directamente en la BD** y verifican por HTTP y por BD (D9).

### Arnés (literal; cada pieza entra en el commit que la usa por primera vez)

- **Import** nuevo, justo después de `import { DRIZZLE } from '@/db/drizzle.constants';`:

  ```ts
  import { alertEvents } from '@/db/schema/alerts.schema';
  ```

- **Helpers**, al principio del `describe` padre, **en este orden**. Al cierre
  el fichero tiene los ocho seguidos y luego los cinco `describe` hijos. Entre
  corchetes, el commit rojo que trae cada uno ([[tasks]]):

  ```ts
      const SEEDED_STATE = {
        state: 'outside' as const,
        updatedAt: '2026-10-01T10:00:00.000Z',
      };
      const HISTORY_CLOSED_AT = new Date('2026-10-01T10:10:00.000Z');
  ```

  (`SEEDED_STATE` [R3], `HISTORY_CLOSED_AT` [R1])

  ```ts
      async function seedAlert(
        petId: string,
        geofenceId: string | null,
        status: 'open' | 'acked' | 'closed',
        type: 'geofence_exit' | 'battery_low' = 'geofence_exit',
      ): Promise<string> {
        const id = uuidv7();
        await db.insert(alertEvents).values({
          id,
          petId,
          geofenceId,
          type,
          status,
          payload: {},
          openedAt: new Date('2026-10-01T10:00:00.000Z'),
          ackedAt:
            status === 'open' ? null : new Date('2026-10-01T10:05:00.000Z'),
          closedAt: status === 'closed' ? HISTORY_CLOSED_AT : null,
        });
        return id;
      }
  ```

  (`seedAlert` [R1])

  ```ts
      async function alertById(id: string) {
        const [row] = await db
          .select()
          .from(alertEvents)
          .where(eq(alertEvents.id, id));
        return row;
      }
  ```

  (`alertById` [R2])

  ```ts
      async function seedState(geofenceId: string, active = true) {
        await db
          .update(geofences)
          .set({ geofenceState: SEEDED_STATE, active })
          .where(eq(geofences.id, geofenceId));
      }

      async function storedState(geofenceId: string) {
        const [row] = await db
          .select({ geofenceState: geofences.geofenceState })
          .from(geofences)
          .where(eq(geofences.id, geofenceId));
        return row.geofenceState;
      }
  ```

  (`seedState` y `storedState` [R3])

  ```ts
      function deleteZone(owner: TestUser, petId: string, geofenceId: string) {
        return api()
          .delete(`/v1/pets/${petId}/geofences/${geofenceId}`)
          .set('Authorization', `Bearer ${owner.token}`);
      }

      function patchZone(
        owner: TestUser,
        petId: string,
        geofenceId: string,
        body: Record<string, unknown>,
      ) {
        return api()
          .patch(`/v1/pets/${petId}/geofences/${geofenceId}`)
          .set('Authorization', `Bearer ${owner.token}`)
          .send(body);
      }
  ```

  (`deleteZone` [R1], `patchZone` [R3])

### R1 — El DELETE de una zona con alerta no cerrada responde 204, también si es la segunda de la mascota

**WHEN** el owner borra una zona con
`DELETE /v1/pets/:petId/geofences/:geofenceId`, y esa zona tiene una alerta
`geofence_exit` no cerrada (`open` o `acked`), **THE SYSTEM SHALL** responder
204 y borrar la zona. Vale también cuando otra zona de la misma mascota ya se
borró con su alerta no cerrada.

- **Test**: `describe('#145 R1: DELETE de una zona con alerta no cerrada responde 204, también si otra zona de la mascota ya se borró con su alerta no cerrada'`
  con **un** `it`, literal:

  ```ts
      describe('#145 R1: DELETE de una zona con alerta no cerrada responde 204, también si otra zona de la mascota ya se borró con su alerta no cerrada', () => {
        it('borrar la zona A (alerta open) y después la zona B (alerta acked) de la misma mascota responde 204 las dos veces', async () => {
          const owner = await seedUser('145r1-owner');
          const pet = await createPetViaApi(owner, `145R1-${RUN_ID}`);
          const zoneA = (await createGeofenceViaApi(owner, pet.id)).id as string;
          const zoneB = (await createGeofenceViaApi(owner, pet.id)).id as string;
          await seedAlert(pet.id, zoneA, 'open');
          await seedAlert(pet.id, zoneB, 'acked');

          const first = await deleteZone(owner, pet.id, zoneA);
          const second = await deleteZone(owner, pet.id, zoneB);

          expect([first.status, second.status]).toEqual([204, 204]);
          const rows = await db
            .select()
            .from(geofences)
            .where(eq(geofences.petId, pet.id));
          expect(rows).toHaveLength(0);
        });
      });
  ```

- **Rojo natural** (base `a8c8e449`): este `it` falla **por aserción**
  (`toEqual`: recibe `[204, 500]`). Es la reproducción de R12.3 (C1). Los 20
  `it` de la base siguen verdes.
- **Mutaciones que deben dejarlo rojo** (medidas; código exacto en [[tasks]] §Sondas):

| Id | Mutación en `geofence.drizzle.repository.ts` | Rojos |
|---|---|---|
| M1 | `delete` sin `await closeOpenAlerts(tx, id, new Date());` | R1 (`[204, 500]`) y las 2 filas de R2 |
| M2 | `closeOpenAlerts` **después** del `tx.delete(geofences)…` | igual que M1. Tras el `SET NULL` ya no queda ninguna alerta con ese `geofence_id` que cerrar |

### R2 — El DELETE cierra las alertas no cerradas de la zona y no toca ninguna otra

**WHEN** se borra una zona, **THE SYSTEM SHALL**, en la misma transacción y
antes del `DELETE`, pasar a `status = 'closed'`, con `closed_at` = el instante
del borrado, toda fila de `alert_events` de esa zona con `status <> 'closed'`.
Después del `SET NULL` quedan con `geofence_id` nulo. **AND THE SYSTEM SHALL**
no modificar ninguna otra fila de `alert_events`: ni las ya cerradas de la
zona, ni las de otras zonas, ni las de batería.

- **Test**: `describe('#145 R2: DELETE cierra las alertas no cerradas de la zona y no toca ninguna otra'`
  con **un** `it.each` de 2 filas (`'open'`, `'acked'`), literal:

  ```ts
      describe('#145 R2: DELETE cierra las alertas no cerradas de la zona y no toca ninguna otra', () => {
        it.each(['open', 'acked'] as const)(
          'alerta %s de la zona: queda closed, con closed_at y sin geofence_id; la cerrada de antes, la de otra zona y la de batería no cambian',
          async (status) => {
            const owner = await seedUser(`145r2-${status}-owner`);
            const pet = await createPetViaApi(owner, `145R2-${status}-${RUN_ID}`);
            const zone = (await createGeofenceViaApi(owner, pet.id)).id as string;
            const otherZone = (await createGeofenceViaApi(owner, pet.id))
              .id as string;
            const target = await seedAlert(pet.id, zone, status);
            const history = await seedAlert(pet.id, zone, 'closed');
            const other = await seedAlert(pet.id, otherZone, 'open');
            const battery = await seedAlert(pet.id, null, 'open', 'battery_low');
            const before = Date.now();

            await deleteZone(owner, pet.id, zone).expect(204);

            const closed = await alertById(target);
            expect(closed).toMatchObject({ status: 'closed', geofenceId: null });
            expect(closed.closedAt?.getTime() ?? 0).toBeGreaterThanOrEqual(
              before,
            );
            expect(await alertById(history)).toMatchObject({
              status: 'closed',
              geofenceId: null,
              closedAt: HISTORY_CLOSED_AT,
            });
            expect(await alertById(other)).toMatchObject({
              status: 'open',
              geofenceId: otherZone,
              closedAt: null,
            });
            expect(await alertById(battery)).toMatchObject({
              status: 'open',
              closedAt: null,
            });
          },
        );
      });
  ```

- **Rojo natural** (base): las 2 filas fallan **por aserción**
  (`toMatchObject`): `status` sigue `'open'` o `'acked'`.
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación | Rojos |
|---|---|---|
| M1, M2 | ver R1 | las 2 filas |
| M3 | `ne(alertEvents.status, 'closed')` → `eq(alertEvents.status, 'open')` | fila `acked` y las 3 filas de R4 |
| M4 | sin filtro de status: `.where(eq(alertEvents.geofenceId, geofenceId));` | las 2 filas: la alerta ya cerrada pierde su `closed_at` de historial |
| M5 | filtrar por la mascota de la zona en vez de por la zona | las 2 filas, `desactivar con alerta open…` de R3 y las 3 filas de R4 |
| M14 | `.set({ status: 'closed' })` sin `closedAt` | las 2 filas, `desactivar con alerta open…` de R3 y las 3 filas de R4 (`toBeGreaterThanOrEqual`: recibe `0`) |

### R3 — Un PATCH que cambia `active` reinicia el estado de evaluación y cierra las alertas no cerradas de la zona

**WHEN** un `PATCH /v1/pets/:petId/geofences/:geofenceId` cambia el valor de
`active` de la zona, en cualquiera de los dos sentidos, **THE SYSTEM SHALL**,
en la misma transacción que el `UPDATE`:

- dejar `geofence_state = {state: 'unknown', updatedAt: null}`;
- cerrar (`status = 'closed'`, `closed_at` = el instante del PATCH) las
  alertas no cerradas de esa zona, **conservando su `geofence_id`**, sin tocar
  las de otras zonas.

**AND THE SYSTEM SHALL** responder 200 con
`state: {value: 'unknown', updatedAt: null}`.

- **Test**: `describe('#145 R3: PATCH que cambia active reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas'`
  con **dos** `it`, literal:

  ```ts
      describe('#145 R3: PATCH que cambia active reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas', () => {
        it('desactivar con alerta open: la cierra conservando geofence_id, el estado vuelve a {unknown, null} y la alerta de otra zona sigue abierta', async () => {
          const owner = await seedUser('145r3a-owner');
          const pet = await createPetViaApi(owner, `145R3a-${RUN_ID}`);
          const zone = (await createGeofenceViaApi(owner, pet.id)).id as string;
          const otherZone = (await createGeofenceViaApi(owner, pet.id))
            .id as string;
          await seedState(zone);
          const target = await seedAlert(pet.id, zone, 'open');
          const other = await seedAlert(pet.id, otherZone, 'open');
          const before = Date.now();

          const response = await patchZone(owner, pet.id, zone, {
            active: false,
          }).expect(200);

          expect(response.body).toMatchObject({
            active: false,
            state: { value: 'unknown', updatedAt: null },
          });
          expect(await storedState(zone)).toEqual({
            state: 'unknown',
            updatedAt: null,
          });
          const closed = await alertById(target);
          expect(closed).toMatchObject({ status: 'closed', geofenceId: zone });
          expect(closed.closedAt?.getTime() ?? 0).toBeGreaterThanOrEqual(before);
          expect(await alertById(other)).toMatchObject({
            status: 'open',
            closedAt: null,
          });
        });

        it('reactivar una zona inactiva con estado sembrado lo reinicia a {unknown, null}', async () => {
          const owner = await seedUser('145r3b-owner');
          const pet = await createPetViaApi(owner, `145R3b-${RUN_ID}`);
          const zone = (await createGeofenceViaApi(owner, pet.id)).id as string;
          await seedState(zone, false);

          const response = await patchZone(owner, pet.id, zone, {
            active: true,
          }).expect(200);

          expect(response.body).toMatchObject({
            active: true,
            state: { value: 'unknown', updatedAt: null },
          });
          expect(await storedState(zone)).toEqual({
            state: 'unknown',
            updatedAt: null,
          });
        });
      });
  ```

- **Rojo natural** (el verde de R1+R2): los 2 `it` fallan **por aserción**
  (`toMatchObject` del cuerpo: `state` sigue `{value: 'outside', …}`).
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación | Rojos |
|---|---|---|
| M10 | solo desactivar reinicia: `… && dto[key] !== true` | `reactivar una zona inactiva…` |
| M11 | reinicia sin cerrar: sin el bloque `if (options.resetEvaluation) { await closeOpenAlerts(tx, id, now); }` | `desactivar con alerta open…` y las 3 filas de R4 |
| M12 | cierra sin reiniciar: `? {}` en vez de `? { geofenceState: { state: 'unknown', updatedAt: null } }` | los 2 `it` y las 3 filas de R4 |
| M13 | el cierre anula la zona: `.set({ status: 'closed', closedAt, geofenceId: null })` | `desactivar con alerta open…` y las 3 filas de R4. R2 sigue verde, porque el `SET NULL` la anula de todos modos |
| M5, M14 | ver R2 | `desactivar con alerta open…` |

### R4 — Un PATCH que cambia la geometría reinicia el estado de evaluación y cierra las alertas no cerradas de la zona

**WHEN** un `PATCH` cambia el valor de `centerLat`, `centerLng` o `radiusM` de
la zona, **THE SYSTEM SHALL** hacer lo mismo que en R3: reiniciar el estado,
cerrar las alertas no cerradas de la zona conservando su `geofence_id`, y
responder con `state: {value: 'unknown', updatedAt: null}`.

- **Test**: `describe('#145 R4: PATCH que cambia la geometría reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas'`
  con **un** `it.each` de 3 filas (una por clave), literal:

  ```ts
      describe('#145 R4: PATCH que cambia la geometría reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas', () => {
        it.each([
          ['centerLat', 19.44],
          ['centerLng', -99.14],
          ['radiusM', 250],
        ] as const)(
          'cambiar %s a %p: el estado vuelve a {unknown, null}, la alerta acked de la zona queda closed y la de otra zona no cambia',
          async (key, value) => {
            const owner = await seedUser(`145r4-${key}-owner`);
            const pet = await createPetViaApi(owner, `145R4-${key}-${RUN_ID}`);
            const zone = (await createGeofenceViaApi(owner, pet.id)).id as string;
            const otherZone = (await createGeofenceViaApi(owner, pet.id))
              .id as string;
            await seedState(zone);
            const target = await seedAlert(pet.id, zone, 'acked');
            const other = await seedAlert(pet.id, otherZone, 'acked');
            const before = Date.now();

            const response = await patchZone(owner, pet.id, zone, {
              [key]: value,
            }).expect(200);

            expect(response.body).toMatchObject({
              [key]: value,
              state: { value: 'unknown', updatedAt: null },
            });
            expect(await storedState(zone)).toEqual({
              state: 'unknown',
              updatedAt: null,
            });
            const closed = await alertById(target);
            expect(closed).toMatchObject({ status: 'closed', geofenceId: zone });
            expect(closed.closedAt?.getTime() ?? 0).toBeGreaterThanOrEqual(
              before,
            );
            expect(await alertById(other)).toMatchObject({
              status: 'acked',
              closedAt: null,
            });
          },
        );
      });
  ```

- **Rojo natural** (el verde de R3, que solo reinicia con `active`): las 3
  filas fallan **por aserción** (`toMatchObject` del cuerpo).
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación en `update-geofence.use-case.ts` | Rojos |
|---|---|---|
| M6 | quitar `'radiusM'` de la lista de claves | fila `radiusM` |
| M7 | quitar `'centerLat'` | fila `centerLat` |
| M8 | quitar `'centerLng'` | fila `centerLng` |
| M3, M5, M11, M12, M13, M14 | ver R2 y R3 (repositorio) | las 3 filas |

### R5 — Un PATCH sin cambio de geometría ni de `active` conserva el estado y las alertas de la zona (requisito de verificación)

**WHEN** un `PATCH` no cambia el valor de `active` ni el de la geometría (solo
cambia `name`, o reenvía esos campos con el valor que ya tienen), **THE SYSTEM
SHALL** conservar `geofence_state` y las alertas de la zona tal como estaban.

- **Requisito de verificación** (C4, quinto punto). Sobre el verde de R4 su
  test ya pasa, porque el código es correcto. El rojo legítimo es una
  **mutación de producción versionada** en el commit rojo, **MV**, que se
  revierte en el verde. Es el mismo patrón que X11 de #125.
- **Test**: `describe('#145 R5: PATCH sin cambio de geometría ni de active conserva el estado de evaluación y las alertas de la zona'`
  con **un** `it.each` de 2 filas, literal:

  ```ts
      describe('#145 R5: PATCH sin cambio de geometría ni de active conserva el estado de evaluación y las alertas de la zona', () => {
        it.each([
          ['solo name', 'name', { name: 'Renombrada' }],
          [
            'name con la misma geometría y el mismo active que ya tiene',
            'full',
            {
              name: 'Renombrada',
              centerLat: 19.4326,
              centerLng: -99.1332,
              radiusM: 100,
              active: true,
            },
          ],
        ])(
          '%s: el estado sembrado y la alerta open no cambian',
          async (_title, label, body) => {
            const owner = await seedUser(`145r5-${label}-owner`);
            const pet = await createPetViaApi(owner, `145R5-${label}-${RUN_ID}`);
            const zone = (await createGeofenceViaApi(owner, pet.id)).id as string;
            await seedState(zone);
            const target = await seedAlert(pet.id, zone, 'open');

            const response = await patchZone(owner, pet.id, zone, body).expect(
              200,
            );

            expect(response.body).toMatchObject({
              name: 'Renombrada',
              state: { value: 'outside', updatedAt: SEEDED_STATE.updatedAt },
            });
            expect(await storedState(zone)).toEqual(SEEDED_STATE);
            expect(await alertById(target)).toMatchObject({
              status: 'open',
              closedAt: null,
            });
          },
        );
      });
  ```

- **Rojo** (el verde de R4 + MV): las 2 filas fallan **por aserción**
  (`toMatchObject` del cuerpo: `state` llega `{value: 'unknown', …}`).
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación en `update-geofence.use-case.ts` | Rojos |
|---|---|---|
| MV | `(['name', 'active', 'centerLat', 'centerLng', 'radiusM'] as const)` (**versionada** en el rojo) | las 2 filas |
| M9 | clave presente en vez de valor distinto: `dto[key] !== undefined` | fila `name con la misma geometría y el mismo active que ya tiene` |

**De los `it` nuevos**, todos los rojos (naturales, MV y M1-M14) son **por
aserción** (`toEqual`, `toMatchObject` o `toBeGreaterThanOrEqual`). Ninguno es
por excepción, timeout ni consulta. **Ningún `it` de la base** se pone rojo
con ninguna de las 15 mutaciones: los 20 siguieron verdes en cada corrida.

---

## Entregable de documentación (sin R: no tiene test; se verifica por grep)

**`docs/data-model.md`**: tres sustituciones literales en dos filas de la
tabla. Cada texto «antes» aparece **una sola vez** en el fichero (medido en
`a8c8e449`). Los bloques son texto plano y van sin comillas.

1. Fila `` `geofences` ``. Sustituir

   ```text
   — ya en producción: `alerts-engine` es su primer y único escritor real, vía `AlertsEngineStore.updateGeofenceState()` (no `GeofenceRepository`, que se deja intacto)
   ```

   por

   ```text
   — ya en producción: `alerts-engine` es el único que escribe un estado evaluado, vía `AlertsEngineStore.updateGeofenceState()`. Desde #145, un `PATCH` que cambia la geometría o `active` lo devuelve al default (`GeofenceRepository.update` con `resetEvaluation`) y cierra en la misma transacción las alertas no cerradas de la zona
   ```

2. Fila `` `alert_events` ``. El fragmento cierra el código en línea que abre
   `(pet_id, type, coalesce(`. Sustituir

   ```text
   WHERE status='open'` (brief §12)
   ```

   por

   ```text
   WHERE status <> 'closed'` (el brief §12 decía `status='open'`; #13 D1 lo amplió en la migración 0008)
   ```

3. Misma fila. Sustituir

   ```text
   `payload` ya conserva su nombre.
   ```

   por

   ```text
   `payload` ya conserva su nombre. Desde #145, el `DELETE` de una geocerca cierra antes, en la misma transacción, sus alertas no cerradas, así que el `SET NULL` solo alcanza filas `closed`.
   ```

Greps de cierre:

| `grep -c` en `docs/data-model.md` | Resultado |
|---|---|
| `"WHERE status='open'"` | `0` |
| `"WHERE status <> 'closed'"` | `1` |
| `"que se deja intacto"` | `0` |
| `"#145"` | `2` |

**Comentarios de producción caducados** (commit `refactor`, texto exacto en
[[tasks]] §Refactor). Son los dos del puerto, el de
`delete-geofence.use-case.ts` y la cabecera de `alerts-engine-store.ts`.

| Grep (desde `backend-pet-tracker/`) | Resultado |
|---|---|
| `grep -rn "referencia todavia" src/modules/geofences` | vacío |
| `grep -c "se deja intacto" src/workers/alerts-engine/alerts-engine-store.ts` | `0` |

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `test/geofences.e2e-spec.ts` · `import { alertEvents } from '@/db/schema/alerts.schema';` | import nuevo | R1 · rojo |
| Recuento de `test/geofences.e2e-spec.ts` | **20 → 30** (+10: R1 1, R2 2, R3 2, R4 3, R5 2) | R1-R5 · rojos |
| Resto de e2e (`./init.sh`) | **+0** | — |
| Backend unit (`pnpm test`) | **+0** (ningún `.spec.ts` cambia) | — |
| `GeofenceRepository.update` | parámetro `options` obligatorio. **Cero** dobles que tocar (P9) | R3 · verde |
| `docs/data-model.md` | dos filas (texto, sin test) | commit `docs` |

Ningún `it` ni `describe` existente se edita.

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `test/geofences.e2e-spec.ts` · `describe('R7: nombre duplicado responde 409 GEOFENCE_NAME_TAKEN; carrera concurrente deja a lo sumo un 201'` | El 409 del POST. La transacción del PATCH no cambia el camino del POST |
| `test/geofences.e2e-spec.ts` · `describe('R10: PATCH parcial valido actualiza solo las claves presentes, audita geofence.update y responde 200'` | `PATCH {name, radiusM: 250}` sigue en 200, con la misma auditoría (`fields`). Ahora además reinicia un estado que ya era el default, y eso no lo asevera |
| `test/geofences.e2e-spec.ts` · `describe('R13: PATCH sin campos reconocidos es no-op (200, sin escribir ni auditar); 404 de R12 precede'` | `{}` sigue sin escribir: `resetsEvaluation` se decide **después** del no-op |
| `test/geofences.e2e-spec.ts` · `describe('R14: DELETE borra la fila (hard delete), audita geofence.delete y responde 204'` y `describe('R15: DELETE sobre id inexistente/malformado/ajeno responde 404 sin auditar'` | El hard delete, su auditoría, y que un 404 no llega al repositorio |
| `test/device-subscriptions.e2e-spec.ts` · `describe('R9 (device-subscriptions #25): exact tracking route gate'` | El 402 del guard en `PATCH` y `DELETE` de geocercas precede al caso de uso |
| `test/alerts-engine.e2e-spec.ts` y `test/alerts-center-notifier.e2e-spec.ts` | Siembran zonas y alertas, pero no hacen `PATCH` ni `DELETE` de geocercas (verificado leyendo; son de LocalStack y las corre `./init.sh`) |
| `src/workers/alerts-engine/alerts-engine.drizzle.store.spec.ts` · `it('la firma y el contrato de retorno de closeOpenAlert no cambian'` | Lee `alerts-engine-store.ts` como texto. El refactor solo cambia el comentario de cabecera, no la firma de `closeOpenAlert` |
| `src/pipeline/geofence-eval.spec.ts` · `describe('R18: unknown transiciona silenciosamente (event null) a inside/outside'` y `src/pipeline/geofence-eval-untouched.spec.ts` | La base del criterio 1 (C4), y que `geofence-eval.ts` no se toca |
| `src/db/schema/alerts.schema.spec.ts` · `describe('R2: indice unico parcial anti-spam (pet_id, type, coalesce(geofence_id, uuid_nil literal)) WHERE status=open'` | Sin migración. El título está caducado, pero solo asevera que el índice existe, que es único y que tiene `where` (§Fuera de alcance) |
| `src/db/schema/meal-servings.schema.spec.ts` · `it('usa la ultima migracion renombrada y no altera otras tablas'` | Sin migración nueva |

---

## Cobertura de los criterios de aceptación de `feature_list.json` #145

| Criterio | Cubierto por |
|---|---|
| 1. Cambiar la geometría por PATCH deja el estado de modo que la siguiente posición no genera una alerta espuria | R4 (reinicio a `{unknown, null}` por clave), con R18 del motor como base (P7, C4) |
| 2. Desactivar una zona cierra su alerta abierta | R3 (`desactivar con alerta open…`), que también cierra las `acked` (C5) |
| 3. El DELETE de una zona con alerta no cerrada responde 204 y no 500, reproducido primero con un e2e rojo | R1 (rojo en la base: `[204, 500]`) |
| 4. Ninguna alerta queda abierta y huérfana tras borrar su zona | R2 (`open` y `acked` quedan `closed` y nulas, sin tocar las demás). Huérfanas anteriores: D7 |
| 5. `docs/data-model.md` describe el predicado real del índice anti-spam | §Entregable de documentación (greps) |
| 6. Suite backend y e2e verdes medidas sin pipe, con el delta de tests declarado | [[tasks]] §Cierre (+10 e2e, +0 unit, exit medido sin pipe) y `./init.sh` del leader |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones (no son features y no se registran):**

- **DELETE de la mascota.** No tiene el agujero: `pet_id` hace cascada (C8).
- **El 402 en los GET** (R12.6 del explorer). Es una decisión de producto
  aparte, ya excluida por el encargo.
- **La carrera del límite de 5** (R13 del explorer, spec de #11). Excluida por
  el encargo.
- **Que `updatedAt` cambie en cada evaluación** (R12.5 del explorer). Excluido
  por el encargo.
- **Alertas de batería.** Ni el DELETE ni el PATCH de una zona las tocan (R2 lo
  asevera).
- **Un PATCH que solo cambia `name`.** No reinicia (R5).
- **Móvil.** #41 y #146 consumen este comportamiento, pero esta spec no toca
  `mobile-pet-tracker/`.
- **El título caducado de `describe('R2: indice unico parcial anti-spam … WHERE status=open'`**
  en `alerts.schema.spec.ts`. Renombrarlo movería un candado de #12 solo por
  texto. Su cuerpo no asevera el predicado.

**Deuda o limitación conocida que esta feature no ejecuta:**

- **Carrera entre el motor y el CRUD.** El motor puede leer la zona antes del
  PATCH y escribir su estado o abrir una alerta después. En ese caso el
  reinicio se pierde hasta el siguiente cambio de geometría o de `active`. Se
  arreglaría con `SELECT … FOR UPDATE` de la zona en el motor y en el CRUD.
  La ventana es de milisegundos por posición, y no se añade ahora.
- **La atomicidad no es observable desde un test.** Que el cierre y el UPDATE
  o el DELETE van en una sola transacción lo fija un grep
  (`this.db.transaction(` → `2`, [[tasks]] §Cierre), no un e2e. Sin fallos
  inyectados, cerrar fuera de la transacción da el mismo resultado observable,
  así que ningún test de esta spec lo distingue.
- **Techo silencioso tras el reinicio.** Si la mascota ya está fuera de la zona
  nueva, la primera posición la sitúa `outside` **sin avisar** (P7). La
  siguiente alerta llega cuando entre y vuelva a salir.
- **Huérfanas anteriores a #145** (D7).
- **El 409 del PATCH no tiene candado e2e.** Es previo a #145: R7 solo cubre
  el POST. Con el borrador de esta spec, `PATCH {name: <duplicado>, radiusM: 250}`
  da 409 `GEOFENCE_NAME_TAKEN` y deja el estado y la alerta intactos
  (sonda, verde).

---

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-10-01)
