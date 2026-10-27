# Implementación #223 — mobile-alerts-attended-section

Fecha: 2026-10-27. **R1–R18 implementados y verificados; cadena C0–C30 y E4 entregada.**
Este commit C30 entrega trazabilidad, casillas y reporte. R19 queda pendiente de G4.

Corrida final **exit 0**, sin pipe, sin suites omitidas, guardada en
`progress/final-test-223.log` (copia íntegra también en `progress/full-223-c30.log`;
es la misma ejecución, no dos corridas distintas):

```text
Test Suites: 169 passed, 169 total
Tests:       6121 passed, 6121 total
Snapshots:   1 passed, 1 total
Time:        180.175 s
```

Resultado: **N = 6077; N + 44 = 6121**, sin regresiones. Typecheck y lint
finales también terminaron con exit 0. R19 queda pendiente de G4 y el smoke G2
sigue reservado al humano; no se ejecutó init.

Alertas descarga todas las páginas, conserva solo las abiertas en data y
cuenta el total tras asentarse. «Atendidas» empieza colapsada, muestra diez
filas compactas al abrirse y suma diez con «Ver más», conservando cuántas había
al colapsar. Sin abiertas muestra «Todo en calma» con la mascota de la primera
atendida del servidor; sin alertas mantiene Pingo. El ack conserva su overlay
hasta el refetch. Copy es/en, medidas, navegación, estados parciales y accesibilidad
quedan cubiertos por los tests de R1–R18.

## Verificación de cierre

- Typecheck: **exit 0**, `progress/final-types-223.log`, precedido por
  `test ! -e .expo/types/router.d.ts`. La guarda también pasó en cada feat.
- Lint: **exit 0 y log de 0 bytes**, con `bunx expo lint --no-cache`, redirect
  sin pipe y `test ! -s ../progress/lint-223.log`. Log: `progress/lint-223.log`.
- Corrida completa previa a C27 tras E4: **169 suites, 6120 tests, exit 0**,
  `progress/full-223-c27-e4.log` (181.546 s).
- R18: **22/22** en `progress/c27-223.log`; sonda roja y revertida en
  `progress/c27-223-mutation.log`. Revisa una lista literal de 31 títulos,
  incluidos E2, E3/#203, E4/navegación y la ampliación diferida del test R8.
- Graphify: `graphify update .`, **exit 0**, extracción AST sin LLM. Resultado:
  31629 nodos, 40794 aristas y 2037 comunidades (`progress/graphify-223.log`).
  Limitación registrada por la herramienta: omitió 23 archivos SQL por no tener
  tree_sitter_sql. No se instalaron dependencias adicionales para ese parser.
- No se ejecutó `./init.sh`: queda al leader. Tampoco eas build, despliegues,
  push ni PR. No se cambió feature_list, STATUS, progress/current o history.

Los siguientes guards y suites constan como PASS en la corrida final:

- `src/__tests__/design-drift.test.ts`
- `src/__tests__/consistency-classnames.test.ts`
- `src/__tests__/legibility-classnames.test.ts`
- `src/__tests__/ui-language.test.ts`
- `src/providers/__tests__/language-provider.test.tsx`
- `src/__tests__/alerts-canvas-fidelity.test.ts`
- `src/__tests__/alerts-attended-canvas-fidelity.test.ts`
- `src/__tests__/chunky-cta-canvas-fidelity.test.ts`
- `src/__tests__/canvas-foundations.test.ts`
- `src/__tests__/collar-alerts-canvas-fidelity.test.ts`
- `src/__tests__/profile-canvas-fidelity.test.ts`
- `src/components/__tests__/empty-state.test.tsx`
- `src/screens/alerts/index.test.tsx`
- `src/screens/alert-detail/index.test.tsx`
- `src/app/__tests__/alert-detail.navigation.test.tsx`

## Gates humanos y documentación

G4 se volvió a medir antes de C28: **0**. No se creó test R19 ni it.skip, ni
se tocó `docs/ui-guidelines.md`. Trazabilidad deja explícito `pendiente: G4`.
G2 queda al humano: smoke de sección colapsada, expandida con «Ver más», sin
abiertas y en tema claro y oscuro. No se marcaron G2 ni G4.

En tasks se marcaron las tareas satisfechas de T0 y R1–R18. T0(1) se satisface
por la provisión previa del leader indicada en el handoff: no se ejecutaron cp
ni bun install, ni se regeneró entorno. Los refactors innecesarios no generaron
código ni commits artificiales. R19 conserva sus tres casillas sin marcar.
Trazabilidad, casillas y este reporte se entregan juntos en C30. Los estados
frontmatter draft los conserva el leader; no se cambiaron.

## Incidencias resueltas y autorizaciones

Los informes de parada `ab390003`, `7f5a5d50` y `8c3984d8` quedan superados por
las adendas del leader. Se conservó la evidencia y no se amplió el alcance sin permiso:

