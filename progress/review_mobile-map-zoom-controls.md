# review: mobile-map-zoom-controls (#55)

Fecha: 2026-09-01
Branch: `feature/mobile-map-zoom-controls` — commits `e052b07..0b96ca1` sobre `f36b152`
Veredicto: **APROBADO — con alcance limitado**

> **Alcance limitado, y no es una formalidad.** Lo que apruebo es el código, la
> contención del diff y la documentación. **R3 no lo cierro yo ni puede
> cerrarlo ninguna IA**: es un smoke en dev build de Android que exige un
> dispositivo real. Y hay una razón técnica encima de la operativa:
> `pet-map.test.tsx` mockea `expo-maps` con un `View` stub, así que el verde de
> R1 prueba **únicamente que la prop `uiSettings` viaja hasta la vista**. **No
> prueba** que los botones `+` / `−` dejen de dibujarse, ni que el pinch-to-zoom
> siga acercando y alejando. La feature **no puede marcarse `done` con mi
> aprobación sola.**

---

## Qué se revisó

Cinco commits, verificados uno a uno con `git show --stat`:

| Commit | Archivos que toca |
|---|---|
| `e052b07 test(map): require hidden zoom controls (R1)` | solo `src/components/__tests__/pet-map.test.tsx` (+18) — **cero líneas de producción** |
| `bf14baf fix(map): hide native zoom controls (R1)` | solo `src/components/pet-map.tsx` (+1) |
| `5b511e2 docs(map): record zoom controls traceability (R1)` | solo `specs/mobile-map-zoom-controls/traceability.md` |
| `6963758 docs(map): document zoom controls smoke (R2)` | `docs/verification.md`, `progress/impl_mobile-map-zoom-controls.md` |
| `0b96ca1 docs(map): record verified implementation (R2)` | `progress/impl_...md`, `traceability.md` |

El cambio de producción es **exactamente** la línea esperada, y nada más:

```diff
       props.colorScheme === 'dark'
         ? GoogleMaps.MapColorScheme.DARK
         : GoogleMaps.MapColorScheme.LIGHT,
+    uiSettings: { zoomControlsEnabled: false },
   };
```

`pet-map.tsx` conserva sus exports (`MapCoordinates`, `MapPolyline`,
`PetMapProps`, `MAP_ZOOM`, `PetMap`): ninguno nuevo. `PetMapProps` no se amplía.
Las seis props previas de `mapViewProps` (`testID`, `style`, `cameraPosition`,
`markers`, `polylines`, `colorScheme`) quedan intactas.

---

## R1 al pie de la letra — verificado, no aceptado

- **La clave es exactamente una.** `uiSettings: { zoomControlsEnabled: false }`.
  `rg zoomGesturesEnabled|contentPadding mobile-pet-tracker/src/components/pet-map.tsx`
  no devuelve nada. La prohibición de la spec (§Fuera de alcance, D2) se cumple.
- **El test usa `toEqual` exacto**, no `toMatchObject` ni `toHaveProperty`:
  ```ts
  expect(mapProps.uiSettings).toEqual({ zoomControlsEnabled: false });
  expect(mapProps).not.toHaveProperty('contentPadding');
  ```
- **La prohibición está realmente asserteada, y lo comprobé mutando el código.**
  No me basta con que `toEqual` "debería" rechazar claves de más: en un worktree
  desechable parado en `e052b07` cambié la implementación a
  `uiSettings: { zoomControlsEnabled: false, zoomGesturesEnabled: true }` y la
  suite **siguió en rojo** (`1 failed, 7 passed`). El test bloquea de verdad el
  camino que la spec prohíbe.
- **La prop sale del wrapper.** `src/app/(tabs)/map.tsx` tiene cero líneas de
  diff y sigue sin importar nada de `expo-maps` (D4, `ui-guidelines.md` §8).

## El rojo es real, no declarado

No me fié del reporte del implementer. Monté un `git worktree` independiente
parado en `e052b07` (test presente, fix ausente — confirmado: `grep uiSettings`
sobre ese `pet-map.tsx` no devuelve nada) con `node_modules` enlazado, y corrí
la suite dirigida:

```
  R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom
    ✕ pasa solo zoomControlsEnabled y no contentPadding (3 ms)

    expect(received).toEqual(expected) // deep equality
    Expected: {"zoomControlsEnabled": false}
    Received: undefined

Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
```

