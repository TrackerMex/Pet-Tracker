---
feature: "mobile-home-stats-strip"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-stats-strip]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**:
> `R2 → R1 → R3 → R4 → R5 → R6 → R7 → R9 → R10 → R12 → R8 → R11 → R13 → R14 → R15`.
>
> Dos cosas de ese orden no son negociables:
> - **R2 va primero** porque `fmtKg` es lo único que se puede probar sin montar
>   la pantalla: su rojo es limpio y de una línea. Escribir la celda antes
>   obligaría a un rojo que falla por dos causas a la vez.
> - **R11 (copy) va casi al final** a propósito: el delta de las filas de
>   `R3_HOME` solo se puede medir cuando ya existe la llamada a `t()`.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza; ya pasó en #19. El mensaje sigue
> `docs/conventions.md` §Commits:
> `feat(mobile-home-stats-strip): <desc> (R1)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4). El fichero de tests se crea con sus mocks y sus
> factorías completos desde el primer commit; lo que falta es la celda, no el
> andamio.
>
> **Antes de tocar nada**:
> - Carga las skills: `expo:expo-overview` → `expo:expo-native-ui` y
>   `expo:expo-design-system`, más `appllama-app-design-skill`. Obligatorio en
>   trabajo móvil (carta §Skills). La carta gana sobre la skill en todo
>   conflicto. SDK del proyecto: **Expo 57** (`~57.0.14`); documentación fijada
>   a esa versión, nunca `latest`.
> - Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe: está
>   gitignorado y rompe el typecheck con rutas fantasma.
> - Comprueba que no hay otro `init.sh` corriendo en un worktree hermano
>   (`pgrep -f init.sh`): comparten el Postgres de docker y se pisan.
> - Trabaja en `feature/69-mobile-home-stats-strip`. Nunca en `main`.
> - **No migres nada.** La Home ya vive en `src/screens/home/` con route delgado
>   desde #68 R15. Si te ves moviendo ficheros, has entendido mal la tarea.

---

## Fixture común del fichero de tests de la pantalla

`src/screens/home/index.test.tsx` **ya existe** (1203 líneas) con `makePet`
(`:59-87`, con `currentWeightKg: 12`) y `makeDay` (`:89-...`,
con `activeMinutes: 95`, `restMinutes: 45`, `distanceM: 2350`, `walkCount: 2`).
**No se reescriben**: el `describe` de #69 usa los overrides que necesita.

La fixture de R3 —la que hace que un intercambio de celdas se vea— es ésta, y
se escribe **una vez** en el `beforeEach` del `describe` de #69:

```ts
mockGetPet.mockResolvedValue({
  kind: 'ok',
  pet: makePet({ currentWeightKg: 12.4 }),   // → '12.4 kg'
});
mockGetDailyActivity.mockResolvedValue({
  kind: 'ok',
  days: [makeDay({ activeMinutes: 95, restMinutes: 45, distanceM: 2350, walkCount: 2 })],
  weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
});
```

Los cuatro valores formateados salen **distintos y distinguibles a simple
vista**: `'12.4 kg'`, `'1h 35m'`, `'45m'`, `'2.4 km'`. Con la fixture por
defecto de `makeDay` no bastaría, y un intercambio de celdas pasaría
desapercibido — que es justo lo que R15b va a intentar plantar.

---

## R2 — `fmtKg`

- [ ] (1) **Test rojo**: `src/screens/home/format.test.ts` **nuevo** ::
      `describe('#69 R2: fmtKg')` con tres `it`: `fmtKg(null) === '—'`,
      `fmtKg(12) === '12 kg'`, `fmtKg(12.4) === '12.4 kg'`.
      Commit: `feat(mobile-home-stats-strip): test weight formatter (R2)`
- [ ] (2) **Implementación mínima**: `fmtKg` en
      `src/screens/home/format.ts`, con la misma forma que `fmtKm` (`:7-9`).
      Sin `Intl`, sin `toFixed`. No se toca ninguna de las otras tres.
      Commit: `feat(mobile-home-stats-strip): add weight formatter (R2)`
- [ ] (3) **Refactor**: ninguno esperado. Cuatro líneas.

## R1 — La tira de cuatro celdas con tres divisores

- [ ] (1) **Test rojo**: `src/screens/home/index.test.tsx` ::
      `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores')`
      con el `beforeEach` de arriba y tres `it`: los cuatro `testID` presentes
      en el orden del árbol; el recuento de `border-r border-border` en la fila
      igual a **3**; y la fila **sin** `gap-3` ni `justify-between`.
      Commit: `feat(mobile-home-stats-strip): test four-cell stats strip (R1)`
