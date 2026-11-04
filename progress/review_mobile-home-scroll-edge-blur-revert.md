# review: mobile-home-scroll-edge-blur-revert (revert de #242)
Fecha: 2026-11-04
Veredicto: APROBADO

Commit revisado: `2abb0945` (padre `44dac7b6`, sobre origin/dev). Revierte `0a8a0f29`.

## Verificaciones pedidas

1. Arbol movil vuelve al estado previo a #242: APROBADO.
   `git diff 0a8a0f29^1 2abb0945 -- bun.lock package.json src/screens/home src/__tests__/canvas-foundations.test.ts src/__tests__/zones-canvas-fidelity.test.ts`
   sale vacio. El unico delta movil contra `0a8a0f29^1` son
   `src/screens/reminders/index.tsx` e `index.test.tsx`, que vienen de #240 (PR #310,
   ya en dev, padre del revert) y no los toca este commit.
2. Sin referencias residuales: APROBADO.
   `grep -rnE "expo-backdrop|ProgressiveBlurView|home-edge-blur|home-screen-root" mobile-pet-tracker --exclude-dir=node_modules`
   da 0 coincidencias (exit 1).
3. Recuentos de los candados: APROBADO.
   `canvas-foundations.test.ts` (#197 R22) y `zones-canvas-fidelity.test.ts` (#202 R25) vuelven a
   `42 + 1` (sin la marca "enmendado por #242 R1" ni el `describe('#242 R1')`); package.json real:
   43 dependencies, 8 devDependencies, coherente con `42 + 1` y `toHaveLength(8)`.
4. `feature_list.json`: APROBADO. JSON valido; el diff del commit toca solo el objeto #242
   (`spec_ready` -> `done`, descripcion con resultado), 2 lineas.

## Checklist
- C2: solo #242 cambia de estado a `done`; sin otras features tocadas. [x]
- C3: sin cambios de capas (solo reversion de UI movil). [x]
- C4/C5: N/A, no hay requisitos nuevos; los tests de #242 se retiraron junto con el codigo. La spec y
  `traceability.md` de #242 quedan como registro historico (decision explicita D10), no como trabajo pendiente. [x]
- C6: la spec de #242 sigue aprobada; casillas G3/G2 cerradas como "no aplica" con fecha y motivo. [x]
- C7: el codigo y los tests reemplazados (ProgressiveBlurView, testID, test de la dependencia) fueron eliminados. [x]

## Observaciones
Ninguna que bloquee. Nota: `./init.sh` no lo ejecute (lo corre el leader, segun instruccion); el veredicto
cubre las cuatro comprobaciones estaticas pedidas, no el verde de la suite.
