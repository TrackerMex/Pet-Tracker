---
feature: "mobile-weight-draw-and-toasts"
status: approved       # draft | spec_ready | approved
tags: [mobile, ui, motion, spec]
---

# Requisitos — [[mobile-weight-draw-and-toasts]] (#169)

> Notación EARS. Ver [[design]] y [[tasks]]. Base medida: commit **89fe2009**
> (origin/main al abrir la branch `feature/169-mobile-weight-draw-and-toasts`).
> Toda ancla está escrita como `grep -cF '<literal>' <ruta>` (rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa) con su salida a 89fe2009.
> Nada se ancla por número de línea. Lo que depende de `weight-submit` o de las
> clases del botón de alta se volvió a medir tras el merge de #166 (d2b8b0ae), mergeado
> en esta branch en 4d455cab: **todas las anclas de esta spec dan lo mismo**. #166
> solo cambió el className de `weight-submit`, que #169 no toca.

## Alcance cerrado

1. `WeightChart` (`src/components/weight-chart.tsx`) dibuja la línea con una
   animación de trazo (react-native-svg + Reanimated) y respeta reduce motion.
   Salud hereda el cambio sin que se toque ningún fichero de `src/screens/health/`.
2. Peso (`src/screens/weight-log/index.tsx`): peso actual grande + delta del mes
   calculado en cliente, y candado del chip de delta por entrada (que ya existe).
3. Toast pequeño con háptico **solo** tras un alta de peso correcta. Decisión
   del humano del 2026-10-11, literal: «Solo peso (Recommended)». Sin toast de
   recordatorios, sin provider global, sin dependencias nuevas.

## Mediciones previas (premisas verificadas contra 89fe2009)

