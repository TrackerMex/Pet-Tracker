---
feature: "mobile-add-reminder-chip-lip-clip"
status: draft        # draft | approved
tags: [mobile, reminders, ui, spec]
---

# Tareas — [[mobile-add-reminder-chip-lip-clip]] (#232)

> Disciplina TDD. **Commits test-primero obligatorios**: por cada grupo, primero
> un commit `test(mobile): … (R<n>)` con el test en rojo y después un commit
> `feat(mobile): … (R<n>)` con la implementación; nunca test e implementación en
> el mismo commit (C4 de `CHECKPOINTS.md`). Rutas relativas a
> `mobile-pet-tracker/`. Comandos con `cd` explícito
> (`cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && …`) y `bunx`,
> nunca `npx`. Rutas con paréntesis no se pasan como posicional a jest. Sin
> `init.sh` desde Codex (lo corre el leader). Skills de Codex: los nombres de
> `.claude/agents/leader.md` §Catálogo real de skills de Codex.

## Paso 0 — base

- [ ] Anotar `H0 = git rev-parse HEAD`. Comprobar las anclas de la tabla de
  [[requirements]] §Evidencia («Hoy»), cada una con `grep -cF`, y la de
  `chunky-lip.ts`. Si alguna no da la cifra, parar y anotarlo en
  `progress/impl_mobile-add-reminder-chip-lip-clip.md`.
- [ ] T0: `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/t0-232.log 2>&1; echo "exit=$?"`
  en verde (guardar el log entero; un SIGKILL por carga cuenta 0 tests, repetir).

## R1 — relleno bajo los chips

- [ ] (1) Test rojo: `describe('#232 R1: las filas de chips reservan el labio')`
  con el `it.each` de dos filas de R1 en `src/screens/add-reminder/index.test.tsx`
  (con el `beforeEach` y las convenciones de [[requirements]]). Rojo esperado:
  `contentContainerStyle` es `{ gap: 8, paddingRight: 20 }` (falta
  `paddingBottom`), 2 `it` rojos. Commit `test(mobile): #232 reserve chip lip room in type and advance rows (R1)`.
- [ ] (2) Implementación mínima: `CHIP_ROW_CONTENT` en
  `src/screens/add-reminder/index.tsx` y `contentContainerStyle={CHIP_ROW_CONTENT}`
  en las dos filas. Verde. Commit `feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)`.
- [ ] (3) Refactor con tests verdes; mutaciones plantadas (a)-(d) de R1,
  cada una revertida con `git checkout HEAD -- <ruta>` y `git diff --cached`
  en 0 (cada fichero tocado se lista explícito).

## R2 — el resto del formulario no se mueve

- [ ] (1) Test rojo: `it.each` de R2 en el mismo `describe`. Rojo esperado:
  `toHaveStyle({ marginBottom: -3 })` falla en las dos filas. Commit
  `test(mobile): #232 chip rows must not shift the form (R2)`.
- [ ] (2) Implementación mínima: `CHIP_ROW_STYLE` y `style={CHIP_ROW_STYLE}` en
  las dos filas. Verde. Commit `feat(mobile): #232 offset chip row padding with a negative margin (R2)`.
- [ ] (3) Refactor; mutaciones (a)-(d) de R2, revertidas.

## R3 — los chips y el labio no cambian

- [ ] (1) Sin test nuevo: los `it` existentes de R3 ya existen y deben seguir
  verdes sin tocar sus aserciones. Correr el fichero entero tras R1 y R2.
- [ ] (2) Sin implementación propia.
- [ ] (3) Mutación plantada de R3 (labio fijo sin `selected`), revertida.

## R4 — enmienda de #213 R5, no-regresión y alcance

- [ ] (1) Test rojo: en `describe('#213 R4: controles de repetición')`, el `it`
  `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea` pasa a
  `toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 })` y su título gana
  ` (enmendado por #232 R1)` al final. **Orden**: este cambio se hace en el
  commit de test de R1 (si no, el `it` queda rojo entre R1 y R4). Añadir
  también `it('#232 R4: la fila de Repetición no cambia')` (nace verde; ver su
  mutación). Commit de R4 solo si queda algo suelto:
  `test(mobile): #232 lock repeat row recipe (R4)`.
- [ ] (2) Sin implementación propia.
- [ ] (3) Mutaciones de R4 (a) y (b); anclas de [[requirements]] §Evidencia
  columna «Tras #232» con `grep -cF`; guards: 
  `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/t1-232.log 2>&1; echo "exit=$?"`
  en verde, mismas cifras de tests y suites que T0 salvo los `it` nuevos
  (R1: 2, R2: 2, R4: 1).
- [ ] Chequeo de alcance: `git diff --name-only <H0>..HEAD` solo lista
  `mobile-pet-tracker/src/screens/add-reminder/index.tsx`,
  `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` y ficheros bajo
  `progress/` (el reporte y el marcador `.done` de Codex).
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx tsc --noEmit > /tmp/tsc-232.log 2>&1; echo "exit=$?"` en 0 y
  `bunx expo lint > /tmp/lint-232.log 2>&1 && test ! -s /tmp/lint-232.log; echo "exit=$?"`
  en 0 (el lint traga SIGKILL: ver memoria `expo-lint-traga-sigkill`).
- [ ] `progress/impl_mobile-add-reminder-chip-lip-clip.md` con el resumen y
  la salida de cada ancla; los commits de Codex son los de arriba, dos por
  grupo, test primero.
