# review: mobile-sign-out-lands-on-welcome (#149)
Fecha: 2026-10-06
Veredicto: APROBADO

Revisado sobre `36bfbd9f` (branch `feature/149-mobile-sign-out-lands-on-welcome`).
Todos los rojos y las sondas se corrieron en un worktree desacoplado
(`scratchpad/rev149-wt`, `node_modules` enlazado). Ya está retirado y
`git worktree list` no lo muestra. En el worktree principal no se tocó nada:
`progress/current.md` ya estaba modificado y sin commitear antes de esta
revisión. Ese cambio es del leader.

La aprobación cubre el código y los candados. **La feature no pasa a `done`**
hasta que el humano firme la prueba de humo (P1–P4 y S1–S5 de
`requirements.md`).

## Gate init.sh

Lo corrió el leader. Leí `149-init.log`, `149-init.head` y `149-init.exit`
en el scratchpad. `149-init.head` es igual a `git rev-parse HEAD`:
`36bfbd9f25960bf2e580fae56294b5991f776587`.

```
HEAD=36bfbd9f25960bf2e580fae56294b5991f776587
exit=0
(149-init.exit: exit=0)

backend unit:  Test Suites: 176 passed, 176 total
               Tests:       1348 passed, 1348 total
infra:         Test Suites: 2 passed, 2 total
               Tests:       14 passed, 14 total
harness (TAP): # tests 28 / # pass 28 / # fail 0 ; # tests 5 / # pass 5 / # fail 0 ; # tests 15 / # pass 15 / # fail 0
mobile:        Test Suites: 94 passed, 94 total
               Tests:       2131 passed, 2131 total
backend e2e:   Test Suites: 3 skipped, 29 passed, 29 of 32 total
               Tests:       8 skipped, 438 passed, 446 total
Lint sin errores / Typecheck sin errores / "Todo verde"
```

En la fase móvil del log aparecen como `PASS` las seis suites afectadas: guarda,
reminders-alerts navigation, `(tabs)/layout`, `app/layout`, `app/index` y
design-drift.

Verde reproducido en el worktree de sondas sobre `00d43733`, con el comando de
T0 sin pipe: `Test Suites: 6 passed, 6 total`, `Tests: 115 passed, 115 total`,
`exit=0`.

## Tabla por R-id

| R-id | Test que lo nombra | Rojo verificado (commit · línea de fallo) | Verde | Sonda |
|---|---|---|---|---|
| R1 | `(tabs)/__tests__/layout.test.tsx::#149 R1: redirects an unauthenticated session to welcome` | `4abb8bc5` · `1 failed, 4 passed, 5 total`; aserción en `:68`: `- "href": "/welcome"` / `+ "href": "/login"` | `00d43733` | M1, M2 (aserción en `:68`); M3 (TypeError, como se declaró) |
| R2 | `detail-stack.guard.test.tsx::#149 R2: cierra sesión en %s y aterriza en welcome` (5 filas) | `6314f88f` con `-t '#149 R2'` · `5 failed, 2 skipped, 7 total`; 5 × `Expected: "/welcome"` / `Received: "/login"` en `:156` (el `waitFor` posterior al cierre). Con el fichero entero en `f9f83b9d`: 5 × aserción en `:157` | `00d43733` | M1, M2, M9 |
| R3 | `detail-stack.guard.test.tsx::#149 R3: cierra sesión en %s, aterriza en welcome y no reabre el detalle` (12 filas) + `#95 R3` + `#114 R2` | `e414fa6f` contaminado, como registra E1: 12 filas caen en el `waitFor` inicial `:181` y 5 de R2 en `:150`. Rojo válido en `f9f83b9d`: guarda + reminders-alerts dan `19 failed, 1 passed, 20 total`, con 19 `Expected: "/welcome"`, 19 `Received: "/login"`, ninguna otra línea `Expected` y 0 TypeError/ReferenceError. Fallos en `:191` (12 filas de R3), `:157` (R2), `:118` (`#95 R3`) y `:143` (`#114 R2`). `#105 R8` en verde | `00d43733` | M1, M2, M7, M8 (reentrada), M9 (pila) |
| R4 | `design-drift.test.ts::#149 R4: inventaría cada ruta a login en producción` | `7881d642` con el fichero entero · `1 failed, 60 passed, 61 total`; aserción en `:736`, clave sobrante `+ "app/(tabs)/_layout.tsx": 1` | `00d43733` | M1, M3, M4, M5, M6 |

