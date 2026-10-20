---
feature: "mobile-profile-followups"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-profile-followups]]

Rutas relativas a `mobile-pet-tracker/`. R1 a R6 se verifican automáticamente; R1, R3, R4 y R5 nacen verdes y su rojo se demuestra por mutación plantada y revertida (X1 a X15 de [[design]]), no por commit rojo.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente (`src/screens/profile/index.test.tsx::#184 R1: la cámara no responde mientras sube`) | pendiente |
| R2 | pendiente (`src/screens/profile/index.test.tsx::#184 R2: handleChangePhoto ignora toques mientras hay uno en curso`: doble toque con el picker abierto y 7 filas de liberación) | pendiente (commit rojo `test(profile): ... (R2)` y verde `fix(profile): ... (R2)`) |
| R3 | pendiente (`src/components/__tests__/pet-switcher.test.tsx::#173 R4: variante avatars::#184 R3: la foto usa size 40 y la cacheKey de cada mascota`) | pendiente |
| R4 | pendiente (`src/screens/profile/index.test.tsx::#184 R4: cerrar sesión conserva su botón danger-soft`) | pendiente |
| R5 | pendiente (`src/screens/profile/index.test.tsx::R1: me card::shows the real account name and email`, enmendado) | pendiente |
| R6 | pendiente (medición de grep-clean y lista de ficheros del diff en `progress/impl_mobile-profile-followups.md`) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(<scope>): <desc> (R<n>)` y, solo en R2, `fix(profile): <desc> (R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No rebasear tras registrar los hashes.
