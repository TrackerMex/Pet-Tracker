---
feature: "mobile-nutrition-questionnaire"
status: draft        # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Requisitos

## Contexto

Hoy la app no tiene formulario del perfil nutricional. «Generar plan» en Horario
acaba en 422 `NUTRITION_PROFILE_REQUIRED` para cualquier mascota nueva. Esta
feature añade un cuestionario de 4 pasos sobre el endpoint ya existente
`PUT /v1/pets/:petId/nutrition-profile`. Al guardar llama a
`POST /v1/pets/:petId/nutrition-plan/generate`. Las entradas son el estado
«sin perfil» de Nutrición y de Horario, y «Editar perfil» en Horario.

Evidencia: `progress/explore_nutrition-questionnaire-2026-10-26.md`. Plan:
`progress/plan_mejoras-producto-2026-10-26.md` (ola 2). Dependencia de
contrato: #212 R1 (`specs/nutrition-ai-structured-plan/requirements.md`).

### Canvas congelado (G1)

Los artboards están congelados en `specs/mobile-nutrition-questionnaire/canvas/`.
**Nota para el firmante:** se congelaron de la versión viva
`1793039639-fe0d` del canvas, no de la v140 (`1793036268-d302`) citada en el
plan. La lectura de Artifact solo sirve la versión viva. Si la v140 difiere en
estos ocho artboards, hay que re-congelarlos antes de firmar.

| Artboard | sha256 |
|---|---|
| CuestionarioActividad.dc.html | cd11ebc9c388539add9b44458af4b5a09033bd6bb52b1f30eda5d85e3fe2c508 |
| CuestionarioCondicion.dc.html | 3094887c9030422f472c89d71f1c8035e80154bcca94937cea025bc622ba765b |
| CuestionarioPesoObjetivo.dc.html | d448d0dfe4d076b98883fc4d54f79545e507bb9844e1efa33251d4d264f87235 |
| CuestionarioAlimento.dc.html | ddc80bc8bb2acee73c2d41d1ed68ec4410967ef232a9f8ac35d71ff0a8380dfb |
| CuestionarioSalud.dc.html | 64123856358efad215cd42b9a4325ebb1ee0c728c80df27de33176b0c1ec3b1e |
| CuestionarioGenerando.dc.html | b6712e040d86dab57bcc76ab28bae00cc038ebf5971d9288273842b84152350f |
| HorarioEditarPerfil.dc.html | 755e21f1e41fd0685f9bfb7003e55806c9eb1a798b49b82a741916e279071411 |
| NutricionSinPerfil.dc.html | 10970d761e96b64dd2aa90375c74e1bb39df093faa0c481d378c114609a713d6 |

Verificación: `cd specs/mobile-nutrition-questionnaire/canvas && sha256sum *.html`.

### Contrato del backend (verificado contra el árbol)

`backend-pet-tracker/src/modules/nutrition/` tiene `UpsertNutritionProfileSchema`
(zod `strictObject`):

- `activityLevel`: `low | medium | high`. Obligatorio.
- `bodyCondition`: entero 1–9. Opcional.
- `targetWeightKg`: mayor que 0 y como máximo 999.99. Opcional.
- `foodType`: `dry | wet | mixed | homemade`. Obligatorio.
- `kcalPer100g`: número entre 80 y 600 (`KCAL_PER_100G_MIN`, `KCAL_PER_100G_MAX`).
  Obligatorio.
- `allergies` y `diseases`: `string[]`. Por defecto `[]`.

Reglas que la app debe cumplir:

- Los campos opcionales se **omiten**. Nunca se envían como `null`, porque
  `strictObject` daría 400.
- El upsert reemplaza el perfil entero.
- PUT nutrition-profile y POST generate son solo para owner. GET profile lo
  puede leer cualquier miembro.
- Cotas de #212 R1, que la app respeta desde ya: como máximo 20 elementos por
  array y como máximo 100 caracteres por elemento. Por encima, el PUT da 400.
- Tras #212, la respuesta de generate trae `aiStatus` y `aiProposal`.
  `generateNutritionPlan` ya tolera campos extra y esta feature no los pinta.

### Decisiones cerradas (no reabrir)

1. **Wizard de 4 pasos** con el patrón de `src/screens/add-pet/index.tsx`:
   paso en `useState`, `usePreventRemove`, KAV raíz, `ScreenHeader` con
   contador y barra de segmentos. Pasos: Actividad (1), Condición (2),
   Alimento (3), Salud (4).
2. **Peso objetivo** es un subpaso que solo aparece con condición ≥ 7
   (`BODY_CONDITION_OVERWEIGHT_MIN = 7` en el backend). El contador sigue en
   «2 de 4».
3. **La condición (BCS) es obligatoria en el wizard**, aunque el backend la
   admita omitida. En modo edición con `bodyCondition: null`, Siguiente queda
   desactivado hasta elegir una.
4. **Precargas de kcal/100 g**: Seco 350, Húmedo 90, Mixto 220, Casero 130.
   Elegir un tipo **sobrescribe** el campo con su precarga. El valor es
   editable y está acotado a 80–600 (entero).
5. **Alergias y enfermedades**: chips cerrados más «Otra» con texto libre
   (máximo 40 caracteres, con trim). Se envía el texto que muestra el chip,
   `t(clave)`. Con locale `es` es el literal español del artboard. «Carne de
   res» y «Soya» se quedan.
6. **Textos BCS**: un solo juego neutro de 9 textos, con banda de color: 1–3
   blue, 4–5 green, 6–7 amber, 8–9 rose (`CATEGORY_SLOTS`).
