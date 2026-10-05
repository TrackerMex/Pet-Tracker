---
feature: mobile-map-gps-pill-battery
id: 116
status: approved
tags: [harness, spec, mobile, ui]
base: 8f22c8d2 (origin/main b2a9c2aa)
---

# Diseño — #116 mobile-map-gps-pill-battery

Capa: solo presentación (`src/screens/map/`) más un `export` en un componente
compartido y un literal de catálogo. Sin dominio, sin API, sin tipos nuevos:
`DeviceStatus.batteryPct: number | null` ya existe en `src/api/types.ts`, que
**no se toca** aunque `feature_list.json` lo liste en `files_affected`.

## 1. Decisiones técnicas

### 1.1 Datos

| Dato | Fuente | Ya en `MapScreen` | Refresco |
|---|---|---|---|
| Nombre, foto, id de la píldora | `selectedPet` (query `pets`) | sí (`const selectedPet`) | foco / selección |
| Estado de conexión | `detail.data.pet.device` → `deviceConnectionState` → `MAP_CONNECTION_LABEL_KEY[estado].labelKey` | sí (`const gps`) | poll de 15 s (`POLL_MS`) |
| Batería | `detail.data.pet.device.batteryPct` | no (se lee nuevo, mismo objeto) | poll de 15 s |
| `LastPosition.battery` | **no se lee** | — | — |

Símbolos nuevos en `src/screens/map/index.tsx` (nombres fijos):

- `MAP_CONNECTION_TONE: Record<DeviceConnectionState, PetHeroStatusTone>` a
  nivel de módulo: `none: 'muted'`, `unknown: 'muted'`, `offline: 'warning'`,
  `online: 'success'`.
- Locales del render: `connection` (`DeviceConnectionState | null`, `null` si el
  detalle no es `ok`), `gps` (se conserva: etiqueta o `'—'`), `gpsTone`
  (`STATUS_TONE_CLASSES[connection ? MAP_CONNECTION_TONE[connection] : 'muted']`),
  `batteryPct` (`number | null`), `battery` (`'—'` o `${batteryPct}%`),
  `batteryTone` (`STATUS_TONE_CLASSES['muted' | 'success' | 'warning']` según
  `null` / `> 60` / resto).
- Imports nuevos: `PetAvatar` de `../../components/pet-avatar`;
  `STATUS_TONE_CLASSES` y `type PetHeroStatusTone` de
  `../../components/pet-hero-header`; `type DeviceConnectionState` se añade al
  import existente de `../../utils/device-connectivity`.

La comparación de umbral es `batteryPct > 60` (la de la Home). Sin constante
compartida: ver §3.

### 1.2 Ficheros (lista cerrada)

Producción:

1. `mobile-pet-tracker/src/screens/map/index.tsx` — píldora, tile de batería, `MAP_CONNECTION_TONE`.
2. `mobile-pet-tracker/src/components/pet-hero-header.tsx` — **solo** `const STATUS_TONE_CLASSES` → `export const STATUS_TONE_CLASSES`.
3. `mobile-pet-tracker/src/i18n/catalog.ts` — los dos literales de `map.live`.

Tests:

4. `mobile-pet-tracker/src/screens/map/index.test.tsx` — R1..R9 y migraciones.
5. `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — una fila de `R4_MAP`.
6. `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` — fila del mapa en `counters` (`#62 R15`) y suma del `it` `#69 R10: mantiene la base cerrada más los deltas medidos`.

Docs:

7. `specs/mobile-ui-language/design.md` — fila 198 (`map.live`).
8. `specs/mobile-map-gps-pill-battery/traceability.md` — la rellena Codex.
9. `progress/impl_mobile-map-gps-pill-battery.md` — reporte de Codex.

Ya escrito por el spec_author, Codex **no** lo toca:
`specs/mobile-map-staleness-single-source/requirements.md` §Enmienda #116.

**No se tocan** (anclas negativas): `src/utils/device-connectivity.ts` y su
test, `src/api/types.ts`, `src/screens/home/`, `src/__tests__/ui-language.test.ts`,
`src/__tests__/legibility-classnames.test.ts`, `src/__tests__/design-drift.test.ts`,
`src/providers/__tests__/language-provider.test.tsx`, `package.json`, `bun.lock`,
`backend-pet-tracker/`, `docs/ui-guidelines.md`.

