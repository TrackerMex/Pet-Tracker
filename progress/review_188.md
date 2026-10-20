# review: mobile-pairing-pingo-canvas-fidelity (#188)
Fecha: 2026-10-20T15:55Z
Veredicto: RECHAZADO
HEAD revisado: ec882bae (base H0 6dc51ca1)
Rama: feature/188-mobile-pairing-pingo-canvas-fidelity
Worktree: /home/claude/sites/Pet-Tracker-wt-188

Nota de ejecución: el reviewer no ejecutó `./init.sh` ni jest (el clasificador lo deniega al reviewer). El init lo corrió el leader y se cita como evidencia. Las mutaciones las ejecutó Codex en el worktree probe; el reviewer no las reejecutó y las verificó por sus logs. No se creó `.done`, no se commiteó nada y no se tocaron `progress/current.md`, `feature_list.json`, `specs/` ni `docs/`.

Este veredicto vale solo para el HEAD ec882bae. Cualquier commit nuevo (firmas humanas, merge de main, actualización de current.md) exige relanzar el reviewer.

## Checklist C1 — El arnés está completo

No aplica: #188 no es la primera feature del proyecto.

## Checklist C2 — El estado es coherente

- [x] Máximo una feature en `in_progress`. Solo #188 (`feature_list.json` L3400, única ocurrencia de `"in_progress"`).
- [x] Toda feature `done` tiene test. Comprobación acotada: #188 no está `done`; no se repasó el resto de features.
- [ ] `progress/current.md` está vacío o describe la sesión activa. No se cumple: describe la sesión de 1ec2046d (L6-11, "init sobre 1ec2046d exit 0; reviewer RECHAZADO"). Su plan (L12) espera un reporte de mutación que ya existe y no recoge el init de ec882bae (exit=0) ni la mutación. Lo actualiza el leader (B-1).
- [x] `progress/history.md` tiene entrada de cada sesión cerrada. Hay entradas de #177, #179 y #186. La de #193 está solo en `4a5b527e` (main), que no es ancestro de HEAD; llegará con el merge de main.

## Checklist C3 — El código respeta la arquitectura

- [x] La arquitectura respetada es la de `docs/architecture.md` (capas domain / application / infrastructure, regla de dependencia hacia adentro). El diff de la feature es solo presentación móvil; no toca domain, application, infrastructure ni `api/`. `language-provider.test.tsx` cambia por el merge de main, no por la feature.
- [x] Las entidades de domain no importan nada de infrastructure. Sin cambios en domain.
- [x] Los repositorios/contratos en domain son interfaces puras. Sin cambios.
- [x] La capa application solo depende de interfaces. Sin cambios en application.
- [x] La capa infrastructure implementa las interfaces de domain. Sin cambios en infrastructure. Los imports nuevos `@/components/ping-ring` (`pairing/index.tsx` L26, `welcome/index.tsx` L21) son de presentación.

## Checklist C4 — TDD

