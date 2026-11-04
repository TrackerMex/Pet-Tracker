# review: mobile-reminder-swipe-actions (#228)
Fecha: 2026-11-03T21:30Z
Veredicto: APROBADO

Revisado sobre `e42e0568` (HEAD de `feature/228-mobile-reminder-swipe-actions`; `origin` está en el
mismo hash). Diff de Codex: `861e87b2..e42e0568`, 14 commits. Medido solo con `git` y `grep`. Este
reviewer no corrió `jest`, ni las suites, ni `./init.sh`: por instrucción del leader, `./init.sh` lo
corre el leader. Sin su verde esta aprobación no cierra la feature (ver «Output de ./init.sh»).

Criterios revisados: R1–R11 y R13. R12 queda fuera a propósito, porque la casilla G4 está sin marcar.
G2 (smoke en dispositivo) es del humano.

## Checklist C2 — Estado coherente
- [x] Como mucho 1 feature `in_progress`: `feature_list.json` del worktree tiene 0 `in_progress`. #228
      está `spec_ready` (en `origin/dev`, `pending`). El estado lo lleva el leader, y el handoff prohíbe
      a Codex tocarlo.
- [x] `progress/current.md` describe la sesión activa: el plan de arreglos del smoke del 2026-11-03,
      con #226–#228 y #230 asignados a @Backend.

## Checklist C3 — Arquitectura
- [x] `domain` sin imports de `infrastructure`: N/A. Solo cambia una pantalla móvil
      (`screens/reminders/index.tsx`). No hay cambios en el backend ni en capas.
- [x] Contratos en `domain` como interfaces puras: N/A, por el mismo motivo.
- [x] `application` depende de interfaces: N/A, por el mismo motivo.
- [x] `infrastructure` sin lógica de negocio: N/A, por el mismo motivo.
- [x] La pantalla sigue la estructura de `conventions.md` (ruta delgada + `src/screens/`). La
      producción coincide literal con design.md §D2:
  - `import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';` va justo
    después del import de `react-native`.
  - `const row = (…)` lleva `accessible`, `accessibilityActions` y `onAccessibilityAction`.
  - `if (!isOwner) return row;` aparece 1 vez.
  - Rama del dueño: `<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>` envuelve
    `<ReanimatedSwipeable … overshootRight={false} renderRightActions=…>`.
  - El panel es un `Pressable` con `accessibilityElementsHidden`,
    `importantForAccessibility="no-hide-descendants"`, `disabled={deleting}`, opacidad 0,8 al pulsar y
    `swipeable.close(); openAction();`.

## Checklist C4 — TDD
- [x] Cada R-id del alcance tiene al menos un test que lo nombra:
  - en `screens/reminders/index.test.tsx`: R2, R3 (it.each), R4 ×2, R5 (it.each y pendiente), R6, R7,
    R8 y R9;
  - en `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`: R1, R10 (it.each y tokens), R11 y
    R13.
- [x] El historial es test-primero (`git show --stat` por commit):
  - T0 `114f54b0`: solo `index.test.tsx`.
  - Rojos de R1/R10/R11, R2, R3, R4, R5, R6, R8 y R9 (`8bd01469`, `0f4344d3`, `96927b77`, `69f758e7`,
    `37ebaf21`, `7528a9d6`, `b5c90a30`, `cd5d19c7`): cada uno toca un solo fichero de test.
  - `b28b74f6` (feat) es el único commit con producción. Lleva `index.tsx`, los candados enmendados de
    `index.test.tsx` y los 4 guards.
  - R7 `2d9b5ced`: solo test. Nace verde, como prevé la spec.
  - R13: el rojo `85996775` y el verde `a34a7bee` tocan solo tests.
  - `e42e0568`: solo `traceability.md`.
- [x] Los literales están escritos a mano. Lo único importado de producción es `R8_REMINDERS`
      (`./ui-copy-table`) más el catálogo `en`/`es` que R1 contrasta, como prescribe la spec.
