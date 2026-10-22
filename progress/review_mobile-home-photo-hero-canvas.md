# review: mobile-home-photo-hero-canvas
Fecha: 2026-10-22
Veredicto: APROBADO (con una observación no bloqueante, O1, y los pendientes humanos de la última sección)

Revisado en el worktree `/home/claude/sites/Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`, HEAD `d5597e9684c0ff4a7d5f4bcde4c0ba246a569cab` (verificado con `git rev-parse HEAD`; árbol limpio al empezar y al terminar). Base de la feature: `ab33dfd1` (firma de la spec).

Alcance de lo verificado por mí (no del reporte de Codex): código de producción y de test de los 22 ficheros, historial de 66 commits, spec/traceability, carta de UI, y unas 50 mutaciones plantadas por mí con su reversión (tabla más abajo). `init.sh` NO lo corrí (el clasificador lo deniega al reviewer y comparte LocalStack/Postgres): uso el log del leader, que sí leí.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress`: `feature_list.json` tiene únicamente #195 en `in_progress` (comprobado con un script sobre el JSON).
- [x] `progress/current.md` describe la sesión activa de #195 (hasta el adendo 5). Está al día respecto del trabajo de Codex; el cierre (history.md, tablero Notion) es del leader y no es exigible a Codex.
- [x] Toda feature `done` tiene test: no aplica a #195 (sigue `in_progress`; no se marca done hasta que el humano cierre R21).

## Checklist C3 — Arquitectura
- [x] La feature es solo móvil (`mobile-pet-tracker/`, `docs/`, `progress/`, `specs/`, más `feature_list.json` en el commit del leader `71048a3e`). Cero cambios en `backend-pet-tracker/`: las capas domain / application / infrastructure no se tocan.
- [x] Sin imports de infraestructura en dominio: N/A (sin backend).
- [x] Componentes compartidos reutilizados sin forks: `GlassCircle` lo usan `PetSwitcher` (no seleccionados) y Home («+» y campana); `PingRing` gana `timing` opcional con el valor por defecto de antes (2400 ms, verificado por su test); `PetSwitcher` gana la variante `glass` sin tocar `default` ni `avatars`.
- [x] Sin cambios en `package.json`, `bun.lock`, `ui-copy-table.ts`, mapa ni Perfil (lista de 22 ficheros más abajo).

## Checklist C4 — TDD
- [x] Cada R1 a R20 tiene al menos un test que lo nombra (`#195 R<n>`): comprobado con grep por R-id en los ficheros `*.test.ts(x)`; ninguno queda sin test (R21 es humano).
- [x] Historial test-primero. Pares rojo, verde por requisito (`git log ab33dfd1..HEAD`): R13 `34b89cb6`, `2908e173`; R4 `8f57a8cd`, `f308ea70`; R1 `10e1c025`, `bd03f556`; R2 `78d8e11a`, `ff5170b5`, `626ebc69`; R3 `6b1f535f`, `964aac85`; R5 `6849a2d3`, `016e4749`; R7 `7c41427a`, `c9e578a9`; R8 `892a6013`, `2b71c252`; R6 `61d1645d`, `e17c14b3` (+ `bc14d41b`); R14 `42f108dd`, `25d5f984`, `c3c51cd6`, `80d621e9`; R9 `ba1a0f46`, `a9af1117`; R11 (GC) `22fdc49d`, `2c19841d`; R10 `206a5f50`, `a8bf303b`, `3ca49df6`; R11 (Home) `d759effe`, `7dbcdd48`; R12 `dd4583d7`, `4c9953ab`; R15 `77da555b`, `6519704f` (paso 1b), `2bf5b932`; R16 `44b5cd43`, `d330637e`, `0c02fc69`; R20 `00472596`, `852f4b35`. Cada commit de código lleva `(R<n>)`.
- [x] Requisitos que nacen verdes, permitidos por tasks.md y probados por mutación (vía (b) de C4): R17 (`3ee46612`), R18 (`a45ce63f`), R19 (`a4300199`). Declarados en tasks antes del handoff («nace verde si R3, R4, R6 y R7 ya están hechos», «es probable que nazca verde», «producción ya conforme»). Reproduje yo sus mutaciones, todas rojas por su aserción (tabla de mutaciones).
- [x] Ningún rojo falla por `ReferenceError` de un helper de test: los rojos de módulo nuevo (`glass-circle`, `bubble-pop`) fallan por el módulo de producción inexistente, no por un helper de test. Ningún rojo se apoya en mutar un doble de test: R17/R18/R19 usan mutación de producción o de `global.css`, no del mock.
- [x] Juicio sobre `d330637e` (corrección de test entre el rojo y el verde de R16): legítimo, no relaja el candado. Cambia la lectura de 706 ms (que cae ya en la pendiente de retorno: escala 1,067, no el pico) por (a) una aserción **exacta** a los 690 ms (`toEqual({ opacity: 1, transform: [{ scale: 1.08 }] })`) y (b) a los 706 ms `toBeCloseTo(1.08, 1)` más `scale > 1`. Es neto más estricto en el pico que el original (la spec fijaba 706 ms con `toBeCloseTo`, un punto de muestreo mal calculado por la propia spec: 450 + 240 + 16 está después del pico). No se tocó producción. Comprobado con mutaciones: el retardo de 450 a 400 y el tramo de subida de 240 a 200 o 280 ms ponen en rojo el `it` de BP. El hueco real de R16 es otro (O1), no este commit.
- [x] Los tests no son tautológicos: las constantes del modelo de R17 son literales de test y los tokens se leen de `global.css`, no de producción; BP usa literales (0.6, 1.08, 434, 470, 690, 706, 866); HEROMOT también; `motion.test.ts` fija 500, 80, 1600 y 450 como literales. Las referencias a `PET_HERO_*` y `MOTION_CELEBRATION_EASE_OUT` en `pet-hero-header.test.tsx` están ancladas por aserciones de valor literal (`toBe(330)`, `toBe(160)`, `toBe(130)`) y por `motion.test.ts`; mutar la constante pone rojo (mutación `scrim-h120`).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin ninguna fila «pendiente»: R1 a R20 con test y commit; R21 con «Ejecución y firma a cargo del humano» (no pendiente del agente).
- [x] Los commits existen y los tests referenciados existen y nombran su R-id (grep por R-id y revisión de los `it` citados).
- [x] Formato `feat|test(<scope>): <desc> (R-ids)` en todos los commits de código; los 20 commits sin R-id son `docs(...)` de harness/spec/reporte, que no lo exigen.

