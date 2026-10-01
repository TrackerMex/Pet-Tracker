---
feature: "mobile-classnames-own-tag-tree-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-classnames-own-tag-tree-lock]] (#127 y #128)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 a R4 se escriben sobre código que ya cumple, así que su
> rojo es una **mutación de producción versionada** en el commit rojo, que el
> verde revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo. Los botones, los
> skeletons y las píldoras ya existen en la base y los pinta el montaje del
> propio `it`. El sheet de borrado lo abre la pulsación del propio `it` de R4.
> Cada bloque usa solo helpers que ya existen en su test, y trae su propio
> `beforeEach`. Ningún bloque depende de otro.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita, y cada ancla da 1 en la base. **Las rutas de `src/app/(auth)/` llevan
> paréntesis**: van siempre entre comillas, en `git`, en `jest` y en `grep`.

## Antes de tocar nada

1. `git branch --show-current` da `feature/127-mobile-classnames-own-tag-tree-lock`.
   Si no, **para**. Anota `git rev-parse HEAD`: es **`H0`**, el commit desde
   el que se mide la lista cerrada de ficheros de R6.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está
   gitignorado y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu
   sandbox lo deniega (#121).
4. **No cargues ninguna skill de expo.** Este ciclo no cambia UI: todo lo que
   necesitas está escrito aquí. Todo se corre con `bun` y `bunx`, nunca con
   `npm` ni `npx`. No instales nada. No corras `./init.sh` ni los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/app/(auth)/login.tsx` | `72ef07f50c9c79d939f3496b358b9864a46b7fc5` |
   | `src/app/(auth)/forgot.tsx` | `cbf07d9085838ed5df2c1e29d4af5c69b621d365` |
   | `src/app/(auth)/register.tsx` | `02c1e79595279c6973511cbca8f74ec4abee22d7` |
   | `src/screens/reset-password/index.tsx` | `f58c118ca953c8f58a24d503d721d23204535ccd` |
   | `src/screens/health/index.tsx` | `7e31f13313a390ce8d32bf9ce930be9688ed505d` |
   | `src/components/pet-hero-header.tsx` | `eb19efe3776345d7294fef922d15ef7a6d060a9a` |
   | `src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
   | `src/app/(auth)/__tests__/login.test.tsx` | `f1af97725d933db3710399034efbf8530cb5ee0e` |
   | `src/app/(auth)/__tests__/forgot.test.tsx` | `0ca250f887f701657029bd6c67ef97c65b6c9053` |
   | `src/app/(auth)/__tests__/register.test.tsx` | `9c0d47bce0dc06efae78467c8f3923061ce08971` |
   | `src/screens/reset-password/index.test.tsx` | `7ff07c24c4814e824ff40890c746bf6a23fc1eef` |
   | `src/screens/health/index.test.tsx` | `6717494236cf9f1e8abbfe744d2d71a60a28b2ba` |
   | `src/components/__tests__/pet-hero-header.test.tsx` | `63e01f83b3450d363c16484892607b4227a7db37` |
   | `src/screens/reminders/index.test.tsx` | `0c02d608b9afc407b53ad584e80d308df7ab8092` |
   | `src/__tests__/consistency-classnames.test.ts` | `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7` |
   | `src/__tests__/legibility-classnames.test.ts` | `8c42a1052626ed4ea11b2fe361dcb06fac761b7d` |
   | `src/__tests__/ui-language.test.ts` | `2b8b33f343a993833a23686174ddb1ae0b7a0776` |
   | `docs/conventions.md` (desde la raíz) | `78ed538c70c544989e296ee71a890b49c2bd7e0d` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas
   de esta spec ya no valen.
6. Mide la base con estos dos comandos, **sin pipe**. El primero es **«las
   nueve»**: los dos candados de fuente y los siete tests de este ciclo. En
   adelante, «las nueve» es ese comando, con otro nombre de log.

   ```bash
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/screens/reminders/index.test.tsx "src/app/(auth)/__tests__/login.test.tsx" "src/app/(auth)/__tests__/forgot.test.tsx" "src/app/(auth)/__tests__/register.test.tsx" src/screens/reset-password/index.test.tsx src/screens/health/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx > /tmp/127_nueve.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/127_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/127_nueve.log /tmp/127_full.log
   ```

   Esperado:
   - las nueve dan 9 de 9 suites y 212 passed de 212, `exit=0`;
   - la suite da 86 passed de 86 suites y 1626 passed de 1626 tests, con
     1 snapshot, `exit=0`.

   **La cifra de la suite la relató el `leader` y el spec_author no la
   midió**: la tuya manda. Si la suite da otra cifra con `exit=0`, **anota la
   medida** y úsala como base. El delta exigido es +8 tests y +0 suites sobre
   lo medido, y los «N failed de M» de los rojos se desplazan igual.

   Nunca pongas `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería
   el del último comando. Los bloques `● Console` del log son ruido y no
   cuentan como fallo. Los rojos se cuentan por la línea `Tests:`.
7. **Reglas de literales en los bloques nuevos**:
   - un `#` solo puede ir seguido de dígitos, un espacio y `R<n>` (`#127 R1`,
     `#128 R4`), por `#68 R18` (`src/__tests__/design-drift.test.ts`). Nada de
     `#127` ni `#128` sueltos;
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` (`#87 R19`);
   - las clases, los estilos y el texto esperados son **literales** del test:
     no importes `PET_HERO_MEDIA_HEIGHT`, `CONTINUOUS_CORNER`, el catálogo ni
     nada de producción, ni leas su fuente ([[design]] D6).
