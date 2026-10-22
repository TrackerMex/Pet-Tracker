---
feature: "mobile-home-photo-hero-canvas"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-home-photo-hero-canvas]]

> Cada requisito de [[requirements]] sigue el ciclo TDD obligatorio:
> (1) test rojo → (2) implementación mínima → (3) refactor con tests verdes.
> Un commit por paso con el R-id en el mensaje (`test(mobile): … (R3)` el rojo, `feat(mobile): … (R3)` el verde). **El historial rojo a verde es parte del entregable** (C4 de `CHECKPOINTS.md`): un solo commit con tests, código y docs incumple.
> Rutas relativas a `mobile-pet-tracker/`; abreviaturas de test (HERO, HEROMOT, HOME, SW, GC, BP, GUARD, PA, PR, MOT, CSS) en [[requirements]] §Requisitos funcionales. El detalle técnico está en [[design]].
>
> **Enmienda A1 (2026-10-21).** Solo cambian los bloques R14 y R16, las notas del handoff que hablan de `toBeVisible` y de los mocks de movimiento, y dos filas de «Cuentas a re-medir». El orden global, los demás R y sus cifras no se tocan. Motivo y mecanismo: [[design]] §Hechos medidos H1.
>
> **Enmienda A2 (2026-10-22).** Solo cambian el bloque R14 (paso (1b), mutación (f) y las cuentas de 5 a 6 y de 11 a 12), la línea de test del bloque R2 y dos filas de «Cuentas a re-medir». Motivo: [[design]] §Hechos medidos H2.
>
> **Enmienda A3 (2026-10-22).** Solo cambian el bloque R15 (paso (1b), el verde, sus mutaciones) y una fila de «Cuentas a re-medir». El orden global, los demás R y sus cifras no se tocan. Motivo: [[design]] §Hechos medidos H3.
>
> **Enmienda A4 (2026-10-22, decisión del humano D6).** Cambian los bloques R1, R3, R17, R18 y R20, la nota del orden sobre el alto del frame, una nota del handoff, las filas de «Cuentas a re-medir» y se añade la sección «Enmienda A4: cadena de commits» (cinco commits A a E y siete mutaciones, más las seis del ancla negativa en el bloque R20). El orden global, R2, R4 a R16, R19 y R21 (salvo la lista de lo que mira el humano) no se tocan. A diferencia de A1 a A3 no es un hallazgo de Codex: R1 a R20 ya están implementados con 330, 160 y 130 y A4 se aplica **encima**, con commits nuevos; no se reescribe ningún commit. Motivo y medida: [[design]] §Hechos medidos H4.

## Orden recomendado

Los requisitos van numerados por tema, no por dependencia. Para que el test de un R no afirme nodos que crea uno posterior («sujeto ausente»), el orden de ejecución es:

**R13 → R4 → R1 → R2 → R3 → R5 → R7 → R8 → R6 → R14 → R9 → R11 (solo `GlassCircle` y su test GC) → R10 → R11 (resto: botón «+» en Inicio) → R12 → R15 → R16 → R17 → R18 → R19 → R20 → R21.**

Notas del orden:

- **Antes de R1 hay que tener la casilla `Enmienda #195 aprobada por humano` firmada** (precondición de R20). Sin ella, el implementer no revierte ningún candado y se detiene.
- **Los commits intermedios no tienen que verse bien en pantalla**, solo ir en verde: tras R1 el frame mide 330 en el orden original (la Enmienda A4 lo lleva a 430 con commits nuevos encima, ver «Enmienda A4: cadena de commits») pero las capas viejas siguen dentro hasta que su R las cambia. Nada se mergea a medias.
- **Cada candado de [[requirements]] §Candados se enmienda en el commit del R que lo invalida**, con el comentario `(enmendado por #195 R<n>)` en el `it`. No se enmienda en bloque al final ni antes de que su comportamiento cambie. No hay que reescribir los `it` que la tabla marca como «se conservan»: si uno se pone rojo, es una regresión y se arregla el componente, nunca el `it`.
- **Comentarios con la forma `#195 R<n>`**, nunca `#195` desnudo (el exento de `HEX_LITERAL` en `design-drift` es solo `#NNN R<n>`).
- El ciclo de cada R termina con `git add <rutas>` explícito, no `git add -A`; el árbol debe quedar limpio al terminar.

## Notas para el handoff a Codex

El leader redacta el handoff; esta lista es lo que la spec exige que figure en él:

- **Commits test-primero**, con el R-id, y un commit por paso.
- **Citar `.claude/agents/leader.md` §Esperas**: los tests de movimiento usan Reanimated real con temporizadores falsos (BP, PR y, desde la Enmienda A1, HEROMOT) o los mocks de `withTiming`/`withDelay` (HERO, HOME); no se espera a un contador de mock.
- **Comandos de móvil con `bun`/`bunx`**, nunca `npx` ni `npm i`. No se añaden dependencias.
- **Jest en paralelo con otras worktrees**: un timeout aislado se mide sin flag antes de tocar nada. `jest` posicional es un regex.
- **RNTL 14**: `await fireEvent.press(…)` y `await act(…)`; sin `await`, el `it` siguiente se contamina.
- **`toHaveAnimatedStyle` con `shouldMatchAllProps`** cuando se afirma que no hay claves de más (opacidad colada).
- **Mocks de Reanimated**: HERO añade `withDelay: jest.fn((_ms, animation) => animation)` a su mock (R14); HOME ya lo tiene; el mock de `reicon-react-native` de HOME añade `Plus: mockIcon('icon-plus')` (R11). Las cuentas de llamadas a `withTiming` se miden **después** de `mockClear()` del montaje. Excepción (Enmienda A2): el `it` de R2 `funde al llegar la mascota…` afirma sobre el propio montaje con `pet=null` y no puede medir después de un `mockClear()`; su contador cuenta solo las llamadas de **duración 500** (`call[1]?.duration === 500`, con el 500 como literal del test), porque R14 añade al montar dos de 400 ms. No se amplía ese filtro a las demás aserciones del `it`.
- **Constantes de modelo literales en los tests** (R13, R17): nunca importadas de producción (candado tautológico).
- **Enmienda A4 (D6).** (a) Precondición: la casilla `Enmienda A4 de #195` de [[requirements]] §Aprobación firmada por el humano; sin ella no se empieza la cadena A a E. (b) Los literales 430, 100, 90, `24%`, `44%`, 7,75 y 6,74 se **escriben en el test**; ninguno se importa de producción. Los `it` de HERO que ya comparan contra `PET_HERO_MEDIA_HEIGHT`, `PET_HERO_FADE_HEIGHT` o `PET_HERO_SCRIM_HEIGHT` de forma simbólica se quedan como están (nacen verdes y no se tocan: [[requirements]] §Candados de medida y de paradas). (c) El `it` nuevo de GUARD R17 lee el **texto** de `pet-hero-header.tsx`, no importa ningún símbolo de él. (d) Antes del commit A se miden las bases de «Cuentas a re-medir» marcadas A4; si alguna no coincide con el árbol, se anota la deriva y se avisa al leader antes de seguir. (e) Los commits siguen la cadena de «Enmienda A4: cadena de commits»: cinco commits, los dos de test de HERO y GUARD R17 y el de GUARD R20 antes de su verde, y **un solo** commit de docs para la carta y el bloque de [[design]]. (f) `StyleSheet` no entra en `screens/home/index.test.tsx` (regla de arriba); A4 no toca ese fichero.
- **Cada ancla «= 0» o «= N» lleva su mutación plantada** (lista abajo): la guarda no vale si no se ha visto rojo con el defecto presente.
- **Verificación de lint**: `expo lint` puede morir por memoria con exit 0; la cadena es `… > log 2>&1 && test ! -s log`. Si falla con «Cannot find module», repetir con `--no-cache`.
- **Prettier**: el backend lo usa; el móvil no. No se formatea el móvil con una herramienta que no tiene.
- **Tras mergear `origin/main` con dependencias nuevas**: `bun install --frozen-lockfile`. No se rebasea después de rellenar [[traceability]]; si hace falta, se reapuntan los hashes.
- **Regla de visibilidad (Enmienda A1, [[requirements]] R14 y R16, [[design]] H1).** Sobre `pet-hero-slot`, `pet-hero-caption`, `pet-hero-photo` (si el hero monta ya con mascota), `home-pingo-bubble` y **todos sus descendientes**, con reduce motion apagado, `toBeVisible` falla por construcción en Jest con Reanimated 4.5.1 (el `style` del host guarda el primer render, `opacity: 0`; el valor vivo solo está en `getAnimatedStyle`): ahí se afirma **`toBeOnTheScreen()`**, y la visibilidad real se prueba con la prueba (i) de movimiento (Reanimated real, temporizadores falsos, `getAnimatedStyle`) y la (ii) con reduce motion encendido (`toBeVisible()` síncrono). **Fuera** de esos nodos `toBeVisible` no se relaja: si falla allí, el arreglo es del componente. Esto sustituye a la regla anterior «si un `toBeVisible` falla por opacidad inicial 0, el arreglo es del componente», que era falsa para estos nodos. No se endurece ni se relaja una aserción para que pase una carrera de reloj: si un valor final no llega en la ventana, se amplía la ventana (16 → 32 ms) y se anota en `progress/`.
- **`StyleSheet` no aparece en `screens/home/index.test.tsx`** (ni en código, ni en títulos, ni en comentarios): `design-drift` lo escanea (`#68 R18`, `#69 R13`, `#71 R13`, `#70 R17`, `#85 R12`). HOME aplana con `[node.props.style].flat(Infinity)` y `toContainEqual`; `StyleSheet.flatten` solo en HERO, HEROMOT y BP. Medir: `grep -c StyleSheet src/screens/home/index.test.tsx` devuelve 0 en la base y debe seguir en 0.
- Si Codex puede o no correr `init.sh` lo decide el handoff del leader, no esta spec.

