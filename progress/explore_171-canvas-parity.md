# explore: 171-canvas-parity (mobile-celebrations-and-living-empty frente al canvas)
Fecha: 2026-10-13

Base: worktree `/home/claude/sites/Pet-Tracker-wt-171`, branch
`feature/171-mobile-celebrations-and-living-empty`, HEAD `34446b87`.
Canvas: https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, versión
`1791913045-37f1` (leído con Artifact `read`; artboards de 390×844).

Mandato del humano, citado literalmente: «si, dale aclara en las otras sesiones que el
diseño final debe de quedar como el artifac». Este informe da por hecho que,
donde #171 se aparta del artboard, gana el artboard, y nombra cada candado
(R-id e `it`) que habría que revertir o enmendar. No decide nada: compara y
recoge preguntas.

Recuento: **24 divergencias**. 15 están en la celebración (C4) y 9 en el
vacío de Inicio (C2). La variante «primera mascota / sin collar» no tiene
artboard.

---

## Contexto encontrado

### Artboards relevantes

| Artboard | Título | Qué cubre de #171 |
|---|---|---|
| `Celebracion.dc.html` | «Collar vinculado» | La celebración de `pairing` (R3), y también el layout que hereda la variante sin collar (R5) |
| `InicioVacio.dc.html` | «Inicio sin mascota» | El `EmptyState` vivo de Inicio (R10/R11), junto con el layout de `home` sin mascotas |

- El sha256 de `Celebracion.dc.html` es **idéntico** al de
  `specs/mobile-welcome-pingo/design-src/celebration.dc.html`, así que la copia local
  versionada es fiel al canvas actual.
- **No hay artboard para la celebración de la primera mascota (sin collar).**
  El canvas solo la nombra en notas de `canvas.json`:
  - note4: «Nueva mascota: al guardar la primera, celebración a pantalla completa».
  - note5: «Celebración a pantalla completa (E): confeti con Reanimated, respeta
    reduce-motion; solo para hitos raros».

  Esa variante hereda el layout del artboard del collar, pero sin chips. Su copy
  (P1, aprobado en el gate) no tiene equivalente en el canvas.
- note1: las poses de Pingo son placeholders hasta D2 y todos los artboards usan el
  mismo blob (`/_blob/f4ec4ed756bad6b3aa2ee809a534ea88`). **La imagen de la pose no
  cuenta como divergencia**; su tamaño y su movimiento sí cuentan.
- `Vincular` y `NuevaMascota` quedan fuera de #171 (C9 en
  `progress/explore_ui-canvas-parity.md`).

### Mapa de paridad previo

En `progress/explore_ui-canvas-parity.md`:
- C2 es el EmptyState vivo (float y CTA chunky) y cierra InicioVacio.
- C4 son las celebraciones.
- La fila 5 del canvas («Propuestas nuevas»: InicioVacio y Collar vinculado) cae
  entera en #171.
- El mismo fichero registra que el copy de #155 (voz B de Pingo) **sustituye** al
  copy del canvas en InicioVacio. Con el mandato nuevo esa decisión choca con el
  canvas (ver Riesgos, punto 6).

### Lo que construyó #171

**Spec** (`specs/mobile-celebrations-and-living-empty/requirements.md`):
- R1–R16 y E1–E3. R16 (smoke) está sin firmar. E3 (`MOTION_CELEBRATION_SPRING` y
  la sección §2.26 de copy) aún no está aplicada; es la ronda 3.
- §Fuera de alcance (D) excluye a propósito tres cosas: el anillo ping, el float de
  Pingo dentro de la celebración y la entrada escalonada del texto.
- `design.md` §10 las rechaza además como alternativas, junto con el confeti
  infinito y Lottie.

**Código:**
- `mobile-pet-tracker/src/components/celebration.tsx`: un Modal con el confeti
  (una pasada), el hero con Pingo y la insignia, el título, el cuerpo, los chips y
  las dos acciones.
- `mobile-pet-tracker/src/components/empty-state.tsx`: la pose a 160×160 con un
  float infinito (`withRepeat`) y el CTA HeroUI con labio.
