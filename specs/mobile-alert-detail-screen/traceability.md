---
feature: "mobile-alert-detail-screen"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-alert-detail-screen]] (#100)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx`::`#100 R1: el catálogo trae las tres claves del detalle de alerta` | pendiente |
| R2 | `src/app/__tests__/detail-stack.test.tsx`::`#100 R2: el detalle de alerta vive en src/app/alerts/[alertId].tsx`; `src/app/__tests__/layout.test.tsx`::`#100 R2: la guarda de RootStack declara el detalle de alerta tras alerts` | pendiente |
| R3 | `src/screens/alert-detail/index.test.tsx`::`#100 R3: el detalle pinta la alerta de la caché de la lista` | pendiente |
| R4 | `src/screens/alert-detail/index.test.tsx`::`#100 R4: el detalle pinta carga, error y salida sin la alerta` | pendiente |
| R5 | `src/screens/alert-detail/index.test.tsx`::`#100 R5: el detalle marca leída la alerta`; `src/__tests__/design-drift.test.ts`::`preserves every mutation sign-out with zero delta` (mapa `screenSignOutCalls`) | pendiente |
| R6 | `src/screens/alerts/index.test.tsx`::`#100 R6: la columna de texto de cada fila abre su detalle` | pendiente |
| R7 | `src/hooks/use-push-registration.test.tsx`::`#100 R7: el toque abre el detalle de su alerta`; `src/app/__tests__/alert-detail.notification.test.tsx`::`#100 R7: el toque apila el detalle de su alerta una sola vez` | pendiente |
| R8 | `src/app/__tests__/alert-detail.navigation.test.tsx`::`#100 R8: fila, detalle y vuelta al centro con la alerta leída` | pendiente (rojo con mutación plantada) |
| R9 | `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`::`#114 R3: el toque de notificación apila alerts una sola vez` | pendiente (rojo con M7 plantada) |
| R10 | `src/__tests__/ui-language.test.ts`::`#100 R10: el detalle de alerta resuelve su copy por clave` | pendiente (rojo con mutación plantada) |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A15 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A15 de #100'` → `1` en cada doc | pendiente |
| A16 (`specs/mobile-push-registration/requirements.md`) | `grep -c 'Enmienda externa A16 — la escribe #100'` → `1` | pendiente |
| A17 (`specs/mobile-alerts-center/requirements.md`) | `grep -c 'Enmienda externa A17 — la escribe #100'` → `1` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1)`; el rojo previo va como
`test(<scope>): <desc> (R1)`. En R8, R9 y R10 (ruta (b) de C4) el mensaje del
rojo nombra la mutación plantada y el verde la revierte.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#100 R<n>` y, donde cambian, las aserciones heredadas
de [[design]] D9.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
