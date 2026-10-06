---
feature: mobile-health-make-parity
id: 115
status: approved
tags: [harness, spec, mobile, ui]
---

# Tareas — #115 mobile-health-make-parity

> Disciplina TDD (CHECKPOINTS C4): por tarea, un commit `test(...)` en rojo y
> después un commit `feat(...)` en verde. **Nunca** test y producción en un
> solo commit. Rutas relativas a `mobile-pet-tracker/`, comandos desde esa
> carpeta. Los títulos de `describe` e `it` son los literales de
> `requirements.md`. Cada rojo solo asevera nodos que ya existen o que crea su
> propia tarea: el orden T1..T4 está pensado para eso (R2 y R3 van juntas
> porque el hero que crea R2 ya es el de R3; R1 y R7 van con R6 porque sus
> filas cuentan las llamadas que crea R6). No lo cambies.

## T0 — Antes de tocar nada

- [ ] `git fetch origin` y comprobar que la branch contiene `origin/main`
      (`git merge-base --is-ancestor origin/main HEAD`). Anotar en el impl el
      hash del HEAD del handoff: la lista cerrada (`design.md` §1.2) se mide
      con `git diff --name-only <HEAD del handoff>` y los pathspecs de R8.
- [ ] `test ! -e .expo/types/router.d.ts`. Si existe, **no** lo borres (tu
      sandbox lo deniega): avísalo en el impl y sigue; lo borra el leader.
- [ ] Solo `bun` y `bunx`; nunca `npm` ni `npx`. Ninguna dependencia nueva.
- [ ] Exit code medido **sin pipe**:
      `bunx jest --runTestsByPath <rutas> > /tmp/j.txt 2>&1; echo "exit=$?"`.
- [ ] Esperas: `docs/conventions.md` §Esperas sobre el árbol renderizado.
      Nunca esperar al contador de un mock; esperar con `waitFor` /
      `findBy*` a que el árbol muestre el dato y aseverar después. Toda
      ausencia va después de una presencia del mismo escenario.
- [ ] Medir y anotar la base (tests y exit) de:
      `bunx jest --runTestsByPath src/screens/health/index.test.tsx src/components/__tests__/weight-chart.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx`
- [ ] Medir por contenido y anotar las anclas de `requirements.md`
      §Medidas en la base. Si alguna no coincide (otra feature mergeó antes):
      aplica los deltas sobre lo que encuentres y anótalo; no recalcules
      absolutos.

## T1 — R4: historial de peso con la clave de weight-log

1. **Rojo** — `test(mobile-health): #115 R4 red, weights without limit`
   - En los `it` `keeps API order and selects the first pet by default` y
     `selects a pressed pet and reloads its health records`, quitar
     `expect.any(Function),` y `1,` de los `toHaveBeenCalledWith` de
     `mockListWeights`.
   - Retitular `it('deja mascotas, vacunas y un solo peso en sus claves canónicas'`
     → `it('deja mascotas, vacunas y el historial de peso en sus claves canónicas'`;
     su clave pasa a `healthKeys.weights('pet-1', undefined)` y se añade
     `expect(queryClient.getQueryData(healthKeys.weights('pet-1', 1))).toBeUndefined();`.
   - Esperado: 3 rojos **por aserción** (los dos `toHaveBeenCalledWith` y
     `#87 R13`).
2. **Verde** — `feat(mobile-health): #115 R4 share the weight-log query`
   - `H`: `healthKeys.weights(selectedPetId ?? '', undefined)` y
     `listWeights(baseUrl, token ?? '', selectedPetId!)` (design §1.1).
3. **Refactor**: ninguno previsto.

## T2 — R2 y R3: hero a sangre con el patrón A9

1. **Rojo** — `test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers`
   - Añadir `describe('#115 R2: Salud abre con el hero a sangre (A9)')` con
     sus 4 `it` (el último es `it.each` de 5 filas) y
     `describe('#115 R3: el hero muestra la mascota seleccionada de la lista')`
     con sus 3 `it`.
   - Adaptar `shows the hub and a loading state while pets are pending`
     (`toEqual({ gap: 16, paddingBottom: 120 })`) y
     `R5 (mobile-design-drift): aplica el safe area superior al contenido`
     (`paddingTop: 52` en `health-states`).
   - Helper `elementChild` si hace falta (requirements, convenciones).
   - Esperado: rojo **por consulta** en los 3 primeros `it` de R2 (no hay
     `pet-hero-name` / `health-content`), en las 5 filas del `it.each` y en el
     `it` adaptado de safe area (no hay `health-states`), y en los 3 de R3;
     rojo **por aserción** en el `it` adaptado del hub
     (`contentContainerStyle` trae `padding` y `paddingTop`).
