Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh: lo corre el leader.
Primer comando: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma la ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Esto es un ADENDO de reanudación. Sigue vigente TODO lo de `progress/handoff_mobile-home-photo-hero-canvas.md` (reglas críticas, lista cerrada de ficheros, sondas, cuentas de cierre, H0 = `ab33dfd1`). Solo cambia lo que dice este fichero. Léelo entero antes de tocar nada.

Estado validado por el leader (HEAD `98419978`, 2026-10-21): R13, R4, R1, R2, R3, R5, R7, R8 y R6 hechos, un par test-primero por requisito. El leader corrió HERO, PA, PR, SW, el directorio `src/theme/__tests__`, HOME, ALERTS, consistency-classnames, design-drift, hero-header-amendments, home-pingo-phrase, legibility-classnames, tab-headers-canvas y ui-language sobre ese HEAD: 20 suites, 745 tests, todos en verde, snapshot 1/1 intacto. No hay nada que rehacer de lo anterior.

Decisión del leader sobre el bloqueo del supuesto 1 (R14, R16)
- La spec ya prevé la salida: design.md §Supuestos 1 dice «nunca se relaja un `toBeVisible`; se corrige el componente o **el modo de montar el test**». No hay que reescribir la spec para empezar.
- Tu sonda fiel falló porque aserta `toBeVisible` de forma síncrona justo después del `render`. El precedente de la app (alerts/index.test.tsx:312, :339) espera con `await waitFor(() => expect(nodo).toBeVisible())` sobre el mismo nodo que aserta, que es la regla de `docs/conventions.md` §Esperas sobre el árbol renderizado (nunca un contador de mock).
- Paso 1, antes de escribir el rojo de R14: repite la sonda efímera fiel (con `Animated.createAnimatedComponent(View)` y el mock de HERO) en tres variantes, en UNA corrida, y anota las tres líneas `Tests:` en el reporte:
  (a) `await waitFor(() => expect(screen.getByTestId('visibility-probe')).toBeVisible())` con temporizadores reales;
  (b) `jest.useFakeTimers()` + `await act(async () => { jest.advanceTimersByTime(500); })` y luego `toBeVisible()`;
  (c) valor compartido inicial 1 (la rama de reduce motion: `useSharedValue(reduceMotion ? 1 : 0)` con `useReducedMotion` en true) y `toBeVisible()` síncrono tras el `render`.
  Retira la sonda al acabar.
- Si (a) o (b) pasa Y (c) pasa: el supuesto 1 se da por confirmado CON ESPERA. A partir de ahí, los `it` NUEVOS de R14, R16 y R18 que afirmen visibilidad de hijos de una entrada con opacidad inicial 0 usan la variante que pasó (preferida: `await waitFor` sobre el mismo nodo). Con reduce motion encendido la aserción sigue siendo síncrona y el valor inicial del componente es el final (así lo manda R14). Sigue con R14 y el orden de tasks.md.
- Después del verde de R14 (y de nuevo tras R16) corre HERO, HOME, SW y el resto de guardas que listó el leader arriba. Si algún `it` ANTERIOR (p. ej. HOME `pet-chip-pet-1 toBeVisible` en index.test.tsx:202, o el candado `#152 R5`) se pone rojo por la visibilidad inicial, NO lo edites: PARA, deja el diff medido y la lista de `it` afectados en el reporte y avisa. Eso sí obligaría a enmendar la spec.
- Si ni (a) ni (b) pasan, o (c) falla: PARA otra vez, con las tres salidas pegadas. El leader enmendará la spec y reabrirá el gate solo para la enmienda.
- No relajes ningún `toBeVisible` ni lo cambies por `toBeOnTheScreen`. No toques el mock de Reanimated de HERO salvo añadir `withDelay` (R14), como prescribe tasks.md.

Pendientes que dejaste anotados (hazlos antes de R14, en este orden, un commit cada uno)
1. `alerts-canvas-fidelity.test.ts`, fila `tracking-title`: devuelve el comentario histórico `// (enmendado por #176 R8)` a la línea de `'components/empty-state.tsx'` y pon en la línea nueva `'components/pet-hero-header.tsx'` el comentario `// #195 R6`. Es un cambio de test sin comportamiento nuevo: commit `test(mobile): restore empty-state amendment note and tag hero row (R6)`.
2. Planta la mutación de ALERTS que no se ejecutó: borra de la lista la línea `'components/pet-hero-header.tsx'` y comprueba que `alerts-canvas-fidelity.test.ts` se pone rojo (el inventario de `tracking-title` debe nombrar el fichero que usa el token). Corrige tu script para que busque la línea con su comentario final. Revierte y anota el resultado en el reporte. Esta mutación no lleva commit propio (se revierte).

Resto del trabajo: R14, R9, R11 (solo `GlassCircle` y su test GC), R10, R11 (resto), R12, R15, R16, R17, R18, R19, R20, en ese orden y con la misma disciplina (test rojo con commit propio antes de la producción, mutaciones de tasks.md, `Tests:` de cada paso). Cierre completo del handoff original: `bun run test` completo, typecheck con `test ! -e .expo/types/router.d.ts` antes, lint con log, `graphify update .`, re-medir las cuentas base + delta, y la lista de ficheros desde H0 contra la lista cerrada.

Reporte y cierre
- Sigue en `progress/impl_mobile-home-photo-hero-canvas.md`: añade, no reescribas lo ya registrado. Al terminar R1 a R20 quita la línea «Estado: PARADO …» y sustituye su bloque «Bloqueo obligatorio» por un resumen de cómo se resolvió (tres líneas `Tests:` de la sonda y la variante adoptada).
- Mantén el commit final `docs(home): …` con `traceability.md` y el reporte. El `docs(home)` de `98419978` fue parcial; el final es otro commit.
- Crea `progress/impl_mobile-home-photo-hero-canvas.done` (una línea con la ruta del reporte) SOLO cuando R1 a R20 estén en verde y el cierre completo hecho. Si vuelves a parar a medias, no lo crees.
- Sigue sin ser tuyo: progress/current.md, history.md, STATUS.md, el campo `status` de feature_list.json, la PR y R21.
