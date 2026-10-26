---
feature: "mobile-sheet-surface-background"
status: approved
tags: [harness, spec]
---

# Tareas — [[mobile-sheet-surface-background]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Commits test-primero: el rojo y
> el verde en commits distintos (C4 de `CHECKPOINTS.md`). Los nombres de skill son los
> del plugin de Codex (`building-native-ui`, etc.), no los del leader.
>
> Cadena de commits:
> C1 = test rojo R1 (reminders). C2 = test rojo R2 (pairing). C3 = test rojo R3
> (candado nuevo; el `it` de inventario nace verde, sus dos filas por fichero rojas).
> C4 = producción reminders (R1, R5, R6). C5 = producción pairing (R2, R5, R6).
> C6 = trazabilidad. R4 y R5 no añaden tests: se verifican en C4/C5.

## R1 — cajón de borrar pinta el contenedor con el token surface

- [ ] (1) Escribir test que falla para R1 (C1): `it('#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface')` en `screens/reminders/index.test.tsx`; falla porque `flat(undefined)` es `{}`.
- [ ] (2) Implementación mínima que lo pasa (C4): `const [surface] = useThemeColors(['surface']);` antes de `const categoryInk = {` y `backgroundStyle={{ backgroundColor: surface }}` tras `snapPoints` en `screens/reminders/index.tsx`.
- [ ] (3) Refactor con tests verdes: ninguno esperado; confirmar `git diff --numstat <H0> -- screens/reminders/index.tsx` = `2	0`.

## R2 — cajón de desvincular pinta el contenedor con el token surface

- [ ] (1) Escribir test que falla para R2 (C2): `it('#218 R2: ...')` en `describe('#203 R7: hoja de desvincular')` de `screens/pairing/index.test.tsx`, sin la palabra `StyleSheet`.
- [ ] (2) Implementación mínima que lo pasa (C5): `const [surface] = ...` tras `const [muted, danger] = useThemeColors(['muted', 'danger']);` y la prop tras `snapPoints` en `screens/pairing/index.tsx`.
- [ ] (3) Refactor con tests verdes: ninguno esperado; `git diff --numstat <H0> -- screens/pairing/index.tsx` = `2	0`.

## R3 — inventario de BottomSheet con fondo surface

- [ ] (1) Escribir test que falla para R3 (C3): `__tests__/sheet-surface-background.test.ts`; declarar en el reporte qué `it` nace verde (el de inventario) y cuáles rojos (las dos filas `it.each`).
- [ ] (2) Implementación mínima que lo pasa: las mismas líneas de C4 y C5 lo ponen verde; no hay código propio de R3.
- [ ] (3) Refactor con tests verdes: ninguno; sondear una mutación (quitar la línea, o cambiar `'surface'` por `'background'`) y que la fila correspondiente caiga.

## R4 — contrato del cajón sin regresión

- [ ] (1) Sin test nuevo: confirmar que los `it` existentes (`confirmDelete()`, «centra los cinco hijos», `#203 R7.2`) siguen verdes tras C4/C5 y que los dos ficheros de test no tienen líneas borradas (`git diff --numstat <H0>`).
- [ ] (2) Sin implementación propia: las anclas de `snapPoints` y `className` (design.md §Anclas) valen 1 antes y después.
- [ ] (3) Sin refactor.

## R5 — sin literales de color

- [ ] (1) Sin test nuevo: los cuatro `it` de design-drift y los dos de R1/R2 son el candado (ver requirements.md R5).
- [ ] (2) Sin implementación propia: el color sale de `useThemeColors`.
- [ ] (3) Refactor: `grep -rE "#[0-9A-Fa-f]{3,8}" screens/reminders/index.tsx screens/pairing/index.tsx` sin coincidencias nuevas.

## R6 — diff mínimo y candados verdes sin enmienda

- [ ] (1) Sin test nuevo: medir las anclas de design.md antes de empezar y guardar el log.
- [ ] (2) Tras C4/C5: jest completo sin pipe, `tsc --noEmit` y `expo lint` (`> log 2>&1 && test ! -s log`) verdes; si una suite falla por timeout bajo carga, medir sin flag antes de culpar al cambio (memoria `jest-timeout-por-carga-entre-codex`).
- [ ] (3) Refactor: ninguno; reportar en `progress/impl_mobile-sheet-surface-background.md` las cifras medidas, el H0 y qué `it` nació verde.

## Cierre (humano)

- [ ] Smoke G2 de los dos cajones en dev build Android (casilla de requirements.md § Aprobación).