1. T0: dos anclas erróneas, corregidas en `11b2cbaf` (adenda 3). Se repitieron
   con los valores correctos; la fila TABULAR_NUMS #170 R16 no se tocó.
2. C6: un test #203 R8 esperaba una fila atendida. Adenda 4, `71d65ffe` / E3,
   autorizó solo cambiar la espera al contenedor visible y añadir el sufijo.
   Aserciones de cabecera intactas; enmienda incluida en el feat de R4.
3. Primera corrida completa antes de C27: **1 failed, 6119 passed, 6120 total**
   (`progress/full-223-c27.log`). #100 R8 en navegación esperaba una página y
   recibía dos por el drenado. Se paró porque app/ estaba fuera de alcance.
4. Adenda 5, `f2904940` / E4, autorizó ese it: sin onEndReached, espera dos
   filas, expande Atendidas al volver y conserva las demás aserciones.
   Se añadió `await app` después de restaurar timers reales para cumplir RNTL 14.
5. La primera verificación E4 dio error de componente undefined (`e4-223.log`):
   el mock de iconos no exportaba los chevrons. Como estaba fuera del it,
   se consultó antes de tocarlo. El humano autorizó expresamente añadir Check,
   ChevronDown y ChevronUp; propuesta en `e4-223-proposed-icons.log`.
   El test aislado pasó 1/1 (`e4-223-icons.log`) y se commiteó como `e6063116`.
   Solo se modificaron ese it y el retorno del mock autorizado, sin app de producción.

## Continuidad, ruta y adendas

- Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-223`.
- Branch confirmada: `feature/223-mobile-alerts-attended-section`.
- H0: `418e15986f14a98d38cb411d888d1b99879bacae`.
- Al retomar esta ejecución, `pwd`, `git branch --show-current` y `git log -1`
  confirmaron ruta, branch y `71d65ffe`, como pidió el leader.
- La primera invocación de la sesión original intercaló `git status --short`
  entre `pwd` y `git branch --show-current`; confirmó ambos valores correctos.
- Las anclas erróneas de T0 se corrigieron por el leader en `11b2cbaf`, adenda 3.
  La fila `// #170 R16` de `counters` TABULAR_NUMS no se tocó: la nueva fila
  `directUses` de R9 es otra fila. El grep de declaraciones cuenta 78 líneas.
- La parada anterior en C6 quedó superada por `71d65ffe`, adenda 4 / E3.
  Se reaplicó `progress/c6-223-proposed-diff.log` y, dentro de C6, se cambió solo
  la espera autorizada de `#203 R8: sin nuevas la cabecera no lleva accesorio`
  por `await waitFor(() => expect(screen.getByTestId('alerts-list')).toBeVisible())`.
  Se añadió el sufijo de enmienda y se conservaron sus aserciones intactas.
- No se hizo pull, merge, rebase, push ni PR. No se ejecutó `./init.sh`, EAS
  ni ningún comando de AWS. No se instalaron ni regeneraron entorno o deps.
- Se retiró el `.done` de la primera parada al retomar; no se volvió a crear antes de C30.
  `progress/draft_handoff-223.md` ya existía sin seguimiento y no se tocó.

- La última reanudación confirmó `f2904940`, adenda 5 / E4. El humano autorizó
  después expresamente ampliar el mock de ese mismo test con Check, ChevronDown
  y ChevronUp. Esa autorización de conversación amplía el límite «solo ese it».
- E4 quedó en `e6063116`; R18, en `71c41948`. App de producción intacto.

## T0: salida íntegra de las anclas corregidas

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

## Base de tests y recuentos

T0 completo, `progress/t0-223.log`, **exit 1**:

```text
Test Suites: 1 failed, 166 passed, 167 total
Tests:       1 failed, 6076 passed, 6077 total
```

**N = 6077.** Único fallo inicial: Nutrición `#200 R10: cada pieza entra con
el retardo del canvas (food-links)`, esperado 200, recibido undefined, uno de
los flakes permitidos. La suite entera aislada pasó, **exit 0**, en
`progress/t0-223-food-rerun.log`:

```text
Test Suites: 1 passed, 1 total
Tests:       130 passed, 130 total
```

Se continuó por la excepción explícita de flakes. La corrida inicial completa
no se presenta como verde. En la corrida completa de cierre parcial c27,
Nutrición pasó; el único rojo fue el de navegación descrito arriba.

T0 acotado, `progress/t0-223-scoped.log`, **exit 0**:

```text
Test Suites: 40 passed, 40 total
Tests:       1122 passed, 1122 total
```

Mapas y expresiones recomputados antes de C0: `progress/t0-223-guards.log`.
Los deltas finales se han vuelto a medir por lectura de producción:

| Patrón global de producción | T0 | Delta | Actual |
|---|---:|---:|---:|
| `border-lip-gray` | 19 | +1 | 20 |
| `rounded-16 (palabra completa)` | 58 | +1 | 59 |
| `style={chunkyLip.neutralCompact}` | 2 | +1 | 3 |
| `<Button.Label` | 15 | +1 | 16 |
| `Button.Label` | 42 | +2 | 44 |
| `style={CONTINUOUS_CORNER}` | 65 | +1 | 66 |

