---
feature: "mobile-geofences"
status: draft    # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-geofences]] (#41)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx`::`#41 R1: el catálogo trae las once claves de zonas seguras`; candado heredado `#65 R12` (D8 fila 1) | pendiente |
| R2 | `src/api/__tests__/geofences.test.ts`::`#41 R2: listGeofences mapea la lista por kind`; `src/api/__tests__/query-keys.test.ts`::`#41 R2: la lista de zonas seguras tiene su propia clave por mascota` | pendiente |
| R3 | `src/api/__tests__/geofences.test.ts`::`#41 R3: setGeofenceActive y deleteGeofence mapean la escritura por kind` | pendiente |
| R4 | `src/app/__tests__/detail-stack.test.tsx`::`#41 R4: las zonas seguras viven en src/app/pets/[petId]/geofences.tsx`; `src/app/__tests__/layout.test.tsx`::`#41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta`; candados heredados `#114 R1` y `#100 R2` (D8 filas 2–3) | pendiente |
| R5 | `src/screens/geofences/index.test.tsx`::`#41 R5: la pantalla pinta la lista de zonas y sus estados` | pendiente |
| R6 | `src/screens/geofences/index.test.tsx`::`#41 R6: el dueño activa y desactiva una zona`; `src/__tests__/design-drift.test.ts`::`#87 R19: use-api no deja huella` › `preserves every mutation sign-out with zero delta` (mapa `screenSignOutCalls`, D8 fila 4) | pendiente |
| R7 | `src/screens/geofences/index.test.tsx`::`#41 R7: el dueño borra una zona tras confirmar` | pendiente |
| R8 | `src/screens/geofences/index.test.tsx`::`#41 R8: quien no es dueño ve las zonas sin controles` | pendiente |
| R9 | `src/screens/profile/index.test.tsx`::`#41 R9: Perfil enlaza a las zonas seguras de la mascota activa`; candados heredados `#62 R7`, `#62 R14`, `#98 R10`, `R7_PROFILE` y `#65 R7` (D8 filas 5–10) | pendiente |
| R10 | `src/__tests__/ui-language.test.ts`::`#41 R10: las zonas seguras resuelven su copy por clave`; `ui-copy-table.ts`::`ALL_USES` con `R14_GEOFENCES` y candado heredado `#65 R18` (`SCREEN_FILES`) (D8 filas 11–12) | pendiente |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A18 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A18 de #41'` → `1` en cada doc | pendiente |

Regla: el reviewer comprueba que cada fila cita sus commits.
Convención de commit: `feat(<scope>): <desc> (R1)`; el rojo previo va como
`test(<scope>): <desc> (R1)`, con los mensajes literales de [[tasks]]. En R10
(ruta (b) de C4) el mensaje del rojo nombra la mutación plantada y el verde la
revierte.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#41 R<n>` y, donde cambian, las aserciones heredadas
de [[design]] D8.
Los hashes se escriben sobre la historia final de la branch: no se rebasea
después de rellenarlos.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
