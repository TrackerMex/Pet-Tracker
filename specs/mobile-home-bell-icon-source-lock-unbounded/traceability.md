---
feature: "mobile-home-bell-icon-source-lock-unbounded"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-home-bell-icon-source-lock-unbounded]] (#124)

> Las dos últimas columnas las rellena **Codex** al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: el icono dentro de la campana se pinta con `'--color-muted'`, en los dos estados | `src/screens/home/index.test.tsx` :: `#78 R10: la campana vive en el hero y lleva al centro de alertas` › `#124 R1: el icono de la campana se pinta con la tinta muted` › `sin alertas abiertas`; y el mismo `describe` › `con alertas abiertas`. Cerrado por **mutación de producción** (C4, vía **b**): B2, versionada en el rojo | pendiente | pendiente |
| R2: veredictos de las sondas, con los cambios declarados | los dos tests de R1, más `#78 R10: …` › `#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura, con ancla única (#122 R1)` sin cambios. Tabla de sondas en `progress/impl_mobile-home-bell-icon-source-lock-unbounded.md`; son temporales y no se commitean | pendiente | pendiente |
| R3: comentario del candado y párrafo de `docs/conventions.md`, anclados por contenido | **sin test**: el comentario de [[tasks]] §R3 (1) en `src/screens/home/index.test.tsx` y el párrafo insertado en `docs/conventions.md` §Recortes del tag de apertura en candados de fuente. Lo verifica el `reviewer` leyendo, más los greps y blobs de [[tasks]] §R3 (3) | N/A: entregable documental declarado sin test | pendiente |
| R4: cero diff de producción | **sin test**: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` → exit 0, y los blobs de [[tasks]] §R4. Lo verifica el `reviewer` | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

Convención de commit: `test(mobile): <desc> (R1)` para el par rojo→verde,
`docs(mobile): <desc> (R3)` para la documentación y
`docs(mobile): <desc> (R2,R4)` para el reporte con los hashes. El par versiona
su mutación de producción en el rojo y la revierte en el verde (C4, quinto
punto), igual que #109, #112, #121 y #122. Aquí el rojo toca **un** fichero de
producción, `src/screens/home/index.tsx`.

R3 y R4 **no tienen test, y la spec lo declara aquí antes del handoff**: R3 es
un entregable de documentación y R4 es una propiedad del diff. Los cierra el
`reviewer` por inspección. R2 no tiene test propio: sus veredictos los dan los
tests de R1 y el `it` `#121 R1` ante cada sonda.

No rebasees esta rama después de que Codex rellene los hashes, porque
invalidarían la tabla (ver #87).
