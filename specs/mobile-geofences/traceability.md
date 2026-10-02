---
feature: "mobile-geofences"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-geofences]] (#41)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx`::`#41 R1: el catálogo trae las once claves de zonas seguras`; candado heredado `#65 R12` (D8 fila 1) | `f1e3cc4a` — `test(geofences): eleven copy keys for safe zones (R1)`; `76cf79b2` — `feat(geofences): add the safe zones copy keys (R1)` |
| R2 | `src/api/__tests__/geofences.test.ts`::`#41 R2: listGeofences mapea la lista por kind`; `src/api/__tests__/query-keys.test.ts`::`#41 R2: la lista de zonas seguras tiene su propia clave por mascota` | `c803e7fb` — `test(geofences): list a pet's geofences by kind (R2)`; `3ec49124` — `feat(geofences): add the geofences list client and query key (R2)` |
| R3 | `src/api/__tests__/geofences.test.ts`::`#41 R3: setGeofenceActive y deleteGeofence mapean la escritura por kind` | `0f71941a` — `test(geofences): toggle and delete a geofence by kind (R3)`; `251159ea` — `feat(geofences): add the geofence toggle and delete clients (R3)` |
| R4 | `src/app/__tests__/detail-stack.test.tsx`::`#41 R4: las zonas seguras viven en src/app/pets/[petId]/geofences.tsx`; `src/app/__tests__/layout.test.tsx`::`#41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta`; candados heredados `#114 R1` y `#100 R2` (D8 filas 2–3) | `c0fe936e` — `test(geofences): the safe zones route lives on the root stack (R4)`; `02c2158e` — `feat(geofences): declare pets/[petId]/geofences on the root stack (R4)` |
| R5 | `src/screens/geofences/index.test.tsx`::`#41 R5: la pantalla pinta la lista de zonas y sus estados` | `b6c046d5` — `test(geofences): the screen renders the zones and their states (R5)`; `eb910bcd` — `feat(geofences): render the safe zones list (R5)`; E3: `8d37dae0` — `test(geofences): the no-tracking text takes the muted recipe (R5, E3)`; `113135d6` — `feat(geofences): give the no-tracking text the muted recipe (R5, E3)` |
| R6 | `src/screens/geofences/index.test.tsx`::`#41 R6: el dueño activa y desactiva una zona`; `src/__tests__/design-drift.test.ts`::`#87 R19: use-api no deja huella` › `preserves every mutation sign-out with zero delta` (mapa `screenSignOutCalls`, D8 fila 4) | `74ba7ceb` — `test(geofences): the owner toggles a zone (R6)`; `4562f99d` — `feat(geofences): let the owner toggle a zone (R6)` |
| R7 | `src/screens/geofences/index.test.tsx`::`#41 R7: el dueño borra una zona tras confirmar` | `1c8b35ae` — `test(geofences): the owner deletes a zone after confirming (R7)`; `e93b3e18` — `feat(geofences): let the owner delete a zone (R7)` |
| R8 | `src/screens/geofences/index.test.tsx`::`#41 R8: quien no es dueño ve las zonas sin controles` | `b6213b03` — `test(geofences): non-owners see the zones read-only (R8)`; `c5495082` — `feat(geofences): show read-only status pills to non-owners (R8)` |
| R9 | `src/screens/profile/index.test.tsx`::`#41 R9: Perfil enlaza a las zonas seguras de la mascota activa`; candados heredados `#62 R7`, `#62 R14`, `#98 R10`, `R7_PROFILE` y `#65 R7` (D8 filas 5–10) | `1c272b06` — `test(profile): profile links to the safe zones (R9)`; `e7e50117` — `test(profile): drop the chevron query RNTL 14 lacks (R9, E2)`; `0ca55015` — `feat(profile): link the active pet's safe zones (R9)` |
| R10 | `src/__tests__/ui-language.test.ts`::`#41 R10: las zonas seguras resuelven su copy por clave`; `ui-copy-table.ts`::`ALL_USES` con `R14_GEOFENCES` y candado heredado `#65 R18` (`SCREEN_FILES`) (D8 filas 11–12) | `4b10b82e` — `test(geofences): the screen resolves its copy by key (R10, plants mutation: retry key through a constant)`; `76913ff0` — `feat(geofences): resolve the retry label by literal key (R10)` |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A18 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A18 de #41'` → `1` en cada doc | `f044fa79` — firma de A18 (2026-10-02); `02646e90` — `docs(specs): apply amendment A18 of #41` |

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
