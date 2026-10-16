# review: mobile-routine-canvas-fidelity (#178)
Fecha: 2026-10-16
Veredicto: APROBADO

Alcance revisado: `git diff 274ff52d HEAD` en `/home/claude/sites/Pet-Tracker-wt-178`
(branch `feature/178-mobile-routine-canvas-fidelity`, HEAD
`e964f4b9f547911001deeb9d98c9f24b4634a54f`, H0 `274ff52d`, árbol limpio antes y
después de mi revisión). Quedan fuera, por indicación del leader, la prueba de humo
R14 (casilla humana sin marcar) y el `status: draft` de `traceability.md`.

La aprobación cubre R1 a R13. R14 sigue abierta y solo la cierra el humano; el
leader no debe marcar #178 como `done` hasta entonces (CLAUDE.md, regla de gates).
Las observaciones de abajo son todas no bloqueantes.

## Resumen de la evidencia

- init.sh no lo corrí (el clasificador lo deniega). Cito el del leader sobre este
  mismo HEAD: `/tmp/178-init.log` (escrito a las 17:26, después del commit de HEAD de
  las 16:54) y `/tmp/178-init.exit` = `exit=0`. Backend 187 suites / 1474 tests;
  segundo paquete 2 suites / 14 tests; móvil 111 suites / 3539 tests; e2e 468
  pasados (3 suites / 8 tests saltados); lint y typecheck sin errores; 0 apariciones
  de `Failed to run`; "Todo verde".
- Reproduje yo, exportando cada commit con `git archive` a `/tmp/rev178-<hash>` y
  corriendo jest `-i` sobre las 11 suites afectadas, los 12 commits rojos y 3 verdes
  (detalle en C4). Todos los fallos son de aserción; ninguna suite con
  `Test suite failed to run` ni `ReferenceError`.
- Reproduje las sondas S1 a S7 del handoff con su propio ejecutor: cada una da
  exactamente un `●`, del `it` esperado, y `limpio=0`.
- Planté 10 mutaciones propias en zonas que las sondas no tocan: 6 cayeron en rojo
  en el `it` esperado y 4 pasaron en verde (observaciones 1 y 2).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`feature_list.json`: solo el id 178).
- [x] `progress/current.md` coherente con el estado (feature `in_progress`, sesión
  abierta), pero no refleja aún el handoff ni la implementación: ver observación 4.

## Checklist C3 — Arquitectura
- [x] Sin cambios en backend ni en `infra`: la lista de ficheros no toca ninguna capa
  de dominio, aplicación o infraestructura. Es una feature de UI móvil.
- [x] Sin lógica de negocio nueva: `notifyAt` de la vista previa es solo presentación
  (`mobile-pet-tracker/src/screens/add-reminder/index.tsx:134`); la lógica de envío no
  cambió.
- [x] Sin dependencias nuevas (`package.json` fuera de la lista de ficheros;
  `reicon-react-native` ya estaba en uso).

## Checklist C4 — TDD
- [x] Cada R1 a R13 tiene un `describe` que lo nombra, y los 13 nombres de
  `traceability.md` existen literalmente (`grep -rlF "describe('<nombre>"`):
  R1 `src/theme/__tests__/global-css.test.ts`; R2 y R13
  `src/__tests__/design-drift.test.ts`; R3
  `src/providers/__tests__/language-provider.test.tsx`; R4 a R9
  `src/screens/reminders/index.test.tsx`; R10 a R12
  `src/screens/add-reminder/index.test.tsx`.
- [x] Historial test-primero. 25 commits `#178 R<n>`, en el orden de `tasks.md`: cada
  rojo `test(mobile): #178 R<n> ...` toca solo tests y precede a su verde
  `feat|docs(...) (#178 R<n>)`, que toca solo producción o docs. R13 (`acde7bee`) y el
  `it` A de R2 nacen verdes por diseño del handoff; su rojo lo demuestran las sondas.