7. **`putJson` nuevo** en `src/api/http.ts`, con el mismo patrón que `patchJson`.
8. **Guardar** = PUT y luego POST generate. CuestionarioGenerando se muestra
   mientras dura y **avanza solo**: cuando generate da ok, la pantalla hace
   `router.back()`. No hay temporizadores ni duración mínima. El enlace «Ver
   el plan de Rocky» del artboard es solo del prototipo y no se implementa.
9. **Ruta y mascota**: `/nutrition-profile`, con el parámetro `petId`
   (`router.push({ pathname: '/nutrition-profile', params: { petId } })`).
   La pantalla lee `useLocalSearchParams<{ petId: string }>()`.
10. **Roles**: «Generar plan», «Crear perfil nutricional» y «Editar perfil»
    solo se pintan con `myRole === 'owner'`. Los demás roles conservan el
    texto vacío de solo lectura.
11. **Pingo** del cuestionario, de Generando y de NutricionSinPerfil:
    `assets/images/pingo-food.webp`. Los artboards usan un mismo blob y la
    pose de comida es la que ya usa el vacío de Nutrición.
12. **Iconos** de las tarjetas de actividad (`reicon-react-native`, ya
    instalado): Baja `TrendDown`, Media `Location`, Alta `TrendUp`. El check
    del radio y de Generando es `Check`. No se candadan los iconos.
13. **Desviaciones declaradas** respecto del canvas:
    - Sin la huella decorativa del escenario de NutricionSinPerfil.
    - Sin el lápiz del enlace «Editar perfil».
    - Los anillos usan `MOTION_PING_TIMING` (2400 ms), no los 2 s del
      artboard.
    - Ninguna se candada.
14. **Copy en Voz B**, literal de los artboards. «Rocky» se sustituye por
    `{{name}}` (nombre de la mascota). Las notas de kcal de Húmedo, Mixto y
    Casero no están en el canvas y se fijan aquí, en R11.
15. **Reutilización de claves**: antes de crear una clave, Codex busca su
    valor `es` exacto con `grep -nF "'<valor>'" mobile-pet-tracker/src/i18n/catalog.ts`.
    Si ya existe una clave con ese valor exacto, se reutiliza. Reutilizaciones
    ya fijadas:
    - `addPet.stepProgress` ('{{current}} de {{total}}').
    - `addPet.optional` ('Opcional').
    - `mealSchedule.nutritionProfile` ('Perfil nutricional').
    - `mealSchedule.noNutritionProfileYet` ('Aún no hay perfil nutricional').
    - `common.somethingWentWrong`, `common.cannotReachServer`,
      `mealSchedule.errorForbidden` y `mealSchedule.registerWeightFirst`.

## Requisitos

Convenciones:

- Todos los tests de pantalla se escriben con el arnés de
  `src/screens/add-pet/index.test.tsx`: el mismo modo de mockear router, auth
  y `fetch`, y `await` en `fireEvent` y `act` (RNTL 14).
- Fixture de mascota: `name: 'Rocky'`, `currentWeightKg: 12.4`,
  `myRole: 'owner'`.
- Los literales esperados se escriben **a mano en el test**, copiados del
  canvas. Nunca se importan de `catalog.ts`.
- Rutas relativas a `mobile-pet-tracker/`.

### API

**R1** — WHEN el código llama a `putJson(url, token, body, fetchFn)`, THE
SYSTEM SHALL hacer `fetchFn(url, { method: 'PUT', headers: { 'Content-Type':
'application/json', Authorization: 'Bearer <token>' }, body: JSON.stringify(body) })`
y devolver un `GetResult`, igual que `patchJson`.
- Test: `src/api/__tests__/nutrition.test.ts` ›
  `it('R1: putJson envía PUT con cuerpo JSON y Bearer')`.
- Ancla previa: `grep -cF 'export async function putJson' src/api/http.ts` = `0`.
  Posterior: `1`.

**R2** — WHEN el código llama a `upsertNutritionProfile(baseUrl, token, petId,
input, fetchFn = fetch)`, THE SYSTEM SHALL hacer el PUT a
`${baseUrl}/v1/pets/${petId}/nutrition-profile` con `input` como cuerpo y
devolver `UpsertNutritionProfileState`:

| Respuesta | Resultado |
|---|---|
| 200 | `{ kind: 'ok', profile: NutritionProfile }` |
| 400 | `{ kind: 'invalid' }` |
| 401 | `{ kind: 'unauthorized' }` |
| 403 | `{ kind: 'forbidden' }` |
| 404 | `{ kind: 'not-found' }` |
| Otro status | `{ kind: 'error' }` |
| Fallo de red | `{ kind: 'unreachable' }` |
| `baseUrl` vacío | `{ kind: 'missing-config' }`, con la misma guarda que `generateNutritionPlan` |

`NutritionProfileInput` vive en `src/api/types.ts`:
`{ activityLevel; bodyCondition?: number; targetWeightKg?: number; foodType; kcalPer100g: number; allergies: string[]; diseases: string[] }`.
- Tests: `src/api/__tests__/nutrition.test.ts` ›
  - `it('R2: upsertNutritionProfile hace PUT a nutrition-profile y devuelve ok con el perfil')`
  - `it.each(...)('R2: status %i se mapea a %s')`, una fila por status (400, 401, 403, 404, 500).
  - `it('R2: sin red devuelve unreachable')`.

### Ruta y estructura

**R3** — THE SYSTEM SHALL tener:
- la ruta delgada `src/app/nutrition-profile.tsx` (menos de 10 líneas) que
  solo reexporta `src/screens/nutrition-questionnaire/index.tsx`;
- `<Stack.Screen name="nutrition-profile" options={{ headerShown: false }} />`
  en `src/app/_layout.tsx`, junto a la de `meal-schedule`.

