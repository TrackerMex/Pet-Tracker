---
feature: "mobile-reminder-swipe-past-row-bleed"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-reminder-swipe-past-row-bleed]] (#239)

> Disciplina TDD. Cada tarea corresponde a requisitos de [[requirements]] y
> tiene siempre los mismos tres sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`; los comandos se lanzan desde `mobile-pet-tracker/`.
>
> - **Commits test-primero** (C4 de `CHECKPOINTS.md`): un commit rojo que solo
>   lleva tests, después el commit verde con la implementación mínima y, si
>   hace falta, uno de refactor. Mensajes en inglés, literales de este
>   documento. El móvil no tiene `prettier`.
> - **Orden.** Las tareas van en el orden de este documento.
> - **`./init.sh` no lo lanza Codex**; lo corre el leader.
> - **Skills.** Antes de la primera tarea, carga las de [[design]] §Skills (el
>   leader da los nombres de Codex en el handoff).
> - **Sin dependencias nuevas.** No se toca `package.json`, `bun.lock` ni
>   `app.json`.
> - **Solo un fichero de producción**: `screens/reminders/index.tsx`, y en él
>   solo el hijo del `ReanimatedSwipeable` ([[design]] §Código objetivo). El
>   formato de fecha y `untilDay` son de #240: no se tocan.

## T0 — Línea base (antes de cualquier test nuevo)

- [ ] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  si faltan `node_modules`. **No** lanzar `./init.sh`.
- [ ] (2) Medir cada ancla de [[requirements]] §Evidencia (columna «Hoy»).
  Son **ocurrencias**: `grep -oF -- "<literal>" screens/reminders/index.tsx | wc -l`,
  o `grep -oE -- '\brounded-22\b'` para esa fila. Medir también cada
  localizador de la «Tabla de enmiendas» y cada línea que cambia: todos dan
  `grep -cF` → 1 en su fichero, salvo `+ 1 // #228 R2` en
  `__tests__/consistency-classnames.test.ts`, que da 2 (uno por `it`).
  Anotar en `progress/impl_mobile-reminder-swipe-past-row-bleed.md` cualquier
  discrepancia **antes** de seguir. Si un ancla no da su cifra, se para y se
  reporta.
- [ ] (3) Correr la línea base, sin paréntesis en las rutas:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/t0_mobile-reminder-swipe-past-row-bleed.log 2>&1
  ```

  Si hay un SIGKILL, ese fichero cuenta 0 tests: repetir. Contar los `●` del
  log y anotarlos. Sin commit: el doble de `ReanimatedSwipeable`,
  `mockRealSwipeable` y `HIDDEN` ya están en `screens/reminders/index.test.tsx`.

## R1, R2, R3, R4, R5 y R6 — base de la fila pasada (solo el rojo)

- [ ] (1) Escribir los tests y hacer un solo commit rojo
  `test(mobile): opaque base under past reminder rows (R1, R2, R3, R4, R5, R6)`.
  - En `screens/reminders/index.test.tsx`, al final del fichero (tras el
    `});` que cierra
    `describe('Acciones de deslizar en Recordatorios (#228 R2 a R9)', …)`),
    `describe('Base opaca de la fila pasada (#239 R1 a R5)', …)` con:
    - un `beforeEach` y un `afterEach` copiados literalmente del `describe` de
      #228 (reloj falso en `new Date(2026, 11, 31, 8, 0)`, sesión, `makePet()`
      y los cuatro recordatorios `once`, `series`, `pastonce`, `pastseries`);
    - los cinco `it` de R1 a R5, con sus títulos y aserciones literales de
      [[requirements]]. R1 y R2 recorren sus dos filas con un `for … of`
      dentro del `it`, como `#228 R6`. R5 empieza con
      `mockRealSwipeable = true;`.
  - En `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`, al final
    del fichero, `it('#239 R6: inventario del fuente', …)` con la tabla
    `[literal, cifra]` de R6 y el `readSource` y el `count` que el fichero ya
    tiene, con la misma forma que `#228 R11: inventario del fuente`.
  - Sin `StyleSheet` ni hex en los tests.
  - Rojo esperado: `#239 R1`, `#239 R2`, `#239 R5` y `#239 R6`.
  - **Nacen verdes** `#239 R3` y `#239 R4`, porque son invariantes que la base
    ya cumple. Antes del commit, una sonda por cada uno. Cada sonda se planta
    sola en `screens/reminders/index.tsx`, se corre
    `bun run jest src/screens/reminders`, se anota en el reporte qué `it` sale
    rojo, se deshace con `git checkout -- screens/reminders/index.tsx` y se
    comprueba `git diff --quiet -- screens/reminders/index.tsx`:

    | Sonda | Mutación en `screens/reminders/index.tsx` | Rojo esperado |
    |---|---|---|
    | S1 | el `{row}` que va dentro de `<ReanimatedSwipeable` pasa a `<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>{row}</View>` (base en todas las filas del dueño) | `#239 R3` |
    | S2 | `if (!isOwner) return row;` pasa a `if (!isOwner) return <View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>{row}</View>;` | `#239 R4` |

