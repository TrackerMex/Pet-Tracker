# review: mobile-home-reminders-section (#70) — TERCER PASE

Fecha: 2026-09-09
Reviewer: subagente `reviewer` (Claude Opus 5)
Rango nuevo revisado: `4e4efdd..HEAD` (7 commits; el encargo citaba `a62fe67..HEAD`,
pero **`232c38b` —el commit que implementa D7— queda fuera de ese rango**, así que
la revisión se amplió hasta la firma humana `4e4efdd`)
Branch: `feature/70-mobile-home-reminders-section`, HEAD `d8535f2`

## Veredicto: **APROBADO**

D7 se cierra. El criterio que la decidía —**M9 roja con la suite completa y `TZ`
sin definir**— lo reprodujo el reviewer en worktree desechable: **1 fallo / 1077
verdes**, `format.test.ts:53`, `Expected: 5, Received: 4`. Las dos sondas de O5
muerden ahora donde antes dejaban 1078/1078 verdes. Producción **byte-idéntica**
en todo el rango. `env -u FORCE_COLOR ./init.sh` **exit 0**, corrido por el
reviewer en primer plano.

Queda **un hallazgo nuevo no bloqueante (O6)**: la decimocuarta dimensión de la
fila, encontrada y medida en esta ronda. No bloquea por la misma razón que O4/O5
no bloquearon en el segundo pase: el criterio de aceptación firmado se cumple al
pie de la letra, y rechazar por un defecto que el propio reviewer acaba de
inventar sería mover la portería.

---

## Las tres rondas, en corto

| Pase | HEAD | Veredicto | Qué lo decidió |
|---|---|---|---|
| **1º** | `82a1cbd` | **RECHAZADO** | **B1**: los candados de zona horaria de R5 eran **inertes** — `process.env.TZ` asignado dentro de un `it` no llega a V8 bajo Jest, así que M1 y M2 dejaban el gate **verde**. El defecto de #68 podía reintroducirse sin un test rojo. Más O1-O3 no bloqueantes |
| **2º** | `434f40c` | **APROBADO** | B1 cerrado por D5: fuera el andamiaje inerte, dentro los espías de `Date.parse`/`Date.UTC`/constructor. Reproducido: M1 y M2 rojas **sin `TZ`**, 1 fallo/1077 verdes cada una. O1-O3 cerrados por D4/D6. Abiertos **O4** y **O5**, con reproducción y arreglo ya probados por el reviewer |
| **3º** | `d8535f2` | **APROBADO** | D7 (firmada por el humano) mete O4 y O5 en alcance, solo con cambios de test. Los tres criterios reproducidos abajo. Nuevo: **O6** |

---

## Foco 1 — M9, el criterio que decidía el veredicto

**Método**: `git worktree add --detach /tmp/rev70c HEAD`, `node_modules`
enlazado, mutación plantada con `git checkout 9adea68 -- format.ts`, suite
**completa** como la corre el gate (`init.config.sh:25` → `bun run --cwd
mobile-pet-tracker test`), invocada con `env -u TZ -u FORCE_COLOR`. Caja en
**UTC**, `TZ` sin definir antes y durante. El árbol revisado no se tocó.

```
Test Suites: 1 failed, 67 passed, 68 total
Tests:       1 failed, 1077 passed, 1078 total

● #70 R4 › #70 R5: la zona horaria no desplaza fechas
  › normaliza ambos días por componentes sin parsear la cadena cruda
    expect(received).toBe(expected)
    Expected: 5
    Received: 4
    > 53 |  expect(calendarDaysUntil('2026-09-15', skewed)).toBe(5);
    at Object.toBe (src/screens/home/format.test.ts:53:57)
```

**Coincide exactamente** con lo que declara el implementer. D7 exigía que el
rojo saliera sin exportar `TZ` y que si no salía así **se parase**: sale.

## Foco 2 — Mi propio arreglo de O4: ¿equivalente, o debilitado?

**Equivalente en el `now` sintético, y estrictamente más fuerte en el resto.**

`format.test.ts:31-38` es literalmente la constante que dicté en D7, sin recortes:
día local 10 (`getDate: () => 10`) contra día UTC 11 (`getUTCDate: () => 11`).
La divergencia es **real y por construcción**: no es un `Date` de verdad, es un
objeto con getters fijos, así que el sesgo de un día no depende de la zona del
runner — por eso mata M9 sin exportar nada.

