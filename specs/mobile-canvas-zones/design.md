---
feature: "mobile-canvas-zones"
status: approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-canvas-zones]]

Cierra los huecos de Zonas seguras y del Editor de zona frente a la copia congelada del canvas (A-189), sobre los cimientos de #197 (`ScreenHeader`, `ToggleSwitch`, `useShadows`, tokens `leading-*`/`tracking-dialog`, y `RiseIn`, su R24). Solo capa de presentación de `mobile-pet-tracker/`: dominio, aplicación, API y backend no cambian. Requisitos en [[requirements]].

## Premisas contrastadas

Verificadas contra el árbol en 71ff81a1 (no contra explores):

- `react-native-svg` ya está instalado y lo usan `components/empty-state.tsx`, `components/celebration.tsx` y `app/(tabs)/food.tsx`.
- `HomeEntrance` (`screens/home/home-entrance.tsx`) acepta `className`; las filas de Zonas la siguen usando sin cambios.
- Las claves `geofences.deleteTitle/deleteBody/cancel/delete` existen en es y en; el Editor usa las mismas.
- `CATEGORY_SLOTS.rose.surface` es `bg-category-rose` (`utils/category-palette.ts`).
- `global.css` aún no tiene `--leading-*` ni `--tracking-dialog`: los trae #197 (D2 de su spec); `leading-normal` es 1.5 de Tailwind.
- Los selectores por regex de GZ (`/^geofence-geofence-\d$/`, `/-delete$/`) no casan con ningún testID nuevo.

## Supuestos

