# review: mobile-weight-draw-and-toasts (#169)
Fecha: 2026-10-12
Veredicto: RECHAZADO (ronda 2, sobre eb9b77f1)

Worktree: /home/claude/sites/Pet-Tracker-wt-169 · branch `feature/169-mobile-weight-draw-and-toasts` · HEAD `dbe183a6` · H0 `fc384b44`

Resumen: el código cumple la spec y todas las ramas que pide el leader están candadas: R11 por rama, reduce motion de R3, color y tono por signo, cruce de mes y año, y el reinicio del timer de R12. Rechazo por tres huecos, y los tres nacen en la spec, no en lo que hizo Codex:

- **E1**: la columna «Test» de la trazabilidad sigue en «pendiente».
- **E2**: el continuo de R1 y R2 solo se muestrea en sus extremos.
- **E3**: la tabla cerrada de R5 no distingue entre elegir por posición y elegir por valor.

R14, la prueba de humo humana, sigue pendiente. Eso es lo esperado.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `grep -c '"status": "in_progress"' feature_list.json` da 1, y es la #169.
- [x] progress/current.md actualizado: tiene la sección #169 con las 4 PARADAS y sus reanudaciones, las medidas de cierre de Codex y los choques conocidos con #167 y #170 al mergear main.

## Checklist C3 — Arquitectura (móvil)
- [x] `src/utils/monthly-weight-delta.ts` es una función pura. No importa React ni la API.
- [x] `weight-chart.tsx` es solo presentación. El componente interno no exportado `WeightChartPlot` aporta la semántica de remontaje de R4.
- [x] La pantalla consume el hook de datos existente. No hay llamadas de red nuevas.
- [x] Sin dependencias nuevas: el diff `89fe2009..HEAD` de `package.json`, `bun.lock` y `src/theme/motion.ts` sale vacío.

## Checklist C4 — TDD
- [x] Cada R1–R13 tiene un `describe('#169 R<n>: …')`:
  - R1–R4 en `src/components/__tests__/weight-chart.test.tsx`;
  - R5 en `src/utils/monthly-weight-delta.test.ts`;
  - R9 en `src/providers/__tests__/language-provider.test.tsx`;
  - R6–R8 y R10–R13 en `src/screens/weight-log/index.test.tsx`.
- [x] El historial va con el test primero. Cada `test(mobile)` precede a su `feat(mobile)` y solo toca tests, y cada `feat` solo toca producción. Hay dos excepciones, las dos autorizadas:
  - `b294c719` cambia también el selector de R7, como autoriza la enmienda T7 (2);
  - `9c9c9382` cambia también `specs/mobile-ui-language/design.md` §2.24, como prescribe R9.
- [x] R4 y R11 nacen verdes. Reproduje sus sondas de forma independiente; la tabla está abajo.
- [ ] Los candados de R1, R2 y R5 dejan pasar mutaciones que violan el requisito. Ver E2 y E3.

## Checklist C5 — Trazabilidad
- [ ] traceability.md sin filas «pendiente»: **falla**. La columna «Test (archivo::nombre)» dice `pendiente` en R1–R13 (ver E1). R14 puede seguir pendiente hasta la firma humana.
- [x] Los commits siguen el formato `test|feat|refactor(mobile): <desc> (#169 R<n>)`. Los 25 hashes de la columna «Commit» son ancestros de HEAD (`git merge-base --is-ancestor`, todos ok).

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada (2026-10-11). No se ha modificado después de H0. La casilla de R14 sigue sin marcar, como corresponde.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente. El cambio del selector de R7 a `/^weight-row-weight-\d+$/` es una adaptación autorizada, no un huérfano.

## Checklist C8 — Carta de UI (docs/ui-guidelines.md)
- [x] Sin hex, sin clases arbitrarias `-[`, sin `StyleSheet` ni `elevation` en `weight-chart.tsx` ni en `weight-log/index.tsx`. Los `style=` son solo `TABULAR_NUMS` y `CONTINUOUS_CORNER`.
- [x] Los colores salen de tokens y de `useThemeColors(['success','danger','muted'])`. El «green» que vio S11 viene del doble de `use-theme-colors` del test, no de un literal de producción.
- [x] El háptico sigue la tabla de §Animación:
  - usa `notificationAsync(Success)` en la rama ok;
  - se dispara en el mismo handler que `setToastVisible(true)`;
  - suena una vez por alta: `grep -cF 'Haptics.notificationAsync('` da 1;
  - nunca es el único feedback, porque lo acompaña el toast.
- [x] Reduce motion se respeta:
  - en la gráfica, por R3, con la sonda propia en rojo;
  - en el toast, porque R13 usa FadeIn/FadeOut sin `ReduceMotion.Never` y el prop renderizado sale con `reduceMotionV: "system"`.
- [x] El copy no lleva emoji ni exclamación: «Anotado. Ya lo puse en la gráfica.» y «{{value}} este mes».
- [x] Los anclas de cierre de tasks.md dan lo esperado:
  - `health` en el diff: vacío;
  - `<Button` = 3;
  - `<Pressable` = 0;
  - `border-b-4` = 1, igual que en H0.

## Sondas de mutación propias

Todas las corrí con `FORCE_COLOR=0 bunx jest --runTestsByPath <fichero>` en primer plano. Cada sonda se revirtió con `git checkout HEAD -- <ruta>`, y después `git diff --cached --quiet && git diff --quiet` dio limpio en todos los casos.

