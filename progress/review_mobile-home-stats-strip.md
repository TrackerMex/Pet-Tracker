# review: mobile-home-stats-strip (#69)

Fecha: 2026-09-08
Revisor: agente `reviewer` (Claude)
Implementador: Codex CLI
Branch: `feature/69-mobile-home-stats-strip`
Rango revisado: `9eff2b9` (excluido) → `182a450` (HEAD local)
Base de medición de deltas: `9358cc7`
Firma D1 del humano: `72873d5` (en `origin`, todavía no fusionada al árbol local)

**Veredicto: APROBADO**

Único gate pendiente: el smoke humano en dev build de Android, en tema claro y
oscuro. D1 **está firmada** y verificada limpia (ver §D1). Ninguna de las siete
observaciones bloquea.

---

## Método

No se ha dado por válida ninguna cifra del informe del implementer. Todo lo que
sigue está rehecho por el reviewer: `./init.sh` corrido dos veces en primer
plano, las seis mutaciones de R15b replantadas una por una, cuatro sondas
adicionales que la spec no pedía, y cada `grep` de deltas de R14 recalculado
contra `9358cc7`.

El árbol quedó limpio (`git status --short` vacío) después de cada mutación y
antes de cada corrida de `init.sh`. No se editó código de aplicación de forma
permanente.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#69, confirmado
      también por el aviso de `init.sh`)
- [x] `progress/current.md` describe la sesión activa y registra el cierre
      técnico de D1 y las seis mutaciones
- [x] La feature **no** se marcó `done`, no se abrió PR y no se hizo merge
- [x] Codex no tocó `feature_list.json`: el `+52` del rango es de `ae3837f`,
      commit del leader que abre #78 y #79
- [x] `progress/history.md` — N/A, la sesión de #69 no está cerrada todavía

## Checklist C3 — Arquitectura

Aplicada en su lectura móvil (`docs/architecture.md`); #69 es puramente de
presentación y no cruza ninguna capa.

- [x] Cero ficheros de `backend-pet-tracker/`, `infra/` y `hosting/`
- [x] `src/api/` y `src/hooks/use-api.ts` **sin tocar**: la tira se alimenta de
      los dos `useApi` que la Home ya tenía
- [x] `fmtKg` es una función pura en `src/screens/home/format.ts`, sin IO ni
      dependencia de vista
- [x] Ningún componente compartido tocado (`card.tsx`, `pet-hero-header.tsx`,
      `pet-switcher.tsx`); la tira son ~90 líneas de JSX en un solo sitio, que
      es lo que autoriza la carta §Decisiones fijas 4

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra: `#69 R1`, `#69 R2`,
      `#69 R7`, `#69 R9`, `#69 R10`, `#69 R11`, `#69 R12`, `#69 R13`, `#69 R14`
      y el `describe` de R1 que cubre R3, R4, R5, R6 y R8
- [x] Historial en tríos visibles **rojo → verde → traza**, uno por requisito, en
      el orden que prescribe `tasks.md`. Los 48 commits del rango se revisaron
      uno a uno con su lista de ficheros
- [x] Los rojos que tocan `index.tsx` lo hacen porque el rojo se fabrica
      plantando la mutación que el test debe matar — la vía (b) de C4, declarada
      por escrito en la spec antes del handoff
- [x] **Ningún rojo falla por `ReferenceError`.** Comprobado ejecutando cuatro
      rojos representativos con los ficheros de su propio commit:

  | Commit rojo | Falla por | Aserción |
  |---|---|---|
  | `71c24f6` (R3) | `#69 R1 › asigna cada valor a su celda y a ninguna otra` | `toHaveTextContent` |
  | `5b0738a` (R7) | `R9 › #69 R7: degrada el peso a un guion cuando el perfil no resuelve` | `toHaveTextContent` |
  | `1586d07` (R15b) | `#69 R1 › coloca la tira sobre la tarjeta del collar` | `toEqual` sobre el orden |
  | `e090688` (D1) | candado de longitud del catálogo, 276 contra 277 | `toHaveLength` |

- [x] `6c170da` restaura `src/screens/home/index.tsx` **byte a byte** al estado
      previo al rojo `1586d07` (`git diff 165f07d 6c170da -- index.tsx` vacío)

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente": las 17 filas (R1–R15b)
      tienen hash de rojo y de verde
