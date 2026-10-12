---
feature: "mobile-celebrations-and-living-empty"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui, motion]
---

# Diseño — [[mobile-celebrations-and-living-empty]] (#171)

> Ver [[requirements]] para los requisitos y
> [[../../docs/architecture|architecture]] para las capas. Todo vive en la
> capa de presentación de `mobile-pet-tracker/`. No hay dominio, backend ni
> infraestructura nuevos. Rige [[../../docs/ui-guidelines|ui-guidelines]]
> (§1 superficies, §2 tipografía, §7 movimiento y voz). Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa. Base medida:
> `origin/main` 89fe2009.
>
> **Regla de anclas:** toda ancla es un `grep -cF` con su salida medida en la
> base. No hay números de línea. Al arrancar, Codex re-ejecuta cada ancla y,
> si una no da lo declarado, **para** y lo reporta en
> `progress/impl_mobile-celebrations-and-living-empty.md` sin adaptar.

## 1. Overlay con `Modal`, no ruta modal (R2, R3, R4)

`Celebration` es un componente que pinta un `Modal` de React Native a
pantalla completa (`animationType="fade"`, `statusBarTranslucent`,
`navigationBarTranslucent`). La pantalla que lo dispara lo monta
condicionalmente. No es una ruta de Expo Router.

Por qué:

- **Datos.** Modelo, ESN y nombre de la mascota viven ya en el estado de la
  pantalla. Una ruta obligaría a pasarlos por parámetros de URL, ESN
  incluido, o a releerlos de la caché.
- **Cubre la cabecera.** El `Modal` tapa el header del stack y la tab bar
  sin tocar `_layout.tsx`.
- **Candados.** `SCREEN_FILES` de `src/__tests__/ui-copy-table.ts` no
  cambia (+0) porque no hay fichero de ruta nuevo. Los tests de pantalla
  mockean `expo-router`, y el doble de `Modal` de la preset de jest pinta
  sus hijos, así que las suites actuales de Vincular siguen encontrando
  `pairing-ready`, `ready-model`, `ready-esn`, `ready-map` y `ready-done`.
- **Atrás de Android.** `onRequestClose` va al secundario: equivale a «Listo»
  en Vincular y a «Ahora no» en Añadir mascota (R2.2, R3.2, R5.3).

## 2. Cómo se deriva «primera mascota» (R4)

- Añadir mascota añade
  `const pets = useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') });`.
  Es la misma clave y la misma función que ya usan Vincular e Inicio, así que
  normalmente la lista llega de caché sin petición extra. `listPets` se suma
  al import existente de `'../../api/pets'`, y `petKeys` se importa de
  `'../../api/query-keys'`, como en Vincular. `useQuery` viene de
  `@tanstack/react-query`. Ancla:
  `grep -cF "queryFn: () => listPets(baseUrl, token ?? '')," src/screens/pairing/index.tsx`
  → `1`.
- En el manejador de guardar, **antes** de `await createPet(...)`:
  `const wasFirst = pets.data?.kind === 'ok' && pets.data.pets.length === 0;`.
  Es una foto fija: la invalidación de `petKeys.list()` que sigue al alta no
  la cambia.
- Tras `ok`, y tras la subida de foto si la hay y va bien:
  - si `wasFirst`, se guarda el nombre en estado,
    `setCelebratePetName(result.pet.name)`, y se pinta `Celebration`;
  - si no, se mantiene `router.back()` exactamente como hoy.
- Si la lista no estaba en `ok` (cargando o error), se trata como «no es la
  primera» (R4.5). Así no se celebra por error a quien ya tiene mascotas y
  tiene la red lenta.
- El caso «borró todas fuera de la app» vuelve a celebrar. Está aceptado en
  P2.

## 3. Composición y clases (R2)

```
Modal testID="{id}-modal"
└─ View testID="{id}"  className="flex-1 items-center gap-4 bg-surface-secondary px-6"
   │                   style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 24 }}
   ├─ View testID="{id}-confetti" className="absolute inset-0" pointerEvents="none" (a11y oculto)  [solo sin reduce motion]
   │  └─ 24 × ConfettiPiece testID="{id}-confetti-{i}"
   │       └─ View className="<SHAPES[floor(i/8)]> <COLORS[i%6]>"
   ├─ View testID="{id}-hero" style={{ width: 200, height: 200 }}
   │  ├─ Animated.View testID="{id}-pingo" style={[pingoStyle, { width: 200, height: 200 }]}
   │  │  └─ Image testID="{id}-pose" source={require('../../assets/images/pingo-celebrate.webp')}
   │  │         style={{ width: 200, height: 200 }} contentFit="contain" accessible={false}
   │  └─ Animated.View testID="{id}-badge" style={[badgeStyle, { position: 'absolute', right: 0, bottom: 0 }]} (a11y oculto)
   │     └─ View className="size-14 items-center justify-center rounded-full border-4 border-surface-secondary bg-accent"
   │        └─ Text className="text-2xl font-black text-accent-foreground" ✓
   ├─ Text testID="{id}-title"  className="text-center text-3xl font-black text-foreground"
   ├─ Text testID="{id}-body"   className="text-center text-base text-muted" selectable
   ├─ View testID="{id}-details" className="flex-row flex-wrap justify-center gap-2"  [solo si details.length > 0]
   │  └─ por detalle: View className="flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1.5"
   │       ├─ Text className="text-xs font-bold text-muted" {label}
   │       └─ Text testID={detail.testID} className="text-xs font-bold text-foreground" selectable {value}
   └─ View testID="{id}-actions" className="mt-auto w-full gap-3"
      ├─ Button primario (R14.1)
      └─ Button secundario (R14.2)
```

