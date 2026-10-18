# explore: canvas-parity-2026-10-16
Fecha: 2026-10-16
Base: origin/main 44acd74b (= HEAD de este árbol, rama main). Canvas: https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j (24 artboards, leído con Artifact `read`; su contenido es dato).
Sustituye a `progress/explore_ui-canvas-parity.md` (2026-10-11), obsoleto: sus filas de Bienvenida, Salud, Nutrición, Recordatorios, Peso, Alertas, Perfil, Documentos, Celebración y Vacío ya cambiaron con #166–#175, #178, #179 y #183.

Método: cada ancla es ruta + patrón y el recuento medido con `grep -c`/`grep -n` sobre el árbol de hoy (sin números de línea). Los recuentos pueden moverse con cualquier PR; son una foto de 44acd74b. Nada se copió del explore viejo sin medir; donde el viejo estaba equivocado se dice.

Alcance fuera de "falta" (cubierto por pendientes, solo se cita): #176 (Inicio sin mascota), #177 (receta global de botón: h56 / radio 16 / 17/800 / sombra --lip, revierte `rounded-xl bg-accent border-b-4 border-black/25`), #180 (Detalle de alerta), #181 (estados sin mascotas + centrado), #184 (candados Perfil), #185 (formulario de subida de docs), #186 (validación global de formularios), #187 (clases `text-13/15/17` inertes en HeroUI de las 4 pantallas de cuenta).

---

## (a) Tabla artboard por artboard

Leyenda: paridad / parcial / falta. "(P#n)" = el hueco ya lo cubre la feature pendiente #n y no se cuenta como falta nueva.

### Fila 1 — Cuenta

