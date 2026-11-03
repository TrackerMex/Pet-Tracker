---
feature: "mobile-food-links-without-profile"
status: draft        # draft | approved
tags: [mobile, nutrition, food, spec]
---

# Diseño — [[mobile-food-links-without-profile]] (#233)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil. Todas
> las rutas son relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Deriva verificada

Contrastado contra el árbol de `origin/dev` (426ffd32), no contra el plan:

| Premisa del plan | Resultado |
|---|---|
| `food/index.tsx` pinta los enlaces aunque `showProfileEmpty` sea cierto | Cierta, y más amplia. La línea `{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}` es la última del bloque `selectedPetId ? (…)` y no lee ni `profile` ni `showProfileEmpty`. Los enlaces se pintan también con el plan pendiente, en error y con el perfil pendiente. |
| `showProfileEmpty` cubre «sin perfil» | Incompleta. `showProfileEmpty` exige `activePet?.myRole === 'owner'`; un `family`, `walker` o `vet` sin perfil ve `food-plan-empty` y no `food-profile-empty`, y también ve los enlaces. La frase del humano («sin Perfil») no distingue rol. De ahí la decisión D1 de [[requirements]]. |
| Un plan solo existe con perfil | Cierta. `generate-nutrition-plan.use-case.ts` lanza `NutritionProfileRequiredError` si no hay perfil. Por eso el plan cargado basta para dar el perfil por existente y la consulta del perfil queda en `enabled: planNotFound`. |
| Los enlaces reaparecen al crear el perfil | Cierta. `src/screens/nutrition-questionnaire/index.tsx` invalida `nutritionKeys.profile(pet.id)` y `nutritionKeys.plan(pet.id)` al crear el perfil; `FoodScreen` las relee. |
| El candado afectado es «el test de enlaces» de `food/index.test.tsx` | Parcial. Solo hay un `it` que exige los enlaces sin perfil confirmado: `R5: plan del día con horarios y warnings` › `shows a skeleton and schedule link while the plan is pending` (los enlaces con el plan pendiente). Los demás `it` con enlaces usan plan `ok`, o plan `not-found` con el perfil por defecto del `beforeEach` raíz (`ok`) y esperan `food-plan-empty*`. Medido leyendo todos los usos de `meal-schedule-link`, `meals-history-link` y `food-links` del fichero. Fuera del fichero, el único que cita `food-links` es `src/__tests__/tab-headers-canvas.test.ts` (#222 R14), que exige el literal `testID="food-links"` en el fuente. |
| No está hecho ya | Cierta. `grep -cF "hasProfile" src/screens/food/index.tsx` = 0 y `grep -cF "#233" src/screens/food/index.tsx src/screens/food/index.test.tsx` = 0 en los dos. |

No hay deriva que impida la feature. La que hay (rol y estados sin confirmar)
queda recogida en D1.

## Decisiones técnicas

- **Un booleano local `hasProfile`, sin hook nuevo** (R1–R5). `FoodScreen` ya
  es dueña de las dos consultas (`plan` y `profile`) y de los derivados
  `loadedPlan`, `planNotFound`, `profilePending` y `showProfileEmpty`. Un
  derivado más, en el mismo sitio, es lo mínimo.
- **Forma literal, sin variantes** (R1, R6). En `src/screens/food/index.tsx`,
  `FoodScreen`:
  - justo debajo de
    `const showProfileEmpty = planNotFound && profile.data?.kind === 'not-found' && activePet?.myRole === 'owner';`
    va
    `const hasProfile = loadedPlan !== null || (planNotFound && profile.data?.kind === 'ok');`;
  - la última línea del bloque `selectedPetId ? (…)` pasa de
    `{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}`
    a
    `{hasProfile ? (loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links) : null}`;
  - `links`, su `testID="food-links"`, los dos `Pressable`, sus clases y sus
    `onPress` no cambian ni un carácter. El diff de producción son dos líneas
    añadidas y una quitada (anclado en R6).
  - Si prettier parte la línea nueva en varias, el recuento de líneas del
    `numstat` cambia: se mantiene en una línea, que es lo que ya hace el
    fichero con su ternario anterior. (Móvil no tiene prettier; el
    implementer no reformatea.)
- **Por qué `=== 'ok'` y no `!== 'not-found'`** (R2, R3). Con `!== 'not-found'`,
  `undefined` (consulta pendiente) cuenta como perfil y los enlaces parpadean
  mientras la consulta vuela; el perfil en `error` también contaría. Solo el
  `ok` es una confirmación. M3, M4 y M8 lo prueban.
- **Por qué `planNotFound &&` delante del `profile.data`** (R2, R3). La consulta
  del perfil está deshabilitada fuera de `planNotFound`, así que su `data`
  solo vale mientras el plan es `not-found`. Sin la condición, un perfil `ok`
  que quede en caché de una visita anterior (la consulta se deshabilita, no se
  vacía) confirmaría un perfil con el plan aún pendiente o en error, y los
  enlaces parpadearían o se quedarían junto a un error del plan. M4 lo prueba.
- **Se desmonta, no se oculta con estilo** (R1). `display: 'none'` dejaría el
  botón en el árbol para el lector de pantalla y para los tests. Por eso los
  `queryBy` llevan `includeHiddenElements: true` (M6).
- **El `RiseIn` no cambia** (R5). Con plan cargado los enlaces siguen
  envueltos con `delayMs={200}`; sin plan y con perfil, sin envolver. La
  rama interior de la línea nueva es la vieja condición, intacta.
- **Estado «sin confirmar» = nada** (D1). No se pinta un hueco, un esqueleto ni
  un aviso en lugar de los enlaces: el esqueleto del plan ya está arriba
  mientras carga, y el vacío del plan o del perfil ya está pintado cuando
  termina. Sin copy nuevo y, por tanto, sin gate G1.
- **Los flakes de Nutrición** (#200 R9 y R10). No se persiguen. Por lectura del
  código, la causa era `findByTestId` de un enlace mientras el plan estaba
  pendiente: el nodo se pintaba sin `RiseIn` y se remontaba dentro de él al
  llegar el plan, y la pulsación caía en un nodo ya desmontado (`push` con 0
  llamadas). Con #233 los enlaces no existen hasta que hay plan o perfil
  confirmado, así que el escenario desaparece. Es una inferencia, no un
  requisito.

## Copy

Ninguno. No se añade, retira ni cambia una clave de `src/i18n/catalog.ts`. La
tabla `src/__tests__/ui-copy-table.ts` y `SCREEN_FILES` no cambian.

## Guardas que no se mueven

| Guarda | Qué cuenta | Efecto de #233 |
|---|---|---|
| `src/__tests__/design-drift.test.ts` `screenSignOutCalls` | `signOut(` en `screens/food/index.tsx` = 0 | Sin cambio. |
| `src/__tests__/design-drift.test.ts` `HEX_LITERAL` (featureFiles de Nutrición, incluido su test) | `#` seguido de 3 a 8 hex | Todo `#233` en código o test va seguido de ` R<n>`. Un `// #233` suelto tumba la guarda. |
| `src/__tests__/design-drift.test.ts` (`rounded-16` en food) | 3 apariciones (2 de los enlaces y 1 del botón del perfil) | Sin cambio: no se añade ni se quita ninguna clase. |
| `src/__tests__/consistency-classnames.test.ts` | inventario de clases de `screens/food/index.tsx` | Sin cambio: delta 0, ningún literal de clase nuevo. |
| `src/__tests__/tab-headers-canvas.test.ts` #222 R14 | el literal `testID="food-links"` en `screens/food/index.tsx` | Sin cambio: `links` se queda declarado una vez. |
| `src/__tests__/ui-copy-table.ts` / `ui-language.test.ts` | copy y claves de i18n | Sin cambio: delta 0. |
| `src/__tests__/nutrition-canvas-fidelity.test.ts`, `alerts-canvas-fidelity.test.ts` | literales del canvas de Nutrición | No leen los enlaces; sin cambio. |

Los selectores por prefijo no atrapan ningún `testID` nuevo: #233 no añade
ninguno.

## Archivos afectados

Solo la capa de presentación móvil. No hay cambios de dominio, aplicación ni
backend.

- `src/screens/food/index.tsx`: `hasProfile` y la línea de render de los
  enlaces (R1–R6).
- `src/screens/food/index.test.tsx`: la enmienda de un `it` y un `describe`
  nuevo entre `#200 R10` y `#222 R7` (R1–R5, R7).
- `specs/mobile-canvas-nutrition/requirements.md`: bloque «Enmienda #233»
  al final (esta spec lo escribe; no cambia código).

## Batería de mutaciones

Cada candado de [[requirements]] se prueba contra una mutación plantada en
`src/screens/food/index.tsx`. La tabla dice qué `it` debe ponerse rojo.
«Verificado» significa que las anclas de grep se midieron sobre una copia con
la mutación aplicada y discriminan (no se ejecutó jest: el `spec_author` no
escribe tests; el implementer ejecuta la batería en la tarea de cierre).

Abreviaturas de los `it`: **A** = el `it` enmendado de R5
(`… while the plan is pending (enmendado por #233 R2)`); **R1×** = las cuatro
filas de `#233 R1`; **R2B** = `#233 R2`; **R3×** = las tres filas de
`#233 R3`; **R4** y **R5** = los `it` nuevos de `#233 R4` y `#233 R5`.

| M | Mutación sobre el código final | Debe ponerse rojo | Ancla que la detecta (valor con la mutación) |
|---|---|---|---|
| M1 | Volver la línea de render a `{loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}` (la declaración queda) | A, R1×, R2B, R3× | render nuevo = 0; render viejo = 1; numstat `1 0` |
| M2 | `const hasProfile = loadedPlan !== null;` | R4, R2B (la transición final), y de los existentes `shows a graceful empty plan and keeps the schedule link`, `queda en el sitio del vacío…` (#155 R9) y `#200 R10: sin plan los enlaces no entran con RiseIn` | declaración = 0; `profile.data` = 2 |
| M3 | `… \|\| (planNotFound && profile.data?.kind !== 'not-found');` | R2B (perfil pendiente: `undefined` cuenta), fila `perfil con error` de R3× | declaración = 0 |
| M4 | `… \|\| profile.data?.kind !== 'not-found';` (sin `planNotFound`) | A, R2B, R3× (las tres filas) | declaración = 0 |
| M5 | Sin declaración; la línea de render pasa a `{showProfileEmpty ? null : (loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links)}` (solo oculta al dueño sin perfil) | A, R1× filas `family`, `walker`, `vet`, R2B, R3× | render nuevo = 0; render viejo = 0; `hasProfile` = 0; numstat `1 1` |
| M6 | Render viejo y `style={hasProfile ? undefined : { display: 'none' }}` en `<View testID="food-links" className="gap-2">` | R1× (los `queryBy` con `includeHiddenElements: true` encuentran el nodo), A, R2B, R3× | `<View testID="food-links" className="gap-2">` = 0 |
| M7 | Línea de render `{hasProfile ? links : null}` (sin `RiseIn`) | R5 y la fila `food-links` de `#200 R10: cada pieza entra con el retardo del canvas (%s)` | `RiseIn delayMs={200}` = 0 |
| M8 | `… \|\| (planNotFound && profile.data !== undefined);` | R1× (las cuatro), fila `perfil con error` de R3× | declaración = 0 |
| M9 | `const hasProfile = planNotFound && profile.data?.kind === 'ok';` (sin la rama del plan cargado) | R5 y los `it` de enlaces con plan `ok`: `#200 R9` (dos `it.each`), `#200 R11`, `#105 R14` | declaración = 0 |

Medidas sobre copias (scratch) del fichero de `origin/dev` 426ffd32 con el
cambio aplicado (`ok`) y con las mutaciones:

| Medida | base | ok | m1 | m2 | m3 | m4 | m5 | m6 | m7 | m8 | m9 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| declaración exacta (`loadedPlan !== null \|\| (planNotFound && profile.data?.kind === 'ok')`) | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 |
| render nuevo | 0 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| render viejo | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| `RiseIn delayMs={200}` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| `grep -cF hasProfile` | 0 | 2 | 1 | 2 | 2 | 2 | 0 | 2 | 2 | 2 | 2 |
| `profile.data` | 2 | 3 | 3 | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 3 |
| `<View testID="food-links" className="gap-2">` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 |
| `{links}` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| numstat contra la base | `0 0` | `2 1` | `1 0` | `2 1` | `2 1` | `2 1` | `1 1` | `2 1` | `2 1` | `2 1` | `2 1` |

(En m6 la fila `<View testID="food-links" className="gap-2">` baja a 0 porque
la etiqueta lleva ahora `style`; `testID="food-links"` sigue en 1.)

De ahí salen dos lecciones que la spec ya aplica: `grep -cF hasProfile` = 2 vale
en `ok` y en m2 a m4, m6, m7, m8 y m9 (ancla ciega, por eso las anclas exactas de
declaración y de render), y la declaración exacta es la única que separa `ok`
de las seis mutaciones de la expresión (m2, m3, m4, m8, m9 y m5). M1 y M6 son
mutaciones de la línea de render y las caza la columna «render nuevo».

## Alternativas descartadas

- **Hook `useHasNutritionProfile(petId)`.** Esconde la bifurcación de fuentes
  (plan o perfil) que `FoodScreen` ya resuelve con sus derivados.
- **Pintar los enlaces salvo que el perfil esté confirmado como `not-found`**
  (`!hideLinks`). Deja el parpadeo con el plan pendiente y los enlaces visibles
  con el plan en error; es la lectura estrecha de la letra del plan
  (`showProfileEmpty`). Descartada por D1.
- **Ocultar solo al dueño (`showProfileEmpty`).** Deja a `family`, `walker` y
  `vet` sin perfil viendo enlaces a pantallas vacías (M5).
- **Ocultar con `display: 'none'`.** Deja los nodos para el lector de pantalla
  y para los tests (M6).
- **Sustituir los enlaces por una nota («Crea el perfil para ver tu
  horario»).** Exigiría copy nuevo, gate G1 y artboard. El CTA «Crear perfil
  nutricional» ya está donde toca.
- **Esperar a la caché de Query en los tests** (`queryClient.getQueryData`).
  `docs/conventions.md` §Esperas lo prohíbe: la condición de espera debe ser
  la misma observación que hacen las aserciones. R2B es la única excepción y
  usa el contador de `getNutritionProfile` porque ese estado no tiene nodo.
- **Un test nuevo para la rama «plan cargado» que mire `profile` en `error`.**
  La fila de R5 (perfil `not-found` y plan `ok`) ya prueba que el perfil no
  se consulta; cualquier otro valor sería un duplicado.

## Riesgos

| Riesgo | Fichero compartido | Dueño | Mitigación |
|---|---|---|---|
| #234 toca `food/index.test.tsx` detrás de #233 | `src/screens/food/index.test.tsx` | #234 es dueño de los `it` de la tarjeta de IA (`food-ai-card`, `food-ai-content`, `ai-explanation`); #233 es dueño del `describe` `#233 R1 a R5` y de la enmienda de un `it` de R5 | #233 añade un solo `describe`, entre `#200 R10` y `#222 R7`, y no toca la cabecera ni el final del fichero (R7 lo candea). #234 empieza tras mergear #233 (mergear `dev` antes del handoff, como pide el plan §3). Si #234 enmienda un `it` que #233 también tocó, se re-mide por contenido. |
| Un `#233` sin ` R<n>` en un comentario o título | `index.tsx`, `index.test.tsx` | #233 | Regla de `HEX_LITERAL`, en la verificación final de tasks.md. |
| `queryBy` sin `includeHiddenElements` da un `null` ciego | `index.test.tsx` | #233 | R1, R2 y R3 lo exigen; M6 lo prueba. |
| Un `null` medido antes de que la pantalla llegue al estado | `index.test.tsx` | #233 | R1 y R3 se anclan a `food-create-profile`, `food-plan-empty` o `food-plan-error`; A se ancla a `food-schedule-skeleton` nulo dentro del mismo `waitFor`; R2B usa la excepción nombrada y una transición final. |
| La espera por contador de R2B se vuelve carrera | `index.test.tsx` | #233 | Solo observa que `getNutritionProfile` se llamó una vez, que ocurre justo al resolver el plan; las aserciones siguientes son de nodos ya presentes (`food-plan-skeleton`) o ausentes por definición. El `it` termina en `findByTestId('food-plan-empty')`. Si bajo carga fallara, repetir sin el flag y anotarlo. |
| Flake de carga en el fichero de test de Nutrición (#200 R9, #200 R10, #168 R2) | `index.test.tsx` | todos | Si un `it` ajeno falla bajo carga, repetir sin el flag y anotarlo; no se enmienda. |
| Un `it` de la fila de R5 enmendado deja de decir lo que decía | `index.test.tsx` | #233 | El sufijo `(enmendado por #233 R2)` y la lista de R2 fijan qué se quitó (solo la aserción `toBeVisible` del enlace) y qué se conserva (las otras cuatro). El título conserva «and schedule link» por la regla de conservar el texto original; el sufijo avisa. |
| La carta dice «sin plan los enlaces conservan su aparición sin RiseIn» | `docs/ui-guidelines.md` Enmienda #200 | humano (G4) | Casilla opcional de Aprobación en [[requirements]]. No bloquea. |
