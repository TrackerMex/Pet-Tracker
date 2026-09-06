---
feature: "mobile-pastel-category-palette"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-pastel-category-palette]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::#64 R1: global.css declara la paleta pastel categórica en tema claro` | `435a4e0` — `feat(mobile-pastel-palette): R1 declara la paleta clara` (rojo `a89c8ee`) |
| R2 | `src/theme/__tests__/global-css.test.ts::#64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary` | `bfc7779` — `feat(mobile-pastel-palette): R2 declara la paleta oscura` (rojo `edfdf38`) |
| R3 | `src/theme/__tests__/global-css.test.ts::#64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas` | `20bd366` — `feat(mobile-pastel-palette): R3 verifica contraste AA` (rojo `3521773`) |
| R4 | `src/theme/__tests__/global-css.test.ts::#64 R4: ninguna categoría se confunde con otra ni con un token de estado` | `2e0315e` — `feat(mobile-pastel-palette): R4 verifica separación perceptual` (rojos `395d13a`, ajustado a la enmienda firmada en `feac447`) |
| R5 | `src/utils/__tests__/category-palette.test.ts::#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta` | `c7a2223` — `feat(mobile-pastel-palette): R5 asigna huecos a recordatorios` (rojo `c5e01ab`) |
| R6 | `src/utils/__tests__/category-palette.test.ts::#64 R6: el tipo de documento resuelve su hueco y cae en neutral si es desconocido` | `dc9675a` — `feat(mobile-pastel-palette): R6 resuelve categorías documentales` (rojo `625e522`) |
| R7 | `src/screens/reminders/index.test.tsx::#64 R7: la fila de recordatorio pinta el icono con el color de su tipo` | `2319d4e` — `feat(mobile-pastel-palette): R7 pinta recordatorios por tipo` (rojo `9f4bd02`) |
| R8 | `src/screens/docs/index.test.tsx::#64 R8: la fila de documento pinta icono y badge con el color de su tipo` | `33ce3af` — `feat(mobile-pastel-palette): R8 pinta documentos por tipo` (rojo `d30ecad`) |
| R9 | `src/__tests__/consistency-classnames.test.ts::#64 R9: el color categórico solo se nombra en el módulo de paleta` | pendiente |
| R10 | `src/__tests__/consistency-classnames.test.ts::#64 R10: la carta declara la paleta categórica y su tabla de huecos` | pendiente |

Rutas relativas a `mobile-pet-tracker/`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-pastel-palette): <desc> (R1,R2)`, con el
commit de test rojo (`test(mobile-pastel-palette): …`) **anterior** al de
implementación en cada requisito (C4).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos que un humano cierra, no un test

| Gate | Estado |
|---|---|
| Aprobación de la spec, incluidas las tres decisiones firmadas en [[requirements]] §Aprobación | aprobado por humano el 2026-09-05 |
| Smoke en dev build de Android, temas claro y oscuro, pantallas Reminders y Documentos | pendiente |
