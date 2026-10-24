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

## #202 mobile-canvas-zones

Spec: `specs/mobile-canvas-zones/requirements.md` (§ Cierre del humano). Reviewer APROBADO sobre
`83599961` y sobre el merge `9dcf2fb1` (`progress/review_mobile-canvas-zones.md`).

Pasos en dev build Android (no Expo Go), con tema claro y oscuro:

1. Zonas: el volver de la cabecera vuelve a Perfil (y sin historial a `/profile`). El título y el
   contador van en la misma fila. No aparece la cabecera nativa.
2. Editor, formulario: el círculo de cristal y la píldora con sombra se ven sobre el mapa, en claro
   y en oscuro. Volver regresa a Zonas.
3. Editor, ramas de estado: la cabecera va en el contenido con volver, sin cabecera nativa duplicada.
4. Diálogo de borrado en Zonas y en el editor: el velo entra con fade y la tarjeta con rise. Atrás
   de Android y el velo cierran sin borrar. «Eliminar» borra.
5. Interruptores de 48x28 en las filas y en «Activa».
6. Esqueletos de Zonas y del editor con la red lenta.
7. Teclado con la hoja: el nombre sigue visible al escribir.
8. Con «Quitar animaciones» activo no hay animaciones de entrada.

Conocido antes del smoke: los botones del diálogo no tienen feedback al pulsar (N1 del reviewer, deuda
registrada).

- [ ] Smoke de #202 recorrido por el humano
## #206 mobile-canvas-tab-bar

Spec: `specs/mobile-canvas-tab-bar/requirements.md` (§ Cierre del humano). Reviewer APROBADO sobre
`3df43a06` y sobre el delta de la errata E3 `aa942254` (`progress/review_mobile-canvas-tab-bar.md`).

Pasos en dev build Android (no Expo Go), con tema claro y oscuro:

1. (S1) Los cinco iconos se ven como trazos huecos redondeados, no como siluetas negras rellenas.
2. (S2) La cápsula proyecta una sombra suave hacia abajo.
3. (S3) El velo se lee translúcido y claro (oscuro en tema oscuro), no como una cápsula opaca.
4. (S4) La píldora verde coincide con la celda activa, sin asomar ni quedarse corta arriba o abajo.
5. (S5) Ninguna etiqueta se recorta con la escala de fuente del sistema al 100 %.
6. (S6) La pestaña activa se distingue por color, píldora y trazo más grueso.
7. (S7) Al cambiar de pestaña la píldora se desliza y aterriza centrada; con «Quitar animaciones»
   activado salta sin deslizarse.
8. (S8) TalkBack anuncia la fila como «Pestañas» y cada pestaña con su nombre y su estado
   seleccionado.

Conocido antes del smoke: las celdas de la barra no tienen feedback al pulsar (O2 del reviewer; ya
pasaba antes de #206, deuda registrada).

- [ ] Smoke de #206 recorrido por el humano

## #196 mobile-profile-photo-hero-canvas

Spec: `specs/mobile-profile-photo-hero-canvas/requirements.md` (§ Cierre del humano). Reviewer
APROBADO sobre `4e8c3134` (`progress/review_mobile-profile-photo-hero-canvas.md`).

Pasos en dev build Android (no Expo Go), con tema claro y oscuro:

1. (R1/R2) Perfil abre con la foto a sangre de 430, sin hueco arriba. El título «Perfil» blanco se
   lee sobre la foto gracias al scrim superior, y la píldora y el selector de vidrio se distinguen.
2. (R3) Nombre y chips quedan al pie, sobre el degradado, legibles en los dos temas. Con nombres
   largos los chips bajan de línea sin salirse.
3. (R4) La cámara aparece con el `pop` tras la foto y su labio se ve bajo el círculo. Abrir el
   selector de imágenes desde ella funciona.
4. (R5) Con las notificaciones bloqueadas en ajustes del sistema, el aviso ámbar sale arriba.
   «Abrir configuración» lleva a los ajustes de la app, y el interlineado del texto es 20 px aprox.
5. (R6) «Cerrar sesión» es la píldora rosa de 52 con texto rojo de 15 y cierra la sesión.
6. (R7) El interruptor de tema cambia de tema con el fundido de hoy.
7. (R9) Con «Quitar animaciones» activado en Android, todo aparece sin movimiento.

Conocido antes del smoke: la cámara y «Añadir mascota» no tienen feedback al pulsar (N3 del
reviewer; ya pasaba antes de #196, deuda registrada).

- [ ] Smoke de #196 recorrido por el humano

## #204 mobile-canvas-routine

Spec: `specs/mobile-canvas-routine/requirements.md` (§ Cierre del humano, R18). Reviewer APROBADO
sobre `2b50c0fe` (`progress/review_mobile-canvas-routine.md`).

Pasos en dev build Android (no Expo Go), con al menos una mascota, tres recordatorios (uno a menos de
10 días) y dos documentos, en tema claro y oscuro:

1. Recordatorios desde Perfil no tiene cabecera nativa. Volver, «Recordatorios» y «Nuevo» quedan en
   una fila bajo la barra de estado, sin solaparse con ella.
2. Volver regresa a Perfil. Sin historial (enlace profundo o recarga en la ruta), volver también
   lleva a Perfil.
3. Las filas suben escalonadas, unos 70 ms entre una y otra. Con «Quitar animaciones» activado,
   entran sin animación.
4. La fila próxima lleva borde ámbar claro y el badge «¡Próximo!» en ámbar con texto legible.
5. «Eliminar» de fila es rosa, de 44 px de alto, con texto rojo 13/800. Al pulsarlo se abre la hoja,
   cuyo «Eliminar» rojo lleva un labio oscuro de 4 px y mide como «Cancelar».
6. Agregar recordatorio desde «Nuevo»: volver y título de 24 en el contenido, y «Guardar
   recordatorio» pegado al pie con la pantalla vacía. Al abrir el teclado en Título, el campo y el
   botón siguen visibles sin hueco extra encima del teclado.
7. Volver de Agregar regresa a Recordatorios, también sin historial.
8. Documentos desde Perfil muestra volver, «DOCUMENTOS DE» y el nombre. Mientras carga, un
   esqueleto ocupa el nombre. Las filas suben escalonadas, unos 60 ms. Con el formulario de subida
   abierto, el teclado no tapa el campo enfocado.
9. En una cuenta sin mascotas, Recordatorios muestra a Pingo centrado y un volver arriba a la
   izquierda que funciona.

- [ ] Smoke de #204 recorrido por el humano