## Checklist C6 — Spec aprobada
- [x] `requirements.md`: `status: approved`; casilla «Aprobado por humano (fecha: 2026-10-21)» marcada; también marcadas «Enmienda #195 aprobada por humano» (precondición de R20) y las de A1, A2 y A3 (firmas `058c465a`, `ebc372d0`, `0db0ec01`, con página de Notion, hora y cuenta, según el flujo de CLAUDE.md §Gate de specs vía Notion).
- [x] Ningún requisito se modificó después de la aprobación fuera del gate: tras `ab33dfd1`, `requirements.md`, `design.md` y `tasks.md` solo los tocan los commits de enmienda A1, A2 y A3 (todos con firma humana posterior); Codex solo tocó `traceability.md` (`98419978` parcial y `d5597e96` final).
- [x] La casilla de R21 (smoke humano) no está marcada y no debe marcarla ningún agente.

## Checklist C7 — Sin código huérfano
- [x] Lo que la feature reemplaza fue eliminado en producción: la banda opaca y `pet-hero-fade-top`, `STATUS_DOT_PULSE` (con los imports `Easing`, `ReduceMotion`, `withRepeat`, `withSequence`), el `AnimatedView` del punto, `PET_HERO_MEDIA_HEIGHT` 260 y `PET_HERO_FADE_HEIGHT` 64 (ahora 330 y 160), la pose de 64. El campana vieja (`Pressable` con `Bell` en `muted`) se sustituye por `GlassCircle`.
- [x] Sus tests también: lo que queda de esos nombres en tests son aserciones **negativas** (`queryByTestId('pet-hero-fade-top')` es null en `pet-hero-header.test.tsx:375` y `:660`, y `not.toContain('STATUS_DOT_PULSE')` en `:565`), que son candados deliberados, no huérfanos.
- [x] Sin importadores colgados: `grep` de `STATUS_DOT_PULSE`, `pet-hero-fade-top` en `src/` solo devuelve esas tres aserciones negativas; los `PET_HERO_*` los importan solo el hero y sus tests (más `consistency-classnames.test.ts`, vigente).
- [ ] N/A: no aplica, la feature sí reemplaza piezas, y están cubiertas arriba.

