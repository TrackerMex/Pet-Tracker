---
feature: "mobile-profile-photo-hero-canvas"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-profile-photo-hero-canvas]]

`T` = `mobile-pet-tracker/src/screens/profile/index.test.tsx`. Las columnas de
commits las rellena el implementador; el reviewer las verifica. R1 y R4
comparten el par de hashes del bloque R1+R4, y R2 y R5 el del bloque R2+R5
(D14). R9 no tiene commit verde: sus `it` nacen verdes.

| R-id | Test (fichero › `it`) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `T` › `#196 R1: en la rama $name monta el hero = $hero`; `#196 R1: pinta nombre y chips dentro del pie del hero` (R1.4); `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R15: grep-limpio` › `screens/profile/index.tsx no tiene escapes de estilo` (R1.5, sin `it` nuevo) | 47a0325a (bloque R1+R4) | — | bloqueado: parada K38; parche tentativo en el reporte |
| R2 | `T` › `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot`; `#196 R2: con la lista pendiente el slot no monta el selector`; `#196 R2: sin hero ($name) pinta la fila clara al principio del contenido`; `#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas` | — | — | no iniciado: parada previa K38 |
| R3 | `src/components/__tests__/pet-hero-header.test.tsx` › `#196 R3: con caption y mascota el pie solo pinta el caption`; `#196 R3: sin caption el pie no cambia`; `#196 R3: con caption y sin mascota el pie sigue en skeleton` | 1a82f15c | 9fac05f1 | verificado (95 tests / 3 suites; tres sondas) |
| R4 | `T` › `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto`; `#196 R4: sin detalle cargado ($name) no monta la cámara` (se espera que nazca verde); `#196 R4: con la subida fallida pinta el error justo antes de la info` | 47a0325a (bloque R1+R4) | — | bloqueado: parada K38; parche tentativo en el reporte |
| R5 | `T` › `#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido`; `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título`; `#196 R5: el CTA del aviso lleva labio primario y abre la configuración`; `#196 R5: con el permiso concedido no pinta el aviso` (se espera que nazca verde) | — | — | no iniciado: parada previa K38 |
| R6 | `T` › `#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15`; `#196 R6: Cerrar sesión llama a signOut una vez` | — | — | no iniciado: parada previa K38 |
| R7 | `T` › `#196 R7: el tema usa ToggleSwitch con pulgar`; `#196 R7: con tema $0 el interruptor pide $1` | — | — | no iniciado: parada previa K38 |
| R8 | `T` › `#196 R8: el icono de $0 usa trazo 2.2` | — | — | no iniciado: parada previa K38 |
| R9 | `T` › `#196 R9: en la rama $name los índices de entrada son fijos`; `#196 R9: con el permiso bloqueado el aviso entra con índice 0` (nacen verdes, D14) | — | no aplica | no iniciado: parada previa K38 |
| R10 | `src/__tests__/profile-photo-hero-canvas.test.ts` › `#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple`; `#196 R10: la tabla cubre los tres artboards` | — | — | no iniciado: parada previa K38 |
| R11 | `src/__tests__/tab-headers-canvas.test.ts` › `#196 R11: PetHeroHeader solo en Inicio y Perfil` (verde en el bloque R1+R4); `#196 R11: la carta recoge la enmienda N1 de #196`; `src/__tests__/hero-header-amendments.test.ts` › `aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11)` (K41, en el verde) | bebe426d | a5df30ac (carta/K41) | parcial: consumidor espera R1+R4; parada K38 |

Smoke en dev build Android (R1–R7 y R9): requirements.md §Cierre del humano.

## Parada de implementación (2026-10-24)

El intento de verde de R1+R4 activa la parada obligatoria de K38 del handoff:
dos tests previos sin modificar de `R7: cambiar foto` fallan por visibilidad
de la cámara. También K6 falla por visibilidad del chip, una aserción distinta
de su enmienda. El aislado con `--runInBand` da 12 failed, 154 passed,
166 total (`progress/test-196-r1r4-green-isolated.log`). No hay verde de ese
bloque. La producción tentativa se conserva como diff en
`progress/impl_mobile-profile-photo-hero-canvas.md` y se restaura para dejar
limpio el árbol; los tests rojos quedan en 47a0325a. El leader debe resolver
el gate de K38 antes de continuar. No se declara completa esta feature.
