---
feature: "mobile-profile-photo-owner-only"
status: draft        # draft | approved
tags: [mobile, roles, profile, spec]
---

# Trazabilidad — [[mobile-profile-photo-owner-only]] (#235)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol %s la cámara se pinta: %s` (4 filas) | Rojo: `f86afbb013d0688d8c6cd85b7df04f10f55e3caf` — `test(mobile): #235 profile camera only for the owner (R1)` (family, walker y vet fallan por `toBeNull`; owner nace verde). Verde: `7a769ff21f940b62f1951a4052efdeb73fb29151` — `feat(mobile): #235 profile camera only for the owner (R1, R3)`. |
| R2 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado ($name) no monta la cámara` (filas `detalle pendiente` y `error de detalle`; existente, nace verde, sin edición) | Sin commit propio: conservación verificada en `7a769ff21f940b62f1951a4052efdeb73fb29151` — `feat(mobile): #235 profile camera only for the owner (R1, R3)`. Ambas filas fallan con M2, M4, M5 y M8; evidencia y reversiones en `progress/impl_mobile-profile-photo-owner-only.md`. |
| R3 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve` y `› #235 R3 con la lista en %s y el detalle en %s la cámara se pinta: %s` (2 filas) | Rojo: `6e9d07e0128dc0ef52dff336eb7b7e551a1dacd8` — `test(mobile): #235 profile camera follows the selected pet (R3)` (Test A y lista owner / detalle family fallan por `toBeNull`; lista family / detalle owner nace verde). Verde: `7a769ff21f940b62f1951a4052efdeb73fb29151` — `feat(mobile): #235 profile camera only for the owner (R1, R3)`. M5 y M6 detectadas. |
| R4 | `mobile-pet-tracker/src/screens/profile/index.test.tsx::R7: cambiar foto`, `::#184 R1: la cámara no responde mientras sube`, `::#184 R2: handleChangePhoto ignora toques mientras hay uno en curso` y `::#196 R4: cámara flotante sobre la foto` (existentes, nacen verdes, sin edición) | Sin commit propio: conservación verificada en `7a769ff21f940b62f1951a4052efdeb73fb29151` — `feat(mobile): #235 profile camera only for the owner (R1, R3)`. Perfil: 219/219 verdes; anclas de R4 intactas; numstat de tests contra H0 `74 0`, con todo el contenido previo idéntico. |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo y
`feat(mobile): <desc> (R<n>)` para el verde, en ese orden (C4). El verde de
#235 es un solo commit `(R1, R3)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No se rebasea la rama después de rellenar esta tabla: un rebase cambia los
hashes de la columna de commits.