8. **Pega los bloques tal cual, sin prettier.** Ningún test de este ciclo pasa
   por prettier, y `mobile-pet-tracker/` no tiene configuración de prettier:
   formatearlo cambiaría líneas de la base. Los bloques de esta página están
   en la columna 0, igual que van en el test, y sus líneas en blanco van
   vacías. El blob que se cita tras cada bloque te dice si lo pegaste bien. No
   añadas ningún import ni toques ningún helper: todo lo que usan los bloques
   ya está en su test ([[design]] D9).

## R1 — Los cuatro botones de envío llevan su receta en el árbol (#127)

### (1) Rojo

1. En cada uno de los cuatro tests de la tabla, al final del fichero, después
   del `});` que cierra su último `describe` de la base, añade una línea en
   blanco y el bloque de su fila. El último `describe` se encuentra con
   `grep -n "^describe(" <test> | tail -1`.

   | Test | Último `describe` de la base | Bloque | Blob tras pegar | Líneas | Tests |
   |---|---|---|---|---|---|
   | `src/app/(auth)/__tests__/login.test.tsx` | `'#61 R8: login tiene contenedor de scroll con safe areas'` | R1-login | `9cf126af385d8472ce4930088d8b12025a24dc4d` | 156 → 175 | 9 → 10 |
   | `src/app/(auth)/__tests__/forgot.test.tsx` | `'#61 R8: forgot tiene contenedor de scroll con safe areas'` | R1-forgot | `d407cbe0a48c0f885d36273941964869cecd0099` | 89 → 99 | 3 → 4 |
   | `src/app/(auth)/__tests__/register.test.tsx` | `'#61 R7: register usa las métricas de pantalla uniformes'` | R1-register | `dca8649f909cb12ea3806b69743d1cdace9105bb` | 239 → 258 | 11 → 12 |
   | `src/screens/reset-password/index.test.tsx` | `'#61 R8: las tres ramas de reset tienen contenedor de scroll'` | R1-reset | `1a2ea572443f026ea8b497b3453b7f0b9e86a030` | 266 → 280 | 17 → 18 |

   Bloque **R1-login**:

```tsx
describe('#127 R1: el botón de envío de login lleva su receta en el árbol', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated',
      token: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderLogin();

    expect(screen.getByTestId('login-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent',
    );
  });
});
```

   Bloque **R1-forgot**:

```tsx
describe('#127 R1: el botón de envío de forgot lleva su receta en el árbol', () => {
  it('pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await render(<Forgot />, { wrapper: AuthScreenWrapper });

    expect(screen.getByTestId('forgot-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent',
    );
  });
});
```

   Bloque **R1-register**:

```tsx
describe('#127 R1: el botón de envío de register lleva su receta en el árbol', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      status: 'unauthenticated',
      token: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderRegister();

    expect(screen.getByTestId('register-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent',
    );
  });
});
```

   Bloque **R1-reset**:

```tsx
describe('#127 R1: el botón de envío de reset-password lleva su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente', async () => {
    await renderRoute('reset-token-127');

    expect(screen.getByTestId('reset-submit').props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent',
    );
  });
});
```

2. En los cuatro ficheros de producción, aplica `P1red`. La línea

   ```tsx
           className="w-full rounded-xl bg-accent"
   ```

   (8 espacios; `grep -c '^        className="w-full rounded-xl bg-accent"$' <fichero>`
   da 1 en cada uno) pasa a estas dos:

   ```tsx
           className="w-full bg-accent"
           // rounded-xl bg-accent
   ```

   | Fichero | Blob con `P1red` |
   |---|---|
   | `src/app/(auth)/login.tsx` | `00794879d47aad3e7c8862369f54a8fac5650582` |
   | `src/app/(auth)/forgot.tsx` | `a2d2c544cce1e262f6d8ef5793c51d4e1b206a73` |
   | `src/app/(auth)/register.tsx` | `d0cb2b303b4bbb028ae57e79b31ac7c410a34121` |
   | `src/screens/reset-password/index.tsx` | `c910abf7ad866e688cb4d0bbd692ae2b0ea6d15b` |

3. Las nueve dan `exit=1`: 4 failed y 212 passed de 216, 4 suites failed. Los
   **únicos** rojos son los cuatro `it` de `#127 R1`, todos **por aserción**
   (`expect(received).toBe(expected)`). El recibido es el literal sin
   `rounded-xl`. Los candados de fuente siguen en verde: es justo el hueco que
   se cierra.
4. La suite da `exit=1`: 4 failed y 1626 passed de 1630; 4 suites failed y 82
   passed de 86. Los únicos rojos son esos cuatro. Si falla otro test, o
   alguno de estos falla por otra cosa, **para**.
5. Commit rojo, con los ocho ficheros (desde la raíz):

   ```bash
   git add "mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx" "mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx" "mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx" mobile-pet-tracker/src/screens/reset-password/index.test.tsx "mobile-pet-tracker/src/app/(auth)/login.tsx" "mobile-pet-tracker/src/app/(auth)/forgot.tsx" "mobile-pet-tracker/src/app/(auth)/register.tsx" mobile-pet-tracker/src/screens/reset-password/index.tsx
   git commit -m "test(mobile): expose the auth submit recipes with a versioned mutation (R1)"
   ```

### (2) Verde

