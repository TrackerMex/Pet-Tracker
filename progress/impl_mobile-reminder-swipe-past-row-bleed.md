# Implementación #239 mobile-reminder-swipe-past-row-bleed

## Worktree y base

Salida del comando de identidad pedido por el handoff:

```text
/home/claude/sites/Pet-Tracker-wt-239
feature/239-mobile-reminder-swipe-past-row-bleed
2d10c7f7 docs(progress): #239 codex handoff
7655c8a3 chore(spec): completa la firma delegada #239 (casillas y estado de design, tasks y traceability)
e4e1cb15 chore(spec): firma delegada #239 (mandato del humano 2026-10-23, ampliado 2026-11-04)
f9176007 docs(spec): specify the opaque base for past reminder rows (#239)
0f1ab26f Merge pull request #306 from TrackerMex/docs/plan-arreglos-smoke-2026-11-04
```

H0: `7655c8a3`; base del diff acotado: `2d10c7f7`. Árbol inicial limpio.
La lectura del handoff y de ponytail precedió al comando de identidad; no hubo cambios antes de confirmar ruta, rama e historia.

## Skills e instrucciones

- `ponytail:ponytail`.
- `building-native-ui`: encontrada en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `appllama-app-design-skill`: obligatoria por `docs/ui-guidelines.md`; la carta y la spec prevalecen y reservan G2 al humano.
- Leídas arquitectura, convenciones (incluida §Esperas), carta de UI, verificación, C4 y la spec completa aprobada R1–R7. Consultada la documentación Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/.
- No se ejecutan `./init.sh`, instalación, fetch, merge, rebase ni operaciones de PR. T0(1) ya estaba hecho. No se modifica G2 ni bookkeeping del leader.
- Los logs se guardan en `/tmp/` para respetar la lista cerrada de archivos del worktree.

## T0 — Anclas y localizadores

```text
<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>: 0 (esperado 0)
style={CONTINUOUS_CORNER}: 7 (esperado 7)
rounded-22: 3 (esperado 3)
bg-background: 3 (esperado 3)
<View: 29 (esperado 29)
{past ? (: 0 (esperado 0)
) : row}: 0 (esperado 0)
{row}: 1 (esperado 1)
${past ? ' opacity-50' : ''}: 1 (esperado 1)
 opacity-50: 1 (esperado 1)
testID=: 48 (esperado 48)
bg-surface: 6 (esperado 6)
CATEGORY_SLOTS.rose.surface: 4 (esperado 4)
overflow-hidden: 1 (esperado 1)
if (!isOwner) return row;: 1 (esperado 1)
<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>: 1 (esperado 1)
absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}: 1 (esperado 1)
needsOffscreenAlphaCompositing: 0 (esperado 0)
renderToHardwareTextureAndroid: 0 (esperado 0)
childrenContainerStyle: 0 (esperado 0)
__tests__/reminders-upcoming-past-canvas-fidelity.test.ts :: #227 R11: inventario del fuente: 1 (esperado 1)
__tests__/reminders-upcoming-past-canvas-fidelity.test.ts :: ['style={CONTINUOUS_CORNER}', 6 + 1], // #228 R2: 1 (esperado 1)
__tests__/consistency-classnames.test.ts :: %s importa y aplica sus %i esquinas: 1 (esperado 1)
__tests__/consistency-classnames.test.ts :: [join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos; #228 R2 envoltorio de deslizar: 1 (esperado 1)
__tests__/consistency-classnames.test.ts :: fusiona la esquina una vez y la entrega a las dos ramas de Card: 1 (esperado 1)
__tests__/consistency-classnames.test.ts :: deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban: 1 (esperado 1)
__tests__/consistency-classnames.test.ts :: + 1 // #228 R2: 2 (esperado 2)
__tests__/design-drift.test.ts :: reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto: 1 (esperado 1)
__tests__/design-drift.test.ts :: [/\brounded-22\b/g, 1 + 1 + 1],: 1 (esperado 1)
```

Sin discrepancias.

## T0 — Jest completo del alcance

Comando desde `mobile-pet-tracker/`:

```sh
bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > /tmp/t0-mobile-reminder-swipe-past-row-bleed.log 2>&1
```

Exit 0.

