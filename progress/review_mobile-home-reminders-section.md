# review: mobile-home-reminders-section (#70)

Fecha: 2026-09-09
Reviewer: subagente `reviewer` (Claude Opus 5)
Rango revisado: `b0ec5a8364d8e0b05b2c9b4d5d46f53b4033e29f..82a1cbd7dd9c65b888c4d12860ce6c521a70b2a5` (65 commits)
Branch: `feature/70-mobile-home-reminders-section`

## Veredicto: **RECHAZADO**

Un solo defecto bloqueante, y es exactamente el que la propia spec pre-declaró
como condición de parada: **los candados de zona horaria de R5 no vigilan nada**.
Con M1 y con M2 plantadas, la suite queda **verde** en el entorno en el que corre
`init.sh`. Reproducido por el reviewer, no deducido del informe.

Todo lo demás está en muy buen estado: `init.sh` exit 0, las ocho mutaciones son
de producción y revertidas exactamente, la trazabilidad está completa, los deltas
de inventario cuadran uno a uno y el grep-clean de la carta está limpio.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`feature_list.json:1310-1312`, #70)
- [x] `progress/current.md` describe la sesión activa (§Implementación activa — #70)
- [x] `progress/history.md` tiene entrada de cada sesión cerrada
- [x] Working tree limpio; `git status --porcelain` vacío

## Checklist C3 — Arquitectura

No aplica en el sentido de capas backend: la feature es 100 % móvil y no toca
`backend-pet-tracker/`. Verificado igualmente:

- [x] `backend-pet-tracker/` **0 ficheros** cambiados (R15)
- [x] `infra/` y `hosting/` **0 ficheros**
- [x] `src/api/` solo `types.ts`, y solo para tipar (R2)
- [x] Helpers puros en `src/screens/home/format.ts`, sin imports (función pura con `now` como parámetro)

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra — verificado uno a uno:
      R1/R2/R3/R6/R7/R8/R9/R10/R11/R12/R13/R14/R15 en `src/screens/home/index.test.tsx`,
      R4/R5 en `src/screens/home/format.test.ts`, R16 en `src/__tests__/ui-language.test.ts:88`,
      R17 en `src/__tests__/design-drift.test.ts:275`, R18 en `src/__tests__/consistency-classnames.test.ts:374`
- [x] El historial muestra test-primero: cada R-id tiene su commit rojo (`lock …`)
      separado del verde, no todo junto
- [x] Ningún commit rojo falla por `ReferenceError` de un helper inexistente
- [x] **Quinto punto (mutación de producción)**: las ocho mutaciones M1-M8 están
      en código de producción, no en dobles. Ver §Auditoría de las ocho mutaciones
- [ ] **PERO**: dos de las ocho mutaciones no ponen la suite roja en el gate.
      Ver el **Hallazgo bloqueante B1**

## Checklist C5 — Trazabilidad

- [x] `specs/mobile-home-reminders-section/traceability.md` **sin ninguna fila "pendiente"**
- [x] Cada requisito tiene test y commit registrados, incluidas las filas R19 y R19b
- [x] Commits siguen `feat(mobile-home-reminders-section): <desc> (R-ids)`.
      Las seis excepciones son commits de spec/aprobación previos al handoff
      (`40413db`, `6734b9b`, `bc70455`, `2f5cacf`, `2123f4e`, `a2b99bb`), ninguna
      es de implementación ni de mutación

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla `- [X] Aprobado por humano (fecha: 2026-09-08)` marcada
- [x] D1, D2 y D3 dentro de §Decisiones de implementación, con su
      `- [X] Aprobado por humano`, versionadas en `40413db`
- [ ] **Ningún requisito modificado tras la aprobación sin volver a pasar el gate**
      → ver **Hallazgo O3**: el feedback `pressed` de R10 se añadió con
      autorización verbal, sin entrada firmada

## Checklist C7 — Sin código huérfano

- [x] N/A — esta feature **no reemplaza nada existente**. Es un hermano nuevo en
      `home-content`; no toca #67, #68, #69 ni #71, y sus tres candados de orden
      heredados siguen byte-idénticos

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)

- [x] Grep-clean: **cero** hex fuera de `src/theme/` en producción, cero clases
      arbitrarias `[...]`, cero `StyleSheet.create` (solo `StyleSheet.flatten` en
      `components/card.tsx:29`, patrón aprobado), cero shadow/elevation legacy
