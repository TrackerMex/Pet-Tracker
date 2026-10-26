# Diseño ola 0 — mejoras de producto (2026-10-26)

Este es el informe del diseñador de UI para la ola 0 de
`progress/plan_mejoras-producto-2026-10-26.md`. Los artboards nuevos están en el canvas Design
«Pet Tracker: propuesta de UI» (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). El informe no
aprueba nada: el gate G1 (artboards y copy) lo cierra el humano.

## Versión del canvas

La versión final es la **140** (id `1793036268-d302`). Las versiones 135 a 140 corrigen los
artboards de Familia para alinearlos con la spec firmada de #211 (`specs/pet-members-api`). El índice `project/canvas.json` tiene 86
artboards y 22 notas. Añadí cinco filas nuevas por debajo de las que ya existían, con 80 px entre
marcos y 120 px entre filas. Cada fila lleva su nota de título:

- «Mejoras · Vacunas», en y=13904.
- «Mejoras · Cuestionario nutricional», en y=15168.
- «Mejoras · Recordatorios recurrentes», en y=16432.
- «Mejoras · Familia», en y=18960.
- «Mejoras · Plan con IA», en y=20224.

## Artboards nuevos

| Artboard | Feature | Qué muestra | Copy literal principal |
|---|---|---|---|
| SaludConAltaVacuna | #208 | Salud tal cual, con el botón «Agregar vacuna» junto al título de la sección Vacunas. Solo lo ve el dueño. | «Agregar vacuna» |
| AltaVacuna | #208 | Alta de vacuna desde el catálogo por especie (Rocky es perro). Tiene los chips del catálogo y «Otra vacuna», la fecha de aplicación y la próxima dosis propuesta y editable, las dos con el mismo campo de fecha. Lleva la casilla de recordatorio marcada por defecto, el veterinario, la clínica y las notas. | «Vacuna · esquema para perro» · «Propuse la próxima dosis con un esquema orientativo. Confírmala con el veterinario de Rocky.» · «Recordarme la próxima dosis» · «Te aviso el 6 oct 2027 a las 09:00.» · «Guardar vacuna» |
| AltaVacunaOtra | #208 | Modo de nombre libre: el chip «Otra vacuna» está activo y aparece el campo «Nombre de la vacuna» con contador de 120. La próxima dosis va vacía, porque fuera del catálogo no hay propuesta. | «Nombre de la vacuna» · «13/120» · «Elige una fecha» · «Esta vacuna no está en mi esquema, así que no propongo fecha. Pregúntale al veterinario de Rocky cuándo toca la siguiente.» |
| AltaVacunaError | #208 | El guardado falla: el formulario conserva lo escrito y sale un aviso rojo sobre el CTA. | «No pude guardar la vacuna. Tus datos siguen aquí; revisa tu conexión y vuelve a intentarlo.» |
| SaludVacunaSinRecordatorio | #208 | Éxito parcial: la vacuna ya está en la lista y un aviso ámbar dice que el recordatorio no se creó. Ofrece acceso directo a Nuevo recordatorio. No hay rollback. | «Guardé la vacuna de Rocky, pero no pude crear su recordatorio.» · «Crear ahora» |
| SaludVacunasVacioOwner | #208 | Salud sin vacunas, vista del dueño. La sección Vacunas muestra un estado vacío con el CTA y desaparece el bloque «Próxima dosis». | «Aún no hay vacunas» · «Registra la primera vacuna de Rocky y te aviso antes de cada próxima dosis.» |
| NutricionSinPerfil | #209 | Nutrición antes del cuestionario: invita a completar el perfil nutricional para generar el plan. | «Perfil nutricional» · CTA para empezar el cuestionario |
| HorarioEditarPerfil | #209 | Horario de comidas con un acceso a «Editar perfil nutricional». | «Editar perfil nutricional» |
| CuestionarioActividad | #209 | Paso 1 de 4: nivel de actividad. | Burbuja con la pregunta sobre la actividad de Rocky |
| CuestionarioCondicion | #209 | Paso 2 de 4: condición corporal en 9 niveles, cada uno con una descripción corta y su color de banda. | Textos cortos de BCS 1–9 |
| CuestionarioPesoObjetivo | #209 | Subpaso condicional del paso 2, solo si la condición corporal es 7 o más: peso objetivo. | Peso objetivo |
| CuestionarioAlimento | #209 | Paso 3 de 4: los 4 tipos de alimento, con el valor precargado de 350 para Seco. | Seco · Húmedo · Mixto · Casero |
| CuestionarioSalud | #209 | Paso 4 de 4: alergias y enfermedades en chips cerrados, más «Otra» con un campo libre de 40 caracteres. | «¿Rocky tiene alguna alergia o enfermedad? Si no tiene ninguna, déjalo todo sin marcar.» · «¿Cuál?» · «Guardar y generar plan» |
| CuestionarioGenerando | #209 | Espera mientras se genera el plan, con una checklist de tres pasos. | «Preparando el plan de Rocky» · «Estoy calculando sus calorías y el reparto de sus comidas. Tarda unos segundos.» · «Perfil guardado» · «Calculando calorías» · «Repartiendo comidas» |
| NuevoRecordatorioRepeticion | #213 | Formulario de recordatorio con «Repetición» (Una vez, Diario, Semanal, Mensual, Anual, Cada N horas) y «Hasta» opcional con el mismo campo de fecha. | «Repetición» · «Hasta» · «Opcional» · «Te aviso el día 9 de cada mes a las 20:00, hasta el 10 abr 2027.» · «Guardar recordatorio» |
| NuevoRecordatorioCadaNHoras | #213 | Variante «Cada N horas»: un stepper de 1 a 24 horas. Se oculta «Aviso» y se listan las tomas. | «Cada» · «8 horas» · «De 1 a 24 horas.» · «Te aviso en cada toma de Rocky: 08:00, 16:00 y 00:00, hasta el 13 oct 2026.» |
| RecordatoriosRecurrentes | #213 | Lista con tarjetas recurrentes que llevan icono de repetición y botón «Cancelar serie». La tarjeta puntual conserva «Eliminar». Muestra la insignia «Hoy». | «Se repite cada 8 horas · hasta el 13 oct» · «Se repite cada mes · hasta abr 2027» · «Cancelar serie» |
| RecordatoriosCancelarSerie | #213 | El mismo artboard con la hoja de confirmación abierta. | «¿Cancelar la serie?» · «No volveré a avisarte de la pipeta de Rocky. Si cambias de idea, puedes crear el recordatorio otra vez.» · «Cancelar la serie» · «Mantener la serie» |
| PerfilFamilia | #214 | Perfil con una tarjeta nueva «Familia» que lleva a la gestión de miembros. | «Familia» · «Tú y 2 personas más cuidan a Rocky» |
| FamiliaOwner | #214 | Vista del dueño. Lista los miembros con su rol (Dueño o Familia) y un botón «Quitar» en cada familiar. Debajo van las invitaciones pendientes, sin el código: el backend solo guarda su hash y la lista devuelve `{ id, role, expiresAt, createdAt }`. Cada una muestra la fecha de creación, el vencimiento y «Revocar». Al final va el CTA para invitar. | «Familia de Rocky» · «Quienes estén aquí ven a Rocky y reciben sus avisos. Solo tú puedes invitar o quitar a alguien.» · «Invitaciones pendientes» · «Invitación · creada el 6 oct» · «Vence el 9 oct a las 14:00» · «Revocar» · «Cada código sirve una sola vez. Si nadie lo usa, vence solo.» · «Invitar a alguien» |
| FamiliaInvitar | #214 | Código de un solo uso con 10 caracteres del alfabeto `23456789ABCDEFGHJKMNPQRSTVWXYZ`, mostrado en dos grupos de 5 con guion. La invitación se crea el 6 oct a las 14:00 y vence a las 72 h. Se ve la vista previa del texto que se envía; «Compartir» abre la hoja nativa de Share y «Copiar código» queda como secundario. | «K7P4Q-2M9XA» · «Vence el 9 oct a las 14:00 · sirve una sola vez» · «Ana te invita a cuidar a Rocky en Pet Tracker. Abre la app, toca «Unirme con código» y escribe K7P4Q-2M9XA. Vence el 9 oct a las 14:00.» · «Compartir» · «Copiar código» |
| FamiliaQuitarMiembro | #214 | FamiliaOwner con la hoja de confirmación abierta. | «¿Quitar a Luis Ortega?» · «Luis dejará de ver a Rocky y de recibir sus avisos. Podrás invitarlo otra vez cuando quieras.» · «Quitar a Luis» · «Cancelar» |
| FamiliaFamily | #214 | Vista de un miembro de la familia (Ana en Luna, cuya dueña es Marta). No tiene «Quitar» ni «Invitar» y ofrece salir. | «Familia de Luna» · «Marta Ruiz administra a Luna. Solo ella puede invitar o quitar personas.» · «Si sales, dejarás de ver a Luna y de recibir sus avisos.» · «Salir de esta mascota» |
| InicioVacioUnirme | #214 | Inicio sin mascotas con una segunda vía secundaria para unirse por código. | «¿Te invitaron a cuidar una mascota?» · «Unirme con código» |
| UnirmeConCodigo | #214 | Pantalla para escribir el código, con el mismo patrón que Vincular collar (input monoespaciado en mayúsculas). El valor de ejemplo es «K7P4Q-2M9XA» y el placeholder «XXXXX-XXXXX». El input admite 11 caracteres porque el backend acepta espacios y guiones y los quita. | «Unirme con código» · «Pídele el código a quien cuida a la mascota. Sirve una sola vez y vence pronto.» · «Código de invitación» · «Son 10 letras y números» · «Unirme» |
| UnirmeCodigoInvalido | #214 | Un solo error genérico para un código vencido, ya usado, revocado o inexistente. El ejemplo es «K7P4Q-2M9XB». | «Este código no funciona. Puede que haya vencido o que ya se haya usado. Pide uno nuevo a quien te invitó.» |
| UnirmeYaMiembro | #214 | El usuario ya pertenece a la familia de esa mascota. | «Ya formas parte de la familia de esta mascota. La encontrarás en Inicio.» · «Ir a Inicio» |
| PlanIA | #215 | Plan ajustado con IA. Muestra los gramos de las tres comidas existentes (08:00, 13:00 y 18:00), junto a «antes N g», y el total del día. Siguen la explicación, dos recomendaciones (el máximo es 3), la fecha de la próxima revisión y el aviso de que no sustituye al veterinario. | «Ajustado con IA · hoy, 10:20» · «Por qué cambié sus porciones» · «Esta semana Rocky se movió un 20 % menos que la anterior, así que bajé su ración a 330 g al día, 20 g menos que su plan calculado.» · «Suma un paseo corto de 15 minutos por la tarde para que recupere su actividad.» · «Si le das premios, cuéntalos dentro de los 330 g del día.» · «Próxima revisión: 13 oct 2026» · «Es una sugerencia y no sustituye la opinión de su veterinario.» · «Pedir otro plan» · «Te quedan 2 de 3 planes hoy» |
| PlanIALimite | #215 | Se alcanzó el límite de 3 planes por mascota y día. Se mantiene el último plan con IA y el botón aparece deshabilitado. | «Ya pediste 3 planes para Rocky hoy. Podrás pedir otro mañana.» |
| PlanIASinCollar | #215 | Rocky no tiene collar vinculado, así que se muestra el plan del motor (350 g al día) y un acceso a Vincular collar. | «Plan calculado · 350 g al día» · «Para ajustar el plan con IA necesito la actividad de Rocky, y eso llega desde su collar. Mientras tanto, sigue con su plan calculado.» · «Vincular collar» |
| PlanIADescartada | #215 | La propuesta de la IA se salió de los límites: se muestra el plan del motor con una nota serena. | «Esta vez la propuesta de la IA se salía de lo seguro para Rocky y no la apliqué. Sigue con su plan calculado, que está bien para él.» · «Te queda 1 de 3 planes hoy» |