1. Desde la raíz:

   ```bash
   git checkout HEAD~1 -- "mobile-pet-tracker/src/app/(auth)/login.tsx" "mobile-pet-tracker/src/app/(auth)/forgot.tsx" "mobile-pet-tracker/src/app/(auth)/register.tsx" mobile-pet-tracker/src/screens/reset-password/index.tsx
   ```

   Los cuatro vuelven a su blob de base (§Antes de tocar nada, paso 5).
2. Las nueve dan 216 de 216, `exit=0`.
3. Commit verde, solo con los cuatro ficheros de producción:

   ```bash
   git add "mobile-pet-tracker/src/app/(auth)/login.tsx" "mobile-pet-tracker/src/app/(auth)/forgot.tsx" "mobile-pet-tracker/src/app/(auth)/register.tsx" mobile-pet-tracker/src/screens/reset-password/index.tsx
   git commit -m "test(mobile): lock the auth submit buttons' className in the tree (R1)"
   ```

### (3) Refactor

Ninguno. Los cuatro bloques se parecen, pero cada uno monta su pantalla con
el helper de su test, y un helper compartido entre ficheros sería código
nuevo para cuatro líneas ([[design]] D9).

## R2 — Los dos skeletons llevan su receta en el árbol (#127)

### (1) Rojo

1. En los dos tests de la tabla, igual que en R1, añade al final una línea en
   blanco y el bloque de su fila.

   | Test | Último `describe` de la base | Bloque | Blob tras pegar | Líneas | Tests |
   |---|---|---|---|---|---|
   | `src/screens/health/index.test.tsx` | `'#87 R13: HealthScreen lee por TanStack Query'` | R2-health | `c1f95aca46b4bdeff4c8fde59398caf68cf403c1` | 689 → 717 | 28 → 29 |
   | `src/components/__tests__/pet-hero-header.test.tsx` | `'#73 E2: el punto de "en linea" pulsa con Reanimated y respeta reduced motion'` | R2-hero | `3642ba3dedb67a57859c3da039889ee6427551b1` | 614 → 627 | 36 → 37 |

   Bloque **R2-health**:

```tsx
describe('#127 R2: el skeleton de vacunas lleva su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListWeights.mockReturnValue(pending<WeightsState>());
  });

  it('pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente', async () => {
    mockListVaccines.mockReturnValue(pending<VaccinesState>());

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-skeleton')).toBeVisible(),
    );
    expect(screen.getByTestId('vaccines-skeleton').props.className).toBe(
      'skeleton__root h-24 w-full rounded-card',
    );
  });
});
```

   Bloque **R2-hero**:

```tsx
describe('#127 R2: el skeleton del hero lleva su receta en el árbol', () => {
  afterEach(() => cleanup());

  it('pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente', async () => {
    await renderHero(<PetHeroHeader pet={null} variant="bleed" />);

    const skeleton = screen.getByTestId('pet-hero-skeleton');

    expect(skeleton.props.className).toBe('w-full');
    expect(skeleton.props.style).toStrictEqual({ height: 260 });
  });
});
```

2. Aplica `P2red`, en dos ficheros:
   - En `src/screens/health/index.tsx`, la línea

     ```tsx
                   className="h-24 w-full rounded-card"
     ```

     (14 espacios; `grep -c '^              className="h-24 w-full rounded-card"$'`
     da 1) pasa a estas dos:

     ```tsx
                   className="h-24 w-full"
                   // className="h-24 w-full rounded-card"
     ```

     El fichero da el blob `565067e256a4af0d4087a45b0d85cc9c52dc99ee`.
   - En `src/components/pet-hero-header.tsx`, la línea
     `            className="w-full"` (12 espacios) que va justo debajo de
     `            testID="pet-hero-skeleton"` (`grep -c '^            testID="pet-hero-skeleton"$'`
     da 1) pasa a estas dos:

     ```tsx
                 className="w-full bg-default"
                 // className="w-full"
     ```

     El fichero da el blob `9b4d1690cc1c2647a87b05e541f09a5b47426d3d`.
3. Las nueve dan `exit=1`: 2 failed y 216 passed de 218, 2 suites failed. Los
   **únicos** rojos son los dos `it` de `#127 R2`, **por aserción**
   (`expect(received).toBe(expected)`). En salud, el recibido es
   `"skeleton__root h-24 w-full"`, y en el hero, `"w-full bg-default"`.
4. La suite da `exit=1`: 2 failed y 1630 passed de 1632; 2 suites failed y 84
   passed de 86. Los únicos rojos son esos dos. Si no, **para**.
5. Commit rojo, con los cuatro ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx
   git commit -m "test(mobile): expose the skeleton recipes with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx`
   (desde la raíz). Los dos vuelven a su blob de base.
2. Las nueve dan 218 de 218, `exit=0`.
3. Commit verde, solo con los dos ficheros de producción:

   ```bash
   git add mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx
   git commit -m "test(mobile): lock the vaccines and hero skeletons in the tree (R2)"
   ```

### (3) Refactor

Ninguno. El `style` de `vaccines-skeleton` no se asevera: queda como (D)
([[requirements]] §Fuera de alcance).

## R3 — Las tres píldoras de resumen llevan su receta en el árbol (#127)

### (1) Rojo