En Alertas: `onEndReached` = 0 en producción y 2 líneas en el test (título R15
más aserción negativa); no queda ningún fireEvent de scroll. Una sola
`CONTINUOUS_CORNER` aplicada, `rounded-16` y `rounded-14`; dos aplicaciones de
`chunkyLip.neutralCompact`. Las seis claves nuevas tienen un solo t() cada
una; statusAcked y statusClosed siguen con uno cada una en StatusPill.
Se conservan una settleAlertAck, una ackAlert, tres somethingWentWrong, un retry,
una TABULAR_NUMS y `insets.top + 8`. RiseIn queda solo para las cinco primeras
filas de abiertas. El reset preexistente `shadow-none` del Card abierto se
conserva; no se añadió sombra ni elevation.

## Cadena de commits y aritmética

Las líneas `Tests:` son de las corridas realmente ejecutadas antes de cada
commit. El inventario global es cálculo sobre N; no se fingió una corrida
completa en cada paso. No se eliminó ningún caso. Los it.each cuentan sus filas.

| Paso | Commit (hash y mensaje) | Tests: de la corrida del paso | Inventario global |
|---|---|---|---|
| C0 | `1df50249 test(mobile): extend the alerts icon mock for the attended section (R7)` | `82 passed, 82 total` | 6077 + 0 - 0 = 6077 |
| C1 | `9c2af9ee test(mobile): drain option fetches each page with its cursor (R1)` | `1 failed, 1 total` | 6077 + 1 - 0 = 6078 |
| C2 | `71145acb feat(mobile): drain option fetches each page with its cursor (R1)` | `1257 passed, 1257 total` | 6078 + 0 - 0 = 6078 |
| C3 | `32e74712 test(mobile): hook without drain and non-ok pages stop the drain (R2, R3)` | `6 passed, 6 total` | 6078 + 5 - 0 = 6083 |
| C4 | `95f7aa9a test(mobile): attended-section copy keys exist in both languages (R16)` | `1 failed, 1 total` | 6083 + 1 - 0 = 6084 |
| C5 | `35724cfb test(mobile): alerts data holds only open alerts, by section (R4)` | `9 failed, 74 passed, 83 total` | 6084 + 1 - 0 = 6085 |
| C6 | `b37242bc feat(mobile): alerts screen lists only open alerts and drains the list (R4)` | `7 failed, 1257 passed, 1264 total` | 6085 + 0 - 0 = 6085 |
| C7 | `a35ad7e3 test(mobile): badge waits for the last cursor and sums every page (R5)` | `7 failed, 77 passed, 84 total` | 6085 + 1 - 0 = 6086 |
| C8 | `78b56b5b feat(mobile): badge appears only once the list is settled (R5)` | `7 failed, 1258 passed, 1265 total` | 6086 + 0 - 0 = 6086 |
| C9 | `77223d02 test(mobile): collapsed Attended section with total count (R7)` | `14 failed, 212 passed, 226 total` | 6086 + 5 - 0 = 6091 |
| C10 | `2a5b6b46 feat(mobile): collapsed Attended section with total count (R7)` | `7 failed, 1263 passed, 1270 total` | 6091 + 0 - 0 = 6091 |
| C11 | `bb171825 test(mobile): marking read keeps the row and moves it to Attended after refetch (R6)` | `6 failed, 80 passed, 86 total` | 6091 + 1 - 0 = 6092 |
| C12 | `fda15bf1 test(mobile): Attended section toggles and remembers how many rows were visible (R8)` | `9 failed, 84 passed, 93 total` | 6092 + 2 - 0 = 6094 |
| C13 | `db84de64 feat(mobile): Attended section toggles and renders the first ten rows (R8)` | `5 failed, 1268 passed, 1273 total` | 6094 + 0 - 0 = 6094 |
| C14 | `438f7a13 test(mobile): compact attended row without ack that opens the detail (R9)` | `15 failed, 383 passed, 398 total` | 6094 + 8 - 0 = 6102 |
| C15 | `ab097e6b feat(mobile): compact attended row without ack that opens the detail (R9)` | `2 failed, 1279 passed, 1281 total` | 6102 + 0 - 0 = 6102 |
| C16 | `faf1da24 test(mobile): Show more adds ten rows and the footer counts shown of total (R10)` | `15 failed, 498 passed, 513 total` | 6102 + 6 - 0 = 6108 |
| C17 | `d1019fe5 feat(mobile): Show more adds ten rows and the footer counts shown of total (R10)` | `2 failed, 1285 passed, 1287 total` | 6108 + 0 - 0 = 6108 |
| C18 | `c829a943 test(mobile): all-calm card when there are no open alerts (R11)` | `10 failed, 237 passed, 247 total` | 6108 + 6 - 0 = 6114 |
| C19 | `fa521ba4 feat(mobile): all-calm card when there are no open alerts (R11)` | `1293 passed, 1293 total` | 6114 + 0 - 0 = 6114 |
| C20 | `c7ac09a1 test(mobile): no alerts keeps the Pingo empty state and the first-page error keeps the retry (R12)` | `93 passed, 93 total` | 6114 + 1 - 0 = 6115 |
| C21 | `6ab0dd22 test(mobile): skeleton while draining with no open alerts yet (R13)` | `1 failed, 93 passed, 94 total` | 6115 + 1 - 0 = 6116 |
| C22 | `3dcf1d53 feat(mobile): skeleton while the list drains with no open alerts yet (R13)` | `1295 passed, 1295 total` | 6116 + 0 - 0 = 6116 |
| C23 | `33b2db81 test(mobile): a late page failure keeps the downloaded alerts and shows the error (R14)` | `95 passed, 95 total` | 6116 + 1 - 0 = 6117 |
| C24 | `5c45080a test(mobile): the alerts list no longer declares onEndReached (R15)` | `1 failed, 95 passed, 96 total` | 6117 + 1 - 0 = 6118 |
| C25 | `cb7a45f9 feat(mobile): remove onEndReached from the alerts list (R15)` | `1297 passed, 1297 total` | 6118 + 0 - 0 = 6118 |
| C26 | `f1526efa test(mobile): attended section classes are clean and targets reach 44 pt (R17)` | `21 passed, 21 total` | 6118 + 2 - 0 = 6120 |

