---
feature: "mobile-jest-virtual-mock-poisoning"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, test-infra, spec]
---

# Tareas — [[mobile-jest-virtual-mock-poisoning]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Para lo que se cierra
> por verificación (vía b), el sub-item (1) es un test que ya pasa más la
> mutación de la tabla de abajo, y el (2) es revertirla. Los R rojos (vía a)
> siguen el orden clásico: test rojo, implementación, verde.
>
> Aquí todo es código de test: no hay producción que mutar. Las mutaciones se
> plantan en tests o en el propio candado, y la evidencia es siempre la
> **aserción** que falla (C4). Un `ReferenceError`, un import inexistente o un
> doble alterado no cuentan.

## Orden de commits

Rama `feature/207-mobile-jest-virtual-mock-poisoning`, creada desde `origin/dev`
(`329c613c`). Seis commits, en este orden. H0 es el HEAD de la rama al lanzar el
handoff; si el leader lo avanza, todos los `<H0>` de abajo se leen contra ese hash.

- **A** `test(mobile): candado de la opción virtual de jest.mock (R1,R2)`. Añade
  `mobile-pet-tracker/src/__tests__/jest-virtual-mock-lock.test.ts` completo (D3 a D12 de
  [[design]]) y nada más en `mobile-pet-tracker/`. Rojo por aserción en `#207 R1` y en el
  primer `it` de `#207 R2` (`toEqual([])` recibe las cuatro violaciones de §Anclas). El
  segundo `it` de `#207 R2` nace verde. El candado solo importa `fs` y `path`: no hay
  símbolo que falte, así que el rojo no es un `ReferenceError`. CC1 aquí da `exit=1`.
- **B** `test(mobile): quita la opción virtual de los cuatro tests (R1,R2)`. Borra
  `  { virtual: true },` en `food`, `health` y `meal-schedule`, y cambia `}), { virtual: true });`
  por `}));` en `profile` (D1, D2). Verde en todo. CC1 aquí da `exit=0` y 477 verdes (errata E1).
- **C** `test(mobile): mutaciones de datos del candado (R1,R2)`. Aplica a la vez M-R1a,
  M-R2a, M-R2b, M-R2c y M-R2d (tabla de abajo). Rojo por aserción: `#207 R1` y el primer
  `it` de `#207 R2`.
- **D** `test(mobile): revierte mutaciones de datos del candado (R1,R2)`. Deshace
  exactamente lo de C. Verde.
- **E** `test(mobile): mutaciones del recorrido del candado (R2)`. Aplica M-R2e y M-R2f
  sobre el recorrido del candado. Rojo por aserción: el segundo `it` de `#207 R2`.
- **F** `test(mobile): revierte mutaciones del recorrido del candado (R2)`. Deshace
  exactamente lo de E. Verde.

C y E van separados porque M-R2e y M-R2f vacían o recortan el recorrido: aplicadas junto a
M-R2a..d, taparían las violaciones plantadas y el rojo de C dejaría de probar nada.
`git diff <B> <D> -- mobile-pet-tracker` y `git diff <D> <F> -- mobile-pet-tracker` salen
vacíos; el diff neto de la rama son cinco ficheros de test (CC5).

## Mutaciones de control (C4, vía b)

Rutas relativas a `mobile-pet-tracker/`. Cada texto plantado es una línea sola; ninguna
mutación toca producción.

| Id | Dónde | Mutación (sobre el estado de B) | Aserción que debe fallar |
|---|---|---|---|
| M-R1a | `src/screens/profile/index.test.tsx` | sustituir `jest.mock('expo-image-picker'` por `jest.doMock('expo-image-picker'` (mitad (a) de R1: el módulo deja de registrarse con `jest.mock`) | `#207 R1`: la lista de problemas nombra `screens/profile/index.test.tsx` |
| M-R2a | `src/app/(tabs)/__tests__/screens.test.tsx` | añadir al final `jest.mock('mutacion-a', () => ({}), { virtual: true });` (directorio con paréntesis dentro de `__tests__`) | `#207 R2` primer `it`: la lista de violaciones contiene `app/(tabs)/__tests__/screens.test.tsx` |
| M-R2b | `src/utils/form-rules.test.ts` | añadir al final `jest.doMock('mutacion-b', () => ({}), { virtual:true });` (`.ts` fuera de `__tests__`, `doMock`, sin espacio) | idem, con `utils/form-rules.test.ts` |
| M-R2c | `src/screens/add-pet/index.test.tsx` | añadir al final `jest.mock('mutacion-c', () => ({}), { "virtual" : false });` (clave entre comillas, valor `false`) | idem, con `screens/add-pet/index.test.tsx` |
| M-R2d | el propio candado | añadir una línea de comentario `// mutacion-d virtual: true` | idem, con `__tests__/jest-virtual-mock-lock.test.ts` (el candado se recorre a sí mismo y no se exime) |
| M-R2e | el recorrido del candado | devolver `[]` al encontrar un directorio llamado `__tests__`, con la forma de `sourceFiles` de `design-drift.test.ts`: `entry.name === '__tests__' ? [] : <recursión>` | `#207 R2` segundo `it`: la lista de tests recorridos no contiene `__tests__/jest-virtual-mock-lock.test.ts` |
| M-R2f | el recorrido del candado | cambiar el filtro `/\.test\.tsx?$/` por `/\.tests\.tsx?$/` (el recorrido queda vacío y el primer `it` pasa en vacío) | idem |

