---
feature: "mobile-profile-family-join-row"
status: approved      # draft | spec_ready | approved
tags: [mobile, profile, ui, spec]
---

# Trazabilidad — [[mobile-profile-family-join-row]] (#229)

Todos los tests están en `mobile-pet-tracker/src/screens/profile/index.test.tsx`.
Los hashes se desarrollan con su mensaje íntegro debajo de la tabla.

| Requisito | Test (archivo::nombre) | Commits |
|---|---|---|
| R1 | `index.test.tsx::#229 R1: members-link lleva flex-1`; `index.test.tsx::#229 R1: join-pet-link lleva flex-1` | Test rojo `832cead7`; producción verde `c1a2375c`; espera de la fila con mascota `192a2ecc` (nace verde) |
| R2 | `index.test.tsx::#229 R2: con mascota ambas tarjetas van lado a lado en la fila 2` | Test rojo `915f5ded`; producción verde `053681d4` |
| R3 | `index.test.tsx::#229 R3: members-link conserva icono, texto y chevron`; `index.test.tsx::#229 R3: join-pet-link conserva icono, texto y chevron` | `832cead7`: nacen verdes, fijan el contenido que se conserva; recuento estricto `192a2ecc` (nace verde); sin implementación propia |
| R4 | `index.test.tsx::#229 R4: sin mascota Unirme con código lleva flex-1 en la fila 1` | Test rojo `832cead7`; producción verde `c1a2375c` |
| R5 | `index.test.tsx::#229 R5: las tres filas son flex-row gap-2 y las tarjetas no fijan alto` | Test rojo `832cead7`; producción verde `c1a2375c` |
| R6 | `index.test.tsx::con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6) (enmendado por #229 R2)`; `index.test.tsx::R4: con mascota añade la fila de Familia a ancho completo y navega a members (enmendado por #229 R1, R2)`; `index.test.tsx::R6: con mascota la cuarta fila es Unirme con código y navega a join-pet (enmendado por #229 R1, R2)`; anclas, alcance y guards del handoff | Clases: `832cead7` → `c1a2375c`; estructura: `915f5ded` → `053681d4` |

## Commits test-primero

1. `832cead7` — `test(mobile): #229 pin flex-1 on wide tiles, no-pet row and equal-height recipe (R1, R3, R4, R5)`.
2. `c1a2375c` — `feat(mobile): #229 give wide profile tiles flex-1 so they share the row (R1, R4)`.
3. `915f5ded` — `test(mobile): #229 pair Familia and Unirme con código in one row (R2)`.
4. `053681d4` — `feat(mobile): #229 move join-pet-link into the family row and drop row 3 (R2)`.
5. `192a2ecc` — `test(mobile): #229 harden R3 count and wait for row 2 in R1 (R1, R3)`.

El humano/leader autorizó expresamente este único commit adicional antes del de trazabilidad (seis commits en total). Nace verde: los cuatro casos R1/R3 ya pasan sobre la producción correcta. Refuerza dos límites revelados por las mutaciones: `toEqual` ignora un cuarto valor `undefined` al mapear un `<View />` sin testID; Unirme con código también existe en la rama inicial sin mascota, así que R1 espera a la fila 2 antes de leerlo.

## Evidencia

- T0: 43 suites y 1256 tests verdes, antes de editar. Se reutiliza al reanudar por instrucción expresa del humano.
- Primer rojo: 6 fallos de aserción, 219 tests verdes; R3 nace verde porque el contenido ya existía.
- Tras el primer cambio de producción: 43 suites y 1262 tests verdes.
- Segundo rojo: 4 fallos de aserción, 222 tests verdes.
- Tras el segundo cambio de producción: 43 suites y 1263 tests verdes, exactamente los 7 casos nuevos previstos.
- Diff de producción desde H0 `910983c5` y desde el handoff corregido `af7cf00b`: `+1 −3`.
- Las 23 mutaciones distintas quedan detectadas y revertidas. Tras `192a2ecc`, R3(c) falla en sus dos casos por longitud 4 en vez de 3; R4(b) falla solo en el caso sin mascota y deja verdes los dos controles R1.
- Verificación del commit adicional: los siete casos nuevos y las 42 suites de guards pasan en la ejecución completa; los timeouts de tests antiguos de Perfil se resuelven por repetición aislada (221 casos verdes y los cinco restantes verdes al repetirlos solos). La cobertura combinada de la misma versión comprende 43 suites y 1263 casos verdes.
- Las nueve anclas finales coinciden con la columna «Tras #229» y hay exactamente tres sufijos enmendados.
- El reporte `progress/impl_mobile-profile-family-join-row.md` conserva anclas, resultados de las mutaciones plantadas, tipos, lint y alcance final.

La receta de R5 se verifica en Jest; el alto real y la legibilidad del texto estrecho los confirma G2, reservado al humano. Esta trazabilidad no firma el smoke ni cambia el estado de la feature.
