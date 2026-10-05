# review: mobile-map-gps-pill-battery (#116)

Fecha: 2026-10-05
Worktree: `/home/claude/sites/Pet-Tracker`
Branch: `feature/116-mobile-map-gps-pill-battery`, HEAD `0aeb47e3` (verificados `pwd`, branch y HEAD antes de empezar y de nuevo tras las sondas)
HEAD del handoff (H0): `a89aeaf0`. `origin/main`: `b2a9c2aa`, ancestro de HEAD.
Implementador: Codex CLI. Reporte: `progress/impl_mobile-map-gps-pill-battery.md`.
Veredicto: **APROBADO** (R1 a R11). R12, el smoke humano S1 a S6 en dev build de Android, sigue abierto y es del humano: la feature no puede pasar a `done` hasta que lo cierre.

> No ejecuté `./init.sh` ni la suite completa de jest ni e2e, por instrucción
> del leader: otra sesión comparte LocalStack y Postgres, y durante la revisión
> el Backend lanzó su propio `init.sh`. Leí el log del leader (citado al final)
> y ejecuté jest por fichero, `typecheck` y `lint`, todo sin pipe.

---

## Qué se revisó

Commits de `a89aeaf0..HEAD`, uno a uno con `git show --stat`:

| Commit | Tipo | Ficheros |
|---|---|---|
| `16b93ef8` test R1 rojo | Codex | solo `map/index.test.tsx` |
| `cb8b0e79` feat R1 | Codex | `i18n/catalog.ts`, `specs/mobile-ui-language/design.md` |
| `e3a47e38` CORRECCION 1 | leader | `progress/current.md`, handoff, `tasks.md` |
| `6ccb9ca9` CORRECCION 2 | leader | `progress/current.md`, handoff |
| `6fadb48b` test R2 R3 rojo | Codex | solo `map/index.test.tsx` |
| `f41e1b05` feat R2 R3 | Codex | solo `map/index.tsx` |
| `762c74c8` test R4 rojo | Codex | solo `map/index.test.tsx` |
| `4c10a90a` feat R4 | Codex | `pet-hero-header.tsx` (una línea), `map/index.tsx` |
| `1bd3159d` CORRECCION 3 | leader | `progress/current.md`, handoff, `tasks.md` |
| `2e0987d6` test R5 R6 R7 rojo | Codex | `map/index.test.tsx`, `consistency-classnames.test.ts`, `ui-copy-table.ts` |
| `2129e82a` feat R5 R6 R7 | Codex | solo `map/index.tsx` |
| `08d30121` test R8 (nace verde) | Codex | solo `map/index.test.tsx` |
| `0aeb47e3` docs | Codex | `impl_*.md`, `traceability.md` |

Ningún commit de test contiene producción. Ningún commit de Codex toca los tres
ficheros del leader.

Producción leída línea a línea en `src/screens/map/index.tsx`:
- La tabla `MAP_CONNECTION_TONE` (`none` y `unknown` muted, `offline` warning, `online` success).
- `gpsTone` desde `STATUS_TONE_CLASSES`, que ahora se exporta desde `pet-hero-header.tsx` en vez de duplicarse.
- `batteryPct`, que solo se lee de `detail.data.pet.device?.batteryPct ?? null` y con el detalle `ok`.
- El umbral `> 60` y la comparación estricta `=== null`, que no es una comprobación por falsedad.
- La píldora como primer hijo de `map-stats`, con 4 hijos en el orden de R4.
- El tile de batería con `TABULAR_NUMS` y el rótulo `t('pairing.battery')`.

Todo coincide con R2 a R7 al pie de la letra.

## C4: el rojo es real

Cada test rojo afirma un símbolo que la producción de su propio commit todavía no tenía. Lo medí con `git show <commit>:<ruta> | grep -c`:

