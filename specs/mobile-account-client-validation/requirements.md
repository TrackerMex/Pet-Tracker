---
feature: "mobile-account-client-validation"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-account-client-validation]] (#183)

> Validación en cliente, con un mensaje claro por campo y regla, en todos los
> inputs de Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva
> contraseña. Las reglas salen de los DTO del backend, ni más estrictas ni más
> laxas. El usuario no vuelve a ver el texto crudo del servidor.
>
> Pedido del humano, literal (2026-10-15, tras la prueba de humo R21 de #172):
> «listo ya realice la prueba de humo y este me gusto mas, solo algo a agregar
> las alertas como lo que hiciste en el campo de correo aplicalo en todos los
> inputs con el mensaje claro ya que ahorita sigue mostrando el error del
> server».

El modelo es #172 R10 (mensaje de campo con `FieldError` + `FormError`: icono
y texto seleccionable) y #172 R12 (el correo inválido no llama a la API). Esta
feature lleva ese patrón a los 12 inputs que escribe el usuario en las cuatro
pantallas. Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Base medida

Base congelada al escribir: `60dd9eda` (punta de #172 en
`feature/183-mobile-account-client-validation`). **La implementación espera a
que #172 se mergee en `main`, y `main` se mergea en esta branch antes del
handoff.** H0 es el commit del handoff. Toda cifra que otra feature pueda
mover se escribe «base medida en H0 + delta» y el handoff la vuelve a medir en
H0 con el mismo comando. Si en H0 una medida no coincide con la de
`60dd9eda`, vale la de H0 y el delta no cambia.

| Id | Qué | Comando (desde `mobile-pet-tracker/`) | En `60dd9eda` |
|---|---|---|---|
| B1 | `B_AUTH`: total de la fórmula de `expect(R1_AUTH).toHaveLength(` | `grep -F 'expect(R1_AUTH).toHaveLength(' src/__tests__/ui-language.test.ts` y sumar | `29 + 7 + 1 + 4` = 41; el título del `it` dice `resuelve las 41 ocurrencias normativas` |
| B2 | `B_RESET`: total de `expect(R11_RESET).toHaveLength(` | `grep -F 'expect(R11_RESET).toHaveLength(' src/__tests__/ui-language.test.ts` | `15 + 1` = 16; título `resuelve las 16 ocurrencias normativas` |
| B3 | `B_FILES`: total de la fórmula de `expect(SCREEN_FILES).toHaveLength(` | leer la fórmula y sumar | 32 (última línea `+ 2 // #172 R16: back-button y password-input`) |
| B4 | `B_KEYS`: claves de `en` en el catálogo | `node -e` o el propio test de longitud del catálogo | 399 (la fórmula acaba en `+ 3, // #172 R16`) |
| B5 | Última sección `### §2.N` de `../specs/mobile-ui-language/design.md` | `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` y ver la última | §2.27 (#172). En `origin/main` `a288c7dc` la §2.27 es de #171, así que al mergear #172 pasa a §2.28 y esta feature toma **§2.29**. Regla: la última en H0 + 1 |
| B6 | Namespace `validation.` libre | `grep -cF "'validation." src/i18n/catalog.ts` | 0 |
| B7 | El módulo nuevo no existe | `test ! -e src/utils/account-rules.ts` | sale 0 |
| B8 | El móvil no depende de zod | `grep -cF '"zod"' package.json` | 0 |

Anclas por pantalla (`grep -cF '<literal>' src/screens/<p>/index.tsx`) en `60dd9eda`:

| Literal | login | register | forgot | reset-password |
|---|---|---|---|---|
| `isInvalid={Boolean(fieldErrors.` | 0 | 7 | 0 | 0 |
| `<FieldError` | 0 | 7 | 0 | 0 |
| `t(fieldErrors.` | 0 | 0 | 0 | 0 |
| `const EMAIL_PATTERN` | 0 | 1 | 0 | 0 |
| `t('forgot.invalidEmail')` | 0 | 1 | 1 | 0 |
| `t('common.somethingWentWrong')` | 2 | 2 | 1 | 2 |
| `errors.map(` | 1 | 0 | 0 | 1 |
| `mapValidationErrors` | 0 | 2 | 0 | 0 |
| `ApiFieldError` | 0 | 2 | 0 | 0 |
| `t('validation.checkDetails')` | 0 | 0 | 0 | 0 |
| `from '../../utils/account-rules'` | 0 | 0 | 0 | 0 |

Hoy, por pantalla:

- **login** manda `{ email, password }` sin recortar y, ante un 400, une con
  `\n` los textos crudos del servidor en `login-error`.
- **register** valida el correo con
  `const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`, que es más laxo que
  zod (ver §Reglas). También manda `email` sin recortar a `register(...)` y al
  `login(...)` posterior. Ante un 400, pinta en cada campo el texto crudo del
  servidor (`mapValidationErrors`).
- **forgot** ya recorta (`send(email.trim())`). Ante un 400 pinta
  `forgot.invalidEmail` en `forgot-error`.
- **reset-password** une los textos crudos del servidor en `reset-error`.

## Reglas del backend (fuente de verdad)

DTOs en `backend-pet-tracker/src/modules/auth/application/dto/`. Cada literal
se verificó con `grep -cF '<literal>' <fichero>` = 1 en `60dd9eda`. Esta
feature **no toca el backend**.

| DTO | Literal |
|---|---|
| `login-user.dto.ts` | `  email: z.email(),` |
| `login-user.dto.ts` | `  password: z.string().min(1),` |
| `register-user.dto.ts` | `const MIN_PASSWORD_LENGTH = 8;` |
| `register-user.dto.ts` | `const MAX_PASSWORD_LENGTH = 128;` |
| `register-user.dto.ts` | `    firstName: z.string().trim().min(1).max(120),` |
| `register-user.dto.ts` | `    lastName: z.string().trim().min(1).max(120),` |
| `register-user.dto.ts` | `    email: z.email().max(320),` |
| `register-user.dto.ts` | `    phone: z.string().trim().min(7).max(20),` |
| `register-user.dto.ts` | `    password: passwordSchema,` |
| `register-user.dto.ts` | `    passwordConfirmation: passwordSchema,` |
| `register-user.dto.ts` | `    country: CountrySchema,` |
| `register-user.dto.ts` | `  .refine((payload) => payload.password === payload.passwordConfirmation, {` |
| `country.schema.ts` | `  .length(2)` |
| `country.schema.ts` | `  .regex(/^[A-Z]{2}$/);` |
| `forgot-password.dto.ts` | `  email: z.email().max(320),` |
| `reset-password.dto.ts` | `const passwordSchema = z.string().min(8).max(128);` |
| `reset-password.dto.ts` | `  .refine((payload) => payload.password === payload.passwordConfirmation, {` |

**Semántica de zod 4.4.3** (la versión instalada en
`backend-pet-tracker/node_modules/zod`):

- `.trim()` transforma antes de los checks que le siguen.
- `min`, `max` y `length` cuentan `.length` del valor.
- `z.email()` sin `pattern` usa `regexes.email` de
  `zod/v4/core/regexes.js`, que es este literal:
  `/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/`.
  Copiado tal cual a `src/utils/account-rules.ts`, da el mismo veredicto que
  `z.email()` en las 15 filas de la tabla C de R2. Se midió con node contra el
  zod instalado.
- `z.email()` **no recorta**: `' alex@example.com'` es inválido para el
  servidor. Por eso el cliente recorta el correo, lo valida recortado y lo
  manda recortado (R3, R4; forgot ya lo hacía).

Medido en 4.4.3: `CountrySchema` no recorta ni pasa a mayúsculas, así que
`'mx'` es inválido (la pantalla ya pone mayúsculas al escribir). Ocho espacios
son una contraseña válida, y en login un espacio también. El teléfono acepta
cualquier carácter, y `'55 1234'` es válido.

**Reglas del cliente** (validación al pulsar enviar). Para cada campo se
aplican sus reglas en el orden de la tabla y se muestra **solo el mensaje de la
primera que falla**:

| Pantalla | Campo (testID del input) | Valor evaluado | Regla, en orden | Clave del mensaje |
|---|---|---|---|---|
| login | correo (`login-email`) | `email.trim()` | `EMAIL_PATTERN` | `forgot.invalidEmail` |
| login | contraseña (`login-password`) | tal cual | `length >= 1` | `validation.passwordRequired` |
| register | nombre (`register-first-name`) | `trim()` | `length >= 1` · `length <= 120` | `validation.firstNameRequired` · `validation.tooLong` `{max: 120}` |
| register | apellidos (`register-last-name`) | `trim()` | `length >= 1` · `length <= 120` | `validation.lastNameRequired` · `validation.tooLong` `{max: 120}` |
| register | correo (`register-email`) | `email.trim()` | `EMAIL_PATTERN` · `length <= 320` | `forgot.invalidEmail` · `validation.tooLong` `{max: 320}` |
| register | teléfono (`register-phone`) | `trim()` | `length >= 7` · `length <= 20` | `validation.tooShort` `{min: 7}` · `validation.tooLong` `{max: 20}` |
| register | país (`register-country`) | tal cual | `length === 2` · `/^[A-Z]{2}$/` | `validation.countryLength` · `validation.countryLetters` |
| register | contraseña (`register-password`) | tal cual | `length >= 8` · `length <= 128` | `validation.tooShort` `{min: 8}` · `validation.tooLong` `{max: 128}` |
| register | confirmación (`register-password-confirmation`) | tal cual | `=== password` | `validation.passwordsDontMatch` |
| forgot | correo (`forgot-email`) | `email.trim()` | `EMAIL_PATTERN` · `length <= 320` | `forgot.invalidEmail` · `validation.tooLong` `{max: 320}` |
| reset-password | contraseña (`reset-password`) | tal cual | `length >= 8` · `length <= 128` | `validation.tooShort` `{min: 8}` · `validation.tooLong` `{max: 128}` |
| reset-password | confirmación (`reset-password-confirm`) | tal cual | `=== password` | `validation.passwordsDontMatch` |

Por qué esto acepta exactamente lo mismo que el DTO:

- **La confirmación no lleva su propio `min`/`max`.** El DTO aplica
  `passwordSchema` a los dos campos y además exige que sean iguales. Si son
  iguales y la contraseña cumple 8..128, la confirmación también los cumple; si
  no son iguales, el cliente ya bloquea. El conjunto aceptado es el mismo.
  Mostrar un `tooShort` en la confirmación sería un segundo mensaje para el
  mismo fallo.
- **El correo de login no tiene `max`**, porque `login-user.dto.ts` no lo
  tiene. Un correo de 321 caracteres bien formado pasa en login y se bloquea
  en registro y en forgot.
- Los campos que no escribe el usuario quedan fuera (§Fuera de alcance):
  `token`, `timezone` y `termsAccepted`.

## Copy nuevo

Voz B de Pingo (`docs/ui-guidelines.md` punto 7): tranquila, tú en español,
sin emoji y con registro neutro en inglés. Los mensajes de campo no llevan
punto final, igual que el ya existente `forgot.invalidEmail` («Ingresa un
correo electrónico válido»). El aviso general sí lo lleva porque es una frase
completa. La redacción está pendiente de aprobar (Preguntas abiertas P2).

| Clave | `es` | `en` |
|---|---|---|
| `validation.firstNameRequired` | `Escribe tu nombre` | `Enter your first name` |
| `validation.lastNameRequired` | `Escribe tus apellidos` | `Enter your last name` |
| `validation.passwordRequired` | `Escribe tu contraseña` | `Enter your password` |
| `validation.tooShort` | `Usa al menos {{min}} caracteres` | `Use at least {{min}} characters` |
| `validation.tooLong` | `Usa {{max}} caracteres o menos` | `Use {{max}} characters or fewer` |
| `validation.passwordsDontMatch` | `Las contraseñas no coinciden` | `Passwords don't match` |
| `validation.countryLength` | `Escribe las 2 letras de tu país, como MX` | `Enter your country's 2-letter code, like MX` |
| `validation.countryLetters` | `Usa solo letras de la A a la Z` | `Use only letters A to Z` |
| `validation.checkDetails` | `Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.` | `Something in your details doesn't look right. Check them and try again.` |

Se reutiliza tal cual `forgot.invalidEmail` (`Ingresa un correo electrónico
válido` / `Enter a valid email address`).

Así se leen en pantalla los mensajes con parámetro (los tests aseveran estos
literales, no la clave):

| Caso | `es` | `en` |
|---|---|---|
| `tooShort {min: 7}` | `Usa al menos 7 caracteres` | `Use at least 7 characters` |
| `tooShort {min: 8}` | `Usa al menos 8 caracteres` | `Use at least 8 characters` |
| `tooLong {max: 20}` | `Usa 20 caracteres o menos` | `Use 20 characters or fewer` |
| `tooLong {max: 120}` | `Usa 120 caracteres o menos` | `Use 120 characters or fewer` |
| `tooLong {max: 128}` | `Usa 128 caracteres o menos` | `Use 128 characters or fewer` |
| `tooLong {max: 320}` | `Usa 320 caracteres o menos` | `Use 320 characters or fewer` |

## testIDs nuevos

Cada input lleva su `FieldError` con el mismo esquema que register en #172
R10. `FormError` añade el sufijo `-row` a la fila.

| Pantalla | `FieldError` | `FormError` (texto) | Fila |
|---|---|---|---|
| login | `login-email-error` | `login-email-message` | `login-email-message-row` |
| login | `login-password-error` | `login-password-message` | `login-password-message-row` |
| forgot | `forgot-email-error` | `forgot-email-message` | `forgot-email-message-row` |
| reset-password | `reset-password-error` | `reset-password-message` | `reset-password-message-row` |
| reset-password | `reset-password-confirm-error` | `reset-password-confirm-message` | `reset-password-confirm-message-row` |

Register no estrena testIDs: reutiliza los siete `register-<campo>-error` /
`-message` / `-message-row` de #172 R10. Ninguno de los nuevos cae bajo los
selectores por regex que existen hoy. Todos están anclados con `^…$` y
alternativas cerradas:
`/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/`
y `/^(reset-password|reset-password-confirm|reset-error|reset-submit)$/`.

## Convenciones de esta spec

- **Nombres.** Todo `it` nuevo o reescrito empieza por `#183 Rn:`. Todo
  comentario de código que cite esta feature se escribe `#183 Rn`: un `#183`
  suelto casa con `HEX_LITERAL` en design-drift.
- **RNTL 14.** `await` en todo `render`, `fireEvent.*` y `act`. Para el estado
  asíncrono, `waitFor` o `findBy*` sobre el árbol, como manda
  `docs/conventions.md` §Esperas sobre el árbol renderizado. Se espera primero
  a que **aparezca el mensaje**, y solo después se aseveran las ausencias
  (otros mensajes, el error general) y los contadores de mock.
- **Icono de la fila.** Siempre
  `within(row).getByTestId('icon-alert-circle')`, nunca
  `screen.getByTestId('icon-alert-circle')`, porque varios iconos conviven en
  pantalla. Los mocks de reicon de login, forgot y reset ya exponen
  `AlertCircle: mockIcon('icon-alert-circle')`. El de register también, y es
  el que usa #172 R10.
- **Literales en los tests.** El copy esperado se escribe literal en el test.
  Nunca se importa de `catalog.ts`, y la tabla de correos no compara
  `EMAIL_PATTERN` consigo mismo: los booleanos esperados van escritos a mano.
  Si no, el candado es tautológico.
- **Cadenas largas.** Se construyen con `'a'.repeat(n)` (por ejemplo
  `'a'.repeat(309) + '@example.com'` tiene 321 caracteres).
- **Sondas.** Las sondas mutan solo producción, se corren en el commit verde
  de su R, y se revierten con `git checkout HEAD -- <ruta>`. Después se
  comprueba que `git diff --quiet HEAD -- <ruta>` y `git diff --cached --quiet`
  salen 0.
- **Commits.** Por cada R va primero el rojo,
  `test(mobile): <qué> (#183 Rn)`, y en un commit aparte el verde,
  `feat(mobile): <qué> (#183 Rn)`. R1 es solo catálogo y su verde se titula
  `feat(mobile): copy de validación (#183 R1)`.
- **Restricción de par (sites-99, #178/#179).** No se renombran, mueven ni
  borran estos dos mocks: `HomeEntrance` en
  `src/screens/login/index.test.tsx` y el de reicon (`...actual` +
  `mockIcon(testID)`) en `src/screens/register/index.test.tsx`. Esta spec no
  los necesita cambiar. Ancla al cierre:
  `git diff <H0> -- src/screens/login/index.test.tsx | grep -cF 'HomeEntrance'`
  → `0`, y
  `git diff <H0> -- src/screens/register/index.test.tsx | grep -cF 'mockIcon'`
  → `0`.
- **Clases.** No se añade ni se cambia ninguna clase. Los `it.each` de
  `#172 R20` en `src/__tests__/account-screens-polish.test.ts` siguen verdes
  sin tocarlos. `FieldError` y `FormError` ya existen y no llevan hex ni
  `StyleSheet`.

## Requisitos funcionales

### R1 — El catálogo trae el copy de validación en los dos idiomas

**EARS.** THE SYSTEM SHALL declarar en `src/i18n/catalog.ts` las nueve claves
de §Copy nuevo con sus valores `en` y `es` literales, y registrarlas en
`specs/mobile-ui-language/design.md`, en una sección nueva
`### §2.N — Añadidos por #183 — Validación en cliente de las pantallas de cuenta`
donde N es la última en H0 + 1 (B5). Cada fila sigue el formato
`| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #183 (R1) |`.

**Candados** (`src/providers/__tests__/language-provider.test.tsx`):

1. La fórmula de longitud del catálogo (el `it` `mantiene la base más las
   claves de #68 y los mismos marcadores en ambos idiomas`) cierra con
   `+ 3 // #172 R16` y una línea nueva `+ 9, // #183 R1`. El total esperado es
   `B_KEYS` + 9. Ese mismo `it` ya compara los marcadores `{{min}}` y
   `{{max}}` entre idiomas.
2. Hay un `describe('#183 R1: el copy de la validación en cliente')` con un
   `it('#183 R1: declara las claves de validación en los dos idiomas y su registro')`
   calcado de `#172 R16`. Tiene un array de 9 tuplas `[clave, en, es]` con
   los literales de §Copy nuevo. Para cada tupla asevera
   `english[key]`/`spanish[key]` con `toBe`, y que el design de idioma case
   con `'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #183 \\(R1\\)'`.
   Asevera también la cabecera
   `/### §2\.\d+ — Añadidos por #183 — Validación en cliente de las pantallas de cuenta/`.

**Rojo esperado** (`bunx jest src/providers/__tests__/language-provider.test.tsx`):

| `it` | Tipo |
|---|---|
| `mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` | aserción (`toHaveLength`: `B_KEYS` frente a `B_KEYS + 9`) |
| `#183 R1: declara las claves de validación en los dos idiomas y su registro` | aserción (`toBe`: `undefined` frente al literal) |

Total: **2** `it` en rojo, los dos por aserción. Ningún guard global se mueve
en el rojo.

**Verde.** Se añaden las 9 claves a `en` y `es` y la sección §2.N al design de
idioma. La suite queda en verde. `src/__tests__/ui-language.test.ts` sigue en
verde: `FIXED_COPY` no encuentra ningún valor nuevo como literal en las
pantallas.

**Sondas** (en el verde de R1, mutando `src/i18n/catalog.ts`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S1.1 | `es['validation.tooShort']` pasa a `Usa al menos 7 caracteres` (sin marcador) | 2: los dos `it` de la tabla (aserción) |
| S1.2 | Borrar `validation.countryLetters` de `en` y de `es` | 2: los dos `it` de la tabla (aserción) |

**Anclas:** `grep -cF "'validation." src/i18n/catalog.ts` → `18` (base 0:
nueve en `en` y nueve en `es`).
`grep -cF 'por #183 (R1)' ../specs/mobile-ui-language/design.md` → `9`
(base 0).

### R2 — Un módulo puro decide las reglas, idénticas a los DTO

**EARS.**

- THE SYSTEM SHALL exponer en `src/utils/account-rules.ts` `EMAIL_PATTERN`
  (el literal de zod de §Reglas) y cuatro validadores puros:
  `validateLogin`, `validateRegister`, `validateForgot` y
  `validateResetPassword`.
- WHEN un validador recibe valores, THE SYSTEM SHALL devolver un objeto con
  una entrada por cada campo inválido. Cada entrada es
  `{ labelKey, params? }`, con la clave y el parámetro de la primera regla que
  falla según §Reglas. Los campos válidos no aparecen: ni con valor
  `undefined` ni de ninguna otra forma.
- WHEN todos los campos cumplen el DTO, THE SYSTEM SHALL devolver `{}`.

Cada literal `labelKey: '<clave>'` aparece **exactamente una vez** en el
fichero (constantes y los helpers `tooShort(min)` / `tooLong(max)`), así que
`checkUses` cuenta 1 por clave.

**Candados** (`src/utils/account-rules.test.ts`, nuevo, colocado junto al
módulo). Todas las comparaciones usan `toStrictEqual`, no `toEqual`, para que
una entrada `{ email: undefined }` falle. `VALID` vale
`{ firstName: 'A', lastName: 'S', email: 'alex@example.com', phone: '+525555555555', country: 'MX', password: 'correct horse', passwordConfirmation: 'correct horse' }`
(Enmienda E1: nombre y apellidos de un carácter, que es el mínimo del DTO).

Tabla **C** — `it.each` `#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)`.
Cada fila asevera `EMAIL_PATTERN.test(valor)` contra el booleano literal:

| # | Valor | Esperado |
|---|---|---|
| C1 | `alex@example.com` | `true` |
| C2 | `Ana@Example.com` | `true` |
| C3 | `o'neil+tag@mail.example.co` | `true` |
| C4 | `alex@example.c` | `false` |
| C5 | `alex.@example.com` | `false` |
| C6 | `.alex@example.com` | `false` |
| C7 | `a..b@example.com` | `false` |
| C8 | `ñu@example.com` | `false` |
| C9 | `alex@-example.com` | `false` |
| C10 | `alex@example.co1` | `false` |
| C11 | `alex@example` | `false` |
| C12 | `alex @example.com` | `false` |
| C13 | `alex.example.com` | `false` |
| C14 | ` alex@example.com` (espacio delante) | `false` |
| C15 | `` (vacío) | `false` |
| C16 | `a_1-b.c_@x2-y.example.technology` (E1) | `true` |
| C17 | `z9@1x.io` (E1) | `true` |
| C18 | `+@b.co` (E1) | `true` |
| C19 | `a-@b.co` (E1) | `true` |
| C20 | `a@b_c.co` (E1) | `false` |

Tabla **L** — `it.each` `#183 R2: validateLogin %s`:

| # | Valores | Esperado |
|---|---|---|
| L1 | `{ email: 'alex@example.com', password: 'correct horse' }` | `{}` |
| L2 | password `' '` | `{}` (el DTO no recorta) |
| L3 | email `'alex.example.com'` | `{ email: { labelKey: 'forgot.invalidEmail' } }` |
| L4 | password `''` | `{ password: { labelKey: 'validation.passwordRequired' } }` |
| L5 | email `'alex.example.com'`, password `''` | las dos entradas de L3 y L4 |
| L6 | email `'a'.repeat(309) + '@example.com'` (321) | `{}` (login no tiene `max`) |

Tabla **G** — `it.each` `#183 R2: validateRegister %s`. Cada fila sobreescribe
`VALID`; con «pw=conf» se ponen los dos campos al mismo valor:

| # | Cambio sobre `VALID` | Esperado |
|---|---|---|
| G1 | ninguno | `{}` |
| G2 | firstName `''` | `firstName: { labelKey: 'validation.firstNameRequired' }` |
| G3 | firstName `'   '` | igual que G2 |
| G4 | firstName `' ' + 'a'.repeat(120) + ' '` | `{}` |
| G5 | firstName `'a'.repeat(121)` | `firstName: { labelKey: 'validation.tooLong', params: { max: 120 } }` |
| G6 | lastName `''` | `lastName: { labelKey: 'validation.lastNameRequired' }` |
| G7 | lastName `'   '` | igual que G6 |
| G8 | lastName `' ' + 'a'.repeat(120) + ' '` (E1) | `{}` |
| G9 | lastName `'a'.repeat(121)` | `lastName: { labelKey: 'validation.tooLong', params: { max: 120 } }` |
| G10 | email `'alex.example.com'` | `email: { labelKey: 'forgot.invalidEmail' }` |
| G11 | email `'alex@example.c'` | igual que G10 |
| G12 | email `'a'.repeat(308) + '@example.com'` (320) | `{}` |
| G13 | email `'a'.repeat(309) + '@example.com'` (321) | `email: { labelKey: 'validation.tooLong', params: { max: 320 } }` |
| G14 | email `'a'.repeat(321)` | igual que G10 (el formato va antes que la longitud) |
| G15 | phone `'123456'` | `phone: { labelKey: 'validation.tooShort', params: { min: 7 } }` |
| G16 | phone `'  123456  '` | igual que G15 |
| G17 | phone `'1234567'` | `{}` |
| G18 | phone `'55 1234'` | `{}` |
| G19 | phone `'1'.repeat(21)` | `phone: { labelKey: 'validation.tooLong', params: { max: 20 } }` |
| G20 | phone `' ' + '1'.repeat(20) + ' '` | `{}` |
| G21 | country `''` | `country: { labelKey: 'validation.countryLength' }` |
| G22 | country `'M'` | igual que G21 |
| G23 | country `'MX '` (E1; el DTO no recorta el país) | igual que G21 |
| G24 | country `'m'` | igual que G21 (la longitud va antes que las letras) |
| G25 | country `'mx'` | `country: { labelKey: 'validation.countryLetters' }` |
| G26 | country `'M1'` | igual que G25 |
| G27 | country `'ÑA'` | igual que G25 |
| G28 | pw=conf `'1234567'` | `password: { labelKey: 'validation.tooShort', params: { min: 8 } }` |
| G29 | pw=conf `' '.repeat(8)` | `{}` |
| G30 | pw=conf `'a'.repeat(128)` | `{}` |
| G31 | pw=conf `'a'.repeat(129)` | `password: { labelKey: 'validation.tooLong', params: { max: 128 } }` |
| G32 | passwordConfirmation `'correct horsE'` | `passwordConfirmation: { labelKey: 'validation.passwordsDontMatch' }` |
| G33 | password `'1234567'`, passwordConfirmation `'x'` | entradas de G28 y G32 |

Tabla **F** — `it.each` `#183 R2: validateForgot %s`:

| # | email | Esperado |
|---|---|---|
| F1 | `'alex@example.com'` | `{}` |
| F2 | `'alex.example.com'` | `{ email: { labelKey: 'forgot.invalidEmail' } }` |
| F3 | `'a'.repeat(308) + '@example.com'` (320) | `{}` |
| F4 | `'a'.repeat(309) + '@example.com'` (321) | `{ email: { labelKey: 'validation.tooLong', params: { max: 320 } } }` |
| F5 | `'a'.repeat(321)` | igual que F2 |

Tabla **N** — `it.each` `#183 R2: validateResetPassword %s`:

| # | password / passwordConfirmation | Esperado |
|---|---|---|
| N1 | `'new-password-123'` / igual | `{}` |
| N2 | `'1234567'` / igual | `{ password: { labelKey: 'validation.tooShort', params: { min: 8 } } }` |
| N3 | `' '.repeat(8)` / igual | `{}` |
| N4 | `'a'.repeat(128)` / igual | `{}` |
| N5 | `'a'.repeat(128) + ' '` / igual (E1) | `{ password: { labelKey: 'validation.tooLong', params: { max: 128 } } }` |
| N6 | `'new-password-123'` / `'new-password-123 '` (E1) | `{ passwordConfirmation: { labelKey: 'validation.passwordsDontMatch' } }` |
| N7 | `'1234567'` / `'x'` | entradas de N2 y N6 |

Total del fichero: 20 + 6 + 33 + 5 + 7 = **71** casos (66 antes de E1).

**Filas de `src/__tests__/ui-copy-table.ts`** (en el rojo de R2, al final de
`R1_AUTH`, una por clave):

```
  { file: 'src/utils/account-rules.ts', key: 'forgot.invalidEmail' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.firstNameRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.lastNameRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.passwordRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.tooShort' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.tooLong' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.passwordsDontMatch' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.countryLength' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.countryLetters' }, // #183 R2
```

En `src/__tests__/ui-language.test.ts`:

- la fórmula de `R1_AUTH` gana `+ 9` (comentario `#183 R2`) y el título del
  `it` pasa a `resuelve las <B_AUTH + 9> ocurrencias normativas`;
- la fórmula de `SCREEN_FILES` gana una línea `+ 1 // #183 R2: utils/account-rules.ts`.

**Rojo esperado** (`bunx jest src/utils/account-rules.test.ts src/__tests__/ui-language.test.ts`):

| Suite / `it` | Tipo |
|---|---|
| `src/utils/account-rules.test.ts` | la suite no arranca: `Cannot find module './account-rules'` (0 `it` ejecutados) |
| `resuelve las <B_AUTH + 9> ocurrencias normativas` | excepción `ENOENT` (`readFileSync` del módulo que aún no existe) |
| `resuelve cada ocurrencia de la tabla contra la clave exacta` | excepción `ENOENT` |
| `no deja ningún valor fijo del catálogo como literal entero en las pantallas` | excepción `ENOENT` (la longitud ya cuadra; falla al leer el fichero) |

Total: 1 suite que no arranca y **3** `it` en rojo por `ENOENT`. No hay rojos
de consulta: R2 no monta pantallas.

**Verde.** Se crea `src/utils/account-rules.ts`, sin importar zod ni nada de
`react`/`react-native`. Las dos suites quedan en verde con 66 casos en
`account-rules.test.ts`.

**Sondas** (en el verde de R2, mutando `src/utils/account-rules.ts`; los rojos
caen todos en `account-rules.test.ts` y son todos de aserción):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S2.1 | `EMAIL_PATTERN` pasa a ser el de #172, `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | 9: C4–C10, C20 (E1) y G11 |
| S2.2 | login comprueba `password.trim().length < 1` | 1: L2 |
| S2.3 | el nombre exige `length >= 1` sin recortar | 1: G3 |
| S2.4 | los apellidos exigen `length >= 1` sin recortar | 1: G7 |
| S2.5 | el teléfono cuenta sin recortar | 2: G16, G20 |
| S2.6 | el `max 120` del nombre cuenta sin recortar | 1: G4 |
| S2.7 | el `max` del correo pasa a 321 | 2: G13, F4 |
| S2.8 | el `min` de la contraseña pasa a 7 | 4: G28, G33, N2, N7 |
| S2.9 | la contraseña se recorta antes de medir | 3: G29, N3 y N5 (E1) |
| S2.10 | el regex de país lleva la bandera `i` | 1: G25 |
| S2.11 | en país, las letras se comprueban antes que la longitud | 4: G21, G22, G23, G24 |
| S2.12 | en el correo, la longitud se comprueba antes que el formato | 2: G14, F5 |
| S2.13 | login añade `max 320` al correo | 1: L6 |
| S2.14 | la confirmación compara sin distinguir mayúsculas | 1: G32 |

**Anclas** (en `src/utils/account-rules.ts`):

- `grep -cF "labelKey: '<clave>'"` → `1` para cada una de las 9 claves de las
  filas;
- `grep -cF "from 'zod'"` → `0`;
- `grep -cF "/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/"` → `1`.

### R3 — Iniciar sesión valida sus dos campos y manda el correo recortado

**EARS.**

- WHEN el usuario pulsa `login-submit` y `validateLogin` devuelve entradas,
  THE SYSTEM SHALL pintar cada mensaje en el `FieldError` de su campo, con
  icono y texto seleccionable, borrar `login-error` y no llamar a `login(...)`.
- WHEN la validación pasa, THE SYSTEM SHALL llamar a `login(apiUrl, { email:
  email.trim(), password })`.

Copy: correo `Ingresa un correo electrónico válido` / `Enter a valid email
address`; contraseña `Escribe tu contraseña` / `Enter your password`.

**Candados** (`src/screens/login/index.test.tsx`, nuevo
`describe('#183 R3: …')`). En cada caso que no debe llamar a la API se pone
antes `mockLogin.mockResolvedValue({ kind: 'error' })`. En los casos de envío
válido se pone `{ kind: 'ok', accessToken: 'jwt-token' }`.

1. `it.each(['', 'alex.example.com', 'alex@example.c', 'ñu@example.com'])('#183 R3: «%s» en login-email no llama a la API y marca el campo')`.
   El caso hace `await submit(valor, 'correct horse')` y luego:
   `waitFor` hasta que `login-email-message` diga
   `Ingresa un correo electrónico válido`; `row = getByTestId('login-email-message-row')`;
   `row.children` igual a `[within(row).getByTestId('icon-alert-circle'), texto]`;
   `texto.props.selectable` es `true`;
   `queryByTestId('login-password-message')` y `queryByTestId('login-error')`
   son `null`; `mockLogin` no se ha llamado. **4 casos.**
2. `#183 R3: sin contraseña no llama a la API y marca login-password`.
   Hace `submit('alex@example.com', '')`, y `login-password-message` dice
   `Escribe tu contraseña`. El resto de aserciones son como en 1, cambiando
   de campo.
3. `#183 R3: con los dos campos mal pinta los dos mensajes a la vez`. Hace
   `submit('alex.example.com', '')`: aparecen los dos mensajes y hay dos filas
   `login-*-message-row`. `mockLogin` no se ha llamado.
4. `#183 R3: una contraseña de un espacio pasa como en el DTO`. Hace
   `submit('alex@example.com', ' ')` y asevera
   `mockLogin` `toHaveBeenCalledWith(apiUrl, { email: 'alex@example.com', password: ' ' })`.
5. `#183 R3: envía a la API el correo sin espacios alrededor`. Hace
   `submit('  Alex@Example.com  ', 'correct horse')` y asevera
   `toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' })`.
   Sigue el patrón del `it` heredado `signs in and replaces the route after a successful login`.
6. `#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»`.
   Usa el render de `#167 R6: la burbuja dice el saludo en inglés`
   (`HeroUINativeProvider` + `LanguageProvider initial="en"`) y hace
   `submit('alex.example.com', '')`. Asevera los dos textos y que `mockLogin`
   no se ha llamado.
7. `#183 R3: corregir y reenviar quita los mensajes y llama una vez a la API`.
   Hace `submit('alex.example.com', '')` y espera los dos mensajes. Luego
   `submit('alex@example.com', 'correct horse')` con ok: ya no hay
   `login-*-message`, y `mockLogin` `toHaveBeenCalledTimes(1)`.

**Rojo esperado** (`bunx jest src/screens/login/index.test.tsx`):

| `it` | Casos | Tipo |
|---|---|---|
| 1 | 4 | consulta (`waitFor`/`getByTestId('login-email-message')` no lo encuentra) |
| 2 | 1 | consulta |
| 3 | 1 | consulta |
| 4 | 1 | **nace verde**: hoy cualquier contraseña llega a la API. Lo guarda S3.2 |
| 5 | 1 | aserción (`toHaveBeenCalledWith` recibe el correo con espacios) |
| 6 | 1 | consulta |
| 7 | 1 | consulta |

Total: **9** en rojo (8 de consulta y 1 de aserción) y 1 que nace verde. Los
`it` heredados siguen verdes, y `signs in…` también, porque usa
`alex@example.com`.

**Verde.** Ver design.md §Pantallas: estado `fieldErrors`,
`TextField isInvalid`, `FieldError` + `FormError`, y `values` recortado que se
valida y se envía.

**Sondas** (en el verde de R3, mutando `src/screens/login/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S3.1 | la llamada usa `email` en vez de `values.email` | 1: `it` 5 (aserción) |
| S3.2 | se borra el `return` tras `setFieldErrors(issues)` | 9: `it` 1 ×4, 2, 3, 6, 7 y el `it` de E1 (aserción) |
| S3.3 | se valida `{ email, password }` sin recortar y se envía `values` | 1: `it` 5 (aserción: no se llamó) |

**Anclas** (`src/screens/login/index.tsx`):
`isInvalid={Boolean(fieldErrors.` → `2`; `<FieldError` → `2`;
`t(fieldErrors.` → `2`; `from '../../utils/account-rules'` → `1`. La base
de las cuatro es 0.

### R4 — Crear cuenta valida sus siete campos y manda el correo recortado

**EARS.**

- WHEN el usuario pulsa `register-submit` y `validateRegister` devuelve
  entradas, THE SYSTEM SHALL pintar cada mensaje en el `FieldError` de su
  campo, borrar `register-error` y no llamar a `register(...)`.
- WHEN la validación pasa, THE SYSTEM SHALL mandar `email.trim()` tanto a
  `register(...)` como al `login(...)` que le sigue.
- THE SYSTEM SHALL dejar de usar el `EMAIL_PATTERN` local de #172 y usar el
  de `src/utils/account-rules.ts`.

Copy literal por campo, en `es` / `en`:

- nombre: `Escribe tu nombre` / `Enter your first name`, y `Usa 120 caracteres o menos` / `Use 120 characters or fewer`;
- apellidos: `Escribe tus apellidos` / `Enter your last name`, y el mismo `max 120`;
- correo: `Ingresa un correo electrónico válido` / `Enter a valid email address`, y `Usa 320 caracteres o menos` / `Use 320 characters or fewer`;
- teléfono: `Usa al menos 7 caracteres` / `Use at least 7 characters`, y `Usa 20 caracteres o menos` / `Use 20 characters or fewer`;
- país: `Escribe las 2 letras de tu país, como MX` / `Enter your country's 2-letter code, like MX`, y `Usa solo letras de la A a la Z` / `Use only letters A to Z`;
- contraseña: `Usa al menos 8 caracteres` / `Use at least 8 characters`, y `Usa 128 caracteres o menos` / `Use 128 characters or fewer`;
- confirmación: `Las contraseñas no coinciden` / `Passwords don't match`.

**Candados** (`src/screens/register/index.test.tsx`, nuevo
`describe('#183 R4: …')`; no toca el mock de reicon). Todos los casos ponen
antes `mockRegister.mockResolvedValue({ kind: 'email-taken' })`, menos el
`it` 5.

1. `it.each` `#183 R4: %s con %p pinta «%s» solo en ese campo y no llama a la API`.
   Columnas: campo, cambios `{ testID: valor }` y copy. Cada caso hace
   `fillForm()`, aplica los cambios con `await fireEvent.changeText`, y llama
   a `submit()`. Luego:
   - `waitFor` hasta que `register-<campo>-message` tenga el copy;
   - `getAllByTestId(/^register-.+-message-row$/)` tiene longitud 1;
   - `row.children` es `[within(row).getByTestId('icon-alert-circle'), texto]`;
   - el texto es seleccionable;
   - `queryByTestId('register-error')` es `null`;
   - `mockRegister` no se ha llamado.

   | # | Campo | Cambios | Copy `es` |
   |---|---|---|---|
   | 1 | `first-name` | `register-first-name: ''` | `Escribe tu nombre` |
   | 2 | `first-name` | `register-first-name: '   '` | `Escribe tu nombre` |
   | 3 | `first-name` | `register-first-name: 'a'.repeat(121)` | `Usa 120 caracteres o menos` |
   | 4 | `last-name` | `register-last-name: ''` | `Escribe tus apellidos` |
   | 5 | `last-name` | `register-last-name: 'a'.repeat(121)` | `Usa 120 caracteres o menos` |
   | 6 | `email` | `register-email: 'alex@example.c'` | `Ingresa un correo electrónico válido` |
   | 7 | `email` | `register-email: 'ñu@example.com'` | `Ingresa un correo electrónico válido` |
   | 8 | `email` | `register-email: 'a'.repeat(309) + '@example.com'` | `Usa 320 caracteres o menos` |
   | 9 | `phone` | `register-phone: '123456'` | `Usa al menos 7 caracteres` |
   | 10 | `phone` | `register-phone: '1'.repeat(21)` | `Usa 20 caracteres o menos` |
   | 11 | `country` | `register-country: 'M'` | `Escribe las 2 letras de tu país, como MX` |
   | 12 | `country` | `register-country: ''` | `Escribe las 2 letras de tu país, como MX` |
   | 13 | `country` | `register-country: 'M1'` | `Usa solo letras de la A a la Z` |
   | 14 | `country` | `register-country: 'ña'` (la pantalla lo pasa a `ÑA`) | `Usa solo letras de la A a la Z` |
   | 15 | `password` | `register-password` y `register-password-confirmation`: `'1234567'` | `Usa al menos 8 caracteres` |
   | 16 | `password` | los dos: `'a'.repeat(129)` | `Usa 128 caracteres o menos` |
   | 17 | `password-confirmation` | `register-password-confirmation: 'correct horsE'` | `Las contraseñas no coinciden` |

   **17 casos.**
2. `it.each` `#183 R4: %s con %p pasa como en el DTO y llama a la API`. Cada
   caso hace `fillForm()`, aplica los cambios y llama a `submit()`. Espera a que
   `register-error` diga `Ese correo ya está registrado`. Después no hay
   `/^register-.+-message-row$/` y `mockRegister` `toHaveBeenCalledTimes(1)`.

   | # | Cambios |
   |---|---|
   | 1 | `register-first-name: ' ' + 'a'.repeat(120) + ' '` |
   | 2 | `register-last-name: 'a'.repeat(120)` |
   | 3 | `register-email: 'a'.repeat(308) + '@example.com'` |
   | 4 | `register-phone: '1234567'` |
   | 5 | `register-phone: '55 1234'` |
   | 6 | `register-phone: ' ' + '1'.repeat(20) + ' '` |
   | 7 | contraseña y confirmación: `' '.repeat(8)` |
   | 8 | contraseña y confirmación: `'a'.repeat(128)` |

   **8 casos.**
3. `#183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API`.
   Hace `renderRegister()` sin `fillForm`, pulsa los términos como lo hace
   `fillForm`, escribe `x` en `register-password-confirmation` y llama a
   `submit()`. Espera a que aparezcan los siete textos: first-name
   `Escribe tu nombre`, last-name `Escribe tus apellidos`, email
   `Ingresa un correo electrónico válido`, phone `Usa al menos 7 caracteres`,
   country `Escribe las 2 letras de tu país, como MX`, password
   `Usa al menos 8 caracteres` y password-confirmation
   `Las contraseñas no coinciden`. Hay 7 filas y `mockRegister` no se ha
   llamado.
4. `#183 R4: en inglés los siete mensajes salen en inglés`. Hace lo mismo que
   el `it` 3, con el render en inglés de `#172 R12: en inglés el correo
   inválido…`. Textos: `Enter your first name`, `Enter your last name`,
   `Enter a valid email address`, `Use at least 7 characters`,
   `Enter your country's 2-letter code, like MX`, `Use at least 8 characters`
   y `Passwords don't match`.
5. `#183 R4: envía el correo sin espacios a register y al login que le sigue`.
   Pone `mockRegister` en ok con `user` y `mockLogin` en
   `{ kind: 'ok', accessToken: 'jwt-token' }`, como el `it` heredado del alta
   correcta. Luego hace `fillForm()`, escribe `'  Alex@Example.com  '` en
   `register-email` y llama a `submit()`. Comprueba:
   - `mockRegister` `toHaveBeenCalledWith(apiUrl, {…})`: el mismo objeto que
     el heredado, con `email: 'Alex@Example.com'`;
   - `mockLogin` `toHaveBeenCalledWith(apiUrl, { email: 'Alex@Example.com', password: 'correct horse' })`.

**Filas.** En el rojo de R4 se quita de `ui-copy-table.ts` la fila
`{ file: 'src/screens/register/index.tsx', key: 'forgot.invalidEmail' }, // #172 R16`,
y la fórmula de `R1_AUTH` gana `- 1` (comentario `#183 R4`). El título pasa a
`resuelve las <B_AUTH + 8> ocurrencias normativas`. `checkUses` solo comprueba
las filas listadas, así que quitar la fila no se observa en el rojo: el `it`
sigue en verde. En el verde, `t('forgot.invalidEmail')` desaparece de la
pantalla.

**Rojo esperado** (`bunx jest src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts`):

| `it` | Casos | Tipo |
|---|---|---|
| 1 | 17 | consulta (`register-<campo>-message` no aparece: hoy solo se valida el correo con el patrón laxo, y las filas 6–8 lo pasan) |
| 2 | 8 | **nacen verdes**: hoy nada de eso se bloquea. Las guardan las sondas de R2 y la S4.4 |
| 3 | 1 | consulta (`register-first-name-message`) |
| 4 | 1 | consulta |
| 5 | 1 | aserción (`toHaveBeenCalledWith` recibe el correo con espacios) |
| `resuelve las <B_AUTH + 8> ocurrencias normativas` | — | verde (ver §Filas) |

Total: **20** en rojo (19 de consulta y 1 de aserción) y 8 que nacen verdes.
Los `#172 R10`, `#172 R11` y `#172 R12` heredados siguen verdes. En R4 el 400
sigue pintando en los campos el texto del servidor; eso cambia en R7.

**Verde.** Ver design.md §Pantallas. Desaparecen `const EMAIL_PATTERN` y la
llamada `t('forgot.invalidEmail')`. `fieldErrors` pasa a guardar `RuleIssue`.
`mapValidationErrors` se queda hasta R7, pero su salida `fields` pasa a un
estado de transición aparte, `serverFieldErrors`, con el texto del servidor tal
cual. R7 lo borra. design.md §Register fija la forma.

**Sondas** (en el verde de R4, mutando `src/screens/register/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S4.1 | `register(...)` recibe `email` sin recortar | 1: `it` 5 (aserción) |
| S4.2 | el `login(...)` posterior recibe `email` sin recortar | 1: `it` 5 (aserción) |
| S4.3 | se quita `isInvalid` del `TextField` del teléfono | 6: `it` 1 filas 9 y 10, `it` 3, `it` 4 y `#172 R10: cada campo con error lleva icono y texto seleccionable` (consulta); además `#172 R10: los siete campos del registro marcan isInvalid` en `account-screens-polish.test.ts` (aserción, 6 ≠ 7) |
| S4.4 | se borra el `return` tras `setFieldErrors(issues)` | 25 de aserción: `it` 1 ×17, `it` 3, `it` 4 y el `it` de E1. Más cinco `#172 R12` heredados: `un correo sin arroba…`, `en inglés el correo inválido…`, `tras un correo inválido…` (`toHaveBeenCalledTimes(1)`) y el `it.each` de dos casos |

**Anclas** (`src/screens/register/index.tsx`): `const EMAIL_PATTERN` → `0`
(base 1); `t('forgot.invalidEmail')` → `0` (base 1); `t(fieldErrors.` → `7`
(base 0); `isInvalid={Boolean(fieldErrors.` → `7` (base 7);
`from '../../utils/account-rules'` → `1` (base 0).

### R5 — Recuperar contraseña valida el correo antes de llamar

**EARS.**

- WHEN el usuario pulsa `forgot-submit` y `validateForgot({ email: email.trim() })`
  devuelve una entrada, THE SYSTEM SHALL pintarla en `forgot-email-error`,
  borrar `forgot-error`, seguir en el formulario y no llamar a
  `forgotPassword(...)`.
- El botón sigue desactivado con el correo vacío o con solo espacios.
- El reenvío desde «Revisa tu correo» no se revalida, porque reusa el correo
  ya validado.

Copy: `Ingresa un correo electrónico válido` / `Enter a valid email address`;
`Usa 320 caracteres o menos` / `Use 320 characters or fewer`.

**Candados** (`src/screens/forgot/index.test.tsx`, nuevo
`describe('#183 R5: …')`). En los casos que no deben llamar a la API se pone
antes `mockForgotPassword.mockResolvedValue({ kind: 'error' })`.

1. `it.each` `#183 R5: «%s» no llama a la API y marca forgot-email con «%s»`.
   Cada caso hace `submitForgot(valor)` y luego:
   - `waitFor` hasta que `forgot-email-message` tenga el copy;
   - `row.children` es `[within(row).getByTestId('icon-alert-circle'), texto]`;
   - el texto es seleccionable;
   - `forgot-error` es `null`;
   - `forgot-title` sigue diciendo `Recuperar contraseña`;
   - `forgot-submit` no está desactivado;
   - `mockForgotPassword` no se ha llamado.

   Filas: `alex.example.com`, `alex@example.c` y `ñu@example.com` →
   `Ingresa un correo electrónico válido`; `'a'.repeat(309) + '@example.com'`
   → `Usa 320 caracteres o menos`. **4 casos.**
2. `#183 R5: un correo de 320 caracteres pasa como en el DTO y llama a la API`.
   Con `{ kind: 'ok' }`, hace `submitForgot('a'.repeat(308) + '@example.com')`
   y espera `findByText('Revisa tu correo')`. Luego asevera
   `toHaveBeenCalledWith(apiUrl, { email: <ese valor> })`.
3. `#183 R5: corregir el correo quita el mensaje y envía el recortado`. Hace
   `submitForgot('alex.example.com')` y espera el mensaje. Luego, con
   `{ kind: 'ok' }`, hace `submitForgot('  Ana@Example.com ')` y espera
   `Revisa tu correo`. `mockForgotPassword` `toHaveBeenCalledTimes(1)` y
   `toHaveBeenCalledWith(apiUrl, { email: 'Ana@Example.com' })`.

**Rojo esperado** (`bunx jest src/screens/forgot/index.test.tsx`):

| `it` | Casos | Tipo |
|---|---|---|
| 1 | 4 | consulta (`forgot-email-message`) |
| 2 | 1 | **nace verde** (lo guarda S5.2 junto con la fila 4 de `it` 1) |
| 3 | 1 | consulta |

Total: **5** en rojo, todos de consulta, y 1 que nace verde.

**Sondas** (en el verde de R5, mutando `src/screens/forgot/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S5.1 | se borra el `return` tras marcar el campo | 6: `it` 1 ×4, `it` 3 y el `it` de E1 (aserción) |
| S5.2 | la pantalla usa `EMAIL_PATTERN.test(...)` en vez de `validateForgot` | 1: `it` 1 fila 4 (consulta) |
| S5.3 | se quita `isInvalid` del `TextField` | 6: `it` 1 ×4, `it` 3 y el `it` de E1 (consulta) |

**Anclas** (`src/screens/forgot/index.tsx`): `isInvalid={Boolean(fieldErrors.`
→ `1`; `<FieldError` → `1`; `t(fieldErrors.` → `1`;
`from '../../utils/account-rules'` → `1`. La base de las cuatro es 0.

### R6 — Nueva contraseña valida contraseña y confirmación antes de llamar

**EARS.** WHEN el usuario pulsa `reset-submit` y `validateResetPassword`
devuelve entradas, THE SYSTEM SHALL pintar cada mensaje en el `FieldError` de
su campo (`reset-password-error`, `reset-password-confirm-error`), borrar
`reset-error` y no llamar a `resetPassword(...)`.

Copy: `Usa al menos 8 caracteres` / `Use at least 8 characters`;
`Usa 128 caracteres o menos` / `Use 128 characters or fewer`;
`Las contraseñas no coinciden` / `Passwords don't match`.

**Candados** (`src/screens/reset-password/index.test.tsx`, nuevo
`describe('#183 R6: …')`, con `renderRoute('reset-token-r8')`). En los casos
que no deben llamar a la API se pone antes
`mockResetPassword.mockResolvedValue({ kind: 'error' })`.

1. `it.each` `#183 R6: %p pinta «%s» en %s y no llama a la API`. Cada caso
   hace `submitReset(password, confirmación)` y espera el texto. Después:
   - `getAllByTestId(/^reset-password(-confirm)?-message-row$/)` tiene
     longitud 1;
   - `row.children` es `[within(row).getByTestId('icon-alert-circle'), texto]`;
   - el texto es seleccionable;
   - `reset-error` es `null`;
   - `mockResetPassword` no se ha llamado.

   Filas: `['1234567', '1234567']` → `Usa al menos 8 caracteres` en
   `reset-password-message`; `['a'.repeat(129), 'a'.repeat(129)]` →
   `Usa 128 caracteres o menos` en `reset-password-message`;
   `['new-password-123', 'new-password-124']` →
   `Las contraseñas no coinciden` en `reset-password-confirm-message`.
   **3 casos.**
2. `#183 R6: las dos reglas a la vez pintan los dos mensajes`. Hace
   `submitReset('1234567', 'x')`: salen dos filas, y `mockResetPassword` no se
   ha llamado.
3. `it.each` `#183 R6: %p pasa como en el DTO y llama a la API`. Filas
   `' '.repeat(8)` y `'a'.repeat(128)`, la misma en los dos campos. Cada caso
   espera la misma señal de éxito que el envío ok heredado de este fichero y
   luego asevera
   `toHaveBeenCalledWith(apiUrl, { token: 'reset-token-r8', password: v, passwordConfirmation: v })`.
   **2 casos.**

**Heredado.** `une por salto de linea todos los mensajes de validacion` pasa de
`submitReset('short', 'different')` a `submitReset()`, con valores válidos,
porque desde R6 el cliente bloquearía el envío. Su aserción no cambia hasta
R7, y sigue en verde en el rojo y en el verde de R6.

**Rojo esperado** (`bunx jest src/screens/reset-password/index.test.tsx`):

| `it` | Casos | Tipo |
|---|---|---|
| 1 | 3 | consulta |
| 2 | 1 | consulta |
| 3 | 2 | **nacen verdes** (las guardan S2.8 y S2.9; en pantalla, S6.3) |

Total: **4** en rojo, todos de consulta, y 2 que nacen verdes.

**Sondas** (en el verde de R6, mutando `src/screens/reset-password/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S6.1 | se borra el `return` tras marcar los campos | 5: `it` 1 ×3, `it` 2 y el `it` de E1 (aserción) |
| S6.2 | se quita `isInvalid` del `TextField` de la confirmación | 2: `it` 1 fila 3 y `it` 2 (consulta) |
| S6.3 | se valida `{ password: password.trim(), passwordConfirmation }` | 1: `it` 3 fila `' '.repeat(8)` (aserción: no se llamó) |

**Anclas** (`src/screens/reset-password/index.tsx`):
`isInvalid={Boolean(fieldErrors.` → `2`; `<FieldError` → `2`;
`t(fieldErrors.` → `2`; `from '../../utils/account-rules'` → `1`. La base de
las cuatro es 0.

### R7 — Un 400 que llegue igual pinta un aviso genérico, nunca el texto del servidor

Implementa la opción A de P1, la recomendada. Si el humano elige B, se enmienda
R7 antes del handoff.

**EARS.**

- WHEN `login`, `register`, `forgotPassword` o `resetPassword` devuelven
  `kind: 'validation'`, THE SYSTEM SHALL pintar
  `Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.` / `Something
  in your details doesn't look right. Check them and try again.` en el error
  general de la pantalla: `login-error`, `register-error`, `forgot-error` o
  `reset-error`.
- THE SYSTEM SHALL NOT mostrar ningún `message` ni `path` del servidor, ni
  marcar ningún campo por un 400.

Register borra `mapValidationErrors`, `isRegisterField`, `registerFields`, el
import de `ApiFieldError` y el estado de transición `serverFieldErrors` de R4. Forgot cambia su caso
`validation` de `forgot.invalidEmail` al genérico.

**Candados** (rojo de R7):

1. Login: `shows every backend validation message` se reescribe como
   `#183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor`.
   Usa el mismo mock con dos errores. Asevera que `login-error` dice el
   genérico, que no contiene `Invalid email address` ni `Password is too
   short`, y que `queryAllByTestId(/^login-.+-message-row$/)` tiene longitud 0.
2. Register: `maps validation errors to fields and unknown paths to the general error`
   se reescribe como
   `#183 R7: un 400 de validación pinta el aviso genérico y ningún campo`.
   Usa el mismo mock de tres errores. Asevera que `register-error` dice el
   genérico, que no aparece ninguno de los tres textos del servidor, y que
   `queryAllByTestId(/^register-.+-message-row$/)` tiene longitud 0.
3. Register: `#172 R10: cada campo con error lleva icono y texto seleccionable`
   **conserva el título** y cambia el disparo. Ya no usa el mock de 400: hace
   el disparo del `it` 3 de R4 (formulario vacío, términos y confirmación
   `x`). Cada campo asevera el copy de cliente del `it` 3 de R4 en lugar de
   `${path} no vale`. El resto del `it` no cambia: fila, icono, seleccionable
   y las 7 filas.
4. Forgot: dentro de `#117 R7: cada kind distinto de ok pinta su copy en forgot-error`,
   la fila `validation` del primer `it.each` y la del `it.each` de reenvío
   pasan su copy a
   `Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.`. También
   cambia la tercera espera de
   `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`,
   con su `expectFormState`.
5. Reset: `une por salto de linea todos los mensajes de validacion` se
   reescribe como
   `#183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor`.
   Asevera `error.props.children` `toBe` el genérico.
6. `ui-copy-table.ts`:
   - en `R1_AUTH`, una fila
     `{ file: 'src/screens/<login|register|forgot>/index.tsx', key: 'validation.checkDetails' }, // #183 R7`
     por cada una de las tres pantallas;
   - en `R1_AUTH` se quita
     `{ file: 'src/screens/forgot/index.tsx', key: 'forgot.invalidEmail' }, // #117 R7`;
   - en `R11_RESET`, una fila
     `{ file: 'src/screens/reset-password/index.tsx', key: 'validation.checkDetails' }, // #183 R7`.

   En `ui-language.test.ts`, `R1_AUTH` gana `+ 3 - 1` y su título pasa a
   `<B_AUTH + 10>`; `R11_RESET` gana `+ 1` y su título pasa a `<B_RESET + 1>`.

**Rojo esperado** (`bunx jest src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/__tests__/ui-language.test.ts`):

| Fichero | `it` | Casos | Tipo |
|---|---|---|---|
| login | candado 1 | 1 | aserción (`toHaveTextContent`) |
| register | candado 2 | 1 | aserción (aparecen las filas de campo con el texto del servidor) |
| register | candado 3 | 1 | **nace verde** (el cliente valida desde R4). Si el verde no lo reescribiera, R7 lo rompería |
| forgot | fila `validation` de `mapea %p a «%s»…` | 1 | aserción |
| forgot | `un reintento desde el formulario…` | 1 | aserción (dentro de `waitFor`) |
| forgot | fila `validation` de `un %p al reenviar pinta «%s»…` | 1 | aserción |
| reset | candado 5 | 1 | aserción (`toBe`) |
| ui-language | `resuelve las <B_AUTH + 10> ocurrencias normativas` | 1 | aserción (`checkUses`: `validation.checkDetails` 0 ≠ 1) |
| ui-language | `resuelve las <B_RESET + 1> ocurrencias normativas` | 1 | aserción |
| ui-language | `resuelve cada ocurrencia de la tabla contra la clave exacta` | 1 | aserción |

Total: **9** en rojo, todos de aserción, y 1 que nace verde. `#172 R11:
cabecera, rejilla, términos, error y envío cuelgan del scroll` sigue en verde:
con el 400, `register-error-row` sigue existiendo.

**Sondas** (en el verde de R7):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S7.1 | login vuelve a `result.errors.map(({ message }) => message).join('\n')` | 3: candado 1, `resuelve las <B_AUTH + 10>…` y `resuelve cada ocurrencia…` (aserción) |
| S7.2 | el caso `validation` de register añade `setFieldErrors({ email: { labelKey: 'forgot.invalidEmail' } })` | 1: candado 2 (aserción) |
| S7.3 | forgot vuelve a `t('forgot.invalidEmail')` en `validation` | 6: las 3 de forgot, el `it` de forgot de E1, `resuelve las <B_AUTH + 10>…` y `resuelve cada ocurrencia…` (aserción) |
| S7.4 | reset vuelve a unir los mensajes crudos | 4: candado 5, el `it` de reset de E1, `resuelve las <B_RESET + 1>…` y `resuelve cada ocurrencia…` (aserción) |

**Anclas** (las de base 1 o 2 ya son anclas negativas; S7.1 hace que
`errors.map(` vuelva a 1 en login):

- `t('validation.checkDetails')` → `1` en las cuatro pantallas (base 0);
- `errors.map(` → `0` en login (base 1) y en reset-password (base 1);
- `mapValidationErrors` → `0` (base 2), `ApiFieldError` → `0` (base 2),
  `isRegisterField` → `0` y `serverFieldErrors` → `0` (en el verde de R4
  vale más de 0) en register;
- `t('forgot.invalidEmail')` → `0` en forgot (base 1).

### R8 — Prueba de humo humana en dev build de Android

**EARS.** WHEN el humano abre las cuatro pantallas en un **dev build de
Android** (no Expo Go), THE SYSTEM SHALL mostrar cada mensaje bajo su campo,
con icono, sin llamar al servidor, y nunca el texto del servidor.

Pasos:

1. **Iniciar sesión.** Pulsar «Entrar» con los dos campos vacíos: salen
   `Ingresa un correo electrónico válido` y `Escribe tu contraseña`. Con
   `alex@example.c` sale solo el del correo. Con
   `  <tu correo real>  ` (espacios alrededor) y la contraseña correcta, entra.
2. **Crear cuenta.** Con todo vacío, los términos aceptados y `x` en la
   confirmación, salen los siete mensajes de R4 a la vez. Con el país `M1` sale
   `Usa solo letras de la A a la Z`, y con el teléfono `123456` sale
   `Usa al menos 7 caracteres`. Los mensajes no tapan el botón con el teclado
   abierto.
3. **Recuperar.** Con `alex@example.c` sale el mensaje bajo el campo y no
   llega ningún correo.
4. **Nueva contraseña** (desde el enlace del correo). Con `1234567` en los dos
   campos sale `Usa al menos 8 caracteres`. Con dos contraseñas distintas sale
   `Las contraseñas no coinciden`.
5. **Idioma.** Con la app en inglés, se repite el paso 1 y salen
   `Enter a valid email address` y `Enter your password`.

El aviso genérico de R7 lo cubren los tests. Desde el cliente ya no se puede
provocar un 400, así que la prueba de humo no lo pide.

- [ ] Prueba de humo superada por humano (fecha: ____, dispositivo: ____)

## Deltas de candados

| Candado | Fichero | R1 | R2 | R4 | R7 | Final |
|---|---|---|---|---|---|---|
| Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx` | `+ 9` | | | | `B_KEYS + 9` |
| `R1_AUTH` (fórmula y título) | `src/__tests__/ui-language.test.ts` | | `+ 9` | `- 1` | `+ 3 - 1` | `B_AUTH + 10` |
| `R11_RESET` (fórmula y título) | `src/__tests__/ui-language.test.ts` | | | | `+ 1` | `B_RESET + 1` |
| `SCREEN_FILES` | `src/__tests__/ui-language.test.ts` | | `+ 1` | | | `B_FILES + 1` |
| Filas de `ui-copy-table.ts` | `src/__tests__/ui-copy-table.ts` | | +9 util | −1 register `forgot.invalidEmail` | +3 `checkDetails` en `R1_AUTH`, −1 forgot `forgot.invalidEmail`, +1 `checkDetails` en `R11_RESET` | |
| §2.N en el design de idioma | `specs/mobile-ui-language/design.md` | +1 sección, 9 filas | | | | |
| `#172 R10: los siete campos del registro marcan isInvalid` | `src/__tests__/account-screens-polish.test.ts` | | | 7 → 7 | | sin cambio |
| `#172 R20` (clases) | `src/__tests__/account-screens-polish.test.ts` | | | | | sin cambio |
| design-drift `#167 R14` | `src/__tests__/design-drift.test.ts` | | | | | sin cambio; el módulo no tiene estilos |

## Fuera de alcance

Cada viñeta es una delimitación de esta feature, no una feature pendiente.

- **Validación en vivo** (al escribir o al salir del campo). Los mensajes se
  evalúan al pulsar enviar, como en #172 R12, y se quedan hasta el siguiente
  envío. Ver P7.
- **El token del reset.** No lo escribe el usuario: llega del enlace. Si el
  servidor lo rechaza con un 400 (vacío o de más de 256 caracteres), cae en el
  aviso genérico de R7. Los casos `invalid-token` y `expired` no cambian.
- **`timezone` y `termsAccepted`.** La zona horaria la pone el dispositivo, y
  sin términos el envío ya está desactivado.
- **Recortar nombre, apellidos y teléfono antes de enviar.** El DTO ya los
  recorta con `.trim()`; solo `z.email()` no recorta, y por eso el correo sí
  se recorta en el cliente.
- **Cambiar los DTO** del backend o su texto de error.
- **Otras pantallas con formularios** (perfil, mascota, recordatorios). No se
  tocan.
- **Añadir zod al móvil.** Ver design.md §Alternativas descartadas.

## Preguntas abiertas

- **P1 — ¿Qué se hace con un 400 que llegue igual?**
  - **A (recomendada):** un aviso genérico en el error general,
    `Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.` Con la
    validación en cliente idéntica a los DTO, un 400 solo llega si el backend
    cambia sin que cambie el cliente, y ahí el texto del servidor no ayuda.
  - **B:** marcar por campo con un genérico (`Revisa este campo` / `Check
    this field`) según el `path`, y lo que no tenga campo al error general.
    Supone una clave más y conservar `mapValidationErrors`.
  - En ningún caso se muestra el texto del servidor.
- **P2 — Copy.** ¿Se aprueban las nueve claves de §Copy nuevo tal cual, en
  `es` y en `en`?
- **P3 — Teléfono.** El DTO cuenta caracteres, no dígitos: `+52 55 1234`
  cuenta los espacios y el `+`. ¿Vale `Usa al menos 7 caracteres`, o se
  prefiere `dígitos`, que no sería exacto?
- **P4 — País.** ¿Dos mensajes (longitud y solo letras A–Z) o uno solo, como
  `Escribe las 2 letras de tu país, como MX`, para las dos reglas?
- **P5 — Forgot.** El 400 de Recuperar deja de decir `Ingresa un correo
  electrónico válido` y pasa al genérico de R7. ¿De acuerdo?
- **P6 — Patrón de correo.** El de #172 R12 era más laxo que el servidor:
  `alex@example.c`, `ñu@example.com` o `a..b@example.com` llegaban a la API y
  volvía el 400. Con el literal de zod se bloquean en el cliente. Esto amplía
  #172 R12, cuyos `it` siguen verdes. ¿De acuerdo?
- **P7 — Mensajes persistentes.** El mensaje se queda hasta el siguiente envío
  y no se borra al escribir, igual que hoy en register. ¿Basta, o se quiere
  borrar el mensaje de un campo al editarlo, lo que sería un R más?
- **P8 — Punto final.** Los mensajes de campo van sin punto, como
  `forgot.invalidEmail`, y el aviso general con punto. El punto 7 de
  ui-guidelines pide punto en avisos. ¿Se mantiene la excepción de los
  mensajes de campo?

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-15) ← gate obligatorio antes de implementar

## Enmienda E1 (2026-10-15) — candados de la review ronda 1

La review ronda 1 (`progress/review_mobile-account-client-validation.md`,
`00ed2bc4`) rechazó #183. Producción cumple la spec y Codex no se desvió, pero
siete mutaciones de producción pasaban con todo en verde. El barrido
exhaustivo que siguió (`ae7a50df`, §Barrido exhaustivo previo a E1) encontró
ocho huecos más. Los quince son de la spec y no de Codex: ningún candado
prescrito miraba ahí.

| Hueco | Sonda | Mutación | Candado de E1 |
|---|---|---|---|
| H1 | RV8 | login: se borra el `setError(null);` de `submit` | `#183 R3: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API` |
| H2 | RV9 | register: se borra el `setGeneralError(null);` de `submit` | `#183 R4: un envío inválido tras un aviso general lo retira y no vuelve a llamar a la API` |
| H3 | RV10 | forgot: se borra el `setError(null);` de `submit` | `#183 R5: un correo inválido tras un aviso general lo retira, y el corregido quita el mensaje y vuelve a llamar` |
| H12 | C18 | forgot: se borra el `setFieldErrors({});` de `submit` | el mismo `it` que H3 |
| H4 | RV11 | reset: se borra el `setError(null);` de `submit` | `#183 R6: un envío inválido tras un aviso general lo retira, y el corregido quita el mensaje y vuelve a llamar` |
| H13 | C26 | reset: se borra el `setFieldErrors({});` de `submit` | el mismo `it` que H4 |
| H14 | C20 | forgot: el caso `validation` añade `setFieldErrors({ email: { labelKey: 'forgot.invalidEmail' } });` | `#183 R7: un 400 de validación en recuperar pinta el aviso genérico y ningún mensaje de campo` |
| H15 | C27 | reset: el caso `validation` añade `setFieldErrors({ passwordConfirmation: { labelKey: 'validation.passwordsDontMatch' } });` | `#183 R7: un 400 de validación en nueva contraseña no marca ningún campo` |
| H5 | RV5 | el `max 120` de los apellidos cuenta sin recortar | G8 |
| H6 | RV6 | el país se recorta antes de medir | G23 |
| H7 | RV7 | la confirmación se compara recortada | N6 |
| H8 | A6 | el mínimo del nombre pasa de 1 a 2 | `VALID.firstName` = `'A'` |
| H9 | A10 | el mínimo de los apellidos pasa de 1 a 2 | `VALID.lastName` = `'S'` |
| H10 | A26 | el `max 128` de la contraseña cuenta recortado | N5 |
| H11 | 14 mutantes del literal de correo | ver §Sondas de E1 | C16–C20 |

### Qué cambia

- **R2** (`src/utils/account-rules.test.ts`). Cambian `VALID`, G8, G23, N5 y
  N6, y se añaden las filas C16–C20. Ya están escritos en R2 con la marca
  «(E1)». El fichero pasa de 66 a **71** casos.
  - H11 toma la alternativa de comportamiento del barrido (+5 filas C) y no el
    candado sobre `EMAIL_PATTERN.source`. La tabla C ya es el contrato «decide
    como `z.email()`», y estas cinco filas matan los 14 mutantes.
    `z.email()` de zod 4.4.3 da los mismos cinco booleanos (medido).
  - Sondas de R2 re-medidas sobre el fichero de E1: S2.1 pasa de 8 a 9 rojos
    (C20) y S2.9 de 2 a 3 (N5). Las otras doce dan lo mismo que antes.
- **R3–R7: seis `it` nuevos.** No se meten candados en `it` heredados, como
  proponía el barrido. Así cada R-id tiene un `it` propio con título
  `#183 Rn` para la traceability, y los heredados (`#117 R7`, `R8:`) no
  cambian ni de título ni de cuerpo.
  - Los de R3–R6 van al final de su `describe('#183 Rn: …')`.
  - Los dos de R7 van dentro del `describe` heredado de su pantalla, como los
    demás `#183 R7`:
    - forgot, en `#117 R7: cada kind distinto de ok pinta su copy en forgot-error`,
      justo antes de `un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`;
    - reset, en `R8: el submit completa el reset y mapea los errores`, justo
      antes de `deshabilita el boton mientras la peticion esta en vuelo`.
  - Qué hace cada uno (el cuerpo exacto va en su parche, §Commits de E1):
    - **R3, login.** Con `invalid-credentials`, el primer envío pinta
      `Credenciales inválidas` en `login-error`. El reenvío con el correo vacío
      marca el campo, retira `login-error` y no vuelve a llamar
      (`toHaveBeenCalledTimes(1)`).
    - **R4, register.** Es lo mismo con `Ese correo ya está registrado` (el
      `email-taken` del `describe`) y el correo cambiado a `alex.example.com`.
    - **R5, forgot.** Con `error`, el primer envío pinta `Algo salió mal`.
      `alex.example.com` lo retira y marca el campo sin llamar. Luego
      `'  Ana@Example.com '` quita el mensaje del campo, vuelve a llamar con
      `{ email: 'Ana@Example.com' }` y pinta otra vez `Algo salió mal`.
    - **R6, reset.** Es lo mismo con `1234567` en los dos campos y después los
      valores válidos de `submitReset()`.
    - **R7, forgot.** Un 400 con un error en `email` pinta el genérico en
      `forgot-error` y ninguna fila `forgot-*-message-row`.
    - **R7, reset.** Un 400 con un error en `passwordConfirmation` pinta el
      genérico en `reset-error` y ninguna fila de campo.
  - Todos usan `await` en cada render, envío y espera (RNTL 14), y esperan un
    texto de la UI, no el contador del mock.
- **Sondas de R3–R7 que suben** con los `it` nuevos (ya corregidas en sus
  tablas): S3.2 de 8 a 9, S4.4 de 24 a 25, S5.1 y S5.3 de 5 a 6, S6.1 de 4 a 5,
  S7.3 de 5 a 6 y S7.4 de 3 a 4. Las demás dan lo mismo.

### Sondas de E1

Se corren en el verde del commit que trae el candado, mutando producción y
nada más. Cada una se revierte con `git checkout HEAD -- <fichero>`, y después
`git diff --quiet HEAD` y `git diff --cached --quiet` salen 0. Todos los rojos
son de aserción; ninguno es un timeout.

| Sonda | Fichero mutado | Rojos esperados (exactos) |
|---|---|---|
| RV5 | `src/utils/account-rules.ts` | 1: G8 |
| RV6 | `src/utils/account-rules.ts` | 1: G23 |
| RV7 | `src/utils/account-rules.ts` | 1: N6 |
| A6 | `src/utils/account-rules.ts` | 29: G1 y G6–G33 |
| A10 | `src/utils/account-rules.ts` | 29: G1–G5 y G10–G33 |
| A26 | `src/utils/account-rules.ts` | 1: N5 |
| RV8 | `src/screens/login/index.tsx` | 1: el `it` de R3 de E1 |
| RV9 | `src/screens/register/index.tsx` | 1: el `it` de R4 de E1 |
| RV10, C18 | `src/screens/forgot/index.tsx` | 1 cada una: el `it` de R5 de E1 |
| C20 | `src/screens/forgot/index.tsx` | 1: el `it` de R7 de forgot de E1 |
| RV11, C26 | `src/screens/reset-password/index.tsx` | 1 cada una: el `it` de R6 de E1 |
| C27 | `src/screens/reset-password/index.tsx` | 1: el `it` de R7 de reset de E1 |

Los 14 mutantes de `EMAIL_PATTERN` cambian una sola clase del literal. Cada uno
da **1** rojo en la tabla C:

| Mutante | Cambio | Rojo |
|---|---|---|
| loc-_, loc--, loc-., loc-09 | la parte local pierde `_`, `-`, `.` o `0-9` | C16 |
| loc-plus | la parte local pasa de `*` a `+` | C18 |
| last-_ | el último carácter local pierde `_` | C16 |
| last-+ | el último carácter local pierde `+` | C18 |
| last-- | el último carácter local pierde `-` | C19 |
| last-09 | el último carácter local pierde `0-9` | C17 |
| dom1-09 | el primer carácter del dominio pierde `0-9` | C17 |
| dom--, dom-09 | el resto del dominio pierde `-` o `0-9` | C16 |
| dom+_ | el resto del dominio admite `_` | C20 |
| tld6 | el TLD pasa de `{2,}` a `{2,6}` | C16 |

La bandera `i` es un mutante equivalente: las clases ya admiten las dos cajas.
Da 71 verdes y no lleva candado.

### Commits de E1

Los cinco son solo de tests y **nacen verdes**, porque producción ya cumple.
El rojo de cada candado lo demuestran sus sondas, como en #172 E6. Ninguno toca
producción, `catalog.ts`, `ui-copy-table.ts` ni las fórmulas de
`ui-language.test.ts`.

Cada commit aplica su parche desde `mobile-pet-tracker/`:
`git -C .. apply --check <p> && git -C .. apply <p>`. Después corre la suite,
las sondas de su fila, `bun run typecheck` y `bun run lint`. El leader los
midió todos fuera del árbol sobre `ae7a50df`: salen verdes, cada sonda da
exactamente sus rojos, y typecheck y eslint quedan limpios.

Las sondas de cada commit las corre
`progress/e1_mobile-account-client-validation/sondas_e1.py`, desde
`mobile-pet-tracker/`: `python3 ../progress/e1_mobile-account-client-validation/sondas_e1.py c16`
(o `c17` … `c20`). Para cada sonda, el script comprueba que el fichero de
producción esté igual que `HEAD`, aplica la mutación, corre la suite del
fichero, lo revierte con `git checkout HEAD --` y compara los títulos en rojo
con los que midió el leader. Sale 0 solo si todas dan exactamente sus rojos y
producción vuelve a `HEAD`; si no, imprime `MAL` con lo que falta y lo que
sobra, o `PARA` con el ancla que no casó.

| Commit | Parche (`progress/e1_mobile-account-client-validation/`) | sha256 | Suite | Sondas | Mensaje |
|---|---|---|---|---|---|
| c16 | `c16.patch` | `6498fa6e2d44d689318876128e496d6f2204529af7c81f5f62e1eb4da71582f1` | `src/utils/account-rules.test.ts`: 71 | RV5–RV7, A6, A10, A26, los 14 mutantes, S2.1 y S2.9 | `test(mobile): candados de E1 en account-rules (#183 R2)` |
| c17 | `c17.patch` | `125b001f3410c7c724472367d10adbe2bd5296d245261fc9f0cb627a584ce56a` | `src/screens/login/index.test.tsx`: 40 | RV8, S3.2 | `test(mobile): candado de E1 en login (#183 R3)` |
| c18 | `c18.patch` | `494bbd1bdd53e02afce1c639d935c092622e17f0783660e3f3306d8431742599` | `src/screens/register/index.test.tsx`: 65 | RV9, S4.4 | `test(mobile): candado de E1 en registro (#183 R4)` |
| c19 | `c19.patch` | `a1a10fb89095f17aff51a1272441be512b5dcdfd2a1373f750e10c8f116b2e76` | `src/screens/forgot/index.test.tsx`: 49 | RV10, C18, C20, S5.1, S5.3, S7.3 (solo forgot: 4) | `test(mobile): candados de E1 en recuperar (#183 R5, R7)` |
| c20 | `c20.patch` | `db1744205a53add247bbca49560bd95ad7fbff7ff1573d4304a91b230be1efb0` | `src/screens/reset-password/index.test.tsx`: 49 | RV11, C26, C27, S6.1, S7.4 (solo reset: 2) | `test(mobile): candados de E1 en nueva contraseña (#183 R6, R7)` |

### Cifras

- account-rules pasa de 66 a 71, login de 39 a 40, register de 64 a 65, forgot
  de 47 a 49 y reset de 47 a 49.
- Las suites de la feature pasan de 330 a **341** tests.
- La suite móvil completa pasa de 3506 a **3517** (+11), con las mismas 111
  suites.
- Las cuatro pantallas dan 203 passed. Las guardas (`account-screens-polish`,
  `design-drift`, `legibility-classnames`, `language-provider`, `ui-language`)
  más `account-rules` dan 252 passed: 247 antes de E1, más las 5 filas C.

Nada más cambia: ni los EARS, ni producción, ni el copy, ni los deltas de
candados de §Deltas de candados. La traceability y el informe de Codex suman
las filas de c16–c20 al cerrar.

- [ ] Enmienda E1 aprobada por humano (fecha: ____) ← gate antes de reanudar Codex
