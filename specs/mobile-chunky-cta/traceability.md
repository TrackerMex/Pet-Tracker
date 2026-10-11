---
feature: "mobile-chunky-cta"
---

# Trazabilidad — [[mobile-chunky-cta]] (#166)

> Una fila por requisito. Codex rellena los hashes al cerrar ([[tasks]]
> §Cierre): el commit `test` en rojo y el `feat`/`docs` en verde. R5 la
> firma el humano en [[requirements]] §Aprobación.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::#166 R1: global.css declara el labio gris en los dos temas > declara --color-lip-gray exacto en %s` | `13a0db1a test(mobile): falta el token del labio gris (R1)` → `d03bc813 feat(mobile): token --color-lip-gray en los dos temas (R1)` |
| R2 | `src/__tests__/consistency-classnames.test.ts::#166 R2: todo primario sólido lleva el labio detrás de bg-accent > inventaría los diecinueve primarios con labio, fichero a fichero` y `> no deja la receta del labio fuera de un primario`; más los 8 `it` actualizados de [[tasks]] T2.1 (entre ellos `src/components/__tests__/empty-state.test.tsx::declara el botón primario con labio`, que antes era `declara el botón primario sin labio`) | `76e691ec test(mobile): todo primario sólido lleva el labio (R2)` → `1b876c1d feat(mobile): labio en los diecinueve primarios sólidos (R2)` |
| R3 | `src/__tests__/consistency-classnames.test.ts::#166 R3: el secundario neutro lleva el labio gris > %s pinta %s con la receta del secundario en su tag de apertura` y `> inventaría los cuatro secundarios neutros de toda la app`; `src/screens/welcome/index.test.tsx::#166 R3: el CTA secundario lleva el labio gris > lleva el labio gris en el CTA secundario` y `::R8 > es un botón de superficie con labio gris y tinta accent-strong`. Sustituye a `#153 R7 > deja el CTA secundario sin labio`, que se borra | `3a88c9bb test(mobile): el secundario neutro lleva el labio gris (R3)` → `ee889a54 feat(mobile): labio gris en los cuatro secundarios neutros (R3)` |
| R4 | `src/__tests__/consistency-classnames.test.ts::#166 R4: la carta declara el botón con cuerpo > declara las dos recetas y el orden del labio` | `aab4b5f9 test(mobile): la carta declara el botón con cuerpo (R4)` → `fd5e2a30 docs(mobile): punto 13 de la carta, botón con cuerpo (R4)` |
| R5 | Prueba de humo humana en dev build de Android (casilla propia en [[requirements]] §Aprobación) | pendiente |