- Producción limpia (getters locales) → `Date.UTC(2026,8,10)`; `15 − 10 = 5` ✅
- Con M9 (getters UTC) → `Date.UTC(2026,8,11)`; `15 − 11 = 4` ✅ rojo

**Las llamadas esperadas a `Date.UTC` NO se relajaron: se ampliaron.**
`format.test.ts:57-64` pasa de cuatro pares a **seis**, añadiendo
`[2026, 8, 15]` y `[2026, 8, 10]` — los componentes **locales**. Con M9 el
segundo par sería `[2026, 8, 11]` y también rompería. Es decir, M9 queda muerta
por **dos** aserciones independientes (el valor en `:53` y la lista en `:57`);
solo se ve una en el output porque el `expect` de `:53` corta primero. Un
relajamiento habría sido dejar la lista en cuatro pares o cambiarla a
`toContainEqual`; no ocurre ninguna de las dos.

`git diff --numstat 434f40c..HEAD -- mobile-pet-tracker/` → **11 y 2
inserciones, cero deleciones**. Nada de lo aprobado se tocó.

## Foco 3 — Las dos sondas de O5

Ejecutadas por el reviewer sobre producción en el worktree, restaurando con
`git checkout HEAD --` después de cada una.

| Sonda | 2º pase | 3er pase | Aserción que muerde |
|---|---|---|---|
| **O5-a** `index.tsx:571`, la `Card` del estado vacío pierde `flex-row items-center gap-3` | **1078/1078 verdes** ← no mordía | **1 fallo / 85 verdes** | `index.test.tsx:1998` `Expected substring: "flex-row items-center gap-3"` / `Received: "rounded-card border border-border bg-surface p-4 shadow-sm gap-3"` (R8) |
| **O5-b** `index.tsx:543`, el envoltorio `flex-1` → `w-24` | **1078/1078 verdes** ← no mordía | **1 fallo / 85 verdes** | `index.test.tsx:2229` `Expected path: "props.className"` / `Expected value: "flex-1"` / `Received value: "w-24"` (R12) |

Coincide con lo declarado. Dos apuntes a favor del implementer:

- **O5-b salió más fuerte que lo que pedí**. Yo sugerí un `toContain` sobre el
  envoltorio; se escribió
  `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`, que fija
  **igualdad exacta y posición**. De rebote cierra el orden superior de la fila:
  el contador ya no puede colocarse en las posiciones 0 ni 1 sin romper
  `:2223`/`:2229`.
- En el estado vacío, el orden ya estaba cerrado de refilón: `row.children[0]`
  se compara `toBe` contra la receta del disco (`:2258`), así que intercambiar
  disco y texto también rompe.

## Foco 4 — Producción intacta

`git diff a62fe67..HEAD -- index.tsx format.ts` → **vacío**. Y ampliando al
rango real, el blob de los dos ficheros es **el mismo en los seis puntos**:

```
434f40c 30eda5b 4e4efdd 232c38b a62fe67 HEAD
index.tsx  = 33dd8ec4  (idéntico en los seis)
format.ts  = 15c0226a  (idéntico en los seis)
```

`git diff --stat 434f40c..HEAD -- mobile-pet-tracker/` toca **solo dos ficheros
de test**. **Ninguna sonda quedó versionada**: `232c38b` añade aserciones y nada
más; `git status --porcelain` vacío antes y después de las cuatro sondas.

## Foco 5 — El par M9

`CHECKPOINTS.md` C4, quinto punto: la mutación tiene que estar en código de
producción y el par tiene que restaurar exacto.

| Comprobación | Resultado |
|---|---|
| Ficheros del rojo `9adea68` | **`screens/home/format.ts` y ninguno más** ✅ |
| La mutación es la de D7 | ✅ `now.getFullYear/getMonth/getDate` → `getUTCFullYear/getUTCMonth/getUTCDate` |
| `git diff --quiet 9adea68^ 4140c2c -- format.ts` | **exit 0** ✅ |
| Blob en `9adea68^` y en `4140c2c` | `15c0226a` = el de HEAD ✅ sin deriva |
| Orden TDD | ✅ el candado `232c38b` (14:49) **precede** al rojo `9adea68` (14:57) |