- [x] Rojos reproducidos por mí (fallos, `it` nombrados y recuentos coinciden con
  `progress/impl_mobile-routine-canvas-fidelity.md`):

  | R | commit rojo | fallos | nota |
  |---|---|---|---|
  | R1 | `02b760f2` | 2 | los dos `it` de R1 |
  | R2 | `25c983f3` | 2 | B y C (A nace verde) |
  | R3 | `1176e1c0` | 2 | R3 y #65 R12 (recuento del catálogo) |
  | R4 | `20a16760` | 11 | 4 de R4 más los candados revertidos y agregados |
  | R5 | `cd057c22` | 6 | |
  | R6 | `757eb643` | 17 | R6, #64, #65, #62 R14, #98 R10, #173 R2.4 |
  | R7 | `3485aaa8` | 4 | |
  | R8 | `4af957d1` | 4 | |
  | R9 | `aa0c6a75` | 5 | 3 de R9 más #65 R8 y R18 |
  | R10 | `5a808f72` | 17 | |
  | R11 | `e3a86195` | 9 | |
  | R12 | `2dc68762` | 30 | |

- [x] Excepción declarada del c20: en `f8779f27` (verde de R10) fallan exactamente
  `opens the date picker and reflects the selected date` y
  `opens the time picker with 09:00 and reflects a new time` (2 failed / 489 passed).
  Cierran en verde en `03ff8a52` (verde de R11): 377 tests pasados en 8 suites
  afectadas. Ningún otro rojo se coló.
- [x] Verdes intermedios `2d3b6a78` (R6) y `30dd2a5e` (R12): 11 suites / 475 y 504
  tests, todo verde.
- [x] Candados no tautológicos. Los literales de clase, tamaño y color se aseveran
  con cadena completa (`toBe`) y el color por el espía `color:<token>`, no contra
  símbolos de producción. `category-palette.test.ts` compara `Icon` contra el
  componente importado de `reicon-react-native`, no de producción. Fechas con cruce de
  mes y año (`1 ene 2027`, `29 dic`). Zona fijada con
  `process.getBuiltinModule('process').env.TZ`. Los `fireEvent` llevan `await`.
- [x] Sondas del handoff, reproducidas (todas `limpio=0`):

  | Sonda | Resultado | `it` en rojo |
  |---|---|---|
  | S1 | 1 failed / 89 skipped / 7 passed | R13 sin emoji |
  | S2 | 1 failed / 89 skipped / 7 passed | R13 import exacto de reicon |
  | S3 | 1 failed / 89 skipped / 7 passed | R13 sin Card |
  | S4 | 1 failed / 89 skipped / 7 passed | R13 orden de la vista previa |
  | S5 | 1 failed / 89 skipped / 7 passed | R13 radios solo en Recordatorios |
  | S6 | 1 failed / 94 skipped / 2 passed | R2 A |
  | S7 | 1 failed / 94 skipped / 2 passed | R2 A |

- [x] Mutaciones propias que cayeron en rojo en el `it` esperado (todas restauradas
  con `git checkout HEAD --`, `limpio=0`):
  M2 quitar `hourCycle: 'h23'` de la fila (3 failed, R6 y `R6` de lista);
  M3 `index={0}` fijo en `HomeEntrance` (1 failed, R7);
  M4 `notifyAt` suma en vez de restar (3 failed, R12);
  M5 vista previa sin `h23` (6 failed, R12);
  M6 chip de tipo inactivo `px-3` (2 failed, R10);
  M7 `_layout.tsx` vuelve a titular `reminders` (1 failed, `#114 R4`).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" de R1 a R13. La fila de R14 dice
  "pendiente (humano)": fuera de alcance por indicación del leader, la cierra la
  casilla humana de `requirements.md` §R14 (sigue sin marcar, como debe).
- [x] Los 25 hashes citados (rojo y verde de R1 a R12 y `acde7bee` de R13) existen en
  la branch y coinciden con `git log 274ff52d..HEAD`.
- [x] Commits con formato: rojos `test(mobile): #178 R<n> <desc>`, verdes
  `feat|docs(<scope>): <desc> (#178 R<n>)`. Hay además commits de harness
  (`751c3ad2`, `502b270b`, `33a036c9`) por incidencias del handoff, y dos informes de
  implementación (`fc41d00d`, `e964f4b9`).
