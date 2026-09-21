# review: mobile-push-registration — delta R15 (enmienda E4)
Fecha: 2026-09-21
Alcance: **solo el delta de R15** — commits `7b6b3b92` (rojo) y `b6c3392e` (verde).
R1-R11, R13, R14 y el arreglo de arranque en frío de R10 se miran únicamente como regresión.
Veredicto: **RECHAZADO** (1ª vuelta) → **APROBADO** (2ª vuelta, tras `48768ca6`)
Última revisión: 2026-09-21. El motivo único del rechazo quedó corregido; ver **§11**.

> **El código es correcto.** Los diez puntos técnicos de E4 se verificaron uno a
> uno y todos pasan, incluido el que más podía fallar (que no quede un
> `require('expo-notifications')` en el cuerpo del módulo). El rechazo de la 1ª
> vuelta fue **exclusivamente de trazabilidad**: la fila de R15 se quedó en
> "pendiente".
>
> **Corregido en `48768ca6`, sin tocar código. El delta de R15 queda APROBADO.**
> Lo de abajo (§1-§10) se conserva como registro de la 1ª vuelta y sigue siendo
> válido palabra por palabra: el árbol de `mobile-pet-tracker/` no ha cambiado
> ni un byte desde entonces (§11).
>
> **Esto NO cierra la feature #79.** R12 sigue pendiente: el paso 11 del gate lo
> repite un humano en dispositivo. Ver §Lo que NO puedo verificar.

---

## Resumen de la verificación técnica (todo verde)

| # | Punto pedido | Veredicto | Evidencia |
|---|---|---|---|
| 1 | El rojo falla HOY por la causa correcta | ✅ | §1 |
| 2 | No queda carga en tiempo de importación | ✅ | §2 |
| 3 | La carga perezosa va DESPUÉS de todos los guards de R6 | ✅ | §3 |
| 4 | El handler de primer plano sigue instalándose | ✅ | §4 |
| 5 | R7, R8, R10, R13 siguen verdes; R13 nombra la salida de Expo Go | ✅ | §5 |
| 6 | `src/app/_layout.tsx` no se tocó | ✅ | §6 |
| 7 | Regresión completa (`bunx jest` + `./init.sh`, sin pipe) | ✅ | §7 |
| 8 | i18n en delta cero y candado de catálogo con el `+1` de #90 | ✅ | §8 |
| 9 | Trazabilidad de R15 con los dos hashes | ❌ 1ª vuelta → ✅ tras `48768ca6` | §9, §11 |
| 10 | Ni un `npx` nuevo | ✅ | §10 |

---

## §1 — El rojo falla HOY, y por la causa correcta

Revertí `src/hooks/use-push-registration.ts` a su versión previa
(`git show 7b6b3b92:mobile-pet-tracker/src/hooks/use-push-registration.ts`, la que
tiene `import * as Notifications from 'expo-notifications'` en la línea 3 y
`Notifications.setNotificationHandler({...})` en el nivel de módulo) y corrí la
suite del hook. **El árbol quedó restaurado** (md5 `3cb731fd36e2f9dc7131f6edba243c08`,
`git status --porcelain` vacío).

```
$ bunx jest src/hooks/use-push-registration.test.tsx   # con la impl PREVIA

● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo

  expect(received).not.toThrow()

  Error name:    "Error"
  Error message: "expo-notifications unavailable in Expo Go"

        509 |   it('no accede a expo-notifications al importar el modulo', () => {
      > 510 |     const expoGoImportError = new Error(
            |                               ^

● R15: importar el modulo no toca expo-notifications › omite push en Expo Go y nombra la salida

  expect(jest.fn()).not.toHaveBeenCalled()
  Expected number of calls: 0
  Received number of calls: 1
  1: "default", {"importance": 7, "name": "default"}

● R10: ... › configura tras los guards el comportamiento de primer plano de SDK 57
  Expected number of calls: 1
  Received number of calls: 0

Test Suites: 1 failed, 1 total
Tests:       3 failed, 23 passed, 26 total
```

**Esto es exactamente lo que pedía la tarea (1) de `tasks.md`**, y no es un test de
guard disfrazado:

