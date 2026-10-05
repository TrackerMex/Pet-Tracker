# Tareas — [[mobile-forgot-password]]

> Un commit **rojo** (solo tests, `test(...)`) y un commit **verde**
> (implementación mínima, `feat(...)`/`refactor(...)`) por tarea, con el R-id en
> el mensaje (`docs/conventions.md`). Codex no mezcla tests + implementación +
> docs en un commit (C4 de `CHECKPOINTS.md`). Cada commit deja verde la suite
> global de `mobile-pet-tracker` (los candados de §Candados globales se mueven
> en la **misma** tarea que los desplaza).
>
> El orden garantiza que el sujeto de cada test existe cuando se escribe: el
> cliente antes que la pantalla, el catálogo antes que el copy, el route y el
> árbol estático antes que el estado.

## Antes de empezar

- [ ] `git fetch origin && git log -1 --format=%H origin/main` — anotar el hash
      en `progress/impl_mobile-forgot-password.md`. Si no es `b2a9c2aa`, medir
      cada ancla de `requirements.md` §Candados globales con `grep -n` y aplicar
      los deltas como **diferencias**.
- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` (si existe, avisar
      al humano; no borrarlo desde el sandbox).
- [ ] Solo `bun` / `bunx`. Nunca `npx`, `npm`, `yarn`.
- [ ] Filtros de jest con paréntesis escapados:
      `bunx jest 'src/app/\(auth\)/'` (o `--runTestsByPath`); comprobar el
      recuento de suites en la salida.

## T1 — R2: cliente `forgotPassword`

1. **Rojo**: en `src/api/__tests__/auth.test.ts`, `describe('#117 R2: forgotPassword mapea la respuesta por kind')`
   con los 7 `it` de R2 (importando `forgotPassword` y `ForgotPasswordState`
   que aún no existen: typecheck y suite rojos).
2. **Verde**: `ForgotPasswordRequest` en `src/api/types.ts`; `ForgotPasswordState`
   y `forgotPassword` en `src/api/auth.ts` (design.md §Cliente).
3. **Refactor**: compartir con `resetPassword` solo lo que ya está compartido
   (`postJson`, `readJson`, `validationErrors`); nada nuevo.

Comando: `cd mobile-pet-tracker && bunx jest src/api`.

## T2 — R1 (parte 1): seis claves nuevas

1. **Rojo**: `describe('#117 R1: …')` › `it` 1 en
   `src/providers/__tests__/language-provider.test.tsx` (seis claves, marcador,
   filas en `specs/mobile-ui-language/design.md` §2.1).
2. **Verde**: seis claves en `en` y `es` de `src/i18n/catalog.ts` con los
   literales exactos de R1; candado de longitud `+ 6` (comentario `#117 R1`);
   filas `← añadida por #117 (R1)` en `design.md` §2.1 (el bloque aún se llama
   `src/app/(auth)/forgot.tsx`; se renombra en T3).
3. **Refactor**: ninguno.

Comando: `bunx jest src/providers src/__tests__`.

## T3 — R3 + R1 (parte 2) + R9 reapuntados: route delgado, pantalla estática, muere el stub

1. **Rojo**:
   - crear `src/screens/forgot/index.test.tsx` con `renderRoute()` (§Convenciones
     de `requirements.md`), `describe('#117 R3: …')` `it` 1 y 2, y los dos `it`
     reapuntados `#61 R8` y `#127 R1` (mismos títulos, leyendo `forgot-form`);
   - `it` 2 de `#117 R1` en `language-provider.test.tsx`
     (`forgot.comingSoon` retirada);
   - `git rm src/app/(auth)/__tests__/forgot.test.tsx`.