### 1.3 Árbol

Dentro de la rama `petsReady && last.data?.kind === 'ok'`, sin cambios fuera de
`map-stats` (el `PetMap` y `map-empty-overlay` quedan como están):

```
View testID="map-stats"  (style y className sin cambios)
├─ [0] selectedPet ? View testID="map-pet-pill" accessible accessibilityLabel="<nombre>, <gps>"
│      ├─ [0] PetAvatar testID="map-pet-pill-avatar" size=24
│      ├─ [1] Text testID="map-pet-pill-name" numberOfLines=1
│      ├─ [2] View testID="map-pet-pill-dot"
│      └─ [3] Text testID="map-pet-pill-status" numberOfLines=1
├─ [1] Card className="p-3"  (sin cambios salvo el tile 4)
│      └─ View gap-2
│         ├─ fila 1: stat-speed | stat-distance        (sin cambios)
│         └─ fila 2: stat-updated | stat-battery       (el tile 4 cambia)
├─ [2] Button testID="lost-mode-button"               (sin cambios)
└─ [3] Text testID="lost-mode-error" (condicional)     (sin cambios)
```

`map-stats` está anclado abajo (`bottom: insets.bottom + 96`): la píldora crece
hacia arriba y no mueve la tarjeta ni el botón. La píldora no es ancestro del
`PetMap` (carta §Decisiones fijas 10): su `bg-surface` no tapa el mapa.

### 1.4 Clases contra guards

| Nodo | `className` exacto | Guard que la mira | Resultado |
|---|---|---|---|
| `map-pet-pill` | `flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm` | `#62 R14` (cápsula sin `CONTINUOUS_CORNER`); `#62 R12` solo mira `TextInput`; C8 (sin `[...]`) | limpio; `directUses` del mapa sigue en 4 |
| `map-pet-pill-name` | `shrink text-xs font-bold text-foreground` | ninguno específico | limpio |
| `map-pet-pill-dot` | `size-2 rounded-full ` + `STATUS_TONE_CLASSES[t].dot` | ninguno | limpio |
| `map-pet-pill-status` | `text-2xs font-semibold ` + `STATUS_TONE_CLASSES[t].text` | `#61 R4` cuenta `text-accent-strong` **literal** por fichero; `#61 R5` prohíbe `text-warning` suelto | el literal vive en `pet-hero-header.tsx` (1, sin cambios); el mapa sigue en 2; `text-warning-strong` no casa `text-warning(?![-\w])` |
| `stat-battery` | `text-base font-black ` + `STATUS_TONE_CLASSES[t].text` | ídem; `#62 R15` (`TABULAR_NUMS`) | `counters` del mapa `3 + 1` |
| rótulo del tile 4 | `mt-1 text-2xs font-normal text-muted` (sin cambios) | — | — |

Contraste (calculado, carta §Dirección de arte 1): `text-accent-strong` y
`text-warning-strong` sobre `bg-default` y `bg-surface` pasan AA en claro y
oscuro (requirements b4). `text-success` queda prohibido en esta feature.

`STATUS_TONE_CLASSES` interpola clases completas desde una tabla literal: el
escáner de uniwind las ve en `pet-hero-header.tsx`, donde ya están escritas.

### 1.5 Movimiento

Ninguno (requirements c). El punto es un `View` estático. Sin `entering`,
sin `withRepeat`, sin `useReducedMotion` en el mapa. R8 lo canda en el fuente.

### 1.6 Copy

Cero claves nuevas. Un literal cambiado (`map.live`) y un uso nuevo de una
clave existente (`pairing.battery`). Tabla en requirements R1. El nombre
accesible se compone con una plantilla (`${nombre}, ${gps}`): con
interpolación, el escáner de `#65 R18` no la confunde con copy suelta.

### 1.7 Decisiones por elemento (carta, Enmienda #70)

Píldora (elemento único, 4 hijos; recuento por `children.length`):

