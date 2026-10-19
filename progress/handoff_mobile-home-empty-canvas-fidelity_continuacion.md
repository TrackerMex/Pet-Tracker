Worktree: /home/claude/sites/Pet-Tracker-wt-176

# Handoff de continuación a Codex CLI — feature #176 mobile-home-empty-canvas-fidelity

Continúa la cadena parada en R2. **Todas las reglas de `progress/handoff_mobile-home-empty-canvas-fidelity.md`
siguen vigentes** (alcance cerrado, test primero, rojos aceptables, comandos con `cd`, un jest a la vez,
§Esperas, sin `init.sh`, comentarios `#176 R<n>`, skills, prohibiciones, sin PR). Léelo entero antes de
empezar; aquí solo está lo que cambia.

Confirma en el reporte `pwd` y `git branch --show-current`
(`feature/176-mobile-home-empty-canvas-fidelity`). Solo ese worktree.

## Qué cambió

La parada de R2 era un hueco de la spec: el `it` «#155 R4 … pinta la pose, el título y la frase de Pingo»
de `src/screens/home/index.test.tsx` llama a `toBeVisible()` sobre la etiqueta del CTA en el primer render,
y desde R13 el CTA nace con opacidad 0. `tasks.md` §Tests enmendados lo lista ahora (commit `8bb1b802`).
La enmienda es exactamente esa y ninguna otra: la última aserción pasa a

```ts
await waitFor(() => expect(within(screen.getByTestId('home-empty-action')).getByText('Añadir mascota')).toBeVisible());
```

(timers reales: retraso de 180 ms + `MOTION_FADE_TIMING`, dentro del timeout de 1000 ms de `waitFor`). Lleva el
comentario `(enmendado por #176 R13)`. No cambies ninguna otra aserción, espera ni doble del fichero. Si
`waitFor` no está importado en el fichero, añade solo ese especificador a la importación existente de
`@testing-library/react-native`.

## Arranque

1. `H0=$(git rev-parse HEAD)` (commit de este handoff). Anótalo en el reporte como H0 de la continuación;
   el H0 original sigue siendo `1c490233…`. T0 = 3994 (ya medido, no se vuelve a medir).
2. Anclas (desde la raíz del worktree). Si una no da su valor, **PARA y avisa**:
   - `git cat-file -e 52f282e2d8e245ac7f497d1d0082dfc446c3b681 && echo ok` → `ok`
   - `git status --short` → exactamente dos líneas: ` M mobile-pet-tracker/src/screens/home/index.tsx` y
     `?? progress/impl_mobile-home-empty-canvas-fidelity.md`
   - `git diff --numstat -- mobile-pet-tracker/src/screens/home/index.tsx` → `1<TAB>0<TAB>mobile-pet-tracker/src/screens/home/index.tsx`
   - `grep -cF 'variant="hero"' mobile-pet-tracker/src/screens/home/index.tsx` → `1`
   - `grep -cF 'enmendado por #176 R13' mobile-pet-tracker/src/screens/home/index.test.tsx` → `0`
   - `grep -cF 'flex-1 items-center justify-center p-6 bg-background' mobile-pet-tracker/src/screens/home/index.tsx` → `1`
   - `ls progress/impl_mobile-home-empty-canvas-fidelity.done 2>&1 | grep -c 'No such file'` → `1`
3. El reporte `progress/impl_mobile-home-empty-canvas-fidelity.md` existe sin commitear: **no lo
   reescribas ni lo borres**. Cambia su primera línea de estado y añade al final una sección
   `## Continuación (H0 = <hash>)` con lo de abajo. Los hashes de la cadena previa se conservan.

## Cadena restante (test primero)

1. **Apartar la línea de producción de R2.** Guarda el diff fuera del árbol y revierte:
   `git diff -- mobile-pet-tracker/src/screens/home/index.tsx > /tmp/pet-176-R2.patch && git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
   y comprueba `git diff --quiet -- mobile-pet-tracker/src/screens/home/index.tsx` y
   `git diff --cached --quiet -- mobile-pet-tracker/src/screens/home/index.tsx`. (Sin `stash`: es del repo,
   no del worktree.)
2. **Commit test: enmienda #155 R4 (R13).** Nace **verde** (NV, declarado): sin `hero` conectado, el CTA ya
   es visible. Mide `home/index.test.tsx` antes y después: esperado `1 failed, 227 passed, 228 total` en
   ambos (el único rojo es el `it` nuevo de R2). Typecheck y lint como en el handoff original.
   Mensaje: `test(mobile-home-empty): wait for the hero entrance before asserting the CTA (R13)`.
3. **Commit feat: R2.** Reaplica la línea: `variant="hero"` justo después de `testID="home-empty"` en
   `EmptyState` de `src/screens/home/index.tsx` (`git apply /tmp/pet-176-R2.patch`, o a mano si falla).
   Esperado: `home/index.test.tsx` → `228 passed, 228 total`. Candado de alcance, con salida esperada:
   `grep -rn 'variant="hero"' mobile-pet-tracker/src/screens` → una sola línea, de `src/screens/home/index.tsx`.
   Mensaje: `feat(mobile-home-empty): render Home's empty state as the hero (R2)`.