- [x] Cada R<n> tiene al menos un test que lo nombra. Verificado por grep: R1 `index.test.tsx:1071`; R2 `:1086`; R3 `:1102`; R4 `:1137`; R5 `:1154`; R6 `:1177`; R7 `:1189`; R8 `:1200`; R9 `:1231`; R10 `:1252`; R11 `pairing-canvas-fidelity.test.ts:24`; R12 `:69`; R13 `ping-ring.test.tsx:11` y `:18`; R14 `index.test.tsx:1273`. Cabecera `#188 R1-R14: pairing canvas fidelity` en `index.test.tsx:1060`.
- [ ] El historial de commits muestra el patrón test-primero. No se cumple: R9 (`e5716f2f`), R11 (`68fb1458`), R12 (`94cea37c`) y R14 (`f820d669`) nacen verdes sin commit rojo; R6 tiene un rojo inválido (`76bc928b`); tres commits de implementación dejan la suite roja (`bb598dbf`, `bcebe008`, `53e9af61`). Ver CRITICO-1, ALTO-3 y M-3.
- [ ] Requisitos de verificación con vía declarada. No se cumple: la spec no elige vía (a) ni (b) para R9, R11 y R14 ("puede nacer verde: anotarlo como NV", `tasks.md` L83, L97, L107). R12 prescribe plantar una mutación temporal y revertirla antes de cualquier commit (`tasks.md` L101), que no es la vía (b) con evidencia versionada. Ver CRITICO-1 y ALTO-2.
- [ ] Ningún commit rojo falla por un helper de test inexistente. No se cumple: `76bc928b` (R6) falla porque `findAllByType` no existe en RNTL 14 (impl L228). El rojo válido es `150dcf8d` y el verde `598af73d`. Ver ALTO-3.
- [ ] Ningún commit rojo falla por una mutación del doble de test; en un candado sobre código correcto, el rojo legítimo es la mutación de producción versionada en el commit rojo. No se cumple: R9, R11, R12 y R14 añaden candados sobre código correcto sin commit rojo con mutación de producción versionada. Las mutaciones M1–M5 se ejecutaron después, como evidencia post hoc. Ver CRITICO-1 y ALTO-2.

## Checklist C5 — Trazabilidad

