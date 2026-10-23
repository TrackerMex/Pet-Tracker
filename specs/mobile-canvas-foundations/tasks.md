---
feature: "mobile-canvas-foundations"
status: spec_ready
tags: [mobile, ui, tasks]
---

# Tareas — [[mobile-canvas-foundations]]

Reglas para todas las tareas:

- Rutas relativas a `mobile-pet-tracker/`. Comandos con `bun`/`bunx`, nunca
  `npx` ni `npm`.
- Ejecutar tests con `cd mobile-pet-tracker && bunx jest --runTestsByPath <ruta> …`
  (las rutas con `(tabs)` como posicional son regex y se saltan en silencio).
- Commits test-primero: un commit `test(#197): R<n> …` con el rojo (los `it`
  nuevos y las enmiendas del inventario de requirements.md § «Candados que esta
  feature revierte» para ese R) y después un commit `feat(#197): R<n> …` con la
  implementación mínima. El rojo se ve en el commit de test; un commit que
  mezcla test e implementación incumple C4.
- Antes de cada commit de test, comprobar que los `it` nuevos fallan **por la
  aserción** (no por import roto ni por excepción). Si un `it` nace verde por un
  requisito previo, anotarlo en `progress/impl_mobile-canvas-foundations.md`.
- Nada de `StyleSheet.create`, hex fuera de `src/theme/`, emoji, clases
  arbitrarias `[…]` ni dependencias nuevas. Comentarios que citan la feature:
  `#197 R<n>`.

## C01 — Colores

### R1 — Colores claros
- [ ] (1) Test rojo: CF `#197 R1` (literal del canvas + bloque claro) y
  `#197 R1: el tema oscuro no cambia`; enmendar GC `R1` y `R2` con los valores
  nuevos.
- [ ] (2) Implementación mínima: cambiar `--border`, `--separator`, `--danger`,
  `--color-danger`, `--warning`, `--color-warning`, `--warning-strong` del
  bloque `@variant light` de `src/theme/global.css`.
- [ ] (3) Refactor: ninguno esperado.

### R2 — Contraste
- [ ] (1) Test rojo: CF `#197 R2`; enmendar GC `composedSurfaces.light.warningSoft`,
  `#61 R5` (tres `it`) y `#64 R4` (mínimos claros).
- [ ] (2) Implementación mínima: ninguna más allá de R1 (si nace verde tras R1,
  anotarlo).
- [ ] (3) Refactor: ninguno.

## C02 — Tipografía

### R3 — Tokens de tracking e interlineado
- [ ] (1) Test rojo: CF `#197 R3` (seis filas) y GC `#197 R3`.
- [ ] (2) Implementación mínima: seis líneas en `@theme` tras `--tracking-code`.
- [ ] (3) Refactor: ninguno.

### R4 — Barrido de `tracking-tight`
- [ ] (1) Test rojo: CF `#197 R4`; enmendar TH (`TAB_TITLE_168`, su regex y los
  dos `it` de `#168 R1`), los `pinta el título grande ($name)` de food, profile
  y health, `R20.4` de celebration y la fila `tracking-title` de AC `#174 R12`
  (sin `components/screen-header.tsx`, que entra en R19).
- [ ] (2) Implementación mínima: `tracking-tight` a `tracking-title` en
  `src/app/(tabs)/food.tsx`, `src/components/celebration.tsx`,
  `src/screens/health/index.tsx`, `src/screens/profile/index.tsx`.
- [ ] (3) Refactor: ninguno.

## C03 — Labios

### R5 — Tokens de labio
- [ ] (1) Test rojo: CF `#197 R5` y GC `#197 R5` (light y dark).
- [ ] (2) Implementación mínima: cinco `--color-lip-*` tras `--color-lip-gray:`
  en los dos bloques `@variant`.
- [ ] (3) Refactor: ninguno.

### R6 — Catálogo de `useChunkyLip`
- [ ] (1) Test rojo: enmendar CL `#177 R2.1` y el tipo `LipStyles`; añadir CL
  `#197 R6: forma de %s` y CF `#197 R6`.
- [ ] (2) Implementación mínima: siete colores pedidos y 11 claves en
  `src/theme/chunky-lip.ts`; exportar el tipo `ChunkyLip`.
- [ ] (3) Refactor: una función local para construir la sombra de una capa si
  repite el literal más de dos veces.

### R7 — Chips de NuevoRecordatorio
- [ ] (1) Test rojo: enmendar AR (`#178 R10` ×2 y `#123 R5`).
- [ ] (2) Implementación mínima: quitar ` border-b-3 border-black/25` de
  `SELECTED_CHIP` y pasar `style={selected ? chunkyLip.primaryCompact : undefined}`
  a los dos `Pressable`.
- [ ] (3) Refactor: ninguno.

### R8 — Ack de Alertas
- [ ] (1) Test rojo: enmendar AL `#78 R6` (dos `it`) y CN `#174 R8`.
- [ ] (2) Implementación mínima: importar y llamar `useChunkyLip()`, quitar
  `border-b-5` del ack y pasar `style={chunkyLip.neutralCompact}`.
- [ ] (3) Refactor: ninguno.

### R9 — Horario de comidas
- [ ] (1) Test rojo: enmendar MS (`#147 R4`, `#179 R5`, `#179 R6`, `#179 R7`) y
  CN (`#62 R14` ×2, `#62 R15`).
- [ ] (2) Implementación mínima: resumen, «Editar» y «Añadir comida» según R9.
- [ ] (3) Refactor: ninguno.