4. **R3.** Test: el «#181 R3.2» enmendado exige la clase exacta `flex-1 items-center justify-center px-5 py-6
   bg-background` y los hijos `['home-empty']` (`tasks.md` §R3). Nace rojo. Luego feat: cambia `p-6` por
   `px-5 py-6` en `home-no-pets-screen`. Tras el feat, el ancla `grep -cF 'flex-1 items-center justify-center
   p-6 bg-background' mobile-pet-tracker/src/screens/home/index.tsx` → `0`.
5. **R10.** Test de caracterización bilingüe (`tasks.md` §R10), en `home/index.test.tsx`. Nace **verde**
   (NV, declarado), sin commit de implementación.
6. **R11.** Sonda del grep-clean con la mutación plantada, como indica el handoff original (§Reglas de la
   cadena, última viñeta). Sin commit de producción propio. Una sonda que no da rojo BLOQUEA.
7. Suite completa, una sola ejecución sin pipe, log fuera del árbol: `Tests:` debe ser T0 + los `it` nuevos
   de toda la cadena (cuéntalos del reporte: `empty-state-hero.test.tsx` 10 + el de R2 + los de R3/R10 que
   hayas añadido; no asumas un total, mídelo y explica la diferencia con T0). El aviso `worker process has
   failed to exit gracefully` es preexistente.
8. Commit final de arnés: `traceability.md` con las 14 filas y hashes reales (`git cat-file -e` cada uno) y
   el reporte, en UN commit `docs(#176): trazabilidad y reporte de implementación (R1-R14)`.

## Reglas que cambian o se subrayan

- Si aparece **otro** rojo no previsto, PARA y avisa; no ajustes la aserción para esquivarlo.
- No rebasar. No toques `docs/`, `specs/`, `feature_list.json`, `progress/history.md`, `progress/current.md`
  ni la casilla del smoke (el leader ya enmendó `tasks.md`; no lo vuelvas a editar salvo `traceability.md`).
- Cadenas de comandos: cabeceras como `# --`; el registro del rojo y el `git commit` encadenados por `&&`.
- Reporte: H0 de la continuación, `Tests:` antes y después de cada commit, hashes nuevos, NV declarados
  (enmienda #155 R4, R10, sonda R11), resultado de la sonda, y cada parada o desviación.
- Última acción: crear `progress/impl_mobile-home-empty-canvas-fidelity.done` con una línea: la ruta del
  reporte. Solo cuando la cadena esté completa y la suite en verde; si te paras, el marcador va igual, pero
  el reporte debe decir `BLOQUEADO` en su primera línea.

## Corrección 2 (tras la segunda parada)

El `waitFor` no arregla el `it`: el diagnóstico del leader mostró que en jest el estilo del nodo host de
`home-empty-action-wrap` se queda en opacidad 0 aunque pase el tiempo (solo `getAnimatedStyle` ve la
animada). La enmienda correcta es reduce motion en ese `it` (R7: estado final desde el primer fotograma).
`tasks.md` §Tests enmendados ya lo dice. El commit `314d1407` (waitFor) se queda en la historia, no se
rebasa; se corrige con un commit de test nuevo.

Retoma así, **antes** del paso 3 de arriba (feat R2):

1. Anclas: `git status --short` → las mismas dos líneas (` M …/home/index.tsx` y `?? progress/impl_…md`);
   `git diff --numstat -- mobile-pet-tracker/src/screens/home/index.tsx` → `1<TAB>0<TAB>…`;
   `ls progress/impl_mobile-home-empty-canvas-fidelity.done 2>&1 | grep -c 'No such file'` → `1`
   (el leader lo borra antes de pasarte esto; si existe, PARA). Anota el nuevo `H0=$(git rev-parse HEAD)`.
2. En `src/screens/home/index.test.tsx`, `it` «pinta la pose, el título y la frase de Pingo»: añade como
   primera línea `mockUseReducedMotion.mockReturnValue(true); // (enmendado por #176 R13)` y restaura la
   última aserción a `expect(within(screen.getByTestId('home-empty-action')).getByText('Añadir mascota')).toBeVisible();`
   (sin `waitFor`). Nada más.
3. Mide con el cambio de producción presente: esperado `228 passed, 228 total`. Guarda el diff
   (`git diff -- mobile-pet-tracker/src/screens/home/index.tsx > /tmp/pet-176-R2.patch`), revierte
   (`git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`, y comprueba diffs de trabajo e
   índice vacíos) y mide: esperado `1 failed, 227 passed, 228 total` (solo el `it` de R2). Typecheck y lint.
   Commit de test (NV, declarado): `test(mobile-home-empty): assert the CTA under reduced motion instead of waiting (R13)`.
4. Reaplica el parche, mide `228 passed, 228 total` y commitea el feat R2 como indicaba el paso 3. Sigue
   con R3, R10, R11, suite y cierre. El reporte debe registrar el `waitFor` fallido como desviación.
