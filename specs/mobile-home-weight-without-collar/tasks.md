---
feature: "mobile-home-weight-without-collar"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-home-weight-without-collar]] (#77)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, **nunca implementación y test juntos**.
> La única producción que viaja en un rojo es la mutación V3 del rojo de R3
> (CHECKPOINTS C4, vía (b)), que el verde siguiente revierte. Anclas por
> contenido (`grep -n`), nunca por número de línea. Todo `describe` nuevo
> lleva el prefijo `#77 R<n>:`. Los mensajes de commit son **literales** (los
> de abajo, en inglés, `<scope>` = `mobile`). La trazabilidad se rellena **una
> sola vez**, en el commit final `docs(mobile): fill #77 traceability` tras el
> último verde ([[traceability]]).
>
> Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Antes de empezar

- [ ] Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
      `feature/77-mobile-home-weight-without-collar`, y
      `git merge-base --is-ancestor a8d5cb70 HEAD; echo "exit=$?"` → `exit=0`.
- [ ] `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
      `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (el mismo con o sin #126 en
      la base: #126 no toca producción). Si es otro, **parar y pedir al
      humano**: alguien movió la Home y las anclas del Contrato pueden no
      valer.
- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"` →
      `exit=0`. Si da `1`, **parar y pedir al humano** que lo borre
      (gitignorado, rompe `tsc` con rutas fantasma).
- [ ] **No lanzar `./init.sh` ni el e2e** (Postgres y LocalStack compartidos
      entre worktrees; lo corre el leader). Esta feature se verifica con jest,
      tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe, desde
      `mobile-pet-tracker/`:
      `bunx jest --runTestsByPath src/screens/home/index.test.tsx; echo "exit=$?"`
      (**144** en `a8d5cb70`; **146** si #126 ya está en la base) y
      `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` desde la raíz
      (**83 / 1530** en `a8d5cb70`; **83 / 1532** con #126). Los deltas de
      esta spec (+13) van **sobre la base que haya**.
- [ ] `grep -c "describe('R10: last position enlaza al mapa', () => {" src/screens/home/index.test.tsx`
      → `1` (ancla de inserción de los tres `describe`).
- [ ] `grep -cP '#[0-9]++(?! R[0-9])' src/screens/home/index.test.tsx` → `1`
      (el `R5 (#40)` que ya existe). Tras cada commit debe seguir en `1`: en
      el código nuevo, `#` seguido de cifras solo como `#77 R<n>`.
- [ ] Código de test nuevo: nada de la forma `<palabra>-[` y ningún
      `StyleSheet` (guards `describe('C8: la UI no usa clases arbitrarias'` y
      de drift de #126).
- [ ] Sin comentarios nuevos en producción. **Sin dependencias nuevas.** Sin
      tocar ningún fichero fuera de `src/screens/home/index.tsx`,
      `src/screens/home/index.test.tsx` y (al final)
      `specs/mobile-home-weight-without-collar/traceability.md`. En concreto,
      **no** tocar `specs/mobile-home-stats-strip/requirements.md` (su
      enmienda ya la escribió el spec_author) ni `docs/conventions.md`.
- [ ] Todo con **bun**: `bunx jest`, `bunx tsc`, `bun run …`. Nada de `npx` ni
      `npm`.
- [ ] Skills (nombres de Claude; el leader da los de Codex en el handoff):
      `expo-overview` → `expo-native-ui`, `appllama-app-design-skill`. La carta
      `docs/ui-guidelines.md` gana (aquí, `className` con Uniwind, no estilos
      en línea).

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3`, y R4 (humano) al final.

- R1 asevera `summary-weight` (existe hoy en `ok`; su verde la saca de esa
  condición), `summary-note` (existe hoy, fuera de la fila), `collar-card` y
  `pet-hero-error` (existen hoy). No asevera nada que cree R2 o R3.
- R2 asevera la **posición** de `summary-note` dentro de la fila: la crea su
  propio verde. Todo lo demás que mira (la celda, su icono, valor y etiqueta)
  existe desde el verde de R1.
- R3 asevera `summary-skeleton`, `summary-card-title`, `collar-card` (existen
  hoy) y la **ausencia** de `summary-weight` y `summary-note`.

---

## R1 — El peso se pinta aunque la actividad no esté disponible

- [ ] **(1) Commit rojo** `test(mobile): expose the weight cell without activity (R1)`.
  - `src/screens/home/index.test.tsx`: **inmediatamente antes** de
    `describe('R10: last position enlaza al mapa', () => {`, este bloque
    literal seguido de una línea en blanco:

```tsx
describe('#77 R1: el peso se pinta aunque la actividad no esté disponible', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ currentWeightKg: 12.4 });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it.each<[string, DailyActivityState]>([
    ['sin collar', { kind: 'no-tracking' }],
    ['con la actividad en error', { kind: 'error' }],
    ['sin conexión', { kind: 'unreachable', message: 'network down' }],
    ['sin configuración', { kind: 'missing-config' }],
  ])('%s: pinta el peso registrado', async (_state, activityState) => {
    mockGetDailyActivity.mockResolvedValue(activityState);

    await renderHome();

    await waitFor(() =>
      expect(screen.getByTestId('summary-weight')).toHaveTextContent('12.4 kg'),
    );
  });

  it('pinta un guion sin peso registrado', async () => {
    const pet = makePet({ currentWeightKg: null });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });

    await renderHome();
    // #77 R1: the collar card needs the pet detail, so the dash below is the
    // resolved profile without weight, not the dash shown while it loads.
    await screen.findByTestId('collar-card');
    await screen.findByTestId('summary-weight');

    expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
  });

  it('pinta un guion y la nota cuando el perfil tampoco resuelve', async () => {
    mockGetPet.mockResolvedValue({ kind: 'unreachable', message: 'network down' });
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });

    await renderHome();
    await screen.findByTestId('pet-hero-error');
    await screen.findByTestId('summary-weight');

    expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-note')).toHaveTextContent(
      'La actividad requiere un collar',
    );
  });

  it('no añade ninguna llamada a la API', async () => {
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });

    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('summary-weight')).toHaveTextContent('12.4 kg'),
    );
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );

    expect(source).not.toContain('../../api/health-records');
    expect({
      pets: mockListPets.mock.calls.length,
      detail: mockGetPet.mock.calls.length,
      activity: mockGetDailyActivity.mock.calls.length,
    }).toEqual({ pets: 1, detail: 1, activity: 1 });
  });
});
```

  Sin cambios de producción. Rojo esperado (medido): **7** (las 4 filas del
  `it.each`, `pinta un guion sin peso registrado`,
  `pinta un guion y la nota cuando el perfil tampoco resuelve` y
  `no añade ninguna llamada a la API`), todos por
  `Unable to find an element with testID: summary-weight`; el fichero pasa a
  base + 7 tests (151 sobre `a8d5cb70`). `bunx tsc --noEmit` pasa.
- [ ] **(2) Commit verde** `feat(mobile): paint the weight cell when activity is unavailable (R1)`.
  En `src/screens/home/index.tsx`, **dos** cambios y nada más:
  1. La línea `{activity.data?.kind === 'ok' ? (` **inmediatamente anterior**
     a `<View className="flex-row">` (hay otra idéntica más abajo, la que abre
     `<WeeklyActivityChart`: esa **no** se toca) pasa a estas dos líneas, con
     la misma sangría:

     ```tsx
     {activity.data !== undefined &&
     activity.data.kind !== 'unauthorized' ? (
     ```

  2. Dentro de `<View className="flex-row">`, las tres celdas que siguen a la
     de peso (la de `<Walk size={20} color={muted} />`, la de
     `<Moon size={20} color={muted} />` y la de
     `<Map size={20} color={muted} />`) se envuelven, **sin cambiar nada de
     ellas** salvo +4 espacios de sangría, en:

     ```tsx
     {activity.data.kind === 'ok' ? (
       <>
         {/* las tres celdas, tal cual */}
       </>
     ) : null}
     ```

     (el comentario es de esta spec; no se escribe). La celda de peso queda
     **fuera** del ternario, primera hija de la fila, sin tocar.

  Las dos notas sueltas (`{activity.data?.kind === 'no-tracking' ? (` y
  `{activity.data?.kind === 'error' ||`) **se quedan** en este commit. Verde:
  el fichero entero (151 sobre `a8d5cb70`), `exit=0`. Diff medido: 45
  inserciones, 40 borrados.
- [ ] **(3) Refactor**: ninguno previsto.

## R2 — Sin actividad, la fila es la celda de peso seguida de la nota

- [ ] **(1) Commit rojo** `test(mobile): compose the weight cell and the activity note in one row (R2)`.
  - `src/screens/home/index.test.tsx`: **inmediatamente después** del
    `describe('#77 R1: …'` (entre él y
    `describe('R10: last position enlaza al mapa', () => {`), una línea en
    blanco y este bloque literal:

```tsx
describe('#77 R2: sin actividad, la fila es la celda de peso seguida de la nota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ currentWeightKg: 12.4 });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    // #77 R2: each CSS variable resolves to its own name, so muted and
    // accent-strong stop being the same fallback colour in the tree.
    jest
      .spyOn(Uniwind, 'getCSSVariable')
      .mockImplementation((token) => token);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each<[string, DailyActivityState, string]>([
    ['sin collar', { kind: 'no-tracking' }, 'La actividad requiere un collar'],
    ['con la actividad en error', { kind: 'error' }, 'No se pudo cargar la actividad'],
    [
      'sin conexión',
      { kind: 'unreachable', message: 'network down' },
      'No se pudo cargar la actividad',
    ],
    ['sin configuración', { kind: 'missing-config' }, 'No se pudo cargar la actividad'],
  ])('%s: compone la celda y la nota en una sola fila', async (_state, activityState, noteCopy) => {
    mockGetDailyActivity.mockResolvedValue(activityState);

    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('summary-weight')).toHaveTextContent('12.4 kg'),
    );
    const value = screen.getByTestId('summary-weight');
    const cell = value.parent!;
    const row = cell.parent!;
    // #77 R2: counted by children, not by testID.
    const rowChildren = row.children.filter((child) => typeof child !== 'string');
    const cellChildren = cell.children.filter((child) => typeof child !== 'string');

    expect(row.props.className).toBe('flex-row');
    expect(row.props.accessible).toBeUndefined();
    expect(row.props.accessibilityLabel).toBeUndefined();
    expect(rowChildren).toHaveLength(2);
    expect(rowChildren[0]).toBe(cell);
    expect(rowChildren[1].props.testID).toBe('summary-note');

    expect(cell.props.className).toBe(
      'flex-1 items-center gap-1 border-r border-border',
    );
    expect(cell.props.accessible).toBeUndefined();
    expect(cell.props.accessibilityLabel).toBeUndefined();
    expect(cell.props.onPress).toBeUndefined();
    expect(cellChildren).toHaveLength(3);
    expect(cellChildren[0].props).toEqual({
      testID: 'icon-weight',
      size: 20,
      color: '--color-muted',
    });
    expect(cellChildren[1]).toBe(value);
    expect(value.props.className).toBe('text-sm font-bold text-foreground');
    expect(value.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(cellChildren[2].props.className).toBe(
      'text-2xs font-normal text-muted',
    );
    expect(cellChildren[2]).toHaveTextContent('Peso');

    const note = rowChildren[1];
    expect(
      within(screen.getByTestId('summary-card')).getByTestId('summary-note'),
    ).toBe(note);
    expect(note.props.className).toBe(
      'flex-3 self-center pl-3 font-normal text-muted',
    );
    expect(note).toHaveTextContent(noteCopy);
    expect(note.props.onPress).toBeUndefined();

    for (const testID of [
      'summary-activity',
      'summary-sleep',
      'summary-distance',
    ]) {
      expect(screen.queryByTestId(testID)).toBeNull();
    }
  });
});
```

  Sin cambios de producción. Rojo esperado (medido): **4** (las 4 filas),
  por aserción: `expect(rowChildren).toHaveLength(2)`, recibido `1` (en el
  verde de R1 la nota vive fuera de la fila). Fichero: base + 11 (155 sobre
  `a8d5cb70`). `bunx tsc --noEmit` pasa.
- [ ] **(2) Commit verde** `feat(mobile): move the activity note into the stats row (R2)`.
  En `src/screens/home/index.tsx`:
  1. Borrar los **dos** bloques de nota sueltos, cada uno con la línea en
     blanco que lo sigue: el que empieza por
     `{activity.data?.kind === 'no-tracking' ? (` y el que empieza por
     `{activity.data?.kind === 'error' ||` (los dos terminan en `) : null}`).
  2. El `) : null}` que cierra el ternario
     `{activity.data.kind === 'ok' ? (` del verde de R1 (justo después del
     `</>`) pasa a:

     ```tsx
     ) : (
       <Text
         testID="summary-note"
         className="flex-3 self-center pl-3 font-normal text-muted"
       >
         {activity.data.kind === 'no-tracking'
           ? t('home.activityNeedsCollar')
           : t('home.couldNotLoadActivity')}
       </Text>
     )}
     ```

  El fichero queda exactamente como el Contrato de [[requirements]]. Verde:
  el fichero entero (155), `exit=0`. Diff medido: 10 inserciones, 15 borrados.
- [ ] **(3) Refactor**: ninguno previsto.

## R3 — La fila no se pinta sin sesión ni mientras carga la actividad

- [ ] **(1) Commit rojo** `test(mobile): lock the stats row out of loading and expired sessions (R3)`,
  con este cuerpo literal (una línea en blanco tras el título):
  `Versions the V3 production mutation (CHECKPOINTS C4, route b); the next commit reverts it.`
  - `src/screens/home/index.test.tsx`: **inmediatamente después** del
    `describe('#77 R2: …'`, una línea en blanco y este bloque literal:

```tsx
describe('#77 R3: la fila no se pinta sin sesión ni mientras carga la actividad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ currentWeightKg: 12.4 });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('no pinta la fila con la sesión caducada', async () => {
    const onUnauthorized = jest.fn();
    mockGetDailyActivity.mockResolvedValue({ kind: 'unauthorized' });

    await renderWithProviders(<HomeScreen />, {
      wrapper: HomeWrapper,
      onUnauthorized,
    });
    await screen.findByTestId('collar-card');
    await waitFor(() => expect(onUnauthorized).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByTestId('summary-skeleton')).toBeNull(),
    );

    expect(screen.getByTestId('summary-card-title')).toBeVisible();
    expect(screen.queryByTestId('summary-weight')).toBeNull();
    expect(screen.queryByTestId('summary-note')).toBeNull();
  });

  it('no pinta la fila mientras la actividad carga', async () => {
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());

    await renderHome();
    await screen.findByTestId('collar-card');

    expect(screen.getByTestId('summary-skeleton')).toBeVisible();
    expect(screen.queryByTestId('summary-weight')).toBeNull();
    expect(screen.queryByTestId('summary-note')).toBeNull();
  });
});
```

  - `src/screens/home/index.tsx`, **mutación V3** (tres sustituciones y nada
    más; es la guarda relajada a «hay mascota seleccionada»):
    1. Las dos líneas `{activity.data !== undefined &&` /
       `activity.data.kind !== 'unauthorized' ? (` pasan a una sola,
       `{selectedPetId !== null ? (`, con la misma sangría.
    2. `{activity.data.kind === 'ok' ? (` → `{activity.data?.kind === 'ok' ? (`.
    3. `{activity.data.kind === 'no-tracking'` → `{activity.data?.kind === 'no-tracking'`.

    (Los dos `?.` solo hacen falta para que compile sin la guarda.)
  Rojo esperado (medido): **2** (los dos `it` de `#77 R3`), por aserción
  (`expect(...).toBeNull()`, recibido el `summary-weight`). Ningún otro rojo.
  Fichero: base + 13 (157 sobre `a8d5cb70`). `bunx tsc --noEmit` pasa.
- [ ] **(2) Commit verde** `fix(mobile): restore the stats row gate (R3)`.
  Revertir **exactamente** V3 en `src/screens/home/index.tsx`. Comprobación:
  `git diff --exit-code <hash del verde de R2> HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"`
  → `exit=0`. Verde: el fichero entero (157), `exit=0`.
- [ ] **(3) Refactor**: ninguno previsto.

## R4 — Smoke en dev build de Android (humano)

- [ ] Lo corre el humano tras el veredicto del `reviewer`, con los pasos de
      [[requirements]] §Prueba de humo, y firma su casilla allí. Codex no lo
      marca.

---

## Sondas (no se commitean; cada una roja y restaurada con `git diff` vacío)

Las corre Codex sobre el verde de R3 antes del cierre y las repite el
`reviewer`. Todas con **un solo fichero y sin `--json`** (con `--json` el
reporter revienta al serializar los `toBe` entre elementos del árbol, N2 y
N15):

`bunx jest --runTestsByPath src/screens/home/index.test.tsx; echo "exit=$?"`

Tras cada una,
`git diff --exit-code -- src/screens/home/index.tsx; echo "exit=$?"` →
`exit=0`.

- **R1**: M1-M5 de [[requirements]] §R1.
- **R2**: N1-N19 de [[requirements]] §R2. «Solo sin actividad» quiere decir
  que la mutación se condiciona a `activity.data.kind !== 'ok'` (o vive en la
  rama de la nota), así que el estado `ok` no cambia. N19 es el **control** de
  D5: su único rojo es `#69 R9`.
- **R3**: V3 (ya medido por su commit rojo), V3a y V3b de [[requirements]]
  §R3.

Anotar en el reporte cuántos tests se ponen rojos con cada una y cuáles, y
compararlo con las tablas. Los recuentos son sobre 157; si #126 ya está en la
base (159), una sonda puede sumar algún rojo de `#126 R1`: lo que tiene que
cuadrar es que **estén todos** los rojos listados.

---

## Cierre (Codex, antes de escribir `progress/impl_mobile-home-weight-without-collar.md`)

Todo **sin pipe** (el código de salida de un pipe es el del último comando),
desde `mobile-pet-tracker/` salvo que se diga otra cosa:

- [ ] `bunx jest --runTestsByPath src/screens/home/index.test.tsx; echo "exit=$?"`
      → `exit=0`, **base + 13** (157 sobre `a8d5cb70`; 159 con #126).
- [ ] Desde la raíz, `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` →
      `exit=0`, **+0 suites y +13 tests** sobre la base (83 / 1543 sobre
      `a8d5cb70`; 83 / 1545 con #126).
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`, y
      después `bun run typecheck; echo "exit=$?"` y
      `bun run lint; echo "exit=$?"` → `exit=0`.
- [ ] Greps sobre `src/screens/home/index.tsx`:
      `grep -c 'testID="summary-note"'` → `1`;
      `grep -c '<Weight size={20} color={muted} />'` → `1`;
      `grep -c 'style={TABULAR_NUMS}'` → `8`;
      `grep -c "activity.data.kind !== 'unauthorized'"` → `1`;
      `grep -c "{activity.data?.kind === 'ok' ? ("` → `1` (la de
      `<WeeklyActivityChart`);
      `grep -c "{activity.data?.kind === 'no-tracking'"` → `0`;
      `grep -n "health-records"` → vacío (`exit=1`).
- [ ] Greps sobre `src/screens/home/index.test.tsx`:
      `grep -c StyleSheet` → `0`; `grep -c -- "-\["` → `0`;
      `grep -cP '#[0-9]++(?! R[0-9])'` → `1`;
      `grep -c "^describe('#77 R"` → `3`.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker` → exactamente
      `src/screens/home/index.tsx` y `src/screens/home/index.test.tsx`.
- [ ] Commit final `docs(mobile): fill #77 traceability` con los seis hashes
      en [[traceability]], y el reporte con las bases, las sondas y los
      recuentos.