- [x] Los hashes citados existen y sus mensajes coinciden literalmente con la
      tabla
- [x] Formato de commit `feat|fix|docs(mobile-home-stats-strip): <desc> (R-ids)`
      en los 48 commits del rango

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla §Aprobación marcada con fecha (`:555`, 2026-09-08)
- [x] Casilla §D1 marcada (`:513`) por el humano en `72873d5`
- [x] Ningún requisito modificado después de la aprobación: ningún commit de
      Codex posterior a `b7b23e6` toca `requirements.md`

## Checklist C7 — Sin código huérfano

- [x] #69 no reemplaza ningún módulo: extiende la tira de 3 celdas a 4 **en el
      mismo sitio** y la sube de posición. `git diff --diff-filter=D` vacío
- [x] Cero restos de la tira antigua: no queda ninguna referencia a
      `flex-row justify-between gap-3` en `screens/home/`, y `summary-walks`
      solo aparece en la aserción negativa de R5
- [x] Los `testID` `summary-card`, `summary-card-title`, `summary-activity`,
      `summary-sleep`, `summary-distance`, `summary-skeleton` y `summary-note`
      conservan su nombre

## Checklist C8 — UI móvil conforme a la carta

Grep-clean rehecho por el reviewer sobre los cinco ficheros de la feature:

- [x] Cero hexadecimales, cero clases arbitrarias `[...]`, cero `StyleSheet`,
      cero `shadowColor/shadowOffset/shadowOpacity/shadowRadius/elevation:`
- [x] Radios en `index.tsx` solo `rounded-card`, `rounded-xl`, `rounded-full`
- [x] Barrido repo-wide: 7 hex fuera de `src/theme/`, todos en *mocks de tema*
      de ficheros de test ajenos (`health.test.tsx` ×5, `add-pet/index.test.tsx`
      ×2, `add-reminder/index.test.tsx` ×2), **delta 0 contra `9358cc7`**
- [x] Skeleton dimensionado conservado (`summary-skeleton`, `h-16 w-full
      rounded-xl`), no spinner suelto
- [x] Componentes compartidos reutilizados: la tira vive dentro del `Card`
      compartido, sin fork local
- [x] Celdas **no** tappables — correcto por R12: no hay `Pressable`, ni
      `onPress`, ni `accessibilityRole="button"`, así que la regla de touch
      target ≥ 44pt no aplica
- [x] Cero animaciones nuevas

---

## Las seis mutaciones de R15b, replantadas por el reviewer

Replantadas una por una sobre el árbol de `182a450`, ejecutadas y restauradas.
Ninguna se leyó de la tabla del implementer.

| # | Mutación | Resultado | Aserción que la mata |
|---|---|---|---|
| 1 | celda 1 pinta `activeMinutes` en vez de `currentWeightKg` | **ROJO** | `index.test.tsx:1318` — `summary-weight` esperaba `12.4 kg` |
| 2 | celda 2 pinta `restMinutes` en vez de `activeMinutes` | **ROJO** | `:1319` — `summary-activity` esperaba `1h 35m` |
| 3 | celda 3 pinta `distanceM` en vez de `restMinutes` | **ROJO** | `:1320` — `summary-sleep` esperaba `45m` |
| 4 | celda 4 pinta `currentWeightKg` en vez de `distanceM` | **ROJO** | `:1321` — `summary-distance` esperaba `2.4 km` |
| 5 | `fmtKg(null)` devuelve `'0 kg'` | **ROJO** | `format.test.ts:5`, y además dos `it` del bloque `R9: summary degrada con gracia` |
| 6 | `summary-card` se monta detrás de `collar-card` | **ROJO** | `#69 R1 › coloca la tira sobre la tarjeta del collar` |

Las cuatro primeras —el mismo discriminante de R3 en sus cuatro sitios, que es
la lección de #68— caen **cada una en su propia línea de aserción**, no en una
genérica. El candado de R3 mira las cuatro posiciones, no un subconjunto.

La mutación 5 mata además `shows dashes instead of zero for missing metrics` y
`#69 R7: degrada el peso a un guion cuando el perfil no resuelve`: la
degradación está fijada sobre la salida renderizada, no solo en el test unitario
del formateador.

---

## D1 — el candado de longitud de catálogo

**La firma es limpia.** `git show 72873d5`: un fichero, una línea, exactamente
`requirements.md:513` de `- [ ]` a `- [X]`. No coló nada más.