2. **Verde** — `feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout`
   - `H`: árbol de design §1.3: `health-states` con título y ramas,
     `PetHeroHeader pet={selectedPet} variant="bleed"` con el `PetSwitcher`
     en el slot, `health-content` con vacunas y peso, y
     `contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 96 }}`.
   - Anclas: `padding: 24` 0, `paddingHorizontal: 24` 2,
     `insets.top + 12` 1, `<PetHeroHeader` 1, `variant="bleed"` 1,
     `t('health.health')` 1.
3. **Refactor**: ninguno previsto.

## T3 — R5: WeightChart en la weight card

1. **Rojo** — `test(mobile-health): #115 R5 red, weight chart in the card`
   - Añadir el espía de `WeightChart` sobre el componente real
     (`jest.requireActual('../../components/weight-chart')`) y
     `describe('#115 R5: la weight card dibuja la evolución con WeightChart')`
     con sus 5 `it` (uno es `it.each` de 2 filas).
   - Esperado: rojo **por consulta** en `con dos o más registros…` (no hay
     `weight-chart`) y en `con un registro…` (no hay `weight-chart-empty`).
     **Nacen verdes** (guardas, declararlo en el impl): `sin registros…`,
     las 2 filas de `con error de peso…` y `mientras el peso carga…`: en la
     base no hay gráfica en esas ramas. Su sonda es M5 (T5).
2. **Verde** — `feat(mobile-health): #115 R5 render WeightChart history`
   - `H`: `<WeightChart entries={weight.data.weights} />` entre la fila de
     variación y `weight-log-link` (design §1.3), bajo
     `weight.data?.kind === 'ok' && weight.data.weights.length > 0`.
3. **Refactor**: si las dos condiciones `ok && length > 0` (variación y
   gráfica) se agrupan en un fragmento, los hijos host de `weight-card` no
   cambian; vale cualquiera de las dos formas.

## T4 — R6, R1 y R7: fecha y días de la próxima vacuna

