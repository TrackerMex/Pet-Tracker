---
feature: "mobile-figma-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-figma-polish]]

> Disciplina TDD para R1–R3 (cambios testeables por lectura). R4–R11 son
> cambios de puro `className`/estilo: **sin tests nuevos por decisión de
> [[design]] §6** — su gate es la suite existente verde sin diffs en asserts
> más el smoke humano de R12. Commits test-primero explícitos donde aplica.

## R1 — Tokens light del diseño en global.css

- [ ] (1) Escribir test que falla para R1 (lee `src/theme/global.css`, asserta hex del mapeo)
- [ ] (2) Implementación mínima que lo pasa (tabla de [[design]] §1)
- [ ] (3) Refactor con tests verdes

## R2 — Paleta dark derivada del diseño

- [ ] (1) Escribir test que falla para R2 (asserts sobre el bloque `dark`)
- [ ] (2) Implementación mínima que lo pasa ([[design]] §2)
- [ ] (3) Refactor con tests verdes

## R3 — Inter vía expo-font + assets/fonts

- [ ] (1) Escribir test que falla para R3 (existencia de los 5 `.ttf` + registro en `_layout.tsx`)
- [ ] (2) Implementación mínima que lo pasa (descargar `.ttf`, `useFonts`, familia default)
- [ ] (3) Refactor con tests verdes

## R4 — Tab bar: pill flotante re-tokenizada (NO barra anclada)

- [ ] Re-tokenizar `floating-tab-bar.tsx` conservando forma/posición/sombras (testIDs/labels intactos)
- [ ] Suite existente verde sin tocar asserts

## R5 — Weight chart con puntos y área degradada

- [ ] Aplicar cambios SVG en `weight-chart.tsx`
- [ ] Suite existente verde sin tocar asserts

## R6 — Home

- [ ] Aplicar clases objetivo en `(tabs)/home.tsx`
- [ ] Suite existente verde sin tocar asserts

## R7 — Map

- [ ] Aplicar clases objetivo en `(tabs)/map.tsx`
- [ ] Suite existente verde sin tocar asserts

## R8 — Health

- [ ] Aplicar clases objetivo en `(tabs)/health.tsx`
- [ ] Suite existente verde sin tocar asserts

## R9 — Weight log

- [ ] Aplicar clases objetivo en `(tabs)/weight-log.tsx`
- [ ] Suite existente verde sin tocar asserts

## R10 — Profile

- [ ] Aplicar clases objetivo en `(tabs)/profile.tsx`
- [ ] Suite existente verde sin tocar asserts

## R11 — Auth (login/register/forgot)

- [ ] Aplicar clases objetivo en `(auth)/login.tsx`, `register.tsx`, `forgot.tsx`
- [ ] Suite existente verde sin tocar asserts

## R12 — Cierre: suite completa + smoke humano

- [ ] `bun test` completo verde; `git diff` de `__tests__/` vacío salvo tests nuevos R1–R3
- [ ] Smoke humano en Expo Go lado a lado contra el Make (light y dark), resultado por pantalla en `progress/impl_mobile-figma-polish.md` — **solo lo cierra el humano**
