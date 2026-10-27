# Implementación #223 — mobile-alerts-attended-section

Fecha: 2026-10-27. **Detenida al verificar C6**, por un candado rojo que no figura en la ventana cerrada del handoff. C0–C5 están commiteados. C6 no se commiteó; C7–C30 no se iniciaron.

Este reporte sustituye el de `ab390003`. Las dos anclas de aquella parada se corrigieron en `11b2cbaf` (adenda 3); ambas se midieron de nuevo y coinciden. **No se creó `.done`**: el humano lo reserva al final de C0–C30.

## Ubicación y continuidad

- Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-223`.
- Branch confirmada: `feature/223-mobile-alerts-attended-section`.
- Al retomar, `git log -1` mostró `11b2cbaf docs(harness): #223 handoff adenda 3, dos anclas T0 corregidas`.
- H0: `418e15986f14a98d38cb411d888d1b99879bacae`. No se hizo pull, merge, rebase, push ni PR.
- La primera invocación de la sesión original confirmó ruta y branch, pero intercaló `git status --short` entre `pwd` y `git branch --show-current`; se conserva declarada esa desviación.
- Se retiró el marcador `.done` de la parada anterior antes de retomar T0. El archivo previo sin seguimiento `progress/draft_handoff-223.md` no se tocó.

## Bloqueo de C6 y estado recuperable

Al aplicar únicamente el cambio previsto para C6 (pantalla con `drain: true`, `data` solo abiertas y `StatusPill` local), R4 pasa y los tests de C5 quedan verdes. Typecheck también pasa. La suite del alcance requerido arroja:

```text
Test Suites: 2 failed, 44 passed, 46 total
Tests:       8 failed, 1256 passed, 1264 total
```

Siete fallos son los permitidos en esta fase (seis casos antiguos y R16). El octavo no está en la ventana ni en la tabla de enmiendas ni en E2:

`src/screens/alerts/index.test.tsx` · `#203 R8: cabecera de Alertas` · `#203 R8: sin nuevas la cabecera no lleva accesorio`.

El test usa `a` leída y `b` cerrada, y espera `await screen.findByTestId('alert-row-a')`. Con R4 ya no hay filas atendidas en `data`, de modo que falla con:

```text
Unable to find an element with testID: alert-row-a
```

La espera está actualmente en la línea 1615 del fichero (el número puede variar con nuevas enmiendas). Se conserva el título sin enmendar y no se modificó su intención ni su espera.

El handoff impone: «estos `it` preexistentes y SOLO ellos pueden estar rojos» y «Si al correr la suite aparece en rojo un `it` que no está en la ventana, ni en la tabla de enmiendas ni en E2, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta». Por eso no se continuó a C7.

La propuesta de C6 se guardó íntegra en `progress/c6-223-proposed-diff.log` y se restauró **solo ese cambio propio no commiteado** para dejar limpio el código. No se perdió ningún commit de tests. El siguiente paso requiere una adenda del leader que incluya este candado y precise en qué paso se enmienda su espera, conservando las aserciones de cabecera sin accesorio. Después se retomará C6 desde `35724cfb`; el diff guardado permite reaplicarlo.

## T0: anclas completas

Todas coinciden con el handoff de `11b2cbaf`. La fila de `counters` `// #170 R16` no se tocó. La nueva ancla de `directUses` da 0; el grep de líneas `it` da 78.