| Sonda | Mutación | Resultado |
|---|---|---|
| R11-a | `unauthorized`: tras `await signOut()`, `setToastVisible(true)` y el háptico | rojo, solo la fila `unauthorized` (toast no nulo) |
| R11-b | Solo el háptico en `forbidden`, en `unauthorized` (tras el await) y en `catch` | rojo en esas 3 filas y en ninguna otra (3 failed, 5 passed) |
| R3 | `useSharedValue(0)`, que ignora reduce motion | rojo: `sale completa sin llamar a withTiming` |
| R4a | `entries` en las dependencias del efecto | rojo: `R4a` (1 failed, 14 passed) |
| R7/R8 (+) | `color: 'danger'` → `'success'` en la rama > 0 | rojo: `fila w-up` y `rama > 0` |
| R7/R8 (0) | `variation > 0` → `>= 0` | rojo: `fila w-flat` y `rama = 0` |
| R7/R8 icono | `TrendUp` → `TrendDown` en la rama > 0 | rojo: `fila w-up` y `rama > 0` |
| R7/R8 (−) | color y clase de fila de la rama < 0 a danger | rojo: `fila w-down` y `rama < 0` |
| R12 | Quitar el `clearTimeout` de la rama ok | rojo: `otra alta reinicia la cuenta y vibra otra vez` |
| R5 año | Comparar solo `MM-DD` (`slice(5)`) | rojo: filas 1, 4 y 11 |
| **R1/R2** | `strokeDashoffset: p >= 1 ? 0 : L` y `opacity: p >= 1 ? 1 : 0` | **verde 15/15: E2** |
| **R5 newest** | `newest` = la más pesada de `inMonth` | **verde 11/11: E3** |
| **R5 fallback** | baseline de respaldo = la más ligera de `inMonth` | **verde 11/11: E3** |

Una sonda la descarté por inválida. Mi primera versión de R4a añadía `L` a las dependencias sin mover el efecto, y dio verde. Pero el efecto se declara antes que `const L`, así que con la transpilación de jest `L` llega `undefined` y la dependencia nunca cambia. Codex movió el efecto detrás de `L` para su S4a, que dio rojo. Mi variante con `entries`, también en rojo, confirma que el candado de R4a funciona.

## Observaciones

### E1 — Columna «Test» de la trazabilidad en «pendiente» (bloquea C5)

- **Fichero**: `specs/mobile-weight-draw-and-toasts/traceability.md`, filas R1–R13.
- **Comando**: `grep -n "^| R" specs/mobile-weight-draw-and-toasts/traceability.md` muestra `| R<n> | pendiente | <commits> |` en las 13 filas.
- **Qué falla**: el cierre de tasks.md exige «`traceability.md` sin filas «pendiente», salvo R14».
- **Origen**: no es un fallo de Codex. La spec nació con la columna vacía, y el handoff (alrededor de la línea 952) le dijo a Codex «No toques … la columna de tests». En #166 esa columna venía rellena desde la spec.
- **Corrección mínima**: el leader rellena la columna con `archivo::describe`, sin tocar código:

| Requisito | archivo::describe |
|---|---|
| R1 | `src/components/__tests__/weight-chart.test.tsx::#169 R1: la línea se dibuja al montarse` |
| R2 | `src/components/__tests__/weight-chart.test.tsx::#169 R2: los puntos aparecen con el mismo progreso` |
| R3 | `src/components/__tests__/weight-chart.test.tsx::#169 R3: bajo reduce motion la gráfica sale completa` |
| R4 | `src/components/__tests__/weight-chart.test.tsx::#169 R4: cuándo se vuelve a dibujar` |
| R5 | `src/utils/monthly-weight-delta.test.ts::#169 R5: monthlyWeightDelta` |
| R6 | `src/screens/weight-log/index.test.tsx::#169 R6: resumen del peso en la card de la gráfica` |
| R7 | `src/screens/weight-log/index.test.tsx::#169 R7: tono del delta del mes` |
| R8 | `src/screens/weight-log/index.test.tsx::#169 R8: chip de delta por entrada` |
| R9 | `src/providers/__tests__/language-provider.test.tsx::#169 R9: claves de peso nuevas` |
| R10 | `src/screens/weight-log/index.test.tsx::#169 R10: toast y háptico tras un alta correcta` |
| R11 | `src/screens/weight-log/index.test.tsx::#169 R11: ni toast ni háptico fuera de la rama ok` |
| R12 | `src/screens/weight-log/index.test.tsx::#169 R12: el toast se va solo` |
| R13 | `src/screens/weight-log/index.test.tsx::#169 R13: movimiento del toast` |

  Si E2 y E3 añaden `it` nuevos, sus nombres van en la misma celda.

### E2 — R1 y R2 solo muestrean `p` en 0 y 1: un salto brusco pasa en verde

- **Fichero**: `mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx`. El origen está en tasks.md T1 y T2 y en requirements R1 §«Valores esperados», que solo fijan el primer frame y el final.
- **Sonda**: cambié las dos props animadas de `src/components/weight-chart.tsx`:
  - línea 71: `strokeDashoffset: progress.get() >= 1 ? 0 : L`;
  - línea 73: `opacity: progress.get() >= 1 ? 1 : 0`.

  Con ese cambio la gráfica aparece de golpe al final en vez de dibujarse, y viola `L·(1−p)` y `opacity = p`. Aun así, `bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx` da `Tests: 15 passed, 15 total`. Con `L·(1−p)²` o `opacity = p²` pasaría lo mismo.
