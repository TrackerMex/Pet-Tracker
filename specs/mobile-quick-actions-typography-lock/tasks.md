---
feature: "mobile-quick-actions-typography-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Tareas — [[mobile-quick-actions-typography-lock]] (#81)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 a R6 se escriben sobre código que ya cumple, así que su
> rojo es una **mutación de producción versionada** en el commit rojo, que el
> verde revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo: la sección, la fila, los
> tres tiles, sus iconos y sus etiquetas ya existen en la base, y el `describe`
> de #81 lo crea R1 antes de que R2 a R6 le añadan un `it`.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita. «La Home» es `src/screens/home/index.tsx` y «el test» es
> `src/screens/home/index.test.tsx`. Ninguna ruta de esta feature lleva
> paréntesis.

## Antes de tocar nada

1. `git branch --show-current` da `feature/81-mobile-quick-actions-typography-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu sandbox lo
   deniega (#121).
4. Carga la skill `building-native-ui` de tu plugin `expo`. Esta feature no
   cambia UI: todo lo que necesitas está escrito aquí. Todo se corre con `bun` y
   `bunx`, nunca con `npm` ni `npx`. No instales nada. No corras `./init.sh` ni
   los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `ff591a1f567e00c0aee57db29ca1706b3a925cad` |
   | `src/screens/home/index.test.tsx` | `234bd11772b8c1c8dce1782c620ae1a5e0c53368` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas de
   esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/81_home.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/81_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/81_home.log /tmp/81_full.log
   ```

   Esperado: el test da 159 passed de 159, `exit=0`. La suite da 86 passed de
   86 suites, 1597 passed de 1597 tests y 1 snapshot, `exit=0`. Si la suite da
   otra cifra con `exit=0` (por ejemplo, porque #132 mergeó antes), **anota la
   medida** y úsala como base: el delta exigido es +7 tests y +0 suites sobre lo
   medido, y los «N failed de M» de los rojos se desplazan igual. Nunca pongas
   `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería el del último
   comando. En el log de la suite aparecen bloques `● Console` (33 en la base).
   Son ruido y no cuentan como fallo. Si el resumen final repite un `it` rojo,
   es el mismo rojo: los rojos se cuentan por la línea `Tests:`.
7. **Reglas de literales en el test**, comentarios incluidos, por
   `src/__tests__/design-drift.test.ts` (`#68 R18`, `#69 R13`, `#71 R13`,
   `#70 R17` y `#85 R12` escanean el test):
   - la cita de la feature va siempre como `#81 R<n>`, nunca `#81` suelto;
   - ni `StyleSheet` ni `text-[10px]` ni ningún `-[` (clase arbitraria), en
     ningún caso, tampoco en un comentario;
   - ningún color hexadecimal.
8. **Los esperados son literales.** Clases, `testID`, etiquetas y el objeto
   de `style` van escritos a mano, como en los bloques de abajo. No añadas
   ningún import al test ni leas nada de la Home ni de
   `src/theme/native-styles.ts`.

## R1 — La etiqueta de cada tile lleva la receta entera y ningún estilo

### (1) Rojo

1. En el test, justo **antes** de
   `describe('#85 R1: la sección recupera su rótulo en los dos idiomas'`
   (`grep -c "describe('#85 R1: la sección recupera su rótulo en los dos idiomas'" src/screens/home/index.test.tsx`
   da 1), y por tanto justo después del `});` y la línea en blanco que cierran
   `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'`, añade
   este bloque seguido de **una** línea en blanco:

   ```tsx
   describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado', () => {
     beforeEach(() => {
       jest.clearAllMocks();
       process.env.EXPO_PUBLIC_API_URL = apiUrl;
       mockUseAuth.mockReturnValue({
         status: 'authenticated',
         token: 'jwt-token',
         signIn: jest.fn(),
         signOut: jest.fn(),
       } satisfies AuthContextValue);
       const pet = makePet();
       mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
       mockGetPet.mockResolvedValue({ kind: 'ok', pet });
       mockGetDailyActivity.mockResolvedValue({
         kind: 'ok',
         days: [makeDay()],
         weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
       });
     });

     afterEach(() => {
       jest.restoreAllMocks();
     });

     it('#81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea', async () => {
       await renderHome();
       await screen.findByTestId('quick-action-weight');

       for (const [testID, label] of [
         ['quick-action-weight', 'Peso'],
         ['quick-action-reminder', 'Recordatorio'],
         ['quick-action-documents', 'Documentos'],
       ] as const) {
         const labelNode = within(screen.getByTestId(testID)).getByText(label);

         // #81 R1: the whole class list with toBe, because toContain lets a
         // contradicting token such as font-bold through.
         expect(labelNode.props.className).toBe(
           'text-2xs font-semibold text-foreground',
         );
         expect(labelNode.props.style).toBeUndefined();
       }
     });
   });
   ```

   El `beforeEach` y el `afterEach` son copia de los de
   `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'`. Todo lo
   que usan (`apiUrl`, `mockUseAuth`, `AuthContextValue`, `makePet`,
   `mockListPets`, `mockGetPet`, `mockGetDailyActivity`, `makeDay`,
   `renderHome`, `screen`, `within`, `waitFor`) ya está declarado o importado
   en el test.

   El test da el blob `43d730778af0a46289e1eec34b8f402ace525fe6`.
