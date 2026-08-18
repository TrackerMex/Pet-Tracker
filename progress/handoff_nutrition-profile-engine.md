# Handoff a Codex CLI — nutrition-profile-engine (#17)

> Generado por el `leader` el 2026-08-18, tras el gate humano
> (`specs/nutrition-profile-engine/requirements.md` → `[X] Aprobado por humano
> (fecha: 2026-08-18)`).
> El humano copia el bloque de abajo en su terminal de Codex CLI.
> Claude no ve el output de Codex: el intercambio es por disco
> (`progress/impl_nutrition-profile-engine.md`).

---

```
Feature: nutrition-profile-engine, id 17, branch: feature/17-nutrition-profile-engine (ya creada, ya estás en ella)
Spec aprobada por humano: specs/nutrition-profile-engine/requirements.md (status: approved, 27 requisitos R1..R27)
Lee también, antes de escribir nada: specs/nutrition-profile-engine/design.md y specs/nutrition-profile-engine/tasks.md

La spec es autosuficiente: todas sus cifras clínicas, umbrales, horarios y textos están
transcritos en ella. NO abras plans/009-alimentacion-ia.md — contiene frases que la spec
anula a propósito (ver "Overrides" abajo) y rutas de un monorepo que nunca existió aquí.
Si un número no está en la spec, es un bug de la spec, no una invitación a inventarlo:
documenta el bloqueo en progress/impl_nutrition-profile-engine.md y para. Eso se hizo
en #21 y fue la decisión correcta.

## Qué implementar

Motor determinístico de nutrición + su perfil y su historial de planes, en un módulo
NUEVO backend-pet-tracker/src/modules/nutrition/:

- motor puro `computePlan` en domain/nutrition-engine.ts, con todas las cifras en
  domain/nutrition.constants.ts (RER = 70 x peso^0.75, factores MER, comidas, horarios,
  warnings, objective)
- tablas `nutrition_profiles` y `nutrition_plans` + migración NUEVA 0013
- PUT/GET /v1/pets/:petId/nutrition-profile
- POST /v1/pets/:petId/nutrition-plan/generate (idempotente por inputs_hash sha256)
- GET /v1/pets/:petId/nutrition-plan

Los detalles exactos (columnas, tipos, CHECKs, shape de cada respuesta, nombres de
constantes, pseudocódigo normativo del motor, orden de los warnings, contenido del hash)
están en requirements.md y design.md. No los reinventes ni los "mejores".
design.md D2 trae el pseudocódigo normativo del motor: es la única definición del orden
de operaciones, cualquier refactor debe preservarla observable a observable.

## Overrides humanos vigentes (requirements.md §Overrides) — NO revertir

Estos tres los cerró el humano y prevalecen sobre plans/009 y sobre la `description` de
feature_list.json #17, que están obsoletas en esos puntos. Si ves la frase contraria en
otra fuente, la frase es la obsoleta:

  OV1  kcalPer100g es OBLIGATORIO siempre, para los cuatro foodType. El backend no aplica
       ningún default, tampoco dry 350 / wet 100 (eso es precarga de la UI). La columna
       es NOT NULL. PUT con foodType 'dry' y sin kcalPer100g → 400, no 200 con 350.
  OV2  Gana la edad sobre la pérdida de peso: ageMonths < 12 conserva factor de
       crecimiento aunque bodyCondition >= 7, objective 'growth', RER sobre weightKg
       (nunca sobre targetWeightKg), y AUN ASÍ se emite el warning weight_loss_plan.
  OV3  Sin PetTrackingGuard en ninguna de las cuatro rutas: la nutrición es parte de la
       app de salud gratuita. Una mascota sin suscripción activa debe recibir 200 en
       generate, nunca 402 DEVICE_SUBSCRIPTION_REQUIRED.

## Reglas críticas

- Arquitectura: docs/architecture.md (capas domain / application / infrastructure, regla
  de dependencia). El módulo es nuevo; copia la forma de src/modules/health/.
- Convenciones: docs/conventions.md (naming, errores, DTOs, tests, variables de entorno).
- TDD por requisito, según specs/nutrition-profile-engine/tasks.md: test rojo → verde →
  refactor.
- **UN COMMIT POR REQUISITO COMO MÍNIMO, CON EL TEST ROJO ANTES QUE SU IMPLEMENTACIÓN.**
  El historial de git tiene que mostrar el patrón rojo→verde por R-id. Un único commit
  con implementación + tests + docs incumple C4 de CHECKPOINTS.md y es motivo de rechazo
  del reviewer. Esto pasó en #19: no lo repitas. Formato:
  `test(nutrition-profile-engine): ... (R<n>)` y luego
  `feat(nutrition-profile-engine): ... (R<n>)`.
- Cada test nombra su requisito con el sufijo de feature:
  `describe('R<n> (nutrition-profile-engine #17): ...')`. El módulo es nuevo, pero #18
  (nutrition-ai-explainer) escribirá R-ids en estos mismos archivos; sin el sufijo, C4 no
  es verificable por grep.
- Actualiza specs/nutrition-profile-engine/traceability.md tras cada commit, con los DOS
  hashes por fila (el del test rojo y el de la implementación). Una fila con un solo hash
  es motivo de rechazo.
- **Guardas de seguridad clínica: prohibido que nazcan verdes.** Los cinco warnings
  (R8..R12), los dos 422 (R22, R23) y el 404/403 del guard (R25) se ven fallar en rojo
  antes de implementarlos, y cada test lleva su ASERCIÓN ANTI-VACÍO: que el código NO
  aparece cuando la condición no se cumple, no solo que aparece cuando sí. Un test que
  solo comprueba el caso positivo pasa igual con un array que siempre trae los cinco.
- No crees recursos AWS reales ni corras cdk deploy: eso lo hace el humano.
- No toques nada fuera de lo listado en design.md §Archivos afectados. En concreto:
  src/modules/pets/, src/modules/health/ y src/modules/subscriptions/ no se tocan, y
  PetProfileResponse es un contrato congelado.

## Seis trampas concretas de esta feature

1. **El test de R1 lee el fuente del motor como TEXTO PLANO.**
   nutrition-engine.ts no puede contener `3.0`, `1.6`, `0.75`, `70`, `"07:30"` ni ningún
   texto de warning — **tampoco dentro de un comentario o de un JSDoc**, porque la
   aserción no distingue código de comentario. El JSDoc que documenta las cifras de
   C-1..C-10 va en nutrition.constants.ts, junto a los valores; el JSDoc de computePlan
   remite a las constantes por nombre. (Esta contradicción estaba en la spec y se corrigió
   en b506a22: no la "restaures".)

2. **La migración tiene que ser un archivo NUEVO (0013_*.sql).**
   Generada con `pnpm -C backend-pet-tracker run db:generate`, sin editar ninguna
   migración existente. Los tres artefactos van al commit: el .sql, meta/0013_snapshot.json
   y la entrada en meta/_journal.json. El test de R15 asevera que la migración que crea
   nutrition_profiles NO contiene ALTER TABLE "pets" ni ALTER TABLE "weights".

3. **numeric llega como string desde el driver pg.**
   kcal_per_100g (numeric(6,1)) y target_weight_kg (numeric(5,2)) se convierten a mano en
   el repositorio: Number() al leer, String() al escribir — mismo patrón que
   pet.drizzle.repository.ts con pets.current_weight_kg. No metas mode: 'number' ni
   setTypeParser. El riesgo es silencioso: "350.0" no rompe la aritmética por coerción,
   pero SÍ rompe el hash canónico ("350.0" !== 350 en JSON.stringify).

4. **Los casos ancla 1 y 2 de R14 son un par mínimo indivisible.**
   El perro de 20 kg (302.57 g → 305) elimina floor; el gato de 4 kg (62.29 g → 60)
   elimina ceil. Solo round sobrevive a los dos. No los consolides en uno, no redondees
   sus valores esperados a "~1059", no dejes caer ninguno.

5. **El caso discriminante de R4 es sintético a propósito.**
   Un gato adulto de 1.2 kg no es realista: existe solo para fijar que dailyGrams se
   deriva del merKcal YA redondeado (25 g) y no del MER crudo (30 g). No lo "arregles"
   poniéndole un peso plausible; perderías la única prueba de C-10 regla 2.

6. **El ruido IEEE-754 del factor no se arregla.**
   1.2 + (-0.1) da 1.0999999999999999 y 1.6 - 0.2 da 1.4000000000000001. Está verificado
   que no mueve ninguno de los cuatro casos ancla: Math.round(merCrudo) lo absorbe. No
   introduzcas toFixed, Number.EPSILON ni redondeo intermedio del factor (design.md D2).

## Criterios de aceptación

Los 27 requisitos R1..R27 de specs/nutrition-profile-engine/requirements.md, cada uno con
su archivo de test asignado en traceability.md. Resumen:

  R1   motor puro sin literales, constantes nombradas en nutrition.constants.ts
  R2   RER y peso base (targetWeightKg solo en weight_loss)
  R3   tabla de factores MER y precedencia crecimiento > pérdida > adulto+actividad
  R4   redondeos: merKcal desde el RER crudo, gramos desde el merKcal redondeado
  R5   comidas por día (gato adulto high = 3)
  R6   horarios por número de comidas (tabla fija)
  R7   objective con la edad ganando (OV2)
  R8   warning weight_loss_plan      (GUARDA: rojo + anti-vacío)
  R9   warning underweight_vet       (GUARDA: rojo + anti-vacío)
  R10  warning chronic_disease_vet   (GUARDA: rojo + anti-vacío)
  R11  warning check_food_allergens  (GUARDA: rojo + anti-vacío)
  R12  warning too_young_vet         (GUARDA: rojo + anti-vacío)
  R13  contrato de la lista: acumulable, orden fijo, [] nunca null
  R14  los cuatro casos ancla con valores exactos
  R15  tablas nutrition_profiles y nutrition_plans, migración 0013 nueva
  R16  PUT del perfil: upsert de REEMPLAZO TOTAL, 200 también en la creación
  R17  GET del perfil: 200 o 404 NUTRITION_PROFILE_NOT_FOUND
  R18  validación del DTO, strictObject, kcalPer100g 900 → 400, sin defaults (OV1)
  R19  generate compone el input y responde el plan (perro 20 kg → 1059 kcal / 305 g)
  R20  hash canónico: diez claves en orden fijo, allergies/diseases ordenados, sin undefined
  R21  idempotencia contra el ÚLTIMO plan, sin UNIQUE (pet_id, inputs_hash)
  R22  sin perfil → 422 NUTRITION_PROFILE_REQUIRED   (GUARDA: rojo + anti-vacío)
  R23  sin peso → 422 PET_WEIGHT_REQUIRED, evaluado DESPUÉS de R22 (GUARDA)
  R24  GET del plan: el último, o 404 NUTRITION_PLAN_NOT_FOUND
  R25  PetAccessGuard (404 antes que 403) y ausencia de muro de pago (OV3)
  R26  aiExplanation siempre null, sin dependencia openai ni env OPENAI_*
  R27  numeric llega al cliente como number

## Fuera de alcance (no lo hagas aunque lo veas)

- Toda la IA: ai-explainer.ts, el SDK openai, las env OPENAI_*, el system prompt. Es #18.
  La columna ai_explanation SÍ se crea en la migración de #17 y nace NULL.
- Leer weights.body_condition como fuente del BCS. #17 usa exclusivamente
  nutrition_profiles.body_condition. La consecuencia (sin BCS en el perfil no hay warning
  de peso) está asumida por escrito en requirements.md §Fuera de alcance.
- Defaults de kcalPer100g en el backend (OV1).
- PATCH/DELETE de perfil o de planes.
- Auditoría con AuditLogger.
- Exponer inputsHash en la respuesta HTTP.
- Validación cruzada targetWeightKg vs weightKg: si el target es mayor que el peso actual,
  se acepta tal cual (decisión humana P3). El motor no juzga el objetivo.
- Extraer parseBody a un helper compartido: está duplicada en todos los controllers del
  repo; unificarla es un refactor transversal ajeno a #17.

## Antes de terminar

- `./init.sh` verde. Los e2e necesitan Docker: `docker compose up -d`.
  Antes de fiarte, comprueba que Postgres publica su puerto con `docker port <contenedor>`:
  hay un modo de fallo conocido en el que el contenedor está healthy pero sin binding, e
  init.sh se salta los e2e EN SILENCIO y parece verde.
  Si la primera corrida tras levantar Docker falla con un error de FK en pet_users
  (código 23503), es la carrera de arranque conocida, no una regresión: repite con la
  infra ya caliente.
- specs/nutrition-profile-engine/traceability.md sin filas "pendiente" y con los dos
  hashes por fila.
- docs/data-model.md: completar las filas nutrition_profiles y nutrition_plans del
  catálogo con tipos, CHECKs, ON DELETE CASCADE e índice, y anotar la migración 0013.
- Escribe el resultado en progress/impl_nutrition-profile-engine.md: qué commits, qué
  R-id cubre cada uno, salida de ./init.sh, y cualquier decisión que hayas tenido que
  tomar.

## NO cierres la feature

Esto pasó en #29: te tocó cerrarla tú y no es tuyo. Concretamente, NO hagas nada de esto:

- no marques "done" ni toques feature_list.json
- no edites STATUS.md
- no muevas nada de progress/current.md a progress/history.md
- no abras el PR (`gh pr create`) ni mergees a main

Tu entrega termina en: commits en la branch + traceability.md completa +
progress/impl_nutrition-profile-engine.md escrito. El gate de cierre es la revisión del
`reviewer`, que lanza Claude después, y el merge lo hace el humano.
```

---

## Estado en el momento del handoff

- `feature_list.json` #17 → `in_progress`.
- Branch `feature/17-nutrition-profile-engine` con la spec aprobada commiteada
  (`c04da20`, `b506a22`, `b1e0e5d`). Nada pusheado.
- `backend-pet-tracker/` intacto: Codex es el único escritor del working tree
  mientras dure la implementación.
- Siguiente paso de Claude: esperar a que el humano confirme que Codex terminó,
  leer `progress/impl_nutrition-profile-engine.md` y lanzar el `reviewer`.