- **Corrección mínima**, en la spec y en el test:
  - Añadir a T1 un `it` dentro de `#169 R1` con `mockWithTiming.mockImplementation(() => 0.25)` y la fixture de tres pesos crecientes. Debe aseverar `jestAnimatedProps.value` `toEqual({ strokeDashoffset: expect.closeTo(78.7464, 3) })`, que es 0.75 · 104.9952.
  - Añadir a T2 un `it` dentro de `#169 R2` con el mismo doble, que asevere `toEqual({ opacity: 0.25 })` en `weight-chart-points`.
  - Los dos nacen verdes. Su sonda es la mutación de arriba, que debe ponerlos en rojo por aserción: 2 failed.

### E3 — La tabla cerrada de R5 no distingue entre posición y valor

- **Fichero**: `mobile-pet-tracker/src/utils/monthly-weight-delta.test.ts`. El origen está en tasks.md T5, la tabla cerrada de 11 filas.
- **Qué falla**: R5 prescribe una selección por posición:
  - paso 3: `newest = inMonth[0]`;
  - paso 4: el respaldo es «la última de `inMonth`».

  Pero en todas las filas con dos o más entradas en el mes, la más nueva es también la más pesada (filas 2, 6 y 10). Además, la única fila con respaldo dentro del mes (la 2) tiene la última entrada igual a la más ligera.
- **Sondas**, sobre `src/utils/monthly-weight-delta.ts`, cada una por separado:
  - `const newest = inMonth.reduce((a, b) => (b.weightKg > a.weightKg ? b : a))` da `11 passed`;
  - `?? inMonth.reduce((a, b) => (b.weightKg < a.weightKg ? b : a))` da `11 passed`.
- **Corrección mínima**: añadir a T5 y al `it.each` una fila 12, con el peso bajando dentro del mes y sin entradas del mes anterior:
  `[12, '2027-01-05', [w('2027-01-04', 12.0), w('2027-01-02', 12.3), w('2027-01-01', 12.1)], -0.1]`

  La comprobé fuera del árbol con un script de bun que importa la función real:
  - función real: `-0.1`;
  - mutante «newest más pesada»: `0.2`;
  - mutante «respaldo más ligero»: `null`.

  Las dos sondas quedan cubiertas y la fila nace verde.

### No bloqueantes
- **R13**: el candado es un literal del fuente más `toBeInstanceOf`. Detecta la regresión realista: encadenar `.reduceMotion(ReduceMotion.Never)` rompe el literal y sube el recuento a 1. Un alias del import lo evadiría. Si se quiere cerrarlo del todo, el prop renderizado ya expone `reduceMotionV: "system"`, `durationV: 250` y `durationV: 150`. No lo exijo.
- **R14**: la prueba de humo humana en el dev build de Android sigue pendiente, con su casilla en requirements.md §Aprobación. Ni siquiera con E1–E3 corregidos se puede marcar la feature como done antes de esa firma.
- **Lista cerrada**: `git diff --name-only fc384b44..HEAD` da los 14 ficheros del impl, más `progress/current.md`, `progress/handoff_…` y `specs/…/tasks.md`, que son commits del leader. Por eso hay que medir contra el HEAD del handoff.

## Output de ./init.sh

No lo ejecuté, por instrucción del leader. La máquina estaba cargada por otras sesiones (init.sh de wt-170 y jest de wt-171). Cito el gate del leader sobre `dbe183a6`, con EXIT=0. El log está en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/1ae97024-4d11-46d9-91a2-b927a28b3390/scratchpad/169-init.log`:

```
219:   Test Suites: 187 passed, 187 total          (backend)
220:   Tests:       1474 passed, 1474 total
32795: Test Suites: 99 passed, 99 total            (mobile)
32796: Tests:       2823 passed, 2823 total
33117: Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
33118: Tests:       8 skipped, 468 passed, 476 total
33141: ✅ Todo verde. Listo para trabajar.
       Features: 154/170 completadas | 15 pendientes
