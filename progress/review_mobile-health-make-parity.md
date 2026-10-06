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
