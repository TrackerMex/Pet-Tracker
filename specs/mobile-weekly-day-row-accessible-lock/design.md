---
feature: "mobile-weekly-day-row-accessible-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Diseño — [[mobile-weekly-day-row-accessible-lock]] (#130)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo añade tests a la capa de presentación móvil
> (`src/screens/home/`): no hay dominio, aplicación ni infraestructura
> implicados.

## Decisiones técnicas

- **R1, una lista cerrada de las claves de props del host.** Es el patrón de
  `#74 R2` (`grep -n "#74 R2" src/screens/home/weekly-activity-chart.test.tsx`).
  `Object.keys(props).sort()` con `toEqual` contra un literal falla con
  cualquier prop nueva, se llame como se llame, sin tener que listar qué props
  de accesibilidad existen hoy en RN 0.86.2 (`accessible`, `aria-*`, `role`,
  `importantForAccessibility`, `accessibilityElementsHidden`…) ni cuáles
  llegarán. Un `Pressable` en lugar de la fila también lo ve: llega al host con
  `accessible`, `focusable` y los manejadores del responder.
- **R2, la cadena tarjeta → fila → columnas, por `children` y `parent`.** Una
  lista cerrada en la fila no ve un nodo nuevo por encima o por debajo de ella:
  sus claves no cambian. El `TestInstance` de `test-renderer` 1.2.0, que es lo
  que devuelven las consultas de RNTL v14, expone `parent` y `children` (solo
  host, y sin los ocultos por defecto). Con ellos:
  - los `testID` de `row.children`, con `toEqual` contra los siete literales,
    fijan identidad, orden y cardinalidad por hijos (carta §Enmienda #70);
  - `row.parent?.props.testID`, con `toBe`, fija que entre la tarjeta y la fila
    no hay nada.

  La tarjeta ya tiene su lista cerrada en `#74 R2`, así que, con R1 y R2, todo
  nodo host entre la tarjeta y cada columna tiene candado.
- **Los rojos son mutaciones de producción versionadas** (C4, vía **b**),
  porque la base ya cumple: `accessible` en la fila para R1, y un
  `<View accessible>` alrededor de las siete columnas para R2. Cada verde las
  revierte con `git checkout HEAD~1 --`, y la gráfica acaba en su blob de base.
- **Un `describe` por requisito, con el prefijo `#130 R<n>:`**, al final del
  test, después de `#74 R3`. El `#` del prefijo va siempre seguido de un espacio
  y `R<n>`: es la excepción de `HEX_LITERAL` (`#(?!\d{2,3} R\d)…`) en
  `src/__tests__/design-drift.test.ts`, y un `#130` suelto rompe `#68 R18`
  (medido, [[requirements]] §Premisas).
- **Los literales, del test.** Las claves de R1, los siete `testID` de R2 y el
  de la tarjeta se escriben a mano. Nada se importa de la gráfica, y no se
  añade ningún import nuevo al test.
- **El `typeof child === 'string'` del `map` de R2** está para el tipo:
  `children` es `(TestInstance | string)[]`. La fila no tiene texto suelto, así
  que en verde no pasa nunca, pero si alguien lo mete, sale en la lista y el
  `toEqual` falla. `bunx tsc --noEmit` lo acepta sin anotaciones (medido).

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
  (presentación, tests): dos `describe` nuevos al final. Pasa de 41 a 43 tests.
- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
  (presentación): **solo** en los dos commits rojos, con la mutación que el
  verde siguiente revierte. Diff acumulado vacío.
- `progress/impl_mobile-weekly-day-row-accessible-lock.md` y
  `specs/mobile-weekly-day-row-accessible-lock/traceability.md`: la evidencia.

## Coordinación

- **#100 `mobile-alert-detail-screen` (sesión Backend)** no toca ninguno de los
  dos ficheros. Sí toca `src/__tests__/design-drift.test.ts`, que lee el test de
  la gráfica en `#68 R18` y en el candado de `use-api`, pero con Δ 0 tests y en
  otros mapas. Si #100 mergea antes que esta branch, la suite de base tendrá más
  tests: el delta exigido sigue siendo +2 sobre lo medido. Los dos comparten
  harness (`feature_list.json`, `progress/`).
- **#108 `design-drift-hex-guard-rid`** ya está en `origin/main`: el guard de
  hex medido es el vigente.

## Alternativas descartadas

- **Extender la aserción de `#68 R9` con `accessible` `toBeUndefined()`.**
  Sigue siendo una lista abierta: deja pasar `aria-label`, `role`,
  `importantForAccessibility="no"` y cualquier prop futura. Y tocaría un
  `describe` de #68, que el criterio 3 quiere intacto.
- **Una lista de props «prohibidas» recorriendo los ancestros de cada
  columna** (ninguno con `accessible`, `aria-label`…). Es semántica, pero es
  otra lista abierta: la prop que no se listó pasa. La estructura cerrada de R2
  es más estricta y más corta.
- **Solo R1, sin R2.** Cumple la letra del criterio 1, pero deja el hueco de
  los envoltorios, que funde las columnas igual (sondas `wrapout` y `wrapin`,
  verdes hoy).
- **Contar las columnas por `testID` con `toHaveLength(7)` dentro de la fila.**
  Es el recuento por prefijo que la carta prohíbe: no ve un hijo sin `testID`
  (sonda `extra`) ni el orden.
- **Candar también `flex-row` y el `padding` de la fila.** No es de
  accesibilidad, y el `padding` necesita un candado relacional con la geometría
  del gráfico, no un literal. Queda como **(F)** ([[requirements]] §Fuera de
  alcance).
- **Un gate de TalkBack.** El árbol de producción acaba idéntico al de
  `origin/main`: no hay nada nuevo que oír en un dispositivo.
