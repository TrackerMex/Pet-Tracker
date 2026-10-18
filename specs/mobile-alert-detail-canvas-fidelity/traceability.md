---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: approved      # draft | approved
tags: [mobile, ui, canvas, alerts, spec]
---

# Trazabilidad — #180 Detalle de alerta fiel al canvas

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/screens/alert-detail/index.test.tsx::#180 R1.2; layout.test.tsx::con título vacío; UL/PF/AC inventarios | rojo `b07bc024` — test(mobile): #180 R1 rojo — título del detalle en el contenido; verde `e37300ec` — feat(mobile): #180 R1 título del detalle en el contenido (D-H) |
| R2 | src/screens/alert-detail/index.test.tsx::#180 R2.1, R2.2, R2.3 | rojo `3ae25afc` — test(mobile): #180 R2 rojo — marco, espaciador y orden de hijos; verde `e07b671c` — feat(mobile): #180 R2 marco y ack anclado al fondo; corrección E4.2 (B2, R2.3 en seis casos con S31): rojo `c044bf39` — test(mobile): #180 R2.3 rojo — seis casos del mapa y S31; verde `1ba58e5a` — fix(mobile): #180 R2.3 revierte S31 — mapa con posición aunque no haya zona |
| R3 | src/screens/alert-detail/index.test.tsx::#180 R3.1/R3.2/R3.3, R3.4, R3.5, R3.6; src/utils/alert-meta.test.ts::#180 R3.1; PF/DD/AC inventarios (R3.7 en R10) | rojo `b9c7b918` — test(mobile): #180 R3 rojo — héroe centrado con disco, píldora y fecha corta; verde `a3d851d5` — feat(mobile): #180 R3 héroe del detalle fiel al canvas |
| R4 | src/screens/alert-detail/ping-ring.test.tsx::#180 R4.1 (enmendado por E1); src/screens/alert-detail/index.test.tsx::#180 R4.2/R4.3; src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R4.4/R4.5; src/theme/__tests__/motion.test.ts::#180 R4.5 | rojo `b9e645f2` — test(mobile): #180 R4 rojo — ping del héroe; verde `b897fef4` — feat(mobile): #180 R4 ping del héroe |
| R5 | src/screens/alert-detail/index.test.tsx::#180 R5.1/R5.2/R5.3/R5.4; src/theme/__tests__/global-css.test.ts::#180 R5.5; src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R5.6; src/__tests__/ui-language.test.ts::registro de copy (R8.2, E3) | rojo `878bf9bd` — test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque; verde `e11c0893` — feat(mobile): #180 R5 mapa con píldora de distancia |
| R6 | src/screens/alert-detail/index.test.tsx::#180 R6.1/R6.2; src/__tests__/consistency-classnames.test.ts::#180 R7.5 «Ver en el mapa» | rojo `00a609c6` — test(mobile): #180 R6 rojo — CTA con icono Map, h-13 y rounded-16; verde `d4a38dff` — feat(mobile): #180 R6 CTA Ver en el mapa |
| R7 | src/screens/alert-detail/index.test.tsx::#180 R7.1 y #100 R5/#134 R2; src/__tests__/consistency-classnames.test.ts::#166 R2 y #180 R7.5 ack; src/__tests__/design-drift.test.ts::#180 R7.4 | rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R8 | src/providers/__tests__/language-provider.test.tsx::#180 R8.1 y #65 R12 (catálogo); R8.2 en R5 por E3 | rojo `3785d0c3` — test(mobile): #180 R8 rojo — alerts.mapLabel; verde `a022a8b2` — feat(mobile): #180 R8 alerts.mapLabel |
| R9 | src/screens/alert-detail/index.test.tsx::#180 R9.1 | rojo `cf07abb5` — test(mobile): #180 R9 rojo — entrada escalonada del héroe y el mapa; verde `81aba5f6` — feat(mobile): #180 R9 entrada escalonada |
| R10 | src/screens/alert-detail/index.test.tsx::#180 R10.1/R10.2; src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R3.7; PF inventario rounded-hero | rojo `b5565332` — test(mobile): #180 R10 rojo — esqueleto rounded-hero y reintento h-13; verde `c851eb1e` — feat(mobile): #180 R10 carga y error |
| R11 | src/utils/alert-meta.test.ts::#180 R11.1 (cinco campos por tipo); surface retirado en R3 | rojo `66d9afc7` — test(mobile): #180 R11 rojo — campos del héroe en alert-meta; verde `b17379e5` — feat(mobile): #180 R11 campos del héroe en alert-meta |
| R12 | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R12: enmiendas (7 bloques, 15 anclas, carta y §2.35); AC K15 | rojo `4a85717e` — test(mobile): #180 R12 rojo — enmiendas de la carta y de las specs; verde `643daf6d` — docs(mobile): #180 R12 enmiendas y carta del detalle de alerta |
| R13 | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R13.2; src/__tests__/ui-language.test.ts::registra cada ocurrencia del detalle (enmendado por #180 R13.1); 30 mutaciones; suite completa 115/115 y 3796/3796 | `74f0fa9d` — test(mobile): #180 R13 candados agregados (nace verde: R13.1 queda fuera de C4 puntos 2 y 5 por E4.1; verificado por mutación S15, rojo en `src/app/_layout.tsx` y revertida) |
| R14 | Humo manual de requirements §6 y E1.6: ejecutado por el humano en su PC, dev build de Android, 2026-10-18; casilla §6 marcada | Sin commit de smoke de IA; aprobación del contrato: 6f2b8403 / 42222344; casilla marcada `32359981` |

## Enmienda E1 (2026-10-18)

Las filas R4, R5, R6, R7 y R12 de arriba incluyen su parte enmendada por E1 (R4.1, R5.2, R6.1, R7.1, R7.3 y R12
«enmendado por E1»). Filas nuevas, una por id añadido; el implementer las rellena igual que las demás:

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R4.1 (enmendado por E1) | src/screens/alert-detail/ping-ring.test.tsx::#180 R4.1 (0/900/1900 ms) | rojo `b9e645f2` — test(mobile): #180 R4 rojo — ping del héroe; verde `b897fef4` — feat(mobile): #180 R4 ping del héroe |
| R4.5 | src/theme/__tests__/motion.test.ts::#180 R4.5; src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R4.5 | rojo `b9e645f2` — test(mobile): #180 R4 rojo — ping del héroe; verde `b897fef4` — feat(mobile): #180 R4 ping del héroe |
| R5.2 (enmendado por E1) | src/screens/alert-detail/index.test.tsx::#180 R5.2 (BlurView, tint, clase y umbrales) | rojo `878bf9bd` — test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque; verde `e11c0893` — feat(mobile): #180 R5 mapa con píldora de distancia |
| R5.5 | src/theme/__tests__/global-css.test.ts::#180 R5.5 | rojo `878bf9bd` — test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque; verde `e11c0893` — feat(mobile): #180 R5 mapa con píldora de distancia |
| R5.6 | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R5.6; diff de package.json/bun.lock vacío | rojo `878bf9bd` — test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque; verde `e11c0893` — feat(mobile): #180 R5 mapa con píldora de distancia |
| R6.1 (enmendado por E1) | src/screens/alert-detail/index.test.tsx::#180 R6.1 | rojo `00a609c6` — test(mobile): #180 R6 rojo — CTA con icono Map, h-13 y rounded-16; verde `d4a38dff` — feat(mobile): #180 R6 CTA Ver en el mapa |
| R7.1 (enmendado por E1) | src/screens/alert-detail/index.test.tsx::#180 R7.1 | rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R7.3 (enmendado por E1) | src/__tests__/consistency-classnames.test.ts::#62 R1/#166 R2; K7/K8 sin delta, K9 +1 | rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R7.4 | src/__tests__/design-drift.test.ts::#180 R7.4 y reserva de radios | rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R7.5 | src/__tests__/consistency-classnames.test.ts::#180 R7.5: «Ver en el mapa» del detalle lleva rounded-16 con su labio gris / el ack del detalle lleva rounded-16 con su labio | rojo `00a609c6` — test(mobile): #180 R6 rojo — CTA con icono Map, h-13 y rounded-16; verde `d4a38dff` — feat(mobile): #180 R6 CTA Ver en el mapa; rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R12 (enmendado por E1) | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R12: enmiendas; quince anclas | rojo `4a85717e` — test(mobile): #180 R12 rojo — enmiendas de la carta y de las specs; verde `643daf6d` — docs(mobile): #180 R12 enmiendas y carta del detalle de alerta |
| R14 (humo, enmendado por E1) | Humo manual de requirements §6 y E1.6: ejecutado por el humano en su PC, dev build de Android, 2026-10-18; casilla §6 marcada | Sin commit de smoke de IA; aprobación del contrato: 6f2b8403 / 42222344; casilla marcada `32359981` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Enmienda E2 (2026-10-18)

Filas que E2 añade o cambia. Las de R3, R7 y R13 de arriba siguen como están, con la nota de abajo:

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R3.7 (movido a R10 por E2.1) | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R3.7 | rojo `b5565332` — test(mobile): #180 R10 rojo — esqueleto rounded-hero y reintento h-13; verde `c851eb1e` — feat(mobile): #180 R10 carga y error |
| R7.2 (enmendado por E2.2) | src/screens/alert-detail/index.test.tsx::#100 R5/#134 R2/#170 R6 y R8–R14, comportamiento conservado; visuales enmendadas por E2 | rojo `b9c7b918` — test(mobile): #180 R3 rojo — héroe centrado con disco, píldora y fecha corta; verde `a3d851d5` — feat(mobile): #180 R3 héroe del detalle fiel al canvas; rojo `cdd18c2d` — test(mobile): #180 R7 rojo — ack primario con labio y rounded-16; verde `e1a0cea0` — feat(mobile): #180 R7 ack primario con labio |
| R13.2 (enmendado por E2.1) | src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R13.2 y todos los candados C; ejecución individual con bunx (20/20) | `74f0fa9d` — test(mobile): #180 R13 candados agregados; origen C: rojo `b9e645f2` — test(mobile): #180 R4 rojo — ping del héroe; verde `b897fef4` — feat(mobile): #180 R4 ping del héroe |

Nota: la fila R3 de la tabla principal no incluye R3.7; su test cuenta en R10.

## Enmienda E3 (2026-10-18)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R8.2 (movido a R5 por E3.1) | src/__tests__/ui-language.test.ts::registro de R13_ALERT_DETAIL y ALL_USES | rojo `878bf9bd` — test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque; verde `e11c0893` — feat(mobile): #180 R5 mapa con píldora de distancia |

Nota: K4 y K5 (LP) siguen en R8.

R14 superado: el humano ejecutó el humo en su PC, en el dev build de Android (2026-10-18), y marcó su casilla en requirements §6 (`32359981`); el agente no lo ejecutó. R1–R13 tienen verificación automática; el veredicto final corresponde al reviewer.

Formato sin cambio semántico para M15/M16/M21: `4933ce00` — style(mobile): #180 R13 separa las props del ack para medidas. Después: DT 125/125, CC 72/72, DD 111/111 y tsc/lint verdes.