- [x] Lista cerrada de ficheros: los 22 de K5 más `progress/handoff_*` (harness); sin
  ficheros ajenos (`git diff --no-renames --name-only 274ff52d HEAD`).

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-routine-canvas-fidelity/requirements.md`: `status: approved`,
  `- [x] Aprobado por humano (fecha: 2026-10-15)`. `requirements.md` no cambió desde
  H0. La casilla de R14 sigue `- [ ]` (línea 779).

## Checklist C7 — Sin código huérfano
- [x] `REMINDER_TYPE_META.emoji` eliminado y sin consumidores: `grep -rn "\.emoji\|emoji:"
  src` (sin tests) vacío. Consumidores restantes de `REMINDER_TYPE_META`
  (`home/index.tsx:231` y `:802`) usan solo `.category`, intacto.
- [x] `Card` retirado de `reminders/index.tsx` (sin `components/card'` en las dos
  pantallas); `components/card.tsx` sigue con otros consumidores (Perfil).
- [x] Tests de los comportamientos reemplazados eliminados o reescritos conforme a
  §Deltas de candados de la spec: `it('no duplica la acción de crear')` (B27) borrado y
  sustituido por R9; el resto cambió de valor con comentario `#178 Rn`.
- [ ] N/A: no aplica, esta feature sí reemplaza cosas y las dejó limpias.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Enmienda de la carta con las dos inserciones prescritas, idénticas a las citas
  de `requirements.md:273` y `:279`: radios 14/16/22 en §12 y "Chip seleccionado" en
  §13. Candado en `design-drift.test.ts` (R2 A/B/C).
- [x] Sin hex sueltos ni `expo-linear-gradient`; colores por `useThemeColors` y tokens;
  `HomeEntrance` y `PopIn` reutilizan el reduce motion existente; título con
  `accessibilityRole="header"`; cabecera nativa con `title: ''`.
- [x] Copy por clave: `reminders.dueAt` y `addReminder.notifyPreview` en `es` y `en`
  (`mobile-pet-tracker/src/i18n/catalog.ts`, mismos marcadores
  `{{date}}`/`{{time}}`), registrados en `specs/mobile-ui-language/design.md` §2.32 y en
  `R8_REMINDERS`; los agregados #65 R8/R18 pasan; `reminders.reminders` y
  `addReminder.addReminder` pasan de `_layout.tsx` a su pantalla.
- [x] Fidelidad al canvas contrastada literal a literal contra los ficheros: tokens
  `--radius-14/16/22` tras `--radius-24` en `global.css`; chips de aviso `h-9.5` (38);
  campos `h-13` (52); `hourCycle: 'h23'` en fila y formulario (`09:00`); vista previa
  `Te aviso el … a las ….` entre Aviso y Guardar; iconos reicon sin emoji en las tres
  pantallas y metadatos.

## Observaciones

1. (no bloqueante) Hay recetas de la spec sin candado automático. La spec no las
   incluye en sus listas de `Test`, y P19 remite una al humo, así que el implementer
   cumplió lo pedido; lo señalo para que el leader decida si las cubre R14 o una
   enmienda. Mutaciones propias que pasan en verde:
   - M1 `flex-3` a `flex-1` en la columna de fecha
     (`src/screens/add-reminder/index.tsx:209`): 60 passed, 60 total. Tampoco hay
     candado de `flex-row gap-2.5` (`:208`) ni de `flex-2` (`:228`). Es el punto 2 de
     R11 y la fila P19.
   - M8 intercambiar la tinta violeta por la verde en `categoryInk`
     (`src/screens/reminders/index.tsx:58-60`): 57 passed. Los fixtures de R6 solo
     cubren los huecos azul, ámbar y neutro; verde, violeta y rosa quedan sin candado
     de tinta de icono.
   - M9 quitar `justify-between` de la fila superior
     (`src/screens/reminders/index.tsx:323`): 57 passed. Es lo que empuja el badge a
     la derecha.
   - M10 `gap-1` a `gap-2` en la fila de meta (`:341`): 57 passed.
2. (no bloqueante) `Nuevo` mide `h-10` (40 dp) sin `hitSlop`
   (`src/screens/reminders/index.tsx:165`), por debajo del "touch target >= 44pt" de
   `docs/ui-guidelines.md:243`. Lo prescribe R4 (píxel exacto del artboard), pero ni la
   spec ni la enmienda R2 documentan la excepción como sí hizo #174 para el ack de
   Alertas (34 + 12 = 46 con `TOUCH_SLOP`). No pude verificar si el `Button` de heroui
   añade su propia zona táctil; conviene mirarlo en la prueba de humo R14.
3. (no bloqueante) La rama `status: draft` de `traceability.md` y la casilla R14 son
   lo esperado según el leader; no las computo.
