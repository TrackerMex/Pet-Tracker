# Implementación #195 — mobile-home-photo-hero-canvas

- Inicio: 2026-10-21; ruta confirmada `/home/claude/sites/Pet-Tracker-wt-195`; branch `feature/195-mobile-home-photo-hero-canvas`.
- H0: `ab33dfd1`. Spec y enmienda aprobadas, D1–D5 firmadas; R21 pendiente del humano.
- Se sigue el handoff específico: no init, no PR, no cambios de estado ni arnés; no dependencias ni regeneración del entorno.
- T0: todas las anclas coinciden; archivos nuevos y `.expo/types/router.d.ts` ausentes. Diff móvil/docs desde H0 limpio.
- Skills cargadas: ponytail, appllama-app-design-skill, animate-expo, building-native-ui, expo-tailwind-setup. Nombres inexistentes según handoff: expo-overview, expo-animation, expo-router, expo-design-system. MCP Appllama no disponible; no se invoca. La carta/spec prevalecen.
- Documentación SDK 57 consultada: https://docs.expo.dev/versions/v57.0.0/ y https://docs.expo.dev/versions/v57.0.0/sdk/image/ .
- Búsqueda de TestId por regex realizada antes de crear nodos. Además de las tres rutas del handoff, Home tiene `/^pet-chip-/` (escenario sin conexión online).

## Ejecución

**Estado: PARADO antes de R14 por caída del supuesto 1. Implementación parcial; no apta para merge ni para declarar done.**

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

**Estado vigente: PARADO en R15.** R14, R9, R10, R11 y R12 terminados con sus mutaciones. R15 solo tiene el commit de test rojo; R16 a R20 y el cierre siguen pendientes. No se crea `.done`.

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
