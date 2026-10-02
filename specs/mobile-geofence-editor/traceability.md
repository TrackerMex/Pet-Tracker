---
feature: "mobile-geofence-editor"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-geofence-editor]]

Codex rellena esta tabla al cerrar ([[tasks]] §Cierre). Cada fila nombra el
`describe` del requisito y los dos commits del ciclo (rojo y verde, más el
de refactor si lo hubo), con hash corto y mensaje.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#146 R1: el catálogo trae las claves del editor de zonas` | pendiente |
| R2 | `src/utils/zoom-for-radius.test.ts::#146 R2: zoomForRadius encuadra el círculo con su radio` | pendiente |
| R3 | `src/components/__tests__/pet-map.test.tsx::#146 R3: PetMap pinta círculos, acepta zoom y emite el toque` | pendiente |
| R4 | `src/api/__tests__/geofences.test.ts::#146 R4: createGeofence y updateGeofence mapean el guardado por kind` | pendiente |
| R5 | `src/app/__tests__/detail-stack.test.tsx::#146 R5: el editor de zonas vive en src/app/pets/[petId]/geofence-editor.tsx` y `src/app/__tests__/layout.test.tsx::#146 R5: la guarda de RootStack declara el editor de zonas tras la lista` | pendiente |
| R6 | `src/screens/geofence-editor/index.test.tsx::#146 R6: el editor pinta el formulario sobre el mapa y sus estados` | pendiente |
| R7 | `src/screens/geofence-editor/index.test.tsx::#146 R7: el toque y el slider mueven el borrador sin perseguir la cámara` | pendiente |
| R8 | `src/screens/geofence-editor/index.test.tsx::#146 R8: Guardar crea o actualiza la zona y vuelve a la lista` | pendiente |
| R9 | `src/screens/geofences/index.test.tsx::#146 R9: el dueño entra al editor desde la lista` | pendiente |
| R10 | `src/__tests__/ui-language.test.ts::#146 R10: el editor de zonas resuelve su copy por clave` | pendiente |
| R11 | `src/screens/map/index.test.tsx::#146 R11: la pestaña Mapa dibuja las zonas activas de la mascota` | pendiente |
| R12 | `src/screens/geofences/index.test.tsx::#146 R12: con el máximo de zonas la lista no ofrece añadir otra` | pendiente |
| R13 | `src/screens/geofence-editor/index.test.tsx::#146 R13: el interruptor del editor activa o desactiva la zona sin salir` | pendiente |
| R14 | `src/screens/geofence-editor/index.test.tsx::#146 R14: Eliminar en el editor borra la zona y vuelve a la lista` | pendiente |
| R15 | `src/api/__tests__/geofences.test.ts::#146 R15: listGeofences rechaza una zona sin centro numérico` | pendiente |
| R16 | `src/screens/geofence-editor/index.test.tsx::#146 R16: quien no es dueño ve la zona sin poder editarla` | pendiente |
| R17 | `src/__tests__/design-drift.test.ts::#146 R17: el centro por defecto del mapa vive en un solo sitio` | pendiente |
| R18 | `src/__tests__/consistency-classnames.test.ts::#62 R15: todo contador usa cifras tabulares` (fila del editor y `#69 R10`) | pendiente |
| Enmienda A19 | `src/__tests__/hero-header-amendments.test.ts` sigue verde; `grep -c 'enmienda A19 de #146'` da 1 en cada doc | pendiente |

Las aserciones heredadas que cambian ([[design]] D8) viajan en el commit
rojo de su requisito y no tienen fila propia.

**Regla:** el `reviewer` no aprueba con ninguna fila en *pendiente*. Los
commits siguen la convención `test(<scope>): <desc> (Rn)` /
`feat(<scope>): <desc> (R1,R2)` y cada hash debe ser ancestro del HEAD que
se revisa (C5 de `CHECKPOINTS.md`); si la branch se rebasa después de
rellenar la tabla, los hashes se reapuntan y se comprueban con
`git merge-base --is-ancestor <hash> HEAD`.
