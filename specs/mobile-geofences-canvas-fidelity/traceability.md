---
feature: mobile-geofences-canvas-fidelity
id: 189
status: draft        # draft | approved
tags: [mobile, ui, canvas, geofences, spec]
---

# Trazabilidad — #189 Zonas seguras y Editor de zona fieles al canvas

Base de implementación: `4204530e`. Firma humana E3 / H0 de la tercera reanudación: `162f151b`.
La validación automatizada y las líneas `Tests:` por bloque están en
[[../../progress/impl_mobile-geofences-canvas-fidelity|informe de implementación]].
El smoke Android de requirements §6 corresponde al humano; no se afirma ejecutado.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/app/__tests__/layout.test.tsx::declara pets/[petId]/geofences y geofence-editor (enmendado por #189 R1.1); src/screens/geofences/index.test.tsx::#189 R1: título y contador en el contenido | `ea7fea7a feat(mobile): #189 R1 render content heading and zone counter (R1)` |
| R2 | src/screens/geofences/index.test.tsx::#189 R2: cinco segmentos indican las zonas usadas | `c4feee5c feat(mobile): #189 R2 render accessible zone progress (R2)` |
| R3 | src/screens/geofences/index.test.tsx::#189 R3: métricas y orden del contenido | `d1cff68a feat(mobile): #189 R3 apply canvas spacing and content order (R3)` |
| R4 | src/utils/__tests__/category-palette.test.ts::#189 R4: las zonas reparten cinco ranuras por posición | `4a3b7261 feat(mobile): #189 R4 assign zone colors by position (R4)` |
| R5 | src/screens/geofences/index.test.tsx::#189 R5: filas con tile pastel, textos y controles; src/__tests__/design-drift.test.ts::rounded-14 | `ff2d303e feat(mobile): #189 R5 style zone rows and accessible icon deletion (R5)` |
| R6 | src/screens/geofences/index.test.tsx::#189 R6: aviso ámbar al alcanzar el límite; src/__tests__/profile-canvas-fidelity.test.ts::rounded-tile/text-13 | `a3a97a60 feat(mobile): #189 R6 render amber zone limit notice (R6)` |
| R7 | src/screens/geofences/index.test.tsx::#189 R7: Añadir zona conserva una sola CTA anclada al pie; src/__tests__/chunky-cta-canvas-fidelity.test.ts::#177 R3.1/R3.2/R6.2/R7.3/R7.5/R8.1 enmendados | `7d93a46d feat(mobile): #189 R7 anchor add-zone CTA and show limit state (R7)` |
| R8 | src/screens/geofence-editor/index.test.tsx::#189 R8: título en contenido y píldora de cristal sobre el mapa; src/__tests__/profile-canvas-fidelity.test.ts::text-26; src/__tests__/alerts-canvas-fidelity.test.ts::tracking-title | `80d38dd4 feat(mobile): #189 R8 render editor glass and state titles (R8)` |
| R9 | src/screens/geofence-editor/index.test.tsx::#189 R9: hoja estática solapada y capas del mapa; #146 R6::paddingBottom: 291; src/__tests__/consistency-classnames.test.ts::#189 R9: la hoja del Editor combina esquina continua y flex sin perderlos | `f9f42cbe feat(mobile): #189 R9 overlap static form sheet over map (R9)` |
| R10 | src/screens/geofence-editor/index.test.tsx::#189 R10: campo Nombre con Label.Text e input del canvas | `f5ef4230 feat(mobile): #189 R10 match canvas name field typography (R10)` |
| R11 | src/screens/geofence-editor/index.test.tsx::#189 R11: bloque Radio y extremos ligados al slider | `f5997745 feat(mobile): #189 R11 group radius controls and shared endpoints (R11)` |
| R12 | src/screens/geofence-editor/index.test.tsx::#189 R12: fila Activa conserva interruptor y orden; src/__tests__/alerts-canvas-fidelity.test.ts::text-15 | `fb04857b feat(mobile): #189 R12 match active row label (R12)` |
| R13 | src/screens/geofence-editor/index.test.tsx::#189 R13: acciones del Editor en fila y Guardar deshabilitado; src/__tests__/chunky-cta-canvas-fidelity.test.ts y src/__tests__/consistency-classnames.test.ts::inventarios neutros y labios enmendados | `d2d3e78d feat(mobile): #189 R13 arrange editor actions and disabled save recipe (R13)` |
| R14 | src/screens/geofence-editor/index.test.tsx::#189 R14: métricas y avisos conservados en las ramas de estado | `e4dc03c3 feat(mobile): #189 R14 align state screen spacing with canvas (R14)` |
| R15 | src/providers/__tests__/language-provider.test.tsx::#189 R15: las cinco claves de geocercas tienen copy exacta en ambos idiomas; src/__tests__/ui-language.test.ts::#41 R10 y #146 R10 enmendados | `ce5f6298 feat(mobile): #189 R15 add exact bilingual geofence copy (R15)` |
| R16 | src/__tests__/geofences-canvas-fidelity.test.ts::#189 R16.1/R16.2/R16.3/R16.4 | `644472be feat(mobile): #189 R16 document approved geofence canvas exceptions (R16)` |
| R17 | src/screens/geofences/index.test.tsx::#41 R5-R8, #146, #155 R8, #159 R5/R6; src/screens/geofence-editor/index.test.tsx::#146 R6/R7/R8/R13/R14/R16 conservados; sonda real owner→family y restauración | `de23d7e5 feat(mobile): #189 R17 restore owner gate and verify unchanged behavior (R17)` |
| R18 | src/__tests__/geofences-canvas-fidelity.test.ts::#189 R18: candados de fuente de ambas pantallas (13 casos; 14 sondas reales documentadas en el informe) | `cd26b658 feat(mobile): #189 R18 restore compliant zone sources (R18)` |
| R19 | src/__tests__/geofences-canvas-fidelity.test.ts::#189 R19; src/screens/geofences/index.test.tsx::#189 R19; src/screens/geofence-editor/index.test.tsx::#189 R19; chunky-cta-canvas-fidelity.test.ts::#177 R3.1/R4.1/R7.5/R8.1 enmendados | pendiente |
| R20 | src/screens/geofences/index.test.tsx::#189 R7 enmendado por E4 R20 | pendiente |
| R21 | src/app/__tests__/layout.test.tsx (enmendado por E4 R21); src/screens/geofences/index.test.tsx::#189 R1/R3 enmendados por E4 R21 | pendiente |
| R22 | src/screens/geofence-editor/index.test.tsx::#189 R22; #189 R8/R9 y #146 R6 enmendados por E4 R22 | pendiente |
| R23 | src/__tests__/geofences-canvas-fidelity.test.ts::#189 R23 | pendiente |
| R24 | src/__tests__/geofences-canvas-fidelity.test.ts::#189 R16.1 enmendado y #189 R24.1/R24.2/R24.3 | pendiente |

R17 conserva las pruebas existentes y no añade casos. El rojo `44c1e6da` planta una mutación de rol;
`de23d7e5` la restaura. R18 tiene rojo versionado `0896a843` con dos mutaciones reales de
producción; `cd26b658` las restaura. Ese HEAD intermedio contiene deliberadamente código mutado
(C4), y no representa la implementación final.

| Enmienda autorizada | Commit | Validación |
|---|---|---|
| E1 §4.1 | `bde4290a` (inventarios de R1); `a3a97a60`, `80d38dd4`, `fb04857b`, `d2d3e78d` completan las filas de sus R | Inventarios text-26/text-13/text-15/tracking-title y border-lip-gray; base + delta en el informe |
| E2 §4.2 | `b0a94836`; `7d93a46d` / `d2d3e78d` completan los deltas de R7/R13 | Button.Label 19→17 / 50→46; text-17 24→26; primarios semánticos 17 intactos; sondas residuales en el informe |
| E3 §4.3 | `75c6bb6f test(mobile): #189 E3 pisos HeroUI y expo-blur del Editor` | Pisos HeroUI 199→197 y className 166→163; expo-blur 2→3 ficheros. Pisos de ficheros/Card y candado text-NN intactos |
| E4 §4.4 | pendiente (firma humana sin dar; H0-E4 = commit del handoff de E4) | Medidas M10-M19 base + delta, sondas P-E4-1..13 y candados agregados de §4.4 en el informe; smoke §6 pasos 6-10 del humano |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): #189 R<n> <desc>`; el rojo previo `test(mobile): #189 R<n> rojo — <desc>`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
