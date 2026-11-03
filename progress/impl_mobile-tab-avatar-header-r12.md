# Implementación #222 R12 — carta N1

Fecha: 2026-11-03. Estado: R12 implementado y verificado; cierre de trazabilidad.

## Worktree, autorización y bases

Handoff releído completo: `progress/handoff_mobile-tab-avatar-header-r12.md`.
Primer comando indicado, ejecutado con salida 0:

```sh
cd /home/claude/sites/Pet-Tracker-wt-222r12 && pwd && git branch --show-current
```

```text
/home/claude/sites/Pet-Tracker-wt-222r12
feature/222-r12-charter-n1
```

- H0 original, conservado por instrucción del humano: `b2e260e9973ec40d0aca195f15d3817044d0ebdd`.
- Enmienda del leader presente al reanudar y base del control de lista cerrada:
  `42a813a74af332626488818e76ebec56305e3746` (`42a813a7`). Permite el historial
  test primero rojo→verde en la misma rama/PR (R12.3).
- Árbol limpio al reanudar. Alcance exclusivo R12, destino de integración `dev`.
- Leídos R12.1, R12.2, R12.3 completos y `design.md` §2; G4 marcada por humano
  el 2026-11-03. `grep -cE '^- \[[xX]\] G4 ' specs/mobile-tab-avatar-header/requirements.md`: `1`.
