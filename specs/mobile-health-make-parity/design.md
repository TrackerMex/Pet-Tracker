---
feature: mobile-health-make-parity
id: 115
status: approved
tags: [harness, spec, mobile, ui]
base: 8afae724
---

# Diseño — #115 mobile-health-make-parity

Capa: solo presentación (`src/screens/health/`). Sin dominio, sin API, sin
tipos nuevos, sin catálogo. `WeightChart`, `PetHeroHeader`,
`calendarDaysUntil`, `fmtDate` y `useLocale` ya existen y **no se tocan**,
aunque `feature_list.json` liste `weight-chart.tsx`, `pet-hero-header.tsx`,
`format.ts` o `catalog.ts` en `files_affected`.

## 1. Decisiones técnicas

### 1.1 Datos

- Pesos: `useQuery({ queryKey: healthKeys.weights(selectedPetId ?? '', undefined), queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!), enabled: selectedPetId !== null })`.
  Es la misma clave que usa `src/screens/weight-log/index.tsx`, así que las
  dos pantallas comparten caché. Sin `limit`, el backend devuelve hasta 50
  registros, más reciente primero, con `variation` contra el anterior.
  `weights[0]` sigue siendo el peso actual.
- Mascota del hero: `const selectedPet = pets.data?.kind === 'ok' ? pets.data.pets.find((pet) => pet.id === selectedPetId) ?? null : null;`
  (la forma es libre; el resultado no). Sin consulta de detalle.
- Próxima vacuna: el cálculo de `nextVaccine` no cambia. Se añaden
  `const locale = useLocale();` y, cuando hay `nextVaccine`,
  `calendarDaysUntil(nextVaccine.nextDoseAt, new Date())`. Imports:
  `import { calendarDaysUntil, fmtDate } from '../home/format';` y
  `useLocale` desde `'../../providers/language-provider'`.

### 1.2 Ficheros (lista cerrada)

Producción:

1. `mobile-pet-tracker/src/screens/health/index.tsx` — consulta de pesos, A9, hero, `WeightChart`, fecha y días.

Tests:

2. `mobile-pet-tracker/src/screens/health/index.test.tsx` — R2..R6 y los `it` adaptados.
3. `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — 3 filas de `R5_HEALTH` (R1).
4. `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — longitud de `R5_HEALTH` (`+ 3`).
5. `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` — fila de Salud en `counters` de `#62 R15` (`2 + 1`) y suma de `#69 R10` (`+ 1`).

Docs:

6. `specs/mobile-health-make-parity/traceability.md` — la rellena Codex.
7. `progress/impl_mobile-health-make-parity.md` — reporte de Codex.

Enmienda E2 (R10):

8. `mobile-pet-tracker/assets/images/splash-icon.png` — el candidato aprobado por el humano.
9. `mobile-pet-tracker/scripts/make-icons.mjs` — sin la copia al splash ni `import fs`.
10. `mobile-pet-tracker/app.assets.test.ts` — helper `readAlpha` y `describe` de R10.

**No se tocan** (anclas negativas): `src/components/weight-chart.tsx`,
`src/components/pet-hero-header.tsx`, `src/components/pet-switcher.tsx`,
`src/screens/home/` (incluido `format.ts`), `src/screens/weight-log/`,
`src/i18n/catalog.ts`, `src/api/`, `src/__tests__/legibility-classnames.test.ts`,
`src/__tests__/design-drift.test.ts`,
`src/providers/__tests__/language-provider.test.tsx`,
`specs/mobile-ui-language/design.md`, `docs/ui-guidelines.md`,
`package.json`, `bun.lock`, `backend-pet-tracker/`, `app.config.test.ts`,
`app.json`, `src/screens/welcome/`, `src/app/index.tsx` y cualquier otro
fichero de `assets/` (Enmienda E2).

### 1.3 Árbol

`hayContenido = pets.data?.kind === 'ok' && pets.data.pets.length > 0`.

