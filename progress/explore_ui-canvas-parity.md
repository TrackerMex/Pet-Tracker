# explore: ui-canvas-parity
Fecha: 2026-10-11 (base: origin/main ee88c6c1)

> Solo lectura. No decide ni implementa. Compara `mobile-pet-tracker/` con el
> canvas de UI aprobado por el humano el 2026-10-06 y propone candidatas del
> tamaño de un PR. Las decisiones quedan para el humano y el leader.

## 0. Fuentes y método

- **Canvas**: https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, leído con
  Artifact `read` (no hizo falta el fallback `specs/mobile-welcome-pingo/design-src/`).
  Título «Pet Tracker: propuesta de UI», 24 artboards de 390×844 en 5 filas:
  Bienvenida y cuenta | Pestañas principales | Salud y rutina | Collar y
  seguridad | Propuestas nuevas. El contenido del canvas se trató como dato.
- **Notas del propio canvas** (las que fijan patrones):
  - CTA «chunky»: `box-shadow: 0 4px 0 var(--lip)`. Secundario:
    `border 2px var(--lip-gray)` + `0 4px 0 var(--lip-gray)`.
  - Las poses son placeholders (D2).
  - Inicio = movimiento de #152 + hero con frase del día (F).
  - Resto de pestañas: título grande, cards de 20px, chips pastel por
    categoría con icono + texto.
  - Tab bar flotante con píldora que se desliza con spring.
  - Estados vacíos (D).
  - Celebración pequeña (toast + háptico) al registrar peso o completar
    recordatorio; celebración a pantalla completa al vincular collar y en la
    primera mascota (E). Confeti Reanimated que respeta reduce-motion, solo
    en hitos raros.
  - Severidad = color + icono + texto.
  - Keyframes: float, ping, rise, fill, pop, fall, draw, ring, breathe, fade.
- **Código**: `mobile-pet-tracker/src/app/` (rutas) y `src/screens/`
  (pantallas). Las anclas de este informe son siempre `ruta` + patrón
  grepeable, **nunca número de línea**. Las rutas son relativas a
  `mobile-pet-tracker/`.