## Cuentas a re-medir al terminar (base + delta)

Cada cifra es la base medida en [[requirements]] §Base medida más el delta que dejan los R; se re-miden con el mismo comando, desde `mobile-pet-tracker/`:

| Comando | Base | Esperado |
|---|---|---|
| `grep -c 'style={CONTINUOUS_CORNER}' src/components/pet-hero-header.tsx` | 1 | 1 |
| `grep -c 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` | 1 | 1 |
| `grep -c 'TABULAR_NUMS' src/components/pet-hero-header.tsx` | 2 | 2 |
| `grep -c 'TABULAR_NUMS' src/screens/home/index.tsx` | 9 | 9 |
| `grep -c 'text-accent-strong' src/components/pet-hero-header.tsx` | 1 | 1 |
| `grep -c 'text-accent-strong' src/screens/home/index.tsx` | 2 | 2 |
| `grep -c 'bg-accent-soft' src/screens/home/index.tsx` | 3 | 3 |
| `grep -c 'bg-accent-soft' src/components/pet-switcher.tsx` | 1 | 1 |
| `grep -c "t('profile.addPet'" src/screens/home/index.tsx` | 1 | 1 |
| `grep -c 'shadow-' src/components/pet-switcher.tsx` | 0 | 0 |
| `grep -cE '^export const MOTION_HERO_' src/theme/motion.ts` | 0 | 4 |
| `grep -cE -e '--(color-)?(scrim\|photo-dim):' src/theme/global.css` | 0 | 8 (2 tokens, 2 formas, 2 temas) |
| `grep -c 'Enmienda #195' ../docs/ui-guidelines.md` | 0 | lo fija el texto de [[design]] (se mide tras la firma y se anota en la trazabilidad) |
| `test -e src/components/glass-circle.tsx && test -e src/screens/home/bubble-pop.tsx && test -e src/__tests__/home-photo-hero-canvas.test.ts` | ausentes | existen |
| `test -e src/components/__tests__/pet-hero-header-motion.test.tsx && test -e src/screens/home/bubble-pop.test.tsx` | ausentes | existen (HEROMOT tras R14, BP tras R16) |
| `grep -c "(enmendado por #195 R14)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 6 (una por título: 5 de A1 y el `it` de R2 de A2; un comentario con la misma cadena la inflaría) |
| `grep -c "(enmendado por #195 R14)" src/screens/home/index.test.tsx` | 0 | 6 (idem; A2 no añade ninguna en HOME) |
| `grep -c "duration === 500" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 1 (el filtro de la fila 12 de A2; los demás 500 del fichero se escriben `duration: 500`) |
| `grep -c "(enmendado por #195 R15)" src/screens/home/index.test.tsx` | 0 | 2 (el `it` de `R5: Home usa el hero compartido`, enmendado en el commit de test de R15, y el de R6 de la fila 13 de A3; un comentario con la misma cadena la inflaría) |
| `grep -c "(enmendado por #195 R15)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 0 (A3 no toca HERO) |
| `grep -c "StyleSheet" src/screens/home/index.test.tsx` | 0 | 0 |
| **A4.** `grep -cE "\b330\b" src/components/__tests__/pet-hero-header.test.tsx` | 8 | 0 tras el commit A |
| **A4.** `grep -cE "\b430\b" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 8 tras el commit A |
| **A4.** `grep -cE "\b(160\|130)\b" src/components/__tests__/pet-hero-header.test.tsx` | 4 | 0 tras el commit A |
| **A4.** `grep -cE "\b(35\|65)%" src/components/__tests__/pet-hero-header.test.tsx` | 2 | 0 tras el commit A |
| **A4.** `grep -cE "\b(24\|44)%" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 2 tras el commit A (las líneas de 14e y 14f) |
| **A4.** `grep -cE "height: (90\|100)\b" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 2 tras el commit A (las líneas de `top` y `bottom` de 14e) |
| **A4.** `grep -cE "toBe\((430\|100\|90)\)" src/components/__tests__/pet-hero-header.test.tsx` | 0 | 3 tras el commit A (las tres de 14a) |
| **A4.** `grep -rcE "\b330\b" src --include=*.ts --include=*.tsx \| grep -v ":0"` | 2 ficheros (`pet-hero-header.tsx` 1, `pet-hero-header.test.tsx` 8) | salida vacía tras el commit C |
| **A4.** `grep -cE "(MEDIA\|FADE\|SCRIM)_HEIGHT = (330\|160\|130)\b" src/components/pet-hero-header.tsx` | 3 | 0 tras el commit C |
| **A4.** `grep -cE "(MEDIA\|FADE\|SCRIM)_HEIGHT = (430\|100\|90)\b" src/components/pet-hero-header.tsx` | 0 | 3 tras el commit C |
| **A4.** `grep -cE "59 35%\|D9 65%" src/components/pet-hero-header.tsx` | 1 | 0 tras el commit C |
| **A4.** `grep -cE "59 24%.*D9 44%" src/components/pet-hero-header.tsx` | 0 | 1 tras el commit C |
| **A4.** `grep -cE "\b(104\|160)\b" src/__tests__/home-photo-hero-canvas.test.ts` | 2 | 0 tras el commit B |
| **A4.** `grep -cE "10\.79\|9\.77" src/__tests__/home-photo-hero-canvas.test.ts` | 2 | 0 tras el commit B |
| **A4.** `grep -cE "7\.75\|6\.74" src/__tests__/home-photo-hero-canvas.test.ts` | 0 | 2 tras el commit B |
| **A4.** (desde la raíz del repo) `grep -cE "alto 330\|130 px\|160 px" docs/ui-guidelines.md` | 1 | 0 tras el commit E |
| **A4.** (desde la raíz del repo) `grep -cE "alto 430.*velo oscuro superior de 90 px.*degradado inferior de 100 px" docs/ui-guidelines.md` | 0 | 1 tras el commit E |
| **A4.** `grep -rlE "pet-hero-fade-bottom\|pet-hero-scrim-top\|pet-hero-frame\|pet-hero-skeleton" src` | 4 ficheros | los mismos 4 (`pet-hero-header.tsx`, `pet-hero-header.test.tsx`, `consistency-classnames.test.ts`, `screens/home/index.test.tsx`) |