2. **La mutación `a1`**, en la Home: la línea
   `<Text className="text-2xs font-semibold text-foreground">` (es la etiqueta
   del tile; `grep -cF '<Text className="text-2xs font-semibold text-foreground">'`
   da 1) pasa a `<Text className="text-xs font-medium text-foreground">`, con
   la misma sangría.

   La Home da el blob `f06c0fc6a3cce9b78ad5187780fee37d75d667d4`.
3. El test da `exit=1`: 1 failed y 159 passed de 160.
4. La suite da `exit=1`: 1 failed y 1597 passed de 1598; 1 suite failed y 85
   passed de 86; 1 snapshot passed. El **único** rojo es
   `#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado › #81 R1: cada etiqueta lleva la receta entera y ningún estilo en línea`,
   por `expect(received).toBe(expected)`. Si falla otro test, o este falla por
   otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick action label recipe with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
   La Home vuelve a `ff591a1f567e00c0aee57db29ca1706b3a925cad`.
2. El test da 160 de 160, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick action label recipe (R1)"
   ```

### (3) Refactor

Ninguno. La tabla de los tres tiles se repite en R1, R2 y R5 a propósito: cada
`it` lleva sus literales y se lee solo. No la extraigas a una constante.

## Cómo se añaden R2 a R6

Cada `it` de R2 a R6 va **dentro** del `describe` de #81, al final: justo
antes del `});` que lo cierra, que es la línea que va seguida de una línea en
blanco y de `describe('#85 R1: la sección recupera su rótulo en los dos idiomas'`.
Deja una línea en blanco entre el `});` del `it` anterior y el nuevo `it`.
Los bloques de abajo van con la sangría del fichero (dos espacios para el
`it`). Después de pegar, el blob del test tiene que ser el que se da. Si no,
el pegado no es el de la spec: corrígelo antes de seguir.

## R2 — Cada tile tiene dos hijos, el icono arriba y la etiqueta debajo

### (1) Rojo

1. Añade este `it`:

   ```tsx
     it('#81 R2: cada tile tiene dos hijos, el icono arriba y la etiqueta debajo', async () => {
       await renderHome();
       await screen.findByTestId('quick-action-weight');

       for (const [testID, iconTestID, label] of [
         ['quick-action-weight', 'icon-weight', 'Peso'],
         ['quick-action-reminder', 'icon-calendar-plus', 'Recordatorio'],
         ['quick-action-documents', 'icon-file-text', 'Documentos'],
       ] as const) {
         const tile = screen.getByTestId(testID);

         // #81 R2: counted by children, so a wrapper or a third child turns red.
         expect(tile.children).toHaveLength(2);
         expect(tile.children[0]).toHaveProperty('props.testID', iconTestID);
         expect(tile.children[1]).toBe(within(tile).getByText(label));
         expect(tile.props.className).not.toMatch(
           /(?:^|\s)flex-(?:row|row-reverse|col-reverse)(?:\s|$)/,
         );
       }
     });
   ```

   El test da el blob `89ee0a77c30c2f9b9ff08f71ac2227b200c918a7`.
2. **La mutación `b`**, en la Home: el icono y la etiqueta del tile cambian
   de sitio. Estas cuatro líneas (20 espacios de sangría las de los extremos):

   ```tsx
                       <Icon size={24} color={quickActionInks[index]} />
                       <Text className="text-2xs font-semibold text-foreground">
                         {t(labelKey)}
                       </Text>
   ```

   pasan a:

   ```tsx
                       <Text className="text-2xs font-semibold text-foreground">
                         {t(labelKey)}
                       </Text>
                       <Icon size={24} color={quickActionInks[index]} />
   ```

   La Home da el blob `dcf0a26c89c404bbe9fda75036db221d802f229a`.
3. El test da `exit=1`: 1 failed y 160 passed de 161.
4. La suite da `exit=1`: 1 failed y 1598 passed de 1599; 1 suite failed. El
   **único** rojo es
   `#81 R1-R6: … › #81 R2: cada tile tiene dos hijos, el icono arriba y la etiqueta debajo`,
   por `expect(received).toHaveProperty(path, value)`. Si falla otro test, o
   este falla por otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick action tile anatomy with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
   La Home vuelve a su blob de base.
