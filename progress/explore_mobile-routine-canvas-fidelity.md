# explore: mobile-routine-canvas-fidelity (#175)
Fecha: 2026-10-13
Base medida: worktree `Pet-Tracker-wt-175`, HEAD `68da75ab` (sobre origin/main `788d1f89`, con #168, #169 y #170 dentro).
Rutas relativas a `mobile-pet-tracker/` salvo que digan otra cosa. `*` = sin verificar.

## 1. Resumen

| Artboard | Pantalla | Brecha | Lo más caro |
|---|---|---|---|
| Recordatorios | `src/screens/reminders/index.tsx` | media | tiles (tintas y fondos), fila (tinta de categoría, fecha con hora, insignia), iconos en lugar de emoji; candados de clase exactos |
| Nuevo recordatorio | `src/screens/add-reminder/index.tsx` | media | **C12** (vista previa nueva), chips pastel con seleccionado acento + labio, etiquetas sin mayúsculas, campos 3:2 con icono |
| Horario | `src/screens/meal-schedule/index.tsx` | media–alta | héroe de 3 columnas; botones grises chunky que **revierten #147 R4**; «Generar plan» violeta que sale del inventario de primarios; «Edad» sin dato |
| Historial | `src/screens/meals-history/index.tsx` | baja–media | panel del día fuera del calendario con badge y horas en fila; estilos de celda |
| Documentos | `src/screens/docs/index.tsx` | media–alta | **C11** sobre un `type` de texto libre (filtrar por `documentCategory`), zona de subida en lugar del primario, fecha ISO cruda hoy |

Hallazgos que corrigen premisas del brief:
- `document.type` es texto libre (`z.string().trim().min(1).max(40)`), no
  enum: C11 filtra por categoría de color, no por valor (§3.2).
- Ningún artboard de esta feature dibuja la agrupación por día de
  recordatorios; la del historial ya existe (§3.3).
- Desparasitación es violeta en recordatorios y ámbar en documentos (§3.2).
- La regla «como el artifact» choca con candados vivos en cuatro puntos que
  la spec debe **nombrar** si los revierte: `#61 R3` (opacidad sobre acento),
  `#61 R5` (insignia en `warning`), `#128 R4`/carta §13 (destructivo sin
  labio), `#147 R4` (Editar/Añadir tonales). Más los candados de clase de
  cada test de pantalla (§4.3).
- Transversales: cabecera (D-H) e iconos (D-I) se deciden una vez para
  #174 y #175.

Recomendación de reparto (§7): tres features tras mergear #173:
Documentos (8–10 R-id), Recordatorios + Nuevo recordatorio (12–14),
Horario + Historial (10–12).

## 2. Artboards
### Transversal a los cinco artboards (vale para 2.1–2.5)

Fuente del canvas: `project/<Artboard>.dc.html` leídos con Artifact `read`
(versión `1791913045-37f1`). Todos usan el mismo bloque de variables `.pt` /
`.pt.dark` y los mismos keyframes `rise`/`pop`.

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Cabecera | Botón «Volver» (chevron 24px, 44×44) **dentro del contenido** + `h1` de 24–26px peso 900, `letter-spacing:-0.02em` | Cabecera nativa del Stack: `src/app/_layout.tsx` · `const headerOptions` (`headerShown: true`, `fontFamily: 'Inter-Bold'`, título pequeño) | Título grande en contenido vs título nativo pequeño. `explore_ui-canvas-parity.md` §0 lo trató como «paridad por equivalencia, no se relitiga», pero la regla del humano del 2026-10-13 («el diseño final debe de quedar como el artifac») lo reabre. Decisión **D-H** (§6) | media (5 rutas en `_layout.tsx`; enmienda A11 de la carta sigue valiendo si el header nativo se queda) |
| Fuente del título | peso 900 | `--font-black: 'Inter-Black'` existe (`src/theme/global.css` · `--font-black`) | Ninguna si se usa `font-black`. #173 propone Inter-ExtraBold* (ver §5) | baja |
| Padding de pantalla | `56px 20px 32px`, `gap 14–16` | Carta §Decisiones fijas 6 (A11): `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 24` | 20 vs 24 de lateral. **No tocar**: la carta fija 24 y el canvas es 390px de maqueta | — (se queda) |
| Entrada «rise» | `animation: rise 400ms ease-out Nms both`, escalonada 60–70ms por fila | Ninguna de las cinco pantallas importa motion: `grep -l "theme/motion\|HomeEntrance" src/screens/{reminders,add-reminder,meal-schedule,meals-history,docs}/index.tsx` = vacío | Falta. Reutilizable: `src/screens/home/home-entrance.tsx` · `export function HomeEntrance` (ya lo importan login, register y reset-password desde `../home/home-entrance`) con `MOTION_STAGGER_MS` = 60 y `MOTION_SURFACE_MS` = 400 de `src/theme/motion.ts` | baja–media (por fila repetida, enmienda #70) |
| Iconos | SVG de trazo (jeringa, gota, estetoscopio, documento, reloj, campana, upload, chevron) | Emoji en recordatorios: `src/utils/reminder-meta.ts` · `emoji: '💉'`; la carta dice «la superficie siempre acompaña a **un emoji** y a un texto» (`docs/ui-guidelines.md` · `siempre acompaña a un emoji`) | Cambiar emoji → icono `reicon-react-native` es enmienda de carta. Decisión **D-I** | media |
| Colores | Variables `--blue/-s`, `--amber/-s`, `--green/-s`, `--violet/-s`, `--rose/-s`, `--surface2`, `--default`, `--muted`, `--lip-gray`, `--pill` | Mismos valores exactos en `global.css`: `--color-category-{blue,amber,green,violet,rose}[-strong]`, `--surface-secondary` (= `--surface2`), `--default`, `--muted`, `--color-lip-gray`, `--color-tab-pill` (= `--pill`) | Paridad de tokens salvo los de la fila siguiente | — |
| Colores **sin token** | `--danger` claro `#D92D20` (token `#EF4444`); `--warning` claro `#B54708` (token `#F59E0B`; `--warning-strong` `#92610A`); labio del destructivo `#9F1F15`; labio violeta `rgba(91,63,163,0.35)`; `--lip` acento `#0E5E3C` (el repo usa `border-black/25`, #166) | `grep -nE "#D92D20\|#9F1F15\|#B54708\|#0E5E3C" src/theme/global.css` = 0 | Decisión **D-C** (§6) | baja si no se crean; media si se crean (AA calculado, #61) |
| Radios | 22 (fila de recordatorio), 24 (secciones), 20 (filas de horario/docs), 18 (banner preview), 16 (tiles resumen, botones de hoja), 14 (tiles de icono), 12 (inputs, botón «Nuevo»), 28 (hoja) | Carta §Decisiones fijas 12: **solo** `rounded-card` (20), `rounded-xl` (12), `rounded-full`; `rounded-2xl`/`lg`/`md`/`sm` prohibidos y candados en `src/__tests__/consistency-classnames.test.ts` | Todo radio ≠ 20/12/999 exige token nuevo y enmienda de la regla 12. #173 propone `--radius-hero` y `--radius-tile`* (§5): **reutilizarlos**, no inventar | alta si se persigue cada px; baja si se mapea 22/24→`rounded-card`, 14/16/18→`rounded-xl` o token de #173 |

### 2.1 Recordatorios

Pantalla: `src/app/reminders.tsx` (delgada) → `src/screens/reminders/index.tsx`.
Canvas: `project/Recordatorios.dc.html`.

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Orden | header(volver+título+«Nuevo») → 3 tiles → filas → (hoja de borrado abierta) | `reminders-actions` (botón solo, alineado a la derecha) → `PetSwitcher` → skeleton/error/vacío → tiles → filas → hoja | Falta el título en contenido; el botón «Nuevo» va en una fila propia y no junto al título. El canvas **no** pinta `PetSwitcher` (carta §Dirección de arte 5: no se borra un dato útil; se queda) | baja |
| Botón «Nuevo» | 40px alto, radio 12, icono `+` 16px trazo 2.8, labio `0 3px 0 var(--lip)`, 14px/800 | `testID="reminders-add-link"` · `className="rounded-xl bg-accent border-b-4 border-black/25"`, solo texto `reminders.new` | Falta el icono `+` (reicon `Plus`/`Add`*) y el tamaño compacto (`size="sm"`). El labio ya es el de #166 | baja |
| Tiles resumen | grid 3 col, radio 16, padding 10×12, **alineados a la izquierda**, número 24/900, etiqueta 12/700. Activos: `--surface2` + número `--accent-strong`, etiqueta muted. Esta semana: `--amber` + número y etiqueta `--amber-s`. Inactivos: `--default`, todo muted | `testID="pill-active"` · `rounded-xl bg-accent-soft p-3 items-center`; `pill-week` y `pill-inactive` · `bg-default`; número `text-lg font-black text-foreground`; etiqueta `text-xs font-normal text-muted` | Cambian: fondo de `pill-active` (`bg-accent-soft`→`bg-surface-secondary`*), fondo y tinta de `pill-week` (`bg-default`→`bg-category-amber` + `text-category-amber-strong`; ojo, la carta reserva el reparto de `category-*` a `category-palette.ts`), tinta del número (foreground→accent-strong / amber-strong / muted), tamaño (`text-lg`→`text-2xl`), peso de etiqueta (`font-normal`→`font-bold`), alineación (`items-center`→`items-start`) | media (candados de clases del propio test, §4) |
| Fila de recordatorio | radio 22, borde 1px `--border` (2px `--amber` si es «próximo»), padding 14, gap 12; tile 46×46 radio 14 pastel con icono SVG en tinta `-s`; etiqueta de tipo 12/800 **en la tinta de su categoría**; insignia «¡Próximo!» a la **derecha** (justify-between) con `pop 500ms` de 400ms de retardo; título 16/800; meta 13 muted «12 oct, 09:00 · en 6 días» | `Card` (`src/components/card.tsx`, `rounded-card` = 20) · `testID={\`reminder-row-${reminder.id}\`}`; tile `size-11 rounded-xl ${CATEGORY_SLOTS[meta.category].surface}` con `meta.emoji`; etiqueta `text-xs font-semibold text-muted`; insignia `reminder-upcoming-*` · `bg-warning-soft ... text-warning-strong` junto a la etiqueta; fecha `toLocaleDateString(locale)` **sin hora** + `reminders.dueInDays` | (a) tinta de la etiqueta muted → `CATEGORY_SLOTS[...].ink`; (b) emoji → icono (D-I); (c) borde ámbar de 2px en la fila próxima (no existe); (d) insignia a la derecha + `PopIn` (`src/components/pop-in.tsx`); (e) fecha **con hora** y separador « · »: hoy `toLocaleDateString` pierde la hora; (f) insignia `bg-warning-soft` vs canvas `--amber`/`--amber-s` (= `category-amber`); (g) radio 22 vs 20 | media |
| Botón borrar por fila | **no aparece** en el canvas (la hoja ya está abierta) | `testID={\`reminder-delete-${reminder.id}\`}` · `variant="danger-soft"` en cada fila | El canvas no dice cómo se abre la hoja. Quitar el botón exige otro disparador (pulsación larga, swipe, menú). Decisión **D-R1**; default: **se queda** (carta §Dirección de arte 5) | — |
| Inactivos | no dibujados (el tile «Inactivos» cuenta 1, pero no hay fila) | `opacity-50` + `reminder-status-*` (`reminders.sent`/`reminders.cancelled`) | Sin referencia en canvas: se queda | — |
| Hoja de borrado | asa 40×5 `--lip-gray`; círculo 56 `--rose` con papelera `--danger`; título 20/900 **centrado**; cuerpo 14 muted centrado; «Eliminar» 54px radio 16 `--danger` con labio `#9F1F15`; «Cancelar» secundario lip-gray; fondo con `fade 300ms`, hoja con `rise 350ms` | `@expo/ui/community/bottom-sheet` (asa y animación las pone la librería); `reminders-delete-sheet` · título `text-xl font-bold` a la izquierda; `reminders-delete-reference` (título del recordatorio, el canvas no lo pinta); confirmar `rounded-xl bg-danger` **sin labio**; cancelar `rounded-xl border-2 border-b-6 border-lip-gray bg-surface` (#166) | Falta el círculo con icono, el centrado y el peso 900. El labio del destructivo **contradice la carta** (§Decisiones fijas 13: «Sin labio: … los destructivos (`bg-danger`…)») y no tiene token (`#9F1F15`). Decisión **D-C**. `reminders-delete-reference` no está en el canvas: se queda (dato útil) | baja–media |
| Carga | no dibujada | 3 `Skeleton` `rounded-card` · `reminder-row-skeleton-*` | Ajustar alto si cambia la fila; nada más | baja |
| Error | no dibujado | `reminders-error` (`text-danger`) + `reminders-retry` | Sin referencia: se queda | — |
| Vacío | no dibujado (nota del canvas: «ilustración + título + una línea + CTA») | `EmptyState` · `pose="clipboard"`, `reminders.noRemindersYet` + `reminders.emptyBody`, **sin CTA** | Falta CTA en el vacío (la nota lo pide). Decisión **D-R2**; `src/components/empty-state.tsx` ya acepta CTA* | baja |
| Agrupación por día | **no dibujada** en el artboard (filas sueltas ordenadas por fecha); la pide solo la nota de fila 3 del canvas: «Listas con agrupación por día y separadores suaves» | `reminders.data.reminders.map` sin secciones | Ver §3.3 | media |
| Movimiento | `rise` escalonado 70ms por fila; `pop` en la insignia | ninguno | `HomeEntrance` por fila + `PopIn` en insignia | baja–media |

Copy del artboard (no aprobado; §6 D-K):
- «Recordatorios» = `reminders.reminders` (ya existe, cabecera nativa).
- «Nuevo» = `reminders.new` (existe*).
- «Activos» / «Esta semana» / «Inactivos» = `reminders.active` / `reminders.thisWeek` / `reminders.inactive` (existen).
- «¡Próximo!» = `reminders.upcoming` (existe, aprobado).
- «12 oct, 09:00 · en 6 días»: **nuevo formato** (hoy solo fecha + `reminders.dueInDays`).
- «¿Eliminar recordatorio?» vs `reminders.deleteReminder` (contrastar literal*); «Esta acción no se puede deshacer.» = `reminders.deleteSheetBody` (aprobado); «Eliminar»/«Cancelar» = `reminders.delete`/`reminders.cancel`.

### 2.2 Nuevo recordatorio

Pantalla: `src/app/add-reminder.tsx` (delgada) → `src/screens/add-reminder/index.tsx`.
Canvas: `project/NuevoRecordatorio.dc.html` (el artboard se previsualiza **en dark** por defecto: `data-props` · `"default":true`).

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Título | «Agregar recordatorio» 24/900 en contenido | Cabecera nativa · `title: t('addReminder.addReminder')` (`src/app/_layout.tsx`) | D-H (transversal) | — |
| Etiquetas de sección | «Tipo», «Título», «Fecha», «Hora», «Aviso»: 14px/800, **sin mayúsculas**, color foreground | 5 × `className="text-xs font-semibold uppercase tracking-widest text-muted"` (`grep -c "uppercase tracking-widest text-muted" src/screens/add-reminder/index.tsx` = 5 a `68da75ab`) | Cambio de clase en las 5: `text-sm font-extrabold* text-foreground`, sin `uppercase tracking-widest`. Ojo: `font-extrabold` no tiene fuente cargada (solo `--font-black` = 900 y `--font-bold` = 700 en `global.css`); 800 = Inter-ExtraBold, que propone #173* | baja (pero mueve candados si alguno mira `uppercase`*) |
| Chips de tipo | píldora 38px, 14/800, **sin emoji**, sin borde; **seleccionado** = `--accent` + texto blanco + labio `0 3px 0 var(--lip)`; **no seleccionado** = pastel de su categoría (`--violet`/`--violet-s`, etc.; Peso y Otro en `--default`) | `testID={\`type-chip-${reminderType}\`}` · seleccionado `rounded-full border border-accent bg-accent-soft px-3 py-2`, no seleccionado `rounded-full border border-border bg-default px-3 py-2`; texto `` `${meta.emoji} ${t(meta.labelKey)}` `` en `text-sm font-semibold text-foreground` | (a) no seleccionado pasa a `CATEGORY_SLOTS[meta.category].surface` + `.ink`; (b) seleccionado a `bg-accent` + `text-accent-foreground` + labio (`border-b-4 border-black/25`* ¿o `border-b-3`?); (c) quitar emoji (D-I); (d) sin borde | media (candados de clase de `add-reminder/index.test.tsx` y posible inventario de primarios de #166, §4) |
| Título (input) | 52px, radio 12, `--default`, **borde 2px `--accent` al enfocar**, 16/600 | `testID="title-input"` · `rounded-xl bg-default px-4 py-3 text-foreground`, sin estado de foco | Falta el borde de foco (`onFocus`/`onBlur` + `border-2 border-accent`). Placeholder sigue | baja |
| Fecha / Hora | rejilla **3fr / 2fr**, 52px, radio 12, `--default`, **icono** calendario / reloj 18px muted, 16/600; fecha «12 oct 2026» | `testID="date-field"` / `time-field` · `flex-1` cada uno (1:1), `rounded-xl border border-border bg-default px-4 py-3`, sin icono; fecha `date.toLocaleDateString(locale)` (formato numérico corto, p. ej. «12/10/2026»*) | Proporción 3:2, iconos reicon (`Calendar`*, `Clock`*), sin borde, fecha con mes abreviado (`{day:'numeric', month:'short', year:'numeric'}` = mismo formato que `src/screens/home/format.ts` · `export function fmtDate`) | baja |
| Chips de aviso | mismos que tipo; no seleccionados en `--default`; seleccionado acento + labio | `testID={\`advance-chip-${option.minutes}\`}` · mismas clases que tipo + `opacity-50` si `disabled` | Igual que tipo (b, d). El estado deshabilitado no está en canvas: se queda | baja–media |
| **Vista previa (C12)** | banda radio 18, `--surface2`, padding 12×14, icono campana 20px `--accent-strong`, 13/600: «Te avisaremos el 5 oct a las 09:00» | **No existe**: `grep -ciE "preview\|avisaremos\|notifyAt" src/screens/add-reminder/index.tsx` = 0 | Ver §3.1 | media |
| CTA | «Guardar recordatorio» 56px radio 16, labio, 17/800, **pegado abajo** (`margin-top:auto`) | `testID="add-reminder-submit"` · `rounded-xl bg-accent border-b-4 border-black/25` en el flujo, antes del error | Radio 16 sin token (se queda `rounded-xl`); anclarlo abajo es cambio de layout con teclado (KAV, memoria teclado-edge-to-edge): **no recomendado** | — |
| Error | no dibujado | `add-reminder-error` debajo del CTA | Se queda | — |
| Movimiento | ninguno en el artboard | ninguno | — | — |

Copy del artboard: todos los rótulos ya existen y coinciden literalmente
(`addReminder.addReminder` = «Agregar recordatorio», `addReminder.type` =
«Tipo», `addReminder.title`, `addReminder.date`, `addReminder.time`,
`addReminder.alert` = «Aviso», `addReminder.advance*`, `reminderType.*`,
`addReminder.saveReminder`; `src/i18n/catalog.ts`). El único texto nuevo es
el de la vista previa (§3.1, D-K1).

### 2.3 Horario

Pantalla: `src/app/meal-schedule.tsx` (delgada) → `src/screens/meal-schedule/index.tsx`.
Canvas: `project/HorarioComidas.dc.html`.

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Título | «Horario de comidas» 24/900 en contenido | cabecera nativa · `title: t('mealSchedule.mealSchedule')` | D-H | — |
| Héroe objetivo | `section` radio **24**, `--accent`, texto blanco, labio `0 5px 0 var(--lip)`, padding 16, **rejilla de 3 columnas**: eyebrow «Objetivo diario» 12/800 uppercase `.06em` opacidad .85 a lo ancho; tres cifras 22/900 con rótulo 12 opacidad .85: «1200 / kcal», «300 g / / día», «3 / comidas / día» | `Card testID="meal-schedule-summary" variant="accent"` (`rounded-card bg-accent p-5 shadow-sm`, `src/components/card.tsx`): columna izquierda eyebrow `text-xs font-semibold uppercase tracking-widest text-accent-foreground` + `text-3xl font-black` «{merKcal} kcal» + `mealSchedule.dailyGrams`; columna derecha `ForkKnife` + `mealSchedule.mealsPerDay` | Reestructurar a 3 columnas iguales sin icono; cifras `text-2xl`* font-black; labio (`border-b-*` `border-black/25` o la variante *hero* de `Card` que añade #173, §5); radio 24 sin token (`--radius-hero` de #173*). Los rótulos «kcal», «/ día», «comidas / día» parten las claves actuales `dailyGrams` = `'{{grams}} g / día'` y `mealsPerDay` = `'{{meals}} comidas / día'` en cifra + rótulo: claves nuevas o reescritas (D-K) | media |
| Subtítulo de sección | «Horarios y porciones» h2 17/800, **sin mayúsculas**, foreground | `meal-times-section` · `text-xs font-semibold uppercase tracking-widest text-muted` | Clase (17 px sin token: `text-lg` = 18*) | baja |
| Fila de comida | `article` radio 20 padding 12×14 gap 12; mosaico 42×42 radio 14 **ámbar** (`--amber`/`--amber-s`) con reloj 20 px; hora 18/900 y gramos 13/600 muted **apilados**; botón «Editar» secundario chunky (36 px, radio 10, surface, borde 2 `--lip-gray`, labio 3 px `--lip-gray`, 13/800) | `Card testID={\`meal-time-row-${index}\`}`: mosaico `size-10 ... rounded-xl bg-default` con `Clock size={18} color={accent}`; hora `flex-1 font-bold`, gramos en la **misma fila** `font-semibold text-muted`; `meal-time-edit-${index}` tonal `min-h-11 rounded-xl bg-accent-soft` + `text-accent-strong` | (a) mosaico `bg-category-amber` + icono en `category-amber-strong` (color por `useThemeColors`*); (b) hora/gramos en columna, hora `text-lg font-black`; (c) «Editar» a secundario gris chunky (`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, decisión N3 de 2026-10-11); conservar `min-h-11` (44 px, toque) frente a los 36 del canvas | media |
| Acciones | rejilla **2 columnas**: «Añadir comida» secundario gris chunky (50 px, radio 14, labio 4) + «Generar plan» **violeta pastel** (`--violet`/`--violet-s`) con icono y labio `rgba(91,63,163,0.35)` | `add-meal-time-button` tonal `rounded-xl bg-accent-soft` a lo ancho dentro de la sección; `generate-plan-button` **primario** `rounded-xl bg-accent border-b-4 border-black/25` a lo ancho, debajo, con `generate-plan-error` encima | Fila de dos; «Añadir» a secundario gris; «Generar» de primario verde a violeta tonal con labio: el labio violeta **no tiene token** (D-C) y retira un primario del inventario chunky (§4). Visibilidad distinta: «Añadir» solo `isOwner`, «Generar» con `canGenerate` (`loadedPlan !== null \|\| plan.data?.kind === 'not-found'`): la rejilla debe tolerar un solo botón | media |
| Perfil nutricional | h2 «Perfil nutricional» 17/800 **fuera de tarjeta**; píldoras `padding 6px 10px` `--default` 12/700 con prefijo muted: «Actividad Media», «Edad Adulto», «Condición 5/9», «Alimento Seco 380 kcal/100 g» | `Card testID="nutrition-profile-section"` con `nutrition-profile-title` `text-base font-bold`; 3 píldoras `rounded-full bg-default px-3 py-1 text-sm font-semibold` con `foodType`, `{kcalPer100g} kcal / 100 g`, `activityLevel` crudos; `profile-allergies`, `profile-diseases` | (a) quitar la tarjeta*; (b) prefijos muted (4 rótulos nuevos, D-K); (c) «Condición» sale de `bodyCondition: number \| null` (`src/api/types.ts` · `interface NutritionProfile`), hoy no se pinta; (d) **«Edad» no existe** en `NutritionProfile` (campos: `activityLevel, bodyCondition, targetWeightKg, foodType, kcalPer100g, allergies, diseases, updatedAt`) → D-S1; (e) «Media»/«Seco» son enums crudos traducidos: la traducción de enums es su propia feature (carta §6) → se pinta el valor crudo | media |
| Vacío / carga / error | no dibujados | `meal-schedule-empty`, `meal-schedule-loading` (3 skeletons), `meal-schedule-error` + retry, `nutrition-profile-empty` | Se quedan | — |
| Movimiento | `rise 400ms` escalonado 0/80/140/200 ms | ninguno* | `HomeEntrance` | baja |

Copy del artboard: existen «Horario de comidas», «Objetivo diario»,
«Horarios y porciones», «Añadir comida», «Editar», «Generar plan»,
«Perfil nutricional» (`src/i18n/catalog.ts`, claves `mealSchedule.*`).
Nuevos: «kcal», «/ día», «comidas / día» como rótulos sueltos, y los
prefijos «Actividad», «Edad», «Condición», «Alimento».

### 2.4 Historial

Pantalla: `src/app/meals-history.tsx` (delgada) → `src/screens/meals-history/index.tsx`.
Canvas: `project/HistorialComidas.dc.html`.

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Título | «Historial de comidas» 24/900 en contenido | cabecera nativa · `title: t('mealsHistory.mealsHistory')` | D-H | — |
| Contenedor del calendario | `section` radio **24**, `--surface`, borde 1px, padding 14, gap 8 | `<Card className="gap-4">` (surface: `rounded-card border border-border bg-surface p-4 shadow-sm`) | radio 24 sin token (token de #173*), gap 8 (`gap-2`); la sombra la decide #173 para `Card` | baja |
| Flechas de mes | 40×40, radio 12, fondo `--default`, chevron 18 | `meals-history-prev` / `-next` · `h-11 w-11 ... rounded-full` sin fondo, `ChevronLeft/Right size={20}` | `rounded-xl bg-default`; conservar 44 px (toque) | baja |
| Título del mes | 16/800 «octubre de 2026» | `meals-history-title` · `text-base font-bold` con `monthTitle(visibleMonth, locale)` | Peso 700 → 800 (ExtraBold*) | baja |
| Cabecera de días | «L M M J V S D» 12/700 muted (inicial) | `meals-history-weekdays` · `text-xs font-normal text-muted` con `weekdayHeaders(locale)` = `weekday: 'short'` desde lunes 2024-01-01 («lun.», «mar.»…*) | Peso 400 → 700 e inicial: `weekday: 'narrow'` da «L M X J V S D» en `es`* (CLDR usa «X» para miércoles, el canvas pinta «M») y **repite** letras en `en` («T», «S»): `key={day}` colisiona → la clave debe ser el índice | baja (con trampa de clave) |
| Celda de día | alto 44, 15 px; con comidas 600 foreground; **futuro** muted 500 sin punto; **seleccionado** círculo `--pill` + 900 `--accent-strong`; **hoy** 900 `--accent-strong` sin fondo; punto 5 px `--accent` | `meals-history-day-${date}` · `h-11 flex-1 ... rounded-full` + ` bg-accent-soft` si seleccionado; hoy `meals-history-today` `text-sm font-bold text-accent-strong`; futuro `text-sm font-semibold text-muted`; resto `text-sm font-semibold text-foreground`; punto `meals-history-dot` `mt-0.5 h-1.5 w-1.5 rounded-full bg-accent` | (a) fondo seleccionado `bg-tab-pill` (= `--pill` exacto: `global.css` · `--color-tab-pill: rgba(23,130,85,0.14)`) en vez de `bg-accent-soft`*; (b) texto seleccionado 900 accent-strong (hoy no cambia el texto); (c) hoy 700 → 900; (d) futuro 600 → 500 (`font-medium`: comprobar que hay Inter-Medium cargada*); (e) 14 → 15 px sin token; punto 6 → 5 px sin clase exacta (se queda) | baja–media |
| Panel del día | **sección aparte** fuera del calendario: radio 24, `--surface2`, padding 16, gap 10; cabecera fila: «lunes, 5 de octubre» 16/800 + **badge** `rounded-full --accent` blanco 12/800 «3 comidas servidas»; horas en **fila** de casillas `flex:1` radio 14 `--surface` padding 10 centradas 15/800 | `meals-history-detail` **dentro** del `Card`: `meals-history-detail-title` `text-base font-bold` (`longDayLabel`), horas apiladas `meals-history-detail-time` `text-sm font-semibold`, `meals-history-detail-count` `text-xs font-normal text-muted` debajo | (a) sacar el panel del Card a `Card variant="secondary"`* (`bg-surface-secondary`, ojo: lleva borde, el canvas no); (b) contador a badge acento en la cabecera; (c) horas en fila: con más de 3-4 comidas la fila `flex-1` se aprieta → `flex-wrap` con ancho mínimo (D-S2); (d) día sin comidas (`meals-history-detail-empty`) no dibujado: se queda | media |
| Mes vacío / carga / error | no dibujados | `meals-history-empty`, `meals-history-skeleton` (`h-80 w-full rounded-card`), `meals-history-error` + retry | Se quedan | — |
| Movimiento | `rise` 0 / 100 ms | ninguno* | `HomeEntrance` | baja |

Copy del artboard: todo existe («Historial de comidas»,
`mealsHistory.servedMany` = «{{count}} comidas servidas»,
`monthTitle`/`longDayLabel` de `src/utils/month-grid.ts`). Sin copy nuevo.
La «agrupación por día» de esta pantalla ya existe (es el panel del día):
no aplica §3.3.

### 2.5 Documentos

Pantalla: `src/app/pets/[petId]/docs.tsx` (delgada, pasa `petId`) → `src/screens/docs/index.tsx` (`export function DocsScreen`).
Canvas: `project/Documentos.dc.html`.

| Elemento | Canvas | Código actual (ancla) | Brecha | Dificultad |
|---|---|---|---|---|
| Cabecera | chevron atrás en contenido + eyebrow «Documentos de» 11/800 uppercase `.08em` muted + h1 «Rocky» 26/900 | Ya es título en contenido: `_layout.tsx` · `name="pets/[petId]/docs" options={{ ...headerOptions, title: '' }}`; eyebrow `text-xs font-semibold uppercase tracking-widest text-muted` (`docs.documentsOf`), nombre `text-2xl font-black text-foreground`, `docs-header-skeleton` | Peso eyebrow 600 → 800 (fuente ExtraBold: ver #173, §5); 26 px sin token (`text-2xl` = 24, se queda). El chevron lo pone la cabecera nativa: no se dibuja en contenido | baja |
| **Chips de filtro (C11)** | fila `flex-wrap gap 6`: «Todos» (seleccionado: `background: var(--fg); color: var(--bg)`) + «Vacunación» (blue), «Consulta» (green), «Análisis» (violet), cada uno pastel de su categoría; 34 px, `padding 0 12`, 13/800 | **No existe**: `grep -ciE "filter\|chip" src/screens/docs/index.tsx` = 0 | Ver §3.2. Nota: el canvas **no** dibuja chip «Desparasitación» aunque la lista tiene un documento de ese tipo, ni el aspecto de un chip de tipo seleccionado ni de «Todos» no seleccionado | media–alta |
| Orden | cabecera, chips, lista, zona de subida **al final** | cabecera, botón `docs-upload` (si `isOwner` y hay docs), formulario, error, skeleton, vacío, lista, error de carga | Mover la acción de subir debajo de la lista y cambiar su forma (fila «Zona de subida») | media |
| Fila (`doc-${id}`) | `article` radio 20, `--surface`, borde 1px `--border`, padding 12×14, gap 12 | `Card` · `className="flex-row items-center gap-3"` | Card ya da radio card + surface*; el padding y la sombra de Card los toca #173 (§5) | baja |
| Mosaico | 48×**56**, radio 12, pastel de categoría, **icono SVG documento** 24 px en `-strong` | `size-10 ... rounded-xl ${slot.surface}` con `📄` (`text-lg`) | Tamaño 48×56 (`w-12 h-14`), icono reicon* en `slot.ink`; emoji fuera (D-I) | baja |
| Badge de tipo | pastel 11/800, `padding 2px 8px` | `self-start rounded-full px-2 py-0.5 text-2xs font-bold ${slot.surface} ${slot.ink}` con `{document.type}` **crudo** | Peso 700 → 800*. Si C11 introduce etiqueta humana, decidir si el badge también la usa (D-C11b) | baja |
| Nombre | 15/800, una línea con elipsis | `font-bold text-foreground` (16/700), sin `numberOfLines` | `numberOfLines={1}` + peso; 15 px sin token | baja |
| Fecha | 12 muted, «3 mar 2026» | `text-sm font-normal text-muted` con `{document.date}` **ISO crudo** (`PetDocument.date: string`, `src/api/media.ts`) | Formatear con `fmtDate(document.date, locale)` de `src/screens/home/format.ts` (día / mes corto / año); hoy la pantalla no usa `useLocale` (`grep -c useLocale src/screens/docs/index.tsx` = 0) | baja |
| Chevron derecho | 18 px muted | ninguno | icono reicon* | baja |
| Zona de subida | `section` radio **24**, `border: 2px dashed var(--lip-gray)`, padding 18, centrada: círculo 48 `--surface2` con flecha de subida `--accent-strong`, «Subir documento» 15/800, «PDF o foto de recetas, análisis y cartillas» 12 muted | `Button testID="docs-upload" className="rounded-xl bg-accent border-b-4 border-black/25"` **encima** de la lista | Sustituir el primario por un `Pressable` `border-2 border-dashed border-lip-gray`; radio 24 sin token (`rounded-card` = 20 o el token que añada #173*). Retira un primario con labio (inventario chunky de #166, §4) | media |
| Formulario de subida | no dibujado | `docs-upload-form` con 4 `TextField` (tipo libre `docs-type-input`, `maxLength={40}`) | Se queda; si C11 filtra por categoría, el campo «Tipo» libre seguirá creando tipos fuera de los chips (D-C11a) | — |
| Vacío | no dibujado | `EmptyState testID="docs-empty" pose="health"` con `action` | Se queda | — |
| Carga | no dibujado | `docs-list-skeleton` 3 × `h-24 w-full rounded-card` | Se queda | — |
| Error | no dibujado | `Card testID="docs-error"` + `docs-retry` | Se queda | — |
| Movimiento | `rise 400ms ease-out` escalonado 0/60/120/180 ms | ninguno | Reusar `HomeEntrance` (transversal) | baja |

Orden de la lista: el backend ya ordena por fecha descendente
(`pet-document.drizzle.repository.ts` · `.orderBy(desc(petDocuments.date), desc(petDocuments.id))`), igual que el canvas (3 mar → 18 feb → 10 ene → 2 dic).

Copy del artboard: «Documentos de» y «Subir documento» existen
(`docs.documentsOf`, `docs.upload`). Nuevos: «Todos», las etiquetas de
los chips («Vacunación», «Consulta», «Análisis»; «Desparasitación» si se
incluye) y el subtítulo «PDF o foto de recetas, análisis y cartillas»
(D-K; es instrucción, no voz de mascota: puede quedar neutro).

## 3. C12, C11 y agrupación por día

### 3.1 C12: vista previa del aviso en «Nuevo recordatorio»

Qué pinta el canvas: banda bajo los chips de aviso, «Te avisaremos el 5 oct
a las 09:00» (vencimiento 12 oct 09:00, aviso «7 días antes»).

Cálculo, todo ya en el fichero (`src/screens/add-reminder/index.tsx`):
- instante de vencimiento: `const pickedDueAt = date ? combineDateAndTime(date, time) : null;`
- antelación efectiva: `const selectedAdvance = effectiveAdvance(pickedDueAt, advanceMinutes, now);`
  (la misma que se envía: `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, Date.now())`).
- instante del aviso = `pickedDueAt.getTime() - selectedAdvance * 60_000`.
  Es el mismo que usa el backend para despachar (`dueAt - advanceMinutes`,
  verificado en la sesión anterior*; la spec debe citar el fichero del worker).
- Formato: fecha `toLocaleDateString(locale, { day: 'numeric', month: 'short' })`
  (el canvas no pinta año; `fmtDate` de `src/screens/home/format.ts` recibe
  `'YYYY-MM-DD'` y añade año, no sirve tal cual); hora con el mismo
  `toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })` que ya
  pinta `time-field`.

Riesgos:
- **Sin fecha** (`date === null`) no hay instante: recomendación, **no pintar**
  la banda (cero copy nuevo). Alternativa con copy: «Elige una fecha y te digo
  cuándo aviso» (D-K1).
- **Aviso en el pasado**: no ocurre, `effectiveAdvance` ya baja a la mayor
  antelación futura y, si ninguna lo es, cae a `preferred`*; con fecha de hoy y
  hora pasada el submit ya rechaza (`addReminder.dateMustBeFuture`). La spec
  debe decir qué pinta la banda en ese caso (recomendación: pintarla igual; el
  error sale al guardar).
- **`now` congelado**: `now` solo se refresca al elegir fecha u hora
  (`setNow(Date.now())`); la banda puede quedar unos minutos desfasada respecto
  a lo que se envía. Aceptable; decirlo en la spec.
- **Tests y zona horaria**: la cadena depende de la TZ de jest. Memoria
  `jest-process-env-tz-ciego`: fijar TZ con
  `process.getBuiltinModule("process").env`, no `process.env.TZ`. Los literales
  esperados («5 oct», «09:00» y su versión `en`) deben ir **en la spec**
  (memoria `literales-copy-desde-r1`).
- Clave con parámetros: `addReminder.notifyPreview` = `'Te avisaremos el {{date}} a las {{time}}'`*
  (nombre sugerido). Entra en el escaneo de claves con parámetro de
  `src/__tests__/ui-language.test.ts` («Las 11 entradas con parámetro» es solo un comentario:
  `grep -n "parámetro" src/__tests__/ui-language.test.ts` da dos líneas de
  comentario y ningún `toHaveLength`) y en `englishKeys` (+1).
- Estilo: radio 18 = `--radius-tile` de #173, reservado a profile por su
  inventario (#173 R2) → usar `rounded-xl` o enmendar el inventario (§5).
  Fondo `bg-surface-secondary`, icono `Bell` de `reicon-react-native`
  (existe en `index.d.ts` del worktree principal; wt-175 no tiene
  `node_modules`) en `accent-strong` vía `useThemeColors`.
- testID sugerido `add-reminder-preview`: ningún test usa `/^add-reminder-/`
  (`grep -rnE "\^add-reminder-" src --include=*.test.tsx` = 0 a `68da75ab`).

### 3.2 C11: chips de filtro en Documentos

Hecho que cambia el planteamiento: `document.type` es **texto libre**, no
enum (`backend-pet-tracker/src/modules/media/application/dto/create-pet-document.dto.ts` ·
`type: z.string().trim().min(1).max(40)`; `media.schema.ts` · `varchar('type', { length: 40 })`;
móvil `src/api/media.ts` · `type: string`; formulario `docs-type-input` libre).
El color ya se resuelve por sinónimos: `src/utils/category-palette.ts` ·
`DOCUMENT_TYPE_SLOTS` (vacunación/vacuna/vaccine → blue, consulta/checkup →
green, desparasitación/deworming → amber, análisis/analysis → violet) y
`documentCategory(type)` → `'neutral'` para el resto.

Opciones:
- **A (recomendada): chips por categoría** (`documentCategory`). Filtrar =
  `documents.filter((d) => documentCategory(d.type) === selected)`. Etiquetas
  humanas nuevas en catálogo (no hay reutilizables: `reminderType.vaccine` =
  «Vacuna», no «Vacunación», y no hay «Análisis»). Orden fijo
  blue→green→amber→violet→neutral; **mostrar solo las categorías con al menos
  un documento** (explica por qué el canvas omite chips sin uso; no explica
  que omita «Desparasitación» con un doc, el canvas es una maqueta). El neutro
  necesita etiqueta («Otros»*) o quedar solo bajo «Todos».
- B: chips por valor crudo distinto. Pinta lo que el usuario tecleó
  («vacuna», «Vacunación» y «vaccine» serían tres chips). Peor; no recomendada.

Detalles:
- Filtrado **en cliente**: la lista llega ordenada por fecha desc del backend
  y no hay paginación* (`listPetDocuments` devuelve el array entero*).
- No hay componente de chip compartido: el más parecido es el chip de
  `add-reminder` (`type-chip-*`) y `OptionalChip` local de add-pet. Crear uno
  compartido para dos usos es opcional; lo mínimo es local en `docs`.
- «Todos» seleccionado = `bg-foreground` + `text-background`* (canvas
  `background: var(--fg); color: var(--bg)`): comprobar que `text-background`
  no choca con los guards de legibilidad (#61 R4, memoria
  `guards-de-carta-en-specs-de-clases`)*. Chip de categoría seleccionado: el
  canvas **no lo dibuja** (decisión D-C11c, §6).
- Lista vacía tras filtrar: imposible con la opción A si solo hay chips de
  categorías con documentos.
- Estado del filtro: `useState` local; se reinicia al cambiar de mascota (la
  pantalla recibe `petId` por ruta).
- testID sugerido `docs-filter-<slot>` y `docs-filter-all`; ojo con el prefijo
  `doc-` de las filas (`doc-${id}`): `docs-filter-…` no casa `/^doc-/`, pero sí
  casaría un selector `/^docs-/` (hoy ninguno: el único por prefijo es
  `src/screens/docs/index.test.tsx` · `getAllByTestId(/^doc-/)`, que asevera la
  lista exacta de filas; **cualquier testID nuevo dentro de la fila que empiece
  por `doc-` lo rompe**: el chevron o el icono no deben llamarse `doc-…`).
- El badge sigue pintando `document.type` crudo; si se pinta la etiqueta
  humana, dos documentos «vacuna» y «Vacunación» saldrían iguales (D-C11b).
- Coherencia entre pantallas: **desparasitación es violeta en recordatorios**
  (`src/utils/reminder-meta.ts` · `labelKey: 'reminderType.deworming'` →
  `category: 'violet'`) y **ámbar en documentos** (`DOCUMENT_TYPE_SLOTS` ·
  `'desparasitación': 'amber'`). Preexistente; fuera de alcance salvo que el
  humano quiera alinearlo (D-C11d).

### 3.3 Agrupación por día

- Fuente: solo la nota de fila 3 del canvas («Listas con agrupación por día y
  separadores suaves»). **Ningún artboard de esta feature la dibuja**:
  Recordatorios pinta filas sueltas; Historial ya agrupa (panel del día);
  Documentos tampoco agrupa.
- Si se hiciera en Recordatorios: grupos hacia el futuro («Hoy», «Mañana»,
  «Esta semana», «Más adelante», más «Pasados»/inactivos). Lo existente de
  #170 (`src/utils/alert-sections.ts` · `alertSection`, usado en
  `src/screens/alerts/index.tsx`) agrupa hacia el pasado y no sirve tal cual;
  `localDayOf` / `calendarDaysUntil` de `src/screens/home/format.ts` (ambos
  `export function`) y
  `daysUntil` de `src/utils/reminder-dates.ts` sí son reutilizables.
- Recomendación: **fuera de #175** (no hay artboard que fije su aspecto y la
  regla del humano es «como el artifact»). Si el humano la quiere, es una
  feature aparte con copy de cabeceras (D-G, §6).

## 4. Candados

**Valores medidos a `68da75ab`. La spec debe volver a medirlos en H0 del
handoff**: #173 (spec en `origin/feature/173-mobile-tab-screens-canvas-fidelity`,
base `57a61544`) y #174 (sin spec aún) mueven los mismos agregados. Delta que
declara #173 R15: `style={CONTINUOUS_CORNER}` 37→30, `rounded-xl bg-accent`
19→18, `bg-accent-soft` 18→17, `border-b-4` y `border-black/25` 19→18,
directUses 39→32, `englishKeys` −4+3. Cifra futura = base medida en H0 +
delta de #175 (memoria `handoff-anclas-sin-grep`). Todas las anclas por
contenido; los números de línea no valen (memoria `lo-que-se-desplaza-no-es-ancla`).

### 4.1 Agregados globales (`src/__tests__/consistency-classnames.test.ts`)

| Ancla (grep -F en el test) | Valor a `68da75ab` | Qué de #175 lo mueve |
|---|---|---|
| `expect(count(/rounded-xl bg-accent(?=` | 19 (`13 + 1 + 1 + 1 + 1 + 1 + 1`) | «Subir documento» deja de ser primario (docs 2→1); «Generar plan» pasa a violeta (meal-schedule 1→0). Total −2 |
| `expect(primaryRadius).toHaveLength(` | 19 (misma suma) | igual que la fila anterior |
| `inventaría los diecinueve primarios con labio, fichero a fichero` (mapa `expected`) | `add-reminder` 1, `docs` 2, `meal-schedule` 1, `reminders` 1, `components/empty-state.tsx` 1 | docs → 1, meal-schedule → desaparece del mapa; el título del `it` dice «diecinueve» y también cambia. Si D-R2 añade CTA al vacío de reminders, no cambia nada (el primario vive en `empty-state.tsx`) |
| `expect(count(/\bborder-b-4\b/g)).toBe(` | 19 | −2 por los primarios retirados; **+N** si los chips seleccionados llevan labio (canvas `0 3px 0 var(--lip)`), +1 si el destructivo lleva labio, +1 si «Generar plan» lleva labio violeta con `border-b-4` |
| `expect(count(/border-black\/25/g)).toBe(` | 19 | igual; y además `it('no deja la receta del labio fuera de un primario'` **se rompe** si un chip (no-Button) lleva `border-b-4 border-black/25`: es un candado que habría que enmendar por nombre (decisión D-L, §6) |
| `expect(count(/border-lip-gray/g)).toBe(` | 5 (`4 + 1`) | «Editar» (×1 literal, se repite por fila) y «Añadir comida» a secundario gris chunky: +2 |
| `expect(count(/\bborder-b-6\b/g)).toBe(` | 5 (`4 + 1`) | +2, mismas causas |
| `inventaría los cuatro secundarios neutros de toda la app` (lista de testIDs) | 5 entradas: `alert-detail-view-map`, `docs-upload-cancel`, `forgot-resend`, `reminders-delete-cancel`, `welcome-have-account` | entra `add-meal-time-button`; `meal-time-edit-${index}` es **template literal** y la regex `testID="([^"]+)"` del test devuelve `undefined` para él: el candado necesita cambiar su extracción o aceptar `undefined` (enmienda nominal). Ojo: el filtro excluye hoy a ambos botones solo porque llevan `bg-accent-soft` |
| `expect(count(/bg-accent-soft/g)).toBe(` y `expect(accentSoftCount).toBe(` | 18 (`16 + 2 + 1 - 1`) | `pill-active` → surface2 (−1, y rompe `expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1)`); chips de add-reminder (2 literales: tipo y aviso) −2; «Editar» y «Añadir comida» −2 (**revierte #147 R4**, que es quien los añadió según el comentario `// #147 R4: meal-time-edit y add-meal-time-button`); celda seleccionada del historial a `bg-tab-pill` −1 (revierte #105 R11). Hasta −6 |
| `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(` | 37 (`31 + 1 + 4 + 1`) | Solo si cambian los `View`/`TextInput` que lo llevan. Por fichero (`directUses`): `reminders` 4, `add-reminder` 3, `docs` 1, `meal-schedule` 1. Mosaico nuevo de horario o zona de subida con esquina continua: +1 cada uno |
| suma de `directUses` (`toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1)`) | 39 | igual que la fila anterior |
| `counters` de `TABULAR_NUMS` | `reminders` 3, `meals-history` 2 | Si la cifra de los tiles o las horas del panel cambian de nodo, contar de nuevo; las casillas horarias en fila mantienen 1 sitio si se mapean* |
| `#62 R4` · `no deja la clase fuera de escala %s` (`rounded-2xl`, `rounded-lg`, `rounded-md`, `rounded-sm`) | 0 | Cualquier radio de canvas 14/16/18/22/24 sin token cae aquí si se usa clase Tailwind por defecto. Mapear a `rounded-xl`/`rounded-card` o a tokens de #173 (§5) |
| `#62 R12` · `los TextInput crudos comparten una sola receta` (`toHaveLength(6)`, `toHaveLength(5)` con placeholder) | 6 / 5 | El borde de foco del título (`title-input`) cambia la receta compartida: o se aplica a los 6 o se enmienda el candado (D-F, §6) |
| `#120 R1` · `lleva las tres píldoras de resumen de reminders a rounded-xl` | `rounded-xl` en `pill-active`, `pill-week`, `pill-inactive` | Se mantiene si radio 16 se mapea a `rounded-xl` |
| `da al skeleton repetido de reminders la forma de sus filas Card` | `className="h-20 w-full rounded-card"` | Se mantiene salvo que cambie el alto de la fila |

### 4.2 Carta y legibilidad (`src/__tests__/legibility-classnames.test.ts`, `design-drift.test.ts`)

| Candado | Qué asevera | Choque con el canvas |
|---|---|---|
| `#61 R1` · `la etiqueta destructiva usa el token de danger` | `reminders-delete-confirm` con `variant="danger"`, `bg-danger`, `Button.Label className="font-bold text-danger-foreground"` | El canvas pone peso 800/900 y labio `#9F1F15`: tocar la etiqueta revierte R1; el labio choca con la carta §Decisiones fijas 13 («Sin labio … los destructivos»). **Se revierte nominalmente si D-C dice sí** |
| `#61 R3` · `ningún texto sobre bg-accent se compone con opacidad` (sitios: `app/(tabs)/food.tsx`, `screens/meal-schedule/index.tsx`) | `not.toContain('opacity-70')` y afines* | Héroe del horario: rótulos con opacidad .85 sobre acento. **Se revierte nominalmente** si se copia la opacidad; recomendado: no copiarla (AA) |
| `#61 R5` · `text-warning deja de usarse como color de texto` | `reminders` contiene `text-warning-strong` y `bg-warning-soft` («conserva el ámbar puro como relleno de badge») | Insignia «¡Próximo!» en `--amber`/`--amber-s` (= `category-amber`): cambiarla **revierte #61 R5** en reminders. Recomendado: quedarse con `warning` (D-C) |
| `design-drift` · `%s importa el Card compartido` (incluye `meal-schedule` y `meals-history // #105 R15`) | import de `Card` | Si el héroe y el panel del día dejan de ser `Card`, el fichero aún debe importarlo; con las filas de horario y el calendario siguiendo en `Card` se cumple |
| `design-drift` · `no deja rounded-[20px]` y afines | sin clases arbitrarias | Radios 22/24 no pueden ir como `rounded-[24px]` |

### 4.3 Tests de pantalla (clases aseveradas con `toBe` exacto o `arrayContaining`)

- `src/screens/reminders/index.test.tsx`: tiles con `className` exacto
  (`'flex-1 items-center gap-1 rounded-xl bg-accent-soft p-3'` y dos
  `'... bg-default p-3'`, más `style: { borderCurve: 'continuous' }`);
  `reminders-actions` `toBe('flex-row justify-end')`; `#128 R4` ·
  `reminders-delete-confirm` `toBe('pressable-feedback__root button__root button__root--variant-danger button__root--size-md w-full rounded-xl bg-danger')`;
  fila inactiva `toContain('opacity-50')`; `reminder-upcoming-*` con texto
  «¡Próximo!». Todo cambio de tiles, cabecera o destructivo **revierte** estos
  `it` y hay que nombrarlos en la spec.
- `src/screens/add-reminder/index.test.tsx`: `const CHIP_SELECTED = 'rounded-full border border-accent bg-accent-soft px-3 py-2'`
  y `const CHIP_IDLE = 'rounded-full border border-border bg-default px-3 py-2'`
  con `toBe` exacto por chip de aviso. Los chips del canvas los revierten.
- `src/screens/docs/index.test.tsx`: `aplica la receta monocroma al tipo sin cambiar su texto`
  con badge `toBe('self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-category-blue text-category-blue-strong')`
  y `'... bg-default text-muted'`; mosaico localizado con `getByText('📄').parent`
  (el icono SVG lo **revierte**: hay que localizar el mosaico por testID);
  `docs-upload` con `rounded-xl`, `bg-accent`, `font-bold`,
  `text-accent-foreground` (dos bloques); `docs-upload-cancel` con
  `button__root--variant-outline`; `getAllByTestId(/^doc-/)` con la lista
  exacta de filas.
- `src/screens/meal-schedule/index.test.tsx`: `meal-time-edit-*` con
  `arrayContaining(['min-h-11', 'rounded-xl', 'bg-accent-soft'])` y etiqueta
  `['font-semibold', 'text-accent-strong']`; `add-meal-time-button` con
  `['rounded-xl', 'bg-accent-soft']` y etiqueta `['font-bold', 'text-accent-strong']`;
  `childTestIds(screen.getByTestId('meal-times-section'))` `toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'add-meal-time-button'])`
  (**sacar «Añadir comida» a la rejilla de dos columnas lo revierte**);
  `nutrition-profile-title` `toBe('text-base font-bold text-foreground')`;
  skeletons `h-32`/`h-56`/`h-12`/`h-32`.
- `src/screens/meals-history/index.test.tsx`: hoy
  `toContain('text-sm font-bold text-accent-strong')` (pasar a 900 lo
  revierte); punto `toContain('h-1.5 w-1.5 rounded-full bg-accent')`;
  `getAllByTestId(/^meals-history-day-/)` en dos sitios: **ningún testID
  nuevo del panel puede empezar por `meals-history-day-`**.

### 4.4 Copy (`src/__tests__/ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`)

- `englishKeys` (`src/providers/__tests__/language-provider.test.tsx` ·
  `expect(englishKeys).toHaveLength(`): la fórmula suma 396 a `68da75ab`
  (evaluada quitando comentarios), último término `+ 7, // #170 R1`. **Ojo**:
  el explore de #174 (`progress/explore_mobile-alerts-canvas-fidelity.md` en
  su branch, §4.2) dice «768 claves (M10)», y un conteo ingenuo de líneas
  `'clave':` del bloque `export const en` da 385. Las tres cifras no casan*:
  la spec debe medir en H0 ejecutando solo ese test
  (`bunx jest src/providers/__tests__/language-provider.test.tsx`), no
  contando líneas. #173 R13 añade `- 4 + 3`. Cada clave nueva de #175 suma
  un término propio.
- Cada clave nueva pintada en pantalla exige su `UseRow`: reminders y
  add-reminder en `R8_REMINDERS` (`export const R8_REMINDERS: UseRow[]`, 41
  filas con `file: 'src/screens/reminders` o `add-reminder`); docs con filas
  `{ file: 'src/screens/docs/index.tsx', key: 'docs.…' }` (22 filas*, bloque
  sin verificar); meal-schedule y meals-history en `R6_FOOD` (29 y 8 filas con su `file`
dentro de `export const R6_FOOD`). Todas caen
  también en `checkUses(ALL_USES)` (memoria `candados-agregados-65-r18`).
- `SCREEN_FILES` (`expect(SCREEN_FILES).toHaveLength(`, último término
  `+ 2 - 2, // #167 R1`): las cinco pantallas ya están dentro* → sin delta
  salvo que se cree un componente nuevo con copy (p. ej. un chip compartido
  en `src/components/`), que suma +1.
- Claves partidas del horario (`mealSchedule.dailyGrams`,
  `mealSchedule.mealsPerDay`): si se reescriben sus valores, revisar las filas
  `UseRow` que las citan y los tests que esperan «300 g / día»* .

## 5. Solape con #173 y #174

Estado a 2026-10-13 tras `git fetch`: `origin/main` = `788d1f89`.
- #173: branch `origin/feature/173-mobile-tab-screens-canvas-fidelity`, último
  commit `197a254d` (solo spec: `requirements.md`, `tasks.md`,
  `traceability.md`; sin código). Spec sin firmar.
- #174: branch `origin/feature/174-mobile-alerts-canvas-fidelity`, último
  commit `a715816f` (solo `feature_list.json`, `progress/current.md` y
  `progress/explore_mobile-alerts-canvas-fidelity.md`; sin spec).

### 5.1 Ficheros de pantalla

Ni #173 ni #174 tocan `src/screens/{reminders,add-reminder,docs,meal-schedule,meals-history}/`
(según la spec de #173 y el explore de #174). Sin conflicto de pantalla.

### 5.2 Piezas compartidas que #175 querría reutilizar de #173

| Pieza de #173 | Uso en #175 | Qué candado de #173 se movería |
|---|---|---|
| R1 `--font-extrabold` (Inter-ExtraBold) | etiquetas de add-reminder (800), nombre/badge de docs, chips, título del mes, eyebrow de docs | ninguno conocido (R1 mide el token, no los usos*) |
| R2 `--radius-hero` 28 | ninguno: el canvas de #175 usa 24 en secciones, no 28 | — |
| R2 `--radius-tile` 18 | banda C12 (radio 18) | **R2.2**: inventario de `rounded-tile` solo en profile → enmienda nominal o usar `rounded-xl` |
| R3 `Card variant="hero"` | héroe del horario* (radio 24, no 28; y es acento, no surface2) | **R3.3** (`variant="hero"` exactamente 1, en profile). No encaja: recomendación, **no** usarla |
| R3 `Card variant="flat"` | filas de docs y horario* | **R3.3** (`variant="flat"` exactamente 2). El canvas de #175 sí pinta borde 1px y radio 20 = variante `surface` actual sin sombra. Decisión de sombra: §6 D-SH |
| R12 `HomeEntrance` fuera de Home | las cinco pantallas | ninguno (sin candado de exclusividad) |
| R14 enmienda carta §12 (radios) y §13 («Sin labio», añade tonales) | radio 24 (D-RAD), labio destructivo y violeta (D-C) | conflicto **textual** en `docs/ui-guidelines.md` si #175 enmienda los mismos párrafos en paralelo |
| R15 deltas globales | §4.1 | cifras de §4.1 cambian; medir en H0 |

### 5.3 Agregados compartidos con #174 (según su explore §4.2)

- `#166 R2` primarios: #174 suma +1 (alert-detail); #175 resta hasta −2.
  Con #173 (−1) y los tres en cualquier orden la cifra final es la misma, pero
  **cada spec debe partir de su base medida**; quien mergee segundo rebasa y
  reajusta el término.
- `#166 R3` secundarios neutros (`border-lip-gray`, `border-b-6`, lista de
  testIDs): #174 +1 fila; #175 +2 y la trampa del template literal
  `meal-time-edit-${index}`. **#174 documenta la misma trampa**
  (`tag.match(/testID="([^"]…`): conviene que una sola de las dos specs
  arregle la extracción del candado y la otra la herede.
- `englishKeys`, `ui-copy-table.ts`, `docs/ui-guidelines.md` (§12/§13 y
  posibles enmiendas de iconos/cabecera), `src/app/_layout.tsx` (si D-H mueve
  títulos al contenido: #174 tiene la misma pregunta «A2/D2»).
- **Cabecera (D-H)**: #174 la plantea para alertas y detalle. Lo coherente es
  decidirla **una vez para toda la app** y no por feature.
- **Iconos (D-I)**: #174 ya usa reicon (`LocationSlash`, `BatteryLow`, `Bell`)
  y pregunta «¿Valen los de reicon? [sí]». Misma decisión aquí.

### 5.4 Orden recomendado

1. #173 firma y mergea primero (trae ExtraBold y enmienda §12/§13).
2. #174 y #175 después, en el orden que diga el humano; el segundo rebasa
   y reajusta términos (memoria `reparto-de-ficheros-caduca-al-mergear`).
3. Si #175 arranca antes de que #173 mergee: no usar `font-extrabold`
   (quedarse en `font-bold`/`font-black`) y no tocar §12/§13 de la carta.

## 6. Decisiones abiertas para el humano

Regla del humano (2026-10-13): «el diseño final debe de quedar como el
artifac». Cada default de abajo dice si se aparta del canvas y por qué. El
explorer no decide: son propuestas para el `spec_author` y el humano.

| Id | Pregunta | Opciones | Default recomendado | ¿Se aparta del canvas? |
|---|---|---|---|---|
| **D-H** | Título grande en contenido o cabecera nativa (5 rutas en `src/app/_layout.tsx`) | (a) título 24/900 en contenido y cabecera nativa sin título (como ya hace `pets/[petId]/docs` con `title: ''`); (b) cabecera nativa como hoy | **(a)**, decidida una vez para toda la app junto con #174 (A2/D2). Mueve las filas `UseRow` de los títulos de `_layout.tsx` a las pantallas* | no con (a) |
| **D-I** | Emoji o icono SVG en mosaicos y chips | (a) `reicon-react-native` (ya instalado; existen `Calendar`, `Clock`, `Bell`, `Plus`, `DocumentText`, `Upload`, `ChevronRight`); (b) emoji | **(a)** con enmienda de la carta («la superficie siempre acompaña a un emoji»). Glifos de reicon aunque no calquen el SVG del canvas (mismo criterio que #174) | ligeramente (glifo distinto) |
| **D-C** | Colores sin token: labio destructivo `#9F1F15`, labio violeta `rgba(91,63,163,0.35)`, `--danger` `#D92D20`, `--warning` `#B54708`, `--lip` `#0E5E3C`, opacidad .85 sobre acento | (a) crear tokens y enmendar carta §13 y #61 R3; (b) mapear a tokens existentes | **(b)**: destructivo sin labio (carta §13, `#128 R4`); «Generar plan» violeta tonal sin labio o con `border-black/25`*; insignia «¡Próximo!» sigue en `warning` (#61 R5); sin opacidad sobre acento (#61 R3, AA) | sí, en cuatro detalles, por AA y por candados vivos |
| **D-L** | Labio en chips seleccionados (tipo, aviso) | (a) `border-b-4 border-black/25` y enmendar `no deja la receta del labio fuera de un primario`; (b) sin labio | **(a)** si el humano quiere fidelidad estricta; mueve `border-b-4`/`border-black/25` +2 (dos literales) | no con (a) |
| **D-RAD** | Radios 22/24 (fila, secciones, zona de subida, héroe del horario) | (a) token nuevo `--radius-section` 24 + enmienda §12; (b) `rounded-card` (20) | **(b)**: 4 px de diferencia no justifican otro radio en la escala; #173 ya amplía la escala a cinco | sí, 4 px |
| **D-F** | Borde de foco en `title-input` | (a) solo en add-reminder y enmendar `#62 R12`; (b) en los 6 `TextInput` crudos | **(b)** si se hace; o dejarlo fuera | no |
| **D-SH** | Sombra de filas `Card` | (a) quitarla (canvas sin sombra, como `flat` de #173); (b) dejarla | seguir lo que decida #173 para `Card` | — |
| **D-R1** | Botón de borrar por fila de recordatorio (no está en el canvas) | (a) se queda; (b) otro disparador (pulsación larga) | **(a)**: carta §Dirección de arte 5 (no se quita una acción útil) | sí, añade un botón |
| **D-R2** | CTA en el vacío de recordatorios (nota del canvas) | (a) `EmptyState` con `action` (ya soportado: `action?: { label: string; onPress: () => void }`); (b) sin CTA | **(a)** reusando `reminders.new` («Nuevo»), cero copy nuevo; sin delta en el inventario de primarios (vive en `empty-state.tsx`) | no |
| **D-K1** | Texto de la vista previa C12 | canvas «Te avisaremos el 5 oct a las 09:00»; carta §7 (voz B, primera persona, aviso termina en punto, ya usado en `reminders.emptyBody` = «Cuando crees un recordatorio, te aviso a tiempo.») | **«Te aviso el {{date}} a las {{time}}.»** / en: «I'll remind you on {{date}} at {{time}}.» | sí, «avisaremos» → «aviso» por la carta |
| **D-K** | Copy nuevo del resto | Horario: rótulos «kcal», «g / día», «comidas / día»; prefijos «Actividad», «Edad», «Condición», «Alimento». Docs: «Todos», «Vacunación», «Consulta», «Desparasitación», «Análisis», «Otros»*, «PDF o foto de recetas, análisis y cartillas». Recordatorios: formato «12 oct, 09:00 · en 6 días» | literales del canvas tal cual (no son voz de Pingo: carta §6) | no |
| **D-C11a** | El campo «Tipo» libre del formulario sigue creando tipos fuera de los chips | (a) se queda libre y cae en «Otros»; (b) convertirlo en selector de categoría | **(a)**: (b) toca backend/contrato y no lo pide el canvas | no |
| **D-C11b** | El badge de la fila pinta el tipo crudo o la etiqueta de categoría | (a) crudo (hoy); (b) etiqueta | **(a)**: el canvas pinta el mismo texto que el chip porque sus datos son canónicos; con datos libres, el crudo no pierde información | — |
| **D-C11c** | Aspecto del chip de categoría seleccionado (no dibujado) | (a) mismo que «Todos» seleccionado (`bg-foreground`/`text-background`); (b) pastel con borde | **(a)** | n/a |
| **D-C11d** | Desparasitación violeta (recordatorios) vs ámbar (documentos) | alinear o dejar | **dejar** (fuera de alcance; preexistente) | n/a |
| **D-S1** | Píldora «Edad» del perfil nutricional: no hay campo de edad en `NutritionProfile` | (a) omitirla; (b) derivarla de `pet.birthDate`* (otra query); (c) añadir campo | **(a)**. Matiz: `src/api/types.ts` tiene `birthDate: string \| null` y `ageMonths: number` (en el tipo de mascota*) y la pantalla ya carga la mascota (su test asevera `expect(mockGetPet).toHaveBeenCalledWith(`), así que (b) no necesita query nueva; pero el canvas pinta una **etapa** («Adulto»), que exige umbrales por especie y copy nuevo. Pintar la edad («3 años») sería barato pero no es el canvas | sí, falta una píldora |
| **D-S2** | Horas del panel del día en fila con muchas comidas | (a) `flex-wrap` con ancho mínimo; (b) scroll horizontal | **(a)** | no |
| **D-G** | Agrupación por día en recordatorios (solo nota del canvas, sin artboard) | (a) fuera de #175; (b) dentro, con copy de cabeceras | **(a)** | no (no hay artboard) |

Para D-H: `src/__tests__/ui-copy-table.ts` tiene 10 filas con
`file: 'src/app/_layout.tsx'`; mover un título nativo al contenido traslada su
fila a la pantalla y puede sumar la pantalla a `SCREEN_FILES` si no estaba*.

## 7. Reparto propuesto

Cinco pantallas, dos piezas nuevas (C11, C12) y unos 20 candados que
revertir o mover dan una spec única de más de 30 R-id: demasiado para un
handoff a Codex (precedentes #168 y #171 con decenas de commits y varias
reanudaciones). Propuesta en tres features, **todas después de que mergee
#173**:

| Feature | Alcance | R-id estimados | Candados principales |
|---|---|---|---|
| **#175a Recordatorios + Nuevo recordatorio** | cabecera (D-H), botón «Nuevo» con `Plus`, tiles, fila (tinta de categoría, insignia a la derecha con `PopIn`, fecha con hora, borde ámbar), iconos (D-I), hoja de borrado (círculo, centrado), CTA en vacío (D-R2), chips de tipo/aviso, etiquetas de sección, campos fecha/hora con icono y 3:2, **C12**, `HomeEntrance`, copy, enmiendas de carta | 12–14 | tiles exactos y `reminders-actions` en `reminders/index.test.tsx`; `CHIP_SELECTED`/`CHIP_IDLE`; `bg-accent-soft` (−3) y `toHaveLength(1)` de reminders; `#62 R12` si D-F; labio de chips (D-L) |
| **#175b Documentos** | eyebrow 800, **C11** (opción A), mosaico 48×56 con icono, nombre en una línea, fecha con `fmtDate`, chevron, zona de subida discontinua al final, `HomeEntrance`, copy | 8–10 | `docs/index.test.tsx` (badge `toBe`, `getByText('📄')`, `docs-upload` primario, `/^doc-/`); `#166 R2` docs 2→1 |
| **#175c Horario + Historial** | héroe de 3 columnas, sección sin mayúsculas, filas con mosaico ámbar y hora/gramos apilados, «Editar»/«Añadir» grises chunky, rejilla con «Generar plan» violeta, perfil con prefijos (D-S1), flechas `bg-default`, cabecera de días 700 e inicial, celdas (seleccionado `bg-tab-pill`, hoy 900, futuro 500), panel del día aparte con badge y horas en fila (D-S2), `HomeEntrance`, copy | 10–12 | `meal-schedule/index.test.tsx` (`childTestIds(meal-times-section)`, `arrayContaining` de Editar/Añadir); `#147 R4` y `#105 R11` (`bg-accent-soft` −3); `#166 R2` meal-schedule 1→0; `#166 R3` +2 y la trampa del template literal; `#61 R3` si se copia la opacidad; `meals-history` `toContain('text-sm font-bold text-accent-strong')` y `/^meals-history-day-/` |

Orden sugerido: #175b primero (la más acotada, sin choques con #174 en
`border-lip-gray`), luego #175a, luego #175c (la que más candados
compartidos mueve con #174). D-H y D-I deben decidirse **antes** de la
primera de las tres y aplicarse igual en #174; la primera que mergee lleva
la enmienda de la carta y las otras la heredan.

Alternativa si el humano prefiere menos features: dos (A = Recordatorios +
Nuevo recordatorio; B = Documentos + Horario + Historial, 18–22 R-id). No
recomendada: B mezcla C11 con el horario y sus candados no comparten nada.