- [x] Los candados no son tautológicos:
  - R10 contrasta el artboard (`.dc.html`) con la producción, ambos como literales a mano.
  - R11 cuenta literales en el fuente.
  - R13 lee los ficheros de test por contenido.
- [x] El doble de `ReanimatedSwipeable` es el de tasks.md T0 (4):
  - `jest.mock` sin `{ virtual: true }`;
  - la factory devuelve `{ __esModule: true, default: … }`;
  - `requireActual` se resuelve al pintar, con la bandera `mockRealSwipeable` reiniciada en un
    `afterEach` de nivel superior.
- [x] Todas las consultas del panel usan `HIDDEN`. Los testID del panel sin `HIDDEN` solo aparecen
      como datos de `it.each`, no como consultas, y ninguna consulta del panel usa `toBeVisible`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente» salvo R12. Esa fila dice «pendiente (bloqueado por
      G4)», la excepción prevista por la spec.
- [x] Los 13 hashes citados (T0, R1–R11 y R13) existen y son ancestros de HEAD
      (`git merge-base --is-ancestor`). Los mensajes coinciden con los de la tabla.
- [x] Cada nombre de test citado existe en su fichero.
- [x] Los commits siguen el formato `test(mobile): … (R-ids)` / `feat(mobile): … (R-ids)` con los
      mensajes literales de tasks.md. El último es `docs(spec): #228 traceability`.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-reminder-swipe-actions/requirements.md` tiene `status: approved` y la casilla de
      aprobación marcada con firma delegada (`8fdc938d`). G4 y G2 siguen sin marcar, como corresponde:
      son del humano y Codex no las tocó.

## Checklist C7 — Sin código huérfano
- [x] El componente reemplazado se eliminó. El `<Button variant="danger-soft">` de fila desapareció:
      `variant="danger-soft"` 0, `h-11 rounded-14 px-2.5` 0, `isDisabled=` 0, `<Button` de 9 a 8.
- [x] Sus tests se eliminaron o enmendaron:
  - la tupla `'«Eliminar» de fila'` salió de `routine-canvas-fidelity.test.ts`;
  - los 31 candados que la nombraban están enmendados.
- [ ] N/A: no aplica, esta feature sí reemplaza algo.

## Checklist C8 — UI móvil conforme a la carta
- [x] Grep limpio en las líneas añadidas de producción:
  - 0 hex;
  - 0 clases `[...]`;
  - 0 `StyleSheet.create`;
  - 0 `shadow`/`elevation`;
  - 0 `#228`.
- [x] Dimensiones y safe areas sin tocar.
- [x] Sin estados de carga nuevos.
- [x] Reutiliza `CATEGORY_SLOTS.rose.surface`, `CONTINUOUS_CORNER`, los iconos `Repeat`/`Trash` y
      `ReanimatedSwipeable` de RNGH ~2.32.0, ya instalado. `GestureHandlerRootView` ya está en
      `src/app/_layout.tsx`.
- [x] El panel da feedback al pulsar (opacidad 0,8) y su diana es `w-24` (96 px) a la altura de la
      fila. Para lectores de pantalla, la acción está en la fila (`accessibilityActions`) y el panel
      está oculto.
- [x] La animación es la de `ReanimatedSwipeable`: corre en el hilo de UI y en Expo Go. No añade
      estilos animados propios ni `var(--…)`.

## Verificaciones adicionales
- La lista de ficheros está cerrada: `git diff --name-only 861e87b2..HEAD` da exactamente 8 ficheros,
  todos de la sección «Archivos» del handoff.
  - `git status --short` solo muestra `?? progress/impl_mobile-reminder-swipe-actions.md`, que queda sin
    commitear a propósito.
  - No hay cambios en `package.json`, `bun.lock`, `app.json`, `_layout.tsx`, `i18n/catalog.ts`,
    `ui-copy-table.ts`, `theme/global.css`, `docs/` ni las specs enmendadas.
