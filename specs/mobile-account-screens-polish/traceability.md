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
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | pendiente | pendiente |
| R17 | pendiente | pendiente |
| R18 | pendiente | pendiente |
| R19 | pendiente | pendiente |
| R20 | pendiente | pendiente |
| R21 | prueba de humo en dev build de Android (humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente", salvo R21, que
se firma después de su veredicto.
Convención de commit: `test(mobile): … (Rn)` para el rojo y `feat(mobile): …
(Rn)` para el verde.

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