```text
grep -cF 'queryKey: alertKeys.list()' hooks/use-alerts-list.ts
  salida: 1 | esperado: 1
grep -cF 'useAlertsList()' screens/alert-detail/index.tsx
  salida: 1 | esperado: 1
grep -cF 'useAlertsList()' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'onEndReached' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'onEndReached' screens/alerts/index.test.tsx
  salida: 11 | esperado: 11
grep -cF "nextCursor: 'c1'" screens/alerts/index.test.tsx
  salida: 5 | esperado: 5
grep -cF "t('alerts.statusAcked')" screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF "t('alerts.statusClosed')" screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'style={chunkyLip.neutralCompact}' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'text-13' screens/alerts/index.tsx
  salida: 2 | esperado: 2
grep -cF 'tracking-caps' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'CONTINUOUS_CORNER' screens/alerts/index.tsx
  salida: 0 | esperado: 0
grep -cF 'rounded-16' screens/alerts/index.tsx
  salida: 0 | esperado: 0
grep -cF 'rounded-14' screens/alerts/index.tsx
  salida: 0 | esperado: 0
grep -cF 'border-lip-gray' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'const chunkyLip = useChunkyLip();' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'settleAlertAck(' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF 'ackAlert(baseUrl' screens/alerts/index.tsx
  salida: 1 | esperado: 1
grep -cF "t('common.somethingWentWrong'" screens/alerts/index.tsx
  salida: 3 | esperado: 3
grep -cF "t('common.retry'" screens/alerts/index.tsx
  salida: 1 | esperado: 1
ls hooks/use-alerts-list.test.tsx __tests__/alerts-attended-canvas-fidelity.test.ts 2>&1 | grep -c 'No such file'
  salida: 2 | esperado: 2
grep -cF 'alerts.attended' i18n/catalog.ts
  salida: 0 | esperado: 0
grep -cF 'alerts.calmTitle' i18n/catalog.ts
  salida: 0 | esperado: 0
grep -cF 'alerts.sectionOpen' __tests__/ui-copy-table.ts
  salida: 0 | esperado: 0
grep -cF "file: 'src/screens/alerts/index.tsx'" __tests__/ui-copy-table.ts
  salida: 20 | esperado: 20
grep -cF '+ 51, // #214 R22' providers/__tests__/language-provider.test.tsx
  salida: 1 | esperado: 1
grep -cF '+ 1 // #222 R8' providers/__tests__/language-provider.test.tsx
  salida: 1 | esperado: 1
grep -cF 'Check' screens/alerts/index.test.tsx
  salida: 0 | esperado: 0
grep -cF "'alert-detail-view-map'" __tests__/chunky-cta-canvas-fidelity.test.ts
  salida: 2 | esperado: 2
grep -cF 'alerts-attended-more' __tests__/chunky-cta-canvas-fidelity.test.ts
  salida: 0 | esperado: 0
grep -cF 'cada tracking-* va con su text-*' __tests__/alerts-canvas-fidelity.test.ts
  salida: 1 | esperado: 1
grep -cF 'reserva los radios 14, 16 y 22 a Recordatorios' __tests__/design-drift.test.ts
  salida: 1 | esperado: 1
grep -cF '+ 2 // #214 R4, R18' __tests__/consistency-classnames.test.ts
  salida: 2 | esperado: 2
grep -cF "[join('screens', 'alerts', 'index.tsx'), 1], // #223 R9" __tests__/consistency-classnames.test.ts
  salida: 0 | esperado: 0   (adenda 3: la fila `// #170 R16` de `counters` TABULAR_NUMS ya existe y NO es la de `directUses`; esa cuenta no se toca)
grep -cF "'alert-detail-view-map'" __tests__/consistency-classnames.test.ts
  salida: 2 | esperado: 2
grep -cF 'por fidelidad al canvas (#199): `rounded-24`' ../../docs/ui-guidelines.md
  salida: 1 | esperado: 1
grep -cE '^- \[[xX]\] \*\*G4\*\*' ../../specs/mobile-alerts-attended-section/requirements.md
  salida: 0 | esperado: 0   (G4 sin marcar: R19 queda bloqueado)
grep -cF 'E2' ../../specs/mobile-alerts-attended-section/requirements.md
  salida: 5 | esperado: >= 1   (la fe de erratas E2 del leader; si da 0, PARA)
grep -c '^\s*it(' screens/alerts/index.test.tsx
  salida: 55 | esperado: 55
