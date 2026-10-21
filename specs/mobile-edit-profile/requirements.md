---
feature: "mobile-edit-profile"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-edit-profile]] (#194)

> Desde Perfil, el usuario abre una pantalla donde corrige su nombre, apellidos,
> teléfono y país. Cada campo inválido muestra su mensaje debajo al pulsar
> Guardar, el cambio viaja al backend por `PATCH /v1/me`, la tarjeta de cuenta
> de Perfil se actualiza sin recargar y la pantalla se cierra. Hoy `Perfil`
> solo muestra datos y `src/api/users.ts` solo sabe leer (`getMe`).

Petición del humano (2026-10-19), al aprobar #186: «agrega editar perfil en una
nueva feature».

## Base medida

Base congelada al escribir: `c0a35a68` (`origin/main`, merge de #191). Todo lo
que otra feature pueda mover se escribe «base medida en H0 + delta»: H0 es el
commit del handoff y el handoff vuelve a medir con el mismo comando. Si en H0
una medida no coincide con la de aquí, vale la de H0 y el delta no cambia.
Los comandos se corren desde `mobile-pet-tracker/` salvo que se diga otra cosa.

| Id | Qué | Comando | En `c0a35a68` |
|---|---|---|---|
| B1 | Claves de `en` | `bun -e "import {en} from './src/i18n/catalog.ts'; console.log(Object.keys(en).length)"` | 436 (la fórmula de longitud del catálogo en `src/providers/__tests__/language-provider.test.tsx` acaba en `+ 3 - 1, // #191 R1`) |
| B2 | Última sección del registro de idioma | `grep -n '^### §2\.' ../specs/mobile-ui-language/design.md \| tail -1` | `### §2.37 — Añadidos por #191 — Nueva mascota en dos pasos`. Esta feature toma **§2.38** (regla: la última en H0 + 1) |
| B3 | Las dos claves nuevas no existen | `for k in profile.editProfile editProfile.save; do grep -cF "'$k'" src/i18n/catalog.ts; done` | `0 0` |
| B4 | Los ficheros nuevos no existen | `test ! -e src/app/edit-profile.tsx && test ! -d src/screens/edit-profile` | sale 0 |
| B5 | Hijos del grupo protegido de `RootStack` | leer cada `expect(children).toHaveLength(` de `src/app/__tests__/layout.test.tsx` cuyo `children` es `Children.toArray(protectedGroup.props.children)` | cuatro aserciones que suman 13 (`8 + 1 + 1 + 1 + 1 + 1`, `9 + 1 + 1 + 1 + 1`, `10 + 1 + 1 + 1`, `11 + 1 + 1`); la última pantalla del grupo es `meals-history` |
| B6 | Última fila de `ALL_USES` | `grep -n 'R16_WELCOME' src/__tests__/ui-copy-table.ts` | `R16_WELCOME` es el último bloque; esta feature crea `R17_EDIT_PROFILE` |
| B7 | Cola de la fórmula de `SCREEN_FILES` | `grep -n 'SCREEN_FILES).toHaveLength' -A14 src/__tests__/ui-language.test.ts` | la última línea de la fórmula es `+ 1 // #190 R13 ...` |
| B8 | Mapa `screenSignOutCalls` | `grep -n 'screenSignOutCalls: Record' -A20 src/__tests__/design-drift.test.ts` | 17 entradas; `'screens/profile/index.tsx': 2` |
| B9 | `me-card` de Perfil, caso `ok` | `grep -n "name: 'ok', state: account" src/screens/profile/index.test.tsx` | `children: ['me-identity', 'theme-row', 'language-toggle']` |
| B10 | Reglas de perfil dentro de `validateRegister` | `grep -n 'firstName.trim()\|phone.trim()\|country.length' src/utils/account-rules.ts` | tres bloques `if / else if` dentro de `validateRegister` |
| B11 | Letra A de la última enmienda de excepción de layout | `grep -rhoE 'enmienda A[0-9]+ de #[0-9]+' ../docs \| sort -V \| tail -1` | `enmienda A21 de #152`. Esta feature toma **A22** (la última en H0 + 1) |

### Premisas del registro de #194 verificadas contra el árbol

- «Solo muestra datos y no existe pantalla de edición»: cierto
  (`src/screens/profile/index.tsx`, `me-card`; no hay `edit-profile` en `src/`
  ni en `docs/`).
- «`PATCH /v1/me` con `UpdateProfileSchema`»: cierto
  (`backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts`,
  `@Patch()`, 200 con `ProfileResponse`; Zod inválido es 400 con
  `{ statusCode, message: 'Validation failed', errors: [{ path, message }] }`;
  usuario inexistente es 404; body vacío es no-op sin auditoría).
- «`country` del catálogo»: **falso**. `CountrySchema`
  (`backend-pet-tracker/src/modules/auth/application/dto/country.schema.ts`) es
  `z.string().length(2).regex(/^[A-Z]{2}$/)`: dos letras mayúsculas, sin
  catálogo. Es la misma regla que ya aplica `validateRegister`.
- «Reusar `account-rules.ts` para nombre, teléfono y país»: encaja, pero esas
  reglas viven **dentro** de `validateRegister` (B10), mezcladas con las de
  correo y contraseña; R2 las extrae.
- «`email` no está en el DTO»: cierto. El correo **no se puede editar**: cambiarlo
  exigiría un flujo de verificación que no existe.
- `timezone` tiene consumidores reales (`weight-log` calcula «hoy» con
  `me.timezone`), y el registro la fija desde el dispositivo
  (`deviceTimezone()` en `src/screens/register/index.tsx`). Ver P1.

## Decisiones cerradas por esta spec

Cada una trae su razón; las que tienen consecuencia de producto repiten en
§Preguntas para el gate con el valor por defecto marcado.

| Id | Decisión | Dónde se prueba |
|---|---|---|
| D1 | Campos editables: `firstName`, `lastName`, `phone`, `country`. El correo no se muestra ni se edita. | R5 |
| D2 | `timezone` queda **automática**: no hay campo y `updateMe` no la envía. | R5, R7 |
| D3 | Se envían **solo los campos que cambiaron** (comparados ya recortados con `trim`), no los cuatro. | R7 |
| D4 | Sin cambios: no hay petición; la pantalla se cierra con `router.back()`. | R7 |
| D5 | Éxito: el resultado del `PATCH` se escribe en `userKeys.me()` con `setQueryData` y se cierra con `router.back()`. Sin aviso de éxito. | R7 |
| D6 | 401: `signOut()` sin mensaje. 400: `validation.checkDetails`. Red caída: `common.cannotReachServer`. Cualquier otro caso, config ausente o excepción: `common.somethingWentWrong`. Nunca texto crudo del servidor. | R8 |
| D7 | Destino: la pantalla se empuja sobre el Stack raíz (ruta `/edit-profile`, cabecera nativa, regla A11) y se llega desde una fila de `me-card`. | R4, R9 |
| D8 | Validación **al pulsar Guardar**, con reglas puras de `src/utils/account-rules.ts`; se pintan todos los campos fallidos a la vez. | R2, R6 |

## Copy nuevo

Dos claves en `src/i18n/catalog.ts`, en los dos idiomas, sin punto final. Las
claves existentes que la pantalla reutiliza **no cambian de valor**:
`register.firstName` (`First name` / `Nombres`), `register.lastName`
(`Last name` / `Apellidos`), `register.phone` (`Phone` / `Teléfono`),
`register.country` (`Country` / `País`), `profile.accountUnavailable`
(`Account unavailable` / `Cuenta no disponible`), `validation.checkDetails`,
`common.cannotReachServer`, `common.somethingWentWrong`.

| Clave | `en` | `es` |
|---|---|---|
| `profile.editProfile` | `Edit profile` | `Editar perfil` |
| `editProfile.save` | `Save changes` | `Guardar cambios` |

`profile.editProfile` es la etiqueta de la fila de Perfil y también el título
del contenido de la pantalla (una clave, dos sitios, un `t(` por fichero).

## testIDs de esta feature

| testID | Qué es |
|---|---|
| `edit-profile-link` | fila de `me-card` que abre la pantalla (R9) |
| `edit-profile-keyboard-avoider` | `KeyboardAvoidingView` raíz |
| `screen-edit-profile` | `ScrollView` |
| `edit-profile-title` | `Text` del título |
| `edit-profile-skeleton` | `Skeleton` mientras `getMe` no ha respondido |
| `edit-profile-state` | `Text` cuando el perfil no está disponible |
| `edit-profile-form` | `View` que agrupa campos, error y botón |
| `edit-profile-first-name`, `edit-profile-last-name`, `edit-profile-phone`, `edit-profile-country` | los cuatro `Input`; son también la base de `FieldErrorMessage` (`<base>-error`, `<base>-message`, `<base>-message-row`) |
| `edit-profile-error` | `FormError` de servidor o red (su fila es `edit-profile-error-row`) |
| `edit-profile-save` | botón primario |

Verificado contra el árbol: ningún `testID` ni selector por regex existente
captura `edit-profile-*`.

## Convenciones de esta spec

- **Nombres.** Todo `it` nuevo o reescrito empieza por `#194 Rn:`. Todo
  comentario de código que cite esta feature se escribe `#194 Rn`: un `#194`
  suelto casa con `HEX_LITERAL` en `design-drift.test.ts`.
- **RNTL 14.** `await` en todo `render`, `fireEvent.*` y `act`; para estado
  asíncrono, `waitFor` o `findBy*` sobre el árbol (`docs/conventions.md`
  §Esperas sobre el árbol renderizado). Se espera primero a que aparezca el
  efecto y solo después se aseveran ausencias y contadores de mock.
- **Literales de copy.** El copy esperado se escribe literal en los tests; nunca
  se importa de `catalog.ts`. Las tablas de reglas escriben a mano
  `{ labelKey: 'validation.tooShort', params: { min: 7 } }`.
- **Un `t(` por clave en cada fichero.** La pantalla y la fila de Perfil llaman
  `t('<clave>')` **una sola vez por clave** (el candado de `ui-copy-table.ts`
  cuenta ocurrencias exactas).
- **Sin clases nuevas.** Solo se usan clases que la carta y los candados ya
  admiten, listadas en §Clases. Nada de hex, `[...]`, `StyleSheet.create`,
  `text-accent`, `text-accent-strong` ni `text-warning` sueltos.
- **Tamaños de letra** (`text-13`, `text-17`) solo sobre `Text` plano de
  `react-native`, nunca sobre `Label`, `Button` ni `Card` de HeroUI (enmienda
  #187).
- **Mocks de la pantalla.** `src/screens/edit-profile/index.test.tsx` sigue la
  preparación de `src/screens/docs-upload-form/index.test.tsx` (providers
  `HeroUINativeProvider`, `LanguageProvider`, `QueryClientProvider` con
  `createQueryClient`, `useAuth` mockeado con `{ token: 'jwt-token', signOut }`,
  `jest.mock('../../api/users')`). Se prescribe la intención, no el literal de
  los mocks: el handoff lo verifica contra ese fichero.
- **Sondas.** Mutan solo producción, se corren en el commit verde de su R y se
  revierten con `git checkout HEAD -- <ruta>`; después `git diff --quiet HEAD --
  <ruta>` y `git diff --cached --quiet` salen 0.
- **Commits.** Por cada R, primero el rojo, `test(mobile): <qué> (#194 Rn)`, y
  en un commit aparte el verde, `feat(mobile): <qué> (#194 Rn)`. R10 trae la
  enmienda de la carta: `docs(ui): enmienda #194 (#194 R10)`.

### Clases que usa la feature (verificadas contra los candados)

| Dónde | Clases | Receta de origen |
|---|---|---|
| raíz `edit-profile-keyboard-avoider` | `flex-1` | `docs-upload-form` |
| `screen-edit-profile` | `flex-1 bg-background` | `docs-upload-form` |
| `edit-profile-title` | `text-3xl font-black text-foreground` | `register` |
| `edit-profile-form` | `gap-4` | `docs-upload-form` |
| etiqueta de campo | `<Label><Text className="text-13 font-semibold text-muted">` | `register`, #187 |
| `Input` | `h-13 rounded-xl bg-default` | `register` |
| `edit-profile-state` | `font-normal text-muted` | `me-card-state` de Perfil |
| `edit-profile-skeleton` | `h-13 w-full rounded-xl` | `me-card-skeleton` de Perfil |
| `edit-profile-save` | `w-full h-14 rounded-16 bg-accent` con `style={chunkyLip.primary}`; etiqueta `<Text className="text-17 font-extrabold text-accent-foreground">` | `register-submit` (#177) |
| `edit-profile-link` (Perfil) | `flex-row items-center justify-between gap-4 border-t border-separator py-2.5`; etiqueta `text-sm font-semibold text-foreground` | `language-toggle` de Perfil |

Ninguna lleva `text-accent-strong`, así que el recuento `inkSites` de
`legibility-classnames.test.ts` no cambia; ningún radio nuevo entra fuera de
`xl`, `16` y `full`.

## Requisitos funcionales

### R1 — El catálogo trae el copy de edición en los dos idiomas

**EARS.** THE SYSTEM SHALL declarar en `src/i18n/catalog.ts` las dos claves de
§Copy nuevo con sus valores `en` y `es` literales, y registrarlas en
`specs/mobile-ui-language/design.md` en una sección nueva
`### §2.N — Añadidos por #194 — Editar perfil` (N = la última en H0 + 1, B2). Cada fila
sigue `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #194 (R1) |`.

**Candados** (`src/providers/__tests__/language-provider.test.tsx`):

1. La fórmula de longitud del catálogo (el `it` `mantiene la base más las claves
   de #68 y los mismos marcadores en ambos idiomas`) gana una línea
   `+ 2, // #194 R1` (la coma pasa de la línea de #191 a la nueva). Total
   esperado: `B1 + 2`.
2. Un `it('#194 R1: declara las claves de edición de perfil en los dos idiomas y su registro')`
   calcado del de #186 R1: dos tuplas `[clave, en, es]` con los literales de
   §Copy nuevo, `toBe` sobre `english[key]` y `spanish[key]`, y que el design de
   idioma case con `'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #194 \\(R1\\)'`
   más la cabecera `/### §2\.\d+ — Añadidos por #194 — Editar perfil/`.

**Rojo esperado** (`bunx jest src/providers/__tests__/language-provider.test.tsx`):
2 `it` en rojo, ambos por aserción (longitud; `undefined` frente al literal).

**Verde.** Las dos claves en `en` y `es` y la sección §2.N. `ui-language.test.ts`
sigue verde porque ningún valor nuevo aparece aún como literal en pantallas.

**Sondas** (mutando `src/i18n/catalog.ts`):

| Sonda | Mutación | Rojos |
|---|---|---|
| S1.1 | `es['editProfile.save']` pasa a `Guardar` | 1 (tabla) |
| S1.2 | borrar `profile.editProfile` de `en` y `es` | 2 (longitud y tabla) |

**Anclas:** `grep -cF "'editProfile.save'" src/i18n/catalog.ts` → `2`;
`grep -cF "'profile.editProfile'" src/i18n/catalog.ts` → `2`;
`grep -cF 'por #194 (R1)' ../specs/mobile-ui-language/design.md` → `2`.

### R2 — Las reglas de nombre, teléfono y país se extraen a `validateProfile`

**EARS.** THE SYSTEM SHALL exportar de `src/utils/account-rules.ts`
`type ProfileValues = { firstName: string; lastName: string; phone: string; country: string }`
y `function validateProfile(values: ProfileValues): FieldIssues<keyof ProfileValues>`
con exactamente las reglas del DTO de backend; AND WHEN `validateRegister`
valida, THE SYSTEM SHALL obtener las issues de esos cuatro campos llamando a
`validateProfile`, sin duplicar las comparaciones.

Reglas (idénticas a las que hoy tiene `validateRegister`, B10; en cada campo
se devuelve **la primera** que falla):

| Campo | Regla | Issue |
|---|---|---|
| `firstName` | `trim()` vacío | `{ labelKey: 'validation.firstNameRequired' }` |
| `firstName` | `trim()` de más de 120 | `{ labelKey: 'validation.tooLong', params: { max: 120 } }` |
| `lastName` | `trim()` vacío | `{ labelKey: 'validation.lastNameRequired' }` |
| `lastName` | `trim()` de más de 120 | `{ labelKey: 'validation.tooLong', params: { max: 120 } }` |
| `phone` | `trim()` de menos de 7 | `{ labelKey: 'validation.tooShort', params: { min: 7 } }` |
| `phone` | `trim()` de más de 20 | `{ labelKey: 'validation.tooLong', params: { max: 20 } }` |
| `country` | `length !== 2` (sin recortar) | `{ labelKey: 'validation.countryLength' }` |
| `country` | longitud 2 y no casa `/^[A-Z]{2}$/` | `{ labelKey: 'validation.countryLetters' }` |

No se añaden claves de catálogo ni se tocan `RuleIssue`, `FieldIssues` ni las
constantes privadas existentes.

**Candados** (`src/utils/account-rules.test.ts`, `describe('#194 R2: validateProfile ...')`):

- `it.each` con estos casos, expectativas escritas a mano (`toEqual`):
  1. cuatro valores válidos (`'Ada'`, `'Lovelace'`, `'+525500000000'`, `'MX'`) devuelve `{}`;
  2. `firstName` `'   '` devuelve solo `firstName: required`; `lastName` `''` solo `lastName: required`;
  3. `firstName` de 120 caracteres devuelve `{}`; de 121 devuelve `tooLong` con `max: 120` (igual en `lastName`);
  4. `phone` `' 123456 '` (6 tras recortar) devuelve `tooShort` con `min: 7`; `'1234567'` devuelve `{}`; 20 caracteres devuelve `{}`; 21 devuelve `tooLong` con `max: 20`;
  5. `country` `''` y `'M'` devuelven `countryLength`; `'mx'` y `'M1'` devuelven `countryLetters`; `'MEX'` devuelve `countryLength`;
  6. cuatro campos inválidos a la vez devuelve las cuatro issues (no para en la primera).
- `it('#194 R2: validateRegister conserva las issues de perfil')`: con un
  `RegisterValues` válido salvo los cuatro campos del caso 6, `validateRegister`
  devuelve esas mismas cuatro issues escritas a mano.
- Los `it` existentes de `#183 R2` siguen verdes sin tocarse (son la red de
  seguridad de la extracción).

**Rojo esperado** (`bunx jest src/utils/account-rules.test.ts`): `validateProfile`
no existe, así que los `it` del `it.each` fallan con
`TypeError: (0 , account_rules_1.validateProfile) is not a function` (o equivalente
del transformador). El `it` `validateRegister conserva` **nace verde** (la
función actual ya devuelve esas issues): se anota como tal y lo cubre la sonda S2.3.
El handoff cuenta los rojos reales y los anota.

**Sondas** (mutando `src/utils/account-rules.ts`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S2.1 | `> 120` de `firstName` pasa a `> 121` | 1 (caso 3) |
| S2.2 | `validateProfile` deja de recortar `phone` | 1 (caso 4) |
| S2.3 | `validateRegister` vuelve a una copia inline y esta cambia `< 7` por `< 6` | 1 (`validateRegister conserva`) |

### R3 — `updateMe` envía el PATCH y traduce la respuesta a un resultado por `kind`

**EARS.** WHEN se llama a `updateMe(baseUrl, token, changes, fetchFn?)`, THE
SYSTEM SHALL enviar `PATCH {baseUrl}/me` (vía `patchJson` de `src/api/http.ts`)
con `Authorization: Bearer <token>`, `Content-Type: application/json` y como
cuerpo el JSON de `changes`, y devolver un `UpdateMeState`.

Símbolos exactos, en `src/api/users.ts`:

```
export type UpdateProfileInput = Partial<Pick<ProfileResponse, 'firstName' | 'lastName' | 'phone' | 'country'>>;
export type UpdateMeState =
  | { kind: 'ok'; me: ProfileResponse }
  | { kind: 'unauthorized' }
  | { kind: 'validation' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };
export async function updateMe(baseUrl: string | undefined, token: string, changes: UpdateProfileInput, fetchFn: typeof fetch = fetch): Promise<UpdateMeState>
```

| Situación | Resultado |
|---|---|
| `baseUrl` indefinido o vacío | `{ kind: 'missing-config' }`, **sin** llamar a `fetchFn` |
| `fetchFn` lanza | `{ kind: 'unreachable', message }` (como `getMe`) |
| 200 y el cuerpo pasa `isProfileResponse` | `{ kind: 'ok', me: <cuerpo> }` |
| 200 y el cuerpo no pasa `isProfileResponse` (o JSON inválido) | `{ kind: 'error' }` |
| 401 | `{ kind: 'unauthorized' }` |
| 400 | `{ kind: 'validation' }` (el cuerpo del servidor **no** se devuelve) |
| cualquier otro estado (403, 404, 429, 5xx) | `{ kind: 'error' }` |

`updateMe` no envía `timezone` ni `email`: el tipo `UpdateProfileInput` no los
admite (D2).

**Candados** (`src/api/__tests__/users.test.ts`, `describe('#194 R3: updateMe ...')`,
con el helper `response(status, body)` y `baseUrl`/`endpoint` del fichero):

1. el `fetchFn` recibe `http://example.test/v1/me` y un init con `method: 'PATCH'`,
   las dos cabeceras y `body: JSON.stringify({ firstName: 'Grace' })` para
   `changes = { firstName: 'Grace' }` (aserción `toHaveBeenCalledWith` con el init completo);
2. 200 con un perfil completo devuelve `{ kind: 'ok', me }`;
3. 200 con un cuerpo al que le falta `timezone` devuelve `{ kind: 'error' }`; 200 con JSON inválido (`invalidJsonResponse(200)`) devuelve `{ kind: 'error' }`;
4. 401 → `unauthorized`; 400 con `{ message: 'Validation failed' }` → `{ kind: 'validation' }` exactamente (`toEqual`, sin otras claves);
5. 404, 403 y 500 → `{ kind: 'error' }`;
6. `fetchFn` rechazado con `new Error('offline')` → `{ kind: 'unreachable', message: 'offline' }`;
7. `baseUrl` `undefined` → `missing-config` y `fetchFn` no llamado.

Los `it` existentes de `getMe` siguen verdes.

**Rojo esperado:** `updateMe` no existe: los siete `it` fallan (`TypeError: updateMe is not a function`).

**Sondas** (mutando `src/api/users.ts`): S3.1 `method` pasa a `PUT` (rojo: 1, caso 1);
S3.2 el 400 devuelve `{ kind: 'error' }` (1, caso 4); S3.3 se quita la comprobación
de `isProfileResponse` (1, caso 3).

### R4 — Existe la ruta `/edit-profile`, protegida y con cabecera nativa

**EARS.** THE SYSTEM SHALL exponer la pantalla en `src/app/edit-profile.tsx`
(route delgado: menos de 10 líneas, `export default function EditProfileRoute()`
que devuelve `<EditProfileScreen />` importado de `'../screens/edit-profile'`),
y registrarla en `src/app/_layout.tsx` **al final** del `Stack.Protected`
(`guard={status === 'authenticated'}`), tras `meals-history`:
`<Stack.Screen name="edit-profile" options={{ ...headerOptions, title: '' }} />`.
IF no hay sesión, THEN `/edit-profile` no se monta (redirige a `/welcome`).

**Fichero mínimo que R4 crea para compilar:** `src/screens/edit-profile/index.tsx`
con `export function EditProfileScreen() { return null; }`; R5 lo reemplaza.

**Candados:**

- `src/app/__tests__/detail-stack.test.tsx`: nuevo
  `describe('#194 R4: edit-profile vive en la raíz de src/app')` con
  `existsSync(join(app, 'edit-profile.tsx'))` y que su fuente contenga
  `from '../screens/edit-profile'`, y que `edit-profile.tsx` tenga menos de 10 líneas.
- `src/app/__tests__/layout.test.tsx`:
  - las **cuatro** aserciones `toHaveLength` del grupo protegido (B5) ganan
    `+ 1 // #194 R4` (13 pasan a 14);
  - nuevo `it('#194 R4: edit-profile es la última pantalla protegida')` que toma
    `Children.toArray(group.props.children).at(-1)` y asevera `type === Stack.Screen`,
    `props.name === 'edit-profile'`;
  - la tabla `it.each` de `#95 R4` gana la fila `['edit-profile', '']` (`// #194 R4`),
    que asevera las opciones de cabecera acordadas con `title: ''`.
- `src/app/__tests__/detail-stack.guard.test.tsx`: `'/edit-profile'` (`// #194 R4`)
  se añade a las dos listas de rutas protegidas (la del cierre de sesión y la
  de visitante sin sesión).
- `src/app/__tests__/detail-stack.navigation.test.tsx`: `['/edit-profile', 'edit-profile']`
  (`// #194 R4`) se añade a la lista de `#95 R2` (push apila, back desapila).

**Rojo esperado:** `detail-stack.test.tsx` (1 `it`, fichero ausente), `layout.test.tsx`
(4 longitudes + la última pantalla + la fila de cabecera = 6), guard (las listas
dejan la ruta sin existir: el `it` afectado falla) y navigation (el push a una
ruta inexistente no apila). El handoff cuenta los rojos reales y los anota.

**Sondas** (mutando `src/app/_layout.tsx`): S4.1 mover `edit-profile` fuera del
`Stack.Protected` (rojo: layout y guard); S4.2 `title: 'x'` (rojo: la fila de cabecera).

### R5 — La pantalla pinta el formulario con el perfil actual

**EARS.** THE SYSTEM SHALL implementar `export function EditProfileScreen()` en
`src/screens/edit-profile/index.tsx` que lee el perfil con
`useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') })`
(`baseUrl = process.env.EXPO_PUBLIC_API_URL`, `token` de `useAuth()`; **la misma
clave y el mismo `queryFn` que Perfil**, así que desde Perfil el dato ya está en
caché) y pinta, dentro de `KeyboardAvoidingView` (`behavior="padding"`,
`keyboardVerticalOffset={headerHeight}` con `HeaderHeightContext` de
`'expo-router/react-navigation'`) y `ScrollView`, de arriba abajo:

1. `Text` `edit-profile-title` con `t('profile.editProfile')`, siempre;
2. según el estado de la consulta:
   - `data === undefined` (cargando): `Skeleton` `edit-profile-skeleton`;
   - `data.kind !== 'ok'` (error, unauthorized, unreachable, missing-config):
     `Text` `edit-profile-state` con `t('profile.accountUnavailable')`;
   - `data.kind === 'ok'`: el formulario `View` `edit-profile-form`.

El formulario es un componente interno `EditProfileForm({ me }: { me: ProfileResponse })`
que **inicializa** sus cuatro estados con `useState(me.firstName)`, `me.lastName`,
`me.phone` y `me.country` (sin `useEffect`), de modo que un refresco posterior de
la caché no pisa lo que el usuario escribe. Cada campo es un `TextField` de
`heroui-native` con `isInvalid={Boolean(fieldErrors.<campo>)}`, una
`<Label><Text className="text-13 font-semibold text-muted">{t(...)}</Text></Label>`,
un `Input` y un `FieldErrorMessage`:

| Orden | Campo | testID | Etiqueta | Propiedades extra del `Input` |
|---|---|---|---|---|
| 1 | nombres | `edit-profile-first-name` | `register.firstName` | ninguna |
| 2 | apellidos | `edit-profile-last-name` | `register.lastName` | ninguna |
| 3 | teléfono | `edit-profile-phone` | `register.phone` | `keyboardType="phone-pad"` |
| 4 | país | `edit-profile-country` | `register.country` | `autoCapitalize="characters"`, `maxLength={2}`, `onChangeText={(value) => setCountry(value.toUpperCase())}` |

No hay campo de correo ni de zona horaria (D1, D2). Layout de pantalla empujada
bajo cabecera nativa (A11): `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`,
`contentInsetAdjustmentBehavior="automatic"`, `keyboardShouldPersistTaps="handled"`;
sin `paddingTop: insets.top + 12` ni `paddingBottom: insets.bottom + 96`.

**Candados** (`src/screens/edit-profile/index.test.tsx`, `describe('#194 R5: ...')`,
con la caché sembrada con `{ kind: 'ok', me }` donde `me = { id: 'user-1', email: 'ada@example.test', firstName: 'Ada', lastName: 'Lovelace', phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City', createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z' }`):

1. con la caché sembrada, `edit-profile-first-name`, `-last-name`, `-phone` y `-country` tienen `props.value` `'Ada'`, `'Lovelace'`, `'+525500000000'`, `'MX'`; el título muestra `Edit profile`; las etiquetas muestran `First name`, `Last name`, `Phone`, `Country`;
2. el orden de los hijos de `edit-profile-form` es nombres, apellidos, teléfono, país (comparar los `testID` de los cuatro controles en orden de aparición con `toJSON()` o `within(...)`), y `queryByTestId('edit-profile-email')` y `queryByDisplayValue('ada@example.test')` y `queryByDisplayValue('America/Mexico_City')` son `null`;
3. `edit-profile-country` tiene `maxLength` 2 y `autoCapitalize` `'characters'`; escribir `'mx'` deja `'MX'`; `edit-profile-phone` tiene `keyboardType` `'phone-pad'`;
4. sin datos (`getMe` pendiente), aparece `edit-profile-skeleton` y no `edit-profile-form`; con `getMe` resuelto en `{ kind: 'error' }`, aparece `edit-profile-state` con `Account unavailable` y no el formulario; con `{ kind: 'unauthorized' }` también;
5. el `ScrollView` `screen-edit-profile` tiene `contentContainerStyle` igual a `{ padding: 24, gap: 16, paddingBottom: <insets.bottom + 24> }` (con insets mockeados a un valor distinto de cero) y no contiene `paddingTop`;
6. editar un campo y re-sembrar la caché con otro perfil **no** cambia el valor escrito (el estado se inicializa una vez).

**Rojo esperado:** el stub de R4 devuelve `null`, así que los seis `it` fallan por
`getByTestId` (consulta por consulta: el handoff lo anota).

**Candados de inventario que se mueven en R5** (se editan en el commit rojo de R5):

- `src/__tests__/ui-copy-table.ts`: nuevo bloque `export const R17_EDIT_PROFILE: UseRow[]`
  con seis filas `{ file: 'src/screens/edit-profile/index.tsx', key }`:
  `register.firstName`, `register.lastName`, `register.phone`, `register.country`,
  `profile.editProfile` y `profile.accountUnavailable`; se añade `...R17_EDIT_PROFILE`
  a `ALL_USES` y `R17_EDIT_PROFILE` al array `blocks` del `it('cuadra ALL_USES ...')`.
- `src/__tests__/ui-language.test.ts`: `import` de `R17_EDIT_PROFILE`; nuevo
  `describe('#194 R5: la pantalla de edición resuelve su copy por clave')` con
  `expect(R17_EDIT_PROFILE).toHaveLength(6)` y `checkUses(R17_EDIT_PROFILE)`;
  la fórmula de `SCREEN_FILES` gana `+ 1 // #194 R5: screens/edit-profile/index.tsx`.
  Cada R posterior que añade filas reescribe esa aserción como suma con un término
  por R (`6 + 1`, `6 + 1 + 3`, `6 + 1 + 3 + 1`).
- **Nota de orden.** `checkUses` exige el número exacto de `t('clave'` por fila, así
  que cada fila se registra en el R en que su `t(` entra en el fichero: R5 las 6 de
  arriba, R6 `editProfile.save` (+1), R8 `validation.checkDetails`,
  `common.cannotReachServer` y `common.somethingWentWrong` (+3) y R9 la fila de Perfil
  (+1, archivo distinto). Total final: 11 filas.
- `src/__tests__/design-drift.test.ts`: `screenSignOutCalls` gana
  `'screens/edit-profile/index.tsx': 0, // #194 R5` (R8 lo sube a 1). Ese mapa
  también prohíbe `queryKey: [` literal en el fichero.
- `src/__tests__/edit-profile.test.ts` (**fichero nuevo**, `describe('#194 R5: ...')`):
  grep-clean de `screens/edit-profile/index.tsx` y `app/edit-profile.tsx`:
  ninguno casa `/#(?!\d{2,3} R\d)[\da-f]{3,8}\b|StyleSheet|[A-Za-z0-9_-]+-\[[^\]]+\]/i`;
  ningún `rounded-` fuera de `card|xl|full|24|16`; ningún `/text-accent(?![-\w])/`;
  la pantalla importa `FieldErrorMessage` y la cuenta de la subcadena
  `FieldErrorMessage` en su fuente es 5 (1 import + 4 usos); no importa
  `FieldError` de `heroui-native`; no contiene `timezone` ni `deviceTimezone`
  (candado de D2: dos mutaciones plantadas, ver sondas).

**Sondas** (mutando producción): S5.1 `useState(me.phone)` pasa a `useState('')`
(rojo: caso 1); S5.2 `maxLength={2}` se borra (caso 3); S5.3 se añade
`paddingTop: insets.top + 12` (caso 5); S5.4 se añade un `Input` con
`testID="edit-profile-email"` (caso 2); S5.5 se escribe la cadena `timezone`
en un comentario del fichero (rojo en `edit-profile.test.ts`).

### R6 — Guardar valida los cuatro campos y pinta el mensaje debajo de cada uno

**EARS.** WHEN el usuario pulsa `edit-profile-save`, THE SYSTEM SHALL llamar a
`validateProfile` con `{ firstName, lastName, phone, country }` **tal como están
escritos**, reemplazar el estado `fieldErrors` por las issues devueltas y, IF hay
alguna, THEN no llamar a `updateMe`, no cerrar la pantalla y pintar en cada
campo fallido, debajo del control, su mensaje con `FieldErrorMessage`
(`testID` base = el del `Input`). El botón es:

```
<Button testID="edit-profile-save" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => void handleSubmit()}>
  <Text className="text-17 font-extrabold text-accent-foreground">{t('editProfile.save')}</Text>
</Button>
```

con `const chunkyLip = useChunkyLip();` una sola vez (de `'../../theme/chunky-lip'`)
y `handleSubmit` como `async function handleSubmit()` dentro de
`EditProfileForm`. Cada pulsación reemplaza `fieldErrors`, así que un campo
corregido pierde su mensaje en la siguiente pulsación y no antes.

**Candados** (`src/screens/edit-profile/index.test.tsx`, `describe('#194 R6: ...')`;
`updateMe` mockeado):

1. nombres vaciados: pulsar muestra `edit-profile-first-name-message` con `Enter your first name` (y existe `edit-profile-first-name-message-row`); `updateMe` no se llamó; los otros tres campos no tienen `-error` con mensaje;
2. con los cuatro inválidos (`''`, `''`, `'123'`, `'M'`) aparecen los cuatro mensajes a la vez: `Enter your first name`, `Enter your last name`, `Use at least 7 characters`, `Enter your country's 2-letter code, like MX`;
3. país `'M1'` muestra `Use only letters A to Z`; apellidos de 121 caracteres muestra `Use 120 characters or fewer`;
4. corregir un campo y volver a pulsar con otro aún inválido hace desaparecer el mensaje del corregido y deja el otro (el mensaje antiguo **no** se borra al escribir, solo al pulsar);
5. mientras haya un campo con mensaje, `edit-profile-<campo>-error` existe y, sin issue, `queryByTestId('edit-profile-<campo>-error')` ya no existe en el árbol tras pulsar con todo válido;
6. el botón `edit-profile-save` muestra `Save changes` y existe `edit-profile-save` solo en el estado `ok`.

**Candados de inventario que se mueven en R6** (en el commit rojo de R6):

- `src/__tests__/ui-copy-table.ts`: fila `{ file: 'src/screens/edit-profile/index.tsx', key: 'editProfile.save' }` en `R17_EDIT_PROFILE`; `ui-language.test.ts`: la aserción de longitud de `R17_EDIT_PROFILE` pasa a `6 + 1`.
- `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (los números caducan: se miden en H0 y el delta es el que se escribe):
  - `CTA_ROWS` gana
    `['screens/edit-profile/index.tsx', literalId('edit-profile-save'), 'w-full h-14 rounded-16 bg-accent', ['onPress={() => void handleSubmit()}']], // #194 R6`;
  - `radii` gana `'screens/edit-profile/index.tsx': 1, // #194 R6`;
  - `#177 R6.2`: `count(/text-17/g)` suma `+ 1 // #194 R6` y `count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)` suma `+ 1 // #194 R6`; `count(/<Button\.Label/g)` y `count(/Button\.Label/g)` no cambian;
  - `#177 R7.3`: `count(/\brounded-16\b/g)` suma `+ 1 // #194 R6`;
  - `ctaFiles`, `consumers` y los inventarios de `chunkyLip.primary` se derivan de `CTA_ROWS`: no se editan (el candado `R7.4` exige `const chunkyLip = useChunkyLip();` exactamente una vez en el fichero).
- `src/__tests__/consistency-classnames.test.ts`: la aserción de `rounded-16 bg-accent` de `#62 R1` (`toHaveLength(16 + 1)` en H0) suma `+ 1 // #194 R6`; la de `rounded-xl bg-accent` no cambia. **Enmienda E1:** el mapa
  `expected` de `#166 R2 … inventaría los diecisiete primarios con labio, fichero a fichero`
  (mismo fichero) gana `'screens/edit-profile/index.tsx': 1, // #194 R6` junto a
  `docs-upload-form` (el nombre del `it` no cambia).
- **Enmienda E1** — `src/__tests__/design-drift.test.ts`, dos inventarios más además de
  `screenSignOutCalls` (la spec original los omitió y Codex paró en el verde de R6):
  - `#178 R13 … reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`:
    el mapa `rounded16` gana `'screens/edit-profile/index.tsx': 1, // #194 R6`, entre
    `docs-upload-form` y `forgot`;
  - `#179 R13 … limita text-22 a Horario y text-17 al inventario de E1.2`: la lista
    ordenada de ficheros con `text-17` gana `'screens/edit-profile/index.tsx'`, entre
    `screens/docs-upload-form/index.tsx` y `screens/forgot/index.tsx` (orden verificado
    con `.sort()`). La lista de `text-22` no cambia.

**Rojo esperado:** los seis `it` de pantalla (por `getByTestId`/mensaje ausente) y
los inventarios editados fallan solo porque el botón aún no existe: las filas de
`CTA_ROWS` no encuentran su ancla `testID`, los contadores de `chunky` y
`consistency` no suman el `+ 1`, y `checkUses` de `editProfile.save` ve 0 `t(`
frente a 1. El handoff lista cada rojo con su consulta (tabla de sondas).

**Sondas:** S6.1 `validateProfile` se reemplaza por `{}` en la pantalla (rojo: casos 1 a 3);
S6.2 `setFieldErrors(issues)` pasa a `setFieldErrors((current) => ({ ...current, ...issues }))`
(rojo: caso 4); S6.3 el botón pasa a `className="w-full h-14 rounded-xl bg-accent"` (rojo: CTA_ROWS R3.1 y consistency).

### R7 — Guardar envía solo los campos que cambiaron y refresca el perfil

**EARS.** WHEN `validateProfile` no devuelve issues, THE SYSTEM SHALL construir
`changes: UpdateProfileInput` con **solo** los campos cuyo valor recortado
(`firstName.trim()`, `lastName.trim()`, `phone.trim()`, `country` tal cual) difiere
del de `me`, enviado recortado.
IF `changes` no tiene ninguna clave, THEN THE SYSTEM SHALL no llamar a `updateMe`
y cerrar con `router.back()` (D4).
OTHERWISE THE SYSTEM SHALL llamar `updateMe(process.env.EXPO_PUBLIC_API_URL, token ?? '', changes)`
con `submitting` en `true` (el botón lleva `isDisabled={submitting}` y la
pulsación en vuelo no encola otra), y WHEN devuelve `{ kind: 'ok', me }`, escribir
`queryClient.setQueryData(userKeys.me(), { kind: 'ok', me })` (con
`useQueryClient()`) y cerrar con `router.back()` (D5). `submitting` vuelve a
`false` en un `finally`. No hay aviso de éxito.

**Candados** (`describe('#194 R7: ...')`):

1. cambiar solo `firstName` a `'  Grace '` y pulsar llama `updateMe` una vez con `('<EXPO_PUBLIC_API_URL fijado en el test>', 'jwt-token', { firstName: 'Grace' })` exactamente (no `lastName`, `phone` ni `country`);
2. cambiar los cuatro (`'Grace'`, `'Hopper'`, `'  +525511112222 '`, `'US'`) llama con las cuatro claves, recortadas;
3. escribir el mismo teléfono con espacios alrededor (`' +525500000000 '`) cuenta como sin cambio: no hay llamada y `router.back` se llama una vez;
4. sin tocar nada: `updateMe` no se llamó y `router.back` se llamó una vez;
5. con `updateMe` resuelto en `{ kind: 'ok', me: updated }`, tras `await` la caché `queryClient.getQueryData(userKeys.me())` es `{ kind: 'ok', me: updated }` y `router.back` se llamó una vez; `timezone` de `updated` llega intacta;
6. mientras `updateMe` está pendiente (promesa controlada), `edit-profile-save` tiene `accessibilityState.disabled` verdadero o `props.disabled`, y una segunda pulsación no produce segunda llamada; al resolver con `error`, vuelve a estar habilitado;
7. ningún argumento de `updateMe` contiene `timezone` ni `email` en ninguno de los casos anteriores (`expect.not.objectContaining` sobre el tercer argumento).

`CTA_ROWS` de `chunky-cta-canvas-fidelity.test.ts` amplía las `keeps` de la fila de `edit-profile-save`
con `'isDisabled={submitting}'` (`// #194 R7`).

**Rojo esperado:** `updateMe` nunca se llama porque R6 no la invoca: los casos 1, 2, 5, 6
fallan por `toHaveBeenCalledTimes`/`getQueryData`; los casos 3 y 4 fallan porque
`router.back` no se llama; el caso 7 pasa en vacío (se anota como «nace verde por
requisito previo» y se cubre con la sonda S7.3).

**Sondas:** S7.1 enviar los cuatro campos siempre (rojo: caso 1); S7.2 no recortar (rojo: casos 1 y 2);
S7.3 incluir `timezone: me.timezone` en `changes` (rojo: caso 7); S7.4 sustituir
`setQueryData` por `invalidateQueries` (rojo: caso 5); S7.5 quitar `isDisabled` (rojo: caso 6).

### R8 — Los errores de servidor y de red no muestran texto crudo y no pierden lo escrito

**EARS.** WHEN `updateMe` devuelve `unauthorized`, THE SYSTEM SHALL llamar `await signOut()` y no pintar mensaje;
WHEN devuelve `validation`, pintar en `FormError` `edit-profile-error` `t('validation.checkDetails')`;
WHEN devuelve `unreachable`, `t('common.cannotReachServer')`;
WHEN devuelve `error` o `missing-config`, o `updateMe` lanza, `t('common.somethingWentWrong')`.
En esos casos THE SYSTEM SHALL conservar los valores escritos, no escribir la caché, no cerrar la
pantalla y volver a habilitar el botón. Cada pulsación borra el error de servidor anterior antes de validar.

**Candados** (`describe('#194 R8: ...')`; textos en inglés, el idioma del suite):

1. `validation` muestra `edit-profile-error` con `Something in your details doesn't look right. Check them and try again.`, y ni el literal `Validation failed` ni ningún texto del mock aparece en pantalla (`queryByText('Validation failed')` es `null`);
2. `unreachable` (`message: 'offline'`) muestra `Cannot reach server` y no `offline`;
3. `error`, `missing-config` y un `updateMe` que lanza (`mockRejectedValue(new Error('boom'))`) muestran `Something went wrong` y no `boom`;
4. `unauthorized` llama a `signOut` exactamente una vez y `queryByTestId('edit-profile-error')` es `null`;
5. tras cualquier error, el valor escrito en `edit-profile-first-name` sigue siendo el escrito, `router.back` no se llamó, `getQueryData(userKeys.me())` conserva el perfil original y el botón no está deshabilitado;
6. con un error visible, una nueva pulsación con un campo inválido hace desaparecer `edit-profile-error` (la validación de campo sustituye al aviso de servidor);
7. un `updateMe` que lanza no deja la excepción sin capturar (el `it` termina sin `unhandled rejection`).

Registros que se mueven en el rojo de R8: `R17_EDIT_PROFILE` gana las tres filas
`validation.checkDetails`, `common.cannotReachServer` y `common.somethingWentWrong`
(la aserción de longitud pasa a `6 + 1 + 3`), y
`screenSignOutCalls['screens/edit-profile/index.tsx']` pasa de `0` a `1` (`// #194 R8`).

**Rojo esperado:** casos 1 a 5 y 7 fallan (los mensajes no existen; `signOut` no se llama);
el caso 6 falla por la misma razón. `ui-language` rojo por `checkUses` (3 filas sin `t(`) y
`design-drift` rojo por `signOut(` 0 frente a 1.

**Sondas:** S8.1 mostrar `result.message` en `unreachable` (rojo: caso 2);
S8.2 `validation` cae en `somethingWentWrong` (caso 1); S8.3 no llamar `signOut` (caso 4);
S8.4 limpiar los valores en el `catch` (caso 5).

### R9 — Perfil ofrece la fila «Editar perfil» y su tarjeta refleja el cambio

**EARS.** WHILE `getMe` devuelve `{ kind: 'ok' }`, THE SYSTEM SHALL pintar en
`me-card` de `src/screens/profile/index.tsx`, entre `me-identity` y `theme-row`, un
`Pressable` `edit-profile-link` con `accessibilityRole="button"`, las clases de §Clases y
una etiqueta `Text` con `t('profile.editProfile')`, que al pulsarse llama
`router.push('/edit-profile' as Href)`; IF `getMe` está pendiente o no es `ok`, THEN
no se pinta. WHEN la caché `userKeys.me()` cambia (R7), `me-identity-text` de Perfil
muestra el nombre nuevo sin otra petición.

**Candados** (`src/screens/profile/index.test.tsx`, `describe('#194 R9: ...')`):

1. en el caso `ok` aparece `edit-profile-link` con el texto `Edit profile`, y pulsarlo llama `mockRouter.push` con `'/edit-profile'` (mismo mecanismo que el `it` de `profile-add-pet` ↔ `'/pets/add'`);
2. con `me` pendiente, `error` y `unauthorized` no existe `edit-profile-link`;
3. con la caché sembrada con `{ kind: 'ok', me: {..., firstName: 'Ada', lastName: 'Lovelace'} }` y luego `act(() => queryClient.setQueryData(userKeys.me(), { kind: 'ok', me: {..., firstName: 'Grace', lastName: 'Hopper'} }))`, `me-identity-text` muestra `Grace Hopper` y no `Ada Lovelace`, y `getMe` no se llamó una vez más.

**Reescrito (no solo añadido):** el `it.each` de B9 cambia su caso `ok` a
`children: ['me-identity', 'edit-profile-link', 'theme-row', 'language-toggle']`
(`// #194 R9`); los otros tres casos (pendiente, error, unauthorized) no cambian.
Registros: `R17_EDIT_PROFILE` gana `{ file: 'src/screens/profile/index.tsx', key: 'profile.editProfile' }`
(la aserción de longitud pasa a `6 + 1 + 3 + 1`). `profile/index.tsx` sigue sin `text-accent-strong` nuevo: el
`inkSites` de Perfil en `legibility-classnames.test.ts` no cambia, ni `screenSignOutCalls` (sigue en 2).

**Rojo esperado:** casos 1 y 2 de R9 y el caso `ok` reescrito fallan (`getByTestId`/lista de hijos); el caso 3
**nace verde** (Perfil ya lee la caché): se anota y se cubre con la sonda S9.3; `ui-language`
rojo por `checkUses` (1 fila sin `t(`).

**Sondas:** S9.1 `router.push('/pets/add')` en la fila (rojo: caso 1); S9.2 pintar la fila también
sin `ok` (caso 2); S9.3 cambiar `queryKey: userKeys.me()` por `['users', 'me2']` en Perfil (caso 3).

### R10 — La carta registra la pantalla bajo la excepción A11 y la regla de edición

**EARS.** THE SYSTEM SHALL añadir `edit-profile` a la lista de pantallas empujadas
de la excepción A11, **en `docs/ui-guidelines.md` y en `docs/conventions.md`**,
con la forma «`edit-profile` (por la enmienda A22 de #194, <fecha de la firma>)»
dentro del párrafo de A11 (antes de `— no lleva`), y añadir a `docs/ui-guidelines.md`
una sección `## Enmienda #194 — Editar perfil` que fije: (a) el perfil se edita en
`/edit-profile`, ruta protegida con cabecera nativa, accesible desde la fila
`edit-profile-link` de `me-card`; (b) los campos editables son nombres, apellidos,
teléfono y país, el correo y la zona horaria no se editan en la app; (c) se envían
solo los campos cambiados y el éxito escribe `userKeys.me()`; y cierra con la casilla
`- [ ] Enmienda #194 aprobada por humano` (la firma la pone el humano). `docs/conventions.md`
§Dimensiones, excepción A11, gana la misma mención con un bloque propio
`- Spec enmendada: docs/conventions.md` / `- Qué cambia: ... A22 de #194` /
`- Qué NO cambia: ...` / `- [ ] Enmienda A22 aprobada por humano (fecha: ____)`.

**Candados** (`src/__tests__/edit-profile.test.ts`, `describe('#194 R10: ...')`, en el
estilo de `#185 R10` de design-drift):

1. `it.each(['conventions.md', 'ui-guidelines.md'])`: el tramo desde `Excepción nombrada (enmienda A11` hasta el primer `Su` contiene `` `edit-profile` ``;
2. `ui-guidelines.md` contiene `## Enmienda #194 — Editar perfil` y los literales `edit-profile-link`, `/edit-profile`, `userKeys.me()`;
3. `ui-guidelines.md` contiene una casilla `/- \[[ xX]\] Enmienda #194 aprobada por humano/` (tolerante a marcada o sin marcar);
4. `conventions.md` contiene `enmienda A22 de #194` y una casilla `/- \[[ xX]\] Enmienda A22 aprobada por humano/`.

**Rojo esperado:** 4 `it` (los dos del `it.each` cuentan 2) fallan por `toContain`/regex.

**Sondas:** S10.1 quitar `edit-profile` de la lista de `conventions.md` (rojo: caso 1, 1 de 2);
S10.2 cambiar el título de la sección (caso 2).

### R11 — Prueba de humo humana en dev build de Android

**EARS.** THE SYSTEM SHALL quedar verificado por el humano en un dev build de
Android contra el backend real (no Expo Go, no la VPS): este requisito lo cierra
el humano, no un test. Guion mínimo:

1. Perfil → fila «Editar perfil» abre la pantalla con los cuatro campos rellenos y el teclado no tapa el botón.
2. Vaciar nombres y pulsar Guardar: aparece el mensaje debajo del campo.
3. Cambiar teléfono, Guardar: vuelve a Perfil y la tarjeta muestra el dato nuevo sin recargar; reabrir muestra el valor guardado.
4. Pulsar Guardar sin cambiar nada: vuelve a Perfil sin error.
5. Con el teléfono en modo avión, Guardar muestra «No se pudo conectar con el servidor» y conserva lo escrito.
6. Con sesión caducada (borrar el token o esperar), Guardar cierra sesión.

- [ ] Prueba de humo (R11) cerrada por humano (fecha: ____) ← el leader no marca `done` sin esta casilla

## Deltas de candados

| Candado | Fichero | R1 | R5 | R6 | R7 | R8 | R9 | Final |
|---|---|---|---|---|---|---|---|---|
| Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx` | `+ 2` | | | | | | `B1 + 2` |
| Filas de `R17_EDIT_PROFILE` | `src/__tests__/ui-copy-table.ts` / `ui-language.test.ts` | | 6 | `6 + 1` | | `6 + 1 + 3` | `6 + 1 + 3 + 1` | 11 |
| `SCREEN_FILES` | `src/__tests__/ui-language.test.ts` | | `+ 1` | | | | | `B7 + 1` |
| `screenSignOutCalls` | `src/__tests__/design-drift.test.ts` | | `+1 entrada (0)` | | | `0 → 1` | | 18 entradas |
| `CTA_ROWS`, `radii` | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | | | `+ 1` fila, `+ 1` radio | `keeps` + `isDisabled` | | | |
| Recuentos `text-17`, `<Text ...accent-foreground>`, `rounded-16` | ídem | | | `+ 1` cada uno | | | | `+ 1` cada uno |
| `rounded-16 bg-accent` | `src/__tests__/consistency-classnames.test.ts` | | | `+ 1` | | | | `B + 1` |
| Mapa `expected` de `#166 R2` (primarios con labio) | `src/__tests__/consistency-classnames.test.ts` | | | `+ 1 entrada` (E1) | | | | 1 entrada nueva |
| Mapa `rounded16` de `#178 R13` | `src/__tests__/design-drift.test.ts` | | | `+ 1 entrada` (E1) | | | | 1 entrada nueva |
| Lista ordenada de `text-17` de `#179 R13` | `src/__tests__/design-drift.test.ts` | | | `+ 1 fichero` (E1) | | | | 1 fichero nuevo |
| Hijos del grupo protegido (4 aserciones) | `src/app/__tests__/layout.test.tsx` | | | | | | | `+ 1` en R4 |
| Caso `ok` de `me-card` | `src/screens/profile/index.test.tsx` | | | | | | reescrito | |
| `inkSites` de `text-accent-strong`, `R7_PROFILE`, `account-screens-polish`, `forms-validation-global`, `heroui-text-size-merge`, `profile-canvas-fidelity` | `src/__tests__/*` | | | | | | | **sin cambio** (verificado: ninguna clase ni fila de esos inventarios se mueve) |
| §2.N en el design de idioma | `specs/mobile-ui-language/design.md` | +1 sección, 2 filas | | | | | | |

## Coordinación y reparto de ficheros

El reparto protege el árbol de trabajo de cada feature, no la historia: caduca
cuando una feature se mergea.

| Feature | Qué toca de lo mismo | Orden |
|---|---|---|
| #186 (done) | `FieldErrorMessage` y `form-rules.ts` (esta feature solo importa `FieldErrorMessage`) y la lista A11 de las dos docs | merge previo a esta; se añade a la lista, no se reescribe |
| #184 (done) | tests de Perfil: `src/screens/profile/index.test.tsx` | merge previo; R9 añade y reescribe un caso |
| #191 (done) | `chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts` (sus cifras `+ 1 // #191 R11` son la base) | merge previo; los deltas se miden en H0 |
| #189, #188 | otros ficheros de `ui-copy-table.ts`, `ui-language.test.ts` y catálogo | si se mergean antes, se re-mide cada cifra en H0 y se hace merge de `main` en la branch (merge, no rebase: la trazabilidad guarda hashes) |

Ficheros que esta feature es la **única** en tocar: `src/screens/edit-profile/`,
`src/app/edit-profile.tsx`, `src/__tests__/edit-profile.test.ts`. Compartidos en los
que solo **añade** (salvo lo dicho en R9): `src/api/users.ts`, `src/utils/account-rules.ts`
(más la extracción de R2), `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts`,
`src/__tests__/ui-language.test.ts`, `src/providers/__tests__/language-provider.test.tsx`,
`src/app/_layout.tsx`, `docs/ui-guidelines.md`, `docs/conventions.md`,
`specs/mobile-ui-language/design.md`.

## Fuera de alcance

Cada viñeta es una delimitación de esta feature, no una feature pendiente salvo
que lo diga.

- **Editar el correo.** No está en el DTO y exigiría verificación. No se muestra.
- **Editar la zona horaria** (campo, selector IANA o envío del huso del dispositivo al
  guardar). Queda automática (P1). Si el humano la quiere, es feature propia.
- **Cambiar la contraseña.** Otro flujo y otro endpoint.
- **Selector de país o catálogo.** El DTO acepta cualquier par de letras mayúsculas; el
  campo es de texto libre de dos letras, como en el registro.
- **Aviso de «cambios sin guardar»** al salir con atrás. No existe en el resto de
  formularios del repo.
- **Validación en vivo** al escribir. Se valida al pulsar Guardar, como #183 y #186.
- **Aviso de éxito** (toast, mensaje, Pingo). La tarjeta actualizada es la confirmación (P3).
- **Foto de perfil del usuario.** No existe en el backend.
- **Cambios en el backend** (DTO, endpoint, mensajes de error).
- **Cambiar `FieldErrorMessage`, `form-rules.ts`, `validateRegister` más allá de la
  extracción de R2** o los tests de las pantallas de cuenta.
- **Pruebas contra infraestructura real**: la prueba de humo es R11, del humano.

## Preguntas para el gate

La spec ya trae cada una cerrada con el valor por defecto marcado; el humano
confirma o cambia.

- **P1 — Zona horaria: ¿automática o editable?**
  - **A (recomendada, la que escribe esta spec): automática.** No hay campo y `updateMe`
    no la envía; queda la del registro. Consecuencia: quien cambia de país conserva la
    zona del alta, y `weight-log` calcula «hoy» con esa zona.
  - **B: reenviar la zona del dispositivo al guardar.** Consecuencia: se corrige sola al
    cambiar de país, pero cada guardado pisa una zona que el usuario no ve, y R7 pierde
    la garantía «solo se envía lo que cambió».
  - **C: selector de zonas IANA.** Consecuencia: feature de UI aparte (lista larga, búsqueda).
- **P2 — Campos editables.** Defecto: nombres, apellidos, teléfono y país; el correo ni se
  muestra. Alternativa: mostrarlo en una fila de solo lectura (añade una clave de copy y
  decisión de diseño).
- **P3 — Después de guardar.** Defecto: se vuelve a Perfil y la tarjeta cambia, sin aviso.
  Alternativa: quedarse en la pantalla con un mensaje de éxito (añade copy y estado).
- **P4 — Sin cambios.** Defecto: no hay petición y se vuelve. Alternativa: mantener la
  pantalla y avisar «no hay cambios» (añade copy).
- **P5 — Punto de entrada.** Defecto: una fila `Editar perfil` dentro de la tarjeta de
  cuenta de Perfil. Alternativas: un icono de lápiz en la cabecera de Perfil, o un botón
  bajo la tarjeta (ambos mueven el lienzo de Perfil, que no tiene diseño para ello).
- **P6 — País como texto libre de dos letras.** Defecto: sí, igual que el registro.
  Alternativa: un selector (feature de UI aparte). La premisa «del catálogo» del registro
  de #194 era falsa (ver §Premisas).
- **P7 — Redacción del copy** (`Edit profile`/`Editar perfil`, `Save changes`/`Guardar cambios`):
  ¿se aprueba tal cual? No hay artboard de esta pantalla en el canvas aprobado: la
  pantalla reutiliza la receta de formulario del registro, no inventa una.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-21) ← gate obligatorio antes de implementar

## Enmienda E1 — tres inventarios de guardas omitidos en R6 (parada de Codex, 2026-10-21)

> Escrita el 2026-10-21 sobre la spec aprobada, tras la parada de Codex en el verde
> de R6 (`progress/impl_mobile-edit-profile.md`, §«R6 — Detenido por inventarios no
> contemplados», sobre `0c10084e`). El leader leyó las tres guardas y confirmó que el
> fallo es el que describe el reporte. **Solo tests**: la receta del botón
> (`w-full h-14 rounded-16 bg-accent`, `Text text-17`) y la producción de R6 no
> cambian; el parche de producción de Codex, guardado en su reporte, es válido tal cual.

**El hecho medido.** El botón de R6 lleva `rounded-16 bg-accent` con labio y un `Text`
`text-17`. Tres inventarios por fichero lo cuentan y la spec solo listó los
recuentos de `chunky-cta-canvas-fidelity` y el de `#62 R1`:

| Id | Guarda (por nombre del `it`) | Aserción | Por qué falla |
|---|---|---|---|
| E1.1 | `consistency-classnames.test.ts`, `#166 R2 … diecisiete primarios con labio` | `expect(inventory(/rounded-16 bg-accent…/g)).toEqual(expected)` | `expected` no tiene `screens/edit-profile/index.tsx` |
| E1.2 | `design-drift.test.ts`, `#178 R13 … radios 14, 16 y 22` | `expect(rounded16).toEqual({…})` | falta `screens/edit-profile/index.tsx: 1` |
| E1.3 | `design-drift.test.ts`, `#179 R13 … text-17` | `expect(productionFilesMatching(/\btext-17\b/)).toEqual([…])` | falta `screens/edit-profile/index.tsx` |

**Qué cambia.** Los tres deltas, escritos arriba en §R6 (candados de inventario) y en
§Deltas de candados con la marca «Enmienda E1». El permiso sobre `design-drift.test.ts`
pasa de «solo `screenSignOutCalls`» a «`screenSignOutCalls`, el mapa `rounded16` y la
lista de `text-17`».

**Qué NO cambia.** R1–R11, las clases de §Clases, las decisiones D1–D5 y la producción.
Verificación de que no faltan más inventarios para R7–R9: el leader buscó
`border-separator`, `py-2.5`, `justify-between`, `router.back`, `setQueryData` y
`useQueryClient` en `src/__tests__/*.ts*`; no hay inventario de las seis clases ni de
`router.back`, y solo `#134 R7` cita la caché, para tres ficheros que no son éstos.
Eso no sustituye la corrida: si otra guarda no listada falla en R7–R9, Codex PARA y
reporta, como en R6.

**Rojo esperado.** Ninguno. Los tres deltas van en un commit propio de tests, antes
del verde de R6 (ver la Reanudación 3 del handoff).

- [ ] Enmienda E1 aprobada por humano (fecha: ____) ← el humano reabre el gate solo para esta enmienda
