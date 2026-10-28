---
feature: "mobile-orbit-activity-pose"
status: approved     # draft | approved
tags: [mobile, ui, mascota, orbit, spec]
---

# Trazabilidad — [[mobile-orbit-activity-pose]] (#225)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente: `src/__tests__/orbit-activity-pose.test.ts::#225 R1: declara home.orbitWalkLabel en los dos idiomas y su registro` | pendiente |
| R2 | pendiente: `src/__tests__/orbit-rename.test.ts::#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve` | pendiente |
| R3 | pendiente: `src/__tests__/orbit-rename.test.ts::#225 R3: el código de producción no nombra a Pingo ni en contenido ni en rutas` (+ 3 `it` de R3) | pendiente |
| R4 | pendiente: `src/__tests__/orbit-rename.test.ts::#225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento` y `::#225 R4: cada excepción casa exactamente las líneas declaradas` | pendiente |
| R5 | pendiente: `src/__tests__/orbit-activity-pose.test.ts::#225 R5: orbit-walk.webp es WebP VP8X con alfa, estático, 1024 × 1024 y como mucho 100000 bytes` y `::#225 R5: el maestro PNG y su prompt están congelados en la spec` | pendiente |
| R6 | pendiente: `src/screens/home/orbit-phrase.test.ts::#225 R6: homeOrbitPose elige la pose por la frase` (3 bloques) | pendiente |
| R7 | pendiente: `src/screens/home/index.test.tsx::#225 R7: Orbit camina cuando la frase es de actividad` (4 `it`) | pendiente |
| R8 | pendiente: `src/__tests__/orbit-activity-pose.test.ts::#225 R8: la hipótesis H3 de #190 queda cerrada` | pendiente |
| R9 | pendiente: `src/__tests__/orbit-charter-voice.test.ts::#221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)` (C13; G4 firmado en `5c69aafe`) | pendiente |

Regla: el reviewer no aprueba si alguna fila de R1 a R9 queda "pendiente". Con
la fe de erratas E1 de [[requirements]] R9, R9 es C13 del implementador.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