| # | Decisión | Avatar | Nombre | Punto | Estado | Test |
|---|---|---|---|---|---|---|
| 1 | dato | foto/nombre de `selectedPet` | `selectedPet.name` | tono del estado | etiqueta del estado | R3, R4 |
| 2 | icono | — | — | — | — | n/a |
| 3 | copy | — | — | — | `MAP_CONNECTION_LABEL_KEY` | R4 |
| 4 | nombre accesible | agrupado en la píldora: `<nombre>, <estado>` | ídem | ídem | ídem | R4 |
| 5 | fondo | círculo propio | — | `tone.dot` | — | R4 |
| 6 | tinta de icono | — | — | — | — | n/a |
| 7 | receta de texto | — | `shrink text-xs font-bold text-foreground` | — | `text-2xs font-semibold` + `tone.text` | R3, R4 |
| 8 | navegación | ninguna | ninguna | ninguna | ninguna | n/a (sin `onPress`) |
| 9 | condición de render | `selectedPet` definido | ídem | ídem | ídem | R2 (dos escenarios) |
| 10 | forma del contenedor | `flex-row items-center gap-2 self-start rounded-full …` | | | | R2 |
| 11 | agrupación | ninguna (`self-start`, sin `flex-1`) | | | | R2 |
| 12 | orden | 0 | 1 | 2 | 3 | R3, R4 |

Tile 4 de la rejilla (elemento repetido: solo cambia este; los tiles 1..3 ya
los candan `#61 R11`, `#62 R15` y R8 de la suite):

| # | Decisión | Tile 4 tras #116 | Test |
|---|---|---|---|
| 1 | dato | batería del detalle | R6, R7 |
| 3 | copy | `pairing.battery` | R5 |
| 5 | fondo | `rounded-xl bg-default` + `CONTINUOUS_CORNER` (sin cambio) | `#62 R14` |
| 7 | receta | valor `text-base font-black` + tinta por umbral; rótulo `mt-1 text-2xs font-normal text-muted` | R5, R6, R7 |
| 9 | render | siempre que haya `map-stats` | R5 |
| 10 | forma | `flex-1 items-center rounded-xl bg-default p-3` | R5 |
| 11 | agrupación | `flex-1` | R5 |
| 12 | orden | valor 0, rótulo 1; fila 2 posición 1 | R5 |

## 2. Mutaciones y sondas

Cada fila es una mutación sobre la implementación verde. «Aserción» = la
consulta encuentra el nodo y el `expect` falla; «consulta» = `getBy*` lanza
porque el nodo no existe.

