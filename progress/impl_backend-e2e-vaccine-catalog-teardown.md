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