2. **Verde**:
   - `src/screens/forgot/index.tsx` con el árbol de `design.md` en estado (a)
     **estático**: sin `useState` todavía, `forgot-submit` `isDisabled`
     constante, sin `forgot-error`, sin `forgot-resend`; KAV y `ScrollView`
     ya con sus `testID` (`screen-forgot`, `forgot-form`);
   - `src/app/(auth)/forgot.tsx` como route delgado;
   - retirar `forgot.comingSoon` del catálogo; candado de longitud `- 1`;
     `design.md` §2.1: fila marcada `← retirada por #117 (R1)`, bloque
     renombrado a `src/screens/forgot/index.tsx`, §1 filas movidas;
   - `ui-copy-table.ts`: las 5 filas de `src/app/(auth)/forgot.tsx` → 5 filas
     de `src/screens/forgot/index.tsx` (`forgotPassword`, `instructions`,
     `email`, `sendRecoveryLink`, `backToSignIn`); `R1_AUTH` sigue en 29
     (−5 +5); `SCREEN_FILES` `+ 1 - 1` con comentario;
   - `consistency-classnames.test.ts`: 4 rutas → `join('screens', 'forgot', 'index.tsx')`;
   - `legibility-classnames.test.ts`: ruta de `inkSites`.
3. **Refactor**: comprobar `grep -c Platform src/screens/forgot/index.tsx` = 0 y
   `grep -c "join('app', '(auth)', 'forgot.tsx')"` = 0 en los dos ficheros.

Comandos: `bunx jest src/screens/forgot src/providers src/__tests__ 'src/app/\(auth\)/'`
(la salida debe listar **login** y **register** bajo `(auth)`, y ninguna
suite `forgot` ahí).

## T4 — R4: estado del formulario

1. **Rojo**: `describe('#117 R4: el formulario pide el correo')`, `it` 1–3.
2. **Verde**: `useState` de `email`; `Input` controlado con sus props de
   teclado (sin `placeholder`); `isDisabled={email.trim() === ''}`.
3. **Refactor**: ninguno.

## T5 — R5: envío y «Revisa tu correo»

1. **Rojo**: `describe('#117 R5: …')`, `it` 1 y 2.
2. **Verde**: `submitting`, `sent`, `submittedEmail`; handler `send` solo con la
   rama `ok` (design.md §Handler, pasos 1, 2, 3-`ok`, 4); título y cuerpo
   condicionados por `sent`; `forgot-resend` **presente pero sin `onPress`
   útil todavía** (R6 lo cablea); `ui-copy-table.ts` `+ forgot.checkYourEmail`,
   `+ forgot.sentTo`, `+ forgot.resend` (3 filas; `R1_AUTH` → `29 + 3`).
3. **Refactor**: ninguno.

## T6 — R7: errores por `kind`

1. **Rojo**: `describe('#117 R7: …')`, `it.each` (5 filas) e `it` 2.
2. **Verde**: `error` state, `setError(null)` al arrancar, `switch` completo
   con fallthrough `error`/`missing-config` (D15), `Text testID="forgot-error"`;
   `ui-copy-table.ts` `+ forgot.invalidEmail`, `+ forgot.tooManyAttempts`,
   `+ common.cannotReachServer`, `+ common.somethingWentWrong` (4 filas;
   `R1_AUTH` → `29 + 3 + 4`, que se consolida como `29 + 7 // #117 R10`;
   título del `it` de `#65 R1` con el total).
3. **Refactor**: ninguno.

## T7 — R6: reenviar

1. **Rojo**: `describe('#117 R6: …')`, `it` 1 y 2.
2. **Verde**: `forgot-resend` llama `send(submittedEmail)` con
   `isDisabled={submitting}`; `forgot-error` se renderiza también con `sent`.
3. **Refactor**: ninguno.

## T8 — R8: teclado

1. **Rojo**: `describe('#117 R8: forgot se aparta del teclado en Android')`.
2. **Verde**: `HeaderHeightContext` + `keyboardVerticalOffset={headerHeight}`
   (si T3 ya lo dejó, el `it` nace verde: anotarlo en `progress/impl_…` y
   plantar la sonda M8-c para demostrar que muerde).