| # | Mutación | `it` que cae | Cómo |
|---|---|---|---|
| M1 | no pintar `map-pet-pill` | R2 (los tres primeros), R3, R4 | consulta. **Cascada**: los `it` migrados de #94 y R8 que leen `map-pet-pill-status` caen por consulta |
| M2 | píldora fuera de `map-stats` (arriba) | R2 › hijo 0 | aserción |
| M3 | píldora con `style={CONTINUOUS_CORNER}` | R2 › receta (`style` no `undefined`); `#62 R14` (mapa 5 ≠ 4 y `rounded-full` en el tag) | aserción |
| M4 | `size={32}` | R3 › avatar sin foto | aserción |
| M5 | foto del detalle | R3 › foto de la lista (sale el `SvgXml`, `source` `undefined`) | aserción |
| M6 | nombre del detalle | R3 › nombre (`Nala`) | aserción |
| M7 | nombre y estado intercambiados | R4 › cuatro hijos en orden | aserción |
| M8 | `online: 'warning'` | R4 › fila online | aserción |
| M9 | `offline: 'muted'` | R4 › fila offline | aserción |
| M10 | detalle no `ok` con tono success | R4 › filas pendiente y error | aserción |
| M11 | `accessibilityLabel` solo con el estado | R4 › todas las filas | aserción |
| M12 | estado con `style={TABULAR_NUMS}` | R4 › una línea sin cifras tabulares; `#62 R15` del mapa 5 ≠ 4 | aserción |
| M13 | punto con `Animated.View` + `withRepeat` | R8 | aserción |
| M14 | batería de `position.battery` | R7 › ignora la batería de la última posición (`82%` ≠ `—`) | aserción |
| M15 | batería de `selectedPet.device` | R7 › detalle y no lista (`10%` ≠ `82%`) | aserción |
| M16 | `batteryPct >= 60` | R6 fila 60 | aserción |
| M17 | `batteryPct > 61` | R6 fila 61 | aserción |
| M18 | `batteryPct ? … : '—'` | R6 fila 0 | aserción |
| M19 | tinta `text-success` | R6 filas 100/82/61 | aserción |
| M20 | `stat-battery` sin `TABULAR_NUMS` | `#62 R15` migrado; `counters` (3 ≠ 4) | aserción |
| M21 | rótulo `t('pairing.connection')` | R5 › tile con rótulo (`Conexión` ≠ `Batería`); `checkUses(R4_MAP)` (`pairing.battery` 0 ≠ 1) | aserción. `#61 R11` › `getByText('Batería')` cae por consulta |
| M22 | `testID="stat-gps"` en el tile 4 | R5 › retira `stat-gps`; R5 › tile con valor (consulta: no hay `stat-battery`) | aserción y consulta |
| M23 | quinto tile (conservar el de conexión y añadir el de batería) | `#61 R11` › dos filas de dos; R5 › retira `stat-gps`; `#94 R6` invertido (`Conexión` visible); `#62 R14` (mapa 5 ≠ 4) | aserción |
| M24 | `map.live` sin cambiar | R1; R4 fila online; los 6 `it` migrados en R1 | aserción |
| M25 | píldora pintada con datos del detalle cuando `selectedPet` es `undefined` | R2 › selección ausente | aserción |
| M26 | batería congelada en el primer render (`useMemo` con `[]`) | R7 › poll (`82%` ≠ `40%`) | aserción |

Sondas obligatorias para los `it` que nacen verdes (tasks.md): R8 (plantar M13)
y R2 › selección ausente (plantar M25: quitar la condición `selectedPet ?` y
leer `selectedPet?.name ?? ''` y `selectedPet?.photoUrl ?? null`; el `it` debe
caer por aserción, `queryByTestId('map-pet-pill')` no nulo).

## 3. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Quinto tile en una tercera fila | La tarjeta crece ~72 dp y tapa más mapa; el estado del GPS seguiría duplicado si además existe la píldora |
| Rejilla de 3 columnas como el Make | A 360 dp de ancho cada tile queda en ~72 dp: `12.3 km/h` y `Desactualizado` truncan con `numberOfLines={1}` |
| Píldora arriba a la izquierda (Make) | Choca con `map-empty-overlay`; moverlo rompe #62 R3 y R7 de mobile-design-drift (`top: 52`) |
| Reutilizar `PetHeroHeader` | Es la cabecera fotográfica de 240 de alto; su píldora va dentro y pulsa |
| Pulso del punto como en la Home | Puerta de frecuencia: pantalla de uso diario; ruido sin información nueva |
| `text-success` para > 60 | 3,31:1 sobre `bg-default` claro: falla AA |
| Fallback a `LastPosition.battery` | Es la misma lectura que `device.batteryPct` (mismo mensaje del collar); dos fuentes harían discrepar mapa y Home |
| Clave nueva `map.gpsActive` | Duplicaría el estado online con otro literal; `map.live` solo lo usa el mapa |
| Constante compartida `BATTERY_OK_ABOVE = 60` | Tocaría la Home (dos usos de `> 60` en `home/index.tsx`); con un tercer sitio fuera de estas dos pantallas, extraer |
| Mover `STATUS_TONE_CLASSES` a `src/theme/` | Diff mayor que un `export`; un solo consumidor nuevo |

## 4. Skills

Para quien implemente (nombres de Claude Code; el leader los traduce a los de
Codex en el handoff, deuda B5): `expo:expo-overview`, `expo-native-ui`,
`expo-design-system`, `appllama-app-design-skill` (solo para releer el patrón
de píldora; la carta gana) y `animate-expo` (solo la puerta de frecuencia, que
aquí decide **no** animar).
