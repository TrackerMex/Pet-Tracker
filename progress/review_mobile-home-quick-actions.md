# review: mobile-home-quick-actions (#71)

Fecha: 2026-09-08 22:38 UTC
Branch: `feature/71-mobile-home-quick-actions` — HEAD `a2f2686`
Base de deltas: `f9163bf` — Implementador: Codex CLI
Veredicto: **RECHAZADO**

Un solo motivo bloqueante (O1). La producción es correcta y el gate está verde:
lo que falta es un candado, no un arreglo de la app. El parche que lo cierra es
**una línea de test** y está verificado más abajo. O2 debería entrar en la misma
corrección. O3-O6 son declaraciones, no arreglos.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `#71 mobile-home-quick-actions`, verificado
      sobre `feature_list.json`
- [x] `progress/current.md` describe la sesión activa y está al día con el estado
      real de la branch
- [x] Toda feature `done` conserva sus tests: la suite móvil pasa 68/68 suites y
      1054/1054 tests **sin regresión** frente a la base

## Checklist C3 — Arquitectura

- [x] Solo capa de presentación de `mobile-pet-tracker/`. Cero domain, cero
      application, cero infrastructure, cero backend
- [x] `domain` sin imports de `infrastructure` — no aplica: ningún fichero de
      esas capas entra en el diff
- [x] `application` depende de interfaces — no aplica por lo mismo
- [x] Cero ficheros en `backend-pet-tracker/`, `infra/` y `hosting/`, verificado
      con `git diff --name-only f9163bf..HEAD`

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene test que lo nombra: `describe('#71 R1: …')` en
      `src/screens/home/index.test.tsx` cubre R1-R7, R9, R10, R12;
      `#71 R13` en `design-drift.test.ts`; `#71 R11` en `ui-language.test.ts`;
      R8 y R14 por sus candados heredados con el delta declarado
- [x] Historial test-primero, no todo junto: 78 commits, un par rojo→verde por
      requisito, con el `traceability.md` actualizado en su propio commit
- [x] **Quinto punto de C4 (nuevo el 2026-09-08), cumplido y superado.** Verifiqué
      fichero a fichero qué cambia cada commit rojo. Los **siete** rojos de R15b
      (`7ed1283`, `d94f57d`, `d7460dd`, `acb5368`, `9c2605f`, `15ab56c`,
      `0c2d790`) tocan **solo** `src/screens/home/index.tsx`: cero mocks.
      Y el patrón no se limita a R15b — los rojos de R2, R3, R4, R5, R6, R7, R8,
      R9, R10, R12 y R13 **también** versionan una mutación de producción que el
      verde revierte (ej. `20355a6` pone `href: () => '/trips'`; `d89b5fd` pone
      `accessible` en la fila; `9ea0a17` mete `backgroundColor: '#fff'`).
      Es exactamente lo que #69 no hizo
- [x] Ningún rojo falla por `ReferenceError` de un helper ausente
- [x] `17c8c01` (R14) es un commit **vacío** y está declarado como tal: el rojo
      del catálogo era natural —las cuatro claves entraron en el verde de R1 y
      dejaron `language-provider.test.tsx:41` rojo hasta `bf18ed2`—. No se
      fabricó: verifiqué que ese fichero no se toca hasta el verde

### Las siete mutaciones, replantadas por mí (no leí su tabla)

Plantadas de una en una sobre el árbol limpio, con el fichero restaurado entre
cada una. Suites del filtro: `home/index.test.tsx`, `consistency-classnames`,
`ui-language`, `design-drift`, `language-provider`, `legibility-classnames`
(198 tests).