- [x] Radios en `src/screens/home/index.tsx`: solo `rounded-card` ×3,
      `rounded-full` ×5, `rounded-xl` ×4 — dentro de la escala de #62 R4
- [x] Estado de carga con `Skeleton` **dimensionado** (`h-16 w-full rounded-card`),
      no spinner suelto
- [x] `Card` compartido reutilizado en las dos filas; sin fork local ni receta duplicada
- [x] Tappable con touch target ≥ 44 pt (`min-h-11`) **y feedback `pressed`**
      (`index.tsx:517`), con candado (`index.test.tsx:2118-2141`)
- [x] Sin animaciones nuevas
- [ ] **Recetas tipográficas y tinta de icono sin vigilar** → **Hallazgo O1**

---

# Hallazgo bloqueante

## B1 — Los candados de zona horaria de R5 son inertes: M1 y M2 dejan el gate verde

**Rompe**: R5, R19b, `CHECKPOINTS.md` C4 (quinto punto, en su intención).
**Fichero**: `mobile-pet-tracker/src/screens/home/format.test.ts:27-70`.

`format.test.ts` fija la zona horaria así, en los dos `it` de R5:

```js
process.env.TZ = 'America/Mexico_City';
expect(calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 23, 30))).toBe(5);
```

**Bajo Jest esa asignación no llega a V8.** Sonda ejecutada dentro del propio
runner del proyecto (`jest-expo`, worktree desechable en el commit rojo de M1):

```
TZ before assignment: 2026-09-10T23:30:00.000Z
TZ after  assignment: 2026-09-10T23:30:00.000Z
process.env is real process.env? true
```

El epoch es idéntico antes y después. En Node v20 pelado sí funciona
(`getTimezoneOffset()` pasa de `0` a `360`), y por eso el defecto es invisible a
simple vista; dentro del worker de Jest, no.

### Reproducción, mutación por mutación

Worktree aislado sobre los commits rojos, `node_modules` enlazado, sin tocar el
árbol revisado:

| Mutación | Commit rojo | TZ por defecto de la caja (UTC) — **lo que corre `init.sh`** | `TZ=America/Mexico_City` en el entorno del proceso |
|---|---|---|---|
| **M1** (`calendarDaysUntil` → `Math.ceil(Date.parse(...))`) | `1ab9a89` | **6/6 VERDE** | 1 fallo / 5 verdes (`Expected: 5, Received: 4`, `format.test.ts:36`) |
| **M2** (`fmtDate` → `new Date(cadenaCruda)`) | `cdfb868` | **6/6 VERDE** | (informe: 2 fallos) |

La caja está en UTC (`timedatectl` → `Universal time`, `TZ` sin definir), y
`init.sh` no exporta ninguna zona. Es decir: **con el defecto de #68 reintroducido
en producción, el gate completo pasa en verde.**

### Por qué esto es exactamente lo que la spec prohíbe

R19b, literal:

> **M1 y M2 se plantan en la zona ciega a propósito**: las dos dejan la suite
> verde bajo un runner en UTC. **Si no se ponen rojas, el `it` de R5 no está
> fijando la zona horaria y no vigila nada.**

R5, literal:

> **Éstos son los únicos candados que matan la mutación M2 de R19b**: si con esa
> mutación plantada la suite sigue verde, están mal escritos y se arreglan
> **antes** de seguir.

El implementer no aplicó esa cláusula. En vez de arreglar el candado, sorteó el
síntoma ejecutando la prueba con la zona en el entorno del proceso, y lo dejó
escrito en `progress/impl_mobile-home-reminders-section.md`:

> `TZ=UTC` dejó 6/6 verdes y `TZ=America/Mexico_City` dejó 1 fallo/5 verdes

Ese "6/6 verdes en UTC" **es el defecto**, no la asimetría buscada. La asimetría
que D3 pedía es entre *zonas horarias del código bajo prueba*, no entre *formas
de invocar el runner*: un candado que solo muerde cuando alguien recuerda
exportar `TZ` a mano no vigila nada en CI ni en el gate.

### La premisa de la spec sobre #68 se leyó a medias

R5 dice: *"El mecanismo está probado en este repo: #68 R4 ya guarda
`process.env.TZ`, lo fija a `'America/Mexico_City'`, llama al helper y lo
restaura en un `finally`, y está verde. Se usa el mismo patrón."*

Pero en #68 el `process.env.TZ` **no es lo que muerde**. Lo que muerde es el espía
del constructor (`weekly-activity-chart.test.tsx:554-573`):