## Foco 6 — Regresión sobre lo ya aprobado

Con **cero deleciones** en el rango, nada pudo debilitarse. Verificado punto por
punto de todos modos:

- **Cardinalidad de D1**: intacta. Sigue contando
  `getByTestId('reminders-section-body').children` con `1`/`1`/`0`
  (`index.test.tsx:2069,2081,2093`), nunca coincidencias de `testID`.
- **Exclusión de comidas de R3**: `describe('#70 R3: la barra de comidas queda
  fuera')` no aparece en el diff del tercer pase.
- **Tintas y recetas de D6**: `icon.props.color` (`:2000`) y las recetas `toBe`
  de nombre, fecha y texto vacío (`:2002-2004` y las de R6) sin tocar.
- **Espías de D5**: `format.test.ts:55-56`
  (`dateConstructor`/`dateParse` `not.toHaveBeenCalled()`) y `:86-87`
  intactos. La única línea modificada del bloque es la **ampliación** de
  `dateUtc.mock.calls`.
- **Nivel de sección**: `body.props.className` `toBe('gap-2')` (`:1902`) y el
  orden cabecera/cuerpo (`:1895-1896`) siguen cerrados.

## Foco 7 — Cuarta ronda de dimensiones: aparece la decimocuarta

Recorrida la tabla con las 13 entradas. **12 y 13 quedan cerradas** por D7
(O5-a → `index.test.tsx:1998`; O5-b → `:2229`). Pero aparece una más, medida y
confirmada: va como **O6**.

| # | Decisión de la fila | ¿Vigilada? | Dónde |
|---|---|---|---|
| 1 | Dato mostrado (nombre / fecha / contador) | ✅ | R6 + negaciones cruzadas. M3 |
| 2 | Condición de render (fila / vacío / esqueleto / error) | ✅ | R6, R8, R9 |
| 3 | Cardinalidad del cuerpo | ✅ | `:2069,2081,2093` sobre `.children`. M5 |
| 4 | Nombre accesible del contador, 3 ramas | ✅ | R11, R7 |
| 5 | Etiqueta / clave de copy | ✅ | R16 + `ui-copy-table.ts` |
| 6 | Color del disco, ambas ramas | ✅ | R12 `:2232` y `:2258`, igualdad exacta |
| 7 | Destino de navegación | ✅ | R10 + `appRoutes` + unicidad. M6 |
| 8 | Receta del contador + `TABULAR_NUMS` | ✅ | R12 `:2236-2239`. M8 |
| 9 | Componente de icono | ✅ | `within(row).getByTestId('icon-syringe')` (R6, R8) + R13 |
| 10 | Tinta del icono | ✅ D6 | `:1924` (fila), `:2000` (vacío) |
| 11 | Recetas de nombre, fecha y texto vacío | ✅ D6 | `:1926-1930`, `:2002-2004` |
| 12 | **Forma de fila de la `Card` del estado vacío** | ✅ **cerrada (D7)** | `index.test.tsx:1998` |
| 13 | **El envoltorio `flex-1` de nombre + fecha** | ✅ **cerrada (D7)** | `index.test.tsx:2229` |
| 14 | **Orden vertical de nombre y fecha dentro del envoltorio** | ❌ **NO** | ver **O6** |

---

# Hallazgo no bloqueante

## O6 — El orden vertical de nombre y fecha no está vigilado

**Clase**: la misma de O1 y O5 — una decisión de layout de un elemento repetido
que ninguna aserción mira. D7 cerró el envoltorio; no cerró **el orden de sus
hijos**.

`index.tsx:543-556`: dentro del `<View className="flex-1">` van el nombre
(`text-sm font-semibold text-foreground`) y **debajo** la fecha
(`text-xs font-normal text-muted`). Intercambiar los dos bloques `<Text>`
enteros —testID y `className` viajando **juntos** con su bloque— deja la suite
verde:

```
# bloques Text de nombre (544-549) y fecha (550-555) intercambiados
Test Suites: 1 passed, 1 total
Tests:       86 passed, 86 total          ← NO muerde
```

Medido por el reviewer, no razonado. La fecha pasaría a dibujarse **encima** del
nombre y ningún test lo diría.

