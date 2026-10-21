---
feature: "mobile-home-pingo-phrase"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-pingo-phrase]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Premisas contrastadas

Leídas en el árbol de la worktree `Pet-Tracker-wt-190`, creada desde origin/main 14ec7307 (2026-10-19, con #176, #177, #181, #186 y #187 ya mergeadas; `git fetch` no trajo nada nuevo). Se anclan por contenido, no por número de línea ni por recuento.

- Pantalla: `src/screens/home/index.tsx` exporta `HomeScreen`. Dentro de `ScrollView testID="screen-home"` van `PetHeroHeader variant="bleed"` (solo con mascotas) y `View testID="home-content" style={{ paddingHorizontal: 24, gap: 16 }}`. Hijos de `home-content`, en este orden: la tarjeta de error del detalle `pet-hero-error` (condicional) y seis `HomeEntrance` con índices fijos 0 a 5: `home-entrance-summary`, `-collar`, `-quick-actions`, `-weekly`, `-reminders`, `-last-position`.
- Datos ya presentes en la pantalla, sin query nueva: `detail` (`getPet`, `detail.data?.kind === 'ok'` con `detail.data.pet`), `activity` (`getDailyActivity`; `today` = último elemento de `days` si `kind === 'ok'`), `mealsToday` (`detail.data.pet.mealsToday`, `MealsToday | null`) y `reduceMotion = useReducedMotion()`. `MealsToday` es solo `{ served: number; total: number }` en `src/api/types.ts`: **sin hora**. `DayEntry.distanceM` es `number | null`.
- `HomeEntrance({ index, testID, className, children })` en `src/screens/home/home-entrance.tsx`: `entering={homeEntering(index * MOTION_STAGGER_MS, reducedMotion ? 0 : MOTION_ENTRANCE_OFFSET_Y)}`; con reduce motion conserva el fundido y el escalonado y no desplaza. Lo cubre `home-entrance.test.tsx` («#152 R4»).
- `PingoFloat({ testID, children })` en `src/components/pingo-float.tsx`: `Animated.View` con `translateY` de 0 a `-MOTION_PINGO_FLOAT_OFFSET_Y` (10) vía `withRepeat(withTiming(..., MOTION_PINGO_FLOAT_TIMING), -1, true)`, cancelado al desmontar, sin arrancar con reduce motion. La carta restringe su uso a pantallas nombradas por enmienda (#172, #176): Inicio con mascota no está.
- Patrón de burbuja con Pingo en la app: `login-greeting` (fila `flex-row items-center gap-3`, `Image` de `expo-image` 88×88 y `Card variant="secondary"` con `Text className="text-15 font-semibold text-foreground"`). La burbuja de Inicio no copia ese `Card`: el artboard pide fondo de superficie, sombra y una esquina de 4 px que `Card` (con `twMerge`) no admite sin pelear con `rounded-card`.
- Pose: `assets/images/pingo-talk.webp` existe, 1024×1024 (cabecera VP8X leída con node). `EmptyState` la importa como `require('../../assets/images/pingo-talk.webp')` desde `src/components`; desde `src/screens/home/index.tsx` la ruta es `../../../assets/images/pingo-talk.webp` (la misma profundidad que usa `src/screens/login/index.tsx` con `pingo-wave.webp`).
- Tokens que ya existen en `src/theme/global.css`: `--radius-tile: 18px`, `--text-15: 15px`, `--radius-10/14/16/22/24`, `--color` de `surface`, `foreground`. **No existe** `--radius-4` ni ninguna interlínea ligada a `text-15`. La utilidad `leading-5.5` ya se usa en `src/` (fraccionarios de escala de espaciado, como `bottom-4.5` o `h-3.5`), así que `leading-5.25` (= 21 px) sigue la misma mecánica.
- Anclas que **difieren** de la descripción de #190 y del informe `progress/explore_canvas-parity-2026-10-16.md` (se siguen las del árbol): la tabla de copy es `src/__tests__/ui-copy-table.ts` (no existe `src/i18n/ui-copy-table.ts`); las poses están en `mobile-pet-tracker/assets/images/pingo-*.webp` (no en `src/assets`); el test del catálogo es `src/providers/__tests__/language-provider.test.tsx`.
- Locks que la burbuja mueve, verificados por contenido: (1) `language-provider.test.tsx`, fórmula de longitud del catálogo (última línea `+ 4, // #186 R1`); (2) `ui-language.test.ts`, `expect(R3_HOME).toHaveLength(... + 2 // #155 R4)` y `expect(SCREEN_FILES).toHaveLength(... + 1 // #186 R2: utils/form-rules.ts)`; `SCREEN_FILES` sale de `ALL_USES` y cada fichero con fila de copy entra al escaneo de literales enteros de valores fijos del catálogo (las cuatro frases llevan marcadores `{{`, quedan fuera de ese escaneo); (3) `checkUses` exige que el fichero de cada fila contenga `t('<clave>'` o `labelKey: '<clave>'`; (4) `alerts-canvas-fidelity.test.ts`, inventario de `text-15` (lista de ficheros en orden alfabético; `screens/home/index.tsx` entra entre `screens/forgot/index.tsx` y `screens/login/index.tsx`); (5) `index.test.tsx`, «#152 R5» afirma por igualdad exacta los hijos de `home-content` y «escalona las entradas cada 60 ms en el orden de los bloques» afirma los retrasos 0 a 300. Las demás listas `relevantChildren` de ese fichero filtran por una lista cerrada de ids y no se mueven.
- Fixture de los tests de Inicio: mascota `Luna`, `mealsToday: null`, `makeDay()` con `distanceM: 2350`. `fmtKm(2350)` es `'2.4 km'` (`(2.35).toFixed(1)` da `2.4`, medido con node), así que la frase por defecto de los tests es `Luna ya caminó 2.4 km hoy.`
- `src/theme/motion.ts` está cerrado por `motion.test.ts` (sin exports nuevos): esta feature no toca ese fichero.

## Supuestos no verificados

El implementer los confirma antes del test rojo que los usa:

- Que uniwind resuelva `rounded-br-4` contra `--radius-4` y `leading-5.25` como 21 px. Es la misma mecánica que `rounded-10`/`rounded-16` y `leading-5.5`, pero un test de jest no ve el estilo resuelto. Si no resolviera, se para y se informa en `progress/impl_mobile-home-pingo-phrase.md`; no se sustituye por clases arbitrarias ni por `StyleSheet.create`. R15 (smoke humano) es la comprobación real.
- Que el mock de `expo-image` de los tests exponga `source` como `[{ testUri: ... }]` (lo hacen `login/index.test.tsx` y el «pinta la pose» de Inicio vacío en `home/index.test.tsx`).
- `docs/architecture.md`: el cambio es solo de presentación (sin dominio ni aplicación nuevos); la función `homePingoPhrase` es pura y vive junto a la pantalla.

## Contraste con el artboard

Valores leídos en `project/Inicio.dc.html` (sección del hero, tarjeta con foto) y su traducción:

| Artboard | Valor | Spec |
|---|---|---|
| Fila de burbuja y pose | `display:flex; align-items:flex-end; gap:10px; margin-top:14px` | R3 (`flex-row items-end gap-2.5`); el `margin-top` lo da el `gap: 16` de `home-content` |
| Burbuja | `flex:1; background: surface; border-radius: 18px 18px 4px 18px; padding: 12px 14px; box-shadow: var(--shadow)` | R11 (`flex-1 rounded-tile rounded-br-4 bg-surface px-3.5 py-3 shadow-sm`) |
| Texto | `font-size 15px; line-height 21px; font-weight 600` | R11 (`text-15 font-semibold leading-5.25 text-foreground`) |
| Pose | `width: 64px; height: auto` (imagen cuadrada) | R4 (64×64) |
| Flotación | `float 3s ease-in-out infinite`, 0 a -10 px | R5: `PingoFloat` (1500 ms por tramo, 10 px) = 3 s el ciclo completo |
| Entrada burbuja | `pop 400ms ease-out 450ms both` (escala .6 a 1.08 a 1) | R6/R7: entrada de `HomeEntrance` (Q2) |
| Frase | «Rocky ya caminó 2.3 km hoy. Le falta la comida de las 18:00.» | R8/R9 (H1): «Luna ya caminó 2.3 km hoy y lleva 1 de 2 comidas.» con voz B |
| Contenedor | dentro de la tarjeta hero con foto | D2 / Q1: bloque propio bajo el hero bleed (Enmienda #67) |

Divergencias que la spec mantiene y que el humano confirma en el gate: Q1 (ubicación), Q2 (pop), y que el artboard dice «Le falta la comida de las 18:00» (H1).

## Dependencias y precondiciones

- #176, #177, #181, #186, #187: mergeadas; sin precondición. #176 R13 dejó la entrada del estado vacío con reduce motion resuelta; esta feature no toca esa rama.
- **#193** (guarda de refetch sin mascota) toca el `useFocusEffect` de `home/index.tsx`, otra zona del fichero; el solape es de merge, no de comportamiento. Quien mergee segundo rebasa sin reescribir.
- **N6** (`mobile-home-summary-tiles-canvas`, aún sin registrar, solo si el humano confirma que el canvas gana a #67): comparte pantalla. El orden «burbuja antes del resumen» se fija aquí (R1, R6); N6 lo hereda.
- #129 (carrera de la query de la mascota seleccionada): solo aplicaría a H1 (b). Con el defecto (a) no hay query nueva y no depende.
- **P1 — Enmienda #190** aprobada por el humano en `docs/ui-guidelines.md`: precondición de la fase (2) de R5 (la Enmienda va por ser `PingoFloat` un componente restringido a pantallas nombradas). Sin ella R5 no se implementa y la pose queda estática, R14. El resto de requisitos no depende de la enmienda.
- **P2 — H1, H2, H3** firmadas o sustituidas en §Aprobación: precondición de toda la implementación.

## Decisiones técnicas

- **D1 — La frase es una función pura aparte.** `src/screens/home/pingo-phrase.ts` exporta `homePingoPhrase` (R8). Se prueba en su propio fichero sin montar el árbol pesado de `index.test.tsx` (mocks de reanimated, queries y router), y las claves de copy viven ahí como `labelKey: 'home.pingoPhrase...'` (el patrón que ya cuenta `checkUses`). Alternativa descartada: la lógica dentro de `index.tsx`, que obligaría a probar cuatro ramas montando la pantalla entera y dejaría las claves en un fichero ya muy grande. Sirve a R8, R9, R13.
- **D2 — La burbuja es un bloque propio bajo el hero, no el interior del hero.** El hero real es `PetHeroHeader variant="bleed"` con slot y pie fijados por la Enmienda #67, y su contrato lo prueban `pet-hero-header.test.tsx` y varios tests de Inicio; meter la burbuja en su `children` cambiaría un componente compartido con Perfil. Un `HomeEntrance index={0}` al frente de `home-content` respeta la descripción de #190 («bajo el hero») y reutiliza el escalonado. Sirve a R1, R3, R6.
- **D3 — Los demás índices se desplazan en uno.** El escalonado sigue siendo uno por bloque en el orden visual (0 a 360 ms). Alternativa descartada: dar a la burbuja el índice 0 y dejar el resumen también en 0 (entrarían a la vez y el escalonado de 60 ms perdería su sentido). Coste: se enmiendan dos tests de `index.test.tsx` (tasks.md). Sirve a R6.
- **D4 — Estilo solo con tokens.** `View` plano (no `Card`): `Card` usa `twMerge`, que expulsa clases de escala propias de la carta (`text-NN`, ver memoria de #187) y trata `rounded-card` como grupo del radio completo; un `View` con la receta de R11 no pasa por `twMerge`. La esquina de 4 px es un token nuevo `--radius-4` (un solo uso, pero una clase arbitraria `rounded-br-[4px]` está prohibida y un `style` con radio suelto saldría del sistema). La interlínea de 21 px usa `leading-5.25`, porque `text-15` no lleva interlínea y el artboard la fija. Sirve a R11, R12.
- **D5 — Sin animación propia.** La entrada es la de `HomeEntrance` (R6, R7) y la flotación la de `PingoFloat` (R5); no se escribe `useSharedValue` ni se añaden constantes a `motion.ts`. Alternativa descartada: reproducir el «pop» con `MOTION_POP_SPRING` (existe en `motion.ts`) sobre la burbuja: añade una segunda animación de entrada al mismo bloque y un caso más con reduce motion. Queda como Q2. Sirve a R5, R7.
- **D6 — Visibilidad por datos, no por estado aislado.** R1 exige `detail ok` y `activity.data !== undefined`; las ramas de actividad `unauthorized`, `no-tracking` y `error` pintan igualmente la burbuja con la frase de las comidas o la de respaldo (`today` es `undefined`, `distanceM` cae a `null`). La frase se calcula una vez y no se vuelve a calcular salvo cambio de datos o de idioma. Sirve a R2, R8, R10.
- **D7 — La pose es decorativa.** Sin `accessibilityLabel` (como `login-pingo`): el lector de pantalla lee la frase de la burbuja, no una imagen. Sirve a R4.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/`. Capa de presentación (la app móvil no tiene dominio ni infraestructura propios aquí; `docs/architecture.md` se refiere al backend).

- `src/screens/home/pingo-phrase.ts` — **nuevo**: `homePingoPhrase` y sus tipos (R8).
- `src/screens/home/pingo-phrase.test.ts` — **nuevo**: ramas de R8 y literales de R9 en ambos idiomas.
- `src/screens/home/index.tsx` — bloque `home-entrance-pingo` al frente de `home-content` (R1, R2, R3, R4, R5, R10, R11), índices +1 (R6); imports de `Image` de `expo-image`, `PingoFloat` y `homePingoPhrase`.
- `src/i18n/catalog.ts` — cuatro claves en `en` y en `es` (R9).
- `src/theme/global.css` — `--radius-4: 4px;` junto a los demás `--radius-*` (R11).
- `src/screens/home/index.test.tsx` — tests nuevos de R1 a R7, R10, R11 y las dos enmiendas de [[tasks]].
- `src/__tests__/home-pingo-phrase.test.ts` — **nuevo**: candados de fichero de R11, R12, R14 (token, grep-clean, clase exacta por contenido, texto de la Enmienda en `docs/ui-guidelines.md` cuando esté aprobada).
- `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`, `src/providers/__tests__/language-provider.test.tsx`, `src/__tests__/alerts-canvas-fidelity.test.ts` — candados de R13.
- `../docs/ui-guidelines.md` — Enmienda #190 (solo tras la casilla firmada, R14).
- `../specs/mobile-home-pingo-phrase/traceability.md` — la actualiza el implementer.

## Texto de la Enmienda #190

Se copia tal cual a `docs/ui-guidelines.md` (sección nueva tras la Enmienda #186) **solo cuando el humano firme su casilla**. La redacción de la carta no la escribe esta spec en el documento:

> ## Enmienda #190 — Burbuja de Pingo en Inicio
>
> > Enmienda de `ui-guidelines` por `mobile-home-pingo-phrase` (#190). Directiva del humano: «el diseño final como el artifact».
>
> **Pingo flota en la burbuja de Inicio.** Con mascota seleccionada, la pose de la burbuja de Pingo de Inicio (`home-pingo`) usa `PingoFloat` (`src/components/pingo-float.tsx`) con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca. Esta enmienda no autoriza `PingoFloat` en ninguna otra pantalla.
>
> **Escala de radios.** Se añade `--radius-4: 4px` (`rounded-br-4`), la esquina de la «cola» de la burbuja. Un solo uso hoy.
>
> **La burbuja de Pingo.** `View` de superficie con radio 18 px (`rounded-tile`) y 4 px en la esquina inferior derecha, texto `text-15 font-semibold leading-5.25`. La frase sale de claves `home.pingoPhrase*`, en voz B.
>
> - [ ] Enmienda #190 aprobada por humano

## Alternativas descartadas

- Burbuja dentro del `children` de `PetHeroHeader`: ver D2.
- Opción (b) de H1, consultar el plan de nutrición: añade una query y una carrera (#129) para poder decir una hora; el modelo del plan no se usa hoy en Inicio. Queda fuera de alcance y reabrible.
- Opción (c) de H1, pool fijo por estado: no usa los datos reales y queda más lejos del artboard que (a).
- Reutilizar `Card variant="secondary"` como en login: fondo equivocado (`surface-secondary` frente a `surface` del artboard) y `twMerge` con las clases de radio. Ver D4.
- `MOTION_POP_SPRING` para el «pop»: ver D5 y Q2.
- Clase `rounded-br-[4px]` o `borderBottomRightRadius: 4` en `style`: prohibidas por la carta o fuera de tokens.

## Preguntas abiertas

- **Q1** — Ubicación. El artboard pinta burbuja y pose dentro de la tarjeta hero; el hero de Inicio es el bleed fotográfico de la Enmienda #67. Esta spec elige bloque propio bajo el hero (D2). Si el humano prefiere la burbuja dentro del hero, es una enmienda al contrato de `PetHeroHeader` y toca Perfil: otra feature.
- **Q2** — Entrada. El artboard hace «pop» (escala) con retraso de 450 ms; esta spec usa la entrada de `HomeEntrance` (fundido y 12 px de subida, 0 ms). Si el humano quiere el pop, se añade un segundo requisito con `MOTION_POP_SPRING`/`MOTION_POP_SCALE` y su caso de reduce motion.
- **Q3** — Umbral de distancia. R8 usa 100 m para que `fmtKm` no diga «0.0 km». El número es una decisión de producto menor del spec_author, no del canvas; el humano puede moverlo.
