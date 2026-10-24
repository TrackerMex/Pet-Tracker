---
feature: "mobile-canvas-account-flow"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, traceability]
---

# Trazabilidad — [[mobile-canvas-account-flow]]

El fichero de cada test es el que fija requirements.md en su R. F es
`src/__tests__/account-flow-canvas-fidelity.test.ts`.

| R | Tests (`it`) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `#205 R1: global.css declara text-34, radius-32 y radius-40 una sola vez` | — | — | pendiente |
| R2 | `#205 R2: el contenido apila escena, chips, marca, espaciador, CTAs y legal`; `#205 R2: el scroll usa márgenes 16 y los insets sin centrar`; `#205 R2: Main sube sus bloques a 0, 120, 200 y 280 ms como el artboard` | — | — | pendiente |
| R3 | `#205 R3: la escena es una vista de 380 con radio 32 y esquina continua`; `#205 R3: Pingo mide 220, flota y pisa la sombra del suelo`; `#205 R3: la escena y Pingo miden lo que el artboard` | — | — | pendiente |
| R4 | `#205 R4: el bocadillo flota arriba a la derecha con el pico abajo a la derecha`; `#205 R4: el bocadillo copia posición, radios y sombra del artboard` | — | — | pendiente |
| R5 | `#205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I'm Pingo.»` | — | — | pendiente |
| R6 | `#205 R6: la marca pesa 34/900, el subtítulo se limita a 300 y el legal baja 16`; `#205 R6: la marca copia tamaño, ancho y margen del artboard` | — | — | pendiente |
| R7 | `#205 R7: el contenido no lleva fundido ni muelle de entrada` | — | — | pendiente |
| R8 | `#205 R8: el scroll apila cabecera, título, cuerpo, espaciador y acciones`; `#205 R8: la burbuja es una vista con el pico abajo a la izquierda`; `#205 R8: Pingo mide 88 y gira -8 grados`; `#205 R8: Login sube a 0, 100 y 200 ms y copia radios y márgenes` | — | — | pendiente |
| R9 | `#205 R9: la cabecera no entra animada y el formulario sube con RiseIn`; `#205 R9: el scroll usa márgenes 20 y conserva el colchón inferior de 96`; `#205 R9: Registro flota, sube a 0 ms y copia márgenes y términos` | — | — | pendiente |
| R10 | `#205 R10: la escena apila fondo, Pingo y candado en 168x150`; `#205 R10: Pingo no flota y mide 120 girado 6 grados`; `#205 R10: título, cuerpo, campo y acciones siguen las medidas del artboard`; `#205 R10: Recuperar copia escena, tile y márgenes` | — | — | pendiente |
| R11 | `#205 R11: tras enviar, la escena sigue y las acciones son Reenviar y volver`; `#205 R11: RecuperarEnviado dibuja la misma escena que Recuperar` | — (el de R10) | — (el de R10) | pendiente |
| R12 | `#205 R12: el formulario apila cabecera sin flotación y cuerpo con RiseIn`; `#205 R12: el scroll arranca 56 por debajo del inset y usa márgenes 20`; `#205 R12: NuevaContrasena sube a 0 y 100 ms con Pingo de 72` | — | — | pendiente |
| R13 | `#205 R13: la tarjeta de estado es una vista de radio 16 bajo la cabecera`; `#205 R13: el éxito conserva la cabecera sin flotación`; `#205 R13: el éxito copia radio, fondo y margen del artboard` | — | — | pendiente |
| R14 | `#205 R14: la rama sin token conserva su contenedor y su título` | — (mutación plantada, ver reporte) | n/a (conservación) | pendiente |
| R15 | `#205 R15: pets/add declara solo headerShown false` | — | — | pendiente |
| R16 | `#205 R16: la cabecera es ScreenHeader con título, paso y volver`; `#205 R16: la barra de paso queda fuera del scroll`; `#205 R16: la fila de foto sube con RiseIn y Datos básicos pesa 16/900`; `#205 R16: NuevaMascota copia cabecera, entrada y sección del artboard` | — | — | pendiente |
| R17 | `#205 R17: la opción seleccionada lleva la sombra segment del canvas` | — | — | pendiente |
| R18 | `#205 R18: Datos médicos, Edad, Esterilizado y Microchip suben en ese orden`; `#205 R18: el chip elegido lleva borde acento y pastilla`; `#205 R18: el chip sin elegir lleva borde y fondo neutros`; `#205 R18: el paso 2 sube a 0, 60, 120 y 180 ms con chips de 44` | — | — | pendiente |
| R19 | `#205 R19: el paso 1 lleva Continuar en el pie, fuera del scroll`; `#205 R19: el paso 2 lleva Guardar en el pie, fuera del scroll`; `#205 R19: la celebración no pinta el pie`; `#205 R19: los dos pasos fijan la CTA abajo como el artboard` | — | — | pendiente |
| R20 | `#205 R20: la carta registra la enmienda #205` | — | — | pendiente |