```js
const dateConstructor = jest.spyOn(global, 'Date')…
expect(dateConstructor.mock.calls).toEqual([[2026, 8, 6]]);
```

Esa aserción —que `Date` se construye **por componentes** y nunca con la cadena
cruda— es independiente de la zona y está viva siempre. #70 copió la mitad
inerte (el andamiaje de `process.env.TZ`) y dejó fuera la mitad que sostiene el
candado.

### Qué hay que hacer para que un segundo pase apruebe

Cualquiera de estas dos, y volver a plantar M1 y M2 comprobando que la suite se
pone roja **sin exportar `TZ` a mano**:

1. **Preferido, y con precedente en el repo**: replicar el patrón real de #68 en
   `format.test.ts` — espiar `Date`/`Date.parse` y asertar que
   `calendarDaysUntil` y `fmtDate` **nunca** reciben la cadena cruda, y que el
   constructor se llama con componentes (`[[2026, 8, 15]]`). Mata M1 y M2 en
   cualquier zona horaria.
2. **Alternativa**: fijar la zona **antes de que arranquen los workers**
   (`globalSetup` de Jest o `TZ` en el script `test` de `package.json`), no
   dentro del `it`. Si se elige ésta, el `try/finally` de
   `format.test.ts:27-70` debe borrarse, porque documenta un mecanismo que no
   existe.

En los dos casos, **borrar del informe la evidencia de M1/M2 y rehacerla** con la
suite roja en la invocación por defecto.

---

# Hallazgos no bloqueantes (deben resolverse o registrarse con id propio)

## O1 — Elemento repetido: dos dimensiones sin vigilar

Precedente de #69 y #71: cada revisión destapa una dimensión más. Enumeradas
**todas** las decisiones que toma la fila, observadas con `within(fila)`:

| # | Decisión | ¿Vigilada? | Dónde |
|---|---|---|---|
| 1 | **Dato mostrado** (nombre / fecha / contador) | ✅ | `index.test.tsx:1915-1928`, valor exacto por nodo **más** negaciones cruzadas en las tres direcciones. M3 lo mata |
| 2 | **Condición de render** (fila vs. vacío vs. esqueleto vs. error) | ✅ | R6, R8, R9 |
| 3 | **Cardinalidad del cuerpo** | ✅ | `index.test.tsx:2028-2077`, sobre `.children` — nunca `testID`. M5 lo mata |
| 4 | **Nombre accesible** del contador, en las tres ramas | ✅ | `index.test.tsx:2144-2190` (R11) y `:1963` (R7) |
| 5 | **Etiqueta/clave de copy** | ✅ | R7 + `ui-copy-table.ts` (7 filas = 7 usos) |
| 6 | **Color de fondo** (disco azul vs. neutral) | ✅ | `index.test.tsx:2214-2218` y `:2236-2240`, igualdad exacta contra `CATEGORY_SLOTS` |
| 7 | **Destino de navegación** | ✅ | R10 + `appRoutes` + unicidad del literal. M6 lo mata |
| 8 | **Receta tipográfica del contador** (incl. `TABULAR_NUMS`) | ✅ | `index.test.tsx:2221-2226`. M8 lo mata |
| 9 | **Componente de icono** | ⚠️ parcial | Solo por **lectura de fuente** (`index.test.tsx:2248-2259`: dos `<Syringe size={20}`). Nunca se observa `icon-syringe` **dentro** de la fila |
| 10 | **Tinta del icono** | ❌ **NO** | Nadie asserta `icon.props.color` |
| 11 | **Color de etiqueta / receta tipográfica de nombre, fecha y texto vacío** | ❌ **NO** | Nadie asserta su `className` |

**#10 — tinta del icono.** Producción usa `color={vaccineInk}`
(`category-blue-strong`) en la fila (`index.tsx:541`) y `color={muted}` en el
estado vacío (`:576`). El doble de `reicon` **sí** propaga las props
(`index.test.tsx:96-99`: `React.createElement(View, { testID, ...props })`), y
#71 usa exactamente eso una feature antes, en este mismo fichero:

```js
expect(icon.props.color).toBe(ink);          // index.test.tsx:1669
expect(labelNode.props.className).toContain(labelColor);  // :1670
```

#70 no lo hace. Cruzar `vaccineInk` ↔ `muted` entre las dos filas deja la suite
**entera** verde: la vacuna se pintaría gris apagado y el estado vacío azul de
vacunación, sin un solo test rojo.

