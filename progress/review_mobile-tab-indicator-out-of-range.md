# review: mobile-tab-indicator-out-of-range (#91)

Fecha: 2026-09-13
Branch: `feature/91-mobile-tab-indicator-out-of-range`
Base: `072cff40` · HEAD revisado: `1a57f1aa`
Commits de Codex auditados: 24 (`622a94de`..`26ca348f`)

**Veredicto: APROBADO**

> R8 queda abierto por diseño: es el gate humano en dev build de Android y lo
> corre el humano después de este veredicto. No es motivo de rechazo (el guion
> está escrito y cubre los cuatro puntos (a)-(d) — ver §R8 más abajo).

---

## Método

El reviewer **no** aceptó el reporte de Codex como evidencia. Todo lo que sigue
se comprobó contra el árbol y contra el historial:

- `./init.sh` **lo corrió el reviewer**, en primer plano, y el **exit code se
  midió sin pipe**: `env -u FORCE_COLOR -u COLORTERM ./init.sh > /tmp/init-91.log 2>&1; echo "exit=$?"` → **`exit=0`**.
  Se comprobó antes con `pgrep -af init.sh` que no había otra corrida en los
  otros worktrees (el Postgres de docker es compartido).
- Los cinco rojos y los dos rojos de mutación **se reprodujeron ejecutándolos**,
  en un `git worktree` desechable (`/tmp/wt91`, `node_modules` enlazado) para no
  tocar el working tree principal. El worktree se eliminó al terminar y
  `git status --porcelain` del árbol principal quedó **vacío**.

### Nota sobre el defecto #75 de `init.sh`

