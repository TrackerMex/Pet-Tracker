---
feature: "mobile-nutrition-ai-plan"
status: approved     # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# Requisitos — [[mobile-nutrition-ai-plan]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura. La UI se rige por `docs/ui-guidelines.md`.

## Contexto

#212 (`nutrition-ai-structured-plan`) está en `dev`. Desde entonces:

- `POST /pets/:petId/nutrition-plan/generate` devuelve el plan con dos campos más:
  `aiStatus` y, dentro del plan, `aiProposal` (gramos por comida, recomendaciones y fecha de
  revisión);
- `GET /pets/:petId/nutrition-plan` también devuelve `aiProposal`.

La app no usa nada de eso. Horario, al generar, solo refresca el plan. El dueño nunca ve:

- los gramos que propone la IA;
- sus recomendaciones;
- por qué la IA no hizo nada (sin collar, límite diario, propuesta descartada).

#215 añade la pantalla «Plan de <nombre>» en la ruta `/nutrition-plan`. Horario la abre
tras cada «Generar plan» que acaba en `ok`. Tiene cinco vistas:

| Vista | Artboard |
|---|---|
| IA | PlanIA |
| motor | sin artboard propio: la parte de arriba de SinCollar, sin nota |
| sin collar | PlanIASinCollar |
| descartada | PlanIADescartada |
| límite | PlanIALimite |

Además, Horario y Nutrición pintan los gramos de la IA por comida cuando hay propuesta.

Origen: `progress/plan_mejoras-producto-2026-10-26.md` (ola 3). Artboards aprobados en G1.

Dependencias:

- #212, en `dev`;
- #209, en `dev` (`04c6e6a5`, HEAD de la rama al crearla);
- #224, firmada y sin mergear (ver §Premisa).

### Canvas congelado (G1)

Los artboards están congelados en `specs/mobile-nutrition-ai-plan/canvas/`.

**Nota para el firmante.** Procedencia de los artboards:

- se congelaron de la versión viva `1793075957-2262` del canvas;
- según el leader, su copy coincide con el de la v140 (`1793036268-d302`) aprobada en G1.

El spec_author no los comparó sha256 a sha256 contra la v140. Si el firmante quiere esa
garantía, la comparación se hace sobre estos cuatro ficheros.

Los HTML cargan `./support.js`, el runtime del canvas. No se congeló y no hace falta para
la spec.

| Artboard | sha256 |
|---|---|
| PlanIA.dc.html | cdedefd30f6eca535e00afa3deb0bb13867eee1e8cc8c4b55de380d93703413b |
| PlanIADescartada.dc.html | 80b95cb4fe4c836724a8c09617f4956b3b5a0a3b570721d6a49f36842f841209 |
| PlanIALimite.dc.html | e72a2392f1f12ba80124337c9faf8240c83074dad9241285c16e034c1b336269 |
| PlanIASinCollar.dc.html | 215285e413240b7b312d8a236c559ee29e5169b5e9e89dbf1a524b88760369e8 |

Verificación: `cd specs/mobile-nutrition-ai-plan/canvas && sha256sum *.html`.

**El copy de ejemplo del canvas se sustituye por datos de la API:**

- los gramos 115/100/115 y 120/110/120;
- «330 g» y «350 g»;
- el texto de «Por qué cambié sus porciones»;
- las dos recomendaciones;
- «13 oct 2026» y «hoy, 10:20»;
- «Rocky».

Los literales fijos de la interfaz sí son normativos (R19).

### Premisa: #224 mergeado tal como se firmó

#224 `mobile-nutrition-ai-format` está firmada en `008c1ccd` (worktree
`/home/claude/sites/Pet-Tracker-wt-224`). Su código aún no está en `dev`.

**Premisa explícita:** cuando #215 se implemente, #224 estará mergeado en `dev`
exactamente como se firmó en `008c1ccd`.

Hasta entonces, #215 **no** se implementa: R8 importa dos funciones de un módulo que crea
#224.

Si #224 cambia antes de mergear:

1. se re-verifica §Re-verificar al mergear #224;
2. si alguna salida no cuadra, se enmienda esta spec.

Confirmación del humano (2026-10-27): #224 arranca con textos sintéticos, y su parser deja
literal el markdown que no cubre (`##`, `1.`, tablas), con 122 pt de alto colapsado.
Coincide con #224 R3 (`008c1ccd`) y con las filas de #215 R8, así que no cambia nada de
esta spec.

**Elementos compartidos.** #224 es el dueño de todos. #215 va detrás y nunca cambia la
API de un componente de #224.