**El cambio autorizado es literalmente el único cambio.** El diff completo de
`src/providers/__tests__/language-provider.test.tsx` en todo el rango es:

```
-    expect(englishKeys).toHaveLength(260 + 16);
+    expect(englishKeys).toHaveLength(260 + 16 + 1);
```

- La base queda **visible como suma**, no aplanada a `277`.
- `expect(spanishKeys).toEqual(englishKeys)` — intacto, línea sin tocar.
- El bucle que compara marcadores entre idiomas — intacto, líneas sin tocar.
- Ninguna otra línea del fichero, y nada más de `src/providers/`.

**El candado sigue vivo.** Tres sondas independientes, todas rojas:

| Sonda | Qué se plantó | Resultado |
|---|---|---|
| A | clave sin par, solo en `en` | **ROJO** — `Expected length: 277`, `Received length: 278` |
| B | clave con par en los dos idiomas | **ROJO** — mismo assert, 277 vs 278 |
| C | una clave renombrada **solo en `es`**, longitud idéntica | **ROJO** por el `toEqual`, que es justo lo que D1 prohibía debilitar |

La sonda C es la que importa para D1: con la longitud cuadrando, el `toEqual`
tiene que ser quien cace la divergencia, y lo hace. El candado no quedó
decorativo.

---

## La corrección central: Descanso, no Paseos

- [x] `walkCount` sigue **solo** en el hero. El bloque `highlight={...}` de
      `index.tsx` es **byte a byte idéntico** al de `9358cc7`
- [x] Cero celda de paseos: `summary-walks` no existe, y el test asserta que
      `summary-card` no contiene el texto `Paseos`
- [x] Ninguna celda repite un número ya visible: la tira pinta
      `currentWeightKg`, `activeMinutes`, `restMinutes` y `distanceM`; el hero
      pinta `walkCount`; el detalle de la gráfica solo aparece tras tocar
- [x] La celda 3 es `Descanso` y su etiqueta está fijada por el `it` de R4
      (`within(sleepValue.parent!).getByText('Descanso')`)

## R7 — la fila entera aparece y desaparece junta