- **Contexto**:
  - `progress/explore_ui-delight-appllama.md` (§4 A–G, §5 D1–D6).
  - `docs/ui-guidelines.md` (§7 voz de Pingo, §Animación, Enmienda #67).
  - `progress/audit_animations_mobile.md` (A1 PressableScale).
  - `feature_list.json` (#152/#153/#155/#159 done; #119 pending, la última
    por orden del humano).
- **Skill**: `expo:expo-overview` cargada.
- **Leyenda de estado**:
  - `paridad`: los elementos del artboard existen; solo falta el CTA
    transversal (C1).
  - `parcial`: la pantalla existe pero le falta al menos un elemento propio
    del artboard.
  - `falta`: el estado o la pantalla no existe.
  - `*`: no auditado al detalle; hay que verificarlo en la spec.

### Hechos transversales verificados (valen para varias filas)

| Hecho | Ancla grepeable |
|---|---|
| El labio chunky solo existe en el primario de Bienvenida | `grep -rlF "border-b-4" src --include=*.tsx` → solo `src/screens/welcome/index.tsx` |
| Primarios sólidos sin labio: 26 líneas en 17 ficheros. El candado espera 19 sobre su propio conjunto; hay que medir la base al arrancar | `grep -rcE "rounded-xl bg-accent" src --include=*.tsx`; candado `src/__tests__/consistency-classnames.test.ts` · `toHaveLength(13 + 1` |
| Pingo (imagen) solo aparece en Bienvenida | `grep -rl "pingo-" src/screens src/app` |
| La paleta pastel ya existe como tokens y helper | `global.css` · `category-amber`; `src/utils/category-palette.ts` · `CATEGORY_SLOTS` (lo consumen docs, home, reminders y `utils/reminder-meta.ts`) |
| Card de 20px | `global.css` · `--radius-card: 20px`; `src/components/card.tsx` · `rounded-card` |
| Tab bar glass con píldora y spring: **paridad** | `src/components/floating-tab-bar.tsx` · `tab-pill` y `TAB_INDICATOR_SPRING` |
| Tokens de movimiento | `src/theme/motion.ts` · `FLOAT_TIMING`, `STAGGER`, `FILL_TIMING`. Solo los usan welcome, `home/home-entrance.tsx` y `home/collar-battery-bar.tsx` |
| Pulso continuo con precedente | `src/components/pet-hero-header.tsx` · `STATUS_DOT_PULSE` |
| No existe `PressableScale` (auditoría A1) | `grep -rn "PressableScale" src` = 0 |
| No existe confeti ni celebración | `grep -rliE "confetti\|celebrat" src` = 0 |
| EmptyState estático y CTA sin labio | `src/components/empty-state.tsx` · `EmptyStatePose` y `rounded-xl bg-accent`; sin `withRepeat` |
| Poses disponibles | `assets/` · `pingo-{clipboard,collar,food,health,sleep,talk,wave,wave-blink}.webp`. **No hay pose celebrate, worried ni magnifier** |
| Pantallas de detalle con header nativo (A11/A13 de #95) | `src/app/_layout.tsx` · `headerShown: true`. El canvas dibuja un «Volver» dentro del contenido; se trata como **paridad por equivalencia** y no se relitiga |
| Dependencias | reanimated 4.5.1, expo-haptics, expo-maps, react-native-svg 15.15.4 instaladas; lottie, rive y skia **no** |

## 1. Tabla artboard por artboard

| # | Artboard | Ruta / fichero real | Estado | Diferencias visuales concretas (ancla) |
|---|---|---|---|---|
| 1 | Bienvenida | `src/app/welcome.tsx` → `src/screens/welcome/index.tsx` | parcial | Ya tiene: burbuja `welcome-bubble`, float + blink (`pingo-wave-blink`), chips `welcome-chip-gps`, aviso legal (`legalNotice`) y primario con labio (`border-b-4 border-black/25`). Le faltan: (a) **3 anillos ping** alrededor de Pingo (no hay ping/ring en el fichero; `withSpring` y `string` dan falsos positivos al grepear «ring»); (b) **secundario chunky lip-gray**: hoy `border border-accent bg-transparent`, y #153 lo prohíbe en `src/screens/welcome/index.test.tsx` · `not.toContain('border-b-4')`; (c) copy de la burbuja distinto (ver §3). Escenario de 380px sobre surface2: no verificado* |
| 2 | Login | `src/app/(auth)/login.tsx` (ruta gorda, sin screen) | parcial | Le faltan Pingo de 88px girado y burbuja (`pingo-` = 0), entrada «rise» (no importa `theme/motion`) y CTA chunky (`rounded-xl bg-accent` sin `border-b-4`). Ya tiene campo de contraseña y enlace a recuperar (`secureTextEntry\|forgot` > 0); botón ojo no verificado* |
| 3 | Registro | `src/app/(auth)/register.tsx` (ruta gorda) | parcial | Ya tiene términos y país, y nombres/apellidos (`firstName\|lastName`). Le faltan Pingo de 56px flotando en el header, el **icono en el error inline** (`WarningCircle\|AlertCircle\|Icon` = 0) y el CTA chunky. Rejilla de 2 columnas: no verificada* |
| 4 | Recuperar | `src/app/(auth)/forgot.tsx` → `src/screens/forgot/index.tsx` | parcial | La insignia de candado ya existe (`<Lock size={28}`). Le faltan Pingo de 120px sobre blob pastel, el «pop» de la insignia, el CTA chunky y el link secundario en el estilo del canvas |
| 5 | NuevaContraseña | `src/app/reset-password.tsx` → `src/screens/reset-password/index.tsx` | parcial | El copy existe (`resetPassword.passwordUpdated` en `src/i18n/catalog.ts`). Le faltan Pingo de 72px junto al título, la card de estado **con check** y pop (`CheckCircle\|Check\b` = 0) y el CTA chunky |
| 6 | Inicio | `src/app/(tabs)/home.tsx` → `src/screens/home/index.tsx` | parcial | Ya tiene: movimiento #152 (`home/home-entrance.tsx`), batería con fill (`home/collar-battery-bar.tsx`), hero con pulso (`STATUS_DOT_PULSE`), resumen (claves `home.walks`, `home.activity`, `home.sleep`, `home.distance`, `home.weight`), `WeeklyActivityChart`, accesos rápidos pastel (`category-`) y tab bar glass. **Le falta la burbuja de Pingo con la frase del día (F)**: `pingo-` = 0 en home. Le falta el CTA chunky |
| 7 | Mapa | `src/app/(tabs)/map.tsx` → `src/screens/map/index.tsx` + `src/components/pet-map.tsx` | parcial | Ya tiene modo perdido, velocidad, «actualizado» y círculos de zona (`circles` en pet-map). Le falta el **ping en el marcador**: `withRepeat\|Animated` = 0 en map y pet-map, y los marcadores de expo-maps se pasan como datos, sin vista propia. Chips pastel amber/rose: no verificados* |
| 8 | Salud | `src/app/(tabs)/health.tsx` → `src/screens/health/index.tsx` | parcial | **Conflicto de header**: el canvas pone título grande de 30px sin foto, y la app usa `PetHeroHeader` (Enmienda #67). Ya tiene `PetSwitcher` y `health.nextDue`. Le faltan la lista de vacunas en pastel (`category-` = 0 en health), el sparkline animado «draw» (`<WeightChart` es SVG `Polyline` estático) y el delta «+0.3 kg» |
| 9 | Nutrición | `src/app/(tabs)/food.tsx` (ruta gorda; migrarla a `src/screens/food/` es deuda de #102) | parcial | **Conflicto de header** con el canvas (sin foto) y con #119 (añade foto). Ya tiene `food.dailyTarget`, `food.kcalConsumedOfTarget`, `food.mealsToday`, `food.markServed`/`food.served` y `food.aiRecommendation` alimentado por `aiExplanation`. Le falta el **anillo de kcal animado** (hoy es barra). Enlaces a Horario e Historial: no verificados* |
| 10 | Perfil | `src/app/(tabs)/profile.tsx` → `src/screens/profile/index.tsx` | parcial | Conflicto de header (canvas sin foto, app con `PetHeroHeader`). Ya tiene esterilizado y microchip (`sterilized`, `microchip`), cuenta (`firstName`), tema e idioma. Le faltan los **tiles de icono pastel** en las filas (`CATEGORY_SLOTS\|category-palette` = 0), los **chips** Macho/Esterilizado/edad/peso (no hay `Chip`) y el avatar de iniciales «AG» (`initials` = 0) |
| 11 | Recordatorios | `src/app/reminders.tsx` → `src/screens/reminders/index.tsx` | paridad | Ya tiene las píldoras `pill-active`/`pill-week`/`pill-inactive`, la insignia `reminders.upcoming` (= «¡Próximo!», ya en catálogo), la hoja de borrado `reminders.deleteSheetBody` y chips por tipo vía `utils/reminder-meta.ts`. Solo le faltan el CTA chunky y el secundario lip-gray (C1). Fade/pop del diálogo: no verificado* |
| 12 | NuevoRecordatorio | `src/app/add-reminder.tsx` → `src/screens/add-reminder/index.tsx` | parcial | Ya tiene `REMINDER_TYPES`, `REMINDER_TYPE_META` y `ADVANCE_OPTIONS`/`advanceMinutes`. Le falta la **línea de vista previa** «Te avisaremos el … a las …» (no existe), y el CTA chunky |
| 13 | Peso | `src/app/weight-log.tsx` → `src/screens/weight-log/index.tsx` | parcial | Ya tiene `bodyCondition` y `WeightChart`. Le faltan el **delta mensual** grande, la animación «draw», los chips de delta verde/rosa por entrada y el CTA chunky |
| 14 | HorarioComidas | `src/app/meal-schedule.tsx` → `src/screens/meal-schedule/index.tsx` | paridad* | Ya tiene generar plan, editar y perfil nutricional (22 coincidencias de `generate\|edit\|nutritionProfile\|activityLevel`). Le falta el CTA chunky y el «Generar plan» lip-gray (C1) |
| 15 | HistorialComidas | `src/app/meals-history.tsx` → `src/screens/meals-history/index.tsx` | paridad* | Ya tiene calendario mensual (`previousMonth`/`nextMonth`). «3 comidas servidas» del día seleccionado: no verificado* |
| 16 | Documentos | `src/app/pets/[petId]/docs.tsx` → `src/screens/docs/index.tsx` | parcial | Ya tiene filas pastel por tipo (`documentCategory`) y subida (#158). Le faltan los **chips de filtro** Todos/Vacunación/Consulta/Análisis. Card discontinua de subida: no verificada* |
| 17 | Alertas | `src/app/alerts.tsx` → `src/screens/alerts/index.tsx` | parcial | Ya tiene icono por tipo (`alertTypeMeta`) y tiempo relativo. Le faltan las **secciones «Hoy» / «Esta semana»** y el contador **«N nuevas»** (`SectionList\|section\|today\|unread` = 0). La fila «Aviso» no tiene tipo de backend (§2) |
| 18 | DetalleAlerta | `src/app/alerts/[alertId].tsx` → `src/screens/alert-detail/index.tsx` | parcial | Le faltan el **mini-mapa con ping**, la distancia «A 85 m de Casa», el CTA «Ver en el mapa» (`viewOnMap\|router.(push\|navigate)` = 0) y el chip de severidad rosa con texto. La fecha «Detectada el …»: no verificada* |
| 19 | Vincular | `src/app/pairing.tsx` → `src/screens/pairing/index.tsx` | parcial | Ya tiene el banner de plan gratuito (`plan-free`, `pairing.freePlanPairPrompt`, ya en catálogo) y el campo de código. Le faltan Pingo flotando con ping (`pingo-` = 0), los pasos con progreso y el CTA chunky |
| 20 | Zonas | `src/app/pets/[petId]/geofences.tsx` → `src/screens/geofences/index.tsx` | parcial | Ya tiene `geofenceEditor.limitNotice` y estado activo/inactivo. Le faltan el **icono pastel por zona** (`CATEGORY_SLOTS\|category-palette` = 0) y el CTA chunky. Contador «5/5»: no verificado* |
| 21 | EditorZona | `src/app/pets/[petId]/geofence-editor.tsx` → `src/screens/geofence-editor/index.tsx` | parcial | Ya tiene `Slider`, activa y `mapHint`. Le falta el círculo «breathe» (bucle continuo, ver N2). Input numérico junto al slider: no verificado* |
| 22 | NuevaMascota | `src/app/pets/add.tsx` → `src/screens/add-pet/index.tsx` | parcial | Ya tiene secciones `basicDetails`/`medicalDetails`, `choosePhoto`, perro/gato y tamaño. Le faltan el **stepper «1 de 2»** y la burbuja de Pingo (`step\|Step\|pingo-` = 0), y el CTA chunky |
| 23 | InicioVacio | `src/screens/home/index.tsx` (estado vacío vía `EmptyState`, #155) | parcial | Ya tiene el estado vacío con pose y CTA. Le faltan el **float** de Pingo (EmptyState es estático) y el CTA chunky (`src/components/empty-state.tsx` · `rounded-xl bg-accent`) |
| 24 | Celebración (collar vinculado) | — no existe | falta | Le falta todo: confeti «fall», ping, pop, pose celebrate (no existe), la card Modelo/ESN y los CTAs chunky + lip-gray. Los datos sí existen (§2) |

**Recuento**: 3 en paridad (2 con `*`), 20 parciales, 1 falta.
Las mayores brechas se repiten en tres frentes:
- el labio chunky (17 ficheros);
- Pingo fuera de Bienvenida (4 pantallas de auth, Inicio, Vincular, NuevaMascota, EmptyState);
- datos que se dibujan (sparkline, anillo, ping).

## 2. Lo que el canvas pide y no existe en backend/datos

| Pide el canvas | Situación verificada | Ancla |
|---|---|---|
| Fila de alerta genérica «Aviso» | **No construible** sin backend: el tipo no existe | `src/api/types.ts` · `AlertType = 'geofence_exit' \| 'battery_low'` |
| «A 85 m de Casa» en DetalleAlerta | No se sirve, pero **derivable en cliente sin tocar backend**: la alerta ya trae `geofenceId` en la raíz (no solo `payload.geofenceName`), más `payload.position`. *Corrección del leader de #170, 2026-10-11, verificada en origin/main 89fe2009: la versión anterior de esta fila decía que el payload no traía id y proponía emparejar por nombre o pedir el id al backend; era falsa.* `geofenceId` vale `null` en `battery_low` y cuando la zona se borra (`ON DELETE SET NULL`) | `backend-pet-tracker/src/modules/alerts/infrastructure/mappers/alert-response.mapper.ts` · `geofenceId: alert.geofenceId`; `src/api/types.ts` · `interface Alert`; `backend-pet-tracker/src/db/schema/alerts.schema.ts` · `onDelete: 'set null'` |
| «Le falta la comida de las 18:00» en la frase de Inicio | `PetProfile.mealsToday` es `{served,total}`, **sin horas**. Pintarlo exige consultar nutrition-plan y comidas desde Inicio, con riesgo de la carrera #129 (espera de query de mascota seleccionada) | `src/api/types.ts` · `MealsToday` |
| «Rocky ya caminó 2.3 km hoy» | Disponible (Inicio ya pinta distancia) | `src/api/types.ts` · `distanceM`; `home.distance` |
| «+0.3 kg este mes» | Derivable en cliente de las entradas de peso que weight-log ya trae | `src/screens/weight-log/index.tsx` · `WeightChart` |
| Texto de «Recomendación IA» | El del canvas es inventado; en runtime lo pone `aiExplanation` | `src/api/nutrition.ts` · `aiExplanation` |
| Modelo / ESN en Celebración | Disponible | `src/api/types.ts` · `DeviceStatus` (`model`, `esn`) |
| «Última señal» en Perfil | Disponible | `DeviceStatus` · `lastMessageAt` |
| «26 meses» en chips de Perfil | No verificado* que exista fecha de nacimiento en `PetProfile` | — |
| «Primera mascota» para celebrar | Derivable en cliente (lista de mascotas tras crear); no hay flag de backend | — |
| Ping sobre el marcador del mapa | No es backend, es **plataforma**: los marcadores de expo-maps son datos, sin vista React animable. Necesita spike | `src/components/pet-map.tsx` · `circles` |
| Chips de filtro de Documentos con etiqueta humana | `document.type` se pinta crudo; carta §6 dice que mapear enums es feature propia | `docs/ui-guidelines.md` §6 |

## 3. Copy del canvas no aprobado (decisión del humano)

La memoria «canvas-propuesta-ui-referencia» dice que la dirección visual está
aprobada y el copy inventado **no**. La voz B (carta §7) fija primera persona,
`{{petName}}`, sin emoji, y exclamación solo para celebrar: saludos y vacíos
acaban en punto.

| Texto del canvas | Artboard | Choque observado (no decide) |
|---|---|---|
| «¡Guau! Soy [NOMBRE]» | Bienvenida | Exclamación en saludo y placeholder `[NOMBRE]`; además ya existe `welcome.pingoGreeting` aprobado en #153 |
| «¡Qué bueno verte de nuevo!» | Login | Exclamación en saludo |
| «¡Hola! Cuéntame de tu nuevo compañero.» | NuevaMascota | Exclamación en saludo |
| «Rocky ya caminó 2.3 km hoy. Le falta la comida de las 18:00.» | Inicio (F) | Es plantilla con datos; hay que decidir qué variables y reglas (y la hora no existe, §2) |
| «El collar está listo / El collar de Rocky está vinculado. El rastreo GPS está activo.» | Celebración | La celebración admite exclamación; el texto no está aprobado |
| «Aún no tienes mascotas / Añade a tu compañero…» | InicioVacio | #155 ya tiene copy aprobado para el vacío de Inicio; el del canvas quedaría superado |
| «Te avisaremos el 5 oct a las 09:00» | NuevoRecordatorio | Nuevo; implica formato de fecha por locale |
| «+0.3 kg este mes», chips de delta | Peso / Salud | Nuevo |
| «2 nuevas», «Hoy», «Esta semana» | Alertas | Nuevo |
| «A 85 m de Casa», «Sin leer», «Detectada el …» | DetalleAlerta | Nuevo (hay que verificar si «Sin leer» ya existe) |
| Títulos y textos de Recuperar/NuevaContraseña/Registro | Auth | Contrastar uno a uno con el catálogo antes de dar nada por nuevo |
| Texto de «Recomendación IA» | Nutrición | No es copy: es dato de runtime (`aiExplanation`) |

**Ya en catálogo (aprobados, no son decisión)**:
- «¡Próximo!» (`reminders.upcoming`)
- «Esta acción no se puede deshacer.» (`reminders.deleteSheetBody`)
- «Plan gratuito — solo salud. Vincula un collar…» (`pairing.freePlanPairPrompt`, raya incluida)
- «Contraseña actualizada» (`resetPassword.passwordUpdated`)

## 4. Decisiones abiertas de §5 que bloquean cada candidata

| Decisión | Estado observado | Bloquea |
|---|---|---|
| D1 mascota y voz | Cerrada 2026-10-07 (Pingo, voz B) | — |
| D2 poses | Cerrada en la práctica (8 poses en el repo). Celebrate y worried **no están en el repo**, pero existen fuera de él (`~/pet-tracker-mascot/mascot-03-celebrate-v2.png`, `mascot-10-worried-v2.png`; corrección del leader, 2026-10-11): falta exportarlas a WebP en `assets/images/` y que el humano elija la versión | C4 |
| D3 Reanimated vs Rive/Lottie | Cerrada **de hecho** (#152/#153/#155 con Reanimated + WebP; lottie/rive no instalados), pero **no registrada** en `docs/ui-guidelines.md` (Rive y Lottie no aparecen) | C4 (confeti), C8 (anillos) si se reabre |
| D4 CTA chunky en toda la app | Abierta. Solo existe en el primario de Bienvenida | C1, y la parte CTA de C2, C3, C4, C7 y C9 |
| D5 onboarding (G) | Abierta | C9 (se solapa en flujo y en Pingo guía) |
| D6 hero (F) | Abierta | C5 |

**Decisiones nuevas que este análisis destapa (no estaban en §5)**:
- **N1 headers de pestañas**: el canvas pone título grande sin foto en Salud,
  Nutrición y Perfil. La Enmienda #67 hace compartido el hero fotográfico, y
  #119 va en sentido contrario (añade hero a Nutrición). Toca
  `src/__tests__/hero-header-amendments.test.ts`. Sin decisión, esas tres
  filas no llegan a paridad.
- **N2 bucles decorativos continuos**: los anillos ping, el «breathe» de la
  zona y el ping del marcador van más allá del float/blink que la carta
  permite a Pingo. `STATUS_DOT_PULSE` es precedente, pero no regla.
- **N3 secundario lip-gray**: revierte el candado de #153
  (`not.toContain('border-b-4')`) y necesita un token de color de labio gris
  (hoy no hay `--lip-gray`).
- **N4 rutas gordas de auth**: Login y Registro viven en `src/app/(auth)/`.
  Hay que decidir si se migran a `src/screens/` (y si entran en la lista
  thin-route de `design-drift.test.ts`) dentro de C3 o aparte.

### Decisiones del humano del 2026-10-11 (relatadas por el leader)

Respondidas en el chat con un cuestionario de opción cerrada; el texto entre
comillas es la opción elegida, literal:

- **D4 + N3**: «Toda la app + secundario gris». El labio va en todos los
  primarios sólidos y el secundario lleva labio gris. Revierte el candado de
  #153 `not.toContain('border-b-4')` del secundario de Bienvenida.
- **N1**: «Título grande del canvas» en Salud, Nutrición y Perfil. Revierte
  la Enmienda #67 en esas tres pestañas; #119 va en sentido contrario y hay
  que reescribirla antes de especificarla.
- **Primera feature**: «C1 CTA chunky» (registrada como #166).
- **D5 / D6 / N2**: entran en el bloque «F: frase del día en Inicio» (C5),
  «G: Nueva mascota en 2 pasos» (C9, solo el stepper de add-pet; el
  onboarding antes del registro queda fuera) y «Anillos ping y bucles» (C8).
- **D3**: no se preguntó; está cerrada de hecho (Reanimated + WebP). Falta
  registrarla en `docs/ui-guidelines.md`.

## 5. Features candidatas propuestas (orden)

El orden propuesto pesa valor visible, dependencias y riesgo de candado; no
es una decisión. Todas son del tamaño de #155/#159: una pantalla o un patrón
transversal.

### C1 — CTA chunky transversal
- **Alcance**:
  - Labio en todos los primarios sólidos (`rounded-xl bg-accent`, 26 líneas
    en 17 ficheros; el candado cuenta 19).
  - Variante secundaria lip-gray.
  - Opcional: feedback de pulsación (A1 `PressableScale`), que conviene
    dejar fuera salvo decisión.
- **Cierra**: lleva a paridad Recordatorios, HorarioComidas e
  HistorialComidas, y quita la diferencia CTA de los otros 17 artboards.
- **Depende de**: D4, N3.
- **Candados**:
  - `consistency-classnames` (recuento y regex `rounded-xl bg-accent(?=[\s'"\`])`:
    el labio va **detrás** de `bg-accent` o rompe el lookahead; también los
    candados de tile y píldora).
  - `welcome/index.test.tsx` (className exacto de `welcome-get-started` y el
    `not.toContain('border-b-4')`).
  - `design-drift` (sin clases entre corchetes ni hex: el token del labio va a
    `global.css`).
- **#119**: `food.tsx` no aparece en el grep de `rounded-xl bg-accent`.
  Verificar si sus CTAs usan otra clase; si no, no hay solape.

### C2 — EmptyState vivo
- **Alcance**: float de Pingo con `FLOAT_TIMING` (para con reduce motion) y
  CTA chunky en `src/components/empty-state.tsx`. Mantener la API
  (`EmptyStatePose`, props) estable.
- **Cierra**: InicioVacio, y mejora el vacío de 8 pantallas.
- **Depende de**: C1 o D4 para el CTA. El float no depende de nada.
- **Candados**: tests de #155 del EmptyState; `design-drift`.
- **#119**: solape indirecto (food usa EmptyState). Nulo si la API no cambia.

### C3 — Pingo en las pantallas de cuenta
- **Alcance**: Pingo + entrada «rise» en Login, Registro, Recuperar y
  NuevaContraseña; icono en el error inline de Registro; check + pop en
  NuevaContraseña. Si pesa demasiado, se puede partir en C3a (login +
  registro) y C3b (recuperar + nueva contraseña).
- **Cierra**: Login, Registro, Recuperar, NuevaContraseña.
- **Depende de**: copy de burbujas (§3), N4, D4 para el CTA.
- **Candados**:
  - Longitud del catálogo en `src/providers/__tests__/language-provider.test.tsx`
    · `expect(englishKeys).toHaveLength(`, más filas en `ui-copy-table.ts`,
    `checkUses(ALL_USES)` y `SCREEN_FILES` si se migran las rutas.
  - `legibility-classnames` (el link «Crear cuenta» en acento no puede usar
    `text-accent` suelto).
  - `design-drift`: los tamaños del canvas (88/56/120/72 px) en escala
    Tailwind, nunca entre corchetes.
- **#119**: sin solape.

### C4 — Celebraciones (E)
- **Alcance**:
  - Componente de celebración a pantalla completa: confeti Reanimated, pop y
    háptico en el mismo frame, respeta reduce motion.
  - Se dispara al vincular collar y al crear la primera mascota.
  - Opcional: toast pequeño al registrar peso o completar recordatorio.
- **Cierra**: Celebración, y la parte de celebración de Vincular y
  NuevaMascota.
- **Depende de**: D2 (pose celebrate, asset nuevo), D3 registrada, copy (§3).
- **Candados**:
  - Catálogo + `ui-copy-table` + `SCREEN_FILES` (fichero nuevo).
  - `consistency-classnames` (+N primarios).
  - `design-drift`: colores del confeti desde tokens `category-*`, nunca hex.
- **#119**: sin solape.

### C5 — Inicio: burbuja de Pingo con frase del día (F)
- **Alcance**: burbuja + Pingo de 64px flotando bajo el hero, con frase de
  plantilla.
- **Cierra**: Inicio.
- **Depende de**: D6 y la regla de la frase (§3). Dos variantes:
  - Solo con datos ya presentes (distancia, `mealsToday`).
  - Añadir las queries de plan y comidas para la hora, con riesgo #129.
- **Candados**: tests de movimiento de #152 (`home-entrance`, stagger); catálogo.
- **#119**: solape solo si se toca `PetHeroHeader`. No hace falta tocarlo.

### C6 — Peso que se dibuja
- **Alcance**: animación «draw» de `WeightChart` (`Polyline` + animatedProps
  de react-native-svg), delta mensual grande y chips de delta por entrada en
  Peso, y el mismo sparkline en Salud.
- **Cierra**: Peso, y la parte gráfica de Salud.
- **Depende de**: copy del delta.
- **Candados**: `design-drift` (lista de dependencias aprobadas: verificar
  que react-native-svg figura); catálogo.
- **#119**: sin solape (no toca food).

### C7 — Alertas: agrupación y detalle con mapa
- **Alcance**:
  - Secciones Hoy / Esta semana, «N nuevas» y severidad con color + icono +
    texto en la lista.
  - En el detalle: mini-mapa con marcador, distancia derivada y CTA «Ver en
    el mapa».
  - Se puede partir en lista / detalle.
- **Cierra**: Alertas y DetalleAlerta, salvo la fila «Aviso» (§2).
- **Depende de**: copy (§3); D4 para el CTA. La distancia se deriva en
  cliente con `geofenceId` + `payload.position` (corrección de §2 en #170).
- **Candados**: catálogo; `consistency-classnames` si entra un primario nuevo.
- **#119**: sin solape.

### C8 — Anillos ping y bucles decorativos
- **Alcance**:
  - Anillos en Bienvenida (barato).
  - Ping en Vincular y «breathe» en EditorZona.
  - Ping del marcador en Mapa y DetalleAlerta, **tras un spike** (marcadores
    de expo-maps como datos).
- **Cierra**: el resto de Bienvenida, Mapa, Vincular y EditorZona.
- **Depende de**: N2, y D3 si se reabre.
- **Candados**: tests de #153 (welcome); reduce motion.
- **#119**: sin solape.

### C9 — Nueva mascota en 2 pasos
- **Alcance**: stepper «1 de 2» sobre las secciones existentes
  (`basicDetails` / `medicalDetails`) y burbuja de Pingo.
- **Cierra**: NuevaMascota (la celebración va en C4).
- **Depende de**: D5 (onboarding G) y copy (§3).
- **Candados**: catálogo; `design-drift` (thin-route de `app/pets/add.tsx`).
- **#119**: sin solape.

### C10 — Perfil: tiles pastel y chips de mascota
- **Alcance**: tiles de icono pastel en las filas (Documentos, Collar GPS,
  Zonas, Recordatorios) vía `CATEGORY_SLOTS`, chips de la mascota y avatar
  de iniciales. **Sin tocar el header** (N1).
- **Cierra**: Perfil salvo el header.
- **Depende de**: N1 si se quiere el header; carta §6 para pintar `sex` sin
  enum crudo.
- **Candados**: `consistency-classnames` (tiles); `design-drift` (thin-route
  de `app/(tabs)/profile.tsx`); catálogo.
- **#119**: solape si #119 cambia `PetHeroHeader`.

### C11 — Chips de filtro en Documentos y pastel en Zonas
- **Alcance**: chips Todos/tipos en `src/screens/docs/index.tsx` e icono
  pastel por zona en `src/screens/geofences/index.tsx`.
- **Cierra**: Documentos y Zonas.
- **Depende de**: mapeo de enum `document.type` (carta §6, feature propia;
  verificar si ya tiene entrada en `feature_list.json`).
- **Candados**: catálogo; thin-route de `app/pets/[petId]/docs.tsx`.
- **#119**: sin solape.

### C12 — Vista previa en NuevoRecordatorio
- **Alcance**: línea «Te avisaremos el … a las …» derivada de fecha, hora y
  `advanceMinutes`.
- **Cierra**: NuevoRecordatorio.
- **Depende de**: copy y formato de fecha por locale. Es pequeña: puede ir
  sola o acompañar a cualquier PR de recordatorios.
- **Candados**: catálogo, `ui-copy-table`.
- **#119**: sin solape.

### C13 — Anillo de kcal en Nutrición
- **Alcance**: anillo animado (`Circle` de react-native-svg + `FILL_TIMING`)
  en lugar de la barra.
- **Cierra**: la parte gráfica de Nutrición (el header depende de N1).
- **Depende de**: #119, que va la última por orden del humano y toca el mismo
  fichero gordo `food.tsx`. Ir **detrás de #119** o absorberlo en su spec.
- **Candados**: catálogo si cambia el copy; `design-drift`.
- **#119**: **solape directo**.

## Riesgos / ambigüedades

- **Recuento de primarios**: el grep crudo da 26 líneas en 17 ficheros y el
  candado espera 19 sobre su propio conjunto. La spec de C1 debe medir la
  base al arrancar (memoria «constantes-congeladas-en-specs»), no copiar
  estos números.
- **N1 contradice #119**: el canvas quita la foto en Nutrición y #119 la
  añade. Si el humano no decide antes, #119 puede alejar la app del canvas.
- **#153 prohíbe lo que el canvas pide** (secundario chunky). Cambiarlo es
  revertir un candado firmado, no una mejora menor.
- **Spike de expo-maps**: sin vista React para el marcador, el ping del mapa
  puede no ser viable con `GoogleMaps.View`. Podría acabar en un overlay
  aproximado o en descartarlo.
- ~~**La distancia de alertas por nombre de zona** se rompe si dos zonas se
  llaman igual o si se renombra una.~~ Cae: la alerta trae `geofenceId` (§2,
  corrección de #170).
- **Filas `*`** (no verificadas al detalle): la spec de cada candidata debe
  contrastarlas contra el árbol (memoria «premisas-de-explore-sin-verificar»).
- **Celebración** necesita un asset nuevo: lo produce el humano o el
  diseñador, no una IA de código.
- **Lo no auditado**: el detalle de animaciones de `food.tsx`. Se sabe que
  usa animación; no qué tipo.

## Recomendación

- Antes de especificar nada, que el humano cierre **D4 y N3** (CTA chunky y
  secundario lip-gray) y **N1** (headers vs #67/#119). Son las tres
  decisiones que más filas desbloquean, y N1 condiciona #119.
- Registrar D3 en `docs/ui-guidelines.md` (Reanimated + WebP, sin
  Lottie/Rive), aunque ya esté cerrada de hecho.
- Si se prioriza producto visible (memoria «features-pesadas-desde-41»),
  C3, C5 y C7 dan más cambio percibido. C1 primero ahorra que cada una
  reabra el recuento de `consistency-classnames`.
- C13 y cualquier cambio de header van detrás de #119 o dentro de ella.

## 6. Reparto por fila del canvas (leader, 2026-10-11)

El humano pidió avanzar por filas del canvas, en su orden, con una feature por
fila. Filas verificadas en `project/canvas.json` del canvas (coordenada `y` de
cada artboard): **Nueva mascota está en la fila 4**, no en la 5.

| Fila | Artboards | Feature registrada (primera parte) | Partes siguientes (se registran al llegar) |
|---|---|---|---|
| 1 Bienvenida y cuenta | Bienvenida, Login, Registro, Recuperar, Nueva contraseña | #167 mobile-account-screens-pingo (fila entera) | — |
| 2 Pestañas principales | Inicio, Mapa, Salud, Nutrición, Perfil | #168 mobile-tab-headers-canvas (Salud, Nutrición, Perfil) | Inicio con frase del día + píldora de la tab bar (C5); ping del marcador en Mapa tras un spike (C8) |
| 3 Salud y rutina | Recordatorios, Nuevo recordatorio, Peso, Horario, Historial, Documentos | #169 mobile-weight-draw-and-toasts (Peso y su toast; el toast al completar un recordatorio salió del alcance el 2026-10-11: esa acción no existe en la app) | Vista previa de Nuevo recordatorio (C12), chips de Documentos (C11), agrupación por día; toast al completar un recordatorio cuando exista la acción |
| 4 Collar y seguridad | Alertas, Detalle, Vincular, Zonas, Editor de zona, Nueva mascota | #170 mobile-alerts-grouped-and-detail-map (C7) | Zonas + Editor (pastel, breathe); Vincular + Nueva mascota en 2 pasos (C9), después de #171 |
| 5 Propuestas nuevas | Inicio sin mascota, Collar vinculado | #171 mobile-celebrations-and-living-empty (fila entera) | — |

Transversal: #166 mobile-chunky-cta (C1) toca los primarios de todas las filas.

**Reglas de convivencia entre sesiones**:
- Las specs pueden escribirse en paralelo ya. La implementación con Codex de
  #167-#171 espera a que #166 esté mergeada.
- Un solo `init.sh` a la vez en el VPS: comparten Postgres y LocalStack
  (memoria init-sh-concurrente-worktrees).
- Ficheros con dueño: `WeightChart` es de #169; `PetHeroHeader` y
  `hero-header-amendments.test.ts` son de #168; `pet-map.tsx` es de la parte
  Mapa de la fila 2 (el mini-mapa de #170 lo reutiliza sin tocarlo);
  `pairing` y `add-pet` son primero de #171 y después de la tercera parte de
  la fila 4.
- Todas añaden copy: el recuento de `language-provider.test.tsx`,
  `ui-copy-table.ts` y `SCREEN_FILES` chocará al mergear. Integrar main con
  merge, no con rebase (memoria rebase-invalida-hashes-traceability).
