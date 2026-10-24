# Smoke del plan de paridad con el canvas

Lote de pruebas de humo de las features del plan `progress/plan_canvas-parity-2026-10-23.md`.
Cada feature apunta aquí lo que solo se ve en el teléfono (labios fuera del cuerpo, sombras,
desenfoque, hápticos, movimiento). Lo recorre el humano en el dev build de Android, en su PC, con
tema claro y oscuro, al final de cada ola. Lo que falle abre una feature de arreglo. El `done` de
cada feature no espera al smoke (plan §6).

## #197 mobile-canvas-foundations

Spec: `specs/mobile-canvas-foundations/requirements.md` (R23 y § Cierre del humano). Reviewer
APROBADO sobre `f408dbf2` (`progress/review_mobile-canvas-foundations.md`).

Pasos de R23, en dev build Android (no Expo Go), con tema claro y oscuro:

1. NuevoRecordatorio: el chip de tipo y el de antelación seleccionados muestran un labio verde de
   3 px bajo la cápsula que no pisa la fila siguiente.
2. Alertas: el botón de reconocer de una fila abierta muestra un labio gris de 3 px; rojos y ámbar
   son los nuevos (`#D92D20`, `#B54708` en claro).
3. Horario de comidas: el resumen verde tiene labio de 5 px; «Editar» mide 36 y «Añadir comida» 50,
   cada uno con su labio gris colgando y sin solaparse.
4. Nutrición, Salud, Perfil y la celebración: el título grande se lee igual que antes (el cambio de
   `tracking-tight` a `tracking-title` es de -0.025em a -0.02em).
5. Inicio: las tarjetas entran subiendo 14 px en 400 ms escalonadas; con «Quitar animaciones» del
   sistema activo aparecen sin moverse ni fundirse.

`ToggleSwitch`, `ScreenHeader` y `useShadows()` no se ven en la app (R20): su smoke va con la ola 2.

- [ ] Smoke de #197 R23 recorrido por el humano

## #200 mobile-canvas-nutrition

Spec: `specs/mobile-canvas-nutrition/requirements.md` (§ Cierre del humano). Reviewer APROBADO sobre
`2baf7cdb` (`progress/review_mobile-canvas-nutrition.md`).

Pasos de R2, R3, R4, R6, R7, R10 y R12 a R15, en dev build Android (no Expo Go), con tema claro y oscuro:

1. Nutrición con plan: el héroe morado tiene labio inferior, el anillo se llena tras una pausa breve
   y las piezas suben en cascada (plan, comidas, IA y enlaces).
2. Una franja pendiente muestra «Marcar servido» con labio. Al pulsarla pasa a la píldora verde
   «Servido» con tile verde y check, y el anillo avanza.
3. Con avisos en el plan, las tarjetas de aviso aparecen entre las comidas y la IA.
4. Los avatares están a la derecha del título, y cambiar de mascota recarga el plan.
5. En Horario, «Generar plan» lleva labio violeta. En Horario y en Historial, la flecha de la
   cabecera vuelve a Nutrición y no hay cabecera nativa duplicada.
6. Con «Eliminar animaciones» activado en Android, todo aparece sin movimiento.

- [ ] Smoke de #200 recorrido por el humano

## #198 mobile-canvas-home

Spec: `specs/mobile-canvas-home/requirements.md` (§ Cierre del humano). Reviewer APROBADO sobre
`158f4e91` (`progress/review_mobile-canvas-home.md`).

Pasos de R1, R3 a R7, R10, R11 y R13 a R16, en dev build Android (no Expo Go), con tema claro y oscuro:

1. El resumen, la tarjeta de actividad semanal y las filas de recordatorios muestran la sombra doble
   suave y no un borde duro. La tarjeta del collar y la de última posición no tienen sombra ni borde.
2. Los tres accesos rápidos muestran el labio interior de 4 px abajo, en su tono.
3. La barra del collar se ve sobre el fondo de la app: color de acento por encima de 60 y ámbar en
   60 o menos.
4. Las entradas llegan en este orden y sin saltos: resumen, collar, accesos, actividad,
   recordatorios y última posición. Con «Quitar animaciones» activado no hay movimiento.
5. Carga: el esqueleto tiene la forma del canvas y no hay salto de altura al llegar los datos.
6. Error (modo avión): disco rosa, huellas rojas, badge con «!» y «Reintentar» con icono de recarga,
   que recupera la lista.
7. El vacío y la pantalla sin collar se ven como sus artboards.

- [ ] Smoke de #198 recorrido por el humano

## #199 mobile-canvas-health-weight

Spec: `specs/mobile-canvas-health-weight/requirements.md` (§ Aprobación). Reviewer APROBADO sobre
`bd20a22a` (`progress/review_mobile-canvas-health-weight.md`).

Pasos en dev build Android (no Expo Go), con tema claro y oscuro:

1. R1: desde Salud, la flecha de Peso vuelve a Salud. Abierto por deep link en frío, vuelve a
   `/health`. El título no queda bajo la barra de estado.
2. R2: con el teclado abierto se ven el peso, la fecha, la condición y el botón de envío.
3. R5 y R6: la línea de Peso se dibuja tras unos 200 ms y la de Salud tras unos 300 ms. El punto
   final hace su pop hacia 1,3 s. Con siete meses de registros, Peso rotula seis y la mini de Salud
   muestra todo el historial.
4. R13: los avatares del selector quedan alineados con el título de Salud.
5. R23: el toast aparece bajo la cabecera tras unos 400 ms, con su sombra visible en Android.
6. R24: las entradas llegan escalonadas. Con «Quitar animaciones» todo está quieto y completo.

- [ ] Smoke de #199 recorrido por el humano