| E4 (adenda 5) | `e6063116 test(mobile): detail navigation reaches attended alerts (R18)` | `1 passed, 1 total` | 6120 + 0 - 0 = 6120 |
| C27 | `71c41948 test(mobile): amended locks name their amendment (R18)` | `22 passed, 22 total` | 6120 + 1 - 0 = 6121 |
| C28 | Sin commit: G4 = 0, R19 no se implementa | No se crea ningún it.skip | 6121 + 0 - 0 = 6121 |
| C30 | `docs(mobile): traceability and report (R1-R18)` (este commit documental) | Corrida completa final indicada arriba | 6121 + 0 - 0 = 6121 |

Total: **N + 44 = 6121**, sin casos eliminados. Los +2 externos son las nuevas
filas de it.each de directUses (C14) y del ancla de «Ver más» (C16). No se
crearon commits feat artificiales para tests que nacieron verdes.
C0 solo amplía el mock sin aserciones nuevas. C6 incluye la enmienda mínima
#203 R8 expresamente autorizada por adenda 4; el rojo de R4 ya estaba en C5.

## Rojos medidos por paso (ventana y tests nuevos)

Se listan los títulos distintos de cada corrida. En los it.each se conserva
el título real de Jest; en C16 R10 fallan sus casos 11 y 23, que comparten
ese título, mientras el caso 10 pasa. Los recuentos exactos están en la tabla
anterior y en los logs completos. C0/C2/C3/C19/C20/C22/C23/C25/C26 son verdes
en sus corridas normales (sin las sondas).

### C1 · c1-223.log

- #223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null

### C4 · c4-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una

### C5 · c5-223.log

- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › no mueve la fila abierta al pulsar su ack (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › pide el cursor siguiente y conserva las filas de ambas páginas (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › no pide otra página mientras la anterior está en vuelo (enmendado por #223 R18)
- #78 R9: pagina por nextCursor y se para cuando no hay › conserva la primera página y muestra error si falla la segunda (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › #223 R4: data contiene solo las abiertas, por sección y en el orden del servidor
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › ordena las abiertas por sección y en el orden del servidor (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › pinta cada cabecera una sola vez al cargar la página siguiente (enmendado por #223 R18)
- #170 R3: agrupa la lista en Hoy, Esta semana y Anteriores › no reordena al marcar leída una fila abierta (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › suma las abiertas de todas las páginas cargadas (enmendado por #223 R18)

### C6 · c6-223-adenda4.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad

### C7 · c7-223.log

- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas

### C8 · c8-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad

### C9 · c9-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #223 R17: el encabezado de Atendidas
- #223 R17: la etiqueta
- #223 R17: el contador
- #223 R17: el disco del chevron
- #174 R12: grep-limpio › cada tracking-* va con su text-* (enmendado por #203 R8) (enmendado por #223 R18)
- #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17) (enmendado por #198 R15) (enmendado por #206 R8) (enmendado por #202 R10) (enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #208 R19) (enmendado por #213 R22) (enmendado por #222 R8) (enmendado por #214 R22) (enmendado por #223 R16)
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R7: pinta «Atendidas» colapsada con su contador solo asentada y con atendidas

### C10 · c10-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad

### C11 · c11-223.log

- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad

### C12 · c12-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #223 R17: la lista de atendidas
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #78 R7: pinta las abiertas primero y conserva la posición tras el ack › particiona por el status descargado y conserva el orden de cada grupo (enmendado por #223 R18)
- #97 R8: el overlay del ack caduca cuando la lista trae otro status › da prioridad al status cerrado descargado en el siguiente foco (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R8: el encabezado alterna la sección y recuerda cuántas filas había

### C13 · c13-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8)
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad

### C14 · c14-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #223 R17: la fila atendida
- #223 R17: el disco del icono
- #223 R17: el enlace
- #223 R17: el título
- #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/alerts/index.tsx importa y aplica sus 1 esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #200 R1 y #200 R5 y #200 R7 y #200 R8 y #200 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R2) (enmendado por #205 R3) (enmendado por #220 R4) (enmendado por #220 R14) (enmendado por #220 R15) (enmendado por #208 R21) (enmendado por #214 R4, R18) (enmendado por #223 R18)
- #62 R14: toda esquina no-cápsula que dibuja el repo es continua › fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #200 R1 y #200 R5 y #200 R7 y #200 R8 y #200 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R2) (enmendado por #205 R3) (enmendado por #220 R4) (enmendado por #220 R14) (enmendado por #220 R15) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R4, R18) (enmendado por #223 R18)
- #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9) (enmendado por #200 R1 y #200 R5 y #200 R6 y #200 R7 y #200 R8 y #200 R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R2, R3, R4, R11, R13) (enmendado por #203 R5) (enmendado por #205 R3) (enmendado por #220 R4) (enmendado por #220 R14) (enmendado por #220 R15) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R4, R18) (enmendado por #223 R18)
- #178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R9) (enmendado por #203 R4) (enmendado por #203 R6) (enmendado por #203 R7) (enmendado por #204 R8) (enmendado por #204 R9) (enmendado por #202 R18) (enmendado por #196 R5) (enmendado por #201 R5, R13) (enmendado por #205 R13) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18) (enmendado por #223 R18)
- #177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #198 R9) (enmendado por #203 R6) (enmendado por #203 R7) (enmendado por #204 R9) (enmendado por #202 R18) (enmendado por #201 R13) (enmendado por #205 R13) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20) (enmendado por #223 R18)
- #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden › alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8) (enmendado por #197 R8) (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #170 R5: la fila abierta lleva el borde de su tipo › acked: sin borde de severidad (enmendado por #223 R18)
- #170 R5: la fila abierta lleva el borde de su tipo › closed: sin borde de severidad (enmendado por #223 R18)
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R9: la fila atendida es compacta, sin ack y abre su detalle

### C15 · c15-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)

### C16 · c16-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #223 R17: Ver más
- #223 R17: el pie
- #177 R4.3: conserva los nueve secundarios neutros (enmendado por #189 R13) (enmendado por #203 R7) (enmendado por #213 R22) (enmendado por #214 R7, R11, R15, R16, R17) (enmendado por #223 R18)
- #177 R6.2: recuentos de etiquetas (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R5) (enmendado por #199 R9) (enmendado por #204 R8) (enmendado por #204 R9) (enmendado por #196 R6) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R13, R15, R18, R20) (enmendado por #223 R18)
- #177 R7.1: inventarios de los labios de borde restantes (enmendado por #189 R13) (enmendado por #197 R10) (enmendado por #203 R7) (enmendado por #213 R22) (enmendado por #214 R7, R11, R15, R17) (enmendado por #223 R18)
- #177 R7.5: inventario de los tres estilos y el tile (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20) (enmendado por #197 R10) (enmendado por #200 R6) (enmendado por #196 R4, R5) (enmendado por #201 R13) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20) (enmendado por #223 R18)
- #177 R8.3: screens/alerts/index.tsx conserva el ancla positiva h-11 rounded-14 border-2 border-lip-gray bg-surface px-5.5 (enmendado por #197 R10) (enmendado por #223 R18)
- #178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R9) (enmendado por #203 R4) (enmendado por #203 R6) (enmendado por #203 R7) (enmendado por #204 R8) (enmendado por #204 R9) (enmendado por #202 R18) (enmendado por #196 R5) (enmendado por #201 R5, R13) (enmendado por #205 R13) (enmendado por #208 R21) (enmendado por #213 R22) (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18) (enmendado por #223 R18)
- #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17) (enmendado por #198 R15) (enmendado por #206 R8) (enmendado por #202 R10) (enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #208 R19) (enmendado por #213 R22) (enmendado por #222 R8) (enmendado por #214 R22) (enmendado por #223 R16)
- #166 R3: el secundario neutro lleva el labio gris › inventaría los cinco secundarios neutros de toda la app (enmendado por #177 R10) (enmendado por #189 R13) (enmendado por #197 R10) (enmendado por #203 R7) (enmendado por #213 R22) (enmendado por #214 R7, R11, R15, R16, R17) (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R8: el encabezado alterna la sección y recuerda cuántas filas había (enmendado por #223 R18)
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R10: «Ver más» suma 10 y el pie cuenta N de M

### C17 · c17-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8)

### C18 · c18-223.log

- #223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una
- #223 R17: el encabezado Abiertas
- #223 R17: la tarjeta de calma
- #223 R17: el disco de calma
- #223 R17: el título de calma
- #223 R17: el cuerpo de calma
- #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17) (enmendado por #198 R15) (enmendado por #206 R8) (enmendado por #202 R10) (enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #208 R19) (enmendado por #213 R22) (enmendado por #222 R8) (enmendado por #214 R22) (enmendado por #223 R16)
- #174 R12: grep-limpio › cada tracking-* va con su text-* (enmendado por #203 R8) (enmendado por #223 R18)
- #170 R4: cuenta las alertas nuevas › no pinta el contador con 0 nuevas: todas leídas (enmendado por #203 R8) (enmendado por #223 R18)
- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R11: sin abiertas pinta «Todo en calma» con el nombre de la mascota más reciente

### C21 · c21-223.log

- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R13: mientras drena sin abiertas pinta el esqueleto, no el vacío ni la tarjeta de calma

### C24 · c24-223.log

- #223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas › #223 R15: la lista no declara onEndReached y el drenado pide las páginas

C6 anterior a la adenda 4 tuvo además el rojo de #203 R8, documentado en
`c6-223.log`; fue resuelto con la firma del leader, no por autoampliar alcance.
Desde C19 no quedó ningún rojo en el alcance de Alertas/hooks/providers/guards.
El rojo global de navegación de la primera corrida previa a C27 quedó resuelto por E4; se conserva como incidencia histórica, no como bloqueo actual.

## Sondas y tests que nacen verdes

Todas las mutaciones se revirtieron antes de commitear y se comprobó el diff
cuando podían dejar cambios de producción en un commit de tests.

| Paso / requisito | Resultado y evidencia |
|---|---|
| C1 / R1 | Rojo por isFetchingNextPage false en vez de true. Typecheck solo dio TS2554 por la opción aún inexistente (excepción permitida). |
| C2 / R1 | Sin `!isFetching`, el test observa 3 llamadas cuando esperaba 2: `c2-223-mutation.log`. |
| C3 / R2 | Nace verde por drain=false. Plantar drain=true da dos páginas donde esperaba una: `c3-223-mutation-r2.log`. |
| C3 / R3 | Cuatro casos nacen verdes por el corte preexistente de no-ok. La primera sonda con respuestas inmediatas sobrevivió (`c3-223-mutation-r3.log`); se reforzó el fixture con segunda página diferida. El fixture reforzado pasa (`c3-223.log`); cursor x en no-ok da 4 failed, 2 passed (`c3-223-mutation-r3-deferred.log`). |
| C4 / R16 | Rojo por literal de clave ausente; permanece rojo por diseño hasta C19, donde pasa. |
| C5–C6 / R4 | Rojo por atendidas de más en data; verde en C6. Cadenas finitas: tres fixtures con c1 ya terminaban en null, uno en error sin cursor y el pendiente se resuelve ahora a null. |
| C10 / R7 | Quitar settled pinta la sección mientras la segunda página sigue pendiente; falla R7: `c10-223-mutation.log`. |
| C11 / R6 | Nace verde. Aplicar overlay al cálculo de atendidas adelanta su contador de 1 a 2 y el test falla: `c11-223-mutation.log`. |
| C13 / R8 | Pintar 11 filas en vez de 10 falla el array exacto: `c13-223-mutation.log`. |
| C14 / R17 | Subtítulo y píldora nacen verdes por clases ya existentes. Primera mutación combinada: 1 failed, 1 passed, porque font-normal en la píldora introducía el literal del subtítulo. Segunda sonda con font-medium elimina el enmascaramiento: 2 failed (`c14-223-mutation-born-green-v2.log`). Se restauró todo antes del commit. |
| C15 / R9, R17 | Cambiar rounded-16 por rounded-xl falla tanto la fila como #177 R7.3: `c15-223-mutation.log`, 2 failed. |
| C16–C17 / R10 | Caso total=10 nace verde; >=10 en el umbral del pie lo hace fallar con Mostrando 10 de 10. Los casos 11/23 pasan: `c17-223-mutation.log`, 1 failed, 2 passed. |
| C19 / R11 | Usar la última atendida elige Luna en vez de Rocky y falla: `c19-223-mutation.log`. |
| C20 / R12 | Nace verde. Mostrar calma también sin atendidas (con fallback de nombre para no provocar excepción) quita el vacío y falla: `c20-223-mutation.log`. |
| C21–C22 / R13 | Rojo por esqueleto ausente durante drenado; verde al ampliar la rama isPending. Quitar la condición draining vuelve a fallar: `c22-223-mutation.log`. |
| C23 / R14 | Nace verde. Ocultar la insignia con laterPageFailed rompe la aserción: `c23-223-mutation.log`. |
| C24–C25 / R15 | Rojo por recibir Function onEndReached en vez de undefined; verde al retirar la prop. |
| C26 / R17 | Grep-limpio y dianas nacen verdes. Hex, corchetes, StyleSheet.create y h-9 producen dos rojos: hex detectado y diana 36 < 44 (`c26-223-mutation.log`). |
| C27 / R18 | Nace verde (22/22 en la suite, con 31 títulos cerrados). Quitar el sufijo de «no mueve la fila abierta al pulsar su ack» provoca 1 failed, 21 skipped (`c27-223-mutation.log`). Se restauró antes del commit y el diff del test de pantalla quedó vacío. |

## Disciplina de pruebas

Todas las llamadas nuevas de RNTL a render/renderHook/renderAlerts/fireEvent/act/
rerender/unmount llevan await; E4 espera también renderRouter mediante await app.
Las esperas observan el árbol, data o resultado del hook que se aserta, no el
contador de un mock. Las ausencias se anclan a un nodo positivo del escenario.
Fecha y TZ de los nuevos tests de pantalla siguen #170 R3, con Date.now fijo
mediante spy y process.getBuiltinModule('process'). Los valores esperados de
copy, clases y límites son literales de tests, sin importarlos de producción.

La cifra global se verifica como anterior + añadidos - eliminados. Los it.each
aportan una prueba por fila; C16 tiene tres casos de R10, con dos títulos rojos
idénticos para 11/23. No hubo SIGKILL ni suites omitidas en las corridas completas.
Las guardas de pantalla pasaron antes de cada feat: sin lógica nueva de ack/cache,
una settleAlertAck, una ackAlert, tres somethingWentWrong y un retry. Se conserva
padding insets.top + 8, una TABULAR_NUMS y RiseIn solo en las cinco primeras abiertas.

## Skills y decisiones de proceso

Se cargaron `ponytail`, `appllama-app-design-skill`, `building-native-ui` y
`expo-tailwind-setup`. Las de Expo están en
`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`.
La carta prevalece; no se invocó Appllama (el diseño ya venía resuelto).
No se buscaron expo-overview, expo-animation, expo-router ni expo-design-system:
el handoff los declara inexistentes en Codex. También se leyó openai-docs al
atender la pregunta del humano sobre la capacidad del modelo; sin cambiarlo.

Se siguieron R6 después de R7, copy incremental en R7/R10/R11, rojo de R16
hasta C19, E1/E1b para el contador de catálogo, E2 para los cuatro candados de
consistency, y la corrección de citas/aritmética E3 del handoff de chunky-cta.
La E3 de requirements añadida con adenda 4 es la autorización separada de
#203 R8. La fila de counters #170 R16 permanece intacta.

Error de invocación previo corregido: lectura de un inexistente
`hooks/use-pet-members.test.tsx`; se listaron los hooks con rg y se usó
use-pet-selection como patrón. No se tocó ningún fichero por ese error.
No se ejecutó prettier ni se reindentó la pantalla en bloque: el renderer
se reutilizó temporalmente en C13 y volvió a quedar inline en C15 al crear la
fila compacta local. No quedaron helpers provisionales de ese renderer.

## Tabla R1–R19 a test y commit

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `hooks/use-alerts-list.test.tsx::#223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null` | test `9c2af9ee` — test(mobile): drain option fetches each page with its cursor (R1); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1) |
| R2 | `hooks/use-alerts-list.test.tsx::#223 R2: sin drain pide una sola página aunque haya nextCursor y usa la clave ['alerts','list']` | test `32e74712` — test(mobile): hook without drain and non-ok pages stop the drain (R2, R3); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1); test nacido verde, sonda de mutación documentada en el reporte |
| R3 | `hooks/use-alerts-list.test.tsx::#223 R3: %s corta el drenado y conserva las páginas previas` | test `32e74712` — test(mobile): hook without drain and non-ok pages stop the drain (R2, R3); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1); el corte de páginas no-ok ya existía en H0 |
| R4 | `screens/alerts/index.test.tsx::#223 R4: data contiene solo las abiertas, por sección y en el orden del servidor` | test `35724cfb` — test(mobile): alerts data holds only open alerts, by section (R4); feat / comportamiento existente `b37242bc` — feat(mobile): alerts screen lists only open alerts and drains the list (R4) |
| R5 | `screens/alerts/index.test.tsx::#223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas` | test `a35ad7e3` — test(mobile): badge waits for the last cursor and sums every page (R5); feat / comportamiento existente `78b56b5b` — feat(mobile): badge appears only once the list is settled (R5) |
| R6 | `screens/alerts/index.test.tsx::#223 R6: la fila marcada leída conserva su sitio y pasa a Atendidas en el siguiente refetch` | test `bb171825` — test(mobile): marking read keeps the row and moves it to Attended after refetch (R6); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7); test nacido verde, sonda de mutación documentada en el reporte |
| R7 | `screens/alerts/index.test.tsx::#223 R7: pinta «Atendidas» colapsada con su contador solo asentada y con atendidas` | test `77223d02` — test(mobile): collapsed Attended section with total count (R7); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7) |
| R8 | `screens/alerts/index.test.tsx::#223 R8: el encabezado alterna la sección y recuerda cuántas filas había (enmendado por #223 R18)` | test `faf1da24` — test(mobile): Show more adds ten rows and the footer counts shown of total (R10); feat / comportamiento existente `d1019fe5` — feat(mobile): Show more adds ten rows and the footer counts shown of total (R10) |
| R9 | `screens/alerts/index.test.tsx::#223 R9: la fila atendida es compacta, sin ack y abre su detalle` | test `438f7a13` — test(mobile): compact attended row without ack that opens the detail (R9); feat / comportamiento existente `ab097e6b` — feat(mobile): compact attended row without ack that opens the detail (R9) |
| R10 | `screens/alerts/index.test.tsx::#223 R10: «Ver más» suma 10 y el pie cuenta N de M` | test `faf1da24` — test(mobile): Show more adds ten rows and the footer counts shown of total (R10); feat / comportamiento existente `d1019fe5` — feat(mobile): Show more adds ten rows and the footer counts shown of total (R10) |
| R11 | `screens/alerts/index.test.tsx::#223 R11: sin abiertas pinta «Todo en calma» con el nombre de la mascota más reciente` | test `c829a943` — test(mobile): all-calm card when there are no open alerts (R11); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R12 | `screens/alerts/index.test.tsx::#223 R12: sin alertas conserva el vacío de Pingo y el error de la primera página conserva el reintento` | test `c7ac09a1` — test(mobile): no alerts keeps the Pingo empty state and the first-page error keeps the retry (R12); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11); test nacido verde, sonda de mutación documentada en el reporte |
| R13 | `screens/alerts/index.test.tsx::#223 R13: mientras drena sin abiertas pinta el esqueleto, no el vacío ni la tarjeta de calma` | test `6ab0dd22` — test(mobile): skeleton while draining with no open alerts yet (R13); feat / comportamiento existente `3dcf1d53` — feat(mobile): skeleton while the list drains with no open alerts yet (R13) |
| R14 | `screens/alerts/index.test.tsx::#223 R14: si falla la segunda página conserva lo descargado, muestra el error y no pide más` | test `33b2db81` — test(mobile): a late page failure keeps the downloaded alerts and shows the error (R14); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7); test nacido verde, sonda de mutación documentada en el reporte |
| R15 | `screens/alerts/index.test.tsx::#223 R15: la lista no declara onEndReached y el drenado pide las páginas` | test `5c45080a` — test(mobile): the alerts list no longer declares onEndReached (R15); feat / comportamiento existente `cb7a45f9` — feat(mobile): remove onEndReached from the alerts list (R15) |
| R16 | `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una` | test `95f7aa9a` — test(mobile): attended-section copy keys exist in both languages (R16); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R17 | `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R17: grep-limpio` y `#223 R17: las dianas táctiles llegan a 44 pt`, más los 18 tests de clases de R17 del mismo archivo | test `f1526efa` — test(mobile): attended section classes are clean and targets reach 44 pt (R17); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R18 | `suite completa verde + __tests__/alerts-attended-canvas-fidelity.test.ts::#223 R18: los candados enmendados nombran su enmienda` | test `71c41948` — test(mobile): amended locks name their amendment (R18); enmienda `e6063116` — test(mobile): detail navigation reaches attended alerts (R18) |
| R19 | pendiente: G4; no se creó el test ni se enmendó la carta | pendiente: G4 |

