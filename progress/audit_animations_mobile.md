# Auditoría de oportunidades de animación — app móvil

Fecha: 2026-08-24
Alcance: `mobile-pet-tracker/src/` (app/(tabs)/, app/(auth)/, components/, theme/) en worktree `docs/ui-charter` (incluye Card compartido de #72).
Método: skill `find-animation-opportunities` (gate de frecuencia/propósito/velocidad/función) + criterios Reanimated de `expo-animation`.
Stack verificado: Expo SDK 57, Reanimated 4.5.1, react-native-worklets 0.10.1, gesture-handler 2.32, react-native-maps 1.27.2, heroui-native 1.0.8, uniwind. **expo-haptics NO instalado.** Runtime de smoke: Expo Go — todo lo propuesto corre en Expo Go.

---

## 1. Inventario de motion existente

**Anima hoy (todo viene de librerías, cero Reanimated en código propio):**

| Qué | Fuente | Detalle |
| --- | --- | --- |
| Press en `Button`/`LinkButton` | heroui-native (built-in) | `feedbackVariant="scale-highlight"`: scale 0.985, timing 300ms `Easing.out(ease)` + highlight de fondo (verificado en `node_modules/heroui-native/lib/module/components/button/button.styles.js:19`) |
| `Skeleton` | heroui-native | pulse (opacity 0.5→1, 1000ms) / shimmer built-in |
| `Spinner` | heroui-native | rotación continua |
| Transición `(auth)` ↔ `(tabs)` | Stack nativo de expo-router (`src/app/_layout.tsx:23`) | push/replace nativo de plataforma |

**No anima hoy (cero motion en código propio):**

- `Pressable` crudos sin feedback de press: `components/card.tsx:29` (Card compartido con `onPress`), `app/(tabs)/home.tsx:305` (last-position-card), `app/(tabs)/health.tsx:247` (weight-log-link), `app/(tabs)/weight-log.tsx:126` y `app/(tabs)/meal-schedule.tsx:122` (botones back), `components/pet-switcher.tsx:24` (chips), `components/floating-tab-bar.tsx:62` (tabs).
- Swap skeleton→contenido: aparece de golpe en home (143), food (137), health (137/177/207), meal-schedule (165), weight-log (138).
- Marker del mapa: teleporta a la nueva coordenada en cada poll de 15s (`app/(tabs)/map.tsx:184`, `POLL_MS` en :43).
- Plan generado con "Generate plan": summary + filas aparecen de golpe tras `plan.refetch()` (`meal-schedule.tsx:77`).
- Filas de peso tras submit exitoso (`weight-log.tsx:226-281`).
- Selección de mascota en PetSwitcher: swap instantáneo de borde/fondo.
- Tab switch y navegación a weight-log/meal-schedule: **estas dos pantallas de detalle viven dentro de `(tabs)` como tab screens ocultas — `router.push('/weight-log')` cambia de tab sin transición alguna** (ni push nativo). Teleport de pantalla completa.
- WeightChart (SVG estático), toggle de tema, stats del mapa: sin motion — y así deben quedarse (ver rechazos).

---

## 2. Oportunidades priorizadas

Convenciones para todas: solo `transform`/`opacity`; entering/layout animations de Reanimated 4 corren en UI thread y respetan reduce-motion del sistema automáticamente (se desactivan solas); todo compatible con Expo Go. Imports: `Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'`.

### ALTA

#### A1 — Feedback de press en Pressables crudos (componente `PressableScale`)

- **Destino principal:** `mobile-pet-tracker/src/components/card.tsx:29` (rama `onPress`). Adopción posterior: `home.tsx:305`, `health.tsx:247`, `weight-log.tsx:126`, `meal-schedule.tsx:122`, `pet-switcher.tsx:24`.
- **Hoy:** ningún feedback; los `Button` de HeroUI sí lo tienen → inconsistencia perceptible en las superficies más tocadas.
- **Propósito:** Feedback. **Frecuencia:** decenas/día → sutil e imperceptiblemente rápido.
- **Valores:** propiedad `transform: scale`. Press-in: `withTiming(0.97, { duration: 110, easing: Easing.out(Easing.quad) })`. Release: `withSpring(1, { damping: 20, stiffness: 300 })` (asienta ~200ms, sin bounce visible). Coherente con el 0.985/300ms de HeroUI Button (superficie mayor → 0.97).
- **Thread:** UI (shared value + worklet). **Expo Go:** sí.
- **Implementación (crítico para uniwind):** NO usar `Animated.createAnimatedComponent(Pressable)` con `className` (riesgo de que uniwind no procese el className del componente animado). Patrón seguro: crear `src/components/pressable-scale.tsx` — `Pressable` exterior sin clases visuales (solo `onPressIn/onPressOut/onPress`, accessibility props) y `Animated.View` interior que recibe el `className` mergeado y `useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))`. En `card.tsx`, la rama `onPress` pasa a renderizar `PressableScale` con `mergedClassName`; API pública de `Card` no cambia.

#### A2 — Entrada del plan generado (momento delight)

- **Destino:** `mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx:167` (Card `meal-schedule-summary`) y `:203` (filas `meal-time-row-*`).
- **Hoy:** tras "Generate plan" (acción rara, resultado de IA, el momento más emocional de la app) el contenido aparece de golpe.
- **Propósito:** Delight + prevenir cambio brusco. **Frecuencia:** rara → aquí vive el presupuesto de delight.
- **Valores:** summary: envolver el Card en `Animated.View` con `entering={FadeInDown.springify().damping(16).stiffness(180)}` (~450ms de asentamiento, overshoot leve). Filas: envolver cada Card en `Animated.View` con `entering={FadeInDown.duration(240).delay(Math.min(index, 5) * 60)}` (stagger 60ms, cap a 5). Solo opacity + translateY (FadeInDown parte de ~25px).
- Se dispara también en la primera carga de la pantalla (mismo wrap) — aceptable: pantalla ocasional y hace de puente skeleton→contenido.
- **Thread:** UI (entering). **Expo Go:** sí. No bloquea interacción.

#### A3 — Interpolación del marker del mapa entre polls

- **Destino:** `mobile-pet-tracker/src/app/(tabs)/map.tsx:184-191` (`Marker` → `Marker.Animated` + `AnimatedRegion` de react-native-maps).
- **Hoy:** cada 15s (`POLL_MS`, :43) la coordenada salta; en la pantalla cuyo valor central es "live tracking", el teleport rompe la ilusión de movimiento.
- **Propósito:** Prevenir cambio brusco / historia espacial (la mascota se mueve, no se teletransporta).
- **Valores:** `AnimatedRegion` en un `useRef`; en efecto sobre `[position.lat, position.lng]`: `coord.timing({ latitude, longitude, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start()`. Guard: si el salto supera ~200m (haversine rápido o delta de grados > 0.002), `setValue` directo sin animar (un salto real de señal no debe "volar" por el mapa).
- **Thread:** JS (AnimatedRegion no soporta native driver) — 1 marker cada 15s, coste despreciable; anotado explícitamente. **Expo Go:** sí (react-native-maps viene en Expo Go).
- No tocar los stats (ver rechazos R3).

### MEDIA

#### M1 — Puente skeleton → contenido

- **Destino:** bloques de contenido cargado que hoy reemplazan al Skeleton de golpe:
  - `home.tsx:143` — reemplazar el fragment `<>` del bloque `detail.data?.kind === 'ok'` por `<Animated.View className="gap-4" entering={FadeIn.duration(200)}>` (el ScrollView padre usa `gap: 16`; `gap-4` lo preserva).
  - `food.tsx:138` — mismo patrón en el fragment bajo `loadedPlan !== null`.
  - `health.tsx:177-203` (map de vaccines) y `:207` (weight-card): envolver cada bloque en `Animated.View entering={FadeIn.duration(200)}`.
  - `weight-log.tsx:142` (Card del formulario).
- **Propósito:** Prevenir cambio brusco. **Frecuencia:** ocasional (una vez por visita a pantalla).
- **Valores:** solo `opacity` 0→1, `FadeIn.duration(200)` (easing default de Reanimated). Sin translate: evita empujar layout bajo el skeleton.
- **Thread:** UI. **Expo Go:** sí.

#### M2 — Entrada de filas del weight log (incluye la fila nueva tras submit)

- **Destino:** `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx:242` — envolver cada `HeroUICard` (`weight-row-*`) en `Animated.View` con `entering={FadeInDown.duration(250).delay(Math.min(index, 6) * 40)}`.
- **Hoy:** tras submit exitoso el refetch inserta la fila nueva de golpe; en primera carga la lista aparece de golpe.
- **Propósito:** Prevenir cambio brusco (fila nueva) + entrada de grupo (primera carga, stagger 40ms, cap 6).
- **Detalle clave:** las keys son `entry.id`, así que en el refetch React solo monta la fila nueva → `entering` se dispara únicamente para ella (index 0, delay 0). Un solo cambio cubre ambos casos.
- **Valores:** opacity + translateY (~25px), 250ms. **Thread:** UI. **Expo Go:** sí.

#### M3 — Entrada de pantallas de detalle (weight-log / meal-schedule)

- **Destino:** `weight-log.tsx:114` y `meal-schedule.tsx:110` — envolver el `ScrollView` en `<Animated.View style={{ flex: 1 }} entering={FadeIn.duration(180)}>`.
- **Hoy:** `router.push` hacia estas rutas cambia de tab screen sin transición alguna (viven dentro de `(tabs)`): teleport de pantalla completa en una navegación que semánticamente es un push.
- **Propósito:** Prevenir cambio brusco. **Frecuencia:** ocasional.
- **Valores:** solo `opacity`, 180ms. Sin SlideInRight: sin exit animation simétrica al hacer back (los `exiting` no disparan fiable en navegadores), un slide asimétrico se siente peor que un fade.
- **Nota estructural para el leader (decisión, no parte de esta propuesta):** la solución real es mover estas dos rutas a un Stack nativo (push/pop de plataforma gratis), pero requiere sacar `SelectedPetProvider` del layout de `(tabs)` — cambio de estructura de navegación, no de animación.
- **Thread:** UI. **Expo Go:** sí.

### BAJA

#### B1 — Pulso de selección en PetSwitcher

- **Destino:** `mobile-pet-tracker/src/components/pet-switcher.tsx:37` — envolver el `Avatar` en `Animated.View` con scale animado.
- **Hoy:** el ring/fondo de selección cambia de golpe.
- **Propósito:** Indicación de estado (qué mascota quedó activa). **Frecuencia:** ocasional.
- **Valores:** al pasar `selected` a `true` (useEffect por chip): `scale.value = 0.92; scale.value = withSpring(1, { damping: 10, stiffness: 220 })` — overshoot ~4%, asienta ~300ms. Sin animación al deseleccionar. No animar el color del borde (uniwind classname swap; interpolar color no compensa).
- **Thread:** UI. **Expo Go:** sí.

---

## 3. Rechazos explícitos (qué NO animar y por qué)

- **R1 — `floating-tab-bar.tsx:62`: indicador deslizante, bounce del icono activo o crossfade entre pantallas de tabs.** Navegación core, decenas-a-cientos de usos/día: cualquier motion aquí acumula latencia percibida. El swap Filled/Outline + color instantáneo es la respuesta correcta. (Gate 1: frecuencia.)
- **R2 — `weight-chart.tsx:53`: draw-in del trazo / entrada animada del chart.** Dato de salud que el usuario viene a leer; la decoración estorba. Además animar props de SVG corre en JS thread: coste sin beneficio. (Gate 4: función.)
- **R3 — `map.tsx:231-277`: count-up, pulso o highlight de los stat tiles (Speed/Distance/Updated/GPS) en cada poll.** Se refrescan cada 15s: motion permanente sobre datos en lectura. (Gates 1 y 4.)
- **R4 — Shimmer/pulse custom para skeletons.** heroui-native `Skeleton` ya lo trae animado built-in; no reconstruir. (Ya existe.)
- **R5 — Haptics en press feedback.** `expo-haptics` NO está instalado; añadir una dependencia solo para esto no se justifica hoy. Si el humano aprueba instalarla, el punto de integración es `PressableScale.onPressIn` → `Haptics.selectionAsync()` (funciona en Expo Go).
- **R6 — Transición animada del toggle de tema (`profile.tsx:73`).** Uniwind cambia variables CSS globales; interpolar color por componente es inviable y el snap de tema es el comportamiento estándar de plataforma. (Gate 3/coste.)
- **R7 — Flip Served→Pending de las filas de comida (`food.tsx:182`).** El estado cambia con el reloj, casi siempre con la app cerrada; la transición nunca se vería. (Gate 1: nadie presencia el cambio.)

---

## 4. Veredicto

La app tiene hoy exactamente el motion que le regalan sus librerías y nada más. No necesita mucho: es un dashboard funcional, no una app juguetona. Las tres alta cubren lo que de verdad se nota: (1) el press feedback unificado — la mayor palanca, un componente nuevo de ~30 líneas que iguala las superficies propias con los Button de HeroUI; (2) el momento "Generate plan", único lugar donde el presupuesto de delight está justificado; y (3) el marker del mapa, donde el teleport contradice la propuesta de valor de "live tracking". Todo lo demás es puente de 200ms o menos. Si solo se implementa una: **A1**.

Cada propuesta es autosuficiente para handoff a Codex (archivo:línea, valores exactos, patrón uniwind-seguro en A1, guard de salto en A3, semántica de keys en M2). Conteo: 3 alta, 3 media, 1 baja; 7 rechazos.
