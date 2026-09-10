# review: mobile-home-reminders-real-data (#85)
Fecha: 2026-09-09
Reviewer: agente `reviewer` (Claude Opus 5)
Commit revisado: `d90b41c` — idéntico a `origin/feature/85-mobile-home-reminders-real-data`
Base: `20c7b3c` (= `origin/main`, merge del PR #116 / #70)
Veredicto: **APROBADO** (con tres hallazgos registrados, ninguno bloqueante)

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `85:mobile-home-reminders-real-data`
- [x] `progress/current.md` describe la sesión activa (feature, branch, base, las
      siete enmiendas A7-A13 firmadas y el avance R1-R15)
- [x] Árbol limpio: `git status --short` vacío en `d90b41c`
- [ ] **Aviso, no bloqueante**: `init.sh` avisa `STATUS.md desactualizado
      (67/85 declarado vs 67/86 real)`. Lo causa el alta de **#86** durante esta
      feature (A10). Es tarea de cierre del leader, no del implementer.

## Checklist C3 — Arquitectura

No aplica la regla de capas de backend: la feature es **solo móvil** y no toca
`domain/application/infrastructure`. Se verifican en su lugar las fronteras que
la spec fija:

- [x] `git diff origin/main..HEAD -- backend-pet-tracker/` **vacío**. **Cero
      backend** (D-A, R4, Fuera de alcance) — verificado por mí, no por el informe
- [x] `git diff --name-only origin/main..HEAD`: 24 ficheros, **ninguno** fuera de
      `mobile-pet-tracker/`, `specs/`, `progress/` y `feature_list.json` (R14)
- [x] Producción móvil tocada: solo `screens/home/index.tsx`,
      `screens/home/format.ts`, `i18n/catalog.ts`. Intactos `src/api/*`,
      `src/hooks/use-api.ts`, `src/components/`, `src/theme/`, `src/app/`,
      `src/utils/reminder-meta.ts`, `src/utils/category-palette.ts`
- [x] `format.ts` importa `Reminder` **solo como tipo** (R3)
- [x] **#84 no se arrastra**: `src/utils/reminder-dates.ts` no se toca y **no se
      usa** desde la Home. Sus únicos llamantes siguen siendo
      `screens/add-reminder/index.tsx:18` y `screens/reminders/index.tsx:33`.
      El `Math.ceil` sobre milisegundos no entra en #85
- [x] **#82 no se propaga**: el corte de #85 es `>= 0` sobre día civil local
      (`format.ts`), como la pestaña Salud; no se alinea al `gt` UTC del backend
      (D-I, §0.4)

## Checklist C4 — TDD

- [x] Cada `R<n>` de conducta tiene `describe` que lo nombra:
      `#85 R1`, `#85 R4`…`#85 R10` en `index.test.tsx`; `#85 R2`, `#85 R3` en
      `format.test.ts`; `#85 R12` en `design-drift.test.ts`
- [x] R11, R13, R14, R15 son **de verificación** y la spec lo declaró **antes**
      del handoff (R11 §"Test", R13 §"Test", R14, R15 y la nota final de
      `traceability.md`). Se cierran con candados existentes + informe, que es la
      convención vigente del repo
- [x] R9 y R10 quedaron declarados de verificación por **A12**, firmada, con sonda
      propia (P9/P10) versionada. La parada de Codex antes de escribirlos fue
      correcta
- [x] Historial **test-primero, requisito a requisito**, no todo junto. 33 commits
      de código en pares rojo→verde:
      R1 `5ad5bc6`→`41e7a99` · R2 `109cdaa`→`2fb06c5` · R3 `37f7d74`→`4788104` ·
      R4 `c2d5dfd`→`fc7a31d` · R5 `10c9636`→`4262348` · R6 `bb83edc`→`d4733ef` ·
      R7 `4078fdc`→`c5e30e2` · R8 `7dac461`→`fecd8e8` · R9 `1d8c3d5`→`68b3d90` ·
      R10 `7016683`→`3b7bcfa` · R11 `ff4a627`→`f80fac1` · R12 `fce3ffc` ·
      R13 `5febedb`
- [x] **Cuarto punto de C4**: ningún commit rojo cae por `ReferenceError` de un
      helper ausente. `localIso`, `makeReminder`, `makeReminderFixture` y
      `HomeWrapperEn` entran en el mismo commit que los usa
- [x] **Quinto punto de C4**: los cinco rojos que mutan algo lo hacen en
      **código de producción**, nunca en un doble. Verificado fichero a fichero:
      `4078fdc` → `screens/home/index.tsx`; `1d8c3d5` → `index.tsx`;
      `7016683` → `index.tsx`; `ff4a627` → `i18n/catalog.ts`;
      `97e06c0` → `screens/home/format.ts`. Los ocho rojos restantes son
      **solo fichero de test**
- [x] **Idempotencia rojo→verde** (`git diff --quiet <rojo>^ <verde> -- <fichero>`):
      M1 `97e06c0^..80595f9` sobre `format.ts` → **vacío**;
      M9+M10 `4078fdc^..c5e30e2` sobre `index.tsx` → **vacío**;
      M13 `ff4a627^..f80fac1` sobre `catalog.ts` → **vacío**

## Checklist C5 — Trazabilidad

- [x] `specs/mobile-home-reminders-real-data/traceability.md` **sin ninguna fila
      "pendiente"**: 15 filas de requisito + 6 de enmienda, todas con test y
      commit
- [x] Commits en formato `feat(<scope>): <desc> (R-ids)` / `test(<scope>): …`.
      Los 33 commits de código llevan scope y R-id; los `docs(...)` son de
      trazabilidad y no lo requieren
- [x] Los `describe` referenciados existen y nombran su R-id — comprobado
      abriendo los ficheros, no el informe

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] `- [X] Aprobado por humano (fecha: 2026-09-09)` marcada
- [x] Las **trece enmiendas** llevan su casilla humana marcada y su commit de
      firma en el historial: A1-A6 `58e764a`, A7 `df9b398`, A8 `7edbbca`,
      A9 `ea0c318`, A10 `8cef009`, A11 `ea14add`, A12 `66d646c`, A13 `e486e4d`…
      (`e03cbcd A13 aprobado`). **Todas son alcance aprobado**