**Por qué se escapa**: todas las aserciones llegan al nombre y a la fecha por
`within(row).getByTestId(...)`, que es **agnóstico al orden**. D6 cerró el caso
en que las *recetas* se cruzan pero los `testID` se quedan quietos; mover los
bloques completos no cruza ninguna receta. Nótese el contraste con el estado
vacío, donde el orden **sí** queda cerrado porque `row.children[0]` se compara
contra la receta del disco (`:2251,2258`).

**Arreglo, una línea**, con el patrón que D7 acaba de introducir dos líneas más
arriba:

```ts
const wrapper = row.children[1];
expect(wrapper.props.children[0].props.testID).toBe('reminders-next-vaccine-name');
```

o, más en la línea de `:2229`:
`expect(wrapper.children[0]).toHaveProperty('props.testID', 'reminders-next-vaccine-name')`.

**Por qué no bloquea**: D7 fija un criterio de aceptación explícito —M9 roja sin
`TZ`, y una sonda por cada una de las dos dimensiones de O5— y está cumplido
entero. O6 no lo enumera ninguna decisión firmada. Es un hallazgo **nuevo** del
reviewer, de la misma clase que O1 y O5.

**Precedente, y la lección que ya toca escribir**: es la **cuarta** ronda
seguida (#69, #71, #70 2º pase, #70 3er pase) en la que revisar un elemento
repetido destapa **exactamente una** dimensión más. El patrón es estable y
predecible: cada ronda cierra la dimensión que la anterior encontró y descubre
la siguiente por el mismo mecanismo —*consultar por `testID` en vez de por
posición en el árbol*—. La memoria `decisiones-por-elemento-repetido` dice
«contar por hijos, no por `testID`»; el corolario que falta es **enumerar
también el orden de los hijos, no solo su presencia y sus recetas**. Mientras la
enumeración se haga a ojo, la quinta ronda encontrará una decimoquinta.

**Recomendación**: no reabrir #70 por esto. Anotarlo en **#81** (el mismo defecto
en el tile de acciones rápidas, ya abierto) o darle id propio, y meter la regla
de orden en `docs/ui-guidelines.md` para que deje de aparecer una por ronda.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (#70)
- [x] `progress/current.md` actualizado con el tercer pase
- [x] Working tree limpio; `git status --porcelain` vacío antes y después del gate
- [x] HEAD local `d8535f2` **==** `origin/feature/70-mobile-home-reminders-section`; 89 por delante de `origin/main`, **0 por detrás**. Lo revisado es lo publicado

## Checklist C3 — Arquitectura

- [x] `backend-pet-tracker/`, `infra/` y `hosting/`: **0 ficheros** en el rango
- [x] El tercer pase **no toca producción**: dos ficheros de test y documentación
- [x] `format.ts` sigue puro, sin imports, con `now` como parámetro

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene test que lo nombra (R5, R8 y R12 revalidados aquí)
- [x] Historial test-primero: el candado `232c38b` **precede** al rojo `9adea68`
- [x] **Quinto punto (mutación de producción)**: M9 muta `screens/home/format.ts` y **solo** eso; `git diff --quiet 9adea68^ 4140c2c` → **0**
- [x] **M9 pone la suite roja en la invocación del gate, sin `TZ`** — reproducido por el reviewer

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"** (la única coincidencia de la palabra es la regla del pie, `:42`)
- [x] R5, R8, R12, R19 y R19b reescritas para describir los candados D7; R19b pasa a **nueve** mutaciones y enumera `9adea68`/`4140c2c`
- [x] Los 7 commits nuevos siguen `feat|docs(mobile-home-reminders-section): <desc> (R-ids)`; la única excepción es `4e4efdd` ("Approve Mobile Reminders Section Spec"), que es la **firma del humano**

## Checklist C6 — Spec aprobada

- [x] `status: approved` en el frontmatter
- [x] `- [X] Aprobado por humano (fecha: 2026-09-08)` en §Aprobación
- [x] **D7 existe** (`requirements.md:1109`) y su casilla está firmada en `4e4efdd`, autoría **`AlexisSM377 <al222111377@gmail.com>`**, 2026-09-09 08:38 -0600, tocando **un solo fichero y una sola línea** (el volteo de la casilla). Mismo mecanismo que `40413db` (D1-D3) y `6eae6ed` (D4-D6)
- [x] Lo implementado **no excede** lo que D7 autoriza: «nada de producción, ningún requisito de conducta, ningún otro candado»

## Checklist C7 — Sin código huérfano

- [x] N/A — la feature no reemplaza nada; el tercer pase solo añade aserciones

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)