### R10 — Inventarios de labio
- [ ] (1) Test rojo: CF `#197 R10`; enmendar CC (`#177 R7.1`, `R7.4`, `R7.5`,
  `R8.1`, `R8.2` sustituido, `R8.3`, `R12.1` a `R12.3`), CN `#166 R2` y
  `#166 R3`, AC `#174 R12` fila `border-b-5` y `declara border-b-5 una sola vez`.
- [ ] (2) Implementación mínima: ninguna más allá de R7 a R9 (pueden nacer
  verdes: anotarlo).
- [ ] (3) Refactor: ninguno.

## C05 — Movimiento

### R11 — Constantes `rise`
- [ ] (1) Test rojo: MT `#197 R11` y enmienda de `#152 R1` (37 claves); CF
  `#197 R11`.
- [ ] (2) Implementación mínima: dos exportaciones en `src/theme/motion.ts`.
- [ ] (3) Refactor: ninguno.

### R12 — `homeEntering`
- [ ] (1) Test rojo: enmendar HE `#152 R3` ×2 y `#152 R4` (índice 0 a 14,
  índice 5).
- [ ] (2) Implementación mínima: `withDelay(delayMs, withTiming(…, MOTION_RISE_TIMING), ReduceMotion.System)`
  en `src/screens/home/home-entrance.tsx`; quitar imports que sobren.
- [ ] (3) Refactor: ninguno.

### R13 — Reduce motion
- [ ] (1) Test rojo: enmendar HE `#152 R4` (reduce motion) y HI `#190 R1`,
  `#190 R7`, `#152 R7`.
- [ ] (2) Implementación mínima: `entering={reducedMotion ? undefined : homeEntering(index * MOTION_STAGGER_MS, MOTION_RISE_OFFSET_Y)}`.
- [ ] (3) Refactor: ninguno.

## C07 — Sombras

### R14 — Tokens de sombra
- [ ] (1) Test rojo: GC `#197 R14` y CF `#197 R14`.
- [ ] (2) Implementación mínima: seis `--color-shadow-*` en los dos bloques.
- [ ] (3) Refactor: ninguno.

### R15 — `useShadows`
- [ ] (1) Test rojo: SW (cuatro `it`) y CF `#197 R15`.
- [ ] (2) Implementación mínima: `src/theme/shadows.ts` con `useShadows()` y el
  tipo `Shadows`.
- [ ] (3) Refactor: compartir con `chunky-lip.ts` solo si el helper de capa ya
  existe allí; si no, no crear módulo nuevo.

## C04 — Interruptor

### R16 — Render de `ToggleSwitch`
- [ ] (1) Test rojo: TS `#197 R16` ×2 y CF `#197 R16`.
- [ ] (2) Implementación mínima: `src/components/toggle-switch.tsx`.
- [ ] (3) Refactor: ninguno.

### R17 — Comportamiento
- [ ] (1) Test rojo: TS `#197 R17` ×3 (`await fireEvent.press`).
- [ ] (2) Implementación mínima: pasar `onSelectedChange` e `isDisabled` al
  `Switch` (si heroui ya lo resuelve, nace verde: anotarlo).
- [ ] (3) Refactor: ninguno.

## C06 — Cabecera

### R18 — Trazo de `BackButton`
- [ ] (1) Test rojo: BB `#197 R18` ×2.
- [ ] (2) Implementación mínima: prop `strokeWidth?: number` reenviado a
  `ChevronLeft`.
- [ ] (3) Refactor: ninguno.

### R19 — `ScreenHeader`
- [ ] (1) Test rojo: HD `#197 R19` ×6, CF `#197 R19`; enmendar PC `#173 R2.4` y
  añadir `components/screen-header.tsx` a la fila `tracking-title` de AC
  `#174 R12`.
- [ ] (2) Implementación mínima: `src/components/screen-header.tsx`.
- [ ] (3) Refactor: ninguno.

### R20 — Sin cablear
- [ ] (1) Test rojo: CF `#197 R20` ×2; enmendar el candado de `accent` de
  `legibility-classnames.test.ts`.
- [ ] (2) Implementación mínima: ninguna (debe nacer verde respecto a imports;
  el candado de `accent` se pone rojo desde R15/R16 y se enmienda aquí o en el
  commit de test de R15).
- [ ] (3) Refactor: ninguno.

## Carta y cierre

### R21 — Carta
- [ ] (1) Test rojo: CF `#197 R21` ×5; enmendar AC `#174 R11`, design-drift
  `#178 R2` y `#179 R2`, y `preservedLines` de CC.
- [ ] (2) Implementación mínima: copiar los cuatro bloques de design.md §
  «Texto canónico de la Enmienda #197» en `docs/ui-guidelines.md`.
- [ ] (3) Refactor: ninguno.

### R22 — Grep-limpio
- [ ] (1) Test rojo: CF `#197 R22` (nace verde si R1 a R21 cumplen; anotarlo).
- [ ] (2) Implementación mínima: corregir lo que el test señale.
- [ ] (3) Refactor: ninguno.

### R23 — Smoke humano
- [ ] Tras el veredicto aprobado del reviewer, el humano corre la lista de
  requirements.md § «Cierre del humano» en dev build Android y marca la
  casilla de § Aprobación.

## Verificación final

- [ ] `cd mobile-pet-tracker && bunx jest` completo en verde.
- [ ] `cd mobile-pet-tracker && bunx tsc --noEmit` y `bunx expo lint > /tmp/lint.log 2>&1 && test ! -s /tmp/lint.log`
  en verde.
- [ ] `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/app/_layout.tsx`
  vacío.
- [ ] `traceability.md` con hash y mensaje de cada commit.
