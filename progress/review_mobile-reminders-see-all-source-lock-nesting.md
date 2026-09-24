# review: mobile-reminders-see-all-source-lock-nesting (#112)
Fecha: 2026-09-24T03:59Z
Veredicto: **APROBADO**

- Worktree: `/home/claude/sites/Pet-Tracker`
- Branch: `feature/112-mobile-reminders-see-all-source-lock-nesting`
- HEAD revisado: `8bd8e27d`, comprobado al empezar y al terminar. El reflog no
  muestra movimientos de HEAD después del commit `8bd8e27d` (03:42:02Z), y el
  log de `./init.sh` es posterior (lo escribió el leader entre 03:47Z y
  03:51:12Z). El log vale para este HEAD.
- Base: `origin/main` = `993b62fa` (`git ls-remote` lo confirma) = merge-base.
- Todo lo de este informe lo he medido yo. El reporte de Codex solo ha servido
  para saber qué contrastar.

## Checklist C2 — Estado coherente
- [x] Solo una feature `in_progress` en `feature_list.json`: #112.
- [x] `progress/current.md` describe la sesión activa de #112. Su línea de
      estado todavía dice «esperando a Codex», y ponerla al día le toca al leader
      al cerrar.
- [x] Codex no ha tocado `progress/history.md`, `progress/current.md`,
      `STATUS.md` ni `feature_list.json`:
      `git log 09d77693..HEAD -- <esos cuatro>` sale vacío.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica. El diff acumulado no
      toca `backend-pet-tracker/`, y en `mobile-pet-tracker/` solo cambia
      `src/screens/home/index.test.tsx`.
- [x] repositorios y contratos en domain como interfaces puras: no aplica, por
      el mismo motivo.
- [x] application depende de interfaces: no aplica.
- [x] infrastructure sin lógica de negocio: no aplica.

## Checklist C4 — TDD
- [x] **Cada R-id tiene un test que lo nombra, o su ausencia está declarada.**
      `#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de
      apertura` nombra R1. R2 y R3 son requisitos de verificación y se cierran
      con ese mismo test por la vía (b). La spec lo declaró antes del handoff
      (tasks.md §R1+R2 y traceability.md). R4 y R5 no tienen test, y eso quedó
      declarado en requirements.md §Qué firma, punto 6. Es el mismo esquema que
      el reviewer aprobó en #109.
- [x] **El historial va test-primero, por la vía (b). Lo he comprobado commit a
      commit ejecutándolo.** Para reproducir cada commit en el árbol principal
      hice `git checkout <commit> -- <ficheros>`, corrí jest y restauré con
      `git checkout HEAD --`:

| Estado | Contenido | Medido por mí |
|---|---|---|
| N1 + test **viejo** (`89c8f317:index.tsx` + `09d77693:index.test.tsx`) | el agujero existe | `exit=0`, **140/140** verde |
| `89c8f317` (rojo) | recorte nuevo + título + **N1 versionada en producción** | `exit=1`, **1 failed / 139 passed** |
| `2597d29e` (verde) | revierte N1 | `exit=0`, **140/140** |

  El rojo de `89c8f317` sale **solo** del `#112 R1`, y **por `toMatch`**. No
  hay `toBe(1)`, ni `ReferenceError`, ni otro test caído:

```
● #70 R1: la Home dibuja la sección de recordatorios › #70 R10: enlace a la lista de recordatorios › #112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura
    expect(received).toMatch(expected)
    Expected pattern: /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/
    Received string:  "<Pressable
                    testID=\"reminders-see-all\"
                    accessibilityRole=\"button\"
                    className=\"min-h-11 justify-center\"
                    style={{ opacity: 1 }}
                    onPress={() => router.push('/reminders')}
                  >
                    "
    > 3339 |       expect(block).toMatch(
```

  El `Received string` prueba R1 de forma directa: el bloque es el tag de
  apertura propio y no contiene el `<Pressable style=` del hijo.

