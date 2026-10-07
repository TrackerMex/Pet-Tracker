# review: mobile-home-motion-foundations (#152)
Fecha: 2026-10-07
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-152, branch feature/152-mobile-home-motion-foundations, HEAD c7ac5ceb (verificado)
Base del handoff (H0): 36f91e6e. Merge previo 9ecc70bb (ancestro de H0, verificado)
Veredicto: RECHAZADO

El código cumple la spec, y en él no hay ningún defecto de comportamiento. El rechazo se debe a tres cláusulas universales de R5 y R7 a las que les falta el candado de alguna de sus ramas. En los tres casos hay mutantes plantados en la zona ciega que sobreviven a `index.test.tsx` entero (ver §Observaciones B1-B3). Las listas de `it` de la spec no enumeran esas ramas. Codex siguió la spec, así que el hueco nace en la spec y su cierre pasa por una enmienda.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente #152 mobile-home-motion-foundations
- [x] progress/current.md describe la sesión activa de #152 (handoff a Codex con E1-E3, reviewer pendiente)

## Checklist C3 — Arquitectura
- [x] Móvil, pantallas: no se toca ningún route. Todo el cambio vive en `src/screens/home/` y `src/theme/`
- [x] Las duraciones y presets de movimiento son constantes de `src/theme/motion.ts` y no tienen literales repartidos por las pantallas
- [x] Sin cambios en backend ni infra (0 ficheros en `backend-pet-tracker/` y en infra desde H0)

## Checklist C4 — TDD
- [x] Cada R1-R9 tiene un describe `#152 R<n>: ...` en el fichero que fija la spec. R10 es un smoke humano
- [x] Historial test-primero. Volví a reproducir cada rojo y cada verde en un worktree desechable sobre cada commit:
  - **Rojos.** Todos dan exit=1 y ninguno falla por SyntaxError, ReferenceError ni `Cannot find module`.
    - R1 f110abac: 6 failed, con aserción.
    - R2 595665b3: 3 failed, con aserción. La mutación `/* --motion */` va versionada en global.css.
    - R3 de2bab96: 2 failed. Hay un stub `export {}`, y el `TypeError: homeEntering is not a function` es el que declara la spec.
    - R4 3f42c163 y E1 891bc4f6: 4 failed, por `Element type is invalid`.
    - R5 557ce704: 7 failed, más los 4 de orden por `toEqual`.
    - R6 29eba7b1 y E2 bb7f3194: 2 failed.
    - R7A a7cbd7d7: 2 failed.
    - R7B c872a3e1: 1 failed. La mutación es un segundo summary-reveal versionado.
    - R8A 5606d328: 9 failed.
    - R8B 26092abf: 2 failed. La mutación es la barra incondicional, versionada.
    - R9 4daff5ff: 1 failed, con violación `collar-battery-bar.tsx`.
    - E3 11dffcf4: devuelve al verde los 5 guardas históricos de design-drift.
  - **Verdes.** Todos son los esperados.
    - G1 a588f1d8: 6 passed.
    - G2 40ef31a7: 9 passed.
    - G3 0b2ba0da: 2 passed.
    - G4 a34c2712: 6 passed.
    - G5 60371e0a: 176 passed, más los 2 rojos de R6 que se esperan hasta G7A.
    - G7A 630a611e: 180 passed.
    - G7B b25535eb: 181 passed.
    - G8A 6da3a9c7: 190 passed.
    - G8B b0ab47fc: 192 passed.
    - G9 86f4b6ed: 62 passed.
  - Cada mutación de producción versionada en un rojo se revierte en su verde.
  - Los commits de E1, E2 y E3 son rojos legítimos que solo tocan tests.
  - Las desviaciones autorizadas son equivalentes a lo pedido:
    - E2 espera `'15 kg'`, que es la salida real de `fmtKg`.
    - E3 usa `toHaveStyle` en R8.3 y R8.4. Lee el mismo estilo del primer render (PL1), y M9 y M10 lo siguen detectando.
- [ ] **Candados completos**: no. Hay tres cláusulas universales con ramas sin candado (B1-B3)

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas "pendiente", salvo R10 `pendiente (humano)`, que no bloquea
- [x] Los 24 hashes citados existen (`git cat-file -e`) y son ancestros de HEAD (`git merge-base --is-ancestor`)
- [x] Las filas de R4, R6 y R8 citan los rojos de E1, E2 y E3. La fila de R8 documenta `toHaveStyle` según E3
- [x] Los commits siguen el formato `test|feat|docs(<scope>): #152 R<n> ...`

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada (2026-10-06, vía Notion)
- [ ] La enmienda A21 de docs/ui-guidelines.md tiene su casilla `- [ ] Enmienda aprobada por humano` sin marcar. Es solo para el humano y no bloquea este veredicto

## Checklist C7 — Sin código huérfano
- [x] N/A. La feature no reemplaza nada. La migración de las constantes anteriores (`MEALS_BAR_TIMING`, etc.) queda fuera de alcance por escrito en A21

## Checklist C8 — Carta UI (docs/ui-guidelines.md + skills expo:expo-overview y expo:expo-animation)
- [x] Los 4 ficheros no tienen hex (el único match es el comentario `// #152`), clases arbitrarias, `StyleSheet`, shadow ni `var(` en estilos animados. R9 lo candea con `MEALS_BAR_STYLE_ESCAPES`
- [x] Reanimated en el UI thread:
  - las recetas `entering` son worklets con `'worklet'`;
  - los valores compartidos usan `.get()`/`.set()`;
  - no se escribe ningún valor compartido durante el render (solo en el efecto);
  - no hay `runOnJS` ni `.value`.
- [x] Las curvas siguen las tablas de la skill:
  - ease-out `Easing.bezier(0.23, 1, 0.32, 1)` para el fundido;
  - ease-in-out `(0.77, 0, 0.175, 1)` para el relleno;
  - muelle `dampingRatio: 1` sin rebote.
  - Las duraciones son las de la carta (150/250/400).