| Commit rojo | Símbolo que afirma | Presencia en producción en ese commit |
|---|---|---|
| `16b93ef8` | `'map.live': 'GPS activo'` en el catálogo | 0 |
| `6fadb48b` | `map-pet-pill` | 0 |
| `762c74c8` | `map-pet-pill-dot` | 0 |
| `2e0987d6` | `stat-battery` | 0 |

El reporte de Codex guarda la salida de cada rojo (secciones `t1-red` a `t4-red`).

R8 nace verde, y la spec lo dice así: R8 termina en «Nace verde: exige sonda (tasks.md)». La sonda M13 de Codex está en el reporte, y yo la repetí (M13) con una segunda variante en otra zona (M13b).

## R11: las dos lecturas del alcance

R11 pide `git diff --name-only <HEAD del handoff>` ⊆ design §1.2, una lista cerrada de 9 ficheros.

**Lectura literal, sin filtrar** (`git diff --name-only a89aeaf0 HEAD`), exit 0, 12 ficheros:

```
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
progress/current.md
progress/handoff_mobile-map-gps-pill-battery.md
progress/impl_mobile-map-gps-pill-battery.md
specs/mobile-map-gps-pill-battery/tasks.md
specs/mobile-map-gps-pill-battery/traceability.md
specs/mobile-ui-language/design.md
```

**Lectura filtrada**: excluye los tres ficheros del leader, como fijan la CORRECCION 2 del handoff y la T6 corregida de `tasks.md`. Comando: `git diff --name-only a89aeaf0 HEAD -- . ':!specs/mobile-map-gps-pill-battery/tasks.md' ':!progress/handoff_mobile-map-gps-pill-battery.md' ':!progress/current.md'`. Exit 0, 9 ficheros, que son exactamente los de §1.2:

```
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
progress/impl_mobile-map-gps-pill-battery.md
specs/mobile-map-gps-pill-battery/traceability.md
specs/mobile-ui-language/design.md
```

**Aplico la lectura filtrada.** El paréntesis de R11 ya mide contra el HEAD del handoff porque el leader commitea fuera del alcance de Codex. Además, los tres ficheros sobrantes solo los tocan `e3a47e38`, `6ccb9ca9` y `1bd3159d`, que son del leader, y ningún commit de Codex. El texto de R11 no se enmendó (ver observación 1).

Resto de viñetas de R11, comprobadas literalmente:

| Comprobación | Resultado |
|---|---|
| `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` | vacío, exit 0 |
| `git diff --stat origin/main -- backend-pet-tracker/` | vacío, exit 0 |
| `git diff origin/main -- .../pet-hero-header.tsx` | una línea: `-const STATUS_TONE_CLASSES: Record<` pasa a `+export const STATUS_TONE_CLASSES: Record<` |
| `map/index.tsx`: hex, clases `[...]`, `StyleSheet.create`, `elevation`/`shadow*` | 0, 0, 0, 0 |
| `typecheck`, `lint` y `jest` entero sin pipe | ver la sección siguiente y el log de `init.sh` |

## Verificación independiente

Antes de cada typecheck comprobé `test ! -e .expo/types/router.d.ts` y dio `routerd=0`: el fichero no existe y no hubo nada que borrar. Antes de jest, `pgrep` no encontró ninguna otra ejecución de jest ni de `init.sh` en este worktree.

| Comando (desde `mobile-pet-tracker/`, sin pipe) | Resultado |
|---|---|
| `bunx jest --runTestsByPath` sobre 7 suites (mapa, `consistency-classnames`, `legibility-classnames`, `ui-language`, `design-drift`, `language-provider`, `pet-hero-header`), antes de las sondas | exit 0; 7/7 suites, **322/322** tests. El mapa tiene 94, la cifra prevista. |
| `bun run typecheck` | exit 0 (`$ tsc --noEmit`) |
| `bun run lint` | exit 0 (`$ expo lint`) |
| Mismo jest sobre el mapa, `consistency`, `legibility` y `ui-language`, después de las sondas, ya con el `init.sh` del Backend en marcha | exit 0; 4/4 suites, **204/204** tests |

