---
feature: "mobile-alert-detail-screen"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-alert-detail-screen]] (#100)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx`::`#100 R1: el catálogo trae las tres claves del detalle de alerta` | `ae9f4087` test(alert-detail): three copy keys for the alert detail (R1) → `bf26a10a` feat(alert-detail): add the alert detail copy keys (R1) |
| R2 | `src/app/__tests__/detail-stack.test.tsx`::`#100 R2: el detalle de alerta vive en src/app/alerts/[alertId].tsx`; `src/app/__tests__/layout.test.tsx`::`#100 R2: la guarda de RootStack declara el detalle de alerta tras alerts` | `4d0100db` test(alert-detail): the alert detail route lives on the root stack (R2) → `b1559720` feat(alert-detail): declare alerts/[alertId] as a singular root route (R2) |
| R3 | `src/screens/alert-detail/index.test.tsx`::`#100 R3: el detalle pinta la alerta de la caché de la lista` | `12f07895` test(alert-detail): the detail renders the cached alert (R3) → `94caf5e8` feat(alert-detail): render the alert card from the list cache (R3); corrección posterior solo de test: `1ea6fa53` test(alert-detail): wait for the card before reading the A11 metrics (R3) |
| R4 | `src/screens/alert-detail/index.test.tsx`::`#100 R4: el detalle pinta carga, error y salida sin la alerta` | `f1981f74` test(alert-detail): loading, error and exit without the alert (R4) → `a9cd5edb` feat(alert-detail): show loading and error states and leave when the alert is gone (R4); corrección posterior solo de test: `93108204` test(alert-detail): wait for the skeleton to leave before the unauthorized checks (R4) |
| R5 | `src/screens/alert-detail/index.test.tsx`::`#100 R5: el detalle marca leída la alerta`; `src/__tests__/design-drift.test.ts`::`preserves every mutation sign-out with zero delta` (mapa `screenSignOutCalls`) | `b9803cc5` test(alert-detail): acknowledge the alert from the detail (R5) → `0ca6e4dc` feat(alert-detail): acknowledge the alert from the detail (R5) |
| R6 | `src/screens/alerts/index.test.tsx`::`#100 R6: la columna de texto de cada fila abre su detalle` | `8f7a0134` test(alerts): the row text column opens its detail (R6) → `f1149451` feat(alerts): link each row to its alert detail (R6) |
| R7 | `src/hooks/use-push-registration.test.tsx`::`#100 R7: el toque abre el detalle de su alerta`; `src/app/__tests__/alert-detail.notification.test.tsx`::`#100 R7: el toque apila el detalle de su alerta una sola vez` | `848df9fe` test(push): the notification tap opens its alert detail (R7) → `9664ca9b` feat(push): open the tapped alert detail (R7) |
| R8 | `src/app/__tests__/alert-detail.navigation.test.tsx`::`#100 R8: fila, detalle y vuelta al centro con la alerta leída` | `4f848e56` test(alert-detail): round trip from a second-page row (R8, plants mutation: found reads pages[0] only); rojo adicional `67084429` test(alert-detail): drive the round trip with real timers (R8, keeps mutation: found reads pages[0] only) → `4429bdd9` feat(alert-detail): search every cached page for the alert (R8); corrección posterior solo de test: `9c07ed8e` test(alert-detail): name the icon double for lint (R8) |
| R9 | `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`::`#114 R3: el toque de notificación apila alerts una sola vez` | `36cf98bf` test(reminders-alerts-stack): flush timers before asserting the stack (R9, plants mutation M7) → `3983e29e` fix(reminders-alerts-stack): keep alerts singular (R9) |
| R10 | `src/__tests__/ui-language.test.ts`::`#100 R10: el detalle de alerta resuelve su copy por clave` | `5bdf0cd6` test(alert-detail): the detail resolves its copy by key (R10, plants mutation: retry key through a constant) → `d7d43a01` feat(alert-detail): resolve the retry label by literal key (R10) |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A15 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A15 de #100'` → `1` en cada doc | firma `cf52c00f`; aplicación `fc55c55c` docs(specs): apply amendments A15-A17 of #100 |
| A16 (`specs/mobile-push-registration/requirements.md`) | `grep -c 'Enmienda externa A16 — la escribe #100'` → `1` | firma `cf52c00f`; aplicación `fc55c55c` docs(specs): apply amendments A15-A17 of #100 |
| A17 (`specs/mobile-alerts-center/requirements.md`) | `grep -c 'Enmienda externa A17 — la escribe #100'` → `1` | firma `cf52c00f`; aplicación `fc55c55c` docs(specs): apply amendments A15-A17 of #100 |

Regla: el reviewer comprueba que cada fila cita sus commits.
Convención de commit: `feat(<scope>): <desc> (R1)`; el rojo previo va como
`test(<scope>): <desc> (R1)`. En R8, R9 y R10 (ruta (b) de C4) el mensaje del
rojo nombra la mutación plantada y el verde la revierte.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#100 R<n>` y, donde cambian, las aserciones heredadas
de [[design]] D9.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