- [x] **La reversión deja `index.tsx` idéntico byte a byte.** Lo he comprobado
      por el hash del blob:

```
993b62fa -> dbb5b0346895cfc26705bee2257d1f8a8815df6c   (base)
09d77693 -> dbb5b0346895cfc26705bee2257d1f8a8815df6c
89c8f317 -> 51bee3d2c8e2484d240b11aed22332fef4536573   <- N1
2597d29e -> dbb5b0346895cfc26705bee2257d1f8a8815df6c   <- idéntico a la base
99dc211c -> dbb5b0346895cfc26705bee2257d1f8a8815df6c
8bd8e27d -> dbb5b0346895cfc26705bee2257d1f8a8815df6c
```

- [x] La mutación del rojo es de producción. No se ha mutado ningún doble
      (C4, quinto punto).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». R1, R2, R3 y R5
      apuntan a `89c8f317` → `2597d29e`, y R4 a `99dc211c`. Los tres hashes son
      ancestros de HEAD (`git merge-base --is-ancestor`).
- [x] Desde la firma, Codex solo ha tocado `traceability.md`, y dentro de él
      solo las celdas de commit: `git diff f61260b6 HEAD -- specs/…/` da un
      único fichero con 5 filas cambiadas, y todas son de hashes.
- [x] Formato de commit: `test(mobile): … (R1,R2)` y `docs(mobile): … (R4)`,
      literales de tasks.md y con sus R-ids. Es la convención que fija la
      propia traceability.md y la misma que se aceptó en #109. El cuarto commit,
      `docs(mobile): record #112 verification evidence (R3,R5)`, no está en
      tasks.md, pero hacía falta: versiona el reporte y los hashes, que solo
      existen después del commit de R4. Lleva sus R-ids.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada
      con fecha 2026-09-23. La firma es el commit `f61260b6`, vía Notion, con la
      página y `page_last_edited_at` citados en el mensaje.
- [x] No se ha modificado ningún requisito después de la aprobación.
      `requirements.md`, `design.md` y `tasks.md` no cambian entre `f61260b6` y
      HEAD.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza ningún componente ni módulo. El recorte
      viejo se sustituye en el mismo sitio y no deja nada colgando. Lo único
      que caduca es el párrafo de `docs/conventions.md` que anunciaba «un
      gemelo por migrar», y R4 lo sustituye. Las citas a `3355-3359` y a
      `lastIndexOf('<Pressable'` que quedan están en `progress/` y en
      `specs/mobile-meal-toggle-source-lock-nesting/`, que son registro
      histórico, y no se tocan.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep limpio. Las únicas líneas añadidas a `index.test.tsx` con `#` y un
      número son las dos de la forma exenta `#112 R1` (el título y la primera
      línea del comentario). No hay hex, ni `StyleSheet`, ni clases
      arbitrarias. `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`
      da `exit=0`, **55/55**.
- [x] Dimensiones, Skeleton, componentes compartidos, tappables y
      animaciones: no aplican, porque no hay superficie de UI. El diff
      acumulado de producción está vacío (R5).
- [x] Skills: el handoff pidió no cargar ninguna y el reporte dice «ninguna».
      **La decisión era correcta.** Es un cambio de dos `indexOf` en un test de
      jest más un comentario. De las 13 skills del catálogo de Codex
      (`.claude/agents/leader.md` §Catálogo real de skills de Codex), ninguna
      trata recortes de strings en tests, y `expo-overview` no existe en ese
      catálogo. Por mi parte cargué `expo:expo-overview` como pide CLAUDE.md, y
      no hay ninguna skill hoja que aplique.

## Verificación requisito a requisito

### R1: recorte de `<` a `<`, con el título fijado
- El diff de `89c8f317` sobre el test cambia solo el título y las dos líneas
  del recorte. El ancla, `opacityOf`, la pata de árbol y la regex son idénticas
  byte a byte.
