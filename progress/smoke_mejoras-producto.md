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

## #214 mobile-pet-members

Spec: `specs/mobile-pet-members/requirements.md` (§Aprobación). Reviewer APROBADO sobre `2a00094f`
tras dos merges de `dev` y la enmienda 1 de R13 (`progress/review_mobile-pet-members.md`, §Tercera
revisión). Como en #208, la spec dice que su smoke **bloquea `done`**.

Necesita el **rebuild del dev build**: #214 añade `expo-clipboard`, un módulo nativo. Sin rebuild,
la pantalla de invitación falla al abrirse (paso 2) con «Cannot find native module
'ExpoClipboard'», antes de llegar a «Copiar código».

Hacen falta dos cuentas, A (dueña de la mascota) y B (sin esa mascota), cada una en su teléfono o
una tras otra. Para probar la entrada desde Inicio del paso 6, B no debe tener ninguna mascota.

En el dev build de Android (no Expo Go):

1. Cuenta A, Perfil: la tarjeta «Familia» dice «Solo tú cuidas a <mascota>». Al tocarla se abre
   Familia, con A en la fila «Dueño».
2. «Invitar a alguien» crea el código y abre la pantalla de invitación, con el código (10 letras y
   números con guion), la línea «Vence el … · sirve una sola vez» y el mensaje que se enviará.
3. «Copiar código» muestra «Código copiado». Pegar en otra app da el código exacto.
4. «Compartir» abre la hoja nativa de Android con el mensaje y el código.
5. De vuelta en Familia, la invitación sale en «Invitaciones pendientes». La nota «Cada código sirve
   una sola vez. Si nadie lo usa, vence solo.» parte la línea dentro de su caja, sin salirse
   (menor 4 de la segunda revisión).
6. Cuenta B: «Unirme con código» desde Perfil. Desde Inicio solo sale si B no tiene ninguna
   mascota (R7). Al escribir el código y pulsar «Unirme», B entra en la mascota y la ve en Inicio.
7. Cuenta B, Familia: ve la vista de familia, sin acciones de dueño. «Salir de esta mascota» pide
   confirmación y, al confirmar, la mascota sale de su lista.
8. Invita y une otra vez a B. Cuenta A, Familia: «Quitar» en la fila de B pide «¿Quitar a <B>?».
   Al confirmar, B sale de la lista y el subtítulo de la tarjeta vuelve a «Solo tú cuidas a …».
9. Cuenta A: invita otra vez y no uses el código (B ya gastó los de los pasos 2 y 8). Revocar esa
   invitación la quita. Si era la única, desaparece la sección «Invitaciones pendientes» entera
   (R12).

- [ ] Smoke de #214 recorrido por el humano (fecha: ____)

## #216 mobile-role-aware-actions

Spec: `specs/mobile-role-aware-actions/requirements.md` (§Aprobación). Reviewer APROBADO sobre `0bb40b8d`
(`progress/review_mobile-role-aware-actions.md`). Como en #208 y #214, la spec dice que su smoke
**bloquea `done`**.

No necesita rebuild propio: #216 no añade módulos nativos. Usa el mismo dev build que #214.

Hacen falta dos cuentas de la misma mascota: A (dueña) y B (`family`). B se une con el código de
invitación de #214 (pasos 2 y 6 del smoke de #214). Para el paso 5, la mascota no debe tener
collar al principio; para el paso 6, A vincula uno.

En el dev build de Android (no Expo Go), primero con la cuenta B:

1. Inicio: los accesos rápidos son solo «Peso» y «Documentos», en ese orden. No sale
   «Recordatorio». Cada tile conserva su color y abre su pantalla de siempre.
2. Inicio, tarjeta del collar (mascota sin collar): se ve el estado, pero no el enlace «Vincular
   collar».
3. Peso: se ven la cabecera, la gráfica y el historial, pero no el formulario de alta.
4. Recordatorios: no sale «Nuevo» en la cabecera. Con la lista vacía, el vacío sale sin botón. Con
   recordatorios creados por A, ninguna fila tiene el botón de borrar ni el de cancelar la serie,
   y la línea de repetición de una serie sigue saliendo.
5. Vincular collar (mascota sin collar): en lugar del formulario sale la nota «Solo el dueño puede
   vincular un collar.», centrada, bajo el héroe.
6. Vincular collar (después de que A vincule un collar): se ven el título y la tarjeta de estado
   del collar, pero no «Desvincular».

Con la cuenta A, los mismos seis puntos: A lo ve todo («Recordatorio», «Vincular collar», el
formulario de Peso, «Nuevo», los botones de las filas, el formulario de vincular y
«Desvincular»).

- [ ] Smoke de #216 recorrido por el humano (fecha: ____)
