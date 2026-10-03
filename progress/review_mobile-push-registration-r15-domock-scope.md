# review: mobile-push-registration-r15-domock-scope (#133), ronda 1
Fecha: 2026-09-29T22:21:44Z
Veredicto: APROBADO

HEAD revisado: `d98c143b4b2213bb4854a3a3c5dc37cb70f72c1d`, en la branch
`feature/133-mobile-push-registration-r15-domock-scope` de
`/home/claude/sites/Pet-Tracker-wt-backend`. Es el mismo HEAD que figura al
final del log de init.sh. Base: `073fa6cb`, que es el merge-base y
`origin/main`. Los blobs de base son test `1e4ecca9` y hook `316a36f2`, y el
hook sigue en `316a36f2` en HEAD.

En alcance entran los commits de Codex `b24895d5`, `0b517529` y `d98c143b`.
Los del leader (`f4e8673a`, `7a7c7c79`, `1102934a`, `7f11e9be`, `5d7af5db`)
quedan fuera.

El veredicto se escribió en una sola pasada, no en dos (provisional y luego
final), porque el log de init.sh llegó antes de terminar la revisión. El
leader lo indicó así en su mensaje.

Skills cargadas: solo `expo:expo-overview`. No cargué `expo:expo-native-ui`:
el cambio es de mocks de jest en el test de un hook y no hay UI.

Entorno de medida:
- Todas las sondas, rojos y checkouts históricos se hicieron en un worktree
  desechable,
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/rev133-wt`,
  con un symlink a los `node_modules` de wt-backend. Ese worktree ya está
  borrado, y `git -C wt-backend status --short` salió vacío antes de escribir
  este fichero.
- Los logs quedan en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/out133/`.
- Todo se midió sin pipe (`cmd > log 2>&1; echo "exit=$?"`), y cada corrida
  del fichero imprimió `Test Suites: 1`.

## Checklist C2 — Estado coherente
- [x] Solo una feature está `in_progress` en `feature_list.json`: #133
      (medido con `jq`).
- [x] `progress/current.md` describe la sesión activa de #133.
- [x] Los commits de Codex no tocan `feature_list.json`, `STATUS.md`,
      `progress/current.md` ni `progress/history.md`. El
      `git diff --name-only 5d7af5db..HEAD` de esas rutas sale vacío.

## Checklist C3 — Arquitectura
- [x] No hay capas en juego. El diff de `mobile-pet-tracker/` contra
      `073fa6cb` es solo `src/hooks/use-push-registration.test.tsx`, y el
      diff de producción está vacío.
- [x] domain, application e infrastructure no cambian (el backend no aparece
      en el diff).

## Checklist C4 — TDD
- [x] R1 tiene su test y lo nombra:
      `describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera')`.
      R2 se cierra con el `it` existente de R15 (vía b, declarada en la spec
      antes del handoff). R3 es un cierre medido sin test propio, también
      declarado.
- [x] El historial va primero en rojo y luego en verde, en commits separados:
  - **Rojo en `b24895d5`** (solo añade el `describe`, 19 inserciones):
    `exit=1`, `Tests: 1 failed, 51 passed, 52 total`. El único `●` es el de
    `#133 R1 › llama a cada jest.fn…`. Falla **por excepción**: la primera
    línea tras el título es `expo-notifications unavailable in Expo Go`, sin
    `expect(...)` delante, y la traza señala
    `use-push-registration.test.tsx:688:31`, que es el `new Error(` de R15.
    No hay ningún `ReferenceError` ni se muta ningún doble: el rojo es el
    defecto real (la fábrica del `Proxy` se fuga a los `describe` posteriores).
  - **Verde en `0b517529`** (solo cambia el `it` de R15): `exit=0`,
    `Tests: 52 passed, 52 total`, es decir base + 1. El `git show -w` coincide
    literalmente con tasks.md §R1 (2): la captura con `jest.requireMock`
    antes de `jest.resetModules()`, el `try`/`finally`, el comentario con
    `#133 R1` y `jest.doMock('expo-notifications', () => headerNotifications)`.
  - `d98c143b` no toca `mobile-pet-tracker/`: el
    `git diff --quiet 0b517529 d98c143b -- mobile-pet-tracker/` da 0.
- [x] R2 se cerró por mutación. Tabla de abajo, §Sondas R2.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». El único «pendiente» del
      fichero está en la línea 18, que es el texto de la regla.
- [x] R1 cita el rojo `b24895d5…` y el verde `0b517529…`. R2 y R3 citan el
      verde `0b517529…`, como prescribe la spec. Los dos hashes son ancestros
      de HEAD: `git merge-base --is-ancestor` da 0 en ambos.