2. El test da 161 de 161, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick action tile anatomy (R2)"
   ```

### (3) Refactor

Ninguno. La expresión regular de la dirección se queda en línea: solo la usa
este `it`.

## R3 — Cada tile lleva `rounded-xl` como único radio y la esquina continua

### (1) Rojo

1. Añade este `it`:

   ```tsx
     it('#81 R3: cada tile lleva rounded-xl como único radio y la esquina continua', async () => {
       await renderHome();
       await screen.findByTestId('quick-action-weight');

       for (const testID of [
         'quick-action-weight',
         'quick-action-reminder',
         'quick-action-documents',
       ]) {
         const tile = screen.getByTestId(testID);

         expect(
           tile.props.className
             .split(' ')
             .filter((token: string) => /^rounded(?:-|$)/.test(token)),
         ).toEqual(['rounded-xl']);
         expect(tile.props.style).toEqual({ borderCurve: 'continuous' });
       }
     });
   ```

   El test da el blob `9f4470481b19949e85c880f30c3ad952e61a97e0`.
2. **La mutación `e6`**, en la Home: en el `className` del tile,
   ``className={`min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 ${CATEGORY_SLOTS[slot].surface}`}``
   (`grep -cF 'rounded-xl py-3'` da 1), `rounded-xl` pasa a `rounded-card`. El
   resto de la línea no cambia.

   La Home da el blob `da4a57bf7bd6db8d46435700f98f51cf195acd3c`.
3. El test da `exit=1`: 1 failed y 161 passed de 162.
4. La suite da `exit=1`: 1 failed y 1599 passed de 1600; 1 suite failed. El
   **único** rojo es
   `#81 R1-R6: … › #81 R3: cada tile lleva rounded-xl como único radio y la esquina continua`,
   por `expect(received).toEqual(expected)`. Si falla otro test, o este falla
   por otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick action tile radius with a versioned mutation (R3)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
2. El test da 162 de 162, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick action tile radius and continuous corner (R3)"
   ```

### (3) Refactor

Ninguno. El `{ borderCurve: 'continuous' }` es un literal del test: **no**
importes `CONTINUOUS_CORNER` (un esperado importado de producción no ve el
cambio de su propio valor).

## R4 — La sección y la fila, con sus hijos, su orden y su forma

### (1) Rojo

1. Añade este `it`:

   ```tsx
     it('#81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio', async () => {
       await renderHome();
       const quickActions = await screen.findByTestId('quick-actions');
       const title = within(quickActions).getByTestId('quick-actions-title');
       const tileRow = within(quickActions).getByTestId('quick-actions-row');

       expect(quickActions.children).toHaveLength(2);
       expect(quickActions.children[0]).toHaveProperty(
         'props.testID',
         'quick-actions-title',
       );
       expect(quickActions.children[1]).toHaveProperty(
         'props.testID',
         'quick-actions-row',
       );
       expect(quickActions.props.className).toBe('gap-3');
       expect(quickActions.props.style).toBeUndefined();
       expect(title.props.style).toBeUndefined();
       // #81 R4: the tiles by children, so a wrapper around a tile turns red.
       expect(
         tileRow.children.map((child) =>
           typeof child === 'string' ? child : child.props.testID,
         ),
       ).toEqual([
         'quick-action-weight',
         'quick-action-reminder',
         'quick-action-documents',
       ]);
       expect(tileRow.props.className).toBe('flex-row gap-3');
       expect(tileRow.props.style).toBeUndefined();
     });
   ```

   El test da el blob `48b550b4c81ca6a3b1bbf235ce2b5e7bec9a28d6`.
2. **La mutación `e4`**, en la Home: `<View testID="quick-actions" className="gap-3">`
   (`grep -cF` da 1) pasa a `<View testID="quick-actions" className="gap-2">`.

   La Home da el blob `973320c26ec1695de9e944bc16dedbf7711c635c`.
3. El test da `exit=1`: 1 failed y 162 passed de 163.
4. La suite da `exit=1`: 1 failed y 1600 passed de 1601; 1 suite failed. El
   **único** rojo es
   `#81 R1-R6: … › #81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio`,
   por `expect(received).toBe(expected)`. Si falla otro test, o este falla por
   otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick actions section and row with a versioned mutation (R4)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
