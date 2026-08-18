# Handoff a Codex CLI — nutrition-ai-explainer (#18)

> Generado por el `leader` el 2026-08-18, tras el gate humano
> (`specs/nutrition-ai-explainer/requirements.md` → `[X] Aprobado por humano
> (fecha: 2026-08-18)`).
> El humano copia el bloque de abajo en su terminal de Codex CLI.
> Claude no ve el output de Codex: el intercambio es por disco
> (`progress/impl_nutrition-ai-explainer.md`).

---

```
Feature: nutrition-ai-explainer, id 18, branch: feature/18-nutrition-ai-explainer (ya creada, ya estás en ella)
Spec aprobada por humano: specs/nutrition-ai-explainer/requirements.md (status: approved, 19 requisitos R1..R19)
Lee también, antes de escribir nada: specs/nutrition-ai-explainer/design.md y specs/nutrition-ai-explainer/tasks.md

Es la última feature del backlog: 29/30 hechas. Construye sobre #17
(nutrition-profile-engine), que se mergeó hoy — su spec está en
specs/nutrition-profile-engine/ y su código en src/modules/nutrition/.

La spec es autosuficiente: el system prompt literal, el timeout, el tope de salida, las
cotas y todos los símbolos nuevos con su ruta están transcritos en ella. NO abras
plans/009-alimentacion-ia.md: contiene dos frases que la spec anula a propósito (el
modelo y el tope de tokens) y rutas de un monorepo que nunca existió aquí. Si un dato no
está en la spec, es un bug de la spec: documenta el bloqueo en
progress/impl_nutrition-ai-explainer.md y para.

## Qué implementar

La explicación en lenguaje natural del plan de alimentación, detrás de un puerto de
dominio con dos implementaciones (real y nula):

- puerto `NutritionExplainer` + token `NUTRITION_EXPLAINER` en domain/ports/
- `OpenAiNutritionExplainer` y `NullNutritionExplainer` en infrastructure/ai/
- factory `createNutritionExplainer(config)`: único sitio del código que lee `OPENAI_*`
- system prompt versionado en infrastructure/ai/nutrition-prompt.ts
- `setAiExplanation(planId, explanation)` nuevo en el repositorio (puerto + Drizzle)
- el flujo del use-case: INSERT del plan -> gate de entitlement -> llamada IA -> UPDATE
- tres env nuevas en .env.example y en docs/conventions.md

NO hay migración: la columna `ai_explanation` ya existe desde 0013 (#17 R15).

## Overrides humanos vigentes (requirements.md §Overrides) — NO revertir

  OV1  El modelo por defecto es `gpt-5-mini`, NO el `gpt-4o-mini` que dice plans/009.
       El modelo llega siempre por OPENAI_MODEL; en backend-pet-tracker/src/ no hay
       ningún literal de modelo, ni siquiera en un comentario.
  OV2  El prompt se alimenta SOLO de NutritionEngineInput + NutritionPlanResult. Nada de
       foodType, nada del nombre de la mascota, ningún dato identificable. Consecuencia:
       nutrition-input-hash.ts NO se toca y los inputs_hash persistidos siguen válidos.
  OV3  Sin isPetTracked(petId) === true, aiExplanation es null con 200. Una mascota sin
       collar activo nunca tendrá explicación. La regla de #25 se consume, no se recalcula.

Y una decisión del gate que corrige al plan 009: el tope de salida es
NUTRITION_AI_MAX_OUTPUT_TOKENS = 1_200, no los 400 del plan. Los 400 estaban pensados
para un modelo sin razonamiento; gpt-5-mini cuenta los tokens de razonamiento contra ese
presupuesto y podría agotarlo antes de emitir una palabra.

## Reglas críticas

- Arquitectura: docs/architecture.md (capas domain / application / infrastructure). El
  módulo nutrition ya existe: sigue su forma, no crees uno nuevo.
- Convenciones: docs/conventions.md. En especial: configuración vía ConfigService, nunca
  `process.env` en código nuevo.
- TDD por requisito, según specs/nutrition-ai-explainer/tasks.md: test rojo -> verde ->
  refactor.
- **UN COMMIT POR REQUISITO COMO MÍNIMO, CON EL TEST ROJO ANTES QUE SU IMPLEMENTACIÓN.**
  El historial tiene que mostrar el patrón rojo->verde por R-id. Un único commit con todo
  incumple C4 de CHECKPOINTS.md y es motivo de rechazo. Formato:
  `test(nutrition-ai-explainer): ... (R<n>)` y luego `feat(nutrition-ai-explainer): ... (R<n>)`.
- Cada test nombra su requisito con el sufijo de feature:
  `describe('R<n> (nutrition-ai-explainer #18): ...')`. #17 ya escribió R1..R27 en ESTOS
  MISMOS archivos; sin el sufijo, C4 no es verificable por grep y los R-id se confunden.
- Actualiza specs/nutrition-ai-explainer/traceability.md tras cada commit, con los DOS
  hashes por fila. Una fila con un solo hash es motivo de rechazo.
- **Guardas: prohibido que nazcan verdes.** Cada degradación (clave ausente, IA apagada,
  timeout, sin entitlement, respuesta vacía o truncada) se ve fallar en rojo antes de
  implementarla y lleva su aserción anti-vacío. Aquí la trampa es AL REVÉS que en #17:
  todos los caminos degradados terminan en `null`, así que una implementación que nunca
  llame a la IA los pasaría todos. Por eso cada test de degradación necesita su mitad
  positiva, y por eso existe R18.
- No crees recursos AWS reales ni corras cdk deploy: eso lo hace el humano.

## Ocho trampas concretas de esta feature

1. **R1 deja la suite ROJA a propósito, y eso está previsto.**
   #18 deroga R26 de #17, que vive en DOS archivos: src/modules/nutrition/nutrition-scope.spec.ts
   (cinco aserciones: una se borra, tres se invierten, la de `gpt-` se conserva) y el
   bloque R26 de test/nutrition.e2e-spec.ts (la primera mitad sobrevive renombrada, la
   segunda se borra). Va en su propio commit `test(nutrition-ai-explainer): derogate R26
   of #17 (R1)` y la suite queda roja hasta que aterricen R4 y la dependencia openai. La
   tabla aserción por aserción está en R1: síguela literal, no improvises qué borrar.

