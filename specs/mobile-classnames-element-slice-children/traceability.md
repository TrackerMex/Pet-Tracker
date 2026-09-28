---
feature: "mobile-classnames-element-slice-children"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Trazabilidad — [[mobile-classnames-element-slice-children]] (#120)

> **Codex** rellena las dos últimas columnas al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: los nueve elementos de `consistency-classnames` se leen en su tag de apertura, con ancla única | `src/__tests__/consistency-classnames.test.ts` :: los cuatro `it` que acaban en `en su tag de apertura (#120 R1)`: `#62 R1 … › %s aplica rounded-xl a %s en su tag de apertura (#120 R1)` (×4), `#62 R2 … › %s conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)`, `#62 R2 … › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)` y `#62 R4 … › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`. Se cierra por **mutación de producción** (C4, vía **b**): la sonda `P-active-h` va versionada en el rojo | `1ba1822433ca6c0aafb59ee376f530cc8899cda8` | `6807677954a5506ed0610ecdceb000b7d6307862` |
| R2: `variant` y `bg-danger` del botón destructivo se leen en su tag; la etiqueta, el texto y el veto del acento siguen en el bloque | `src/__tests__/legibility-classnames.test.ts` :: `#61 R1: la etiqueta destructiva usa el token de danger` › `conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`. Se cierra por **mutación de producción** (C4, vía **b**): la sonda `D-v` va versionada en el rojo. `D-h` no vale como rojo: hoy ya la paran nueve tests de `src/screens/reminders/index.test.tsx` | `b53b877831b1e5d6760e6b000dd67225e222b62d` | `ad361a5db54ddf37fe79bb6979d0ce9fa3801ef6` |
| R3: los veredictos de las sondas, con los cambios declarados | los tests de R1 y R2, sin test propio. La tabla de sondas va en `progress/impl_mobile-classnames-element-slice-children.md`. Las sondas son temporales y no se commitean | N/A: sin test propio; mide con los tests de R1 y R2 | `HEAD` (este commit del reporte; ver `git rev-parse HEAD`) |
| R4: el recorte y la excepción del bloque, documentados y anclados por contenido | **sin test**: los comentarios de [[tasks]] §R1 y §R2 y el párrafo de `docs/conventions.md` §Recortes del tag de apertura en candados de fuente. El `reviewer` lo verifica leyendo, con los greps de [[tasks]] §R4 | N/A: entregable documental, declarado sin test | `87f2e9014c906f39b733081c89e9236685e953c1` |
| R5: cero diff de producción, +0 suites y +0 tests, sin dependencias | **sin test**: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`, que debe dar exit 0, y `git diff --stat origin/main...HEAD -- mobile-pet-tracker/`, que lista solo los dos ficheros de test. Además, la suite completa y los blobs de [[tasks]] §R5. Lo verifica el `reviewer` | N/A: propiedad del diff acumulado | `HEAD` (este commit del reporte; ver `git rev-parse HEAD`) |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

- Los dos pares rojo→verde: `test(mobile): <desc> (R1)` y
  `test(mobile): <desc> (R2)`.
- La documentación: `docs(mobile): <desc> (R4)`.
- El reporte con los hashes: `docs(mobile): <desc> (R3,R5)`.

Cada par versiona su mutación de producción en el commit rojo y la revierte en
el verde (C4, quinto punto), como hicieron #124 y #126. Cada rojo toca **un**
fichero de producción, `src/screens/reminders/index.tsx`.

## Requisitos sin test propio

La spec declara aquí, antes del handoff, que R3, R4 y R5 no tienen test propio:

- R3 no tiene test propio porque sus veredictos salen de los tests de R1 y R2
  ante cada sonda.
- R4 es un entregable de documentación.
- R5 es una propiedad del diff.

El `reviewer` cierra R4 y R5 por inspección.

No rebasees esta rama después de que Codex rellene los hashes, porque dejarían
de valer los de la tabla (ver #87).
