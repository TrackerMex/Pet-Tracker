---
feature: "mobile-quick-actions-typography-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Trazabilidad — [[mobile-quick-actions-typography-lock]] (#81)

Todos los tests viven en `mobile-pet-tracker/src/screens/home/index.test.tsx`,
dentro de
`describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado'`
(«el `describe` de #81»).

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `index.test.tsx::#81 R1-R6: … › #81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea` | pendiente | pendiente |
| R2 | `index.test.tsx::#81 R1-R6: … › #81 R2: cada tile tiene dos hijos, el icono arriba y la etiqueta debajo` | pendiente | pendiente |
| R3 | `index.test.tsx::#81 R1-R6: … › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` | pendiente | pendiente |
| R4 | `index.test.tsx::#81 R1-R6: … › #81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio` | pendiente | pendiente |
| R5 | `index.test.tsx::#81 R1-R6: … › #81 R5: cada tile se anuncia con su propia etiqueta visible` | pendiente | pendiente |
| R6 | `index.test.tsx::#81 R1-R6: … › #81 R6: dibuja los tres tiles aunque el detalle de la mascota falle` y `… › #81 R6: dibuja los tres tiles aunque la actividad semanal falle` | pendiente | pendiente |
| R7 | sin test: cierre medido ([[tasks]] §R7 y `progress/impl_mobile-quick-actions-typography-lock.md`) | no aplica | pendiente (el verde de R6) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

- Rojo: `test(mobile): <desc> with a versioned mutation (R<n>)`. Lleva el `it`
  nuevo **y** la mutación de `index.tsx`.
- Verde: `test(mobile): <desc> (R<n>)`. Solo revierte `index.tsx` con
  `git checkout HEAD~1 --`.
- Evidencia: `docs(mobile): record the quick actions lock evidence (R7)`.

Los mensajes exactos están en [[tasks]].

## Requisitos sin test propio

- **R7** se verifica con las medidas de [[tasks]] §R7: suite, `tsc`, `eslint`,
  cifras de candado, diff de producción vacío, blobs finales y la tabla de
  sondas re-medida. Su fila cita el hash del **verde de R6**, no el de `HEAD`.
  El commit de evidencia solo toca `progress/` y esta tabla, y citarlo haría
  que la fila apuntara a un commit sin código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla, porque los hashes dejarían de valer. Si hace falta, reapunta cada
hash y comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