```

El log tiene 0 apariciones de `Failed to run`. El rechazo no se debe al gate, que está verde, sino a E1–E3.

## Barrido de la Enmienda E1

Fecha: 2026-10-12. Sobre `02da4c11`. Medido fuera del árbol, en una copia `git archive HEAD mobile-pet-tracker docs specs` en el scratchpad con un symlink al `node_modules` de wt-169. `design-drift` lee `../docs` y `../specs`, y sin ellos da ENOENT falso. No ejecuté `init.sh` ni la suite entera. `git status --short` de wt-169 estaba limpio al empezar y al terminar solo cambia este fichero.

**Veredicto: insuficiente, con 4 huecos.** Los cierran 3 `it` y 1 fila, todos medidos:

- H1, H2 y H3 están en cláusulas de R1 y R5 que la enmienda dice candar.
- H2b es el espejo de H2 en R3. Es preexistente y la enmienda no lo roza: el leader decide si entra en esta ronda o pasa a deuda.

Fuera de esos huecos, la enmienda está bien: literales, recuentos y razones de fallo cuadran.

### 1. Literales que tasks.md manda sustituir (`grep -cF` sobre `02da4c11`)

Todos dan `1`:

- en `weight-chart.tsx`:
  - `    strokeDashoffset: L * (1 - progress.get()),`
  - `  const pointsProps = useAnimatedProps(() => ({ opacity: progress.get() }));`
  - `({ opacity: progress.get() })`
- en `monthly-weight-delta.ts`:
  - `  const newest = inMonth[0];`
  - `entries.find((entry) => entry.measuredAt < monthStart)`
  - `?? inMonth[inMonth.length - 1];`
  - `  if (baseline === newest) return null;`
  - el bloque de cuatro líneas de M3, entero
- las anclas de inserción:
  - `it('empieza oculta en el primer frame'`
  - `it('con dos pesos iguales la longitud es 100'`
  - `it('empieza con los puntos ocultos en el primer frame'`
  - `it('agrupa un Circle por entrada y ninguno fuera'`
  - las dos `describe` de R1 y R2
  - la fila `[11, …]`

Además:

- `con progreso 0.25` da `0`.
- `WeightEntry` ya está importado como tipo.
- `entries` existe en las `describe` de R1 y R2.

### 2. Recuentos y razones de la enmienda, medidos tal como los escribe tasks.md

| Paso | Esperado | Medido | Razón |
|---|---|---|---|
| Base | 15 y 11 | 15 y 11 | — |
| Verde con los `it` y filas nuevos | 17 y 14 | 17 y 14 | — |
| (1) rojo M1 | 2/15/17 | 2/15/17 | `strokeDashoffset` recibe `104.9952379872535`, `opacity` recibe `0`; los dos por aserción dentro del `waitFor` |
| Sonda M2 | 2/15/17 | 2/15/17 | `59.0598213678301` y `0.0625` |
| (3) rojo M3 | 3/11/14 | 3/11/14 | filas 12, 13 y 14 reciben `0.3`, `0.4` y `null` |
| M3a | 1/13/14 | 1/13/14 | fila 12, recibe `0.2` |
| M3b | 1/13/14 | 1/13/14 | fila 12, recibe `null` |
| M3c | 1/13/14 | 1/13/14 | fila 13, recibe `0.4` |
| M3d | 1/13/14 | 1/13/14 | fila 14, recibe `null` |
| GRAFICA | 142 | 142 | — |
| GUARDAS | 92 | 92 | — |
| BASE (los 9 ficheros del handoff) | 365 | 365 | Test Suites 9 |
| ALL | 99/2828 | no medido (prohibido) | aritmética correcta: 2823 ya incluye las 11 filas del fichero nuevo, así que 2823 + 2 + 3 = 2828; las suites no cambian (99) |

### 3. Barrido por cláusula, con los `it` y filas de la enmienda aplicados

**R1 y R2.**

| Cláusula | Mutación | Resultado |
|---|---|---|
| curva `L·(1−p)` y `opacity = p` | M1, M2 | rojo |
| `L` es la suma de los segmentos | H1 (cuerda) | verde, **hueco** |
| `L` es la suma de los segmentos | H1b ((n−1)·primer segmento) | verde, **hueco** |
| `p` parte de 0 | H2 (`useSharedValue(1)`) | verde, **hueco** |

Lo demás ya lo cubren los `it` existentes:

- una sola `withTiming` con `MOTION_FILL_TIMING` por identidad;
- `strokeDasharray = [L, L]`;
- el área quieta;
- el grupo `weight-chart-points` con un `Circle` por entrada;
- un segundo shared value para los puntos: necesita una segunda `withTiming` o rompe el `it` de 0.25.

**R3.** `p` arranca en 1: la mutación H2b sale verde y es **hueco**.

**R5**, mutaciones medidas sobre las 14 filas:

| Mutación | Resultado | Filas que fallan |
|---|---|---|
| filtro `>` en vez de `>=` | rojo | 9 y 12 |
| `monthStart` sacado de `entries[0]` | rojo | 4 y 11 |
| `newest` por fecha con empate al último | rojo | 10 y 14 |
| base con `findLast` | rojo | 1 y 13 |
| base = la más ligera anterior al mes | rojo | 1 |
| respaldo `inMonth[1]` | rojo | 3 y 12 |
| respaldo = la más pesada del mes | rojo | 2, 12 y 14 |
| respaldo = `newest` | rojo | 2, 12 y 14 |
| paso 5 por peso | rojo | 8 |
| sin paso 5 | rojo | 3 |
| `\|\| null` (el 0 pasa a null) | rojo | 8 |
| signo invertido | rojo | 9 filas |
| `trunc` | rojo | 9, 12, 13 y 14 |
| `floor` | rojo | 7, 9, 13 y 14 |
| `ceil` | rojo | 1, 2, 10 y 12 |
| sin redondeo | rojo | 8 filas |
| `Math.round(… * 10) / 10` (H3) | verde, **hueco** | — |
| `Number((…).toFixed(1))` (H3) | verde, **hueco** | — |

Descartadas por equivalentes:

- `startsWith(todayIso.slice(0, 7))`: medida, verde. Con datos de la API, que nunca tienen fechas futuras, es idéntica.
- `newest = entries[0]`: medida, verde. `inMonth` es un prefijo de `entries` ordenado.
- `Math.round(… * 1000) / 1000`: medida, verde. `weight_kg` es `numeric(5,2)`, así que con entradas de 2 decimales coincide con el redondeo a 2.
- Construir `monthStart` con `Date`: la spec prescribe la operación de cadena literal, y el resultado dependería de la TZ de jest.

### 4. Huecos, cada uno con su cierre medido

Cada cierre es verde sobre la producción de `02da4c11` y rojo **por aserción** con su mutación, sin ningún otro `it` rojo.

**H1 (R1, «L es la suma de las longitudes de sus segmentos»).** La fixture de tres pesos es colineal con segmentos iguales: `0,36 50,20 100,4`. Con ella, la cuerda y `(n−1)·segmento` también dan `2·√2756`, y la de dos pesos iguales da `100` con cualquiera de las dos.

Mutaciones literales que salen verdes con 17/17, sustituyendo el bloque `const L = chartPoints.slice(1).reduce(…, 0);`:

- `const L = Math.hypot(chartPoints[chartPoints.length - 1].x - chartPoints[0].x, chartPoints[chartPoints.length - 1].y - chartPoints[0].y);`
- `const L = (chartPoints.length - 1) * Math.hypot(chartPoints[1].x - chartPoints[0].x, chartPoints[1].y - chartPoints[0].y);`

Se cierra con un `it` nuevo en la `describe` de R1, antes de `it('con dos pesos iguales la longitud es 100'`. Los puntos son `0,36 50,4 100,20` y `L = √3524 + √2756 = 111.86090731…`. La cuerda daría `101.2719` y `2·primer segmento` daría `118.7266`.

```tsx
  it('con tres pesos no alineados la longitud es la suma de los dos segmentos', async () => {
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 12, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-20' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray).toEqual([
      expect.closeTo(111.8609, 3),
      expect.closeTo(111.8609, 3),
    ]);
  });
```

Medido: con las dos mutaciones, `1 failed, 19 passed, 20 total`, y solo cae este `it`.

**H2 (R1 y R2, «p parte de 0»).** `it('empieza oculta en el primer frame')` hace que el doble devuelva `0`, así que impone el valor que espera: no «deja p en su origen» como dice R1. Con `  const progress = useSharedValue(reducedMotion ? 1 : 0);` pasando a `  const progress = useSharedValue(1);`, todo sigue verde con 17/17. En producción la línea nunca se dibuja, porque anima de 1 a 1.

Se cierra con un `it` nuevo en la `describe` de R1 que usa un doble de `withTiming` que de verdad deja `p` en su origen: una animación que termina en su valor de partida.

```tsx
  it('p parte de 0: con una animación que no avanza, la línea y los puntos siguen ocultos', async () => {
    mockWithTiming.mockImplementation(() => ({
      onStart: (animation: { current?: number }, value: number) => {
        animation.current = value;
      },
      onFrame: () => true,
      current: undefined,
    }) as unknown as number);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(104.9952, 3) }),
    );
    expect(screen.getByTestId('weight-chart-points').props.jestAnimatedProps?.value)
      .toEqual({ opacity: 0 });
  });
