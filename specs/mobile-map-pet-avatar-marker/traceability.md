---
feature: "mobile-map-pet-avatar-marker"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-map-pet-avatar-marker]] (#230)

Rutas de test relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R1: el compositor es invisible, no recibe toques y está oculto a la accesibilidad»; `__tests__/map-canvas-fidelity.test.ts`::«#230 R1: el compositor no trae copy» | pendiente |
| R2 | pendiente — `components/__tests__/pet-map.test.tsx`::«#230 R2: con icono el marcador lleva icon, anchor centrado y sin callout», «#230 R2: sin icono el marcador conserva su forma exacta», «#230 R2: sin posición no hay marcador aunque haya icono» | pendiente |
| R3 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3» | pendiente |
| R4 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R4: captura el blobatar a 154 px tras dos frames y publica su icono», «#230 R4: desmontado antes del segundo frame no captura» | pendiente |
| R5 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R5: con foto dibuja la foto recortada en círculo con borde de 3», «#230 R5: con photoUrl null o vacía no hay Svg de foto» | pendiente |
| R6 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R6: al cargar la foto la captura y sustituye al blobatar», «#230 R6: una captura del blobatar que llega tarde no pisa la foto» | pendiente |
| R7 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R7: sin onLoad en 4000 ms la foto se desmonta y queda el blobatar», «#230 R7: un onLoad antes del plazo lo cancela» | pendiente |
| R8 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R8: la clave ignora la firma y distingue id, nombre y ruta», «#230 R8: un rerender con la URL re-firmada no recompone» | pendiente |
| R9 | pendiente — `screens/map/pet-marker-icon.test.tsx`::«#230 R9: solo devuelve el icono de la composición vigente» | pendiente |
| R10 | pendiente — `screens/map/index.test.tsx`::«#230 R10: con posición monta el compositor oculto», «#230 R10: sin posición no monta el compositor», «#230 R10: el marcador recibe el icono compuesto»; `__tests__/map-canvas-fidelity.test.ts`::«#230 R10: el mapa monta el compositor con la clave de composición» | pendiente |
| R11 | pendiente — `__tests__/map-canvas-fidelity.test.ts`::«#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda %s» (6 filas), «#230 R11: el compositor importa solo lo suyo» | pendiente |

Mutaciones de las filas que nacen verdes (ver [[tasks]]): pendiente.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): … (R<n>)` y `feat(mobile): … (R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
