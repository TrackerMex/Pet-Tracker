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

## Pre-verificación E4 (ronda 1d)

Fecha: 2026-10-07. Objeto: `d24167fa` (E4.9-E4.12 en `requirements.md` y en
el handoff). `src/` sigue igual a `c7ac5ceb`.

Método:

- Worktree desechable en `d24167fa`. Copié literales los bloques (a), (b) y
  (c) de E4.2 del handoff. `index.test.tsx` da numstat `172 0`, y las anclas
  nuevas de `grep -cF` dan lo que dice el handoff.
- Base: 215/215.
- Cada sonda corre sola contra `index.test.tsx` entero y se revierte con
  `git checkout HEAD --`. Después de cada una, el árbol y `git diff --cached`
  quedan vacíos.
- No corrí `init.sh`, ni la suite entera, ni el rojo de E4.3: esas cifras las
  midió el leader. El worktree ya está eliminado.

**Resultado: E4 insuficiente, 2 huecos (H8 y H9).** H5, H6, H7 y X42 quedan
cerrados. Los dos huecos nuevos son del mismo tipo que H6 y H7: mis propuestas
de candado de la ronda 1c eran más estrechas que su cláusula.

### 1. ¿E4.9-E4.12 cierran H5, H6, H7 y X42?

Sí. Las 17 sondas caen por aserción, con 0 `TypeError`, `ReferenceError`,
`SyntaxError` y «Unable to find».

| Sonda | Hueco | Falla en | Aserción |
|---|---|---|---|
| X18i, X18p | H5 | `deja el error del detalle ($kind) …` (las 2 filas) | `toEqual` |
| X17i, X17p | H5 | `deja el botón del mapa del día …` | `toEqual` |
| X27d | H5 | `no da entrada al hero con alertas abiertas` | `toEqual` |
| X39s2, X39c | H6 | `funde igual la fila con la actividad en $kind` (las 4 filas) | `toBeUndefined` |
| X43s | H6 | ídem (las 4 filas) | `toEqual` |
| X39r2, X39c2 | H6 | `funde igual bajo reduce motion` | `toBeUndefined` |
| X43r / X44r | H6 | ídem | `toEqual` / `toBe` |
| X30x, X30v, X30n, X37r | H7 | `no añade texto ni nombre accesible a la fila` | `toEqual` |
| X42 | E4.12 | `monta el skeleton directamente en la tarjeta, …` | `toBe` |

### 2. ¿Cubren los candados la cláusula entera?

Enumeré las ramas leyendo el JSX de `index.tsx` y solo sondeé las que podían
sobrevivir.

**R5, «no reciben entrada».** Completo, sin sondas nuevas:

- `pet-hero-error` solo se pinta con el detalle en `error` o `unreachable`, y
  E4.3 cubre las dos filas.
- `weekly-activity-day-map` tiene una sola rama (actividad `ok` y día
  seleccionado), cubierta por E4.3.
- En `index.tsx`, el hero solo se ramifica por `hasOpenAlerts`. E4.6 lo cubre
  sin alertas y E4.9 con ellas.
- `home-states` tiene tres ramas (carga, error y vacío), y E4.6 cubre las tres.
- Con reduce motion es una conjunción con una dimensión que R5 no nombra
  (ronda 1c, §4).

**R7, «sin `style` ni `className`».** Completo:

- R7 cubre `ok` sin reduce motion.
- E4.10 cubre reduce motion y los 4 `kind` que no son `ok`.
- Con `unauthorized` no se pinta el reveal (X40).

**R7, «envuelve la fila desde fuera: la fila conserva su `View` con
`className="flex-row"` y sus celdas siguen siendo sus hijos directos».**

- Clase de la fila e hijo único del reveal: R7 y E4.10 lo cubren con `ok`,
  con reduce motion y con los 4 `kind` que no son `ok`.
- Celdas como hijos directos:
  - con `ok` y sin reduce motion, #69 R12 (cuatro hijos no-string);
  - con los 4 `kind` que no son `ok`, #77 R2 (`[celda, summary-note]`);
  - **con reduce motion no lo cubre nadie: H8.**

**R8, «no añade texto ni copy».** Completo:

- Pista y relleno:
  - E4.8 cubre las props string;
  - E4.11 exige que el relleno no tenga hijos;
  - R8.1 exige que el relleno sea el único hijo no-string de la pista.
- Un string suelto en la pista (X30s) tumba 51 `it` con «Invariant Violation:
  Text strings must be rendered within a <Text> component». En el dispositivo
  sería un crash, así que no es un hueco.
- Fila: R8.2 exige que la pista vaya justo detrás de `collar-battery`, y E4.8
  que sea el último hijo.
- Props de accesibilidad en la pista, el relleno y la fila: E4.11.

**R8, «el lector de pantalla sigue leyendo `collar-battery`».**

- `collar-battery` oculto cae por consulta (X37h).
- La fila agrupada con nombre propio la cubre E4.11.
- **Agrupar un ancestro por encima de la fila no lo cubre nadie: H9.**

### 3. Huecos que E4 no cierra (bloqueantes)

**H8 — R7, «sus celdas siguen siendo sus hijos directos», con reduce motion.**

- Sonda X45r (215/215): con `reduceMotion`, las tres celdas de `ok`
  (actividad, sueño y distancia) van dentro de un
  `<View className="flex-3 flex-row">`. Es un componente `CellsWrap` en
  `index.tsx` que solo envuelve si recibe `wrap`.
- `expectRowUntouched` no la ve:
  - solo comprueba la celda del peso (el abuelo de `summary-weight`) y que el
    reveal tenga un único hijo;
  - #69 R12 cuenta los hijos de la fila, pero sin reduce motion.
- El origen es mío. Mi propuesta de H6 copiaba las comprobaciones de
  `envuelve la fila del resumen sin tocarla`, que no mira las celdas porque
  sin reduce motion ya las mira #69 R12. Es el mismo hueco que X44r, en la
  otra mitad de la frase.
- Candado, al final de `funde igual bajo reduce motion`, detrás de
  `expectRowUntouched(reveal);`:

```ts
    const row = screen.getByTestId('summary-weight').parent?.parent;
    expect(row?.children.filter((child) => typeof child !== 'string')).toEqual(
      ['summary-weight', 'summary-activity', 'summary-sleep', 'summary-distance'].map(
        (id) => screen.getByTestId(id).parent,
      ),
    );
```

**H9 — R8, «el lector de pantalla sigue leyendo `collar-battery`», con un
ancestro por encima de la fila agrupado con nombre propio.**

- Sondas:
  - X46c: `accessible accessibilityLabel="collar"` en el `Card` de
    `collar-card` (`index.tsx`). 215/215.
  - X46e: `accessible accessibilityLabel={testID}` en el `Animated.View` de
    `HomeEntrance` (`home-entrance.tsx`). 215/215 en `index.test.tsx` y 6/6
    en `home-entrance.test.tsx`.
- El efecto es el de X37r: el lector lee la tarjeta o el envoltorio, no
  `collar-battery`.
  - `home-entrance-collar` es un nodo nuevo de #152.
  - R4 solo le prohíbe `style` y `className`.
- El origen es mío: mi propuesta de H7 se paraba en la fila, y E4.11 la copió
  (`track.parent`).
- Candado, en `no añade texto ni nombre accesible a la fila`. El bucle de
  E4.11 se queda para la pista y el relleno, que no son ancestros:

```ts
    const content = screen.getByTestId('home-content');
    for (
      let node: typeof content | null = screen.getByTestId('collar-battery');
      node && node !== content;
      node = node.parent
    ) {
      expect(
        Object.keys(node.props).filter((key) => /^(accessib|aria-|role$|importantForAccessibility)/.test(key)),
      ).toEqual([]);
    }
```

  En producción, la cadena es `collar-battery`, la fila, `collar-card` y
  `home-entrance-collar`, y ninguno tiene una prop que case. Las props de los
  tres últimos son:
  - la fila: `className, children`;
  - `collar-card`: `testID, children, className, style`;
  - `home-entrance-collar`: `testID, entering, children` y las del mock.