1. En `src/screens/reminders/index.test.tsx`, al final del fichero, después
   del `});` que cierra
   `describe('#84 R6: los umbrales de la píldora y del badge no se aflojan (Enmienda E1)'`
   (es el último `describe` de la base:
   `grep -n "^describe(" src/screens/reminders/index.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

```tsx
describe('#127 R3: las tres píldoras de resumen llevan su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
    );

    expect(
      ['pill-active', 'pill-week', 'pill-inactive'].map((testID) => {
        const { className, style } = screen.getByTestId(testID).props;

        return { testID, className, style };
      }),
    ).toStrictEqual([
      {
        testID: 'pill-active',
        className: 'flex-1 items-center gap-1 rounded-xl bg-accent-soft p-3',
        style: { borderCurve: 'continuous' },
      },
      {
        testID: 'pill-week',
        className: 'flex-1 items-center gap-1 rounded-xl bg-default p-3',
        style: { borderCurve: 'continuous' },
      },
      {
        testID: 'pill-inactive',
        className: 'flex-1 items-center gap-1 rounded-xl bg-default p-3',
        style: { borderCurve: 'continuous' },
      },
    ]);
  });
});
```

   El test da el blob `af60a67049e09c098b57a255be742e56c79b235b`, con 961
   líneas (911 en la base), 12 `describe` de primer nivel y 30 tests.
2. En `src/screens/reminders/index.tsx`, aplica `P3red` (la sonda `P-week-l3`
   de #127). Las tres líneas que van justo debajo de
   `              testID="pill-week"` (`grep -c '^              testID="pill-week"$'`
   da 1)

   ```tsx
                 className="flex-1 items-center gap-1 rounded-xl bg-default p-3"
                 style={CONTINUOUS_CORNER}
               >
   ```

   pasan a estas cuatro:

   ```tsx
                 className="flex-1 items-center gap-1 bg-default p-3"
                 style={CONTINUOUS_CORNER}
                 // rounded-xl
               >
   ```

   El fichero da el blob `baa5baba69d4a2c3bd94ba351e354b88090b1b9c`.
3. Las nueve dan `exit=1`: 1 failed y 218 passed de 219. El **único** rojo es
   `#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente`,
   **por aserción** (`expect(received).toStrictEqual(expected)`). El diff
   señala el `className` de `pill-week`.
4. La suite da `exit=1`: 1 failed y 1632 passed de 1633; 1 suite failed y 85
   passed de 86. Si no, **para**.
5. Commit rojo (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.test.tsx mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): expose the summary pill recipe with a versioned mutation (R3)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`
   (desde la raíz). Vuelve a `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`.
2. Las nueve dan 219 de 219, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): lock the three summary pills in the tree (R3)"
   ```

### (3) Refactor

Ninguno. La lista esperada se queda escrita píldora a píldora: generarla
desde una tabla sería esconder el literal ([[design]] D6).

## R4 — El botón destructivo y su etiqueta llevan su receta en el árbol (#128)

### (1) Rojo

1. En `src/screens/reminders/index.test.tsx`, al final del fichero, después
   del `});` que cierra el bloque de R3
   (`describe('#127 R3: las tres píldoras de resumen llevan su receta en el árbol'`),
   añade una línea en blanco y este bloque:

```tsx
describe('#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));

    const confirm = screen.getByTestId('reminders-delete-confirm');

    expect(confirm.props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-danger button__root--size-md w-full rounded-xl bg-danger',
    );
    expect(within(confirm).getByText('Eliminar').props.className).toBe(
      'button__label button__label--variant-danger button__label--size-md font-bold text-danger-foreground',
    );
  });
});
```

   El test da el blob `1f6fa07ed92e45126f13cf09aa915dd4353dc428`, con 997
   líneas, 13 `describe` de primer nivel y 31 tests.
2. En `src/screens/reminders/index.tsx`, aplica `P4red` (la sonda `D-c`). La
   línea

   ```tsx
                     <Button.Label className="font-bold text-danger-foreground">
   ```

   (18 espacios; `grep -c '^                  <Button.Label className="font-bold text-danger-foreground">$'`
   da 1) pasa a estas dos:

   ```tsx
                     {/* <Button.Label className="font-bold text-danger-foreground"> */}
                     <Button.Label className="font-bold text-foreground">
   ```

   El fichero da el blob `74fe6d45de908378bc99f2f130bc5f56665fb081`.
3. Las nueve dan `exit=1`: 1 failed y 219 passed de 220. El **único** rojo es
   `#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente`,
   **por aserción** (`expect(received).toBe(expected)`), en la **segunda**
   aserción, la de la etiqueta. El recibido es
   `"button__label button__label--variant-danger button__label--size-md font-bold text-foreground"`.
   El `it` de `#61 R1 … (#120 R2)` de `legibility-classnames.test.ts` sigue en
   verde: es justo el hueco que se cierra.
4. La suite da `exit=1`: 1 failed y 1633 passed de 1634; 1 suite failed y 85
   passed de 86. Si no, **para**.
5. Commit rojo (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.test.tsx mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): expose the delete-confirm label decoy with a versioned mutation (R4)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`
   (desde la raíz). Vuelve a `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`.
2. Las nueve dan 220 de 220, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): lock the delete-confirm button and its label in the tree (R4)"
   ```

### (3) Refactor

Ninguno. El `beforeEach` de R4 repite el de R3 a propósito: cada `describe`
es independiente ([[design]] D9).

## R5 — La convención dice quién cierra los límites 2 y 3

