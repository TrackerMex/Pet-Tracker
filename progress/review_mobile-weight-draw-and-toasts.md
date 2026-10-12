# review: mobile-weight-draw-and-toasts (#169)
Fecha: 2026-10-12
Veredicto: RECHAZADO

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
