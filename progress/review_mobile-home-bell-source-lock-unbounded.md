# review: mobile-home-bell-source-lock-unbounded (#121)
Fecha: 2026-09-24T16:03Z
Veredicto: **APROBADO**

- Worktree: `/home/claude/sites/Pet-Tracker`. Branch:
  `feature/121-mobile-home-bell-source-lock-unbounded`. HEAD revisado:
  `2c84acac`, comprobado al empezar y al terminar. Es el merge de `origin/main`
  `70f841f3` (#84) sobre el último commit de Codex, `1bb01d41`.
- Base: `origin/main` = `70f841f3` (lo confirma `git ls-remote`), que es también
  el merge-base. Antes del merge, el merge-base era `f44cf3d5`, la base que mide
  la spec. `git diff f44cf3d5 c94e0cbf -- mobile-pet-tracker/ docs/` sale vacío.
- Todo lo de este informe lo he medido yo. El reporte de Codex solo me ha servido
  para saber qué contrastar. Todas las mediciones van sin pipe
  (`cmd > f 2>&1; echo "exit=$?"`), y jest con `--runTestsByPath`
  comprobando `Test Suites: 1`. Los logs están en el scratchpad del leader,
  `…/scratchpad/rev121/`.

## Checklist C2 — Estado coherente
- [x] Como mucho una feature `in_progress`: hay **cero**. Lo he comprobado en
      HEAD replicando el chequeo de `init.sh`. `STATUS.md` declara 101/123, que
      es también el real. Ver Obs. 5: #121 sigue en `spec_ready`.
- [x] `progress/current.md` describe la sesión activa de #121. Su línea de fase
      todavía dice «Codex implementando». Ponerla al día le toca al leader al
      cerrar.
- [x] Codex no ha tocado `progress/history.md`, `progress/current.md`,
      `STATUS.md` ni `feature_list.json`: `git log c94e0cbf..1bb01d41` sobre
      esos ficheros sale vacío.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica. El diff acumulado no toca
      `backend-pet-tracker/`, y en `mobile-pet-tracker/` solo cambia
      `src/screens/home/index.test.tsx`.
- [x] repositorios y contratos en domain como interfaces puras: no aplica.
- [x] application depende de interfaces: no aplica.
- [x] infrastructure sin lógica de negocio: no aplica.

## Checklist C4 — TDD
- [x] **Cada R-id tiene un test que lo nombra, o su ausencia está declarada.**
      `#121 R1: usa la ruta real sin cast Href y conserva el feedback de
      pulsado, acotado a su tag de apertura` nombra R1 y sigue dentro de
      `#78 R10: la campana vive en el hero…` (lo confirma el JSON de jest). R2 y
      R3 son requisitos de verificación y los cierra ese mismo test por la vía
      (b). Quedó declarado antes del handoff en tasks.md y en traceability.md
      (`24157f80` y `6df6581f`, anteriores a `f76da227`). R4 y R5 no tienen
      test, y así lo declara requirements.md §Qué firma, punto 8.
- [x] **El historial va test primero, por la vía (b). Lo he comprobado
      ejecutándolo.** El `index.tsx` del rojo lleva N1 en producción; no hay
      ningún doble mutado:

| Estado | Cómo lo reproduje | Medido por mí |
|---|---|---|
| N1 con el test **viejo** | `0c50bf5a:index.tsx` + `c94e0cbf:index.test.tsx` | `exit=0`, **140/140 verde**: el agujero existe |
| rojo `0c50bf5a` | `git checkout 0c50bf5a -- mobile-pet-tracker/` (árbol móvil idéntico al del commit, blob `675ae7a1…`) | `exit=1`, **1 failed / 139 passed** |
| verde `5fbf2aba` + R4 (`f2c95482`) + merge | HEAD `2c84acac` | `exit=0`, **140/140** |

  El rojo sale **solo** del `#121 R1`, en `index.test.tsx:236`
  (`expect(block).toMatch(`). No hay `ReferenceError` (`grep -c` da 0), no
  falla otra aserción del `it` y no cae ningún otro test:

```
● #78 R10: la campana vive en el hero y lleva al centro de alertas › #121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura
    expect(received).toMatch(expected)
    Expected pattern: /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/
    Received string:  "<Pressable
                  testID=\"home-alerts-bell\"
                  …
                  style={{ opacity: 1 }}
                  onPress={() => router.push('/alerts')}
                >
                  "
```

  El `Received string` es el tag propio: empieza por `<Pressable`, lleva
  `style={{ opacity: 1 }}`, termina en el `>` más el sangrado y no contiene
  `<Bell`. Restauré con `git checkout HEAD -- mobile-pet-tracker/`, y
  `git diff --exit-code HEAD` dio 0.
- [x] Ningún rojo por `ReferenceError`: `anchor` y `block` nacen en el mismo
      commit rojo que los usa.
- [x] Ningún rojo por mutar un doble: el rojo muta `src/screens/home/index.tsx`
      (N1) y el verde lo revierte (`675ae7a1` → `dbb5b034`).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente». Los cinco R-ids tienen test o
      «sin test» declarado, más sus commits.
- [x] Los hashes resuelven y son ancestros de HEAD (`git merge-base
      --is-ancestor`): `0c50bf5a`, `5fbf2aba` y `f2c95482`. Nadie ha rebaseado
      después de rellenarlos. El merge `2c84acac` los conserva.
- [x] Los commits siguen el formato con R-ids: `test(mobile): … (R1,R2)` ×2,
      `docs(mobile): … (R4)` y `docs(mobile): … (R3,R5)`. Son los mensajes
      literales de tasks.md. El tipo `test`/`docs` en vez de `feat` es la
      convención de la spec, igual que en #109 y #112.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y la casilla marcada
      (2026-09-24). La firma es `6df6581f`, del leader por delegación, y cita la
      página de Notion, el `Estado del gate` y `page_last_edited_at`.
- [x] Ningún requisito cambió después de la firma: desde `6df6581f`, lo único
      que cambia en `specs/mobile-home-bell-source-lock-unbounded/` son las
      columnas de hash de traceability.md (`1bb01d41`).

## Checklist C7 — Sin código huérfano
- [x] La aserción contra el fichero entero desaparece: `grep -n
      "expect(source).toMatch(" …/index.test.tsx` da `exit=1`. No queda otra
      copia.
- [x] No hay tests de código eliminado.
- [ ] N/A: la feature no reemplaza ningún componente ni módulo.

## Checklist C8 — UI móvil
- [x] Grep-clean: el diff de producción es vacío. En el test, la palabra
      `StyleSheet` no aparece y la única cita `#` es de la forma `#121 R1` (dos
      apariciones: el título y el comentario). `design-drift.test.ts` da
      **55/55** en HEAD. Además comprobé que los guards miran este fichero:
      cambiar el comentario a `… reminders-see-all (#121): …` pone **5 rojos**,
      los cinco guards que cita design.md. Revertido.
- [x] Feedback pressed de la campana: la receta sigue en producción, porque el
      blob de HEAD es el de la base.
- [x] Dimensiones, Skeleton, componentes compartidos y animaciones: no aplican,
      porque no cambia ninguna superficie de UI.

## Verificación por requisito

### R1: el recorte y el `it`, literales
- Comparé por programa el bloque ```` ```ts ```` de tasks.md §R1 (1), con el
  comentario de §R4 (1) intercalado entre el `const anchor` y el `const block`,
  contra HEAD. Aparece **idéntico**. El bloque sin el comentario aparece
  idéntico en `0c50bf5a`.
- Otras aserciones: en el diff acumulado, la ruta (`appRoutes`), el cast
  (`not.toContain("'/alerts' as Href")`) y el icono
  (`toContain('<Bell size={24} color={muted} />')`) son líneas de **contexto**.
  Son byte a byte las de antes, siguen contra `source` y mantienen el orden
  ruta, cast, receta, icono. La regex no cambia.
- El diff de `index.test.tsx` contra `origin/main` es **un solo hunk**, dentro
  de este `it`. El `#112 R1` de `reminders-see-all` queda intacto y pasa en el
  JSON de B0. `-t 'usa la ruta real sin cast Href'` sigue seleccionando un solo
  `it`.

### R2 y R3: las dieciséis sondas, re-medidas todas
Las medí todas, no solo las cinco que pedía el leader. Cada una la escribe un
script (`rev121/probe.py`) sobre el `index.tsx` de HEAD, con la mutación
literal de tasks.md aplicada por sustitución única (se asevera que el patrón
aparece una vez). Después corre jest sobre el fichero entero con `--json` y
restaura el original antes de la siguiente. «Otros» excluye el `#121 R1`. El
bloque lo mide el mismo script, y **coincide con la columna de design.md en las
17 filas**.

| | Exigido | Medido (`#121 R1`) | Matcher | Otros | Bloque |
|---|---|---|---|---|---|
| B0 | verde | verde, 140/140 | — | 0 | 489 |
| **N1** | ROJO | **ROJO** | `toMatch` | 0 | 454 |
| S1p | ROJO | ROJO | `toMatch` | 0 | 417 |
| V7 | ROJO | ROJO | `toMatch` | 0 | 489 |
| N1n | ROJO | ROJO | `toMatch` | 0 | 454 |
| **W1** | ROJO | **ROJO** | `toMatch` | 3 (#78 R10 compone…, #73 R9 píldora…, #78 R11 pinta…) | 453 |
| S2 | ROJO | ROJO | `toMatch` | 2 | 454 |
| S3 | ROJO | ROJO | `toMatch` | 2 | 454 |
| N2 | VERDE | VERDE | — | 0 | 489 |
| E2 | VERDE | VERDE | — | 0 | 491 |
| E3 | VERDE | VERDE | — | 0 | 489 |
| L2 | VERDE, render roto | VERDE | — | 119 | 530 |
| **P1** | VERDE (#122) | **VERDE** | — | 0 | 534 |
| **P2** | VERDE (#122) | **VERDE** | — | 0 | 529 |
| **P4** | VERDE (#122) | **VERDE** | — | 0 | 111 |
| **E1** | ROJO (declarado) | **ROJO** | `toMatch` | 0 | 76 |
| V6 | ROJO (declarado) | ROJO | `toMatch` | 0 | 520 |
| **A0** | ROJO, `""` (declarado) | **ROJO**, `Received string:  ""` | `toMatch` | 9, todos de #78 R10 y #78 R11 | 0 |

Coinciden las 17 con «Exigido» y con la tabla del reporte de Codex. Al terminar
cada tanda, `git diff --exit-code HEAD` dio 0.

### Sondas propias en zona ciega (lección de #65 y #112)
Las planté donde el candado podría no mirar: una cadena **dentro** del tag, una
anulación en tiempo de ejecución que `tsc` no para, un hijo que no se renderiza,
un ancla duplicada **renderizada** y un ancla en un comentario. Cada una la
medí con jest, la revertí y comprobé `git diff --exit-code HEAD` en 0. La
columna «Viejo» es jest con el `it` de `c94e0cbf` sobre la misma mutación.

| Sonda | Mutación | Nuevo (jest) | Viejo (jest) | tsc / lint | Familia |
|---|---|---|---|---|---|
| O1 | N1 + `accessibilityHint="…receta…"` dentro del tag | VERDE 140/140 | verde | 0 / 0 | P2: la regex casa con texto que no es código |
| **O2** | receta intacta + `{...bellPressOverride}` detrás, con `const bellPressOverride: { style?: { opacity: number } } = { style: { opacity: 1 } }` en el módulo | **VERDE 140/140**; **suite móvil 82/1471 verde** | verde | **0 / 0** | P3 que escapa a `tsc`. Ver Obs. 1 |
| O3 | N1 + `{false && '…receta…'}` antes del `<Bell` | VERDE 140/140 | verde | — | P1: límite 2 sin romper el render |
| O4 | campana intacta + `{/* testID="home-alerts-bell" */}` antes de su `<Pressable` | **ROJO** `toMatch`, 0 otros | verde | — | P4, pero hacia rojo. Ver Obs. 3 |
| O5 | `{hasOpenAlerts ? (campana con receta) : (campana con N1)}` | VERDE 140/140 | verde | 0 / 0 | P4 con código renderizado. Ver Obs. 2 |
| control | P3: `style={{ opacity: 1 }}` duplicado tras la receta | — | — | `tsc` exit 2, TS17001 | confirma que `tsc` ve el fichero |

**Ningún verde falso lo abre #121.** Los cuatro verdes (O1, O2, O3 y O5) ya eran
verdes con el candado viejo. Ninguno es un fallo del recorte: en los cuatro, el
bloque es el tag propio de la campana, o en O3 la ventana del límite 2, y la
receta está de verdad dentro. O1, O3 y O5 son variantes de P2, P1 y P4. **O2 es
de otra familia**: una anulación en ejecución que ningún candado de fuente ve.
La misma mutación sobre `reminders-see-all` deja el fichero en **140/140 verde**
pese a la pata de árbol de `#112 R1` (`opacityOf(...)toBe(1)` solo mira el
reposo). El hueco es del patrón, no de #121.

Criterio que aplico. El leader pide tratar como bloqueante «cualquier otro verde
falso nuevo». Leo «nuevo» como «abierto por #121»: el mismo criterio que el
veredicto de #112 (§Sondas propias: «dan el mismo veredicto con el recorte
viejo… no bloquean»). Además, el literal de R1 no deja al implementador margen
para cerrarlo. Si el leader lee «nuevo» como «no listado en la spec», O2 es el
único que entraría. Aun así, el arreglo sería de la spec o del patrón, no de
Codex.

### R4: comentario y bloque de conventions, literales
- El **comentario** de tasks.md §R4 (1) (4 líneas) está en HEAD justo encima del
  `const block`, justo debajo del `const anchor` y al mismo sangrado.
  Comparación por programa: idéntico.
- El **bloque** de tasks.md §R4 (2) aparece literal en `docs/conventions.md`.
  El diff de la sección es un solo hunk que sustituye solo el bloque que
  empezaba por «El patrón vive en tres candados.». La regla, los dos límites y
  el párrafo del segundo límite (el de #122) no cambian. El texto nuevo no cita
  números de línea.
- Greps de tasks.md §R4 (3), desde la raíz: `grep -c "lastIndexOf('<',
  anchor)" …/index.test.tsx` da `2`. `grep -n "expect(source).toMatch("` da
  `exit=1`. `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` da
  `exit=1`. `grep -n "tres candados" docs/conventions.md` da `exit=1`. El grep
  del patrón resuelve los cuatro call-sites que nombra el texto:
  `consistency-classnames.test.ts`, `food.test.tsx` y dos en
  `home/index.test.tsx`.

### R5: diff de producción vacío
- `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  da `exit=0`. También lo da el diff de dos puntos contra `origin/main`.
- Blobs: HEAD `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (igual que
  `origin/main`, `c94e0cbf` y `f44cf3d5`), y rojo `0c50bf5a`
  `675ae7a1c18b400c234a9dbef2950c1175aaf026`.
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` devuelve solo
  `src/screens/home/index.test.tsx | 13 +++++++++++--`.
- Alcance: `git diff --stat c94e0cbf 1bb01d41` da exactamente los cuatro
  ficheros del handoff: `docs/conventions.md`, `index.test.tsx`, el reporte y
  traceability.md. No se tocan `catalog.ts`, `language-provider.test.tsx`,
  `package.json`, `bun.lock` ni el `#112 R1`.

### Enmienda 1 (`test ! -e` en vez de `rm -f`): sólida
- `.expo/types/router.d.ts` no existe (`test ! -e` da `exit=0`), ni antes ni
  después de mis `tsc`, `expo lint` y jest.
- Lo decisivo es que el mtime del directorio `.expo/types/` es
  **2026-09-06T04:32:40Z** y no ha cambiado. Crear un fichero en él, aunque
  luego se borre, actualiza ese mtime. Así que nada creó el fichero durante la
  ventana de Codex (del reflog: 15:14–15:31Z), ni durante el `init.sh` del
  leader, ni durante mis corridas.
- El flujo de Codex (jest, `tsc`, `expo lint`, git y la edición de ficheros) no
  arranca Metro. Los tipos de `typedRoutes` los genera el servidor de
  desarrollo (`expo start`), que no se lanzó.
- La sustitución protege la misma precondición y ante un fichero presente para
  en vez de arreglar. Es lo que pide la enmienda. `.expo/` está gitignorado
  (`mobile-pet-tracker/.gitignore:7`).

### init.sh y el merge de #84
- **No lo he ejecutado**, por instrucción del leader: LocalStack y Postgres son
  compartidos y Backend los está usando. He leído el log entero del leader
  (`init_121_1bb01d41.log`, 18 682 líneas).
- **Validez.** `init_121.head` = `1bb01d41`. Según el reflog, HEAD fue
  `1bb01d41` entre 15:30:57Z y 15:37:02Z. El log se escribió entre 15:32Z y
  15:36Z. Vale para ese commit.
- **Contenido.** Entorno, dependencias, harness y build en verde. Backend unit
  170/1298, infra 2/14 y los tres tests de harness de node con `fail 0`. Móvil
  82/1452 con `PASS src/screens/home/index.test.tsx` y ningún `FAIL` en todo el
  log. e2e con 27 suites pasadas y 3 saltadas (389 tests + 8 saltados), la misma
  cifra que en los `init.sh` de #112 y #114. Lint y typecheck en verde y
  `exit=0`. Los `ERROR` de Nest son la salida esperada de tests de rutas de
  error, dentro de suites que pasan.
- **El merge.** `git diff --stat 1bb01d41 2c84acac` solo toca
  `mobile-pet-tracker/src/utils/reminder-dates{,.test}.ts`,
  `src/screens/reminders/index.test.tsx`, `STATUS.md`, `feature_list.json`,
  `progress/` y `specs/` de #84. Nada de `backend-pet-tracker/`, `infra/`,
  `init.sh`, `init.config.sh` ni de los `*.test.mjs` de la raíz. Ninguno de esos
  ficheros es de #121, y el merge es limpio (`git show --cc` sin hunks).
- **Lo re-medí sobre `2c84acac`.** Suite móvil `exit=0` con **82/1471** (la base
  de main tras #84, +19 de #84; delta de #121 **+0/+0**). `tsc --noEmit`
  `exit=0` y `expo lint` `exit=0`, las dos con salida vacía. Los chequeos de
  harness de `init.sh`: 0 `in_progress` y `STATUS.md` sincronizado. El
  argumento del leader me convence: repetir `init.sh` entero no es bloqueante.

## Observaciones

Ninguna bloquea. Las tres primeras son hallazgos (F) para que el leader decida
si los registra en #122 o con un id nuevo contra `origin/main`.

1. **(F, media) O2: una anulación con spread engaña a cualquier candado de
   fuente, y `tsc` no la para.** Con `{...override}` detrás de la receta, y el
   `style` del override tipado como **opcional**, la campana pierde el feedback
   de pulsado en ejecución. Aun así quedan verdes el fichero (140/140), la suite
   móvil entera (82/1471), `tsc` y `lint`. Es P3 (prop duplicada) por otra vía:
   con la prop duplicada, TS17001 lo tapa; con el spread de propiedad opcional
   no salta ni TS2783. El recorte no tiene la culpa, porque la receta está de
   verdad en el tag propio. Ya pasaba con el candado viejo, y pasa igual en
   `reminders-see-all`, medido: su pata de árbol solo asevera la opacidad en
   reposo. Solo lo cerraría una pata de árbol que pulse (`pressIn` → opacidad
   0.8). La spec de #121 la descartó para este candado (§Alternativas), así que
   es decisión de patrón, de #122.
2. **(F, baja) O5: el hueco de unicidad de P4 también se alcanza con código
   renderizado.** Un ternario con dos campanas (la primera con la receta y la
   segunda, la que se ve sin alertas, sin ella) deja todo verde con `tsc` y
   `lint` en 0. #112 (Obs. 3) lo calificó de «rebuscado» por el señuelo
   `{false && …}`. O5 es más plausible, y la aserción de unicidad que tiene #122
   (`indexOf === lastIndexOf`) también lo cerraría.
3. **(baja) O4: un rojo falso no declarado.** Un comentario JSX con
   `testID="home-alerts-bell"` antes de la campana, con la campana intacta,
   tumba `#121 R1` por `toMatch`, sin otros tests caídos. Con el candado viejo
   quedaba verde. Falla por el lado seguro y es la misma raíz, la unicidad del
   ancla. Contradice por poco la frase de design.md «no fabrican ningún rojo
   falso con código realista», aunque un comentario con la sintaxis `testID="…"`
   es poco realista.
4. **(baja) O1 y O3 son variantes de P2 y P1**: la receta en una prop de cadena,
   y un hijo `{false && '…'}` que no se renderiza. El segundo confirma lo que
   ya dijo #112 (Obs. 1): el límite 2 no siempre rompe el render.
5. **(estado, del leader) #121 sigue en `spec_ready` en `feature_list.json`.**
   No pasó a `in_progress` tras la firma, como piden `AGENTS.md:124` y
   `leader.md:60`. Seguramente fue para no tener dos `in_progress` mientras #84
   lo estaba, que es lo que hace abortar `init.sh`. #84 ya está `done`, así que
   al cerrar se puede registrar sin problema. `current.md` sigue diciendo
   «Codex implementando».
6. **(baja) La evidencia de Codex vive fuera del repo**, en `/tmp/121_*.log`,
   sin versionar. No afecta al veredicto, porque lo he re-medido todo.

## Output de ./init.sh
No lo ejecuté yo (ver §init.sh y el merge de #84). Estas son las líneas de
resumen del log del leader sobre `1bb01d41`, copiadas literales:

```
[0;32m✅ Sin features en progreso (sesión limpia)[0m
[0;32m✅ STATUS.md sincronizado con feature_list.json[0m
[0;32m✅ Build exitoso[0m
Test Suites: 170 passed, 170 total
Tests:       1298 passed, 1298 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# pass 28 / # fail 0 · # pass 5 / # fail 0 · # pass 15 / # fail 0
Test Suites: 82 passed, 82 total
Tests:       1452 passed, 1452 total
Snapshots:   1 passed, 1 total
[0;32m✅ Tests pasados[0m
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 389 passed, 397 total
[0;32m✅ Tests e2e pasados[0m
[0;32m✅ Lint sin errores[0m
[0;32m✅ Typecheck sin errores[0m
[0;32m✅ Todo verde. Listo para trabajar.[0m
exit=0
```

Mi re-medición móvil sobre `2c84acac`:

```
$ bunx jest --ci > rev121/suite_head.log 2>&1; echo "suite_head_exit=$?"
suite_head_exit=0
Test Suites: 82 passed, 82 total
Tests:       1471 passed, 1471 total
Snapshots:   1 passed, 1 total
$ test ! -e .expo/types/router.d.ts; echo "router_absent_exit=$?"
router_absent_exit=0
$ bunx tsc --noEmit > rev121/tsc_head.txt 2>&1; echo "tsc_exit=$?"
tsc_exit=0          (0 bytes)
$ bunx expo lint > rev121/lint_head.txt 2>&1; echo "lint_exit=$?"
lint_exit=0         (0 bytes)
```