- [ ] (2) **Implementación mínima**: celda `summary-weight` insertada **delante**
      de `summary-activity` en `src/screens/home/index.tsx`, con
      `className="flex-1 items-center gap-1 border-r border-border"`, icono
      `<Weight size={20} color={muted} />`, valor en
      `text-sm font-bold text-foreground` con `style={TABULAR_NUMS}` y etiqueta
      en `text-2xs font-normal text-muted`. La fila pasa a
      `className="flex-row"`. Las tres celdas existentes **no se tocan**.
      Commit: `feat(mobile-home-stats-strip): add weight cell to today strip (R1)`
- [ ] (3) **Refactor**: comprobar que el diff de las tres celdas existentes es
      **vacío**. Si no lo es, algo se ha tocado de más.

## R3 — Cada celda pinta su dato y ningún otro

- [ ] (1) **Test rojo**: mismo `describe` →
      `it('asigna cada valor a su celda y a ninguna otra')`, con los cuatro
      `toHaveTextContent` exactos (`'12.4 kg'`, `'1h 35m'`, `'45m'`,
      `'2.4 km'`).
      Commit: `feat(mobile-home-stats-strip): test per-cell metric mapping (R3)`
- [ ] (2) **Implementación mínima**: ya cubierta por R1(2) si el reparto es
      correcto. Si el rojo no pasa a verde sin tocar código, el reparto estaba
      mal.
- [ ] (3) **Refactor**: ninguno. **No factorices las cuatro celdas en un
      `.map()` sobre un array de configuración**: convertiría cuatro
      mutaciones independientes en una sola tabla, y R15b necesita que las
      cuatro fallen por separado.

## R4 — El descanso se conserva como celda siempre visible

- [ ] (1) **Test rojo**: mismo `describe` →
      `it('conserva el descanso como celda siempre visible')`, que espera
      `summary-sleep` visible y con la etiqueta `Descanso` **sin haber tocado
      ninguna barra de la gráfica**.
      Commit: `feat(mobile-home-stats-strip): test always-visible rest cell (R4)`
- [ ] (2) **Implementación mínima**: nada que escribir si R1 respetó el reparto.
      El requisito existe para que el candado quede, no porque haya código.
- [ ] (3) **Refactor**: ninguno.

## R5 — Los paseos no se duplican

- [ ] (1) **Test rojo**: mismo `describe` →
      `it('no repite los paseos dentro de la tira')`:
      `queryByTestId('summary-walks')` a `null`; `summary-card` sin el texto de
      `t('home.walks')`; y `pet-hero-highlight-value` con el recuento del día.
      Commit: `feat(mobile-home-stats-strip): test walks stay in the hero (R5)`
- [ ] (2) **Implementación mínima**: ninguna. El candado protege una ausencia.
- [ ] (3) **Refactor**: comprobar que `src/components/pet-hero-header.tsx` no
      aparece en `git diff`.

## R6 — La tira sube sobre la tarjeta del collar

- [ ] (1) **Test rojo**: mismo `describe` →
      `it('coloca la tira sobre la tarjeta del collar')`, que lee los `testID`
      de los hijos de `home-content`, filtra a los cuatro relevantes y espera
      `['summary-card', 'collar-card', 'weekly-activity-card', 'last-position-card']`.
      Commit: `feat(mobile-home-stats-strip): test strip position above collar (R6)`
- [ ] (2) **Implementación mínima**: mover el bloque `{selectedPetId ? (<Card
      testID="summary-card"> … )}` por encima del bloque
      `{detail.data?.kind === 'ok' ? … }` dentro de `home-content`. Sin margen
      negativo, sin tocar `contentContainerStyle`.
      Commit: `feat(mobile-home-stats-strip): move today strip above collar card (R6)`
