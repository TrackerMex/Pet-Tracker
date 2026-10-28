---
feature: "mobile-orbit-activity-pose"
status: approved     # draft | approved
tags: [mobile, ui, mascota, orbit, spec]
---

# Trazabilidad — [[mobile-orbit-activity-pose]] (#225)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-activity-pose.test.ts::#225 R1: declara home.orbitWalkLabel en los dos idiomas y su registro` | rojo `f1066e52` test(mobile): R1 R7 red, walking pose and label on Home (#225); verde `3ab17a84` feat(mobile): R1 R7 Orbit walks on Home when the phrase is about activity (#225) |
| R2 | `src/__tests__/orbit-rename.test.ts::#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve` | rojo `e42d4a72` test(mobile): R2 red, mascot images named orbit-* (#225); verde `c8ee4db4` feat(mobile): R2 rename mascot images to orbit-* (#225) |
| R3 | `src/__tests__/orbit-rename.test.ts::#225 R3: el código de producción no nombra a Pingo ni en contenido ni en rutas`, `::#225 R3: los módulos renombrados exportan los nombres nuevos y no los viejos`, `::#225 R3: el catálogo renombra las siete claves con los mismos valores` y `::#225 R3: el inventario de copy y la tabla de idioma registran las claves nuevas` | rojo `ee6645be` test(mobile): R3 R4 red, no Pingo in production or test code (#225); verde `3bb1bc32` feat(mobile): R3 R4 rename Pingo identifiers to Orbit (#225) |
| R4 | `src/__tests__/orbit-rename.test.ts::#225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento` y `::#225 R4: cada excepción casa exactamente las líneas declaradas (enmendado por #225 R9)` | rojo `ee6645be` test(mobile): R3 R4 red, no Pingo in production or test code (#225); verde `3bb1bc32` feat(mobile): R3 R4 rename Pingo identifiers to Orbit (#225); enmienda R9 `9d1655a5` |
| R5 | `src/__tests__/orbit-activity-pose.test.ts::#225 R5: orbit-walk.webp es WebP VP8X con alfa, estático, 1024 × 1024 y como mucho 100000 bytes` y `::#225 R5: el maestro PNG y su prompt están congelados en la spec` | rojo `8825994b` test(mobile): R5 red, walking pose asset (#225); verde `ff392501` feat(mobile): R5 add orbit-walk.webp (#225) |
| R6 | `src/screens/home/orbit-phrase.test.ts::#225 R6: homeOrbitPose elige la pose por la frase` (3 bloques, 11 `it`) | rojo `ea5c6608` test(mobile): R6 red, home orbit pose follows the phrase (#225); verde `0b88a629` feat(mobile): R6 homeOrbitPose (#225) |
| R7 | `src/screens/home/index.test.tsx::#225 R7: Orbit camina cuando la frase es de actividad` (4 `it`) y `::#190 R4: Pingo usa su pose decorativa de 56 px › pinta pingo-talk como único hijo directo del envoltorio y sin etiqueta (enmendado por #195 R16) (enmendado por #225 R7)` | rojo `f1066e52` test(mobile): R1 R7 red, walking pose and label on Home (#225); verde `3ab17a84` feat(mobile): R1 R7 Orbit walks on Home when the phrase is about activity (#225) |
| R8 | `src/__tests__/orbit-activity-pose.test.ts::#225 R8: la hipótesis H3 de #190 queda cerrada` | rojo `3954a658` test(mobile): R8 red, close #190 H3 (#225); verde `957f8d3c` docs(spec): R8 close #190 H3 with the walking pose (#225) |
| R9 | `src/__tests__/orbit-charter-voice.test.ts::#221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)` (C13; G4 firmado en `5c69aafe`) | `9d1655a5` docs(ui): R9 charter note names the orbit prefix (#225) |

Regla: el reviewer no aprueba si alguna fila de R1 a R9 queda "pendiente". Con
la fe de erratas E1 de [[requirements]] R9, R9 es C13 del implementador.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