- [x] Producción byte-idéntica a lo aprobado en el segundo pase
- [x] Dimensiones 12 y 13 **vigiladas** (D7)
- [ ] Dimensión 14 sin vigilar → **O6**, no bloqueante

---

## Gates humanos pendientes — ninguno lo puede cerrar una IA

1. **Aprobación de la spec** — **CERRADO** (`40413db` D1-D3, `6eae6ed` D4-D6, `4e4efdd` D7).
2. **Prueba de humo en dev build de Android** — **ABIERTO**. En los **dos temas**,
   con los cuatro escenarios:
   - mascota **con** vacuna próxima: fila completa (icono, nombre, fecha
     localizada, contador `N d`), **con el nombre arriba y la fecha debajo** —
     O6 dice que si ese orden se invirtiera, ningún test lo diría;
   - mascota **sin** vacuna próxima: estado vacío de R8, la sección conservando
     su altura y el icono **a la izquierda** del texto;
   - enlace **"Ver todos"**: abre la lista de recordatorios, y el botón "Nuevo"
     de esa pantalla sigue funcionando;
   - tile **"Recordatorio"** de #71 en la misma sesión: lleva al **alta**, no a
     la lista.

   Memoria del proyecto, explícita: **dev build de Android, no Expo Go**.
3. **Merge del PR** a `main` — el leader abre el PR, el humano mergea
   (`docs/conventions.md` §Branches y Pull Requests).

**Tareas de cierre del leader, no gates**: `STATUS.md` sigue desactualizado
(66/81 declarado vs 66/84 real), por ids abiertos por el leader, no por esta
feature; y marcar `status: "done"` en `feature_list.json` **solo tras el smoke**.

---

## Output de `./init.sh`

Ejecutado por el reviewer **en primer plano**, desde
`/home/claude/sites/Pet-Tracker`, con `env -u FORCE_COLOR ./init.sh`. Comprobado
antes con `ps` que no había ningún `init.sh` real ni ningún runner de tests
activo (el Postgres de docker es compartido entre worktrees). Log completo en
`/tmp/review70-pass3-init.log`, 13 255 líneas.

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

`grep -cE "^FAIL|✕"` sobre el log → **0**. Los avisos de `.env` y `STATUS.md` son
los no bloqueantes de siempre del harness. **La base roja conocida y ajena de #76**
(`health-vaccines.e2e-spec.ts:497`) **no apareció**: las 25 suites e2e pasaron
enteras, no hubo nada que descontar.

## Sondas ejecutadas por el reviewer

Todas sobre worktree desechable (`git worktree add --detach /tmp/rev70c HEAD`,
`node_modules` enlazado, retirado con `git worktree remove --force`). El árbol
revisado **no se modificó en ningún momento**; `git status --porcelain` vacío
antes y después de cada una.

```
# M9 (9adea68) plantada, suite COMPLETA, env -u TZ   -> el criterio de D7
Test Suites: 1 failed, 67 passed, 68 total
Tests:       1 failed, 1077 passed, 1078 total
  ● R5 › normaliza ambos días por componentes sin parsear la cadena cruda
    Expected: 5   Received: 4        (format.test.ts:53)   ← MUERDE

# O5-a  estado vacío pierde 'flex-row items-center gap-3'  (index.tsx:571)
Tests:       1 failed, 85 passed, 86 total
    Expected substring: "flex-row items-center gap-3"
    Received string: "rounded-card border border-border bg-surface p-4 shadow-sm gap-3"
                                     (index.test.tsx:1998)  ← MUERDE

# O5-b  envoltorio 'flex-1' -> 'w-24'  (index.tsx:543)
Tests:       1 failed, 85 passed, 86 total
    Expected value: "flex-1"   Received value: "w-24"
                                     (index.test.tsx:2229)  ← MUERDE

# O6  bloques Text de nombre (544-549) y fecha (550-555) intercambiados
Test Suites: 1 passed, 1 total
Tests:       86 passed, 86 total                            ← NO muerde
```

Las tres primeras son las que D7 exigía y las tres muerden. La cuarta es del
reviewer y es el hallazgo O6.