```

Medido: con H2, `1 failed, 19 passed, 20 total`, y recibe `strokeDashoffset: 0`. Vigila cualquier origen distinto de 0, no solo el 1, y cubre también la opacidad de R2.

**H2b (R3, «arrancar p en 1»; preexistente, no lo roza la enmienda).** Mutación literal, en dos sustituciones:

- `  const progress = useSharedValue(reducedMotion ? 1 : 0);` pasa a `  const progress = useSharedValue(0);`
- `    if (!reducedMotion) progress.set(withTiming(1, MOTION_FILL_TIMING));` pasa a `    progress.set(reducedMotion ? 1 : withTiming(1, MOTION_FILL_TIMING));`

Sale verde con 17/17. En producción, bajo reduce motion, el primer frame pinta la línea oculta y los puntos a 0, y salta a completa tras el efecto. Eso incumple «desde el primer frame». RNTL vacía los efectos dentro de `render`, así que ningún `it` actual puede ver ese frame.

Se cierra en dos pasos:

1. Añadir un espía de paso a `useSharedValue` en el doble de Reanimated. Solo registra y devuelve el real.

   ```tsx
   const mockUseSharedValue = jest.fn();

   jest.mock('react-native-reanimated', () => {
     const actual = jest.requireActual<typeof import('react-native-reanimated')>(
       'react-native-reanimated',
     );
     return {
       ...actual,
       __esModule: true,
       useReducedMotion: () => mockUseReducedMotion(),
       withTiming: (value: number, config: unknown) => mockWithTiming(value, config),
       useSharedValue: (initial: number) => {
         mockUseSharedValue(initial);
         return actual.useSharedValue(initial);
       },
     };
   });
   ```

2. Añadir un `it` nuevo al final de la `describe` de R3:

   ```tsx
     it('p arranca en 1 bajo reduce motion', async () => {
       mockUseReducedMotion.mockReturnValue(true);
       await render(
         <WeightChart entries={[
           makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-21' }),
           makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-20' }),
         ]} />,
         { wrapper: WeightChartWrapper },
       );

       expect(mockUseSharedValue).toHaveBeenCalledWith(1);
     });
   ```

Medido: con H2b, `1 failed, 19 passed, 20 total`, con `Expected: 1`.

Los otros que llaman a `useSharedValue` bajo el wrapper son el `ToastProvider` de heroui-native, con `{}` y `0`: lo medí con la traza de pila. Por eso:

- la aserción con `1` no es tautológica hoy, pero lo sería si un proveedor empezase a llamar con `1`;
- **no** se puede usar `toHaveBeenCalledWith(0)` para R1, porque el `0` del `ToastProvider` lo haría tautológico.

Para R1, el cierre bueno es el de H2.

**H3 (R5, paso 6, «redondeo a 2 decimales»).** Todas las filas esperan como mucho 1 decimal.

Mutaciones literales que salen verdes con 14/14, sobre `  return Math.round((newest.weightKg - baseline.weightKg) * 100) / 100;`:

- `  return Math.round((newest.weightKg - baseline.weightKg) * 10) / 10;`
- `  return Number((newest.weightKg - baseline.weightKg).toFixed(1));`

El efecto es visible: `weight_kg` es `numeric(5,2)` y `fmtVariation` pinta el valor crudo. Así, `+0.04 kg este mes` en `text-danger` pasaría a `0 kg este mes` en `text-muted`, la rama de R7 para 0.

Se cierra con una fila nueva tras la 14:

```ts
    [15, '2027-01-05', [w('2027-01-04', 12.04), w('2026-12-31', 12.0)], 0.04],
