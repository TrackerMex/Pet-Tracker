# review: mobile-home-motion-foundations (#152)
Fecha: 2026-10-07
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-152, branch feature/152-mobile-home-motion-foundations, HEAD c7ac5ceb (verificado)
Base del handoff (H0): 36f91e6e. Merge previo 9ecc70bb (ancestro de H0, verificado)
Veredicto: RECHAZADO

El código cumple la spec, y en él no hay ningún defecto de comportamiento. El rechazo se debe a tres cláusulas universales de R5 y R7 a las que les falta el candado de alguna de sus ramas. En los tres casos hay mutantes plantados en la zona ciega que sobreviven a `index.test.tsx` entero (ver §Observaciones B1-B3). Las listas de `it` de la spec no enumeran esas ramas. Codex siguió la spec, así que el hueco nace en la spec y su cierre pasa por una enmienda.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente #152 mobile-home-motion-foundations
- [x] progress/current.md describe la sesión activa de #152 (handoff a Codex con E1-E3, reviewer pendiente)

## Checklist C3 — Arquitectura
- [x] Móvil, pantallas: no se toca ningún route. Todo el cambio vive en `src/screens/home/` y `src/theme/`
- [x] Las duraciones y presets de movimiento son constantes de `src/theme/motion.ts` y no tienen literales repartidos por las pantallas
- [x] Sin cambios en backend ni infra (0 ficheros en `backend-pet-tracker/` y en infra desde H0)

## Checklist C4 — TDD
- [x] Cada R1-R9 tiene un describe `#152 R<n>: ...` en el fichero que fija la spec. R10 es un smoke humano
- [x] Historial test-primero. Volví a reproducir cada rojo y cada verde en un worktree desechable sobre cada commit:
  - **Rojos.** Todos dan exit=1 y ninguno falla por SyntaxError, ReferenceError ni `Cannot find module`.
    - R1 f110abac: 6 failed, con aserción.
    - R2 595665b3: 3 failed, con aserción. La mutación `/* --motion */` va versionada en global.css.
    - R3 de2bab96: 2 failed. Hay un stub `export {}`, y el `TypeError: homeEntering is not a function` es el que declara la spec.
    - R4 3f42c163 y E1 891bc4f6: 4 failed, por `Element type is invalid`.
    - R5 557ce704: 7 failed, más los 4 de orden por `toEqual`.
    - R6 29eba7b1 y E2 bb7f3194: 2 failed.
    - R7A a7cbd7d7: 2 failed.
    - R7B c872a3e1: 1 failed. La mutación es un segundo summary-reveal versionado.
    - R8A 5606d328: 9 failed.
    - R8B 26092abf: 2 failed. La mutación es la barra incondicional, versionada.
    - R9 4daff5ff: 1 failed, con violación `collar-battery-bar.tsx`.
    - E3 11dffcf4: devuelve al verde los 5 guardas históricos de design-drift.
  - **Verdes.** Todos son los esperados.
    - G1 a588f1d8: 6 passed.
    - G2 40ef31a7: 9 passed.
    - G3 0b2ba0da: 2 passed.
    - G4 a34c2712: 6 passed.
    - G5 60371e0a: 176 passed, más los 2 rojos de R6 que se esperan hasta G7A.
    - G7A 630a611e: 180 passed.
    - G7B b25535eb: 181 passed.
    - G8A 6da3a9c7: 190 passed.
    - G8B b0ab47fc: 192 passed.
    - G9 86f4b6ed: 62 passed.
  - Cada mutación de producción versionada en un rojo se revierte en su verde.
  - Los commits de E1, E2 y E3 son rojos legítimos que solo tocan tests.
  - Las desviaciones autorizadas son equivalentes a lo pedido:
    - E2 espera `'15 kg'`, que es la salida real de `fmtKg`.
    - E3 usa `toHaveStyle` en R8.3 y R8.4. Lee el mismo estilo del primer render (PL1), y M9 y M10 lo siguen detectando.
- [ ] **Candados completos**: no. Hay tres cláusulas universales con ramas sin candado (B1-B3)

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas "pendiente", salvo R10 `pendiente (humano)`, que no bloquea
- [x] Los 24 hashes citados existen (`git cat-file -e`) y son ancestros de HEAD (`git merge-base --is-ancestor`)
- [x] Las filas de R4, R6 y R8 citan los rojos de E1, E2 y E3. La fila de R8 documenta `toHaveStyle` según E3
- [x] Los commits siguen el formato `test|feat|docs(<scope>): #152 R<n> ...`

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada (2026-10-06, vía Notion)
- [ ] La enmienda A21 de docs/ui-guidelines.md tiene su casilla `- [ ] Enmienda aprobada por humano` sin marcar. Es solo para el humano y no bloquea este veredicto

## Checklist C7 — Sin código huérfano
- [x] N/A. La feature no reemplaza nada. La migración de las constantes anteriores (`MEALS_BAR_TIMING`, etc.) queda fuera de alcance por escrito en A21

