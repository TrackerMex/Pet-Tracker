---
feature: "mobile-profile-followups"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-profile-followups]]

Rutas relativas a `mobile-pet-tracker/`. R1 a R6 se verifican automáticamente; R1, R3, R4 y R5 nacen verdes y su rojo se demuestra por mutación plantada y revertida (X1 a X15 de [[design]]), no por commit rojo.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/profile/index.test.tsx::#184 R1: la cámara no responde mientras sube::#184 R1: no responde a toques durante la subida`. Nace verde; X1 rojo por sonda y contador, X2 rojo por sonda. X3 falla antes en accessibilityState (desvío documentado). | `178486b5` — `test(profile): lock the camera disabled prop during upload (R1)` |
| R2 | `src/screens/profile/index.test.tsx::#184 R2: handleChangePhoto ignora toques mientras hay uno en curso`: `#184 R2: un segundo toque con el picker abierto no lanza otro picker` y `#184 R2: libera la guardia tras %s` (7 salidas). Rojo real del doble toque antes de producción; X4, X5 y X6 detectadas y revertidas. | Rojo `5221b327` — `test(profile): require a reentry guard on the photo picker (R2)`; verde `1dbda4bd` — `fix(profile): ignore photo taps while a picker or upload is in flight (R2)` |
| R3 | `src/components/__tests__/pet-switcher.test.tsx::#173 R4: variante avatars::#184 R3: la foto usa size 40 y la cacheKey de cada mascota`. Nace verde; X7 a X10 rojas y revertidas. | `b9daabb7` — `test(components): lock avatar photo size and cacheKey in PetSwitcher (R3)` |
| R4 | `src/screens/profile/index.test.tsx::#184 R4: cerrar sesión conserva su botón danger-soft::#184 R4: conserva la variante y las clases`. Cadena idéntica a la aprobada; nace verde; X11 a X14 rojas y revertidas. | `fe2e5f81` — `test(profile): lock the sign-out button variant and classes (R4)` |
| R5 | `src/screens/profile/index.test.tsx::R1: me card::shows the real account name and email`, espera al nombre. X15: spike de 50 ms rojo con cuerpo antiguo, verde con el nuevo; spike retirado. | `54770013` — `test(profile): wait for the me-card name instead of the skeleton card (R5)` |
| R6 | Medición de líneas añadidas: hex, clases arbitrarias, StyleSheet.create, sombras legacy y emoji = 0; producción limitada a ref y handler, JSX idéntico. Alcance de cinco ficheros y verificación en `progress/impl_mobile-profile-followups.md`. Suite completa y PR corresponden al leader según handoff. | Producción `1dbda4bd`; evidencia y trazabilidad en `docs(profile): trazabilidad de #184` (este commit final; hash resoluble por el mensaje en el historial, sin autorreferencia literal). |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(<scope>): <desc> (R<n>)` y, solo en R2, `fix(profile): <desc> (R2)`.
Por instrucción específica del handoff aprobado, esta tabla se completa una sola
vez en el séptimo commit; el reviewer valida los hashes y la evidencia al aprobar
(ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No rebasear tras registrar los hashes.
