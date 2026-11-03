---
feature: "mobile-vaccine-catalog-error-state"
status: approved       # draft | approved
tags: [harness, spec, mobile, health, vaccines]
---

# Trazabilidad — [[mobile-vaccine-catalog-error-state]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R1: con el catálogo en %s pinta el aviso y «Reintentar» entre la leyenda y los chips` (error, unreachable, unauthorized, missing-config); `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R1: si la consulta del catálogo rechaza pinta el mismo aviso` | Rojo: `1aba44d2` — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R2 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`; se conserva `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado` | Rojo: `1aba44d2` — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R3 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R3: un catálogo ok %s no pinta el aviso de error` (vacío, con entradas); rojo por M1 y M2 documentado en `progress/impl_mobile-vaccine-catalog-error-state.md` | Test que nace verde: `354f46c7` — `test(mobile): sin aviso con catálogo ok ni durante la carga (R3,R4)`; condición: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R4 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R4: mientras carga no pinta el aviso de error`; rojo por M1 y M3 documentado en `progress/impl_mobile-vaccine-catalog-error-state.md` | Test que nace verde: `354f46c7` — `test(mobile): sin aviso con catálogo ok ni durante la carga (R3,R4)`; condición: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R5 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso` | Rojo: `1aba44d2` — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R6 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos`; `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R6: si el reintento vuelve a fallar el aviso sigue y se puede reintentar otra vez`; M4 pone rojo el primero | Rojo: `1aba44d2` — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R7 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código (enmendado por #236 R7)`; `mobile-pet-tracker/src/__tests__/ui-language.test.ts::resuelve cada ocurrencia de la tabla contra la clave exacta` | Rojo: `89598787` — `test(mobile): usos de copy del aviso del catálogo en rojo (R7)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R8 | `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx::#236 R8: el aviso y el reintento usan la receta de Salud sin clases ni labio`; guardas de la carta sin cambios, verdes tras C3 | Rojo: `1aba44d2` — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`; verde: `ab2262e4` — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)` |
| R9 | `progress/smoke_mejoras-smoke.md::grep -cF '## #236 mobile-vaccine-catalog-error-state'`; `progress/smoke_mejoras-smoke.md::grep -cF -- '- [ ] Smoke de #236 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)'`: ambos pasan de 0 a 1 | C5 (este commit, hash recuperable por título único como se indica abajo) — `docs(progress): paso de smoke y trazabilidad de #236 (R9)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
R9 se cierra con el paso de smoke en disco. Su casilla la marca solo el humano
(G2), y no bloquea esta tabla.

El gate de mutación de C4 se enmendó en `a0b14bc1` —
`docs(progress): #236 handoff, C4 mutation gate amended`: deben caer todos los
tests de la fila y se documentan los adicionales. M1–M4 cumplen; ninguna
mutación se commitea. No se rebasea después de rellenar esta tabla.

C5 contiene esta misma tabla y el reporte; su hash no se escribe dentro de sí
mismo. El comando por título único, que devuelve el hash, es:

```bash
git log -1 --format=%H --fixed-strings --grep='docs(progress): paso de smoke y trazabilidad de #236 (R9)'
```
