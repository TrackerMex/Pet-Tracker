# Implementación #195 — mobile-home-photo-hero-canvas

- Inicio: 2026-10-21; ruta confirmada `/home/claude/sites/Pet-Tracker-wt-195`; branch `feature/195-mobile-home-photo-hero-canvas`.
- H0: `ab33dfd1`. Spec y enmienda aprobadas, D1–D5 firmadas; R21 pendiente del humano.
- Se sigue el handoff específico: no init, no PR, no cambios de estado ni arnés; no dependencias ni regeneración del entorno.
- T0: todas las anclas coinciden; archivos nuevos y `.expo/types/router.d.ts` ausentes. Diff móvil/docs desde H0 limpio.
- Skills cargadas: ponytail, appllama-app-design-skill, animate-expo, building-native-ui, expo-tailwind-setup. Nombres inexistentes según handoff: expo-overview, expo-animation, expo-router, expo-design-system. MCP Appllama no disponible; no se invoca. La carta/spec prevalecen.
- Documentación SDK 57 consultada: https://docs.expo.dev/versions/v57.0.0/ y https://docs.expo.dev/versions/v57.0.0/sdk/image/ .
- Búsqueda de TestId por regex realizada antes de crear nodos. Además de las tres rutas del handoff, Home tiene `/^pet-chip-/` (escenario sin conexión online).

## Ejecución

- R13: rojo `Tests: 2 failed, 24 passed, 26 total`; verde `Tests: 26 passed, 26 total`. Inventario ampliado de 31 a 35 exportaciones, valores literales independientes.
- R4 verifica la segunda capa respecto al contenedor de medios existente; R1 nombra el frame y R6 cierra el orden completo de capas con/sin slot (el frame no existe antes de R1).
- R4: rojo `Tests: 3 failed, 108 passed, 111 total`; verde `Tests: 111 passed, 111 total`. Mutación dark .14 → .41: roja y revertida (1 test rojo).
- R1: rojo `Tests: 6 failed, 36 passed, 42 total`; verde `Tests: 42 passed, 42 total`. Mutación alto 331: 6 rojos, revertida.
- Primera sonda de supuesto 1 (insuficiente; NO confirma el supuesto, ver bloqueo): sonda efímera con valor compartido inicial 0, withTiming mockeado y `toBeVisible` del hijo; `Tests: 42 skipped, 1 passed, 43 total`. Sonda retirada tras medir.
- R2: rojo `Tests: 4 failed, 49 passed, 53 total`; verde `Tests: 53 passed, 53 total`, snapshot 1/1 intacto. Mutación fundido 500 → 400: HERO y MOT rojos, revertida.
- Ajustes de los tests R2: expo-image normaliza `top` a `{ top: 0, left: '50%' }`; la ausencia conserva su centro nativo. Easing es una fábrica, no una función (commit de test correctivo antes del commit de producción). Se usa el AnimatedView ya existente para conservar el doble de HERO. La sonda efímera usó requireMock directamente; no se cambió el mock default.
- Error de búsqueda inocuo: rutas `build/` de RNTL y `utils/resolveContentPosition.ts` no existen en estas versiones; se localizaron `lib/` y `expo-image/src/utils.ts`, sin modificar archivos.
- R3: rojo `Tests: 2 failed, 46 passed, 48 total`; verde `Tests: 48 passed, 48 total`. Mutaciones: D9 → 99 (2 rojos), parada superior → transparent (3 rojos), transparent solo en comentario (48 verdes); todas revertidas.
- R5: rojo `Tests: 3 failed, 47 passed, 50 total`; verde `Tests: 50 passed, 50 total`.
- R7: rojo filtrado `Tests: 7 failed, 288 skipped, 16 passed, 311 total`; verde HERO + HOME completos `Tests: 311 passed, 311 total`. Mutación accent → success: HERO y HOME rojos, revertida. La expectativa de clase del it E2 de reduce motion también pasa a accent en R7 para mantener verde; el bloque se sustituye en R8 según spec.
- R8: sustituye 6 tests E2 por 5 de HERO y añade 1 de PR; rojo `Tests: 3 failed, 52 passed, 55 total`; verde `Tests: 55 passed, 55 total`. Mutaciones anillo con reduce motion y sin prop timing: 1 rojo cada una, revertidas. HERO usa doble portador de props de PingRing; PR usa Reanimated real con temporizadores falsos y comprueba default 2400 y override 1600 en ambas propiedades.
- R6: rojo `Tests: 4 failed, 78 passed, 82 total`; verde `Tests: 82 passed, 82 total`. Mutación quitar tracking-title del nombre: 2 rojos, revertida. La mutación de ALERTS NO se ejecutó: el script buscó una línea sin su comentario final y su aserción de búsqueda abortó antes de escribir. No se cuenta como sonda superada. No había it anteriores con las otras tres cadenas tipográficas del pie (búsqueda por contenido realizada).


## Bloqueos resueltos — A1, A2, A3 y adendo 5

El supuesto 1 quedó refutado con tres sondas fieles:

- `Tests: 1 failed, 1 total` — (a) temporizadores reales y waitFor sobre el nodo visible.
- `Tests: 1 failed, 1 total` — (b) temporizadores falsos y act de 500 ms.
- `Tests: 1 passed, 1 total` — (c) reduce motion inicia en uno y visibilidad síncrona.

A1 firmada resolvió el mecanismo de Jest con presencia sobre nodos animados, movimiento real en HEROMOT/BP y visibilidad síncrona con reduce motion. A2 firmada separó el contador de fundido por duración 500 sin tocar las aserciones posteriores; mutación f roja. A3 firmada enmendó el gap del scroll en R6 sin modificar home-states; mutaciones a/b/c rojas. El adendo 5 validó el paso (1b): cuatro rojos medidos dos veces por el leader, quinto rojo PingoFloat no reproducido. En esta reanudación #190 R5 pasa en todas las corridas HOME completas y en la suite completa.

Se conserva íntegra la evidencia inicial en el archivo histórico al final de este reporte y las secciones de cada reanudación. El estado vigente es el cierre automático R1–R20; R21 corresponde al humano.

## Commits y líneas Tests medidas

Las líneas se midieron con el árbol del paso antes de registrar el commit. El commit de test y el de producción permanecen separados. Los commits rojos conservan fallos intencionales; HEAD deja el último código verde verificado por HERO + ALERTS.

| Commit | Mensaje | Tests medidos |
|---|---|---|
| `34b89cb6` | test(mobile): lock hero motion constants (R13) | `Tests: 2 failed, 24 passed, 26 total` |
| `2908e173` | feat(mobile): add hero motion constants (R13) | `Tests: 26 passed, 26 total` |
| `8f57a8cd` | test(mobile): lock photo dim tokens and overlay (R4) | `Tests: 3 failed, 108 passed, 111 total` |
| `f308ea70` | feat(mobile): add theme-aware photo dim layer (R4) | `Tests: 111 passed, 111 total` |
| `10e1c025` | test(mobile): lock hero frame dimensions (R1) | `Tests: 6 failed, 36 passed, 42 total` |
| `bd03f556` | feat(mobile): contain hero in a 330 point frame (R1) | `Tests: 42 passed, 42 total` |
| `78d8e11a` | test(mobile): lock aligned hero photo and identity fade (R2) | `Tests: 4 failed, 49 passed, 53 total` |
| `ff5170b5` | test(mobile): compare Reanimated easing factory (R2) | `Tests: corrección del test; verde conjunto 53/53 con producción candidata, sin aislamiento de este commit` |
| `626ebc69` | feat(mobile): align hero photo and fade on pet identity (R2) | `Tests: 53 passed, 53 total; snapshot 1/1` |
| `6b1f535f` | test(mobile): lock hero gradient colors and stops (R3) | `Tests: 2 failed, 46 passed, 48 total` |
| `964aac85` | feat(mobile): match canvas gradient stops and scrim (R3) | `Tests: 48 passed, 48 total` |
| `6849a2d3` | test(mobile): lock floating hero slot (R5) | `Tests: 3 failed, 47 passed, 50 total` |
| `016e4749` | feat(mobile): float hero slot above photo (R5) | `Tests: 50 passed, 50 total` |
| `7c41427a` | test(mobile): lock hero pill geometry and accent tone (R7) | `Tests: 7 failed, 288 skipped, 16 passed, 311 total` |
| `c9e578a9` | feat(mobile): derive hero pill accent tone and spacing (R7) | `Tests: 311 passed, 311 total` |
| `892a6013` | test(mobile): lock hero ping and configurable timing (R8) | `Tests: 3 failed, 52 passed, 55 total` |
| `2b71c252` | feat(mobile): use configurable ping ring for online status (R8) | `Tests: 55 passed, 55 total` |
| `61d1645d` | test(mobile): lock caption typography and layer order (R6) | `Tests: 4 failed, 78 passed, 82 total` |
| `e17c14b3` | feat(mobile): place hero caption over the gradient (R6) | `Tests: 82 passed, 82 total` |


## Candados enmendados

| Candado | Antes → después | R |
|---|---|---|
| MOT inventario | 31 → 35 claves; cuatro literales nuevos | R13 |
| HERO dimensiones y #127 R2 | 260/64 → 330/160/130; skeleton 330 | R1 |
| HERO foto con caché | misma fuente + posición nativa top normalizada | R2 |
| HERO degradados | dos bandas de 64 → scrim 130 y degradado inferior 160 con paradas exactas; lista de hex6 añade scrim | R3 |
| HERO banda del slot y safe area | fondo/padding → absoluto sin fondo, top 52; sin slot tampoco scrim | R5 |
| HERO #73 R8 y HOME #73 R9 | success → accent, superficie secondary, tamaños y texto nuevos | R7 |
| HERO #73 E2 | pulso y constante → cinco tests del anillo, sin export antiguo; PR timing opcional | R8 |
| HERO banda inferior, ALERTS tracking-title | opaca → absoluta sin fondo; hero entra tras empty-state | R6 |

No se editaron consistency-classnames, hero-header-amendments, tab-headers-canvas, legibility-classnames, design-drift, ui-language, home-pingo-phrase, ui-copy-table ni el mapa. No se ejecutaron todos esos candados al parar; no se afirma que estén verificados.

## Pendientes y límites de la verificación

- R6: falta plantar la mutación de ALERTS; corregir la aserción del script para respetar el comentario inline. También quedó el comentario histórico `enmendado por #176 R8` asociado a la fila nueva por la inserción: devolverlo a empty-state al reanudar (no cambia el inventario).
- R14: bloqueo anterior. R9, R10, R11 (ambas tandas), R12, R15, R16, R17, R18, R19 y R20 sin iniciar. No se crearon GlassCircle, BubblePop ni GUARD.
- No se corrió el test móvil completo, typecheck, lint, mapa, conjunto final de guardas ni graphify; no se ejecutó init ni se abrió PR según handoff.
- No se alteraron STATUS, feature_list, progress/current, history, handoff ni las dependencias. El cierre completo y las cuentas base + delta quedan pendientes; solo se midió T0.
- No se crea `.done`: el watcher anuncia «Implementación lista» y solicita reviewer, lo que no corresponde a este estado parcial y bloqueado.
- La primera sonda de visibilidad insuficiente y el test correctivo de easing se documentan arriba; no se ocultan como verificación completada.

## R1–R20 a test y commit

| R | Tests | Commit producción / situación |
|---|---|---|
| R1 | HERO `#195 R1: frame de 330 y raíz estable` | bd03f556 |
| R2 | HERO `#195 R2: foto alineada arriba y fundido por identidad`; PA `#195 R2: alineación opcional de la foto` | 626ebc69 |
| R3 | HERO `#195 R3: degradados exactos sobre la fotografía` | 964aac85 |
| R4 | CSS `#195 R4: scrim y oscurecimiento de foto`; HERO `#195 R4: capa de oscurecimiento` | f308ea70 |
| R5 | HERO `#195 R5: fila superior flotante` | 016e4749 |
| R6 | HERO `#195 R6: pie y orden exacto de capas`; ALERTS inventario tracking-title | e17c14b3, falta una sonda |
| R7 | HERO `#195 R7: píldora del hero sin cambiar los tonos del mapa`; HOME #73 R9 | c9e578a9 |
| R8 | HERO `#195 R8: anillo de estado sustituye el pulso de opacidad`; PR `#195 R8: timing opcional del anillo compartido` | 2b71c252 |
| R9 | SW previsto | pendiente |
| R10 | SW previsto | pendiente |
| R11 | GC, HOME, GUARD previstos | pendiente |
| R12 | HOME, GUARD previstos | pendiente |
| R13 | MOT `#195 R13: constantes propias del hero` | 2908e173 |
| R14 | sonda efímera, no test de aceptación | bloqueado |
| R15 | HOME previsto | pendiente |
| R16 | BP, HOME previstos | pendiente |
| R17 | GUARD previsto | pendiente |
| R18 | HERO, HOME previstos | pendiente |
| R19 | GUARD previsto | pendiente |
| R20 | GUARD y carta previstos | pendiente |

## R21 — lista para el humano, tras completar R1–R20

- [ ] Dev build Android: claro, oscuro y reduce motion; foto oscura, foto clara y mascota sin foto.
- [ ] Nombre de 25 caracteres: 30/34 sin recortes ni choque con fila superior.
- [ ] Degradado inferior sin banda gris; recorte alineado arriba; sin foto, blobatar centrado con bandas previstas.
- [ ] Vidrio plano legible sobre ambas fotos, punto online y alerta bien colocados y sin recorte (supuesto 2).
- [ ] El punto online no se recorta por el scroll horizontal con margen negativo y padding (supuesto 3).
- [ ] Raza, cifra y etiqueta sin recortes, tipografía efectiva e interlineados correctos (supuesto 4).
- [ ] Fundido sincronizado con la imagen decodificada, sin aparición tardía (supuesto 5).
- [ ] Ritmo de rise, fade, ping, pop y float; con reduce motion, hero y burbuja finales desde el primer render y sin anillo.
- [ ] Safe area/barra de estado, scroll del hero y barra flotante inferior.
- [ ] El humano firma la casilla R21 o documenta su omisión; ningún agente la marca.

## Archivos desde H0 (móvil/docs)

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/components/__tests__/pet-avatar.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
mobile-pet-tracker/src/components/__tests__/ping-ring.test.tsx
mobile-pet-tracker/src/components/pet-avatar.tsx
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/components/ping-ring.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/global.css
mobile-pet-tracker/src/theme/motion.ts
```

Todos pertenecen a la lista cerrada del handoff. No hay cambios de producción sin commit ni sondas plantadas restantes.

## Reanudación — 2026-10-21

- Primer comando ejecutado: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Salida confirmada: `/home/claude/sites/Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`. H0 sigue en `ab33dfd1`; HEAD inicial `99c8f330` (adendo del leader). Árbol inicial limpio.
- Leídos completos ambos handoffs, requirements/design/tasks y el reporte anterior. No se ejecuta init ni se tocan los ficheros de cierre del leader.
- Skills cargadas de nuevo: ponytail, appllama-app-design-skill, animate-expo, building-native-ui y expo-tailwind-setup. Inexistentes según catálogo/handoff: expo-overview, expo-animation, expo-router, expo-design-system; MCP Appllama no disponible. Prevalecen carta y spec.
- Pendiente ALERTS 1: restaurado el comentario histórico de empty-state y etiquetada la fila del hero con `#195 R6`. `Tests: 27 passed, 27 total`. Commit indicado en la tabla de reanudación.


### R6 — pendientes de ALERTS resueltos

- `bc14d41b` — `test(mobile): restore empty-state amendment note and tag hero row (R6)`. Antes del commit: `Tests: 27 passed, 27 total`.
- Mutación obligatoria: se quitó exactamente la línea `        'components/pet-hero-header.tsx', // #195 R6` del inventario de `tracking-title`. La búsqueda incluyó el comentario final; una aserción confirmó una única coincidencia antes de escribir. Jest arrancó y terminó con exit 1:

```text
FAIL src/__tests__/alerts-canvas-fidelity.test.ts
#174 R12: inventarios › limita tracking-title a su inventario de producción
Expected: inventario sin components/pet-hero-header.tsx
Received: inventario con components/pet-hero-header.tsx
Tests: 1 failed, 26 passed, 27 total
```

- Mutación revertida en `finally`, sin commit propio. El diff actual del test coincide únicamente con la corrección de comentarios solicitada. Se cierra la sonda pendiente de R6; `e17c14b3` sigue siendo su commit de producción.

### PARADA de reanudación — supuesto 1 sigue fallando con espera

**Estado vigente: PARADO antes del rojo de R14, según la condición explícita del adendo. R14–R20 no completados; no apto para merge.** No se modifican el bloqueo histórico ni sus resultados: este apartado añade la medición nueva y prevalece como estado actual.

Se plantaron las tres variantes de la sonda fiel en HERO y se ejecutaron **juntas en una única invocación de Jest**. Nodo creado con `Animated.createAnimatedComponent(View)` desde el default del mock de HERO; `View` y React reales; `useSharedValue`, `useAnimatedStyle`, `withTiming` y `useReducedMotion` del mismo mock. No se cambió el mock de Reanimated, ningún `it` previo ni ninguna aserción de visibilidad.

Comando, desde `mobile-pet-tracker/` (ambos pgrep previos vacíos):

```bash
bunx jest src/components/__tests__/pet-hero-header.test.tsx --testTimeout=30000 --silent --json -t '#195 R14: sonda fiel de visibilidad'
```

