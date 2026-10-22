# Enmienda A2 de #195 (mobile-home-photo-hero-canvas): informe del spec_author

Fecha: 2026-10-22. Worktree `Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`, HEAD `8192d769`.

Estado: spec editada **sin commit** (lo hace el leader) y **sin aprobar**. La casilla `Enmienda A2 de #195 (contador global de R2) aprobada por humano` de `requirements.md` §Aprobación queda **sin marcar**; no se tocaron la «Firma del gate» ni la casilla de A1. Solo se tocó `specs/mobile-home-photo-hero-canvas/` y este informe. Nada en `mobile-pet-tracker/`, `backend-pet-tracker/`, `docs/`, `feature_list.json` ni `progress/current.md`. `graphify query` no se usó: el trabajo es lectura de la spec y de los tests con `grep` y `sed` sobre un árbol que no cambia.

## 1. Hechos medidos (verificados contra el árbol, no asumidos)

Desde `mobile-pet-tracker/`, HEAD `8192d769`, `git status` sin cambios en el árbol móvil.

1. **R14 no tiene condición de mascota.** `requirements.md` R14: «WHEN el hero se monta, THE SYSTEM SHALL animar solo `opacity` y `transform`… `pet-hero-slot` sube… `pet-hero-caption` hace lo mismo…». No dice «WHILE hay mascota». La candidata del diff de `progress/impl_mobile-home-photo-hero-canvas.md` (sección «PARADA») arranca `slotProgress.set(withTiming(1, timing))` y `captionProgress.set(withDelay(80, withTiming(1, timing)))` en un `useEffect` que solo depende de `[captionProgress, reduceMotion, slotProgress]`: se ejecuta al montar, también con `pet={null}`, y dos veces `withTiming(1, { duration: 400, … })` es lo que reporta Codex.
2. **El `it` rojo existe y su aserción es la citada.** `grep -n` en `src/components/__tests__/pet-hero-header.test.tsx`: `describe('#195 R2: foto alineada arriba y fundido por identidad'` en la línea 615 y el `it('funde al llegar la mascota y al cambiar su id, sin repetir por nombre'` en la 629; la línea 631 es `expect(mockWithTiming).not.toHaveBeenCalled();` justo tras `const view = await renderHero(<PetHeroHeader pet={null} />);`. El título **no lleva hoy ningún sufijo** `(enmendado por …)`.
3. **Ya hay un literal 500 en el propio `it`**: líneas 634 y 638 (`duration: 500`). La aserción nueva usa otro literal 500 de test, no importado de producción.
4. **Las otras dos aserciones de contador del `it` siguen verdes con la candidata, por análisis (no ejecutado).** Líneas 637 (`toHaveBeenCalledTimes(1)`) y 641 (`not.toHaveBeenCalled()`) van **después de un `mockWithTiming.mockClear()`** (635 y 639, cada una tras su `rerender`) y de un `rerender`. El efecto de entrada de la candidata no se vuelve a ejecutar en un `rerender` porque sus dependencias son estables (`useSharedValue` real, que el mock de HERO no sustituye porque hace `...actual`; `reduceMotion` fijo en `false` por el `beforeEach`). Solo se repite el efecto del fundido de la foto, que ya era el comportamiento de R2. Las líneas 634 y 638 usan `toHaveBeenCalledWith` (cualquier llamada), que las dos llamadas de 400 ms no estorban. **Límite de esta verificación**: Codex no pudo medir 637 y 641 porque el `it` aborta en la 631; solo está medido que 631 es el único rojo. La spec lo deja como comprobación del primer verde (tasks.md R14) con la regla: si 637 o 641 se ponen rojas es una regresión de la candidata (un efecto que se re-ejecuta al cambiar `pet`) y se arregla el componente; **no se amplía el filtro** a esas líneas.
5. **Cuentas**: `grep -c 'enmendado por #195 R14'` en HERO = **5** (líneas 265, 333, 352, 395, 673), en HOME = **6** (191, 558, 1504, 1677, 1715, 1762), en HEROMOT = 0; `enmendado por #195 R16` = 0 en los tres. Con A2: HERO 6 (el `it` de R2 es el sexto), HOME 6, total de enmiendas de R14 = **12** (6 + 6).

## 2. Barrido (punto 3 del encargo)

Método: (a) `grep -rlE "withTiming|withDelay|withSpring|withSequence|withRepeat" --include=*.test.ts --include=*.test.tsx src` (12 ficheros); (b) `grep -rlE "PetHeroHeader|pet-hero-header|BubblePop|bubble-pop|screens/home|from '\./index'|HomeScreen"` (15 ficheros); (c) `grep -rln "jest.mock('react-native-reanimated'"` (19 ficheros); (d) tests que montan el árbol de rutas con `renderRouter(routes(), …)`; (e) `grep` de los `testID` descendientes del hero (`pet-chip-`, `home-alerts-bell`, `pet-hero-name`…) fuera de HERO, HOME, HEROMOT y SW. Solo **tres** ficheros montan `PetHeroHeader` o `HomeScreen` **con aserciones sobre las funciones de Reanimated**: HERO, HEROMOT y HOME.

