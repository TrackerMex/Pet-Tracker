# Diseño — [[mobile-forgot-password]]

> Decisiones de alto nivel. D1–D9 vienen cerradas por el leader y no se
> relitigan; D10–D16 las cierra esta spec. Nada de aquí baja a código: el
> código lo escribe Codex a partir de `requirements.md` + `tasks.md`.

## Decisiones técnicas

- **D1 — Route delgado + pantalla propia.** `src/app/(auth)/forgot.tsx` queda
  como route que devuelve `<ForgotScreen />`; la pantalla vive en
  `src/screens/forgot/index.tsx` y su suite en `src/screens/forgot/index.test.tsx`
  (patrón `src/app/reset-password.tsx` + `src/screens/reset-password/`).
  `src/app/(auth)/__tests__/forgot.test.tsx` **se retira entero** (no se
  reduce): toda la suite nueva monta a través del route, así que un segundo
  fichero solo duplicaría (ver `requirements.md` §Aserciones existentes).
- **D2 — Cliente `forgotPassword`** en `src/api/auth.ts`, misma firma y
  fontanería que `resetPassword`. `ForgotPasswordState = ok | rate-limited |
  validation | error | unreachable | missing-config`. Ningún `kind` depende de
  si el correo existe. **Un 400 sin `errors` mapea a `error`**: el contrato
  solo produce 400 desde zod, inventar un kind para un caso inexistente es
  deuda.
- **D3 — Dos estados en una pantalla.** (a) formulario; (b) «Revisa tu correo»
  tras `ok`, con cabecera, cuerpo que repite el correo (`{{email}}`),
  «Reenviar» secundario que repite el mismo POST y `link-login`. Sin
  temporizador/TTL, sin gradiente, sin emoji, sin dependencia nueva.
- **D4 — Errores** en `testID="forgot-error"`, `text-danger`, `selectable`,
  copy fijo por `kind` (tabla en R7); el `errors` de `validation` se ignora.
  Se reutilizan `common.cannotReachServer` y `common.somethingWentWrong`.
- **D5 — Botón** `isDisabled={email.trim() === '' || submitting}`. `Input`
  con `autoCapitalize="none"`, `keyboardType="email-address"`,
  `autoComplete="email"`, `textContentType="emailAddress"`.
- **D6 — KAV** copiada de `login.tsx`/`reset-password`: `behavior="padding"`,
  `keyboardVerticalOffset={headerHeight}` con `HeaderHeightContext`; sonda de
  teclado como en #148.
- **D7 — Métricas del stub intactas** (`padding: 24, gap: 16,
  paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24`, centrado) y
  `ScrollView keyboardShouldPersistTaps="handled"`. `testID="screen-forgot"`
  pasa a la KAV; el `ScrollView` recibe `testID="forgot-form"`.
- **D8 — Anti-enumeración.** El estado (b) es idéntico para cualquier correo;
  un `it` por rama de `kind`; ningún `it` ni el cliente miran más allá de
  `status` en 200/429.
- **D9 — Smoke humano** en dev build Android con casillas propias (prerrequisitos
  de entorno separados) — `requirements.md` §Prueba de humo.
- **D10 — Un solo `ScrollView` para los dos estados.** El árbol cambia por
  `sent` dentro del mismo `forgot-form`; así las métricas de D7 no pueden
  divergir entre estados (R9) y no hay dos `contentContainerStyle` que
  mantener.
- **D11 — `forgot-error` vive en los dos estados.** «Reenviar» puede recibir
  429/unreachable; el error se pinta debajo del cuerpo sin abandonar (b).
  Un envío nuevo limpia el error antes de la petición.
- **D12 — «Reenviar» es `Button variant="secondary" className="w-full rounded-xl"`
  con label `font-bold text-foreground`.** Sin `bg-accent-soft` ni
  `text-accent-strong`: así no se mueven `count(/bg-accent-soft/g)` ni la
  fila de `inkSites` (`text-accent-strong` sigue ×1, en `link-login`). La
  jerarquía la da el relleno: `bg-accent` solo en el CTA primario.
