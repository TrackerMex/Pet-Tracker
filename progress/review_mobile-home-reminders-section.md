# review: mobile-home-reminders-section (#70) — SEGUNDO PASE

Fecha: 2026-09-09
Reviewer: subagente `reviewer` (Claude Opus 5)
Rango nuevo revisado: `6eae6ed..434f40c` (13 commits)
Branch: `feature/70-mobile-home-reminders-section`, HEAD `434f40c`

## Veredicto: **APROBADO**

El bloqueante del primer pase está **arreglado y verificado por el reviewer**,
no leído del informe: con M1 y con M2 plantadas, `bun run test` **sin exportar
`TZ`** deja la suite **roja** (1 fallo / 1077 verdes cada una), reproducido dos
veces sobre worktree desechable. Las dos dimensiones que D6 metió en alcance
también muerden: cruzar las tintas da 2 fallos/84 verdes y cada receta
tipográfica da 1 fallo/85 verdes. `env -u FORCE_COLOR ./init.sh` **exit 0**,
corrido por el reviewer en primer plano.

Quedan **dos hallazgos no bloqueantes** (O4 y O5), los dos de la misma clase que
el O1 del primer pase: dimensiones sin vigilar que ninguna decisión firmada
cubre. Se registran con reproducción exacta y arreglo probado, para que el
humano decida si los firma como D7 o los abre con id propio. **No se rechaza por
ellos**: rechazar por un defecto que el propio reviewer acaba de inventar, con
el criterio de aceptación firmado cumplido al pie de la letra, sería mover la
portería.

---

## Qué se rechazó en el primer pase, y en qué quedó

| Hallazgo del 1er pase | Estado ahora |
|---|---|
| **B1 (bloqueante)** — los candados de zona horaria de R5 eran **inertes**: `process.env.TZ` asignado dentro de un `it` no llega a V8 bajo Jest, así que M1 y M2 dejaban el gate **verde**. El defecto de #68 podía reintroducirse en producción sin un solo test rojo | **CERRADO**. D5 autorizó el cambio de mecanismo; `5385ed8` borró los dos `try/finally` y montó los espías de `Date.parse`, `Date.UTC` y constructor `Date`; `238e414` cerró además la variante por constructor. Reproducido por el reviewer: M1 y M2 rojas sin `TZ` |
| **O1** — tinta del icono y recetas tipográficas de nombre, fecha y texto vacío sin vigilar | **CERRADO** por D6, con sondas propias del reviewer |
| **O2** — el icono se cubría por conteo de cadenas en el fuente, no por árbol | **CERRADO**: `within(row).getByTestId('icon-syringe')` en R6 y en R8 |
| **O3** — el feedback `pressed` de R10 se autorizó de palabra, sin entrada firmada | **CERRADO**: D4 existe en `requirements.md` y el humano la firmó |

---

## Foco 1 — Reproducción del punto que decidía el veredicto

**Método**: `git worktree add --detach /tmp/rev70b 434f40c`, `node_modules`
enlazado, mutación plantada con `git checkout <rojo> -- format.ts`, y la suite
**completa** corrida como la corre el gate
(`TEST_CMD` de `init.config.sh:25` → `bun run --cwd mobile-pet-tracker test`),
con `env -u TZ`. Caja en **UTC** (`date +%Z` → `UTC`, `TZ` sin definir), y ni
`init.sh` ni `package.json` ni un `globalSetup` exportan zona alguna.
El árbol revisado **no se tocó**: `git status --porcelain` vacío antes y después,
worktree retirado con `git worktree remove`.

| Mutación | Commit rojo | `bun run test` sin `TZ` | Aserción que muerde |
|---|---|---|---|
| **M1** — `Math.ceil((Date.parse(date) - now.getTime()) / DAY_MS)` | `544a525` | **1 fallo / 1077 verdes** | `format.test.ts:47` `expect(dateParse).not.toHaveBeenCalled()` → recibió 2 llamadas con `"2026-09-15"` |
| **M2** — `new Date(date).toLocaleDateString(...)` | `75dd5c1` | **1 fallo / 1077 verdes** | `format.test.ts:75` `expect(dateConstructor.mock.calls).toEqual([[2026, 8, 15]])` → recibió `[["2026-09-15"]]` |