## Checklist C8 — UI móvil (la feature toca `mobile-pet-tracker/`)
- [x] Grep-clean: guarda R19 (7 ficheros): cero hex, cero clases arbitrarias, cero `StyleSheet.create`/shadow legacy/`elevation`, cero emoji, cero `BlurView`, cero `transparent` en el hero. Plantadas por mí cinco infracciones, cinco rojos.
- [x] Safe areas por `useSafeAreaInsets` (slot `insets.top + 12`, scroll `insets.bottom + 96`); cubierto por los `it` de R5 (mutación `+ 10` en rojo, 5 tests).
- [x] Carga con `Skeleton` dimensionado (alto 330 / `w-full`, sin radio); R18 lo candan.
- [x] Reutilización de componentes compartidos (ver C3).
- [x] Touch target 44 (`size-11`) y feedback pressed 0.8 en `GlassCircle` (candado de R11, mutado a 0.7 en rojo).
- [ ] Observación O4 (no bloqueante): el chip **seleccionado** de la variante `glass` es un `Pressable` sin estilo `pressed`. La spec (R9) no lo prescribe y el chip equivalente de la variante `default` tampoco lo tenía; no es regresión.
- [x] Animaciones con Reanimated en el hilo de UI, con reduce motion final sin temporizadores (R14, R16) y sin color/var CSS dentro de estilos animados. Corre en dev build; la comprobación visual real es R21 (humano).

## Hallazgos por requisito
| R | Veredicto | Evidencia propia |
|---|---|---|
| R1 | cubierto | frame 330 y raíz: mutaciones `bleed` + `rounded-card` (2 rojos) y `scrim 120` (export de constantes, rojo) |
| R2 | cubierto | `contentPosition` a `center` (2 rojos); `MOTION_HERO_FADE_MS` por `MOTION_SURFACE_MS` (rojo, `it` enmendado por A2); el filtro por duración 500 de A2 presente |
| R3 | cubierto | alfa del scrim 80 a 66, parada 35 % a 40 %, alto 130 a 120: 2 rojos cada una |
| R4 | cubierto | clase añadida a `pet-hero-dim` (rojo); tokens de `global.css` (8 declaraciones, guarda R19) |
| R5 | cubierto | `insets.top + 10` (5 rojos) |
| R6 | cubierto | `bottom-1.5` a `bottom-2` (2 rojos); skeleton con clase extra (rojo) |
| R7 | cubierto | recetas exactas por tono; `STATUS_TONE_CLASSES` fijado; punto `bg-accent` (`#73 R9`) |
| R8 | cubierto | `delay` 0 a 120, 1600 ms por 400, tono `!== 'muted'`, y `withTiming(0, MOTION_PING_TIMING)` en `ping-ring`: todos rojos |
| R9 | cubierto | posición del punto (1 rojo) y `size-9` a `size-8` (2 rojos) |
| R10 | cubierto | orden, cardinalidad, iniciales y selección; test de ancestros de scroll con `a8bf303b` |
| R11 | cubierto | `GlassCircle` presionado 0.7 y fondo `glass-surface` (2 rojos); color del «+» y `selectedOnline={true}` fijo en Home (3 rojos cada una) |
| R12 | cubierto | punto de alerta `right-2.5` a `right-2` (2 rojos), tamaño de icono 22 a 24 (4 rojos) |
| R13 | cubierto | `MOTION_HERO_CAPTION_DELAY_MS` a 100 y `MOTION_HERO_BUBBLE_POP_DELAY_MS` a 400: rojos en R13, R14 y BP |
| R14 | cubierto | foto inicial en 1 (rojo), retardo del pie (3 rojos), `slotTop` (5 rojos); prueba (i) con Reanimated real y prueba (ii) con reduce motion |
| R15 | cubierto | ver sección siguiente |
| R16 | cubierto con un hueco acotado (O1) | ver sección siguiente |
| R17 | cubierto (nace verde, mutación roja) | `--muted` claro a `#7A8294` y alfa del vidrio oscuro a 0.30: rojos por la aserción de contraste |
| R18 | cubierto (nace verde, mutación roja) | radio del skeleton (3 rojos: R18 en bleed y card más `#127 R2`), radio en bleed (2 rojos de R1), `pet-hero-retry` renombrado (3 rojos incl. `#195 R18`) |
| R19 | cubierto (nace verde, mutación roja) | `shadow-md`, clase arbitraria con hex, `transparent`, `BlurView`, segunda línea `CONTINUOUS_CORNER`: 5 mutaciones, 5 rojos, cada uno en su fichero |
| R20 | cubierto | sección agregada tras la de #195: rojo en «última cabecera de nivel dos»; firmar la casilla de la carta deja la guarda **verde** (26 pasan) |
| R21 | pendiente del humano | sin test automatizado, casilla sin marcar |