Las tres líneas `Tests:` siguientes son el desglose **por variante obtenido de `assertionResults` del JSON de esa misma corrida**, no tres invocaciones separadas:

```text
Tests: 1 failed, 1 total — (a) temporizadores reales y waitFor sobre el nodo visible
Tests: 1 failed, 1 total — (b) temporizadores falsos y act de 500 ms
Tests: 1 passed, 1 total — (c) reduce motion inicia en uno y visibilidad síncrona
```

Salida de Jest (errores sin escapes de color; los bloques repetidos de Babel se omiten):

```text
FAIL src/components/__tests__/pet-hero-header.test.tsx (5.698 s)
● #195 R14: sonda fiel de visibilidad en tres variantes › (a) temporizadores reales y waitFor sobre el nodo visible
expect(instance).toBeVisible()
Received instance is not visible:
  <Text testID="visibility-probe">hijo</Text>
> await waitFor(() => expect(screen.getByTestId('visibility-probe')).toBeVisible());

● #195 R14: sonda fiel de visibilidad en tres variantes › (b) temporizadores falsos y act de 500 ms
expect(instance).toBeVisible()
Received instance is not visible:
  <Text testID="visibility-probe">hijo</Text>
> expect(screen.getByTestId('visibility-probe')).toBeVisible();

Test Suites: 1 failed, 1 total
Tests: 2 failed, 55 skipped, 1 passed, 58 total
Snapshots: 0 total
Time: 5.926 s
PROBE exit: 1
```

Reproductor efímero completo (añadido al final de HERO y retirado en `finally` tras obtener el resultado):

```tsx
describe('#195 R14: sonda fiel de visibilidad en tres variantes', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const m = jest.requireMock('react-native-reanimated');
  const { act, waitFor } = jest.requireActual<typeof import('@testing-library/react-native')>('@testing-library/react-native');
  const ProbeView = m.default.createAnimatedComponent(View);
  function Probe() {
    const reduceMotion = m.useReducedMotion();
    const opacity = m.useSharedValue(reduceMotion ? 1 : 0);
    React.useEffect(() => {
      if (!reduceMotion) opacity.set(m.withTiming(1));
    }, [opacity, reduceMotion]);
    const style = m.useAnimatedStyle(() => ({ opacity: opacity.get() }));
    return <ProbeView style={style}><Text testID="visibility-probe">hijo</Text></ProbeView>;
  }
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });
  it('(a) temporizadores reales y waitFor sobre el nodo visible', async () => {
    mockUseReducedMotion.mockReturnValue(false);
    await renderHero(<Probe />);
    await waitFor(() => expect(screen.getByTestId('visibility-probe')).toBeVisible());
  });
  it('(b) temporizadores falsos y act de 500 ms', async () => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
    await renderHero(<Probe />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(screen.getByTestId('visibility-probe')).toBeVisible();
  });
  it('(c) reduce motion inicia en uno y visibilidad síncrona', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderHero(<Probe />);
    expect(screen.getByTestId('visibility-probe')).toBeVisible();
  });
});
```

No se adopta ninguna variante para R14/R16/R18: ni (a) ni (b) pasa. Se cumple literalmente la parada del adendo: «Si ni (a) ni (b) pasan, o (c) falla: PARA otra vez, con las tres salidas pegadas». Corresponde al leader enmendar la spec y reabrir su gate. No se altera la spec, no se relaja `toBeVisible`, no se añade todavía `withDelay` ni se intenta otro montaje.

### Diff medido y alcance al parar

Respecto a HEAD de reanudación `99c8f330`, el único cambio móvil/docs es:

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts | 4 ++--
1 file changed, 2 insertions(+), 2 deletions(-)

-        'components/empty-state.tsx',
-        'components/pet-hero-header.tsx', // (enmendado por #176 R8)
+        'components/empty-state.tsx', // (enmendado por #176 R8)
+        'components/pet-hero-header.tsx', // #195 R6
```

`git diff --exit-code -- mobile-pet-tracker/ specs/ docs/` termina con exit 0 tras retirar las sondas. La lista de archivos móvil/docs desde H0 `ab33dfd1` sigue siendo la registrada en «Archivos desde H0»: 12 ficheros, todos dentro de la lista cerrada. No hay cambio de producción en esta reanudación. No se midieron las cuentas de cierre porque se activó la parada antes de R14.

Se conserva el reporte anterior y su tabla como historia. Actualización de trazabilidad de la reanudación: R6 tiene ya ambas sondas rojas y revertidas; R14 sigue sin test de aceptación ni implementación. R9–R12, R15–R20 siguen pendientes. No se toca `traceability.md`: está reservado para el commit final tras R1–R20 completos.

No se ejecutaron init, test móvil completo, typecheck, lint, mapa ni graphify. No se abrió ni editó PR; no se tocaron progress/current.md, history.md, STATUS.md, feature_list.json, handoffs o dependencias. `progress/impl_mobile-home-photo-hero-canvas.done` sigue ausente y no se crea al parar a medias.

### Verificación tras retirar sondas

```text
PASS src/__tests__/alerts-canvas-fidelity.test.ts
PASS src/components/__tests__/pet-hero-header.test.tsx
Test Suites: 2 passed, 2 total
Tests: 82 passed, 82 total
Snapshots: 0 total
Time: 3.463 s, estimated 6 s
```

Comando: `bunx jest 'src/components/__tests__/pet-hero-header.test.tsx|src/__tests__/alerts-canvas-fidelity.test.ts' --testTimeout=30000 --silent`, ambos pgrep previos vacíos, exit 0. Este verde verifica la retirada de las sondas; no confirma el supuesto 1. El commit de documentación de esta parada no es el commit final de R1–R20 y no contiene traceability.

## Reanudación con Enmienda A1 — 2026-10-22

- Primer comando exacto confirmado: `/home/claude/sites/Pet-Tracker-wt-195` y `feature/195-mobile-home-photo-hero-canvas`. HEAD inicial `e0d3ff82`; firma A1 `058c465a`. Leídos enteros los tres handoffs, requirements, design y tasks, en ese orden. No se repiten sondas ni ALERTS resuelto.
- Skills cargadas: ponytail, building-native-ui, expo-tailwind-setup, appllama-app-design-skill y animate-expo (las dos últimas desde `.agents/skills/`). No disponibles según catálogo/handoff: expo-overview, expo-animation, expo-router y expo-design-system. Sin MCP Appllama; la carta y la spec mandan.
- Anclas A1 comprobadas: HERO/HOME `toBeVisible` 9/80; `toBeOnTheScreen` 0/0; sufijos R14/R16 0/0; HOME cadena prohibida 0; HERO withDelay 0; inventario de nodos solo HERO/HOME. Tras enmiendas: sufijos R14 5/6 y HOME `toBeVisible` 73, cadena prohibida 0.
- R14 rojo: HEROMOT monta con Reanimated real y los tres mocks copiados de HERO, sin mocks adicionales. El host del slot aún sin animación aplana a `{ top: 52 }`; falla contra el futuro `{ top: 52, opacity: 0, transform: [{ translateY: 14 }] }`. No se ajusta ningún valor final. Los tests de argumentos, claves animadas y estado final reducido de HERO fallan por ausencia de animación. Las enmiendas de mera presencia nacen verdes; HEROMOT foto también nace verde porque R2 ya implementó ese fundido. Su valor se comprobará con mutación (d).

### R14 — mediciones del rojo y de la candidata

- Rojo inicial: `Tests: 5 failed, 313 passed, 318 total`, suites 2 rojas / 1 verde. Commit `42f108dd` — `test(mobile): lock hero entrances and amended visibility (R14)` (solo HERO, HEROMOT y HOME, `git commit --only`). Los rojos son el estilo futuro de R5, los tres tests nuevos HERO y el test slot/pie de HEROMOT. HOME completo verde; las enmiendas de presencia nacen verdes.
- Candidata: slot y pie con progreso compartido, `withTiming(1, …400)`, un único `withDelay(80, …)` en el pie, sin `entering`. HEROMOT pasa ambos tests: estilos iniciales exactos, valores intermedios de slot a 64 ms, pie aún quieto a 64 ms, finales a 416/496/516 ms. Sin plan B ni margen de 32 ms; ningún valor final cambiado.
- Primera corrida candidata HERO + HEROMOT + HOME: `Tests: 2 failed, 316 passed, 318 total`. HOME `PASS` (26,463 s), incluidas las aserciones conservadas de `pet-hero-media`; ningún it anterior rojo por opacidad inicial. HEROMOT `PASS`.
- Corregidos dos errores en mi test NUEVO, sin tocar tests anteriores: eliminada una aserción adicional de estado final sobre el doble de HERO (leía 0/14); se conserva la comprobación exacta de claves, y los finales se prueban en HEROMOT. El recorrido usaba `findAll`, inexistente en TestInstance de RNTL 14; se sustituye por recorrido recursivo de `children`. Corrida focalizada antes de corregir el recorrido: `Tests: 2 failed, 58 passed, 60 total` (R2 + error de API del test nuevo).
- Tras corregirlos, candidata HERO + HEROMOT: `Tests: 1 failed, 59 passed, 60 total`. Solo falla el it anterior de R2 detallado abajo. Los tres nuevos de HERO y los dos de HEROMOT pasan, incluida visibilidad síncrona con reduce motion. No se cambia ningún valor final ni aserción fuera de los nodos animados.
- Error de invocación inocuo de functions.exec: `SyntaxError: missing ) after argument list`; no arrancó ningún comando ni se tocó ningún fichero. Se corrigió la llamada.

### PARADA — contador global anterior de R2 no contemplado en las enmiendas

**Estado vigente: PARADO en R14; no hay verde de R14 ni implementación completa.** Requirements §Candados dice «Los it que no figuran aquí no se tocan». La tabla A1 autoriza 11 enmiendas, pero no esta aserción de llamadas de R2. No se ha editado ni se omite su comprobación.

Único it anterior afectado en la candidata:

```text
HERO › #195 R2: foto alineada arriba y fundido por identidad
  › funde al llegar la mascota y al cambiar su id, sin repetir por nombre
expect(mockWithTiming).not.toHaveBeenCalled();
Expected number of calls: 0
Received number of calls: 2
1: 1, { duration: 400, easing: …, reduceMotion: system }
2: 1, { duration: 400, easing: …, reduceMotion: system }
```

El test monta `<PetHeroHeader pet={null} />` y observa TODAS las animaciones del hero. R2 exige que la foto no arranque temporizadores con pet=null; R14 añade entradas del slot/pie al montar. El contador global confunde esas entradas de 400 ms con el fundido de la foto de 500 ms. Para conservar R14 no se debe suprimir la entrada ni cambiar valores finales. Hace falta que el leader amplíe explícitamente las enmiendas permitidas para que ese it observe las llamadas del fundido de R2 (p. ej. filtradas por duración 500), conservando sus aserciones de identidad y caché. No se realiza ese cambio sin la autorización de la spec.

Diff exacto de la candidata que produjo el conflicto (se guarda como evidencia y se retira del fichero de producción antes de cerrar):

```diff
diff --git a/mobile-pet-tracker/src/components/pet-hero-header.tsx b/mobile-pet-tracker/src/components/pet-hero-header.tsx
index 8397b321..c7d74c66 100644
--- a/mobile-pet-tracker/src/components/pet-hero-header.tsx
+++ b/mobile-pet-tracker/src/components/pet-hero-header.tsx
@@ -7,11 +7,12 @@ import Animated, {
   useReducedMotion,
   useSharedValue,
   withTiming,
+  withDelay,
 } from 'react-native-reanimated';
 import { useSafeAreaInsets } from 'react-native-safe-area-context';

 import type { PetProfile } from '../api/types';
-import { MOTION_CELEBRATION_EASE_OUT, MOTION_HERO_FADE_MS, MOTION_HERO_PING_MS } from '../theme/motion';
+import { MOTION_CELEBRATION_EASE_OUT, MOTION_CELEBRATION_RISE_OFFSET_Y, MOTION_HERO_CAPTION_DELAY_MS, MOTION_HERO_FADE_MS, MOTION_HERO_PING_MS, MOTION_SURFACE_MS } from '../theme/motion';
 import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../theme/native-styles';
 import { useThemeColors } from '../theme/use-theme-colors';
 import { PetAvatar } from './pet-avatar';
