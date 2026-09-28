---
feature: "mobile-home-weight-without-collar"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-home-weight-without-collar]] (#77)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y los tests literales, y [[traceability]] para la trazabilidad.
>
> Fuente: `feature_list.json` #77 (description, siete criterios y
> `files_affected`), abierta por el humano al firmar #69, que la dejó fuera en
> su R7. Cada premisa del encargo se verificó contra el árbol antes de escribir
> un requisito (§0); las que no cuadraban se corrigen en §0.2. Cada rojo, cada
> verde y cada mutación de las tablas se **midió** con una sonda del
> spec_author en el scratchpad (copia de `mobile-pet-tracker/` fuera del repo,
> con un borrador de la implementación y de los tests), no se supuso.
>
> Feature **solo móvil**, P3. Un fichero de producción
> (`src/screens/home/index.tsx`) y su test. **Cero dependencias, cero cambios
> nativos** (no hay que regenerar el dev build), **cero backend**, **cero
> claves de catálogo** y **cero llamadas nuevas a la API**.
>
> **Enmienda 1 (R5, 2026-09-28, firmada el 2026-09-28 en `139791bd`):** entra un segundo
> fichero de test, `src/app/(tabs)/__tests__/food.test.tsx`, para cerrar la
> carrera que tumbó la base de Codex. `src/app/(tabs)/food.tsx` cambia **solo
> de forma transitoria** (la mutación Q1 se versiona y se revierte): su diff
> final contra `origin/main` es **vacío**. Todo lo de R5 está en
> §Enmienda 1; lo que la enmienda cambia fuera de ella lleva la marca
> **Enmienda 1**.
>
> Base: `a8d5cb70` (= `origin/main` el 2026-09-27, con #99 mergeado por la
> PR #166). Blobs de base: `src/screens/home/index.tsx` `dbb5b034`,
> `src/screens/home/index.test.tsx` `abbdb5b8`: los mismos que midió #126 en
> `d7cb0d60`, porque #99 no tocó la Home ni `docs/conventions.md`
> (`git diff --stat d7cb0d60 a8d5cb70 -- mobile-pet-tracker/src/screens/home docs/conventions.md`
> vacío). Branch `feature/77-mobile-home-weight-without-collar`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa. **Ninguna cita usa número
> de línea**: todo ancla es un texto literal que se encuentra con `grep -n`.
> #126 vive en paralelo sobre el mismo fichero de test: §Rebase sobre #126.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `a8d5cb70`) |
|---|---|---|
| P1 | La tira aparece y desaparece **entera** con el estado de la actividad | `src/screens/home/index.tsx`, dentro de `<Card testID="summary-card" className="gap-4">` (a su vez bajo `{selectedPetId ? (`): el skeleton bajo `{activity.data === undefined ? (`; una nota bajo `{activity.data?.kind === 'no-tracking' ? (`; otra bajo el trío `activity.data?.kind === 'error' \|\|` / `'unreachable'` / `'missing-config'`; y la fila `<View className="flex-row">` con las cuatro celdas bajo `{activity.data?.kind === 'ok' ? (`. Con `'unauthorized'` no se pinta nada salvo el título |
| P2 | El peso **no** depende de la actividad: sale del detalle del perfil, otra petición y otro estado de carga | La celda pinta `fmtKg(` con `detail.data?.kind === 'ok'` / `? detail.data.pet.currentWeightKg` / `: null,`; `const detail = useQuery({` usa `petKeys.detail(` y `getPet(`; `const activity = useQuery({` es otra query |
| P3 | El guion sale de `fmtKg(null)` | `src/screens/home/format.ts`: `` return kg === null ? '—' : `${kg} kg`; ``. Con el detalle cargando, en error o con `currentWeightKg: null`, la celda pinta `—`: es la conducta que fija `it('#69 R7: degrada el peso a un guion cuando el perfil no resuelve'` en estado `ok` |
| P4 | Los estados de la actividad | `src/api/activity.ts`, `export type DailyActivityState =`: `ok`, `no-tracking`, `unauthorized`, `error`, `unreachable` (con `message`) y `missing-config` |
| P5 | `'unauthorized'` termina la sesión | `src/providers/query-provider.tsx`: `if (isUnauthorized(data)) onUnauthorized();`. En test, `renderWithProviders(ui, { wrapper, onUnauthorized })` de `test/render-with-providers.tsx` (`const queryClient = createQueryClient(onUnauthorized, 0);`) |
| P6 | Registrar un peso mueve `currentWeightKg` y la Home lo relee al volver | `backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts`, `async create(`: actualiza `pets.currentWeightKg` salvo que exista una medida posterior (`notExists` … `gt(weights.measuredAt, data.measuredAt)`). En la Home, `const refetchDetail = detail.refetch;` y el `useFocusEffect` llama a `refetchDetail();`. El smoke (R4) no necesita nada nuevo |
| P7 | El candado de fuente de los iconos cuenta **literales** | `it('#69 R9: usa iconos de reicon y ningún emoji'`: `` /<(?:Weight\|Walk\|Moon\|Map) size=\{20\} color=\{muted\} \/>/g `` `.toHaveLength(4)`. Hoy hay un literal de cada icono |
| P8 | Qué pinta el doble de iconos | `jest.mock('reicon-react-native', () => {` del test de la Home: `mockIcon('icon-weight')` y hermanos devuelven un `View` con `testID` y **todas** las props recibidas (`{ testID, ...props }`). El espía `.spyOn(Uniwind, 'getCSSVariable')` ya se usa seis veces en el fichero (p. ej. dentro de `describe('#124 R1: el icono de la campana se pinta con la tinta muted'`) |
| P9 | Clases de la fila nueva | `self-center` ya existe en `src` (`src/app/(auth)/login.tsx`, `src/screens/reset-password/index.tsx`); `flex-3` y `pl-3` son **nuevas** en `src` (`grep -rn "flex-3\|pl-3" src --include=*.tsx` vacío). Son utilidades de escala de Tailwind v4.3.3: Uniwind 1.11.0 compila `flex-3` a `flexGrow: 3, flexShrink: 1, flexBasis: '0%'`. Ningún hex, ninguna clase arbitraria |
| P10 | Copy: cero claves nuevas | `src/i18n/catalog.ts` ya tiene `'home.weight': 'Peso'`, `'home.activityNeedsCollar': 'La actividad requiere un collar'` y `'home.couldNotLoadActivity': 'No se pudo cargar la actividad'` (y sus `en`). Tras #77 cada una sigue saliendo **una vez** en `index.tsx`. `src/providers/__tests__/language-provider.test.tsx` (`260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2,`) y `src/__tests__/ui-language.test.ts` (`expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);`) **no se mueven** (medido) |
| P11 | Cifras tabulares de la Home | `style={TABULAR_NUMS}` sale **8** veces en `index.tsx`; lo vigila `describe('#62 R15: todo contador usa cifras tabulares'` de `src/__tests__/consistency-classnames.test.ts` (`const HOME_TABULAR_AT_9358CC7 = 4;` más sus deltas). La celda de peso ya lo lleva: **sigue en 8** |
| P12 | Bases | Del spec_author, sin pipe, desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/home/index.test.tsx` **144** (exit 0); `bun run --cwd mobile-pet-tracker test` **83 suites / 1530 tests** (exit 0) |

### §0.2 Premisas corregidas o precisadas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | «reescribir los cinco `it` de `describe('R9: summary degrada con gracia')` en `index.test.tsx:441-560`» | Los números de línea caducaron (el `describe` está hoy mucho más abajo; se ancla por su título) y el `describe` tiene **siete** `it`, no cinco (`formats metrics…`, `shows dashes…`, `#69 R7: degrada el peso…`, `explains that activity tracking requires a collar`, `degrades an activity error…`, `shows skeletons without the previous pet data…`, `shows a summary skeleton while activity is pending`). **Ninguno** hay que reescribir: los siete siguen verdes **sin tocarlos** con la implementación de esta spec (medido). Los `it` del estado nuevo van en `describe` propios con prefijo `#77` | §Candados «Siguen verdes» |
| C2 | «No es un ajuste, es un estado de carga nuevo» | No hace falta. La fila espera **solo** a la actividad; mientras el detalle carga, la celda pinta `—`, exactamente como en estado `ok` desde #69 R7 (P3). Añadir una espera al detalle rompería `#69 R7` (sonda M3 de R1) | [[design]] D3 |
| C3 | «una fila que a veces tiene una celda y a veces cuatro, con su propio juego de divisores» | Con la composición de D1 la fila sin actividad tiene **dos** hijos (la celda y la nota) y el divisor es el `border-r` que la celda ya lleva en `ok`: **ninguna** clase condicional, ningún juego de divisores propio | [[design]] D1, D5 |
| C4 | `files_affected`: la pantalla y su test | Falta la **enmienda a #69 R7** en `specs/mobile-home-stats-strip/requirements.md` (su cláusula «sin celdas» y «no desacoplar la celda de peso» dejan de valer). La escribe el spec_author en esta misma spec; el humano la firma en su casilla propia | [[design]] D8 |
| C5 | «si `activity.data` no es `ok` … no se pinta ninguna celda» | Precisión: «no `ok`» cubre también `undefined` (cargando) y `'unauthorized'` (sesión caducada). En esos dos **tampoco** se pinta la celda con esta spec (R3): cargando manda el skeleton, y `'unauthorized'` cierra la sesión (P5) | [[design]] D2 |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D8** de [[design]] tal cual. Aquí, una línea
por las que fijan comportamiento, forma o alcance; D5 (una sola celda de peso
compartida), D6 (arnés de test) y D7 (orden y rojos) son técnicas.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **Composición (B): la celda de peso y la nota en la misma fila** | Sin actividad, la fila es la celda de peso (misma anatomía y mismo ancho que en `ok`: un cuarto) seguida de la nota en los tres cuartos restantes, centrada en vertical; el `border-r` de la celda es el divisor. Descartadas: (A) celda a todo el ancho con la nota debajo; (C) celda de un cuarto con la nota debajo; (D) cuatro celdas con guiones |
| **D2** | **Estados** | Cargando la actividad: solo el skeleton, como hoy. `ok`: la tira de #69 sin cambios. `no-tracking`, `error`, `unreachable`, `missing-config`: celda de peso + nota. `unauthorized`: **ninguna fila** (la sesión se cierra) |
| **D3** | **El peso sale del detalle y la fila no lo espera** | `fmtKg(currentWeightKg)` del detalle, como en `ok`: `12.4 kg`, o `—` sin peso **o mientras el detalle carga o falla**. **Cero** peticiones nuevas (nada de `health-records`) |
| **D4** | **Las notas entran en la fila, con el mismo copy** | Mismo `testID="summary-note"`, mismas claves y mismo texto; cambia su sitio (dentro de la fila, tras la celda) y su clase (`flex-3 self-center pl-3 font-normal text-muted`). Sigue sin ser pulsable |
| **D8** | **Enmienda a #69 R7** | Se retira «sin celdas» para los cuatro estados sin actividad y «no desacoplar la celda de peso»; el resto de #69 R7 sigue. Casilla propia en `specs/mobile-home-stats-strip/requirements.md` §Enmienda #77 |

Si el humano prefiere (A) o (C) en D1, esta spec se reabre: cambian R2 entero
(anatomía, clases y cardinalidad de la fila), las sondas N1-N19 y el smoke.

---

## Contrato (normativo)

Estado **final** de `src/screens/home/index.tsx` (tras el verde de R3). Qué
parte entra en cada commit lo fija [[tasks]]: el verde de R1 solo cambia la
guarda y envuelve las otras tres celdas; el de R2 mueve las notas.

- Se **borran** los dos bloques de nota sueltos, el que empieza por
  `{activity.data?.kind === 'no-tracking' ? (` y el que empieza por
  `{activity.data?.kind === 'error' ||`.
- La guarda de la fila pasa de `{activity.data?.kind === 'ok' ? (` a
  `{activity.data !== undefined &&` / `activity.data.kind !== 'unauthorized' ? (`
  (dos líneas, como la deja el formateador). **Ojo, ancla**: en la base ese
  texto sale **dos** veces en `index.tsx`; la de la fila es la línea
  inmediatamente anterior a `<View className="flex-row">` (única en el
  fichero). La otra, más abajo, abre `<WeeklyActivityChart` y **no se toca**.
- Dentro de `<View className="flex-row">`, la celda de peso queda **idéntica**
  y **primera**. Las celdas de `Walk`, `Moon` y `Map` quedan idénticas (props,
  clases, orden; solo cambia la sangría) dentro de
  `{activity.data.kind === 'ok' ? (` `<>` … `</>` `) : (` y la rama sin
  actividad es **una** nota:

```tsx
            {activity.data !== undefined &&
            activity.data.kind !== 'unauthorized' ? (
              <View className="flex-row">
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Weight size={20} color={muted} />
                  {/* summary-weight y su etiqueta: sin cambios */}
                </View>
                {activity.data.kind === 'ok' ? (
                  <>
                    {/* las celdas de Walk, Moon y Map: sin cambios */}
                  </>
                ) : (
                  <Text
                    testID="summary-note"
                    className="flex-3 self-center pl-3 font-normal text-muted"
                  >
                    {activity.data.kind === 'no-tracking'
                      ? t('home.activityNeedsCollar')
                      : t('home.couldNotLoadActivity')}
                  </Text>
                )}
              </View>
            ) : null}
```

  (Los dos comentarios `{/* … */}` del bloque son abreviaturas de esta spec,
  **no** se escriben: ahí va el código de hoy, sin cambios.)
- Nada más cambia en el fichero: ni imports, ni hooks, ni queries, ni el
  skeleton, ni el título, ni ninguna otra sección de la Home. Sin comentarios
  nuevos en producción.

Recuentos del fichero final (medidos): `{activity.data?.kind === 'ok' ? (`
**1** (hoy 2: queda la de `<WeeklyActivityChart`); `testID="summary-note"` **1** (hoy 2);
`<Weight size={20} color={muted} />` **1**; `style={TABULAR_NUMS}` **8**;
`t('home.weight')`, `t('home.activityNeedsCollar')` y
`t('home.couldNotLoadActivity')` **1** cada una. Diff: 51 inserciones y 51
borrados.

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el prefijo `#77 R<n>:`
(`docs/conventions.md` §Prefijo de feature: el fichero ya tiene R-ids de otras
specs). Las tres van **seguidas**, en el nivel superior del fichero
`src/screens/home/index.test.tsx`, **inmediatamente antes de**
`describe('R10: last position enlaza al mapa', () => {` (es decir, justo
después de `describe('R9: summary degrada con gracia'`). Cada una trae su
`beforeEach`; ninguna añade `jest.mock` ni imports (todo lo que usan ya está
importado en el fichero). El código literal está en [[tasks]].

### R1 — El peso se pinta aunque la actividad no esté disponible

**WHEN** la actividad resuelve con `kind` `no-tracking`, `error`,
`unreachable` o `missing-config`,
**THE SYSTEM SHALL** pintar `summary-weight` con
`fmtKg(detail.data?.kind === 'ok' ? detail.data.pet.currentWeightKg : null)`
—`12.4 kg` con peso registrado, `—` con `currentWeightKg: null` y `—` cuando el
detalle no resuelve—, y en ese último caso seguir pintando `summary-note`;
**AND THE SYSTEM SHALL NOT** añadir ninguna petición: con la Home cargada, una
llamada a `listPets`, una a `getPet` y una a `getDailyActivity`, e
`index.tsx` no importa `'../../api/health-records'`.

- **Test**: `describe('#77 R1: el peso se pinta aunque la actividad no esté disponible'`,
  con `beforeEach` propio (auth autenticada, `makePet({ currentWeightKg: 12.4 })`
  en `listPets` y `getPet`), un `it.each` de 4 filas y tres `it`:
  - `it.each` `'%s: pinta el peso registrado'`, filas `sin collar`
    (`no-tracking`), `con la actividad en error` (`error`), `sin conexión`
    (`unreachable`, `message: 'network down'`), `sin configuración`
    (`missing-config`): `summary-weight` con `12.4 kg`. Criterio 1.
  - `it('pinta un guion sin peso registrado')`: `currentWeightKg: null`,
    `no-tracking`; ancla en `collar-card` (necesita el detalle resuelto, así que
    el guion es el del perfil sin peso y no el de la carga) y después
    `summary-weight` con `—`. Criterio 4.
  - `it('pinta un guion y la nota cuando el perfil tampoco resuelve')`: `getPet`
    `unreachable`, `no-tracking`; ancla en `pet-hero-error`; `summary-weight`
    con `—` y `summary-note` con `La actividad requiere un collar`.
  - `it('no añade ninguna llamada a la API')`: `no-tracking`; ancla en
    `12.4 kg`; el fuente no contiene `'../../api/health-records'` y
    `{ pets, detail, activity }` de recuentos de llamadas es
    `{ pets: 1, detail: 1, activity: 1 }`. Criterio 5.
- **Rojo natural** (medido con la producción de `a8d5cb70` y los 7 `it`
  nuevos): **7 rojos / 151**, todos por
  `Unable to find an element with testID: summary-weight` (la celda no existe
  sin actividad). `bunx tsc --noEmit` exit 0 en ese rojo.
- **Mutaciones que deben dejarlo rojo** (medidas sobre el verde completo, con
  el fichero entero de 157; entre paréntesis lo que cae además fuera de #77):

| Id | Mutación en `src/screens/home/index.tsx` | Rojos |
|---|---|---|
| M1 | el valor depende también de la actividad: `activity.data.kind === 'ok' && detail.data?.kind === 'ok'` en el `fmtKg(` | **9**: las 4 filas y `no añade…` de R1, las 4 filas de R2 |
| M2 | no pintar la fila sin actividad cuando el perfil resolvió sin peso (añadir a la guarda `(activity.data.kind === 'ok' \|\| detail.data?.kind !== 'ok' \|\| detail.data.pet.currentWeightKg !== null)`) | **1**: `pinta un guion sin peso registrado` |
| M3 | la guarda espera también al detalle (`&& detail.data?.kind === 'ok'`) | **2**: `pinta un guion y la nota cuando el perfil tampoco resuelve` (+ `#69 R7: degrada el peso a un guion cuando el perfil no resuelve`) |
| M4 | la guarda solo para `ok` y `no-tracking` (`activity.data?.kind === 'ok' \|\| activity.data?.kind === 'no-tracking'`) | **8**: 3 filas de R1 y 3 de R2 (las de `error`, `unreachable`, `missing-config`) (+ R9 `degrades an activity error without breaking the dashboard` y R14 `carga con skeleton y se calla cuando la actividad falla`) |
| M5 | el peso sale de una query nueva (`const weightDetail = useQuery({ queryKey: ['weight', selectedPetId ?? ''], queryFn: () => getPet(…), … })` y el `fmtKg(` lee `weightDetail`) | **7**: `no añade ninguna llamada a la API` (+ R7 `shows an error and retries pet detail`, R10 `refetches the pet list and active pet when Home recovers focus`, `#69 R8: no añade ninguna llamada a la API`, `#71 R1` `no añade ninguna llamada a la API`, `#70 R15` `no añade ninguna llamada a la API`, `#98 R8` `no importa el cliente de nutrición ni añade llamadas`) |

### R2 — Sin actividad, la fila es la celda de peso seguida de la nota

**WHEN** la actividad resuelve con `kind` `no-tracking`, `error`,
`unreachable` o `missing-config`,
**THE SYSTEM SHALL** pintar, dentro de `summary-card`, **una** fila
`className="flex-row"` sin `accessible` ni `accessibilityLabel` con
**exactamente dos** hijos, en este orden:
1. la celda de peso, `className="flex-1 items-center gap-1 border-r border-border"`,
   sin `accessible`, `accessibilityLabel` ni `onPress`, con **exactamente
   tres** hijos en este orden: el icono `Weight` con props exactas
   `{ size: 20, color: <muted> }`, el valor `summary-weight`
   (`text-sm font-bold text-foreground`, `style` `{ fontVariant: ['tabular-nums'] }`)
   y la etiqueta `Peso` (`text-2xs font-normal text-muted`);
2. la nota `summary-note`, `className="flex-3 self-center pl-3 font-normal text-muted"`,
   sin `onPress`, con `La actividad requiere un collar` en `no-tracking` y
   `No se pudo cargar la actividad` en los otros tres;
**AND THE SYSTEM SHALL NOT** pintar `summary-activity`, `summary-sleep` ni
`summary-distance`.

- **Test**: `describe('#77 R2: sin actividad, la fila es la celda de peso seguida de la nota'`,
  con el mismo `beforeEach` que R1 más el espía
  `jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((token) => token)`
  (cada variable resuelve a su nombre: `muted` pasa a ser `'--color-muted'` y
  deja de coincidir con `accent-strong`) y `afterEach(() => { jest.restoreAllMocks(); })`.
  Un `it.each` de 4 filas, `'%s: compone la celda y la nota en una sola fila'`
  (mismas cuatro filas que R1, con el copy de la nota como tercera columna).
  El cuerpo, literal en [[tasks]], parte de `summary-weight` (`value`), sube a
  la celda (`value.parent`) y a la fila (`cell.parent`), filtra los hijos que
  no son `string` y asevera, **por hijos y no por `testID`** (carta, Enmienda
  #70): clase y a11y de la fila, `rowChildren` de longitud 2, `rowChildren[0]`
  `toBe(cell)` y `rowChildren[1].props.testID` `'summary-note'`; clase, a11y y
  `onPress` de la celda, `cellChildren` de longitud 3,
  `cellChildren[0].props` `toEqual({ testID: 'icon-weight', size: 20, color: '--color-muted' })`,
  `cellChildren[1]` `toBe(value)`, clase y `style` del valor, clase y texto de
  la etiqueta; la nota es la de `within(screen.getByTestId('summary-card'))`,
  con su clase, su copy y sin `onPress`; y las tres celdas de actividad,
  `null`. Criterio 2.
- **Rojo natural** (medido sobre el verde de R1, que ya pinta la celda pero
  deja las notas fuera de la fila): **4 rojos / 155**, todos por aserción
  (`toHaveLength`: esperado 2, recibido 1). `bunx tsc --noEmit` exit 0.
- `toBe` entre elementos del árbol: medido, con **un solo fichero** y **sin
  `--json`** el rojo se lee (N2, N15); con `--json` el reporter revienta al
  serializar el árbol (JSON circular). Las sondas se corren así.
- **Mutaciones que deben dejarlo rojo** (medidas sobre el verde completo, fichero
  entero de 157). «Solo sin actividad» = la mutación se condiciona a
  `activity.data.kind !== 'ok'`, así que el estado `ok` no cambia:

| Id | Mutación en `src/screens/home/index.tsx` | Rojos |
|---|---|---|
| N1 | la nota fuera de la fila, en un bloque hermano después de ella | **4** (R2, `toHaveLength`) |
| N2 | la nota **antes** de la celda, dentro de la fila | **4** (R2, `toBe(cell)`) |
| N3 | la fila fuera del `Card` (el `Card` se cierra tras el skeleton) | **5**: 4 de R2 (`within`) (+ `#69 R1` `renders the four value testIDs in tree order`) |
| N4 | fila `flex-row items-center`, solo sin actividad | **4** |
| N5 | fila `accessible`, solo sin actividad | **4** |
| N6 | celda sin `border-r border-border`, solo sin actividad | **4** |
| N7 | nota `flex-1` en vez de `flex-3` | **4** |
| N8 | icono de peso con la tinta `accent` (`accent-strong`), solo sin actividad: `<Weight size={20} color={muted} />` pasa a un ternario sobre `activity.data.kind === 'ok'` con `muted` en la rama `ok` y `accent` en la otra | **4** (solo R2: `#69 R9` sigue en 4 y #126 R1 solo mira `ok`) |
| N9 | icono `Walk` en la celda, solo sin actividad | **5**: 4 de R2 (+ `#69 R9` cuenta 5) |
| N10 | icono `size={activity.data.kind === 'ok' ? 20 : 24}` | **5**: 4 de R2 (+ `#69 R9` cuenta 3) |
| N11 | etiqueta `t('home.activity')`, solo sin actividad | **4** |
| N12 | valor `text-base`, solo sin actividad | **4** |
| N13 | etiqueta `text-xs`, solo sin actividad | **4** |
| N14 | valor sin `style={TABULAR_NUMS}`, solo sin actividad | **4** |
| N15 | etiqueta antes que el valor, solo sin actividad | **4** (R2, `cellChildren[1]` `toBe(value)`) |
| N16 | `onPress` en la celda, solo sin actividad | **4** |
| N17 | `onPress={() => void activity.refetch()}` en la nota | **4** |
| N18 | copys de la nota cruzados (`no-tracking` ↔ error) | **8**: 4 de R2 y `pinta un guion y la nota…` de R1 (+ R9 `explains that activity tracking requires a collar`, R9 `degrades an activity error without breaking the dashboard`, R14 `carga con skeleton y se calla cuando la actividad falla`) |
| N19 | **control de D5**: el mismo ternario de N8, pero con `muted` en las dos ramas (dos literales `Weight` idénticos; ninguna conducta cambia) | **1**: `#69 R9: usa iconos de reicon y ningún emoji` (cuenta 5). Es el candado de fuente, no R2, quien obliga a una sola celda compartida |

### R3 — La fila no se pinta sin sesión ni mientras carga la actividad

**WHILE** `activity.data` es `undefined`,
**THE SYSTEM SHALL** pintar `summary-skeleton` y **SHALL NOT** pintar
`summary-weight` ni `summary-note`;
**AND WHEN** la actividad resuelve con `kind: 'unauthorized'`,
**THE SYSTEM SHALL NOT** pintar `summary-weight` ni `summary-note` (el título
`summary-card-title` sigue visible y el skeleton desaparece).

- **Requisito de verificación** (CHECKPOINTS C4, tercer punto, vía **(b)**): la
  base ya cumple R3 (su guarda es `kind === 'ok'`) y el verde de R1 deja la
  guarda final; ningún orden da un rojo natural. El rojo es la **mutación de
  producción V3 versionada** en el commit rojo y revertida en el verde (C4,
  quinto punto). Nunca se muta un doble.
- **V3** (tres sustituciones en `src/screens/home/index.tsx`, sobre el verde de
  R2):
  1. `{activity.data !== undefined &&` / `activity.data.kind !== 'unauthorized' ? (`
     → `{selectedPetId !== null ? (`;
  2. `{activity.data.kind === 'ok' ? (` → `{activity.data?.kind === 'ok' ? (`;
  3. `{activity.data.kind === 'no-tracking'` → `{activity.data?.kind === 'no-tracking'`.
  Las dos últimas solo existen para que compile (`tsc --noEmit` exit 0, medido):
  sin la guarda, `activity.data` puede ser `undefined` dentro.
- **Test**: `describe('#77 R3: la fila no se pinta sin sesión ni mientras carga la actividad'`,
  con el mismo `beforeEach` que R1 (sin espía) y dos `it`:
  - `it('no pinta la fila con la sesión caducada')`: `const onUnauthorized = jest.fn();`,
    actividad `{ kind: 'unauthorized' }`,
    `await renderWithProviders(<HomeScreen />, { wrapper: HomeWrapper, onUnauthorized });`
    (`renderHome()` no expone `onUnauthorized`); anclas: `collar-card`,
    `onUnauthorized` llamado y `summary-skeleton` fuera; después
    `summary-card-title` visible y `summary-weight` y `summary-note` `null`.
  - `it('no pinta la fila mientras la actividad carga')`:
    `mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());`;
    ancla `collar-card`; `summary-skeleton` visible y `summary-weight` y
    `summary-note` `null`.
- **Rojo** (V3 + los 2 `it`, medido): **2 rojos / 157**, los dos `it` de R3,
  por aserción (`toBeNull`, recibido `summary-weight` con `12.4 kg`).
  `bunx tsc --noEmit` exit 0.
- **Mutaciones que deben dejarlo rojo** (medidas sobre el verde completo):

| Id | Mutación de la guarda | Rojos |
|---|---|---|
| V3a | `{activity.data !== undefined ? (` (sin excluir `unauthorized`) | **1**: `no pinta la fila con la sesión caducada` |
| V3b | `{activity.data?.kind !== 'unauthorized' ? (` (y los dos `?.` de V3) | **1**: `no pinta la fila mientras la actividad carga` (según el reparto de tiempos cae además `#69 R7: degrada el peso…`; se cuenta el rojo garantizado) |

### R4 — Gate humano: smoke en dev build de Android

**WHEN** R1-R3 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida por
el humano en un **dev build de Android** (nunca Expo Go) con una mascota **sin
collar** y **con peso registrado**. **No delegable a IA.** Se firma en su
propia casilla, no en §Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `src/screens/home/index.test.tsx` | **144 → 151** (R1 +7) **→ 155** (R2 +4) **→ 157** (R3 +2). Con #126 ya mergeado: **146 → 153 → 157 → 159** | R1, R2, R3 · rojos |
| `src/screens/home/index.tsx` · `testID="summary-note"` | **2 → 1** (ningún test lo cuenta; lo comprueba [[tasks]] §Cierre) | R2 · verde |
| Suite móvil | **+0 suites, +13 tests**: sobre `a8d5cb70`, `83 / 1530 → 83 / 1543` (medido en el scratchpad con el borrador completo, exit 0; `tsc --noEmit` y `eslint` exit 0). Con #126 ya mergeado: `83 / 1532 → 83 / 1545`. **Enmienda 1**: R5 suma **+0 suites y +0 tests** (mueve una aserción, no añade `it`); el cierre sigue en `83 / 1545` | — |
| **Enmienda 1** · `src/app/(tabs)/__tests__/food.test.tsx` | **56 → 56** (delta 0). `grep -c '#77 R5'` **0 → 1**; `grep -cP '#[0-9]++(?! R[0-9])'` **9 → 9** | R5 · verde |
| **Enmienda 1** · `src/app/(tabs)/food.tsx` | **diff final vacío**: la mutación Q1 entra en el rojo de R5 y sale en su commit de revert | R5 · rojo y revert |
| `specs/mobile-home-stats-strip/requirements.md` · `## Enmienda #77 — el peso se desacopla de la actividad` | bloque nuevo antes de `## Aprobación`, con su casilla (D8) | spec, no código |
| Backend, infra, e2e | **+0** | — |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `describe('R9: summary degrada con gracia'`: sus **siete** `it` (C1) | Métricas de `ok`, guiones, `#69 R7`, las dos notas con su copy, skeletons |
| `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores'`: sus **diez** `it`, incluidos `#69 R9: usa iconos de reicon y ningún emoji` (cuenta **4**, un solo literal `Weight`, D5), `#69 R12: deja que cada celda se anuncie por separado` y `#69 R8: no añade ninguna llamada a la API` | El estado `ok` intacto: cuatro celdas, tres divisores, orden, anuncio por celdas |
| `#126 R1: cada celda de la tira pinta su propio icono en muted` (si #126 ya está en la base; dos `it`, los dos en `ok`) | Hijos e icono por celda en `ok`: el fragmento de D5 se aplana en el árbol host y la fila `ok` es la misma (medido: 159/159). **No necesita enmienda** |
| `describe('R14: la Home monta la actividad semanal sin pedir nada nuevo'` · `it('carga con skeleton y se calla cuando la actividad falla')` | La nota de error sigue diciendo lo mismo |
| Recuentos de llamadas: R7 `shows an error and retries pet detail`, R10 `refetches the pet list and active pet when Home recovers focus`, `#69 R8`, `#71 R1` y `#70 R15` `no añade ninguna llamada a la API`, `#98 R8` `no importa el cliente de nutrición ni añade llamadas` | Cero peticiones nuevas (M5) |
| `src/__tests__/ui-language.test.ts` · `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);` y `src/providers/__tests__/language-provider.test.tsx` · `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2,` | Cero claves nuevas; cada clave de la Home sigue en su fichero (P10) |
| `src/__tests__/consistency-classnames.test.ts` · `describe('#62 R15: todo contador usa cifras tabulares'` (`HOME_TABULAR_AT_9358CC7 = 4` y sus deltas de `#69 R10`, `#69 R14`, `#70 R18`) y `describe('#98 R10: los candados que esta feature no mueve'` | `style={TABULAR_NUMS}` sigue en **8** en `index.tsx` (P11) |
| `src/__tests__/design-drift.test.ts` · `describe('C8: la UI no usa clases arbitrarias'`, `#69 R13`, `#71 R13`, `#70 R17`, `#85 R12`, `#98 R10`, `#108 R2` | Sin hex, sin clases arbitrarias, sin `StyleSheet`; en el test nuevo, `#` seguido de cifras solo como `#<id> R<n>` |
| **Enmienda 1** · los otros **55** `it` de `src/app/(tabs)/__tests__/food.test.tsx` | Ninguno se toca. Verdes con y sin Q1 (medido: 56/56 con Q1 y el test arreglado, 3/3). `consistency-classnames`, `legibility-classnames`, `design-drift`, `ui-language` y `detail-stack` verdes con Q1 puesta (5 suites, 173 tests, exit 0) |

---

## Rebase sobre #126

#126 (`mobile-home-cell-icons-source-lock-unbounded`) toca el **mismo fichero
de test** y vive en paralelo. Hechos (coordinador de la sesión, 2026-09-27):

1. Spec **aprobada**: commit de firma `9152cfe0` (2026-09-27); branch
   `feature/126-mobile-home-cell-icons-source-lock-unbounded`, HEAD de origin
   `a867dfdb` al medir esta spec.
2. Su R1 es un `describe` **anidado**,
   `'#126 R1: cada celda de la tira pinta su propio icono en muted'`, dentro de
   `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores'`,
   después del `it('#69 R9: usa iconos de reicon y ningún emoji'` y antes del
   `it('#69 R12: deja que cada celda se anuncie por separado'`. Dos `it`, los
   dos con actividad `ok` (`'con las métricas de hoy'`, `'sin métricas ni peso'`);
   por celda, `children` `toHaveLength(3)` y `children[0].props`
   `toEqual({ testID, size: 20, color: '--color-muted' })`. **No cubre** los
   estados sin actividad: la tinta del icono de peso en esos estados la cierra
   **#77 R2** (N8).
3. La cuenta de fuente de `#69 R9` sigue en **4**, con un solo literal
   `Weight` (D5).
4. Esta spec **no** cita los blobs de las sondas de #126 R2.
5. Guard de drift: en el test, `#` seguido de un número solo como `#<id> R<n>`,
   y ningún `StyleSheet`.
6. #126 R3 edita `docs/conventions.md` §«Recortes del tag de apertura en
   candados de fuente»; **#77 no toca** `docs/conventions.md`.
7. #99 (ya en la base) no tocó ni la Home ni `docs/conventions.md`.

**Composición medida**: el test de #77 más el `describe` de #126 R1, con la
producción final de #77: **159/159 = 146 + 13**, exit 0; `git merge-file` de
los dos tests sobre la base, **limpio** (0 conflictos: #77 inserta antes de
`describe('R10: last position enlaza al mapa'`, #126 dentro de `#69 R1`). El
diff de producción de #126 es vacío (su R4), y su test solo añade el `describe`
anidado y el comentario de su R3.

**Si #126 mergea primero** (lo esperado): #77 parte de esa base. La Home pasa a
**146** y la suite a **83 / 1532**; los deltas de #77 (+13) no cambian. Codex
mide la base al arrancar ([[tasks]] §Antes de empezar) y suma sobre lo que
haya.

**Si #77 mergea primero**: #126 R1 sigue verde (medido). Las **79 sondas
textuales** de #126 R2 sobre `index.tsx` pierden sus anclas de texto (las
líneas de `Walk`, `Moon` y `Map` quedan con +4 de sangría y dentro del
fragmento), y la cláusula de blob de #126 R4 caduca por su propia redacción
(«Mientras la base siga siendo `d7cb0d60`»); la cláusula de diff vacío se
mantiene. Lo coordina el leader.

**Después de cualquier rebase**, el leader verifica
`git merge-base --is-ancestor` de los hashes de [[traceability]], los recuentos
de §Candados y #126 R1 en verde. **No rebasear** después de que Codex rellene
[[traceability]] sin reapuntar sus hashes.

---

## Prueba de humo del humano (no delegable a IA) — R4

**Entorno:**

- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo (cero
  cambios nativos): basta el JS de esta branch desde Metro.
- Backend accesible desde el teléfono (el de siempre; esta feature no lo
  cambia).
- No hace falta estado limpio: el smoke crea su propia mascota. Si se quiere
  empezar de cero: **Ajustes → Aplicaciones → <la app> → Almacenamiento →
  Borrar datos**, o desinstalar y reinstalar. **Nunca `adb shell pm clear`**
  (ColorOS lo deniega).
- `adb` solo para las capturas; con dos transportes Wi-Fi, siempre
  `adb -s <ip:puerto>`.

**Pasos:**

1. Iniciar sesión. **Perfil → Añadir mascota → «Nueva mascota»**: nombre y
   especie, **«Guardar mascota»**. La mascota nueva queda seleccionada y **no
   tiene collar**.
2. **Inicio**. En «Resumen de hoy»: a la izquierda la celda con el icono de
   peso, **`—`** y «Peso»; a su derecha, tras el divisor vertical, **«La
   actividad requiere un collar»**, centrada en vertical respecto a la celda
   (criterio 4). No salen las celdas de Actividad, Descanso ni Distancia.
3. **Inicio → acceso rápido «Peso» → «Registro de peso»**: «Peso (kg)» `7.5`,
   fecha de hoy (la que propone), **«Registrar peso»**. Volver a **Inicio**.
4. La celda pinta **`7.5 kg`** sin reiniciar la app (criterio 1). Comprobar
   (criterio 2): la celda ocupa **un cuarto** del ancho de la tarjeta; hay
   **un solo** divisor, entre la celda y la nota; ningún borde suelto a la
   derecha de la nota ni debajo; la nota no se corta. Captura:
   `adb -s <ip:puerto> shell screencap -p /sdcard/home77.png` y
   `adb -s <ip:puerto> pull /sdcard/home77.png`.
5. Si hay una mascota **con** collar, cambiar a ella: la tira de cuatro celdas
   de #69 sin cambios, y la celda de peso en el **mismo sitio y con el mismo
   ancho** que en el paso 4. Volver a la mascota del paso 1.
6. Cambiar el tema (Perfil) a **oscuro** y repetir la mirada del paso 4: el
   divisor se ve y el texto se lee; volver a **claro**.
7. Con **TalkBack**: la celda se anuncia («7.5 kg», «Peso») y la nota se
   anuncia aparte.

- [ ] Prueba de humo de R4 superada por el humano (fecha: ____, dispositivo: ____, Android: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #77

| Criterio | Cubierto por |
|---|---|
| 1. La celda de peso se pinta con peso registrado aunque la actividad no esté disponible (sin collar, error, unreachable, missing-config) | R1 `it.each` (4 filas, `12.4 kg`), R2 (las mismas 4 filas), M1, M4; R4 pasos 3-4 |
| 2. La fila se compone bien con una sola celda: sin bordes sueltos ni celdas de ancho raro | R2 (dos hijos, clases exactas de fila, celda y nota; N1-N7, N15-N17), D1 (`flex-1` + `flex-3` = el mismo cuarto que en `ok`; el divisor es el `border-r` de la celda); R4 pasos 4-6 |
| 3. Los `it` de `describe('R9: summary degrada con gracia')` verdes sin debilitar ningún assert, más los del estado nuevo | Son **siete**, no cinco (C1): §Candados «Siguen verdes», sin tocarlos; los del estado nuevo, R1-R3 (13 tests) |
| 4. Sin peso registrado la celda pinta `—`, no desaparece | R1 `pinta un guion sin peso registrado` (M2) y `pinta un guion y la nota cuando el perfil tampoco resuelve` (M3); R4 paso 2 |
| 5. Cero llamadas nuevas a la API | R1 `no añade ninguna llamada a la API` y los seis recuentos de §Candados (M5) |
| 6. Suite móvil verde; ninguna cifra de candado se mueve sin declararlo como delta | §Candados (solo se mueve el recuento del fichero de la Home), [[tasks]] §Cierre (comandos sin pipe). **Enmienda 1**: R5 cierra la carrera de `food.test.tsx` que la tumbaba de forma intermitente, con delta 0 |
| 7. Gate humano: smoke en dev build de Android con una mascota sin collar y con peso | R4 |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **iOS.** El código no distingue plataforma, pero no hay build ni smoke de
  iOS: es #60 (`mobile-ios-support`, `pending`).
- **Backend.** No cambia: el peso ya viene en el detalle (`currentWeightKg`,
  P2) y su escritura ya lo actualiza (P6).
- **Un estado de carga propio para el peso.** C2 y D3: mientras el detalle
  carga, `—`, igual que en `ok`.
- **Pintar la fila con la sesión caducada o mientras carga la actividad.** D2 y
  R3.
- **Hacer pulsable la nota** (reintentar, llevar al emparejamiento). Hoy no lo
  es, y N17 lo fija; la tarjeta del collar ya enlaza a `/pairing`.
- **Cambiar el copy de las notas o añadir claves.** D4.
- **Cambiar el estado `ok`.** #69 R1 y #126 R1 siguen como están.
- **Fecha de la última pesada o tendencia en la celda.** No lo pide el encargo.
- **Componente compartido para la celda.** Un solo usuario (la Home); la regla
  de extracción de la carta pide ≥ 2 pantallas.
- **Cambios en `docs/ui-guidelines.md`, `docs/conventions.md` (lo edita
  #126 R3), `global.css`, `src/i18n/catalog.ts`, `src/screens/home/format.ts`,
  `src/api/activity.ts`, `package.json` o `bun.lock`.**
- **Enmienda 1 · Cerrar la carrera en producción.** `src/app/(tabs)/food.tsx`
  es correcto: pide el plan en cuanto hay mascota. El defecto es la espera del
  test. Diff final de `food.tsx` vacío (R5).
- **Enmienda 1 · Un helper de espera, `asyncUtilTimeout`, `testTimeout` o un
  `waitFor` con más `timeout`.** Alargar la espera no cierra la ventana, la
  esconde. R5 cambia qué se espera, no cuánto.
- **Enmienda 1 · `docs/conventions.md`.** §«Esperas sobre el árbol
  renderizado» ya exige que la espera y las aserciones miren la misma
  observación; R5 la aplica, no la cambia.
- **Enmienda 1 · Los otros sitios de `food.test.tsx`.** Clasificados uno a uno
  en §Enmienda 1 › Inventario: ninguno es carrera hoy y ninguno se toca.

**Deuda o limitación conocida que esta feature no ejecuta:**

- **Un mismo `—` para tres causas**: sin peso, detalle cargando y detalle en
  error. Es la conducta de `ok` desde #69 R7 y aquí se hereda; en el caso de
  error el hero ya pinta `pet-hero-error` con su reintento.
- **`flex-3` y `pl-3` son clases nuevas en `src`** (P9). Los tests fijan el
  `className`, no el estilo compilado; que Uniwind las pinta como se espera lo
  confirma el smoke (R4 pasos 4-6).
- **Con letra del sistema muy grande** la nota puede partirse en dos o tres
  líneas; `self-center` la mantiene centrada respecto a la celda. No se fija
  número de líneas.

**Enmienda 1 · Seguros hoy, con un límite conocido (no se tocan):**

- **`#98 R5` (`sirve…`, `deshace…`) y `#98 R6`
  (`muestra el aviso ante un fallo y lo borra en el reintento con éxito`).**
  Tras `waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2))`
  aseveran `refetchQueries` y su `invocationCallOrder`, o pulsan otra vez.
  Seguros porque, con los mocks resueltos, el resto de `toggleMeal` tras
  `await plan.refetch();` corre **solo en microtareas**: traza W2 del informe,
  `queryFn → before-refetchQueries → before-haptics → finally-setPending-null`
  antes de un `setTimeout(0)` y un `setImmediate` encolados en el `queryFn`.
  **Límite**: una macrotarea entre `await plan.refetch();` y
  `await queryClient.refetchQueries({` los tumba (mutación Q5, 100 ms: 3 rojos,
  los dos de `#98 R5` y ese de `#98 R6`, 3/3).
- **`#113 R2` (`con merKcal $merKcal y kcalConsumedToday $kcal pinta $consumed y $percent`),
  `#113 R4` (`anima a 50, sube a 100 al servir…`) y `#113 R7`
  (`… el relleno solo lleva width $width`).** Esperan un texto del plan y
  después leen el ancho de la barra, que fija un `useEffect`
  (`kcalBarWidth.set(withTiming(kcalPct, KCAL_BAR_TIMING));`). Seguros porque
  los datos del plan llegan por el `useSyncExternalStore` de TanStack, que
  hace un commit **síncrono** y React vacía sus efectos pasivos en el mismo
  paso: traza W1 del informe, `layout-kcal → passive-kcal → micro-kcal`, sin
  frontera de tarea. **Límite**: si esos datos llegasen por una actualización
  no síncrona, la ventana se abriría como en R5; una macrotarea en ese efecto
  (mutación Q6, 200 ms) pone **7** en rojo con `Received {"width":"0%"}` (las
  filas que esperan 0% pasan).

**Enmienda 1 · [H] Hallazgos no medidos (no se afirma que sean flakes, no se
registran como feature desde aquí):**

- **[H] El mismo patrón en otras pantallas.** Espera a un chip seleccionado y
  asevera **fuera** la llamada de una query con
  `enabled: selectedPetId !== null`:
  `src/screens/home/index.test.tsx` › `keeps API order and selects the first pet by default`
  (`mockGetPet` y `mockGetDailyActivity` con `'pet-1'`) y
  `src/screens/reminders/index.test.tsx` ›
  `uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)`
  (`mockListReminders` con `'pet-1'`). Ninguno se midió. El de la Home vive en
  el fichero que R1-R3 editan y se deja fuera a propósito para no mezclar
  cambios en el guion de Codex. `health` ya está bien (#111 S2, `bcd8ba8a`).
  Si el leader los quiere cerrados, es una feature propia con su medición.
- **[H] La premisa de `specs/mobile-flaky-waits/requirements.md` §«Enmienda E1».**
  Se corrige en §Enmienda 1 › El mecanismo. Esta spec **no** edita #111.

---

## Enmienda 1 — R5: la carrera del plan de nutrición en food

> Abierta el 2026-09-28, a pregunta del humano: «¿podemos resolver el flake
> food.test.tsx en esta feature?». Enmienda a una spec ya firmada: **necesita
> su propia firma** (§Firma de la Enmienda 1). Sin esa casilla, R5 no existe y
> Codex sigue con la «Reanudacion 1» del handoff tal cual.
>
> Todo lo de esta sección se **midió** en una copia de `mobile-pet-tracker/`
> en el scratchpad del spec_author (sin pipe, sin `init.sh`, sin e2e), sobre
> `c06aa893`. Los blobs de `src/app/(tabs)/food.tsx` (`e310ff45`) y
> `src/app/(tabs)/__tests__/food.test.tsx` (`abc6ad15`) son los mismos en
> `e9413a6e` (= `origin/main`, base de la implementación de Codex).
> Comandos y logs: `progress/spec_amend_77_food.md`.
>
> Nombres propios de esta enmienda: las mutaciones son **Q1-Q6** (no las
> M1-M5 de §R1) y las trazas son **W1** y **W2** (no las decisiones D1-D9
> de [[design]]).

### Qué falla

La base de Codex cayó en la suite completa por un rojo ajeno a la Home
(`progress/handoff_mobile-home-weight-without-collar.md` §«Reanudacion 1»):
`src/app/(tabs)/__tests__/food.test.tsx` ›
`R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default`,
en `expect(mockGetNutritionPlan).toHaveBeenCalledWith(`, con
`Number of calls: 0` (`1 failed, 1531 passed, 1532 total`). Solo, el fichero
pasa 10/10.

El test espera en un `waitFor` el orden de los chips y `pet-chip-pet-1` con
`accessibilityState` `{ selected: true }`, y **después, fuera de la espera**,
asevera `mockGetNutritionPlan` con `(apiUrl, 'jwt-token', 'pet-1')`. Es el
defecto que describe `docs/conventions.md` §«Esperas sobre el árbol
renderizado»: la observación que termina la espera puede ser cierta mientras
la aserción posterior es falsa (criterio §F4 de #111).

### El mecanismo (medido)

1. `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });`
   selecciona la primera mascota desde un `useEffect`. Ese `setState` va en
   una lane por defecto, **no** síncrona.
2. El commit de ese render pinta el chip seleccionado. Sus efectos pasivos
   **no** se vacían en el mismo paso, y entre ellos está el de `useQuery`, que
   ve `enabled: selectedPetId !== null` y lanza el `queryFn`. React agenda
   esos efectos como una tarea aparte del Scheduler, que cede cada 5 ms con
   `setImmediate`.
3. El `waitFor` de RNTL comprueba cada 50 ms. Si esa comprobación cae entre el
   commit y la tarea de los efectos, ve el chip seleccionado y sale. La
   aserción de fuera encuentra entonces el mock sin llamar. Con la máquina
   cargada, la ventana se abre.

Traza con instrumentación (`console.log` en un `useLayoutEffect`, en un
`queueMicrotask` y en el `queryFn`; variante fuera del repo). En el commit
del chip sale `layout-pet:pet-1 → micro-pet:pet-1 → queryFn:pet-1`: entre el
pintado y la llamada hay una frontera de tarea. A veces sale
`layout → queryFn → micro`, cuando el Scheduler no cede; por eso el flake es
intermitente.

**Corrección de premisa (#111, Enmienda E1).** El sitio gemelo de `health`
(`keeps API order and selects the first pet by default`) ya se clasificó en
`specs/mobile-flaky-waits/requirements.md` §«Enmienda E1 — S2 no es defecto,
y su vía de C4 no era obtenible». E1 lo metió en la tercera categoría de §F4,
«causalmente implicado», y dio por hecho que no había ventana. **La ventana
existe.** §F4 exime «un contador de mock cuyo efecto es justo el render que
se esperó»: en ese caso la llamada **causa** el render. Aquí el orden es el
inverso: el render **causa** la llamada, y la llamada llega una tarea
después. E1 no vio la ventana porque sus vigas retrasaban la **respuesta** de
un mock (`mockListPets`), y esa respuesta llega antes del render esperado. La
viga que abre la ventana retrasa la **llamada**, entre el commit y el mock
(Q1). El código de `health` ya está bien: #111 S2 (`bcd8ba8a`) dejó las
aserciones dentro del `waitFor`. Esta enmienda **no** toca #111. Solo deja
escrito que la premisa de E1 era falsa, para que nadie construya sobre ella.

### R5 — La espera del test de orden termina con la llamada al plan

**WHILE** la llamada a `getNutritionPlan` llegue hasta 200 ms después del
commit que selecciona `pet-chip-pet-1` (mutación Q1),
**THE SYSTEM SHALL** hacer pasar de forma determinista
`R4: food resuelve la mascota seleccionada` › `keeps API order and selects the first pet by default`,
cuyo `waitFor` termina **solo** cuando se cumplen a la vez tres cosas: los
chips están en orden, `pet-chip-pet-1` está seleccionado y
`mockGetNutritionPlan` se ha llamado con `(apiUrl, 'jwt-token', 'pet-1')`;
**AND THE SYSTEM SHALL NOT**:

- aseverar menos que hoy: el mismo orden `['pet-chip-pet-1', 'pet-chip-pet-2']`,
  la misma selección, `mockListPets` con `(apiUrl, 'jwt-token')` y
  `mockGetNutritionPlan` con **los mismos tres** argumentos;
- dejar diff final en `src/app/(tabs)/food.tsx`;
- añadir un helper;
- tocar `asyncUtilTimeout`, `testTimeout` ni el `beforeEach` de `R4`.

Cómo se cumple:

- **Test**: el mismo `it`, sin renombrar. Dentro del `waitFor`, tras la
  aserción de `accessibilityState`, entran dos cosas:
  - el comentario
    `// #77 R5: the plan is requested after the commit that selects the chip.`,
    que nombra el R-id (C4, primer punto);
  - la aserción de `mockGetNutritionPlan`, que sale de fuera.

  `mockListPets` se queda fuera porque está implicada: su respuesta es lo que
  pinta los chips. El diff literal (6 inserciones, 5 borrados) está en
  [[tasks]] §R5.
- **Rojo** (C4 vía **(b)**, [[design]] D9): sin tocar producción, la carrera
  no se reproduce a voluntad. El rojo es la **mutación Q1 versionada**: el
  `queryFn` del plan retrasa 200 ms la llamada a `getNutritionPlan` y cancela
  el temporizador si TanStack aborta la query. Su firma es **idéntica** a la
  del flake: el mismo `it`, la misma línea y `Number of calls: 0`.

#### Mediciones

Fichero entero = `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'`.
Filtrado = el mismo comando con
`-t 'keeps API order and selects the first pet by default'`. «Arreglado» es
el test con el diff de [[tasks]] §R5.

| Id | `food.tsx` | Test | Corrida | Resultado |
|---|---|---|---|---|
| B | base | base | fichero entero | 56/56, exit 0 |
| R | Q1 | base | filtrado ×10 | **10/10 exit 1**: `1 failed, 55 skipped`, `Number of calls: 0` en `expect(mockGetNutritionPlan).toHaveBeenCalledWith(` |
| R′ | Q1 | base | fichero entero ×3 | **3/3 exit 1**: `1 failed, 55 passed`; solo ese `it`, con la misma firma |
| V | Q1 | arreglado | filtrado ×10 | **10/10 exit 0** |
| V′ | Q1 | arreglado | fichero entero ×3 | **3/3 exit 0**, 56/56 |
| F | base | arreglado | fichero entero ×3 | **3/3 exit 0**, 56/56 |
| T1 | Q2: `enabled: false` en la query del plan | arreglado | filtrado ×3 | **3/3 exit 1**, `Number of calls: 0`: la espera no se traga una llamada que falta |
| T2 | Q3: `'pet-2'` en vez de `selectedPetId!` en el `queryFn` | arreglado | filtrado ×3 | **3/3 exit 1**, `Received` con `"pet-2"`, `Number of calls: 1`: los argumentos siguen vigilados |
| T3 | Q4: Q1 con `'pet-2'` | arreglado | filtrado ×3 | **3/3 exit 1**, igual que T2 |
| S | Q1 | base y arreglado | `bunx tsc --noEmit` con cada test; `bunx expo lint` | exit 0 las tres veces (es el `tsc` del rojo y del verde de R5) |
| K | Q1 | — | `consistency-classnames`, `legibility-classnames`, `design-drift`, `ui-language`, `detail-stack` | 5 suites, 173/173, exit 0 |
| G | base | arreglado | suite completa ×1, `bunx tsc --noEmit`, `bunx expo lint` | **exit 0, 83 / 1532**; exit 0; exit 0 |

La primera versión de la mutación no escuchaba el `abort` y dejaba un
temporizador vivo tras desmontar. Ese temporizador ponía `#98 R6` en rojo de
rebote. Q1 lo cancela, así que el único rojo es el de R5 ([[design]] D9).

#### Inventario de `food.test.tsx`

Cada espera seguida de una aserción, clasificada:

| `describe` › `it` | Espera | Aserción posterior | Clase |
|---|---|---|---|
| `R4` › `shows and retries a $kind pet-list error` (3 filas) | `food-empty` tras el reintento | `mockListPets` ×2 | Segura: implicada (la segunda respuesta pinta `food-empty`) |
| `R4` › `keeps API order and selects the first pet by default` | chips en orden, `pet-1` seleccionado | `mockListPets` con `(apiUrl, 'jwt-token')` | Segura: implicada (su respuesta pinta los chips) |
| ídem | ídem | `mockGetNutritionPlan` con `'pet-1'` | **Carrera real: R5** (medidas R y R′) |
| `R4` › `selects a pressed pet and reloads its nutrition plan` | — | ya dentro de su `waitFor` | Segura: es la forma que R5 copia |
| `R5` › `renders kcal, grams, ordered meals, portions, and local-time badges` | `food-plan-card` | `mockRouter.push` tras la pulsación | Segura: síncrona en el `onPress` |
| `R5` › `shows and retries a $kind plan error` (2 filas) | `food-plan-card` tras el reintento | `mockGetNutritionPlan` ×2 | Segura: implicada |
| `#98 R5` › `sirve…` / `deshace…` | `mockGetNutritionPlan` ×2 | `mockServeMeal` / `mockUnserveMeal` | Segura: implicada (se llaman antes del refetch) |
| ídem | ídem | `refetchQueries` y `invocationCallOrder` | Segura **hoy**: solo microtareas (traza W2). Límite: Q5 (§Fuera de alcance) |
| `#98 R5` › `ignora la segunda pulsación mientras la primera está en vuelo` | `meal-toggle-0` | `mockServeMeal` ×1 | Segura: síncrona |
| `#98 R6` › `no muestra error cuando el servidor ya estaba en el estado pedido` | `mockGetNutritionPlan` ×2 | ausencia del error | Fuera del patrón: el error se fijaría antes de la llamada |
| `#98 R6` › `muestra el aviso ante un fallo y lo borra en el reintento con éxito` | `mockGetNutritionPlan` ×2 | pulsa otra vez | Segura **hoy** por la traza W2. Límite: Q5 |
| `#106 R4` (los 4 `it` que vibran) | `mockNotificationAsync` ×1 | `toHaveBeenCalledWith` de esa llamada | Segura: misma observación |
| `#106 R4` › `no vibra al montar o refrescar sin una pulsación` | `meal-toggle-0` | ausencia | Fuera del patrón: ausencia anclada |
| `#113 R2` (`it.each` `con merKcal …`), `#113 R4` (`anima a 50…`), `#113 R7` (`it.each` `… el relleno solo lleva width …`) | texto del plan | ancho de la barra y `mockWithTiming` | Segura **hoy**: commit síncrono de `useSyncExternalStore` (traza W1). Límite: Q6 (§Fuera de alcance) |
| `R10` › `does not replace a new selection while the stale pet list refreshes` | chips | `selectPet` `.not` | Fuera del patrón: ausencias ancladas |
| `#87 R12` › `deja mascotas y plan en sus claves canónicas` | `food-plan-card` | `getQueryData` | Segura: implicada |

**El único sitio defectuoso es R5.** Los «seguros hoy» se quedan como están:
su límite está escrito en §Fuera de alcance y no pasa a ser trabajo de esta
feature.

#### Qué firma el humano con esta enmienda

| Id | Decisión | En una línea |
|---|---|---|
| **R5** | Un segundo fichero de test en #77 | La aserción de `mockGetNutritionPlan` entra en el `waitFor` del test de orden; no se debilita nada y la producción de food queda igual |
| **D9** | Rojo por mutación versionada, con commit de revert propio | Q1 entra en el rojo y **sigue puesta** durante el verde, porque el verde es un cambio de test y hay que probarlo contra ella. Sale en un tercer commit. C4 dice «se revierte en el verde»; aquí el verde es el test, así que el revert va aparte. El diff final de `food.tsx` es vacío. Ver [[design]] D9 |
| **Traza** | Un segundo commit sobre [[traceability]] | [[traceability]] pide **un solo** commit, `docs(mobile): fill #77 traceability`. R5 añade otro, `docs(mobile): trace #77 R5`, que va **siempre el último** y solo añade la fila de R5 (fila literal en [[tasks]] §R5). El `reviewer` no aprueba con esa fila en «pendiente» |

### Firma de la Enmienda 1

- [x] **Enmienda 1 (R5) aprobada por humano** (fecha: 2026-09-28). Casilla propia.
      Sin ella, R5 no existe: `food.test.tsx` y `food.tsx` no se tocan y
      sigue valiendo el punto 3 de la «Reanudacion 1».

---

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-09-27)

Al aprobar, el humano firma además, **en su casilla propia**, la enmienda a
#69 R7 (`specs/mobile-home-stats-strip/requirements.md`
§`## Enmienda #77 — el peso se desacopla de la actividad`).

La **Enmienda 1 (R5)** no se firma aquí: tiene su casilla propia en
§Enmienda 1 › Firma de la Enmienda 1. La casilla de arriba no la cubre.
