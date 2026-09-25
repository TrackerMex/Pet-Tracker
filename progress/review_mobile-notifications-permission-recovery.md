# review: mobile-notifications-permission-recovery (#99)
Fecha: 2026-09-25T18:16Z
Veredicto: **APROBADO**

- Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`. Branch:
  `feature/99-mobile-notifications-permission-recovery`. HEAD revisado:
  `07d1f9a769e6539a8e5077312a2334fc29e7f1f5`. Lo comprobé al empezar y al
  terminar, y coincide con el `head` de la corrida de init.sh.
  `origin/main` = `d7cb0d60`.
- Todo lo de este informe lo he medido yo. El reporte de Codex solo me ha servido
  de índice. Los rojos y verdes por commit y las 23 sondas (M1-M7, N1-N7 y
  P1-P9, más dos variantes de arnés para M7) los corrí en un worktree temporal
  del scratchpad (`rev99/wt`, HEAD separado, `node_modules` enlazado). Ya está
  eliminado (`git worktree remove --force`, exit 0). Cada sonda la restauré con
  `git checkout -- src`, y después `git diff --quiet` dio 0. El worktree real
  ha quedado limpio: `git status --porcelain` vacío.
- `./init.sh` no lo he corrido yo, porque el clasificador se lo deniega al
  subagente. Lo corrió el leader. He leído su log, su HEAD y su exit (ver
  §Output de ./init.sh).
- Cargué las skills `expo:expo-overview` y `expo:expo-native-ui` para el C8.
  Si chocan con la carta, manda la carta.

## Checklist C2 — Estado coherente
- [x] Solo hay una feature `in_progress` en `feature_list.json`: #99. Es el único
  cambio de ese fichero en la branch (`pending` → `in_progress`).
- [x] `progress/current.md` describe la sesión: branch, base `d7cb0d60`, línea
  base, firma `5a2c9b5a` vía Notion, plan de handoff a Codex y R4 como gate
  humano.

## Checklist C3 — Arquitectura
- [x] La capa de dominio no está afectada: el cambio es solo móvil. `backend-pet-tracker/`
  e `infra/` quedan fuera del diff.
- [x] El estado vive en el hook (`src/hooks/use-push-registration.ts`), como
  almacén de módulo con `useSyncExternalStore`. La pantalla solo lo consume
  mediante `useNotificationsBlocked()`. `grep -rln useNotificationsBlocked src`
  devuelve exactamente cuatro ficheros: el hook, su test, `profile/index.tsx` y
  su test.
- [x] No hay dependencias nuevas: `package.json` y `bun.lock` no se tocan, y
  `grep -rn "sendIntent\|expo-intent-launcher" src` sale vacío. `Linking` y
  `AppState` vienen de `react-native`.
- [x] La lista de ficheros es cerrada. `git diff --stat origin/main...HEAD` da
  17 ficheros. Nueve están bajo `mobile-pet-tracker/` y
  `specs/mobile-ui-language/`, y son exactamente los de design.md §Archivos
  afectados. El resto son spec, handoff, impl, current y feature_list. No
  aparecen `_layout.tsx`, `auth-provider.tsx`, `components/` ni `theme/`.

## Checklist C4 — TDD
- [x] Cada R tiene tests que lo nombran:
  - `describe('#99 R1: …')`: 7 tests (5 filas de `it.each` y 2 `it`).
  - `describe('#99 R2: …')`: 8 tests (3 + 3 filas y 2 `it`), antes de `R15`.
  - `describe('#99 R3: …')`: 5 `it`, al final de `profile/index.test.tsx`.
- [x] El historial va test primero en los tres R. Los re-ejecuté yo en el
  worktree temporal:

  | Commit | Qué es | Suite(s) | Resultado |
  |---|---|---|---|
  | `87225d80` | R1 rojo | hook | 3 failed / 30 passed. Todos por aserción (`Expected true / Received false` y la fila «al desmontar»). El único cambio de producción es el esqueleto `useNotificationsBlocked(): boolean { return false; }` |
  | `3f185965` | R1 verde | hook | 33 passed |
  | `897d7bc4` | R2 rojo | hook | 7 failed / 34 passed, todos por aserción (listener de AppState con 0 llamadas) |
  | `c235f02a` | R2 verde | hook | 41 passed |
  | `05c41906` | R3 rojo | profile + language-provider + ui-language | 7 failed / 65 passed, todos por aserción (`Unable to find … notifications-blocked-notice`, `Expected length: 36 / Received 34`, catálogo, `mockUseNotificationsBlocked` sin llamadas); `bunx tsc --noEmit` exit 0 |
  | `e10fcf1c` | R3 verde | las tres | 72 passed |

- [x] Los rojos son de test y los verdes de producción. `05c41906` solo toca los
  tres ficheros de test. `e10fcf1c` toca catálogo, pantalla, `ui-copy-table.ts`
  y la tabla §2.7.

## Checklist C5 — Trazabilidad
- [x] Ninguna fila de R1-R3 está «pendiente». La fila de R4 dice «pendiente»,
  pero es la prueba de humo del humano en un dev build de Android 13+. La spec
  la declara fuera del gate del reviewer (traceability.md, línea 20, y la
  casilla de requirements.md §Prueba de humo).
- [x] Los seis hashes (`87225d80`, `3f185965`, `897d7bc4`, `c235f02a`,
  `05c41906` y `e10fcf1c`) existen (`git cat-file -e` da 0) y son ancestros de
  HEAD (`git merge-base --is-ancestor` da 0 en los seis).
- [x] Los commits son `test(push|profile): … (Rn)` y `feat(push|profile): … (Rn)`,
  más `docs(push): fill #99 traceability`, como prescribe tasks.md.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y
  `- [x] Spec aprobada por humano (fecha: 2026-09-25)`. El commit de firma es
  `5a2c9b5a`. Desde la firma, en `specs/mobile-notifications-permission-recovery/`
  solo ha cambiado `traceability.md`.

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza nada. El IIFE `void (async () => {…})()` pasa
  a ser `evaluate(ask)` dentro del mismo efecto, y no queda ningún resto del
  antiguo.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep-clean en las líneas añadidas a `profile/index.tsx` y al hook: ningún
  hex, ninguna clase arbitraria `[...]`, ningún `StyleSheet`, ninguna
  shadow/elevation legacy.