- El test `no accede a expo-notifications al importar el modulo`
  (`src/hooks/use-push-registration.test.tsx:509-534`) **aísla el módulo**
  (`jest.resetModules()` + `jest.isolateModules()`), instala un doble de
  `expo-notifications` que es un `Proxy` cuyo trap `get()` **lanza en cualquier
  acceso** —imitando a Expo Go— y aseveras que `jest.requireActual(...)` del
  módulo **no lanza**. Con la implementación previa lanza el error del doble:
  el fallo se produce **en tiempo de importación**, sin montar el hook, que es
  justo el escenario del paso 11 del gate.
- El segundo rojo (`omite push en Expo Go`) cubre la otra mitad de E4: la
  premisa falsa de R6.2. Con la implementación previa el hook **sí** llamaba a
  `setNotificationChannelAsync` en Expo Go, porque `Device.isDevice` es `true`
  en un teléfono físico y no existía el guard de entorno.
- El tercero confirma que el handler de primer plano ya no se instala al
  importar (ver §4).

Con la implementación actual los 26 tests pasan (§5).

## §2 — No queda ninguna carga en tiempo de importación (verificado sobre el JS emitido, no supuesto)

El fuente ya no tiene el `import` estático; en su lugar hay
`type NotificationsModule = typeof import('expo-notifications')`
(`src/hooks/use-push-registration.ts:10`), que es una posición de tipo y debería
borrarse al compilar. **Lo comprobé en el JS emitido por los dos compiladores.**

**a) TypeScript** (`bunx tsc ... --outDir <tmp fuera del repo>`):

```
=== todos los require() del emit de tsc ===
40:const expo_constants_1 = __importDefault(require("expo-constants"));
41:const Device = __importStar(require("expo-device"));
42:const expo_router_1 = require("expo-router");
43:const react_1 = require("react");
44:const react_native_1 = require("react-native");
45:const push_tokens_1 = require("../api/push-tokens");
46:const auth_provider_1 = require("../providers/auth-provider");
92:        const Notifications = require('expo-notifications');   ← única, y dentro del efecto
```

**b) Babel con `babel-preset-expo`** — que es lo que de verdad ejecuta Metro en
el dispositivo, y por tanto la prueba que cuenta. Requires del **cuerpo del
módulo**:

```
require("../api/push-tokens")
require("../providers/auth-provider")
require("@babel/runtime/helpers/asyncToGenerator")
require("@babel/runtime/helpers/interopRequireDefault")
require("@babel/runtime/helpers/interopRequireWildcard")
require("expo-constants")
require("expo-device")
require("expo-router")
require("expo/virtual/env")
require("react")
require("react-native")
```

**`expo-notifications` no aparece.** El único `require` de la librería en todo el
emit es este, y su contexto lo sitúa sin ambigüedad dentro del efecto:

```
...tId();if(!projectId){warnPush('skipped: EAS projectId missing');return;}var Notifications=require('expo-notifications')
```

El alias de tipo se borra en ambos compiladores. **El arreglo arregla de verdad.**

## §3 — La carga perezosa ocurre después de TODOS los guards de R6

Orden en `src/hooks/use-push-registration.ts`, dentro del `useEffect`:

| Línea | Guard |
|---|---|
| 36 | `status !== 'authenticated' \|\| token === null` |
| 40 | `!setPushToken` |
| 44 | `!Device.isDevice` (emulador/simulador) |
| **48** | **`Constants.executionEnvironment === 'storeClient'` (Expo Go — la condición nueva de E4)** |
| 53 | plataforma distinta de `android`/`ios` |
| 58 | `!projectId` |
| **64** | **`require('expo-notifications')`** |

La librería se carga en la línea 64, después de los seis guards, y el de Expo Go
(48) está **antes**. En Expo Go el efecto sale por la línea 50 y la librería no
se toca nunca. Confirmado también en el emit de Babel de §2, donde el
`require` va literalmente pegado al `return` del guard de `projectId`.

## §4 — El handler de primer plano sigue instalándose

Se movió del nivel de módulo (antes, línea 11) al efecto
(`src/hooks/use-push-registration.ts:65-72`), inmediatamente después del
`require`, con el mismo objeto de comportamiento
(`shouldShowBanner/List/PlaySound: true`, `shouldSetBadge: false`).