1. En `docs/conventions.md` (desde la raíz), sección
   «### Recortes del tag de apertura en candados de fuente»
   (`grep -n "Esos candados solo leen fuente" docs/conventions.md` da 1 línea),
   haz dos sustituciones exactas.

   **Primera.** Estas dos líneas:

   ```text
   ahí. Esos candados solo leen fuente, así que los límites 2 y 3 quedan como
   límites documentados. `legibility-classnames.test.ts` conserva a propósito
   ```

   pasan a estas siete:

   ```text
   ahí. Esos candados solo leen fuente, así que los límites 2 y 3 los cierra el
   árbol: cada uno de los nueve elementos tiene, en el test de su pantalla o de su
   componente, una pata que asevera con `toBe` su `className` entero, y su `style`
   donde lo lleva (#127 R1 a R3): `grep -rn "#127 R" mobile-pet-tracker/src`. En
   los `Button`, ese `className` incluye las clases que añade heroui-native
   (`pressable-feedback__root button__root …`): al subir su versión hay que volver
   a medir esos literales. `legibility-classnames.test.ts` conserva a propósito
   ```

   **Segunda.** Estas dos líneas, unas líneas más abajo en la misma sección:

   ```text
   señuelo `{false && (…)}` con la etiqueta correcta delante de la real da un
   verde falso.
   ```

   pasan a estas seis:

   ```text
   señuelo `{false && (…)}` con la etiqueta correcta delante de la real da un
   verde falso. Lo cierra el árbol (#128 R4):
   `grep -n "#128 R4" mobile-pet-tracker/src/screens/reminders/index.test.tsx`
   abre el sheet, busca la etiqueta con `within` dentro del botón y asevera con
   `toBe` su `className` y el del propio botón. Un señuelo que no se renderiza no
   está en el árbol, y uno que se renderiza da dos etiquetas y rompe la consulta.
   ```

   El fichero da el blob `c34410e2fa7eb848ccb58d83208399b8c7bb37b0` (+12 / −3).
2. Cuentas con `grep -cF` en `docs/conventions.md`, de la base al final:

   | Patrón | Base | Final |
   |---|---|---|
   | `límites documentados` | 1 | 0 |
   | `los límites 2 y 3 los cierra el` | 0 | 1 |
   | `#127 R` | 0 | 1 |
   | `#128 R4` | 0 | 2 |
   | `Lo cierra el árbol (#128 R4)` | 0 | 1 |
   | `Esos candados solo leen fuente` | 1 | 1 |

3. Las cuatro suites que leen o citan `docs/conventions.md` dan 234 de 234,
   `exit=0` (desde `mobile-pet-tracker/`):

   ```bash
   bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/screens/home/index.test.tsx > /tmp/127_r5.log 2>&1; echo "exit=$?"
   ```

4. Commit, solo con la convención (desde la raíz):

   ```bash
   git add docs/conventions.md
   git commit -m "docs: close the opening-tag slice limits with the tree locks (R5)"
   ```

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de §Catálogo de mutaciones en el fichero de producción
   de la tabla.
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la
   tabla. Si no coincide, la mutación no es la de la spec: corrígela antes de
   medir.
3. Corre el comando de la columna «Comando»:
   - `nueve` es el comando de las nueve (§Antes de tocar nada, paso 6);
   - `33` es ese mismo comando con estas 24 rutas más detrás de
     `--runTestsByPath`:

     ```text
     "src/app/(tabs)/__tests__/profile.test.tsx" "src/app/(tabs)/__tests__/screens.test.tsx" "src/app/(tabs)/__tests__/alerts.test.tsx" "src/app/(tabs)/__tests__/food.test.tsx" src/screens/home/index.test.tsx src/screens/profile/index.test.tsx src/screens/alerts/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/hooks/use-pet-selection.test.tsx src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts
     ```

     Son las suites que importan o leen alguno de los siete ficheros de
     producción. Las 33 suman 788 tests en el árbol final (220 + 568).
4. Anota `exit`, las cuentas, cada `it` rojo, **la primera línea de su error**
   y en qué aserción falla:
   - `expect(received).<matcher>` es un rojo **por aserción**;
   - `Found multiple elements with text: …` o `Unable to find …` es un rojo
     **por consulta**.

   La aserción se lee en el marco de código del log.
5. Restaura, desde la raíz:

   ```bash
   git checkout HEAD -- "mobile-pet-tracker/src/app/(auth)/login.tsx" "mobile-pet-tracker/src/app/(auth)/forgot.tsx" "mobile-pet-tracker/src/app/(auth)/register.tsx" mobile-pet-tracker/src/screens/reset-password/index.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx mobile-pet-tracker/src/screens/reminders/index.tsx
   ```

   Con `HEAD`: sin él, un fichero que hubieras añadido al índice conservaría
   la mutación.