- [x] Dimensiones y safe areas: no cambian. El aviso va dentro del `ScrollView`
  existente, entre la cabecera y el `PetSwitcher`.
- [x] Estados de carga: no aplica. El aviso es un booleano síncrono del
  almacén.
- [x] El aviso reutiliza componentes compartidos:
  `<Card testID="notifications-blocked-notice" className="items-start gap-3">`
  usa el `Card` de `src/components/card.tsx`, variante surface por defecto con
  `CONTINUOUS_CORNER`. El `Button` y el `Button.Label` son de heroui-native. El
  texto es `font-normal text-foreground`. Sigue el precedente de
  `profile-pet-error`.
- [x] Lo tappable es el `Button` de heroui-native, que ya trae feedback pressed y
  target ≥ 44pt. No hay `Pressable` nuevo: el grep solo lo encuentra en la línea
  de import ya existente, a la que se añadió `Linking`.
- [x] No hay animaciones nuevas.

## Verificaciones del encargo

### Contrato normativo frente al código
Leí el código de HEAD contra requirements.md y design.md. El almacén de módulo
es `notificationsBlocked`, `blockedListeners`,
`subscribeNotificationsBlocked`, `setNotificationsBlocked` (con cortocircuito
si no cambia) y `useNotificationsBlocked`. Dentro del efecto, después de las
guardas, están:
- `let active = true`;
- `evaluate(ask)`, con `if (ask && !permissions.granted && permissions.canAskAgain)`;
- `if (active) setNotificationsBlocked(!permissions.granted && !permissions.canAskAgain);`,
  antes de `if (!permissions.granted) {`;
- `void evaluate(true)`;
- el listener `AppState.addEventListener('change', …)`, que llama a
  `evaluate(false)` solo con `state === 'active' && notificationsBlocked`;
- la limpieza en el orden prescrito.

