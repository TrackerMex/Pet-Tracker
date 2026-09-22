# review: mobile-meals-bar-motion (#106 + #107)

Fecha: 2026-09-22 04:24 UTC
Branch: `feature/106-mobile-meals-bar-motion` @ `0da308dc`
Base: `9df7b5bc` (merge del PR #144)

**Veredicto: RECHAZADO** — por el gate `./init.sh`, que sale **exit 1**.

El rechazo **no es de la implementación de Codex**. Los cinco requisitos están
implementados, candados y verificados contra mutación; el resto de `init.sh`
—build, tests, e2e, lint, typecheck— lo corrí a mano y está **todo verde**. Lo
que está rojo es el **estado del harness**, y lo puso el commit `62236243`, que
es mío, no de Codex. Dos causas, y la segunda solo asoma cuando se arregla la
primera.

Dictamen por entrada, condicionado a que el harness quede verde:

| Entrada | R-ids | Dictamen técnico |
|---|---|---|
| **#106** `mobile-meals-bar-motion` | R1–R4 | **Cerrable con una deuda registrada** (B1: los dos valores de la carta que R2 fija no los canda nadie) |
| **#107** `mobile-meal-toggle-press-lock` | R5 | **Cerrable sin reservas.** El candado resistió las cuatro mutaciones, incluidas las dos de acotado |

Ninguna se marca `done` aquí. Falta además la prueba de humo del humano en
**dev build de Android regenerado** (`expo-haptics` es módulo nativo).

---

## Bloqueante

### A1 — `./init.sh` sale exit 1: dos features en `in_progress`

`init.sh:156`. Medido **sin pipe**:

```bash
./init.sh > init_run1.log 2>&1
echo "EXIT_CODE_SIN_PIPE=$?"   # -> 1
```

```
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
❌ Más de 1 feature en in_progress (2). Resolver antes de continuar.
```

`62236243` puso `#106` y `#107` a `in_progress` a la vez, que es la
consecuencia directa de una spec para dos entradas. `init.sh` no contempla ese
caso: su check es `!= 1 → fail`.

**El script aborta ahí y nunca llega a build, tests, e2e, lint ni typecheck.**
Es decir: el gate no ha ejecutado ni una suite. Por eso las corrí yo (§Verificación
independiente).

### A2 — la segunda mina: `#107` no tiene directorio de spec propio

`init.sh:159-174` exige `specs/<name>/requirements.md` para toda feature
`in_progress`. El `name` de #107 en `feature_list.json` es
`mobile-meal-toggle-press-lock`, y sus requisitos viven en la spec de #106.
Simulé el bucle exacto del script:

```
FAIL -> Feature 'mobile-meal-toggle-press-lock' está in_progress pero falta
        specs/mobile-meal-toggle-press-lock/requirements.md
```

En cuanto A1 se resuelva bajando una de las dos a otro estado, si la que queda
`in_progress` es #107 el script vuelve a fallar aquí. Con `done` solo avisa
(`warn`), no falla — así que al cerrar no molesta; molesta **mientras** se
trabaja.

**Salida sugerida (decisión tuya, no mía):** cualquiera de las tres sirve —
(a) dejar solo #106 `in_progress` y #107 en `spec_ready` hasta el cierre;
(b) un `specs/mobile-meal-toggle-press-lock/requirements.md` de una línea que
apunte a la spec de #106; (c) enseñar a `init.sh` que varias entradas pueden
compartir spec. La (c) es la única que no se repetirá la próxima vez que una
spec cubra dos entradas.

---

## No bloqueante (deuda)

### B1 — R2 no canda ni la duración ni la curva

Es el hallazgo de fondo. `MEALS_BAR_DURATION_MS = 250` y
`MEALS_BAR_EASING = Easing.bezier(0.77, 0, 0.175, 1)` son **requisitos de R2**
y salen de la carta (§Animación: «250ms transición»), es decir de C8. No hay
ningún test que se ponga rojo si cambian:

| Sonda sobre `src/screens/home/index.tsx` | Resultado |
|---|---|
| `MEALS_BAR_DURATION_MS = 250` → `251` | **138/138 VERDE** |
| `MEALS_BAR_DURATION_MS = 250` → `2500` | **138/138 VERDE** |
| `Easing.bezier(0.77, 0, 0.175, 1)` → `Easing.bezier(0.23, 1, 0.32, 1)` | **138/138 VERDE** |
| borrar `reduceMotion: ReduceMotion.System` del config | **138/138 VERDE** |
| call-site: `withTiming(mealsPct, { duration: 251, ... })` en vez de `MEALS_BAR_TIMING` | ROJO (2 tests) |

Causa: `index.test.tsx:3806` asevera
`expect(mockWithTiming).toHaveBeenCalledWith(percentage, MEALS_BAR_TIMING)`
con `MEALS_BAR_TIMING` **importado del propio módulo de producción**. Mutar la
constante muta los dos lados de la igualdad: es una tautología.

**La sonda de Codex es correcta, no falsa.** Su reporte dice «la configuración
entregada a `withTiming` usó temporalmente `duration: 251` en vez de
`MEALS_BAR_TIMING`» — eso es la sustitución en el call-site, y reproduce
exacto (yo obtengo 2 rojos porque R3 ya existe; él informó 1 rojo y 136 verdes
sobre 137, que es el fichero sin R3 todavía). Lo que falla no es la honestidad
del reporte: es que **la sonda era demasiado débil para tocar lo que la carta
fija**.

Origen: R2 lo prescribió así («exportados desde `src/screens/home/index.tsx`
para que el test los compare **por identidad**»). Pero `design.md:108` cita
como precedente `weekly-activity-chart.test.tsx:927-944`, que **sí** canda los
literales:

```js
expect(mockWithSpring).toHaveBeenNthCalledWith(1, 152,
  expect.objectContaining({ duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System }));
```

La spec se contradice a sí misma y Codex tomó la lectura débil. Arreglo: una
línea, cambiar `MEALS_BAR_TIMING` por `expect.objectContaining({ duration: 250,
easing: MEALS_BAR_EASING, reduceMotion: ReduceMotion.System })`. No lo hago
bloqueante porque **el núcleo conductual de R2 sí está candado** (ver C4-R2
abajo) y porque exigirlo sería endurecer un requisito después de la firma.

### B2 — la pata de fuente de R5 tiene un agujero por anidamiento

`food.test.tsx:783-793` recorta el bloque con
`lastIndexOf('<Pressable', anchor)` … `indexOf('</Pressable>', anchor)`. Si se
**anida** un `<Pressable>` con la receta dentro del `meal-toggle`, el corte se
cierra en el `</Pressable>` del anidado y la regex casa igual:

| Sonda | Aserción de árbol | Aserción de fuente |
|---|---|---|
| quitar el `style` | ROJO | ROJO |
| reformatear a una línea | verde (correcto, es tolerante) | verde |
| `0.8` → `0.5` | verde (en reposo sigue siendo 1) | **ROJO** |
| mover a un `<Pressable>` hermano **posterior** | ROJO | ROJO |
| mover a un `<Pressable>` hermano **anterior** | ROJO | ROJO |
| mover a un `<Pressable>` **anidado dentro** | ROJO | **verde** ← agujero |

El par aguanta: en el único caso donde la regex se deja engañar, la aserción de
árbol lo caza. R5 cumple. Queda anotado por si alguien reusa el patrón de
recorte en un fichero con `Pressable` anidados de verdad.

### B3 — dos piezas del doble ampliado son peso muerto, y una baja la fidelidad

Codex amplió el doble prescrito en `design.md:108`. Medí pieza a pieza sobre
`index.test.tsx`:

| Quitar… | Resultado |
|---|---|
| `withRepeat` + `withSequence` + `withSpring` | **16 tests rojos** → justificado, hacía falta |
| `jest.mock('heroui-native')` (el `Skeleton` falso) | **138/138 verde** → innecesario |
| `default: { ...actual.default, View }` | **138/138 verde** → innecesario |

El mock de `heroui-native` sustituye un componente real de terceros por un
`View` en **los 138 tests del fichero**, incluido `#62 R8`, que es justo el que
asevera el `className` del `Skeleton` de carga. Hoy no esconde ningún fallo
(pasa con y sin él), pero es fidelidad perdida a cambio de nada. La justificación
del reporte («el `default.View`/`__esModule` requerido por HeroUI y un
`Skeleton` host») no se sostiene en el estado final del árbol.

### B4 — a partir de #100, todo R-id de tres cifras choca con el guard de hex

`design-drift.test.ts:197` usa `/#[\da-f]{3,8}\b/i`. `#98`, `#87`, `#78`, `#73`,
`#70`, `#69`, `#68`, `#65`, `#62` tienen dos cifras y nunca casaron. `#106` y
`#107` tienen tres y casan como color hexadecimal. Codex lo esquivó partiendo
la cadena:

```js
describe('#' + '106 R2: la barra de comidas transiciona su ancho', () => {
```

Funciona y el nombre en runtime es el correcto (verificado, ver C4). Dos
consecuencias:

1. **`grep -rn '#106 R2' src/` no lo encuentra.** Quien verifique C4 por grep se
   lleva un falso negativo. Los tres describes de `food.test.tsx` sí son
   literales, porque ese fichero no está en las listas de `design-drift`.
2. El reporte de Codex (§4, punto 3) dice que aplicó «el patrón de concatenación
   **ya existente** en `design-drift.test.ts`». **No existía**:
   `grep -rn "'#' *+\|fromCharCode" src/` devuelve solo sus dos líneas nuevas.
   Es invención suya, razonable, pero no un precedente.

Esto se repetirá en **toda** feature de tres cifras que toque un fichero
vigilado. Merece una línea en `docs/conventions.md`.

### B5 — Codex no tenía las skills de Expo

Su reporte (§4, punto 4): el catálogo de su plugin no contiene `expo-overview`
ni `expo-animation`; usó `expo:building-native-ui`. El resultado técnico es
correcto —los valores de R2 salen de la carta y de la tabla §8 que la spec
transcribió literalmente, así que no dependían de la skill— pero el handoff
asumió un entorno que no era el real. Para el próximo handoff móvil: verificar
el catálogo de Codex antes, o seguir transcribiendo lo que haga falta en la
spec, como se hizo aquí.

---

## Checklist

### C2 — Estado coherente
- [ ] Solo 1 feature `in_progress` → **2** (#106 y #107). Es A1.
- [x] `progress/current.md` actualizado y coherente con la sesión

### C3 — Arquitectura
- [x] N/A en el fondo (no hay capas de dominio en móvil), pero sin fugas: el
      haptic vive en el route `food.tsx` junto a la acción que lo causa, y la
      animación en la pantalla que la pinta. Ninguna lógica nueva en `api/`.

### C4 — TDD, requisito por requisito
Hice checkout de **cada commit rojo** y lo corrí. Ninguno es un rojo de mentira:

| R | Rojo | Verificado | Verde | Qué falló exactamente |
|---|---|---|---|---|
| R1 | `91adccde` | exit 1 | `e14dd598` exit 0 | 1 rojo / 30 verdes — solo el test nuevo |
| R4 | `47945153` | exit 1 | `205d8682` exit 0 | 4 rojos / 32 verdes — los 4 de acción |
| R5 | `8fb833c9` | exit 1 | `83a63821` exit 0 | 2 rojos / 36 verdes — opacidad ausente y receta ausente |
| R2 | `a616ce07` | exit 1 | `03c68786` exit 0 | 3 rojos / 134 verdes — los 2 candados declarados de #98 + el nuevo |
| R3 | `592a5046` | exit 1 | `3626b779` exit 0 | 1 rojo / 137 verdes — solo el test nuevo |

- [x] Cada R tiene su test y su rojo real, sin daño colateral
- [x] Historial test-primero: `test:` → `feat:` → `docs:` por R-id, 18 commits
- [x] Los describes nombran su R-id **en runtime** (comprobado con `--verbose`):
      `#106 R1`, `#106 R2`, `#106 R3`, `#106 R4`, `#107 R5` — ver B4 sobre el grep

**R5, vía (b) de C4** — el rojo `8fb833c9` mutó **producción** (`-3` líneas en
`food.tsx`) y el verde las repuso:

```bash
git diff --stat 378c7aa5..83a63821 -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'
# vacío, exit 0  → diff neto de R5 CERO
```

**Las sondas de mutación, repetidas por mí** (no acepté las del reporte):

| Sonda | Reporte de Codex | Mi resultado |
|---|---|---|
| R2 — animación quitada del todo (View plano + width estático, como #98) | no la hizo | **ROJO, 4 tests** |
| R2 — `withTiming` sustituido por valor instantáneo | no la hizo | **ROJO, 2 tests** |
| R2 — config literal `251` en el call-site | ROJO | **ROJO** (reproduce) |
| R2 — la constante `250` → `251` / `2500` | — | **verde** → B1 |
| R3 — guarda de reduce motion quitada | no la hizo | **ROJO, 1 test** |
| R4 — `Success` → `Error` | ROJO, 3 tests | **ROJO, 3 tests** (reproduce) |
| R4 — haptic quitado entero | no la hizo | **ROJO, 4 tests** |
| R5 — `style` quitado | ROJO, 2 tests | **ROJO, 2 tests** (reproduce) |
| R5 — 4 variantes de acotado | no las hizo | 3 ROJO, 1 agujero → B2 |

Respuesta directa a «¿pasa el test si la animación se quita?»: **no**. Ni
quitándola entera, ni sustituyendo `withTiming` por el valor instantáneo. El
candado conductual de R2/R3 es real. Lo que no canda son los dos números (B1).

### C5 — Trazabilidad
- [x] Sin filas «pendiente» (el único hit es la frase de la cabecera :12)
- [x] Los 10 hashes son ancestros de HEAD (`git merge-base --is-ancestor` ×10)
- [x] Commits con formato `feat(mobile): <desc> (R<n>)`

### C6 — Spec aprobada, y nada firmado reescrito
- [x] `requirements.md` con `status: approved` y casilla `[X]` marcada
- [x] **Codex no tocó ninguna spec** salvo `traceability.md`:
      `git diff --name-only 62236243..HEAD -- specs/` → solo `traceability.md`
- [x] Las cinco specs viejas que dicen que `expo-haptics` no está instalado,
      **intactas** (0 commits sobre las 7 rutas: `mobile-device-pairing`
      ×2, `mobile-home-weekly-activity`, `mobile-home-reminders-section`,
      `mobile-tab-glass`, `mobile-meals-served-ui` ×2)
- [x] `requirements.md` después de `ca13a804`: solo `62236243`, y solo el
      frontmatter `spec_ready → approved`, que es el flujo del repo. Sin rebote.

### C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza ni deprecia nada

### C8 — Carta de UI
- [x] `docs/ui-guidelines.md:171` enmendada con **la redacción exacta** de R1,
      verbatim, seis líneas, sin desviación
- [x] La carta ya no afirma que `expo-haptics` no esté instalado
- [x] `prefers-reduced-motion` **realmente respetado**: la guarda explícita
      existe y está candada (quitarla pone R3 rojo). La segunda capa,
      `ReduceMotion.System` en el config, existe pero no la canda nadie (B1)
- [x] `progress/audit_animations_mobile.md`: **una sola** nota al final,
      `## Nota de #106 (2026-09-21)`, con los tres hechos caducados. Exacto.
- [x] Sin claves de copy nuevas (D7): `src/i18n/` y
      `language-provider.test.tsx` intactos, la suma `260 + 16 + 1 + 4 + 7 + 14
      + 2 + 1 + 4` sin tocar. Coherente: ni clave nueva ni suma movida.

### Los dos candados de #98 que la spec autorizó mover
Contrastados uno a uno contra `git diff 9df7b5bc..HEAD` sobre los ficheros de
test. **Cambiaron exactamente dos aserciones, las dos autorizadas:**

| Línea | Antes | Ahora | ¿Autorizado? |
|---|---|---|---|
| `:3697`→`:3742` | `expect(fill.props.style).toEqual({ width: '50%' })` | `expect(fill).toHaveAnimatedStyle({ width: '50%' })` | **sí**, R2 tabla |
| `:3716-3718`→`:3761-3763` | `expect((await …).props.style).toEqual({ width })` | `expect(await …).toHaveAnimatedStyle({ width })` | **sí**, R2 tabla |

- [x] `:3696` (`className`) **intacto**, igual que `props.testID`
- [x] Ninguna otra aserción movida, relajada ni borrada en ningún fichero de test
- [x] Lo único que se añadió aparte de los tests nuevos son los mocks de B3

### R1 — la dependencia nueva
- [x] `package.json`: `"expo-haptics": "~57.0.3"`, mayor 57 = mayor de `expo` (`~57.0.14`)
- [x] `bun.lock` con la entrada resuelta `expo-haptics@57.0.3` y su integridad
- [x] Consistente con `bunx expo install`: `node_modules/expo/bundledNativeModules.json:50`
      pide `~57.0.1` y el instalador resolvió `57.0.3`, la más alta que lo
      satisface, insertada en orden alfabético. Una versión escrita a mano
      habría copiado el `~57.0.1` del manifiesto.
- [x] **No** existe `babel.config.{js,cjs,ts}` ni `.babelrc*` (R1 lo veta, y su
      propio test lo canda)
- [x] `app.json` intacto: ninguna entrada nueva en `plugins`

---

## Riesgo de conflicto con #94 (pregunta 8): **ninguno**

PR #143 está en `origin/main` (`3a52028b`). Comprobado en dos niveles:

1. **Textual**: `git merge-tree --write-tree HEAD origin/main` → exit 0, sin
   conflictos. Los ficheros de #94 (`map.tsx`, `device-connectivity.ts`,
   `design-drift.test.ts`, `ui-copy-table.ts`, `ui-language.test.ts`) no los
   toca esta branch. `feature_list.json` lo tocan las dos pero en entradas
   distintas y git lo resuelve solo.
2. **Semántico** (que era el riesgo real, porque `design-drift.test.ts` escanea
   `index.test.tsx`): hice el merge de verdad en una branch temporal y corrí
   todo:

```
merge origin/main        → exit 0, sin conflictos
bunx jest (merged)       → exit 0 — 77 suites, 1396 tests
bunx tsc --noEmit        → exit 0
```

Los guards de drift que #94 añadió **no** se disparan con el `'#' + '106'`. La
branch temporal se borró; el árbol quedó limpio.

---

## Verificación independiente

`./init.sh` aborta en la sección 4 y no llega a ejecutar nada. Corrí a mano
todas las patas que se salta, con los comandos de `init.config.sh`:

| Pata | Comando | Exit | Resultado |
|---|---|---:|---|
| `BUILD_CMD` | backend build + `cdk synth` | **0** | — |
| `TEST_CMD` backend | `pnpm -C backend-pet-tracker test` | **0** | 170 suites, 1295 tests |
| `TEST_CMD` infra | `pnpm -C infra test --runInBand` | **0** | 2 suites, 14 tests |
| `TEST_CMD` harness | `node --test` ×3 | **0** | 28 + 5 + 15 pass, 0 fail |
| `TEST_CMD` móvil | `bun run --cwd mobile-pet-tracker test` | **0** | **77 suites, 1379 tests** |
| `E2E_CMD` | `pnpm -C backend-pet-tracker run test:e2e` | **0** | 27 suites, 384 tests (3 skip) |
| `LINT_CMD` | backend + infra + `expo lint` | **0** | — |
| `TYPECHECK_CMD` | backend + infra + `tsc --noEmit` | **0** | — |

Delta móvil contra `9df7b5bc`: **+10 tests, +0 suites, +0 rojas** — coincide con
el reporte de Codex. `pgrep` limpio antes de arrancar: ningún `init.sh` ni jest
en vuelo en los otros worktrees. `.expo/types/router.d.ts` borrado antes de cada
`tsc`. Árbol limpio al terminar la revisión (`git status --porcelain` vacío,
HEAD sigue en `0da308dc`).

### Output de `./init.sh`

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
[pnpm backend: Already up to date]
[pnpm infra:   Already up to date]
[bun mobile:   Checked 1324 installs across 1145 packages (no changes)]
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
❌ Más de 1 feature en in_progress (2). Resolver antes de continuar.
```

```
EXIT_CODE_SIN_PIPE=1
```

---

## Qué falta para cerrar

1. Resolver A1 y A2 y volver a correr `./init.sh` hasta exit 0. Es lo único
   bloqueante y no toca código de la app.
2. Registrar B1 como deuda (o pedir el arreglo de una línea antes de la PR:
   cambiar la comparación por identidad de `index.test.tsx:3806` por
   `expect.objectContaining({ duration: 250, … })`, que es lo que ya hace el
   precedente que la propia `design.md` cita).
3. B2, B3, B4 y B5 como deuda.
4. Prueba de humo del humano, **dev build de Android regenerado** — los 7 pasos
   de §Prueba de humo, con el paso 0 obligatorio.

Verificado también lo que ya habías mirado tú, y **coincide en los cuatro
puntos**: los 10 hashes son ancestros, la tabla no tiene filas pendientes, el
`style` pressed está intacto en producción con diff neto cero por R5, y
`docs/ui-guidelines.md:171` está enmendada con la redacción exacta.
