# Smoke del plan de mejoras de producto

Lote del gate G4 del plan `progress/plan_mejoras-producto-2026-10-26.md` (§5). Cada feature apunta
aquí lo que solo se ve en el teléfono. Lo recorre el humano en el dev build de Android, en su PC,
al final de cada ola. Lo que falle abre una feature de arreglo.

A diferencia del plan de paridad, la spec de #208 dice que su smoke **bloquea `done`**
(`specs/mobile-vaccine-create/requirements.md` §Aprobación). Por eso #208 se mergea en `dev` y no
pasa a `done` hasta que el humano marque su casilla aquí y en la spec.

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
