# review: mobile-tanstack-query (#87)

Fecha: 2026-09-10
Revisor: subagente `reviewer` (Claude Opus 5)
Branch: `feature/87-mobile-tanstack-query`
HEAD revisado: **`de6ed21`** — no `0a2fdca`. El HEAD se movió durante la revisión:
`de6ed21 docs(status): cuenta 87 features tras abrir #87` es un commit del *leader*
posterior al cierre de Codex, toca **solo `STATUS.md`** y es inerte para la suite
móvil. El diff revisado es por tanto `5aa9d2f..de6ed21` (40 commits de Codex + 1
del leader).

## Veredicto: **RECHAZADO**

Motivo en una línea: **`./init.sh` falla en mi ejecución independiente**, y la
suite móvil es **no determinista en HEAD** — 6 de 14 ejecuciones completas en rojo,
de las cuales **4 son atribuibles a #87** (dos ficheros que la feature creó o
reescribió).

El trabajo de fondo es de una calidad notable: R1–R20 están implementados, no
encontré **ni una sola aserción relajada**, los candados numéricos tienen delta 0,
el historial TDD es ejemplar y la prueba de mutación de R20 la reproduje yo mismo.
El rechazo es por un defecto acotado y reparable: **dos carreras asíncronas** que
dejan la suite intermitente. No hay que rehacer nada de la migración.

---

## Bloqueante B1 — la suite móvil es intermitente en HEAD

`./init.sh` (primer plano, `env -u FORCE_COLOR`, sin otro `init.sh` vivo) terminó
**en rojo**. Al no ser reproducible en aislamiento, medí la tasa de fallo con
ejecuciones completas repetidas de la suite móvil, y la comparé contra la línea
base del handoff (`5aa9d2f`) en un worktree desechable.

| Suite | Base `5aa9d2f` | HEAD `de6ed21` | Atribución |
|---|---|---|---|
| `src/screens/add-pet/index.test.tsx` | **2 / 13** rojos | 2 / 14 rojos | **PREEXISTENTE** — no es de #87 |
| `test/__tests__/render-with-providers.test.tsx` | no existía | **2 / 14 rojos** | **#87 (R3)** |
| `src/screens/home/index.test.tsx` | **0 / 13** rojos | **2 / 14 rojos** | **#87 (R17)** |
| **Total ejecuciones en rojo** | **2 / 13** | **6 / 14** | |

El flake de `add-pet` **no cuenta contra #87**: está registrado como deuda
**#72 `mobile-add-pet-photo-test-flake`** en `feature_list.json` (estado `pending`),
cuya descripción ya lo clasifica como *"PREEXISTENTE, no introducido por esa
feature"*. Su tasa es idéntica antes y después (2/13 vs 2/14). Lo dejo fuera del
veredicto y lo señalo para que no se le impute a Codex.

Los otros dos **sí** son de #87 y son los que bloquean.

### B1.a — `test/__tests__/render-with-providers.test.tsx:25` (R3, fichero nuevo de #87)

```
● #87 R3: el helper monta el QueryClientProvider y devuelve su cliente
  › resolves a query while preserving the caller wrapper

  expect(instance).toHaveTextContent()
  Expected instance to have text content: ok
  Received: …

  > 25 |     expect(await screen.findByTestId('probe')).toHaveTextContent('ok');
```

Causa raíz: el `testID="probe"` está presente **también en el estado de carga**
(`<Text testID="probe">{query.data ?? '…'}</Text>`, líneas 10-15 del mismo
fichero). `findByTestId` resuelve por tanto **de inmediato**, en el primer render,
y `toHaveTextContent('ok')` se evalúa **una sola vez, sin reintento**, compitiendo
contra el microtask que resuelve `queryFn`. Bajo carga de CPU pierde la carrera.

Los otros dos `it` del mismo fichero (líneas 34 y 41) usan
`await screen.findByText('ok')`, que **sí** espera por el contenido y no falla
nunca. La asimetría confirma el diagnóstico.

Incumple: **R3** y el criterio 8 de la spec (suite verde).

### B1.b — `src/screens/home/index.test.tsx:666` (R17)

```
● R9: summary degrada con gracia › shows dashes instead of zero for missing metrics
  Unable to find an element with testID: summary-weight
```

```
666 |     await waitFor(() => expect(screen.getByTestId('summary-card')).toBeVisible());
667 |     expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
```

