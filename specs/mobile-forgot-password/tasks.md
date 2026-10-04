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
