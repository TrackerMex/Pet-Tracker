---
feature: "geofence-alert-consistency"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, backend]
---

# Diseño — [[geofence-alert-consistency]] (#145)

> Ver [[requirements]] para los requisitos y las premisas verificadas (§0), y
> [[../../docs/architecture|architecture]] para las capas. Las anclas son por
> contenido, nunca por número de línea.
>
> Todo lo que aquí dice «medido» se midió en una copia del árbol de `a8c8e449`
> en el scratchpad (fuera del repo), contra la BD del worktree
> (`pet_tracker_wt`), con un borrador de la implementación:
>
> - `test/geofences.e2e-spec.ts` pasa de **20** a **30** tests, exit 0;
> - `tsc --noEmit` y `eslint` limpios sobre los ficheros tocados;
> - los nueve pasos rojo/verde de [[tasks]] y las quince mutaciones de
>   [[requirements]] se corrieron uno a uno.
>
> La suite unit y `./init.sh` no se corrieron, porque el encargo lo prohíbe
> (Postgres y LocalStack compartidos). Ningún `.spec.ts` cambia, así que el
> delta unit es +0 por construcción.

## El defecto, de punta a punta

| Paso | Dónde | Qué pasa hoy (`a8c8e449`) |
|---|---|---|
| 1 | Motor: `alerts-engine-consumer.service.ts` | La mascota sale de la zona A y se abre `geofence_exit` `{geofence_id: A, status: open}`. El estado de A queda `outside` con el `ts` de la posición |
| 2a | `PATCH {radiusM: 500}` sobre A | Se escriben `geometry` y `updated_at`. `geofence_state` sigue `outside`. Si la mascota queda dentro del radio nuevo, la siguiente posición da `outside → inside` y cierra la alerta con un `alert_resolved` («regresó») **espurio**. Si se mueve o encoge una zona en la que estaba dentro, da una salida espuria (R12.1) |
| 2b | `PATCH {active: false}` sobre A | El motor deja de leer A (`eq(geofences.active, true)`). La alerta abierta no la cierra nadie (R12.2) |
| 3 | `DELETE` de A | Una sentencia suelta. El `SET NULL` deja la alerta en `{geofence_id: null, status: open}`, huérfana para siempre: `closeOpenAlert` busca por `geofence_id` (R12.4) |
| 4 | `DELETE` de B (otra zona de la misma mascota con alerta `open` o `acked`) | Su alerta también pasaría a `(pet, 'geofence_exit', nil)` no cerrada. Choca con la del paso 3 en `alert_events_open_anti_spam_idx`, sale un `23505` sin mapear y un **500**, y la zona B no se puede borrar nunca (R12.3, reproducido) |

## Decisiones técnicas

### D1 — DELETE: cerrar y después borrar, en una transacción (R1, R2)

`GeofenceDrizzleRepository.delete` envuelve las dos sentencias en
`this.db.transaction(async (tx) => …)`:

1. `closeOpenAlerts(tx, id, new Date())`, que pasa a `closed` las alertas no
   cerradas de la zona y les pone `closed_at`;
2. `tx.delete(geofences).where(eq(geofences.id, id))`.

El `SET NULL` de la FK llega cuando ya no queda ninguna fila no cerrada de la
zona, así que el índice parcial (que solo mira `status <> 'closed'`) no puede
chocar. El orden importa: al revés (M2), el `SET NULL` corre primero y el
cierre ya no encuentra nada que cerrar.

La respuesta sigue siendo 204, y `geofence.delete` se audita igual que hoy.
Las filas cerradas conservan `payload`, que ya lleva el nombre de la zona, y
el centro de alertas las sigue mostrando como historial.

### D2 — Cambiar `active`, en los dos sentidos, reinicia el estado y cierra (R3)

