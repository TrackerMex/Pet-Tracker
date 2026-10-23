---
feature: "mobile-profile-photo-hero-canvas"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-profile-photo-hero-canvas]]

`T` = `mobile-pet-tracker/src/screens/profile/index.test.tsx`. Las columnas de
commits las rellena el implementador; el reviewer las verifica.

| R-id | Test (fichero › `it`) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `T` › `#196 R1: en la rama $name monta el hero = $hero` | — | — | pendiente |
| R2 | `T` › `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot`; `#196 R2: con la lista pendiente el slot no monta el selector`; `#196 R2: sin hero ($name) pinta la fila clara al principio del contenido`; `#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas` | — | — | pendiente |
| R3 | `src/components/__tests__/pet-hero-header.test.tsx` › `#196 R3: con caption y mascota el pie solo pinta el caption`; `#196 R3: sin caption el pie no cambia`; `#196 R3: con caption y sin mascota el pie sigue en skeleton`; `T` › `#196 R3: pinta nombre y chips dentro del pie del hero` | — | — | pendiente |
| R4 | `T` › `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto`; `#196 R4: sin detalle cargado ($name) no monta la cámara`; `#196 R4: con la subida fallida pinta el error justo antes de la info` | — | — | pendiente |
| R5 | `T` › `#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido`; `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título`; `#196 R5: el CTA del aviso lleva labio primario y abre la configuración`; `#196 R5: con el permiso concedido no pinta el aviso` | — | — | pendiente |
| R6 | `T` › `#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15`; `#196 R6: Cerrar sesión llama a signOut una vez` | — | — | pendiente |
| R7 | `T` › `#196 R7: el tema usa ToggleSwitch con pulgar`; `#196 R7: con tema $0 el interruptor pide $1` | — | — | pendiente |
| R8 | `T` › `#196 R8: el icono de $0 usa trazo 2.2` | — | — | pendiente |
| R9 | `T` › `#196 R9: en la rama $name los índices de entrada son fijos`; `#196 R9: con el permiso bloqueado el aviso entra con índice 0` | — | — | pendiente |
| R10 | `src/__tests__/profile-photo-hero-canvas.test.ts` › `#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple`; `#196 R10: la tabla cubre los tres artboards` | — | — | pendiente |
| R11 | `src/__tests__/tab-headers-canvas.test.ts` › `#196 R11: PetHeroHeader solo en Inicio y Perfil`; `#196 R11: la carta recoge la enmienda N1 de #196` | — | — | pendiente |

Smoke en dev build Android (R1–R7 y R9): requirements.md §Cierre del humano.