@@ -98,6 +99,31 @@ export function PetHeroHeader({
   const petId = pet?.id;
   const photoOpacity = useSharedValue(reduceMotion || !pet ? 1 : 0);
   const photoStyle = useAnimatedStyle(() => ({ opacity: photoOpacity.get() }));
+  const slotProgress = useSharedValue(reduceMotion ? 1 : 0);
+  const captionProgress = useSharedValue(reduceMotion ? 1 : 0);
+  const slotStyle = useAnimatedStyle(() => ({
+    opacity: slotProgress.get(),
+    transform: [{ translateY: MOTION_CELEBRATION_RISE_OFFSET_Y * (1 - slotProgress.get()) }],
+  }));
+  const captionStyle = useAnimatedStyle(() => ({
+    opacity: captionProgress.get(),
+    transform: [{ translateY: MOTION_CELEBRATION_RISE_OFFSET_Y * (1 - captionProgress.get()) }],
+  }));
+
+  useEffect(() => {
+    if (reduceMotion) {
+      slotProgress.set(1);
+      captionProgress.set(1);
+      return;
+    }
+    const timing = { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_SURFACE_MS };
+    slotProgress.set(withTiming(1, timing));
+    captionProgress.set(withDelay(MOTION_HERO_CAPTION_DELAY_MS, withTiming(1, timing)));
+    return () => {
+      cancelAnimation(slotProgress);
+      cancelAnimation(captionProgress);
+    };
+  }, [captionProgress, reduceMotion, slotProgress]);



@@ -179,18 +205,19 @@ export function PetHeroHeader({
         />

       {children ? (
-        <View
+        <AnimatedView
           testID="pet-hero-slot"
           className="absolute inset-x-4"
-          style={{ top: insets.top + 12 }}
+          style={[{ top: insets.top + 12 }, slotStyle]}
         >
           {children}
-        </View>
+        </AnimatedView>
       ) : null}

-      <View
+      <AnimatedView
         testID="pet-hero-caption"
         className="absolute inset-x-4 bottom-1.5 flex-row items-end justify-between gap-3"
+        style={captionStyle}
       >
         <View className="min-w-0 flex-1 gap-1">
           {pet ? (
@@ -258,7 +285,7 @@ export function PetHeroHeader({
             </Text>
           </View>
         ) : null}
-      </View>
+      </AnimatedView>
       </View>
     </View>
   );
```

### Estado entregado tras la parada de R14

- Candidata de producción retirada mediante restauración del contenido exacto de HEAD, después de guardar arriba el diff medido: no queda cambio sin commit en móvil, specs o docs. El código de producción conserva el último verde previo; HEAD contiene los tests rojos de R14 a propósito.
- Comprobación tras retirar la candidata (HERO + HEROMOT): `Tests: 5 failed, 55 passed, 60 total`, exit 1. R2 vuelve a pasar; quedan exclusivamente los cinco rojos intencionales de R14. Commit correctivo de test `fijado abajo` — `test(mobile): traverse host children for hero entrance guard (R14)`; sin producción ni reporte en ese commit y con `git commit --only`.
- Las mutaciones a–e de R14 no se ejecutaron: no existe aún un verde completo. En particular, NO se afirma que (e) esté validada. No se avanza a R9 ni se cambia otro R.
- No se ejecutan suite completa, tsc, lint, guardas finales, graphify ni cuentas de cierre porque la sesión se detiene en R14. No init, PR, push, merge, rebase ni dependencias nuevas. Sin ficheros fuera de lista cerrada. Reporte añadido sin reescribir lo anterior; traceability reservada para el único commit final `docs(home)` tras completar R1–R20.
- `.done` NO se crea. Este reporte queda modificado sin commit para que el leader revise el bloqueo; no se crea un segundo commit parcial `docs(home)`.

El primer intento de commit correctivo no se ejecutó: `git diff --check` detectó espacios finales en las líneas de contexto del diff pegado a este reporte. Se normalizaron solo esos espacios de la sección nueva y se repite el commit con rutas explícitas.

Commit correctivo confirmado: `25d5f984` — `test(mobile): traverse host children for hero entrance guard (R14)`; `Tests: 5 failed, 55 passed, 60 total` sobre el contenido exacto del commit sin la candidata. No hay commit verde de R14. `42f108dd` es únicamente el primer commit rojo.

## Reanudación con Enmienda A2 — 2026-10-22

- Primer comando ejecutado exactamente como se pidió: ruta `/home/claude/sites/Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`. HEAD inicial `13c32016`; A2 firmada en `ebc372d0`. Árbol inicial limpio.
- Leídos enteros, en orden: los cuatro handoffs, requirements, design, tasks y traceability. Mandan el adendo 3 y las Enmiendas A1/A2 firmadas. No se repiten las sondas ya medidas ni la mutación ALERTS resuelta.
- Skills cargadas: `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`, `animate-expo` (estas dos en `.agents/skills/`) y `ponytail`. No disponibles según catálogo/handoff: `expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`; no se buscan. Sin MCP Appllama. No se modifica la configuración de estilos: carta/spec prevalecen sobre los ejemplos de skills. Smoke Android R21 del humano.
- Todas las anclas del adendo 3 coinciden: HERO/HOME visible 5/73, presencia 5/8, sufijos R14 5/6 y R16 0/0; filtro 500 ausente; HOME cadena prohibida 0; HEROMOT existe, BP ausente; producción sin withDelay/slotProgress/captionProgress. Pgrep de Jest e init vacíos antes de la corrida.
- Paso (1b): solo título y primera aserción del it de R2, con filtro literal `call[1]?.duration === 500`; no se toca ninguna otra línea. Nace verde; también nacieron verdes las enmiendas A1 de mera presencia. Las mutaciones (f) y (e), respectivamente, demostrarán su valor tras el verde.

- Paso (1b), commit `c3c51cd6` — `test(mobile): isolate initial photo fade counter by duration (R14)`. Corrida focalizada: `Tests: 57 skipped, 1 passed, 58 total`, exit 0. Diff exacto: dos líneas sustituidas; sufijos HERO/HOME pasan a 6/6 y filtro a 1. Se reaplica la candidata documentada sin cambios de valores.
- Verde R14: `Tests: 318 passed, 318 total`, HERO + HEROMOT + HOME, 3 suites, exit 0. Las aserciones intactas de R2 `toHaveBeenCalledTimes(1)` tras cambiar id y `not.toHaveBeenCalled()` tras cambiar solo nombre PASAN; el efecto de entrada no se redispara. HEROMOT confirma lo ya medido, sin repetir sondas ni modificar tiempos. Ningún it anterior rojo; `pet-hero-media` conserva su visibilidad en HOME.
- La primera guarda impidió correr Jest mientras había procesos del worktree 189. Se esperó a que ambos pgrep quedaran vacíos; no se ejecutaron corridas concurrentes por nuestra parte.

### R14 — commit verde y mutaciones A2

Commit verde: `80d621e9` — `feat(mobile): animate hero slot and caption on mount (R14)`. Medido antes de commit: `Tests: 318 passed, 318 total`.

Cada mutación se plantó sola, se ejecutaron HERO + HEROMOT completos y se restauró el contenido en `finally`; exit Jest 1 en las seis:

| Mutación | Defecto | It rojo | Tests |
|---|---|---|---|
| a | `slotStyle.opacity` inicial 1, desplazamiento aún 14 | HEROMOT `el slot sube en 400 ms y el pie espera 80 ms antes de subir` (inicio); HERO R5 `usa inset superior más 12 y laterales de 16 sin fondo ni padding` | `Tests: 2 failed, 58 passed, 60 total` |
| b | progreso inicial del slot 0 también con reduce motion | HERO R14 `con reduce motion nace final sin temporizadores y sus descendientes son visibles` (estilo inicial: 0/14 en lugar de 1/0) | `Tests: 1 failed, 59 passed, 60 total` |
| c | retraso del pie 140 ms | HERO R14 `anima el slot sin retraso y el pie con un único retraso de 80 ms`; HEROMOT `el slot sube…` en el final del pie a 496 ms (0.979593/0.285695 en vez de 1/0; el slot llegó a su final) | `Tests: 2 failed, 58 passed, 60 total` |
| d | foto con opacidad inicial 1 ya con mascota | HEROMOT `la foto empieza en cero y termina su fundido a los 516 ms` | `Tests: 1 failed, 59 passed, 60 total` |
| e | `slot-child` vuelve a `toBeVisible()` en R3 | HERO R3 `el slot flota sin fondo ni padding (enmendado por #195 R5) (enmendado por #195 R14)` — `Received instance is not visible` | `Tests: 1 failed, 59 passed, 60 total` |
| f | quitar `!petId` de la guarda del fundido | HERO R2 `funde al llegar la mascota y al cambiar su id, sin repetir por nombre (enmendado por #195 R14)` — filtro recibe 1 llamada `{ duration: 500 }`, espera 0 | `Tests: 1 failed, 59 passed, 60 total` |

HERO R14 de reduce motion pasó en a/c/d/e/f; HEROMOT pasó completo en b/e/f; HERO R14 pasó completo en f. La primera tentativa del script de (e) buscó la línea en todo HERO y encontró dos copias (R3 y R8); abortó su propia aserción antes de escribir o lanzar Jest. Corregido el script acotándolo al título exacto prescrito de R3, sin tocar R8. No es deriva del ancla de la spec.

Mutaciones e/f confirman respectivamente H1 y que el filtro de A2 no está ciego. `git diff` de móvil vacío tras revertir las seis. R14 pasa a verificación agregada antes de iniciar R9.
- R14 tras las seis reversiones, guardas agregadas completas del handoff: `Tests: 750 passed, 750 total`; 21 suites, snapshot 1/1, exit 0. R14 terminado sin refactor adicional. No se cumplen condiciones de parada. Búsqueda de selectores por regex antes del punto de R9: además de SW/food/health aparecen Home (escenario sin online) y pairing (sin selector); no se editan.

### R9 — avatar y punto

- `ba1a0f46` — `test(mobile): lock selected glass avatar and online dot (R9)`: `Tests: 3 failed, 10 passed, 13 total` (clase antigua y punto ausente).
- `a9af1117` — `feat(mobile): add selected glass avatar and online dot (R9)`: `Tests: 13 passed, 13 total`. Cinco tests nuevos; default/avatars intactos, cardinalidad por hijos y decisiones con within.
- Mutación punto también en no seleccionado: rojo en `solo el seleccionado tiene punto cuando selectedOnline es true`, `Tests: 1 failed, 12 passed, 13 total`, exit 1; revertida. Se sigue con R11 solo GC.

### R11 — primera tanda, GlassCircle

- `22fdc49d` — `test(mobile): define flat glass circle behavior (R11)`: rojo por módulo de producción aún inexistente, `Tests: 0 total`, 1 suite fallida.
- Verde GC: `Tests: 2 passed, 2 total`, raíz/receta exactas, accesibilidad, hijo único, ausencia de desenfoque, evento real responderGrant para la opacidad pulsada .8 y opacidad inicial 1. Commit de producción registrado en la tabla final; se continúa con R10 antes de integrar Inicio.

### R10 — fila del selector

- `206a5f50` — `test(mobile): lock glass switcher row and trailing action (R10)`: `Tests: 1 failed, 14 passed, 15 total`, trailing aún ausente.
- Corregido un error de API en el test nuevo: RNTL14 no expone `UNSAFE_getAllByType` en screen; se recorre el ancestro host del mismo row hasta el ScrollView horizontal. `a8bf303b` — `test(mobile): inspect rendered scroll ancestors (R10)`; medido otra vez sin candidata: `Tests: 1 failed, 14 passed, 15 total` (trailing ausente).
- `3ca49df6` — `feat(mobile): render glass switcher row and trailing action (R10)`: `Tests: 17 passed, 17 total` en SW+GC. Default/avatars siguen intactos.
- Mutación Avatar de HeroUI en no seleccionado: SW R10 `conserva orden, cardinalidad, iniciales y selección desde ambos chips` rojo (hijo extra), `Tests: 1 failed, 14 passed, 15 total`, revertida.
- GC verde quedó en `2c19841d` — `feat(mobile): add reusable flat glass circle (R11)`.

### R11 — integración de Inicio

- `d759effe` — `test(mobile): lock home glass selector and add pet action (R11)`: `Tests: 5 failed, 256 skipped, 2 passed, 263 total`. Rojos: tres conexiones aún con selector default y dos inventarios entering aún con Avatar. GUARD copy y acción sin mascotas nacen verdes.
- `7dbcdd48` — `feat(mobile): use glass selector and add pet action on home (R11)`: HOME+SW+GC+GUARD `Tests: 280 passed, 280 total` (4 suites), sin otros it anteriores rojos.
- Mutación duplicar `t('profile.addPet'`: GUARD `resuelve profile.addPet una vez en Inicio` rojo, `Tests: 1 failed, 1 total`, revertida.
- Mutación complementaria de R10 tras R11: Avatar de HeroUI en el seleccionado, HOME ambos inventarios #152 R5 rojos por `pet-avatar-fallback-pet-1`, `Tests: 2 failed, 260 skipped, 262 total`, revertida. Primera tentativa de esta mutación tuvo un recorte regex demasiado amplio y produjo JSX inválido (`Tests: 0 total`); no se cuenta como sonda. Restaurada en finally y repetida con tag acotado a la rama seleccionada glass. Producción sin cambios residuales.

### R12 — campana e indicador

- `dd4583d7` — `test(mobile): lock glass bell and alert indicator geometry (R12)`: `Tests: 7 failed, 258 skipped, 1 passed, 266 total` (clase, tipo raíz, icono/tinta e indicador antiguos).
- `4c9953ab` — `feat(mobile): use glass bell with canvas alert indicator (R12)`: HOME+GC+GUARD `Tests: 268 passed, 268 total`; 3 suites. Pressed #122 R2 intacto pasa. Se mantienen dos hijos de actions, ancla única y rutas sin cast.
- Mutación duplicar el testID de la campana: GUARD `declara home-alerts-bell una sola vez en Inicio` rojo, `Tests: 1 failed, 1 passed, 2 total`, revertida. Primer script usaba un View flex-1 ambiguo y abortó antes de escribir o lanzar Jest; se acotó a home-hero-actions y se midió correctamente.


### R15 — rojo y PARADA obligatoria por otro it anterior

- Primer intento de edición de test R15: la búsqueda global de la expectativa de gap encontró dos copias y abortó antes de escribir. La shell continuó y Jest con el filtro aún inexistente saltó toda la suite: `Tests: 264 skipped, 264 total` (0 suites ejecutadas). NO se cuenta como rojo ni como verificación. Se acotó la edición al título R5 autorizado y se repitió.
- `77da555b` — `test(mobile): lock home hero spacing and scroll layout (R15)`: `Tests: 3 failed, 263 skipped, 266 total` (rojo correcto: expectativa R5 autorizada y dos it nuevos de R15, todos por gap 16 en lugar de 14).
- Candidata mínima R15: una sola línea de `contentContainerStyle`, gap 16 → 14; ni home-content ni home-states cambian su gap interno de 16 ni sus paddings.
- HOME completo con candidata: `Tests: 1 failed, 265 passed, 266 total`, exit 1. Los tres rojos intencionales pasan. Único it anterior afectado, intacto:

```text
R6: home carga pets y selecciona
  › pads the content below the status bar with the top safe-area inset
src/screens/home/index.test.tsx:497
expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({
  gap: 16,
  paddingBottom: 120,
});
Expected gap: 16
Received gap: 14
Tests: 1 failed, 265 passed, 266 total
```

Ese it monta mascotas pendientes. Requirements R15 exige explícitamente gap 14 también en `home-states`, pero §Candados solo autoriza en R15 `R5: Home usa el hero compartido › conserva gap y paddingBottom…`; no autoriza este it R6. La condición del adendo 3 «tras el verde de R14, otro it anterior distinto del de R2 se pone rojo» obliga a parar. No se enmienda R6 ni se introduce un gap condicional que contradiga R15. Se necesita ampliar la enmienda de la spec antes de reanudar.

Diff exacto medido de la candidata R15 (se retira después de guardarlo aquí; no hay commit verde de R15):

```diff
diff --git a/mobile-pet-tracker/src/screens/home/index.tsx b/mobile-pet-tracker/src/screens/home/index.tsx
index 130dac45..8c6da2eb 100644
--- a/mobile-pet-tracker/src/screens/home/index.tsx
+++ b/mobile-pet-tracker/src/screens/home/index.tsx
@@ -341,7 +341,7 @@ export function HomeScreen() {
       className="flex-1 bg-background"
       contentInsetAdjustmentBehavior="automatic"
       contentContainerStyle={{
-        gap: 16,
+        gap: 14,
         paddingBottom: insets.bottom + 96,
       }}
     >
```

### Estado entregado tras la parada en R15

- Candidata R15 retirada después de guardar el diff exacto: producción vuelve al último verde de R12. HEAD `77da555b` conserva los tests rojos de R15 como exige el historial test-primero; no hay commit verde de R15.
- Comprobación de retirada, solo R15 y el it anterior R6: `Tests: 3 failed, 262 skipped, 1 passed, 266 total`, exit 1. El it antiguo `pads the content below the status bar with the top safe-area inset` vuelve a pasar; únicamente quedan los tres rojos intencionales de R15.
- Diff sin commit de móvil/specs/docs: vacío. Único fichero modificado sin commit: este reporte, reservado al leader mientras la spec no permita continuar. `traceability.md` se conserva sin tocar para el commit final autorizado tras R20.
- Inventario `git diff --name-only ab33dfd1..HEAD -- mobile-pet-tracker/ docs/`: 19 ficheros, todos de la lista cerrada (incluye HEROMOT, GC y GUARD; ningún fichero de docs aún). No se tocan arnés, estado, PR, mapas, Perfil, catálogo, dependencias ni lockfile.
- No se ejecutan cierre global, suite móvil completa, typecheck, lint, graphify ni cuentas finales: la parada es obligatoria antes de completar R15. No se ejecutó `./init.sh` en ningún momento; corresponde al leader. Sin push, PR, merge ni rebase. `.done` no existe.
- Siguiente paso requiere enmendar la spec para el it R6 citado y autorización humana. Después: verde R15 y R16–R20, cierre completo y lista de R21 para el humano. Las enmiendas A1/A2 están resueltas por las pruebas y mutaciones de R14; esta parada es una incompatibilidad distinta del inventario de candados de R15.

### Tabla vigente R1–R20 (al parar en R15)

| R | Tests | Commit de producción / estado |
|---|---|---|
| R1 | HERO `#195 R1` | `bd03f556` |
| R2 | PA y HERO `#195 R2`; contador A2 validado por mutación f | `626ebc69`; enmienda test `c3c51cd6` |
| R3 | HERO `#195 R3` | `964aac85` |
| R4 | CSS y HERO `#195 R4` | `f308ea70` |
| R5 | HERO `#195 R5` | `016e4749` |
| R6 | HERO `#195 R6`; inventario tracking-title de ALERTS | `e17c14b3`; nota y mutación ALERTS resueltas en sesión previa |
| R7 | HERO `#195 R7`; HOME `#73 R9` | `c9e578a9` |
| R8 | HERO y PR `#195 R8` | `2b71c252` |
| R9 | SW `#195 R9`: avatar con/sin foto y tres estados selectedOnline | `a9af1117` |
| R10 | SW `#195 R10`: fila, cardinalidad, iniciales, navegación y trailing | `3ca49df6` |
| R11 | GC `#195 R11`; HOME `#195 R11` y `#152 R5`; GUARD `#195 R11` | `2c19841d`, `7dbcdd48` |
| R12 | HOME `#195 R12`, `#78 R10`, `#124 R1`, `#78 R11`; GUARD `#195 R12` | `4c9953ab` |
| R13 | MOT `#195 R13` | `2908e173` |
| R14 | HERO y HEROMOT `#195 R14`; doce enmiendas HERO/HOME | `80d621e9`; mutaciones a–f vistas rojas y revertidas |
| R15 | HOME `#195 R15` y R5 enmendado | Solo rojo `77da555b`; parada por it R6 fuera del inventario |
| R16 | BP y HOME previstos | Pendiente; no iniciado |
| R17 | GUARD contraste previsto | Pendiente; no iniciado |
| R18 | HERO y HOME estados previstos | Pendiente; no iniciado |
| R19 | GUARD grep-clean previsto | Pendiente; no iniciado |
| R20 | GUARD y carta previstos | Pendiente; no iniciado |

Todos los commits de esta reanudación usaron `git commit --only` con rutas explícitas; los nuevos ficheros se añadieron con `git add` explícito. El reporte se amplió sin reescribir la evidencia histórica. No se declaró la feature terminada.

## Reanudación con Enmienda A3 — 2026-10-22

- Primer comando confirmó `/home/claude/sites/Pet-Tracker-wt-195` y `feature/195-mobile-home-photo-hero-canvas`. HEAD inicial `90caad02`, firma A3 `0db0ec01`; árbol inicial limpio. No se ejecuta init.sh.
- Leídos los cinco handoffs enteros y en orden, fila 13 y R15 de requirements, H3 de design y tasks (1b y mutaciones a/b/c). Todas las anclas del adendo 4 coinciden. Feature 195 sigue in_progress; no se modifica el arnés del leader.
- Skills cargadas: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`, `animate-expo`. Las dos de Expo están en el plugin local del catálogo Codex; las de diseño/movimiento en `.agents/skills/`. No disponibles según catálogo/handoff: `expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`; no se buscan. Sin MCP Appllama. Carta/spec prevalecen; smoke R21 del humano. Esperas según conventions §Esperas sobre el árbol renderizado.
- R15 (1b): sustitución acotada al it R6 prescrito, solo título y primer gap 16 a 14. Bloque home-states intacto (24/52/16); se mide HOME completo antes del verde.

### R15 (1b) — rojo A3 y PARADA por cinco fallos en HOME

**Parada de (1b) resuelta por el leader (adendo 5): cuatro rojos correctos medidos dos veces; quinto rojo PingoFloat no reproducido.** Se conserva la evidencia de aquella corrida y se reanuda en el verde R15.

- Se esperó al Jest y después al init.sh del worktree 189; no se lanzó Jest hasta que ambos pgrep prescritos quedaron vacíos. No se interrumpió ningún proceso ajeno.
- Comando: `bunx jest src/screens/home/index.test.tsx --testTimeout=30000` desde mobile-pet-tracker, HOME completo sin filtro. Log: `progress/r15-a3-red-195.log` (ignorado). Exit 1, `Test Suites: 1 failed, 1 total`; **`Tests: 5 failed, 261 passed, 266 total`**, `Snapshots: 0 total`, 42.89 s. No hay suite saltada.
- El it R6 enmendado nace rojo por el motivo correcto: **Expected gap: 14 / Received gap: 16**, index.test.tsx:497. Solo cambian el sufijo del título y el primer gap; su bloque home-states permanece 24/52/16.
- Commit test-primero (1b): `6519704f` — `test(mobile): amend home pending-state scroll spacing (R15)`, con `git commit --only mobile-pet-tracker/src/screens/home/index.test.tsx`. La línea Tests anterior mide el contenido exacto del commit. Producción no tocada, todavía gap 16; `77da555b` no se reescribe.

Los cinco it rojos medidos:

1. `R6: home carga pets y selecciona › pads the content below the status bar with the top safe-area inset (enmendado por #195 R15)` — Expected gap 14, Received gap 16 (línea 497).
2. `R5: Home usa el hero compartido › conserva gap y paddingBottom y saca el padding horizontal a un envoltorio (enmendado por #195 R15)` — Expected gap 14, Received gap 16 (línea 1701).
3. `#190 R5: la pose reutiliza PingoFloat › usa Animated.View y repite solo translateY -10 en tramos de 1500 ms invertidos` — Expected `{"transform":[{"translateY":-10}]}`, Received `{"transform":[{"translateY":0}]}`; falla `toHaveAnimatedStyle(..., { shouldMatchAllProps: true })` en la línea 5767. It anterior intacto; está fuera de las tablas de enmiendas autorizadas.
4. `#195 R15: hueco del hero y contenido que se desplaza › deja el hero primero y conserva el relleno interior y la holgura de la barra` — Expected gap 14, Received gap 16 (línea 5873).
5. `#195 R15: hueco del hero y contenido que se desplaza › aplica también el hueco de 14 a las ramas de estado sin hero` — Expected gap 14, Received gap 16 (línea 5879).

Se cumple literalmente la regla del adendo 4: «Si miden tres o cinco […] PARA y avisa con la lista». El quinto fallo no afirma gap sino el movimiento del PingoFloat anterior. El handoff original menciona un rojo #190 R5 bajo carga durante el cierre, pero su permiso de corrida aislada está acotado al cierre; no se usa para eludir la condición vigente de (1b). No se repite la corrida ni se relaja, omite o modifica ese it. No se atribuye el fallo a una causa no demostrada.

Diff exacto del paso (1b), único cambio móvil de esta reanudación:

```diff
diff --git a/mobile-pet-tracker/src/screens/home/index.test.tsx b/mobile-pet-tracker/src/screens/home/index.test.tsx
index e32bfb4a..659da4f0 100644
--- a/mobile-pet-tracker/src/screens/home/index.test.tsx
+++ b/mobile-pet-tracker/src/screens/home/index.test.tsx
@@ -489,13 +489,13 @@ describe('R6: home carga pets y selecciona', () => {
     expect(screen.getByTestId('home-loading')).toBeVisible();
   });

-  it('pads the content below the status bar with the top safe-area inset', async () => {
+  it('pads the content below the status bar with the top safe-area inset (enmendado por #195 R15)', async () => {
     mockListPets.mockReturnValue(pending<PetsState>());

     await renderHome();

     expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({
-      gap: 16,
+      gap: 14,
       paddingBottom: 120,
     });
     expect(screen.getByTestId('home-states').props.style).toEqual({
```

- Tras (1b), sufijos R15 HERO/HOME 0/2; R14 6/6; visible 5/73; presencia 5/10; contentContainerStyle HOME 4 líneas; filtro duration 500 HERO 1; cadena prohibida HOME 0; hex-like Inicio/pingo-phrase 0/0. No cambia ningún contador fuera de lo previsto.
- Mutaciones R15 (a), (b) y (c) NO ejecutadas: requieren el verde, que no se aplica tras la parada. R16–R20 pendientes, sin ficheros BP ni cambios nuevos en GUARD/carta/traceability.
- No se ejecutan suite móvil completa, typecheck, lint, graphify ni cuentas finales porque no se alcanzó el cierre. No se ejecutó init.sh; no push, PR, merge, rebase, dependencias ni cambios del arnés. Se conserva el reporte añadido para revisión del leader, sin commit docs parcial.
- Siguiente paso: el leader revisa el quinto rojo y determina cómo reabrir la condición de (1b); no se crea .done ni se declara completada la feature.

## Reanudación con adendo 5 — 2026-10-22

- Primer comando: `/home/claude/sites/Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`. Leídos enteros los adendos 5 y 4. El leader valida `6519704f`: dos corridas con cuatro rojos correctos (`Tests: 4 failed, 262 passed, 266 total` cada una); quinto rojo PingoFloat no reproducido. No hay enmienda nueva y el commit se conserva.
- Se mantienen las skills ya cargadas (`ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`, `animate-expo`) y las limitaciones del catálogo registradas en A3. No init.sh; esperas según conventions §Esperas.
- Verde R15: solo gap 16 a 14 del contentContainerStyle, sin condicional por rama; paddings y gaps interiores intactos. Cada corrida Jest va precedida de pgrep en comando propio, con espera de 20 s y límite de 15 min según adendo 5.

- Verde R15: HOME completo, `Tests: 266 passed, 266 total`, exit 0. Los cuatro it de A3 pasan; ningún it anterior rojo. Comando sin filtro y log completo `progress/r15-green-195.log`. Consulta de lectura de `jest.config.js` inexistente produjo ENOENT, sin modificación ni ejecución de tests; no se usa esa ruta.

- Commit verde R15 `2bf5b932` — `feat(mobile): match home hero scroll spacing (R15)`, `Tests: 266 passed, 266 total`. Mutación (a): solo referencia de R6 vuelve a 16, ese it rojo `Expected gap: 16 / Received gap: 14`; `Tests: 1 failed, 265 passed, 266 total`, exit 1. Revertida; resto HOME verde, H3 demostrado.

- Mutación R15 (b): gap del scroll vuelve a 16, exactamente los cuatro it del paso (1b) rojos (R6, R5 y los dos #195 R15), Expected 14 / Received 16; `Tests: 4 failed, 262 passed, 266 total`, exit 1. Resto HOME verde; revertida.

- Mutación R15 (c): gap interno de home-states 16 a 14, rojos solo R6 (bloque home-states) y segundo #195 R15, `Tests: 2 failed, 264 passed, 266 total`, exit 1. R5 y primero #195 R15 verdes; bloque intacto no está ciego. Revertida; diff móvil vacío. Sin refactor adicional: una línea ya es mínima.

### R16 — rojo y verde

- R15 tras reversiones: `Tests: 266 passed, 266 total`, exit 0 (`r15-restored-195.log`), sin refactor adicional.
- Rojo R16 BP+HOME: `Tests: 3 failed, 263 passed, 266 total`; 2 suites fallidas. BP falla por módulo BubblePop inexistente; HOME rojos exclusivamente #190 R11 (clase), #190 R4 (56 frente a 64), #190 R7 (falta estilo animado final). Ningún it anterior ajeno rojo. Tests nuevos con Reanimated real, solo useReducedMotion sustituido; constantes y tiempos literales.

- Commit rojo R16 `44b5cd43` — `test(mobile): lock Pingo bubble pop and reduced motion (R16)`. Primera candidata: BP+HOME `Tests: 1 failed, 268 passed, 269 total` (HOME completo verde). Único fallo nuevo: lectura de pico a 706 ms, esperado cercano a 1.08 con precisión por defecto 2, recibido 1.0671542276609973.
- Medición del reloj real en BP: **a 690 ms da exactamente opacity 1 y scale 1.08**; a 706 ms el segundo tramo ya ha avanzado 16 ms y da 1.0671542276609973. `Tests: 1 failed, 2 passed, 3 total` de la sonda temporal (`r16-clock-195.log`). No se cambia ningún valor final ni tiempo de producción. Se retira console.info y se añade una aserción más fuerte del pico exacto a 690 ms; a 706 ms se mantiene `toBeCloseTo(1.08, 1)` más `scale > 1` (cercanía durante el retorno), pues la spec prescribe «cercana» sin precisión decimal. El estado final a 866 ms conserva la precisión 2 por defecto. No se relaja ninguna aserción fuera de los nodos animados.
- Dos búsquedas de solo lectura usaron globs de celebration inexistentes y devolvieron ENOENT, sin escritura ni ejecución Jest; no se usan esas rutas.

- Corrección de test `d330637e` — `test(mobile): sample bubble peak before its return frame (R16)` antes del verde. BP+HOME `Tests: 269 passed, 269 total`, 2 suites, exit 0 (`r16-green-final-195.log`). Primer render reduce motion visible, pico exacto y final sin cambios de valores.

- Verde R16 `0c02fc69` — `feat(mobile): animate canvas Pingo bubble with reduced motion (R16)`, `Tests: 269 passed, 269 total`. Sin refactor adicional.

| Mutación R16 | It rojo medido | Tests (exit 1) |
|---|---|---|
| a: opacity inicial 1 | BP `espera 450 ms…` y `reenvía testID…` | `Tests: 2 failed, 1 passed, 3 total` |
| b: reduce motion opacity inicial 0 | BP `con reduce motion nace final…` y HOME #190 R7 | `Tests: 2 failed, 263 skipped, 4 passed, 269 total` |
| c: shadow-sm vuelve a la burbuja | HOME #190 R11 `usa View y Text…` | `Tests: 1 failed, 265 skipped, 266 total` |
| d: BubblePop descarta style | HOME #190 R7, falta `{ borderCurve: 'continuous' }` | `Tests: 1 failed, 265 skipped, 266 total` |
| e: cadena prohibida en comentario HOME | design-drift #68 R18 `keeps arbitrary text, hex colors, and StyleSheet out of feature sources` | `Tests: 1 failed, 113 skipped, 1 passed, 115 total` |

Cada mutación vista roja y revertida antes de la siguiente. Los filtros ejecutaron tests (ninguna suite saltada entera); HOME/mutaciones con testTimeout 30000. Solo paths autorizados; diff móvil vacío tras restaurar.

- R16 tras restaurar mutaciones, guardas agregadas: `Tests: 774 passed, 774 total`, 25 suites verdes, snapshot 1/1 (`r16-guards-195.log`). No regresiones.

### R17 — modelo de contraste

- GUARD nace verde tal como permite tasks R17: `Tests: 4 passed, 4 total`, exit 0. Dos it nuevos (light/dark) con 9 pares cada uno, tokens leídos de CSS, constantes literales y tolerancia ±0.05 más suelos. El test es el entregable: no necesita producción nueva. Se demuestra rojo por mutaciones; no se inventa un cambio de producción para crear un commit vacío.

- Commit R17 `3ee46612` — `test(mobile): verify worst-case hero contrast model (R17)`, baseline `Tests: 4 passed, 4 total`. Mutación (a), muted light más claro, pone rojo `mantiene referencias y suelos en light`, `Tests: 1 failed, 3 passed, 4 total`. Mutación (b), alfa 0.15 a 0.25 del primer tramo, pone rojos ambos temas por tolerancia, `Tests: 2 failed, 2 passed, 4 total`. Ambas exit 1 y revertidas. Valores/referencias/suelos originales conservados.

- R17 restaurado: `Tests: 4 passed, 4 total`, exit 0, sin refactor/producción nueva.

### R18 — estados conservados

- Primera corrida HERO+HOME `Tests: 1 failed, 331 passed, 332 total`, HOME completo verde. El único rojo era un error del test nuevo: imponía orden de clases de card que R18 no prescribe (bg-default antes de rounded-card); se corrige para afirmar la presencia de rounded-card, como pide R18. No se modifica ninguna aserción anterior ni producción. Un intento previo de apply_patch con contexto inexistente abortó antes de escribir; se añadió el bloque al final sin tocar código anterior.

- R18 `a45ce63f` — `test(mobile): preserve hero fallbacks and home states (R18)`. Nace verde tras corregir el error del test: HERO `Tests: 62 passed, 62 total`; HOME `Tests: 270 passed, 270 total` (suite verde de `r18-baseline-195.log`). Ocho it nuevos; sin implementación necesaria, como prevé tasks R18.
- Mutación rounded-xl en skeleton: ambos it nuevos de skeleton (bleed/card) rojos, `Tests: 2 failed, 60 passed, 62 total`, exit 1. Revertida. El primer script tenía indentación incorrecta en su ancla y abortó antes de escribir/Jest; se corrigió a la indentación real sin tocar nada más.

Corrección del recuento R18 anterior: el resultado real de la mutación fue `Tests: 3 failed, 59 passed, 62 total`: además de los dos it nuevos falló el candado anterior #127 R2 de la misma receta del skeleton. Es una detección adicional del defecto plantado, no una regresión. Tras restaurar, `Tests: 62 passed, 62 total`, exit 0. Los logs íntegros son la fuente del recuento.

### R19 — guardas de fuente e inventarios

- GUARD `Tests: 23 passed, 23 total`, exit 0. Diecinueve it nuevos sobre siete ficheros, cuentas por líneas y tokens/tiempos. El código ya cumple por R1–R16: no se añade producción ni se fabrica un cambio vacío. Se valida el rojo real de cada guarda con las seis mutaciones prescritas.

- Commit R19 `a4300199` — `test(mobile): guard hero style inventory and source rules (R19)`, `Tests: 23 passed, 23 total`.

| Mutación R19 | It rojo | Tests (exit 1) |
|---|---|---|
| a hex FF0000 en GC | R19 glass-circle conserva tokens | `Tests: 1 failed, 22 passed, 23 total` |
| b clase h-[330px] en hero | R19 pet-hero-header conserva tokens | `Tests: 1 failed, 22 passed, 23 total` |
| c shadow-md en selector | R19 pet-switcher conserva tokens y cuenta shadow- | `Tests: 2 failed, 21 passed, 23 total` |
| d import BlurView en GC | R19 glass-circle conserva tokens | `Tests: 1 failed, 22 passed, 23 total` |
| e segunda resolución profile.addPet | R11 resuelve profile.addPet y R19 cuenta por líneas | `Tests: 2 failed, 21 passed, 23 total` |
| f comentario con referencia desnuda en hero | design-drift: inventario de fuentes de media/hero | `Tests: 1 failed, 114 passed, 115 total` |

Todas vistas rojas y revertidas, sin cambios residuales de producción. No se escribe ninguna referencia de feature en los dos ficheros de Inicio prohibidos (la f se planta en hero).

- R19 restaurado GUARD+design-drift: `Tests: 138 passed, 138 total`, exit 0. Nombre exacto de la mutación f: `R9: mobile-pets-profile sin drift › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`.

### R20 — carta

- Antes del rojo se verifica casilla firmada de la enmienda original en requirements (gate cumplido). Test lee bloques canónicos de design, normaliza solo casilla, fija última sección y preserva el párrafo A8 byte a byte como literal independiente con la cita nueva inmediata.

- Rojo R20: `Tests: 3 failed, 23 passed, 26 total`, exit 1, solo los tres nuevos it (sección ausente, cita ausente y casilla de carta ausente). Los otros guardas quedan verdes. La implementación copia literalmente los dos bloques de design, con la casilla nueva [ ] sin autofirma.

- Rojo R20 `00472596` — `test(mobile): lock charter amendment and A8 continuation (R20)`. Verde GUARD+hero-header-amendments+home-pingo-phrase: `Tests: 37 passed, 37 total`, 3 suites, exit 0 (`r20-green-195.log`). Enmiendas #190/#67/#167 intactas; nueva sección #195 es la última y la continuación de A8 es un párrafo separado. Sin refactor adicional.

### Cierre automático R1–R20

- Se inicia solo tras todos los requisitos verdes y las mutaciones restauradas. No se ejecuta init.sh (leader), ni se modifica estado/PR/arnés. Suite móvil completa, tipos, lint, graphify, cuentas y trazabilidad a continuación.

#### Cuentas de cierre (comandos de tasks, desde mobile-pet-tracker)

Se desescapa únicamente el `\|` de la celda Markdown al ejecutar el patrón ERE scrim|photo-dim. Los grep cuentan líneas, no apariciones.

| Comando | Base | Delta | Resultado |
|---|---|---|---|
| `grep -c 'style={CONTINUOUS_CORNER}' src/components/pet-hero-header.tsx` | 1 | +0 | 1 |
| `grep -c 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` | 1 | +0 | 1 |
| `grep -c 'TABULAR_NUMS' src/components/pet-hero-header.tsx` | 2 | +0 | 2 |
| `grep -c 'TABULAR_NUMS' src/screens/home/index.tsx` | 9 | +0 | 9 |
| `grep -c 'text-accent-strong' src/components/pet-hero-header.tsx` | 1 | +0 | 1 |
| `grep -c 'text-accent-strong' src/screens/home/index.tsx` | 2 | +0 | 2 |
| `grep -c 'bg-accent-soft' src/screens/home/index.tsx` | 3 | +0 | 3 |
| `grep -c 'bg-accent-soft' src/components/pet-switcher.tsx` | 1 | +0 | 1 |
| `grep -c "t('profile.addPet'" src/screens/home/index.tsx` | 1 | +0 | 1 |
| `grep -c 'shadow-' src/components/pet-switcher.tsx` | 0 | +0 | 0 |
| `grep -cE '^export const MOTION_HERO_' src/theme/motion.ts` | 0 | +4 | 4 |
| `grep -cE -e '--(color-)?(scrim\|photo-dim):' src/theme/global.css` | 0 | +8 | 8 |
| `grep -c 'Enmienda #195' ../docs/ui-guidelines.md` | 0 | +3 | 3 |
| `test -e src/components/glass-circle.tsx && test -e src/screens/home/bubble-pop.tsx && test -e src/__tests__/home-photo-hero-canvas.test.ts` | ausentes | creados | existen |
| `test -e src/components/__tests__/pet-hero-header-motion.test.tsx && test -e src/screens/home/bubble-pop.test.tsx` | ausentes | creados | existen |
| `grep -c "(enmendado por #195 R14)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | +6 | 6 |
| `grep -c "(enmendado por #195 R14)" src/screens/home/index.test.tsx` | 0 | +6 | 6 |
| `grep -c "duration === 500" src/components/__tests__/pet-hero-header.test.tsx` | 0 | +1 | 1 |
| `grep -c "(enmendado por #195 R15)" src/screens/home/index.test.tsx` | 0 | +2 | 2 |
| `grep -c "(enmendado por #195 R15)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | +0 | 0 |
| `grep -c "StyleSheet" src/screens/home/index.test.tsx` | 0 | +0 | 0 |

#### Inventario exacto desde H0

`git diff --name-only ab33dfd1..HEAD -- mobile-pet-tracker/ docs/`: 22 ficheros, coincide exactamente con la lista cerrada (21 móviles + carta, incluye HEROMOT y BP).

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
mobile-pet-tracker/src/components/__tests__/glass-circle.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-avatar.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-hero-header-motion.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx
mobile-pet-tracker/src/components/__tests__/ping-ring.test.tsx
mobile-pet-tracker/src/components/glass-circle.tsx
mobile-pet-tracker/src/components/pet-avatar.tsx
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/components/pet-switcher.tsx
mobile-pet-tracker/src/components/ping-ring.tsx
mobile-pet-tracker/src/screens/home/bubble-pop.test.tsx
mobile-pet-tracker/src/screens/home/bubble-pop.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/global.css
mobile-pet-tracker/src/theme/motion.ts
```

Sin cambios de package.json, bun.lock, ui-copy-table, mapa ni Perfil respecto a H0. R3_HOME/SCREEN_FILES y copy intactos.

- Suite móvil completa `bun run test` (`progress/full-test-195.log`), exit 0: **`Test Suites: 134 passed, 134 total`**, **`Tests: 4379 passed, 4379 total`**, **`Snapshots: 1 passed, 1 total`**. Base T0 130/4297/1: delta +4 suites, +82 tests, snapshot intacto. Cero FAIL; #190 R5 pasa, sin necesidad de repetir corrida ni borrar caché en esta reanudación.
- R20 verde `852f4b35` — `feat(mobile): adopt canvas hero charter amendment (R20)`; línea del commit: `Tests: 37 passed, 37 total`.
- Comparación adicional contra H0: secciones completas de carta #67/#167/#190 idénticas (solo se añaden los dos bloques autorizados de #195).

- Typecheck: precondición `test ! -e .expo/types/router.d.ts` pasa; después `bun run typecheck`, exit 0 (`progress/typecheck-195.log`, solo `$ tsc --noEmit`, sin errores). No se elimina ni genera router.d.ts.
- En la suite completa constan PASS de las nueve guardas requeridas (design-drift, consistency-classnames, legibility-classnames, hero-header-amendments, tab-headers-canvas, alerts-canvas-fidelity, ui-language, home-photo-hero-canvas y home-pingo-phrase) y de `src/screens/map/index.test.tsx` / `components/__tests__/pet-map.test.tsx`.

#### Tabla final R1–R20 a test y commit

Esta tabla sustituye como estado vigente las tablas parciales anteriores; la evidencia histórica se conserva.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `components/__tests__/pet-hero-header.test.tsx::#195 R1`; it: `%s con mascota %s y slot %s` | bd03f556 feat(mobile): contain hero in a 330 point frame (R1) |
| R2 | `components/__tests__/pet-avatar.test.tsx::#195 R2`; `components/__tests__/pet-hero-header.test.tsx::#195 R2` (su `it` `funde al llegar la mascota y al cambiar su id, sin repetir por nombre` queda enmendado por R14: Enmienda A2, [[requirements]] §Candados de visibilidad y de forma de style, fila 12); it: `funde al llegar la mascota y al cambiar su id, sin repetir por nombre (enmendado por #195 R14)` | 626ebc69 feat(mobile): align hero photo and fade on pet identity (R2); c3c51cd6 test(mobile): isolate initial photo fade counter by duration (R14) |
| R3 | `components/__tests__/pet-hero-header.test.tsx::#195 R3`; it: `resuelve ambos colores en una llamada y conserva alfa, geometría y toques` | 964aac85 feat(mobile): match canvas gradient stops and scrim (R3) |
| R4 | `theme/__tests__/global-css.test.ts::#195 R4`; `components/__tests__/pet-hero-header.test.tsx::#195 R4`; it: `superpone el token photo-dim sin interceptar toques, tras la foto` | f308ea70 feat(mobile): add theme-aware photo dim layer (R4) |
| R5 | `components/__tests__/pet-hero-header.test.tsx::#195 R5`; it: `usa inset superior más 12 y laterales de 16 sin fondo ni padding (enmendado por #195 R14)` | 016e4749 feat(mobile): float hero slot above photo (R5) |
| R6 | `components/__tests__/pet-hero-header.test.tsx::#195 R6`; `__tests__/alerts-canvas-fidelity.test.ts::limita $token a su inventario de producción` (fila `tracking-title`); it: `capas con slot %s y clases exactas del pie; sin datos conserva los dos skeletons y omite la cifra` | e17c14b3 feat(mobile): place hero caption over the gradient (R6); bc14d41b test(mobile): restore empty-state amendment note and tag hero row (R6) |
| R7 | `components/__tests__/pet-hero-header.test.tsx::#195 R7`; `screens/home/index.test.tsx::#73 R9`; it: `fija las tres recetas exactas de %s` | c9e578a9 feat(mobile): derive hero pill accent tone and spacing (R7) |
| R8 | `components/__tests__/pet-hero-header.test.tsx::#195 R8`; `components/__tests__/ping-ring.test.tsx::#195 R8`; it: `success con mascota pinta un único ping con timing propio; conserva 2400 ms por defecto y usa el timing recibido en ambas propiedades` | 2b71c252 feat(mobile): use configurable ping ring for online status (R8) |
| R9 | `components/__tests__/pet-switcher.test.tsx::#195 R9`; it: `el seleccionado usa avatar 36 con foto %s y un aro de 44` | a9af1117 feat(mobile): add selected glass avatar and online dot (R9) |
| R10 | `components/__tests__/pet-switcher.test.tsx::#195 R10`; it: `conserva orden, cardinalidad, iniciales y selección desde ambos chips` | 3ca49df6 feat(mobile): render glass switcher row and trailing action (R10) |
| R11 | `components/__tests__/glass-circle.test.tsx::#195 R11`; `screens/home/index.test.tsx::#195 R11`; `screens/home/index.test.tsx::#152 R5`; `__tests__/home-photo-hero-canvas.test.ts::#195 R19` (una sola `t('profile.addPet'`); it: `conserva raíz accesible, clase exacta e hijo único sin desenfoque; invoca onPress y atenúa a 0.8 al pulsar desde opacidad 1` | 2c19841d feat(mobile): add reusable flat glass circle (R11); 7dbcdd48 feat(mobile): use glass selector and add pet action on home (R11) |
| R12 | `screens/home/index.test.tsx::#195 R12`; `screens/home/index.test.tsx::#78 R10`, `#124 R1`, `#78 R11`; it: `con alertas abiertas %s mantiene icono, orden y navegación` | 4c9953ab feat(mobile): use glass bell with canvas alert indicator (R12) |
| R13 | `theme/__tests__/motion.test.ts::#195 R13`; it: `declara fundido, retrasos y ping sin acoplarlos a la celebración` | 2908e173 feat(mobile): add hero motion constants (R13) |
| R14 | `components/__tests__/pet-hero-header.test.tsx::#195 R14` (llamadas, reduce motion, prueba (ii)); `components/__tests__/pet-hero-header-motion.test.tsx::#195 R14` (prueba (i), fichero nuevo por la Enmienda A1); `screens/home/index.test.tsx::#152 R5` y los 12 `it` de HERO y HOME con sufijo `(enmendado por #195 R14)` (6 y 6; uno de los de HERO es el `it` de R2 de la Enmienda A2) ([[requirements]] §Candados de visibilidad); it: `anima el slot sin retraso y el pie con un único retraso de 80 ms; el slot sube en 400 ms y el pie espera 80 ms antes de subir; la foto empieza en cero y termina su fundido a los 516 ms` | 80d621e9 feat(mobile): animate hero slot and caption on mount (R14); c3c51cd6 test(mobile): isolate initial photo fade counter by duration (R14) |
| R15 | `screens/home/index.test.tsx::#195 R15`; `screens/home/index.test.tsx::R5: Home usa el hero compartido`; `screens/home/index.test.tsx::R6: home carga pets y selecciona` (su `it` `pads the content below the status bar with the top safe-area inset` queda enmendado por R15: Enmienda A3, [[requirements]] §Candados de visibilidad y de forma de style, fila 13); it: `deja el hero primero y conserva el relleno interior y la holgura de la barra; aplica también el hueco de 14 a las ramas de estado sin hero; conserva gap y paddingBottom y saca el padding horizontal a un envoltorio (enmendado por #195 R15)` | 77da555b test(mobile): lock home hero spacing and scroll layout (R15); 6519704f test(mobile): amend home pending-state scroll spacing (R15); 2bf5b932 feat(mobile): match home hero scroll spacing (R15) |
| R16 | `screens/home/bubble-pop.test.tsx::#195 R16` (pruebas (i) y (ii), Reanimated real); `screens/home/index.test.tsx::#190 R11`, `#190 R4`, `#190 R7` (este último con la forma de `style` aplanada sin la cadena `StyleSheet`, Enmienda A1); it: `espera 450 ms, alcanza el pico en 240 ms y vuelve en 160 ms; con reduce motion nace final y visible sin avanzar el reloj; reenvía testID, className, style y su único hijo sin entering` | 44b5cd43 test(mobile): lock Pingo bubble pop and reduced motion (R16); d330637e test(mobile): sample bubble peak before its return frame (R16); 0c02fc69 feat(mobile): animate canvas Pingo bubble with reduced motion (R16) |
| R17 | `__tests__/home-photo-hero-canvas.test.ts::#195 R17`; it: `mantiene referencias y suelos en %s (light y dark)` | 3ee46612 test(mobile): verify worst-case hero contrast model (R17); nace verde; sin producción nueva; mutaciones rojas y revertidas |
| R18 | `components/__tests__/pet-hero-header.test.tsx::#195 R18`; `screens/home/index.test.tsx::#195 R18`; it: `sin mascota conserva skeleton sin radio en %s; sin foto conserva el blobatar rectangular y los degradados; card conserva el radio de tarjeta; conserva la carga de mascotas; conserva el error de mascotas y su reintento; conserva el estado sin mascotas; conserva el error de detalle con selector y skeleton alcanzables` | a45ce63f test(mobile): preserve hero fallbacks and home states (R18); nace verde; sin producción nueva; mutaciones rojas y revertidas |
| R19 | `__tests__/home-photo-hero-canvas.test.ts::#195 R19`; it: `%s conserva tokens y primitivas permitidas; %s conserva %s en %s líneas; mantiene cuatro tiempos propios y ocho declaraciones de tokens nuevos` | a4300199 test(mobile): guard hero style inventory and source rules (R19); producción ya conforme; seis mutaciones rojas y revertidas |
| R20 | `__tests__/home-photo-hero-canvas.test.ts::#195 R20`; it: `añade una sola sección completa y es la última cabecera de nivel dos; conserva A8 entero y añade la cita nueva como párrafo aparte inmediato; detecta las casillas con una expresión tolerante a la firma` | 00472596 test(mobile): lock charter amendment and A8 continuation (R20); 852f4b35 feat(mobile): adopt canvas hero charter amendment (R20) |
| R21 | Humano: checklist de dev build Android en el reporte; sin test automatizado | Ejecución y firma a cargo del humano; fuera del cierre automático |

#### R21 — checklist para el humano en dev build Android

R21 no automatizado y sin firma por el agente. Ejecutar en el PC/dispositivo del humano:

- [ ] Repetir en claro, oscuro y reduce motion, con mascota de foto oscura, foto clara y sin foto (nueve combinaciones).
- [ ] Foto alineada arriba, hero de 330, degradado sin banda gris, vidrio legible y blobatar centrado sin recortar.
- [ ] Supuesto 2: comprobar posiciones reales del punto en línea y de alertas (origen Yoga respecto al borde).
- [ ] Supuesto 3: comprobar que el punto de 14 px no se recorta al desplazar horizontalmente los avatares, incluidos los extremos de la fila.
- [ ] Supuesto 4: tipografía efectiva 30/34 y tracking, raza/etiqueta legibles sin recortes; nombre de 25 caracteres y texto ampliado.
- [ ] Supuesto 5: fundido de foto acompasado con su decodificación, sin salto al llegar el dato.
- [ ] Revisar ritmo de ping, pop, float, rise y fundido; con reduce motion hero/burbuja finales desde el primer render y sin anillo.
- [ ] Scroll del hero con el contenido, solape con barra de estado, fila superior alcanzable y holgura con barra flotante.
- [ ] Selección de mascotas, botón +, campana e indicador de alertas funcionan y mantienen su lectura.
- [ ] Firmar R21 en requirements o comunicar al leader cualquier discrepancia para su corrección.

Riesgo que queda: verificación visual, posiciones/recorte reales y decodificación de imagen en Android. El leader resuelve la posición de la nueva sección final de la carta en el merge con las otras features; no se hace merge/rebase aquí.

- Lint exacto prescrito: `bunx expo lint --no-cache > ../progress/lint-195.log 2>&1 && test ! -s ../progress/lint-195.log`, exit 0 y log de **0 bytes**. Sin prettier, sin caché ni pipe.

#### Archivo histórico del bloqueo inicial (evidencia conservada)

<details>
<summary>Sonda inicial previa a las enmiendas; resuelta por A1/A2/A3</summary>

## Bloqueo obligatorio — supuesto 1 (R14 / R16)

El handoff manda: «confirma el 1 (visibilidad de hijos con entrada en opacidad 0) antes del primer test rojo que lo use» y «Si el 1 cae, PARA y avisa».

La primera sonda usó `m.default.View` del doble (View plano). Pasó, pero no reproducía el nodo de producción: `Animated.createAnimatedComponent(View)`. Al preparar R14 se repitió con ese nodo real. Resultado:

```text
FAIL src/components/__tests__/pet-hero-header.test.tsx
#195 R14: sonda fiel al nodo AnimatedView del hero
  el hijo de un AnimatedView inicialmente oculto termina visible
expect(instance).toBeVisible()
Received instance is not visible: <Text testID="visibility-probe">hijo</Text>
Tests: 1 failed, 55 skipped, 56 total
```

Sonda efímera añadida a HERO, ejecutada sola y retirada en `finally`:

```tsx
const ProbeView = Animated.createAnimatedComponent(View);
function Probe() {
  const opacity = m.useSharedValue(0);
  React.useEffect(() => { opacity.set(m.withTiming(1)); }, [opacity]);
  const style = m.useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return <ProbeView style={style}><Text testID="visibility-probe">hijo</Text></ProbeView>;
}
await renderHero(<Probe />);
expect(screen.getByTestId('visibility-probe')).toBeVisible();
```

`m` es `jest.requireMock('react-native-reanimated')`; React es requireActual; Animated es el import por defecto ya usado por producción. Comando desde mobile: `bunx jest src/components/__tests__/pet-hero-header.test.tsx --testTimeout=30000 --silent -t '#195 R14: sonda fiel'`, con ambos pgrep vacíos. No se relajó ningún `toBeVisible`, no se escribió el rojo de R14 ni se implementó ese bloque. La sonda correcta invalida la confirmación inicial. El leader debe revisar el montaje/doble y la spec antes de reanudar, según la orden de parada.

</details>

#### Resultado vigente del cierre automático

- `graphify update .`, exit 0 (`progress/graphify-195.log`): 2371 ficheros AST, grafo de 27453 nodos / 35494 aristas / 1791 comunidades actualizado en graphify-out (ignorado). Aviso: 20 SQL omitidos por falta de tree_sitter_sql; no se añaden dependencias. Sin extracción semántica ni coste API.
- Build de tipos móvil y lint verdes; suite completa 134/4379/1 verde; guardas y mapa verdes; cuentas 21/21 e inventario 22/22 conformes. No queda ninguna mutación ni sonda temporal en código. El aviso final de worker force-exit no apareció en esta corrida.
- R17/R18/R19 son entregables de tests sobre producción ya conforme: constan sus commits propios y los rojos por mutación; no hay cambios ni commits vacíos de producción. R16 incorpora la medición del pico exacto y la cercanía un fotograma después, manteniendo todos los valores/títulos/nodos prescritos. No se tocan tests anteriores fuera de las enmiendas autorizadas.
- Se retiraron únicamente las líneas obsoletas de parada indicadas por los handoffs; el bloque inicial de bloqueo se sustituyó por la resolución A1/A2/A3/adendo 5 y su evidencia íntegra se archivó al final. El resto del reporte conserva su historia y añade las mediciones nuevas.
- R1–R20 completos para revisión del leader. R21 sigue sin ejecución ni firma del agente; checklist arriba. No se marca la feature done, no se ejecuta init.sh y no se cambian current/history/STATUS/feature_list ni PR. Sin push, merge ni rebase.
- Este reporte y traceability se entregan juntos en el commit final `docs(home)`, sin archivos de arnés. Tras comprobar commit y árbol limpio, la última acción crea el marcador .done ignorado con la ruta absoluta de este reporte.


## Reanudación con Enmienda A4 — 2026-10-22

**Estado: parada resuelta por el leader mediante el adendo 7 (fila 7 = 4, 14a + 14h).** El rojo de A se midió después sobre el commit existente; evidencia y continuación debajo. A se conserva sin reescritura.

Primer comando ejecutado, antes de cualquier otra acción:

```bash
cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current
```

Salida confirmada:

```text
/home/claude/sites/Pet-Tracker-wt-195
feature/195-mobile-home-photo-hero-canvas
```

Árbol inicial limpio, HEAD `17e93061`; base de comparación A4 `98c7a192`. Leídos el adendo 6 y los anteriores, el handoff original y las secciones de la spec aplicables (D6, fila 14, H4 y cadena A–E). Firma humana A4 presente. No se ejecutó `./init.sh`.

Skills cargadas: `building-native-ui` (catálogo Expo local, `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`), `appllama-app-design-skill` y `animate-expo` (ambas en `.agents/skills/`), y `ponytail` (catálogo local). `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en el catálogo de Codex y no se buscaron ni cargaron, conforme al adendo. No se cargó `expo-tailwind-setup`: este paso solo cambia los literales de tests enumerados por la spec y no toca estilos ni configuración de Tailwind. No se usó MCP de Appllama ni se delegó trabajo.

Esperas aplicadas: `docs/conventions.md` §Esperas sobre el árbol renderizado dice «La condición que termina una espera debe ser la misma observación que hacen las aserciones posteriores» y «si el test asevera el árbol, espera al árbol». No se añadieron esperas ni contadores de mock. Antes de la única corrida de Jest, comando independiente con `pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh'`, bucle `sleep 20` y tope de 900 s; terminó con salida vacía y exit 0. La corrida llevó `--testTimeout=30000`, redirección completa y exit code sin pipe.

### Base y commit A

Base medida por esta sesión, antes de editar:

```bash
bunx jest src/components/__tests__/pet-hero-header.test.tsx src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000 > /tmp/a4-base.log 2>&1
```

Exit 0. `Test Suites: 2 passed, 2 total`; `Tests: 88 passed, 88 total`.

Commit A: `21e404c3` — `test(mobile): enmienda a 430, 100, 90 y paradas 24/44 los ocho it de HERO (R1)`. Creado con `git commit --only mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx -m '…'`. Solo cambia ese fichero, 13 líneas sustituidas. Se comprobaron por `grep -n` las sustituciones acotadas antes del commit. Los ocho `it` son exactamente 14a a 14h; se conservan el título `%s con mascota %s y slot %s`, el sufijo de 14b y todas las comparaciones simbólicas.

**Tests tras A: no ejecutados.** La medición de cuentas inmediatamente posterior al commit encontró el motivo obligatorio de parada antes de lanzar Jest. No se afirma haber observado los doce rojos de A: siguen pendientes de medir con la discrepancia resuelta por el leader/humano. B, C, D y E no existen en esta sesión.

### Las 18 cuentas A4 medidas

Comandos literales de `tasks.md` §Cuentas a re-medir (alternancias con `|`, sin la barra de escape de Markdown), desde `mobile-pet-tracker/` salvo las dos cuentas de la carta, desde la raíz. Un `grep -c` cuenta líneas. Todas las bases coinciden con el adendo; tras A, solo la fila 7 discrepa.

| Fila A4, en orden de tasks.md | Base medida | Tras A medido | Exigido tras A |
|---|---:|---:|---:|
| 1: `330` en HERO | 8 | 0 | 0 |
| 2: `430` en HERO | 0 | 8 | 8 |
| 3: `160` o `130` en HERO | 4 | 0 | 0 |
| 4: `35%` o `65%` en HERO | 2 | 0 | 0 |
| 5: `24%` o `44%` en HERO | 0 | 2 | 2 |
| 6: `height: 90` o `height: 100` en HERO | 0 | 2 | 2 |
| 7: `toBe(430/100/90)` en HERO | 0 | **4** | **4**, [adendo 7](handoff_mobile-home-photo-hero-canvas-reanudar-7.md) |
| 8: ficheros de src con `330` | 2 (HERO 8, producción 1) | 1 (producción 1) | 1 hasta C |
| 9: constantes antiguas de producción | 3 | 3 | 3 hasta C |
| 10: constantes nuevas de producción | 0 | 0 | 0 hasta C |
| 11: paradas antiguas de producción | 1 | 1 | 1 hasta C |
| 12: paradas nuevas de producción | 0 | 0 | 0 hasta C |
| 13: `104` o `160` en GUARD | 2 | 2 | 2 hasta B |
| 14: `10.79` o `9.77` en GUARD | 2 | 2 | 2 hasta B |
| 15: `7.75` o `6.74` en GUARD | 0 | 0 | 0 hasta B |
| 16: medidas antiguas en la carta | 1 | 1 | 1 hasta E |
| 17: frase nueva de medidas en la carta | 0 | 0 | 0 hasta E |
| 18: ficheros con los cuatro testID de geometría | 4 | 4 | 4 |

Fila 18, mismos cuatro ficheros antes y después: `components/__tests__/pet-hero-header.test.tsx`, `components/pet-hero-header.tsx`, `__tests__/consistency-classnames.test.ts` y `screens/home/index.test.tsx`.

### Discrepancia reproducible y causa

Comando de la fila 7, ejecutado tras el commit A:

```bash
grep -cE "toBe\((430|100|90)\)" src/components/__tests__/pet-hero-header.test.tsx
```

Resultado **4**, frente a **3** exigido por tasks.md. El listado de coincidencias identifica por completo la diferencia:

```text
201:    expect(PET_HERO_MEDIA_HEIGHT).toBe(430);
202:    expect(PET_HERO_FADE_HEIGHT).toBe(100);
203:    expect(PET_HERO_SCRIM_HEIGHT).toBe(90);
815:    expect(media.props.height).toBe(430);
```

Las primeras tres son 14a, `exporta las constantes de dimensión del hero (enmendado por #195 R1)`. La cuarta es 14h, `sin foto conserva el blobatar rectangular y los degradados`, dentro de `#195 R18: estados conservados del hero`. La fila 14h exige literalmente pasar `media.props.height.toBe(330)` a `toBe(430)`, por lo que la regex de la cuenta también la incluye. La tabla describe su esperado 3 como «las tres de la fila 14a», pero el comando no acota el bloque a 14a.

No se ha alterado 14h, la regex de la cuenta ni el formato de la aserción para ocultar la cuarta coincidencia. Se necesita que el leader/humano concilie el esperado de la cuenta con el alcance de su regex. La implementación permanece detenida; no hay `it` fallidos medidos tras A, porque no se corrió Jest después de detectar la cuenta incorrecta.

### Diff medido de A frente a 98c7a192

```diff
diff --git a/mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx b/mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
index 3f0f7a2e..33b2cee6 100644
--- a/mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
+++ b/mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
@@ -198,9 +198,9 @@ describe('R1: PetHeroHeader es el único hero compartido', () => {
   });
 
   it('exporta las constantes de dimensión del hero (enmendado por #195 R1)', () => {
-    expect(PET_HERO_MEDIA_HEIGHT).toBe(330);
-    expect(PET_HERO_FADE_HEIGHT).toBe(160);
-    expect(PET_HERO_SCRIM_HEIGHT).toBe(130);
+    expect(PET_HERO_MEDIA_HEIGHT).toBe(430);
+    expect(PET_HERO_FADE_HEIGHT).toBe(100);
+    expect(PET_HERO_SCRIM_HEIGHT).toBe(90);
   });
 
   it('no importa el selector de mascota ni la capa de API', () => {
@@ -286,7 +286,7 @@ describe('R3: el texto del hero va sobre fondo opaco', () => {
     const top = screen.getByTestId('pet-hero-scrim-top').props.style;
 
     expect(bottom.experimental_backgroundImage).toMatch(
-      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6}59 35%, #[0-9A-Fa-f]{6}D9 65%, #[0-9A-Fa-f]{6} 100%\)$/,
+      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6}59 24%, #[0-9A-Fa-f]{6}D9 44%, #[0-9A-Fa-f]{6} 100%\)$/,
     );
     expect(top.experimental_backgroundImage).toMatch(
       /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}80 0%, #[0-9A-Fa-f]{6}00 100%\)$/,
@@ -569,13 +569,13 @@ describe('#195 R8: anillo de estado sustituye el pulso de opacidad', () => {
 describe('#127 R2: el skeleton del hero lleva su receta en el árbol', () => {
   afterEach(() => cleanup());
 
-  it('pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 330 como único estilo (enmendado por #195 R1)', async () => {
+  it('pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 430 como único estilo (enmendado por #195 R1)', async () => {
     await renderHero(<PetHeroHeader pet={null} variant="bleed" />);
 
     const skeleton = screen.getByTestId('pet-hero-skeleton');
 
     expect(skeleton.props.className).toBe('w-full');
-    expect(skeleton.props.style).toStrictEqual({ height: 330 });
+    expect(skeleton.props.style).toStrictEqual({ height: 430 });
   });
 });
 
@@ -592,7 +592,7 @@ describe('#195 R4: capa de oscurecimiento', () => {
 });
 
 
-describe('#195 R1: frame de 330 y raíz estable', () => {
+describe('#195 R1: frame de 430 y raíz estable', () => {
   afterEach(() => cleanup());
   it.each([
     ['bleed', false, false], ['bleed', true, true],
@@ -604,7 +604,7 @@ describe('#195 R1: frame de 330 y raíz estable', () => {
     const root = screen.getByTestId('pet-hero');
     const frame = screen.getByTestId('pet-hero-frame');
     expect(root.children).toEqual([frame]);
-    expect(frame.props.style).toEqual({ height: 330 });
+    expect(frame.props.style).toEqual({ height: 430 });
     expect(root.props.style).toEqual({ borderCurve: 'continuous' });
     expect(root.props.className).toBe(variant === 'card'
       ? 'overflow-hidden rounded-card bg-default' : 'overflow-hidden bg-default');
@@ -624,7 +624,7 @@ describe('#195 R2: foto alineada arriba y fundido por identidad', () => {
     const media = within(photo).getByTestId('pet-hero-media');
     expect(media.props.contentPosition).toEqual({ top: 0, left: '50%' });
     expect(media.props.source).toEqual([{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]);
-    expect(StyleSheet.flatten(media.props.style)).toEqual({ width: '100%', height: 330 });
+    expect(StyleSheet.flatten(media.props.style)).toEqual({ width: '100%', height: 430 });
   });
   it('funde al llegar la mascota y al cambiar su id, sin repetir por nombre (enmendado por #195 R14)', async () => {
     const view = await renderHero(<PetHeroHeader pet={null} />);
@@ -653,8 +653,8 @@ describe('#195 R3: degradados exactos sobre la fotografía', () => {
     const bottom = screen.getByTestId('pet-hero-fade-bottom');
     expect(top.props.className).toBe('absolute inset-x-0 top-0');
     expect(bottom.props.className).toBe('absolute inset-x-0 bottom-0');
-    expect(top.props.style).toEqual({ height: 130, experimental_backgroundImage: 'linear-gradient(to bottom, #0D111780 0%, #0D111700 100%)' });
-    expect(bottom.props.style).toEqual({ height: 160, experimental_backgroundImage: 'linear-gradient(to bottom, #FFFFFF00 0%, #FFFFFF59 35%, #FFFFFFD9 65%, #FFFFFF 100%)' });
+    expect(top.props.style).toEqual({ height: 90, experimental_backgroundImage: 'linear-gradient(to bottom, #0D111780 0%, #0D111700 100%)' });
+    expect(bottom.props.style).toEqual({ height: 100, experimental_backgroundImage: 'linear-gradient(to bottom, #FFFFFF00 0%, #FFFFFF59 24%, #FFFFFFD9 44%, #FFFFFF 100%)' });
     expect(top.props.pointerEvents).toBe('none');
     expect(bottom.props.pointerEvents).toBe('none');
     expect(screen.queryByTestId('pet-hero-fade-top')).toBeNull();
@@ -802,7 +802,7 @@ describe('#195 R18: estados conservados del hero', () => {
     expect(skeleton).toBeVisible();
     expect(skeleton.props.className).toBe('w-full');
     expect(skeleton.props.className).not.toMatch(/\brounded-/);
-    expect(StyleSheet.flatten(skeleton.props.style)).toEqual({ height: 330 });
+    expect(StyleSheet.flatten(skeleton.props.style)).toEqual({ height: 430 });
     expect(screen.getByTestId('pet-hero-photo').children).toEqual([skeleton]);
   });
 
@@ -812,7 +812,7 @@ describe('#195 R18: estados conservados del hero', () => {
     expect(media).toBeOnTheScreen();
     expect(media.props.xml).toBe(blobatar('Luna'));
     expect(media.props.width).toBe('100%');
-    expect(media.props.height).toBe(330);
+    expect(media.props.height).toBe(430);
     expect(screen.getByTestId('pet-hero-dim', { includeHiddenElements: true })).toBeOnTheScreen();
     expect(screen.getByTestId('pet-hero-fade-bottom', { includeHiddenElements: true })).toBeOnTheScreen();
     expect(screen.getByTestId('pet-hero-scrim-top', { includeHiddenElements: true })).toBeOnTheScreen();
```

### Alcance y pendientes de reanudación

Inventario de código/docs/specs contra `98c7a192` en esta parada: solo `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` (autorizado para A). Este reporte se añade sin reescribir lo previo. `traceability.md` conserva sus pendientes A4: no se rellena un cierre que no ocurrió. Producción conserva 330/160/130 y 35%/65%.

Pendientes: medir el rojo de A después de resolver la cuenta; B–E con sus rojos/verdes exactos; m1–m7 (incluidas las dos pasadas de m2) y r1–r6; suite completa 134/4381/1, typecheck con precondición del router, lint sin caché y log vacío, graphify, trazabilidad y cierre final. Ninguna de las trece mutaciones está ejecutada en esta reanudación. No se ejecutaron typecheck, lint ni graphify, y no se creó `.done`.

No se tocaron `progress/current.md`, `progress/history.md`, `STATUS.md`, `feature_list.json`, PR, canvas ni R21; tampoco `home/index.tsx` ni `pingo-phrase.ts`. No hubo denegaciones del sandbox. No se ejecutó prettier ni se añadieron dependencias. El commit de reporte de esta parada es parcial y no sustituye el `docs(home)` del cierre completo que sigue pendiente.


### Continuación por adendo 7 — 2026-10-23

Primer comando confirmado de nuevo: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`; salida `/home/claude/sites/Pet-Tracker-wt-195` y `feature/195-mobile-home-photo-hero-canvas`. HEAD inicial `b264b482`, árbol limpio. Se conservan `21e404c3` y el reporte `0242a473`; esta continuación añade evidencia. El [adendo 7](handoff_mobile-home-photo-hero-canvas-reanudar-7.md) resuelve la discrepancia: fila 7 = **4** tras A, B, C, D y E; ni 14h ni la regex se cambian.

Leídos adendos 7, 6 y todos los anteriores, D6, R1/R3/R17/R18/R20, fila 14, H4, cadena A–E, mutaciones y trazabilidad. Firma humana A4 presente. Skills recargadas: `building-native-ui` (plugin Expo local), `appllama-app-design-skill`, `animate-expo` y `ponytail`. Ninguna de las tres solicitadas falta; `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex y no se buscaron. Sin delegación ni MCP de Appllama. No se ejecuta `./init.sh`.

#### Rojo de A medido sobre el commit existente

Sin tocar tests ni producción, tras `pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh'` vacío en comando propio (bucle sleep 20, máximo 900 s):

`bunx jest src/components/__tests__/pet-hero-header.test.tsx src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000 > ../progress/a4-A-red-195.log 2>&1`, exit **1**, sin pipe.

`Test Suites: 1 failed, 1 passed, 2 total`; **`Tests: 12 failed, 76 passed, 88 total`**. Exactamente los ocho `it` 14a–14h, doce casos; ningún otro. El rojo se registra aquí, sin commit de test nuevo para A.

Nombre completo y Expected/Received (cada bloque reproduce la primera aserción que falla):

- `R1: PetHeroHeader es el único hero compartido › exporta las constantes de dimensión del hero (enmendado por #195 R1)`

```text
expect(received).toBe(expected) // Object.is equality

    Expected: 430
    Received: 330
```

- `R3: el texto del hero va sobre fondo opaco › funde la imagen con scrim superior y degradado inferior (enmendado por #195 R3)`

```text
expect(received).toMatch(expected)

    Expected pattern: /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6}59 24%, #[0-9A-Fa-f]{6}D9 44%, #[0-9A-Fa-f]{6} 100%\)$/
    Received string:  "linear-gradient(to bottom, #0D111700 0%, #0D111759 35%, #0D1117D9 65%, #0D1117 100%)"
```

- `#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 430 como único estilo (enmendado por #195 R1)`

```text
expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R1: frame de 430 y raíz estable › bleed con mascota false y slot false`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R1: frame de 430 y raíz estable › bleed con mascota true y slot true`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R1: frame de 430 y raíz estable › card con mascota false y slot true`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R1: frame de 430 y raíz estable › card con mascota true y slot false`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R2: foto alineada arriba y fundido por identidad › pinta la foto como primera capa absoluta con tamaño y caché estables`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
        "width": "100%",
      }
```

- `#195 R3: degradados exactos sobre la fotografía › resuelve ambos colores en una llamada y conserva alfa, geometría y toques`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "experimental_backgroundImage": "linear-gradient(to bottom, #0D111780 0%, #0D111700 100%)",
    -   "height": 90,
    +   "height": 130,
      }
```

- `#195 R18: estados conservados del hero › sin mascota conserva skeleton sin radio en bleed`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R18: estados conservados del hero › sin mascota conserva skeleton sin radio en card`

```text
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "height": 430,
    +   "height": 330,
      }
```

- `#195 R18: estados conservados del hero › sin foto conserva el blobatar rectangular y los degradados`

```text
expect(received).toBe(expected) // Object.is equality

    Expected: 430
    Received: 330
```

14a aborta en 430/330; sus otras dos aserciones quedan para el verde. 14e aborta en el velo: height 90/130, cadena superior idéntica. 14f recibe las paradas 35%/65% frente a la regex 24%/44%. Las 18 cuentas se re-midieron tras A; coinciden con la columna A de la tabla que se completa a continuación.

Incidencia de edición sin cambios: el primer script de continuación del reporte no encontró el prefijo de estado porque llevaba negrita; abortó antes de escribir. Se corrigió el ancla literal y se conservó el contenido previo.

#### B — modelo y enlace con producción

`1aa57420` — `test(mobile): fadeAlpha de 100 px, referencias del nombre y enlace con producción (R17)`, solo GUARD mediante `git commit --only`. Diff acotado al describe R17 y comprobado por `rg -n` antes del Jest. Rojo medido antes de C, log `progress/a4-B-red-195.log`, exit 1: **`Tests: 13 failed, 76 passed, 89 total`**, `Test Suites: 2 failed, 2 total`. Los doce de A permanecen; único rojo añadido: `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`, primera aserción: Expected pattern `/PET_HERO_FADE_HEIGHT = 100\b/`, Received fuente con `PET_HERO_FADE_HEIGHT = 160` (también conserva `59 35%` / `D9 65%`). Los dos `mantiene referencias y suelos en light/dark` nacen verdes; referencias 7.75/6.74 escritas en el test, sin cambiar suelos ni tolerancia. Las 18 cuentas medidas tras el commit B coinciden (fila 7 = 4).

#### C — producción mínima en verde

`0a630d4b` — `feat(mobile): hero de 430 con degradado de 100 px y velo de 90 px (R1)`, solo `pet-hero-header.tsx` mediante `git commit --only`. Cambian exactamente tres constantes y dos paradas (cuatro líneas), sin clases, comentarios ni otro comportamiento. HERO + GUARD, log `progress/a4-C-green-195.log`, exit 0: **`Tests: 89 passed, 89 total`**, 2 suites verdes. Repetición tras el commit, `progress/a4-C-postcommit-195.log`, exit 0: **`Tests: 89 passed, 89 total`**, 2 suites verdes. Las 18 cuentas tras C coinciden, incluida salida vacía del `330` en src y fila 7 = 4.

El `AGENTS.md` de móvil apunta a la documentación versionada [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), consultada antes del cambio de producción C. La decisión visual y todas las cifras proceden de la spec aprobada.

#### D — rojo exacto y nueva PARADA obligatoria de cuentas

`288ad502` — `test(mobile): la carta lleva las medidas de la Enmienda A4 (R20)`, solo GUARD, creado con `git commit --only`, antes de editar la carta o design.md. Ancla verificada con `grep -n` antes de Jest: un solo `it`, seis `expect` separados, exactamente las seis cadenas literales de tasks R20 (1-A4).

Después del commit: `bunx jest src/components/__tests__/pet-hero-header.test.tsx src/__tests__/home-photo-hero-canvas.test.ts --testTimeout=30000 > ../progress/a4-D-red-195.log 2>&1`, exit **1**, sin pipe y con `pgrep` vacío en comando propio. **`Tests: 1 failed, 89 passed, 90 total`**; `Test Suites: 1 failed, 1 passed, 2 total`. Único rojo: `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`. Primera aserción: Expected substring `alto 430`; Received sección de la carta con `alto 330`, `velo oscuro superior de 130 px` y `degradado inferior de 160 px`. Los tres `it` anteriores de R20 siguen verdes, igual que HERO y GUARD R17.

**Estado vigente: PARADO tras D.** Las cuentas medidas tras el commit D contradicen dos esperados de tasks/adendo 6. No se cambia la spec, las regex, el alcance de las cuentas ni los literales del test para hacerlas coincidir. El adendo 7 solo corrigió la fila 7; no autoriza a corregir estas otras dos. E, m1–m7, r1–r6 y el cierre no se han iniciado.

#### Las 18 cuentas A4, re-medidas tras A, B, C y D

Mismos comandos literales de tasks.md (se sustituye el escape Markdown `\|` por `|`), mismo directorio y sin cambiar las regex. `grep -c` devuelve exit 1 con cuenta 0; eso es normal. Base: la medida original del reporte. La fila 7 queda en **4**, dictamen del [adendo 7](handoff_mobile-home-photo-hero-canvas-reanudar-7.md), no 3. En cada columna se ejecutaron las 18 cuentas de nuevo.

| Fila y cuenta | Base | A | B | C | D |
|---|---:|---:|---:|---:|---:|
| 1: 330 en HERO | 8 | 0 | 0 | 0 | 0 |
| 2: 430 en HERO | 0 | 8 | 8 | 8 | 8 |
| 3: 160/130 en HERO | 4 | 0 | 0 | 0 | 0 |
| 4: 35%/65% en HERO | 2 | 0 | 0 | 0 | 0 |
| 5: 24%/44% en HERO | 0 | 2 | 2 | 2 | 2 |
| 6: height: 90/100 en HERO | 0 | 2 | 2 | 2 | 2 |
| 7: toBe(430/100/90) en HERO | 0 | 4 | 4 | 4 | 4 |
| 8: 330 en src | 2 ficheros | producción:1 | producción:1 | vacía | **1 línea (GUARD)**, [adendo 8](handoff_mobile-home-photo-hero-canvas-reanudar-8.md) |
| 9: constantes antiguas producción | 3 | 3 | 3 | 0 | 0 |
| 10: constantes nuevas producción | 0 | 0 | 0 | 3 | 3 |
| 11: paradas antiguas producción | 1 | 1 | 1 | 0 | 0 |
| 12: paradas nuevas producción | 0 | 0 | 0 | 1 | 1 |
| 13: 104/160 en GUARD | 2 | 2 | 0 | 0 | **1**, [adendo 8](handoff_mobile-home-photo-hero-canvas-reanudar-8.md) |
| 14: 10.79/9.77 en GUARD | 2 | 2 | 0 | 0 | 0 |
| 15: 7.75/6.74 en GUARD | 0 | 0 | 2 | 2 | 2 |
| 16: medidas antiguas carta | 1 | 1 | 1 | 1 | 1 |
| 17: frase nueva carta | 0 | 0 | 0 | 0 | 0 |
| 18: ficheros de geometría | 4 ficheros | 4, mismos ficheros | 4, mismos ficheros | 4, mismos ficheros | 4, mismos ficheros |

Fila 18: siempre `src/components/__tests__/pet-hero-header.test.tsx`, `src/components/pet-hero-header.tsx`, `src/__tests__/consistency-classnames.test.ts` y `src/screens/home/index.test.tsx`.

**Derivas reproducibles introducidas por las aserciones obligatorias de D:**

```bash
# Desde mobile-pet-tracker/, tras 288ad502:
grep -rcE "\b330\b" src --include=*.ts --include=*.tsx | grep -v ":0"
# src/__tests__/home-photo-hero-canvas.test.ts:1
# Esperado de la fila 8: salida vacía tras C y al cierre.

grep -cE "\b(104|160)\b" src/__tests__/home-photo-hero-canvas.test.ts
# 1
# Esperado de la fila 13: 0 tras B y en la columna final.

grep -nE "\b330\b|\b(104|160)\b" src/__tests__/home-photo-hero-canvas.test.ts
# 159:    expect(section).not.toContain('alto 330');
# 161:    expect(section).not.toContain('160 px');
```

Estas dos líneas son precisamente la cuarta y la sexta aserción que tasks R20 (1-A4) exige escribir como literales. En C las dos cuentas eran 0; en D pasan a 1 porque el barrido lee también el texto de GUARD. No son valores antiguos en producción: `pet-hero-header.tsx` ya conserva 430/100/90 y 24%/44%. E solo edita la carta y el primer bloque de design.md, así que por sí solo tampoco cambiaría esas dos coincidencias en src. Hace falta un dictamen del leader sobre los esperados o el alcance de esas ayudas de medición; no se adapta el test para ocultarlas.

#### Diff medido de B, C y D (A ya se conserva arriba)

```diff
diff --git a/mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts b/mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
index 83d61c6a..6929c890 100644
--- a/mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
+++ b/mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
@@ -38,8 +38,8 @@ describe('#195 R17: contraste WCAG contra la peor foto', () => {
   }
   function fadeAlpha(d: number): number {
     if (d <= 56) return 1 - (d / 56) * 0.15;
-    if (d <= 104) return 0.85 - ((d - 56) / 48) * 0.5;
-    return 0.35 * (160 - d) / 56;
+    if (d <= 76) return 0.85 - ((d - 56) / 20) * 0.5;
+    return 0.35 * (100 - d) / 24;
   }

   it.each(['light', 'dark'] as const)('mantiene referencias y suelos en %s', (theme) => {
@@ -68,8 +68,8 @@ describe('#195 R17: contraste WCAG contra la peor foto', () => {
       overGlass(foreground), overGlass(muted),
     ];
     const references = theme === 'light'
-      ? [4.26, 10.79, 4.36, 13.55, 5.70, 4.82, 3.76, 13.71, 3.60]
-      : [6.51, 9.77, 6.67, 12.79, 6.43, 3.93, 6.84, 11.46, 4.79];
+      ? [4.26, 7.75, 4.36, 13.55, 5.70, 4.82, 3.76, 13.71, 3.60]
+      : [6.51, 6.74, 6.67, 12.79, 6.43, 3.93, 6.84, 11.46, 4.79];
     const textFloor = theme === 'dark' ? 4.5 : 4.2;
     const floors = [textFloor, 4.5, textFloor, 4.5, 4.5, 3, 3, 4.5, 3];
     values.forEach((value, i) => {
@@ -77,6 +77,17 @@ describe('#195 R17: contraste WCAG contra la peor foto', () => {
       expect(value).toBeGreaterThanOrEqual(floors[i]);
     });
   });
+
+  it('enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)', () => {
+    const source = read('src/components/pet-hero-header.tsx');
+    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
+    const FADE_HEIGHT = 100;
+    const KNEE_NEAR = 56;
+    const KNEE_FAR = 76;
+    expect(code).toMatch(new RegExp(`PET_HERO_FADE_HEIGHT = ${FADE_HEIGHT}\\b`));
+    expect(code).toContain(`59 ${Math.round(((FADE_HEIGHT - KNEE_FAR) / FADE_HEIGHT) * 100)}%`);
+    expect(code).toContain(`D9 ${Math.round(((FADE_HEIGHT - KNEE_NEAR) / FADE_HEIGHT) * 100)}%`);
+  });
 });

 describe('#195 R19: grep-clean y cuentas conservadas', () => {
@@ -139,6 +150,17 @@ describe('#195 R20: enmienda canónica y continuación de A8', () => {
     expect(normalize(charter.slice(charter.indexOf(heading)).trimEnd())).toBe(normalize(blocks[0]));
   });

+  it('la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas', () => {
+    const heading = blocks[0].split('\n')[0];
+    const section = charter.slice(charter.indexOf(heading));
+    expect(section).toContain('alto 430');
+    expect(section).toContain('velo oscuro superior de 90 px');
+    expect(section).toContain('degradado inferior de 100 px');
+    expect(section).not.toContain('alto 330');
+    expect(section).not.toContain('130 px');
+    expect(section).not.toContain('160 px');
+  });
+
   it('conserva A8 entero y añade la cita nueva como párrafo aparte inmediato', () => {
     expect(charter.split(historicalA8)).toHaveLength(2);
     expect(charter).toContain(historicalA8 + '\n\n' + blocks[1] + '\n\n');
diff --git a/mobile-pet-tracker/src/components/pet-hero-header.tsx b/mobile-pet-tracker/src/components/pet-hero-header.tsx
index c7d74c66..610d0085 100644
--- a/mobile-pet-tracker/src/components/pet-hero-header.tsx
+++ b/mobile-pet-tracker/src/components/pet-hero-header.tsx
@@ -23,12 +23,12 @@ import { PingRing } from './ping-ring';
  * carta pide token a partir de la segunda repetición, y una clase arbitraria de
  * altura está prohibida. Se exporta para los tests, no para otros componentes.
  */
-export const PET_HERO_MEDIA_HEIGHT = 330;
+export const PET_HERO_MEDIA_HEIGHT = 430;

 /** Alto de cada franja de degradado entre la imagen y una banda opaca. */
-export const PET_HERO_FADE_HEIGHT = 160
+export const PET_HERO_FADE_HEIGHT = 100

-export const PET_HERO_SCRIM_HEIGHT = 130;
+export const PET_HERO_SCRIM_HEIGHT = 90;

 const AnimatedView = Animated.createAnimatedComponent(View);

@@ -200,7 +200,7 @@ export function PetHeroHeader({
           className="absolute inset-x-0 bottom-0"
           style={{
             height: PET_HERO_FADE_HEIGHT,
-            experimental_backgroundImage: `linear-gradient(to bottom, ${background}00 0%, ${background}59 35%, ${background}D9 65%, ${background} 100%)`,
+            experimental_backgroundImage: `linear-gradient(to bottom, ${background}00 0%, ${background}59 24%, ${background}D9 44%, ${background} 100%)`,
           }}
         />

```

#### Alcance de esta parada y trabajo pendiente

Commits de la cadena existentes: A `21e404c3`, B `1aa57420`, C `0a630d4b`, D `288ad502`. Falta E; esta parada no es el cierre de A4. Pruebas por árbol de cada commit: A 12/76/88, B 13/76/89 (rojo medido antes del commit sobre el mismo contenido), C 89/89 (también repetido tras el commit), D 1/89/90. Todas las corridas usaron `--testTimeout=30000`, log completo y exit code sin pipe; antes de cada una, comando independiente de `pgrep` con patrón acotado, bucle sleep 20 y máximo 15 minutos. No hubo rojos inesperados ni reintentos por carga, por lo que no se borró perf-cache.

Inventario de código/docs/specs desde `98c7a192`: solo `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` (A), `mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts` (B y D) y `mobile-pet-tracker/src/components/pet-hero-header.tsx` (C). Todos autorizados. El reporte añade esta evidencia; la trazabilidad conserva pendientes A4 porque no se ha cerrado. Ni la carta ni design.md se han editado en esta continuación.

Pendientes: resolver las cuentas 8 y 13, E con su verde exacto de 90/90 y hero-header-amendments, las trece mutaciones (m2 tiene dos pasadas), suite móvil completa 134/4381/1, typecheck con precondición del router, lint sin caché con log vacío, graphify y cierre de trazabilidad/reporte. No se han ejecutado mutaciones ni esos comandos de cierre en esta continuación. No se crea `progress/impl_mobile-home-photo-hero-canvas.done`.

No se tocaron `progress/current.md`, `progress/history.md`, `STATUS.md`, `feature_list.json`, PR, canvas ni R21. Tampoco `home/index.tsx`, `pingo-phrase.ts`, el resto de componentes ni los candados ajenos. No se ejecutó init.sh, prettier ni se añadieron dependencias. No hubo denegaciones del sandbox, rebase, merge ni reescritura de commits. El commit de este reporte documenta una parada parcial y no sustituye al docs(home) de cierre pendiente.


### Continuación por adendo 8 — 2026-10-23

Primer comando confirmado: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`; salida `/home/claude/sites/Pet-Tracker-wt-195` y `feature/195-mobile-home-photo-hero-canvas`. HEAD inicial `59aebafc`, árbol limpio. Leídos adendos 8, 6 y 7; siguen vigentes los anteriores ya leídos. Skills aplicadas en esta conversación: `building-native-ui`, `appllama-app-design-skill`, `animate-expo` y `ponytail`; las tres requeridas se encontraron y cargaron. No se buscaron los cuatro nombres de Expo ausentes de Codex.

El [adendo 8](handoff_mobile-home-photo-hero-canvas-reanudar-8.md) resuelve la parada tras D: filas 8 y 13 = **1 línea (GUARD)** y **1**, respectivamente, tras D y E, por las aserciones negativas literales de R20. La fila 7 sigue en **4** por el adendo 7. Se conserva todo el historial A–D y el reporte `a2130cf1`; solo se actualizan las dos celdas de la tabla solicitadas y se añade esta continuación. No se cambia ninguna regex ni aserción. La nota histórica «PARADO tras D» de arriba queda resuelta por este dictamen.

Se retoma desde E: rojo de D ya medido (1/89/90) antes de cualquier edición de docs, aprobado por el leader. No se repite ni se reescribe B, C o D. Sin init.sh, PR, canvas, cambios de estado de feature ni archivos de seguimiento del leader.

#### E — carta y bloque canónico atómicos

`5bc90baa` — `docs(mobile): carta y bloque de design.md con las medidas de la Enmienda A4 (R20)`, `git commit --only docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`. Dos líneas sustituidas, una en cada fichero, idénticas: frase 1 y frase 2 literales de design §Texto de la Enmienda A4. Solo el primer bloque Markdown y la última sección de la carta. El segundo bloque, la excepción 4,26:1/4,36:1 (suelo 4,2:1), Detalle y tests y la casilla permanecen intactos.

Medido **después** del commit, `progress/a4-E-green-195.log`, exit 0: **`Tests: 90 passed, 90 total`**, `Test Suites: 2 passed, 2 total`. El rojo de D precede a E; ya no hay rojos en HERO o GUARD (R17 y los cuatro it de R20 pasan).

Las 18 cuentas re-medidas después de E coinciden con tasks y los dictámenes 7/8:

| Fila A4 | Tras E medido y correcto |
|---|---|
| 1 | 0 |
| 2 | 8 |
| 3 | 0 |
| 4 | 0 |
| 5 | 2 |
| 6 | 2 |
| 7 | **4**, [adendo 7](handoff_mobile-home-photo-hero-canvas-reanudar-7.md) |
| 8 | **1 línea**, `src/__tests__/home-photo-hero-canvas.test.ts:1`, [adendo 8](handoff_mobile-home-photo-hero-canvas-reanudar-8.md) |
| 9 | 0 |
| 10 | 3 |
| 11 | 0 |
| 12 | 1 |
| 13 | **1**, [adendo 8](handoff_mobile-home-photo-hero-canvas-reanudar-8.md) |
| 14 | 0 |
| 15 | 2 |
| 16 | 0 |
| 17 | 1 |
| 18 | 4 ficheros, los mismos de A–D |

Carta: `grep -cE "alto 330|130 px|160 px" docs/ui-guidelines.md` = **0** y `grep -cE "alto 430.*velo oscuro superior de 90 px.*degradado inferior de 100 px" docs/ui-guidelines.md` = **1**. Las referencias históricas antiguas de design.md se conservan deliberadamente.

#### Mutaciones de A4 — m1 a m7, r1 a r6

Cada corrida usa HERO + GUARD completos, sin filtro de nombre (90 casos), `--testTimeout=30000`, log entero y exit code sin pipe; antes de cada Jest, `pgrep` en comando propio con el patrón acotado de los adendos, bucle sleep 20 y tope 900 s. No se espera a contadores de mocks. El script efímero de /tmp verifica tanto el número como los nombres de todos los rojos contra la tabla de tasks; no modifica ninguna guarda para acomodar resultados. Ninguna mutación se commitea. m2 se mide en dos pasadas como exige tasks.

- **m1**, log `progress/a4-m1-195.log`, exit 1: `Tests:       10 failed, 80 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `R1: PetHeroHeader es el único hero compartido › exporta las constantes de dimensión del hero (enmendado por #195 R1)`
  - `#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 430 como único estilo (enmendado por #195 R1)`
  - `#195 R1: frame de 430 y raíz estable › bleed con mascota false y slot false`
  - `#195 R1: frame de 430 y raíz estable › bleed con mascota true y slot true`
  - `#195 R1: frame de 430 y raíz estable › card con mascota false y slot true`
  - `#195 R1: frame de 430 y raíz estable › card con mascota true y slot false`
  - `#195 R2: foto alineada arriba y fundido por identidad › pinta la foto como primera capa absoluta con tamaño y caché estables`
  - `#195 R18: estados conservados del hero › sin mascota conserva skeleton sin radio en bleed`
  - `#195 R18: estados conservados del hero › sin mascota conserva skeleton sin radio en card`
  - `#195 R18: estados conservados del hero › sin foto conserva el blobatar rectangular y los degradados`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m2i**, log `progress/a4-m2i-195.log`, exit 1: `Tests:       3 failed, 87 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`
  - `R1: PetHeroHeader es el único hero compartido › exporta las constantes de dimensión del hero (enmendado por #195 R1)`
  - `#195 R3: degradados exactos sobre la fotografía › resuelve ambos colores en una llamada y conserva alfa, geometría y toques`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m2ii**, log `progress/a4-m2ii-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m3**, log `progress/a4-m3-195.log`, exit 1: `Tests:       2 failed, 88 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `R1: PetHeroHeader es el único hero compartido › exporta las constantes de dimensión del hero (enmendado por #195 R1)`
  - `#195 R3: degradados exactos sobre la fotografía › resuelve ambos colores en una llamada y conserva alfa, geometría y toques`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m4**, log `progress/a4-m4-195.log`, exit 1: `Tests:       3 failed, 87 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`
  - `R3: el texto del hero va sobre fondo opaco › funde la imagen con scrim superior y degradado inferior (enmendado por #195 R3)`
  - `#195 R3: degradados exactos sobre la fotografía › resuelve ambos colores en una llamada y conserva alfa, geometría y toques`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m5**, log `progress/a4-m5-195.log`, exit 1: `Tests:       3 failed, 87 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`
  - `R3: el texto del hero va sobre fondo opaco › funde la imagen con scrim superior y degradado inferior (enmendado por #195 R3)`
  - `#195 R3: degradados exactos sobre la fotografía › resuelve ambos colores en una llamada y conserva alfa, geometría y toques`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m6**, log `progress/a4-m6-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`


  m6, comprobación de ambas ramas: la corrida original aborta en Expected `59 24%` / fuente con `59 35%`. Para observar también la otra rama sin relajar ni quitar aserciones, se invirtió **solo el orden** de los dos expect de paradas en GUARD temporalmente, con el mismo defecto 35%/65% en producción y HERO. Log `progress/a4-m6-second-branch-195.log`, exit 1: `Tests: 1 failed, 89 passed, 90 total`, único rojo el mismo it de enlace R17, ahora en Expected `D9 44%` / fuente con `D9 65%`. Las dos corridas dejan HERO completo verde. m4 y m5 ya habían observado esas dos ramas por separado. Se revierte también el orden de GUARD, sin modificar B ni las aserciones finales.
  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-hero-header.tsx mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **m7**, log `progress/a4-m7-195.log`, exit 1: `Tests:       2 failed, 88 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R17: contraste WCAG contra la peor foto › mantiene referencias y suelos en light`
  - `#195 R17: contraste WCAG contra la peor foto › mantiene referencias y suelos en dark`

  Revertida con `git checkout HEAD -- mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r1**, log `progress/a4-r1-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r2**, log `progress/a4-r2-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r3**, log `progress/a4-r3-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r4**, log `progress/a4-r4-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r5**, log `progress/a4-r5-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

- **r6**, log `progress/a4-r6-195.log`, exit 1: `Tests:       1 failed, 89 passed, 90 total`. Rojos exactos (resto de HERO + GUARD en verde):

  - `#195 R20: enmienda canónica y continuación de A8 › la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`

  Revertida con `git checkout HEAD -- docs/ui-guidelines.md specs/mobile-home-photo-hero-canvas/design.md`; `git diff --cached` vacío y ficheros idénticos a HEAD.

#### Resumen de sensibilidad de las trece mutaciones

`hero-header-amendments.test.ts` sin tocar, después de E: `progress/a4-E-amendments-195.log`, exit 0, `Test Suites: 1 passed, 1 total`, **`Tests: 6 passed, 6 total`**.

| Mutación | Defecto plantado | Rojo observado / verde conservado |
|---|---|---|
| m1 | MEDIA_HEIGHT 431 | 10 rojos de 14a/b/c/d/g/h; R3, GUARD R17 y comparación simbólica de R2 verdes |
| m2(i) | FADE_HEIGHT 101 solo en producción | 14a, 14e y enlace R17: 3 rojos; 14f simbólico verde |
| m2(ii) | FADE_HEIGHT 101 en producción y las dos referencias de HERO | Solo enlace R17, rama de altura, 1 rojo; HERO completo verde |
| m3 | SCRIM_HEIGHT 91 | 14a y 14e: 2 rojos; 14f y GUARD R17 verdes |
| m4 | 59 25% en producción | 14e, 14f, enlace R17 primera parada: 3 rojos |
| m5 | D9 45% en producción | 14e, 14f, enlace R17 segunda parada: 3 rojos |
| m6 | 35%/65% en producción y ambas cadenas de HERO | Solo enlace R17: 1 rojo, HERO completo verde; ambas ramas observadas (detalle arriba) |
| m7 | Modelo vuelve a tramos 104/160, conserva referencias 7.75/6.74 | Solo modelo light/dark: 2 rojos; HERO y enlace R17 verdes |
| r1 | alto 431 en carta y bloque canónico | Solo ancla R20, aserción positiva alto 430: 1 rojo |
| r2 | velo 91 px en ambas copias | Solo ancla R20, aserción positiva velo 90 px: 1 rojo |
| r3 | degradado 101 px en ambas copias | Solo ancla R20, aserción positiva degradado 100 px: 1 rojo |
| r4 | (antes alto 330) al final de frase 2 en ambas copias | Solo ancla R20, not alto 330: 1 rojo |
| r5 | (antes 130 px) al final de frase 2 en ambas copias | Solo ancla R20, not 130 px: 1 rojo |
| r6 | (antes 160 px) al final de frase 2 en ambas copias | Solo ancla R20, not 160 px: 1 rojo |

Las seis r mantienen en verde la comparación byte a byte y los otros dos it anteriores de R20. Cada una falla precisamente en su propia aserción (no en otra anterior). Las catorce pasadas requeridas (m2 se desdobla) y la observación adicional de segunda rama de m6 están medidas, con nombres y Tests arriba. Todas revertidas; índice vacío. Re-medidas las 18 cuentas tras la última reversión: iguales a las de E.

#### Cadena A–E preservada

| Paso | Commit | Tests medidos sobre su árbol |
|---|---|---|
| A | `21e404c3` | `12 failed, 76 passed, 88 total`, ocho it 14a–14h |
| B | `1aa57420` | `13 failed, 76 passed, 89 total`, añade solo enlace R17 |
| C | `0a630d4b` | `89 passed, 89 total` |
| D | `288ad502` | `1 failed, 89 passed, 90 total`, solo ancla R20, alto 430 |
| E | `5bc90baa` | `90 passed, 90 total`; hero-header-amendments `6 passed, 6 total` |

Los cinco commits usan `git commit --only` y cada commit de test precede a su verde; los rojos de A, B y D se midieron antes de la producción/carta que los ponen verdes. No se ha reescrito ningún commit. No se necesitó refactor ni cambios adicionales de código.

#### Cuentas originales de cierre, además de las 18 de A4

Se repitieron las 21 cuentas anteriores de tasks, mismos comandos y directorios, con estos resultados:

| Fila original de tasks | Resultado |
|---|---|
| 1 | 1 |
| 2 | 1 |
| 3 | 2 |
| 4 | 9 |
| 5 | 1 |
| 6 | 2 |
| 7 | 3 |
| 8 | 1 |
| 9 | 1 |
| 10 | 0 |
| 11 | 4 |
| 12 | 8 |
| 13 | 3 |
| 14 | existen |
| 15 | existen |
| 16 | 6 |
| 17 | 6 |
| 18 | 1 |
| 19 | 2 |
| 20 | 0 |
| 21 | 0 |

La fila 13 original cuenta tres **líneas** con `Enmienda #195`, como antes de A4; la frase nueva usa `Enmienda A4 de #195` y no cambia esa cuenta. Las cuentas de la carta, producción y HERO/GUARD de A4 son las 18 de la tabla de E, con las tres correcciones documentadas por adendos 7 y 8.

#### R21 — añadido A4 al checklist del humano (sin ejecutar ni firmar)

El checklist histórico anterior corresponde al hero original de 330. Para la prueba actual, la altura es **430**, el degradado inferior **100 px** con paradas **24%/44%** y el velo **90 px**. La ejecución y la firma siguen siendo exclusivamente del humano:

- [ ] En claro, oscuro y reduce motion, repetir foto oscura, clara y sin foto, con las interacciones y supuestos 2–5 del checklist anterior.
- [ ] Añadir la foto real de 960×1280 (3:4), recorte alineado arriba y hero de 430; comprobar nombre y raza sobre el degradado de 100 px y fila superior bajo velo de 90 px con el insets.top real.
- [ ] Con nombre de 25 caracteres, anotar si ocupa dos líneas y cómo queda sobre la zona casi sin degradado. Es observación para el humano, no criterio de aceptación ni autorización para añadir numberOfLines.

No se decide ni se modifica O1 (retorno de 160 ms de la burbuja) ni numberOfLines={1}. No se marca R21 ni la feature como done.

#### Cierre automático completo de A4 — 2026-10-23

- Suite móvil completa, una corrida: `bun run test --testTimeout=30000 > ../progress/a4-full-195.log 2>&1`, exit **0**, sin pipe. `Test Suites: 134 passed, 134 total`; **`Tests: 4381 passed, 4381 total`**; `Snapshots: 1 passed, 1 total`; 143.221 s. Frente a la base A4 134/4379/1: **+2 tests**, mismas suites y snapshot. No hubo rojos ni reintentos por carga. No se relajó ningún test de #190.
- Guardas y mapa en verde dentro de esa corrida: `design-drift`, `consistency-classnames`, `legibility-classnames`, `hero-header-amendments`, `tab-headers-canvas`, `alerts-canvas-fidelity`, `ui-language`, `home-photo-hero-canvas`, `screens/map/index.test.tsx` y `components/__tests__/pet-map.test.tsx`. HERO + GUARD había dado 90/90 tras E y hero-header-amendments 6/6, sin tocar ese fichero.
- Tipos: primero `test ! -e .expo/types/router.d.ts`, exit **0**; luego `bun run typecheck > ../progress/a4-typecheck-195.log 2>&1`, exit **0**, log solo `$ tsc --noEmit`. No se borró ni generó router.d.ts.
- Lint: `bunx expo lint --no-cache > ../progress/a4-lint-195.log 2>&1 && test ! -s ../progress/a4-lint-195.log`, exit **0**, log **0 bytes**, sin pipe ni prettier.
- `graphify update . > progress/a4-graphify-195.log 2>&1`, exit **0**. Extracción AST sin LLM: grafo actualizado en graphify-out (ignorado), 27515 nodos, 35560 aristas, 1827 comunidades. Veinte SQL omitidos por la dependencia tree_sitter_sql ausente (mismo límite del cierre anterior); no se instalaron dependencias ni se ejecutó etiquetado semántico. Los nombres de 122 comunidades se recalcularon por su nodo principal.
- Re-medidas las cuentas al terminar: **21 originales y 18 A4 correctas**, con fila 7 = **4** (adendo 7) y filas 8/13 = **1/1** (adendo 8). No quedan mutaciones en código, tests o docs; todo salvo reporte y trazabilidad es idéntico a HEAD tras E. Índice vacío antes del commit final.

Inventario completo de los siete ficheros de implementación/reporte contra `98c7a192` (incluye el cierre de trazabilidad que se commitea junto a este reporte), todos de la lista cerrada:

- `docs/ui-guidelines.md`
- `mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts`
- `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`
- `mobile-pet-tracker/src/components/pet-hero-header.tsx`
- `progress/impl_mobile-home-photo-hero-canvas.md`
- `specs/mobile-home-photo-hero-canvas/design.md`
- `specs/mobile-home-photo-hero-canvas/traceability.md`

El diff global desde `98c7a192` también muestra `progress/current.md` y los handoffs 6, 7 y 8: son commits del leader anteriores al inicio de esta continuación (`59aebafc`), no cambios de implementación. El diff desde ese inicio sobre current/history/STATUS/feature_list es vacío. No se modificaron esos archivos, la PR, el canvas ni R21. La comparación del inventario se acota a los ficheros del implementer y deja explícita esa procedencia.

Trazabilidad A4 completada en R1, R2, R3, R17, R18 y R20 con los hashes A–E; hashes viejos y filas ajenas conservados. R1–R20 quedan verificados automáticamente con A4; R21 permanece para el humano. El reporte mantiene la evidencia histórica de las dos paradas y añade sus resoluciones mediante los adendos 7 y 8. No se ha ejecutado init.sh, ni backend, push, merge, rebase, publicación ni cambios de dependencias.

**Estado vigente: cierre automático de A4 completado.** E, las trece mutaciones (m2 en dos pasadas), suite completa, tipos, lint, graphify, cuentas e inventario están hechos. El commit final `docs(home)` contiene únicamente trazabilidad y este reporte, mediante `git commit --only`. Tras verificar ese commit y el árbol limpio, la última acción crea `progress/impl_mobile-home-photo-hero-canvas.done`, ignorado, con una única línea que apunta a este reporte. No se marca la feature done ni se sustituye la revisión/smoke del leader y del humano.
