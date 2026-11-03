---
feature: "mobile-profile-family-join-row"
status: approved      # draft | spec_ready | approved
tags: [mobile, profile, ui, spec]
---

# Tareas — [[mobile-profile-family-join-row]] (#229)

> Disciplina TDD. **Commits test-primero obligatorios**: por cada grupo, primero
> un commit `test(mobile): … (R<n>)` con el test en rojo y después un commit
> `feat(mobile): … (R<n>)` con la implementación; nunca test e implementación en
> el mismo commit (C4 de `CHECKPOINTS.md`). Rutas relativas a
> `mobile-pet-tracker/`. Comandos con `cd` explícito
> (`cd /home/claude/sites/Pet-Tracker-wt-229/mobile-pet-tracker && …`) y `bunx`,
> nunca `npx`. Rutas con paréntesis no se pasan como posicional a jest. Sin
> `init.sh` desde Codex (lo corre el leader). Skills de Codex: los nombres de
> `.claude/agents/leader.md` §Catálogo real de skills de Codex.
> Esperas: ver `.claude/agents/leader.md` §Esperas.

## Paso 0 — base

- [ ] Anotar `H0 = git rev-parse HEAD`. Comprobar las anclas de la tabla «Hoy»
  de [[requirements]] §Evidencia, cada una con `grep -cF -- "<literal>"`. Si
  alguna no da la cifra, parar y anotarlo en
  `progress/impl_mobile-profile-family-join-row.md`.
- [ ] T0: `cd /home/claude/sites/Pet-Tracker-wt-229/mobile-pet-tracker && bunx jest src/screens/profile src/__tests__ > /tmp/t0-229.log 2>&1; echo "exit=$?"`
  en verde (guardar el log entero; un SIGKILL por carga cuenta 0 tests, repetir).

## Orden de commits (obliga el reparto de rojo)

1. `test(mobile): #229 pin flex-1 on wide tiles, no-pet row and equal-height recipe (R1, R3, R4, R5)`:
   los `describe` de R1, R3, R4 y R5, más la enmienda **solo de la clase**
   (prefijo `flex-1 ` escrito a mano) en los `it` `R4: con mascota añade la fila
   de Familia…` y `R6: con mascota la cuarta fila…`. Rojo esperado: R1 (2 `it`),
   R4 (1), R5 (1) y los dos `it` enmendados. R3 (2 `it`) **nace verde**: es el
   único grupo que nace verde.
2. `feat(mobile): #229 give wide profile tiles flex-1 so they share the row (R1, R4)`:
   solo el prefijo en `ProfileWideTile`. Verde todo menos lo de la fila.
3. `test(mobile): #229 pair Familia and Unirme con código in one row (R2)`:
   `describe` de R2, más la enmienda estructural de los tres `it` de R6
   (filas, hijos, `2 + 1`, sufijos). Rojo esperado: R2 (1) y los tres `it`
   enmendados.
4. `feat(mobile): #229 move join-pet-link into the family row and drop row 3 (R2)`.

## R1 — las tarjetas anchas reparten la fila

- [ ] (1) Test rojo: `describe('#229 R1: …')` con el `it.each` de R1 (commit 1).
- [ ] (2) Implementación mínima: `flex-1 ` antepuesto a la clase del `Pressable`
  de `ProfileWideTile` (commit 2).
- [ ] (3) Refactor con tests verdes; mutaciones (a)-(d) de R1, cada una
  revertida con `git checkout HEAD -- <ruta>` y `git diff --cached` en 0.

## R2 — Familia y Unirme con código comparten fila

- [ ] (1) Test rojo: `describe('#229 R2: …')` (commit 3).
- [ ] (2) Implementación mínima: `{joinPetLink}` tras el `ProfileWideTile` de
  Familia en `profile-links-row-2`; borrar el `View` de `profile-links-row-3`
  (commit 4).
- [ ] (3) Refactor; mutaciones (a)-(d) de R2, revertidas.

## R3 — contenido de la tarjeta intacto

- [ ] (1) Test (nace verde, declarado): `describe('#229 R3: …')` con el
  `it.each` (commit 1).
- [ ] (2) Sin implementación propia.
- [ ] (3) Mutaciones (a)-(d) de R3, revertidas; (a) es la de la zona ciega (el
  `flex-1` del bloque `-text`).

## R4 — sin mascota

- [ ] (1) Test rojo: `describe('#229 R4: …')` (commit 1).
- [ ] (2) La cubre el commit 2 (el prefijo en el componente).
- [ ] (3) Mutaciones (a)-(c) de R4, revertidas.

## R5 — receta del mismo alto

- [ ] (1) Test rojo: `describe('#229 R5: …')` (commit 1; rojo por la cuenta de
  `flex-1`).
- [ ] (2) La cubre el commit 2.
- [ ] (3) Mutaciones (a)-(f) de R5, revertidas.

## R6 — alcance, enmiendas y guards

- [ ] (1) Las enmiendas de los tres `it` ya van repartidas en los commits 1 y 3.
- [ ] (2) Sin implementación propia.
- [ ] (3) Anclas de «Tras #229» de [[requirements]] §Evidencia con `grep -cF --`;
  `grep -cF "(enmendado por #229 R" src/screens/profile/index.test.tsx` imprime
  `3`; `git diff --numstat <H0>..HEAD -- src/screens/profile/index.tsx` imprime
  `1	3`.
- [ ] Guards: `cd /home/claude/sites/Pet-Tracker-wt-229/mobile-pet-tracker && bunx jest src/screens/profile src/__tests__ > /tmp/t1-229.log 2>&1; echo "exit=$?"`
  en verde, mismas cifras de tests y suites que T0 salvo los 7 `it` nuevos.
- [ ] Alcance: `git diff --name-only <H0>..HEAD` solo lista
  `mobile-pet-tracker/src/screens/profile/index.tsx`,
  `mobile-pet-tracker/src/screens/profile/index.test.tsx` y ficheros bajo
  `progress/` (el reporte y el marcador `.done` de Codex).
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-229/mobile-pet-tracker && bunx tsc --noEmit > /tmp/tsc-229.log 2>&1; echo "exit=$?"` en 0 y
  `bunx expo lint > /tmp/lint-229.log 2>&1 && test ! -s /tmp/lint-229.log; echo "exit=$?"`
  en 0 (el lint traga SIGKILL: memoria `expo-lint-traga-sigkill`).
- [ ] Rellenar [[traceability]] con los hashes tras cada commit; sin rebase
  tras la trazabilidad.
