# review: mobile-nutrition-questionnaire (#209)
Fecha: 2026-10-27
Veredicto: RECHAZADO
Reviewer: subagente `reviewer` (primera revisión)
Branch: feature/209-mobile-nutrition-questionnaire
HEAD revisado: 8aec187f (base congelada; cualquier commit posterior no está cubierto)
Base del handoff: fe624698 (origin/dev mergeado en b81edb2b)

## Bitácora de verificación (se escribe según avanzo)

### Estado y spec (C2, C5, C6)
- `requirements.md` y `traceability.md`: `status: approved`; casilla `- [x] Aprobado por humano (fecha: 2026-10-26)` (firma delegada). Casilla de smoke sin marcar: es del humano y bloquea `done`, no el veredicto.
- `traceability.md`: 0 filas «pendiente»; los 50 hashes citados son ancestros de HEAD.
- Merge `b81edb2b`: padres `d59d82ba` (rama) y `fe624698` (= `origin/dev`). `8aec187f` solo toca el reporte.

### Punto 5 — lista cerrada
- `git diff --name-only fe624698 HEAD -- mobile-pet-tracker docs` = exactamente las 24 rutas del handoff (Cierre, sin reporte ni traceability), en su orden.
- Intactos (Adenda 4 §5): `intactos`. Fuera de `mobile-pet-tracker`/`docs` solo cambian `feature_list.json`, `progress/*` de #209 y `specs/mobile-nutrition-questionnaire/*`.