### R15 (paso 1b y verde)
- Verde de una sola línea, sin condicional por rama: `git show 2bf5b932` es `gap: 16` a `gap: 14` en `screens/home/index.tsx`.
- Las cuatro `it` del paso 1b existen y son las que mi mutación (b) pone en rojo: `#195 R15 › deja el hero primero…`, `#195 R15 › aplica también el hueco de 14…`, `R5 › conserva gap y paddingBottom… (enmendado por #195 R15)` y `R6 › pads the content below the status bar… (enmendado por #195 R15)`. Mutación (b) (`gap` del scroll de 14 a 16): `Tests: 4 failed, 266 passed`, exactamente esas cuatro. Mutación (c) (`home-states` interno de 16 a 14, línea 414): 2 rojos (la `it` de R6 y la segunda de `#195 R15`). El bloque `home-states` del test de R6 conserva `gap: 16` (diff de `6519704f`: solo cambian el título con el sufijo y el `gap` de `screen-home` a 14). Reversión confirmada.
- Sufijos: `(enmendado por #195 R15)` HOME 2 / HERO 0 y `(enmendado por #195 R14)` 6 / 6: coinciden con tasks. Cero apariciones de `StyleSheet` en `index.test.tsx`.

## Observaciones
### O1 (no bloqueante, a decidir por el leader): el tramo de retorno de 160 ms de la burbuja no está candado
R16 dice «de ahí a 1 en 160 ms». Cambié en `bubble-pop.tsx` el factor del tramo de retorno (`MOTION_SURFACE_MS * 0.4`) y el test de BP sigue verde con 0.2 (80 ms), 0.25 (100 ms) y 0.55 (220 ms); se pone rojo solo con 0.8 (320 ms) y 1.0 (400 ms). Mutar el tramo de subida (`* 0.6`) a 0.5 o a 0.7 sí lo pone rojo (pico exacto a 690 ms), igual que el retardo de 450 ms.

Por qué no bloquea: es una debilidad del muestreo que **la propia spec prescribe** (tasks.md R16: estado inicial, 434, 470, pico y «a los 866 ms escala cercana a 1, `toBeCloseTo`»), y Codex lo cumplió al pie de la letra; no hay deriva de spec ni defecto de implementación, el valor de producción (160 ms) es el correcto. El efecto es decorativo (una animación de 160 ms de un globo de texto) y la dirección grave (retorno mucho más lento) sí se detecta.

