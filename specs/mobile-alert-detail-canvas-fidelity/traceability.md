---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: draft        # draft | approved
tags: [mobile, ui, canvas, alerts, spec]
---

# Trazabilidad — #180 Detalle de alerta fiel al canvas

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente (humo manual, requirements §6) | pendiente |

## Enmienda E1 (2026-10-18)

Las filas R4, R5, R6, R7 y R12 de arriba incluyen su parte enmendada por E1 (R4.1, R5.2, R6.1, R7.1, R7.3 y R12
«enmendado por E1»). Filas nuevas, una por id añadido; el implementer las rellena igual que las demás:

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R4.1 (enmendado por E1) | pendiente (`ping-ring.test.tsx`, 0 / 900 / 1900 ms) | pendiente |
| R4.5 | pendiente (`motion.test.ts`; `alert-detail-canvas-fidelity.test.ts`) | pendiente |
| R5.2 (enmendado por E1) | pendiente (`index.test.tsx`, BlurView) | pendiente |
| R5.5 | pendiente (`global-css.test.ts`) | pendiente |
| R5.6 | pendiente (`alert-detail-canvas-fidelity.test.ts`) | pendiente |
| R6.1 (enmendado por E1) | pendiente (`index.test.tsx`) | pendiente |
| R7.1 (enmendado por E1) | pendiente (`index.test.tsx`) | pendiente |
| R7.3 (enmendado por E1) | pendiente (`consistency-classnames.test.ts`: K7 y K8 sin delta, K9 +1) | pendiente |
| R7.4 | pendiente (`design-drift.test.ts`, K19) | pendiente |
| R7.5 | pendiente (`consistency-classnames.test.ts`, dos `it`: CTA en R6, ack en R7) | pendiente |
| R12 (enmendado por E1) | pendiente (`alert-detail-canvas-fidelity.test.ts`, quince anclas) | pendiente |
| R14 (humo, enmendado por E1) | pendiente (humo manual, requirements § Enmienda E1 E1.6) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Enmienda E2 (2026-10-18)

Filas que E2 añade o cambia. Las de R3, R7 y R13 de arriba siguen como están, con la nota de abajo:

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R3.7 (movido a R10 por E2.1) | pendiente (`alert-detail-canvas-fidelity.test.ts`: rojo y verde en R10) | pendiente |
| R7.2 (enmendado por E2.2) | pendiente (`index.test.tsx`: #100 R5 en R7; #170 R6 en R3; resto según la tabla de E2.2) | pendiente |
| R13.2 (enmendado por E2.1) | pendiente (`alert-detail-canvas-fidelity.test.ts`, con `bunx jest`) | pendiente |

Nota: la fila R3 de la tabla principal no incluye R3.7; su test cuenta en R10.
