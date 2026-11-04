# review: backend-e2e-vaccine-catalog-teardown
Fecha: 2026-11-04T04:00Z
Veredicto: APROBADO (estático; queda pendiente el `./init.sh` del leader sobre `ade847fc`; si sale rojo, este veredicto cae)

Alcance: worktree `/home/claude/sites/Pet-Tracker-wt-237`, rama `feature/237-backend-e2e-vaccine-catalog-teardown`,
HEAD revisado `ade847fc`, H0 `86c769e2` (firma de E1). `git diff --name-only 86c769e2..ade847fc` da exactamente la
lista cerrada, sin ningún otro fichero:
- `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`
- `progress/impl_backend-e2e-vaccine-catalog-teardown.md`
- `specs/backend-e2e-vaccine-catalog-teardown/traceability.md`

La revisión es estática. Este reviewer no corrió `./init.sh`, jest, e2e, psql, docker exec ni installs: el leader
los prohibió. Sí corrió, desde `backend-pet-tracker/`, `tsc --noEmit -p tsconfig.json` (exit 0; `--listFilesOnly`
confirma que incluye el e2e), `eslint` del fichero (exit 0) y `prettier --check` del fichero (exit 0). Leyó los
logs que dejó Codex en `/tmp`, sin modificarlos. No leyó `.env`.

## Checklist C2: estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json`; #237 sigue `spec_ready`.
- [x] `progress/current.md` describe la sesión activa (plan de arreglos del smoke del 2026-11-03). No nombra #237
      (ver O3). Es fichero del leader y queda fuera de la lista cerrada del implementador, así que no bloquea.
- [x] Árbol limpio: `git status --short` vacío. El marcador `progress/impl_backend-e2e-vaccine-catalog-teardown.done`
      existe y está ignorado (`.gitignore:27`).

## Checklist C3: arquitectura
- [x] domain sin imports de infrastructure: no cambia (`git diff --quiet 5c7c9547...ade847fc -- backend-pet-tracker/src`, exit 0).
- [x] Los repositorios y contratos de domain no cambian.
- [x] application no cambia.
- [x] infrastructure no cambia. El único cambio de código es el e2e, fuera de las capas (requirements.md:12-13).

## Checklist C4: TDD
- [x] Cada R tiene su test o su verificación:
  - R1: `it('#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01'`
    (`e2e-spec.ts:321`). El nombre coincide literalmente con requirements.md:224.
  - R2: `it('#237 R2: justo despues de pool.end(), dropDatabase borra la base y el pool no recibe ningun error'`
    (`e2e-spec.ts:351`). Coincide con requirements.md:242.
  - R3 y R4 son requisitos de verificación sin test nuevo, por diseño (requirements.md:255, :284). Sus cuentas y
    comandos los repitió este reviewer (abajo).
  - El `describe` es literal: `describe('#237: dropDatabase no termina sesiones ajenas'` (`e2e-spec.ts:320`),
    detrás del `describe` de `#226 R3` (`:305-318`), como pide design.md:52-53.
- [x] El historial es test-primero. Cada commit toca solo lo suyo (`git show --stat`):
  - `4c93d2c0` test R1 (03:49:30): solo el e2e, +38/−8. Añade `dropDatabase` todavía con `WITH (FORCE)`, cambia el
    `cleanup` para que la use y añade el it de R1. Es lo que prescribe tasks.md:68-90.
  - `5cfbc6a4` fix R1,R3 (03:50:28): solo el e2e, +1/−1. Quita ` WITH (FORCE)` del SQL y nada más (tasks.md:91-92).
  - `83cca578` test R2 (03:51:30): solo el e2e, +26. Añade el segundo it.
  - `ade847fc` docs (03:54:20): solo el reporte y traceability.md.
- [x] **El rojo de R1 es legítimo, verificado por lectura** de `git show 4c93d2c0` contra `86c769e2`:
  - El SQL de `dropDatabase` en el rojo (`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`) es el mismo literal que
    `86c769e2` tenía inline en las dos funciones del `cleanup`. El rojo no cambia el comportamiento de #226.
  - El it deja una sesión ociosa viva (`idleTimeoutMillis: 0`, `:328`; en `pg-pool@3.14.0` `index.js:409` el 0
    desactiva el cierre por inactividad). Con `FORCE` el `DROP` mata la sesión y resuelve, así que
    `rejects.toMatchObject({ code: '55006' })` (`:336-338`) cae con «Received promise resolved instead of rejected».
    El rojo es por aserción.
  - El `57P01` de esa sesión va a la sonda, enganchada antes del primer `query` (`:330-333`). El camino es
    `idleListener` → `_remove` → `pool.emit('error')`, en `pg-pool index.js:51-63`. No escapa como «Unhandled error».
  - En el `finally` (`:345-348`), `pool.end()` resuelve en el acto porque `_clients` ya está vacío
    (`index.js:140-142`), y `dropDatabase` es un no-op por `IF EXISTS`. No queda nada huérfano.
  - No hay `ReferenceError`: `dropDatabase` existe en el commit rojo. No hay dobles de test: la base y `pg` son reales.
