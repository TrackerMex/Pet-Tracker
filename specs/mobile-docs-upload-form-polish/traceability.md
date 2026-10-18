---
feature: "mobile-docs-upload-form-polish"
status: draft
tags: [mobile, ui, spec]
---

# #185 mobile-docs-upload-form-polish — Trazabilidad

`Test-F` es `src/screens/docs-upload-form/index.test.tsx` (P1=A, aprobada por humano en `f7a61348`). R3/R4 y la rama B no aplican.

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | El formulario no es hijo de la lista | `src/screens/docs/index.test.tsx` › `#185 R1: el formulario no es hijo de la lista` | `6bf5a61e` | `c001587b` | Verificado; S1 roja |
| R2 | Pantalla propia (R2.1 a R2.6) | `src/screens/docs/index.test.tsx` › `#185 R2.1`, `#185 R2.3`; Test-F › `#185 R2.2` a `#185 R2.5`; R2.6 cubierto por R9 | `911d5257`, `8f101b52`, `2e3e5bf4` | `c001587b` | Verificado; S7 roja |
| R3 | Rama B: hoja inferior | No aplica: P1=A | n/a | n/a | n/a |
| R4 | Rama C: otra | No aplica: P1=A | n/a | n/a | n/a |
| R5 | Espacio entre campos | Test-F › `#185 R5: espacio entre campos` | `cfa63a9d` | `cfafb4c8` | Verificado; S2a/S2b/S3 rojas |
| R6 | Espacio etiqueta-input | Test-F › `#185 R6: espacio etiqueta-input` (4 filas; HeroUI ya aporta 6 px) | `22b72b13` (mutación de producción) | `9ee85011` | Verificado; S4 roja en Tipo |
| R7 | Botones separados | Test-F › `#185 R7: botones separados` | `e317c25d` | `fb9fa977` | Verificado; S5 roja |
| R8 | Clases de botón, etiqueta e input intactas | Test-F › `#185 R8: clases de botón, etiqueta e input intactas` (6 filas) | `6efe40f8` (S6 versionada) | `28a4aba4` | Verificado; S6 roja en submit |
| R9 | Flujo de subida conservado | Test-F › `#185 R9 (antes #158 R5/R6/R7/R8/R9/R11)` (18 it conservados) | `8f101b52` | `c001587b`; refactor `207da00b` | Verificado; 47 it en lista y 26 en Test-F |
| R10 | Deltas de candados de A | `ui-language.test.ts` › «no deja ningún valor fijo...» / «resuelve cada ocurrencia...» (Δ1/Δ2); `consistency-classnames.test.ts` (Δ3); `detail-stack*.test.tsx` / `layout.test.tsx` (Δ4); `design-drift.test.ts` › `#185 R10: el formulario pertenece a la lista A11` y signOut (Δ5); órdenes de hijos en lista/Test-F (Δ6) | `33250fb7`, `a3fbbf21`, `017dfd6d`; conteo compartido `c55bc36e` | `c001587b`, `8442e279` | Verificado, cuentas globales intactas |
| R11 | Prueba de humo humana (dev build de Android) | §Prueba de humo R11 | n/a | n/a | Requiere ejecución humana; sin marcar como superada |

Verificación automática final: **16 suites / 491 tests**, `bunx tsc --noEmit` y `bunx expo lint --no-cache` con exit 0 y logs vacíos. `.expo/types/router.d.ts` ausente antes de cada tsc. Sondas S1–S7 (S2 en dos variantes): ocho mutaciones detectadas y restauradas; S8 no aplica a A. Evidencia H0, comandos, recuentos y commits auxiliares en `progress/impl_mobile-docs-upload-form-polish.md`.

## Prueba de humo R11

Se hace en el **dev build de Android** (no Expo Go), en claro y en oscuro, con
una mascota propia owner. Con teclado abierto en cada paso de los campos.

| Punto | Resultado |
|---|---|
| Elegir un PDF, luego un JPEG y luego un PNG: el formulario NO aparece bajo la lista de documentos | |
| Rama A: se abre la pantalla del formulario con el nombre del archivo; la cabecera nativa vuelve atrás | |
| Rama B: se abre la hoja inferior; el teclado no tapa ningún campo ni los dos botones; arrastrar hacia abajo la cierra | No aplica: P1=A |
| Los cuatro campos tienen aire entre sí y la etiqueta no toca su input | |
| «Subir documento» y «Cancelar» tienen un hueco visible entre ellos | |
| Con el teclado abierto en el último campo, ambos botones siguen alcanzables | |
| Subir un documento válido: vuelve a la lista, aparece arriba y el filtro está en «Todos» | |
| Cancelar no sube nada y deja el filtro como estaba | |
| Valores 16 / 6 / 12: el humano los confirma o pide otros (P2, P3) | |

- [ ] Prueba de humo R11 superada por humano (fecha: ____)
