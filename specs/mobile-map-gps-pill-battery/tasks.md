---
feature: mobile-map-gps-pill-battery
id: 116
status: approved
tags: [harness, spec, mobile, ui]
---

# Tareas — #116 mobile-map-gps-pill-battery

> Disciplina TDD (CHECKPOINTS C4): por tarea, un commit `test(...)` en rojo y
> después un commit `feat(...)` en verde. **Nunca** test y producción en un
> solo commit. Rutas relativas a `mobile-pet-tracker/`, comandos desde esa
> carpeta. Los títulos de `describe` e `it` son los literales de
> `requirements.md`. Cada rojo solo asevera nodos que ya existen o que crea su
> propia tarea: el orden T1..T6 está pensado para eso, no lo cambies.

## T0 — Antes de tocar nada

- [ ] `git fetch origin` y comprobar que la branch contiene `origin/main`
      (`git merge-base --is-ancestor origin/main HEAD`). Anotar en el impl el
      hash del HEAD del handoff: la lista cerrada (`design.md` §1.2) se mide
      con `git diff --name-only <HEAD del handoff>`.
- [ ] `test ! -e .expo/types/router.d.ts`. Si existe, **no** lo borres (tu
      sandbox lo deniega): avísalo en el impl y sigue; lo borra el leader.
- [ ] Solo `bun` y `bunx`; nunca `npm` ni `npx`. Ninguna dependencia nueva.
- [ ] Rutas de jest con paréntesis siempre entre comillas simples. Exit code
      medido **sin pipe**: `bunx jest --runTestsByPath <rutas> > /tmp/j.txt 2>&1; echo "exit=$?"`.
- [ ] Esperas: `docs/conventions.md` §Esperas sobre el árbol renderizado.
      Nunca esperar al contador de un mock; esperar con `waitFor` /
      `findBy*` a que el árbol muestre el dato y aseverar después.
- [ ] Medir y anotar la base (tests y exit) de:
      `bunx jest --runTestsByPath src/screens/map/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx`
- [ ] Medir por contenido y anotar las anclas de `requirements.md`
      §Medidas en la base. Si alguna no coincide (otra feature mergeó antes):
      aplica los deltas sobre lo que encuentres y anótalo; no recalcules
      absolutos.

## T1 — R1: literal de `map.live` (+ primer retítulo de R9)

1. **Rojo** — `test(mobile-map): #116 R1 red, GPS activo replaces En vivo`
   - Añadir `describe('#116 R1: el estado activo usa la palabra del Make')`
     con su `it` (requirements R1).
   - Las 6 aserciones `toHaveTextContent('En vivo')` pasan a
     `toHaveTextContent('GPS activo')` (siguen leyendo `stat-gps`: el nodo
     existe; T3 cambia el testID).
   - Retítulo de R9: `it('muestra En vivo aunque después falte la posición')`
     → `it('muestra GPS activo aunque después falte la posición')`.
   - Esperado: rojo **por aserción** en el `it` de R1 y en los 6 migrados.
2. **Verde** — `feat(mobile-map): #116 R1 map.live reads GPS active`
   - `src/i18n/catalog.ts`: `map.live` → `'GPS active'` en `en` y
     `'GPS activo'` en `es`.
   - `specs/mobile-ui-language/design.md`: la fila 198 exacta de R1.
3. **Refactor**: ninguno previsto.

## T2 — R2 y R3: contenedor, avatar y nombre

1. **Rojo** — `test(mobile-map): #116 R2 R3 red, pet pill above stats`
   - Mock de `expo-router`: `useIsFocused: () => true` →
     `useIsFocused: () => mockIsFocused`, con `let mockIsFocused = true`
     declarado junto a los demás `mock*` y `mockIsFocused = true` en el
     `beforeEach` global (junto a `initialSelectedPetId = null`).
   - Añadir `describe('#116 R2: …')` y `describe('#116 R3: …')` con los `it`
     de requirements, **salvo** `rotula el nombre de la lista en una línea`:
     su espera lee `map-pet-pill-status`, que no nace hasta T3, así que ese
     `it` se escribe en T3. En R2 la píldora tiene hijos aún sin crear: los
     `it` de R2 **solo** aseveran posición, `className`, `style` y ausencia;
     nada de hijos (eso es R3 y R4).
   - Esperado: rojo **por consulta** (`getByTestId('map-pet-pill')`) en los
     de R2 y R3, salvo `no pinta la píldora mientras la selección no está en
     la lista`, que **nace verde**: sonda en el paso 2.
2. **Verde** — `feat(mobile-map): #116 R2 R3 pet pill with avatar and name`
   - `src/screens/map/index.tsx`: la píldora como hijo 0 de `map-stats`, con
     `PetAvatar` y el nombre (design §1.3, §1.4). Todavía sin punto ni estado.
   - Sonda de R2 (ausencia), **después** de commitear el verde: plantar M25
     de `design.md` §2, ver el `it` caer **por aserción**, revertir con
     `git checkout HEAD -- src/screens/map/index.tsx` y comprobar
     `git diff --cached --quiet` y `git diff --quiet -- src/screens/map/index.tsx`.
     Anotar en el impl.
3. **Refactor**: ninguno previsto.

## T3 — R4: punto y estado de la píldora (+ migración de testID de #94)