## Checklist C8 — Carta UI (docs/ui-guidelines.md + skills expo:expo-overview y expo:expo-animation)
- [x] Los 4 ficheros no tienen hex (el único match es el comentario `// #152`), clases arbitrarias, `StyleSheet`, shadow ni `var(` en estilos animados. R9 lo candea con `MEALS_BAR_STYLE_ESCAPES`
- [x] Reanimated en el UI thread:
  - las recetas `entering` son worklets con `'worklet'`;
  - los valores compartidos usan `.get()`/`.set()`;
  - no se escribe ningún valor compartido durante el render (solo en el efecto);
  - no hay `runOnJS` ni `.value`.
- [x] Las curvas siguen las tablas de la skill:
  - ease-out `Easing.bezier(0.23, 1, 0.32, 1)` para el fundido;
  - ease-in-out `(0.77, 0, 0.175, 1)` para el relleno;
  - muelle `dampingRatio: 1` sin rebote.
  - Las duraciones son las de la carta (150/250/400).
- [x] Reduce motion. Se conservan el fundido y el escalonado y se quita el desplazamiento (D3), con `withDelay` en `ReduceMotion.Never`. Es el criterio de la skill: "fewer and gentler, not zero". La barra salta a `pct` sin `withTiming`.
- [x] La entrada se reproduce una vez por montaje: al volver al foco se conservan los 7 nodos (R6), y M5, M6, X3 y X9 lo confirman. Las `entering` cuelgan de hijos de un `ScrollView`, no de filas virtualizadas.
- [x] No hay animación sobre el skeleton. `summary-reveal` no se monta mientras está `summary-skeleton` (R7B), y el skeleton se desmonta sin fundido cruzado.
- [x] `bun run typecheck` y `bun run lint` dan exit=0 en c7ac5ceb (worktree desechable)

## Lista cerrada de ficheros
`git diff --name-only 36f91e6e HEAD`, sin contar los ficheros del leader, da exactamente los 11 de la lista cerrada del handoff:
docs/ui-guidelines.md; mobile-pet-tracker/src/__tests__/design-drift.test.ts; mobile-pet-tracker/src/screens/home/{collar-battery-bar.tsx, home-entrance.tsx, home-entrance.test.tsx, index.tsx, index.test.tsx}; mobile-pet-tracker/src/theme/{motion.ts, __tests__/motion.test.ts}; progress/impl_mobile-home-motion-foundations.md; specs/mobile-home-motion-foundations/traceability.md.
No hay cambios en backend ni en infra.

## Pruebas de mutación
Las corrí en un worktree desechable sobre c7ac5ceb. Revertí cada mutación con `git checkout HEAD -- <fichero>` y comprobé que `git status`/`git diff --cached` quedaban vacíos.

**Sondas de tasks.md (M1-M12).** Todas caen con el `it` previsto y por aserción, sin TypeError, ReferenceError ni SyntaxError.

| Sonda | Mutación | Resultado |
|---|---|---|
| M1 | `MOTION_STAGGER_MS` 60→50 | Rojo: R1 «declara el escalonado…» y R5 «escalona…» |
| M2 | `withDelay` de opacidad Never→System | Rojo: R3 «parte invisible…» y R4 «bajo reduce motion…» |
| M3 | Ignora reduce motion en el offset | Rojo: R4 «bajo reduce motion…» |
| M4 | Índices de quick-actions y weekly intercambiados (2↔3) | Rojo: R5 «escalona…» |
| M5 | `key={String(detail.dataUpdatedAt)}` en summary | Rojo: R6, los 2 `it` |
| M6 | `key={selectedPetId}` en quick-actions | Rojo: R6 «al cambiar de mascota…» |
| M7 | summary-reveal `homeEntering(0, 12)` | Rojo: R7 «funde sin espera…» |
| M8 | `pct >= 60` | Rojo: R8 «pinta 60% con bg-warning-strong» |
| M9 | FILL→FADE | Rojo: R8.3 y R8.7 |
| M10 | Valor inicial `pct` | Rojo: R8.3 |
| M11 | Dependencias del efecto `[]` | Rojo: R8.7 y R8.8 |
| M12 | Bajo reduce motion el efecto no asigna | Rojo: R8.8 |

**Sondas propias en zona ciega.**