Si el leader quiere cerrarlo antes de la PR (cuesta una aserción): muestrear a 450 + 240 + 80 = 770 ms y exigir que la escala esté estrictamente entre 1 y 1.08 y claramente por encima de 1 (por ejemplo, `> 1.01` y `< 1.07`), con mutación de 0.2 y 0.55 vista en rojo. Es un parche de test sobre producción correcta (patrón «tests por parche»), sin tocar `bubble-pop.tsx`.

### O2 (menor): líneas obsoletas en el reporte de Codex
- Pregunta del leader: ¿se perdió evidencia al reescribir el reporte? No. `git diff 48e35511..HEAD` en `progress/impl_…md` quita 31 líneas: tres de «Estado: PARADO…» obsoletas y el bloque inicial de bloqueo del supuesto 1; ese bloque (sonda, salida de Jest y código) está íntegro dentro de `<details>` (líneas 825 a 859). El texto completo de las sondas de las tres variantes sigue en las líneas 173 a 252, y el mecanismo está además en `design.md` H1.
- Siguen en la sección (1b) de R15 las líneas 538, 619 («Mutaciones R15 (a), (b) y (c) NO ejecutadas…») y 621 («Siguiente paso: el leader revisa el quinto rojo…»), que ya no son ciertas. Confunden un instante, pero el reporte es claro enseguida: la línea 576 dice «Parada de (1b) resuelta por el leader (adendo 5)» y la sección «Reanudación con adendo 5» (línea 623) registra el verde `2bf5b932` y las mutaciones (a), (b), (c) con sus rojos. Mis propias mutaciones (b) y (c) reproducen esos números. No bloquea.

### O3 (cosmética, no bloqueante): `pet-hero-header.tsx`
`export const PET_HERO_FADE_HEIGHT = 160` no lleva punto y coma y hay dobles líneas en blanco en el JSX del frame; los comentarios de `PET_HERO_MEDIA_HEIGHT` y de la franja de degradado ya no describen la banda opaca eliminada (siguen hablando de «una banda opaca»). Lint y typecheck pasan (móvil no corre prettier). Una limpieza en otra ocasión.

### O4: ver C8 (chip seleccionado de la variante `glass` sin estilo pressed; no prescrito).

### O5: `#190 R5` (PingoFloat bajo carga)
No se reprodujo: HOME pasó 266 de 266 en mis ocho corridas de HOME con mutaciones menos los rojos esperados (ningún `#190 R5`), y en la línea base de 38 suites. El leader lo vio pasar en `init.sh` y Codex también. Sin acción.

## Inventario de ficheros (22) y alcance
`git diff --name-only ab33dfd1..HEAD -- mobile-pet-tracker/ docs/` devuelve exactamente: `docs/ui-guidelines.md`; en `mobile-pet-tracker/src/`: `__tests__/alerts-canvas-fidelity.test.ts`, `__tests__/home-photo-hero-canvas.test.ts`, `components/__tests__/{glass-circle,pet-avatar,pet-hero-header-motion,pet-hero-header,pet-switcher,ping-ring}.test.tsx`, `components/{glass-circle,pet-avatar,pet-hero-header,pet-switcher,ping-ring}.tsx`, `screens/home/{bubble-pop.test.tsx,bubble-pop.tsx,index.test.tsx,index.tsx}`, `theme/__tests__/{global-css,motion}.test.ts`, `theme/{global.css,motion.ts}`. Sin `package.json`, `bun.lock`, `ui-copy-table.ts`, mapa ni Perfil. Fuera de `mobile-pet-tracker/`, `docs/`, `progress/` y `specs/` solo cambia `feature_list.json` (commit del leader `71048a3e`, `in_progress`).