- [x] `specs/mobile-pairing-pingo-canvas-fidelity/traceability.md` existe y no tiene filas "pendiente". La única mención de "pendiente" es la regla de su L26.
- [x] Cada requisito tiene su test y su commit registrados. 14 filas; los 32 hashes únicos de `traceability.md` existen como commit.
- [ ] Los commits siguen `feat(<scope>): <desc> (R1,R2)`. No se cumple del todo: de 41 commits first-parent entre H0 y HEAD, 10 no llevan `(R<n>)`: nueve `docs` (`22aff2e9`, `847cff9d`, `bf7af15e`, `db4b8841`, `3082ff68`, `863da0dc`, `4fb7fd9a`, `1cc2a08f`, `d99797e2`) y el merge `ec882bae`. La exención de `docs` y `chore` la introduce `d99797e2` dentro de la rama, sin firma humana. Ver M-2.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` tiene `status: approved` en el frontmatter (L3).
- [x] La casilla "Aprobado por humano" está marcada con fecha 2026-10-19 (L119); E1 marcada (L127).
- [ ] Ningún requisito se modificó tras la aprobación sin pasar por el gate. No se cumple: `4fb7fd9a` (propuesta de E1) cambió `requirements.md` L101 (Supuestos, fuera de E1). Antes: "...son literales y se declaran como múltiplos de la duración real del movimiento." Después: "...son literales y salen de la duración real del movimiento. R3 mide el reinicio del ciclo en 2401 ms, no en 2400 ms (E1)." La firma `1cc2a08f` cubre el frontmatter y la casilla E1, no ese párrafo. Supuestos no es un R-id; la decisión es humana (B-5). H1–H3 (L128-130) siguen sin marcar.

## Checklist C7 — Ninguna feature deja código huérfano

- [x] El componente reemplazado se eliminó en el mismo cierre. La feature sustituye el `PingRing` local de `welcome`: `function PingRing` solo existe ya en `mobile-pet-tracker/src/components/ping-ring.tsx:14`. `welcome/index.tsx` importa el compartido (L21) y lo usa en L90 dentro de `[0, 1, 2].map` (`welcome-ring-${index}`): el map se conserva, con el componente compartido.
- [x] Los tests del código eliminado también se eliminaron. Ningún fichero de test se borró entre H0 y HEAD; `welcome/index.test.tsx` no cambia.
- [x] Sin importadores del módulo reemplazado fuera de su archivo. El `PingRing` local no estaba exportado; los importadores de `ping-ring` son `welcome` (L21) y `pairing` (L26), esperados.

## Checklist C8 — UI móvil conforme a la carta (la feature toca `mobile-pet-tracker/`)

- [x] Grep-clean en los ficheros de la feature: 0 hex, 0 clases `[...]`, 0 `StyleSheet.create`, 0 shadow/elevation en `pairing/index.tsx`; `ping-ring.tsx` sin hex, color ni var. Alcance: ficheros de la feature, no el repo entero.
- [x] Safe areas: `useSafeAreaInsets` importado (`pairing/index.tsx` L16) y llamado (L82); `paddingBottom: insets.bottom + 24` (L266). El top lo cubre la cabecera nativa (`docs/conventions.md` L628-629). El margen lateral 20 es la excepción de fidelidad (M-4).
- [x] Skeleton dimensionado en los estados de carga (`pairing/index.tsx` L287, L291, L295, L441); sin Spinner.
- [x] Componentes compartidos: `PingRing` compartido entre pairing y welcome; Card, PetSwitcher, Celebration y PingoFloat reutilizados; sin forks locales.
- [x] Tappables con feedback pressed y touch target de 44pt o más: Button de heroui-native con `scale-highlight` por defecto; submit `h-14` (56pt, L383; `ui-guidelines.md:611`); device-unpair `min-h-11` (44pt, L474). `pairing-retry` tamaño md = 48pt, inferido: la unidad `--spacing` de 4pt viene de convención y no se leyó literal en uniwind. Límite declarado.
- [x] Animaciones: `ping-ring.tsx` usa `useAnimatedStyle` con solo `opacity` y `transform: [{ scale }]` (L30-33), `cancelAnimation` en cleanup (L24-27), sin Color ni var. Reanimated 4.5.1 y expo ~57.0.14 ya estaban en H0; `package.json` y `bun.lock` no cambian entre H0 y HEAD. La caja menciona Expo Go; la comprobación en dispositivo es un build de desarrollo Android (H1), no se hace aquí.

## Observaciones

### Críticos y altos (bloquean el cierre)

**CRITICO-1 — C4 cajas 2, 3 y 5 (R9, R11, R14): nacen verdes sin vía declarada.** R9 `e5716f2f` NV (81/81 pasan). R11 `68fb1458` NV, refactor `c0387881` (33/33). R14 `f820d669` NV (88/88). La spec dice "puede nacer verde: anotarlo como NV" (`tasks.md` L83, L97, L107) y no elige vía (a) ni (b). Decisión humana, una de dos: (1) excepción firmada por requisito con la evidencia de M1 (R9), M2 (R11) y M5 (R14), con precedente en `CHECKPOINTS.md` L64-66; o (2) enmienda de la spec que declare la vía (b) con esa evidencia. No se reescribe la historia.

**ALTO-2 — C4 cajas 3 y 5 (R12): mutación no versionada.** `94cea37c` nace verde (cinco suites, 243/243). La mutación `className="w-[3px]"` se aplicó y revirtió antes del commit, sin versionar (impl L107 y L227). `tasks.md` L101 prescribe ese flujo y contradice C4 caja 5. Decisión humana: excepción firmada con M3 y M4, o enmienda de `tasks.md` L101.

**ALTO-3 — C4 caja 4 (R6): rojo inválido.** `76bc928b` falla porque `findAllByType` no existe en RNTL 14 (impl L228). El rojo válido es `150dcf8d` ("query title order with supported RNTL API") y el verde `598af73d`. Decisión humana: aceptar `150dcf8d` como rojo válido de R6 (impl L238). El handoff no incluía mutación de R6.

### Medios

**M-2 — C5 caja 3: convención de commits.** Diez commits sin `(R<n>)`: nueve `docs` más el merge `ec882bae`. La exención de `docs` y `chore` (`docs/conventions.md` §Commits, L353-369) la introdujo `d99797e2` dentro de la rama, sin firma humana. El impl report (L232) cita ocho; falta `d99797e2`. El merge no está cubierto por la convención. Decisión humana: confirmar la convención o corregirla. No se reescriben hashes, porque cambiarían la trazabilidad.

**M-3 — C4 caja 2: suites rojas en commits de implementación.** `bb598dbf` (R3): 1 failed, 150 passed de 151 (impl L43). `bcebe008` (R7): 2 failed, 252 passed de 254 (impl L53). `53e9af61` (R2): 1 failed, 253 passed de 254 tras la excepción 3 (impl L54). El verde llega en commits posteriores (R3 en `9f831ea3`, R7 en `0c717e29`). Es hallazgo histórico. Decisión por defecto del leader: conservar `bb598dbf` y `bf7af15e`, porque reescribir rompería los hashes de la trazabilidad.

**M-4 — excepciones 1–5 del handoff sin firma humana.** Las autorizó el leader sin firma humana. Excepciones 1 y 2 en `e2194c67`: padding de `#95 R6` en `index.test.tsx`, y guarda design-drift de `padding: 24` a paddingHorizontal 20 + paddingVertical 24. Excepción 3 en `53e9af61`: selector R2 `ring-[01]` pasa a `ring-0|ring-1` (`index.test.tsx:1096`). Excepción 4 en `0c717e29`: cabecera `#188 R1-R14` (`index.test.tsx:1060`). Excepción 5 en `c0e2c93a`: `getAnimatedStyle` desde el entry público de reanimated (`index.test.tsx:14`). La excepción nombrada en `docs/conventions.md` está en L635 ("fidelidad al canvas, 2026-10-13", margen lateral 20 en vez de 24). D6 (`requirements.md` L125), aprobada por humano, ya nombra el margen 20, pero la guarda compartida de design-drift sigue sin firma humana. Firmas en impl L243-247.