6. `git diff --exit-code -- mobile-pet-tracker/src` y
   `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los dos.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

### Catálogo de mutaciones

Las líneas citadas dan 1 con `grep -c` en su fichero, salvo que se diga otra
cosa. «Las tres líneas de `pill-X`» son las que van justo debajo de
`              testID="pill-X"` (14 espacios): el `className`, el
`              style={CONTINUOUS_CORNER}` y el `            >` que cierra el
tag.

- **`P1red`**, **`P2red`**, **`P3red`** y **`D-c`**: las de los commits rojos
  de R1, R2, R3 y R4, tal cual.
- **`B-login-j`** (login): la línea
  `        className="w-full rounded-xl bg-accent"` pasa a
  `        className="w-full bg-accent"`, y justo debajo del `      >` que cierra
  el tag de `login-submit` (encima de
  `        <Button.Label className="font-bold text-accent-foreground">`) entra
  la línea `        {/* rounded-xl bg-accent */}`.
- **`B-login-h`** (login): la misma línea pasa a `        className="w-full"`,
  y justo encima de
  `        <Button.Label className="font-bold text-accent-foreground">` entra
  `        <Text className="rounded-xl bg-accent" />`.
- **`Z-label`** (login): la línea
  `        <Button.Label className="font-bold text-accent-foreground">` pasa a
  `        <Button.Label className="font-bold text-foreground">`.
- **`Z-state`** (login): la línea
  `        className="w-full rounded-xl bg-accent"` pasa a
  `        className={submitting ? 'w-full rounded-lg bg-accent' : 'w-full rounded-xl bg-accent'}`.
- **`Z-state2`** (login): la misma línea pasa a
  `        className={submitting ? 'w-full rounded-xl bg-default' : 'w-full rounded-xl bg-accent'}`.
- **`V-h`** (salud): las dos líneas
  `              className="h-24 w-full rounded-card"` y `            />` pasan a

  ```tsx
                className="h-24 w-full"
              >
                <View className="h-24 w-full rounded-card" />
              </Skeleton>
  ```

- **`S-h`** (hero): las tres líneas que siguen a
  `            testID="pet-hero-skeleton"` (`            className="w-full"`,
  `            style={{ height: PET_HERO_MEDIA_HEIGHT }}` y `          />`) pasan a

  ```tsx
              className="h-full"
              style={{ height: PET_HERO_MEDIA_HEIGHT }}
            >
              <View className="w-full" />
            </Skeleton>
  ```

- **`Z-hero-style`** (hero): la línea
  `            style={{ height: PET_HERO_MEDIA_HEIGHT }}` pasa a

  ```tsx
              style={{ height: PET_HERO_MEDIA_HEIGHT, borderRadius: 16 }}
              // style={{ height: PET_HERO_MEDIA_HEIGHT }}
  ```

- **`P-week-j`**, **`P-week-f`** y **`P-week-h`** (recordatorios): el
  `className` de `pill-week` pierde `rounded-xl ` (queda
  `              className="flex-1 items-center gap-1 bg-default p-3"`), y
  justo debajo de su `            >` entra, como primer hijo,
  `              {/* rounded-xl */}`, `              {false && 'rounded-xl'}` o
  `              <View className="rounded-xl" />`, respectivamente.
- **`P-active-l3`** y **`P-inactive-l3`** (recordatorios): como `P3red`, pero
  en las tres líneas de `pill-active` o de `pill-inactive`. El `className`
  pierde `rounded-xl ` (queda
  `              className="flex-1 items-center gap-1 bg-accent-soft p-3"` o
  `              className="flex-1 items-center gap-1 bg-default p-3"`), y
  entre el `style` y el `            >` entra `              // rounded-xl`.
- **`Z-week-style`** (recordatorios): en las tres líneas de `pill-week`,
  `              style={CONTINUOUS_CORNER}` pasa a

  ```tsx
                style={{ borderCurve: 'circular' }}
                // style={CONTINUOUS_CORNER}
  ```

- **`Z-child`** (recordatorios): de las tres líneas
  `                className="text-lg font-black text-foreground"` (16
  espacios; `grep -c` da 3), la que va dentro de `pill-week` (la segunda) pasa
  a `                className="text-lg font-bold text-foreground"`.
- **`D-d`** (recordatorios): la línea
  `                  <Button.Label className="font-bold text-danger-foreground">`
  (18 espacios) pasa a

  ```tsx
                    {false && (
                      <Button.Label className="font-bold text-danger-foreground">
                        {t('reminders.delete')}
                      </Button.Label>
                    )}
                    <Button.Label className="font-bold text-foreground">
  ```

- **`Z-d-dup`** (recordatorios): la misma línea pasa a

  ```tsx
                    <Button.Label className="font-bold text-danger-foreground">
                      {t('reminders.delete')}
                    </Button.Label>
                    <Button.Label className="font-bold text-danger-foreground">
  ```

- **`Z-d-variant`** (recordatorios): la línea `                  variant="danger"`
  (18 espacios) pasa a

  ```tsx
                    variant="danger-soft"
                    // variant="danger"
  ```

- **`D-h`** (recordatorios): la línea
  `                  className="w-full rounded-xl bg-danger"` pasa a
  `                  className="w-full rounded-xl"`, y entre el
  `                  </Button.Label>` y el `                </Button>` que siguen
  a `                    {t('reminders.delete')}` (20 espacios) entra
  `                  <View className="bg-danger" />`.
- **`D-v`** (recordatorios): se borra la línea `                  variant="danger"`,
  y en el mismo hueco que `D-h` entra `                  {/* variant="danger" */}`.

### Tabla

Convenciones:

- «R1-login», «R1-forgot», «R1-register» y «R1-reset» son los cuatro `it` de
  `#127 R1`; «R2-vacunas» y «R2-hero», los dos de `#127 R2`; «R3», el de
  `#127 R3`; «R4», el de `#128 R4`. En R2-hero, «a1» es la clase y «a2» el
  estilo. En R4, «a1» es el botón y «a2» la etiqueta.
- «Hoy» es la misma mutación sobre la base, para que el `reviewer` vea qué
  hueco cierra cada candado. Lo midió el spec_author con los bloques puestos,
  descontando los `it` nuevos: las nueve dan 212 tests en la base y 220 al
  final, y las 33, 780 y 788. Tú corres lo que diga «Comando», sobre el árbol
  final.
- `(#120 R1)` y `(#120 R2)` son los `it` de los candados de fuente cuyo título
  acaba así. Su nombre completo se cita en la fila.

