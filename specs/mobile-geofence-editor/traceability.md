---
feature: "mobile-geofence-editor"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-geofence-editor]]

Codex rellena esta tabla al cerrar ([[tasks]] §Cierre). Cada fila nombra el
`describe` del requisito y los dos commits del ciclo (rojo y verde, más el
de refactor si lo hubo), con hash corto y mensaje.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#146 R1: el catálogo trae las claves del editor de zonas` | `e37baecc` test(geofences): add geofence editor catalog keys test (R1); `3b7829c7` feat(geofences): add geofence editor catalog keys (R1); `b46b233c` refactor(geofences): compose the language spec suffix for the prefix check (R1) |
| R2 | `src/utils/zoom-for-radius.test.ts::#146 R2: zoomForRadius encuadra el círculo con su radio` | `c0b2b4e1` test(geofences): add zoomForRadius test (R2); `e496b3ad` feat(geofences): frame a circle by its radius (R2) |
| R3 | `src/components/__tests__/pet-map.test.tsx::#146 R3: PetMap pinta círculos, acepta zoom y emite el toque` | `106b851b` test(geofences): add PetMap circles, zoom and press test (R3); `d3f4eedb` feat(geofences): let PetMap draw circles and report taps (R3) |
| R4 | `src/api/__tests__/geofences.test.ts::#146 R4: createGeofence y updateGeofence mapean el guardado por kind` | `c55d8d51` test(geofences): add geofence create and update API test (R4); `f652d3e2` feat(geofences): create and update geofences with save states (R4) |
| R5 | `src/app/__tests__/detail-stack.test.tsx::#146 R5: el editor de zonas vive en src/app/pets/[petId]/geofence-editor.tsx` y `src/app/__tests__/layout.test.tsx::#146 R5: la guarda de RootStack declara el editor de zonas tras la lista` | `3e17680e` test(geofences): add geofence editor route test (R5); `d9ba0f3e` feat(geofences): add the geofence editor route (R5) |
| R6 | `src/screens/geofence-editor/index.test.tsx::#146 R6: el editor pinta el formulario sobre el mapa y sus estados` | `75572a0f` test(geofences): add geofence editor loading and states test (R6); `aec76ccc` feat(geofences): load the geofence editor and its states (R6); `92e04a0d` test(geofences): wait for the tree in the 401 case (R6) |
| R7 | `src/screens/geofence-editor/index.test.tsx::#146 R7: el toque y el slider mueven el borrador sin perseguir la cámara` | `77857cec` test(geofences): add geofence editor draft test (R7); `04c4f646` feat(geofences): move the draft with taps and the slider (R7); `c249391b` test(geofences): lock the draft camera and the create draft (R7) |
| R8 | `src/screens/geofence-editor/index.test.tsx::#146 R8: Guardar crea o actualiza la zona y vuelve a la lista` | `33b76a86` test(geofences): add geofence editor save test (R8); `84719d8f` feat(geofences): save the geofence and return to the list (R8) |
| R9 | `src/screens/geofences/index.test.tsx::#146 R9: el dueño entra al editor desde la lista` | `6be00c8a` test(geofences): add geofence list editor entry test (R9); `41745421` test(geofences): use the R1 English edit label (R9); `9310ce08` feat(geofences): open the editor from the geofence list (R9); `394efbd6` refactor(geofences): seed the owner role before the loading case (R9) |
| R10 | `src/__tests__/ui-language.test.ts::#146 R10: el editor de zonas resuelve su copy por clave` | `50ccd870` test(geofences): add geofence editor copy-by-key test (R10); `f774bdc8` feat(geofences): resolve geofence editor copy by key (R10) |
| R11 | `src/screens/map/index.test.tsx::#146 R11: la pestaña Mapa dibuja las zonas activas de la mascota` | `e805a7f4` test(geofences): add map tab geofence circles test (R11); `4c368245` feat(geofences): draw active geofences on the map tab (R11) |
| R12 | `src/screens/geofences/index.test.tsx::#146 R12: con el máximo de zonas la lista no ofrece añadir otra` | `02ac6843` test(geofences): lock the client-side geofence limit (R12); `6e12baea` feat(geofences): disable add zone at the geofence limit (R12) |
| R13 | `src/screens/geofence-editor/index.test.tsx::#146 R13: el interruptor del editor activa o desactiva la zona sin salir` | `3cdc9fb9` test(geofences): add geofence editor active switch test (R13); `e7851418` feat(geofences): toggle the zone from the editor (R13) |
| R14 | `src/screens/geofence-editor/index.test.tsx::#146 R14: Eliminar en el editor borra la zona y vuelve a la lista` | `7483443a` test(geofences): add geofence editor delete test (R14); `4f87940a` feat(geofences): delete the zone from the editor (R14) |
| R15 | `src/api/__tests__/geofences.test.ts::#146 R15: listGeofences rechaza una zona sin centro numérico` | `6c5211f7` test(geofences): reject geofences without a numeric center (R15); `f9b62c58` feat(geofences): validate the geofence center from the list (R15) |
| R16 | `src/screens/geofence-editor/index.test.tsx::#146 R16: quien no es dueño ve la zona sin poder editarla` | `86e2dd49` test(geofences): add geofence editor read-only test (R16); `8836846d` feat(geofences): show the zone read-only to non-owners (R16) |
| R17 | `src/__tests__/design-drift.test.ts::#146 R17: el centro por defecto del mapa vive en un solo sitio` | `b8d354dc` test(geofences): lock the default map center in one place (R17); `a3d30a36` refactor(map): export DEFAULT_CENTER from PetMap (R17) |
| R18 | `src/__tests__/consistency-classnames.test.ts::#62 R15: todo contador usa cifras tabulares` (fila del editor y `#69 R10`) | `9560f178` test(geofences): count the editor among tabular counters (R18); `a3896732` feat(geofences): use tabular digits in the editor radius (R18) |
| Enmienda A19 | `src/__tests__/hero-header-amendments.test.ts` sigue verde; `grep -c 'enmienda A19 de #146'` da 1 en cada doc | `ac8bbb12` docs(specs): apply amendment A19 of #146 |

Las aserciones heredadas que cambian ([[design]] D8) viajan en el commit
rojo de su requisito y no tienen fila propia.

**Regla:** el `reviewer` no aprueba con ninguna fila en *pendiente*. Los
commits siguen la convención `test(<scope>): <desc> (Rn)` /
`feat(<scope>): <desc> (R1,R2)` y cada hash debe ser ancestro del HEAD que
se revisa (C5 de `CHECKPOINTS.md`); si la branch se rebasa después de
rellenar la tabla, los hashes se reapuntan y se comprueban con
`git merge-base --is-ancestor <hash> HEAD`.
