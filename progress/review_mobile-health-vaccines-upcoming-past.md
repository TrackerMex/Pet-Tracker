# review: mobile-health-vaccines-upcoming-past (#241)
Fecha: 2026-11-04
Veredicto: APROBADO

Branch `feature/241-mobile-health-vaccines-upcoming-past` (worktree `Pet-Tracker-wt-241`), integra en `dev`.
Base del handoff B = `7fe02383`; H0 de producción = `2313669a`; HEAD revisado = `b1a28bc7`.
Implementó Codex CLI; esta revisión es estática (git, grep, lectura). Por orden del leader no corrí
`./init.sh`, ni jest, ni Monitor; el leader corre `./init.sh` tras este veredicto.

Skills cargadas: `expo:expo-overview`, `expo:expo-native-ui`. No cargué `expo:expo-animation` porque
la feature no añade animación: R7 conserva el `delay` de entrada que ya existía, solo lo cuenta por
sección.

## Checklist C2 — Estado coherente
- [x] Como mucho 1 feature in_progress: `feature_list.json` del worktree tiene 0 `in_progress`. #241
  sigue `spec_ready`, igual que el resto de features del plan hasta que cierre su G2.
- [x] `progress/current.md` recoge el plan #239–#241 (sección «Plan de arreglos del segundo smoke»).

## Checklist C3 — Arquitectura
- [x] `utils/vaccine-dates.ts::splitVaccines` es una función pura. Solo usa el tipo `Vaccine` y no
  importa nada de red ni de UI. Copia con `filter` antes de `sort`, así que no muta la entrada; R3 lo
  candea con `[...input]`.
- [x] La pantalla consume el util y `t()`. No hay lógica de partición en el JSX.
- [x] No hay contratos nuevos ni dependencias nuevas.
- [x] N/A backend: el cambio es solo móvil.

## Checklist C4 — TDD
- [x] Los 12 R-ids tienen tests que los nombran: `#241 R1`…`#241 R12` en `it`/`it.each`, y el
  `describe('#241: vacunas próximas y pasadas'` prescrito en `tasks.md`.
- [x] El historial va de rojo a verde:
  - R2: `4e312a3a` y luego `97def26e`.
  - R3: `df70c6f0` y luego `5d46f1b6`.
  - R1 y R11: `9d7e5874`.
  - Siete rojos de pantalla, de R4 a R10: `fe73ae05` `7b3506b7` `99642b5b` `8d0230db` `dd56132d`
    `8c20896c` `b70a43fa`.
  - T-verde: `f3207c10`.
  - R9 vacío: `c67d5531`.
  - R12: rojo `cedba517`, verde `722d4f26`.

  Los commits `test(...)` solo tocan tests y los `feat(...)` solo producción.
- [x] `screens/health/index.tsx` cambia en un único commit (`f3207c10`).
- [x] Los tests no son tautológicos:
  - Los literales de copy y de fecha están escritos a mano (`'Próximas'`, `'Pasadas'`,
    `'Upcoming'`, `'Past'`, la tabla de 9 filas de R2 y la de 8 de R3).
  - Cada `waitFor` espera a un nodo positivo antes de afirmar una ausencia, como el contador
    `vaccines-past-count` = `'2'` o la fila del héroe.
  - `render`, `fireEvent` y `act` llevan `await` (RNTL 14).
  - El orden se compara por testID, no por posición fija de los hijos.
  - R10 sí discrimina entre hora local y UTC: con un «hoy» UTC, las 4 filas cambiarían de sección.
- [x] Sonda de R9 vacío: el reporte da 2 rojos (los dos `it` de R9) con la mutación prescrita
  `{sections ? (`. Después restauró con `git checkout HEAD --` y `git diff --quiet`, que salió 0.
  `git status --short -- mobile-pet-tracker specs` sale vacío.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». La única aparición de la palabra es la
  línea de la regla.
- [x] Los 19 hashes citados existen y son ancestros de HEAD (`git cat-file -e` y
  `git merge-base --is-ancestor`).
- [x] Los mensajes de commit siguen `tipo(mobile): <desc> (R-ids)`, literales de `tasks.md` y del
  handoff. La única excepción es `14627906`, que no estaba en la lista (ver No bloqueantes).

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-health-vaccines-upcoming-past/requirements.md`: `status: approved` y casilla de
  firma delegada `[X]` (commit `2313669a`). La casilla G2 sigue abierta: es del humano y no bloquea
  este veredicto.
- [x] Enmienda a `specs/mobile-health/requirements.md`: `## Enmienda #241` aparece 1 vez y la
  casilla `- [x] Enmienda #241 aprobada por humano` está en la línea 431.