2. **El mapper devuelve `null` a pelo. Es el fallo silencioso más fácil de esta feature.**
   src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts (~línea 63) hardcodea
   `aiExplanation: null`. Sin R17, TODO lo demás puede estar verde escribiendo en una
   columna que nadie lee. Si acabas la feature y la explicación no sale por HTTP, mira ahí
   primero.

3. **Ningún test puede tocar la red: es dinero real.**
   La garantía es triple y estructural (R3): guarda `NODE_ENV === 'test'` evaluada ANTES
   que nada en el factory, doble inyectado por el puerto, y `process.env.OPENAI_ENABLED =
   'false'` fijado en el e2e antes de crear el testing module. Ningún *.spec.ts importa
   `openai`: la carga del SDK es un `await import('openai')` perezoso dentro del adaptador
   real. Si el humano tiene una clave real en su .env, una suite descuidada le factura.

4. **`maxRetries: 0` no es estilo.**
   El SDK reintenta por defecto y aplica el timeout POR INTENTO: sin desactivarlo, "15 s"
   se convierte en ~45 s, cruza el corte de 29 s de API Gateway y produce un 504 — rompiendo
   justo el invariante "jamás un 5xx por la IA".

5. **El nombre del parámetro de tope de salida lo fija el modelo.**
   La familia GPT-5 rechaza `max_tokens` en Chat Completions y exige `max_completion_tokens`.
   Verifícalo contra la versión del SDK que instales, usa el que acepte el modelo por
   defecto, y **escribe en progress/impl_nutrition-ai-explainer.md cuál usaste**. El valor
   va siempre por la constante, nunca a mano en el sitio de la llamada.

6. **Ningún camino a `null` es silencioso.**
   Los cuatro casos de R10 (contenido null, '', solo espacios, finish_reason 'length')
   devuelven `null` Y emiten warn con `finishReason` y `usage` en el objeto logueado. Es lo
   único que hace diagnosticable una explicación ausente en la prueba de humo del humano.
   El log NO puede llevar la clave de API, ni el user prompt, ni las alergias o
   enfermedades (precedente de redacción: redactToken() en workers/notifier/notifier.constants.ts).

7. **Cotas del texto libre antes de que salga hacia el proveedor.**
   allergies y diseases son texto del usuario sin `.max()` en el DTO de #17. Se acotan al
   CONSTRUIR EL PROMPT (20 elementos, 100 caracteres cada uno) y se emiten como valores
   JSON, nunca interpolados en prosa. El DTO de #17 NO se toca: está aprobado y desplegado.

8. **La clave nunca se commitea.** .env.example lleva `OPENAI_API_KEY=PENDING`, el mismo
   centinela que ya usa WIALON_TOKEN. env-drift.mjs y env-drift.test.mjs NO se tocan: la
   clasificación de gates es automática por el sufijo _ENABLED.

## Criterios de aceptación

