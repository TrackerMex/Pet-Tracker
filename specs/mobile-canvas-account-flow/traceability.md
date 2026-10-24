---
feature: "mobile-canvas-account-flow"
status: approved
tags: [mobile, traceability]
---

# Trazabilidad — [[mobile-canvas-account-flow]]

El fichero de cada test es el que fija requirements.md en su R. F es
`src/__tests__/account-flow-canvas-fidelity.test.ts`.

| R | Tests (`it`) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `#205 R1: global.css declara text-34, radius-32 y radius-40 una sola vez` | `481c1f35` | `5317fbfe` | cubierto |
| R2 | `#205 R2: el contenido apila escena, chips, marca, espaciador, CTAs y legal`; `#205 R2: el scroll usa márgenes 16 y los insets sin centrar`; `#205 R2: Main sube sus bloques a 0, 120, 200 y 280 ms como el artboard` | `75025c9b` | `19eb5895` | cubierto |
| R3 | `#205 R3: la escena es una vista de 380 con radio 32 y esquina continua`; `#205 R3: Pingo mide 220, flota y pisa la sombra del suelo`; `#205 R3: la escena y Pingo miden lo que el artboard` | `31d5076f` | `eda99bc9` | cubierto |
| R4 | `#205 R4: el bocadillo flota arriba a la derecha con el pico abajo a la derecha`; `#205 R4: el bocadillo copia posición, radios y sombra del artboard` | `b75bf3f2` | `ff55d4af` | cubierto |
| R5 | `#205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I'm Pingo.»` | `e39a284d` | `c4b835ba` | cubierto |
| R6 | `#205 R6: la marca pesa 34/900, el subtítulo se limita a 300 y el legal baja 16`; `#205 R6: la marca copia tamaño, ancho y margen del artboard` | `506364d8` | `f9e70abb` | cubierto |
| R7 | `#205 R7: el contenido no lleva fundido ni muelle de entrada` | `78612043` | `121b825e` | cubierto |
| R8 | `#205 R8: el scroll apila cabecera, título, cuerpo, espaciador y acciones`; `#205 R8: la burbuja es una vista con el pico abajo a la izquierda`; `#205 R8: Pingo mide 88 y gira -8 grados`; `#205 R8: Login sube a 0, 100 y 200 ms y copia radios y márgenes` | `e782c6e6` | `68c0f5f5` | cubierto |
| R9 | `#205 R9: la cabecera no entra animada y el formulario sube con RiseIn`; `#205 R9: el scroll usa márgenes 20 y conserva el colchón inferior de 96`; `#205 R9: Registro flota, sube a 0 ms y copia márgenes y términos` | `2f12fa97` | `014eadf1` | cubierto |
| R10 | `#205 R10: la escena apila fondo, Pingo y candado en 168x150`; `#205 R10: Pingo no flota y mide 120 girado 6 grados`; `#205 R10: título, cuerpo, campo y acciones siguen las medidas del artboard`; `#205 R10: Recuperar copia escena, tile y márgenes` | `8ea3811d` | `05e29c8f` | cubierto |
| R11 | `#205 R11: tras enviar, la escena sigue y las acciones son Reenviar y volver`; `#205 R11: RecuperarEnviado dibuja la misma escena que Recuperar` | `8ea3811d` (el de R10) | `05e29c8f` (el de R10) | cubierto |
| R12 | `#205 R12: el formulario apila cabecera sin flotación y cuerpo con RiseIn`; `#205 R12: el scroll arranca 56 por debajo del inset y usa márgenes 20`; `#205 R12: NuevaContrasena sube a 0 y 100 ms con Pingo de 72` | `e61b5161` | `d27420bc` | cubierto |
| R13 | `#205 R13: la tarjeta de estado es una vista de radio 16 bajo la cabecera`; `#205 R13: el éxito conserva la cabecera sin flotación`; `#205 R13: el éxito copia radio, fondo y margen del artboard` | `e5583a65` | `7cdeacf6` | cubierto |
| R14 | `#205 R14: la rama sin token conserva su contenedor y su título` | `5ebad8e9` (nace verde; rojo probado con mutaciones plantadas, ver reporte) | n/a (conservación) | cubierto |
| R15 | `#205 R15: pets/add declara solo headerShown false` | `5ea3175b` | `db12fbda` | cubierto |
| R16 | `#205 R16: la cabecera es ScreenHeader con título, paso y volver`; `#205 R16: la barra de paso queda fuera del scroll`; `#205 R16: la fila de foto sube con RiseIn y Datos básicos pesa 16/900`; `#205 R16: NuevaMascota copia cabecera, entrada y sección del artboard` | `c0e67615` | `be76458c` | cubierto |
| R17 | `#205 R17: la opción seleccionada lleva la sombra segment del canvas` | `6a4ff644` | `348d6def` | cubierto |
| R18 | `#205 R18: Datos médicos, Edad, Esterilizado y Microchip suben en ese orden`; `#205 R18: el chip elegido lleva borde acento y pastilla`; `#205 R18: el chip sin elegir lleva borde y fondo neutros`; `#205 R18: el paso 2 sube a 0, 60, 120 y 180 ms con chips de 44` | `4742f8d2` | `ce6da7ac` | cubierto |
| R19 | `#205 R19: el paso 1 lleva Continuar en el pie, fuera del scroll`; `#205 R19: el paso 2 lleva Guardar en el pie, fuera del scroll`; `#205 R19: la celebración no pinta el pie`; `#205 R19: los dos pasos fijan la CTA abajo como el artboard` | `bcc1c333`; tipado en `c058e5b0` | `a7843c65` | cubierto |
| R20 | `#205 R20: la carta registra la enmienda #205` | `d3461642` | `21325c33` | cubierto |
