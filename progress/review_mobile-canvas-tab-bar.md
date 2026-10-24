# review: mobile-canvas-tab-bar (#206)
Fecha: 2026-10-24
Veredicto: APROBADO

Revisado en `/home/claude/sites/Pet-Tracker-wt-206`, branch
`feature/206-mobile-canvas-tab-bar`, HEAD `3df43a06` (merge `736fcf3e` de
`origin/dev` `8bd88522` con #199 + docs). H0 del handoff `e4b91dfe`. Último
commit de Codex `4afb80b3`.

Bloqueantes: 0. Observaciones no bloqueantes: O1 a O5. O1 pide acción del
leader antes de mergear otra enmienda de la carta en `dev`.

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json` de la rama (la guarda de init.sh no salta). #206 está `spec_ready`, como el resto de la ola 2 paralela. Respecto a `origin/dev`, el único cambio de `feature_list.json` es `pending → spec_ready` de #206, que es estado del harness y no de Codex. Pasarla a `done` es cierre del leader.
- [x] `progress/current.md` está en plantilla. La sesión vive en el worktree, en el handoff sin commitear y en `progress/plan_canvas-parity-2026-10-23.md`, igual que en las reviews de #197, #199 y #200.
- [x] Árbol: `git status --short` muestra solo ficheros del leader sin versionar (`progress/handoff_…`, `progress/inventory-audit_…`) y este fichero. `git status --short -- mobile-pet-tracker/` sale vacío y `git diff --cached --quiet` sale 0 tras mis mutaciones.

## Checklist C3 — Arquitectura
- [x] La feature es solo de UI móvil: `FloatingTabBar`, el catálogo i18n, la carta y los tests. No toca capas de backend.
- [x] Lee tema, sombras y copy por hooks compartidos (`useThemeColors`, `useShadows().tabBar`, `t('tabs.bar')`). No hay valores duplicados en local.
- [x] Las guardas del handoff sobre rutas intocables dan diff vacío, tanto antes del merge (`e4b91dfe..4afb80b3`) como después (`origin/dev..HEAD`): `src/app`, `src/theme`, `src/screens`, `package.json` y `bun.lock`.
- [x] `TAB_INDICATOR_SPRING` no cambia (sin líneas `+`/`-` en `duration`, `dampingRatio` ni `reduceMotion`), según D5.

## Checklist C4 — TDD
- [x] Cada R1 a R10 tiene `it` que nombra su R-id: BAR tiene 9 `('#206 R` y CF tiene 10 (9 `it` más 1 `it.each` de R7). Las 7 enmiendas de BAR llevan el sufijo `(enmendado por #206 R5|R6)`. La fila 8 de `ui-language.test.ts` y la fila 9 de `language-provider.test.tsx` llevan `(enmendado por #206 R8)`.
- [x] El historial va test primero. Cada `test(#206): R<n>` toca solo ficheros de test y va antes de su `feat(#206): R<n>`, que toca solo producción, catálogo o carta. `3f173e96` es un segundo commit rojo de R5, anterior al verde `2935b3c6`. R10 nace verde, como prescribe la spec.
- [x] Los rojos fallan por aserción y no por excepción. En `progress/r{1..9}-red-206.log` hay 0 `ReferenceError`, `Cannot find module`, `is not defined` o `SyntaxError`. El rojo de R6 falla por `Unable to find … icon-tab-*` y por la subcadena `d=` ausente. Sus filas son exactamente las que fija E1: BAR `#206 R6` ×5, `#91 R5` enmendado y CF `#206 R6`.
- [x] El doble de `react-native-svg` (D6, más `SvgXml` de E1) es literal a la errata firmada.
- [x] No hay candados tautológicos. CF importa solo `node:fs` y `node:path`. BAR importa `FloatingTabBar`, `TAB_INDICATOR_SPRING` y `FloatingTabBarProps`, pero el bloque `canvas: barra de pestañas` no usa `TAB_INDICATOR_SPRING`. Todas sus cifras son literales: `h-16`, `p-1.5`, `gap-1`, `width:66`, `left:6`, `top:6`, `height:52`, `translateX:140`, `boxShadow` 0/10/30/0, `strokeWidth` 2.4 y 2, y los `d` copiados a mano.
- [x] Mis mutaciones dan rojo, y las revertí con `git checkout HEAD --`:
  - M1, `(tabWidth + 2)` solo en el efecto, no en `handleLayout`: 3 rojos en BAR (filas 2, 5 y 6 del inventario).
  - M2, `d` de profile `…16 0` → `…16 1`: BAR `#206 R6: el icono de profile` y CF `#206 R6`.
  - M3, `left: 6` → `left: 4`: BAR fila 1, BAR `#206 R5` y CF `#206 R5`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` tiene R1 a R10 en «verde». R11 queda «pendiente del humano (S1–S8; fuera del gate de implementación)», como fija la spec, así que no es fila pendiente del implementador.
- [x] Los 20 hashes citados son ancestros de HEAD, y el asunto de cada uno corresponde a su R y a su fase (test o feat).
- [x] Los commits siguen `test|feat(#206): R<n> <desc>`, el mismo formato aceptado en #199 y #200. `b2a32399` es la errata E2 del leader (solo `specs/`) y es anterior al HEAD de handoff.
- [x] La lista cerrada del handoff (8 ficheros) coincide con `git diff --name-only e4b91dfe..4afb80b3 -- mobile-pet-tracker/ docs/`.
- [x] Las anclas finales coinciden: BAR 9 / 7, CF 10, `tabs.bar` 1 en `ui-copy-table.ts`, `'tabs.bar'` en `en` (`Tabs`) y en `es` (`Pestañas`), `#206` 3 veces en la carta, y el párrafo D-I una sola vez. `^## Enmienda` mide 27 = 26 de `origin/dev` + 1.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`, con la casilla de aprobación y la de enmienda marcadas por firma delegada (plan §4). E1 y E2 están firmadas.
- [x] Los artboards congelados `specs/mobile-canvas-tab-bar/canvas/` no tienen diff desde H0. Desde H0, en `specs/` solo cambian E2 (leader) y `traceability.md`.

## Checklist C7 — Sin código huérfano
- [x] El reemplazo de iconos de `reicon-react-native` es completo: `floating-tab-bar.tsx` ya no importa `reicon` (0 coincidencias). El doble de reicon sale de BAR.
- [x] Los tests del comportamiento reemplazado están enmendados (filas 1 a 7), no duplicados. La fila 10 (`#197 R20`) ya no existía en H0 por #200 (E2): `canvas-foundations.test.ts` tiene 0 `#197 R20`.
- [x] La resolución del merge con `dev` (#199) no pierde nada:
  - El delta de la feature es idéntico antes y después del merge en 7 de los 8 ficheros (comparé líneas ±).
  - `language-provider.test.tsx` conserva el título de dev (`#189 R15`, `#199 R5`, `R9`, `R14`, `R17`, `#198 R15`) y le añade al final ` (enmendado por #206 R8)`. La suma conserva las 5 filas de dev. `+ 2 // #198 R15` pierde la coma y `+ 1, // #206 R8` queda último.
  - `ui-guidelines.md`: `git diff origin/dev HEAD` es un añadido puro tras la Enmienda #199, que queda intacta. #206 es el último bloque.

## Checklist C8 — UI móvil (carta)
- [x] Grep-clean en `floating-tab-bar.tsx`: 0 `#`, 0 `-[`, 0 `StyleSheet`, 0 `shadowColor` y `elevation`, 0 `text-13/15/17`, y 1 `text-accent-strong`. Lo fija R10, y lo comprobé leyendo el fuente.
- [x] La sombra sale de `useShadows().tabBar`, no de `shadow-lg` ni de sombras legacy de React Native.
- [x] Safe area: `bottom: insets.bottom + 12`, `left: 16`, `right: 16`.
- [x] Sin estados de carga nuevos, así que no aplica Skeleton.
- [x] Componente compartido único: solo cambia `FloatingTabBar`, sin forks.
- [x] Touch target: celdas de 52 de alto por 66 de ancho a 360, ambas ≥ 44.
- [ ] Feedback pressed en las celdas: no lo hay. Ver O2 (no bloqueante, no es regresión).
- [x] La animación sigue siendo `withSpring` de Reanimated con `TAB_INDICATOR_SPRING` intacto, sin `Color` ni variables CSS en el estilo animado (`backgroundColor` viene de `useThemeColors`).
- [x] La carta (`docs/ui-guidelines.md`) recoge la excepción nombrada a D-I limitada a esta barra, sin editar el párrafo D-I.

## Observaciones

### O1 (no bloqueante, requiere acción del leader): CF `#206 R9` fija la posición de la Enmienda al final de la carta
`mobile-pet-tracker/src/__tests__/tab-bar-canvas-fidelity.test.ts:134`:

```ts
expect(normalized.endsWith(`${BLOQUE}\n`)).toBe(true);
```

Esta aserción no está entre las que prescribe la spec para R9: match 1, casilla `[ xX]`, `split(BLOQUE)` 2 y `split` D-I 2. Tampoco está en el handoff ni en el informe de Codex. Es coherente con el «al final» del EARS de R9, así que no es un incumplimiento. Pero es el único candado del repo que fija la posición de una enmienda: ni #199 ni #200 lo tienen.

Efecto: en cuanto otra feature añada su `## Enmienda` detrás de la #206, `#206 R9` se pone rojo en esa rama. Pasará con #198 y #201–#205 de la ola 2 si mergean después de #206, y al resolver un merge de `dev` con la regla «dev + delta». Ese rojo no estará en el inventario de esa feature, así que dispara su Regla de parada.

La casilla en sí no causa problemas: el test la normaliza a `- [ ]` antes de comparar, así que marcarla al cierre no rompe nada.

### O2 (no bloqueante): las celdas de la barra no tienen feedback pressed
Los `Pressable` `tab-${name}` (`floating-tab-bar.tsx:191-208`) no tienen función de `style`, ni clase `active:`, ni `android_ripple`. En H0 `e4b91dfe` tampoco lo tenían (`className="flex-1 items-center gap-1"`). La spec no lo prescribe y deja fuera de alcance cambiar la navegación, así que no es una regresión. Sigue siendo un hueco frente a C8 y a la micro-regla de la carta («Feedback pressed en TODO elemento tappable»), con el mismo tratamiento que O4 de la review de #195.

### O3 (informativa): rojo transitorio no inventariado en R8, explicado en el informe
`ui-language.test.ts` › `#194 R5: resuelve cada ocurrencia de la tabla contra la clave exacta` se puso rojo en `c8648542`: `checkUses(ALL_USES)` vio 0 usos de `tabs.bar` frente a 1. La causa es la fila nueva en `ui-copy-table.ts`, el mismo literal de R8. Pasa a verde con `t('tabs.bar')` en producción, en `c4bf8dfa`, sin enmendar el test. El informe lo declara con su log (`progress/r8-copy-red-206.log`).

### O4 (informativa): cierres que tocan al leader o al humano
- En la carta, la casilla `- [ ] Enmienda #206 aprobada por humano` está sin marcar. Las de #194, #195, #197 y #200 están en `[X]`.
- En `feature_list.json`, #206 está en `spec_ready`.
- R11 (smoke S1–S8 en dev build Android) es del humano.

### O5 (informativa): ficheros sin versionar del leader en el worktree
`progress/handoff_mobile-canvas-tab-bar.md` y `progress/inventory-audit_mobile-canvas-tab-bar.md`.

## Verificación propia (sin init.sh)
Todo corrido en `/home/claude/sites/Pet-Tracker-wt-206/mobile-pet-tracker` sobre HEAD `3df43a06`. Logs en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/`.

- Tests dirigidos de la feature (BAR, CF, `ui-language`, `language-provider`) con `--runInBand --testTimeout=30000`: exit 0, 4 suites, 134/134 (`rev206-targeted.log`).
- Guardas y consumidores (`design-drift`, `legibility-classnames`, `alert-detail-canvas-fidelity`, `canvas-foundations`, `(tabs)/layout`, `(tabs)/alerts`, `reminders-alerts-stack.navigation`, `detail-stack.navigation`, `alert-detail.navigation`, `detail-stack.guard`): exit 0, 10 suites, 259/259 (`rev206-guards.log`).
- `test ! -e .expo/types/router.d.ts` → 0. `bun run typecheck` → exit 0.
- `bunx expo lint --no-cache` → exit 0, con log de 0 bytes (`rev206-lint.log`).
- Mutaciones M1, M2 y M3: rojas (`m1.log`, `m2.log`, `m3.log`) y revertidas.

## Output de ./init.sh
El reviewer no lo corre: el clasificador lo deniega y lo corre el leader. Lo tomo como evidencia del gate global. El leader lo ejecutó sobre `3df43a06`. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-206.log`. Extracto:

```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 147 passed, 147 total
Tests:       5046 passed, 5046 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
exit=0
```
