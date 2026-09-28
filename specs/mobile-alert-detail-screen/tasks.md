---
feature: "mobile-alert-detail-screen"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-alert-detail-screen]] (#100)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Commits **test-primero**: el rojo va en su propio
> commit y falla **por su aserción**, nunca por un `ReferenceError`, un módulo
> inexistente ni una mutación de un doble (CHECKPOINTS C4). Añadir a un doble un
> campo que la producción aún no usa (`push: jest.fn()`) no es mutarlo.
> **Ruta (b) de C4** en R8, R9 y R10: la conducta ya existe cuando llega su
> test, así que el commit rojo planta en **producción** la mutación que se
> declara y el verde la revierte; el mensaje del commit rojo la nombra.
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique. Todos los
> comandos se lanzan **desde `mobile-pet-tracker/`**, con `bunx`, nunca `npx`,
> y **sin pipe** (`cmd > /tmp/x.log 2>&1; echo "exit=$?"`).

## Antes de empezar

- [ ] `git branch --show-current` → `feature/100-mobile-alert-detail-screen`, y
      `git log -1` → `a9965ee3` o posterior. Si la base se movió, **medir de
      nuevo** y aplicar los deltas de [[design]] D8 sobre la base nueva; no
      reapuntar hashes de [[traceability]] tras un rebase.
- [ ] Casillas firmadas en [[requirements]] §Aprobación: **A15**, **A16**,
      **A17** y **spec**. Sin las cuatro no se empieza.
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si sale
      `1`, **no** borrarlo: pedir al humano que lo borre y esperar. Repetir la
      comprobación antes de cada `tsc`.
- [ ] **No lanzar `./init.sh`** ni tocar Postgres/LocalStack (compartidos con
      el otro worktree). Se mide con `bunx jest`, `bunx tsc --noEmit` y
      `bunx expo lint`.
- [ ] Medir la base **sin pipe**: `bunx jest --silent > /tmp/base100.txt 2>&1; echo "exit=$?"`
      → en `a9965ee3`, 83 suites, 1545 tests, 1 snapshot, `exit=0`.
      `bunx tsc --noEmit > /tmp/tsc100.txt 2>&1; echo "exit=$?"` y
      `bunx expo lint > /tmp/lint100.txt 2>&1; echo "exit=$?"` → `exit=0` y
      ficheros de 0 bytes.
- [ ] Skills de Codex: `building-native-ui` y `native-data-fetching`. **No hay
      skill de router**: la guía de rutas, pila y navegación está en [[design]]
      D1, D3, D5 y D6; no hay otra que cargar.
- [ ] Leer [[design]] §1 y D8 antes del primer test de navegación: **un solo
      `it` por fichero que use `renderRouter`**, `afterEach(() => jest.useRealTimers())`
      y `jest.mock('standard-navigation', () => ({}))`.
- [ ] Filtros de jest: siempre `--runTestsByPath` y cada ruta **entre comillas
      simples** (`'src/app/alerts/[alertId].tsx'`, `'src/app/(tabs)/…'`). Tras
      cada comando, el número de suites que imprime jest = el de ficheros
      pedidos (lección `jest-paths-con-parentesis`).

## Orden y por qué es ese (candado del sujeto ausente)

| # | Commit | Asevera sobre | ¿Existe cuando se asevera? |
|---|---|---|---|
| 0 | A15–A17 (docs y specs) | — | commit de docs, antes del primer rojo |
| 1 | R1 rojo → verde | tres claves del catálogo y su fila en la spec de idioma | Sí: catálogo y `design.md` de idioma existen; el rojo es su ausencia |
| 2 | R2 rojo → verde | fichero `src/app/alerts/[alertId].tsx`; noveno hijo de la guarda y sus `options` | Sí: `detail-stack.test.tsx` lee el disco y `layout.test.tsx` recorre la guarda; el rojo es "no existe" y "ocho hijos". El `title` usa `alerts.detailTitle`, que existe desde el paso 1 |
| 3 | R3 rojo → verde | la tarjeta y sus cuatro hijos | El test importa `AlertDetailScreen` de `src/screens/alert-detail`, que existe desde el verde de R2 (stub que devuelve `null`); el rojo es `screen-alert-detail` ausente |
| 4 | R4 rojo → verde | esqueleto, error, salida | La pantalla existe (paso 3); el rojo es que sin la alerta pinta `null` y no navega |
| 5 | R5 rojo → verde | botón, llamada y resultados; mapa de `signOut` | La tarjeta existe (paso 3); el rojo es el botón ausente |
| 6 | R6 rojo → verde | enlace de la fila del centro | La fila existe desde #78; el rojo es `alert-row-<id>-link` ausente |
| 7 | R7 rojo → verde | href del toque; pila con el router real | El hook existe desde #79 y la ruta desde el paso 2; el rojo es que empuja `'/alerts'` siempre |
| 8 | R8 rojo (mutación) → verde | ida y vuelta con pantallas reales | Todo existe desde los pasos 2–6; rojo por la ruta (b) |
| 9 | R9 rojo (M7) → verde | pila y montajes de `#114 R3` | Existen desde #114; rojo por la ruta (b) |
| 10 | R10 rojo (mutación) → verde | tabla de copy del detalle | El copy existe desde los pasos 2–5; rojo por la ruta (b) |

R1 va primero porque R2 declara `t('alerts.detailTitle')` y R3 pinta
`alerts.statusOpen` y `alerts.openedAt`. R7 va después de R2 (la ruta tiene
que existir para que el router real apile el detalle) y R8 después de R6 (el
enlace de la fila es su primer paso).

---

## Paso 0 — Enmiendas A15, A16 y A17

- [ ] Aplicar literal los tres bloques de [[requirements]] §Enmiendas, con
      `<fecha>` = fecha del commit que firma cada casilla.
- [ ] `grep -c 'enmienda A15 de #100' ../docs/conventions.md ../docs/ui-guidelines.md`
      → `1` y `1`.
      `grep -c 'Enmienda externa A1[67] — la escribe #100' ../specs/mobile-push-registration/requirements.md ../specs/mobile-alerts-center/requirements.md`
      → `1` y `1`.
- [ ] `bunx jest --runTestsByPath 'src/__tests__/hero-header-amendments.test.ts' > /tmp/a15.log 2>&1; echo "exit=$?"`
      → `exit=0`, 1 suite.
- [ ] Commit: `docs(specs): apply amendments A15-A17 of #100`.

## R1 — Tres claves de copy

- [ ] **(1) Rojo.** En `src/providers/__tests__/language-provider.test.tsx`:
      el `describe('#100 R1: …')` de [[requirements]] R1, calcado del
      `describe('#98 R3: …')` (triples `[clave, en, es] as const`, lectura de
      `../specs/mobile-ui-language/design.md` con `join(process.cwd(), …)` y la
      expresión regular con `← añadida por #100 \\(R1\\)`); y en el `it` de
      `#65 R12` el `+ 3` y el comentario de R1.
      `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx' > /tmp/r1.log 2>&1; echo "exit=$?"`
      → `exit=1`, fallan **solo** el `it` de `#100 R1` y el de `#65 R12` (306 ≠ 309).
      Commit: `test(alert-detail): three copy keys for the alert detail (R1)`.
- [ ] **(2) Verde.** Las tres claves en `src/i18n/catalog.ts` tras
      `'alerts.daysAgo'` en `en` y en `es`; la sección `§2.14` en
      `../specs/mobile-ui-language/design.md` antes de `## 3. La infraestructura`.
      Mismo comando → `exit=0`. Además
      `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/r1b.log 2>&1; echo "exit=$?"`
      → `exit=0` (el escaneo de copy suelta sigue limpio).
      Commit: `feat(alert-detail): add the alert detail copy keys (R1)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R2 — Ruta y declaración en la guarda

- [ ] **(1) Rojo.** `src/app/__tests__/detail-stack.test.tsx`: el
      `describe('#100 R2: …')` con su `it` (el fichero existe, contiene
      `useLocalSearchParams` y `from '../../screens/alert-detail'`, calcado de
      los casos de `#114 R1` del mismo fichero). `src/app/__tests__/layout.test.tsx`:
      el `describe('#100 R2: …')` con sus dos `it` ([[design]] D8), y el ajuste
      del `it` heredado `'declara ocho rutas protegidas y alerts singular'`
      ([[design]] D9 fila 2).
      `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.test.tsx' 'src/app/__tests__/layout.test.tsx' > /tmp/r2.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites, fallan **solo** los `it` de `#100 R2` y el heredado
      (ocho hijos, no nueve).
      Commit: `test(alert-detail): the alert detail route lives on the root stack (R2)`.
- [ ] **(2) Verde.** `src/app/alerts/[alertId].tsx` ([[design]] D1);
      `src/screens/alert-detail/index.tsx` con el stub
      `export function AlertDetailScreen(_props: { alertId: string }) { return null; }`;
      el `Stack.Screen` de [[design]] D1 en `src/app/_layout.tsx`. Mismo comando
      → `exit=0`. **Medición M-P1** de [[requirements]] §Verificación, con su
      regla si sale rojo. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-r2.log 2>&1; echo "exit=$?"`
      → `exit=0`.
      Commit: `feat(alert-detail): declare alerts/[alertId] as a singular root route (R2)`.
- [ ] **(3) Refactor.** Ninguno.

## R3 — La tarjeta desde la caché

- [ ] **(1) Rojo.** Nuevo `src/screens/alert-detail/index.test.tsx` con los
      dobles de [[design]] D8 y el `describe('#100 R3: …')` (9 tests).
      `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' > /tmp/r3.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite, 9 fallos porque `screen-alert-detail` no existe.
      Commit: `test(alert-detail): the detail renders the cached alert (R3)`.
- [ ] **(2) Verde.** `src/hooks/use-alerts-list.ts` y `src/utils/alert-meta.ts`
      ([[design]] D2, D3); el centro pasa a usarlos; la pantalla pinta raíz y
      tarjeta ([[design]] D3). En `src/__tests__/ui-copy-table.ts` las tres
      filas de tipo de `R12_ALERTS` cambian de fichero, y en
      `src/__tests__/ui-language.test.ts` el predicado de `#78 R12` y
      `SCREEN_FILES` `+ 1 // #100 R3` ([[design]] D9 filas 3–5).
      `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' 'src/screens/alerts/index.test.tsx' 'src/__tests__/ui-language.test.ts' > /tmp/r3g.log 2>&1; echo "exit=$?"`
      → `exit=0`, 3 suites (el centro no cambia de conducta: sus 33 tests
      siguen verdes sin tocarlos).
      Commit: `feat(alert-detail): render the alert card from the list cache (R3)`.
- [ ] **(3) Refactor.** Ninguno; no añadir tests colocados a las dos piezas
      extraídas (P7).

## R4 — Carga, error y salida

- [ ] **(1) Rojo.** `describe('#100 R4: …')` en
      `src/screens/alert-detail/index.test.tsx` (7 tests, [[design]] D8). El de
      caché vieja monta su propio `QueryClientProvider`, no `renderWithProviders`.
      Mismo comando que R3 (1) → `exit=1`; fallan 6 de los 7: el de
      `unauthorized` puede salir verde (declarado en [[requirements]] R4).
      Commit: `test(alert-detail): loading, error and exit without the alert (R4)`.
- [ ] **(2) Verde.** Precedencia y efecto de salida de [[design]] D3. Mismo
      comando → `exit=0`.
      Commit: `feat(alert-detail): show loading and error states and leave when the alert is gone (R4)`.
- [ ] **(3) Refactor.** Ninguno.

## R5 — Marcar leída

- [ ] **(1) Rojo.** `describe('#100 R5: …')` en
      `src/screens/alert-detail/index.test.tsx` (9 tests), y en
      `src/__tests__/design-drift.test.ts` la entrada
      `'screens/alert-detail/index.tsx': 1` del mapa `screenSignOutCalls`.
      `bunx jest --runTestsByPath 'src/screens/alert-detail/index.test.tsx' 'src/__tests__/design-drift.test.ts' > /tmp/r5.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites; fallan los 9 de `#100 R5` y
      `it('preserves every mutation sign-out with zero delta')`.
      Commit: `test(alert-detail): acknowledge the alert from the detail (R5)`.
- [ ] **(2) Verde.** `handleAck`, botón y error de acción de [[design]] D4.
      Mismo comando → `exit=0`. `git grep -n "queryKey: \[" -- src/screens/alert-detail`
      y `git grep -n "useFocusEffect" -- src/screens/alert-detail` vacíos.
      Commit: `feat(alert-detail): acknowledge the alert from the detail (R5)`.
- [ ] **(3) Refactor.** Ninguno; el `switch` duplicado con el centro es deuda
      registrada, no se unifica.

## R6 — La fila abre su detalle

- [ ] **(1) Rojo.** En `src/screens/alerts/index.test.tsx`: el doble de
      `expo-router` gana `router: { push: jest.fn() }`; el
      `describe('#100 R6: …')` (3 tests); y los dos literales heredados de
      `#78 R6` ([[design]] D9 filas 8–9).
      `bunx jest --runTestsByPath 'src/screens/alerts/index.test.tsx' > /tmp/r6.log 2>&1; echo "exit=$?"`
      → `exit=1`; fallan los 3 de `#100 R6` y los dos `it` heredados (la
      columna es `View` sin `testID` y con la clase vieja).
      Commit: `test(alerts): the row text column opens its detail (R6)`.
- [ ] **(2) Verde.** El `Pressable` de [[design]] D6. Mismo comando → `exit=0`.
      Commit: `feat(alerts): link each row to its alert detail (R6)`.
- [ ] **(3) Refactor.** Ninguno.

## R7 — El toque abre su alerta

- [ ] **(1) Rojo.** `describe('#100 R7: …')` en
      `src/hooks/use-push-registration.test.tsx` (10 tests); y el nuevo
      `src/app/__tests__/alert-detail.notification.test.tsx` con el único `it`
      de [[design]] D8.
      `bunx jest --runTestsByPath 'src/hooks/use-push-registration.test.tsx' 'src/app/__tests__/alert-detail.notification.test.tsx' > /tmp/r7.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites; fallan las 2 filas con `alertId: 'alert-9'` (las
      otras 8 esperan `'/alerts'` y pueden salir verdes: son el candado de que
      el caso sin id no cambia) y el `it` del fichero nuevo (la ruta es
      `/alerts`, no `/alerts/alert-1`).
      Commit: `test(push): the notification tap opens its alert detail (R7)`.
- [ ] **(2) Verde.** `notificationHref` y sus dos usos ([[design]] D5). Mismo
      comando → `exit=0`; y
      `bunx jest --runTestsByPath 'src/app/__tests__/reminders-alerts-stack.notification.test.tsx' > /tmp/r7b.log 2>&1; echo "exit=$?"`
      → `exit=0` (el toque sin id sigue en `/alerts`).
      Commit: `feat(push): open the tapped alert detail (R7)`.
- [ ] **(3) Refactor.** Ninguno.

## R8 — Ida y vuelta con las pantallas reales (ruta b)

- [ ] **(1) Rojo con mutación.** Nuevo
      `src/app/__tests__/alert-detail.navigation.test.tsx` con el único `it` de
      [[design]] D8, **y** en `src/screens/alert-detail/index.tsx` la mutación
      "`found` busca solo en `alerts.data?.pages[0]`".
      `bunx jest --runTestsByPath 'src/app/__tests__/alert-detail.navigation.test.tsx' 'src/screens/alert-detail/index.test.tsx' > /tmp/r8.log 2>&1; echo "exit=$?"`
      → `exit=1`; falla **solo** el `it` nuevo (la alerta de la segunda página
      no se encuentra y el detalle sale al centro); los 25 del detalle siguen
      verdes (una sola página).
      Commit: `test(alert-detail): round trip from a second-page row (R8, plants mutation: found reads pages[0] only)`.
- [ ] **(2) Verde.** Revertir la mutación. Mismo comando → `exit=0`.
      Commit: `feat(alert-detail): search every cached page for the alert (R8)`.
- [ ] **(3) Refactor.** Ninguno.

## R9 — Vaciado de temporizadores en `#114 R3` (ruta b)

- [ ] **(1) Rojo con M7.** En
      `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`, la línea
      de [[design]] D10; **y** en `src/app/_layout.tsx` quitar
      `dangerouslySingular` del `Stack.Screen name="alerts"` (M7).
      `bunx jest --runTestsByPath 'src/app/__tests__/reminders-alerts-stack.notification.test.tsx' 'src/app/__tests__/layout.test.tsx' > /tmp/r9.log 2>&1; echo "exit=$?"`
      → `exit=1`; fallan el `it` de `#114 R3` **en la aserción de pila tras el
      segundo toque** (no en el `back` posterior; comprobarlo en el log) y el de
      `#114 R1` de `layout.test.tsx` (declarado).
      Commit: `test(reminders-alerts-stack): flush timers before asserting the stack (R9, plants mutation M7)`.
- [ ] **(2) Verde.** Revertir M7. Mismo comando → `exit=0`.
      Commit: `fix(reminders-alerts-stack): keep alerts singular (R9)`.
- [ ] **(3) Refactor.** Ninguno.

## R10 — Copy del detalle por clave (ruta b)

- [ ] **(1) Rojo con mutación.** En `src/__tests__/ui-copy-table.ts`, el bloque
      `R13_ALERT_DETAIL` (11 filas, [[design]] D7), su entrada en `ALL_USES` y
      en el array del `it('cuadra ALL_USES con la suma de los doce bloques')`;
      en `src/__tests__/ui-language.test.ts`, el `describe('#100 R10: …')` y
      `SCREEN_FILES` `+ 1 // #100 R10`; **y** en
      `src/screens/alert-detail/index.tsx` la mutación
      `const retryKey = 'common.retry' as const;` + `t(retryKey)`.
      `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/r10.log 2>&1; echo "exit=$?"`
      → `exit=1`; fallan `it('registra cada ocurrencia del detalle')` y
      `it('resuelve cada ocurrencia de la tabla contra la clave exacta')`
      (declarado), los dos por `common.retry` con `uses: 0`.
      Commit: `test(alert-detail): the detail resolves its copy by key (R10, plants mutation: retry key through a constant)`.
- [ ] **(2) Verde.** Revertir la mutación. Mismo comando → `exit=0`.
      Commit: `feat(alert-detail): resolve the retry label by literal key (R10)`.
- [ ] **(3) Refactor.** Ninguno.

## Cierre

- [ ] Suite completa **sin pipe**: `bunx jest --silent > /tmp/close100.txt 2>&1; echo "exit=$?"`
      → `exit=0` y el delta de [[design]] D8 contra la base medida (`+3`
      suites, `+45` tests; en `a9965ee3`, 86 suites y 1590 tests).
- [ ] `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc100c.txt 2>&1; echo "exit=$?"`
      y `bunx expo lint > /tmp/lint100c.txt 2>&1; echo "exit=$?"` → `exit=0` y
      0 bytes.
- [ ] Comprobaciones de [[requirements]] §Verificación: C8, los dos `git grep`
      vacíos y el `git diff a9965ee3 -- …` vacío.
- [ ] [[traceability]] con hash rojo → verde por requisito y el commit de
      A15–A17.
- [ ] `progress/impl_mobile-alert-detail-screen.md`: base medida, M-P1 con su
      resultado, recuentos de cierre, mutaciones plantadas y revertidas (R8,
      R9, R10) y cualquier desviación de esta spec.
- [ ] Prueba de humo: la corre **el humano** ([[requirements]] §Prueba de humo).