El test de R10 se adaptó en el commit verde en vez de borrarse — que es lo
correcto, porque el aserto viejo (`notificationHandlerCallsAtImport === 1`) medía
precisamente lo que E4 prohíbe:

```diff
-  it('configura al importar el comportamiento de primer plano de SDK 57', async () => {
+  it('configura tras los guards el comportamiento de primer plano de SDK 57', async () => {
+    await renderHook(() => usePushRegistration());
+    await waitFor(() => {
+      expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1);
+    });
```

Sigue fijando que el handler se instala **exactamente una vez** y que devuelve el
banner. El paso 6 del smoke (banner con la app abierta) conserva su candado.

## §5 — R7, R8, R10 y R13 siguen verdes

```
$ bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx --verbose
  R6: ✓ 6 tests    R7: ✓ 4 tests    R8: ✓ 7 tests
  R13: ✓ 2 tests   R10: ✓ 5 tests   R15: ✓ 2 tests
Tests: 26 passed, 26 total     (exit code 0)
```

Sobre el aviso de R13 para la salida nueva: existe y nombra la salida,
con el prefijo `[push]` estable y contando las llamadas para que no haya ruido
extra (`use-push-registration.test.tsx:503-506`):

```js
expect(warnSpy).toHaveBeenCalledTimes(1);
expect(warnSpy).toHaveBeenCalledWith(
  '[push] skipped: Expo Go does not support remote notifications',
);
```

Vive bajo `describe('R15: ...')` y no bajo el de R13. Lo doy por bueno: es el
mismo patrón que ya usan R6, R7 y R9 (cada salida asevera su propio `warn` en el
test de esa salida; el `describe` de R13 solo guarda los dos invariantes
transversales, "no avisa en producción" y "no avisa en el camino feliz"). El
requisito queda cubierto y el test nombra un R-id real.

## §6 — `src/app/_layout.tsx` no se tocó

```
$ git diff --name-only 7b6b3b92~1..HEAD
mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
mobile-pet-tracker/src/hooks/use-push-registration.ts
```

Dos ficheros, los dos sujetos que `tasks.md` §R15 autoriza ("**No** se toca
`src/app/_layout.tsx` ni ningún otro fichero"). Confirmado.

## §7 — Regresión completa, corrida por mí, sin pipe

`pgrep -af "init.sh|jest"` antes de cada corrida: sin procesos concurrentes
(importa por el Postgres compartido entre worktrees).

```
$ bunx jest --listTests | wc -l
77

$ bunx jest > <fichero> 2>&1 ; echo $?
JEST EXIT CODE: 0
Test Suites: 77 passed, 77 total
Tests:       1350 passed, 1350 total
Snapshots:   1 passed, 1 total
```

**77 suites ejecutadas = 77 en `--listTests`.** No hay ficheros saltados en
silencio (la trampa de `(tabs)` sin escapar). El exit code se midió **sin pipe**.

```
$ ./init.sh > <fichero> 2>&1 ; echo $?
INIT.SH EXIT CODE: 0
```

Cola de la salida (15763 líneas en total):

```
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
✅ Tests e2e pasados

→ Lint...
> backend-pet-tracker@0.0.1 lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
> pet-tracker-infra@0.0.1 lint
> eslint "{bin,lib,test}/**/*.ts"
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 85/101 completadas | 15 pendientes
```

El typecheck verde cubre además el alias `NotificationsModule` y el
`eslint-disable-next-line @typescript-eslint/no-require-imports` de la línea 63:
ni TypeScript ni ESLint protestan por el `require` perezoso.

`git status --porcelain` vacío después de correr `init.sh`.

## §8 — i18n en delta cero y candado del catálogo

El delta de R15 no toca ningún fichero de i18n, locale ni traducción — solo el
hook y su test (§6). Esta feature no pinta un píxel ni añade una sola cadena de
UI, así que su delta i18n es **cero**, como dice la spec.

El candado del catálogo está vigente y con el `+1` de #90 ya incorporado
(`src/providers/__tests__/language-provider.test.tsx:55`):

```js
expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1);
```

Procedencia del último sumando, verificada con `git log -L 55,55`:

```
da18d263 test(mobile-owner-timezone-dates): the catalog must carry weightLog.dateCannotBeAfterToday (R2)
-    expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2);
+    expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1);
```

`mobile-owner-timezone-dates` es la feature **#90** (`feature_list.json`, status
`done`). El `+1` es suyo y llegó al mergearse. La suite pasa con él, así que la
branch está al día con esa parte de `main`.