- [x] Las cuatro celdas están bajo un único `activity.data?.kind === 'ok'`. La
      celda de peso **no** se emancipa (eso es #77, abierta a propósito)
- [x] `summary-skeleton`, `summary-note` y los tres `kind` de error conservan su
      conducta y su copy
- [x] **Recuento verificado**: `describe('R9: summary degrada con gracia')`
      tenía **6** `it` en `9eff2b9`, no los cinco que decía la spec, y ahora
      tiene **7**. La premisa de la spec era falsa; el informe de Codex acierta
- [x] **Ningún assert debilitado.** El diff de `index.test.tsx` en todo el rango
      `9358cc7..HEAD` no contiene **ni una sola línea eliminada**. Lo único que
      pasó en ese `describe` fue añadir la fixture de peso `null` y un `expect`
      más al `it` de guiones, más el `it` nuevo
- [x] Los tests de #67 (`R7: el hero pinta los paseos de hoy`) y de #68
      (`R14`, orden en el árbol) siguen verdes **sin tocarlos**

## R12 y contraste

- [x] Cuatro anuncios separados, no uno: la fila contenedora no declara
      `accessible` ni `accessibilityLabel`, y el test lo asserta explícitamente
- [x] Celdas no táctiles: ni `Pressable`, ni `onPress`, ni `accessibilityRole`
- [x] Contraste recalculado sobre los tokens que la implementación **usa de
      verdad** — la tira vive en `Card` variante `surface`, luego el fondo es
      `--surface`, no `--background`:

  | Par | Claro (`#FFFFFF`) | Oscuro (`#161B22`) | Umbral | Veredicto |
  |---|---:|---:|---|---|
  | valor `text-foreground` (14px bold) | **18.92:1** | **16.28:1** | 4.5:1 | AAA |
  | etiqueta `text-muted` (`--text-2xs` = 10px) | **4.97:1** | **6.81:1** | 4.5:1 | AA |
  | icono `color={muted}` (objeto gráfico) | **4.97:1** | **6.81:1** | 3:1 | pasa |
  | divisor `border-r border-border` | 1.16:1 | 1.25:1 | — (decorativo) | ver obs. 4 |

## R14 — deltas rehechos contra `9358cc7`

Cada `grep` recalculado por el reviewer. Ninguna cifra bajó, ningún assert se
debilitó, cero reubicaciones.

| Inventario | Base `9358cc7` | HEAD | Delta | Declarado |
|---|---:|---:|---:|---|
| `TABULAR_NUMS` en `screens/home/index.tsx` | 4 | 5 | **+1** | +1 ✔ |
| `CONTINUOUS_CORNER` en `screens/home/index.tsx` | 1 | 1 | **0** | 0 ✔ |
| Filas de `R3_HOME` en `ui-copy-table.ts` | 36 | 37 | **+1** | +1 ✔ |
| Claves del catálogo (`es`, y `en` por el `toEqual`) | 276 | 277 | **+1** | +1 ✔ |
| `describe` en `design-drift.test.ts` | 7 | 8 | **+1** | +1 ✔ |
| `SCREEN_FILES` (`ui-language.test.ts:357`) | `19 + 2` | `19 + 2` | **0** | 0 ✔ |
| `legibility-classnames.test.ts` (#61 R4) | — | sin diff | **0** | 0 ✔ |
| #62 R1 botones primarios (`consistency-classnames.test.ts:102`) | — | sin diff | **0** | 0 ✔ |

El total cerrado de #62 R15 subió `14 + 4` → `14 + 4 + 1`, y el candado de
catálogo `260 + 16` → `260 + 16 + 1`: los dos conservan la base como suma.
Codex añadió además un `it` nuevo (`#69 R14`) que expresa el delta tabular como
resta contra una constante `HOME_TABULAR_AT_9358CC7`, que es más fuerte de lo
que R14 pedía.

## Deriva

- [x] Cero ficheros de `backend-pet-tracker/`, `infra/`, `hosting/`
- [x] Cero dependencias nuevas: `package.json` y los lockfiles sin diff
- [x] Cero tokens nuevos: `src/theme/` sin diff (`global.css` incluido)
- [x] `src/api/`, `src/hooks/`, `src/components/`, `src/app/` sin diff
- [x] `weekly-activity-chart.tsx` y `weekly-activity-chart.test.tsx` **sin
      diff**: ni un `testID` de #68 tocado
- [x] **No hay un séptimo fichero.** Los 10 ficheros de `mobile-pet-tracker/`
      tocados son los 9 que enumera `design.md` §5 más
      `providers/__tests__/language-provider.test.tsx`, que añade D1. Fuera de
      ahí solo `specs/mobile-ui-language/design.md` (declarado en §5), los
      documentos obligatorios de `specs/` y `progress/`, y el
      `feature_list.json` del leader

---

## Observaciones

Ninguna bloquea. Las dos primeras son huecos de cobertura de la **spec**, no
defectos de la implementación: Codex escribió exactamente los tests que la spec
prescribía, y el reparto real de iconos y etiquetas en el árbol **es correcto**.

1. **El reparto icono↔celda no tiene candado.** Intercambiar `Weight` (celda 1)
   y `Moon` (celda 3) en `src/screens/home/index.tsx:236` y `:266` deja la suite
   entera en verde (194/194 en `index.test.tsx` + `src/__tests__/`): el test de
   R9 solo cuenta cuatro `<X size={20} color={muted} />` y el import de `Weight`.
2. **El reparto etiqueta↔celda tampoco.** Intercambiar `t('home.weight')`
   (`:249`) y `t('home.distance')` (`:288`) deja la suite en verde: solo la
   etiqueta de la celda 3 está fijada, por el `it` de R4. La app podría pintar
   `12.4 kg` bajo "Distancia" sin que nada se ponga rojo. Sumadas a la 1, son la
   quinta y sexta posición: la tabla de R1 decide **tres** cosas por celda
   —valor, icono y etiqueta— y solo el valor está bajo candado. Es exactamente
   el patrón de #68; conviene que el `spec_author` lo recoja para la próxima
   feature de la Home, o cerrarlo con un `it` de tres líneas.
3. **R12 se cumple en su test pero no en su frase.** Las celdas no declaran
   `accessible`, así que cada `Text` es un nodo propio: TalkBack para **ocho**
   veces (valor y etiqueta por separado), no las "cuatro, cada uno leyendo su
   valor y su etiqueta" que pide la frase normativa de R12. Es idéntico a la
   tira de 3 celdas anterior, así que no es regresión, y el test prescrito solo
   verificaba que la fila no se colapsara. Es lo que hay que escuchar en el
   smoke; el arreglo sería `accessible` + `accessibilityLabel` en el `View` de
   cada celda.
4. **Los divisores son el punto frágil del smoke.** `--border` es
   `rgba(13,17,23,0.07)` en claro y `rgba(255,255,255,0.08)` en oscuro: 1.16:1 y
   1.25:1 sobre `--surface`. El token es preexistente, pero con cuatro celdas
   más estrechas los divisores cargan con más trabajo visual, y el guion humano
   pide expresamente "que los tres divisores se ven en los dos temas".
5. **El test de R8 congela un absoluto donde la spec pedía una comparación.**
   `index.test.tsx` fija `{ detail: 1, activity: 1 }` como literal en vez de
   comparar contra el escenario equivalente. Funciona —una llamada nueva lo pone
   rojo, y el diff prueba que no se añadió ninguna— pero un absoluto escrito a
   mano es justo lo que R14 dedica una página a prohibir.
6. **`origin` y el árbol local divergen en `b7b23e6`.** La firma de D1
   (`72873d5`) está solo en `origin`; los seis commits posteriores de Codex
   (`e090688`..`182a450`) están solo en local. **Lo que hay hoy en el remoto no
   es el árbol revisado.** Los ficheros son disjuntos, así que reconciliar es
   trivial, pero el PR tiene que salir de la rama ya fusionada, no de lo que
   `origin` tiene ahora.
7. **`init.sh` avisa de `STATUS.md` desactualizado** (64/75 declarado contra
   64/79 real). Es colateral del commit de backlog del propio leader
   (`ae3837f`, #78 y #79), no de #69. Los otros dos avisos —tres claves ausentes
   en `.env` y la versión mínima de Node para el AWS SDK— también son
   preexistentes y ajenos.

**No se reprodujo el flake de #76** (`health-vaccines.e2e-spec.ts:497`): las dos
pasadas de `init.sh` salieron verdes a la primera.

---

## Gate humano pendiente

El único que queda es el **smoke en dev build de Android** (nunca Expo Go), en
tema claro y oscuro, con el guion de `requirements.md` §Aprobación. Los dos
puntos a los que conviene prestar atención extra, por las observaciones 3 y 4:
cuántas paradas hace TalkBack al recorrer la tira, y si los tres divisores se
distinguen en los dos temas.

Sin ese smoke la feature no pasa a `done`, tenga la trazabilidad las filas que
tenga.

---

## Output de `./init.sh`

Corrido dos veces por el reviewer, en primer plano, con
`env -u FORCE_COLOR ./init.sh` (bug #75), tras comprobar con `pgrep` que no
había otro gate en un worktree hermano. **Exit 0 las dos veces**, 4m54s la
primera. Árbol limpio en ambas.

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-home-stats-strip
⚠️  STATUS.md desactualizado (64/75 declarado vs 64/79 real)

→ Build...
> backend-pet-tracker@0.0.1 build   > nest build && tsc-alias -p tsconfig.build.json
> pet-tracker-infra@0.0.1 synth     > cdk synth --quiet
✅ Build exitoso

→ Ejecutando tests...
  backend  Test Suites: 163 passed, 163 total   Tests: 1243 passed, 1243 total
  infra    Test Suites:   2 passed,   2 total   Tests:   14 passed,   14 total
  harness  env-drift (node:test, TAP)           ok
  móvil    Test Suites:  68 passed,  68 total   Tests: 1041 passed, 1041 total
           Snapshots: 1 passed, 1 total         Time: 38.209 s
✅ Tests pasados

→ Tests e2e...
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
Time:        100.139 s
✅ Tests e2e pasados

→ Lint...
> eslint "{src,apps,libs,test}/**/*.ts" --fix
> eslint "{bin,lib,test}/**/*.ts"
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 64/79 completadas | 14 pendientes
```

Contra `9358cc7` (baseline en `current.md`: móvil 67 suites y 1025 tests) el
delta móvil es **+1 suite** (`format.test.ts`) y **+16 tests**: los 3 de
`fmtKg`, los 10 del `describe` de #69 en `index.test.tsx`, el `#69 R7` del
bloque de degradación, y los 2 `it` nuevos de los candados (`#69 R14` en
`consistency-classnames.test.ts` y `#69 R13` en `design-drift.test.ts`).
Ninguna cifra bajó.
