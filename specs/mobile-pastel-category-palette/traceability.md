---
feature: "mobile-pastel-category-palette"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-pastel-category-palette]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::#64 R1: global.css declara la paleta pastel categórica en tema claro` | pendiente |
| R2 | `src/theme/__tests__/global-css.test.ts::#64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary` | pendiente |
| R3 | `src/theme/__tests__/global-css.test.ts::#64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas` | pendiente |
| R4 | `src/theme/__tests__/global-css.test.ts::#64 R4: ninguna categoría se confunde con otra ni con un token de estado` | pendiente |
| R5 | `src/utils/__tests__/category-palette.test.ts::#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta` | pendiente |
| R6 | `src/utils/__tests__/category-palette.test.ts::#64 R6: el tipo de documento resuelve su hueco y cae en neutral si es desconocido` | pendiente |
| R7 | `src/screens/reminders/index.test.tsx::#64 R7: la fila de recordatorio pinta el icono con el color de su tipo` | pendiente |
| R8 | `src/screens/docs/index.test.tsx::#64 R8: la fila de documento pinta icono y badge con el color de su tipo` | pendiente |
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
| Aprobación de la spec, incluidas las tres decisiones firmadas en [[requirements]] §Aprobación | pendiente |
| Smoke en dev build de Android, temas claro y oscuro, pantallas Reminders y Documentos | pendiente |
