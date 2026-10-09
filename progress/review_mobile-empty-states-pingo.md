# review: mobile-empty-states-pingo (#155)
Fecha: 2026-10-08
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-155, branch feature/155-mobile-empty-states-pingo, HEAD cedb357a (verificado igual a origin)
Base del handoff (H0): d4e044b3
Veredicto: APROBADO (ronda 2, HEAD 7d10fb25; ver §Ronda 2)
Veredicto ronda 1: RECHAZADO (init.sh verde en 438b3263, corrido por el leader)

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

## Output de ./init.sh (corrido por el leader en 438b3263, exit=0)
El leader lo corrió en 438b3263 con `./init.sh > <log> 2>&1`, sin pipe, y terminó a las 21:06 UTC. El código de producción es idéntico al de cedb357a, porque el único commit extra es este review. Ningún otro init.sh corría a la vez (Frontend confirmó que wt-157 estaba parado). Log entero en `scratchpad/init155-438b3263.log` (27 738 líneas). Estas son sus líneas de resumen:

```
✅ Sin features en progreso (sesión limpia)
✅ Build exitoso
Test Suites: 176 passed, 176 total          (backend unit)
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total              (segundo bloque backend)
Tests:       14 passed, 14 total
Test Suites: 97 passed, 97 total            (mobile jest)
Tests:       2351 passed, 2351 total
✅ Tests pasados
Test Suites: 3 skipped, 29 passed, 29 of 32 total   (e2e)
Tests:       8 skipped, 438 passed, 446 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

No hay regresiones. Jest de móvil imprime el aviso «A worker process has failed to exit gracefully…» (línea 27392 del log), pero no falla ninguna suite. El veredicto sigue siendo RECHAZADO por B1-B5. init.sh no lo cambia.

## Pre-verificación E2 (2026-10-08)

**Veredicto: E2 INSUFICIENTE.** Hay tres huecos bloqueantes, G1-G3, y uno de sitio, G4. Todos están dentro del alcance de B1-B5:
- Cada mutante sobrevive a todos los candados de E2.
- Juntos forman un programa válido que deja verdes los 15 ficheros del cierre, 915/915, con `tsc` exit 0 y lint exit 0.

Todo lo demás de E2 se sostiene:
- la transcripción al handoff es literal;
- las 22 sondas dan exactamente su línea `Tests:`, en rojo por aserción;
- el mutante combinado de la ronda 1 sale en rojo en las cinco suites que toca.

Las tres líneas que cierran G1-G3 ya están medidas (§Candados propuestos). No cambian ninguna cuenta de E2.4.

### Base y método
- Base: `1cbcd4b0`, en `feature/155-mobile-empty-states-pingo`.
- Árbol desechable fuera del worktree, sacado con `git archive 1cbcd4b0` y `node_modules` enlazado. Tiene dos commits locales:
  - `3029acf`, la base;
  - `410035a`, los `it` de E2 aplicados al pie de la letra desde la spec (E2.1, E2.3) y desde el paso 4 del handoff (los 9 `it` de sitio).
- No he tocado el worktree ni ningún fichero de la app. Tras cada sonda, el árbol desechable vuelve a `410035a` con `git status` vacío.
- No he lanzado `init.sh`. Antes de cada corrida pesada comprobé con `pgrep -af '[i]nit\.sh'` que no hubiera ninguno en curso.
- Todo jest con `FORCE_COLOR=0`, sin pipe, y `food` con los paréntesis escapados.

### Transcripción al handoff: sin desviaciones
- **Los `it`:** los 3 de R3, los 2 de R11 y los 9 de sitio coinciden carácter a carácter con la spec. Lo mismo el import de `View`, el marco `probe-frame` de `renderProbe` y la tabla de E2.2 (ancla y hermanos).
- **Cuentas:** cuadran todas con mi medida.

  | Cifra | Qué es |
  |---|---|
  | 62 | empty-state con R3 |
  | 64 | empty-state con R11 |
  | 447 | r4 = 221 + 67 + 62 + 97 |
  | 39 | alerts |
  | 34 | reminders |
  | 16 | docs |
  | 51 | geofences |
  | 63 | food con R9 |
  | 915 | los 15 ficheros |

  Además, GUARDAS = 174 y el reparto de 915 del paso 7 es exacto: home 221, health 67, food 63, map 97, alerts 39, reminders 34, docs 16, geofences 51, welcome 65, language-provider 24, ui-language 30, consistency 55, design-drift 62, legibility 27 y empty-state 64. `tsc` 0 y lint 0 sobre `410035a`.
- **Las listas `git diff --cached`:** con el orden `LC_ALL=C sort` y la lista cerrada de 11, coinciden con los ficheros que tocan los `it`, más impl y traceability.
- **Las 22 líneas `Tests:` de las sondas:** el handoff las copia de E2.5 sin cambios.

### Las 22 sondas de E2.5, medidas
Todas dan exactamente la línea `Tests:` del handoff, en rojo por aserción y nunca por consulta:

| Sondas | Suite | `Tests:` | Matcher |
|---|---|---|---|
| E2-S1, E2-S2 | empty-state | 2 failed, 62 passed, 64 total | `toEqual` |
| E2-S3 | empty-state | 3 failed, 61 passed, 64 total | `toBe` ×2, más `toEqual` de imports |
| E2-S4 | empty-state | 2 failed, 62 passed, 64 total | `toBe` |
| E2-S5, E2-S6 | empty-state | 1 failed, 63 passed, 64 total | `toContain` |
| E2-S7 | empty-state | 2 failed, 62 passed, 64 total | `toEqual` + `not.toMatch` |
| E2-S8 | empty-state | 1 failed, 63 passed, 64 total | `not.toMatch` |
| E2-S9 | empty-state | 2 failed, 62 passed, 64 total | `toHaveLength` + `not.toMatch` |
| E2-S10 | home | 1 failed, 220 passed, 221 total | `toBe` |
| E2-S11 | health | 1 failed, 66 passed, 67 total | `toBe` |
| E2-S12 | food | 1 failed, 62 passed, 63 total | `toBe` |
| E2-S13 | map | 1 failed, 96 passed, 97 total | `toBe` |
| E2-S14 | alerts | 1 failed, 38 passed, 39 total | `toBe` |
| E2-S15 | reminders | 1 failed, 33 passed, 34 total | `toBe` |
| E2-S16 | docs | 1 failed, 15 passed, 16 total | `toBe` |
| E2-S17 | geofences | 1 failed, 50 passed, 51 total | `toBe` |
| E2-S18 | food | 1 failed, 62 passed, 63 total | `toBe` |
| E2-S19 | map | 1 failed, 96 passed, 97 total | `toBe` sobre `className` |
| E2-S20 | reminders | 1 failed, 33 passed, 34 total | `toEqual` |
| E2-S21, E2-S22 | food | 1 failed, 62 passed, 63 total | `toEqual` |

### Sondas de la ronda 1 frente a E2
| Ronda 1 | Equivale a | Estado con E2 |
|---|---|---|
| S1 | E2-S1 | cazada |
| S2 | E2-S2 | cazada |
| S3 | E2-S3 | cazada |
| S4 | E2-S5 | cazada |
| S5 | clase de E2-S10 | cazada |
| S6 | clase de E2-S11 | cazada |
| S7 | E2-S19 | cazada |
| S8 | E2-S20 | cazada |
| S9 | E2-S21 | cazada |
| S10 | E2-S22 | cazada |
| S11 | E2-S7 | cazada |
| S12 | N1 | fuera por decisión del humano; E2 no la empeora (no toca esos 11 ficheros) |

N2 también queda fuera y E2 no la empeora. Al contrario: en `empty-state.tsx` la cierra como efecto lateral, por los imports exactos.

**El combinado de B5 contra E2.** Lo reconstruí con las mismas piezas que la ronda 1 salvo S12, que es N1: E2-S1, S2, S5, S7, S3, S10, S11, S19, S21 y S22, aplicadas a la vez. Sale en rojo en todas las suites que toca, siempre por aserción:

| Suite | Rojos | Qué los caza |
|---|---|---|
| empty-state | 5 failed, 59 passed, 64 total | los dos `…como hijos directos…`, `declara el botón sin size ni variant`, `…importa exactamente…` y `…no anima con Animated…` |
| home | 1 failed, 220 passed, 221 total | sitio |
| health | 1 | sitio |
| map | 1 | sitio |
| food | 2 | sitio de R4 y de R9 |

En la primera corrida, de 4 ficheros en paralelo, el worker de empty-state cayó con «Jest worker encountered 4 child process exceptions». El mutante combinado lleva un `Animated.loop` vivo. Corrida sola, la suite da los 5 rojos por aserción de la tabla. B5, tal como era, queda cerrado.

### Barrido cláusula × rama × candado × sonda (alcance B1-B5)
| Cláusula SHALL | Rama | Candado | Sonda | Estado |
|---|---|---|---|---|
| R3 «Pinta, en este orden» | con acción / sin acción | los dos `…como hijos directos…` (`toEqual`) | E2-S1 | cerrada |
| R3 «Un `View` raíz» | tipo del nodo raíz | ninguno | NTXT | **G3** |
| R3 raíz `className="items-center gap-3 py-8"` | clases | `pinta el contenedor sin tarjeta` (`toHaveProp`, preexistente) | — | cerrada |
| R3 «Sin `Card`» | envoltorio `Card` | marco `toBe` + imports exactos | E2-S3 | cerrada |
| R3 «sin fondo» | envoltorio con fondo | marco `toBe` | E2-S4 | cerrada |
| R3 «sin fondo» | clase de fondo en la raíz | `className` exacto (preexistente) | — | cerrada |
| R3 «sin fondo» | `style` inline en la raíz | ninguno | NBG | **G2** |
| R3 «sin óvalo» | envoltorio óvalo de la imagen | lista de hijos `toEqual` | E2-S2 | cerrada |
| R3 «sin óvalo» | `style` de la imagen | `toEqual({ width: 160, height: 160 })` (preexistente) | — | cerrada |
| R3 «sin óvalo» | `className` en el `Image` | ninguno | NIMG | no bloqueante (ver abajo) |
| R3 botón «sin `size`, sin `variant`» | `size`, `variant`, `variant="primary"`, spread, `border-b-4` | apertura literal + un solo `<Button` | E2-S5, E2-S6 | cerrada; queda el alias más comentario (clase N2) |
| R4 Inicio, Salud, Comida | padre directo | `it` de sitio (`toBe` + `toEqual`) | E2-S10, S11, S12 | cerrada |
| R4 Inicio, Salud, Comida | orden frente a skeleton y error | — | — | equivalente: hermanos excluyentes con el vacío |
| R4 Mapa | envoltorio `flex-1 … bg-background` y abuelo `screen-map` | dos `toBe` | E2-S13, E2-S19 | cerrada |
| R5 alerts | sitio | `it` de sitio | E2-S14 | cerrada |
| R6 reminders | padre, y orden frente a `reminders-actions`, `PetSwitcher` y `reminders-delete-host` | `it` de sitio | E2-S15, E2-S20 | cerrada |
| R6 reminders | orden frente a `reminders-action-error`, hermano condicional que coexiste con el vacío | ninguno | NRAE | **G4** |
| R6 reminders | orden frente a loading y error | — | — | equivalente: excluyentes |
| R7 docs | sitio | `it` de sitio | E2-S16 | cerrada; skeleton, filas y error son excluyentes |
| R8 geofences | sitio | `it` de sitio | E2-S17 | cerrada (*) |
| R9 Comida | sitio | `it` de sitio | E2-S18, E2-S21 | cerrada; `plan-error` es excluyente |
| R9 Comida | tarjeta de horario y de historial | lista de hermanos | E2-S22 | cerrada |
| R11 «no anima» | Reanimated, `entering=`, `MOTION_` | `it` preexistentes | ronda 1 | cerrada |
| R11 «no anima» | `Animated` por import o por `require` | imports exactos + 6 `require` + regex | E2-S7, E2-S9 | cerrada |
| R11 «no anima» | `transition`, `animate-*`, `LayoutAnimation` | regex | E2-S8 | cerrada |
| R11 «no anima» | hooks de `react` | imports exactos | E2-S7 | cerrada |
| R11 «sin animación» | la pose misma animada (WebP animado) | ninguno | ANIM | **G1** |

(*) En geofences, `geofences-action-error` va después de `geofences-add`, y solo el dueño provoca acciones, así que solo él lo ve. Mover el vacío detrás del error obliga a pasar `geofences-add`, y eso lo caza el `toEqual`.

### Huecos

**G1. R11 «implementar #155 sin animación»: una pose animada sobrevive (B4).**
- *Mutante:* `assets/images/pingo-talk.webp` sustituido por un WebP animado. Lo generé con Pillow a partir del mismo `pingo-talk.webp`:
  - 89 330 bytes, 1024×1024;
  - VP8X con flags `0x12` (alfa y animación) y 2 frames `ANMF`.
- *Medida:* empty-state + welcome, 129/129. Dentro del combinado, 915/915.
- *Por qué sobrevive:*
  - El `it.each` de R2 y el candado de poses de #153 R3 solo miran `bytes[20] & 0x10` (alfa), la cabecera, el tamaño en píxeles y el peso.
  - El bit de animación (`0x02`) no lo mira nadie.
  - Los candados de R11 leen solo el fuente de `empty-state.tsx`.
- *Por qué importa:* `expo-image` reproduce los WebP animados por defecto. La pantalla se movería sin tocar una línea de código, y además fuera del alcance de reduce motion. R11 dice que, si la pose flota, eso exige una enmienda con su propio requisito de reduce motion.

**G2. R3 «Sin `Card`, sin fondo y sin óvalo»: un fondo inline en la raíz sobrevive (B1).**
- *Mutante:* la raíz como `<View testID={testID} className="items-center gap-3 py-8" style={{ backgroundColor: "white", borderRadius: 24 }}>`. Es una tarjeta blanca redondeada sin `Card`.
- *Medida:* empty-state + design-drift + consistency + legibility, 208/208, `tsc` 0. Dentro del combinado, 915/915.
- *Por qué sobrevive:*
  - El marco `probe-frame` solo caza envoltorios.
  - `pinta el contenedor sin tarjeta` solo asevera `className`.
  - design-drift prohíbe hex y `StyleSheet`, no colores con nombre en un `style` inline.
  - E2.1 dice que «el marco caza… un `View` con fondo», pero la raíz misma con fondo no es un envoltorio.

**G3. R3 «Un `View` raíz»: una raíz `Text` sobrevive (B1).**
- *Mutante:* `<Text testID={testID} className="items-center gap-3 py-8">…</Text>` en lugar de `<View …>`.
- *Medida:* empty-state + alerts + geofences, 154/154, `tsc` 0. Dentro del combinado, 915/915.
- *Por qué sobrevive:*
  - Las listas de hijos usan el testID del nodo raíz, nunca su `type`.
  - El candado de imports sigue viendo `Text, View`.
  - En el combinado, `expo lint` sale con exit 0 y un único *warning*: `'View' is defined but never used`. El `lint` de móvil (`expo lint`, el que corre `init.sh`) no usa `--max-warnings`.
- *Notas:*
  - Un `Text` raíz anida los hijos como texto: en Android cambia el layout (flex) y la accesibilidad del bloque.
  - La variante que mantiene `View` en uso (`const Root = action ? Text : View`) tumba `tsc` con TS2604, así que no la cuento.

**G4. R6 «en el sitio del `Text` `reminders-empty`»: el orden frente a `reminders-action-error` no tiene candado (B3).**
- *Mutante:* el bloque del `EmptyState` movido detrás del bloque `{actionError ? (…) : null}`.
- *Medida:* reminders, 34/34. Dentro del combinado, 915/915.
- *Por qué sobrevive:* el `it` de sitio arregla solo el estado sin `actionError`, y su lista de hermanos no contiene el error.
- *Es alcanzable:*
  - `actionError` solo se limpia al perder el foco, al empezar otro borrado o al abrir el diálogo.
  - Un borrado fallido, seguido de un cambio a una mascota sin recordatorios (o de un refetch que vacía la lista), deja los dos visibles.
  - En la base `fca7c399`, el `Text` `reminders-empty` estaba encima del error.
- *Alcance de la decisión:* la decisión del humano habla de «posición entre sus hermanos» sin acotar el estado. Que este caso cuente como rama o como delimitación lo decide el humano. Si es delimitación, que E2 lo diga.

**NIMG, no bloqueante.**
- *Mutante:* `className="rounded-full bg-surface"` en el `Image`.
- *Medida:* 208/208 y `tsc` 0.
- *Por qué no bloquea:* lo considero inerte en runtime. Uniwind no mapea `className` en componentes que no sean del núcleo de RN ni estén envueltos con `withUniwind`, y en el repo no hay ninguno. El `style` de la imagen sí está candado con `toEqual`.
- *Candado si se quiere:* `expect(image.props.className).toBeUndefined()` en el `it.each` de poses.

### Candados propuestos (medidos en el árbol desechable)
Son tres líneas dentro de `it` que ya existen en `src/components/__tests__/empty-state.test.tsx`, así que no cambia ninguna cuenta: empty-state sigue en 64 y el total en 915. Con ellas, HEAD da 64/64 y cada mutante cae por aserción:

| Hueco | Línea | Dónde | Rojo medido |
|---|---|---|---|
| G1 | `expect(bytes[20] & 0x02).toBe(0);` | `it.each` de R2, debajo de la del alfa | ANIM: 1 failed, 63 passed, 64 total (`toBe`, `pingo-talk.webp`) |
| G2 | `expect(root.props.style).toBeUndefined();` | los dos `…como hijos directos…`, debajo del `toBe` del marco | NBG: 2 failed, 62 passed, 64 total (`toBeUndefined`) |
| G3 | `expect(root.type).toBe('View');` | los dos `…como hijos directos…`, debajo del `toBe` del marco | NTXT: 2 failed, 62 passed, 64 total (`toBe`) |

G1 conviene replicarla en el candado de poses de #153 R3 en welcome si se quiere cubrir también `pingo-wave*`. Está fuera de #155 y no la he medido.

G4 tiene dos opciones, sin medir:
- **(a) Arreglo en el `it` de sitio de R6:** forzar un borrado fallido y cambiar a una mascota sin recordatorios, y esperar `['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-action-error', 'reminders-delete-host']`. Es caro.
- **(b) Candado de fuente en reminders:** `source.indexOf('testID="reminders-empty"') < source.indexOf('testID="reminders-action-error"')`. Es barato.

### El combinado nuevo (G1 + G2 + G3 + G4 + NIMG)
- **Mutante:**
  - raíz `<Text … style={{ backgroundColor: "white", borderRadius: 24 }}>`;
  - `className` óvalo en el `Image`;
  - `pingo-talk.webp` animado;
  - reminders con el vacío detrás de `actionError`.
- **Los 15 ficheros del cierre**, en tres corridas:

  | Corrida | Ficheros | Resultado |
  |---|---|---|
  | 1 | empty-state, welcome, language-provider y las 4 GUARDAS | 327/327 |
  | 2 | health, food, alerts, reminders, docs, geofences | 270/270 |
  | 3 | home, map | 318/318 |

  En total, **915/915, exit 0**.
- **Typecheck y lint:** `bunx tsc --noEmit` exit 0. `bunx expo lint --no-cache` exit 0, con 1 warning (el `View` sin usar de G3). Sin G3, el lint queda limpio: ese era el único aviso.
- **Conclusión:** es el equivalente de B5 para E2. Un programa válido que deja verde todo el cierre y que incumple R3 (dos ramas), R6 y R11.

### Concurrencia y ruido
- **Componente (E2-S1 a E2-S9, al menos E2-S1 a E2-S3):** se midieron mientras corría el `init.sh` ajeno de wt-18 (pid 975770). Aun así dieron sus cifras exactas. Las sondas de pantalla corrieron con ese `init.sh` ya terminado.
- **Flake de map:** en la corrida de 4 suites (home, health, food y map, sobre `410035a`) falló 1 test de 448. Fue `R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)`, por timeout de `waitFor` en la línea 312. No es de #155 y corre antes del `it` nuevo. Borré la perf-cache de jest del árbol desechable y repetí map solo: 97/97. Lo tomo como flake por carga.
- **Combinado de B5:** en la corrida en paralelo, el worker de empty-state cayó (ver arriba). Solo, da sus rojos por aserción.

## Re-pre-verificación E2

**Veredicto: E2 SUFICIENTE.** Las cuatro respuestas son afirmativas:
- los literales nuevos nacen verdes y las cuentas no se mueven;
- E2-S23 a E2-S27 dan exactamente su línea `Tests:`, en rojo por aserción;
- ningún mutante de sitio de reminders sobrevive con el error visible;
- el combinado G1 + G2 + G3 + G4 + NIMG cae en rojo, por aserción, en las dos suites que toca.

G1-G4 quedan cerrados. No queda ningún hueco bloqueante dentro del alcance B1-B5.

### Base y método
- **Base:** `459e9f6c`, sacada con `git archive` de `mobile-pet-tracker`, `specs`, `progress` y `docs` a un árbol desechable fuera del repo. `node_modules` es un symlink al del worktree.
- **Commits del árbol desechable:** `377795c` base, `21a7365` paso 3a (R3), `7737bde` paso 3b (R11) y `d3219fc` paso 4 (los 9 `it` de sitio).
- **Fuente de los literales:** los `it` y las líneas se insertaron leyendo la spec y el handoff de ese mismo árbol, no copiados a mano. El `it` nuevo de R6 es idéntico en `requirements.md` (E2.2) y en el handoff (paso 4). Las líneas de 3a (`className` del `Image`) y 3b (`0x02`) también están en los dos.
- **Ni `init.sh` ni suite completa.** Solo jest acotado, `tsc` y lint. `pgrep -af '[i]nit\.sh'` vacío antes de cada corrida. El worktree no se tocó: sigue en `459e9f6c`, limpio, salvo esta subsección, sin commitear.

### 1. Literales y cuentas: verdes, sin cambios
| Paso | Corrida | Resultado |
|---|---|---|
| 3a (E2.1, R3) | empty-state | 62 passed, 62 total, exit 0 |
| 3b (E2.3, R11) | empty-state | 64 passed, 64 total, exit 0 |
| 3b | GUARDAS | 174 passed, 174 total, exit 0 |
| 4 (E2.2, sitio) | reminders | 34 passed, 34 total, exit 0 |

- **Typecheck:** `bunx tsc --noEmit` exit 0, tras borrar `.expo/types/router.d.ts`.
- **Lint:** `bunx expo lint --no-cache` exit 0, sin avisos. La primera corrida usó la cache por defecto; la repetí con `--no-cache`.
- **Los 15 ficheros del cierre**, en tres corridas sin pipe:

  | Corrida | Ficheros | Resultado |
  |---|---|---|
  | 1 | empty-state, welcome, language-provider y las 4 GUARDAS | 327/327 |
  | 2 | health, food, alerts, reminders, docs, geofences | 270/270 |
  | 3 | home, map | 318/318 |

  En total, **915/915, exit 0**. Las cuentas siguen en 62, 64, 34 y 915.
- Respecto a la pre-verificación sobre `1cbcd4b0`, el único `it` de sitio que cambia es el de reminders.

### 2. Sondas del paso 6, medidas una a una
Cada sonda se plantó sobre `d3219fc`, se corrió en su suite acotada y se restauró después. `git status` quedó limpio tras cada una.

| Sonda | Mutación (E2.5) | Esperado | Medido | `it` y aserción que caen |
|---|---|---|---|---|
| E2-S23 | bit `0x02` de VP8X puesto con el one-liner de `node` de la spec | 1 failed, 63 passed, 64 total | igual | fila `pingo-talk.webp` del `it.each` de R2, `expect(bytes[20] & 0x02).toBe(0)` |
| E2-S24 | `style` con fondo en la raíz | 2 failed, 62 passed, 64 total | igual | los dos `…como hijos directos…`, `toBeUndefined` de `root.props.style` |
| E2-S25 | raíz `Text` | 2 failed, 62 passed, 64 total | igual | los dos `…como hijos directos…`, `expect(root.type).toBe('View')` |
| E2-S26 | `className="rounded-full bg-surface"` en el `Image` | 6 failed, 58 passed, 64 total | igual | las seis filas de `pinta la pose %s…`, `toBeUndefined`. Recibido: `"rounded-full bg-surface"` |
| E2-S27 | vacío debajo de `actionError` | 1 failed, 33 passed, 34 total | igual | el `it` de sitio de R6, segundo `toEqual` (`slotWithError`) |
| E2-S15 | `reminders-empty` envuelto | 1 failed, 33 passed, 34 total | igual | el `it` de sitio de R6, `toBe('screen-reminders')` del abuelo |
| E2-S20 | vacío encima del PetSwitcher | 1 failed, 33 passed, 34 total | igual | el `it` de sitio de R6, primer `toEqual` |

La salida de E2-S20 también muestra un marco de `selected-pet-provider.tsx:31`. Es un `console.error` de `act(...)`, igual que en la corrida verde (15-16 avisos de ese tipo en todas), y no un fallo. El único `●` es el `it` de sitio.

### 3. Barrido de las ramas que abre el `it` de R6
Con el error visible, el segundo `toEqual` fija la lista completa de hermanos:

`reminders-actions`, PetSwitcher (`RCTScrollView`), `reminders-empty`, `reminders-action-error`, `reminders-delete-host`.

Carga, error de carga y lista son excluyentes con el vacío, así que no coexisten con él. Mutantes de sitio con el error visible:

| Mutante | Resultado | Aserción |
|---|---|---|
| NRAE (= E2-S27): vacío debajo de `actionError` | 1 failed, 33 passed, 34 total | segundo `toEqual` |
| R6W: vacío envuelto en `<View>` solo mientras hay `actionError` | 1 failed, 33 passed, 34 total | segundo `toEqual` (la lista pasa a ser solo `['reminders-empty']`) |
| R6H: vacío oculto mientras hay `actionError` (`&& !actionError`) | 1 failed, 33 passed, 34 total | `findByTestId('reminders-empty-pose')` de la línea 1037: **rojo por consulta**, esperado porque el nodo desaparece |
| Error encima del PetSwitcher, o vacío detrás de `delete-host`, solo con error | por análisis | el segundo `toEqual` fija el orden completo |

Sin error, el primer `toEqual` y el `toBe` del abuelo siguen cubriendo E2-S15 y E2-S20. **No sobrevive ningún mutante de sitio.**

### 4. El combinado nuevo (G1 + G2 + G3 + G4 + NIMG), ahora en rojo
- **Mutante:** el mismo de la pre-verificación, aplicado sobre `d3219fc`:
  - raíz `<Text … style={{ backgroundColor: "white", borderRadius: 24 }}>`;
  - `className` óvalo en el `Image`;
  - `pingo-talk.webp` animado (VP8X `0x12`, 89 330 bytes, por debajo del tope de 100 000);
  - reminders con el vacío detrás de `actionError`.
- **Corrida:** empty-state + reminders, exit 1, `Tests: 10 failed, 88 passed, 98 total`. Ningún `TypeError`, ni `Unable to find`, ni caída de worker.

  | Rojos | Aserción |
  |---|---|
  | 1, fila `pingo-talk.webp` de R2 | `expect(bytes[20] & 0x02).toBe(0)` |
  | 6, filas `pinta la pose %s…` | `expect(image.props.className).toBeUndefined()` |
  | 2, `…como hijos directos…` | `expect(root.type).toBe('View')` |
  | 1, `it` de sitio de R6 | segundo `toEqual` |

- En el combinado, el `style` de G2 queda tapado por G3: `root.type` cae antes, en el mismo `it`. E2-S24 demuestra por separado que la línea de G2 lo caza.
- Tras la corrida, el árbol quedó restaurado. La corrida de control de empty-state + reminders sobre `d3219fc` limpio da 98/98, exit 0.

### Observaciones no bloqueantes
1. **El `it` de R6 depende de un comportamiento ajeno a R6.** Supone que `actionError` sobrevive al cambio de mascota. Hoy es así: `onSelect={selectPet}` no lo limpia, solo lo limpian el blur (`useFocusEffect`), `handleDelete` y `confirmDelete`. Si una feature futura limpia el error al cambiar de mascota, este `it` caerá en el segundo `toEqual` sin que R6 se incumpla. Quien lo vea en rojo debe mirar primero ese cambio.
2. **Residual de G1, misma clase que N2.** Un WebP con chunks `ANMF` pero con el flag `0x02` apagado sigue pasando. Es un fichero que incumple la especificación del contenedor WebP, no una pose animada válida. Sigue fuera de alcance, como N2.

### Concurrencia y ruido
- No hubo ningún `init.sh` en curso durante las corridas: `pgrep` dio exit 1 antes de cada una.
- No hubo flakes. Ninguna corrida necesitó borrar la perf-cache.

## Ronda 2 (2026-10-08)

Veredicto: APROBADO (ronda 2; HEAD 7d10fb25, init.sh verde en 7d10fb25, corrido por el leader)

E2 cierra B1-B5 solo con tests y sin tocar producción. Los 14 `it` nuevos son copia literal de la spec. Medí las 27 sondas de E2.5 y el combinado G1+G2+G3+G4+NIMG en un árbol desechable: todas dan rojo por aserción en el `it` que nombra la spec, con las mismas líneas `Tests:` que reporta Codex. En el barrido no aparece ninguna rama ciega nueva. R12 queda pendiente: es del humano.

### Base y método
- Worktree `/home/claude/sites/Pet-Tracker-wt-155`, branch `feature/155-mobile-empty-states-pingo`, HEAD `7d10fb25`, igual a `origin/feature/155-mobile-empty-states-pingo`. La base del handoff de E2 (E2H) es `adee148a`.
- Árbol desechable fuera del repo: `git archive 7d10fb25` de `mobile-pet-tracker/`, `specs/`, `progress/` y `docs/`, más `git init` (commit base `72c5cd0`) y `node_modules` enlazado al de wt-155.
- Corrí cada sonda con `FORCE_COLOR=0 bunx jest <suite>` y medí el exit code sin pipe. Clasifiqué cada fallo leyendo la primera línea de cada bloque `●`: aserción `expect(...)`, consulta (`Unable to find`) u otro.
- Tras cada sonda restauré con `git checkout HEAD -- .` y comprobé `git diff --quiet && git diff --cached --quiet`: limpio=0 en todas.
- No corrí la suite entera. Antes de cada jest comprobé `pgrep -af 'init\.sh|test:e2e|jest-e2e'`.
- Concurrencia: durante S10, S13 y S19 corría el e2e de backend de #161 (`pnpm test:e2e media-docs`). Las cuentas `Tests:` salieron exactas y no hubo ningún rojo inesperado que repetir.
- No corrí `init.sh`, por instrucción del leader. Lo leí del log.

### 1. HEAD e init.sh
- `git rev-parse HEAD origin/feature/155-mobile-empty-states-pingo`: los dos dan `7d10fb25875043b5f93ce286f8b860f2232d667f`.
- Log `scratchpad/init155-7d10fb25.log`:
  - Backend: 176/176 suites con 1348/1348 tests, y luego 2/2 suites con 14/14 tests.
  - Móvil: 97/97 suites con **2365/2365** tests.
  - e2e: 29 suites pasan y 3 se saltan de 32; 438 tests pasan y 8 se saltan de 446.
  - `✅ Lint sin errores`, sin warnings entre `$ expo lint` y el ✅. `✅ Typecheck sin errores`. `✅ Todo verde`. `exit=0`.
- Hay un aviso de force-exit de un worker en la línea ~27565 del log. Es ruido de jest, no un fallo.
- 2365 coincide con E2.4: 2351 de la base más los 14 `it` de E2.

### 2. Lista cerrada
`git diff --stat adee148a..7d10fb25` toca 11 ficheros:
- Los 9 tests de E2.4:
  - `src/components/__tests__/empty-state.test.tsx`
  - `src/screens/{home,health,map,alerts,reminders,docs,geofences}/index.test.tsx`
  - `src/app/(tabs)/__tests__/food.test.tsx`
- `progress/impl_mobile-empty-states-pingo.md`
- `specs/mobile-empty-states-pingo/traceability.md`

No hay ningún fichero de producción. `git diff --stat adee148a..7d10fb25 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/app.json mobile-pet-tracker/src/theme` sale vacío. El rango `8c142376..adee148a` no toca `mobile-pet-tracker/`.

### 3. Cuentas de E2.4
| Suite | Base `adee148a` | HEAD `7d10fb25` | Δ |
|---|---|---|---|
| empty-state | 59 | 64 | +5 |
| home | 220 | 221 | +1 |
| health | 66 | 67 | +1 |
| food | 61 | 63 | +2 |
| map | 96 | 97 | +1 |
| alerts | 38 | 39 | +1 |
| reminders | 33 | 34 | +1 |
| docs | 15 | 16 | +1 |
| geofences | 50 | 51 | +1 |
| **Total** | **638** | **652** | **+14** |

Las 9 suites en HEAD dan 652/652, exit 0, igual que E2.4. Con el resto de la suite móvil suman 2365, la cifra de init.sh.

### 4. Transcripción spec → test
Comparé el diff `adee148a..7d10fb25` con E2.1-E2.3 línea a línea. Todo es literal y no hay desviaciones:
- **E2.1, `empty-state.test.tsx`:**
  - Añade `import { View } from 'react-native';`.
  - `renderProbe` va envuelto en el `probe-frame`.
  - El `it.each` de poses termina en `expect(image.props.className).toBeUndefined();`.
  - Los 3 `it` de R3 van al final del describe de R3, con los textos y aserciones de la spec: orden de hijos, `root.type`, botón en fuente.
- **E2.2, los 9 `it` de sitio** (ancla de padre/abuelo y lista de hermanos exactas por tabla). Los arrange coinciden con el `it` hermano de cada suite; geofences va sin `const empty`, como en la spec.
  - home: `'home-states'`, `['Text','home-empty']`
  - health: `'health-states'`, `['Text','health-empty']`
  - food R4: abuelo `'screen-food'`, `['Text','food-empty']`
  - map: className `'flex-1 items-center justify-center p-6 bg-background'` y abuelo `'screen-map'`, `['map-no-pets']`
  - alerts: abuelo `'alerts-list'`, `['alerts-empty']`
  - reminders: el bloque literal de R6 con sus dos listas
  - docs: abuelo `'screen-docs'`, `['View','docs-empty']`
  - geofences: abuelo `'screen-geofences'`, `['geofences-empty','geofences-add']`
  - R9: bisabuelo `'screen-food'`, `['food-plan-empty','meal-schedule-link','meals-history-link']`
- **E2.3:** los 2 `it` de R11 van al final del describe de R11, y `expect(bytes[20] & 0x02).toBe(0);` va bajo la línea del alfa.

### 5. Sondas E2.5 y combinado
Las 27 sondas dan rojo por aserción en el `it` que nombra la spec. Ninguna da rojo por consulta ni por excepción.

| Sonda | `Tests:` | Matcher / sitio |
|---|---|---|
| S1, S2 | 2 failed, 62 passed, 64 total | `toEqual` |
| S3 | 3 failed, 61 passed, 64 total | `toBe` ×2 + `toEqual` de imports |
| S4 | 2 failed, 62 passed, 64 total | `toBe` |
| S5, S6 | 1 failed, 63 passed, 64 total | `toContain` |
| S7 | 2 failed, 62 passed, 64 total | `toEqual` + `not.toMatch` |
| S8 | 1 failed, 63 passed, 64 total | `not.toMatch` |
| S9 | 2 failed, 62 passed, 64 total | `toHaveLength` + `not.toMatch` |
| S10 | 1 failed, 220 passed, 221 total | `toBe` `home-states` |
| S11 | 1 failed, 66 passed, 67 total | `toBe`/`toEqual` de sitio |
| S12, S18 | 1 failed, 62 passed, 63 total | `toBe` |
| S13, S19 | 1 failed, 96 passed, 97 total | `toBe` de className |
| S14 | 1 failed, 38 passed, 39 total | sitio alerts |
| S15 | 1 failed, 33 passed, 34 total | `toBe` `screen-reminders` |
| S16 | 1 failed, 15 passed, 16 total | sitio docs |
| S17 | 1 failed, 50 passed, 51 total | sitio geofences |
| S20 | 1 failed, 33 passed, 34 total | `toEqual` |
| S21, S22 | 1 failed, 62 passed, 63 total | `toEqual` |
| S23 | 1 failed, 63 passed, 64 total | `toBe`, `bytes[20] & 0x02`, fila `pingo-talk.webp` |
| S24 | 2 failed, 62 passed, 64 total | `toBeUndefined` |
| S25 | 2 failed, 62 passed, 64 total | `toBe` `root.type` |
| S26 | 6 failed, 58 passed, 64 total | `toBeUndefined` className, las 6 poses |
| S27 | 1 failed, 33 passed, 34 total | segundo `toEqual`, `slotWithError` |

Codex reporta las mismas 27 líneas `Tests:` en impl §Reanudacion 3, cada una con limpio=0. No hay discrepancias.

**Combinado G1+G2+G3+G4+NIMG.** Este mutante reúne las cuatro mutaciones:
- raíz `<Text … style={{backgroundColor:"white",borderRadius:24}}>`
- `className` en la Image
- bit 0x02 encendido en el VP8X de `pingo-talk.webp`
- vacío de reminders tras `actionError`

Sobre empty-state + reminders da exit 1 con `Tests: 10 failed, 88 passed, 98 total`:
- 1 × `bytes[20] & 0x02`
- 6 × `image.props.className`
- 2 × `root.type`
- 1 × `slotWithError` `toEqual`

No hay ningún fallo de suite ni de consulta. Es el rojo que predijo la re-pre-verificación: el combinado que en la ronda 1 pasaba en verde ahora cae.

### 6. Barrido R3-R9 y R11
Ahora que los tests son literales a la spec, el barrido de la pre-verificación y de la re-pre-verificación (B1-B5, G1-G4, NIMG) se mantiene. Además medí estas ramas candidatas nuevas en el árbol desechable:

| Rama candidata | Cláusula | Mutante | Resultado |
|---|---|---|---|
| `alt` en expo-image | R3 «decorativa: sin `accessibilityLabel`» | `alt="Pingo"` en la Image | Rojo por aserción, `Tests: 6 failed, 58 passed, 64 total`. Las 6 poses fallan en `expect(image.props.accessibilityLabel).toBeUndefined()` con `Received: "Pingo"`, porque expo-image mapea `alt` a la etiqueta. Cubierta |
| Contenedor animado en Inicio | R11 «sin animación» | `home-states` como `Animated.View entering={homeEntering(0, 0)}` | Rojo por aserción, `Tests: 4 failed, 217 passed, 221 total`. Caen `#152 R5 › no da entrada a home-states con home-empty`, más las de loading y error, por `enteringIds` = `[]`, y además el `toEqual` del safe area de R6. Cubierta por un candado previo |
| Contenedor animado en Salud | R11 «sin animación» | `health-states` como `Animated.View entering={FadeIn}`, con import | Rojo por aserción, `Tests: 6 failed, 61 passed, 67 total`. Caen los 5 `it` de `#115 R2 … agrupa título y rama en health-states` y el de safe area: el `toEqual` del style recibe un array. Cubierta por un candado previo, aunque de rebote |

