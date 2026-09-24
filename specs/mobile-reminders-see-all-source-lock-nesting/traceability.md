---
feature: "mobile-reminders-see-all-source-lock-nesting"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-reminders-see-all-source-lock-nesting]] (#112)

> Las dos últimas columnas las rellena **Codex** al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: el bloque se acota al tag de apertura propio | `src/screens/home/index.test.tsx` :: `#70 R10: enlace a la lista de recordatorios` › `#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura` | `89c8f317` | `2597d29e` |
| R2: rojo ante los dos agujeros (N1, W1) | el mismo test de R1, cerrado por **mutación de producción** (C4, vía **b**). N1 va versionada en el rojo; W1 es sonda temporal, con su veredicto en `progress/impl_mobile-reminders-see-all-source-lock-nesting.md` | `89c8f317` | `2597d29e` |
| R3: mismo veredicto en las doce sondas (E1 declarada) | el mismo test de R1. Tabla de las doce sondas en el mismo reporte; son temporales y no se commitean | `89c8f317` (mismo candado de R1/R2) | `2597d29e`; sondas temporales sin commit |
| R4: el patrón, anclado por contenido | **sin test**: el comentario sobre el `const block` en `src/screens/home/index.test.tsx` y el párrafo sustituido en `docs/conventions.md` §Recortes del tag de apertura. Lo verifica el `reviewer` leyendo, más `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` → exit 1 | N/A: entregable documental declarado sin test | `99dc211c` |
| R5: cero diff de producción | **sin test**: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` → exit 0. Lo verifica el `reviewer` | `89c8f317` (N1 versionada) | `2597d29e` (N1 revertida) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

Convención de commit: `test(mobile): <desc> (R1,R2)` para el par rojo→verde
y `docs(mobile): <desc> (R4)` para la documentación. R1 y R2 comparten par: el
commit rojo **versiona la mutación N1 en producción** y el verde **la revierte**
(C4, quinto punto), igual que #109.

R4 y R5 **no tienen test, y la spec lo declara aquí antes del handoff**: R4 es
un entregable de documentación y R5 es una propiedad del diff. Los cierra el
`reviewer` por inspección.

No rebasees esta rama después de que Codex rellene los hashes, porque
invalidarían la tabla (ver #87).