**Verificación (spike).** Metí los dos candados como `it` sueltos en el
worktree desechable; no están en ningún commit del repo.

- En producción pasan.
- Con X45r, X46c, X46e y X37l, cada sonda cae por aserción.
- Con el spike en el fichero, `bun run typecheck` y `bun run lint` dan exit 0.

**Cifras.** Ninguno de los dos añade `it`: amplían el `it` de E4.4 y el de
E4.8. Los dos ya caen en el rojo de E4.3, uno por la entrada bajo reduce motion
y otro por el `accessibilityLabel` en la pista. Por eso 215, 23/192/215 y 174
no deberían moverse. Lo deduzco, no lo medí.

### 4. No bloqueantes

- **X37l.** `accessibilityLabel` en el propio `collar-battery` sobrevive
  215/215. El lector sigue leyendo `collar-battery` y la barra no añade nada:
  es un cambio en el `Text` previo, fuera de la cláusula. El recorrido de H9
  empieza en `collar-battery`, así que también lo caza sin coste.
- **X30s.** Ver §2: cae, no es un hueco.
- **Conjunciones.** Siguen igual que en la ronda 1c, §4. Por ejemplo, las
  celdas con reduce motion y un `kind` que no es `ok`.

## Pre-verificación E4 (ronda 1e)

Fecha: 2026-10-07. Objeto: `54b168c9`, que añade E4.13 (H8) y E4.14 (H9) en
`requirements.md` y amplía los bloques (b) y (c) del handoff. `src/` sigue
igual a `c7ac5ceb`.

Método:

- Worktree desechable en `54b168c9`. Copié literales los bloques de E4.2 del
  handoff. `index.test.tsx` da numstat `186 0`, y las 18 anclas de `grep -cF`,
  las dos nuevas incluidas, dan lo que dice el handoff.
- Base: 215/215.
- Cada sonda corre sola contra `index.test.tsx` entero y se revierte con
  `git checkout HEAD --`. Después de cada una, el árbol y `git diff --cached`
  quedan vacíos. Todas las sondas pasan `bun run typecheck` con exit 0, así que
  son código válido y no rojos por tipos.
- No corrí `init.sh`, ni la suite entera, ni el rojo de E4.3. Las cifras 215,
  23/192/215, 174, 2232 y 343 las midió el leader. Los dos worktrees
  desechables ya están eliminados.
- Esta vez apliqué la lección de las rondas 1b-1d. Para cada candado, el mío
  incluido, enumeré las ramas hermanas de la cláusula entera: otros ancestros,
  otras celdas, otros `kind`, reduce motion y otras props con el mismo efecto.
  No miré solo la rama de la sonda. Las conjunciones siguen fuera de alcance
  (ronda 1c, §4).

**Resultado: E4 insuficiente, 4 huecos (H10-H13).** H8 y H9 quedan cerrados.
Los cuatro huecos nuevos son ramas de cláusulas que E4 ya canda en otra rama.
Uno (H12) es error mío de la ronda 1d: di por cubierta una rama con un
candado que solo cuenta hijos.

### 1. ¿E4.13 y E4.14 cierran H8 y H9?

Sí. Las seis sondas de H8-H9 y X45a caen por aserción, con 0 `TypeError`,
`ReferenceError`, `SyntaxError` y «Unable to find».

| Sonda | Hueco | Falla en | Aserción |
|---|---|---|---|
| X45r (3 celdas en un `View` solo bajo reduce motion) | H8 | `funde igual bajo reduce motion` | `toEqual` |
| X45a (solo la celda de actividad envuelta bajo reduce motion, el recuento no cambia) | H8 | ídem | `toEqual` |
| X46c (`collar-card` agrupado con nombre) | H9 | `no añade texto ni nombre accesible a la fila` | `toEqual` |
| X46e (`HomeEntrance` agrupado con nombre) | H9 | ídem | `toEqual` |
| X46h (`home-content` con nombre) | H9 | ídem | `toEqual` |
| X46s (`screen-home` con nombre) | H9 | ídem | `toEqual` |
| X37l (`accessibilityLabel` en el propio `collar-battery`) | H9 | ídem | `toEqual` |

X45a importa porque conserva el número de hijos de la fila. E4.13 la caza
porque compara con `toEqual` contra los padres de los cuatro valores, no
porque cuente.

### 2. Barrido cláusula × rama × candado × sonda

**R5.** Ni los `it` de R5 ni la producción cambian desde la ronda 1d, porque el
diff `f2bc714c..54b168c9` solo toca los bloques de R7 y R8. El barrido de R5 de
la ronda 1d (§2) sigue valiendo y no repetí sondas.

**R7, «sus celdas siguen siendo sus hijos directos».**

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| `ok` con reduce motion | E4.13 (`toEqual` contra los 4 padres) | X45r, X45a | cae |
| Los 4 `kind` que no son `ok`, sin reduce motion | #77 R2 (`rowChildren[0]` `toBe` la celda y `rowChildren[1]` es `summary-note`) | — | cubierta |
| `ok` sin reduce motion, celda de peso | R7 `envuelve la fila del resumen sin tocarla` (`row` = abuelo de `summary-weight`) | — | cubierta |
| `ok` sin reduce motion, celda de actividad | #69 R1 `keeps the row flush without spacing utilities` (clase del abuelo de `summary-activity`) | X45n | cae (`toBe`) |
| **`ok` sin reduce motion, celdas de descanso y distancia** | **ninguno**: #69 R12 solo cuenta 4 hijos | **X45s** | **sobrevive 215/215: H12** |

**R7, «El skeleton se desmonta en el acto, sin fundido cruzado»**, en la
lectura de E4.12: «#152 no envuelve `summary-skeleton` ni le añade un fundido
de salida propio».

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Envoltorio sin reduce motion | E4.12 (`parent` `toBe` `summary-card`) | X42 (ronda 1d) | cae |
| **Envoltorio solo bajo reduce motion** | **ninguno**: E4.12 corre sin reduce motion | **X42r** | **sobrevive: H11** |
| **Fundido de salida propio, sin envoltorio** | **ninguno**: E4.12 solo mira el padre | **X42e** | **sobrevive: H10** |

**R7, «no monta el fundido mientras el skeleton ocupa su sitio»**: el `it` de
R7 que niega el WHEN.

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Sin reduce motion | R7 `no monta el fundido mientras el skeleton ocupa su sitio` | — | cubierta |
| **Bajo reduce motion** | **ninguno** | **X49r** | **sobrevive: H11** |

R7 nombra reduce motion («igual con o sin reduce motion»). Por eso cada
cláusula de R7 × reduce motion es una rama y no una conjunción: es el mismo
criterio que aceptó H6 y H8.

**R8, «La barra no añade texto ni copy; el lector de pantalla sigue leyendo
`collar-battery`»** (E4.11 y E4.14).

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Ancestro agrupado con `accessible` o nombre, hasta la raíz | E4.14 | X46c, X46e, X46h, X46s | cae |
| El propio `collar-battery` con nombre | E4.14 | X37l | cae |
| `<Text>` anidado que envuelve `collar-battery` | R8.2 (`pone la barra detrás del porcentaje en su fila`) | X47t | cae (`toBe`) |
| **Ancestro agrupado con `screenReaderFocusable`, `focusable` o `tabIndex`** | **ninguno**: la regex no casa esas props | **X46r, X46f, X46t** (`collar-card`) y **X37s** (la fila) | **sobreviven 215/215: H13** |
| **La pista con `focusable`** | **ninguno**: misma regex | **X30f** | **sobrevive 215/215: H13** |

### 3. Huecos que E4 no cierra (bloqueantes)

**H10: E4.12, «ni le añade un fundido de salida propio».**