Desactivar saca la zona del motor (P5), y su alerta no se cerraría nunca. Se
cierra en el PATCH. Reactivar parte de cero: el `geofence_state` guardado es de
cuando la zona dejó de evaluarse, y compararlo con la siguiente posición puede
dar una salida o un regreso que no ocurrió **ahora**. Por eso se reinicia a
`{unknown, null}`. Si al reactivar queda alguna alerta no cerrada (solo podría
venir de antes de #145), se cierra igual.

Las alertas cerradas por PATCH **conservan `geofence_id`**: la zona existe y el
historial la sigue nombrando. Solo el DELETE las deja nulas, y eso lo hace la
FK, no este código.

### D3 — Cambiar la geometría reinicia igual (R4)

Mismo criterio: «editar la zona = zona nueva». Basta un valor distinto en
`centerLat`, `centerLng` o `radiusM`. El reinicio deja la primera posición
siguiente en una evaluación silenciosa desde `unknown` (R18 del motor, P7): ni
salida espuria al mover o encoger, ni «regresó» espurio al agrandar.

**Techo conocido** (deuda en [[requirements]]): si la mascota ya está fuera de
la zona nueva, esa primera posición la sitúa `outside` sin avisar. La alerta
siguiente llega cuando entre y vuelva a salir. Es la misma semántica que tiene
hoy una zona recién creada.

### D4 — «Cambiar» es un valor distinto del guardado (R3, R4, R5)

La regla vive en el caso de uso (application), como función pura de módulo:

```ts
function resetsEvaluation(existing: Geofence, dto: UpdateGeofenceDto): boolean {
  return (['active', 'centerLat', 'centerLng', 'radiusM'] as const).some(
    (key) => dto[key] !== undefined && dto[key] !== existing[key],
  );
}
```

- `existing` ya está cargado: es el mismo `findByIdAndPet` que decide el 404
  de R12 de #11. No hay lecturas nuevas.
- `!==` sobre números y booleanos es exacto. El DTO valida tipos y rangos
  antes, y la entidad guarda los números que salieron de `geometry`. Medido:
  reenviar `19.4326 / -99.1332 / 100 / true` no reinicia (R5, fila 2).
- `name` no está en la lista: renombrar no cambia qué se evalúa.
- El no-op de `{}` (R13 de #11) retorna **antes** de llegar aquí, así que no
  cambia.
- Comparar **presencia** en vez de valor (M9) reiniciaría al reenviar el
  formulario completo, que es justo lo que hará el editor de #146.

### D5 — Cierre silencioso

El cierre por CRUD no publica en SQS, no encola `alert_resolved` y no manda
push. Quien cambió la zona es el propio owner, y un «regresó» que no ocurrió
es peor que nada. Además, un productor de SQS en el CRUD metería LocalStack en
este e2e, que hoy solo necesita Postgres (P11). La alerta aparece `closed` en
el centro de alertas en la siguiente consulta.

### D6 — El cierre vive en el repositorio de geocercas; la regla, en el caso de uso

- **Puerto**: `update` gana un tercer parámetro **obligatorio**,
  `options: { resetEvaluation: boolean }`. No gana un método nuevo.
  - Obligatorio porque el único llamador es `UpdateGeofenceUseCase` (P9), y
    así el compilador fuerza la decisión explícita.
  - No hay dobles del puerto que romper (P9).
  - `delete(id)` no cambia de firma: borrar siempre cierra.
- **Repositorio**: `closeOpenAlerts(db, geofenceId, closedAt)` es una función
  de módulo al final de `geofence.drizzle.repository.ts`, compartida por
  `update` y `delete`. Su parámetro es `Pick<NodePgDatabase, 'update'>`, así
  que acepta `tx`. El filtro es
  `and(eq(alertEvents.geofenceId, geofenceId), ne(alertEvents.status, 'closed'))`:
  - `ne(…, 'closed')` es **el mismo predicado** que el índice parcial (P1);
  - el `inArray(alertEvents.status, ['open', 'acked'])` del motor es
    equivalente bajo el `CHECK` de status;
  - se elige el del índice porque es lo que el cierre debe vaciar.
- **`update` con `resetEvaluation`**: `UPDATE geofences` (con
  `geofenceState: { state: 'unknown', updatedAt: null }`) y `closeOpenAlerts`
  van en la misma `this.db.transaction`. `closed_at` = el mismo `now` que
  `updated_at` (D8).
  - `mergedGeometry` lee la fila **antes** de la transacción, igual que hoy.
  - El `try/catch` de `translateUniqueViolation` envuelve la transacción
    entera. Un `23505` de nombre la deshace completa, y el estado y las
    alertas no cambian (medido con una sonda; queda como deuda sin candado,
    ver [[requirements]]).
- **Sin `resetEvaluation`**: el mismo `UPDATE` de hoy dentro de la
  transacción, y nada más.

El repositorio de geocercas importa el esquema de `alert_events`
(`@/db/schema/alerts.schema`). Es una dependencia de infraestructura a
infraestructura, el mismo tipo que ya tiene `alerts-engine.drizzle.store.ts`
sobre `geofences`. Ni el dominio ni la aplicación de geocercas conocen las
alertas.

### D7 — Sin migración, sin limpiar las huérfanas existentes

#145 no toca el esquema: el índice y la FK se quedan como están. Las huérfanas
anteriores a #145 no se limpian. Para contarlas, el humano puede correr esta
consulta de solo lectura contra la BD que quiera revisar:

```sql
select count(*) from alert_events
where type = 'geofence_exit' and geofence_id is null and status <> 'closed';
```

Una limpieza sería un `UPDATE` de datos en producción y es decisión del
humano, fuera de esta spec. Mientras exista una huérfana en una mascota, el
DELETE de #145 sigue respondiendo 204: la fila que cierra ya no llega a
`SET NULL` como no cerrada (medido: huérfana previa + DELETE nuevo → 204).

### D8 — `closed_at` = reloj de la app

En el PATCH, `closed_at` y `updated_at` son el mismo `const now = new Date();`.
En el DELETE es `new Date()` dentro de la transacción. No se usa el `ts` de la
última posición, porque ninguna posición causó el cierre.

Los tests acotan `closed_at` por abajo con `Date.now()` tomado antes de la
petición (`toBeGreaterThanOrEqual(before)`). El reloj de la app y el de jest
son el mismo proceso. M14 (sin `closedAt`) lo deja en `0`, y falla por esa
aserción.

### D9 — Arnés de test: e2e con alertas sembradas en la BD (R1-R5)

- Todo vive en `test/geofences.e2e-spec.ts`, el único fichero que levanta la
  API real de geocercas con Postgres (P11). El repositorio es la pieza que
  cambia y no tiene unit tests, y un unit con dobles no vería ni el índice ni
  la FK, que son la causa de R12.3.
- Las alertas y el estado se siembran con `db.insert(alertEvents)` y
  `db.update(geofences)`, como el resto del fichero siembra usuarios.
  - **No** se pasa por el motor: eso es SQS y LocalStack, y R18 ya fija la
    evaluación silenciosa desde `unknown` (C4).
  - `afterAll` ya borra las mascotas, y `alert_events` cae por la cascada de
    `pet_id`. No hace falta limpieza nueva.
- Cada `it` crea su propio owner y su mascota (`seedUser`,
  `createPetViaApi`), así que ningún test depende del orden. En R5, la
  columna `label` del `it.each` da un owner distinto por fila, porque
  `seedUser(label)` arma el email con la etiqueta y `RUN_ID`, y repetirla
  en el mismo run choca con el email único.
- Los helpers nuevos (`SEEDED_STATE`, `HISTORY_CLOSED_AT`, `seedAlert`,
  `alertById`, `seedState`, `storedState`, `deleteZone`, `patchZone`) viven
  dentro del `describe` padre `#145:`. Cada uno entra en el commit rojo que lo
  usa por primera vez, porque el lint marca como error una variable sin usar
  (P12).
- En el R2, la alerta `closed` de historial con `closed_at` fijo es el testigo
  de que el cierre no toca filas ya cerradas (M4). La de otra zona y la de
  batería son los testigos de que el filtro es por zona (M5).

### D10 — Orden y rojos (C4)

R1-R4 tienen rojo **natural** (vía (a) de C4): el código de la base **es** el
defecto, o el verde anterior aún no hace lo que pide el siguiente requisito. R1
y R2 comparten un verde (D1 los arregla a la vez, y C4 lo admite). R5 es un
**requisito de verificación**: su test pasa sobre el verde de R4, y su rojo
lleva la mutación de producción versionada **MV**, revertida en su verde.

| R | Estado de producción en el commit rojo | Por qué el rojo es legítimo |
|---|---|---|
| R1 | `a8c8e449` | El DELETE suelto da `[204, 500]`: es el defecto (R12.3) |
| R2 | `a8c8e449` (R1 sigue rojo) | El DELETE no cierra: las 2 filas fallan por `toMatchObject` |
| R3 | el verde de R1+R2 (repositorio con `closeOpenAlerts` y `delete` transaccional; `update` sin cambios) | El PATCH no reinicia ni cierra: los 2 `it` fallan por `toMatchObject` del cuerpo |
| R4 | el verde de R3, con `resetsEvaluation` mirando solo `['active']` | La geometría no reinicia: las 3 filas fallan por `toMatchObject` del cuerpo |
| R5 | el verde de R4 + **MV** (`'name'` en la lista de claves) | Renombrar reinicia: las 2 filas fallan por `toMatchObject` del cuerpo. El verde revierte MV y deja el caso de uso idéntico al del verde de R4 |

Recuentos medidos de `test/geofences.e2e-spec.ts` en cada paso:

| Paso | Rojos / total |
|---|---|
| base | 0 / 20 |
| rojo R1 | 1 / 21 |
| rojo R2 | 3 / 23 |
| verde R1+R2 | 0 / 23 |
| rojo R3 | 2 / 25 |
| verde R3 | 0 / 25 |
| rojo R4 | 3 / 28 |
| verde R4 | 0 / 28 |
| rojo R5 | 2 / 30 |
| verde R5 | 0 / 30 |

Ningún `it` de la base se puso rojo en ningún paso.

### D11 — El contrato HTTP no cambia

- Mismos códigos (204, 200, 404, 409, 400, 402), misma forma del cuerpo
  (`GEOFENCE_KEYS`), mismos mensajes de error.
- La auditoría es la misma: `geofence.update` con `{ petId, fields }` y
  `geofence.delete`.
- El cierre de alertas no se audita: es un efecto del cambio de zona, no una
  acción del usuario sobre la alerta.
- Lo único observable nuevo es el `state` que devuelve el 200 del PATCH
  cuando hay reinicio: `{value: 'unknown', updatedAt: null}`. El mapper ya lo
  expone así para una zona recién creada.

---

## Archivos afectados

| Fichero | Capa | Cambio |
|---|---|---|
| `backend-pet-tracker/src/modules/geofences/domain/repositories/geofence.repository.ts` | domain (puerto) | `update(…, options: { resetEvaluation: boolean })`. Comentarios de `update` y `delete` (refactor) |
| `backend-pet-tracker/src/modules/geofences/infrastructure/repositories/geofence.drizzle.repository.ts` | infrastructure | Imports de `ne` y `alertEvents`. `update` transaccional con `resetEvaluation`. `delete` transaccional. Función de módulo `closeOpenAlerts` (D1, D6, D8) |
| `backend-pet-tracker/src/modules/geofences/application/use-cases/update-geofence.use-case.ts` | application | `resetEvaluation: resetsEvaluation(existing, dto)` y la función de módulo (D4) |
| `backend-pet-tracker/src/modules/geofences/application/use-cases/delete-geofence.use-case.ts` | application | Solo el comentario de cabecera (refactor) |
| `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-store.ts` | worker (puerto) | Solo el comentario de cabecera (refactor) |
| `backend-pet-tracker/test/geofences.e2e-spec.ts` | test e2e | Import de `alertEvents` y el `describe` padre `#145:` con 8 helpers y 10 tests |
| `docs/data-model.md` | docs | Filas `geofences` y `alert_events` |

**No cambian**:

- `src/modules/alerts/` y `src/workers/alerts-engine/` salvo el comentario
  citado (ni consumidor, ni store, ni lógica);
- `src/pipeline/geofence-eval.ts`, `src/db/` (ni esquema ni migraciones);
- el controlador, los DTO, el mapper, la entidad, `geofences.module.ts` y los
  demás casos de uso de geocercas;
- los demás ficheros de `test/` y ningún `.spec.ts`;
- `package.json`, `pnpm-lock.yaml`, `infra/` y `mobile-pet-tracker/`.

---

## Alternativas descartadas

- **Borrar las alertas de la zona en vez de cerrarlas.** Se pierde el
  historial del centro de alertas, y `payload` ya conserva el nombre
  justamente para sobrevivir al borrado (D1 de #12).
- **Mapear el `23505` del DELETE a un 409.** La zona B no se podría borrar
  nunca, y deja huérfanas abiertas.
- **Cambiar el índice anti-spam** (por ejemplo, excluir `geofence_id IS NULL`).
  Hace falta una migración, deja las huérfanas abiertas para siempre y
  debilita la garantía de #12 para `battery_low`, que usa ese mismo hueco nulo.
- **Reevaluar la zona en el PATCH con la última posición conocida.** Mete la
  lógica del motor (`evaluate` de `geofence-eval.ts`, el anti-spam, las colas) en el CRUD
  para ganar una alerta inmediata. El reinicio a `unknown` da la misma
  garantía (sin falsos) con una sola escritura.
- **Un puerto del módulo de alertas para cerrar** (`AlertsRepository.closeForGeofence`).
  Con él, el cierre y el `UPDATE` o el `DELETE` no compartirían transacción
  sin un unit of work que el repo no tiene. Además, sería una interfaz con un
  solo llamador.
- **Un trigger de BD** (`BEFORE DELETE ON geofences`). Hace falta una
  migración, la regla «cambiar `active` o la geometría» no vive en SQL, y deja
  la lógica fuera de lo que los tests de la app ven.
- **Que el motor detecte el cambio** (comparando `geometry` o `updated_at`).
  Exige guardar la geometría evaluada en `geofence_state`, que es un cambio de
  esquema. Y no arregla ni la zona desactivada (el motor ya no la lee) ni el
  DELETE.
- **Método nuevo `resetEvaluation(id)` en el puerto, llamado aparte.** Serían
  dos transacciones o un unit of work. Con un parámetro de `update`, el
  reinicio va en el mismo `UPDATE`.
