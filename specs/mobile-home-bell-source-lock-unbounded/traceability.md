---
feature: "mobile-home-bell-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-home-bell-source-lock-unbounded]] (#121)

> Las dos últimas columnas las rellena **Codex** al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: la receta de la campana se asevera contra su tag de apertura | `src/screens/home/index.test.tsx` :: `#78 R10: la campana vive en el hero y lleva al centro de alertas` › `#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura` | `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` | `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` |
| R2: rojo por `toMatch` ante los siete agujeros (N1, S1p, V7, N1n, W1, S2, S3) | el mismo test de R1, cerrado por **mutación de producción** (C4, vía **b**). N1 va versionada en el rojo; las otras seis son sondas temporales, con su veredicto en `progress/impl_mobile-home-bell-source-lock-unbounded.md` | `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` | `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` |
| R3: mismo veredicto en las diez sondas (E1, V6 y A0 declaradas) | el mismo test de R1. Tabla de las diez sondas en el mismo reporte; son temporales y no se commitean | `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` (mismo candado) | `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` (sondas medidas sobre el verde) |
| R4: el patrón, anclado por contenido | **sin test**: el comentario sobre el `const block` en `src/screens/home/index.test.tsx` y el bloque sustituido en `docs/conventions.md` §Recortes del tag de apertura. Lo verifica el `reviewer` leyendo, más los greps de [[tasks]] §R4 (3) | N/A: entregable documental declarado sin test | `f2c954826cf29e33886f08d277c095dc73911365` |
| R5: cero diff de producción | **sin test**: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` → exit 0, y los blobs de [[tasks]] §R5. Lo verifica el `reviewer` | `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` (N1 versionada) | `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` (N1 revertida) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

Convención de commit: `test(mobile): <desc> (R1,R2)` para el par rojo→verde,
`docs(mobile): <desc> (R4)` para la documentación y
`docs(mobile): <desc> (R3,R5)` para el reporte con los hashes. R1 y R2
comparten par: el commit rojo **versiona la mutación N1 en producción** y el
verde **la revierte** (C4, quinto punto), igual que #109 y #112.

R4 y R5 **no tienen test, y la spec lo declara aquí antes del handoff**: R4 es
un entregable de documentación y R5 es una propiedad del diff. Los cierra el
`reviewer` por inspección.

No rebasees esta rama después de que Codex rellene los hashes, porque
invalidarían la tabla (ver #87).
