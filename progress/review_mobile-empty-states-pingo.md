# review: mobile-empty-states-pingo (#155)
Fecha: 2026-10-08
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-155, branch feature/155-mobile-empty-states-pingo, HEAD cedb357a (verificado igual a origin)
Base del handoff (H0): d4e044b3
Veredicto: RECHAZADO (ronda 1; la parte de init.sh queda pendiente del log del leader)

El código hace lo que pide la spec, y al leerlo no encontré ningún defecto de comportamiento. El rechazo se debe a cláusulas SHALL de R3, R4, R6, R9 y R11 a las que les falta el candado de alguna rama. En la zona ciega planté mutantes que sobreviven a sus suites. Todos juntos dan un mutante combinado que es un programa válido (`tsc` exit 0) y que pasa las 16 suites acotadas con 934/934 en verde (ver §Observaciones B1-B5). Las listas de `it` de la spec no enumeran esas ramas. Codex siguió la spec, así que el hueco nace en la spec y su cierre pasa por una enmienda, como en #152.

## Checklist C2 — Estado coherente
- [x] Como mucho 1 feature in_progress: `feature_list.json` no tiene ninguna. #155 sigue en `spec_ready`, un estado caducado que el leader actualiza al cerrar (ver No bloqueantes N3)
- [x] progress/current.md describe la sesión activa de #155 hasta el handoff a Codex. «Siguiente paso: init.sh (leader) y reviewer» coincide con el momento actual

## Checklist C3 — Arquitectura
- [x] Móvil: el componente nuevo vive en `src/components/empty-state.tsx`. Las pantallas lo consumen pasando el texto ya traducido, y `EmptyState` no llama a `t()`
- [x] `src/app/(tabs)/food.tsx` es un route que ya pintaba sus vacíos. La spec lo prescribe como fichero, y el cambio no le añade lógica
- [x] Sin cambios en backend ni infra: 0 ficheros fuera de `mobile-pet-tracker/`, `specs/` y `progress/` desde H0
- [x] Sin dependencias nuevas: `git diff --stat d4e044b3 HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` sale vacío

## Checklist C4 — TDD
- [x] R1-R11 tienen cada uno un describe `#155 R<n>: ...` en el fichero que fija la spec. R12 es el smoke humano
- [x] Historial test-primero: 9 pares rojo→verde (R1-R9), más 2 commits de candado (R10, R11) y el de trazabilidad. Volví a reproducir cada rojo y cada verde en árboles desechables (`git archive <c>`) y medí sin pipe:

  **Rojos.** Todos dan exit=1 y todos fallan por aserción, salvo R3, donde la spec espera el `Cannot find module` del componente que todavía no existe.

  | R | Commit | Resultado |
  |---|---|---|
  | R1 | 9ced6cc5 | 19 failed / 43: claves ausentes y filas de §2.21 ausentes |
  | R2 | e3ddd2ab | 7 failed / 90: los 6 WebP ausentes, y `#153 R3 no mete otras poses de Pingo` movido |
  | R3 | d7455e94 | `Cannot find module '../empty-state'`, y consistency-classnames da 16 en vez de 17 (fila nueva `rounded-xl bg-accent`) |
  | R4 | 0c236ef4 | 17 failed / 471 en 5 suites: «pinta la pose, el título y la frase» y «lleva a añadir mascota» × 4 pantallas, más los agregados |
  | R5 | 1226da46 | 5 failed / 68: R5 ×2, más #65 R18 y #78 R12 por la fila de copy nueva |
  | R6 | 13e323e2 | 5 failed / 63: R6 ×2, más #65 R18 y #65 R8 |
  | R7 | 5fdbff46 | 2 failed / 45: R7 ×2 |
  | R8 | dae5d2d6 | 4 failed / 80: R8 ×2, más #41 R10 y #65 R18 |
  | R9 | 2a1e61ba | 5 failed / 91: R9 ×2, más #65 R18 y #65 R6 |

  **Verdes.** Todos dan exit=0: R1 d6528bd0 43/43, R2 d7b6aa28 90/90, R3 22c8d591 91/91, R4 b33be109 471/471, R5 59eb7eca 68/68, R6 344a7fcb 63/63, R7 6e61e1c2 45/45, R8 63e531a9 80/80, R9 8b6eb528 91/91.