C4, test primero:
- Los cinco commits rojos (`4abb8bc5`, `6314f88f`, `e414fa6f`, `7881d642` y `f9f83b9d`) tocan solo ficheros de test.
- El verde `00d43733` toca solo `src/app/(tabs)/_layout.tsx`, y solo una línea.
- Ningún rojo válido falla por excepción ni por `ReferenceError`.

## Sondas M1–M7 (y extras)

Cada sonda se plantó sobre `36bfbd9f`. Antes de cada una se limpió el árbol con
`git checkout HEAD -- .` y se comprobó que `git diff --cached --quiet` y
`git diff --quiet` daban 0. Las sondas corrieron con `jest --ci --no-cache`
sobre `(tabs)/layout`, la guarda, reminders-alerts y design-drift, salvo donde
la tabla indica otra cosa.

| Id | Mutación | Declarado | Medido | ¿Coincide? |
|---|---|---|---|---|
| M1 | `(tabs)/_layout`: `href` → `"/login"` | R1 por aserción; las 5 filas de R2; las 12 de R3, `#95 R3` y `#114 R2`; R4. Todo por aserción | `21 failed`: exactamente esos. 19 × `Expected "/welcome"`/`Received "/login"` (`:118`, `:143`, 5×`:157`, 12×`:191`), R1 en `:68` y R4 en `:736` | sí |
| M2 | `href` → `"/"` | R1 por aserción y las 5 filas de R2 por aserción | `20 failed`. R1 por aserción en `:68`. Las 5 filas de R2 por aserción con `Received: "/"`. Caen además, por aserción, las 12 de R3, `#95 R3` y `#114 R2`: la tabla de R3 no las promete, pero tampoco lo contradice. R4 sigue verde, como era de esperar | sí |
| M3 | `href={usePathname() === '/profile' ? '/welcome' : '/login'}` | R1 por excepción (TypeError). R2: caen `/home`, `/map`, `/health` y `/food` por aserción y `/profile` pasa | R1: `TypeError: (0 , _expoRouter.usePathname) is not a function` (sí). R2: caen las **5** filas, `/profile` incluida, por **excepción** `Rendered more hooks than during the previous render.` en `_layout.tsx:14`. Caen también, por excepción, R3, `#95 R3` y `#114 R2`, y R4 por aserción | R1 sí · **R2 no** (hallazgo 1) |
| M3b (extra) | Variante legal de M3: `const pathname = usePathname();` arriba del componente, ternario en la rama | — | Guarda: `18 failed, 1 passed`. Las 5 filas de R2, `/profile` incluida, caen por aserción con `Received: "/login"`. Caen también las 12 de R3 y `#95 R3` | diagnóstico |
| M3c (extra) | `console.log` de `usePathname()` y `useSegments()` en la rama `unauthenticated` | — | En las 5 filas, en el render que redirige: `{"pathname":"/","segments":["(tabs)"]}`. El layout no sabe de qué tab viene | diagnóstico |
| M4 | `screens/profile`: `void signOut(); router.replace('/login');` | Cae R4 por aserción; R2 no lo ve | design-drift + guarda: `1 failed, 79 passed`. Solo cae R4, con `+ "screens/profile/index.tsx": 1`. La guarda queda 19/19 en verde | sí |
| M5 | `screens/weight-log`: `router.replace('/(auth)/login')` tras `signOut` | Cae R4 por aserción | `1 failed, 60 passed`. Solo cae R4, con `+ "screens/weight-log/index.tsx": 1` | sí |
| M6 | `providers/query-provider`: el callback del 401 también hace `router.replace('/login')` | Cae R4 por aserción | `1 failed, 60 passed`. Solo cae R4, con `+ "providers/query-provider.tsx": 1` | sí |
| M7 | `app/_layout`: `meals-history` sale de `Stack.Protected` | Caen la fila `/meals-history` de R3 y `#105 R8`, por aserción | Guarda: `2 failed, 17 passed`. La fila cae en `:191` (`Received: "/meals-history"`) y `#105 R8` cae con la pila `+ "meals-history"` | sí |
| M8 (extra) | M7 + `useEffect` en `RootStack` que llama a `router.dismissAll()` al quedar `unauthenticated`. Ataca la cláusula de R3 «un `router.push` posterior no cambia nada» | — | La fila `/meals-history` cae en la **reentrada** (`:198`) por aserción (`Received: "/meals-history"`). Las otras 11 caen por un `POP_TO_TOP` no manejado: es ruido de la propia mutación | candado vivo |
| M9 (extra) | `(tabs)/_layout`: en vez de `<Redirect>`, `useEffect(() => router.push('/welcome'))` + `return null`. Ataca la cláusula «pila **exactamente** `['welcome']`» | — | Guarda + reminders: `19 failed`, todos en la aserción de pila (`:119`, `:144`, 5×`:158`, 12×`:192`) con `+ "(tabs)"` | candado vivo |