- [x] **R2 «nace verde» es legítimo según la spec.** Queda declarado por escrito antes del handoff: está en la firma
      original `d5065fa8` (2026-11-03 23:00:31), anterior al handoff `021ff9b5` (23:14:12).
  - Los textos: requirements.md:243-246 (con `FORCE` su fallo es solo de carrera; su papel es probar que el arreglo
    no convierte el cierre normal en un `55006`) y tasks.md:105-115.
  - E1 lo ratifica sin cambios (requirements.md:333, «Qué no cambia … R2»).
  - El historial lo respeta: `83cca578` va después del arreglo y solo añade el it.
  - La única reserva es que la spec no le asignó mutación de cierre (ver O1).
- [x] Ningún commit rojo falla por `ReferenceError`. Ningún rojo muta un doble.
- [x] Los siete `it('#226` y los cuatro `describe('#226` siguen intactos: 7 y 4 en HEAD, igual que en H0. El diff
      `86c769e2..ade847fc` del e2e solo tiene tres hunks: la función nueva (`:78-80`), las dos funciones de borrado
      del `cleanup` (`:113-118`) y el `describe` de #237 (`:320-376`). Ninguna línea de un it ni de un describe de
      #226 sale como borrada o añadida.

## Checklist C5: trazabilidad
- [x] traceability.md no tiene filas «pendiente» (filas :13-16). La palabra solo aparece en la regla de :18.
- [x] Los hashes son reales y completos, y coinciden con `git show`:
  - `4c93d2c0d8e71225b3bc4859c76939bed9e1a60a`
  - `5cfbc6a4afe399df3f82312e48f8ab2099b5cc9e`
  - `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0`

  Los mensajes de las filas son literales. La fila de R4 remite al commit de cierre sin citar su propio hash, como
  explica el reporte (`impl:588-593`). Es aceptable.
- [x] Los commits siguen los mensajes literales de tasks.md:90, :99, :115 y :161, con la convención
      `test|fix|docs(<scope>)` que declara traceability.md:19. No es el `feat(...)` genérico de CHECKPOINTS C5, pero
      la spec aprobada lo fija así.
- [x] Los cuatro commits llevan el trailer `Codex-Session: 01a1a416-3ff8-7e40-b5d2-de9d6a263ea4`. Es la misma
      clave que usó #236 (`eb45daf8`, `96ba7455`).

## Checklist C6: spec aprobada
- [x] requirements.md:3 tiene `status: approved`.
- [x] La casilla de aprobación humana está marcada con fecha 2026-11-03 (requirements.md:312).
- [x] La casilla de E1 está marcada con fecha 2026-11-04 (requirements.md:337). La cita la frase del humano.
- [x] Ningún requisito cambió después de la aprobación sin pasar por el gate:
  - `d5065fa8..86c769e2` solo añade el texto de excepción de E1. El enunciado EARS de R1 a R4 no cambia.
  - En `86c769e2..ade847fc`, requirements.md, design.md y tasks.md no cambian.

## Checklist C7: sin código huérfano
- [x] La feature sustituye los dos `DROP` inline del `cleanup` por `dropDatabase`, y los inline desaparecen:
      `DROP DATABASE IF EXISTS` da 1 (solo dentro de `dropDatabase`, `:79`) y `WITH (FORCE)` da 0.
- [x] No se elimina ni sustituye ningún fichero, así que no queda ningún test por borrar.

## Verificación de R1–R4 contra el árbol

**R3, cuentas `grep -cF` repetidas por este reviewer en HEAD** (desde `backend-pet-tracker/`). Todas coinciden con
requirements.md:258-270:

| Literal | HEAD | Esperada |
|---|---:|---:|
| `WITH (FORCE)` | 0 | 0 |
| `DROP DATABASE IF EXISTS` | 1 | 1 |
| `async function dropDatabase(name: string): Promise<void>` | 1 | 1 |
| `if (createdA) await dropDatabase(databaseA);` | 1 | 1 |
| `if (createdB) await dropDatabase(databaseB);` | 1 | 1 |
| `() => app?.close(),` | 1 | 1 |
| `() => poolA?.end(),` | 1 | 1 |
| `() => poolB?.end(),` | 1 | 1 |
| `it('#226` | 7 | 7 |
| `it('#237` | 2 | 2 |
| `describe('#237: dropDatabase no termina sesiones ajenas'` | 1 | 1 |