## Ficheros desde H0 y alcance

Lista medida con git diff contra H0, incluyendo los cambios de documentación
que se commitean en C30:

```text
mobile-pet-tracker/src/__tests__/alerts-attended-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx
mobile-pet-tracker/src/hooks/use-alerts-list.test.tsx
mobile-pet-tracker/src/hooks/use-alerts-list.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/alerts/index.test.tsx
mobile-pet-tracker/src/screens/alerts/index.tsx
progress/handoff_mobile-alerts-attended-section.md
progress/impl_mobile-alerts-attended-section.md
specs/mobile-alerts-attended-section/requirements.md
specs/mobile-alerts-attended-section/tasks.md
specs/mobile-alerts-attended-section/traceability.md
```

Handoff y requirements son commits del leader. Los cambios propios corresponden
a la lista cerrada más la excepción E4 de navegación y su mock autorizada por el
humano. Package.json, bun.lock, componentes compartidos, theme, API, backend y app
de producción permanecen intactos. Los artefactos de graphify y logs son ignorados.
El archivo previo sin seguimiento `progress/draft_handoff-223.md` se conserva.

El marcador `progress/impl_mobile-alerts-attended-section.done` se crea como
última acción, después de commitear C30 y comprobar el árbol limpio del alcance.
Apunta a la ruta absoluta de este reporte y no se commitea. El smoke G2, la firma
G4, el init y la integración posterior corresponden al humano/leader.