Ancla posterior: `grep -cF 'name="nutrition-profile"' src/app/_layout.tsx` = `1`.
- Test: `src/screens/nutrition-questionnaire/index.test.tsx` ›
  `it('R3: la ruta nutrition-profile es delgada y está en el Stack')`. Lee
  ambas fuentes y aserta menos de 10 líneas y la línea de `Stack.Screen`.

**R4** — WHILE la pantalla carga la mascota (`petKeys.detail(petId)` con
`getPet`) o el perfil (`nutritionKeys.profile(petId)` con
`getNutritionProfile`), THE SYSTEM SHALL pintar
`nutrition-questionnaire-skeleton` con `Skeleton` de HeroUI y ningún
`Spinner`. Cuando ambas consultas acaban:
- IF la mascota no es `ok` o el perfil es `error` o `unreachable`, THEN pinta
  `nutrition-questionnaire-load-error` con «Algo salió mal»
  (`common.somethingWentWrong`).
- IF alguna de las dos es `unauthorized`, THEN llama a `signOut()`.
- En otro caso monta el formulario. Con el perfil `not-found` el formulario
  arranca vacío; con `ok` arranca en modo edición (R15).
- Tests: `src/screens/nutrition-questionnaire/index.test.tsx` ›
  - `it('R4: mientras carga pinta el esqueleto')`
  - `it('R4: si la mascota falla pinta el error de carga')`

**R5** — WHILE el formulario está montado, THE SYSTEM SHALL pintar:
- `ScreenHeader` con `testID="nutrition-questionnaire"`, título «Perfil
  nutricional», `size={24}` y accesorio `nutrition-questionnaire-step-label`
  con «N de 4» (`addPet.stepProgress`).
- La barra `nutrition-questionnaire-step-bar`, con
  `accessibilityRole="progressbar"` y
  `accessibilityValue={{ min: 1, max: 4, now: N }}`. Tiene 4 segmentos
  `h-1.5 flex-1 rounded-full`: `bg-accent` si su índice (de 1 a 4) es ≤ N, y
  `bg-lip-gray` en otro caso.
- La burbuja de Pingo `nutrition-questionnaire-bubble`, con el texto del paso.

Valores de N: Actividad 1, Condición 2, Peso objetivo 2, Alimento 3, Salud 4.
- Test: `it('R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho')`.

**R6** — WHEN el usuario pulsa Volver (`nutrition-questionnaire-back`, o el
gesto o botón del sistema, vía `usePreventRemove`) en un paso distinto de
Actividad, THE SYSTEM SHALL retroceder un paso sin salir de la pantalla:
- Salud → Alimento.
- Alimento → Peso objetivo si la condición es ≥ 7, o Condición si es < 7.
- Peso objetivo → Condición.
- Condición → Actividad.

En Actividad, Volver sale de la pantalla.
- Tests:
  - `it('R6: Volver desde Alimento con condición 6 vuelve a Condición')`
  - `it('R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo')`

### Pasos

**R7** — WHILE el paso es Actividad, THE SYSTEM SHALL pintar estos textos:
- Burbuja: «Cuéntame cómo es un día normal de Rocky. Con eso calculo cuánta energía necesita.»
- Leyenda: «¿Cuánto se mueve Rocky?»

Y estas tres tarjetas, con `accessibilityRole="radio"` y
`accessibilityState={{ checked }}`:

| testID | Título | Descripción | Color |
|---|---|---|---|
| `activity-option-low` | «Baja» | «Paseos cortos y mucho descanso.» | blue |
| `activity-option-medium` | «Media» | «Uno o dos paseos al día y algo de juego.» | green |
| `activity-option-high` | «Alta» | «Corre, entrena o juega con intensidad cada día.» | amber |

`nutrition-questionnaire-next` («Siguiente») tiene `isDisabled` hasta que hay
una elección.
- Tests:
  - `it('R7: Actividad pinta las tres opciones con su copy')`
  - `it('R7: Siguiente está desactivado hasta elegir actividad')`

**R8** — WHILE el paso es Condición, THE SYSTEM SHALL pintar estos textos:
- Burbuja: «Pasa la mano por el costado de Rocky y elige lo que más se parezca a lo que sientes.»
- Leyenda: «¿Cómo está su cuerpo?»

Y nueve filas `bcs-option-<n>` (`accessibilityRole="radio"`), cada una con
`bcs-badge-<n>` (número `n`, `CATEGORY_SLOTS.<banda>.surface` + `.ink`):

| n | Título | Descripción | Banda |
|---|---|---|---|
| 1 | Muy delgado | Huesos muy visibles, sin grasa al tacto | blue |
| 2 | Delgado | Costillas y cadera se ven a simple vista | blue |
| 3 | Algo delgado | Costillas fáciles de sentir, cintura marcada | blue |
| 4 | Ideal, esbelto | Costillas se sienten con poca grasa | green |
| 5 | Ideal | Costillas se sienten y la cintura se ve | green |
| 6 | Algo de sobrepeso | Algo de grasa en costillas, poca cintura | amber |
| 7 | Sobrepeso | Costillas difíciles de sentir | amber |
| 8 | Obesidad | No se sienten las costillas ni la cintura | rose |
| 9 | Obesidad severa | Grasa abundante en cuello, lomo y vientre | rose |

Siguiente queda desactivado hasta elegir.
- Tests:
  - `it.each(NINE_ROWS)('R8: fila %i pinta «%s», «%s» y la banda %s')`. La
    tabla se escribe a mano en el test y tiene longitud 9.
  - `it('R8: Siguiente está desactivado hasta elegir condición')`