## Checklist C7 — Sin código huérfano
- [x] El `.map` anterior de filas de vacunas pasó entero a `renderVaccineRow`, con el mismo JSX, y no
  queda una copia muerta.
- [x] Los candados antiguos no se borraron: se enmendaron, con sufijo `(enmendado por #241 R12)`.
  R12 cubre los 10 pares.
- [ ] N/A: la feature no reemplaza ningún módulo.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Solo usa tokens y clases de la carta: `text-13`, `tracking-caps`, `text-muted`, `bg-default`,
  `rounded-full`, `TABULAR_NUMS` en el contador y `TOUCH_SLOP`. No hay hex literales, clases
  arbitrarias, `StyleSheet` ni sombras en `index.tsx`, `vaccine-dates.ts` ni `catalog.ts`.
- [x] El conmutador de «Pasadas» tiene `accessibilityRole="button"`,
  `accessibilityState={{ expanded }}`, `hitSlop` y feedback de opacidad al pulsar. La cabecera
  «Próximas» tiene `accessibilityRole="header"`.
- [x] El copy está en es y en: `health.sectionUpcoming` = `Próximas` / `Upcoming` y
  `health.sectionPast` = `Pasadas` / `Past`. Las claves van detrás de `health.createReminderNow`, con
  una invocación `t()` cada una. Las filas de `R5_HEALTH` están en `ui-copy-table.ts` y §2.41 está
  añadido literal en `specs/mobile-ui-language/design.md`.
- [x] Los recuentos de candados enmendados son 6/2/1/1, como pide el handoff:
  `screens/health/index.test.tsx`, `consistency-classnames.test.ts` (`#241 R5`),
  `language-provider.test.tsx` y `ui-language.test.ts` (`#241 R1`).

## Verificación por punto del encargo
1. **Lista cerrada.** `git diff --name-only 7fe02383..HEAD` da 13 ficheros, todos de la lista:
   - 8 de tests: `consistency-classnames.test.ts`, `health-vaccines-upcoming-past.test.ts` (nuevo),
     `ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`,
     `screens/health/index.test.tsx` y `vaccine-dates.test.ts`.
   - 3 de producción: `catalog.ts`, `screens/health/index.tsx` y `vaccine-dates.ts`.
   - 3 de docs: `progress/impl_…md`, `specs/…/traceability.md` y `specs/mobile-ui-language/design.md`.

   `index.tsx` cambia en un solo commit.
2. **C4.** El historial es test-primero. El +2 y `14627906` están en No bloqueantes.
3. **R1–R12.** La producción coincide literal con `design.md`: D1–D8, el bloque Upcoming y el
   bloque Past.
   - `splitVaccines` usa `nextDoseAt > today` para Próximas y `null` o `<= today` para Pasadas.
   - Próximas va en orden ascendente por `nextDoseAt` y Pasadas descendente por
     `nextDoseAt ?? appliedAt`, las dos con desempate por `id`.
   - `pastExpanded` empieza en `false`.
   - Las secciones se omiten cuando están vacías, y la lista vacía conserva el vacío.
4. **Copy es/en.** Correcto (ver C8).
5. **Candados y §2.41.** Los recuentos enmendados son 6/2/1/1 y §2.41 está en `design.md`.
6. **Sondas.** Dieron sus rojos y el árbol quedó limpio.
7. **Logs.**
   - `/tmp/tsc-241.log` y `/tmp/lint-241.log` tienen 0 bytes.
   - `progress/final_…log` cierra con 69 suites y 1787 pasados, 0 fallidos. Los dos `●` son
     `Console`.
   - `progress/t0_…log` da 68 suites y 1746 pasados.
   - `git status` está vacío. Los logs y el `.done` están en gitignore.
8. **HEX_LITERAL.** Producción no tiene ningún `#241` suelto. Sí aparece en tests, pero son
   literales que prescribe la spec (ver No bloqueantes).
9. **Hashes de trazabilidad.** Todos existen en la rama.

## Observaciones

### Bloqueantes
(ninguna)