- `src/screens/pairing/index.tsx` monta `<Celebration testID="pairing-ready">`.
- `src/screens/add-pet/index.tsx` monta `add-pet-celebration` (sin chips).
- `src/screens/home/index.tsx` monta `home-empty` bajo el encabezado «Inicio».

**Tokens:**
- `src/theme/motion.ts`:
  - `MOTION_FLOAT_OFFSET_Y = 4` y `MOTION_FLOAT_TIMING` de 1200 ms (los dos de
    #153 R4, compartidos con welcome).
  - `MOTION_POP_SPRING = { duration: 400, dampingRatio: 0.5 }` y `MOTION_POP_SCALE = 0.6`.
  - `MOTION_CONFETTI_*`.
- `src/theme/global.css`: `surface-secondary` vale #F0FBF6, igual que `--surface2`
  del canvas, y `--color-lip-gray` vale #E4E7EC, igual que `--lip-gray`.
- heroui-native: el `Button` md mide 48 px de alto y `rounded-xl` da 12 px
  (`--radius` 0.5rem × 1.5).

`EmptyState` es **compartido**. Lo usan ocho pantallas:
- `src/app/(tabs)/food.tsx`
- `src/screens/alerts/index.tsx`
- `src/screens/docs/index.tsx`
- `src/screens/geofences/index.tsx`
- `src/screens/health/index.tsx`
- `src/screens/home/index.tsx`
- `src/screens/map/index.tsx`
- `src/screens/reminders/index.tsx`

Cualquier cambio en el componente las mueve todas, no solo Inicio.

---

## Divergencias: celebración (C4), artboard `Celebracion.dc.html`

Severidad:
- **visible**: el usuario lo nota a simple vista.
- **menor**: pocos px o ms, o un matiz tipográfico.
- **ninguna**: equivalente en la práctica.

Abreviaturas de los ficheros de test:
- `cel` = `src/components/__tests__/celebration.test.tsx`
- `dd` = `src/__tests__/design-drift.test.ts`
- `mot` = `src/theme/__tests__/motion.test.ts`

| # | Elemento | Artboard | Build | Candados a revertir o enmendar | Severidad |
|---|---|---|---|---|---|
| 1 | Confeti: duración de la lluvia | Cada uno de los 36 spans lleva `animation: fall … infinite`, así que llueve mientras la pantalla está abierta | Una sola pasada (`withTiming` sin repetir); a los ~5 s todas las piezas han terminado | P4. `cel` 'R6.4 a los 5000 ms todas las piezas terminaron y desaparecieron'. `dd` 'R13.2 la fuente no usa LayoutAnimation, entering/exiting ni bucles' (regex `withRepeat\|withSequence`). `cel` '#171 R15: docs/ui-guidelines.md declara la enmienda del confeti'. El texto de la «Enmienda #171» de `docs/ui-guidelines.md` («una sola pasada»), el punto 7 de la carta («Bucles de reposo») y `design.md` §10 | visible |
| 2 | Confeti: recuento | 36 piezas | `CONFETTI_COUNT = 24` | `cel` 'R6.1 pinta 24 piezas con sus formas y colores en orden' y 'R6.5 a los 1200 ms cada pieza sigue su retardo, su duración y su curva' (E2). El texto de la enmienda («24 piezas») | menor |
| 3 | Confeti: colores | `var(--accent)` y #F79009, #7A5AF8, #2E90FA, #F04438, #12B76A, seis piezas de cada | `bg-accent` y `CONFETTI_FILLS` (category-*-strong: #A55E07, #7549F7, #0768E0, #D80B34, #107148), que son más oscuros y apagados | E1 (define `CONFETTI_FILLS`). `cel` R6.1 (orden de colores). `dd` 'R13.1 %s no deja escapes de estilo' (hex prohibido fuera del tema). La consistencia de clases de #64 R9. Igualar el artboard exige **tokens nuevos** en `global.css` | visible |
| 4 | Confeti: formas | 11 elipses de 8–12 × 6 px (radio 50 %) y 25 rectángulos de 8–12 × 14/18 px con radio 2 px | `SHAPES`: `h-1.5 w-2 rounded-full` (8×6), `h-3.5 w-2.5` (10×14) y `h-4 w-3` (12×16), ocho de cada, con esquinas rectas (E1) | E1. `cel` R6.1. #62 R4 (consistency-classnames: un radio de 2 px necesita una clase de escala, no un corchete) | menor |
| 5 | Confeti: tiempos | Duraciones de 2320 a 3593 ms y retardos de 128 a 1396 ms | Duraciones de 2400 a 3599 ms (`2400 + (i·137) % 1200`) y retardos de 0 a 1199 ms (`(i·53) % 1200`). La curva bezier(.2,.6,.4,1) coincide | `cel` R6.5 (E2). `MOTION_CONFETTI_MIN_MS` y `MOTION_CONFETTI_SPREAD_MS` | ninguna/menor |
| 6 | Anillo ping tras Pingo | Anillo de acento a .16 de opacidad, 2.2 s, infinito | No existe | §Fuera de alcance (D) de la spec. `design.md` §10. Punto 7 de la carta: la enmienda de #167 admite el ping **solo en welcome** y cualquier otra pantalla necesita su propia enmienda. `dd` R13.2 (prohíbe `withRepeat` en `celebration.tsx`) | visible |
| 7 | Float de Pingo tras el pop | La imagen hace `pop 600ms` y después `float 3s infinite` | Solo el spring del pop; luego Pingo se queda quieto | §Fuera de alcance (D). `design.md` §10. `dd` R13.2. El punto 7 **sí** admite el float como bucle de reposo; el bloqueo viene de la spec y de R13.2, no de la carta | visible |
| 8 | Tamaño del hero | Contenedor de 220×220 con `margin-top: 40`; imagen de 170 px de ancho | Hero e imagen a 200×200, sin margen superior | `cel` 'R7.1 Pingo empieza transparente y a escala 0.6' y 'R7.3 Pingo llega a opacidad y escala 1 a los 2000 ms' (los dos aseveran width/height 200). Los tests de R8.2 (width 200) | menor |
| 9 | Insignia | 56 px en right 18 / bottom 26; check **SVG** de 28 px con trazo 3; `pop 500ms` con retardo de 450 ms | `size-14` (56 px) en right 0 / bottom 0; glifo de texto «✓» con `text-2xl font-black`; retardo `MOTION_SURFACE_MS` (400 ms) | `cel` 'R2.4 Pingo usa celebrate y la insignia contiene ✓'. `cel` 'R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms' y el resto de R7.2–R7.4 (E2). `react-native-svg` 15.15.4 ya está instalado, así que el SVG no pide dependencia nueva | menor |
| 10 | Curva del pop | Keyframe de 600 ms (insignia: 500 ms) con un pico de ~1.08 | `withSpring(1, MOTION_POP_SPRING)`: 400 ms, dampingRatio 0.5, pico de ~1.06 | P5. `cel` 'R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms'. `mot` 'declara MOTION_POP_SPRING'. E3 (`MOTION_CELEBRATION_SPRING`, sin aplicar) | menor/ninguna |
| 11 | Entrada escalonada del texto | `rise` en h1 (retardo 500) y en p (retardo 580) | Texto estático; solo hay el fade del Modal | §Fuera de alcance (D). `design.md` §10. R13.2 no lo impide si se hace con `withDelay` + `withTiming` sin `entering=` | menor |
| 12 | Título | 30 px, peso 900, `letter-spacing: -0.02em`, `margin-top: 8` | `text-3xl font-black` (30 px, 900), sin tracking y sin margen | No identifiqué ningún `it` que fije sus clases. El tracking necesita una clase de escala (`tracking-tight` vale -0.025em) porque `dd` R13.1 prohíbe corchetes | menor |
| 13 | Cuerpo | 15 px, line-height 1.5, `max-width: 300` | `text-base` (16 px), sin ancho máximo | `dd` R13.1: 15 px y 300 px no tienen clase de escala y harían falta tokens | menor |
| 14 | Espaciado | `gap: 14`; padding 80/24/40; el hero lleva `margin-top: 40` | `gap-4` (16 px); `insets.top + 80` / `px-6` / `insets.bottom + 24`; sin margen en el hero | No identifiqué ningún `it` que fije el gap; `dd` R13.1 (14 px no tiene clase) | menor |
| 15 | Botones | Alto 56, radio 16, 17 px con peso 800. Primario: sombra `0 4px 0 var(--lip)` (#0E5E3C). Secundario: borde de 2 px `--lip-gray` y sombra `0 4px 0` `--lip-gray` | HeroUI md (48 px, `min-h-11`), `rounded-xl` (12 px), `font-bold` 16 px. Primario: `border-b-4 border-black/25` (no usa `--lip`). Secundario: `border-2 border-b-6 border-lip-gray` | `cel` 'R14.1 el primario lleva la receta y la etiqueta del acento' y 'R14.2 el secundario lleva el labio gris sin variant y su etiqueta'. La receta y los inventarios de botones de #166 (R2/R3). #62 R1. #98 R10. `dd` R13.1 (sin `shadow`). **La receta es global**: cambiarla solo aquí rompe la consistencia con el resto de la app | visible |

### Coincidencias en la celebración

- **Fondo y estructura**: `bg-surface-secondary` coincide con `--surface2` (#F0FBF6). El orden de los hijos coincide: confeti, hero (Pingo e insignia), título, cuerpo, chips y acciones con `mt-auto`.
- **Copy del collar**: es idéntico al artboard: «El collar está listo», «El collar de {{petName}} está vinculado. El rastreo GPS está activo.», «Modelo», «ESN», «Ver en el mapa» y «Listo».
- **Chips**: pill, `bg-surface`, `px-3 py-1.5`, `text-xs font-bold`, lo que equivale a padding 6/12 con 12 px y peso 700.
- **Insignia y título**: la insignia coincide en tamaño (56 px), color de acento y borde de 4 px en surface2. El título coincide en tamaño y peso.
- **Movimiento del confeti**: coinciden la curva de caída, el giro y la envolvente de opacidad.
- **Reduce motion**: el canvas apaga toda la animación; el build no monta el confeti y deja la escala en 1.
- **Destinos**: «Ver en el mapa» va a `/map`. «Listo» hace `back`, que en el flujo real equivale a «Perfil».

---

## Divergencias: vacío de Inicio (C2), artboard `InicioVacio.dc.html`

Abreviaturas de los ficheros de test:
- `es` = `src/components/__tests__/empty-state.test.tsx`
- `home` = `src/screens/home/index.test.tsx`

| # | Elemento | Artboard | Build | Candados a revertir o enmendar | Severidad |
|---|---|---|---|---|---|
| 16 | Composición de la pantalla | Sin título; contenido centrado en vertical (padding 60/24/120, `gap: 14`) | `home-states` lleva el encabezado `t('home.home')` («Inicio», `text-2xl font-black`), alineado arriba (`paddingTop: insets.top + 12`, `gap: 16`). El `EmptyState` va debajo con `items-center gap-3 py-8` | `home` 'pads the content below the status bar with the top safe-area inset', 'shows the empty state when the account has no pets' y, en «#155 R4», 'queda en el sitio del vacío que sustituye' (hijos `['Text','home-empty']`). `es` 'pinta el contenedor sin tarjeta' (`items-center gap-3 py-8`). Son de #155 | visible |
| 17 | Escenario de Pingo | Escenario de 280×260 con un círculo `--surface2` de 240 px, tres huellas SVG de acento a .18 y una sombra elíptica de 120×14 (`rgba(13,17,23,.10)`) | Solo la imagen, sin escenario | No hay ningún `it`. Igualarlo exige tokens nuevos para la sombra y para el acento a .18 (`dd` prohíbe el hex suelto), y decidir si el escenario es de Inicio o de todos los vacíos | visible |
| 18 | Tamaño de Pingo | 190 px de ancho | 160×160 | `es` 'pinta la pose %s a 160×160 y sin etiqueta' (#155 R3). `es` 'R10.2 envuelve la pose en float con su estilo inicial' (el `floatStyle` lleva 160). Afecta a las ocho pantallas con `EmptyState` | visible |
| 19 | Float | De 0 a -10 px con un ciclo de 3 s | `MOTION_FLOAT_OFFSET_Y = 4` y `MOTION_FLOAT_TIMING` de 1200 ms por medio ciclo (ciclo de 2.4 s) | `mot` 'declara la escala de entrada y el recorrido de la flotación' (espera 4) y 'declara medio ciclo de flotación ease-in-out' (espera 1200), los dos de #153 R4. `es` 'R10.3 sube cuatro puntos en 1200 ms', 'R10.4 sigue la curva de 1200 ms a los 300, 600 y 900 ms' y 'R11.1 conserva la posición a los 1200 y los 10000 ms'. La regex de float de `welcome/index.test.tsx` (grep `MOTION_FLOAT`). **El token se comparte con welcome** | menor/visible |
| 20 | Título | 26 px, peso 900, tracking -0.02em | `text-lg font-bold` (18 px, 700) | `es` 'pinta el título y el cuerpo con sus clases' (#155 R3). Afecta a todos los vacíos | visible |
| 21 | Cuerpo | 15 px, line-height 1.5, `max-width: 290` | `font-normal text-muted`, sin tamaño explícito y sin ancho máximo | `es` 'pinta el título y el cuerpo con sus clases' (#155 R3). `dd` R13.1 (15/290 sin clase) | menor |
| 22 | Copy del cuerpo | «Añade a tu compañero para ver su ubicación, salud y comidas en un solo lugar.» | `common.noPetsBody` = «Añade a tu mascota y te ayudo a saber dónde está y cómo está.» (voz B de Pingo, #155) | #155 R1 (filas de copy en `es`, incluida `common.noPetsBody`). `home` 'pinta la pose, el título y la frase de Pingo' (#155 R4). La fila de `mobile-ui-language`. La decisión registrada en `explore_ui-canvas-parity.md` («el copy de #155 sustituye») | visible, **abierta** |
| 23 | CTA | Ancho completo, 56 px, radio 16, sombra `--lip`, icono «+» en SVG, `margin-top: 10` | `Button` HeroUI md (48 px, `rounded-xl` de 12 px) con el ancho de su contenido, sin icono, `border-b-4 border-black/25` | `es` 'declara el botón primario con labio' y 'declara el botón sin size ni variant' (#155 R3). Los inventarios de botones de #166. Afecta a todos los vacíos que llevan acción | visible |
| 24 | Entrada escalonada | `rise` en h1 (100), p (160) y CTA (220) | Sin entrada | `es` 'EmptyState no anima con LayoutAnimation, transiciones ni entering/exiting' (#155 R11): solo prohíbe esos mecanismos, y un `withDelay` + `withTiming` lo respetaría | menor |

### Coincidencias en el vacío de Inicio

- **Textos**: el título «Aún no tienes mascotas» (`common.noPetsYet`) y la etiqueta del CTA «Añadir mascota» (`profile.addPet`) coinciden.
- **CTA**: el color de acento coincide y la acción navega a `/pets/add`.
- **Float**: existe y es un bucle reversible ease-in-out. Con reduce motion se apaga, igual que en el canvas.
- **Tab bar**: la tab bar flotante es la de la app y ya existía.

---

## Riesgos / ambigüedades

1. **El mandato choca con decisiones firmadas por el humano.** Igualar el artboard
   exige enmendar varias cosas:
   - la spec: §Fuera de alcance (D), P4 y P5, `design.md` §10 y una enmienda E4 o
     posterior;
   - la carta: el texto de la «Enmienda #171», que fija «una sola pasada de 24
     piezas», y el punto 7, que pide una enmienda propia para el ping en una
     pantalla distinta de welcome. El confeti infinito tampoco es un «bucle de
     reposo» de Pingo;
   - lo que convendría preguntar al humano: si el «como el artifact» incluye el
     **confeti infinito** y el **ping continuo**, que la carta descartó por
     criterio de calma y accesibilidad. Una animación automática de más de 5 s sin
     pausa roza WCAG 2.2.2, aunque el Modal se puede cerrar y el canvas respeta
     reduce motion.
2. **La mitad de los candados pertenece a otras features**:
   - #155: `EmptyState` y `home` sin mascotas (filas 16, 18 y 20–24);
   - #166: la receta global de botones (filas 15 y 23);
   - #153: los tokens del float (fila 19);
   - #62, #64 y #98: la consistencia de clases (filas 3, 4 y 15).

   Revertirlos desde #171 mueve componentes **compartidos**: el `EmptyState` de
   ocho pantallas y la receta de botones de toda la app. Hay que decidir si el
   cambio es solo de Inicio (una variante o una prop) o global.
3. **Float compartido con welcome.** `MOTION_FLOAT_OFFSET_Y` y `MOTION_FLOAT_TIMING`
   los usa también la bienvenida. En esta ronda no contrasté el float del artboard
   de bienvenida. Antes de mover el token compartido conviene medirlo, o bien dar
   al vacío un token propio.
4. **Colores del confeti.** El hex está prohibido fuera del tema (`dd` R13.1).
   Llevar al build los seis colores vivos del artboard requiere tokens nuevos en
   `global.css`, con su variante dark, que el canvas no define. También requiere
   revisar E1 (`CONFETTI_FILLS`) y la guarda de #64 R9.
5. **La variante sin collar no tiene artboard.** Hereda el layout del collar sin
   chips, y su copy P1 no tiene referencia en el canvas. Todo cambio de layout
   en las filas 1–15 la alcanza igual, porque es el mismo componente
   `Celebration`.
6. **El copy de InicioVacio está abierto.** El mandato «como el artifact» contradice
   la decisión registrada en `explore_ui-canvas-parity.md` de que la voz B de
   #155 sustituye al copy del canvas. La voz B (D1, 2026-10-07) se aprobó **después**
   del canvas. Solo el humano puede cerrar qué texto gana. La fila 22 no debería
   resolverse por inferencia.
7. **E3 sigue pendiente (ronda 3).** Si el pop pasa a 600/500 ms con un pico de
   ~1.08 y retardo de 450 ms (filas 9 y 10), E3 (`MOTION_CELEBRATION_SPRING`) es el
   sitio natural para absorberlo y no enmendar la misma zona dos veces.
8. **La casilla de la carta sigue sin marcar.** En `docs/ui-guidelines.md`, la
   «Enmienda #171 — confeti de celebración» termina con
   `- [ ] Aprobada por humano (fecha: ____)`, mientras que el §Aprobación de la spec
   tiene marcada la casilla de la enmienda (R15.1). Si la enmienda se reescribe por
   el mandato, la casilla y el test `cel` '#171 R15: …' se mueven con ella.
9. **SVG.** El check de la insignia, las huellas y el «+» del CTA son SVG en el
   canvas. `react-native-svg` 15.15.4 ya está instalado, así que no hace falta una
   dependencia nueva. Aun así, los dobles de svg en jest tienen historia (ver
   memoria `mocks-prescritos-literalmente-en-specs`, #168 c18).
10. **Las poses son placeholders** (note1). Los tamaños del artboard (170 y 190 px)
    están pensados para el blob actual. Si D2 trae poses definitivas con otro
    encuadre, los tamaños podrían volver a cambiar.

---

## Recomendación (opciones, sin decidir)

- **Opción A: todo en #171.** Una ronda nueva con enmiendas E4 y siguientes que
  cubran las 24 filas, una enmienda de carta (punto 7 y reescritura de la
  Enmienda #171) y la reversión de los candados listados.
  - A favor: cumple el mandato de una vez.
  - En contra: alcance grande que toca `EmptyState` (ocho pantallas), la receta de
    botones de #166 y los tokens de welcome, con riesgo de choque con otras
    sesiones.
- **Opción B: separar por propietario.** #171 iguala lo que es suyo (filas 1–14 de
  la celebración: confeti, ping, float, rise, hero, insignia, pop y tipografía),
  absorbiendo el pop en E3. Se abren features aparte para:
  1. el vacío de Inicio: filas 16–24, con decisión de alcance global o solo Inicio;
  2. la receta global de botones 56/16/`--lip`: filas 15 y 23.

  - A favor: cada candado lo revierte quien lo posee.
  - En contra: el canvas no queda igualado al cerrar #171.
- **Opción C: preguntar fila a fila lo que la carta prohíbe.** Antes de
  especificar, llevar al humano solo las filas que contradicen la carta o una
  decisión posterior al canvas: 1 y 6 (bucles continuos) y 22 (copy de voz B).
  El resto se iguala sin preguntar.

En cualquier opción, la spec que resulte debe nombrar cada `it` de las tablas que
cambia de valor, para que Codex no deje en rojo un candado ajeno. También debe
medir la base en H0 en lugar de copiar las cifras de este informe (memoria
`constantes-congeladas-en-specs`).
