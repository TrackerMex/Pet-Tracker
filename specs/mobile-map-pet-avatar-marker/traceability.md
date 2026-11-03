---
feature: "mobile-map-pet-avatar-marker"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-map-pet-avatar-marker]] (#230)

Rutas de test relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `screens/map/pet-marker-icon.test.tsx`::«#230 R1: el compositor es invisible, no recibe toques y está oculto a la accesibilidad»; `__tests__/map-canvas-fidelity.test.ts`::«#230 R1: el compositor no trae copy» | `195c0b75 test(mobile): hidden marker composer without copy (R1)`; `5c9f66a6 feat(mobile): hidden marker composer without copy (R1)`; ajustes de verificación: `7526e4ac test(mobile): type and name the marker SVG double (R3)` |
| R2 | `components/__tests__/pet-map.test.tsx`::«#230 R2: con icono el marcador lleva icon, anchor centrado y sin callout», «#230 R2: sin icono el marcador conserva su forma exacta», «#230 R2: sin posición no hay marcador aunque haya icono» | `8b8fd3f2 test(mobile): pet map marker takes an optional icon (R2)`; `79d569c3 feat(mobile): pet map marker takes an optional icon (R2)` |
| R3 | `screens/map/pet-marker-icon.test.tsx`::«#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3» | `03726951 test(mobile): marker composer draws the blobatar fallback (R3)`; `efac945d feat(mobile): marker composer draws the blobatar fallback (R3)`; ajustes de verificación: `7526e4ac test(mobile): type and name the marker SVG double (R3)`; `bdf53623 fix(mobile): type the marker clip test IDs (R3, R5)` |
| R4 | `screens/map/pet-marker-icon.test.tsx`::«#230 R4: captura el blobatar a 154 px tras dos frames y publica su icono», «#230 R4: desmontado antes del segundo frame no captura» | `187027ee test(mobile): marker composer captures the fallback after two frames (R4)`; `1103fc6b feat(mobile): marker composer captures the fallback after two frames (R4)` |
| R5 | `screens/map/pet-marker-icon.test.tsx`::«#230 R5: con foto dibuja la foto recortada en círculo con borde de 3», «#230 R5: con photoUrl null o vacía no hay Svg de foto» | `9a29d06c test(mobile): marker composer draws the circular photo (R5)`; `5f90ad49 feat(mobile): marker composer draws the circular photo (R5)`; ajustes de verificación: `bdf53623 fix(mobile): type the marker clip test IDs (R3, R5)` |
| R6 | `screens/map/pet-marker-icon.test.tsx`::«#230 R6: al cargar la foto la captura y sustituye al blobatar (enmendado por #230 R8)», «#230 R6: una captura del blobatar que llega tarde no pisa la foto» | `303be02f test(mobile): marker composer captures the photo and keeps it (R6)`; `5d3dba06 feat(mobile): marker composer captures the photo and keeps it (R6)`; enmienda: `64951596 test(mobile): marker composition key ignores the url signature (R8)` y `28a99c74 feat(mobile): marker composition key ignores the url signature (R8)` |
| R7 | `screens/map/pet-marker-icon.test.tsx`::«#230 R7: sin onLoad en 4000 ms la foto se desmonta y queda el blobatar», «#230 R7: un onLoad antes del plazo lo cancela» | `6685ed19 test(mobile): marker photo falls back after 4000 ms (R7)`; `913def8e feat(mobile): marker photo falls back after 4000 ms (R7)` |
| R8 | `screens/map/pet-marker-icon.test.tsx`::«#230 R8: la clave ignora la firma y distingue id, nombre y ruta», «#230 R8: un rerender con la URL re-firmada no recompone» | `64951596 test(mobile): marker composition key ignores the url signature (R8)`; `28a99c74 feat(mobile): marker composition key ignores the url signature (R8)` |
| R9 | `screens/map/pet-marker-icon.test.tsx`::«#230 R9: solo devuelve el icono de la composición vigente» | `56911cf3 test(mobile): only the current composition icon reaches the map (R9)`; `f9871bc8 feat(mobile): only the current composition icon reaches the map (R9)` |
| R10 | `screens/map/index.test.tsx`::«#230 R10: con posición monta el compositor oculto», «#230 R10: sin posición no monta el compositor», «#230 R10: el marcador recibe el icono compuesto»; `__tests__/map-canvas-fidelity.test.ts`::«#230 R10: el mapa monta el compositor con la clave de composición» | `fb7056f7 test(mobile): map shows the pet avatar marker (R10)`; `25ae2d28 feat(mobile): map shows the pet avatar marker (R10)` |
| R11 | `__tests__/map-canvas-fidelity.test.ts`::«#230 R11: screens/map/pet-marker-icon.tsx respeta la guarda %s» (6 filas), «#230 R11: el compositor importa solo lo suyo» | `c7b5f9dd test(mobile): drift guards for the marker composer (R11)` |

Mutaciones de las filas que nacen verdes (ver [[tasks]]): **13 verificadas y revertidas**, con sus órdenes y salidas en [[../../progress/impl_mobile-map-pet-avatar-marker|reporte]].

- R2a, `icon: props.markerIcon` incondicional: cae «sin icono el marcador conserva su forma exacta» (recibido `icon: null`). R2b, condición `props.marker || props.markerIcon`: cae «sin posición no hay marcador aunque haya icono» (recibido marcador con coordenadas null). También cae el primer it de R2 en ambas sondas porque aún faltaba implementar el icono completo.
- R4, después del verde `1103fc6b`: ref capturado antes del primer frame y sin comprobar limpieza en el segundo; cae «desmontado antes del segundo frame no captura» (esperado 0 llamadas, recibido 1).
- R5, montar foto con `photoUrl !== null`: cae «con photoUrl null o vacía no hay Svg de foto» (recibido Svg con href vacío).
- R7, plazo sin cancelar en onLoad: cae «un onLoad antes del plazo lo cancela» (Svg ausente a los 5000 ms).
- R10, compositor sin comprobar marker: cae «sin posición no monta el compositor» (recibido View del compositor).
- R11 hex, StyleSheet.create, emoji, import de degradado, rounded-xl, text-accent y PetAvatar: cada mutación pone roja su fila. El import de expo-linear-gradient pone roja además «el compositor importa solo lo suyo», porque añade un módulo ajeno a la lista permitida. Las otras seis mutaciones solo ponen roja su propia fila.

En todos los casos se restauró producción con `git checkout HEAD -- <ruta>` y se verificó `git diff --quiet -- <ruta>` = 0; ninguna mutación se commiteó. En R5, R7 y R10 se plantó temporalmente la rama necesaria para ejercer la condición mutada antes del commit rojo y se restauró entera.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): … (R<n>)` y `feat(mobile): … (R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