```

Medido: verde sobre la producción. Con las dos mutaciones, `1 failed, 14 passed, 15 total`: la fila 15 espera `0.04` y recibe `0`.

### 5. Recuentos con los cierres añadidos

Medidos en la copia, con los tres `it`, el espía y la fila:

| Medida | Resultado |
|---|---|
| weight-chart | 20 |
| monthly | 15 |
| GRAFICA | 145 |
| GUARDAS | 92 |
| BASE | 368 (aritmética: 365 + 3) |
| ALL | 99/2832 (aritmética: 2828 + 3 + 1) |
| `tsc --noEmit` | exit=0 |
| `eslint --no-cache` de los dos ficheros de test | exit=0, salida vacía |

Con los cierres, los rojos y las sondas de tasks.md cambian así:

| Paso | Ahora |
|---|---|
| (1) M1 | `2 failed, 18 passed, 20 total`, los mismos dos `it` |
| Sonda M2 | `2 failed, 18 passed, 20 total`, los mismos dos `it` |
| (3) M3 | `3 failed, 12 passed, 15 total`, filas 12-14; la fila 15 sigue verde con M3 |
| M3a-M3d | `1 failed, 14 passed, 15 total` cada una, con la misma fila |

Ningún `it` nuevo cae con M1, M2 ni M3. El rojo que vigila cada cierre es su propia mutación: H1 o H1b, H2, H2b y H3. Se versiona en su commit rojo (C4, quinto punto).

## Ronda 2 — Enmienda E1 (sobre eb9b77f1)

Fecha: 2026-10-13. HEAD `eb9b77f1` (`git rev-parse --short HEAD`), igual a `origin/feature/169-mobile-weight-draw-and-toasts` (diff vacío). H0 `fc384b44`. Punta de Codex de la ronda 1: `f314978d`.

### Resumen

**Veredicto de la ronda 2: RECHAZADO.** Queda un bloqueante, **R2-E1**.

R1 dice `strokeDashoffset = L · (1 − p)`, con `L` igual a la suma de los segmentos. Ningún `it` lo ancla con una fixture no colineal. Si el desplazamiento usa la cuerda en vez de `L`, todo sigue verde: weight-chart sale 20/20 y GRAFICA 145/145.

El hueco es mío, de la ronda 1. El cierre de H1 que propuse solo candaba `strokeDasharray`. La enmienda lo copió literalmente y Codex la ejecutó tal cual. Ni la spec ni Codex tienen culpa, pero el candado de R1 sigue incompleto.

Lo demás está cerrado:

- E1, E2, E3, H1, H2, H2b y H3 tienen cada uno su candado, y cae exactamente el `it` o la fila que prevé tasks.md.
- La producción es idéntica a `f314978d`.
- El historial C4 es correcto.
- La lista cerrada tiene 14 ficheros.
- La deriva contra origin está vacía.
- init.sh está verde sobre `eb9b77f1`.

### Checklist C2 — Estado coherente
- [x] Solo #169 está `in_progress` en `feature_list.json`.
- [x] `progress/current.md` está actualizado a la Enmienda E1.

### Checklist C3 — Arquitectura (móvil)
- [x] Sin cambios respecto a la ronda 1. La producción es idéntica a `f314978d`: `git diff --quiet f314978d HEAD -- mobile-pet-tracker/src/components/weight-chart.tsx mobile-pet-tracker/src/utils/monthly-weight-delta.ts` da 0.

### Checklist C4 — TDD
- [x] Los 6 commits de código de la enmienda están en pares rojo → verde: `ab183a46 → cbbe7986` (R1, R2), `cf038d68 → 59cef5a9` (R3) y `feee3406 → 0697b117` (R5).
- [x] Cada rojo versiona el test junto a su mutación de producción, literalmente como la prescribe tasks.md (C4, quinto punto). Ningún rojo cae por TypeError, ReferenceError ni SyntaxError.
- [x] Cada verde toca solo producción y deja el fichero idéntico a `f314978d`: `git diff --quiet f314978d <verde> -- <fichero>` da 0 en `cbbe7986`, `59cef5a9` y `0697b117`. La base `222e7370` tiene `mobile-pet-tracker/` idéntico a `f314978d`.
- [x] Todo `it` y toda fila nueva nombra su R-id (`describe('#169 R1…')`, `#169 R2`, `#169 R3`, `#169 R5`).
- [ ] **Candado de R1 incompleto: `strokeDashoffset` con `L` no colineal (R2-E1, bloqueante).**

### Checklist C5 — Trazabilidad
- [x] Las filas R1–R13 tienen su test. Solo R14 dice «pendiente»: es humano, ver más abajo.
- [x] Los hashes y mensajes de las filas R1, R2, R3 y R5 coinciden con `git log`. Los mensajes siguen el formato `test|feat(mobile): … (#169 R<n>)`.
- [ ] Al cerrar R2-E1, la fila R1 tendrá que sumar el par nuevo y la sonda X3.

### Checklist C6 — Spec aprobada
- [x] `status: approved`, con la casilla original y la de la Enmienda E1 marcadas (2026-10-12, vía Notion).
- [ ] La casilla R14 sigue en `[ ]`. Es un gate humano y no bloquea este veredicto.

### Checklist C7 — Sin código huérfano
- [x] N/A. La enmienda no reemplaza nada.

### Checklist C8 — Carta de UI
- [x] Sin cambios respecto a la ronda 1, porque la producción es idéntica.

### Lista cerrada y deriva

- `git diff --name-only fc384b44 HEAD`: 19 ficheros. Excluyendo `feature_list.json`, `progress/current.md`, el handoff, `requirements.md`, `design.md`, `tasks.md` y este review, quedan **14**, que coinciden con la lista cerrada.
- `f314978d..HEAD` en código solo toca `weight-chart.test.tsx` y `monthly-weight-delta.test.ts` (87+/6−), igual que tasks.md §Enmienda E1.
- `git diff origin/feature/169-mobile-weight-draw-and-toasts HEAD` está vacío, con HEAD en `eb9b77f1`.

