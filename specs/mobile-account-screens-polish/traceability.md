---
feature: "mobile-account-screens-polish"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-account-screens-polish]] (#172)

> Rutas relativas a `mobile-pet-tracker/`. Base congelada `b7284682`. Codex
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
| R19 | prueba de humo en dev build de Android (humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente", salvo R19, que
se firma después de su veredicto.
Convención de commit: `test(mobile): … (Rn)` para el rojo y `feat(mobile): …
(Rn)` para el verde.

---

## Prueba de humo (R19)

En un **dev build de Android** (no Expo Go), con el idioma en español y luego
en inglés:

1. Bienvenida → Iniciar sesión. A la izquierda, encima del saludo de Pingo,
   hay un botón circular «Volver»; al pulsarlo vuelve a la bienvenida. (El
   contenido sigue centrado en vertical, como en `#61 R8`: la fila no se pega
   al borde superior; ver P5.)
2. Abre Iniciar sesión sin historial (cierra sesión desde Perfil). «Volver»
   lleva a la bienvenida.
3. En Iniciar sesión:
   - el título va alineado a la izquierda y es más grande que antes;
   - las etiquetas de los campos se ven grises y en 13 px;
   - «¿Olvidaste tu contraseña?» está a la derecha, encima del botón;
   - «Crear cuenta» ocupa todo el ancho, debajo del botón.
4. El ojo de la contraseña muestra y oculta el texto. TalkBack lee «Mostrar
   contraseña» u «Ocultar contraseña».
5. Un login con credenciales malas pinta el error con un icono rojo delante.
   Mantén pulsado el texto: se puede seleccionar.
6. En Crear cuenta:
   - Pingo flota arriba a la derecha, con «Volver» a la izquierda;
   - nombre y apellidos van en una fila a partes iguales;
   - teléfono y país van en otra fila, con el teléfono el doble de ancho (esto
     comprueba que existe `flex-2`).
7. En Crear cuenta, envía con `alex.example.com`. El campo correo se pone rojo
   y debajo sale «Ingresa un correo electrónico válido» con icono, sin llamar al
   servidor.
8. En Recuperar:
   - hay «Volver» a la izquierda, encima de Pingo;
   - Pingo flota;
   - el candado es un tile naranja con labio y el candado en blanco;
   - «Volver al inicio de sesión» ocupa todo el ancho.
9. En Nueva contraseña (enlace del correo), Pingo flota. Tras cambiar la
   contraseña, TalkBack anuncia «Contraseña actualizada» sin mover el foco.
10. Con «Quitar animaciones» activado en Ajustes de accesibilidad, Pingo no
    flota en ninguna de las tres pantallas.

- [ ] Prueba de humo superada por humano (fecha: ____, dispositivo: ____)
