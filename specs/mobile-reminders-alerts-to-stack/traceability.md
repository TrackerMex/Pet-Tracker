---
feature: "mobile-reminders-alerts-to-stack"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-reminders-alerts-to-stack]] (#114)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/app/__tests__/detail-stack.test.tsx`::`#114 R1: reminders y alerts viven en la raíz de src/app`; `src/app/__tests__/layout.test.tsx`::`#114 R1: la guarda de RootStack declara reminders y alerts tras las seis` | rojo `c2ba2c16` → verde `c7883721` |
| R2 | `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`::`#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)` | rojo `892151b5` → verde `c7883721` |
| R3 | `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`::`#114 R3: el toque de notificación apila alerts una sola vez` | rojo `dc4f5485` → verde `c7883721` |
| R4 | `src/app/__tests__/layout.test.tsx`::`#114 R4: reminders y alerts declaran su cabecera nativa` | rojo `a0a27e66` → verde `9f88d0ef` |
| R5 | `src/screens/reminders/index.test.tsx`::`#114 R5: el título vive en la cabecera nativa`; `src/screens/alerts/index.test.tsx`::`#114 R5: el título vive en la cabecera nativa` | rojo `6e4bdad0` → verde `cc0c971b` |
| R6 | `src/screens/reminders/index.test.tsx`::`R5: reminders monta con métricas y estados` › `uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)`; `src/screens/alerts/index.test.tsx`::`#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas` › `respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6)` | rojo `277e8fd0` → verde `a18a7bef` |
| R7 | `src/screens/add-reminder/index.test.tsx`::`#114 R7: sin mascota, add-reminder desapila hasta reminders` | rojo `d7e727d9` → verde `36a9eca6` |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| P1 (decisión de producto) | casilla marcada en [[requirements]] §Aprobación | firmada 2026-09-23 (`f5a491ee`) |
| A13 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A13 de #114'` → `1` en cada doc | `97d2476a` |
| A14 (`specs/mobile-alerts-center/requirements.md`, `specs/mobile-reminders/requirements.md`) | `grep -c 'Enmienda externa A14 — la escribe #114'` → `1` en cada spec | `c713068c` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; el rojo previo va como
`test(<scope>): <desc> (R1)`. R1, R2 y R3 comparten el commit verde.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#114 R<n>` y, para R6, las aserciones heredadas que se
actualizan ([[design]] D9).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
