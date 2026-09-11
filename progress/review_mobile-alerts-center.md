# review: mobile-alerts-center (#78)

Fecha: 2026-09-11
Branch: `feature/78-mobile-alerts-center` — HEAD `5a51d596` (último commit de código de Codex: `f5d15844`)
Base de comparación: `origin/main` @ `381d1e36`

**Veredicto: RECHAZADO**

Razón en una línea: **R6 decisión 12 ("orden de los hijos") no está candada
donde la carta dice que se rompe** — intercambiar el tipo de alerta y el
`petName` dentro de la fila deja la suite móvil **entera** verde (73 suites,
1230 tests), que es literalmente el modo de fallo que la carta §Enmienda #70
describe con esas palabras.

Todo lo demás está verde: `./init.sh` exit 0 verificado por mí, las ocho
enmiendas E1-E8 cumplidas una a una, trazabilidad sin filas pendientes salvo
R14, los 37 hashes citados resuelven y son ancestros de HEAD, cero drift ajeno
a la spec, y las tres cifras de candado movidas están declaradas como suma.
La corrección es **solo de test**, no toca producción.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `Counter({'done': 71, 'pending': 17, 'in_progress': 1})`, y es #78
- [x] `progress/current.md` describe la sesión activa (#78, handoff a Codex, los dos gates humanos firmados)
- [x] `progress/history.md` tiene la entrada de la sesión anterior (#87)

> Observación no bloqueante: `init.sh` avisa `STATUS.md desactualizado (71/88
> declarado vs 71/89 real)`. Lo provoca el alta de #90 hecha por el leader, no
> Codex. No afecta al exit code.

## Checklist C3 — Arquitectura

Feature **solo de cliente móvil**; las capas domain/application/infrastructure
de `docs/architecture.md` no se tocan. La frontera aplicable es la del repo
móvil tras #87: "API pura / pantalla con estado".

- [x] `backend-pet-tracker/` sin un solo cambio (`git diff --stat origin/main...HEAD` no lo lista)
- [x] `src/api/alerts.ts` son funciones planas: cero hooks, cero React, cero estado; devuelven unión discriminada por `kind`
- [x] La pantalla es quien tiene el estado (`useInfiniteQuery` + overlay local)
- [x] Cero dependencias nuevas: `package.json` **no aparece** en el diff de la branch
- [x] Cero migraciones

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra: los 13 `describe` llevan
      el prefijo `#78 R<n>:` y coinciden uno a uno con la tabla de
      `traceability.md`
- [x] Historial test-primero por requisito, sin un solo "todo junto". Verificado
      commit a commit:

  | R | rojo | verde |
  |---|---|---|
  | R1 | `ee17732b` | `f6062ed0` |
  | R1/E2 | `8e05f068` | `749cde81` |
  | R2 | `d6803629` | `02593774` |
  | R3 | `0467146a` | `d2f10c67` |
  | R4/E1/E4 | `2dc14118` | `a8fa22d2` |
  | R5 | `8d7b5f13` | `e9f3b126` |
  | R6 | `e2a10a0a` | `ccefd8fe` |
  | R7 | `d72ba1dd` | `3e7bebb9` |
  | R8/E5 | `290abc42` | `63faca32` |
  | E8 | `54b8932d` | `63faca32` |
  | R9/E3 | `b4cd1f97` | `288c8c72` |
  | R10 | `73307e12` | `3ac78d34` |
  | R11/E6 | `bf3e6622` | `418bc7cd` |
  | R12 | `24d0426a` | `e1fb6ad6` |

- [x] **Ningún rojo por `ReferenceError`**. Los cuatro commits rojos que tocan
      producción lo hacen con un *stub* mínimo para que compile el test, y el
      stub garantiza el rojo por la aserción:
      `ee17732b` deja `listAlerts` con `throw new Error('not implemented')`;
      `2dc14118` deja `AlertsScreen` devolviendo `null`;
      `8d7b5f13` deja `AlertsRoute` devolviendo `null`.
- [x] **Ningún rojo por mutación del doble de test**: la sonda de R13 se planta
      en producción (`src/screens/alerts/index.tsx`), no en un mock.
- [x] **E1 y E7 sin ciclo TDD propio — la justificación se sostiene.**
      E1 es la derogación de una premisa (`no hay TanStack Query`): no tiene
      artefacto propio, y su efecto observable —que la pantalla se monta con
      `renderWithProviders` y lee de la caché— sí está medido, por el ciclo
      `2dc14118` → `a8fa22d2` y por los candados heredados `#87 R1`/`R19`.
      E7 solo reapunta números de línea dentro de la propia spec; fabricarle un
      rojo habría sido teatro. Ambas quedan citadas con sus commits documentales
      (`ecb449ee`) y su gate humano (`4f9298e0`).

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente". La única fila abierta es
      **R14**, marcada explícitamente como gate humano no delegable — correcto.
- [x] Cada requisito tiene test y commit registrados, incluidas las ocho enmiendas
- [x] **Los 37 hashes citados en el reporte y en la trazabilidad resuelven y son
      ancestros de HEAD** (`git merge-base --is-ancestor <hash> HEAD`, uno a uno).
      Cero repeticiones del accidente de #87: esta vez se hizo `git merge` de
      `main` (`d07427e9`), no rebase.
- [x] Formato de commit `tipo(scope): desc (R-ids)` respetado en los 28 commits de código

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] `- [X] Aprobado por humano (fecha: 2026-09-11)`, firmado por el humano en
      su propio commit: `09f1f309` y refrescado en `4f9298e0`, ambos autor
      `AlexisSM377 <al222111377@gmail.com>`
- [x] `- [X] Enmiendas E1-E8 aprobadas por humano (fecha: 2026-09-11)` — `4f9298e0`,
      mismo autor humano; el diff de ese commit **solo** marca las dos casillas
- [x] Ningún requisito modificado después del gate: los únicos commits que tocan
      `requirements.md` son `99f5f2d8` (borrador), `09f1f309` (firma humana),
      `ecb449ee` (enmienda) y `4f9298e0` (firma humana de la enmienda). Codex no
      tocó la spec durante la implementación.

## Checklist C7 — Sin código huérfano

- [ ] N/A — esta feature no reemplaza ni deprecia nada. Es pantalla nueva, ruta
      nueva y cliente de API nuevo. `pet-hero-header.tsx`, `pet-switcher.tsx`,
      `floating-tab-bar.tsx` y `(tabs)/_layout.tsx` **no se tocan** (verificado
      en el diff), tal como manda §Fuera de alcance. El `PetSwitcher` de Home se
      envuelve, no se sustituye.

## Checklist C8 — Carta de UI móvil

- [x] Grep-clean sobre los ficheros de #78 (`screens/alerts/index.tsx`,
      `app/(tabs)/alerts.tsx`, `api/alerts.ts`, el delta de `screens/home/index.tsx`):
      cero hex, cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero
      `shadow-*`/`elevation`, cero `rounded-2xl|xl|lg|md|sm`.
      (Los `rounded-xl` que quedan en `home/index.tsx:357,501,529,567` son
      preexistentes; el diff de #78 sobre ese fichero solo añade `rounded-full`.)
- [x] Dimensiones: `contentContainerStyle` exacto `{padding:24, gap:16,
      paddingTop: insets.top+12, paddingBottom: insets.bottom+96}` con
      `useSafeAreaInsets()`, y asertado con insets mockeados a 40/24 ⇒ 52/120
- [x] Carga con tres `Skeleton` dimensionados como la fila (`h-20 w-full rounded-card`), no spinner
- [x] Componentes compartidos reutilizados: `Card`, `PetSwitcher`, `Button`/`Skeleton` de heroui. Cero forks locales
- [x] Tappables: campana `size-11` (44pt) con `style={({pressed}) => ({opacity: pressed ? 0.8 : 1}))`; ack con `min-h-11` y el feedback del `Button` de heroui
- [x] Sin animaciones nuevas
- [ ] **Elementos repetidos (§Enmienda #70): FALLA la decisión 12** — ver Hallazgo 1

---

## Gate de las enmiendas — E1-E8, una por una

Donde el cuerpo del requisito y la enmienda discrepaban, mandó la enmienda.
Comprobado contra el árbol, no contra el reporte.

| E | Qué exigía | Veredicto |
|---|---|---|
| E1 | La pantalla vive sobre TanStack Query; `use-api` no reaparece | **OK** — `useInfiniteQuery` en la pantalla, `useQuery` en Home; `design-drift.test.ts` `#87 R19` sigue con la huella de `use-api` reducida a `screens/home/weekly-activity-chart.test.tsx` |
| E2 | La campana usa `alertKeys.open()`; **cero** `queryKey: [` literal en `screens/home/index.tsx` | **OK** — `alertKeys` exportado en `src/api/query-keys.ts` con las dos claves exactas; `grep -n "queryKey: \[" src/screens/home/index.tsx` → sin coincidencias. El candado `design-drift.test.ts:438-446` además enrola ahora a `screens/alerts/index.tsx`, que también usa la clave canónica |
| E3 | `useInfiniteQuery`, **cero** `useState` de páginas o cursor | **OK** — los tres `useState` de la pantalla son `acked`, `ackingId` y `actionError` (overlay y error de acción). Ninguno guarda página ni cursor; el cursor sale de `getNextPageParam` |
| E4 | Estados derivados de la query; `unauthorized` no pinta estado propio | **OK** — `isPending` / `data.pages[0].kind` / suma de items; con `unauthorized` las tres ramas del `ListEmptyComponent` dan `null` y hay test que lo afirma |
| E5 | Ack plano + overlay; **ni** `useMutation` **ni** `setQueryData` | **OK** — `grep -rn "useMutation\|setQueryData" src/` solo encuentra los tests preexistentes de `query-provider`/`layout` de #87. Cero en producción |
| E6 | Campana con `useQuery` y su `refetch` dentro del `useFocusEffect` existente; sin `useQueryClient`/`invalidateQueries` | **OK** — `refetchOpenAlerts` entra en el `useCallback` del `useFocusEffect` que Home ya tenía, y en su array de dependencias. Cero `useQueryClient`/`invalidateQueries` en producción |
| E7 | Referencias reapuntadas | **OK** — documental (`ecb449ee`), con gate humano en `4f9298e0` |
| E8 | `screenSignOutCalls` gana **solo** `'screens/alerts/index.tsx': 1`; `'screens/home/index.tsx': 0` sigue en 0 | **OK** — el diff de `design-drift.test.ts` en toda la branch es **una sola línea añadida**: `+ 'screens/alerts/index.tsx': 1`. Home conserva su `0` |

## R7 — partición sobre el `status` descargado

**OK.** `src/screens/alerts/index.tsx:81-85`:

```ts
const ordered = [
  ...fetched.filter((alert) => alert.status === 'open'),
  ...fetched.filter((alert) => alert.status !== 'open'),
];
const rows = ordered.map((alert) => acked[alert.id] ?? alert);
```

La partición se calcula sobre `fetched` (lo descargado) y el overlay se aplica
**después**, con `.map` que preserva índices. El test de R7 afirma el orden
`[open1, open2, acked, closed]` antes y después del ack. Verificado además que
el candado está vivo: si la partición se moviera detrás del overlay, `open1`
saltaría al grupo de cerradas y el segundo `it` se pondría rojo.

## R3 y R12 — cifras movidas como suma, nunca total absoluto

Las tres únicas cifras de candado que #78 mueve, todas declaradas como sumando:

| Candado | Antes | Ahora |
|---|---|---|
| `language-provider.test.tsx:41` | `260 + 16 + 1 + 4 + 7` | `260 + 16 + 1 + 4 + 7 + 14` |
| `ui-language.test.ts:83` `R3_HOME` | `21 + 15 + 1 + 4 + 7` | `21 + 15 + 1 + 4 + 7 + 2` |
| `ui-language.test.ts:437` `SCREEN_FILES` | `19 + 2` | `19 + 2 + 1` |

El comentario de `language-provider.test.tsx:36` gana `+ 14 de #78`, como pedía
R3. `R12_ALERTS` **no** lleva `toHaveLength(n)` propio: se cierra con
`checkUses()` y con la suma interna de `ALL_USES` (doce bloques). Las 14 claves
están en `en` y en `es` con los mismos marcadores, y registradas en
`specs/mobile-ui-language/design.md` §2.13 con el sufijo normativo
`← añadida por #78 (R3)`, que el test verifica con regex clave a clave.

Contado a mano: `src/screens/alerts/index.tsx` tiene 16 `t('...')` literales
más 3 `labelKey:`; `R12_ALERTS` tiene exactamente 19 filas. Cuadra.

## R13 — prueba de mutación

**Vista en rojo, no afirmada.** Los dos commits existen y son ancestros de HEAD:

- `7d1bff33` — sonda: `surface: 'bg-danger-soft'` → `'bg-accent-soft'` en
  `ALERT_TYPE_META.geofence_exit` (blob `9040bcc8` → `0c660431`).
- `df3b4ea2` — restauración: vuelve a `'bg-danger-soft'` (blob `0c660431` →
  `9040bcc8`, **byte a byte el de antes**).

El árbol quedó limpio: `git status` vacío en HEAD, y los blobs coinciden.
El rojo que reporta Codex (`consistency-classnames.test.ts:446`, `Expected: 16 /
Received: 17`) es coherente con el candado `#64 R9`.

`adbfecc6` (`use query timestamp for relative time`) es posterior a la sonda y
cambia `new Date()` por `new Date(alerts.dataUpdatedAt)` — pureza de render.
No relaja ninguna aserción.

### Sondas propias del reviewer (3 plantadas, 3 revertidas)

No me fié de la sonda del reporte: planté tres más, dos de ellas en zonas donde
el candado podía no mirar.

| # | Mutación en producción | Resultado |
|---|---|---|
| A | Mover el contenedor del icono **detrás** de la columna de textos | **ROJO** — 4 tests de `#78 R6`, en `index.test.tsx:337`: `Expected substring: "size-11" / Received string: "min-w-0 flex-1 gap-1"`. La parte de la decisión 12 que la spec escribió literalmente **sí** está viva |
| B | Intercambiar los `<Text>` de `-type` y `-pet` (el nombre de la mascota pasa a pintarse **encima** del tipo de alerta) | **VERDE** — suite móvil completa: `Test Suites: 73 passed, 73 total / Tests: 1230 passed, 1230 total`. **Hallazgo 1** |
| C | Degradar el título de la pantalla de `text-2xl font-black text-foreground` a `text-xs font-normal text-muted` | **VERDE** — suite móvil completa: `73 passed / 1230 passed`. **Hallazgo 2** |

(Una cuarta variante de B —mover el tiempo relativo al primer puesto— dejó
verdes los 26 tests de `src/screens/alerts/index.test.tsx`.)

Las tres se revirtieron con `git checkout -- mobile-pet-tracker/src/screens/alerts/index.tsx`.
Estado final verificado: `git status --short` vacío, `git diff --stat` vacío,
HEAD sigue en `5a51d596`. **No se editó código de la aplicación ni `feature_list.json`.**

## Drift de código

`git diff --stat origin/main...HEAD` = 26 ficheros. Todos atribuibles:

- 17 de `mobile-pet-tracker/` — exactamente los que la spec declara, ni uno más.
- `feature_list.json` — #78 a `in_progress` + corrección de la descripción + alta de **#90**: cambios del leader, esperados.
- `progress/` (4) y `specs/` (4) — spec, handoff, sesión y reporte de impl.

Cero cambios en `backend-pet-tracker/`, en `infra/`, en `package.json` o en
lockfiles. Sin nada ajeno a esta spec.

## R14 — gate humano

**PENDIENTE. No simulado, no firmado, no dado por bueno.** Smoke en dev build
de Android con una alerta `open` real, seis pasos, guion en
`progress/impl_mobile-alerts-center.md` §R14. La feature **no** puede pasar a
`done` hasta que lo firme un humano, aunque se resuelvan los hallazgos de abajo.

---

## Observaciones

### Hallazgo 1 — BLOQUEANTE. R6, decisión 12: el orden de los textos de la fila no está candado

`docs/ui-guidelines.md:339-342` define la decisión 12 así:

> **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
> orden**: **intercambiar dos textos deja la suite entera verde**. Se cierra
> fijando la posición.

Y el criterio de aceptación de toda la §Enmienda #70 es
`:318`: *"cruzar cualquiera de ellas entre dos elementos pone la suite roja"*.

Intercambié en producción los dos `<Text>` de la columna —el `petName` pasa a
pintarse **encima** del tipo de alerta, una fila visiblemente distinta— y la
suite móvil **entera** quedó verde: 73 suites, 1230 tests. Es, palabra por
palabra, el modo de fallo que la decisión 12 existe para impedir.

**Por qué se escapa**: `src/screens/alerts/index.test.tsx:336-342` fija la
posición de los hijos del `Card` (`children[0]` = icono, `children[1]` = columna,
`children[2]` = ack) y afirma `elementChild(row, 1).children` → 3. Pero los tres
textos de dentro de esa columna se localizan con `rowScope.getByTestId(...)`,
que es agnóstico al orden. La cardinalidad está bien contada
(`children.length`, nunca por prefijo de `testID`); lo que falta es la
**posición**, un nivel más abajo.

**Corrección pedida** (solo test, cero producción). En el `it.each` de
`#78 R6`, junto a las aserciones que ya existen:

```ts
const column = elementChild(row, 1);
expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
expect(elementChild(column, 1).props.testID).toBe(`${rowId}-pet`);
expect(elementChild(column, 2).props.testID).toBe(`${rowId}-time`);
```

Y la sonda en rojo documentada, como manda la carta §Enmienda #70 método:
intercambiar los dos `<Text>` en `src/screens/alerts/index.tsx`, ver el rojo
**por esa aserción**, restaurar con `git diff` vacío.

### Hallazgo 2 — menor, se arregla en la misma ronda. R4.1: la receta tipográfica del título no tiene `expect`

R4 punto 1 exige literalmente
`<Text className="text-2xl font-black text-foreground">{t('alerts.title')}</Text>`.
El único test que mira ese nodo es
`expect(screen.getByText(es['alerts.title'])).toBeVisible()`
(`index.test.tsx:136`), que no ve la `className`. Degradé el título a
`text-xs font-normal text-muted` y la suite móvil completa siguió verde
(73/1230).

No es un elemento repetido, así que la §Enmienda #70 no lo cubre; pero es una
cláusula de requisito sin candado, y el arreglo es una línea:

```ts
expect(screen.getByText(es['alerts.title']).props.className).toBe(
  'text-2xl font-black text-foreground',
);
```

### Observaciones que **no** bloquean

1. **R5, aserciones más estrechas que la letra de la spec.** La spec pedía
   `expect(source).not.toContain("'alerts'")` sobre `floating-tab-bar.tsx` y
   `not.toContain('alerts')` sobre `_layout.tsx`; el test escribe
   `not.toContain("name: 'alerts'")` (acotado al bloque `const TABS`) y
   `not.toContain('<Tabs.Screen name="alerts"')`. Lo que de verdad cierra R5 —que
   `TABS` siga en **cinco** entradas y `_layout.tsx` en **cinco** `<Tabs.Screen>`—
   sí está asertado en ambos ficheros, y una sexta pestaña pondría rojo el
   recuento. Cambio aceptable.

2. **R8, `isDisabled` más amplio de lo pedido.** `isDisabled={ackingId !== null}`
   deshabilita el ack de **todas** las filas mientras vuela una petición; el
   requisito solo pedía el de "esa fila". Es más estricto, no menos, y el
   `ackingIdRef` ya garantiza la exclusión mutua. Sin acción.

3. **`alerts-action-error` compartido entre R8 y R9.** Si falla una página
   siguiente, `laterPageFailed` queda `true` para siempre, así que el mensaje
   sobrevive al "se limpia al iniciar el siguiente ack" de R8. Las dos
   cláusulas comparten `testID` y la spec no resuelve el solape. No es defecto.

4. **`STATUS.md` desactualizado** (71/88 vs 71/89) por el alta de #90. Del
   leader, no de Codex; `init.sh` lo avisa y sigue en exit 0.

---

## Qué hay que hacer para aprobar

Dos correcciones, **ambas solo de test**, sin tocar una línea de producción:

1. Fijar por posición los tres textos dentro de `row.children[1]` en el `it.each`
   de `#78 R6`, con su sonda vista en rojo y documentada en
   `progress/impl_mobile-alerts-center.md`.
2. Asertar la `className` del título de la pantalla en `#78 R4`.

Nada más. R1-R5, R7-R13 y las ocho enmiendas quedan aceptados tal como están, y
la trazabilidad no necesita reapuntar ningún hash.

R14 sigue siendo gate humano, independiente de esto.

---

## Output de `./init.sh`

Ejecutado por el reviewer, **en primer plano**, con `env -u FORCE_COLOR` (bug #75)
y tras comprobar con `pgrep -af 'init\.sh'` que no había otra corrida usando el
Postgres compartido. Dos corridas completas, las dos verdes. **No cayó el flake
#72** en ninguna de las dos.

```
INIT_EXIT=0
```

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

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
⚠️  Feature en progreso: mobile-alerts-center
⚠️  STATUS.md desactualizado (71/88 declarado vs 71/89 real)

→ Build...
✅ Build exitoso

→ Ejecutando tests...

  backend
  Test Suites: 163 passed, 163 total
  Tests:       1246 passed, 1246 total

  infra
  Test Suites: 2 passed, 2 total
  Tests:       14 passed, 14 total

  mobile
  Test Suites: 73 passed, 73 total
  Tests:       1230 passed, 1230 total
  Snapshots:   1 passed, 1 total

→ Tests e2e...
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 357 passed, 365 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 71/89 completadas | 17 pendientes
```

Estado del árbol al terminar la revisión: `git status --short` vacío,
`git diff` vacío, HEAD `5a51d596`.