### Sondas

Cada sonda planta la mutación en el worktree, corre `FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath <fichero>` y revierte con `git checkout HEAD --`. Después de cada una, `git diff --quiet -- mobile-pet-tracker && git diff --cached --quiet` da 0.

#### Rojos versionados (producción del commit rojo con los tests de HEAD)

| Rojo | Recuento | Caen |
|---|---|---|
| `ab183a46` (weight-chart.tsx) | 4 failed, 16 passed, 20 total | R1 `con progreso 0.25 el desplazamiento es tres cuartos de L`, R1 `con tres pesos no alineados la longitud es la suma de los dos segmentos`, R1 `p parte de 0: …`, R2 `con progreso 0.25 la opacidad de los puntos es 0.25` |
| `cf038d68` (weight-chart.tsx) | 1 failed, 19 passed, 20 total | R3 `p arranca en 1 bajo reduce motion` |
| `feee3406` (monthly-weight-delta.ts) | 4 failed, 11 passed, 15 total | filas 12, 13, 14 y 15 |

#### weight-chart.tsx (`src/components/__tests__/weight-chart.test.tsx`, 20 its en verde)

| Sonda | Mutación | Recuento | Cae |
|---|---|---|---|
| M1 | `strokeDashoffset: progress.get() >= 1 ? 0 : L` y `opacity: progress.get() >= 1 ? 1 : 0` | 2 failed / 20 | R1 `con progreso 0.25 …`, R2 `con progreso 0.25 …` |
| M2 | `L * (1 - progress.get()) ** 2` y `opacity: progress.get() ** 2` | 2 failed / 20 | los mismos dos |
| H1 | `const L = Math.hypot(último − primero)` (cuerda) | 1 failed / 20 | R1 `con tres pesos no alineados la longitud es la suma …` |
| H1b | `const L = (n − 1) · primer segmento` | 1 failed / 20 | el mismo |
| H2 | `useSharedValue(1)` | 1 failed / 20 | R1 `p parte de 0: …` |
| H2b | `useSharedValue(0)` y `progress.set(reducedMotion ? 1 : withTiming(…))` | 1 failed / 20 | R3 `p arranca en 1 bajo reduce motion` |
| X1 | `useSharedValue(reducedMotion ? 1 : 0.5)` | 1 failed / 20 | R1 `p parte de 0: …` |
| X2 | puntos sobre un segundo shared value con su propio `withTiming` | 4 failed / 20 | R1 `dibuja la línea de tres pesos …`, R4a, R4b, R4c (dos llamadas a `withTiming`) |
| X4 | `strokeDasharray={[cuerda, L]}` | 1 failed / 20 | R1 `con tres pesos no alineados la longitud es la suma …` |
| **X3** | **`strokeDashoffset: cuerda * (1 - progress.get())`** | **20 passed / 20 (dos veces)** | **ninguno. También verde en GRAFICA (`weight-chart.test.tsx`, `health/index.test.tsx` y `weight-log/index.test.tsx`): 145/145** |

#### monthly-weight-delta.ts (`src/utils/monthly-weight-delta.test.ts`, 15 filas en verde)

| Sonda | Mutación | Recuento | Cae (esperado / recibido) |
|---|---|---|---|
| M3a | `newest` = el de más peso del mes | 1 failed / 15 | fila 12 (−0.1 / 0.2) |
| M3b | respaldo = el de menos peso del mes | 1 failed / 15 | fila 12 (−0.1 / null) |
| M3c | base = el de más peso antes del mes | 1 failed / 15 | fila 13 (0.6 / 0.4) |
| M3d | `baseline.measuredAt === newest.measuredAt` | 1 failed / 15 | fila 14 (0.1 / null) |
| H3 | `Math.round(… * 10) / 10` | 1 failed / 15 | fila 15 (0.04 / 0) |
| H3b | `Number((…).toFixed(1))` | 1 failed / 15 | fila 15 (0.04 / 0) |
| X5 | `Math.trunc` en vez de `Math.round` | 5 failed / 15 | filas 9, 12, 13, 14 y 15 |
| X6 | respaldo `inMonth[1]` | 2 failed / 15 | fila 3 (TypeError: no hay `inMonth[1]`) y fila 12 por valor |
| X7 | `findLast` en vez de `find` | 2 failed / 15 | filas 1 y 13 |
| X8 | filtro `> monthStart` (estricto) | 2 failed / 15 | filas 9 y 12 |
| X9 | `… \|\| null` (0 pasa a null) | 1 failed / 15 | fila 8 (0 / null) |
| X10 | sin el paso 5 (`baseline === newest`) | 1 failed / 15 | fila 3 (null / 0) |
| X11 | paso 5 comparando pesos | 1 failed / 15 | fila 8 (0 / null) |
| X12 | `monthStart = todayIso.slice(0, 4) + '-01-01'` (inicio de año) | **15 passed / 15** | ninguno en la tabla. En `weight-log/index.test.tsx` cae `#169 R6 … en Pacific/Kiritimati pinta el peso actual y el delta del día civil` (1 failed, 57 passed, 58 total). Sin bloqueo, ver más abajo |

#### Barrido de R1 por atributo y propiedad