Las otras pantallas no importan reanimated. R11 define «sin animación» con sus viñetas: el fuente de `EmptyState`, más el asset desde E2.3. Animar un contenedor de pantalla que ya existía antes de #155 y que comparten carga y error es una delimitación, no una rama de la cláusula. Ver N2.

No queda ninguna rama ciega bloqueante.

### 7. Historial
Todos los commits de `adee148a..7d10fb25` son de solo tests, nombran el R-id y coinciden con la tabla del handoff §Reanudación 3:
- `d84b47ae` R3: empty-state, +29/−1, con el import de View, el probe-frame y la línea de className
- `d4063486` R11: +16, con la línea 0x02 tal como pide E2.3
- `b4abfe7d` R4: home, health, food, map
- `96bda091` R5: alerts
- `5b24557c` R6: reminders
- `bedbfb8f` R7: docs
- `397bbc2e` R8: geofences
- `2a589c65` R9: food

Después viene `7d10fb25` `docs(...)`: trazabilidad, que solo toca impl y traceability.

Los candados de E2 nacen verdes por diseño. Es la opción (b) de C4, que E2 declara antes del handoff y que está firmada. El rojo lo demuestran las 27 sondas y el combinado de §5, no el historial.

### 8. Checklist C2-C8
- **C2**
  - [x] No hay ninguna feature `in_progress`: #155 sigue en `spec_ready` en `feature_list.json`, como en la ronda 1 (N3).
  - [x] `progress/current.md` sigue describiendo la sesión activa de #155, pero va desfasado (N1).