1. **Rojo** — `test(mobile-health): #115 R6 red, next vaccine date and countdown`
   - `renderHealth` acepta un idioma opcional (`'es'` por defecto) para
     `LanguageProvider initial`.
   - Añadir `describe('#115 R6: la próxima vacuna dice fecha y días restantes')`
     con el `it.each` de las 7 filas (a..g), `ordena la card…` y
     `pinta los días con la receta exacta`; `afterEach(() => jest.useRealTimers())`
     dentro del `describe`.
   - Adaptar `highlights the nearest future dose and keeps row order`:
     `nextCard.getByText('1 may 2099')` y
     `expect(nextCard.queryByText('2099-05-01')).toBeNull()`.
   - R1: en `src/__tests__/ui-copy-table.ts`, las 3 filas
     `home.nextVaccineDays`, `home.nextVaccineDaysLeft` y
     `home.nextVaccineToday` de Salud justo después de
     `{ file: 'src/screens/health/index.tsx', key: 'health.weightLog' },`;
     en `src/__tests__/ui-language.test.ts`, la longitud de R7.
   - R7: en `src/__tests__/consistency-classnames.test.ts`, la fila de Salud
     de `counters` (`#62 R15`, **no** la de `directUses` de `#62 R14`) a
     `2 + 1], // #115 R6` y la suma de `#69 R10` con `+ 1` y el comentario
     de R7.
   - Esperado: rojo **por consulta** en las 7 filas, en `pinta los días…`
     (no hay `next-vaccine-days`) y en el `it` adaptado (`1 may 2099` no
     está); rojo **por aserción** en `ordena la card…` (2 hijos, no 3), en
     `#65 R5 › resuelve las 32 ocurrencias normativas` (`checkUses` 0 ≠ 1),
     en `#65 R18 › resuelve cada ocurrencia de la tabla contra la clave exacta`
     (`checkUses(ALL_USES)` 0 ≠ 1, mismo motivo),
     y en `#62 R15 › screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores`
     (2 ≠ 3). `#69 R10` nace **verde**: suma la tabla `counters` contra una
     constante, no mide el fuente, y la fila de Salud y la suma suben juntas
     en este commit (corregido por el leader antes del handoff; mismo caso
     que la CORRECCION 1 de #116).
2. **Verde** — `feat(mobile-health): #115 R6 show next dose date and days left`
   - `H`: imports de design §1.1, `next-vaccine-date` con `fmtDate`,
     `next-vaccine-days` como tercer hijo de la card (design §1.3), una sola
     llamada `t(` por clave.
3. **Refactor**: ninguno previsto.

## T5 — R7: anclas negativas y sondas (sin test nuevo)

- [ ] Anclas negativas de requirements R7, con el valor medido al lado del
      declarado.
- [ ] Sondas M1..M22 de design §2, una a una sobre el verde: aplicar,
      correr `src/screens/health/index.test.tsx` (y la suite global que
      nombre la fila), anotar el `it` que cae y si cae por aserción o por
      consulta, y restaurar con `git checkout HEAD -- <ruta>` seguido de
      `git diff --cached --quiet; echo "exit=$?"` = 0 y `git status --short`
      sin cambios.

## T6 — R8: alcance cerrado (sin test nuevo)

- [ ] Los cinco puntos de requirements R8, medidos sin pipe.
- [ ] `bun run typecheck`, `bun run lint`, `bunx jest` con exit 0.

## T7 — R9: gate humano

- [ ] Nada que implementar. El humano corre el smoke en el dev build de
      Android y marca S1..S9 en requirements R9 tras el veredicto del
      reviewer.

## Cierre de Codex

- [ ] `docs(mobile-health-make-parity): trace #115 R1-R8` → rellenar
      `traceability.md` con test y hash + mensaje por fila (R9 queda «gate
      humano»; R7 y R8 citan el comando de verificación).
- [ ] `progress/impl_mobile-health-make-parity.md`: HEAD del handoff,
      recuentos antes/después por suite, rojos esperados frente a rojos
      vistos por tarea, tabla de sondas (sonda → `it` caído → aserción o
      consulta), anclas medidas, typecheck/lint/jest con exit, y avisos
      (`router.d.ts`, delta aplicado sobre una expresión distinta).

## T8 — Ronda 2: Enmienda E1–E2

Arranca solo con la casilla «Enmienda E1–E2» de requirements §Aprobación
marcada. Se ejecuta en el VPS (Linux), no en Windows. Antes de tocar nada,
`test ! -e .expo/types/router.d.ts; echo "exit=$?"` = 0 y Jest de
`src/screens/health/index.test.tsx` y `app.assets.test.ts` en verde con
55 y 7 `it`. Regla de la ronda 1 que sigue en vigor: ningún `git commit` si
el registrador o Jest devolvió exit distinto de 0; encadenar
`<registrador> && git commit ...`.

E1 solo toca tests y nace verde: producción ya hace lo correcto, y la
mordida de cada candado se demuestra con su sonda (rojo por mutación), como
en #147 E1–E4.

1. **E1.1 (R2)**: la línea de requirements R2 en el `it` de los hijos del
   scroll. Salud 55 verdes. Sonda M25: cae ese `it` por aserción; restaurar.
   Commit `test(mobile-health): #115 E1.1 lock hero and content under the scroll`.
2. **E1.2 (R6)**: columna `TZ`, `<ahora>` con hora y minuto, y la fila h, con
   el patrón `hostProcess` de requirements R6 (`process.env.TZ` a secas no
   cambia `Date` dentro de Jest). Salud 56 verdes. Sondas M23 (cae solo la
   fila h) y M24 (caen a–h); restaurar.
   Commit `test(mobile-health): #115 E1.2 time zone row for next vaccine days`.
3. **R10 rojo**: import de `inflateSync`, helpers `readAlpha` y
   `countAlpha` y el `describe` de R10 (design §1.8). Rojo esperado en
   `app.assets.test.ts`: exactamente «esquinas» (`[676, 676, 676, 676]`) y
   «pin» (1600), los dos por aserción; «fuera», «cara» y los 7 `it` de #101
   en verde. Commit `test(mobile-assets): #115 R10 red, splash without square or pin`.
4. **Candidato**: receta de requirements R10, pasos 1–3, en
   `/tmp/115-splash/`. Con el candidato copiado en
   `assets/images/splash-icon.png` (sin commitear), `app.assets.test.ts`
   11 de 11 en verde. Anotar en el impl el `sha256sum` del candidato y las
   rutas de las tres previews.
5. **PARADA**: no se commitea nada más hasta que la casilla «PNG del splash»
   de requirements §Aprobación lleve un `sha256` igual al del candidato que
   está en el árbol (`sha256sum assets/images/splash-icon.png`). Si el humano
   lo rechaza, el motivo y el `sha256sum` del rechazado van al impl, y se
   vuelve al paso 4.
6. **R10 verde**: borrar de `scripts/make-icons.mjs` la línea del
   `copyFileSync` a `splash-icon.png` e `import fs from 'node:fs';`. No
   ejecutar el script ni `expo prebuild`. Correr `app.assets.test.ts`,
   `app.config.test.ts` y `src/screens/welcome/index.test.tsx` en verde.
   Commit, solo con esos dos ficheros:
   `feat(mobile-assets): #115 R10 transparent splash with the mascot alone`.
7. **Sondas M26–M28** de design §2 sobre el verde; anotar el `it` que cae y
   si cae por aserción o por consulta, y restaurar con
   `git checkout HEAD -- assets/images/splash-icon.png`, `git diff --quiet
   -- assets/images/splash-icon.png` y `git diff --cached --quiet`, los dos
   con exit 0.
8. **Anclas**: las tres de la tabla de R10, con el valor medido al lado del
   declarado.
9. **Cierre de la ronda 2**, medido sin pipe:
   - R8: la lista cerrada da exactamente los 10 ficheros de design §1.2.
   - `bun run typecheck`, `bun run lint` y `bunx jest` con exit 0.
   - Recuentos esperados: Salud 56, `app.assets` 11, las otras seis suites
     de control sin cambio, y el total de Jest +5 sobre los 2139 de la
     ronda 1 si `origin/main` sigue en `e002a4a5`.
10. `docs(mobile-health-make-parity): trace #115 E1-E2 and R10`:
    - `traceability.md`: R2 y R6 añaden su commit de E1; fila R10 con rojo y
      verde; §Verificación R8 con la lista de 10; R9 pasa a S1..S11.
    - Impl: sección «Ronda 2» con el HEAD del handoff, rojos esperados y
      vistos, candidatos con su `sha256`, tabla de sondas M23–M28, anclas y
      exits.

## T9 — Ronda 3: Enmienda E3

Arranca solo con la casilla «Enmienda E3» de requirements §Aprobación
marcada. Se ejecuta en el VPS. Antes de tocar nada,
`test ! -e .expo/types/router.d.ts; echo "exit=$?"` = 0 y Jest de
`src/screens/health/index.test.tsx` en verde con 56 `it`. Sigue en vigor:
ningún `git commit` si el registrador o Jest devolvió exit distinto de 0;
encadenar `<registrador> && git commit ...`.

E3 solo toca `src/screens/health/index.test.tsx` y nace verde: la
producción ya cumple R2 y R6. La mordida de cada candado se demuestra con su
sonda de design §2, que se corre con `--runInBand`.

1. **E3.1 (R6)**: filas i, j, k, l y m de la tabla de fechas de
   requirements R6, con el patrón `hostProcess` que ya usa la fila h. Salud
   61 verdes. Sondas M23, M29–M34 y M40: cada una tumba exactamente las
   filas que dice design §2, por aserción; restaurar tras cada una. M24 se
   corre en el paso 4, cuando ya existen todas sus filas.
   Commit `test(mobile-health): #115 E3.1 next vaccine days at more hours and zones`.
2. **E3.2 (R6)**: los `it` `ordena la card…` y `pinta los días con la
   receta exacta` pasan a `it.each` con las dos filas de requirements R6
   (`días` y `hoy`), con la espera del texto antes de las aserciones, y
   `ordena…` asevera además el `className` de la columna y los textos de sus
   hijos `[0]` y `[1]`. Salud 63 verdes. Sondas M35–M38, M41 y M42: caen
   las filas que dice design §2 y las demás siguen verdes; restaurar.
   Commit `test(mobile-health): #115 E3.2 lock next vaccine card on the today branch`.
3. **E3.3 (R2)**: la aserción del `className` del título en el `it.each`
   `sin contenido ($name)`. Salud 63 verdes. Sonda M39: caen las 5 filas;
   restaurar.
   Commit `test(mobile-health): #115 E3.3 lock the health states title recipe`.
4. **E3.4 (R6)**: fila n de la tabla de fechas, con el literal
   `Faltan 1 días` tal cual. Salud 64 verdes. Sondas M43, M44 y M24: caen
   las filas que dice design §2; restaurar.
   Commit `test(mobile-health): #115 E3.4 next vaccine days at the one day boundary`.
5. **Cierre de la ronda 3**, medido sin pipe:
   - R8: la lista cerrada sigue en los 10 ficheros de design §1.2.
   - `bun run typecheck`, `bun run lint` y `bunx jest` con exit 0.
   - Recuentos: Salud 64, `app.assets` 11, y Jest 94 suites y 2170 tests
     si `origin/main` sigue en `37f6362c`.
   - `git diff --quiet <HEAD del handoff> -- src/screens/health/index.tsx`
     con exit 0: la producción no cambió.
6. `docs(mobile-health-make-parity): trace #115 E3`:
   - `traceability.md`: R2 y R6 añaden sus commits de E3.
   - Impl: sección «Ronda 3» con el HEAD del handoff, la tabla de sondas
     M23, M24 y M29–M44 (filas que caen y cómo), y los exits.