**MEDIO (nuevo) — drift con origin/main.** `origin/main` = `f32b8d13`, 62 commits por delante de `ec882bae`. Punto de merge `14ec7307` (segundo padre de `ec882bae`). Desde `14ec7307`, main cambió `docs/ui-guidelines.md` (+12), `mobile-pet-tracker/src/__tests__/design-drift.test.ts` (+18) y `mobile-pet-tracker/src/theme/global.css` (+1). Dry-run de merge (`git merge-tree`, base `14ec7307`, sin escribir): "changed in both" en `docs/ui-guidelines.md`, `feature_list.json`, `mobile-pet-tracker/src/__tests__/design-drift.test.ts` y `mobile-pet-tracker/src/theme/global.css`; son cuatro paths con conflicto probable. Es una prueba de conflictos, no un merge real. El veredicto no cubre ese código: antes de `done` hay que mergear main (decide el leader), verificar el drift contra el commit del veredicto y relanzar el reviewer. `origin/main` es la referencia local; no hubo fetch.

### Bajos (no bloquean por sí solos)

**B-1 — `progress/current.md` desactualizado.** Ver C2. Lo actualiza el leader.

**B-2 — ficheros sin trackear en `progress/`.** `init-188-ec882bae.exit`, `init-188.exit` y `mutacion_mobile-pairing-pingo-canvas-fidelity.md`. Los decide el leader; el reviewer no los commitea. Los logs de `progress/` están ignorados por git.

**B-3 — `index.test.tsx:1118` es circular.** `expect(ring0).toHaveAnimatedStyle({ opacity: style.opacity, transform: [{ scale }] }, { shouldMatchAllProps: true })` compara con lo que acaba de leer (t=600 ms). No debilita R3: las cotas de L1114-1117 y L1128-1131 (desigualdades con claves exactas, 2401 ms) lo sostienen. La L1121 (`toHaveAnimatedStyle` a 2400 ms, 1.5/0) es coherente con E1.

**B-4 — `ping-ring.tsx` `useReducedMotion()` (L15) y efecto (L19-28).** Un cambio de reduce motion a mitad de vida no ocurre en producción: el valor es constante por proceso (`node_modules/react-native-reanimated/src/hook/useReducedMotion.ts`). Solo afecta a tests.