1. **Rojo** — `test(mobile-map): #116 R4 red, pill status with tone`
   - Añadir `describe('#116 R4: …')` con el `it.each` de 6 estados, el de los
     cuatro hijos en orden y el de accesibilidad.
   - Añadir a `describe('#116 R3: …')` el `it` que T2 dejó fuera:
     `rotula el nombre de la lista en una línea`.
   - Migrar `stat-gps` → `map-pet-pill-status` **solo** en la lista cerrada de
     R4 (suite R8 y bloques `#94 R2`, `#94 R3`, `#94 R4`, `#94 R7`). Sin
     tocar sus títulos.
   - Esperado: rojo **por consulta** (`map-pet-pill-status`, que todos esperan
     antes de aseverar) en todos, también en el de cuatro hijos, en el de
     accesibilidad y en el del nombre. Si alguno cae por aserción, la espera
     no es la que fija requirements R3/R4: corrígela, no la aserción.
2. **Verde** — `feat(mobile-map): #116 R4 pill dot and connection status`
   - `src/components/pet-hero-header.tsx`: **solo** `export` delante de
     `const STATUS_TONE_CLASSES`.
   - `src/screens/map/index.tsx`: `MAP_CONNECTION_TONE`, `connection`,
     `gpsTone`, punto y estado; `accessible` y `accessibilityLabel` en la
     píldora. El tile `stat-gps` **sigue** en la rejilla hasta T4.
3. **Refactor**: ninguno previsto.

## T4 — R5, R6 y R7: tile de batería (+ segundo retítulo de R9 y deltas de R10)

1. **Rojo** — `test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection`
   - Añadir `describe` de R5, R6 y R7 con sus `it` (requirements).
   - Migraciones de R5: `#61 R11` (filas `['stat-updated','stat-battery']` y
     «Batería»), `#62 R15` (`stat-battery` tabular; `map-pet-pill-status`
     no), y `#94 R6` invertido con el retítulo de R9:
     `describe('#94 R6 (enmienda #116): el mapa ya no rotula la conexión')`
     › `it('retira Conexión y GPS y rotula Batería')`.
   - Deltas de R10: fila del mapa en `counters` a `3 + 1, // #116 R5`; `+ 1`
     y `#116 R5` en la suma de `#69 R10`; fila de `R4_MAP` a
     `pairing.battery` con su comentario.
   - Esperado: rojo **por consulta** (`stat-battery`) en R5, R6, R7, `#61 R11`
     y `#62 R15`; **por aserción** en `#94 R6` (`Conexión` sigue visible:
     sus ausencias van antes que `getByText('Batería')`), en `counters` (3 ≠ 4), en
     `#69 R10` y en `checkUses(R4_MAP)` (`pairing.battery` 0).
2. **Verde** — `feat(mobile-map): #116 R5 R6 R7 battery tile from device detail`
   - `src/screens/map/index.tsx`: el cuarto tile pasa a `stat-battery` con
     `batteryPct`, `battery`, `batteryTone`, `style={TABULAR_NUMS}` y rótulo
     `t('pairing.battery')`. Desaparecen `stat-gps` y
     `t('pairing.connection')`.
3. **Refactor**: si `gps` ya solo alimenta la píldora, puede quedarse como
   está; no renombrar símbolos de design §1.1.

## T5 — R8: sin animación (nace verde, sonda)

1. **Test** — `test(mobile-map): #116 R8 lock map without reanimated`
   - Añadir `describe('#116 R8: el mapa no estrena animación')` con su `it`.
   - Nace verde. Sonda obligatoria: plantar M13 de `design.md` §2 (o solo
     `import Animated from 'react-native-reanimated';`), ver el `it` caer
     **por aserción**, revertir con `git checkout HEAD -- src/screens/map/index.tsx`
     y comprobar `git diff --cached --quiet` y
     `git diff --quiet -- src/screens/map/index.tsx`. Anotar en el impl.
2. **Verde**: no hay commit de producción.

## T6 — R9, R10, R11: verificación (sin test nuevo)

- [ ] R9: `grep -c "muestra Conexión y retira GPS\|muestra En vivo aunque" src/screens/map/index.test.tsx` = 0.
      La casilla de `## Enmienda #116` de #94 la marca el humano: **no** la
      toques.
- [ ] R10: anclas negativas con el valor de la base (requirements R10).
- [ ] R11: los seis puntos de requirements R11, medidos sin pipe;
      `git diff --name-only <HEAD del handoff>` ⊆ design §1.2.
- [ ] `bun run typecheck`, `bun run lint`, `bunx jest` con exit 0.
      Mientras corre la suite entera, no lances otra.

## T7 — R12: gate humano

- [ ] Nada que implementar. El humano corre el smoke en el dev build de
      Android y marca S1..S6 en requirements R12 tras el veredicto del
      reviewer.

## Cierre de Codex

- [ ] `docs(mobile-map-gps-pill-battery): trace #116 R1-R11` → rellenar
      `traceability.md` con test y hash + mensaje por fila (R12 queda
      «gate humano»; R9..R11 citan el comando de verificación).
- [ ] `progress/impl_mobile-map-gps-pill-battery.md`: HEAD del handoff,
      recuentos antes/después por suite, tabla de sondas (sonda → `it` caído →
      aserción o consulta), anclas medidas, typecheck/lint/jest con exit, y
      avisos (`router.d.ts`, delta aplicado sobre una expresión distinta).
