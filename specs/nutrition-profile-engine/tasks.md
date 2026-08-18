---
feature: "nutrition-profile-engine"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[nutrition-profile-engine]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un requisito
> de [[requirements]] y tiene siempre los mismos 3 sub-items, en este orden.
>
> **Cada test nombra su requisito con el sufijo de feature**:
> `describe('R<n> (nutrition-profile-engine #17): ...')`. El módulo `nutrition`
> es nuevo, pero #18 escribirá R-ids en los mismos archivos; sin el sufijo, C4 de
> `CHECKPOINTS.md` deja de ser verificable por grep.
>
> **Commits test-primero, uno por bloque rojo→verde.** `CHECKPOINTS.md` C4 exige
> que el historial de la feature **muestre** el patrón test rojo → implementación
> → verde. Meter tests + implementación + docs en un solo commit es motivo de
> rechazo del reviewer, aunque la suite quede verde. Formato:
> `test(nutrition-profile-engine): ... (R<n>)` y luego
> `feat(nutrition-profile-engine): ... (R<n>)`.
>
> **Guardas nacidas verdes: prohibidas.** Los cinco warnings (R8–R12), los dos
> 422 (R22, R23) y el 404/403 del guard (R25) son guardas de seguridad clínica.
> Una guarda que nace verde nunca se vio fallar y no prueba nada. Para cada una:
> (a) el paso (1) **debe verse fallar en rojo** antes de escribir la
> implementación, y (b) el test debe incluir la **aserción anti-vacío** — que el
> código/status **no** aparece cuando la condición no se cumple —, no solo que
> aparece cuando sí.
>
> **Orden de trabajo**: R1–R14 (motor puro, sin base de datos) → R15 (migración)
> → R16–R18 (perfil) → R19–R24 (plan) → R25–R27 (transversal) → T-docs.
> `test/nutrition.e2e-spec.ts` necesita Docker levantado (`docker compose up -d`).
>
> **Un solo escritor sobre el working tree.** Mientras se implementa #17 nadie más
> toca `backend-pet-tracker/`: #18 (`nutrition-ai-explainer`) comparte archivos.

---

## Motor determinístico puro

## R1 — Motor puro y constantes nombradas

- [ ] (1) Escribir test que falla para R1 — `src/modules/nutrition/domain/nutrition-engine.spec.ts`
      (el fuente de `nutrition-engine.ts` no contiene literales `3.0`, `1.6`,
      `0.75`, `70`, `"07:30"` ni textos de warning, e importa de
      `./nutrition.constants`)
- [ ] (2) Implementación mínima que lo pasa — `nutrition.constants.ts` con los
      nombres exactos de [[design]] D1 + esqueleto de `computePlan`
- [ ] (3) Refactor con tests verdes — JSDoc con las cifras de C-1..C-10 en
      `nutrition.constants.ts` (**nunca** en `nutrition-engine.ts`: el test de (1)
      lee su fuente como texto plano y un JSDoc con `3.0` o `07:30` lo pone rojo);
      el JSDoc de `computePlan` remite a las constantes por nombre. Cabecera de
      pureza en el engine al estilo `src/pipeline/geofence-eval.ts`

## R2 — RER y peso base

- [ ] (1) Escribir test que falla para R2 — `nutrition-engine.spec.ts`
      (incluye el caso OV2: `ageMonths: 3`, `bodyCondition: 8`,
      `targetWeightKg: 4`, `weightKg: 5` ⇒ RER calculado sobre **5**, no sobre 4)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Tabla de factores MER y precedencia

- [ ] (1) Escribir test que falla para R3 — `nutrition-engine.spec.ts`, 10 casos
      (las 5 filas clínicas de C-2 × 2 especies), más: cachorro `high` ≡ cachorro
      `medium`, adulto en pérdida `high` ≡ adulto en pérdida `medium`, y
      `sterilized: null` ⇒ factor de entero
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Redondeos (MER entero, gramos múltiplo de 5)