La espera es sobre `summary-card`, un **contenedor que monta antes** que la celda
que se asserta. Con TanStack Query, `petKeys.list()`, `petKeys.detail()` y
`activityKeys.daily()` son tres queries independientes que resuelven en ticks
distintos, así que `summary-card` puede pintarse antes de que exista
`summary-weight`. Con el `useApi` anterior ambos llegaban en el mismo commit de
React, por eso la línea nunca falló en base (0/13).

**Las tres líneas afectadas son preexistentes y sin tocar** (delta 0: base
`5aa9d2f` líneas 591/621/638, HEAD 636/666/683). Codex **no relajó** nada aquí.
El defecto es de **omisión**: el propio reporte declara haber cerrado justo esta
clase de carrera —

> *"La suite completa reveló además que esperar contenedores siempre montados
> (`pet-hero`, `summary-card`, `reminders-section`) dejaba carreras; ahora se
> espera el hijo exacto ya esperado por cada prueba."*

— y en 6 sitios lo hizo bien (verificado: los seis
`waitFor(getByTestId('pet-hero'))` pasaron a `findByTestId('pet-hero-media')` /
`findByTestId('collar-card')`, que son esperas **más fuertes**). Pero **tres
`waitFor(summary-card)` siguen esperando el contenedor**. La afirmación del
reporte es incompleta.

Incumple: **R17** y el criterio 8. Y roza la «regla de oro», que ordena **parar y
anotarlo** cuando una aserción existente deja de funcionar, en vez de dejarla
intermitente.

### Reparación sugerida (no la aplico — no edito código)

En los dos casos, esperar por el **hijo exacto** en vez del contenedor, sin tocar
ningún valor esperado — exactamente el patrón que Codex ya aplicó bien en los
otros seis sitios:
- `render-with-providers.test.tsx:25` → `await screen.findByText('ok')` antes de
  la aserción, o envolverla en `waitFor`.
- `home/index.test.tsx:636, 666, 683` → esperar `summary-weight` (o el hijo que
  cada test asserta) en lugar de `summary-card`.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#87)