| Premisa | Ancla | Salida |
|---|---|---|
| La gráfica tiene una sola polilínea | `grep -cF '<Polyline' src/components/weight-chart.tsx` | 1 |
| La gráfica no usa Reanimated hoy | `grep -cF "from 'react-native-reanimated'" src/components/weight-chart.tsx` | 0 |
| Ni `createAnimatedComponent` ni `useReducedMotion` en la gráfica | `grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx` y `grep -cF 'useReducedMotion' src/components/weight-chart.tsx` | 0 y 0 |
| El preset de relleno existe (250 ms, ease-in-out, `ReduceMotion.System`) | `grep -cF 'export const MOTION_FILL_TIMING' src/theme/motion.ts` | 1 |
| Precedente de relleno animado con ese preset (#152 R8) | `grep -cF 'withTiming(pct, MOTION_FILL_TIMING)' src/screens/home/collar-battery-bar.tsx` | 1 |
| Peso no usa hápticos | `grep -cF 'Haptics' src/screens/weight-log/index.tsx` | 0 |
| Precedente de háptico de resultado (#106) | `grep -cF 'Haptics.notificationAsync(' 'src/app/(tabs)/food.tsx'` | 1 |
| Rama `ok` única en el alta | `grep -cF "case 'ok':" src/screens/weight-log/index.tsx` | 1 |
| La card de la gráfica existe | `grep -cF 'testID="weight-chart-card"' src/screens/weight-log/index.tsx` | 1 |
| Cifras tabulares en Peso | `grep -cF 'style={TABULAR_NUMS}' src/screens/weight-log/index.tsx` | 2 |
| Esquinas continuas en Peso | `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/weight-log/index.tsx` | 1 |
| Formateador de variación local | `grep -cF 'function fmtVariation' src/screens/weight-log/index.tsx` | 1 |
| El día civil sale de la zona del perfil | `grep -cF 'civilTodayIso(profileTimeZone)' src/screens/weight-log/index.tsx` | 1 |
| Fila del historial con testID | ``grep -cF 'testID={`weight-row-${entry.id}`}' src/screens/weight-log/index.tsx`` | 1 |
| La API lista los pesos del más nuevo al más viejo (desde la raíz del repo) | `grep -cF '.orderBy(desc(weights.measuredAt), desc(weights.id))' backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts` | 2 |
| `measuredAt` es fecha civil `YYYY-MM-DD` | `grep -cF "measuredAt: '2026-08-21'" src/screens/weight-log/index.test.tsx` | 1 |
| Salud monta la gráfica real | `grep -cF 'WeightChart: jest.fn(actual.WeightChart),' src/screens/health/index.test.tsx` | 1 |

### Premisas falsas o parciales de la entrada de `feature_list.json`

- **El «chip de delta por entrada» no es nuevo.** Cada fila ya pinta tile +
  icono + texto con tono por signo (`bg-danger-soft`/`bg-success-soft`/`bg-default`,
  `TrendUp`/`TrendDown`/`Minus`, `text-danger`/`text-success`/`text-muted`),
  igual que la fila del canvas de Peso. #169 no cambia su aspecto: le da testIDs
  y lo **candada** rama por rama (R8). El delta por entrada lo calcula el
  servidor (`WeightEntry.variation`), no el cliente.
- **Duración del dibujo.** El canvas dibuja la línea en 1200 ms con 200 ms de
  retardo. La carta (`docs/ui-guidelines.md` §Animación) fija 150/250/400 ms en
  `motion.ts`. Manda la carta: se reutiliza `MOTION_FILL_TIMING` (250 ms), el
  preset del relleno de la batería del collar, que es el mismo caso (un trazo
  que avanza en pantalla). Ver la pregunta abierta P4.

## Tabla de literales (pendientes de aprobación, voz B)

Voz B (§7 de la carta de Pingo): serena, en primera persona, sin emoji, con
exclamación solo para celebrar. El valor numérico entra por el marcador
`{{value}}`.

| Clave | `es` | `en` | Usa |
|---|---|---|---|
| `weightLog.weightLogged` | `Anotado. Ya lo puse en la gráfica.` | `Logged. I've added it to the chart.` | R10 |
| `weightLog.monthDelta` | `{{value}} este mes` | `{{value}} this month` | R6, R7 |

Ejemplo renderizado de `monthDelta`: `+0.4 kg este mes` / `+0.4 kg this month`.
El valor sale de `fmtVariation`, que no cambia.

## Requisitos funcionales

### R1 — La línea de la gráfica se dibuja al montarse

WHEN `WeightChart` monta la gráfica con 2 o más entradas y reduce motion está
apagado, THE SYSTEM SHALL dibujar la polilínea (testID `weight-chart-line`) con
la prop estática `strokeDasharray = [L, L]` y la prop animada
`strokeDashoffset = L · (1 − p)`, donde:

- `L` es la suma de las longitudes de sus segmentos en unidades del `viewBox`
  `0 0 100 40`;
- `p` es un shared value que parte de `0` y se anima con **una** llamada
  `withTiming(1, MOTION_FILL_TIMING)` (la identidad del objeto, no una copia).

Valores esperados:

- Primer frame (con un doble de `withTiming` que deja `p` en su origen):
  `strokeDashoffset = L`. Al final: `strokeDashoffset = 0`.
- Fixture de tres pesos crecientes (puntos `0,36 50,20 100,4`):
  `L = 2·√2756 ≈ 104.9952` (aserción con `expect.closeTo(104.9952, 3)`).
- Fixture de dos pesos iguales (puntos `0,20 100,20`): `L = 100` exacto.
- El área (`Polygon`) no se anima.

### R2 — Los puntos aparecen con el mismo progreso

WHEN la línea se dibuja según R1, THE SYSTEM SHALL:

- envolver los `Circle` de los puntos en un grupo animado con testID
  `weight-chart-points`;
- darle a ese grupo la prop animada `opacity = p` (el mismo shared value de R1):
  `0` en el primer frame y `1` al final;
- mantener dentro del grupo exactamente un `Circle` por entrada.

### R3 — Bajo reduce motion la gráfica sale completa desde el primer frame

WHILE `useReducedMotion()` devuelve `true`, THE SYSTEM SHALL:

- arrancar `p` en `1`;
- NOT llamar a `withTiming`;
- mostrar la línea con `strokeDashoffset = 0` y el grupo de puntos con
  `opacity = 1`, también cuando el doble de `withTiming` dejaría `p` en su
  origen.

### R4 — Cuándo se vuelve a dibujar

- **R4a** — WHEN cambian las entradas mientras la gráfica sigue con 2 o más
  entradas, THE SYSTEM SHALL:
  - recalcular `strokeDasharray` con la nueva `L`;
  - mantener `strokeDashoffset = 0`;
  - NOT volver a llamar a `withTiming`.
- **R4b** — WHEN las entradas pasan de menos de 2 a 2 o más, THE SYSTEM SHALL
  reproducir el dibujo de R1 (una llamada a `withTiming`).
- **R4c** — WHEN las entradas pasan de 2 o más a menos de 2 y vuelven a 2 o
  más, THE SYSTEM SHALL reproducir el dibujo otra vez (dos llamadas en total).

### R5 — Delta del mes calculado en cliente

THE SYSTEM SHALL exponer
`monthlyWeightDelta(entries: WeightEntry[], todayIso: string): number | null`
en `src/utils/monthly-weight-delta.ts`. Es una función pura: recibe las
entradas en el orden de la API (la más nueva primero) y devuelve el delta así:

1. `monthStart = todayIso.slice(0, 7) + '-01'`.
2. `inMonth` = las entradas con `measuredAt >= monthStart` (comparación de
   cadenas `YYYY-MM-DD`). Si está vacío, devuelve `null`.
3. `newest = inMonth[0]`.
4. `baseline` = la primera entrada (en el orden de la API) con
   `measuredAt < monthStart`. Si no hay ninguna, la última de `inMonth`.
5. Si `baseline` es `newest`, devuelve `null`.
6. Si no, devuelve `Math.round((newest.weightKg − baseline.weightKg) · 100) / 100`.
   `0` es un valor válido, no `null`.

La tabla cerrada de casos está en [[tasks]] §T5 y cruza mes y año.

### R6 — Resumen del peso en la card de la gráfica

WHEN la lista de pesos llega con `kind: 'ok'` y al menos una entrada, THE SYSTEM
SHALL pintar dentro de `weight-chart-card`, antes de `weight-chart` /
`weight-chart-empty`, un `View` con testID `weight-summary`. Ese `View` contiene:

- un `Text` con testID `weight-current`, className
  `text-3xl font-black text-foreground` y `style={TABULAR_NUMS}`, cuyo texto es
  `` `${entries[0].weightKg} kg` `` (por ejemplo `12.4 kg`);
- si `monthlyWeightDelta(entries, civilTodayIso(profileTimeZone))` no es `null`,
  una fila con testID `weight-month-delta` (className
  `flex-row items-center gap-1.5`). La fila lleva el icono de R7 y un `Text`
  con testID `weight-month-delta-text`, `style={TABULAR_NUMS}` y el texto
  `t('weightLog.monthDelta', { value: fmtVariation(delta) })`.

IF la lista llega con cero entradas THEN THE SYSTEM SHALL NOT pintar
`weight-summary`.

IF el delta es `null` THEN THE SYSTEM SHALL pintar `weight-current` y NOT
pintar `weight-month-delta`.

El día de referencia es el de la zona del perfil. A `2026-10-01T05:00:00Z`,
con las entradas `2026-09-30 12.4`, `2026-09-29 12.0` y `2026-08-31 11.0`:

- la zona `Pacific/Pago_Pago` (aún es 30 de septiembre) muestra
  `+1.4 kg este mes`;
- la zona `Pacific/Kiritimati` (ya es 1 de octubre) no muestra
  `weight-month-delta`, porque octubre no tiene entradas.

### R7 — Tono del delta del mes: color + icono + texto

THE SYSTEM SHALL dar a `weight-month-delta` estas decisiones por rama, con los
tokens que ya usan las filas:

| Rama | Texto (`es`) | className de `weight-month-delta-text` | Icono (size 15) | Color del icono |
|---|---|---|---|---|
| delta > 0 | `+0.4 kg este mes` | `text-sm font-semibold text-danger` | `TrendUp` | `danger` |
| delta < 0 | `-0.3 kg este mes` | `text-sm font-semibold text-success` | `TrendDown` | `success` |
| delta = 0 | `0 kg este mes` | `text-sm font-semibold text-muted` | `Minus` | `muted` |

Cada rama SHALL NOT llevar las clases de tono de las otras dos. El icono es
decorativo: el signo va en el texto.

### R8 — Candado del chip de delta por entrada

THE SYSTEM SHALL añadir a cada fila del historial dos testIDs, sin cambiar
classNames, iconos ni texto:

- `` `weight-row-${entry.id}-tone` `` en el tile del icono;
- `` `weight-row-${entry.id}-delta` `` en el texto de la variación.

Cada rama SHALL quedar así:

| `variation` | El tile contiene | El texto contiene | Icono | Color | Texto |
|---|---|---|---|---|---|
| `0.4` | `bg-danger-soft` | `text-danger` | `TrendUp` | `danger` | `+0.4 kg` |
| `-0.2` | `bg-success-soft` | `text-success` | `TrendDown` | `success` | `-0.2 kg` |
| `0` | `bg-default` | `text-muted` | `Minus` | `muted` | `0 kg` |
| `null` | `bg-default` | `text-muted` | `Minus` | `muted` | `—` |

Cada rama SHALL NOT llevar las clases de tile ni de texto de las otras ramas.

### R9 — Catálogo: dos claves nuevas

THE SYSTEM SHALL añadir `weightLog.weightLogged` y `weightLog.monthDelta` a los
bloques `en` y `es` de `src/i18n/catalog.ts` con los literales exactos de la
Tabla de literales. Además:

- el candado de recuento de `src/providers/__tests__/language-provider.test.tsx`
  SHALL subir en 2;
- las dos claves SHALL quedar registradas en `specs/mobile-ui-language/design.md`
  en una sección nueva `### §2.N — Añadidos por #169 — Peso`, con el formato
  de `§2.23`. N es la siguiente libre: a 89fe2009,
  `grep -c '^### §2\.' specs/mobile-ui-language/design.md` da 23 (N = 24).
  Tras el merge de #166 (d2b8b0ae) sigue dando 23 (N = 24).

### R10 — Toast y háptico tras un alta correcta

WHEN `createWeight` resuelve `{ kind: 'ok' }`, THE SYSTEM SHALL hacer dos cosas
en el mismo bloque síncrono de la rama `case 'ok':`.

**El toast.** Mostrar un toast con testID `weight-toast`:

- es el último hijo del `KeyboardAvoidingView`;
- className
  `absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm`;
- `pointerEvents="none"` y `accessibilityLiveRegion="polite"`;
- contiene un icono `Check` (size 16, color `success`) y un `Text` con
  className `text-sm font-semibold text-foreground` y el texto
  `t('weightLog.weightLogged')` (`Anotado. Ya lo puse en la gráfica.` en `es`).

**El háptico.** Llamar **una vez** a
`Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`.

Mientras la promesa de `createWeight` no resuelve, el toast SHALL NOT existir y
el háptico SHALL NOT haberse llamado.

### R11 — Ni toast ni háptico fuera de la rama ok

IF el alta termina en cualquier otra rama THEN THE SYSTEM SHALL NOT mostrar
`weight-toast` ni llamar a `Haptics.notificationAsync`. Hay un candado por rama:

| Rama | Cómo se provoca | Señal de que la rama ya terminó |
|---|---|---|
| peso no numérico | `weight-input` = `abc` | `Introduce un peso válido` visible; `createWeight` no llamado |
| `validation` | `{ kind: 'validation', errors: [{ path: 'weightKg', message: 'weightKg must be positive' }] }` | `weightKg must be positive` visible |
| `forbidden` | `{ kind: 'forbidden' }` | `Solo el dueño puede registrar pesos` visible |
| `unreachable` | `{ kind: 'unreachable', message: 'x' }` | `No se pudo conectar con el servidor` visible |
| `unauthorized` | `{ kind: 'unauthorized' }` | `signOut` llamado |
| `error` | `{ kind: 'error' }` | `Algo salió mal` visible |
| `missing-config` | `{ kind: 'missing-config' }` | `Algo salió mal` visible |
| excepción | `createWeight` rechaza con `new Error('boom')` | `Algo salió mal` visible |

### R12 — El toast se va solo

WHEN han pasado `WEIGHT_TOAST_MS = 2500` ms desde que el toast se mostró, THE
SYSTEM SHALL retirarlo. Debe seguir visible a los 2400 ms y estar ausente a los
2500 + `MOTION_FEEDBACK_MS` = 2650 ms.

WHEN llega otra alta correcta con el toast visible, THE SYSTEM SHALL reiniciar
la cuenta y disparar otro háptico. Con la segunda alta a los 2000 ms:

- el toast sigue visible a los 4400 ms (2400 ms después de la segunda);
- ha desaparecido a los 4650 ms;
- `Haptics.notificationAsync` lleva 2 llamadas.

### R13 — Movimiento del toast

THE SYSTEM SHALL montar el toast como `Animated.View` con
`entering={FadeIn.duration(MOTION_TRANSITION_MS)}` y
`exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}`: solo opacidad, y la salida
más rápida que la entrada.

THE SYSTEM SHALL NOT pasarles `ReduceMotion.Never`. Así, bajo reduce motion el
sistema omite el fundido, porque el builder hereda `ReduceMotion.System`.

### R14 — Prueba de humo humana en dev build de Android

WHEN el reviewer ha aprobado la implementación, un humano SHALL comprobar estos
puntos en el **dev build de Android** (no Expo Go) y firmar en la casilla de R14
de §Aprobación:

1. En Peso y en Salud, la línea se dibuja de izquierda a derecha al abrir, los
   puntos aparecen con ella y el área está quieta.
2. Con «Quitar animaciones» activado en Ajustes → Accesibilidad, la gráfica
   sale completa sin dibujo y el toast aparece sin fundido.
3. Al registrar un peso, el toast aparece arriba, no tapa el formulario ni
   bloquea toques y se va solo en unos 2,5 s. El teléfono vibra una vez, a la
   vez que aparece el toast.
4. Un alta con error (por ejemplo, sin red) no vibra ni muestra el toast.
5. El resumen muestra el peso actual grande y el delta del mes con su color.

## Candados agregados que se mueven

| Candado | Ancla a 89fe2009 | Salida | Cambio | R |
|---|---|---|---|---|
| Recuento de claves | `grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx` | 1 | pasa a `- 1 // #159 R2`, más una línea nueva `+ 2, // #169 R9` | R9 |
| Filas de Peso en la tabla de copy | `grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts` | 17 | 19: una en R6 y una en R10, dentro de `R5_HEALTH` | R6, R10 |
| Longitud de `R5_HEALTH` | `grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2);' src/__tests__/ui-language.test.ts` | 1 | `+ 1` en R6 y `+ 1` en R10, con los comentarios `#169 R6` y `#169 R10` | R6, R10 |
| `TABULAR_NUMS` en Peso | `grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts` | 1 | `2 + 2], // #169 R6` | R6 |
| Suma de `TABULAR_NUMS` | `grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts` | 1 | `+ 2` y `#169 R6` en el comentario | R6 |
| `CONTINUOUS_CORNER` en Peso | `grep -cF "[join('screens', 'weight-log', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts` | 1 | Sin cambio: el toast es una cápsula (`rounded-full`) y #62 R14 prohíbe `CONTINUOUS_CORNER` en cápsulas | — |
| `SCREEN_FILES` | — | — | Sin cambio: no hay pantalla nueva; el toast vive en `weight-log/index.tsx` | — |
| Exports de `motion.ts` | `grep -cF "'MOTION_BLINK_TIMING'," src/theme/__tests__/motion.test.ts` | 1 | Sin cambio: no hay token nuevo | — |
| `rounded-xl bg-accent` (botón de alta) | `grep -cF 'rounded-xl bg-accent' src/screens/weight-log/index.tsx` | 1 | Sin cambio por #169. Tras el merge de #166 (d2b8b0ae) sigue dando 1: ahora la línea es `rounded-xl bg-accent border-b-4 border-black/25` | — |
| `Button` en Peso | `grep -cF '<Button' src/screens/weight-log/index.tsx` | 3 | Sin cambio: #169 no añade ningún `Button`, `Pressable` ni primario. El toast es un `Animated.View` con `pointerEvents="none"`, y el resumen y los chips son `View`/`Text`. Así no mueve la lista cerrada de secundarios neutros de #166 R3 ni el recuento de `border-b-4` de #166 R2, #62 R1 y #98 R10. Tras el merge de #166 (d2b8b0ae) siguen dando 3 y 0, y deben dar lo mismo antes y después de #169 | — |
| `Pressable` en Peso | `grep -cF '<Pressable' src/screens/weight-log/index.tsx` | 0 | Sin cambio (ver la fila anterior) | — |

Guardas de clases contrastadas; todas siguen verdes con lo prescrito:

- `legibility-classnames`: no se usa `text-accent` suelto, ni `text-warning`,
  ni `useThemeColors` con `'accent'`.
- `design-drift`: sin clases con corchetes, sin hex y sin `StyleSheet`.
- `consistency-classnames` #62 R4: sin `rounded-2xl`, `rounded-lg`,
  `rounded-md` ni `rounded-sm`.
- `consistency-classnames` #62 R14: la cápsula no lleva `CONTINUOUS_CORNER`.

## Fuera de alcance

- La píldora de delta de Salud y cualquier fichero de `src/screens/health/`.
  Al cerrar,
  `git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/src/screens/health`
  SHALL salir vacío.
- El toast de recordatorios y cualquier otro toast (decisión «Solo peso
  (Recommended)»).
- Los classNames de `weight-submit` y del formulario (#166).
- El formato numérico y el de fechas: `0 kg` frente a `0.0 kg`, el signo menos
  Unicode y los decimales fijos. `fmtVariation` no cambia.
- Un provider global de toasts, una cola de toasts y el anuncio de VoiceOver en
  iOS (`AccessibilityInfo.announceForAccessibility`).
- Cualquier acción en el toast («Deshacer», cerrar a mano) y cualquier `Button`
  o `Pressable` nuevo en Peso. Ver §Candados agregados: los botones son de #166.
- Dependencias nuevas: `expo-haptics`, Reanimated y react-native-svg ya están
  instaladas.
- Animar el área de la gráfica o la entrada de las filas del historial.

## Preguntas abiertas (cada una con su valor por defecto)

| # | Pregunta | Por defecto |
|---|---|---|
| P1 | Literales ES/EN de la tabla | Los de la tabla. Alternativa con celebración: `¡Anotado! Ya lo puse en la gráfica.` / `Logged! I've added it to the chart.` |
| P2 | Semántica del color: ¿subir de peso es rojo? | Sí: sube = `danger`, baja = `success`, igual = `muted`, como las filas y el canvas. Alternativa: neutro para todo |
| P3 | ¿Qué es «este mes»? | El mes natural en la zona del perfil. Base = el último peso antes del día 1 o, si no hay, el más viejo del mes. Sin una base distinta, el delta se oculta. Un delta 0 se muestra como `0 kg este mes`. Alternativa: los últimos 30 días |
| P4 | Duración del dibujo | `MOTION_FILL_TIMING` (250 ms, ease-in-out). Alternativas: 400 ms (`MOTION_SURFACE_MS`, con un token nuevo) o los 1200 ms + 200 ms del canvas |
| P5 | Duración del toast | 2500 ms |
| P6 | ¿Peso actual grande en la card? | Sí, como en el canvas |
| P7 | `0 kg` frente a `0.0 kg` y el signo menos Unicode | Fuera de alcance; se queda `fmtVariation` |

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-11) ← gate obligatorio antes de implementar

### Aprobación de R14 (prueba de humo en dev build de Android)

- [ ] Smoke de R14 superado por humano (fecha: ____, dispositivo: ____)

## Enmienda E1 — candados de R1, R2, R3 y R5 (revisión rechazada, 2026-10-12)

> Escrita el 2026-10-12 sobre la spec aprobada (firma `ccb4ad61`), tras la
> revisión **rechazada** (`progress/review_mobile-weight-draw-and-toasts.md`,
> sobre `dbe183a6`, punta de Codex `f314978d`), por sus bloqueantes E2 y E3.
> La ensancharon:
>
> - el leader, con dos huecos más de R5 (M3c y M3d);
> - el barrido del reviewer sobre `02da4c11`, con cuatro más (H1, H2, H2b y
>   H3). Está en la misma revisión, en §Barrido de la Enmienda E1.
>
> No toca D1-D7, ni el texto de R1-R14, ni la firma original. **Solo tests**:
> la producción de `f314978d` es correcta y queda idéntica. Su casilla va
> **sin marcar**: el humano reabre el gate solo para esta enmienda.
>
> El bloqueante E1 del reviewer (columna «Test» de `traceability.md` en
> «pendiente») no es de requisitos. Lo cierra el leader sin tocar código.

### El hecho medido

**R1 y R2 (E2 del reviewer, ensanchado).** R1 y R2 tienen cuatro cláusulas
que los `it` existentes no vigilan:

- `strokeDashoffset = L · (1 − p)` (R1) y `opacity = p` (R2): T1 y T2 solo
  fijaron el primer frame (`p = 0`) y el final (`p = 1`).
- «`L` es la suma de las longitudes de sus segmentos» (R1): las dos fixtures
  tienen segmentos alineados e iguales, así que la cuerda y
  `(n − 1) · primer segmento` dan la misma `L`.
- «`p` parte de `0`» (R1): el `it` del primer frame hace que el doble de
  `withTiming` devuelva `0`, así que **impone** el valor que espera en vez de
  dejar `p` en su origen.

| Id | Mutación en `src/components/weight-chart.tsx` | Qué rompe en producción | Estado en `f314978d` |
|---|---|---|---|
| M1 | `strokeDashoffset: progress.get() >= 1 ? 0 : L` y `opacity: progress.get() >= 1 ? 1 : 0` | la gráfica aparece de golpe al final, sin dibujarse | **verde** 15/15 |
| M2 | `L * (1 - progress.get()) ** 2` y `progress.get() ** 2` | el dibujo sigue otra curva | **verde** 15/15 |
| H1 | `L` = la cuerda del primer punto al último | con pesos que suben y bajan, el trazo no cubre la línea o sobra | **verde** 17/17 (reviewer) |
| H1b | `L` = `(n − 1)` · el primer segmento | ídem | **verde** 17/17 (reviewer) |
| H2 | `useSharedValue(1)` en vez de `useSharedValue(reducedMotion ? 1 : 0)` | la línea nunca se dibuja: anima de 1 a 1 | **verde** 17/17 (reviewer) |

**R3 (H2b del reviewer, preexistente).** «Arrancar `p` en `1`» no lo vigila
ningún `it`. RNTL vacía los efectos dentro de `render`, así que no se ve un
`p` que arranca en 0 y salta a 1 en el efecto:

| Id | Mutación en `src/components/weight-chart.tsx` | Qué rompe en producción | Estado en `f314978d` |
|---|---|---|---|
| H2b | `useSharedValue(0)` y el efecto hace `progress.set(reducedMotion ? 1 : withTiming(…))` | bajo reduce motion, el primer frame pinta la gráfica oculta y salta a completa | **verde** 17/17 (reviewer) |

**R5 (E3 del reviewer, ensanchado).** R5 elige **por posición**:

- `newest = inMonth[0]` (paso 3);
- la base es la **primera** anterior al mes en el orden de la API y, si no
  hay, la **última** de `inMonth` (paso 4);
- el paso 5 compara **identidad** (`baseline` es `newest`);
- el paso 6 redondea a **2** decimales.

La tabla cerrada de T5 no separa posición de valor, ni identidad de fecha. Y
todas sus filas esperan como mucho 1 decimal:

| Id | Mutación en `src/utils/monthly-weight-delta.ts` | Qué rompe | Estado en `f314978d` |
|---|---|---|---|
| M3a | `newest` = la entrada más pesada de `inMonth` | delta contra el pico del mes, no contra el último peso | **verde** 11/11 (reviewer) |
| M3b | la base de respaldo = la más ligera de `inMonth` | delta contra el mínimo del mes | **verde** 11/11 (reviewer) |
| M3c | la base = la **más pesada** anterior al mes, no la primera | delta contra un peso antiguo cualquiera | **verde** 11/11 (leader) |
| M3d | el paso 5 compara `measuredAt` en vez de identidad | dos pesos del mismo día ocultan el delta | **verde** 11/11 (leader) |
| H3 | redondeo a 1 decimal (`* 10) / 10` o `toFixed(1)`) | `weight_kg` es `numeric(5,2)`: `+0.04 kg este mes` en `text-danger` pasa a `0 kg este mes` en `text-muted` (la rama de R7 para 0) | **verde** 14/14 (reviewer) |

Cada «verde» lo midió fuera del árbol quien sale entre paréntesis (o el
leader, si no sale nadie). M3c y M3d salieron al ensanchar cada candado a su
cláusula entera (pasos 3, 4 y 5). H1, H2, H2b y H3, en el barrido del
reviewer sobre la enmienda.

### Decisión: E1 añade tests a R1, R2, R3 y R5, no reescribe su texto

El texto de R1, R2, R3 y R5 ya dice lo correcto. La enmienda solo añade
candados:

- **R1**, tres `it` en `describe('#169 R1: …')`:
  - `p = 0.25`: el doble de `withTiming` devuelve `0.25`, con la fixture de
    tres pesos. Espera `strokeDashoffset = 0.75 · L ≈ 78.7464`
    (`expect.closeTo(78.7464, 3)`; `0.75 · 104.99523798… = 78.74642849…`).
  - **Suma de segmentos**: tres pesos no alineados, `12`, `14` y `10` en el
    orden de la API, que dan los puntos `0,36 50,4 100,20`. Espera
    `strokeDasharray = [L, L]` con `L = √3524 + √2756 ≈ 111.8609`
    (`expect.closeTo(111.8609, 3)`). La cuerda daría `101.2719` y el doble del
    primer segmento `118.7266`.
  - **Origen de `p`**: el doble de `withTiming` devuelve una animación que
    termina en su valor de partida (`onStart` copia el valor actual,
    `onFrame` termina en el primer frame). Es el «doble que deja `p` en su
    origen» que ya nombra R1. Espera `strokeDashoffset = L` (`104.9952`) y
    `opacity = 0` en `weight-chart-points`. Vigila cualquier origen distinto
    de `0`, y también el origen de R2.
- **R2**, un `it` con el doble de `0.25`. Espera `opacity = 0.25` en
  `weight-chart-points`.
- **R3**, un espía de paso sobre `useSharedValue` en el doble de Reanimated
  (registra el valor inicial y devuelve el real) y un `it` que, bajo reduce
  motion, espera que se haya llamado con `1`.
  - Bajo el wrapper, el `ToastProvider` de heroui-native también llama a
    `useSharedValue`, con `{}` y `0`. Por eso el `1` no es tautológico hoy.
  - **Techo conocido**: lo sería si un proveedor del wrapper empezase a
    llamarlo con `1`.
  - Por la misma razón, el origen `0` de R1 no se vigila con este espía
    sino con el `it` del origen de `p`.
- **R5**, cuatro filas nuevas en la tabla cerrada, todas con hoy `2027-01-05`:

  | # | Entradas (`measuredAt` `weightKg`) | Esperado | Qué candada | Mutación que cae |
  |---|---|---|---|---|
  | 12 | `2027-01-04 12.0`, `2027-01-02 12.3`, `2027-01-01 12.1` | `-0.1` | sin anterior al mes, el peso baja: newest = `inMonth[0]` (no la más pesada) y la base = la última (no la más ligera) | M3a (`0.2`), M3b (`null`) |
  | 13 | `2027-01-04 12.4`, `2026-12-31 11.8`, `2026-12-10 12.0` | `0.6` | base = la **primera** anterior al mes, aunque no sea la más pesada | M3c (`0.4`) |
  | 14 | `2027-01-04 12.4`, `2027-01-04 12.3` | `0.1` | dos pesos del mismo día son dos entradas: el paso 5 es identidad, no fecha | M3d (`null`) |
  | 15 | `2027-01-04 12.04`, `2026-12-31 12.0` | `0.04` | el redondeo es a 2 decimales | H3 (`0`) |

Los `it` y las filas que ya existen no cambian.

### Cómo se prueba que los candados vigilan (CHECKPOINTS.md C4, quinto punto)

Es un candado sobre código **ya correcto**. Por eso su rojo es una **mutación
de producción**: se versiona en el commit rojo y se revierte en el verde.
Nunca una mutación del doble.

| Rojo | Mutación versionada | Qué falla | Recuento |
|---|---|---|---|
| R1 y R2 | M1 + H1 + H2 a la vez | los cuatro `it` nuevos de R1 y R2, ninguno más | `4 failed, 15 passed, 19 total` |
| R3 | H2b | el `it` nuevo de R3, ninguno más | `1 failed, 19 passed, 20 total` |
| R5 | M3a + M3b + M3c + M3d + H3 a la vez | las filas 12 a 15, ninguna más | `4 failed, 11 passed, 15 total` |

H2 y H2b tocan la misma línea, así que van en rojos distintos.

Después vienen siete sondas sin commit, sobre el árbol verde, cada una
restaurada antes de la siguiente:

- M2 y H1b;
- M3a, M3b, M3c y M3d **por separado**, cada una con su fila;
- `toFixed(1)` (la segunda forma de H3).

tasks.md §Enmienda E1 da las mutaciones literales y los recuentos.

Medido por el leader fuera del árbol sobre `02da4c11`, con jest, `tsc` y
eslint, con el texto literal de tasks.md:

- los `it` y las filas nuevos nacen verdes;
- cada mutación los pone en rojo **por aserción** y no pone en rojo ningún
  otro;
- con las mutaciones de cada rojo, `tsc` y eslint dan 0;
- `GRAFICA` pasa de 140 a 145, `GUARDAS` sigue en 92 y `BASE` pasa de 363 a
  368.

### Aprobación de la Enmienda E1

- [ ] Enmienda E1 aprobada por humano (fecha: ____, vía Notion) ← gate obligatorio antes de la Reanudación 5 de Codex