Coincide **exactamente** con lo que declara
`progress/impl_mobile-home-reminders-section.md` §Prueba de mutación R19b. El
criterio no negociable de D5 —rojo sin exportar `TZ` a mano— está cumplido.

## Foco 2 — ¿El mecanismo nuevo es más fuerte, o solo distinto?

**Más fuerte, y por bastante, pero no completo.**

Es **estrictamente** superior: el mecanismo viejo no mataba **nada** en la
invocación por defecto; el nuevo mata toda la familia
*cadena-cruda / `Date.parse` / constructor con string* en **cualquier** zona
horaria, porque no depende de la zona del runner sino de la forma de las
llamadas. `format.test.ts:48-53` fija además la secuencia exacta de `Date.UTC`
—`[[2026,8,15],[2026,8,10],[2026,8,15],[2026,8,10]]`—, lo que mata también las
variantes que cambian el orden de los operandos o el mes base.

**Pero existe una tercera variante que pasa los espías**, y el reviewer la
encontró y la ejecutó. Va en **O4**.

## Foco 3 — Los cuatro pares de mutación nuevos

Verificado par por par con git, sin fiarse del informe. `CHECKPOINTS.md` C4,
quinto punto: **la mutación tiene que estar en código de producción**.

| Par | Rojo / Verde | Fichero mutado | ¿Solo producción en el rojo? | `git diff --quiet <rojo>^ <verde> -- format.ts` |
|---|---|---|---|---|
| M1 reprueba | `c340d2b` / `0c133d1` | `screens/home/format.ts` | ✅ (el rojo toca **ese fichero y ninguno más**) | **0** |
| M2 reprueba | `4027286` / `03ab8bc` | `screens/home/format.ts` | ✅ | **0** |
| **M1 final** | `544a525` / `a50245e` | `screens/home/format.ts` | ✅ | **0** |
| **M2 final** | `75dd5c1` / `bcde085` | `screens/home/format.ts` | ✅ | **0** |

Además, el blob de `format.ts` en cada `<rojo>^` y en cada `<verde>` es
**idéntico** al de `434f40c`: no se coló deriva por el baile de mutaciones.

**Higiene mejorada respecto al primer pase**: allí `1ab9a89` mezclaba la
mutación con bookkeeping de `traceability.md`. Los cuatro rojos nuevos tocan
**un solo fichero de producción y nada más**.

**Orden TDD correcto**: el endurecimiento va **antes** que su prueba.
`5385ed8` (13:46) → reprueba M1/M2 → `238e414` (13:52:11, el candado extra del
constructor) → `544a525` (13:52:26, M1 final) → `75dd5c1` (M2 final). El candado
nunca se escribe después del rojo que dice matarlo.

## Foco 4 — D6: sondas propias, y el recuento de dimensiones

Las tres sondas de D6, ejecutadas por el reviewer sobre producción en el
worktree, corriendo `index.test.tsx`:

| Sonda | Resultado | Aserción que muerde |
|---|---|---|
| Cruzar `vaccineInk` ↔ `muted` en los dos `Syringe` (`index.tsx:541` y `:576`) | **2 fallos / 84 verdes** | `Expected "--color-category-blue-strong", Received "--color-muted"` (R6) y el inverso (R8) |
| Intercambiar las recetas de nombre y fecha (`index.tsx:546` ↔ `:552`) | **1 fallo / 85 verdes** | `Expected "text-sm font-semibold text-foreground", Received "text-xs font-normal text-muted"` |
| Cambiar la receta del texto vacío (`index.tsx:578`) | **1 fallo / 85 verdes** | `Expected "flex-1 text-sm font-normal text-muted"` |

Coincide con lo declarado. Las aserciones usan `toBe` sobre el `className`
**completo**, no `toContain`: es la forma fuerte.