- `insets` sale de `useSafeAreaInsets()` (`react-native-safe-area-context`,
  ya instalado). El `Modal` con `statusBarTranslucent` dibuja bajo la barra,
  y el padding superior lo compensa.
- La insignia usa `bg-accent` + `text-accent-foreground`: es un acento
  sólido, el ✓ del canvas. **No** usa `bg-accent-soft`, para no mover el
  inventario de `consistency-classnames` (§7).
- El alto de ventana del confeti sale de `useWindowDimensions().height`. Los
  tests lo leen con `Dimensions.get('window').height`.
- Ningún literal hex, ni clase con corchetes, ni `StyleSheet`, ni sombra
  (R13.1). Los `style` numéricos (200, 0, 'absolute') son de layout, como en
  `EmptyState`, y `MEALS_BAR_STYLE_ESCAPES` no los veta.

### 3.1 Vincular (R3)

- El bloque `phase === 'ready' && readyDevice && selectedPet ? (<View testID="pairing-ready" …>…</View>) : null`
  se sustituye por
  `phase === 'ready' && readyDevice && selectedPet ? (<Celebration testID="pairing-ready" … />) : null`.
  Anclas:
  - `grep -cF 'testID="pairing-ready"' src/screens/pairing/index.tsx` → `1`
    antes y después;
  - `grep -cF "<Celebration" src/screens/pairing/index.tsx` → `0` antes y
    `1` después.
- `details`:
  `[{ testID: 'ready-model', label: t('pairing.model'), value: readyDevice.model ?? '—' }, { testID: 'ready-esn', label: t('pairing.esn'), value: readyDevice.esn ?? '—' }]`.
- `primary`: `{ testID: 'ready-map', label: t('pairing.viewOnMap'), onPress: () => leaveReady('map') }`.
  `secondary`: `{ testID: 'ready-done', label: t('pairing.done'), onPress: () => leaveReady('back') }`.
  `leaveReady` no cambia.
- Se va el único `<Pressable` del fichero
  (`grep -cF "<Pressable" src/screens/pairing/index.tsx` → `1` antes, `0`
  después). Por eso `Pressable` sale del import de `react-native`, o lint
  falla por `no-unused-vars`. `Card` (4 usos) y `DeviceRow` (7 usos)
  siguen usándose en otras fases y sus imports se quedan.

### 3.2 Añadir mascota (R4, R5)

- Estado nuevo: `const [celebratePetName, setCelebratePetName] = useState<string | null>(null);`.
- Al final del JSX de la pantalla:
  `{celebratePetName !== null ? (<Celebration testID="add-pet-celebration" … />) : null}`.
  Va sin `details`.
- `primary`: `{ testID: 'add-pet-celebration-pair', label: t('addPet.celebratePair'), onPress: () => router.replace('/pairing') }`.
- `secondary`: `{ testID: 'add-pet-celebration-later', label: t('addPet.celebrateLater'), onPress: () => router.back() }`.
- `router.replace('/pairing')` usa el mismo `href` que Inicio y Mapa ya pasan
  sin cast. Ancla:
  `grep -cF "router.push('/pairing')}" src/screens/home/index.tsx` → `1`.

## 4. Movimiento (R6–R9)

Gate de la skill expo-animation: tier «raro / primera vez», propósito
**delight**, más **feedback** en el háptico. Todo corre en el hilo de UI con
`useSharedValue` + `useAnimatedStyle` y solo anima `transform` y `opacity`.
No hay `setState` por frame.

### 4.1 Confeti (R6)

Constantes de módulo dentro de `celebration.tsx`, sin exportar:

```ts
const CONFETTI_COUNT = 24;
const COLORS = ['bg-accent', 'bg-category-amber-strong', 'bg-category-violet-strong', 'bg-category-blue-strong', 'bg-category-rose-strong', 'bg-category-green-strong'];
const SHAPES = ['h-1.5 w-2 rounded-full', 'h-3.5 w-2.5 rounded-sm', 'h-4 w-3 rounded-sm'];
```

