---
feature: "mobile-account-heroui-text-sizes"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad: tamaños 13 px y 17 px de las pantallas de cuenta (#187)

Rutas de test relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/heroui-text-size-merge.test.ts::#187 R1: el árbol de producción no pasa text-NN a HeroUI ni a Card` (y los otros 23 `it` del escáner) | c1 `6d2096456cc8784eaff5d0256129e08875ae645a` — candado de familia (test); c2b `9c0d0e485b4f42caab4736d6b836e96384b5c3a2` — piso HeroUI a 227; c2c `e613944dee9a8bd88b951b3d202e3105c0effbd5` — piso className a 181, ambos autorizados por humano; E2: `7bd23dbb` — pisos a 226 y 180 (ack de #180), autorizado por humano; c3 `4f177bd5067cc3550e449388ae61d382da294371` y c5 `f637704dc747f2d799eeedb1c0b3b2914c56c459` — hallazgos 17 → 5 → 0; 24 it verdes |
| R2 | `screens/{login,register,forgot,reset-password}/index.test.tsx::#187 R2: la etiqueta "%s" … pinta 13 px` (12 filas) y `__tests__/account-screens-polish.test.ts::#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta` (literal 3 enmendado) | c2 `33a6740402e5cba166e59d22805b85b6159256ba` — doce tests y literal 3; c3 `4f177bd5067cc3550e449388ae61d382da294371` — doce etiquetas con Text plano; 12 filas verdes |
| R3 | `screens/{login,register,forgot,reset-password}/index.test.tsx::#187 R3: el botón <testID> pinta su etiqueta a 17 px` (5 `it`) y `__tests__/account-screens-polish.test.ts` (literales 10 y 11 enmendados) | c4 `f4d0b7830dc91ca7dce084f3b6b67a9ffad9de95` — cinco tests y literales 10/11; c5 `f637704dc747f2d799eeedb1c0b3b2914c56c459` — cinco botones con Text plano; E2: `e40d54b1` — ack de `alert-detail` con Text plano (sitio 18, cubierto por el `it` 1 de R1); 5 it verdes |
| R4 | `__tests__/profile-canvas-fidelity.test.ts::limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)` y `__tests__/design-drift.test.ts::limita text-22 a Horario y text-17 al inventario de E1.2` (sin editar); `git diff --quiet H0 -- src/theme/global.css package.json bun.lock`; `git diff --name-only H0..HEAD` | Verificados en c1 `6d2096456cc8784eaff5d0256129e08875ae645a`, c2 `33a6740402e5cba166e59d22805b85b6159256ba`, c3 `4f177bd5067cc3550e449388ae61d382da294371`, c4 `f4d0b7830dc91ca7dce084f3b6b67a9ffad9de95`, c5 `f637704dc747f2d799eeedb1c0b3b2914c56c459` y c7 `820f7f1b970f46a1ae60b56fddd7c500b0b6cca2`: guards 26/112 verdes sin editar; invariantes de tokens/deps intactos; 13 ficheros en cierre. Tras c5: HeroUI 227, ficheros 29, Card 42, className 181 |
| R5 | `__tests__/heroui-text-size-merge.test.ts::#187 R5: la carta fija la regla y la receta con Text plano` | c6 `a83a17b7fad01c29a17be2603b0ae8a9153c9c67` — test rojo de la carta; c7 `820f7f1b970f46a1ae60b56fddd7c500b0b6cca2` — enmienda literal al final; 25 it del fichero verdes |
| R6 | humano: smoke en dev build de Android, casilla «Smoke R6» de `requirements.md` | pendiente (lo cierra el humano) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente». La fila R6 solo
la cierra el humano; el implementer no la marca.
Convención de commit: `feat(#187 R2): <desc> (R2)`, `test(#187 R3): <desc> (R3)`.
El implementer rellena esta tabla en el commit c8 (`tasks.md`) con los hashes
reales de c1 a c7 y no rebasa después (cambiaría los hashes); el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