## §9 — Trazabilidad: **aquí está el fallo**

`specs/mobile-push-registration/traceability.md:24`, tal y como está en HEAD:

```
| R15 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R15: importar el modulo no toca expo-notifications` | pendiente: enmienda E4, firmada 2026-09-20 |
```

La columna de test está bien rellenada y el test existe y nombra el R-id. **La
columna de commit sigue diciendo "pendiente".** Los dos hashes del delta no se
anotaron nunca.

Por qué pasó, según el historial: la fila se escribió en `c7635063`
("spec: tareas y trazabilidad de R15"), que es **anterior** a los dos commits de
código, y nadie volvió a pasar por ella al terminar.

```
$ git log --oneline -1 -- specs/mobile-push-registration/traceability.md
c7635063 spec(mobile-push-registration): tareas y trazabilidad de R15
```

Los hashes que deberían figurar existen y **son ancestros de HEAD** (lo verifiqué
porque, si la branch se hubiera rebaseado, dejarían de valer — lección de #87):

```
$ git merge-base --is-ancestor 7b6b3b92 HEAD   → 7b6b3b92 ES ancestro de HEAD
$ git merge-base --is-ancestor b6c3392e HEAD   → b6c3392e ES ancestro de HEAD
```

La fila de **R12 sí debe seguir "pendiente"**, y sigue: es el gate humano, el
paso 11 lo repite una persona. Esa no se toca.

## §10 — Ni un `npx` nuevo

```
$ git diff 7b6b3b92~1..HEAD | grep "^+.*npx"
(sin resultados)
```

---

## Checklist de CHECKPOINTS

### C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#79 `mobile-push-registration`)
- [ ] `progress/current.md` actualizado — su última entrada es la corrección de
      R10 del 2026-09-19. No menciona E4 ni R15.

### C3 — Arquitectura
- [x] N/A en el sentido de capas de backend: el delta vive entero en
      `mobile-pet-tracker/src/hooks/`, que es la capa de presentación
- [x] El hook sigue dependiendo de `../api/push-tokens` (la frontera HTTP) y no
      mete lógica de red propia
- [x] El `require` perezoso no introduce un acoplamiento nuevo: es la misma
      dependencia de antes, cargada más tarde

### C4 — TDD
- [x] R15 tiene dos tests que lo nombran (`describe('R15: ...')`)
- [x] Historial test-primero real y **comprobado ejecutándolo**, no leído:
      `7b6b3b92` (solo test, +46 líneas) → `b6c3392e` (impl + adaptación del test
      de R10). Revertida la impl, el rojo falla hoy (§1)

### C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" salvo la de R12, que debe seguirlo
      (gate humano). En la 1ª vuelta la fila de R15 estaba "pendiente" y fue el
      motivo del rechazo; corregida en `48768ca6` y **reverificada** en §11
- [x] Los commits siguen el formato `<tipo>(<scope>): <desc> (R15)`

### C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] Enmienda E4 con la casilla humana marcada: `- [x] **E4 aprobada por humano** (fecha: 2026-09-20)`
- [x] Lo implementado corresponde a lo firmado: R6.2 corregido por entorno de
      ejecución + R15 sin efectos de importación, y la nota de E4 autoriza
      expresamente la carga perezosa ("si para cumplir R15 hace falta que
      `expo-notifications` se cargue de forma perezosa […] se hace, y el test lo fija")

### C7 — Sin código huérfano
- [x] El `setNotificationHandler` de nivel de módulo se eliminó, no quedó duplicado
- [x] Su aserto viejo (`notificationHandlerCallsAtImport`,
      `foregroundNotificationHandler` de nivel de fichero) se borró en el mismo
      commit verde; no quedan constantes muertas

### C8 — Carta de UI
- [x] N/A por vacío: el delta no toca un solo componente ni una sola cadena

---

## Observaciones (lo que hay que corregir)

Todo es de registro. **Ni una línea de código de la app necesita cambiar.**

1. **Bloqueante — `specs/mobile-push-registration/traceability.md:24`.** Rellenar
   la columna de commit de R15 con los dos hashes, en el mismo formato que las
   demás filas:

   ```
   | R15 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R15: importar el modulo no toca expo-notifications` | `7b6b3b92 test(mobile-push-registration): importing the hook must not touch expo-notifications (R15)` rojo → `b6c3392e feat(mobile-push-registration): keep expo-notifications out of module scope (R15)` verde |
   ```

   La fila de R12 se queda como está.