- [x] R10 (309570ba) y R11 (25f46e87) son candados sin rojo propio, tal y como fija tasks.md. Codex declara las sondas S1-S3; yo repetí sondas equivalentes (ver §Pruebas de mutación)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente», salvo R12 «pendiente (lo firma el humano)». Es el smoke manual y no bloquea (precedente de #152)
- [x] Los 20 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`, todos 0)
- [x] Formato de commits: `test(mobile-empty-states): #155 R<n> red …` y `feat(mobile-empty-states): #155 R<n> …`. Son 25 commits en `d4e044b3..HEAD`
- [x] Los commits del leader 0fb1718c, 8256d4d5, 059ed18d y 515cc263 solo tocan `progress/handoff_mobile-empty-states-pingo.md` y `specs/mobile-empty-states-pingo/{requirements,tasks}.md`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y tres casillas humanas marcadas (2026-10-08): la aprobación, la clasificación/poses/copy (A1, A2, A7-A9) y la enmienda E1. La firma de E1 está en 515cc263

## Checklist C7 — Sin código huérfano
- [x] Los vacíos sustituidos (8 `Text` y 2 `Card` de geofences y docs) ya no existen. El import de `Card` sigue en uso en los dos ficheros (items de la lista, docs-error, geofences-no-tracking)
- [x] El `it` de geofences que R8 manda borrar está borrado. Lint y typecheck limpios
- [x] Sin restos sueltos de `#155` en producción

## Checklist C8 — Carta UI (docs/ui-guidelines.md + skill expo:expo-overview)
- [x] Cargué `expo:expo-overview`. La tarea es de componente reusable y no anima, así que la tabla «Skills: quién carga qué» no exige ninguna otra (no hay pantalla nueva que pida `appllama-app-design-skill`)
- [x] La imagen va con `expo-image`, con `contentFit="contain"`, y es decorativa (sin `accessibilityLabel`)
- [x] El botón primario es `rounded-xl bg-accent` y `Button.Label` es `font-bold text-accent-foreground`, sin labio `border-b-4` (D4). Sí cumple en HEAD; el hueco del candado está en B1
- [x] Voz de Pingo (§7): primera persona («te aviso», «te ayudo», «te los guardo»), tuteo, sin emoji, sin exclamaciones y terminada en punto, en los dos idiomas. Lo candan R1 y mis sondas
- [x] Los 6 WebP del repo son sha256-idénticos a `/home/claude/pet-tracker-mascot/webp/` (design.md §Assets). Una comparación de píxeles a 64×64 los casa con la lámina correcta: talk 02, sleep 04, clipboard 09, health 07, collar 06 y food 08

## Lista cerrada de ficheros
- [x] Codex tocó 33 ficheros en `d4e044b3..HEAD` (sin contar los de los commits del leader), y todos están dentro de la lista cerrada del handoff:
  - 6 WebP;
  - `empty-state.tsx` y su test;
  - las 8 pantallas y sus tests;
  - `catalog.ts`;
  - `ui-copy-table.ts`, `ui-language.test.ts`, `consistency-classnames.test.ts`, `language-provider.test.tsx` y `welcome/index.test.tsx`;
  - `specs/mobile-ui-language/design.md` (§2.21);
  - `traceability.md` e `impl_mobile-empty-states-pingo.md`.
- [x] Ningún test compara contra `es[...]`/`en[...]` por clave. R1 asevera literales fijos
- [x] Anclas de E1: no queda ningún `as Href` ni `type Href`. El `router.push('/pets/add')` de Inicio está fuera de `QUICK_ACTIONS`, y los candados de #70 R10 y #121 R1 siguen verdes
- [x] Candados agregados (#65 R18, `SCREEN_FILES`, la longitud del catálogo en language-provider, consistency-classnames): los diffs coinciden con la spec

## Pruebas de mutación
Todas las sondas corren en un árbol desechable (`git archive cedb357a` con su propio repo git local), con jest acotado. Tras cada sonda, el árbol vuelve al commit base con `checkout` + `clean`, y `git status` sale vacío. El worktree real no se tocó.

### Sondas cazadas (rojo por aserción)
| Cláusula | Mutante | Lo caza |
|---|---|---|
| R1 formato | exclamación en en/alerts, emoji en es/docs, sin punto final en en/reminders | su `it` «no exclama…» y el «declara…» |
| R2 cabeceras | RIFX, WEBQ, VP8L, bit de alfa a 0, ancho 1023, alto 1023 | cada uno en su línea (55-60) |
| R2 tamaño | > 100 000 bytes | línea 61 |
| R2 poses | `pingo-wink.webp` extra | `#153 R3 no mete otras poses de Pingo` |
| R3 imagen | `alt`/`accessible`/`role` en la imagen | los 6 `it` de pose (el mock mapea `alt` a `accessibilityLabel`) |
| R3 POSES | health apunta a collar | `it` de la pose health |
| R3 acción | `onPress` sin cablear; label fijo | «con acción pinta el botón…» |
| R3 contenedor | `bg-surface` en la raíz | «pinta el contenedor sin tarjeta» |
| R3 clases | título y cuerpo con otra clase | «pinta el título y el cuerpo…» |
| R3 labio | `border-b-4` en el botón | «declara el botón primario sin labio» |
| R4 × 4 pantallas | pose/título/cuerpo/label cambiados; ruta `/(tabs)/profile`, ruta con query, doble push, `router.replace` | los dos `it` de #155 R4 en cada pantalla |
| R5-R9 sin acción | `action` añadida en alerts, reminders, docs, geofences y food-plan | «no ofrece acción» / «no duplica la acción de crear» |
| R5-R8 contenido | pose de alerts, cuerpo de reminders, pose de docs, título de geofences | «pinta la pose, el título y la frase…» |
| R6 `reminders-add-link` | sacado de `reminders-actions` | `#114 R5 … deja Nuevo en su fila` (preexistente) |
| R9 tarjetas | las dos tarjetas ocultas en not-found | `R5 … shows a graceful empty plan and keeps the schedule link` (preexistente) |
| R10 «ningún otro fichero» | `// <EmptyState testID="x" />` plantado en `src/app/(tabs)/_layout.tsx` | «ningún otro fichero usa EmptyState» |
| R10 fila | profile-pets-empty sustituido por un EmptyState importado con alias | la fila de profile (desaparece el `Text`) |
| R11 import | `HomeEntrance` importado con comillas dobles | sobrevive a empty-state.test (59/59), pero lo caza `#152 R5 enteringIds` en home |

### Sondas que sobreviven (verde en su suite acotada)
| Id | Cláusula de la spec | Mutante | Suite | Resultado |
|---|---|---|---|---|
| S1 | R3 «Pinta, en este orden» | título y cuerpo intercambiados | empty-state | 59/59 |
| S2 | R3 «Sin `Card`, sin fondo y sin óvalo» | `<View className="rounded-full bg-surface p-4">` envolviendo la imagen | empty-state | 59/59 |
| S3 | R3 «Sin `Card`…» | `<Card className="bg-surface">` envolviendo la raíz | empty-state | 59/59 |
| S4 | R3 «Sin `size`, sin `variant`… (D4)» | `variant="secondary" size="lg"` en el `Button` | empty-state | 59/59 |
| S5 | R4 «El padre del `Text` sustituido no cambia» (Inicio) | `<View className="rounded-card bg-surface p-4">` alrededor de `home-empty` | home | 220/220 |
| S6 | R4 «El padre… no cambia» (Salud) | `<Card className="p-4">` alrededor de `health-empty`. El candado de #115 usa `within(health-states)`, que solo comprueba que lo contiene, no que sea el padre directo | health | 66/66 |
| S7 | R4 «En el mapa… dentro del `View` `flex-1 items-center justify-center p-6 bg-background`» | ese envoltorio cambiado por un `<View>` pelado | map | 96/96 |
| S8 | R6 «en el sitio del `Text` `reminders-empty`» | bloque de `EmptyState` movido encima del `PetSwitcher` | reminders | 33/33 |
| S9 | R9 «en el sitio del `Text` `food-plan-empty`» | `EmptyState` movido debajo de las tarjetas | food | 61/61 |
| S10 | R9 «Las tarjetas de horario y de historial… siguen igual» | solo `meals-history-link` oculto en not-found | food | 61/61 |
| S11 | R11 «sin animación» / «`EmptyState` no anima» | bucle `Animated` de react-native (`translateY` flotando en un `Animated.View` alrededor de la imagen; imports desde `react`/`react-native`, los dos en la lista blanca) | empty-state | 59/59 |
| S12 | R10 «dejar los 11 estados… como están» | clases de `weight-log-empty` y `vaccines-empty` cambiadas | weight-log + health | 99/99 (no bloqueante, ver N1) |

**Mutante combinado.** S2, S3, S4, S1, S11, S5 (con `rounded-card`), S6, S7, S9, S10 y S12 juntos. Pasa las 16 suites acotadas, 934/934, con exit 0:
- food, map, geofences, health, alerts, reminders, docs;
- ui-language, empty-state, welcome, language-provider;
- design-drift, consistency-classnames, legibility-classnames;
- home, weight-log.

`bunx tsc --noEmit` sobre ese árbol da exit 0. S8 se midió aparte (reminders 33/33).

## Observaciones

### Bloqueantes

**B1. R3: el orden, la ausencia de tarjeta/óvalo y la ausencia de `size`/`variant` no tienen candado (S1-S4).**
- `#155 R3` solo asevera el `className` de la raíz, las clases del título y del cuerpo, la imagen y el botón por testID. Con eso no se ve:
  - el orden de los hijos;
  - un envoltorio intermedio (`Card` u óvalo);
  - las props `size`/`variant`.
- Además, `declara el botón primario sin labio` solo mira `border-b-4`.
- La enmienda debería:
  - aseverar el orden de los hijos de `probe` (imagen, título, cuerpo, acción) y que cada uno es hijo directo de la raíz;
  - fijar el tipo y las props del `Button` (sin `size` ni `variant`), como la spec fija los de `Button.Label`.

**B2. R4: «El padre del `Text` sustituido no cambia» y el envoltorio del mapa no tienen candado (S5-S7).**
- Los dos `it` de `#155 R4` por pantalla miran contenido y navegación, nunca el padre:
  - en Inicio y Salud, un envoltorio nuevo alrededor del `EmptyState` sobrevive;
  - en el mapa, quitar el `View` `flex-1 items-center justify-center p-6 bg-background` sobrevive.
- Hace falta un candado por pantalla, porque la cláusula es universal sobre las cuatro: el padre directo de `<id>`, o, en el mapa, su `className` exacto.
- Comida no la sondeé por separado; la cláusula la cubre igual.

**B3. R6 y R9: «en el sitio del `Text`…» no tiene candado de posición (S8, S9), y en R9 la mitad «historial» de «las tarjetas… siguen igual» tampoco (S10).**
- Mover el `EmptyState` encima del `PetSwitcher` (reminders) o debajo de las tarjetas (food) deja verde su suite.
- El enlace de horario lo protege un `it` preexistente; el de historial no.
- R5, R7 y R8 repiten la cláusula «en el sitio del `Text`». En HEAD está bien implementada, pero no la sondeé:
  - en alerts y geofences la posición la fija la cadena ternaria;
  - docs tiene hermanos (skeleton, error, lista), igual que reminders.
- La enmienda debería decidir pantalla a pantalla si la cláusula lleva candado de orden respecto a sus hermanos.

**B4. R11: «implementar #155 sin animación» / «`EmptyState` no anima» deja pasar la animación de React Native (S11).**
- El candado es una lista blanca de imports más una regex contra Reanimated, `entering=` y `MOTION_`. `Animated` de `react-native` cumple las dos cosas.
- La enmienda debería añadir una rama para `Animated` (por ejemplo, que el fuente no case con `\bAnimated\b`), o enunciar la cláusula como cerrada a esas tres formas.

**B5. Consecuencia común.** Los cuatro huecos caben a la vez en un solo programa válido (el mutante combinado) que deja verdes las 16 suites acotadas. Ningún agregado lo caza.

Sobre la corrección: la implementación de HEAD es correcta en todos estos puntos (lo verifiqué leyendo cada fichero). El cierre es una enmienda de la spec con candados nuevos. Cada uno debe nacer rojo contra su sonda S1-S11, y esas sondas sirven de mutación versionada, como en #152.

### No bloqueantes
- **N1. R10 «como están».** El candado fija la etiqueta y el testID, no las clases. Las líneas de producción de las 12 filas no cambian desde H0 (el diff solo las toca en el test). La spec prescribe exactamente ese candado. Si el humano quiere congelar también el estilo, es una fila más por estado.
- **N2. Lista blanca de R11.** `/from '([^']+)'/g` ignora los especificadores con comillas dobles, y ESLint (eslint-config-expo) no tiene regla de comillas. Hoy el riesgo está acotado:
  - package.json no cambia, así que no puede entrar una dependencia nueva;
  - Reanimated lo caza la otra regex;
  - `HomeEntrance` lo caza #152 R5 en home.

  La regex de R10 `/<EmptyState\b/` tampoco ve un import con alias (eso sí, quitar el `Text` de una fila de R10 lo caza su propia fila). Las dos cosas son adversariales; se pueden apuntar en la enmienda si sale barata.
- **N3.** `feature_list.json` deja #155 en `spec_ready`, y `progress/current.md` sigue en el momento del handoff. Los actualiza el leader al cerrar.
- **N4.** R12 (smoke en dev build de Android) está pendiente del humano.
- **N5.** Todas mis corridas de jest coincidieron con el `./init.sh` de #157 (e2e completo) en wt-157, con la máquina cargada. No salió ningún rojo por timing en tests ajenos a #155, así que no hizo falta repetir con la perf-cache borrada.

## Corridas propias (en cedb357a, sin pipe)
- Jest acotado: 15 suites, 901/901, exit 0. Son las de la feature más los candados afectados: food, map, geofences, health, alerts, reminders, docs, ui-language, empty-state, welcome, language-provider, design-drift, consistency-classnames, legibility-classnames y home.
- `bun run typecheck` (`tsc --noEmit`): exit 0. `.expo/types/router.d.ts` no existía.
- `bun run lint` (`expo lint`): exit 0.
- No corrí `./init.sh`, la suite completa, `test:e2e` ni `db:migrate`, por instrucción del leader.

## Output de ./init.sh — pendiente del log del leader
El leader corre `./init.sh` en cedb357a y me lo envía por SendMessage. Esta sección se completa con ese log. Aunque saliera verde, no cambiaría el veredicto: el rechazo es por B1-B5. Si saliera rojo, se suma como bloqueante.