**B-5 — Supuestos de `requirements.md` L101.** Ver C6. Firma pendiente en impl L248.

**STATUS.md desactualizado.** L4 "Features completadas: 174/191", L5 "En progreso: ninguna" (contradice `feature_list.json`, donde #188 está `in_progress`), L7 "Pendientes: 17 (... #188 ...)". Lo actualiza el leader.

**Resuelto — lint (M-1).** `progress/lint-188-ec882bae-scope.log`: JSON de eslint sobre 246 ficheros con `errorCount` 0 en todos; `progress/lint-188-ec882bae-scope.stderr.log` vacío. El comando exacto no consta en el log (límite).

**Ruido.** `progress/init-188-ec882bae.log`: 43 bloques `● Console` (warn de Uniwind preexistente); 0 "FAIL"; 0 "SIGKILL", "ELIFECYCLE" o "Failed to run".

## Output de ./init.sh

Extracto de `progress/init-188-ec882bae.log`. Lo corrió el leader; el reviewer no lo ejecutó. `progress/init-188-ec882bae.exit` = `exit=0`, HEAD `ec882bae`.

```
L220    Test Suites: 187 passed, 187 total          (backend)
L221    Tests: 1474 passed, 1474 total              (backend)
L233    Test Suites: 2 passed, 2 total              (infra)
L234    Tests: 14 passed, 14 total                  (infra)
L61764  Test Suites: 126 passed, 126 total          (mobile)
L61765  Tests: 4182 passed, 4182 total              (mobile)
L62086  Test Suites: 3 skipped, 30 passed, 30 of 33 total (e2e)
L62087  Tests: 8 skipped, 468 passed, 476 total          (e2e)
L62103  Lint sin errores
L62107  Typecheck sin errores
L62110  Todo verde. Listo para trabajar.
```

## Mutación (B1–B4, M1–M5)

Comando base, desde `mobile-pet-tracker/` del worktree probe (`/home/claude/sites/Pet-Tracker-wt-188-probe`, HEAD `ec882bae`):
`FORCE_COLOR=0 bun run test --runInBand --runTestsByPath <fichero> -t "<patrón>" > <log> 2>&1; echo exit=$?`

Lo ejecutó Codex. Reporte: `progress/mutacion_mobile-pairing-pingo-canvas-fidelity.md`. Logs: `progress/mutacion_188_<X>.log`. Skills cargadas: ninguna.

Línea base (sin mutar):

| Run | Fichero y `-t` | exit | `Tests:` (log) | Clasificación |
|---|---|---|---|---|
| B1 | `index.test.tsx`, "#188 R9" | 0 | `78 skipped, 10 passed, 88 total` (L268) | VERDE |
| B2 | `pairing-canvas-fidelity.test.ts`, "#188 R11" | 0 | `2 skipped, 1 passed, 3 total` (L8) | VERDE |
| B3 | `pairing-canvas-fidelity.test.ts`, "#188 R12" | 0 | `1 skipped, 2 passed, 3 total` (L8) | VERDE |
| B4 | `index.test.tsx`, "#188 R14" | 0 | `83 skipped, 5 passed, 88 total` (L203) | VERDE |

Mutaciones (cada una aplicada, corrida y revertida):

| Run | Mutación (fichero:línea) | exit | `Tests:` (log) | Filas rojas | Línea de fallo | Clasificación |
|---|---|---|---|---|---|---|
| M1 | R9: `pairing/index.tsx` tras L283 inserta `<Text testID="pairing-subtitle">mutacion R9</Text>` | 1 | `10 failed, 78 skipped, 88 total` (L448) | loading, pets-error, no-pets, linking, paired-loading, paired-tracked, paired-free, paired-unknown, claim-error, ready | `index.test.tsx:1249:87` (toBeNull sobre `pairing-subtitle`) | ROJO POR ASERCIÓN |
| M2 | R11: `pairing/index.tsx:388` `{t('pairing.pairCollar')}` pasa a `Vincular collar` | 1 | `1 failed, 2 skipped, 3 total` (L30) | fila única del candado R11 | `pairing-canvas-fidelity.test.ts:53:21` (`expect(looseCopy).toEqual([])`, diff `+ "Vincular collar"`) | ROJO POR ASERCIÓN |
| M3 | R12 fuente 1: `pairing/index.tsx:270` `items-center justify-center` pasa a `items-center justify-center w-[3px]` | 1 | `1 failed, 1 skipped, 1 passed, 3 total` (L511) | fila `src/screens/pairing/index.tsx` (la fila de `ping-ring` pasa) | `pairing-canvas-fidelity.test.ts:73:22` (`/className="[^"]*\[/`) | ROJO POR ASERCIÓN |
| M4 | R12 fuente 2: `components/ping-ring.tsx:15` añade `const probeColor = '#ff0000';` | 1 | `1 failed, 1 skipped, 1 passed, 3 total` (L62) | fila `src/components/ping-ring.tsx` (la fila de `index.tsx` pasa) | `pairing-canvas-fidelity.test.ts:72:22` (`expect(source).not.toMatch(hexLiteral)`) | ROJO POR ASERCIÓN |
| M5 | R14: `pairing/index.tsx:269` `phase === 'idle' && selectedPet?.device === null ? (` pasa a `phase === 'idle' ? (` (L279 y L350 intactas) | 1 | `4 failed, 83 skipped, 1 passed, 88 total` (L275) | tracked, free, unknown, no-pets (ready pasa) | `index.test.tsx:1292:77` (toBeNull del bucle de testIDs) | ROJO POR ASERCIÓN |

Todas las mutaciones se revirtieron. `git status --short` del probe sale vacío (comprobado 15:55Z). Ninguna corrida es ROJO INVÁLIDO ni NO ROJO. Los detalles por corrida (diff, extracto del bloque de aserción) están en el reporte de Codex; el reviewer verificó en los logs las líneas `Tests:` y las de fallo.

## HEAD validado

- HEAD revisado `ec882bae` en `wt188` y en el probe (15:55Z). Base H0 `6dc51ca1`.
- `git diff --check 6dc51ca1 HEAD`: exit 0.
- Probe: `git status --short` vacío.
- `wt188`: ningún tracked modificado antes de escribir este fichero. Untracked: los tres de B-2. Tras escribir este fichero aparece `M progress/review_188.md`.
- Alcance: 39 ficheros de `mobile-pet-tracker/` entre H0 y HEAD. Los 8 de la feature: `src/__tests__/design-drift.test.ts`, `src/__tests__/pairing-canvas-fidelity.test.ts` (nuevo), `src/components/__tests__/ping-ring.test.tsx` (nuevo), `src/components/ping-ring.tsx` (nuevo), `src/screens/pairing/index.test.tsx`, `src/screens/pairing/index.tsx`, `src/screens/welcome/index.tsx`, `src/theme/global.css`. Ninguno cambia por el merge de main en el sentido de la rama; los conflictos son del dry-run con main.
- Ficheros borrados entre H0 y HEAD: ninguno. Fuera de `mobile-pet-tracker/`, `docs/`, `progress/` y `specs/` solo cambian `STATUS.md` y `feature_list.json`.
- Test-primero por R (commit rojo → verde): R1 `9dc36944`→`af257a8b`; R2 `ef7cd9e3`→`5f24b361`→`53e9af61` (excepción 3); R3 `ebf21c95`→`bb598dbf` (M-3)→`9f831ea3` (E1)→`c0e2c93a` (excepción 5); R4 `6e5bb3f9`→`3d39f276`; R5 `47363b97`→`aa4687b9`; R6 `76bc928b` (rojo inválido)→`150dcf8d`→`598af73d`; R7 `3e0e36cd`→`bcebe008` (M-3)→`0c717e29` (excepción 4); R8 `252e7e29`→`ee3fbc93`; R9 `e5716f2f` (NV); R10 `97f2b146`→`e2194c67` (excepciones 1 y 2); R11 `68fb1458` (NV)→`c0387881`; R12 `94cea37c` (NV); R13 `a479c7f7`→`d9d98844`; R14 `f820d669` (NV).

## Pendientes

Para el humano. Solo él marca las casillas, con su commit de firma; el leader y el reviewer no marcan ninguna. Están en `progress/impl_mobile-pairing-pingo-canvas-fidelity.md` §Firmas humanas pendientes, L238-253, todas `[ ]`:

- L238-242: C4 R6, R9, R11, R12 y R14.
- L243-247: M-4, excepciones 1 a 5.
- L248: B-5, Supuestos de `requirements.md` L101.
- L249: M-2, convención de commits.
- L250: merge con `origin/main` (tres enmiendas de `docs/ui-guidelines.md`: #176 y #186 de main, #188 de la rama) y drift de 62 commits.
- L251-253: H1, H2 y H3 en dispositivo. H1: build de desarrollo Android, anillos de 2400 ms, segundo anillo a 1200 ms, flotado a 3000 ms. H2: «Quitar animaciones» activo. H3: comparación lado a lado con el artboard «Vincular collar (19)». H1–H3 bloquean `done`, no el veredicto.

Para el leader:

- Actualizar `progress/current.md` (C2 caja 3, B-1; el plan está obsoleto).
- Decidir B-2 (ficheros sin trackear).
- Actualizar `STATUS.md` (En progreso y conteos).
- Decidir el merge de `origin/main` (62 commits, cuatro paths con conflicto probable) y el drift.
- Tras firmas, `current.md` y merge: relanzar el reviewer sobre el HEAD nuevo. Este veredicto no vale para otro HEAD.
- Hasta APROBADO no se marca `done` en `feature_list.json`.

## Lo que solo puede cerrar un humano

- Firmas de C4 (R6, R9, R11, R12, R14), excepciones M-4 1 a 5, B-5, M-2, merge de main y H1–H3.
- La PR la mergea el humano; el reviewer no hace push ni merge.

## Veredicto

RECHAZADO. Razón: C4 sin firma humana (R6, R9, R11, R12, R14), M-2 y B-5 pendientes, C2 con `current.md` desactualizado; código y mutación válidos.

Lo que queda bien: init exit 0 (lo corrió el leader), lint limpio, 14 de 14 R-ids con test que los nombra, B1–B4 verdes, M1–M5 rojo por aserción en la línea indicada, alcance limpio, `git diff --check` limpio, ninguna fila pendiente en `traceability.md`.

Lo que bloquea: casillas `[ ]` en C2 (`current.md`), C4 (cajas 2 a 5), C5 (caja 3, M-2) y C6 (caja 3, B-5). `CHECKPOINTS.md` L122-124: el reviewer "rechaza el cierre si queda alguno vacío en C1–C8". No es un defecto de código; la mayoría de estos puntos son decisiones humanas que el reviewer no puede tomar.

## Límites declarados

- No ejecuté `./init.sh` ni jest (denegado al reviewer); el init lo corrió el leader.
- Las mutaciones se verificaron por sus logs (Codex); no las reejecuté. R12 a nivel jest no repetido.
- E2E: 8 tests skipped sin comparar con H0.
- Fidelidad visual, 60 fps y comportamiento en dispositivo no están acreditados por tests: H1–H3.
- Unidad `--spacing` inferida (48pt en `pairing-retry`).
- El comando exacto del lint no consta en su log.
- El dry-run de merge es una prueba de conflictos, no un merge real. `origin/main` es la referencia local; no hubo fetch.
