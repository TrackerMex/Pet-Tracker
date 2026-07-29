# Plan 009: Alimentación — perfil nutricional, motor de reglas y explicación con IA

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: deben existir `PetAccessGuard` (plan 004), tablas `nutrition_profiles`/`nutrition_plans` migradas, y el parámetro SSM `/pet-tracker/dev/openai-api-key` (puede seguir en `PENDING`). Si no, STOP.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: M · **Riesgo**: LOW (dominio aislado; la IA es opcional por diseño)
- **Depende de**: `plans/004-mascotas-crud-permisos.md`
- **Categoría**: direction (MVP items 18–19 del brief §20)

## Por qué importa

Pilar 3 del brief. Mandato explícito (§16): **las reglas determinísticas calculan, la IA solo explica** — y nunca sustituye al veterinario ni se llama desde la app (§9, §19). Este plan implementa el cálculo calórico estándar veterinario (RER/MER), la porción diaria y horarios, y una explicación en lenguaje sencillo generada por OpenAI desde el backend con degradación limpia si no hay clave.

## Estado actual

- `nutrition_profiles` (pet_id PK, activity_level, body_condition, target_weight_kg, food_type, kcal_per_100g, allergies, diseases) y `nutrition_plans` (rer/mer, daily_grams, meals, meal_times, warnings, ai_explanation NULL, inputs_hash) migradas — `docs/data-model.md`.
- OpenAPI: `PUT/GET /v1/pets/{petId}/nutrition-profile`, `POST /v1/pets/{petId}/nutrition-plan/generate`, `GET .../nutrition-plan`.
- La Lambda API ya puede leer SSM `/pet-tracker/dev/*` (plan 002).
- Datos de la mascota disponibles: species, sterilized, birth_date/approx_age_months, current_weight_kg (plan 004/008).

## Comandos

Los de `plans/002` + `token:dev`.

## Alcance

**Dentro**: `apps/api/src/modules/nutrition/**` (profile controller/service, `nutrition-engine.ts` puro, `ai-explainer.ts`, plan controller/service), dependencia `openai` (SDK oficial) en la api, env `OPENAI_ENABLED` y `OPENAI_MODEL` en `infra/lib/api.ts`, pantallas `apps/mobile/app/pets/[petId]/nutrition.tsx` (perfil + plan), tab Alimentación.

**Fuera**: catálogo de alimentos comerciales (post-MVP §21), consumo de agua/alimento (§21), modificación de dietas veterinarias (prohibido §16), cualquier llamada a OpenAI desde la app (prohibido §9/§19), historización de planes más allá de conservar filas anteriores.

## Flujo git

`main`. Commits: `feat(api): nutrition profile and deterministic engine`, `feat(api): ai explanation with graceful fallback`, `feat(mobile): nutrition screens`.

## Pasos

### Paso 1: Perfil nutricional

`PUT /v1/pets/:petId/nutrition-profile` (upsert; owner) — DTO: activityLevel ('low'|'medium'|'high'), bodyCondition (1–9)?, targetWeightKg?, foodType ('dry'|'wet'|'mixed'|'homemade'), kcalPer100g (80–600; defaults sugeridos si null: dry 350, wet 100), allergies (string[]), diseases (string[]). `GET` correspondiente.

**Verificar**: curls PUT/GET 200; kcalPer100g 900 → 400; mascota ajena → 404.

### Paso 2: Motor determinístico (`nutrition-engine.ts`, puro)

`computePlan(input): PlanResult` con `input = {species, weightKg, targetWeightKg?, ageMonths, sterilized, activityLevel, bodyCondition?, kcalPer100g, allergies, diseases}`.

Fórmulas (estándar veterinario; documentar en JSDoc con estas mismas cifras):
- **RER** = 70 × (pesoKg ^ 0.75). Peso usado: targetWeightKg si bodyCondition ≥ 7, si no weightKg.
- **MER** = RER × factor:

| Caso | Perro | Gato |
|---|---|---|
| Cachorro < 4 meses | 3.0 | 2.5 |
| Joven 4–12 meses (gato 4–12) | 2.0 | 2.5 |
| Adulto esterilizado | 1.6 | 1.2 |
| Adulto entero | 1.8 | 1.4 |
| Pérdida de peso (BCS ≥ 7) | 1.0 | 0.8 |
| Actividad high (adultos, no pérdida) | +0.2 | +0.1 |
| Actividad low (adultos, no pérdida) | −0.2 | −0.1 |

- **Porción**: dailyGrams = round(MER / (kcalPer100g/100)). **Comidas**: < 4 meses → 4; 4–12 → 3; adulto → 2 (gato 2–3: usar 3 si activityLevel high). **Horarios**: repartidos 07:00–20:00 (2 → 07:30/19:30; 3 → 07:30/14:00/19:30; 4 → 07:00/11:00/15:00/19:00).
- **Warnings** (lista de códigos + texto es): BCS ≥ 7 → 'weight_loss_plan'; BCS ≤ 3 → 'underweight_vet'; diseases no vacío → 'chronic_disease_vet' ("plan general; tu veterinario debe ajustarlo"); allergies no vacío → 'check_food_allergens'; ageMonths < 2 → 'too_young_vet'. **Objective**: 'maintenance' | 'weight_loss' | 'growth'.
- Redondeos: kcal a entero, gramos a múltiplo de 5.