Ninguna corrida sin mutar salió roja ni agotó tiempo, así que no hubo ningún rojo que pudiera deberse a la carga.

## Sondas de mutación

Cada sonda modifica el fichero en su sitio y se revierte con `git checkout HEAD -- <fichero>`. Tras cada reversión, `git diff --quiet && git diff --cached --quiet` dio 0. Al terminar, `git status --short` sale vacío y HEAD sigue en `0aeb47e3`.

Cómo leer la columna «Cómo cae»:
- **Aserción**: falla un `expect`.
- **Aserción vía waitFor**: el `waitFor` agota su espera porque el valor correcto no llega nunca. No es el timeout del `it`.
- **Consulta**: falla una consulta `getBy*`.

Ninguna sonda cayó por el timeout de jest.

| Sonda | Mutación (`map/index.tsx` salvo que se indique) | Its rojos | Cómo cae |
|---|---|---|---|
| M8 | `online: 'warning'` | R4 fila online | aserción (`bg-success` frente a `bg-warning-strong`) |
| M9 | `offline: 'muted'` | R4 fila offline | aserción |
| M9b | `none: 'warning'` | R4 fila sin collar | aserción |
| M9c | `unknown: 'success'` | R4 fila unknown | aserción |
| M10 | detalle no `ok` pasa al tono `success` | R4 filas pendiente y error | aserción |
| R4-tinta | tinta online `text-success` con el punto intacto | R4 fila online (clase del estado) | aserción |
| M11 | `accessibilityLabel={gps}` | R4, las 6 filas | aserción |
| R4-accessible | quitar `accessible` | R4 › agrupa la píldora… | aserción |
| R4-tabular | `style={TABULAR_NUMS}` en el estado | R4 › agrupa…, `#62 R15` del mapa, `#62 R15` de consistency (4 pasa a 5) | aserción |
| R4-orden | punto y estado intercambiados | R4 › fija cuatro hijos en orden | aserción |
| M6 | nombre de la píldora tomado del detalle | R3 › rotula el nombre de la lista (`Luna` frente a `Nala`) | aserción |
| R3-cacheKey | `cacheKey={undefined}` | R3 › pinta la foto… con su cacheKey | aserción |
| R3-size | `size={28}` | R3 › avatar de 24 y R3 › foto | aserción |
| R3-líneas | quitar `numberOfLines` del nombre | R3 › rotula el nombre… | aserción |
| **Z1 (zona ciega)** | `PetAvatar name="zz"` | **ninguno: sobrevive, 94/94** | ver observación 2 |
| **Z2 (zona ciega)** | `accessibilityLabel` con el nombre del detalle | **ninguno: sobrevive, 94/94** | ver observación 3 |
| R2-receta | quitar `shadow-sm` | R2 › receta exacta | aserción |
| R2-style | `style={CONTINUOUS_CORNER}` en la píldora | R2 › receta (`style` no `undefined`), `#62 R14` (4 pasa a 5), `#98 R10` (32 pasa a 33) | aserción |
| R2-orden | píldora detrás de la `Card` | R2 › hijo 0 de map-stats | aserción |
| M25 | píldora sin la guarda `selectedPet ?` | R2 › no pinta la píldora mientras… | aserción (`toBeNull`) |
| M16 | `>= 60` | R6 fila 60 | aserción |
| M17 | `> 61` | R6 fila 61 | aserción |
| M18 | texto `!batteryPct ? '—'` | R6 fila 0 | aserción vía waitFor |
| M18b | tono `!batteryPct ? 'muted'` | R6 fila 0 (clase) | aserción |
| M19 | tinta `> 60` en `text-success` | R6 filas 100, 82 y 61, R7 › lee del detalle, y `#61 R4` de legibility | aserción (ver observación 5) |
| M20 | quitar `TABULAR_NUMS` de `stat-battery` | `#62 R15` del mapa, `#62 R15` de consistency (4 pasa a 3) | aserción |
| M14 | `?? position?.battery` | R7 › sin collar, R7 › ignora la batería de la última posición | aserción |
| M15 | batería de `selectedPet.device` (la lista) | R6, las 6 filas; R7 › lee del detalle; R7 › poll | aserción vía waitFor |
| M26 | batería congelada en el primer valor (`useRef`) | R7 › repinta con el poll de 15 s (se queda en `82%` y no llega a `40%`) | aserción vía waitFor |
| M21 | rótulo `t('pairing.connection')` | R5 › tile en orden; `#94 R6` invertido; `#61 R11` › conserva los cuatro tiles (**consulta**: `getByText('Batería')`); `#65 R4` y `#65 R18` de ui-language | aserción, salvo el `#61 R11`, que cae por consulta |
| M23 | quinto tile con `stat-gps` | R5 › retira stat-gps; `#61 R11` › dos filas de dos; `#62 R14` (5); `#98 R10` (33) | aserción |
| R5-orden | rótulo antes que el valor | R5 › monta el tile… en ese orden | aserción |
| M13 | `import Animated from 'react-native-reanimated'` | R8 | aserción (`not.toContain`) |
| M13b (otra zona) | `Animated` de `react-native` en el punto, sin Reanimated | R8 | aserción (`not.toMatch(/\bAnimated\b/)`) |
| R1-en | `catalog.ts`: `'map.live': 'GPS on'` | R1 | aserción |
| R1-design | `specs/mobile-ui-language/design.md`: borrar `por #116` de la fila 198 | R1 | aserción (`toMatch`) |