```text
Test Suites: 91 passed, 91 total
Tests:       2024 passed, 2024 total
Snapshots:   0 total
Time:        127.364 s
Ran all test suites matching /src\/screens\/reminders|src\/utils|src\/theme|src\/__tests__|src\/providers|src\/app/i.
```

Marcadores `●`: 8 (todos `Console`, ninguno de fallo). Sin SIGKILL, suites sin ejecutar ni flakes.

## P — Línea base reducida

```sh
bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/p0-mobile-reminder-swipe-past-row-bleed.log 2>&1
```

Exit 0. **P = 162** pasados, 0 fallidos.

```text
Test Suites: 2 passed, 2 total
Tests:       162 passed, 162 total
Snapshots:   0 total
Time:        17.779 s, estimated 126 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
```

## S1 — Base en todas las filas del dueño

Mutación literal de tasks.md, plantada sola; tests nuevos sin commit.
Comando: `bun run jest src/screens/reminders > /tmp/s1-239.log 2>&1`. Exit 1.

```text
● Base opaca de la fila pasada (#239 R1 a R5) › #239 R3: las filas de Próximos no llevan base

    expect(received).toBe(expected) // Object.is equality

    Expected: "reminder-swipe-once"
    Received: undefined

      2819 |     for (const id of ['once', 'series']) {
      2820 |       const row = screen.getByTestId(`reminder-row-${id}`);
    > 2821 |       expect(row.parent?.props.testID).toBe(`reminder-swipe-${id}`);
           |                                        ^
      2822 |       expect(row.parent?.props.className).toBeUndefined();
      2823 |     }
      2824 |   });

      at Object.toBe (src/screens/reminders/index.test.tsx:2821:40)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 152 passed, 153 total
Snapshots:   0 total
Time:        19.251 s
Ran all test suites matching /src\/screens\/reminders/i.
error: "jest" exited with code 1
```