**Verificar** — tests unitarios con valores exactos:
- Perro adulto esterilizado 20 kg, medium, dry 350: RER = 70×20^0.75 ≈ 662 → MER ≈ 1059 → 305 g/día (redondeado a 305), 2 comidas.
- Gato adulto esterilizado 4 kg, low, dry 350: RER ≈ 198 → MER 1.2−0.1=1.1 → ≈ 218 kcal → 60 g, 2 comidas.
- Cachorro 3 meses 5 kg: factor 3.0, 4 comidas, warning si < 2 meses (no aplica), objective 'growth'.
- Perro BCS 8, 30 kg, target 25: RER sobre 25 kg, factor 1.0, objective 'weight_loss', warning presente.

### Paso 3: Generación del plan + IA

`POST /v1/pets/:petId/nutrition-plan/generate`: junta mascota + perfil (perfil ausente → 422 `NUTRITION_PROFILE_REQUIRED`), corre el motor, calcula `inputs_hash` (sha256 del input canónico); si el último plan tiene el mismo hash → devolverlo (idempotente, ahorra tokens). Inserta fila y luego intenta la explicación:

`ai-explainer.ts`: si `OPENAI_ENABLED=true` y la clave SSM ≠ `PENDING` → SDK `openai` con `model = OPENAI_MODEL` (default en env: `gpt-4o-mini`; NO hardcodear en código), timeout 15 s, `max_tokens` ~400. System prompt (fijo, en el código, es): "Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras." User: JSON del input + resultado. Respuesta → `ai_explanation`. Error/timeout/clave ausente → `ai_explanation = null` y el endpoint responde igualmente 200 con el plan (log warn, jamás 5xx por la IA). `GET .../nutrition-plan` → último plan.

**Verificar**: tests con SDK mockeado (éxito guarda texto; timeout → plan sin explicación y sin excepción; mismo hash no re-llama). Curl real: generate → 200 con kcal/gramos coherentes; con clave PENDING → `aiExplanation: null` y warning en logs; segundo generate idéntico → mismo `id` (hash hit).

### Paso 4: Pantallas

- Tab Alimentación / `nutrition.tsx`: sin perfil → onboarding amigable (form del paso 1 con selectores ilustrados); con perfil → tarjeta del plan: kcal/día grande, gramos/día, comidas con horarios (iconos), objetivo, warnings como avisos suaves pero visibles, texto de la IA en tarjeta "Explicación" (si null, texto fijo con el resumen determinístico), disclaimer permanente: "Plan orientativo. No sustituye la valoración de tu veterinario." Botón "Recalcular" → generate.
- Rellenar la sección de alimentación del perfil de mascota (plan 004).

**Verificar**: typecheck exit 0; manual: crear perfil → plan visible con horarios. Sin dispositivo: typecheck + pendiente manual.

### Paso 5: Cierre

OpenAPI, `STATUS.md`, fila 009 DONE, commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios (núcleo): engine con los 4 casos de valores exactos del paso 2 + horarios por nº de comidas + todos los warnings; explainer (3 casos mockeados); idempotencia por hash.
- Curls con evidencia: 422 sin perfil, 200 con plan, hash hit.

## Criterios de done

- [ ] `npm run verify` exit 0; suite del engine con los valores exactos en verde.
- [ ] Evidencia curl: plan generado con números correctos (perro 20 kg → ~1059 kcal / ~305 g).
- [ ] Degradación probada: sin clave OpenAI el endpoint responde 200 con `aiExplanation: null`.
- [ ] Ningún literal de modelo OpenAI hardcodeado (`grep -rn "gpt-" apps/api/src` → solo el default en infra/env).
- [ ] La app muestra plan + disclaimers (o typecheck + pendiente manual).
- [ ] OpenAPI, `STATUS.md`, fila 009 al día.

## Condiciones de STOP

- Los factores MER de la tabla parecen requerir cambio (p. ej. producto pide otra fuente nutricional) → STOP: los valores son decisión de producto validable por veterinario, no del ejecutor.
- La clave OpenAI real falla con 401/429 persistente → deja `OPENAI_ENABLED=false`, reporta, NO bloquees el plan.
- Cualquier diseño que mueva la llamada a OpenAI a la app o exponga la clave → STOP inmediato (brief §9/§19).

## Notas de mantenimiento

- `inputs_hash` evita regenerar (y pagar tokens) sin cambios; si se añaden campos al input, incluirlos en el hash canónico o habrá planes obsoletos servidos como frescos.
- El texto del system prompt es producto: cambios → revisar con el usuario, versionar en el código con comentario de fecha.
- Catálogo de alimentos (post-MVP) reemplazará `kcalPer100g` manual: mantenerlo como override cuando llegue.