```
ScrollView screen-health   contentContainerStyle { gap: 16, paddingBottom: insets.bottom + 96 }
├─ (!hayContenido) View health-states   style { paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }
│   ├─ Text t('health.health')   text-2xl font-black text-foreground
│   ├─ Skeleton health-loading                      (pets.data === undefined)
│   ├─ View items-start gap-3: health-error + health-retry   (isPetsError)
│   └─ Text health-empty                            (ok y 0 mascotas)
└─ (hayContenido)
    ├─ PetHeroHeader pet={selectedPet} variant="bleed"        → host pet-hero
    │   └─ slot: PetSwitcher pets selectedPetId onSelect=selectPet
    └─ View health-content   style { paddingHorizontal: 24, gap: 16 }
        ├─ (selectedPetId) View vaccines-section       sin cambios salvo next-vaccine-card
        │   └─ Card next-vaccine-card   flex-row items-center gap-3
        │       ├─ View tile (sin cambios: size-11 … bg-warning-soft, CONTINUOUS_CORNER, Syringe)
        │       ├─ View flex-1 gap-1
        │       │   ├─ Text t('health.nextDue')   (sin cambios)
        │       │   ├─ Text nextVaccine.name      (sin cambios)
        │       │   └─ Text next-vaccine-date   font-normal text-muted   fmtDate(nextDoseAt, locale)
        │       └─ Text next-vaccine-days   text-lg font-black text-warning-strong   style={TABULAR_NUMS}
        │            texto: days === 0 ? t('home.nextVaccineToday') : t('home.nextVaccineDays', { days })
        │            accessibilityLabel: days === 0 ? undefined : t('home.nextVaccineDaysLeft', { days })
        └─ (selectedPetId) Card weight-card   gap-3
            ├─ View fila título + weight-current        (sin cambios)
            ├─ View fila weight-variation               (sin cambios; ok y > 0)
            ├─ <WeightChart entries={weight.data.weights} />   (ok y > 0)
            ├─ Text weight-card-empty                   (sin cambios; ok y 0)
            ├─ Text weight-card-error                   (sin cambios; error o unreachable)
            └─ Pressable weight-log-link                (sin cambios; siempre)
```

Las condiciones `selectedPetId ? … : null` de `vaccines-section` y
`weight-card` se conservan dentro de `health-content`. Es el patrón A9 de
Home (`src/screens/home/index.tsx`: `home-states` / `home-content`).

### 1.4 Clases contra guards

| Clase nueva o movida | Guard | Resultado |
|---|---|---|
| `text-lg font-black text-warning-strong` (`next-vaccine-days`) | `legibility-classnames` `#61 R5` (`text-warning` suelto prohibido) | pasa: es `-strong`; Salud sigue en `warningSites` |
| ídem | `#61 R4` (`text-accent` suelto, `inkSites`) | sin efecto: no es acento |
| `font-normal text-muted` (`next-vaccine-date`) | ninguno | ya existía en ese nodo |
| `text-2xl font-black text-foreground` (título, a `health-states`) | ninguno cuenta esta clase | se mueve, no se duplica |
| `style={TABULAR_NUMS}` en `next-vaccine-days` | `consistency-classnames` `#62 R15` | Salud 2 → 3, suma `+ 1` (R7) |
| `health-states` / `health-content` | carta §Decisiones fijas 6 y A9 | estilos inline como Home; 0 hex, 0 arbitrarias |

### 1.5 Movimiento

Puerta de frecuencia (`expo-animation` / animate-expo): Salud se abre a
diario y el único cambio por acción del usuario es el cambio de mascota.
Decisión: **no animar**. `PetHeroHeader` solo pulsa con `status.tone ===
'success'` y Salud no le pasa `status`. `H` sigue con 0
`react-native-reanimated`.

### 1.6 Copy

