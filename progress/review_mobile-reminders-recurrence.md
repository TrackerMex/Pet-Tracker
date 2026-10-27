# review: mobile-reminders-recurrence (#213)
Fecha: 2026-10-27
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-213, branch feature/213-mobile-reminders-recurrence, HEAD 44644e48 (verificado con `git rev-parse --short HEAD`)
Trabajo: `git log --first-parent 08943a1b..44644e48`, 56 commits.
- Del leader: 3d31232f (E1), 69645400 (E2), 38c742c5 (handoff de merge) y e007b9c9 (adenda).
- Merge c7993706 de origin/dev 73922b10 (#208). Base común 0c37e77a.
- Diff de la feature: `git diff 73922b10 44644e48`.

Veredicto: RECHAZADO

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `grep -c '"in_progress"' feature_list.json` da 0. #213 pasa de `pending` a `spec_ready`, que es el único cambio de `feature_list.json` en el diff. El leader lo cierra.
- [x] `progress/current.md` es la plantilla vacía, que C2 admite.
- [x] init.sh está verde sobre 44644e48, con `exit=0` (ver la última sección).

## Checklist C3 — Arquitectura
- [x] Las capas móviles se respetan.
  - La red va por `api/reminders.ts` (`createReminder` con campos opcionales y `cancelReminderSeries` por PATCH), con los tipos en `api/types.ts`.
  - Las pantallas dependen de los clientes de `api/` y no llaman a `fetch`.
  - El enrutado del push está en `hooks/use-push-registration.ts`.
- [x] Fuera de la app no cambia nada. `git diff --stat 73922b10 44644e48 -- backend-pet-tracker infra init.sh mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` sale vacío.

## Checklist C4 — TDD
- [x] Cada R1–R22 tiene al menos un test cuyo título nombra `#213 R<n>` (ver `traceability.md`). Los `it` enmendados conservan su nombre y llevan el sufijo ` (enmendado por #213 R16)` o ` (enmendado por #213 R22)`.
- [x] Cada R tiene su commit `test(mobile)` antes de su `feat(mobile)`.
  - Los commits de test no tocan producción.
  - Los de feat tocan tests solo en los adelantos listados en R22 (`c133e605`, `b928aad9`, `489e153b`, `6af4b16f`, `1a3ab37d`, `fb851ca5`) y en los fixtures de R1.
  - Llevan un test extra de arnés R11 (`385c783c`), R12 (`b58af8a9`, por E2), R17 (`4f823ab8`) y R18 (`4649003e`).
- [x] C4(b): los `it` que nacen verdes según tasks.md son R1 (rojo por tsc), R14 negativo, R15 cancelled/sent, R19 y R21 desconocido. Los probé todos con mi propia mutación (sección «Sondas»). Todos detectan su mutación.
- [ ] **R21 no cubre el comportamiento que falla** (ver Observación B1). Los dos `it` de R21 pasan, pero la pantalla bloquea la selección de mascota cuando llega `petId` por la ruta, y ningún test lo detecta.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». R1–R22 llevan test y hash. R19 dice «Sin feat: nace verde por R17 + #218», como permite tasks.md.
- [x] Todos los hashes de `traceability.md` existen en `08943a1b..44644e48`, incluidas las erratas E1 y E2 y los adelantos.
- [x] Los commits siguen la convención de la spec: `test(mobile): #213 … (R<n>)` y luego `feat(mobile): #213 … (R<n>)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`, con firma delegada `cdd0623a` (mandato 2026-10-23, ampliado 2026-10-26).
- [x] Tras el handoff 08943a1b, la spec solo recibe las erratas firmadas E1 (`3d31232f`) y E2 (`69645400`).
- La casilla del smoke en dispositivo sigue `[ ]`. Es del humano: no la exijo ni la marco.

## Checklist C7 — Sin código huérfano
- [x] N/A. La hoja de cancelar serie comparte el único `BottomSheet` de Recordatorios (#218 R3; candado `#213 R17: las dos hojas comparten un solo BottomSheet`). No queda ninguna hoja duplicada.

## Checklist C8 — Carta de UI
- [x] Grep-clean sobre el diff de producción: cero hex, cero `-[…]`, cero `StyleSheet.create`, cero shadow/elevation legacy y cero `#213` sin R.
- [x] Las clases categóricas van solo vía `CATEGORY_SLOTS`. El borde ámbar de R16 sale de `border-category-amber`, que ya inventariaba el candado.
- [x] Los insets salen de `useSafeAreaInsets` (`screens/reminders/index.tsx`).
- [x] Reutiliza `DateField` (con `allowClear` para Hasta), `Button` de heroui, `chunkyLip`, `CONTINUOUS_CORNER`, `TOUCH_SLOP`, `CATEGORY_SLOTS` y los iconos de reicon (`Minus`, `Plus` y `Repeat`, inventariados en `design-drift.test.ts:1074`).
- [x] Touch target ≥ 44pt: los chips de repetición llevan `hitSlop={TOUCH_SLOP}`, y los botones del stepper son `size-11` con `hitSlop={TOUCH_SLOP}`.
- [~] Feedback pressed: falta en los `Pressable` nuevos de add-reminder (ver Observación N1). Es deuda de la spec, con el precedente de #208 y #196 N3.
- [x] Sin animaciones nuevas ni dependencias nuevas.
- [x] El copy sale de `i18n/catalog.ts`: +54 claves por idioma (R22, `language-provider.test.tsx:92`), y el escáner de copy suelta está verde.

## Inventarios y merge con #208
Los cinco conflictos del merge c7993706 son los previstos, todos en tests de inventario:
- `alerts-canvas-fidelity.test.ts`
- `chunky-cta-canvas-fidelity.test.ts`
- `consistency-classnames.test.ts`
- `design-drift.test.ts`
- `providers/__tests__/language-provider.test.tsx`

Se resolvieron por unión. Los sumandos siguen visibles y llevan su comentario de origen.

- `language-provider.test.tsx:91–92`: `+ 26 // #208 R19` y `+ 54, // #213 R22`.
- `alerts-canvas-fidelity.test.ts:208` y `:227`: text-15 conserva add-reminder (#213 R6) y vaccine-create (#208 R21).
- `design-drift.test.ts:1139`: `'screens/add-reminder/index.tsx': 1 + 1, // #213 R6`. Las entradas health y vaccine-create de #208 siguen en el mismo mapa, y text-22 y text-17 conservan las entradas de las dos features (`:1237`).
- `chunky-cta-canvas-fidelity.test.ts`:
  - `:78`: fila `reminders-cancel-series-keep`.
  - `:92` y `:107`: `5 + 2, // #204 R9; #213 R17`.
  - `:173`, `:175`, `:182` y `:190`: text-17, text-foreground, border-lip-gray y rounded-16, con sus sumandos #208 y #213 visibles.
- `consistency-classnames.test.ts`: `:275`, las sumas `+ 1 // #213 R6` (`:343` y `:446`), el inventario neutral `:678` y `border-lip-gray` `:687`.

Contrasté cada delta con la tabla del informe de implementación (§Merge, 19 filas) y con `git diff -U0`. Ninguna aserción de #208 ni de #213 se borra ni se afloja. Las líneas `-` son solo títulos que ganan sufijo y cifras que suman.

Los cambios disjuntos se mezclaron sin conflicto: ui-copy-table, ui-language, tipos, catálogo y profile-canvas. `cb088b2a` añade solo `recurrence: null, recurrenceUntil: null` al fixture de #208 en `screens/vaccine-create/index.test.tsx`, como autoriza la adenda e007b9c9.

Las anclas numéricas de tasks.md cuadran: las de R6, las de R16 (7/5/4/0/0) y las 18 enmiendas de R22. Los tres it.each exentos (#177 R4.1, #177 R4.2 y `#62 R14 %s importa…`) no llevan sufijo.

## Cuentas T0 y encadenadas
- T0 normativo de #213: **5614 tests en 158 suites**. Equivale al T0 de #208 (5548/157) más #218 (+5/+1) y #219 (+61/+0).
- La cadena de Codex suma +159 tests y 0 suites: **5773/158** (`final-test-213.log`, informe §Cadena de commits, «Total reconciliado: 5614 + 159 = 5773»). Cada paso cuadra como el anterior más sus añadidos.
- El merge trae #208 (+90 tests, +2 suites): 5773 + 90 = **5863**, y 158 + 2 = **160**. Cuadra exacto con el informe (§Merge, `test-213-merge.log`) y con el log de init del leader.

## Sondas de mutación del reviewer
Las corrí en un worktree desechable, `git worktree add --detach <scratchpad>/wt-213-probe 44644e48`, con `node_modules` enlazado. Nunca toqué wt-213. Jest corrió como `bunx jest --runTestsByPath <fichero> -t <filtro>`, sin pipe.

| # | Requisito | Mutación | Fichero de test | Resultado | Motivo |
|---|---|---|---|---|---|
| 1 | R21 (bloqueo) | Ninguna en producción. Añado un `it` PROBE: params `{ petId: 'pet-2' }`, espero pet-2 seleccionada, pulso `pet-chip-pet-1` y espero pet-1 seleccionada | `screens/reminders/index.test.tsx` | HEAD: `Tests: 1 failed, 111 skipped, 2 passed, 114 total` | Rojo real: `pet-chip-pet-1` sigue `selected: false`. El efecto de R21 revierte la elección del usuario |
| 1c | R21 (control) | Mismo PROBE, con las deps del efecto sin `selectedPetId`: `[petId, pets.data, selectPet]` | `screens/reminders/index.test.tsx` | `111 skipped, 3 passed` | El PROBE y los dos `it` R21 pasan, lo que confirma la causa |
| 2 | R14 neg. / R15 cancelled-sent | `const recurrence = reminder.recurrence;` sin el guard `inactive` (`screens/reminders/index.tsx:400`) | `screens/reminders/index.test.tsx -t "#213 R1[45]"` | `Tests: 3 failed, 82 skipped, 28 passed, 113 total` | Por aserción: `#213 R14: sin línea de repetición…`, y `#213 R15: … conserva Eliminar` con cancelled y con sent |
| 3 | R19 | Quito `backgroundStyle={{ backgroundColor: surface }}` (`screens/reminders/index.tsx:509`) | `screens/reminders/index.test.tsx -t "#213 R19"` | `Tests: 1 failed, 112 skipped, 113 total` | Por aserción: `#213 R19: la hoja Cancelar serie hereda el fondo surface de #218` |
| 4 | R21 desconocido | Quito `&& pets.data.pets.some(({ id }) => id === petId)` (`screens/reminders/index.tsx:91`) | `screens/reminders/index.test.tsx -t "#213 R21"` | Jest aborta dos veces con `JavaScript heap out of memory`, exit 134 | Lo detecta por bucle de render (la selección desconocida se repone y el efecto la vuelve a pedir), no por aserción. Ver N4 |
| 5 | R1 | Quito `recurrenceUntil: string \| null;` de `Reminder` (`api/types.ts:249`) | `bunx tsc --noEmit` | exit 2, 9 errores | `src/api/__tests__/reminders.test.ts(47,23): error TS2551: Property 'recurrenceUntil' does not exist on type 'Reminder'`. Es el rojo por tsc que prevé tasks.md |

- Revertí cada sonda con `git checkout HEAD -- mobile-pet-tracker/src` y comprobé `git diff --cached` en 0.
- Retiré el worktree con `unlink` del enlace y `git worktree remove`, sin `--force`.
- wt-213 queda limpio: HEAD 44644e48, y `git status --short` muestra solo este informe sin seguimiento.
- Logs en el scratchpad: `probe-r21-lock.log`, `probe-r21-lock-control.log`, `probe-r14r15.log`, `probe-r19.log`, `probe-r21-unknown.log`, `probe-r21-unknown-2.log` y `probe-r1-tsc.log`.

## Observaciones

### Bloqueante
**B1. R21 bloquea la selección de mascota en Recordatorios.**
- **Dónde:** `mobile-pet-tracker/src/screens/reminders/index.tsx:89-92`.
- **Código:**
  ```tsx
  useEffect(() => {
    if (typeof petId === 'string' && petId !== selectedPetId && pets.data?.kind === 'ok'
      && pets.data.pets.some(({ id }) => id === petId)) selectPet(petId);
  }, [petId, pets.data, selectPet, selectedPetId]);
  ```
- **Qué falla:** el efecto depende de `selectedPetId` y lo compara con el parámetro.
  - La pantalla puede abrirse con `petId` en la ruta: desde el toque de un push (R20) o desde un enlace.
  - En ese caso, cada vez que el usuario pulsa otro chip de mascota, cambia `selectedPetId` y el efecto vuelve a correr con `petId !== selectedPetId`, así que llama otra vez a `selectPet(petId)`.
  - El usuario no puede cambiar de mascota mientras el parámetro siga en la ruta.
- **Evidencia:** sondas 1 y 1c.
- **Por qué es un fallo:** design.md (R21) pide seleccionar la mascota del parámetro cuando llega, no fijarla. La pantalla ya permitía elegir mascota antes de #213, y R21 rompe esa elección en el camino que abre R20.
- **Qué hace falta:**
  1. Que el parámetro se aplique una sola vez por valor de `petId`. Por ejemplo, recordar en un `useRef` el último `petId` aplicado, o quitar `selectedPetId` de la condición y de las deps sin dejar de esperar a que `pets.data` cargue.
  2. Un `it` nuevo, `#213 R21: …`, en `screens/reminders/index.test.tsx` junto a los de `:2196–2211`. Debe abrir con `mockSearchParams = { petId: 'pet-2' }`, esperar a pet-2, pulsar `pet-chip-pet-1` (`await fireEvent.press`, como en `:1485–1489`) y esperar que pet-1 quede seleccionada. El commit de test va primero y en rojo, como C4 exige, y después va el fix.
  3. Actualizar `traceability.md` en la fila R21 con los dos hashes nuevos.

### No bloqueantes
**N1. Feedback pressed (C8, deuda de la spec y la carta).** `docs/ui-guidelines.md:277` exige feedback pressed en todo elemento tappable. Estos `Pressable` nuevos no lo tienen, ni con style function ni con `active:`:
- `mobile-pet-tracker/src/screens/add-reminder/index.tsx:336`: los chips `repeat-chip-*`.
- `mobile-pet-tracker/src/screens/add-reminder/index.tsx:357` y `:374`: el menos y el más del stepper.

design.md prescribe la receta literal del stepper sin estado pulsado, y los chips copian `type-chip`. Sigo el precedente de #208 N1 y #196 N3: debe registrarse como deuda para la feature de pulsado.

**N2. Cambios fuera del design.** El `minDate` del campo de fecha pasa de `new Date()` a `new Date(now)` (`add-reminder/index.tsx:305`), y Hasta usa `minDate={localDateToIso(date ?? new Date(now))}` (`:403`). El estado `now` ya existía en la base. design.md no menciona `minDate`. Es coherente con R8 (Hasta no antecede a la fecha) y no afloja ningún candado.

**N3. Sufijo de más.** `__tests__/chunky-cta-canvas-fidelity.test.ts:206`: el it.each `#177 R8.1` gana el sufijo ` (enmendado por #213 R22)`, y no está en la lista cerrada de 18 enmiendas. tasks.md, punto 13, dice que `NEUTRAL_ROWS` alimenta R8.1 «sin más cambios». No afloja nada.

**N4. El rojo de R21 desconocido es por OOM.** El `it` `#213 R21: un petId desconocido deja la primera mascota` detecta su mutación por un bucle de render que agota el heap, no por aserción. Se volverá aserción con el fix de B1 si el efecto deja de reaccionar a `selectedPetId`. Conviene repetir la sonda 4 en la re-revisión.

**N5. Cosmético.**
- Doble línea en blanco en `mobile-pet-tracker/src/api/reminders.ts:161-162`.
- El bloque Aviso que envuelve `{repeat !== 'hour' ? (` (`add-reminder/index.tsx:409`) no está reindentado y deja una línea en blanco suelta antes de `) : null}`.

## Output de ./init.sh (corrido por el leader sobre 44644e48)
Log en `progress/init-213.log`, 136669 líneas. Sus dos últimas líneas son el hash, que coincide con `git rev-parse HEAD`, y el exit. Pego las líneas decisivas:

```
# backend unitarios (líneas 300–303)
Test Suites: 195 passed, 195 total
Tests:       1595 passed, 1595 total
# infra (líneas 313–316)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# node:test del arnés (líneas 537–540 y 586–589)
# tests 28
# pass 28
# fail 0
# tests 5
# pass 5
# fail 0
# móvil (líneas 136246–136249)
Test Suites: 160 passed, 160 total
Tests:       5863 passed, 5863 total
Snapshots:   1 passed, 1 total
Time:        189.74 s
# e2e (líneas 136637–136642)
Test Suites: 3 skipped, 31 passed, 31 of 34 total
Tests:       8 skipped, 580 passed, 588 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
44644e486cc7c751a5441137a4292f9d98947fcc
exit=0
```

- `grep -cE '^FAIL |✕' progress/init-213.log` da 0. No hay rojos ni flakes conocidos.
- El rechazo no viene de init.sh. Viene de B1, un defecto de comportamiento que la suite no cubre.

Veredicto (revisión sobre 44644e48): rechazado

## Re-revisión sobre 494e9651 (2026-10-27)
- Worktree: /home/claude/sites/Pet-Tracker-wt-213, branch feature/213-mobile-reminders-recurrence, HEAD 494e9651 (comprobado con `git rev-parse --short HEAD`).
- Alcance: `git diff --name-only 44644e48 HEAD` da siete ficheros.
  - Del leader, en el handoff 28404225: `c1.patch`, `handoff_…_fix-r21.md` y `requirements.md` (E3).
  - De Codex: los cuatro de la lista cerrada, `screens/reminders/index.test.tsx`, `screens/reminders/index.tsx`, `traceability.md` e `impl_…md`.
- Nada más cambia.

### Checklist
- [x] **B1 cerrado.** El efecto de R21 (`screens/reminders/index.tsx:90-96`) ya no lee `selectedPetId`, ni en la condición ni en las deps `[petId, pets.data, selectPet]`. Aplica el parámetro una vez por valor con `appliedRoutePetIdRef`, como pide E3. Ver sondas 1, 1c y 7.
- [x] **C2.** `grep -c '"in_progress"' feature_list.json` da 0, y `progress/current.md` es la plantilla.
- [x] **C3.** El cambio es local a la pantalla. No toca `api/`, hooks ni providers.
- [x] **C4, test primero.** 839fb5db toca solo `index.test.tsx` y 8efff787 solo `index.tsx`.
  - La producción en 839fb5db es idéntica a la de 44644e48: `git diff --quiet 44644e48 839fb5db -- …/reminders/index.tsx` da 0.
  - La sonda 1c corre el test nuevo contra esa producción y da rojo por aserción. Eso reproduce el rojo de 839fb5db.
  - El test nuevo es byte a byte el parche del leader: el diff de 28404225..839fb5db coincide con `c1.patch`, cuyo `hash-object` es dcd9540e.
- [x] **C4, nombres.** Los tres `it` de R21 nombran `#213 R21`. El tercero lleva el título literal de E3.
- [x] **C5.** `traceability.md` no tiene ninguna fila «pendiente» (`grep -ci pendiente` da 0).
  - La fila R21 conserva 26d54072 y 2dd6966c y añade 839fb5db y 8efff787.
  - Los asuntos coinciden con `git log`. `fix(mobile)` es el asunto que prescribe el handoff (`:81`).
- [x] **C6.** `status: approved`. E3 entra en 28404225 como errata del leader, bajo el mandato delegado. No cambia la intención de R21.
- [x] **C7.** N/A.
- [x] **C8.** El diff de producción no tiene clases, copy ni hex nuevos. `bunx eslint` sobre los dos ficheros da exit 0 con log vacío.
- [x] **N1–N5 sin tocar.** `git diff --stat 44644e48 HEAD -- …/add-reminder …/api …/__tests__` sale vacío. Siguen como deuda. N4 queda resuelta por el fix (ver sonda 4).

### Sondas
- Las sondas se hicieron en el propio wt-213. Las sondas PROBE se añadieron como `it` temporales al final de `describe('#213 R14: series en Recordatorios')`.
- Jest corrió con `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx [-t …]`, sin pipe.
- Cada mutación se revirtió con `git checkout HEAD -- <fichero>`.

| # | Qué | Producción | Resultado |
|---|---|---|---|
| 0 | Fichero entero | HEAD | exit 0, `Tests: 114 passed, 114 total` |
| 1 | Los 3 `it` de R21 más PROBE 1: abrir con `petId: 'pet-2'` y alternar pet-1 → pet-2 → pet-1 | HEAD | exit 0. Todo verde, y la última llamada a `listReminders` es con `'pet-1'` |
| 1c | Lo mismo, como control | `git show 44644e48:…/reminders/index.tsx` (B1) | exit 1, `3 failed, 111 skipped, 5 passed`. Caen, por aserción `"selected": true` esperado: el `it` nuevo de R21, PROBE 1 y PROBE 7 |
| 4 | R21 con petId desconocido (repite N4): quito `&& pets.data.pets.some(({ id }) => id === petId)` (`:92`) | HEAD mutado | exit 1, `1 failed, 116 skipped, 2 passed`. **Rojo por aserción, ya no por OOM**: `not.toContain('pet-missing')` recibe `["pet-missing", "pet-1"]` (`index.test.tsx:2210`) |
| 6 | PROBE 6: el `petId` de la ruta cambia a otro valor en la misma instancia (pet-2 → pet-1 → pet-2, con `rerender`) | HEAD | verde. Cada valor nuevo se aplica |
| 7 | PROBE 7: tras abrir con pet-2 elijo pet-1. Luego `invalidateQueries(petKeys.list())` con datos nuevos («Luna B») | HEAD | verde. pet-1 sigue elegida tras el refetch |
| 7c | Control de 7: quito solo `petId !== appliedRoutePetIdRef.current &&` (`:91`) | HEAD mutado | exit 1, `1 failed, 111 skipped, 7 passed`. **Solo cae PROBE 7**; los tres `it` de R21 siguen verdes (ver N6) |
| 8 | PROBE 8: abro con pet-2 y un refetch quita pet-2 | HEAD | verde. `usePetSelection` cae a pet-1 y desaparece `pet-chip-pet-2` |
| 9 | PROBE 9: las mascotas ya están cargadas cuando llega `petId: 'pet-2'` | HEAD | verde. Se aplica pet-2 |
| 10 | `src/hooks/use-push-registration.test.tsx` (R20) | HEAD | exit 0, `61 passed` |

- Logs en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/`: `rr-head-full.log`, `rr-probes-head.log`, `rr-probe-1c.log`, `rr-probe-4.log`, `rr-probe-7c.log`, `rr-push.log` y `rr-eslint.log`.
- No hubo SIGKILL ni timeout.
- Tras revertir, `git status --short` muestra solo este informe sin seguimiento, `git diff --cached --quiet` da 0 y HEAD sigue en 494e9651.

### Observaciones nuevas (no bloqueantes)
- **N6. Ningún test comprometido cubre la guarda «una vez por valor».**
  - Con la mutación 7c, que quita la comparación con `appliedRoutePetIdRef`, los tres `it` de R21 siguen verdes.
  - Solo mi PROBE 7 la detecta: un refetch de `listPets` con datos nuevos vuelve a imponer el `petId` de la ruta sobre la elección del usuario.
  - Hoy el comportamiento es correcto. E3 solo prescribe el test de cambio de chip. Queda como deuda de candado para R21: un `it` con refetch después de elegir otra mascota.
- **N7. Deriva en design.md.** `specs/mobile-reminders-recurrence/design.md:236-238` (§Push) sigue diciendo «difiere de `selectedPetId`». E3, en requirements.md, la sustituye. Conviene alinear design.md al cerrar.
- **Límite conocido, sin verificar en dispositivo.** Si el mismo valor de `petId` vuelve a llegar sin cambiar en la misma instancia montada, no se reaplica.
  - Los dos caminos de R20 usan `router.push` (`use-push-registration.ts:108` y `:171`), que debería montar una pantalla nueva.
  - Con el código de 44644e48 ese caso tampoco funcionaba, porque la selección quedaba fija.

### init.sh
No lo corro, por instrucción del leader. Este veredicto vale solo si su `./init.sh` sobre 494e9651 sale con `exit=0`, sin `FAIL` ni `✕` y con 5864 tests móviles en 160 suites (informe §Arreglo de B1). Si sale rojo, el veredicto queda anulado.

Veredicto: aprobado