Las filas **A4** escriben `\|` porque la tabla de Markdown lo exige; en la terminal se teclea `|` (alternancia de `grep -E` o tubería), sin la barra. Cada «0» de A4 se creyó solo tras plantar **una** aparición del literal viejo en una copia del fichero y ver 1. Un `grep -c` cuenta líneas, no apariciones. Si una cuenta de la base ya no coincide con el árbol al empezar (otra feature mergeó entre medias), se anota la deriva y se avisa al leader antes de seguir.

## Tests enmendados

La lista completa de candados que cambian, con lo que afirman hoy y lo que pasarán a afirmar, vive en [[requirements]] §Candados que esta feature revierte. **No se duplica aquí**: una sola fuente. Cada bloque de abajo nombra los que le tocan.

## Enmienda A4: cadena de commits

Fuente de verdad de lo que se afirma: [[requirements]] R1, R3, R17, R18, R20 y §Candados de medida y de paradas (fila 14); medidas y razones en [[design]] §Hechos medidos H4. Aquí solo se ordena el trabajo. **Precondición:** la casilla `Enmienda A4 de #195` de §Aprobación firmada por el humano; sin ella el implementer no empieza. R1 a R20 ya están implementados con 330, 160, 130 y las paradas `35 %` y `65 %` (base `44ea637f`): A4 se aplica **encima**, con cinco commits nuevos, y no reescribe ninguno. Se parte del árbol limpio y con las bases «A4» de §Cuentas a re-medir medidas.

| Commit | Mensaje (R-id) | Qué cambia | Rojo esperado, o por qué nace verde |
|---|---|---|---|
| A | `test(mobile): enmienda a 430, 100, 90 y paradas 24/44 los ocho it de HERO (R1)` | Solo `components/__tests__/pet-hero-header.test.tsx`: las filas 14a a 14h de [[requirements]] §Candados de medida y de paradas. Cambian literales, la regex de 14f y los títulos de 14b y 14c (330 pasa a 430, sin sufijo nuevo). No se toca HEROMOT ni HOME. | **Rojos**: los ocho `it`, doce casos (14a 1, 14b 1, 14c 4, 14d 1, 14e 1, 14f 1, 14g 2, 14h 1) y ningún otro. Mensajes: `Expected: 430` / `Received: 330` en 14a, 14b, 14c, 14d, 14g y 14h; en 14e el primer `expect` que falle (`90`/`130`, `100`/`160` o la cadena con `24%`); en 14f, la regex que no casa con `35%`. |
| B | `test(mobile): fadeAlpha de 100 px, referencias del nombre y enlace con producción (R17)` | Solo `src/__tests__/home-photo-hero-canvas.test.ts`, `describe` de R17: `fadeAlpha`, las dos referencias del nombre y el `it` nuevo (ver R17 abajo). | **Rojo**: solo el `it` nuevo `enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)` (producción aún dice `PET_HERO_FADE_HEIGHT = 160` y `35%`/`65%`). Los dos casos de `mantiene referencias y suelos en %s` **nacen verdes** (modelo puro: no leen producción); su valor lo demuestra la mutación m7. |
| C | `feat(mobile): hero de 430 con degradado de 100 px y velo de 90 px (R1)` | Solo `components/pet-hero-header.tsx`: `PET_HERO_MEDIA_HEIGHT = 430`, `PET_HERO_FADE_HEIGHT = 100` (con o sin `;`: hoy no lo lleva y ningún candado lo exige), `PET_HERO_SCRIM_HEIGHT = 90` y, en la cadena del degradado inferior, `59 24%` y `D9 44%`. Nada más: ni clases, ni `testID`, ni la cadena del velo, ni los comentarios. | **Todo verde**: HERO (los doce casos), GUARD R17 (el `it` nuevo y los dos casos), `consistency-classnames`, HOME y el resto. Si algo más se pone rojo, es un candado que esta spec no nombra: se arregla el componente y se avisa al leader. |
| D | `test(mobile): la carta lleva las medidas de la Enmienda A4 (R20)` | Solo el mismo GUARD, `describe` de R20: el `it` nuevo `la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas` (ver R20 abajo). | **Rojo**: solo ese `it`, en su primera aserción (`alto 430`); la carta aún dice la altura original. |
| E | `docs(mobile): carta y bloque de design.md con las medidas de la Enmienda A4 (R20)` | **Un solo commit** que reescribe a la vez `docs/ui-guidelines.md` (la última sección `## `) y el **primer** bloque Markdown de [[design]] §Texto de la Enmienda #195, con las frases de [[design]] §Texto de la Enmienda A4 de #195. Ningún otro fichero. | **Verde**: los tres `it` de R20 (byte a byte, A8 y cita, ancla negativa) y `hero-header-amendments.test.ts` sin tocar. En medio no hay commit rojo del byte a byte porque las dos ediciones van juntas. |

A y B van antes de C y entre sí en cualquier orden; D va antes de E; C y D son independientes. El commit E no tiene rojo propio: su rojo es el de D. Quién teclea E (el implementer, como la copia original de R20, o el propio leader, que puede editar `docs/` y `specs/`) lo decide el handoff del leader. Las cuentas de A4 de §Cuentas a re-medir se miden al terminar cada commit, no solo al final.

**Mutaciones de A4**, cada una plantada con el verde de C y E ya hecho, vista en rojo y revertida (se anotan en `progress/impl_…` con el nombre del `it` que se puso rojo). Entre las ocho filas de HERO y los dos `it` nuevos de GUARD, cada uno se pone rojo con al menos una:

| # | Defecto plantado | Rojo esperado | Debe seguir verde |
|---|---|---|---|
| m1 | `PET_HERO_MEDIA_HEIGHT = 431` en `pet-hero-header.tsx` | 14a, 14b, 14c (4 casos), 14d, 14g (2 casos) y 14h: seis `it`, diez casos | 14e, 14f, GUARD R17, y el `it` simbólico `R2 › reserva el alto de la zona de medios en las dos ramas` (compara contra la constante: demuestra que la fila 14 hace falta) |
| m2 | `PET_HERO_FADE_HEIGHT = 101`. Dos pasadas: (i) solo producción; (ii) producción **y** las líneas de 14a (`toBe(101)`) y 14e (`height: 101`) de HERO | (i) 14a, 14e y la rama de la altura del `it` nuevo de GUARD R17; (ii) **solo** esa rama de GUARD R17: demuestra que el enlace cierra la zona ciega de R1 y R3 | en (i), 14b, 14c, 14d, 14g, 14h y 14f (compara contra la constante, no contra un literal) |
| m3 | `PET_HERO_SCRIM_HEIGHT = 91` | 14a y 14e (`top.height`) | 14f, GUARD R17 |
| m4 | `59 24%` pasa a `59 25%` en la cadena de producción | 14e, 14f y la rama de la primera parada del `it` nuevo de GUARD R17 | 14a a 14d |
| m5 | `D9 44%` pasa a `D9 45%` | 14e, 14f y la rama de la segunda parada del `it` nuevo de GUARD R17 | 14a a 14d |
| m6 | Producción **y** HERO a la vez vuelven a `35 %` y `65 %`: la cadena de producción y las dos cadenas de 14e y 14f (el defecto está en producción y en su candado) | **solo** el `it` nuevo de GUARD R17, en las ramas de las dos paradas: demuestra que R17 y producción ya no pueden derivar sin que algún test lo vea | HERO completo |
| m7 | En GUARD, `fadeAlpha` vuelve a los tramos de 104 y 160 y se dejan las referencias nuevas 7,75 y 6,74 | `mantiene referencias y suelos en light` y `…en dark` (nombre: 10,79 frente a 7,75 y 9,77 frente a 6,74) | el `it` nuevo de GUARD R17 y HERO |

Las mutaciones del ancla negativa de R20 (seis) están en el bloque R20. m6 y m2 (ii) son las que prueban que el `it` nuevo no es tautológico: lee el texto de producción, no un símbolo importado.

## R1 — Frame de 430 y raíz