## Artboards existentes tocados

Ninguno. PerfilFamilia e InicioVacioUnirme son copias nuevas de Perfil y de InicioVacio; los
originales siguen igual.

## Decisiones de diseño

- **La mascota de ejemplo es Rocky.** Es la mascota seleccionada en todas las pantallas existentes,
  y Luna aparece como segunda mascota. Por eso Luna sirve para la vista de miembro de familia
  (FamiliaFamily), donde la dueña es otra persona.
- **El «hoy» del canvas es el 6 oct 2026**, la fecha que ya usan Salud y Nuevo recordatorio.
- **La mascota-personaje no se nombra en ningún artboard nuevo** (indicación del leader por el
  cambio de nombre a Orbit). La imagen va siempre con `alt="" aria-hidden="true"` y no aparece
  «Pingo» en ningún sitio. NutricionSinPerfil heredaba `alt="Pingo"` de su fuente y lo corregí.
  Ninguna pantalla necesitó usar «Orbit».
- **Todas las entradas de fecha usan el mismo campo** (indicación del leader por la migración a
  HeroUI DateField). Es una caja de 52 px que muestra la fecha con un icono de calendario. Así
  están la fecha de aplicación y la próxima dosis de AltaVacuna, la fecha y el «Hasta» de
  NuevoRecordatorio, y el «Hasta» de Cada N horas. El «Hasta» opcional no lleva un botón propio
  para borrar: lo quité para no inventar una variante del campo.