Los 19 requisitos R1..R19 de specs/nutrition-ai-explainer/requirements.md, cada uno con su
archivo de test en traceability.md. Resumen:

  R1   derogación de R26 de #17, aserción por aserción, en los dos archivos
  R2   cero literales `gpt-` en src/ (tampoco en comentarios)
  R3   ningún test llega a la red, garantía triple
  R4   las tres env en .env.example y en conventions, en el mismo commit
  R5   un solo archivo lee OPENAI_*; las cuatro condiciones del factory
  R6   system prompt literal y versionado con fecha
  R7   el user prompt solo lleva input + resultado (OV2)
  R8   cota 20 x 100 sobre allergies y diseases
  R9   parámetros de la llamada: 15_000 ms, maxRetries 0, tope 1_200, sin temperature
  R10  normalización de la respuesta; los cuatro caminos a null avisan
  R11  toda degradación es null + warn, jamás una excepción ni un 5xx
  R12  orden exacto: INSERT -> gate -> IA -> setAiExplanation
  R13  setAiExplanation actualiza solo ai_explanation, sin fila nueva
  R14  gate de entitlement por isPetTracked, dentro del use-case (OV3)
  R15  reintento sobre la MISMA fila cuando el hash hit trae ai_explanation null
  R16  hash hit con explicación no vuelve a llamar (ni a pagar)
  R17  el mapper devuelve la explicación persistida
  R18  camino feliz de punta a punta: la anti-vacío global de la feature
  R19  prueba de humo con clave real — GATE HUMANO, no la ejecutas tú

## Fuera de alcance (no lo hagas aunque lo veas)

- Tocar nutrition-input-hash.ts o NutritionEngineInput (OV2).
- Tocar el DTO de #17 (application/dto/nutrition-profile.dto.ts).
- Cualquier migración: la columna ya existe.
- Trabajo en background para la llamada IA (el `void` que responde antes de terminar):
  descartado por escrito en design.md D1, porque en la arquitectura objetivo Lambda congela
  el proceso al responder y la explicación no se escribiría nunca.
- Pantallas móviles: este repo es solo backend.
- Arreglar el test R12 de test/health-vaccines.e2e-spec.ts. Si te falla con las tres
  acciones de audit_log en otro orden, es un flake conocido (le falta un ORDER BY) y está
  fuera del alcance de #18: repite con la infra caliente y anótalo, no lo toques.

## Antes de terminar

- `./init.sh` verde. Los e2e necesitan Docker: `docker compose up -d`. Comprueba que
  Postgres publica puerto con `docker port <contenedor>`: hay un modo de fallo conocido en
  el que init.sh se salta los e2e EN SILENCIO y parece verde. Si falla con FK 23503 en
  pet_users, es la carrera de arranque conocida: repite con la infra caliente.
  Al correr init.sh, ojo con el exit code si lo pasas por una tubería: el de una tubería es
  el del último comando, no el de init.sh.
- specs/nutrition-ai-explainer/traceability.md sin filas "pendiente", dos hashes por fila.
- docs/verification.md: sección nueva `### Feature 18 — nutrition-ai-explainer` con los
  cuatro pasos de la prueba de humo (R19), con el formato de las secciones 19, 20, 21, 23 y 28.
- Escribe el resultado en progress/impl_nutrition-ai-explainer.md: qué commits, qué R-id
  cubre cada uno, salida de ./init.sh, qué nombre de parámetro de tope usaste (trampa 5) y
  cualquier decisión que hayas tenido que tomar.

## NO cierres la feature, y NO ejecutes la prueba de humo

Dos cosas distintas, las dos prohibidas:

- **No cierres la feature**: no marques "done", no toques feature_list.json, no edites
  STATUS.md, no muevas progress/current.md, no abras el PR ni mergees. Tu entrega acaba en
  commits + traceability completa + progress/impl_nutrition-ai-explainer.md.
- **No ejecutes R19 ni la des por cumplida**: la prueba de humo llama a la API real y
  CUESTA DINERO. La corre el humano, igual que las pruebas contra AWS real. No pongas una
  clave real en ningún archivo, no la pidas, y no marques su casilla. Si la implementación
  necesita que alguien vea la IA funcionando de verdad para considerarse terminada, eso lo
  hace el humano después de tu entrega.
```

---

## Estado en el momento del handoff

- `feature_list.json` #18 → `in_progress`. Es la última: 29/30 hechas.
- Branch `feature/18-nutrition-ai-explainer` con la spec aprobada commiteada.
  Nada pusheado.
- `backend-pet-tracker/` intacto: Codex es el único escritor del working tree
  mientras dure la implementación.
- **#18 tiene dos gates humanos**, no uno: la aprobación de la spec (hecha,
  2026-08-18) y la prueba de humo de R19, que sigue abierta y que ni el
  `reviewer` ni Codex pueden marcar.
- Siguiente paso de Claude: esperar a que el humano confirme que Codex terminó,
  leer `progress/impl_nutrition-ai-explainer.md` y lanzar el `reviewer`.
