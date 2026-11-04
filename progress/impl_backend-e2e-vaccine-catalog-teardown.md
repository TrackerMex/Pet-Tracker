# Implementación #237 — backend-e2e-vaccine-catalog-teardown

Fecha: 2026-11-04 (UTC). Sesión Codex: `01a1a416-3ff8-7e40-b5d2-de9d6a263ea4`.
Handoff: `progress/handoff_backend-e2e-vaccine-catalog-teardown.md`, leído entero.
Spec aprobada por el humano y firmada por el leader en `d5065fa8`.

**Resultado: PARA en el rojo de R1.** Además de la aserción esperada hubo un
`Unhandled error` con `57P01`, salida que el handoff prohíbe aceptar. No se
creó ningún commit. El e2e quedó restaurado a H0. El marcador `.done` señala
que el reporte está disponible, no que la feature esté terminada. La limpieza
del log también se detuvo por una denegación de ejecución, detallada abajo.

## Comprobación inicial y base H0

Comando requerido:

```sh
cd /home/claude/sites/Pet-Tracker-wt-237 && pwd && git branch --show-current && git log --oneline -4
```

Salida:

```text
/home/claude/sites/Pet-Tracker-wt-237
feature/237-backend-e2e-vaccine-catalog-teardown
021ff9b5 docs(progress): #237 codex handoff
d5065fa8 chore(spec): sign #237 (approved by the human 2026-11-03)
2fb499b4 Merge remote-tracking branch 'origin/dev' into feature/237-backend-e2e-vaccine-catalog-teardown
9f1e6824 docs(spec): #237 signature needs the human's explicit approval
```

H0: `021ff9b502ca609f2656e82ae71ed13212e1eccc`. Árbol inicialmente limpio.
Alcance de implementación: un único e2e; trazabilidad y este reporte como documentación.
No se ejecuta `./init.sh`: lo corre el leader. No se instala nada ni se lee `.env`.
No se hace fetch, merge, rebase, push ni se abre o edita la PR.

Anclas medidas con `grep -cF` desde `backend-pet-tracker/`, antes de editar el e2e
y antes del primer commit:

| Literal en `test/vaccine-catalog-migration.e2e-spec.ts` | Medida | Esperada |
|---|---:|---:|
| `WITH (FORCE)` | 2 | 2 |
| `DROP DATABASE IF EXISTS` | 2 | 2 |
| `dropDatabase` | 0 | 0 |
| `on('error'` | 0 | 0 |
| `it('#226` | 7 | 7 |
| `describe('#226` | 4 | 4 |
| `it('#237` | 0 | 0 |
| `pet_tracker_237` | 0 | 0 |

## Comandos y esperas

Antes de los comandos del backend:

```sh
cd /home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker && pwd
```

Salida: `/home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker`.

Antes de **cada** ejecución de Jest, las dos órdenes siguientes se ejecutan
por separado, en este orden, sin omitirlas en reintentos ni mutaciones:

```sh
test -z "${DATABASE_URL:-}"; echo "$?"
```

```sh
for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"
```

| Corrida | Guarda DATABASE_URL | Guarda init.sh |
|---|---|---|
| T0, primera | `0` | `espera=1` |
| T0, reintento permitido | `0` | `espera=1` |
| R1, intento de rojo | `0` | `espera=1` |

Orden e2e literal, con el código de salida medido sin pipe:

```sh
FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts > /tmp/impl-237-e2e.log 2>&1; echo "exit=$?"
grep -E '^(Test Suites|Tests):' /tmp/impl-237-e2e.log
```

## T0 sobre H0, antes de tocar código

