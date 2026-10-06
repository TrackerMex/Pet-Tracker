---
feature: mobile-health-make-parity
id: 115
status: approved
tags: [harness, spec, mobile, ui]
base: 8afae724
---

# #115 — mobile-health-make-parity: requisitos

> Orden: la descripción de la feature dice "va AL FINAL"; queda sustituida por
> el orden del bloque UI que fijó el humano (#118 → #117 → #116 → #115 → #119).
> #118 y #116 ya están mergeadas en la base `8afae724`.

## Contexto y decisiones cerradas

La pestaña Salud (`mobile-pet-tracker/src/screens/health/index.tsx`) frente a
`HealthScreen` del Make (`specs/mobile-figma-polish/design-src/App.tsx`,
`function HealthScreen`) tiene tres huecos: (1) la card de peso no dibuja la
evolución, (2) no hay hero de la mascota, (3) el próximo evento muestra la
fecha ISO cruda y no dice cuántos días faltan. "Expediente médico" queda fuera.

| # | Decisión | Cierre | Por qué |
|---|---|---|---|
| D1 | Registros de peso pedidos | La misma consulta que weight-log: `queryKey: healthKeys.weights(selectedPetId ?? '', undefined)` y `queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!)`, sin `limit`. El backend aplica `WEIGHTS_DEFAULT_LIMIT = 50` (`backend-pet-tracker/src/modules/health/application/dto/weight.dto.ts`), más reciente primero. | Una sola entrada de caché compartida con weight-log (`src/screens/weight-log/index.tsx` usa `healthKeys.weights(petId, undefined)`): el `refetch` tras guardar en weight-log refresca también Salud. Cero backend. |
| D2 | Gráfica | `<WeightChart entries={weight.data.weights} />` (`src/components/weight-chart.tsx`, sin cambios) dentro de `weight-card`, entre la fila de variación y `weight-log-link`, solo cuando `weight.data.kind === 'ok'` y `weights.length > 0`. | Con 0 registros el estado vacío con CTA ya existe (`weight-card-empty` + `weight-log-link`, que se pinta siempre): no se dibuja una gráfica vacía. Con 1 registro el propio componente pinta `weight-chart-empty` ("Aún no hay datos suficientes"). Con 2 o más, el Svg `weight-chart`. |
| D3 | Fila de variación | Se conserva tal cual (`weight-variation` con `fmtVariation(weights[0].variation)`). | Ya existe; el backend calcula la variación contra el registro anterior. |
| D4 | Hero | `PetHeroHeader` con `variant="bleed"` como primer hijo del scroll, con el patrón A9 de Home (#67). | La carta (`docs/ui-guidelines.md`) permite A9 a cualquier pantalla con cabecera a sangre. A11 y A13 (y A15, A18, A19, A20) solo rigen pantallas Stack con header nativo y no listan Salud; ninguna dice nada del hero. No hace falta enmienda. |
| D5 | Datos del hero | `pet = pets.data.pets.find((pet) => pet.id === selectedPetId) ?? null`, sin consulta de detalle, sin `status` y sin `highlight`. | El `PetProfile` de `listPets` ya trae `name`, `breed` y `photoUrl`. Sin `status` el hero no pulsa: cero movimiento nuevo. |
| D6 | Slot del hero | Solo el `PetSwitcher`, como Home. El título `health.health` vive solo en `health-states`. | Igual que Home: con contenido, la identidad la dan la pestaña y el nombre del hero. Se mantiene una sola llamada `t('health.health')`. |
| D7 | Fecha del próximo evento | `fmtDate(nextVaccine.nextDoseAt, locale)`, con `fmtDate` importado tal cual de `../home/format` y `locale = useLocale()` de `../../providers/language-provider`. | Ya existe y ningún candado prohíbe importar de otra pantalla. |
| D8 | Días restantes | `days = calendarDaysUntil(nextVaccine.nextDoseAt, new Date())`, importado tal cual de `../home/format`. Texto: `t('home.nextVaccineToday')` si `days === 0`; si no, `t('home.nextVaccineDays', { days })`. `accessibilityLabel`: `t('home.nextVaccineDaysLeft', { days })` solo si `days > 0`; con 0 no hay prop y el lector lee "Hoy" del propio texto. | Reuso de claves de Home (precedente: `pairing.battery` en el mapa desde #116 R5). Una sola llamada directa por clave. |
| D9 | Dosis vencidas | El filtro de `nextVaccine` (`nextDoseAt !== null && nextDoseAt >= localTodayIso()`) no cambia. `home.nextVaccineOverdue` no se usa. | Una dosis pasada nunca es "próxima", así que `days` nunca es negativo; la fila de la vacuna vencida sigue en `text-danger`. |
| D10 | Movimiento | Ninguno nuevo. | Gate de frecuencia: Salud es una pestaña de uso diario y el único cambio por acción del usuario es el cambio de mascota, que en Home también es instantáneo. |
| D11 | Copy | 0 claves nuevas. | Las tres claves que hacen falta ya existen en `src/i18n/catalog.ts`. La explore (`progress/explore_ui-appllama.md` §4) estimaba 4-6; era una premisa falsa. |

## Medidas en la base (`8afae724`)

Todas con `grep -cF '<literal>' <ruta>` desde la raíz del repo, salvo las dos
marcadas `-cE`. `H` = `mobile-pet-tracker/src/screens/health/index.tsx`.

| Ruta | Literal | Base | Tras #115 |
|---|---|---|---|
| H | `healthKeys.weights(selectedPetId ?? '', 1)` | 1 | 0 |
| H | `healthKeys.weights(selectedPetId ?? '', undefined)` | 0 | 1 |
| H | `selectedPetId!, fetch, 1)` | 1 | 0 |
| H | `<WeightChart entries={weight.data.weights} />` | 0 | 1 |
| H | `<PetHeroHeader` | 0 | 1 |
| H | `variant="bleed"` | 0 | 1 |
| H | `from '../home/format'` | 0 | 1 |
| H | `calendarDaysUntil(` | 0 | 1 |
| H | `fmtDate(` | 0 | 1 |
| H | `useLocale()` | 0 | 1 |
| H | `{nextVaccine.nextDoseAt}` | 1 | 0 |
| H | `testID="next-vaccine-days"` | 0 | 1 |
| H | `testID="next-vaccine-date"` | 0 | 1 |
| H | `testID="health-states"` | 0 | 1 |
| H | `testID="health-content"` | 0 | 1 |
| H | `padding: 24` | 1 | 0 |
| H | `paddingHorizontal: 24` | 0 | 2 |
| H | `insets.top + 12` | 1 | 1 |
| H | `insets.bottom + 96` | 1 | 1 |
| H | `style={TABULAR_NUMS}` | 2 | 3 |
| H | `style={CONTINUOUS_CORNER}` | 2 | 2 |
| H | `text-accent-strong` | 1 | 1 |
| H | `text-warning-strong` | 1 | 2 |
| H | `t('health.health')` | 1 | 1 |
| H | `<PetSwitcher` | 1 | 1 |
| H | `home.nextVaccineOverdue` | 0 | 0 |
| H | `getPet` | 0 | 0 |
| H | `react-native-reanimated` | 0 | 0 |
| H | `StyleSheet.create` | 0 | 0 |
| H | `-cE '#[0-9A-Fa-f]{3,8}\b'` (hex) | 0 | 0 |
| H | `-cE '\w-\['` (clases arbitrarias) | 0 | 0 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/health/index.tsx', key: 'home.` | 0 | 3 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5` | 1 | 0 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `[join('screens', 'health', 'index.tsx'), 2],` | 2 | 1 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5` | 1 | 0 |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | `padding: 24, paddingBottom: 120` | 1 | 0 |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | `expect.any(Function)` | 2 | 0 |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | `healthKeys.weights('pet-1', undefined)` | 0 | 1 |

Fechas de `fmtDate` medidas en node con los locales reales de la app
(`LOCALES = { es: 'es-MX', en: 'en-US' }` en `src/i18n/catalog.ts`):
`2026-12-31` → `31 dic 2026` / `Dec 31, 2026`; `2027-01-01` → `1 ene 2027` /
`Jan 1, 2027`; `2027-01-02` → `2 ene 2027` / `Jan 2, 2027`; `2027-02-03` →
`3 feb 2027`; `2027-12-31` → `31 dic 2027`; `2099-05-01` → `1 may 2099`.

## Requisitos

Convenciones de todos los requisitos:

- Los tests se corren desde `mobile-pet-tracker/`. El fichero de pantalla es
  `src/screens/health/index.test.tsx` (sin paréntesis: no hace falta escapar).
- Cada `describe` nuevo empieza por `#115 Rn:`. Los `it` existentes que se
  adaptan conservan su título, salvo el de `#87 R13` (R4).
- Esperas sobre el árbol renderizado (`docs/conventions.md` §Tests, esperas):
  la espera termina en la misma observación que asevera el test; toda
  aserción de ausencia va después de una aserción positiva del mismo
  escenario. Nunca se espera al contador de llamadas de un mock.
- Los hijos se cuentan por `node.children` del nodo host (no por testID),
  con un helper `elementChild(node, index)` igual en intención al de
  `src/components/__tests__/pet-hero-header.test.tsx`: falla si el hijo es
  texto. RNTL 14 no tiene `UNSAFE_*`; los nodos exponen `parent`.
- Fixtures por defecto del fichero: `makePet()` = `pet-1` "Luna", raza
  "Mixed", `photoUrl: null`; `makeVaccine()` = `vaccine-1` "Rabies";
  `makeWeight()` = `weight-1`, `12.4`, `2026-08-21`, variación `0.4`. Insets
  mockeados `{ top: 40, bottom: 24 }`, así que `insets.top + 12` = 52 e
  `insets.bottom + 96` = 120.

### R1 — Copy: cero claves nuevas, tres claves de Home reusadas

THE SYSTEM SHALL resolver todo el copy nuevo de Salud con estas tres claves
existentes, con exactamente una llamada directa `t('<clave>'` por clave en
`H`, y ninguna clave nueva en el catálogo:

| Clave | EN | ES | Uso en Salud |
|---|---|---|---|
| `home.nextVaccineDays` | `{{days}} d` | `{{days}} d` | texto de `next-vaccine-days` cuando `days > 0` |
| `home.nextVaccineDaysLeft` | `In {{days}} days` | `Faltan {{days}} días` | `accessibilityLabel` de `next-vaccine-days` cuando `days > 0` |
| `home.nextVaccineToday` | `Today` | `Hoy` | texto de `next-vaccine-days` cuando `days === 0` |

`home.nextVaccineOverdue` no se usa en `H` (ancla 0).

| Test (describe › it) | Fichero | Asevera |
|---|---|---|
| `#65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas` | `src/__tests__/ui-language.test.ts` | `R5_HEALTH` crece en 3 filas, `{ file: 'src/screens/health/index.tsx', key: 'home.nextVaccineDays' }`, `…'home.nextVaccineDaysLeft'` y `…'home.nextVaccineToday'`, insertadas justo después de `{ file: 'src/screens/health/index.tsx', key: 'health.weightLog' },` en `src/__tests__/ui-copy-table.ts`. La longitud pasa a la expresión de R7. `checkUses(R5_HEALTH)` encuentra 1 uso por fila. |
| `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta` | `src/__tests__/ui-language.test.ts` | Sin edición propia: `ALL_USES` incluye `...R5_HEALTH`, así que las 3 filas nuevas también pasan por `checkUses(ALL_USES)` (1 uso por fila). `cuadra ALL_USES con la suma de sus bloques` se ajusta solo. |
| las de R6 | `src/screens/health/index.test.tsx` | los literales EN y ES de la tabla, renderizados. |

Sin cambios (anclas negativas, ver R7): longitud del catálogo en
`src/providers/__tests__/language-provider.test.tsx`, `SCREEN_FILES` en
`src/__tests__/ui-language.test.ts` (Salud ya está en `ALL_USES`) y
`specs/mobile-ui-language/design.md` (una fila por clave, no por uso).

### R2 — Hero a sangre con el patrón A9

- WHEN la lista de mascotas resuelve `ok` con al menos una mascota THE SYSTEM
  SHALL pintar como únicos hijos del contenedor del scroll `screen-health`,
  en este orden, `pet-hero` (de `PetHeroHeader` con `variant="bleed"`) y
  `health-content`, con `health-content.props.style` exactamente
  `{ paddingHorizontal: 24, gap: 16 }` y `vaccines-section` y `weight-card`
  dentro de `health-content`, sin `health-states`.
- WHILE la lista de mascotas está pendiente, en error (`error`,
  `unreachable`, `missing-config`) o vacía THE SYSTEM SHALL pintar
  `health-states` con `props.style` exactamente
  `{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }`, con el
  título `health.health` (`text-2xl font-black text-foreground`) y la rama que
  toque (`health-loading`; `health-error` + `health-retry`; `health-empty`),
  sin `pet-hero` ni `health-content`.
- THE SYSTEM SHALL fijar el `contentContainerStyle` de `screen-health` a
  exactamente `{ gap: 16, paddingBottom: insets.bottom + 96 }` en todas las
  ramas.
- WHEN hay contenido THE SYSTEM SHALL no pintar el título "Salud".

| Test (describe › it) | Fixture | Asevera |
|---|---|---|
| `#115 R2: Salud abre con el hero a sangre (A9) › con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` | 1 mascota, vacunas y peso `ok` | espera `pet-hero-name`; `hero.parent === content.parent`; ese padre tiene `children.length === 2`, `[0]` es `pet-hero` y `[1]` es `health-content`; **(Enmienda E1.1)** el padre de ese padre es el scroll: `expect(hero.parent!.parent).toBe(screen.getByTestId('screen-health'))`, en la línea siguiente a `expect(hero.parent).toBe(content.parent);`; `pet-hero.props.className === 'overflow-hidden bg-default'`; `health-states` es `null` |
| `… › saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll` | igual | `contentContainerStyle` `toEqual({ gap: 16, paddingBottom: 120 })`; `health-content` style `toEqual({ paddingHorizontal: 24, gap: 16 })`; `within(health-content)` contiene `vaccines-section` y `weight-card` |
| `… › con contenido no pinta el título Salud` | igual | tras ver `pet-hero-name`, `queryByText('Salud')` es `null` |
| `… › sin contenido ($name), agrupa título y rama en health-states sin hero` (`it.each`) | 5 filas: pendiente (`pending()`), `{ kind: 'error' }`, `{ kind: 'unreachable', message: 'network down' }`, `{ kind: 'missing-config' }`, `{ kind: 'ok', pets: [] }` | espera la rama (`health-loading`, `health-error` o `health-empty`) dentro de `health-states`; `health-states` style `toEqual({ paddingHorizontal: 24, paddingTop: 52, gap: 16 })`; `within(health-states).getByText('Salud')`; **(Enmienda E3.3)** su `props.className` `toBe('text-2xl font-black text-foreground')`; `contentContainerStyle` `toEqual({ gap: 16, paddingBottom: 120 })`; `pet-hero` y `health-content` son `null` |
| `R4: health resuelve la mascota seleccionada › shows the hub and a loading state while pets are pending` (adaptado) | existente | `objectContaining({ padding: 24, paddingBottom: 120 })` pasa a `toEqual({ gap: 16, paddingBottom: 120 })` |
| `R4: … › R5 (mobile-design-drift): aplica el safe area superior al contenido` (adaptado) | existente | la aserción de `paddingTop: 52` pasa de `contentContainerStyle` a `health-states.props.style` (`toEqual` del objeto completo de arriba) |

### R3 — El hero muestra la mascota seleccionada de la lista

- WHEN hay contenido THE SYSTEM SHALL pasar a `PetHeroHeader` la mascota de
  `pets.data.pets` cuyo `id` es `selectedPetId` (o `null` si no está), sin
  `status` ni `highlight`, y con el `PetSwitcher` como único hijo del slot.
- WHEN el usuario pulsa otra mascota en el `PetSwitcher` THE SYSTEM SHALL
  mostrar en el hero el nombre de esa mascota.

| Test (describe › it) | Fixture | Asevera |
|---|---|---|
| `#115 R3: el hero muestra la mascota seleccionada de la lista › pinta nombre, raza y media de la mascota sin estado ni dato destacado` | `makePet()` (sin foto) | `pet-hero-name` tiene texto `Luna`, `pet-hero-breed` `Mixed`, existe `pet-hero-media`; tras eso `pet-hero-skeleton`, `pet-hero-status` y `pet-hero-highlight-value` son `null` |
| `… › pone el PetSwitcher en el slot del hero` | igual | `within(pet-hero-slot).getByTestId('pet-chip-pet-1')` |
| `… › cambia el hero al pulsar otra mascota` | `pet-1` "Luna" y `pet-2` "Max" | espera `pet-hero-name` = `Luna`; pulsa `pet-chip-pet-2`; espera `pet-hero-name` = `Max` dentro de `pet-hero` |

### R4 — Salud pide el historial de peso con la clave de weight-log

THE SYSTEM SHALL pedir los pesos con
`listWeights(baseUrl, token ?? '', selectedPetId!)` (tres argumentos) bajo
`healthKeys.weights(selectedPetId ?? '', undefined)`, y no bajo
`healthKeys.weights(…, 1)`.

| Test (describe › it) | Fixture | Asevera |
|---|---|---|
| `R4: … › keeps API order and selects the first pet by default` (adaptado) | existente | `mockListWeights` `toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1')`: se quitan `expect.any(Function),` y `1,` |
| `R4: … › selects a pressed pet and reloads its health records` (adaptado) | existente | igual con `'pet-2'` |
| `#87 R13: HealthScreen lee por TanStack Query › deja mascotas, vacunas y el historial de peso en sus claves canónicas` (retitulado desde `… y un solo peso …`) | existente | `getQueryData(healthKeys.weights('pet-1', undefined))` `toEqual(weightsState)` y `getQueryData(healthKeys.weights('pet-1', 1))` `toBeUndefined()` |

### R5 — La weight card dibuja la evolución con WeightChart

- WHEN el peso resuelve `ok` con al menos un registro THE SYSTEM SHALL pintar
  `WeightChart` con el array `weight.data.weights` entero y en el orden de la
  API, como tercer hijo de `weight-card`: `[0]` la fila de título y peso
  actual, `[1]` la fila de `weight-variation`, `[2]` la salida de
  `WeightChart`, `[3]` `weight-log-link` (4 hijos).
- WHEN el peso resuelve `ok` sin registros, en error (`error` o
  `unreachable`) o está pendiente THE SYSTEM SHALL no pintar `weight-chart`
  ni `weight-chart-empty`.

`WeightChart` se espía envolviendo el componente real
(`jest.requireActual('../../components/weight-chart')`), para que el árbol
siga siendo el real; las props del espía se leen solo después de esperar el
nodo en el árbol.

| Test (describe › it) | Fixture de pesos | Asevera |
|---|---|---|
| `#115 R5: la weight card dibuja la evolución con WeightChart › con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace` | 3 registros, más reciente primero: `weight-3` 12.4 `2026-08-21` variación 0.4; `weight-2` 12.0 `2026-08-14`; `weight-1` 11.8 `2026-08-07` | espera `weight-chart`; `weight-card` tiene 4 hijos; `[2]` es o contiene `weight-chart`; `[1]` contiene `weight-variation` con `+0.4 kg`; `[3]` es `weight-log-link`; `weight-current` dice `12.4 kg`; la última llamada del espía recibe `entries` con ids `['weight-3', 'weight-2', 'weight-1']` |
| `… › con un registro, muestra el aviso de datos insuficientes de WeightChart` | `[makeWeight()]` | espera `weight-chart-empty` con texto `Aún no hay datos suficientes`; `weight-card` tiene 4 hijos y `[2]` es `weight-chart-empty`; `weight-chart` es `null` |
| `… › sin registros, deja el estado vacío y el enlace sin gráfica` | `[]` | espera `weight-card-empty`; `weight-card` tiene 3 hijos (`[1]` `weight-card-empty`, `[2]` `weight-log-link`); `weight-chart` y `weight-chart-empty` son `null` |
| `… › con error de peso ($kind), no pinta gráfica` (`it.each`) | `{ kind: 'error' }` y `{ kind: 'unreachable', message: 'network down' }` | espera `weight-card-error`; `weight-chart` y `weight-chart-empty` son `null` |
| `… › mientras el peso carga, no pinta gráfica` | `pending()` | espera `weight-log-link`; `weight-card` tiene 2 hijos; `weight-chart` y `weight-chart-empty` son `null` |

### R6 — La próxima vacuna dice su fecha y los días que faltan

- WHEN hay próxima vacuna THE SYSTEM SHALL pintar en `next-vaccine-card`
  tres hijos: `[0]` el tile del icono, `[1]` la columna (`flex-1 gap-1`) con
  tres textos, `[0]` `health.nextDue`, `[1]` el nombre y `[2]`
  `next-vaccine-date`, y `[2]` `next-vaccine-days`.
- THE SYSTEM SHALL pintar en `next-vaccine-date` (`font-normal text-muted`)
  `fmtDate(nextDoseAt, locale)` en el locale del idioma activo, y nunca la
  fecha ISO.
- THE SYSTEM SHALL pintar `next-vaccine-days` con `className` exacto
  `text-lg font-black text-warning-strong` y `style={TABULAR_NUMS}`.
- WHEN `days === 0` THE SYSTEM SHALL pintar `home.nextVaccineToday` sin
  `accessibilityLabel`.
- WHEN `days > 0` THE SYSTEM SHALL pintar `home.nextVaccineDays` con
  `accessibilityLabel` `home.nextVaccineDaysLeft`, ambos con `{ days }`.

Tabla de fechas: `jest.useFakeTimers()` + `jest.setSystemTime(<ahora>)` en
el `it`, y `jest.useRealTimers()` en `afterEach` del `describe`. `<ahora>` se
construye en hora local con `new Date(año, mes - 1, día, hora, minuto)`, con
la hora y el minuto leídos de la columna «Ahora» (**Enmienda E1.2**: antes se
fijaba `12, 0` y la hora de la columna no se usaba).

Columna `TZ` (**Enmienda E1.2**): zona horaria del proceso durante el `it`.
Se fija antes de `jest.useFakeTimers()` con
`const hostProcess = process.getBuiltinModule('process');` y
`hostProcess.env.TZ = <TZ>`, y se restaura en un `finally` del propio `it`
(`if (previousTZ === undefined) delete hostProcess.env.TZ; else hostProcess.env.TZ = previousTZ;`),
como `src/screens/meal-schedule/index.test.tsx` (#147 E1.2).
`process.env.TZ` no sirve: jest copia `process.env` y el cambio no llega a
`Date`.

Cada fila usa dos vacunas, "Parvo" (la pasada) y "Rabies" (la próxima), salvo la fila
e. Para las filas en inglés, `renderHealth` acepta un idioma opcional
(`'es'` por defecto) que llega a `LanguageProvider initial`.

| Fila | Idioma | TZ | Ahora (local) | Vacunas (`nextDoseAt`) | Texto de días | `accessibilityLabel` | Fecha | Cruza |
|---|---|---|---|---|---|---|---|---|
| a | es | `UTC` | 2026-12-31 12:00 | Parvo `2026-12-30`, Rabies `2026-12-31` | `Hoy` | `undefined` | `31 dic 2026` | — |
| b | es | `UTC` | 2026-12-31 12:00 | Parvo `2026-12-30`, Rabies `2027-01-02` | `2 d` | `Faltan 2 días` | `2 ene 2027` | mes y año |
| c | es | `UTC` | 2027-01-01 12:00 | Parvo `2026-12-31`, Rabies `2027-01-01` | `Hoy` | `undefined` | `1 ene 2027` | año (el filtro descarta la del año anterior) |
| d | es | `UTC` | 2027-01-30 12:00 | Parvo `2027-01-29`, Rabies `2027-02-03` | `4 d` | `Faltan 4 días` | `3 feb 2027` | mes |
| e | es | `UTC` | 2026-12-31 12:00 | Rabies `2027-12-31` | `365 d` | `Faltan 365 días` | `31 dic 2027` | año, mismo mes y día |
| f | en | `UTC` | 2026-12-31 12:00 | Parvo `2026-12-30`, Rabies `2027-01-02` | `2 d` | `In 2 days` | `Jan 2, 2027` | mes y año |
| g | en | `UTC` | 2027-01-01 12:00 | Parvo `2026-12-31`, Rabies `2027-01-01` | `Today` | `undefined` | `Jan 1, 2027` | año |
| h | es | `America/Mexico_City` | 2026-12-31 20:00 | Parvo `2026-12-30`, Rabies `2027-01-02` | `2 d` | `Faltan 2 días` | `2 ene 2027` | mes y año, con el día UTC ya en 2027-01-01 (Enmienda E1.2) |
| i | es | `UTC` | 2026-12-31 06:00 | Parvo `2026-12-30`, Rabies `2026-12-31` | `Hoy` | `undefined` | `31 dic 2026` | — (Enmienda E3.1: fracción de día 0,25) |
| j | es | `UTC` | 2026-12-31 06:00 | Parvo `2026-12-30`, Rabies `2027-01-02` | `2 d` | `Faltan 2 días` | `2 ene 2027` | mes y año (Enmienda E3.1: fracción de día 0,25) |
| k | es | `America/New_York` | 2027-03-13 23:30 | Parvo `2027-03-12`, Rabies `2027-03-15` | `2 d` | `Faltan 2 días` | `15 mar 2027` | un día de 23 horas: el 2027-03-14 adelanta la hora a las 02:00 (Enmienda E3.1) |
| l | es | `Pacific/Auckland` | 2027-01-01 10:00 | Parvo `2026-12-31`, Rabies `2027-01-03` | `2 d` | `Faltan 2 días` | `3 ene 2027` | año, al este de UTC (UTC+13 en verano): el día UTC sigue en 2026-12-31 (Enmienda E3.1) |

Filas h–l (**Enmiendas E1.2 y E3.1**): una cuenta en milisegundos hasta la
medianoche de `nextDoseAt` solo coincide con los días de calendario según
la fracción del día en que cae «Ahora» y según la zona. Las filas a–g están
todas a las 12:00 en `UTC`: cualquier fórmula que lleve −0,5 a 0 y 1,5 a 2
las pasa, también `Math.round(…) + 1` (review de la ronda 2, defecto
R6-a). Cada fila nueva muestrea una zona ciega distinta:

- h: a las 20:00 de Ciudad de México (UTC−6, sin horario de verano desde
  2022) `Date.now()` es `2027-01-01T02:00Z`. Hasta `Date.parse('2027-01-02')`
  faltan 0,92 días: `Math.ceil` y `Math.round` dan 1, y `getUTC*` ve el día
  UTC ya en el 1 de enero.
- i y j: a las 06:00 en `UTC` faltan −0,25 y 1,75 días. `Math.round(…) + 1`
  y `Math.ceil(… + 0.5)` dan 1 y 3.
- k: en Nueva York el 2027-03-14 dura 23 horas. A las 23:30 del día 13
  faltan 19,5 horas hasta la medianoche UTC del 15 y 23,5 hasta la local:
  `Math.ceil` y `Math.floor(…) + 1` dan 1 sobre las dos medianoches.
- l: en Auckland es UTC+13, al este de UTC, y el resto de filas fuera de
  UTC están al oeste. Restar `Date.parse(nextDoseAt)` a la medianoche
  local de hoy (`setHours(0, 0, 0, 0)`) da 2,54 días: `Math.round` y
  `Math.ceil` dan 3.

`calendarDaysUntil` da el valor de la tabla en todas. Ninguna tabla finita
prueba una cuenta para todas las horas: estas filas matan las familias que
lista `design.md` §2 (M23, M24 y M29–M34), y el ancla
`grep -c 'calendarDaysUntil(' src/screens/health/index.tsx` = 1 sigue.

No hay fila de 1 día: el plural de `home.nextVaccineDaysLeft` diría "Faltan 1
días" (observación en Fuera de alcance).

| Test (describe › it) | Fixture | Asevera |
|---|---|---|
| `#115 R6: la próxima vacuna dice fecha y días restantes › fila $row: hoy $now, próxima $next` (`it.each` de la tabla; título sin la TZ) | la fila, en su `TZ` y a su hora | espera `next-vaccine-days` con su texto; `props.accessibilityLabel` es el de la fila; `next-vaccine-date` tiene la fecha; `within(next-vaccine-card)` tiene `Rabies` y no tiene el ISO de la próxima |
| `… › ordena la card en icono, columna y días, con la fecha en la columna ($branch)` (`it.each`, **Enmienda E3.2**) | ahora local `new Date(2026, 12 - 1, 31, 12, 0)` sin cambiar la TZ; dos filas: `{ branch: 'días', next: '2099-05-01', text: '26419 d' }` y `{ branch: 'hoy', next: '2026-12-31', text: 'Hoy' }`; una sola vacuna `makeVaccine({ nextDoseAt: next })` | primero espera `next-vaccine-days` con `toHaveTextContent(text, { exact: true })` (fija la rama); después `next-vaccine-card` tiene 3 hijos; `[2]` es `next-vaccine-days`; `[1]` tiene 3 hijos y su `[2]` es `next-vaccine-date`; `[0]` contiene `health-icon-syringe` (el testID del mock del icono `Syringe`) |
| `… › pinta los días con la receta exacta ($branch)` (`it.each`, **Enmienda E3.2**) | las mismas dos filas | la misma espera de `text`; después `next-vaccine-days.props.className === 'text-lg font-black text-warning-strong'`; `props.style` `toEqual({ fontVariant: ['tabular-nums'] })`; `next-vaccine-date.props.className === 'font-normal text-muted'` |
| `R5: vacunas con la próxima destacada › highlights the nearest future dose and keeps row order` (adaptado) | existente | `nextCard.getByText('2099-05-01')` pasa a `nextCard.getByText('1 may 2099')`, más `nextCard.queryByText('2099-05-01')` `toBeNull()` |

### R7 — Candados globales: deltas y anclas negativas

THE SYSTEM SHALL dejar los candados globales verdes aplicando exactamente
estos deltas sobre la expresión que haya en el momento del merge (si otra
feature la cambió antes, se suma el delta sobre la nueva):

| Fichero | Antes (`grep -cF` = 1 salvo nota) | Después |
|---|---|---|
| `src/__tests__/ui-language.test.ts` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1` |
| `src/__tests__/ui-copy-table.ts` | las 3 filas de R1 | (R1) |
| `src/__tests__/consistency-classnames.test.ts`, `counters` del `describe('#62 R15: todo contador usa cifras tabulares'` | `[join('screens', 'health', 'index.tsx'), 2],` (en la base sale 2 veces: la otra es `directUses` de `#62 R14`, que no cambia) | `[join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6` |
| mismo fichero, `it('#69 R10: mantiene la base cerrada más los deltas medidos'` | `14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5` | `14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6` |

Anclas negativas (no cambian; el reviewer compara el valor medido con el
declarado):

| Candado | Valor que se mantiene |
|---|---|
| `legibility-classnames.test.ts` `#61 R4` `inkSites` | Salud con 1 `text-accent-strong` (`weight-current`); suma `13 + 1 + 1` + `2, // #118 R11` |
| `legibility-classnames.test.ts` `#61 R4` y `#61 R5` | 0 ficheros con `text-accent` o `text-warning` sueltos; Salud sigue conteniendo `text-warning-strong` |
| `consistency-classnames.test.ts` `#62 R14` `directUses` | Salud con 2 `style={CONTINUOUS_CORNER}` |
| `consistency-classnames.test.ts` `#62 R2` | `vaccines-skeleton` con `h-24 w-full rounded-card` |
| `src/providers/__tests__/language-provider.test.tsx` | expresión de longitud del catálogo sin tocar (termina en `8, // #118 R1`) |
| `ui-language.test.ts` | expresión de `SCREEN_FILES` sin tocar |
| `design-drift.test.ts` | sin tocar: Salud sigue importando `Card` y `screenSignOutCalls` de Salud sigue en 0 |
| `specs/mobile-ui-language/design.md` | sin tocar |
| `src/i18n/catalog.ts`, `src/components/weight-chart.tsx`, `src/components/pet-hero-header.tsx`, `src/screens/home/format.ts` | sin diff |
| `H` | 0 `react-native-reanimated`, 0 `StyleSheet.create`, 0 hex, 0 clases arbitrarias, 0 `getPet`, 0 `home.nextVaccineOverdue` |

| Test | Asevera |
|---|---|
| `#62 R15: todo contador usa cifras tabulares › screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores` | `weight-current`, `weight-variation` y `next-vaccine-days` |
| `#62 R15: … › #69 R10: mantiene la base cerrada más los deltas medidos` | la suma con `+ 1` |
| `#65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas` | la longitud con `+ 3` |

### R8 — Alcance cerrado: cero dependencias, cero backend, grep-clean

THE SYSTEM SHALL cumplir, medido por el reviewer desde la raíz del repo:

- `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
  vacío.
- `git diff --stat origin/main -- backend-pet-tracker/` vacío.
- `git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!STATUS.md' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!progress/review_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'`
  da exactamente los 10 ficheros de `design.md` §1.2 (**Enmienda E2**:
  antes eran 7, medidos contra el HEAD del handoff; la CORRECCION 2 del
  handoff pasó la base a `origin/main...HEAD` tras el merge de #117). Los
  pathspecs excluyen solo ficheros que tocan commits del leader o del
  humano (`STATUS.md` y `progress/current.md` los tocó también el commit
  `5ee9d45f` del humano).
- En `H`: 0 hex, 0 clases arbitrarias `[...]`, 0 `StyleSheet.create` (carta
  §Decisiones fijas 3).
- Desde `mobile-pet-tracker/`: `bun run typecheck`, `bun run lint` y
  `bunx jest` enteros con exit 0, medidos **sin pipe**
  (`> fichero 2>&1; echo "exit=$?"`).

| Test | Asevera |
|---|---|
| comandos de arriba, en `progress/review_mobile-health-make-parity.md` | salida y exit de cada uno |

### R9 — Gate humano: smoke en dev build de Android

THE SYSTEM SHALL pasar este smoke en el **dev build de Android** (no Expo Go),
hecho por el humano. Cada casilla se marca a mano:

- [ ] S1 — Tema claro, ES: el hero sale a sangre bajo la barra de estado, con
  el `PetSwitcher` arriba y nombre y raza abajo; no hay título "Salud";
  vacunas y peso van debajo con el margen lateral de 24 de las demás pestañas.
- [ ] S2 — Tema oscuro: igual que S1; los degradados del hero no dejan banda
  gris y los días de la próxima vacuna se leen en ámbar.
- [ ] S3 — EN: la fecha de la próxima vacuna sale como `Jan 2, 2027` (formato
  inglés), y "Today" o `N d` según toque.
- [ ] S4 — Peso con 0 registros: texto vacío y enlace al log, sin gráfica.
  Con 1 registro: "Aún no hay datos suficientes". Con 2 o más: la curva.
- [ ] S5 — Mascota sin foto: el hero muestra el blobatar. Mascota con foto:
  la foto.
- [ ] S6 — Próxima vacuna con fecha de hoy: "Hoy". Con fecha futura: `N d`.
  Si se puede provocar, una dosis pasada no sale como próxima y su fila sigue
  en rojo.
- [ ] S7 — Cambiar de mascota en el `PetSwitcher` cambia nombre y foto del
  hero, las vacunas y el peso.
- [ ] S8 — Registrar un peso en el weight log y volver a Salud: la gráfica y
  el peso actual ya están al día sin tirar para refrescar.
- [ ] S9 — Con TalkBack, los días de la próxima vacuna se leen como "Faltan N
  días" (o "Hoy").
- [ ] S10 — (Enmienda E2) Splash en arranque en frío, tras
  `bunx expo prebuild --clean` y reinstalar el dev build (los assets del
  splash no viajan por Metro): la mascota sola sobre `#9460FC`, sin cuadrado
  más claro ni pin blanco detrás. En Android 12+ el sistema recorta el icono
  a un disco (#101 D3/D7): basta con que dentro del disco no se vea el borde
  de ningún cuadrado.
- [ ] S11 — (Enmienda E2) Bienvenida en tema claro y en oscuro, y la
  pantalla de carga de sesión (`splash-logo`) si llega a verse: la mascota
  sin cuadrado violeta ni pin, con bordes limpios (sin halo blanco sobre el
  fondo oscuro ni mate violeta sobre el claro). Viaja por Metro.

- [ ] Smoke aprobado por humano (fecha: ____, dispositivo: ____)

### R10 — Splash y bienvenida: la mascota sola, sin fondo ni pin (Enmienda E2)

Petición del humano del 2026-10-06 (commit `5ee9d45f`, `progress/current.md`
§Ampliación), cerrada en el chat con dos decisiones: el arte lo genera Codex
con imagegen a partir del original, y el pin blanco se quita (queda solo la
mascota). Sustituye a #101 D4 (`splash-icon.png` como copia byte a byte de
`android-icon-foreground.png`).

- THE SYSTEM SHALL servir en `mobile-pet-tracker/assets/images/splash-icon.png`
  un PNG de 1024×1024, 8 bits, RGBA (tipo de color 6) y sin entrelazado, con
  la mascota robótica sola sobre fondo transparente: sin el cuadrado
  violeta, sin degradado ni resplandor y sin el pin blanco ni su halo.
- THE SYSTEM SHALL mantener la geometría de #101: la mascota dentro de la
  zona segura `[174, 850)` en x y en y (el 66 % central del lienzo), con
  alfa 0 en todo píxel fuera de ella.
- THE SYSTEM SHALL dejar con alfa 0 los cuatro bloques de 26×26 en las
  esquinas del antiguo cuadrado (`x` e `y` en `[174, 200)` o en
  `[824, 850)`) y el bloque de la punta del pin (`x` en `[492, 532)`, `y` en
  `[790, 830)`), y con alfa 255 el píxel `(512, 560)`, en la cara de la
  mascota.
- THE SYSTEM SHALL dejar de generar `splash-icon.png` en
  `mobile-pet-tracker/scripts/make-icons.mjs`: se borran la línea
  ``fs.copyFileSync(`${images}/android-icon-foreground.png`, `${images}/splash-icon.png`);``
  y `import fs from 'node:fs';`, que solo usaba ella. Así una regeneración de
  los iconos ya no pisa el splash. El script no se ejecuta en esta feature.
- THE SYSTEM SHALL no cambiar nada más: el plugin `expo-splash-screen` sigue
  en `{ backgroundColor: '#9460FC', image: './assets/images/splash-icon.png', imageWidth: 200 }`
  (candado `#101 R6` de `app.config.test.ts`); `welcome-hero` y `splash-logo`
  siguen apuntando a `splash-icon.png` (candado de #118 en
  `src/screens/welcome/index.test.tsx`), y ningún otro fichero de
  `mobile-pet-tracker/assets/` cambia.

Receta del candidato (la sigue Codex; la aprobación es del humano):

1. imagegen edita `mobile-pet-tracker/assets/images/pet-tracker-app-icon.png`
   (la fuente de #101) pidiendo: la misma mascota, con la misma pose,
   proporciones y posición en el lienzo; fondo totalmente transparente; sin
   degradado, sin resplandor, sin el pin ni su halo blanco, sin sombra
   proyectada; bordes limpios, sin halo blanco ni mate de color.
2. Con `jimp-compact` (ya instalado; es el que usa `make-icons.mjs`), el
   resultado se redimensiona a 676×676 con `Jimp.RESIZE_BICUBIC` y se
   compone en `(174, 174)` sobre un lienzo de 1024×1024 transparente
   (`0x00000000`), igual que `android-icon-foreground.png` en
   `make-icons.mjs`. La salida es
   `mobile-pet-tracker/assets/images/splash-icon.png`. El script de
   composición y la salida de imagegen viven en `/tmp/115-splash/` y no se
   commitean.
3. Previews de 1024×1024 en `/tmp/115-splash/`, sin commitear:
   `preview-splash.png` (el candidato sobre `#9460FC`),
   `preview-welcome-light.png` (sobre `#FFFFFF`) y `preview-welcome-dark.png`
   (sobre `#0D1117`, el `--background` oscuro de `global.css`).
4. Parada para el humano: `sha256sum` del candidato en el impl, y nada se
   commitea hasta que el humano lo apruebe mirándolo (casilla «PNG del
   splash» de §Aprobación). Si lo rechaza, otra iteración desde el paso 1
   con su comentario; cada candidato rechazado deja su `sha256sum` y el
   motivo en el impl.

Helper y tests: `design.md` §1.8.

| Test (describe › it) | Fichero | Asevera |
|---|---|---|
| `#115 R10: el splash es la mascota sola sobre transparente › no hay alfa fuera de la zona segura [174, 850)` | `app.assets.test.ts` | recuento de píxeles con alfa > 0 fuera de `[174, 850)²` `toBe(0)` |
| `… › las cuatro esquinas del antiguo cuadrado son transparentes` | igual | recuentos de alfa > 0 en los cuatro bloques `toEqual([0, 0, 0, 0])` |
| `… › la punta del pin es transparente` | igual | recuento de alfa > 0 en el bloque del pin `toBe(0)` |
| `… › la cara de la mascota es opaca` | igual | `alpha(512, 560)` `toBe(255)` |

Los cuatro `it` llaman a `readAlpha('assets/images/splash-icon.png')`, que
además asevera 8 bits, tipo de color 6 y sin entrelazado. Sobre el
`splash-icon.png` de la base, «esquinas» y «pin» caen
(`[676, 676, 676, 676]` y 1600) y «fuera» y «cara» pasan.

| Ancla (desde `mobile-pet-tracker/`) | Base | Después |
|---|---|---|
| `grep -c 'splash-icon' scripts/make-icons.mjs` | 1 | 0 |
| `grep -c "node:fs" scripts/make-icons.mjs` | 1 | 0 |
| `git diff --name-only origin/main...HEAD -- assets/` | vacío | solo `mobile-pet-tracker/assets/images/splash-icon.png` |

## Enmienda E1–E2 (review de la ronda 1 y petición del humano, 2026-10-06)

El `reviewer` rechazó la ronda 1 (`progress/review_mobile-health-make-parity.md`,
HEAD revisado `0e39d7b5`) por dos candados ciegos que esta spec prescribía al
pie de la letra. El código de producción de Salud cumple R1–R8 y **no
cambia**: E1 solo toca `src/screens/health/index.test.tsx`. El mismo día el
humano pidió meter en #115 el icono de inicio sin fondo (`5ee9d45f`), que
entra como E2. Los arreglos de E1 y el candado de E2 se validaron en un spike
fuera del árbol, verdes sobre `0e39d7b5` y rojos contra su mutación.

| Id | Requisito | Hueco o cambio | Mutación que quedaba verde | Validación |
|---|---|---|---|---|
| E1.1 | R2 | la aserción de padres compara hero y contenido entre sí, no contra el scroll | M25: `<View>` en lugar del fragmento que envuelve hero y contenido | verde en la base; con M25 cae `con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` |
| E1.2 | R6 | todas las filas a las 12:00 en UTC, y la hora de la tabla ignorada: días en milisegundos y días de calendario coinciden | M23: `Math.ceil((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000)`. M24 (`Math.round`) caía solo por accidente (obs. 6 de la review) | fila h verde en la base; con M23 cae solo la fila h; con M24, a–h |
| E2 | R10 (nuevo), R8 y R9 | splash y bienvenida con la mascota sola sobre transparente | — | decoder dentro de jest-expo: rojo sobre el `splash-icon.png` actual, verde sobre un candidato sintético compuesto con `jimp-compact` |

Consecuencias:

- `src/screens/health/index.test.tsx` pasa de 55 a 56 `it` (la fila h).
  E1.1 añade una línea al `it` de R2.
- `app.assets.test.ts` gana el helper `readAlpha` y un `describe` de 4 `it`.
- R8: la lista cerrada pasa de 7 a 10 ficheros (`design.md` §1.2).
- R9: S10 y S11.
- Observaciones de la review: la 3 y la 4 las cierra el leader
  (`progress/current.md` y frontmatter); la 5, la 8, la 10 y la 11 no piden
  cambio; la 7 (autorización de `bd2f67d9`) la confirma el humano; la 9
  (línea en blanco en `src/screens/health/index.tsx`) no se toca para no
  abrir producción en E1.

Los textos normativos están en R2, R6, R8, R9 y R10, marcados «Enmienda E<n>».

## Enmienda E3 (review de la ronda 2, 2026-10-06)

El `reviewer` rechazó la ronda 2 (`progress/review_mobile-health-make-parity.md`
§Ronda 2, HEAD revisado `b7692d34`) solo por R6. Los dos defectos vienen de
candados que esta spec prescribía, no de Codex: la tabla de E1.2 seguía
muestreando la hora en dos puntos, y la receta y la estructura de la card
solo se candaban con `days > 0`. La producción de Salud cumple R6 y **no
cambia**: E3 solo toca `src/screens/health/index.test.tsx`. R2, R8 y R10
quedaron bien candados.

| Id | Requisito | Hueco | Mutaciones que quedaban verdes (`design.md` §2) | Arreglo |
|---|---|---|---|---|
| E3.1 | R6 | filas a–g a las 12:00 en `UTC` y una sola fila fuera de UTC, al oeste | M29 (B1), M30 (B2), M31, M32, M33 y M34; la explicación de la fila h decía en falso que «cualquier cuenta en milisegundos da 1» | filas i, j, k y l |
| E3.2 | R6 | los dos `it` de estructura y receta usaban solo `nextDoseAt: '2099-05-01'` (rama `days > 0`) | M35 (B4), M36 (B5), M37 (B7) y M38 (B8), todas solo con `days === 0` | los dos `it` pasan a `it.each` sobre la rama de días y la de `Hoy` |
| E3.3 | R2 | el `className` del título de `health-states` no tenía candado (observación B6; ya era así en la base `8afae724`) | M39 (B6): `text-2xl` → `text-xl` | una aserción en el `it.each` `sin contenido ($name)` |

Consecuencias:

- `src/screens/health/index.test.tsx` pasa de 56 a 62 `it`: 4 filas en el
  `it.each` de fechas y 1 fila más en cada uno de los dos `it.each` de E3.2.
  E3.3 añade una línea, no un `it`.
- Jest entero, sobre la base tras el merge de #149 (`664a8d2d`: 94 suites,
  2162 tests): 94 suites y 2168 tests.
- R8: la lista cerrada sigue en 10 ficheros; E3 no añade ninguno.
- R9 y R10 no cambian. La casilla del PNG sigue firmada.
- Observación R2-c de la review (M25 con workers de Jest no nombra el `it`
  caído): no pide cambio. Las sondas de `design.md` §2 que caen en un `toBe`
  de nodos se corren con `--runInBand`.

Los textos normativos están en R2 y R6, marcados «Enmienda E3.<n>».

## Fuera de alcance

| Viñeta | Clase | Premisa verificada |
|---|---|---|
| "Expediente médico" del Make (consultas, tratamientos) | Feature aparte | Sin backend: `backend-pet-tracker/src/modules/health/` solo tiene vacunas y pesos. |
| Kicker "Salud de" sobre el nombre del hero | Delimitación | `PetHeroHeader` no tiene prop de kicker; añadirla toca un componente compartido por Home y Profile. |
| Título de la card "Evolución de peso" del Make | Delimitación | Se queda `health.weight` ("Peso"); candado `#62 R5` sobre el título de card. |
| Selector de rango o etiquetas de ejes en la gráfica | Delimitación | `WeightChart` no las tiene y no se toca. |
| Las filas de vacunas siguen mostrando la fecha ISO | Delimitación | Solo cambia la card de la próxima. |
| Mover `calendarDaysUntil` y `fmtDate` a un módulo compartido | Delimitación | Se importan tal cual de `../home/format`; ningún candado lo prohíbe. |
| Skeleton de la weight card mientras carga | Delimitación | No existe en la base y no lo pide el Make. |
| "Faltan 1 días" en Home, y desde esta feature también en el `accessibilityLabel` de Salud | Observación | Plural ausente en `home.nextVaccineDaysLeft`; no se toca aquí y R6 no tiene fila de 1 día. Si se arregla, se arregla una vez para las dos pantallas. |
| Cambiar el icono del launcher, el foreground, el monocromo, el favicon o el de notificación (Enmienda E2) | Delimitación | Solo cambia `splash-icon.png`; R10 lo ancla con el diff de `assets/`. |
| Regenerar los iconos con `make-icons.mjs` (Enmienda E2) | Delimitación | El script solo pierde la línea del splash; ejecutarlo reescribiría los otros PNG. |
| Splash en iOS (Enmienda E2) | Delimitación | iOS sigue aparcado en #60; el PNG es el mismo para las dos plataformas. |
| La explore estimaba 4-6 claves nuevas | Observación | Falso: son 0 (D11). La explore tampoco contaba que la fila de variación y el estado vacío con CTA ya existen. |

## Preguntas

- P1 — Hero a sangre (como Home, D4) o en card dentro del margen (como
  Profile). La spec cierra en a sangre; la card es la alternativa descartada
  en `design.md` §3.
- P2 — Con contenido, el título "Salud" desaparece (como Home, D6). ¿Vale, o
  se quiere el título en el slot junto al `PetSwitcher` (una fila más de copy
  en `R5_HEALTH`)?
- P3 — Reusar `home.nextVaccine*` en Salud (D8, 0 claves nuevas) frente a
  crear tres claves `health.*` con los mismos literales (+3 al catálogo).

## Aprobación

> Cinco casillas, cinco gates (lección `gate-humano-sin-casilla-donde-firmar`).
> La de la spec autorizó la ronda 1; la de la Enmienda E1–E2 autorizó la
> ronda 2 de Codex; la del PNG autorizó el commit verde de R10; la de la
> Enmienda E3 autoriza la ronda 3; la de R9 cierra la feature.

### Aprobación de la spec

- [x] Spec aprobada por humano (fecha: 2026-10-06, desde Notion: página `3f06115a-9b27-811f-802d-c7a05058341d`, `Estado del gate` = Aprobado, `page_last_edited_at` 2026-10-06T14:06:26.286Z)

### Enmienda E1–E2 — candados de R2 y R6, y splash sin fondo ni pin

- [x] Enmienda E1–E2 aprobada por humano (fecha: 2026-10-06, desde Notion: página `3f06115a-9b27-811f-802d-c7a05058341d`, `Estado del gate` = Aprobado, `page_last_edited_at` 2026-10-06T17:15:50.400Z, espejo de `0d6c22b9`) ← gate obligatorio antes de la ronda 2 de Codex

### PNG del splash

- [x] Candidato de `splash-icon.png` aprobado por humano mirándolo (fecha: 2026-10-06, `sha256`: `087c1eaa69e8324ac46e98073897ddc261d3f25b764f00d6216fb5014c05e56d`; aprobado en el chat de la sesión del leader tras ver las tres previews y el zoom de bordes; candidato de la CORRECCION 3 con el respaldo cian) ← gate obligatorio antes del commit verde de R10. En el espejo de Notion el humano la marcó el 2026-10-06 junto con la Enmienda, sin candidato todavía: esa marca no cuenta; cuenta esta firma

### Enmienda E3 — candados de R6 en todas las horas y en la rama Hoy

- [ ] Enmienda E3 aprobada por humano ← gate obligatorio antes de la ronda 3 de Codex

### Prueba de humo

- [ ] La casilla «Smoke aprobado por humano» de R9 (S1–S11)