Las seis clases de color ya existen en el tema, en claro y en oscuro. Para
cada `<c>` de `accent`, `category-amber-strong`, `category-violet-strong`,
`category-blue-strong`, `category-rose-strong` y `category-green-strong`, la
ancla es `grep -cE -- "--color-<c>:" src/theme/global.css` → `2`.

Cada pieza es un subcomponente `ConfettiPiece` en el mismo fichero, con un
`useSharedValue(0)` de progreso, y recibe `index` y `height`.

| i | left % | delay ms | dur ms | | i | left % | delay ms | dur ms |
|---|---|---|---|---|---|---|---|---|
| 0 | 7 | 0 | 2400 | | 12 | 99 | 636 | 2844 |
| 1 | 48 | 53 | 2537 | | 13 | 40 | 689 | 2981 |
| 2 | 89 | 106 | 2674 | | 14 | 81 | 742 | 3118 |
| 3 | 30 | 159 | 2811 | | 15 | 22 | 795 | 3255 |
| 4 | 71 | 212 | 2948 | | 16 | 63 | 848 | 3392 |
| 5 | 12 | 265 | 3085 | | 17 | 4 | 901 | 3529 |
| 6 | 53 | 318 | 3222 | | 18 | 45 | 954 | 2466 |
| 7 | 94 | 371 | 3359 | | 19 | 86 | 1007 | 2603 |
| 8 | 35 | 424 | 3496 | | 20 | 27 | 1060 | 2740 |
| 9 | 76 | 477 | 2433 | | 21 | 68 | 1113 | 2877 |
| 10 | 17 | 530 | 2570 | | 22 | 9 | 1166 | 3014 |
| 11 | 58 | 583 | 2707 | | 23 | 50 | 19 | 3151 |

Fórmulas de R6.2 y R6.3:

- `left = (i*41+7)%100`;
- `delay = (i*53)%MOTION_CONFETTI_SPREAD_MS`;
- `dur = MOTION_CONFETTI_MIN_MS + (i*137)%MOTION_CONFETTI_SPREAD_MS`.

La tabla es la salida de esas fórmulas. Si el código usa las fórmulas, los
tests aseveran contra la tabla, que es independiente: nada de importar las
fórmulas de producción (lección «candados tautológicos»).

Estilo animado de cada pieza, con `p` el progreso:

```
{ position: 'absolute', top: 0, left: `${L_i}%`,
  opacity: interpolate(p, [0, 0.1, 1], [0, 1, 0]),
  transform: [{ translateY: -40 + p * (height + 80) }, { rotate: `${p * 540}deg` }] }
```

Arranque en `useEffect(() => { progress.set(withDelay(D_i, withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration: T_i }))); }, [])`.
Una pasada; no hay `withRepeat` (R13.2).

Candados de tiempo, además de R6.4 a 5000 ms:

- **En vuelo:** la pieza 0 a los 1200 ms tiene una opacidad estrictamente
  entre 0 y 1. Prueba que la opacidad sube y baja, no que salta.
- **Retardo:** la pieza 22 (delay 1166) a los 1100 ms sigue en
  `opacity: 0` y `translateY: -40`. Prueba que `withDelay` existe.

### 4.2 Pop (R7, R8)

Dos shared values por elemento animado, `scale` y `opacity`, para
`{id}-pingo` y `{id}-badge`.

- Valor inicial de `scale`: `reduceMotion ? 1 : MOTION_POP_SCALE`. El de
  `opacity` es `0`.
- Efecto de montaje del pop:
  ```
  pingoOpacity.set(withTiming(1, MOTION_FADE_TIMING));
  badgeOpacity.set(withDelay(MOTION_SURFACE_MS, withTiming(1, MOTION_FADE_TIMING)));
  if (!reduceMotion) {
    pingoScale.set(withSpring(1, MOTION_POP_SPRING));
    badgeScale.set(withDelay(MOTION_SURFACE_MS, withSpring(1, MOTION_POP_SPRING)));
  }
  ```
- `MOTION_FADE_TIMING` lleva `reduceMotion: ReduceMotion.Never`, así que el
  fundido de opacidad se conserva con reduce motion activo, como pide R8.
- `reduceMotion` sale de `useReducedMotion()` de Reanimated.

### 4.3 Háptico (R9)

Va en un efecto propio, declarado **antes** del efecto del pop, en el
componente `Celebration`:

```
useEffect(() => { void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }, []);
```

Los dos efectos corren en el mismo commit de montaje. El háptico coincide
con el primer frame del pop, sin temporizador y una vez por montaje: un
re-render no lo repite porque las dependencias están vacías. `expo-haptics`
ya está instalado y lo usa la pantalla de comidas.

### 4.4 Constantes nuevas en `src/theme/motion.ts`

Se añaden al final, cada una con su comentario `// #171 R7` o `// #171 R6`:

