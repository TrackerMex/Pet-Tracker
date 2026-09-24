---
feature: "mobile-source-lock-slice-blind-spots"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-source-lock-slice-blind-spots]] (#122)

> Las dos últimas columnas las rellena **Codex** al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: los tres candados de fuente aseveran que su ancla es única | `src/app/(tabs)/__tests__/food.test.tsx` :: `#107 R5: el botón por franja conserva su feedback de pulsado` › `#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle, con ancla única (#122 R1)`; `src/screens/home/index.test.tsx` :: `#78 R10: la campana vive en el hero y lleva al centro de alertas` › `#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura, con ancla única (#122 R1)`; `src/screens/home/index.test.tsx` :: `#70 R1: la Home dibuja la sección de recordatorios` › `#70 R10: enlace a la lista de recordatorios` › `#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura, con ancla única (#122 R1)`. Cerrado por **mutación de producción** (C4, vía **b**): P4 en los tres call-sites, versionada en el rojo | pendiente | pendiente |
| R2: los tres elementos se pulsan y bajan a opacidad 0.8 | `src/app/(tabs)/__tests__/food.test.tsx` :: `#107 R5: …` › `#122 R2: el botón baja a opacidad 0.8 mientras se pulsa`; `src/screens/home/index.test.tsx` :: `#78 R10: …` › `#122 R2: la campana baja a opacidad 0.8 mientras se pulsa`; `src/screens/home/index.test.tsx` :: `#70 R1: …` › `#70 R10: …` › `#122 R2: el enlace baja a opacidad 0.8 mientras se pulsa`. Cerrado por **mutación de producción** (C4, vía **b**): P1 en los tres call-sites, versionada en el rojo | pendiente | pendiente |
| R3: veredictos de las sondas, con los cambios declarados | los seis tests de R1 y R2. Tabla de sondas en `progress/impl_mobile-source-lock-slice-blind-spots.md`; son temporales y no se commitean | pendiente (los dos rojos de R1 y R2) | pendiente (sondas medidas sobre el verde de R2) |
| R4: límites y defensas, anclados por contenido | **sin test**: los comentarios de [[tasks]] §R4 en los dos ficheros de test y el bloque sustituido en `docs/conventions.md` §Recortes del tag de apertura. Lo verifica el `reviewer` leyendo, más los greps y blobs de [[tasks]] §R4 (3) | N/A: entregable documental declarado sin test | pendiente |
| R5: cero diff de producción | **sin test**: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` → exit 0, y los blobs de [[tasks]] §R5. Lo verifica el `reviewer` | pendiente (P4 y P1 versionadas) | pendiente (P4 y P1 revertidas) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

Convención de commit: `test(mobile): <desc> (R1)` y `test(mobile): <desc> (R2)`
para los dos pares rojo→verde, `docs(mobile): <desc> (R4)` para la
documentación y `docs(mobile): <desc> (R3,R5)` para el reporte con los hashes.
Cada par versiona su mutación de producción en el rojo y la revierte en el verde
(C4, quinto punto), igual que #109, #112 y #121. Aquí cada rojo toca **dos**
ficheros de producción, `src/screens/home/index.tsx` y `src/app/(tabs)/food.tsx`,
porque los tres call-sites viven en dos pantallas.

R4 y R5 **no tienen test, y la spec lo declara aquí antes del handoff**: R4 es
un entregable de documentación y R5 es una propiedad del diff. Los cierra el
`reviewer` por inspección.

No rebasees esta rama después de que Codex rellene los hashes, porque
invalidarían la tabla (ver #87).