**R9** — WHEN el usuario pulsa Siguiente en Condición, THE SYSTEM SHALL ir a
Alimento si la condición es < 7, o a Peso objetivo si es ≥ 7.
- Test: `it.each([[1, 'Alimento'], [6, 'Alimento'], [7, 'Peso objetivo'], [9, 'Peso objetivo']])('R9: con condición %i Siguiente va a %s')`.
  Aserta el paso destino por su leyenda: «Tipo de alimento» o «Peso objetivo».

**R10** — WHILE el paso es Peso objetivo, THE SYSTEM SHALL:
- Pintar la burbuja «Con condición 7 conviene que Rocky baje de peso poco a
  poco. ¿Te dijo el veterinario cuál es su peso ideal?», con la condición
  elegida interpolada.
- Pintar la fila resumen `target-weight-summary`:
  - `bcs-badge-summary`, con la banda de R8;
  - el texto «Condición 7/9 · Sobrepeso», con el título de R8;
  - el enlace `target-weight-change` («Cambiar», `text-accent-strong`), que
    vuelve a Condición.
- Pintar el título «Peso objetivo» con «Opcional».
- Pintar el campo `target-weight-input` (`keyboardType="decimal-pad"`,
  `maxLength={6}`) con la unidad «kg».
- Pintar `target-weight-current`, «Peso actual de Rocky: 12.4 kg», solo si
  `currentWeightKg` no es `null`.
- Pintar la nota `target-weight-note`, «Si aún no lo sabes, déjalo vacío:
  calculo con su peso actual y lo ajustas después.»
- Mantener el contador en «2 de 4».
- Desactivar Siguiente solo si el campo no está vacío y su valor (`,` se acepta
  como `.`) no es un número > 0 y ≤ 999.99 con 2 decimales como máximo.

Tests:
- `it('R10: Peso objetivo pinta resumen, copy y contador «2 de 4»')`
- `it('R10: Cambiar vuelve a Condición')`
- `it('R10: sin currentWeightKg no pinta el peso actual')`
- `it.each([['0', true], ['1000', true], ['12,345', true], ['', false], ['10,5', false]])('R10: peso «%s» desactiva Siguiente: %s')`

**R11** — WHILE el paso es Alimento, THE SYSTEM SHALL pintar:
- La burbuja «¿Qué come Rocky? Con las calorías de su alimento calculo cuántos
  gramos servir en cada comida.»
- La leyenda «Tipo de alimento».
- Cuatro chips (`accessibilityRole="radio"`): `food-type-dry` «Seco»,
  `food-type-wet` «Húmedo», `food-type-mixed` «Mixto» y
  `food-type-homemade` «Casero».
- La etiqueta «Calorías del alimento».
- El campo `kcal-input` (`keyboardType="number-pad"`, `maxLength={3}`) con la
  unidad «kcal / 100 g».
- La ayuda «Entre 80 y 600 kcal por cada 100 g.»
- La nota `kcal-note` del tipo elegido.

WHEN el usuario elige un tipo, THE SYSTEM SHALL poner en `kcal-input` su
precarga y pintar su nota:

| Tipo | Precarga | Nota (`kcal-note`) |
|---|---|---|
| `dry` | 350 | «Puse 350, lo habitual en alimento seco. Si la bolsa dice otro número, cámbialo: lo encuentras como energía metabolizable.» |
| `wet` | 90 | «Puse 90, lo habitual en alimento húmedo. Si la lata dice otro número, cámbialo: lo encuentras como energía metabolizable.» |
| `mixed` | 220 | «Puse 220, un punto medio entre seco y húmedo. Si sabes el número exacto, cámbialo.» |
| `homemade` | 130 | «Puse 130, lo habitual en comida casera. Si tu receta tiene otro número, cámbialo.» |

Sin tipo elegido no hay nota.

Tests:
- `it.each(FOUR_TYPES)('R11: %s precarga %s kcal y su nota')`. La tabla se
  escribe a mano en el test y tiene longitud 4.
- `it('R11: cambiar de tipo sobrescribe un valor editado')`

**R12** — WHILE el paso es Alimento, THE SYSTEM SHALL desactivar Siguiente si
falta el tipo o si `kcal-input` no es un entero entre 80 y 600.
- Test: `it.each([['79', true], ['80', false], ['600', false], ['601', true], ['', true]])('R12: kcal «%s» desactiva Siguiente: %s')`.

**R13** — WHILE el paso es Salud, THE SYSTEM SHALL pintar:
- La burbuja «¿Rocky tiene alguna alergia o enfermedad? Si no tiene ninguna,
  déjalo todo sin marcar.»
- La leyenda «Alergias» con los chips `allergy-chip-<slug>`, en este orden:
  - pollo «Pollo»
  - carne-de-res «Carne de res»
  - lacteos «Lácteos»
  - trigo «Trigo»
  - huevo «Huevo»
  - soya «Soya»
  - pescado «Pescado»
  - otra «Otra»
- La leyenda «Enfermedades» con los chips `disease-chip-<slug>`, en este orden:
  - diabetes «Diabetes»
  - enfermedad-renal «Enfermedad renal»
  - pancreatitis «Pancreatitis»
  - enfermedad-hepatica «Enfermedad hepática»
  - problemas-digestivos «Problemas digestivos»
  - problemas-articulares «Problemas articulares»
  - otra «Otra»
- La CTA «Guardar y generar plan».

Los chips llevan `accessibilityRole="checkbox"` y
`accessibilityState={{ checked }}`, y se marcan y desmarcan al pulsarlos.

WHILE «Otra» está marcada en una lista, THE SYSTEM SHALL pintar debajo:
- la etiqueta «¿Cuál?»;
- el contador `<lista>-other-count` con «N/40», donde N es la longitud del
  texto;
- el campo `<lista>-other-input` con `maxLength={40}`.

Aquí `<lista>` es `allergy` o `disease`.

