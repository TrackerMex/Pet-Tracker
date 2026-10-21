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