- Sonda X42e: `animation={{ exiting: { value: FadeOut.duration(400) } }}` en
  el `Skeleton` de `summary-skeleton`. `heroui-native` acepta ese override y
  lo pone como `exiting` del host. Sobrevive 215/215.
- Es justo lo que E4.12 prohíbe, pero el `it` de E4.12 solo mira el padre.

**H11: R7 con reduce motion mientras la actividad está pendiente.** La
sección 2 explica por qué reduce motion es una rama de R7.

- X42r: `summary-skeleton` dentro de un
  `Animated.View exiting={FadeOut.duration(400)}`, solo con `reduceMotion`.
  Sobrevive 215/215.
- X49r: un `summary-reveal` vacío montado junto al skeleton, solo con
  `reduceMotion`. Sobrevive 215/215.

Un solo candado cierra H10 y H11. Convierte el `it` de E4.12 en un `it.each`
sobre reduce motion (añade `FadeOut` al import de `react-native-reanimated`
del fichero):

```ts
  it.each([false, true])(
    'monta el skeleton directamente en la tarjeta, sin fundido de salida propio (reduce motion: %s)',
    async (reduceMotion) => {
      mockUseReducedMotion.mockReturnValue(reduceMotion);
      mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
      await renderHome();
      const skeleton = await screen.findByTestId('summary-skeleton');
      expect(skeleton.parent).toBe(screen.getByTestId('summary-card'));
      expect([FadeOut, undefined]).toContain(skeleton.props.exiting);
      expect(screen.queryByTestId('summary-reveal')).toBeNull();
    },
  );
```

Esto mide la producción:

- Sin reduce motion, `heroui-native` pone `exiting` igual a `FadeOut`, el
  builder de serie con la misma identidad.
- Bajo reduce motion no pone ninguno (`undefined`).
- Así el candado deja pasar el fundido de heroui-native que E4.12 deja fuera,
  y caza cualquier fundido propio.
- Coste: queda atado al valor de serie de `heroui-native`. Si una versión
  nueva lo cambia, este `it` se pone rojo sin que #152 haya tocado nada.

**H12: R7, «sus celdas siguen siendo sus hijos directos», sin reduce motion,
celdas de descanso y distancia.**

- Sonda X45s: la celda de descanso dentro de un `<View>`, solo con
  `!reduceMotion`. La fila sigue con 4 hijos. Sobrevive 215/215.
- El origen es mío. En la ronda 1d (§2) di la rama `ok` sin reduce motion por
  cubierta con #69 R12, que solo cuenta 4 hijos no-string. #69 R1 mira la
  celda de actividad y R7 la de peso; nadie mira las otras dos.
- Candado: el mismo bloque de E4.13, añadido también al final de
  `envuelve la fila del resumen sin tocarla`, que ya define `row`:

```ts
    expect(row?.children.filter((child) => typeof child !== 'string')).toEqual(
      ['summary-weight', 'summary-activity', 'summary-sleep', 'summary-distance'].map(
        (id) => screen.getByTestId(id).parent,
      ),
    );
```

**H13: la regex de E4.11 y E4.14 no casa las props que agrupan en Android.**

- Sondas: X46r (`screenReaderFocusable`), X46f (`focusable`) y X46t
  (`tabIndex={0}`) en `collar-card`; X37s (`screenReaderFocusable` en la
  fila); X30f (`focusable` en la pista). Todas sobreviven 215/215.
- En RN 0.86, Android hace lo mismo con estas props que con `accessible`, que
  la regex ya caza:
  - `accessible` pone `isFocusable`;
  - `focusable` también, y además un listener de click;
  - `tabIndex` se convierte en `focusable` en `View.js`;
  - `screenReaderFocusable` hace el nodo enfocable para el lector.
- Con cualquiera de ellas, TalkBack agrupa el nodo y lee la tarjeta o la fila
  en vez de `collar-battery`. En la pista añaden una parada vacía.
- Candado: cambiar la regex en los dos sitios del handoff, el bucle de E4.11 y
  el recorrido de E4.14, por:

```ts
/^(accessib|aria-|role$|importantForAccessibility|screenReaderFocusable$|focusable$|tabIndex$)/
```

En producción ningún nodo la casa: ni la pista, ni el relleno, ni el camino
de `collar-battery` a la raíz. El camino es `collar-battery`, la fila,
`collar-card`, `home-entrance-collar`, `home-content`, un `View`,
`screen-home`, `RNCSafeAreaProvider` y el contenedor. Hay que volver a medir
las anclas `grep -cF` del handoff que citen la regex vieja.

**Verificación (spike).** Metí los tres candados como `it` sueltos en los
worktrees desechables; no están en ningún commit del repo.

- En producción pasan. El de H10-H11, con reduce motion y sin él.
- Cada sonda cae por aserción, con 0 `TypeError` y «Unable to find»:

| Candado | Sondas |
|---|---|
| H10-H11, fila sin reduce motion | X42e (`toContain`) |
| H10-H11, fila con reduce motion | X42r (`toBe`), X49r (`toBeNull`) |
| H12 | X45s, X45n (`toEqual`) |
| H13 | X46r, X46f, X46t, X37s, X30f, y también X46c, X46e, X46h, X46s, X37l (`toEqual`) |

- Con el spike en el fichero, `bun run typecheck` y `bunx eslint` sobre
  `index.test.tsx` dan exit 0.

**Cifras.**

- H12 y H13 amplían `it` que ya existen.
- H10-H11 convierte un `it` en dos, así que suma 1:
  - `index.test.tsx` pasa de 215 a 216;
  - el cierre, de 343 a 344;
  - Jest móvil, de 2232 a 2233.
- El rojo de E4.3 (23/192/215) y los 174 guards dependen de cómo caiga el `it`
  nuevo en el rojo. Lo deduzco, no lo medí: que lo mida el leader.

### 4. No bloqueantes

- **X50e.** `summary-skeleton` se queda montado con la actividad en `error`
  (`activity.data === undefined || activity.data.kind === 'error'`). Sobrevive
  215/215.
  - El `waitFor` de `no pinta el envoltorio de la actividad con $kind`
    comprueba que el skeleton se va con `no-tracking`, `unauthorized`,
    `unreachable` y `missing-config`, pero no con `error`.
  - Queda fuera de la lectura de E4.12, que reduce la frase a «no envuelve ni
    añade fundido de salida propio».
  - La falta de candado ya existía en `66aaf981`.
  - Si el leader quiere que «se desmonta» siga siendo cláusula, esta es su
    rama sin candado.
- **El recorrido de E4.14 llega a nodos del arnés** (`RNCSafeAreaProvider` y
  el contenedor de render). Si un test futuro envuelve la Home en un
  navegador con props de accesibilidad, el candado se pondría rojo por algo
  ajeno a R8. Hoy no pasa.
- **Conjunciones.** Siguen igual que en la ronda 1c, §4. Por ejemplo, las
  celdas con reduce motion y un `kind` que no es `ok`, o la regex de R8 con
  reduce motion.

## Pre-verificación E4 (ronda 1f)

Fecha: 2026-10-07. Objeto: `f093528e`, que amplía E4 con H10-H14. Cambios
desde `75fea066`:

- E4.7 comprueba que `summary-skeleton` ya no está (H14, X50e).
- E4.11 y E4.14 amplían la regex con `screenReaderFocusable$`, `focusable$`
  y `tabIndex$` (H13).
- E4.12 pasa a `it.each` sobre reduce motion (H10, H11).
- E4.13 pasa a `it.each` propio (H8, H12).

`src/` sigue igual a `c7ac5ceb`.

Método:

- Worktree desechable en `f093528e`. Copié literales los bloques de E4.2 del
  handoff, con el import que ahora trae `FadeOut`.
  - `index.test.tsx` da numstat `202 1`.
  - Las 21 anclas `grep -cF` dan lo que dice el handoff.
- Base: 218/218.
- Cada sonda corre sola contra `index.test.tsx` entero y se revierte con
  `git checkout HEAD -- src`. Después de cada una, el árbol y
  `git diff --cached` quedan vacíos.
