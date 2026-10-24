---
feature: "mobile-canvas-account-flow"
status: approved
tags: [mobile, ui, design, canvas-parity]
---

# Diseño — [[mobile-canvas-account-flow]]

## Premisas contrastadas

Verificadas contra el árbol de `origin/dev` 81cb6d6b y la copia congelada, y
re-verificadas en `ee40d93d` tras #200, #198 y #199 (requirements.md E2 a E5):

- Los cimientos de #197 existen con estas firmas: `RiseIn({ delayMs, testID?, className?, children })`
  (no anima con reduce motion), `PopIn({ testID, className, style, children })`,
  `PingoFloat({ testID, children })`, `useShadows()` (`card`, `segment`),
  `ScreenHeader({ testID, backFallback, title?, eyebrow?, size?: 24 | 26, accessory? })`.
  En `ee40d93d` ya los montan pantallas de #200, #198 y #199, y #200 borró el
  candado `#197 R20` (E4): esta feature no lo toca.
- `SegmentedControl` tiene un solo consumidor: add-pet.
- `welcome.pingoGreeting` dice hoy una frase larga (es `Hola, soy Pingo. Te
  ayudo a saber dónde está y cómo está tu mascota.`), que no cabe en el
  bocadillo absoluto del canvas: de ahí D1.
- `global.css` declara `--radius-4`, `--text-24`, `--text-28`,
  `--tracking-display`, `--color-tab-pill` y, desde #199, `--text-34` (tras
  `--text-28`, E5); no declara
  `--radius-32`, `--radius-40` ni `--color-separator` (por eso D14 usa
  `bg-border`, que el repo ya usa como `border-border`).
- Las guardas de design-drift que vetan `shadow` y radios fuera de escala
  (`#175 R10`, `#179 R13`) solo miran los ficheros de sus features.
- La premisa Q04 del explore («el canvas no dibuja labio en el candado ni
  Reenviar») es **falsa**: el tile de Recuperar lleva
  `box-shadow: 0 4px 0 var(--lip)` y RecuperarEnviado dibuja `Reenviar` con
  contorno y labio gris. Producción ya los tiene; no hay delta.
- Las animaciones del canvas, medidas por cadena exacta: `rise` sin retardo ×8,
  con 60/100/120/180/200/280 ms; `pop` a 300 (×2), 500 y 600 ms; `float 3s` ×2
  (Main y Registro); `ping 2.4s` con 0/0.8/1.6 s.

## Contraste con los artboards

Literales sacados de la copia congelada `specs/mobile-canvas-account-flow/canvas/`
(versión 1792777983-cd94). Ningún artboard contiene texto con forma de orden; los
ocho son marcado con estilos en línea. `Main.dc.html` trae el marcador de diseño
`¡Guau! Soy [NOMBRE]` (no es copy: se resuelve con el nombre de la mascota de
la marca, Pingo, ver R3).

Marco común (los ocho): lienzo 390x844. Padding `56px 20px 34px` en Login,
Registro, Recuperar y RecuperarEnviado; `56px 16px 34px` en Main; `100px 20px
34px` en NuevaContrasena; `56px 20px 0` en NuevaMascota y NuevaMascota2 (CTA
fijo abajo con `padding: 16px 20px 34px`). Botón volver: 44x44, `margin-left:
-10px`, chevron de 24 con `stroke-width="2"`. Etiquetas de campo: 13/600
`--muted`, gap 6. Campos: alto 52 (Login, Recuperar, NuevaContrasena), 50
(Registro), 48 (NuevaMascota*); radio 12, borde 2 (transparente, `--accent` al
foco, `--danger` en error), fondo `--default`, padding horizontal 14, texto
500 16. CTA primario: alto 56, radio 16, `--accent`, labio `0 4px 0 var(--lip)`,
17/800. CTA texto (secundario): alto 52, 16/700 `--accent-strong`. Columna de
CTAs: gap 14. Entradas: `rise 400ms ease-out` con retardos por bloque.