La sesión exporta `FORCE_COLOR=3`, lo que rompe la comparación de cadenas del
chequeo de harness (`Más de 1 feature en in_progress (0)`). Se sorteó lanzando
`init.sh` con `env -u FORCE_COLOR -u COLORTERM`, que es exactamente el entorno en
el que corrió la sesión Backend. Así la verificación fue **completa**, no parcial:
no hubo que correr las suites sueltas. Fuera del alcance de #91 (arreglado en el
PR #124, sin mergear).

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `#91`, confirmado por recuento sobre `feature_list.json`
- [x] `progress/current.md` describe la sesión activa (#91), con el reparto de worktrees y el registro corregido de `init.sh`

## Checklist C3 — Arquitectura

- [x] N/A a capas de backend: el cambio es de cliente móvil y vive entero en un
      componente de presentación (`src/components/floating-tab-bar.tsx`). Cero
      `backend-pet-tracker/`, cero migraciones.
- [x] El componente no gana lógica de negocio: deriva un índice de la constante
      `TABS` que ya poseía y sigue recibiendo `state`/`navigation` por props.

## Checklist C4 — TDD (rojo→verde por requisito, reproducido)

- [x] Cada `R<n>` funcional tiene test que lo nombra: `#91 R1` … `#91 R5`
- [x] Historial test-primero, **un commit de test y otro de fix por requisito**,
      nunca todo junto
- [x] **Ningún rojo por `ReferenceError`**: los cinco fallan por su propia aserción

| R | Rojo (commit) | Verde (commit) | Rojo reproducido por el reviewer |
|---|---|---|---|
| R1 | `81282615` (solo test) | `29f1b667` (solo prod) | 2 fallos, `expect(instance).not.toBeOnTheScreen()` — la burbuja **sí** se montaba |
| R2 | `99f1534f` (solo test) | `dcbab0d1` (solo prod) | esperaba `68.8`, recibió **`137.6`** |
| R3 | `1addfc97` (solo test) | `eedcb3b5` (solo prod) | esperaba `137.6`, recibió **`206.32`** |
| R4 | `644306c4` (solo test) | `b5d51191` (solo prod) | esperaba `137.6`, recibió **`-68.72`** |
| R5 | `1c77093e` (test + mutación M3 de producción) | `dba1ea57` (revierte M3) | esperaba `selected: false`, recibió **`selected: true`** |

`622a94de` (fixture §T0 + dobles de icono) es **verde por diseño**: es el sujeto
que R1..R5 necesitan por delante, declarado así en `tasks.md` §T0 y en
`traceability.md`. No se usó para fabricar ningún rojo.

### El commit intermedio de R3 — `6863488b` — investigado

**No relajó ni reescribió la aserción. La afiló.** Único cambio del commit:

```diff
-    jest.advanceTimersByTime(300);
+    jest.advanceTimersByTime(400);
```

El valor esperado, `translateX: 137.6`, queda **byte a byte idéntico**. Verificado
ejecutando los tres estados:

| Commit | Ventana | Resultado | Recibido |
|---|---|---|---|
| `1addfc97` | 300 ms | **ROJO** | `206.3243241959277` |
| `6863488b` | 400 ms | **ROJO** | `206.39999999999998` |
| `eedcb3b5` | 400 ms | **VERDE** | `137.6` |

Motivo real: con 300 ms el spring (`duration: 250`) todavía no había asentado, y
el valor llegaba asintótico (`206.32`) en vez de exacto (`206.4`). Ampliar la
ventana hace que **tanto el rojo como el verde caigan en el valor exacto**. El
test siguió rojo después del cambio, así que el rojo nunca se perdió.

- Observación **no bloqueante**: `requirements.md` §R3 dice "avanzar 300 ms" y el
  test usa 400 ms. La cifra de la spec estaba infra-especificada frente al tiempo
  real de asentamiento; la aserción normativa (`137.6`) se respetó. Deuda de
  redacción, no de implementación.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin filas "pendiente"** salvo R8 (gate humano, permitido)
- [x] Los 14 hashes citados existen y son **ancestros de HEAD** (`git merge-base --is-ancestor`, uno por uno)
- [x] Commits con formato `tipo(tab-indicator): desc (R-id)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`; los cuatro ficheros de spec en `approved`
- [x] Casilla humana marcada: `- [X] Aprobado por humano (fecha: 2026-09-12)`
- [x] **Ningún requisito modificado tras la firma.** Desde `95354a19`, el único
      commit que toca `requirements.md` es `9e1ac8d5`, y cambia **una línea**:
      `status: draft` → `status: approved` en el frontmatter (paso documentado del
      leader). Cero drift de código colado en el gate.

## Checklist C7 — Sin código huérfano

- [ ] N/A — #91 es una corrección de defecto sobre un componente vivo. No
      reemplaza ni deja obsoleto ningún módulo; el diff no elimina ningún archivo
      ni deja tests de código inexistente.

## Checklist C8 — Carta de UI (toca `mobile-pet-tracker/`)

- [x] Grep-clean sobre el fichero tocado: 0 hex, 0 `StyleSheet.create`, 0
      shadow/elevation legacy, 0 clases arbitrarias (los 4 `[` del fichero son
      destructuring/indexado de JS, **mismo recuento que en `072cff40`**)
- [x] Ninguna `className` añadida ni eliminada por #91
- [x] Animación: sigue en Reanimated sobre el UI thread, interrumpible, con
      `ReduceMotion.System` intacto

---

## Los dos sitios de posicionamiento (spec §0.2)

Ambos arreglados, cada uno con **mutación propia comprobada por separado**, con la
otra revertida. M1 y M2 no venían versionadas (son evidencia sobre el árbol final),
así que **el reviewer las reprodujo**:

| Mutación | Sitio | Test que se pone rojo | Resultado reproducido |
|---|---|---|---|
| **M1** | `useEffect` — destino del `withSpring` → `state.index * tabWidth` | `#91 R3` | **1 failed, 17 passed**; esperaba `137.6`, recibió `206.39999999999998` |
| **M2** | `handleLayout` — `translateX.set(state.index * nextTabWidth)` | `#91 R2` | **1 failed, 17 passed**; esperaba `68.8`, recibió `137.6` |
| **M3** | celdas — `isActive = activeTabIndex < 0 \|\| …` | `#91 R5` | **1 failed, 17 passed**; `selected: true` en la primera celda |

Coincide con lo que el informe de Codex declara. **R7 cerrado**: una mutación por
cada uno de los dos sitios, más la de la zona ciega.

### R5 — requisito de verificación, vía (b)

- [x] El rojo `1c77093e` lleva **versionada la mutación de producción M3**
      (`floating-tab-bar.tsx`, 1 línea), no una mutación del doble de `reicon`
- [x] El verde `dba1ea57` la **revierte** exactamente
- [x] El test no congela constantes de color: captura el activo y el inactivo del
      mismo árbol y exige que difieran (consistencia interna)
- [x] Cubre las **cuatro decisiones por celda** (estado de accesibilidad, peso de
      icono, color de icono, clase de etiqueta) más los dos hijos en orden y la
      navegación, contando por hijos y no por `testID`

### Ninguna mutación viva en el árbol

`git diff 072cff40..HEAD -- mobile-pet-tracker/src/components/floating-tab-bar.tsx`
no contiene `isActive` mutado ni ningún `state.index` superviviente: las siete
apariciones de `state.index` en el diff son **líneas eliminadas** (`-`), el código
viejo. En HEAD, `:173` es `const isActive = activeRouteName === name;`.

---

## R6 — Los siete candados, uno por uno contra el árbol

| # | Candado | Comprobación del reviewer | Delta |
|---|---|---|---|
| 1 | Geometría del indicador | `137.6`, `68.8`, `width: 360`, `width: 68.8` presentes en HEAD; `git diff -U0` **no elimina ni modifica ninguna** línea con esos valores | **0** |
| 2 | `TAB_INDICATOR_SPRING` | `duration: 250`, `dampingRatio: 1`, `ReduceMotion.System` intactos en `:57-61` | **0** |
| 3 | `TABS` 5 entradas sin `alerts` + 5 `<Tabs.Screen>` | `TABS` con 5 entradas; `grep -c alerts floating-tab-bar.tsx` = **0**; `grep -c Tabs.Screen _layout.tsx` = **5** | **0** |
| 4 | Catálogo de idiomas (`language-provider.test.tsx:41`) | Aserción `toHaveLength(260+16+1+4+7+14)` = **302**, intacta; los ficheros de i18n no aparecen en el diff | **0 claves** |
| 5 | Copy `R2_TABS` | 5 filas en `ui-copy-table.ts`; `expect(R2_TABS).toHaveLength(5)` en `ui-language.test.ts:75` | **0** |
| 6 | `text-accent-strong` | 1 ocurrencia en `floating-tab-bar.tsx` (coincide con `inkSites`); suma declarada `13 + 1` = **14** | **0** |
| 7 | Escala de radios | 0 ocurrencias de `rounded-2xl/lg/md/sm`; #91 no añade ni edita ninguna `className` | **0** |
| — | Dependencias | `git diff 072cff40..HEAD -- mobile-pet-tracker/package.json` **vacío**; sin diff de lockfile | **0** |

### Los siete `describe` preexistentes, sin tocar

`R1`-`R5`, `R7`, `R8` (no hay `R6`) siguen presentes con sus mismos nombres y
cuerpos. El `git diff -U0` del fichero de test elimina/modifica **exactamente 4
líneas**, todas de las firmas del fixture de §T0:

```
-function tabBarProps(index = 0): FloatingTabBarProps {
-    state: { index, routes },
-async function renderTabBar(index = 0) {
-  return render(<FloatingTabBar {...tabBarProps(index)} />, {
```

Los parámetros nuevos llevan valor por defecto (`= routes`), por eso los siete
`describe` heredados conservan su comportamiento sin editarse. **Ninguna aserción
viva del indicador fue relajada.**

### Alcance del diff

`git diff --stat 072cff40..HEAD -- mobile-pet-tracker/` lista **exactamente dos**
ficheros, los de `design.md` §Archivos afectados:

```
 src/components/__tests__/floating-tab-bar.test.tsx | 263 ++++++++++++++++++++-
 src/components/floating-tab-bar.tsx                |  33 ++-
```

Fuera de `mobile-pet-tracker/` solo cambian `feature_list.json`, `progress/` y
`specs/`, que es lo esperado.

---

## Output de `./init.sh`

Corrido por el reviewer, exit code medido sin pipe. Log completo: `/tmp/init-91.log`.

```
$ env -u FORCE_COLOR -u COLORTERM ./init.sh > /tmp/init-91.log 2>&1; echo "exit=$?"
exit=0

Test Suites: 165 passed, 165 total      (backend)
Tests:       1268 passed, 1268 total

Test Suites: 2 passed, 2 total          (infra)
Tests:       14 passed, 14 total

Test Suites: 73 passed, 73 total        (móvil)
Tests:       1236 passed, 1236 total

Test Suites: 3 skipped, 25 passed, 25 of 28 total   (e2e)
Tests:       8 skipped, 362 passed, 370 total

✅ Tests e2e pasados
→ Lint...    ✅ Lint sin errores
→ Typecheck... ✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
```

**Delta de la suite móvil:** 1230 → **1236** tests, **+6**, que son exactamente los
seis `it` nuevos (R1 aporta 2; R2, R3, R4 y R5 uno cada uno). Cero regresiones:
ninguna suite pasa de verde a rojo y el recuento de suites sube de 73 a 73 (los
cinco `describe` nuevos viven en un fichero que ya existía).

---

## R8 — Gate humano (abierto, no bloqueante)

El guion está escrito en `progress/impl_mobile-tab-indicator-out-of-range.md` §R8
y **cubre los cuatro puntos** de `requirements.md` §R8:

- (a) las cinco pestañas con la burbuja bajo la activa → paso 1
- (b) `alerts` desde la campana del hero: sin burbuja, cinco etiquetas grises → paso 2
- (c) volver a una pestaña —la misma y otra distinta— sin deslizamiento fantasma → paso 3
- (d) lo mismo en `reminders`, `weight-log` y una ruta de `pets/` → paso 4

Dice explícitamente **dev build de Android, no Expo Go**. Resultado: *por ejecutar*.

---

## Observaciones no bloqueantes (deuda, no paran el cierre)

1. **R3, ventana de temporizador 300 → 400 ms.** La spec fijó 300 ms; el test usa
   400. La aserción normativa (`137.6`) no se tocó y el rojo se mantuvo, pero la
   cifra de la spec quedó desalineada con el árbol. Al enmendar specs futuras que
   esperen un `withSpring`, derivar la ventana de la duración real en vez de
   fijarla a ojo.
2. **`622a94de` no lleva R-id** en el asunto (`test(tab-indicator): parametriza el
   fixture de rutas y dobla los iconos`). Es correcto —es la tarea §T0, que no
   pertenece a ningún requisito— pero un lector de `git log` no lo deduce sin
   abrir `tasks.md`. Sugerencia para el futuro: sufijo `(T0)`.
3. **Defecto #75 sigue vivo en `main`.** Cualquier sesión con `FORCE_COLOR`
   exportado verá `init.sh` abortar en el chequeo de harness. El PR #124 lo
   arregla y conviene mergearlo antes del próximo gate para que el reviewer no
   tenga que sortearlo con `env -u`.