0 claves nuevas. Se reusan `home.nextVaccineDays`,
`home.nextVaccineDaysLeft` y `home.nextVaccineToday`, con una llamada
directa `t('…'` por clave en `H` (para que `checkUses` cuente 1 por fila).
Precedente de reuso entre namespaces: `pairing.battery` en el mapa (#116 R5).
`specs/mobile-ui-language/design.md` tiene una fila por clave, no por uso: no
cambia.

### 1.7 Decisiones por elemento (carta, Enmienda #70)

No hay elementos repetidos nuevos: las filas `vaccine-row-*` no cambian. La
card de la próxima vacuna es única; sus decisiones son las de R6 (3 hijos,
orden, receta de `next-vaccine-days` y de `next-vaccine-date`, texto y
`accessibilityLabel` por rama).

### 1.8 Decoder de alfa para R10 (Enmienda E2)

En `app.assets.test.ts`, añadir `import { inflateSync } from 'node:zlib';`
junto a los imports de `node:` y, debajo de `readIhdr`, estos dos helpers.
Validados dentro de jest-expo en el spike de la enmienda (filtros PNG 0-4;
el candidato que escribe `jimp-compact` usa filtrado adaptativo):

```ts
function readAlpha(relativePath: string) {
  const buf = readFileSync(join(__dirname, relativePath));
  const { width, height, bitDepth, colorType } = readIhdr(relativePath);

  expect([bitDepth, colorType, buf[28]]).toEqual([8, 6, 0]);

  const idat: Buffer[] = [];
  for (let at = 8; at < buf.length; at += 12 + buf.readUInt32BE(at)) {
    if (buf.toString('latin1', at + 4, at + 8) === 'IDAT') {
      idat.push(buf.subarray(at + 8, at + 8 + buf.readUInt32BE(at)));
    }
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let i = 0; i < stride; i++) {
      const a = i >= 4 ? px[y * stride + i - 4] : 0;
      const b = y > 0 ? px[(y - 1) * stride + i] : 0;
      const c = i >= 4 && y > 0 ? px[(y - 1) * stride + i - 4] : 0;
      const p = a + b - c;
      const paeth =
        Math.abs(p - a) <= Math.abs(p - b) && Math.abs(p - a) <= Math.abs(p - c)
          ? a
          : Math.abs(p - b) <= Math.abs(p - c)
            ? b
            : c;
      const predictor = [0, a, b, (a + b) >> 1, paeth][filter];
      px[y * stride + i] = (raw[y * (stride + 1) + 1 + i] + predictor) & 0xff;
    }
  }

  return (x: number, y: number) => px[(y * width + x) * 4 + 3];
}

function countAlpha(
  alpha: (x: number, y: number) => number,
  [x0, y0, x1, y1]: [number, number, number, number],
) {
  let count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (alpha(x, y) > 0) count++;
    }
  }

  return count;
}
```

Cada `it` de R10 empieza con
`const alpha = readAlpha('assets/images/splash-icon.png');`:

- fuera: recorre el lienzo entero y cuenta `alpha(x, y) > 0` con
  `x < 174 || x >= 850 || y < 174 || y >= 850`; `toBe(0)`.
- esquinas: `countAlpha` de `[174, 174, 200, 200]`, `[824, 174, 850, 200]`,
  `[174, 824, 200, 850]` y `[824, 824, 850, 850]`, en un array;
  `toEqual([0, 0, 0, 0])`.
- pin: `countAlpha(alpha, [492, 790, 532, 830])` `toBe(0)`.
- cara: `alpha(512, 560)` `toBe(255)`.

Sin dependencias nuevas: `node:zlib` es de Node, como `node:fs` y
`node:path`, que ya usa el fichero.

## 2. Mutaciones y sondas

Cada fila es una mutación sobre la implementación verde. «Aserción» = la
consulta encuentra el nodo y el `expect` falla; «consulta» = `getBy*` lanza
porque el nodo no existe.

| # | Mutación | `it` que cae | Cómo |
|---|---|---|---|
| M1 | pesos con `fetch, 1` (base) | R4 (los dos `toHaveBeenCalledWith`) y `#87 R13` | aserción |
| M2 | `weights.slice(0, 2)` a `WeightChart` | R5 › dos o más (ids) | aserción |
| M3 | `[...weights].reverse()` en Salud | R5 › dos o más (orden de ids) | aserción |
| M4 | `WeightChart` antes de la fila de variación | R5 › dos o más (`[1]` y `[2]`) | aserción |
| M5 | `WeightChart` con solo `kind === 'ok'` | R5 › sin registros (`weight-chart-empty` no es `null`) | aserción |
| M6 | `variant="card"` | R2 › hijos (`className`) | aserción |
| M7 | hero dentro de `health-content` | R2 › hijos (padres distintos) | aserción |
| M8 | título "Salud" también en el slot | R2 › sin título; R1 (`t('health.health')` 2 ≠ 1) | aserción |
| M9 | scroll con `padding: 24` | R2 › los dos `toEqual` de `contentContainerStyle` | aserción |
| M10 | `health-states` sin `paddingTop` | R2 › `it.each` de estados y el `it` adaptado de safe area | aserción |
| M11 | `status` al hero | R3 › sin estado (`pet-hero-status` no es `null`) | aserción |
| M12 | hero con `pets[0]` en vez de la seleccionada | R3 › cambiar de mascota | aserción |
| M13 | `fmtDate(…, 'es-MX')` fijo | R6 filas f y g | aserción |
| M14 | días con `getDate()` del ISO menos `getDate()` de hoy | R6 filas b, d, e | aserción |
| M15 | días sin año (mes y día) | R6 fila e (`Hoy` ≠ `365 d`) | aserción |
| M16 | `accessibilityLabel` también con 0 | R6 filas a, c, g | aserción |
| M17 | texto y label intercambiados | R6 filas b, d, e, f | aserción |
| M18 | `{nextVaccine.nextDoseAt}` conservado | R6 tabla (ISO dentro de la card) y el `it` adaptado | aserción |
| M19 | `text-warning` suelto en los días | `#61 R5` y R6 › receta | aserción |
| M20 | sin `TABULAR_NUMS` en los días | R6 › receta y `#62 R15` (3 ≠ 2) | aserción |
| M21 | `next-vaccine-days` dentro de la columna | R6 › orden (3 hijos y `[2]`) | aserción |
| M22 | `t('home.nextVaccineToday')` dos veces (texto y label) | R1 (`checkUses` 2 ≠ 1 en `#65 R5` y en `#65 R18`) y R6 filas a, c, g | aserción |
| M23 | (E1.2) `calendarDaysUntil(nextVaccine.nextDoseAt!, new Date())` → `Math.ceil((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000)` | R6 fila h (`1 d` ≠ `2 d`); a–g siguen verdes | aserción |
| M24 | (E1.2) lo mismo con `Math.round` | R6 filas a–h (h por la TZ; a–g por el reloj que adelanta `waitFor`, obs. 6 de la review) | aserción |
| M25 | (E1.1) `<View>` / `</View>` en lugar del fragmento `<>` / `</>` que envuelve `PetHeroHeader` y `health-content` | R2 › hijos (`hero.parent!.parent` no es `screen-health`) | aserción |
| M26 | (E2) `splash-icon.png` de la base: `git show origin/main:mobile-pet-tracker/assets/images/splash-icon.png > assets/images/splash-icon.png` | R10 › esquinas y pin | aserción |
| M27 | (E2) lienzo vacío: `new Jimp(1024, 1024, 0x00000000)` escrito en `assets/images/splash-icon.png` | R10 › cara | aserción |
| M28 | (E2) el candidato compuesto en `(0, 0)` en vez de `(174, 174)` | R10 › fuera | aserción |

M23–M25 se restauran con `git checkout HEAD -- src/screens/health/index.tsx`
y M26–M28 con `git checkout HEAD -- assets/images/splash-icon.png`; después
de cada una, `git diff --quiet -- <ruta>` y `git diff --cached --quiet` con
exit 0. Los PNG de M27 y M28 se generan en `/tmp/115-splash/` y se copian
encima; no se commitean.

## 3. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Hero `variant="card"` dentro del margen (patrón Profile, #67 R6) | El Make pinta la foto a sangre (280 px) como Home; la card queda como opción de veto del humano (P1). |
| Consulta de detalle (`getPet`) para el hero | Una petición más para datos que la lista ya trae; sin `status` no hace falta el dispositivo. |
| `limit` explícito (p. ej. 12) | Abre otra entrada de caché y pierde el refresco compartido con weight-log; el default del backend (50) basta para la curva. |
| Tres claves `health.*` nuevas | +3 al catálogo, a `specs/mobile-ui-language/design.md` y al candado de longitud para los mismos literales (P3). |
| Mover `calendarDaysUntil` y `fmtDate` a `src/utils/` | Toca Home y sus candados de `design-drift`; nada lo exige. |
| Gráfica nueva al estilo `AreaChart` del Make | `WeightChart` ya pinta área con degradado y línea; un componente nuevo duplica. |
| Rama "Vencida" en la card | Exige cambiar el filtro de `nextVaccine`: cambio de comportamiento que el Make no pide. |
| Título "Salud" en el slot del hero | Rompe la paridad con Home y añade una fila de copy (P2). |

## 4. Skills

Para quien implemente (nombres de Claude Code; el leader los traduce a los de
Codex en el handoff, deuda B5): `expo:expo-overview`, `expo-native-ui`,
`expo-design-system` y `expo-animation` (solo la puerta de frecuencia, que
aquí decide **no** animar). Enmienda E2: el generador de imágenes de Codex
(imagegen), el mismo que hizo el icono de #101.