- [ ] (1) Escribir test que falla para R1 (HERO `#195 R1`: `pet-hero` con un solo hijo `pet-hero-frame` con `style` igual a `{ height: 430 }`; constantes 430/100/90; clases de la raíz en `bleed` y `card`). Enmienda en el mismo commit: `R1 › exporta las dos constantes…` y `#127 R2`.
- [ ] (2) Implementación mínima que lo pasa (envolver el contenido en `pet-hero-frame`; constantes; el resto, incluido el pulso de opacidad del punto, sigue dentro del frame sin reordenar hasta que su R lo cambie).
- [ ] (3) Refactor con tests verdes.

**Enmienda A4 (D6).** El cuerpo de arriba describe el estado final. R1 ya está implementado con 330, 160 y 130 (el commit original los exportó así); llegar a 430, 100 y 90 son los commits A (test: filas 14a a 14d) y C (verde) de «Enmienda A4: cadena de commits». Los literales 430, 100 y 90 se escriben en el test; no se importan de producción.

Sondas: m1, m2 y m3 de la cadena (431, 101 y 91 en cada constante, una por una); HERO se pone rojo con cada una; revierte.

## R2 — Foto alineada arriba y fundido

- [ ] (1) Escribir test que falla para R2 (los `it` de HERO se montan **sin `children`**, para no depender del slot que crea R5; PA `#195 R2`: `contentPosition` reenviado solo si se pasa, ausente en blobatar, el snapshot actual intacto; HERO `#195 R2`: primer hijo del frame `pet-hero-photo` con clase `absolute inset-0`, props de `pet-hero-media` con `contentPosition="top"`, `withTiming` con `1`, 500 y la curva, también al cambiar `pet.id`; cero llamadas **de 500 ms** con `pet=null`: Enmienda A2, R14 añade al montar dos de 400 ms y el contador global de ese `it` se filtra por duración en el commit de test de R14, ver su paso (1b)). Enmienda: `R2 › pinta la foto … clave de caché estable` añade `contentPosition`.
- [ ] (2) Implementación mínima que lo pasa (`contentPosition` en `pet-avatar.tsx`; capa `pet-hero-photo` con el fundido; el skeleton dentro de la misma capa).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia 500 por 400 en `MOTION_HERO_FADE_MS`; MOT (R13) y HERO deben ponerse rojos.

## R3 — Degradados

- [ ] (1) Escribir test que falla para R3 (HERO `#195 R3`: cadenas exactas de los dos degradados con los hex que devuelve el hook mockeado, `pointerEvents="none"`, clases `absolute inset-x-0 top-0|bottom-0`, alturas 90 y 100, paradas `59 24%` y `D9 44%` en la cadena inferior, `pet-hero-scrim-top` ausente sin `children`, `pet-hero-fade-top` ausente, sin la palabra `\btransparent\b` en el fuente sin comentarios). Enmienda: `R3 › funde la imagen hacia el fondo opaco por arriba y por abajo`; el `it.each` de hex6 añade `scrim`.
- [ ] (2) Implementación mínima que lo pasa (`useThemeColors(['background', 'scrim'])`; dos capas con `experimental_backgroundImage`).
- [ ] (3) Refactor con tests verdes.

**Enmienda A4 (D6).** El cuerpo de arriba describe el estado final. R3 ya está implementado con alturas 130 y 160 y las paradas `35%` y `65%` del artboard; pasar a 90, 100, `24%` y `44%` son los commits A (test: filas 14e y 14f de [[requirements]] §Candados de medida y de paradas; la cadena del velo `${scrim}80 0%, ${scrim}00 100%` no cambia) y C (verde) de «Enmienda A4: cadena de commits». Las paradas no son proporcionales a las del artboard porque con 100 px esas posiciones incumplen R17 ([[design]] H4); el enlace que lo vigila vive en GUARD R17, no aquí. El literal `24%` y `44%` se escribe en el test.

Sondas: (a) cambia `D9` por `99` en la cadena inferior, HERO rojo; (b) escribe `transparent` en la cadena superior, HERO rojo; (c) escribe `transparent` solo en un comentario, HERO sigue verde (el comentario está exento); (d) A4: m3, m4, m5 y m6 de la cadena (velo 91, `59 25%`, `D9 45%` y las paradas proporcionales plantadas a la vez en producción y en HERO).

## R4 — Tokens `scrim` y `photo-dim` y capa

- [ ] (1) Escribir test que falla para R4 (CSS `#195 R4`: los cuatro valores exactos, cada forma una vez por tema; HERO `#195 R4`: `pet-hero-dim` con clase `absolute inset-0 bg-photo-dim` y `pointerEvents="none"`, segundo hijo del frame).
- [ ] (2) Implementación mínima que lo pasa (`global.css`, en las dos formas y los dos temas, sin espacios tras las comas; la capa en el hero).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia `0.14` por `0.41` en dark; CSS rojo.

## R5 — Fila superior flotante

- [ ] (1) Escribir test que falla para R5 (HERO `#195 R5`: con `insets.top` 40, `top` 52 y clase exacta `absolute inset-x-4` sin fondo ni padding; sin `children`, `pet-hero-slot` y `pet-hero-scrim-top` ausentes). Enmiendas: `R3 › la banda del slot…`, `R4 › baja el slot con insets.top + 12…`, `R4 › no gasta alto de foto cuando no hay slot` (+ `scrim-top` ausente).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R6 — Pie sobre el degradado

- [ ] (1) Escribir test que falla para R6 (HERO `#195 R6`: clases exactas de pie, nombre, raza, valor y etiqueta; `TABULAR_NUMS` en el valor; `—` sin raza; skeletons con `pet=null`; orden de los hijos del frame con y sin `children`, a esta altura del orden ya existen todos; ALERTS `tracking-title` con el hero en el inventario). Enmiendas: `R3 › la banda inferior…` y los `it` que fijan `text-3xl font-black text-foreground`, `font-normal text-muted`, `text-xs font-medium text-muted` (ubicar con `grep -n`).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

Sonda: quita `tracking-title` del nombre; HERO rojo. Quita `'components/pet-hero-header.tsx'` del inventario de ALERTS; ALERTS rojo (el orden alfabético se comprueba con `node`, no a ojo).

## R7 — Píldora y tonos

- [ ] (1) Escribir test que falla para R7 (HERO `#195 R7`: clase exacta de la píldora y de sus dos hijos, los tres tonos, `children.length` 2, `STATUS_TONE_CLASSES` igual al valor de hoy; HOME `#73 R9`). Enmiendas: fila `success` de `#73 R8`, `es una capsula rounded-full…`.
- [ ] (2) Implementación mínima que lo pasa (tabla derivada).
- [ ] (3) Refactor con tests verdes.

Sonda: cambia `bg-accent` por `bg-success` en el punto de `success`; HERO y HOME rojos.

## R8 — Anillo del punto

- [ ] (1) Escribir test que falla para R8 (PR `#195 R8`: `timing` por defecto y propio; HERO `#195 R8`: anillo solo con `success`, `pet` y sin reduce motion, punto sin hijos en los demás casos, `timing.duration` 1600; `STATUS_DOT_PULSE` ausente de las claves exportadas). Sustituye el bloque `#73 E2`, que importa esa constante.
- [ ] (2) Implementación mínima que lo pasa (prop `timing` en `PingRing`; anillo dentro del punto; quitar `STATUS_DOT_PULSE`, `dotOpacity` y su `useEffect`).
- [ ] (3) Refactor con tests verdes.

Sonda: deja el anillo bajo reduce motion; HERO rojo. Quita `timing` del hero; la duración de 2400 aparece y HERO rojo.

## R9 — Avatar seleccionado y punto en línea

- [ ] (1) Escribir test que falla para R9 (SW `#195 R9`: clase exacta del chip seleccionado, envoltorio `size-9`, `PetAvatar` 36 con los dos `testID`, punto con y sin `selectedOnline`, ausente en no seleccionados, `accessibilityState`). Enmienda #70: una expectativa `within()` por decisión y `children.length` por cardinalidad.
- [ ] (2) Implementación mínima que lo pasa (rama `glass` del selector, solo el chip seleccionado).
- [ ] (3) Refactor con tests verdes.

