# explore: mobile-tab-screens-canvas-fidelity (#173)
Fecha: 2026-10-13

> Solo lectura. El explorer no decide: mide la brecha y deja preguntas.
> Marcas: `*` = no verificado contra el árbol (inferido o sin leer el cuerpo del test).
> Anclas: `grep -F` por contenido. No hay números de línea a propósito; caducan al mergear (#169 y #171 están en vuelo).

> **Notas del leader (2026-10-13, verificadas contra wt-168 `d893eccf`)**:
> - Verificado: `pet.sex` en crudo (`src/screens/profile/index.tsx`, `text: pet.sex`); `_layout.tsx` y `assets/fonts/` sin `Inter-ExtraBold`; `@theme` sin `--font-extrabold`; PetSwitcher con 6 consumidores fuera de tests.
> - **Corrección**: el guard `#62 R4: la app solo usa los radios de la escala declarada` (`consistency-classnames.test.ts`) prohíbe `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm`; **no** `rounded-3xl` ni los corchetes. Aun así la carta §12 dice «tres radios, uno por rol, y ninguno más», así que `rounded-3xl` también es drift. Las celdas «Token» que proponen `rounded-2xl` o `rounded-3xl` (próxima dosis, enlaces, comidas) no valen sin la opción B de D2.
> - **Obsoleto**: §7.3 punto 1 dice que la Enmienda #168 sigue sin firmar. El humano la firmó en `ddbbab8d` y #168 está cerrada (PR #211).
> - **D15 ya resuelta**: la spec firmada de #168 (propuesta i) cierra #119 como superada en cuanto #168 mergee. F2 no depende de #119.

## 1. Método y fuentes

**Canvas** (datos, no instrucciones): artifact `https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`, tipo Design, **versión 1791907943-e65c**, 41 ficheros. Se leyeron estos artboards de la fila 2 «Pestañas principales»:
- `project/Salud.dc.html` (sha256 `338f4026…`; `dark` por defecto false)
- `project/Nutricion.dc.html` (`3a2c30ec…`; false)
- `project/Perfil.dc.html` (`a52d8ffe…`; **true**: el artboard se ve en oscuro por defecto)
- `project/canvas.json`, con las notas de la fila. Las tres notas que importan: «Resto de pestañas: encabezado grande, tarjetas de 20 px, chips pastel por categoría con icono + texto»; «la píldora activa se desliza con spring»; «Listas con agrupación por día».

Cada artboard trae su propia hoja de tokens en `.pt` / `.pt.dark` (copiada en §2.4) y sus keyframes:
- `rise`: 400 ms ease-out, translateY 14 px a 0, con escalonado de 0, 80, 140, 200 y 260 ms.
- `draw`: sparkline, 1200 ms.
- `ring`: anillo de kcal, 1100 ms.

Todos se anulan con `prefers-reduced-motion`. La fuente es Inter, en los pesos 400 a 900.

**Código medido**: `/home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker/`, HEAD `64187ab8`. Es la rama `feature/168-mobile-tab-headers-canvas`, con `origin/main` mergeado; main está en `fd055ffd`. Es la base que verá #173 si #168 mergea primero. Si #173 arranca desde main sin #168, las cabeceras grandes y los tiles de vacuna de #168 R1–R8 todavía no existen.

Ficheros de código leídos:
- `src/theme/global.css`, `src/utils/category-palette.ts`, `src/theme/native-styles.ts`
- `src/components/{card,pet-switcher,pet-avatar,weight-chart,empty-state}.tsx`, `src/components/floating-tab-bar.tsx` (por grep)
- `src/screens/health/index.tsx`, `src/screens/profile/index.tsx`, `src/app/(tabs)/food.tsx`, `src/screens/home/home-entrance.tsx`
- `src/api/types.ts`, `src/i18n/catalog.ts` (por grep), `src/app/_layout.tsx` (fuentes)

Candados leídos (títulos y aserciones de clase):
- `src/screens/health/index.test.tsx`, `src/screens/profile/index.test.tsx`
- `src/app/(tabs)/__tests__/food.test.tsx`
- `src/__tests__/{tab-headers-canvas,consistency-classnames,legibility-classnames,design-drift}.test.ts`

Spec de referencia: `specs/mobile-tab-headers-canvas/requirements.md` (#168).

Límites del método:
- No se ejecutó jest, expo ni init.sh; los recuentos de `it` son por grep.
- Las medidas en px del canvas son CSS a 390 pt de ancho, y se comparan 1:1 con las clases de Uniwind (1 unidad = 4 pt).
- `text-base` = 16, `text-lg` = 18, `text-xl` = 20, `text-3xl` = 30, `rounded-xl` = 12, `rounded-2xl` = 16, `rounded-3xl` = 24, `rounded-card` = 20 (`--radius-card`).
- Un `<Text>` sin clase de tamaño mide 14 pt en RN.

Hallazgo transversal que condiciona todas las tablas:
- **El canvas usa el peso 800 en casi todos sus textos fuertes, pero la app no carga Inter-ExtraBold.** `src/app/_layout.tsx` registra Regular, Medium, SemiBold, Bold y Black, y `@theme` declara `--font-normal`, `--font-medium`, `--font-semibold`, `--font-bold` y `--font-black`.
- Sin `--font-extrabold`, todo 800 del canvas cae en `font-bold` (700) o en `font-black` (900). → Decisión abierta D1.

## 2. Brecha por pantalla

Columnas de cada tabla:
- **Elemento**.
- **Canvas**: CSS exacto.
- **App**: fichero + ancla grepeable.
- **Estado**: paridad, parcial, diverge o falta.
- **Token**: token de tema, o «no existe token».
- **Candado**: test + título del `it` que fija el valor actual.

### 2.1 Salud

Fichero: `src/screens/health/index.tsx` (ruta delgada `src/app/(tabs)/health.tsx`). Tests: `src/screens/health/index.test.tsx` (41 `it` por grep).

| Elemento | Canvas | App | Estado | Token | Candado |
|---|---|---|---|---|---|
| Contenedor | `padding: 60px 20px 120px; gap: 16px` | `contentContainerStyle={{` con `padding: 24`, `gap: 16`, `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 96`; `testID="health-content" style={{ gap: 16 }}` | parcial: lateral 24 frente a 20 | no hay token de padding de pantalla; es un literal compartido con home | `#168 R2` «aplica las métricas estándar al scroll y gap a health-content» |
| Título h1 | `font-size: 30px; font-weight: 900; letter-spacing: -0.02em` | `testID="health-title" className="text-3xl font-black tracking-tight text-foreground"` | paridad (tracking -0.025em frente a -0.02em, unos 0.15 pt) | `text-3xl`, `font-black` | `#168 R1` «pinta el título grande ($name)»; `src/__tests__/tab-headers-canvas.test.ts` |
| Selector de mascota | En la cabecera, a la derecha del h1: avatares de 40 px, `border-radius: 50%`, `gap: 6px`, inicial 800. El activo lleva `background: var(--amber)` y un anillo `box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--accent)`; el otro, violet | `<PetSwitcher` como primer hijo de `health-content`, debajo del título | diverge | colores: `CATEGORY_SLOTS`; anillo: no existe token (se haría con `border-2 border-accent` y un hueco de fondo) | `#168 R2` «pone el PetSwitcher como primer hijo de health-content» y «con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden» |
| Orden de secciones | Tarjeta ámbar «Próxima dosis», luego h2 «Vacunas», lista y tarjeta de peso | PetSwitcher; `vaccines-section` (cabecera con icono + eyebrow, skeleton, `next-vaccine-card`, vacío o error, filas); `weight-card` | diverge: la próxima dosis va **dentro** de la sección y **después** de su encabezado | n/a | R5 «highlights the nearest future dose and keeps row order» * (no se leyó si fija la posición de la tarjeta respecto a la cabecera) |
| Encabezado «Vacunas» | `<h2 style="margin: 4px 0 0; font-size: 18px; font-weight: 800">`, sin icono, en minúsculas con mayúscula inicial | `<HeartPulse size={20} color={muted} />` + `className="text-xs font-semibold uppercase tracking-widest text-muted"` | diverge | `text-lg` + 800, que no existe (D1) | ninguno localizado por grep de la clase * |
| Tarjeta «Próxima dosis»: caja | `border-radius: 24px; background: var(--amber); padding: 16px; gap: 14px`, sin borde ni sombra | `<Card testID="next-vaccine-card" className="flex-row items-center gap-3"`, variante surface: `rounded-card border border-border bg-surface p-4 shadow-sm` | diverge: fondo, radio y sombra | `bg-category-amber` vía `CATEGORY_SLOTS.amber.surface`; el radio de 24 no tiene token (`rounded-3xl`) | `#115 R6` «ordena la card en icono, columna y días, con la fecha en la columna ($branch)» (3 hijos y su orden; no fija el fondo) |
| Tarjeta «Próxima dosis»: tile | 52×52, `border-radius: 16px; background: var(--surface); color: var(--warning)`; icono de jeringa 26, stroke 2.2 | `className="size-11 items-center justify-center rounded-xl bg-warning-soft"` + `<Syringe size={22} color={warning} />` | diverge: 44 frente a 52, radio 12 frente a 16, fondo soft frente a surface | `bg-surface`, `rounded-2xl`; `warning` claro vale `#F59E0B` frente a `#B54708` del canvas (§2.4) | R5 «re-resolves the syringe token when a mounted tab changes theme» |
| Tarjeta «Próxima dosis»: eyebrow | `font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--amber-s)`; «Próxima dosis» | `className="text-2xs font-semibold text-warning-strong"` con `t('health.nextDue')` | diverge: 10 frente a 12, sin uppercase, `warning-strong` frente a `category-amber-strong` | `text-xs uppercase tracking-wider` + `text-category-amber-strong` (existe) | ninguno localizado * |
| Tarjeta «Próxima dosis»: nombre | 18/900 | `className="font-bold text-foreground"` (14/700) | diverge | `text-lg font-black` | `#115 R6`, primer hijo de la columna * |
| Tarjeta «Próxima dosis»: fecha | «12 de octubre · en 6 días», 13/600, `var(--amber-s)` | `testID="next-vaccine-date" className="font-normal text-muted"` con `fmtDate(nextVaccine.nextDoseAt!, locale)`, sin «en N días» | diverge: color y copy (§5) | `text-category-amber-strong` | `#115 R6` «ordena la card…»: `expect(screen.getByTestId('next-vaccine-date').props.className).toBe('font-normal text-muted')` |
| Tarjeta «Próxima dosis»: días | «6d», 28/900, amber-s | `testID="next-vaccine-days" className="text-lg font-black text-warning-strong"`; copy `home.nextVaccineDays` / `home.nextVaccineToday` | diverge: 18 frente a 28, color y copy | `text-[28px]` está prohibido por la carta; lo más cercano es `text-3xl` (30) o un token nuevo | `#115 R6` «pinta los días con la receta exacta ($branch)»: `toBe('text-lg font-black text-warning-strong')` |
| Lista de vacunas: separación | `gap: 10px` | `vaccines-section` con `className="gap-3"` (12) | parcial | `gap-2.5` | ninguno * |
| Fila de vacuna: caja | `border-radius: 20px; background: var(--surface); border: 1px solid var(--border); padding: 14px; gap: 12px`, **sin sombra** | `<Card testID={\`vaccine-row-${vaccine.id}\`} className="flex-row items-center gap-3"`, surface: `p-4 shadow-sm` | parcial: padding 16 frente a 14 y sombra de más | `p-3.5`; quitar la sombra exige otra variante o un override (`shadow-none`) | `#168 R3` «pinta el estado de $id con su icono y textos»: `toContain('flex-row items-center gap-3')`, que tolera clases añadidas |
| Fila de vacuna: tile | 40×40, `border-radius: 12px`, green o amber, icono check o reloj 20 (stroke 2.4) | `vaccine-tile-…` con `className={\`size-10 items-center justify-center rounded-xl ${CATEGORY_SLOTS[slot].surface}\`}`; Check o Clock 20 | **paridad**. La app añade el slot `rose` para dosis vencida, que el canvas no dibuja | `CATEGORY_SLOTS` | `#168 R3`, fija la clase exacta del tile |
| Fila de vacuna: textos | Nombre 15/800; **una sola línea** de 12 px muted: «Aplicada 3 mar 2026 · Próxima 3 mar 2027» | `vaccine-text-…` con `className="flex-1 gap-1"` y tres `<Text>`: nombre `font-bold text-foreground`, `{vaccine.appliedAt}` en ISO crudo con `font-normal text-muted` y `{vaccine.nextDoseAt}` en ISO crudo (en `text-danger` si está vencida) | diverge: 3 líneas frente a 2, ISO crudo frente a fecha formateada, tamaños | `text-xs text-muted`; `fmtDate` ya existe en el mismo fichero | `#168 R3` «pinta el estado de $id con su icono y textos»: `column.children` toHaveLength(texts.length) con `texts: ['Vencida', '2026-01-01', '2026-02-28']` |
| Tarjeta de peso: caja | `border-radius: 24px; background: var(--surface2); padding: 16px; gap: 12px`, sin borde | `<Card testID="weight-card" className="gap-3"`, variante surface | diverge: fondo, borde, sombra y radio | `bg-surface-secondary`; la variante `secondary` de Card lleva `border` | `#62 R5` «aplica la receta canónica a Peso» |
| Tarjeta de peso: cifra | Columna: «Peso» en 13/700 muted encima de «12.4 kg» en 30/900 | Fila `flex-row items-baseline justify-between`: `weight-card-title` con `text-base font-bold text-foreground` y `weight-current` con `text-xl font-black text-accent-strong` | diverge: disposición, 20 frente a 30 y color | `text-3xl font-black text-foreground` | `#62 R5` «aplica la receta canónica a Peso» (fija `text-base font-bold text-foreground` en el título de card) |
| Tarjeta de peso: delta | Chip a la derecha de la cifra: `padding: 4px 10px; border-radius: 999px; background: var(--rose); color: var(--rose-s); 13px/800`, «+0.3 kg» | `testID="weight-variation" className="font-normal text-muted"`, en una fila aparte | diverge | `CATEGORY_SLOTS.rose` (o el color según el signo, D5) | `#115 R5` «con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace» |
| Tarjeta de peso: gráfica | Sparkline de 56 px, `stroke-width: 3`, `var(--accent-strong)`, sin ejes; solo el punto final, `r=5`; `draw` de 1200 ms | `<WeightChart entries={weight.data.weights} />`: `height: 120`, `strokeWidth={2.5}`, `stroke={accent}`, `<Circle … r={3}` en **cada** punto | diverge. **WeightChart es de #169** (pending, rama viva en wt-169) | `accent-strong` vía `useThemeColors` | `#115 R5` (cuatro `it`) + los de #169 * |
| Tarjeta de peso: enlace | `padding: 12px 14px; border-radius: 14px; background: var(--surface)`, 15/700, chevron 18 (stroke 2.4) | `testID="weight-log-link" className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"` + `<ChevronRight size={20}` | diverge: fondo (surface sobre la tarjeta surface2) y radio 12 frente a 14 | `bg-surface`; el radio de 14 no tiene token | `#61 R10` «la fila de enlace al weight log llega a 44 pt sin crecer a la vista»; R6 «shows the current weight and opens the weight log» |
| Carga, vacío y error | No dibujados | `health-loading`, `vaccines-skeleton` (`h-24 w-full rounded-card`), `EmptyState` con Pingo, `vaccines-error`, `weight-card-error` | sin referencia en el canvas; se conservan | n/a | `#127 R2`, `#155 R4`, `R8 (mobile-design-drift)` |
| Entrada `rise` | 400 ms, escalonado de 0, 80, 140, 200 y 260 ms | Nada en `src/screens/health/` | falta. Ya existe `HomeEntrance` / `homeEntering` en `src/screens/home/home-entrance.tsx`, que usan home, login, register y reset-password, y respeta `useReducedMotion` | `MOTION_STAGGER_MS` = 60 y `MOTION_ENTRANCE_OFFSET_Y` = 12 (`src/theme/motion.ts`), frente a 60-80 ms y 14 px del canvas | ninguno |

### 2.2 Nutrición

Fichero: `src/app/(tabs)/food.tsx`. Es una **ruta gorda**, sin `src/screens/food/` (deuda #102). Tests: `src/app/(tabs)/__tests__/food.test.tsx` (60 `it` por grep).

| Elemento | Canvas | App | Estado | Token | Candado |
|---|---|---|---|---|---|
| Contenedor | `gap: 14px`; lateral 20 | `contentContainerStyle={{` con `padding: 24`, `gap: 16` | parcial | literal | tab-headers-canvas * |
| Título | 30/900/-0.02em | `testID="food-title" className="text-3xl font-black tracking-tight text-foreground"` | paridad | `text-3xl` | `#168 R1` «pinta el título grande ($name)» |
| Selector de mascota | Avatares en la cabecera, como en Salud | `<PetSwitcher` después del título | diverge | igual que en Salud | R4 «keeps API order and selects the first pet by default» * |
| Hero: caja | `border-radius: 28px; background: var(--accent); color: #FFFFFF; padding: 18px; gap: 16px; box-shadow: 0 6px 0 var(--lip)` (labio) | `<Card testID="food-plan-card" variant="accent" className="gap-4"`, que da `rounded-card bg-accent p-5 shadow-sm` | diverge: radio 20 frente a 28, padding 20 frente a 18, **sin labio**, sombra difusa de más | no hay radio de 28 (`rounded-[28px]` está prohibido; `rounded-3xl` = 24). El labio tiene receta en la carta, `border-b-4 border-black/25` (4 pt y negro al 25 %), frente a los 6 px de `--lip` del canvas. **No existe token `--lip`** | `#113 R5` «usa h-40 con el radio de card»; la variante `accent` de `src/components/card.tsx` |
| Hero: resumen | `display: flex; align-items: center; gap: 16px` | `testID="food-plan-summary" className="flex-row items-center gap-4"` | paridad | `gap-4` | `#168 R8` «agrupa progreso y columna como únicos hijos del resumen» |
| Anillo | 104×104, `r=44`, `stroke-width=12`, pista `rgba(255,255,255,0.22)`, relleno `#FFFFFF` round, `rotate(-90 52 52)`, `ring` de 1100 ms con 200 ms de retraso | `food-plan-progress` con `size-26`; `food-plan-ring-track` con `strokeOpacity={0.2} strokeWidth={12}`; `food-plan-ring-fill` round; `withTiming` + `ReduceMotion.System` | paridad (0.2 frente a 0.22) | `accentForeground` vía `useThemeColors` | `#168 R8` «la pista tiene exactamente su receta de Circle», «el relleno tiene exactamente su receta y solo anima strokeDashoffset»; `#168 R10` |
| Porcentaje | 24/900 | `testID="food-plan-percent" className="text-lg font-black text-accent-foreground"` | diverge: 18 frente a 24 | `text-2xl` | `#168 R8` «porcentaje y kcal llevan sus clases y cifras tabulares», `toBe('text-lg font-black text-accent-foreground')` |
| kcal consumidas | 11/700, `opacity: .85` | `testID="food-plan-consumed" className="text-xs font-normal text-accent-foreground"` | parcial. **La opacidad del canvas la prohíbe** `#61 R3` | `text-xs font-bold` | `#168 R8` (la misma), `toBe('text-xs font-normal text-accent-foreground')` |
| Eyebrow «Objetivo diario» | 12/800 uppercase, `letter-spacing: .06em; opacity: .85` | `className="text-xs font-semibold uppercase tracking-widest text-accent-foreground"` | parcial: tracking 0.1em frente a 0.06em; 600 frente a 800 | `tracking-wider` (0.05em) | `#168 R8` «agrupa progreso y columna…» (`foodChild(column, 0)`); `legibility-classnames` `#61 R3: ningún texto sobre bg-accent se compone con opacidad`, que cita la clase literal |
| kcal/día | 24/900, «1200 kcal / día» | `testID="food-plan-kcal" className="text-3xl font-black text-accent-foreground"` | diverge: **la app es más grande** (30) | `text-2xl` | `#168 R8`, `toBe('text-3xl font-black text-accent-foreground')` |
| g/día | 14/600, `opacity: .9` | `testID="food-plan-grams" className="font-semibold text-accent-foreground"` | paridad (sin opacidad por `#61 R3`) | n/a | `#168 R8`, `toBe('font-semibold text-accent-foreground')` |
| Comidas: caja | `border-radius: 24px; background: var(--surface); border: 1px solid var(--border); padding: 14px; gap: 8px` | `<Card testID="food-meals-section" className="gap-3"` (surface: radio 20, `p-4`, `shadow-sm`) | parcial | `rounded-3xl`, `p-3.5`, `gap-2` | ninguno de clase * |
| Comidas: cabecera | h2 17/800 + contador «2/3» 15/900 `var(--accent-strong)` | `food-meals-title` con `text-base font-bold text-foreground`; `food-meals-progress` con `text-xs font-semibold text-muted` | diverge en el contador | `text-accent-strong font-black` | `#62 R5` «el título de card usa un único tratamiento» (it.each); `#65 R17` «expone los tres títulos de Food sin perder sus dos aserciones de copy»; R5 «derives progress for three meals and omits an empty warnings section» * |
| Fila de comida: caja | Sin caja: `padding: 8px 0; gap: 12px`, y `border-top: 1px solid var(--border)` desde la segunda fila | `testID={\`meal-row-${index}\`}` con `'flex-row items-center gap-3 rounded-xl bg-surface-secondary p-3'` (servida) o `'… bg-default p-3'` (pendiente) | diverge: tarjetitas rellenas frente a lista con separadores | `border-t border-separator` | `#98 R4` «pinta badges y contador desde servedToday con el reloj del dispositivo en cualquier hora» (`toContain('bg-default')`, `toContain('bg-surface-secondary')`); `#62 R14` «toda esquina no-cápsula que dibuja el repo es continua» (recuento de `CONTINUOUS_CORNER` por fichero) |
| Fila de comida: tile | 36×36, `border-radius: 12px`. Servida: `var(--green)` + check en green-s. Pendiente: `var(--default)` + reloj en muted | `className="size-9 items-center justify-center rounded-full bg-surface"` + `<Clock size={17}` (siempre reloj; accent o muted) | diverge: círculo frente a 12, un solo icono | `CATEGORY_SLOTS.green`, `rounded-xl` | ninguno de clase * |
| Fila de comida: texto | **Una línea**: «08:00» 15/800 + « · 100 g» 600 muted inline | Dos `<Text>`: `{mealTime}` con `font-bold text-foreground` y `{portionGrams} g` con `text-xs font-normal text-muted` | diverge | `Text` anidado | R5 «renders kcal, grams, ordered meals, portions, and local-time badges» * |
| Estado servida | Chip «Servido»: `padding: 4px 10px; border-radius: 999px; background: var(--green); color: var(--green-s); 12px/800`. **No es un botón** | `meal-served-${index}` con `'rounded-full bg-surface px-2 py-1 text-2xs font-bold text-accent-strong'`, dentro del `Pressable` `meal-toggle-${index}` (deshace) | parcial: 10 frente a 12, fondo surface frente a green | `CATEGORY_SLOTS.green` | `#107 R5` «expone opacidad 1 en reposo en el árbol renderizado»; `#109 R1` «acota el bloque de fuente al tag de apertura propio del meal-toggle, con ancla única (#122 R1)»; `#122 R2`; `#98 R5` «deshace una franja servida…» |
| Estado pendiente | Botón «Marcar servido»: `height: 32px; padding: 0 12px; border-radius: 999px; background: var(--accent); color: #FFFFFF; box-shadow: 0 3px 0 var(--lip); font: 800 12px` | `meal-pending-${index}` con `'rounded-full bg-surface px-2 py-1 text-2xs font-bold text-muted'`, texto `food.pending` («Pendiente») | diverge: chip gris frente a botón primario con labio | primario con labio: `rounded-xl bg-accent border-b-4 border-black/25`. La cápsula **choca** con la regla de radio único de los primarios | consistency `#120 R1` «deja todos los botones primarios sólidos en un único radio»; `#166 R2` «inventaría los diecinueve primarios con labio, fichero a fichero»; `#61 R10` (TOUCH_SLOP: 32 pt < 44) |
| Avisos del plan | No dibujados | `warning-card-${code}` (`<Card … className="bg-default"`) | sin referencia | n/a | `#62 R3` «hereda radio, borde y sombra sin capturar el testID del texto» |
| Tarjeta IA | `border-radius: 20px; background: var(--violet); padding: 14px; gap: 12px`, en fila: icono violet-s a la izquierda; título 14/800 violet-s; cuerpo 13, `line-height: 1.4`, en color fg | `<Card testID="food-ai-card" variant="secondary" className="gap-3"`: cabecera con `<Sparkles size={18} color={accent} />` + `food-ai-title` en `text-base font-bold text-foreground`; cuerpo en `text-sm font-normal leading-5 text-muted` | diverge: fondo, disposición, colores | `bg-category-violet`, `text-category-violet-strong` (vía `CATEGORY_SLOTS`) | `#62 R5` (it.each, receta del título de card); `#65 R17`; R6 «shows the AI recommendation only when the explanation is present» |
| Enlaces | `<a>`: `padding: 12px 14px; border-radius: 16px; background: var(--default)`, sin borde ni sombra; título 15/800, subtítulo 12 muted, chevron; `gap: 8px` entre los dos | `<Card testID="meal-schedule-link" className="flex-row items-center justify-between"` y `meals-history-link` (surface con borde y sombra); títulos en `text-base font-bold text-foreground`; `<ChevronRight size={20} color={foreground} />` | diverge: caja | `bg-default rounded-2xl` | `#105 R14` «shows the history card immediately after the schedule and pushes its route» (`toHaveProp('className', 'text-base font-bold text-foreground')`); `#62 R5`; R5 «shows a skeleton and schedule link while the plan is pending» |
| Carga | No dibujada | Mascotas: `<Spinner testID="food-loading" />` (Salud usa Skeleton). Plan: `food-plan-skeleton` `h-40`, `food-meals-skeleton` `h-56`, `food-schedule-skeleton` `h-20` | sin referencia; el Spinner es incoherente con Salud | n/a | `#113 R5` (`toBe('skeleton__root h-40 w-full rounded-card')`) |
| Entrada `rise` | Escalonado de 0, 80, 140 y 200 ms | Solo anima el anillo | falta | `HomeEntrance` | ninguno |

### 2.3 Perfil

Fichero: `src/screens/profile/index.tsx` (ruta delgada). Tests: `src/screens/profile/index.test.tsx` (51 `it` por grep). El artboard trae `dark: true` por defecto, así que la referencia visual primaria es la oscura.

| Elemento | Canvas | App | Estado | Token | Candado |
|---|---|---|---|---|---|
| Contenedor | `gap: 14px`; lateral 20 | `contentContainerStyle={{` con `padding: 24`, `gap: 16` | parcial | literal | tab-headers-canvas * |
| Cabecera: título | 30/900 | `testID="profile-title" className="text-3xl font-black tracking-tight text-foreground"` | paridad | `text-3xl` | `#168 R1` «pinta el título grande ($name)» |
| Cabecera: «Añadir mascota» | Cápsula `height: 36px; padding: 0 14px; border-radius: 999px; background: var(--pill); color: var(--accent-strong); gap: 6px; 14px/800` con icono + | `testID="profile-add-pet" className="rounded-xl bg-accent border-b-4 border-black/25"` + `<Button.Label className="font-bold text-accent-foreground">` | diverge: primario sólido con labio frente a cápsula tonal | `bg-tab-pill` (`--tab-pill` = `--pill` del canvas, idéntico en claro y oscuro), `text-accent-strong`, `rounded-full` | consistency `#166 R2` «inventaría los diecinueve primarios con labio, fichero a fichero» (profile cuenta 1); `#120 R1` it.each `primaryButtons` * (no se verificó si incluye `profile-add-pet`) |
| Selector de mascota | **No existe** en el artboard | `<PetSwitcher` bajo la cabecera | diverge (D3) | n/a | R2 «changes the active pet through the shared PetSwitcher»; R2 «renders the active pet hero, switcher, pills and information rows» |
| Aviso de notificaciones bloqueadas | No dibujado | `notifications-blocked-notice` | sin referencia; se conserva | n/a | `#99 R3` «con el permiso bloqueado pinta el aviso justo debajo de la cabecera, con su copy y su acción» |
| Hero: caja | `border-radius: 28px; background: var(--surface2); padding: 18px; align-items: center; gap: 10px`, sin borde | `<Card variant="secondary" testID="profile-pet-card" className="items-center gap-3"`, que da `rounded-card border border-border bg-surface-secondary p-4` | parcial: radio 20 frente a 28, borde de más, gap 12 frente a 10 | no hay radio de 28 | `#168 R4` «ordena la tarjeta en avatar, nombre y chips» |
| Hero: avatar | 96, círculo, `background: var(--amber)` con huella, `border: 4px solid var(--surface); box-shadow: var(--shadow)` | `<PetAvatar … size={96} testID="profile-pet-avatar" />` (foto o blobatar) | parcial: sin aro de 4 pt ni sombra | no existe token `--shadow` | `#168 R4` «con foto pinta el avatar circular de 96 con su cacheKey», «sin foto pinta el blobatar de 96 sin source» |
| Hero: botón de cámara | Superpuesto: `position: absolute; right: -2px; bottom: -2px; width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--surface2); background: var(--accent)`, icono de cámara blanco, `aria-label="Cambiar foto"` | `testID="change-photo" className="rounded-xl bg-accent-soft"`, `variant="secondary"`, con el texto «Cambiar foto», **debajo** de la tarjeta | diverge | `bg-accent`; 34 pt < 44 obliga a `TOUCH_SLOP` | `#168 R4` «deja change-photo inmediatamente después de la tarjeta» y «con la subida fallida deja change-photo y luego photo-upload-error tras la tarjeta»; consistency «conserva los usos de bg-accent-soft que sí son acento» (recuento global de `bg-accent-soft`) |
| Hero: nombre | 26/900 | `testID="profile-pet-name" className="text-2xl font-black text-foreground"` | parcial (24) | `text-2xl` | `#168 R4` * |
| Hero: chips | `padding: 5px 10px; border-radius: 999px; 12px/800`, `gap: 6px`, centrados y en wrap; azul «Macho», verde «Esterilizado», ámbar «26 meses», violeta «12.4 kg» | `testID="profile-pet-chips" className="flex-row flex-wrap justify-center gap-2"`; cada chip con ``className={`rounded-full px-3 py-1 ${CATEGORY_SLOTS[pill.slot].surface}`}`` + `text-xs font-bold`. **Sexo: `text: pet.sex` en crudo**, así que pinta `male`/`female` (verificado: add-pet envía `value="male"`) | parcial: padding 12 frente a 10, gap 8 frente a 6, 700 frente a 800. **El chip de sexo es un defecto de copy, no de estilo** (§5) | `CATEGORY_SLOTS` (paridad de hueco por dato) | `#168 R5` «ordena los cuatro chips con el hueco y texto de su dato» (fixture `sex: 'female'`), «centra y agrupa los chips con gap-2» |
| Información: caja | `border-radius: 20px; background: var(--surface); border: 1px solid var(--border); padding: 4px 14px`, **sin etiqueta** | `<Card testID="pet-info-card" className="gap-0">` (`p-4`, `shadow-sm`) + etiqueta `pb-2 text-xs font-semibold uppercase tracking-widest text-muted` («INFORMACIÓN») | parcial | `px-3.5 py-1` | `#61 R9` «usa el mismo tratamiento de etiqueta de sección que me-card» (fija la etiqueta) |
| Información: filas | `padding: 11px 0; font-size: 14px`; etiqueta muted y valor 700; `border-top` entre filas | `InfoRow`: `'flex-row items-center justify-between gap-4 border-b border-separator py-3'`; `text-sm font-normal text-muted` / `text-sm font-semibold text-foreground` | parcial: 600 frente a 700, py 12 frente a 11 | `font-bold` | `#62 R6` «conserva el separador en Raza y lo omite en Última señal» |
| Información: GPS | «Vinculado», 700 accent-strong | `value={pet.device?.model ?? null}` (modelo, o «No registrado») | diverge: estado frente a modelo (§5, §6) | `text-accent-strong` | R10 (mobile-device-pairing) * |
| Información: última señal | «hace 5 min» (relativo) | `new Date(pet.lastCommunicationAt).toLocaleString(locale)` (absoluto) | diverge (§5) | ya existen las claves `map.agoMinutes` / `map.agoHours` y `alerts.minutesAgo` | R2 «renders the active pet hero, switcher, pills and information rows» * |
| Accesos | Rejilla `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px`. Tile: `padding: 12px; border-radius: 18px; background: var(--blue|green|amber|violet); color: var(--*-s)`, columna `gap: 6px` con icono arriba y etiqueta 14/800, **sin chevron**. Orden: Documentos, Collar GPS, Zonas seguras, Recordatorios | Cuatro `Pressable` en lista: `'flex-row items-center gap-3 rounded-xl bg-default px-3 py-2'` + tile `size-9 … rounded-xl ${CATEGORY_SLOTS[…].surface}` + `<Text className="flex-1 font-semibold text-foreground">` + `<ChevronRight size={20} color={muted} />`. `reminders-link` queda fuera del bloque que exige mascota cargada | diverge: lista frente a rejilla 2x2 | colores: `CATEGORY_SLOTS` (paridad de hueco); el radio de 18 no tiene token | `#168 R6` «pinta el tile y conserva el destino de %s»; consistency «profile usa cuatro ChevronRight de reicon» (import literal + 4 apariciones); `#62 R14` (recuento `3 + 1 + 4` de `CONTINUOUS_CORNER` en profile); `#61 R10` it.each `['documents-link', 'reminders-link']`; `#41 R9` «pinta la fila de zonas seguras tras la de GPS y abre la ruta de la mascota activa»; R3 «keeps reminders as a button that opens the hidden route»; R10 (pairing) «shows the GPS configuration row and opens pairing» |
| Cuenta: caja | `border-radius: 20px; surface; border; padding: 4px 14px`, **sin etiqueta** | `<Card testID="me-card" className="gap-2">` + etiqueta `text-xs font-semibold uppercase tracking-widest text-muted` («CUENTA») | parcial | n/a | `#61 R9` (la etiqueta de me-card es la referencia de la de pet-info) |
| Cuenta: identidad | Avatar de 34, círculo `var(--default)`, iniciales 13/800; nombre 14/800; email 12 muted | `me-avatar` `size-10 … rounded-full bg-default` (40); `me-avatar-initials` `text-sm font-black`; nombre `text-lg font-bold` (18); email `font-normal text-muted` (14) | parcial: la app es más grande | `size-8.5` no existe (34); `text-sm`, `text-xs` | `#168 R7` «pinta las iniciales de «$firstName» / «$lastName»»; R1 «shows the real account name and email» |
| Cuenta: tema | Fila `<label>` «Usar tema oscuro» 14/600 + checkbox de 20×20 `accent-color: var(--accent)`, separada por `border-top` | `testID="theme-toggle" className="mt-2 rounded-xl bg-default"`, botón `secondary` con el texto alterno `profile.useLightTheme` / `profile.useDarkTheme` | diverge: botón frente a fila con interruptor | `Switch` de heroui-native, ya en uso en `src/screens/geofences/index.tsx` y `src/screens/geofence-editor/index.tsx` | R4 «switches light to dark and persists it», «switches dark to light and persists it»; R4 «R2: el toggle dispara el fade vía withThemeTransition» |
| Cuenta: idioma | Fila «Cambiar idioma» + valor «English» 800 accent-strong | `testID="language-toggle"` botón `mt-2 rounded-xl bg-default` con el endónimo opuesto | diverge: botón frente a fila de valor | `text-accent-strong` | `#65 R14` «shows the opposite endonym and changes the live Profile copy», «preserves local input state across the language repaint» |
| Cerrar sesión | **No visible.** El artboard mide 844 con `overflow: hidden`, y la suma de alturas excede el área útil, así que lo más probable es que esté recortado * | `testID="profile-sign-out" className="rounded-xl bg-danger-soft"`, `variant="danger-soft"` | sin referencia; se conserva (§5 P10) | n/a | R3 «keeps sign out and retires backend health UI» |
| Carga | No dibujada | `profile-hero-skeleton` y `pet-info-skeleton` `h-52 w-full rounded-card`, `me-card-skeleton` | sin referencia | n/a | R2 «uses uniform dimensions and content-sized skeletons while loading»; `#168 R4` «reserva h-52 mientras carga el detalle» |
| Entrada `rise` | Escalonado de 0, 80, 140 y 200 ms | Nada | falta | `HomeEntrance` | ninguno |

### 2.4 Comunes (tokens, tab bar, cabecera)

**Tokens** (canvas `.pt` / `.pt.dark` frente a `src/theme/global.css` `@variant light` / `@variant dark`):

| Token del canvas | Claro: canvas / app | Oscuro: canvas / app | Estado |
|---|---|---|---|
| `--bg`, `--fg`, `--surface`, `--surface2` (= `surface-secondary`), `--default`, `--muted` | idénticos | idénticos | paridad |
| `--border` | `rgba(13,17,23,0.08)` / `rgba(13,17,23,0.07)` | `.08` / `.08` | parcial (solo en claro) |
| `--accent`, `--accent-strong` | idénticos | idénticos | paridad |
| `--lip` | `#0E5E3C` / **no existe** | `#0B4D31` / **no existe** | falta. La carta usa la receta `border-b-4 border-black/25` en su lugar |
| `--lip-gray` | `#E4E7EC` = `--color-lip-gray` | `#0A0D12` = | paridad |
| `--blue/amber/green/violet/rose` y `-s` | iguales a `CATEGORY_SLOTS` (`bg-category-*` / `text-category-*-strong`) | iguales | paridad |
| `--danger` | `#D92D20` / `#EF4444` | `#F87171` / `#F87171` | parcial (solo en claro) |
| `--warning` | `#B54708` / `#F59E0B` (más `--warning-strong` `#92610A`, que el canvas no tiene) | `#FBBF24` / `#FBBF24` | parcial (solo en claro) |
| `--glass` | `rgba(255,255,255,0.86)` / `--glass-surface` `0.60` | `rgba(22,27,34,0.86)` / `0.60` | diverge (afecta a la tab bar de las 5 pestañas) |
| `--pill` | `rgba(23,130,85,0.14)` = `--tab-pill` | `.22` = | paridad |
| `--shadow` | `0 1px 2px rgba(13,17,23,.04), 0 8px 24px rgba(13,17,23,.06)` / no hay token: `Card` usa `shadow-sm` de Tailwind | `0 1px 2px rgba(0,0,0,.4)` | diverge. **El canvas solo pone sombra al avatar del Perfil; sus tarjetas van con borde y sin sombra**, y la app pone `shadow-sm` en toda `Card` surface y accent |
| Radios | El canvas usa 999 (chips, cápsulas), 28 (heroes), 24 (secciones destacadas), 20 (cards), 18 (tiles de acceso), 16 (enlaces, tile de 52), 14 (enlace de peso, el avatar no), 12 (tiles de 36/40) | `--radius-card: 20px` + la escala Tailwind (`rounded-xl` 12, `2xl` 16, `3xl` 24, `full`) | **28, 18 y 14 no tienen token**, y la carta prohíbe las clases con corchetes |
| Peso 800 | omnipresente | `--font-*` sin extrabold; `_layout.tsx` no carga `Inter-ExtraBold` | falta (D1) |

**Tab bar**: canvas `<nav aria-label="Pestañas">` frente a `src/components/floating-tab-bar.tsx`.

| Elemento | Canvas | App | Estado |
|---|---|---|---|
| Caja | `position: absolute; left: 16px; right: 16px; bottom: 28px; height: 64px; padding: 6px; border-radius: 999px; background: var(--glass); border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(13,17,23,0.12); backdrop-filter: blur(20px)` | `className="absolute overflow-hidden rounded-full border border-border shadow-lg"`, `style={{ bottom: insets.bottom + 12, left: 16, right: 16 }}`, `<BlurView … intensity={80}` + `bg-glass-surface` | paridad estructural; el glass es .60 frente a .86 |
| Ítem | `flex: 1; height: 52px; border-radius: 999px`; icono + etiqueta 10/600, `gap: 2px` | `flex-1 items-center gap-1`; icono `size={24}`; `text-2xs font-semibold` en accent-strong o muted | paridad (gap 4 frente a 2) |
| Píldora activa | `background: var(--pill); color: var(--accent-strong)`; la nota dice «se desliza con spring» | `tab-pill` + `withSpring(nextX, TAB_INDICATOR_SPRING)` | paridad |

La tab bar es común a las 5 pestañas. Tocarla saca a #173 de «Salud, Nutrición y Perfil». Si se cambia el glass a .86, va a una decisión aparte (D9).

**Cabecera con avatares de mascota** (Salud y Nutrición): `src/components/pet-switcher.tsx` pinta `pet-chip-${id}` con `'items-center justify-center rounded-full border-2 border-accent bg-accent-soft p-1'` (la seleccionada) o `'… border-transparent bg-default p-1'`, y dentro `<Avatar size="sm" variant="soft" color={selected ? 'accent' : 'default'}>` de heroui-native. Va en su propia fila, en `flex-row gap-2`.

El canvas pinta 40 pt sin marco. Cada mascota lleva **un color pastel por categoría** (ámbar la 1.ª, violeta la 2.ª) y la seleccionada se distingue por un anillo doble: hueco de `--bg` de 3 px + `--accent` de 2 px. La app no tiene hoy un color estable por mascota (D4).

PetSwitcher tiene **6 consumidores**, todos verificados por grep de `components/pet-switcher'`: `src/screens/home/index.tsx`, `src/screens/health/index.tsx`, `src/screens/reminders/index.tsx`, `src/screens/pairing/index.tsx`, `src/screens/profile/index.tsx` y `src/app/(tabs)/food.tsx`. Si se rediseña el aspecto por defecto, cambian 3 pantallas que no están en el encargo; por eso se propone una variante (§3, C7).

<!-- S3 -->
## 3. Cambios estructurales

Criterio:
- **Necesario**: sin el cambio no se alcanza la paridad que pide el humano en Salud, Nutrición o Perfil.
- **Opcional**: mejora la paridad o el mantenimiento, pero hay un camino sin él.

Regla de extracción (skill `expo:expo-design-system`): un componente sube a `src/components/` solo si cumple tres condiciones:
- lo usan 2 o más pantallas;
- tiene un rol con nombre;
- su API es más pequeña que su implementación.

Los controles de plataforma (`Switch`) no se envuelven. Las variantes van por composición (`variant` + `children`), no con props de contenido.

### 3.1 Tokens (`src/theme/global.css`, `src/app/_layout.tsx`)

| # | Cambio | Clase | Motivo | Coste |
|---|---|---|---|---|
| T1 | `--font-extrabold` + `Inter-ExtraBold.ttf` en `assets/fonts/` y en el `useFonts` de `_layout.tsx` | opcional (D1) | El peso 800 está en casi todos los textos fuertes del canvas. Sin él, cada 800 se mapea a 700 o a 900: la diferencia se ve en titulares de 18 a 24 pt y apenas en 13-14 pt. Hoy `assets/fonts/` tiene Regular, Medium, SemiBold, Bold y Black | un binario nuevo, no una dependencia npm. No se buscó ningún candado que fije la lista de fuentes * |
| T2 | Radios 28, 24, 18 y 14 | según D2 | La carta §12 admite tres radios (`rounded-card` 20, `rounded-xl` 12 y `rounded-full`) y prohíbe por grep `rounded-2xl`, `rounded-3xl` y las clases con corchetes. Hay dos opciones:<br>**A**, mapear: 28 y 24 pasan a 20; 18, 16 y 14 pasan a 20 o a 12. No necesita enmienda.<br>**B**, tokens nuevos: `--radius-hero` (28) y `--radius-tile` (16-18), con enmienda de §12 y de sus guards | A: ningún candado de carta. B: enmienda de carta más sus guards * |
| T3 | Sombra de tarjeta | opcional (D8) | Las tarjetas del canvas no llevan sombra, solo borde. `Card` pone `shadow-sm` en las variantes surface y accent | Cambiarlo en `Card` alcanza a sus **19** consumidores (ficheros no test que la importan). La alternativa local es una variante sin sombra, sin consumidores fuera de #173 |
| T4 | `--lip` (`#0E5E3C` en claro, `#0B4D31` en oscuro) | no recomendado | La carta §13 ya resuelve el labio con `border-b-4 border-black/25`, que sobre `bg-accent` da un verde oscuro casi igual. Diferencias: 4 pt frente a 6 px, y el tono exacto | Cambiar la receta enmienda §13 y el inventario de `#166 R2` |
| T5 | Colores en claro: `--border` (.07 a .08), `--danger` y `--warning` | opcional; probablemente fuera de alcance | Son globales. Mover `--warning` cambia el ámbar de todas las advertencias de la app | habría que revisar los contrastes de #61 * |
| T6 | `--glass-surface` de .60 a .86 | fuera de alcance (D9) | Solo afecta a la tab bar, común a las 5 pestañas | n/a |
| T7 | Entrada `rise` | sin token nuevo | `src/theme/motion.ts` define `MOTION_STAGGER_MS` = 60 y `MOTION_ENTRANCE_OFFSET_Y` = 12; el canvas usa un escalonado de 60 a 80 ms y 14 px. La paridad basta sin tocar tokens | ninguno |

### 3.2 Componentes

| # | Cambio | Clase | Motivo |
|---|---|---|---|
| C1 | Reutilizar `HomeEntrance` / `homeEntering` (en `src/screens/home/home-entrance.tsx`) en Salud, Nutrición y Perfil | necesario para la entrada `rise` | Ya lo usan home, login, register y reset-password, y respeta `useReducedMotion`. Con 7 consumidores, su sitio natural sería `src/components/`. Moverlo es opcional (E3) y cambia los imports de 4 pantallas |
| C2 | `SectionHeader`: h2 de 18 pt / 800, sin icono, con un hueco opcional a la derecha (contador) | necesario | El canvas tiene `<h2>` en **Salud («Vacunas»)** y en **Nutrición («Comidas hoy»)**; Perfil no tiene ninguno (verificado por grep de `<h[1-3]` en los tres artboards). Hoy cada pantalla repite `text-xs font-semibold uppercase tracking-widest text-muted` con icono. Candado: `#62 R5` «el título de card usa un único tratamiento» (en los tests de Salud y de Nutrición) fija el tratamiento actual. El componente nuevo **enmienda** ese tratamiento único, no lo evita |
| C3 | Variante nueva de `Card`, `tinted`: fondo de categoría o surface2, sin borde ni sombra | necesario | La usan la tarjeta «Próxima dosis» (ámbar), la tarjeta IA (violeta) y la de peso (surface2 sin borde). Añadir una variante no toca a los 19 consumidores; cambiar las existentes sí. El slot de color se pasa desde `CATEGORY_SLOTS` (`#64 R9`: es el único sitio que nombra esas clases) |
| C4 | `IconTile`: cuadrado redondeado con icono en color de categoría, de 36, 40, 44 o 52 pt | opcional (recomendado) | Aparece en las filas de vacuna, en la próxima dosis, en las filas de comida y en los accesos e información de Perfil. `#168 R3` ya pinta tiles de vacuna con `CATEGORY_SLOTS`. Extraerlo evita 4 copias; recibe el slot y nunca nombra clases |
| C5 | Filas agrupadas con separador fino (`border-t border-separator` desde la 2.ª fila) | opcional | Filas de comida, de vacuna y de información. Es la recomendación «Everything's a Card» de la skill: agrupar con líneas finas, no con cajas rellenas. `#62 R6` «la última fila de pet-info-card no cuelga su separador» ya prescribe el patrón en Perfil. Basta un helper de clase; un componente `ListRow` es discutible porque el contenido de cada fila difiere |
| C6 | Chip de estado sobre `CATEGORY_SLOTS` (cápsula, 12-13 pt / 800) | opcional | Delta de peso (Salud), «Servido» (Nutrición) y chips de dato del hero (Perfil; `#168 R5` ya los pinta). **#169 añade chips de delta en weight-log**: si #169 mergea antes, #173 debe reutilizar su chip y no duplicarlo |
| C7 | `PetSwitcher`, variante con avatares: 40 pt, sin marco, color por mascota y anillo doble en la seleccionada | necesario para Salud y Nutrición | Tiene **6 consumidores**: home, health, reminders, pairing, profile y `app/(tabs)/food.tsx`. Cambiar el aspecto por defecto rediseñaría también home, reminders y pairing, que no están en el encargo. Recomendado: una prop `variant` que conserve el aspecto actual por defecto. El color por mascota es D4; Perfil no dibuja el selector (D3) |
| C8 | Rejilla de accesos: `grid-template-columns: repeat(2, …)`, tiles de radio 18, icono arriba, etiqueta 14 pt / 800, sin chevron | necesario para Perfil | Sustituye las 4 filas con `ChevronRight`. Rompe el candado global «profile usa cuatro ChevronRight de reicon» y toca `#61 R10` (`TOUCH_SLOP` en documents-link y reminders-link). Un tile de media anchura ya pasa de 44 pt * y el slop sobraría, pero el candado lo exige. Es una sola pantalla: componente local en `src/screens/profile/` |
| C9 | Botón de cámara superpuesto al avatar: 34 pt, `bg-accent`, aro del color de fondo | necesario para Perfil | Al medir 34 < 44, exige `hitSlop={TOUCH_SLOP}` (`#61 R10`). Hoy es un botón aparte, colocado justo después de la tarjeta por `#168 R4` |
| C10 | Cuenta: fila con `Switch` para el tema y fila de valor para el idioma | necesario para Perfil | `Switch` de heroui-native ya se usa en `src/screens/geofences/index.tsx` y `src/screens/geofence-editor/index.tsx`, y la skill pide no envolverlo. Candados: R4 «toggle persiste» (mobile-pets-profile) y `#65 R14`, que pulsan los controles actuales * (no se leyó si los buscan por testID o por rol) |
| C11 | «Marcar servido» como botón primario visible en cada fila pendiente | según D6 | Hoy el toggle es un chip «Pendiente» pulsable; `#107 R5`, `#109 R1` y `#122 R1/R2` fijan su bloque fuente (feedback de pulsado y anidamiento). Un primario con labio entra en el inventario de `#166 R2`, «inventaría los diecinueve primarios con labio, fichero a fichero», que deja de valer 19 |

### 3.3 Estructura de ficheros

| # | Cambio | Clase | Motivo |
|---|---|---|---|
| E1 | Migrar `src/app/(tabs)/food.tsx` a `src/screens/food/index.tsx` con ruta delgada (deuda #102) | opcional; la paridad no lo pide | La paridad visual sale igual en la ruta gorda. Moverlo rompe rutas literales en 8 candados globales (§4.4) y mueve `src/app/(tabs)/__tests__/food.test.tsx` (60 `it`). Si se hace, mejor como feature propia, antes o después de #173 y nunca mezclada con cambios de clase: así cada candado tiene un solo motivo para cambiar |
| E2 | Partir `src/screens/profile/index.tsx` en subcomponentes (tarjeta de mascota, rejilla, cuenta) | opcional | Encoge el fichero, pero varios candados globales leen esa ruta exacta (recuento de `CONTINUOUS_CORNER`, `ChevronRight`, `#87 R19`, `#166 R2`). Partirlo reparte esos recuentos entre ficheros nuevos y obliga a enmendar cada candado |
| E3 | Mover `HomeEntrance` a `src/components/` | opcional | Ver C1. Rompe imports en 4 pantallas y en sus tests * |

<!-- S4 -->
## 4. Candados afectados

Cómo leer las tablas:
- Los títulos son `describe` › `it`, copiados por grep. Si solo aparece el `describe`, no se aisló el `it` exacto.
- Todas las carpetas `specs/<dir>/` citadas existen en wt-168 (comprobado con `test -d`).
- Veredicto:
  - **Enmienda**: el cambio de #173 contradice lo que fija el candado.
  - **Sobrevive**: el candado sigue en verde si se conservan el testID, el copy o el hitSlop.
  - **Revisar**: no se leyó el cuerpo lo bastante para decidir *.
- Los candados `#168 R*` solo existen si #168 mergea antes que #173. Su spec vive en la rama de #168 (`specs/mobile-tab-headers-canvas/`).

### 4.1 Salud (`src/screens/health/index.test.tsx`)

| R-id (spec) | describe › it | Qué fija hoy | Cambio de #173 | Veredicto |
|---|---|---|---|---|
| `#168 R3` (mobile-tab-headers-canvas) | «#168 R3: cada vacuna lleva su tile pastel» › «pinta el estado de $id con su icono y textos» | 3 textos por fila, con el ISO crudo y sus clases | 2 líneas con la fecha formateada | **enmienda** |
| `#168 R2` (mobile-tab-headers-canvas) | «#168 R2: Salud sin hero y con métricas estándar» | PetSwitcher como primer hijo y el orden del scroll | la próxima dosis entra **dentro** de la sección de vacunas, tras su h2; PetSwitcher con variante | **enmienda** |
| `#115 R6` (mobile-health-make-parity) | «#115 R6: la próxima vacuna dice fecha y días restantes» › «ordena la card en icono, columna y días…» y «pinta los días con la receta exacta» | días en `text-lg font-black text-warning-strong`; `next-vaccine-date` en `font-normal text-muted` | tarjeta ámbar, días a 28 pt en `category-amber-strong`, eyebrow | **enmienda** |
| `#115 R5` (mobile-health-make-parity) | «#115 R5: la weight card dibuja la evolución con WeightChart» | WeightChart entre la variación y el enlace | el delta sube junto a la cifra; la gráfica sigue entre ambos | sobrevive * |
| `#62 R5` (mobile-ui-consistency-polish) | «#62 R5: el título de card usa un único tratamiento» › «aplica la receta canónica a Peso» | título de card en mayúsculas, muted y con icono | `SectionHeader` h2 de 18 pt / 800 (C2) | **enmienda** (la misma que en Nutrición) |
| `#61 R10` (mobile-ui-legibility-polish) | «#61 R10: los controles táctiles declaran TOUCH_SLOP» | el enlace de peso llega a 44 pt | el enlace cambia de fondo y de radio | sobrevive si conserva `hitSlop` |
| R5 (mobile-health) | «R5: vacunas con la próxima destacada» › «re-resolves the syringe token when a mounted tab changes theme» | el color del icono de jeringa se re-resuelve al cambiar de tema | si el tile pasa a color de categoría, cambia el token que se re-resuelve | revisar * |
| `#127 R2` (mobile-classnames-own-tag-tree-lock) | «#127 R2: el skeleton de vacunas lleva su receta en el árbol» | receta del skeleton | el canvas no dibuja la carga | sobrevive |
| `#155 R4` (mobile-empty-states-pingo), `#168 R1` | «#155 R4: Salud sin mascotas presenta a Pingo»; «#168 R1: Salud pinta el título grande en todas sus ramas» | vacío y h1 | sin cambio | sobrevive |

### 4.2 Nutrición (`src/app/(tabs)/__tests__/food.test.tsx`)

| R-id (spec) | describe › it | Qué fija hoy | Cambio de #173 | Veredicto |
|---|---|---|---|---|
| `#168 R8` (mobile-tab-headers-canvas) | «#168 R8: food-plan-card pinta el anillo» | clases exactas de percent, consumed, kcal, grams, eyebrow y summary | % a 24 pt, kcal/día más pequeño, tracking del eyebrow, labio | **enmienda** |
| `#168 R9`, `#168 R10` | «#168 R9: el anillo dice el porcentaje acotado»; «#168 R10: el anillo transiciona con reduce motion» | anillo | paridad | sobrevive |
| `#98 R4` (mobile-meals-served-ui) | «#98 R4: el estado servido sale de servedToday, no del reloj» › «pinta badges y contador desde servedToday con el reloj del dispositivo en cualquier hora» | `toContain('bg-default')` y `toContain('bg-surface-secondary')` en `meal-row-*` | filas sin caja, con separador | **enmienda** |
| `#107 R5` (mobile-meal-toggle-press-lock), `#109 R1` (mobile-meal-toggle-source-lock-nesting), `#122 R1/R2` (mobile-source-lock-slice-blind-spots) | «#107 R5: el botón por franja conserva su feedback de pulsado»; «#122 R2: el botón baja a opacidad 0.8 mientras se pulsa» | el bloque fuente del meal-toggle: Pressable, opacidad al pulsar y anidamiento | «Marcar servido» como primario visible (C11, D6) | **enmienda** si cambia la forma del toggle; sobrevive si solo cambian las clases dentro del mismo Pressable * |
| `#62 R5` (mobile-ui-consistency-polish) | «#62 R5: el título de card usa un único tratamiento» (it.each) | tratamiento único de los títulos de card | h2 «Comidas hoy» fuera de la tarjeta (C2) | **enmienda** |
| `#65 R17` (mobile-ui-language) | «#65 R17: los títulos de card se localizan por testID y su copy sigue asertada» | testID + copy de cada título | copy nuevo solo si el humano aprueba §5 | sobrevive si se conservan testID y claves |
| `#62 R3` (mobile-ui-consistency-polish) | «#62 R3: los avisos de plan usan el Card compartido» | avisos | el canvas no los dibuja | sobrevive |
| `#105 R14` (meals-history) | «#105 R14: Food opens served meals history» | título y destino del enlace al historial | caja del enlace | sobrevive si se conservan testID y copy * |
| `#113 R5` (mobile-kcal-consumed-bar) | «#113 R5: el esqueleto del plan reserva el alto de la tarjeta con progreso» | `skeleton__root h-40 w-full rounded-card` | solo cambia con D2 opción B (radio 28 del hero) | enmienda solo con D2-B |
| R5, R6 (mobile-food) | «R5: plan del día con horarios y warnings»; «R6: aiExplanation nullable con gracia» | estructura y copy del plan y de la IA | tarjeta IA violeta con otra disposición | revisar * |

### 4.3 Perfil (`src/screens/profile/index.test.tsx`)

| R-id (spec) | describe › it | Qué fija hoy | Cambio de #173 | Veredicto |
|---|---|---|---|---|
| `#168 R4` (mobile-tab-headers-canvas) | «#168 R4: Perfil sustituye el hero por profile-pet-card» | orden de la tarjeta, avatar de 96 y `change-photo` justo después de la tarjeta | cámara superpuesta al avatar (C9) | **enmienda** |
| `#168 R5` | «#168 R5: Perfil pinta chips pastel por dato» | chips con el fixture `sex: 'female'` y `gap-2` | chip de sexo localizado (§5 P8) y gap de 6 | **enmienda**: el fixture asevera el valor crudo * |
| `#168 R6` | «#168 R6: cada fila de navegación lleva su tile pastel» | tiles y destinos en filas | rejilla 2×2 sin chevron (C8) | **enmienda** |
| `#168 R7` | «#168 R7: la cuenta muestra el avatar de iniciales» | iniciales | tamaño de 34 | sobrevive * |
| `#61 R9` (mobile-ui-legibility-polish) | «#61 R9: la etiqueta de sección de pet-info-card vuelve a #46 R10» | la etiqueta de pet-info es igual a la de me-card | el canvas no tiene etiquetas «Información» ni «Cuenta» (§5 P9) | **enmienda** si se quitan |
| `#62 R6` (mobile-ui-consistency-polish) | «#62 R6: la última fila de pet-info-card no cuelga su separador» | separadores | igual en el canvas | sobrevive |
| `#61 R10` | «#61 R10: los controles táctiles declaran TOUCH_SLOP» | `TOUCH_SLOP` en documents-link y reminders-link | tiles de rejilla | sobrevive si se conserva `hitSlop`; si no, **enmienda** |
| `#41 R9` (mobile-geofences) | «#41 R9: Perfil enlaza a las zonas seguras de la mascota activa» | zonas seguras después del GPS | orden del canvas: Documentos, Collar GPS, Zonas seguras, Recordatorios | sobrevive * |
| R10 (mobile-device-pairing) | «R10 (mobile-device-pairing): el perfil enlaza a /pairing» | destino del GPS | tile «Collar GPS» | sobrevive si el destino no cambia |
| R2 (mobile-pets-profile) | «R2: estructura Figma» | estructura de la pantalla, incluido PetSwitcher | PetSwitcher (D3) y el orden | **enmienda** |
| R3 (mobile-pets-profile) | «R3: reminders-link y sign out» | recordatorios y cerrar sesión | cerrar sesión (P10) | revisar |
| R4 (mobile-pets-profile) | «R4: toggle persiste» | toggle de tema | fila con `Switch` (C10) | **enmienda** * |
| `#65 R14` (mobile-ui-language) | «#65 R14: Profile cambia el idioma y repinta sin reiniciar» | idioma | fila de valor | **enmienda** probable * |
| `#99 R3` (mobile-notifications-permission-recovery) | «#99 R3: Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app» | aviso | se conserva | sobrevive |

### 4.4 Candados globales (`src/__tests__/`)

| Test | describe › it (R-id) | Qué fija hoy | Lo rompe | Veredicto |
|---|---|---|---|---|
| `consistency-classnames.test.ts` | «profile usa cuatro ChevronRight de reicon» (spec * no localizada) | la línea de import literal y 4 `<ChevronRight size={20} color={muted} />` | rejilla de accesos sin chevron (C8) | **enmienda** |
| `consistency-classnames.test.ts` | «#62 R14: toda esquina no-cápsula que dibuja el repo es continua» | recuento de `CONTINUOUS_CORNER` por fichero: profile `3 + 1 + 4`, food `2 - 1` | cada caja nueva no cápsula (tiles, rejilla, tarjeta ámbar) y E1/E2 | **enmienda** del recuento |
| `consistency-classnames.test.ts` | «#166 R2: todo primario sólido lleva el labio detrás de bg-accent» › «inventaría los diecinueve primarios con labio, fichero a fichero» (mobile-chunky-cta) | profile cuenta 1 | «Añadir mascota» pasa a tonal (profile −1); «Marcar servido» como primario (food +n, C11) | **enmienda** |
| `consistency-classnames.test.ts` | `#120 R1` (mobile-classnames-element-slice-children): «deja todos los botones primarios sólidos en un único radio» y «%s aplica rounded-xl a %s en su tag de apertura (#120 R1)» | radio único `rounded-xl` en los primarios | «Marcar servido» como cápsula (D6) | **enmienda** solo si D6 = cápsula |
| `consistency-classnames.test.ts` | «conserva los usos de bg-accent-soft que sí son acento» | recuento de `bg-accent-soft` | la variante de PetSwitcher deja `bg-accent-soft` en el chip seleccionado | revisar * |
| `consistency-classnames.test.ts` | «deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban»; «#98 R10: los candados que esta feature no mueve» | leen `src/app/(tabs)/food.tsx` | E1 (ruta); cambios de clase en food | **enmienda** con E1 o al mover esas clases * |
| `consistency-classnames.test.ts` | «#64 R9: el color categórico solo se nombra en el módulo de paleta» (mobile-pastel-category-palette) | `bg-category-*` y `text-category-*` solo en `src/utils/category-palette.ts` | componentes nuevos (C3, C4, C6, C8) | sobrevive si reciben el slot de `CATEGORY_SLOTS` |
| `legibility-classnames.test.ts` | «#61 R3: ningún texto sobre bg-accent se compone con opacidad» | lista `food.tsx` y cita la clase del eyebrow | opacidad del canvas en el hero (D7), cambio de clase del eyebrow, E1 | **enmienda** si D7 = opacidad, si cambia el eyebrow o con E1 |
| `legibility-classnames.test.ts` | «#61 R4: el acento como tinta usa accent-strong» | `food.tsx` cuenta 1 | contador «Comidas hoy», chips | revisar el recuento |
| `design-drift.test.ts` | «#98 R10: la barra de comidas no mete drift de estilo» (mobile-meals-served-ui) | `food.tsx` | E1 | **enmienda** con E1 |
| `design-drift.test.ts` | «#87 R19: use-…» * (título truncado por el grep) (mobile-tanstack-query) | recuentos: food 0, health 0, profile 2 | E1 y E2 | revisar con E1/E2 |
| `design-drift.test.ts` | «R9: mobile-pets-profile sin drift» | perfil sin escapes de estilo | `boxShadow` inline para la sombra del avatar | revisar *: depende de cómo defina drift el test |
| `design-drift.test.ts` | «mantiene sus tres ficheros sin escapes de estilo literales» (spec * no localizada) | 3 ficheros | estilos inline nuevos | revisar * |
| `tab-headers-canvas.test.ts` | «limita el literal a los tres ficheros de producción» (#168) | rutas `app/(tabs)/food.tsx`, `screens/health/index.tsx` y `screens/profile/index.tsx` | E1 | **enmienda** con E1 |

Recuento: con E1 se suman **8 candados globales que leen la ruta de `food.tsx`** (3 de consistency: `#62 R14`, «deja CONTINUOUS_CORNER…» y `#98 R10`; 2 de legibility: `#61 R3` y `#61 R4`; 2 de design-drift: `#98 R10` y `#87 R19`; y tab-headers-canvas), además del traslado de `food.test.tsx`. Sin E1, hay que enmendar entre 3 y 5 globales: `ChevronRight`, `#62 R14` y `#166 R2` seguro, más `#120 R1` si D6 = cápsula y `#61 R3` si D7 = opacidad.

<!-- S5 -->
## 5. Copy del canvas no aprobado

Método:
- Cada texto visible de los tres artboards (extraído quitando etiquetas HTML) se buscó en `src/i18n/catalog.ts` con `grep -F`.
- Según la memoria del proyecto, el copy del canvas está **inventado y no aprobado**. Por eso cada cadena sin clave se plantea como pregunta, nunca como requisito.

**Ya tienen clave**, así que no hace falta preguntar por ellas:

| Cadena del canvas | Clave en el catálogo |
|---|---|
| «Vacunas» | `health.vaccines` |
| «Peso» | `health.weight` |
| «Próxima dosis» | `health.nextDue` |
| «Registro de peso» | `health.weightLog` |
| «Objetivo diario» | `food.dailyTarget` |
| «1200 kcal / día» | `food.dailyKcal` |
| «300 g / día» | `food.dailyGrams` |
| «Comidas hoy» | `food.mealsToday` |
| «Servido» | `food.served` |
| «Recomendación IA» | `food.aiRecommendation` |
| «Horario de comidas» y su subtítulo | `food.mealSchedule`, `food.mealScheduleLinkSubtitle` |
| «Historial de comidas» y su subtítulo | `food.mealsHistory`, `food.mealsHistoryLinkSubtitle` |
| «Añadir mascota» | `profile.addPet` |
| «Esterilizado» | `profile.sterilized` |
| «26 meses» | `profile.ageMonths` |
| «Raza» | `profile.breed` |
| «Microchip» | `profile.microchip` |
| «Última señal» | `profile.lastSignal` |
| «Documentos», «Recordatorios» | `profile.documents`, `profile.reminders` |
| «Zonas seguras» | `geofences.title` |
| «Usar tema oscuro» | `profile.useDarkTheme` |
| «Cambiar idioma» | `profile.changeLanguage` |

**Preguntas para el humano.** Ninguna cadena de estos artboards es de Pingo: Pingo no aparece en Salud, Nutrición ni Perfil. La voz §7 (sereno, tutea, primera persona, sin emoji, exclamación solo para celebrar) solo entra en juego si el humano quiere que Pingo hable en alguna de estas tarjetas (ver P12).

| # | Canvas | Catálogo hoy | Pregunta |
|---|---|---|---|
| P1 | Fila de vacuna: «Aplicada 3 mar 2026 · Próxima 3 mar 2027» | No hay clave «Aplicada». La app pinta 3 líneas con el ISO crudo | ¿Se aprueba una clave nueva «Aplicada {{applied}} · Próxima {{next}}», y cuál sería su texto en inglés? Si `nextDoseAt` es `null`, el canvas no lo dibuja: ¿queda solo «Aplicada {{applied}}»? |
| P2 | Próxima dosis: «12 de octubre · en 6 días» (fecha larga sin año) | `home.nextVaccineDaysLeft` = 'Faltan {{days}} días' / 'In {{days}} days' | ¿Se reutiliza «Faltan {{days}} días» o se crea «en {{days}} días»? ¿Qué se dice con 0 días, con 1 día y con la dosis vencida? El canvas no dibuja esos casos |
| P3 | «6d» en grande, a la derecha | `home.nextVaccineDays` = '{{days}} d' (con espacio) | El canvas repite los días dos veces en la misma tarjeta («en 6 días» y «6d»). ¿Se quiere esa redundancia? ¿Con espacio o sin él? |
| P4 | Botón «Marcar servido» en la fila pendiente | `food.markServed` = 'Marcar {{time}} como servida', solo de accesibilidad; la etiqueta visible es `food.pending` = 'Pendiente' | ¿Etiqueta visible nueva? ¿«servido» (canvas) o «servida» (catálogo, en concordancia con «comida»)? ¿Desaparece la palabra «Pendiente»? |
| P5 | Tile «Collar GPS» | `profile.gpsDevice` = 'Dispositivo GPS'; `profile.gpsSettings` = 'Configuración del Dispositivo GPS' | ¿Clave nueva para el tile, o se reutiliza 'Dispositivo GPS'? El canvas usa «Dispositivo GPS» en la fila de información y «Collar GPS» en el tile |
| P6 | Fila «Dispositivo GPS» con el valor «Vinculado» | No hay clave. La app pinta el modelo | ¿Estado («Vinculado» / sin collar) o modelo? Para el caso sin dispositivo existe `home.noCollar` = 'Sin collar — solo salud' |
| P7 | «Última señal · hace 5 min» | `map.agoMinutes` = 'hace {{minutes}} min'; `map.agoHours` existe; `alerts.minutesAgo` = 'Hace {{minutes}} min' (con mayúscula) | ¿Se reutilizan las claves `map.*`? ¿Qué se muestra a partir de un día? No se buscó una clave de días * |
| P8 | Chip «Macho» | `addPet.male` = 'Macho', `addPet.female` = 'Hembra'. **La app pinta `pet.sex` en crudo ('female')**: es un defecto, no un cambio de estilo | Solo confirmación: ¿se reutilizan las claves de `addPet.*`? Es candidato a entrar aunque no se haga el resto |
| P9 | El canvas no tiene las etiquetas «Información» ni «Cuenta» | `profile.information`, `profile.account` | ¿Se quitan? Choca con `#61 R9` (§4.3) |
| P10 | «Cerrar sesión» **no aparece** en el artboard (no hay ningún texto así; probablemente está recortado por `overflow: hidden` *) | `profile.signOut` = 'Cerrar sesión' | Recomendación: conservarlo donde está (`profile-sign-out`, danger-soft). Quitarlo sería un cambio de producto. ¿Confirmas? |
| P11 | Contador «2/3» junto a «Comidas hoy» | `food.mealsToday` existe; no se buscó una clave de contador * | ¿El contador sale sin texto («{{served}}/{{total}}»)? |
| P12 | Texto de la IA: «Rocky subió 0.3 kg este mes. Reduce la porción…» | `aiExplanation` del backend | Es **dato, no copy**: no necesita aprobación. Si se quiere que lo diga Pingo, es copy nuevo con la voz §7 |
| P13 | Fila «Usar tema oscuro» con interruptor | La clave alterna entre `profile.useDarkTheme` y `profile.useLightTheme` según el tema | Con un `Switch`, ¿la etiqueta queda fija («Usar tema oscuro») y el interruptor muestra el estado? Si la etiqueta sigue alternando, contradice al interruptor |
| P14 | Fila «Cambiar idioma» con el valor «English» (con la interfaz en español) | `profile.changeLanguage` | El valor del canvas es el idioma **de destino**. ¿Se mantiene así, o se muestra el idioma actual? |

<!-- S6 -->
## 6. Datos que faltan

Verificado contra `src/api/types.ts`. **Ningún elemento del canvas exige cambios de backend.**

| Dato del canvas | Fuente | Estado |
|---|---|---|
| Fecha aplicada y próxima de cada vacuna | `Vaccine.appliedAt`, `Vaccine.nextDoseAt` (`null` posible) | existe; falta el formato (P1) |
| Días a la próxima dosis | `PetProfile.nextVaccine` y fecha de hoy; la app ya lo calcula para `#115 R6` | existe |
| Peso actual | `PetProfile.currentWeightKg` / `WeightEntry.weightKg` | existe |
| Delta «+0.3 kg» | `WeightEntry.variation` (`null` posible) es la variación **por entrada**, frente a la medida anterior *. El canvas no dice el periodo; el texto de la IA habla de «este mes» | **ambiguo** (D10): si el delta es mensual, hay que derivarlo en el cliente a partir de `measuredAt` |
| Sparkline | lista de `WeightEntry` (WeightChart, dueña #169) | existe |
| %, kcal consumidas, kcal/día, g/día | `kcalConsumedToday`, `merKcal`, `dailyGrams` | existe |
| Comidas hoy «2/3» y el estado por franja | `mealTimes`, `servedToday`, `mealsPerDay` | existe |
| «· 100 g» por comida | `dailyGrams / mealsPerDay`, derivado * (no se comprobó si la app ya lo pinta) | derivable |
| Texto de la IA | `aiExplanation` (`null` posible) | existe |
| Nombre, sexo, esterilizado, edad, peso, raza, microchip, foto | `name`, `sex`, `sterilized`, `ageMonths` / `approxAgeMonths`, `currentWeightKg`, `breed`, `microchip`, `photoUrl` | existe |
| «Vinculado» | `PetProfile.device !== null`; el estado fino sería `DeviceStatus.connectivity` * | derivable (P6) |
| «Última señal hace 5 min» | `PetProfile.lastCommunicationAt` o `DeviceStatus.lastMessageAt` | existe. Hay que elegir campo * (la app ya pinta uno; no se comprobó cuál) |
| Identidad de la cuenta (iniciales, nombre, correo) | lo que ya consume `#168 R7` * | existe |
| **Color estable por mascota** (ámbar la 1.ª, violeta la 2.ª) | **No hay campo de UI.** `PetProfile.color` es el color del pelaje, un dato del animal y no de la interfaz | derivable por índice en la lista o por hash del `id` (D4) |

<!-- S7 -->
## 7. Propuesta de partición y decisiones abiertas

### 7.1 Las tres candidatas que la descripción de #173 manda evaluar

| Candidata | Recomendación | Motivo |
|---|---|---|
| Texto de `pet.sex` (P8) | **entra** | Es un defecto visible: la app pinta 'female' en crudo. Las claves existen (`addPet.male` / `addPet.female`). Cuesta enmendar el fixture de `#168 R5` |
| Rediseño de PetSwitcher (C7) | **entra como variante**, no como cambio del aspecto por defecto | Tiene 6 consumidores y solo 2 o 3 están en el encargo. Una variante deja home, reminders y pairing intactos |
| Migración de `food.tsx` (E1) | **no entra en #173**; si se quiere, va como feature propia antes de la parte de Nutrición | La paridad no la necesita y obliga a cambiar 8 candados globales por ruta. Mezclada con cambios de clase, cada candado tendría dos motivos para cambiar en el mismo diff |

### 7.2 Partición propuesta

El tamaño de cada parte es una estimación de R-ids hecha por el explorer *; la cifra real la fija el spec_author.

| Parte | Contenido | R-ids aprox. | Enmiendas de candados (§4) |
|---|---|---|---|
| **F0** (solo si D1 = ExtraBold o D2 = B) | Tokens y carta: `--font-extrabold` + fuente; radios nuevos; enmienda de `docs/ui-guidelines.md` §12 | 3-4 | guards de radio de la carta * |
| **F1 Salud** + primitivas | C1 entrada; C2 `SectionHeader`; C3 `Card` tinted; C4 `IconTile`; C6 chip; C7 variante de PetSwitcher; tarjeta «Próxima dosis», filas de vacuna, tarjeta de peso | 10-12 | `#168 R2`, `#168 R3`, `#115 R6`, `#62 R5`; R5 de mobile-health por revisar |
| **F2 Nutrición** | hero (radio, labio, tamaños), filas con separador (C5), «Marcar servido» (C11), tarjeta IA, enlaces, entrada | 8-10 | `#168 R8`, `#98 R4`, `#107 R5` / `#109 R1` / `#122 R1-R2`, `#166 R2`, `#62 R14`; `#120 R1` según D6; `#61 R3` según D7 |
| **F3 Perfil** | tarjeta con cámara superpuesta (C9), chips con sexo localizado (P8), información sin etiquetas, rejilla de accesos (C8), cuenta con `Switch` (C10), entrada | 9-11 | `#168 R4`, `#168 R5`, `#168 R6`, `#61 R9`, `#61 R10`, R2 y R4 de mobile-pets-profile, `#65 R14`, «profile usa cuatro ChevronRight», `#62 R14`, `#166 R2` |
| E1 (opcional, aparte) | `food.tsx` a `src/screens/food/` con ruta delgada | 2-3 | los 8 globales de §4.4 + traslado de `food.test.tsx` |

Total sin F0 ni E1: **27-33 R-ids**. En una sola spec superaría con mucho el tamaño de las features recientes, y cada ronda de rechazo volvería a abrir las tres pantallas.

**Riesgo de corte entre F1 y F2.** `#62 R5` fija un tratamiento **único** para los títulos de card de Salud **y** de Nutrición (hay it en los dos tests). Si `SectionHeader` entra solo en Salud (F1), el candado queda incoherente hasta F2. Hay dos salidas:
- F1 cambia también el encabezado «Comidas hoy» de Nutrición, que es un cambio pequeño.
- La enmienda de `#62 R5` admite durante una feature dos tratamientos, con una casilla que F2 cierra.

### 7.3 Orden y dependencias

1. **#168 mergea primero.** Los candados `#168 R*` y la base medida aquí (HEAD `64187ab8` de wt-168) dependen de ello. La enmienda #168 de `docs/ui-guidelines.md` sigue sin firmar (`- [ ] Enmienda #168 aprobada por humano`); cualquier enmienda de carta de F0 va detrás de ella.
2. **F0**, si D1 o D2 la piden, con la enmienda de carta firmada antes del handoff.
3. **F1 Salud, después de #169.** #169 (pending) es dueña de `WeightChart`, de su animación de trazo y de los chips de delta de weight-log. Si F1 corre antes, la tarjeta de peso se rediseña dos veces y el chip de delta se duplica (C6).
4. **F2 Nutrición.** Antes hay que resolver #119 (pending: hero en food, en conflicto con N1), que toca la misma tarjeta. Si se hace E1, va antes de F2.
5. **F3 Perfil.** Puede ir en paralelo a F2 en otro worktree, pero las dos tocan los mismos recuentos globales (`#62 R14` y `#166 R2` en `consistency-classnames.test.ts`). La que mergee segunda tendrá conflicto en esas filas; el reparto de ficheros no lo evita.
6. #171 (pending: confeti, float en empty-state) apenas solapa: #173 no toca los estados vacíos de `#155`. Lo de #172 (pending, pantallas de cuenta) no se midió *.

### 7.4 Decisiones abiertas

| # | Decisión | Opciones | Dónde se cita |
|---|---|---|---|
| D1 | Peso 800 | (a) añadir `Inter-ExtraBold.ttf` y `--font-extrabold` (F0); (b) mapear 800 a `font-bold` (700); (c) mapearlo a `font-black` (900) | §1, §2.4, T1 |
| D2 | Escala de radios | (A) mapear 28 y 24 a `rounded-card` (20), y 18, 16 y 14 a 20 o a 12, sin enmienda; (B) tokens nuevos (28 hero, 16-18 tile) con enmienda de la carta §12 y de sus guards | §2.4, T2, `#113 R5` |
| D3 | PetSwitcher en Perfil | El canvas no lo dibuja. (a) Quitarlo de Perfil (¿cómo se cambia entonces de mascota allí?); (b) conservarlo con la variante nueva | §2.3, C7, R2 de mobile-pets-profile |
| D4 | Color estable por mascota en los avatares | (a) por índice en la lista (cambia si se borra una mascota); (b) por hash del `id` (estable). Siempre a través de `CATEGORY_SLOTS` | §2.4, §6, C7 |
| D5 | Color del chip de delta de peso | (a) `rose` fijo, como el canvas; (b) según el signo; (c) según el signo y `NutritionPlan.objective` (subir no siempre es malo). Coordinar con los chips de #169 | §2.1, C6 |
| D6 | «Marcar servido» | (a) cápsula, como el canvas, con enmienda de `#120 R1`; (b) primario `rounded-xl` con labio, según la carta | §2.2, C11, §4.4 |
| D7 | Opacidad del texto en el hero de Nutrición | (a) conservar `#61 R3` (sin opacidad, por legibilidad); (b) la opacidad del canvas, con enmienda de `#61 R3` | §2.2, §4.4 |
| D8 | Sombras de tarjeta | (a) quitar `shadow-sm` en `Card` (afecta a 19 consumidores); (b) solo en las variantes nuevas de las tres pestañas; (c) conservarlas | §2.4, T3 |
| D9 | Glass de la tab bar a .86 | Fuera de #173. ¿Feature aparte o se descarta? | §2.4, T6 |
| D10 | Periodo del delta de peso | (a) por entrada (`WeightEntry.variation`); (b) mensual, derivado en el cliente | §6 |
| D11 | Migración de `food.tsx` | (a) no se hace; (b) feature propia antes de F2; (c) dentro de F2 (no recomendado) | §3 E1, §7.1 |
| D12 | Cerrar sesión | Conservarlo donde está (recomendado) o reubicarlo | §2.3, §5 P10 |
| D13 | Partición | Una sola spec, o F1/F2/F3 (+F0) | §7.2 |
| D14 | Tema de referencia en el smoke | El artboard de Perfil viene en oscuro por defecto. ¿El smoke en dev build de Android valida las tres pestañas en los dos temas? | §2.3 |
| D15 | #119 frente a F2 | ¿Se cierra #119 como absorbida por F2, o se resuelve antes? | §7.3 |

Más el copy de §5: P1-P7, P9, P11, P13 y P14 necesitan respuesta del humano antes de la spec; P8 es una confirmación; P10 y P12 traen recomendación.

<!-- S8 -->
## 8. Decisiones del humano (2026-10-13)

Tomadas en dos cuestionarios de opción cerrada en la sesión del leader. Se copia literal la opción elegida.

| # | Decisión | Opción elegida (literal) | Consecuencia |
|---|---|---|---|
| D13 | Partición | «3 features, Perfil primero» | #173 pasa a ser **Perfil**. Nutrición y Salud se registran como features propias cuando les toque: Nutrición tras el merge de #168 y Salud tras #169. |
| D1 | Peso 800 | «Añadir Inter-ExtraBold» | `Inter-ExtraBold.ttf` en `assets/fonts/`, registro en `useFonts` de `src/app/_layout.tsx` y `--font-extrabold` en `@theme`. Entra en #173 porque Perfil va primero. |
| D2 | Escala de radios | «Tokens nuevos + enmienda» | Opción B: `--radius-hero` (28) y `--radius-tile` (16-18; el valor lo fija la spec), con enmienda de la carta §12 y del guard `#62 R4`, y su casilla de firma. Entra en #173. |
| D8 | Sombras de tarjeta | «Sin sombra solo aquí» | Variante nueva de `Card` sin sombra (y sin borde donde el canvas no lo dibuja). Los 19 consumidores actuales no cambian. |
| D3 | PetSwitcher en Perfil | «Conservarlo, con avatares» | Variante con avatares de 40 pt, color por mascota y anillo doble en la seleccionada. Inicio, Recordatorios y Collar conservan el aspecto por defecto. D4 (color por índice o por hash del `id`) queda como pregunta de la spec. |
| C10, P13, P14 | Tema e idioma | «Filas del canvas» | Fila «Tema oscuro» con `Switch` de heroui-native y etiqueta fija; fila «Idioma» con el **idioma actual** como valor; al tocar la fila se cambia. |
| P9 | Etiquetas «Información» y «Cuenta» | «Quitarlas» | Se enmienda `#61 R9`. |
| P6 | Fila del collar | «Estado» | «Vinculado» / sin collar, en lugar del modelo. El texto exacto es copy nuevo y se aprueba en la spec. |

Siguen abiertas para la spec de Perfil, cada una con su recomendación: D4, D12/P10 (cerrar sesión; recomendado conservarlo), D14 (temas del smoke), P5 («Collar GPS» o «Dispositivo GPS» en el tile), P7 (última señal relativa), P8 (confirmar `addPet.male` / `addPet.female`).