Otras anclas del árbol:
- No cambian: `() => admin?.end(),` = 1, `describe('#226` = 4, `jest.setTimeout(180_000);` = 1,
  `throw new AggregateError(errors, 'Migration e2e cleanup');` = 1 y `process.env.DATABASE_URL = urlA.toString();` = 1.
- `on('error'` = 2 y `new Pool(` = 5: son las sondas y los pools de los dos its nuevos.
- En el rojo `4c93d2c0`: `WITH (FORCE)` = 1, `DROP DATABASE IF EXISTS` = 1 y `it('#237` = 1. Coinciden con tasks.md:84-85.

**R3, `dropDatabase` ya no usa `WITH (FORCE)`.** El SQL es `` `DROP DATABASE IF EXISTS "${name}"` `` (`:79`). Es un
solo `await admin.query(...)` dentro del `describe` externo, junto a `getCatalog`, como pide design.md:18-23.

**R3, orden del `cleanup`** (`:105-124`). Es el mismo que en requirements.md:83-90:
1. `app?.close()`
2. `poolA?.end()`
3. `poolB?.end()`
4. restaurar `DATABASE_URL`
5. `dropDatabase(databaseA)`
6. `dropDatabase(databaseB)`
7. `admin?.end()`
8. `rmSync`

El bucle de errores y el `AggregateError` no cambian. Solo cambian las dos funciones del `DROP`.

**R1 y R2 frente a design.md:56-95:**
- Nombres de base: `pet_tracker_237_live_${runId}` y `pet_tracker_237_ended_${runId}`, de 35 caracteres como mucho.
- La URL se construye cambiando solo `pathname`.
- La sonda va antes del primer `query`.
- La cuenta usa `count(*)::int`.
- Los valores esperados son literales escritos a mano: `'55006'`, `1`, `0` y `[]`.
- En R2 no hay nada entre `await pool.end()` (`:363`) y `dropDatabase` (`:364`).
- El `finally` usa `if (!pool.ending)`, lo que evita el «Called end on pool more than once» de `index.js:490-492`.

**R4, alcance** (repetido por este reviewer):
- `git diff --name-only 5c7c9547...ade847fc -- backend-pet-tracker/` lista solo el e2e.
- `git diff --quiet 5c7c9547...ade847fc -- backend-pet-tracker/src backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml` da exit 0.
- `86c769e2..ade847fc` no toca `scripts/`, `src/`, migraciones (`*.sql`, `drizzle*`), `package.json` ni `pnpm-lock.yaml`: 0 rutas.
- `tsc` y `eslint` dan exit 0, corridos por este reviewer.
- La suite unitaria no la corrió este reviewer (prohibida). El log de Codex `/tmp/impl-237-unit.log` (mtime
  03:53:00) dice `Test Suites: 198 passed, 198 total`, `Tests: 1650 passed, 1650 total` y 0 `Unhandled error`.
  Cuadra con `impl:541-555`.

**M1, documentada** (`impl:441-483`) y contrastada con `/tmp/impl-237-e2e.log`. Es la última corrida e2e: mtime
03:51:54, después del commit de R2 (03:51:30) y antes del de cierre.
- Da `Tests: 1 failed, 8 passed, 9 total`.
- El único fallo es el it de R1, con «Received promise resolved instead of rejected» en la línea 336, que es la del
  `rejects` en HEAD.
- Hay 0 `Unhandled error`.
- `grep -cF "database: 'pet_tracker_226_"` = 0 y `grep -cF "database: 'pet_tracker_237"` = 0.
- La mutación no se commiteó: `83cca578..ade847fc` no toca el e2e, y HEAD tiene `WITH (FORCE)` = 0.

**El criterio E1 se aplicó bien.**
- Según el reporte, T0 (`impl:329-330`), el rojo (`:367-369`) y M1 (`:471-473`) no trajeron `Unhandled error`.
  Por eso no hizo falta la excepción, y las cuentas E1 quedaron anotadas (0 y 0).
- En M1 este reviewer lo confirma con el log.
- Los logs de T0 y del rojo se sobrescribieron, así que para esos dos pasos la evidencia es el reporte.
- El verde, R2 y R4 tampoco traen `Unhandled error`, que es lo que exige requirements.md:333-335.