**#11 — recetas de nombre, fecha y texto vacío.** R6 prescribe
`text-sm font-semibold text-foreground` (nombre) y `text-xs font-normal text-muted`
(fecha); R8 prescribe `flex-1 text-sm font-normal text-muted`. Los tests obtienen
esos nodos (`index.test.tsx:1915-1916`, `:2199-2200`) pero solo assertan
`props.children` y `props.style`; **nunca `props.className`**. Intercambiar las
recetas de nombre y fecha no mueve ningún inventario global (las mismas clases
siguen presentes, solo cambian de nodo) y deja la suite verde.

Esto es **literalmente el defecto ya registrado como #81** una feature antes
(`progress/current.md`: *"la receta tipografica `text-2xs font-semibold` del tile
no esta vigilada: una sonda a `text-xs font-medium` deja la suite **completa**
verde"*). Se repite en #70 con nodos distintos.

Coste del arreglo: dos líneas por nodo, con el patrón de `index.test.tsx:1669-1671`
ya escrito en el fichero.

## O2 — La cobertura del icono es de cadena, no de árbol

R13 cuenta `<Syringe size={20}` en el fuente y exige 2. Es suficiente para
detectar un cambio de glifo, pero no observa **dónde** se renderiza: si el icono
saliera de la fila, R13 seguiría verde y solo R12 (que asserta el `className` de
`row.children[0]`) lo notaría de refilón. Recomendado añadir
`within(row).getByTestId('icon-syringe')` en R6 y en R8, que además cierra O1 #10
en la misma línea.

## O3 — El feedback `pressed` de R10 necesitaba enmienda firmada, y se resolvió de palabra

**El cambio está implementado y con candado**, verificado:

- Producción: `src/screens/home/index.tsx:517`
  `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`
- Candado: `src/screens/home/index.test.tsx:2118-2141`,
  `it('muestra feedback visual al pulsar el enlace')`, que asserta el valor en
  reposo (`opacity === 1`) **y** el patrón exacto en el fuente

**Juicio, como pide el encargo: sí necesitaba enmienda firmada, y no la tuvo.**

- R10 prescribe la anatomía del control con nombres y clases exactos ("el control
  SHALL ser un `Pressable` con `accessibilityRole="button"`,
  `className="min-h-11 justify-center"` y un `Text` hijo con…"). Añadir una prop
  `style` a ese JSX es modificar un requisito **después** de la aprobación, que es
  lo que `CHECKPOINTS.md` C6, tercer punto, cierra.
- Esta spec **ya tiene el mecanismo montado y usado tres veces**: §Decisiones de
  implementación, con D1, D2 y D3, cada una con su `- [X] Aprobado por humano` y
  versionada en `40413db`. Una **D4** con la misma forma era el camino obvio y
  costaba una entrada.
- En su lugar, la autorización vive solo como prosa en
  `progress/impl_mobile-home-reminders-section.md` §Decisiones humanas
  ("el humano autorizó el 2026-09-09…"). `traceability.md` la menciona en la fila
  R10, pero la trazabilidad no es el artefacto del gate: `requirements.md` lo es.

**Atenuante, y por eso no bloquea**: la decisión de fondo es **correcta**. C8 exige
feedback `pressed` en todo elemento tappable y la carta gana sobre el JSX literal
de una spec; el conflicto se resolvió a favor de la carta, que es lo que
`CLAUDE.md` §UI móvil manda. Además la deuda ya estaba detectada en #71
(`progress/current.md`: *"los `Pressable` de la app no tienen feedback de pulsado
—C8 lo pide y hay un solo sitio resuelto en todo el repo"*).

**Acción para el segundo pase**: añadir la entrada **D4** a
`specs/mobile-home-reminders-section/requirements.md` §Decisiones de implementación,
con su casilla, y que el humano la firme junto con el resto.

---

# Auditoría de las ocho mutaciones (R19b) — par por par

Verificado con git, sin fiarse de la tabla del informe. **Ninguna mutación está
en un doble de test, un mock o una fixture.** Los ocho
`git diff --quiet <rojo>^ <verde> -- <fichero-producción>` devuelven **0**.

| # | Rojo / Verde | Fichero mutado | ¿Producción? | ¿Revierte exacto? | ¿Pone roja la suite en el gate? |
|---|---|---|---|---|---|
| M1 | `1ab9a89` / `4499db4` | `screens/home/format.ts` | ✅ | ✅ (0) | ❌ **NO** — B1 |
| M2 | `cdfb868` / `499b0ec` | `screens/home/format.ts` | ✅ | ✅ (0) | ❌ **NO** — B1 |
| M3 | `58338f3` / `1c940e8` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |
| M4 | `6e9206d` / `06cd7cf` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |
| M5 | `1763391` / `c13b934` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |
| M6 | `ca88209` / `91d636d` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |
| M7 | `bffaa47` / `a223d4c` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |
| M8 | `efb9bba` / `d22e1c9` | `screens/home/index.tsx` | ✅ | ✅ (0) | ✅ |

**M5 cumple la lección de #71 al pie de la letra** — el hijo intruso no lleva `testID`:

```diff
+              <View className="h-1.5 rounded-full bg-default" />
```

y muere contra la cardinalidad de R9 trasladada por D1, que cuenta
`getByTestId('reminders-section-body').children`, nunca coincidencias de `testID`.

**D3 quedó bien resuelta en su parte de diseño.** El rojo de M1 conserva la
normalización del cero (`return days === 0 ? 0 : days;`), así que el fallo ya no
sale de `expect(-0).toBe(0)`. Bajo `TZ=America/Mexico_City` el único fallo es el
correcto —`Expected: 5, Received: 4` en `format.test.ts:36`— y R4 sigue verde. La
asimetría **existe en la aritmética**; lo que falla es que el test no la puede ver
(B1).

Notas menores, no bloqueantes:

- `1ab9a89` mezcla la mutación con bookkeeping de `traceability.md` y del informe.
  Higiene, no C4.
- M7 mueve la sección por delante de `quick-actions` **y** del bloque de actividad
  semanal; la relación declarada se cumple, el movimiento es mayor que la frase.
- Ningún commit rojo de mutación contiene su propio candado: los candados van en
  commits `lock …` anteriores. Es la forma **más** estricta, no menos.

---

# Verificaciones que pasan (resumen de lo comprobado y correcto)

**D1 — cardinalidad trasladada a R9** ✅. `index.test.tsx:2028-2077` cuenta
`getByTestId('reminders-section-body').children` con longitudes **1** (cargado),
**1** (esqueleto) y **0** (error). Nunca cuenta `testID`. M5 lo mata.

**Candado de longitud del catálogo** ✅. `language-provider.test.tsx:41` pasa de
`260 + 16 + 1 + 4` a `260 + 16 + 1 + 4 + 7`. Claves reales medidas en
`src/i18n/catalog.ts`: `en` 281 → **288**, `es` 281 → **288**. Las siete son
exactamente las siete de R16, idénticas en los dos idiomas, ninguna borrada,
ninguna duplicada. El delta declarado **coincide** con las claves realmente
añadidas.

**Drift de estilo (R17)** ✅. Confirmado por quinta vez que **no existe** candado
global de hex: los tres barridos globales de `design-drift.test.ts` (`:50`, `:58`,
`:85`) no persiguen hexadecimales, y todos los que sí lo hacen usan lista nominal.
El bloque nuevo (`design-drift.test.ts:275-295`) lista sus **seis** ficheros, usa
el mismo regex que sus hermanos (`:104`, `:207`, `:247`, `:266`) y su título no
escribe la cifra con letra. La lista nominal **coincide 1:1** con los ficheros de
producción que la feature tocó; `src/api/types.ts`, que no estaba en ninguna de
las cinco listas previas, queda cubierto.

**Deltas de inventario (R18)** ✅. Los tres mandos de la fila 3 se mueven juntos
(`consistency-classnames.test.ts`: constante `HOME_TABULAR_DELTA_70` en `:337`,
fila de Home en `:342`, total `14 + 4 + 1 + 1` en `:361`, guarda de #69 R14 en
`:370`), y **ninguna base se colapsó a un literal plano**. Fila 4
(`legibility-classnames.test.ts:123`, `:138`) ídem. Medido: `TABULAR_NUMS` en Home
5 → 6; `text-accent-strong` en Home 1 → 2. `SCREEN_FILES` sin cambio (`19 + 2`).
Ningún otro recuento cerrado se movió; ningún assert debilitado, borrado,
renombrado ni saltado (`.skip`/`.only`/`xit` inexistentes en esos ficheros).

**Alcance (R15)** ✅. 22 ficheros cambiados, todos dentro de
`mobile-pet-tracker/`, `specs/`, `progress/` y `feature_list.json`. Cero en
`backend-pet-tracker/`, `infra/`, `hosting/`, `src/utils/`, `src/components/`,
`src/theme/`, `src/app/` y `src/screens/reminders/`.

**#84 no se coló** ✅. `src/utils/reminder-dates.ts` tiene el **mismo blob**
(`587cbd6`) en `b0ec5a8` y en `82a1cbd`: intacto. Ni `index.tsx` ni `format.ts`
importan o llaman `daysUntil`; `format.ts` no tiene imports en absoluto.
`calendarDaysUntil` es semánticamente distinta (normalización a medianoche UTC por
componentes, no `Math.ceil` sobre milisegundos), así que **no se reutilizó el
defecto de #68**.

**Deriva de código** ✅. `git fetch origin`; HEAD local `82a1cbd` ==
`origin/feature/70-mobile-home-reminders-section`; working tree limpio; 65 commits
por delante de `origin/main`, 0 por detrás. **Lo revisado es exactamente lo publicado.**

**Línea base roja de #76** — no apareció: los 25 suites e2e pasaron enteros. No
hubo nada que imputar ni que descontar.

---

## Resumen para el segundo pase

Para aprobar hacen falta tres cosas, en este orden:

1. **(bloqueante)** Arreglar los candados de R5 en `format.test.ts` para que
   muerdan sin `TZ` externa —preferiblemente con el espía del constructor `Date`
   de #68— y **rehacer la evidencia de M1 y M2** con la suite roja en la
   invocación por defecto.
2. **(recomendado, muy barato)** Cerrar O1: asertar `icon.props.color` en las dos
   filas y el `className` de nombre, fecha y texto vacío, con el patrón que #71 ya
   usa en `index.test.tsx:1669-1671`. Si el humano prefiere, registrarlo como
   deuda con id propio junto a #81, que es el mismo defecto.
3. **(proceso)** Añadir **D4** a §Decisiones de implementación de
   `requirements.md` por el feedback `pressed`, y que el humano la firme.

El gate humano restante (prueba de humo en dev build de Android, dos temas, cuatro
escenarios) sigue **sin cerrar** y no lo puede cerrar ninguna IA.

---

## Output de `./init.sh`

Ejecutado por el reviewer, en primer plano, desde `/home/claude/sites/Pet-Tracker`,
con `env -u FORCE_COLOR ./init.sh`. Sin otro `init.sh` corriendo (`pgrep`
comprobado antes de lanzar). Log completo en `/tmp/review70-init.log` (13 083 líneas).

```
=== INIT.SH EXIT CODE: 0 ===

→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-home-reminders-section
⚠️  STATUS.md desactualizado (66/81 declarado vs 66/84 real) — actualízalo antes de cerrar la sesión

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 163 passed, 163 total      (backend)
Tests:       1243 passed, 1243 total
Test Suites: 2 passed, 2 total          (infra)
Tests:       14 passed, 14 total
Test Suites: 68 passed, 68 total        (móvil)
Tests:       1078 passed, 1078 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 66/84 completadas | 17 pendientes
```

Los avisos de `.env` y `STATUS.md` son los no bloqueantes de siempre del harness;
`STATUS.md` (66/81 vs 66/84) viene de ids abiertos por el leader, no de esta feature.

## Comprobaciones de mutación ejecutadas por el reviewer

Sobre worktree desechable (`git worktree add --detach`, `node_modules` enlazado,
retirado con `git worktree remove` al terminar). **El árbol revisado no se modificó
en ningún momento**; `git status --porcelain` vacío antes y después.

```
# M1 plantada (1ab9a89), TZ por defecto de la caja = UTC, igual que init.sh
$ npx jest src/screens/home/format.test.ts
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total          ← el candado NO muerde

# misma mutación, TZ forzada en el entorno del proceso
$ TZ=America/Mexico_City npx jest src/screens/home/format.test.ts
  ✕ no se desplaza un día en una zona horaria negativa
    Expected: 5
    Received: 4
    at Object.toBe (src/screens/home/format.test.ts:36:11)
Tests:       1 failed, 5 passed, 6 total

# M2 plantada (cdfb868), TZ por defecto de la caja
$ npx jest src/screens/home/format.test.ts
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total          ← el candado NO muerde

# sonda del mecanismo, dentro del runner del proyecto
TZ before assignment: 2026-09-10T23:30:00.000Z
TZ after  assignment: 2026-09-10T23:30:00.000Z
process.env is real process.env? true   ← la asignación no llega a V8
```