Rojo por la aserción del padre de Próximos (`#239 R3`). Revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`; las dos comprobaciones `git diff --quiet HEAD -- …` y `git diff --cached --quiet` dieron exit 0.

## S2 — Base en quien no es dueño

Mutación literal de tasks.md, plantada sola.
Comando: `bun run jest src/screens/reminders > /tmp/s2-239.log 2>&1`. Exit 1.

```text
● Base opaca de la fila pasada (#239 R1 a R5) › #239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: undefined

      2776 |       const row = within(swipe).getByTestId(`reminder-row-${id}`);
      2777 |       const base = row.parent;
    > 2778 |       expect(base?.props.className).toBe('rounded-22 bg-background');
           |                                     ^
      2779 |       expect(flat(base?.props.style)).toEqual({ borderCurve: 'continuous' });
      2780 |       expect(base?.props.testID).toBeUndefined();
      2781 |       expect(base?.props.accessible).toBeUndefined();

      at Object.toBe (src/screens/reminders/index.test.tsx:2778:37)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● Base opaca de la fila pasada (#239 R1 a R5) › #239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos

    expect(received).toBeNull()

    Received: <View accessibilityElementsHidden={true} accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="w-24 items-center justify-center gap-1 bg-category-rose" collapsable={false} focusable={true} importantForAccessibility="no-hide-descendants" onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={{"opacity": 1}} testID="reminder-delete-pastonce"><View className="absolute inset-y-0 -left-6 w-6 bg-category-rose" /><View color="color:danger" size={20} testID="reminders-icon-trash" /><Text className="text-center text-13 font-extrabold text-danger">Eliminar</Text></View>

      2804 |       const panel = within(swipe).getByTestId(panelId, HIDDEN);
      2805 |       expect(base).not.toBeNull();
    > 2806 |       expect(within(base!).queryByTestId(panelId, HIDDEN)).toBeNull();
           |                                                            ^
      2807 |       expect(panel).toBeOnTheScreen();
      2808 |       expect(panel.parent?.props.testID).toBe(`reminder-swipe-${id}`);
      2809 |       expect(panel.props.className).toBe('w-24 items-center justify-center gap-1 bg-category-rose');

      at Object.toBeNull (src/screens/reminders/index.test.tsx:2806:60)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● Base opaca de la fila pasada (#239 R1 a R5) › #239 R4: quien no es dueño no lleva base en Pasados

    expect(received).toBe(expected) // Object.is equality

    Expected: "reminders-entry-pastonce"
    Received: undefined

      2832 |     for (const id of ['pastonce', 'pastseries']) {
      2833 |       const row = screen.getByTestId(`reminder-row-${id}`);
    > 2834 |       expect(row.parent?.props.testID).toBe(`reminders-entry-${id}`);
           |                                        ^
      2835 |     }
      2836 |   });
      2837 |

      at Object.toBe (src/screens/reminders/index.test.tsx:2834:40)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● Base opaca de la fila pasada (#239 R1 a R5) › #239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: undefined

      2844 |     const swipe = screen.getByTestId('reminder-swipe-pastonce');
      2845 |     const row = within(swipe).getByTestId('reminder-row-pastonce');
    > 2846 |     expect(row.parent?.props.className).toBe('rounded-22 bg-background');
           |                                         ^
      2847 |     const panel = within(swipe).getByTestId('reminder-delete-pastonce', HIDDEN);
      2848 |     expect(panel).toBeOnTheScreen();
      2849 |     expect(mockSwipeable).not.toHaveBeenCalled();

      at Object.toBe (src/screens/reminders/index.test.tsx:2846:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 149 passed, 153 total
Snapshots:   0 total
Time:        17.141 s, estimated 20 s
Ran all test suites matching /src\/screens\/reminders/i.
error: "jest" exited with code 1
```

R4 falla por la aserción del padre de la fila familiar. Los rojos R1, R2 y R5 son los esperados sobre producción todavía sin base para el dueño; R6 no pertenece a esta corrida. Revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`; ambas comprobaciones de diff dieron exit 0.

## Commit rojo R1–R6

`022fc871 test(mobile): opaque base under past reminder rows (R1, R2, R3, R4, R5, R6)`

Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/red-r1-r6-239.log 2>&1`. Exit 1.

```text
#239 R6: inventario del fuente
Base opaca de la fila pasada (#239 R1 a R5) › #239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable
Base opaca de la fila pasada (#239 R1 a R5) › #239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos
Base opaca de la fila pasada (#239 R1 a R5) › #239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja
Test Suites: 2 failed, 2 total
Tests:       4 failed, 164 passed, 168 total
Snapshots:   0 total
Time:        16.601 s, estimated 17 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
error: "jest" exited with code 1
```

164 = P + 2 pasados. R3 y R4 nacen verdes y sus sondas los hicieron fallar. R1: padre sin la clase de la base. R2: el padre contiene también el panel (queryByTestId no es null). R5: el componente real monta la fila pero su padre carece de className. R6: el literal de la base aparece 0 veces en vez de 1. Todos fallan por su aserción; sin import roto, módulos faltantes ni error de montaje. El commit solo contiene los dos archivos de tests nuevos.

## T2 — Implementación literal y guards

El fuente solo cambia `{row}` por las cinco líneas del diseño; delta de producción +5/-1. Se enmiendan las cinco filas de la Tabla de enmiendas en sus tres archivos, sin sufijo todavía.

Comando reducido: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/green-r1-r6-239.log 2>&1`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       168 passed, 168 total
Snapshots:   0 total
Time:        17.464 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
```

168 = P + 6 pasados, 0 fallidos; R5 monta el componente real y pulsa el panel de Pasados para abrir la hoja con «Desparasitación».

Comando T2 completo: `bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > /tmp/t2-mobile-reminder-swipe-past-row-bleed.log 2>&1`. Exit 0.

```text
Test Suites: 91 passed, 91 total
Tests:       2030 passed, 2030 total
Snapshots:   0 total
Time:        47.641 s, estimated 86 s
Ran all test suites matching /src\/screens\/reminders|src\/utils|src\/theme|src\/__tests__|src\/providers|src\/app/i.
```

Commit verde: `85299804 feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)`. Sin rojos ajenos ni Regla de cierre; solo las cinco enmiendas previstas. `beforeEach` y `afterEach` nuevos comprobados como copia literal de los de #228.

## S3 — bg-background pasa a bg-surface en la base

Mutación literal, plantada sola sobre el commit verde.
Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/s3-239.log 2>&1`. Exit 1.

```text
● #239 R6: inventario del fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      169 |     ['renderToHardwareTextureAndroid', 0],
      170 |     ['childrenContainerStyle', 0],
    > 171 |   ] as const) expect(count(source, literal)).toBe(occurrences);
          |                                              ^
      172 | });
      173 |

      at Object.toBe (src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts:171:46)

● Base opaca de la fila pasada (#239 R1 a R5) › #239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: "rounded-22 bg-surface"

      2776 |       const row = within(swipe).getByTestId(`reminder-row-${id}`);
      2777 |       const base = row.parent;
    > 2778 |       expect(base?.props.className).toBe('rounded-22 bg-background');
           |                                     ^
      2779 |       expect(flat(base?.props.style)).toEqual({ borderCurve: 'continuous' });
      2780 |       expect(base?.props.testID).toBeUndefined();
      2781 |       expect(base?.props.accessible).toBeUndefined();

      at Object.toBe (src/screens/reminders/index.test.tsx:2778:37)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● Base opaca de la fila pasada (#239 R1 a R5) › #239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: "rounded-22 bg-surface"

      2844 |     const swipe = screen.getByTestId('reminder-swipe-pastonce');
      2845 |     const row = within(swipe).getByTestId('reminder-row-pastonce');
    > 2846 |     expect(row.parent?.props.className).toBe('rounded-22 bg-background');
           |                                         ^
      2847 |     const panel = within(swipe).getByTestId('reminder-delete-pastonce', HIDDEN);
      2848 |     expect(panel).toBeOnTheScreen();
      2849 |     expect(mockSwipeable).not.toHaveBeenCalled();

      at Object.toBe (src/screens/reminders/index.test.tsx:2846:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 2 failed, 2 total
Tests:       3 failed, 165 passed, 168 total
Snapshots:   0 total
Time:        21.9 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
error: "jest" exited with code 1
```

R1 y R5 fallan por className distinto; R6 por la ausencia del literal de la base. Revertida con el checkout de HEAD y ambos checks de diff con exit 0.

## S4 — Opacidad trasladada de la fila a la base

Se borra `${past ? ' opacity-50' : ''}` de la fila y se añade `opacity-50` a la clase de la base; mutación literal plantada sola.
Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/s4-239.log 2>&1`. Exit 1.

```text
● #239 R6: inventario del fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      169 |     ['renderToHardwareTextureAndroid', 0],
      170 |     ['childrenContainerStyle', 0],
    > 171 |   ] as const) expect(count(source, literal)).toBe(occurrences);
          |                                              ^
      172 | });
      173 |

      at Object.toBe (src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts:171:46)

● #178 R6: fila del canvas › distingue las recetas de fila próxima, lejana e inactiva (enmendado por #204 R7) (enmendado por #213 R16) (enmendado por #227 R13)

    expect(received).toBe(expected) // Object.is equality

    Expected: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50"
    Received: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      578 |     ]) {
      579 |       const row = screen.getByTestId(`reminder-row-${id}`);
    > 580 |       expect(row.props.className).toBe(className);
          |                                   ^
      581 |       expect(row).toHaveStyle({ borderCurve: 'continuous' });
      582 |     }
      583 |   });

      at Object.toBe (src/screens/reminders/index.test.tsx:580:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● R6: lista con pills, badges y refetch on focus › renders summaries and reminder rows by section (enmendado por #213 R16) (enmendado por #227 R13)

    expect(received).toContain(expected) // indexOf

    Expected substring: "opacity-50"
    Received string:    "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      744 |     expect(screen.getAllByTestId(/^reminder-row-/).map(({ props }) => props.testID)).toEqual(['reminder-row-upcoming', 'reminder-row-later', 'reminder-row-cancelled', 'reminder-row-sent']);
      745 |
    > 746 |     expect(screen.getByTestId('reminder-row-sent').props.className).toContain(
          |                                                                     ^
      747 |       'opacity-50',
      748 |     );
      749 |     expect(screen.getByTestId('reminder-status-sent')).toHaveTextContent(

      at Object.toContain (src/screens/reminders/index.test.tsx:746:69)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #213 R14: series en Recordatorios › #213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy (enmendado por #227 R13)

    expect(received).toBe(expected) // Object.is equality

    Expected: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50"
    Received: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      2128 |     }
      2129 |     expect(screen.getByTestId('reminder-row-tomorrow').props.className).toBe('flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border');
    > 2130 |     expect(screen.getByTestId('reminder-row-yesterday').props.className).toBe('flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50');
           |                                                                          ^
      2131 |   });
      2132 |
      2133 |   it('#213 R17: Cancelar serie abre la hoja con su copy (enmendado por #228 R13)', async () => {

      at Object.toBe (src/screens/reminders/index.test.tsx:2130:74)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #227: próximos y pasados › #227 R6: el encabezado alterna «Pasados» y sus filas van atenuadas de la más reciente a la más antigua

    expect(received).toMatch(expected)

    Expected pattern: / opacity-50$/
    Received string:  "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      2468 |     const rows = within(list).getAllByTestId(/^reminder-row-/);
      2469 |     expect(rows.map(({ props }) => props.testID)).toEqual(['reminder-row-cancelled', 'reminder-row-yesterday', 'reminder-row-oldsent']);
    > 2470 |     for (const row of rows) expect(row.props.className).toMatch(/ opacity-50$/);
           |                                                         ^
      2471 |     const toggle = screen.getByTestId('reminders-past-toggle');
      2472 |     expect(toggle.props.accessibilityState?.expanded).toBe(true);
      2473 |     expect(within(toggle).queryByTestId('reminders-icon-chevron-up', { includeHiddenElements: true })).not.toBeNull();

      at Object.toMatch (src/screens/reminders/index.test.tsx:2470:57)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● #227: próximos y pasados › #227 R7: la opacidad sigue a la sección y el resto de la fila sigue al status

    expect(received).toBe(expected) // Object.is equality

    Expected: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50"
    Received: "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      2491 |       ['yesterday', 'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50'],
      2492 |       ['oldsent', 'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50'],
    > 2493 |     ]) expect(screen.getByTestId(`reminder-row-${id}`).props.className).toBe(className);
           |                                                                         ^
      2494 |     expect(screen.getByTestId('reminder-upcoming-today')).toHaveTextContent('Hoy');
      2495 |     for (const id of ['newyear', 'later', 'yesterday']) expect(screen.queryByTestId(`reminder-upcoming-${id}`)).toBeNull();
      2496 |     expect(screen.getByTestId('reminder-status-later')).toHaveTextContent('Enviado');

      at Object.toBe (src/screens/reminders/index.test.tsx:2493:73)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● Acciones de deslizar en Recordatorios (#228 R2 a R9) › #228 R6: las filas pasadas también se deslizan y solo la fila va atenuada

    expect(received).toMatch(expected)

    Expected pattern: / opacity-50$/
    Received string:  "flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border"

      2696 |       const row = within(swipe).getByTestId(`reminder-row-${id}`);
      2697 |       const panel = within(swipe).getByTestId(panelId, HIDDEN);
    > 2698 |       expect(row.props.className).toMatch(/ opacity-50$/);
           |                                   ^
      2699 |       expect(swipe.parent?.props.className).toBe('overflow-hidden rounded-22');
      2700 |       expect(flat(swipe.props.style)).toEqual({});
      2701 |       expect(flat(swipe.parent?.props.style)).toEqual({ borderCurve: 'continuous' });

      at Object.toMatch (src/screens/reminders/index.test.tsx:2698:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● Base opaca de la fila pasada (#239 R1 a R5) › #239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: "rounded-22 bg-background opacity-50"

      2776 |       const row = within(swipe).getByTestId(`reminder-row-${id}`);
      2777 |       const base = row.parent;
    > 2778 |       expect(base?.props.className).toBe('rounded-22 bg-background');
           |                                     ^
      2779 |       expect(flat(base?.props.style)).toEqual({ borderCurve: 'continuous' });
      2780 |       expect(base?.props.testID).toBeUndefined();
      2781 |       expect(base?.props.accessible).toBeUndefined();

      at Object.toBe (src/screens/reminders/index.test.tsx:2778:37)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

● Base opaca de la fila pasada (#239 R1 a R5) › #239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja

    expect(received).toBe(expected) // Object.is equality

    Expected: "rounded-22 bg-background"
    Received: "rounded-22 bg-background opacity-50"

      2844 |     const swipe = screen.getByTestId('reminder-swipe-pastonce');
      2845 |     const row = within(swipe).getByTestId('reminder-row-pastonce');
    > 2846 |     expect(row.parent?.props.className).toBe('rounded-22 bg-background');
           |                                         ^
      2847 |     const panel = within(swipe).getByTestId('reminder-delete-pastonce', HIDDEN);
      2848 |     expect(panel).toBeOnTheScreen();
      2849 |     expect(mockSwipeable).not.toHaveBeenCalled();

      at Object.toBe (src/screens/reminders/index.test.tsx:2846:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 2 failed, 2 total
Tests:       9 failed, 159 passed, 168 total
Snapshots:   0 total
Time:        20.548 s, estimated 21 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
error: "jest" exited with code 1
```

9 fallidos, 159 pasados. Muerden R1, R5, R6 y #228 R6 como exige la sonda; también los cinco candados previos que asertan la opacidad de la propia fila (#178 R6, R6 de lista, #213 R16, #227 R6 y #227 R7). No son regresiones ni enmiendas: fallan solo bajo esta mutación de opacidad. Revertida con el checkout de HEAD y ambos checks de diff con exit 0.

## S5 — Franja ausente solo en Pasados

La franja pasa a `{past ? null : <View className={`absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`} />}`; mutación literal plantada sola.
Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/s5-239.log 2>&1`. Exit 1.

```text
● Base opaca de la fila pasada (#239 R1 a R5) › #239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos

    expect(received).toHaveLength(expected)

    Expected length: 3
    Received length: 2
    Received array:  [<View color="color:danger" size={20} testID="reminders-icon-trash" />, <Text className="text-center text-13 font-extrabold text-danger">Eliminar</Text>]

      2808 |       expect(panel.parent?.props.testID).toBe(`reminder-swipe-${id}`);
      2809 |       expect(panel.props.className).toBe('w-24 items-center justify-center gap-1 bg-category-rose');
    > 2810 |       expect(panel.children).toHaveLength(3);
           |                              ^
      2811 |       expect(panel.children[0]).toHaveProperty('props.className', 'absolute inset-y-0 -left-6 w-6 bg-category-rose');
      2812 |       expect(flat(panel.props.style)).toEqual({ opacity: 1 });
      2813 |     }

      at Object.toHaveLength (src/screens/reminders/index.test.tsx:2810:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 167 passed, 168 total
Snapshots:   0 total
Time:        17.543 s, estimated 20 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
error: "jest" exited with code 1
```

R2 falla por panel.children de longitud 2 en lugar de 3. Revertida con el checkout de HEAD y ambos checks de diff con exit 0. Ninguna sonda se commiteó.

## Commit rojo R7

`10d67da1 test(mobile): amended locks name the past-row base amendment (R7)`

Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/red-r7-239.log 2>&1`. Exit 1.

```text
FAIL src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts
  ● #239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla

    expect(received).toContain(expected) // indexOf

    Expected substring: "(enmendado por #239 R7)"
    Received string:    "it('#227 R11: inventario del fuente (enmendado por #228 R13)', () => {"

      184 |     const lines = readSource(path).split('\n').filter((line) => line.includes(locator));
      185 |     expect(lines).toHaveLength(1);
    > 186 |     expect(lines[0]).toContain('(enmendado por #239 R7)');
          |                      ^
      187 |   }
      188 |   const spec = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'requirements.md'), 'utf8');
      189 |   expect(count(spec, '## Enmienda \x23239 — Base opaca de la fila pasada')).toBe(1);

      at toContain (src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts:186:22)
      at Object._loop2 (src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts:183:28)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 168 passed, 169 total
Snapshots:   0 total
Time:        18.045 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
error: "jest" exited with code 1
```

168 = P + 6 pasados; exactamente un rojo, R7, por falta del sufijo en el primer título enmendado. La línea existe una sola vez y la lectura funciona: no falla por import ni módulo. `AMENDED_PAST_ROW_BASE` contiene las cinco filas literales; no hubo filas adicionales por Regla de cierre.

## Commit verde R7

`aae1b86d test(mobile): suffix amended locks with #239 R7 (R7)`

Solo se añade el sufijo a los cinco títulos previstos.
Comando: `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts > /tmp/green-r7-239.log 2>&1`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       169 passed, 169 total
Snapshots:   0 total
Time:        18.077 s
Ran all test suites matching /src\/screens\/reminders|src\/__tests__\/reminder-swipe-actions-canvas-fidelity.test.ts/i.
```

169 = P + 7 pasados, 0 fallidos.

## Anclas finales

Tabla R6 medida con `grep -oF -- "<literal>" … | wc -l`; radio con `grep -oE`; sufijos con `grep -cF`.

```text
<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>: 1 (esperado 1)
{past ? (: 1 (esperado 1)
) : row}: 1 (esperado 1)
${past ? ' opacity-50' : ''}: 1 (esperado 1)
 opacity-50: 1 (esperado 1)
bg-background: 4 (esperado 4)
absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}: 1 (esperado 1)
<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>: 1 (esperado 1)
testID=: 48 (esperado 48)
needsOffscreenAlphaCompositing: 0 (esperado 0)
renderToHardwareTextureAndroid: 0 (esperado 0)
childrenContainerStyle: 0 (esperado 0)
\brounded-22\b: 4 (esperado 4)
style={CONTINUOUS_CORNER}: 8 (esperado 8)
reminders-upcoming-past-canvas-fidelity.test.ts :: (enmendado por #239 R7): 1 (esperado 1)
consistency-classnames.test.ts :: (enmendado por #239 R7): 3 (esperado 3)
design-drift.test.ts :: (enmendado por #239 R7): 1 (esperado 1)
index.test.tsx: contenido anterior intacto; solo describe nuevo al final (imports, mocks y helpers intactos)
```

No hay enmiendas por Regla de cierre. Se conservan los imports, mocks, helpers y el contenido previo de index.test.tsx.

## Verificación final

```sh
bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > /tmp/final-mobile-reminder-swipe-past-row-bleed.log 2>&1
```

Exit 0.

```text
Test Suites: 91 passed, 91 total
Tests:       2031 passed, 2031 total
Snapshots:   0 total
Time:        44.422 s
Ran all test suites matching /src\/screens\/reminders|src\/utils|src\/theme|src\/__tests__|src\/providers|src\/app/i.
```

Sin flakes, SIGKILL ni suites sin ejecutar. 2031 = T0 + 7.

Desde `mobile-pet-tracker/`:

```sh
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-239.log 2>&1; echo $?
```

Salida `0`, log de 0 bytes; router.d.ts no existe y no se eliminó ningún archivo generado.

```sh
bunx expo lint --no-cache > /tmp/lint-239.log 2>&1 && test ! -s /tmp/lint-239.log && echo LINT_OK
```

Exit 0, salida `LINT_OK`, log de 0 bytes.

## Trazabilidad y cierre acotado

`c9a60dc6 docs(spec): #239 traceability`. Siete filas con test y hash, ninguna fila pendiente. Sin rebase posterior.

Diff medido desde el commit del handoff (`B = 2d10c7f7`, distinto de H0):

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts
mobile-pet-tracker/src/screens/reminders/index.test.tsx
mobile-pet-tracker/src/screens/reminders/index.tsx
specs/mobile-reminder-swipe-past-row-bleed/traceability.md
```

Solo archivos de la lista cerrada. En producción, `grep -c` de líneas eliminadas = **1** y añadidas = **5**. Comparación adicional: el fuente final es exactamente el de B con la sustitución literal de design.md. Imports, copy, colores, panel, franja, contenedor, fecha y untilDay intactos.

`git status --short -- mobile-pet-tracker specs`: salida vacía. `git diff --cached --name-only`: salida vacía. `git diff --check`: exit 0. El reporte queda como artefacto local de progress para el leader y el marcador .done no se commitea.

## Límites y siguiente paso del leader

No hubo condición PARA ni bloqueo. El lector de tablas del script de comprobación se corrigió para ignorar el delimitador final y la cabecera; no cambió código ni cifras esperadas. No hubo discrepancias de P ni de anclas.
No se ejecutó `./init.sh` ni la suite móvil completa fuera del alcance prescrito; los corre el leader. No se abrió ni editó PR, ni se tocaron bookkeeping, otras specs o casillas G2.
G2 sigue a cargo del humano: quedan por observar el gesto y el borde antialiasado de las esquinas, en claro y oscuro, en el dev build de Android.