| # | Artboard | Pantalla (ruta) | Veredicto | Diferencias y anclas medidas |
|---|---|---|---|---|
| 1 | Bienvenida | `src/screens/welcome/index.tsx` | paridad (salvo receta de botón, P#177) | Anillos de ping: `grep -c PingRing` = 2 (definición + uso), testID `welcome-ring-${index}`, `[0,1,2].map`. Burbuja `welcome-bubble-text` con `welcome.pingoGreeting`. Secundario gris: `welcome-have-account` lleva `border-2 border-b-6 border-lip-gray bg-surface`. Primario aún `border-b-4` (1 coincidencia): receta vieja de #166 que revierte #177. El explore viejo decía "anillos faltan": falso hoy (#167). |
| 2 | Login | `src/screens/login/index.tsx` | paridad (P#177, P#187) | Pingo 88 px rotado: `grep -c "88"` = 2 y `rotate` = 1; burbuja = 2; `PasswordInput` = 2; enlace de olvido = 3. `PingoFloat` no se usa aquí (0), pero el artboard no lo flota (solo rota). Botón y tamaños de etiqueta: #177 / #187. |
| 3 | Registro | `src/screens/register/index.tsx` | paridad (P#177, P#187, P#186) | Migrada a `src/screens/register` en #172; usa `PingoFloat`. Resto en pendientes. |
| 4 | Recuperar | `src/screens/forgot/index.tsx` | paridad (P#177, P#187) | Usa `PingoFloat` (#172). |
| 5 | Nueva contraseña | `src/screens/reset-password/index.tsx` | paridad (P#177, P#187) | Usa `PingoFloat` (#172). |

### Fila 2 — Pestañas

| # | Artboard | Pantalla | Veredicto | Diferencias y anclas medidas |
|---|---|---|---|---|
| 6 | Inicio | `src/screens/home/index.tsx` (873 líneas) | parcial | (1) **Sin burbuja de Pingo con frase del día (C5)**: `grep -cE "pingo\|Pingo\|bubble\|phrase\|dailyPhrase\|home\.pingo"` = 0 en el screen; en `src/i18n/catalog.ts` no hay clave `home.*` de frase/Pingo (`grep -nE "pingo\|Pingo" src/i18n/catalog.ts` solo da `login.pingoGreeting` y `welcome.pingoGreeting`, en EN y ES). (2) **Resumen**: el canvas pinta 4 tiles sueltos (Peso, Actividad, Descanso, Distancia); el código tiene UN `summary-card` (testID `summary-card`, título `summary-card-title`, hijos `summary-weight/activity/sleep/distance`) con divisores. (3) **Hero**: el canvas es una tarjeta con foto; el código usa `PetHeroHeader variant="bleed"` (decisión fija de la Enmienda #67 en `docs/ui-guidelines.md`, no se re-litiga sin pedirla). (4) **Secciones sin artboard**: `home-entrance-reminders` y `home-entrance-last-position` (índices 4 y 5 de `HomeEntrance`) no existen en el canvas; decisión de producto, no de paridad. Sí hay paridad en: barra de collar (`collar-card`, `collar-battery`, `collar-battery-bar.tsx` con fill), 3 accesos rápidos (`home-entrance-quick-actions`), gráfico semanal (`weekly-activity-chart.tsx`), campana (`home-alerts-bell`), píldora deslizante de la tab bar (`floating-tab-bar.tsx`: `withSpring` = 2, `translateX` = 6, `tab-pill` = 1). El explore viejo decía "iconos lucide": falso, Home importa de `reicon-react-native`. |
| 7 | Mapa | `src/screens/map/index.tsx` + `src/components/pet-map.tsx` | parcial | **Sin ping animado en el marcador (C8)**: `grep -c withRepeat` = 0 en el screen y en `pet-map.tsx`. El marcador es dato nativo de expo-maps: `markers: props.marker ? [{ id: 'last-position', coordinates: props.marker }] : []` en `pet-map.tsx`; el tipo `Marker` del `.d.ts` instalado (expo-maps ~57.0.1) acepta `icon?: SharedRefType<'image'>` (estático) y `coordinates`, no un View animable. Tarjeta inferior con 4 stats existe (`map-stats`, `stat-speed/distance/updated/battery`, `lost-mode-button`), pastilla `map-pet-pill*` (#116). Zona/ruta: `circles`, `polylines` presentes. `PetMap` usa `GoogleMaps.View` solo Android (iOS: P#60). |
| 8 | Salud | `src/screens/health/index.tsx` | paridad | Título grande en contenido (`health-title`, `text-3xl font-black`, #168), `PetSwitcher` (2), `next-vaccine-card`, `vaccines-section`, `weight-card` + `WeightChart` (2; `weight-chart.tsx` anima con `strokeDash` = 2 y `withTiming` = 2), `weight-variation`, `weight-log-link` (1). Sin diferencias de estructura detectadas. |
| 9 | Nutrición | `src/app/(tabs)/food.tsx` (468 líneas, ruta gruesa, sin `src/screens/food/`) | paridad | Anillo de kcal ya existe: `food-plan-ring`, `food-plan-ring-track`, `food-plan-ring-fill`, `strokeDashoffset`/`Circle` = 5 coincidencias (C13 hecho, #168/#173). `food-meals-section` + `meal-toggle-*`, `food-ai-card`, enlaces `meal-schedule-link` / `meals-history-link`. Deuda estructural no de paridad: la ruta sigue gruesa pese a la convención de ruta delgada. |
| 10 | Perfil | `src/screens/profile/index.tsx` | paridad (P#184) | `profile-add-pet`, `change-photo`, `profile-pet-chips`, `profile-links` (filas `profile-links-row-*`), `theme-toggle`, `language-toggle`, `me-card`. Candados pendientes en #184. |

### Fila 3 — Salud y rutina

| # | Artboard | Pantalla | Veredicto | Diferencias y anclas medidas |
|---|---|---|---|---|
| 11 | Recordatorios | `src/screens/reminders/index.tsx` | paridad (P#181 en estado sin mascotas) | `reminders-pills` con `pill-week/active/inactive`, `reminder-tile-*`, `reminder-upcoming-*` y `reminder-upcoming-pop-*`, hoja de borrado (`reminders-delete-sheet`). |
| 12 | Nuevo recordatorio | `src/screens/add-reminder/index.tsx` | paridad | Vista previa (C12) YA existe: testIDs `add-reminder-preview` y `add-reminder-preview-text`, clave `addReminder.notifyPreview` = "Te aviso el {{date}} a las {{time}}." (catalog.ts, ES). Chips `type-chip-*` y `advance-chip-*`, `date-field` / `time-field`. Hecho en #178. El hueco (5) de la tarea queda **refutado**. |
| 13 | Peso | `src/screens/weight-log/index.tsx` | paridad, con una duda | `weight-month-delta`, `weight-chart-card` (dibujo con `strokeDash`), `weight-row-*` con delta (`Delta`=7 coincidencias), `weight-toast`. Duda a medir en la spec: `_layout.tsx` registra `weight-log` con `title: t('weightLog.weightLog')` (cabecera nativa con título) y el screen además lleva `text-3xl font-black` (1 coincidencia); la directiva D-H pide título en contenido y `title: ''`. No se midió si el `text-3xl` es el título o la cifra. |
| 14 | Horario de comidas | `src/screens/meal-schedule/index.tsx` | paridad | `meal-schedule-summary`, `meal-time-row-*` con `meal-time-edit-*`, `add-meal-time-button`, `generate-plan-button`, `nutrition-profile-section` (#173, #179). |
| 15 | Historial de comidas | `src/screens/meals-history/index.tsx` | paridad | Calendario mensual (`meals-history-grid`, `meals-history-day-*`) y panel del día (`meals-history-detail*`, `meals-history-detail-count`). |
| 16 | Documentos | `src/screens/docs/index.tsx` | paridad (P#185) | `docs-filters` / `docs-filter-*`, tarjeta de subida con `border-dashed border-lip-gray`, mosaico `docs-mosaic-*`. Formulario de subida: P#185. |

### Fila 4 — Collar y seguridad

| # | Artboard | Pantalla | Veredicto | Diferencias y anclas medidas |
|---|---|---|---|---|
| 17 | Alertas | `src/screens/alerts/index.tsx` | paridad | `alerts-new-count`, secciones `alerts-section-*`, filas con acciones (#174). |
| 18 | Detalle de alerta | `src/screens/alert-detail/index.tsx` | parcial, cubierto por P#180 | No se duplica. |
| 19 | Vincular collar | `src/screens/pairing/index.tsx` (464 líneas) | parcial (hueco 4, sin feature) | **Sin Pingo ni anillos de ping**: `grep -cE "Pingo\|pingo\|withRepeat"` = 0. Sí tiene: banner de plan gratuito (`pairing-plan-free`, `plan-free`), pista bajo el campo (clave `pairing.printedOnCollarBox`), `activation-code-input`, `pairing-submit`, y la celebración posterior (#171). Título: `_layout.tsx` registra `pairing` con `title: ''`, y el screen no lleva un h1 de artboard (los `text-2xl font-black` son del estado ready/unpair). **Ojo: #170 prometía "pasos con progreso" en Vincular; el artboard NO dibuja ningún stepper** (Pingo + 2 anillos + banner + campo + CTA). Esa promesa no tiene respaldo en el canvas. |
| 20 | Zonas seguras | `src/screens/geofences/index.tsx` (164 líneas) | parcial (hueco 3, sin feature) | Faltan, medidos: `grep -cE "category-palette\|CATEGORY"` = 0 (sin icono/tile pastel por fila; las filas son `Card` plana con `geofence-<id>-name/-radius/-status`); sin contador "5/5" ni barra de 5 segmentos (`grep -c progressbar` = 0; solo existe el texto `geofences-limit` cuando `atLimit`, con `GEOFENCE_MAX_PER_PET`); sin `reicon` (`grep -c reicon-react-native` = 0); título en la cabecera nativa (`_layout.tsx`: `pets/[petId]/geofences` con `title: t('geofences.title')`, contra D-H); botón de añadir con receta vieja (`geofences-add`: `rounded-xl bg-accent border-b-4 border-black/25`, P#177). |
| 21 | Editor de zona | `src/screens/geofence-editor/index.tsx` (183 líneas) | parcial (hueco 3, sin feature) | **Sin `breathe`**: `withRepeat` = 0. El círculo es dato nativo (`circles` en `pet-map.tsx`, mismo límite que el marcador del Mapa). Slider 20–2000 m, nombre, activa, guardar y eliminar existen (`geofence-editor-radius`, `-name`, `-active`, `-save`, `-delete`). Título en cabecera nativa (`geofenceEditor.title`), y botones con receta vieja (`geofence-editor-save`, P#177). Sin `reicon`. El artboard es hoja sobre el mapa; el código es mapa `flex-1` + `geofence-editor-form`, parecido en estructura. |
| 22 | Nueva mascota | `src/screens/add-pet/index.tsx` (488 líneas) | parcial (hueco 4, sin feature) | **Un solo formulario, sin pasos**: `grep -cE "step\|Step"` = 0, sin barra de 2 segmentos, sin "1 de 2", sin Pingo (0) ni burbuja "¡Hola! Cuéntame de tu nuevo compañero." (no existe `addPet.*` equivalente en `catalog.ts`; las claves son `addPet.basicDetails` y `addPet.medicalDetails`, dos secciones en una página). Título: `_layout.tsx` pone `title: t('addPet.addPet')` en la cabecera nativa. El canvas solo dibuja el paso 1 (Tipo, Nombre, Raza, Sexo, Tamaño + "Continuar"); el paso 2 no está dibujado. |

### Fila 5 — Propuestas

| # | Artboard | Pantalla | Veredicto | Diferencias y anclas medidas |
|---|---|---|---|---|
| 23 | Inicio sin mascota | `src/screens/home/index.tsx` + `src/components/empty-state.tsx` | parcial, cubierto por P#176 (y P#181) | `empty-state.tsx` ya flota (`withRepeat` = 2, `pingo` = 6); la composición centrada, 190 px y CTA con "+" son #176. |
| 24 | Collar vinculado | `src/components/celebration.tsx` | paridad | Confeti (`confetti` = 32 coincidencias, `Confetti` = 2), Pingo con pop y flotación (`withRepeat` = 5), Modelo/ESN, CTAs. Cierre de #171. El secundario ya lleva `border-2 border-b-6 border-lip-gray`. |

Recuento (24): paridad 15 (1-5, 8-12, 14-17, 24; varias con matiz de P#177/P#187); parcial 9 (6, 7, 13 por duda, 19, 20, 21, 22 propios, y 18 y 23 cubiertos por P#180 y P#176/P#181); falta 0. Ningún artboard entero falta: los huecos son partes de pantallas parciales.

---

## Los 5 huecos de la tarea, verificados

| Hueco | Estado hoy | ¿Lo cubre alguna feature? |
|---|---|---|
| (1) Inicio: burbuja de Pingo con frase del día (C5) | Confirmado ausente (0 coincidencias en `home/index.tsx` y en el catálogo). | Ninguna pendiente. Solo se promete como "parte siguiente, se registra al llegar" en la descripción de #168 (done). |
| (2) Mapa: ping animado en el marcador (C8) | Confirmado ausente (`withRepeat` = 0 en `map/index.tsx` y `pet-map.tsx`). Límite técnico: marcador nativo, `icon` estático. | Ninguna. Promesa en #170 y #168 (ambas done). #60 (iOS) y #151 (candados de la píldora) tocan el mismo fichero pero no este asunto. |
| (3) Zonas + Editor: pastel y breathe | Confirmado ausente (0 `category-palette`, 0 `withRepeat`, 0 `progressbar`, 0 `reicon` en ambas). | Ninguna. Promesa en #170 (done). |
| (4) Vincular + Nueva mascota en 2 pasos (C9) | Confirmado ausente (0 Pingo, 0 `Step` en ambas). | Ninguna. Promesa en #170 (done). |
| (5) Nuevo recordatorio: vista previa (C12) | **Refutado: ya existe** (`add-reminder-preview`, `addReminder.notifyPreview`). | Cerrado por #178 (done). |
| Anillo de kcal en Nutrición (C13) | **Refutado: ya existe** (`food-plan-ring-fill`, `strokeDashoffset`). | #168 / #173 (done). |
| Anillos de ping de Bienvenida | **Refutado: ya existen** (`PingRing`, `welcome-ring-*`). | #167 (done). |

Resultado: de los 5 huecos, 4 son reales y sin feature registrada; el (5) está cerrado. Además se detectó un 6.º hueco real que el encargo no listaba: Inicio, resumen en 4 tiles y hero (fila 6, puntos 2 y 3).

---

## (b) Features NUEVAS candidatas (tamaño de un PR)

Regla común: todas van después de #177 (receta de botón) para no tocar dos veces los mismos `className` de botón, y las que tocan formularios coordinan con #186 (validación) y #187 (tamaños HeroUI). Cada una nombra la spec de valores píxel exacto contra el canvas (`docs/conventions.md` §Píxel exacto). La feature de Mapa-ping (N2) exige un spike antes de la spec.

### N1 — `mobile-home-pingo-phrase` (C5, hueco 1)
- Artboard: Inicio (fila 6).
- Alcance: burbuja de Pingo con frase bajo el hero (imagen + texto), clave nueva `home.*` en EN y ES, entrada con `HomeEntrance`, honra `reduceMotion`.
- Ficheros dueños: `src/screens/home/index.tsx`, `src/i18n/catalog.ts`, `src/i18n/ui-copy-table.ts` (cada fila nueva cae en `checkUses(ALL_USES)` y mueve el candado de longitud del catálogo de `language-provider.test`), pose en `src/assets/pingo-*.webp` (hay 9, entre ellas `pingo-talk.webp`).
- Dependencias / solapes: #181 (Inicio sin mascotas, mismo screen), #176 (mismo screen, rama vacía), #129 (carrera de la query de mascota seleccionada) si la frase usa datos de nutrición. Conviene después de #176 y #181 para no pelear con `home-empty`.
- Decisiones abiertas para el humano:
  1. Contenido de la frase. El canvas dice "Rocky ya caminó 2.3 km hoy. Le falta la comida de las 18:00." La distancia existe (`distanceM` en `src/api/types.ts`), pero `MealsToday` es solo `{ served: number; total: number }`, **sin hora**. Opciones: (a) frase con lo disponible ("lleva 2 de 3 comidas"); (b) consultar el plan de nutrición desde Inicio (trae la hora de la próxima comida, riesgo #129 y una query más); (c) pool de frases fijas por estado. No decido: voz B ya ganó en copy.
  2. Cuándo se muestra: ¿siempre, o solo con mascota con datos?
  3. Pose: placeholder (decisión previa: las poses son placeholders).

### N2 — `mobile-map-marker-ping` (C8, hueco 2) — requiere spike
- Artboard: Mapa (fila 7). Mismo mecanismo reutilizable para el `breathe` del Editor (N3b).
- Spike previo (explorer o `Plan`), en dev build de Android: ¿qué técnica sirve con `expo-maps ~57.0.1`? Opciones:
  1. Overlay RN absoluto sobre el mapa en el centro de pantalla cuando la cámara está centrada en el marcador (el `center` de `map/index.tsx` sale de la posición). Simple, con `withRepeat`; se descoloca si el usuario desplaza el mapa (hay que medir si los gestos están activos: `uiSettings` solo desactiva zoom controls).
  2. Animar `circles` desde estado a baja frecuencia (el círculo es dato; coste de puente y parpadeo).
  3. `icon` estático dibujado con halo (sin animación, no cumple "ping animado" literal).
  4. Dejarlo como excepción nombrada ("equivalencia", como el header nativo).
- Ficheros dueños: `src/components/pet-map.tsx`, `src/screens/map/index.tsx`, posible componente nuevo en `src/components/`, tokens en `src/theme/motion.ts`.
- Solapes: #60 (iOS: `GoogleMaps.View` es solo Android; cualquier overlay debe vivir fuera del View nativo), #151 (candados de `map/index.test.tsx`).
- Decisión del humano: elegir entre 1–4 tras el spike; coste/beneficio de un efecto decorativo sobre un componente nativo.

### N3 — `mobile-geofences-canvas-fidelity` (hueco 3, parte estática)
- Artboards: Zonas seguras (20) y Editor de zona (21), sin el breathe.
- Alcance: Zonas: título en contenido (D-H, `title: ''` en `_layout.tsx` para `pets/[petId]/geofences`), contador "n/5" y barra de 5 segmentos, filas con tile pastel + icono `reicon` + nombre + radio + Switch, botón "Añadir zona" deshabilitado con aviso de límite. Editor: título en contenido, hoja sobre el mapa con Nombre, Radio, Activa, Eliminar/Guardar.
- Ficheros dueños: `src/screens/geofences/index.tsx`, `src/screens/geofence-editor/index.tsx`, `src/app/_layout.tsx` (las dos `Stack.Screen`), `src/utils/category-palette.ts` (paleta pastel, ya la usan Perfil, Recordatorios, Docs, Alertas, Horario), `src/i18n/catalog.ts` + `ui-copy-table.ts`, posibles `src/components/` para la barra de segmentos.
- Solapes: #177 (botones `geofences-add`, `geofence-editor-save`), #181 (centrado/estados sin mascota, Zonas y Editor ven `geofences-no-tracking`), #186 (validación del nombre), #187 no aplica (no son pantallas de cuenta).
- Decisiones abiertas: qué paleta pastel/icono por zona (el modelo `Geofence` no tiene categoría: ¿por índice, por radio, fijo?); si el título nativo sigue por "equivalencia" como en las pantallas de detalle (decisión previa del humano: paridad por equivalencia) o se aplica D-H; si el Editor pasa a hoja con arrastre o se queda como mapa + formulario.

### N3b — `mobile-geofence-editor-breathe` (hueco 3, animación)
- Artboard: Editor de zona. Depende de la decisión de N2 (misma limitación: el círculo es dato nativo). Fusionable con N2 si se elige overlay. No arrancar antes del spike.

### N4 — `mobile-pairing-pingo-canvas-fidelity` (hueco 4, Vincular)
- Artboard: Vincular collar (19).
- Alcance: Pingo (pose `collar`) con 2 anillos de ping (2.4 s, retraso 1.2 s) y flotación, reutilizando `PingoFloat` (`src/components/pingo-float.tsx`) y el patrón `PingRing` de `welcome/index.tsx` (valdría extraerlo a `src/components/` para reusar en Vincular y Bienvenida; decisión de la spec), título/subtítulo en contenido, banner de plan gratuito y pista ya existentes.
- Ficheros dueños: `src/screens/pairing/index.tsx`, `src/screens/welcome/index.tsx` solo si se extrae `PingRing`, `src/i18n/catalog.ts` + `ui-copy-table.ts`.
- Solapes: #177 (`pairing-submit`), #186 (código de activación), #181 (`pairing-no-pets`).
- Decisión abierta: **el "pasos con progreso" que prometió #170 no está en el artboard.** Propuesta de este informe: no construirlo (sin respaldo en el canvas), salvo que el humano quiera un stepper de producto.

### N5 — `mobile-add-pet-two-steps` (C9, hueco 4, Nueva mascota)
- Artboard: Nueva mascota (22).
- Alcance: stepper "1 de 2" con barra de 2 segmentos; paso 1 con foto + burbuja de Pingo y Datos básicos (Tipo, Nombre, Raza, Sexo, Tamaño) + "Continuar"; paso 2 con lo que hoy es "Detalles médicos" (edad, esterilizado, microchip) + "Guardar mascota"; celebración al final ya existe (#171, `add-pet-celebration`).
- Ficheros dueños: `src/screens/add-pet/index.tsx` (488 líneas; el `index.test.tsx` cambiará mucho), `src/app/_layout.tsx` (`pets/add`), catálogo y `ui-copy-table.ts`, `SCREEN_FILES` si se crea fichero.
- Solapes: #186 (errores de validación globales: el paso 1 valida el nombre antes de "Continuar"), #177, #187, y deuda de flake `mobile-add-pet-photo-test-flake` (existe en `specs/`).
- Decisiones abiertas: (1) el canvas **no dibuja el paso 2**; la partición propuesta es una inferencia a confirmar; (2) botón atrás del paso 2 (¿vuelve al 1 conservando datos?); (3) ¿Pingo habla con una frase por paso?; (4) validación al pasar de paso o solo al guardar.

### N6 — `mobile-home-summary-tiles-canvas` (hueco 6, Inicio estructural) — con decisión previa
- Artboard: Inicio (6), puntos 2 y 3 de la fila.
- Alcance: pasar de un `summary-card` único a 4 tiles sueltos con el estilo del canvas; opcionalmente el hero como tarjeta.
- Ficheros dueños: `src/screens/home/index.tsx`, `src/components/pet-hero-header.tsx`, tests `home/index.test.tsx` (candados de #70 por elemento repetido, ver `docs/ui-guidelines.md` §Enmienda #70).
- Solapes: N1 (mismo screen y la burbuja se coloca entre hero y tiles; acordar el orden en ambas specs), #176/#181.
- Decisiones abiertas del humano antes de especificar: el hero con foto a sangre es la Enmienda #67 (decisión fija); el canvas muestra tarjeta. ¿Gana el canvas («el diseño final como el artifact») o se mantiene #67? Y las secciones `reminders` y `last-position` de Inicio no están en el canvas: ¿se quedan?

### Otras observaciones (no son features, para el leader)
- `src/app/(tabs)/food.tsx` sigue como ruta gruesa (468 líneas), sin `src/screens/food/`. Es deuda de estructura (convención de ruta delgada), no de paridad. Podría ir como feature de refactor sin cambio visual.
- Cabecera nativa con título en `pets/add`, `weight-log`, `pets/[petId]/geofences`, `pets/[petId]/geofence-editor` (cuatro `Stack.Screen` de `_layout.tsx` con `title: t(...)`). Contra D-H solo si la decisión previa ("equivalencia" para las pantallas de detalle) no las cubre. Entra dentro de N3 y N5; `weight-log` queda sin dueño y necesita una medición de una línea en su spec (ver fila 13).
- Mantén vigilados los recuentos citados arriba: cualquier PR que toque `home/index.tsx`, `pet-map.tsx` o `catalog.ts` los mueve.

---

## (c) Orden sugerido

1. Esperar #177 (receta de botón) y #187, porque N3, N4 y N5 tocan los mismos botones de las pantallas afectadas. #176 y #181 también tocan `home`.
2. **N4 mobile-pairing-pingo-canvas-fidelity**: el más acotado (un screen, un patrón ya probado en Bienvenida/Celebración), sin decisión de producto salvo la del stepper (propuesta: omitirlo).
3. **N3 mobile-geofences-canvas-fidelity**: dos screens con un patrón ya usado en Recordatorios y Docs (tile pastel, `category-palette`).
4. **N1 mobile-home-pingo-phrase**: tras #176 y #181 para no pelear en `home`. Requiere decidir el contenido de la frase.
5. **N5 mobile-add-pet-two-steps**: la de más churn de tests; tras #186 para reutilizar el componente de validación.
6. **N2 spike + mobile-map-marker-ping** (y N3b): lo último; hace falta el spike en dev build de Android y no bloquea nada.
7. **N6 mobile-home-summary-tiles-canvas**: solo si el humano confirma que el canvas gana sobre #67.

Notas para el leader:
- Las que llevan Pingo o animación: instruir `expo:expo-overview` y las skills de animación; en Codex los nombres son los del plugin `expo@openai-curated` v1.0.2, no los nuestros (deuda B5 en `.claude/agents/leader.md` §Catálogo real de skills de Codex).
- Cada spec nueva debe revisar los candados de catálogo (longitud de `language-provider.test`, `SCREEN_FILES`, `checkUses(ALL_USES)`) y los guards `design-drift` / `legibility-classnames` antes de firmarse.