```ts
export const MOTION_POP_SCALE = 0.6;
export const MOTION_POP_SPRING = { duration: 400, dampingRatio: 0.5, reduceMotion: ReduceMotion.System };
export const MOTION_CONFETTI_FALL_TIMING = { easing: Easing.bezier(0.2, 0.6, 0.4, 1), reduceMotion: ReduceMotion.System };
export const MOTION_CONFETTI_MIN_MS = 2400;
export const MOTION_CONFETTI_SPREAD_MS = 1200;
```

- Bajo jest, `Easing.bezier` se serializa como `{ bezier: [...] }` y
  `ReduceMotion.System` como `'system'`. Es el patrón de `MOTION_FILL_TIMING`
  en `src/theme/__tests__/motion.test.ts`.
- `it('no exporta nada más')` suma los cinco nombres en orden alfabético.
- El retardo de la insignia reutiliza `MOTION_SURFACE_MS` (400), que ya
  existe.

### 4.5 `EmptyState` flota (R10, R11)

- La imagen `{testID}-pose` pasa a vivir dentro de
  `<Animated.View testID={`${testID}-float`} style={floatStyle}>`.
  `floatStyle` es `{ width: 160, height: 160, transform: [{ translateY: offset }] }`
  con `offset = useSharedValue(0)`.