### Las once dimensiones, revisitadas — y la que hace doce

| # | Decisión de la fila | ¿Vigilada? | Dónde |
|---|---|---|---|
| 1 | Dato mostrado (nombre / fecha / contador) | ✅ | `index.test.tsx:1924-1938` + negaciones cruzadas. M3 |
| 2 | Condición de render (fila / vacío / esqueleto / error) | ✅ | R6, R8, R9 |
| 3 | Cardinalidad del cuerpo | ✅ | `index.test.tsx:2068,2080,2092` sobre `.children`. M5 |
| 4 | Nombre accesible del contador, 3 ramas | ✅ | R11, R7 |
| 5 | Etiqueta / clave de copy | ✅ | R16 + `ui-copy-table.ts` |
| 6 | Color del disco (azul vs neutral) | ✅ | R12, igualdad exacta contra `CATEGORY_SLOTS`, en **las dos** ramas |
| 7 | Destino de navegación | ✅ | R10 + `appRoutes` + unicidad del literal. M6 |
| 8 | Receta del contador + `TABULAR_NUMS` | ✅ | R12. M8 |
| 9 | Componente de icono | ✅ **ahora por árbol** | `within(row).getByTestId('icon-syringe')` (R6 y R8) + conteo de fuente de R13 |
| 10 | **Tinta del icono** | ✅ **nuevo (D6)** | `index.test.tsx:1924` (fila) y `:1999` (vacío) |
| 11 | **Recetas de nombre, fecha y texto vacío** | ✅ **nuevo (D6)** | `index.test.tsx:1926-1930` (nombre, fecha) y `:2001-2003` (texto vacío) |
| 12 | **Forma de fila de la `Card` del estado vacío** | ❌ **NO** | ver **O5** |
| 13 | **El envoltorio `flex-1` que agrupa nombre y fecha** | ❌ **NO** | ver **O5** |

Nota de método: `icon.props.size` **sí** queda cubierto, aunque de refilón —
`index.test.tsx` no lo asserta, pero R13 exige exactamente **dos**
coincidencias de `/<Syringe\s+size=\{20\}/` en el fuente, así que cambiar
cualquiera de las dos pone la suite roja.

## Foco 5 — Regresión sobre lo ya aprobado

`git diff --stat 82a1cbd 434f40c` sobre `mobile-pet-tracker/`:

- **Cero cambios en producción.** `src/screens/home/index.tsx` y
  `src/screens/home/format.ts` son **byte-idénticos** a lo que se aprobó en el
  primer pase. Lo único que se movió son dos ficheros de test y documentación.
- `index.test.tsx`: **solo adiciones**, salvo una línea sustituida —
  `expect(within(empty).getByText('Sin vacuna próxima')).toBeVisible()` pasa a
  capturarse en `text` y a ganar la aserción de `className`. Estrictamente más
  fuerte.
- `format.test.ts`: las únicas líneas borradas son **exactamente** el andamiaje
  inerte de `process.env.TZ` que D5 mandaba borrar, más los dos `new Date(...)`
  inline reexpresados como `late` / `early`. Ningún assert perdido.
- **Cardinalidad de D1 intacta**: sigue contando
  `getByTestId('reminders-section-body').children` con `1` / `1` / `0`
  (`index.test.tsx:2068,2080,2092`), **nunca** coincidencias de `testID`.
- **Exclusión de comidas de R3 intacta**: `describe('#70 R3: la barra de comidas
  queda fuera')` (`index.test.tsx:2349`) no aparece en el diff del segundo pase.
- **Trazabilidad sin filas "pendiente"**; las filas R5, R6, R8, R19 y R19b se
  reescribieron para describir los candados reales y los pares **finales**
  `544a525`/`a50245e` y `75dd5c1`/`bcde085`.

## Foco 6 — Deriva

`git fetch origin`; HEAD local `434f40c` **==**
`origin/feature/70-mobile-home-reminders-section`; working tree limpio; 80
commits por delante de `origin/main`, 0 por detrás. **Lo revisado es exactamente
lo publicado.**