Primera corrida:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       7 passed, 7 total
Unhandled error. (error: terminating connection due to administrator command
code: '57P01',
```

Es el flake explícitamente previsto en el handoff. Se repite una vez tras
ejecutar de nuevo las dos esperas; no se cambia código entre ambas corridas.

Reintento permitido, sobre el mismo H0:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

## R1 — intento de rojo y parada obligatoria

Se extrae `dropDatabase` con el SQL original, todavía con `WITH (FORCE)`, y se
redirigen a él las dos llamadas del `cleanup`. Se añade la sonda de errores
antes del primer `pool.query` del nuevo it R1. Su `finally` cierra el pool y
borra su propia base incluso cuando falla la aserción.

Antes del e2e se ejecutaron, en el orden prescrito, desde el backend:

```sh
pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts
pnpm exec prettier --check test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
```

Resultados: `prettier --write` terminó con código 0; la cadena de formato,
eslint y tsc terminó con `exit=0`. No hubo errores de formato, lint o tipos.
Las dos cuentas del rojo dieron lo previsto:

| Literal (`grep -cF`) | Medida | Esperada |
|---|---:|---:|
| `WITH (FORCE)` | 1 | 1 |
| `DROP DATABASE IF EXISTS` | 1 | 1 |

Tras las dos guardas registradas arriba se ejecutó la orden e2e literal.
Su salida fue:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
```

Único it fallido:

```text
#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01
```

Aserción y recibido:

```text
expect(received).rejects.toMatchObject()
Received promise resolved instead of rejected
Resolved to value: undefined
```

La aserción era:

```ts
await expect(dropDatabase(name)).rejects.toMatchObject({
  code: '55006',
});
```

Pero la misma corrida incluyó, además:

```text
● Test suite failed to run
Unhandled error. (error: terminating connection due to administrator command
code: '57P01',
```

**Diferencia que obliga a parar:** las cifras coinciden, pero el rojo no es
solo por aserción: también hay `Unhandled error` con `57P01`. El handoff
§Orden y commits (2) dice: «El rojo tiene que ser por aserción, nunca por
`Unhandled error`, `ReferenceError` ni tipos». §Reglas críticas exige parar
si una salida no coincide. La sonda sí estaba antes del primer `query`; no
se cambió la spec ni se añadió ningún listener a los pools existentes.

No se repitió este rojo: no fue un timeout aislado, y el permiso de repetir
por `57P01` se limita expresamente a T0. No se intentó ningún workaround.

## Commits y pasos no ejecutados

HEAD sigue en `021ff9b502ca609f2656e82ae71ed13212e1eccc` (H0).
No se creó el commit rojo
`test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)`:
la salida no cumple su gate.

No se ejecutaron el verde de R1, R2, las cuentas finales de R3, la mutación
M1, el diff final de `cleanup`, R4 ni la suite unitaria. No hay hashes ni
resultados de esos pasos que reportar. Los tsc y eslint que sí pasaron son
los previos al intento de rojo; no sustituyen la verificación final de R4.

No se creó el commit de cierre ni se rellenó `traceability.md`: la cadena
se detuvo antes de lograr los requisitos. El reporte queda sin commit para
que el leader evalúe esta parada; no se marca ningún requisito como cerrado.

## Restauración y limpieza tras PARA

Se descartaron exclusivamente los cambios propios del e2e no commiteado:

```sh
git checkout HEAD -- test/vaccine-catalog-migration.e2e-spec.ts
git diff --quiet HEAD -- test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"
```

Resultado: `exit=0`. No se conserva ningún cambio parcial en el backend ni
en la spec. No se tocaron otros ficheros versionados, no se ejecutó
`./init.sh` y no se actuó sobre AWS ni sobre procesos o bases ajenas.

Se intentó la limpieza exigida por el handoff:

```sh
rm -f /tmp/impl-237-e2e.log /tmp/impl-237-unit.log
```

**Segundo PARA:** la revisión automática de ejecución rechazó esa orden
antes de lanzarla:

```text
rm -f style commands are not permitted. Use a safer approach
```

El handoff ordena parar y reportar cualquier denegación; no se reintenta el
borrado mediante otra vía. `/tmp/impl-237-e2e.log` queda pendiente de borrar
por el leader; `/tmp/impl-237-unit.log` no fue creado en esta sesión. La
evidencia necesaria está transcrita arriba.

La comprobación final `git status --short -- backend-pet-tracker specs`
salió vacía. El único artefacto nuevo previo al marcador es este reporte.

Siguiente paso del leader: decidir cómo obtener un rojo de R1 que respete
el gate frente al flake del teardown aún presente en esa fase. Se requiere
un handoff actualizado antes de continuar; esta sesión no adapta la spec.

## Sesión 2 (tras la enmienda E1)

Fecha: 2026-11-04 (UTC). Sesión Codex:
`01a1a416-3ff8-7e40-b5d2-de9d6a263ea4`.
Se conserva íntegro el reporte anterior. La reanudación sigue el handoff
actualizado, requirements, design, tasks y traceability, leídos enteros.
E1 está aprobada por el humano y firmada por el leader en `86c769e2`.

### Base H0 y anclas de esta sesión

Comando requerido:

```sh
cd /home/claude/sites/Pet-Tracker-wt-237 && pwd && git branch --show-current && git log --oneline -4
```

Salida:

```text
/home/claude/sites/Pet-Tracker-wt-237
feature/237-backend-e2e-vaccine-catalog-teardown
86c769e2 chore(spec): sign #237 E1 (approved by the human 2026-11-04)
70d46a9a docs(spec): #237 E1 accept the #226 flake in the FORCE runs
021ff9b5 docs(progress): #237 codex handoff
d5065fa8 chore(spec): sign #237 (approved by the human 2026-11-03)
```

H0 de esta sesión: `86c769e29460913a9111fe7fbaec4f0d5f971ed8`.
Árbol inicialmente limpio. Antes de los comandos del backend se ejecutó:

```sh
cd /home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker && pwd
```

Salida: `/home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker`.

Anclas re-medidas con `grep -cF` antes de editar el e2e y del primer commit:

| Literal del e2e | Medida | Esperada |
|---|---:|---:|
| `WITH (FORCE)` | 2 | 2 |
| `DROP DATABASE IF EXISTS` | 2 | 2 |
| `dropDatabase` | 0 | 0 |
| `on('error'` | 0 | 0 |
| `it('#226` | 7 | 7 |
| `describe('#226` | 4 | 4 |
| `it('#237` | 0 | 0 |
| `pet_tracker_237` | 0 | 0 |

### Esperas y órdenes de ejecución

Antes de cada corrida de Jest, desde el backend, se ejecutan estas órdenes
por separado y en este orden:

```sh
test -z "${DATABASE_URL:-}"; echo "$?"
```

```sh
for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"
```

| Corrida de esta sesión | DATABASE_URL | init.sh |
|---|---|---|
| T0 | `0` | `espera=1` |
| R1 rojo | `0` | `espera=1` |
| R1 verde | `0` | `espera=1` |
| R2 | `0` | `espera=1` |
| M1 | `0` | `espera=1` |
| R4 unitarios | `0` | `espera=1` |

Orden e2e usada en todos los pasos, con código de salida medido sin pipe:

```sh
FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts > /tmp/impl-237-e2e.log 2>&1; echo "exit=$?"
grep -E '^(Test Suites|Tests):' /tmp/impl-237-e2e.log
```

Antes de cada commit que toca el e2e, el orden es:

```sh
pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts
pnpm exec prettier --check test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
```

Después de esos checks se pasan ambas guardas y se corre el e2e.

### T0 sobre H0, antes de modificar ficheros

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

`grep -cF 'Unhandled error' /tmp/impl-237-e2e.log` dio `0`. Las dos cuentas
E1 también dieron `0` y `0`; no hizo falta aplicar la excepción ni repetir T0.

### R1 — rojo

Se extrae `dropDatabase` con el SQL original con `FORCE` y se redirigen a él
las dos funciones de borrado del `cleanup`. Se añade solo R1, con la sonda
antes del primer `query` y con cierre y borrado de su propia base en `finally`.

`prettier --write`: código 0. Cadena `prettier --check && eslint && tsc`:
`exit=0`. Después, el e2e dio:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
```

Único it fallido:

```text
#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01
```

Aserción:

```ts
await expect(dropDatabase(name)).rejects.toMatchObject({ code: '55006' });
```

Recibido:

```text
expect(received).rejects.toMatchObject()
Received promise resolved instead of rejected
Resolved to value: undefined
```

No hubo `Unhandled error`, `ReferenceError`, errores de tipos ni timeout.
Las cuentas E1 del log dieron `0` para `database: 'pet_tracker_226_` y `0`
para `database: 'pet_tracker_237`; no se necesitó la excepción. Las cuentas
del e2e dieron `WITH (FORCE)` = `1` y `DROP DATABASE IF EXISTS` = `1`, ambas
iguales a las esperadas.

Commit rojo: `4c93d2c0d8e71225b3bc4859c76939bed9e1a60a` —
`test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)`.
Solo contiene el e2e y lleva el trailer `Codex-Session` de esta sesión.

### R1 — verde

Único cambio de código respecto al rojo: quitar ` WITH (FORCE)` del SQL de
`dropDatabase`.

`prettier --write`: código 0. Cadena `prettier --check && eslint && tsc`:
`exit=0`. Después de ambas guardas, el e2e dio:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

`grep -cF 'WITH (FORCE)'` sobre el e2e dio `0`, igual a la esperada.
`grep -cF 'Unhandled error' /tmp/impl-237-e2e.log` dio `0`.
No se necesitó ningún refactor.

Commit verde: `5cfbc6a4afe399df3f82312e48f8ab2099b5cc9e` —
`fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)`.
Solo cambia una línea del e2e y lleva el trailer `Codex-Session`.

### R2 — test que nace verde

Se añade el segundo it literal de design. La llamada a `dropDatabase` va
inmediatamente después de `await pool.end()`, sin nada intercalado.

`prettier --write`: código 0. Cadena `prettier --check && eslint && tsc`:
`exit=0`. Tras ambas guardas, el e2e dio:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

`grep -cF 'Unhandled error' /tmp/impl-237-e2e.log` dio `0`. Nace verde tras
el arreglo de R1, como justifica requirements R2: con `FORCE` su fallo
depende de una carrera. No hubo implementación adicional ni refactor.

Commit R2: `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0` —
`test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)`.
Solo contiene el segundo it del e2e y lleva el trailer `Codex-Session`.

### R3 — cuentas, M1 y orden de cleanup

Cuentas medidas sobre el HEAD de R2 con una llamada a `grep -cF` por literal:

| Literal del e2e | Medida | Esperada |
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

El e2e completo ya dio `Tests: 9 passed, 9 total`, `exit=0`, en R2.

M1 se planta con `apply_patch`, solo sobre el SQL de `dropDatabase`:

```diff
 async function dropDatabase(name: string): Promise<void> {
-  await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
+  await admin.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
 }
```

La mutación no se commitea. Se pasan ambas guardas y se ejecuta la misma
orden e2e literal registrada arriba.

Resultado de M1:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 passed, 9 total
```

Único it que cae:

```text
#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01
expect(received).rejects.toMatchObject()
Received promise resolved instead of rejected
Resolved to value: undefined
```

`grep -cF 'WITH (FORCE)' test/vaccine-catalog-migration.e2e-spec.ts` dio `1`,
igual a la esperada. R2 salió verde en esta corrida (la spec permite ambos
resultados con M1). No hubo `Unhandled error`; ambas cuentas E1 del log
dieron `0` y `0`. No se necesitó la excepción.

Restauración literal desde el backend:

```sh
git checkout HEAD -- test/vaccine-catalog-migration.e2e-spec.ts
git diff --quiet HEAD -- test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"
```

Salida: `exit=0`. M1 no se commiteó; el archivo coincide con el HEAD de R2,
cuya suite completa ya pasó con los nueve tests.

Orden de `cleanup`, comando desde el backend:

```sh
git diff 5c7c9547 -- test/vaccine-catalog-migration.e2e-spec.ts
```

Hunk que afecta al array:

```diff
@@ -107,16 +111,10 @@ describe('#226 vaccine catalog migration (e2e)', () => {
         else process.env.DATABASE_URL = originalDatabaseUrl;
       },
       async () => {
-        if (createdA)
-          await admin.query(
-            `DROP DATABASE IF EXISTS "${databaseA}" WITH (FORCE)`,
-          );
+        if (createdA) await dropDatabase(databaseA);
       },
       async () => {
-        if (createdB)
-          await admin.query(
-            `DROP DATABASE IF EXISTS "${databaseB}" WITH (FORCE)`,
-          );
+        if (createdB) await dropDatabase(databaseB);
       },
       () => admin?.end(),
       () => {
```

Solo cambian las dos funciones de borrado. El array conserva delante
`app?.close()`, `poolA?.end()`, `poolB?.end()` y la restauración de
`DATABASE_URL`, en ese orden. Después siguen `admin?.end()` y `rmSync`.
El bucle que recoge errores y el `AggregateError` no cambian.

### R4 — alcance y checks finales

Verificación desde la raíz sobre `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0`:

```sh
git diff --name-only 5c7c9547...HEAD -- backend-pet-tracker/
```

Salida exacta:

```text
backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts
```

```sh
git diff --quiet 5c7c9547...HEAD -- backend-pet-tracker/src backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml; echo "exit=$?"
```

Salida: `exit=0`. No hay cambios en producción, migraciones, dependencias
ni otros tests.

Suite unitaria, después de pasar las dos guardas:

```sh
FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000 > /tmp/impl-237-unit.log 2>&1; echo "exit=$?"
```

Salida:

```text
exit=0
Test Suites: 198 passed, 198 total
Tests:       1650 passed, 1650 total
```

`grep -cF 'Unhandled error' /tmp/impl-237-unit.log` dio `0`.

Tipos, desde el backend:

```sh
pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
```

Salida: `exit=0`.

Lint, desde el backend:

```sh
pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"
```

Salida: `exit=0`.

### Cierre de esta sesión

Se completaron R1–R4 según el handoff actualizado. No hubo ningún PARA,
timeout ni denegación en esta segunda sesión. E1 no tuvo que aplicarse:
T0, el rojo y M1 no produjeron `Unhandled error`. El verde, R2 y la suite
unitaria tampoco tuvieron errores no manejados.

Cadena de implementación, con sus resultados medidos antes de cada commit:

| Commit | Mensaje literal | Tests | Exit |
|---|---|---|---|
| `4c93d2c0d8e71225b3bc4859c76939bed9e1a60a` | `test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)` | `1 failed, 7 passed, 8 total` | `1` |
| `5cfbc6a4afe399df3f82312e48f8ab2099b5cc9e` | `fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)` | `8 passed, 8 total` | `0` |
| `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0` | `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)` | `9 passed, 9 total` | `0` |

El cuarto commit es el de cierre que contiene esta sección y la tabla de
trazabilidad, con el mensaje literal
`docs(backend-e2e-vaccine-catalog-teardown): mutation evidence and traceability (R1,R2,R3,R4)`.
Su hash se consulta con `git log -1 --format='%H %s'` al terminar: no se
reescribe el commit para incluir su propio hash. Solo contiene el reporte
y `specs/backend-e2e-vaccine-catalog-teardown/traceability.md`.

El reporte de la primera sesión se conserva byte a byte como prefijo del
archivo; todos los cambios de esta sesión están en esta sección añadida.
Los siete its y los cuatro describes originales de #226 siguen intactos.
Se conserva el orden completo del `cleanup`, salvo la delegación de los
dos borrados a `dropDatabase`. La mutación está restaurada y no versionada.

No se ejecutó `./init.sh`, no se instaló nada y no se abrió ni leyó `.env`.
No se hizo fetch, merge, rebase, push ni se abrió o editó la PR. No se
modificaron feature_list, STATUS, los frontmatters ni las aprobaciones.
Al leader le corresponden `./init.sh`, revisión y PR contra `dev`.

No se borran los logs de `/tmp`: quedan `/tmp/impl-237-e2e.log` (última
corrida, M1 deliberadamente roja) y `/tmp/impl-237-unit.log` (verde). Los
resultados del verde final del e2e están transcritos en R2; tras M1 el
archivo se restauró exactamente a ese commit.

La comprobación final exigida es
`git status --short -- backend-pet-tracker specs`: debe quedar vacía tras
el commit de cierre. Después se crea, sin commitear, el marcador
`progress/impl_backend-e2e-vaccine-catalog-teardown.done` con una sola línea:
la ruta absoluta de este reporte.