- [ ] (2) Implementación mínima: ninguna en este commit. Se ponen verdes con
  la tarea siguiente.
- [ ] (3) Sin refactor aquí.

## T2 — la fila pasada va sobre su base (verde)

- [ ] (1) Sin tests nuevos: los rojos de la tarea anterior.
- [ ] (2) Implementación mínima y un solo commit verde
  `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)`.
  - En `screens/reminders/index.tsx`, el cambio de [[design]] §Código
    objetivo, literal: el `{row}` hijo de `<ReanimatedSwipeable` pasa a
    `{past ? (`, la base
    `<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>`
    con `{row}` dentro, su `</View>` y `) : row}`. Nada más cambia en el
    fichero; los imports tampoco.
  - En el mismo commit, los guards que el cambio pone rojos, con los cambios
    literales de [[requirements]] §Tabla de enmiendas (sin sufijo todavía):
    - `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`: la fila
      `style={CONTINUOUS_CORNER}` de `#227 R11: inventario del fuente`;
    - `__tests__/consistency-classnames.test.ts`: la fila de
      `screens/reminders/index.tsx` de `directUses` y, en los `it`
      `fusiona la esquina una vez y la entrega a las dos ramas de Card` y
      `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, la
      línea `+ 1 // #239 R1` justo después de su `+ 1 // #228 R2`. Ese literal
      sale dos veces: se ancla por el `it`;
    - `__tests__/design-drift.test.ts`: la fila `rounded-22` de
      `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`.

  Antes del commit:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/t2_mobile-reminder-swipe-past-row-bleed.log 2>&1
  ```

  Debe salir verde entera: los cuatro `it` rojos de la tarea anterior y todo lo
  demás. Un rojo que caiga bajo la Regla de cierre se enmienda en este commit
  y se anota en el reporte. Cualquier otro rojo se para y se reporta.

  Si R5 no puede montar el `ReanimatedSwipeable` real en jest, se para y se
  reporta con el error. **No** se sustituye por el doble ni se borra el `it`.
- [ ] (3) Sondas, sin commit. Prueban que R1, R2, R5 y R6 muerden sobre el
  código nuevo. Mismo protocolo que S1, con
  `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`:

  | Sonda | Mutación en `screens/reminders/index.tsx` | Rojo esperado (al menos) |
  |---|---|---|
  | S3 | en la base, `bg-background` pasa a `bg-surface` | `#239 R1`, `#239 R5` y `#239 R6` |
  | S4 | se borra `${past ? ' opacity-50' : ''}` de la fila y la base pasa a `className="rounded-22 bg-background opacity-50"` | `#239 R1`, `#239 R5`, `#239 R6` y `#228 R6` |
  | S5 | la franja `<View className={`absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`} />` pasa a `{past ? null : <View className={`absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}`} />}` | `#239 R2` |

  Después, refactor con tests verdes si hace falta (ninguno previsto).

## R7 — los candados enmendados nombran su enmienda

