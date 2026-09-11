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

---
---

# Ronda 2 — re-revisión tras la corrección de Codex

Fecha: 2026-09-11T03:25:25+00:00
Revisor: subagente `reviewer` (Claude Opus 5)
Branch: `feature/87-mobile-tanstack-query`
HEAD revisado: **`64b82f16`**
Base de candados: **`5666b85`** (verificado ancestro de HEAD)
Diff de la corrección: `936fab4..HEAD -- mobile-pet-tracker/` → **2 ficheros, ambos
de test, cero producción**

> **Aviso de rebase.** La branch se rebasó sobre `main` @ `f3e3280` (que ya trae
> #82). Comprobado que `main` **no tocó `mobile-pet-tracker/` entre `5666b85` y
> `f3e3280`** (`git diff --stat 5666b85..f3e3280 -- mobile-pet-tracker/` → vacío),
> así que **todos los deltas móviles medidos en la ronda 1 siguen midiendo lo
> mismo**. Y `git diff --stat f3e3280..HEAD -- backend-pet-tracker/ infra/` → vacío:
> #87 sigue sin tocar backend.

## Veredicto: **APROBADO**

Las dos carreras están cerradas y verificadas por mí: **10/10 verdes** en racha
sobre los dos ficheros tocados y **4/4 verdes** de la suite móvil completa (3
pasadas sueltas + la de `init.sh`). **`./init.sh` en verde de extremo a extremo**,
ya con #82 dentro. El flake **#72** de `add-pet` **no cayó ni una sola vez** en
esas 4 pasadas.

Queda **un defecto no bloqueante del veredicto pero sí bloqueante del cierre**
(D2, hashes de trazabilidad muertos por el rebase), que arregla el **leader** en
`specs/` y `progress/` sin otra ronda de Codex ni tocar código.

---

## 1. ¿Están cerradas las dos carreras? **SÍ, las dos.**

### B1.a — `test/__tests__/render-with-providers.test.tsx` (R3) → **cerrada**

```diff
-    expect(await screen.findByTestId('probe')).toHaveTextContent('ok');
+    await screen.findByText('ok');
+    expect(screen.getByTestId('probe')).toHaveTextContent('ok');
```

Correcto y **sin pérdida**: la aserción original sobre `probe` se conserva
literalmente; lo que cambia es **quién espera**. `findByText('ok')` no puede
resolver hasta que la query resuelve — el nodo con texto `'ok'` no existe durante
la carga, donde el `Probe` pinta `'…'`. La carrera desaparece por construcción, no
por suerte de scheduling. Es además el patrón que ya usaban los otros dos `it` del
mismo fichero, que nunca fallaron; ahora los tres son homogéneos.

### B1.b — `src/screens/home/index.test.tsx` (R17) → **cerrada en los tres sitios**

Los tres `await waitFor(() => expect(getByTestId('summary-card')).toBeVisible())`
pasan a esperar **contenido del hijo** dentro del propio `waitFor`:

| Caso | Antes esperaba | Ahora espera |
|---|---|---|
| `formats metrics from the last day…` | `summary-card` visible | `summary-activity` → `'1h 35m'` |
| `shows dashes instead of zero…` | `summary-card` visible | `summary-weight` → `'—'` |
| `#69 R7: degrada el peso a un guion…` | `summary-card` visible | `summary-weight` → `'—'` |

`summary-card` es el contenedor (`home/index.tsx:314`), siempre montado en cuanto
hay `selectedPetId`; las celdas `summary-*` viven dentro de la rama
`activity.data?.kind === 'ok'`, que es la que llega tarde. Esperar la celda es
esperar el dato. Carrera cerrada por construcción.

**Barrido de casos hermanos** (¿queda algún otro `waitFor` sobre contenedor?):
comprobado que las 6 esperas sobre `summary-card` sueltas
(`await screen.findByTestId('summary-card')`) ya habían pasado en la ronda 1 a
`await screen.findByTestId('summary-weight')`, y que las de `pet-hero` pasaron a
`pet-hero-media` / `collar-card`. **No queda ninguna espera sobre contenedor en el
fichero.**

---

## 2. Dictamen sobre las aserciones borradas — **sustitución legítima, NO bloqueante**

### Primera corrección al encargo: **son tres, no dos**

Se borraron **tres** `expect(screen.getByTestId('summary-card')).toBeVisible()`:
en `formats metrics…` (~636), en `shows dashes…` (~666) **y también** en
`#69 R7: degrada el peso…` (~683), donde el mismo `waitFor` desapareció y la
`toHaveTextContent('—')` del final se movió dentro. Conteo neto en el fichero:
6 líneas `-expect` frente a 3 `+expect` → **−3 `expect`**, las tres el mismo
`toBeVisible` sobre el contenedor. Tras la ronda 2 **ningún test del árbol asserta
ya `expect(getByTestId('summary-card')).toBeVisible()`** (`grep` → vacío).

### No lo he razonado: lo he medido con dos mutaciones

No acepto "la aserción del hijo implica la del padre" como argumento de sillón.
Lo puse a prueba en un **worktree desechable** sobre `64b82f16`, mutando el
contenedor y corriendo el `describe` entero `R9: summary degrada con gracia`
(7 tests):

**Mutación A — `<Card testID="summary-card" … style={{ opacity: 0 }}>`**

```
✕ formats metrics from the last day in the response
✕ #69 R7: degrada el peso a un guion cuando el perfil no resuelve
✕ shows a summary skeleton while activity is pending
✕ shows skeletons without the previous pet data while a newly selected pet loads
✓ shows dashes instead of zero for missing metrics      ← NO muerde
✓ explains that activity tracking requires a collar
✓ degrades an activity error without breaking the dashboard
Tests: 4 failed, 3 passed
```

**Mutación B — `<Card testID="summary-card" … style={{ display: 'none' }}>`**

```
✕ los 7 tests del describe, incluido 'shows dashes instead of zero…'
Tests: 7 failed
```

### Qué prueban exactamente esas dos corridas

1. **Casos 1 y 3 (`formats metrics…` y `#69 R7…`): pérdida CERO, demostrada.**
   Siguen mordiendo la mutación de visibilidad del contenedor **por sí mismos**.
   - Caso 1 conserva `expect(screen.getByText('Resumen de hoy')).toBeVisible()`.
     `'Resumen de hoy'` es `home.summaryTitle` (`i18n/catalog.ts:333`), es decir
     `summary-card-title`, **hijo directo** de `summary-card`
     (`home/index.tsx:314-319`).
   - Caso 3 conserva el bucle
     `for (testId of [summary-weight, summary-activity, summary-sleep, summary-distance]) expect(getByTestId(testId)).toBeVisible()`.
   - `toBeVisible` de RNTL **recorre recursivamente los ancestros**
     (`matchers/to-be-visible.js`: `return isElementVisible(parent, cache)`), así que
     *hijo visible ⟹ contenedor visible*. La línea borrada era **redundante**, y la
     mutación A lo confirma: ambos tests caen igual sin ella.

2. **Caso 2 (`shows dashes instead of zero…`): pierde exactamente un vector, el
   `opacity: 0`. Nada más.**
   Sus cuatro aserciones restantes son `toHaveTextContent('—')`, que no comprueba
   visibilidad. Pero **sí sobrevive el filtro de accesibilidad**: RNTL 14.0.1 trae
   `defaultIncludeHiddenElements: false` (`dist/config.js`) y **no hay ningún
   `configure()`** en `test/jest-setup.js`, así que `getByTestId` **no encuentra**
   elementos ocultos ni los de un subárbol oculto (`display:none`, `aria-hidden`,
   `accessibilityElementsHidden`, `importantForAccessibility`). Por eso la mutación
   B **sí** lo tumba. Lo único que `isHiddenFromAccessibility` deja fuera es —
   literalmente, por comentario en el propio código de RNTL — `opacity: 0`.

3. **A nivel de fichero el delta de capacidad es 0.** El único vector perdido
   (`opacity: 0` sobre el contenedor) lo siguen mordiendo **cuatro** tests del
   mismo `describe`, que renderizan la misma pantalla por el mismo camino.

### Por qué esto es sustitución y no relajación (y por qué es consistente)

La «regla de oro» (`requirements.md:174-187`) prohíbe *borrar una aserción*. La
letra se incumple. Pero su propósito declarado es el criterio 5, *"sin relajar
aserciones"*, y **mido que la red no se ha aflojado**: en dos de los tres casos la
línea borrada es demostrablemente redundante, y en el tercero el hueco es un
vector que el mismo `describe` cubre cuatro veces.

Pesa además la **consistencia con mi propio veredicto de la ronda 1**, donde
aprobé **seis** sustituciones de exactamente esta forma
(`waitFor(expect(getByTestId('pet-hero')).toBeVisible())` →
`await screen.findByTestId('pet-hero-media')`), que también borran un `toBeVisible`
de contenedor y lo reemplazan por una consulta *hidden-aware* sobre el hijo.
Bloquear ahora las tres de la ronda 2 obligaría a reabrir aquellas seis. El
criterio que apliqué entonces y aplico ahora es el mismo: **esperar/assertar el
hijo exacto es más fuerte que assertar el contenedor siempre montado**.

**Dictamen: sustitución legítima. No bloqueante. No exijo restitución.**

### D1 — Observación no bloqueante (y aviso al humano)

Dos cosas que sí anoto, sin bloquear:

- **El reporte de Codex dice literalmente «No se relajó ninguna aserción».
  Es inexacto**: se borraron tres. La regla de oro reserva esta decisión al humano
  (*"se para y se escribe por qué […] y decide el humano en la revisión"*) y Codex
  ni paró ni lo escribió. **La decisión queda formalmente abierta al humano** que
  firme el smoke: si prefiere la letra sobre el fondo, la restitución es de una
  línea por caso, sin tocar los `waitFor` nuevos —
  `expect(screen.getByTestId('summary-card')).toBeVisible();` inmediatamente
  después del `waitFor`, en `src/screens/home/index.test.tsx` líneas ~638, ~669 y
  ~687. Yo no lo exijo porque he medido que no compra cobertura nueva salvo en el
  caso 2, y ahí solo el vector `opacity: 0` que ya cubren cuatro hermanos.
- Los dos commits de corrección **no llevan R-id en el asunto**
  (`fix(mobile-tanstack-query): await probe content` /
  `await home summary content`), contra el formato de C5. `traceability.md` sí los
  mapea a R3 y R17 explícitamente, así que la trazabilidad no se pierde.

---

## 3. Determinismo — medido por mí

### Verificación del número que declara Codex

Codex declara **«Suite móvil completa: 10 pasadas verdes consecutivas»**.
**No es verificable desde disco**: no hay log ni artefacto versionado de esas
pasadas, solo la afirmación en `progress/impl_mobile-tanstack-query.md`. Lo que sí
puedo decir es que **es consistente con lo que yo mido** y que el propio reporte es
honesto sobre el método (*"Las rachas preliminares en las que cayó `add-pet` se
reiniciaron"*): es una **racha** reiniciada ante el flake #72, no 10 corridas
arbitrarias. Con la tasa de #72 medida en la ronda 1 (~15 %), una racha así exige
varios reintentos, que es exactamente lo que describe.

### Criterio a — racha de 10 sobre los dos ficheros tocados

`npx jest test/__tests__/render-with-providers.test.tsx src/screens/home/index.test.tsx`,
en serie, sin nada más corriendo (~18 s por pasada):

```
pasada  1 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  2 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  3 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  4 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  5 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  6 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  7 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  8 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada  9 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
pasada 10 :: Test Suites: 2 passed, 2 total  Tests: 115 passed, 115 total
```

**10/10 verdes** (11 contando la pasada de cronometraje previa). Cero rojos.

### Criterio b — tres pasadas de la suite móvil completa

```
########## SUITE COMPLETA pasada 1 ##########
Test Suites: 70 passed, 70 total
Tests:       1156 passed, 1156 total
Snapshots:   1 passed, 1 total
########## SUITE COMPLETA pasada 2 ##########
Test Suites: 70 passed, 70 total
Tests:       1156 passed, 1156 total
Snapshots:   1 passed, 1 total
########## SUITE COMPLETA pasada 3 ##########
Test Suites: 70 passed, 70 total
Tests:       1156 passed, 1156 total
Snapshots:   1 passed, 1 total
```

Más la pasada móvil **dentro de `init.sh`**: `70 passed / 1156 passed`, verde.

- **`add-pet` (#72): cayó 0 de 4 veces.** No hizo falta invocar la excepción
  concedida.
- **No cayó nada más. Cero rojos de cualquier clase en las 4 pasadas completas.**

Comparado con la ronda 1 — **6/14 pasadas en rojo**, de las cuales 4 imputables a
#87 — el cambio es el esperado de cerrar las dos carreras.

**Salvedad honesta**: 10 pasadas de dos ficheros y 4 completas no *demuestran*
ausencia de flake; lo que cierra el asunto de verdad es que ambas correcciones son
**estructuralmente** no-carrera (se espera el nodo que solo existe cuando el dato
llegó), no que la moneda haya salido cara 14 veces.

---

## 4. El rebase no ha roto nada

- `env -u FORCE_COLOR bash ./init.sh` → **`EXIT=0`, todo verde**, ya con #82 dentro
  (ver el bloque de salida al final).
- Backend post-#82 verde en mi propia corrida: unit `163 suites / 1246 tests`,
  infra `2 / 14`, e2e `25 de 28 suites (3 skipped) / 357 passed, 8 skipped`.
- **Los 42 commits de #87 sobrevivieron al rebase 1:1**, mismo asunto y mismo
  orden: mapeé los 42 hashes viejos contra `797a5bd5..HEAD` y **los 42 casan por
  asunto**, ninguno perdido ni fusionado. La alternancia **test → feat/refactor**
  se conserva intacta comando a comando, así que **C4 sigue en pie post-rebase**.
- C6 intacto: `fb0fb7b5 Approve mobile TanStack Query specification gate`,
  **AlexisSM377 <al222111377@gmail.com>**, +1/−1 sobre `requirements.md`; los 4
  ficheros de spec con `status: approved`; `requirements.md:943` → `- [X] Aprobado
  por humano (fecha: 2026-09-10)`.

### D2 — **Defecto: todos los hashes de `traceability.md` están muertos tras el rebase**

`traceability.md` (y la tabla de commits de `impl_mobile-tanstack-query.md`) citan
los hashes **pre-rebase**. Comprobado uno a uno: **existen todavía como objetos
sueltos en este clon** (los mantiene vivos el reflog) pero **ninguno es ancestro de
HEAD**:

```
2837dc3 : existe : NO-ancestro      9a5476e : existe : NO-ancestro
a6e5cdf : existe : NO-ancestro      bbc6193 : existe : NO-ancestro
c53f003 : existe : NO-ancestro      264e1c8 : existe : NO-ancestro
2c38a54 : existe : NO-ancestro      efdf52c : existe : NO-ancestro
```

Tras un `git gc`, en un clon nuevo o en el PR **no resuelven**: la columna
*Evidencia* de las 20 filas queda apuntando a la nada, y C5 pide precisamente que
el commit sea localizable. En la ronda 1 verifiqué que «los 40 hashes existen y
están en el rango revisado»; **eso ya no es cierto**.

**No bloquea el veredicto de la implementación** —el código y los tests son
correctos y el contenido de los commits es idéntico— **pero sí bloquea marcar #87
como `done`.** Lo arregla el **leader**, que es quien posee `specs/` y `progress/`,
sin otra ronda de Codex y sin tocar código.

**Arreglo exacto — mapeo viejo → nuevo, verificado por asunto (42/42):**

| Viejo | Nuevo | Asunto |
|---|---|---|
| `2837dc3` | `0f9b0293` | test … lock exact dependency (R1) |
| `a6e5cdf` | `f9655ada` | feat … install TanStack Query (R1) |
| `a231cdd` | `1775ebe5` | test … lock QueryClient defaults (R2) |
| `492cdab` | `f37f5f27` | feat … configure QueryClient defaults (R2) |
| `af1ac31` | `82997296` | test … require isolated query test helper (R3) |
| `3cd184f` | `2f6c8f8e` | feat … add isolated query test helper (R3) |
| `cbceb6b` | `e9cd3778` | test … require root query provider (R4) |
| `50cb93a` | `c56df5ea` | feat … mount root query provider (R4) |
| `49dc149` | `7e09aa6e` | test … require global unauthorized handling (R5) |
| `171ed65` | `b1726090` | feat … centralize unauthorized reads (R5) |
| `2a5c404` | `df05877d` | test … require cache clearing on sign-out (R6) |
| `fe9f282` | `dd5f180b` | feat … clear cache on sign-out (R6) |
| `1c947c4` | `67c40976` | test … define query key contract (R7) |
| `b5e7f31` | `f6ef34d9` | feat … add canonical query keys (R7) |
| `cfe1b34` | `e5c23b5e` | test … decouple pet selection source (R8) |
| `15b9eea` | `1d1fdbb0` | refactor … narrow pet selection source (R8) |
| `07c4ba5` | `cad725dc` | test … require docs query cache entries (R9) |
| `5e00853` | `12c84b76` | refactor … migrate docs queries (R9) |
| `8a46cc7` | `9645cbcf` | test … require weight query cache entry (R10) |
| `97049e7` | `0d64e42b` | refactor … migrate weight log query (R10) |
| `be536d1` | `284eeb2b` | test … require meal query cache entries (R11) |
| `6966af6` | `73fc423e` | refactor … migrate meal schedule queries (R11) |
| `b4b279e` | `3f47ebc0` | test … require food query cache entries (R12) |
| `e1df8ef` | `05222fa9` | refactor … migrate food queries (R12) |
| `b77c366` | `7e135990` | test … require health query cache entries (R13) |
| `157a7a8` | `84d30862` | refactor … migrate health queries (R13) |
| `6991074` | `7fe2c50c` | test … require reminder query cache entries (R14) |
| `0baba1d` | `e20111de` | refactor … migrate reminder queries (R14) |
| `c204287` | `ab66c3b7` | test … require pairing query cache entries (R15) |
| `79363d9` | `f79ddf58` | refactor … migrate pairing queries (R15) |
| `9f0e27e` | `cb0b6f98` | test … require profile query cache entries (R16) |
| `f9afe6a` | `2d75b433` | refactor … migrate profile queries (R16) |
| `9a5476e` | `70199d55` | test … require home query cache entries (R17) |
| `bbc6193` | `ee94846d` | refactor … migrate home queries (R17) |
| `6afcc38` | `b30a0c83` | test … require map query cache entries (R18) |
| `5fa6c6e` | `aaa5c60a` | refactor … migrate map queries (R18) |
| `98b563f` | `fbdd3cdd` | test … forbid legacy use-api footprint (R19) |
| `e443eb3` | `588c691d` | refactor … remove legacy use-api hook (R19) |
| `c53f003` | `523ef5b5` | test … prove stale selection guards (R20) |
| `264e1c8` | `f13d945b` | fix … restore stale selection guard (R20) |
| `2c38a54` | `2daf16ba` | fix … await probe content (ronda 2, R3) |
| `efdf52c` | `33f31f42` | fix … await home summary content (ronda 2, R17) |

---

## Lo que doy por bueno de la ronda 1, y por qué sigue valiendo

Todo lo que aprobé en la ronda 1 **sigue midiendo lo mismo**, porque la base de
candados `5666b85` sigue siendo ancestro de HEAD y `main` **no tocó
`mobile-pet-tracker/` entre `5666b85` y `f3e3280`**. La corrección de la ronda 2 se
limita a dos ficheros de test (2 y 15 líneas), sin producción. No re-audito:

| Dado por bueno en ronda 1 | Por qué sigue valiendo |
|---|---|
| Cero aserciones relajadas en las 23 `-expect` auditadas | Ficheros intactos salvo `home/index.test.tsx`, cuyo delta de ronda 2 reauditado arriba punto por punto |
| Los seis candados numéricos con delta 0 | La base móvil no se movió con el rebase |
| `signOut` 9 mutación / 7 ficheros, delta 0 | Ídem; ningún commit de ronda 2 toca `src/` de producción |
| Pin exacto `5.102.8` + `bun.lock` con solo dos entradas | Reverificado: `package.json:8` sigue en `"5.102.8"` |
| Los tres deltas de conducta autorizados (`map.tsx`, `pairing.tsx`) | Ficheros no tocados en ronda 2 |
| TDD rojo→verde en los 40 commits | Reverificado post-rebase: los 42 casan 1:1 y la alternancia se conserva |
| Mutación de R20 reproducida por mí | `use-pet-selection.ts` no tocado en ronda 2 |
| C7 — `use-api.ts` y su test borrados, cero importadores | Reverificado: fichero ausente, `grep` de importadores vacío |

## Checklists (ronda 2)

**C2 — Estado coherente**
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#87)
- [x] `progress/current.md` actualizado con la ronda de corrección

**C3 — Arquitectura**
- [x] N/A backend: `git diff f3e3280..HEAD -- backend-pet-tracker/ infra/` → vacío
- [x] C8 / `docs/ui-guidelines.md`: la corrección no toca ni un `className` ni un
      `style=` de producción (los dos commits son 100 % test)

**C4 — TDD**
- [x] Los 19 `describe('#87 R<n>: …')` intactos; R20 por la vía (b) de C4, como en
      la ronda 1
- [x] Alternancia test → implementación conservada por el rebase (42/42)
- [~] Los dos commits `fix` de la ronda 2 no llevan R-id en el asunto (D1)

**C5 — Trazabilidad**
- [x] `traceability.md`: 20 filas, **ninguna `pendiente`** (la única aparición de
      la palabra es la leyenda de C5 en la línea 10)
- [ ] **Los hashes de la columna *Evidencia* no son ancestros de HEAD → D2**

**C6 — Spec aprobada**
- [x] 4 ficheros con `status: approved`; casilla humana marcada; firma real de
      AlexisSM377 en `fb0fb7b5`

**C7 — Sin código huérfano**
- [x] `use-api.ts` y `use-api.test.tsx` ausentes, cero importadores

## No evaluado (fuera del alcance del reviewer)

- **Gate humano no delegable**: prueba de humo en **dev build de Android**, con la
  firma de los tres deltas de conducta. **No lo simulo.** Añado a esa firma la
  decisión abierta de D1 sobre las tres `toBeVisible` borradas.

---

## Resumen para el leader (ronda 2)

**Aprobado.** Las dos carreras están cerradas por construcción, no por suerte:
**10/10** verdes en los dos ficheros tocados, **4/4** verdes de la suite móvil
completa (#72 no cayó ninguna vez) y **`init.sh` verde de extremo a extremo** con
#82 ya dentro.

Sobre las aserciones borradas: **son tres, no dos**, y mi dictamen es
**sustitución legítima**, demostrado con dos mutaciones sobre el contenedor —
`opacity: 0` tumba 4 de los 7 tests del `describe`, `display: 'none'` tumba los 7.
Dos de las tres líneas borradas eran redundantes; la tercera pierde solo el vector
`opacity: 0` en su test, que cuatro hermanos siguen mordiendo. Bloquearlo sería
además incoherente con las seis sustituciones idénticas que aprobé en la ronda 1.

**Antes de marcar `done`, dos cosas:**
1. **D2 (te toca a ti)**: refrescar los 42 hashes de `specs/mobile-tanstack-query/traceability.md`
   y de la tabla de `progress/impl_mobile-tanstack-query.md` con el mapeo de arriba —
   los actuales murieron en el rebase.
2. **Smoke humano en dev build de Android**, y de paso que el humano ratifique D1
   (la letra de la regla de oro dice que esa decisión es suya).

---

## Output de `./init.sh` (ronda 2)

`pgrep -af 'init\.sh' | grep -v grep` → `ninguno` antes de lanzarlo. Ejecutado por
mí, en primer plano, con `env -u FORCE_COLOR bash ./init.sh`. **`EXIT=0`.**

```
→ Verificando entorno...
✅ node / pnpm / bun disponibles

→ Verificando variables de entorno...
✅ .env encontrado          ✅ DATABASE_URL definida
⚠️  faltan 3 claves de .env.example: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
    (preexistentes; #87 no usa ninguna)

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-tanstack-query
✅ STATUS.md sincronizado con feature_list.json

→ Build...        ✅ Build exitoso

→ Ejecutando tests...
  backend unit   Test Suites: 163 passed, 163 total   Tests: 1246 passed, 1246 total
  infra          Test Suites:   2 passed,   2 total   Tests:   14 passed,   14 total
  móvil          Test Suites:  70 passed,  70 total   Tests: 1156 passed, 1156 total
                 Snapshots: 1 passed, 1 total        Time: 29.763 s
✅ Tests pasados

→ Tests e2e...
  Test Suites: 3 skipped, 25 passed, 25 of 28 total
  Tests:       8 skipped, 357 passed, 365 total
  Time:        86.345 s
✅ Tests e2e pasados

→ Lint...       ✅ Lint sin errores
→ Typecheck...  ✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 70/88 completadas | 17 pendientes
```

Sin un solo test en rojo. Los avisos de `.env` y el de `NodeVersionSupportWarning`
del AWS SDK son preexistentes y ajenos a #87.