3. **Refactor**: ninguno.

## T9 — R9: métricas en los dos estados

1. **Rojo**: `describe('#117 R9: …')`.
2. **Verde**: normalmente nada (D10 ya lo garantiza); si nace verde, plantar
   M9-b y anotar.

## T10 — R11: anti-enumeración

1. **Rojo**: `describe('#117 R11: …')` en `auth.test.ts` y en
   `src/screens/forgot/index.test.tsx`.
2. **Verde**: normalmente nada; si nace verde, plantar M11-a y anotar.

## T11 — R10: barrido de candados y cierre

- [ ] Suite global de `mobile-pet-tracker` **sin pipe**: `bunx jest` y leer el
      exit code directamente (`docs/conventions.md`; memoria «exit code tras un
      pipe»). Repetir una segunda vez tras borrar la perf-cache de jest si la
      primera no fue limpia.
- [ ] `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`.
- [ ] Lint del proyecto (`bun run lint`).
- [ ] Anclas de R10 medidas y anotadas con su valor en `progress/impl_…`.
- [ ] Sondas de mutación: una por R-id como mínimo (las marcadas en cada tabla),
      plantadas y revertidas, con el `it` que cayó y si fue por consulta o por
      aserción, anotadas en `progress/impl_mobile-forgot-password.md`.
- [ ] `traceability.md` con hash de commit por fila (sin rebasear después).
- [ ] `graphify update .` (AST-only).

## No hacer

- No tocar `backend-pet-tracker/`, `src/app/index.tsx`, `src/app/_layout.tsx`,
  `src/app/welcome.tsx`, `src/screens/welcome/`, `login.tsx`, `register.tsx`,
  `reset-password`.
- No añadir dependencias. No `npx`. No `rm -f` sobre `.expo/`.
- No rebasear tras rellenar `traceability.md`.

## Enmienda E1 — candados de las ramas que faltaban

> Ronda 2, tras el rechazo del reviewer en `d39a9ea5` y el barrido previo a la
> firma (`progress/review_mobile-forgot-password.md`). Requisitos en
> `requirements.md` §Enmienda E1. **No hay código de producción que tocar.**
> Cada `it` o aseveración nueva nace verde, así que no hay commit rojo→verde:
> hay un commit `test(...)` por tarea y, antes de commitear, una sonda por fila
> o por aseveración que la tumba. La sonda se planta, se corre, se revierte con
> `git checkout HEAD -- <ruta>` y se comprueba que `git diff --cached --quiet`
> y `git diff --quiet -- <ruta de producción>` salen 0. El resultado se anota
> en `progress/impl_mobile-forgot-password.md` §Ronda 2: el `it` que cayó, y si
> cayó por consulta (`getBy…`/`findBy…` lanza) o por aserción (`expect` falla).
>
> Lista cerrada de ficheros de la ronda, medida con
> `git diff --name-only <H0 del handoff de la ronda 2>..HEAD`:
>
> - `mobile-pet-tracker/src/api/__tests__/auth.test.ts`
> - `mobile-pet-tracker/src/screens/forgot/index.test.tsx`
> - `specs/mobile-forgot-password/traceability.md`
> - `progress/impl_mobile-forgot-password.md`

### Antes de empezar (ronda 2)

- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts`.
- [ ] Base sin pipe: `cd mobile-pet-tracker && bunx jest src/api/__tests__/auth.test.ts src/screens/forgot/index.test.tsx`
      da 2 suites / 60 tests (40 + 20), exit 0. Anotarla.

### T12 — E1.1, R2: el resto de status

1. Añadir en `describe('#117 R2: forgotPassword mapea la respuesta por kind')`,
   justo después de `it('mapea 500 a error')`, el
   `it.each([201, 302, 404, 503])('mapea %i a error', …)` de E1.1, con
   `response(status, {})` y `resolves.toEqual({ kind: 'error' })`.
2. Sondas en `mobile-pet-tracker/src/api/auth.ts`, en `forgotPassword`, todas
   por aserción:

   | Sonda | Cambio | Debe caer |
   |---|---|---|
   | M2-f | `default:` devuelve `result.response.status >= 500 ? { kind: 'error' } : { kind: 'ok' }` | filas 201, 302 y 404 |
   | M2-g | `case 201:` justo debajo de `case 200:` | fila 201 |
   | M2-h | `case 503: return { kind: 'ok' };` antes de `default:` | fila 503 |
   | M2-i | `if (result.response.status >= 300 && result.response.status < 400) return { kind: 'ok' };` justo antes de `switch (result.response.status)` | fila 302 |

3. Commit: `test(mobile): lock every other status as error in the forgot client (#117 R2, E1)`.

Comando: `cd mobile-pet-tracker && bunx jest src/api/__tests__/auth.test.ts` (44 tests).

### T13 — E1.2, R6: el reenvío con cada kind que no es ok

1. Añadir en `describe('#117 R6: reenviar repite la misma petición')`, justo
   después de `it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»')`,
   el `it.each` de cuatro filas de E1.2. El cuerpo calca el del `it` del 429,
   cambiando el segundo `mockResolvedValueOnce` por `state` y el copy por `copy`.
2. Sondas en `send` de `mobile-pet-tracker/src/screens/forgot/index.tsx`.
   Todas caen **por consulta** en `screen.getByText('Revisa tu correo')`,
   porque `forgot-error` sí existe en el formulario:

   | Sonda | Cambio | Debe caer | Debe seguir verde |
   |---|---|---|---|
   | M6-e | `setSent(false);` antes de `setError(t('forgot.invalidEmail'));` | fila `validation` | el `it` del 429 |
   | M6-f | `setSent(false);` antes de `setError(t('common.cannotReachServer'));` | fila `unreachable` | el `it` del 429 |
   | M6-g | `setSent(false);` antes de `setError(t('common.somethingWentWrong'));` | filas `error` y `missing-config` | el `it` del 429 |

3. Commit: `test(mobile): lock resend errors for every non-ok kind (#117 R6, E1)`.

### T14 — E1.3, R7 + R4 + R6: el error se retira al arrancar, desde los dos botones

1. Añadir en `describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error')`,
   justo después de `it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»')`,
   los dos `it` de E1.3 con sus pasos literales. La promesa controlada se
   declara dentro de cada `it` igual que en el primer `it` de R6:
   `let resolveRequest!: (state: ForgotPasswordState) => void;` y
   `const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });`.
   Esperas según `docs/conventions.md` §Esperas: sobre `toBeDisabled` del
   botón; la lectura de `mock.calls[2][1]` va después de esa espera.
2. Sondas en `mobile-pet-tracker/src/screens/forgot/index.tsx`, todas por
   aserción:

   | Sonda | Cambio | Debe caer | Debe seguir verde |
   |---|---|---|---|
   | M7-h | quitar `setError(null);` de la cabecera de `send` y ponerlo como primera línea de `case 'ok':` | los dos `it` nuevos, en el `toBeNull` de `forgot-error` en vuelo | `it('un envío posterior que resuelve ok limpia forgot-error…')` |
   | M7-i | `if (!sent) setError(null);` en lugar de `setError(null);` | el `it` del reenvío | el `it` del formulario |
   | M4-f | `{sent \|\| submitting ? (` en lugar de `{sent ? (` (bloque de `forgot-resend`) | el `it` del formulario, en el `toBeNull` de `forgot-resend` en vuelo | — |
   | M6-h | `setSubmittedEmail(sent ? '' : target);` en `case 'ok':` | el `it` del reenvío, en el texto de `forgot-body` | — |
   | M6-i | `onPress={() => void send(error ? email : submittedEmail)}` en `forgot-resend` | el `it` del reenvío, en `mock.calls[2][1]` | — |

   La columna «Debe seguir verde» es la prueba de que el candado anterior
   estaba ciego: anotarla también.
3. Commit: `test(mobile): lock forgot-error clearing as soon as a new request starts (#117 R7, E1)`.

### T15 — E1.4, R9: props literales del ScrollView en los dos estados

1. Añadir en `describe('#117 R9: las métricas del stub sobreviven al cambio de estado')`,
   después del `it` que ya tiene, el `it` de E1.4.
2. Sondas sobre el `ScrollView` de `testID="forgot-form"` en
   `mobile-pet-tracker/src/screens/forgot/index.tsx`, todas por aserción:

   | Sonda | Cambio | Debe caer en |
   |---|---|---|
   | M9-e | `className={sent ? 'flex-1' : 'flex-1 bg-background'}` | la segunda aseveración de `className` |
   | M9-f | `contentInsetAdjustmentBehavior={sent ? 'never' : 'automatic'}` | la segunda aseveración de `contentInsetAdjustmentBehavior` |
   | M9-g | `className="flex-1"` | la primera aseveración de `className` |

3. Commit: `test(mobile): lock the forgot scroll container props in both states (#117 R9, E1)`.

### T16 — E1.6, R3: `link-login` desde «Revisa tu correo»

1. Añadir en `describe('#117 R3: la ruta forgot delega en ForgotScreen')`,
   después de `it('link-login navega a /login sin petición de red')`, el `it`
   de E1.6.
2. Sonda M3-e, por aserción: `onPress={() => router.push(sent ? '/' : '/login')}`
   en `link-login`. Cae el `it` nuevo; `it('link-login navega a /login sin petición de red')`
   sigue verde.
3. Commit: `test(mobile): lock link-login from the sent state (#117 R3, E1)`.

### T17 — E1.7, R5: el tile `Lock` en los dos estados

1. Añadir al final de `describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»')`
   el `it` de E1.7.
2. Sonda M5-g, por aserción: envolver el `<View className="size-16 items-center justify-center rounded-xl bg-accent-soft" …>`
   en `{!sent && ( … )}`. Cae la segunda comprobación del tile.
3. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`, exit 0, antes
   del commit.
4. Commit: `test(mobile): lock the Lock tile in both states (#117 R5, E1)`.

Comando de T13-T17: `cd mobile-pet-tracker && bunx jest src/screens/forgot` (29 tests).

### T18 — cierre de la ronda 2

- [ ] Suite global **sin pipe**: `cd mobile-pet-tracker && bunx jest`, exit 0,
      93 suites / 2049 tests. Si la base de `origin/main` cambió desde
      `d39a9ea5`, se aplica el +13 como diferencia sobre la base medida.
- [ ] Las 8 suites del handoff de la ronda 1: 285 tests, exit 0.
- [ ] `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`, exit 0.
- [ ] `bun run lint`, exit 0.
- [ ] `traceability.md`: añadir a las filas de R2, R3, R4, R5, R6, R7 y R9 el
      `it` nuevo o ampliado y el hash de su commit de E1, y una fila E1.5 que
      cite `7ba0b3a9`. Sin rebasear después.
- [ ] `progress/impl_mobile-forgot-password.md` §Ronda 2: base, sondas (tabla
      de cada tarea con su resultado), cifras finales y la lista de ficheros
      medida con `git diff --name-only`.
- [ ] Commit: `docs(mobile): trace #117 amendment E1 to its tests and commits`.
- [ ] `graphify update .`.

### No hacer (ronda 2)

- No tocar `src/screens/forgot/index.tsx`, `src/api/auth.ts` ni ningún otro
  fichero de producción. Las sondas se revierten antes de cada commit.
- No modificar ni renombrar los `it` existentes. E1.5 y E1.8 no generan commit.
- No rebasear.