Resultado: **36 sondas; 34 mueren y 2 sobreviven**. Las dos supervivientes están en la zona ciega que planté a propósito, y las dos quedan fuera de la tabla de tests que fija la spec.

Hay al menos una sonda por cada requisito con lógica: R1, R2, R3, R4, R5, R6, R7 y R8. Los requisitos de cláusula universal tienen una sonda por rama:
- R4: las 4 claves de `MAP_CONNECTION_TONE` y la rama de detalle no `ok`.
- R6: los dos lados del umbral y la fila 0.
- R7: pendiente y error se cubren con M10 y M18b; `device` nulo con M14; `batteryPct` nulo con M14; la fuente con M14 y M15; el poll con M26.

## Candados de catálogo compartidos, contra el copy y las clases de #116

- `language-provider.test.tsx`: #116 no añade claves (`map.live` cambia de valor). 22/22 verde y sin diff.
- `ui-copy-table.ts`: en `R4_MAP` la fila `pairing.connection` pasa a `pairing.battery`. M21 confirma que `#65 R4` y `#65 R18` (`checkUses(ALL_USES)`) ven el rótulo.
- `ui-language.test.ts` (`SCREEN_FILES`): no hay pantalla nueva, así que no cambia. 29/29 verde.
- `consistency-classnames.test.ts`:
  - `#62 R15`: el contador del mapa pasa a `3 + 1`.
  - `#69 R10`: la suma sube `+ 1`.
  - `#62 R14`: `CONTINUOUS_CORNER` del mapa sigue en 4, porque la cápsula usa `rounded-full` y no lleva esquina continua.
  - `#98 R10`: sigue en 32.
  - M20, R4-tabular, M23 y R2-style demuestran que los cuatro candados miran el mapa.
- `legibility-classnames.test.ts`: `text-accent-strong` literal en el mapa sigue en 2, y `text-warning-strong` literal en 0. Las tintas nuevas llegan a través de `STATUS_TONE_CLASSES` del héroe (ver observación 5).
- `design-drift.test.ts`: sin diff y 59/59 verde.
- `signOut` y `bg-accent-soft`: #116 no los toca. Grep del diff a 0.

---