- En el cuestionario, el peso objetivo es un subpaso condicional (condición corporal de 7 o más) y
  no cambia el contador «2 de 4».
- La condición corporal se muestra como una lista de 9 niveles con texto corto y color por banda.
  Se ven los 4 tipos de alimento, y Seco viene precargado con 350.
- CuestionarioGenerando avanza solo. Su enlace inferior existe solo para recorrer el prototipo.
- En el formulario de recordatorio, los chips de Tipo y Aviso pasan a una sola fila horizontal que
  se corta por el borde derecho, para dejar sitio a «Repetición».
- Cada N horas oculta «Aviso», porque no tiene sentido avisar un día antes de una toma, y lista
  las horas de las tomas.
- Las tarjetas recurrentes dicen «Se repite cada…» con icono de repetición y llevan «Cancelar
  serie». Las puntuales conservan «Eliminar».
- La hoja de cancelar la serie usa «Mantener la serie» en lugar de «Cancelar», para que no
  convivan dos «cancelar».
- La insignia «Hoy» sustituye a «¡Próximo!», porque solo hay exclamaciones al celebrar.
- En Familia, los roles se llaman «Dueño» y «Familia», con el término «dueño» del catálogo.
- No aparece ningún correo de miembro: solo nombres e iniciales. Solo el dueño ve «Quitar»,
  «Revocar» e «Invitar a alguien». El miembro ve la nota de quién administra y «Salir de esta
  mascota» como botón de contorno rojo.
