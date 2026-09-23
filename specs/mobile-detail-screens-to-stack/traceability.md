---
feature: "mobile-detail-screens-to-stack"
status: approved       # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-detail-screens-to-stack]] (#95)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/selected-pet-provider.test.tsx`::`#95 R1: la selección pertenece a la sesión` | rojos `4a81f9e6`, `d09da63e` → verde `d346b71f` |
| R2 | `src/app/__tests__/detail-stack.test.tsx`::`#95 R2: las seis rutas de detalle viven en la raíz de src/app`; `src/app/__tests__/detail-stack.navigation.test.tsx`::`#95 R2: push y back apilan y desapilan sobre (tabs)`; `src/app/__tests__/layout.test.tsx`::`#95 R2: el layout raíz monta el provider y el Stack de detalle` | rojo `867d9387` → verde `73b55045` ← el listado de (tabs) lo canda #114 R1 |
| R3 | `src/app/__tests__/detail-stack.guard.test.tsx`::`#95 R3: la guarda protege las seis y deja libres (auth) y reset-password` | rojo `bf412174` → verde `73b55045` |
| R4 | `src/app/__tests__/layout.test.tsx`::`#95 R4: cada pantalla de detalle declara su cabecera nativa` | rojo `9af5e0e8` → verde `1dc15b5d` |
| R5 | `src/screens/add-reminder/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/screens/add-pet/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/screens/docs/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/screens/weight-log/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/screens/meal-schedule/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/screens/pairing/index.test.tsx`::`#95 R5: la pantalla no dibuja cabecera propia`; `src/providers/__tests__/language-provider.test.tsx`::`#65 R12` / `#95 R5: el catálogo ya no trae las seis claves de volver` | rojo `01cb63b9` → verde `f136e182`; limpieza C7 `0d84675c`, `e0b62c05`; ronda 2 rojo `24e881bb` → verde `5992daf9` |
| R6 | `src/screens/add-pet/index.test.tsx`::`#95 R6: métricas bajo cabecera nativa`; `src/screens/docs/index.test.tsx`::`#95 R6: métricas bajo cabecera nativa`; `src/screens/add-reminder/index.test.tsx`::`uses the metrics under the native header (#95 R6)`; `src/screens/weight-log/index.test.tsx`::`shows loading and the metrics under the native header (#95 R6)` y `R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa`; `src/screens/meal-schedule/index.test.tsx`::`shows loading and the metrics under the native header (#95 R6)`; `src/screens/pairing/index.test.tsx`::`renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)`; `src/__tests__/design-drift.test.ts`::`#95 R6: pairing no reserva el inset superior ni la banda del FloatingTabBar` | rojo `edb65ce6` → verde `3cd26fa9`; A11 `5a424db8` |
| R7 | `src/app/__tests__/detail-stack.test.tsx`::`#95 R7: el reset de #63 queda solo donde no lo cubre el Stack` | rojo `9b60ba4c` → verde `16776430` |
| R8 | `src/screens/pairing/index.test.tsx`::`#95 R8: ver en el mapa desapila pairing` | rojo `9ec04363` → verde `2a506636` |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A11 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A11 de #95'` → `1` en cada doc; `hero-header-amendments` 3/3 | `5a424db8` |
| A12 (`specs/mobile-device-pairing/design.md` §Enmienda #95) | casilla marcada en ese fichero | firmada 2026-09-23; aplicada desde `73b55045` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; el rojo previo va como
`test(<scope>): <desc> (R1)`. R2 y R3 comparten el commit verde.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#95 R<n>` (los ficheros comparten R-ids con otras
specs) y, para R6, también las aserciones heredadas que se actualizan
([[design]] D10).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