**El reporte de la sesión 1 se conserva como prefijo.** El diff del reporte en `86c769e2..ade847fc` no borra ninguna
línea, y la sesión 2 empieza en `impl:234`.

## Observaciones (no bloquean)
- **O1 (baja): R2 no tiene mutación de cierre.**
  - Lo decidió la spec: design.md:132-137 dice que con M1 «no se exige nada» de R2 y que «No hay más mutaciones».
  - Por eso las aserciones de R2 nunca se han visto en rojo. CHECKPOINTS C4, vía (b), pide mutación para un
    requisito de verificación. Aquí la excepción está firmada, pero sin esa prueba.
  - Hay evidencia indirecta de que R2 no es tautológico. La misma consulta de `pg_database` da 1 en R1 y 0 en R2,
    las dos en verde. La misma `dropDatabase` rechaza en R1 y resuelve en R2. Con una `dropDatabase` sin efecto, R2
    caería en `:369`.
  - No es exigible al implementador: la spec y la lista cerrada no le dejan añadir una mutación. Si el leader la
    quiere, va como enmienda.
- **O2 (baja): `expect(errors).toEqual([])` no se ha visto en rojo en ningún it.**
  - En el rojo y en M1, el it de R1 cae antes, en el `rejects` (`:336`).
  - Que la sonda vive se infiere de la cuenta E1 `pet_tracker_237` = 0 en M1: sin sonda, el `57P01` de esa base
    habría salido como «Unhandled error». Es una inferencia, no una observación.
- **O3 (leader): `progress/current.md` no menciona #237**, ni en esta rama ni en `origin/main` ni en `origin/dev`.
  Conviene registrarlo al cerrar.
- **O4 (leader): no rebasear la rama.** Los hashes de traceability.md:13-16 caducarían (memoria
  `rebase-invalida-hashes-traceability`).
- **O5 (leader): los logs de `/tmp` siguen ahí.** `/tmp/impl-237-e2e.log` y `/tmp/impl-237-unit.log` quedan para
  que los borre el leader (handoff:187).

## Output de ./init.sh
```
Pendiente del leader: el reviewer no lo corrió, por la prohibición expresa del encargo y porque el clasificador se
lo deniega (memoria init-sh-reviewer-denegado). Este veredicto es estático. Pasa a final solo con init=0 sobre
HEAD ade847fc, medido sin pipe.
```

Leader, 2026-11-04, sobre HEAD `ade847fc`, medido sin pipe (`./init.sh > log 2>&1; echo "init=$?"`):

- **Corrida 1 (04:17–04:27 UTC): `init=1`.**
  - Backend unitario verde: `Tests: 1650 passed, 1650 total`. Infra: `Tests: 14 passed, 14 total`.
  - Cayó el jest móvil: `Test Suites: 4 failed, 176 passed, 180 total`, `Tests: 4 failed, 6560 passed, 6564 total`.
    - Dos `Exceeded timeout of 5000 ms`, en `reset-password` (#183 R6) y en `register` (#183 R4).
    - Dos suites matadas por SIGKILL: `celebration` («A jest worker process … was terminated by another process:
      signal=SIGKILL») y `pet-members`, que tardó 241 s.
  - init.sh se paró ahí, así que el e2e del backend no llegó a correr.
  - La rama no toca `mobile-pet-tracker/` (`git diff --quiet origin/dev...HEAD -- mobile-pet-tracker` da exit 0).
    Empezó 14 s después de que terminara el init.sh de #238.
  - El log entero está en el scratchpad del leader, en `init-237-red1.log`.
- **Corrida 2 (04:38–04:46 UTC), con `/tmp/jest_ru/perf-cache-*` borrado y sin jest ni init.sh corriendo:
  `init=0`.**
  - backend unitario: `Tests: 1650 passed, 1650 total`;
  - infra: `Tests: 14 passed, 14 total`;
  - móvil: `Test Suites: 180 passed, 180 total`, `Tests: 6630 passed, 6630 total`;
  - backend e2e: `Test Suites: 3 skipped, 33 passed, 33 of 36 total`, `Tests: 8 skipped, 601 passed, 609 total`.
    Son dos tests más que los 607 de la corrida verde de #238, que son R1 y R2 de esta feature.
  - `grep -c 'Unhandled'` y `grep -c '57P01\|terminating connection'` sobre el log dan `0` los dos.

El veredicto queda **aprobado**. Los rojos móviles de la corrida 1 son de carga, en código que esta rama no toca, y
no son deuda de #237. El flake 57P01 de #226, que E1 aceptaba, no apareció.
