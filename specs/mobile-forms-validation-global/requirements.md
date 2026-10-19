---
feature: "mobile-forms-validation-global"
status: draft
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-forms-validation-global]] (#186)

> Un componente compartido pinta el mensaje de error de cada campo, y los
> formularios de mascota, recordatorio, documento y peso lo usan con reglas que
> salen de los DTO del backend. Cada campo inválido muestra su mensaje debajo,
> en el idioma de la app, al pulsar enviar. El usuario no vuelve a ver un
> aviso único arriba o abajo que no dice qué campo falla, ni el texto crudo del
> servidor. Amplía a toda la app lo que #183 hizo en las cuatro pantallas de
> cuenta, y deja el componente listo para que #191 (alta de mascota en dos
> pasos) lo reuse.

Petición del humano (2026-10-15): «manejar los errores de validacion recomiendo
que crees componentes globales para estas alertas de errores te puedes guiar con
el componente que se ocupo en crear cuenta esto nos va a servir en todos los
compontes de inputs igual valida porque creo que eso ya lo habias planteado en
una feature pero ahora se va ampliar en toda la app».

Lo que ya existe y esta feature **no** repite: #183 (done) validó las cuatro
pantallas de cuenta con `src/utils/account-rules.ts` y el patrón
`TextField` + `FieldError` + `FormError`. Esta spec reusa sus tipos
(`RuleIssue`, `FieldIssues`) y su esquema de `testID`.

## Base medida

