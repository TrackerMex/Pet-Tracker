# review: android-maps-api-key (#52)

Fecha: 2026-08-28
Commit revisado: `8517c33` (`origin/feature/52-android-maps-api-key`)
Rango: `60aefe0..8517c33`
Método: worktree detached propio + `./init.sh` re-ejecutado por el reviewer
+ **prebuild real de Android** (ver §Verificación independiente)

**Veredicto: APROBADO**
**Condición de cierre**: NO marcar #52 `done` hasta que el humano cierre R6
(smoke en el dev build) y marque la segunda casilla de
`specs/android-maps-api-key/requirements.md` §Aprobación. La feature debe
seguir `in_progress` hasta entonces.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`#52 android-maps-api-key`) — confirmado
      por `feature_list.json` y por el aviso de `init.sh`
- [x] `progress/current.md` actualizado (sección Codex 2026-08-28 04:21 UTC)
- [x] `STATUS.md` sincronizado con `feature_list.json` (46/52) — verificado
      por `init.sh`
- [x] #52 sigue `in_progress`, correcto: el gate humano R6 está abierto

## Checklist C3 — Arquitectura

- [x] **N/A justificado**. Feature de configuración de build: el diff no
      toca `mobile-pet-tracker/src/**` ni `backend-pet-tracker/**`, así que
      las capas domain/application/infrastructure de `docs/architecture.md`
      no entran en juego. La propia spec lo declara y lo verifiqué:
      `git diff --stat origin/main HEAD -- mobile-pet-tracker/src` está
      **vacío** (0 archivos).

## Checklist C4 — TDD

- [x] Cada R tiene test que lo nombra: `app.config.test.ts` declara
      `describe('R1: ...')`, `describe('R2: ...')`, `describe('R3: ...')`
- [x] Historial rojo→verde por R-id, **no** todo junto. 18 commits, con el
      test rojo commiteado ANTES de la implementación en los tres R con
      test:

  | R | Rojo (test primero) | Verde (implementación) |
  |---|---|---|
  | R1 | `4396b75 test(...): define config injection in red (R1)` | `28906d4 feat(...): inject Android Maps plugin (R1)` |
  | R2 | `8be06f1 test(...): define missing-key warning in red (R2)` | `7d1778c feat(...): warn without empty plugin (R2)` |
  | R3 | `729dc24 test(...): define secret-free env contract in red (R3)` | `e4512ad docs(...): document private build key (R3)` |

  Esto corrige el incumplimiento de #19 citado en `CLAUDE.md`: aquí sí hay
  historial rojo→verde separado.
- [x] R4/R5 sin test propio, correcto y previsto por la spec (documentación
      y verificación); R4 tiene "rojo" verificable documentado
      (`rg "Feature 52" docs/verification.md` → exit 1 antes de escribirla)
- [x] Ninguna suite previa modificada ni borrada: `src/**` byte-idéntico a
      `origin/main`; el único archivo de test nuevo es `app.config.test.ts`
      (49 → 50 suites móviles)

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" para lo que cierra la IA
      (R1–R5 con test y commits). La fila R6 dice "pendiente" **por diseño**:
      es el gate humano explícito de la spec, no una fila sin cerrar por el
      implementer. Lo trato como cumplido según la regla que la propia
      `traceability.md` fija para R6
- [x] Commits siguen `<tipo>(<scope>): <desc> (R-ids)`
- [ ] Nota menor (no bloqueante): el frontmatter de `traceability.md` y
      `tasks.md` dice `status: draft`. Es el valor por defecto de la
      plantilla y está igual en otras features ya cerradas
      (`pet-reminders`, `reminders-api`, `weight-single-source-of-truth`),
      así que es deriva del harness, no de #52. La aprobación real vive en
      `requirements.md`

## Checklist C6 — Spec aprobada

- [x] `specs/android-maps-api-key/requirements.md` con `status: approved`
- [x] Casilla humana marcada: `[X] Aprobado por humano (fecha: 2026-08-27)`
- [x] Segunda casilla (R6 smoke) correctamente **sin** marcar
- [x] `design.md` con D1–D8 y `tasks.md` con todas las tareas de IA en `[x]`
      y solo las dos tareas **HUMANO** de R6 en `[ ]`

