---
feature: "mobile-reminder-swipe-past-row-bleed"
status: draft
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-reminder-swipe-past-row-bleed]] (#239)

> Decisiones de alto nivel. Requisitos en [[requirements]]; plan TDD en
> [[tasks]]. Rutas relativas a `mobile-pet-tracker/src/` salvo que digan otra
> cosa.

## Decisiones técnicas

### D1. Base opaca dentro del deslizable, solo en filas pasadas del dueño

Opción (b) del plan, en la forma más corta. En `renderRow`, rama del dueño, el
hijo del `ReanimatedSwipeable` deja de ser `{row}` y pasa a ser la fila metida
en una base `View` opaca **cuando la fila es pasada**:

- la base va **dentro** del deslizable, así que se mueve con la fila (es hijo
  del `Animated.View` con `translateX`) y se pinta encima del panel, como la
  fila;
- la base es `rounded-22` con `CONTINUOUS_CORNER`, la misma esquina que la
  fila: el hueco de las esquinas deja ver el rosa del panel igual que en
  Próximos, y la franja no se ve a través de la fila;
- la base es `bg-background`, el color que la fila pasada tiene hoy detrás
  (`screen-reminders`): en reposo la fila al 50 % se compone sobre el mismo
  color que hoy y no cambia ni un píxel en ningún tema;
- la fila no cambia: conserva su `className`, ` opacity-50` incluido, su
  estilo y sus props de accesibilidad.

La base no lleva `testID`, opacidad ni props de accesibilidad. No hace falta:
los tests llegan a ella como `row.parent`.

### D2. Próximos y quien no es dueño no cambian

Las filas de Próximos son opacas (`bg-surface`) y ya se ven bien: siguen siendo
hijo directo del deslizable. Quien no es dueño no tiene deslizable, ni panel,
ni franja, así que no hay nada que tapar: `if (!isOwner) return row;` no
cambia.

### D3. Sin dependencias, imports, copy ni testID nuevos

`View` y `CONTINUOUS_CORNER` ya están importados en
`screens/reminders/index.tsx`. Sin dependencia nativa nueva no hay dev build
nuevo (G3). Sin testID nuevo no se mueve ningún selector por prefijo ni la
cifra `testID=` (48).

## Evidencia del color

Fuente: `theme/global.css`. Composición «fila al 50 % sobre X», canal a canal.

| Tema | `--surface` | `--background` | Hoy, en reposo | Con base `bg-background` | Con base `bg-surface` (descartada) |
|---|---|---|---|---|---|
| Claro | `#FFFFFF` | `#FFFFFF` | blanco | blanco (igual) | blanco |
| Oscuro | `#161B22` | `#0D1117` | rgb(17.5, 22, 28.5) | rgb(17.5, 22, 28.5) (igual) | `#161B22` (cambia) |

El borde (`--border`, `rgba(13,17,23,0.08)` y `rgba(255,255,255,0.08)`) sigue
en la fila y sigue al 50 % de su alfa sobre el mismo fondo: no cambia.

Abierta, con la franja `--color-category-rose` (`#FFF0F3` y `#39131A`) debajo
de los 24 de la derecha de la fila:

- hoy: esos 24 componen la fila al 50 % sobre rosa; en claro salen a mitad de
  camino entre blanco y `#FFF0F3`, en oscuro entre `#161B22` y `#39131A`. Es el
  «color rojo» que ve el humano;
- con la base: componen sobre `--background`, igual que el resto de la fila.
  El rosa queda solo en el hueco de las esquinas, como en Próximos.

## Código objetivo

Rama del dueño en `renderRow` de `screens/reminders/index.tsx`. Hoy, dentro
del `ReanimatedSwipeable` (tras su `renderRightActions`, que no cambia):

```tsx
        >
          {row}
        </ReanimatedSwipeable>
```

Tras #239:

```tsx
        >
          {past ? (
            <View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>
              {row}
            </View>
          ) : row}
        </ReanimatedSwipeable>
```

`past` es el segundo parámetro de `renderRow` (Pasados llama a
`renderRow(reminder, true)`, Próximos a `renderRow(reminder, false)`). Nada más
cambia en el fichero: ni la fila, ni el contenedor
`<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>`, ni
las props del deslizable, ni `renderRightActions`, ni la franja
`absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`, ni el formato
de fecha (`due.toLocaleDateString(locale, { day: 'numeric', month: 'short' })`,
que toca #240), ni `untilDay`.

La forma literal de la línea de la base es la que cuenta R6:
`<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>`, con
`className` antes de `style` y sin más props.

## Archivos afectados por capa

La feature solo toca la capa de presentación móvil (`screens/`). Ni dominio, ni
aplicación, ni infraestructura.

| Fichero | Cambio |
|---|---|
| `screens/reminders/index.tsx` | La base de D1 (R1, R2, R5, R6). |
| `screens/reminders/index.test.tsx` | `describe('Base opaca de la fila pasada (#239 R1 a R5)', …)` al final (R1 a R5). |
| `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` | `#239 R6` y `#239 R7` al final, con la constante `AMENDED_PAST_ROW_BASE`. |
| `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` | Cifra de `style={CONTINUOUS_CORNER}` en `#227 R11` y sufijo (R7). |
| `__tests__/consistency-classnames.test.ts` | Tres cifras de esquina continua y sufijos (R7). |
| `__tests__/design-drift.test.ts` | Cifra de `rounded-22` y sufijo (R7). |
| `specs/mobile-reminders-upcoming-past/requirements.md` (raíz del repo) | `## Enmienda #239 — Base opaca de la fila pasada`, desde el commit de esta spec. |

## Por qué no cambia la carta (sin G4)

- Enmienda #228, punto 1: la franja sigue existiendo y sigue «bajo la esquina
  de la fila». Lo que cambia es que en Pasados la fila ya no la deja ver
  entera, como no la deja ver en Próximos.
- Radios: `rounded-22` está reservado a la «fila de Recordatorios». La base es
  el fondo de esa fila y vive en `screens/reminders/index.tsx`; la reserva de
  `design-drift` («reserva los radios 14, 16 y 22 a Recordatorios») solo sube
  su cifra.
- Corolario de esquinas: la base es una esquina no-cápsula que el repo dibuja
  por su cuenta y declara `style={CONTINUOUS_CORNER}`.
- Opacidad del pasado (#227 R7): la fila sigue al 50 %.

## Por qué no hay artboard nuevo (sin G1)

Los artboards de #228 (`RecordatoriosDeslizarEliminar.dc.html` y
`RecordatoriosDeslizarSerie.dc.html`, canvas v167) dibujan una fila opaca
deslizada sobre el panel rosa. La fila pasada abierta queda así; en reposo,
como hoy. No hay aspecto nuevo que dibujar.

## Alternativas descartadas

1. **(a) Acortar la franja a la esquina.** La franja existe para rellenar el
   hueco de las esquinas redondas de la fila (radio 22). Tiene que medir al
   menos 22 de ancho; aun reducida a dos cuadrados de 22 × 22 en las esquinas,
   en cada cuadrado la fila ocupa el cuarto de círculo
   (π · 22² / 4 ≈ 380 de 484, el 78,5 %) y al 50 % deja ver el rosa debajo.
   Tapar solo el hueco pediría una máscara de esquina inversa (SVG o similar)
   o un color mezclado que no es token. Además es código que comparte
   Próximos, que ya se ve bien.
2. **Fondo rosa en el contenedor** (como la clase `.sw` del canvas): todo el
   contenedor sería rosa y se vería a través de toda la fila pasada. #228 D3 ya
   lo descartó.
3. **Base en el contenedor exterior** (`overflow-hidden rounded-22`): el panel
   y su franja se pintan encima de él, así que el rosa sigue debajo de la fila.
   No arregla nada.
4. **`childrenContainerStyle` del deslizable.** Solo admite `style`: haría falta
   un color literal (lo vetan los guards de hex) o un hook de tema, y se
   aplicaría también a Próximos salvo con otra condición. Más código que una
   `View` con clases.
5. **(b2) Fila opaca `bg-surface` con la opacidad en sus hijos.** En oscuro la
   fila pintaría `#161B22` en vez de la mezcla al 50 % sobre `#0D1117` y el
   borde perdería su atenuación: cambia el aspecto en reposo, que no debe
   cambiar. También mueve ` opacity-50`, que asertan #227 R7 y #228 R6.
6. **Token nuevo con el color mezclado.** Pide un token en `theme/global.css` y
   enmendar la carta (G4) para lo que un token existente ya resuelve.
7. **Quitar la franja en Pasados.** En el hueco de las esquinas se vería
   `bg-background` en vez de rosa: la fila pasada abierta no quedaría «como en
   la lista de PRÓXIMOS».
8. **Animar la opacidad de la fila con el progreso del deslizable** (opaca al
   abrir, atenuada en reposo): worklets y estilo animado para un problema de
   capas; además la fila abierta dejaría de verse atenuada, que nadie pidió.
9. **`needsOffscreenAlphaCompositing` o `renderToHardwareTextureAndroid`.**
   Cambian cómo se compone la opacidad de la fila consigo misma, no lo que hay
   debajo: el rosa seguiría viéndose.

## Riesgos

- **Borde antialiasado.** En la curva de la esquina, la base y la fila
  comparten forma y radio; el antialias puede dejar un hilo de rosa en el
  borde curvo, igual que en Próximos. Se mira en el smoke G2.
- **#240 y #241 en paralelo.** #240 toca el mismo fichero (formato de fecha);
  su Codex va después de #239 y quien mergea segundo mergea `dev` antes del
  handoff. Si otra feature mergeada antes sube alguna de las cifras de la
  «Tabla de enmiendas», la enmienda conserva la suma visible y suma `+ 1` de
  #239 encima. No se rebasea tras escribir la trazabilidad.
- **Solo en dispositivo.** El tacto del gesto, el hueco de las esquinas con la
  fila abierta y el aspecto en reposo en los dos temas no los ve jest: los
  cubre el «Paso de smoke nuevo (G2)».

## Skills

- Para quien especifica o revisa: `expo:expo-overview`, `expo-animation`
  (receta de deslizar para borrar; capas del deslizable), `expo-native-ui` y
  `expo-design-system` (tokens y guards de deriva).
- Para Codex: los nombres de su catálogo, que pone el leader en el handoff
  (`.claude/agents/leader.md` §Catálogo real de skills de Codex).
