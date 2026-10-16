---
feature: "mobile-docs-upload-form-polish"
status: draft
tags: [mobile, ui, spec]
---

# #185 mobile-docs-upload-form-polish — Trazabilidad

`Test-F` es `src/screens/docs-upload-form/index.test.tsx` (rama A) o
`src/screens/docs/index.test.tsx` (rama B). Las filas condicionadas a una
rama se marcan «solo A» o «solo B».

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | El formulario no es hijo de la lista | `src/screens/docs/index.test.tsx` › `#185 R1: el formulario no es hijo de la lista` | pendiente | pendiente | pendiente |
| R2 | Rama A: pantalla propia (R2.1 a R2.6) | solo A: `src/screens/docs/index.test.tsx` › `#185 R2.1`, `#185 R2.3`; Test-F › `#185 R2.2` a `#185 R2.5` | pendiente | pendiente | pendiente |
| R3 | Rama B: hoja inferior (R3.1 a R3.4) | solo B: `src/screens/docs/index.test.tsx` › `#185 R3.1` a `#185 R3.3` | pendiente | pendiente | pendiente |
| R4 | Rama C: otra | solo C: sin redactar | n/a | n/a | n/a |
| R5 | Espacio entre campos | Test-F › `#185 R5: espacio entre campos` | pendiente | pendiente | pendiente |
| R6 | Espacio etiqueta-input | Test-F › `#185 R6: espacio etiqueta-input` | pendiente | pendiente | pendiente |
| R7 | Botones separados | Test-F › `#185 R7: botones separados` | pendiente | pendiente | pendiente |
| R8 | Clases de botón, etiqueta e input intactas | Test-F › `#185 R8: clases de botón, etiqueta e input intactas` | pendiente | pendiente | pendiente |
| R9 | Flujo de subida conservado | Test-F › `#185 R9 (antes #158 R5): ...` a `(antes #158 R11)` | pendiente | pendiente | pendiente |
| R10 | Deltas de candados Δ1 a Δ6 | `ui-language.test.ts` › «no deja ningún valor fijo...» (Δ1); `ui-language.test.ts` › «resuelve cada ocurrencia...» (Δ2); `consistency-classnames.test.ts` (Δ3); `detail-stack.test.tsx` y `layout.test.tsx` (Δ4, solo A); `design-drift.test.ts` (Δ5, solo A) | pendiente | pendiente | pendiente |
| R11 | Prueba de humo humana (dev build de Android) | §Prueba de humo R11 | n/a | n/a | pendiente |

## Prueba de humo R11

Se hace en el **dev build de Android** (no Expo Go), en claro y en oscuro, con
una mascota propia owner. Con teclado abierto en cada paso de los campos.

| Punto | Resultado |
|---|---|
| Elegir un PDF, luego un JPEG y luego un PNG: el formulario NO aparece bajo la lista de documentos | |
| Rama A: se abre la pantalla del formulario con el nombre del archivo; la cabecera nativa vuelve atrás | |
| Rama B: se abre la hoja inferior; el teclado no tapa ningún campo ni los dos botones; arrastrar hacia abajo la cierra | |
| Los cuatro campos tienen aire entre sí y la etiqueta no toca su input | |
| «Subir documento» y «Cancelar» tienen un hueco visible entre ellos | |
| Con el teclado abierto en el último campo, ambos botones siguen alcanzables | |
| Subir un documento válido: vuelve a la lista, aparece arriba y el filtro está en «Todos» | |
| Cancelar no sube nada y deja el filtro como estaba | |
| Valores 16 / 6 / 12: el humano los confirma o pide otros (P2, P3) | |

- [ ] Prueba de humo R11 superada por humano (fecha: ____)