- **D13 — Sin `placeholder`.** El `Label` basta; evita una clave más y una
  fila más en cada candado.
- **D14 — Sin `try/catch` en el handler.** El cliente nunca lanza (R2);
  `finally { setSubmitting(false) }` basta. Un `catch` con
  `t('common.somethingWentWrong')` añadiría una llamada `t(` sin test que la
  cubra y movería `checkUses`.
- **D15 — `error` y `missing-config` comparten un `case` con fallthrough**
  (una sola `t('common.somethingWentWrong')`): fija el recuento de
  `checkUses` en 12 ocurrencias para `src/screens/forgot/index.tsx`.
- **D16 — El correo se envía recortado y sin cambiar mayúsculas.** El
  backend normaliza (`normalizeEmail` en el use case); la app no duplica esa
  regla.

## Árbol de la pantalla (`src/screens/forgot/index.tsx`)

Estado: `email`, `submittedEmail`, `sent`, `submitting`, `error` (string | null).
`headerHeight = useContext(HeaderHeightContext)`; `insets = useSafeAreaInsets()`;
`[accentStrong] = useThemeColors(['accent-strong'])`; `t = useTranslate()`.

```
KeyboardAvoidingView  testID="screen-forgot" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}
└─ ScrollView  testID="forgot-form" className="flex-1 bg-background"
   │           keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"
   │           contentContainerStyle={{ flexGrow:1, justifyContent:'center', alignItems:'center',
   │                                    padding:24, gap:16, paddingTop:insets.top+12, paddingBottom:insets.bottom+24 }}
   ├─ View  className="size-16 items-center justify-center rounded-xl bg-accent-soft" style={CONTINUOUS_CORNER}
   │  └─ Lock size={28} color={accentStrong}
   ├─ Text  testID="forgot-title" className="text-center text-2xl font-black text-foreground"
   │        sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')
   ├─ Text  testID="forgot-body" className="text-center font-normal text-muted"
   │        sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')
   ├─ [!sent] TextField className="w-full"
   │           ├─ Label className="text-xs font-semibold text-foreground"  t('forgot.email')
   │           └─ Input testID="forgot-email" className="rounded-xl bg-default" value={email} onChangeText={setEmail}
   │                    autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress"
   ├─ [error] Text testID="forgot-error" className="text-danger" selectable
   ├─ [!sent] Button testID="forgot-submit" className="w-full rounded-xl bg-accent"
   │           isDisabled={email.trim() === '' || submitting} onPress={() => void send(email.trim())}
   │           └─ Button.Label className="font-bold text-accent-foreground"  t('forgot.sendRecoveryLink')
   ├─ [sent]  Button testID="forgot-resend" variant="secondary" className="w-full rounded-xl"
   │           isDisabled={submitting} onPress={() => void send(submittedEmail)}
   │           └─ Button.Label className="font-bold text-foreground"  t('forgot.resend')
   └─ LinkButton testID="link-login" onPress={() => router.push('/login')}
      └─ LinkButton.Label className="font-semibold text-accent-strong"  t('forgot.backToSignIn')
```

Recuento normativo de `t(`: 12 (`forgotPassword`, `checkYourEmail`,
`instructions`, `sentTo`, `email`, `sendRecoveryLink`, `resend`,
`backToSignIn`, `invalidEmail`, `tooManyAttempts`, `common.cannotReachServer`,
`common.somethingWentWrong`). `text-accent-strong` ×1. `bg-accent-soft` ×1.
`style={CONTINUOUS_CORNER}` ×1. `rounded-xl bg-accent` ×1. `Platform` ×0.

### Handler `send(target: string)`