Tests:
- `it('R13: Salud pinta las dos listas con su copy y orden')`
- `it.each(['allergy', 'disease'])('R13: marcar Otra en %s muestra ¿Cuál? y el contador pasa de 0/40 a 7/40')`.
  Escribe «Maíz ok», que tiene 7 caracteres.

### Guardar y generar

**R14** — WHEN el usuario pulsa «Guardar y generar plan», THE SYSTEM SHALL
llamar a `upsertNutritionProfile` con un cuerpo que cumpla todo esto:

1. `activityLevel`, `foodType` y `kcalPer100g` (número) siempre.
2. `bodyCondition`: la condición elegida.
3. `targetWeightKg` **solo** si la condición es ≥ 7 y el campo no está vacío,
   como número (`'10,5'` → `10.5`). En cualquier otro caso la clave **no
   existe** en el cuerpo, ni con `null` ni con `undefined` serializado.
4. `allergies` y `diseases`:
   - las etiquetas marcadas en el orden de R13, sin «Otra»;
   - después, el texto de «Otra» con trim, si está marcada y queda no vacío;
   - después, los elementos conservados por R15;
   - sin duplicados exactos;
   - recortado a 20 elementos (`slice(0, 20)`), cada uno con 100 caracteres
     como máximo.

Tests:
- `it('R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes')`.
  El test escribe peso con 7, vuelve y elige 5.
- `it('R14: condición 7 con peso vacío omite targetWeightKg')`
- `it('R14: condición 7 con «10,5» envía targetWeightKg 10.5')`
- `it('R14: Otra con «  Maíz  » añade «Maíz» tras las etiquetas marcadas')`
- `it('R14: Otra con solo espacios no añade nada')`
- `it('R14: con 21 alergias conservadas envía 20')`. Usa el perfil precargado
  de R15.

**R15** — WHEN el perfil existe (`getNutritionProfile` es `ok`), THE SYSTEM
SHALL arrancar con:
- la actividad del perfil;
- la condición del perfil, o ninguna si es `null`;
- el peso objetivo como texto, o vacío si es `null`;
- el tipo y `kcalPer100g` del perfil, sin sobrescribir por la precarga;
- cada alergia y enfermedad cuyo texto coincide con la etiqueta de un chip,
  marcada.

Para los textos que no coinciden: el primero con 40 caracteres o menos marca
«Otra» y rellena su campo. Los demás se conservan tal cual al final del array
enviado (R14.4), aunque no se pintan.
- Tests:
  - `it('R15: con perfil existente precarga actividad, condición, peso, alimento y kcal')`
  - `it('R15: «Pollo» marca su chip y «Maíz» rellena Otra')`
  - `it('R15: con bodyCondition null Siguiente de Condición está desactivado')`

**R16** — WHEN el PUT empieza, THE SYSTEM SHALL sustituir el formulario por
`nutrition-generating`, con:
- el escenario: dos `PingRing` (`delay={0}` y `delay={1000}`); si
  `useReducedMotion()` es verdadero, ningún anillo;
- `PingoFloat` con `pingo-food.webp` a 112 px;
- el título «Preparando el plan de Rocky»;
- el texto «Estoy calculando sus calorías y el reparto de sus comidas. Tarda
  unos segundos.»;
- la lista `nutrition-generating-steps` (`accessibilityLiveRegion="polite"`)
  con «Perfil guardado», «Calculando calorías» y «Repartiendo comidas».

Estado de cada fila:

| Fase | Perfil guardado | Calculando calorías | Repartiendo comidas |
|---|---|---|---|
| Mientras el PUT está en vuelo | en curso | pendiente | pendiente |
| Tras PUT ok, mientras generate está en vuelo | hecho | en curso | pendiente |

WHEN generate devuelve `ok`, THE SYSTEM SHALL invalidar
`nutritionKeys.profile(petId)` y `nutritionKeys.plan(petId)`, y llamar a
`router.back()`.

Tests:
- `it('R16: con PUT en vuelo pinta Generando con Perfil guardado en curso')`
- `it('R16: tras PUT ok marca Perfil guardado hecho y Calculando en curso')`
- `it('R16: generate ok invalida perfil y plan y vuelve atrás')`
- `it('R16: con movimiento reducido no pinta anillos')`

**R17** — IF el PUT o generate no devuelven `ok`, THEN THE SYSTEM SHALL volver
al formulario en el paso Salud, con las respuestas intactas, y pintar
`nutrition-questionnaire-error` (mismas clases que `generate-plan-error` en
`src/screens/meal-schedule/index.tsx`) con este texto:

| Resultado | Texto |
|---|---|
| PUT `invalid` | «Algo salió mal» (`common.somethingWentWrong`) |
| PUT `forbidden` | `mealSchedule.errorForbidden` |
| PUT `unreachable` | `common.cannotReachServer` |
| PUT `error`, `not-found` o `missing-config` | «Algo salió mal» |
| generate `forbidden` | `mealSchedule.errorForbidden` |
| generate `unprocessable` con `PET_WEIGHT_REQUIRED` | `mealSchedule.registerWeightFirst` |
| generate, otro `unprocessable` o `error` | «Algo salió mal» |
| generate `unreachable` | `common.cannotReachServer` |
| `unauthorized` en cualquiera | `signOut()` sin texto |

Si el PUT fue `ok`, `nutritionKeys.profile(petId)` se invalida aunque generate
falle.
- Test: `it.each(ERROR_ROWS)('R17: %s %s pinta «%s»')`. Una fila por fila de
  la tabla, con el texto español literal escrito en el test.

