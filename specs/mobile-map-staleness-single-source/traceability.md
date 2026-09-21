---
feature: "mobile-map-staleness-single-source"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-map-staleness-single-source]]

Rutas relativas a `mobile-pet-tracker/`. Los títulos van prefijados `#94` porque
los tres ficheros de test ya acumulan R-ids de otras specs
(`docs/conventions.md` §Prefijo de feature).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/utils/device-connectivity.test.ts::#94 R1: el tile de conexión del Mapa se decide en un solo sitio` | pendiente |
| R2 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R2: el tile de conexión sigue al collar` + `::#94 R2: la antigüedad de la posición ya no mueve el tile de conexión` + `::#94 R2: sin collar el tile de conexión dice Sin señal` | pendiente |
| R3 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R3: sin detalle el tile de conexión cae al guion` | pendiente |
| R4 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R4: la antigüedad y la conexión son datos independientes` | pendiente |
| R5 | `src/__tests__/design-drift.test.ts::#94 R5: el umbral de frescura no vive en el móvil` | pendiente |
| R6 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R6: el tile de conexión se rotula como en Pairing` | pendiente (o "retirada por D2 rechazada") |
| R7 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R7: el poll refresca también el detalle` | pendiente |
| R8 | gate humano — smoke en dev build de Android, sin test automático | pendiente (firma en [[requirements]] §Aprobación) |

## Notas de cierre que el reviewer comprueba

- **R5 es requisito de verificación** ([[requirements]] §Requisito de
  verificación, vía **b**): su fila no se cierra sin la evidencia de las **dos**
  mutaciones de producción —`map.tsx` y `utils/device-connectivity.ts`— con sus
  salidas rojas por la aserción de `#94 R5` y el `git diff` vacío tras revertir,
  escritas en `progress/impl_mobile-map-staleness-single-source.md`.
- **R8 no lo cierra ninguna IA.** Mientras la casilla de §Aprobación no esté
  firmada por el humano, la feature no pasa a `done` aunque la suite esté verde
  (`CLAUDE.md` §Reglas duras).
- **Deltas declarados** de `map.test.tsx` contra `914905b8`: están en [[design]]
  §Delta de `map.test.tsx`, con ruta:línea y valor nuevo. Cualquier edición de
  ese fichero que no esté en esa tabla es drift y se rechaza.
- **Si se rebasa la rama** después de rellenar esta tabla, los hashes dejan de
  ser ancestros y hay que reapuntarlos y verificar `git merge-base --is-ancestor`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-map-staleness): <desc> (R1,R2)`.
El implementador actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