- No hay copy nuevo: el panel reutiliza `reminders.delete`, `reminders.cancelSeries` y
  `reminders.cancelSeriesA11y`. R1 lo bloquea con las invocaciones 2/1/1.
- El inventario de §Evidencia (columna «después») y el de R11 coinciden medidos por contenido. Por
  ejemplo:
  - `<Button` 8, `<View` 29, `style={CONTINUOUS_CORNER}` 7;
  - `CATEGORY_SLOTS.rose.surface` 4, `testID=` 48, `t('` 56;
  - `rounded-22` 3, `rounded-14` 1, `rounded-16` 7;
  - `size={20} color={danger}` 2.
- Los guards llevan exactamente los deltas de la tabla «Candados de guards y de recuento»:
  - `consistency-classnames`: `4 + 1 + 1 + 1` y `+ 1 // #228 R2` en los dos `it`;
  - `design-drift`: `2 - 1` y `1 + 1 + 1`;
  - `reminders-upcoming-past-canvas-fidelity`: `6 + 1], // #228 R2`;
  - `routine-canvas-fidelity`: sale la tupla.
- `AMENDED` tiene 31 pares, igual que la lista de tasks.md. Cada localizador aparece en exactamente 1
  línea de su fichero y esa línea lleva ` (enmendado por #228 R13)`. Sufijos por fichero:
  - `index.test.tsx`: 25;
  - `consistency-classnames`: 3;
  - `design-drift`: 1;
  - `reminders-upcoming-past`: 1;
  - `routine-canvas-fidelity`: 1.
- Las 6 specs enmendadas tienen 1 vez `## Enmienda #228 — Acciones de deslizar en Recordatorios` y su
  casilla `- [ ] Enmienda #228 aprobada`.
- Existen los artboards `RecordatoriosDeslizarEliminar.dc.html` y `RecordatoriosDeslizarSerie.dc.html`.
- No hay ningún `#228` desnudo (sin ` R<n>` detrás) en los ficheros móviles cambiados. Las regex de R13
  usan `\x23228`.

## Observaciones
No bloquean. Quedan para que el leader las conozca:

1. Codex hizo `git commit --amend` sobre el commit 10 (`b28b74f6`) tras la incidencia de S5.
   - En S5, el `expect.objectContaining` de R2 serializaba children y llevó el worker a unos 3,6 GB.
   - Al hacer el amend, el commit 10 era HEAD. No hubo rebase, y el hash de traceability es el final.
   - Como efecto, el test de R2 del commit rojo `0f4344d3` no tiene la misma forma que el final. El
     verde cambió la aserción por comprobaciones directas de `props?.overshootRight` y
     `renderRightActions`. Son equivalentes a la spec y no reducen lo que se prueba.
2. El test de R6 añade dos aserciones más fuertes que las de la spec: el estilo del deslizable es `{}`,
   y la fila pasada conserva `accessibilityActions`. Son inocuas.
3. Codex hizo `git push origin HEAD:refs/heads/feature/228-mobile-reminder-swipe-actions` sin que se le
   pidiera; el handoff solo prohibía abrir o editar la PR. La rama remota quedó en `e42e0568`, igual que
   HEAD. No abrió PR.
4. Codex cargó estas skills: `building-native-ui`, `appllama-app-design-skill`, `animate-expo` (las del
   handoff) y además `ponytail`.
5. Lo que los tests de jest no ven lo cubre el smoke G2 del humano: el gesto real, TalkBack, el scroll
   diagonal y el modo claro/oscuro.

## Output de ./init.sh
Lo corrió el leader el 2026-11-03 sobre `55bb6763` (`e42e0568` más el reporte de Codex), sin
pipe y con el log en su scratchpad. Salió verde: `init=0`.

- Backend: 198 suites y 1650 tests, más 2 suites y 14 tests.
- Móvil: 180 suites, 6614 tests y 1 snapshot.
- e2e: 33 suites pasan y 3 se saltan; 599 tests pasan y 8 se saltan, de 607.

Los 55 `●` del log son de `Console`, no de fallos.
