---
feature: "mobile-forgot-password"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-forgot-password]]

> Feature #117. Cierra la deuda que dejaron anotada `specs/auth-forgot-password/requirements.md`
> (§Deuda, punto 4) y `specs/auth-reset-deep-link/requirements.md` (deuda, punto 1):
> la pantalla `forgot` deja de ser un stub «disponible pronto» y pide de verdad
> el enlace de recuperación al backend.
>
> Base congelada: `b2a9c2aa` (= `origin/main` al arrancar). Branch
> `feature/117-mobile-forgot-password`. Todas las anclas de esta spec son por
> contenido grepeable, nunca por número de línea.

## Contexto

### Qué hay hoy (medido en `b2a9c2aa`)

- `mobile-pet-tracker/src/app/(auth)/forgot.tsx` es un stub: tile `Lock`, título
  `t('forgot.forgotPassword')`, aviso `t('forgot.comingSoon')`, `Input`
  `forgot-email` con `editable={false}`, `Button` `forgot-submit` siempre
  `isDisabled`, `LinkButton` `link-login`. Cinco llamadas `t(` en total.
- `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` tiene cuatro `it`
  (ver §Aserciones existentes que se reapuntan).
- `src/api/auth.ts` ya tiene el patrón a copiar: `resetPassword(baseUrl, body,
  fetchFn)` sobre `postJson` + `readJson` + `validationErrors`, con un `State`
  discriminado por `kind`.
- `src/screens/reset-password/index.tsx` ya es el patrón de pantalla a copiar:
  route delgado (`src/app/reset-password.tsx`), `KeyboardAvoidingView` host con
  `testID="screen-…"`, `ScrollView` interior, error en `text-danger` +
  `selectable`, `LinkButton` `link-login`.

### Contrato del backend (verificado en `backend-pet-tracker/src/modules/auth/`)

`POST /v1/auth/forgot-password` (`infrastructure/auth.controller.ts`, `@Public()`,
`@UseGuards(EmailRateLimitGuard)`, `@HttpCode(HttpStatus.OK)`):

| Respuesta | Cuándo | Cuerpo |
|---|---|---|
| `200` | siempre que el correo pase el DTO — exista la cuenta o no, falle o no el mailer (`request-password-reset.use-case.ts` hace `return;` silencioso si no hay usuario) | `{ requested: true }` |
| `400` | `application/dto/forgot-password.dto.ts`: `z.object({ email: z.email().max(320) })` | `{ errors: [{ path, message }] }` (zod) |
| `429` | `infrastructure/guards/email-rate-limit.guard.ts`: `FORGOT_PASSWORD_MAX_PER_EMAIL = 3` por `EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000` | `{ statusCode: 429, message: 'Too Many Requests' }` |

El TTL del token (`PASSWORD_RESET_TOKEN_TTL_MS`, 1 h) **no viaja** en la
respuesta; la app no lo conoce ni lo muestra. El enlace del correo es
`https://<RESET_LINK_HOST>/reset-password?token=…` (`infrastructure/email/password-reset-link.ts`)
y lo abre la pantalla de #59.

### Referencia de diseño

Patrón de `progress/explore_ui-appllama.md` §0 (reglas de adaptación 1–8) y §2
(#117): paso 1 = volver + título + explicación de 1–2 líneas + un solo campo +
CTA a todo lo ancho; paso 2 = la misma pantalla se convierte en «Revisa tu
correo» (cabecera + cuerpo que repite el correo + «Reenviar» secundario +
«Volver al inicio de sesión»); éxito idéntico exista o no la cuenta
(anti-enumeración). Ese fichero llega a `main` con la PR de #118 (commit
`711cfd19`); **no se copia a esta branch**.

Rige `docs/ui-guidelines.md`: solo tokens, `rounded-xl` en controles,
`--accent` relleno / `--accent-strong` tinta, `CONTINUOUS_CORNER` en el tile,
sin gradiente, sin emoji, sin dependencia nueva, componentes heroui-native.

## Convenciones de esta spec

- **Prefijo de `describe`**: `#117 R<n>: …` en todos los ficheros (acumulan
  R-ids de otras features — `docs/conventions.md` §Tests).