## Foco 7 — #83 / #84 no se colaron

`mobile-pet-tracker/src/utils/reminder-dates.ts` tiene el **mismo blob**
`587cbd6` en `b0ec5a8` (base), en `82a1cbd` (1er pase) y en `434f40c`. Ni
`index.tsx` ni `format.ts` lo importan ni llaman `daysUntil`; `format.ts` no
tiene ningún import. El `Math.ceil` defectuoso de
`src/utils/reminder-dates.ts:15` **no se reutilizó**.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`feature_list.json:1312`, #70)
- [x] `progress/current.md` describe la sesión activa y el segundo pase (`:23-29`)
- [x] Working tree limpio; `git status --porcelain` vacío

## Checklist C3 — Arquitectura

- [x] `backend-pet-tracker/`, `infra/` y `hosting/`: **0 ficheros** en el rango nuevo
- [x] El segundo pase no toca producción en absoluto: solo tests y documentación
- [x] `format.ts` sigue siendo puro, sin imports, con `now` como parámetro

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene test que lo nombra (verificado uno a uno en el 1er pase; R5, R6 y R8 revalidados aquí)
- [x] Historial test-primero: el candado (`5385ed8`, `238e414`) **precede** a su prueba de mutación (`544a525`, `75dd5c1`)
- [x] **Quinto punto (mutación de producción)**: los cuatro pares nuevos mutan `screens/home/format.ts` y **solo** eso; los cuatro revierten exacto (`git diff --quiet` → 0)
- [x] **M1 y M2 ponen la suite roja en la invocación del gate**, sin `TZ` — el bloqueante del 1er pase, reproducido y cerrado

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"**
- [x] Las filas tocadas describen los candados reales y los commits finales
- [x] Los 13 commits nuevos siguen `feat(mobile-home-reminders-section): <desc> (R-ids)`; la única excepción es `6eae6ed` ("spec aprovado"), que es la **firma del humano**

## Checklist C6 — Spec aprobada

- [x] `status: approved` en el frontmatter
- [x] `- [X] Aprobado por humano (fecha: 2026-09-08)` en §Aprobación
- [x] **D4, D5 y D6 existen en §Decisiones de implementación** y el bloque está
      firmado en `requirements.md:1106`, con la casilla volteada por el **humano**
      en `6eae6ed` (Alexis Sovera Mireles, 2026-09-09 05:58 -0600) — mismo
      mecanismo que `40413db` usó para D1-D3
- [x] Ningún requisito modificado tras la aprobación sin enmienda firmada

## Checklist C7 — Sin código huérfano

- [x] N/A — la feature no reemplaza nada. El único borrado del segundo pase es el
      andamiaje `process.env.TZ`, que D5 **ordena** borrar por documentar un
      mecanismo inexistente

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)

- [x] Producción sin cambios respecto al pase aprobado: grep-clean, escala de
      radios y `Skeleton` dimensionado siguen como se validaron
- [x] Feedback `pressed` del tappable, ahora **ratificado por escrito** (D4)
- [x] Tinta de icono y recetas tipográficas **vigiladas** (D6)
- [ ] Dimensiones 12 y 13 de la fila sin vigilar → **O5**, no bloqueante

---

# Hallazgos no bloqueantes

## O4 — Una tercera variante de zona horaria pasa los espías

**Clase**: el candado nuevo vigila el lado **del objetivo** (la cadena
`'YYYY-MM-DD'`) de forma impecable, pero **no el lado de `now`**.

`format.ts:6` normaliza el día local del dispositivo con getters locales:

```ts
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
```

Sustituirlos por sus equivalentes UTC produce una mutación —llamémosla **M9**—
que en una caja UTC hace **exactamente las mismas llamadas** a `Date.UTC`, con
los mismos componentes, y por tanto pasa las tres aserciones de espía:

```ts
const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
```

**Medido por el reviewer**, no razonado:

- con M9 plantada, `bun run test` sin `TZ` → **68/68 suites, 1078/1078 tests VERDES**;
- la misma M9 bajo `TZ=America/Mexico_City` → **rojo**, `Expected: 5, Received: 4`
  en `format.test.ts` — el desplazamiento de un día de #68, exacto.

Es decir: M9 **es** un bug de zona horaria real, viola la primera cláusula
normativa de R5 (*"WHEN el proceso corre en una zona horaria de offset negativo
… SHALL devolver el mismo número que devolvería en UTC"*), y el candado no lo ve
en la invocación del gate.

**Por qué no bloquea**: D5 fija un criterio de aceptación explícito —M1 y M2
rojas sin `TZ`— y está cumplido. M9 no la enumera ninguna decisión firmada, ni
la spec, ni el primer pase, ni el implementer. Es un hallazgo **nuevo** del
reviewer, de la misma clase que O1, que el humano prefirió tratar por enmienda.

**Arreglo, probado por el reviewer** (una constante y un `expect`, sin `TZ` y sin
tocar producción): pasar un `now` cuyo día **local** y día **UTC** difieran a
propósito, dentro del `it` de R5 de `format.test.ts`:

```ts
const skewed = {
  getFullYear: () => 2026, getMonth: () => 8, getDate: () => 10,
  getUTCFullYear: () => 2026, getUTCMonth: () => 8, getUTCDate: () => 11,
} as unknown as Date;
expect(calendarDaysUntil('2026-09-15', skewed)).toBe(5);
```

Verificado: con M9 plantada da **1 fallo / 5 verdes**
(`Expected: 5, Received: 4`); con producción limpia, **6/6 verdes**. Mata M9 en
cualquier zona horaria y no necesita exportar nada.

## O5 — Dimensiones 12 y 13 de la fila: la forma no está vigilada

Dos sondas del reviewer, cada una corrida sobre la **suite móvil completa**:

**O5-a — la `Card` del estado vacío puede perder su forma de fila.**
`index.tsx:571` lleva `className="flex-row items-center gap-3"`. Cambiarlo a
`className="gap-3"` —el icono pasaría a apilarse **encima** del texto— deja
**68/68 suites y 1078/1078 tests verdes**. R12 asserta `flex-row items-center
gap-3` sobre la fila cargada (`index.test.tsx:2227`) pero **no** sobre
`reminders-none-upcoming`, donde solo comprueba la receta compartida de `Card`.

Esto es notable porque R8 lo prescribe **literalmente**: *"la misma anatomía de
fila que R6 —disco de icono a la izquierda, texto a la derecha— para que la
sección **no cambie de forma** al vaciarse"*, y el propio test se llama
`it('dibuja un estado vacío con forma de fila cuando no hay vacuna')`. Es una
promesa del título que la aserción no respalda.

**O5-b — el envoltorio `flex-1` de nombre + fecha.**
`index.tsx:543`, el `<View className="flex-1">` que agrupa nombre y fecha y
empuja el contador a la derecha. Cambiarlo a `className="w-24"` deja también
**1078/1078 verdes**.

**Coste del arreglo**: una línea cada uno, con el patrón que R12 ya usa dos
líneas más arriba:

```ts
expect(emptyRow.props.className).toContain('flex-row items-center gap-3');
```

**Precedente**: es la tercera ronda seguida (#69, #71, ahora #70) en la que una
revisión de un elemento repetido destapa una dimensión más. La lección de
`decisiones-por-elemento-repetido` se confirma otra vez: **contar por hijos del
árbol, no por `testID`, y enumerar las decisiones de layout además de las de
color y texto**.

**Recomendación**: firmarlo como **D7** si se quiere cerrar dentro de #70, o
abrirlo con id propio junto a **#81**, que es el mismo defecto en el tile de
acciones rápidas.

---

## Gates humanos pendientes — ninguno lo puede cerrar una IA

De `specs/mobile-home-reminders-section/traceability.md:48-66`:

1. **Aprobación de la spec** — **CERRADO** (`40413db` para D1-D3, `6eae6ed` para
   D4-D6, ambos firmados por el humano).
2. **Prueba de humo en dev build de Android**, en los **dos temas**, con los
   cuatro escenarios — **ABIERTO**:
   - mascota **con** vacuna próxima: fila completa (icono, nombre, fecha
     localizada, contador `N d`);
   - mascota **sin** vacuna próxima: estado vacío de R8, con la sección
     conservando su altura;
   - enlace **"Ver todos"** pulsado: abre la lista de recordatorios y el botón
     "Nuevo" de esa pantalla sigue funcionando;
   - tile **"Recordatorio"** de #71 pulsado en la misma sesión: lleva al **alta**
     y no a la lista.

   La memoria del proyecto es explícita: **dev build de Android, no Expo Go**.
   Ojo al escenario 2: O5-a dice que si la forma de fila del estado vacío se
   rompiera, ningún test lo diría — el smoke es hoy la única red para eso.

3. **Merge del PR** a `main` — el leader abre el PR, el humano mergea
   (`docs/conventions.md` §Branches y Pull Requests).

**Tarea de cierre del leader, no gate**: `STATUS.md` sigue desactualizado
(66/81 declarado vs 66/84 real), por ids abiertos por el leader, no por esta
feature.

---

## Output de `./init.sh`

Ejecutado por el reviewer, **en primer plano**, desde
`/home/claude/sites/Pet-Tracker`, con `env -u FORCE_COLOR ./init.sh`.
Comprobado antes que no había ningún `init.sh` real corriendo. Log completo en
`/tmp/review70-pass2-init.log` (13 255 líneas).

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
⚠️  STATUS.md desactualizado (66/81 declarado vs 66/84 real)

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

Los avisos de `.env` y `STATUS.md` son los no bloqueantes de siempre del harness.
**La línea base roja conocida y ajena de #76** (`health-vaccines.e2e-spec.ts:497`)
**no apareció**: las 25 suites e2e pasaron enteras. No hubo nada que descontar.

## Sondas ejecutadas por el reviewer

Todas sobre worktree desechable (`git worktree add --detach /tmp/rev70b 434f40c`,
`node_modules` enlazado, retirado con `git worktree remove --force`). **El árbol
revisado no se modificó en ningún momento**; `git status --porcelain` vacío antes
y después.

```
# M1 (544a525) plantada, suite COMPLETA, env -u TZ  -> lo que corre el gate
Test Suites: 1 failed, 67 passed, 68 total
Tests:       1 failed, 1077 passed, 1078 total
  ● R5 › normaliza ambos días por componentes sin parsear la cadena cruda
    expect(jest.fn()).not.toHaveBeenCalled()   Received number of calls: 2
    1: "2026-09-15"   2: "2026-09-15"          (format.test.ts:47)

# M2 (75dd5c1) plantada, suite COMPLETA, env -u TZ
Test Suites: 1 failed, 67 passed, 68 total
Tests:       1 failed, 1077 passed, 1078 total
  ● R5 › formatea la fecha visible sin desplazarla
    - Expected [[2026, 8, 15]]   + Received [["2026-09-15"]]   (format.test.ts:75)

# M9 (getUTC* sobre `now`) plantada, suite COMPLETA, env -u TZ   -> O4
Test Suites: 68 passed, 68 total
Tests:       1078 passed, 1078 total            ← NO muerde
# la misma M9 con TZ=America/Mexico_City:  Expected: 5, Received: 4

# D6 tintas cruzadas (vaccineInk <-> muted)
Tests:       2 failed, 84 passed, 86 total

# D6 recetas de nombre y fecha intercambiadas
Tests:       1 failed, 85 passed, 86 total
# D6 receta del texto vacío cambiada
Tests:       1 failed, 85 passed, 86 total

# O5-a  estado vacío pierde 'flex-row items-center gap-3', suite COMPLETA
Tests:       1078 passed, 1078 total            ← NO muerde
# O5-b  envoltorio 'flex-1' -> 'w-24', suite COMPLETA
Tests:       1078 passed, 1078 total            ← NO muerde
```
