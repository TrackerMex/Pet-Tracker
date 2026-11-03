---
feature: "mobile-nutrition-ai-collapse-flicker"
status: approved      # draft | spec_ready | approved
tags: [mobile, nutrition, ui, spec]
---

# Tareas — [[mobile-nutrition-ai-collapse-flicker]] (#234)

> Disciplina TDD. **Commits test-primero obligatorios**: por cada par, primero
> un commit `test(mobile): … (R<n>)` con los tests en rojo y después un commit
> `feat(mobile): … (R<n>)` con la implementación; nunca test e implementación en
> el mismo commit (C4 de `CHECKPOINTS.md`). Rutas relativas a
> `mobile-pet-tracker/`. Comandos con `cd` explícito
> (`cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && …`) y `bunx`,
> nunca `npx`. Rutas con paréntesis no se pasan como posicional a jest. Sin
> `init.sh` desde Codex (lo corre el leader). `await` en todo `fireEvent`,
> `act`, `render` y `rerender` (RNTL 14). Skills de Codex: los nombres de
> `.claude/agents/leader.md` §Catálogo real de skills de Codex.
>
> Los requisitos están agrupados en tres pares de commits, porque R1, R4, R5 y
> R6 se aprueban con un único cambio de producción (mover el `onLayout`) y R2 y
> R3 completan el medidor. El orden evita que ningún test nazca verde por un
> requisito previo (R5 y R6 se escriben **antes** de mover el `onLayout`, para
> que nazcan rojos).

## Paso 0 — base

- [ ] Anotar `H0 = git rev-parse HEAD`. Comprobar las anclas de la columna
  «Hoy» de [[requirements]] §Evidencia, cada una con `grep -cF -- "<literal>"`
  sobre `src/screens/food/ai-explanation.tsx` y
  `src/screens/food/ai-explanation.test.tsx`. Si alguna no da la cifra, parar y
  anotarlo en `progress/impl_mobile-nutrition-ai-collapse-flicker.md`.
- [ ] T0: `cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx jest src/screens/food src/__tests__ > /tmp/t0-234.log 2>&1; echo "exit=$?"`
  en verde (guardar el log entero; un SIGKILL por carga cuenta 0 tests, repetir;
  un `it` ajeno de `food/index.test.tsx` que falle bajo carga se repite sin el
  flag y se anota). Y
  `bunx jest src/screens/food/ai-explanation.test.tsx` → **28 passed**.

## Par 1 — R1, R4, R5, R6: el `onLayout` sale del recorte

