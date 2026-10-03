---
feature: "mobile-owner-timezone-dates"
status: approved     # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-owner-timezone-dates]] (#90)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[../../docs/conventions|conventions]] §Tests (prefijo `#90 R<n>`, paréntesis
> en filtros de jest, esperas sobre el árbol renderizado).
>
> **Líneas y símbolos verificados contra el worktree `Pet-Tracker-wt-backend`,
> branch `feature/90-mobile-owner-timezone-dates`, HEAD = base `origin/main`
> `29689598`.** Rutas relativas a `mobile-pet-tracker/` salvo que digan
> `backend-pet-tracker/`. Las líneas se desplazan con la primera edición: cada
> sitio se identifica **además** por el título del test o el nombre del símbolo.
>
> Investigación de base: `progress/explore_mobile-owner-timezone-dates.md`. Toda
> cita de ahí que aparece aquí se volvió a comprobar contra el árbol.

---

## 0. Hechos que esta spec da por establecidos

- **F1 — La ruta del perfil es `GET /v1/me`, no `/v1/users/me`.** El enunciado de
  #90 en `feature_list.json` está mal en ese punto. Verificado:
  `backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts:40`
  (`@Controller('me')`) + `src/main.ts:6` (`setGlobalPrefix('v1')`); el cliente
  móvil ya la llama así: `src/api/users.ts:50` (`getJson(baseUrl, '/me', …)`).
- **F2 — En pesos, owner y usuario logueado coinciden en toda petición que pueda dar
  201.** `POST /v1/pets/:petId/weights` lleva `@RequirePetRole('owner')`
  (`backend-pet-tracker/src/modules/health/infrastructure/weights.controller.ts:35-36`);
  e2e `test/health-weights.e2e-spec.ts:484-498` (`family` → 403). En el alta de
  mascota, `birthDate` se valida contra el **requester**
  (`backend-pet-tracker/src/modules/pets/application/use-cases/create-pet.use-case.ts:34`,
  `requesterLocalDay`). La ambigüedad «mascota compartida» del enunciado no existe
  en ninguna de las dos pantallas.
- **F3 — `errors[].path` viaja como string en el cable.** El controller construye
  `[{ path: ['measuredAt'], message }]` (`weights.controller.ts:52-56`) y
  `validationError` lo aplana con `issue.path.join('.')` (`:86-97`). El e2e de #89
  asevera el cuerpo exacto: `errors: [{ path: 'measuredAt', message: 'measuredAt is
  too far in the future' }]` (`test/health-weights.e2e-spec.ts:423-431`). El tipo
  móvil `FieldError = { path: string; message: string }` (`src/api/types.ts:5-8`)
  es correcto.
- **F4 — Una fecha mal formada llega con el MISMO `path`.** `measuredAt` es
  `IsoDateSchema` (`backend-pet-tracker/src/modules/health/application/dto/weight.dto.ts:9`)
  = `z.string().refine(isIsoDate, 'Invalid ISO date')`
  (`.../dto/iso-date.ts:3`). Como `weight-date-input` es texto libre sin validación
  local (`src/app/(tabs)/weight-log.tsx:184-190`), `2026-13-45` produce
  `{ path: 'measuredAt', message: 'Invalid ISO date' }` (caso e2e `'invalid-date'`,
  `health-weights.e2e-spec.ts:361`). **Discriminar solo por `path` pintaría «la
  fecha no puede ser posterior a hoy» sobre un error de formato** → precisión P1
  de §Decisiones.
- **F5 — El texto del 400 de fecha futura es contrato byte a byte.**
  `'measuredAt is too far in the future'`
  (`backend-pet-tracker/src/modules/health/domain/errors/weight.errors.ts:3`),
  conservado por decisión de #89
  (`specs/dto-dates-owner-timezone/requirements.md` §Fuera de alcance, «Texto del
  mensaje de pesos») y aseverado por su e2e R5.
- **F6 — La fixture de zonas se reproduce en este host** (Node `v20.20.2`, ICU
  completo, TZ `UTC`): para el instante `2026-09-17T23:30:00Z`,
  `Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit',
  day: '2-digit' }).formatToParts(...)` da `2026-09-18` en `Pacific/Kiritimati` y
  `2026-09-17` en `Pacific/Pago_Pago`; `'Not/A/Zone'` y `''` lanzan `RangeError`;
  `2026-01-05T12:00:00Z` en `UTC` da `2026-01-05` (cero-relleno). Nadie fija `TZ`
  en `package.json`, `test/jest-setup.js`, `init.sh` ni `.github/workflows/ci.yml`.
- **F7 — Hoy no hay zona en memoria sin red.** `useAuth` expone
  `{ status, token, signIn, signOut }`; `weight-log.tsx` importa `useAuth`,
  `useSelectedPet`, `useTranslate` (`:24-26`) y no consume `getMe`. Único
  consumidor de `userKeys.me()` (`src/api/query-keys.ts:43-45`):
  `src/screens/profile/index.tsx:102-105`. Config global de Query: `staleTime: 0`,
  `gcTime: 5 min`, `retry: false` (`src/providers/query-provider.tsx:28-35`).