### No bloqueantes
1. **+2 en todos los recuentos desde R1/R11.** La cabecera del test nuevo que prescribe `design.md`
   importa `./ui-copy-table`, y ese módulo registra su propio
   `describe('#65: la tabla de uso de copy está disponible al runner')`, con 2 `it`, en cada suite
   que lo importa. Ya pasa con otros importadores, como `no-pets-states.test.ts` y
   `ui-language.test.ts`. Es un fallo de cuenta del handoff, no de la implementación: los rojos y
   verdes mantienen su forma, desplazados en +2.
   Para futuros handoffs: sumar los `it` de cada módulo de test que el fichero nuevo importe
   (memoria `cuentas-de-handoff-encadenadas`).
2. **Commit extra `14627906`** (`test(mobile): type the local-date fixture as a tuple (R10)`). Solo
   toca tests. Cambia el `as const` de la tabla de R10 por un genérico de `it.each` con tupla de 5
   `number`, porque tsc fallaba con TS2556 en `new Date(...now)`. No cambia filas, títulos ni
   localizadores, y queda entre el rojo y el verde de R12 sin tocar producción. No estaba en la
   lista de commits del handoff y la trazabilidad lo cita en la fila de R10.
   Para futuros handoffs: `design.md` no debería prescribir `as const` para una tabla que acaba en
   un spread a `new Date`.
3. **`#241` suelto en tests:**
   - `__tests__/health-vaccines-upcoming-past.test.ts:17,19,20,92,93`;
   - `screens/health/index.test.tsx:1723` (el `describe('#241: …')`).

   `HEX_LITERAL` (`design-drift.test.ts:145`) los casaría. Hoy no lo hace porque los guardas solo
   escanean producción: `sourceFiles` excluye `__tests__`, y las listas `featureFiles` de Salud
   (`:586`, `:1194` y `:1309`) solo nombran `screens/health/index.tsx`. Son literales que prescribe
   la spec (el texto de §2.41, la cabecera de la enmienda y el nombre del `describe`), y la corrida
   final pasó con `design-drift.test.ts` dentro. Hay riesgo latente: si un guarda futuro lee
   `screens/health/index.test.tsx` (memoria `guarda-featurefiles-incluye-el-test`), la línea 1723 lo
   pondría rojo.
4. **tsc corrió antes del último commit.** `/tmp/tsc-241.log` es de las 18:01:31 y `722d4f26`
   (R12 verde) es de las 18:02:40. Ese commit solo añade sufijos a títulos de `it`/`describe`
   (cadenas), así que no puede cambiar tipos. Lint (18:02:40) y el jest final (18:02:36, con el
   árbol ya sufijado) sí cubren el estado final. El `./init.sh` del leader lo vuelve a cubrir.
5. **Flakes bajo carga, resueltos con rerun.** El reporte registra la carrera conocida #168 R2
   (memoria `flake-salud-168-r2-carrera`) y timeouts de R7 en las filas `none` y `overdue`, con dos
   Codex corriendo jest a la vez. El rerun aislado dio 10 pasados. Ninguno reprodujo en la corrida
   final.
   Si R7 vuelve a dar timeout en el `./init.sh` del leader con la máquina tranquila, conviene
   registrarlo como deuda de flake, igual que #152 R8 o #200 R10.
6. **Skills de Codex.** Codex cargó `ponytail` y `building-native-ui`. La segunda es el nombre que
   usa el plugin v1.0.2, no el nuestro. Es consistente con la deuda B5 y no tuvo efecto: la UI cumple
   la carta.

## Output de ./init.sh
```
No ejecutado por el reviewer: instrucción explícita del leader para esta revisión ("Do NOT run
./init.sh, jest ... or the Monitor tool. The leader runs ./init.sh after your verdict"), porque dos
sesiones de Codex corren jest en este VPS a la vez (memoria init-sh-reviewer-denegado).

Este veredicto se apoya en los logs del implementer, verificados en disco:
  progress/t0_mobile-health-vaccines-upcoming-past.log    68 suites, 1746 passed, 0 failed
  progress/final_mobile-health-vaccines-upcoming-past.log 69 suites, 1787 passed, 0 failed
  /tmp/tsc-241.log  0 bytes      /tmp/lint-241.log  0 bytes

Condición del veredicto: si el ./init.sh del leader no sale verde (exit 0, medido sin pipe), este
APROBADO queda sin efecto.
```