Evidencia: cada M-R<n> se aplica sola sobre el estado de B, se corre el `it` de su R, se
anota la aserción que falla y se revierte. Luego se aplican en C (grupo de datos) y en E
(grupo del recorrido) y se mide ahí también. En C la lista del primer `it` de `#207 R2` es,
ordenada con `.sort()` (verificado: `_` precede a `a`):

```
['__tests__/jest-virtual-mock-lock.test.ts', 'app/(tabs)/__tests__/screens.test.tsx',
 'screens/add-pet/index.test.tsx', 'utils/form-rules.test.ts']
```

El implementer anota esas aserciones en `progress/impl_mobile-jest-virtual-mock-poisoning.md`.
El reviewer reproduce la corrida en C y en E y copia en
`progress/review_mobile-jest-virtual-mock-poisoning.md` la aserción que falla por cada M-R<n>.

## Anclas (ejecutables, con salida esperada)

Todas desde `/home/claude/sites/Pet-Tracker-wt-207/mobile-pet-tracker`. Cada cifra es
base + delta; la base se midió en `329c613c` el 2026-10-24 y el delta es lo que el commit
suma. Una cifra que no cuadra es un hallazgo, no una cifra que corregir. Un `grep -c` con 0
coincidencias sale con código 1: se miden sin `&&` ni pipes, solo se lee la salida.

| Ancla (comando) | Base | A | B | C | D | E | F |
|---|---|---|---|---|---|---|---|
| `for f in food health meal-schedule profile; do grep -cF 'virtual: true' src/screens/$f/index.test.tsx; done` | `1 1 1 1` | `1 1 1 1` | `0 0 0 0` | `0 0 0 0` | `0 0 0 0` | `0 0 0 0` | `0 0 0 0` |
| `grep -rlE "virtual['\"]?[[:space:]]*:" src \| wc -l` | 4 | 4 | 0 | 4 | 0 | 0 | 0 |
| `grep -cE "virtual['\"]?[[:space:]]*:" src/__tests__/jest-virtual-mock-lock.test.ts` | (no existe) | 0 | 0 | 1 | 0 | 0 | 0 |
| `grep -cF "jest.mock('expo-image-picker'" src/screens/profile/index.test.tsx` | 1 | 1 | 1 | 0 | 1 | 1 | 1 |
| `for f in food health meal-schedule; do grep -cF "'../../theme/use-theme-colors'" src/screens/$f/index.test.tsx; done` | `1 1 1` | `1 1 1` | `1 1 1` | `1 1 1` | `1 1 1` | `1 1 1` | `1 1 1` |
| `grep -cE "describe\('#207 R[12]:" src/__tests__/jest-virtual-mock-lock.test.ts` | (no existe) | 2 | 2 | 2 | 2 | 2 | 2 |
| `grep -cE "^\s+it\(" src/__tests__/jest-virtual-mock-lock.test.ts` | (no existe) | 3 | 3 | 3 | 3 | 3 | 3 |
| `grep -cF '/\.test\.tsx?$/' src/__tests__/jest-virtual-mock-lock.test.ts` | (no existe) | 1 | 1 | 1 | 1 | 0 | 1 |
| `grep -cF "=== '__tests__'" src/__tests__/jest-virtual-mock-lock.test.ts` | (no existe) | 0 | 0 | 0 | 0 | 1 | 0 |

Lecturas: la fila 2 es el barrido de todo `src` (los cuatro de hoy; en C son M-R2a, M-R2b,
M-R2c y el candado por M-R2d). La fila 3 prueba D6: el candado no se nombra a sí mismo, y
solo M-R2d lo rompe. Las dos últimas filas son anclas negativas y positivas del recorrido
(D4) y las prueba su mutación: M-R2f quita el literal del filtro (fila 8 a 0) y M-R2e planta
el literal de exclusión (fila 9 a 1); si el implementer escribe el recorrido con otra forma,
las filas siguen valiendo porque D4 fija el literal del filtro.

Guarda de diff (CC2), con A y B los hashes de esos commits:

- `git diff --numstat <A>..<B> -- mobile-pet-tracker` imprime exactamente cuatro líneas:
  `0	1	mobile-pet-tracker/src/screens/food/index.test.tsx`, la misma para `health` y
  `meal-schedule`, y `1	1	mobile-pet-tracker/src/screens/profile/index.test.tsx` (columnas separadas por tabulador).