- [ ] (3) **Refactor**: verificar que el `it` de orden de #68
      (`index.test.tsx:1121-1150`) sigue verde **sin tocarlo**.

## R7 — Los estados no cambian de conducta

- [ ] (1) **Test rojo**: en `describe('R9: summary degrada con gracia')`, ampliar
      `it('shows dashes instead of zero for missing metrics')` para incluir
      `summary-weight` con `currentWeightKg: null`, y añadir un `it` con
      `mockGetPet` en `{ kind: 'unreachable' }` que espera `'—'` en
      `summary-weight` con las cuatro celdas presentes.
      Commit: `feat(mobile-home-stats-strip): test weight cell degradation (R7)`
- [ ] (2) **Implementación mínima**: pasar `null` a `fmtKg` cuando
      `detail.data?.kind !== 'ok'`.
      Commit: `feat(mobile-home-stats-strip): degrade weight cell to a dash (R7)`
- [ ] (3) **Refactor**: los otros cuatro `it` del `describe` deben seguir verdes
      **sin un solo assert debilitado**. Si alguno falla, la fila se ha
      desacoplado del estado de la actividad, que es lo que R7 prohíbe.

## R9 — Iconos de `reicon`, ningún emoji

- [ ] (1) **Test rojo**: mismo `describe` de R1 →
      `it('usa iconos de reicon y ningún emoji')`, leyendo el fuente con
      `readFileSync` (patrón de `src/__tests__/consistency-classnames.test.ts`):
      import de `Weight`, cuatro usos `size={20} color={muted}` y ausencia de
      `⚖️`, `⚡`, `🦮`, `📍`.
      Commit: `feat(mobile-home-stats-strip): test real icons in the strip (R9)`
- [ ] (2) **Implementación mínima**: ya cubierta por R1(2). Verificar que
      `Weight` entra en el import existente de `reicon-react-native`
      (`index.tsx:6-14`), en orden alfabético, y que **no** se pide
      `useThemeColors(['accent'])`.
- [ ] (3) **Refactor**: ninguno.

## R10 — Cifras tabulares en los cuatro valores

- [ ] (1) **Test rojo**: `src/__tests__/consistency-classnames.test.ts`, tabla
      `counters` (`:335-342`): fila de `screens/home/index.tsx` a **5** y total
      cerrado (`:355-357`) a `14 + 4 + 1`.
      Commit: `feat(mobile-home-stats-strip): test tabular figures delta (R10)`
- [ ] (2) **Implementación mínima**: ya cubierta por R1(2), que puso
      `style={TABULAR_NUMS}` en el valor nuevo.
