---
feature: "mobile-account-screens-polish"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-account-screens-polish]] (#172)

> Rutas relativas a `mobile-pet-tracker/`. Base congelada `3f9a60e2`. Codex
> rellena cada fila con el hash y el mensaje de sus commits al terminar.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::#172 R1: define text-13, text-15 y text-17 con sus valores exactos dentro de @theme`; sonda S1 verificada | `3a87fac0 test(mobile): tokens de texto 13, 15 y 17 (R1)`; `67ff28c3 feat(mobile): tokens de texto 13, 15 y 17 (R1)` |
| R2 | `src/components/__tests__/back-button.test.tsx::#172 R2: es un botón de 44 con nombre accesible «Volver»`; `#172 R2: en inglés se llama «Back»`; `#172 R2: pinta ChevronLeft de 24 en foreground`; `#172 R2: con historial vuelve atrás y no reemplaza`; `#172 R2: sin historial reemplaza por el fallback`; sondas S2a/S2b verificadas | `b3fe30be test(mobile): BackButton vuelve o reemplaza (R2)`; `4cdb12db feat(mobile): BackButton (R2)` |
| R3 | `src/screens/login/index.test.tsx::#172 R3: la cabecera lleva Volver, el saludo y el título`; `src/screens/login/index.test.tsx::#172 R3: Volver de login vuelve a la bienvenida sin historial`; `src/screens/register/index.test.tsx::#172 R3: la cabecera lleva la fila Volver-Pingo y después el título`; `src/screens/register/index.test.tsx::#172 R3: Volver del registro vuelve a la bienvenida sin historial`; `src/screens/forgot/index.test.tsx::#172 R3: la fila Volver encabeza el scroll en los dos estados`; `src/screens/forgot/index.test.tsx::#172 R3: Volver de recuperar va al login sin historial`; `src/screens/register/index.test.tsx::#167 R7: la cabecera entra con rise`; S3a–S3c verificadas. | `29e2acf6 test(mobile): fila Volver en login, registro y recuperar (R3)`; `984043e1 feat(mobile): fila Volver en login, registro y recuperar (R3)` |
| R4 | `src/components/__tests__/pingo-float.test.tsx::#172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle`; `src/components/__tests__/pingo-float.test.tsx::#172 R4: con reduce motion no se mueve`; `src/components/__tests__/pingo-float.test.tsx::#172 R4: pasa testID y children`; `src/theme/__tests__/motion.test.ts::#172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de 1500 ms ease-in-out`; `src/theme/__tests__/motion.test.ts::no exporta nada más`; E2 y tipado corregidos; S4a–S4e verificadas. | `e31582c3 test(mobile): Pingo flota 10 px en 3 s en cuenta (R4)`; `75f849a6 test(mobile): orden de sort en el inventario de motion (R4)`; `edf99020 test(mobile): tipa translateY en el candado de Pingo (R4)`; `c12c676f feat(mobile): Pingo flota 10 px en 3 s en cuenta (R4)` |
| R5 | `src/screens/register/index.test.tsx::#172 R5: Pingo del registro flota`; `src/screens/forgot/index.test.tsx::#172 R5: Pingo de recuperar flota`; `src/screens/reset-password/index.test.tsx::#172 R5: Pingo de nueva contraseña flota en el formulario y en el éxito`; `src/screens/forgot/index.test.tsx::#167 R9: Pingo precede al tile del candado en el formulario`; `src/screens/forgot/index.test.tsx::#167 R9: Pingo precede al tile del candado tras enviar`; `src/screens/reset-password/index.test.tsx::#167 R10: la cabecera lleva a Pingo y después el título`; `src/screens/reset-password/index.test.tsx::#167 R10: el éxito conserva la cabecera del formulario`; S5 verificada. | `1b4551c7 test(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)`; `60d26f5c feat(mobile): Pingo flota en registro, recuperar y nueva contraseña (R5)` |
| R6 | `src/screens/login/index.test.tsx::#172 R6: el título de la cabecera pesa 30/900 al inicio`; `src/screens/register/index.test.tsx::#172 R6: el título de la cabecera pesa 30/900 al inicio`; `src/theme/__tests__/font-registration.test.ts::#172 R6: carga Inter ExtraBold y la expone como font-extrabold`; `src/__tests__/account-screens-polish.test.ts::#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta`; `src/screens/login/index.test.tsx::#167 R6: la burbuja dice el saludo en español`; `src/screens/reset-password/index.test.tsx::#167 R10: el texto de éxito es tinta accent-strong y seleccionable`; S6a–S6c verificadas. | `b8384616 test(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)`; `4b5675c6 feat(mobile): recetas de texto e Inter ExtraBold en cuenta (R6)` |
| R7 | `src/screens/login/index.test.tsx::#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro`; `src/screens/login/index.test.tsx::#172 R7: con error, el error va entre el olvido y el envío`; `src/screens/login/index.test.tsx::#172 R7: sin error, el cuerpo no lleva el error`; `src/__tests__/account-screens-polish.test.ts::#172 R7: los enlaces de login y recuperar llevan su receta`; S7 verificada. | `36f46603 test(mobile): enlaces y orden del cuerpo de login (R7)`; `7d56bacb feat(mobile): enlaces y orden del cuerpo de login (R7)` |
| R8 | `src/screens/login/index.test.tsx::#172 R8: la contraseña de login lleva su ojo`; `src/screens/register/index.test.tsx::#172 R8: %s lleva su propio ojo`; `src/screens/reset-password/index.test.tsx::#172 R8: %s lleva su propio ojo`; `src/components/__tests__/password-input.test.tsx::#172 R8: arranca oculta con «Mostrar contraseña» y el ojo`; `src/components/__tests__/password-input.test.tsx::#172 R8: el ojo alterna mostrar y ocultar`; `src/components/__tests__/password-input.test.tsx::#172 R8: en inglés dice «Show password» y «Hide password»`; `src/components/__tests__/password-input.test.tsx::#172 R8: el grupo envuelve el campo de 52 y el botón de 44`; Los it.each cubren ambos campos de registro y ambos de reset; S8a–S8d verificadas. | `1ad828d3 test(mobile): mostrar y ocultar la contraseña en cuenta (R8)`; `45e4c40e feat(mobile): mostrar y ocultar la contraseña en cuenta (R8)` |
| R9 | `src/screens/login/index.test.tsx::#172 R9: el error de login va con icono en su fila`; `src/screens/forgot/index.test.tsx::#172 R9: el error de recuperar va con icono en su fila`; `src/screens/reset-password/index.test.tsx::#172 R9: el error de nueva contraseña va con icono en su fila`; `src/components/__tests__/form-error.test.tsx::#172 R9: la fila lleva el icono y después el texto`; `src/components/__tests__/form-error.test.tsx::#172 R9: el icono mide 14 y usa danger`; `src/components/__tests__/form-error.test.tsx::#172 R9: el texto pesa 13/600 en danger, es seleccionable y dice el mensaje`; `src/screens/register/index.test.tsx::#167 R8: el error general va en una fila con icono`; `src/screens/register/index.test.tsx::#167 R8: el texto del error pesa como el icono`; S9a–S9c verificadas. | `28ad44aa test(mobile): FormError con icono y texto seleccionable (R9)`; `e1dcae38 feat(mobile): FormError en las cuatro pantallas de cuenta (R9)` |
| R10 | `src/screens/register/index.test.tsx::#172 R10: cada campo con error lleva icono y texto seleccionable`; `src/screens/register/index.test.tsx::#172 R10: sin errores ningún campo pinta mensaje`; `src/__tests__/account-screens-polish.test.ts::#172 R10: los siete campos del registro marcan isInvalid`; Gates c21/c22 verdes; S10a/S10c verificadas. Pendiente: S10b produjo otro it rojo, requiere reconciliar la spec antes de continuar. | `ca1bac6b test(mobile): errores por campo del registro con icono (R10)`; `14c69144 feat(mobile): errores por campo del registro con icono (R10)` |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas`; `#172 R16: declara las claves de cuenta en los dos idiomas y su registro`; sonda S16c verificada. Pendiente: T17/c32 y sondas S16a/S16b | `c1bd4a6a test(mobile): claves de Volver, del ojo y País (R16)`; `505332c9 feat(mobile): claves de Volver, del ojo y País (R16)`; c32 pendiente |
| R17 | pendiente | pendiente |
| R18 | pendiente | pendiente |
| R19 | pendiente | pendiente |
| R20 | pendiente | pendiente |
| R21 | prueba de humo en dev build de Android (humano) | pendiente (humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente", salvo R21, que
se firma después de su veredicto.
Convención de commit: `test(mobile): … (Rn)` para el rojo y `feat(mobile): …
(Rn)` para el verde.

**Bloqueo inicial T4/c8 resuelto en Reanudación 1.** E2, firmada por humano,
corrige el orden de `.sort()` en c7b. C8 y sus sondas pasan; se ejecutaron
c9–c22 en orden, con rojo y verde separados. Hubo un commit de tests
adicional que corrige solo el tipado de translateY (R4), sin cambiar aserciones.

**Bloqueo actual T11/S10b.** Tras el gate verde de c22, S10b produjo un rojo
distinto del prescrito: falla `#172 R10: cada campo con error lleva icono y
texto seleccionable` por texto vacío, mientras `#172 R10: sin errores ningún
campo pinta mensaje` sigue verde. `FieldError` devuelve null cuando isInvalid
es false. No se ajustó la sonda ni el test para cuadrar. Todas las mutaciones
están revertidas; T12–T22 no se empezaron. La salida exacta, el diagnóstico y
los commits constan en `progress/impl_mobile-account-screens-polish.md`
§Reanudación 1. La feature sigue incompleta y R21 pendiente (humano).

Spec y Enmienda #172 aprobadas en Notion
(https://app.notion.com/p/3f86115a9b27815b91d6ec6acd75a969): `Estado del gate` =
Aprobado y las dos casillas marcadas, última edición 2026-10-13T18:43Z. La
casilla del bloque de §Enmienda a la carta ya va marcada, así que R18 la copia
marcada; su candado acepta `[ xX]`.

---

## Prueba de humo (R21)

En un **dev build de Android** (no Expo Go), con el idioma en español y luego
en inglés:

1. Bienvenida → Iniciar sesión. Arriba del todo, a la izquierda, hay un botón
   circular «Volver» («Back» en inglés); al pulsarlo vuelve a la bienvenida.
   El contenido ya no se centra en vertical: la cabecera arranca arriba y el
   botón «Iniciar sesión» queda abajo, pegado al pie.
2. Abre Iniciar sesión sin historial (cierra sesión desde Perfil). «Volver»
   lleva a la bienvenida.
3. En Iniciar sesión:
   - el título va alineado a la izquierda y es más grande que antes;
   - las etiquetas de los campos se ven grises y en 13 px;
   - «¿Olvidaste tu contraseña?» está a la derecha, encima del botón;
   - «Crear cuenta» ocupa todo el ancho, debajo del botón;
   - el texto del botón se ve más grueso que el resto (Inter ExtraBold).
4. Los cinco ojos funcionan: uno en Iniciar sesión, dos en Crear cuenta y dos
   en Nueva contraseña. Cada ojo muestra y oculta solo su campo. TalkBack lee
   «Mostrar contraseña» u «Ocultar contraseña» («Show password» / «Hide
   password» en inglés).
5. Un login con credenciales malas pinta el error con un icono rojo delante.
   Mantén pulsado el texto: se puede seleccionar.
6. En Crear cuenta:
   - «Volver» va a la izquierda y Pingo flota a la derecha, en la misma fila;
   - nombre y apellidos van en una fila a partes iguales;
   - teléfono y país van en otra fila, con el teléfono el doble de ancho (esto
     comprueba que existe `flex-2`);
   - la etiqueta del país dice «País» («Country» en inglés), sin «(código de 2
     letras)»;
   - con el teclado cerrado, el botón «Crear cuenta» queda al pie tras
     desplazar hasta abajo.
7. En Crear cuenta, envía con `alex.example.com`. El campo correo se pone rojo
   y debajo sale «Ingresa un correo electrónico válido» con icono, sin llamar al
   servidor.
8. En Recuperar:
   - hay «Volver» arriba a la izquierda, encima de Pingo;
   - el bloque sigue centrado en horizontal, pero ya no en vertical: el botón
     queda al pie;
   - el candado es un tile naranja con labio y el candado en blanco;
   - «Volver al inicio de sesión» ocupa todo el ancho;
   - tras enviar, en «Revisa tu correo», el botón de reenviar queda al pie.
9. En Nueva contraseña (enlace del correo):
   - la cabecera (Pingo y título) va alineada a la izquierda;
   - las etiquetas son grises y el botón lleva Inter ExtraBold;
   - debajo del botón hay un enlace «Volver al inicio de sesión» que lleva a
     Iniciar sesión;
   - un token caducado pinta el error con icono rojo delante;
   - tras cambiar la contraseña, TalkBack anuncia «Contraseña actualizada» sin
     mover el foco, y el enlace de vuelta queda al pie.
10. Abre Nueva contraseña sin token (enlace roto). La pantalla se ve como
    antes: centrada en vertical y en horizontal.
11. Pingo flota en Crear cuenta, Recuperar y Nueva contraseña, con un vaivén
    suave de unos 10 px y unos 3 s por ciclo. La bienvenida no cambia.
12. Con «Quitar animaciones» activado en Ajustes de accesibilidad, Pingo no
    flota en ninguna de las tres pantallas.
13. Los botones principales miden lo mismo en las cuatro pantallas (56) y los
    campos, un poco menos (52), también los de contraseña.
14. Con el teclado abierto en cada pantalla, el campo enfocado sigue a la vista
    y se puede desplazar hasta el botón, igual que antes.

- [ ] Prueba de humo superada por humano (fecha: ____, dispositivo: ____)