| # | Mutación replantada | Resultado | Coincide con el informe |
|---|---|---|---|
| M1 | tile 1 `/weight-log` → `/add-reminder` | **rojo**, 2 fallos: R4 y `lleva cada tile a su ruta existente` | sí |
| M2 | `Icon` de tiles 2↔3 | **rojo**, 2 fallos: R4 y `usa iconos de reicon…` | sí |
| M3 | `labelKey` de tiles 2↔3 | **rojo**, 1 fallo: R4 (R11 sigue verde, ambas claves conservan uso) | sí |
| M4 | tile 1 `slot: 'violet'` → `'amber'` | **rojo**, 1 fallo: R4 (el candado de forma R5 sigue verde) | sí |
| M5 | cuarto tile `Map`/`tabs.map`/`green`/`/map` | **rojo**, **3 fallos**: R1, `no apunta a ninguna ruta inexistente` y R3 | **no: el informe dice "exactamente 2"** (O5) |
| M6 | rejilla detrás de `weekly-activity-card` | **rojo**, 1 fallo: R10; los dos órdenes heredados (#68, #69) verdes | sí |
| M7 | sin `min-h-11` | **rojo**, 1 fallo: R6 | sí |

**Las cuatro decisiones de cada tile mueren por separado** (M1-M4). La lección
de #69 está aplicada de verdad, no declarada.

### La quinta dimensión: la busqué y la encontré

| # | Sonda extra | Resultado |
|---|---|---|
| M8 | `quickActionInks[index]` → `quickActionInks[0]` (tinta desligada del hueco) | **VERDE en la suite móvil completa: 68/68, 1054/1054** → O2 |
| M9b | cuarto tile inline en la fila (`quick-action-extra` → `/pairing`), fuera de `QUICK_ACTIONS` | **VERDE en la suite móvil completa: 68/68, 1054/1054** → **O1, bloqueante** |
| M10 | clase completa `bg-category-violet` escrita en la Home | **rojo**: `#64 R9` + los dos `it` de #71 → candado vivo |
| M12 | `accessible` + `accessibilityLabel` en la fila de tiles | **rojo**: R9 → candado vivo |

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente": las 16 filas (R1-R15b)
      llevan hash de rojo y de verde
- [x] Cada requisito tiene test y commit registrados; los hashes existen y su
      contenido es el que la tabla dice
- [x] Formato de commit `feat(mobile-home-quick-actions): <desc> (R…)` respetado
      en los 76 commits propios

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla `[X] Aprobado por humano (fecha: 2026-09-08)` marcada
- [x] Ningún requisito modificado después de la aprobación: `git log` sobre
      `specs/mobile-home-quick-actions/` no muestra ningún commit posterior a
      `aa88a44` salvo el relleno de la columna Commit de `traceability.md`
- [x] Las tres premisas de la spec que no describen literalmente el árbol están
      declaradas en el informe §"Premisas contrastadas" en vez de enmendar una
      spec aprobada — que es el procedimiento correcto. Falta una cuarta (O3)

## Checklist C7 — Sin código huérfano

- [ ] N/A — esta feature **no reemplaza nada**. Añade un hermano a `home-content`
      y no toca la tira de #69, la gráfica de #68 ni el hero de #67. Ningún
      fichero borrado en todo el diff; ningún `testID` de producción renombrado
      (el renombrado de `reicon` es del doble de test, y verifiqué que no queda
      ni una ocurrencia de `summary-icon-*` en `src/`)

## Checklist C8 — Carta de UI móvil

- [x] Grep-clean: cero hex en los tres ficheros de la feature, cero
      `StyleSheet`, cero shadow/elevation, cero clases arbitrarias `[...]`
- [x] Radios en la escala de #62: `index.tsx` solo usa `rounded-card`,
      `rounded-xl` y `rounded-full`. `rounded-2xl` del Make no aparece
- [x] Tokens: cero cambios en `src/theme/global.css`; los fondos entran por
      `CATEGORY_SLOTS[slot].surface` y la tinta por
      `useThemeColors(['category-${slot}-strong'])`
- [x] Componentes compartidos: no se forkea nada; la sección es `View` + rótulo
      con la receta canónica, sin `Card`, como fija D6
- [x] Táctil ≥44pt: `min-h-11` + `flex-1` en los tres, sin `hitSlop` (M7 lo
      vigila)
- [x] Sin animaciones nuevas (D13)
- [x] Estados de carga: no aplica. La sección es navegación pura y por diseño no
      tiene skeleton ni error (R10)

### Contraste, recalculado por mí sobre los tokens que usa el código

No copié la tabla de `design.md` §4: extraje los hex de `global.css` y recalculé
la luminancia WCAG. Coincide a dos decimales.

| Par | Claro | Oscuro | AA |
|---|---|---|---|
| `category-violet-strong` sobre `category-violet` | 4,72 | 4,81 | sí / sí |
| `category-amber-strong` sobre `category-amber` | 4,70 | 4,78 | sí / sí |
| `category-blue-strong` sobre `category-blue` | 4,75 | 4,81 | sí / sí |
| `foreground` sobre las tres superficies | 17,25-17,82 | 15,41-15,42 | sí / sí |
| superficie contra fondo de pantalla | 1,06-1,10 | 1,16 | n/a — al gate humano |

Accesibilidad: tres `accessibilityRole="button"`, sin `accessible` ni
`accessibilityLabel` en la sección ni en la fila. M12 confirma que el candado
está vivo.

### `within(tile)` y el renombrado del doble

- [x] Ningún test nuevo usa `getByTestId` global donde debe acotar: las cuatro
      dimensiones de R4 y el tamaño de icono de R7 se leen con `within(tile)`.
      Confirmado por grep: no hay ni una búsqueda de `icon-*` fuera de `within()`
- [x] El renombrado a nombres por icono no debilitó #69: su `it` sigue usando
      `within(value.parent!)` y pasa con el segundo `Weight` en el árbol
- [x] Cero restos de `summary-icon-*` en `src/`

### Deltas de R14, las catorce filas

Rehice el diff línea a línea en vez de leer el informe.

- Fila 1 — `language-provider.test.tsx:41`: `260 + 16 + 1` → `260 + 16 + 1 + 4`.
  **Base histórica visible como suma, no colapsada a `281` plano**, y el
  `toEqual` entre idiomas intacto. Es el candado que paró #68 y #69, y esta vez
  la spec sí lo enumeraba. **Comprobé que sigue pudiendo fallar**: añadí una
  quinta clave al catálogo y el candado se puso rojo (`Expected 281, Received
  282`, en la línea 41). Restaurado
- Fila 2 — `R3_HOME`: `21 + 15 + 1` → `21 + 15 + 1 + 4`, con las cuatro filas en
  `ui-copy-table.ts`. Misma forma de suma
- Fila 3 — `#62 R14`: fila `screens/home/index.tsx` `1 → 2` y total cerrado
  `33 + 1` → `33 + 1 + 1`. El `+1` es correcto: hay un solo
  `style={CONTINUOUS_CORNER}` dentro del `.map()`
- Fila 4 — `+1 describe` en `design-drift.test.ts`
- Filas 5-14 ("sin cambio") — verificadas por ausencia: el diff completo de
  `consistency-classnames.test.ts` son **dos** líneas (ambas de la fila 3) y el
  de `ui-language.test.ts` **una** (la fila 2). Ninguna otra cifra se movió, ni
  se tocó `legibility-classnames.test.ts`. La fila 6 (`#64 R9` con
  `['utils/category-palette.ts']`) sigue en su valor y M10 prueba que muerde

### Deriva de alcance

- [x] Cero `backend-pet-tracker/`, cero `infra/`, cero `hosting/`
- [x] Cero dependencias: `package.json` y `bun.lock` fuera del diff
- [x] Cero tokens nuevos: `src/theme/global.css` fuera del diff
- [x] **Cero cambios en `src/components/floating-tab-bar.tsx` y en
      `src/app/(tabs)/_layout.tsx`** (R12), y cero en `src/app/`,
      `src/components/`, `src/theme/`, `src/utils/`, `src/api/`, `src/hooks/`
- [x] Fuera de `design.md` §7 solo aparecen `progress/current.md` (que exige
      `AGENTS.md`) y los dos commits ajenos de documentación de O4

---

## Observaciones

### O1 — BLOQUEANTE. R3 no vigila la fila renderizada: un cuarto tile pasa entero

`src/screens/home/index.test.tsx:1528` y `:1593`.

La spec prescribe, y `traceability.md` lo repite en la columna Test —que su
propia cabecera declara *"la prescribe la spec, no la improvisa el
implementer"*—, que el `it` de R3 asserte **"exactamente tres hijos en la fila
de tiles"**. Eso no se escribió. En su lugar hay dos comprobaciones más débiles:

- `:1593` `expect(quickActions.match(/testID: 'quick-action-/g)).toHaveLength(3)`
  — es un recuento **sobre el fuente**, acotado al bloque de la constante
  `QUICK_ACTIONS`: solo ve tiles declarados ahí dentro.
- `:1528` `getAllByTestId(/^quick-action-(?:weight|reminder|documents)$/)` — es
  una **lista blanca**: por construcción no puede ver un cuarto nombre. El único
  extra vigilado es el literal `quick-action-map` (`:1546`).

**Mutación que lo demuestra (M9b)**: un cuarto `<Pressable
testID="quick-action-extra">` escrito inline dentro de `<View
className="flex-row gap-3">`, apuntando a **`/pairing`** —un destino que la
tabla de R3 declara *"fuera: configuración de una vez"*— deja la **suite móvil
completa en verde: 68/68 suites, 1054/1054 tests, 1/1 snapshot**. No es que se
escape de mi filtro: no lo caza ningún candado de la app.

Es justo el criterio que el humano fijó el 2026-09-08 y que ratificó en
§Aprobación punto 1, y es el requisito por el que esta spec se reescribió
entera. R15b dice literalmente que si una mutación deja la suite verde *"el
candado correspondiente está mal escrito y se arregla antes de seguir, no se
justifica"*.

**Arreglo, una línea, verificado por mí**: en `:1528`, cambiar
`/^quick-action-(?:weight|reminder|documents)$/` por `/^quick-action-/`. Con ese
cambio y M9b puesta, el `it` se pone rojo con
`+ "quick-action-extra"` en el `toEqual`. Restauré ambos ficheros después de
comprobarlo. Si además se quiere la letra de la spec, añadir el recuento de
hijos de la fila renderizada al `it` de R3.

### O2 — Quinta dimensión sin vigilar: la tinta del icono

`src/screens/home/index.tsx:422`, `<Icon size={24} color={quickActionInks[index]} />`.

Cada tile decide **cinco** cosas, no cuatro: icono, etiqueta, hueco→fondo,
destino y **hueco→tinta**. Las cuatro primeras mueren por separado (M1-M4). La
quinta no la mira nadie: `quickActionInks[index]` → `quickActionInks[0]` deja la
**suite móvil completa verde (68/68, 1054/1054)**. El candado de forma de R5
solo comprueba que la plantilla `` `category-${slot}-strong` `` aparece en el
fuente; nunca comprueba que el array resuelto se indexe por el mismo tile.

R5 afirma que fondo y tinta *"no puedan divergir **por construcción**"*. Hoy no
divergen, pero por convención —el índice coincide— y no por construcción: nada
lo obliga. El peor caso que permite es un tile de Documentos con tinta violeta
sobre pastel azul. **Recalculé ese cruce y sigue pasando AA** (violeta sobre
azul 4,76/4,81; violeta sobre ámbar 4,88/4,81), porque las tres tintas fuertes
tienen luminancia casi idéntica. Por eso O2 no bloquea por sí sola: el daño es
semántico, no de accesibilidad. Pero es un hueco de candado del mismo tipo que
el que #69 dejó, y se cierra en el mismo pase que O1 — basta con leer la tinta
en el `it` de R4, o con derivarla dentro del `.map()` en vez de por índice
externo (esto último sí tocaría producción y ya no es cambio de test).

### O3 — Un tercer `as Href`, sobre una ruta que R2 dice que no debe llevarlo

`src/screens/home/index.tsx:420`,
`router.push(href(selectedPetId) as Href)`.

R2 acota el cast a *"los dos sitios donde el repo ya lo usa"* y dice de forma
explícita que **`/weight-log` typechequea sin cast y debe seguir sin él**. Como
D3 obliga a que las tres filas tengan la misma forma y a renderizarlas con un
solo `.map()`, hay **un único** `router.push` y el cast cubre los tres destinos,
`/weight-log` incluido. No es un atajo del implementer: es una tensión interna
de la spec aprobada —D3 hace imposible cumplir la letra de R2— y el cruce con
`readdirSync` del `it` de R2 impide que el cast tape una ruta inexistente, que
es el riesgo real que §8 promete cerrar.

Dos apuntes para el registro: la premisa de R2 de que el repo usa `as Href` en
**dos** sitios es falsa —hoy hay **siete** en `src/`, en `profile/index.tsx`
(×4), `add-reminder`, `reminders` y `food.tsx`—; y esta desviación **debería ser
la cuarta entrada** del §"Premisas contrastadas con el árbol" del informe, que
solo declara tres. No requiere arreglo de código, sí declaración.

### O4 — Commits ajenos en la branch: son **dos**, no uno, y los dos son solo documentación

Verificado: `997c080` es exactamente lo que dice. **Una línea** de
`docs/demo-runbook.md` (`AWS_PRESIGN_ENDPOINT_URL` va comentada en
`.env.example`), autor `Claude Fable 5.1` de otra sesión, cero código, cero
tests, cero configuración.

Lo que el encargo no mencionaba: en la branch hay **otro** commit ajeno y mucho
mayor, **`71a4db7`** *"docs: runbook de demo del entorno local hasta #69"* — 227
líneas nuevas de `docs/demo-runbook.md` más una fila en la tabla de `AGENTS.md`.
Es el commit que `997c080` corrige, entró antes de que Codex empezase, y por eso
Codex midió su alcance **contra él** y su informe solo declara el segundo. Los
dos son documentación pura.

**Mi criterio: aceptable para el PR, con la condición de nombrarlos.** Ninguno
puede alterar el comportamiento de #71 —cero ficheros de código o de test— y
reescribir historia ajena para extraerlos cuesta más de lo que ahorra; Codex
hizo lo correcto detectándolos, declarándolos y no tocándolos. Lo que **sí** hay
que hacer es que la descripción del PR nombre **los dos** (`71a4db7` y
`997c080`), para que el humano mergee sabiendo qué entra: 228 líneas de runbook
que nadie ha revisado en este ciclo. Si el humano prefiere que el runbook se
revise por sus propios méritos, la alternativa es un `cherry-pick` de ambos a su
rama y un rebase de esta — decisión suya, no mía. **Nadie los revierte sin esa
decisión.**

### O5 — El informe subcuenta el rojo de M5

`progress/impl_mobile-home-quick-actions.md`, tabla §"Prueba de mutación R15b",
fila 5: dice *"exactamente 2 fallos"*. Al replantarla salen **3**: se suma
`it('no apunta a ninguna ruta inexistente')`, que cruza los destinos con
`readdirSync` y recibe cuatro donde espera tres. El rojo es **más fuerte** que
el declarado, así que la conclusión aguanta; la tabla es la que está mal. La
spec pedía rojo "por dos sitios" y salen tres.

### O6 — Entrada obsoleta de `feature_list.json` (para el leader, no para el implementer)

El registro de #71 sigue describiendo **cuatro** tiles a Mapa, Actividad,
Vacunas y Comidas, y declara `files_affected: ["src/app/(tabs)/home.tsx",
"src/theme/global.css"]` — dos ficheros que la feature, correctamente, **no
toca**. Lo superó la spec aprobada el 2026-09-08. Conviene alinearlo al cerrar,
para que el histórico no contradiga a la spec.

---

## Lo que no cierra este veredicto

El **gate humano de smoke en dev build de Android** (nunca Expo Go), en tema
claro y oscuro, sigue pendiente y no es delegable: los tres tiles abriendo su
pantalla, Documentos con **dos** mascotas, el retorno a la Home tras guardar un
recordatorio, la distinción de los tres pasteles contra el fondo —1,06-1,10 en
claro y 1,16 en oscuro, apretado y calculado—, las etiquetas sin truncar y
TalkBack anunciando **tres** botones. Guion completo en `requirements.md`
§Aprobación. Con O1 corregida y ese smoke firmado, la feature es `done`.

---

## Output de `./init.sh`

Corrido por mí, en primer plano, sobre el árbol limpio en `a2f2686`, con
`env -u FORCE_COLOR` (bug #75) y tras comprobar `pgrep -f init.sh` (ninguno).
**Una sola corrida, sin repeticiones: no apareció el flaky #76.**
Árbol limpio también **después** (el `eslint --fix` no movió nada).

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible
✅ bun disponible

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
        (preexistente, ajeno a #71)

→ Instalando dependencias...
✅ Dependencias instaladas   (bun: 1311 installs / 1135 packages, no changes)

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-home-quick-actions
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso   (nest build + tsc-alias + cdk synth)

→ Ejecutando tests...
  backend unitario:  Test Suites: 163 passed, 163 total
                     Tests:       1243 passed, 1243 total
  infra:             Test Suites: 2 passed, 2 total
                     Tests:       14 passed, 14 total
  móvil:             Test Suites: 68 passed, 68 total
                     Tests:       1054 passed, 1054 total
                     Snapshots:   1 passed, 1 total
✅ Tests pasados

→ Tests e2e...
  Test Suites: 3 skipped, 25 passed, 25 of 28 total
  Tests:       8 skipped, 354 passed, 362 total
  Time:        108.09 s
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores   (backend eslint + infra eslint + expo lint)

→ Typecheck...
✅ Typecheck sin errores   (tsc --noEmit)

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 65/80 completadas | 14 pendientes

EXIT=0
```

Aviso no bloqueante repetido durante la corrida: el AWS SDK v3 avisa de que sus
versiones posteriores a la primera semana de enero de 2027 exigirán Node ≥22;
esta corrida con Node 20.20.2 terminó verde. Preexistente y ajeno a #71.

---
---

# Revisión correctiva — rango `c18f099..5daa368` (16 commits `fix(...)`)

Fecha: 2026-09-09
Veredicto: **APROBADO**

O1 (el bloqueante), O2, O3 y O5 están cerradas y **verificadas replantando yo
las mutaciones**, no leyendo el informe. El gate correctivo salió verde a la
primera. Quedan dos huecos de candado nuevos —O7 y O8—, ninguno bloqueante:
los dos son sobre código que **hoy es correcto**, y los dejo registrados como
deuda con su arreglo exacto.

## Alcance del rango correctivo

Producción: **4 líneas** en `src/screens/home/index.tsx`, todas de O3 —se retira
`as Href` del `router.push` y el `import { type Href }` que quedaba huérfano—.
La tinta y la rejilla **no cambiaron en producción**: estaban bien, lo que
faltaba era el candado, y eso es lo que arregla el rango.

Test: 24 líneas en `index.test.tsx`. Nada más: ni `src/app/`, ni
`src/components/`, ni `src/theme/`, ni `src/utils/`, ni backend, ni infra, ni
dependencias, ni tokens. **Ninguna cifra de candado se movió** —ni
`consistency-classnames`, ni `ui-language`, ni `language-provider`, ni
`design-drift` entran en el diff—, así que las catorce filas de R14 siguen como
las validé en la primera revisión.

Commits ajenos: siguen siendo **exactamente los dos** de O4 (`71a4db7`,
`997c080`), sin un tercero. El otro commit no-`fix` del historial es `100ef1a`
*"Approve mobile home quick actions spec"*, firmado por el **humano**
(`AlexisSM377`): es el gate de aprobación, no trabajo ajeno. Tomo nota de que el
humano ya decidió que los dos viajen en el PR de #71 y se nombren en su
descripción; no lo vuelvo a plantear.

## C4 en el rango correctivo: los rojos siguen siendo de producción

Verificado commit a commit, que es donde #69 se rompió:

| Par | Rojo | Qué versiona el rojo |
|---|---|---|
| O1 | `9a4854e` → `7bf12d5` | **producción**: añade un `<Pressable testID="quick-action-extra" onPress={() => router.push('/pairing')} />` a `index.tsx` (+4 líneas), que el verde retira |
| O2 | `8246d2e` → `41838b5` | **producción**: `quickActionInks[index]` → `quickActionInks[0]` en `index.tsx`, que el verde revierte |
| O3 | `da9a847` → `ba92380` | test-first legítimo: el rojo solo añade la aserción, y lo que la pone roja es el **cast real que había en producción**; el verde lo retira. No es mutación de mock |
| O3b | `db588de` | endurece la aserción de `toContain` a regex tolerante a espacios. Sin rojo asociado y sin necesitarlo |

Ninguno toca el doble de `reicon` ni ningún otro mock.

## Verificación por mutación, replantada por mí

Filtro de seis suites (198 tests), fichero restaurado entre cada una.

### Lo que se arregló

| # | Mutación | Antes del arreglo | Ahora |
|---|---|---|---|
| V1 | cuarto `Pressable` inline `testID="quick-action-extra"` → `/pairing` | **verde** (68/68, 1054/1054) — era O1 | **ROJO**: `dibuja el rótulo y los tres tiles en orden` |
| V4 | `quickActionInks[index]` → `[0]` | **verde** (68/68, 1054/1054) — era O2 | **ROJO**: `liga icono, etiqueta, color, tinta y destino…` |

O1 y O2 cerradas. El `it` de R4 ahora observa **cinco** dimensiones por tile con
`within(tile)`, y la tinta se lee de verdad sobre el árbol: el test espía
`Uniwind.getCSSVariable` para hacer identificable el token que cada tile pide, y
asserta `icon.props.color` por tile. Es candado de conducta, no de fuente.

### Que no se rompió nada de camino

Replanté las **siete** mutaciones originales de R15b sobre el árbol corregido:

| Mutación | Fallos | Test que muere |
|---|---|---|
| M1 destino | 2 | R4 + `lleva cada tile a su ruta existente` |
| M2 icono | 2 | R4 + `usa iconos de reicon y ningún emoji` |
| M3 etiqueta | 1 | R4 |
| M4 hueco/color | 1 | R4 |
| M5 cuarto tile `/map` | 3 | R1 + `no apunta a ninguna ruta inexistente` + R3 |
| M6 colocación | 1 | R10 |
| M7 `min-h-11` | 1 | R6 |

Las siete siguen rojas y coinciden con la tabla ya corregida del informe.

**Un aviso metodológico contra mí mismo**: mi primer intento de replantar M6
insertó la rejilla justo **antes** del bloque de la gráfica, y salió verde. No
era un hueco: en el escenario del test la actividad está cargada, así que el
skeleton no se monta y el orden resultante era **el correcto** — mi mutación era
un no-op. Al moverla de verdad detrás de la gráfica, R10 muere. Lo dejo escrito
porque una mutación mal plantada se lee igual que un candado muerto.

### Sondas nuevas: la siguiente vía, y la sexta dimensión

| # | Sonda | Resultado |
|---|---|---|
| V2 | cuarto tile inline con `testID="shortcut-extra"` → `/pairing` | **VERDE**, 198/198 → O7 |
| V3 | cuarto tile inline **sin `testID`** → `/pairing` | **VERDE**, 198/198 → O7 |
| V5 | etiqueta del tile `text-foreground` → `text-muted` | **VERDE** en la suite móvil completa (68/68, 1054/1054), repetido → O8 |

## Checklists

- **C2** — [x] una sola feature `in_progress`; [x] `progress/current.md` al día
- **C3** — [x] solo presentación; cero domain/application/infrastructure/backend
- **C4** — [x] cada `R<n>` con test que lo nombra; [x] test-primero;
  [x] **quinto punto**: los rojos correctivos son de producción, verificados
  fichero a fichero
- **C5** — [x] `traceability.md` sin filas "pendiente"; las filas R1-R5, R15 y
  R15b están reescritas y describen lo que los tests **hacen de verdad**,
  incluida la sustitución de la aserción de R3 (ver O7); [x] formato de commit
  `fix(mobile-home-quick-actions): … (R…)` correcto en los 16
- **C6** — [x] `status: approved` intacto; ningún requisito modificado. Las
  correcciones se documentan en el informe y en la trazabilidad, **sin editar
  spec aprobada**, que es el procedimiento correcto
- **C7** — [ ] N/A: no reemplaza nada; cero ficheros borrados
- **C8** — [x] grep-clean intacto; radios en escala; sin tokens nuevos; táctil
  ≥44 pt (M7 lo vigila); a11y de tres botones independientes sin cambios

## Observaciones nuevas

### O7 — El candado cuenta `testID`, no hijos de la fila: quedan dos variantes vivas

`index.test.tsx:1528`, `getAllByTestId(/^quick-action-/)`.

El arreglo cierra el caso que importaba —un cuarto tile con el nombre de la
convención— pero el recuento sigue siendo **por `testID` que case el prefijo**,
no **por hijos renderizados de la fila**, que es lo que la spec prescribe
literalmente (*"exactamente tres hijos en la fila de tiles"*, R3 y
`traceability.md`). Dos variantes lo atraviesan con 198/198 verde:

- **V2**: cuarto tile con `testID="shortcut-extra"` → `/pairing`.
- **V3**: cuarto tile **sin `testID`** → `/pairing`.

El eje que decide no es el tipo de componente —un `<View>` con `testID`
`quick-action-*` también muere— sino **si el nodo lleva un `testID` con ese
prefijo**. Sin él, es invisible al candado.

**Por qué no bloquea**: el camino realista a un cuarto tile es añadir una fila a
`QUICK_ACTIONS` —cazada dos veces, por el recuento de fuente y por la regex
abierta— o copiar un tile existente, que se lleva su `testID` de convención y
muere. Escapar exige ahora **nombrar el tile fuera de convención a propósito**.
Es mucho más estrecho que O1, donde pasaba el nombre canónico.

**Arreglo cuando se retome** (una aserción, cierra las tres variantes):
`expect(within(quickActions).getByTestId('quick-actions').children)` no sirve —
la fila no tiene `testID` propio; lo directo es dar `testID="quick-actions-row"`
a la `View` de `flex-row gap-3` y assertar su `children.length === 3`. Eso **sí**
toca producción (un `testID` nuevo), así que es decisión del humano si entra
aquí o como deuda.

### O8 — Sexta dimensión sin vigilar: el color de la etiqueta del tile

`index.tsx:423`, `<Text className="text-2xs font-semibold text-foreground">`.

Cambiar `text-foreground` por `text-muted` deja la **suite móvil completa verde
(68/68, 1054/1054)**, comprobado dos veces. Nada observa el color de la
etiqueta, ni por árbol ni por fuente.

No es cosmética: `design.md` §D12 fija la etiqueta en `foreground` y la tabla de
contrastes de §4 **calcula exactamente ese par** —17,25-17,82 en claro y
15,41-15,42 en oscuro—. Con `text-muted` el contraste real cae a **4,54-4,69 en
claro y 6,45 en oscuro** (recalculado por mí sobre `--muted` `#667085` / `#9CA3AF`).
Sigue pasando AA, pero en claro **por 0,04** y sobre texto de 10 px
(`text-2xs`), donde AA normal es lo que aplica. Es decir: la tabla de la spec
dejaría de describir lo que se envía y nadie se enteraría.

**Por qué no bloquea**: hoy el valor es el correcto y el peor caso alcanzable
sigue cumpliendo AA. **Arreglo**: una línea en el `it` de R4 —
`expect(tileQueries.getByText(label).props.className).toContain('text-foreground')`.

### O9 — Un fallo intermitente en la suite móvil que no pude atribuir

Durante las sondas, **una** de mis siete corridas completas de la suite móvil
devolvió `1 failed, 1053 passed`. Mi filtro de salida se comió la línea del
fallo y no pude identificar el test; las **dos** repeticiones inmediatas de la
misma mutación, y las otras cuatro corridas completas más las dos de `init.sh`,
salieron 1054/1054. Un candado de cadena literal no puede fallar de forma
intermitente, así que lo trato como flaky ajeno —el candidato natural es **#72**,
el flaky de selección de foto de add-pet ya registrado—. **No lo cuento contra
#71**, pero lo dejo escrito: un intermitente sin nombre en la suite móvil
ensucia baselines igual que #76 ensucia las de e2e, y merece su propia entrada
si vuelve a aparecer.

### O6 (de la primera revisión) — sigue abierta

La entrada de `feature_list.json` para #71 sigue describiendo cuatro tiles a
Mapa/Actividad/Vacunas/Comidas y `files_affected` con dos ficheros que la
feature no toca. Es del leader, no del implementer; conviene alinearla al cerrar.

## Lo que sigue sin cerrar este veredicto

El **gate humano de smoke en dev build de Android**, tema claro y oscuro, con el
guion completo de `requirements.md` §Aprobación —los tres tiles abriendo su
pantalla, Documentos con dos mascotas, el retorno a la Home tras guardar un
recordatorio, los tres pasteles distinguibles del fondo (1,06-1,10 claro / 1,16
oscuro), etiquetas sin truncar y TalkBack anunciando tres botones—. Sin él la
feature no pasa a `done`.

## Output de `./init.sh` — gate correctivo

Corrido por mí, en primer plano, sobre el árbol limpio en `5daa368`, con
`env -u FORCE_COLOR` (#75) y tras `pgrep -f init.sh` (libre).
**Una sola corrida, sin repetir: no apareció el flaky #76 de
`health-vaccines.e2e-spec.ts:497`.** Árbol limpio también después.

```
✅ node / pnpm / bun disponibles
✅ .env encontrado · DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso

→ Tests
  backend unitario:  163 passed / 163 suites · 1243 passed / 1243 tests
  infra:               2 passed / 2 suites   ·   14 passed / 14 tests
  móvil:              68 passed / 68 suites  · 1054 passed / 1054 tests · 1/1 snapshot
✅ Tests pasados

→ Tests e2e
  3 skipped, 25 passed de 28 suites · 8 skipped, 354 passed de 362 tests
✅ Tests e2e pasados

✅ Lint sin errores
✅ Typecheck sin errores   (tsc --noEmit — confirma O3: las tres rutas,
                            /weight-log incluida, typechequean sin `as Href`)
✅ Todo verde. Listo para trabajar.

EXIT=0
```

Inventario de `as Href` en producción, recontado por mí: **siete**, todos
preexistentes —`profile/index.tsx` ×4, `add-reminder`, `reminders`, `food.tsx`—
y **ninguno en la Home**. Coincide con la cifra que el informe declara en su
premisa 4.

Avisos preexistentes y ajenos a #71, sin cambio: faltan `RESEND_API_KEY`,
`RESEND_FROM` y `RESET_LINK_HOST` en `.env`; el AWS SDK v3 anuncia que sus
versiones posteriores a enero de 2027 exigirán Node ≥22 (esta corrida, con Node
20.20.2, terminó verde).
