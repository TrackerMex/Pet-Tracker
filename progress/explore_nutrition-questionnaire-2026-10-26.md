# explore: nutrition-plan-questionnaire (plan generado por IA desde un formulario)
Fecha: 2026-10-26 · Base: `main` @ `fa3f36c0` · Solo lectura

Petición del humano: «el usuario genera el plan con un formulario y la IA genera
el plan según sus respuestas».

---

## 1. Cómo se produce hoy el plan (#17 nutrition-profile-engine, done)

**Motor determinista y puro**, sin IA: `computePlan()` en
`backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts:73-163`.
- RER = 70 × peso^0.75 (`:88`; constantes `nutrition.constants.ts:4-5`). Si BCS ≥ 7
  y hay `targetWeightKg`, usa el peso objetivo (`:84-87`).
- MER = RER × factor. Tabla de factores en `nutrition.constants.ts:9-23`: cachorro
  <4 m, joven <12 m, adulto esterilizado/entero, pérdida de peso, y ±actividad.
  Objetivo: `growth` (<12 m), `weight_loss` (BCS ≥ 7) o `maintenance` (`:74-83`).
- Gramos/día = MER / (kcalPer100g/100), redondeado a múltiplo de 5 (`:128-130`).
- Comidas: 4 / 3 / 2 según edad; gato adulto con actividad alta, 3 (`:131-138`).
  Horarios **fijos** por número de comidas (`nutrition.constants.ts:41-47`).
- 5 avisos (`weight_loss_plan`, `underweight_vet`, `chronic_disease_vet`,
  `check_food_allergens`, `too_young_vet`) con texto fijo en español (`:139-152`;
  mensajes en `nutrition.constants.ts:58-70`).

**Entradas** (`generate-nutrition-plan.use-case.ts:46-57`):
- De `pets`: `species`, `currentWeightKg` (del registro de peso), `ageMonths`
  (`birthDate` o `approxAgeMonths`, `pet.entity.ts:82`) y `sterilized`.
- De `nutrition_profiles`: `activityLevel`, `bodyCondition`, `targetWeightKg`,
  `kcalPer100g`, `allergies` y `diseases`.
- `foodType` se guarda pero el motor **no lo usa**: no está en
  `NutritionEngineInput` (`nutrition-engine.ts:32-43`).
- `breed`, `sex` y `size` existen en `pets.schema.ts:32,35,37` y tampoco se usan,
  aunque `docs/brief.md` §16 (≈`:650-690`) los lista como datos del motor.

**Tablas** (`backend-pet-tracker/src/db/schema/nutrition.schema.ts`):
- `nutrition_profiles` (`:21-72`): PK `pet_id`, con CHECK de `kcal_per_100g`
  entre 80 y 600 (`:67-70`) y de BCS entre 1 y 9.