- **C3**
  - [x] Sin cambios de producción desde la ronda 1, donde C3 quedó aprobado.
- **C4**
  - [x] Cada R-id tocado por E2 (R3-R9, R11) tiene `it` que lo nombran en el describe correspondiente.
  - [x] Los candados nacen verdes por la opción (b); los cubren las sondas de §5.
- **C5**
  - [x] `traceability.md` solo tiene «pendiente» en R12 («lo firma el humano», precedente #152).
  - [x] Los commits de E2 están añadidos a las filas R3-R9 y R11.
  - [x] Los 28 hashes citados son ancestros de HEAD (`merge-base --is-ancestor`).
  - [x] Los mensajes siguen el formato `test(mobile-empty-states): #155 R<n> …`.
- **C6**
  - [x] `requirements.md` dice `status: approved`, con las casillas de aprobación, E1 y E2 marcadas.
  - [x] La firma de E2 está en `adee148a` («aprobada vía Notion»).
  - [x] `requirements.md` y `tasks.md` no cambian desde `adee148a`.
- **C7**
  - [x] N/A: E2 no reemplaza nada.
- **C8**
  - [x] Cargué la skill `expo:expo-overview`.
  - [x] Producción no cambia desde la ronda 1, donde C8 quedó aprobado salvo B1, que E2 cierra.
  - [x] Las líneas añadidas no tienen hex, `StyleSheet` ni clases arbitrarias `[...]`. Las únicas clases que aparecen son tokens dentro de aserciones (`bg-accent`, `bg-background`). design-drift, que también escanea tests, y el lint salen verdes en init.sh.

### 9. R12
Pendiente. Es la prueba de humo del humano en un dev build de Android y su casilla «Smoke R12» de §Aprobación sigue en `[ ]`. #155 no pasa a done hasta que el humano la firme.

### Observaciones
Ninguna bloqueante.

- **N1 (no bloqueante, la misma de la ronda 1):** `progress/current.md` sigue en el commit del handoff `d4e044b3`, con la cabecera «(P2, pending)». No menciona la ronda 1, E1, E2 ni la Reanudación 3. El leader lo pone al día al cerrar.
- **N2 (delimitación, no bloqueante):** R11 no tiene un candado propio contra la animación del contenedor de pantalla. Las dos pantallas donde la medí caen por candados previos: Inicio por `#152 R5` (`enteringIds`) y Salud por el `toEqual` del style de `#115 R2`. En food, map, alerts, reminders, docs y geofences, una animación del padre anónimo que no cambiase la forma del style no la vería ningún `it` de #155. No es una rama de R11 tal como está escrita, porque sus viñetas limitan «sin animación» al fuente de `EmptyState` y al asset. Si el humano quiere un vacío estático en cualquier pantalla, sería deuda que registrar, no un hueco de esta spec.