Barrido de cláusulas universales:
- **R2, «cada una de las cinco tabs».** Hay cinco filas, y cada una asevera por su cuenta pathname y pila (M1, M2 y M9 tumban las cinco).
- **R3, «cada una de las doce».** Las doce filas coinciden una a una con los doce `Stack.Screen` de `Stack.Protected guard={status === 'authenticated'}` (`src/app/_layout.tsx`). La subcláusula de reentrada se probó con M8 y la de pila exacta con M9.
- **R4, «todo fichero de producción».** El test recorre todo `src/`, excepto `__tests__/` y `*.test.ts(x)`, y compara con `toEqual` contra un mapa literal. M4, M5 y M6 cubren las tres formas de origen (pantalla con comilla simple, pantalla con `/(auth)/login` y provider), y M1 cubre las comillas dobles.

## Lista cerrada de ficheros

**Contra la base `e002a4a5`:** solo cambian los 5 ficheros de `mobile-pet-tracker/`
de la lista cerrada, más `feature_list.json`, `progress/current.md`, el handoff,
el impl y los 4 ficheros de `specs/mobile-sign-out-lands-on-welcome/`. Los
ficheros fuera de esos 5 de la app son commits del leader anteriores a H0
o los dos documentos de Codex (impl y traceability).

**Contra H0 `a8118da0`, commit a commit:**

| Commit | Autor de facto | Ficheros |
|---|---|---|
| `4abb8bc5` | Codex | `src/app/(tabs)/__tests__/layout.test.tsx` |
| `6314f88f` | Codex | `src/app/__tests__/detail-stack.guard.test.tsx` |
| `e414fa6f` | Codex | guarda + `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` |
| `7881d642` | Codex | `src/__tests__/design-drift.test.ts` |
| `980e20bf` | leader | `specs/…/design.md`, `requirements.md`, `tasks.md` |
| `b4935fed` | leader | `progress/current.md` |
| `25f3664d` | leader | `specs/…/requirements.md` |
| `ab100341` | leader | `progress/current.md`, `progress/handoff_…md` |
| `f9f83b9d` | Codex | guarda |
| `00d43733` | Codex | `src/app/(tabs)/_layout.tsx` |
| `36bfbd9f` | Codex | `progress/impl_…md` (A), `specs/…/traceability.md` |

Codex tocó exactamente los 7 ficheros de la lista cerrada de tasks.md §Cierre.
Los commits del leader solo tocan `specs/` y `progress/`. No hay ficheros fuera
de la lista.

**NR1–NR5:** `git diff --stat e002a4a5 -- src/app/index.tsx src/app/_layout.tsx
src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx
src/screens/welcome src/i18n src/providers package.json bun.lock`
sale vacío (`exit=0`). Tampoco hay diff en `src/__tests__/ui-copy-table.ts`,
`src/__tests__/ui-language.test.ts`, `src/screens` ni `src/api`.

Las anclas de R1, R3 y E1, medidas en HEAD, coinciden todas. Entre ellas:
- `href="/welcome"` → 1 y `href="/login"` → 0 en `(tabs)/_layout.tsx`;
- en el test de `(tabs)/layout`: welcome → 1, login → 0, `it` antiguo → 0;
- `toBe('/login')` → 2, `toEqual(['(auth)'])` → 1, `['(auth)', 'reset-password']` → 0, `['welcome', 'reset-password']` → 1 y `await app;` → 4 en la guarda;
- `toBe('/login')` → 0 y `(auth)` → 0 en reminders-alerts.

La suite de `(tabs)/layout` sigue en 5 `it`.

## Trazabilidad

- R1–R4 tienen test (`archivo::nombre`, todos existen y nombran su R-id) y
  commits rojo y verde. Todos los hashes citados son ancestros de HEAD
  (`merge-base --is-ancestor` = 0), y sus asuntos coinciden con los citados.
- R2 y R3 citan los dos rojos que pide E1.2: el propio de cada uno y `f9f83b9d`.
- La fila de humo P1–P4/S1–S5 sigue «pendiente». Es correcto: es el gate del
  humano en dev build de Android, no una fila de R-id.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#149)
- [x] `progress/current.md` describe la sesión activa (con un cambio sin commitear del leader; ver hallazgo 4)
- [ ] N/A en esta revisión — la entrada de `progress/history.md` se escribe al cerrar la sesión