grep -c 'it\(\.each\)\?(' screens/alerts/index.test.tsx
  salida: 78 | esperado: 78   (adenda 3: cuenta líneas, no casos expandidos; 83 era un error del leader)
```

## Base y recuentos de guards

T0 completo: `bun run test > ../progress/t0-223.log 2>&1`, **exit 1**:

```text
Test Suites: 1 failed, 166 passed, 167 total
Tests:       1 failed, 6076 passed, 6077 total
```

**N = 6077.** Único fallo: `#200 R10: cada pieza entra con el retardo del canvas (food-links)`, esperado 200, recibido undefined. Es uno de los flakes expresamente autorizados por el handoff. Rerun de toda la suite de Nutrición aislada, `progress/t0-223-food-rerun.log`, **exit 0**:

```text
Test Suites: 1 passed, 1 total
Tests:       130 passed, 130 total
```

Se continuó por la excepción de flakes («si pasa sola, anótalo y sigue»). No se presenta la corrida completa inicial como verde.

T0 acotado, `bunx jest src/screens/alerts src/hooks src/__tests__ --testTimeout=30000 > ../progress/t0-223-scoped.log 2>&1`, **exit 0**:

```text
Test Suites: 40 passed, 40 total
Tests:       1122 passed, 1122 total
```

Inventarios recomputados en producción antes de C0 (los mapas completos y expresiones de los guards están en `progress/t0-223-guards.log`):

| Patrón | Total T0 |
|---|---:|
| `border-lip-gray` | 19 |
| `rounded-16` (palabra completa) | 58 |
| `style={chunkyLip.neutralCompact}` | 2 (Alertas 1, Horario 1) |
| `<Button.Label` | 15 |
| `Button.Label` | 42 |
| `style={CONTINUOUS_CORNER}` | 65 |

Los guards de chunky-cta, consistency, design-drift y alerts-canvas-fidelity pasaron en T0. No se llegó a sus enmiendas de C9/C14/C16/C18.

## Commits y aritmética

Los totales N+delta son inventario calculado, no corridas completas después de cada commit; la columna `Tests:` transcribe la suite efectivamente ejecutada. Un `it.each` cuenta cada fila. No se eliminó ningún caso.

| Paso | Commit y mensaje | `Tests:` medido antes del commit | Inventario completo |
|---|---|---|---|
| C0 | `1df50249 test(mobile): extend the alerts icon mock for the attended section (R7)` | `82 passed, 82 total` | 6077 + 0 - 0 = 6077 |
| C1 | `9c2af9ee test(mobile): drain option fetches each page with its cursor (R1)` | `1 failed, 1 total` | 6077 + 1 - 0 = 6078 |
| C2 | `71145acb feat(mobile): drain option fetches each page with its cursor (R1)` | `1257 passed, 1257 total` | 6078 + 0 - 0 = 6078 |
| C3 | `32e74712 test(mobile): hook without drain and non-ok pages stop the drain (R2, R3)` | `6 passed, 6 total` | 6078 + 5 - 0 = 6083 |
| C4 | `95f7aa9a test(mobile): attended-section copy keys exist in both languages (R16)` | `1 failed, 1 total` | 6083 + 1 - 0 = 6084 |
| C5 | `35724cfb test(mobile): alerts data holds only open alerts, by section (R4)` | `9 failed, 74 passed, 83 total` | 6084 + 1 - 0 = 6085 |

C6 (sin commit): `Tests: 8 failed, 1256 passed, 1264 total`; inventario `6085 + 0 - 0 = 6085`. En el alcance requerido, los 1256 casos de T0 más 8 nuevos dan 1264. C0 solo amplía el mock con `Check`, `ChevronDown` y `ChevronUp` y nace verde sin aserciones nuevas.

## Rojos medidos por paso

### C1

- #223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null

### C4

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una

### C5

- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › no mueve la fila abierta al pulsar su ack (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › pide el cursor siguiente y conserva las filas de ambas páginas (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › no pide otra página mientras la anterior está en vuelo (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › conserva la primera página y muestra error si falla la segunda (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › #223 R4: data contiene solo las abiertas, por sección y en el orden del servidor
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › ordena las abiertas por sección y en el orden del servidor (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › pinta cada cabecera una sola vez al cargar la página siguiente (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › no reordena al marcar leída una fila abierta (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › suma las abiertas de todas las páginas cargadas (enmendado por #223 R18)

### C6

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad
- #203 R8: cabecera de Alertas › #203 R8: sin nuevas la cabecera no lleva accesorio

C0, C2 y C3 no tuvieron tests rojos en sus corridas normales. Los rojos de sondas se detallan debajo. R16 permanece rojo desde C4, tal como manda la cadena, porque el catálogo aún no tiene las seis claves. Los rojos de C5 son el nuevo R4 y las enmiendas de tests previstas antes de su implementación.

## TDD y sondas

- C1 fue rojo por aserción (`isFetchingNextPage`: esperado true, recibido false), no por import ni excepción. `c1-223-types.log` dio únicamente TS2554 en la llamada con opciones: esperado 0 argumentos, recibido 1. Es la excepción explícita de C1.
- C2: guardas de pantalla y anclas de clave/lista en verde; `c2-223-types.log`, exit 0. Suite requerida: 45/45, 1257/1257. Al quitar `!isFetching`, R1 falló con 3 llamadas cuando esperaba 2 (`c2-223-mutation.log`). Mutación revertida antes del commit.
- R2 nace verde porque el valor predeterminado ya es false. Al plantar `drain = true`, falla (esperaba una página y obtiene dos): `c3-223-mutation-r2.log`.
- Los cuatro casos R3 nacen verdes porque una página no-ok ya corta el cursor. La primera sonda, con respuestas inmediatas, sobrevivió (`c3-223-mutation-r3.log`): esas respuestas no garantizaban observar una transición de fetching. Se reforzó el fixture con una segunda página diferida. El test reforzado pasó sin mutación (`c3-223.log`, 6/6); con cursor artificial x para no-ok, fallaron los cuatro casos por `isFetching` true en vez de false (`c3-223-mutation-r3-deferred.log`, 4 failed, 2 passed, 6 total). Ambas mutaciones se revirtieron; `git diff --exit-code` del hook pasó antes de C3.
- R4: rojo por array con `today-acked` y `earlier-closed` de más en C5; verde en la propuesta de C6. La partición conserva las secciones y el overlay del ack. No se publicó como commit verde por el candado adicional #203 R8.
- C5 quita todos los eventos `onEndReached` de los tests que se enmiendan en ese paso y deja sus cadenas terminadas en `nextCursor: null`. De los cinco fixtures con c1, tres ya terminaban en null y uno en un resultado error sin cursor; el de segunda página pendiente ahora se resuelve explícitamente a una página final null. No se añadió ningún cursor constante que cicle.
- Todas las llamadas nuevas de RNTL a renderHook/renderAlerts/fireEvent/act/rerender/unmount se esperan con await. Las esperas de pantalla se hacen sobre `data`, los nodos de fila o el texto que se aserta; no se introdujeron esperas sobre contadores de mocks. La fecha y TZ de R4 se heredan del fixture fijo de #170 R3, con `process.getBuiltinModule('process')`.

## Skills y verificaciones

- Cargadas: `ponytail`, `appllama-app-design-skill`, `building-native-ui` y `expo-tailwind-setup`. Las dos últimas se localizaron en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`. La carta y los artboards prevalecen sobre las preferencias genéricas de las skills.
- No se buscaron `expo-overview`, `expo-animation`, `expo-router` ni `expo-design-system`: el handoff indica que no existen en Codex. No se invocó Appllama (no disponible aquí; diseño ya fijado). Se leyó también `openai-docs` al atender la pregunta del humano sobre la capacidad del modelo; no se cambió ningún ajuste ni se investigó un modelo concreto.
- Typecheck verde en C2 y en la propuesta de C6, siempre precedido por `test ! -e .expo/types/router.d.ts`. El único typecheck rojo fue la excepción de C1.
- No se ejecutó `./init.sh` bajo ningún concepto; lo corre el leader. No se instalaron ni regeneraron entorno o dependencias.
- Antes de cada lanzamiento de Jest se midieron vacíos ambos pgrep exigidos. Hubo esperas por ejecuciones de los worktrees 209 y 216. Otro worktree inició tests después del lanzamiento de nuestra corrida completa de T0; el flake se verificó aislado conforme al handoff.
- Las guardas de pantalla (prohibiciones, una settleAlertAck, una ackAlert, recuentos de copy existente, chunkyLip y padding) pasaron antes de verificar C2 y C6. No se llegó a los cambios de filas atendidas o calma.
- Lint final, Jest completo final, graphify y smoke no se ejecutaron: la cadena está detenida antes de terminar R4. No se certifica la feature como terminada.
- Error de lectura corregido: se intentó leer `src/hooks/use-pet-members.test.tsx`, que no existe; después se listaron los hooks con rg y se leyó el patrón de `use-pet-selection.test.tsx`. No afectó ninguna prueba ni fichero.

## Tabla de requisitos

| R | Test / commits | Estado |
|---|---|---|
| R1 | `hooks/use-alerts-list.test.tsx::#223 R1`; rojo `9c2af9ee`, verde `71145acb` | Verificado |
| R2 | `hooks/use-alerts-list.test.tsx::#223 R2`; `32e74712`, implementación previa `71145acb` | Nace verde; mutación probada |
| R3 | `hooks/use-alerts-list.test.tsx::#223 R3` (4 casos); `32e74712`, implementación previa `71145acb` | Nacen verdes; mutaciones probadas |
| R4 | `screens/alerts/index.test.tsx::#223 R4`; rojo `35724cfb` | Verde solo en propuesta C6, restaurada por bloqueo |
| R5 | — | No iniciado |
| R6 | — | No iniciado; se hará después de R7 |
| R7 | Mock preparado en `1df50249` | Implementación no iniciada |
| R8 | — | No iniciado |
| R9 | — | No iniciado |
| R10 | — | No iniciado |
| R11 | — | No iniciado |
| R12 | — | No iniciado |
| R13 | — | No iniciado |
| R14 | — | No iniciado |
| R15 | Tests antiguos sin eventos de scroll en `35724cfb` | Test R15 y retirada en producción pendientes |
| R16 | `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R16`; rojo `95f7aa9a` | Rojo permitido hasta C19 |
| R17 | — | No iniciado |
| R18 | Enmiendas de C5 en `35724cfb` | Falta resto de enmiendas y test propio |
| R19 | — | Pendiente de G4, medida 0; carta intacta |

No se tocaron tasks ni traceability: están reservados al commit final C30. Tampoco feature_list, STATUS, current, history, handoff, requirements, design, providers, catálogos, dependencias ni backend.

G2 queda al humano: smoke de sección colapsada, expandida con «Ver más», sin abiertas, temas claro y oscuro. G4 también queda al humano; no se marcó. No se lanzó `eas build`.

## Ficheros y cierre de esta ejecución

Archivos propios versionados desde `11b2cbaf`, antes del commit documental de este reporte:

```text
mobile-pet-tracker/src/__tests__/alerts-attended-canvas-fidelity.test.ts
mobile-pet-tracker/src/hooks/use-alerts-list.test.tsx
mobile-pet-tracker/src/hooks/use-alerts-list.ts
mobile-pet-tracker/src/screens/alerts/index.test.tsx
progress/impl_mobile-alerts-attended-section.md (este reporte)
```

La propuesta de producción de C6 quedó en el log ignorado citado, y el árbol de código/docs/specs quedó limpio tras restaurarla. El único fichero previo sin seguimiento sigue siendo `progress/draft_handoff-223.md`. Los logs son ignorados. **Sin `.done`, sin C30 y sin declaración de feature terminada**.