- [ ] (1) Escribir el test que falla para R7
  (`__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` ·
  `#239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`),
  al final del fichero, con la misma forma que el `it` de `#228 R13`.
  - Constante `AMENDED_PAST_ROW_BASE` con estos pares
    `[ruta relativa a src, localizador]`. Cada localizador sale exactamente en
    una línea de su fichero (medido en la base: `grep -cF` → 1 en los cinco):
    - `['__tests__/reminders-upcoming-past-canvas-fidelity.test.ts', '#227 R11: inventario del fuente']`
    - `['__tests__/consistency-classnames.test.ts', '%s importa y aplica sus %i esquinas']`
    - `['__tests__/consistency-classnames.test.ts', 'fusiona la esquina una vez y la entrega a las dos ramas de Card']`
    - `['__tests__/consistency-classnames.test.ts', 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban']`
    - `['__tests__/design-drift.test.ts', 'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto']`
    - más cada `it` que la Regla de cierre haya enmendado en T2, anotado en
      el reporte.
  - Por cada par: las líneas del fichero que contienen el localizador son
    exactamente una, y esa línea contiene `(enmendado por #239 R7)`.
  - Spec: `specs/mobile-reminders-upcoming-past/requirements.md`, leída con
    `readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'requirements.md'), 'utf8')`.
    `count(spec, '## Enmienda \x23239 — Base opaca de la fila pasada')` es 1 y
    el texto casa con `/- \[[ xX]\] Enmienda \x23239 aprobada/`. Esa parte ya
    está verde desde el commit de la spec.
  - Commit rojo `test(mobile): amended locks name the past-row base amendment (R7)`.
- [ ] (2) Implementación mínima que lo pasa
  (`test(mobile): suffix amended locks with #239 R7 (R7)`).
  - Añadir ` (enmendado por #239 R7)` al final del título de cada `it` de
    `AMENDED_PAST_ROW_BASE`, detrás de los sufijos que ya tenga
    (`(enmendado por #227 R13)`, `(enmendado por #228 R13)`).
  - No cambia nada más. `#228 R13` y `#227 R13` siguen verdes: sus
    localizadores son subcadenas de los títulos y sus líneas siguen llevando su
    propio sufijo.
- [ ] (3) Refactor con tests verdes. Corridas finales:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers src/app > ../progress/final_mobile-reminder-swipe-past-row-bleed.log 2>&1
  bunx tsc --noEmit > ../progress/tsc_mobile-reminder-swipe-past-row-bleed.log 2>&1 && test ! -s ../progress/tsc_mobile-reminder-swipe-past-row-bleed.log
  bunx expo lint > ../progress/lint_mobile-reminder-swipe-past-row-bleed.log 2>&1 && test ! -s ../progress/lint_mobile-reminder-swipe-past-row-bleed.log
  ```

  Si `expo lint` falla con «Cannot find module», se repite con `--no-cache`.
  La suite completa la corre el leader con `./init.sh`.

## Notas por tarea

- **Rojos y verdes.**

  | Commit | Qué se pone verde |
  |---|---|
  | T0 | sin commit |
  | `R1, R2, R3, R4, R5, R6` (rojo) | nacen verdes `#239 R3` y `#239 R4` |
  | T2 (verde) | R1, R2, R5 y R6; los guards enmendados siguen verdes |
  | R7 (rojo) | nada nuevo |
  | R7 (verde) | R7 |

  Ningún commit deja rojo un candado **ajeno**.
- **Guards en el commit que los provoca**, nunca en uno aparte posterior: un
  guard rojo entre commits rompe la cadena. El sufijo
  `(enmendado por #239 R7)` se añade solo en el verde de R7.
- **Regla de cierre** ([[requirements]] §Tabla de enmiendas). Un `it` que
  falle solo por los deltas de esta spec se enmienda en el commit que lo
  provoca y se suma a `AMENDED_PAST_ROW_BASE`. Cualquier otro rojo se reporta
  y no se toca.
- **`#239` en el código.** En comentarios de producción, `#239` va siempre
  seguido de ` R<n>` (el cambio de T2 no necesita comentario). En las cadenas
  de test donde `#239` no va seguido de ` R<n>`, se escribe `\x23239`.
- **Ruido de entorno.** Un rojo en Salud `#168 R2`, Inicio `#152 R8` o
  Nutrición `#200 R9`/`R10` es un flake conocido: repetir una vez y, si pasa,
  anotarlo; no enmendar. Un `jest` con timeout bajo carga se mide de nuevo sin
  el flag.
- **Lo que no se toca:**
  - `docs/ui-guidelines.md` y `docs/conventions.md`;
  - `specs/mobile-reminders-upcoming-past/requirements.md`, que ya lleva su
    sección;
  - `i18n/catalog.ts`, `__tests__/ui-copy-table.ts` y `theme/global.css`;
  - en `screens/reminders/index.tsx`: la fila, el contenedor, las props del
    deslizable, `renderRightActions`, el panel, la franja, el formato de fecha
    y `untilDay`;
  - `package.json`, `bun.lock`, `app.json` y `src/app/_layout.tsx`;
  - el backend.
