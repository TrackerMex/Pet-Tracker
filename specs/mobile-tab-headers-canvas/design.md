---
feature: "mobile-tab-headers-canvas"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Diseño — [[mobile-tab-headers-canvas]] (#168)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Todo el
> cambio vive en la capa de presentación de `mobile-pet-tracker/` (pantallas y
> sus tests); no toca `src/api/`, ni `src/providers/`, ni el backend. Rige
> `docs/ui-guidelines.md`.

## 0. Orden con #166 y medidas

- **#166 (`mobile-chunky-cta`) mergea antes** de que Codex arranque #168.
  Reescribe el `className` de los botones de estas tres pantallas y añade un
  punto (la receta del CTA chunky) a la lista numerada de
  `docs/ui-guidelines.md`. Consecuencias:
  - #168 **no congela ningún `className` ni prop de `Button`**. Ningún `it`
    nuevo o reescrito aserta sobre ellos; los botones se buscan por `testID`.
  - Toda medida sobre `docs/ui-guidelines.md` y sobre los recuentos globales
    de `consistency-classnames.test.ts` y `legibility-classnames.test.ts` se
    toma **tras el merge de #166**, con los greps de requirements §1. Los
    cambios de #168 son deltas sobre lo medido.
  - Los cambios en `docs/ui-guidelines.md` se anclan por contenido: el bloque
    nuevo va **al final del fichero**, después de la última sección
    `## Enmienda` que haya en ese momento. Nunca por número de línea ni por
    número de punto de la lista (el punto que añade #166 los desplaza).
- Ningún marcador de #67 se retira ni se cambia, así que los tres `it` de
  `R10: las specs enmendadas por #67 llevan su bloque` no se mueven
  (requirements R11.4; tasks.md §R11 lo repite).

## 1. Decisiones técnicas

### D1 — El título grande es un `Text` con clases de la escala, no un componente — R1

`text-3xl font-black tracking-tight text-foreground`. `text-3xl` es 30 px;
`tracking-tight` es −0.025 em, el paso más cercano al −0.02 em del canvas.
Sin corchetes, para que los guards de `design-drift` sigan sin tocar sus
tablas. Tres usos en tres pantallas no justifican un `ScreenTitle`
compartido: el `testID` cambia por pantalla y Perfil lo mete en su fila con
`profile-add-pet`. El candado global R1.3 (`G`) evita que una cuarta copia
derive.

No se usa el título del stack nativo (`headerLargeTitleEnabled`): las tres
pestañas viven en el layout `(tabs)` sin header, y el canvas pone el título
dentro del scroll.

### D2 — Salud vuelve a las métricas estándar — R2

Sin hero, Salud deja de ser la excepción A9 de #67 y usa el
`contentContainerStyle` de Perfil y Nutrición (`padding: 24`, `gap: 16`,
`paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 96`). Los
envoltorios `health-content` y `health-states` pierden su `paddingHorizontal`
y su `paddingTop` (ya los pone el scroll) y conservan `gap: 16`, porque los
tests de #115 R2 los usan como raíces de `within` y porque separan el
`PetSwitcher` de las tarjetas igual que hoy. La excepción A9 de la carta
sigue escrita (Inicio la usa); #168 no la toca.

### D3 — Huecos pastel desde `CATEGORY_SLOTS`, color del icono desde `useThemeColors` — R3, R5, R6

Superficie y tinta salen de `src/utils/category-palette.ts`
(`CATEGORY_SLOTS[slot].surface` / `.ink`), igual que en Inicio. El color del
icono no puede ser una clase: `reicon-react-native` recibe `color` como
string, así que se lee `category-<slot>-strong` con `useThemeColors`, ampliando
la llamada que cada pantalla ya tiene (`[warning, muted]` en Salud,
`[muted]` en Perfil). En tests, el doble de `useThemeColors` devuelve el
nombre del token, así que el color esperado es el literal
`'category-rose-strong'`, etc.

Asignación de huecos (carta §Dirección de arte 1: el color se ata al dato,
nunca al índice):

| Sitio | Dato | Hueco | Por qué |
|---|---|---|---|
| Vacuna | vencida | `rose` | alerta; el texto ya va en `text-danger` |
| Vacuna | próxima | `amber` | la sección «Próxima» del canvas es ámbar |
| Vacuna | resto | `green` | al día |
| Chip | sexo | `blue` | canvas |
| Chip | esterilizado | `green` | canvas |
| Chip | edad | `amber` | canvas |
| Chip | peso | `violet` | canvas |
| Fila | Documentos | `blue` | canvas |
| Fila | Collar GPS | `green` | canvas |
| Fila | Zonas seguras | `amber` | canvas |
| Fila | Recordatorios | `violet` | canvas |

Los tiles llevan `rounded-xl` + `style={CONTINUOUS_CORNER}` (carta §12:
tile). Los chips y el avatar de iniciales son cápsulas (`rounded-full`, sin
esquina continua; `#62 R14` prohíbe `rounded-full` junto a
`CONTINUOUS_CORNER`).

### D4 — Perfil pinta su propia tarjeta con `PetAvatar`, no una variante nueva del hero — R4

El canvas pone una foto circular centrada, el nombre y los chips en una
tarjeta. `PetHeroHeader variant="card"` es una foto rectangular con texto
encima: adaptarlo exigiría una tercera variante en un componente que solo
usará Inicio. `PetAvatar` ya resuelve foto o blobatar (carta §2) y acepta
`size` numérico con estilo circular. `pet-hero-header.tsx` no se toca
(R12.5).

`profile-hero-skeleton` conserva su nombre (mismo criterio que #67 R6) y
pasa de `h-80` a `h-52`.

### D5 — Iniciales en la tarjeta de cuenta: cálculo en línea — R7

`[firstName, lastName].map((part) => part.trim().charAt(0)).join('').toUpperCase()`.
No merece helper ni fichero: un solo uso. `charAt(0)` sobre una letra
precompuesta (`é`, `ñ`) devuelve la letra completa; los nombres con
grafemas combinados (letra + diacrítico suelto) quedan como límite conocido,
sin candado. El avatar es decorativo: el nombre completo ya está al lado.

### D6 — Anillo con `react-native-svg` y `useAnimatedProps` — R8, R9, R10

- `react-native-svg` 15.15.4 ya es dependencia (lo usan
  `weekly-activity-chart` y el blobatar). Cero dependencias nuevas.
- `const AnimatedCircle = Animated.createAnimatedComponent(Circle);` a nivel
  de módulo en `food.tsx`.
- El shared value guarda el **porcentaje acotado** (0–100), no el desfase:
  el efecto hace `kcalRingPct.set(withTiming(Math.min(kcalPct, 100), KCAL_BAR_TIMING))`
  y `useAnimatedProps` convierte a
  `strokeDashoffset: KCAL_RING_CIRCUMFERENCE * (1 - kcalRingPct.get() / 100)`.
  Así `expectKcalBarTiming(target)` de `food.test.tsx`, que busca la llamada a
  `withTiming` por valor, sigue sirviendo sin cambios con 50 y 100.
- Lo que se anima es una prop de SVG en el hilo de UI. No hay layout por
  frame (a diferencia del `width` de la barra actual).
- Trazo y pista en `accent-foreground` sobre la tarjeta `variant="accent"`:
  el canvas pinta blanco sobre el acento; la pista a `strokeOpacity={0.2}`
  (el canvas usa 0.22; 0.2 es el paso redondo y no se distingue).
- `KCAL_BAR_TIMING` se queda con su nombre: la carta §Enmienda #152 la nombra
  como pendiente de migrar y `src/screens/welcome/index.test.tsx` (`#153 E1`)
  candea ese texto.
- Reduce motion: `ReduceMotion.System` en la configuración (ya está en
  `KCAL_BAR_TIMING`). Con la opción activa, Reanimated salta al valor final.
- Semántica accesible: la de `food-plan-progress` no cambia (#113 R3). El SVG
  va dentro de `food-plan-ring` y no lleva props de accesibilidad.

#### Cómo se aserta el desfase en jest

`toHaveAnimatedProps` de Reanimated 4.5.1 compara con igualdad estricta y no
admite matchers asimétricos, así que no sirve para un desfase con decimales.
El test lee el valor que el mock de Reanimated deja en el host:

```text
const host = screen.getByTestId('food-plan-ring-fill');
expect(Object.keys(host.props.jestAnimatedProps.value)).toEqual(['strokeDashoffset']);
expect(host.props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(138.23, 2);
```

Los valores esperados se escriben literales (requirements R9), nunca
importando `KCAL_RING_CIRCUMFERENCE` (candado tautológico). Si en el árbol
de test `jestAnimatedProps` no llega al host del círculo (el doble de
`react-native-svg` lo pierde), Codex **para** y lo reporta en
`progress/impl_mobile-tab-headers-canvas.md`. No cambia la técnica por su
cuenta.

#### Doble de `react-native-svg` en `food.test.tsx`

Intención: que `Svg` y `Circle` rendericen un host con su `testID` y **todas**
sus props intactas (para asertar `cx`, `r`, `stroke`, `strokeDasharray`,
`transform`…), y que `Animated.createAnimatedComponent(Circle)` funcione
sobre ese host. El patrón de referencia es el doble de
`src/screens/home/weekly-activity-chart.test.tsx` (sustituye `Rect` por un
`View` con las props tal cual); Codex lo verifica contra ese fichero y contra
el `.d.ts` instalado, no lo copia a ciegas. Si el doble esparce
`jest.requireActual`, declara `__esModule: true` explícito: el spread lo
pierde y el `import Svg from 'react-native-svg'` por defecto sale mal (misma
trampa que el doble de Reanimated de #152 E1). Si el
doble es una función, `createAnimatedComponent` necesita un componente que
acepte `ref`: si falla por eso, se usa una clase o `forwardRef` en el doble,
no en producción.

### D7 — `food.tsx` sigue siendo una ruta gorda — R8–R10

`src/app/(tabs)/food.tsx` no está migrado a `src/screens/food/` (deuda #102).
Migrarlo aquí movería todos los candados que lo nombran por ruta
(`design-drift` `MEALS_BAR_STYLE_ESCAPES` y la lista de `Card` compartido,
`consistency-classnames` `#62 R14` y `#98 R10`, `legibility-classnames`
`#61 R4`) y el path de `food.test.tsx`, todo en un PR que ya es grande. Se
queda donde está; el anillo se escribe en el mismo fichero.

### D8 — Enmienda propia con bloque, firma y candado — R11

Misma técnica que #67 (`hero-header-amendments.test.ts`), con constantes
propias para que los dos candados no se pisen:

- fence: ```` ```markdown ```` + `## Enmienda #168 — título grande en Salud, Nutrición y Perfil`;
- firma: `- [ ] Enmienda #168 aprobada por humano` (no contiene la cadena
  `- [ ] Enmienda aprobada por humano` de #67, así que el `it` de firma de
  #67 no puede darse por satisfecho con la de #168, ni al revés);
- marcador en prosa por documento (requirements R11.2).

La línea de firma se entrega **sin marcar**. La marca el humano tras la
implementación, antes del cierre.

### D9 — Cero copy nuevo — R1, R12.4

Todas las cadenas ya existen en `src/i18n/catalog.ts` (`health.health`,
`food.food`, `profile.profile`, `profile.sterilized`,
`profile.notSterilized`, `profile.ageMonths`, `profile.documents`,
`profile.gpsSettings`, `geofences.title`, `profile.reminders`). El copy del
canvas no está aprobado (`design-src/README.md`); las diferencias quedan en la
Pregunta 2.

## 2. Bloque canónico de la enmienda (R11)

El candado `#168 R11` de `src/__tests__/hero-header-amendments.test.ts` lee
este fence **de aquí**, no de una copia.

```markdown
## Enmienda #168 — título grande en Salud, Nutrición y Perfil

`mobile-tab-headers-canvas` (#168) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-tab-headers-canvas/`; el detalle
de la enmienda está en su `requirements.md` §R11.

- Spec enmendada: `<FEATURE>`
- Qué cambia: `<QUÉ CAMBIA>`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #168 (lista
  en su `tasks.md`).

- [ ] Enmienda #168 aprobada por humano
```

Dónde va en cada documento: el bloque, al **final** del documento (en la
carta, tras la última sección `## Enmienda` que exista al arrancar); el
marcador en prosa, donde dice requirements R11.2. En las tres specs, el
marcador va en la línea siguiente al encabezado citado y no reescribe el
requisito original: lo deja legible como historia.

## 3. Archivos afectados (todos en presentación)

Producción (`mobile-pet-tracker/`):

- `src/screens/health/index.tsx` — R1, R2, R3: título, fuera el hero, scroll
  estándar, tiles de vacuna.
- `src/screens/profile/index.tsx` — R1, R4, R5, R6, R7: título con `testID`,
  `profile-pet-card`, `PetPills` reescrito, tiles de navegación, iniciales.
- `src/app/(tabs)/food.tsx` — R1, R8, R9, R10: título, anillo; fuera la barra
  y el tile `ForkKnife`.

Tests:

- `src/screens/health/index.test.tsx` — `#168 R1`–`R3` nuevos; reescritura
  de `#115 R2` y `#115 R3` (tasks.md §Reescrituras); doble de `reicon` con
  `Check` y `Clock`.
- `src/screens/profile/index.test.tsx` — `#168 R1`, `R4`–`R7` nuevos;
  reescritura de `R6: Profile usa el hero compartido` y de los `it` que
  buscan `pet-hero`/`pet-hero-media`; doble de `reicon` nuevo.
- `src/app/(tabs)/__tests__/food.test.tsx` — `#168 R1`, `R8`–`R10` nuevos;
  reescritura de `#113 R2`, `R4`, `R7`; doble de `react-native-svg`.
- `src/__tests__/consistency-classnames.test.ts` — R12.1, R12.1b (deltas).
- `src/__tests__/hero-header-amendments.test.ts` — R11 (`describe` nuevo).
- `src/__tests__/tab-headers-canvas.test.ts` — **nuevo**: R1.3, R12.2, R12.3.

Documentos (R11): `specs/mobile-health-make-parity/requirements.md`,
`specs/mobile-pet-hero-header/requirements.md`,
`specs/mobile-kcal-consumed-bar/requirements.md`, `docs/ui-guidelines.md`.

No se tocan: `src/components/pet-hero-header.tsx`,
`src/components/pet-switcher.tsx`, `src/components/pet-avatar.tsx`,
`src/utils/category-palette.ts`, `src/theme/*`, `src/i18n/catalog.ts`,
`package.json`, `bun.lock`, `docs/conventions.md`,
`specs/mobile-pet-hero-header/design.md`.

## 4. Alternativas descartadas

- **Mantener `PetHeroHeader` en las tres pestañas y añadir el título encima**:
  contradice N1 (decisión del humano) y duplica la identidad de la mascota.
- **Componente `ScreenTitle` compartido**: tres usos de una línea; el candado
  global R1.3 da la misma garantía sin abstracción.
- **Tercera variante de `PetHeroHeader` para Perfil**: el componente quedaría
  con dos variantes que solo usa Inicio y una que solo usa Perfil (D4).
- **Barra + anillo a la vez**: el canvas los sustituye; dos indicadores del
  mismo dato compiten.
- **Anillo con `transform: rotate` sobre dos medias lunas `View`** (sin SVG):
  más nodos, bordes peores en Android y ninguna ventaja con `react-native-svg`
  ya instalado.
- **Animar `strokeDashoffset` directamente en el shared value**: rompería
  `expectKcalBarTiming`, que busca la llamada por porcentaje, y obligaría a
  asertar desfases en dos sitios.
- **Migrar `food.tsx` a `src/screens/food/`** (D7).
- **Migrar `KCAL_BAR_TIMING` a `MOTION_FILL_TIMING`** (mismos valores): lo
  candea `#153 E1` como pendiente nombrada; es trabajo de la feature que lo
  cierre.
- **Mapear `pet.sex` a texto traducido**: la carta §6 lo fija crudo y
  `design-drift` lo candea (Pregunta 3).
- **Rejilla 2×2 de tiles en Perfil**: cambia la navegación además del estilo;
  filas con tile conservan destinos, orden y candados (Pregunta abierta en
  requirements: fuera de alcance).