- No corrí `init.sh`, ni la suite entera, ni el rojo de E4.3. Las cifras
  26/192/218, 346, 2235 y los 12 casos de R7 las midió el leader.
- El worktree desechable ya está eliminado y el `node_modules` de wt-152
  sigue intacto (723 entradas).
- Barrido como en la ronda 1e: para cada candado, el mío incluido, enumeré
  las ramas hermanas de la cláusula entera. Las conjunciones siguen fuera de
  alcance (ronda 1c, §4).

**Resultado: E4 insuficiente, 2 huecos (H15 y H16).** H10-H14 quedan
cerrados. Los dos huecos nuevos son ramas de cláusulas que E4 ya canda en
otra rama:

- **H15** sale de la cláusula que el leader adoptó en H14 («se desmonta»),
  en su rama de reduce motion.
- **H16** es error mío de la ronda 1e. Di por completa la lista de props que
  agrupan en Android sin leer entero `ReactViewManager.kt`.

### 1. ¿Cierra E4 los huecos H10-H14?

Sí. Las 19 sondas del leader caen por aserción, con 0 `TypeError`,
`ReferenceError`, `SyntaxError` y «Unable to find».

| Sonda | Hueco | Falla en | Aserción |
|---|---|---|---|
| X42e | H10 | E4.12, `reduce motion: false` | `toBe` |
| X42r | H11 | E4.12, `reduce motion: true` | `toBe` |
| X49r | H11 | E4.12, `reduce motion: true` | `toBeNull` |
| X45s, X45d | H12 | E4.13, `reduce motion: false` | `toEqual` |
| X45a, X45r | H8 | E4.13, `reduce motion: true` | `toEqual` |
| X45n | H12 | #69 R1 `keeps the row flush without spacing utilities` y E4.13, `reduce motion: false` | `toBe` y `toEqual` |
| X50e | H14 | `funde igual la fila con la actividad en error` | `toBeNull` |
| X46r, X46f, X46t, X37s, X30f | H13 | `no añade texto ni nombre accesible a la fila` | `toEqual` |
| X46c, X46e, X46h, X46s, X37l | H9 | ídem | `toEqual` |

Sondas mías sobre los candados nuevos:

- **X42d.** Un `exiting={FadeOut.duration(400)}` directo en el `Skeleton`,
  solo con `reduceMotion`. Cae en E4.12, `reduce motion: true` (`toBe`).
- **X42f.** El mismo fundido por la prop
  `animation={{ exiting: { value: … } }}`, solo con `reduceMotion`. Sobrevive
  218/218 y es equivalente, como dice el leader:
  - bajo reduce motion, `heroui-native` anula la config de `animation` desde
    la raíz;
  - el host queda sin `exiting`, que es justo lo que asevera
    `toBe(undefined)`.

### 2. Barrido cláusula × rama × candado × sonda

**R5.** El diff `75fea066..f093528e` solo toca los bloques de R7 y R8 y el
import. El barrido de R5 de la ronda 1d (§2) sigue valiendo.

**R7, «sus celdas siguen siendo sus hijos directos».**

| Rama | Candado | Estado |
|---|---|---|
| `ok` sin reduce motion | E4.13, `reduce motion: false` (`toEqual` contra los 4 padres) | X45s, X45d y X45n caen |
| `ok` con reduce motion | E4.13, `reduce motion: true` | X45a y X45r caen |
| Los 4 `kind` que no son `ok`, sin reduce motion | #77 R2 | cubierta; no la repetí (ronda 1e) |

**R7, «no envuelve `summary-skeleton` ni le añade un fundido de salida
propio»** (E4.12).

| Rama | Candado | Estado |
|---|---|---|
| Envoltorio, con reduce motion y sin él | E4.12 (`parent` `toBe` `summary-card`) | X42r cae; X42 cayó en la ronda 1d y no la repetí |
| Fundido propio sin reduce motion | E4.12 (`toBe(FadeOut)`) | X42e cae |
| Fundido propio con reduce motion, por prop directa | E4.12 (`toBe(undefined)`) | X42d cae |
| Fundido propio con reduce motion, por `animation` | — | X42f es equivalente (§1) |
| Fundido mientras el skeleton está montado, con reduce motion y sin él | E4.12 (`summary-reveal` ausente) y R7 | X49r cae |

**R7, «El skeleton se desmonta en el acto»**, la cláusula que el leader
adoptó en H14.

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Los `kind` `no-tracking`, `error`, `unreachable` y `missing-config`, sin reduce motion | E4.7 (`toBeNull` al final) | X50e | cae |
| `unauthorized` | `waitFor` de `no pinta la fila con la sesión caducada` | — | cubierta |
| `ok` sin reduce motion | ninguno explícito. Solo los `enteringIds` de `solo da entrada a los envoltorios, al fundido y al avatar del selector` y `no da entrada al hero con alertas abiertas` | X50o | cae de rebote (`toEqual`) |
| **`ok` con reduce motion** | **ninguno** | **X50r** | **sobrevive 218/218: H15** |

R7 nombra reduce motion («igual con o sin reduce motion»), así que la
cláusula × reduce motion es una rama, con el mismo criterio que H6, H8 y
H11. Los `kind` que no son `ok` con reduce motion son conjunción, igual que
en las celdas (ronda 1e, §2).

**R8, «el lector de pantalla sigue leyendo `collar-battery`»** (E4.11 y
E4.14).

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Nodo agrupado con `accessible` o nombre, de la pista a la raíz | E4.11 y E4.14 | X46c, X46e, X46h, X46s y X37l caen; X30a cayó en la ronda 1d y no la repetí | cae |
| Nodo agrupado con `screenReaderFocusable`, `focusable` o `tabIndex` | E4.11 y E4.14 | X46r, X46f, X46t, X37s y X30f | cae |
| **Nodo hecho enfocable con `hasTVPreferredFocus`** | **ninguno**: la regex no casa esa prop | **X46v** (`collar-card`) y **X37v** (la fila) | **sobreviven 218/218: H16** |

### 3. Huecos que E4 no cierra (bloqueantes)

**H15: R7, «El skeleton se desmonta en el acto», con reduce motion.**

- Sonda X50r: `{activity.data === undefined || reduceMotion ? (` en la
  condición de `summary-skeleton`. Con reduce motion, el skeleton se queda
  montado junto a la fila ya pintada, con cualquier `kind`. Sobrevive
  218/218.
- Ningún `it` mira que el skeleton se vaya bajo reduce motion:
  - E4.7 corre sin reduce motion;
  - `funde igual bajo reduce motion` no mira el skeleton;
  - los `enteringIds` que cazan X50o no lo ven, porque bajo reduce motion
    `heroui-native` no le pone `entering`.
- Candado: una línea al final del `it.each` de E4.13,
  `deja las cuatro celdas como hijos directos de la fila (reduce motion: %s)`,
  justo después del `toEqual`:

```ts
      expect(screen.queryByTestId('summary-skeleton')).toBeNull();
```

- Así cubre `ok` con reduce motion y sin él, y deja explícita la rama de
  X50o, que hoy solo cae de rebote.
- Con E4.7 y el `waitFor` de `unauthorized`, la cláusula queda candada en
  todas sus ramas.

**H16: la regex de E4.11 y E4.14 no casa `hasTVPreferredFocus`.**

- Sondas: X46v (`hasTVPreferredFocus` en `collar-card`) y X37v (lo mismo en
  la fila). Las dos sobreviven 218/218.
- En RN 0.86, `ReactViewManager.kt` pone `view.isFocusable = true` en
  `setTVPreferredFocus` y además llama a `requestFocus()`.
  - No mira si el dispositivo es una tele, así que en un teléfono el nodo
    queda enfocable y TalkBack lo agrupa igual que con `focusable`.
  - El tipo `ViewProps` acepta la prop vía `TVViewPropsIOS`, así que
    compila.