- #197 (con su R24, `RiseIn`) está mergeada en `dev` antes de implementar; si no, la implementación para (Base medida). #202 no depende de #199.
- El dev build Android usa `blurMethod="dimezisBlurViewSdk31Plus"` como hoy; las sombras de `useShadows()` se ven en Android (#197 R15).
- `Modal` `transparent` con `statusBarTranslucent` cubre la barra de estado en Android edge-to-edge (SDK 57); el smoke lo confirma.
- El botón atrás de Android dispara `onRequestClose` del `Modal`.
- Ninguno de estos supuestos lo ven los tests: van a «Cierre del humano».

## Contraste con el artboard

Fuente: la copia congelada `specs/mobile-canvas-zones/canvas/` (canvas versión
1792777983-cd94). App: `src/screens/geofences/index.tsx` (Z) y
`src/screens/geofence-editor/index.tsx` (E) en 71ff81a1, tras #189. Las filas
«igual» no generan requisito propio salvo el candado de fidelidad (R25).

La columna «Acción» se escribió con ids provisionales. Equivalencias finales: R9 → R10, R10 → R11, R11 → R2 + R12, R12 (E09) → R13, R12 (conservados Z18/Z19) → R21/R22, R13 → R14, R14 → R15, R15 → R16, R16/R17/R18 (E20) → R17/R18/R19, candado de Z09 → R25. En Z22 solo cambia el texto del error: «Reintentar» conserva su receta (D9).

### Zonas (Zonas, ZonasEliminar, ZonasVacio, ZonasSinCollar, ZonasSoloLectura, ZonasEstados)

| Id | Elemento | Canvas | App hoy | Acción |
|----|----------|--------|---------|--------|
| Z02 | Cabecera | `<header>` en contenido: volver 44, `margin-left: -10px`, chevron 24 `stroke-width="2.4"`; h1 26/900/-0.02em `flex: 1`; contador 14/800 muted; `gap: 8px`; raíz `padding: 56px 20px 40px` | volver nativo (`TRANSPARENT_HEADER_OPTIONS`), título en `geofences-header` con `paddingLeft: ZONES_TITLE_OFFSET`, `paddingTop: insets.top + HEADER_ROW_TOP` | R1, R2: `ScreenHeader` de #197 con `accessory` = contador; `headerShown: false` |
| Z03 | Barra | 5 segmentos `height: 6px; border-radius: 3px`, `gap: 4px` | `h-1.5 flex-1 rounded-full`, `gap-1` | igual |
| Z04 | Fila | `border-radius: 20px`, `border: 1px solid var(--border)`, `padding: 12px 14px`, `gap: 12px` | `Card … px-3.5 py-3 shadow-none` | igual (borde .08 lo trae #197 R1) |
| Z06 | Icono del tile | 22, `stroke-width="2.2"`, `circle r="9" stroke-dasharray="3 3"` + `circle r="2.5"` | `Map` de reicon | R3: glifo propio con `react-native-svg` |
| Z08 | Interruptor | `width: 48px; height: 28px`, pulgar 22 a 3, `var(--lip-gray)` / `var(--accent)` | `Switch` de heroui por defecto | R4: `ToggleSwitch` de #197 |
| Z09 | Entrada | `rise 400ms ease-out` con retraso `60·i` (filas 0..240, aviso 300) | `HomeEntrance` (tras #197 ya es `rise` 14/400) | igual tras #197; candado en R16 |
| Z11 | Icono del aviso | triángulo con exclamación, 20, trazo 2.2, `stroke="var(--warning)"` | `AlertCircle` | R5: `AlertTriangle` de reicon |
| Z12 | Color del aviso | `--warning` `#B54708` | `useThemeColors(['warning'])` | igual tras #197 R1 |
| Z13 | Texto del aviso | `font-size: 13px; line-height: 1.45; color: var(--amber-s)` | `flex-1 text-13 <amber.ink>` sin interlineado | R5: `leading-note` (#197 R3) |
| Z14 | «Añadir zona» al límite | `margin-top: auto; height: 56px; border-radius: 16px; background: var(--default); color: var(--muted)`, 17/800 | igual | igual |
| Z15 | Papelera por fila | **existe** en el canvas: 44, `border-radius: 12px`, `background: var(--rose)`, `color: var(--danger)`, trazo 20/2.2 | `size-11 rounded-xl bg-danger-soft`, `Trash size={20}` | R6: fondo `rose` (categoría) en vez de `danger-soft` |
| Z17 | Diálogo de borrado | `role="alertdialog"` propio: velo `rgba(13,17,23,0.4)` con `fade 250ms`; tarjeta `border-radius: 28px`, `padding: 24px 24px 12px`, borde 1, `gap: 12px`, `box-shadow: 0 12px 40px rgba(13,17,23,0.25)`, `rise 300ms`; título 20/900/-0.01em; cuerpo 14/1.5 muted; acciones a la derecha `gap: 4px`, `margin-top: 4px`, cada una `min-height: 48px; padding: 0 16px; border-radius: 14px`, 15/800, Cancelar `accent-strong`, Eliminar `danger` | `Alert.alert` nativo | R7, R8: diálogo en contenido con `Modal` de React Native |
| Z18 | Vacío | `EmptyState`: imagen 160, título 18/700, cuerpo 15/1.5 muted; contador `0/5` y barra vacía; «Añadir zona» con labio | `EmptyState pose="collar"` + contador + barra + botón | igual (conservado, R12) |
| Z19 | Sin collar | sin contador ni barra ni botón; `EmptyState` con su copy | igual | igual (conservado, R12) |
| Z20 | Solo lectura | sin interruptor ni papelera; píldora `padding: 2px 8px; border-radius: 999px; background: var(--default)`, 11/700 muted | `self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted` | igual |
| Z21 | Carga | 2 filas esqueleto con la forma de la fila: tile 44/14, dos barras (55 % x 14 r7 y 35 % x 10 r5, `gap: 6px`), interruptor 48x28 y papelera 44/12 | un `Skeleton h-24 w-full rounded-card` | R9 |
| Z22 | Error de carga | `<p role="alert">` 15 / `line-height: 1.4` / `var(--danger)`; «Reintentar» `height: 44px; padding: 0 20px; border-radius: 14px`, `accent`, labio `0 4px 0 var(--lip)`, 15/800, `align-self: flex-start` | `Text className="text-danger"` + `Button className="min-h-11"` | R10 |
| Z23 | Error al guardar | `<p role="alert">` 15/1.4 danger tras «Añadir zona» | `geofences-action-error` `text-danger` tras «Añadir zona» | R10 (clases) |

Los rótulos en mayúsculas de ZonasEstados («Cargando», «Error de carga», «Error
al guardar un cambio») y su `gap: 22px` son anotación del lienzo, no UI.

### Editor (EditorZona, EditorZonaEstados, EditorZonaSoloLectura, EditorZonaNueva, EditorZonaError)

| Id | Elemento | Canvas | App hoy | Acción |
|----|----------|--------|---------|--------|
| E01 | Mapa | `width="390" height="430"` a sangrado, sin cabecera nativa | `PetMap` bajo cabecera nativa transparente | R11: `headerShown: false` |
| E02 | Volver | círculo 44 `background: var(--glass); backdrop-filter: blur(16px); box-shadow: var(--shadow)`, chevron 22 trazo 2.4, `top: 52px; left: 16px` | volver nativo | R11 |
| E03 | Píldora | «Zona segura» `padding: 10px 16px`, glass + blur 16 + `var(--shadow)`, 16/800, `gap: 10px` desde el volver | `BlurView` en `left: EDITOR_PILL_LEFT`, sin sombra | R11 |
| E04 | Pista | 12/700, `padding: 6px 12px`, glass + blur 12, `top: 368px` | `absolute bottom-9 self-center`, `px-3 py-1.5 text-xs font-bold` | igual |
| E05 | Círculo | `fill="var(--pill)" stroke="var(--accent-strong)" stroke-width="3"`; otra zona en Nueva `stroke-width="2" opacity=".6"` | `PetMap` comparte trazo 2 con el Mapa | fuera (D6): `PetMap` es de #201/#192 |
| E06-E08 | Centro, asa, `breathe` | `r="9"`, `r="10"`, `breathe 2.4s` | ausentes | #192 |
| E09 | Hoja | `border-radius: 28px 28px 0 0`, `box-shadow: 0 -8px 24px rgba(13,17,23,0.10)`, `padding: 12px 20px 36px`, `gap: 14px`, `animation: rise 400ms ease-out both` | `-mt-6.5 rounded-t-hero bg-surface`, sin sombra ni entrada | R12 |
| E11 | Nombre | input `height: 50px; border-radius: 12px`, `font: 600 16px` | `Input … h-12.5 rounded-xl bg-default px-3.5` (heroui `font-normal`) | R13: `text-base font-semibold` |
| E13 | «Activa» | 15/700 + interruptor 48x28 | `Switch` de heroui | R4 |
| E14 | Acciones | rejilla `1fr 2fr`, `gap: 10px`; los dos `height: 54px; border-radius: 16px`; Eliminar 16/800 `danger`, borde 2 `lip-gray`, labio `lip-gray`; Guardar 17/800 con labio `lip` | `flex-1 h-14` / `flex-2 h-14` | R14: `h-13.5` |
| E16 | Nota de reinicio | `font-size: 14px; line-height: 1.4; color: var(--muted)` | `text-sm font-normal text-muted` | R15: `leading-body` |
| E17 | Error al guardar | `<p role="alert">` 14/1.4 danger tras las acciones | `geofence-editor-error` `text-danger` | R15 |
| E18 | Solo lectura | mapa `height="720"`, hoja sin `top` (se ajusta al contenido), nombre 16/800, radio **15/700**, nota 14/1.4 muted; sin pista ni asa | radio `font-bold text-foreground` (sin tamaño), nota `text-sm font-normal text-muted` | R15 |
| E19 | Nueva | sin «Activa», sin nota, sin Eliminar; Guardar deshabilitado `background: var(--default); color: var(--muted)` a todo el ancho | igual | igual |
| E20 | Estados | cabecera en contenido (volver 24/2.4 `margin-left: -10px` + h1 «Zona segura» 26/900); tarjetas `border-radius: 20px; border: 1px; padding: 24px 16px`, 15/1.4 muted centradas; carga = 3 barras (`48px` r12, `8px` r4, `48px` r16, `gap: 10px`); error de carga igual que Z22 | volver nativo opaco, título `geofence-editor-title` en el `ScrollView`, `Card items-center py-8` con `text-center font-normal text-muted`, un `Skeleton h-24` | R16, R17, R18 |

## Dependencias y precondiciones

- #197 (`mobile-canvas-foundations`) en `dev`: `ScreenHeader`, `BackButton strokeWidth`, `ToggleSwitch`, `useShadows`, `leading-body`, `leading-note`, `tracking-dialog`, `rise` 14/400 y `src/components/rise-in.tsx` (#197 R24, commit ece57bea de `feature/197-mobile-canvas-foundations`: `export function RiseIn({ delayMs, testID, className, children }: { delayMs: number; testID?: string; className?: string; children: ReactNode })`, con `MOTION_RISE_TIMING` y `MOTION_RISE_OFFSET_Y` de `theme/motion` y sin `entering` con reduce motion).
- Rama `feature/202-mobile-canvas-zones` re-basada sobre `dev` tras esos merges; la Base medida se re-mide entonces.

## Decisiones técnicas

- D1-D12 de [[requirements]] § Decisiones con defecto, más D8 enmendada: la entrada es `RiseIn` de #197 R24.
- `ConfirmDialog` sobre `Modal` de React Native (no portal de heroui): sin dependencia nueva y con atrás de Android gratis vía `onRequestClose`.
- El velo usa una constante `rgba` en TS (como `shadows.ts` de #197), no una clase arbitraria ni un hex.
- Las clases nuevas del nombre van delante del sufijo de hoy para no reabrir `#189 R10`.
- `header-layout.ts` se borra en el último commit de código (R2), cuando ya nadie lo importa.

## Archivos afectados

Todos en la capa de presentación (`mobile-pet-tracker/src/`):

| Fichero | Cambio | R |
|---|---|---|
| `screens/geofences/index.tsx` | cabecera, glifo, interruptor, aviso, papelera, diálogo, esqueleto, errores | R1, R3-R6, R8, R10, R11 |
| `screens/geofence-editor/index.tsx` | interruptor, diálogo, fila flotante, hoja, nombre, acciones, textos, estados, esqueleto, error | R4, R9, R12-R19 |
| `components/confirm-dialog.tsx` (nuevo) | diálogo compartido | R7 |
| `app/_layout.tsx` | `headerShown: false` en dos rutas | R2 |
| `theme/header-layout.ts` | se borra | R2 |
| `i18n/catalog.ts` y `ui-copy-table.ts` | `geofences.loadingLabel`, `geofenceEditor.loadingLabel` | R10, R18 |
| Tests GZ, GE, LY, CD (nuevo), ZF (nuevo) y los agregados del inventario | candados | todos |
| `docs/ui-guidelines.md`, `docs/conventions.md` | enmienda de la carta | R20 |

§ Enmienda #202: el texto literal está en R20 de [[requirements]].

## Alternativas descartadas

- Mantener la cabecera nativa transparente y solo cambiar offsets: el canvas dibuja la cabecera en contenido y #197 ya da `ScreenHeader`.
- `Dialog` de heroui-native: su animación y radio no son los del canvas y meterían `twMerge` en los textos 15.
- Entrada `rise` propia del diálogo: el coordinador fija `RiseIn` de #197 R24 como única entrada compartida.
- `Map` de reicon con otro trazo: no dibuja el círculo discontinuo del canvas.
- Extender `EmptyState` para las tarjetas de estado del Editor: lo veta el encargo (#198).

## Riesgos

- Choque con #201 en `_layout.tsx`: son dos líneas de `options`; se resuelve en el rebase.
- iOS puede recortar las sombras de los `BlurView` con `overflow-hidden`; fuera del smoke Android.
- Los `it.each` de GZ/GE que confirman vía espía de `Alert` son muchos: el inventario los nombra y la enmienda mecánica cubre los que falten por literal.
- `CONTINUOUS_CORNER` en `consistency-classnames`: `#62 R14` y `#98 R10` no se mueven mientras Zonas conserve sus 3 `style={CONTINUOUS_CORNER}` (R6 lo exige en la papelera; las `Card` del esqueleto ponen la esquina dentro de `components/card.tsx`). Sí se mueve `#189 R9`, que afirma literal el `style` de la hoja del Editor: R13 lo enmienda.
- `RiseIn` envuelve la hoja del Editor: sin `shrink` en el envoltorio la hoja deja de encoger bajo el teclado (`flexShrink` vale 0 por defecto en React Native). R13 pone `className="-mt-6.5 shrink"`; el punto 7 del smoke lo confirma.