4. (no bloqueante) `progress/current.md` termina en "Reanudación 2026-10-15" y no
   registra el handoff a Codex, la implementación ni este veredicto. Lo actualiza el
   leader al cerrar.
5. (no bloqueante, cosmético) Restos de redacción en tests:
   - `src/screens/reminders/index.test.tsx:899` conserva el título `'mantiene emoji y
     etiqueta junto a superficies distintas'` cuando ya no hay emoji.
   - `:741` quedó con 4 espacios de sangría dentro de un bloque de 6.
   - El fichero termina con una línea en blanco antes del `});` final.
   - `src/__tests__/ui-language.test.ts:176` sigue diciendo "las 49 ocurrencias" y el
     `toHaveLength` del `:177` tiene los comentarios desordenados (el recuento real es
     53).

## Lo que NO pude verificar

- La prueba de humo R14 en dev build de Android (casilla sin marcar, fuera de alcance).
- Que Hermes resuelva `hourCycle: 'h23'` como en Node: la spec lo delega a R14. En
  jest corre sobre ICU de Node.
- La fidelidad visual contra el artboard (proporción `flex-3/flex-2`, sombras, tipografía
  real); solo contrasté literales de código.
- `./init.sh` completo: no lo corrí; cito el log del leader. Tampoco reproduje por mi
  cuenta los verdes intermedios de R1 a R5, R7 a R10 ni el K1/K2 (recuentos de `it` y
  suelo de 1332 del handoff) de forma independiente; los cubre el verde global de HEAD
  (3539 tests móviles).
- Que el rojo de R13 se demuestre fuera de las siete sondas S1 a S7 más mis cuatro
  mutaciones de zona ciega: R13 nace verde por diseño.

## Output de ./init.sh

No ejecutado por mí (denegado por el clasificador). Log del leader sobre este HEAD,
`/tmp/178-init.log` (`/tmp/178-init.exit` = `exit=0`):

```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 111 passed, 111 total
Tests:       3539 passed, 3539 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
Tests e2e pasados
Lint sin errores
Typecheck sin errores
Todo verde. Listo para trabajar.
```

## Ronda de fusión con main (#183 y #179)

Fecha: 2026-10-16
Veredicto de la ronda: **APROBADO**
Alcance: solo la fusión `0e86587b` (padres `6603ff6d` y `91af2d9f`) y la nota de Codex en `60d030c2`. No se revisan de
nuevo R1 a R13 (aprobados en `6950f20a`) ni R14 (firma humana `ecb51395`). HEAD revisado:
`60d030c2ec1bf7b75f8f7935e1387d54e11753cd`, árbol limpio al empezar y al acabar.

### Comprobaciones pedidas

1. **Padres, sin rebase: cumple.** `git rev-parse 0e86587b^1 0e86587b^2` devuelve
   `6603ff6d89f412c65a531698554ff35ee5b85d8b` y `91af2d9f9101ca9c99e43852b859255b8db565b2`.
   `ecb51395` sigue siendo ancestro de HEAD.