## Checklist C2: estado coherente
- [x] Solo una feature `in_progress`: `feature_list.json` tiene únicamente #116 en `in_progress` (138 en `done` y 9 en `pending`).
- [x] `progress/current.md` describe la sesión, con las tres paradas de Codex y sus CORRECCIONES 1 a 3. Todavía no registra el cierre de Codex (observación 6). Le toca al leader al cerrar.

## Checklist C3: arquitectura
- [x] N/A en dominio e infraestructura: es solo la capa de presentación móvil. Cero diff en backend.
- [x] La pantalla reutiliza `STATUS_TONE_CLASSES` del componente `pet-hero-header` (export de una línea) y `PetAvatar`, en vez de duplicar recetas.
- [x] Ninguna dependencia nueva: `package.json` y `bun.lock` sin diff.

## Checklist C4: TDD
- [x] Cada requisito de R1 a R8 tiene al menos un `describe` que lo nombra (`#116 R1:` … `#116 R8:`). R9 y R10 están en los retítulos de `#94` y en los deltas de consistency y ui-copy-table, con su comentario `#116 R5`.
- [x] El historial muestra el test primero: cuatro pares rojo y verde, cada rojo sin producción y afirmando símbolos ausentes. R8 nace verde, declarado así en la spec, y queda cerrado con sondas (M13 de Codex; M13 y M13b mías).
- [x] Los tests afirman literales (clases, textos y `accessibilityLabel` escritos a mano) y nunca contra `STATUS_TONE_CLASSES` importado, así que no hay candados tautológicos. R6 no muestrea un continuo: usa los bordes 61 y 60, los extremos 100 y 0 y dos valores interiores.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas pendientes. La única aparición de «pendiente» está en el texto de R7 («detalle pendiente», el escenario de carga) y no marca una fila abierta.
- [x] Los 9 hashes (`16b93ef8`, `cb8b0e79`, `6fadb48b`, `f41e1b05`, `762c74c8`, `4c10a90a`, `2e0987d6`, `2129e82a`, `08d30121`) existen y son ancestros de HEAD (`git merge-base --is-ancestor`, exit 0 en los 9).
- [x] Los commits siguen `test|feat(mobile-map): #116 R<n> …`, el formato literal de `tasks.md`, en lugar del sufijo `(R-ids)` (observación 4).

## Checklist C6: spec aprobada
- [x] `requirements.md`: `status: approved` y casilla `[x] Spec aprobada por humano (fecha: 2026-10-04)`. Además, `[x] Enmienda #116 aprobada por humano (fecha: 2026-10-04)` en la enmienda de #94.
- [x] `requirements.md` y `design.md` no cambian desde el commit de firma `1e47c058` (`git log 1e47c058..HEAD` sobre ambos sale vacío). `tasks.md` sí cambió tras H0 (CORRECCIONES 1 y 3), pero son tareas, no requisitos.

## Checklist C7: sin código huérfano
- [x] El tile `stat-gps` desaparece de la producción del mapa (grep 0 fuera del test). Las dos apariciones que quedan en el test están dentro de R5 › `retira stat-gps del mapa`, como permite el handoff.
- [x] `pairing.connection` sigue en uso en `src/screens/pairing/index.tsx:432`, así que la clave no queda huérfana. `MAP_CONNECTION_LABEL_KEY` sigue en uso para la píldora.
- [x] Sus tests se migraron, no se borraron: 64 its históricos conservados y 30 nuevos (64 pasa a 94).