- [x] Reduce motion. Se conservan el fundido y el escalonado y se quita el desplazamiento (D3), con `withDelay` en `ReduceMotion.Never`. Es el criterio de la skill: "fewer and gentler, not zero". La barra salta a `pct` sin `withTiming`.
- [x] La entrada se reproduce una vez por montaje: al volver al foco se conservan los 7 nodos (R6), y M5, M6, X3 y X9 lo confirman. Las `entering` cuelgan de hijos de un `ScrollView`, no de filas virtualizadas.
- [x] No hay animación sobre el skeleton. `summary-reveal` no se monta mientras está `summary-skeleton` (R7B), y el skeleton se desmonta sin fundido cruzado.
- [x] `bun run typecheck` y `bun run lint` dan exit=0 en c7ac5ceb (worktree desechable)

## Lista cerrada de ficheros
`git diff --name-only 36f91e6e HEAD`, sin contar los ficheros del leader, da exactamente los 11 de la lista cerrada del handoff:
docs/ui-guidelines.md; mobile-pet-tracker/src/__tests__/design-drift.test.ts; mobile-pet-tracker/src/screens/home/{collar-battery-bar.tsx, home-entrance.tsx, home-entrance.test.tsx, index.tsx, index.test.tsx}; mobile-pet-tracker/src/theme/{motion.ts, __tests__/motion.test.ts}; progress/impl_mobile-home-motion-foundations.md; specs/mobile-home-motion-foundations/traceability.md.
No hay cambios en backend ni en infra.

## Pruebas de mutación
Las corrí en un worktree desechable sobre c7ac5ceb. Revertí cada mutación con `git checkout HEAD -- <fichero>` y comprobé que `git status`/`git diff --cached` quedaban vacíos.

**Sondas de tasks.md (M1-M12).** Todas caen con el `it` previsto y por aserción, sin TypeError, ReferenceError ni SyntaxError.

| Sonda | Mutación | Resultado |
|---|---|---|
| M1 | `MOTION_STAGGER_MS` 60→50 | Rojo: R1 «declara el escalonado…» y R5 «escalona…» |
| M2 | `withDelay` de opacidad Never→System | Rojo: R3 «parte invisible…» y R4 «bajo reduce motion…» |
| M3 | Ignora reduce motion en el offset | Rojo: R4 «bajo reduce motion…» |
| M4 | Índices de quick-actions y weekly intercambiados (2↔3) | Rojo: R5 «escalona…» |
| M5 | `key={String(detail.dataUpdatedAt)}` en summary | Rojo: R6, los 2 `it` |
| M6 | `key={selectedPetId}` en quick-actions | Rojo: R6 «al cambiar de mascota…» |
| M7 | summary-reveal `homeEntering(0, 12)` | Rojo: R7 «funde sin espera…» |
| M8 | `pct >= 60` | Rojo: R8 «pinta 60% con bg-warning-strong» |
| M9 | FILL→FADE | Rojo: R8.3 y R8.7 |
| M10 | Valor inicial `pct` | Rojo: R8.3 |
| M11 | Dependencias del efecto `[]` | Rojo: R8.7 y R8.8 |
| M12 | Bajo reduce motion el efecto no asigna | Rojo: R8.8 |

**Sondas propias en zona ciega.**

| Sonda | Mutación | Resultado |
|---|---|---|
| X1 | summary-reveal `entering={reduceMotion ? undefined : homeEntering(0, 0)}` | **Sobrevive**: 23/23 de `#152` |
| X2 | `home-entrance-quick-actions` siempre montado, con el bloque condicionado dentro | **Sobrevive**: 192/192 de index.test.tsx |
| X2b | Igual para `home-entrance-summary` | **Sobrevive**: 192/192 |
| X2c | `home-entrance-weekly` sin `selectedPetId &&` (sin mascotas pinta el skeleton) | **Sobrevive**: 192/192 |
| X2d | `home-entrance-reminders` siempre montado | **Sobrevive**: 192/192 |
| X21 | Condición de weekly `kind !== 'error'` en vez de `=== 'ok'` (envoltorio vacío con `unreachable`/`unauthorized`) | **Sobrevive**: 192/192 |
| X17 | `weekly-activity-day-map` dentro de un `HomeEntrance` (index 6) | **Sobrevive**: 192/192 |
| X18 | `pet-hero-error` dentro de un `HomeEntrance` | **Sobrevive**: 192/192 |
| X3 | `key` de weekly según skeleton/ok (se vuelve a montar al llegar el dato) | Rojo: R6 «al cambiar de mascota…» |
| X4 | `style` propio en `HomeEntrance` | Rojo: R4 «no añade estilo propio» |
| X7 | Barra delante del texto | Rojo: R8.2 |
| X7b | Barra envuelta en un `View` | Rojo: R8.2 |
| X8 | Ancho desde `pct` y no desde el valor compartido | Rojo: R8.3 |
| X9 | `key={String(detail.dataUpdatedAt)}` en summary-reveal | Rojo: R6 «no repite la entrada al volver al foco» |
| X12 | Sin escalonado bajo reduce motion | Rojo: R4 «bajo reduce motion…» |
| X13 | `MOTION_FADE_TIMING` Never→System | Rojo: R1, R3 y R4 |
| X14 | `withDelay` de translateY Never→System | Rojo: R3 y R4 |
| X19 | `className` en summary-reveal | Rojo: R7 «envuelve la fila…» |
| X20 | Collar sin `&& connection` | Sobrevive, pero es un mutante **equivalente**: `deviceConnectionState` siempre devuelve un string no vacío cuando el detalle es `ok`. No es hallazgo |

Todos los `toHaveAnimatedStyle` llevan `shouldMatchAllProps: true`. No encontré candados tautológicos: `toBe(MOTION_FILL_TIMING)` va acompañado de `objectContaining` con los literales, que es la excepción que permite la spec.

## Observaciones

