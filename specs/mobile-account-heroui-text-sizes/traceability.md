---
feature: "mobile-account-heroui-text-sizes"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad: tamaños 13 px y 17 px de las pantallas de cuenta (#187)

Rutas de test relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/heroui-text-size-merge.test.ts::#187 R1: el árbol de producción no pasa text-NN a HeroUI ni a Card` (y los otros 23 `it` del escáner) | pendiente |
| R2 | `screens/{login,register,forgot,reset-password}/index.test.tsx::#187 R2: la etiqueta "%s" … pinta 13 px` (12 filas) y `__tests__/account-screens-polish.test.ts::#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta` (literal 3 enmendado) | pendiente |
| R3 | `screens/{login,register,forgot,reset-password}/index.test.tsx::#187 R3: el botón <testID> pinta su etiqueta a 17 px` (5 `it`) y `__tests__/account-screens-polish.test.ts` (literales 10 y 11 enmendados) | pendiente |
| R4 | `__tests__/profile-canvas-fidelity.test.ts::limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)` y `__tests__/design-drift.test.ts::limita text-22 a Horario y text-17 al inventario de E1.2` (sin editar); `git diff --quiet H0 -- src/theme/global.css package.json bun.lock`; `git diff --name-only H0..HEAD` | pendiente |
| R5 | `__tests__/heroui-text-size-merge.test.ts::#187 R5: la carta fija la regla y la receta con Text plano` | pendiente |
| R6 | humano: smoke en dev build de Android, casilla «Smoke R6» de `requirements.md` | pendiente (lo cierra el humano) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente». La fila R6 solo
la cierra el humano; el implementer no la marca.
Convención de commit: `feat(#187 R2): <desc> (R2)`, `test(#187 R3): <desc> (R3)`.
El implementer rellena esta tabla en el commit c8 (`tasks.md`) con los hashes
reales de c1 a c7 y no rebasa después (cambiaría los hashes); el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