- El texto que se comparte nombra a quien invita, a la mascota, la acción exacta de la app
  («Unirme con código»), el código y el vencimiento.
- El error de unirse es uno solo y genérico. No distingue entre vencido, usado, revocado o
  inexistente, para no filtrar información.
- Unirme con código reutiliza el patrón de Vincular collar, con su input monoespaciado y en
  mayúsculas.
- El plan con IA usa el violeta del canvas (insignia «Ajustado con IA», bloque «Por qué»,
  recomendaciones numeradas y botón violeta). El plan del motor usa una insignia gris, «Plan
  calculado».
- Los gramos van por cada comida ya existente, con «antes N g» para comparar. No se añaden ni se
  quitan comidas.
- No usé el copy «Reduce la porción de la cena a 90 g…». Las recomendaciones nuevas no repiten los
  gramos de la tabla.
- La próxima revisión se muestra como dato con el icono de calendario, no como entrada editable.
- El contador de planes restantes va bajo el botón. En PlanIALimite el botón queda deshabilitado
  y la explicación va encima.

## Preguntas abiertas para el humano

G1 se aprobó el 2026-10-26 sobre la versión 140 del canvas. El humano pidió al leader que
contestara estas preguntas con sus recomendaciones. Las respuestas de abajo son esas
recomendaciones, y la spec de cada feature móvil las adopta salvo que el humano cambie alguna
antes de que esa spec se firme.

1. ¿Qué precarga llevan Mixto y Casero? Solo Seco tiene la de 350.
   **Respuesta:** el 350 de Seco es `kcalPer100g`, no gramos. El backend admite valores de 80 a
   600 (`KCAL_PER_100G_MIN` y `KCAL_PER_100G_MAX`). Cada tipo lleva una precarga orientativa y
   editable: Seco 350, Húmedo 90, Mixto 220 y Casero 130. Así nadie se bloquea por no conocer el
   dato. La spec de #209 da estos números y el copy de ayuda del campo.
2. ¿Valen las listas cerradas de alergias y enfermedades, y el límite de 40 caracteres en «Otra»?
   **Respuesta:** sí, valen las dos cosas. El backend guarda `allergies` y `diseases` como listas
   de cadenas libres. La app envía la etiqueta en español tal como se ve, y «Otra» con lo que
   escriba el usuario, sin espacios al principio ni al final.