## Checklist C7 — Sin código huérfano

- [x] **N/A** — la feature es puramente aditiva (un archivo de config nuevo,
      su test, una línea de `.env.example`, documentación). No reemplaza ni
      deprecia ningún componente, módulo ni test existente. `app.json` se
      mantiene deliberadamente como base estática (D2) y quedó sin cambios

## Checklist C8 — Carta de UI móvil

Aplica formalmente (el diff toca `mobile-pet-tracker/`), pero casi todos sus
ítems son vacuos porque no entra una sola línea de JSX:

- [x] Grep-clean sin regresión: 0 `StyleSheet.create`, 0 clases arbitrarias
      `[...]`. Los 8 hex fuera de `src/theme/` son **preexistentes** y viven
      todos en `src/app/(tabs)/__tests__/*.tsx` (mocks de `useThemeColors` y
      del `customMapStyle`); `src/` es byte-idéntico a `main`, así que el
      grep-clean no puede haber cambiado
- [x] Dimensiones / Skeleton / componentes compartidos / touch targets —
      **N/A**: la feature no crea ni modifica pantallas ni componentes

---

## Verificación independiente (no me fié del reporte)

### R1 — inyección de la clave

Resolví la config real, no solo el test:

```
GOOGLE_MAPS_API_KEY_ANDROID='  AIzaFAKEreviewkey123  ' bunx expo config --type prebuild --json
```

- `plugins` = las tres entradas de `app.json` + `["react-native-maps",
  {"androidGoogleMapsApiKey":"AIzaFAKEreviewkey123"}]` **al final**
- `trim()` aplicado (entré la variable rodeada de espacios)
- `android.package` = `com.trackermex.pettracker`, `experiments` y demás
  claves de `app.json` conservadas
- `android.config` = `undefined` → **el campo muerto NO se usa**, como pedía
  el encargo

### R1/R2 — prebuild REAL de Android (lo que la spec dejaba al humano)