- No cargué `building-native-ui` ni `appllama-app-design-skill`, porque el alcance
  es solo carta y tests. `expo:expo-overview` no existe en Codex. Se mantiene
  `ponytail`; leída la [referencia Expo v57](https://docs.expo.dev/versions/v57.0.0/)
  que exige `mobile-pet-tracker/AGENTS.md`.

## Esperas y concurrencia

`docs/conventions.md` §Esperas sobre el árbol renderizado: la condición que
termina una espera debe observar lo mismo que las aserciones; si se asevera el
árbol se espera al árbol, y una ausencia se ancla primero a un nodo positivo o
a su estado final. Estos candados leen archivos de forma síncrona y no añaden
esperas de renderizado ni esperas a mocks o caché.

A las 18:45:14 UTC, `pgrep -af '[j]est|[i]nit.sh'`, filtrando el shell propio
y sus ancestros por PID: `Sin jest ni init.sh ajenos`. Comprobación inmediatamente
anterior a la primera corrida. No se lanzó un test mientras hubiera procesos ajenos.

## Cadena y verificaciones

Primera corrida, contra la carta vieja:

```sh
bunx jest --runTestsByPath src/__tests__/tab-headers-canvas.test.ts src/__tests__/hero-header-amendments.test.ts --silent
```

```text
Test Suites: 2 failed, 2 total
Tests:       5 failed, 18 passed, 23 total
Snapshots:   0 total
Time:        21.056 s
exit:        1
```

Los cinco `it` fallidos:

- `#222 R12: la carta recoge la enmienda N1 de #222`.
- `aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11) (enmendado por #222 R12)`.
- `#222 R11: inserta el bloque literal de design.md §2 en los siete documentos (enmendado por #222 R12)`.
- `#222 R11: deja en cada documento su línea de firma propia, marcada o no (enmendado por #222 R12)`.
- `#222 R11: aplica además el marcador en prosa de la tabla R11.1 (enmendado por #222 R12)`.

Commit 1 (solo los dos tests): `95b50ed7799d3cb6d4b6c82ae5e2a1a1bd256af3`
— `test(mobile): #222 R12 charter N1 amendment tests`.

Después de reescribir la carta, la misma orden dio:

```text
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/tab-headers-canvas.test.ts
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.909 s, estimated 20 s
exit:        0
```

La regla N1 coincide byte a byte con el literal de R12.1. El bloque canónico
de `design.md` §2 va tras #209; su firma usa la línea específica de la carta
indicada por el handoff, la nota humana del precedente #209 y una referencia
a §Aprobación, casilla G4. Las seis firmas de otras specs permanecen sin marcar.

Commit 2 (solo carta): `eb2bced7257a671810cb16f5acad9c9c279d73b9`
— `docs(ui): #222 R12 charter rule N1`.

## Mutación y restauración

Plantada una mutación: sustituir la única cabecera de regla
`**Regla N1 (enmienda #222)**` por `**Regla N1 (enmienda #196)**`, conservando
el resto de la línea y del archivo. Misma orden de los dos tests; salida
filtrada a títulos y resumen, preservando el exit de Jest con `pipefail`:

```text
FAIL src/__tests__/hero-header-amendments.test.ts
  ● #168 R11: las specs enmendadas por #168 llevan su bloque › aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11) (enmendado por #222 R12)
  ● #222 R11: las specs enmendadas por #222 llevan su bloque › #222 R11: aplica además el marcador en prosa de la tabla R11.1 (enmendado por #222 R12)
FAIL src/__tests__/tab-headers-canvas.test.ts
  ● #196 R11: alcance de la cabecera a sangre › #222 R12: la carta recoge la enmienda N1 de #222
Test Suites: 2 failed, 2 total
Tests:       3 failed, 20 passed, 23 total
Snapshots:   0 total
Time:        2.027 s
exit:        1
```

Restauración exigida:

```sh
git checkout HEAD -- docs/ui-guidelines.md
git diff --exit-code HEAD -- docs/ui-guidelines.md
```

Salida 0, diff vacío; comprobado además que los bytes coinciden con
`git show HEAD:docs/ui-guidelines.md`.

## Verificación final

Desde la raíz:

```sh
grep -cF '**Regla N1 (enmienda #196)**' docs/ui-guidelines.md
grep -cF '**Regla N1 (enmienda #222)**' docs/ui-guidelines.md
```

Salida: `0` y `1`, respectivamente (el primer grep sale 1 por cero coincidencias).

Tras restaurar, corrida final de los dos archivos con la orden literal del handoff:

```text
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/tab-headers-canvas.test.ts
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        2.168 s
exit:        0
```

Suite de guardas, desde `mobile-pet-tracker/`, tras comprobar de nuevo que no
había `jest` ni `init.sh` ajenos:

```sh
bunx jest src/__tests__ src/app/__tests__ src/components/__tests__
```

```text
Test Suites: 79 passed, 79 total
Tests:       1642 passed, 1642 total
Snapshots:   1 passed, 1 total
Time:        112.965 s
exit:        0
```

Una sola corrida de guardas, sin OOM ni suites «failed to run». La salida
incluye los mensajes informativos de HeroUI de los tests existentes.

TypeScript y lint, desde `mobile-pet-tracker/`:

```sh
bunx tsc --noEmit > ../progress/tsc_222r12.log 2>&1; echo $?
bunx expo lint > ../progress/lint_222r12.log 2>&1 && test ! -s ../progress/lint_222r12.log; echo $?
```

Salida de cada orden: `0`. Medición, tras terminar ambos procesos:

```text
0 progress/tsc_222r12.log
0 progress/lint_222r12.log
0 total
```

Ambos logs borrados después de medirlos. `git diff --check`: salida 0.

## Cierre y alcance

El tercer commit, `docs(spec): #222 R12 traceability`, contiene solo la fila R12
de `traceability.md` (hashes literales de los dos primeros commits y sin
«pendiente» en esa fila), las tres casillas de R12 en `tasks.md` y este reporte.
R12.4 no aplica porque G4 ya estaba marcada. No se cambia el estado global de
la feature ni se declaran implementados otros requisitos.

Control de lista cerrada contra la enmienda del leader:

```sh
git diff --name-only 42a813a7..HEAD
```

Archivos de la entrega:

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
progress/impl_mobile-tab-avatar-header-r12.md
specs/mobile-tab-avatar-header/tasks.md
specs/mobile-tab-avatar-header/traceability.md
```

Las seis specs de R11.1 conservan cada una su firma
`- [ ] Enmienda #222 aprobada por humano`, comprobadas junto con su diff vacío
contra `42a813a7`. Sin cambios en producción, otras specs, dependencias,
`feature_list.json`, `progress/current.md` ni `STATUS.md`; rige la lista cerrada
específica de este handoff.

El marcador `progress/impl_mobile-tab-avatar-header-r12.done` se crea como
último acto, con la ruta absoluta de este reporte y sin commitearlo. La PR y
el gate global `init.sh` quedan a cargo del leader según el handoff.

`init.sh` queda a cargo del leader, por prohibición del handoff. Sin fetch,
merge, rebase, instalaciones, dependencias nuevas ni apertura/edición de PR.