**R18** — WHILE el formulario está montado, THE SYSTEM SHALL tener como raíz
`<KeyboardAvoidingView testID="screen-nutrition-questionnaire" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>`
y un `ScrollView` con `keyboardShouldPersistTaps="handled"`. Así
`target-weight-input`, `kcal-input` y los campos «Otra» quedan visibles con el
teclado abierto.
- Test: `it('R18: la raíz es un KAV con behavior padding y el scroll persiste taps')`.

### Entradas

**R19** — WHILE Nutrición (`src/screens/food/index.tsx`) muestra una mascota
cuyo plan es `not-found`, THE SYSTEM SHALL consultar también
`nutritionKeys.profile(petId)` con `getNutritionProfile`, y pintar:

- Perfil pendiente: `food-plan-skeleton`.
- Perfil `not-found` y `myRole === 'owner'`: la sección
  `food-profile-empty` (NutricionSinPerfil) en lugar de `food-plan-empty`.
  Contiene:
  - el escenario con `PingoFloat` y `pingo-food.webp` a 150 px;
  - el título «Aún no hay perfil nutricional»;
  - el texto «Respóndeme unas preguntas sobre Rocky y preparo su plan:
    cuántas calorías necesita y cuántos gramos servir en cada comida.»;
  - la CTA `food-create-profile` «Crear perfil nutricional», sin icono, que
    hace `router.push({ pathname: '/nutrition-profile', params: { petId } })`;
  - la nota «Son 4 pasos y podrás cambiar tus respuestas cuando quieras.»
- Cualquier otro caso (no owner, o perfil `ok`): `food-plan-empty`, como hoy.

Tests: `src/screens/food/index.test.tsx` ›
- `it('R19: owner sin perfil ve Crear perfil nutricional y navega al cuestionario')`
- `it.each(['family', 'walker', 'vet'])('R19: %s sin perfil ve el vacío actual')`
- `it('R19: owner con perfil y sin plan ve el vacío actual')`

**R20** — WHILE Horario (`src/screens/meal-schedule/index.tsx`) muestra el
perfil nutricional, THE SYSTEM SHALL:
- con perfil `ok` y owner: pintar a la derecha de `nutrition-profile-title`
  el enlace `nutrition-profile-edit`, con el texto «Editar perfil» y
  `accessibilityLabel="Editar perfil nutricional"`;
- con perfil `not-found` y owner: pintar bajo `nutrition-profile-empty` el
  enlace `nutrition-profile-create`, «Crear perfil nutricional»;
- con cualquier otro rol: no pintar ningún enlace.

Los dos enlaces hacen
`router.push({ pathname: '/nutrition-profile', params: { petId } })`.
- Tests: `src/screens/meal-schedule/index.test.tsx` ›
  - `it('R20: owner con perfil ve Editar perfil y navega al cuestionario')`
  - `it('R20: owner sin perfil ve Crear perfil nutricional')`
  - `it.each(['family', 'walker', 'vet'])('R20: %s no ve enlaces de perfil')`

**R21** — WHILE el rol de la mascota no es `owner`, THE SYSTEM SHALL no pintar
`generate-plan-button` en Horario. Con owner se pinta como hoy.
- Tests: `src/screens/meal-schedule/index.test.tsx` ›
  - `it.each(['family', 'walker', 'vet'])('R21: %s no ve Generar plan')`
  - `it('R21: owner ve Generar plan')`

**R22** — WHILE Horario pinta las píldoras del perfil, THE SYSTEM SHALL
mostrar las etiquetas en español en lugar de los enums crudos:

| Campo | Valor | Texto de la píldora |
|---|---|---|
| actividad | `low` | «Actividad Baja» |
| actividad | `medium` | «Actividad Media» |
| actividad | `high` | «Actividad Alta» |
| alimento (con 380 kcal) | `dry` | «Alimento Seco 380 kcal/100 g» |
| alimento (con 380 kcal) | `wet` | «Alimento Húmedo 380 kcal/100 g» |
| alimento (con 380 kcal) | `mixed` | «Alimento Mixto 380 kcal/100 g» |
| alimento (con 380 kcal) | `homemade` | «Alimento Casero 380 kcal/100 g» |

Se reutilizan las claves de R7 y R11. La píldora de condición no cambia.
- Tests:
  - `it.each(THREE_ACTIVITIES)('R22: actividad %s se lee «%s»')`
  - `it.each(FOUR_FOODS)('R22: alimento %s se lee «%s»')`

### Copy, carta y guardas

**R23** — THE SYSTEM SHALL servir todo el copy nuevo desde
`src/i18n/catalog.ts`, con claves `nutritionQuestionnaire.*` en `en` y en
`es`:
- `es` lleva el literal de R7–R20.
- `en` lleva una traducción.
- Las variables son `{{name}}`, `{{bcs}}`, `{{label}}`, `{{weight}}` y
  `{{count}}`.

Ningún valor del catálogo aparece como literal entero en una fuente. En
`src/__tests__/ui-copy-table.ts` se añade el bloque
`export const R20_NUTRITION_QUESTIONNAIRE: UseRow[]`, con una fila por cada
`t('<clave>'` de las tres pantallas, tanto las claves nuevas como las
reutilizadas. El bloque se registra en estos sitios:
- en `ALL_USES`, después de `...R17_EDIT_PROFILE,`;
- en el array `blocks` del test `#194 R5: cuadra ALL_USES con la suma de sus bloques`;
- en el import de `src/__tests__/ui-language.test.ts`, junto con
  `it('R23: el bloque del cuestionario tiene N filas')`, que hace
  `expect(R20_NUTRITION_QUESTIONNAIRE).toHaveLength(N)` con N medido.

R18 lo usa la rama de #220 y R19 se reserva para #208. Si al mergear
`origin/dev` alguno de los dos ya usa R20, este bloque toma el siguiente número
libre.
- Anclas previas:
  - `grep -cF 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts` = `0`.
  - `grep -cF "'nutritionQuestionnaire." src/i18n/catalog.ts` = `0`.