Rojo confirmado de forma independiente, y con la forma correcta: **1 fallo (el
test nuevo) y 7 heredados verdes**. El worktree se eliminó al terminar
(`git worktree remove --force`); el árbol de trabajo del repo quedó idéntico.

## El R-id lleva sufijo y no se renombró nada

- `describe('R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom', …)`
  — sufijo de feature presente, como exige la spec y D3.
- **Los cuatro `describe` de #54 (`R1`–`R4`) están intactos.** El diff del
  archivo de test son **18 líneas añadidas al final y ni una sola línea de
  contexto modificada**. Lo confirmé además contra
  `specs/android-map-never-ready/traceability.md`, que los cita literalmente:
  `R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map`,
  `R2: la cámara se fija con MAP_ZOOM en vez de deltas`,
  `R3: marker y polylines llegan a la vista como arrays`,
  `R4: el tema decide el colorScheme del mapa`. Los cuatro siguen existiendo con
  ese nombre exacto: la trazabilidad de #54 no se rompió.
- **Reutiliza el mock y el patrón existentes.** El test nuevo usa
  `screen.getByTestId('map-view').props`, igual que los cuatro anteriores; no
  introduce spy sobre `mockGoogleMapsView.mock.calls`, ni snapshot, ni ningún
  tercer mecanismo. El mock de `expo-maps` no se tocó.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#55; el resto: 50 `done`, 6 `pending`)