2. El test da 163 de 163, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick actions section and row (R4)"
   ```

### (3) Refactor

Ninguno. El `typeof child === 'string'` está porque `children` de un host
de RNTL puede traer texto suelto; aquí no lo trae, y así el `toEqual` enseña
el texto si algún día aparece.

## R5 — Cada tile se anuncia con su propia etiqueta visible

### (1) Rojo

1. Añade este `it`:

   ```tsx
     it('#81 R5: cada tile se anuncia con su propia etiqueta visible', async () => {
       await renderHome();
       await screen.findByTestId('quick-action-weight');

       for (const [testID, label] of [
         ['quick-action-weight', 'Peso'],
         ['quick-action-reminder', 'Recordatorio'],
         ['quick-action-documents', 'Documentos'],
       ] as const) {
         expect(screen.getByTestId(testID)).toHaveAccessibleName(label);
       }
     });
   ```

   El test da el blob `0c5b27f59b9508114fd7feabc068169a7ebb088d`.
2. **La mutación `e7`**, en la Home: justo debajo de la línea
   `                    accessibilityRole="button"` del tile (20 espacios; es la
   que va justo encima de ``className={`min-h-11``, que aparece una vez), la
   línea:

   ```tsx
                       accessibilityLabel={t(QUICK_ACTIONS[(index + 1) % 3].labelKey)}
   ```

   con la misma sangría de 20 espacios. Cada tile se anuncia con la etiqueta
   del siguiente.

   La Home da el blob `edc0d24cde0bca7a9351314f701a945bc6587ac5`.
3. El test da `exit=1`: 1 failed y 163 passed de 164.
4. La suite da `exit=1`: 1 failed y 1601 passed de 1602; 1 suite failed. El
   **único** rojo es
   `#81 R1-R6: … › #81 R5: cada tile se anuncia con su propia etiqueta visible`,
   por `expect(instance).toHaveAccessibleName()`. Si falla otro test, o este
   falla por otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick action accessible names with a versioned mutation (R5)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
