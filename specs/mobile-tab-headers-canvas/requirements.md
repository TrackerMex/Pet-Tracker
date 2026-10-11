---
feature: "mobile-tab-headers-canvas"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Requisitos — [[mobile-tab-headers-canvas]] (#168)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[traceability]] para el cierre. Rige `docs/ui-guidelines.md` (la «carta»):
> §6 copy, §7 voz de Pingo, §11 acento, §12 radios, §Animación, §Dirección de
> arte 1 (huecos pastel), §Enmienda #67 y §Enmienda #70 (elementos repetidos).

Rutas relativas a `mobile-pet-tracker/` salvo que empiecen por `specs/` o
`docs/`. Base medida: `origin/main` en `89fe2009`.

## §0. Contexto y decisión del humano (no se reabre)

Fila 2 (parte 1) del plan de paridad con el canvas
(`progress/explore_ui-canvas-parity.md` §4, decisión **N1**): Salud, Nutrición
y Perfil abren con el **título grande** del canvas en lugar de su cabecera
actual. Eso revierte la Enmienda #67 en esas tres pestañas. **Inicio conserva
`PetHeroHeader`**. Los artboards de referencia están en
`specs/mobile-tab-headers-canvas/design-src/`; su copy **no** está aprobado
(`design-src/README.md`).

La implementación (Codex CLI) **espera al merge de #166**
(`mobile-chunky-cta`), que reescribe el `className` de botones de estas tres
pantallas (`profile-add-pet`, `change-photo`, `profile-sign-out`,
`health-retry`, `vaccines-retry`, `profile-pet-retry`, `food-retry`,
`food-plan-retry`). Esta spec **no congela ningún `className` ni prop de
`Button`**: ningún test de #168 aserta sobre ellos y todo test que necesite un
botón lo encuentra por `testID`.

## §1. Medidas en la base `89fe2009` (se re-miden al arrancar, por grep)

Las cifras caducan con el trabajo de otros (#166 mergea antes). El handoff las
re-mide con estos greps sobre el HEAD de arranque y, si alguna difiere, el
delta de esta spec se aplica sobre la cifra medida, no sobre la de esta tabla.

| Medida | Comando (desde `mobile-pet-tracker/`) | Base |
|---|---|---|
| Usos directos de esquina continua en Salud | `grep -c 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx` | 2 |
| Ídem Nutrición | `grep -c 'style={CONTINUOUS_CORNER}' 'src/app/(tabs)/food.tsx'` | 2 |
| Ídem Perfil | `grep -c 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx` | 4 |
| Suma del candado #62 R14 | `grep -n 'toBe(33 + 1 + 1 - 1 - 1 + 1)' src/__tests__/consistency-classnames.test.ts` | 1 línea |
| Ficheros de producción que montan `PetHeroHeader` | `grep -rlF '<PetHeroHeader' src --include=*.tsx --exclude='*.test.tsx' --exclude-dir=__tests__` | 3 (home, health, profile; `map` importa del módulo solo `STATUS_TONE_CLASSES` y un tipo, y no cuenta) |
| Literal del título nuevo en producción | `grep -rlF 'text-3xl font-black tracking-tight text-foreground' src` | 0 |
| Candado del título viejo de Salud en su test | `grep -c "text-2xl font-black text-foreground" src/screens/health/index.test.tsx` | 1 |
| Ídem en los tests de Nutrición y Perfil | `grep -c "text-2xl font-black text-foreground" 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/profile/index.test.tsx` | 0 y 0 |
| Esquina continua en Nutrición según `#98 R10` | `grep -nF 'food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2)' src/__tests__/consistency-classnames.test.ts` | 1 línea |
| Total de esquina continua según `#98 R10` | `grep -nF 'count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1)' src/__tests__/consistency-classnames.test.ts` | 1 línea |
| `bg-accent-soft` en Perfil (`PetPills` y `change-photo`) | `grep -c 'bg-accent-soft' src/screens/profile/index.tsx` | 2 (#166 puede mover `change-photo`) |
| Recuentos globales de `bg-accent-soft` | `grep -cF 'toBe(16 + 2 + 1)' src/__tests__/consistency-classnames.test.ts` | 2 |
| Constante de timing de kcal | `grep -c 'const KCAL_BAR_TIMING = {' 'src/app/(tabs)/food.tsx'` | 1 |
| Recuento del catálogo | `grep -n 'expect(englishKeys).toHaveLength(' src/providers/__tests__/language-provider.test.tsx` | sin cambio (cero claves nuevas) |
| Dependencias | `git diff --stat <H0> -- package.json bun.lock` | vacío al cerrar |

## Requisitos funcionales

Convención de tests: `H` = `src/screens/health/index.test.tsx`,
`P` = `src/screens/profile/index.test.tsx`,
`F` = `src/app/(tabs)/__tests__/food.test.tsx` (en jest se escapa:
`'src/app/\(tabs\)/__tests__/food.test.tsx'`),
`A` = `src/__tests__/hero-header-amendments.test.ts`,
`C` = `src/__tests__/consistency-classnames.test.ts`,
`G` = `src/__tests__/tab-headers-canvas.test.ts` (fichero **nuevo** de #168).
Cada `describe` nuevo lleva el prefijo `#168 R<n>:`.

### R1 — Título grande del canvas en las tres pestañas, en todas sus ramas

- **R1.1**: WHEN se monta Salud, Nutrición o Perfil, en **cualquier** rama de
  datos, THE SYSTEM SHALL pintar un `Text` con `testID` `health-title`,
  `food-title` o `profile-title` respectivamente, con
  `className="text-3xl font-black tracking-tight text-foreground"` exacto
  (traducción del canvas 30 px / 900 / −0.02 em a la escala de Tailwind:
  `text-3xl` = 30 px, `tracking-tight` = −0.025 em, el paso más cercano; sin
  clases con corchetes) y con el texto de `t('health.health')`,
  `t('food.food')` o `t('profile.profile')` (ES «Salud» / «Nutrición» /
  «Perfil»; EN "Health" / "Food" / "Profile"; claves existentes).
- **R1.2**: THE SYSTEM SHALL renderizar ese título como primer nodo visible del
  scroll de la pantalla (en Perfil, dentro de la fila de título que ya existe,
  como su primer hijo), por encima de toda rama.
- **R1.3**: THE SYSTEM SHALL escribir ese `className` literal exactamente una
  vez en cada uno de los tres ficheros de pantalla y en ningún otro fichero de
  producción de `src/`.

Candados (un `it` por rama y pantalla; cláusula universal):

| Pantalla | Ramas que cubre un `it` cada una |
|---|---|
| Salud (`H`) | pendiente, `error`, `unreachable`, `missing-config`, sin mascotas (`ok` + `[]`), con mascotas |
| Nutrición (`F`) | `food-loading`, `food-error`, `food-empty`, con plan, sin plan (`food-plan-empty`), error de plan (`food-plan-error`) |
| Perfil (`P`) | mascotas pendientes, `profile-pets-empty`, `profile-pets-error`, detalle pendiente (`profile-hero-skeleton`), `profile-pet-error`, detalle cargado |

R1.3 se candea en `G` contando ocurrencias por fichero (1, 1, 1) y la lista
de ficheros de `src/` que contienen el literal (exactamente los tres).

### R2 — Salud sin hero: métricas estándar y orden de hijos fijo

- **R2.1**: THE SYSTEM SHALL dejar de importar y montar `PetHeroHeader` en
  `src/screens/health/index.tsx`.
- **R2.2**: THE SYSTEM SHALL dar al `ScrollView` `screen-health` el
  `contentContainerStyle`
  `{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }`
  (las métricas estándar de carta §Decisiones fijas 6, las mismas de Perfil y
  Nutrición; la excepción A9 queda solo para Inicio).
- **R2.3**: WHILE hay mascotas y la lista cargó (`ok` con ≥ 1), THE SYSTEM
  SHALL tener exactamente dos hijos en el contenedor del scroll, en este orden:
  `health-title`, `health-content`; `health-content` lleva `style={{ gap: 16 }}`
  y su **primer** hijo es el `PetSwitcher` (identificado por contener
  `pet-chip-<id>` de cada mascota), seguido de `vaccines-section` y de la
  weight card en el orden actual.
- **R2.4**: WHILE no hay contenido (pendiente, cualquier error, lista vacía),
  THE SYSTEM SHALL tener exactamente dos hijos: `health-title`, `health-states`;
  `health-states` lleva `style={{ gap: 16 }}` y ya **no** contiene el título.
- **R2.5**: WHEN se pulsa otro `pet-chip-<id>`, THE SYSTEM SHALL cambiar las
  vacunas y el peso a esa mascota (la conducta de #115 R3 sin hero: lo que
  cambia es dónde se ve la mascota seleccionada, no la selección).

### R3 — Vacunas: tile pastel por estado en cada fila

Para cada vacuna `v` de la lista (§Enmienda #70: cada fila, todas sus
decisiones):

- **R3.1**: THE SYSTEM SHALL pintar la fila `vaccine-row-${v.id}` como `Card`
  con `className="flex-row items-center gap-3"` y **exactamente dos** hijos en
  este orden: el tile `vaccine-tile-${v.id}` y la columna
  `vaccine-text-${v.id}` (`className="flex-1 gap-1"`), que contiene los textos
  actuales (nombre, aplicada y, solo si `v.nextDoseAt` no es `null`, próxima)
  con sus clases, su condición y su orden actuales (el `gap-1` sale de la
  `Card` y pasa a la columna).
- **R3.2**: THE SYSTEM SHALL dar al tile
  `` className={`size-10 items-center justify-center rounded-xl ${CATEGORY_SLOTS[slot].surface}`} ``
  y `style={CONTINUOUS_CORNER}`, con un único hijo: el icono a tamaño 20 y
  `color` igual al token `category-<slot>-strong` leído con `useThemeColors`.
- **R3.3**: IF `v.nextDoseAt !== null` y `v.nextDoseAt < today` (la misma
  comparación que hoy pinta `text-danger`) THEN THE SYSTEM SHALL usar
  `slot = 'rose'` e icono `Clock`.
- **R3.4**: WHEN no se cumple R3.3 y `v.id` es el de la próxima vacuna (la
  misma `nextVaccine` que alimenta `next-vaccine-card`), THE SYSTEM SHALL usar
  `slot = 'amber'` e icono `Clock`.
- **R3.5**: WHEN no se cumple ni R3.3 ni R3.4 (incluye `nextDoseAt === null`),
  THE SYSTEM SHALL usar `slot = 'green'` e icono `Check`.
- **R3.6**: THE SYSTEM SHALL marcar el tile como decorativo
  (`accessibilityElementsHidden` e `importantForAccessibility="no-hide-descendants"`):
  el estado ya lo dicen los textos de la columna; el color nunca es el único
  portador.

Nota de construcción: `nextVaccine` ya filtra `nextDoseAt >= today`, así que
la próxima vacuna nunca está vencida y R3.3 y R3.4 no se solapan; el orden
R3.3 → R3.4 → R3.5 se escribe igual por legibilidad, sin `it` de precedencia
(sería irrealizable con datos válidos).

Candados, un `it` por rama y sobre una sola fixture con cuatro vacunas
(vencida, próxima con `nextDoseAt === today`, futura que no es la próxima,
`nextDoseAt: null`): rose + `Clock`; amber + `Clock` (frontera: `today` no es
vencida, mata la mutación `<` → `<=`); green + `Check`; green + `Check`. Cada
`it` aserta con `within(vaccine-row-<id>)` el `children.length` de la fila
(2), el orden, el `className` del tile, su `style`, el `testID` del icono y su
color, y que la columna conserva su número de textos (3, 3, 3, 2). El reloj
del test se fija con `jest.useFakeTimers({ now })` y fechas que cruzan mes
(p. ej. hoy `2026-03-31`, vencida `2026-02-28`, futura `2026-04-02`).

### R4 — Perfil sin hero: tarjeta de mascota con avatar circular

- **R4.1**: THE SYSTEM SHALL dejar de importar y montar `PetHeroHeader` en
  `src/screens/profile/index.tsx`.
- **R4.2**: WHEN el detalle de la mascota cargó, THE SYSTEM SHALL pintar
  `<Card variant="secondary" testID="profile-pet-card" className="items-center gap-3">`
  con exactamente tres hijos en este orden:
  1. `<PetAvatar name={pet.name} photoUrl={pet.photoUrl} cacheKey={pet.id} size={96} testID="profile-pet-avatar" />`
     (las props que ya recibe en `pet-hero-header.tsx`; con foto pinta un
     `Image` circular con `source={{ uri, cacheKey }}`; sin foto o si la foto
     falla, el blobatar determinista `SvgXml` — carta §2; nunca huella ni
     inicial; el `testID` es el mismo en las dos ramas),
  2. `Text` `profile-pet-name` con `className="text-2xl font-black text-foreground"`
     y `pet.name`,
  3. la fila de chips `profile-pet-chips` (R5).
- **R4.3**: THE SYSTEM SHALL dejar `change-photo` y `photo-upload-error`
  **inmediatamente después** de `profile-pet-card`, fuera de ella, en el orden
  actual.
- **R4.4**: WHILE el detalle carga, THE SYSTEM SHALL pintar
  `profile-hero-skeleton` (conserva su nombre, como en #67 R6) con
  `className="h-52 w-full rounded-card"` (antes `h-80`: reserva el alto de la
  tarjeta, ≈ 32 + 96 + 12 + 32 + 12 + 28 = 212 px, el paso más cercano es
  `h-52` = 208 px).
- **R4.5**: WHEN el detalle trae `photoUrl`, THE SYSTEM SHALL mostrarla en
  `profile-pet-avatar`, y IF la subida de una foto nueva falla THEN THE SYSTEM
  SHALL conservar la anterior en `profile-pet-avatar` (las conductas que hoy se
  asertan sobre `pet-hero-media`). Ojo a la forma: `PetAvatar` pasa a `source`
  un **objeto** `{ uri, cacheKey }`; el hero pasaba un array. Los `it`
  reescritos esperan, p. ej.,
  `{ uri: 'http://example.test/old.jpg', cacheKey: 'pet-1' }`.
- **R4.6**: IF la mascota no tiene foto THEN THE SYSTEM SHALL pintar el
  blobatar en `profile-pet-avatar` (sin prop `source`) con `width` y `height`
  96. Candado propio, separado del de foto.

### R5 — Perfil: chips pastel por dato, color atado al dato y no al índice

- **R5.1**: THE SYSTEM SHALL reescribir `PetPills` (hoy un chip
  `rounded-full bg-accent-soft px-3 py-2` por dato, sin `testID`, con
  `key={pill}`) para pintar `profile-pet-chips` con
  `className="flex-row flex-wrap justify-center gap-2"` y, en este orden fijo
  (el actual), un chip por dato presente, con `key` igual al `testID` (no al
  texto: dos datos con el mismo texto no colisionan):

  | Dato | `testID` | Hueco | Texto |
  |---|---|---|---|
  | `pet.sex !== null` | `profile-pet-chip-sex` | `blue` | `pet.sex` **crudo** (carta §6; ver Pregunta 3) |
  | `pet.sterilized !== null` | `profile-pet-chip-sterilized` | `green` | `t('profile.sterilized')` o `t('profile.notSterilized')` |
  | `Number.isFinite(pet.ageMonths)` | `profile-pet-chip-age` | `amber` | `t('profile.ageMonths', { months })` |
  | `pet.currentWeightKg !== null` | `profile-pet-chip-weight` | `violet` | `` `${pet.currentWeightKg} kg` `` |

- **R5.2**: THE SYSTEM SHALL dar a cada chip
  `` className={`rounded-full px-3 py-1 ${CATEGORY_SLOTS[slot].surface}`} `` y a
  su único hijo `Text`
  `` className={`text-xs font-bold ${CATEGORY_SLOTS[slot].ink}`} ``.
- **R5.3**: IF un dato falta THEN THE SYSTEM SHALL omitir su chip sin mover el
  hueco de los demás (el hueco viaja con el dato).

Candados: fixture completa (4 chips: `children.length` 4, orden, `className`
de chip y de texto, texto por chip con `within`) y fixture con `sex` y
`sterilized` a `null` (2 chips: edad `amber` primero y peso `violet`
segundo). Los textos se asertan con literales ES de la fixture
(p. ej. «Esterilizado», «26 meses», «12.4 kg»), nunca importando el catálogo.

### R6 — Perfil: tile pastel en las cuatro filas de navegación

- **R6.1**: THE SYSTEM SHALL dar a cada una de las filas `documents-link`,
  `pairing-link`, `geofences-link` y `reminders-link`
  `className="flex-row items-center gap-3 rounded-xl bg-default px-3 py-2"`
  (sin `justify-between`; conserva su `style={CONTINUOUS_CORNER}`) y
  exactamente tres hijos en este orden: tile, `Text` de la etiqueta (añade
  `flex-1` a su `className` actual) y `ChevronRight`.
- **R6.2**: THE SYSTEM SHALL pintar el tile `<fila>-tile` con
  `` className={`size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS[slot].surface}`} ``,
  `style={CONTINUOUS_CORNER}`, decorativo como R3.6, y un icono a tamaño 18 con
  `color` del token `category-<slot>-strong`:

  | Fila | Hueco | Icono (`reicon-react-native`) |
  |---|---|---|
  | `documents-link` | `blue` | `FileText` |
  | `pairing-link` | `green` | `Wifi` |
  | `geofences-link` | `amber` | `Map` importado como `MapIcon` (no sombrear el global `Map`) |
  | `reminders-link` | `violet` | `Bell` |

- **R6.3**: THE SYSTEM SHALL conservar el destino de cada fila
  (`/pets/${pet.id}/docs`, `/pairing`, `/pets/${pet.id}/geofences`,
  `/reminders`), su etiqueta de catálogo y su posición actual
  (`reminders-link` sigue fuera del bloque de mascota).

Candados: un `it` por fila (cuatro), cada uno con `within(<fila>)`:
`children.length` 3, orden, `className` del tile, `style`, `testID` del
icono, color y destino al pulsar.

### R7 — Perfil: avatar de iniciales del usuario en la tarjeta de cuenta

- **R7.1**: WHEN `me` cargó (`me.data?.kind === 'ok'`), THE SYSTEM SHALL
  envolver la `View className="gap-1"` actual (nombre completo y email, sin
  cambios en sus `Text`) en `me-identity`
  (`className="flex-row items-center gap-3"`) cuyos hijos, en orden, son
  `me-avatar` (si hay iniciales) y esa `View`, que recibe
  `testID="me-identity-text"` y pasa a `className="flex-1 gap-1"`.
- **R7.2**: THE SYSTEM SHALL calcular las iniciales como el primer carácter de
  `firstName.trim()` seguido del primero de `lastName.trim()`, en mayúsculas
  con `toUpperCase()`, y pintarlas en `me-avatar-initials`
  (`className="text-sm font-black text-foreground"`) dentro de `me-avatar`
  (`className="size-10 items-center justify-center rounded-full bg-default"`,
  decorativo como R3.6).
- **R7.3**: IF las iniciales salen vacías (los dos nombres vacíos o en
  blanco) THEN THE SYSTEM SHALL no pintar `me-avatar` y `me-identity` tiene un
  único hijo.

Candados (tabla `it.each`, una fila por rama): «Ana»/«García» → `AG`;
« ana »/«» → `A`; «»/«núñez» → `N`; «élodie»/«ñúñez» → `ÉÑ`; «»/« » → sin
`me-avatar` y `children.length` 1.

### R8 — Nutrición: el anillo sustituye a la barra y al tile `ForkKnife`

- **R8.1**: THE SYSTEM SHALL convertir la fila superior de `food-plan-card` en
  `food-plan-summary` (`className="flex-row items-center gap-4"`), único hijo
  de la tarjeta, con exactamente dos hijos en orden: `food-plan-progress` y la
  columna de textos actual (objetivo diario, `food-plan-kcal`,
  `food-plan-grams`, con sus clases actuales; la columna añade `flex-1`).
- **R8.2**: THE SYSTEM SHALL eliminar `food-plan-track`, `food-plan-fill`, el
  tile `ForkKnife` (y su import si queda sin uso) y la cabecera de la barra.
- **R8.3**: THE SYSTEM SHALL pintar `food-plan-progress` con
  `className="size-26 items-center justify-center"` (104 px, el canvas) y
  exactamente tres hijos en orden: `food-plan-ring`
  (`View` con `className="absolute inset-0"` que contiene el `Svg`),
  `food-plan-percent` y `food-plan-consumed`.
- **R8.4**: THE SYSTEM SHALL dibujar en ese `Svg` (`width={104}`,
  `height={104}`, `viewBox="0 0 104 104"`) exactamente dos círculos, en orden:
  - `food-plan-ring-track`: `cx={52} cy={52} r={44} fill="none"
    stroke={accentForeground} strokeOpacity={0.2} strokeWidth={12}`;
  - `food-plan-ring-fill` (`Animated.createAnimatedComponent(Circle)`):
    `cx={52} cy={52} r={44} fill="none" stroke={accentForeground}
    strokeWidth={12} strokeLinecap="round"
    strokeDasharray={KCAL_RING_CIRCUMFERENCE} transform="rotate(-90 52 52)"`
    y `animatedProps` que solo llevan `strokeDashoffset`.
  `accentForeground` sale de la llamada a `useThemeColors` que ya existe en
  `food.tsx`: el token `'accent-strong'` (variable `accent`, que solo usaba el
  tile `ForkKnife`) se sustituye por `'accent-foreground'` en la misma
  posición (color estático: nunca `Color`/`PlatformColor`/variable CSS en
  Reanimated). En tests, el doble de `useThemeColors` devuelve el nombre del
  token, así que el `stroke` esperado es el literal `'accent-foreground'`.
  `KCAL_RING_CIRCUMFERENCE = 2 * Math.PI * 44`.
- **R8.5**: THE SYSTEM SHALL pintar `food-plan-percent` (`{kcalPct}%`) con
  `className="text-lg font-black text-accent-foreground"` y
  `food-plan-consumed` (`{kcal} kcal`) con
  `className="text-xs font-normal text-accent-foreground"`, ambos con
  `style={TABULAR_NUMS}` y los mismos valores que hoy.

### R9 — Nutrición: el anillo dice lo mismo que la barra, acotado a 100

- **R9.1**: THE SYSTEM SHALL calcular `strokeDashoffset` como
  `KCAL_RING_CIRCUMFERENCE * (1 - Math.min(kcalPct, 100) / 100)`, con el mismo
  `kcalPct` redondeado que pinta `food-plan-percent`.
- **R9.2**: IF `kcalPct > 100` THEN THE SYSTEM SHALL pintar el anillo lleno
  (`strokeDashoffset` 0) y el texto con el valor sin acotar (p. ej. «150%»).
- **R9.3**: THE SYSTEM SHALL conservar en `food-plan-progress` la semántica
  accesible de #113 R3 sin cambios: `accessible`,
  `accessibilityRole="progressbar"`,
  `accessibilityLabel={t('food.kcalConsumedOfTarget', { consumed, target })}`,
  `accessibilityValue={{ min: 0, max: 100, now: kcalPct }}`. Los `it` de
  `#113 R3` no se tocan.

Tabla de candado (filas del `it.each` de #113 R2 más una de acotado; el
desfase esperado se escribe **literal** con dos decimales, nunca importando
`KCAL_RING_CIRCUMFERENCE` ni recalculándolo con la fórmula):

| merKcal | kcal | texto % | `strokeDashoffset` (toBeCloseTo, 2) |
|---|---|---|---|
| 656 | 0 | 0% | 276.46 |
| 656 | 328 | 50% | 138.23 |
| 656 | 656 | 100% | 0 |
| 1420 | 890 | 63% | 102.29 |
| 1000 | 333 | 33% | 185.23 |
| 200 | 33 | 17% | 229.46 |
| 0 | 0 | 0% | 276.46 |
| 656 | 984 | 150% | 0 |

### R10 — Nutrición: el anillo transiciona al servir y deshacer, con reduce motion

- **R10.1**: WHEN `kcalPct` cambia (servir, deshacer, refetch), THE SYSTEM
  SHALL animar `strokeDashoffset` con
  `withTiming(Math.min(kcalPct, 100), KCAL_BAR_TIMING)` sobre un shared value
  en porcentaje, en el hilo de UI (`useAnimatedProps`), con `.get()`/`.set()`.
- **R10.2**: THE SYSTEM SHALL conservar `KCAL_BAR_TIMING` con su nombre y
  valor actuales (250 ms, `Easing.bezier(0.77, 0, 0.175, 1)`,
  `ReduceMotion.System`): la carta §Enmienda #152 la lista como pendiente de
  migrar a `motion.ts` y `src/screens/welcome/index.test.tsx` (`#153 E1`)
  candea ese texto. Renombrarla o migrarla queda fuera de alcance.
- **R10.3**: WHILE el sistema pide reducir movimiento, THE SYSTEM SHALL
  respetarlo vía `ReduceMotion.System` en la configuración del timing del
  anillo (el anillo salta al valor final). Candado propio: un `it` que aserta
  `reduceMotion: ReduceMotion.System` en la configuración con que se llamó a
  `withTiming` para el anillo, separado del `it` de la transición.

### R11 — Enmienda #168 a specs aprobadas y a la carta, con su candado

- **R11.1**: THE SYSTEM SHALL declarar en
  `specs/mobile-tab-headers-canvas/design.md` §Enmienda el bloque canónico,
  dentro de un fence que empieza por
  ```` ```markdown ```` seguido de la línea
  `## Enmienda #168 — título grande en Salud, Nutrición y Perfil`.
- **R11.2**: THE SYSTEM SHALL insertar ese bloque, con `<FEATURE>` y
  `<QUÉ CAMBIA>` sustituidos, su línea de firma propia
  `- [ ] Enmienda #168 aprobada por humano` (el humano la marca `[X]`) y el
  marcador en prosa, en estos cuatro documentos:

  | Documento | `<FEATURE>` | `<QUÉ CAMBIA>` | Marcador en prosa (y dónde) |
  |---|---|---|---|
  | `specs/mobile-health-make-parity/requirements.md` | `mobile-health-make-parity` | `R2 y R3: Salud abre con el título grande, sin hero` | `**Enmendado por #168 (B1)**: Salud ya no abre con el hero a sangre; abre con el título grande y el PetSwitcher como primer hijo de health-content (#168 R1, R2).` — línea siguiente al encabezado `### R2 — Hero a sangre con el patrón A9` |
  | `specs/mobile-pet-hero-header/requirements.md` | `mobile-pet-hero-header` | `R6: Profile deja el hero compartido; Home lo conserva` | `**Enmendado por #168 (B2)**: Profile deja el hero compartido y pinta profile-pet-card con PetAvatar circular; profile-hero-skeleton conserva su nombre y pasa a h-52 (#168 R4).` — línea siguiente al encabezado `### R6 — Profile sustituye su \`PetHero\` local por el compartido` |
  | `specs/mobile-kcal-consumed-bar/requirements.md` | `mobile-kcal-consumed-bar` | `R2, R4 y R7: el anillo sustituye a la barra` | `**Enmendado por #168 (B3)**: la barra y el tile ForkKnife se sustituyen por el anillo food-plan-ring; R4 y R7 se reescriben sobre el anillo; R3 y R5 no cambian (#168 R8-R10).` — línea siguiente al encabezado `### R2 — La tarjeta «Objetivo diario» pinta las kcal servidas contra \`merKcal\`` |
  | `docs/ui-guidelines.md` | `docs/ui-guidelines.md` | `regla N1: título grande en Salud, Nutrición y Perfil; hero solo en Inicio` | `**Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.` — al **final del fichero**, como sección nueva tras la última `## Enmienda` |

- **R11.3**: THE SYSTEM SHALL candear R11.2 con un `describe` nuevo
  `#168 R11: las specs enmendadas por #168 llevan su bloque` en `A`, con la
  técnica de `R10` de ese fichero (bloque literal leído del fence en tiempo de
  test; firma `[ ]` o `[X]`; marcador comparado con espacios colapsados).
- **R11.4**: THE SYSTEM SHALL dejar intactos los tres `it` de
  `R10: las specs enmendadas por #67 llevan su bloque` y su tabla
  `AMENDED_DOCS`: #168 no retira ni cambia ningún bloque, línea de firma ni
  marcador de #67 (en la carta solo **añade** al final; no toca
  `specs/mobile-pet-hero-header/design.md`, ni `docs/conventions.md`, ni
  `specs/mobile-figma-polish/*`, ni `specs/mobile-pets-profile/*`).

### R12 — Candados globales por delta, grep-clean y alcance cerrado

- **R12.1** (`C`): THE SYSTEM SHALL mover, por delta sobre la cifra medida
  al arrancar (tras #166), estos candados de `style={CONTINUOUS_CORNER}`:
  Salud **+ 1** (tile de vacuna), Nutrición **− 1** (sale el tile
  `ForkKnife`), Perfil **+ 4** (cuatro tiles de navegación; el avatar de
  iniciales es cápsula y no lleva esquina continua). Son estos sitios:
  - `#62 R14`: filas de `directUses` de los tres ficheros y la suma esperada
    con el sumando comentado `+ 1 - 1 + 4 // #168 R3, R8, R6`;
  - `#98 R10` (`deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`):
    `food.match(/style=\{CONTINUOUS_CORNER\}/g)` pasa de `toHaveLength(2)` a
    `toHaveLength(1)` y el total `count(/style=\{CONTINUOUS_CORNER\}/g)` suma
    `+ 4 // #168`;
  - cualquier otro recuento con cifra que el
    `grep -rn 'CONTINUOUS_CORNER' src/__tests__` del arranque muestre sobre
    alguno de los tres ficheros o sobre el total.
- **R12.1b** (`C`): THE SYSTEM SHALL restar **1** a los dos recuentos globales
  de `bg-accent-soft` (en `#98 R10` y en
  `conserva los usos de bg-accent-soft que sí son acento`), con el sumando
  comentado `- 1 // #168 R5: PetPills pasa a huecos pastel`, sobre la cifra
  medida tras #166 (que reescribe `change-photo`, el otro uso de Perfil). Los
  tiles y chips nuevos no contienen `bg-accent-soft` ni `rounded-xl bg-accent`.
- **R12.2** (`G`): THE SYSTEM SHALL dejar el JSX `<PetHeroHeader` solo en
  `src/screens/home/index.tsx` entre los ficheros de producción de `src/`
  (base: 3 ficheros; el `import` de `STATUS_TONE_CLASSES` y
  `PetHeroStatusTone` desde `src/screens/map/index.tsx` no cambia ni cuenta).
- **R12.3** (`G`): THE SYSTEM SHALL no usar en
  `src/screens/health/index.tsx`, `src/screens/profile/index.tsx`,
  `src/app/(tabs)/food.tsx` ni en sus tres ficheros de test clases con
  corchetes, literales hex, `StyleSheet`, ni `text-accent` suelto (los guards
  de `design-drift`, `legibility-classnames` y `consistency-classnames`
  siguen verdes sin tocar sus tablas, salvo R12.1).
- **R12.4**: THE SYSTEM SHALL añadir cero claves de catálogo (el recuento de
  `language-provider.test.tsx`, `ui-copy-table.ts`/`SCREEN_FILES` y
  `specs/mobile-ui-language/design.md` no se mueven), cero ficheros de
  pantalla y cero dependencias (`react-native-svg` 15.15.4 y Reanimated 4.5.1
  ya están instaladas; `package.json` y `bun.lock` sin diff).
- **R12.5**: THE SYSTEM SHALL no modificar `src/components/pet-hero-header.tsx`
  (Inicio lo sigue usando; el fichero es de #168 solo para que nadie más lo
  toque en este ciclo).

### R13 — Gate humano: smoke en dev build de Android

- **R13**: WHEN Codex y el reviewer terminan, THE SYSTEM SHALL ser probado por
  el humano en **dev build de Android** (nunca Expo Go), con la casilla de
  firma propia de abajo. El leader no marca `done` sin ella.

Lista del smoke:

- [ ] S1 — Tema claro, ES: Salud, Nutrición y Perfil abren con «Salud»,
  «Nutrición», «Perfil» en grande; Inicio sigue con su hero a sangre.
- [ ] S2 — Tema oscuro: los tres títulos, los tiles pastel y los chips se leen
  (contraste de `category-*-strong` sobre `category-*`).
- [ ] S3 — EN: «Health», «Food», «Profile»; ningún título se corta.
- [ ] S4 — Salud: una vacuna vencida sale con tile rosa y reloj; la próxima con
  tile ámbar; las demás con tile verde y check.
- [ ] S5 — Perfil: mascota con foto muestra la foto circular; sin foto, el
  blobatar. Cambiar foto actualiza el círculo.
- [ ] S6 — Perfil: chips azul/verde/ámbar/violeta en ese orden; las cuatro filas
  con su tile; el avatar de cuenta muestra tus iniciales.
- [ ] S7 — Nutrición: servir una comida llena el anillo con una transición
  corta; deshacer lo vacía. Con «Quitar animaciones» activo en Android
  (Ajustes → Accesibilidad), el anillo salta sin animar.
- [ ] S8 — Nutrición: con TalkBack, el anillo se lee como una única barra de
  progreso con la frase de kcal consumidas de objetivo.
- [ ] S9 — Nutrición: «1200 kcal / día» (o el objetivo real) cabe junto al
  anillo sin solaparse; con texto del sistema grande puede partir línea pero no
  se tapa.
- [ ] S10 — Cambiar de mascota en Salud y en Perfil sigue funcionando sin hero.

## Fuera de alcance (cada viñeta clasificada)

Delimitaciones (no son features nuevas):

- `WeightChart`, la weight card de Salud, su sparkline y su delta → **#169**.
- Mapa e Inicio: sin cambios. `pet-hero-header.tsx` no se toca (R12.5).
- La sección ámbar «Próxima dosis» del canvas: `next-vaccine-card` se queda
  como está (R3 solo añade tiles a las filas).
- Nutrición más allá del anillo: tiles de «Comidas hoy», chips «Servido»,
  tarjeta violeta de IA y enlaces de horario/historial quedan como están.
- Perfil: rejilla 2×2 de tiles del canvas (se quedan filas con tile), botón
  de cámara superpuesto al avatar (`change-photo` sigue debajo), píldora
  «Añadir mascota» (es `profile-add-pet`, de #166), casilla de tema e idioma.
- `PetSwitcher` con círculos de iniciales en la cabecera: no se rediseña.
- Copy del canvas: no se adopta ningún literal nuevo (cero claves; ver
  Pregunta 2).
- Migrar `food.tsx` a `src/screens/food/` (deuda #102): no se hace aquí
  (design.md §Alternativas).
- Migrar `KCAL_BAR_TIMING` a `motion.ts`: pendiente de la feature que nombra
  la carta §Enmienda #152.

Candidatas a feature propia (las decide el humano, no se crean aquí):

- Mapear `pet.sex` a texto de catálogo (Pregunta 3).
- Rediseño de `PetSwitcher` en la cabecera (Pregunta 4).

## Preguntas abiertas

1. **#119 `mobile-hero-food-and-detail`** pide hero fotográfico en Nutrición,
   lo contrario de N1. Opciones:
   (a) **cancelar**: se pierde la parte de pantallas de detalle (A11/A13 de
   #95), que nadie más cubre;
   (b) **reescribir** a solo pantallas de detalle: conserva ese valor, exige
   una spec nueva y que respete la regla N1 de la carta;
   (c) **absorber** en #168: ensancha un PR ya grande con pantallas ajenas a
   las pestañas.
   Recomendación de esta spec: (b). #168 no toca la entrada de #119.
2. **Copy del canvas**: #168 no añade claves. Diferencias medidas contra
   `src/i18n/catalog.ts` que el humano puede querer adoptar en otra feature:
   `profile.gpsSettings` ES «Configuración del Dispositivo GPS» / EN "GPS
   device settings" frente a «Collar GPS» del canvas (propuesta, si se
   adopta: ES «Collar GPS» / EN "GPS collar"); «Próxima dosis», «Comidas hoy»,
   «Recomendación IA» y «Vinculado» tienen ya clave o no entran en #168. Por
   defecto: sin cambios.
3. **Sexo crudo**: la carta §6 dice que `pet.sex` se pinta crudo y
   `design-drift.test.ts` candea esa lista; el brief del leader dice que no se
   pinta crudo. Por defecto, crudo (`sex: string | null` en
   `src/api/types.ts`). Si el humano quiere mapearlo: feature propia con dos
   claves por cada valor que devuelva el backend (p. ej. ES «Macho»/«Hembra»,
   EN "Male"/"Female"), enmienda a carta §6 y al candado de `design-drift`.
4. **Iniciales del switcher en la cabecera** (canvas: círculos R/L a la
   derecha del título): por defecto no; el `PetSwitcher` actual sigue debajo
   del título.
5. **Partición**: el alcance supera a #155/#159. Por defecto, un PR con tres
   tandas de commits (Salud R1–R3, Perfil R4–R7, Nutrición R8–R10, con R11–R12
   al final). Si el humano prefiere tres PR: 168a = R1 (solo Salud), R2, R3,
   R11 (fila B1 y carta), R12; 168b = R1 (Perfil), R4–R7, R11 (B2), R12;
   168c = R1 (Nutrición), R8–R10, R11 (B3), R12; R13 se reparte por pantalla.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Enmienda #168 aprobada por humano en los cuatro documentos de R11.2
  (cada uno lleva su casilla `- [ ] Enmienda #168 aprobada por humano`; los
  bloques los inserta Codex en el bloque L de `tasks.md`, así que el humano
  las marca tras la implementación y antes del cierre; el leader no marca
  `done` sin ellas)
- [ ] Prueba de humo R13 superada en dev build de Android (fecha: ____,
  dispositivo: ____) ← gate de cierre; el leader no marca `done` sin ella