Greps de §Cierre: `requestPermissionsAsync` 1, `void evaluate(false)` 1,
`void evaluate(true)` 1, `AppState.addEventListener('change'` 1,
`Linking.openSettings()` 1 y el testID del aviso 1. El copy de D6 está en
`catalog.ts` `en`/`es`, justo después de `profile.signOut`, y coincide literal.

### Candados movidos y candados que siguen verdes
Las únicas líneas borradas en tests existentes son las dos de
`ui-language.test.ts` (`34` → `36` y `35 - 1` → `35 - 1 + 2 // #95 R5, +2 #99 R3`)
y las dos de `language-provider.test.tsx` (`+ 2` y el comentario). Son las de
«Se mueven». `ui-copy-table.ts` y la tabla §2.7 solo ganan dos filas cada una.
El test de #79 R7 `no insiste cuando el permiso ya no se puede pedir` no se ha
tocado y sigue verde en HEAD. De hecho, M6 lo pone en rojo, como declara la
tabla. En HEAD, las seis suites de §Cierre dan 41 + 38 + 9 + 25 + 2 + 1 = 116
passed, exit 0.

### Sondas de mutación (todas restauradas con `git diff --quiet` = 0)

| Sonda | Tabla | Medido | Tests en rojo |
|---|---|---|---|
| M1 | 3 | 3 | «primera negativa…», «…canAskAgain vuelve a true…», «no reevalúa: primera negativa…» |
| M2 | 1 | 1 | «segunda negativa en este arranque…» |
| M3 | 2 | 2 | «al desmontar…», «una evaluación que termina…» |
| M4 | 1 | 1 | «una evaluación que termina…» |
| M5 | 7 | 7 | filas 3, 4 y 5 más 4 de R2 |
| M6 | 8 | 8 | #79 R7 «no insiste…», fila 1, «al desmontar…», «una evaluación…» y 4 de R2 |
| **M7** | **8** | **6** | filas 1 y 2, «al desmontar…» y las 3 filas «al volver a active…» (ver H3) |
| N1 | 2 | 2 | «no reevalúa: concedido…», «no reevalúa: primera negativa…» |
| N2 | 1 | 1 | «no reevalúa: aviso encendido, pasa a background» |
| N3 | 1 | 1 | fila 3 de vuelta |
| N4 | 1 | 1 | fila 1 de vuelta |
| N5 | 2 | 2 | filas 1 y 3 de vuelta |
| N6 | 1 | 1 | «retira el listener…» |
| N7 | 8 | 8 | «sin precondiciones…» y las 7 que cuentan una sola suscripción |
| P1 | 1 | 1 | «con el permiso bloqueado…» |
| P2 | 2 | 2 | «con el permiso bloqueado…», «en inglés…» |
| P3 | 1 | 1 | «pulsar la acción…» |
| P4 | 1 | 1 | «sin bloqueo…» |
| P5 | 1 | 1 | «con el permiso bloqueado…» |
| P6 | 4 | 4 | «en inglés…», #65 R7 y dos de #65 R18 |
| P7 | 1 | 1 | «con el permiso bloqueado…» |
| P8 | 1 | 1 | «pulsar la acción…» |
| P9 | 2 | 2 | «con el permiso bloqueado…», «en inglés…» |

### Candados no tautológicos
- `NOTICE_ES` y el copy inglés están escritos como literales en el test. No se
  importan de `catalog.ts`.
- La aserción de `className` compara contra el literal
  `'rounded-card border border-border bg-surface p-4 shadow-sm items-start gap-3'`.
- «sin bloqueo…» exige `expect(mockUseNotificationsBlocked).toHaveBeenCalled()`,
  así que no pasa en vacío. Se comprobó en el rojo `05c41906`, donde falla
  precisamente por eso.
- No hay `<palabra>-[` en el código de test nuevo.
- No hay comentarios nuevos en producción.

### Entorno
- `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` da exit 0: el fichero
  no existe, así que no hubo que borrar nada.
- En HEAD, `bun run typecheck` da exit 0 y `bun run lint` da exit 0.

## Observaciones

Ninguna es bloqueante.