## Checklist C3 — Arquitectura
- [x] Esta zona de la app móvil no tiene capas domain/application/infrastructure. Es navegación de presentación (`src/app/`), y el cambio de producción es una línea en un layout
- [x] No hay imports nuevos ni dependencias nuevas (NR5: sin diff en `package.json` ni `bun.lock`)

## Checklist C4 — TDD
- [x] Cada R-id tiene al menos un test que lo nombra (`#149 R1`, `#149 R2`, `#149 R3`, `#149 R4`)
- [x] El historial va test primero: 4 rojos + el rojo de E1, luego un único verde de producción. Ningún rojo válido cae por `ReferenceError` ni por mutar un doble
- [x] El rojo contaminado de R3 (`e414fa6f`) está registrado en la Enmienda E1. Su rojo válido por aserción (`f9f83b9d`) está verificado arriba

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas de R-id pendientes. Solo queda pendiente la fila de humo, que es del humano
- [x] Commits con tipo convencional y R-ids. El formato sigue literalmente lo que prescribe tasks.md (ver hallazgo 2)

## Checklist C6 — Spec aprobada
- [x] `requirements.md` está en `status: approved`, con las casillas de D1/D2, spec y E1 marcadas y fechadas
- [x] Desde la firma `d361a8bb`, `requirements.md` solo tiene inserciones (66 líneas, la sección E1) y 0 borrados. E1 pasó el gate (`25f3664d`). R1–R4 no cambiaron

## Checklist C7 — Sin código huérfano
- [x] N/A — no reemplaza ningún componente. Cambia el destino de un `Redirect` y no deja rastro de `/login` en ese fichero (R4 lo comprueba)

## Checklist C8 — UI móvil
- [x] N/A en grep-clean, dimensiones, Skeleton, componentes, touch targets y animaciones: no se toca ninguna pantalla ni ningún estilo (NR6). El único fichero de producción es `src/app/(tabs)/_layout.tsx`, con una línea que solo cambia el destino del `href`

## Hallazgos

1. **Observación (defecto de la tabla de sondas de la spec, no de Codex).**
   Las filas de M3 en la tabla de R2 de tasks.md no se cumplen.
   - **Tal como está escrita**, la mutación llama a `usePathname()` dentro de
     la rama `unauthenticated`, lo que viola las reglas de hooks. En la guarda,
     las 5 filas de R2 (`/profile` incluida) caen por **excepción**
     (`Rendered more hooks than during the previous render.`), no por aserción.
   - **Con una variante legal** (M3b), que llama a `usePathname()` arriba del
     todo, caen también las 5 por aserción con `Received: "/login"`, y
     `/profile` tampoco pasa. Medido (M3c): en el render que redirige,
     `usePathname()` vale `"/"` y `useSegments()` vale `["(tabs)"]` en las
     cinco filas. El layout de tabs no sabe de qué tab viene cuando redirige.
   - **Por qué no es una zona ciega:** la premisa «la fila `/profile` pasa» no
     se puede reproducir. El destino se decide en un solo sitio que no recibe
     la tab como entrada. La navegación propia de cualquier pantalla a login la
     caza R4 (M4 y M5).
   - **Sugerencia para la spec o la memoria:** las mutaciones de sonda que
     metan hooks dentro de una rama condicional dan rojo por excepción. Hay
     que plantarlas con el hook arriba.
2. **Observación.** Los commits llevan el R-id dentro de la descripción
   (`test(mobile-auth): #149 R1 red, …`) y no al final entre paréntesis, que es
   el formato de `docs/conventions.md` §Commits. Los mensajes los prescribió
   tasks.md literalmente, y #116 (ya mergeada) usó la misma forma. No bloquea.
3. **Observación.** En R3, la reentrada usa `await waitFor(...)` para el
   pathname, mientras que `#95 R3` usa un `expect` síncrono. La spec no fija la
   forma. M8 demuestra que la aserción salta cuando la reentrada se cuela. Solo
   un rebote transitorio que acabe de vuelta en `['welcome']` pasaría sin
   verse, y eso no contradice R3, que habla del estado final. No bloquea.
4. **Observación.** En el worktree, `progress/current.md` tiene un cambio sin
   commitear que ya estaba antes de esta revisión. Es del leader: tiene que
   commitearlo junto con este fichero.
5. **Observación (gate pendiente).** La prueba de humo P1–P4/S1–S5 está sin
   firmar. Con este veredicto, R1–R4 quedan cerrados, pero la feature no puede
   pasar a `done` hasta que el humano firme el humo en dev build de Android.

Ningún hallazgo bloquea.