## Checklist C8: UI móvil (`docs/ui-guidelines.md`)
- [x] Grep-clean. Las líneas añadidas en `map/index.tsx`, `pet-hero-header.tsx` y `catalog.ts` tienen 0 hex, 0 clases `[...]`, 0 `StyleSheet.create` y 0 `elevation` o `shadow*`. `shadow-sm` es la utilidad de token que ya usa `card.tsx`, no una sombra heredada.
- [x] Tokens y modo oscuro. `bg-surface`, `border-border`, `text-foreground`, `bg-success`, `bg-warning-strong`, `text-warning-strong`, `bg-muted`, `text-muted` y `text-accent-strong` están definidos en `src/theme/global.css`, en claro y dentro de `@variant dark`.
- [x] Un solo acento: la tinta usa `text-accent-strong` y el relleno del punto `bg-success`. No queda `text-success` suelto en el mapa (grep 0).
- [x] Dimensiones: la píldora vive en el overlay que ya existía (`bottom: insets.bottom + 96`), sin geometría nueva.
- [x] Skeleton: N/A. No hay estado de carga nuevo; el `—` lo prescribe R7.
- [x] Componentes compartidos reutilizados: `PetAvatar` y `STATUS_TONE_CLASSES`. No hay fork local.
- [x] Tappables: N/A. La píldora no se puede pulsar.
- [x] Animaciones: ninguna nueva. R8 lo bloquea y M13 y M13b lo confirman.
- [x] Copy en es y en: `map.live` vale `GPS activo` y `GPS active`; `pairing.battery` vale `Batería` y `Battery`. La fila 198 de `specs/mobile-ui-language/design.md` está actualizada y R1-design comprueba que el test la vigila.

---

## Observaciones: ninguna bloquea

**1. BAJA, no bloqueante. El texto de R11 no se enmendó para excluir los commits del leader.** Leída al pie de la letra, `git diff --name-only a89aeaf0 HEAD` da 12 ficheros y no cabe en la lista de 9. Los tres que sobran (`progress/current.md`, el handoff y `tasks.md`) los tocan solo las CORRECCIONES del leader. La CORRECCION 2 y la T6 corregida fijan la lectura filtrada, y con ella la lista coincide exacta. Para la próxima spec propongo que R11 diga «excluidos los commits del leader posteriores al handoff» y no lo deje solo en `tasks.md`.

**2. BAJA, no bloqueante. Zona ciega Z1: la prop `name` de `PetAvatar` no está bloqueada.** R3 dice que el avatar recibe `name`, `photoUrl` y `cacheKey` de `selectedPet`. La tabla de tests de R3 solo afirma `testID`, `width`/`height`, `source` y `style`, así que `name="zz"` deja 94/94 en verde. La producción es correcta: `name={selectedPet.name}`. El hueco está en la spec, no en Codex, porque añadir un `it` habría roto el recuento cerrado de +30. La consecuencia de una regresión sería visible: el blobatar de la píldora dejaría de coincidir con el del héroe para la misma mascota. Si se cubre en una feature futura, debe compararse contra un literal o contra el `xml` del avatar del héroe, no contra `blobatar()` importado, para no crear un candado tautológico.

**3. BAJA, no bloqueante. Zona ciega Z2: no está bloqueado de dónde sale el nombre del `accessibilityLabel`.** Las 6 filas de R4 usan `Luna` tanto en la lista como en el detalle. Por eso, si la etiqueta toma el nombre del detalle, la suite sigue en 94/94. El único it de R3 que separa los dos nombres (`Luna` en la lista y `Nala` en el detalle) no mira la etiqueta. La producción es correcta: `` `${selectedPet.name}, ${gps}` ``. Basta añadir una fila con el detalle en `Nala`.

**4. INFORMATIVA. Formato de los commits.** Los commits usan `test(mobile-map): #116 R<n> …` y `feat(mobile-map): #116 R<n> …`, los mensajes literales de `tasks.md`, en vez del sufijo `(R-ids)` de `docs/conventions.md`. Los R-ids están, y en el mismo sitio que en las revisiones anteriores.