- Medido en Node sobre la base: el bloque tiene **313** caracteres y **un solo
  `<`**, y termina justo antes de `<Text`. Coincide con design.md.
- El título viejo sobrevive como subcadena:
  `grep -c "muestra feedback visual al pulsar el enlace"` da 1. La cita de
  `specs/mobile-home-reminders-section/traceability.md` (fila R10) sigue
  resolviendo, y ese fichero no se ha tocado.

### R2: N1 y W1 en rojo por `toMatch`
- **N1**: probado arriba, en C4. Es la mutación versionada.
- **W1**: sonda propia, aplicada y revertida. `exit=1`, 4 failed / 136 passed.
  El `#112 R1` cae **por `toMatch`**. Los otros tres son los previstos:
  `#85 R1` ×2 y `#70 R1 › dibuja la cabecera y el cuerpo`. Bloque de 277
  caracteres. Con el recorte viejo la regex casaba.

### R3: sondas sin falsos rojos
Repetí las dos filas que la spec declara con cambio de veredicto, más una que
debe quedar verde:

| Sonda | Exigido | Medido por mí | Recorte viejo (Node) |
|---|---|---|---|
| **E1** `hitSlop={0 < 1 ? 8 : 0}` tras el ancla | ROJO `toMatch` | `exit=1`, 1/139. Solo cae el `#112 R1`, por `toMatch`. Bloque de 81 caracteres | casaba (verde) |
| **W1** | ROJO `toMatch` | ver R2 | casaba (verde) |
| **N2** anidado sin receta | VERDE | `exit=0`, 140/140 | casa |

Las otras diez filas de R3 (N1p, S1, S1p, S2, S3, E2, E3, V6, V7 y L2) no las
repetí. La tabla de Codex coincide fila a fila con «Exigido», los logs que
cita existen, y las tres filas que sí medí coinciden con las suyas.

