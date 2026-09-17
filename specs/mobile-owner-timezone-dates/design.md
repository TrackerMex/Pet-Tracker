---
feature: "mobile-owner-timezone-dates"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-owner-timezone-dates]] (#90)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> **Capas**: esta feature no toca `backend-pet-tracker/` ni `infra/`, así que
> `docs/architecture.md` (domain/application/infrastructure) no aplica. Todo vive en
> `mobile-pet-tracker/`: una pantalla, un helper puro en `src/utils/`, el catálogo y
> cinco ficheros de test, más una fila en `specs/mobile-ui-language/design.md`.
> Rutas relativas a `mobile-pet-tracker/`; líneas de HEAD `29689598`.

## Decisiones técnicas

### D1 — La zona sale de `useQuery(userKeys.me())` inline en `WeightLogContent` (R3)

Copia de forma de `src/screens/profile/index.tsx:102-105`:

```
const me = useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') });
const profileTimeZone = me.data?.kind === 'ok' ? me.data.me.timezone : undefined;
```

Imports nuevos en `weight-log.tsx`: `getMe` de `'../../api/users'`, `userKeys` de
`'../../api/query-keys'` (ya se importa `healthKeys` de ahí, `:21`), y
`civilTodayIso` de `'../../utils/civil-today-iso'`. Configuración global de Query
sin cambios (`staleTime: 0`): un `GET /v1/me` por montaje de la pantalla, aceptado
por el leader (E1). Sin hook `useMe()`: dos consumidores (`profile`, `weight-log`)
no justifican una abstracción; si un tercero aparece, se extrae entonces.

`MeState` es una unión discriminada (`src/api/users.ts:15-20`): `timezone` solo se
lee bajo `kind === 'ok'`. `unauthorized` lo intercepta `QueryCache.onSuccess`
(`query-provider.tsx`) y cierra sesión, como en cualquier otra pantalla.

### D2 — `civilTodayIso`: `Intl.DateTimeFormat` + `formatToParts`, un `try/catch`, fallback al dispositivo (R1, R4)

`src/utils/civil-today-iso.ts`, una función exportada, cero dependencias:

- Vía principal: `new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric',
  month: '2-digit', day: '2-digit' }).formatToParts(now)`, y se reensamblan las
  partes `year`, `month`, `day` como `YYYY-MM-DD`. **Por qué `formatToParts` y no
  `format()`**: el patrón de un locale (`en-CA` → `YYYY-MM-DD`) no está garantizado
  bajo Hermes/ICU de Android (explore §4.2); las partes numéricas sí lo están. El
  locale `'en-US'` es irrelevante para el resultado (solo se leen partes numéricas)
  y se fija para que la salida no dependa del locale del dispositivo.
- Con `timeZone: undefined` la misma llamada resuelve la zona del dispositivo: la
  vía principal cubre también el caso «sin perfil».
- `try/catch` alrededor de **toda** la vía principal (constructor + `formatToParts`),
  no solo del constructor: un `RangeError` por zona no IANA y un hipotético
  `TypeError` si el runtime no tuviera `formatToParts` (Hermes en dispositivo, **NO
  verificado**) caen en el mismo sitio. En el `catch`: componentes locales de `now`
  (`getFullYear`/`getMonth`/`getDate`, cero-relleno) — el cuerpo que hoy tiene
  `localTodayIso` (`weight-log.tsx:39-44`), que se borra de la pantalla (C7).
- **Fallback al dispositivo y no a `'UTC'`** (D-D = i con validación iii): el backend
  degrada las zonas no IANA a `'UTC'` con un warn (`owner-local-day.ts`,
  `requester-local-day.ts`, #88/#89 R3), así que en ese rincón móvil y backend
  seguirán sin coincidir. Se acepta porque (1) solo ocurre con perfiles corruptos
  creados desde otro cliente (el móvil manda `Intl.DateTimeFormat().resolvedOptions().timeZone`
  al registrar, `register.tsx:64-70`), (2) el dispositivo es el status quo y el
  smoke lo conoce, y (3) elegir `'UTC'` haría que un usuario sin red viera un día
  que no es el suyo. Queda escrito; no se relitiga en el handoff.
- `now: Date = new Date()` como segundo parámetro: los tests unitarios pasan el
  instante; producción no lo pasa; los fake timers de los tests de pantalla lo
  alcanzan (R1(e) lo demuestra).

### D3 — Cuándo se recalcula el default: borrador nullable + valor derivado (R3, R4)

Es la opción con **menos estado** de las que abrió el explore (§8.2), y la que
elige esta spec:

- El estado `measuredAt: string` (`:62`) pasa a `measuredAtDraft: string | null`,
  inicial `null`. Guarda **solo lo que el usuario escribió**.
- El valor que se **muestra** (`:188`) y se **envía** (`:95`) se deriva en cada
  render, una sola vez, como `const measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone)`.
  Sigue siendo **un** valor para pantalla y payload (restricción del leader).
- Los tres puntos de F8 pasan a poner `null`: `useState<string | null>(null)`,
  `setMeasuredAtDraft(null)` en el cleanup de `useFocusEffect` (`:70`) y tras
  `case 'ok'` (`:104`). `onChangeText={setMeasuredAtDraft}`.

Qué compra: cuando el perfil llega después del primer render, el default cambia
**solo** si el usuario no ha tocado el campo (`draft === null`), sin `useEffect`,
sin comparar con el default del dispositivo, sin flag, sin Skeleton nuevo, sin
remontar nada; y si la pantalla cruza medianoche abierta, el próximo render ya
muestra el día correcto. Coste: una construcción de `Intl.DateTimeFormat` por
render de `WeightLogContent`, despreciable; no se memoiza (YAGNI).

Un usuario que borre el campo a mano deja `draft === ''` y envía `''`, exactamente
como hoy (texto libre, C-A): el backend responde `'Invalid ISO date'` y se pinta
crudo (R5, P1).

Descartadas:

- **(i) `useEffect` sobre `me.data` que recalcula si el campo sigue en el default
  del dispositivo**: un efecto, una comparación de cadenas, un render con el valor
  equivocado antes del efecto, y un falso positivo si el usuario escribió justo el
  día del dispositivo.
- **(ii) No renderizar el formulario hasta que `me` resuelva** (Skeleton): el estado
  vive en `WeightLogContent`, que monta antes de que `me` resuelva, así que la
  puerta no arregla el `useState` inicial sin extraer el formulario a un hijo; añade
  un estado de carga a una pantalla que ya tiene el suyo (`weight-log-loading`,
  `:225-230`) y obliga a que **todos** los tests de `weight-log.test.tsx` esperen al
  perfil antes de ver `weight-input`.
- **(iv) `key={profileTimeZone}` en el formulario**: remonta y pierde lo escrito.

### D4 — El 400 de fecha futura: discriminador `path` + mensaje, un `t()` literal (R5)

En `case 'validation'` (`:108-110`) el `map` deja de devolver `message` a secas:

- Se declara **una** constante con nombre en `weight-log.tsx`
  (`MEASURED_AT_IN_FUTURE_MESSAGE = 'measuredAt is too far in the future'`) —
  contrato byte a byte de #89 (F5). Un elemento con `path === 'measuredAt'` **y**
  ese `message` se sustituye por `t('weightLog.dateCannotBeAfterToday')`; cualquier
  otro (incluido `'Invalid ISO date'` bajo el mismo `path`, F4) se conserva. Mismo
  `join('\n')`, mismo orden.
- La llamada `t('weightLog.dateCannotBeAfterToday')` se escribe **literal y una sola
  vez** en el fichero: `checkUses` (`ui-language.test.ts:38-64`) cuenta `t('clave')`
  exactas por fichero.
- Si el humano rechaza P1, el discriminador queda en `path === 'measuredAt'` y la
  constante desaparece.

### D5 — Cómo se prueba la pantalla: mock de `api/users`, reloj fijo, par de zonas (R3, R4, R5)

- `jest.mock('../../../api/users', () => ({ getMe: jest.fn() }))` en
  `weight-log.test.tsx`, junto a los mocks de `:30-37`. `mockGetMe` armado en un
  `beforeEach` **de nivel de fichero** con `makeProfile('Pacific/Kiritimati')`; R4
  lo re-arma por test. Razones en [[requirements]] §R3 (L8).
- `makeProfile(timezone: string): ProfileResponse` — fixture local del test con los
  nueve campos string de `src/api/users.ts:3-13`; `getMe` está mockeado, así que la
  guarda `isProfileResponse` no corre, pero el tipo lo exige.
- Fake timers **por describe** (no a nivel de fichero): `R3` de #63, `R9`, `#90 R3`,
  `#90 R4`, con `afterEach(jest.useRealTimers)`. Instante `2026-09-17T23:30:00Z`.
  Los argumentos de `useFakeTimers` se deciden probando en este fichero (dos
  precedentes distintos, `food.test.tsx:263-264` y `home/index.test.tsx:2277-2278`).
  La combinación fake timers + `renderWithProviders` + `waitFor` ya funciona en
  `food.test.tsx` (`:135-136`, `:263-264`): RNTL avanza los timers falsos dentro de
  `waitFor`, y el `setTimeout(0)` del notificador de query-core se vacía.
- El par `Kiritimati`/`Pago_Pago` en `#90 R3` (`it.each`) es lo que hace el candado
  independiente de la zona del host; las cuatro aserciones editadas usan solo
  `Kiritimati` (`'2026-09-18'`), que ya difiere de UTC y de CDMX.
- `deviceTodayIso()` (la antigua copia `:84-89`, renombrada) se conserva **solo**
  para R4, donde el esperado es «el día del dispositivo» por definición.

### D6 — La fixture de R6 es un `Date` real con getters UTC sesgados (R6)

`Object.assign(new Date(2026, 8, 17, 23, 30), { getUTCFullYear: () => 2026,
getUTCMonth: () => 8, getUTCDate: () => 18 })`, precedente `format.test.ts:58-65`
(#70 R5). Real porque `add-pet/index.tsx:411-415` llama `toLocaleDateString(locale)`
sobre él; sesgado porque en un host en UTC ningún `Date` real tiene día local ≠ día
UTC y la mutación M6 sería ciega. `jest.setSystemTime('2026-09-17T23:30:00Z')` fija
además `maximumDate={new Date()}` (`:437`) y hace explícito el escenario «23:30
locales»; el candado, sin embargo, vive en los getters.

### D7 — Títulos: prefijo `#90 R<n>` en lo nuevo, sufijo ` (#90 R<n>)` en lo editado

`weight-log.test.tsx` y `add-pet/index.test.tsx` acumulan R-ids de #63, #61, #62,
#72, #87 (`docs/conventions.md` §Prefijo de feature). Los describes nuevos van como
`describe('#90 R<n>: …')`; los `it` existentes que se editan conservan su título y
ganan el sufijo, como hizo #72 (D6), para no romper las traceabilities ajenas que
los citan — y esas filas se actualizan (`grep -rn "<título>" specs/`).

### D8 — Scope de commits

`test(mobile-owner-timezone-dates): … (R<n>)` para el rojo,
`feat(mobile-owner-timezone-dates): … (R<n>)` para el verde,
`docs(mobile-owner-timezone-dates): … (R7)` para el cierre. Un par por R (C4).

## Mutaciones de producción (C4 vía b)

Versionadas en el commit rojo de su R y **revertidas** en el verde. Ninguna
sobrevive al cierre.

| Id | R | Fichero | Mutación | Rojo esperado |
|---|---|---|---|---|
| M4-i | R4 | `src/app/(tabs)/weight-log.tsx` | la zona pasada al helper cuando `me.data?.kind !== 'ok'` deja de ser `undefined` y pasa a ser `'Pacific/Kiritimati'` | R4 (a) y (b) fallan por la fecha (`'2026-09-18'` ≠ día del host) |
| M4-ii | R4 | `src/utils/civil-today-iso.ts` | se quita el `try/catch` | R4 (c) falla por `RangeError` al renderizar; R1 (d) falla también |
| M6 | R6 | `src/screens/add-pet/index.tsx` | `dateToIso` lee `getUTCFullYear`/`getUTCMonth`/`getUTCDate` | `createPet` recibe `birthDate: '2026-09-18'` ≠ `'2026-09-17'` |

Comprobación del reviewer tras el verde:
`git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`
vacío; en `weight-log.tsx` y `civil-today-iso.ts`, `rg -n "Pacific/Kiritimati"` sin
resultados fuera de tests y el `try/catch` presente.

## Archivos afectados (lista cerrada)

Todos bajo `/home/claude/sites/Pet-Tracker-wt-backend/mobile-pet-tracker/` salvo los
dos últimos.

| Archivo | Qué cambia | R |
|---|---|---|
| `src/utils/civil-today-iso.ts` | **nuevo**: `civilTodayIso(timeZone, now = new Date())` | R1 |
| `src/utils/civil-today-iso.test.ts` | **nuevo**: `#90 R1`, casos (a)-(e) | R1 |
| `src/i18n/catalog.ts` | `weightLog.dateCannotBeAfterToday` en `en` (`:116-128`) y `es` (`:425-437`) | R2 |
| `src/providers/__tests__/language-provider.test.tsx` | `:50` comentario, `:55` `+ 1`, `describe('#90 R2')` | R2 |
| `src/app/(tabs)/weight-log.tsx` | imports (`getMe`, `userKeys`, `civilTodayIso`), `useQuery(me)`, `measuredAtDraft` + derivado, tres `null`, borrado de `localTodayIso`, mapeo del 400 con constante; **transitorio** M4-i | R3, R4, R5 |
| `src/app/(tabs)/__tests__/weight-log.test.tsx` | mock `api/users`, `makeProfile`, `beforeEach` raíz, fake timers en 4 describes, `#90 R3`, `#90 R4`, 4 aserciones editadas + sufijos, `deviceTodayIso`, L9 reescrito + `it` de formato | R3, R4, R5 |
| `src/__tests__/ui-copy-table.ts` | fila nueva de `weight-log.tsx` | R5 |
| `src/__tests__/ui-language.test.ts` | `:132-133` `32 + 1` y título | R5 |
| `src/screens/add-pet/index.test.tsx` | `describe('#90 R6')` tras `#72 R4` | R6 |
| `src/screens/add-pet/index.tsx` | **solo transitorio**: M6 en el rojo de R6, revertida en el verde | R6 |
| `../specs/mobile-ui-language/design.md` | fila `← añadida por #90 (R2)` en §2.5, tabla de `weight-log.tsx` | R2 |
| `../specs/mobile-owner-timezone-dates/traceability.md` | filas R1-R7 | — |
| `../progress/impl_mobile-owner-timezone-dates.md` | reporte: rojos, mutaciones, comandos de R7, smoke | R7 |

**Ficheros que NO se tocan** (el reviewer lo comprueba con `git diff origin/main..HEAD`):
`src/screens/add-pet/index.tsx` (tras el verde de R6), `src/screens/profile/index.tsx`,
`src/providers/query-provider.tsx`, `src/api/users.ts`, `src/api/health-records.ts`,
`src/api/types.ts`, `test/render-with-providers.tsx`, `test/jest-setup.js`,
`package.json`, `bun.lock`, y todo `backend-pet-tracker/`.

## Gate humano: diff esperado y smoke

El `git diff origin/main..HEAD --stat` final debe listar exactamente los ficheros de
la tabla (sin `add-pet/index.tsx`): +1 fichero de producción nuevo, +1 test nuevo, 1
pantalla, 1 catálogo, 4 tests editados, 1 tabla de copy, 2 specs, 1 reporte. El smoke
en dev build de Android está en [[requirements]] §Gate humano (pasos 1-7); es la única
verificación de `Intl.DateTimeFormat` con `timeZone` bajo Hermes.

## Alternativas descartadas

- **(b) zona del owner en `PetProfileResponse`**: rompe el contrato congelado del
  mapper y siete candados de claves para un dato que ningún flujo móvil necesita
  (F2). Descartada por el humano en D-A, sin id de backend.
- **(c) que el 400 nombre la zona**: texto del backend conservado byte a byte por #89;
  sería feature de backend. Se queda con (c′) en cliente = R5.
- **Hook `useMe()` / `staleTime` alto en esa query**: E1, inline como `profile`.
- **Fallback a `'UTC'`**: D2.
- **Validación local del campo / `datetime-picker` en `weight-log`**: C-B / C-C de D-C.
- **Llevar la zona del perfil a `add-pet`** (B2): 15 tests sin `QueryClientProvider`
  (L10) y `maximumDate` en zona; D-B lo deja fuera.
- **`process.env.TZ` en tests** para fabricar una frontera con `Date` reales: Node lo
  honra en runtime, pero bajo el `process` sandbox de jest no está garantizado y nadie
  fija `TZ` en el repo (F6); el sesgo de getters (D6) y el par de zonas (D5) son
  host-independientes sin tocar el entorno.
- **Un test estático que grepee `new Date()` en pantallas**: falsos positivos
  (`maximumDate`, `Date.now`); el candado es el de fecha en `weight-log.test.tsx`.
- **Memoizar `civilTodayIso` en la pantalla**: una construcción de `Intl` por render
  no se nota; añadir `useMemo` sería un `useMemo` con una dependencia de reloj que
  no existe.