- [ ] (1) Escribir test que falla para R4 — `nutrition-engine.spec.ts`, incluido
      el caso discriminante `weightKg: 1.2` gato adulto medium 350 ⇒
      `dailyGrams: 25` (derivar del MER crudo daría 30) y
      `Number.isInteger` en los tres valores
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes — **no** introducir `toFixed`,
      `Number.EPSILON` ni redondeo del factor ([[design]] D2, ruido IEEE-754)

## R5 — Comidas por día

- [ ] (1) Escribir test que falla para R5 — `nutrition-engine.spec.ts` (cachorro
      4, joven 3, adulto 2, **gato adulto `high` 3**, perro adulto `high` 2)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Horarios por número de comidas

- [ ] (1) Escribir test que falla para R6 — `nutrition-engine.spec.ts` (los tres
      arrays de C-6 exactos y `mealTimes.length === mealsPerDay`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — `objective`

- [ ] (1) Escribir test que falla para R7 — `nutrition-engine.spec.ts` (los tres
      valores + el caso cruzado `ageMonths: 3`, `bodyCondition: 8` ⇒ `'growth'`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Warning `weight_loss_plan` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R8 — `nutrition-engine.spec.ts`: positivo
      (`bodyCondition: 8` adulto), positivo en crecimiento (`ageMonths: 3`,
      `bodyCondition: 8` ⇒ warning presente **y** `objective: 'growth'`, OV2) y
      **anti-vacío** (`bodyCondition: 5` y `bodyCondition: null` ⇒ el array no
      contiene `'weight_loss_plan'`). **Verlo fallar en rojo antes de seguir.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Warning `underweight_vet` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R9 — positivo (`bodyCondition: 3`,
      `bodyCondition: 1`) + **anti-vacío** (`bodyCondition: 5`, `null`).
      **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Warning `chronic_disease_vet` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R10 — positivo (`diseases: ['diabetes']`,
      texto literal `'Plan general; tu veterinario debe ajustarlo.'`) +
      **anti-vacío** (`diseases: []`). **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Warning `check_food_allergens` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R11 — positivo (`allergies: ['pollo']`) +
      **anti-vacío** (`allergies: []`). **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Warning `too_young_vet` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R12 — positivo (`ageMonths: 1`), frontera
      (`ageMonths: 2` ⇒ ausente) y **anti-vacío** (`ageMonths: 24`).
      **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Contrato de la lista de warnings (orden, acumulación, `[]`)

- [ ] (1) Escribir test que falla para R13 — caso con tres warnings simultáneos
      (`bodyCondition: 8`, `diseases: ['diabetes']`, `allergies: ['pollo']`)
      aseverando el array **completo y en orden** de `NUTRITION_WARNING_ORDER`, y
      caso limpio ⇒ `toEqual([])`
- [ ] (2) Implementación mínima que lo pasa — recorrer `NUTRITION_WARNING_ORDER`,
      no encadenar `if`s ([[design]] D2 paso 7)
- [ ] (3) Refactor con tests verdes

## R14 — Los cuatro casos ancla con valores exactos

- [ ] (1) Escribir test que falla para R14 — `nutrition-engine.spec.ts::R14
      (nutrition-profile-engine #17): los cuatro casos ancla con valores exactos`,
      con los inputs y salidas **literales** de [[requirements]] R14, incluidas
      las dos comprobaciones de invariancia frente a `activityLevel: 'high'`
      (casos 3 y 4)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes — **prohibido consolidar los casos 1 y 2 en
      uno, parametrizarlos a un valor aproximado o borrar cualquiera de los dos**:
      el caso 1 elimina `floor` y el caso 2 elimina `ceil`; por separado no
      prueban la regla de redondeo. Si un refactor los toca, el reviewer rechaza.

---

## Persistencia

## R15 — Tablas `nutrition_profiles` / `nutrition_plans`, CHECKs, índice y migración nueva

- [ ] (1) Escribir test que falla para R15 — `src/db/schema/nutrition.schema.spec.ts`
      (`getTableConfig`: columnas y nullability exactas, los cinco CHECKs por
      nombre, el índice `nutrition_plans_pet_id_generated_at_idx`, y que la
      migración que contiene `CREATE TABLE "nutrition_profiles"` no contiene
      `ALTER TABLE "pets"` ni `ALTER TABLE "weights"`)
- [ ] (2) Implementación mínima que lo pasa — `src/db/schema/nutrition.schema.ts`
      + `export * from './nutrition.schema';` en el barrel +
      `pnpm -C backend-pet-tracker run db:generate`. **Commitear los tres
      artefactos**: `0013_*.sql`, `meta/0013_snapshot.json` y `meta/_journal.json`.
      **No editar ninguna migración ya existente.**
- [ ] (3) Refactor con tests verdes — verificar que `src/db/migrations.spec.ts` y
      `src/db/schema/health.schema.spec.ts` siguen verdes

---

## Perfil nutricional

## R16 — `PUT /v1/pets/:petId/nutrition-profile` (upsert de reemplazo total)

- [ ] (1) Escribir test que falla para R16 — `test/nutrition.e2e-spec.ts` (primer
      PUT ⇒ 200 con el shape congelado; segundo PUT con menos claves ⇒ los
      valores anteriores **borrados**, no fusionados)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — `GET /v1/pets/:petId/nutrition-profile` (200 / 404)

- [ ] (1) Escribir test que falla para R17 — `test/nutrition.e2e-spec.ts`
      (200 con perfil; 404 `NUTRITION_PROFILE_NOT_FOUND` sin perfil)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — Validación del DTO (`kcalPer100g 900 → 400`, sin defaults)

- [ ] (1) Escribir test que falla para R18 — `test/nutrition.e2e-spec.ts`:
      `kcalPer100g: 900` ⇒ 400; `kcalPer100g: 79` ⇒ 400; `foodType: 'dry'` **sin**
      `kcalPer100g` ⇒ 400 (OV1: el backend no rellena 350); `activityLevel`
      inválido ⇒ 400; clave desconocida ⇒ 400; y en todos, **ninguna fila escrita**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

---

## Generación del plan

## R19 — `POST /v1/pets/:petId/nutrition-plan/generate` (composición, motor, 200)

- [ ] (1) Escribir test que falla para R19 — `test/nutrition.e2e-spec.ts`:
      mascota de 20 kg (peso vía `POST /v1/pets/:petId/weights`), adulta,
      esterilizada, perfil `medium`/`dry`/`350` ⇒ 200 con `merKcal: 1059`,
      `dailyGrams: 305`, `mealsPerDay: 2` y el shape exacto **sin** `inputsHash`
- [ ] (2) Implementación mínima que lo pasa — el use-case llama a
      `calculateAgeMonths(pet, new Date())`, **nunca** el motor
- [ ] (3) Refactor con tests verdes

## R20 — Hash canónico del input

- [ ] (1) Escribir test que falla para R20 —
      `src/modules/nutrition/application/nutrition-input-hash.spec.ts`: mismo
      hash con claves escritas en otro orden y con `allergies: ['pollo','res']`
      vs `['res','pollo']`; hash distinto al cambiar **cada una** de las diez
      claves (una aserción por clave, `ageMonths` incluida)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R21 — Idempotencia por `inputs_hash` (hash hit sin fila nueva)

- [ ] (1) Escribir test que falla para R21 — `test/nutrition.e2e-spec.ts`: dos
      `generate` seguidos ⇒ **mismo `id`** y `SELECT count(*) FROM
      nutrition_plans WHERE pet_id = ...` sigue en 1; tras un `PUT` que cambia
      `kcalPer100g` ⇒ tercer `generate` con `id` distinto y count 2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R22 — `422 NUTRITION_PROFILE_REQUIRED` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R22 — `test/nutrition.e2e-spec.ts`:
      `generate` sin perfil ⇒ 422 con `code: 'NUTRITION_PROFILE_REQUIRED'` y
      count de `nutrition_plans` en 0; **anti-vacío**: con perfil creado, el
      `generate` responde 200 y el cuerpo no contiene ese código.
      **Verlo fallar en rojo antes de implementar.**
- [ ] (2) Implementación mínima que lo pasa —
      `UnprocessableEntityException` de `@nestjs/common`, cuerpo
      `{statusCode, code, message}`
- [ ] (3) Refactor con tests verdes

## R23 — `422 PET_WEIGHT_REQUIRED` (GUARDA — rojo obligatorio + anti-vacío)

- [ ] (1) Escribir test que falla para R23 — `test/nutrition.e2e-spec.ts`: perfil
      creado pero mascota sin ninguna pesada ⇒ 422 `PET_WEIGHT_REQUIRED`, sin
      fila; precedencia (sin perfil **y** sin peso ⇒ `NUTRITION_PROFILE_REQUIRED`);
      **anti-vacío**: con peso registrado, el código no aparece.
      **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R24 — `GET /v1/pets/:petId/nutrition-plan` (último plan / 404)

- [ ] (1) Escribir test que falla para R24 — `test/nutrition.e2e-spec.ts`
      (404 `NUTRITION_PLAN_NOT_FOUND` antes de generar; tras dos generates con
      inputs distintos, devuelve el **último**)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

---

## Transversal

## R25 — Ownership, roles y ausencia de muro de pago (GUARDA — rojo obligatorio)

- [ ] (1) Escribir test que falla para R25 — `test/nutrition.e2e-spec.ts`:
      usuario B sobre mascota de A ⇒ 404 en las **cuatro** rutas; `:petId` no-UUID
      ⇒ 404; miembro con rol distinto de `owner` ⇒ 403 en `PUT` y en `generate`,
      200 en los dos `GET`; y mascota **sin** suscripción de dispositivo activa ⇒
      200 en `generate` (nunca 402 `DEVICE_SUBSCRIPTION_REQUIRED`, OV3).
      **Verlo fallar en rojo.**
- [ ] (2) Implementación mínima que lo pasa — `@UseGuards(PetAccessGuard)` en el
      controller y `@RequirePetRole('owner')` en las dos rutas de escritura
- [ ] (3) Refactor con tests verdes

## R26 — `aiExplanation` siempre `null`, sin `openai` ni `OPENAI_*`

- [ ] (1) Escribir test que falla para R26 — `test/nutrition.e2e-spec.ts`
      (`aiExplanation` es `null` en `generate` y en `GET`) +
      `src/modules/nutrition/nutrition-scope.spec.ts` (lee
      `backend-pet-tracker/package.json` y `.env.example`: sin `openai`, sin
      `OPENAI_`, sin literal `gpt-`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R27 — `numeric` → `number` en el borde de infraestructura

- [ ] (1) Escribir test que falla para R27 — `test/nutrition.e2e-spec.ts`
      (`typeof body.kcalPer100g === 'number'` y `typeof body.targetWeightKg ===
      'number'` en el `GET` de perfil tras un `PUT`)
- [ ] (2) Implementación mínima que lo pasa — `Number(...)` al leer,
      `String(...)` al escribir
- [ ] (3) Refactor con tests verdes

---

## T-docs — Cierre documental (sin R-id, no es comportamiento)

- [ ] Completar en `docs/data-model.md` las filas `nutrition_profiles` y
      `nutrition_plans` del catálogo con los tipos, nullability, CHECKs,
      `ON DELETE CASCADE` e índice de R15
- [ ] Rellenar `specs/nutrition-profile-engine/traceability.md`: una fila por
      R-id con el test y **los dos commits** (rojo y verde). Ninguna fila puede
      quedar en "pendiente" (C5)
- [ ] `./init.sh` en verde antes de pedir el review