Sonda: pinta el punto también en los no seleccionados; SW rojo.

## R10 — Fila de vidrio del selector

- [ ] (1) Escribir test que falla para R10 (SW `#195 R10`: `-m-1`, contenido `flex-row items-center gap-2 p-1`, orden de chips, `trailing` al final, `children.length` mascotas + 1, letra en mayúscula con su clase, `onSelect` desde ambos tipos). Solo SW: Inicio sigue en la variante `default` hasta R11, así que `#152 R5` aún no se enmienda.
- [ ] (2) Implementación mínima que lo pasa (el chip no seleccionado usa `GlassCircle`, que ya existe porque su parte GC de R11 se hizo antes, ver el orden).
- [ ] (3) Refactor con tests verdes.

Sonda: en la variante `glass`, vuelve a usar el HeroUI `Avatar` para un chip; SW rojo (y, ya con R11 hecho, HOME `#152 R5`).

## R11 — `GlassCircle` y botón «+»

Se hace en dos tandas (ver el orden): primero `GlassCircle` y su test GC; después, ya con R10, la parte de Inicio.

- [ ] (1) Escribir test que falla para R11 (GC `#195 R11`: clase exacta, rol, `onPress`, opacidad .8 pulsado y 1 sin pulsar, sin `BlurView`; HOME `#195 R11`: Inicio usa `variant="glass"` con `selectedOnline` según la conexión, `home-add-pet` último hijo de la fila del selector, etiqueta, `icon-plus` 20 con trazo 2.4, navegación a `/pets/add`; GUARD `t('profile.addPet'` 1 vez). Enmiendas en el commit de la parte de Inicio: los dos `it` de `#152 R5` (sin `pet-avatar-fallback-pet-1`), `Plus` en el mock de HOME; `#122 R2` se conserva.
- [ ] (2) Implementación mínima que lo pasa (`glass-circle.tsx`; en Inicio: `variant="glass"`, `selectedOnline`, `trailing`, `Plus` en el `import` de `reicon-react-native` entre `Pill` y `Stethoscope`, `addPetLabel` sobre el `return` temprano).
- [ ] (3) Refactor con tests verdes.

Sonda: deja una segunda `t('profile.addPet'` en Inicio; GUARD rojo.

## R12 — Campana

- [ ] (1) Escribir test que falla para R12 (HOME `#195 R12`: icono 22, trazo 2, `--color-foreground`; clase y tamaño del punto; dos hijos de `home-hero-actions`; `testID="home-alerts-bell"` una sola vez). Enmiendas: `#78 R10` (ambos), `#124 R1`, `#78 R11`, `#73 R9`.
- [ ] (2) Implementación mínima que lo pasa (`'foreground'` al primer `useThemeColors`).
- [ ] (3) Refactor con tests verdes.

Sonda: duplica el `testID` de la campana; GUARD rojo.

## R13 — Constantes de movimiento

- [ ] (1) Escribir test que falla para R13 (MOT `#195 R13`: los cuatro valores como literales; `no exporta nada más` con las cuatro claves entre `MOTION_FLOAT_TIMING` y `MOTION_PINGO_FLOAT_OFFSET_Y`, en este orden: `MOTION_HERO_BUBBLE_POP_DELAY_MS`, `MOTION_HERO_CAPTION_DELAY_MS`, `MOTION_HERO_FADE_MS`, `MOTION_HERO_PING_MS`; 35 claves).
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R14 — Entradas del hero y reduce motion

Reescrito por la Enmienda A1: rojo / verde / mutación. Fuente de verdad de lo que se afirma: [[requirements]] R14 (regla de visibilidad y tiempos) y §Candados de visibilidad y de forma de style; mecanismo en [[design]] H1. Aquí solo se ordena el trabajo.

- [ ] (1) **Rojo**, en un solo commit `test(mobile): … (R14)` (hay que verlo en rojo por el motivo correcto antes del verde):
  - **HERO** (`components/__tests__/pet-hero-header.test.tsx`): el mock de Reanimated añade `withDelay: jest.fn((_ms, animation) => animation)` (candado «HERO › mock de `react-native-reanimated`»). `describe('#195 R14: …')` con, al menos: (a) con reduce motion apagado, `withTiming` recibe `(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: 400 })` (el 400 como literal del test; el mismo objeto de opciones que ya usa la foto en R2 cambiando solo `duration`) y `withDelay` se llama **una sola vez**, con `80` como primer argumento y una animación `withTiming` de `duration: 400` como segundo (el pie); el slot no usa `withDelay`. No se prescribe si opacidad y desplazamiento comparten un valor compartido; las cuentas se miden **después** de `mockClear()` del montaje; (b) con reduce motion encendido, **cero** llamadas a `withTiming` y a `withDelay` y `StyleSheet.flatten(slot.props.style)` con `opacity: 1` y `transform: [{ translateY: 0 }]` desde el primer render, igual para el pie; (c) los estilos animados solo llevan las claves `opacity` y `transform`, y no hay ningún `entering` en el árbol; (d) **prueba (ii)**: con reduce motion encendido, `toBeVisible()` síncrono (sin `act`, sin `waitFor`) sobre `pet-hero-slot`, `pet-hero-caption`, `pet-hero-media`, un hijo del slot y `pet-hero-name`.
  - **HEROMOT** (**fichero nuevo** `components/__tests__/pet-hero-header-motion.test.tsx`, prueba (i)): copia de HERO los mocks de `heroui-native` (`Skeleton`), `../ping-ring` y `react-native-safe-area-context` (insets `top` 40), `makePet`, `HeroWrapper` y `renderHero`; el mock de `react-native-reanimated` es el de `pop-in.test.tsx` (`...jest.requireActual('react-native-reanimated')`, `__esModule: true` y **solo** `useReducedMotion` sustituido): **no** se mockean `withTiming`, `withDelay` ni `withRepeat`. `jest.useFakeTimers()` en `beforeEach`, `jest.useRealTimers()` en `afterEach`, el avance con `await act(async () => { jest.advanceTimersByTime(n); })` y la lectura con `getAnimatedStyle` importado de `react-native-reanimated`. El tiempo es **acumulado** y todas las constantes son **literales del test**. `describe('#195 R14: movimiento real del hero')`, con reduce motion apagado, una mascota (para que la foto anime) y un hijo en el slot: (a) `pet-hero-slot`: `getAnimatedStyle` contiene `opacity: 0` y `transform: [{ translateY: 14 }]` antes de avanzar; a los 64 ms `opacity` es mayor que 0 y menor que 1 y `translateY` está entre 0 y 14; a los 416 ms (400 + 16) contiene `opacity: 1` y `transform: [{ translateY: 0 }]`; (b) `pet-hero-caption`: a los 64 ms sigue en `opacity: 0` y `translateY: 14` (el retraso de 80 ms no ha vencido); a los 496 ms (80 + 400 + 16) está en `opacity: 1` y `translateY: 0`; (c) `pet-hero-photo`: arranca en `opacity: 0` y a los 516 ms (500 + 16) está en `opacity: 1`; (d) presencia: el hijo del slot, `pet-hero-name` y `pet-hero-media` son `toBeOnTheScreen()` **antes y después** de avanzar el reloj (y en ningún `it` de este fichero se afirma `toBeVisible` con reduce motion apagado sobre ellos).
  - **Enmiendas** (las 12 de [[requirements]] §Candados de visibilidad y de forma de style: 6 en HERO y 6 en HOME; la sexta de HERO es la fila 12 de la Enmienda A2, un `it` de la describe de R2, ver el paso (1b)), con el sufijo `(enmendado por #195 R14)` **a continuación** del que ya lleve el título, cambiando solo las líneas que la tabla cita. Verifica con los comandos de §Cuentas a re-medir (6 y 6 títulos con el sufijo; `toBeVisible` de HOME en 73 tras este commit).
  - Orden de los rojos esperados antes del verde: HERO (a) a (d) y HEROMOT (a) a (d) rojos (todavía no hay animación), la enmienda del `style` del slot de `#195 R5` rojo, y las enmiendas que solo cambian `toBeVisible` por `toBeOnTheScreen()` **verdes** (nacen verdes: lo anota el implementer en `progress/`, su valor lo demuestra la mutación (e) de abajo).