- [x] Formato de commit. Los tres mensajes son los literales que prescribe
      `traceability.md` §Convención de commit: `test(mobile): … (R1)` dos
      veces y `docs(mobile): … (R2,R3)`. No usan `feat(...)` porque el cambio
      es solo de test y así lo fijó la spec aprobada.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla marcada con
      fecha 2026-09-29. El commit de firma es `1102934a` (gate vía Notion).
- [x] No se modificó ningún requisito después de la firma. El
      `git diff 1102934a..HEAD` de `requirements.md`, `design.md` y `tasks.md`
      sale vacío. Tras la firma, en la carpeta de la spec solo cambió
      `traceability.md`, en `d98c143b`.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza ningún componente. Deja innecesaria la
      regla «los `describe` nuevos van antes de R15», pero esa regla vive en
      specs cerradas y en la memoria del leader, no en código. design.md
      §Qué deja de hacer falta decide no editarlas.

## Checklist C8 — UI móvil
- [x] Grep-clean. Es lo único de `docs/ui-guidelines.md` que aplica, porque no
      hay pantalla. Corrí el comando literal de tasks.md §R3.6 sobre
      `073fa6cb..HEAD`: recorrió 45 líneas añadidas, no imprimió ninguna
      coincidencia y dio `exit=1`.
- [x] No hay `#133` suelto. `grep -P '#133(?! R\d)'` sobre las líneas
      añadidas da `exit=1`, y `grep -P '#\d{3}(?! R\d)'` sobre el fichero
      entero da `exit=1`. Las dos apariciones de `#133` son `#133 R1`, en el
      comentario del `finally` y en el título del `describe`.
- [x] Dimensiones, Skeleton, componentes compartidos, feedback pressed y
      animaciones no aplican: no hay pantalla ni componente.

## Sondas R2, re-plantadas una a una sobre `d98c143b`

Método:
- Cada ancla se comprobó con conteo = 1 antes de editar (script
  `scratchpad/probe133.py`).
- Tras cada sonda se restauró con `git checkout HEAD -- <hook> <test>`, y
  `git diff --quiet` y `git diff --cached --quiet` dieron 0 las dos veces en
  **todas** las sondas.
- Leyenda: «aserción» es que falla un `expect`; «excepción» es que el test
  lanza fuera de sus `expect`.