3. Los textos de condición corporal están escritos para perro. ¿Hace falta otra versión para gato?
   **Respuesta:** no. Usamos un solo juego de textos neutros que sirva para las dos especies. Esos
   textos hablan de costillas, cintura y abdomen, sin rasgos propios de una especie. La spec de
   #209 los da como literales.
4. ¿Es correcta las 09:00 como hora por defecto del recordatorio de la próxima dosis?
   **Respuesta:** sí.
5. ¿Solo el dueño ve «Agregar vacuna»?
   **Respuesta:** sí. `POST /pets/:petId/vaccines` lleva `@RequirePetRole('owner')`, así que un
   miembro de la familia recibiría un 403.
6. ¿Los términos mexicanos («Carne de res», «Soya») son los que queremos?
   **Respuesta:** sí.
7. ¿Valen los límites de 1 a 24 horas de «Cada N horas»? ¿Debe permitir algún aviso previo?
   **Respuesta:** los límites valen, porque coinciden con #210 D2 (`every` de 1 a 24 para `hour`).
   No hay aviso previo: «Aviso» queda oculto, como en el artboard.
8. **Respondida por el plan de UI (#220).** HeroUI Native OSS no trae DateField, así que #220
   crea uno propio (`components/date-field.tsx`) con modo date|time, min/max y opción de borrar.
   #208 y #213 lo usan en lugar de instanciar el picker a mano.
9. ¿Hace falta «cancelar solo esta vez» además de cancelar la serie?
   **Respuesta:** no. #210 solo cancela la serie entera y no tiene forma de saltar una toma. Se
   añade si alguien lo pide.
10. Para algo como una pastilla trimestral, ¿hace falta «cada N meses»? Ahora solo hay «Mensual».
    **Respuesta:** sí, porque desparasitar cada 3 meses es un caso muy común. #210 ya acepta
    `month` con `every` de 1 a 12, así que el backend no cambia. Al elegir «Mensual» aparece el
    mismo stepper de «Cada N horas», con estos textos: «Cada» · «3 meses» · «De 1 a 12 meses.».
    Con 1, la tarjeta dice «Se repite cada mes», como ahora. Con N mayor que 1, dice «Se repite
    cada N meses». No hay artboard nuevo, porque el patrón ya está dibujado.
11. **Respondida por la spec #211.** El código tiene 10 caracteres del alfabeto
    `23456789ABCDEFGHJKMNPQRSTVWXYZ`, se muestra como «K7P4Q-2M9XA» y el backend quita los espacios
    y guiones. La invitación vence a las 72 h. El backend solo guarda el hash, así que la lista de
    pendientes no muestra el código. Los artboards ya están corregidos.
12. **Respondida por la spec #211.** El 409 de «ya es miembro» no devuelve el nombre de la
    mascota, así que UnirmeYaMiembro sigue sin nombrarla.
13. ¿«Salir de esta mascota» pide confirmación? No la dibujé.
    **Respuesta:** sí. Salir no tiene vuelta atrás sin un código nuevo, así que va una hoja igual
    a la de «Quitar», con estos textos: «¿Salir de la familia de Luna?» · «Dejarás de ver a Luna y
    de recibir sus avisos. Para volver, Marta tendrá que invitarte otra vez.» · «Salir de esta
    mascota» · «Cancelar».
14. **Respondida por la spec #212, ya firmada (D9).** Sí cuenta: el plan se consume antes de
    llamar a la IA, y un fallo posterior también cuenta, porque pudo costar tokens. Coincide con
    el artboard («Te queda 1 de 3»).
15. ¿El plan con IA se aplica solo o hace falta un «Aplicar plan»? Lo dibujé ya aplicado.
    **Respuesta:** se aplica solo, como está dibujado. #212 R16 guarda la propuesta en
    `ai_proposal` sin tocar el plan del motor (`dailyGrams` no cambia) y no tiene ningún paso de
    aplicar. Un botón exigiría un endpoint nuevo. La spec de #215 decide qué pantallas muestran
    los gramos de `aiProposal` cuando existe: como mínimo, el plan y el horario de comidas, para
    que no se contradigan.
16. ¿Sin collar se oculta del todo la opción de IA o se muestra como en PlanIASinCollar?
    **Respuesta:** se muestra como en PlanIASinCollar. #212 devuelve `not_tracked` sin consumir
    del límite ni llamar a la IA, y la pantalla explica por qué y lleva a Vincular collar.
