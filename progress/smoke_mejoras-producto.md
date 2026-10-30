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

- [X] Prueba de humo R20 de #212 con clave real ejecutada por el humano (fecha: 2026-10-28)

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

- [X] Smoke de #208 recorrido por el humano (fecha: 2026-10-30)

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

- [X] Smoke de #213 recorrido por el humano (fecha: 2026-10-30)

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

- [X] Smoke de #214 recorrido por el humano (fecha: 2026-10-30)

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

- [X] Smoke de #216 recorrido por el humano (fecha: 2026-10-30)

## #209 mobile-nutrition-questionnaire

Spec: `specs/mobile-nutrition-questionnaire/requirements.md` (§Aprobación, errata hasta la ronda
7). Reviewer APROBADO en la tercera revisión, sobre `9c52c7d2`
(`progress/review_mobile-nutrition-questionnaire.md`). Como en #208, la spec dice que su smoke
**bloquea `done`**. Aparte queda la casilla de la enmienda de la carta (#209 R26) en
`docs/ui-guidelines.md`, que también es del humano.

No necesita rebuild propio: #209 no añade módulos nativos.

Hace falta una cuenta dueña con una mascota **sin perfil nutricional** y con al menos un peso
registrado (sin peso, generate responde «registra un peso primero»). Para el paso 7, otra cuenta
`family` de la misma mascota (flujo de #214).

En el dev build de Android (no Expo Go):

1. Nutrición: sale el vacío del perfil con Pingo y «Crear perfil nutricional». Al tocarlo se abre
   el cuestionario en «1 de 4», Actividad.
2. Actividad y Condición: Siguiente se activa solo tras elegir. En Condición, una condición de 7 o
   más abre el subpaso Peso objetivo, con el contador todavía en «2 de 4».
3. Peso objetivo y Alimento: al enfocar el campo numérico (peso objetivo, kcal/100 g) el teclado
   no tapa el campo ni el botón Siguiente (KAV). Elegir un tipo de alimento sobrescribe las kcal con
   su precarga (Seco 350, Húmedo 90, Mixto 220, Casero 130).
4. Salud: «Otra» abre un campo de texto que el teclado tampoco tapa. El chip nuevo sale con el
   texto escrito.
5. «Guardar y generar plan»: sale la pantalla Generando con los anillos de ping animados y, cuando
   el plan está listo, vuelve sola a Nutrición, que ya muestra el plan.
6. Horario: salen las píldoras del perfil y «Editar perfil». Al tocarlo, el cuestionario se abre
   con los datos guardados. Cambiar uno y guardar regenera el plan.
7. Cuenta `family`: Nutrición y Horario no muestran «Crear perfil nutricional», «Generar plan» ni
   «Editar perfil». Sale el texto de solo lectura.
8. A mitad del cuestionario, el botón atrás del sistema (o el gesto) retrocede un paso sin salir
   de la pantalla: de Alimento vuelve a Peso objetivo si la condición es 7 o más, o a Condición si
   es menor. Solo desde Actividad sale de la pantalla.
9. Pingo (F1 de la primera revisión): se ve, y no deja un hueco vacío, en el vacío de Nutrición (grande),
   junto a la burbuja del cuestionario (más pequeño en Condición) y en Generando.
10. Error de carga (F2): con el teléfono sin red, al abrir el cuestionario sale «Algo salió mal» bajo
    la barra de estado, sin solaparse con ella, y con el botón de volver, que funciona.

- [X] Smoke de #209 recorrido por el humano (fecha: 2026-10-30)

## #215 mobile-nutrition-ai-plan

Spec: `specs/mobile-nutrition-ai-plan/requirements.md` (§Smoke G4 y §Aprobación, erratas E1 y E2).
Reviewer APROBADO sobre `bfdbb6d1` (`progress/review_mobile-nutrition-ai-plan.md`).
Como en #208, la spec dice que su smoke **bloquea `done`**.

No necesita rebuild propio: #215 no añade módulos nativos.

Hace falta una cuenta dueña con una mascota con perfil nutricional y un peso registrado (flujo de
#209). Para el paso 4, una mascota sin collar vinculado.

**Los pasos 3 y 5 necesitan una propuesta real de la IA.** El backend local sin clave
(`ANTHROPIC_ENABLED=false`) no genera ninguna. Recórrelos en la misma sesión que la prueba R20 de
#212 (sección de arriba), con la clave puesta y la mascota con collar. Esa prueba cuesta dinero y
la decide el humano. El resto del recorrido no necesita la clave.

En el dev build de Android (no Expo Go):

1. En Horario, «Generar plan» abre «Plan de <nombre>».
2. Volver lleva a Horario.
3. Con collar y propuesta se ven la insignia violeta, las filas con «antes», «Por qué…», las
   recomendaciones, la revisión y el aviso.
4. Sin collar se ve la nota, y «Vincular collar» abre Vincular.
5. Horario y Nutrición muestran los gramos de la IA.
6. Con la navegación por gestos, el pie no tapa el contenido.
7. El botón violeta tonal «Pedir otro plan» se lee bien en claro y en oscuro.

Decisiones que quedan para el humano, fuera de este smoke:

- D1: el contador «Te quedan N de 3» no se pinta; pide un campo de backend.
- D6: el botón violeta es tonal y no sólido como en el artboard; el sólido pide un token oscuro
  que pase AA, que es una enmienda de `docs/ui-guidelines.md`.
- D7: el copy «que está bien para él» supone una mascota macho.

- [X] Smoke de #215 recorrido por el humano (fecha: 2026-10-30)