| Atributo | Suma de segmentos (no colineal) | Origen `p = 0` | Intermedio `p = 0.25` | Final |
|---|---|---|---|---|
| `strokeDasharray[0]` y `[1]` | `con tres pesos no alineados la longitud es la suma …` (H1, H1b y X4 caen; el `toEqual` asevera los dos elementos) | N/A (estático) | N/A | N/A |
| `strokeDashoffset` | **ninguno: X3 en verde (R2-E1)**. `dibuja la línea de tres pesos …` usa la fixture colineal `0,36 50,20 100,4`, ciega a la cuerda | `p parte de 0` (H2 y X1 caen) | `con progreso 0.25 …` (M1 y M2 caen) | `its` de la ronda 1 |
| `opacity` de los puntos (R2) | N/A | `p parte de 0` | R2 `con progreso 0.25 …` | `its` de la ronda 1. El mismo shared value lo vigilan R1 y R4 (X2) |
| `p` bajo reduce motion (R3) | N/A | `p arranca en 1 bajo reduce motion` (H2b cae) | N/A | N/A |

R2, R3 y R5 quedan cubiertos cláusula a cláusula según las tablas de arriba. En R5 lo vigilan los pasos 1–6: filtro `>=`, `newest = inMonth[0]`, base con `find` antes del mes, respaldo el más antiguo del mes, `baseline === newest` y redondeo a 2 decimales. X12 sale ciega en la tabla, pero R6 la caza.

### Bloqueante

#### R2-E1 — `strokeDashoffset` de R1 sin candado con `L` no colineal (C4)

Mutación literal, una sustitución en `mobile-pet-tracker/src/components/weight-chart.tsx`:

```tsx
    strokeDashoffset: L * (1 - progress.get()),
```
pasa a
```tsx
    strokeDashoffset: Math.hypot(chartPoints[chartPoints.length - 1].x - chartPoints[0].x, chartPoints[chartPoints.length - 1].y - chartPoints[0].y) * (1 - progress.get()),
```

Medido:

- `weight-chart.test.tsx` da 20 passed, 20 total, dos veces.
- GRAFICA da 145/145.
- Solo `weight-chart.tsx` y su test mencionan `strokeDashoffset`.

Efecto en la app: con pesos no alineados, el primer frame desplaza 101.27 en vez de 111.86. La línea arranca con unas 10.6 unidades ya visibles y nunca termina oculta en el origen, que es lo que R1 exige («Primer frame: `strokeDashoffset = L`»).

Cierre medido: un `it` nuevo en `describe('#169 R1: la línea se dibuja al montarse')`, insertado antes de `  it('con dos pesos iguales la longitud es 100', async () => {`. Es la fixture de H1 (puntos `0,36 50,4 100,20`, `L = √3524 + √2756 = 111.86090731…`) aseverada sobre la prop animada.

```tsx
  it('con tres pesos no alineados el primer frame desplaza la suma de los dos segmentos', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 12, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-20' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(111.8609, 3) }),
    );
  });
```

Medido sobre `eb9b77f1` con el `it` añadido:

- Verde: `21 passed, 21 total`.
- Con X3: `1 failed, 20 passed, 21 total`. Solo cae este `it`, que recibe `"strokeDashoffset": 101.27191120937731`.
- Con X3 de nuevo, sin el `it`: 20/20. Confirma que el rojo viene del `it`.

El doble `() => 0` solo fija `p`. El origen ya lo vigila `p parte de 0` (H2), así que este `it` no tiene que probarlo.

Sin medir:

- H1 y H1b contra el `it` nuevo. Por cálculo, recibirían 101.27 y 118.73 y caerían.
- `tsc` y `eslint` del `it`. La pausa de máquina los impide. Quien lo implemente debe pasarlos en la cadena del handoff.

Para C4, el commit rojo de este cierre debe versionar X3 como su mutación de producción. El verde debe dejar `weight-chart.tsx` idéntico a `f314978d`.

### No bloqueantes

- **X12 (R5, inicio de mes frente a inicio de año).** Todas las filas de R5 tienen hoy en enero de 2027, así que la tabla no distingue `-MM-01` de `-01-01`. R6 lo caza en weight-log (`Pacific/Kiritimati`, 1 failed / 58), así que la cláusula no queda ciega en el suite. Si se quiere cerrar en la propia tabla, añadir tras la fila 15:
  `    [16, '2026-05-13', [w('2026-05-10', 12.4), w('2026-04-30', 12.0), w('2026-02-01', 10.0)], 0.4],`
  Medido: con la fila, 16 passed. Con inicio de año o con `slice(0, 6)`, 1 failed y cae la fila 16, que recibe 2.4.
- **R14 (humano, pendiente).** La casilla sigue en `[ ]` y la fila de traceability dice «pendiente». No bloquea este veredicto, pero la feature no puede pasar a `done` hasta que el humano la cierre.
- **Trazabilidad.** La fila R1 debe sumar el par rojo → verde del cierre de R2-E1 y la sonda X3.

### Output de ./init.sh

Lo corrió el leader con permiso del humano sobre `eb9b77f1` (`init-169-r2.head`). Log en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/1ae97024-4d11-46d9-91a2-b927a28b3390/scratchpad/init-169-r2.log`, de 33289 líneas.

```
219:   Test Suites: 187 passed, 187 total
220:   Tests:       1474 passed, 1474 total
32935: A worker process has failed to exit gracefully and has been force exited. … (preexistente desde main)
32937: Test Suites: 99 passed, 99 total
32938: Tests:       2832 passed, 2832 total
33259: Test Suites: 3 skipped, 30 passed, 30 of 33 total
33260: Tests:       8 skipped, 468 passed, 476 total
33283: ✅ Todo verde. Listo para trabajar.
```

En el log no hay `Failed to run`, ni líneas `FAIL`, ni recuentos `failed`. Móvil cuadra con 2823 de la ronda 1 + 5 its + 4 filas = 2832.