### Bloqueantes
- **B1. R5, «Cada envoltorio se pinta exactamente bajo la misma condición que su bloque».** Ninguno de los cuatro envoltorios que dependen de `selectedPetId` tiene candado para la rama `selectedPetId` nulo:
  - `home-entrance-summary`
  - `home-entrance-quick-actions`
  - `home-entrance-weekly`
  - `home-entrance-reminders`

  Las mutaciones X2b, X2, X2c y X2d dejan el envoltorio montado (vacío, o con el skeleton en el caso de weekly) cuando no hay mascota, y `index.test.tsx` sigue 192/192. Además, `home-entrance-weekly` («pendiente o es `ok`») solo tiene candado contra `kind: 'error'` (`it` «no pinta el envoltorio de la actividad si la actividad falla», línea ~4804). Con `unreachable` y `unauthorized` no hay candado, y X21 sobrevive.
- **B2. R5, «`pet-hero-error` y `weekly-activity-day-map` siguen siendo hijos directos de `home-content`, sin envoltorio».** Ninguna de las dos ramas tiene candado. X17 y X18 sobreviven 192/192. El único `toEqual` de hijos de `home-content` (R5 «pinta los seis envoltorios…») corre sin día seleccionado y con el detalle `ok`, así que ninguno de los dos nodos existe en ese test.
- **B3. R7, «un fundido de opacidad 0 a 1 en 250 ms ease-out … igual con o sin reduce motion».** Solo la rama sin reduce motion tiene candado: «funde sin espera ni desplazamiento» no activa `mockUseReducedMotion`. X1, que quita `entering` de `summary-reveal` bajo reduce motion, sobrevive los 23 `it` de `#152`.

Sobre la corrección: los rojos nuevos han de seguir la regla C4 de esta feature, es decir, una mutación de producción versionada en el commit rojo y revertida en el verde. Las sondas X1, X2, X2b, X2c, X2d, X17, X18 y X21 de esta tabla sirven de mutación.