| Sonda | Fichero | Blob | Comando | Hoy | Exigido tras este ciclo |
|---|---|---|---|---|---|
| `P1red` | los cuatro de autenticación | los de R1 | 33 | verde | rojo 4 de 788: R1-login, R1-forgot, R1-register y R1-reset, por `toBe` |
| `B-login-j` | login | `378fd105` | 33 | verde | rojo 1 de 788: R1-login, por `toBe` |
| `B-login-h` | login | `10ab4fdd` | nueve | rojo 1: `#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1)`, por `toContain` | rojo 2 de 220: ese, igual, y R1-login, por `toBe` |
| `Z-label` | login | `5c8e9b14` | 33 | verde | **verde**, 788/788: (F) |
| `Z-state` | login | `e248151f` | nueve | rojo 2: `#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-lg en producción` y `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, por `toEqual` | rojo 2 de 220, los mismos: R1 no ve el estado de envío, (D) |
| `Z-state2` | login | `c5a2de62` | 33 | verde | **verde**, 788/788: (D) |
| `P2red` | salud y hero | los de R2 | 33 | verde | rojo 2 de 788: R2-vacunas y R2-hero (a1), por `toBe` |
| `V-h` | salud | `0c3633c1` | nueve | rojo 1: `#62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R2-vacunas, por `toBe` |
| `S-h` | hero | `5bc88a73` | nueve | rojo 1: `#62 R2: cada skeleton tiene la forma del contenido que sustituye › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R2-hero, por `toBe`, a1 (recibido `"h-full"`) |
| `Z-hero-style` | hero | `e9e397cd` | nueve | verde | rojo 1 de 220: R2-hero, por `toStrictEqual`, a2 |
| `P3red` = `P-week-l3` | recordatorios | `baa5baba` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual` |
| `P-week-j` | recordatorios | `efa2646a` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual` |
| `P-week-f` | recordatorios | `214a8eb9` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual` |
| `P-week-h` | recordatorios | `195738de` | nueve | rojo 1: `#62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R3, por `toStrictEqual` |
| `P-active-l3` | recordatorios | `bdf163a9` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual` |
| `P-inactive-l3` | recordatorios | `812a6ce3` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual` |
| `Z-week-style` | recordatorios | `60f28714` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual` |
| `Z-child` | recordatorios | `6a341626` | 33 | verde | **verde**, 788/788: (F) |
| `D-c` = `P4red` | recordatorios | `74fe6d45` | 33 | verde | rojo 1 de 788: R4, por `toBe`, a2 |
| `D-d` | recordatorios | `50cc3d89` | 33 | rojo 2: `#65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta`, por `toEqual` | rojo 3 de 788: esos dos, igual, y R4, por `toBe`, a2 |
| `Z-d-variant` | recordatorios | `a94461d0` | 33 | verde | rojo 1 de 788: R4, por `toBe`, a1 (recibido con `variant-danger-soft`) |
| `Z-d-dup` | recordatorios | `47d10363` | nueve | verde | rojo 1 de 220: R4, **por consulta** (`Found multiple elements with text: Eliminar`) |
| `D-h` | recordatorios | `00ea6738` | nueve | rojo 10: `#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`, y nueve de `src/screens/reminders/index.test.tsx` que pasan por `confirmDelete` (`#97 R2`, `#97 R3` y siete de `R7: borrar recordatorio con confirmación`) | rojo 11 de 220: esos diez y R4, por `toBe`, a1 |
| `D-v` | recordatorios | `f136e971` | nueve | rojo 1: el `(#120 R2)` de `D-h`, por `toContain` | rojo 2 de 220: ese y R4, por `toBe`, a1 (recibido con `variant-primary`) |

## R6 — Cierre

