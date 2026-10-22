---
feature: mobile-geofences-canvas-fidelity
id: 189
status: draft        # draft | approved
tags: [mobile, ui, canvas, geofences, spec]
---

# Tareas — #189 Zonas seguras y Editor de zona fieles al canvas

Reglas: un commit rojo y un commit verde por requisito, test primero; nunca implementación y test en el
mismo commit (C4 de `CHECKPOINTS.md`). Todas las órdenes desde `mobile-pet-tracker/` (`cd` literal en
cada cadena). Jest de un fichero con `bunx jest <ruta> --testTimeout=30000`, solo con
`pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos. **No** `./init.sh`.
Rutas con paréntesis, escapadas. RNTL 14: `await` en `fireEvent`, `render` y `act`. Tras cada verde:
`bunx tsc --noEmit` y `bunx expo lint --no-cache > log 2>&1 && ! grep -qF 'Failed to run' log`.
Esperas: seguir `.claude/agents/leader.md` §Esperas (sin esperar al contador de mock). Abreviaturas de
tests (F, E, P, L, C, I, X): requirements §3. Skill: `expo:expo-overview` (en Codex, el nombre de su
catálogo). Las decisiones D1-D10 de requirements §0 se implementan con el valor que el humano firme en
el gate; si firma otro, la spec se enmienda antes del handoff. `Date.now()` no va en el render.

## H0 — Arranque

1. `git fetch origin && git merge origin/main` en la branch; registrar el hash como H0.
2. Precondición P1-P11 (requirements §2). Si alguna falla: **PARA**, nada más. Si no hay
   `node_modules`, `bun install --frozen-lockfile` y copiar `.env` del repo principal.
3. Medir M1-M9 y anotar la base en `progress/impl_mobile-geofences-canvas-fidelity.md`.
4. Medir por contenido las líneas de §4 que dependen de H0 (no por número): `grep -nF
   "geofence-editor-delete" src/__tests__/chunky-cta-canvas-fidelity.test.ts`; `grep -nF "R14_GEOFENCES"
   src/__tests__/ui-language.test.ts`; `grep -nF "title: 't:geofences.title'"
   src/app/__tests__/layout.test.tsx`; `grep -nF "rounded-tile" src/__tests__/profile-canvas-fidelity.test.ts`;
   `grep -nF "rounded-14" src/__tests__/design-drift.test.ts`.
5. Sonda de compilación (fichero temporal en el scratchpad, no commiteado): `-mt-6.5`, `rounded-t-hero`,
   `h-1.25`, `h-12.5`, `flex-2`, `size-11` resuelven en uniwind. Anotar el resultado; si alguna falla,
   **PARA** y avisa al leader.
6. Sonda `twMerge` en `Card` (R5.1): con `className="flex-row items-center gap-3 px-3.5 py-3 shadow-none"`
   la clase final conserva `bg-surface` y `rounded-card`. Anotar.

## R4 — `zoneCategory` (primero: lo usan R5 y R6)

- [ ] (1) Rojo (P): `describe('#189 R4: …')` con `zoneCategory(0..4)`, el valor 5 y que nunca es `neutral`.
- [ ] (2) `ZONE_SLOT_ORDER` y `zoneCategory` en `src/utils/category-palette.ts`.
- [ ] (3) Refactor: sin duplicar nombres de clase fuera de `CATEGORY_SLOTS`; sonda de mutación (intercambiar dos ranuras).

## R15 — Catálogo y tabla de copia (antes de las pantallas, para que `t()` exista)

- [ ] (1) Rojo (I): longitud del catálogo +5 y las cinco filas EN/ES en `language-provider.test.tsx`.
- [ ] (2) Cinco claves en `src/i18n/catalog.ts`, en `en` y en `es`. Las filas de `ui-copy-table.ts` y el
  recuento de `ui-language.test.ts` se hacen **con** cada pantalla (R1, R5, R6, R8, R11), no aquí.
- [ ] (3) Refactor: claves ordenadas junto a las de su grupo.

## R1 — Título en el contenido y contador (Zonas + layout)

- [ ] (1) Rojo (L, F): `title: ''` en las dos `Stack.Screen` (enmendar los dos `it` de layout con el
  sufijo `(enmendado por #189 R1.1)`); encabezado, rol `header` y contador en las seis ramas.
- [ ] (2) `_layout.tsx` y `geofences/index.tsx` (`geofences-header`, `geofences-title`, `geofences-counter`);
  mover la fila de título de `ui-copy-table.ts` y añadir `geofences.counter`.
- [ ] (3) Refactor; sonda: contador también en `no-tracking` ⇒ rojo.

## R2 — Barra de cinco segmentos

- [ ] (1) Rojo (F): clases por segmento (un `expect` por segmento) con 0, 2 y 5; `progressbar` y su valor.
- [ ] (2) `geofences-progress` y sus cinco segmentos; `geofences.progressLabel` en la tabla.
- [ ] (3) Refactor; sonda `i <= n` ⇒ rojo.

## R3 — Métricas del contenedor y orden de hijos

- [ ] (1) Rojo (F): `contentContainerStyle` exacto y `childTestIds` en cuatro escenarios; enmendar el `it`
  A11 (`(enmendado por #189 R3)`).
- [ ] (2) Contenedor con `paddingHorizontal 20`, `paddingTop 24`, `paddingBottom insets.bottom + 40`, `gap 12`, `flexGrow 1`.
- [ ] (3) Refactor.

## R5 — Fila de zona

- [ ] (1) Rojo (F): por fila un `expect` por decisión (contenedor, orden de hijos, tile, icono y su tinta,
  textos, nombre accesible, destino, interruptor, papelera y su confirmación, `HomeEntrance`); cinco
  ranuras con cinco zonas. Enmendar los `it` viejos de #41/#146 que fijan la clase vieja.
- [ ] (2) `Card` + tile + columna + `Switch` + papelera; `useThemeColors` con los cinco tokens; `reicon`
  `Map` y `Trash`; `geofences.deleteLabel`; añadir `screens/geofences/index.tsx` a la lista de
  `rounded-14` de `design-drift` (X).
- [ ] (3) Refactor; sonda: `bg-category-green` literal en la pantalla ⇒ rojo (R18).

## R6 — Aviso de límite

- [ ] (1) Rojo (F): aviso con 5 zonas (clases, texto en dos idiomas, orden, hijos) y ausencia con 4,
  `family` y error.
- [ ] (2) `geofences-limit-entrance` + `geofences-limit` + `geofences-limit-text` con `AlertCircle`;
  `rounded-tile` en la lista de `profile-canvas-fidelity` (X).
- [ ] (3) Refactor.

## R7 — «Añadir zona»

- [ ] (1) Rojo (F, X): receta primaria con 4 zonas y vacío, gris con 5, `busy` conserva primario, sin
  navegar al pulsar con 5; `rounded-16` 1 → 2 en `chunky-cta`; fila `geofences-add` de `CTA_ROWS`.
- [ ] (2) Ternario de dos literales en `geofences/index.tsx`; `mt-auto` con `flexGrow: 1`.
- [ ] (3) Refactor; sonda: `bg-default` con 4 zonas ⇒ rojo.

## R8 — Título del Editor

- [ ] (1) Rojo (E, L): píldora de cristal tras el mapa en el formulario; título plano primer hijo en las
  cinco ramas de estado.
- [ ] (2) `BlurView` + `Text` en `geofence-editor/index.tsx`; fila de título movida en `ui-copy-table.ts`.
- [ ] (3) Refactor; sonda: píldora antes del mapa ⇒ rojo.

## R9 — Hoja sobre el mapa

- [ ] (1) Rojo (E): hoja con `-mt-6.5 rounded-t-hero bg-surface` y métricas nuevas; agarradero oculto;
  sugerencia sobre el mapa solo para dueño; ningún ancestro de `PetMap` con `bg-`. El bloque del
  teclado (`paddingBottom: 291`) se conserva idéntico.
- [ ] (2) Reestructurar el formulario; `CONTINUOUS_CORNER`; contar usos en `consistency-classnames` (X).
- [ ] (3) Refactor; sonda: `bg-surface` en el `View` del mapa ⇒ rojo.

## R10 — Campo Nombre

- [ ] (1) Rojo (E): `Label.Text` con la clase y los dos idiomas; clase del `Input`; solo lectura.
- [ ] (2) Cambios en `geofence-editor/index.tsx`.
- [ ] (3) Refactor.

## R11 — Bloque Radio

- [ ] (1) Rojo (E): orden y clases del bloque; extremos iguales a `minValue`/`maxValue` leídos de las
  props; valor se actualiza; inexistente en solo lectura.
- [ ] (2) Cabecera, slider sin cambios y extremos; `geofenceEditor.radiusTitle` y `geofenceEditor.meters`.
- [ ] (3) Refactor; sonda: `maxValue={2001}` ⇒ rojo.

## R12 — Fila «Activa»

- [ ] (1) Rojo (E): clase de la etiqueta y orden de hijos; no existe al crear.
- [ ] (2) Implementación mínima.
- [ ] (3) Refactor.

## R13 — Acciones

- [ ] (1) Rojo (E, X): clases y estilos de Eliminar y Guardar en cada estado; orden y cardinalidad;
  `NEUTRAL_ROWS`, `neutralInventory`, `excluded` de #177 R8.4 y `rounded-16` 1 → 3 en `chunky-cta`.
- [ ] (2) Fila `geofence-editor-actions`; ternario de Guardar; receta neutra de Eliminar.
- [ ] (3) Refactor; sonda: `bg-default` en Guardar con nombre válido ⇒ rojo.

## R14 — Estados conservados

- [ ] (1) Rojo (E): métricas de las ramas de estado y título que las precede; `#146 R6/R16` intactos.
- [ ] (2) Implementación mínima.
- [ ] (3) Refactor.

## R16 — Carta

- [ ] (1) Rojo (C): una frase fija de la carta por R16.1-R16.4.
- [ ] (2) Editar `docs/ui-guidelines.md` (y `docs/conventions.md` solo si un candado lo exige).
- [ ] (3) Refactor.

## R17 — Invariantes

- [ ] (1) Verificar (sin test nuevo) que los `describe` de #41/#146/#155/#159 siguen y que solo llevan
  el sufijo de enmienda las aserciones que R1-R14 mueven.
- [ ] (2) Corregir lo que el barrido encuentre.
- [ ] (3) Refactor.

## R18 — Candados de fuente

- [ ] (1) Rojo (C): `geofences-canvas-fidelity.test.ts` con sus sondas plantadas en la zona ciega.
- [ ] (2) Ajustar las pantallas si algún candado aparece rojo.
- [ ] (3) Refactor.

## Cierre

- [ ] Medir los candados agregados de requirements §4 tras el último verde y registrar base + delta.
- [ ] `progress/impl_mobile-geofences-canvas-fidelity.md` completo; `traceability.md` sin filas «pendiente».
- [ ] Smoke (requirements §6) lo corre el humano.

## Enmienda E4 (§4.4): no empieces sin la casilla E4 firmada

Commits test-primero (rojo solo tests, verde solo producción y docs), un par por requisito; esperas según
`.claude/agents/leader.md` §Esperas; sin `./init.sh`; RNTL 14 con `await`. Mide la base de M10-M19 antes
de tocar y registra base + delta en `progress/impl_mobile-geofences-canvas-fidelity.md`.

## H0-E4 — Medidas previas

- [ ] Verificar que la casilla E4 está firmada y que DE4-1..DE4-5 siguen con el valor por defecto (o el que fijó el humano).
- [ ] Medir M10-M19 con los comandos de requirements §4.4 y anotar la base.
- [ ] Verificar contra los ficheros el mock de `expo-router` de los tests de pantalla antes de ampliarlo.

## R23 — Constantes de cabecera

- [ ] (1) Rojo (C): test que importa `src/theme/header-layout.ts` (no existe) con ventana propia (42 ± 8, 70 ± 8, 56, 44) y sondas P-E4-8.
- [ ] (2) Implementación mínima: crear `header-layout.ts` con las seis `export const`.
- [ ] (3) Refactor.

## R19 — Bloqueado no es atenuado

- [ ] (1) Rojo: (C) barrido de `isDisabled` ⇒ `KEEP_OPACITY` y definición en `native-styles.ts`; (F)/(E) `opacity === 1` bajo `busy` (Guardar vacío sin `busy`: igualdad del flatten real, corregida por E5); enmendar `#177 R3.1` (fila Guardar), `R4.1` (Eliminar), `R7.5`, `R8.1` del lado del Editor.
- [ ] (2) Implementación mínima: `KEEP_OPACITY` + los dos `Switch` + Eliminar + Guardar del Editor.
- [ ] (3) Refactor.

> **Aclaración del leader (2026-10-22, parada de Codex en R19; sin cambio de ningún R):** el candado (C) de R19.1/R19.2 barre
> **todas** las etiquetas con `isDisabled=`, y eso incluye `geofences-add` (R20), así que R19 no puede quedar verde antes de R20.
> Los pasos de R19 y R20 se ejecutan así: (1) commit rojo de R19; (2) commit rojo de R20; (3) **un solo commit verde
> `feat(mobile): #189 E4 R19 R20 …`** con `KEEP_OPACITY`, los dos `Switch`, Eliminar, Guardar y Añadir zona. Cada R conserva su rojo
> propio antes del verde (C4); las filas R19 y R20 de `traceability.md` comparten el hash verde.

## R20 — «Añadir zona»

- [ ] (1) Rojo (F): límite `toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })` (corregido por E5; antes `toEqual({ opacity: 1 })`), `busy` con receta primaria y opacidad 1, clase `disabled:element-disabled` presente; enmendar `#177 R3.1` (fila Añadir), `R7.5`, `R8.1` del lado de Zonas; corregir la frase falsa de R7.2.
- [ ] (2) Implementación mínima: `style={atLimit ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}`.
- [ ] (3) Refactor.

## R21 — Zonas, cabecera transparente

- [ ] (1) Rojo: (L) `layout.test.tsx` con `headerStyle` transparente y `headerTransparent: true`; (F) `paddingTop: 46`, sin `contentInsetAdjustmentBehavior`, `h-11 flex-row items-center gap-2` y `paddingLeft` = `ZONES_TITLE_OFFSET`.
- [ ] (2) Implementación mínima: `_layout.tsx` y pantalla de Zonas.
- [ ] (3) Refactor.

## R22 — Editor, cabecera transparente

- [ ] (1) Rojo (E): mock de `Stack.Screen`; opciones por rama, transición, identidad (`Object.is`); teclado 200 con `paddingBottom: 0` antes; `childTestIds` y cadena de padres con `geofence-editor-title-row`; ancla negativa `HeaderHeightContext` = 0 probada con P-E4-9.
- [ ] (2) Implementación mínima: `Stack.Screen` por rama, `useMemo`, `keyboardVerticalOffset={0}`, fila de la píldora.
- [ ] (3) Refactor.

## R24 — Carta

- [ ] (1) Rojo (C): enmendar `#189 R16.1` y añadir `#189 R24.1/2/3` con las frases fijas.
- [ ] (2) Editar `docs/ui-guidelines.md` y una frase en `docs/conventions.md` (sin escribir `[X]`).
- [ ] (3) Refactor.

## Cierre E4

- [ ] Re-medir M10-M19 y los candados agregados de requirements §4.4 (base + delta); anclas negativas tras su verde.
- [ ] Sondas P-E4-1..13 ejecutadas y registradas en el informe.
- [ ] `traceability.md` sin filas «pendiente» de R19-R24.
- [ ] Smoke §6 pasos 6-10: lo corre el humano; no se afirma ejecutado.

## Enmienda E5 (§4.5): no empieces sin la casilla E5 firmada

Solo toca la aserción del estilo aplanado de un `Button` de heroui; la producción de R19/R20 no cambia y el
orden rojo → verde de E4 tampoco. Lista cerrada: `src/screens/geofences/index.test.tsx` y
`src/screens/geofence-editor/index.test.tsx` (desde `mobile-pet-tracker/`), solo las tres aserciones de
requirements §4.5. Mismas reglas de commits y esperas que E4; sin `./init.sh`.

## R20 rojo-corrección (E5)

- [ ] Verificar contra el fichero las dos aserciones `toEqual({ opacity: 1 })` de `geofences/index.test.tsx` (rama `count === 5` del `it.each` de R7 y `it` «#189 R20.1») y sustituirlas por `toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })`. Un commit de test: `test(mobile): #189 E5 R20 rojo-corrección — …`.
- [ ] Comprobar que el test sigue **rojo** por la ausencia de `KEEP_OPACITY` (recibido sin `opacity`), no por el literal esperado.

## R19 rojo-corrección (E5)

- [ ] Misma corrección en `geofence-editor/index.test.tsx`, `it` «Guardar vacío permanece gris…» (`geofence-editor-save`). Un commit de test aparte: `test(mobile): #189 E5 R19 rojo-corrección — …`. Sigue rojo hasta el verde conjunto.
- [ ] Los demás `?.opacity` `toBe(1)` y los `toHaveStyle` **no se tocan**.

## Cierre E5

- [ ] Los dos commits de corrección van **antes** del verde conjunto `feat(mobile): #189 E4 R19 R20 …`.
- [ ] Tras el verde, replantar P-E4-4 (`style={chunkyLip.primary}` en el límite): el `toEqual` corregido debe ponerse rojo por la clave `boxShadow`; registrar la salida en el informe.