- [x] Ningún requisito R1-R15 fue reescrito tras la aprobación: las correcciones
      viajaron como enmiendas numeradas, cada una con su gate

## Checklist C7 — Sin código huérfano

- [x] `vaccineCountdown` → `dueCountdown` (A2): renombrada, **no duplicada**.
      `grep` de `vaccineCountdown` en el árbol → cero ocurrencias
- [x] La copy de #70 D8 (`Próxima vacuna` / `Ver recordatorios`) queda **borrada**
      del catálogo, no conviviendo con la nueva (A4)
- [x] **A0 respetado al pie**: ni un assert de #70 borrado ni debilitado. El diff
      de `index.test.tsx` contra `20c7b3c` sólo elimina **cuatro** líneas
      heredadas, y son exactamente las cuatro adaptaciones firmadas:
      `% 3`→`% 4` (A10, `:845`), los dos literales de `#70 R1` (A4, `:2641`),
      el título de `#70 R9` (A3, `:2804`) y el recuento de `#70 R15`
      (A1, `:3092`, que **se refuerza** a cuatro llamadas). Nada más
- [x] **La cardinalidad de #70 D1 y la exclusión de comidas siguen vivas y
      mordiendo**: al plantar M11 cayeron también
      `#70 R9 › deja el cuerpo con la fila de la vacuna y nada más…` y
      `#70 R3 › no dibuja la barra de comidas ni pide el plan de nutrición`.
      No están sólo presentes: están **probadas**

## Checklist C8 — UI móvil conforme a la carta

Skills cargadas: `expo:expo-overview` (entrada de la carta §Skills).

- [x] Grep-clean: el bloque `#85 R12` de `design-drift.test.ts` cubre los cinco
      ficheros nominales; `consistency-classnames`, `legibility-classnames` y
      `design-drift` verdes en el `init.sh` que corrí yo
- [x] `Card` compartido reutilizado, sin fork local ni receta duplicada (R10)
- [x] Cero `bg-category-*` / `text-category-*` literales en `index.tsx`: se
      consumen por `CATEGORY_SLOTS[...]`; la tinta se compone como
      `` `category-${slot}-strong` ``, que no casa con el patrón interpolado de
      `#64 R9` (`consistency-classnames.test.ts:404`, verde y **sin cambio**)
- [x] Escala de radios de #62 R4 respetada: `rounded-card` (Card) y
      `rounded-full` (disco y píldora). Ningún `rounded-2xl/lg/md/sm`
- [x] Cero emoji como icono; siete iconos de `reicon` por variable (R6)
- [x] Estado de carga: sin spinner suelto; el esqueleto de la ranura de la vacuna
      se conserva y **no** se añade uno para la lista, con motivo escrito (R9)
- [x] Filas no pulsables → el mínimo de 44pt no aplica; el único botón de la
      sección sigue siendo `reminders-see-all` (R8, `#70 R10`/`R11` intactos)

---

## Verificación independiente de las mutaciones

Reproducidas **por mí** en worktree desechable (`/tmp/review85`, ya eliminado;
`git worktree list` limpio), con `env -u TZ -u FORCE_COLOR bun run test`.
Línea base del worktree antes de mutar: **3 suites / 159 tests verdes**.
Runner: `TZ` **sin exportar**, zona efectiva **UTC**.