| Fichero | Aserción (línea) | ¿Rota por R14? | Razón |
|---|---|---|---|
| HERO | 631 `expect(mockWithTiming).not.toHaveBeenCalled()` tras montar con `pet=null` | **Sí** | Las 2 entradas de 400 ms de R14 se cuentan: es la fila 12 de A2 |
| HERO | 634, 638 `toHaveBeenCalledWith(1, objectContaining({ duration: 500, … }))` | No | Coincide con cualquier llamada; las de 400 no impiden la de 500 |
| HERO | 637 `toHaveBeenCalledTimes(1)`; 641 `not.toHaveBeenCalled()` | No (por análisis) | Tras `mockClear()` y `rerender`; el efecto de entrada no se re-ejecuta (hecho 4) |
| HERO | 751-758, 781-785 | n/a | `it` **nuevos** de R14 de Codex (ya nacen con el filtro `duration === 400` y con `not.toHaveBeenCalled` bajo reduce motion) |
| HERO | `withRepeat`, `withSequence`, `cancelAnimation` (mocks, líneas 81-85) | No | Solo definiciones del mock; ninguna aserción |
| HEROMOT | todo el fichero | n/a | Reanimated real, sin contadores; fichero nuevo de A1 |
| HOME | 55-58 `expectMealsBarTiming` y 4484, 4522, 4534-4540, 5142, 5152, 5177-5198 | No | Buscan por **valor** (0, 50, 100, 81, 82); las llamadas de R14 valen 1 |
| HOME | 4530 `expect(mockWithTiming).not.toHaveBeenCalled()` | No | Corre con `mockUseReducedMotion.mockReturnValue(true)`; R14 con reduce motion apagado no arranca nada (confirmado: la línea 4521 es `mockUseReducedMotion.mockReturnValue(true)` y la 4522 un `mockClear()`, ambas antes de montar) |
| HOME | 4776-4778, 5021-5026, 5048-5056, 5069-5076, 5549-5551, 5683-5685, 5754 `withDelay … toEqual([delay, delay])` | No | `mockClear()` **después** del montaje y **justo antes** de llamar a `entering({})` a mano; el `withDelay(80)` del pie del hero ocurre al montar, antes del borrado |
| HOME | 5753 `toHaveBeenCalledWith(1, { duration: 250, reduceMotion: Never })` | No | `toHaveBeenCalledWith` (cualquier llamada) tras `mockClear()` |
| HOME | 5755 `withSpring … toEqual([0])`; 5770, 5787 `withRepeat`; 5771, 5788 por valor `-10` | No | R14 no usa `withSpring`/`withRepeat` ni el valor -10 |
| `screens/home/home-entrance.test.tsx` | 63-65, 75, 81 | No | Monta solo `HomeEntrance` (importa `./home-entrance`), no el hero ni `HomeScreen` |
| `food.test.tsx` 1477-1478 | `withTiming` con 100/150 | No | Pantalla de Nutrición, usa `PetSwitcher` `default`, no el hero |
| `celebration`, `ping-ring`, `weight-chart`, `alert-detail` (×2), `weekly-activity-chart`, `empty-state` (cadena de import leída del fuente), `welcome` (regex sobre el fuente), `pairing`, `pop-in`, `pingo-float`, `motion`, `theme-transition` | contadores o regex de Reanimated | No | No importan ni montan `PetHeroHeader` ni `HomeScreen` |
| Tests de rutas (`src/app/__tests__/*navigation*`, `*.notification`, `detail-stack.guard`) | `renderRouter(routes(), { initialUrl: '/home' })` | No | Montan la ruta real `(tabs)/home.tsx`, pero **no afirman** nada sobre `withTiming`/`withDelay`/`withSpring` ni `toBeVisible` sobre descendientes del hero (sus `toBeVisible` son `root-stack`, etc.). Codex no corrió la suite entera con la candidata: queda a `init.sh` |
| Guardas que leen fuentes (`alerts-canvas-fidelity`, `chunky-cta-…`, `consistency-classnames`, `design-drift`, `hero-header-amendments`, `home-pingo-phrase`, `legibility-classnames`, `profile-canvas-fidelity`, `tab-headers-canvas`, `ui-language`) | cuentas y regex sobre código | No | No montan; ya revisados en A1 (§Candados agregados revisados) |

Resultado: **barrido sin más afectados.** Un solo `it` anterior se pone rojo por R14 (HERO 631), que es lo que midió Codex. Descartados a mano por lectura: `home-entrance.test.tsx` línea 63 no monta el hero, `index.test.tsx` 4530 corre con reduce motion encendido y HERO 784 (`it` nuevo de R14) también.

## 3. Qué cambié en cada fichero (estado final, aplicado)