2. El test da 164 de 164, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick action accessible names (R5)"
   ```

### (3) Refactor

Ninguno.

## R6 — La rejilla no depende del detalle ni de la actividad

### (1) Rojo

1. Añade estos dos `it`, en este orden:

   ```tsx
     it('#81 R6: dibuja los tres tiles aunque el detalle de la mascota falle', async () => {
       mockGetPet.mockResolvedValue({ kind: 'unreachable', message: 'network down' });

       await renderHome();
       await screen.findByTestId('pet-hero-error');

       expect(screen.getByTestId('quick-actions-row').children).toHaveLength(3);
     });

     it('#81 R6: dibuja los tres tiles aunque la actividad semanal falle', async () => {
       mockGetDailyActivity.mockResolvedValue({ kind: 'error' });

       await renderHome();
       await waitFor(() =>
         expect(screen.getByTestId('summary-note')).toHaveTextContent(
           'No se pudo cargar la actividad',
         ),
       );

       expect(screen.getByTestId('quick-actions-row').children).toHaveLength(3);
     });
   ```

   La espera de cada uno es la que ya usa el test para ese mismo error:
   `pet-hero-error` en
   `pinta un guion y la nota cuando el perfil tampoco resuelve`, y el
   `waitFor` sobre `summary-note` en
   `degrades an activity error without breaking the dashboard`. No la cambies
   por un `findByTestId('quick-actions-row')`: con la sección condicionada,
   la espera no llegaría a la aserción y el rojo cambiaría de causa.

   El test da el blob `f91c8971e21198c4a65eebf0e40aaf35f0ac6472`, que es el
   final.
2. **La mutación `m6_both`**, en la Home: la línea `        {selectedPetId ? (`
   (8 espacios) de justo encima de
   `          <View testID="quick-actions" className="gap-3">` pasa a:

   ```tsx
           {selectedPetId && detail.data?.kind === 'ok' && activity.data?.kind === 'ok' ? (
   ```

   `{selectedPetId ? (` aparece tres veces en la Home: la que se muta es
   **solo** la de la rejilla.

   La Home da el blob `256e5a7e4df4fbfc350474f3ac995ee1ddefb192`.
3. El test da `exit=1`: 2 failed y 164 passed de 166.
4. La suite da `exit=1`: 2 failed y 1602 passed de 1604; 1 suite failed. Los
   **únicos** rojos son los dos `it` de R6, los dos **por consulta**:
   `Unable to find an element with testID: quick-actions-row`. Si falla otro
   test, o alguno de estos falla por otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): expose the quick actions render condition with a versioned mutation (R6)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/index.tsx`.
   La Home vuelve a `ff591a1f567e00c0aee57db29ca1706b3a925cad`.
2. El test da 166 de 166, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "test(mobile): lock the quick actions render on detail and activity errors (R6)"
   ```

### (3) Refactor

Ninguno. Los dos escenarios se quedan en dos `it`: un fallo tiene que decir
cuál de las dos dependencias se coló.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la Home.
2. Comprueba con `git hash-object src/screens/home/index.tsx` que la Home
   mutada da el blob de la tabla. Si no coincide, la mutación no es la de la
   spec: corrígela antes de medir.
3. Corre la suite completa, sin pipe: `bunx jest > /tmp/81_probe.log 2>&1; echo "exit=$?"`.
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su error**:
   `expect(received).<matcher>` o `expect(instance).<matcher>` es un rojo **por
   aserción**, y `Unable to find an element with testID: …` es un rojo **por
   consulta**.
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
   (desde la raíz). **Nunca** con `git checkout <commit> --`, que deja la
   mutación en el índice.
6. `git status --porcelain -- mobile-pet-tracker` sale vacío y
   `git diff --cached --name-only` sale vacío. Si no, **para**.

**Nada de esto se commitea.** No uses `git stash` ni `rm -f`. La tabla medida
va al reporte, con la columna «medido» rellena por ti.

Convenciones de la tabla:

- «La etiqueta» es la línea
  `                    <Text className="text-2xs font-semibold text-foreground">`
  (20 espacios). «El icono» es
  `                    <Icon size={24} color={quickActionInks[index]} />`.
  «El `className` del tile» es
  ``className={`min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 ${CATEGORY_SLOTS[slot].surface}`}``.
  «El rol del tile» es la línea `                    accessibilityRole="button"`
  de justo encima del `className` del tile. «El `style` del tile» es la línea
  `                    style={CONTINUOUS_CORNER}` de justo encima de
  `                    onPress={() => router.push(href(selectedPetId))}`.
  «La cabecera del map» son las dos líneas
  `                ({ testID, Icon, labelKey, slot, href }, index) => (` y
  `                  <Pressable`. «La condición de la sección» es la línea
  `        {selectedPetId ? (` de justo encima de
  `          <View testID="quick-actions" className="gap-3">`. Todas aparecen
  una sola vez.
- «Los cuatro hijos» son el icono y las tres líneas de la etiqueta
  (`<Text …>`, `{t(labelKey)}` y `</Text>`).
- `R1` a `R5` son los `it` de #81 del mismo número. «R6 detalle» y
  «R6 actividad» son los dos `it` de R6. «#71 iconos» es
  `#71 R1: la Home dibuja la rejilla de accesos rápidos › usa iconos de reicon y ningún emoji`.
  «#62 R14» es
  `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 2 esquinas`
  y «#98 R10» es
  `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`.
- En las mutaciones de un solo tile, `N` es el índice del tile en
  `QUICK_ACTIONS` (0 peso, 1 recordatorio, 2 documentos).
- «Hoy» es la misma mutación sobre la base (1597 tests). Va para que el
  `reviewer` vea qué hueco cierra cada candado. «Exigido» es sobre el árbol
  final (1604 tests). Si tu base medida fue otra, las cuentas se desplazan
  igual, pero los `it` rojos no.

### Receta de la etiqueta (R1)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `a1` | la etiqueta pasa a `<Text className="text-xs font-medium text-foreground">` (es la de R1) | `f06c0fc6` | verde | rojo 1: R1, por `toBe` |
| `a2_0` | la etiqueta pasa a `<Text className={index === 0 ? "text-xs font-medium text-foreground" : "text-2xs font-semibold text-foreground"}>` | `b7634b48` | verde | rojo 1: R1, por `toBe` |
| `a2_1` | igual que `a2_0` con `index === 1` | `42af737b` | verde | rojo 1: R1, por `toBe` |
| `a2` | igual que `a2_0` con `index === 2` | `b442f74b` | verde | rojo 1: R1, por `toBe` |
| `m1_bold` | la etiqueta pasa a `<Text className="text-2xs font-semibold text-foreground font-bold">` | `68b9cee1` | verde | rojo 1: R1, por `toBe` |
| `m1_style` | la etiqueta pasa a `<Text className="text-2xs font-semibold text-foreground" style={{ fontWeight: '500' }}>` | `58a8fc9c` | verde | rojo 1: R1, por `toBeUndefined` |

### Anatomía, orden y dirección del tile (R2)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `b` | los cuatro hijos cambian de sitio: la etiqueta arriba y el icono debajo (es la de R2) | `dcf0a26c` | verde | rojo 1: R2, por `toHaveProperty` |
| `m2_swap0` | los cuatro hijos pasan al bloque de abajo, con `index === 0` | `47ff75d9` | verde | rojo 1: R2, por `toHaveProperty` |
| `m2_swap1` | el mismo bloque con `index === 1` | `8f68cc00` | verde | rojo 1: R2, por `toHaveProperty` |
| `m2_swap2` | el mismo bloque con `index === 2` | `94a10201` | verde | rojo 1: R2, por `toHaveProperty` |
| `c` | debajo del `</Text>` de la etiqueta, `                    <Pressable onPress={() => router.push('/pairing')} />` (W4) | `3756aa24` | verde | rojo 1: R2, por `toHaveLength` |
| `e9` | encima del icono, `                    <View>`; debajo del `</Text>` de la etiqueta, `                    </View>` | `ec1607ed` | verde | rojo 1: R2, por `toHaveLength` |
| `e1` | en el `className` del tile, `flex-1 ` pasa a `flex-1 flex-row ` | `0a518dd4` | verde | rojo 1: R2, por `not.toMatch` |
| `e2` | en el `className` del tile, `flex-1 ` pasa a `flex-1 flex-col-reverse ` | `099f125e` | verde | rojo 1: R2, por `not.toMatch` |

El bloque de `m2_swap0` sustituye los cuatro hijos (con `N` = 0, 1 o 2):

```tsx
                    {[
                      <Icon size={24} key="icon" color={quickActionInks[index]} />,
                      <Text key="label" className="text-2xs font-semibold text-foreground">
                        {t(labelKey)}
                      </Text>,
                    ][index === N ? 'reverse' : 'slice']()}
```

### Radio y esquina del tile (R3)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `e6` | en el `className` del tile, `rounded-xl` pasa a `rounded-card` (es la de R3) | `da4a57bf` | verde | rojo 1: R3, por `toEqual` |
| `m3_round0` | en el `className` del tile, `rounded-xl` pasa a `${index === 0 ? 'rounded-card' : 'rounded-xl'}` | `f361f5ab` | verde | rojo 1: R3, por `toEqual` |
| `m3_round1` | igual con `index === 1` | `255a6f60` | verde | rojo 1: R3, por `toEqual` |
| `m3_round2` | igual con `index === 2` | `63b6ac47` | verde | rojo 1: R3, por `toEqual` |
| `e12_0` | debajo del `style` del tile, `                    {...(index === 0 ? { style: undefined } : {})}` | `1d64dccb` | verde | rojo 1: R3, por `toEqual` |
| `e12_1` | igual con `index === 1` | `510f37d2` | verde | rojo 1: R3, por `toEqual` |
| `e12` | igual con `index === 2` | `27096ee5` | verde | rojo 1: R3, por `toEqual` |
| `e1_style` | debajo del `style` del tile, `                    {...(index === 0 ? { style: [CONTINUOUS_CORNER, { flexDirection: 'row' }] } : {})}` | `8ecab48b` | verde | rojo 1: R3, por `toEqual` |
| `e11` | se borra el `style` del tile | `82c9a371` | rojo 2: #62 R14 y #98 R10, por `toHaveLength` | rojo 3: #62 R14, #98 R10 y R3 (`toEqual`) |

### Sección y fila (R4)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `e4` | `<View testID="quick-actions" className="gap-3">` pasa a `<View testID="quick-actions" className="gap-2">` (es la de R4) | `973320c2` | verde | rojo 1: R4, por `toBe` |
| `m4_style` | la misma línea pasa a `<View testID="quick-actions" className="gap-3" style={{ gap: 8 }}>` | `84413123` | verde | rojo 1: R4, por `toBeUndefined` |
| `m4_title_style` | debajo de `              className="text-xs font-semibold uppercase tracking-widest text-muted"` (la del rótulo), `              style={{ fontWeight: '500' }}` | `19959244` | verde | rojo 1: R4, por `toBeUndefined` |
| `e3` | el bloque de la fila, de `            <View testID="quick-actions-row" className="flex-row gap-3">` a su `            </View>` (12 espacios), sube encima del `            <Text` del rótulo | `5d30cc6f` | verde | rojo 1: R4, por `toHaveProperty` |
| `e5` | `<View testID="quick-actions-row" className="flex-row gap-3">` pasa a `<View testID="quick-actions-row" className="flex-row gap-2">` | `1ccce1af` | verde | rojo 1: R4, por `toBe` |
| `e5b` | la misma línea pasa a `<View testID="quick-actions-row" className="flex-col gap-3">` | `17672615` | verde | rojo 1: R4, por `toBe` |
| `e13` | entre las dos líneas de la cabecera del map, `                  <View key={testID}>`; y entre `                  </Pressable>` y `                ),` de justo debajo, `                  </View>` | `51c2ebef` | verde | rojo 1: R4, por `toEqual` |

### Nombre accesible (R5)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `e7` | debajo del rol del tile, `                    accessibilityLabel={t(QUICK_ACTIONS[(index + 1) % 3].labelKey)}` (es la de R5) | `edc0d24c` | verde | rojo 1: R5, por `toHaveAccessibleName` |
| `m5_aria` | debajo del rol del tile, `                    aria-label={t(QUICK_ACTIONS[(index + 1) % 3].labelKey)}` | `b753817a` | verde | rojo 1: R5, por `toHaveAccessibleName` |
| `m5_one` | debajo del rol del tile, `                    accessibilityLabel={index === 0 ? t(QUICK_ACTIONS[2].labelKey) : undefined}` | `3b68e154` | verde | rojo 1: R5, por `toHaveAccessibleName` |
| `m5_one_1` | igual con `index === 1 ? t(QUICK_ACTIONS[0].labelKey)` | `3f3cce41` | verde | rojo 1: R5, por `toHaveAccessibleName` (no validada en spec) |
| `m5_one_2` | igual con `index === 2 ? t(QUICK_ACTIONS[0].labelKey)` | `273bf0e0` | verde | rojo 1: R5, por `toHaveAccessibleName` (no validada en spec) |

### Condición de render (R6)

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `m6_both` | la condición de la sección pasa a `        {selectedPetId && detail.data?.kind === 'ok' && activity.data?.kind === 'ok' ? (` (es la de R6) | `256e5a7e` | verde | rojo 2: R6 detalle y R6 actividad, **por consulta** |
| `e8` | la condición de la sección pasa a `        {selectedPetId && detail.data?.kind === 'ok' ? (` | `d3859b80` | verde | rojo 1: R6 detalle, **por consulta** (no validada en spec) |
| `e8b` | la condición de la sección pasa a `        {selectedPetId && activity.data?.kind === 'ok' ? (` | `68da26f5` | verde | rojo 1: R6 actividad, **por consulta** (no validada en spec) |
| `m6_tile` | la cabecera del map pasa al bloque de abajo, con la condición `index === 2 && detail.data?.kind !== 'ok'` | `52f85dfc` | verde | rojo, con R6 detalle por `toHaveLength` entre los rojos (no validada en spec) |
| `m6_tile0` | el mismo bloque con `index === 0 && (detail.data?.kind !== 'ok' \|\| activity.data?.kind !== 'ok')` | `0d0159ab` | verde | rojo, con R6 detalle y R6 actividad por `toHaveLength` entre los rojos (no validada en spec) |
| `m6_tile1` | igual con `index === 1` | `cd0f6a17` | rojo 1 **por la espera, no por un candado**: `#71 R1 › dibuja el rótulo y los tres tiles en orden`, por `toEqual` | rojo, con R6 detalle y R6 actividad por `toHaveLength` entre los rojos (no validada en spec) |
| `m6_tile2` | igual con `index === 2` | `e6fee5b7` | rojo 1 **por la espera, no por un candado**: `#71 R1 › usa iconos de reicon y ningún emoji`, por consulta (`quick-action-documents`) | rojo, con R6 detalle y R6 actividad por `toHaveLength` entre los rojos (no validada en spec) |

El bloque de `m6_tile` sustituye la cabecera del map (con `<condición>` la de
la fila):

```tsx
                ({ testID, Icon, labelKey, slot, href }, index) =>
                  <condición> ? null : (
                  <Pressable
```

### Ya cerradas o libres a propósito

| Sonda | Mutación | Blob | Hoy | Exigido tras #81 |
|---|---|---|---|---|
| `d` | el icono pasa a `                    <Icon size={28} color={quickActionInks[index]} />` | `039360a9` | rojo 1: #71 iconos, por `toHaveLength` | igual: ningún `it` de #81 |
| `e10` | en el `className` del tile, `items-center gap-1.5 rounded-xl py-3` pasa a `rounded-xl` | `72cfc47c` | verde | **verde**, 1604/1604: libre por decisión ([[design]]) |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

Las filas marcadas «no validada en spec» no se midieron contra el test
prototipo al escribir la spec. Su «Exigido» es un mínimo: los `it` que nombra
tienen que estar entre los rojos, y cualquier rojo de más se anota en el
reporte sin parar. Hoy, `m6_tile1` y `m6_tile2` ya dan rojo en #71 solo porque
sus `it` esperan al tile 0 y aseveran mientras la actividad sigue cargando.
Tras #81 pueden sumar rojos por consulta en los `it` de R1 a R5, que esperan
igual. Eso no es un fallo de la spec: anótalos.

## R7 — Cierre

1. Suite completa, sin pipe: 86 suites / 1604 tests / 1 snapshot, `exit=0`, o
   la base que mediste en §Antes de tocar nada más 7 tests y 0 suites. El
   test, 166 de 166. Los doce `it` de
   `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'`, verdes.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/81_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx > /tmp/81_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado, que no se mueven salvo las tres del test que dice la
   lista:
   - `grep -cF "style={CONTINUOUS_CORNER}" src/screens/home/index.tsx` da 2;
   - `grep -cF "{QUICK_ACTIONS.map(" src/screens/home/index.tsx` da 1;
   - `grep -cF "<Icon size={24}" src/screens/home/index.tsx` da 1;
   - `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/index.tsx src/screens/home/index.test.tsx`
     da 0 en los dos;
   - `grep -c -- "-\[" src/screens/home/index.test.tsx` da 0;
   - `grep -c "^describe(" src/screens/home/index.test.tsx` pasa de 40 a 41;
   - `grep -c "^describe('#81 R" src/screens/home/index.test.tsx` da 1;
   - `grep -c "#81" src/screens/home/index.test.tsx` y
     `grep -c "#81 R[1-6]" src/screens/home/index.test.tsx` dan 11 los dos:
     el título del `describe`, siete títulos de `it` y tres comentarios.
     Ningún `#81` suelto;
   - `grep -c "quick-actions-row" src/screens/home/index.test.tsx` pasa de 1
     a 5.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `ff591a1f567e00c0aee57db29ca1706b3a925cad` (el de base) |
   | `src/screens/home/index.test.tsx` | `f91c8971e21198c4a65eebf0e40aaf35f0ac6472` |

7. Escribe `progress/impl_mobile-quick-actions-typography-lock.md` con:
   - la base medida;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de R7.

   Rellena los hashes en [[traceability]]. La fila de R7 cita el hash del
   **verde de R6**, que es el último commit de código, no el de este commit.
   Commitea:

   ```bash
   git add progress/impl_mobile-quick-actions-typography-lock.md specs/mobile-quick-actions-typography-lock/traceability.md
   git commit -m "docs(mobile): record the quick actions lock evidence (R7)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La Home, salvo en los seis commits rojos, y siempre revertida en el verde
  siguiente.
- Los `describe` existentes del test, incluido
  `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'`, y sus
  helpers y mocks (`renderHome`, `makePet`, `makeDay`, los `mock*` y el mock de
  `reicon-react-native`).
- `src/screens/home/weekly-activity-chart.tsx` y
  `src/screens/home/weekly-activity-chart.test.tsx`: el segundo es de #132.
- `src/__tests__/design-drift.test.ts` y el resto de `src/__tests__/`.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `docs/ui-guidelines.md`: la regla ya está escrita (§Enmienda #70, punto 12).
