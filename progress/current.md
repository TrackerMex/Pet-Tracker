# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **Feature**: #18 `nutrition-ai-explainer` (P3) — la última del backlog (29/30 hechas)
- **Inicio**: 2026-08-18
- **Branch**: `feature/18-nutrition-ai-explainer` (desde `main` con el merge de
  #17 ya dentro, `2de13d4`)
- **Estado de la feature al arrancar**: `pending` (sin spec)

## Arranque

- `main` sincronizada tras el merge del PR #59 (#17 cerrada, 29/30).
- `progress/current.md` estaba en plantilla vacía: no había sesión sin cerrar.
- `./init.sh` lanzado al arrancar.

## Plan

1. `explorer` — la feature tiene decisiones de diseño abiertas de verdad
   (momento de la llamada respecto al INSERT, latencia de 15 s en un POST
   síncrono, gate de entitlement, colisión con el test R26 de #17, forma de
   mockear el SDK). Reporte en `progress/explore_nutrition-ai-explainer.md`.
2. `spec_author` — spec EARS en `specs/nutrition-ai-explainer/`.
3. **PARA** en el gate humano de la spec.

Esta feature **cuesta dinero**: cada miss de hash con la IA activada es una
llamada pagada a OpenAI. La prueba de humo contra la clave real no se delega a
ninguna IA, la corre el humano (`CLAUDE.md` §Excepciones).

## Bitácora

- **`init.sh`: rojo la primera vez, verde la segunda.** Con la infra fría falló
  un e2e ajeno a esta feature — `health-vaccines.e2e-spec.ts` (#14), R12
  "auditoria de mutaciones": el `SELECT` de `audit_log` de la línea ~495 no
  lleva `ORDER BY`, así que Postgres devolvió
  `['vaccine.update','vaccine.delete','vaccine.create']` contra el
  `['vaccine.create','vaccine.update','vaccine.delete']` que el test compara con
  `toEqual`. Las tres acciones están; solo cambia el orden. Con la infra
  caliente la segunda corrida dio exit 0 y 319 e2e pasados.
  **Es un test flaky por construcción, no un fallo del producto**, y es un
  candidato a entrada nueva del backlog (arreglo: `ORDER BY at` en el test, una
  línea, en `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`). Anotado
  aquí para no perderlo; no se toca en esta sesión — #18 es la feature activa y
  el working tree tiene un solo escritor.
  **Decisión del humano (2026-08-18): no se abre entrada de backlog todavía; se
  abre como bug solo si el fallo se repite.** Disparador guardado en la memoria
  del proyecto para que sobreviva al cierre de sesión.
- **Error de medición del leader, corregido**: la primera corrida se lanzó como
  `./init.sh | tail -40`, y en bash el exit code de una tubería es el del último
  comando (`tail`), no el de `init.sh`. El "exit 0" inicial no significaba nada.
  Repetido sin tubería: `EXIT_REAL=0`.

- **`explorer` terminado** → `progress/explore_nutrition-ai-explainer.md` (1004
  líneas, 8 decisiones D1..D8). Dos correcciones a mis premisas:
  - `toNutritionPlanResponse()` **hardcodea** `aiExplanation: null`: el read path
    está tapado, escribir la columna no basta.
  - La colisión con R26 de #17 está en **dos** archivos, no uno: además de
    `src/modules/nutrition/nutrition-scope.spec.ts` muere el bloque R26 de
    `test/nutrition.e2e-spec.ts`. De las 5 aserciones, 4 se invierten o se borran
    y la de "cero literales `gpt-`" sobrevive intacta (es el criterio 4 de #18).
  Tres trampas nuevas: la suite e2e puede llamar a OpenAI de verdad y facturar en
  cuanto el humano ponga la clave en su `.env`; `allergies`/`diseases` son texto
  libre sin cota (inyección de prompt y factura por tokens); y el hash hit deja
  `null` para siempre justo al usuario que acaba de pagar la suscripción.
- **Gate humano de las decisiones de producto/dinero (2026-08-18)**:
  - **D3 → `gpt-5-mini`**, el del presupuesto, no el `gpt-4o-mini` del plan 009.
    Esa frase del plan queda obsoleta. El modelo sigue viniendo de `OPENAI_MODEL`
    y no aparece en `src/`.
  - **D5 → el prompt se alimenta solo de `NutritionEngineInput` +
    `NutritionPlanResult`.** No se toca `nutritionInputHash`, no se invalidan los
    hashes persistidos y no sale ningún dato identificable hacia OpenAI.
  - **D6 → confirmado el gate de entitlement por collar** (`isPetTracked()` de
    #25): una mascota sin collar activo nunca tendrá explicación IA. Se asume a
    conciencia porque quitar el muro después es fácil y ponerlo, incompatible.
  Las cinco técnicas (D1, D2, D4, D7, D8) las cierra el `spec_author` con la
  recomendación del informe.

- **`spec_author` terminado** → `specs/nutrition-ai-explainer/` (requirements.md
  19 requisitos R1..R19, design.md, tasks.md, traceability.md). #18 en
  `feature_list.json`: `pending` → `spec_ready`.
- **Revisión de la spec por el leader**, antes de pasarla al gate. Un defecto
  real corregido: **R10 devolvía `null` sin log** cuando el contenido llegaba
  vacío o solo espacios (solo el caso `finish_reason: 'length'` avisaba). Como
  R18 se ejercita con un doble, ningún test automático detecta ese camino: la
  explicación desaparecería sin traza y la prueba de humo no daría con qué
  diagnosticarla. Ahora los cuatro caminos de R10 emiten `warn` y el objeto
  logueado lleva `finishReason` y `usage` (contadores, no contenido: no rompe la
  regla de redacción de R11).
- **Segundo gate humano (2026-08-18)** — las tres preguntas abiertas:
  - **P1** → `gpt-5-mini` tal cual en `.env.example`; el id exacto se confirma en
    la prueba de humo, donde una corrección cuesta una línea de `.env`.
  - **P2** → el tope de salida sube de `400` a **`1_200`** y el nombre del
    parámetro lo fija el modelo (`max_completion_tokens` en la familia GPT-5, que
    rechaza `max_tokens`). La cifra 400 del plan 009 estaba pensada para un
    modelo sin razonamiento; con `gpt-5-mini` el tope incluye los tokens de
    razonamiento y podía agotarse antes de emitir una palabra. Subir el techo no
    encarece nada: se factura lo generado.
  - **P3** → cerrada por el `leader` sin volver a preguntar: es la misma
    consecuencia de OV3 que el humano ya confirmó esta misma sesión.

- **Gate humano de la spec superado (2026-08-18)**:
  `specs/nutrition-ai-explainer/requirements.md` → `[X] Aprobado por humano`.
  Los cuatro archivos de la spec pasan a `status: approved` y #18 pasa a
  `in_progress`. (La fecha venía escrita como `26-08-18`; normalizada a
  `2026-08-18`, el formato del resto del repo.)
- **Handoff a Codex CLI escrito** → `progress/handoff_nutrition-ai-explainer.md`.
  Incluye los tres overrides más la corrección del tope de tokens, ocho trampas
  concretas (la derogación que deja la suite roja a propósito, el mapper que
  devuelve `null` a pelo, la garantía triple de no-red, `maxRetries: 0`, el
  nombre del parámetro de tope, los cuatro caminos que deben avisar, las cotas
  del texto libre y el centinela `PENDING`), el aviso de que el flake de R12 de
  `health-vaccines` está fuera de alcance, y **dos prohibiciones separadas**: no
  cerrar la feature y no ejecutar la prueba de humo de R19 ni darla por cumplida.

- **Bloqueo reportado por Codex (2026-08-18) y resuelto por enmienda.** Codex
  paró al implementar: R10/R11 exigen loguear `petId` y `planId`, pero la firma
  del puerto aprobada (`explain(input, result)`) no se los da, y leyó que
  añadirlos chocaba con OV2. **Paró en vez de improvisar, que es exactamente lo
  que el handoff le pedía.** Diagnóstico: la contradicción es real —se me pasó en
  la revisión previa al gate— pero no es con OV2. OV2 prohíbe datos
  identificables en el **prompt**, no que el adaptador los reciba para un
  `logger.warn` del servidor.
  **Enmienda aplicada** (fechada dentro de la propia spec, sin cambiar ningún
  R-id): el puerto gana un tercer parámetro `ctx: { petId, planId }` **solo para
  trazas**. La separación queda verificable y no como promesa:
  `buildUserPrompt(input, result)` sigue siendo de dos parámetros y no recibe
  `ctx`, y la aserción anti-fuga de R7 ya exige que el prompt no contenga ningún
  UUID. Precedente del repo para loguear `petId` en un `warn`:
  `aggregate-daily-activity.use-case.spec.ts:172`.
  Alternativas descartadas: quitar `petId`/`planId` del log (un `warn` sin ids no
  sirve para depurar "a esta mascota le falta la explicación") y loguear desde el
  use-case (obligaría a que el adaptador devolviera `finishReason` y `usage` en un
  tipo de retorno más rico: más código para el mismo efecto).

- **Segundo bloqueo reportado por Codex (2026-08-18): `env-drift.test.mjs`.**
  Implementó R1..R18 y paró con `init.sh` rojo: `env-drift.test.mjs` línea 269
  congela el número de claves de `.env.example` (`assert.equal(keys.length, 21)`)
  y las tres claves de R4 lo suben a 24. La spec prohibía tocar ese archivo, así
  que **no aplicó ningún workaround** — correcto otra vez.
  La prohibición venía de una premisa incompleta mía: el `explorer` verificó que
  `env-drift.mjs` no tiene lista de claves (cierto) pero nadie miró el conteo
  congelado del **test**. Esa aserción es de R11 de #23, dentro del `it` "no añade
  variables de entorno", y es un **canario**: cuando una feature añade claves
  legítimamente, la respuesta prevista es actualizar el número.
  **Enmienda aplicada**: #18 cambia `21` por `24` en esa única línea y deja
  intacta la segunda aserción del mismo `it` (la de `DRIFT`/`ENV_DRIFT`), que es
  la que expresa de verdad el requisito de #23. `env-drift.mjs` sigue sin tocarse.
- **Verificado antes de enmendar**: ninguna clave real commiteada
  (`git diff | grep -E 'sk-[a-zA-Z0-9]{10}'` sin resultados), `.env.example` con
  el centinela `PENDING`, la casilla de la prueba de humo de R19 **sin marcar** y
  #18 todavía en `in_progress`: Codex respetó las dos prohibiciones del handoff.
  Usó `max_completion_tokens` (confirmado contra los tipos de `openai@7.5.0`),
  que es lo que la trampa 5 le pedía documentar.

- **Ronda 1 de revisión: RECHAZADA** → `progress/review_nutrition-ai-explainer.md`
  (491 líneas). El `reviewer` corrió `./init.sh` él mismo con `INIT_EXIT=0`, 323
  e2e pasados, lint y typecheck verdes y Postgres publicando puerto: **la suite
  está verde y aun así se rechaza**, porque lo que está verde no prueba lo que
  dice probar. Cuatro defectos:
  - **B1 (grave)** — R13, R16, R17 y R18 comparten un solo `describe.each` que
    mockea `NUTRITION_REPOSITORY`, llama al use-case a mano y no hace ninguna
    petición HTTP: sin base de datos y sin HTTP. `setAiExplanation` no se ejecuta
    contra Postgres en ninguna suite, y su test unitario no asevera el argumento
    del `where` — cambiar `eq(id, planId)` por `eq(petId, planId)` dejaría todo
    verde. R18, que la spec define como "sin esto la feature no está
    implementada", no observa ninguna de las tres cosas que dice observar.
  - **B2** — `NUTRITION_AI_MAX_RETRIES` no existe: `maxRetries: 0` va a mano y el
    test asevera `toContain('maxRetries: 0')`, la aserción **inversa** a la que
    pide R9. El párrafo de C-2 explica por qué ese 0 es load-bearing (sin él,
    3 × 15 s cruza el corte de 29 s y produce el 504 que la feature promete no
    producir).
  - **B3** — falta `message` en los tres `warn`; en el `catch` se sustituyó por
    `errorName`, así que el mensaje del proveedor no se loguea nunca. Muerde justo
    donde la enmienda de R10 quería morder: el diagnóstico de la prueba de humo.
  - **B4** — `docs/verification.md` omite el paso 3 de R19 (el que prueba la
    degradación con el cableado real) y su paso 4 deja la clave real en el `.env`.
  Lo que sí quedó impecable: las dos enmiendas respetadas al pie de la letra, la
  derogación de R26 de #17 aserción por aserción, y ningún camino por el que un
  test llegue a la red.
- **Enmienda O5 (2026-08-18)**: R10 decía "sin `trim` destructivo" y la
  implementación recorta espacios. Recortar los extremos no es destructivo; se
  aclara la frase de la spec y **no** se toca el código.
- **Handoff de la ronda 2 escrito** →
  `progress/handoff_nutrition-ai-explainer_r2.md`, con B1..B4, los menores O1/O3/O4
  y lo decidido por el `leader` para que Codex no lo re-abra (O5 y O2).

- **Ronda 2 de revision: APROBADA** -> `progress/review_nutrition-ai-explainer_r2.md`
  (446 lineas). Los cuatro defectos B1..B4 cerrados de verdad, no de nombre. El
  `reviewer` volvio a correr `./init.sh` el mismo (`INIT_EXIT=0`, 323 e2e, 1144
  unitarios, lint y typecheck verdes, Postgres publicando puerto) y **no aprobo
  por verde: aprobo por mutacion**.
  - **B1 verificado con tres mutaciones en codigo de produccion**, cada una mata
    los R-ids que le tocan: `eq(nutritionPlans.id, planId)` -> `eq(...petId...)`
    en el repositorio tumba R13/R16/R18 mas el unitario (en la ronda 1 esa misma
    mutacion dejaba la suite entera verde); `aiExplanation: plan.aiExplanation`
    -> `null` en el mapper tumba R13/R17/R18; borrar el early return de
    `generate-nutrition-plan.use-case.ts:63` tumba **solo** R16, en la asercion
    `expect(explain).toHaveBeenCalledTimes(1)` que sostiene el no-doble-cobro.
  - Los cuatro e2e nuevos hacen peticiones HTTP reales y tocan Postgres;
    `NUTRITION_REPOSITORY` ya no se sobrescribe en ninguna parte del archivo, solo
    `NUTRITION_EXPLAINER` y `SUBSCRIPTION_REPOSITORY`. El `describe.each`
    desaparecio: un `describe` por requisito.
  - **Nacen verdes** (commits `test(...)` sin `feat` detras) — excepcion a C4
    autorizada en el handoff y **validada**: cada uno tiene su verdugo
    (R13->M1/M2, R16->M1/M3, R17->M2, R18->M1/M2).
  - Historial rojo->verde de R9/R10/R11 comprobado commit a commit, no por el
    mensaje: en cada commit de test la implementacion de ese commit falla de
    verdad.
  - **N1**: el conteo de e2e no se movio (323 -> 323) — cuatro casos borrados,
    cuatro `describe` nuevos. El mejor argumento de esta feature contra usar el
    numero verde como criterio.
  - **N2** (residual, teorico): el `message` del `catch` es `error.message` del
    proveedor. Si OpenAI devolviera un 400 que eche de vuelta un fragmento del
    cuerpo, ese fragmento entraria al log. La clave no (va en cabecera, y el test
    lo asevera). Mirarlo cuando el humano corra R19 y vea un 400 real.
- **Flake de R12 de `health-vaccines`: NO se reprodujo.** Van dos corridas
  consecutivas sin verlo (infra caliente, 33 min arriba). No hay evidencia nueva
  para abrirlo como bug; el `SELECT` sigue sin `ORDER BY`, asi que el riesgo
  latente sigue ahi, solo no se manifiesta.

## Siguiente

**PARADA: gate humano de R19.** El trabajo de Codex esta aprobado, pero **#18 no
se cierra** hasta que el humano corra la prueba de humo con la clave real de
OpenAI siguiendo los cuatro pasos de `docs/verification.md:291-308` y marque la
casilla de `specs/nutrition-ai-explainer/requirements.md:785`. Esa prueba cuesta
dinero: no la corre ninguna IA.

Cuando este marcada, cierre de #18: `status: "done"` en `feature_list.json`
(30/30), STATUS.md, mover este archivo a `progress/history.md`, `./init.sh`, push
y `env -u GITHUB_TOKEN gh pr create`. El merge lo hace el humano.
