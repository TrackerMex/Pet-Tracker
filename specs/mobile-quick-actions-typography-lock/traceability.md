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
| R1 | `index.test.tsx::#81 R1-R6: … › #81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea` | `a7a2df3130d74727712f1c1b0c7cf596b3d79a7d` | `d7dfadb4e2f9fdf1798fd35d20af4c79bcebae8d` |
| R2 | `index.test.tsx::#81 R1-R6: … › #81 R2: cada tile tiene dos hijos, el icono arriba y la etiqueta debajo` | `c6530ce9eb888a2f9006cd2836f46ef6405ac7c0` | `18cc4774f9745808ed392bd46ad1ba46731159a1` |
| R3 | `index.test.tsx::#81 R1-R6: … › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua` | `8ee5f1a8c2a0d39f6daf9f7be12d00e9a6ebf90a` | `8e80f15e28f0edc858658bf074cc35ecaed23853` |
| R4 | `index.test.tsx::#81 R1-R6: … › #81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio` | `7e2d324c83eac1c05057d9cfd572fcc558df75b6` | `5a45d8da8e3635e2bb6541386632d8f12585c366` |
| R5 | `index.test.tsx::#81 R1-R6: … › #81 R5: cada tile se anuncia con su propia etiqueta visible` | `04e926a95cab5b66b17da6be34d5e493e762d97f` | `3281cd58efbf147fea9073d08eebf05a790c016a` |
| R6 | `index.test.tsx::#81 R1-R6: … › #81 R6: dibuja los tres tiles aunque el detalle de la mascota falle` y `… › #81 R6: dibuja los tres tiles aunque la actividad semanal falle` | `9b495d140cabbd662edf744e3505193c8fc9ddeb` | `d14c10c05027fbe1f8ab7fae87bef1f17900dd57` |
| R7 | sin test: cierre medido ([[tasks]] §R7 y `progress/impl_mobile-quick-actions-typography-lock.md`) | no aplica | `d14c10c05027fbe1f8ab7fae87bef1f17900dd57` (verde de R6) |

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