- [x] `#55` **NO** está marcada `done` — sigue `in_progress`, como exige el handoff
- [x] `progress/current.md` describe la sesión activa y **no fue tocado por el implementer** (cero líneas de diff — en el fix 1 de #54 sí se escribió ahí; esta vez no se repitió)
- [x] `progress/impl_mobile-map-zoom-controls.md` existe y es el único canal de reporte

## Checklist C3 — Arquitectura

- [x] **N/A justificado**: feature de UI móvil pura, no toca `backend-pet-tracker/`.
      Las capas domain/application/infrastructure de `docs/architecture.md` no
      entran en juego (así lo declara la propia spec)
- [x] Sí se verificó el reparto que rige aquí (`ui-guidelines.md` §4 y §8):
      `PetMap` sigue siendo el único archivo que conoce `expo-maps`; la pantalla
      no gana prop ni import

## Checklist C4 — TDD

- [x] `R1` tiene test que lo nombra, con sufijo de feature para no colisionar con el `R1` de #54
- [x] `R2` no lleva test propio **por diseño de la spec**; su verificación es la
      allowlist + comandos, re-ejecutados por mí abajo
- [x] Historial test-primero **real**: `e052b07` es test-only (+18, cero producción)
      y precede a `bf14baf`, que es producción-only (+1). No hay commit único con todo
- [x] Rojo reproducido de forma independiente por el reviewer, no aceptado del reporte
- [x] Refactor: nada que refactorizar, como anticipaba `tasks.md` R1(3)

## Checklist C5 — Trazabilidad

- [x] `R1` registra test + los dos commits (rojo → verde)
- [x] `R2` registra la sección de `docs/verification.md` y el commit `6963758`
- [ ] **`R3` sigue `pendiente`** — y es correcto que lo esté: la fila la cierra el
      humano. Es la misma excepción que el review del fix 1 de #54 dejó por
      escrito. **No apruebo el cierre de la feature con esta fila abierta**;
      apruebo el trabajo automatizable
- [x] Formato de commits conforme: `test(map): … (R1)` → `fix(map): … (R1)` → `docs(map): … (R2)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y casilla humana marcada (2026-09-01)
- [x] `requirements.md`, `design.md` y `tasks.md` **sin una sola línea de diff** —
      solo cambió `traceability.md`, que es lo único que el handoff permitía
- [ ] Segunda casilla de §Aprobación (smoke R3) **sin marcar** — pendiente del humano

## Checklist C7 — Sin código huérfano

- [x] **N/A** — esta feature no reemplaza ni deprecia nada. Añade una clave a un
      objeto existente; no hay componente viejo que borrar ni test que retirar

## Checklist C8 — UI móvil (carta de UI)

- [x] Grep-clean intacto: cero hex fuera de `src/theme/`, cero clases arbitrarias
      `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy. Los cuatro
      `rg` salen sin coincidencias. Este diff no añade estilo, así que no movió
      ningún contador; `src/__tests__/design-drift.test.ts` sigue verde
- [x] Dimensiones y safe areas sin tocar: `map.tsx` tiene cero diff, el
      `FloatingTabBar` sigue en `insets.bottom + 12` y `map-stats` en
      `insets.bottom + 96`
- [x] Sin componentes nuevos, sin animaciones nuevas, sin estados de carga nuevos
- [x] Sobreviven los cinco testIDs: `screen-map`, `map-view`, `map-stats`,
      `map-empty-overlay`, `lost-mode-button`

### No-regresión de #54 (`ui-guidelines.md` §10)

Confirmado, no asumido. La regla §10 dice que **ningún ancestro de una vista
nativa de mapa puede declarar fondo opaco (`bg-*`)**. El único ancestro de
`PetMap` en el árbol renderizado es
`<View testID="screen-map" className="flex-1">` (`map.tsx:175`) — sin `bg-*`.
Los `bg-background` que aparecen en el archivo están en las ramas de
loading / error / no-pets / no-tracking, que **no renderizan `PetMap`**. Y
`map.tsx` tiene cero líneas de diff en esta branch, así que el fix que costó
cinco meses no se movió.

---

## Allowlist de R2 — verificada contra el diff real

`git diff --name-status f36b152..HEAD` devuelve **exactamente cinco paths**,
todos dentro de la allowlist:

```
M	docs/verification.md
M	mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
M	mobile-pet-tracker/src/components/pet-map.tsx
A	progress/impl_mobile-map-zoom-controls.md
M	specs/mobile-map-zoom-controls/traceability.md
```

```
 docs/verification.md                               |  24 ++++
 .../src/components/__tests__/pet-map.test.tsx      |  18 +++
 mobile-pet-tracker/src/components/pet-map.tsx      |   1 +
 progress/impl_mobile-map-zoom-controls.md          | 144 +++++++++++++++++++++
 specs/mobile-map-zoom-controls/traceability.md     |   4 +-
 5 files changed, 189 insertions(+), 2 deletions(-)
```

`git diff f36b152..HEAD --` sobre la lista negativa completa devuelve **vacío**:

| Path | Diff |
|---|---|
| `src/app/(tabs)/map.tsx` | cero líneas |
| `src/app/(tabs)/__tests__/map.test.tsx` | cero líneas |
| `src/app/(tabs)/_layout.tsx` | cero líneas |
| `src/components/floating-tab-bar.tsx` | cero líneas |
| `progress/current.md` | cero líneas |
| `feature_list.json` | cero líneas |
| `app.config.ts`, `app.json`, `package.json`, `bun.lock` | cero líneas |
| `specs/android-map-never-ready/**` | cero líneas |
| `requirements.md`, `design.md`, `tasks.md` de #55 | cero líneas |
| `docs/ui-guidelines.md`, `docs/conventions.md` | cero líneas |

El árbol de trabajo quedó limpio después de correr `./init.sh` (que lanza
`eslint --fix`): las únicas entradas de `git status` son los 13 symlinks no
trackeados bajo `.claude/skills/` que ya estaban antes de la sesión.

## `docs/verification.md`

Ganó la sección `### Feature 55 — mobile-map-zoom-controls`, colocada justo
después de `### Feature 54` y siguiendo su patrón (contexto → bloque de comandos
→ lista numerada de confirmaciones → dónde registrar el resultado). Dice
explícitamente lo que tenía que decir:

> El cambio es solo JS: no ejecutes `prebuild` ni `run:android`; basta Fast
> Refresh sobre el dev build existente.

y cierra advirtiendo que la suite Jest usa una vista mockeada y **no** prueba
que los botones desaparezcan. Las tres confirmaciones de R3 (ausencia de `+`/`−`,
pinch acercando y alejando, no-regresión de tiles/marker/polyline/`map-stats`/
Lost Mode) están las tres, por separado.

---

## Verificación independiente ejecutada

Todo lo de abajo lo corrí yo, no lo copié del reporte.

| Comando | Exit | Resultado |
|---|---:|---|
| Suite dirigida en worktree parado en `e052b07` (test sin fix) | rojo | `1 failed, 7 passed` → el rojo es real |
| La misma, con `zoomGesturesEnabled: true` añadido a mano | rojo | `1 failed, 7 passed` → `toEqual` sí blinda la prohibición |
| `bun run typecheck` (`mobile-pet-tracker/`) | 0 | `tsc --noEmit` sin errores |
| `bun run lint` (`mobile-pet-tracker/`) | 0 | `expo lint` sin errores |
| `bun run test` (`mobile-pet-tracker/`) | 0 | **51 suites, 570 tests, 1 snapshot** |
| `./init.sh` (raíz) | **0** | Todo verde a la primera |

**El número cuadra exacto.** La suite móvil estaba en 569 tras cerrar #54 y
quedó en **570**: el único test añadido es el de R1. El archivo `pet-map.test.tsx`
pasó de 7 a 8 tests, y lo vi con mis ojos en el worktree del rojo. Ningún test
previo fue borrado ni desactivado.

**El flake de `add-pet` (#53) no apareció** en mi corrida, ni tampoco el de
`health-vaccines` que reporta el implementer: `./init.sh` salió 0 en la primera
ejecución, sin repeticiones.

### Output de `./init.sh`

```
→ Verificando entorno...
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
⚠️  Feature en progreso: mobile-map-zoom-controls
→ Build...
→ Ejecutando tests...
Test Suites: 156 passed, 156 total          (backend)
Tests:       1198 passed, 1198 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
Test Suites: 51 passed, 51 total            (móvil)
Tests:       570 passed, 570 total
Snapshots:   1 passed, 1 total
→ Tests e2e...
Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 50/57 completadas | 6 pendientes
```

(Exit code 0. Los `NodeVersionSupportWarning` del AWS SDK son ruido preexistente
de node v20, ajeno a esta feature.)

---

## Observaciones — ninguna bloqueante

1. **El smoke R3 es el único gate que queda, y no lo puedo tocar.** Repito lo
   del encabezado porque es lo que decide si esta feature se cierra: el humano
   tiene que confirmar **por separado** (a) que no hay botones `+` / `−` en la
   esquina inferior derecha, (b) que el pinch acerca y el pinch inverso aleja,
   (c) que siguen visibles tiles, marker, polyline, `map-stats` y Lost Mode. Un
   test verde de R1 **no** sustituye a ninguna de las tres.

2. **Codex no pudo cargar `expo:expo-overview`.** Su reporte declara que el
   plugin Expo instalado en su lado es la versión 1.0.2 y no contiene esa skill,
   así que cargó `expo:building-native-ui` en su lugar. Es una desviación del
   handoff y de `CLAUDE.md` §UI móvil, **declarada honestamente** en vez de
   fingida. Riesgo real aquí: bajo — la autoridad del cambio fueron los tipos
   instalados de `expo-maps@57.0.2`, que verifiqué existen
   (`GoogleMapsUISettings.zoomControlsEnabled` y
   `GoogleMapsViewProps.uiSettings`), y el diff es una clave booleana. Pero el
   desfase de versión del plugin entre las dos IAs conviene resolverlo antes de
   un handoff móvil más grande.

3. **Flake nuevo anotado por el implementer, no reproducido por mí**:
   `backend-pet-tracker/test/health-vaccines.e2e-spec.ts` → `R12: auditoria de
   mutaciones` (línea 470) le falló una vez porque Postgres devolvió las tres
   acciones de auditoría en otro orden, y pasó al repetir. No es el flake de
   `add-pet` (#53) y no está registrado en ninguna parte. En mi corrida los e2e
   salieron verdes a la primera. Es una aserción que depende del orden de un
   `SELECT` sin `ORDER BY` determinista: candidato a feature propia, ajeno a #55.

4. **Detalle menor en `docs/verification.md`**: el runbook pide "una mascota
   premium con última posición **y al menos un viaje del día**". R3 solo exige
   última posición; el viaje viene implícito en su punto 3, que pide ver la
   polyline. Es coherente con la spec y con el patrón de #54, no una ampliación
   de alcance. Sin acción.

---

## Veredicto

**APROBADO** el trabajo automatizable: R1 implementado exactamente como manda la
spec (una clave, sin `zoomGesturesEnabled`, sin `contentPadding`), con TDD real
verificado de forma independiente, R-id desambiguado, trazabilidad de #54
intacta, allowlist respetada al milímetro y `./init.sh` en 0 a la primera con
570 tests móviles.

**La feature NO puede marcarse `done` con esto.** Falta el smoke humano R3 en
dev build de Android, y la fila `R3` de `traceability.md` y la segunda casilla
de `requirements.md` §Aprobación siguen abiertas a propósito. El leader marca
`done` cuando el humano cierre las dos, no antes.