**5. INFORMATIVA. Los candados de legibilidad no ven las tintas que llegan por constante importada.** En M19, el rojo de `#61 R4` es un artefacto: contó el literal `"text-accent-strong"` que la propia mutación escribe en su comparación, no el `text-success`. Las tintas nuevas del mapa (la píldora y la batería) llegan a través de `STATUS_TONE_CLASSES` del héroe, que los candados por grep del mapa no ven. Aquí no importa, porque las suites del mapa afirman las clases literales y M19 cae en 4 its. Pero ningún candado global impide que `text-success` aparezca suelto como tinta. Esto enlaza con la nota de `current.md` sobre `collar-battery` de la Home (`text-success` por encima del 60 %, con un contraste aproximado de 3,31:1). Queda fuera del alcance de #116.

**6. INFORMATIVA. `progress/current.md` todavía no registra el final de Codex.** El reporte y la trazabilidad están en `0aeb47e3`. Es contabilidad de cierre del leader.

**7. INFORMATIVA. Skills de Codex.** El reporte registra `building-native-ui` (el nombre del catálogo de Codex, v1.0.2), `appllama-app-design-skill` y `animate-expo`, que son los nombres del handoff. En esta feature no se repite el silencio de B5.

**8. INFORMATIVA. El aviso «worker process has failed to exit gracefully».** Apareció en el jest completo de Codex, con exit 0. Ya estaba documentado como preexistente en `review_mobile-alert-detail-screen.md` (observación 4), y el log de `init.sh` del leader también cierra con exit 0.

**9. INFORMATIVA. Carga de la máquina.** Mientras corrían mis sondas, la sesión Backend lanzó su `init.sh`. Las dos corridas sin mutar (322/322 antes y 204/204 después) salieron verdes, y ninguna sonda murió por el timeout del `it`. Las cuatro que mueren vía `waitFor` (M18, M15, M26 y la parte de M21 que cae por consulta) fallan porque el valor correcto no llega nunca, no por falta de tiempo.

**10. Gate humano abierto: R12.** El smoke S1 a S6 en dev build de Android lo cierra el humano. Las casillas siguen sin marcar, como se esperaba, y no es motivo de rechazo. La feature no puede pasar a `done` hasta que el humano cierre R12.

---

## Output de ./init.sh

No lo ejecuté yo (instrucción del leader: hay otra sesión sobre el mismo LocalStack y Postgres). Leí el log del leader en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/ca371cbf-0293-48e8-a0e6-dc27b30ff202/scratchpad/init_116.log`, de 24 920 líneas, capturado sin pipe.

Líneas 1 y 2:
```
head=0aeb47e33b9b5a982564752ce3e252c28ff4534f
start=2026-10-05T15:16:07Z
```

Últimas tres líneas:
```
exit=0
head_end=0aeb47e33b9b5a982564752ce3e252c28ff4534f
end=2026-10-05T15:22:05Z
```

El HEAD de inicio y el de fin coinciden con el HEAD revisado, `0aeb47e3`. Resúmenes intermedios:
```
L220-221  backend unit:  Test Suites: 176 passed, 176 total | Tests: 1348 passed, 1348 total
L233-234  infra:         Test Suites: 2 passed, 2 total     | Tests: 14 passed, 14 total
L24573-5  mobile jest:   Test Suites: 93 passed, 93 total   | Tests: 2037 passed, 2037 total | Snapshots: 1 passed, 1 total
L24887-8  e2e:           Test Suites: 3 skipped, 29 passed, 29 of 32 total | Tests: 8 skipped, 438 passed, 446 total
L24904    Lint sin errores
L24908    Typecheck sin errores
L24911    Todo verde. Listo para trabajar.
```

La cifra de jest móvil, 93 suites y 2037 tests, coincide con el jest completo del reporte de Codex.

## Veredicto

**APROBADO** para R1 a R11. El código, el alcance, el orden de los commits y la trazabilidad cumplen la spec firmada. 34 de 36 sondas mueren, y las 2 que sobreviven quedan fuera de la tabla de tests de la spec (observaciones 2 y 3). R12 lo cierra el humano.