- `requirements.md`: (a) encabezado de la tabla de candados «(Enmiendas A1 y A2)», fila 12 nueva (el `it` de R2: aserción actual, aserción nueva con filtro `call[1]?.duration === 500`, literal 500 del test, resto del `it` intacto, sufijo en el título) y párrafo «Fila 12» tras «Pasa a afirmar» (por qué es de otra naturaleza, qué otras aserciones no se tocan y la regla «no se amplía el filtro»); (b) §Candados que esta feature revierte: «los `it` que no figuran aquí ni en §Candados de visibilidad… (Enmiendas A1 y A2) no se tocan»; (c) `Test` de R2 (su `it` queda enmendado por R14, A2) y `Test` de R14 (el `it` de R2, 12 en total, 6 y 6); (d) §Cómo se mide: el `grep -c` de sufijos pasa a «6 y 6 tras R14» y un `grep -c "duration === 500"` nuevo (0 en la base, 1 tras la fila 12); (e) §Aprobación: casilla `- [ ] Enmienda A2 de #195 (contador global de R2) aprobada por humano` **sin marcar** tras la de A1 y párrafo «Enmienda A2 (2026-10-22)» al final (qué cambia, qué no, hechos medidos, barrido). Texto de A1 y «Firma del gate» intactos.
- `design.md`: párrafo A2 en la cabecera (blockquote de A1) y **H2** en §Hechos medidos (2 llamadas de 400 ms con `pet=null` tomadas del informe de Codex; por qué el contador global no distingue entradas de fundidos; qué aserciones siguientes siguen valiendo y se confirman en el primer verde). No hay cuentas en design.md.
- `tasks.md`: párrafo A2 en la cabecera; excepción a la regla «medir tras `mockClear()`»; «Cuentas a re-medir»: HERO 5 a 6, HOME 6 (sin cambio), fila nueva `duration === 500`; bloque R2 (cero llamadas **de 500 ms**, con remisión a (1b)); bloque R14: «las 12 … 6 y 6» y «(6 y 6 títulos con el sufijo)», paso nuevo **(1b)** (la enmienda, en el commit de test de R14 o aparte antes del verde), fila (f) de mutaciones y la frase que la liga a la regla de parar y avisar. El adendo de Codex no se tocó.
- `traceability.md`: fila R2 (su `it` queda enmendado por R14, hash `626ebc69` intacto), fila R14 («los 12 `it` … 6 y 6») y párrafo final con la línea de A2. Todas las filas siguen «pendiente».

## 4. Mutación de zona ciega (punto 2)

Mutación (f) de R14 en tasks.md: con el verde hecho, plantar en el efecto del fundido de la foto de `pet-hero-header.tsx` un arranque con `pet === null` (p. ej. `photoOpacity.set(withTiming(1, …500))` incondicional), de modo que `pet={null}` dispare un `withTiming` de 500 ms. Exige que **este** `it` (`funde al llegar la mascota…`) se ponga rojo en la aserción filtrada de la fila 12. Sin ella un filtro por duración 500 podría estar ciego (p. ej. un `filter` sobre un campo que no existe da siempre 0 y pasa con cualquier mutación). Además la mutación (a) existente sigue siendo la que cubre el arranque en 0 de la foto.

## 5. Dudas abiertas

- **637 y 641 sin ejecutar.** Verificadas por lectura del mock y de las dependencias del efecto de la candidata, no por corrida (el `it` aborta en 631). La spec prescribe cómo actuar si se ponen rojas.
- **`pet-hero-photo` con `withTiming` de 500 ms y `pet=null` sigue prohibido por R2.** El filtro por 500 es justo lo que sigue vigilando esa regla; lo que deja de vigilar el `it` es que **nadie más** llame a `withTiming` al montar con `pet=null`, y eso ahora lo vigila la prueba (i) de HEROMOT y las de R14 en HERO (líneas 751-758).
- **Tests de rutas con el Home real.** No tienen aserciones sobre Reanimated; si falla alguno por otra causa (p. ej. falta de un mock de insets) es regresión de la candidata, no de la spec.
- **El adendo para Codex** no se tocó (lo escribe el leader); debe citar el filtro por literal 500 y la regla «no ampliar a 637 y 641».

## 6. Verificación final (contra los ficheros editados)

- Casilla A2: `grep -n "^- \[ \] Enmienda A2 de #195" requirements.md` da 1 línea, sin marcar; la de A1 sigue `[x]`; «Firma del gate» no aparece en el `git diff`.
- Cuentas: los «11» que quedan en `requirements.md` son el texto firmado de A1 (explicado en el párrafo de A2: «con A2 son 12») y las clases `size-11`; en `tasks.md` solo aparece en el párrafo de cabecera que cuenta la enmienda. Ningún «5 en HERO» ni «5 y 6» queda vigente.
- `git diff --stat` (4 ficheros de `specs/`, ninguno fuera de `specs/mobile-home-photo-hero-canvas/` más este informe nuevo): `design.md`, `requirements.md`, `tasks.md`, `traceability.md`.