### Punto 2 — merge b81edb2b
- Producción (9 ficheros): por fichero, el conjunto de líneas `+`/`-` de `git diff b185ae61 da5e5eef` (lado #209) es idéntico al de `git diff fe624698 HEAD`, y el de `git diff b185ae61 fe624698` (lado dev) idéntico al de `git diff da5e5eef HEAD`. Merge base real `b185ae61`. La producción es la unión exacta.
- `screens/food/index.tsx`: se mantiene la estructura de #222 (`TabPetHeader` fijo fuera del `ScrollView`, sin título). El bloque `food-profile-empty` sigue siendo hermano inmediatamente anterior de `food-plan-empty`, con el mismo padre que en `da5e5eef`.
- Fila `screens/food/index.tsx` en el inventario `tracking-title` de `#174 R12`: `tracking-title` en food = 1 en `b185ae61`, 2 en `da5e5eef`, 0 en `fe624698` (#222 R9 quitó el título y dev sacó food de la lista), 1 en HEAD (solo el título de R19). La lista es la de dev más el delta de #209: no tapa nada. Es una igualdad exacta de conjuntos (`toEqual`), así que la fila es obligatoria.

### Guardas (punto 5, segunda mitad)
- `#209` en los 9 ficheros de producción: 0 en todos (ni siquiera `#209 R<n>`).
- `grep -cP '#209(?! R[0-9])'` en los 14 ficheros de test tocados: 0 en todos.
- Import de bottom-sheet en NQP: 0. `StyleSheet` en el test de NQP: 0. Ruta `app/(protected)/nutrition-profile.tsx`: 1 línea, re-export de `NutritionQuestionnaireScreen`.

### Producción leída (R1–R18, R25)
- `http.ts` `putJson` (misma forma que `patchJson` con PUT), `types.ts` `NutritionProfileInput`, `nutrition.ts` `upsertNutritionProfile` (guarda de config, switch de estado, 200 con `readJson`/`isObjectBody`): conformes con R1–R2.
- `_layout.tsx`: `nutrition-profile` con `headerShown: false`, último hijo protegido tras `edit-profile` (R3).
- `screens/nutrition-questionnaire/index.tsx` (493 líneas): forma de R25 (6 `style={CONTINUOUS_CORNER}`, 2 `TextInput`, un `useChunkyLip`, los componentes que nombra la spec), raíz KAV + `ScrollView keyboardShouldPersistTaps="handled"` (R18), `usePreventRemove(phase === 'form' && step !== 'activity', …)`, validación de peso y kcal, `healthItems` con dedup + `slice(0,20)` + corte a 100, `buildInput` que omite `targetWeightKg` salvo condición ≥ 7, flujo PUT → invalidar perfil → Generando → generar → invalidar plan + `router.back()`, mapeo de errores de R17.
- Menor (sin bloqueo): la rama de error de carga devuelve un `<Text testID="nutrition-questionnaire-load-error">` suelto, sin contenedor de pantalla ni padding.

### Hallazgo F1 (ALTA, bloqueante) — Pingo con `className` sobre `expo-image`: 0×0 en dispositivo
- Tres `Image` de `expo-image` reciben el tamaño solo por `className`:
  - `mobile-pet-tracker/src/screens/food/index.tsx:456` — `<Image source={require('…/pingo-food.webp')} className="size-37.5" />` (R19, `food-profile-pingo`);
  - `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx:244` — `className="size-28"` (Generando, `nutrition-generating-pingo`);
  - `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx:368` — `className={step === 'condition' ? 'size-11' : 'size-13'}` (avatar de la burbuja).
- Uniwind solo da `className` a los componentes de `react-native`: su resolver de Metro reescribe `moduleName === "react-native"` a `uniwind/components` (`node_modules/uniwind/dist/metro/index.cjs:96-104`); para terceros exige `withUniwind` (`dist/module/index.d.ts:6`), que el repo no usa en ningún sitio. `expo-image` pinta `NativeExpoImage` (`requireNativeViewManager('ExpoImage')`) con `style={StyleSheet.flatten(style)}` (`node_modules/expo-image/src/ExpoImage.tsx`): el `className` llega al view manager nativo y se ignora. El tipo compila porque Uniwind aumenta `ViewProps` con `className`.
- Resultado esperado en dispositivo: las tres imágenes sin ancho ni alto, Pingo invisible en el estado vacío de Nutrición, en Generando y en la burbuja del wizard.
- Todas las demás `Image` de `expo-image` del repo dan el tamaño por `style` (`empty-state.tsx:78`, `home/index.tsx:513`, `pairing/index.tsx:317`); estas tres, todas de #209, son las únicas con `className`.
- Ningún test lo ve: `food/index.test.tsx:1951-1953` y `nutrition-questionnaire/index.test.tsx:539,572` solo comprueban `source` y presencia. Jest no aplica estilos de Uniwind.
- Lo que tiene que cambiar el implementer: dar el tamaño por `style` (150, 112 y 44/52 pt, o con `width` + `aspectRatio: 1` como `pairing`) y añadir en cada test un candado sobre `props.style` de la `Image` que falle con el `className` actual.

### Punto 1 — cinco sufijos ` (enmendado por #209 R24)` de más
- Los cinco `it` son `it.each` o recorridos sobre una línea que R24 enmienda: `%s importa y aplica sus %i esquinas` es `it.each(directUses)` (`consistency-classnames.test.ts:296`), y `directUses` gana la fila del cuestionario; `#177 R3.1` y `#177 R3.2` son `it.each(CTA_ROWS)` (`chunky-cta-canvas-fidelity.test.ts:125,133`), y `CTA_ROWS` gana `nutrition-questionnaire-next` y `food-create-profile`; `#177 R12.1/R12.2` y `#177 R12.3` (`:291,300`) recorren `consumers`, cuya línea se enmienda (sale `food`).
- La regla de la spec (`requirements.md` §R24, línea 937: «el `it` que contiene (o usa) la línea enmendada») los cubre: un `it.each` usa su tabla. La spec manda sobre el handoff, y la línea 253 del handoff («la de los `it` que nombran las tablas») es más estrecha que la spec. Hay precedente en el mismo sitio: `(enmendado por #208 R21)` en los tres primeros y `(enmendado por #201 R13)` en los dos de `R12`.
- Veredicto del punto: necesarios, no sobran. Sin hallazgo. Nota para el leader: la línea 253 de la plantilla del handoff contradice la regla de la spec; conviene alinearla.

### Punto 3 — R26 en `docs/ui-guidelines.md`
- Las líneas 981–987 son idénticas byte a byte al bloque literal de `requirements.md` §R26 (línea 1289 en adelante): `diff` vacío. Sección al final del fichero, 8 líneas añadidas y 0 quitadas contra `fe624698`.
- Anclas: `grep -cF '## Enmienda #209'` = 1; `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano'` = 1. Casilla sin marcar (G4, del humano): no bloquea este veredicto.
- Lo que la enmienda afirma cuadra con el código: dos `PingRing` (`delay` 0 y 1000) con el `timing` por defecto `MOTION_PING_TIMING` (`components/ping-ring.tsx:15`), y ninguno si `reduceMotion` (`nutrition-questionnaire/index.tsx:242`); `rounded-14` ×6, `rounded-10` ×1, un `chunkyLip.primaryCompact`.

### Punto 4 — C4, historial rojo→verde
- Cadena `48346f15..da5e5eef`: 27 commits `test(mobile)` y 22 `feat(mobile)`, cada `test` antes de su `feat`. Los 27 `test` tocan solo tests (`*.test.ts(x)`, `__tests__/`, `ui-copy-table.ts`); ningún `feat` toca un test. R9 lleva un segundo commit de test (`b3f04d5f`, quita símbolos sin uso del arnés), también solo de test.
- Rojo comprobado por mí en un R del implementer (sin `quien implementa no revisa`): `git checkout 49e7965e --` de `meal-schedule/index.tsx` y su test, jest del test: `Tests: 4 failed, 85 passed, 89 total`, exit 1; los rojos son exactamente los tres `#209 R21: <rol> no ve Generar plan` y `el familiar no ve ni Añadir ni Generar (enmendado por #209 R21)`. Árbol restaurado con `git checkout HEAD --`; `git diff --quiet && git diff --cached --quiet` = limpio.
- Nacen verdes con justificación en el reporte: R18 (`f17a05e0`, la raíz KAV y el `ScrollView` existen desde R5; sonda `behavior="height"` del implementer en rojo), R23 tabla (`3f87d172`, catálogo y usos desde `471d4231`), R25 (`d4c139d9`, el wizard sigue R25 desde R5). Las tres casan con la lista cerrada del handoff.
- Sonda R25 propia, en una rama distinta de la del implementer (que plantó `StyleSheet.create`): `bg-[#ff0000]` en el `View` de Generando y `text-accent` suelto en su título. design-drift: `Tests: 3 failed, 121 passed, 124 total`, exit 1; rojos `#209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas`, `#209 R25: no deja text-accent suelto` y la guarda general de corchetes. Restaurado, limpio.
- Sonda R23 propia, en producción y no en el catálogo (el implementer quitó una clave `en`): `labelKey` de la tarjeta Baja cambiada a `nutritionQuestionnaire.activityMedium` (clave válida, tipa). ui-language: `Tests: 2 failed, 36 passed, 38 total`, exit 1; rojos `#209 R23: el bloque del cuestionario tiene 96 filas` y `resuelve cada ocurrencia de la tabla contra la clave exacta`. Restaurado, limpio.
- C4 conforme.

### Producción de R19–R22 (lado del implementer de reserva)
- `meal-schedule/index.tsx`: `canGenerate = isOwner && (…)` (R21), `ACTIVITY_LABEL`/`FOOD_LABEL` con `profileLabel` y vuelta al valor crudo si no hay etiqueta (R22), `nutrition-profile-edit` y `nutrition-profile-create` solo para owner, con `hitSlop={TOUCH_SLOP}`, `chunkyLip.neutralCompact` y `router.push({ pathname: '/nutrition-profile', params: { petId } })` (R20). Conforme con el JSX literal de la spec (línea 615).
- `food/index.tsx`: la consulta del perfil con `enabled: planNotFound`, `showProfileEmpty` solo para owner, CTA `food-create-profile` con `h-14 rounded-16 bg-accent` + `chunkyLip.primary` (R19). Conforme, salvo F1.
- Anclas: `(enmendado por #209 R21)` = 6 y `(enmendado por #209 R22)` = 4 en `meal-schedule/index.test.tsx`; `'nutritionQuestionnaire.` = 154 en `catalog.ts`. Las de la spec.
- Todo `it`/`describe` nuevo del test del cuestionario y los añadidos a Nutrición y Horario nombran su `#209 R<n>`.

### Corridas de jest propias, en HEAD (pgreps vacíos antes de cada una)
- `nutrition-questionnaire`, `food`, `meal-schedule`, `api/__tests__/nutrition.test.ts` y `app/__tests__/layout.test.tsx`: `Tests: 415 passed, 415 total`. Un sexto path que pasé (`src/api/__tests__/http.test.ts`) no existe: ENOENT de invocación mía, no del árbol; `putJson` se prueba en `nutrition.test.ts`.
- Las seis guardas de R24/R25 más `ui-language` y `language-provider`: `Test Suites: 8 passed, 8 total`, `Tests: 532 passed, 532 total`, exit 0.
- No repetí la suite entera (orden del leader). El reporte la da en 168 suites y 6183 tests verdes; lo confirmará el job `verify` del CI.

---

## Checklist C2 — Estado coherente
- [x] Como mucho 1 feature `in_progress` (hay 0 en la rama). Nota: #209 sigue `spec_ready` en `feature_list.json` durante la implementación; lo pondrá el leader al cerrar.
- [x] `progress/current.md` describe la sesión activa (§Fallback al subagente `implementer`, #209).

## Checklist C3 — Arquitectura (móvil: `api/` → pantallas)
- [x] Las pantallas consumen `api/nutrition.ts` vía react-query; `http.ts` solo transporte; sin lógica de negocio en `api/`.
- [x] La ruta es delgada (1 línea) y la pantalla vive en `src/screens/` (convención #39).
- [x] Sin dependencias nuevas.

## Checklist C4 — TDD
- [x] Cada R1–R26 tiene `it` que lo nombra (R26 es docs y tiene sus anclas).
- [x] Historial test-primero: 27 `test` solo de test, 22 `feat` sin tests, en orden. Nacen verdes R18, R23 tabla y R25, justificados y con sonda en rojo.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente»; los 50 hashes son ancestros de HEAD.
- [x] Commits con el formato del proyecto (`test(mobile): #209 R<n> …`, `feat(mobile): #209 R<n> …`).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla marcada (firma delegada del 2026-10-26, mandato del 2026-10-26 sobre #208–#216).

## Checklist C7 — Sin código huérfano
- [x] N/A — #209 no reemplaza nada: el vacío `food-plan-empty` sigue para quien no es owner o ya tiene perfil, y Horario conserva sus nodos.

## Checklist C8 — Carta de UI
- [x] Grep-clean (R25 y design-drift en verde; sondas en rojo).
- [ ] Dimensiones y safe areas: el skeleton y la rama de error de carga no aplican insets (F2).
- [x] Skeleton de HeroUI, sin Spinner.
- [x] Reutiliza `PingoFloat`, `PingRing`, `ScreenHeader`, `useChunkyLip`, `CONTINUOUS_CORNER`, `TOUCH_SLOP`, `CATEGORY_SLOTS`.
- [x] Touch targets: `hitSlop={TOUCH_SLOP}` en los `h-9`; feedback pressed como en el wizard de referencia `add-pet` (sus chips tampoco lo llevan; no es de #209).
- [x] Animaciones: `PingRing` y `PingoFloat` existentes, `useReducedMotion` respetado.
- [ ] Lo dibujado se ve en dispositivo: Pingo sale 0×0 en tres sitios (F1).

## Observaciones (hallazgos numerados)

1. **F1 — ALTA, bloqueante.** Tres `Image` de `expo-image` reciben su tamaño solo por `className` y en dispositivo salen sin ancho ni alto (Pingo invisible): `mobile-pet-tracker/src/screens/food/index.tsx:456` (`size-37.5`, R19), `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx:244` (`size-28`, Generando, R16) y `:368` (`size-11`/`size-13`, burbuja). Uniwind solo da `className` a componentes de `react-native` (`node_modules/uniwind/dist/metro/index.cjs:96-104`); `expo-image` pasa `style` aplanado a su view manager nativo (`node_modules/expo-image/src/ExpoImage.tsx`) e ignora `className`. El resto del repo da el tamaño por `style` (`empty-state.tsx:78`, `home/index.tsx:513`, `pairing/index.tsx:317`). Arreglo esperado: `style` con 150, 112 y 44/52 pt, y un candado por imagen sobre `props.style` en `food/index.test.tsx` (junto a `:1951`) y en `nutrition-questionnaire/index.test.tsx` (Generando y burbuja), que dé rojo con el `className` actual. Detalle arriba, en «Hallazgo F1».
2. **F2 — MEDIA.** `NutritionQuestionnaireScreen` monta el skeleton (`index.tsx:484`, `p-5` sin insets) y el error de carga (`index.tsx:490`, un `<Text>` suelto sin `flex-1 bg-background`, sin insets ni `ScreenHeader`) en una ruta con `headerShown: false`. El texto queda bajo la barra de estado y la pantalla de error no tiene botón de volver. C8 pide safe areas top y bottom vía `useSafeAreaInsets`. Arreglo esperado: el mismo contenedor con `paddingTop: insets.top` (y `ScreenHeader` en la rama de error) que el formulario, sin tocar los `testID`, y un `it` con `#209 R4` que lo fije.
3. **Nota — sin hallazgo.** Los cinco sufijos ` (enmendado por #209 R24)` de más son necesarios por la regla «contiene (o usa)» de §R24. La línea 253 del handoff es más estrecha que la spec; conviene corregir la plantilla.
4. **Nota — sin hallazgo.** El merge `b81edb2b` es la unión exacta en producción, y la fila `screens/food/index.tsx` del inventario `tracking-title` es la cifra de `dev` más el delta de #209, no tapa nada.
5. **Nota — sin hallazgo.** R26 es literal a la spec; la casilla `- [ ] Enmienda #209 aprobada por humano` sigue sin marcar, como debe (G4).

Para la re-revisión: solo cambian `food/index.tsx`, `nutrition-questionnaire/index.tsx` y sus dos tests (más reporte y traceability). Las guardas de R24/R25 no deberían moverse; si F2 añade clases nuevas, medir antes las de `design-drift` y `consistency-classnames`.

## Output de ./init.sh
No lo corrí: orden del leader («NO ejecutes ./init.sh: lo corre el CI de la PR (job `verify`)»). El sustituto fueron las dos corridas de jest de arriba, más las tres corridas de las sondas, todas con los pgreps vacíos y el árbol limpio al acabar.

---

## Segunda revisión (HEAD f8b7b130)
Fecha: 2026-10-27
Veredicto: RECHAZADO
Reviewer: subagente `reviewer` (segunda revisión). Mismo modelo que el `implementer` de reserva que hizo la Adenda 5: por eso cada candado lleva una sonda mía distinta de la suya.
Alcance: `git log --first-parent 7940c0fb..HEAD` (8 commits: merge `40e640d9`, errata `3c31d6b5`, Adenda 5 `28cb9ecc`, y `63d4295e`, `f75ece10`, `5333d27c`, `fbff52ee`, `f8b7b130`).

### Bitácora
- Lista cerrada: `git diff --name-only 28cb9ecc HEAD` = las 6 rutas de la Adenda 5 §4, ni una más.
- Merge `40e640d9`: padres `7940c0fb` (rama) y `43230cb4` (`dev` con #216), base `fe624698`. `git merge-tree --write-tree 7940c0fb 43230cb4` rehecho por mí difiere del árbol del merge solo en `progress/current.md` (la resolución del conflicto): el resto es la mezcla automática, sin cambios a mano. Ficheros que tocan los dos lados: `feature_list.json`, `ui-copy-table.ts`, `ui-language.test.ts` y `current.md`; en los tres primeros el hunk de `dev` (fila `#216 R6` de `R10_PAIRING` y su `+ 1`) entra idéntico. Ningún fichero de #209 lo toca #216.
- Historial, en el árbol de wt-209 con `git checkout <c> -- <4 ficheros>` y vuelta a `HEAD` (tras cada una, `git diff --quiet HEAD -- mobile-pet-tracker` = 0 y `git diff --cached --quiet` = 0), los dos tests de la Adenda con `--runTestsByPath`:
  - `63d4295e` (test R4): `Tests: 1 failed, 201 passed, 202 total`, exit 1; rojo solo `#209 R4: esqueleto y error de carga …`, por aserción (`Expected: {"paddingTop": 52}` / `Received: undefined`).
  - `f75ece10` (feat R4): `Tests: 202 passed, 202 total`, exit 0.
  - `5333d27c` (test R5 R16 R19): `Tests: 3 failed, 202 passed, 205 total`, exit 1; rojos exactamente los tres `it` nuevos, por `Unable to find an element with testID` de la imagen.
  - `fbff52ee` (feat R5 R16 R19; mismos ficheros de app que HEAD): `Tests: 205 passed, 205 total`, exit 0.
  - Cada `test` toca solo tests y cada `feat` solo producción (`git show --name-only`). Los 5 commits llevan los dos trailers.
- Sondas mías (árbol de HEAD, una a una con `-t`, revertidas con `git checkout HEAD --`; tras cada una `git diff --quiet HEAD -- mobile-pet-tracker` = 0 y `git diff --cached --quiet` = 0). Ninguna repite las del implementer:

  | # | Mutación | `it` | Resultado |
  |---|---|---|---|
  | P1 | R4, rama del **esqueleto**: `insets.top + 12` → `insets.top` (el implementer mutó la del error) | `#209 R4: esqueleto y error …` | rojo, `paddingTop` 52 vs 40 |
  | P2 | R4, error: `Text` antes que `ScreenHeader` (la spec fija «dos hijos en este orden») | el mismo | **verde** |
  | P3 | R4, error: `ScreenHeader` fuera del `View` con inset (`<><ScreenHeader …/><View …><Text …/></View></>`) | el mismo | **verde** |
  | P4 | R5: el `className={step === 'condition' ? 'size-11' : 'size-13'}` de antes, con el `testID` nuevo | `#209 R5: Pingo de la burbuja …` | rojo (`style` `{}`) |
  | P5 | R5: `step === 'condition' \|\| step === 'food' ? 44 : 52` | el mismo | **verde** |
  | P6 | R16: `{ width: 112 }` sin `height` | `#209 R16: Pingo de Generando …` | rojo |
  | P7 | R19: el `className="size-37.5"` de antes, con el `testID` nuevo | `#209 R19: Pingo de NutricionSinPerfil …` | rojo (`style` `{}`) |
  | P8 | R16: `style` correcto más `className="size-28"` | `#209 R16: Pingo de Generando …` | rojo por `toBeUndefined()` (`Received: "size-28"`): el candado de `className` mira de verdad |
  | P9 | R4, error: `backFallback="/food"` → `backFallback="/home"` en el `ScreenHeader` del error | fichero entero (`-t '#209'`, 69 tests) | **verde** |

  P4 y P7 son la regresión exacta de F1 y los candados la ven. `expo-image` reenvía `className` al host (`ExpoImage.tsx`: `{...props}` a `NativeExpoImage`), así que el `toBeUndefined()` sobre `className` no es tautológico.

- Barrido cláusula × candado de la errata ronda 6 (regla de #147: cada cláusula de la errata con su candado y su sonda):

  | Cláusula | Candado | Sonda | Estado |
  |---|---|---|---|
  | R4 esqueleto: `paddingTop: insets.top + 12` | `toEqual({ paddingTop: 52 })` | P1 (y `insets.bottom` daría 36: el doble tiene `bottom: 24`) | cerrada |
  | R4 esqueleto y error: `className` exacto | `toBe('flex-1 gap-4 bg-background px-5 pb-5')` | del implementer | cerrada |
  | R4 error: `paddingTop` | `toEqual` | del implementer | cerrada |
  | R4 error: hay `ScreenHeader` con volver | `fireEvent.press(screen.getByTestId('nutrition-questionnaire-back'))` | del implementer (sin cabecera, rojo) | cerrada |
  | R4 error: el `ScreenHeader` es hijo del `View` con inset | ninguno: el `press` busca en `screen`, no en `errorScreen` | P3 | **abierta** (H1) |
  | R4 error: «dos hijos en este orden» | ninguno | P2 | **abierta** (H1) |
  | R4 error: `backFallback="/food"` | ninguno: el doble de `canGoBack` siempre devuelve `true` | P9 | **abierta** (H3) |
  | R4 error: `size={24}` | no hace falta: sin `title` no tiene efecto (`screen-header.tsx`: `size` solo elige `TITLE_CLASSES`) | — | sin efecto |
  | R5: 44 pt en Condición | `toEqual({ width: 44, height: 44 })` | P4 | cerrada |
  | R5: 52 pt en el resto de pasos (Actividad, Peso objetivo, Alimento, Salud) | solo Actividad | P5 | **abierta** (H2) |
  | R5: sin `className` | `toBeUndefined()` en Actividad | P4 | cerrada |
  | R16: 112 pt por `style`, sin `className` | `toEqual` y `toBeUndefined()` | P6, P8 | cerrada |
  | R19: 150 pt por `style`, sin `className` | `toEqual` y `toBeUndefined()` | P7 | cerrada |
  | R25: repite R5, R16 y R19 | los de arriba | — | sigue a R5 |

- Suite móvil completa (antes, los dos `pgrep` vacíos): `bun run test > ../progress/rr-test-209.log 2>&1` → exit 0, `Test Suites: 168 passed, 168 total`, `Tests: 6221 passed, 6221 total`, 0 `SIGKILL`. Son las cifras esperadas.
- `bunx tsc --noEmit` → exit 0, log vacío. `bunx expo lint --no-cache` → exit 0, log vacío.
- Trazabilidad: las filas R4, R5, R16 y R19 nombran los `it` nuevos y los commits `63d4295e`, `f75ece10`, `5333d27c` y `fbff52ee`. Los 54 hashes del fichero resuelven y todos son ancestros de HEAD. 0 filas «pendiente».
- Guardas:
  - `#209` en producción: 0.
  - `#209` suelto (sin `R<n>`) en los tests: 0.
  - `StyleSheet` en el test del cuestionario: 0.
  - En el repo no queda ninguna `Image` de `expo-image` con `className`.
  - `docs/` sin cambios en el delta (`git diff --stat 7940c0fb..HEAD -- docs` vacío).
  - La casilla de R26 (`- [ ] Enmienda #209 aprobada por humano`, línea 1372) sigue sin marcar, y la del smoke (línea 1426) también. Las dos son del humano.
- `./init.sh` no lo corrí: el leader lo prohibió en el encargo («the leader and CI run it»).

### Checklist C2 — Estado coherente
- [x] 0 features `in_progress` (#209 y #216 en `spec_ready`; init.sh aborta con dos)
- [x] `progress/current.md` describe la sesión de #209 con el fallback al `implementer`

### Checklist C3 — Arquitectura
- [x] Solo cambian una pantalla, su test, Nutrición y su test. No hay capas de backend en el delta.

### Checklist C4 — TDD
- [x] R4, R5, R16 y R19 tienen `it` nuevos que nombran su R-id
- [x] Test primero: `63d4295e` rojo → `f75ece10` verde, y `5333d27c` rojo → `fbff52ee` verde, por aserción y no por `ReferenceError`
- [ ] Candados que cubran su cláusula entera: P2, P3, P5 y P9 dejan la suite verde (H1–H3)

### Checklist C5 — Trazabilidad
- [x] 0 filas «pendiente». Los hashes resuelven.
- [x] Formato `test(mobile): #209 R<n> …` y `feat(mobile): #209 R<n> …`, con los dos trailers (los R-ids van en el asunto, tras `#209`, como en el resto de la feature)

### Checklist C6 — Spec aprobada
- [x] `status: approved` y la casilla de la línea 1425 marcada. La errata ronda 6 está en `3c31d6b5`, antes de la Adenda 5 y de los commits de código.

### Checklist C7 — Sin código huérfano
- [x] N/A. La errata cambia `className` por `style` en tres `Image` y no reemplaza ningún módulo.

### Checklist C8 — UI móvil
- [x] Grep-clean: lint, `design-drift` y `consistency-classnames` en verde dentro de la suite
- [x] Insets: los dos estados sin cabecera llevan `insets.top + 12`, igual que el formulario
- [x] F1 cerrado: las tres `Image` llevan su tamaño en `style`
- [ ] El candado del inset no mira dónde está el botón de volver (H1)

### Hallazgos
F1 está cerrado en el código y sus candados lo ven (P4, P6, P7 y P8 rojos). F2 también está cerrado en el código, pero su candado no cubre la cláusula entera. Según el precedente de #147, un candado que deja verde una mutación de su cláusula no cierra, aunque el código y los `it` cumplan la letra de la spec. Los huecos vienen del `it` que prescribe la errata ronda 6, no de una desviación del implementer. El arreglo, por tanto, necesita una errata ronda 7 en la spec.

En los tres hallazgos el código ya es correcto. Por C4, punto 5, el rojo de cada candado nuevo es una **mutación de producción**: se versiona en el commit `test` y se revierte en el `feat`. La mutación de cada hallazgo es la de su sonda.

1. **H1 — MEDIA, bloqueante (P3 y P2).** En `#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver`, el `press` usa `screen.getByTestId('nutrition-questionnaire-back')`. Así no ve:
   - **P3**: el `ScreenHeader` fuera del `View` con inset. El botón de volver queda bajo la barra de estado, que es justo el síntoma de F2.
   - **P2**: la cláusula «dos hijos en este orden» invertida.

   Arreglo propuesto, en el mismo `it`: sobre `errorScreen`, aserta
   `within(errorScreen).getAllByTestId(/^nutrition-questionnaire-(back|load-error)$/).map((n) => n.props.testID)`
   `toEqual(['nutrition-questionnaire-back', 'nutrition-questionnaire-load-error'])`,
   y pulsa con `within(errorScreen).getByTestId('nutrition-questionnaire-back')`. Rojo con P3 (falta `-back`) y con P2 (orden inverso). Este candado no lo he medido sobre HEAD: antes de firmar, pídeme que lo mida (verde sin mutar, rojo con P2 y con P3).
2. **H2 — BAJA, bloqueante por la regla de cláusulas universales (P5).** En `#209 R5: Pingo de la burbuja mide 52 pt y 44 pt en Condición por style`, la rama «52 pt» cubre cuatro pasos, pero solo se aserta en Actividad. Con `step === 'condition' || step === 'food' ? 44 : 52` la suite sigue verde. Arreglo: el mismo `toEqual({ width: 52, height: 52 })` en al menos un paso más, con los helpers de navegación que ya tiene el fichero. Lo mejor es Alimento y Salud, porque una salida que depende del paso pide dos muestras.
3. **H3 — BAJA (P9).** El `ScreenHeader` del error lleva `backFallback="/food"`, y ningún test lo vigila: el doble de `router.canGoBack` siempre devuelve `true`. Con `"/home"` la suite sigue verde. Arreglo: en el `it` de R4, con `mockRouter.canGoBack.mockReturnValueOnce(false)`, pulsar el volver de `errorScreen` y asertar `expect(mockRouter.replace).toHaveBeenCalledWith('/food')`. Va en la misma errata porque cuesta una línea.

Lo demás está conforme: la suite, tsc, lint, la trazabilidad, el merge `40e640d9` y el historial test-primero. En la tercera revisión mediré la lista cerrada (los 2 tests, el reporte y la trazabilidad) contra el HEAD de la errata ronda 7, y volveré a correr P2, P3, P5 y P9.