- [ ] (1b) **Enmienda A2** (fila 12 de [[requirements]] §Candados de visibilidad y de forma de style), en el mismo commit de test del paso (1) o, si ese commit ya existe sin ella, en un commit `test(mobile): … (R14)` aparte **antes** del verde. En HERO, `#195 R2: foto alineada arriba y fundido por identidad › funde al llegar la mascota y al cambiar su id, sin repetir por nombre`: la primera aserción de contador (la que sigue a `renderHero(<PetHeroHeader pet={null} />)`) pasa a `expect(mockWithTiming.mock.calls.filter((call) => call[1]?.duration === 500)).toHaveLength(0)`, con el `500` como literal del test (nunca importado de producción), y el título gana el sufijo `(enmendado por #195 R14)` a continuación de lo que ya lleve. **No se toca ninguna otra línea del `it`** ni se amplía el filtro a ellas. Nace **verde** (la foto no arranca su fundido con `pet=null`, con o sin la candidata): lo anota el implementer en `progress/` y su valor lo demuestra la mutación (f). Con el verde hecho, si alguna de las aserciones que siguen en ese `it` (tras `mockClear()`) se pone roja, es una regresión de la implementación (un efecto de entrada que se re-ejecuta al cambiar `pet`): se arregla el componente y se anota.
- [ ] (2) **Verde**: implementación mínima. Slot y pie con valores compartidos y `useAnimatedStyle` (sin `entering`), foto con el valor inicial `reduceMotion || !pet ? 1 : 0` que ya tiene; con reduce motion encendido los tres nacen en su estado final y no se arranca ningún temporizador. Si el reloj simulado de Reanimated no entrega valores intermedios (los 64 ms de (a) y (b)), se conserva el par inicial y el final, se anota en `progress/` y se avisa al leader; si la animación arranca un fotograma después, el margen de 16 ms sube a 32 y se anota. **Nunca** se cambia un valor final ni se vuelve a `toBeVisible` para que pase.
- [ ] (3) **Refactor** con todos los tests (HERO, HEROMOT, HOME) en verde.

**Mutaciones plantadas, cada una vista en rojo y revertida** (se anotan en `progress/impl_…` con el nombre del `it` que se puso rojo):

| # | Defecto plantado | Rojo esperado | Debe seguir verde |
|---|---|---|---|
| a | El valor inicial de `opacity` del slot pasa a 1 con reduce motion apagado (nada animaría) | HEROMOT (a) (el inicio en 0), y la enmienda del `style` del slot de `#195 R5` | HERO (d) |
| b | Con reduce motion encendido, el valor inicial del slot pasa a 0 (un usuario con reduce motion vería el hero invisible) | HERO (b) y (d) | HEROMOT |
| c | El retraso del pie pasa de 80 a 140 | HERO (a) (argumentos) y HEROMOT (b) (a los 496 ms aún no llega) | HEROMOT (a) |
| d | El valor inicial de `pet-hero-photo` con mascota pasa a 1 | HEROMOT (c) | HERO (d) |
| e | En `R3 › el slot flota sin fondo ni padding…` se vuelve a escribir `toBeVisible()` sobre `slot-child` | ese `it` (con el hero ya animado): demuestra que el fallo es real y que la enmienda hacía falta | el resto |
| f | Con el verde hecho, el efecto del fundido de la foto arranca también con `pet === null` (p. ej. se quita la guarda de `pet` y `photoOpacity.set(withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_HERO_FADE_MS }))` corre al montar sin mascota) | HERO `#195 R2 … funde al llegar la mascota…`, en la aserción filtrada de la fila 12 (recibe una llamada de duración 500 y espera 0): demuestra que el filtro por duración no está ciego | HERO R14 (a) a (d) (cuentan las de 400 y no ven la de 500) y HEROMOT |

La mutación (e) se hace **con el verde ya hecho** y es la sonda de la causa: si no se pone roja, la premisa de [[design]] H1 no se cumple en el árbol y hay que parar y avisar al leader. La mutación (f) también se hace con el verde ya hecho y es la sonda de la zona ciega de la fila 12: un filtro `duration === 500` sobre un campo que no existe, o con otro literal, da siempre 0 y pasa con cualquier mutación; sin verlo en rojo no se sabe que mira lo que dice mirar. Si no se pone roja, se para y se avisa al leader.

## R15 — Hueco de 14 y scroll

Ampliado por la Enmienda A3: rojo / enmienda de la fila 13 / verde / mutación. Fuente de verdad de lo que se afirma: [[requirements]] R15 y la fila 13 de §Candados de visibilidad y de forma de style; medida en [[design]] H3.

- [ ] (1) Escribir test que falla para R15 (HOME `#195 R15`: `home-content` en 24 y 16; el hero precede a `home-content`; el hueco de 14 también en la rama de estado sin hero, con `home-states` en su `gap` de 16). Enmienda: `R5: Home usa el hero compartido › conserva gap y paddingBottom` (14 y 120).
- [ ] (1b) **Enmienda A3** (fila 13 de [[requirements]] §Candados de visibilidad y de forma de style), en un commit `test(mobile): … (R15)` **aparte**, posterior al commit de test del paso (1) (que no se reescribe) y **anterior** al verde. En HOME, `R6: home carga pets y selecciona › pads the content below the status bar with the top safe-area inset`: la primera aserción pasa a `expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({ gap: 14, paddingBottom: 120 })` (el 14 y el 120 como literales del test, escrita como hoy, en varias líneas) y el título gana el sufijo `(enmendado por #195 R15)` **a continuación** del texto actual. **No se toca ninguna otra línea del `it`**: la aserción de `home-states` (`{ paddingHorizontal: 24, paddingTop: 52, gap: 16 }`) se queda como está. Este `it` **nace rojo** (la producción sigue en `gap: 16`): lo anota el implementer en `progress/` con `Expected gap: 14` / `Received gap: 16`. Con la producción aún en 16, los rojos esperados de HOME son exactamente cuatro, los `it` que afirman `gap: 14`: el de R5 enmendado, el de R6 de esta fila y los dos de `#195 R15`; ningún otro.
- [ ] (2) **Verde**: implementación mínima. En `src/screens/home/index.tsx`, el `gap` del `contentContainerStyle` de `screen-home` pasa de 16 a 14 (una línea); `paddingBottom: insets.bottom + 96` no cambia, y ni `home-content` ni `home-states` cambian su `gap` interno de 16 ni sus paddings. Si con el verde algún otro `it` de HOME se pone rojo, es una regresión: se arregla el componente (no se condiciona el `gap` por rama) y se avisa al leader, porque habría un candado más que la spec no nombra.
- [ ] (3) **Refactor** con HOME completo en verde.

**Mutaciones plantadas, cada una vista en rojo y revertida** (anotadas en `progress/impl_…` con el nombre del `it` que se puso rojo), todas con el verde ya hecho:

| # | Defecto plantado | Rojo esperado | Debe seguir verde |
|---|---|---|---|
| a | En el `it` de R6 se vuelve a escribir `gap: 16` en la referencia de `screen-home` (el defecto está en el test, no en producción) | ese `it`, con `Expected gap: 16` y `Received gap: 14`: demuestra que el fallo es real y que la enmienda hacía falta | el resto de HOME |
| b | En producción, el `gap` del `contentContainerStyle` de `screen-home` vuelve a 16 | los cuatro `it` de la lista del paso (1b) | el resto de HOME |
| c | En producción, el `gap` interno de `home-states` pasa de 16 a 14 (R15 solo toca el del scroll) | el `it` de R6 de la fila 13 (su bloque de `home-states`, el que la enmienda no toca) y el segundo `it` de `#195 R15`: demuestra que la parte que no cambia sigue mirando | el de R5 y el primero de `#195 R15` |

La mutación (a) es la sonda de la causa y la (c) la de la zona que la enmienda deja intacta: un `toEqual` de `home-states` que no se pusiera rojo con (c) estaría ciego. Si (a) no se pone roja, la premisa de [[design]] H3 no se cumple en el árbol y hay que parar y avisar al leader.

