---
feature: "mobile-canvas-routine"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-canvas-routine]]

Feature #204 del plan `progress/plan_canvas-parity-2026-10-23.md` (ola 2).
Lleva Recordatorios (`src/screens/reminders/index.tsx`), Agregar
recordatorio (`src/screens/add-reminder/index.tsx`) y Documentos
(`src/screens/docs/index.tsx`) al canvas versión `1792777983-cd94`, artboards
`Recordatorios`, `NuevoRecordatorio` y `Documentos`, congelados en
`specs/mobile-canvas-routine/canvas/`. Cubre la parte de Recordatorios de C18
de `progress/explore_canvas-parity-2026-10-21.md` (fila Q07: hoja de borrado
sin receta chunky y `rounded-xl bg-danger(-soft)` en el fichero). Las rutas de
este documento son relativas a `mobile-pet-tracker/src/` salvo que digan otra
cosa.

## Premisas contrastadas

Medidas sobre el árbol del worktree en `81cb6d6b` (`origin/dev` con #197).

| # | Premisa | Resultado |
|---|---|---|
| P1 | El explore (Q08) decía que `SELECTED_CHIP` de Agregar recordatorio lleva `border-b-3 border-black/25` | **Caducada.** #197 ya lo migró: hoy es `'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent'` con `style={chunkyLip.primaryCompact}`. No queda nada de C03 en esta pantalla. |
| P2 | El explore (Q11) daba Documentos en paridad | Cierto en el cuerpo (filtros, filas, mosaico, subida). Lo único distinto es la cabecera: el canvas dibuja volver en contenido, y hoy lo pone la cabecera nativa. |
| P3 | Las tres pantallas tienen cabecera nativa | Cierto: `app/_layout.tsx` les da `{ ...headerOptions, title: '' }` a `reminders`, `add-reminder` y `pets/[petId]/docs`. |
| P4 | `ScreenHeader` cubre las tres cabeceras | Cubre título de 26 (Recordatorios), de 24 (Agregar), eyebrow (Documentos) y accesorio («Nuevo»). **No** cubre el esqueleto del título de Documentos mientras carga la mascota (`docs-header-skeleton`): ver D8. |
| P5 | Las filas de Recordatorios y Documentos entran con `HomeEntrance` | Cierto. `HomeEntrance` ya usa `MOTION_RISE_OFFSET_Y` y `MOTION_RISE_TIMING` con paso `MOTION_STAGGER_MS` (60). El canvas de Recordatorios escalona 0/70/140 ms; el de Documentos 0/60/120/180 ms. |
| P6 | El copy del canvas coincide con el catálogo | Cierto para todo lo que la pantalla pinta, salvo la previa de Agregar: el canvas dice «Te avisaremos el 5 oct a las 09:00» y el catálogo `addReminder.notifyPreview` = `'Te aviso el {{date}} a las {{time}}.'`. Manda la Voz B (Pingo en primera persona): se conserva el catálogo. **Ninguna clave i18n nueva.** |
| P7 | Las píldoras de Recordatorios ya son las del canvas | Cierto: radio 16, `px-3 py-2.5`, cifra `text-2xl font-black`, etiqueta `text-xs font-bold`; `bg-surface-secondary` = `#F0FBF6` = `--surface2`. |
| P8 | La hoja de borrado ya es la del canvas | Contenedor, icono, título, referencia y cuerpo sí. Los dos botones no: «Eliminar» no tiene alto ni labio (`w-full rounded-xl bg-danger`, etiqueta `font-bold`) y «Cancelar» mide 56 con etiqueta de 17 (canvas: 54 y 16). |
| P9 | `node_modules` existe en el worktree | Al escribir la spec, no; el leader lo instaló después con `bun install --frozen-lockfile`. Nada de esta spec se ha ejecutado: las cifras son de `grep` sobre fuentes. |

## Contraste con el artboard

Literales sacados de la copia congelada. «=» es paridad medida; «→» es lo que
cambia esta feature.

**Recordatorios** (`canvas/Recordatorios.dc.html`)

| Elemento | Canvas | Hoy | Spec |
|---|---|---|---|
| Marco | `padding: 56px 20px 32px; ... gap: 14px` | cabecera nativa + `paddingTop: 24`, `gap: 14` | → sin cabecera nativa, `paddingTop: insets.top + 12`, `gap: 14` (R1, R4) |
| Volver | `width: 44px; height: 44px; margin-left: -10px`, `stroke-width="2.4"` | nativo | → `ScreenHeader` (R4) |
| Título | `font-size: 26px; font-weight: 900; letter-spacing: -0.02em` | `text-26 font-black tracking-title` | = (lo pinta `ScreenHeader` size 26) |
| «Nuevo» | `height: 40px; padding: 0 14px; border-radius: 12px; background: var(--accent); ... box-shadow: 0 3px 0 var(--lip)`, 14/800 | `rounded-xl bg-accent h-10 gap-1.5 px-3.5` + `chunkyLip.primaryCompact` | = (pasa a accesorio de `ScreenHeader`) |
| Píldoras | `border-radius: 16px; ... padding: 10px 12px`, 24/900, 12/700 | igual | = |
| Fila | `border-radius: 22px; ... padding: 14px; display: flex; gap: 12px` | `rounded-22 p-3.5 gap-3` | = |
| Borde de la fila próxima | `border: 2px solid var(--amber)` (`--amber` = `#FFF7ED`) | `border-2 border-warning-soft` | → `border-2 border-category-amber` (R7) |
| Badge «¡Próximo!» | `padding: 3px 8px; border-radius: 999px; background: var(--amber); color: var(--amber-s)`, 11/800 | `bg-warning-soft ... text-warning-strong` | → `bg-category-amber ... text-category-amber-strong` (R7) |
| Entrada de fila | `animation: rise 400ms ease-out both` / `70ms` / `140ms` | `HomeEntrance` paso 60 | → `RiseIn` paso 70 (R6) |
| «Eliminar» de fila | `height: 44px; padding: 0 10px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger); font: 800 13px` | `rounded-xl bg-danger-soft`, `size="sm"`, etiqueta `font-semibold text-danger` | → `h-11 rounded-14 bg-category-rose px-2.5`, etiqueta `text-13 font-extrabold text-danger` (R8) |
| Hoja: contenedor | `border-radius: 28px 28px 0 0; ... padding: 12px 20px 36px; ... gap: 12px` | `items-center gap-3 bg-surface px-5 pb-9 pt-3` | = |
| Hoja: «Eliminar» | `height: 54px; border: 0; border-radius: 16px; background: var(--danger); ... box-shadow: 0 4px 0 #9F1F15; font: 800 16px` | `w-full rounded-xl bg-danger`, `font-bold` | → `h-14 w-full rounded-16 bg-danger` + `chunkyLip.danger`, etiqueta `text-17 font-extrabold` (R9; alto y cuerpo de la carta, D5) |
| Hoja: «Cancelar» | `height: 54px; border-radius: 16px; ... border: 2px solid var(--lip-gray); box-shadow: 0 4px 0 var(--lip-gray)`, 800 16px | `h-14 rounded-16 border-2 border-lip-gray` + `chunkyLip.neutral`, `text-17` | = carta (D5) |

**NuevoRecordatorio** (`canvas/NuevoRecordatorio.dc.html`)

| Elemento | Canvas | Hoy | Spec |
|---|---|---|---|
| Marco | `padding: 56px 20px 32px; ... gap: 16px` | cabecera nativa + `paddingTop: 24`, `gap: 16` | → `paddingTop: insets.top + 12` (R1, R10) |
| Título | `font-size: 24px; font-weight: 900; letter-spacing: -0.02em` | `text-2xl font-black tracking-title` | → `ScreenHeader` size 24 (R10) |
| Chips | `height: 38px; padding: 0 14px; ... border-radius: 999px; font-size: 14px; font-weight: 800`, elegido `box-shadow: 0 3px 0 var(--lip)` | `h-9.5 ... rounded-full px-3.5`, `chunkyLip.primaryCompact` | = |
| Campos | `height: 52px; border-radius: 12px; background: var(--default)`; foco `border: 2px solid var(--accent)` | `h-13 rounded-xl bg-default ... border-2` | = |
| Fecha/Hora | `grid-template-columns: 3fr 2fr; gap: 10px` | `flex-3` / `flex-2`, `gap-2.5` | = |
| Previa | `border-radius: 18px; background: var(--surface2); padding: 12px 14px; ... gap: 10px`, 13/600 | `rounded-tile bg-surface-secondary px-3.5 py-3 gap-2.5`, `text-13 font-semibold` | = |
| «Guardar» | `margin-top: auto; height: 56px; border-radius: 16px; ... box-shadow: 0 4px 0 var(--lip)`, 17/800 | `h-14 rounded-16 bg-accent` + `chunkyLip.primary`, sin `mt-auto` | → `mt-auto` y contenedor con `flexGrow: 1` (R10, R11) |

**Documentos** (`canvas/Documentos.dc.html`)

| Elemento | Canvas | Hoy | Spec |
|---|---|---|---|
| Marco | `padding: 56px 20px 32px; ... gap: 14px` | cabecera nativa + `paddingTop: 24`, `gap: 14` | → `paddingTop: insets.top + 12` (R1, R12) |
| Eyebrow | `font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--muted)` | igual, sin volver | → `ScreenHeader` con eyebrow (R12) |
| Filtros | `height: 34px; padding: 0 12px; border-radius: 999px; ... font-size: 13px; font-weight: 800`, `gap: 6px` | `h-8.5 rounded-full px-3`, `text-13 font-extrabold`, `gap-1.5` | = |
| Fila | `border-radius: 20px; background: var(--surface); border: 1px solid var(--border); padding: 12px 14px; ... gap: 12px` | `Card` (`rounded-card` = 20, `border border-border bg-surface`) + `px-3.5 py-3 gap-3 shadow-none` | = (`Card` se queda) |
| Mosaico | `width: 48px; height: 56px; border-radius: 12px` | `h-14 w-12 rounded-xl` | = |
| Entrada de fila | `rise 400ms ease-out 0ms` / `60ms` / `120ms` / `180ms` | `HomeEntrance` paso 60 | → `RiseIn` paso `MOTION_STAGGER_MS` (R14) |
| Subir | `margin-top: 6px; border-radius: 24px; border: 2px dashed var(--lip-gray); padding: 18px` | `mt-1.5 rounded-24 border-2 border-dashed border-lip-gray p-4.5` | = |

El texto de los artboards se leyó como dato de diseño. Ningún texto de los
tres ficheros contiene instrucciones dirigidas a un agente.

## Dependencias y precondiciones

- **#197 en la base** (`81cb6d6b`): `ScreenHeader` y `BackButton` (`router.canGoBack() ? router.back() : router.replace(fallback)`), `RiseIn`, `useChunkyLip()` con la variante `danger` y `MOTION_RISE_TIMING` / `MOTION_RISE_OFFSET_Y`.
- **Sin dependencias nuevas, sin coste, nada en AWS.** `node_modules` ya está instalado en el worktree (`bun install --frozen-lockfile`).
- **Features paralelas que no están en `dev`** y ficheros compartidos:

| Fichero compartido | Otras features | Riesgo | Resolución |
|---|---|---|---|
| `src/theme/motion.ts` y la lista «no exporta nada más» de `motion.test.ts` | #199 (+7 exports), #200 (+2) | Conflicto de texto en la misma lista | Conservar todas las altas, en orden de `.sort()` |
| `src/app/_layout.tsx` y `layout.test.tsx` (`#95 R4`, `#114 R4`) | #199 (weight-log), #203 (alerts), #200, #202 | Conflicto en líneas vecinas | Cada línea es de una ruta: conservar todas |
| `__tests__/profile-canvas-fidelity.test.ts` (lista `text-26`, I32) | #196, #200, #203 | Conflicto de texto en la misma lista de ficheros: cada feature que pasa un título a `ScreenHeader` borra su línea | Cada línea es de un fichero: conservar todas las bajas; la lista final es la de `components/screen-header.tsx` más los ficheros que aún pinten `text-26` |
| `__tests__/alerts-canvas-fidelity.test.ts` (lista `tracking-title`, I33) | #196, #200, #203 | Mismo mecanismo que la lista `text-26`, en la fila `tracking-title` del `it.each` | Conservar todas las bajas; el título del `it.each` acumula un sufijo por feature y R |
| `canvas-foundations.test.ts` › `#197 R20` | Toda feature que adopte `ScreenHeader` o `RiseIn` | La primera que mergee lo borra | Si ya no existe, el paso de R1 no tiene efecto |
| `src/components/screen-header.tsx` | #199, #200, #202, #203 y #205 lo **consumen**; ninguna spec de la ola lo modifica | Si otra añade una prop, conflicto en el tipo | #204 es dueña de la prop opcional `titlePlaceholder` (decisión del leader, D8); la otra rebasa detrás |
| Final de `docs/ui-guidelines.md` | Toda feature con enmienda | Conflicto de texto al final | Conservar los bloques en orden de número de feature |
| Recuentos de `chunky-cta-canvas-fidelity.test.ts` (`#177 R6.2`, `R7.3`) | Toda feature que toque `Button.Label`, `text-17` o radios de 16 | Cifras encadenadas | Re-medir tras cada merge (tasks.md § Cuentas) |

#198 (`EmptyState`) y #196 (`trailing` de `PetSwitcher`) tocan componentes
que #204 usa pero no modifica: sin colisión.

## Decisiones técnicas

Las catorce decisiones con su defecto están en requirements.md § Decisiones
con defecto (D1 a D14). Resumen por pantalla:

- **Rutas** (R1): `headerShown: false` en las tres; la carta (Enmienda #197, punto 7) pide que cada pantalla lo haga en su propia feature. D-H no se edita.
- **`ScreenHeader`** (R2): una sola prop nueva, `titlePlaceholder?: ReactNode`, que se pinta en la columna `flex-1` en lugar del título cuando `title` falta. Es lo mínimo para que Documentos conserve su esqueleto sin duplicar la cabecera.
- **Recordatorios** (R4 a R9): la fila `reminders-actions` se sustituye por `ScreenHeader` con «Nuevo» como `accessory`; sin mascotas, el contenedor de hoy se envuelve con una cabecera solo-volver; las filas pasan de `HomeEntrance` a `RiseIn` con paso 70; el ámbar sale de `CATEGORY_SLOTS.amber`; «Eliminar» de fila es tonal rosa; «Eliminar» de la hoja gana cuerpo de 56 y labio `danger`.
- **Agregar** (R10, R11): `ScreenHeader` de 24, sin `HeaderHeightContext` (sin cabecera, el desplazamiento del teclado es 0) y «Guardar» al pie con `flexGrow: 1` + `mt-auto`.
- **Documentos** (R12 a R14): `ScreenHeader` con eyebrow y esqueleto de título, mismo tratamiento de teclado y `RiseIn` con `MOTION_STAGGER_MS`.
- **Fidelidad** (R15 a R17): un fichero nuevo, `src/__tests__/routine-canvas-fidelity.test.ts`, que lee el artboard congelado y la fuente en cada fila, comprueba la carta y deja las fuentes grep-limpias.

### Bloque «Enmienda #204»

Texto canónico que R16 añade al final de `docs/ui-guidelines.md` (el test lo
lee de esta valla). No se edita ninguna línea existente de la carta.

```markdown
## Enmienda #204 — rutina en el canvas: Recordatorios, Agregar recordatorio y Documentos

Fecha: 2026-10-23. Feature #204 `mobile-canvas-routine`. Lleva las tres pantallas a sus artboards del canvas.

1. **Entrada `rise` fuera de Inicio.** Las filas de Recordatorios y de Documentos entran con `RiseIn` (`MOTION_RISE_TIMING`, `MOTION_RISE_OFFSET_Y`), escalonadas por índice: Recordatorios con `MOTION_REMINDERS_STAGGER_MS` (70 ms) y Documentos con `MOTION_STAGGER_MS` (60 ms). Bajo reduce motion no hay entrada.
2. **«Eliminar» de la hoja de borrado de recordatorio.** Sale de «Sin labio» (regla 13): `h-14 w-full rounded-16 bg-danger` con `style={chunkyLip.danger}` y etiqueta `Text` 17/800 `text-danger-foreground`. Con «Cancelar» (56 px, 17/800, labio `neutral`) el par de la hoja queda simétrico: sustituye el «par asimétrico» de la Enmienda #177 para esta hoja. Los demás destructivos siguen sin labio.
3. **«Eliminar» de fila de recordatorio.** Tonal y sin labio: `h-11 rounded-14 px-2.5` sobre `CATEGORY_SLOTS.rose.surface`, `variant="danger-soft"` y etiqueta `Text` 13/800 `text-danger`.
4. **Ámbar de la fila próxima.** Borde `border-2 border-category-amber` y badge con `CATEGORY_SLOTS.amber.surface` y `CATEGORY_SLOTS.amber.ink`; Recordatorios deja `warning-soft` y `warning-strong` para este uso.

Detalle y tests en `specs/mobile-canvas-routine/requirements.md` (R1 a R18).

- [ ] Enmienda #204 aprobada por humano
```

## Archivos afectados

Solo capa de presentación de la app móvil (`mobile-pet-tracker/src/`); nada
de `domain`, `application`, `infrastructure` ni del backend.

| Fichero | Cambio | R |
|---|---|---|
| `app/_layout.tsx` | tres rutas a `{ headerShown: false }` | R1 |
| `components/screen-header.tsx` | prop `titlePlaceholder` | R2 |
| `theme/motion.ts` | `MOTION_REMINDERS_STAGGER_MS = 70` | R3 |
| `screens/reminders/index.tsx` | cabecera, marco, sin mascotas, `RiseIn`, ámbar, «Eliminar» de fila y de hoja | R4 a R9 |
| `screens/add-reminder/index.tsx` | cabecera, marco, teclado, «Guardar» al pie | R10, R11 |
| `screens/docs/index.tsx` | cabecera con esqueleto, marco, teclado, `RiseIn` | R12 a R14 |
| `../docs/ui-guidelines.md` | bloque «Enmienda #204» al final | R16 |
| Tests nuevos o ampliados | `app/__tests__/layout.test.tsx`, `components/__tests__/screen-header.test.tsx`, `theme/__tests__/motion.test.ts`, `screens/reminders/index.test.tsx`, `screens/add-reminder/index.test.tsx`, `screens/docs/index.test.tsx`, `__tests__/routine-canvas-fidelity.test.ts` (nuevo) | R1 a R17 |
| Tests enmendados | los del inventario I1 a I39 (requirements.md), incluidos `canvas-foundations`, `legibility-classnames`, `chunky-cta-canvas-fidelity` y `design-drift`; y, desde la auditoría de inventario, `__tests__/profile-canvas-fidelity.test.ts` (I32: R4, R12), `__tests__/alerts-canvas-fidelity.test.ts` (I33: R4, R10, R12) y `screens/docs-upload-form/index.test.tsx` (I36: R12; en R14 también, solo para borrar su doble muerto de `home-entrance`) | R1 a R14 |
| Ficheros de test que toca R12 (lista cerrada) | `screens/docs/index.test.tsx` (cinco `it` nuevos, I20, I21, I34, I35, I39), `screens/docs-upload-form/index.test.tsx` (I36), `__tests__/profile-canvas-fidelity.test.ts` (I32) y `__tests__/alerts-canvas-fidelity.test.ts` (I33) | R12 |

No se tocan: `i18n/catalog.ts`, `ui-copy-table.ts`, `theme/global.css`,
`theme/chunky-lip.ts`, `components/rise-in.tsx`, `components/back-button.tsx`,
`screens/home/home-entrance.tsx`, `PopIn`, `EmptyState`, `PetSwitcher`,
`pets/[petId]/docs-upload`.

## Supuestos

| # | Supuesto | Cómo se verifica |
|---|---|---|
| S1 | En Android edge-to-edge, sin cabecera nativa el contenido empieza en y = 0 y `useSafeAreaInsets().top` es la altura de la barra de estado: `insets.top + 12` deja la cabecera bajo ella | Smoke 1 |
| S2 | Sin cabecera nativa, `HeaderHeightContext` valdría 0 o `undefined`: quitarlo y no pasar `keyboardVerticalOffset` (KAV `behavior="padding"`) es equivalente | Test de I19 (200) y smoke 6 y 8 |
| S3 | NativeWind genera `border-category-amber` desde `--color-category-amber` igual que ya genera `bg-category-amber` de las píldoras | Smoke 4 (los tests de clase no ven el color) |
| S4 | El `twMerge` de HeroUI deja `bg-category-rose` sobre el fondo de `variant="danger-soft"` porque la `className` va detrás | Test de R8 sobre la `className` resuelta |
| S5 | `RiseIn` (#197) respeta reduce motion | Sus tests de #197 y smoke 3 |
| S6 | `flexGrow: 1` en el contenido del `ScrollView` más `mt-auto` lleva «Guardar» al pie sin romper el desplazamiento con teclado | Smoke 6 |

## Alternativas descartadas

- **Cabecera nativa transparente** (patrón #189 E4): el canvas dibuja volver en contenido y la carta (Enmienda #197, punto 7) fija `ScreenHeader` como su forma.
- **Paso `step` en `HomeEntrance`**: modificaría un componente de Inicio; `RiseIn` existe para esto.
- **Paso 60 también en Recordatorios**: 10 ms de desviación por fila frente a un export de una línea.
- **Clases de categoría en literal**: moverían el inventario de `#62` «centraliza las diez clases».
- **Título `t('docs.pet')` mientras carga**: destello de «Mascota» antes del nombre.
- **`Button.Label` con `text-13`/`text-17`**: `twMerge` los expulsa (Enmienda #187).
- **Botones de hoja de 54 px y 16/800**: mueven más candados de #177 que la desviación de D5.

## Riesgos

- **Conflictos de texto** con #196, #199, #200, #202 y #203 en `motion.test.ts`, `layout.test.tsx`, las listas `text-26` y `tracking-title` de `profile-canvas-fidelity.test.ts` y `alerts-canvas-fidelity.test.ts`, y el final de la carta: ver § Dependencias.
- **Recuentos encadenados** de `chunky-cta` y `design-drift` si otra feature mergea antes: re-medir con tasks.md § Cuentas antes de cada commit.
- **Comparar nodos con `toBe`** en los tests de estructura de cabecera puede tumbar el worker de jest en paralelo: comparar por `testID`.
- **Candados que nacen verdes** (R15, R17): se prueban plantando una mutación (tasks.md).
- **Safe area y teclado reales** no los ven los tests: los cierra el smoke de R18.
