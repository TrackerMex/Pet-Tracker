---
feature: "mobile-home-scroll-edge-blur"
status: approved      # draft | spec_ready | approved
tags: [mobile, home, ui, spike, native, spec]
---

# Tareas — [[mobile-home-scroll-edge-blur]] (#242)

> Disciplina TDD. **Commits test-primero obligatorios**: por cada grupo, primero
> un commit `test(mobile): … (R<n>)` con el test en rojo y después un commit
> con la implementación; nunca test e implementación en el mismo commit (C4 de
> `CHECKPOINTS.md`). Rutas relativas a `mobile-pet-tracker/`. Comandos con `cd`
> explícito (`cd /home/claude/sites/Pet-Tracker-wt-242/mobile-pet-tracker && …`)
> y `bun`/`bunx`, nunca `npm` ni `npx`. Rutas con paréntesis no se pasan como
> posicional a jest. Sin `init.sh` desde Codex (lo corre el leader). Skills de
> Codex, con los nombres de `.claude/agents/leader.md` §Catálogo real de skills
> de Codex: `building-native-ui`, `expo-dev-client` y `expo-module` (módulo
> nativo nuevo); no existe `expo-overview` en Codex. Diga en el reporte cuáles
> cargó. Esperas: ver `.claude/agents/leader.md` §Esperas.
> No se crean recursos AWS ni se reconstruye el dev build (G3 es del humano).

## Paso 0 — base

- [ ] Confirmar el worktree: `cd /home/claude/sites/Pet-Tracker-wt-242 && git branch --show-current`
  imprime `feature/242-mobile-home-scroll-edge-blur`. Anotar
  `H0 = git rev-parse HEAD`.
- [ ] Comprobar las anclas de la columna «Hoy» de [[requirements]] §Evidencia,
  cada una con `grep -cF -- "<literal>" <fichero>`. Si alguna no da la cifra,
  parar y anotarlo en `progress/impl_mobile-home-scroll-edge-blur.md`.
- [ ] Comprobar que `node_modules/expo-backdrop` **no** existe aún y que
  `bun.lock` no lo menciona (`grep -cF expo-backdrop bun.lock` imprime `0`).
- [ ] T0: `cd /home/claude/sites/Pet-Tracker-wt-242/mobile-pet-tracker && bunx jest src/screens/home src/__tests__ > /tmp/t0-242.log 2>&1; echo "exit=$?"`
  en verde (guardar el log entero; un SIGKILL por carga cuenta 0 tests: repetir
  y sumar el rerun; los timeouts por carga se miden sin flags).

## Orden de commits (obliga el reparto de rojo)

1. `test(mobile): #242 pin expo-backdrop 0.1.3 and amend the dependency count (R1)`:
   solo `src/__tests__/canvas-foundations.test.ts`: la enmienda de `#197 R22`
   (sufijo ` (enmendado por #242 R1)`, `42 + 1 + 1`, comentario
   `// #242 R1: expo-backdrop`) y el `describe('#242 R1: dependencia del spike')`
   con su `it`. Rojo esperado: 2 (el `it` enmendado y el nuevo).
2. `chore(mobile): #242 add expo-backdrop 0.1.3 as a native dependency (R1)`:
   `cd /home/claude/sites/Pet-Tracker-wt-242/mobile-pet-tracker && bunx expo install expo-backdrop@0.1.3`;
   si `package.json` deja `~`/`^`, editar a `"expo-backdrop": "0.1.3"` y correr
   `bun install`. Solo `package.json` y `bun.lock`. Verde: R1.
   Comprobar `bun install --frozen-lockfile` en exit 0.
2b. (Enmienda del 2026-11-04.) `test(mobile): #242 amend the second dependency count lock (R1)`:
   solo `src/__tests__/zones-canvas-fidelity.test.ts`: sufijo
   ` (enmendado por #242 R1)` en el título del `it` de `#202 R25`, `42 + 1 + 1`
   y comentario `// #242 R1: expo-backdrop`. Va **después** del commit 2 porque
   ese test ya estaba rojo con la dependencia añadida; este commit lo deja verde.
   Tras él, `bunx jest src/__tests__` queda sin rojos.
3. `test(mobile): #242 pin the edge blur overlays on Home (R2, R3, R4, R5, R6, R7, R8)`:
   solo `src/screens/home/index.test.tsx`: el doble de `expo-backdrop`, el de
   `uniwind` con `mockTheme`, `mockInsets` y los siete `describe` de R2 a R8.
   Rojo esperado: R2 (3 `it`), R3 (2), R4 (2), R5 (1), R6 (2) = 10. **R7 y R8
   nacen verdes** (2 `it`): son candados de ausencia y de conservación,
   declarados.
4. `feat(mobile): #242 render progressive edge blur overlays on Home (R2, R3, R4, R5, R6)`:
   solo `src/screens/home/index.tsx`. Verde todo.
4b. (Enmienda del 2026-11-04.) `fix(mobile): #242 pass the overlay testID through a typed spread (D12)`:
   solo `src/screens/home/index.tsx`; sin cambios de tests. Antes y después:
   `bunx tsc --noEmit` pasa de 2 errores TS2322 a exit 0 y `bunx jest src/screens/home`
   sigue verde con las mismas cifras. Si la traceability ya está commiteada,
   este commit va después y se anota en ella sin reescribir hashes.
5. `docs(specs): #242 fill traceability` (único commit de arnés, tras el
   último verde; sin rebase después).

## R1 — dependencia exacta