| Artboard | Elemento | Canvas |
|---|---|---|
| Main | escena | alto 380, radio 32, `--surface2`, `rise` 0 ms |
| Main | anillos | 3 de 260x260, borde 2 `--accent`, `ping 2.4s` con retardos 0 / 0.8s / 1.6s |
| Main | burbuja | absoluta `top: 28px; right: 22px`, 14/700, padding `10px 14px`, radios `16px 16px 4px 16px`, `--shadow`, `pop 400ms` a 600 ms, copy `¡Guau! Soy [NOMBRE]` |
| Main | sombra del suelo | 120x14 elipse a `bottom: 30px`, `rgba(13,17,23,0.08)` |
| Main | mascota | ancho 220, `float 3s` (−10 px) |
| Main | chips | 3 chips GPS / Salud / Nutrición, gap 8, `margin-top: 24px`, padding `6px 12px`, radio 999, `--surface2`, texto 12/600 `--accent-strong`, icono 14; `rise` a 120 ms |
| Main | marca | `Pet Tracker` 34/40/900, `letter-spacing: -0.5px`; subtítulo 16/24 `--muted` max 300; bloque gap 8, `margin-top: 18px`, `rise` a 200 ms |
| Main | CTAs | `Comenzar ahora` primario; `Ya tengo una cuenta` contorno: fondo `--surface`, texto `--accent-strong` 17/700, borde 2 `--lip-gray` y labio `0 4px 0 var(--lip-gray)`; gap 14; `rise` a 280 ms |
| Main | legal | 12/16 `--muted`, `margin: 16px 0 0`, `Al continuar aceptas nuestros Términos y Política de privacidad` |
| Login | cabecera | volver; mascota 88 rotada −8°; burbuja `--surface2` 15/600/20, padding `10px 14px`, radios `16px 16px 16px 4px`, `margin-bottom: 18px`, gap 12, `margin-top: 8px`, copy `¡Qué bueno verte de nuevo!`; `rise` 0 ms |
| Login | título | `Iniciar sesión` 30/36/900, −0.5px, `margin-top: 20px` |
| Login | formulario | gap 16, `margin-top: 24px`, `rise` a 100 ms; ojo de contraseña 44x44 icono 20 `--muted`; enlace `¿Olvidaste tu contraseña?` 14/600 `--accent-strong` a la derecha |
| Login | CTAs | `Iniciar sesión` primario + `Crear cuenta` texto; `rise` a 200 ms |
| Registro | cabecera | fila volver + mascota 56 con `float 3s`; título `Crear cuenta` 30/36/900 −0.5px `margin-top: 8px` |
| Registro | formulario | gap 12, `margin-top: 18px`, `rise` 0 ms; Nombres+Apellidos en dos columnas iguales gap 12; Teléfono+País en `2fr 1fr`; campos de 50; error con icono 14 (trazo 2.4) y texto 13/600 `--danger`, copy `Ingresa un correo electrónico válido`; casilla 22x22 fila `min-height: 44px` 15/500 `Acepto los términos` |
| Registro | CTA | `Crear cuenta` primario, sin `rise` |
| Recuperar | escena | 168x150 centrada `margin-top: 16px`, `rise` 0 ms; fondo absoluto `inset: 14px 10px 0` radio 40 `--surface2`; mascota 120 rotada 6° en `left: 24px`; tile 52x52 radio 16 `--accent` con labio `0 4px 0 var(--lip)`, candado, `pop 400ms` a 300 ms |
| Recuperar | texto | `Recuperar contraseña` 28/34/900 −0.5px centrado `margin-top: 28px`; cuerpo 15/22 `--muted` max 320 `margin-top: 10px` |
| Recuperar | campo | `margin-top: 28px`, alto 52 |
| Recuperar | CTAs | `Enviar enlace de recuperación` primario + `Volver al inicio de sesión` texto |
| RecuperarEnviado | escena | idéntica a Recuperar |
| RecuperarEnviado | texto | `Revisa tu correo` 28/34/900; cuerpo `Si existe una cuenta para ana@correo.com, te enviamos un enlace…` |
| RecuperarEnviado | CTAs | `Reenviar` contorno (fondo `--surface`, borde 2 `--lip-gray`, labio `--lip-gray`, texto `--fg` 17/800) + `Volver al inicio de sesión` texto |
| NuevaContrasena | cabecera | fila gap 14: mascota 72 + `Restablecer contraseña` 28/32/900 −0.5px; `rise` 0 ms; padding superior 100 |
| NuevaContrasena | formulario | gap 16, `margin-top: 32px`, campos 52, `rise` a 100 ms |
| NuevaContrasena | éxito | `role="status"`, `margin-top: 24px`, fila gap 12, padding `14px 16px`, radio 16, `--surface2`; círculo 32 `--accent` con check blanco; texto 15/700 `--accent-strong` `Contraseña actualizada`; `pop 400ms` a 500 ms |
| NuevaContrasena | CTAs | `Actualizar contraseña` primario + `Volver al inicio de sesión` texto |
| NuevaMascota | cabecera | volver + `Nueva mascota` 24/900 `-0.02em` + `1 de 2` 13/800 `--muted`; gap 8 |
| NuevaMascota | progreso | 2 segmentos alto 6 radio 3 gap 6; activo `--accent`, resto `--lip-gray` |
| NuevaMascota | foto | botón 88 círculo, borde 2 discontinuo `--accent`, `--surface2`, icono cámara + `Elegir foto` 11/800 `--accent-strong`; burbuja radio 18 `--surface2` 13/600 con pico rotado, copy `¡Hola! Cuéntame de tu nuevo compañero.`; `rise` 0 ms |
| NuevaMascota | sección | `Datos básicos` 16/900 |
| NuevaMascota | segmentados | Tipo (Perro/Gato), Sexo (Hembra/Macho), Tamaño (Pequeño/Mediano/Grande): pista padding 4 radio 14 `--default` gap 4; opción alto 38 radio 10 14/800; seleccionada `--surface` + `--accent-strong` + sombra `0 2px 6px rgba(13,17,23,0.10)`, resto `--muted` |
| NuevaMascota | campos | Nombre (placeholder `Nombre de la mascota`) y Raza (`Opcional`) alto 48, 600 15; etiquetas 13/800 `--fg` |
| NuevaMascota | CTA | `Continuar` fijo abajo, padding `16px 20px 34px`, fondo `--bg` |
| NuevaMascota2 | cabecera | igual con `2 de 2`; progreso 2 segmentos `--accent` |
| NuevaMascota2 | secciones | `Datos médicos` 18/900 `margin-top: 12px` `rise` 0; Edad (chips `Fecha de nacimiento` / `Meses aprox.`) `rise` 60; `Esterilizado/a` (Sí/No) `rise` 120; Microchip `rise` 180; gap 16 |
| NuevaMascota2 | chips | alto 44, padding 0 16, radio 999, borde 1; seleccionado `--accent` + `--pill` 700; resto `--border` + `--default` 600; texto 14 |
| NuevaMascota2 | fecha | campo 48 con icono calendario + `15/3/2022` 15/600 |
| NuevaMascota2 | CTA | `Guardar mascota` fijo abajo |