1. Suite completa, sin pipe: 86 suites y 1634 tests, `exit=0`, o la base que
   mediste en §Antes de tocar nada más 8 tests y 0 suites. Las nueve, 220 de
   220. Declara el delta en el reporte.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/127_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint` de los catorce ficheros, sin pipe, da `exit=0`:

   ```bash
   bunx eslint "src/app/(auth)/login.tsx" "src/app/(auth)/forgot.tsx" "src/app/(auth)/register.tsx" src/screens/reset-password/index.tsx src/screens/health/index.tsx src/components/pet-hero-header.tsx src/screens/reminders/index.tsx "src/app/(auth)/__tests__/login.test.tsx" "src/app/(auth)/__tests__/forgot.test.tsx" "src/app/(auth)/__tests__/register.test.tsx" src/screens/reset-password/index.test.tsx src/screens/health/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/screens/reminders/index.test.tsx > /tmp/127_lint.log 2>&1; echo "exit=$?"
   ```

4. Las cifras de candado, con `grep -c`, de la base al final:

   | Test | `^describe(` | `#127 R` | `#128 R4` | `props.className` | `.toBe(` | `toStrictEqual` | `pressable-feedback__root` | `within(` |
   |---|---|---|---|---|---|---|---|---|
   | login | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 2 → 3 | 0 → 0 | 0 → 1 | 0 → 0 |
   | forgot | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 2 → 3 | 0 → 0 | 0 → 1 | 0 → 0 |
   | register | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 1 → 2 | 0 → 0 | 0 → 1 | 0 → 0 |
   | reset-password | 4 → 5 | 0 → 1 | 0 → 0 | 0 → 1 | 4 → 5 | 0 → 0 | 0 → 1 | 0 → 0 |
   | salud | 7 → 8 | 0 → 1 | 0 → 0 | 3 → 4 | 3 → 4 | 0 → 0 | 0 → 0 | 1 → 1 |
   | hero | 7 → 8 | 0 → 1 | 0 → 0 | 10 → 11 | 12 → 13 | 0 → 1 | 0 → 0 | 11 → 11 |
   | recordatorios | 11 → 13 | 0 → 1 | 0 → 1 | 8 → 10 | 5 → 7 | 0 → 1 | 0 → 1 | 19 → 20 |

   Además, en cada test, `grep -c "#127"` da lo mismo que `grep -c "#127 R"`,
   y `grep -c "#128"` lo mismo que `grep -c "#128 R4"`: ningún id suelto. En
   recordatorios, `grep -c "Eliminar"` pasa de 1 a 3. En los siete,
   `grep -ciE "stylesheet|text-\[10px\]|use-api|useapi"` da lo mismo en la base
   y al final.
5. Desde la raíz del repo, con el `H0` que anotaste al arrancar:
   - `git diff --stat H0 HEAD` lista **solo** diez ficheros: los siete tests
     (189 líneas añadidas y 0 borradas entre los siete), `docs/conventions.md`
     (+12 / −3), `progress/impl_mobile-classnames-own-tag-tree-lock.md` y
     `specs/mobile-classnames-own-tag-tree-lock/traceability.md`. Si sale otro,
     **para**;
   - `git diff --exit-code origin/main...HEAD -- "mobile-pet-tracker/src/app/(auth)/login.tsx" "mobile-pet-tracker/src/app/(auth)/forgot.tsx" "mobile-pet-tracker/src/app/(auth)/register.tsx" mobile-pet-tracker/src/screens/reset-password/index.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts`
     da 0;
   - cada test de base es un prefijo exacto del final (R6.3). Para cada uno de
     los siete, con su ruta entre comillas en `T`:

     ```bash
     T="mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx"
     git show "H0:$T" | cmp -n "$(git show "H0:$T" | wc -c)" - "$T"; echo "exit=$?"
     ```

     da `exit=0` las siete veces (con el hash de `H0` en lugar de `H0`).
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | los siete ficheros de producción | los de base (§Antes de tocar nada, paso 5) |
   | `src/app/(auth)/__tests__/login.test.tsx` | `9cf126af385d8472ce4930088d8b12025a24dc4d` |
   | `src/app/(auth)/__tests__/forgot.test.tsx` | `d407cbe0a48c0f885d36273941964869cecd0099` |
   | `src/app/(auth)/__tests__/register.test.tsx` | `dca8649f909cb12ea3806b69743d1cdace9105bb` |
   | `src/screens/reset-password/index.test.tsx` | `1a2ea572443f026ea8b497b3453b7f0b9e86a030` |
   | `src/screens/health/index.test.tsx` | `c1f95aca46b4bdeff4c8fde59398caf68cf403c1` |
   | `src/components/__tests__/pet-hero-header.test.tsx` | `3642ba3dedb67a57859c3da039889ee6427551b1` |
   | `src/screens/reminders/index.test.tsx` | `1f6fa07ed92e45126f13cf09aa915dd4353dc428` |
   | `docs/conventions.md` (desde la raíz) | `c34410e2fa7eb848ccb58d83208399b8c7bb37b0` |
   | `src/__tests__/consistency-classnames.test.ts`, `legibility-classnames.test.ts` y `ui-language.test.ts` | los de base |

7. Escribe `progress/impl_mobile-classnames-own-tag-tree-lock.md` con:
   - la base medida y el delta;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos
     con su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de este cierre.

   Rellena los hashes en [[traceability]]. La fila de R5 cita el commit de R5.
   La de R6 cita el commit de R5, que es el último commit con cambios fuera
   de `progress/` y `specs/`, y no el de este commit. Commitea solo esos dos
   ficheros:

   ```bash
   git add progress/impl_mobile-classnames-own-tag-tree-lock.md specs/mobile-classnames-own-tag-tree-lock/traceability.md
   git commit -m "docs(mobile): record the own-tag tree lock evidence (R1,R2,R3,R4,R5,R6)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- Los siete ficheros de producción, salvo en los cuatro commits rojos, y
  siempre revertidos en el verde siguiente.
- Los `describe` previos de los siete tests, sus helpers y mocks (`renderLogin`,
  `renderRegister`, `renderRoute`, `renderHealth`, `renderHero`,
  `renderReminders`, `confirmDelete`, `makeReminder`, `makePet`, `pending`,
  `AuthScreenWrapper`, la sustitución de `Skeleton` del hero y el resto), y
  sus imports. En particular, no cambies el `toContain('bg-danger')` de
  `confirmDelete`.
- `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/legibility-classnames.test.ts` y
  `src/__tests__/ui-language.test.ts`.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- De `docs/conventions.md`, todo lo que no sean las dos sustituciones de R5.
- Los ficheros de #60 (`feature/60-mobile-ios-support`): `src/screens/add-pet/*`,
  `src/screens/profile/*`, `src/screens/map/*`, `src/components/pet-map.tsx` y
  su test, `app.json`, `app.config.ts`, `app.config.test.ts` y
  `src/__tests__/hosting-artifacts.test.ts`.
- `feature_list.json`, `progress/current.md`, `progress/history.md` y
  `STATUS.md`: son del `leader`.
- El puntero `specs/mobile-delete-confirm-label-tree-lock/requirements.md`.