2. **`specs/mobile-push-registration/tasks.md` §R15** — las tres casillas del
   bloque siguen sin marcar (`- [ ]` en (1) Rojo, (2) Verde y (3) Refactor), pese
   a que las tres se hicieron.

3. **`progress/impl_mobile-push-registration.md`** — no menciona R15 ni E4
   (`grep -c "R15"` → `0`; fecha del fichero, 19-sep, anterior al delta). Falta
   la sección que relate el rojo, el verde y la verificación, como tienen R13 y
   R14.

4. **`progress/current.md`** — su última entrada es del 2026-09-19. Conviene
   añadir el cierre de E4/R15.

Con (1) hecho —y (2), (3) y (4) por higiene— esto se aprueba sin volver a mirar
el código: la verificación técnica de §1-§8 y §10 queda hecha y vale para el
árbol tal cual está (`git status` limpio, HEAD `b6c3392e`).

---

## Lo que NO puedo verificar y no doy por bueno

**El paso 11 del gate sigue siendo del humano.** Lo verificado aquí es que el
módulo ya no rompe al importarse y que en Expo Go el hook sale por su guard sin
tocar la librería — ambas cosas contra un **doble** de `expo-notifications` en
Jest, no contra Expo Go de verdad. Queda fuera de mi alcance, y nadie debería
darlo por cerrado sin dispositivo:

- Que la app **arranque** en Expo Go sobre un teléfono físico sin el `ERROR` del
  paso 11 y sin error visible (R15, criterio 4 de la feature).
- Que `Constants.executionEnvironment` valga efectivamente `'storeClient'` en el
  Expo Go real de SDK 57. El test lo simula con un mock de `expo-constants`; si
  el valor real fuese otro, el guard no dispararía y esto volvería a romper.
  **Es la única premisa de E4 que ningún test de este repo puede cerrar.**
- Que el banner de primer plano (paso 6) y el tap (pasos 7-10) sigan funcionando
  en el **dev build de Android**, donde sí hay registro.

Mi veredicto no sustituye ese gate: la fila de R12 sigue "pendiente" con razón.

---

# §11 — Segunda vuelta: reverificación de la trazabilidad (2026-09-21)

Reviso **solo** el motivo del rechazo, más la comprobación de que no se coló
código aprovechando el viaje. No repito §1-§10.

## La fila de R15 está rellenada y los hashes son reales

`specs/mobile-push-registration/traceability.md:24` en HEAD:

```
| R15 | `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R15: importar el modulo no toca expo-notifications` | `7b6b3b92 test(mobile-push-registration): importing the hook must not touch expo-notifications (R15)` rojo → `b6c3392e feat(mobile-push-registration): keep expo-notifications out of module scope (R15)` verde |
```

Mismo formato `<hash> <mensaje>` rojo → verde que el resto de la tabla.

**Los hashes no me los creo, los comprobé contra el historial.** Los sujetos
citados coinciden **literalmente** con los commits reales, no son una
reconstrucción de memoria:

```
$ git log --format="%h %s" -1 7b6b3b92
7b6b3b92 test(mobile-push-registration): importing the hook must not touch expo-notifications (R15)
$ git log --format="%h %s" -1 b6c3392e
b6c3392e feat(mobile-push-registration): keep expo-notifications out of module scope (R15)
```

Y ambos siguen en el historial de esta branch:

```
$ git merge-base --is-ancestor 7b6b3b92 HEAD   → 7b6b3b92 ES ancestro de HEAD
$ git merge-base --is-ancestor b6c3392e HEAD   → b6c3392e ES ancestro de HEAD
```