- `nutrition_plans` (`:74-114`): append-only, con `inputs_hash` char(64),
  `ai_explanation` text, `engine_meals_per_day` (de #103) y CHECK de 1 a 6
  comidas (`:101-104`).
- `meal_servings` (`:116-140`): UNIQUE (pet, día, franja).

**Endpoints** (`infrastructure/nutrition.controller.ts`):

| Método | Ruta | Quién | Línea |
|---|---|---|---|
| PUT | `/v1/pets/:petId/nutrition-profile` | owner | `:52-65` |
| GET | `.../nutrition-profile` | cualquier miembro | `:67-78` |
| POST | `.../nutrition-plan/generate` | owner | `:80-93` |
| POST / PATCH | `.../meal-times[/:mealTime]` (#103) | owner | `:95-137` |
| GET | `.../nutrition-plan` (+`servedToday`, `kcalConsumedToday`) | miembro | `:139-150` |

- El DTO usa zod (`application/dto/nutrition-profile.dto.ts:6-14`):
  `kcalPer100g` es obligatorio (80–600); `allergies` y `diseases` son
  `z.array(z.string())` **sin `.max()`**.
- `generate` devuelve 422 `NUTRITION_PROFILE_REQUIRED` (use-case `:39`) o
  `PET_WEIGHT_REQUIRED` (`:42-44`).
- Idempotencia: sha256 del input canónico (`application/nutrition-input-hash.ts`;
  **no incluye `foodType`**). Si el hash coincide, devuelve la última fila
  (use-case `:58-63`).
- `carriedSchedule` conserva los horarios que editó el usuario (`:70`).
- Guardar el perfil (PUT) **no regenera** el plan.

## 2. Explicación IA (#18 nutrition-ai-explainer, done)

- **Proveedor:** API de Anthropic directa con `@anthropic-ai/sdk` `0.128.0`
  (`backend-pet-tracker/package.json:31`), cargado de forma perezosa
  (`infrastructure/ai/anthropic-nutrition-explainer.ts:49-50`). **No es Bedrock
  ni necesita AWS.** El cambio de OpenAI a Anthropic lo decidió el humano el
  2026-10-08 (descripción de #18 en `feature_list.json`).
  - `docs/brief.md:390` y `plans/presupuesto-produccion.md:51` siguen diciendo
    OpenAI / GPT-5 mini: están desfasados.
- **Modelo:** viene de la variable de entorno `ANTHROPIC_MODEL=claude-haiku-5-5`
  (`.env.example:106-108`). En `src/` no hay ningún literal de modelo.
- **Factory** (`nutrition-explainer.factory.ts:6-24`): devuelve
  `NullNutritionExplainer` en cuatro casos:
  - `NODE_ENV=test`;
  - `ANTHROPIC_ENABLED !== 'true'` (es el default local);
  - clave ausente, vacía o `PENDING`;
  - modelo vacío.
- **Llamada:** timeout de 15 s, `maxRetries: 0`, `max_tokens: 1200`
  (`anthropic-nutrition-explainer.ts:16-18, 66-71`). Es síncrona dentro del POST
  `generate`.
- **Qué produce:** **solo texto libre** (`string | null`), que se guarda en
  `nutrition_plans.ai_explanation` con `setAiExplanation` (use-case `:84-89`).
  No cambia ningún número del plan.
- **Validación de la salida:** solo `stop_reason === 'end_turn'` y texto no
  vacío (`:80`). Cualquier fallo se convierte en `null` + `warn`, y el endpoint
  responde 200 igualmente (`:90-97`).
- **Prompt** (`infrastructure/ai/nutrition-prompt.ts`):
  - system fijo (`:7-8`): español, orientativo, sin diagnósticos, máximo 180
    palabras. Cambiarlo «es decisión del humano» (`:6`);
  - user = `JSON.stringify` de input + result (`:10-41`), con cotas de 20
    elementos × 100 caracteres en alergias y enfermedades (`:43-44`);
  - OV2 (`specs/nutrition-ai-explainer/requirements.md:926-936`): al prompt solo
    entran `NutritionEngineInput` y `NutritionPlanResult`. **Todo campo nuevo del
    prompt debe entrar también en el hash.**
- **Controles de coste:**
  - el hash evita repetir llamadas (si ya hay texto no se vuelve a llamar;
    `:60-61`) y solo se reintenta cuando el texto quedó en `null`;
  - gate de entitlement `isPetTracked` (`:83`; OV3 `requirements.md:943-950`):
    **sin collar activo no hay IA nunca**;
  - **no hay rate limit**: grep `throttl` en `src` da 0;
  - coste estimado ≤ ~$0.00075 por llamada (`requirements.md:1840-1846`).
- **Tests:** `NODE_ENV=test` fuerza el adaptador nulo. El e2e sustituye
  `NUTRITION_EXPLAINER` con `overrideProvider` (`test/nutrition-ai-explainer.e2e-spec.ts:47`)
  y los unitarios inyectan un cliente doble.
- **Entorno:** la IA solo funciona en local con `.env` y clave real. La prueba
  de humo R19 la pasó el humano el 2026-10-08 (`requirements.md:1967`).
  `infra/lib/pet-tracker-dev-stack.ts` (115 líneas) solo despliega DynamoDB y
  similares: no hay Lambda de la API ni cableado de `ANTHROPIC_*`.
- **#163** (pending): es un hueco de cobertura de tests. El spec de la factory
  no muestrea `NODE_ENV=production`. El código de producción es correcto
  (`=== 'test'`, factory `:9`). Es independiente de esta petición.

## 3. Pantallas móviles de hoy y canvas

- **Nutrición** (`mobile-pet-tracker/src/screens/food/index.tsx`):
  - anillo de kcal consumidas frente a `merKcal` (`:75-85`, `:244-304`);
  - comidas de hoy con «Marcar servido» (`:308-399`);
  - avisos (`:401-420`);
  - tarjeta «Recomendación IA» solo si `aiExplanation !== null` (`:422-441`);
  - estado vacío sin plan (`:445-452`);
  - enlaces a Horario e Historial (`:121-154`).

  **No tiene ningún campo de formulario.**
- **Horario** (`src/screens/meal-schedule/index.tsx`):
  - editar y añadir franjas, solo owner (`:300-316`, `:327-347`, `:365-378`, de #147);
  - botón «Generar plan» (`:379-391`, `handleGenerate` `:144-186`). No se oculta
    a quien no es owner: `canGenerate` (`:88`) no mira `isOwner`;
  - perfil nutricional **en solo lectura** con píldoras (`:403-438`);
  - «sin perfil» (`:440-444`).
- **No existe formulario del perfil nutricional.**
  - `src/api/nutrition.ts` solo tiene `getNutritionProfile` (`:49`) y
    `src/api/http.ts` no tiene `putJson` (solo `postJson` `:29` y
    `patchJson` `:55`).
  - #38 lo dejó fuera de alcance (`specs/mobile-food/requirements.md:304-305`) y
    su prueba de humo creó el perfil con curl (`:278-281`).
  - **Consecuencia:** en la app real «Generar plan» acaba en
    `NUTRITION_PROFILE_REQUIRED` salvo que el perfil se haya sembrado por API.
    Es el hueco principal.
  - El plan 009, paso 4 (`plans/009-alimentacion-ia.md:84`), sí preveía «sin
    perfil → onboarding amigable (form del paso 1 con selectores ilustrados)»,
    con disclaimer permanente y «Recalcular». Nunca se construyó.
- **Canvas aprobado** (`specs/mobile-canvas-nutrition/canvas/`: `Nutricion`,
  `NutricionAvisos`, `HorarioComidas`, `HistorialComidas`):
  - **ningún artboard dibuja un cuestionario**;
  - HorarioComidas muestra el perfil como píldoras (Actividad Media · Edad
    Adulto · Condición 5/9 · Alimento Seco 380 kcal/100 g) y el botón «Generar plan»;
  - el copy de ejemplo de la IA en `Nutricion` es «Rocky subió 0.3 kg este mes.
    Reduce la porción de la cena a 90 g y suma 10 min de paseo.» Ese texto
    supone que la IA **recomienda cambios de ración** y usa **la tendencia de
    peso**. Hoy el prompt no recibe la tendencia (OV2), y recomendar raciones
    choca con «la IA solo explica».
  - En el Make antiguo había una textarea «Alergias / condiciones» en el alta de
    mascota (`specs/mobile-figma-polish/design-src/App.tsx:1278-1283`) y un select
    «Alimento principal» con catálogo (`:1454`). Ninguno de los dos se implementó.
- **Patrones reutilizables para un formulario:**
  - wizard de 2 pasos de alta de mascota (`src/screens/add-pet/index.tsx:108`,
    `KeyboardAvoidingView` `:489-567`, barra de pasos `:501-508`);
  - `SegmentedControl` (`:301`, `:342`, `:355`);
  - `components/segmented-control.tsx`, `toggle-switch.tsx`,
    `field-error-message.tsx` y `form-error.tsx`.
  - Se rige por `docs/ui-guidelines.md`.

## 4. Qué podría aportar un cuestionario que el motor no tiene

| Dato | Estado hoy |
|---|---|
| Actividad, BCS, peso objetivo, tipo de alimento, kcal/100 g, alergias, enfermedades | **Modelado** en el perfil (PUT existe); falta la UI |
| Densidad calórica | **Modelada**: `kcalPer100g` obligatorio, 80–600. Las precargas de UI (seco 350 / húmedo 100) son solo sugerencia (descripción de #17) |
| Raza, talla, sexo | En `pets`, sin uso en el motor |
| Marca / catálogo de alimento | No existe. El plan 009 lo deja post-MVP (`:32`, `:119`: «catálogo reemplazará kcalPer100g manual; mantenerlo como override») |
| Alimentación mixta (seco + húmedo y proporción) | `mixed` solo admite **una** densidad |
| Premios / snacks (% de kcal) | No modelado |
| Objetivo explícito del dueño (bajar o subir peso) | No modelado. El objetivo se **deriva** del BCS (≥ 7); no se puede pedir «bajar peso» sin BCS alto |
| Ritmo de pérdida, gestación o lactancia, preferencias de horario o nº de comidas | No modelados (los horarios solo se editan después, con #103) |
| Comida humana que ya recibe (para detectar tóxicos) | No modelado |
| Salidas del brief §16: «recomendaciones de seguimiento» y «fecha de próxima revisión» | No se producen |

Todo campo nuevo que entre al motor o al prompt **tiene que entrar en el hash
canónico** (OV2; `plans/009-alimentacion-ia.md:117`). Si no, se sirven planes
obsoletos como si fueran frescos.

## 5. Riesgos

1. **Choque con el mandato de producto.** `docs/brief.md:226` y §16
   (`:648`, `:698`), más `plans/009-alimentacion-ia.md:15`, dicen: «las reglas
   calculan, la IA solo explica/personaliza/resume, no sustituye al
   veterinario». «La IA genera el plan» contradice ese texto al pie de la letra.
   Hace falta una decisión explícita del humano.
2. **Hoy no se valida el contenido de la salida.** Las 180 palabras solo se
   piden en el prompt; no se comprueban números ni alimentos tóxicos (grep
   `tóxic|xilitol|chocolate` en `src/`, `specs/` y `docs/` = 0). Si la IA emite
   números, hace falta:
   - salida estructurada (tool o JSON schema) validada con zod;
   - cotas que fije el motor: kcal dentro de ±X % del MER determinista, gramos
     coherentes con `kcalPer100g`, comidas entre 1 y 6 (CHECK de la tabla),
     horarios `HH:MM`;
   - si se sale de las cotas, volver al plan del motor.
3. **Inyección de prompt** por texto libre (alergias, enfermedades, y cualquier
   respuesta abierta nueva). Hoy se mitiga con JSON y cotas (C-5/C-3). Cuanto
   más texto libre tenga el cuestionario, más superficie de ataque.
4. **Latencia.** `generate` es síncrono y puede tardar hasta 15 s. Una salida
   estructurada más larga implica más tokens. El corte de API Gateway es de 29 s
   (`requirements.md:1029-1034`).
5. **Entitlement (OV3).** Sin collar activo no hay IA. Un «plan IA» no
   existiría para usuarios gratuitos: ¿qué ven ellos al rellenar el cuestionario?
6. **Coste.** No hay rate limit. Cada cambio de respuestas cambia el hash y
   provoca una llamada pagada nueva. El presupuesto sigue escrito para OpenAI.
   Regla de memoria: las decisiones de coste no se infieren.
7. **IA no desplegada.** En local la IA está apagada por defecto, así que el
   «plan IA» sería `null` en desarrollo y CI. Los tests deben usar dobles del
   puerto `NutritionExplainer`.
8. **Horarios editados (#103).** Si la IA propone horarios, choca con
   `carriedSchedule` y `engine_meals_per_day` (use-case `:70`).
9. **Idioma.** El system prompt y los avisos están solo en español
   (`nutrition.constants.ts:58-70`), pero la app tiene i18n en/es
   (`src/i18n/catalog.ts:230` / `:690`).
10. **Pasos menores:** «Generar plan» está visible para quien no es owner (403
    como red de seguridad); hace falta `putJson` nuevo en móvil.

## Recomendación (opciones, sin decidir)

- **A — Mínima, alineada con el mandato actual.** El cuestionario es el
  formulario del perfil nutricional que falta: un wizard sobre el PUT existente,
  seguido de `generate`. El motor sigue calculando y la IA personaliza la
  explicación con las respuestas.
  - Backend: casi nada. Si se quieren preguntas nuevas, ampliar el perfil con
    columnas nuevas que el motor use de forma determinista, y llevarlas al hash.
  - Móvil: `putJson`, pantalla nueva (ruta delgada + `src/screens/`) y entrada
    desde el estado «sin perfil» de Horario y Nutrición.
  - Partir en backend y móvil como #83/#98 si hay columnas nuevas.
- **B — Híbrida.** El motor fija los límites (kcal, gramos, nº de comidas) y la
  IA, con salida estructurada, propone **dentro** de ellos: reparto por comida,
  recomendaciones de seguimiento, fecha de revisión y consejos.
  - Validación con zod y recorte a las cotas; si la salida es inválida, se usa
    el plan del motor.
  - Requiere columnas nuevas en `nutrition_plans`, cambiar el prompt (decisión
    del humano) y ampliar OV2 y el hash.
- **C — La IA genera todo el plan.** Desaconsejada: contradice el brief §16 y el
  plan 009, pierde la garantía clínica, necesita una firma humana que cambie el
  mandato y probablemente validación veterinaria.

Con cualquier opción, conviene que el motor determinista siga siendo la
**fuente de verdad y el guardarraíl** de kcal y gramos.

## Decisiones abiertas para el humano

1. ¿Se mantiene «reglas calculan, IA solo explica»? Elegir A, B o C.
2. Lista **cerrada** de preguntas del cuestionario. Para cada una: ¿alimenta al
   motor (determinista, columna nueva) o solo al prompt? ¿Es texto libre o
   cerrada?
3. ¿Los usuarios sin collar activo ven la parte IA? Hoy OV3 dice que no.
4. ¿Se habilita la IA en algún entorno desplegado? Hoy solo funciona en local.
   Es una decisión de coste: no inferirla.
5. Límite de generaciones por mascota y día, y actualizar el presupuesto
   (de OpenAI a Anthropic).
6. ¿Catálogo de marcas o seguir con kcal/100 g manual (con precarga 350/100)?
7. ¿El cuestionario sustituye al perfil o lo rellena? ¿Se puede editar después?
   ¿Regenera solo al guardar o con el botón?
8. Si la IA propone horarios o raciones por comida, ¿qué pasa con los horarios
   editados (#103)?
9. ¿Quién aporta la lista de alimentos tóxicos y valida el contenido (veterinario)?
10. Si la IA da números: tolerancia frente al motor (por ejemplo ±10 % del MER)
    y comportamiento cuando se sale (rechazar y usar el plan del motor).
11. Idioma de la explicación: ¿fijo en español o el del usuario?
12. Texto del system prompt nuevo (lo firma el humano, `nutrition-prompt.ts:6`).
13. ¿El copy del canvas («Reduce la porción de la cena a 90 g…») es la
    dirección deseada? Requiere B y la tendencia de peso en el prompt.