| Sonda | Esperado (tasks.md) | Medido por el reviewer | Tipo de rojo | ¿Coincide con el «medido» del reporte? |
|---|---|---|---|---|
| S1 | 1 rojo, R15, por aserción | `exit=1`, `1 failed, 51 passed, 52 total`; `● R15 › no accede…`; `expect(received).not.toThrow()`, `Error message: "expo-notifications unavailable in Expo Go"` | aserción | sí |
| S2 (zona ciega) | igual que S1 | igual que S1 | aserción | sí |
| S4 | igual que S1 | igual que S1 | aserción | sí |
| S3 (límite P4, #137) | **verde** | `exit=0`, `52 passed, 52 total` | — | sí |
| H1 | 1 rojo, R1, por excepción | `exit=1`, `1 failed, 51 passed`; `● #133 R1 › …`; `expo-notifications unavailable in Expo Go` | excepción | sí |
| H2 | 1 rojo, R1, por aserción | `exit=1`, `1 failed, 51 passed`; `expect(jest.fn()).toHaveBeenCalledWith(...expected)` en el `waitFor` de `mockRegisterPushToken`, `Number of calls: 0` | aserción | sí |
| H3 | 1 rojo, R1, por aserción | `exit=1`, `1 failed, 51 passed`; `expect(jest.fn()).toHaveBeenCalled()` en el bucle (`:739`), `Received number of calls: 0` | aserción | sí |
| H4 | verde | `exit=0`, `52 passed` | — | sí |
| H4+S1 | **verde** (P3) | `exit=0`, `52 passed` | — | sí |
| H4+S2 | verde (P3) | `exit=0`, `52 passed` | — | sí |
| H5 | 1 rojo, R1, por excepción | `exit=1`, `1 failed, 51 passed`; `AggregateError:` desde `aggregateErrors` en `react/cjs/react.development.js:551` | excepción | sí |

### Sondas propias, fuera de lo que cubre tasks.md

| Sonda | Qué muta | Medido | Lectura |
|---|---|---|---|
| O1 | En el `finally` se restaura otro objeto con las mismas siete `jest.fn` y `AndroidImportance` cambiado: `jest.doMock('expo-notifications', () => ({ ...headerNotifications, AndroidImportance: { MAX: 5 } }))` | **`exit=0`, `52 passed`** | **Verde: zona ciega del candado de R1.** Ver la observación 1. |
| V1 (medida, no mutación) | Se añade temporalmente al `it` de R1 `expect(jest.requireMock<typeof Notifications>('expo-notifications').AndroidImportance).toBe(Notifications.AndroidImportance)` | `exit=0`, `52 passed` | El código entregado **sí** restaura el objeto de cabecera. |
| V1+O1 | V1 y O1 a la vez | `exit=1`, `1 failed, 51 passed`; `expect(received).toBe(expected) // Object.is equality` en `:743` | La identidad se puede medir, y O1 la rompe: el hueco está en el test, no en el arreglo. |
| O2 | Quitar el `try`/`finally`: la restauración corre después del `expect`, en un bloque normal; más S1 | `exit=1`, `2 failed, 50 passed`: `R15` por aserción y `#133 R1` por excepción | El `finally` es de carga. Sin él, una regresión real arrastra a R1. Con él (S1), solo cae R15. |
| O2 solo | Igual que O2, sin S1 | `exit=0`, `52 passed` | Con producción correcta, el `finally` no cambia el resultado. |
| O3 | Producción: `import ExpoNotificationsDefault from 'expo-notifications'` usado solo en el efecto (import por defecto, que pasa por `_interopRequireDefault`) | `exit=1`, `1 failed, 51 passed`; solo `R15`, `expect(received).not.toThrow()` | R15 también caza el import por defecto. Solo el import con nombre queda ciego (S3, #137). |

## R3, medido por el reviewer

1. **Diff de `mobile-pet-tracker/` contra `073fa6cb`**: una sola línea,
   `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.
   - El rango de Codex (`5d7af5db..HEAD`) toca exactamente tres ficheros: el
     test, `specs/…/traceability.md` y
     `progress/impl_mobile-push-registration-r15-domock-scope.md`.
   - El diff acumulado contra `073fa6cb` trae además 7 ficheros de los
     commits del leader (spec ×3, handoff, `feature_list.json`, `STATUS.md`
     y `progress/current.md`). Ver la observación 3.
   - El hook, `src/screens/home/`, `progress/history.md`, `package.json` y
     `bun.lock` no aparecen en ningún rango.
2. **Títulos (`--json`)**:
   - Base en `5d7af5db`: 51 títulos, `exit=0`.
   - Final en `d98c143b`: 52 títulos, `exit=0`.
   - `diff` de las dos listas ordenadas: `diff=1`, con una única línea,
     `> #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera llama a cada jest.fn de la cabecera y registra el token`.
   - Sin ordenar, los 51 títulos base son el prefijo exacto de los 52 finales
     (`prefix_diff=0`) y R1 es el último.
3. **`git diff -w 073fa6cb..HEAD`** del test: ninguna línea `-` (el grep da
   `exit=1`). `--stat` da `28 insertions(+)`.
4. **Suite móvil completa**, sin pipe:
   - Base (`5d7af5db`): `exit=0`, `Test Suites: 86 passed, 86 total`,
     `Tests: 1608 passed, 1608 total`.
   - Final (`d98c143b`): `exit=0`, `Test Suites: 86 passed, 86 total`,
     `Tests: 1609 passed, 1609 total`.
   - Delta: +0 suites y +1 test.
   - Mi primera corrida final dio rojo por solaparse con el init.sh del
     leader. Ver la observación 2.
5. **Tipos y lint** en `d98c143b`:
   - `test ! -e .expo/types/router.d.ts` da `router_guard=0`.
   - `bunx tsc --noEmit` da `exit=0`, con salida vacía.
   - `bunx eslint src/hooks/use-push-registration.test.tsx` da `exit=0`, con
     salida vacía.
6. **Grep-clean**: ver C8.

## Observaciones

Ninguna observación bloquea. Los criterios medibles de R1, R2 y R3 se
cumplen. Hay tres cosas que el leader debe conocer.

1. **O1: el test de `#133 R1` no ve los campos que no son funciones del
   módulo restaurado.**
   - Si el `finally` restaura un objeto distinto con las mismas siete
     `jest.fn` y otro `AndroidImportance` (`{ MAX: 5 }`), el fichero sigue en
     verde: `52 passed`, `exit=0`.
   - Eso contradice dos frases de la spec aprobada:
     - `requirements.md` R2: «cualquier restauración que no devuelva el
       objeto de cabecera lo pone rojo».
     - `design.md` D2: «un sustituto que no sea el objeto de cabecera lo pone
       rojo aunque no lance».
   - Las sondas H1, H2, H3 y H5 son ciertas, pero la generalización no.
   - El test solo comprueba que las `jest.fn` se llamen (`toHaveBeenCalled`,
     sin argumentos) y los argumentos de `registerPushToken`. Nada comprueba
     `AndroidImportance` ni los argumentos de `setNotificationChannelAsync`.
   - **No es un defecto del trabajo entregado.**
     - El código cumple el SHALL de R1 («al mismo objeto»): la medida V1 pasa
       en verde en HEAD, y V1+O1 da rojo.
     - El test es el literal de tasks.md §R1 (1) que firmó el humano, y Codex
       lo copió sin desviarse.
   - Es un exceso de promesa de la spec, del mismo tipo que P4/S3. Queda al
     leader y al humano decidir si se registra como deuda o se deja anotado.
     No lo cierra esta ronda.
2. **Mi primera corrida de la suite completa se solapó con el init.sh del
   leader.**
   - El init.sh arrancó a las 22:12:12Z y mi corrida fue de 22:14:14Z a
     22:17:20Z.
   - Resultado de esa corrida: `exit=1`, `1 failed, 1608 passed, 1609 total`.
     El fallo fue en `src/app/(tabs)/__tests__/food.test.tsx`
     (`● R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default`),
     por un `waitFor` agotado. Ese suite tardó 51 s, con load average 7.26 en
     4 CPU, porque en paralelo corrían la fase de tests del init.sh y el
     `eslint --fix` del backend.
   - Al repetirla sin solape (22:18:46Z–22:19:33Z) dio `exit=0` y
     `86 passed / 1609 passed`.
   - La repetición en verde es el control más favorable, no una absolución.
     Aun así, el diff de #133 toca solo `use-push-registration.test.tsx`, y
     jest aísla cada fichero, así que no puede afectar a `food.test.tsx`. La
     fase móvil del propio init.sh salió `86 / 1609` en verde.
   - El log rojo completo se conserva en `scratchpad/out133/final_suite.log`.
   - El solape no contaminó el init.sh del leader: salió verde entero (ver
     abajo). Aun así, el leader debe saber que ocurrió.
3. **El handoff dice que el diff contra `origin/main` tiene solo tres
   ficheros, «nada más», y eso es falso tal como está escrito.**
   - `progress/handoff_…md` §QUE HACES lo afirma, y el encargo que recibí lo
     repite contra `073fa6cb`.
   - Los commits del propio leader en la branch añaden 7 ficheros más.
   - Codex lo detectó y lo documentó en su reporte, citando una aclaración
     del humano que me llegó de segunda mano y que no puedo verificar. Yo
     medí el alcance por mi cuenta: el rango de Codex tiene exactamente los
     tres ficheros.
   - No es un defecto del trabajo. Es una redacción a corregir en futuros
     handoffs: el diff acumulado debería medirse contra el HEAD del handoff.

## Output de ./init.sh

El leader corrió init.sh sobre wt-backend. Log crudo:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init-133-review.log`
(20 762 líneas). El HEAD del log es
`d98c143b4b2213bb4854a3a3c5dc37cb70f72c1d`, igual a
`git -C /home/claude/sites/Pet-Tracker-wt-backend rev-parse HEAD`.

Las líneas que lo deciden, sin códigos de color y con su número de línea:

```
40:✅ Archivos del harness presentes
45:✅ STATUS.md sincronizado con feature_list.json
57:✅ Build exitoso
218:Test Suites: 171 passed, 171 total
219:Tests:       1307 passed, 1307 total
231:Test Suites: 2 passed, 2 total
232:Tests:       14 passed, 14 total
457:# pass 28
458:# fail 0
506:# pass 5
507:# fail 0
654:# pass 15
655:# fail 0
20371:PASS src/hooks/use-push-registration.test.tsx
20432:Test Suites: 86 passed, 86 total
20433:Tests:       1609 passed, 1609 total
20437:✅ Tests pasados
20730:Test Suites: 3 skipped, 27 passed, 27 of 30 total
20731:Tests:       8 skipped, 389 passed, 397 total
20735:✅ Tests e2e pasados
20747:✅ Lint sin errores
20751:✅ Typecheck sin errores
20754:✅ Todo verde. Listo para trabajar.
20761:d98c143b4b2213bb4854a3a3c5dc37cb70f72c1d
20762:exit=0
```

Otras líneas del log:
- No hay ninguna línea `^FAIL `.
- Las líneas `ERROR` de Nest (64–138 y 20548) son logs de tests que ejercitan
  caminos de error, y esos tests pasan.
- Las tres claves ausentes de `.env` (líneas 14–16) son un aviso, no un
  fallo.
- Tras el init.sh (que incluye `eslint --fix` del backend),
  `git -C wt-backend status --short` salió vacío.