2. **Cero marcadores: cumple.** `git grep -nE '^(<<<<<<<|=======$|>>>>>>>)' -- . ':!progress'` sale vacío (exit 1).
3. **Los nueve ficheros, leídos contra ambos padres: cumple.** Método: para cada uno, `git diff 6603ff6d 0e86587b` debe
   traer solo lo de main y `git diff 91af2d9f 0e86587b` solo lo de #178; y comparé los deltas normalizados
   (`base..6603` contra `main..merge`, y `base..main` contra `6603..merge`).
   - `theme/global.css`: `--radius-14` queda **una vez** (línea 20; las dos ramas lo añadían), `--radius-16` (21),
     `--radius-22` (22) y `--text-22` (30). Sin duplicados.
   - `theme/__tests__/global-css.test.ts`: describes `#178 R1`, `#179 R1` y `#175 R1`, cada uno idéntico a su padre.
   - `language-provider.test.tsx`: `+ 2 // #178 R3`, `+ 5 // #179 R3`, `- 2 // #179 R5`, `+ 9, // #183 R1`, coma solo en la
     última; los describes `#178 R3`, `#179 R3` y `#183 R1` presentes. Única diferencia contra los deltas puros: la coma.
   - `consistency-classnames.test.ts`: reconstruí las cuatro sumas a mano. `directUses`: `-7 + 1 + 1 + 2` (#179) `+ 2`
     (#178); `CONTINUOUS_CORNER`: `-7 + 1 + 1 + 2 + 2`; `bg-accent-soft` y `accentSoftCount`: 4 restas base + 3 de #178 +
     3 de #179 = 10; `border-black/25`: `+1` (#178) `+1 -1` (#179). `reminders.match(/bg-accent-soft/g)` queda `toBeNull()`;
     `rounded-xl bg-accent`, `border-b-4` y la fila de `lip-gray` vienen de #179 sin cambio. Entradas de tabla
     `reminders 4 + 1`, `add-reminder 3 + 1`, `meal-schedule 1 + 1`, `meals-history 1 + 2` todas presentes.
   - `alerts-canvas-fidelity.test.ts`: `tracking-title` = `add-reminder`, `alerts`, `docs`, `meal-schedule`,
     `meals-history`, `reminders` (orden alfabético); el resto de inventarios, de #179, intactos.
   - `ui-language.test.ts`: títulos de main y recuento de #178 (`50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1`), más las líneas de
     #183 (`R1_AUTH`, `R11_RESET`, `+ 1 // #183 R2`) y #179 (`R6_FOOD`).
   - `design-drift.test.ts`: los cuatro describes completos, cada uno idéntico a su padre. Cuenta de `it` por fichero
     (`main + ours - base`) coincide en los seis ficheros de test conflictivos (97 en design-drift, 31 en language-provider,
     43 en global-css, 28, 37 y 14 en los demás). La **única** diferencia respecto de una unión pura es el bloque de
     radios (punto 4).
   - `docs/ui-guidelines.md`: las dos líneas «Fuera de la escala» (#178 y luego #179) y las dos recetas de botón («Chip
     seleccionado» y luego «Secundarios de Horario»), ambas antes de «Sin labio»; los tamaños `--text-17` y `--text-22` de main.
   - `specs/mobile-ui-language/design.md`: `§2.32` (#183), `§2.33` (#179), `§2.34` (#178), este último con sus dos filas
     de copy intactas. La casilla de la plantilla (`:1478`) sigue sin marcar. Sin referencias a `§2.32` de #178 en
     `src/` ni en `specs/mobile-routine-canvas-fidelity/`.
   - Ficheros que se fusionaron solos (`catalog.ts`, `_layout.tsx`, `layout.test.tsx`, `ui-copy-table.ts`, `profile-canvas-fidelity.test.ts`):
     delta contra cada padre idéntico al delta del otro; sin duplicados. Los ficheros de producción que #178 no toca
     (`forgot`, `login`, `register`, `reset-password`, `meal-schedule`, `meals-history`, `account-rules.ts`, `month-grid.ts`)
     son byte a byte los de `91af2d9f`.
4. **Desviación del candado de radios (`#178 R13`): correcta, y el candado sigue mordiendo.**
   `src/__tests__/design-drift.test.ts:1099-1115` ya no prohíbe `rounded-14` fuera de Recordatorios: exige
   `rounded-16|22` en `[]` y `rounded-14` fuera de Recordatorios **exactamente** `meal-schedule` y `meals-history`. Es la
   única forma de conservar el candado sin tocar la spec, porque main usa `rounded-14` (mismo token) en esas dos pantallas, y
   no afloja nada más (los conteos exactos dentro de Recordatorios, `1/3/1`, no cambian). Mutaciones propias, una a una,
   cada una revertida con `git checkout HEAD --` (`git status` limpio y `diff --cached` vacío al acabar); todas ponen en rojo
   `#178 R13 › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` y nada más:
   - M1 `rounded-14` en `add-reminder/index.tsx` (tercer fichero) → rojo.
   - M2 `rounded-16` en `meal-schedule/index.tsx` → rojo.
   - M3 `rounded-22` en `meals-history/index.tsx` → rojo.
   - M4 segundo `rounded-14` dentro de `reminders/index.tsx` → rojo.
   - M5 `rounded-14` en `home/index.tsx` → rojo.
   - M6 `meal-schedule` pierde sus `rounded-14` (`sed` a `rounded-xl`) → rojo (la lista fuera de Recordatorios se acorta).
   - M7 `rounded-14` en un `.ts` no `.tsx` (`utils/reminder-meta.ts`) → rojo.
   Línea base sin mutar: 1 passed. Mutaciones sobre los agregados fusionados: M8 `bg-accent-soft` colado en
   `reminders/index.tsx` → rojos `#64 R9` y `#98 R10` de consistency-classnames; M9 `tracking-title` en `login/index.tsx`
   → rojo `#174 R12 › limita tracking-title a su inventario de producción`.
5. **Lista cerrada M6: cumple.** `git diff --name-only 91af2d9f 0e86587b` menos los dos ficheros del handoff de fusión =
   `git diff --name-only 58bf412c ecb51395`, 29 ficheros, `diff` vacío. Y el conjunto de ficheros de `src/` que el merge
   cambia respecto de su primer padre es **exactamente** el que main cambia respecto de la base (22 rutas, incluidos
   tests): no entra ni sale nada de producción que no venga de main.

### Evidencia de ejecución

- No corrí `./init.sh`. Leí `/tmp/178-init.log` (escrito a las 19:24, posterior a `60d030c2`): exit 0, móvil 112 suites /
  3717 tests, backend 187 / 1474, infra 2 / 14, e2e 30 de 33 (3 skipped), lint y typecheck verdes; los 40 `●` son todos
  `Console`. Cifras que coinciden con las de la nota de Codex (M4c) y con las del handoff.
- Por mi cuenta, sin otro jest ni `router.d.ts` presentes, `-i --testTimeout=30000`:
  `design-drift`, `consistency-classnames`, `ui-language`, `language-provider`, `global-css`, `alerts-canvas-fidelity` →
  6 suites, **348 tests**, exit 0, sin `●`. Pantallas `reminders`, `add-reminder`, `meal-schedule`, `meals-history`, `login` y
  `category-palette` → 6 suites, **288 tests**, exit 0. `bun run typecheck` → exit 0.
- Ninguna comprobación se apoyó en el informe de Codex: todo lo anterior sale de `git show`/`git diff` y de mis corridas.

### Hallazgos bloqueantes

Ninguno.

### Observaciones (no bloqueantes)

1. **La desviación de R13 aún no consta donde el handoff dice.** El handoff (§M2) la da por «registrada en
   `traceability.md` y en la PR». `specs/mobile-routine-canvas-fidelity/traceability.md` no menciona `rounded-14` compartido
   ni la fusión, y `requirements.md:741-742` sigue diciendo «ninguno en otro fichero de `src/`», que el test ya no cumple a
   la letra. Es del leader (los ficheros de spec no los toca ni Codex ni yo): apuntarlo en `traceability.md` y en la
   descripción de la PR antes de abrirla.
2. **Fila R14 de `traceability.md:24` sigue en «pendiente (humano)»** pese a la firma `ecb51395`. La regla de C5 («ninguna
   fila pendiente») se cumple al cerrar, no en esta ronda; lo actualiza el leader con el cierre.
3. **El título de `ui-language.test.ts:176` dice «51» y el recuento de la línea 177 suma 53.** Ya venía descuadrado de main
   (la expresión de main sumaba 50 con título 51) y del veredicto anterior (obs. 5, título 49 con suma 53); es decorativo,
   no afirma nada. Si el leader quiere limpiarlo, es una línea.
4. **Acople deliberado entre #178 R13 y los ficheros de #179.** `design-drift.test.ts:1111-1114` nombra `meal-schedule` y
   `meals-history`: si #179 deja de usar `rounded-14` (o una feature futura lo usa en un tercer fichero) el rojo caerá en
   el candado de #178. Es el efecto buscado y el mensaje de fallo muestra la lista real. La comparación es de lista
   ordenada: depende de que `readdirSync` devuelva alfabético (lo hace en Node/libuv); no es un riesgo hoy.
5. **El «Desviaciones: ninguna» de la nota de Codex** es literal respecto del script, pero la edición de R13 sí es una
   desviación de la spec de #178 (prescrita por el leader). Se cubre con la obs. 1.

### Veredicto

La fusión es una unión sin pérdida ni duplicación de las aserciones de #178, #179 y #183; el único cambio semántico es el
candado de radios, correcto y con dientes. **APROBADO** para la ronda de fusión. El veredicto de la implementación
(R1 a R13, `6950f20a`) y la firma R14 (`ecb51395`) no se alteran.
