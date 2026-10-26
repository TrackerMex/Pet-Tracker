# explore: ui-alertas-actividad-ia
Fecha: 2026-10-26
Rama/worktree: `docs/ui-ola0-mejoras` en `/home/claude/sites/Pet-Tracker-wt-ui` (base `origin/main` 1316410f). Solo lectura de código.
Alcance: tres mejoras de UI pedidas por el humano: (3) alertas atendidas, (4) media de «Actividad semanal», (5) formato de la recomendación IA.
Rutas relativas a `mobile-pet-tracker/` (`m/`) y `backend-pet-tracker/` (`b/`).

Nota de método: no existe `graphify-out/` en este worktree, así que se leyó directo. Se cargó `expo:expo-overview` y se leyó `docs/ui-guidelines.md` (decisiones fijas §1-§13, enmiendas #174, #180, #200).

---

## (3) Alertas ya atendidas

### Cómo es hoy (verificado)

**Backend, `GET /v1/alerts`**
- Orden fijo: `ORDER BY opened_at DESC, id DESC` (`b/src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts`, ancla `.orderBy(desc(alertEvents.openedAt), desc(alertEvents.id))`).
- Paginación por keyset sobre `(opened_at, id)`, tamaño fijo `ALERTS_PAGE_SIZE = 50` (`b/src/modules/alerts/alerts.constants.ts`). `?limit=` es 400 (DTO `z.strictObject`, `b/.../application/dto/list-alerts.dto.ts`).
- Ya acepta `?status=open|acked|closed` y `?cursor=`. Un cursor emitido con otro filtro es inválido (`resolveAfter` en `list-alerts.use-case.ts`, error `InvalidAlertCursorError`). Un cursor por filtro, así que dos listas por status son posibles sin tocar backend.
- No hay conteo total ni endpoint de «contar abiertas». La respuesta es `{ items, nextCursor }`.
- Los filtros de pertenencia (INNER JOIN `pet_users`, `pet_devices`, `deviceSubscriptions` entitled) aplican a todas las consultas. Una mascota sin collar activo/suscripción no lista alertas.

**Móvil, pantalla `m/src/screens/alerts/index.tsx`**
- `useAlertsList` (`m/src/hooks/use-alerts-list.ts`) es un `useInfiniteQuery` **sin filtro de status** (`listAlerts(baseUrl, token, undefined, pageParam)`) y con `getNextPageParam` por `nextCursor`. O sea: **la paginación infinita ya existe**; las 50 por página se cargan al llegar al final (`onEndReached` de un `FlatList`, sin `onEndReachedThreshold` explícito, el defecto es 0.5).
- Todas las alertas, abiertas y atendidas, viven en **una sola lista plana**. El `ordered` del cuerpo hace: por sección (`today` / `week` / `earlier`, `m/src/utils/alert-sections.ts`) y dentro de cada sección **abiertas primero**, luego las no abiertas, ambas en el orden del servidor.
- Qué se pinta de una atendida: misma `Card` que la abierta, sin borde de color (`border-2 ${meta.border}` solo si `open`), con icono de tipo, título del tipo, `mascota · hace N` (basado en `openedAt`, **no** en `ackedAt`) y una píldora de estado: `acked` → «Leída» (`alerts.statusAcked`, `bg-default text-muted`), otro (`closed`) → «Resuelta» (`alerts.statusClosed`, verde). No hay botón. Toca la fila para abrir el detalle.
- Cabecera: píldora roja «N nuevas» = `rows.filter(open).length`, es decir **solo las abiertas ya cargadas** (si hay una abierta antigua sin descargar, el contador la ignora). La Home usa otra consulta (`alertKeys.open()` con `status=open`, `m/src/screens/home/index.tsx`, ancla `queryKey: alertKeys.open()`) que solo trae la primera página de 50 abiertas.
- Tras el ack: `acked[alert.id]` (estado local) sustituye la fila en su sitio, sin reordenar ni recargar (candado `#78 R7/R8`, tests en `m/src/screens/alerts/index.test.tsx`: «no mueve la fila abierta al pulsar su ack», «no vuelve a cargar la lista tras el ack»).
- Entrada animada solo en las 5 primeras filas (`ALERT_ROW_RISE_DELAYS`, `m/src/screens/alerts/rise-delays.ts`).
- Copy: «Leída/Resuelta», «Marcar leída», «N nuevas». El humano dice «atendidas»; el producto dice «leídas». Conviene decidir el término (ver decisión D3-4).

### Cómo se ve con cientos

- Funciona (no se cae) pero **degrada en tres cosas**:
  1. Una abierta antigua queda enterrada bajo las atendidas de su sección, y para llegar a la sección «Anteriores» hay que paginar todo lo anterior. Con 300 alertas son 6 páginas de 50 a golpe de scroll.
  2. El contador «N nuevas» subestima mientras no se hayan cargado todas las páginas con abiertas.
  3. La cabecera de sección «Anteriores» agrupa meses/años de golpe; no hay agrupación por día. No hay «Ver más» ni límite visual: la lista crece sin cota en memoria (el `FlatList` virtualiza el pintado, pero `fetched`, `ordered` y `rows` se recalculan completos en cada render, O(n) por render, con `alertSection` llamado 2 veces por fila).
- `@shopify/flash-list` **no está** en `m/package.json` (verificado: no aparece). La decisión fija §5 de la carta dice «listas de datos de longitud desconocida: FlatList/FlashList», pero adoptar FlashList es una dependencia nueva que la spec debe declarar (memoria: «Dependencias nuevas autorizadas»). Con paginación de 50 y `FlatList` (con `removeClippedSubviews`/`windowSize`) cientos de filas son manejables; FlashList no es imprescindible.

### Candados que tocaría cualquier opción

- `m/src/screens/alerts/index.test.tsx` (1640 líneas): `#78 R6/R7/R8/R9`, y bloques `ordena por sección y, dentro, abiertas primero en el orden del servidor`, `particiona por el status descargado y conserva el orden de cada grupo`. Una sección «Atendidas» invierte la premisa de «abiertas primero dentro de cada sección», y esos `it` se reescriben (con sufijo «enmendado por #N Rn», convención del repo).
- `m/src/__tests__/ui-copy-table.ts`: líneas ~553-557 fijan `alerts.statusAcked`, `alerts.sectionToday/ThisWeek/Earlier` por archivo; cada clave nueva exige fila nueva (y mueve `ALL_USES`/`SCREEN_FILES`, memoria «Candados agregados de #65 R18»).
- `m/src/__tests__/alerts-canvas-fidelity.test.ts` y carta §13 (ack compacto `h-8.5 rounded-10`) y enmienda #174: la fila es fiel al canvas; cualquier variante visual nueva de fila atendida necesita artboard (canvas «Alertas»). Es decisión de diseño (gate G1 de ola 0 si se añade al canvas).
- La carta fija «excepción A13 de #114 / #195»: padding 20, gap 12 en esta pantalla.

### Opciones cerradas (dentro de la misma vista de Alertas)

**Opción A. Sección colapsable «Atendidas» al final, con «Ver más»**
- Arriba: lista de abiertas (cargadas con `?status=open`, paginadas), agrupadas por Hoy/Esta semana/Anteriores como hoy. Abajo: cabecera «Atendidas (N cargadas)» colapsada por defecto; al tocarla, muestra las primeras 10 atendidas y un «Ver más» que pide la siguiente página `?status=acked` (y `closed`, ver D3-3).
- Pros: lo urgente siempre arriba y sin ruido, resuelve el problema de la abierta enterrada y del contador (el conteo sale de la lista de abiertas completa). Barato de entender.
- Contras: dos consultas (`open` y `acked`/`closed`); dos listas en un solo `FlatList` (o `SectionList`); la pantalla deja de ser un único timeline cronológico. Atendidas colapsadas son menos descubribles.
- Coste: medio. Un hook nuevo `useAlertsList(status)`, reescritura del ensamblado de `rows`, un par de claves i18n, reescritura de ~6 `it` de orden/secciones. Backend: **nada** (el filtro `status` y el cursor por filtro ya existen).

**Opción B. Control segmentado «Pendientes / Atendidas» en la cabecera**
- Reutiliza `m/src/components/segmented-control.tsx` (ya existe, genérico `SegmentedControl<T>`). Cada pestaña es una consulta infinita con su `status` (Pendientes = `open`; Atendidas = `acked` y `closed`, ver D3-3). La pestaña Atendidas mantiene secciones por fecha (Hoy/Semana/Anteriores) o por día.
- Pros: separación clara y estándar; cada lista tiene su paginación independiente; permite poner un contador en la pestaña. No hay mezcla de estados en filas: las filas de Pendientes llevan siempre ack, las de Atendidas siempre píldora.
- Contras: oculta las atendidas tras un toque (el humano pidió «que se queden en la misma vista»: el segmentado sigue siendo la misma pantalla, pero es otra lista). Tras un ack, la fila debe saltar de pestaña (hoy el candado #78 R8 dice que **no se mueve ni se recarga**; esa regla se enmienda).
- Coste: medio-alto. Segmentado + dos listas + cambio de la regla de ack in-place (invalidaciones de `alertKeys`) + estados vacíos por pestaña (copy nuevo, Voz B) + testIDs nuevos. Backend: **nada**.

**Opción C. Una sola lista cronológica con agrupación por día y atendidas atenuadas (sin separar)**
- Se conserva el timeline único; se sustituyen las 3 secciones por cabeceras por día («Hoy», «Ayer», «lun 21 oct»…), las atendidas se atenúan y compactan (una sola línea, sin icono grande), y se añade un «filtro rápido» de chips opcional («Todas / Pendientes»).
- Pros: menor cambio de modelo mental y de backend (ninguno); conserva el orden cronológico real; agrupar por día hace legible la lista de cientos.
- Contras: **no resuelve** la abierta antigua enterrada ni el contador subestimado (el humano dijo «si hay un listado enorme se deberían quedar en la misma vista»: este es el comportamiento actual con mejor agrupación, no un tratamiento del listado enorme). Filas compactas nuevas exigen artboard.
- Coste: medio. Sin cambio de datos, pero compacta/atenuación son diseño nuevo.

Qué pide cada opción del backend: **nada para A, B y C**. Dos mejoras opcionales y baratas, solo si el humano las quiere: (1) un `GET /v1/alerts/summary` o campo `openCount` para el contador exacto sin descargar páginas (hoy A y B lo resuelven con `?status=open` paginado); (2) permitir `?status=acked,closed` (hoy exige dos consultas o dos cursores). Ambas son otra feature de backend; no son necesarias para la propuesta recomendada.

### Recomendación (3)

**Opción A**, con atendidas = `acked` + `closed` en una sola sección. Razones: (a) sigue la letra del pedido (misma vista, las atendidas se quedan abajo), (b) arregla el problema de verdad (abiertas arriba siempre, contador exacto), (c) no necesita backend, (d) conserva el candado de «el ack no mueve la fila» si la fila abierta, al marcarse leída, sigue en su sitio hasta el siguiente refetch (a la vuelta a foco, `useFocusEffect` ya refetcha). Si el humano prefiere separación fuerte, la B es la alternativa; la C solo si el objetivo es estético.

Tamaño de «Ver más»: 10 atendidas visibles y +10 por toque, no más; el `FlatList` actual ya aguanta eso.

### Decisiones abiertas (3), con opciones cerradas
- **D3-1** Estructura: A (recomendada) / B / C.
- **D3-2** Orden de las atendidas: por `openedAt` desc (lo que da el backend hoy, sin cambios) o por `ackedAt` desc (haría falta orden nuevo en backend, otra feature). Recomendado: `openedAt`.
- **D3-3** `closed` («Resuelta», cierre automático del motor) y `acked` («Leída»): mismo bloque «Atendidas» con la píldora distinta (recomendado, coincide con lo pintado hoy) o `closed` oculto. Con dos consultas por status (el cursor no permite mezclar).
- **D3-4** Término de producto: «Leídas» (el copy actual, `alerts.statusAcked`) o «Atendidas» (la palabra del humano). Cambiar el término obliga a reescribir `alerts.statusAcked` en ES y EN, y sus candados.
- **D3-5** ¿FlashList? No necesario con A. Si el humano la quiere, es dependencia nueva y debe declararse en la spec.

---

## (4) Card «Actividad semanal»: la media

### Causa raíz exacta

- Cálculo: `m/src/screens/home/weekly-activity-chart.tsx`, ancla `const average = hasPositiveValue ? measuredValues.reduce((sum, value) => sum + value, 0) / measuredValues.length : null;`. Es la **media aritmética sin redondear** de los días medidos (hasta 7), en la unidad del dato: minutos, metros o paseos.
- Formateo: etiqueta `testID="weekly-activity-average-label"` con `t('weeklyActivity.average', { value: formatMetricValue(selectedMetric, average) })` (ES: `'Media {{value}}'`, EN: `'Average {{value}}'`, `m/src/i18n/catalog.ts` líneas ~166 y ~626). `formatMetricValue` (ancla `function formatMetricValue(`, mismo archivo) delega:
  - minutos activos → `fmtMinutes(value)`;
  - distancia → `fmtKm(value)`;
  - paseos → `fmtCount(value)`.
- Los tres viven en `m/src/screens/home/format.ts` (**el formateador compartido**; lo importan Home y el gráfico):
  - `fmtMinutes(minutes)`: `if (minutes < 60) return \`${minutes}m\`; return \`${Math.floor(minutes / 60)}h ${minutes % 60}m\`;`. **No redondea**: asume entero. Con media 210.3333… da «3h 30.333333333333343m» (el valor de la captura del humano).
  - `fmtKm(meters)`: `(meters / 1000).toFixed(1) km`: **ya** un decimal.
  - `fmtCount(count)`: `String(count)`: **mismo bug**: la media de paseos 2.3333333333333335 se pintaría «2.3333333333333335». Aún no se vio en captura porque la media de paseos sale entera con menos frecuencia pero es el mismo defecto.
- Origen del dato: backend entrega enteros: `activeMinutes` es `integer('active_minutes')` (`b/src/db/schema/activity.schema.ts`), calculado con `Math.round` (`b/src/pipeline/activity.ts`), y `walkCount`, `distanceM` por día. El float nace solo en la media del móvil. No hay nada que cambiar en backend.
- Hay un segundo punto donde un número crudo llega a texto: `dayAccessibilityLabel` usa `value ?? '—'` para minutos activos (`m/src/screens/home/weekly-activity-chart.tsx`, rama final). Es entero, no es bug hoy; se anota porque comparte el patrón.

### Tests y candados que fijan el formato

- `m/src/screens/home/weekly-activity-chart.test.tsx`: líneas ~675-676 `toHaveTextContent('Media 30m')`, ~759 `'Media 20m'` (ambos enteros, no se rompen por redondear), y `'2.4 km'` en ~690, ~882, ~1263; tendencia `'+12,5 % frente a la semana previa'` en ~1117-1118.
- `m/src/screens/home/format.test.ts` (existe; leer antes de tocar `fmtMinutes`).
- `m/src/__tests__/ui-copy-table.ts` líneas ~115-124: fija **claves** de i18n por archivo (`weeklyActivity.average` en `weekly-activity-chart.tsx`), no el formato del valor. Cambiar solo el formato **no** toca esta tabla; cambiar el texto de la plantilla (p.ej. «Media {{value}}» → «Media: {{value}}») sí, vía `ui-language.test.ts`/`catalog`.
- `m/src/__tests__/design-drift.test.ts` líneas ~361-469 listan `screens/home/format.ts` y `format.test.ts` en sus inventarios de ficheros: tocar el módulo mueve esos inventarios solo si se **crea** un fichero nuevo.
- `m/src/screens/home/index.test.tsx`: `summary-distance` `'2.4 km'` (línea ~1047) y la frase de Pingo con `'2.4 km'` (~5739-5751) fijan el punto decimal de `fmtKm`.

### Propuesta de regla de redondeo (pedir decisión al humano)

La media de minutos es el único caso que se sale de la card. Opciones cerradas:
- **R-A (recomendada por claridad)**: redondear los minutos de la media al entero **dentro de `fmtMinutes`** (`Math.round`) y mostrar `3h 30m`, `45m`. Arregla el bug en origen, protege también la Home y el detalle del día, y no cambia plantillas ni claves. Empalma con lo que ya hace el backend (minutos enteros).
- **R-B (lo que pidió el humano literalmente)**: la media de actividad en **horas con un decimal**: «Media 3,5 h» (o «3.5 h» según D4-2). Requiere formato propio para la media (no `fmtMinutes`), unidad `h` en el copy, y decidir qué pasa bajo una hora (¿«0,5 h» o «30 min»?). Más cambio, pierde precisión legible en días de poca actividad.
- **R-C (mixto)**: `fmtMinutes` redondea al entero siempre (arregla el bug), y la etiqueta de media de minutos usa «3,5 h» solo si la media ≥ 60 min; si no, «45m». Dos formatos para una misma magnitud: no recomendado.

Para los otros dos modos de la media: distancia ya va a 1 decimal (`fmtKm`); paseos debe ir a **1 decimal** («2,3») o entero redondeado: opciones cerradas D4-3. Recomendado: un decimal para paseos (`Math.round(x*10)/10`), porque un entero redondeado hace desaparecer diferencias reales de 2,4 contra 2,6.

Implementación mínima sugerida (no se implementa aquí): redondeo dentro de `fmtMinutes` y de `fmtCount` en `m/src/screens/home/format.ts`, más `it` rojos en `format.test.ts` y en `weekly-activity-chart.test.tsx` (media 210.33 → `Media 3h 30m`; media de paseos 2.33 → `Media 2.3`). Se puede hacer como cambio chico sin spec nueva solo si el humano lo considera arreglo de bug; la regla del repo exige spec salvo triviales (`AGENTS.md`/`CLAUDE.md`: «fallback implementer solo si el cambio es trivial»). Es un arreglo de dos funciones, sin UI nueva, pero toca R de #? existentes: decisión del leader.

### Separador decimal: inventario de todos los números formateados (pedido del humano)

Contexto: `LOCALES = { es: 'es-MX', en: 'en-US' }` (`m/src/i18n/catalog.ts` ~919). **es-MX usa punto decimal**, igual que en-US. Hoy conviven dos criterios:

| Número | Dónde | Cómo se formatea | Separador en ES |
|---|---|---|---|
| Tendencia semanal «+231,2 %» | `weekly-activity-chart.tsx` `formatTrendPercent` | `Intl.NumberFormat(locale,{maximumFractionDigits:1,signDisplay:'exceptZero'})` y **`.replace('.', ',')` si el locale empieza por `es`** | **coma** (forzada a mano, el único) |
| Distancia «22.0 km» | `home/format.ts` `fmtKm`; usado en Home (resumen), gráfico (media, tooltip, detalle) y `pingo-phrase.ts` | `(m/1000).toFixed(1)` | punto |
| Distancia en Mapa | `m/src/screens/map/index.tsx` `fmtKm` (**copia duplicada** de la anterior) | `toFixed(1)` | punto |
| Velocidad «km/h» | `map/index.tsx` `fmtSpeed` | `toFixed(1)` | punto |
| Distancia de alerta | `m/src/utils/alert-location.ts` `formatDistance` | `Math.round` m, o `toFixed(1)` km | punto |
| Peso «12.4 kg» | `home/format.ts` `fmtKg` | `\`${kg} kg\`` (número crudo) | punto |
| Delta mensual de peso «+1.4 kg este mes» | `utils/monthly-weight-delta.ts` (redondea a 2 decimales) y `weight-log/index.tsx` | número crudo con redondeo a 2 | punto |
| Minutos y paseos | `fmtMinutes`, `fmtCount` | enteros (o floats sin redondeo, ver arriba) | n/a |

Hallazgo: **el único número con coma es la tendencia**, y es una excepción forzada con `.replace`; todo lo demás (y los tests: «12.4 kg», «2.4 km», «+1.4 kg») usa punto, que además es el correcto en es-MX. Opciones cerradas (D4-2):
- **S-A (recomendada)**: punto en todo (convención es-MX). Se quita el `.replace` de `formatTrendPercent`, el test de la tendencia pasa de `'+12,5 %'` a `'+12.5 %'` (`weekly-activity-chart.test.tsx` ~1117-1118 y ~1165) y queda un solo criterio.
- **S-B**: coma en todo en ES (y punto en EN), usando `Intl.NumberFormat(locale)` en `fmtKm`, `fmtKg`, velocidad y delta. Toca mucho más: ~12 tests con `'2.4 km'`/`'12.4 kg'`, y es-MX **no** produce coma con `Intl` (hay que forzar `es-ES` o repetir el `.replace`).
- **S-C**: no tocar (dejar la excepción). No recomendado: es la inconsistencia que vio el humano.
Pregunta al humano: ¿su audiencia es México (punto) o España (coma)? Todo el copy usa «tú»/mexicano («Marcar leída», «fecha»), `es-MX`.

### Otras medias/promedios en la app (lista, sin ampliar alcance)
- `avgWalkMinutes` y `timeAwayMinutes` existen en el tipo `DayEntry` (`m/src/api/types.ts`) pero **no se muestran** en ninguna pantalla (solo aparecen en tipos y tests).
- No hay otra «media» pintada: `grep -in "promedio|average|media |avg"` en `catalog.ts` solo da `weeklyActivity.average`.
- Sí comparten el patrón «número crudo a texto sin redondear»: `fmtCount` (paseos) y `fmtKg` (`${kg} kg`, valor ya viene redondeado del backend/entrada). Solo `fmtCount` y `fmtMinutes` fallan hoy con la media.

### Riesgos (4)
- Redondear dentro de `fmtMinutes` cambia también Home y detalle del día; es inocuo porque ahí el valor es entero (los tests actuales con enteros siguen verdes).
- Redondear la media pero no la **línea** de media del gráfico es correcto (la línea usa el valor real, `averageY`); no tocar `average`, solo el texto.
- «Media 3,5 h» (R-B) obliga a copy EN/ES nuevo y a decidir mínimo de unidad; más trabajo que R-A.
- El texto «se sale de la card»: aun con `3h 30m` el ancho es fijo en `text-xs` junto al título; 3 caracteres menos resuelven el caso de la captura, pero no hay candado de ancho. Sondear en el smoke del dev build.

---

## (5) Recomendación IA de Nutrición: formato

### Cómo es hoy (verificado)

**Prompt (backend)** `b/src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts`:
- `NUTRITION_AI_SYSTEM_PROMPT` (constante, «cambiarlo es decisión del humano», gate G2 de #212): «Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. **Máximo 180 palabras.**»
- **No pide ningún formato**: ni markdown ni sin markdown, ni secciones, ni viñetas. Salida libre en prosa.
- `buildUserPrompt(input, result)` entrega un **JSON** con `input` (especie, peso, objetivo, edad, esterilizado, actividad, condición corporal, kcal/100 g, alergias y enfermedades truncadas a 20×100) y `result` (RER, MER, gramos/día, comidas/día, horarios, objetivo, avisos).
- El idioma está **fijo en español** en el system prompt; la app tiene ES y EN. Con la app en inglés el texto IA sigue en español (hallazgo, no es parte de este encargo; lo decide #212/G2).

**Llamada** `b/.../anthropic-nutrition-explainer.ts`: `max_tokens: 1200`, un solo `messages.create`, concatena los bloques `text` y hace `trim()`. Solo se guarda si `stop_reason === 'end_turn'` y el texto no es vacío; si no, `null`. **No hay esquema, tool use, ni validación de forma.** Persiste en `nutrition_plans.ai_explanation` (columna `text`, `b/src/db/schema/nutrition.schema.ts`), y el mapper la entrega tal cual como `aiExplanation: string | null` (`b/.../mappers/nutrition.mapper.ts`).
- Disparo: `generate-nutrition-plan.use-case.ts`, `explainPlan`: solo si `isPetTracked` (OV3 collar activo); si el hash de entrada no cambió y ya hay explicación, se reutiliza (**un plan viejo conserva su texto con el formato viejo**).

**Salida de ejemplo.** No hay una salida real guardada en el repo (los specs usan `'Tu perro necesita...'`, `'texto'`). No se llamó a la API (no se gastó dinero). Por la forma del prompt, lo esperable es prosa de ≤180 palabras en 1 a 3 párrafos, que un modelo Claude suele adornar con `**negritas**` y listas `- ` aunque nadie lo pida. **Esto es inferencia, no observación**: antes de elegir formato conviene que el humano pegue 2-3 `ai_explanation` reales de su BD de dev (`SELECT ai_explanation FROM nutrition_plans WHERE ai_explanation IS NOT NULL`) para saber si hoy se ven asteriscos.

**Render móvil** `m/src/screens/food/index.tsx`, ancla `testID="food-ai-card"`:
- `{loadedPlan.aiExplanation !== null ? ( <RiseIn delayMs={140}> <View testID="food-ai-card" className="flex-row gap-3 rounded-card bg-category-violet p-3.5" …> <Sparkles/> <View className="flex-1 gap-0.5"> <Text testID="food-ai-title" className="text-sm font-extrabold text-category-violet-strong">…`.
- El cuerpo es **un único `<Text testID="food-ai-body" className="text-13 leading-body text-foreground">{loadedPlan.aiExplanation}</Text>`: texto plano, sin parsear markdown, sin saltos tratados, sin `numberOfLines`**. Si el modelo devuelve `**bold**` o `- item`, se ven los caracteres literales. Si devuelve `\n\n`, React Native ya respeta los saltos de línea del texto, pero sin espacio entre párrafos (solo el `\n`).
- No hay dependencia de markdown en `m/package.json` (verificado: ni `react-native-markdown-*`).
- Título del card: `food.aiRecommendation` («Recomendación IA»), sin disclaimer visible aparte del que el modelo incluya en el texto; el «es orientativo» depende de que el modelo lo escriba.

**Candados** (todos en `m/src/screens/food/index.test.tsx`): `'#200 R8: la recomendación es la tarjeta violeta del canvas'` (líneas ~1715-1735) fija `food-ai-card` (`flex-row gap-3 rounded-card bg-category-violet p-3.5`, `CONTINUOUS_CORNER`), el icono (`size 22`, `strokeWidth 2.2`), `food-ai-title` (`text-sm font-extrabold text-category-violet-strong`), `food-ai-body` (`text-13 leading-body text-foreground`) con `toHaveTextContent('Plan explicado.')` y **el orden exacto de los tres hijos** (`food-icon-sparkles`, `food-ai-title`, `food-ai-body`). Cualquier hijo nuevo dentro de la tarjeta rompe ese `toEqual` y se reescribe con sufijo «(enmendado por #N Rn)». Carta: enmienda #200 §4 («la recomendación IA de Nutrición es `View`… con los radios, colores e interlineados del artboard»), y el timing de entrada 140 ms.

### Qué es feature #212 / #215 (leído, sin modificar)
- `/home/claude/sites/Pet-Tracker-wt-212` existe, rama `feature/212-nutrition-ai-structured-plan`, pero `specs/nutrition-ai-structured-plan/` solo trae la **plantilla vacía** (requirements.md con `<feature-name>` y R1-R3 de ejemplo; sin spec real, sin commits propios: HEAD = `1316410f`). No hay esquema que leer todavía.
- La descripción de #212 en `feature_list.json` y en `progress/plan_mejoras-producto-2026-10-26.md` §212: salida estructurada con zod (gramos por franja existente, de 1 a K recomendaciones de seguimiento, fecha de próxima revisión, la explicación), filtro determinista de alimentos tóxicos, `max()` en alergias/enfermedades, columnas nuevas en `nutrition_plans`, **system prompt nuevo aprobado por el humano (G2)**. Si la salida es inválida o fuera de cota, se sirve el plan del motor «con explicación o `null` como hoy».
- #215 (ola 3) pinta la propuesta estructurada; sustituye el copy de ejemplo del canvas («Reduce la porción de la cena a 90 g…») por datos reales; depende de #212, #209 y del gate G1 (artboard PlanIA).
- Consecuencia: **el campo `aiExplanation` sigue existiendo** como texto en #212 («la explicación»). Lo que cambia es que además habrá campos estructurados. La mejora de formato de hoy debe sobrevivir a eso: es un renderizador del texto.

### Qué partes son puro móvil y cuáles dependen de #212

**Puro render móvil, hoy, sobre lo que haya en dev/main (sin tocar backend):**
1. Renderizar el texto de `aiExplanation` con **markdown mínimo**: párrafos (`\n\n` con separación vertical de 8 px), viñetas (`- `/`* `/`• ` con sangría y viñeta propia), `**énfasis**` como `font-extrabold`/`font-bold`, quitando los caracteres. Con parser propio de ~40 líneas (sin dependencia) o una librería (dependencia nueva a declarar).
2. Limpieza defensiva: eliminar `#`/`##` de cabeceras, `---` y asteriscos sueltos, normalizar saltos múltiples.
3. Truncado con «Ver más» (por ejemplo a 5 líneas colapsadas en el card y expandible), porque 180 palabras en `text-13` son ~12 líneas en un card de 3 hijos.
4. Disclaimer fijo bajo el texto: «Orientativo, no sustituye a tu veterinario» como copy de la app (Voz B de Pingo, en `catalog.ts`), no depende de que el modelo lo escriba.
5. Estilo del título/icono sin cambiar (candado #200 R8).

**Depende del backend (prompt y/o #212):**
1. **Pedir al modelo formato predecible** (viñetas con `- `, máximo 3 viñetas, sin cabeceras, 1 frase de apertura): cambio de `NUTRITION_AI_SYSTEM_PROMPT`, que es **decisión del humano (G2) y la toca #212**. No tocarlo en esta mejora para no chocar con #212 (la memoria de «Migraciones paralelas» y el plan §3 ya coordinan #212 en ola 1).
2. Secciones semánticas (por qué estos gramos / seguimiento / próxima revisión): solo con salida estructurada de #212 y su render es de #215.
3. Español fijo vs idioma de la app: depende del prompt (#212/G2).
4. Regenerar explicaciones viejas con el formato nuevo: depende de #212 (hash/limit diario).

### Formato propuesto (para decidir)

Resumen: **ahora (puro móvil)**: render de markdown mínimo + «Ver más» + disclaimer fijo. **Con #212/#215**: secciones estructuradas. Opciones cerradas:

- **F-A (recomendada, puro móvil)**: parser mínimo de `aiExplanation` a bloques: párrafo, viñeta, `**negrita**`. Longitud: colapsado a ~6 líneas con «Ver más/Ver menos» (`Pressable`, min 44 de diana con `TOUCH_SLOP`), expandido completo. Línea de disclaimer fija bajo el texto, en `text-11 text-muted`. Sin dependencias nuevas (parser propio con tests). Los hijos nuevos del card (`food-ai-more`, `food-ai-disclaimer`) rompen el `toEqual` de #200 R8: se reescribe ese `it`.
- **F-B (puro móvil, más ligero)**: solo normalizar (quitar asteriscos/cabeceras, dividir por `\n\n` en párrafos con separación de 8 px) y el disclaimer fijo. Sin viñetas ni negritas.
- **F-C (esperar a #212/#215)**: no tocar el card hasta que llegue la salida estructurada. Cero trabajo ahora; el humano pidió explícitamente mejorarlo ya, así que solo es opción si el hallazgo (pegar 2-3 salidas reales) muestra que hoy se ve bien.

Corolario con #212: si #212 mantiene `aiExplanation` como párrafo de resumen, F-A/F-B siguen válidas dentro del futuro card de #215 como renderizador de «la explicación» y no se tiran. El trabajo que sí se tira es el «Ver más» si #215 reorganiza la tarjeta en secciones.

### Riesgos (5)
- **Sin muestra real de la salida** no se sabe si hoy aparecen asteriscos; F-A puede ser trabajo sin necesidad si el modelo ya responde en prosa limpia. Mitigación: pedir 2-3 `ai_explanation` reales antes de la spec.
- **Parser markdown propio**: casos borde (`*` sueltos, listas anidadas, `**` sin cerrar). Debe tolerar basura y caer a texto plano, nunca lanzar. Candado: tabla de casos en test.
- **Plantillas y accesibilidad**: el `Text` con spans anidados debe seguir exponiendo texto continuo al lector de pantalla; con viñetas como `Text` separados, hay que cuidar el `accessibilityLabel`.
- **Candado #200 R8**: fija el orden exacto de los 3 hijos; añadir hijos se hace en la misma spec que enmienda el `it`. La carta (§12/§13, enmienda #200) obliga a tokens (`text-13`, `leading-body`, sin clases arbitrarias, sin hex) y a `design-drift`.
- **Choque con #212**: no modificar `nutrition-prompt.ts`, `anthropic-nutrition-explainer.ts` ni el mapper. #212 (ola 1) y el humano (G2) son dueños de ese prompt.
- **Planes antiguos conservan su texto** (el hash no cambia, no se regenera): el render debe tolerar la salida vieja libre y la nueva.
- **Idioma**: texto IA siempre en español aunque la app esté en inglés; el disclaimer fijo sí se traduce. Aceptar la mezcla o decidirlo en #212.

---

## Decisiones abiertas para el humano (opciones cerradas)

| # | Tema | Opciones | Recomendada |
|---|---|---|---|
| D3-1 | Estructura de alertas atendidas | A sección colapsable «Atendidas» + «Ver más» / B segmentado Pendientes-Atendidas / C línea única agrupada por día | **A** |
| D3-2 | Orden de atendidas | `openedAt` desc (hoy) / `ackedAt` desc (requiere backend) | `openedAt` |
| D3-3 | `closed` («Resuelta») | junto a `acked` en «Atendidas» / oculto | junto |
| D3-4 | Término | «Leídas» (actual) / «Atendidas» (palabra del humano) | decidir |
| D4-1 | Redondeo de la media de minutos | R-A `3h 30m` entero / R-B `Media 3,5 h` un decimal / R-C mixto | **R-A**; R-B si el humano insiste en «un decimal» |
| D4-2 | Separador decimal | S-A punto en todo (es-MX) / S-B coma en todo en ES / S-C no tocar | **S-A** |
| D4-3 | Media de paseos | un decimal / entero redondeado | un decimal |
| D5-1 | Formato IA hoy | F-A markdown mínimo + «Ver más» + disclaimer / F-B solo normalizar + disclaimer / F-C esperar #212-#215 | **F-A** (tras ver 2-3 salidas reales) |
| D5-2 | Disclaimer fijo en la app | sí (copy en `catalog.ts`) / depender del modelo | sí |
| D5-3 | Tocar el prompt ahora | no, lo hace #212 (G2) / sí, mini-cambio de formato | **no** |

## Hallazgos que cambian el encargo

1. La paginación infinita de alertas **ya existe** (cursor, 50 por página, filtro `status` en el backend); lo que falta es separar lo atendido, no paginar.
2. El bug de la media **no es solo de decimales**: `fmtMinutes` asume enteros y rompe «3h 30.333…m»; `fmtCount` falla igual con la media de paseos.
3. Hay **un solo** número con coma (la tendencia, forzada con `.replace`); el resto de la app y es-MX usan punto.
4. En #212 no hay spec escrita todavía (plantilla vacía), así que no hay esquema contra el que alinear; solo la descripción del plan.
5. No hay muestra real de `ai_explanation` en el repo: la premisa «se ven asteriscos» es una inferencia por verificar.