- [ ] (3) **Refactor**: comprobar con `grep` que
      `consistency-classnames.test.ts:270-285` (#62 R14, esquinas continuas)
      **no** se ha movido: la Home sigue con **1** `CONTINUOUS_CORNER`.

## R12 — Cuatro anuncios, no uno

- [ ] (1) **Test rojo**: mismo `describe` de R1 →
      `it('deja que cada celda se anuncie por separado')`: la fila contenedora
      sin `accessible` ni `accessibilityLabel`, y los cuatro `Text` de valor
      alcanzables por `getByTestId`.
      Commit: `feat(mobile-home-stats-strip): test per-cell announcement (R12)`
- [ ] (2) **Implementación mínima**: ninguna. El candado protege una ausencia.
- [ ] (3) **Refactor**: verificar que ninguna celda es `Pressable`.

## R8 — Cero llamadas nuevas

- [ ] (1) **Test rojo**: mismo `describe` de R1 →
      `it('no añade ninguna llamada a la API')`, comparando el recuento de
      `mockGetPet` y `mockGetDailyActivity` con el del escenario equivalente.
      Commit: `feat(mobile-home-stats-strip): test no new API calls (R8)`
- [ ] (2) **Implementación mínima**: ninguna. Verde por construcción si R1 leyó
      de `detail` y `activity`.
- [ ] (3) **Refactor**: `git diff --stat` sin un solo fichero fuera de
      `mobile-pet-tracker/` y `specs/`.

## R11 — Copy en los dos idiomas y registrada

- [ ] (1) **Test rojo**: fila
      `{ file: 'src/screens/home/index.tsx', key: 'home.weight' }` en
      `R3_HOME` (`ui-copy-table.ts:45-82`) y `toHaveLength(21 + 15 + 1)` en
      `ui-language.test.ts:83`. Rojo porque la clave aún no existe en el
      catálogo.
      Commit: `feat(mobile-home-stats-strip): test weight copy registration (R11)`
- [ ] (2) **Implementación mínima**: `'home.weight'` en los bloques `en`
      (`catalog.ts`, junto a `home.distance`) y `es`, más la fila
      `| — | \`home.weight\` | \`Weight\` | \`Peso\` | ← añadida por #69 (R11)`
      en `specs/mobile-ui-language/design.md` §2. La pantalla resuelve con
      `t('home.weight')`, sin literal.
      Commit: `feat(mobile-home-stats-strip): register localized weight label (R11)`
- [ ] (3) **Refactor**: comprobar que `SCREEN_FILES`
      (`ui-language.test.ts:357`) **no** se mueve.

## R13 — Bloque propio de drift de estilo

- [ ] (1) **Test rojo**: `src/__tests__/design-drift.test.ts` ::
      `describe('#69 R13: la tira de estadísticas no mete drift de estilo')`,
      con la lista de cinco ficheros y el patrón
      `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i`. Rojo primero: se planta
      temporalmente un hex en `screens/home/index.tsx` para comprobar que el
      bloque lo ve, y se retira en el mismo commit del verde.
      Commit: `feat(mobile-home-stats-strip): test feature style drift (R13)`
- [ ] (2) **Implementación mínima**: quitar la violación plantada. Si aparece
      alguna real, arreglarla con token.
      Commit: `feat(mobile-home-stats-strip): keep feature sources token-only (R13)`
- [ ] (3) **Refactor**: ninguno.

## R14 — Deltas de candados contra `9358cc7`

- [ ] (1) **Test rojo**: los deltas de la tabla de [[requirements]] R14, medidos
      con `grep`, no escritos a mano.
      Commit: `feat(mobile-home-stats-strip): test harness deltas (R14)`
- [ ] (2) **Implementación mínima**: aplicarlos. Si un total se mueve por una
      causa que la tabla no prevé, **para y repórtalo** en
      `progress/impl_mobile-home-stats-strip.md`: no lo absorbas subiendo el
      número.
      Commit: `feat(mobile-home-stats-strip): preserve harness inventories (R14)`
- [ ] (3) **Refactor**: ninguno.

## R15 — Verificación y prueba de mutación

- [ ] (1) **Test rojo**: suite completa desde `mobile-pet-tracker/`:
      `bun run test` y `bun run typecheck`.
- [ ] (2) **Verde y evidencia**: las **seis** mutaciones de
      [[requirements]] R15b, plantadas **de una en una**, cada una con su
      salida roja copiada en
      `progress/impl_mobile-home-stats-strip.md` §prueba de mutación:
      1. celda 1 → `activeMinutes`;
      2. celda 2 → `restMinutes`;
      3. celda 3 → `distanceM`;
      4. celda 4 → `currentWeightKg`;
      5. `fmtKg(null)` → `'0 kg'`;
      6. `summary-card` de vuelta **detrás** de `collar-card`.
      Las cuatro primeras son un mismo discriminante en cuatro sitios: si
      alguna deja la suite verde, el candado de R3 está mal escrito —casi
      siempre por una fixture con dos valores iguales— y se arregla **antes** de
      seguir.
      Commit: `feat(mobile-home-stats-strip): verify strip behaviour locks (R15,R15b)`
- [ ] (3) **Refactor**: grep-clean de la carta §Decisiones fijas 3 sobre el diff
      completo.

---

## Cierre

- [ ] `progress/impl_mobile-home-stats-strip.md` escrito, con §prueba de
      mutación y §deltas medidos (el valor que devolvió cada `grep`, no el que
      dice la spec).
- [ ] `traceability.md` sin ninguna fila en "pendiente".
- [ ] **Gate humano de smoke** en dev build de Android, guion completo en
      [[requirements]] §Aprobación. **No delegable a IA.** Sin él la feature no
      pasa a `done`.
