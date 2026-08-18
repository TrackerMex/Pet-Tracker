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

## Siguiente

**PARADA: le toca al humano correr Codex CLI** con el bloque de
`progress/handoff_nutrition-ai-explainer.md`. Mientras implementa, Claude no
toca `backend-pet-tracker/`.

Cuando el humano confirme que Codex terminó: leer
`progress/impl_nutrition-ai-explainer.md` y lanzar el `reviewer`. Ojo con el
cierre: además del veredicto aprobado, #18 necesita que el humano ejecute la
prueba de humo de R19 con la clave real y marque su casilla. Con las dos cosas,
#18 se marca `done` y el backlog queda en 30/30.