- Para no repetir la ronda 1e, leí todos los setters de props de RN 0.86 que
  hacen enfocable una vista:

  | Prop | Dónde | ¿La casa la regex de E4? |
  |---|---|---|
  | `accessible` | `ReactViewManager.kt`, `setAccessible` | sí (`accessib`) |
  | `focusable` | `ReactViewManager.kt`, `setFocusable` | sí |
  | `tabIndex` | se convierte en `focusable` en `View.js` | sí |
  | `screenReaderFocusable` | `BaseViewManager.java`, `setScreenReaderFocusable` | sí |
  | `hasTVPreferredFocus` | `ReactViewManager.kt`, `setTVPreferredFocus` | **no** |

  No hay más en `views/view` ni en `uimanager`. El resto de props de
  accesibilidad ya caen en `accessib`, `aria-`, `role` e
  `importantForAccessibility`.
- Candado: en los dos sitios del handoff, el bucle de E4.11 y el recorrido de
  E4.14, la regex pasa a:

```ts
/^(accessib|aria-|role$|importantForAccessibility|screenReaderFocusable$|focusable$|tabIndex$|hasTVPreferredFocus$)/
```

- Con esto, la regex cubre todos los setters de la tabla y no solo los que ya
  probaron las sondas. En producción, ningún nodo del camino la casa.
- Hay que volver a medir las anclas `grep -cF` del handoff que citen la regex.

**Verificación (spike).** Metí los dos candados en el worktree desechable;
no están en ningún commit del repo.

- En producción `index.test.tsx` da 218/218.
- Cada sonda cae por aserción, con 0 `TypeError`, `ReferenceError`,
  `SyntaxError` y «Unable to find»:

| Candado | Sonda | Falla en | Aserción |
|---|---|---|---|
| H15 | X50r | E4.13, `reduce motion: true` | `toBeNull` |
| H15 | X50q (como X50r, pero solo con `ok`) | ídem | `toBeNull` |
| H15 | X50o | E4.13 en las dos filas y los dos `it` de `enteringIds` | `toBeNull` y `toEqual` |
| H16 | X46v, X37v y X30v (`hasTVPreferredFocus` en la pista) | `no añade texto ni nombre accesible a la fila` | `toEqual` |
| H16 | X46r y X37s (control de la regex ampliada) | ídem | `toEqual` |

- Sin el spike, X50q no la medí. Lo deduzco: X50r pinta igual que X50q en el
  caso `ok` con reduce motion, y X50r sobrevive.
- Con el spike en el fichero, `tsc --noEmit` y `bunx eslint` sobre
  `index.test.tsx` dan exit 0.

**Cifras.** Las dos cosas amplían `it` que ya existen, así que no se mueven:

- los 218 de `index.test.tsx`;
- el cierre, 346;
- Jest móvil, 2235;
- los 12 casos de R7.

El numstat del handoff pasa de `202 1` a `203 1`: la línea de H15. La regex
cambia dentro de líneas que el bloque ya añade.

El rojo de E4.3 (26/192/218) no debería moverse. La línea nueva solo puede
fallar si el rojo deja montado el skeleton, y la regex solo si el rojo pone
`hasTVPreferredFocus`, que no aparece en `src/`. Lo deduzco, no lo medí: que
lo mida el leader.

### 4. No bloqueantes

- **E4.12 queda atado al `FadeOut` de serie de `heroui-native`**, como ya
  avisa el leader. Si una versión nueva lo cambia, el `it` se pone rojo sin
  que #152 haya tocado nada.
- **El recorrido de E4.14 llega a nodos del arnés**, como en la ronda 1e, §4.
- **Conjunciones.** Siguen igual que en la ronda 1c, §4. Por ejemplo:
  - el skeleton con reduce motion y un `kind` que no es `ok`;
  - las celdas con reduce motion y un `kind` que no es `ok`;
  - la regex de R8 con reduce motion.

## Pre-verificación E4 (ronda 1g)

Fecha: 2026-10-07. Objeto: `75a10abe`, que añade a E4 los candados de H15 y
H16 tal como los propuse en la ronda 1f. Cambios desde `9cb2242c`:

- E4.13 termina con `expect(screen.queryByTestId('summary-skeleton')).toBeNull();`
  (H15).
- La regex de E4.11 y E4.14 añade `hasTVPreferredFocus$` (H16).
- La spec deja fuera `experimental_accessibilityOrder` y lo explica.

`src/` sigue igual a `c7ac5ceb`.

Método:

- Worktree desechable en `75a10abe`. Reconstruí `index.test.tsx` desde los
  bloques del handoff.
  - Numstat `203 1`.
  - Las 22 anclas del handoff dan lo que dice, incluidas la de la regex
    nueva (2) y la del `toBeNull` del skeleton (3).
  - `tsc --noEmit` y `bunx eslint` sobre `index.test.tsx` dan exit 0.
- Base: 218/218.
- Las sondas de esta ronda son solo mías, escritas de cero (`rv1g-*`). El
  scratchpad lo comparto con el leader, y en la ronda 1f él sobrescribió mis
  scripts de sondas. Ninguna salida que cito aquí viene de un fichero suyo.
- Cada sonda corre sola contra `index.test.tsx` entero y se revierte con
  `git checkout HEAD -- src`. Después de cada una, el árbol y
  `git diff --cached` quedan vacíos.
- No corrí `init.sh`, ni la suite entera, ni el rojo de E4.3.
- El worktree desechable ya está eliminado y el `node_modules` de wt-152
  sigue intacto (723 entradas).
- Barrido como en las rondas 1e y 1f: para cada candado, incluidos los dos
  nuevos, enumeré las ramas hermanas de la cláusula entera. Las conjunciones
  siguen fuera de alcance (ronda 1c, §4).

**Resultado: E4 suficiente.** H15 y H16 quedan cerrados y el barrido no
encuentra huecos nuevos. Las 40 sondas que no son equivalentes caen por
aserción, con 0 `TypeError`, `ReferenceError`, `SyntaxError` y «Unable to
find». X42f sigue siendo la única equivalente.

### 1. ¿Cierra E4 los huecos H15 y H16?

Sí.

| Sonda | Hueco | Falla en | Aserción |
|---|---|---|---|
| X50r | H15 | E4.13, `reduce motion: true` | `toBeNull` |
| X50q | H15 | E4.13, `reduce motion: true` | `toBeNull` |
| X50o | H15 | E4.13 en las dos filas y los dos `it` de `enteringIds` | `toBeNull` y `toEqual` |
| X46v | H16 | `no añade texto ni nombre accesible a la fila` | `toEqual` |
| X37v | H16 | ídem | `toEqual` |
| X30tv | H16 | ídem | `toEqual` |

X50q, que en la ronda 1f solo deduje, ahora está medida.

### 2. Barrido cláusula × rama × candado × sonda

**R5.** El diff `9cb2242c..75a10abe` no toca los bloques de R5. El barrido
de la ronda 1d (§2) sigue valiendo.