- [x] `progress/current.md` describe la sesión activa (#87 activa, #78 en espera)

## Checklist C3 — Arquitectura

C3 describe capas domain / application / infrastructure, propias de
`backend-pet-tracker/`. #87 es **trabajo solo de cliente móvil**: cero cambios en
backend, cero migraciones. Verificado que el diff no toca `backend-pet-tracker/`.

- [x] La capa de red (`src/api/`) sigue siendo la única que habla HTTP; las
      pantallas la consumen por `queryFn`, sin importar `fetch` ni construir URLs
- [x] `src/api/query-keys.ts` es un módulo de constantes puro, sin dependencias
- [x] `QueryProvider` queda dentro de `AuthProvider` y fuera de `Stack`
      (`_layout.tsx:50-56`), como manda **R4**
- [x] **C8 / `docs/ui-guidelines.md`**: N/A por ausencia de cambio — el diff no
      modifica **ni un `className` ni un `style=`** en producción (verificado con
      `git diff … ':!*test*' | grep -E "^[-+].*(className|style=)"` → vacío)

## Checklist C4 — TDD

- [x] R1–R19 tienen `describe('#87 R<n>: …')` que los nombra (19/19 verificado)
- [x] **Historial test-primero perfecto**: los 20 pares (rojo, verde) están en
      orden estricto y **alternando sin solaparse** — rojo en posición 1,3,5…39 y
      verde en 2,4,6…40. Ni un solo commit mezcla test e implementación
- [x] Los commits rojos tocan **solo ficheros de test**. Verificado en 3 al azar
      (`49dc149` R5, `b77c366` R13, `9a5476e` R17): los tres cambian únicamente su
      `.test.tsx` más bookkeeping
- [x] **Rojo por aserción, no por módulo ausente** — ejecuté el rojo de R13
      (`b77c366`) en un worktree desechable:
      ```
      ● #87 R13: HealthScreen lee por TanStack Query
        expect(received).toEqual(expected) // deep equality
        Expected: {"kind": "ok", "pets": [...]}
        Received: undefined
        > 652 | expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
        Tests: 1 failed, 27 passed, 28 total
      ```
      Fallo de aserción legítimo, sin `ReferenceError` ni "Cannot find module", y
      los otros 27 tests del fichero en verde
- [~] **R20 no tiene `describe` que lo nombre.** Es **por diseño de la spec
      aprobada**: R20 se cierra por la vía **(b) de C4** (mutación) y designa
      nominalmente tres `it` preexistentes (`does not replace a new selection
      while the stale pet list refreshes`), no un `describe` nuevo.
      `traceability.md` los nombra uno por uno. **No lo cuento como defecto**,
      pero queda anotado

### R20 — prueba de mutación, reproducida de forma independiente

No me fié del reporte: **replanté la mutación yo mismo** en un worktree
desechable a partir de HEAD, borrando `if (pets.isRefreshing) return;` de
`src/hooks/use-pet-selection.ts`, y corrí las cuatro suites:

```
● R10: preserva la mascota durante el refetch › does not replace a new selection… (food)
● R10: preserva la mascota durante el refetch › does not replace a new selection… (health)
● R10: preserva la mascota durante el refetch › does not replace a new selection… (home)
● R10: usePetSelection respeta el foco y la revalidación › no pisa la selección…
Test Suites: 4 failed, 4 total
```

**Los cuatro candados muerden. Ninguno está ciego** — que es exactamente el
«aviso de zona ciega» que la spec exige comprobar. Además la mutación **no** está
en el sitio obvio: de los tres guardas de `usePetSelection`, se atacó
`pets.isRefreshing`, que es precisamente el campo que la migración recablea
(`useApi.isRefreshing` → `useQuery.isRefetching`) y por tanto el de mayor riesgo.
Elección correcta.

- [x] Mutación versionada en el rojo (`c53f003`) y revertida en el verde (`264e1c8`)
- [x] `use-pet-selection.ts` en HEAD es **byte-idéntico** a su estado tras R8
      (`git diff 15b9eea..HEAD` sobre el fichero → vacío)

## Checklist C5 — Trazabilidad

- [x] `traceability.md`: R1–R20, **ninguna fila `pendiente`**, las 20 en `cumplido`
- [x] Los 40 commits siguen `test(mobile-tanstack-query): … (R<n>)` /
      `feat|fix(mobile-tanstack-query): … (R<n>)`, con R-id en el asunto
- [x] Los 40 hashes de la tabla existen y están en el rango revisado

## Checklist C6 — Spec aprobada

- [x] Los cuatro ficheros con `status: approved` en el frontmatter
- [x] Casilla humana marcada: `requirements.md:943` → `- [X] Aprobado por humano
      (fecha: 2026-09-10)`
- [x] Firma humana real: commit `4a7a1cf`, **AlexisSM377 <al222111377@gmail.com>**,
      *"Approve mobile TanStack Query specification gate"*, +1/−1 sobre
      `requirements.md`

## Checklist C7 — Sin código huérfano

- [x] `src/hooks/use-api.ts` **borrado**
- [x] `src/hooks/__tests__/use-api.test.tsx` **borrado**
- [x] **Cero importadores**: `grep -rnE "from ['\"].*use-api" src/ test/` → vacío
- [x] **R19 y el falso positivo**: la única aparición de la subcadena `use-api` en
      todo el árbol es `screens/home/weekly-activity-chart.test.tsx:505`
      `expect(source).not.toContain('use-api')` — **no es un import**, y el fichero
      tiene **delta 0** contra `5666b85`. Conservado intacto, como manda
      `design.md` §6.2
- [x] Los 6 contratos de `use-api.test.tsx` re-alojados según `design.md` §6.1

---

## Punto 1 del encargo — ¿se relajó alguna aserción? **NO. Ninguna.**

Barrido exhaustivo: **23 líneas `-` con `expect(`** en tests preexistentes (excluido
`use-api.test.tsx`, cuyo borrado autoriza R19), repartidas en solo 3 ficheros. Las
revisé una a una contra su contrapartida `+`.

| Fichero | `-expect` | Veredicto |
|---|---|---|
| `screens/home/index.test.tsx` | 13 | **LEGÍTIMO** |
| `app/(tabs)/__tests__/food.test.tsx` | 9 | **LEGÍTIMO** |
| `app/(tabs)/__tests__/map.test.tsx` | 1 | **LEGÍTIMO** |
| Los otros 11 ficheros de test tocados | 0 | solo añaden |

**`home/index.test.tsx` (13)** — 6 son `waitFor(getByTestId('pet-hero'))`
sustituidos por `findByTestId('pet-hero-media')` / `findByTestId('collar-card')`:
esperar el **hijo exacto** en vez del contenedor siempre montado es **más fuerte**,
no más débil. Los otros 7 se movieron **dentro** de un `waitFor` conservando el
valor literal, incluidos los tres `toHaveLength` — **`1`, `1`, `0` antes y `1`,
`1`, `0` después**. Ningún recuento se ablandó.

Los dos casos que a primera vista parecían un debilitamiento
(`- const summary = await screen.findByTestId('summary-card')` →
`+ const summary = screen.getByTestId('summary-card')`) resultaron ser lo
contrario: en ambos se **añadió antes** `await screen.findByTestId('summary-weight')`.
Espera neta más estricta.

**`food.test.tsx` (9)** — las 4 aserciones del esqueleto de plan y las 5 de
títulos de card, movidas dentro de un `waitFor` con el valor literal intacto
(`stringContaining('h-56')`, `toBeNull()`, `toBeVisible()`). Es exactamente lo que
la «regla de oro» **permite**.

**`map.test.tsx` (1)** — la aserción de `markers` envuelta en `waitFor`, `toEqual`
con el mismo objeto literal.

### Barrido de los patrones que la «regla de oro» prohíbe

| Patrón prohibido | Base | HEAD | Delta |
|---|---|---|---|
| `toHaveBeenCalledTimes` | 88 | 86 | **−2 — explicado** |
| `not.toHaveBeenCalled` | 90 | 92 | +2 (candados añadidos) |
| `queryBy` | 114 | 114 | **0** |
| `toBeTruthy` | 2 | 2 | **0** |
| `try {` | 27 | 27 | **0** |

El −2 de `toHaveBeenCalledTimes` está **totalmente contabilizado** y es inocente:
el borrado autorizado de `use-api.test.tsx` se lleva 3, y
`query-provider.test.tsx` (nuevo) devuelve 1. **Ningún fichero preexistente cambió
su recuento** (verificado fichero a fichero). El contrato
`signOut` → `toHaveBeenCalledTimes(1)` de `use-api.test.tsx:119` está re-alojado en
`query-provider.test.tsx`, como manda `design.md` §6.1.

## Punto 2 — Deltas de conducta: **solo los tres autorizados**

- [x] **`map.tsx`**: el bloque `useFocusEffect` + `setInterval(POLL_MS)` +
      `clearInterval` es **byte-idéntico** al de la base, dependencias del
      `useCallback` incluidas. `POLL_MS = 15000` intacto. Sigue sondeando cada 15 s
      con la pestaña abierta y **sigue dejando de sondear al salir** (el
      `clearInterval` del cleanup no se tocó). Lo único que cambia en el fichero
      son tres `enabled:` (traducción fiel del `fn === null` anterior) y dos
      adaptadores de evento en los botones de reintento
- [x] **`pairing.tsx`**: `useFocusEffect` delta 0 (los dos siguen ahí). El
      `trackingFn` con guarda nula se tradujo a `enabled:` con la **misma
      condición triple** (`phase === 'idle' && selectedPetId !== null &&
      hasSelectedDevice`). Las dos expulsiones de mutación intactas
- [x] No encontré ningún cuarto delta de conducta visible

## Punto 5 — R5 y los `signOut`: **ambas cifras verificadas**

- [x] **`signOut` de lectura en un único sitio**: vive solo en
      `QueryCache.onSuccess` de `query-provider.tsx:24-26`, vía el callback
      `onUnauthorized`. Ninguna pantalla dispara `signOut` por lectura
- [x] **9 llamadas de mutación en 7 ficheros, delta 0**: conté las 10 ocurrencias
      de `signOut(` en `src/` no-test — 9 de mutación
      (`weight-log:107`, `meal-schedule:99`, `add-pet:136,201`, `profile:155`,
      `reminders:97`, `add-reminder:101`, `pairing:148,196`) **más** el botón
      explícito de logout `profile:386`. Comparado fichero a fichero contra
      `5666b85`: **delta 0 en los 12 ficheros**, los de dentro y los de fuera de
      alcance

## Punto 7 — Candados numéricos: **los seis con delta 0**

| Candado (`design.md` §6.4) | Delta vs `5666b85` |
|---|---|
| `language-provider.test.tsx` (longitud del catálogo) | **0** (fichero sin tocar) |
| `consistency-classnames.test.ts` | **0** (fichero sin tocar) |
| `legibility-classnames.test.ts` | **0** (fichero sin tocar) |
| `design-drift.test.ts` (lista blanca de deps) | **0** — solo se **añaden** dos `describe` (R1, R19); ningún `it` ni `expect` existente se modifica (verificado: cero líneas `-`) |
| `weekly-activity-chart.test.tsx` (`transformIgnorePatterns`) | **0** (fichero sin tocar) |
| `map.test.tsx:730-743` (sondeo) | **0** — sigue escrito como delta `initialLastCalls + 1` / `initialPositionsCalls + 1` / `initialRouteCalls`. Codex además **añadió** `expect(initialRouteCalls).toBeGreaterThan(1)`, que refuerza |

- [x] **Ninguna cifra se reescribió como recuento absoluto nuevo.** El cierre del
      reporte declara **"+2 suites, +45 tests"** como delta contra `5666b85`, y lo
      confirmé midiendo los dos extremos: base **68 suites / 1111 tests** → HEAD
      **70 suites / 1156 tests**. La delta declarada es **exacta**

## Punto 8 — Dependencias: **exactamente la autorizada**

- [x] `package.json`: `"@tanstack/react-query": "5.102.8"` — **pin exacto, sin
      `^` ni `~`**
- [x] `bun.lock` añade **solo** `@tanstack/react-query@5.102.8` y su transitiva
      `@tanstack/query-core@5.102.8`. Ninguna otra entrada
- [x] `jest.transformIgnorePatterns[0]` sigue **sin mencionar** `@tanstack`, como
      preveía R1
- [x] **Cero variables de entorno nuevas**: las apariciones de
      `EXPO_PUBLIC_API_URL` en el diff son la variable **ya existente**, reasignada
      en `beforeEach` de bloques de test nuevos

## Otras verificaciones

- [x] **R2**: los cinco mandos exactos (`staleTime: 0`, `gcTime: 5*60*1000`,
      `retry: false`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`),
      y **sin** `placeholderData` / `keepPreviousData`, que R2 prohíbe expresamente
- [x] `bun run typecheck` → **verde**
- [x] `bun run lint` → **verde**, sin avisos
- [x] El diff no toca `backend-pet-tracker/`
- [x] No se abrió ni se mergeó ningún PR; nada cayó en `main`

## No evaluado (fuera del alcance del reviewer)

- **Gate humano no delegable**: prueba de humo en **dev build de Android**
  (`requirements.md` §Gate humano), incluida la firma de los tres deltas de
  conducta. **No lo simulo ni lo doy por hecho** — queda íntegro para el humano
- **`STATUS.md`**: el leader ya lo corrigió a 69/87 en `de6ed21` durante esta
  misma revisión. Bookkeeping del leader, **no un defecto de la implementación**

---

## Resumen para el leader

Un solo bloqueante, de alcance pequeño: **dos carreras asíncronas** que dejan la
suite móvil intermitente y ponen `init.sh` en rojo. No es un problema de diseño ni
de la migración —que está bien hecha, sin una sola aserción relajada— sino de dos
esperas sobre contenedores en vez de sobre el hijo asertado. El propio Codex
aplicó el patrón correcto en otros seis sitios del mismo fichero; faltan cuatro
líneas por alinear (`render-with-providers.test.tsx:25` y
`home/index.test.tsx:636, 666, 683`).

Para reabrir: corregir esas cuatro esperas y demostrar la suite móvil **verde en
10 ejecuciones completas seguidas** (una sola pasada no prueba nada con un flake
de ~15 %). El flake de `add-pet` seguirá apareciendo de vez en cuando: es la deuda
**#72**, preexistente y ajena a #87.

---

## Output de `./init.sh`

Comprobado antes de lanzarlo que no había otro corriendo
(`pgrep -af 'init\.sh'` → `ninguno`). Ejecutado por mí, en primer plano, con
`env -u FORCE_COLOR bash ./init.sh`.

```
PASS src/providers/__tests__/query-provider.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/api/__tests__/query-keys.test.ts
...

Summary of all failing tests
FAIL src/screens/add-pet/index.test.tsx
  ● R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds

    TypeError: Cannot read properties of undefined (reading 'canceled')

    > 115 |     if (picked.canceled || !picked.assets[0]) return;
          |                ^
      at canceled (src/screens/add-pet/index.tsx:115:16)

  ● R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds

    expect(received).toBe(expected) // Object.is equality
    Expected: "file:///new-pet.jpg"
    Received: null

    > 248 |     await waitFor(() =>
      249 |       expect(screen.getByTestId('pet-avatar').props.photoUrl).toBe(
      250 |         'file:///new-pet.jpg',
      251 |       ),

Test Suites: 1 failed, 69 passed, 70 total
Tests:       1 failed, 1155 passed, 1156 total
Snapshots:   1 passed, 1 total
Time:        31.522 s
Ran all test suites.
error: script "test" exited with code 1
```

Esta ejecución concreta cayó por el flake **preexistente #72**. Las ejecuciones
repetidas posteriores destaparon los dos flakes que **sí** son de #87 (B1.a y
B1.b) — ver la tabla del bloqueante B1. El veredicto se apoya en esos dos, no en
el de `add-pet`.

Avisos no bloqueantes, ya presentes en la línea base: faltan `RESEND_API_KEY`,
`RESEND_FROM` y `RESET_LINK_HOST` en `.env`. #87 no usa ninguna.
