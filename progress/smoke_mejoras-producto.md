# Smoke del plan de mejoras de producto

Lote del gate G4 del plan `progress/plan_mejoras-producto-2026-10-26.md` (§5). Cada feature apunta
aquí lo que solo se ve en el teléfono. Lo recorre el humano en el dev build de Android, en su PC,
al final de cada ola. Lo que falle abre una feature de arreglo.

A diferencia del plan de paridad, la spec de #208 dice que su smoke **bloquea `done`**
(`specs/mobile-vaccine-create/requirements.md` §Aprobación). Por eso #208 se mergea en `dev` y no
pasa a `done` hasta que el humano marque su casilla aquí y en la spec.

## #212 nutrition-ai-structured-plan

Spec: `specs/nutrition-ai-structured-plan/requirements.md` (R20 y §Aprobación). Reviewer APROBADO
sobre `70971efd` (`progress/review_nutrition-ai-structured-plan.md`).

No es un smoke del teléfono: es la prueba de humo del backend con la **clave real de Anthropic**
(R20). Cuesta dinero (unas 3 llamadas a Haiku 5.5, menos de 0,01 USD), así que no se delega a
ninguna IA. Va en esta sección para que quede en el mismo lote. Esta sección va antes de #208 para
que no choque al mergear con las secciones que otras ramas añaden al final.

Los pasos están en `docs/verification.md` §Feature 212. Lo que tiene que salir:

1. El primer `POST .../nutrition-plan/generate` devuelve `aiStatus: "proposed"` y una `aiProposal`
   cuya suma de gramos cumple R9 (dentro de `dailyGrams` ±10 %).
2. Repetir el `POST` sin cambios no llama a la IA.
3. El cuarto `generate` con IA del día devuelve `aiStatus: "limit_reached"`.
4. En la BD local, `nutrition_ai_generations` queda con `count = 3`.
5. Al terminar, `.env` vuelve a `ANTHROPIC_API_KEY=PENDING` y `ANTHROPIC_ENABLED=false`.

Al terminar, marca también la casilla R20 de la spec. La casilla G2 de la spec ya está cerrada
(2026-10-27) y no depende de esta prueba.

- [ ] Prueba de humo R20 de #212 con clave real ejecutada por el humano (fecha: ____)

## #208 mobile-vaccine-create

Spec: `specs/mobile-vaccine-create/requirements.md` (§Aprobación). Reviewer APROBADO sobre
`1f3637b0` (`progress/review_mobile-vaccine-create.md`).

En el dev build de Android (no Expo Go), con una mascota propia (owner):

1. Salud: «Añadir vacuna» abre el alta. Las dos fechas, aplicación y próxima dosis, abren el
   picker nativo, y la de aplicación no deja elegir un día futuro.
2. Notas: al enfocar el campo, el teclado no lo tapa (KAV con padding).
3. Con «Recordarme la próxima dosis» encendido y una próxima dosis futura, guardar crea la vacuna
   y un recordatorio de tipo vacuna a las 09:00 locales de ese día (visible en Recordatorios).
4. La vacuna nueva aparece en la lista de Salud.

- [ ] Smoke de #208 recorrido por el humano (fecha: ____)

## #213 mobile-reminders-recurrence

Spec: `specs/mobile-reminders-recurrence/requirements.md` (§Aprobación). Reviewer APROBADO sobre
`494e9651` tras el arreglo de B1 (R21) (`progress/review_mobile-reminders-recurrence.md`, §Re-revisión). Como en #208, la spec dice que su
smoke **bloquea `done`**.

El paso 6 necesita el backend con `PUSH_ENABLED=true`.

En el dev build de Android (no Expo Go), con una mascota propia (owner):

1. Recordatorios, alta: las filas de chips de Tipo y de Aviso se deslizan en horizontal y el
   último chip no queda cortado.
2. Repetición: los steppers de horas y de meses respetan sus límites. Al cambiar de unidad, cada
   una conserva su último valor.
3. «Hasta» abre el picker nativo, y la fecha elegida se puede borrar.
4. La nota de tomas lleva el nombre de la mascota.
5. Tras guardar, la fila del recordatorio muestra la línea «Se repite…». Si vence hoy, lleva el
   badge «Hoy».
6. Crea un recordatorio que se repita cada hora. Deben llegar los push reales de dos ocurrencias
   seguidas. Tocar cada push abre Recordatorios con la mascota del push seleccionada.
7. Desde la hoja de Recordatorios, «Cancelar serie»:
   - la hoja tiene fondo surface y pide confirmación;
   - al confirmar, la serie sale de la lista.

- [ ] Smoke de #213 recorrido por el humano (fecha: ____)