- **F8 — Los tres sitios que fijan `measuredAt`** en `weight-log.tsx`: `:62`
  `useState(localTodayIso)`, `:70` reset en el cleanup de `useFocusEffect` (#63 R3),
  `:104` reset tras `case 'ok'`. El mismo estado alimenta la pantalla (`:188`
  `value={measuredAt}`) y el payload (`:95`). `localTodayIso` (`:39-44`) lee
  componentes locales del **dispositivo**.
- **F9 — `add-pet/index.tsx:34-39` `dateToIso`** lee componentes locales del `Date`
  que devuelve el picker (`:432-447`, `maximumDate={new Date()}` en `:437`); único
  consumidor `:186`. El 400 de alta se descarta como `{ kind: 'invalid' }`
  (`src/api/pets.ts:127-128`) y se pinta `addPet.checkPetDetails`.

Afirmaciones **NO verificadas contra el árbol** (se marcan donde se usan): que
Hermes sea el motor por defecto del SDK 57 (`app.json` no declara `jsEngine`; solo
se verificó la ausencia de override); que `Intl.DateTimeFormat` con `timeZone` y
`formatToParts` devuelva el día correcto **bajo Hermes en un dispositivo Android**
(producción ya usa `Intl.DateTimeFormat().resolvedOptions()` y
`toLocaleDateString`, así que el objeto existe; jest corre en Node, no en Hermes);
que los runners de GitHub Actions corran en UTC.

---

## Decisiones del gate

> Cerradas por escrito **antes** de esta spec. No se reabren aquí; se citan con su
> origen para que Codex no tenga que reconstruirlas. Solo **P1** es nueva y pide
> confirmación.

### Del humano (2026-09-17)

**D-A = (a) — la zona es la del perfil propio, `GET /v1/me`** (F1). Justificación:
F2 — owner y usuario logueado coinciden en toda petición de pesos que pueda dar 201,
y `birthDate` valida contra el requester. La opción (b) (exponer la zona del owner en
`PetProfileResponse`) queda **descartada por escrito y sin id de backend**: rompería
el contrato congelado del mapper y siete candados de claves sin que ningún flujo
móvil la necesite (explore §3.3). Con esto queda cerrado el criterio 6 de
`feature_list.json`.

**D-B = B1 — en producción solo cambian `src/app/(tabs)/weight-log.tsx`, un helper
nuevo en `src/utils/` y `src/i18n/catalog.ts`.** `src/screens/add-pet/index.tsx`
**NO cambia**: el criterio 3 (regresión de `birthDate`) se cubre con un test nuevo en
`src/screens/add-pet/index.test.tsx` como **requisito de verificación** (R6, C4 vía
mutación), que hereda el `beforeEach` raíz (`:101-104`) y **no pulsa `add-pet-photo`**
(#72 R4, `PICKER_MOCK_UNARMED`, `:82-89`). La mitad de backend la prueba el e2e R6
de #89 (`specs/dto-dates-owner-timezone/traceability.md`, fila R6:
`test/pets.e2e-spec.ts::R6 … 'POST acepta hoy y rechaza manana en la zona del
requester para Pacific/Kiritimati y Pacific/Pago_Pago (R6)'`).

**D-C = C-A — `weight-date-input` sigue siendo texto libre sin validación local.**
El 400 de fecha futura deja de pintarse crudo: se sustituye por la clave nueva
`weightLog.dateCannotBeAfterToday` en los dos idiomas; **los demás mensajes de
`errors[]` siguen crudos y con el mismo `join('\n')`**. Mueve
`weight-log.test.tsx:433-452` (L9), que se reescribe para aseverar la mezcla.

### Precisión que el humano confirma o rechaza en este gate

**P1 — el discriminador del 400 es `path === 'measuredAt'` Y el mensaje de
`WeightMeasuredInFutureError`, no solo el `path`.** Motivo: F4 — un error de
formato del mismo campo llega con `path: 'measuredAt'` y `message: 'Invalid ISO
date'`; con solo `path`, teclear `2026-13-45` mostraría «la fecha no puede ser
posterior a hoy», que es falso. El literal a comparar es el de F5, contrato de #89.
Si algún día el backend cambiara ese texto, el móvil **degrada a crudo** (no rompe)
y el e2e R5 de #89 es el que avisaría. Alternativa rechazada: solo `path`
(una condición menos, un mensaje falso en el caso de formato).

- [X] **P1 aceptada por humano** (fecha: 2026-09-17) — si se rechaza, R5 pasa a
  discriminar solo por `path` y su segundo `it` (formato crudo) se elimina.

### Del leader (técnicas)

- **Fallback**: si `me` no ha cargado, falló, o `timezone` no es aceptada por
  `Intl` (`RangeError`), la fecha se calcula en la zona del dispositivo (status quo).
  Helper puro `civilTodayIso(timeZone: string | undefined, now: Date = new Date()):
  string` en `src/utils/civil-today-iso.ts`, `Intl.DateTimeFormat` + `formatToParts`
  con las partes numéricas reensambladas (sin depender del patrón de un locale),
  `try/catch` alrededor. Cero dependencias nuevas. Test al lado.
- **Red**: `useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl,
  token ?? '') })` **inline** en `WeightLogContent`, igual que
  `profile/index.tsx:102-105`, con la configuración global (`staleTime: 0` ⇒ un
  `GET /v1/me` por montaje, aceptado). Sin hook compartido, sin tocar
  `query-provider.tsx` ni `profile`. La zona solo se usa cuando
  `me.data?.kind === 'ok'` (`MeState`, `src/api/users.ts:15-20`).
- **Cuándo se recalcula el default**: la opción con menos estado, [[design]] D3 —
  el estado guarda solo lo que el usuario **escribió** (`string | null`) y el valor
  mostrado y enviado se **deriva** en cada render como
  `borrador ?? civilTodayIso(zonaDelPerfil)`. Sin `useEffect`, sin flag, sin
  comparar con el default del dispositivo, sin Skeleton nuevo: cuando el perfil
  llega, el default cambia solo si el usuario no ha tocado el campo.
- **Smoke humano**: dev build de **Android** (nunca Expo Go), zona del dispositivo
  distinta a la del perfil y a una hora en la que los días civiles difieran
  (§Gate humano). Es la única verificación de `Intl` con `timeZone` bajo Hermes.

---

## Requisitos funcionales

### R1 — Helper puro de día civil en una zona explícita

**WHEN** se llama `civilTodayIso(timeZone, now)` con una zona IANA que `Intl`
acepta, **THE SYSTEM SHALL** devolver el día civil de `now` en esa zona como
`YYYY-MM-DD` (cuatro dígitos de año, mes y día con cero a la izquierda), calculado
con `Intl.DateTimeFormat` + `formatToParts` reensamblando las partes `year`,
`month` y `day` — nunca con `format()` ni con el patrón de un locale.
**IF** `timeZone` es `undefined`, o `Intl` la rechaza (`RangeError`), o cualquier
paso de esa vía lanza, **THEN THE SYSTEM SHALL** devolver el día civil del
**dispositivo** (componentes locales de `now`: `getFullYear`/`getMonth`/`getDate`),
sin lanzar y sin registrar nada. `now` es opcional y por defecto `new Date()`.

Fichero: `src/utils/civil-today-iso.ts` (export nombrado `civilTodayIso`). Sin
dependencias nuevas.

Test: `src/utils/civil-today-iso.test.ts`,
`describe('#90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo')`:

| caso | `now` | `timeZone` | esperado |
|---|---|---|---|
| (a) mismo instante, dos días | `new Date('2026-09-17T23:30:00Z')` | `'Pacific/Kiritimati'` / `'Pacific/Pago_Pago'` (`it.each`) | `'2026-09-18'` / `'2026-09-17'` |
| (b) cero-relleno | `new Date('2026-01-05T12:00:00Z')` | `'UTC'` | `'2026-01-05'` |
| (c) sin zona | `new Date('2026-09-17T23:30:00Z')` | `undefined` | igual a `${y}-${mm}-${dd}` calculado en el test con los getters **locales** de ese mismo `Date` |
| (d) zona inválida | ídem | `'Not/A/Zone'` | igual que (c), y `expect(() => …).not.toThrow()` |
| (e) `now` por defecto | sin argumento; `jest.useFakeTimers()` + `jest.setSystemTime(new Date('2026-09-17T23:30:00Z'))` + `afterEach(jest.useRealTimers)` | `'Pacific/Kiritimati'` | `'2026-09-18'` |

(a) es la fixture del criterio 4 («dispositivo en zona distinta a la del owner»):
un solo instante, dos días civiles. (e) fija que el default es `new Date()` y que
los fake timers lo alcanzan — la misma mecánica de la que dependen R3 y R4 en
pantalla. (c) es host-independiente por construcción (el esperado se calcula con
los mismos getters locales que define el fallback).

### R2 — El catálogo trae la clave del 400 de fecha futura

**WHEN** se carga `src/i18n/catalog.ts`, **THE SYSTEM SHALL** contener la clave
`weightLog.dateCannotBeAfterToday` con `en = 'Date cannot be after today'` y
`es = 'La fecha no puede ser posterior a hoy'`, sin marcadores `{{}}`, en el bloque
`weightLog.` de cada idioma (`en` `:116-128`, `es` `:425-437`), y la fila
`| — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2)`
en `specs/mobile-ui-language/design.md` §2.5, tabla de
`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx` (`:386-407`).

Candado L1, en `src/providers/__tests__/language-provider.test.tsx`:

- `:55` `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)` pasa a
  `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1)` — **se añade `+ 1` al literal
  actual**, no se reescribe una cifra plana (otra sesión, #79, puede añadir claves
  en paralelo; el delta sobrevive al merge, la cifra no).
- `:50` el comentario de historia gana ` + 1 de #90`.
- Bloque nuevo `describe('#90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla')`
  con la lista `[clave, en, es]` y la comprobación por regex de la fila de
  `specs/mobile-ui-language/design.md` (`← añadida por #90 \(R2\)`), calcando la
  forma de `:64-89` (`#73 R5`), que ya lee el fichero con `readFileSync(join(process.cwd(), '../specs/mobile-ui-language/design.md'))`.

**Nota de orden (sujeto presente):** la fila de `src/__tests__/ui-copy-table.ts` y
el `32 + 1` de `ui-language.test.ts` **no** van en R2: `checkUses` exige el número
exacto de `t('clave')` en `weight-log.tsx` (`ui-language.test.ts:38-64`) y ese uso
lo crea R5. Van con R5.

### R3 — La fecha por defecto del alta de peso sale de la zona del perfil

**WHILE** `GET /v1/me` ha resuelto `kind: 'ok'` con una `timezone` que `Intl`
acepta, **THE SYSTEM SHALL** mostrar en `weight-date-input` y enviar en
`measuredAt` el día civil **de esa zona** en los tres momentos de F8: (1) valor
inicial del formulario, (2) tras perder el foco (cleanup de `useFocusEffect`, #63
R3), (3) tras un `createWeight` con `kind: 'ok'`; y **WHEN** el perfil llega después
del primer render **WHILE** el usuario no ha editado el campo, **THE SYSTEM SHALL**
actualizar el valor mostrado a la zona del perfil sin intervención del usuario. La
zona se lee de una `useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl,
token ?? '') })` inline en `WeightLogContent`; `getMe` recibe exactamente
`(baseUrl, token)`. `localTodayIso` (`:39-44`) desaparece (C7): lo sustituye
`civilTodayIso` de R1.

Test, en `src/app/(tabs)/__tests__/weight-log.test.tsx`:

- **Mecanismo de zona (L8)**: `jest.mock('../../../api/users', () => ({ getMe: jest.fn() }))`
  + `const mockGetMe = jest.mocked(getMe)`, y un **`beforeEach` de nivel de fichero**
  (como el raíz de `add-pet/index.test.tsx:101-104`) que arma
  `mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile('Pacific/Kiritimati') })`,
  con `makeProfile(timezone)` devolviendo un `ProfileResponse` completo
  (`src/api/users.ts:3-13`, nueve strings). Por qué raíz y no por describe: los
  describes que no aseveran fechas (`R7`, `R8`, `#61 R10`, `#62 R9`, `#87 R10`)
  quedarían con un `jest.fn()` sin implementación, cuyo `undefined` TanStack v5
  trata como error de query; con el mock resuelto no hay ruido. Los
  `jest.clearAllMocks()` de cada describe conservan la implementación (verificado en
  #72). Por qué no `queryClient.setQueryData(userKeys.me(), …)`: `renderWithProviders`
  crea el cliente dentro (`test/render-with-providers.tsx:22-40`) y, con `staleTime:
  0`, la `useQuery` refetchea igual y el `getMe` real caería en `unreachable`
  (`src/api/http.ts:21-24`) pisando la semilla.
- **Reloj (L7)**: en el `beforeEach` de cada describe que asevera fechas —`R3` de
  #63 (`:124-136`), `R9` (`:333-344`), y los nuevos `#90 R3`/`#90 R4`—
  `jest.useFakeTimers(…)` + `jest.setSystemTime(new Date('2026-09-17T23:30:00Z'))`,
  y `afterEach(() => jest.useRealTimers())`. Ese instante cruza medianoche entre la
  zona sembrada (`Pacific/Kiritimati` → `2026-09-18`) y el UTC del host
  (`2026-09-17`): si alguien vuelve al reloj del dispositivo, el candado falla **por
  la fecha**, no por casualidad. Los argumentos exactos de `useFakeTimers` se
  verifican en **este** fichero (`food.test.tsx:263-264` usa
  `{ doNotFake: ['requestAnimationFrame'] }` con `renderWithProviders` y heroui;
  `home/index.test.tsx:2277-2278` no pasa opciones): se elige lo que mantenga vivos
  `waitFor` y el árbol aquí, y se anota en el reporte. No se calca sin probar.
- **Esperas (#72)**: toda espera termina en la misma observación que asevera:
  `await waitFor(() => expect(screen.getByTestId('weight-date-input').props.value).toBe('2026-09-18'))`.
  Nunca en `queryClient.getQueryData(userKeys.me())` ni en `mockGetMe` llamado.
- **Bloque nuevo** `describe('#90 R3: la fecha por defecto sale de la zona del perfil')`
  con `it.each([['Pacific/Kiritimati', '2026-09-18'], ['Pacific/Pago_Pago', '2026-09-17']])`:
  arma `mockGetMe` con esa zona, renderiza, espera a que `weight-date-input` valga
  el día esperado, asevera `mockGetMe` llamado con `(apiUrl, 'jwt-token')`, escribe
  solo el peso, pulsa `weight-submit` con `mockCreateWeight` resuelto en `ok`, asevera
  `createWeight` llamado con `measuredAt` = día esperado, y espera a que
  `weight-date-input` vuelva a valer ese día (punto 3). **Por qué el par**: a ese
  instante cualquier host del planeta está en `09-17` o en `09-18`, así que como
  mucho una de las dos filas puede pasar por coincidencia con el reloj del
  dispositivo; el par hace el candado independiente de la zona del host (VPS `UTC`,
  máquinas Windows en CDMX, runners de CI —NO verificado—).
- **Cuatro aserciones existentes que se mueven** (L7), cada una con el sufijo
  ` (#90 R3)` en el título del `it` (forma de #72 D6: sufijo, se conserva el
  título original como prefijo):

  | sitio HEAD | test | cambio |
  |---|---|---|
  | `:158-160` | `R3: … › 'restaura los cuatro valores visibles tras el blur'` | `toBe(localTodayIso())` → `toBe('2026-09-18')` (punto 2, blur) |
  | `:355-357` | `R9: … › 'renders the inline form with the local date prefilled'` | `toBe('2026-09-18')` **dentro de un `waitFor`** (hoy es síncrona tras esperar a `weight-input`; el perfil resuelve en otra macrotarea) |
  | `:406-408` | `R9: … › 'submits all fields, clears them, and refetches the list (#72 R2)'` | `toBe('2026-09-18')` (punto 3) — la espera de `:401-403` (input vacío, #72 S7) se conserva y la de la fecha se **suma** dentro de un `waitFor` |
  | `:428` | `R9: … › 'omits body condition when its field is blank'` | `measuredAt: '2026-09-18'` |

  La copia `localTodayIso` del test (`:84-89`) pasa a llamarse `deviceTodayIso` y
  solo la usa R4. Tras editar títulos, `grep -rn "<título>" specs/` y actualizar las
  filas ajenas que los citen (`specs/mobile-detail-screens-state-reset/traceability.md`
  y `specs/mobile-add-pet-photo-test-flake/traceability.md` citan
  `restaura los cuatro valores visibles tras el blur` y `submits all fields, clears
  them, and refetches the list (#72 R2)`).

Rojo de R3 (real, sin mutación): con producción intacta, `weight-date-input` muestra
el día del host (`2026-09-17` en UTC) ≠ `2026-09-18` y `mockGetMe` no se llama.

### R4 — Sin zona del perfil, la fecha cae al dispositivo

**IF** `me` no ha resuelto todavía, **o** resolvió con `kind` ∈
`unreachable | error | missing-config`, **o** resolvió `ok` con una `timezone` que
`Intl` rechaza, **THEN THE SYSTEM SHALL** usar el día civil del **dispositivo** en
los tres puntos de F8 (status quo), sin pintar `weight-form-error` ni
`weight-log-error` por ello. (`unauthorized` no se cubre aquí: lo intercepta
`QueryCache.onSuccess` de `query-provider.tsx` y cierra sesión.)

Test: `describe('#90 R4: sin zona del perfil la fecha cae al dispositivo')`, con el
mismo reloj de R3 (`23:30Z`) y el esperado calculado con `deviceTodayIso()` (getters
locales del `new Date()` falso; host-independiente):

- (a) `mockGetMe.mockReturnValue(pending())` → `weight-date-input` vale
  `deviceTodayIso()`.
- (b) `it.each([{ kind: 'unreachable', message: 'network down' }, { kind: 'error' }, { kind: 'missing-config' }])`
  → ídem, y `queryByTestId('weight-form-error')` es `null` **después** de anclar la
  espera a la aparición de `weight-input` (#72: ausencia anclada a un positivo).
- (c) `{ kind: 'ok', me: makeProfile('Not/A/Zone') }` → ídem, sin `RangeError`.

**Requisito de verificación (C4 vía b).** Tras el verde de R3 la producción ya
cae al dispositivo por construcción, así que su rojo se prueba por **mutación de
producción versionada en el commit rojo y revertida en el verde** ([[design]]
§Mutaciones, M4): (i) en `weight-log.tsx`, la zona que se pasa al helper cuando
`me.data?.kind !== 'ok'` deja de ser `undefined` y pasa a ser el literal
`'Pacific/Kiritimati'` → (a) y (b) rojos por la fecha; (ii) en
`civil-today-iso.ts` se quita el `try/catch` → (c) rojo por `RangeError` (y R1(d)
también, que es la evidencia de que el candado del helper está vivo).

### R5 — El 400 de fecha futura se pinta traducido; el resto, crudo

**WHEN** `createWeight` devuelve `{ kind: 'validation', errors }` y un elemento de
`errors` cumple `path === 'measuredAt'` **y** `message === 'measuredAt is too far
in the future'` (F5; P1), **THE SYSTEM SHALL** sustituir **ese** elemento por
`t('weightLog.dateCannotBeAfterToday')` y conservar los demás con su `message`
crudo, en el mismo orden y con el mismo `join('\n')` de hoy (`weight-log.tsx:108-110`).
**IF** el elemento tiene `path === 'measuredAt'` con otro `message` (p. ej.
`'Invalid ISO date'`, F4), **THEN THE SYSTEM SHALL** pintarlo crudo. El literal del
backend se declara como constante con nombre en `weight-log.tsx` (una sola vez).

Tests, en `weight-log.test.tsx`, describe `R9`:

- `:433-452` `'joins backend validation messages'` se reescribe como
  `'joins backend validation messages, translating the future-date one (#90 R5)'`:
  `errors: [{ path: 'weightKg', message: 'Weight is too high' }, { path: 'measuredAt', message: 'measuredAt is too far in the future' }]`
  → `weight-form-error.props.children` es
  `'Weight is too high\nLa fecha no puede ser posterior a hoy'` (idioma `es`, el del
  `LanguageProvider initial="es"` de `renderWeightLog`).
- `it` nuevo `'keeps a malformed-date validation message raw (#90 R5)'`:
  `errors: [{ path: 'measuredAt', message: 'Invalid ISO date' }]` → `'Invalid ISO date'`.
  (Se elimina si el humano rechaza P1.)

Candado L3 (aquí y no en R2, porque el `t()` lo crea este requisito):

- `src/__tests__/ui-copy-table.ts`: fila
  `{ file: 'src/app/(tabs)/weight-log.tsx', key: 'weightLog.dateCannotBeAfterToday' }`
  al final del bloque de `weight-log.tsx` (`:136-153`).
- `src/__tests__/ui-language.test.ts:133` `toHaveLength(32)` → `toHaveLength(32 + 1)`
  (delta, con comentario `// +1 #90 R5`) y el título de `:132` pasa a
  `'resuelve las 33 ocurrencias normativas'`.
- `checkUses` exigirá **exactamente una** llamada literal
  `t('weightLog.dateCannotBeAfterToday')` en `weight-log.tsx`.

Rojo de R5 (real): el join crudo, `checkUses` con 0 usos y `toHaveLength` 32 ≠ 33.

### R6 — `birthDate` manda el día civil local del picker, no el UTC (verificación)

**WHEN** el usuario elige en `birth-date-picker` un `Date` cuyo día civil **local**
es D y cuyo día **UTC** es D+1 (dispositivo a las 23:30 locales con UTC ya en el
día siguiente), **THE SYSTEM SHALL** enviar `birthDate = D` en `createPet`, como
hoy (`dateToIso`, `add-pet/index.tsx:34-39`). Producción **no cambia** (D-B).

Test: `src/screens/add-pet/index.test.tsx`,
`describe('#90 R6: birthDate manda el día civil local del picker, no el UTC')`,
declarado **después** de `#72 R4` (`:402-419`) y antes de `#61 R10` (`:421`), con:

- `beforeEach` propio con el mismo armado que `R6: alta de mascota` (`:203-214`:
  `EXPO_PUBLIC_API_URL`, `mockUseAuth`, `mockUseSelectedPet`; ahí `mockCreatePet`
  queda en `pending()` y cada `it` lo resuelve) y, en el `it`,
  `mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never })`
  como hace `:233-255` — verificado contra el fichero, no calcado —, más
  `jest.useFakeTimers(…)` + `jest.setSystemTime(new Date('2026-09-17T23:30:00Z'))`
  y `afterEach(jest.useRealTimers)`. Hereda el `beforeEach` raíz del picker
  (`:101-104`) y **no** pulsa `add-pet-photo`.
- Fixture: un `Date` **real** con los getters UTC sesgados, como `format.test.ts:58-65`
  (#70 R5):
  `Object.assign(new Date(2026, 8, 17, 23, 30), { getUTCFullYear: () => 2026, getUTCMonth: () => 8, getUTCDate: () => 18 })`.
  Es real para que `birthDate.toLocaleDateString(locale)` (`add-pet/index.tsx:411-415`)
  siga funcionando, y sesgado porque en un host en UTC (VPS, CI) **ningún `Date`
  real tiene día local ≠ día UTC**: sin el sesgo, la mutación de abajo sería ciega.
- Pasos: nombre `'Nala'`, pulsar `birth-date-field`, `fireEvent(picker,
  'onValueChange', {}, fixture)` (como `:243-250`), pulsar `add-pet-submit`; esperar
  a `mockCreatePet` llamado con `expect.objectContaining({ birthDate: '2026-09-17' })`.

**Requisito de verificación (C4 vía b)**, mutación M6 en el commit rojo y revertida
en el verde: `dateToIso` lee `getUTCFullYear`/`getUTCMonth`/`getUTCDate` → envía
`'2026-09-18'` → rojo por la aserción. Comprobación del reviewer:
`git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`
**vacío**.

La mitad de backend («hoy a cualquier hora se acepta tras #89») no se asevera desde
el móvil: la fija el e2e R6 de #89 citado en D-B.

### R7 — Verificación final

**WHEN** R1-R6 están en verde, **THE SYSTEM SHALL** cumplir, con la evidencia en
`progress/impl_mobile-owner-timezone-dates.md`:

1. `rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes del typecheck (fichero
   gitignorado que rompe `tsc` con rutas fantasma, memoria del repo).
2. Desde `mobile-pet-tracker/`, sin pipes y anotando el exit code:
   `bun run typecheck`, `bun run lint`, `bun run test` — los mismos comandos que
   `init.config.sh:25-27` — y `bunx jest --listTests | wc -l` = S, con
   `Test Suites: … N total` de la corrida completa cumpliendo **N == S**.
3. Desde la raíz, tras `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`
   vacío: `./init.sh` verde (la suite móvil no toca Postgres/LocalStack; `init.sh`
   entero sí comparte LocalStack con la otra sesión, `docs/conventions.md`
   §Sesiones en paralelo).
4. C8 grep-clean sobre los ficheros tocados: cero hex, cero clases arbitrarias
   `[...]`, cero `StyleSheet.create`.
5. Cero dependencias nuevas: `git diff origin/main..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío.
6. Delta del catálogo: `grep -c "^  '" src/i18n/catalog.ts` = **base + 2** (una
   línea por idioma; hoy 608).
7. `git diff origin/main..HEAD --stat` limitado a la lista cerrada de [[design]]
   §Archivos afectados; diff **vacío** en `src/screens/add-pet/index.tsx`,
   `src/screens/profile/index.tsx`, `src/providers/query-provider.tsx`,
   `src/api/users.ts` y todo `backend-pet-tracker/`.
8. Cualquier candado no listado en §Candados que se haya movido, declarado como
   delta en el reporte (criterio 5 de `feature_list.json`).

Sin test nuevo: se traza a comandos y al reporte.

---

## Candados

Tabla L1-L16 del explore (`progress/explore_mobile-owner-timezone-dates.md` §5),
clasificada. Cifras siempre como **delta contra el literal actual**.

### Se mueven

| # | Candado | Sitio HEAD | Hoy | Cambio | R |
|---|---|---|---|---|---|
| L1 | Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx:55` | `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)` (= 304 por idioma; `grep -c "^  '" src/i18n/catalog.ts` = 608) | `+ 1` al literal; ` + 1 de #90` en el comentario `:50`; `describe('#90 R2: …')` nuevo | R2 |
| L3 | Tabla de usos R5 Health | `src/__tests__/ui-language.test.ts:133` `toHaveLength(32)`; 18 filas de `weight-log.tsx` en `ui-copy-table.ts:136-153` | 32 | `32 + 1`; fila nueva; título `33 ocurrencias`; registro en `specs/mobile-ui-language/design.md` §2.5 | R5 (fila y literal), R2 (registro §2.5) |
| L7 | Fecha por defecto = dispositivo | `weight-log.test.tsx:84-89` (copia), aserciones `:158-160`, `:355-357`, `:406-408`, `:428` | 4 aserciones contra `new Date()` real | reloj fijo `23:30Z` + perfil `Pacific/Kiritimati` + literal `'2026-09-18'`; la copia pasa a `deviceTodayIso` (solo R4) | R3 |
| L8 | `weight-log.test.tsx` no mockea `api/users` | `:30-59` | sin mock | `jest.mock('../../../api/users')` + `beforeEach` raíz con perfil resuelto | R3 |
| L9 | Join crudo de mensajes | `weight-log.test.tsx:433-452` | `'Weight is too high\nDate is in the future'` | mezcla crudo + traducido; `it` nuevo de formato crudo | R5 |

### Siguen verdes (y el reviewer lo comprueba)

| # | Candado | Por qué no se mueve |
|---|---|---|
| L2 | Paridad en/es y marcadores (`language-provider.test.tsx:56-61`, `ui-language.test.ts:429-430`) | La clave nueva va en los dos idiomas y sin `{{}}` |
| L4 | R9 Alta de mascota, 42 filas (`ui-language.test.ts:161`) | `add-pet` no gana copy (D-B) |
| L5 | Literal entero del catálogo en pantallas (`ui-language.test.ts:437-448`) | Los valores nuevos no aparecen como literal en ninguna pantalla |
| L6 | `signOut` por pantalla = 1 (`design-drift.test.ts:391`) | `case 'unauthorized'` de `weight-log.tsx:117-119` no se toca |
| L10 | `add-pet` renderiza sin `QueryClientProvider` (15 tests) | Ningún `useQuery` entra en `AddPetScreen` (D-B) |
| L11 | `birthDate` enviado (`add-pet/index.test.tsx:243-250`, `:143-149`, `:188-191`) | `dateToIso` no cambia; R6 **añade** un test, no edita esos |
| L12 | Mock del picker de fecha (`:38-52`) | R6 lo usa tal cual |
| L13 | `PICKER_MOCK_UNARMED` (#72 R4) | R6 no pulsa `add-pet-photo` |
| L14 | Snapshots (`pet-avatar`) | No afecta |
| L15 | Health tab (`health.test.tsx:469-613`) | No asevera fechas |
| L16 | Backend (7 candados de `PetProfileResponse`, texto del 400) | D-A = (a): diff vacío en `backend-pet-tracker/` |

Candado **nuevo** que deja esta feature: `src/utils/civil-today-iso.test.ts` (R1).

---

## Cómo se demuestra el rojo de cada R-id (C4)

| R-id | Vía | Rojo exacto |
|---|---|---|
| R1 | Real | El commit rojo incluye el test y un `civil-today-iso.ts` **esqueleto** que ignora `timeZone` y devuelve el día del dispositivo (para que el rojo no sea `Cannot find module`): (a) Kiritimati falla por la fecha en cualquier host que no esté en UTC+13/+14; (b), (c), (d) pasan, (e) falla |
| R2 | Real | El `describe('#90 R2')` falla porque la clave no existe; el `+ 1` de L1 falla por longitud |
| R3 | Real | Fecha del host ≠ `'2026-09-18'` en `#90 R3` y en las cuatro aserciones editadas; `mockGetMe` no llamado |
| R4 | **Verificación, C4 (b)**: mutación M4 versionada en el rojo, revertida en el verde | (a)(b) por la fecha (`'Pacific/Kiritimati'` hardcodeado), (c) por `RangeError` (sin `try/catch`) |
| R5 | Real | Join crudo; `checkUses` 0 ≠ 1; `toHaveLength` 32 ≠ 33 |
| R6 | **Verificación, C4 (b)**: mutación M6 versionada en el rojo, revertida en el verde | `createPet` recibe `'2026-09-18'` ≠ `'2026-09-17'` |
| R7 | Sin test: comandos + reporte | — |

Regla dura sobre M4 y M6: son transitorias. El commit verde deja
`src/screens/add-pet/index.tsx` **byte a byte** como en `origin/main`, y `weight-log.tsx`
y `civil-today-iso.ts` sin rastro de la mutación.

---

## Gate humano — smoke en dev build de Android

Único modo de verificar `Intl.DateTimeFormat` con `timeZone` + `formatToParts` bajo
Hermes (**NO verificable en jest**, que corre en Node). Dev build de Android,
**nunca Expo Go**. Backend local de la máquina del humano (`docs/demo-runbook.md`).

1. **Preparar el desfase.** Con el dispositivo en `America/Mexico_City`, registrar
   (o usar) un usuario: el registro manda la zona del dispositivo (`register.tsx:64-70`)
   y no hay PATCH de perfil, así que la zona del perfil queda en CDMX. Después
   cambiar la zona del **dispositivo** a `Asia/Tokyo` (CDMX + 15 h). Los días civiles
   difieren mientras en CDMX sean entre las 09:00 y las 24:00: a las 10:00 de CDMX,
   Tokio ya está en el día siguiente.
2. **Default.** Abrir Health → Registro de peso. `weight-date-input` debe mostrar
   **el día de CDMX** (el del perfil), no el de Tokio. Antes de esta feature mostraba
   el de Tokio.
3. **Hoy → 201.** Guardar un peso sin tocar la fecha: la fila nueva aparece con el
   día de CDMX y sin error.
4. **Mañana → 400 traducido (R5).** Escribir a mano el día siguiente al de CDMX y
   guardar: `weight-form-error` dice `La fecha no puede ser posterior a hoy` (`es`;
   con el idioma en `en`, `Date cannot be after today`).
5. **Formato → crudo (P1).** Escribir `2026-13-45` y guardar: `Invalid ISO date`, tal
   cual.
6. **Fallback (R4).** Modo avión, volver a entrar en Registro de peso: la fecha es
   la del dispositivo (Tokio), y no hay error de formulario por ello.
7. Devolver el dispositivo a su zona. Anotar en `progress/impl_…md` o en el review:
   fecha/hora, zonas, y el resultado de 2-6.

Si el paso 2 muestra el día de Tokio con `me` cargado, es la señal de que `Intl` con
`timeZone` no hace lo esperado bajo Hermes: se **para** y se abre decisión (no se
parchea con una tabla de offsets).

---

## Fuera de alcance

- **`src/screens/add-pet/index.tsx` en producción** (D-B): ni `maximumDate` en la
  zona del perfil ni `dateToIso` con zona. El caso «dispositivo por delante del
  perfil» en el alta sigue pudiendo dar 400 (`'birthDate cannot be in the future'`
  pintado como `addPet.checkPetDetails`); queda escrito, no se arregla aquí.
- **Hook `useMe()` compartido** o `staleTime` propio de la query: inline como
  `profile`, un `GET /v1/me` por montaje.
- **Validación local del campo de fecha**, `keyboardType`, o sustituirlo por
  `community/datetime-picker` (C-B / C-C de D-C).
- **Backend**: texto del 400, zona del owner en mascotas, validar IANA en registro,
  PATCH de perfil. Diff vacío en `backend-pet-tracker/`.
- **`expo-localization`** o cualquier dependencia nueva (carta §Dirección de arte 6).
- **Traducir el resto de mensajes de `errors[]`** (`'Invalid ISO date'`, los de
  `weightKg`): siguen crudos, corolario 2 de la carta.
- **Cambiar `query-provider.tsx`, `src/api/users.ts`, `profile/index.tsx`**.
- **Zona del dispositivo en memoria (`auth-provider`)**: no hace falta con la
  `useQuery`.
- **C8**: no se toca ningún estilo, token ni componente; el grep-clean se mantiene
  trivialmente (R7.4 lo comprueba igual).

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-17) ← gate obligatorio antes de implementar
- [X] P1 aceptada (§Decisiones del gate) — o rechazada, y R5 se simplifica

> Al firmar, el `leader` pasa el frontmatter de los cuatro ficheros a `approved`,
> corrige `GET /v1/users/me` → `GET /v1/me` en la entrada #90 de `feature_list.json`
> y escribe el handoff a Codex CLI (skills `expo-overview` y
> `expo-data-fetching`; commits test-primero por R; `\(tabs\)` escapado en filtros
> posicionales).