(Lo verifico yo aunque el coordinador ya lo dijera: un rebase posterior los
habría dejado colgando, que es la lección de #87. No ha habido rebase.)

## No queda ninguna fila "pendiente" indebida

```
$ grep -n "pendiente" specs/mobile-push-registration/traceability.md
25:| R12 | pendiente: gate humano sin test automático; ver `progress/impl_mobile-push-registration.md` §R12 | pendiente: no ejecutado |
27:Regla: el reviewer no aprueba si alguna fila queda "pendiente".
```

La única fila pendiente es la de **R12**, y **debe seguir estándolo**: es el gate
humano, el paso 11 no lo cierra ningún test. La línea 27 es el texto de la regla,
no una fila. **C5 cumplido.**

## El commit es solo de spec, y no hay drift de código

El diff de `48768ca6` sobre `traceability.md` es de **una línea**, exactamente la
de R15 (`-` pendiente / `+` los dos hashes). No toca la fila de R12 ni ninguna otra.

Comprobación de drift sobre **todo el repo**, no solo sobre el móvil — porque lo
que hay que descartar es que alguien colara código aprovechando un commit
etiquetado como "solo spec":

```
$ git diff --name-only b6c3392e..HEAD
progress/review_mobile-push-registration-r15.md
specs/mobile-push-registration/traceability.md

$ git diff --stat b6c3392e..HEAD -- mobile-pet-tracker/
(vacío)

$ md5sum mobile-pet-tracker/src/hooks/use-push-registration.ts
3cb731fd36e2f9dc7131f6edba243c08   ← idéntico al que verifiqué en la 1ª vuelta

$ git status --porcelain
(vacío)
```

Cero ficheros de código tocados en backend, infra o móvil. El árbol que aprueba
este veredicto es **byte a byte** el que pasó §1-§10, así que no hay que volver a
correr la suite: `bunx jest` 77/77 y `./init.sh` exit 0 siguen siendo la medición
vigente.

## Veredicto: **APROBADO** (delta de R15)

El delta de R15 (`7b6b3b92` rojo → `b6c3392e` verde) queda **aprobado**.

## Lo que sigue abierto (no bloquea, pero que no se pierda)

Los tres puntos de higiene de §Observaciones **siguen sin hacer**. Los comprobé
otra vez y no han cambiado:

```
$ sed -n '<bloque R15>' specs/mobile-push-registration/tasks.md | grep "^- \["
- [ ] **(1) Rojo** — ...          ← las tres casillas del bloque siguen sin marcar
$ grep -c "R15" progress/impl_mobile-push-registration.md   → 0
$ grep -c "R15\|E4" progress/current.md                     → 0
```

No los convierto en bloqueantes: en la 1ª vuelta los clasifiqué explícitamente
como higiene y cambiarles el rango ahora sería mover la portería. Pero constan,
y lo suyo es barrerlos en el commit de cierre de la feature:

1. `specs/mobile-push-registration/tasks.md` §R15 — marcar las casillas (1), (2) y (3).
2. `progress/impl_mobile-push-registration.md` — añadir la sección de R15/E4 (rojo,
   verde, verificación), como tienen R13 y R14. Hoy el relato de esta enmienda solo
   existe en este review.
3. `progress/current.md` — su última entrada sigue siendo la corrección de R10 del 19-sep.

## Y lo que este veredicto NO autoriza

**No marcar #79 como `done`.** Aprobar el delta de R15 no es aprobar la feature:

- La fila de **R12 sigue pendiente** y sigue siendo correcto que lo esté.
- El **paso 11 del gate** (arrancar en Expo Go sobre teléfono físico, sin el
  `ERROR` de `expo-notifications` y sin error visible) lo repite un humano. Lo que
  yo verifiqué es que el módulo ya no rompe al importarse **contra un doble de
  Jest**, no contra Expo Go real.
- Sigue en pie la única premisa de E4 que ningún test de este repo puede cerrar:
  que `Constants.executionEnvironment` valga efectivamente `'storeClient'` en el
  Expo Go real de SDK 57. Si valiera otra cosa, el guard de la línea 48 no
  dispararía y el paso 11 volvería a romper **exactamente igual que antes**, con
  toda la suite en verde. Es el primer sitio donde mirar si el gate falla otra vez.

`done` solo cuando el humano firme el paso 11.