La spec dejaba la comprobación decisiva a R6 paso 5 ("verificado por lectura
del código, no por ejecución"). La ejecuté:

```
$ bunx expo prebuild --platform android --no-install     # con clave
$ grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
1
$ grep -n "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
16:    <meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaFAKEreviewkey123"/>
```

**La meta-data sobrevive la cadena de mods y llega al manifest generado con
el valor correcto.** El riesgo central de la feature (que el `app.plugin.js`
de `react-native-maps` 1.27.2 borrase la meta-data) queda descartado
empíricamente, no por lectura de código.

Y el camino sin clave (R2), también en prebuild real:

```
$ unset GOOGLE_MAPS_API_KEY_ANDROID && bunx expo prebuild --clean --platform android
exit=0                                    # no lanza
GOOGLE_MAPS_API_KEY_ANDROID no está definida; ... Consulta docs/verification.md §Feature 52 ...
$ grep -c "com.google.android.geo.API_KEY" .../AndroidManifest.xml   → 0
$ ls android/app/debug.keystore                                       → 2257 b
```

Esto valida la razón de ser de "avisar, no lanzar" (D4): **el primer prebuild
sin clave sí genera `debug.keystore`**, de donde el humano saca la SHA-1 del
paso 2 de R4. El flujo documentado funciona de verdad.

Detalle menor, sin acción: el aviso sale 4 veces en un `prebuild` (Expo
resuelve la config varias veces). R2 exige un `console.warn` *por
resolución*, que es lo que assertea el test; no es incumplimiento, solo
ruido cosmético.

### R2 — visibilidad del aviso

Con `expo config --json` el aviso no aparece: Expo silencia los logs para no
romper el JSON de stdout. En el modo normal (`expo config`, `prebuild`,
`run:android` — los que usa el humano) el aviso **sí** sale por stderr,
literal y completo. Comportamiento del CLI, no defecto.

### R3 — el secreto no entra al repo

- `.env.example`: `GOOGLE_MAPS_API_KEY_ANDROID=` sin valor, con comentario
  que remite a `docs/verification.md` §Feature 52
- Sin prefijo `EXPO_PUBLIC_` (correcto: con él Expo la inlinearía en el
  bundle JS, legible abriendo el APK)
- `git grep -E "AIza[0-9A-Za-z_-]{10,}"` sobre el árbol: **0 coincidencias**
  fuera de `specs/`/`docs/` (donde solo aparece el patrón regex, no una clave)

### R4 — runbook

`docs/verification.md` §Feature 52 tiene los seis pasos, en orden, con los
comandos **literales** de la spec: `gradlew signingReport`, el `keytool` con
`-J-Duser.language=en` (el flag obligatorio en locale español), el
`grep -c` del manifest esperando `1`, y la nota de EAS marcada como
documentada-no-implementada. Coincide con la lista de R4 sin parafrasear.

### R5 — verde, ejecutado por mí

`./init.sh` desde la raíz, **exit 0**:

```
✅ node / pnpm / bun disponibles      ✅ .env encontrado, DATABASE_URL definida
✅ Dependencias instaladas            ✅ Archivos del harness presentes
⚠️  Feature en progreso: android-maps-api-key
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 150 passed, 150 total     Tests: 1153 passed   (backend)
Test Suites:   2 passed,   2 total     Tests:   14 passed   (infra)
Test Suites:  50 passed,  50 total     Tests:  545 passed   (móvil)
✅ Tests pasados
Test Suites: 3 skipped, 21 passed, 21 of 24 total
Tests:       8 skipped, 336 passed, 344 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 46/52 completadas | 5 pendientes

INIT_EXIT=0
```

Contención del diff verificada: `app.json`, `eas.json`, `package.json`,
`bun.lock`, `src/**` y `backend-pet-tracker/**` con **0 archivos** de cambio.
Cero dependencias nuevas.

### R6 — gate humano

Correctamente **pendiente**. `tasks.md` deja las dos tareas HUMANO en `[ ]`,
la segunda casilla de §Aprobación sin marcar, y el reporte cierra con
"PENDIENTE — no marcar #52 `done` todavía". No lo evalúo como incumplimiento.

Mi prebuild real ya adelanta el paso 1 y el `grep` del paso 5 (dan `1` y `0`
según corresponde), así que al humano le queda lo que de verdad solo él
puede hacer: crear la clave restringida en Google Cloud y comprobar en el
dispositivo que renderizan los tiles y que `adb logcat` queda limpio.

---

## Los cuatro puntos que se me pidió juzgar

### 1. Codex no pudo cargar la skill `expo-overview` — impacto: NULO

**No lo convierto en rechazo, y no por indulgencia: por evidencia.**

`CHECKPOINTS.md` C8 dice que aplica a features que tocan
`mobile-pet-tracker/`, y sus ítems son todos de UI: dimensiones de pantalla,
Skeleton vs Spinner, componentes compartidos, touch targets ≥ 44pt,
grep-clean. Esta feature no crea ni toca **una sola línea de JSX**: es un
`app.config.ts`, un test de nivel Node, una línea de `.env.example` y
documentación. `src/` quedó byte-idéntico a `main`.

Busqué específicamente qué habría aportado la skill y no encontré nada:

- El patrón implementado (`export default ({ config }: ConfigContext):
  ExpoConfig`, `app.json` como base estática, plugin declarado
  explícitamente) **es** el que documenta Expo para SDK 57, y lo verifiqué
  contra el comportamiento real del CLI, no contra la doc.
- El runbook de R4 usa el camino estándar de dev build
  (`expo prebuild` + `expo run:android`), que ejecuté y funciona.
- Grep-clean C8 limpio y sin posibilidad de regresión.

**Dictamen: incumplimiento formal del handoff, cero impacto en el
resultado.** No pido re-trabajo. Para el futuro, la carta gana si dice
explícitamente que C8 y la carga de skills aplican a features que tocan
*UI* de `mobile-pet-tracker/`, no a cualquier archivo bajo esa carpeta —
así una feature de config de build no arrastra un requisito vacuo.

### 2. `docs/conventions.md` +1 línea — convención obligatoria, NO scope creep

Decidido con la fuente, no por criterio. `docs/conventions.md`
§Variables de entorno abre con:

> "Toda variable nueva se añade a esta tabla y a `.env.example` **en el mismo
> commit que la introduce** (regla dura de `AGENTS.md` §4)."

Es una regla dura del repo. Además Codex la cumplió al pie de la letra: la
fila de la tabla y la línea de `.env.example` entraron **en el mismo commit**
(`e4512ad`), que es exactamente lo que la regla exige.

**Dictamen: correcto y obligatorio.** El defecto está en la spec, no en la
implementación: `design.md` §Archivos afectados y la allowlist de R5 omiten
`docs/conventions.md` pese a que introducir una env var lo hace inevitable.
Es una omisión del `spec_author` que conviene corregir en la plantilla, para
que la próxima spec con env var no ponga al implementer a elegir entre dos
reglas del repo.

### 3. Codex escribió en `progress/current.md` — incidencia de proceso, no bloqueo

Verificado con `git diff`: la sección de Codex es **puramente aditiva** (+39
líneas, 0 borradas). La sección del leader ("Sesión 2026-08-27/28 (leader =
sesión Backend)") queda intacta justo debajo. El contenido es correcto y
útil: documenta el rojo→verde de cada R.

**Dictamen: anotado como incidencia de proceso, sin efecto.** `CLAUDE.md`
asigna `progress/current.md` al leader; el handoff debería decirle a Codex
que escriba solo en `progress/impl_<feature>.md`. Como no borró nada y no
hubo colisión de escritura, no bloquea.

### 4. El flake de `add-pet` es realmente preexistente

Confirmado por tres vías independientes:

1. **Byte-idéntico a `main`**: `git diff --stat origin/main HEAD --
   mobile-pet-tracker/src/screens/add-pet` está vacío. Es más, **todo**
   `mobile-pet-tracker/src/` está vacío de cambios. #52 no puede haberlo
   causado — no tocó el archivo ni nada que este importe.
2. **No reprodujo en mi `./init.sh`**: 50 suites / 545 tests móviles en
   verde a la primera, `add-pet` incluida.
3. **5 corridas dirigidas seguidas**: 7/7 tests en verde las cinco veces.

Causa probable, para el backlog (no para #52): la config de jest móvil no
declara `clearMocks`/`resetMocks`/`restoreMocks`, y
`mockLaunchImageLibrary.mockResolvedValue(...)` se fija en un único punto
(`src/screens/add-pet/index.test.tsx:217`) en vez de en un `beforeEach`. Un
mock de `expo-image-picker` sin valor de retorno devuelve `undefined`, que
es exactamente el síntoma que reportó Codex.

**Dictamen: hallazgo para el backlog, no fallo de #52.** Sugiero entrada
propia: "endurecer los mocks de `add-pet` (mover `mockResolvedValue` a
`beforeEach` o activar `resetMocks` en la config de jest móvil)".

---

## Observaciones

Ningún problema bloqueante. Tres apuntes, todos fuera del alcance de #52:

1. **Deuda de spec (no de implementación)**: `design.md` D1 afirma que
   `android.config.googleMaps.apiKey` "no funciona en este proyecto". Lo
   probé como contrafactual en un prebuild real y **sí** escribe la
   meta-data: en este proyecto `_internal.autolinkedModules` no incluye
   `react-native-maps`, así que `createLegacyPlugin` cae al fallback
   `withGoogleMapsApiKey` y la rama destructiva del plugin versionado nunca
   corre. Esto **no cambia el veredicto ni la decisión**: la vía elegida es
   la documentada por Expo, funciona (verificado), y es la única que puede
   cumplir R3, porque `android.config.googleMaps.apiKey` vive en `app.json`,
   que **está commiteado** — meter ahí la clave la publicaría en el repo.
   La decisión es correcta; solo su justificación técnica es inexacta.
2. **Frontmatter `status: draft`** en `tasks.md` y `traceability.md`, deriva
   común del harness (ver C5).
3. **Flake de `add-pet`** → backlog (punto 4).

## Condición única para cerrar

Que el humano ejecute R6 en su dev build de Android, registre el resultado
en `progress/impl_android-maps-api-key.md` (sin pegar la clave) y marque la
segunda casilla de §Aprobación. Solo entonces #52 pasa a `done` y se
desbloquea el gate R9 de #45 `pet-lost-mode`.