- [ ] (1) Test rojo: enmienda + `describe('#242 R1: …')` (commit 1).
- [ ] (2) Implementación mínima: instalar y fijar `0.1.3` (commit 2).
- [ ] (3) Refactor con tests verdes; mutaciones (a)-(d) de R1, cada una
  revertida con `git checkout HEAD -- <ruta>` y `git diff --cached` en 0.

## R2 — dos overlays en el return principal

- [ ] (1) Test rojo: `describe('#242 R2: …')` con el `it.each` de tres estados
  (commit 3). Leer las props del doble con `screen.getByTestId(id).props`.
- [ ] (2) Implementación mínima: import de `ProgressiveBlurView`, `View` raíz,
  los dos overlays con las props de D4/D5/D6 (commit 4).
- [ ] (3) Refactor; mutaciones (a)-(d) de R2, revertidas.

## R3 — geometría por insets

- [ ] (1) Test rojo: `describe('#242 R3: …')` con `it.each` de dos conjuntos de
  insets (commit 3; fijar `mockInsets` **antes** de `await renderHome()`).
- [ ] (2) Implementación mínima: constantes de módulo con nombre y `style`
  exacto (commit 4).
- [ ] (3) Refactor; mutaciones (a)-(d) de R3, revertidas; (c) es la de la zona
  ciega (cruzar `insets.top` con `insets.bottom`).

## R4 — los overlays no capturan toques

- [ ] (1) Test rojo: `describe('#242 R4: …')` con `it.each` por overlay
  (commit 3).
- [ ] (2) La cubre el commit 4 (`pointerEvents: 'none'` dentro de `style`).
- [ ] (3) Mutaciones (a)-(d) de R4, revertidas.

## R5 — hermanos posteriores al scroll

- [ ] (1) Test rojo: `describe('#242 R5: …')` (commit 3). Si `root.children`
  trae un nodo intermedio, ajustar la **lectura**, no la aserción.
- [ ] (2) La cubre el commit 4 (`View` raíz `home-screen-root` con
  `flex-1 bg-background`; orden `ScrollView`, superior, inferior).
- [ ] (3) Mutaciones (a)-(d) de R5, revertidas.

## R6 — tinte por tema

- [ ] (1) Test rojo: `describe('#242 R6: …')` con `it.each` por tema (commit 3).
- [ ] (2) La cubre el commit 4 (`useUniwind().theme`, junto a `insets`, antes
  del early return de mascotas vacías).
- [ ] (3) Mutaciones (a)-(d) de R6, revertidas.

## R7 — sin mascotas no hay blur

- [ ] (1) Test (nace verde, declarado): `describe('#242 R7: …')` (commit 3).
- [ ] (2) Sin implementación propia: el return de `home-no-pets-screen` no se
  toca.
- [ ] (3) Mutaciones (a)-(c) de R7, revertidas, ejecutadas **tras el commit 4**
  (antes no hay overlays que plantar); (c) es la de la zona ciega (solo el
  inferior en la rama vacía).

## R8 — el `ScrollView` no cambia

- [ ] (1) Test (nace verde, declarado): `describe('#242 R8: …')` (commit 3).
- [ ] (2) Sin implementación propia.
- [ ] (3) Mutaciones (a)-(d) de R8, revertidas.

## R9 — alcance, anclas y guards

- [ ] (1) La enmienda de `#197 R22` ya va en el commit 1.
- [ ] (2) Sin implementación propia.
- [ ] (3) Anclas de la columna «Tras #242» de [[requirements]] §Evidencia con
  `grep -cF --`; `grep -cE '\bBlurView\b' src/screens/home/index.tsx` imprime
  `0`; `grep -c "(enmendado por #242 R" src/__tests__/canvas-foundations.test.ts`
  imprime `1`; `grep -c "(enmendado por #242 R" src/__tests__/zones-canvas-fidelity.test.ts`
  imprime `1`; `git diff -w --numstat <H0>..HEAD -- src/screens/home/index.tsx`
  borra como mucho 2 líneas.
- [ ] Guards: `cd /home/claude/sites/Pet-Tracker-wt-242/mobile-pet-tracker && bunx jest src/screens/home src/__tests__ > /tmp/t1-242.log 2>&1; echo "exit=$?"`
  en verde, mismas cifras de suites que T0 y 13 tests más (R1: 1, R2: 3, R3: 2,
  R4: 2, R5: 1, R6: 2, R7: 1, R8: 1).
- [ ] Alcance: `git diff --name-only <H0>..HEAD` solo lista los cinco ficheros de
  [[requirements]] R9 (más `progress/` y la trazabilidad).
- [ ] Antes de cada `tsc`: `cd /home/claude/sites/Pet-Tracker-wt-242/mobile-pet-tracker && test ! -e .expo/types/router.d.ts`
  (si existe, **parar**; nunca `rm -f`). Después
  `bunx tsc --noEmit > /tmp/tsc-242.log 2>&1; echo "exit=$?"` en 0 y
  `bunx expo lint > /tmp/lint-242.log 2>&1 && test ! -s /tmp/lint-242.log; echo "exit=$?"`
  en 0 (el lint traga SIGKILL: memoria `expo-lint-traga-sigkill`; si da
  «Cannot find module», repetir con `--no-cache`).
- [ ] Rellenar [[traceability]] con los hashes tras el último verde, en un
  único commit de documentos; sin rebase después.

## Fuera del handoff de Codex

- G3 (rebuild del dev build con el módulo nativo) y G2 (smoke Android): del
  humano. Codex no corre `expo prebuild`, no compila nativo y no abre
  emuladores. Cualquier fallo de tipos de `expo-backdrop` bajo `tsc` se reporta
  en `progress/impl_mobile-home-scroll-edge-blur.md`, no se resuelve con
  `// @ts-ignore` ni con un `declare module` propio.