- **Fichero principal de tests**: `mobile-pet-tracker/src/screens/forgot/index.test.tsx`.
  Modelado sobre `src/screens/reset-password/index.test.tsx`: un `renderRoute()`
  async que monta `<LanguageProvider initial="es"><ForgotRoute /></LanguageProvider>`
  con `wrapper: HeroUINativeProvider`, importando `ForgotRoute` desde
  `'../../app/(auth)/forgot'` (así cada `it` prueba también la delegación del
  route). **Sin** contenedor de navegación: `HeaderHeightContext` queda
  `undefined` y el offset de la KAV es 0 (igual que `(auth)` en #148).
- **Mocks (intención, no copia)**: `jest.mock('../../api/auth')` exponiendo
  `forgotPassword` como `jest.fn()` (sin valor por defecto; cada `it` fija el
  suyo con `mockResolvedValue` / `mockResolvedValueOnce` / promesa controlada);
  `expo-router` con `router.push` espiado; `react-native-safe-area-context` con
  insets `{ top: 40, right: 0, bottom: 24, left: 0 }` (los mismos que el stub
  para que las métricas de §R9 den 52/48); `process.env.EXPO_PUBLIC_API_URL`
  fijado en `beforeEach` a `'http://api.test/v1'` y restaurado en `afterEach`,
  como hace `login.test.tsx` con `apiUrl`. `Platform.OS` se voltea **dentro**
  del `it` de R8 y se restaura en `afterEach` con `originalOS` (patrón de
  `reset-password/index.test.tsx`).
- **Esperas**: `docs/conventions.md` §Esperas — se espera sobre el árbol
  (`findBy*` / `waitFor` sobre el nodo), nunca sobre el contador del mock.
- **Consulta vs aserción**: en cada tabla de sondas se dice si la mutación cae
  por **consulta** (`getByTestId`/`findBy*` no encuentra el nodo) o por
  **aserción** (el nodo existe y el `expect` falla). Las sondas con
  `queryByTestId(...)).toBeNull()` caen por aserción.
- **Literales**: todos los textos esperados en los tests son los literales `es`
  de la tabla de R1 (el `LanguageProvider` monta en `es`).
- **Nombres**: componente `ForgotScreen` (export con nombre) en
  `src/screens/forgot/index.tsx`; route `ForgotRoute` (default) en
  `src/app/(auth)/forgot.tsx`; cliente `forgotPassword` y tipo
  `ForgotPasswordState` en `src/api/auth.ts`; `ForgotPasswordRequest` en
  `src/api/types.ts`.

## Requisitos

### R1 — El catálogo trae el copy de recuperar contraseña

**EARS**

- THE SYSTEM SHALL registrar en `mobile-pet-tracker/src/i18n/catalog.ts`, en
  `en` y en `es`, exactamente estas seis claves nuevas con estos literales:

| Clave | en | es |
|---|---|---|
| `forgot.instructions` | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
| `forgot.checkYourEmail` | `Check your email` | `Revisa tu correo` |
| `forgot.sentTo` | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
| `forgot.resend` | `Resend` | `Reenviar` |
| `forgot.invalidEmail` | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
| `forgot.tooManyAttempts` | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |

- THE SYSTEM SHALL retirar `forgot.comingSoon` de los dos idiomas (se retira en
  la tarea de R3, cuando muere el stub que la usa — ver `tasks.md`).
- THE SYSTEM SHALL conservar sin cambios `forgot.forgotPassword`,
  `forgot.email`, `forgot.sendRecoveryLink`, `forgot.backToSignIn`,
  `common.cannotReachServer` y `common.somethingWentWrong`.
- `forgot.sentTo` SHALL llevar el marcador `{{email}}` en los dos idiomas (lo
  comprueba además el `it` existente de `markerNames` en el mismo fichero).
- THE SYSTEM SHALL añadir las seis claves a `specs/mobile-ui-language/design.md`
  §2.1 con la convención `← añadida por #117 (R1)` y marcar `forgot.comingSoon`
  con `← retirada por #117 (R1)` (detalle en §Candados globales).

**Test** — `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`,
`describe('#117 R1: el catálogo trae las claves de recuperar contraseña')`,
modelado sobre `describe('#146 R1: …')` del mismo fichero (array de
`[clave, en, es]`, lectura de `../specs/mobile-ui-language/design.md` y
`toContain(clave)` por fila):

1. `it('registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma')`
2. `it('retira forgot.comingSoon de los dos idiomas')` —
   `expect(english['forgot.comingSoon']).toBeUndefined()` y lo mismo en `es`.

Además el candado de longitud del mismo fichero (`expect(englishKeys).toHaveLength(260 + 16 + … + 9 + 9, // #105 R5`)
recibe `+ 6 - 1` con comentario `// #117 R1` (ver §Candados globales).

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M1-a: `es` de `forgot.resend` = `'Reenviar enlace'` | `it` 1 | aserción (`toBe` del literal es) |
| M1-b: dejar `forgot.comingSoon` en el catálogo | `it` 2 y el candado de longitud | aserción (`toBeUndefined` / `toHaveLength`) |
| M1-c: `{{correo}}` solo en `es` de `forgot.sentTo` | `it` 1 y el `it` existente de `markerNames` | aserción |
| M1-d: olvidar la fila de `forgot.invalidEmail` en `design.md` §2.1 | `it` 1 | aserción (`toContain`) |

### R2 — Cliente `forgotPassword` mapeado por `kind`

**EARS**

- THE SYSTEM SHALL exportar desde `mobile-pet-tracker/src/api/types.ts`
  `ForgotPasswordRequest = { email: string }`.
- THE SYSTEM SHALL exportar desde `mobile-pet-tracker/src/api/auth.ts`:
  ```
  ForgotPasswordState =
    | { kind: 'ok' }
    | { kind: 'rate-limited' }
    | { kind: 'validation'; errors: FieldError[] }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };
  forgotPassword(baseUrl: string | undefined, body: ForgotPasswordRequest, fetchFn: typeof fetch = fetch): Promise<ForgotPasswordState>
  ```
  con la misma firma y fontanería que `resetPassword` (`postJson` + `readJson` +
  `validationErrors`).
- IF `baseUrl` es `undefined` o `''` THEN THE SYSTEM SHALL devolver
  `{ kind: 'missing-config' }` sin invocar `fetchFn`.
- WHEN se invoca con `baseUrl` THE SYSTEM SHALL hacer
  `postJson(baseUrl, '/auth/forgot-password', body, fetchFn)` (URL resultante
  `http://example.test/v1/auth/forgot-password` con la `baseUrl` del fichero de
  tests; opciones `{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }`).
- WHEN `status` es `200` THE SYSTEM SHALL devolver `{ kind: 'ok' }` **sin leer
  el cuerpo** (`response.json` no se invoca).
- WHEN `status` es `429` THE SYSTEM SHALL devolver `{ kind: 'rate-limited' }`
  sin leer el cuerpo.
- WHEN `status` es `400` y `validationErrors(await readJson(response))` devuelve
  errores THE SYSTEM SHALL devolver `{ kind: 'validation', errors }`.
- WHEN `status` es `400` sin `errors` (o con JSON inválido) THE SYSTEM SHALL
  devolver `{ kind: 'error' }` (decisión D2: un 400 que no viene de zod no
  existe en el contrato; no se inventa un kind para él).
- WHEN `status` es cualquier otro (`500`, `404`, `503`…) THE SYSTEM SHALL
  devolver `{ kind: 'error' }`.
- WHEN `fetchFn` rechaza THE SYSTEM SHALL devolver
  `{ kind: 'unreachable', message }` (lo que ya hace `postJson`).
- THE SYSTEM SHALL no lanzar en ninguna de las ramas anteriores; ningún `kind`
  depende de si el correo existe (D8).

**Test** — `mobile-pet-tracker/src/api/__tests__/auth.test.ts`,
`describe('#117 R2: forgotPassword mapea la respuesta por kind')`, con los
helpers `response(status, body)` e `invalidJsonResponse(status)` ya presentes y
`const forgotPasswordEndpoint = 'http://example.test/v1/auth/forgot-password'`:

1. `it('hace POST a /auth/forgot-password con { email } y mapea 200 a ok sin leer el body')` —
   `toHaveBeenCalledWith(forgotPasswordEndpoint, { method, headers, body })`;
   `toEqual({ kind: 'ok' })`; `expect(res.json).not.toHaveBeenCalled()`.
2. `it('mapea 429 a rate-limited sin leer el body')` —
   `response(429, { statusCode: 429, message: 'Too Many Requests' })`.
3. `it('mapea un 400 con errors de zod a validation')` —
   `errors: [{ path: 'email', message: 'Invalid email' }]` y `toEqual({ kind: 'validation', errors })`.
4. `it('mapea un 400 sin errors a error')` — `response(400, {})`.
5. `it('mapea 500 a error')`.
6. `it('mapea un rechazo de fetch a unreachable')` — `mockRejectedValue(new Error('network down'))`, `toEqual({ kind: 'unreachable', message: 'network down' })`.
7. `it.each([undefined, ''])('mapea base URL ausente %p a missing-config sin hacer fetch')`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M2-a: 429 cae en la rama `error` | `it` 2 | aserción (`toEqual`) |
| M2-b: leer `readJson` antes del `switch` (también en 200) | `it` 1 y 2 | aserción (`not.toHaveBeenCalled`) |
| M2-c: path `'/auth/forgot'` | `it` 1 | aserción (`toHaveBeenCalledWith`) |
| M2-d: 400 sin errors → `validation` con `errors: []` | `it` 4 | aserción |
| M2-e: omitir el guard de `baseUrl` | `it` 7 (ambas filas) | aserción (`fetchFn` llamado / `kind`) |

### R3 — Route delgado y pantalla propia; el stub muere

**EARS**

- THE SYSTEM SHALL dejar `mobile-pet-tracker/src/app/(auth)/forgot.tsx` como
  route delgado: importa `{ ForgotScreen }` desde `'../../screens/forgot'` y
  exporta por defecto `ForgotRoute` que devuelve `<ForgotScreen />`. Sin `t(`,
  sin `useThemeColors`, sin JSX propio (igual que `src/app/reset-password.tsx`).
- THE SYSTEM SHALL crear `mobile-pet-tracker/src/screens/forgot/index.tsx` con
  la pantalla completa (árbol en `design.md` §Árbol), conservando del stub el
  tile (`<View className="size-16 items-center justify-center rounded-xl bg-accent-soft" style={CONTINUOUS_CORNER}><Lock size={28} color={accentStrong} /></View>`),
  la importación `import { useThemeColors } from '../../theme/use-theme-colors';`
  y `const [accentStrong] = useThemeColors(['accent-strong']);` —
  literales idénticos porque `src/screens/forgot/index.tsx` está a la misma
  profundidad que `src/app/(auth)/forgot.tsx` y los candados de
  `consistency-classnames.test.ts` solo cambian de ruta.
- THE SYSTEM SHALL retirar `forgot.comingSoon` del catálogo (R1 `it` 2) y del
  árbol: el texto `La recuperación de contraseña estará disponible pronto` no se
  renderiza.
- THE SYSTEM SHALL eliminar `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx`
  (`git rm`); sus cuatro `it` se reapuntan en §Aserciones existentes que se
  reapuntan. Decisión: se retira entero y no se reduce, porque cada `it` de la
  pantalla ya monta a través del route (misma elección que
  `reset-password/index.test.tsx`) y un segundo fichero solo duplicaría.
- WHEN se pulsa `link-login` THE SYSTEM SHALL invocar `router.push('/login')`
  sin invocar `forgotPassword`.
- `grep -c "Platform" src/screens/forgot/index.tsx` SHALL ser `0` (sin rama por
  plataforma, como en #148).

**Test** — `mobile-pet-tracker/src/screens/forgot/index.test.tsx`,
`describe('#117 R3: la ruta forgot delega en ForgotScreen')`:

1. `it('renderiza screen-forgot y forgot-form con el título desde la ruta y sin el aviso del stub')` —
   `getByTestId('screen-forgot')`, `getByTestId('forgot-form')`,
   `getByText('Recuperar contraseña')`,
   `expect(screen.queryByText('La recuperación de contraseña estará disponible pronto')).toBeNull()`.
2. `it('link-login navega a /login sin petición de red')` — `fireEvent.press(getByTestId('link-login'))`,
   `expect(mockRouter.push).toHaveBeenCalledWith('/login')`,
   `expect(mockForgotPassword).not.toHaveBeenCalled()`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M3-a: el route conserva el stub y no importa `ForgotScreen` | `it` 1 | consulta (`getByTestId('forgot-form')`) |
| M3-b: dejar `t('forgot.comingSoon')` en la pantalla | `it` 1 y `checkUses` (fila no declarada) | aserción (`toBeNull`) / aserción (`checkUses`) |
| M3-c: tile con `rounded-2xl` | `'lleva los tres tiles restantes a rounded-xl'` en `consistency-classnames` | aserción (`toContain`) |
| M3-d: `link-login` con `router.replace` | `it` 2 | aserción (`push` no llamado) |

### R4 — Estado (a): el formulario pide el correo

**EARS**

- WHILE no se ha enviado (`sent === false`) THE SYSTEM SHALL renderizar:
  `Text testID="forgot-title"` con `t('forgot.forgotPassword')`
  (`Recuperar contraseña`); `Text testID="forgot-body"` con
  `t('forgot.instructions')`; `TextField className="w-full"` con `Label`
  `t('forgot.email')` e `Input testID="forgot-email"` **editable**
  (sin `editable={false}`), `className="rounded-xl bg-default"`,
  `autoCapitalize="none"`, `keyboardType="email-address"`,
  `autoComplete="email"`, `textContentType="emailAddress"`, sin `placeholder`;
  `Button testID="forgot-submit" className="w-full rounded-xl bg-accent"` con
  `Button.Label className="font-bold text-accent-foreground"` =
  `t('forgot.sendRecoveryLink')`; `LinkButton testID="link-login"` con
  `LinkButton.Label className="font-semibold text-accent-strong"` =
  `t('forgot.backToSignIn')`.
- WHILE `email.trim() === ''` THE SYSTEM SHALL mantener `forgot-submit`
  `isDisabled`; WHEN el usuario escribe un valor con contenido THE SYSTEM SHALL
  habilitarlo.
- WHILE no se ha enviado THE SYSTEM SHALL no renderizar `forgot-resend` ni
  `forgot-error`.

**Test** — `src/screens/forgot/index.test.tsx`,
`describe('#117 R4: el formulario pide el correo')`:

1. `it('pinta título, instrucciones y forgot-email editable con sus props de teclado')` —
   `getByTestId('forgot-title')` `toHaveTextContent('Recuperar contraseña')`;
   `getByTestId('forgot-body')` `toHaveTextContent('Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.')`;
   `getByText('Correo electrónico')`; sobre `getByTestId('forgot-email').props`:
   `editable` `not.toBe(false)`, `autoCapitalize` `toBe('none')`,
   `keyboardType` `toBe('email-address')`, `autoComplete` `toBe('email')`,
   `textContentType` `toBe('emailAddress')`, `placeholder` `toBeUndefined()`.
2. `it('deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir')` —
   inicial `toBeDisabled()`; `changeText('   ')` → sigue `toBeDisabled()`;
   `changeText('ana@example.com')` → `not.toBeDisabled()`; `changeText('')` →
   `toBeDisabled()`.
3. `it('sin enviar no existen forgot-resend ni forgot-error')` —
   `queryByTestId` de ambos `toBeNull()`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M4-a: `isDisabled={submitting}` sin la condición de vacío | `it` 2 y el `#127 R1` reapuntado (la clase pierde `disabled:element-disabled`) | aserción |
| M4-b: `email === ''` sin `trim()` | `it` 2 (paso `'   '`) | aserción |
| M4-c: quitar `autoComplete="email"` | `it` 1 | aserción |
| M4-d: dejar `editable={false}` del stub | `it` 1 (`editable`) y R5 (`changeText` no cambia el estado) | aserción |
| M4-e: renderizar `forgot-resend` siempre | `it` 3 | aserción (`toBeNull`) |

### R5 — Enviar pasa la pantalla a «Revisa tu correo»

**EARS**

- WHEN se pulsa `forgot-submit` con `forgot-email` = `'  Ana@Example.com '`
  THE SYSTEM SHALL invocar **una vez**
  `forgotPassword(process.env.EXPO_PUBLIC_API_URL, { email: 'Ana@Example.com' })`
  (recorte de espacios; sin pasar a minúsculas — normaliza el backend).
- WHILE la petición vuela THE SYSTEM SHALL mantener `forgot-submit` `isDisabled`
  (`isDisabled={email.trim() === '' || submitting}`) y el campo en el árbol.
- WHEN el resultado es `{ kind: 'ok' }` THE SYSTEM SHALL pasar a `sent === true`
  guardando el correo enviado (`submittedEmail`) y renderizar en el **mismo**
  `forgot-form`: `forgot-title` = `t('forgot.checkYourEmail')`
  (`Revisa tu correo`); `forgot-body` = `t('forgot.sentTo', { email: submittedEmail })`
  (`Si existe una cuenta para Ana@Example.com, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.`);
  **sin** `forgot-email` ni `forgot-submit`; con
  `Button testID="forgot-resend" variant="secondary" className="w-full rounded-xl"`
  y `Button.Label className="font-bold text-foreground"` = `t('forgot.resend')`
  habilitado; con `link-login`; sin `forgot-error`. El tile `Lock` se conserva.
- THE SYSTEM SHALL no arrancar ningún temporizador ni mostrar TTL alguno
  (fuera de alcance).

**Test** — `src/screens/forgot/index.test.tsx`,
`describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»')`:

1. `it('envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición')` —
   promesa controlada (`let resolveRequest!: (state: ForgotPasswordState) => void; mockForgotPassword.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }))`),
   `changeText('  Ana@Example.com ')`, `press(forgot-submit)`,
   `await waitFor(() => expect(getByTestId('forgot-submit')).toBeDisabled())`,
   `expect(mockForgotPassword).toHaveBeenCalledTimes(1)`,
   `expect(mockForgotPassword).toHaveBeenCalledWith(apiUrl, { email: 'Ana@Example.com' })`,
   `getByTestId('forgot-email')` sigue; `await act(async () => { resolveRequest({ kind: 'ok' }); })`;
   `await screen.findByText('Revisa tu correo')`.
2. `it('tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit')` —
   `mockResolvedValue({ kind: 'ok' })`; tras `findByText('Revisa tu correo')`:
   `forgot-body` `toHaveTextContent(<literal sentTo con Ana@Example.com>)`,
   `queryByTestId('forgot-email')` y `queryByTestId('forgot-submit')` `toBeNull()`,
   `getByTestId('forgot-resend')` `not.toBeDisabled()`, `getByTestId('link-login')`,
   `queryByTestId('forgot-error')` `toBeNull()`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M5-a: enviar sin `trim()` | `it` 1 | aserción (`toHaveBeenCalledWith`) |
| M5-b: enviar `email.toLowerCase()` | `it` 1 | aserción |
| M5-c: no deshabilitar en vuelo | `it` 1 | aserción (`waitFor(toBeDisabled)` agota) |
| M5-d: conservar el campo y el botón en el estado enviado | `it` 2 | aserción (`toBeNull`) |
| M5-e: `t('forgot.sentTo')` sin `{ email }` | `it` 2 | aserción (`toHaveTextContent`, queda `{{email}}` literal) |
| M5-f: olvidar `setSent(true)` | `it` 1 y 2 | consulta (`findByText('Revisa tu correo')` agota) |

### R6 — Reenviar repite la misma petición sin salir de «Revisa tu correo»

**EARS**

- WHILE `sent === true` WHEN se pulsa `forgot-resend` THE SYSTEM SHALL invocar
  de nuevo `forgotPassword` con el **mismo** segundo argumento que la primera
  llamada (`{ email: submittedEmail }`) y mantener `forgot-resend` `isDisabled`
  mientras vuela.
- WHEN el reenvío resuelve `ok` THE SYSTEM SHALL permanecer en el estado
  enviado (mismo título y cuerpo) con `forgot-resend` habilitado de nuevo.
- IF el reenvío resuelve un `kind` distinto de `ok` THEN THE SYSTEM SHALL
  renderizar `forgot-error` con el copy de la tabla de R7 **y** permanecer en el
  estado enviado (título `Revisa tu correo`, `forgot-resend` presente y
  habilitado, sin `forgot-email`).

**Test** — `src/screens/forgot/index.test.tsx`,
`describe('#117 R6: reenviar repite la misma petición')`:

1. `it('forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela')` —
   `mockResolvedValueOnce({ kind: 'ok' })` para el envío; promesa controlada
   para el reenvío; `press(forgot-resend)`;
   `await waitFor(() => expect(getByTestId('forgot-resend')).toBeDisabled())`;
   `expect(mockForgotPassword).toHaveBeenCalledTimes(2)`;
   `expect(mockForgotPassword.mock.calls[1][1]).toEqual(mockForgotPassword.mock.calls[0][1])`;
   resolver `ok`; `await waitFor(() => expect(getByTestId('forgot-resend')).not.toBeDisabled())`;
   `getByText('Revisa tu correo')`.
2. `it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»')` —
   `mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce({ kind: 'rate-limited' })`;
   `press(forgot-resend)`; `await findByTestId('forgot-error')`
   `toHaveTextContent('Demasiados intentos. Inténtalo más tarde.')`;
   `getByText('Revisa tu correo')`; `queryByTestId('forgot-email')` `toBeNull()`;
   `await waitFor(() => expect(getByTestId('forgot-resend')).not.toBeDisabled())`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M6-a: reenviar con `{ email: email }` tras vaciar el estado del campo (`setEmail('')` al pasar a enviado) | `it` 1 | aserción (`toEqual` de los argumentos) |
| M6-b: `setSent(false)` en cualquier `kind` ≠ `ok` | `it` 2 | consulta (`getByText('Revisa tu correo')`) y aserción (`toBeNull` de `forgot-email`) |
| M6-c: `forgot-resend` sin `isDisabled={submitting}` | `it` 1 | aserción (`waitFor(toBeDisabled)` agota) |
| M6-d: `forgot-error` solo en la rama del formulario | `it` 2 | consulta (`findByTestId('forgot-error')` agota) |

### R7 — Cada `kind` distinto de `ok` pinta su copy en `forgot-error`

**EARS**

- WHEN en el estado (a) el resultado tiene un `kind` distinto de `ok` THE SYSTEM
  SHALL renderizar `<Text testID="forgot-error" className="text-danger" selectable>`
  con este copy, y nada más del cuerpo del resultado (el `errors` de
  `validation` se ignora — D4):

| `kind` | Clave | es |
|---|---|---|
| `validation` | `forgot.invalidEmail` | `Ingresa un correo electrónico válido` |
| `rate-limited` | `forgot.tooManyAttempts` | `Demasiados intentos. Inténtalo más tarde.` |
| `error` | `common.somethingWentWrong` | `Algo salió mal` |
| `unreachable` | `common.cannotReachServer` | `No se pudo conectar con el servidor` |
| `missing-config` | `common.somethingWentWrong` | `Algo salió mal` |

- `error` y `missing-config` SHALL compartir **una sola** llamada
  `t('common.somethingWentWrong')` (`case 'error': case 'missing-config':` con
  fallthrough): el recuento de `checkUses` de §Candados globales cuenta 1.
- WHILE se muestra `forgot-error` en el estado (a) THE SYSTEM SHALL conservar el
  formulario: `forgot-title` = `Recuperar contraseña`, `forgot-email` con el
  valor escrito, `forgot-submit` habilitado de nuevo al terminar, sin
  `forgot-resend`.
- WHEN arranca un envío nuevo THE SYSTEM SHALL limpiar `forgot-error`
  (`setError(null)` antes de la petición); WHEN ese envío resuelve `ok` THE
  SYSTEM SHALL mostrar el estado enviado sin `forgot-error`.

**Test** — `src/screens/forgot/index.test.tsx`,
`describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error')`:

1. `it.each<[ForgotPasswordState, string]>([...])('mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie')`
   con cinco filas (la de `validation` con
   `errors: [{ path: 'email', message: 'Invalid email' }]`); cada fila:
   `changeText('ana@example.com')`, `press(forgot-submit)`,
   `const error = await findByTestId('forgot-error')`;
   `toHaveTextContent(copy)`; `expect(error.props.selectable).toBe(true)`;
   `getByTestId('forgot-title')` `toHaveTextContent('Recuperar contraseña')`;
   `getByTestId('forgot-email').props.value` `toBe('ana@example.com')`;
   `await waitFor(() => expect(getByTestId('forgot-submit')).not.toBeDisabled())`;
   `queryByTestId('forgot-resend')` `toBeNull()`.
2. `it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»')` —
   `mockResolvedValueOnce({ kind: 'error' }).mockResolvedValueOnce({ kind: 'ok' })`;
   tras el primer `findByTestId('forgot-error')`, segundo `press`;
   `await findByText('Revisa tu correo')`; `queryByTestId('forgot-error')` `toBeNull()`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M7-a: `validation` → unir `errors[].message` como hace reset-password | fila 1 | aserción (`toHaveTextContent` del literal del catálogo) |
| M7-b: `rate-limited` cae en `somethingWentWrong` | fila 2 | aserción |
| M7-c: quitar `selectable` | las cinco filas | aserción (`props.selectable`) |
| M7-d: `setSent(true)` también en error | las cinco filas | aserción (`forgot-title`) |
| M7-e: omitir `setError(null)` al arrancar | `it` 2 | aserción (`toBeNull`) |
| M7-f: `unreachable` → `somethingWentWrong` | fila 4 | aserción |
| M7-g: dos llamadas `t('common.somethingWentWrong')` (una por `case`) | `checkUses(R1_AUTH)` en `ui-language.test.ts` | aserción (recuento 2 ≠ 1 fila) |

### R8 — La pantalla se aparta del teclado en Android

**EARS**

- THE SYSTEM SHALL envolver el `ScrollView` en
  `<KeyboardAvoidingView testID="screen-forgot" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>`
  con `const headerHeight = useContext(HeaderHeightContext);` — misma
  importación de `HeaderHeightContext` que `src/screens/reset-password/index.tsx`
  (grep `HeaderHeightContext` ahí; no se copia de memoria).
- WHEN el teclado se abre (evento `keyboardDidShow` con `endCoordinates.screenY = 500`
  sobre un host de `height: 700`) y sin `HeaderHeightContext` provisto THE
  SYSTEM SHALL dar al host `paddingBottom: 200`; en reposo `paddingBottom: 0`.

**Test** — `src/screens/forgot/index.test.tsx`,
`describe('#117 R8: forgot se aparta del teclado en Android')`,
`it('el host screen-forgot añade paddingBottom 200 al abrir el teclado')`,
calcado en intención de `#148 R3` en `reset-password/index.test.tsx`:
`(Platform as { OS: string }).OS = 'android'` dentro del `it` (restaurado en
`afterEach`), `await renderRoute()`, `host = getByTestId('screen-forgot')`,
`toHaveStyle({ paddingBottom: 0 })`, `fireEvent(host, 'layout', { … height: 700 })`,
`DeviceEventEmitter.emit('keyboardDidShow', { … endCoordinates: { screenY: 500, height: 300 } … })`
dentro de `act`, `await waitFor(() => expect(getByTestId('screen-forgot')).toHaveStyle({ paddingBottom: 200 }))`.

**Sondas de mutación** (tabla de #148, misma lógica)

| Sonda | Qué cae | Cómo |
|---|---|---|
| M8-a: quitar la KAV y devolver `testID="screen-forgot"` al ScrollView | R8 (host sin clave `paddingBottom`), R3 `it` 1 y los `it` reapuntados | aserción (`toHaveStyle({ paddingBottom: 0 })`) / consulta (`getByTestId('forgot-form')`) |
| M8-b: `behavior={Platform.OS === 'ios' ? 'padding' : undefined}` | R8 y el `grep -c Platform` = 0 de R3 | aserción (host inerte sin clave) |
| M8-c: `keyboardVerticalOffset={91}` literal | R8 | aserción (`waitFor` ve 291) |

### R9 — Las métricas del stub sobreviven en los dos estados

**EARS**

- THE SYSTEM SHALL renderizar un único
  `<ScrollView testID="forgot-form" className="flex-1 bg-background" keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>`
  para los dos estados (con los insets del mock: `paddingTop: 52`, `paddingBottom: 48`).
- El `contentContainerStyle` SHALL ser **igual** (`toEqual`) antes y después de
  pasar a `Revisa tu correo`.

**Test** — `src/screens/forgot/index.test.tsx`:

- Reapuntados (misma `describe`/`it` que hoy, ver §Aserciones existentes):
  `'#61 R8: forgot tiene contenedor de scroll con safe areas'` ›
  `'conserva el centrado de hoy dentro de un ScrollView con insets'` (lee
  `getByTestId('forgot-form')`) y
  `'#127 R1: el botón de envío de forgot lleva su receta en el árbol'` ›
  `'pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente'`.
- Nuevo: `describe('#117 R9: las métricas del stub sobreviven al cambio de estado')`,
  `it('«Revisa tu correo» conserva el mismo contentContainerStyle y keyboardShouldPersistTaps')` —
  captura `props.contentContainerStyle` de `forgot-form` antes del envío,
  `mockResolvedValue({ kind: 'ok' })`, envía, `findByText('Revisa tu correo')`,
  `expect(getByTestId('forgot-form').props.contentContainerStyle).toEqual(antes)`
  y `keyboardShouldPersistTaps` `toBe('handled')`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M9-a: `padding: 20` | `#61 R8` reapuntado | aserción (`toEqual`) |
| M9-b: segundo `ScrollView` para el estado enviado sin `alignItems` | R9 nuevo | aserción (`toEqual`) |
| M9-c: quitar `keyboardShouldPersistTaps` | `#61 R8` reapuntado y R9 nuevo | aserción (`toBe('handled')` recibe `undefined`) |
| M9-d: `className="w-full rounded-xl"` → `"w-full"` en `forgot-submit` | `#127 R1` reapuntado y `#120 R1` en `consistency-classnames` | aserción |

### R10 — Los candados globales se reapuntan con deltas declarados

**EARS**

- THE SYSTEM SHALL dejar verdes `src/__tests__/ui-language.test.ts`,
  `src/__tests__/ui-copy-table.ts` (su `it` de suma), `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/legibility-classnames.test.ts`, `src/__tests__/design-drift.test.ts`
  y `src/providers/__tests__/language-provider.test.tsx` aplicando **solo** los
  deltas de §Candados globales, cada uno con comentario `// #117 R<n>`.
- THE SYSTEM SHALL dejar `grep -c "join('app', '(auth)', 'forgot.tsx')"` en `0`
  sobre `consistency-classnames.test.ts` y `legibility-classnames.test.ts`
  (medido hoy: 4 y 1 respectivamente), y `grep -c "src/app/(auth)/forgot.tsx"`
  en `0` sobre `ui-copy-table.ts` (hoy: 5).
- THE SYSTEM SHALL dejar `grep -ci forgot` en `0` sobre
  `design-drift.test.ts` (medido hoy: 0; nada se añade ahí). Sobre
  `ui-language.test.ts` (medido hoy: 0) las únicas ocurrencias nuevas SHALL
  estar en el comentario del delta de `SCREEN_FILES` (§Candados globales),
  ninguna en código ni en tablas.

**Test** — los `it` existentes de esos ficheros (trazabilidad en
`traceability.md`, fila R10). No hay `it` nuevo: el candado es que la suite
global pasa con los deltas y no con otros.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M10-a: fila `forgot.resend` ausente en `R1_AUTH` | `checkUses(R1_AUTH)`, `checkUses(ALL_USES)` y `toHaveLength(29 + 7)` | aserción |
| M10-b: `+ 6` sin `- 1` en el candado de longitud | `#65 R12` en `language-provider` | aserción |
| M10-c: dejar la fila `[join('app','(auth)','forgot.tsx'), 1]` en `inkSites` | `#61 R4` (`readSource` de un fichero sin `text-accent-strong`) | aserción (0 ≠ 1) |

### R11 — Anti-enumeración: el éxito no depende del cuerpo ni del correo

**EARS**

- WHEN el backend responde `200` con **cualquier** cuerpo (incluido
  `{ requested: false }` o JSON inválido) THE SYSTEM SHALL devolver
  `{ kind: 'ok' }` sin leerlo.
- WHEN dos correos distintos reciben `ok` THE SYSTEM SHALL renderizar el mismo
  `forgot-title` y el mismo `forgot-body` salvo por el correo citado.
- THE SYSTEM SHALL no contener en `src/screens/forgot/index.tsx` ni en las
  claves de R1 ningún copy que afirme o niegue la existencia de la cuenta
  (el cuerpo de `forgot.sentTo` dice «Si existe…», nunca «no existe»).

**Test**

- `src/api/__tests__/auth.test.ts`, `describe('#117 R11: ok no depende del cuerpo')`,
  `it.each([{ requested: false }, {}])('mapea 200 con body %p a ok sin leer el body')`
  más `it('mapea 200 con JSON inválido a ok')` (`invalidJsonResponse(200)`).
- `src/screens/forgot/index.test.tsx`, `describe('#117 R11: la pantalla de éxito es la misma para cualquier correo')`,
  `it('dos correos distintos reciben «Revisa tu correo» con el mismo cuerpo salvo el correo citado')` —
  dos montajes (`unmount()` entre ambos) con `'existe@example.com'` y
  `'nadie-117@example.com'`, ambos `ok`; `forgot-title` igual en los dos;
  `forgot-body` de cada uno `toBe(literal sentTo con su correo)`; los textos
  coinciden tras sustituir el correo por `{{email}}`.

**Sondas de mutación**

| Sonda | Qué cae | Cómo |
|---|---|---|
| M11-a: `if (body.requested !== true) return { kind: 'error' }` en 200 | `it.each` fila 1 y el `it` de JSON inválido | aserción |
| M11-b: copy distinto si el correo termina en `@example.com` | R11 pantalla | aserción (`toBe`) |

## Aserciones existentes que se reapuntan

`mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` se elimina. Sus
cuatro `it`, uno a uno:

| `it` existente (describe › it) | Destino | Cambio |
|---|---|---|
| `R9: forgot es un stub deshabilitado` › `renders disabled controls and never calls auth APIs` | **retirado** | sus tres aserciones se invierten o sustituyen: el texto «disponible pronto» pasa a `queryByText(...).toBeNull()` en R3 `it` 1; `editable` `false` pasa a `not.toBe(false)` en R4 `it` 1; «submit disabled» pasa a «disabled solo con correo vacío» en R4 `it` 2; «never calls auth APIs» pasa a `mockForgotPassword.not.toHaveBeenCalled()` en R3 `it` 2 (el mock de `login`/`register` desaparece: la pantalla no los usa). |
| `R9: forgot es un stub deshabilitado` › `links back to login without a network request` | R3 `it` 2 `link-login navega a /login sin petición de red` | mismo `press` + `push('/login')`; la aserción de «sin red» pasa de `login`/`register` a `forgotPassword`. |
| `#61 R8: forgot tiene contenedor de scroll con safe areas` › `conserva el centrado de hoy dentro de un ScrollView con insets` | mismo `describe` y mismo `it`, movidos a `src/screens/forgot/index.test.tsx` | `getByTestId('screen-forgot')` → `getByTestId('forgot-form')` para leer `contentContainerStyle`, `keyboardShouldPersistTaps` y `contentInsetAdjustmentBehavior`; valores `toEqual` idénticos (`{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, paddingTop: 52, paddingBottom: 48 }`). |
| `#127 R1: el botón de envío de forgot lleva su receta en el árbol` › `pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` | mismo `describe` y mismo `it`, movidos | aserción idéntica (`className` = `'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent'`): en el primer render el correo está vacío, luego el botón sigue deshabilitado. |

## Candados globales (deltas, nunca absolutos)

Medidos en `b2a9c2aa`. Codex **mide la base al arrancar** (`git log -1`,
`grep -n` de cada ancla) y, si otro merge la movió, aplica la **diferencia**,
no el número de esta tabla.

| Fichero | Ancla (grep) | Delta |
|---|---|---|
| `src/providers/__tests__/language-provider.test.tsx` | `+ 9 + 9, // #105 R5` | `+ 9 + 9 + 6 - 1, // #105 R5; #117 R1` (seis claves nuevas, `forgot.comingSoon` retirada: neto **+5**) |
| `src/__tests__/ui-copy-table.ts` › `R1_AUTH` | 5 filas `file: 'src/app/(auth)/forgot.tsx'` | se retiran las 5; entran **12** filas `file: 'src/screens/forgot/index.tsx'`: `forgot.forgotPassword`, `forgot.checkYourEmail`, `forgot.instructions`, `forgot.sentTo`, `forgot.email`, `forgot.sendRecoveryLink`, `forgot.resend`, `forgot.backToSignIn`, `forgot.invalidEmail`, `forgot.tooManyAttempts`, `common.cannotReachServer`, `common.somethingWentWrong` (×1, ver R7). Neto **+7**. Las filas entran en la tarea que añade cada `t(` (`checkUses` exige igualdad por commit). |
| `src/__tests__/ui-language.test.ts` › `#65 R1` | `expect(R1_AUTH).toHaveLength(29)` y título `'resuelve las 29 ocurrencias normativas'` | `toHaveLength(29 + 7) // #117 R10`; título con el total resultante |
| `src/__tests__/ui-language.test.ts` › `#65 R18` | `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // …` | `… + 1 - 1 + 1` con comentario `#117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx` (neto **0**, pero se declara) |
| `src/__tests__/consistency-classnames.test.ts` | 4 ocurrencias de `join('app', '(auth)', 'forgot.tsx')`: fila de `primaryButtons`, `toContain` del tile en `'lleva los tres tiles restantes a rounded-xl'`, `readSource` en `#62 R13` (`'resuelve el Lock de Forgot con accent-strong'`), fila de `directUses` en `#62 R14` | las 4 pasan a `join('screens', 'forgot', 'index.tsx')`. Los literales `toContain` **no cambian** (misma profundidad). Totales **sin cambio**: `count(/style=\{CONTINUOUS_CORNER\}/g)` (el tile sigue siendo 1), `count(/rounded-xl bg-accent(?=[\s'"`])/g)` (solo `forgot-submit`), `count(/bg-accent-soft/g)` (solo el tile — `forgot-resend` **no** usa `bg-accent-soft`), suma de `directUses`. |
| `src/__tests__/legibility-classnames.test.ts` › `#61 R4` | fila `[join('app', '(auth)', 'forgot.tsx'), 1]` en `inkSites` | ruta → `join('screens', 'forgot', 'index.tsx')`, cuenta sigue **1** (`text-accent-strong` solo en `link-login`; el label de `forgot-resend` es `text-foreground`); suma `13 + 1 + 1` sin cambio; guards (`text-accent` suelto = `[]`, `useThemeColors([... 'accent' ...])` prohibido) sin cambio |
| `src/__tests__/design-drift.test.ts` | `grep -ci forgot` = 0 | **nada** |
| `specs/mobile-ui-language/design.md` §1 | `\| src/app/(auth)/forgot.tsx \| 5 \| R1 \|` y `\| src/app/(auth)/__tests__/forgot.test.tsx \| 1 \|` | primera → `\| src/screens/forgot/index.tsx \| 12 \| R1 \|` (anotar «movida por #117»); segunda → `src/screens/forgot/index.test.tsx` con el mismo valor |
| `specs/mobile-ui-language/design.md` §2.1 | ``### §2.1 — R1 — grupo `(auth)` (29 ocurrencias, 23 claves)`` | ocurrencias **+7**, claves **+5** (`-1` comingSoon, `+6` nuevas; `common.*` ya contaban) |
| `specs/mobile-ui-language/design.md` §2.1 bloque | `**mobile-pet-tracker/src/app/(auth)/forgot.tsx** — 5 ocurrencias` | cabecera → `**mobile-pet-tracker/src/screens/forgot/index.tsx** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)`; fila `forgot.comingSoon` → `← retirada por #117 (R1)`; las 4 filas que sobreviven ponen `—` en «Línea»; se añaden con `← añadida por #117 (R1)` las 6 claves nuevas y con `← uso añadido por #117 (R7)` `common.cannotReachServer` y `common.somethingWentWrong` |

## Coordinación con #118 (`mobile-welcome-splash`)

- **#117 toca**: `src/app/(auth)/forgot.tsx`, `src/app/(auth)/__tests__/forgot.test.tsx`
  (borrado), `src/screens/forgot/` (nuevo), `src/api/auth.ts`, `src/api/types.ts`,
  `src/api/__tests__/auth.test.ts`, y los candados de §Candados globales.
- **#118 toca**: `src/app/index.tsx`, `src/app/_layout.tsx`, posiblemente
  `src/app/welcome.tsx` + `src/screens/welcome/`. #117 **no** los toca.
- **Compartidos**: `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts`,
  `src/providers/__tests__/language-provider.test.tsx` (candado de longitud),
  `src/__tests__/ui-language.test.ts` (`SCREEN_FILES`),
  `specs/mobile-ui-language/design.md` §2. **Quien mergea segundo rebasea y
  recuenta**: todo delta de esta spec es una diferencia sobre lo que haya en
  `origin/main` en ese momento, nunca un absoluto.
- `progress/explore_ui-appllama.md` viaja con la PR de #118; esta branch solo
  lo cita.

## Fuera de alcance

Clasificado viñeta a viñeta (premisa verificada en `b2a9c2aa`):

- **Backend**: ningún cambio. El contrato (#44, #58, #59) ya está en `main`.
- **iOS**: `behavior="padding"` sin rama por plataforma, igual que #148; sin
  smoke iOS (decisión de #60).
- **Temporizador / TTL**: el TTL del token no viaja en la respuesta; no se
  muestra cuenta atrás ni se bloquea «Reenviar» por tiempo (D3).
- **Tiempo restante en el 429**: la respuesta trae solo `{ statusCode, message }`;
  el copy es fijo.
- **Validación de formato en cliente**: ninguna regex; el `400` de zod manda
  (R7). El botón solo se bloquea por vacío (D5).
- **`placeholder` en el campo**: no se añade (una clave menos; el `Label` basta).
- **Pantallas `login`, `register`, `reset-password`**: sin cambios. Los
  candados que citan `forgot.tsx` desde `login.test.tsx`
  (`'links to register and forgot password'` → `push('/forgot')`) siguen
  verdes sin tocarse. No se migran `login.tsx`/`register.tsx` a
  `src/screens/` (conventions: solo al tocarlas de fondo).
- **Ficheros de #118**: `src/app/index.tsx`, `src/app/_layout.tsx`,
  `src/app/welcome.tsx`, `src/screens/welcome/`.
- **i18n del correo** que envía el backend (es del backend).
- **Dependencias nuevas**: cero. `bun`/`bunx` para todo.

## Prueba de humo (gate humano)

Dev build de **Android** (nunca Expo Go). Sin marcar estas casillas la feature
no pasa a `done`.

### Prerrequisitos de entorno (una casilla cada uno)

- [ ] `mobile-pet-tracker/.env` → `EXPO_PUBLIC_API_URL` apunta a la IP LAN de
      la máquina del backend con sufijo `/v1` y el teléfono la alcanza
      (`adb shell curl -s <url>/health` o abrir desde el navegador del teléfono).
- [ ] Backend levantado con `./init.sh` en esa máquina; existe una cuenta
      registrada y verificada (#44/#58) con un buzón que el humano puede leer.
- [ ] **Ruta A (correo real)**: `.env` raíz con `EMAIL_ENABLED=true`
      (literal), `RESEND_API_KEY` y `RESEND_FROM` (`docs/verification.md` #58
      G1–G2). **Ruta B (sin Resend)**: `EMAIL_ENABLED` ≠ `true`; el backend
      imprime la línea JSON `auth.password_reset.issued` con `resetUrl`.
      Marcar cuál se usa: ____
- [ ] `RESET_LINK_HOST` fijado en `.env` raíz **y** en `mobile-pet-tracker/.env`,
      backend reiniciado y dev build **regenerado** (#59 G3) — sin esto el
      enlace no abre la app.
- [ ] Dev build instalado; `adb devices` muestra un solo transporte (si hay
      dos, todos los `adb` con `-s <ip:puerto>`).

### Pasos (D9)

- [ ] S1 — Login → «¿Olvidaste tu contraseña?» → se ve el tile `Lock`,
      «Recuperar contraseña», las instrucciones, el campo de correo y el botón
      **deshabilitado** hasta escribir. No aparece «disponible pronto».
- [ ] S2 — Correo de la cuenta real → «Enviar enlace de recuperación» → la
      pantalla pasa a «Revisa tu correo» citando ese correo, con «Reenviar» y
      «Volver al inicio de sesión».
- [ ] S3 — Llega el correo (Ruta A) o la línea `auth.password_reset.issued`
      (Ruta B: `rg 'auth\.password_reset\.issued'` sobre el log, copiar
      `resetUrl` y abrirlo con
      `adb shell am start -a android.intent.action.VIEW -d "<resetUrl>"`).
      El enlace abre la pantalla de #59; se completa el reset; login con la
      contraseña nueva responde 200.
- [ ] S4 — «Reenviar» una vez → segundo correo / segunda línea; la pantalla
      sigue en «Revisa tu correo».
- [ ] S5 — Forzar 429: con el mismo correo, la **cuarta** petición dentro de
      la hora (S2 + S4 + dos «Reenviar» más; el contador vive en memoria del
      backend: no reiniciarlo entre medias) → «Demasiados intentos. Inténtalo
      más tarde.» bajo el cuerpo, sin salir de «Revisa tu correo».
- [ ] S6 — «Volver al inicio de sesión» → «¿Olvidaste tu contraseña?» de nuevo
      (formulario limpio) → escribir `ana@` → enviar → «Ingresa un correo
      electrónico válido»; el formulario sigue en pie con `ana@` escrito.
- [ ] S7 — Correo `nadie-117@example.com` → «Revisa tu correo» idéntico (sin
      correo enviado: en Ruta B no aparece línea `issued`).
- [ ] S8 — Modo avión → enviar → «No se pudo conectar con el servidor».
- [ ] S9 — Con el campo enfocado y el teclado abierto, el botón y «Volver al
      inicio de sesión» quedan visibles por encima del teclado.
- [ ] Resultado anotado en `docs/verification.md` (sección #117: fecha,
      build, ruta A/B, resultado de cada paso).

- [ ] **Prueba de humo firmada por humano** (fecha, cuenta): ____

## Aprobación

- [x] Aprobado por humano

## Enmienda E1 — cuatro cláusulas universales con una sola rama candada

El reviewer rechazó #117 en `d39a9ea5`
(`progress/review_mobile-forgot-password.md` §Observaciones 1-4). La
producción cumple R2, R6, R7 y R9. El hueco está en las listas de **Test** de
esta spec, que prescribieron un solo caso para cláusulas que valen para varias
ramas. Codex las cumplió al pie de la letra. Con cada una de estas mutaciones,
las 8 suites del handoff quedan verdes:

| Cláusula | Mutación que hoy pasa en verde | Rama candada hoy |
|---|---|---|
| R2: «WHEN `status` es cualquier otro (`500`, `404`, `503`…) THE SYSTEM SHALL devolver `{ kind: 'error' }`» | `default: return result.response.status >= 500 ? { kind: 'error' } : { kind: 'ok' };` en `src/api/auth.ts`. Un 404 de una ruta mal configurada se pinta como «Revisa tu correo» | solo `500` |
| R6: «IF el reenvío resuelve un `kind` distinto de `ok` THEN … permanecer en el estado enviado» | `setSent(false);` en `case 'unreachable':` de `send` en `src/screens/forgot/index.tsx`. Un corte de red al reenviar devuelve al formulario | solo `rate-limited` |
| R7: «WHEN arranca un envío nuevo THE SYSTEM SHALL limpiar `forgot-error`» | `if (!sent) setError(null);` en lugar de `setError(null);`. Tras un 429 al reenviar, el reenvío siguiente deja «Demasiados intentos…» a la vista | solo el envío desde el formulario, y solo tras resolver `ok` |
| R9: «un único `ScrollView` … para los dos estados» | `className={sent ? 'flex-1' : 'flex-1 bg-background'}` o `contentInsetAdjustmentBehavior={sent ? 'never' : 'automatic'}` | solo `contentContainerStyle` y `keyboardShouldPersistTaps` |

Ningún requisito cambia. La enmienda solo añade los candados que faltaban y
recoge por escrito una aserción que Codex ya añadió (E1.5). **No hay cambios de
producción**: los `it` nuevos nacen verdes y cada uno se demuestra con una
sonda que lo tumba (tabla de [[tasks]] §Enmienda E1).

### E1.1 — R2: un caso por clase de «cualquier otro status»

**WHEN** se cierra #117, **THE SYSTEM SHALL** tener en
`describe('#117 R2: forgotPassword mapea la respuesta por kind')` de
`src/api/__tests__/auth.test.ts` un `it.each` nuevo, después de
`it('mapea 500 a error')`:

```
it.each([201, 404, 503])('mapea %i a error', …)
```

Cada fila monta `response(status, {})` con el helper del fichero y asevera
`resolves.toEqual({ kind: 'error' })`. Las tres filas cubren las tres clases
que el `500` no cubre: otro `2xx`, otro `4xx` y otro `5xx`.

### E1.2 — R6: el reenvío conserva el estado enviado en todos los kinds que no son ok

**WHEN** se cierra #117, **THE SYSTEM SHALL** tener en
`describe('#117 R6: reenviar repite la misma petición')` de
`src/screens/forgot/index.test.tsx` un `it.each` nuevo, después del `it` del
429, con las cuatro filas que faltan:

```
it.each<[ForgotPasswordState, string]>([
  [{ kind: 'validation', errors: [{ path: 'email', message: 'Invalid email' }] }, 'Ingresa un correo electrónico válido'],
  [{ kind: 'error' }, 'Algo salió mal'],
  [{ kind: 'unreachable', message: 'network down' }, 'No se pudo conectar con el servidor'],
  [{ kind: 'missing-config' }, 'Algo salió mal'],
])('un %p al reenviar pinta «%s» en forgot-error sin salir de «Revisa tu correo»', …)
```

Cada fila hace lo mismo que el `it` del 429:

1. Fija `mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce(state)`.
2. `await renderRoute()`, `await submitForgot()` y
   `await screen.findByText('Revisa tu correo')`.
3. Pulsa `forgot-resend`.
4. Asevera:
   - `await screen.findByTestId('forgot-error')` con `toHaveTextContent(copy)`;
   - `screen.getByText('Revisa tu correo')` visible;
   - `screen.queryByTestId('forgot-email')` `toBeNull()`;
   - `await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled())`.

### E1.3 — R7: `forgot-error` se retira en cuanto arranca un envío nuevo, desde los dos botones

**WHEN** se cierra #117, **THE SYSTEM SHALL** tener en
`describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error')`
dos `it` nuevos, después del `it` del envío posterior. Los dos retienen la
petición con una promesa controlada, el mismo patrón `resolveRequest` que ya
usan R5 y R6 en el fichero, y miran el error **mientras la petición vuela**,
no solo al resolver.

1. `it('un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver')`:
   1. Fija `mockResolvedValueOnce({ kind: 'error' }).mockReturnValueOnce(pending)`.
   2. `await renderRoute()` y `await submitForgot()`.
   3. `await screen.findByTestId('forgot-error')` con `toHaveTextContent('Algo salió mal')`.
   4. Pulsa `forgot-submit`.
   5. `await waitFor(() => expect(screen.getByTestId('forgot-submit')).toBeDisabled())`:
      la petición está en vuelo.
   6. `expect(screen.queryByTestId('forgot-error')).toBeNull()`.
   7. Resuelve `{ kind: 'ok' }` dentro de `act`.
   8. `await screen.findByText('Revisa tu correo')` y otra vez
      `queryByTestId('forgot-error')` `toBeNull()`.
2. `it('un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok')`:
   1. Fija `mockResolvedValueOnce({ kind: 'ok' }).mockResolvedValueOnce({ kind: 'rate-limited' }).mockReturnValueOnce(pending)`.
   2. `await renderRoute()`, `await submitForgot()` y `await screen.findByText('Revisa tu correo')`.
   3. Pulsa `forgot-resend`.
   4. `await screen.findByTestId('forgot-error')` con
      `toHaveTextContent('Demasiados intentos. Inténtalo más tarde.')`.
   5. `await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled())`.
   6. Pulsa `forgot-resend` otra vez.
   7. `await waitFor(() => expect(screen.getByTestId('forgot-resend')).toBeDisabled())`.
   8. `expect(screen.queryByTestId('forgot-error')).toBeNull()`.
   9. Resuelve `{ kind: 'ok' }` dentro de `act`.
   10. `await waitFor(() => expect(screen.getByTestId('forgot-resend')).not.toBeDisabled())`,
       `queryByTestId('forgot-error')` `toBeNull()` y
       `screen.getByText('Revisa tu correo')` visible.

Las esperas siguen `docs/conventions.md` §Esperas: se espera sobre el árbol
(`toBeDisabled` del botón), nunca sobre el contador del mock.

### E1.4 — R9: el `ScrollView` conserva sus props literales en los dos estados

**WHEN** se cierra #117, **THE SYSTEM SHALL** tener en
`describe('#117 R9: las métricas del stub sobreviven al cambio de estado')` un
`it` nuevo:

```
it('forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados', …)
```

1. Fija `mockResolvedValue({ kind: 'ok' })` y `await renderRoute()`.
2. Sobre `screen.getByTestId('forgot-form')`, asevera `props.className`
   `toBe('flex-1 bg-background')` y `props.contentInsetAdjustmentBehavior`
   `toBe('automatic')`.
3. `await submitForgot()` y `await screen.findByText('Revisa tu correo')`.
4. Repite las dos aseveraciones sobre un `getByTestId('forgot-form')` nuevo.

`props.className` del `ScrollView` ya se asevera así en
`src/screens/geofences/index.test.tsx` y `src/screens/alert-detail/index.test.tsx`.

### E1.5 — R2 `it` 4 cubre también el JSON inválido

La lista de **Test** de R2 pedía en `it('mapea un 400 sin errors a error')`
solo `response(400, {})`. La EARS dice «sin `errors` (o con JSON inválido)», y
Codex añadió en ese mismo `it` una segunda llamada con
`invalidJsonResponse(400)` que también asevera `{ kind: 'error' }`. Esta
enmienda la da por buena tal como está en `7ba0b3a9`. No se toca y no genera
commit.

### Cifras y alcance

| Suite | Antes de E1 | Después de E1 |
|---|---:|---:|
| `src/api/__tests__/auth.test.ts` | 40 | 43 (+3 de E1.1) |
| `src/screens/forgot/index.test.tsx` | 20 | 27 (+4 de E1.2, +2 de E1.3, +1 de E1.4) |
| Las 8 suites del handoff | 272 | 282 |
| Suite global de `mobile-pet-tracker` | 93 suites / 2036 | 93 suites / 2046 |

Ningún candado global se mueve. Consistency y legibility no leen `*.test.tsx`.
Design-drift sí los lee, pero los literales nuevos no llevan clases
arbitrarias (`-[…]`). La lista cerrada de [[design]] §Archivos afectados no
cambia: los commits de E1 tocan `src/api/__tests__/auth.test.ts`,
`src/screens/forgot/index.test.tsx`, `traceability.md` y
`progress/impl_mobile-forgot-password.md`, que ya estaban en ella.

- [ ] Enmienda E1 aprobada por humano (fecha: ____, commit de firma: el que marca esta casilla)
