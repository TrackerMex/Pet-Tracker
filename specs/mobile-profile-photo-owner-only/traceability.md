---
feature: "mobile-profile-photo-owner-only"
status: draft        # draft | approved
tags: [mobile, roles, profile, spec]
---

# Trazabilidad — [[mobile-profile-photo-owner-only]] (#235)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol %s la cámara se pinta: %s` (4 filas) | pendiente |
| R2 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado ($name) no monta la cámara` (filas `detalle pendiente` y `error de detalle`; existente, nace verde, sin edición) | pendiente (sin commit propio; lo cubren el rojo y el verde de R1 y R3, y la batería de mutaciones M2, M4, M5 y M8) |
| R3 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve` y `› #235 R3 con la lista en %s y el detalle en %s la cámara se pinta: %s` (2 filas) | pendiente |
| R4 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::R7: cambiar foto`, `::#184 R1: la cámara no responde mientras sube`, `::#184 R2: handleChangePhoto ignora toques mientras hay uno en curso` y `::#196 R4: cámara flotante sobre la foto` (existentes, nacen verdes, sin edición) | pendiente (sin commit propio; candado de no-edición en tasks.md) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo y
`feat(mobile): <desc> (R<n>)` para el verde, en ese orden (C4). El verde de
#235 es un solo commit `(R1, R3)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No se rebasea la rama después de rellenar esta tabla: un rebase cambia los
hashes de la columna de commits.