- [ ] (1) Test rojo, en `src/screens/food/ai-explanation.test.tsx`:
  1. Reapuntar el helper `layout(height)` a `food-ai-measure` (con
     `includeHiddenElements: true`) y añadir `clippedLayout(height)` sobre
     `food-ai-content` (ver [[requirements]] §Convenciones).
  2. Sufijo ` (enmendado por #234 R4)` al final del título del `it.each` de la
     frontera de #224 R6, sin tocar sus aserciones.
  3. `describe('#234 R1: el medidor vive fuera del recorte')` (3 `it`),
     `describe('#234 R5: el nodo recortado no decide')` (`it.each` de 5 filas) y
     `describe('#234 R6: el recorte no oscila')` (3 `it`), al final del fichero.
  Rojo esperado, contado con la salida de jest
  (`bunx jest src/screens/food/ai-explanation.test.tsx`):
  **32 failed, 7 passed, 39 total** (21 existentes que llaman a `layout()` por
  no encontrar `food-ai-measure`, 3 de R1, 5 de R5, 3 de R6; los 7 verdes son
  los existentes que no llaman a `layout()`: 2 de #224 R5, la fila «sin evento»
  de #224 R6, las 2 filas «sin botón» de #224 R8 y los 2 de #224 R11). Si la
  cifra difiere, anotar la diferencia y el motivo en el reporte.
  Commit `test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)`.
- [ ] (2) Implementación mínima en `src/screens/food/ai-explanation.tsx`: añadir
  `<View testID="food-ai-measure" onLayout={…setContentHeight…} />` como
  **primer** hijo de la raíz `gap-2` (aún vacío) y quitar el `onLayout` de
  `food-ai-content`. Verde: **39 passed**. Commit
  `feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)`.
  (Este commit deja el medidor sin hijos: es un estado intermedio de la rama; el
  par 2 lo completa y la rama no se mergea suelta.)
- [ ] (3) Refactor con tests verdes; mutaciones plantadas de [[requirements]]:
  R1 (a)-(d), R4 (a)-(d), R5 (a)-(c), R6 (a)-(c). Cada una: aplicar, correr
  `bunx jest src/screens/food/ai-explanation.test.tsx`, confirmar que solo falla
  lo que el requisito dice y revertir con
  `git checkout HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.tsx`
  (cada fichero tocado listado explícito) y `git diff --cached` en 0. La
  mutación R1 (b) debe dejar **verdes** R4, R5 y R6 y rojos solo R1: anotarlo.

## Enmienda del leader (2026-11-03): cardinalidad en R1 `it` 3

Codex comprobó que `toEqual(['food-ai-measure'])` acepta un `undefined` final, de modo
que la mutación R5(c) dejaba verde R1 `it` 3. Entre el par 1 y el par 2 va un commit
extra, test-primero a su manera: `test(mobile): #234 pin the onLayout carrier count (R1)`,
que añade `toHaveLength(1)` a R1 `it` 3. Nace verde (nada en producción cambia); su
prueba es la mutación R5(c) y R1(d), que ahora dejan rojo R1 `it` 3. Anotar «nace verde»
y el resultado de ambas mutaciones.

## Par 2 — R2: el medidor repite lo que se ve

- [ ] (1) Test rojo: `describe('#234 R2: el medidor repite lo que se ve')` con el
  `it.each` de tres filas de R2. Rojo esperado: **3 failed, 39 passed, 42 total**
  (el medidor está vacío). Commit
  `test(mobile): #234 measurer must repeat the visible blocks (R2)`.
- [ ] (2) Implementación mínima: extraer los bloques de `food-ai-content` a la
  función de módulo `renderBlocks` (bloques, color del punto y si lleva
  `testID`) y usarla en `food-ai-content` y en `food-ai-measure`. Las recetas de
  clase se quedan como están, **una sola vez** en el fuente; la variante del
  medidor no lleva `testID`. Verde: **42 passed**. Commit
  `feat(mobile): #234 render the measurer from the same blocks as the content (R2)`.
- [ ] (3) Refactor; mutaciones R2 (a)-(f), revertidas. Anclas de
  [[requirements]] §Evidencia: `renderBlocks(` → 3, `blocks.map(` → 1,
  `mt-1.75 size-1.25 shrink-0 rounded-full` → 1,
  `flex-1 text-13 font-medium leading-body text-foreground` → 1.

## Par 3 — R3: el medidor es invisible e inerte

- [ ] (1) Test rojo: `describe('#234 R3: el medidor está oculto e inerte')` con
  los dos `it` de R3. Rojo esperado: **2 failed, 42 passed, 44 total**. Commit
  `test(mobile): #234 measurer must be hidden and inert (R3)`.
- [ ] (2) Implementación mínima: en `food-ai-measure`, `className="absolute inset-x-0 top-0 opacity-0"`,
  `pointerEvents="none"`, `accessibilityElementsHidden` e
  `importantForAccessibility="no-hide-descendants"`; comentario
  `// #234 R3` en el fuente. Verde: **44 passed**. Commit
  `feat(mobile): #234 hide the measurer from touches and screen readers (R3)`.
- [ ] (3) Refactor; mutaciones R3 (a)-(f), cada una sola y revertida. La
  mutación (a) y la (b) deben dejar verde el `it` 2 y rojo el `it` 1; la (c)
  rojo ambos.

## R7 — no regresión y alcance

- [ ] (1) Sin test nuevo: los `it` existentes (#224 R4, R5, R7, R8, R9, R11 y el
  degradado de R6) siguen verdes con las mismas aserciones. Ancla:
  `git diff <H0>..HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx | grep '^-' | grep -v '^---'`
  solo lista las líneas del cuerpo del helper `layout`, la firma del helper si
  cambia y el título de `#224 R6` de R4.
- [ ] (2) Sin implementación propia.
- [ ] (3) Mutaciones R7 (a) y (b) (esta última sobre
  `src/__tests__/nutrition-canvas-fidelity.test.ts`), revertidas. Anclas de
  [[requirements]] §Evidencia columna «Tras #234» con `grep -cF --`
  (incluidas `absolute inset-x-0 top-0 opacity-0` → 1, `pointerEvents="none"`
  → 2, `onLayout` → 1, `setContentHeight(` → 1) y
  `grep -cF "(enmendado por #234 R4)" src/screens/food/ai-explanation.test.tsx` → 1.
- [ ] Guards: `cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx jest src/screens/food src/__tests__ > /tmp/t1-234.log 2>&1; echo "exit=$?"`
  en verde, mismas suites que T0 y **44** tests en `ai-explanation.test.tsx`
  (28 + 16: R1 3, R2 3, R3 2, R5 5, R6 3).
- [ ] Chequeo de alcance: `git diff --name-only <H0>..HEAD` solo lista
  `mobile-pet-tracker/src/screens/food/ai-explanation.tsx`,
  `mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx` y ficheros bajo
  `progress/` (el reporte y el marcador `.done` de Codex). Ni
  `src/screens/food/index.tsx`, ni su test, ni `src/i18n/`, ni
  `src/__tests__/ui-copy-table.ts`, ni `docs/`.
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx tsc --noEmit > /tmp/tsc-234.log 2>&1; echo "exit=$?"`
  en 0 y
  `bunx expo lint > /tmp/lint-234.log 2>&1 && test ! -s /tmp/lint-234.log; echo "exit=$?"`
  en 0 (el lint traga SIGKILL: ver memoria `expo-lint-traga-sigkill`).
- [ ] `progress/impl_mobile-nutrition-ai-collapse-flicker.md` con el resumen, la
  salida de cada ancla, la cifra de rojo de cada commit de test y el resultado de
  cada mutación (incluida la nota de la mutación R1 (b)); los commits de Codex son
  los de arriba, dos por par, test primero.
- [ ] Recordatorio para el cierre (lo hace el leader, no Codex): el smoke G2 de
  [[requirements]] §Paso de smoke nuevo se registra en
  `progress/smoke_mejoras-smoke.md`; la casilla de enmienda de #224 R6 y la G2
  son del humano.