| Elemento | #224 (dueño) | #215 (detrás) |
|---|---|---|
| `src/screens/food/parse-ai-explanation.ts`: `parseAiExplanation`, `aiExplanationPlainText` (#224 R1, R3, R11) | Lo crea. | Importa las dos funciones en `screens/nutrition-plan/index.tsx` (R8). Solo lectura. |
| `src/screens/food/ai-explanation.tsx`: `AiExplanation({ text })` (#224 R11) | Lo crea «de modo que #215 lo reutilice con solo importarlo». | **No lo importa** (decisión del firmante D2). No cambia su API ni le añade props. |
| `src/screens/food/index.tsx` | R10 rehace la región de la tarjeta de IA. | R18 cambia solo la expresión de la ración y añade un import detrás del de `CATEGORY_SLOTS`. Son regiones distintas. |
| `src/screens/food/index.test.tsx` | R10 cambia el mock de `reicon-react-native` (añade `ChevronDown` y `ChevronUp`). | Añade un `it` al final del fichero. No toca mocks. |
| `src/i18n/catalog.ts` | R4 añade `food.aiShowMore`, `food.aiShowLess` y `food.aiDisclaimer`. | Añade 16 claves `nutritionPlan.*` detrás de `'mealSchedule.noMealPlanYet'` (R19). |
| `src/__tests__/ui-copy-table.ts` | R4 añade filas a `R6_FOOD`. | Añade el bloque nuevo `R22_NUTRITION_PLAN` (R19). |
| `src/__tests__/ui-language.test.ts`, agregado de `SCREEN_FILES` | R4 añade `+ 1 // #224 R4: screens/food/ai-explanation.tsx`. | Su `+ 1 // #215 R19` va **detrás** de la línea de #224. |
| `src/providers/__tests__/language-provider.test.tsx`, total de claves | R4 añade `+ 3 // #224 R4`. | Su `+ 16, // #215 R19` va **la última**, y la coma se mueve a ella. |
| `src/__tests__/profile-canvas-fidelity.test.ts`, lista de text-13 | R13 conserva `screens/food/index.tsx` y solo añade `screens/food/ai-explanation.tsx` (fe de erratas E1 de #224, `cbbf08cd`: la lista pasa de 25 a 26). | Añade `screens/nutrition-plan/index.tsx` delante de `screens/nutrition-questionnaire/index.tsx` (R20). |
| `src/__tests__/nutrition-canvas-fidelity.test.ts`, constantes `AI_EXPLANATION` y `AI_PARSER` (#224 R13) | Las crea. | No las toca. |

#### Re-verificar al mergear #224

Se ejecuta desde `mobile-pet-tracker/` **después** de `git merge origin/dev` con #224
dentro, y **antes** de cualquier commit de #215.

| Orden | Salida esperada | Qué prueba |
|---|---|---|
| `grep -cE '^export (function\|const) parseAiExplanation\b' src/screens/food/parse-ai-explanation.ts` | `1` | El parser existe y se exporta. |
| `grep -cE '^export (function\|const) aiExplanationPlainText\b' src/screens/food/parse-ai-explanation.ts` | `1` | El texto plano se exporta. |
| `grep -cF '// #224 R4' src/providers/__tests__/language-provider.test.tsx` | `1` | El `+ 3` de #224 está en el total. |
| `grep -cF '+ 1 // #224 R4: screens/food/ai-explanation.tsx' src/__tests__/ui-language.test.ts` | `1` | La línea de #224 en `SCREEN_FILES`. |
| `grep -cF "'screens/food/ai-explanation.tsx', // #224 R13" src/__tests__/profile-canvas-fidelity.test.ts` | `1` | La enmienda de text-13 de #224. |
| `grep -cF "'food.aiDisclaimer'" src/i18n/catalog.ts` | `2` | Las claves de #224, en `en` y en `es`. |
| `grep -cF 'loadedPlan.dailyGrams / loadedPlan.mealsPerDay' src/screens/food/index.tsx` | `1` | #224 no tocó la expresión de la ración que cambia R18. |
| `grep -cF "import { CATEGORY_SLOTS } from '../../utils/category-palette';" src/screens/food/index.tsx` | `1` | El ancla del import de R18. |

Si una salida no cuadra, el implementer **para** y lo anota en
`progress/impl_mobile-nutrition-ai-plan.md`. No adapta la spec por su cuenta.

Después se re-miden, con la regla mecánica de R20, el total del catálogo y el agregado de
`SCREEN_FILES`:

- total sin #224: `667 + 16 = 683`;
- total con #224: `670 + 16 = 686`.

> **Fe de erratas E2 del firmante (2026-10-27, medida en `20fc6616`, el merge de
> `origin/dev` con #223 y #224 dentro).** Las 8 órdenes de la tabla de arriba dan la salida
> esperada. #223 (PR #279) también tocó las guardas, y eso cambia dos cosas:
>
> - **Total del catálogo.** #223 R16 añade `+ 6 // #223 R16` antes de `+ 77 // #209 R23`.
>   La base medida es 676 claves en `en` y en `es` (667 + 6 + 3), y con #215 queda en
>   `676 + 16 = 692`. La última línea de la suma es `+ 3, // #224 R4`. `+ 16, // #215 R19` va
>   detrás de ella y la coma pasa a la línea nueva. `SCREEN_FILES` no cambia con #223:
>   #215 añade su `+ 1 // #215 R19` detrás de `+ 1 // #224 R4: screens/food/ai-explanation.tsx`.
> - **`rounded-16` en `chunky-cta-canvas-fidelity.test.ts`.** La base es ahora
>   `+ 3 + 11 + 3 + 1); // #223 R9 // #209 R24`, y queda en
>   `+ 3 + 11 + 3 + 1 + 3); // #215 R20 // #223 R9 // #209 R24`. La cifra de #215 sigue
>   siendo `+ 3`.
>
> Todo lo demás sigue igual. Las líneas que #223 añade a `directUses` y a las dos sumas
> `+ 6 // #209 R24` de `consistency-classnames.test.ts` van **delante** de las de #209, así
> que el «detrás de #209» de R20 sigue siendo la última posición. Las demás celdas «Base» de
> R19 y R20 se verificaron una a una con `grep -cF` sobre `20fc6616`, y salen como dice la
> spec.

Las líneas de #215 van **siempre las últimas** de cada suma.

### Contrato del backend (verificado contra el árbol)

Ficheros:

- `backend-pet-tracker/src/modules/nutrition/domain/nutrition-ai-proposal.ts`;
- `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

**Tipos**

- `NutritionAiProposal = { mealGrams: { mealTime: string; grams: number }[]; recommendations: string[]; reviewDate: string }`,
  con `reviewDate` en la forma `YYYY-MM-DD`.
- `NutritionAiStatus = 'proposed' | 'not_tracked' | 'limit_reached' | 'unavailable' | 'rejected'`.
- `NUTRITION_AI_DAILY_LIMIT = 3`, por mascota y día local del dueño.

**Respuestas**

- `GET /pets/:petId/nutrition-plan`: el plan con `aiProposal` (puede ser `null`).
- `POST …/generate`: `{ ...plan, aiStatus }`. El plan lleva `aiProposal`.

**Ramas de `generate`**

| Caso | `aiStatus` | ¿Gasta un uso? | `aiProposal` del plan devuelto |
|---|---|---|---|
| Mismo hash de entradas y el último plan ya tenía propuesta | `'proposed'` | No | La propuesta en caché |
| Mascota sin collar | `'not_tracked'` | No | `null` |
| Límite agotado | `'limit_reached'` | — | `null` |
| La IA falla | `'unavailable'` | — | `null` |
| Propuesta fuera de cota | `'rejected'` | — | `null` |
| Propuesta aceptada | `'proposed'` | Sí | La propuesta nueva |

Si el hash cambia, se inserta un plan nuevo con `aiProposal: null` antes de la fase de IA.

**Lo que se deduce para la pantalla**

- Con `not_tracked`, `limit_reached`, `unavailable` y `rejected`, el plan **nunca** trae
  propuesta.
- Los filtros de alimentos tóxicos pueden dejar `recommendations` vacía.
- `generate` es solo para el dueño (403 para `family`).
- El backend no expone cuántos usos quedan hoy.

### Decisiones cerradas (no reabrir)

**1. Entrada a la pantalla.** Se entra **solo** tras un `generate` `ok` desde Horario, con
`router.push({ pathname: '/nutrition-plan', params })`:

- `params` lleva `petId`;
- y `aiStatus`, si la respuesta lo trae y es válido.

`aiStatus` no se persiste: solo viaja como parámetro de la ruta.

**2. Vista elegida.** La elige la función pura `planView(plan, status, tracked)` (R11),
aplicando la primera regla que se cumpla:

| Orden | Condición | Vista |
|---|---|---|
| 1 | `status === 'limit_reached'` | límite |
| 2 | `status === 'rejected'` | descartada |
| 3 | `status === 'not_tracked'` | sin collar |
| 4 | `plan.aiProposal` | IA |
| 5 | `status === null && tracked === false` | sin collar |
| 6 | cualquier otro caso | motor |

`unavailable` cae en la regla 4 (si hay propuesta) o en la 6, sin nota.

**3. Gramos por comida** (`utils/meal-portion.ts`, R2).

- Con propuesta y la hora presente en `mealGrams`: los gramos de la propuesta.
- En otro caso: `Math.round(dailyGrams / mealsPerDay)`, el cálculo que Horario y Nutrición
  ya hacían.

Horario (R17) y Nutrición (R18) usan la misma función.

**4. Totales.**

- Vista IA: la suma de las filas.
- Resto de vistas: `dailyGrams`. Así el total del motor sigue siendo 350, y no 3 × 117 = 351.

**5. Línea «antes».** Va en todas las filas de la vista IA, con los gramos del motor.

Si una hora del plan no está en `mealGrams`, su fila muestra los gramos del motor también
en «antes». Pasa si se cambió el horario después de generar.

**6. Hora de la insignia IA.** Sale de `generatedAt`.

- Límite conocido: `setAiResult` de #212 no actualiza `generatedAt`. Si la IA respondió en
  un `generate` posterior con el mismo hash, la hora es la de creación del plan.
- Arreglarlo pide un campo nuevo en el backend.

**7. «Hoy».** Se compara el día local de `generatedAt` con el de `plan.dataUpdatedAt`
(React Query), con `toDateString()`. No se usa `Date.now()` en el render: lo veta la regla
de pureza.

**8. Fechas.**

- Formato: `toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`,
  con `locale` de `useLocale()` (`'es-MX'` o `'en-US'`).
- La hora, con `timeToHhmm` de `utils/civil-date.ts`.
- `reviewDate` se convierte con `isoToLocalDate`. Si devuelve `null`, no hay línea de
  revisión.

**9. Nombres de las comidas.** Los artboards dibujan dos columnas: la hora (52 px) y el
nombre («Desayuno», «Comida», «Cena»). Ni el plan ni el catálogo tienen nombres de comida.

La fila pinta la hora en el hueco del nombre y no hay columna de 52 px (decisión del
firmante D5).

**10. Vista límite.**

- La parte de arriba es la del **motor**, porque el backend manda `aiProposal: null` con
  límite.
- El pie es el de PlanIALimite.

Ver la decisión del firmante D4.

**11. Contador «Te quedan N de 3 planes hoy».** **No se pinta** y no se añaden sus claves:
el backend no expone cuántos usos quedan (decisión del firmante D1, §Contador).

**12. Usuario `family`.** No ve el pie: ni «Pedir otro plan», ni «Vincular collar», ni el
texto del límite. El resto de la pantalla es igual que para el dueño.

**13. Errores secundarios.**

- Si falla `getPet`: no hay título, ni pie (el rol es desconocido).
- Si falla `getPetTracking`: `tracked` vale `null` y no se aplica la regla 5 de `planView`.

**14. Botón violeta «Pedir otro plan»: tonal** (decisión del firmante D6).

- Usa la receta tonal que la carta ya aprueba para «Generar plan» de Horario (#200 R14,
  `generate-plan-button` en `screens/meal-schedule/index.tsx`), adaptada a `h-14`:
  - botón `variant="tertiary"`, ``className={`h-14 gap-2 rounded-16 ${CATEGORY_SLOTS.violet.surface}`}``,
    `style={chunkyLip.violet}` e `isDisabled={submitting}`;
  - etiqueta ``className={`text-17 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}``;
  - icono `Sparkles` de 18 en color `category-violet-strong`.
- Contraste de la etiqueta (17 px en negrita no es texto grande, cuyo umbral es 18,66 px,
  así que necesita 4,5:1):

  | Modo | Texto sobre superficie | Contraste |
  |---|---|---|
  | claro | `#7549F7` sobre `#F5F3FF` | 4,72:1 |
  | oscuro | `#9579E7` sobre `#221C33` | 4,81:1 |

- **Desviación declarada respecto al artboard.** PlanIA y PlanIADescartada dibujan un
  relleno sólido con texto blanco. En oscuro, el blanco sobre `#9579E7` da 3,41:1 y no
  pasa AA para esta etiqueta. `docs/ui-guidelines.md` §1 (Paleta pastel categórica) exige
  AA calculado para cada par texto/superficie, y aceptar el 3,41:1 sería enmendar la
  carta, que no se delega. Si el humano quiere el sólido, hace falta un token oscuro que
  pase AA, y eso es una enmienda de la carta.
- Labio `chunkyLip.violet` (`lip-violet`, desplazamiento 4), **no** el `#4C2BB8` del
  canvas. Es el mismo labio de «Generar plan». Desviación declarada.
- No hay clase nueva en la paleta: las dos clases salen de `CATEGORY_SLOTS.violet`, y la
  guarda `#64 R9` («centraliza las diez clases completas…») no se toca.

**15. «Vincular collar».** Reutiliza la clave `home.pairCollar` y navega con
`router.push('/pairing')`, igual que Perfil.

**16. «Pedir otro plan» sin cambios en las entradas.** El backend devuelve la misma
propuesta en caché sin gastar uso, y la pantalla se ve igual. No se avisa (§Fuera de
alcance).

### Decisiones del firmante (leader, firma delegada 2026-10-27)

Cerradas por el leader con la firma delegada (mandato del 2026-10-23, ampliado el
2026-10-26). Las que dejan algo pendiente del humano lo dicen y van a §Fuera de alcance.

**D1. Contador de usos: no se pinta.** PlanIA dibuja «Te quedan 2 de 3 planes hoy» y
PlanIADescartada «Te queda 1 de 3 planes hoy».

- Por qué: el backend no expone los usos que quedan, y una cifra calculada en el cliente
  mentiría (no ve los `generate` de otros dispositivos).
- Es una desviación del artboard y del copy de G1, que dibujan el contador. **Queda para
  el humano**, que decide si abre una feature de backend `aiRemainingToday`.
- El copy queda en §Contador por si esa feature llega.

**D2. `AiExplanation` de #224: opción A.** #215 importa solo `parseAiExplanation` y
`aiExplanationPlainText` y pinta texto plano en la sección violeta.

- Por qué no B (reutilizar `AiExplanation`): trae su propio aviso `food.aiDisclaimer`
  («Orientativo: no sustituye la opinión de tu veterinario.») y el recorte a 122 px con
  «Ver más», que PlanIA no dibuja. Habría dos avisos, o habría que cambiar el copy de G1,
  que no se delega.
- Por qué no C (añadir una prop a `AiExplanation`): cambia la API de un componente de
  #224, y #224 es el dueño.

**D3. Entrada permanente desde Nutrición: no.** Solo se entra tras generar desde Horario
(decisión cerrada 1). En Nutrición cambian solo los gramos (R18).

- Por qué: ningún artboard la dibuja, y añadirla pide G1, que no se delega.

**D4. Parte de arriba de PlanIALimite: la del motor**, con el pie del límite.

- Por qué: el contrato manda `aiProposal: null` con `limit_reached`. Pintar los gramos de
  IA, «antes» y las recomendaciones del artboard sería inventarlos.

**D5. Nombres de comida y columna de hora: no.** La fila pinta la hora en el hueco del
nombre, sin columna de 52 px (decisión cerrada 9).

- Por qué: los nombres («Desayuno», «Comida», «Cena») piden copy nuevo de G1 y un reparto
  para `mealsPerDay ≠ 3`, que ni el plan ni el catálogo tienen.

**D6. Botón violeta: tonal**, según la decisión cerrada 14.

- Por qué: el sólido del artboard no pasa AA en oscuro, y aceptarlo es una enmienda de la
  carta, que no se delega.

**D7. Copy con género: el literal de G1**, «que está bien para él».

- Por qué: una forma neutra es cambio de copy de G1, que no se delega.
- **Nota de copy para el humano:** «para él» supone una mascota macho.

## Requisitos

Convenciones:

**Arnés de la pantalla.** El test es `src/screens/nutrition-plan/index.test.tsx` y usa el
arnés de `src/screens/nutrition-questionnaire/index.test.tsx`:

- render: `renderWithProviders(<HeroUINativeProvider><LanguageProvider initial="es"><NutritionPlanScreen /></LanguageProvider></HeroUINativeProvider>)`,
  con `renderWithProviders` de `'../../../test/render-with-providers'`;
- las filas en inglés usan `initial="en"`;
- `await` en cada `fireEvent` y en cada `act` (RNTL 14).

Mocks (intención; se verifican contra el fichero destino):

| Módulo | Mock |
|---|---|
| `expo-router` | `useLocalSearchParams: () => mockParams()`, con `const mockParams = jest.fn(() => ({ petId: 'pet-1' }))`; `router: { push, back, canGoBack: jest.fn(() => false), replace }`. |
| `../../api/nutrition` | `({ ...jest.requireActual('../../api/nutrition'), getNutritionPlan: jest.fn(), generateNutritionPlan: jest.fn() })`. Conserva el `isNutritionAiStatus` real. |
| `../../api/pets` | `({ getPet: jest.fn() })`. |
| `../../api/subscriptions` | `({ ...jest.requireActual('../../api/subscriptions'), getPetTracking: jest.fn() })`. |
| `../../providers/auth-provider` | `useAuth: () => ({ token: 'jwt-token', status: 'authenticated', signOut: mockSignOut })`. |
| `react-native-safe-area-context` | insets `{ top: 40, right: 0, bottom: 24, left: 0 }`. |
| `../../theme/use-theme-colors` | `useThemeColors: (tokens: string[]) => tokens`. Devuelve el nombre del token para poder fijar el color de cada icono. |
| `reicon-react-native` | Con la forma del de Horario (`src/screens/meal-schedule/index.test.tsx`), un icono por testID: `ChevronLeft` → `nutrition-plan-icon-back`, `Calendar` → `nutrition-plan-icon-calendar`, `InfoCircle` → `nutrition-plan-icon-info`, `Sparkles` → `nutrition-plan-icon-sparkles`. Pasan `size` y `color`. |

`parse-ai-explanation` **no** se mockea: se usa el módulo real de #224.

`beforeEach`:

- `process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1/'`;
- `getPet` → `{ kind: 'ok', pet: makePet() }`;
- `getPetTracking` → `{ kind: 'ok', tracked: true }`;
- `getNutritionPlan` → `{ kind: 'ok', plan: makePlan() }`.

**Fixtures**

- `makePet()`: el del cuestionario, con `id: 'pet-1'`, `name: 'Rocky'`,
  `currentWeightKg: 12.4` y `myRole: 'owner'`.
- `makePlan(overrides)`:
  - `dailyGrams: 350`, `mealsPerDay: 3`, `mealTimes: ['08:00', '13:00', '18:00']`;
  - `aiExplanation: null`, `aiProposal: null`;
  - `generatedAt: '2026-08-23T12:00:00.000Z'`;
  - el resto de campos de `NutritionPlan` como en el `makePlan` de Horario.
- `PROPOSAL`:
  - `mealGrams: [{ mealTime: '08:00', grams: 112 }, { mealTime: '13:00', grams: 98 }, { mealTime: '18:00', grams: 110 }]`;
  - `recommendations: ['Pasea 10 minutos más por la mañana.', 'Mide la ración con una báscula.']`;
  - `reviewDate: '2027-01-01'`.

Con estos datos, el motor da `Math.round(350 / 3) = 117` por comida y la IA suma 320.
Ninguna cifra coincide con las del canvas, a propósito.

**Literales y rutas.**

- Los literales esperados se escriben **a mano en el test**, copiados de esta spec. Nunca
  se importan de `catalog.ts`.
- Las rutas son relativas a `mobile-pet-tracker/`, y las anclas `grep` se ejecutan desde
  ahí.

**Nombres de test.** Todo test nuevo empieza por `#215 R<n>:`, con dos puntos. Así
`-t '#215 R1:'` no recoge `R10`–`R22`.

**Pertenencia.** Se comprueba con `within(container).getAllByTestId(/^prefijo-\d+$/)`, que
excluye la raíz.

**testIDs nuevos.** Empiezan por `nutrition-plan-` o son `screen-nutrition-plan`. Solo
existen en la pantalla nueva, que ningún test actual pinta.

### API y utilidades

**R1** — THE SYSTEM SHALL añadir los tipos y el cliente del contrato de #212.

En `src/api/types.ts`, justo antes de `export interface NutritionPlan`:

```ts
export interface NutritionMealGrams { mealTime: string; grams: number; }
export interface NutritionAiProposal { mealGrams: NutritionMealGrams[]; recommendations: string[]; reviewDate: string; }
export type NutritionAiStatus = 'proposed' | 'not_tracked' | 'limit_reached' | 'unavailable' | 'rejected';
```

`NutritionPlan` gana `aiProposal?: NutritionAiProposal | null;` justo después de
`aiExplanation: string | null;`. Es opcional para que los `makePlan` actuales sigan
compilando.

En `src/api/nutrition.ts`:

- se exportan `NUTRITION_AI_STATUSES: readonly NutritionAiStatus[]` (los cinco valores, en
  el orden del tipo) e `isNutritionAiStatus(value: unknown): value is NutritionAiStatus`;
- la variante `ok` de `GeneratePlanState` pasa a
  `{ kind: 'ok'; plan: NutritionPlan; aiStatus?: NutritionAiStatus }`;
- WHEN la respuesta 200 de `generate` trae un `aiStatus` válido THE SYSTEM SHALL
  devolverlo en `aiStatus`;
- IF falta o no es válido THEN THE SYSTEM SHALL dejar `aiStatus` en `undefined`.

Tests en `src/api/__tests__/nutrition.test.ts`, con sus `baseUrl`, `generateEndpoint`,
`response(status, body)` y `makePlan`:

- `it.each` `'#215 R1: generate devuelve aiStatus %s'`, con las 5 cadenas válidas. Cuerpo
  `{ ...makePlan(), aiStatus }`; resultado `toEqual({ kind: 'ok', plan: body, aiStatus })`.
- `it.each` `'#215 R1: generate descarta el aiStatus %p'`, con `'weird'`, `'PROPOSED'`,
  `null`, `3` y el cuerpo sin la clave. Comprueba `result.kind === 'ok'` y que
  `(result as { aiStatus?: unknown }).aiStatus` es `toBeUndefined()`.
- `it.each` `'#215 R1: isNutritionAiStatus(%p) es %p'`:
  - `true` para las 5 cadenas válidas;
  - `false` para `'PROPOSED'`, `''`, `null`, `undefined`, `3` y `{}`.
- `it('#215 R1: getNutritionPlan conserva aiProposal')`: con `aiProposal: PROPOSAL` en la
  respuesta 200, `result.plan.aiProposal` es `toEqual(PROPOSAL)`.

Los `it` actuales de `generateNutritionPlan` siguen verdes sin tocarlos: `toEqual` ignora
una clave `undefined`.

Ancla: `grep -cF 'isNutritionAiStatus' src/api/nutrition.ts` da `0` antes y `2` o más
después.

**R2** — THE SYSTEM SHALL crear `src/utils/meal-portion.ts`, que exporta:

- `engineMealGrams(plan)`, que devuelve `Math.round(plan.dailyGrams / plan.mealsPerDay)`;
- `mealPortionGrams(plan, mealTime)`:
  - WHEN `plan.aiProposal?.mealGrams` contiene esa hora THE SYSTEM SHALL devolver sus
    gramos;
  - IF no la contiene, o la propuesta es `null` o falta, THEN THE SYSTEM SHALL devolver
    `engineMealGrams(plan)`.

Test `src/utils/__tests__/meal-portion.test.ts`, `it.each` `'#215 R2: mealPortionGrams %s'`,
una fila por rama:

| Fila | Entrada | Resultado |
|---|---|---|
| propuesta con la hora | `08:00`, con `PROPOSAL` | `112` |
| propuesta sin la hora | `09:00`, con `PROPOSAL` | `117` |
| `aiProposal: null` | `08:00` | `117` |
| sin la clave `aiProposal` | `08:00` | `117` |
| redondeo hacia arriba | `dailyGrams: 187`, `mealsPerDay: 2`, sin propuesta | `94` |

Más `it('#215 R2: engineMealGrams redondea')`: `350 / 3` da `117` y `187 / 2` da `94`.

### Ruta

**R3** — THE SYSTEM SHALL tener la ruta delgada `src/app/nutrition-plan.tsx`, que solo
contiene:

```ts
export { NutritionPlanScreen as default } from '../screens/nutrition-plan';
```

`src/app/_layout.tsx` gana
`<Stack.Screen name="nutrition-plan" options={{ headerShown: false }} />`:

- como **último hijo** del grupo `Stack.Protected`;
- justo después de la línea de `nutrition-profile`.

Test nuevo en `src/app/__tests__/layout.test.tsx`, dentro de
`describe('#194 R4: the profile editor is protected')`:
`it('#215 R3: nutrition-plan es el último hijo protegido, justo tras nutrition-profile, sin cabecera nativa')`.

Sigue el patrón del `it` de `#209 R3` y comprueba:

- que el último hijo es `[Stack.Screen, 'nutrition-plan', { headerShown: false }]`;
- que el penúltimo se llama `nutrition-profile`.

Las cuentas que mueve están en R20, tabla «layout».

Ancla: `grep -cF 'name="nutrition-plan"' src/app/_layout.tsx` da `0` antes y `1` después.

### Pantalla «Plan de <nombre>»

**Fichero.** `src/screens/nutrition-plan/index.tsx`. Exporta `NutritionPlanScreen` y la
función pura `planView` (R11).

**Parámetros y estado.**

- Lee `petId` y `aiStatus` con
  `useLocalSearchParams<{ petId: string; aiStatus?: string }>()`.
- El estado `status` arranca en `isNutritionAiStatus(aiStatus) ? aiStatus : null`.

**Consultas.** Tres, todas con `process.env.EXPO_PUBLIC_API_URL` y el `token` de
`useAuth`:

| Consulta | Clave | Llamada |
|---|---|---|
| plan | `nutritionKeys.plan(petId)` | `getNutritionPlan` |
| mascota | `petKeys.detail(petId)` | `getPet` |
| collar | `deviceKeys.tracking(petId)` | `getPetTracking` |

**R4** — Carga, error y plan inexistente.

- WHILE la consulta del plan no tiene datos THE SYSTEM SHALL pintar
  `nutrition-plan-skeleton` y no pintar `nutrition-plan-meals`.
- WHEN el plan devuelve `error`, `unreachable`, `unauthorized` o `missing-config` THE
  SYSTEM SHALL:
  - pintar `nutrition-plan-load-error` con «Algo salió mal»;
  - pintar `nutrition-plan-retry` con «Reintentar»;
  - al pulsarlo, volver a llamar a `getNutritionPlan`.
- WHEN el plan devuelve `not-found` THE SYSTEM SHALL pintar `nutrition-plan-empty` con
  «Aún no hay plan de alimentación», sin insignia, sin tarjeta y sin pie.

Tests:

- `it('#215 R4: esqueleto mientras carga')`, con `getNutritionPlan` como promesa que nunca
  resuelve.
- `it.each` `'#215 R4: error %s con reintento'`, con 4 filas, una por kind. Tras
  `await fireEvent.press(retry)`, `getNutritionPlan` se ha llamado 2 veces.
- `it('#215 R4: sin plan')`: `nutrition-plan-badge` y `nutrition-plan-footer` dan `null`.

**R5** — Cabecera. THE SYSTEM SHALL pintar
`ScreenHeader testID="nutrition-plan-header" size={24} backFallback="/meal-schedule"`.

- WHEN la mascota carga THE SYSTEM SHALL usar de título `t('nutritionPlan.title', { name })`:
  «Plan de Rocky» en español y «Rocky's plan» en inglés.
- IF `getPet` falla THEN THE SYSTEM SHALL no pasar título.

Tests:

- `it.each` `'#215 R5: título en %s'`, con las dos lenguas.
- `it('#215 R5: volver sin historial va a Horario')`: con `canGoBack` en `false`, pulsar
  `nutrition-plan-header-back` llama a `router.replace('/meal-schedule')`.
- `it('#215 R5: sin mascota no hay título')`: con `getPet` → `{ kind: 'error' }`,
  `queryByText(/^Plan de/)` da `null`.

**R6** — Insignia `nutrition-plan-badge`, con su texto en `nutrition-plan-badge-text`.

- WHEN la vista es IA y `generatedAt` cae en el mismo día local que `plan.dataUpdatedAt`
  THE SYSTEM SHALL pintar `aiBadgeToday`.
- WHEN la vista es IA y cae en otro día THE SYSTEM SHALL pintar `aiBadgeDated`.
- En la vista IA, la insignia lleva un `Sparkles` de 14 en color `category-violet-strong`.
- WHEN la vista es motor, sin collar, descartada o límite THE SYSTEM SHALL pintar
  `engineBadge` con `dailyGrams`, sin icono.

Test `it.each` `'#215 R6: insignia %s'`. `generatedAt` se construye con fechas **locales**
y `.toISOString()`:

| Fila | `generatedAt` | Lengua | Texto |
|---|---|---|---|
| hoy | `const g = new Date(); g.setHours(10, 20, 0, 0)` | es | «Ajustado con IA · hoy, 10:20» |
| hoy | igual | en | «Adjusted with AI · today, 10:20» |
| fin de año | `new Date(2025, 11, 31, 18, 5)` | es | «Ajustado con IA · 31 dic 2025, 18:05» |
| fin de año | igual | en | «Adjusted with AI · Dec 31, 2025, 18:05» |
| año nuevo | `new Date(2026, 0, 1, 7, 0)` | es | «Ajustado con IA · 1 ene 2026, 07:00» |
| año nuevo | igual | en | «Adjusted with AI · Jan 1, 2026, 07:00» |
| febrero | `new Date(2026, 1, 28, 9, 30)` | es | «Ajustado con IA · 28 feb 2026, 09:30» |

Las filas con fecha cruzan mes y año. Ninguna es de septiembre, porque ICU da «sep» o
«sept» según la versión.

Test `it.each` `'#215 R6: insignia del motor en la vista %s'`, una fila por vista:

| Vista | Cómo se llega |
|---|---|
| motor | sin propuesta, `tracked: true` |
| sin collar | `aiStatus: 'not_tracked'` |
| descartada | `aiStatus: 'rejected'` |
| límite | `aiStatus: 'limit_reached'` |

En todas, el texto es «Plan calculado · 350 g al día» y
`within(badge).queryByTestId('nutrition-plan-icon-sparkles')` da `null`.

**R7** — Tarjeta `nutrition-plan-meals`. THE SYSTEM SHALL pintar, en orden, una fila
`nutrition-plan-row-<i>` por cada `mealTimes[i]`. Cada fila lleva:

- la hora;
- los gramos en `nutrition-plan-grams-<i>` («{{grams}} g»);
- solo en la vista IA, `nutrition-plan-before-<i>` («antes {{grams}} g», con
  `engineMealGrams`).

Cierra la tarjeta `nutrition-plan-total`: «Total» y `nutrition-plan-total-grams`
(«{{grams}} g al día»).

Tests:

- `it('#215 R7: filas de la IA')`, con `aiProposal: PROPOSAL`:
  - 3 filas por `within(meals).getAllByTestId(/^nutrition-plan-row-\d+$/)`;
  - gramos «112 g», «98 g» y «110 g»;
  - «antes 117 g» en las 3;
  - total «320 g al día».
- `it('#215 R7: filas del motor')`, sin propuesta:
  - «117 g» ×3;
  - `queryAllByTestId(/^nutrition-plan-before-\d+$/)` vacío;
  - total «350 g al día».
- `it('#215 R7: una fila por hora')`: con `mealTimes: ['07:30', '19:30']`, `mealsPerDay: 2`
  y `dailyGrams: 187`, hay 2 filas de «94 g» y el total es «187 g al día».

**R8** — Sección «Por qué cambié sus porciones» (`nutrition-plan-why`).

- WHEN la vista es IA y `aiExplanationPlainText(parseAiExplanation(aiExplanation))` no es
  vacío THE SYSTEM SHALL pintar:
  - la cabecera «Por qué cambié sus porciones», con `accessibilityRole="header"`;
  - `nutrition-plan-why-text` con ese texto plano.
- IF `aiExplanation` es `null`, el texto plano es `''` o la vista no es IA THEN THE SYSTEM
  SHALL no pintar la sección.

Tests:

- `it.each` `'#215 R8: texto plano de %p'`. Compara
  `getByTestId('nutrition-plan-why-text').props.children` con `toBe` (no `getByText`, cuyo
  normalizador colapsa el `\n`):

  | Entrada | Texto plano |
  |---|---|
  | `'Intro:\n- uno\n- dos'` | `'Intro:\nuno\ndos'` |
  | `'- Mide **300 g** al día'` | `'Mide 300 g al día'` |

- `it.each` `'#215 R8: sin sección %s'`, 3 filas:
  - `aiExplanation: null`, con propuesta;
  - `aiExplanation: ''`, con propuesta;
  - `aiExplanation: 'Texto'` **sin** propuesta (vista motor).

**R9** — Recomendaciones.

- WHEN la vista es IA y `recommendations` no es vacía THE SYSTEM SHALL pintar:
  - `nutrition-plan-recommendations-title` «Recomendaciones», con
    `accessibilityRole="header"`;
  - `nutrition-plan-recommendations`, con un `nutrition-plan-recommendation-<i>` por
    elemento, en orden y numerado desde 1.
- IF la lista es vacía o la vista no es IA THEN THE SYSTEM SHALL no pintar ni el título ni
  la lista.

Tests:

- `it('#215 R9: lista numerada')`:
  - 2 elementos por `within(list).getAllByTestId(/^nutrition-plan-recommendation-\d+$/)`;
  - el 0 contiene «1» y «Pasea 10 minutos más por la mañana.»;
  - el 1 contiene «2» y «Mide la ración con una báscula.».
- `it.each` `'#215 R9: sin recomendaciones %s'`: `recommendations: []` con propuesta, y la
  vista motor.

**R10** — Revisión y aviso.

- WHEN la vista es IA y `isoToLocalDate(reviewDate)` no es `null` THE SYSTEM SHALL pintar
  `nutrition-plan-review` con «Próxima revisión: {{date}}».
- WHEN la vista es IA THE SYSTEM SHALL pintar `nutrition-plan-disclaimer` con «Es una
  sugerencia y no sustituye la opinión de su veterinario.».
- IF la vista no es IA THEN THE SYSTEM SHALL no pintar ninguno de los dos.

Test `it.each` `'#215 R10: revisión %s'`:

| `reviewDate` | Lengua | Texto |
|---|---|---|
| `'2026-12-31'` | es | «Próxima revisión: 31 dic 2026» |
| `'2026-12-31'` | en | «Next review: Dec 31, 2026» |
| `'2027-01-01'` | es | «Próxima revisión: 1 ene 2027» |
| `'2027-01-01'` | en | «Next review: Jan 1, 2027» |
| `'2027-05-05'` | es | «Próxima revisión: 5 may 2027» |
| `'2027-05-05'` | en | «Next review: May 5, 2027» |

Más:

- `it('#215 R10: fecha inválida')`: con `'2027-13-01'` no hay `nutrition-plan-review`,
  pero sí aviso.
- `it('#215 R10: el motor no avisa')`: sin propuesta no hay revisión ni aviso.
- `it('#215 R10: aviso en inglés')`: «It's a suggestion and doesn't replace their vet's
  advice.».

**R11** — `planView(plan, status, tracked)` devuelve
`'ai' | 'engine' | 'no-collar' | 'rejected' | 'limit'` según el orden de la decisión
cerrada 2.

Test `it.each` `'#215 R11: planView %s'`, una fila por rama y por precedencia:

| Fila | Propuesta | `status` | `tracked` | Vista |
|---|---|---|---|---|
| 1 | no | `'limit_reached'` | `true` | `'limit'` |
| 2 | **sí** | `'limit_reached'` | `true` | `'limit'` |
| 3 | no | `'rejected'` | `true` | `'rejected'` |
| 4 | no | `'not_tracked'` | `true` | `'no-collar'` |
| 5 | **sí** | `'not_tracked'` | `null` | `'no-collar'` |
| 6 | sí | `'proposed'` | `true` | `'ai'` |
| 7 | sí | `null` | `null` | `'ai'` |
| 8 | sí | `'unavailable'` | `true` | `'ai'` |
| 9 | no | `null` | `false` | `'no-collar'` |
| 10 | no | `'unavailable'` | `false` | `'engine'` |
| 11 | no | `null` | `true` | `'engine'` |
| 12 | no | `null` | `null` | `'engine'` |
| 13 | sin la clave | `null` | `true` | `'engine'` |

La fila 10 fija que la regla 5 exige `status === null`.

**R12** — Vista sin collar. WHEN la vista es `no-collar` THE SYSTEM SHALL pintar:

- la insignia y las filas del motor;
- `nutrition-plan-note`, con un `InfoCircle` de 20 en color `muted`;
- `nutrition-plan-note-text` con «Para ajustar el plan con IA necesito la actividad de
  Rocky, y eso llega desde su collar. Mientras tanto, sigue con su plan calculado.»;
- para el dueño, `nutrition-plan-pair` «Vincular collar», que al pulsarlo llama a
  `router.push('/pairing')`;
- **ningún** `nutrition-plan-request`.

Test `it.each` `'#215 R12: sin collar por %s'`, una fila por rama de `planView`:

- el parámetro `aiStatus: 'not_tracked'`;
- sin parámetro y con `getPetTracking` → `{ kind: 'ok', tracked: false }`.

Más `it('#215 R12: nota en inglés')`: «To adjust the plan with AI I need Rocky's activity,
and that comes from their collar. In the meantime, keep to their calculated plan.».

**R13** — Vista descartada. WHEN la vista es `rejected` THE SYSTEM SHALL pintar:

- la insignia y las filas del motor;
- `nutrition-plan-note-text` con «Esta vez la propuesta de la IA se salía de lo seguro para
  Rocky y no la apliqué. Sigue con su plan calculado, que está bien para él.»;
- `nutrition-plan-request` habilitado, con «Pedir otro plan»;
- ningún `nutrition-plan-pair` y ningún contador.

Tests:

- `it('#215 R13: propuesta descartada')`.
- `it('#215 R13: nota en inglés')`: «This time the AI's proposal went beyond what's safe
  for Rocky, so I didn't apply it. Keep to their calculated plan, which is right for
  them.».

**R14** — Vista límite. WHEN la vista es `limit` THE SYSTEM SHALL pintar:

- la parte de arriba del motor, **sin** nota;
- en el pie, `nutrition-plan-limit` con «Ya pediste 3 planes para Rocky hoy. Podrás pedir
  otro mañana.» y `accessibilityLiveRegion="polite"`;
- `nutrition-plan-request` **deshabilitado**, con «Pedir otro plan» y un `Sparkles` de 18
  en color `muted`.

Tests:

- `it('#215 R14: límite diario')`: `expect(request).toBeDisabled()`, y
  `queryByTestId('nutrition-plan-note')` da `null`.
- `it('#215 R14: límite en inglés')`: «You've already asked for 3 plans for Rocky today.
  You can ask for another tomorrow.».

**R15** — «Pedir otro plan».

En las vistas `ai`, `engine` y `rejected`, el dueño ve `nutrition-plan-request`
habilitado.

WHEN lo pulsa THE SYSTEM SHALL:

1. borrar el error anterior;
2. deshabilitar el botón mientras espera;
3. llamar a `generateNutritionPlan('http://example.test/v1/', 'jwt-token', 'pet-1')`.

WHEN la llamada vuelve con `ok` THE SYSTEM SHALL poner `status` en
`result.aiStatus ?? null` y volver a pedir el plan.

IF vuelve con otro resultado THEN THE SYSTEM SHALL pintar en `nutrition-plan-error` el
mensaje de esta tabla:

| Resultado | Mensaje |
|---|---|
| `{ kind: 'forbidden' }` | «Solo el dueño puede generar el plan» |
| `{ kind: 'unprocessable', code: 'NUTRITION_PROFILE_REQUIRED' }` | «Primero crea un perfil nutricional» |
| `{ kind: 'unprocessable', code: 'PET_WEIGHT_REQUIRED' }` | «Primero registra un peso» |
| `{ kind: 'unprocessable', code: null }` | «Algo salió mal» |
| `{ kind: 'unreachable', message: 'x' }` | «No se pudo conectar con el servidor» |
| `{ kind: 'error' }` | «Algo salió mal» |
| `{ kind: 'missing-config' }` | «Algo salió mal» |
| la promesa rechaza | «Algo salió mal» |

IF el resultado es `unauthorized` THEN THE SYSTEM SHALL llamar a `signOut()` una vez y no
pintar error.

Tests:

- `it.each` `'#215 R15: botón habilitado en la vista %s'`, 3 filas.
- `it('#215 R15: deshabilitado mientras espera')`, con `generate` como promesa pendiente.
- `it.each` `'#215 R15: ok con aiStatus %s'`, 3 filas:

  | Antes | Respuesta | Después |
  |---|---|---|
  | vista motor | `{ kind: 'ok', plan, aiStatus: 'rejected' }` | nota de descartada |
  | vista motor | `{ kind: 'ok', plan, aiStatus: 'limit_reached' }` | `nutrition-plan-limit` |
  | parámetro `aiStatus: 'rejected'` | `{ kind: 'ok', plan }` (sin `aiStatus`), y el plan refrescado trae `PROPOSAL` | vista IA |

  En las tres, `getNutritionPlan` se ha llamado 2 veces.
- `it.each` `'#215 R15: error %s'`, con las 8 filas de la tabla.
- `it('#215 R15: sesión caducada')`.
- `it('#215 R15: el error se borra al reintentar')`: tras la fila `forbidden`, una segunda
  pulsación que devuelve `ok` deja `nutrition-plan-error` en `null`.

**R16** — Rol.

- IF `pet.myRole !== 'owner'` THEN THE SYSTEM SHALL no pintar `nutrition-plan-footer`.
- IF `getPet` falla THEN THE SYSTEM SHALL tampoco pintarlo.

Test `it.each` `'#215 R16: family no ve el pie en la vista %s'`, una fila por vista con
botones propios:

| Vista | Cómo se llega |
|---|---|
| IA | con propuesta |
| sin collar | `aiStatus: 'not_tracked'` |
| límite | `aiStatus: 'limit_reached'` |

Más `it('#215 R16: sin mascota no hay pie')`.

### Horario y Nutrición

**R17** — Horario (`src/screens/meal-schedule/index.tsx`).

(a) Navegación. WHEN el `generateNutritionPlan` de «Generar plan» devuelve `ok` THE SYSTEM
SHALL, justo después de su `plan.refetch();`, llamar a:

```ts
router.push({ pathname: '/nutrition-plan', params: result.aiStatus === undefined ? { petId } : { petId, aiStatus: result.aiStatus } });
```

IF el resultado no es `ok` THEN THE SYSTEM SHALL no navegar.

El fichero tiene dos `case 'ok':`. El que cambia es el del `switch` que sigue a
`await generateNutritionPlan(`. El otro (`await plan.refetch();`) no se toca.

(b) Gramos. La ración de cada `meal-time-row-<i>` pasa de la expresión
`Math.round(loadedPlan.dailyGrams / loadedPlan.mealsPerDay)` (hoy partida en tres líneas)
a `mealPortionGrams(loadedPlan, mealTime)`. El import va detrás del de `RiseIn`.

Anclas en `src/screens/meal-schedule/index.tsx`:

| Orden | Antes | Después |
|---|---|---|
| `grep -cF 'loadedPlan.dailyGrams / loadedPlan.mealsPerDay'` | `1` | `0` |
| `grep -cF 'mealPortionGrams'` | `0` | `2` |
| `grep -cF "pathname: '/nutrition-plan'"` | `0` | `1` |

Tests en `src/screens/meal-schedule/index.test.tsx`, en un `describe('#215 R17: …')` nuevo
al final del fichero:

- `it('#215 R17: abre el plan con aiStatus')`, con `{ kind: 'ok', plan, aiStatus: 'proposed' }`:
  `mockRouter.push.mock.calls[0][0]` es
  `toStrictEqual({ pathname: '/nutrition-plan', params: { petId: 'pet-1', aiStatus: 'proposed' } })`.
- `it('#215 R17: abre el plan sin aiStatus')`:
  `toStrictEqual({ pathname: '/nutrition-plan', params: { petId: 'pet-1' } })`. Con
  `toStrictEqual`, una clave `aiStatus: undefined` lo pone rojo.
- `it.each` `'#215 R17: no navega con %s'`, con los 7 resultados que no son `ok`:
  - `{ kind: 'forbidden' }`;
  - `{ kind: 'unprocessable', code: 'NUTRITION_PROFILE_REQUIRED' }`;
  - `{ kind: 'unprocessable', code: 'PET_WEIGHT_REQUIRED' }`;
  - `{ kind: 'unreachable', message: 'x' }`;
  - `{ kind: 'error' }`;
  - `{ kind: 'missing-config' }`;
  - `{ kind: 'unauthorized' }`.

  En todas, `push` no se llama con `pathname: '/nutrition-plan'`.
- `it('#215 R17: gramos de la IA en Horario')`, con
  `makePlan({ aiProposal: { mealGrams: [{ mealTime: '07:30', grams: 90 }], recommendations: [], reviewDate: '2027-01-01' } })`:
  - `meal-time-row-0` contiene «90 g»;
  - `meal-time-row-1` contiene «94 g» (rama del motor).

**R18** — Nutrición (`src/screens/food/index.tsx`). La ración de `meal-portion-<i>` pasa
de la misma expresión partida a `mealPortionGrams(loadedPlan, mealTime)`. El import va
detrás del de `CATEGORY_SLOTS`.

Anclas: las dos primeras de la tabla de R17, sobre `src/screens/food/index.tsx`, con las
mismas cifras.

Test: `it('#215 R18: gramos de la IA en Nutrición')`, al final de
`src/screens/food/index.test.tsx`, con la misma propuesta de R17:

- `meal-portion-0` `toHaveTextContent('· 90 g')`;
- `meal-portion-1` `toHaveTextContent('· 94 g')`.

`'#200 R6: la hora anida la ración'` sigue verde sin tocarlo: su plan no trae propuesta.

### Copy, carta y guardas

**R19** — Copy. THE SYSTEM SHALL añadir 16 claves al catálogo:

- en `en` y en `es`;
- justo detrás de `'mealSchedule.noMealPlanYet'` en los dos bloques, en este orden;
- con comillas simples, salvo los valores con apóstrofo, que van entre dobles.

Las claves son `nutritionPlan.<clave>`:

| Clave | en | es |
|---|---|---|
| `title` | `"{{name}}'s plan"` | `'Plan de {{name}}'` |
| `aiBadgeToday` | `'Adjusted with AI · today, {{time}}'` | `'Ajustado con IA · hoy, {{time}}'` |
| `aiBadgeDated` | `'Adjusted with AI · {{date}}, {{time}}'` | `'Ajustado con IA · {{date}}, {{time}}'` |
| `engineBadge` | `'Calculated plan · {{grams}} g a day'` | `'Plan calculado · {{grams}} g al día'` |
| `grams` | `'{{grams}} g'` | `'{{grams}} g'` |
| `before` | `'was {{grams}} g'` | `'antes {{grams}} g'` |
| `total` | `'Total'` | `'Total'` |
| `perDay` | `'{{grams}} g a day'` | `'{{grams}} g al día'` |
| `whyTitle` | `'Why I changed their portions'` | `'Por qué cambié sus porciones'` |
| `recommendationsTitle` | `'Recommendations'` | `'Recomendaciones'` |
| `nextReview` | `'Next review: {{date}}'` | `'Próxima revisión: {{date}}'` |
| `disclaimer` | `"It's a suggestion and doesn't replace their vet's advice."` | `'Es una sugerencia y no sustituye la opinión de su veterinario.'` |
| `noCollarNote` | `"To adjust the plan with AI I need {{name}}'s activity, and that comes from their collar. In the meantime, keep to their calculated plan."` | `'Para ajustar el plan con IA necesito la actividad de {{name}}, y eso llega desde su collar. Mientras tanto, sigue con su plan calculado.'` |
| `rejectedNote` | `"This time the AI's proposal went beyond what's safe for {{name}}, so I didn't apply it. Keep to their calculated plan, which is right for them."` | `'Esta vez la propuesta de la IA se salía de lo seguro para {{name}} y no la apliqué. Sigue con su plan calculado, que está bien para él.'` |
| `limitReached` | `"You've already asked for 3 plans for {{name}} today. You can ask for another tomorrow."` | `'Ya pediste 3 planes para {{name}} hoy. Podrás pedir otro mañana.'` |
| `requestAnother` | `'Ask for another plan'` | `'Pedir otro plan'` |

El «3» de `limitReached` es `NUTRITION_AI_DAILY_LIMIT`. Si el backend lo cambia, cambia el
copy.

Claves existentes que se reutilizan:

| Clave | es |
|---|---|
| `home.pairCollar` | «Vincular collar» |
| `common.retry` | «Reintentar» |
| `common.somethingWentWrong` | «Algo salió mal» |
| `common.cannotReachServer` | «No se pudo conectar con el servidor» |
| `mealSchedule.noMealPlanYet` | «Aún no hay plan de alimentación» |
| `mealSchedule.errorForbidden` | «Solo el dueño puede generar el plan» |
| `mealSchedule.errorProfileRequired` | «Primero crea un perfil nutricional» |
| `mealSchedule.registerWeightFirst` | «Primero registra un peso» |

**Forma de los usos.** `checkUses` exige tantas filas `(fichero, clave)` como llamadas
`t('<clave>'` hay en el fichero. `screens/nutrition-plan/index.tsx` tiene **28**, en este
orden:

| Orden | Clave | Llamadas | Dónde |
|---|---|---|---|
| 1 | `nutritionPlan.title` | 1 | |
| 2 | `common.retry` | 1 | |
| 3 | `mealSchedule.noMealPlanYet` | 1 | |
| 4 | `common.somethingWentWrong` | 4 | error de carga; `unprocessable` sin código; `case` conjunto `error`/`missing-config`; `catch` |
| 5–18 | `nutritionPlan.aiBadgeToday`, `aiBadgeDated`, `engineBadge`, `grams`, `before`, `total`, `perDay`, `whyTitle`, `recommendationsTitle`, `nextReview`, `disclaimer`, `noCollarNote`, `rejectedNote`, `limitReached` | 1 cada una | |
| 19 | `nutritionPlan.requestAnother` | 2 | botón del límite y botón violeta |
| 20 | `home.pairCollar` | 1 | |
| 21 | `mealSchedule.errorForbidden` | 1 | |
| 22 | `mealSchedule.errorProfileRequired` | 1 | |
| 23 | `mealSchedule.registerWeightFirst` | 1 | |
| 24 | `common.cannotReachServer` | 1 | |

Ningún valor fijo del catálogo aparece como literal entero en el fichero (`#194 R5`).

**Enmiendas de copy** (regla mecánica de R20):

| Fichero | Constante o `it` | Base | Después |
|---|---|---|---|
| `src/__tests__/ui-copy-table.ts` | bloque nuevo, justo antes de `export const ALL_USES: UseRow[] = [` | — | `export const R22_NUTRITION_PLAN: UseRow[] = [ // #215 R19`, con las 28 filas en el orden de la tabla, todas con `file: 'src/screens/nutrition-plan/index.tsx'` |
| `src/__tests__/ui-copy-table.ts` | `ALL_USES` | última línea `  ...R21_PET_MEMBERS, // #214 R22` | detrás: `  ...R22_NUTRITION_PLAN, // #215 R19` |
| `src/__tests__/ui-copy-table.ts` | `'#194 R5: cuadra ALL_USES con la suma de sus bloques …'` | `blocks` acaba en la línea `…, R21_PET_MEMBERS, // #214 R22` | línea nueva detrás: `      R22_NUTRITION_PLAN, // #215 R19`; sufijo ` (enmendado por #215 R19)` |
| `src/__tests__/ui-language.test.ts` | import | `  R21_PET_MEMBERS,` | detrás: `  R22_NUTRITION_PLAN,` |
| `src/__tests__/ui-language.test.ts` | agregado de `SCREEN_FILES` en `'#194 R5: no deja ningún valor fijo del catálogo como literal entero en las pantallas …'` | última línea `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx`, o la de #224 si ya está | detrás de la última: `        + 1 // #215 R19: screens/nutrition-plan/index.tsx`; sufijo ` (enmendado por #215 R19)` |
| `src/__tests__/ui-language.test.ts` | `describe` nuevo, al final | — | `describe('#215 R19: el plan resuelve su copy por clave')` › `it('#215 R19: el bloque del plan tiene 28 filas')`, con `expect(R22_NUTRITION_PLAN).toHaveLength(28); checkUses(R22_NUTRITION_PLAN);` |
| `src/providers/__tests__/language-provider.test.tsx` | total del `it` `'#194 R1: mantiene la base más las claves de #68 …'` | `+ 77, // #209 R23` (667) | `+ 77 // #209 R23` y debajo `+ 16, // #215 R19` (683); sufijo ` (enmendado por #215 R19)`. Con #224 dentro, la línea nueva va detrás de la última y la coma se mueve a ella. Tras E2 (#223 y #224 en dev), la última es `+ 3, // #224 R4` y el total es 692. |

Si al implementar otra feature ya usa `R22_`, se toma el siguiente número libre y se anota
en el reporte.

Test: los `it` enmendados y el nuevo, en verde.

Mutación obligatoria: quitar una de las dos llamadas a `t('nutritionPlan.requestAnother'`
pone rojo `#215 R19`.

**R20** — Guardas. THE SYSTEM SHALL mantener consistentes los candados que inventarían
ficheros, clases y recuentos, con estas enmiendas exactas y ninguna otra.

**Regla mecánica** (la de #209 R24):

- Cifra nueva = base + delta, con `// #215 R<n>` **delante** de los comentarios que ya
  tiene la línea.
- Cada `it` que contiene la línea enmendada, o cuyo resultado depende de una constante
  enmendada, gana una sola vez ` (enmendado por #215 R<n>)` al final del nombre.
- En las listas ordenadas de rutas, la entrada nueva va en su sitio alfabético: justo
  delante de `screens/nutrition-questionnaire`.
- En `directUses`, `CTA_ROWS` y `radii`, la fila nueva va al final.

Las anclas son de contenido, nunca números de línea.

*`src/__tests__/consistency-classnames.test.ts`* (sufijo ` (enmendado por #215 R20)` en los
cinco `it`):

| `it` | Base | Después |
|---|---|---|
| `'deja todos los botones primarios sólidos en un único radio …'` | `toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 4 + 2); // #209 R24 …` | `toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 4 + 2 + 1); // #215 R20 // #209 R24 …` |
| `directUses` (`it.each` `'%s importa y aplica sus %i esquinas …'`) | última fila `[join('screens', 'nutrition-questionnaire', 'index.tsx'), 6], // #209 R24` | detrás: `    [join('screens', 'nutrition-plan', 'index.tsx'), 3], // #215 R20` |
| `'fusiona la esquina una vez y la entrega a las dos ramas de Card …'` | su `      + 6 // #209 R24` | detrás: `      + 3 // #215 R20` |
| `'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban …'` | su `      + 6 // #209 R24` | detrás: `      + 3 // #215 R20` |
| `'inventaría los diecisiete primarios con labio, fichero a fichero …'` | `'screens/nutrition-questionnaire/index.tsx': 1, // #209 R24` | delante: `      'screens/nutrition-plan/index.tsx': 1, // #215 R20` |

El ancla `+ 6 // #209 R24` sale dos veces en el fichero, una por `it`. Cada enmienda se
ancla por su `it`.

Las tres esquinas son las de `nutrition-plan-meals`, `nutrition-plan-why` y
`nutrition-plan-note`. El primario con labio es `nutrition-plan-pair`.

*`src/__tests__/chunky-cta-canvas-fidelity.test.ts`*:

| Constante o `it` | Base | Después |
|---|---|---|
| `CTA_ROWS` | fila `['screens/food/index.tsx', literalId('food-create-profile'), …], // #209 R24` | detrás: `  ['screens/nutrition-plan/index.tsx', literalId('nutrition-plan-pair'), 'h-14 rounded-16 bg-accent', ['onPress={openPairing}']], // #215 R20` |
| `radii` | `'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24` | detrás: `  'screens/nutrition-plan/index.tsx': 3, // #215 R20` |
| `'#177 R6.2: recuentos de etiquetas …'`, `count(/text-17/g)` | `toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 2 + 4 + 2); // #209 R24 …` | `… + 4 + 2 + 5); // #215 R20 // #209 R24 …` |
| `'#177 R6.2 …'`, `count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)` | `toBe(5 + 11 + 1 + 1 - 1 - 1 + 1 + 1 + 4 + 2); // #209 R24 …` | `… + 4 + 2 + 1); // #215 R20 // #209 R24 …` |
| `'#177 R7.3: inventario de los veintisiete radios de dieciséis …'`, `count(/\brounded-16\b/g)` | `toBe(26 + … + 3 + 11 + 3 + 1); // #223 R9 // #209 R24 …` (E2) | `… + 3 + 11 + 3 + 1 + 3); // #215 R20 // #223 R9 // #209 R24 …` |

Las cinco `text-17` del fuente:

- gramos de fila (una sola aparición, dentro del `map`);
- gramos del total;
- etiqueta de `nutrition-plan-pair`;
- etiqueta del botón del límite;
- etiqueta del botón violeta.

La única etiqueta `text-accent-foreground` es la de `nutrition-plan-pair`: el botón violeta
es tonal y su etiqueta lleva `${CATEGORY_SLOTS.violet.ink}`. Los tres `rounded-16` son los
tres botones.

Ganan el sufijo: R3.1, R3.2, R3.3, R6.2, R7.2, R7.3, R7.4, R7.5 y el `it.each` de R8.1.
No cambian: R7.1, R12.1, R12.2 y R12.3.

*`src/__tests__/design-drift.test.ts`* (sufijo ` (enmendado por #215 R20)` en los dos `it`):

| `it` | Base | Después |
|---|---|---|
| `'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto …'`, diccionario de `rounded-16` | `'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24` | delante: `      'screens/nutrition-plan/index.tsx': 3, // #215 R20` |
| `'limita text-22 a Horario y text-17 al inventario de E1.2 …'` | `'screens/nutrition-questionnaire/index.tsx', // #209 R24` | delante: `      'screens/nutrition-plan/index.tsx', // #215 R20` |

*`src/__tests__/alerts-canvas-fidelity.test.ts`*: en el `it.each`
`'limita $token a su inventario de producción …'`, lista de `token: 'text-15'`, se añade
`        'screens/nutrition-plan/index.tsx', // #215 R20` delante de su
`'screens/nutrition-questionnaire/index.tsx', // #209 R24`.

Es **una** línea; el `it.each` gana el sufijo. Las otras listas del fichero no se tocan.

*`src/__tests__/profile-canvas-fidelity.test.ts`* (sufijo en los dos `it`):

| `it` | Base | Después |
|---|---|---|
| `'reserva rounded-tile a sus consumidores aprobados …'` | `'screens/nutrition-questionnaire/index.tsx', // #209 R24` | delante: `      'screens/nutrition-plan/index.tsx', // #215 R20` |
| `'limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) …'` | `'screens/nutrition-questionnaire/index.tsx', // #209 R24` | delante: `      'screens/nutrition-plan/index.tsx', // #215 R20`. Convive con la enmienda de #224 R13 a la misma lista. |

*`src/app/__tests__/layout.test.tsx`* (R3; sufijo ` (enmendado por #215 R3)` en cada `it` que
cambia):

| `it` | Base | Después |
|---|---|---|
| `'#194 R4: declara ocho rutas protegidas y alerts singular …'` | `toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 3 + 1); // #209 R3 …` | `… + 3 + 1 + 1); // #215 R3 // #209 R3 …` |
| `'#194 R4: declara alerts/[alertId] como décimo hijo y singular …'` | `toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1 + 3 + 1); // #209 R3 …` | `… + 3 + 1 + 1); // #215 R3 // #209 R3 …` |
| `'#194 R4: declara pets/[petId]/geofences como undécimo hijo y no singular …'` | `toHaveLength(10 + 1 + 1 + 1 + 1 + 1 + 3 + 1); // #209 R3 …` | `… + 3 + 1 + 1); // #215 R3 // #209 R3 …` |
| `'#194 R4: declara pets/[petId]/geofence-editor como duodécimo hijo y no singular …'` | `toHaveLength(11 + 1 + 1 + 1 + 1 + 3 + 1); // #209 R3 …` | `… + 3 + 1 + 1); // #215 R3 // #209 R3 …` |
| `'#194 R4: edit-profile es la última pantalla protegida …'` | `.at(-1 - 1); // #209 R3` | `.at(-1 - 1 - 1); // #215 R3 // #209 R3` |
| `'#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile'` | `expect(names.at(-1)).toBe('nutrition-profile');` | `expect(names.at(-1 - 1)).toBe('nutrition-profile'); // #215 R3` |

La longitud del grupo pasa de 19 a 20.

*`src/utils/category-palette.ts`* y la guarda `#64 R9` de `consistency-classnames.test.ts`
(«centraliza las diez clases completas…») **no se tocan**: el botón violeta usa
`CATEGORY_SLOTS.violet`, que ya existe.

**Medida en la semilla** de `04c6e6a5`, con las 41 suites de:

`src/__tests__ src/app/__tests__/layout.test.tsx src/screens/meal-schedule src/screens/food src/api/__tests__/nutrition.test.ts src/providers/__tests__/language-provider.test.tsx`

| Momento | Tests |
|---|---|
| T0 | 1430 |
| con las enmiendas de R3, R19 y R20 | 1435, todos verdes |
| más el `describe` de R21 | 1438 |

Re-medida el 2026-10-27 con la receta tonal (decisión cerrada 14), en las mismas 41 suites:

- la receta tonal no añade ni quita `it`: siguen 1435 y 1438;
- todas las suites de guardas (`src/__tests__/` y `layout.test.tsx`) verdes en las dos
  corridas;
- `src/screens/food/index.test.tsx` dio un flake de carga en cada corrida conjunta: dos
  rojos de #222 R7 (`food-plan-error` no encontrado, con carga media de unos 48) y luego
  uno de #200 R10 (`food-links`, flake conocido). Sola, la suite da 136/136.

Cambios de cuenta frente a la primera medida: la etiqueta `text-accent-foreground` de
chunky R6.2 pasa de +2 a +1. `text-17` sigue en +5, `rounded-16` en +3, y los primarios y el
inventario de labios no cambian (+1 y 1).

Los tests de conducta de R1, R2 y R4–R18 van encima. Es una cifra orientativa: la re-mide
el reviewer y no es un candado.

Test: todas las suites de `src/__tests__/` y `src/app/__tests__/layout.test.tsx`, en verde.

**R21** — Forma. THE SYSTEM SHALL pintar cada nodo con estas recetas exactas.

Todas las clases usan tokens que ya existen en `src/theme/global.css`:

| Token | Valor |
|---|---|
| `rounded-card` | 20 |
| `rounded-tile` | 18 |
| `rounded-16` | 16 |
| `leading-body` | 1.4 |
| `leading-note` | 1.45 |

También `text-11`, `text-13`, `text-15` y `text-17`.

| Nodo (testID) | Receta |
|---|---|
| `screen-nutrition-plan` | `View` `className="flex-1 bg-background"` |
| `ScrollView` | `className="flex-1"`, `contentInsetAdjustmentBehavior="automatic"`, `contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, gap: 12, paddingBottom: 16 }}` |
| `nutrition-plan-skeleton` | `Skeleton` `className="h-56 w-full rounded-card"` |
| `nutrition-plan-load-error` | `Text` `className="text-danger"`, dentro de un `View` `className="items-start gap-3"` junto a `nutrition-plan-retry` (`Button`) |
| `nutrition-plan-empty` | `Text` `className="font-normal text-muted"` |
| `nutrition-plan-badge` (IA) | `` `h-7 flex-row items-center gap-1.5 self-start rounded-full ${CATEGORY_SLOTS.violet.surface} px-2.5` `` |
| `nutrition-plan-badge` (motor) | `'h-7 flex-row items-center gap-1.5 self-start rounded-full bg-default px-2.5'` |
| `nutrition-plan-badge-text` (IA) | `` `text-xs font-extrabold ${CATEGORY_SLOTS.violet.ink}` `` |
| `nutrition-plan-badge-text` (motor) | `'text-xs font-extrabold text-muted'` |
| `nutrition-plan-meals` | `className="rounded-card border border-border bg-surface px-3.5 py-1"`, `style={CONTINUOUS_CORNER}` |
| `nutrition-plan-row-0` | `'min-h-13 flex-row items-center gap-3'` |
| `nutrition-plan-row-<i>`, i > 0 | `'min-h-13 flex-row items-center gap-3 border-t border-border'` |
| hora de la fila | `Text` `className="flex-1 text-15 font-bold text-foreground"` |
| contenedor de gramos | `View` `className="items-end"` |
| `nutrition-plan-grams-<i>` | `className="text-17 font-black text-foreground"` |
| `nutrition-plan-before-<i>` | `className="text-11 font-semibold text-muted"` |
| `nutrition-plan-total` | `className="min-h-13 flex-row items-center gap-3 border-t border-border"`; su etiqueta, `Text` `className="flex-1 text-15 font-extrabold text-muted"` |
| `nutrition-plan-total-grams` | `className="text-17 font-black text-foreground"` |
| `nutrition-plan-why` | `` `gap-1.5 rounded-tile ${CATEGORY_SLOTS.violet.surface} px-3.5 py-3` ``, `style={CONTINUOUS_CORNER}`; cabecera `` `text-sm font-black ${CATEGORY_SLOTS.violet.ink}` `` |
| `nutrition-plan-why-text` | `className="text-13 font-semibold leading-note text-foreground"` |
| `nutrition-plan-recommendations-title` | `className="mt-0.5 text-base font-black text-foreground"` |
| `nutrition-plan-recommendations` | `className="gap-2"` |
| `nutrition-plan-recommendation-<i>` | `className="flex-row gap-2.5"`; círculo `` `size-5.5 items-center justify-center rounded-full ${CATEGORY_SLOTS.violet.surface}` ``; número `` `text-xs font-black ${CATEGORY_SLOTS.violet.ink}` ``; texto `"flex-1 text-13 font-semibold leading-body text-foreground"` |
| `nutrition-plan-review` | `className="flex-row items-center gap-2.5"`; `Calendar` `size={18}` en color `muted`; texto `"text-13 font-bold text-foreground"` |
| `nutrition-plan-disclaimer` | `className="text-xs font-semibold leading-body text-muted"` |
| `nutrition-plan-note` | `className="flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3"`, `style={CONTINUOUS_CORNER}`; `InfoCircle` `size={20}` en color `muted` |
| `nutrition-plan-note-text` | `className="flex-1 text-13 font-semibold leading-note text-foreground"` |
| `nutrition-plan-footer` | fuera del `ScrollView`; `className="gap-2 bg-background px-5 pt-4"`, `style={{ paddingBottom: Math.max(insets.bottom, 16) }}`. Solo con dueño y plan cargado. |
| `nutrition-plan-error` | `Text` `className="text-danger"` |
| `nutrition-plan-limit` | `className="text-center text-13 font-bold leading-body text-foreground"`, `accessibilityLiveRegion="polite"` |
| `nutrition-plan-pair` | `Button` `className="h-14 rounded-16 bg-accent"`, `style={chunkyLip.primary}`, `onPress={openPairing}`; etiqueta `<Text className="text-17 font-extrabold text-accent-foreground">` |
| `nutrition-plan-request` (límite) | `Button` `className="h-14 gap-2 rounded-16 bg-default"`, `style={KEEP_OPACITY}`, `isDisabled`; `Sparkles` `size={18}` en color `muted`; etiqueta `Text` `className="text-17 font-extrabold text-muted"` |
| `nutrition-plan-request` (violeta tonal, receta de #200 R14) | `Button` `variant="tertiary"`, ``className={`h-14 gap-2 rounded-16 ${CATEGORY_SLOTS.violet.surface}`}``, `style={chunkyLip.violet}`, `isDisabled={submitting}`; `Sparkles` `size={18}` en color `category-violet-strong`; etiqueta ``<Text className={`text-17 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>`` |

Procedencia:

- `chunkyLip` sale de `useChunkyLip()`;
- `CONTINUOUS_CORNER` y `KEEP_OPACITY`, de `theme/native-styles`;
- los colores de icono, de `useThemeColors(['muted', 'category-violet-strong'])`.

**Prohibido** en `screens/nutrition-plan/index.tsx` y `utils/meal-portion.ts`:

- hex, clases arbitrarias (`-[`), `StyleSheet` y sombras sueltas;
- `text-accent` suelto;
- `useThemeColor` en singular;
- `expo-linear-gradient`, `expo-symbols`, `lottie-react-native`, `@rive-app`;
- emoji;
- `Date.now()`;
- el literal `bg-category-violet-strong` (ya lo veta la guarda `#64 R9`, sin enmendar);
- importar `AiExplanation` (D2: A);
- `#215` suelto en comentarios: van como `#215 R<n>`.

Tests:

- En `src/screens/nutrition-plan/index.test.tsx`, `it.each` `'#215 R21: receta de %s'`:
  - `View` y `Text`: `props.className` comparado con `toBe`;
  - `Button`: como en `#179 R7` de Horario, `className` empieza por
    `'pressable-feedback__root button__root '` y acaba en `' <receta>'`;
  - iconos: `toHaveProp('size', n)` y el color en `props.style`.
- En `src/__tests__/design-drift.test.ts`, el `describe('#215 R21: Plan de nutrición sin deriva')`
  nuevo, justo antes de `describe('#178 R13: Recordatorios sin deriva', () => {`. Es el
  espejo del de `#209 R25`:
  - `const featureFiles = ['screens/nutrition-plan/index.tsx', 'utils/meal-portion.ts'];`
  - `it('#215 R21: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas')`, con
    `MEALS_BAR_STYLE_ESCAPES`;
  - `it('#215 R21: no deja text-accent suelto')`, con `/text-accent(?![-\w])/`;
  - `it('#215 R21: no trae dependencias vetadas, useThemeColor ni emoji')`, con
    `/expo-linear-gradient|expo-symbols|lottie-react-native|@rive-app|\buseThemeColor\b|\p{Extended_Pictographic}/u`.

  Cada uno espera `toEqual([])` sobre
  `featureFiles.filter((file) => <patrón>.test(readFileSync(join(sourceRoot, file), 'utf8')))`.
  En la semilla dieron 3 verdes.

Mutación obligatoria: plantar `#7549F7` en `screens/nutrition-plan/index.tsx` pone rojo el
primer `it`.

### Alcance cerrado

**R22** — THE SYSTEM SHALL NOT:

- modificar `backend-pet-tracker/`;
- modificar `mobile-pet-tracker/package.json` ni `mobile-pet-tracker/bun.lock`;
- añadir dependencias;
- tocar `src/screens/food/ai-explanation.tsx` ni `src/screens/food/parse-ai-explanation.ts`.

No tiene test de jest. La verificación del reporte, que el reviewer repite:

```sh
git diff origin/dev --stat -- backend-pet-tracker mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/screens/food/ai-explanation.tsx mobile-pet-tracker/src/screens/food/parse-ai-explanation.ts
```

La salida debe ser **vacía**.

## Contador

No se implementa (decisión del firmante D1, pendiente del humano). Si otra feature lo
habilita, este es el copy:

| Quedan | es | en |
|---|---|---|
| 1 | «Te queda 1 de 3 planes hoy» | «You have 1 of 3 plans left today» |
| 2 o 3 | «Te quedan {{remaining}} de 3 planes hoy» | «You have {{remaining}} of 3 plans left today» |
| 0 | sin contador: se pinta la vista límite | sin contador |

## Smoke G4

- [ ] Smoke de #215 recorrido por el humano (fecha: ____)

Va en el lote G4 de `progress/smoke_mejoras-producto.md`, con un solo dev build al final.
**No bloquea tareas; bloquea `done`.**

Recorrido en un dev build Android:

1. En Horario, «Generar plan» abre «Plan de <nombre>».
2. Volver lleva a Horario.
3. Con collar y propuesta se ven la insignia violeta, las filas con «antes», «Por qué…»,
   las recomendaciones, la revisión y el aviso.
4. Sin collar se ve la nota, y «Vincular collar» abre Vincular.
5. Horario y Nutrición muestran los gramos de la IA.
6. Con la navegación por gestos, el pie no tapa el contenido.
7. El botón violeta tonal se lee bien en claro y en oscuro.

La prueba con la clave real de la IA (un `proposed` real y el cuarto `generate` en
`limit_reached`) **no se duplica aquí**. Es la de #212 R20
(`specs/nutrition-ai-structured-plan/requirements.md`), con su propia casilla, y la corre el
humano.

## Fuera de alcance

- **Pendiente del humano (D1):** el contador de usos. Se desvía del artboard y del copy de
  G1, y pintarlo pide una feature de backend `aiRemainingToday` que decide el humano.
- Cualquier otro cambio del backend, como un `aiGeneratedAt` para la hora de la insignia.
- **Pendiente del humano (decisión cerrada 14):** el relleno sólido del botón violeta que
  dibuja el artboard. Pide un token oscuro que pase AA, que es una enmienda de
  `docs/ui-guidelines.md`.
- **Nota de copy para el humano (D7):** «que está bien para él» supone una mascota macho.
- Una entrada permanente a «Plan de <nombre>» desde Nutrición u otra pantalla (D3).
- Nombres de comida («Desayuno», «Comida», «Cena») y la columna de hora de 52 px (D5).
- Avisar de que «Pedir otro plan» sin cambios en las entradas devuelve la misma propuesta
  (decisión cerrada 16).
- La pantalla sin `petId` en la ruta: solo se entra desde Horario, que siempre lo pasa.
- La animación `rise` de los artboards. Las otras pantallas de detalle tampoco animan la
  entrada.
- Cambiar `AiExplanation` o el parser de #224.
- Cambiar `kcalConsumedToday` o el `router.back()` del cuestionario.

## Reglas para la implementación

**Worktree y rama.** Worktree `/home/claude/sites/Pet-Tracker-wt-215`, rama
`feature/215-mobile-nutrition-ai-plan`, PR a `dev`.

**Paso previo del handoff.** Lo hace el leader, no Codex. El worktree no tiene
`node_modules` ni `.env`:

1. copiar el `.env` del repo principal a `mobile-pet-tracker/`;
2. `cd /home/claude/sites/Pet-Tracker-wt-215/mobile-pet-tracker && bun install --frozen-lockfile`.

**Bloqueo por #224.** No se empieza hasta que #224 esté en `dev`. Entonces:

1. `git merge origin/dev` (nunca rebase);
2. §Re-verificar al mergear #224.

**Commits test-primero.** Por cada R-id (o grupo contiguo declarado en `tasks.md`):

1. `test(mobile): #215 R<n> rojo`, con el test en rojo;
2. `feat(mobile): #215 R<n> …`.

Nada de implementación, tests y docs en un solo commit.

**Tests.** Prohibido correr `./init.sh` y e2e. Se lanzan con:

```sh
cd /home/claude/sites/Pet-Tracker-wt-215/mobile-pet-tracker && bunx jest <ruta> -t '#215 R<n>:'
```

Los dos puntos impiden que `-t '#215 R1:'` recoja `R10`–`R22`. Las rutas con paréntesis
van escapadas.

**Si `origin/dev` avanza.** `git merge origin/dev` y re-medir, con la regla mecánica, los
agregados de R3, R19 y R20. Las líneas de #215 van las últimas.

**Coste.** Sin dependencias nuevas, sin costo, sin recursos AWS y sin llamadas reales a
la IA.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-27) ← gate obligatorio antes de implementar
- [ ] Smoke de #215 en dev build por el humano (fecha: ____): ver §Smoke G4. Va en el lote
      G4 de `progress/smoke_mejoras-producto.md`. No bloquea tareas; bloquea `done`.