- `git diff --name-only <H0>..<F> -- mobile-pet-tracker | sort` imprime exactamente cinco rutas
  (CC5): las cuatro de arriba y `mobile-pet-tracker/src/__tests__/jest-virtual-mock-lock.test.ts`.
  Todas terminan en `.test.ts` o `.test.tsx`.
- `git diff --numstat <B> <D> -- mobile-pet-tracker` y `git diff --numstat <D> <F> -- mobile-pet-tracker`
  no imprimen nada.

Cuenta de pruebas del candado, `bunx jest --runInBand --runTestsByPath src/__tests__/jest-virtual-mock-lock.test.ts`:

| Commit | Salida esperada |
|---|---|
| A | `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 1 passed, 3 total` |
| B | `Test Suites: 1 passed, 1 total`; `Tests: 3 passed, 3 total` |
| C | `Tests: 2 failed, 1 passed, 3 total` |
| D | `Tests: 3 passed, 3 total` |
| E | `Tests: 1 failed, 2 passed, 3 total` |
| F | `Tests: 3 passed, 3 total` |

La suite completa (CC4) en F suma 1 suite y 3 tests sobre T0 (cifra medida por el leader en
la base al lanzar el handoff, no copiada de aquí).

## R1 — Los cuatro tests registran su módulo real sin opción virtual (rojo, vía a)

- [ ] (1) Escribir test que falla para R1: describe `#207 R1:` con un `it` en
  `src/__tests__/jest-virtual-mock-lock.test.ts`. Recorre la tabla de cuatro filas de D9,
  acumula `<ruta>: <motivo>` en una lista `problems` y aserta `expect(problems).toEqual([])`.
  Falla en A por las cuatro entradas «contiene la opción virtual». Commit A.
- [ ] (2) Implementación mínima que lo pasa: borrar la opción en los cuatro tests (D1, D2). Commit B.
  La mitad (a) del requisito (el `jest.mock` sigue ahí) se cierra por M-R1a: rojo en C, verde en D.
- [ ] (3) Refactor con tests verdes: no aplica.

## R2 — El candado barre todos los tests móviles y no puede recorrer en vacío (rojo, vía a, con cláusula vía b)

- [ ] (1) Escribir test que falla para R2: describe `#207 R2:` con dos `it`. El primero lee todos
  los tests móviles (recorrido de D4, D8) y aserta `expect(violations).toEqual([])`; en A recibe
  las cuatro rutas de `screens/` del §Anclas. El segundo aserta que la lista de rutas recorridas
  contiene `__tests__/jest-virtual-mock-lock.test.ts` (D7); nace verde en A. Commit A.
- [ ] (2) Implementación mínima que lo pasa: la misma de R1 (B quita las cuatro violaciones).
  El segundo `it` y la ausencia de exenciones se cierran por mutación: M-R2a..d en C, revertidas
  en D, y M-R2e y M-R2f en E, revertidas en F. Cada una falla por la aserción de la tabla.
- [ ] (3) Refactor con tests verdes: no aplica.

## Comandos de verificación

Desde `/home/claude/sites/Pet-Tracker-wt-207/mobile-pet-tracker` (rutas relativas a esa carpeta):

- Antes de la primera corrida en un worktree sin dependencias: copiar `.env` y
  `bun install --frozen-lockfile`.
- Candado, por R: `bunx jest --runInBand --runTestsByPath src/__tests__/jest-virtual-mock-lock.test.ts -t '#207 R1:'`
  (los dos puntos evitan que `R1` coincida con otro prefijo). Sin `-t` corre los tres `it`.
- Síntoma real (CC1): el bloque de [[requirements]] §Criterios de cierre. Caché de jest vacía
  (`--cacheDirectory` nuevo) y `--runInBand`, porque una caché previa reordena la corrida. El
  `exit` se lee de `echo exit=$?`, sin pipe. Con `pgrep -af '[i]nit.sh'` vacío antes de medir; un
  rojo distinto de `#172 R2` se repite una vez a solas (errata E1).
- Regresión de CC3: `bunx jest --runInBand --runTestsByPath src/__tests__/jest-virtual-mock-lock.test.ts src/screens/food/index.test.tsx src/screens/health/index.test.tsx src/screens/meal-schedule/index.test.tsx src/screens/profile/index.test.tsx src/components/__tests__/back-button.test.tsx src/__tests__/design-drift.test.ts`.
  `--runTestsByPath` y no posicional: un posicional es una regex y las rutas con `(tabs)` se
  saltan en silencio. El número de suites impreso debe coincidir con el de ficheros pedidos (siete).
- `bunx tsc --noEmit`.
- `bunx expo lint > <log> 2>&1 && test ! -s <log>`. El `&&` toma el código de `expo lint` y
  `test ! -s` exige log vacío: un SIGKILL u OOM (que sale con código 0) o un aviso dan rojo.
- Ninguna medición de veredicto usa pipes (`| tail` daría el código de `tail`).
- Tras modificar código: `graphify update .` desde la raíz del worktree (CLAUDE.md).
- No se corre `./init.sh` desde el implementer ni desde el reviewer: lo corre el leader (CC4).