Producción hoy y delta por artboard:

| Artboard | Hoy | Delta |
|---|---|---|
| Main | `padding: 24`, `gap: 16`, centrado vertical; `welcome-content` con fundido y muelle; escena y bocadillo como `Card`; Pingo 200 con flotación de 4; marca `text-3xl font-bold` | R2–R7: márgenes 16, cuatro `RiseIn`, espaciador, escena `View` de 380 radio 32, suelo, bocadillo absoluto con `PopIn`, Pingo 220 en `PingoFloat`, marca 34/900, copy corto |
| Login | `padding: 24`; `HomeEntrance` ×2; burbuja `Card`; título sin `testID` | R8: márgenes 20, tres `RiseIn`, burbuja `View` con pico, `login-title`, `login-actions` |
| Registro | `padding: 24`; cabecera `HomeEntrance`; `PingoFloat` | R9: márgenes 20, cabecera fija, formulario en `RiseIn` 0 |
| Recuperar | `padding: 24`, `gap: 16`; Pingo en `PingoFloat`; tile `PopIn` en flujo | R10: márgenes 20, escena 168x150 con fondo radio 40, Pingo quieto girado, tile absoluto, títulos 28, `forgot-actions` |
| RecuperarEnviado | igual que Recuperar con `forgot-resend` | R11: misma escena, acciones Reenviar + volver |
| NuevaContrasena | `HomeEntrance` ×2; `PingoFloat`; éxito como `Card` | R12–R13: `RiseIn` 0/100, Pingo 72 quieto, título 28, tarjeta `View` radio 16 |
| NuevaMascota | cabecera nativa; título y paso dentro del scroll; CTA en el scroll; segmentado con `shadow-sm` | R15–R17: `headerShown: false`, `ScreenHeader`, barra fija, `RiseIn` de intro, sombra `segment` |
| NuevaMascota2 | chips `px-3 py-2` con `bg-accent-soft`; títulos `text-lg font-bold`; CTA en el scroll | R18–R19: chips 44, `bg-tab-pill`, cuatro `RiseIn`, pie fijo |

## Supuestos

Supuestos de entorno que los tests no ven y que cierra el smoke del humano en
dev build Android (en su PC, no Expo Go):

1. `RiseIn` y `PingoFloat` respetan «Reducir movimiento» del sistema en
   dispositivo (los tests solo ven el mock de `useReducedMotion`).
2. El KAV de add-pet con `keyboardVerticalOffset={0}` sube el pie fijo sobre el
   teclado sin dejar hueco (edge-to-edge, SDK actual).
3. `usePreventRemove` sigue interceptando el volver de `ScreenHeader`
   (`router.back()`) igual que interceptaba el nativo.
4. `boxShadow` de `useShadows` se pinta en Android en el bocadillo de Main y en
   la opción del segmentado.
5. La sombra del suelo con `bg-border` se lee en claro y en oscuro.

Lista de smoke: la de requirements.md §Cierre del humano (seis puntos).

## Decisiones técnicas

Las cerradas con defecto están en requirements.md §Decisiones (D1–D15). Además:

- Todo es capa de presentación (`src/screens`, `src/components`, `src/theme`,
  `src/app`, `src/i18n`): ni dominio, ni aplicación, ni infraestructura.
- Los retardos del canvas se copian tal cual en `delayMs`; `RiseIn` ya usa
  `MOTION_RISE_TIMING` (400 ms) y el desplazamiento de #197.
- Los bocadillos con pico usan esquinas por lado (`rounded-tl-16 …
  rounded-br-4`) sobre tokens existentes; no se dibuja el triángulo del pico de
  NuevaMascota (la burbuja de add-pet no cambia en esta feature).
- La fidelidad se prueba en dos niveles: cada pantalla con RNTL (estructura,
  `className`, tamaños) y `account-flow-canvas-fidelity.test.ts` contra el
  artboard congelado (literal CSS del canvas + literal de producción).
- El orden de commits de tasks.md evita que un test rojo aserte nodos que crea
  un R posterior.

## Archivos afectados

Solo presentación, bajo `mobile-pet-tracker/` salvo `docs/`:

| Fichero | R |
|---|---|
| `src/theme/global.css` | R1 |
| `src/screens/welcome/index.tsx` | R2–R7 |
| `src/i18n/catalog.ts` | R5 |
| `src/screens/login/index.tsx` | R8 |
| `src/screens/register/index.tsx` | R9 |
| `src/screens/forgot/index.tsx` | R10, R11 |
| `src/screens/reset-password/index.tsx` | R12, R13 (R14 no lo toca) |
| `src/app/_layout.tsx` | R15 |
| `src/screens/add-pet/index.tsx` | R16, R18, R19 |
| `src/components/segmented-control.tsx` | R17 |
| `docs/ui-guidelines.md` | R20 |

Tests: nuevo `src/__tests__/account-flow-canvas-fidelity.test.ts`; se amplían
los seis `src/screens/<pantalla>/index.test.tsx` y
`src/app/__tests__/layout.test.tsx`; se enmiendan
`src/__tests__/consistency-classnames.test.ts`,
`src/__tests__/design-drift.test.ts`,
`src/__tests__/add-pet-two-steps.test.ts` y
`src/__tests__/account-screens-polish.test.ts` según el inventario.

## Alternativas descartadas

- **Añadir `delayMs` a `PopIn`** para clavar 300/500/600 ms: toca un componente
  que #201 usa sin cambios en paralelo. Desviación aceptada (D5).
- **Mantener `Card` en bocadillos y tarjeta de éxito** con `className` de
  esquinas: `Card` fusiona su propia esquina y su variante pinta fondo y borde
  que el canvas no tiene.
- **Componente `Bubble` compartido**: dos usos con pico en lados distintos; se
  añade cuando haya un tercero.
- **Conservar el copy largo del saludo**: no cabe en el bocadillo absoluto del
  canvas sin tapar a Pingo.
- **Hex para la sombra del suelo**: rompe `HEX_LITERAL`; `bg-border` basta.
- **Cabecera nativa con `headerTitle` personalizado en add-pet**: no permite el
  paso como accesorio ni el volver de 44 con margen −10 del canvas.

## Riesgos

- **Choque con #199 en `global.css`**: resuelto (E5). #199 ya declaró
  `--text-34: 34px;` en la base; R1 añade solo los radios y el candado de R1
  sigue exigiendo exactamente una línea de cada.
- **Choque en `#197 R20`**: resuelto (E4). #200 ya borró el describe.
- **Agregados de `consistency-classnames.test.ts`**: las paralelas suman sus
  términos en las mismas expresiones; un conflicto se resuelve conservando los
  términos de las dos ramas.
- **Teclado en add-pet**: el pie fijo y `keyboardVerticalOffset={0}` cambian la
  cifra de `#148 R4` (`paddingBottom` 291 → 200; el test sigue montando
  `HeaderHeightContext` con 91, de modo que 200 prueba que el offset es 0).
  Para no tocar `#191 R6`, el scroll `add-pet-form` conserva su
  `contentContainerStyle` (`paddingTop: 12`, `gap` 12 en el paso 1 y 16 en el
  paso 2, `paddingBottom: insets.bottom + 24`): `insets.top` lo lleva el bloque
  fijo de cabecera (R16) e `insets.bottom` el pie, con su
  `Math.max(insets.bottom, 16)`. Se retiran `headerHeight` y
  `HeaderHeightContext` del fuente. El smoke confirma que el pie sube con el
  teclado.
- **`usePreventRemove` con volver propio**: si no intercepta `router.back()`, el
  diálogo de descartar se perdería; lo cubren los tests de hoy y el smoke.
- **`bg-border` en la sombra del suelo**: en oscuro puede leerse más clara que
  el canvas; desviación declarada.
