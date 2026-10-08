---
feature: "nutrition-ai-explainer"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[nutrition-ai-explainer]]

> Decisiones técnicas de alto nivel. Los textos, cifras, símbolos, rutas y
> anclas normativos están en [[requirements]] (C-1..C-6, E-5); aquí solo el
> porqué. Rutas `src/...` y `test/...` relativas a `backend-pet-tracker/`.
>
> **Enmienda 2026-10-08.** El proveedor pasa de OpenAI a Anthropic (D-A..D-D
> del humano, ver [[requirements]] §E-0). Cambian D3, D4, D5, D-A y la tabla de
> archivos; se añaden D7 (proyección del plan persistido) y D8 (destino de R26
> de #17). D1, D2, D-B, D-C y D6 conservan su decisión; su texto se re-ancla a
> la base `c4e6be8b`.

## Origen de las decisiones

| Fuente | Qué aporta |
|---|---|
| `plans/009-alimentacion-ia.md` §Paso 3 | Flujo síncrono, system prompt, modelo por env, degradación a `null` |
| `progress/explore_nutrition-ai-explainer.md` | Inventario del árbol (con las correcciones de [[requirements]] §E-4) |
| Gate humano 2026-08-18 | OV2, OV3, D1(a), D2(b), D4(a), D7(b), D8(a) |
| Decisiones humanas 2026-10-08 | D-A (Anthropic), D-B (`claude-haiku-5-5` solo por env), D-C (variables), D-D (el resto se mantiene) |
| Skill `claude-api` (2026-10-08) | Forma de `messages.create`, `max_tokens` obligatorio, `system` de primer nivel, `stop_reason`, semántica de `timeout`/`maxRetries`, sampling no por defecto = 400 en Haiku 5.5, precios |
| Rondas 1 y 2 del `reviewer` (branch `feature/18-nutrition-ai-explainer`) | Lecciones B1–B4, O1–O5, N1–N3, convertidas en cláusulas ([[requirements]] §E-3) |

---

## Decisiones técnicas

### D1 — INSERT → IA → UPDATE, síncrono (R12, R13)

El plan determinístico se persiste **antes** de tocar la red y la explicación
se escribe después con un `UPDATE` de una sola columna. Si el proceso muere a
mitad de la llamada, la fila queda con `ai_explanation = NULL` y un
`inputs_hash` válido; D2 la recupera en el siguiente `generate`.

Síncrono porque la explicación es opcional y degrada a `null`: una cola SQS +
worker multiplica la feature por 4–5 y obliga al móvil a hacer polling. El
coste de latencia está acotado por D4 (15 s totales).

El `UPDATE` es un método nuevo del puerto (`setAiExplanation`, el **sexto**;
hoy hay cinco, `insertPlanAndMoveServing` llegó con #103). `.returning()` +
el mapeo de filas existente devuelve el plan sin releer.

### D2 — Reintento solo sobre `null`, en la misma fila (R15, R16)

Un hash hit con texto se devuelve tal cual (no se paga dos veces). Un hash hit
con `null` **y** entitlement reintenta sobre la misma fila, sin insertar: es el
caso "acabo de activar el collar y pulso Recalcular". Sin ese camino, el plan
quedaría sin explicación para siempre hasta que el usuario cambiase un dato.
Con la IA apagada, el adaptador nulo devuelve `null` sin coste. No hay TTL ni
backoff: la única condición es la de R15.

### D3 — El modelo entra por env y no existe en el código (R2, OV1)

`ANTHROPIC_MODEL` sin default en código. El literal `claude-haiku-5-5` vive
solo en `.env.example` y en `docs/conventions.md`; en `src/` no hay ninguno
(`grep -rn 'claude-' backend-pet-tracker/src/` → 0, specs incluidos). Cambiar de
modelo es cambiar una línea de `.env`. Una variable vacía apaga la IA
(`model-missing`) en vez de inventar un modelo. Los tests usan
`'modelo-de-prueba'`.

La guarda `gpt-` del código de producción (aserción 5 de R26 de #17) se
conserva: protege contra volver al proveedor descartado.

### D4 — `timeout: 15_000` con `maxRetries: 0`, presupuesto total (R9)

En `@anthropic-ai/sdk` (skill `claude-api`): `timeout` en milisegundos y **por
intento** (default 10 min); `maxRetries` default 2, reintenta 408, 409, 429,
5xx y errores de conexión. Con los defaults, un `POST` síncrono podría tardar
~3 × 15 s y cruzar el corte de 29 s de API Gateway de la arquitectura objetivo,
convirtiendo una degradación limpia en un `504`. Con `maxRetries: 0` hay un
intento y 15 s es el total.

Las dos cifras son constantes exportadas y el cliente se construye con
`timeout: NUTRITION_AI_TIMEOUT_MS` y `maxRetries: NUTRITION_AI_MAX_RETRIES`
escritos así: la ronda 1 escribió `maxRetries: 0` a mano en el sitio de la
llamada (B2), y R9 lo prohíbe por texto fuente.

### D5 — Puerto + dos adaptadores, seleccionados en un `useFactory` (R3, R5)

```
domain/ports/nutrition-explainer.ts                 NUTRITION_EXPLAINER, NutritionExplainer
infrastructure/ai/null-nutrition-explainer.ts       NullNutritionExplainer(reason)
infrastructure/ai/anthropic-nutrition-explainer.ts  AnthropicNutritionExplainer(model, apiKey, client)
infrastructure/ai/nutrition-explainer.factory.ts    createNutritionExplainer(config)
```

- **Un solo lector de configuración.** `createNutritionExplainer` es el único
  archivo con `ANTHROPIC_`; el use-case y los adaptadores no ven
  `ConfigService`. Mismo patrón que `src/integrations/wialon/wialon.factory.ts`
  (centinela `WIALON_TOKEN_PENDING`).
- **Cliente mínimo local.** `AnthropicMessagesClient` es una interfaz con un
  solo método (`create`) y tipos de parámetros y respuesta locales con solo los
  campos usados. Los tests no importan el SDK; el SDK real encaja
  estructuralmente porque `client.messages` tiene `create`.
- **Import perezoso.** Con `client === null` (lo que pasa el factory), el SDK
  se carga con `await import('@anthropic-ai/sdk')` solo dentro de `explain()`
  (precedente: `await import('expo-server-sdk')` en
  `src/workers/notifier/expo-push-sender.ts`). Construir el adaptador nunca
  carga el SDK. El implementador comprueba bajo el `tsconfig` del repo cómo se
  obtiene el export por defecto y lo anota en su informe.

> **Enmienda E1.3 (2026-10-08).** Este párrafo y la firma de la tabla de arriba
> quedan derogados por [[requirements]] §Enmienda E1, E1.3 y E1.6. El constructor
> gana un cuarto parámetro, `loadSdk: AnthropicSdkLoader`, cuyo default es
> `async () => await import('@anthropic-ai/sdk')`. Así el literal sigue
> apareciendo una sola vez y el factory sigue llamando con tres argumentos.
> `explain()` carga el SDK con `await this.loadSdk()` dentro del `try`. Motivo:
> con `module: nodenext`, `jest.mock` no intercepta el `import()` nativo (E1.0),
> y sin un cargador inyectable el fallo del `import` o del constructor no se
> puede probar. La conducta de producción no cambia.
- **Clave explícita.** `new Anthropic({ apiKey: this.apiKey, ... })`: la clave
  viene de `ConfigService`, no de la lectura automática de `process.env` del
  SDK.
- **`client` sin default.** Obliga a cada llamada a decir de dónde sale el
  cliente; la aserción 13 de R1 prohíbe pasar `null` desde un test.

`ctx` (`{ petId, planId }`, enmienda 2026-08-18) llega al adaptador solo para
el `logger.warn`; `buildUserPrompt` tiene dos parámetros y no lo ve.

### D-A — Guarda `NODE_ENV === 'test'`: aquí protege dinero (R3)

Cinco archivos del repo ya hacen
`this.config.get<string>('NODE_ENV') !== 'test'` para no arrancar schedulers en
tests. Aquí la guarda es la primera condición del factory y protege
facturación: un desarrollador con `ANTHROPIC_ENABLED=true` y una clave real en
`.env` no debe pagar por correr `init.sh`. Se suma a otras tres capas (doble
por el puerto, `process.env.ANTHROPIC_ENABLED = 'false'` en los dos e2e de
nutrición, y la prohibición de `null` como cliente en tests).

Efecto colateral visto en la ronda anterior: con `NODE_ENV=test` en el `.env`
local, el servidor de desarrollo apagaba la IA y el log solo decía `ai
explanation disabled`. Por eso `NullNutritionExplainer` lleva `reason` y R19
tiene un pre-vuelo.

### D-B — El gate de entitlement vive en `application/`, no en un guard (R14)

`PetTrackingGuard` responde `402 DEVICE_SUBSCRIPTION_REQUIRED`, y #17 R25 exige
que las rutas de nutrición nunca lo hagan (el plan clínico es gratuito). El
gate de #18 no rechaza: decide si se paga la llamada. Por eso es una
comprobación de `isPetTracked(petId)` dentro del use-case, después del INSERT,
consumiendo `SUBSCRIPTION_REPOSITORY` como `claim-device.use-case.ts`. Sin
`warn` en esa rama: un usuario gratuito es un caso normal.

`NutritionModule` pasa a importar `SubscriptionsModule` (exporta el token) y
`ConfigModule` (para el `inject: [ConfigService]` del `useFactory`, como
`NotifierModule`).

### D-C — Las cotas del texto libre son un borde de confianza (R8)

`allergies` y `diseases` son `z.array(z.string())` sin `.max()` en el DTO de
#17, que está desplegado. Cambiar el DTO es un cambio de contrato; acotar al
construir el prompt no lo es. 20 elementos × 100 caracteres por array acota la
entrada en ~4.2 KB y el coste de una llamada. `JSON.stringify` mantiene el
texto del usuario como valor, no como instrucción.

### D6 — El system prompt vive en `infrastructure/ai/`, no en `domain/` (R6)

Es un detalle del proveedor de IA, no una regla de negocio de nutrición. Va
con su comentario de fecha porque es producto. Con Anthropic viaja como el
parámetro `system` de primer nivel.

### D7 — El prompt explica el plan persistido, no la salida del motor (R12, R15)

**Nueva en la enmienda.** Desde #103 el plan persistido puede diferir de
`computePlan(input)`: `carriedSchedule` hereda el horario del plan anterior y
`copyWithMealTimes` copia un plan con horarios editados por el usuario. La
spec vieja decía que recomputar en el hash hit "equivale al persistido"; ya no
es cierto.

`toPlanResult(plan)` en `nutrition-plan.entity.ts` proyecta las siete claves de
`NutritionPlanResult` desde el plan persistido. Mismo tipo, mismas claves: OV2
y el hash no se tocan. En R12 se aplica al plan recién insertado; en R15 al
`latestPlan`, sin llamar a `computePlan`. Los candados de R12 y R15 usan un
plan cuyos `mealTimes` difieren de los del motor, para que la diferencia sea
observable. Alternativa descartada: pasar `result` (el retorno de
`computePlan`): explicaría horarios que el usuario no ve. Queda como P9.

### D8 — R26 de #17: derogar y redirigir, no borrar (R1)

**Nueva en la enmienda.** Con OpenAI las aserciones 1–4 de R26 se volvían
falsas. Con Anthropic siguen siendo verdaderas, así que el `describe` intacto
sería tautológico (pasa con la IA bien cableada y sin ella).

| Opción | Problema |
|---|---|
| Borrar el archivo | Pierde la guarda contra regresar a OpenAI y contra literales `gpt-` |
| Dejarlo intacto | Tautológico respecto a #18: no prueba nada de la feature |
| Ampliarlo a "no hay IA" | Contradice #18 |
| **Conservar las cinco y añadir el cableado Anthropic** | Elegida |

El `describe` se renombra a `R1 (nutrition-ai-explainer #18): ...` y suma las
aserciones 6–13 de R1(a): versión exacta del SDK, bloque de `.env.example`,
filas de `docs/conventions.md`, un único lector de `ANTHROPIC_`, cero
`claude-` en `src/`, y las dos prohibiciones de R3 sobre los tests.

---

## Archivos afectados

### Nuevos

| Archivo | Capa | R-ids |
|---|---|---|
| `src/modules/nutrition/domain/ports/nutrition-explainer.ts` | domain | R5, R12 |
| `src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts` (+ `.spec.ts`) | infrastructure | R6, R7, R8 |
| `src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.ts` (+ `.spec.ts`) | infrastructure | R5 |
| `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts` (+ `.spec.ts`) | infrastructure | R9, R10, R11 |
| `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts` (+ `.spec.ts`) | infrastructure | R3, R5 |
| `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts` | test | R12, R14, R15, R16 |
| `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts` | test | R13 |
| `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts` | test | R17 (archivo nuevo: hoy solo existe `nutrition-error.mapper.spec.ts`) |
| `test/nutrition-ai-explainer.e2e-spec.ts` | test | R13, R16, R18 |

### Modificados

| Archivo | Cambio | R-ids |
|---|---|---|
| `src/modules/nutrition/domain/entities/nutrition-plan.entity.ts` | + `toPlanResult` | R12, R15 |
| `src/modules/nutrition/domain/repositories/nutrition.repository.ts` | + `setAiExplanation` (6.º método) | R13 |
| `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts` | implementación de `setAiExplanation` | R13 |
| `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | `aiExplanation: null,` pasa a `aiExplanation: plan.aiExplanation,` | R17 |
| `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts` | + `SUBSCRIPTION_REPOSITORY`, + `NUTRITION_EXPLAINER`, flujo de R12/R14/R15/R16 | R12–R16 |
| `src/modules/nutrition/nutrition.module.ts` | imports + provider `NUTRITION_EXPLAINER` | R5, R14 |
| `src/modules/nutrition/nutrition-scope.spec.ts` | `describe` renombrado + aserciones 6–13 | R1–R5 |
| `test/nutrition.e2e-spec.ts` | R26 de #17 recortado, `ANTHROPIC_ENABLED='false'`, `it`s de R17 | R1, R3, R17 |
| `test/meal-times.e2e-spec.ts` | una aserción de R12 de #103 | R1(c) |
| `backend-pet-tracker/package.json` + `pnpm-lock.yaml` | `"@anthropic-ai/sdk": "0.128.0"` | R1, RP-4 |
| `.env.example` | bloque de C-4 al final | R4 |
| `docs/conventions.md` | tres filas tras `PUSH_ENABLED` | R4 |
| `env-drift.test.mjs` | una línea: `24` pasa a `27` | R4 |
| `docs/verification.md` | sección `### Feature 18 — nutrition-ai-explainer` | R19 |

### Intocables

| Archivo | Por qué |
|---|---|
| `src/modules/nutrition/application/nutrition-input-hash.ts` | OV2: el hash no cambia |
| `src/modules/nutrition/domain/nutrition-engine.ts` | El motor y sus tipos son de #17 |
| `src/modules/nutrition/application/dto/nutrition-profile.dto.ts` | Contrato desplegado; las cotas van en el prompt (D-C) |
| `src/db/migrations/**` | La columna existe desde `0013_wet_may_parker.sql` |
| `src/modules/subscriptions/**` | Se consume el repositorio, no se cambia la regla de #25 |
| `env-drift.mjs` | Detecta `_ENABLED` por regex; no tiene lista de claves |
| `plans/presupuesto-produccion.md` | Decisión de presupuesto del humano (P7) |

`env-drift.test.mjs` **no** es intocable: cambia exactamente una línea (la
versión de agosto de esta tabla lo listaba aquí por error).

---

## Alternativas descartadas

- **Seguir con OpenAI.** Decisión del humano 2026-10-08 (D-A).
- **`fetch` crudo contra la Messages API.** La skill `claude-api` pide el SDK
  oficial cuando existe para el lenguaje del proyecto; además el SDK ya trae
  timeout y reintentos configurables.
- **Importar los tipos del SDK en el puerto o en los tests.** Ata el dominio y
  los tests a una versión del SDK y obliga a los tests a cargarlo; se usan
  tipos mínimos locales (D5).
- **Construir el cliente en el factory.** Cargaría el SDK al arrancar la app
  aunque nadie pida un plan. Se construye perezosamente en `explain()`.
- **Fijar `thinking`/`output_config` en código.** Su validez depende del
  modelo, que llega por env (P4).
- **Streaming.** Una respuesta de ≤ 180 palabras con tope de 1 200 tokens no lo
  necesita.
- **Cola SQS + worker.** D1.
- **Guard HTTP para el entitlement.** D-B.
- **Validar `allergies`/`diseases` en el DTO.** D-C.
- **Pasar el retorno de `computePlan` al prompt.** D7.
- **Borrar `nutrition-scope.spec.ts`.** D8.

---

## Riesgos asumidos

- **Precedencia de variables.** `@nestjs/config` no pisa lo que ya está en
  `process.env`: una `ANTHROPIC_API_KEY` exportada en la shell gana sobre
  `.env`. Contenido por el default `ANTHROPIC_ENABLED=false` y por el pre-vuelo
  de R19. Abierto en P5 qué más lee el SDK del entorno.
- **Razonamiento adaptativo en Haiku 5.5.** Activo por defecto; sus tokens
  cuentan contra `max_tokens`. Si consume el tope, `stop_reason` es
  `max_tokens` y R10 devuelve `null` con `stopReason` y `usage` en el log.
  Decisión con datos tras R19 (P4).
- **Rechazos de seguridad.** Haiku 5.5 puede devolver `stop_reason:
  "refusal"` sin fallback de servidor; R10 lo trata como `null`.
- **`error.message` en el log (N2).** Si una versión futura del SDK incluyese
  datos de la petición en el mensaje, saldrían al log. Acotado por test con el
  doble; sin redacción propia.
- **Coste por abuso del dueño.** Alternar `kcalPer100g` fuerza misses. Con la
  estimación de R19 (≤ ~$0.00075 por llamada en el peor caso), 1 000 vueltas
  cuestan ≤ ~$0.75. Aceptado; no hay rate limiting en el repo.
- **Explicación heredada desfasada.** #103 copia `aiExplanation` al editar
  horarios; puede citar horarios anteriores (P8).
- **Versión del SDK.** `0.128.0` fijada exacta; actualizarla es una decisión
  aparte (P6).