- Test: los guardas existentes de `src/__tests__/ui-language.test.ts` y
  `src/__tests__/ui-copy-table.ts`, en verde, más el `it` R23.

**R24** — THE SYSTEM SHALL mantener en verde las guardas de carta. Para eso,
cada inventario que esta feature mueve se enmienda con la **regla mecánica**:
- cifra nueva = cifra base + delta medido, con el comentario `// #209 R24`;
- nunca se reescribe la base.

Deltas esperados, a medir con `grep -c` antes de enmendar:

- **`src/__tests__/design-drift.test.ts`**
  - `describe('#209 R24: Cuestionario sin deriva')` nuevo, copiado del de
    `#175 R10: Documentos sin deriva`. Su `featureFiles` es
    `['screens/nutrition-questionnaire/index.tsx']`.
  - Lista de `outsideReminders(/\brounded-14\b/)`: añadir
    `join('screens', 'nutrition-questionnaire', 'index.tsx'), // #209 R24`
    entre `meals-history` y `pairing`.
  - Diccionario de `rounded-16`: la entrada nueva cuenta 1 y `food` sube +1.
- **`src/__tests__/consistency-classnames.test.ts`**
  - #62 R1: `rounded-16 bg-accent` global, +2 (la CTA del wizard y la de
    Nutrición).
  - #166 R2: `expected`, con la entrada nueva a 1 y `food` +1.
  - #62 R14: `directUses` de `style={CONTINUOUS_CORNER}`, con una fila nueva
    por la pantalla nueva y el agregado + N.
  - #166 R3: `count(/border-lip-gray/g)`, + N (radio de actividad, fila
    pendiente de Generando y el enlace de Horario).