## Carta (R20)
`git diff ab33dfd1..HEAD -- docs/ui-guidelines.md`: +21 −0, solo adiciones. La sección `## Enmienda #195 — cabecera fotográfica de Inicio fiel al canvas` es la última `## ` del fichero (línea 825); su texto coincide con el bloque de `design.md` (la guarda `#195 R20` lo compara y yo la mutilé para comprobar que se pone roja); el párrafo `Enmendado por #195` queda justo después del de `Enmendado por #67 (A8)`, que sigue entero (la guarda lo compara byte a byte), separado por una línea en blanco y fuera de él. La casilla `- [ ] Enmienda #195 aprobada por humano` (línea 842) sigue **sin firmar**, como exige R20; la guarda la detecta con `[ xX]` y no se rompe al firmarla (prueba hecha).

## Mutaciones plantadas por mí (todas revertidas con `git checkout HEAD -- <ruta>`; `git status --short` vacío al final)
Resumen: unas 50 mutaciones sobre `pet-hero-header.tsx`, `pet-switcher.tsx`, `glass-circle.tsx`, `ping-ring.tsx`, `bubble-pop.tsx`, `home/index.tsx`, `motion.ts`, `global.css` y `docs/ui-guidelines.md`. Todas pusieron en rojo al menos un `it` **excepto** el retorno de la burbuja entre 80 y 220 ms (O1). Detalle en la tabla de hallazgos por requisito. Una de las corridas (`status?.tone !== 'muted'`) tumbó el worker de Jest con «Jest worker encountered 4 child process exceptions»: es el fallo conocido de `toBe(instance)` en paralelo; la repetí con `-i` y el `it` rojo es `#195 R8 › warning con reduceMotion false deja el punto sin hijos`.

## Pendientes del humano (no bloquean este veredicto)
1. **R21**: smoke en el dev build Android del humano (claro, oscuro, reduce motion; foto oscura, clara y sin foto; nombre largo). No marcar su casilla desde un agente.
2. **Firmar** `- [ ] Enmienda #195 aprobada por humano` en `docs/ui-guidelines.md` (línea 842) cuando acepte las dos excepciones nombradas de contraste (raza 4,26:1 y etiqueta de paseos 4,36:1 en light).
3. **Conflicto de merge previsto** con #189 / #194: ambos tocan el final de `docs/ui-guidelines.md` (R20 exige que la sección de #195 sea la última `## `, así que quien mergee después debe reordenar y mantener las guardas verdes) y la fila `tracking-title` de `alerts-canvas-fidelity.test.ts` (R6 la tocó en `61d1645d` y `bc14d41b`).
4. Cierre del leader: `progress/current.md` → `history.md`, tablero Notion, y `status: "done"` solo cuando el humano cierre R21 (CLAUDE.md §Reglas duras).

## Output de ./init.sh
No lo corrí (restricción de la sesión). Uso el log del leader en HEAD `d5597e96`: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/56207a65-c27f-4164-8998-82da3a2f280a/scratchpad/leader-init-195.log` (que leí; el exit code lo reporta el leader como 0):
```
Backend unit:   Test Suites: 187 passed, 187 total   Tests: 1474 passed, 1474 total
Backend infra:  Test Suites: 2 passed, 2 total       Tests: 14 passed, 14 total
Mobile:         Test Suites: 134 passed, 134 total   Tests: 4379 passed, 4379 total   Snapshots: 1 passed, 1 total
                (aviso final de worker force-exit preexistente, ya conocido)
Backend e2e:    Test Suites: 3 skipped, 30 passed, 30 of 33 total   Tests: 8 skipped, 468 passed, 476 total
Features: 179/193 completadas | Próxima feature: [#60] mobile-ios-support (P3)
```
Mi verificación independiente en HEAD (sin mutaciones), desde `mobile-pet-tracker`: `bunx jest src/__tests__/home-photo-hero-canvas.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/alerts-canvas-fidelity.test.ts src/components src/screens/home src/theme --testTimeout=30000` → exit 0, `Test Suites: 38 passed, 38 total`, `Tests: 1137 passed, 1137 total`, `Snapshots: 1 passed`. Antes de cada corrida, `pgrep` vacío.