1. `setSubmitting(true)`; `setError(null)`.
2. `result = await forgotPassword(process.env.EXPO_PUBLIC_API_URL, { email: target })`.
3. `switch (result.kind)`: `ok` → `setSubmittedEmail(target)`, `setSent(true)`;
   `validation` → `setError(t('forgot.invalidEmail'))`; `rate-limited` →
   `setError(t('forgot.tooManyAttempts'))`; `unreachable` →
   `setError(t('common.cannotReachServer'))`; `error` / `missing-config`
   (fallthrough) → `setError(t('common.somethingWentWrong'))`.
4. `finally`: `setSubmitting(false)`.

`send` sirve a los dos botones: `forgot-submit` con `email.trim()`,
`forgot-resend` con `submittedEmail` (R6: mismo segundo argumento).

## Cliente (`src/api/auth.ts`)

`forgotPassword(baseUrl, body, fetchFn = fetch)`: guard de `baseUrl` →
`missing-config`; `postJson(baseUrl, '/auth/forgot-password', body, fetchFn)`;
`unreachable` pasa tal cual; `switch (response.status)`: `200` → `ok`;
`429` → `rate-limited`; `400` → `readJson` + `validationErrors` → `validation`
o, sin errores, `error`; `default` → `error`. El cuerpo solo se lee en 400.

## Archivos afectados

| Capa | Fichero | Acción |
|---|---|---|
| API (cliente HTTP) | `mobile-pet-tracker/src/api/types.ts` | `+ ForgotPasswordRequest` |
| API | `mobile-pet-tracker/src/api/auth.ts` | `+ ForgotPasswordState`, `+ forgotPassword` |
| API tests | `mobile-pet-tracker/src/api/__tests__/auth.test.ts` | `+ describe #117 R2`, `+ describe #117 R11` |
| i18n | `mobile-pet-tracker/src/i18n/catalog.ts` | `+6 claves`, `−forgot.comingSoon` |
| i18n tests | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `+ describe #117 R1`, candado de longitud `+ 6 - 1` |
| Route | `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | reescrito como route delgado |
| Route tests | `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` | **eliminado** (`git rm`) |
| Pantalla | `mobile-pet-tracker/src/screens/forgot/index.tsx` | **nuevo** |
| Pantalla tests | `mobile-pet-tracker/src/screens/forgot/index.test.tsx` | **nuevo** (R3–R9, R11 + 2 `it` reapuntados) |
| Candados | `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`, `src/__tests__/consistency-classnames.test.ts`, `src/__tests__/legibility-classnames.test.ts` | deltas de `requirements.md` §Candados globales |
| Spec de idioma | `specs/mobile-ui-language/design.md` §1 y §2.1 | filas movidas/añadidas/retirada |
| Verificación | `docs/verification.md` | sección #117 (la rellena el humano con el smoke) |

Sin tocar: backend, `login.tsx`, `register.tsx`, `reset-password`,
`design-drift.test.ts`, ficheros de #118.

## Alternativas descartadas

- **Pantalla de éxito como route aparte** (`/forgot/sent`): duplica KAV,
  insets y candados; el patrón Appllama §2 convierte la misma pantalla.
- **Validar el formato del correo en cliente** (regex): el backend ya
  responde 400 con zod; una regex propia divergiría (`z.email()` vs la
  nuestra) y sería un segundo mensaje que mantener.
- **Cuenta atrás / bloqueo temporal de «Reenviar»**: el TTL no viaja en la
  respuesta y el 429 ya lo gobierna el backend.
- **`kind: 'invalid-email'` para el 400 sin `errors`**: no existe en el
  contrato; D2.
- **`forgot.comingSoon` conservada «por si acaso»**: una clave muerta cuenta
  en el candado de longitud y en `design.md` §2; se retira.
- **«Reenviar» con `bg-accent-soft` + `text-accent-strong`** (idioma de
  `change-photo` en profile): correcto en carta pero mueve dos inventarios
  globales (`bg-accent-soft` e `inkSites`) a cambio de nada; D12.
- **Reducir `forgot.test.tsx` a un test de delegación del route**: cada `it`
  de la suite nueva ya monta por el route; D1.
- **`try/catch` en el handler**: D14.
