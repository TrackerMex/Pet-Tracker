# review: mobile-home-pingo-phrase (#190)
Fecha: 2026-10-20
Veredicto: APROBADO (R1-R14). R15 (smoke Android) y la casilla de la Enmienda #190 en `docs/ui-guidelines.md` siguen sin marcar y son del humano: la feature no puede pasar a `done` hasta que las cierre.

Base revisada: branch `feature/190-mobile-home-pingo-phrase`, HEAD `3fa9b613`, H0 `845cc339`, origin/main `14ec7307` (= merge-base, sin deriva tras `git fetch`).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (#190 en `feature_list.json`; comprobado con python)
- [x] progress/current.md actualizado (sección #190 del leader)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, cambio solo de presentación móvil
- [x] contratos en domain: N/A
- [x] `homePingoPhrase` es función pura sin efectos (`src/screens/home/pingo-phrase.ts`); la pantalla solo la consume
- [x] Sin lógica de negocio nueva en infraestructura; backend intacto (`git diff origin/main -- backend-pet-tracker` vacío)

## Checklist C4 — TDD
- [x] Cada R1-R14 tiene test que lo nombra (`describe('#190 R<n>: ...')` o `(enmendado por #190 R<n>)`)
- [x] Historial test-primero en el orden del handoff (R9, R8, R11, R1, R2, R3, R4, R6, R10, R7, R13, R12, R5, R14), un rojo y su verde por requisito. Lo comprobé ejecutando los rojos en un worktree desviado: R1 `a17112f3` 7 rojos, R2 `da577a0c` 4, R3 `0f11fd80` 1, R4 `66d23db9` 1, R5 `ccbde7b2` 2 (por `toHaveAnimatedStyle`, aserción real), R6 `cf06f56d` 2, R10 `3fac2a91` 4. Coinciden con el informe.
- [x] Requisitos de verificación (R7, R12) nacen verdes con permiso expreso del handoff y se cierran por mutación (ver abajo, hechas por mí)
- [x] Ningún rojo por `ReferenceError` de helper de test. El rojo de R8 falla por módulo de producción inexistente (esperado en TDD, no es un helper de test)
- Observación menor: en el rojo R2 solo 4 de los 9 `it` fallan; los otros 5 (sin selección, sin mascotas, actividad cargando, bloques restantes) nacieron verdes porque el gate de R1 ya los cubría. Siguen vivos (ver mutaciones `gate-activity`, `gate-haspets`). No bloquea.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-home-pingo-phrase/traceability.md` sin filas "pendiente" (R15 declarada del humano, sin commit); la tocó un solo commit final `3fa9b613`, ningún commit R1-R14 la toca
- [x] Todos los hashes citados existen en `git log 845cc339..HEAD` y los tests citados existen con el R-id
- [x] Commits con formato `test|feat(home): ... (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`, casilla de aprobación y H1/H2/H3/Enmienda marcadas; Smoke R15 `- [ ]` sin marcar (A3 del handoff)

## Checklist C7 — Sin código huérfano
- [x] N/A — la feature no reemplaza nada existente (solo desplaza índices de `HomeEntrance` y enmienda dos tests de #152)

## Checklist C8 — UI móvil (feature toca `mobile-pet-tracker/`)
- [x] Grep-clean: cero hex, clases `[...]`, `StyleSheet.create`, elevation/shadow legacy y emoji en `index.tsx` y `pingo-phrase.ts` (candado R12 vivo, ver mutaciones)
- [x] Reutiliza `PingoFloat` y `HomeEntrance` sin tocarlos; sin animación nueva ni constantes en `motion.ts`
- [x] Enmienda #190 en `docs/ui-guidelines.md:736-747`: texto idéntico byte a byte al de `design.md` §Texto de la Enmienda #190 (comparado con script, 920 = 920 caracteres), tras la Enmienda #186, casilla `- [ ] Enmienda #190 aprobada por humano` sin marcar como pide el handoff
- N/A tappables (la burbuja no es interactiva)

## Verificación independiente
- init.sh: no lo ejecuté (denegado al reviewer). Revisé el log del leader (`init-190.log`): exit 0, móvil 126 suites / 4200 tests / 1 snapshot, lint y tsc verdes, backend 1474 + e2e 468 verdes. `test ! -e .expo/types/router.d.ts` exit 0.
- `git diff --check origin/main HEAD`: limpio.
- Alcance: producción contra origin/main = exactamente `index.tsx`, `pingo-phrase.ts`, `catalog.ts`, `global.css`. Sin cambios en `package.json`/`bun.lock`, `backend-pet-tracker/`, `home-entrance.tsx`, `pingo-float.tsx`, `motion.ts`. Tests tocados: los dos nuevos más los cinco de tasks.md §Tests enmendados y las dos enmiendas extra permitidas (`consistency-classnames.test.ts`, `profile-canvas-fidelity.test.ts`), todas con comentario `(enmendado por #190 R13)`. Resto del diff contra origin/main: harness del leader (spec, handoff, `feature_list.json`, `progress/current.md`).
- Literales R9 contra la spec: las 4 claves × 2 idiomas coinciden carácter a carácter (`catalog.ts:55-58`, `catalog.ts:493-496`).
- Clases R3/R11, 64×64, `require('../../../assets/images/pingo-talk.webp')`, índices 0..6 y `--radius-4: 4px` junto a `--radius-tile` (`global.css:18`) coinciden con la spec.

## Mutaciones plantadas por el reviewer (cada una revertida con `git checkout HEAD --`; árbol limpio al terminar)
Todas fallaron por su aserción (jest del fichero entero, sin pipe):
- `index.tsx`: quitar `activity.data !== undefined` (2 rojos); quitar `hasPets &&` (2); `gap-2.5`→`gap-2` (1); `items-end`→`items-center` (1); `PingoFloat`→`View` (2); índice del pingo 0→1 (7); alto 64→63 (1); `accessibilityLabel` en la pose (1); `rounded-br-4`→`-5` (1); `font-semibold`→`font-bold` (1); `distanceM` fijo a null (2); `meals` fijo a null (2); nombre fijo "Luna" (1); pose `pingo-wave` (1); índice de last-position 6→5 (1); índice de weekly 4→3 (1).
- `pingo-phrase.ts`: `>=100`→`>100` (2), `>=99` (2), `total > 0`→`>= 0` (2), invertir prioridad (6), `km` sin `fmtKm` (4), clamp de `served` a `total` (1).
- `catalog.ts`: punto final del ES de Walk (2); "I'm"→"I am" en Calm (2).
- `global.css`: `--radius-4: 5px` (1); token movido fuera de su posición junto a los radios (1).
- R12 (candado que nace verde): hex en `pingo-phrase.ts` (1), clase arbitraria `mt-[3px]` (1), `StyleSheet.create` en `index.tsx` (1), `elevation` en `index.tsx` (1), `bg-[#fff]` en la burbuja real (1), emoji en `pingo-phrase.ts` (1).
- R7 (candado que nace verde), mutando producción ajena: `HomeEntrance` sin `reducedMotion ? 0 :` (1) y sin `withTiming` del fundido (1) fallan. R5: `PingoFloat` arrancando el bucle con reduce motion (1).
- R14: cambiar "10 px" por "11 px" en la enmienda de `docs/ui-guidelines.md` (1).
- Un intento (inserción de `{null}` para "reordenar") fue un no-op mío y no cuenta; el orden de R1 queda candado por la mutación de índice (7 rojos) y por el `it` R1.

## Flake de `src/screens/profile/index.test.tsx`
Preexistente, no causado por #190. Evidencia: (1) `git diff 14ec7307..HEAD -- src/screens/profile` vacío (ni pantalla ni test cambian; solo el catálogo suma 4 claves ajenas); (2) 6 corridas secuenciales en origin/main y 6 en el worktree: todas verdes; (3) 8 corridas concurrentes (carga sintética, 4 CPU, otras sesiones activas) en cada árbol: en **origin/main limpio** falló 1 de 8 (`#173 R9: última señal relativa › ... hace 59 min`, `Unable to find an element with testID: pet-info-card`) y en el worktree #190 0 de 8. El test citado por Codex (`R1: me card`, `waitFor(me-card)` y luego `getByText` inmediato) tiene el mismo patrón de espera frágil bajo carga. Merece una feature de endurecimiento de esperas de Perfil, fuera de #190.

## Observaciones (no bloquean)
1. `src/screens/home/index.tsx` (`<Text testID="home-pingo-text" ... selectable>`): `selectable` no está en la spec (R11 fija testID y clase) y ningún test lo candada. Sin efecto visual; mejor documentarlo o quitarlo en un seguimiento.
2. `style={CONTINUOUS_CORNER}` en `home-pingo-bubble` tampoco está en R11, pero lo exige el candado #62 R14 (esquina no-cápsula continua) y por eso se enmendaron `consistency-classnames.test.ts` (Home 0→1, total 34→35→37 en sus fórmulas). Queda candado de forma incidental por `#190 R7` (`style` igual a `{ borderCurve: 'continuous' }`). Conviene que la spec lo recoja si se reabre.
3. `specs/.../traceability.md` conserva `status: draft` en el frontmatter (el implementer lo dejó "reservado al cierre"); lo cierra el leader junto con el resto del bookkeeping.
5. HALLAZGO A CORREGIR AL CIERRE (no rechaza R1-R14, pero se pondrá rojo al firmar): `mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts:61` compara el texto de la enmienda con la casilla literal `'- [ ] Enmienda #190 aprobada por humano'`. Cuando el humano marque `docs/ui-guidelines.md:747` (`[x]`), el test R14 falla. Tolerar la casilla marcada (`[ xX]`, memoria «Casilla de enmienda tolerante») en un parche del leader antes de pedir la firma, o la firma dejará la suite roja.
4. Autoría de los 29 commits: `Claude` (configuración de git de la máquina), no Codex; irrelevante para el gate.

## Pendiente del humano antes de `done`
- Smoke R15 en dev build Android (claro, oscuro, reduce motion): guion en `progress/impl_mobile-home-pingo-phrase.md::Smoke Android R15`; casilla `- [ ] Smoke de R15` en `requirements.md:61`.
- Casilla `- [ ] Enmienda #190 aprobada por humano` en `docs/ui-guidelines.md` (la de `requirements.md` ya está firmada). El test R14 exige que siga sin marcar en este commit; al firmarla hay que ajustar esa aserción o firmar tras el merge de forma coordinada.

## Output de ./init.sh
Corrido por el leader (no por el reviewer): `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/5220af5e-c4d5-4aa1-ac92-6fa69d99edf9/scratchpad/init-190.log`, exit 0, "Todo verde. Listo para trabajar." (móvil 126/126 suites, 4200/4200 tests; backend 187 suites/1474 tests y e2e 468).
