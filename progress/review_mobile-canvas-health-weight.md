# review: mobile-canvas-health-weight (#199)
Fecha: 2026-10-24
Veredicto: APROBADO

Branch: `feature/199-mobile-canvas-health-weight` @ `bd20a22a` (worktree `/home/claude/sites/Pet-Tracker-wt-199`).
Diff neto revisado: `git diff 329c613c bd20a22a` (origin/dev con #198 → HEAD). Historial C4: `git log 6bbd0485..d49e10da` (84 commits, base del handoff `6bbd0485`).
Merge: `d80357d0` (origin/dev `329c613c` en la feature; merge-base `6bbd0485`), documentado en `bd20a22a` (solo `progress/impl_mobile-canvas-health-weight.md`, +37).
Skills: `expo:expo-overview` cargada; la UI se revisa contra `docs/ui-guidelines.md`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#199). El único cambio de `feature_list.json` en el diff neto es `pending → in_progress` de #199.
- [x] `progress/current.md` es la plantilla, sin sesión colgada.
- [x] Árbol: `git status --short` solo muestra `?? progress/handoff_mobile-canvas-health-weight.md` (handoff del leader, no versionado) y `?? progress/review_mobile-canvas-health-weight.md` (este fichero).

## Checklist C3 — Arquitectura
- [x] No hay diff en `backend-pet-tracker/` ni en `infra/`.
- [x] Las pantallas (`screens/health`, `screens/weight-log`) importan solo de `components/`, `theme/`, `i18n/`, `api/` y `screens/home/format.ts`. No hay acceso directo a la red ni lógica de negocio nueva fuera de los hooks de datos existentes.
- [x] `components/weight-chart.tsx` es presentacional puro. Recibe `entries` y `variant`, y su geometría y ventana son funciones locales (`chartMonths`, el filtro de ventana).
- [x] La producción tocada se limita a 8 ficheros: `_layout.tsx`, `weight-chart.tsx`, `catalog.ts`, `health/index.tsx`, `format.ts`, `weight-log/index.tsx`, `global.css` y `motion.ts`.

## Checklist C4 — TDD
- [x] Cada R1–R27 tiene al menos un test que nombra `#199 R<n>`. Los amendados llevan el sufijo `(enmendado por #199 R<n>)`.
- [x] El historial es test primero por requisito: el commit `test(#199): R<n> specify …` va antes del `feat(#199): R<n> …`.
- [x] Los logs rojos guardados por Codex fallan por aserción, no por excepción ni por import.
- [x] Las filas que nacen verdes llevan sonda documentada en `progress/impl_mobile-canvas-health-weight.md`: R2, R3, R8, R9, R10, R24, R25, R26 (17 sondas, una por ancla) y R27.
- [x] R8 y R26 son `test(#199)` sin producción. Lo declara la nota de `traceability.md` y lo respaldan sus sondas.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` tiene 27 filas (R1–R27) y ninguna dice «pendiente».
- [x] Los 33 hashes citados son ancestros de HEAD y su asunto coincide literalmente con el de la fila.
- [x] Los commits siguen `feat|test(#199): R<n> <desc>`. El único `refactor(#199)` (`e79ece38`, R1, quita `useTranslate` sin uso de `_layout.tsx`) está permitido por la errata `25979e93`.
- [x] Títulos: 84 de los 88 títulos `#199` que cita `requirements.md` existen literalmente en los tests. Los 4 restantes nombran su R-id con otra redacción (ver N1).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`, `[x] Aprobado por humano (fecha: 2026-10-23)` y `[x] Enmienda #199 aprobada por humano`.
- [x] La firma es delegada en el leader por el mandato del humano del 2026-10-23, recogido en `progress/plan_canvas-parity-2026-10-23.md` §0 y §4 («aprobar las specs por él»):
  - firma `cf0ae073`
  - re-firma `96f076f4`
  - E1 `f6f28512` + `48dd0f02`
  - erratas `25979e93` y `26df9541`
- [x] Las cuatro enmiendas y erratas caen después de la base y antes de los commits que las consumen. Las de `25979e93` y `26df9541` declaran el mandato en su cuerpo.
- [ ] Siguen abiertas las seis casillas de smoke (R1, R2, R5+R6, R13, R23, R24). Son gate de cierre del humano en dev build Android, no de implementación (ver N10).

## Checklist C7 — Sin código huérfano
- [x] Ya no existen en producción `HeroUICard`, `HeaderHeightContext`, `LinearGradient`, `HeartPulse`, los esqueletos `h-40`/`h-24`/`h-12 rounded-card` ni el envoltorio `weight-month-delta`. La cuenta es 0 en las anclas de Base, re-medidas en HEAD.
- [x] `_layout.tsx` ya no importa `useTranslate`. `weight-log` declara solo `{ headerShown: false }`. `headerShown` sale 5 (dev 4 + 1).
- [x] Sin claves huérfanas en el catálogo. La única clave que deja de usarse en un fichero es `weightLog.weightLog` en `_layout`, y ahora la usa `weight-log/index.tsx` (cabecera propia, R1). Las +7 claves por idioma tienen uso y fila en `ui-copy-table.ts`.
- [x] El `describe` temporal F197 `#197 R20: cimientos sin cablear` no existe ni en HEAD ni en dev (lo retiró #198, el primero de la ola 2). No queda sustituto.
- [x] Los candados revertidos del inventario («Candados que esta feature revierte») están amendados con sufijo y no queda ningún test que asierte la UI anterior.

## Checklist C8 — Carta de UI
- [x] Grep de las líneas añadidas en los 8 ficheros de producción del diff neto: 0 hex, 0 clases con corchetes, 0 `StyleSheet`, 0 `rgba`, 0 `elevation`/`shadowColor`/`shadowOpacity`, 0 `fontSize`, 0 `LinearGradient` y 0 `text-accent` suelto.
  - La única coincidencia es el comentario `// #199 R27: …` en `motion.ts`, que `HEX_LITERAL` exime por la forma `#NNN R<n>`. La guarda design-drift de init.sh queda verde.
- [x] Las tipografías son tokens. `--text-34: 34px` es nuevo en `global.css` (R27) y está documentado en la carta.
- [x] Las sombras salen de `useShadows().toast`. Las esquinas no-cápsula llevan `CONTINUOUS_CORNER`.
  - CC `directUses` es 54 = dev 51 + 3.
  - CC `CONTINUOUS_CORNER` es 52 = dev 49 + 3.
- [x] La animación usa `RiseIn` y las constantes de `motion.ts` (7 nuevas, R27.2). La gráfica respeta `useReducedMotion` (R5, test «bajo reduce motion la línea y el punto salen completos»).
- [x] Accesibilidad:
  - La gráfica mini está oculta, con `accessibilityElementsHidden` y `importantForAccessibility='no-hide-descendants'`.
  - La completa se anuncia como imagen con `lastSixMonths`.
  - Los títulos llevan `accessibilityRole="header"` y los errores `accessibilityRole="alert"`.
- [x] `docs/ui-guidelines.md` lleva la sección «Enmienda #199» una sola vez y las notas de `text-34` y `rounded-24/16/14`. Lo cubre CF R24.

## Verificaciones adicionales

### Producción contra la spec
Leí entero:
- `screens/health/index.tsx`
- `screens/weight-log/index.tsx`
- `components/weight-chart.tsx`
- los cambios de `_layout.tsx`, `format.ts`, `motion.ts`, `global.css`, `catalog.ts` y `docs/ui-guidelines.md`

Todas las clases, retrasos, testIDs y literales coinciden con R1–R27:
- **Retrasos:** 0, 80, 140, 260 y `60·min(i,2)`.
- **Geometría:** full {80, 40, 60}; mini {44, 26, 31}.
- **Ventana:** de 6 meses, mientras que la mini muestra todo el historial.
- **Pop:** en 0.6/0.4.
- **Toast:** en `top: insets.top + 42` con `FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)`.
- **Copy en:** es `'due today'` según la errata `26df9541`.

Las anclas de Base de la spec, re-medidas en HEAD, están todas en su valor objetivo. Entre ellas:
- `ScreenHeader` 2, `useShadows` 2, `HeaderHeightContext` 0, `<Card` 1
- `variant="avatars"` 1 en health, `viewBox 100 40` 0
- filas de `ui-copy-table`: health 23, weight-log 21, weight-chart 2, `_layout` 0
- 6 ficheros canvas

### Merge `d80357d0` (dev + delta de #199)
- **Ficheros de un solo lado:** 28 solo-#199 y 27 solo-dev. El delta del merge es idéntico al de su rama en todos: 0 discrepancias.
- **11 ficheros compartidos revisados uno a uno** (alerts, CTA, CC, DD, LG, PCF, LP, ui-language, `ui-copy-table.ts`, `catalog.ts`, `feature_list.json`):
  - Se conservan los términos, filas y sufijos de dev. Los sufijos de #199 van detrás de los previos.
  - No hay marcadores de conflicto. Ninguna fila ni clave nueva aparece duplicada.
- **Recuentos agregados (base / dev / #199 / resultado):**

  | Recuento | Base | Dev | #199 | Resultado | Cuadra |
  |---|---|---|---|---|---|
  | CTA `rounded-16` | 33 | 34 | 34 | 35 | sí |
  | CC `directUses` | 47 | 51 | 50 | 54 | sí |
  | CC `CONTINUOUS_CORNER` | 45 | 49 | 48 | 52 | sí |
  | LG `text-accent-strong` | 21 | 22 | 21 | 22 | sí |
  | `englishKeys` | 443 | 445 | 450 | 452 | sí |
  | `SCREEN_FILES` | 37 | 37 | 36 | 36 | sí |

- **LP:** la expresión conserva `+ 1 // #199 R5 … + 2 // #199 R17` y además `+ 2, // #198 R15`.
- **PCF `#173 R4`:** queda `['screens/food/index.tsx', 'screens/health/index.tsx', 'screens/profile/index.tsx']`, con food de #200 R2 y health de #199 R13 y los dos sufijos.
- **LY:** conserva `(enmendado por #200 R12)` y suma `(enmendado por #199 R1)`.
- Nada de lo que añadió dev se perdió.

### Jest dirigido y typecheck (worktree, HEAD `bd20a22a`)
- **Jest dirigido:** 24 suites y 850 tests verdes, exit 0. Cubre los 7 ficheros con conflicto, ui-language, CF, MT, WC, DT, HE, WL, `app/__tests__/layout.test.tsx` y `detail-stack.test.tsx`. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev199-targeted.log`.
- **`bun run typecheck`:** exit 0. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev199-typecheck.log`.
- **`back-button.test.tsx` aislado (el rojo de `init-199.log`):** 8/8 verdes. El diff neto no toca `back-button.tsx` ni su test.

### Pruebas de mutación
Se hicieron en la copia `git archive bd20a22a` bajo `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev199/`, nunca en el worktree.
- **Línea base:** 6 suites (WL, HE, WC, CF, DT, CC), 382/382 verdes.
- **Método:** una mutación cada vez, revertida tras cada corrida. Al final la copia de `src/` es idéntica a `bd20a22a`.
- **Logs:** `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/mut199/m-*.log`.
- **Resultado:** las 32 mutaciones ponen rojo al menos un candado.

| Mutación (plantada en) | Candado que se pone rojo |
|---|---|
| R1: `_layout` `weight-log` con `title: ""` extra | LY `#199 R1 weight-log declara solo headerShown false` |
| R1: `backFallback="/home"` | WL `#199 R1 sin historial la vuelta lleva a /health` |
| R2: `paddingBottom: insets.bottom + 24` | WL `#199 R2 …` y `#95 R6 … (enmendado por #199 R2)` |
| R3: `<RiseIn>` sin `delayMs={0}` en la tarjeta | WL `#199 R3 la tarjeta entra con RiseIn sin retraso` |
| R4: tono flat `text-foreground` | WL `#199 R4 delta igual pinta text-muted sin icono`, más 3 de `#169 R7/R8` enmendados |
| R5: ventana `>= months[0]` → `>` | WC `#199 R5 deja fuera el registro del 2025-09-30 y conserva el del 2025-10-01`, más 2 |
| R5: ventana superior por fecha completa en vez de mes | 28 rojos en WC/WL (`#169 R1 … (enmendado por #199 R5)`, …) |
| R5: pop `0.6` → `0.5` | WC `#199 R5 el punto sigue oculto a los 1299 ms, llega a radio 5.4 a los 1540 y a 5 a los 1700` |
| R6: `importantForAccessibility="auto"` en mini | WC `#199 R6 queda oculta a la accesibilidad` |
| R6: `accessibilityElementsHidden={false}` | WC `#199 R6 queda oculta a la accesibilidad` |
| R6: radio del punto mini 5 → 4 | WC `#199 R6 el punto final sale con radio 5 y opacidad 1 en el primer frame` |
| R7: `className` en `Label` (HeroUI) en vez de `Label.Text`/`Text` | WL `#199 R7 las tres etiquetas …` y CF `#199 R27 … no pasa text-13, text-15 ni text-17 a Label` |
| R8: un `View` tras el `Button` de envío | WL `#199 R8 el envío es el último hijo de weight-form …` |
| R9: tope `min(index, 3)` | WL `#199 R9 la fila 3 entra a los 260 ms` |
| R10: delta anidado `text-xs` | WL `#199 R10 la cifra pinta text-15 font-extrabold y anida el delta en text-13` |
| R11: `month: 'long'` en `fmtDayMonth` | 7 rojos en WL `#199 R11 la fecha …` y DT `#199 R11 …` |
| R12: sin `justify-between` | HE `#199 R12 health-header es una fila justify-between que empieza por health-title` |
| R13: `<View />` entre título y selector | HE `#199 R13 el selector va en health-header tras health-title …`, más 2 de `#168 R2` enmendados |
| R14: `days === 2` para «mañana» | 9 rojos en HE `#115 R6 … (enmendado por #199 R14) (enmendado por #199 R25)` |
| R14: excluir la dosis de hoy (`>` today) | 9 rojos en HE `#115 R6 …` (filas a/c/g/i…) |
| R14: días `text-26` | HE `#199 R14 caps, nombre y fecha llevan sus clases exactas`, más 2 de `#115 R6` |
| R15: sin `accessibilityRole="header"` | HE `#199 R15 Vacunas es un h2 …` |
| R16: tope `min(index, 3)` | HE `#199 R16 la fila 3 entra a los 200 ms` |
| R17: vencida con `<=` today | HE `#168 R3 … (enmendado por #199 R16) (enmendado por #199 R17)` |
| R18: tonos up/down intercambiados | HE `#199 R18 variación -0.2 …` y `variación 0.4 …` |
| R18: mini con `weights.slice(0, 2)` | HE `#115 R5 … pasa el historial entero … (enmendado por #199 R18)` |
| R18/C8: quitar `CONTINUOUS_CORNER` del enlace | HE `#199 R18 el enlace …` y CC `#62 R14 …` / `#98 R10 …` |
| R19: tile del esqueleto `size-9` | HE `#199 R19 la carga pinta una fila flat con tile y dos barras` |
| R20: error sin `role alert` | HE `#199 R20 con error pinta el aviso en text-danger con role alert dentro de la tarjeta` |
| R21: tres círculos de carga | HE `#199 R21 la carga pinta dos círculos de 40 en fila` y `R8 (mobile-design-drift) … (enmendado por #199 R21)` |
| R22: retraso del esqueleto `50 * index` | WL `#199 R22 la fila esqueleto 1 entra a los 60 ms` y `… 2 entra a los 120 ms` |
| R23: `shadows.card` en vez de `shadows.toast` | WL `#199 R23 el toast es una píldora con borde, sombra toast y top inset + 42` |

## Observaciones

### Bloqueantes
Ninguno.

### No bloqueantes

**N1. Títulos con otra redacción.** 4 títulos difieren del literal que cita `requirements.md`. Nombran su R-id y la aserción cubre lo que pide la spec.
- WL: la spec dice `#199 R11: fecha corta del historial` › `#199 R11 cada fila pinta su fecha corta en text-13 font-semibold text-muted`.
  - El test real es `#199 R11: fechas del historial` › `#199 R11 la fecha %s se lee %s en text-13 font-semibold`.
  - Asierta `toBe('text-13 font-semibold text-muted')`.
- HE: la spec dice `#199 R18 la píldora %s pinta %s`, `#199 R18 el enlace es rounded-14 bg-surface px-3.5 py-3 con texto text-15 font-bold` y `#199 R18 entra a los 260 ms`.
  - Los tests reales son `#199 R18 variación %s usa %s y %s`, `#199 R18 el enlace es rounded-14 bg-surface con etiqueta text-15 y chevron de 18` y `#199 R18 entra con RiseIn a los 260 ms`.
  - El enlace asierta además `px-3.5 py-3`.
- `traceability.md` registra los títulos reales, así que la trazabilidad es correcta.

**N2. Fila R27 abreviada.** La fila R27 de `traceability.md` cita `MT::no exporta nada más (inventario dev39+7=46)` sin el `describe` y sin el título completo, que es `no exporta nada más (enmendado por #195 R13) (enmendado por #197 R11) (enmendado por #200 R4) (enmendado por #199 R27)`. El test existe y nombra `#199 R27` en su sufijo.

**N3. `describe` duplicado.** `src/__tests__/health-weight-canvas-fidelity.test.ts` declara dos veces `describe('#199 R27: guardas')`, en las líneas 26 y 174. Jest lo admite, pero el informe agrupa bajo el mismo nombre dos bloques distintos.

**N4. Id de PCF en tasks.md.** `specs/mobile-canvas-health-weight/tasks.md:135` cita PCF `#173 R3`. `requirements.md` (inventario, líneas 777-780) y el test real dicen `#173 R4`. La implementación siguió a requirements.

**N5. LY: enmienda por otra vía que la del inventario.** El inventario pedía cambiar el valor de la fila `['weight-log', 't:weightLog.weightLog']` de `#194 R4` a `headerShown: false` sin título. La implementación hizo otra cosa:
- Sacó la fila de la tabla, cuyo cuerpo asierta `headerShown: true` más el título, y amendó el título de la tabla con `(enmendado por #199 R1)`.
- Añadió el `it` nuevo LY `#199 R1 weight-log declara solo headerShown false`.

La cobertura es equivalente: la mutación `title: ""` extra se pone roja.

**N6. Fixture en commit `feat`.** El registro de uso `src/__tests__/ui-copy-table.ts` (+7 filas) entra en el commit `feat` `b1f972d8` (R25), no en un `test`. Es el registro que lee el candado rojo `c35bb65e`, así que actúa como lado «producción» de ese candado. El orden rojo→verde se respeta.

**N7. Merge LG «suma las trece».** #199 cambió el operando izquierdo del segundo `expect`: pasó de la suma declarada a la cuenta real `readSource(...)`. El merge conserva la aserción extra de dev (real == declarada), así que la cobertura es la misma por transitividad.

**N8. Comprobación redundante.** En `src/screens/weight-log/index.tsx:200` hay un `entries.length > 0 ? (` dentro de `weight-chart-card`, que ya está guardado por la condición de la línea 197. La rama `else` es inalcanzable. Es inocuo.

**N9. Rojo de `init-199.log`.** Sobre `d49e10da` falló `#172 R2: BackButton › pinta ChevronLeft de 24 en foreground` con `Received: "#0D1117"`. Es el flake de tinte conocido bajo carga. El fichero no está en el diff, el test aislado da 8/8 y `init-199b.log` sobre HEAD sale verde.

**N10. Smokes pendientes.** Las seis casillas de smoke de `requirements.md` (líneas 873-878) siguen `[ ]`. La feature no puede pasar a `done` hasta que el humano las cierre en dev build Android (CLAUDE.md, «requisitos que solo puede cerrar un humano»).

**N11. Cuerpo de `48dd0f02`.** El cuerpo de la errata `48dd0f02` (E1, suelo de Card de R3) no repite la línea del mandato que sí llevan `f6f28512`, `25979e93` y `26df9541`. La firma de E1 está en `f6f28512`.

## Output de ./init.sh
Lo corrió el leader; el clasificador se lo deniega al reviewer. Leí los dos logs:
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-199b.log` (HEAD `bd20a22a`, exit 0)
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-199.log` (`d49e10da`, exit 1, superado)

```
# init-199b.log (bd20a22a) — exit 0
220:   Test Suites: 187 passed, 187 total            (backend)
221:   Tests:       1474 passed, 1474 total
233:   Test Suites: 2 passed, 2 total                (infra)
234:   Tests:       14 passed, 14 total
81848: Test Suites: 146 passed, 146 total            (mobile)
81849: Tests:       5015 passed, 5015 total
81850: Snapshots:   1 passed, 1 total
82170: Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
82171: Tests:       8 skipped, 468 passed, 476 total
82187: ✅ Lint sin errores
82191: ✅ Typecheck sin errores
82194: ✅ Todo verde. Listo para trabajar.
líneas ^FAIL: 0; los 46 «●» son todos «● Console».

# init-199.log (d49e10da) — exit 1, superado por el anterior
76599: FAIL src/components/__tests__/back-button.test.tsx
76600:   ● #172 R2: BackButton › #172 R2: pinta ChevronLeft de 24 en foreground
         Expected: "color:foreground"  Received: "#0D1117"
76620: Test Suites: 1 failed, 144 passed, 145 total
76621: Tests:       1 failed, 4897 passed, 4898 total
```

Estado del worktree al cerrar la revisión: HEAD `bd20a22a`. `origin/dev` (`329c613c`) es ancestro de HEAD. Sin cambios versionados pendientes; solo los dos ficheros sin seguimiento citados en C2. Este review no se commitea.