- **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`**
  - `CTA_ROWS`: +2 filas, `nutrition-questionnaire-next` y
    `food-create-profile`, con las clases de R25.
  - `radii` del fichero nuevo y de `food`.
  - `inventory(/chunkyLip\.primary\b/g)`: nuevo 1 y `food` +1.
  - `inventory(/style=\{chunkyLip\.neutralCompact\}/g)`: `meal-schedule`
    pasa de 1 al número medido.
  - `ctaFiles` y `consumers` incluyen el fichero nuevo.
- **`src/__tests__/legibility-classnames.test.ts`**
  - #61 R4: `inkSites`, con la fila del fichero nuevo a 1 («Cambiar») y el
    agregado +1.

Ancla: `grep -cF '#209 R24' mobile-pet-tracker/src/__tests__/*.ts` ≥ `1` por
cada fichero enmendado.
- Test: las cinco suites citadas, en verde.

**R25** — THE SYSTEM SHALL usar exactamente estas recetas de carta, que salen
del canvas y de `docs/ui-guidelines.md` (reglas 3, 6, 7, 12 y 13; enmiendas
#187 y #197):

- **CTA primaria** (wizard y Nutrición): `Button`
  `className="h-14 rounded-16 bg-accent"` con `style={chunkyLip.primary}` e
  hijo `<Text className="text-17 font-extrabold text-accent-foreground">`. En
  Nutrición se añade `w-full`. El pie del wizard es
  `View className="bg-background px-5 pt-4"` con
  `paddingBottom: Math.max(insets.bottom, 16)`.
- **Tarjeta de actividad**: `Pressable`
  `flex-row items-center gap-3 rounded-tile border-2 p-3.5` +
  `style={CONTINUOUS_CORNER}`.
  - Sin elegir: `border-border bg-surface`.
  - Elegida: `border-accent bg-tab-pill`.
  - Tile del icono, `size-11 items-center justify-center rounded-14`: sin
    elegir, `CATEGORY_SLOTS.<c>.surface` con icono `.ink`; elegida,
    `bg-surface` con icono `.ink`.
  - Título `text-base font-extrabold text-foreground`.
  - Descripción `text-13 text-muted`.
  - Radio `size-6 rounded-full`: sin elegir, `border-2 border-lip-gray`;
    elegido, `items-center justify-center bg-accent` con `Check`.
- **Fila BCS**: `Pressable`
  `flex-row items-center gap-2.5 rounded-14 border-2 px-2.5 py-1.25`.
  - Sin elegir: `border-transparent bg-default`.
  - Elegida: `border-accent bg-tab-pill`.
  - Badge `size-7.5 items-center justify-center rounded-10` con banda; su
    número es `text-sm font-black`.
  - Título `text-sm font-extrabold leading-tight`.
  - Descripción `text-xs leading-tight text-muted`.
- **Chip de tipo de alimento**: las clases de `OptionalChip` de
  `src/screens/add-pet/index.tsx`, copiadas, sin labio.
- **Chip de Salud**:
  - Sin marcar: `h-9 justify-center rounded-full bg-default px-3`, texto
    `text-sm font-extrabold text-foreground`.
  - Marcado: `h-9 justify-center rounded-full bg-accent px-3` +
    `style={chunkyLip.primaryCompact}`, texto
    `text-sm font-extrabold text-accent-foreground`.
  - Es `Pressable`, no `Button`.
- **Campo numérico**:
  `h-16 flex-row items-center gap-2 rounded-14 border-2 bg-default px-4` +
  `style={CONTINUOUS_CORNER}`.
  - Borde `border-accent` con foco y `border-transparent` sin él.
  - `TextInput` `flex-1 text-28 font-black text-foreground`.
  - Unidad `text-lg font-extrabold text-muted` (kg) o
    `text-15 font-extrabold text-muted` (kcal).
- **Campo «Otra»**: las clases del input de `add-pet`, con
  `border-accent` con foco.
- **Nota con icono**: `flex-row gap-2.5 rounded-tile bg-default px-3.5 py-3` +
  `CONTINUOUS_CORNER`, con icono `InfoCircle` y texto
  `flex-1 text-13 font-semibold leading-body text-foreground`.
- **Ayuda**: `text-13 font-semibold text-muted`.
- **Resumen de Peso objetivo**:
  `flex-row items-center gap-2.5 rounded-16 bg-default px-3 py-2.5`. El
  enlace «Cambiar» es `Pressable` `h-11 justify-center` con texto
  `text-13 font-extrabold text-accent-strong` y `hitSlop={TOUCH_SLOP}`.
- **Burbuja**: las clases de `add-pet-bubble`, con la cola en `top-5.5`
  (`top-4.5` en Condición). Pingo mide `size-13` (`size-11` en Condición).
- **Leyendas**: `text-lg font-black text-foreground`.
- **Lista de Generando**: `gap-3 rounded-tile bg-default px-4 py-3.5` +
  `CONTINUOUS_CORNER`. Cada fila es `flex-row items-center gap-3`, con un
  círculo `size-6.5 rounded-full`:
  - hecho: `items-center justify-center bg-accent` con `Check`, texto
    `text-15 font-bold`;
  - en curso: `border-3 border-lip-gray border-t-accent`, girando con
    `MOTION_*` existente o estático si hay movimiento reducido, texto
    `text-15 font-extrabold`;
  - pendiente: `border-2 border-lip-gray`, texto
    `text-15 font-semibold text-muted`.
- **Enlace de Horario** («Editar perfil» y «Crear perfil nutricional»):
  `Pressable`
  `h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3`
  + `style={chunkyLip.neutralCompact}`, con texto
  `text-13 font-extrabold text-foreground`. No es `Button`, para no mover los
  inventarios de `Button` neutro.
- **NutricionSinPerfil**:
  - sección `items-center gap-3`;
  - escenario `h-50 w-55 items-center justify-center`, con un disco
    `absolute size-47.5 rounded-full bg-surface-secondary`;
  - título `text-center text-24 font-black tracking-title`;
  - texto `text-center text-15 font-medium leading-normal text-muted`;
  - nota `text-center text-13 font-semibold text-muted`.
- **Dimensiones del wizard**: `paddingHorizontal: 20`, `paddingTop: 12` y
  `gap: 16` (`14` en Condición), como en `add-pet`.

Prohibido:
- hex fuera de `theme/`;
- clases arbitrarias `[...]`;
- `StyleSheet.create`;
- pasar `text-13`/`text-15`/`text-17` a componentes de HeroUI (enmienda #187);
- un labio que no venga de `useChunkyLip()` (enmienda #197).

Test: `design-drift.test.ts` › el `describe` de R24, más las suites de R24.

**R26** — THE SYSTEM SHALL añadir a `docs/ui-guidelines.md`, al final, la
sección literal siguiente:

```markdown
## Enmienda #209 — Cuestionario de nutrición

- Los anillos de ping de `CuestionarioGenerando` (`src/screens/nutrition-questionnaire/index.tsx`) quedan permitidos: dos `PingRing` con `MOTION_PING_TIMING`, ninguno con movimiento reducido. Es la excepción a «Ninguna otra pantalla usa anillos de ping sin una enmienda propia» (#167).
- Fuera de la escala, por fidelidad al canvas (#209): tarjetas de actividad y lista de Generando en `rounded-tile`, filas BCS y campos numéricos en `rounded-14`, badges BCS en `rounded-10`, resumen de peso objetivo en `rounded-16`.
- Chips de Salud: receta de chip elegido de la regla 13 (`rounded-full bg-accent` + `chunkyLip.primaryCompact`); chips de tipo de alimento: receta de `OptionalChip`, sin labio.

- [ ] Aprobada por humano (G4, fecha: ____)
```

La casilla la marca el humano (G4 no está delegado). R26 no cierra hasta
entonces.
- Ancla previa: `grep -cF '## Enmienda #209' docs/ui-guidelines.md` = `0`.
  Posterior: `1`.
- Test: el reviewer ejecuta el ancla. No hay test de jest.

## Fuera de alcance

- Premios y snacks, alimentación mixta detallada (proporción seco/húmedo) y
  objetivo explícito (bajar o subir de peso). El motor no los modela.
- La píldora «Edad» del artboard HorarioEditarPerfil.
- Pintar `aiStatus` o `aiProposal` de la respuesta de generate (#212 y
  posteriores).
- El enlace «Ver el plan de Rocky» de Generando, la huella del escenario de
  NutricionSinPerfil y el lápiz de «Editar perfil» (decisión 13).
- Editar o borrar elementos conservados que no coinciden con ningún chip (R15)
  más allá del primero.
- Cambios en el backend.

## Reglas para la implementación

- Worktree `/home/claude/sites/Pet-Tracker-wt-209`, rama
  `feature/209-mobile-nutrition-questionnaire`, PR a `dev`.
- **Commits test-primero**: por cada R-id, o grupo contiguo declarado en
  `tasks.md`, va primero un commit `test(mobile): #209 R<n> rojo` con el test
  en rojo y después `feat(mobile): #209 R<n> ...`. Nada de implementación,
  tests y docs en un solo commit.
- Prohibido correr `./init.sh` y e2e. Los tests se lanzan con
  `cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx jest <ruta> -t 'R<n>'`.
  Las rutas con paréntesis se escapan.
- Si `origin/dev` avanza (#208, #220…), se hace `git merge origin/dev`, nunca
  rebase. Después se re-miden los agregados de R23 y R24 con la regla mecánica.
- No hay dependencias nuevas, ni costo, ni recursos AWS.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