Base congelada al escribir: `d799d714` (`origin/main`, merge de #230).
**La implementación espera a que #177 se mergee en `main`, y `main` se mergea en
esta branch antes del handoff (merge, no rebase: ver §Coordinación).** H0 es el
commit del handoff. Toda cifra que otra feature pueda mover se escribe «base
medida en H0 + delta», y el handoff la vuelve a medir en H0 con el mismo
comando. Si en H0 una medida no coincide con la de `d799d714`, vale la de H0 y
el delta no cambia.

| Id | Qué | Comando (desde `mobile-pet-tracker/`) | En `d799d714` |
|---|---|---|---|
| B1 | `B_KEYS`: claves de `en` en el catálogo | `bun -e "import {catalog} from './src/i18n/catalog.ts'; console.log(Object.keys(catalog.en).length)"` | 425 (la fórmula de longitud acaba en `+ 1, // #180 R8`) |
| B2 | Última sección `### §2.N` de `../specs/mobile-ui-language/design.md` | `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` y ver la última | 35 secciones, la última §2.35 (#180). Esta feature toma **§2.36**. Regla: la última en H0 + 1 |
| B3 | Namespace `validation.` | `grep -cF "'validation." src/i18n/catalog.ts` | 18 (nueve claves por idioma) |
| B4 | Las cuatro claves nuevas no existen | `for k in required invalidDate weightRange bodyConditionRange; do grep -cF "'validation.$k'" src/i18n/catalog.ts; done` | `0 0 0 0` |
| B5 | Los módulos nuevos no existen | `test ! -e src/components/field-error-message.tsx && test ! -e src/utils/form-rules.ts` | sale 0 |
| B6 | `B_HEALTH`: total de `expect(R5_HEALTH).toHaveLength(` | `grep -F 'expect(R5_HEALTH).toHaveLength(' src/__tests__/ui-language.test.ts` y sumar | `32 + 1 + 1 - 2 + 3 + 2 + 1 + 1` = 39 |
| B7 | `B_PROFILE`: total de `expect(R7_PROFILE).toHaveLength(` | ídem | `35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6 + 2 + 2` = 68 |
| B8 | `B_REMINDERS`: total de `expect(R8_REMINDERS).toHaveLength(` | ídem | `50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1 + 3` = 56 |
| B9 | `B_ADDPET`: total de `expect(R9_ADD_PET).toHaveLength(` | ídem | `42 + 1 - 2 + 4` = 45 |
| B10 | `B_FILES`: total de la fórmula de `expect(SCREEN_FILES).toHaveLength(` | leer la fórmula y sumar | la última línea es `+ 1 // #185 R2: screens/docs-upload-form/index.tsx` |
| B11 | Quién importa `FieldError` de `heroui-native` | `grep -rln "FieldError" src --include=*.tsx` | exactamente 4: login, register, forgot, reset-password (`index.tsx`) |
| B12 | `form-error.tsx` no cambia | `git diff <H0> -- src/components/form-error.tsx` | vacío |

Anclas por pantalla (`grep -cF '<literal>' src/screens/<p>/index.tsx`) en
`d799d714`:

| Literal | weight-log | add-pet | add-reminder | docs-upload-form |
|---|---|---|---|---|
| `<FieldError` | 0 | 0 | 0 | 0 |
| `isInvalid` | 0 | 0 | 0 | 0 |
| `maxLength` | 0 | 4 | 1 | 3 |
| `t('weightLog.enterValidWeight')` | 1 | 0 | 0 | 0 |
| `t('weightLog.dateCannotBeAfterToday')` | 1 | 0 | 0 | 0 |
| `parseFloat` | 1 | 0 | 0 | 0 |
| `join('\n')` | 1 | 0 | 0 | 0 |
| `t('addPet.nameIsRequired')` | 0 | 1 | 0 | 0 |
| `t('addPet.chooseBirthDate')` | 0 | 1 | 0 | 0 |
| `t('addPet.errorAgeRange')` | 0 | 1 | 0 | 0 |
| `t('addPet.checkPetDetails')` | 0 | 1 | 0 | 0 |
| `t('addReminder.titleIsRequired')` | 0 | 0 | 1 | 0 |
| `t('addReminder.pickDate')` | 0 | 0 | 1 | 0 |
| `t('addReminder.dateMustBeFuture')` | 0 | 0 | 2 | 0 |
| `invalid-form` | 0 | 0 | 0 | 4 |
| `docs.errorInvalidForm` | 0 | 0 | 0 | 1 |
| `testID="weight-form-error"` | 1 | 0 | 0 | 0 |
| `testID="add-pet-error"` | 0 | 1 | 0 | 0 |
| `testID="add-reminder-error"` | 0 | 0 | 1 | 0 |
| `testID="docs-action-error"` | 0 | 0 | 0 | 1 |

Hoy, por pantalla (todas validan al pulsar, antes de `setSubmitting`, y paran
en **el primer** fallo con **un solo** aviso de formulario; ninguna dice qué
campo falla más allá del texto):

- **add-pet** (`src/screens/add-pet/index.tsx`): `name-input`,
  `breed-input`, `approx-age-input` y `microchip-input` son `TextInput` crudos de
  `react-native` (con `maxLength` 120, 120, 3 y 32); `birth-date-field` es un
  `Pressable`. Cada campo es un `View className="gap-2"` con `FieldLabel` y el
  control. Un nombre vacío, una fecha sin elegir o una edad fuera de 0..480
  caen en `add-pet-error` (un `Text`). Un 400 del servidor cae en
  `addPet.checkPetDetails`.
- **add-reminder** (`src/screens/add-reminder/index.tsx`): `title-input`
  (`TextInput` crudo, `maxLength` 120), `date-field` y `time-field`
  (`Pressable`). La columna de la fecha es `View className="flex-3 gap-1.5"`.
  Título vacío, fecha sin elegir y fecha pasada caen en `add-reminder-error`.
  Un 400 del servidor también cae en `addReminder.dateMustBeFuture`
  (verificado por tests existentes: se conserva).
- **docs-upload-form** (`src/screens/docs-upload-form/index.tsx`): cuatro
  `TextField` de heroui (`docs-type-input` con `maxLength` 40,
  `docs-name-input` 120, `docs-date-input` sin tope, `docs-vet-input` 120).
  Tipo o nombre vacíos, o una fecha que no case con `/^\d{4}-\d{2}-\d{2}$/`,
  caen en un único `docs-action-error` con `docs.errorInvalidForm`. La regex es
  **más laxa** que el DTO: `2026-02-30` pasa y el servidor lo rechaza.
- **weight-log** (`src/screens/weight-log/index.tsx`): tres `TextField` de
  heroui (`weight-input`, `weight-date-input`, `weight-bc-input`). Valida con
  `parseFloat`, que es **más laxo** que el DTO: `12abc` pasa como 12, `72,5`
  pasa como 72, no hay rango y la condición corporal se envía con `Number(...)`
  aunque sea `NaN`. El error de formulario es
  `<Text testID="weight-form-error" className="text-danger">`. Es la **única**
  pantalla que muestra texto crudo del servidor: la rama `case 'validation':`
  une con `\n` los `message` del 400, salvo el de «fecha demasiado futura», que
  traduce a `weightLog.dateCannotBeAfterToday`.
- **geofence-editor** y **pairing** ya están alineados con su DTO por
  `isDisabled` y `maxLength`; ver §Fuera de alcance y P4.

## Reglas del DTO (fuente de verdad)

Las reglas del cliente copian estas del backend (`backend-pet-tracker/src/modules/`),
ni más estrictas ni más laxas. Si un DTO cambia, el módulo de R2 cambia con él.

| Pantalla | Campo | DTO | Regla |
|---|---|---|---|
| add-pet | `name` | `pets/.../create-pet.dto.ts` | `trim().min(1).max(120)` |
| add-pet | `breed` | ídem | opcional, `trim().min(1).max(120)` |
| add-pet | `birthDate` / `approxAgeMonths` | ídem | exactamente uno de los dos; `approxAgeMonths` entero 0..480; `birthDate` ISO real |
| add-pet | `microchip` | ídem | opcional, `trim().min(1).max(32)` |
| add-reminder | `title` | `reminders/.../reminder.dto.ts` | `trim().min(1).max(120)` |
| add-reminder | `dueAt` | ídem | ISO con offset y estrictamente posterior a `Date.now()` |
| docs | `type` | `media/.../create-pet-document.dto.ts` | `trim().min(1).max(40)` |
| docs | `name` | ídem | `trim().min(1).max(120)` |
| docs | `date` | ídem + `health/.../iso-date.ts` | `/^\d{4}-\d{2}-\d{2}$/` **y** fecha real (`new Date(v + 'T00:00:00.000Z')` válida y `toISOString().slice(0, 10) === v`); **no recorta** |
| docs | `vet` | ídem | opcional, `trim().min(1).max(120)` |
| weight | `weightKg` | `health/.../weight.dto.ts` | número con `gt(0)` y `lte(999.99)` |
| weight | `measuredAt` | ídem + `iso-date.ts` | fecha real, no recorta; el servidor además rechaza «demasiado futura» |
| weight | `bodyCondition` | ídem | opcional, entero 1..9 |

Los topes de longitud de los campos de texto ya los impone el `maxLength` del
`TextInput` (120, 120, 32, 120, 40, 120, 120 según la tabla), así que **no hay
mensaje de «demasiado largo»** para ellos. Esta spec solo congela esos valores
(R4, R5, R6).

## Copy nuevo

Cuatro claves en `src/i18n/catalog.ts`, en los dos idiomas, sin punto final
(como los mensajes de campo de #183). Las claves existentes que se reusan **no
cambian de valor**: `addPet.nameIsRequired`, `addPet.chooseBirthDate`,
`addPet.errorAgeRange`, `addPet.checkPetDetails`, `addReminder.titleIsRequired`,
`addReminder.pickDate`, `addReminder.dateMustBeFuture`,
`weightLog.enterValidWeight`, `weightLog.dateCannotBeAfterToday`,
`docs.errorInvalidForm`, `validation.checkDetails`.

| Clave | `en` | `es` |
|---|---|---|
| `validation.required` | `This field is required` | `Este campo es obligatorio` |
| `validation.invalidDate` | `Enter a valid date as YYYY-MM-DD` | `Escribe una fecha válida con formato AAAA-MM-DD` |
| `validation.weightRange` | `Weight must be above 0 and at most 999.99 kg` | `El peso debe ser mayor que 0 y como máximo 999,99 kg` |
| `validation.bodyConditionRange` | `Body condition is a whole number from 1 to 9` | `La condición corporal es un número entero del 1 al 9` |

La redacción es la pregunta P7.

## testIDs nuevos

`FieldErrorMessage` (R3) deriva tres `testID` del que recibe como `testID`, que
es **siempre el `testID` del control** al que acompaña. El esquema es el mismo de
#183 (`register-first-name` → `register-first-name-error`,
`register-first-name-message`, `register-first-name-message-row`):

| Derivado | Qué es |
|---|---|
| `<base>-error` | el `FieldError` de heroui (no existe en el árbol mientras no hay mensaje) |
| `<base>-message` | el `Text` del mensaje (de `FormError`) |
| `<base>-message-row` | la fila con el icono (de `FormError`) |

Bases por pantalla (todas existen hoy como `testID` del control):

| Pantalla | Bases |
|---|---|
| add-pet | `name-input`, `birth-date-field`, `approx-age-input` |
| add-reminder | `title-input`, `date-field` |
| docs-upload-form | `docs-type-input`, `docs-name-input`, `docs-date-input` |
| weight-log | `weight-input`, `weight-date-input`, `weight-bc-input` |

Verificado contra el árbol: ningún `testID` existente termina en `-error`,
`-message` ni `-message-row` con esas bases, y ningún selector por regex de los
tests existentes los captura, salvo `/^register-.+-message-row$/` (siete filas
de registro), que R8 conserva porque mantiene el esquema.

## Convenciones de esta spec

- **Nombres.** Todo `it` nuevo o reescrito empieza por `#186 Rn:`. Todo
  comentario de código que cite esta feature se escribe `#186 Rn`: un `#186`
  suelto casa con `HEX_LITERAL` en design-drift.
- **RNTL 14.** `await` en todo `render`, `fireEvent.*` y `act`. Para el estado
  asíncrono, `waitFor` o `findBy*` sobre el árbol (`docs/conventions.md`
  §Esperas sobre el árbol renderizado). Se espera primero a que **aparezca el
  mensaje** y solo después se aseveran las ausencias y los contadores de mock.
- **Nodos ocultos.** Los `getByTestId` sobre filas y mensajes no necesitan
  `includeHiddenElements`; si un test usa `getByRole`, se comprueba contra el
  árbol.
- **Icono de la fila.** `within(row).getByTestId('icon-alert-circle')`, nunca
  `screen.getByTestId('icon-alert-circle')`: varios iconos conviven. El test
  del componente sigue el patrón de `src/components/__tests__/form-error.test.tsx`
  (mock de `reicon-react-native` que expone `AlertCircle` con ese `testID`); se
  prescribe la intención, no el literal del mock, y el handoff lo verifica
  contra ese fichero.
- **Literales en los tests.** El copy esperado se escribe literal. Nunca se
  importa de `catalog.ts`, y las tablas de reglas no importan constantes del
  módulo para compararse consigo mismas: las propiedades esperadas van escritas
  a mano (`{ labelKey: 'validation.required' }`).
- **Mensaje por campo, al pulsar.** Se valida **al pulsar enviar**, antes de
  `setSubmitting`, y se pintan **todos** los campos fallidos a la vez (a
  diferencia de hoy, que para en el primero). Cada pulsación **reemplaza** el
  estado de errores (`setFieldErrors(issues)`), así que un campo corregido pierde
  su mensaje en la siguiente pulsación y no antes (misma regla que #183). Por
  campo se muestra **la primera regla** que falla.
- **Errores de servidor y de red no cambian**, salvo en weight-log (R7). El
  aviso de formulario (`add-pet-error`, `add-reminder-error`,
  `docs-action-error`, `weight-form-error`) queda solo para esos casos.
- **Sin clases nuevas.** El componente y las pantallas no añaden ni cambian
  ninguna clase `className`: nada de `text-NN` sobre HeroUI (#187), ni hex, ni
  `[...]`, ni `StyleSheet.create`. Los candados de la carta
  (grep-clean, design-drift, legibility, consistency, `heroui-text-size-merge`,
  el listado `text-13` de `profile-canvas-fidelity`) no cambian.
- **Sondas.** Mutan solo producción, se corren en el commit verde de su R y se
  revierten con `git checkout HEAD -- <ruta>`. Después `git diff --quiet HEAD -- <ruta>`
  y `git diff --cached --quiet` salen 0.
- **Commits.** Por cada R, primero el rojo, `test(mobile): <qué> (#186 Rn)`, y
  en un commit aparte el verde, `feat(mobile): <qué> (#186 Rn)`. R1 es solo
  catálogo: su verde se titula `feat(mobile): copy de validación (#186 R1)`.
  R9 trae la enmienda de la carta: `docs(ui): enmienda #186 (#186 R9)`.
- **Mocks que no se tocan** (restricción de par con #178/#179): `HomeEntrance` en
  `src/screens/login/index.test.tsx` y el de reicon (`...actual` +
  `mockIcon(testID)`) en `src/screens/register/index.test.tsx`. Ancla al cierre:
  `git diff <H0> -- src/screens/login/index.test.tsx | grep -cF 'HomeEntrance'` → `0` y
  `git diff <H0> -- src/screens/register/index.test.tsx | grep -cF 'mockIcon'` → `0`.

## Requisitos funcionales

### R1 — El catálogo trae el copy de validación en los dos idiomas

**EARS.** THE SYSTEM SHALL declarar en `src/i18n/catalog.ts` las cuatro claves
de §Copy nuevo con sus valores `en` y `es` literales, y registrarlas en
`specs/mobile-ui-language/design.md` en una sección nueva
`### §2.N — Añadidos por #186 — Validación de formularios de mascota, recordatorio, documento y peso`
donde N es la última en H0 + 1 (B2). Cada fila sigue el formato
`| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #186 (R1) |`.

**Candados** (`src/providers/__tests__/language-provider.test.tsx`):

1. La fórmula de longitud del catálogo (el `it` `mantiene la base más las claves
   de #68 y los mismos marcadores en ambos idiomas`) cierra con
   `+ 1 // #180 R8` y una línea nueva `+ 4, // #186 R1` (la coma pasa de la
   línea de #180 a la nueva). El total esperado es `B_KEYS` + 4.
2. Un `describe('#186 R1: el copy de validación de los formularios')` con un
   `it('#186 R1: declara las claves de validación en los dos idiomas y su registro')`
   calcado del de #183 R1. Tiene un array de 4 tuplas `[clave, en, es]` con los
   literales de §Copy nuevo. Para cada tupla asevera `english[key]` y
   `spanish[key]` con `toBe`, y que el design de idioma case con
   `'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #186 \\(R1\\)'`.
   Asevera también la cabecera
   `/### §2\.\d+ — Añadidos por #186 — Validación de formularios de mascota, recordatorio, documento y peso/`.

**Rojo esperado** (`bunx jest src/providers/__tests__/language-provider.test.tsx`):

| `it` | Tipo |
|---|---|
| `mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` | aserción (`toHaveLength`: `B_KEYS` frente a `B_KEYS + 4`) |
| `#186 R1: declara las claves de validación en los dos idiomas y su registro` | aserción (`toBe`: `undefined` frente al literal) |

Total: **2** `it` en rojo, los dos por aserción. Ningún guard global se mueve en
el rojo.

**Verde.** Se añaden las 4 claves a `en` y `es` y la sección §2.N al design de
idioma. La suite queda en verde. `src/__tests__/ui-language.test.ts` sigue en
verde: ningún valor nuevo aparece como literal en las pantallas.

**Sondas** (en el verde de R1, mutando `src/i18n/catalog.ts`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S1.1 | `es['validation.weightRange']` pasa a `El peso debe ser mayor que 0` (cambia el literal) | 1: el `it` de la tabla (aserción) |
| S1.2 | Borrar `validation.bodyConditionRange` de `en` y de `es` | 2: los dos `it` (longitud y tabla) |

**Anclas:** `grep -cF "'validation." src/i18n/catalog.ts` → `26` (base 18: ocho
nuevas, cuatro por idioma). `grep -cF 'por #186 (R1)' ../specs/mobile-ui-language/design.md` → `4` (base 0).

### R2 — Un módulo puro decide las reglas de los cuatro formularios, idénticas a los DTO

**EARS.** THE SYSTEM SHALL exponer en `src/utils/form-rules.ts` (sin zod, sin
react, sin importar de `src/screens/`) cuatro validadores y un parser,
devolviendo `FieldIssues` (`{ labelKey, params? }`, nunca texto) con los tipos
`RuleIssue` y `FieldIssues` que ya exporta `src/utils/account-rules.ts`
(`import type`). Cada `labelKey` aparece **una sola vez** como literal en el
fichero (se declara en una constante y se reusa).

Firmas exactas:

```
validateAddPet(values: { name: string; ageMode: 'birthDate' | 'months'; birthDate: Date | null; approxAgeMonths: string }): FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'>
validateReminder(values: { title: string; dueAt: Date | null; nowMs: number }): FieldIssues<'title' | 'date'>
validateDocument(values: { type: string; name: string; date: string }): FieldIssues<'type' | 'name' | 'date'>
validateWeight(values: { weight: string; measuredAt: string; bodyCondition: string }): FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>
parseDecimal(text: string): number
```

Reglas (la primera que falla por campo; un campo sin fallo no aparece en el
resultado):

- **validateAddPet.** `name`: tras `trim()` vacío → `addPet.nameIsRequired`.
  Con `ageMode === 'birthDate'`: `birthDate === null` → campo `birthDate`,
  `addPet.chooseBirthDate`. Con `ageMode === 'months'`: si
  `!/^\d+$/.test(approxAgeMonths)` o el número no está en 0..480 → campo
  `approxAgeMonths`, `addPet.errorAgeRange` (sin recortar, como hoy). El campo del
  modo inactivo **nunca** falla. `breed` y `microchip` no tienen regla.
- **validateReminder.** `title` vacío tras `trim()` → `addReminder.titleIsRequired`.
  `dueAt === null` → campo `date`, `addReminder.pickDate`. `dueAt` no nulo con
  `dueAt.getTime() <= nowMs` → campo `date`, `addReminder.dateMustBeFuture`.
- **validateDocument.** `type` y `name` vacíos tras `trim()` →
  `validation.required`. `date`: tras `trim()` debe ser una fecha ISO real (la
  regla de `isIsoDate` del backend: `/^\d{4}-\d{2}-\d{2}$/`, `new Date(v + 'T00:00:00.000Z')`
  válida y `toISOString().slice(0, 10) === v`); si no → `validation.invalidDate`.
- **validateWeight.** `weight`: se evalúa con `DECIMAL = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/`
  sobre el texto recortado y con la primera coma cambiada por punto. Si no casa
  → `weightLog.enterValidWeight`. Si casa y `parseDecimal(...)` es `<= 0` o
  `> 999.99` → `validation.weightRange`. `measuredAt`: recortado, fecha ISO
  real, si no → `validation.invalidDate`. `bodyCondition`: vacío o solo espacios
  es válido (campo opcional); si no, recortado debe casar `/^\d+$/` y estar en
  1..9, si no → `validation.bodyConditionRange`.
- **parseDecimal.** `Number(text.trim().replace(',', '.'))`. Solo se llama con un
  texto que ya pasó `DECIMAL`.

**Candados** (`src/utils/form-rules.test.ts`, nuevo, junto a
`account-rules.test.ts`). Todas las tablas son `it.each` con la salida esperada
escrita a mano:

1. **Add-pet.** (`name`, `ageMode`, `birthDate`, `approxAgeMonths` → issues):
   - nombre `''` y `'   '` → `{ name: nameIsRequired }`; `'Luna'` → sin `name`.
   - `birthDate` + `birthDate: null` → `{ birthDate: chooseBirthDate }`;
     con una `Date` → `{}`.
   - `months` + `''`, `'-1'`, `'1.5'`, `'abc'`, `' 12'`, `'481'` →
     `{ approxAgeMonths: errorAgeRange }`; `'0'`, `'12'`, `'480'` → `{}`.
   - modo `months` con `birthDate: null` → sin `birthDate`; modo `birthDate`
     con `approxAgeMonths: 'abc'` → sin `approxAgeMonths`.
   - nombre vacío **y** fecha sin elegir → dos campos a la vez.
2. **Recordatorio.** (`title`, `dueAt` relativo a `nowMs = 1_000_000`):
   - título `'  '` → `{ title: titleIsRequired }`; `dueAt: null` → `{ date: pickDate }`.
   - `dueAt` con `getTime() === nowMs` → `{ date: dateMustBeFuture }`;
     `nowMs - 1` → igual; `nowMs + 1` → `{}`.
   - título vacío y `dueAt: null` → los dos campos.
3. **Documento.** `type` `''`/`'   '` y `name` `''` → `validation.required`.
   Tabla de fechas (cruza mes y año): `'2026-10-09'`, `' 2026-10-09 '`,
   `'2024-02-29'` válidas; `''`, `'09/10/2026'`, `'2026-2-3'`, `'2026-02-30'`,
   `'2026-02-29'`, `'2026-13-01'`, `'2026-10-32'` → `validation.invalidDate`.
4. **Peso.** `weight`:
   - `enterValidWeight`: `''`, `'abc'`, `'12abc'`, `'1e3'`, `'--1'`.
   - `weightRange`: `'0'`, `'0.0'`, `'-1'`, `'999.991'`, `'1000'`.
   - válidos (`{}`): `'72.5'`, `'72,5'`, `' 72.5 '`, `'.5'`, `'5.'`, `'999.99'`
     y `'1,000'` (la coma se normaliza a punto: es 1 kg).
   - `measuredAt` con la misma tabla de fechas que el documento.
   - `bodyCondition` válidos: `''`, `'  '`, `'1'`, `'9'`, `' 5 '`; inválidos
     (`bodyConditionRange`): `'0'`, `'10'`, `'5.5'`, `'abc'`, `'-1'`.
5. **parseDecimal.** `'72,5'` → 72.5, `' 72.5 '` → 72.5, `'5.'` → 5, `'.5'` → 0.5.
6. **Higiene del fichero** (lee `src/utils/form-rules.ts`): no importa `zod`, ni
   `react`, ni nada de `../screens/`, ni `heroui`; cada una de las once
   `labelKey` de la tabla de filas de más abajo aparece exactamente una vez como
   `labelKey: '<clave>'` (`grep -cF`).
7. **account-rules no cambia:** `git diff <H0> -- src/utils/account-rules.ts` vacío.

**Filas de `src/__tests__/ui-copy-table.ts` y fórmulas de
`src/__tests__/ui-language.test.ts` que añade R2** (cada fila `{ file:
'src/utils/form-rules.ts', key }`; las filas de las pantallas **siguen**
hasta que cada pantalla migre, y cada R de pantalla las quita):

| Bloque | Filas nuevas en `form-rules.ts` | Fórmula |
|---|---|---|
| `R5_HEALTH` | `weightLog.enterValidWeight`, `validation.weightRange`, `validation.bodyConditionRange`, `validation.invalidDate` | `+ 4 // #186 R2` |
| `R7_PROFILE` | `validation.required` | `+ 1 // #186 R2` |
| `R8_REMINDERS` | `addReminder.titleIsRequired`, `addReminder.pickDate`, `addReminder.dateMustBeFuture` | `+ 3 // #186 R2` |
| `R9_ADD_PET` | `addPet.nameIsRequired`, `addPet.chooseBirthDate`, `addPet.errorAgeRange` | `+ 3 // #186 R2` |
| `SCREEN_FILES` | (el fichero nuevo es un fichero distinto) | `+ 1 // #186 R2: utils/form-rules.ts` |

Los títulos de los `it` de `ui-language.test.ts` que llevan el total
(«resuelve las N ocurrencias normativas») se actualizan a base + delta en cada R
que mueve una fórmula.

**Rojo esperado** (`bunx jest src/utils/form-rules.test.ts src/__tests__/ui-language.test.ts`):

| Suite / `it` | Tipo |
|---|---|
| `src/utils/form-rules.test.ts` (todo) | la suite no arranca: `Cannot find module './form-rules'` |
| `ui-language.test.ts`: `it` que resuelven los bloques `R5_HEALTH`, `R7_PROFILE`, `R8_REMINDERS`, `R9_ADD_PET` y el que cuenta `SCREEN_FILES` | ENOENT al leer `src/utils/form-rules.ts` (y longitud) |

El implementer mide el número exacto de `it` rojos en `ui-language.test.ts` y lo
deja escrito en `progress/impl_mobile-forms-validation-global.md`; se espera
que sean los cinco de la tabla.

**Verde.** Se crea `form-rules.ts` con las constantes y los cuatro validadores.
Las suites quedan en verde.

**Sondas** (en el verde de R2, mutando `src/utils/form-rules.ts`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S2.1 | `> 999.99` pasa a `>= 999.99` en el rango del peso | `it` del peso (`'999.99'`) |
| S2.2 | La comprobación de fecha real se reduce a la regex (se quita `toISOString().slice(0, 10) === v`) | `it` de fechas de documento y de peso (`2026-02-30`) |
| S2.3 | `dueAt.getTime() <= nowMs` pasa a `<` | `it` del recordatorio (`=== nowMs`) |
| S2.4 | `validateAddPet` valida `approxAgeMonths` también en modo `birthDate` | `it` del modo inactivo |
| S2.5 | El recorte de `date` en `validateDocument` se quita | `it` de `' 2026-10-09 '` |

**Anclas:** `test -e src/utils/form-rules.ts` → 0; `grep -cF "from 'zod'" src/utils/form-rules.ts` → `0`;
`git diff <H0> -- src/utils/account-rules.ts | wc -l` → `0`.

### R3 — Un componente compartido pinta el mensaje de error de un campo

**EARS.** THE SYSTEM SHALL ofrecer `src/components/field-error-message.tsx` con
`export function FieldErrorMessage({ testID, issue }: { testID: string; issue?: RuleIssue | null })`.
WHEN `issue` es `null` o `undefined`, THE SYSTEM SHALL NOT renderizar ningún
nodo (ni `<testID>-error`, ni `-message`, ni `-message-row`). WHEN `issue` trae
un `labelKey`, THE SYSTEM SHALL renderizar el `FieldError` de `heroui-native`
(`testID` `<testID>-error`, con `isInvalid` verdadero) y dentro el `FormError`
existente (`testID` `<testID>-message`, fila `<testID>-message-row`, icono
`AlertCircle`) con el texto de `useTranslate()(issue.labelKey, issue.params)`.
El componente **no** declara `className`, ni hex, ni `StyleSheet`, e importa
`RuleIssue` como tipo de `../utils/account-rules`.

**Candados** (`src/components/__tests__/field-error-message.test.tsx`, nuevo;
envuelve en `LanguageProvider` con `initial` al estilo de
`form-error.test.tsx`):

1. Sin `issue` (`null` y `undefined`): `queryByTestId('f-error')`,
   `queryByTestId('f-message')` y `queryByTestId('f-message-row')` son `null`.
2. `{ labelKey: 'validation.required' }` en `es`: `f-message` tiene el texto
   `Este campo es obligatorio`; `within(f-message-row)` contiene
   `icon-alert-circle`; `f-error` existe.
3. Con parámetros, `{ labelKey: 'validation.tooShort', params: { min: 7 } }` en `es` → `Usa al menos 7 caracteres`.
4. En `en`, `{ labelKey: 'validation.required' }` → `This field is required`.
5. **Dentro de un `TextField`** de heroui con `isInvalid`: pinta el mensaje. **Fuera
   de cualquier `TextField`** (hermano de un `TextInput` crudo, dentro de un `View`):
   pinta el mensaje igual. Candado de que el componente sirve para los controles
   crudos (add-pet, add-reminder).
6. Un `rerender` de `issue` con valor a `null` retira `f-error`, `f-message` y
   `f-message-row`; y de `null` a un valor los añade.
7. Un `rerender` entre dos `labelKey` distintos cambia el texto (no queda el
   anterior).
8. **Higiene del fichero** (lee `src/components/field-error-message.tsx`):
   `grep -cF 'className'` = 0; sin `StyleSheet`; sin literal hex
   (`/#[0-9a-fA-F]{3,8}\b/`); contiene `from 'heroui-native'` con `FieldError`,
   `from './form-error'` y `import type` de `RuleIssue` desde
   `'../utils/account-rules'`.

**Rojo esperado** (`bunx jest src/components/__tests__/field-error-message.test.tsx`):

| Suite / `it` | Tipo |
|---|---|
| `field-error-message.test.tsx` (todo) | la suite no arranca: `Cannot find module '../field-error-message'` |

**Verde.** Se crea el componente. Los ocho candados en verde. **Supuesto de
entorno que los tests de pantalla no ven:** que `FieldError` de heroui-native
1.0.8, con la prop `isInvalid` local, pinta fuera de un `TextField`. El candado 5
lo mide; si fallara, el implementer lo declara en su reporte y se revisa P1.

**Sondas** (en el verde de R3, mutando `src/components/field-error-message.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S3.1 | Se quita `isInvalid={issue != null}` | candado 5 (fuera de `TextField`) y 2 |
| S3.2 | Se pasa `message={issue.labelKey}` en vez de traducir | candados 2, 3, 4 |
| S3.3 | Se quita `params` de la llamada a `t` | candado 3 |
| S3.4 | El `testID` del mensaje pasa de `${testID}-message` a `${testID}-msg` | candados 2, 3, 4 y 6 |
| S3.5 | Se añade `className="x"` al `FieldError` | candado 8 (`className`) |

**Anclas:** `grep -cF 'className' src/components/field-error-message.tsx` → `0`;
`grep -rln "field-error-message" src --include=*.tsx | grep -v test` → los
ficheros de pantalla que adopten el componente (R4–R7 y, si P2 = migrar, R8).

### R4 — Añadir mascota valida sus campos y muestra el mensaje debajo de cada uno

**EARS.** WHEN el usuario pulsa `add-pet-submit`, THE SYSTEM SHALL ejecutar
`validateAddPet` **antes** de `setSubmitting(true)`, con `{ name, ageMode,
birthDate, approxAgeMonths }`. WHILE exista un campo inválido, THE SYSTEM SHALL
NOT llamar a `createPet`, y SHALL pintar un `FieldErrorMessage` por campo
fallido: base `name-input` (nombre), `birth-date-field` (fecha, solo modo
`birthDate`), `approx-age-input` (edad, solo modo `months`). THE SYSTEM SHALL
colocar cada mensaje como **último hijo del `View className="gap-2"` del
campo**, hermano **posterior** del control (nunca dentro del `Pressable` de la
fecha). WHEN la validación pasa, THE SYSTEM SHALL limpiar los mensajes de campo
y seguir como hoy, y los errores de servidor y de red SHALL seguir saliendo en
`add-pet-error` sin cambio (el 400 sigue en `addPet.checkPetDetails`).
`breed` y `microchip` no muestran mensaje. THE SYSTEM SHALL conservar los
`maxLength` de los cuatro `TextInput` (120, 120, 3, 32).

**Candados** (`src/screens/add-pet/index.test.tsx`):

1. **Reescribe** el `it` `validates exactly one age mode...` (el que hoy espera
   `add-pet-error`): con nombre `''` y pulsar enviar, `name-input-message` dice
   `El nombre es obligatorio`, `createPet` no se llama, `add-pet-error` no existe y `add-pet-submit` sigue
   habilitado (el implementer mide el accesor de «deshabilitado» que expone el
   botón de heroui).
2. Modo `birthDate` sin fecha: `birth-date-field-message` dice
   `Elige una fecha de nacimiento`. Modo `months` con `'500'`:
   `approx-age-input-message` dice `Introduce una edad de 0 a 480 meses`.
3. Nombre vacío **y** fecha sin elegir a la vez: las dos filas
   (`name-input-message-row`, `birth-date-field-message-row`) existen juntas.
4. Un mensaje se queda tras corregir el campo y **desaparece en la pulsación
   siguiente**; con todo válido, `createPet` se llama una vez con el mismo
   `input` de hoy y el árbol ya no contiene ningún `*-message-row`.
5. Mensaje de un solo modo: en modo `months` no existe `birth-date-field-message`
   aunque no haya fecha; en modo `birthDate` no existe `approx-age-input-message`.
6. Colocación: el mensaje de cada campo vive en el `View` del campo, no dentro
   del control. Medido con `within(<View del campo>).getByTestId('<base>-message')`
   para los tres campos, y `within(<birth-date-field>).queryByTestId('birth-date-field-message')`
   es `null` (no está dentro del `Pressable`).
7. El 400 del servidor (`{ kind: 'invalid' }`) sigue en `add-pet-error` con
   `addPet.checkPetDetails` y **no** pinta ningún mensaje de campo.
8. `maxLength`: `name-input`, `breed-input` y `microchip-input` tienen
   `props.maxLength` 120, 120 y 32; `approx-age-input` 3.
9. En inglés (`LanguageProvider initial="en"`) el mensaje del nombre dice
   `Name is required`.

**Rojo esperado** (`bunx jest src/screens/add-pet/index.test.tsx`): candados 1–7
y 9 fallan por aserción (`getByTestId('name-input-message')` no existe); el 8 nace
verde (documenta el valor ya presente). El implementer mide el número exacto y
**cruza las filas rojas con los `it` previos** de la suite; si alguno nace verde
por un requisito previo, lo declara.

**Verde.** La pantalla llama a `validateAddPet`, guarda `fieldErrors` y monta los
tres `FieldErrorMessage`. Se **quitan** de la pantalla los tres literales
`t('addPet.nameIsRequired')`, `t('addPet.chooseBirthDate')` y
`t('addPet.errorAgeRange')`, y las **tres filas** de `R9_ADD_PET` con
`file: 'src/screens/add-pet/index.tsx'` (fórmula `- 3 // #186 R4`).

**Sondas** (en el verde de R4, mutando `src/screens/add-pet/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S4.1 | Se monta el mensaje de la fecha dentro del `Pressable` | candado 6 |
| S4.2 | Se llama a `validateAddPet` después de `setSubmitting(true)` | candado 1 (el botón queda deshabilitado tras una pulsación inválida) |
| S4.3 | Se para en el primer fallo (solo se pinta el nombre) | candado 3 |
| S4.4 | El 400 del servidor llama a `setFieldErrors` con la edad | candado 7 |
| S4.5 | `maxLength={120}` del nombre pasa a `{100}` | candado 8 |

**Anclas** (`src/screens/add-pet/index.tsx`): `grep -cF 'FieldErrorMessage'`
→ `4` (1 import + 3 usos); `grep -cF "t('addPet.nameIsRequired')"` → `0` (base 1);
`grep -cF "t('addPet.checkPetDetails')"` → `1`; `grep -cF 'testID="add-pet-error"'` → `1`;
`grep -cF 'maxLength'` → `4`.

### R5 — Añadir recordatorio valida título y fecha y muestra el mensaje debajo de cada uno

**EARS.** WHEN el usuario pulsa `add-reminder-submit`, THE SYSTEM SHALL ejecutar
`validateReminder` **antes** de `setSubmitting(true)`, con `{ title, dueAt, nowMs
}` donde `dueAt` es `combineDateAndTime(date, time)` si hay fecha y `null` si
no, y `nowMs` es `Date.now()` en esa pulsación. WHILE haya un campo inválido,
THE SYSTEM SHALL NOT llamar a `createReminder` y SHALL pintar un
`FieldErrorMessage` con base `title-input` (título) y `date-field` (fecha sin
elegir o pasada). THE SYSTEM SHALL colocar el del título como último hijo del
wrapper del título y el de la fecha como **último hijo del `View
className="flex-3 gap-1.5"`** de la columna de la fecha, hermano posterior del
`Pressable`. Los errores de servidor y de red SHALL seguir saliendo en
`add-reminder-error` sin cambio, incluido el 400 (`addReminder.dateMustBeFuture`).
`time-field` no muestra mensaje. THE SYSTEM SHALL conservar `maxLength={120}`
del título.

**Candados** (`src/screens/add-reminder/index.test.tsx`):

1. **Reescribe** los tres `it` de ~326, ~340 y ~355 (título vacío, sin fecha,
   fecha pasada): ahora `title-input-message` dice `El título es obligatorio`,
   `date-field-message` dice `Elige una fecha` y, con fecha pasada,
   `date-field-message` dice `La fecha debe ser futura`. En los tres,
   `createReminder` no se llama, `add-reminder-error` no existe y
   `add-reminder-submit` sigue habilitado.
2. Título vacío **y** fecha sin elegir: las dos filas existen a la vez.
3. Un mensaje se queda hasta la pulsación siguiente y se reemplaza; con todo
   válido, `createReminder` se llama una vez con el mismo payload de hoy y no
   queda ningún `*-message-row`.
4. **Los dos `it` del 400** (~719 y ~848, y la tabla de ~405-418) **no cambian**:
   `add-reminder-error` dice `La fecha debe ser futura` con `{ kind: 'invalid' }`
   y no hay ningún mensaje de campo.
5. Colocación: `within(columnaFecha).getByTestId('date-field-message')`, y el
   `Pressable` `date-field` **sigue teniendo exactamente dos hijos**
   (`field.children` de longitud 2: candado ya existente en esa suite, que debe
   seguir en verde sin tocarlo).
6. `title-input` tiene `props.maxLength` 120.
7. En inglés el mensaje del título dice `Title is required`.

**Rojo esperado** (`bunx jest src/screens/add-reminder/index.test.tsx`):
candados 1, 2, 3 y 7 fallan por aserción; el 4, el 5 y el 6 nacen verdes
(documentan lo que **debe seguir** igual). El implementer cruza las filas rojas
con los `it` previos y declara cualquiera que nazca verde.

**Verde.** La pantalla llama a `validateReminder`, guarda `fieldErrors` y monta
los dos `FieldErrorMessage`. Se **quitan** `t('addReminder.titleIsRequired')`,
`t('addReminder.pickDate')` y **uno** de los dos
`t('addReminder.dateMustBeFuture')` (el del cliente; el de la rama `invalid` del
servidor se queda), y las filas correspondientes de `R8_REMINDERS`
(`titleIsRequired`, `pickDate` y una de las dos de `dateMustBeFuture`; fórmula
`- 3 // #186 R5`).

**Sondas** (en el verde de R5, mutando `src/screens/add-reminder/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S5.1 | El mensaje de la fecha se monta dentro del `Pressable` | candado 5 (los dos hijos) |
| S5.2 | El 400 del servidor llama a `setFieldErrors({ date: ... })` en vez de `setFormError` | candado 4 |
| S5.3 | Se valida después de `setSubmitting(true)` | candado 1 (el botón queda deshabilitado tras una pulsación inválida) |

**Anclas** (`src/screens/add-reminder/index.tsx`): `grep -cF 'FieldErrorMessage'`
→ `3`; `grep -cF "t('addReminder.dateMustBeFuture')"` → `1` (base 2);
`grep -cF "t('addReminder.titleIsRequired')"` → `0`; `grep -cF 'testID="add-reminder-error"'` → `1`.

### R6 — Subir documento valida tipo, nombre y fecha real y muestra el mensaje debajo de cada uno

**EARS.** WHEN el usuario pulsa el botón de subir, THE SYSTEM SHALL ejecutar
`validateDocument` con `{ type, name, date }` **antes** de abrir el selector de
archivo, y WHILE haya un campo inválido SHALL NOT abrir el selector ni llamar al
servidor, y SHALL pintar un `FieldErrorMessage` por campo fallido con base
`docs-type-input`, `docs-name-input` y `docs-date-input`, **dentro** del
`TextField` de cada uno, después del `Input`; cada `TextField` pasa
`isInvalid={Boolean(fieldErrors.<campo>)}` para marcar el borde. `docs-vet-input`
no muestra mensaje. THE SYSTEM SHALL aceptar `2026-02-30` como **inválida** (fecha
real, como el DTO). WHEN la validación pasa, THE SYSTEM SHALL enviar `date` ya
recortada (como hoy). El `docs.errorInvalidForm` y `'invalid-form'` SHALL quedar
**solo** para el 400 del servidor. THE SYSTEM SHALL conservar `maxLength` 40,
120 y 120 de tipo, nombre y vet.

**Candados** (`src/screens/docs-upload-form/index.test.tsx`):

1. **Reescribe `#185 R9`** (el `it.each` de tres casos: tipo en blanco, nombre
   vacío, fecha `09/10/2026`): en vez del texto genérico en `docs-action-error`,
   cada caso asevera el mensaje en su campo (`docs-type-input-message` =
   `Este campo es obligatorio`, `docs-name-input-message` = `Este campo es
   obligatorio`, `docs-date-input-message` = `Escribe una fecha válida con formato AAAA-MM-DD`),
   y `docs-action-error` no existe, el selector de archivo no se
   abre, el botón de subir sigue habilitado y `uploadChildren()` es
   `['docs-upload-form']` (sin `docs-action-error`).
2. Fecha con calendario falso `2026-02-30`: `docs-date-input-message` existe y el
   selector no se abre.
3. Tipo, nombre y fecha mal a la vez: las tres filas existen juntas.
4. `isInvalid`: con tipo vacío, el `TextField` de `docs-type-input` queda marcado
   inválido (el `Input` expone el estado de heroui; el implementer lo mide con
   `props.isInvalid` o el atributo que exponga heroui-native 1.0.8) y el de
   `docs-vet-input` no.
5. Con todo válido (fecha `' 2026-10-09 '`) se llama al servidor una vez y con
   `date: '2026-10-09'`, y no queda ningún `*-message-row`.
6. El 400 del servidor (`{ kind: 'invalid' }`) sigue en `docs-action-error` con
   `docs.errorInvalidForm` y no pinta mensajes de campo.
7. **`#185 R6`** (`field.children` toHaveLength(2)), **`#185 R5`** (el orden y
   los seis hijos del formulario) y **`#185 R8`** (conteo de clases: labels 8,
   inputs 4) **no cambian y siguen verdes**: el `FieldErrorMessage` no deja nodo
   mientras no hay mensaje.
8. `maxLength`: 40, 120 y 120.

**Rojo esperado** (`bunx jest src/screens/docs-upload-form/index.test.tsx`):
candados 1, 2, 3, 4 y 5 fallan por aserción (en el 5, la fecha con espacios
**hoy ya pasa** el regex tras `trim()`: el implementer cruza y declara si nace
verde); 6, 7 y 8 nacen verdes.

**Verde.** La pantalla llama a `validateDocument`, guarda `fieldErrors` y monta
los tres `FieldErrorMessage` con `isInvalid` en los tres `TextField`. Se quita la
condición inline (`!type.trim() || !name.trim() || !/^\d{4}-\d{2}-\d{2}$/...`) y
la rama que la usaba. La fila `docs.errorInvalidForm` de `R7_PROFILE` **se queda**
(el 400 aún la usa). Sin cambio de fórmulas en R6.

**Sondas** (en el verde de R6, mutando `src/screens/docs-upload-form/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S6.1 | La rama `invalid` del servidor llama a `setFieldErrors` | candado 6 |
| S6.2 | `<FieldErrorMessage>` se monta fuera del `TextField` | candado 7 (`#185 R6`, dos hijos) o 1 |
| S6.3 | El `TextField` de `docs-type-input` pierde `isInvalid` | candado 4 |
| S6.4 | La fecha se valida sin recortar | candado 5 |

**Anclas** (`src/screens/docs-upload-form/index.tsx`): `grep -cF 'FieldErrorMessage'`
→ `4`; `grep -cF 'isInvalid={Boolean(fieldErrors.'` → `3`; `grep -cF 'invalid-form'`
→ `3` (el tipo, el mapa de textos y el 400; base 4); `grep -cF 'testID="docs-action-error"'` → `1`.

### R7 — Registrar peso valida los tres campos y nunca muestra el texto del servidor

**EARS.** WHEN el usuario pulsa `weight-submit`, THE SYSTEM SHALL ejecutar
`validateWeight` **antes** de `setSubmitting(true)` y, WHILE haya un campo
inválido, SHALL NOT llamar a `createWeight` y SHALL pintar un
`FieldErrorMessage` por campo fallido (bases `weight-input`, `weight-date-input`,
`weight-bc-input`, dentro de su `TextField`, con `isInvalid` en el `TextField`).
WHEN la validación pasa, THE SYSTEM SHALL enviar `weightKg` con `parseDecimal`,
`measuredAt` recortado y `bodyCondition` como `Number` del texto recortado, y
solo cuando no esté en blanco. THE SYSTEM SHALL NOT mostrar jamás el `message`
crudo de un 400: en la rama `case 'validation':` un error con `path ===
'measuredAt'` y `message === MEASURED_AT_IN_FUTURE_MESSAGE` pasa a
**mensaje de campo** `weightLog.dateCannotBeAfterToday` en `weight-date-input`, y
**cualquier otro** error del 400 pasa a `weight-form-error` con
`validation.checkDetails`. Si llegan los dos, salen los dos. Los demás casos
(`forbidden`, `unreachable`, `error`, `missing-config`, la excepción y
`unauthorized`) no cambian. La rama `case 'validation':` conserva ese literal en
el fuente (hay un candado que lo lee).

**Candados** (`src/screens/weight-log/index.test.tsx`):

1. **Reescribe** `rejects an invalid weight without calling the API`: con
   `not-a-number`, `weight-input-message` dice `Introduce un peso válido`,
   `createWeight` no se llama, `weight-form-error` no existe y `weight-submit`
   sigue habilitado.
2. Fila nueva por regla (it.each): `'0'` → `weight-input-message` =
   `El peso debe ser mayor que 0 y como máximo 999,99 kg`; `'1000'` → ídem;
   `'12abc'` → `Introduce un peso válido`; `'72,5'` → **válido**, `createWeight`
   recibe `weightKg: 72.5`.
3. Fecha: `'2026-02-30'` → `weight-date-input-message` = `Escribe una fecha válida
   con formato AAAA-MM-DD`; `' 2026-08-20 '` → válido y `measuredAt:
   '2026-08-20'` en el payload.
4. Condición corporal: `'10'` → `weight-bc-input-message` = `La condición corporal es
   un número entero del 1 al 9`; en blanco → válido y sin `bodyCondition` en el
   payload; `'abc'` ya no llega a la API como `NaN`.
5. Los tres campos mal a la vez: las tres filas existen juntas.
6. **Reescribe** `joins backend validation messages...` (~455): con errores
   `[{ path: 'weightKg', message: 'Weight is too high' }, { path: 'measuredAt',
   message: 'measuredAt is too far in the future' }]`, `weight-date-input-message`
   dice `La fecha no puede ser posterior a hoy` y `weight-form-error` dice
   `Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.`, y **ningún**
   nodo contiene `Weight is too high`.
7. **Reescribe** `keeps a malformed-date validation message raw` (~478): con
   `[{ path: 'measuredAt', message: 'Invalid ISO date' }]`, `weight-form-error`
   dice el genérico y ningún nodo contiene `Invalid ISO date`. Un 400 solo con el
   error de fecha futura pinta **solo** el mensaje de campo y **no** crea
   `weight-form-error`.
8. **Reescribe** las dos filas del `it.each` de `#169 R11` (~985): la de
   `peso no numérico` asevera `weight-input-message` (y que `weight-form-error` no
   existe) y la de `validation` asevera el genérico. Las demás filas no cambian;
   el candado que lee `case 'validation':` y la rama `ok` sigue verde.
9. En inglés, `weight-input-message` para `0` dice `Weight must be above 0 and at
   most 999.99 kg`.

**Rojo esperado** (`bunx jest src/screens/weight-log/index.test.tsx`): los
candados 1, 2, 3, 4, 5, 6, 7, 8 y 9 fallan por aserción; el implementer cruza las
filas rojas con los `it` previos (en la fila `'72,5'` de 2, el payload `72`
actual falla por valor).

**Verde.** La pantalla llama a `validateWeight`, usa `parseDecimal`, recorta
`measuredAt`, guarda `fieldErrors`, monta tres `FieldErrorMessage` con `isInvalid`
en los `TextField`, y reescribe `case 'validation':` como se describe. Se quitan
`parseFloat`, el `join('\n')` y `t('weightLog.enterValidWeight')`; la fila de
`R5_HEALTH` con `file: 'src/screens/weight-log/index.tsx'` y clave
`weightLog.enterValidWeight` se **quita** (`- 1`) y se **añade**
`validation.checkDetails` en ese fichero (`+ 1`; fórmula `- 1 + 1 // #186 R7`).
`weightLog.dateCannotBeAfterToday` pasa de `t(...)` a `labelKey: '...'` y su fila
no cambia.

**Sondas** (en el verde de R7, mutando `src/screens/weight-log/index.tsx`):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S7.1 | La rama `validation` vuelve a unir los `message` crudos | candados 6, 7 y 8 (fila `validation`) |
| S7.2 | `weightKg` se manda con `parseFloat(weightText)` | candado 2 (`72,5`) |
| S7.3 | `measuredAt` se manda sin recortar | candado 3 |
| S7.4 | El error de fecha futura va a `weight-form-error` en vez de al campo | candados 6 y 7 |
| S7.5 | `bodyCondition` se manda con `Number(bodyConditionText)` sin guardia de blanco | candado 4 |
| S7.6 | Se valida después de `setSubmitting(true)` | candado 1 (el botón queda deshabilitado) |

**Anclas** (`src/screens/weight-log/index.tsx`): `grep -cF 'parseFloat'` → `0`
(base 1); `grep -cF "join('\\n')"` → `0` (base 1); `grep -cF 'FieldErrorMessage'`
→ `4`; `grep -cF "t('validation.checkDetails')"` → `1`;
`grep -cF "case 'validation':"` → `1`; `grep -cF 'testID="weight-form-error"'` → `1`.

### R8 — Las cuatro pantallas de cuenta usan el componente compartido (según P2)

> Este requisito es **condicional a la pregunta P2**. La recomendación es
> migrar. Si el humano responde «dejar tal cual», R8 se elimina antes de aprobar
> y el candado de R9 (apartado 2) queda con la lista de excepciones de las cuatro
> pantallas.

**EARS.** THE SYSTEM SHALL sustituir en `login`, `register`, `forgot` y
`reset-password` cada bloque `<FieldError testID="<base>-error">{...&& <FormError
testID="<base>-message" .../>}</FieldError>` por
`<FieldErrorMessage testID="<base>" issue={fieldErrors.<campo>} />`, con la
**misma** base de `testID` que el control, de modo que los doce `testID`
`<base>-error`, `<base>-message` y `<base>-message-row` **no cambian**. THE SYSTEM
SHALL conservar la prop `isInvalid={Boolean(fieldErrors.<campo>)}` de cada
`TextField` (el borde rojo). Tras R8, ninguna de las cuatro pantallas importa
`FieldError` de `heroui-native`.

**Candados.**

1. **Ningún test de #183 ni de #172 cambia.** `git diff <H0> --stat -- 'src/screens/login/index.test.tsx' 'src/screens/register/index.test.tsx' 'src/screens/forgot/index.test.tsx' 'src/screens/reset-password/index.test.tsx' 'src/__tests__/account-screens-polish.test.ts'`
   solo puede mostrar el cambio de la restricción de par (cero cambios
   esperados). Las suites de las cuatro pantallas siguen en verde, y el regex
   `/^register-.+-message-row$/` sigue casando **siete** filas.
2. **`#172 R10`** (`isInvalid={Boolean(fieldErrors.` = 7 en `register`) sigue
   verde sin tocarlo.
3. Un candado nuevo en `src/__tests__/forms-validation-global.test.ts` (el
   fichero de R9): ninguna de las cuatro pantallas importa `FieldError`, y `grep -cF 'FieldErrorMessage'` en ellas →
   `login` 3, `register` 8, `forgot` 2, `reset-password` 3 (un import más los
   usos: 2, 7, 1, 2).

**Rojo esperado:** el candado 3 falla por aserción (`FieldErrorMessage` no
aparece). Los candados 1 y 2 **nacen verdes** y se declaran como tales: son los
que garantizan que la migración no cambia el árbol.

**Verde.** Se migran los doce bloques. **Sin cambios de test ajenos al
candado 3**, que es la prueba de que el refactor es transparente.

**Sondas** (en el verde de R8):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S8.1 | En `register`, la base de `register-phone` pasa a `register-phone-x` | las suites de `register` que asevera ese `testID` y el regex de siete filas |
| S8.2 | En `login`, se quita `issue={fieldErrors.email}` | la suite de `login` (mensaje del correo) |
| S8.3 | En `forgot`, se reinstala `import { FieldError }` | candado 3 (conteo y import) |

**Anclas:** `grep -rln "FieldError" src --include=*.tsx | grep -v "/__tests__/" | grep -v test`
→ solo `src/components/field-error-message.tsx` (base: 4 pantallas, B11).

### R9 — La carta de UI fija el componente y la regla de no mostrar texto crudo

**EARS.** THE SYSTEM SHALL ampliar `docs/ui-guidelines.md` con una
`## Enmienda #186 — Errores de validación de formularios` que (1) añada
`field-error-message.tsx` a la lista de componentes compartidos del punto 4 de
§Componentes compartidos, con su firma y su esquema de `testID`; (2) fije la
regla «todo campo de texto que valide en cliente pinta su mensaje con
`FieldErrorMessage`, debajo del control, y la validación se hace al pulsar
enviar con reglas puras de `src/utils/`»; (3) fije «el texto crudo de un error del
servidor no se muestra nunca en pantalla: un 400 cae en `validation.checkDetails`
o en un mensaje de campo traducido»; (4) corrija el corolario «El backend sigue
devolviendo validaciones en inglés...» que hoy cita `login-error`,
`register-*-error`, `weight-form-error` y `reset-error` como pantallas que
muestran el texto del servidor, que tras #183 y #186 es falso (se mantienen las
advertencias nutricionales del backend, que sí se muestran tal cual); y (5)
termine con la casilla `- [ ] Enmienda #186 aprobada por humano`. THE SYSTEM SHALL
traer un fichero de candados `src/__tests__/forms-validation-global.test.ts`.

**Candados** (`src/__tests__/forms-validation-global.test.ts`, nuevo; lee
`docs/ui-guidelines.md` con `readFileSync(join(process.cwd(), '..', 'docs',
'ui-guidelines.md'))` como hacen `design-drift.test.ts` y
`account-screens-polish.test.ts`):

1. `#186 R9: la carta lista field-error-message.tsx` entre los componentes
   compartidos (regex sobre el texto del punto 4).
2. `#186 R9: la carta trae la enmienda y su casilla`: la cabecera
   `## Enmienda #186 — Errores de validación de formularios` y una casilla con la
   forma `- [ xX] Enmienda #186 aprobada por humano` (regex tolerante `[ xX]`,
   para que no se ponga rojo cuando el humano la firme).
3. `#186 R9: la carta fija las dos reglas` (mensaje por campo con el componente,
   y texto crudo del servidor nunca en pantalla), por frase literal.
4. `#186 R9: el corolario del backend ya no cita login-error ni weight-form-error
   como pantallas que muestran el texto del servidor`: la frase vieja
   `Se ve en \`login-error\`, \`register-*-error\`, \`weight-form-error\` y
   \`reset-error\`` ya **no** aparece.
5. **Higiene de `FieldError`.** El árbol de producción (`src/**/*.tsx` sin tests)
   importa `FieldError` de `heroui-native` **solo** desde
   `src/components/field-error-message.tsx` (si P2 = migrar), o desde ese fichero
   **más** las cuatro pantallas de cuenta (si P2 = dejar). El test lista los
   ficheros con `readdirSync` recursivo, y un segundo `it` comprueba que el
   escáner encuentra al menos esos ficheros (universo mínimo medido).
6. **Cada pantalla de esta feature usa el componente.** `add-pet`, `add-reminder`,
   `docs-upload-form` y `weight-log` contienen `FieldErrorMessage` (import y
   usos): cuentas por contenido, `grep -cF` 4, 3, 4 y 4.

**Rojo esperado** (`bunx jest src/__tests__/forms-validation-global.test.ts`):
1, 2, 3 y 4 fallan por aserción; 5 (`FieldError` solo en el componente + 4
pantallas) **nace verde** en la variante P2 = dejar y **rojo** en la variante
P2 = migrar hasta que R8 lo cumpla; 6 nace verde si R4–R7 ya están (se escribe
**después** de ellas) o rojo si el orden se altera. El implementer declara cuál
variante aplica.

**Orden de commits.** R9 va **después** de R4–R8 para que las cuentas del
candado 6 cuadren. Las cuentas de 5 y 6 se reconstruyen con `grep -cF` en H0 +
los commits previos (cuentas de handoff encadenadas).

**Verde.** Se escribe la enmienda en `docs/ui-guidelines.md` y se actualiza el
corolario. **La enmienda se marca como pendiente de firma del humano**; el
implementer no marca la casilla.

**Sondas** (en el verde de R9):

| Sonda | Mutación | Rojos esperados |
|---|---|---|
| S9.1 | En `docs/ui-guidelines.md`, se borra la línea de la casilla | candado 2 |
| S9.2 | Se restituye la frase vieja del corolario | candado 4 |
| S9.3 | En `add-reminder/index.tsx` se importa `FieldError` de `heroui-native` | candado 5 |
| S9.4 | En `weight-log/index.tsx` se quita el import de `FieldErrorMessage` | candado 6 |

**Anclas:** `grep -cF '## Enmienda #186' docs/ui-guidelines.md` → `1` y
`grep -cF 'Enmienda #186 aprobada por humano' docs/ui-guidelines.md` → `1` (base 0). `grep -cF 'field-error-message.tsx' docs/ui-guidelines.md`
→ al menos `1`.

### R10 — Prueba de humo humana en dev build de Android

**EARS.** WHEN las R1–R9 están en verde y el reviewer ha aprobado, THE SYSTEM
SHALL pasar por una prueba de humo del humano en un **dev build de Android en su
PC** (no en la VPS, no en Expo Go), que cubre los cuatro formularios:

1. **Añadir mascota:** nombre vacío y fecha sin elegir, pulsar guardar: aparece
   «El nombre es obligatorio» bajo el nombre y «Elige una fecha de nacimiento»
   bajo la fecha, con el teclado abierto y sin salto de layout que oculte el botón.
2. **Añadir recordatorio:** título vacío y fecha pasada: dos mensajes, uno bajo
   cada campo; el de la fecha no desplaza al selector de hora.
3. **Subir documento:** `2026-02-30` en la fecha: mensaje de fecha inválida
   bajo el campo y borde rojo; tipo vacío: borde rojo y mensaje.
4. **Registrar peso:** `0` y `72,5`: el primero da el mensaje de rango, el
   segundo se acepta.
5. **Cambio de idioma:** con la app en inglés, los mismos mensajes salen en
   inglés.
6. Un error de red (modo avión) sigue saliendo como aviso de formulario, no como
   mensaje de campo.

**Casilla del humano** (gate propio, distinto del de la spec y del de la
enmienda de la carta):

- [ ] Prueba de humo en dev build de Android hecha por el humano (fecha: ____)

El reviewer **no marca esta casilla**: puede aprobar el código, y la feature no
pasa a `done` hasta que el humano cierre R10 (CLAUDE.md, reglas del leader).

## Deltas de candados

| Candado | Fichero | R1 | R2 | R4 | R5 | R7 | Final |
|---|---|---|---|---|---|---|---|
| Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx` | `+ 4` | | | | | `B_KEYS + 4` |
| `R5_HEALTH` (fórmula y título) | `src/__tests__/ui-language.test.ts` | | `+ 4` | | | `- 1 + 1` | `B_HEALTH + 4` |
| `R7_PROFILE` (fórmula y título) | ídem | | `+ 1` | | | | `B_PROFILE + 1` |
| `R8_REMINDERS` (fórmula y título) | ídem | | `+ 3` | | `- 3` | | `B_REMINDERS` (sin cambio neto) |
| `R9_ADD_PET` (fórmula y título) | ídem | | `+ 3` | `- 3` | | | `B_ADDPET` (sin cambio neto) |
| `SCREEN_FILES` | ídem | | `+ 1` | | | | `B_FILES + 1` |
| Filas de `ui-copy-table.ts` | `src/__tests__/ui-copy-table.ts` | | +4 `R5`, +1 `R7`, +3 `R8`, +3 `R9` (util) | −3 `R9` (add-pet) | −3 `R8` (add-reminder) | −1 y +1 `R5` (weight-log) | neto +5 |
| §2.N en el design de idioma | `specs/mobile-ui-language/design.md` | +1 sección, 4 filas | | | | | |
| `#172 R10` (siete `isInvalid` de registro) | `src/__tests__/account-screens-polish.test.ts` | | | | | | sin cambio |
| `#172 R20` (clases) | ídem | | | | | | sin cambio |
| design-drift, legibility, consistency, `heroui-text-size-merge`, lista `text-13` | `src/__tests__/*` | | | | | | sin cambio (ninguna clase nueva) |
| `#185 R5`, `R6`, `R8` (formulario de documentos) | `src/screens/docs-upload-form/index.test.tsx` | | | | | | sin cambio |
| `#185 R9` (tres casos de formulario inválido) | ídem | | | | | | **reescrito en R6** |

## Coordinación y reparto de ficheros

El reparto protege el árbol de trabajo de cada feature, no la historia: caduca
cuando una feature se mergea.

| Feature | Estado | Qué toca de lo mismo | Orden |
|---|---|---|---|
| **#177** | `pending`, sin mergear | Las cuatro pantallas de cuenta y `pairing-submit`. R8 de esta spec edita esas cuatro pantallas. | **#186 espera a que #177 se mergee.** Después `main` se mergea en la branch de #186 (merge, no rebase: la trazabilidad guarda hashes). Sin #177 mergeada, R4–R7 pueden empezar, pero **R8 no**. |
| **#184** | `pending` (Perfil) | Solo deuda de tests de Perfil. **No** hay pantalla de edición de perfil: ver P3. | Sin solape de ficheros. |
| **#188** | `pending` (pairing) | `activation-code-input` en `src/screens/pairing/index.tsx`. Esta spec **no** lo toca (P4). | Si #188 quiere un mensaje de campo para el código, usa `FieldErrorMessage` y `form-rules.ts`: este módulo ya está en `main` o lo estará. |
| **#189** | `pending` (geocercas) | `geofence-editor-name` en `src/screens/geofence-editor/index.tsx`. Esta spec **no** lo toca. | Ídem. |
| **#191** | `pending`, **después** de #186 | Alta de mascota en dos pasos: reusa `FieldErrorMessage` y `validateAddPet` (o sus reglas). | La API de `FieldErrorMessage({ testID, issue })` y los nombres de campo de `validateAddPet` son **contrato**: un cambio de firma después de #186 obliga a enmendar #191. |

Ficheros que esta feature es la **única** en tocar: `src/components/field-error-message.tsx`,
`src/utils/form-rules.ts`, `src/utils/form-rules.test.ts`,
`src/components/__tests__/field-error-message.test.tsx`,
`src/__tests__/forms-validation-global.test.ts`. Ficheros compartidos en los que
esta feature solo **añade**: `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts`,
`src/__tests__/ui-language.test.ts`, `src/providers/__tests__/language-provider.test.tsx`,
`docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md`.

## Fuera de alcance

Cada viñeta es una delimitación de esta feature, no una feature pendiente.

- **Validación en vivo** (al escribir o al salir del campo). Los mensajes se
  evalúan al pulsar enviar y se quedan hasta el siguiente envío, como #183.
- **Pantalla de edición de perfil.** No existe en el árbol (`profile/index.tsx`
  muestra datos, no edita). Si se quiere, es una feature propia. Ver P3.
- **`geofence-editor` y `pairing`.** El botón de guardar o de vincular ya está
  desactivado hasta que el texto es válido (`isDisabled`) y el `maxLength` ya
  iguala al DTO. No hay un mensaje que mostrar. Ver P4.
- **`meal-schedule`.** No tiene campos de texto, solo un selector de hora.
- **Errores de servidor y de red** (`forbidden`, `unreachable`, 5xx,
  `unauthorized`, 400 de mascota/recordatorio/documento). Siguen como aviso de
  formulario; solo weight-log pasa del texto crudo al genérico (R7).
- **La regla «fecha demasiado futura» del peso en el cliente.** La decide el
  servidor (depende del reloj del servidor); el cliente solo traduce su
  respuesta.
- **Precisión decimal del peso** (más de dos decimales): el DTO no la limita.
- **Cambiar los DTO** del backend o su texto de error.
- **Borde rojo en `TextInput` crudos** (add-pet, add-reminder). Ver P6.
- **Añadir zod al móvil.** El módulo puro copia las reglas, como #183.
- **Mover los tipos `RuleIssue` y `FieldIssues`** de `account-rules.ts`. Se
  importan como tipo desde donde están.

## Preguntas abiertas

Ninguna de las tres primeras se decide en esta spec: cada una trae la
recomendación como **valor por defecto marcado**, y la respuesta es del humano.

- **P1 — ¿Qué forma tiene el componente global?**
  - **A (recomendada, la que escribe esta spec): primitivas más un componente
    fino.** `FieldErrorMessage({ testID, issue })` pinta el mensaje; el control
    (`TextField`, `TextInput`, `Pressable`) lo sigue poniendo la pantalla.
    Consecuencia: sirve para controles crudos y para `TextField`, no obliga a
    reescribir layouts, pero cada pantalla sigue montando su `TextField`.
  - **B: un `FormField` completo** (etiqueta + control + mensaje). Consecuencia:
    más uniformidad, pero reescribe los cuatro layouts distintos (add-pet usa
    `FieldLabel` y `TextInput`, docs usa heroui `Label`, el recordatorio mide
    columnas `flex-3`), mueve clases y tropieza con los candados de clases
    (#185 R8, #172 R20, `text-13`), con riesgo alto.
  - **C: solo una `Text` con el mensaje (sin `FieldError` de heroui).**
    Consecuencia: no hereda `isInvalid` del `TextField`, y se pierde la
    uniformidad con #183.
- **P2 — ¿Migran las cuatro pantallas de #183 al componente?**
  - **A (recomendada, R8 de esta spec): migrar.** Un solo sitio donde cambia el
    aspecto del error. Consecuencia: toca `login`, `register`, `forgot` y
    `reset-password`, que #177 también toca, así que **R8 espera a #177 mergeada**
    y se hace último. Los tests no cambian (mismo esquema de `testID`).
  - **B: dejarlas tal cual.** Consecuencia: R8 se elimina, la carta tiene que
    nombrar el patrón antiguo como excepción (R9, candado 5), y hay dos
    implementaciones del mismo aviso.
- **P3 — ¿Qué se hace con «editar perfil»?** La premisa de la petición decía
  que dependía de #184, pero #184 es solo deuda de tests y **no hay pantalla
  de edición** de perfil. Consecuencia de dejarlo fuera (lo que hace esta spec):
  el componente y `form-rules.ts` quedan listos para cuando exista la
  pantalla. Alternativa: abrir una feature propia de «editar perfil» (campos,
  DTO `update-profile.dto.ts`, pantalla) que reuse `FieldErrorMessage`;
  añadirla aquí agrandaría esta feature con una pantalla nueva.
- **P4 — `geofence-editor` y `pairing`: ¿se mantiene el botón desactivado?**
  Defecto: sí (ya iguala al DTO). Si se prefiere un mensaje al pulsar, se
  añaden R propios y se toca el trabajo de #188 y #189 (sus lienzos).
- **P5 — Coma decimal en el peso.** Defecto: `72,5` se acepta como 72.5 (teclado
  en español). Alternativa: rechazarla con el mensaje de peso.
- **P6 — Borde rojo en los `TextInput` crudos de add-pet y add-reminder.**
  Defecto: no (solo el mensaje), para no añadir clases nuevas que el
  grep-clean, design-drift y consistency tendrían que cubrir. Si se quiere
  borde rojo, hace falta una clase nueva y su candado.
- **P7 — Redacción del copy** de las cuatro claves (§Copy nuevo): ¿se aprueba
  tal cual en `es` y `en`? (Una nota: `La condición corporal es un número entero
  del 1 al 9` usa la palabra del catálogo existente, `Condición corporal`.)

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