- **H1 (baja, estilo, fuera del contrato).** El commit `3f185965` desindenta de
  6 a 4 espacios el `});` que cierra
  `Notifications.addNotificationResponseReceivedListener(() => { router.push('/alerts');`
  en `src/hooks/use-push-registration.ts`. En HEAD es la línea que sigue a
  `router.push('/alerts');` (la 93-94). El cambio es solo de espacios, no altera
  el comportamiento y el lint no lo detecta porque no hay prettier. Aun así,
  incumple el «Nada más cambia» del contrato del hook. Se puede corregir en
  cualquier momento restaurando los 6 espacios. No justifica otra ronda.
- **H2 (baja, desviación documentada del arnés).** El `beforeEach` de `#99 R2`
  añade `mockGetPermissions.mockReset();` y
  `mockGetPermissions.mockResolvedValue(permission(true, true));` delante de
  `captureAppStateListener()`, que es lo único que prescribe la spec. El
  `beforeEach` de fichero ya fija el mismo valor por defecto, así que la única
  diferencia real es vaciar las colas `mockResolvedValueOnce` que dejan los
  tests anteriores. `jest.clearAllMocks` no las vacía. Codex lo declara en su
  reporte (línea 36). La variante sin esas líneas (`LIT`) da 41/41 en verde, así
  que no oculta nada: es aislamiento legítimo.
- **H3 (informativa, error de la tabla de la spec, no un hueco de los tests).**
  M7 da 6 rojos y la tabla de requirements.md declara 8 («+ 5 de R2»). Medido:
  - Con el arnés de Codex, M7 pone en rojo las filas 1 y 2 de R1, «al desmontar…»
    y las 3 filas «al volver a active…». Esto cubre todos los caminos en que un
    suscriptor observa el snapshot.
  - Las 3 filas «no reevalúa…» nunca aseveran `probe.result.current`: solo
    cuentan llamadas, como fija el contrato de R2. Además, el listener de
    AppState lee el booleano del módulo directamente, así que M7 no puede
    afectarlas. No es una zona ciega: por construcción, no hay nada que
    observar ahí.
  - Con el `beforeEach` literal de la spec, `LIT+M7` da 8 rojos: los 6 de antes
    más «no reevalúa: concedido de entrada» (`Expected number of calls: 1 /
    Received 0`) y «no reevalúa: primera negativa» (`Expected 1 / Received 2`).
  - Esos dos no son detecciones de M7. `LIT+M7` corrido solo sobre «no reevalúa»
    (`-t "no reevalúa"`) da 3 passed, exit 0. Caen en cascada, por las colas
    `mockResolvedValueOnce` que no consumen las 3 filas anteriores al abortar en
    su primer `waitFor` (línea 583).
  - Conclusión: la tabla se midió con el arnés contaminado, que es justo lo que
    H2 corrige. El recuento correcto para M7 es 3 de R1 + 3 de R2 = 6. Queda
    para el spec_author como lección de cómo se miden las tablas de sondas.
- **H4 (informativa, gate humano pendiente).** R4, la prueba de humo en un dev
  build de Android 13+, sigue sin firmar en requirements.md §Prueba de humo, y
  su fila de traceability está «pendiente». Esto es lo previsto por la spec.
  Según las reglas del repo, el leader no debe pasar #99 a `done` hasta que el
  humano marque esa casilla.

## Output de ./init.sh

El leader lo ejecutó sobre `07d1f9a769e6539a8e5077312a2334fc29e7f1f5` (el
fichero `head` de la corrida coincide con `git rev-parse HEAD`). El log está en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/rev99/init.log`.
Exit medido sin pipe: `EXIT=0` (fichero `exit`).

```
Test Suites: 171 passed, 171 total          (backend unit)
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
# tests 28 / # pass 28 / # fail 0           (harness)
# tests 5  / # pass 5  / # fail 0
# tests 15 / # pass 15 / # fail 0
Test Suites: 83 passed, 83 total            (mobile)
Tests:       1530 passed, 1530 total
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
EXIT=0
```

Deltas frente a la base:
- Móvil: 83/1510 en `d7cb0d60` → 83/1530 (+0 suites, +20 tests). Coincide con
  lo que prevé la spec: 7 de R1, 8 de R2 y 5 de R3.
- Backend unit, infra y e2e: +0 frente a la base del leader en `b602ff6e`
  (171/1307, 2/14, 27 + 3 skipped / 389 + 8 skipped).