| Sonda | Mutación | Resultado |
|---|---|---|
| X1 | summary-reveal `entering={reduceMotion ? undefined : homeEntering(0, 0)}` | **Sobrevive**: 23/23 de `#152` |
| X2 | `home-entrance-quick-actions` siempre montado, con el bloque condicionado dentro | **Sobrevive**: 192/192 de index.test.tsx |
| X2b | Igual para `home-entrance-summary` | **Sobrevive**: 192/192 |
| X2c | `home-entrance-weekly` sin `selectedPetId &&` (sin mascotas pinta el skeleton) | **Sobrevive**: 192/192 |
| X2d | `home-entrance-reminders` siempre montado | **Sobrevive**: 192/192 |
| X21 | Condición de weekly `kind !== 'error'` en vez de `=== 'ok'` (envoltorio vacío con `unreachable`/`unauthorized`) | **Sobrevive**: 192/192 |
| X17 | `weekly-activity-day-map` dentro de un `HomeEntrance` (index 6) | **Sobrevive**: 192/192 |
| X18 | `pet-hero-error` dentro de un `HomeEntrance` | **Sobrevive**: 192/192 |
| X3 | `key` de weekly según skeleton/ok (se vuelve a montar al llegar el dato) | Rojo: R6 «al cambiar de mascota…» |
| X4 | `style` propio en `HomeEntrance` | Rojo: R4 «no añade estilo propio» |
| X7 | Barra delante del texto | Rojo: R8.2 |
| X7b | Barra envuelta en un `View` | Rojo: R8.2 |
| X8 | Ancho desde `pct` y no desde el valor compartido | Rojo: R8.3 |
| X9 | `key={String(detail.dataUpdatedAt)}` en summary-reveal | Rojo: R6 «no repite la entrada al volver al foco» |
| X12 | Sin escalonado bajo reduce motion | Rojo: R4 «bajo reduce motion…» |
| X13 | `MOTION_FADE_TIMING` Never→System | Rojo: R1, R3 y R4 |
| X14 | `withDelay` de translateY Never→System | Rojo: R3 y R4 |
| X19 | `className` en summary-reveal | Rojo: R7 «envuelve la fila…» |
| X20 | Collar sin `&& connection` | Sobrevive, pero es un mutante **equivalente**: `deviceConnectionState` siempre devuelve un string no vacío cuando el detalle es `ok`. No es hallazgo |

Todos los `toHaveAnimatedStyle` llevan `shouldMatchAllProps: true`. No encontré candados tautológicos: `toBe(MOTION_FILL_TIMING)` va acompañado de `objectContaining` con los literales, que es la excepción que permite la spec.

## Observaciones

### Bloqueantes
- **B1. R5, «Cada envoltorio se pinta exactamente bajo la misma condición que su bloque».** Ninguno de los cuatro envoltorios que dependen de `selectedPetId` tiene candado para la rama `selectedPetId` nulo:
  - `home-entrance-summary`
  - `home-entrance-quick-actions`
  - `home-entrance-weekly`
  - `home-entrance-reminders`

  Las mutaciones X2b, X2, X2c y X2d dejan el envoltorio montado (vacío, o con el skeleton en el caso de weekly) cuando no hay mascota, y `index.test.tsx` sigue 192/192. Además, `home-entrance-weekly` («pendiente o es `ok`») solo tiene candado contra `kind: 'error'` (`it` «no pinta el envoltorio de la actividad si la actividad falla», línea ~4804). Con `unreachable` y `unauthorized` no hay candado, y X21 sobrevive.
- **B2. R5, «`pet-hero-error` y `weekly-activity-day-map` siguen siendo hijos directos de `home-content`, sin envoltorio».** Ninguna de las dos ramas tiene candado. X17 y X18 sobreviven 192/192. El único `toEqual` de hijos de `home-content` (R5 «pinta los seis envoltorios…») corre sin día seleccionado y con el detalle `ok`, así que ninguno de los dos nodos existe en ese test.
- **B3. R7, «un fundido de opacidad 0 a 1 en 250 ms ease-out … igual con o sin reduce motion».** Solo la rama sin reduce motion tiene candado: «funde sin espera ni desplazamiento» no activa `mockUseReducedMotion`. X1, que quita `entering` de `summary-reveal` bajo reduce motion, sobrevive los 23 `it` de `#152`.

Sobre la corrección: los rojos nuevos han de seguir la regla C4 de esta feature, es decir, una mutación de producción versionada en el commit rojo y revertida en el verde. Las sondas X1, X2, X2b, X2c, X2d, X17, X18 y X21 de esta tabla sirven de mutación.

### No bloqueantes
- Hay dobles líneas en blanco en `home-entrance.tsx` (entre las dos funciones), en `design-drift.test.ts` (antes del describe `#152 R9`) y en `docs/ui-guidelines.md` (antes de `## Enmienda #152`). El `Pressable` de `collar-card` en `index.tsx` está mal indentado. Lint da exit=0, así que es cosmético.
- La barra anima `width` en un nodo dentro del flujo. La skill de animación solo exime a los nodos absolutos sin hijos. Aun así, el relleno es el único hijo de una pista de tamaño fijo con `overflow-hidden`, no relayouta hermanos, y la spec prescribe ese patrón (#106). No es violación.
- R10 (smoke en dev build de Android) y la casilla de A21 son del humano.
- En el log de init.sh, jest móvil avisa de "A worker process has failed to exit gracefully". No altera ningún recuento (96/96 suites).

## Output de ./init.sh (corrido por el leader en c7ac5ceb, exit=0)
Log: /tmp/claude-1002/-home-claude-sites-Pet-Tracker/74892c00-321f-434a-abca-de5bbd0439dc/scratchpad/init-152.log. El log es posterior al commit HEAD. Cifras verificadas contra el log:
```
✅ Build exitoso
Test Suites: 176 passed, 176 total          (backend)
Tests:       1348 passed, 1348 total
Test Suites: 96 passed, 96 total            (mobile)
Tests:       2209 passed, 2209 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total   (e2e)
Tests:       8 skipped, 438 passed, 446 total
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