**R7, «sus celdas siguen siendo sus hijos directos».**

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| `ok` sin reduce motion | E4.13, `reduce motion: false` | X45s, X45d; X45n (también #69 R1, `toBe`); X45w (11 `it`) | caen |
| `ok` con reduce motion | E4.13, `reduce motion: true` | X45a, X45r | caen |
| Los 4 `kind` que no son `ok`, sin reduce motion | #77 R2 | — | cubierta (ronda 1e) |

**R7, «no envuelve `summary-skeleton` ni le añade un fundido de salida
propio»** (E4.12).

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| Envoltorio siempre | E4.12, `parent` `toBe` `summary-card` | X42 | cae en las dos filas |
| Envoltorio solo con reduce motion | ídem | X42r | cae |
| Fundido propio sin reduce motion | E4.12, `toBe(FadeOut)` | X42e | cae |
| Fundido propio con reduce motion, por prop directa | E4.12, `toBe(undefined)` | X42d | cae |
| Fundido propio con reduce motion, por `animation` | — | X42f | equivalente (ronda 1f, §1) |
| Fundido mientras el skeleton está montado | E4.12, `summary-reveal` ausente | X49r | cae |

**R7, «El skeleton se desmonta en el acto».** Leí la cláusula en dos ejes:
qué `kind` y si se desmonta tarde.

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| `ok` sin reduce motion | E4.13, `reduce motion: false` | X50o | cae |
| `ok` con reduce motion | E4.13, `reduce motion: true` | X50r, X50q | caen |
| `no-tracking`, `error`, `unreachable` y `missing-config`, sin reduce motion | E4.7 | X50e | cae |
| `unauthorized` | `waitFor` de `no pinta la fila con la sesión caducada` | X50T | cae |
| Desmontaje diferido 400 ms | E4.7 (×4), E4.13 (×2), `enteringIds` (×2) | X50t | 8 fallos (`toBeNull` y `toEqual`) |
| Desmontaje diferido 1500 ms | lo anterior más los `waitFor` de `unauthorized` y de los 4 `no pinta el envoltorio de la actividad con …` | X50T | 13 fallos (`toBeNull` y `toEqual`) |

X50t y X50T dejan el skeleton montado un rato con `useState` y
`setTimeout` después de que llegue la actividad. «En el acto» queda candado
también contra un desmontaje tardío, no solo contra uno que nunca ocurre.

**R8, «el lector de pantalla sigue leyendo `collar-battery`»** (E4.11, E4.14
y R8.1).

| Rama | Candado | Sonda | Estado |
|---|---|---|---|
| `accessible` o nombre en `collar-card`, la fila o la pista | E4.11 y E4.14 | X46c, X37r, X30a | caen |
| Nombre en `collar-battery` | E4.14 | X37l | cae |
| Nombre en ancestros altos | E4.14 | X46h, X46s, X46e | caen |
| `screenReaderFocusable` | E4.11 y E4.14 | X46r, X37s | caen |
| `focusable` | ídem | X46f, X37f, X30f | caen |
| `tabIndex` | ídem | X46t | cae |
| `hasTVPreferredFocus` | ídem | X46v, X37v, X30tv | caen |
| `accessibilityValue` y `aria-valuenow` en la pista | E4.11 | X30v, X30n | caen |
| Texto dentro del relleno | E4.11, `fill.children` `toEqual []` | X30x | cae |
| Texto o vista accesible dentro de la pista, antes o después del relleno | R8.1, `track.children` sin cadenas `toEqual [fill]` | X30i, X30j, X30k | caen en los 4 `pinta N% con …` |

**`experimental_accessibilityOrder`.** Contrasté la exclusión del leader con
el código de RN 0.86.2 instalado. Es correcta:

- `ReactViewManager.kt`, `setAccessibilityOrder`: sale sin hacer nada si
  `!ReactNativeFeatureFlags.enableAccessibilityOrder()`.
- `ReactNativeFeatureFlagsDefaults.kt` lo pone en `false`, y el getter JS
  (`ReactNativeFeatureFlags.js`) también.
- Solo `ReactNativeFeatureFlagsOverrides_RNOSS_Experimental_Android` lo
  enciende.
  - `DefaultNewArchitectureEntryPoint` usa `releaseLevel = STABLE` por
    defecto, y la clase de STABLE no lo sobrescribe.
  - Ningún paquete Android de Expo cambia `releaseLevel`.
- En iOS, `RCTViewComponentView.mm` también depende del flag.
  - `ExpoReactNativeFactory.swift` toma el nivel de la clave
    `ReactNativeReleaseLevel` del `Info.plist`, con Stable por defecto.
  - Ni `app.json` ni `app.config.ts` la fijan.
- `src/` no usa la prop (grep = 0).

Con la regex de H16, la lista de props que hacen enfocable una vista en RN
0.86 queda cubierta entera (ronda 1f, §3).

### 3. Huecos que E4 no cierra (bloqueantes)

Ninguno.

**Cifras.** Las cifras 26/192/218 (rojo por aserción), 174 (guards), 218
(verde), 2235 (Jest móvil, 96 suites) y 346 (cierre) son del leader. No las
medí. Lo único que medí fue `index.test.tsx` en verde (218/218) y las sondas.

### 4. No bloqueantes

- **X42f es equivalente**, como en la ronda 1f.
- **E4.12 queda atado al `FadeOut` de serie de `heroui-native`.** Si una
  versión nueva lo cambia, el `it` se pone rojo sin que #152 haya tocado
  nada.
- **El recorrido de E4.14 llega a nodos del arnés**, como en la ronda 1e, §4.
- **La frase de E4.13 «esa cláusula queda candada en todos sus `kind`»** es
  cierta por `kind`: cada uno tiene candado en al menos una rama de reduce
  motion. Los `kind` que no son `ok` con reduce motion son conjunción, no
  rama.
- **`accessibilityViewIsModal`** (solo iOS) en un hermano de un ancestro,
  como el icono `Battery`, haría que VoiceOver ignore a sus hermanos. El
  recorrido de E4.14 no mira hermanos. Queda fuera del sujeto de la
  cláusula: el icono no lo toca #152 y R8 habla de la barra. No lo medí.
- **Conjunciones.** Siguen igual que en la ronda 1c, §4. Por ejemplo:
  - el skeleton o las celdas con reduce motion y un `kind` que no es `ok`;
  - la regex de R8 con reduce motion o con cada umbral.

## Ronda 2

Fecha: 2026-10-08
Revisor: reviewer (Claude)
Worktree: /home/claude/sites/Pet-Tracker-wt-152, branch feature/152-mobile-home-motion-foundations, HEAD 5f75faa8 (verificado; árbol limpio)
Base: Enmienda E4 firmada en 38fa5a95; handoff E5 en ed06559a
Veredicto: APROBADO (R1-R9). R10 y A21 siguen pendientes del humano (no bloqueantes, ver §No bloqueantes 1)

B1-B3 y H1-H16 quedan cerrados. Los 26 `it` de E4 coinciden con E4.1-E4.14
cláusula a cláusula: lo comprobé literal contra el diff de `index.test.tsx`
(+203/−1 desde c7ac5ceb). Además caen por aserción las 39 sondas no
equivalentes de la ronda 1g y todas las del leader, salvo X25w, que cae por
consulta tal como la spec declara. Producción es idéntica a c7ac5ceb.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente #152
- [x] progress/current.md describe la sesión activa de #152. Está desfasado (ver §No bloqueantes 6)

### Checklist C3 — Arquitectura
- [x] Producción sin cambios desde c7ac5ceb: `git diff --quiet c7ac5ceb HEAD` sobre los 4 ficheros de producción da exit 0. Vale el C3 de la ronda 1
- [x] Sin cambios en backend ni en infra desde 36f91e6e (exit 0)
- [x] domain, application e infrastructure no se tocan (feature solo móvil)

### Checklist C4 — TDD
- [x] Cada R-id tiene al menos un test que lo nombra. Los 26 `it` de E4 cuelgan de los `describe` de R5, R7 y R8
- [x] Test primero en E4:
  - **Rojo 8f680bcf** `test(mobile-home): #152 R5 R7 R8 red, ...`. Versiona la mutación de sonda en producción. Medido en worktree desechable: exit=1, **26 failed / 192 passed / 218**. ERR=0 y UF=0: ningún TypeError, ReferenceError ni "Unable to find". Matchers que fallan: 5 `toBe`, 8 `toBeNull` y 13 `toEqual`, exactamente los 26 `it` de E4. El fichero de test del rojo es idéntico al de HEAD. Guards en rojo: 4 suites, 174/174
  - **Verde 3406b9d6** `feat(mobile-home): #152 R5 R7 R8 green, revert the probe mutation`: 218/218, guards 174/174. Producción del verde = c7ac5ceb (exit 0). Móvil del verde = móvil de HEAD (exit 0)

### Checklist C5 — Trazabilidad
- [x] La única fila `pendiente` es R10 `pendiente (humano)`, el smoke que solo cierra el humano. El otro "pendiente" del fichero es el texto de la regla en la línea 32
- [x] Las filas R5 (23 casos), R7 (12) y R8 (12) citan "Rojo E4: 8f680bcf" y "Verde E4: 3406b9d6"
- [x] Los 26 hashes distintos de traceability.md existen y son ancestros de HEAD
- [x] Los commits desde c7ac5ceb (8f680bcf, 3406b9d6, ed06559a, 5f75faa8) siguen el formato de la ronda 1

### Checklist C6 — Spec aprobada
- [x] La casilla de la Enmienda E4 está marcada: requirements.md línea 934, "(fecha: 2026-10-07, en el chat del leader; commit de firma: el que marca esta casilla)" = 38fa5a95. Ver §No bloqueantes 2
- [x] Las firmas previas (spec y E1-E3) siguen intactas, como en la ronda 1

### Checklist C7 — Sin código huérfano
- [x] N/A: E4 solo añade tests; esta feature no reemplaza nada existente

### Checklist C8 — Carta UI
- [x] Producción idéntica a c7ac5ceb, así que vale el C8 de la ronda 1 (cargadas expo:expo-overview y expo:expo-animation)
- [ ] Casilla A21 «Enmienda #152» de docs/ui-guidelines.md línea 440: sigue `- [ ]`, pendiente de firma humana. No bloquea este veredicto; sí bloquea `done`

### Lista cerrada (E5.3)

Medida con el comando literal de E5.3 desde la raíz: exactamente 11 ficheros.

```
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
progress/impl_mobile-home-motion-foundations.md
specs/mobile-home-motion-foundations/traceability.md
```

`git diff --quiet 38fa5a95 HEAD -- progress/review_mobile-home-motion-foundations.md`
da exit=0: Codex no tocó este informe.

### Cifras (medidas por mí, salvo las de init.sh)

| Medida | Resultado |
|---|---|
| `index.test.tsx` en HEAD | 218/218 |
| Comparación de cinco suites (home 218, design-drift 62, global-css 51, motion 9, home-entrance 6) | 346/346, exit 0. Coincide con 281 + 65 del impl |
| Guards (4 suites) en rojo y en verde | 174/174 y 174/174 |
| Jest móvil (init.sh) | 96/96 suites, 2235/2235 tests |
| Typecheck y lint (init.sh) | sin errores |

### Sondas de mutación

Se corrieron en worktrees desechables (rev152r2, rev152r2b y rev152r2c)
creados desde 5f75faa8, cada uno con su `bun install`. Al acabar se borraron
y se hizo prune; `git worktree list` no muestra ninguna entrada rev152.

- **Ronda 1g (mías):** 40 sondas. Las 39 no equivalentes caen todas, con ERR=0 y UF=0. X42f sobrevive (218/218) y es equivalente: `heroui-native` descarta la prop `animation` del Skeleton bajo reduce motion.
- **Juegos del leader:** e4-mut 12, e4b 17, e4c 17, e4d 1 y e4e 6, deduplicados.
- **Total:** 138 entradas, que deduplicadas por contenido dan **93 mutaciones únicas**. Caen 91. Sobreviven 2, que son las dos variantes de X42f (rv1g y e4e), ambas equivalentes.
- **Caídas por consulta:**
  - X25w cae solo por consulta ("Unable to find" en summary-reveal). La spec lo declara como su rojo esperado.
  - X2b, X21b, X18u y X2b+X21 tumban además algún `it` antiguo por consulta. Los candados de E4 y de la ronda 1 caen por aserción en todas ellas.

En la tabla, «(consulta)» marca un `it` que cae por "Unable to find". Las
etiquetas E4.x remiten a los `it` de la Enmienda E4. Una fila repetida entre
orígenes (por ejemplo X42 en rv1g y en e4c) es la misma sonda medida en dos
juegos.

| Sonda | Origen | Cae en | Aserción |
|---|---|---|---|
| X50r | rv1g | E4.13 true | toBeNull() |
| X50q | rv1g | E4.13 true | toBeNull() |
| X50o | rv1g | E4.6 lista; E4.9 alertas; E4.13 false; E4.13 true | toBeNull(), toEqual(expected) |
| X50e | rv1g | E4.7 error | toBeNull() |
| X42 | rv1g | E4.12 false; E4.12 true | toBe(expected) |
| X42r | rv1g | E4.12 true | toBe(expected) |
| X42e | rv1g | E4.12 false | toBe(expected) |
| X42d | rv1g | E4.12 true | toBe(expected) |
| X42f | rv1g | sobrevive 218/218 | — |
| X49r | rv1g | E4.12 true | toBeNull() |
| X45s | rv1g | E4.13 false | toEqual(expected) |
| X45n | rv1g | «keeps the row flush without spacing utilities»; E4.13 false | toBe(expected), toEqual(expected) |
| X45d | rv1g | E4.13 false | toEqual(expected) |
| X45w | rv1g | «sin collar: compone la celda y la nota en una sola fila»; «con la actividad en error: compone la celda y la nota en una sola fila»; «sin conexión: compone la celda y la nota en una sola fila»; «sin configuración: compone la celda y la nota en una sola fila»; «#69 R12: deja que cada celda se anuncie por separado»; «envuelve la fila del resumen sin tocarla»; E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config; E4.13 false | toBe(expected), toEqual(expected), toHaveLength(expected) |
| X45a | rv1g | E4.13 true | toEqual(expected) |
| X45r | rv1g | E4.13 true | toEqual(expected) |
| X46r | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46f | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46t | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46c | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46v | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X37s | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X37f | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X37v | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X37r | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X37l | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46h | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46s | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X46e | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30f | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30tv | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30a | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30v | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30n | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30x | rv1g | E4.8/E4.11/E4.14 | toEqual(expected) |
| X50t | rv1g | E4.6 lista; E4.9 alertas; E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config; E4.13 false; E4.13 true | toBeNull(), toEqual(expected) |
| X50T | rv1g | «no pinta la fila con la sesión caducada»; E4.2 no-tracking; E4.2 unauthorized; E4.2 unreachable; E4.2 missing-config; E4.6 lista; E4.9 alertas; E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config; E4.13 false; E4.13 true | toBeNull(), toEqual(expected) |
| X30i | rv1g | «pinta 82% con bg-success»; «pinta 61% con bg-success»; «pinta 60% con bg-warning-strong»; «pinta 12% con bg-warning-strong» | toEqual(expected) |
| X30j | rv1g | «pinta 82% con bg-success»; «pinta 61% con bg-success»; «pinta 60% con bg-warning-strong»; «pinta 12% con bg-warning-strong» | toEqual(expected) |
| X30k | rv1g | «pinta 82% con bg-success»; «pinta 61% con bg-success»; «pinta 60% con bg-warning-strong»; «pinta 12% con bg-warning-strong» | toEqual(expected) |
| X1 | e4 | E4.4 | toEqual(expected) |
| X2 | e4 | «no dibuja la rejilla sin mascota seleccionada»; E4.1; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X2b | e4 | «carga con skeleton y se calla cuando la actividad falla» (consulta); E4.1; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X2c | e4 | E4.1; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X2d | e4 | «no dibuja la sección sin mascota seleccionada»; E4.1; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X21 | e4 | E4.2 no-tracking; E4.2 unauthorized; E4.2 unreachable; E4.2 missing-config | toBeNull() |
| X21b | e4 | «carga con skeleton y se calla cuando la actividad falla» (consulta); «el envoltorio de la actividad envuelve también su skeleton» (consulta); E4.2 no-tracking; E4.2 unauthorized; E4.2 unreachable; E4.2 missing-config; «al cambiar de mascota solo repiten los bloques que se vuelven a montar» | toBe(expected), toBeNull() |
| X18 | e4 | E4.3 error; E4.3 unreachable | toBe(expected) |
| X18u | e4 | «shows an error and retries pet detail» (consulta); «mantiene el hero y los chips montados cuando el detalle falla» (consulta); E4.3 unreachable | toBe(expected) |
| X17 | e4 | E4.3 mapa | toBe(expected) |
| X2d+X21 | e4 | «no dibuja la sección sin mascota seleccionada»; E4.1; E4.2 no-tracking; E4.2 unauthorized; E4.2 unreachable; E4.2 missing-config; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X2b+X21 | e4 | «carga con skeleton y se calla cuando la actividad falla» (consulta); E4.1; E4.2 no-tracking; E4.2 unauthorized; E4.2 unreachable; E4.2 missing-config; E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toBeNull(), toEqual(expected) |
| X23u | e4b | E4.5 unauthorized | toBeNull() |
| X23a | e4b | E4.5 unreachable | toBeNull() |
| X23m | e4b | E4.5 missing-config | toBeNull() |
| X24u | e4b | E4.5 unauthorized | toBeNull() |
| X24a | e4b | E4.5 unreachable | toBeNull() |
| X24m | e4b | E4.5 missing-config | toBeNull() |
| X25 | e4b | E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config | toEqual(expected) |
| X25d | e4b | E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config | toEqual(expected) |
| X25w | e4b | E4.7 no-tracking (consulta); E4.7 error (consulta); E4.7 unreachable (consulta); E4.7 missing-config (consulta) | — |
| X27 | e4b | E4.6 lista; E4.9 alertas | toEqual(expected) |
| X27i | e4b | E4.6 lista; E4.9 alertas | toEqual(expected) |
| X28 | e4b | E4.6 home-loading; E4.6 home-error; E4.6 home-empty | toEqual(expected) |
| X28e | e4b | E4.6 home-error | toEqual(expected) |
| X28l | e4b | E4.6 home-loading | toEqual(expected) |
| X30t | e4b | E4.8/E4.11/E4.14 | toBe(expected) |
| X30h | e4b | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30f | e4b | E4.8/E4.11/E4.14 | toEqual(expected) |
| X18i | e4c | E4.3 error; E4.3 unreachable | toEqual(expected) |
| X18p | e4c | E4.3 error; E4.3 unreachable | toEqual(expected) |
| X17i | e4c | E4.3 mapa | toEqual(expected) |
| X17p | e4c | E4.3 mapa | toEqual(expected) |
| X27d | e4c | E4.9 alertas | toEqual(expected) |
| X39s2 | e4c | E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config | toBeUndefined() |
| X39c | e4c | E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config | toBeUndefined() |
| X39r2 | e4c | E4.4 | toBeUndefined() |
| X39c2 | e4c | E4.4 | toBeUndefined() |
| X43s | e4c | E4.7 no-tracking; E4.7 error; E4.7 unreachable; E4.7 missing-config | toEqual(expected) |
| X43r | e4c | E4.4 | toEqual(expected) |
| X44r | e4c | E4.4 | toBe(expected) |
| X37r | e4c | E4.8/E4.11/E4.14 | toEqual(expected) |
| X42 | e4c | E4.12 false; E4.12 true | toBe(expected) |
| X30x | e4c | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30v | e4c | E4.8/E4.11/E4.14 | toEqual(expected) |
| X30n | e4c | E4.8/E4.11/E4.14 | toEqual(expected) |
| X45r | e4d | E4.13 true | toEqual(expected) |
| X45s | e4e | E4.13 false | toEqual(expected) |
| X45n | e4e | «keeps the row flush without spacing utilities»; E4.13 false | toBe(expected), toEqual(expected) |
| X45d | e4e | E4.13 false | toEqual(expected) |
| X45a | e4e | E4.13 true | toEqual(expected) |
| X45r | e4e | E4.13 true | toEqual(expected) |
| X42f | e4e | sobrevive 218/218 | — |

### Bloqueantes

Ninguno.

### No bloqueantes

1. **R10 y A21 siguen pendientes del humano.** Falta el smoke de R10 en dev build de Android: casilla `- [ ] Smoke R10 superado por humano` en la línea 586 de requirements.md, fila R10 `pendiente (humano)` en traceability.md. También falta la casilla A21 de docs/ui-guidelines.md, en la línea 440. El leader no debe marcar #152 como `done` hasta que el humano cierre las dos.
2. **La firma de E4 está en el chat y no se puede comprobar desde el repo.** 38fa5a95 es un commit del leader que cita una aprobación hecha en su chat. Hay precedente: las enmiendas E1-E4 de specs/mobile-meal-schedule-editing y specs/mobile-map-gps-pill-battery se firmaron igual. Lo dejo anotado.
3. **X42f es equivalente** en sus dos variantes: `FadeOut.duration(400)` (rv1g) y `FadeOut` (e4e), ambas por la prop `animation` bajo reduce motion. `heroui-native` descarta esa prop con reduce motion, así que ningún test puede distinguirlas.
4. **X25w cae por consulta y no por aserción**, como la spec declara para esa sonda.
5. **Flake puntual en R8 `pinta 12% con bg-warning-strong`.** Lo vi una vez, en la primera corrida paralela de X18i: llegó `width: "0%"` donde se esperaba `"12%"`. La mutación X18i no puede afectar a ese `it`. No se repitió en 17 corridas posteriores:
   - dos corridas secuenciales de X18i, que solo tumbaron sus 2 `it` esperados;
   - 15 corridas del fichero sin mutar bajo carga de 3 carriles (load average de unos 4,7), todas 218/218.

   Origen probable: el `it` (index.test.tsx 5109-5123) asevera `toHaveAnimatedStyle({ width: '12%' }, { shouldMatchAllProps: true })` justo después de `renderMotionHome()`. Lo hace con timers reales y sin esperar a que acabe el `withTiming` de `MOTION_TRANSITION_MS` = 250 ms que arranca en `fillPct` desde 0. La frecuencia observada es de 1 en unas 110 corridas. Evidencia: `$S/rv2-e4c-X18i-run1.txt` en el scratchpad del reviewer.
6. **progress/current.md está desfasado.** Su último cambio es 36f91e6e: no recoge el rechazo de la ronda 1, ni la Enmienda E4, ni el handoff E5. C2 solo exige que describa la sesión activa, y lo hace.
7. **Corrección a la ronda 1g, línea 1312.** Dice "Las 40 sondas que no son equivalentes caen por...". Lo correcto es 40 sondas, de las que 39 no son equivalentes, más X42f, que lo es. Las cifras de esta ronda usan 39 + 1.
8. **Siguen vigentes los no bloqueantes de rondas anteriores:**
   - X20, X31 y X32 son equivalentes; X32 queda bajo el gate de A21.
   - X40.
   - E4.12 está atado al `FadeOut` de serie de `heroui-native`.
   - El recorrido de E4.14 llega a nodos del arnés.
   - `accessibilityViewIsModal` en hermanos queda fuera del sujeto.
   - Conjunciones: `kind` distinto de `ok` con reduce motion, y regex de R8 por umbral.
   - El aviso "A worker process has failed to exit gracefully" del jest móvil.
   - `width` del relleno animado sobre un nodo en flujo; la spec lo permite.

### Output de ./init.sh (corrido por el leader en 5f75faa8, exit=0)

No lo ejecuté yo, porque el clasificador se lo deniega al reviewer. Leí el log
`init-152-r2.log`, cuyo `.head` dice 5f75faa8 y coincide con el HEAD verificado.

```
✅ Build exitoso
Test Suites: 176 passed, 176 total
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# tests 28 / # pass 28 / # fail 0
# tests 5 / # pass 5 / # fail 0
# tests 15 / # pass 15 / # fail 0
A worker process has failed to exit gracefully and has been force exited. ...
Test Suites: 96 passed, 96 total
Tests:       2235 passed, 2235 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total
Tests:       8 skipped, 438 passed, 446 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