### No bloqueantes
- Hay dobles líneas en blanco en `home-entrance.tsx` (entre las dos funciones), en `design-drift.test.ts` (antes del describe `#152 R9`) y en `docs/ui-guidelines.md` (antes de `## Enmienda #152`). El `Pressable` de `collar-card` en `index.tsx` está mal indentado. Lint da exit=0, así que es cosmético.
- La barra anima `width` en un nodo dentro del flujo. La skill de animación solo exime a los nodos absolutos sin hijos. Aun así, el relleno es el único hijo de una pista de tamaño fijo con `overflow-hidden`, no relayouta hermanos, y la spec prescribe ese patrón (#106). No es violación.
- R10 (smoke en dev build de Android) y la casilla de A21 son del humano.
- En el log de init.sh, jest móvil avisa de "A worker process has failed to exit gracefully". No altera ningún recuento (96/96 suites).

## Output de ./init.sh (corrido por el leader en c7ac5ceb, exit=0)
Log: /tmp/claude-1002/-home-claude-sites-Pet-Tracker/74892c00-321f-434a-abca-de5bbd0439dc/scratchpad/init-152.log. El log es posterior al commit HEAD. Cifras verificadas contra el log:
```
✅ Build exitoso
Test Suites: 176 passed, 176 total          (backend)
Tests:       1348 passed, 1348 total
Test Suites: 96 passed, 96 total            (mobile)
Tests:       2209 passed, 2209 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total   (e2e)
Tests:       8 skipped, 438 passed, 446 total
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Pre-verificación E4 (ronda 1b)

Fecha: 2026-10-07. Objeto: el borrador de la Enmienda E4 en `083ebc1b`
(spec §Enmienda E4 y handoff §Enmienda E4). Su `src/` es idéntico al de
`c7ac5ceb`.

Método: un worktree desechable en detached HEAD sobre `083ebc1b`, con las
inserciones literales del handoff aplicadas y commiteadas en local para que
`git checkout HEAD --` las conserve. Todas las comprobaciones del handoff
cuadran: numstat `62	0`, y los grep dan 1, 1, 2, 1 y 4.

Solo corrí `bunx jest <fichero>` dirigido, más `bun run typecheck` y
`bun run lint` bajo la mutación roja. No corrí `./init.sh` ni la suite entera,
por instrucción del leader. Por eso no verifiqué las cifras 2218 (jest móvil)
ni 320 → 329 (comparación de cierre). Cada sonda se revirtió con
`git checkout HEAD -- <fichero>`, y tras cada una el árbol quedó limpio y
`git diff --cached` vacío. El worktree está eliminado.

**Resultado: E4 cierra B1, B2 y B3 tal como se rechazaron, pero el barrido
exhaustivo encuentra 4 cláusulas más con ramas sin candado (H1-H4,
14 ramas).** E4 es insuficiente.

### 1. E4 contra las sondas de la ronda 1

Base, con los tests de E4 y `index.tsx` de `c7ac5ceb`:
`Tests: 201 passed, 201 total`, exit 0.

| Sonda | Falla con E4 | Motivo |
|---|---|---|
| X1 | R7 «funde igual bajo reduce motion» | `expect(received).toEqual(expected)` |
| X2 | R5 «no pinta ningún envoltorio sin mascota seleccionada» | `toBeNull()` |
| X2b | ídem | `toBeNull()` |
| X2c | ídem | `toBeNull()` |
| X2d | ídem | `toBeNull()` |
| X21 | R5 «no pinta el envoltorio de la actividad con $kind», las 4 filas (no-tracking, unauthorized, unreachable y missing-config) | `toBeNull()` |
| X17 | R5 «deja el botón del mapa del día como hijo directo de home-content» | `toBe` (Object.is) |
| X18 | R5 «deja el error del detalle ($kind)…», filas error y unreachable | `toBe` (Object.is) |

Las ocho caen por aserción. En todas hay 0 `TypeError`, 0 `ReferenceError`,
0 `SyntaxError` y 0 «Unable to find».

Rojo combinado (las cuatro sondas de E4.3 aplicadas por anclas de línea
completa):

- numstat `6	2`, `<HomeEntrance` = 8.
- `index.test.tsx`: exit 1, `Tests: 9 failed, 192 passed, 201 total`.
  - Fallan exactamente los 9 `it` nuevos:
    - 1 «sin mascota»;
    - 4 «actividad con»;
    - 3 «deja el»;
    - 1 «funde igual».
  - Ninguna de las cadenas TypeError, ReferenceError, SyntaxError o Cannot find module.
- Guards design-drift, legibility-classnames y consistency-classnames: `144 passed, 144 total`.
- `bun run typecheck` y `bun run lint`: exit 0.
- `.expo/types/router.d.ts` no existe.

Verde: revertir `index.tsx` devuelve la base, 201/201.

### 2. Barrido cláusula × rama × candado × sonda

La spec solo tiene la enmienda E4; no existen E1-E3. «Candado» es el `it`
que cae con la sonda.

| Req. | Cláusula / rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| R1 | 8 valores y «ninguna otra» | R1 (6 `it`) | M1, X13 | Cubierto |
| R1 | «usan `MOTION_TRANSITION_MS` sin repetir el número» | — | X31 (`duration: 250` literal) | Sobrevive; equivalente en ejecución (ver §4) |
| R1 | no importa global.css/uniwind, sin colores/espaciados/radios | R9 (hex/arbitrarias) + lectura | X29T | Hex cubierto; imports verificados leyendo |
| R2 | frase §Animación, encabezado, casilla, global.css | R2 (3 `it`) | ronda 1 | Cubierto |
| R2 | contenido de las tres viñetas de A21 | casilla humana A21 | X32 (borra la viñeta de constantes previas) | Sobrevive; gate humano (ver §4) |
| R3 | receta entera, Never/System | R3 «parte invisible…» | M2, X13, X14 | Cubierto |
| R3 | «no llama a withDelay/withTiming/withSpring al crearse» | R3 «no anima nada…» | X34 (withDelay ansioso) | Cubierto |
| R4 | WHILE reduce motion off / on | R4 índice 0 / reduce motion | M3, X12 | Cubierto, las dos ramas |
| R4 | único nodo host: hijo envuelto / host exterior | R4 «no añade estilo propio» / R5 orden + 4 tests P8 | X33i / X33o | Cubierto |
| R4 | sin `style` ni `className` | R4 «no añade estilo propio» | X4 | Cubierto |
| R5 | índice y espera por envoltorio | R5 «escalona…» | M1, M4 | Cubierto |
| R5 | misma condición, `selectedPetId` nulo (6 envoltorios) | E4.1 | X2, X2b, X2c, X2d | Cubierto por E4 |
| R5 | misma condición, weekly × 5 kinds no-ok | R5 error + E4.2 | X21 | Cubierto por E4 |
| R5 | misma condición, collar y última posición, detalle `error` | R5 «…si el detalle falla» | X23e, X24e | Cubierto |
| R5 | misma condición, última posición sin collar | R5 «…sin collar» | X24n | Cubierto |
| R5 | misma condición, collar y última posición, detalle pendiente | R6 «al cambiar de mascota…» (`not.toBe`) | X23p, X24p | Cubierto |
| R5 | **misma condición, collar y última posición, detalle `unauthorized` / `unreachable` / `missing-config`** | — | X23a/u/m, X24a/u/m | **Sobreviven 201/201 (H1)** |
| R5 | condición más estricta que el bloque (bloque desaparece) | tests previos #70/#71/#77/#81/#85/R9/R14 | Y1, Y2, Y3, Y5, Y6 | Cubierto |
| R5 | skeleton y gráfica en la misma posición de JSX | R6 «al cambiar…» | X3 | Cubierto |
| R5 | pet-hero-error (error, unreachable) y day-map sin envoltorio | E4.3 | X18, X17 | Cubierto por E4 |
| R5 | **hero (`PetHeroHeader`) y `home-states` «no cambian»** | — | X27, X28 | **Sobreviven 201/201 (H3)** |
| R5 | 4 tests P8 movidos | sus 4 `it` | X33o | Cubierto |
| R6 | foco: 7 nodos conservados | R6 «no repite…» | M5, X9, X26r/w/c/l/q | Cubierto, nodo a nodo |
| R6 | cambio de mascota: 4 conservados | R6 «al cambiar…» | M6, X26r2/w2/s2 | Cubierto, nodo a nodo |
| R6 | cambio de mascota: collar, última posición y reveal se remontan | R6 «al cambiar…» `not.toBe` | X23p, X24p | Cubierto |
| R7 | reveal envuelve la fila, sin style/className | R7 «envuelve…» | X19 | Cubierto (actividad `ok`) |
| R7 | `homeEntering(0, 0)` sin reduce motion | R7 «funde sin espera…» | M7 | Cubierto |
| R7 | con reduce motion | E4.4 | X1 | Cubierto por E4 |
| R7 | no monta el fundido con el skeleton | R7 «no monta…» | Y3 | Cubierto |
| R7 | **WHEN la fila sustituye al skeleton con actividad `no-tracking` / `error` / `unreachable` / `missing-config`** | — | X25, X25w | **Sobreviven 201/201 (H2)** |
| R8 | umbral > 60 / ≤ 60 | R8.1 | M8 | Cubierto |
| R8 | WHILE off: nace en 0 + FILL / refresco anima | R8.3, R8.7 | M9, M10, M11, X8 | Cubierto |
| R8 | WHILE on: nace en pct / refresco asigna pct | R8.4, R8.8 | M12 | Cubierto |
| R8 | misma fila, detrás del texto | R8.2 | X7, X7b | Cubierto |
| R8 | IF `batteryPct` null / sin collar | R8.5 / R8.6 | Y7 / Y6 | Cubierto |
| R8 | **«no añade texto ni copy; el lector sigue leyendo collar-battery»** | — | X30t (`<Text>` hermano tras la pista), X30a (`accessibilityLabel` en la pista) | **Sobreviven (H4)** |
| R8 | clases del relleno como literales completos | lectura | — | Verificado leyendo (`collar-battery-bar.tsx`) |
| R9 | los 4 ficheros sin escapes | R9 | X29T, X29E, X29B, X29H | Cubierto, fichero a fichero |
| E4.1-E4.4 | cada `it` nuevo | sí mismo | §1 | Cubierto |

### 3. Huecos que E4 no cierra (bloqueantes)

Cada sonda superviviente es una mutación de un solo punto en producción que
deja `index.test.tsx` en 201/201. En H4 también quedan en verde los guards y
`ui-language`, que corrí con ella. Para descartar ramas
inalcanzables o que no se puedan probar, añadí en el worktree desechable un
describe de sonda, que no está en ningún commit del repo.

- En producción sin mutar, ese describe pasa 10/10.
- Con cada sonda superviviente, cae por aserción, con 0 TypeError y 0 «Unable to find».

**H1 — R5 «cada envoltorio se pinta exactamente bajo la misma condición que su
bloque»: `home-entrance-collar` y `home-entrance-last-position` con el
detalle en `unauthorized`, `unreachable` y `missing-config`.**

- Sondas: X23u, X23a y X23m montan el envoltorio del collar vacío; X24u, X24a
  y X24m hacen lo mismo con el de la última posición. Las seis dejan
  201/201.
- El único candado es «no pinta los envoltorios del collar ni de la última
  posición si el detalle falla», y usa solo `{ kind: 'error' }`.
- `unreachable` es un estado visible normal: pinta `pet-hero-error`, y un
  envoltorio vacío ahí suma el `gap: 16` que R5 quiere evitar.
- Es el mismo patrón que E4.2 cerró para weekly.
- Se puede candar: con `getPet` en cada kind, esperar en el mismo `waitFor` a
  `reminders-section` visible y a `reminders-section-skeleton` ausente (el
  detalle ya llegó). Después, los dos envoltorios son `toBeNull`. Cae con las
  seis sondas.

**H2 — R7 «WHEN la fila del resumen sustituye a `summary-skeleton`»: los
kinds de actividad `no-tracking`, `error`, `unreachable` y `missing-config`.**

- Con esos kinds la fila (`summary-weight` + `summary-note`) también
  sustituye al skeleton, dentro de `summary-reveal`. La condición en
  producción es `kind !== 'unauthorized'`.
- Los cuatro `it` de R7, E4.4 incluida, usan actividad `ok`.
- X25 (`entering={activity.data.kind === 'ok' ? homeEntering(0, 0) : undefined}`)
  y X25w (el `testID` del reveal solo con `ok`) dejan 201/201.
- Se puede candar: con un `findByTestId('summary-reveal')` por kind y
  `entering` `toEqual(expect.any(Function))`, las 4 filas caen con X25.

**H3 — R5 «El hero (`PetHeroHeader`) y `home-states` no cambian»** (también
§Fuera de alcance: «no reciben entrada»).

- X27 envuelve el `PetHeroHeader` en un `HomeEntrance`; X28 hace lo mismo con
  `home-states`. Las dos dejan 201/201.
- Es la misma clase de hueco que B2, que E4.3 solo cierra para
  `pet-hero-error` y el mapa del día.
- El smoke R10, paso 1, mira el hero a ojo. `home-states` (vacío, error,
  carga) no lo mira nadie.
- Se puede candar: recorrer `.parent` desde `pet-hero` (con
  `renderMotionHome`) y desde `home-states` (con `pets: []`) y comprobar que
  ningún ancestro tiene `props.entering`. Cae con X27 y X28.

**H4 — R8 «La barra no añade texto ni copy; el lector de pantalla sigue
leyendo `collar-battery`».**

- X30t: `CollarBatteryBar` devuelve un fragmento con un `<Text>bateria</Text>`
  detrás de la pista. Deja verdes `index.test.tsx` (201), ui-language,
  design-drift, legibility-classnames y consistency-classnames: 375/375.
  `collar-battery-bar.tsx` no está en `SCREEN_FILES`.
- X30a: `accessible` + `accessibilityLabel` en la pista. Deja 201/201.
- R8.1 solo cierra los hijos de la pista, y R8.2 solo que la pista va justo
  detrás de `collar-battery`. Nada mira lo que viene detrás de la pista ni
  sus props de accesibilidad.
- Se puede candar: la pista es el último hijo no-string de su fila y su
  `accessibilityLabel` es `undefined`. Cae con X30t y X30a.

### 4. No bloqueantes

- **X31 (R1, `duration: 250` literal en un objeto).** Sobrevive, 15/15 en
  motion y home-entrance. En ejecución es un mutante equivalente: solo una
  lectura del fuente lo distinguiría. `motion.ts` en `c7ac5ceb` usa
  `MOTION_TRANSITION_MS` en los tres objetos, verificado leyendo.
- **X32 (R2, borrar la viñeta de las constantes previas de A21).** Sobrevive,
  9/9 en `motion.test.ts`. La spec solo canda frase, encabezado y casilla. El
  contenido de las viñetas lo firma el humano con la casilla
  `- [ ] Enmienda aprobada por humano`, que sigue sin marcar.
- **Cláusulas estáticas verificadas leyendo.**
  - `'worklet'` en la primera línea de la función de `homeEntering`.
  - `motion.ts` solo importa `react-native-reanimated`.
  - Las dos clases del relleno son literales completos.
- **Cifras de E4.** `index.test.tsx` 201 verificado. No verificadas por mí,
  porque exigen la suite entera: 2218 y 329.

## Pre-verificación E4 (ronda 1c)

Fecha: 2026-10-07. Objeto: la Enmienda E4 ampliada en `a81f01cd`, es decir,
la spec §Enmienda E4 (E4.5-E4.8 y las filas H1-H4) y el handoff §Enmienda E4
(pasos E4.2-E4.6). Su `src/` es idéntico al de `c7ac5ceb`.

Método:

- Un worktree desechable en detached HEAD sobre `a81f01cd`.
- Apliqué literalmente los bloques (a), (b) y (c) del handoff y los commiteé
  en local, para que `git checkout HEAD --` los conserve. Las comprobaciones
  del handoff cuadran: los grep dan 1, 1, 2, 1, 1, 1, 1, 1, 1 y 4, y el
  fichero termina en `});`.
- Apliqué la mutación del rojo (E4.3 ampliada) por anclas de línea completa:
  - `index.tsx`: numstat `9	2`, `<HomeEntrance` = 11;
  - `collar-battery-bar.tsx`: numstat `1	0`.
- Solo corrí `bunx jest <fichero>` dirigido, `bun run typecheck` y
  `bun run lint`. No corrí `./init.sh` ni la suite entera.
- Revertí cada sonda con `git checkout HEAD -- <fichero>`. Tras cada una el
  árbol quedó limpio y `git diff --cached` vacío. El worktree está eliminado.

**Resultado: E4 cierra H1-H4 tal como los rechacé en la ronda 1b. El barrido
de R5, R7 y R8 encuentra tres cláusulas más con ramas sin candado (H5-H7):
16 sondas que dejan `index.test.tsx` en 213/213. E4 es insuficiente.**

H6 y H7 son las mismas cláusulas que H2 y H4. El fallo en ese alcance es mío,
no de E4: mis propuestas de candado de la ronda 1b eran más estrechas que las
cláusulas, y E4.7 y E4.8 las copiaron (ver §3, «Origen»).

### 1. E4 contra H1-H4

Base, con los tests de E4 y `index.tsx` de `c7ac5ceb`:
`Tests: 213 passed, 213 total`, exit 0.

| Sonda | Falla con E4 | Motivo |
|---|---|---|
| X23u, X24u | E4.5, fila `unreachable` (1 ✕ cada una) | `toBeNull()` |
| X23a, X24a | E4.5, fila `unauthorized` (1 ✕ cada una) | `toBeNull()` |
| X23m, X24m | E4.5, fila `missing-config` (1 ✕ cada una) | `toBeNull()` |
| X25 | E4.7, las 4 filas | `toEqual` |
| X25w | E4.7, las 4 filas | Por consulta («Unable to find» `summary-reveal`). Es lo esperado, porque la sonda quita el `testID` |
| X27 | E4.6 «solo da entrada a los envoltorios, al fundido y al avatar del selector» | `toEqual` |
| X28 | E4.6 «no da entrada a home-states con %s», las 3 filas | `toEqual` |
| X30t | E4.8 | `toBe` (Object.is) |
| X30a | E4.8 | `toEqual` |

Cada sonda tumba solo sus propios `it`; los demás pasan. Hay 0 `TypeError` en
todas y 0 «Unable to find» fuera de X25w.

Rojo combinado:

- `index.test.tsx`: exit 1, `Tests: 21 failed, 192 passed, 213 total`.
- Fallan exactamente los 21 `it` de E4:
  - 1 «sin mascota»;
  - 4 «actividad con»;
  - 3 «deja el»;
  - 3 «detalle en»;
  - 1 «solo da entrada»;
  - 3 «home-states»;
  - 1 «funde igual bajo reduce motion»;
  - 4 «funde igual la fila»;
  - 1 «no añade texto ni nombre accesible».
- No aparece ninguna de estas cadenas: `TypeError`, `ReferenceError`,
  `SyntaxError`, «Unable to find» ni «Cannot find module».
- Guards design-drift, legibility-classnames y consistency-classnames, más
  ui-language: `Tests: 174 passed, 174 total`.
- `bun run typecheck` y `bun run lint`: exit 0.
- `.expo/types/router.d.ts` no existe.

Verde: al revertir la mutación se vuelve a la base, 213/213.

**H1-H4 quedan cerrados.**

### 2. Barrido de R5, R7 y R8

«Candado» es el `it` que cae con la sonda. En negrita, las ramas que
sobreviven.

| Req. | Cláusula / rama | Candado | Sonda | Resultado |
|---|---|---|---|---|
| R5 | índice y espera de cada envoltorio | R5 «escalona…» | M1, M4 | Cubierto |
| R5 | misma condición: sin mascota | E4.1 | X2, X2b, X2c, X2d | Cubierto |
| R5 | misma condición: weekly con cada `kind` que no es `ok` | R5 `error` + E4.2 | X21 | Cubierto |
| R5 | misma condición: collar y última posición con el detalle en `error`, `unauthorized`, `unreachable`, `missing-config` o pendiente, y sin collar | R5, E4.5, R6 | X23e/a/u/m/p, X24e/a/u/m/p/n | Cubierto (H1 cerrado) |
| R5 | condición más estricta que la del bloque | tests previos | Y1-Y6 | Cubierto |
| R5 | skeleton y gráfica en la misma posición de JSX | R6 «al cambiar…» | X3 | Cubierto |
| R5 | `pet-hero-error` (`error`, `unreachable`) y mapa del día como hijos directos, sin envoltorio | E4.3 | X18, X17 | Cubierto |
| R5 | **`pet-hero-error` y mapa del día «no reciben entrada», con la entrada dentro del nodo o en el propio nodo** | — | X18i, X18p, X17i, X17p | **Sobreviven 213/213 (H5)** |
| R5 | hero «no cambia», sin alertas abiertas | E4.6, lista exacta | X27 | Cubierto (H3 cerrado) |
| R5 | **hero «no cambia», con alertas abiertas (rama `hasOpenAlerts` de `home-alerts-dot`, dentro del hero en `index.tsx`)** | — | X27d | **Sobrevive 213/213 (H5)** |
| R5 | `home-states` en carga, error y vacío | E4.6 `it.each` | X28 | Cubierto (H3 cerrado) |
| R7 | WHEN la fila sustituye al skeleton: `entering` con `ok`, `no-tracking`, `error`, `unreachable` y `missing-config` | R7 «funde sin espera…» + E4.7 | M7, X25, X25w | Cubierto (H2 cerrado) |
| R7 | «igual con o sin reduce motion»: `entering` | E4.4 | X1 | Cubierto |
| R7 | sin `style` ni `className`, con `ok` y sin reduce motion | R7 «envuelve…» | X19 | Cubierto |
| R7 | **sin `style` ni `className`, con los `kind` que no son `ok`** | — | X39s2, X39c | **Sobreviven 213/213 (H6)** |
| R7 | **sin `style` ni `className`, con reduce motion** | — | X39r2, X39c2 | **Sobreviven 213/213 (H6)** |
| R7 | envuelve la fila desde fuera (fila `flex-row`, hijo único), con `ok` y sin reduce motion | R7 «envuelve…» | ronda 1 | Cubierto |
| R7 | envuelve la fila desde fuera, con los `kind` que no son `ok`: clase de la fila | #77 R2 «compone la celda y la nota en una sola fila» (4 `it`) | X39f | Cubierto |
| R7 | **envuelve la fila desde fuera, con los `kind` que no son `ok`: hijo único** | — | X43s | **Sobrevive 213/213 (H6)** |
| R7 | **envuelve la fila desde fuera, con reduce motion: hijo único y clase de la fila** | — | X43r, X44r | **Sobreviven 213/213 (H6)** |
| R7 | no monta el fundido mientras está el skeleton | R7 «no monta…» | Y3 | Cubierto |
| R7 | «el skeleton se desmonta en el acto, sin fundido cruzado» | — | X42 | Sobrevive. Es una imprecisión de la premisa, no un hueco (ver §4) |
| R8 | umbral `> 60` / `<= 60`, clases literales | R8.1 | M8 | Cubierto |
| R8 | WHILE reduce motion desactivado o activado, y el refresco | R8.3, R8.4, R8.7, R8.8 | M9-M12, X8 | Cubierto |
| R8 | misma fila, detrás del texto, último hijo | R8.2 + E4.8 | X7, X7b, X30b, X30t | Cubierto |
| R8 | IF `batteryPct` nulo / sin collar | R8.5 / R8.6 | Y7 / Y6 | Cubierto |
| R8 | no añade texto: `<Text>` hermano detrás de la pista; `accessibilityLabel` en la pista | E4.8 | X30t, X30a | Cubierto (H4 cerrado) |
| R8 | **no añade texto: `<Text>` dentro del relleno** | — | X30x | **Sobrevive 213/213 (H7)** |
| R8 | **no añade copy al lector: props de accesibilidad que no son string en la pista** | — | X30v, X30n | **Sobreviven 213/213 (H7)** |
| R8 | **«el lector de pantalla sigue leyendo `collar-battery`»: fila agrupada con nombre propio** | — | X37r | **Sobrevive 213/213 (H7)** |
| R8 | «sigue leyendo `collar-battery`»: `collar-battery` oculto | 25 `it` | X37h | Cubierto. Cae por consulta, lo esperado: RNTL excluye los nodos ocultos |

### 3. Huecos que E4 no cierra (bloqueantes)

Cada sonda superviviente es una mutación de un solo punto en producción que
deja `index.test.tsx` en 213/213.

Para descartar ramas inalcanzables o que no se puedan probar, añadí en el
worktree desechable un describe de sonda. No está en ningún commit del repo.

- En producción sin mutar pasa 11/11, y `bun run typecheck` da exit 0 con él
  dentro.
- Con cada una de las 16 sondas de H5-H7, y con X42, cae por aserción. Hay 0 `TypeError` y
  0 «Unable to find».
- X40 lo deja en verde (ver §4).

**H5 — R5: el hero, `pet-hero-error` y `weekly-activity-day-map` «no reciben
entrada», en las ramas que E4.3 y E4.6 no pintan.**

- La cláusula está en §Fuera de alcance: «El hero (`PetHeroHeader`),
  `pet-hero-error`, `home-states` y `weekly-activity-day-map` no reciben
  entrada (R5)».
- E4.6 da el criterio: «Se recorre el árbol entero y no solo los ancestros.
  Una entrada dentro del hero (X27i) o dentro de una sola rama de
  `home-states` (X28e, X28l) también cambia lo que R5 dice que no cambia».
- Ese criterio no llega a estos nodos:
  - E4.3 solo mira el `.parent` de `pet-hero-error` y del mapa del día.
  - E4.6 pinta el hero sin alertas abiertas, sin detalle fallido y sin pulsar
    ningún día.
- Sondas (213/213 cada una):
  - X18i: un `<Animated.View entering={homeEntering(0, 0)}>` envuelve el
    contenido de `pet-hero-error`.
  - X18p: `entering={homeEntering(0, 0)}` en el `HeroUICard` de
    `pet-hero-error`. Llega al nodo host.
  - X17i: un `<Animated.View entering={homeEntering(0, 0)}>` envuelve el
    `Button.Label` del mapa del día.
  - X17p: `entering={homeEntering(0, 0)}` en el `Button` de
    `weekly-activity-day-map`. Llega al nodo host.
  - X27d: `home-alerts-dot` pasa a ser
    `<Animated.View entering={homeEntering(0, 0)} …/>`. El punto solo se
    pinta con alertas abiertas, y la base de `index.test.tsx` deja
    `listAlerts` con `items: []`.
- Se puede candar con `enteringIds` (verificado en el spike):
  - Con `pet-hero-error` en `error` y en `unreachable`,
    `enteringIds(await findByTestId('pet-hero-error'))` es `toEqual([])`.
    Caen X18i y X18p, en las dos filas.
  - Tras pulsar `weekly-activity-day-2026-08-21`,
    `enteringIds(getByTestId('weekly-activity-day-map'))` es `toEqual([])`.
    Caen X17i y X17p.
  - Con
    `mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null })`,
    `renderMotionHome` y `findByTestId('home-alerts-dot')`, la misma lista
    exacta de 8 de E4.6. Cae X27d.

**H6 — R7: «sin `style` ni `className`» y «envuelve la fila desde fuera: la
fila conserva su `View` con `className="flex-row"`», con los `kind` que no son
`ok` y con reduce motion.**

- El WHEN de R7 cubre los cinco `kind` que pintan la fila (H2), y «igual con o
  sin reduce motion» nombra la otra dimensión.
- E4.4 y E4.7 solo comprueban `entering` en esas ramas. Las comprobaciones
  estructurales de «envuelve la fila del resumen sin tocarla» solo corren con
  `ok` y sin reduce motion.
- Sondas (213/213 cada una). Las de `style` usan un spread condicional: el mock
  de reanimated convierte un `style={undefined}` explícito en un `style` host.
  Por eso `style={cond ? x : undefined}` cae en el test actual por un
  artefacto, no por candado, y descarté X39r y X39s.
  - X39s2: `{...(activity.data.kind === 'ok' ? {} : { style: { opacity: 0.6 } })}`
    en `summary-reveal`.
  - X39c: `className={activity.data.kind === 'ok' ? undefined : 'opacity-60'}`
    en `summary-reveal`.
  - X39r2: `{...(reduceMotion ? { style: { opacity: 1 } } : {})}`.
  - X39c2: `{...(reduceMotion ? { className: 'opacity-90' } : {})}`.
  - X43s: `{activity.data.kind === 'ok' ? null : <View />}` como primer hijo
    del reveal.
  - X43r: `{reduceMotion ? <View /> : null}` como primer hijo del reveal.
  - X44r: la fila pasa a
    `className={reduceMotion ? 'flex-row gap-1' : 'flex-row'}`. La misma
    mutación con el `kind` (X39f) la caza #77 R2; con reduce motion no la
    caza nadie.
- Se puede candar (verificado en el spike): E4.4 y cada fila de E4.7 repiten
  las cinco comprobaciones de «envuelve la fila del resumen sin tocarla»:
  - `row.props.className` es `'flex-row'`;
  - `row.parent` es `toBe(reveal)`;
  - el reveal tiene un único hijo no-string, `row`;
  - `reveal.props.style` es `toBeUndefined()`;
  - `reveal.props.className` es `toBeUndefined()`.

  Con los `kind` que no son `ok`, `summary-weight.parent.parent` sigue siendo
  la fila. Caen las 7 sondas.

**H7 — R8: «La barra no añade texto ni copy; el lector de pantalla sigue
leyendo `collar-battery`», por canales que E4.8 no ve.**

- E4.8 dice «Así cae cualquier canal de copy», pero solo mira las props de
  tipo string de la pista y del relleno, y la posición de la pista. No ve:
  - un `<Text>` dentro del relleno, porque los hijos del relleno no son props
    string;
  - las props de accesibilidad que no son string: `accessibilityValue` es un
    objeto que TalkBack y VoiceOver leen, y `accessible` es un booleano;
  - la fila agrupada con nombre propio, que hace que el lector lea la fila en
    vez de `collar-battery`.
- Sondas (213/213 cada una):
  - X30x: `<Text>{`${pct}%`}</Text>` como hijo de `collar-battery-fill`; el
    relleno deja de ser autocerrado.
  - X30v: `accessibilityValue={{ text: `${pct}%` }}` en la pista.
  - X30n: `accessible` + `accessibilityValue={{ min: 0, max: 100, now: pct }}`
    en la pista.
  - X37r: `accessible accessibilityLabel={String(detail.data.pet.device.batteryPct)}`
    en la fila `<View className="flex-row items-center gap-2">` de
    `index.tsx`.
- Se puede candar (verificado en el spike):
  - `fill.children` es `toEqual([])`.
  - En la pista, en el relleno y en `track.parent`, la lista de props cuyo
    nombre casa con `/^(accessib|aria-|role$|importantForAccessibility)/` es
    `toEqual([])`.

  En producción ninguno de los tres nodos tiene ninguna:
  - pista: `testID`, `className`, `children`;
  - relleno: `testID`, `className`, `style` y las props del mock;
  - fila: `className`, `children`.

  Caen las 4 sondas.

**Origen.** H6 y H7 nacen en mi ronda 1b, no en E4:

- En el barrido de la ronda 1b marqué «R7, reveal sin style/className» como
  «Cubierto (actividad `ok`)» sin señalar las demás ramas.
- El «Se puede candar» de H2 solo pedía `entering`.
- El de H4 solo pedía el último hijo y `accessibilityLabel`.
- E4.7 y E4.8 los copiaron (E4.8 incluso los amplió).

H5 es la clase de hueco de H3 (recorrer el árbol entero) aplicada a las ramas
que E4.6 no pinta.

### 4. No bloqueantes

- **X42 (R7, «El skeleton se desmonta en el acto, sin fundido cruzado»).**
  Envolver `summary-skeleton` en un `Animated.View` con `exiting` sobrevive
  213/213. Pero el `Skeleton` de heroui-native ya trae por defecto `entering`
  FadeIn y `exiting` FadeOut (`skeleton.animation.js`), y `summary-skeleton`
  tiene `exiting` en su nodo host en producción.
  - Leída al pie de la letra, la frase no la cumple la producción desde antes
    de #152. Es una imprecisión de la premisa, no un hueco de candado.
  - Decide el leader si reformula R7, por ejemplo: «#152 no añade un fundido
    de salida al skeleton».
  - Si quiere candado: con la actividad pendiente,
    `(await findByTestId('summary-skeleton')).parent` es
    `toBe(getByTestId('summary-card'))`. En el spike caza X42.
- **X40 (con `unauthorized`, un `summary-reveal` vacío).** Sobrevive también
  al spike. Ninguna cláusula de R7 lo cubre, porque el WHEN solo habla de
  cuando la fila sustituye al skeleton; #77 R3 cubre que la fila no se pinta.
  Es informativo.
- **Conjunciones con una dimensión que la cláusula no nombra.** No las
  candé ni las propongo:
  - `entering` del reveal con reduce motion y un `kind` que no es `ok`: la
    producción no tiene esa rama, y cada variable tiene su candado.
  - Las clases de R8 con reduce motion: R8 nombra reduce motion solo para el
    ancho.
  - Una entrada en un hijo del hero que dependa del estado del detalle: en
    `index.tsx` el hero no se ramifica por el detalle, y `pet-hero-header.tsx`
    está fuera de la lista cerrada.
- **Mutantes equivalentes.** X20, X31 y X32 siguen como en las rondas 1 y 1b.
- **Cifras de E4.** Verifiqué 213, 21/192/213 y 174. No verifiqué 341
  (comparación de cierre) ni 2230 (jest entero), porque exigen la suite
  entera.
- **Estabilidad.** La espera de E4.5 (`reminders-section` visible y
  `reminders-section-skeleton` ausente en el mismo `waitFor`) fue estable en
  todas las corridas del fichero.
