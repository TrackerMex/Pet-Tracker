# review: mobile-health-make-parity (#115)
Fecha: 2026-10-06
HEAD revisado: 0e39d7b515004a05162d626525de26712697f42d
Veredicto: RECHAZADO

`git rev-parse HEAD` dio `0e39d7b5…` al empezar y otra vez antes de firmar.
Coincide con el HEAD que registró el leader en `115-init-head.txt`.
`origin/main` = `e002a4a5`, y `git merge-base --is-ancestor origin/main HEAD`
dio exit=0. El único fichero sin commit en el árbol es este informe.

**El código de producción está bien. Fallan dos candados.** Las dos mutaciones
supervivientes salen de filas de las tablas de test de la spec firmada. Codex
las copió al pie de la letra. Por eso cada defecto pide primero una enmienda
de spec (leader + gate) y después el ajuste del test (Codex).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo `115`)
- [x] `progress/current.md` describe la sesión activa (#115, branch, gate, handoff).
  No menciona la CORRECCION 1, el merge `a3548767` ni la CORRECCION 2
  (Observación 3). No bloquea C2.

## Checklist C3 — Arquitectura
- [x] Solo se toca la capa de presentación: el único fichero de producción es
  `mobile-pet-tracker/src/screens/health/index.tsx`
- [x] Sin dominio, sin API y sin tipos nuevos. No hay diff contra `origin/main`
  en `src/api/`, `src/i18n/catalog.ts`, `weight-chart.tsx`,
  `pet-hero-header.tsx`, `pet-switcher.tsx`, `src/screens/home/` ni
  `src/screens/weight-log/`
- [x] La pantalla usa componentes y helpers que ya existían: `PetHeroHeader`,
  `WeightChart`, `calendarDaysUntil`, `fmtDate` y `useLocale`. D7 y D8
  prescriben importar de `../home/format`
- [x] Sin backend (`git diff --stat origin/main -- backend-pet-tracker/` vacío)

## Checklist C4 — TDD
- [x] Cada R-id de código (R1–R7) tiene tests que lo nombran en su `describe`
  (`#115 R2:`, `#115 R3:`, `#115 R5:`, `#115 R6:`). R1, R4 y R7 se cubren con
  tests adaptados o candados globales (`#65 R5`, `#65 R18`, `#87 R13`,
  `#62 R15`, `#69 R10`), como prescribe tasks.md.
- [x] El historial va test primero: rojo y verde son commits separados para
  T1–T4. Reconstruí yo cada rojo: tests en el commit rojo y producción en su
  padre, con `--runTestsByPath`, restaurando después con
  `git checkout HEAD --` (diff=0 y cached=0). Todo coincide con tasks.md:

  | Rojo | Tests @ / prod @ | Fallos | Consulta / aserción | Esperado en tasks.md |
  |---|---|---|---|---|
  | T1 R4 | `4763b520` / `1b87006e` | 3 | 0 / 3 | 3 por aserción |
  | T2 R2 R3 | `78a2a0cd` / `4157d681` | 13 | 12 / 1 | consulta: 3 `it` de R2, 5 filas, safe area adaptado, 3 de R3; aserción: hub adaptado |
  | T3 R5 | `7e7f4a90` / `3cbdc49b` | 2 | 2 / 0 | 2+ y 1 registro por consulta; los 4 de sin registros, error ×2 y carga nacen verdes |
  | T4 R6 R1 R7 | `a88ce6c8` / `1ae2b78f` | 13 | 9 / 4 | consulta: 7 filas, receta, highlight adaptado; aserción: «ordena», #65 R5, #65 R18, #62 R15 |

  `#69 R10` nace verde en T4, como declara tasks.md tras `1b87006e`.
- [ ] **Los candados muerden en todas sus ramas.** No muerden: el de R2 y el
  de los días de R6 dejan pasar mutaciones que incumplen la spec (Defectos 1
  y 2).
- [x] `b6c08b2a` es un feat de R5 que no queda verde. Lo reconstruí: falla 1
  test por aserción («con dos o más registros…»). El verde llega en
  `1ae2b78f`. Está documentado en `traceability.md:22-26` (Observación 2).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente» (`grep -ci pendiente` = 0). R9 dice
  «gate humano»
- [x] Los 11 hashes citados existen y son ancestros de HEAD
  (`git merge-base --is-ancestor`, exit 0 en todos): `4763b520`, `4157d681`,
  `78a2a0cd`, `3cbdc49b`, `7e7f4a90`, `b6c08b2a`, `1ae2b78f`, `a88ce6c8`,
  `08d106e2`, `bd2f67d9` y `2bfd4477`
- [x] Commits `test|feat|fix(mobile-health): #115 Rn …`. El R-id va en la
  descripción, no como `(R-ids)` al final. Es la práctica del proyecto
  (Observación 5)

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla §Aprobación
  marcada: Notion, página `3f06115a-9b27-811f-802d-c7a05058341d`, firma en
  `2bfd4477`
- [x] `git diff 2bfd4477 HEAD` sobre `requirements.md` y `design.md` sale vacío.
  Nadie tocó la spec después de la firma

## Checklist C7 — Sin código huérfano
- [x] La consulta de peso con `limit 1` se sustituye en el sitio por la clave
  de weight-log (R4). No queda rastro del limit, y `R4-call-only-limit` y
  `R4-key-only-1` caen
- [x] N/A en lo demás: la feature no reemplaza componentes ni módulos

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Medido en `src/screens/health/index.tsx`, todo con resultado 0:
  - `react-native-reanimated`
  - `StyleSheet.create`
  - hex `#[0-9A-Fa-f]{3,8}`
  - valores arbitrarios `\w-\[`
- [x] Safe areas por `useSafeAreaInsets`: `paddingTop: insets.top + 12` en
  `health-states` y `paddingBottom: insets.bottom + 96` en el scroll. El hero
  a sangre trae su propio inset
- [x] Carga con `Skeleton` (`health-loading`) y reintento en error, como antes
- [x] Se reutilizan `PetHeroHeader variant="bleed"`, `PetSwitcher` en el slot,
  `WeightChart` y `Card`. Ningún componente nuevo
- [x] `weight-log-link` conserva `TOUCH_SLOP` (2 usos). Sin animación nueva
- [x] Cifras con `TABULAR_NUMS` en los 3 contadores (`#62 R15`). El único
  `text-accent-strong` es `weight-current`, el mismo que en `origin/main`
  (`#61 R4` 1 → 1)
- [x] `next-vaccine-days` tiene `accessibilityLabel` «Faltan N días» / «In N
  days» cuando `days > 0`

## Alcance

```bash
git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
```
```
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
progress/impl_mobile-health-make-parity.md
specs/mobile-health-make-parity/traceability.md
exit=0
```
Salen exactamente los 7 ficheros de design §1.2.

- `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`:
  0 bytes
- `git diff --stat origin/main -- backend-pet-tracker/`: 0 bytes

## Candados compartidos
Deltas de #115 sobre `origin/main` `e002a4a5` (incluye #117). El diff de 2
puntos y el de 3 puntos dan lo mismo:
- `consistency-classnames.test.ts`:
  - `[join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6`
  - la suma de `#69 R10` gana `+ 1` y la etiqueta `#115 R6`
  - ningún otro cambio
- `ui-copy-table.ts`: +3 filas `src/screens/health/index.tsx` con
  `home.nextVaccineDays`, `home.nextVaccineDaysLeft` y `home.nextVaccineToday`
- `ui-language.test.ts`:
  `toHaveLength(32 + 1 + 1 - 2 + 3); // … +3 #115 R1`
- `legibility-classnames`, `design-drift` y `language-provider` sin diff.
  `language-provider` sale con 24 tests por #117, no por #115
- Línea base de las 8 suites de control en HEAD: 292/292, exit 0. Por suite:

  | Suite | Tests |
  |---|---|
  | Salud | 55 |
  | ui-language | 30 |
  | pet-hero-header | 37 |
  | design-drift | 60 |
  | weight-chart | 4 |
  | consistency | 55 |
  | language-provider | 24 |
  | legibility | 27 |

## Copy
No hay claves nuevas en el catálogo. Las 3 reusadas de Home resuelven a los
literales de la spec (R1). Lo comprueban las filas a–g de R6 en los dos
idiomas:

| Caso | ES | EN |
|---|---|---|
| Hoy | `Hoy` | `Today` |
| Días restantes | `2 d`, `4 d`, `365 d` | `2 d` |
| Etiqueta de accesibilidad | `Faltan 2 días`, `Faltan 4 días`, `Faltan 365 días` | `In 2 days` |
| Fecha | `31 dic 2026`, `2 ene 2027`, `1 ene 2027`, `3 feb 2027`, `31 dic 2027` | `Jan 2, 2027`, `Jan 1, 2027` |
| Hoy, sin etiqueta | `undefined` | `undefined` |

## Mutaciones propias del reviewer
Cada fila es una mutación sobre `src/screens/health/index.tsx`, una cada vez.
Las 4 suites medidas son Salud, `ui-language`, `consistency-classnames` y
`legibility-classnames`: 167 tests. Después de cada una restauré con
`git checkout HEAD -- src/screens/health/index.tsx`, y `git diff --quiet` y
`git diff --cached --quiet` dieron 0 las 21 veces.

| Mutación | Fallos | Cómo cae |
|---|---|---|
| R5: `<View>` alrededor de `WeightChart` | 2 | aserción en 2+ y 1 registro. Es la rama «es o contiene»: la fila de 1 registro exige «[2] es weight-chart-empty» y la EARS dice «[2] la salida de WeightChart» |
| R5: gráfica en las demás ramas | 4 | aserción en sin registros, error ×2 y carga. Los que nacieron verdes muerden |
| **R2: fragmento `<>` de `index.tsx:96`/`:276` cambiado por `<View>`** | **0** | **sobrevive (167/167)**. Defecto 1 |
| R2: `paddingTop` distinto en pendiente | 2 | aserción en su fila y en el safe area adaptado |
| R2: `paddingTop` distinto en error, unreachable, missing-config o vacía | 1 cada uno | aserción, cada estado en su propia fila |
| R2: sin título en error / en vacía | 1 / 1 | consulta |
| R3: `highlight` en el hero | 1 | aserción |
| R4: clave con `limit 1` | 1 | `#87 R13` |
| R4: llamada con `limit 1` | 2 | los dos `calledWith` de R4 |
| R6: `Math.round((Date.parse(iso) - Date.now()) / 86400000)` | 7 | las 7 filas, pero por accidente (Observación 6) |
| **R6: `Math.ceil((Date.parse(iso) - Date.now()) / 86400000)`** | **0** | **sobrevive**. Defecto 2 |
| R6: días ignorando el mes | 3 | filas b, d y f |
| R6: días ignorando el año | 3 | filas b, e y f |
| R6: fecha con `'en-US'` fijo | 6 | a–e más el highlight adaptado |
| R6: `days + 1` en la etiqueta / en el texto | 4 / 4 | filas b, d, e y f |
| R6: fecha con desplazamiento UTC | 8 | aserción en las 7 filas; consulta en el highlight adaptado |

Sonda de zona horaria: R6 con `TZ` en el proceso de jest, por cada zona.

| Zona | R6 sin mutar | Mutante `ceil` |
|---|---|---|
| UTC | 9/9 verdes | 0 fallos |
| America/Mexico_City | 9/9 verdes | 0 fallos |
| Asia/Tokyo | 9/9 verdes | 0 fallos |
| Pacific/Pago_Pago | 9/9 verdes | 0 fallos |
| Pacific/Kiritimati (UTC+14) | 9/9 verdes | 7 fallos |

Restauración limpia: diff=0, cached=0.

No hay aserciones tautológicas. Los valores esperados son literales:
`{ fontVariant: ['tabular-nums'] }`, `'overflow-hidden bg-default'`, copy y
fechas. El único símbolo de producción importado en una aserción es
`healthKeys`/`petKeys` en `#87 R13`, y ahí compartir la clave de caché es
justo lo que se verifica.

## Observaciones

### Defectos (bloquean)

1. **R2 / C4: el candado de «únicos hijos del scroll» no ata el padre común
   al scroll.**
   - Dónde: `mobile-pet-tracker/src/screens/health/index.test.tsx:750-762`,
     aserciones en `:756-759`.
   - Qué comprueba: `hero.parent === content.parent`, que ese padre tiene 2
     hijos y su orden. Nunca comprueba que ese padre sea el contenedor del
     scroll `screen-health`.
   - Mutación superviviente: cambiar el fragmento `<>`…`</>` de
     `src/screens/health/index.tsx:96` y `:276` por `<View>`…`</View>`. Pasan
     los 167 tests de las 4 suites.
   - Qué se rompe:
     - La EARS de R2 (`specs/mobile-health-make-parity/requirements.md:138-140`:
       «pintar como únicos hijos del contenedor del scroll `screen-health`»).
     - El resultado visible: el `gap: 16` del `contentContainerStyle` deja de
       separar hero y contenido, y los tests siguen en verde.
   - Origen: la fila de la tabla de R2 (`requirements.md:158`) prescribe solo
     el padre común con 2 hijos. La sonda M7 de design §2 cubre «hero dentro
     de `health-content`», no un envoltorio común.
   - Qué hace falta: enmendar esa fila (y añadir su sonda a design §2) para
     que el padre común quede ligado a `screen-health`. Después, Codex ajusta
     el test.

2. **R6 (D8) / C4: el candado de los días está ciego a la zona horaria.**
   - Dónde: `mobile-pet-tracker/src/screens/health/index.test.tsx:942-967`,
     y los `it` de `:970-971` y `:986-987`. Todas las filas fijan la hora
     local a las 12:00 (`setSystemTime` en `:953`) y corren en la zona del
     proceso, que en esta máquina y en CI es UTC.
   - Mutación superviviente: cambiar `calendarDaysUntil(nextVaccine.nextDoseAt!, new Date())`
     (`src/screens/health/index.tsx:82`) por
     `Math.ceil((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000)`.
     - Pasa en UTC, America/Mexico_City, Asia/Tokyo y Pacific/Pago_Pago.
     - Solo cae en Pacific/Kiritimati.
     - En UTC el `ceil` coincide con los días de calendario a cualquier hora,
       así que ninguna fila en UTC puede matarlo.
     - Para un usuario en es-MX (UTC-6), a partir de las 18:00 locales daría
       un día menos: `1 d` en vez de `2 d` el 31 de diciembre para el 2 de
       enero.
   - Qué se incumple: D8 (`requirements.md:32`), que prescribe
     `calendarDaysUntil`. Lo único que lo guarda es el ancla grep
     `calendarDaysUntil(` = 1 de §Medidas (`requirements.md:51`), que no es
     un test.
   - Origen: la tabla de R6 (`requirements.md:234-247`) solo prescribe el
     mediodía en la zona del proceso.
   - Precedente en el repo: la técnica para cambiar la zona dentro de jest ya
     existe, `process.getBuiltinModule('process')` en
     `src/screens/meal-schedule/index.test.tsx:122` (#147 E1.2).
     `process.env.TZ` no sirve dentro de jest.
   - Qué hace falta: enmendar la tabla para que al menos una fila corra en
     una zona distinta de UTC y a una hora en la que días de calendario y
     milisegundos difieran.

### Observaciones (no bloquean)

3. `progress/current.md` no recoge la CORRECCION 1, el merge `a3548767` ni la
   CORRECCION 2. Su única mención a una CORRECCION 1, en la línea 22, es la
   de #116.
4. El frontmatter de `design.md`, `tasks.md` y `traceability.md` sigue en
   `status: spec_ready`, mientras `requirements.md` está en `approved`.
5. Formato de commit: el R-id va en la descripción (`#115 Rn`) y no como
   `(R-ids)` final. Es la práctica del proyecto.
6. El mutante `Math.round` cae en las 7 filas solo porque `waitFor` adelanta
   el reloj falso más allá del mediodía y vuelca el redondeo. Es una muerte
   accidental: refuerza el Defecto 2.
7. `bd2f67d9`, un commit extra que solo toca el impl, figura como autorizado
   por el humano según Codex (`impl_mobile-health-make-parity.md:787`, «impl
   ya autorizado»). El leader no vio esa autorización: hay que confirmarla con
   el humano. No toca código.
8. `b6c08b2a` es un feat de R5 que no queda verde (1 fallo por aserción, lo
   reconstruí). Está declarado en `traceability.md:22-26` y se corrigió en
   `1ae2b78f` sin reescribir historia.
9. Cosmético: hay una línea en blanco antes del `</View>` de `health-states`,
   en `src/screens/health/index.tsx:310`.
10. R9 (smoke S1–S9 en dev build de Android) queda pendiente del humano. No
    forma parte de esta revisión.
11. Producción correcta: todas las anclas de §Medidas cuadran, incluido
    `t('home.next…'` = 1 por clave. La implementación no necesita cambios
    para cerrar los Defectos 1 y 2: solo los tests y la spec.

## Output de ./init.sh
Lo corrió el leader sobre el mismo HEAD (`115-init-head.txt` =
`0e39d7b515004a05162d626525de26712697f42d`). Al subagente se le deniega.
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ca371cbf-0293-48e8-a0e6-dc27b30ff202/scratchpad/115-init.log`
(26380 líneas). Resúmenes:

```
Test Suites: 176 passed, 176 total      (backend unit)
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 94 passed, 94 total        (mobile jest)
Tests:       2139 passed, 2139 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total   (backend e2e)
Tests:       8 skipped, 438 passed, 446 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```

Las 8 líneas `ERROR` del log son ruido esperado de tests negativos que pasan:
- Líneas 86-113: tests unitarios de workers.
  - `AlertsEngineConsumerService` y `PositionsConsumerService`:
    `messageId: 'bad'`, cuerpo malformado.
  - `PollerService`: `sqs unavailable`, `wialon down for device-1` y
    `ECONNREFUSED 127.0.0.1:4566` en el ciclo saltado.
- Líneas 26207-26234: `DrizzleQueryError` por la FK
  `pet_users_user_id_users_id_fk`. Sale de
  `backend-pet-tracker/test/pets.e2e-spec.ts:207` («si el insert de pet_users
  falla, la fila de pets no persiste (rollback)»), que firma un token para
  un usuario fantasma y espera un status ≥ 500.

No hay ningún FAIL, y el log termina en `exit=0`.

Veredicto: rechazado

---

## Ronda 2 (2026-10-06)
HEAD revisado: b7692d344c4abcbdd82082a5d665b6ca2200eda3
Veredicto: RECHAZADO (defectos R6-a y R6-b; R2, R8 y R10 bien)

`git rev-parse HEAD` = `b7692d34…` al empezar; coincide con
`r2-init-head.txt` del leader. El árbol tiene, además de este informe, una
edición sin commit del leader en `progress/current.md` (avisada por él, fuera
de esta revisión).

### R8 — Alcance (lista cerrada de design §1.2)
`git fetch` previo. `origin/main` avanzó a `37f6362c` (merge de #149) y ya
no es ancestro de HEAD; la merge-base sigue siendo `e002a4a5`. El comando de
la lista cerrada usa `origin/main...HEAD` (tres puntos, contra la
merge-base), así que sigue midiendo solo esta branch. Da exactamente los 10
ficheros de §1.2, ni uno más:

```
mobile-pet-tracker/app.assets.test.ts
mobile-pet-tracker/assets/images/splash-icon.png
mobile-pet-tracker/scripts/make-icons.mjs
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
progress/impl_mobile-health-make-parity.md
specs/mobile-health-make-parity/traceability.md
```

- `package.json` y `bun.lock` (`origin/main...HEAD`): vacío.
- `backend-pet-tracker/`: vacío.
- `assets/`: solo `assets/images/splash-icon.png`.
- Anclas negativas de §1.2 (`app.json`, `app.config.ts`,
  `app.config.test.ts`, `src/screens/welcome/`, `src/app/index.tsx`,
  `src/components/`, `src/screens/home/`, `src/i18n/`,
  `docs/ui-guidelines.md`): vacío.
- La producción de Salud (`src/screens/health/index.tsx`) no cambió entre
  `07851dc4` y HEAD: no aparece en `git diff --stat 07851dc4 HEAD`.
- `git merge-tree --write-tree origin/main HEAD`: un conflicto, en
  `STATUS.md` (fichero del leader). `feature_list.json` se fusiona solo.
  Ningún fichero de la lista cerrada choca con #149.

### Línea base de jest (HEAD, sin mutar)
Desde `mobile-pet-tracker/`, sin pipe:
`bunx jest src/screens/health/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts app.assets.test.ts`
→ exit=0, 5 suites, 179 tests (Salud 56, `app.assets` 11, las otras tres
112). Salud en `--verbose`: 56 `it`, entre ellos `fila h` y `únicos hijos`.

### Sondas de la Enmienda E1, re-ejecutadas
Todas las mutaciones van sobre `src/screens/health/index.tsx`, una cada vez,
con `--runInBand`. Restauración tras cada una con
`git checkout HEAD -- src/screens/health/index.tsx`; `git diff --quiet` y
`git diff --cached --quiet` dieron 0/0 las 10 veces.

| Sonda | Suites | Resultado | Cómo cae | ¿Cuadra con design §2? |
|---|---|---|---|---|
| M25 `<View>` en lugar de `<>`/`</>` | Salud + 3 globales (168) | 1 fallo: `#115 R2 › con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` | aserción `toBe` (Expected `<RCTScrollView …>`) | sí |
| M23 `Math.ceil(ms / 86400000)` | Salud (56) | 1 fallo: `fila h` | aserción `toHaveTextContent` dentro del `waitFor` | sí (solo h) |
| M24 `Math.round(ms / 86400000)` | Salud (56) | 8 fallos: `fila a`…`fila h` | aserción `toHaveTextContent` | sí (a–h) |

Los dos candados de la ronda 1 ahora muerden. Ninguno asevera contra un
símbolo importado de producción: E1.1 compara con el nodo
`screen.getByTestId('screen-health')` y E1.2 con literales de la tabla.

Nota sobre M25 con workers (sin `--runInBand`): la suite de Salud no
informa del `it` caído, sino `Test suite failed to run — Jest worker
encountered 4 child process exceptions`. El worker revienta con
`TypeError: Converting circular structure to JSON` al serializar el
`matcherResult` del `toBe` entre dos `ReactTestInstance` (circulares por
`parent`). El rojo existe (exit=1) pero no dice qué `it` cayó. Pasa igual con
las aserciones `toBe` de nodos que ya había en ese `it` antes de E1.1. Ver
Observación R2-c.

### Barrido de zona ciega (cláusulas universales de R2 y R6)

| Id | Mutación | Suites | Resultado |
|---|---|---|---|
| B1 | `days = Math.round((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000) + 1` | Salud | **sobrevive (56/56)** |
| B2 | `days = Math.ceil((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000 + 0.5)` | Salud | **sobrevive (56/56)** |
| B3 | `days = new Date(nextDoseAt).getDate() - new Date().getDate()` | Salud | 5 fallos (b, d, e, f, h), aserción |
| B4 | `next-vaccine-days` con `className={days === 0 ? 'text-lg font-black text-success' : '…text-warning-strong'}` | Salud + `consistency` + `legibility` (138) | **sobrevive (138/138)** |
| B5 | `next-vaccine-days` con `style={days === 0 ? undefined : TABULAR_NUMS}` | Salud | **sobrevive (56/56)** |
| B6 | título de `health-states` `text-2xl` → `text-xl` | Salud + 3 globales + `design-drift` (228) | sobrevive (228/228); el `className` del título ya estaba así en la base `8afae724:…/health/index.tsx:87` |

B1 y B2 son cuentas en milisegundos. Comprobado fuera de jest con
`TZ=<zona> node` (script en el scratchpad del reviewer), con la fórmula de
`calendarDaysUntil` copiada de `src/screens/home/format.ts:13-20`:

| TZ | Ahora (local) | Próxima | `calendarDaysUntil` | B1 | B2 |
|---|---|---|---|---|---|
| UTC | 2026-12-31 06:00 | 2026-12-31 | 0 (`Hoy`) | 1 | 1 |
| UTC | 2026-12-31 06:00 | 2027-01-02 | 2 | 3 | 3 |
| UTC | 2026-12-31 12:00:00.000 | 2026-12-31 | 0 | 1 | 0 |
| America/Mexico_City | 2026-12-31 06:00 | 2027-01-02 | 2 | 3 | 2 |
| B7 | hijo extra en `next-vaccine-card` solo con `days === 0`: `{days === 0 ? <View /> : null}` antes de `next-vaccine-days` | Salud | **sobrevive (56/56)** |
| B8 | `next-vaccine-date` con `className={days === 0 ? "font-normal text-foreground" : "font-normal text-muted"}` | Salud + `consistency` + `legibility` (138) | **sobrevive (138/138)** |

B1 pasa la fila a solo porque `waitFor` adelanta el reloj falso unos ms más
allá de las 12:00:00.000. A esa hora exacta B1 da 1 (`1 d` el día de la
dosis). Es el mismo accidente de la Observación 6 de la ronda 1, pero ahora a
favor del mutante.

Restauración tras B1–B8: `git diff --quiet` y `git diff --cached --quiet`
0/0 cada vez.

### R10 — splash
- PNG commiteado: `sha256sum` =
  `087c1eaa69e8324ac46e98073897ddc261d3f25b764f00d6216fb5014c05e56d`, igual
  en el árbol y en `92c4e5d6`, y coincide con la firma de `35476758`
  (`requirements.md` §Aprobación › PNG del splash). La firma (`35476758`)
  es anterior al verde (`92c4e5d6`), como pide el gate.
- Formato leído del IHDR con un script propio: firma PNG válida;
  1024×1024; profundidad 8; tipo de color 6; compresión 0; filtro 0;
  entrelazado 0; chunks IHDR, IDAT e IEND (uno de cada).
- Inspección visual con Read: previews sobre `#9460FC`, `#FFFFFF` y
  `#0D1117`, más un zoom ×3,2 por vecino más cercano de oreja, barbilla y
  antena sobre oscuro y blanco. Sin halo blanco, sin mate ni tinte cian
  visible y sin restos del pin ni del cuadrado.
  - Medido con `jimp-compact`: caja de alfa > 0 `[191, 230, 833, 764)`,
    dentro de `[174, 850)`.
  - 2270 píxeles semitransparentes, de color medio neutro `(131, 135, 136)`.
    Solo 3 tienen un sesgo cian claro (g y b > r + 40).
- `scripts/make-icons.mjs`: el diff `07851dc4..HEAD` borra exactamente
  `import fs from 'node:fs';` (más su línea en blanco) y la línea
  `fs.copyFileSync(…android-icon-foreground.png…, …splash-icon.png)`.
  `grep -c 'splash-icon'` = 0 y `grep -c "node:fs"` = 0: cuadra con las
  anclas de R10.
- Anclas negativas: ver R8. `app.json` (plugin `expo-splash-screen` en
  `:35`), `src/screens/welcome/index.tsx:73` y `src/app/index.tsx:22` siguen
  apuntando a `splash-icon.png` y no cambian. `assets/` solo cambia en
  `splash-icon.png`.
- Helpers `readAlpha` y `countAlpha`: `diff -w` contra el bloque de design
  §1.8 da solo una línea en blanco de diferencia. Los 4 `it` son los de
  §1.8, con literales. El 1024×1024 lo sigue fijando
  `#101 R6 › splash-icon.png … mide 1024x1024 RGBA`.

Sondas re-ejecutadas sobre `app.assets.test.ts` con `--runInBand`. Los PNG
se generaron en el scratchpad del reviewer: M26 sale de
`git show origin/main:…/splash-icon.png`, blob `e2630ab8`, el mismo que en
la merge-base `e002a4a5`. Tras cada sonda,
`git checkout HEAD -- assets/images/splash-icon.png`, con diff y cached
0/0.

| Sonda | Resultado | Cómo cae | ¿Cuadra con design §2? |
|---|---|---|---|
| M26 PNG de la base | 2 fallos: esquinas (`toEqual` de 4 recuentos) y pin (Expected 0, Received 1600) | aserción | sí |
| M27 lienzo vacío | 1 fallo: cara (Expected 255, Received 0) | aserción | sí |
| M28 candidato en `(0, 0)` | 2 fallos: fuera (Expected 0, Received 38317) y cara (Expected 255, Received 0) | aserción | sí. Design solo nombra «fuera»; la cara cae además porque `(512, 560)` queda fuera de la mascota desplazada |

Barrido de R10: «fuera» recorre el lienzo entero. Las cuatro esquinas se
cuentan por separado dentro de un `toEqual`, así que hay un candado por
esquina. El formato se asevera en cada `it`, dentro de `readAlpha`. Halo,
degradado y resplandor no tienen candado automático: son el gate visual del
humano, ya firmado. No queda ninguna cláusula de R10 candada en un solo
caso.

### C4 — test primero
- R10: `45198dd4` (rojo) va antes de `92c4e5d6` (verde).
  - `app.assets.test.ts` es idéntico en `45198dd4` y en HEAD
    (`git diff --quiet` = 0).
  - `assets/` no cambia entre `07851dc4` y `45198dd4`.
  - Por eso el rojo de `45198dd4` es exactamente M26: esquinas y pin caen
    por aserción, y fuera y cara pasan (9 passed de 11). Es lo que dicen
    `traceability.md:128-130` y la spec (`[676, 676, 676, 676]` y 1600).
- E1.1 (`6c8baf9a`) y E1.2 (`6ac7346d`) nacen verdes. La Enmienda lo prevé
  (`requirements.md` §Enmienda: «El código de producción de Salud … **no
  cambia**: E1 solo toca `src/screens/health/index.test.tsx`»).
  `src/screens/health/index.tsx` no aparece en `git diff --stat 07851dc4 HEAD`.
  La mordida de los dos candados queda demostrada con M25, M23 y M24.

### Trazabilidad
- Ninguna fila dice «pendiente» (`grep -ci pendiente` = 0). R9 figura como
  «gate humano».
- Hashes `6c8baf9a`, `6ac7346d`, `45198dd4`, `92c4e5d6`, `35476758` y
  `07851dc4…`: todos son ancestros de HEAD, y sus asuntos coinciden con los
  citados.
- Nombres citados, con `grep -cF` = 1 cada uno:
  - En `index.test.tsx`: `#115 R2: Salud abre con el hero a sangre (A9)`,
    `con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden`,
    `#115 R6: la próxima vacuna dice fecha y días restantes` y
    `fila $row: hoy $now, próxima $next`.
  - En `app.assets.test.ts`: el `describe` de R10 y sus 4 `it`.
- Recuentos:
  - Salud: 56 en `--verbose`.
  - `app.assets`: 7 `it` en `07851dc4` y 11 en HEAD.
  - Jest entero: 2144 tests en 94 suites, más 1 snapshot (log de init.sh,
    línea 25982).
  Todo cuadra con `traceability.md:120-121`.
- La fila de R6 dice «verificado tras E1.2; M23 solo h y M24 a–h». Es cierto
  en lo que afirma, pero no basta: ver Defecto R6-a.

### Output de ./init.sh (ronda 2)
Lo corrió el leader. `r2-init-head.txt` =
`b7692d344c4abcbdd82082a5d665b6ca2200eda3` = `git rev-parse HEAD`, y
`r2-init-exit.txt` = `init_exit=0`. Log de 26325 líneas, leído por grep de
etapas y resúmenes:

```
→ Build...                       ✅ Build exitoso
→ Ejecutando tests...
Test Suites: 176 passed, 176 total      (backend unit)
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 94 passed, 94 total        (mobile jest)
Tests:       2144 passed, 2144 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
→ Tests e2e...
Test Suites: 3 skipped, 29 passed, 29 of 32 total
Tests:       8 skipped, 438 passed, 446 total
✅ Tests e2e pasados
→ Lint...                        ✅ Lint sin errores
→ Typecheck...                   ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

- No hay ningún `FAIL` ni `✕`.
- Las líneas `ERROR` de Nest (`:84-111`, `:26161`) son logs de tests que
  ejercitan caminos de error, como en la ronda 1.
- Avisos: `.env` sin 3 claves de Resend y la feature en progreso. Ninguno
  es un fallo.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json`: #115.
- [x] `progress/current.md` actualizado. En HEAD recoge la CORRECCION 1, la
  2 y la 3, el merge `a3548767`, la firma del PNG y la confirmación de la
  obs. 7. La edición sin commit del leader queda fuera de esta revisión.

### Checklist C3 — Arquitectura
- [x] La ronda 2 no toca producción de la app: solo un asset, un script de
  generación y tests. Las capas no cambian respecto de la ronda 1.
- [x] Lo mismo vale para domain, contratos, application e infrastructure:
  backend vacío.

### Checklist C4 — TDD
- [x] Los R-ids se nombran en `describe`: `#115 R2`, `#115 R6` y `#115 R10`.
- [x] Historial: R10 rojo→verde. E1.1 y E1.2 nacen verdes, como prevé la
  Enmienda.
- [ ] **Candados que muerden en todas sus ramas: no.** M25, M23, M24 y
  M26–M28 caen como dice design §2, pero el barrido deja vivos B1, B2, B4,
  B5, B7 y B8. Ver Defectos R6-a y R6-b.

### Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas «pendiente»; hashes y nombres verificados.
- [x] Formato de commit: el de la práctica del proyecto (obs. 5 de la
  ronda 1).

### Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`. Firmadas las casillas de la
  spec, de la Enmienda E1–E2 (`52bfe254`) y del PNG del splash (`35476758`).
  Los frontmatter de design, tasks y traceability están en `approved`
  (obs. 4 cerrada en `0d6c22b9`).

### Checklist C7 — Sin código huérfano
- [x] R10 sustituye #101 D4 (splash como copia del foreground). La línea de
  copia y su `import fs` se borraron de `make-icons.mjs`. No había ningún
  test de #101 que exigiera la copia byte a byte: `#101 R6` solo mide el
  IHDR y sigue verde.

### Checklist C8 — Carta de UI (solo lo que toca E2)
- [x] E2 no añade hex, clases arbitrarias ni `StyleSheet.create`. El fondo
  del splash sigue en `#9460FC`, en `app.json`, que no cambia. La
  bienvenida (`welcome-hero`) no cambia de código y sigue apuntando a
  `splash-icon.png`.
- [x] Mascota sola, sin cuadrado ni pin, legible sobre violeta, blanco y
  `#0D1117`: verificado mirándola. La validación en dispositivo es S10–S11
  de R9 (gate humano).

### Observaciones de la ronda 1
- Obs. 3 (`current.md`): cerrada. En HEAD, `progress/current.md:31-34`.
- Obs. 4 (frontmatter): cerrada. Los cuatro ficheros de la spec están en
  `status: approved` (`0d6c22b9`).
- Obs. 7 (`bd2f67d9`): cerrada. El humano lo confirmó el 2026-10-06
  (`progress/current.md:70-71` en HEAD).

## Observaciones (ronda 2)

### Defectos (bloquean)

**R6-a. El candado de días sigue muestreando la hora en dos puntos: una
cuenta en milisegundos con `+ 1` pasa las 8 filas.**
- Dónde: `mobile-pet-tracker/src/screens/health/index.test.tsx`, el
  `it.each` de `#115 R6` (filas a–h).
- Mutantes supervivientes (Salud 56/56), sobre
  `src/screens/health/index.tsx:82`:
  - B1: `Math.round((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000) + 1`
  - B2: `Math.ceil((Date.parse(nextVaccine.nextDoseAt!) - Date.now()) / 86400000 + 0.5)`
- Por qué sobreviven:
  - Las filas a–g están todas a las 12:00 en UTC: la fracción de día es
    siempre 0,5 − ε.
  - La fila h está a una fracción de 0,9167.
  - Cualquier fórmula en milisegundos que lleve −0,5 → 0, 1,5 → 2,
    3,5 → 4, 364,5 → 365 y 0,9167 → 2 pasa la tabla.
  - B1 es además el parche de una sola expresión que pone en verde las 8
    filas rojas de M24.
- Qué se rompe: D8 (`requirements.md:32`, días de calendario con
  `calendarDaysUntil`).
  - En UTC a las 06:00, B1 da `1 d` el día de la dosis (debe ser `Hoy`) y
    `3 d` para dentro de dos días (debe ser `2 d`).
  - En America/Mexico_City a las 06:00 da `3 d` para dentro de dos días.
  - Tabla de la sección «Barrido de zona ciega».
- La spec afirma algo falso: `requirements.md:262-268` dice que «cualquier
  cuenta en milisegundos da 1» en la fila h. B1 da 2.
- Lo único que guarda D8 frente a B1 sigue siendo el ancla grep
  `calendarDaysUntil(` = 1, que no es un test (igual que en el Defecto 2 de
  la ronda 1).
- Qué hace falta: enmendar la tabla de R6 para que las filas no compartan
  la fracción de día. Al menos una fila debe estar en una hora en que la
  cuenta en milisegundos redondeada y con `+ 1` difiera de los días de
  calendario: por ejemplo, por la mañana en UTC, donde B1 y B2 dan 3 para
  `2 d` y 1 para `Hoy`. Después, Codex ajusta el test, y la sonda B1 entra
  en design §2.

**R6-b. La receta y la estructura de la card solo se candan en la rama
`days > 0`.**
- Dónde:
  - `index.test.tsx:982-1008`: los `it` `ordena la card en icono, columna y días, con la fecha en la columna`
    y `pinta los días con la receta exacta`. Los dos usan solo el fixture
    `nextDoseAt: '2099-05-01'`, es decir, `days > 0`.
  - Las filas a, c y g (rama `Hoy`) solo miran el texto, la etiqueta, la
    fecha y el nombre.
- Cláusulas universales de R6 (`requirements.md:218-226`) que en la rama
  `days === 0` quedan sin candado:
  - «WHEN hay próxima vacuna … tres hijos …»
  - «pintar `next-vaccine-days` con `className` exacto
    `text-lg font-black text-warning-strong` y `style={TABULAR_NUMS}`»
  - «`next-vaccine-date` (`font-normal text-muted`)»
- Mutantes supervivientes, todos solo con `days === 0`:
  - B4: `next-vaccine-days` en `text-success`. Sobrevive con Salud,
    `consistency` y `legibility`: 138/138.
  - B5: `next-vaccine-days` sin `TABULAR_NUMS`. Salud 56/56. El contador de
    `#62 R15` cuenta el símbolo en el fichero y no lo ve.
  - B7: un cuarto hijo en `next-vaccine-card`. Salud 56/56.
  - B8: `next-vaccine-date` en `text-foreground`. 138/138.
- `next-vaccine-days` y la fecha formateada son nuevos en #115: no existen
  en `8afae724:…/health/index.tsx`.
- Qué hace falta: enmendar la tabla de tests de R6 para que la receta (los
  dos `className` y el `style`) y la estructura de 3 hijos se aseveren
  también en la rama `Hoy`, y añadir B4, B5, B7 y B8 (o equivalentes) a
  design §2. La producción no cambia.

### Observaciones (no bloquean)

R2-c. M25 con workers de jest no nombra el `it` caído.
- En ejecución normal, la suite de Salud sale como
  `Test suite failed to run — Jest worker encountered 4 child process exceptions`.
- Causa: `TypeError: Converting circular structure to JSON` al serializar
  el `toBe` fallido entre `ReactTestInstance`. El rojo existe (exit=1).
- Con `--runInBand` cae por aserción en el `it` correcto.
- Afecta a todas las aserciones `toBe` de nodos de ese `it`, no solo a la
  de E1.1. Solo empeora el diagnóstico: el candado muerde igual.

B6. El `className` del título de `health-states`
(`text-2xl font-black text-foreground`) no tiene candado en ninguna de las
5 filas ni en las suites globales.
- `text-xl` sobrevive en Salud, las 3 globales y `design-drift`: 228/228.
- R2 lo enuncia en su WHILE (`requirements.md:146-147`). Pero ya era así en
  la base (`8afae724:…/health/index.tsx:87`) y #115 no cambia ese
  `className`, así que no lo cuento como defecto.
- El leader decide si lo mete en la misma enmienda.

`origin/main` avanzó a `37f6362c` (#149) después del HEAD revisado.
- `git merge-tree` da conflicto solo en `STATUS.md`, que es del leader.
- Hay que resolverlo antes de la PR: una PR en estado CONFLICTING no corre
  los checks.

Cosmético: M28 tumba también «cara», además de «fuera», porque la mascota
desplazada ya no cubre `(512, 560)`. Design §2 solo nombra «fuera». No
cambia nada.

R9 (smoke S1–S11 en dev build de Android) es gate humano y queda fuera de
este veredicto, que cubre R1–R8 y R10. R1, R3, R4, R5, R7 y R8 no cambian
desde la ronda 1 y R8 vuelve a cuadrar con 10 ficheros. R2 (E1.1) y R10
quedan bien candados. El rechazo es solo por R6 (R6-a y R6-b). Los dos
defectos piden primero una enmienda de la spec y después el test; la
producción de Salud no cambia.

Árbol al entregar: `git status --porcelain` muestra solo este informe y la
edición del leader en `progress/current.md`. Las 15 ejecuciones de sonda (M23–M28, B1–B8,
M25 con workers y M25 en banda) se restauraron con diff y cached en 0/0.

Veredicto ronda 2: **RECHAZADO**