## R16 — Burbuja de Pingo y `pop`

Reescrito por la Enmienda A1: rojo / verde / mutación. Fuente de verdad: [[requirements]] R16 (regla de visibilidad) y la fila `#190 R7` de §Candados; mecanismo en [[design]] H1.

- [ ] (1) **Rojo**, un solo commit `test(mobile): … (R16)`:
  - **BP** (**fichero nuevo** `screens/home/bubble-pop.test.tsx`, Reanimated real): mismo preámbulo de movimiento que HEROMOT (el mock de `pop-in.test.tsx` con solo `useReducedMotion` sustituido, temporizadores falsos, `act`, `getAnimatedStyle`; constantes como literales del test). `describe('#195 R16: …')` con reduce motion apagado: (i) `getAnimatedStyle(bubble)` contiene `opacity: 0` y `transform: [{ scale: 0.6 }]` antes de avanzar y todavía a los 434 ms (450 − 16); a los 470 ms (450 + 20) `opacity` está entre 0 y 1 y `scale` entre .6 y 1.08; al pico (450 + 240 + 16 ms) `opacity` 1 y `scale` cercana a 1.08 y a los 866 ms (450 + 240 + 160 + 16) `scale` cercana a 1, todo con `toBeCloseTo`; `bubble` y `home-pingo-text` son `toBeOnTheScreen()` antes y después de avanzar (nunca `toBeVisible` con reduce motion apagado); y con reduce motion encendido (ii): `getAnimatedStyle` ya es `opacity: 1` y `transform: [{ scale: 1 }]` en el primer render, sin avanzar el reloj, y `toBeVisible()` síncrono sobre `home-pingo-bubble` y `home-pingo-text`. Además: pasa `testID`, `className`, `style` y `children`, y no hay `entering`.
  - **HOME**: `#190 R11`, `#190 R4` y `#190 R7` enmendados con el sufijo `(enmendado por #195 R16)`. `#190 R7` se reescribe como dice su fila de §Candados: `entering` indefinido; `const styles = [bubble.props.style].flat(Infinity)` y `expect(styles).toContainEqual({ borderCurve: 'continuous' })`; con reduce motion encendido, `expect(styles).toContainEqual({ opacity: 1, transform: [{ scale: 1 }] })`. **Sin la cadena `StyleSheet`** en ningún sitio de `screens/home/index.test.tsx`. `#190 R3`, `#190 R5` y `#190 R6` se conservan. HOME no tiene ningún `toBeVisible` sobre la burbuja (medido): no se añade ninguno con reduce motion apagado.
- [ ] (2) **Verde**: implementación mínima (`bubble-pop.tsx` con el patrón de `PopIn`; la clase de la burbuja sin `shadow-sm`; la pose de 56). La burbuja arranca en `opacity: 0` y `scale: .6` salvo con reduce motion, que la pinta en 1 y 1 desde el primer render sin temporizadores.
- [ ] (3) **Refactor** con BP, HOME y los guardas agregados en verde.

**Mutaciones plantadas, cada una vista en rojo y revertida** (anotadas en `progress/impl_…`):

| # | Defecto plantado | Rojo esperado |
|---|---|---|
| a | `BubblePop` arranca en `opacity: 1` con reduce motion apagado | BP (i) (el inicio en 0) |
| b | Con reduce motion encendido, `BubblePop` arranca en `opacity: 0` | BP (ii) y HOME `#190 R7` (`toContainEqual` con `opacity: 1`) |
| c | Devuelve `shadow-sm` a la clase de la burbuja | HOME `#190 R11` |
| d | `BubblePop` deja de aplicar la prop `style` (`CONTINUOUS_CORNER`) | HOME `#190 R7` (`toContainEqual({ borderCurve: 'continuous' })`); la cuenta de `home/index.tsx` sigue en 1, así que ningún otro guarda lo ve |
| e | Se escribe `StyleSheet` en un comentario de `screens/home/index.test.tsx` | `design-drift` (`#68 R18`): demuestra la prohibición |

## R17 — Contraste

- [ ] (1) Escribir test que falla para R17 (GUARD `#195 R17`: modelo WCAG con las constantes literales y los tokens leídos de `global.css`, los dos temas, tolerancia ±0,05 sobre las referencias, suelos de la tabla). Nace verde si R3, R4, R6 y R7 ya están hechos: se demuestra su valor con la mutación de abajo.
- [ ] (2) Implementación mínima que lo pasa (el test es el entregable; no hay código de producción nuevo).
- [ ] (3) Refactor con tests verdes.

**Enmienda A4 (D6), commit B de «Enmienda A4: cadena de commits».** R17 ya está implementado con el degradado de 160 px; en `src/__tests__/home-photo-hero-canvas.test.ts`, `describe('#195 R17: contraste WCAG contra la peor foto')`, y solo ahí:

- [ ] (1-A4) `fadeAlpha(d)` pasa a los tres tramos de 100 px, con **56, 76 y 100 como literales del test**: `d <= 56` → `1 - (d / 56) * 0.15`; `d <= 76` → `0.85 - ((d - 56) / 20) * 0.5`; en otro caso → `0.35 * (100 - d) / 24`. Desaparecen los literales 104 y 160 (cuenta de §Cuentas a re-medir). Los `d` de cada texto (26, 64, 22, 54) no cambian: el pie sigue en `bottom-1.5`.
- [ ] (2-A4) De las referencias de `mantiene referencias y suelos en %s` cambia **una por tema**: el nombre, 10.79 a 7.75 en light y 9.77 a 6.74 en dark. Las otras ocho de cada tema se conservan, incluidas 4.26 y 4.36. La tolerancia sigue en 0.05, el factor 0,86 de dark, los suelos (`textFloor` 4.2 y 4.5, 4.5, 3) y el resto del `it`. Nace **verde**: es un modelo puro que no lee producción.
- [ ] (3-A4) `it` nuevo, mismo `describe`: `enlaza el modelo con las paradas y la altura del degradado de producción (Enmienda A4)`. Lee `src/components/pet-hero-header.tsx` con `read(...)` y le quita los comentarios con `source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')` (la misma expresión que `code` en el `describe` de R19; se repite aquí o se sube al ámbito del fichero, a elección). Con `FADE_HEIGHT = 100`, `KNEE_NEAR = 56` y `KNEE_FAR = 76` como literales del test (los mismos de `fadeAlpha`), afirma **tres cosas, cada una con su propio `expect`** (un candado por rama): (i) el texto casa con `` new RegExp(`PET_HERO_FADE_HEIGHT = ${FADE_HEIGHT}\\b`) `` (sin `export const` y sin exigir `;`); (ii) contiene `` `59 ${Math.round(((FADE_HEIGHT - KNEE_FAR) / FADE_HEIGHT) * 100)}%` `` (que vale `59 24%`); (iii) contiene `` `D9 ${Math.round(((FADE_HEIGHT - KNEE_NEAR) / FADE_HEIGHT) * 100)}%` `` (que vale `D9 44%`). `59` y `D9` son los bytes de alfa .35 y .85 (R3; este `it` no los deriva). Las posiciones **se calculan** de los puntos de quiebre del modelo, no se escriben: si alguien reajusta el modelo, producción tiene que seguirlo. Lo que se lee de producción es **texto**, nunca un símbolo importado. Nace **rojo** en el commit B (producción aún dice 160, `35%` y `65%`).

Mutaciones: (a) cambia el token `muted` de light en `global.css` a un gris más claro, GUARD rojo; (b) cambia un alfa del modelo en el test, la tolerancia sobre la referencia lo pone rojo. **A4**: (c) m7, m2, m4, m5 y m6 de la cadena. m7 demuestra que las dos referencias nuevas del nombre se leen (los dos casos del modelo nacen verdes y sin ella no se sabría); m2 (ii) y m6 demuestran que el `it` nuevo cierra la zona ciega (producción y HERO cambian a la vez y solo GUARD R17 lo ve).

## R18 — Estados conservados