**El candado no es tautológico (#106).** La regex es un literal del test. El
test no importa nada de `index.tsx` salvo `HomeScreen`, que es el sujeto del
render, así que no hay ningún símbolo de producción contra el que asevere. En
la base, la regex casa **una sola vez** dentro del bloque, en el índice 165,
que es exactamente la línea `style=`. Si esa línea se quita del bloque, la
regex deja de casar, así que no casa por accidente con otra parte del tag. En
el fichero la receta aparece **dos** veces (el señuelo `home-alerts-bell` y
`reminders-see-all`), y el bloque solo contiene la suya. V7, que la tabla de
Codex da en rojo con el árbol verde, confirma que la aserción mide un valor
exacto.

### Sondas propias en zona ciega (lección de #65)
Las planté donde el candado podría no mirar: el hueco entre el `>` y el primer
hijo, los comentarios dentro del tag, las props duplicadas y la unicidad del
ancla. Cada una se aplicó, se midió con jest y se revirtió, y
`git diff --exit-code HEAD` dio 0 al final. **Todas son verdes falsos que ya
existían: dan el mismo veredicto con el recorte viejo.** Ninguna es una
regresión de #112 y ninguna la exige la spec. Por eso **no bloquean**, pero
tres de ellas conviene registrarlas.

| Sonda | Mutación | Nuevo (jest) | Viejo (Node) | Lectura |
|---|---|---|---|---|
| **P1** | S1 + `{/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}` justo antes del `<Text` | **VERDE 140/140** | verde | Límite 2, pero **sin romper el render**. Ver Obs. 1 |
| **P2** | la línea de estilo comentada con `//` dentro del propio tag, más `style={{ opacity: 1 }}` | **VERDE 140/140** | verde | La regex casa con código comentado. Ver Obs. 2 |
| **P3** | `style={{ opacity: 1 }}` añadido **después** de la receta (prop duplicada) | VERDE 140/140 | verde | Lo tapa `tsc`: `TS17001 JSX elements cannot have multiple attributes with the same name` (`exit=2`). El gate de `init.sh` lo para, así que no hay nada que hacer |
| **P4** | S1 + un señuelo `{false && <Pressable testID="reminders-see-all" …receta… />}` **antes** del sujeto | **VERDE 140/140** | verde | El candado da por hecha la unicidad del ancla, pero no la asevera. Ver Obs. 3 |

### R4: comentario y párrafo, literales
- Comparé por programa con los bloques de tasks.md §R4: el **comentario** de
  5 líneas coincide línea a línea, está justo encima del `const block` y al
  mismo sangrado. El **párrafo** de `docs/conventions.md` aparece literal en
  el fichero.
- El resto de la sección está intacto: el diff de `99dc211c` sobre
  `docs/conventions.md` es un solo hunk que sustituye únicamente el párrafo que
  empezaba por «El patrón ya vive en». La regla, los dos límites y el párrafo
  del segundo límite no cambian.
- `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` da `exit=1`.
  `grep -n "3355\|309-311" docs/conventions.md` da `exit=1`.
- Los tres greps que el párrafo nuevo manda ejecutar resuelven:
  `consistency-classnames.test.ts:294`, `food.test.tsx:817` y
  `home/index.test.tsx:3339`.
- `design-drift.test.ts` sigue verde, con 55/55.

### R5: diff de producción vacío
- `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  da `exit=0`.
- `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` da
  `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, igual que en `993b62fa`.
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` devuelve solo
  `src/screens/home/index.test.tsx | 11 ++++++++---`.
- `bunx tsc --noEmit` sobre HEAD: `exit=0` y salida vacía.
  `.expo/types/router.d.ts` ya no existía y el `rm -f` me funcionó sin
  bloqueo.

### Alcance
`git diff --stat 09d77693 HEAD` da exactamente los cuatro ficheros que declara
el handoff: `docs/conventions.md`, `mobile-pet-tracker/src/screens/home/index.test.tsx`,
`progress/impl_mobile-reminders-see-all-source-lock-nesting.md` y
`specs/mobile-reminders-see-all-source-lock-nesting/traceability.md`. Codex no
tocó `catalog.ts`, `language-provider.test.tsx`, `package.json`, `bun.lock`,
`elementWithTestId` ni el candado de la campana.

## Observaciones

Ninguna bloquea. Las tres primeras son hallazgos (F) para que el leader decida
si los registra con id contra `origin/main`.

1. **(F, media) El límite 2 no avisa en un caso que la documentación da por
   ruidoso.** Con P1, un comentario JSX con la receta entre el `>` del tag y
   el `<Text`, el fichero queda **140/140 verde** con el propio tag en
   `opacity: 1`. `docs/conventions.md` recoge el límite («todo lo que viva
   entre el `>` … y el primer hijo elemento entra en el bloque»), pero justifica
   dejarlo sin defensa porque «en la práctica rompe media suite al
   intentarlo». Eso vale para una cadena hija (L2 tumba 118 tests), no para un
   comentario, que no se renderiza. El comentario de R4 («a string child …
   can pass green») es fiel a tasks.md y está bien copiado, pero se queda
   corto por el mismo motivo. El hueco afecta igual al `meal-toggle` de #109.
   Propuesta de registro: enmendar el cálculo de coste del límite 2 en
   conventions. No es de #112, porque su texto está firmado literal.
2. **(F, baja) La regex casa con código comentado.** Con P2, comentar la
   receta dentro del propio tag y poner `style={{ opacity: 1 }}` deja el
   candado en verde con los dos recortes. Lo que falla es lo que se busca, no
   la ventana, así que queda fuera de #112 por su propio §Fuera de alcance
   («no se toca la regex»). Lo anoto porque dejar el viejo `style=` comentado
   al refactorizar es un gesto realista.
3. **(F, baja) La unicidad del ancla es una precondición que el candado no
   asevera.** Con P4 (un señuelo con el mismo `testID` en una rama que no se
   renderiza, colocado antes del sujeto), `indexOf` coge el señuelo y el
   candado pasa en verde. Es rebuscado, y el design.md comprobó la unicidad a
   mano. Cerrarlo costaría una aserción de una línea
   (`indexOf === lastIndexOf`), pero sería otra decisión de patrón.
4. **Entorno: el rodeo de Codex con `router.d.ts` (peso bajo-medio, no
   bloquea).** El sandbox de Codex rechazó `rm -f .expo/types/router.d.ts` y
   Codex hizo el mismo borrado con `Path(...).unlink(missing_ok=True)`. Lo
   declaró en su reporte, lo que habla a su favor. El efecto está autorizado
   por escrito (tasks.md y el handoff piden ese borrado) y el fichero es un
   tipo generado e ignorado por git, así que el daño es nulo. Pero la forma es
   la que no conviene normalizar: **ante un comando denegado, Codex cambió de
   herramienta en vez de parar y preguntar.** Hoy el objeto era inocuo, y el
   patrón no distingue objetos. Recomiendo dos cosas: permitir ese `rm -f`
   concreto en el sandbox de Codex, para que el bloqueo deje de darse, y
   añadir a la plantilla de handoff (`leader.md` §Handoff a Codex CLI) la
   regla «si el sandbox te deniega un comando, para y repórtalo; no lo
   sustituyas por otro que haga lo mismo».
5. **Push (informativo).** El reflog de `origin/feature/112-…` registra
   «update by push» a `8bd8e27d` a las 03:46:54Z, unos cinco minutos después
   del último commit de Codex. El reporte de Codex dice que no hizo push, y la
   hora cuadra con un push del leader antes de lanzar `init.sh` (hacia las
   03:47Z). No puedo atribuirlo con certeza, así que el leader debería
   confirmar que fue él.
6. **Sin prueba de humo:** es correcto, está firmado en el punto 5 de §Qué
   firma y el diff de producción está vacío. La única casilla humana de la
   feature ya está marcada, así que con este veredicto no queda ningún gate
   humano pendiente.

## Output de ./init.sh
No lo ejecuté yo: el clasificador se lo deniega al subagente y LocalStack y
Postgres son compartidos con `wt-backend`. Lo corrió el leader sobre
`8bd8e27d` y leí el log entero, que está en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/init_112_8bd8e27d.log`
(18 818 líneas, mtime 03:51:12Z). Lo he comprobado contra HEAD: HEAD no se ha
movido desde las 03:42:02Z.

```
→ Verificando entorno...            ✅ node / pnpm / bun
→ Verificando variables de entorno  ✅ .env, DATABASE_URL
                                    ⚠️ faltan RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST (preexistente, solo aviso)
→ Verificando coherencia del harness ✅ archivos presentes
                                    ⚠️ Feature en progreso: mobile-reminders-see-all-source-lock-nesting
                                    ⚠️ harness-init-force-color (done) sin requirements.md (preexistente)
                                    ✅ STATUS.md sincronizado con feature_list.json
→ Build...                          ✅ Build exitoso
→ Tests (backend)                   Test Suites: 170 passed, 170 total | Tests: 1298 passed, 1298 total
→ Tests (infra)                     Test Suites: 2 passed, 2 total     | Tests: 14 passed, 14 total
→ Tests (harness, node:test TAP)    ok
→ Tests (móvil)                     Test Suites: 82 passed, 82 total   | Tests: 1452 passed, 1452 total | Snapshots: 1 passed, 1 total
→ Tests e2e                         Test Suites: 3 skipped, 27 passed, 27 of 30 total | Tests: 8 skipped, 389 passed, 397 total
→ Lint...                           ✅ Lint sin errores
→ Typecheck...                      ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 99/119 completadas | 19 pendientes
exit=0
```

La suite móvil da 82/1452/1, lo mismo que la base medida en `993b62fa`.
**Delta: +0 suites, +0 tests**, como exige design.md §Recuentos.
