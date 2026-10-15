---
feature: "mobile-account-client-validation"
status: spec_ready
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-account-client-validation]] (#183)

> Ver [[requirements]] para los requisitos y
> [[../../docs/ui-guidelines|ui-guidelines]], que rige toda la UI móvil. Rutas
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Decisiones técnicas

- **D1 — Un módulo puro con las reglas** (R2). `src/utils/account-rules.ts`
  junta en un sitio las reglas de las cuatro pantallas. Así se prueban con
  tablas, sin montar pantallas, y la paridad con los DTO se lee en un solo
  fichero. Sigue el precedente de `src/utils/reminder-meta.ts`: importa
  `import type { TranslationKey } from '../i18n/catalog';` y devuelve claves,
  no texto. La pantalla traduce. No importa `react`, `react-native` ni zod.
- **D2 — El regex de correo es el literal de zod** (R2). `z.email()` de zod
  4.4.3 usa `regexes.email` de `zod/v4/core/regexes.js`. Se copia el literal
  tal cual con un comentario que cita la ruta, la versión y `#183 R2`. La
  tabla C de R2 fija el veredicto con booleanos escritos a mano, así que si un
  día el backend sube de zod y cambia el regex, el candado no se mueve solo:
  hay que volver a medir. El patrón laxo de #172
  (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) se borra de register.
- **D3 — Primera regla que falla, por campo** (R2–R6). Cada campo muestra un
  solo mensaje, el de la primera regla que falla en el orden de
  requirements §Reglas. Dos órdenes importan y están candados: en el correo,
  el formato va antes que la longitud (S2.12); en el país, la longitud va
  antes que las letras (S2.11). Así el mensaje nombra el problema más básico.
- **D4 — Se valida lo mismo que se envía** (R3, R4, R5). La pantalla construye
  un objeto `values` con el correo ya recortado (`email.trim()`), lo pasa al
  validador y, si no hay entradas, manda **ese mismo objeto** a la API. Esto
  cierra el hueco de login y register, que mandaban el correo sin recortar, y
  hace imposible validar una cosa y enviar otra (S3.3).
- **D5 — La confirmación solo se compara** (R2, R4, R6). El DTO aplica
  `passwordSchema` a los dos campos y además exige igualdad. Con igualdad, las
  longitudes de la confirmación son las de la contraseña, así que el conjunto
  aceptado no cambia. El argumento completo está en requirements §Reglas.
- **D6 — Al pulsar enviar, no en vivo** (R3–R6). Igual que #172 R12: al pulsar
  se borran los mensajes de campo y el error general, se valida, y si hay
  entradas se pintan y se sale **antes de `setSubmitting(true)`**. Si no, el
  botón se quedaría desactivado tras un fallo de cliente, y el `it` 7 de R3
  (corregir y reenviar) lo caza. Los mensajes se quedan hasta el siguiente
  envío (P7).
- **D7 — Un 400 es un aviso genérico** (R7, opción A de P1). Con el cliente
  validando igual que el DTO, un 400 solo llega si el backend cambia sin que
  cambie el cliente. Ahí ni el texto del servidor (en inglés, técnico) ni un
  mapeo por campo ayudan al usuario. Se pinta `validation.checkDetails` en el
  error general de cada pantalla y se borra el mapeo por campo de register.
- **D8 — Se reutiliza `forgot.invalidEmail`** para el correo inválido en las
  tres pantallas que lo piden, como ya hacía #172 R16 en register. Así no hay
  dos textos para el mismo fallo. Desde R2 el único sitio que lo nombra es el
  módulo de reglas, y desde R7 forgot deja de usarlo para el 400.
- **D9 — Sin clases nuevas.** Se reutilizan `FieldError` (heroui-native) y
  `FormError` (`src/components/form-error.tsx`) tal cual. Los recuentos de
  clases de `#172 R20` no se mueven.

## Módulo `src/utils/account-rules.ts` (R2)

Exporta exactamente esto:

| Símbolo | Forma |
|---|---|
| `RuleIssue` | `type RuleIssue = { labelKey: TranslationKey; params?: Record<string, number> }` |
| `FieldIssues<F extends string>` | `type FieldIssues<F extends string> = Partial<Record<F, RuleIssue>>` |
| `EMAIL_PATTERN` | el literal de requirements §Reglas, con el comentario de D2 |
| `validateLogin` | `(values: { email: string; password: string }) => FieldIssues<'email' \| 'password'>` |
| `RegisterValues` | tipo con siete `string`: `firstName`, `lastName`, `email`, `phone`, `country`, `password`, `passwordConfirmation` |
| `validateRegister` | `(values: RegisterValues) => FieldIssues<keyof RegisterValues>` |
| `validateForgot` | `(values: { email: string }) => FieldIssues<'email'>` |
| `validateResetPassword` | `(values: { password: string; passwordConfirmation: string }) => FieldIssues<'password' \| 'passwordConfirmation'>` |

El regex de país (`/^[A-Z]{2}$/`) es privado. Los validadores no recortan nada
que el DTO no recorte: el nombre, los apellidos y el teléfono se recortan
**solo para medir**, porque el DTO los recorta con `.trim()`. El correo llega
ya recortado desde la pantalla (D4).

Cada clave aparece en el fichero una sola vez como `labelKey: '<clave>'`. Para
eso hay constantes para los mensajes sin parámetro, y dos helpers,
`tooShort(min)` y `tooLong(max)`, para los que llevan `{ min }` o `{ max }`.
`checkUses` de `ui-language.test.ts` cuenta `\blabelKey:\s*['"]clave['"]`, y
la tabla de filas espera 1 por clave. Un campo válido **no aparece** en el
objeto devuelto (ni con `undefined`), porque los tests usan `toStrictEqual`.

El fichero entra en `SCREEN_FILES` en R2 y pasa el escaneo `FIXED_COPY`: solo
contiene claves, nunca un valor del catálogo.

## Pantallas (R3–R6)

Patrón común. Es el de register en #172 R10, que ya está en el árbol:

1. Estado nuevo
   `const [fieldErrors, setFieldErrors] = useState<FieldIssues<…>>({});`,
   tipado con los campos de la pantalla.
2. En el handler de envío, en este orden: `setFieldErrors({})`, borrar el
   error general, construir `values`, `const issues = validateX(values)`.
   Si `Object.keys(issues).length > 0`, se llama a `setFieldErrors(issues)` y
   se hace `return`. Solo después vienen `setSubmitting(true)` y la llamada a
   la API con `values`.
3. Cada input queda dentro de su
   `<TextField isInvalid={Boolean(fieldErrors.<campo>)}>`: login, forgot y
   reset ya tienen un `<TextField>` por campo, al que solo se añade la
   propiedad. Tras el input, `PasswordInput` incluido, va
   `<FieldError testID="<prefijo>-error">{fieldErrors.<campo> ? <FormError testID="<prefijo>-message" message={t(fieldErrors.<campo>.labelKey, fieldErrors.<campo>.params)} /> : null}</FieldError>`.
   El bloque modelo es el de `register-password` en
   `src/screens/register/index.tsx`.
4. `FieldError` se importa de `heroui-native`, junto a `TextField`. `FormError`
   ya está importado en las cuatro pantallas.
5. Imports relativos: `from '../../utils/account-rules'`.

`FieldError` de heroui-native 1.0.8 pinta `null` si el `TextField` no está
`isInvalid`. Por eso quitar `isInvalid` deja el mensaje invisible, y las
sondas S4.3, S5.3 y S6.2 lo prueban.

### Login (R3)

- `values = { email: email.trim(), password }`, y se llama a
  `login(process.env.EXPO_PUBLIC_API_URL, values)`.
- Hoy `handleSubmit` empieza con `setSubmitting(true)`. La validación va antes
  (D6).
- testIDs: `login-email-error` / `login-email-message`, y
  `login-password-error` / `login-password-message`.

### Register (R4, R7)

- `values: RegisterValues` con `email: email.trim()` y el resto tal cual. Se
  manda a `register(...)` con `timezone` y `termsAccepted` como hoy. El
  `login(...)` posterior recibe `{ email: values.email, password }`.
- Se borran `const EMAIL_PATTERN` y la rama
  `setFieldErrors({ email: t('forgot.invalidEmail') })`. `fieldErrors` pasa de
  `RegisterFieldErrors` (texto) a `FieldIssues<RegisterField>`.
- **Transición en R4.** Para que los `it` heredados de 400 (`maps validation
  errors…`, `#172 R10: cada campo con error…` y `#172 R11`) sigan verdes
  hasta R7:
  - un estado aparte guarda el texto del servidor:
    `const [serverFieldErrors, setServerFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});`
    con el comentario `// #183 R4: transición, la borra R7`;
  - el caso `validation` hace `setServerFieldErrors(validation.fields)` en
    vez de `setFieldErrors(...)`, y el envío lo borra junto a `fieldErrors`;
  - cada campo usa
    `isInvalid={Boolean(fieldErrors.<campo> ?? serverFieldErrors.<campo>)}`.
    Conserva el prefijo `isInvalid={Boolean(fieldErrors.` que cuenta
    `#172 R10: los siete campos del registro marcan isInvalid`;
  - el `FormError` de cada campo se pinta si hay cualquiera de los dos, con
    `message={fieldErrors.<campo> ? t(fieldErrors.<campo>.labelKey, fieldErrors.<campo>.params) : serverFieldErrors.<campo>}`.
    Si TypeScript no estrecha el `string | undefined` de la rama del servidor,
    se le pone `?? ''`. Sigue habiendo **un** `FormError` por campo.
- **R7** borra `serverFieldErrors` y su rama, `mapValidationErrors`,
  `isRegisterField`, `registerFields`, `RegisterFieldErrors` si queda sin uso,
  y el import de `ApiFieldError`. El caso `validation` pasa a
  `setGeneralError(t('validation.checkDetails'))`. El
  `isInvalid={Boolean(fieldErrors.<campo>)}` vuelve a su forma de #172.

### Forgot (R5, R7)

- Hoy el botón hace `onPress={() => void send(email.trim())}`. Pasa a llamar a
  un handler nuevo, `submit()`, que borra `fieldErrors`, valida
  `{ email: email.trim() }` y, si no hay entradas, llama a
  `send(values.email)`. `send` no cambia.
- El reenvío (`send(submittedEmail)`) no valida: reusa un correo que ya pasó.
- `isDisabled={email.trim() === '' || submitting}` no cambia.
- R7: el caso `validation` de `send` pasa de `t('forgot.invalidEmail')` a
  `t('validation.checkDetails')`.
- testIDs: `forgot-email-error` / `forgot-email-message`.

### Reset password (R6, R7)

- `values = { password, passwordConfirmation }`, que se validan tal cual. La
  llamada sigue mandando `{ token: normalizedToken, ...values }`.
- La validación va antes de `setSubmitting(true)`. Un token ausente se resuelve
  como hoy, sin tocarlo.
- R7: el caso `validation` pasa del `join` crudo a
  `setError(t('validation.checkDetails'))`.
- testIDs: `reset-password-error` / `reset-password-message`, y
  `reset-password-confirm-error` / `reset-password-confirm-message`.

## Catálogo y design de idioma (R1)

- Las nueve claves van en `src/i18n/catalog.ts`, en `en` y en `es`, agrupadas
  bajo el prefijo `validation.`. Los literales están en requirements §Copy
  nuevo.
- `specs/mobile-ui-language/design.md` gana la sección
  `### §2.N — Añadidos por #183 — Validación en cliente de las pantallas de cuenta`,
  donde N es la última en H0 + 1. Tiene la tabla
  `| # | Clave | \`en\` | \`es\` | Origen |` y nueve filas
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #183 (R1) |`.
  El `'` de `Passwords don't match` y de `country's` va tal cual. La regex del
  `it` de R1 escapa solo la clave.

## Archivos afectados

Todo cae en la capa de presentación de `mobile-pet-tracker/`, salvo el módulo
de reglas, que es lógica pura sin dependencias de UI.

| Fichero | R | Cambio |
|---|---|---|
| `src/utils/account-rules.ts` | R2 | nuevo |
| `src/utils/account-rules.test.ts` | R2 | nuevo: tablas C, L, G, F y N (66 casos; 71 tras la Enmienda E1) |
| `src/i18n/catalog.ts` | R1 | +9 claves × 2 idiomas |
| `src/providers/__tests__/language-provider.test.tsx` | R1 | `+ 9` en la fórmula y el `describe` de `#183 R1` |
| `src/__tests__/ui-copy-table.ts` | R2, R4, R7 | filas según requirements §Deltas de candados |
| `src/__tests__/ui-language.test.ts` | R2, R4, R7 | fórmulas y títulos de `R1_AUTH`, `R11_RESET` y `SCREEN_FILES` |
| `src/screens/login/index.tsx` + `index.test.tsx` | R3, R7 | validación, correo recortado y aviso genérico |
| `src/screens/register/index.tsx` + `index.test.tsx` | R4, R7 | validación de siete campos, correo recortado, transición y aviso genérico |
| `src/screens/forgot/index.tsx` + `index.test.tsx` | R5, R7 | `submit()` con validación y aviso genérico |
| `src/screens/reset-password/index.tsx` + `index.test.tsx` | R6, R7 | validación y aviso genérico |
| `../specs/mobile-ui-language/design.md` | R1 | sección §2.N |

No cambian: `backend-pet-tracker/`, `src/components/form-error.tsx`,
`src/components/password-input.tsx`, `src/api/*`, ni
`src/__tests__/account-screens-polish.test.ts`.

## Alternativas descartadas

- **Añadir zod al móvil** y compartir el esquema. Es una dependencia nueva por
  un regex y seis números. Además, `z.email()` da mensajes en inglés que
  habría que remapear igual, y el backend no exporta sus DTO como paquete. La
  tabla C da la misma garantía sin la dependencia.
- **Mantener el patrón de #172.** Es más laxo que el servidor:
  `alex@example.c` pasaba el cliente y volvía como 400. Es justo lo que pidió
  quitar el humano.
- **Validación en vivo** (al escribir o al salir del campo). Es un cambio de
  interacción que el pedido no menciona (P7). Duplicaría los its por evento y
  rompería el modelo de #172 R12.
- **Mapear el 400 por campo** (opción B de P1). Mantiene `mapValidationErrors`
  para un caso que el cliente ya evita, y obliga a una clave genérica por
  campo.
- **Un regex en cada pantalla.** Habría cuatro copias que divergen. El módulo
  único se prueba una vez.
- **Recortar nombre, apellidos y teléfono antes de enviar.** El DTO ya los
  recorta, y cambiarlo movería la aserción de payload heredada de register sin
  ganancia.

## Para el handoff (Codex)

- Skill de Codex para esta UI: `building-native-ui`. **Codex no tiene
  `expo-overview`**. No hace falta ninguna skill de animación ni de router.
- `docs/ui-guidelines.md` rige. Los mensajes usan los componentes compartidos
  (`FieldError`, `FormError`), sin estilos nuevos.
- No se tocan los dos mocks del par sites-99 (requirements §Convenciones).
