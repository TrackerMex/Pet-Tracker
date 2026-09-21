---
feature: "mobile-map-staleness-single-source"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-map-staleness-single-source]]

Rutas relativas a `mobile-pet-tracker/`. Los títulos van prefijados `#94` porque
los tres ficheros de test ya acumulan R-ids de otras specs
(`docs/conventions.md` §Prefijo de feature).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/utils/device-connectivity.test.ts::#94 R1: el tile de conexión del Mapa se decide en un solo sitio` | rojo `d4f2b77f` (`feat(mobile-map-staleness): specify shared map labels (R1)`); verde `039ed167` (`feat(mobile-map-staleness): provide shared map labels (R1)`) |
| R2 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R2: el tile de conexión sigue al collar` + `::#94 R2: la antigüedad de la posición ya no mueve el tile de conexión` + `::#94 R2: sin collar el tile de conexión dice Sin señal` | rojo `2dcebb2a` (`feat(mobile-map-staleness): specify detail-backed map badge (R2)`); verde `a83aae5c` (`feat(mobile-map-staleness): read map badge from pet detail (R2,R9)`) |
| R3 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R3: sin detalle el tile de conexión cae al guion` | rojo `7f4709bc` (`feat(mobile-map-staleness): specify unresolved detail fallback (R3)`); verde `2ea2ff9c` (`feat(mobile-map-staleness): show dash without pet detail (R3)`) |
| R4 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R4: la antigüedad y la conexión son datos independientes` | rojo `feeabb27` (`feat(mobile-map-staleness): lock position age source (R4)`); verde `83e6d554` (`feat(mobile-map-staleness): preserve position age display (R4)`) |
| R5 | `src/__tests__/design-drift.test.ts::#94 R5: el umbral de frescura no vive en el móvil` | rojos `cb6084e7` (`feat(mobile-map-staleness): guard mobile freshness threshold (R5)`) + `d6f28bec` (`feat(mobile-map-staleness): probe shared utility threshold (R5)`); verde `bcdd65fa` (`feat(mobile-map-staleness): remove mobile freshness thresholds (R5)`) |
| R6 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R6: el tile de conexión se rotula como en Pairing` | rojo `8986802d` (`feat(mobile-map-staleness): specify connection tile label (R6)`); verde `8ca103e4` (`feat(mobile-map-staleness): label connection tile consistently (R6,R9)`) |
| R7 | `src/app/(tabs)/__tests__/map.test.tsx::#94 R7: el poll refresca también el detalle` | rojo `d0ea8cb0` (`feat(mobile-map-staleness): specify detail polling (R7)`); verde `9bc67e53` (`feat(mobile-map-staleness): refresh pet detail with map poll (R7)`) |
| R8 | gate humano — smoke en dev build de Android, sin test automático | pendiente (firma en [[requirements]] §Aprobación) |
| R9 *(E1)* | `src/__tests__/ui-language.test.ts::#65 R4: Map resuelve su copy por clave` + `::#65 R10: el emparejado del collar resuelve su copy por clave` + `::#65 R18: los sitios resuelven por clave y no queda copy suelta` — tests **ya existentes de #65**, no se crean nuevos | R2 `a83aae5c` (`feat(mobile-map-staleness): read map badge from pet detail (R2,R9)`); R6 `8ca103e4` (`feat(mobile-map-staleness): label connection tile consistently (R6,R9)`) |
| R10 *(E2)* | `src/__tests__/design-drift.test.ts::#94 R10: la antigüedad de la posición se lee en un solo sitio` | pendiente |

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

## Adenda de la enmienda E1

- **R9 no se cierra con un test nuevo.** Sus tres tests son de #65 y ya existen;
  lo que E1 declara es el **delta de datos** de `src/__tests__/ui-copy-table.ts`
  que los mantiene verdes. La fila se cierra con el commit que aplica ese delta.
- **R9 no tiene commit propio.** Los deltas viajan dentro de los commits verdes
  de **R2** (las 3 filas que se mudan a `src/utils/device-connectivity.ts` y los
  dos `toHaveLength`) y de **R6** (la sustitución 1:1 de `map.gps` por
  `pairing.connection`). Registra en esta fila **los dos hashes**, no uno.
- **Recuentos finales que el reviewer verifica**: `R4_MAP` = **17** filas,
  `R10_PAIRING` = **49** (`42 + 2 + 1 + 4`), `SCREEN_FILES` = **22** (`19 + 2 + 1`,
  **sin tocar**), `ALL_USES` = suma de los doce bloques (se recalcula solo).
- **Evidencia que R9 exige** en `progress/impl_mobile-map-staleness-single-source.md`:
  la salida roja de `ui-language.test.ts` **previa** al delta, con los cuatro
  pares (fichero, clave) en `uses: 0`. Sin ella no consta que el candado de #65
  estuviera vivo.
- **La enmienda E1 tiene su propio gate.** Mientras
  `- [ ] Enmienda E1 aprobada por humano` de [[requirements]] §Enmienda E1 siga
  sin marcar, R9 y las precisiones a R1, R2 y R6 **no están aprobadas** y la
  feature no cierra, aunque las 5 suites estén verdes (C6: ningún requisito
  modificado después de la aprobación sin volver a pasar por el gate).

## Adenda de la enmienda E2

- **R10 no sustituye a R5: convive con él.** R5 conserva su letra firmada y sus
  dos aserciones (`design-drift.test.ts:488-500`), y su fila de esta tabla
  conserva sus commits. R10 añade **un** `it` aparte, con otra propiedad: R5
  dice "no compares", R10 dice "no leas la antigüedad fuera del sitio
  declarado".
- **Evidencia que R10 exige** en `progress/impl_mobile-map-staleness-single-source.md`,
  las **dos** salidas rojas por mutación de producción (vía (b) de C4) y el
  `git diff` vacío tras revertir:
  1. el **alias de H2** en `map.tsx:207` → rojo por **recuento**
     (`'app/(tabs)/map.tsx'` en 2 frente a 1);
  2. la **mudanza a un fichero no declarado** → rojo por **clave inesperada**.

  En la primera hay que dejar anotado que `#94 R5` sigue **verde** con esa misma
  mutación: esa diferencia es el hallazgo H2 y es la razón de ser de R10.
- **Tres cosas que el reviewer verifica que NO se tocaron**:
  `design-drift.test.ts:25-37` (`sourceFiles`, el helper compartido cuyo cambio
  provocó el rechazo de la ronda 1), `:39-49` (`allTypeScriptFiles`, que R10
  **reutiliza**) y `src/api/types.ts` (se nombra en la tabla de R10, no se
  edita: es de #98).
- **Recuentos finales**: `design-drift.test.ts` **40** tests, gate dirigido de 5
  suites **137**, medidos sin pipe. El 136/39 es la medida de la punta de la
  ronda 1 (`5a5f7fd3`); el 120 de E1 era de `914905b8` y ya no es comparable.
- **La enmienda E2 tiene su propio gate.** Mientras
  `- [ ] Enmienda E2 aprobada por humano` de [[requirements]] §Enmienda E2 siga
  sin marcar, R10 no está aprobado y la feature no cierra, aunque las 5 suites
  estén verdes (C6).
- **E2 no arregla H1.** El bloqueante va en su propio commit de la ronda 2 y se
  registra donde corresponda; R10 es ortogonal y da el mismo inventario con
  cualquiera de las dos formas del helper.