- El efecto de montaje es:
  `if (!reduceMotion) offset.set(withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING), -1, true));`.
  Es el mismo bucle que la bienvenida (#153 R4). §7 de la carta ya admite
  flotar como bucle.
- Los imports de `src/components/empty-state.tsx` quedan exactamente así,
  en este orden y cada uno en una sola línea:
  ```ts
  import { useEffect } from 'react';
  import { Image } from 'expo-image';
  import { Button } from 'heroui-native';
  import { Text, View } from 'react-native';
  import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
  import { MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING } from '../theme/motion';
  ```
  El repo no fija `printWidth` en móvil: la bienvenida importa
  `../../theme/motion` en una sola línea de más de 200 caracteres.
- `require(` sigue apareciendo 6 veces, una por pose.
- El labio de `{testID}-action` **no** se toca aquí: es de #166.

## 5. Archivos afectados (todos en la capa de presentación)

Nuevos:

- `mobile-pet-tracker/src/components/celebration.tsx` — `Celebration` y
  `ConfettiPiece` (R2, R6–R9, R13, R14).
- `mobile-pet-tracker/src/components/__tests__/celebration.test.tsx` — los
  candados de R2 y R6–R9, R13 y R14.
- `mobile-pet-tracker/assets/images/pingo-celebrate.webp` — R1.

Modificados:

- `src/screens/pairing/index.tsx` y `src/screens/pairing/index.test.tsx` — R3.
- `src/screens/add-pet/index.tsx` y `src/screens/add-pet/index.test.tsx` —
  R4 y R5.
- `src/components/empty-state.tsx` y
  `src/components/__tests__/empty-state.test.tsx` — R10 y R11.
- `src/theme/motion.ts` y `src/theme/__tests__/motion.test.ts` — §4.4.
- `src/i18n/catalog.ts` — R12. Codex confirma la ruta con
  `grep -rlF "'pairing.trackerIsReady'" src --include=*.ts`.
- `src/__tests__/ui-copy-table.ts` — `R9_ADD_PET` +4 usos (R12.3).
- `src/providers/__tests__/language-provider.test.tsx` — `+ 4 // #171 R12`.
- `src/screens/welcome/index.test.tsx` — la lista de poses (R1.2).
- `src/__tests__/consistency-classnames.test.ts` — §7.
- `src/__tests__/design-drift.test.ts` — `describe('#171 R13')`.
- `specs/mobile-ui-language/design.md` — §2.24 (R12.3).
- `docs/ui-guidelines.md` — enmienda de §8 (R15).

## 6. Copy (R12)

Literales por defecto de P1. El humano puede cambiarlos en el gate; si los
cambia, esta tabla y P1 se reescriben antes del handoff.

| Clave | en | es |
|---|---|---|
| `addPet.celebrateTitle` | `{{petName}} is home!` | `¡{{petName}} ya está en casa!` |
| `addPet.celebrateBody` | `I'll help you look after {{petName}}. Pair a collar and I'll keep track of where they are.` | `Te ayudo a cuidar de {{petName}}. Vincula un collar y estaré pendiente de dónde está.` |
| `addPet.celebratePair` | `Pair a collar` | `Vincular un collar` |
| `addPet.celebrateLater` | `Not now` | `Ahora no` |

Los cuatro usos en `R9_ADD_PET` siguen el formato de las filas vecinas de esa
constante y apuntan a `src/screens/add-pet/index.tsx`.

## 7. Candados que se mueven (sin #166)

Cada ancla se midió en 89fe2009 y se ejecuta desde `mobile-pet-tracker/`.

| Candado | Ancla (`grep -cF`) → base | Cambio |
|---|---|---|
| Bienvenida, poses | `"it('no mete otras poses de Pingo'" src/screens/welcome/index.test.tsx` → `1` | `'pingo-celebrate.webp'` entra en su sitio alfabético de la lista ordenada: en 89fe2009, **primero**, antes de `'pingo-clipboard.webp'`. La lista se re-mide en §9.3 paso 5 (R1.2) |
| EmptyState, imports permitidos | `"it('EmptyState solo importa de react, react-native, expo-image y heroui-native'" src/components/__tests__/empty-state.test.tsx` → `1` | Se reescribe: la lista admitida suma `'react-native-reanimated'` y `'../theme/motion'`, y el nombre del `it` lo dice |
| EmptyState, no anima | `"it('EmptyState no anima', ()" src/components/__tests__/empty-state.test.tsx` → `1` | Se **elimina**: lo sustituyen los candados de R10 y R11 |
| EmptyState, imports exactos | `"it('EmptyState importa exactamente Image, Button, Text y View'" src/components/__tests__/empty-state.test.tsx` → `1` | La lista exacta pasa a ser la de §4.5; `require(` sigue en 6 |
| EmptyState, sin Animated | `"it('EmptyState no anima con Animated, LayoutAnimation ni transiciones'" src/components/__tests__/empty-state.test.tsx` → `1` | Se reescribe: veta `LayoutAnimation`, `transition`, `animate-`, `entering=` y `exiting=`, ya no `Animated` |
| EmptyState, hijos directos con acción | `"it('con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden'" src/components/__tests__/empty-state.test.tsx` → `1` | El primer hijo pasa de `{testID}-pose` a `{testID}-float` (R10.2) |
| EmptyState, hijos directos sin acción | `"it('sin acción pinta pose, título y cuerpo como hijos directos, en ese orden'" src/components/__tests__/empty-state.test.tsx` → `1` | Igual |
| CONTINUOUS_CORNER del repo | `"expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1);" src/__tests__/consistency-classnames.test.ts` → `1` | `31 + 1 - 1`, con `// #171 R3: ready-done` |
| CONTINUOUS_CORNER de Vincular | `"[join('screens', 'pairing', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts` → `1` | `2` → `1` |
| bg-accent-soft (recuento 1) | `"expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1);" src/__tests__/consistency-classnames.test.ts` → `1` | `16 + 2 + 1 - 1`, con `// #171 R3` |
| bg-accent-soft (recuento 2) | `"expect(accentSoftCount).toBe(16 + 2 + 1);" src/__tests__/consistency-classnames.test.ts` → `1` | `16 + 2 + 1 - 1`, con `// #171 R3` |
| Catálogo, longitud | `-- "- 1, // #159 R2" src/providers/__tests__/language-provider.test.tsx` → `1` | Se inserta la línea `+ 4 // #171 R12` justo antes. #167 R5.3 reescribe esta línea; si #167 mergea antes, el ancla se re-mide en §9.3 paso 6 |
| `R9_ADD_PET` | `"export const R9_ADD_PET: UseRow[] = [" src/__tests__/ui-copy-table.ts` → `1` | +4 filas (§6) |
| `SCREEN_FILES` | — | +0 (no hay ruta nueva) |
| motion, exports | `"it('no exporta nada más'" src/theme/__tests__/motion.test.ts` → `1` | +5 nombres (§4.4) |

Mediciones de apoyo:

- `grep -cF "style={CONTINUOUS_CORNER}" src/screens/pairing/index.tsx` → `2`
  (uno es `ready-done`);
- `grep -cF "bg-accent-soft" src/screens/pairing/index.tsx` → `2` (uno es el
  círculo ✓).

**Al final no cambia** `expect(count(/rounded-xl bg-accent(?=[\s'"\`])/g))`:
el `ready-map` de Vincular sale de `pairing/index.tsx` y el primario de
`celebration.tsx` entra con la misma secuencia en `src/components/`, que
`sourceFiles()` recorre. Por el camino sí se mueve, +1 en T14 y −1 en T8,
junto con el resto de inventarios de botones ([[design]] §9).

Inventarios globales a vigilar (lección «candado de catálogo omitido»). Codex
corre la suite entera antes de cada commit verde y cualquier rojo fuera de
los ficheros de §5 es parada, no adaptación. Los conocidos son:

- `design-drift` escanea también tests, así que `celebration.test.tsx` no
  puede contener `StyleSheet` ni hex;
- `legibility-classnames` veta `text-accent` suelto: `celebration.tsx` no lo
  usa (solo `text-accent-foreground`).

## 8. Enmienda a la carta (R15) — texto literal

Se añade al final de `docs/ui-guidelines.md`, tal cual:

```markdown
## Enmienda #171 — confeti de celebración

El punto 7 solo admite como bucles los «Bucles de reposo» de Pingo. El confeti de `Celebration`
(`src/components/celebration.tsx`) no es un bucle: es **una sola pasada** de
24 piezas que caen con `withTiming` (`MOTION_CONFETTI_FALL_TIMING`, entre
`MOTION_CONFETTI_MIN_MS` y `MOTION_CONFETTI_MIN_MS + MOTION_CONFETTI_SPREAD_MS`
de duración) y se desvanecen. Las reglas son:

- solo en celebraciones del tier «raro» (vincular un collar, primera mascota);
- es decorativo: `pointerEvents="none"` y oculto a la accesibilidad;
- con reduce motion activo **no se monta**;
- solo anima `transform` y `opacity`.

- [ ] Aprobada por humano (fecha: ____)
```

## 9. Lo que depende de #166 (se re-mide tras el merge de #166) (R14)

**Re-medida el 2026-10-12 en 5fbe9eed**, el merge de `origin/main`
d2b8b0ae (PR #209, que trae #166) en esta rama. Las cifras y anclas de abajo
son las medidas ahí; el resultado paso a paso está en §9.3. #166 introdujo el
labio de los primarios, el secundario neutro con `border-lip-gray` y sus
inventarios. Las recetas viven en el punto 13 de §Decisiones fijas de
`docs/ui-guidelines.md` y coinciden literalmente con §9.1.

### 9.1 Recetas (de #166 R2.1 y R3.1)

- **Primario sólido:** la secuencia contigua
  `rounded-xl bg-accent border-b-4 border-black/25`, con el labio **detrás**
  de `bg-accent`. El resto del className (`min-h-11 w-full`) no cambia.
- **Secundario neutro:** la secuencia contigua
  `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, sin
  `border-accent`, `bg-transparent` ni `border-black`. El de Bienvenida va
  sin `variant`, y el de `Celebration` también.

### 9.2 Candados de #166 y de antes que mueve esta feature

El orden de ejecución es **T2, T14, T8**: T14 va justo después de T2 (ver
[[tasks]]). En T2 los botones son provisionales e inertes para todos los
inventarios. T14 pone las recetas, y con ellas suma el primario y el
secundario del componente. T8 quita `ready-map` de Vincular.

| Candado | Qué cuenta | Base tras #166 | Tras T14 | Tras T8 (final) |
|---|---|---|---|---|
| #166 R2, `it('inventaría los diecinueve primarios con labio, fichero a fichero')` | mapa fichero → recuento de `rounded-xl bg-accent([[:space:]]\|"\|'\|\`)` y que todos llevan labio | 19 en 17 ficheros; `screens/pairing/index.tsx` = 2 | fila nueva `components/celebration.tsx` = 1; total 20 en 18 | `screens/pairing/index.tsx` = 1; total 19 en 18 |
| #166 R2, `it('no deja la receta del labio fuera de un primario')` | `border-b-4` y `border-black/25` en producción | 19 y 19 | 20 y 20 | 19 y 19 |
| #62 R1, `it('deja todos los botones primarios sólidos en un único radio')` | `toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1)` | 19 | `+ 1 // #171 R14: celebration` | `- 1 // #171 R3: ready-map` |
| #98 R10, `count(/rounded-xl bg-accent(?=[\s'"\`])/g)` | igual | 19 | `+ 1 // #171 R14` | `- 1 // #171 R3` |
| #166 R3, `it('inventaría los cuatro secundarios neutros de toda la app')` | lista ordenada de testIDs, más `border-lip-gray` y `border-b-6` | 4 testIDs; 4 y 4 | 5 testIDs; 5 y 5; se renombra a «cinco» | sin cambio (`ready-done` era `Pressable`, no `Button`) |
| #166 R3, `it.each` `'%s pinta %s con la receta del secundario en su tag de apertura'` | tag de apertura por testID literal | 4 filas | **sin fila nueva**: el testID del componente es dinámico; lo cubre R14.2 por render | — |

El inventario de secundarios extrae el testID con `/testID="([^"]+)"/`, y
`testID={secondary.testID}` **no** casa: daría `undefined` o rompería el
`it`. En T14 la extracción pasa a
`/testID=(?:"([^"]+)"|\{([^}]+)\})/`, tomando el grupo 1 o, si no existe, el
2. La lista esperada queda
`['docs-upload-cancel', 'forgot-resend', 'reminders-delete-cancel', 'secondary.testID', 'welcome-have-account']`.
Comprobado en 5fbe9eed: con la regex vieja y con la nueva, la extracción
sobre el árbol da los mismos cuatro testIDs.

El primario de Añadir mascota no suma nada: reutiliza el mismo tag de
`celebration.tsx`.

**Anclas** (medidas en 5fbe9eed, desde `mobile-pet-tracker/`, todas en
`src/__tests__/consistency-classnames.test.ts`; cada `grep -cF` da `1`):

| Candado | Ancla `grep -cF` | T14 | T8 |
|---|---|---|---|
| #166 R2, título | `"it('inventaría los diecinueve primarios con labio, fichero a fichero'"` | sin cambio: el total final vuelve a 19 | — |
| #166 R2, fila nueva | `"[join('components', 'empty-state.tsx')]: 1,"` | inserta justo antes `[join('components', 'celebration.tsx')]: 1, // #171 R14` | — |
| #166 R2, Vincular | `"[join('screens', 'pairing', 'index.tsx')]: 2,"` | — | `2` → `1`, con `// #171 R3: ready-map` |
| #166 R2, `border-b-4` | `'expect(count(/\bborder-b-4\b/g)).toBe(19);'` | `19 + 1`, con `// #171 R14` | `19 + 1 - 1`, con `// #171 R3: ready-map` |
| #166 R2, `border-black/25` | `'expect(count(/border-black\/25/g)).toBe(19);'` | igual | igual |
| #62 R1 | `"expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1);"` | `+ 1`, y al final del comentario de la línea `// #171 R14: celebration` | `- 1`, y `// #171 R3: ready-map` |
| #98 R10 | `".toBe(13 + 1 + 1 + 1 + 1 + 1 + 1);"` | `+ 1`, `// #171 R14` | `- 1`, `// #171 R3` |
| #166 R3, título | `"it('inventaría los cuatro secundarios neutros de toda la app'"` | `cuatro` → `cinco` | — |
| #166 R3, extracción | `'return neutral ? [tag.match(/testID="([^"]+)"/)?.[1]] : [];'` | regex nueva, grupo 1 o el 2; lista esperada de arriba | — |
| #166 R3, `border-lip-gray` | `"expect(count(/border-lip-gray/g)).toBe(4);"` | `4 + 1`, con `// #171 R14` | — |
| #166 R3, `border-b-6` | `'expect(count(/\bborder-b-6\b/g)).toBe(4);'` | igual | — |
| #166 R3, `it.each` | `"it.each(rows)('%s pinta %s con la receta del secundario en su tag de apertura'"` | sin fila nueva | — |

No se mueven: `#166 R1` (`src/theme/__tests__/global-css.test.ts`, no hay
token nuevo), `#166 R3` de Bienvenida (`src/screens/welcome/index.test.tsx`)
y `#166 R4` (la carta; R15 añade su enmienda al final del fichero, después de
`## Animación (decisiones por defecto)`, y #166 R4 solo ordena 12 < 13 <
`## Animación`).

### 9.3 Re-medición (antes del handoff)

El leader:

1. Comprueba que #166 está en `origin/main`:
   `git merge-base --is-ancestor <merge de #166> origin/main`.
2. Mergea `origin/main` en esta rama.
3. Re-mide la tabla de §9.2 contra el código mergeado y la completa con una
   ancla `grep -cF` por candado (nombre exacto del `it` y expresión del
   recuento). Comprueba también:
   - cómo lee testIDs dinámicos (`` `${testID}-action` `` de `EmptyState`)
     el inventario de primarios de #166 R2, para que la fila de
     `celebration.tsx` siga el mismo método;
   - que `--color-lip-gray` existe en `src/theme/global.css` y que
     `border-lip-gray` y `border-b-6` no chocan con `legibility-classnames`
     ni `design-drift`;
   - que las clases de R14.1 y R14.2 son literalmente las que #166 prescribe
     para primario y secundario neutro. Si #166 cambió alguna en su gate,
     R14 se enmienda para copiarla y se reabre el gate solo para R14.
4. Si `EmptyState` cambió en #166 (labio de `{testID}-action`), re-mide los
   imports exactos de §4.5 y los `it` de §7 que miran `empty-state.tsx`.
5. Re-mide las poses de R1.2, que no dependen de #166 sino de lo que haya
   mergeado antes (#167, #170 u otra): lista ordenada de
   `ls mobile-pet-tracker/assets/images | grep -E '^(pingo|mascot)-'` en
   `origin/main`. Reescribe con ella, más `pingo-celebrate.webp` en su sitio
   alfabético, la lista esperada de [[tasks]] T1 y la fila «Bienvenida,
   poses» de §7. También busca cualquier otro candado de poses que haya
   aparecido (`grep -rlF "no mete otras poses" mobile-pet-tracker/src`).

**Resultado (2026-10-12, 5fbe9eed):**

1. `git merge-base --is-ancestor d2b8b0ae origin/main` → sí.
2. `origin/main` d2b8b0ae mergeada sin conflictos en 5fbe9eed.
3. La tabla de §9.2 cuadra con la base medida y lleva sus anclas.
   - #166 R2 **no lee testIDs**: cuenta la secuencia de className por
     fichero. El `` `${testID}-action` `` dinámico de `EmptyState` cuenta
     como `components/empty-state.tsx` = 1, y la fila de `celebration.tsx`
     sigue el mismo método.
   - `grep -cF -- '--color-lip-gray: ' src/theme/global.css` → `2` (los dos
     temas). `border-lip-gray` y `border-b-6` ya están en cuatro tags de
     producción con la suite verde en `origin/main` (98 suites, 2775 tests),
     así que no chocan con `legibility-classnames` ni con `design-drift`.
   - `` grep -cF '`rounded-xl bg-accent border-b-4 border-black/25`' ../docs/ui-guidelines.md `` → `1`
     y `` grep -cF '`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`' ../docs/ui-guidelines.md `` → `1`.
     Las clases de R14.1 y R14.2 contienen esas secuencias contiguas, así que
     **R14 no se enmienda** y su gate no se reabre.
   - Cómo leen la clase del `Button` los candados de render de #166:
     `screen.getByTestId(<testID>).props.className`, y la del texto,
     `screen.getByText(<label>).props.className`
     (`grep -cF "it('lleva el labio gris en el CTA secundario'" src/screens/welcome/index.test.tsx` → `1`).
     T14 usa el mismo método.
4. `EmptyState` cambió en #166 solo en la línea del `Button` (el labio de
   `{testID}-action`). Sus imports siguen siendo los de 89fe2009, así que la
   lista de §4.5 no cambia, y las seis anclas de §7 sobre
   `empty-state.tsx` siguen en `1`. #166 dejó en
   `src/components/__tests__/empty-state.test.tsx` dos `it` que leen la línea
   exacta del `Button`: `it('declara el botón primario con labio'` y
   `it('declara el botón sin size ni variant'` (cada uno → `1`). R10 solo
   envuelve la pose, no toca esa línea: no se mueven.
5. Poses en d2b8b0ae: las mismas ocho de 89fe2009. La lista de [[tasks]] T1 y
   la fila «Bienvenida, poses» de §7 no cambian. El único candado de poses
   sigue siendo `src/screens/welcome/index.test.tsx`.

6. Solapes con #167 (`feature/167-mobile-account-screens-pingo`, en gate a
   2026-10-12). Si #167 está en `origin/main` al hacer el handoff:
   - **§2.24:** #167 abre `### §2.24 — Añadidos por #167 — Pingo en las
     pantallas de cuenta` justo antes de `## 3. La infraestructura`. La de
     #171 pasa a `### §2.25 — Añadidos por #171 — Celebraciones`, después de
     la de #167 y antes de `## 3. La infraestructura`. Reescribe R12.3, la
     fila R12.3 de [[tasks]] T9 y su verde con el número nuevo.
   - **Catálogo:** #167 R5.3 cambia `- 1, // #159 R2` por `- 1 // #159 R2` y
     añade `+ 1, // #167 R5`. Re-mide el ancla de la fila «Catálogo,
     longitud» de §7 contra la última línea de la expresión, y dónde entra
     `+ 4 // #171 R12`.
   - **Carta:** #167 sustituye la viñeta «Bucles de reposo» y añade su
     `## Enmienda #167` al final. §8 ya no enumera los bucles y el candado
     de T15 no exige ser la última sección, así que ninguno de los dos
     cambia; solo hay que comprobar que el bloque de §8 sigue siendo cierto.
   Si #167 mergea **después** que #171, le toca a #167 renumerar su §2.24 y
   re-medir la línea del catálogo.

R14 y sus tests (T14) quedan desbloqueados. Si al arrancar Codex
`origin/main` ya no es d2b8b0ae, rige el paso 5 sobre las
poses y las anclas de §7 y §9.2 se vuelven a ejecutar antes de T1: cualquier
`grep -cF` que no dé su valor es **parada**.

## 10. Alternativas descartadas

- **Ruta modal de Expo Router** (`presentation: 'transparentModal'`). Obliga
  a pasar ESN y Modelo por parámetros, añade un fichero a `SCREEN_FILES` y
  rompe los tests de Vincular, que esperan los testIDs en la misma pantalla.
- **Bandera persistente «ya celebró»** (AsyncStorage o backend). Añade estado
  y casos de borde (reinstalar, cambiar de cuenta) para un evento que el
  cliente ya distingue con la lista de mascotas. Queda como (F).
- **Lottie.** Dependencia nueva (`lottie-react-native`) y un asset que nadie
  ha diseñado. El confeti en Reanimated cabe en un fichero.
- **Anillo «ping» del canvas.** Es un bucle continuo y el punto 7 de la
  carta solo admite los «Bucles de reposo» de Pingo; #167, que añade los
  anillos a la bienvenida, exige enmienda propia para otra pantalla.
- **Subida escalonada del texto.** Rompe los `toBeVisible()` de los tests de
  Vincular por la opacidad inicial 0. Basta el fundido del `Modal`.
- **Confeti infinito como en el canvas.** Es una maqueta: la carta pide
  movimiento escaso. Va en P4.