- [ ] (1) Escribir test que falla para R18 (HERO `#195 R18`: skeleton con 430 y sin `rounded-`, blobatar sin foto con `media.props.height` 430, `card` con `rounded-card`; HOME `#195 R18`: los cuatro estados). Es probable que nazca verde: anotarlo en la trazabilidad y demostrar su valor con una mutación (añade `rounded-xl` al skeleton del hero: rojo).
- [ ] (2) Implementación mínima que lo pasa (si ya lo cumple, no hay código).
- [ ] (3) Refactor con tests verdes.

**Enmienda A4 (D6).** El cuerpo de arriba describe el estado final. R18 ya está implementado con 330; los `it` de HERO que lo afirman se enmiendan en el commit A de «Enmienda A4: cadena de commits» y se ponen verdes con el commit C, sin código propio de R18 (el skeleton y el blobatar leen `PET_HERO_MEDIA_HEIGHT`). Son tres filas de [[requirements]] §Candados de medida y de paradas: 14b (`#127 R2`, título y `toStrictEqual({ height: 430 })`; el título pasa de 330 a 430 y conserva su sufijo `(enmendado por #195 R1)`), 14g (`sin mascota conserva skeleton sin radio en %s`, 2 casos) y 14h (`sin foto conserva el blobatar rectangular y los degradados`, `media.props.height` `toBe(430)`). **Nacen rojos** en A (`Expected: 430` / `Received: 330`) y su mutación es m1 (431). HOME `#195 R18` no cambia: no mide ningún alto.

## R19 — Grep-clean y guardas

- [ ] (1) Escribir test que falla para R19 (GUARD `#195 R19`: sobre la lista cerrada de siete ficheros, cero hex, cero `[...]`, cero `StyleSheet.create`, cero sombras legacy, cero emoji, cero `\btransparent\b` en el hero sin comentarios; las cuentas de la tabla de arriba; ausencia de `BlurView`). Existe el fichero GUARD desde R17: este ciclo añade el `describe` de R19.
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

Mutaciones plantadas, cada una vista en rojo y revertida: (a) un hex `#FF0000` en `glass-circle.tsx`; (b) una clase `h-[330px]` en el hero; (c) un `shadow-md` en `pet-switcher.tsx`; (d) un `BlurView` importado en `glass-circle.tsx`; (e) un segundo `t('profile.addPet'`; (f) un `#195` desnudo en un comentario (debe fallar `design-drift`).

## R20 — Carta (docs)

- [ ] (1) Escribir test que falla para R20 (GUARD `#195 R20`: la sección es la última `## ` y su texto contiene el bloque de [[design]] con la casilla normalizada; el párrafo de A8 entero y el nuevo aparte posterior; casilla tolerante `/- \[[ xX]\] Enmienda #195 aprobada por humano/`). **Solo se ejecuta tras la firma de la casilla de §Aprobación** (precondición de procedimiento).
- [ ] (2) Implementación mínima que lo pasa (copiar los dos bloques de [[design]] a `docs/ui-guidelines.md`: el primero al final del fichero, el segundo justo después del párrafo A8).
- [ ] (3) Refactor con tests verdes.

Comprobar además que `hero-header-amendments.test.ts` y los tests que fijan `Enmienda #190` siguen en verde sin tocarse.

**Enmienda A4 (D6), commits D y E de «Enmienda A4: cadena de commits».** La sección de la carta y el bloque de [[design]] ya existen con «alto 330… 130 px… 160 px» (R20 está implementado); las frases que cambian y las cadenas que la carta debe y no debe contener están en [[design]] §Texto de la Enmienda A4 de #195.

- [ ] (1-A4) **Commit D, test rojo.** En `src/__tests__/home-photo-hero-canvas.test.ts`, `describe('#195 R20: …')`, `it` nuevo `la sección de la carta lleva las medidas de la Enmienda A4 y ninguna de las antiguas`. El texto de la sección se obtiene como el `it` de la sección completa: `heading = blocks[0].split('\n')[0]` y `section = charter.slice(charter.indexOf(heading))` (nada de cabeceras escritas a mano). Seis `expect` separados, uno por rama de la cláusula: `section` contiene `alto 430`; contiene `velo oscuro superior de 90 px`; contiene `degradado inferior de 100 px`; **no** contiene `alto 330`; **no** contiene `130 px`; **no** contiene `160 px`. Las seis cadenas son literales del test. Nace **rojo** (en la primera aserción, `alto 430`). Los otros tres `it` de R20 siguen verdes: la carta y el bloque de design.md todavía coinciden entre sí.
- [ ] (2-A4) **Commit E, docs.** Un solo commit, dos ediciones idénticas: el **primer** bloque Markdown de [[design]] §Texto de la Enmienda #195 y la última sección `## ` de `docs/ui-guidelines.md`, con la frase 1 y la frase 2 de [[design]] §Texto de la Enmienda A4 de #195. Ni el segundo bloque, ni la frase de la excepción de contraste (4,26:1 y 4,36:1, suelo 4,2:1), ni la línea `Detalle y tests…`, ni la casilla `- [ ] Enmienda #195 aprobada por humano`, ni nada de `Enmienda #190`, `#67` o `#167` se tocan. Con la frase 2 escrita como dice [[design]] («la altura original», «el degradado original»), la sección no vuelve a nombrar las cifras antiguas.
- [ ] (3-A4) Refactor con tests verdes. Comprobar con los comandos «A4» de §Cuentas a re-medir (carta: 1 a 0 y 0 a 1) y que `hero-header-amendments.test.ts` sigue en verde sin tocarse.

**Mutaciones del ancla negativa**, con el commit E hecho, vistas en rojo y revertidas con `git checkout HEAD -- <rutas>` (y `git diff --cached` en 0). Cada defecto se planta **en la carta y en el primer bloque de design.md a la vez**, para que la comparación byte a byte siga en verde y el único rojo sea el `it` nuevo; sin esa precaución se ponen rojos dos `it` y no se sabría cuál prueba qué:

| # | Defecto plantado en la sección | Rojo esperado (solo el `it` nuevo) |
|---|---|---|
| r1 | `alto 430` pasa a `alto 431` | la aserción de `alto 430` |
| r2 | `velo oscuro superior de 90 px` pasa a `velo oscuro superior de 91 px` | la aserción del velo |
| r3 | `degradado inferior de 100 px` pasa a `degradado inferior de 101 px` | la aserción del degradado |
| r4 | se añade «(antes alto 330)» al final de la frase 2 | la aserción `not` de `alto 330` |
| r5 | se añade «(antes 130 px)» al final de la frase 2 | la aserción `not` de `130 px` |
| r6 | se añade «(antes 160 px)» al final de la frase 2 | la aserción `not` de `160 px` |

Las tres cuentas «= 0» de la carta se creyeron tras plantar **una** aparición en una copia y ver 1 (r4 a r6 son esa misma prueba hecha sobre el `it`). Las seis mutaciones demuestran además que ninguna rama del `it` está ciega.

## R21 — Smoke del humano

- [ ] (1) No hay test automatizado. Preparar la lista de comprobación del dev build (modo claro, oscuro y reduce motion; mascota con foto oscura, con foto clara y sin foto; nombre de 25 caracteres). **Enmienda A4:** añadir la foto real del humano (3:4, 960×1280) con el recorte alineado arriba a 430 de alto; nombre y raza legibles sobre el degradado de 100 px; la fila superior legible bajo el velo de 90 px con el `insets.top` real del teléfono (el velo es más corto que la fila desde `insets.top` ≈ 35); y, para el nombre de 25 caracteres, anotar si ocupa dos líneas y cómo queda sobre un degradado casi transparente. Esto último **no es criterio de aceptación** ([[requirements]] §Fuera de alcance): se mira y se anota para la decisión del humano sobre `numberOfLines={1}`.
- [ ] (2) El humano lo ejecuta en el dev build Android de su PC y firma la casilla de [[requirements]] §Aprobación.
- [ ] (3) Si algo falla, se abre la corrección como enmienda de esta spec o como feature nueva; un fallo de R21 no invalida R1 a R20.