| Mutación | Resultado medido | Veredicto |
|---|---|---|
| **M10** — intercambio de los dos hijos del agrupador, **`testID` intactos** | **1 fallo / 158 verdes**. Cae exactamente `#85 R7 › fija la posición de los hijos de cada fila` | **Muerde.** La dimensión **O6** que #70 dejó abierta queda **cerrada**: R7 no está escrito solo con `getByTestId`, fija `group.children[i]` |
| **M11** — hijo intruso `<View className="h-1.5 rounded-full bg-default" />` **sin `testID`** | **12 fallos / 147 verdes**, entre ellos el prescrito `#85 R5 › cuenta los hijos del cuerpo en tres escenarios` (esperaba 1, recibió 2) | **Muerde.** La cardinalidad se cuenta con `children.length`, **no** por coincidencias de `testID`. Arrastra además `#70 R9` y `#70 R3`, prueba de que siguen vivos |
| **M13** — `en['home.reminders']` → `Recordatorios` | Suite móvil **completa**: **1 fallo / 1109 verdes**, `#85 R1 › rotula en inglés` | **Muerde.** El candado inglés **no es decorativo**: el hallazgo **O7** de #70 queda cerrado |
| **M1** — `localDayOf` con `getUTC*` | **1 fallo / 158 verdes**, `#85 R2 › toma el día civil de los getters locales, nunca de los UTC` (esperaba `2026-09-11`, recibió `2026-09-12`) | **Muerde sin exportar `TZ`, y en un runner UTC**, que es el caso más hostil. El doble sesgado hace discrepar local y UTC por construcción. **El fallo que costó el rechazo del primer pase de #70 no se repite** |
| **M9 puro** — sólo se cruza el contenido, `testID` y `className` **intactos** | **2 fallos / 157 verdes**: el prescrito `#85 R7 › no cruza ningún dato…` y además `#85 R5 › pinta las tres filas…` | **Muerde.** Reproducida aparte por el motivo de §Hallazgo O3 |

**M6 — la trampa declarada.** Comprobado que **la fixture no se reordenó**:
`format.test.ts` entrega `[makeReminder('rem-z', tiedDueAt), makeReminder('rem-a', tiedDueAt)]`
en ese orden, invertido respecto al alfabético, y espera `['rem-a','rem-z']`.
M6 sigue siendo la mutación condicional que la spec describe y **no quedó
decorativa**. La fixture de tres filas de la Home (`makeReminderFixture`,
`index.test.tsx:198`) también conserva su desorden normativo `rem-a, rem-c, rem-b`.

**P9 y P10.** Ambas versionadas en su commit rojo y revertidas en el verde, con
diff idempotente. La evidencia del informe respeta **A13**: el rojo de P9 es
*"desaparece `reminders-next-vaccine` y el cuerpo pasa de 1 hijo a 0"* en los
seis `it` de R9 — **no** la desaparición del esqueleto, que depende sólo de
`detail.data`. Leído el test, el subescenario de perfil cargando sigue exigiendo
**un** `reminders-section-skeleton` (`index.test.tsx:2489-2491`), que es
precisamente lo que hace consistente la corrección de A13.

**M2-M5, M7, M8, M12**: evidencia escrita en el informe, con `it`, mensaje y
restauración de diff vacío. Coherente con el pipeline real (la corrección de
**A8** sobre M3 —el tope de tres recorta `rem-cancelled`— está bien contada). No
reproducidas por mí; las cinco de arriba eran las de riesgo.

---

## Las doce dimensiones del elemento repetido (carta §Enmienda #70)

Fila de recordatorio. Estado real, no el declarado:

| # | Dimensión | Candado | Estado |
|---|---|---|---|
| 1 | dato que muestra | R5 texto exacto + R7 cruzado | **Vigilada** (M9 puro reproducido) |
| 2 | componente de icono | R6 `within(fila).getByTestId('icon-…')` | Vigilada (M12) |
| 3 | etiqueta visible / clave de copy | R5: no hay etiqueta de tipo; contador vía `dueCountdown` | Vigilada |
| 4 | nombre accesible | R8: `accessibilityLabel` del contador en **es y en**; `undefined` en título, fecha, disco e icono | Vigilada |
| 5 | color / hueco de fondo | R6 `disco.props.className` con `toBe` | Vigilada |
| 6 | tinta del icono | R6 `icon.props.color` con `toBe` | Vigilada |
| 7 | receta tipográfica de **cada** texto (tres) | R10 con **`toBe`**, no `toContain` | Vigilada (cierra el defecto #81) |
| 8 | destino de navegación | R8: `onPress`/`accessibilityRole` `undefined`, `router.push` no llamado | Vigilada |
| 9 | condición de render | R5 en **cuatro** escenarios: 0, 1, 3 y 5→3 | Vigilada |
| 10 | **forma del contenedor, todas sus ramas** | R10 `fila.props.className` con **`toContain`** | **Vigilada a medias — ver O2**. La fila tiene una sola rama; las dos ramas de #70 (vacuna y estado vacío) siguen candadas y probadas |
| 11 | envoltorio `flex-1` | R7 `group.props.className` con `toBe` | Vigilada |
| 12 | **orden de los hijos** | R7 `fila.children[i]` y `grupo.children[i]` | **Vigilada** — M10 reproducida por mí |
| — | contenedor: identidad, orden, **cardinalidad** | `children.length`, nunca `testID` | Vigilada — M11 reproducida por mí |

**Invariantes compartidos** (la carta los pide inventariados aparte): objetivo
táctil **N/A**, radio **vigilado**, rol y agrupación accesible **vigilados**,
sitio de render **vigilado**, feedback de pulsado **N/A**… y **tamaño de icono:
NO vigilado** → hallazgo **O1**.

---

## Hallazgos (registrados, ninguno bloqueante)

### O1 — El `size={20}` del icono de fila no tiene candado

**Medido, no supuesto.** Cambié en producción
`mobile-pet-tracker/src/screens/home/index.tsx:641`
de `<Icon size={20} color={reminderRowInks[index]} />` a `size={28}` y corrí la
suite móvil **completa**: **68 suites / 1110 tests, todo verde**. Nadie mira.

Rompe dos cosas escritas:

- La cláusula SHALL de **R6**: *"el icono SHALL renderizarse con `size={20}` y
  `color={<tinta resuelta>}`"*. La mitad del `color` **sí** está candada
  (`icon.props.color` con `toBe`); la del `size` no lo está en ningún sitio.
- El inventario de **R7**: *"Invariantes compartidos … se assertan una vez:
  tamaño de icono `20`"*. No se assertan.

No lo tapa `#70 R13`: su `source.match(/<Syringe\s+size=\{20\}/g)` cuenta **2**
etiquetas literales —la fila de la vacuna y el tile de peso— y la fila nueva
renderiza **por variable** (`<Icon …`), justo como R6 exige. El acierto de R6
crea el hueco.

Es la **quinta ronda seguida** con una dimensión destapada por la revisión
(#69, #71, #70, O6 de #70, y ahora ésta), y duele más porque la carta
§Enmienda #70 —escrita el 2026-09-09 con la frase *"Esta lista existe para que la
quinta no haga falta"*— **nombra literalmente "tamaño de icono"** entre los
invariantes a inventariar. La lista se leyó y se copió en prosa; no se convirtió
en aserción.

**Coste de cerrarlo: una línea** en `#85 R6 › liga icono, superficie y tinta a su
tipo`, dentro del bucle que ya tiene el nodo:
`expect(icon.props.size).toBe(20);`. **No lo arreglo yo** (el reviewer no edita
código). Recomendación: entra en la próxima feature móvil como requisito
explícito, o como micro-tarea antes del PR si el leader lo prefiere.

### O2 — La receta del contenedor de fila se asserta con `toContain`

Añadí `mt-2 opacity-50` al `className` de la `Card` de fila
(`index.tsx:634`) y `src/screens/home` + `src/__tests__` quedaron
**302/302 verdes**. Clases aditivas entran sin que nada chille.

**Esto es lo que R10 prescribe**, no una desviación: la spec pide `toBe` sólo
para título, fecha y contador —donde está el defecto #81— y `toContain` para la
fila, porque el `Card` compartido compone su propio `className`. Queda anotado
como el siguiente escalón de la misma escalera, no como incumplimiento.

### O3 — M9 y M10 se plantaron en el **mismo** commit rojo

R15 exige las trece mutaciones *"plantadas **de una en una**"*. El informe cita
`4078fdc` como commit rojo de **las dos**, y el diff lo confirma: ese commit
intercambia `testID` **y** `className` entre los dos `<Text>` dejando el
contenido en su sitio, que es la **composición** de M9 y M10, no ninguna de las
dos por separado.

**Sin consecuencia práctica, y lo verifiqué en vez de suponerlo**: reproduje las
dos por separado y cada una mata **sólo** el `it` que R15 le asigna —M10 pura,
1 fallo en `fija la posición…`; M9 pura, el fallo prescrito en `no cruza ningún
dato…`—. La atribución del informe es correcta aunque el procedimiento no fuera
el literal. Se anota para que no se convierta en costumbre: dos mutaciones en un
commit impiden atribuir el rojo sin rehacer el trabajo, que es exactamente lo que
he tenido que hacer.

---

## Deltas de candados globales (R13) — comprobados por **sumando**

- **Fila 1, longitud del catálogo** (`language-provider.test.tsx:41`): el fichero
  **no aparece en el diff**. Delta **`+ 0`** real, no declarado. R1 cambia
  valores, no claves. *Éste es el candado que paró #68 y #69.*
- **Fila 2** (`ui-copy-table.ts`, `ui-language.test.ts:83`): tampoco aparecen en
  el diff. **`+ 0`**.
- **Fila 3** (lista literal de `#70 R16`): sin cambio.
- **Fila 4, cifras tabulares**: los **cinco** mandos se mueven juntos y **por
  sumando nombrado**, nunca por cifra absoluta:
  `HOME_TABULAR_DELTA_85 = 1` nueva; la fila de Home pasa a
  `AT_9358CC7 + DELTA_69 + DELTA_70 + DELTA_85`; el total cerrado
  `14 + 4 + 1 + 1` → `14 + 4 + 1 + 1 + 1`; y las guardas `#69 R14` y `#70 R18`
  pasan a `.toBe(DELTA_69 + DELTA_70 + DELTA_85)` y
  `.toBe(DELTA_70 + DELTA_85)`. Ningún número reescrito a mano.
- **Fila 5**: un `describe` nuevo en `design-drift.test.ts`, con lista nominal
  propia y el título **sin** el número de ficheros en letra, como R12 exige.
- **Fila 6**: cinco entradas nuevas en el doble de `reicon`, las cinco nominales
  (`Bacteria`, `Pill`, `Stethoscope`, `Bone`, `Bell`); `Syringe` y `Weight`
  intactas. Fichero de test.
- **Filas 7-21**: sin cambio, y lo confirma el `git diff --name-only`: ninguno de
  sus ficheros —`legibility-classnames.test.ts`, `ui-language.test.ts`,
  `ui-copy-table.ts`, `app/(tabs)/home.tsx`,
  `backend-pet-tracker/test/pet-reminders.e2e-spec.ts`— está tocado.
- **Fila 21 en particular**: `pet-reminders.e2e-spec.ts` intacto ⇒ **nadie filtró
  ni ordenó en servidor**.

## A10 y A11 — verificados en el árbol

- **A10**: el cambio es **un carácter**, `hookCall++ % 3` → `% 4`
  (`index.test.tsx:845`). La intención del `it` heredado se conserva: la primera
  llamada de cada render sigue siendo la de la lista de mascotas, el resto sigue
  devolviendo vacío, y sus dos `expect(selectPet).not.toHaveBeenCalled()` siguen
  ahí sin tocar. No es mutar un doble para fabricar un rojo: es actualizar una
  aridad codificada que la feature cambia legítimamente.
- **A11**: el `beforeEach` de **nivel de fichero** existe en
  `index.test.tsx:126-128`, justo tras `const mockListReminders = …`, y repone
  `{ kind: 'ok', reminders: [] }`. **Funciona**: ningún `describe` heredado de #70
  quedó contaminado por la fixture de R5 —la suite entera está verde, y al
  plantar M11 los candados heredados `#70 R9` y `#70 R3` fallaron por el intruso,
  no por recibir `rem-1`—.

---

## Deriva

- `git fetch origin` ejecutado. `HEAD` = `d90b41c` = `origin/feature/85-mobile-home-reminders-real-data`. **Sin deriva.**
- `origin/main` = `20c7b3c`, que es la base de medición declarada. La rama está
  al día con `main`.
- Árbol de trabajo limpio al terminar la revisión; el worktree desechable
  `/tmp/review85` fue eliminado y `git worktree list` no lo contiene.

---

## Output de `./init.sh`

Comprobado antes con `pgrep`/`ps` que **no había otro gate corriendo** (el único
proceso que casaba `bash ./init.sh` era un bucle `while pgrep` de la sesión
padre, que casa con su propia línea de comandos). Corrido por mí, en primer
plano, desde `/home/claude/sites/Pet-Tracker`, con `env -u FORCE_COLOR`.

### Primera corrida — **exit 1**, por el rojo ajeno conocido (#76)

```
Test Suites: 163 passed, 163 total          ← backend unit
Tests:       1243 passed, 1243 total
Test Suites: 2 passed, 2 total              ← infra
Tests:       14 passed, 14 total
Test Suites: 68 passed, 68 total            ← móvil
Tests:       1110 passed, 1110 total
✅ Tests pasados

→ Tests e2e...
    expect(received).toEqual(expected) // deep equality
      Array [
    +   "vaccine.delete",
        "vaccine.create",
        "vaccine.update",
    -   "vaccine.delete",
      ]
      at Object.<anonymous> (health-vaccines.e2e-spec.ts:497:45)

Test Suites: 1 failed, 3 skipped, 24 passed, 25 of 28 total
Tests:       1 failed, 8 skipped, 353 passed, 362 total
 ELIFECYCLE  Command failed with exit code 1.
```

**Verificado, no aceptado de palabra**: es exactamente **#76**, que sigue
`pending` y cuya descripción en `feature_list.json` nombra el fichero y la línea
—`health-vaccines.e2e-spec.ts:497`, un `SELECT … FROM auditLog WHERE …` **sin
`ORDER BY`** contra un `toEqual` de array ordenado—. Es **ajeno a #85 por
construcción**: esta feature no toca un solo byte de `backend-pet-tracker/`.
Nota: el informe del implementer declara un flake distinto en su primera corrida
(`add-pet`, mock del picker). Son **dos** flakes distintos del entorno, no uno;
ninguno de los dos toca código de #85.

Efecto secundario a tener en cuenta: como `init.sh` usa `set -e`, ese fallo
**abortó antes de lint y typecheck**, así que la primera corrida no los verificó.

### Segunda corrida — **exit 0**, gate completo

```
→ Verificando entorno...      ✅ node / pnpm / bun disponibles
→ Verificando variables...    ✅ .env encontrado, DATABASE_URL definida
                              ⚠️  .env desactualizado: faltan 3 claves de .env.example
                                 (RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST)
→ Instalando dependencias...  ✅
→ Verificando coherencia del harness...
                              ✅ Archivos del harness presentes
                              ⚠️  Feature en progreso: mobile-home-reminders-real-data
                              ⚠️  STATUS.md desactualizado (67/85 declarado vs 67/86 real)
→ Build...                    ✅ nest build + tsc-alias + cdk synth
→ Ejecutando tests...
   Test Suites: 163 passed, 163 total   Tests: 1243 passed, 1243 total   ← backend
   Test Suites:   2 passed,   2 total   Tests:   14 passed,   14 total   ← infra
   (env-drift.test.mjs: ok)                                             ← harness
   Test Suites:  68 passed,  68 total   Tests: 1110 passed, 1110 total   ← móvil
                              ✅ Tests pasados
→ Tests e2e...
   Test Suites: 3 skipped, 25 passed, 25 of 28 total
   Tests:       8 skipped, 354 passed, 362 total
                              ✅ Tests e2e pasados
→ Lint...                     ✅ Lint sin errores      (backend + infra + expo lint)
→ Typecheck...                ✅ Typecheck sin errores (backend + infra + tsc --noEmit)

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 67/86 completadas | 18 pendientes
```

**exit code 0.** Los avisos de `.env` y de `STATUS.md` son advertencias de
`init.sh`, no fallos, y ninguna la introduce #85.

Contraste con la base declarada por el implementer (móvil 68 suites / **1078**
tests en `20c7b3c`): **+32 tests**, mismo número de suites. Cuadra con los
`describe` nuevos de #85 y confirma que **no se borró ni un test**.

---

## Observaciones finales

Ninguna bloquea. El veredicto es **APROBADO**: los quince requisitos tienen su
candado, los cinco candados de riesgo los vi fallar **yo**, la trazabilidad no
tiene una sola fila pendiente, `init.sh` termina en **0** con el único rojo
atribuible a #76, y las trece enmiendas están firmadas.

Lo que queda anotado para el harness: **O1** es el hueco que la propia carta
§Enmienda #70 había previsto y aun así se coló, en la primera feature que usó la
lista. La lección no es "falta un `expect`": es que **inventariar un invariante en
prosa no lo cierra**; la carta debería exigir que cada invariante compartido
lleve, como las decisiones por elemento, su sonda con rojo visto. Ése es el
cambio que evita la sexta ronda.

## Gates humanos que quedan antes de `done`

1. **Prueba de humo, no delegable** (R14): **dev build de Android** (no Expo Go),
   en los **dos temas**, con al menos las tres mascotas que la spec exige — una
   **con** recordatorios y **sin** vacuna próxima; una **con** las dos cosas; y
   una **sin** ninguna de las dos. Mirar en particular: el orden ascendente de
   las filas, que la píldora sea **ámbar en todas** sea cual sea el tipo, y que
   el disco de color cambie con el tipo.
2. **Ratificación de lo que la aprobación ya declara** y sólo se ve en pantalla:
   la **duplicación visual** aceptada (§0.3) y la **incoherencia del día de la
   dosis** (§0.4, heredada de #82).
3. **`STATUS.md`**: pasar `67/85` → `67/86` (lo pide `init.sh` con un aviso).
4. **`feature_list.json`**: `85` a `"done"` — cierre del leader, con este
   veredicto y el humo humano en la mano.
5. **PR** con `gh pr create` desde `feature/85-mobile-home-reminders-real-data`.
   **El humano mergea**; ningún agente.
6. **Decisión sobre O1**: cerrarlo con una línea antes del PR, o registrarlo como
   requisito de la próxima feature móvil. Mi recomendación: **no lo aplaces más de
   una feature** — lleva cinco rondas saliendo la misma clase de hueco.

---
---

# Segundo pase — solo el delta de A14

Fecha: 2026-09-10
Reviewer: agente `reviewer` (Claude Opus 5)
Commit revisado: `ff12c66` — idéntico a `origin/feature/85-mobile-home-reminders-real-data`
Rango del pase: `c27b0e4..HEAD` (8 commits). Firma humana de A14: `eb5790e`
Veredicto de este pase: **APROBADO**
Veredicto de la feature: **APROBADO** (el del primer pase se mantiene; A14 no lo altera)

**Alcance deliberadamente estrecho.** La revisión completa se hizo el 2026-09-09
sobre `d90b41c` y quedó aprobada. Aquí sólo se juzga el delta que A14 metió
después, que son **tres líneas de producción**. No se repite nada de lo anterior.

## Qué entró, medido

`git diff --stat c27b0e4..HEAD`: seis ficheros. **Producción: uno solo**,
`mobile-pet-tracker/src/screens/home/index.tsx`, con `4 ++-` (3 inserciones,
1 borrado). El resto son `index.test.tsx` (**42 inserciones, 0 borrados**),
`progress/current.md`, `progress/impl_*.md`, `requirements.md` y
`traceability.md`.

### 1 — La condición nueva es exactamente la de A14

`index.tsx:608-610`:

```
{detail.data?.kind === 'ok' &&
!detail.data.pet.nextVaccine &&
upcoming.length === 0 ? (
```

Carácter por carácter el `diff` que A14 prescribe. **Nada más se coló en
producción**: el diff de `screens/home/` sobre el rango no toca otra línea de
`index.tsx`. `upcoming` (definido en `:182`) es el mismo array que `:626`
mapea para pintar las filas, así que la guarda mide **el cuerpo real**, no una
lista paralela. El estado vacío pasa a significar lo que promete su nombre.

- [x] Sin cambio de texto, `testID` ni anatomía de la tarjeta, como A14 exige
- [x] La rama *con* vacuna (`nextVaccine && nextVaccineCountdown`, `:573`) queda
      intacta: A14 sólo toca el caso *sin vacuna*

### 2 — P14: mutación en producción, plantada sola, idempotente

| Comprobación | Resultado |
|---|---|
| Rojo `8381d0d` toca **código de producción** | **Sí** — `index.tsx`, y **sólo** ese fichero |
| Plantada **sola** (lo que A14 pidió tras el hallazgo O3) | **Sí** — `1 file changed, 1 insertion(+), 2 deletions(-)`. Una mutación, un commit |
| Verde `8e152db` la revierte | **Sí** — el diff inverso exacto |
| `git diff --quiet 8381d0d^ 8e152db -- index.tsx` | **Vacío** |

O3 queda corregido en la práctica, no sólo en la prosa: M9 y M10 compartieron
commit en su día; P14 no.

### 3 — El candado nuevo cubre los dos escenarios, y lo vi fallar

`index.test.tsx:2080-2117`, dentro de `#85 R5`, recorre dos escenarios con
`makePet()` — cuyo `nextVaccine` es **`null`** por defecto (`:158`), o sea
*sin vacuna* de verdad en los dos:

| Escenario | Cuerpo | `reminders-none-upcoming` |
|---|---|---|
| con 3 recordatorios | `toHaveLength(3)` | `queryByTestId` → `toBeNull()` |
| sin recordatorios | `toHaveLength(1)` | `getByTestId` → `toBeVisible()` |

**Sonda plantada por mí** (quitar `upcoming.length === 0` de `index.tsx:610`,
el mismo P14):

```
● #85 R5 › solo muestra el vacío cuando no hay vacuna ni recordatorios
  expect(received).toHaveLength(expected)
  Expected length: 3
  Received length: 4
  at src/screens/home/index.test.tsx:2105:31

Test Suites: 1 failed, 1 total
Tests:       1 failed, 110 passed, 111 total
```

**Muerde.** El cuarto hijo del array recibido es literalmente la tarjeta
`reminders-none-upcoming` **encima** de `reminders-item-rem-b`: es el defecto que
vio la prueba de humo, reproducido en test. Restaurado, verde.

### 4 — O1 cerrado, y el candado muerde

`index.test.tsx:2210` añade `expect(icon.props.size).toBe(20);` dentro del bucle
de `#85 R6`, con el nodo que ya tenía a mano — la línea que A14 prescribe.

**Repetida mi propia sonda de O1**: `index.tsx:644`, `size={20}` → `size={28}`,
**suite móvil completa**:

```
● #85 R6: cada tipo trae su icono, su hueco y su tinta › liga icono, superficie y tinta a su tipo
Test Suites: 1 failed, 67 passed, 68 total
Tests:       1 failed, 1110 passed, 1111 total
```

El hueco que medí en **68/1110 todo verde** ahora da **rojo**. Restaurado, verde.

### 5 — Regresión sobre #70: intactos y verdes, y la teoría se sostiene

- [x] **Nadie los editó**: `git diff --numstat c27b0e4..HEAD -- index.test.tsx`
      → `42  0`. **Cero líneas borradas**. Ningún assert de #70 tocado ni
      debilitado (A0 sigue respetado)
- [x] **La teoría del `beforeEach` de A11 es cierta, verificada leyendo el
      fichero**: `index.test.tsx:127-129` es un `beforeEach` **de nivel de
      fichero** que repone `mockListReminders.mockResolvedValue({ kind: 'ok',
      reminders: [] })` antes de **cada** test. Los dos candados heredados que
      miran `reminders-none-upcoming` — `#70 R8` (`:2773`) y el de forma
      (`:3035`) — **no** sobreescriben el mock, así que corren con `[]`, la
      cláusula nueva es verdadera y la tarjeta se pinta como siempre
- [x] **Probado, no supuesto**: con la sonda del punto 3 puesta,
      `#70 R9 › deja el cuerpo con la fila de la vacuna y nada más cuando no hay
      recordatorios` siguió **verde** — la sonda cae en el escenario *con*
      recordatorios, que es justo el que #70 no tenía. Los 110 tests restantes
      del fichero, verdes

### 6 — Ningún recuento global movido

- [x] `mobile-pet-tracker/src/i18n/` **intacto** en el rango → la longitud del
      catálogo no se mueve, y `language-provider.test.tsx` no se toca
- [x] `design-drift`, `consistency-classnames`, `legibility-classnames`:
      **cero** ficheros tocados en el rango
- [x] El recuento de `#70 R13` sigue cuadrando: `<Syringe size={20}` sigue
      apareciendo **2** veces literales en `index.tsx`. La fila nueva renderiza
      por variable (`<Icon …`), que es lo que R6 exige, y el `size` ahora lo
      canda R6, no un recuento de fuente
- [x] Delta de tests: **1110 → 1111**, `+1`, mismas 68 suites. Cuadra con **un**
      `it` nuevo; el `expect` del `size` entró en un `it` existente. No se borró
      ni se saltó ningún test

### 7 — Trazabilidad y deriva

- [x] `traceability.md` **sin ninguna fila "pendiente"** (la única aparición de
      la palabra es la línea de la regla, `:41`). Fila **A14** añadida, y las de
      R5 y R6 actualizadas con `56414ff`/`47f1020`, P14 `8381d0d`/`8e152db` y
      `992aa13`
- [x] `requirements.md` en el rango cambia **una sola línea**: la casilla de A14
      `- [ ]` → `- [X]`, que es la firma humana de `eb5790e`. Ningún requisito
      reescrito
- [x] `git fetch origin`: `HEAD` == `origin/feature/85-mobile-home-reminders-real-data`
      == `ff12c66`, diff **vacío**. `origin/main` sigue en `20c7b3c`, la base
      declarada. **Sin deriva**
- [x] Árbol limpio en `ff12c66` al terminar: las dos sondas revertidas con
      `git checkout --`, `git status --short` vacío

## Output de `./init.sh` (corrida propia, primer plano, `env -u FORCE_COLOR`)

`pgrep -f "bash ./init.sh"` antes: nada corriendo, sin colisión de worktrees en
el Postgres compartido. **La corrida llegó al final** — no cayó en el flake de
`health-vaccines.e2e-spec.ts:497` (#76) ni en el de la foto de add-pet (#72),
así que `set -e` no abortó y **lint y typecheck sí se ejecutaron**. Una sola
corrida verifica el gate entero.

```
✅ .env encontrado
⚠️  .env desactualizado: faltan 3 claves de .env.example
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  STATUS.md desactualizado (67/85 declarado vs 67/86 real)
✅ Build exitoso
→ Tests...
   Test Suites: 163 passed, 163 total   Tests: 1243 passed, 1243 total   ← backend
   Test Suites:   2 passed,   2 total   Tests:   14 passed,   14 total   ← infra
   (env-drift.test.mjs: 28 tests, 0 fail)                                ← harness
   Test Suites:  68 passed,  68 total   Tests: 1111 passed, 1111 total   ← móvil
                              ✅ Tests pasados
→ Tests e2e...
   Test Suites: 3 skipped, 25 passed, 25 of 28 total
   Tests:       8 skipped, 354 passed, 362 total
                              ✅ Tests e2e pasados
→ Lint...                     ✅ Lint sin errores
→ Typecheck...                ✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 67/86 completadas | 18 pendientes
```

**exit code 0.** Los dos avisos son los mismos del primer pase, ninguno lo
introduce A14: el de `STATUS.md` lo causa el alta de #86 y es tarea de cierre
del leader.

## Observaciones de este pase

Ninguna. **Nada que arreglar.**

A14 es el tamaño correcto para lo que arregla: una guarda de tres líneas, con su
mutación versionada aparte, y el `expect` de una línea que cierra O1. Las dos
cosas que dejé medidas en el primer pase están cerradas y **las dos las vi
fallar yo**, no las leí en un informe.

Vale la pena dejar escrito que el defecto del estado vacío **lo destapó la
prueba de humo y no un test** — y no por un descuido: los candados de #70 eran
correctos para #70, donde la sección *sólo* tenía vacuna. El escenario que
faltaba —*sin vacuna* **y** *con* recordatorios— sólo existe desde #85. Es la
misma clase de hueco que O1: **una dimensión nueva que nace al combinar dos
features**, y que ninguna de las dos, por separado, tenía motivo para mirar.
Coherente con la lección de memoria *"decisiones por elemento repetido"*: cada
ronda destapa una dimensión más.

## Qué queda antes de `done`

Del primer pase seguían abiertos seis puntos. Con este pase y el humo humano del
2026-09-10, quedan **cuatro**, todos del leader o del humano, ninguno de código:

1. **`STATUS.md`**: `67/85` → `67/86`
2. **`feature_list.json`**: `85` a `"done"`
3. **PR** con `gh pr create`; **el humano mergea**
4. **O1 ya no está abierto** — A14 lo cerró. Lo que sí queda vivo es el corolario
   que A14 dejó escrito en `docs/ui-guidelines.md`: *inventariar no es candar*

**Este es el gate que faltaba. Por mi parte, la feature #85 está lista para
marcarse `done`.**
