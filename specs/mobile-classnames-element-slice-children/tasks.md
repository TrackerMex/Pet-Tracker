---
feature: "mobile-classnames-element-slice-children"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-classnames-element-slice-children]] (#120)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. Aquí «implementación» es **revertir la mutación de producción**
> del rojo (C4, vía **b**, quinto punto): el candado se reescribe sobre código
> que ya es correcto, así que el rojo legítimo es una mutación versionada, nunca
> un `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo. R1 crea
> `openingTagWithTestId` en `consistency` y lo usa en el mismo commit. R2 crea
> su copia en `legibility` y la usa en el mismo commit. R3 mide sobre lo que
> dejaron R1 y R2. R4 documenta lo que ya existe.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`. Los números de línea **no son anclas**: todo
> se localiza por contenido, con el `grep` que se cita.

## Antes de tocar nada

1. `git branch --show-current` da
   `feature/120-mobile-classnames-element-slice-children`. Si no, **para**.
2. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está
   gitignorado y rompe `tsc` con rutas fantasma. No lo borres tú; tu sandbox
   lo deniega (#121).
3. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/__tests__/consistency-classnames.test.ts` | `5df906f85099d965c0e5adf901ae06fccc7fe2b6` |
   | `src/__tests__/legibility-classnames.test.ts` | `890432e7647c33c06509885e3346c879e1bb9cd7` |
   | `src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
   | `docs/conventions.md` (desde la raíz) | `bb2ca08e8d386028c5b871055c22789c667695ed` |

   Si alguno no coincide, **para**: la base se movió y las sondas y los blobs
   de esta spec ya no valen.
4. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/120_locks.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/120_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/120_locks.log /tmp/120_full.log
   ```

   Esperado: los candados dan 79 passed de 79, `exit=0`. La suite da
   83 passed de 83 suites, 1532 passed de 1532 tests y 1 snapshot, `exit=0`.
   Si la suite da otra cifra con `exit=0`, **anota la medida** y úsala como
   base de R5: el delta exigido es +0 sobre lo medido, no sobre 1532. Nunca
   `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería el del
   último comando.

   Usa siempre `--runTestsByPath`, que toma rutas literales. Sin él, el
   `(auth)` de `src/app/(auth)/…` es una regex y el fichero se salta en
   silencio con `exit=0`.

## R1 — `consistency-classnames` lee cada receta en su tag de apertura

### (0) Evidencia del hueco, antes de cambiar nada

Planta la mutación `P-active-h` en `src/screens/reminders/index.tsx`.
Localízala con `grep -n 'testID="pill-active"' src/screens/reminders/index.tsx`.

- En la línea del `className` del propio tag, quita `rounded-xl `:
  `flex-1 items-center gap-1 rounded-xl bg-accent-soft p-3` pasa a
  `flex-1 items-center gap-1 bg-accent-soft p-3`.
- Justo después de la línea `            >` que cierra ese tag (12 espacios),
  inserta esta línea, con 14 espacios:

  ```tsx
              <View className="rounded-xl" />
  ```

`git hash-object src/screens/reminders/index.tsx` da `2b43ab8f…`. Corre los
dos candados: dan 79 de 79 en **verde**. Ese es el agujero de la entrada.
Anótalo para el reporte y **no reviertas**: la misma mutación va en el commit
rojo.

### (1) Rojo

1. En `src/__tests__/consistency-classnames.test.ts`, sustituye el bloque
   entero que empieza en
   `/** Bloque JSX que abre en el \`testID\` dado y cierra en \`closingTag\`. */`
   y acaba en el `}` que cierra `elementWithTestId` por este literal:

   ```ts
   /**
    * #120 R1: tag de apertura del elemento con el `testID` dado, sin sus hijos:
    * del `<` que lo abre al siguiente `<`, cortado en `/>` si se cierra solo, para
    * que el hueco hasta el siguiente elemento no entre. El ancla es única en el
    * fichero; con dos copias, `indexOf` podría recortar la que no se vigila.
    */
   function openingTagWithTestId(source: string, testId: string): string {
     const anchor = source.indexOf(`testID="${testId}"`);

     expect(anchor).toBeGreaterThan(-1);
     expect(source.lastIndexOf(`testID="${testId}"`)).toBe(anchor);

     return source
       .slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor))
       .split('/>')[0];
   }
   ```

2. Cambia los cuatro call-sites. Lo que no aparece aquí queda **igual byte a
   byte**, incluidas todas las aserciones.

   - **CS1** (`grep -n "aplica rounded-xl a"`): las dos primeras líneas del
     `it.each(primaryButtons)` pasan a ser

     ```ts
       it.each(primaryButtons)('%s aplica rounded-xl a %s en su tag de apertura (#120 R1)', (path, testId) => {
         const button = openingTagWithTestId(readSource(path), testId);
     ```

   - **CS2** (`grep -n "conserva dimensión"`): la línea del título y las cinco
     de `const skeleton = elementWithTestId(` … `);` pasan a ser

     ```ts
       ])('%s conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)', (path, testId, classes) => {
         const skeleton = openingTagWithTestId(readSource(path), testId);
     ```

   - **CS3** (`grep -n "reserva el alto de la foto"`): el título y la llamada
     pasan a ser

     ```ts
       it('el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)', () => {
         const skeleton = openingTagWithTestId(
           readSource(join('components', 'pet-hero-header.tsx')),
           'pet-hero-skeleton',
         );
     ```

     Desaparece la línea `      '/>',`. El comentario de la enmienda #67 que
     hay encima se queda.

   - **CS4** (`grep -n "lleva las tres píldoras"`): el título pasa a ser
     `  it('lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)', () => {`
     y la llamada del bucle, a
     `      const pill = openingTagWithTestId(reminders, testId);`.

3. Comprueba:
   - `grep -c "elementWithTestId" src/__tests__/consistency-classnames.test.ts`
     da 0;
   - `grep -c "openingTagWithTestId" src/__tests__/consistency-classnames.test.ts`
     da 5 (la declaración y las cuatro llamadas);
   - `git hash-object src/__tests__/consistency-classnames.test.ts` da
     `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b`. Si no coincide, compara con
     los literales de arriba antes de seguir.
4. La mutación `P-active-h` de (0) sigue plantada. El blob es
   `2b43ab8fb2affce0ce70c489d3f608f27dffbd55`.
5. Corre los dos comandos canónicos. Esperado:
   - los candados dan `exit=1`, con 1 failed y 78 passed de 79;
   - la suite da `exit=1`, con 1 failed y 1531 passed de 1532 y 83 suites;
   - el **único** test rojo, en los dos, es
     `#62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`,
     por `expect(received).toContain`.

   Si falla cualquier otro test, o este falla por otro matcher o por un
   `ReferenceError`, **para**.
6. Commit rojo, con solo esos dos ficheros:

   ```bash
   git add mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): expose the child hole of the classnames element slice (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`.
   El blob vuelve a `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`.
2. Los candados dan 79 de 79, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): read own-tag classnames from the opening tag (R1)"
   ```

### (3) Refactor

Ninguno. El helper no se extrae a un módulo compartido ([[design]] §La copia
del helper).

## R2 — `legibility-classnames` parte el candado del botón destructivo

### (1) Rojo

1. En `src/__tests__/legibility-classnames.test.ts`, **deja**
   `elementWithTestId` como está. Justo después del `}` que lo cierra, deja una
   línea en blanco y añade este literal. Es el mismo helper de R1 con `#120 R2`
   en el comentario:

   ```ts
   /**
    * #120 R2: tag de apertura del elemento con el `testID` dado, sin sus hijos:
    * del `<` que lo abre al siguiente `<`, cortado en `/>` si se cierra solo, para
    * que el hueco hasta el siguiente elemento no entre. El ancla es única en el
    * fichero; con dos copias, `indexOf` podría recortar la que no se vigila.
    */
   function openingTagWithTestId(source: string, testId: string): string {
     const anchor = source.indexOf(`testID="${testId}"`);

     expect(anchor).toBeGreaterThan(-1);
     expect(source.lastIndexOf(`testID="${testId}"`)).toBe(anchor);

     return source
       .slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor))
       .split('/>')[0];
   }
   ```

   Entre este `}` y
   `describe('#61 R1: la etiqueta destructiva usa el token de danger', () => {`
   queda una sola línea en blanco.

2. Dentro de ese `describe`, justo antes de `  const deleteConfirm = elementWithTestId(`
   (`grep -n "const deleteConfirm = elementWithTestId"`), inserta:

   ```ts
     // #120 R2: este bloque va del ancla al `</Button>` con los hijos dentro, a
     // propósito: la etiqueta y su texto son hijos del Button, y el token del
     // acento no puede aparecer en ninguna parte del botón.
   ```

3. Sustituye el tercer `it` del `describe`, desde
   `  it('conserva variant, testID y texto del botón', () => {` hasta su `});`,
   por:

   ```ts
     it('conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)', () => {
       // #120 R2: variant y bg-danger son props del propio Button y se leen en su
       // tag; el texto es un hijo y se lee en el bloque entero.
       const deleteConfirmTag = openingTagWithTestId(
         readSource(join('screens', 'reminders', 'index.tsx')),
         'reminders-delete-confirm',
       );

       expect(deleteConfirmTag).toContain('variant="danger"');
       expect(deleteConfirmTag).toContain('bg-danger');
       expect(deleteConfirm).toContain("t('reminders.delete')");
     });
   ```

   Los otros dos `it` del `describe` y los `describe` `#61 R3`, `#61 R4` y
   `#61 R5` no se tocan.

4. `git hash-object src/__tests__/legibility-classnames.test.ts` da
   `8c42a1052626ed4ea11b2fe361dcb06fac761b7d`.

5. Planta la mutación `D-v` en `src/screens/reminders/index.tsx`
   (`grep -n 'testID="reminders-delete-confirm"'`):
   - borra la línea `                  variant="danger"` (18 espacios) del tag
     del Button;
   - justo después de la línea `                  </Button.Label>` de ese mismo
     Button, inserta esta línea, con 18 espacios:

     ```tsx
                       {/* variant="danger" */}
     ```

   El blob da `f136e9718d44ef81b5f92a9dd0e9385e60086060`.

   **No uses `D-h`** (`bg-danger` movido a un hijo) como rojo. Hoy ya lo paran
   nueve tests de `src/screens/reminders/index.test.tsx`, así que el commit
   rojo fallaría por más cosas que la aserción nueva.

6. Corre los dos comandos canónicos. Esperado:
   - los candados dan `exit=1`, con 1 failed y 78 passed de 79;
   - la suite da `exit=1`, con 1 failed y 1531 passed de 1532;
   - el **único** rojo, en los dos, es
     `#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`,
     por `expect(received).toContain`.

   Con los ficheros de hoy, esta misma mutación da 83 / 1532 en verde. Así lo
   midió la spec: nada más en la suite vigila `variant="danger"`.
7. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): expose the child hole of the delete confirm tag lock (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`.
   El blob vuelve a `8fbcd07c…`.
2. Los candados dan 79 de 79, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/reminders/index.tsx
   git commit -m "test(mobile): read the delete confirm props from its opening tag (R2)"
   ```

### (3) Refactor

Ninguno.

## R3 — Las sondas

Sobre el árbol que dejan R1 y R2, **una sonda cada vez**:

1. Aplica la mutación de la tabla.
2. Comprueba con `git hash-object <ruta>` que da el blob de la tabla. Si no
   coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre el comando canónico de los candados.
4. Anota `exit`, las cuentas y cada `it` rojo con su matcher.
5. `git checkout -- <ruta>`.
6. `git diff --exit-code -- mobile-pet-tracker/src` da 0.

**Nada de esto se commitea.** La tabla medida va al reporte
(`progress/impl_mobile-classnames-element-slice-children.md`), con la columna
«tras #120» rellena por ti.

Convenciones de la tabla:

- Las sangrías son las del fichero, y cada línea insertada lleva la de su
  vecina.
- «Tag propio» es el tag de apertura del elemento con ese `testID`.
- Las rutas de los ficheros de producción son `src/app/(auth)/<x>.tsx`,
  `src/screens/reset-password/index.tsx`, `src/screens/reminders/index.tsx`
  (R), `src/screens/health/index.tsx` (H) y
  `src/components/pet-hero-header.tsx` (P).
- «Verde» es 79 de 79. «Rojo» es 1 failed de 79 salvo que se diga otra cosa.
- La columna «hoy» la midió la spec sobre `42db1ccf`, con los ficheros de test
  de base. Para reproducirla, el `reviewer` puede restaurar los dos tests de
  `origin/main` (`git checkout origin/main -- <los dos>`) y devolverlos
  después con `git checkout HEAD -- <los dos>`.

### Exigido

| Sonda | Fichero | Mutación | Blob | Hoy | Tras #120 (exigido) |
|---|---|---|---|---|---|
| `B-login-h` | `login.tsx` | en el tag propio de `login-submit`, `className="w-full rounded-xl bg-accent"` pasa a `className="w-full"`; justo antes de `<Button.Label className="font-bold text-accent-foreground">` se inserta `<Text className="rounded-xl bg-accent" />` | `10ab4fdd` | verde | rojo: `#62 R1 … › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1)`, `toContain` |
| `B-forgot-h` | `forgot.tsx` | la misma, en `forgot-submit` | `ff15e153` | verde | rojo: la fila `forgot-submit` de CS1, `toContain` |
| `B-register-h` | `register.tsx` | la misma, en `register-submit` | `2f067b66` | verde | rojo: la fila `register-submit` de CS1, `toContain` |
| `B-reset-h` | `reset-password/index.tsx` | la misma, en `reset-submit` | `01ac5470` | verde | rojo: la fila `reset-submit` de CS1, `toContain` |
| `B-login-p` | `login.tsx` | se intercambian las líneas `testID="login-submit"` y `className="w-full rounded-xl bg-accent"` | `ec0ed19f` | **rojo falso**: fila `login-submit` de CS1, `toContain` | verde |
| `B-login-n` | `login.tsx` | la etiqueta de `login-submit` pasa a `className="rounded-2xl font-bold text-accent-foreground"` | `51e6326d` | rojo, 3 de 79: CS1 `login-submit` por `not.toContain`, `#62 R4 … › no deja la clase fuera de escala rounded-2xl en producción` y `#98 R10 … › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, los dos por `toEqual` | rojo, **2** de 79: los dos `toEqual`. Cambio declarado |
| `P-active-h` | R | la de R1 (0) | `2b43ab8f` | verde | rojo: `#62 R4 … › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`, `toContain` |
| `P-week-h` | R | la misma, en `pill-week` (`rounded-xl ` fuera de `flex-1 items-center gap-1 rounded-xl bg-default p-3` y `<View className="rounded-xl" />` como primer hijo) | `195738de` | verde | rojo: CS4, `toContain` |
| `P-inactive-h` | R | la misma, en `pill-inactive` | `1c5f5511` | verde | rojo: CS4, `toContain` |
| `P-week-j` | R | `rounded-xl ` fuera del tag de `pill-week`; como primer hijo, `{/* rounded-xl */}` | `efa2646a` | verde | **verde** (límite 2) |
| `P-week-f` | R | `rounded-xl ` fuera del tag de `pill-week`; como primer hijo, `{false && 'rounded-xl'}` | `214a8eb9` | verde | **verde** (límite 2) |
| `P-week-d` | R | justo antes del `<View` que abre `pill-week`, la línea `{false && <View testID="pill-week" className="rounded-xl" />}`; `rounded-xl ` fuera del tag real | `c841bfde` | verde | rojo: CS4, por `toBe` (unicidad) |
| `P-week-t` | R | el `<View` que abre `pill-week` pasa a `{false ? <View testID="pill-week" className="rounded-xl" /> : <View`; `rounded-xl ` fuera del tag real; el `</View>` que cierra `pill-week` (el que sigue a `{t('reminders.thisWeek')}` y su `</Text>`) pasa a `</View>}` | `0f51df0a` | verde | rojo: CS4, por `toBe` (unicidad) |
| `P-week-a` | R | justo antes del `<View` que abre `pill-week`, la línea `{/* testID="pill-week" */}`. El tag no cambia | `0b3b6f86` | verde | rojo: CS4, por `toBe`. **Falla hacia rojo** a propósito |
| `P-week-l1` | R | entre `testID="pill-week"` y su `className`, la línea `hitSlop={0 < 1 ? 4 : 0}` | `f56dbd10` | verde | rojo: CS4, por `toContain`. **Falla hacia rojo** (límite 1) |
| `P-week-l3` | R | `rounded-xl ` fuera del tag de `pill-week`; entre `style={CONTINUOUS_CORNER}` y el `>` del tag, la línea `// rounded-xl` | `baa5baba` | verde | **verde** (límite 3) |
| `P-week-p` | R | se intercambian las líneas `testID="pill-week"` y su `className` | `72410a2c` | **rojo falso**: CS4, `toContain` | verde |
| `V-h` | H | en `vaccines-skeleton`, `className="h-24 w-full rounded-card"` pasa a `className="h-24 w-full"`, y el `/>` pasa a `>` + `<View className="h-24 w-full rounded-card" />` + `</Skeleton>` (tres líneas) | `0c3633c1` | verde | rojo: `#62 R2 … › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)`, `toContain` |
| `V-f` | H | ` rounded-card` fuera del `className` de `vaccines-skeleton`; justo después del `) : null}` que lo sigue, la línea `{false && 'className="h-24 w-full rounded-card"'}` | `7abf0dcf` | rojo: CS2, `toContain` | rojo: CS2, `toContain`. Sin el corte en `/>`, **verde falso** |
| `S-h` | P | en `pet-hero-skeleton`, `className="w-full"` pasa a `className="h-full"`, y el `/>` pasa a `>` + `<View className="w-full" />` + `</Skeleton>` | `5bc88a73` | verde | rojo: `#62 R2 … › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)`, `toContain` |
| `S-j` | P | `className="w-full"` pasa a `className="h-full"`; dentro del comentario JSX que sigue, justo antes de la línea `La parada transparente se escribe…`, la línea `className="w-full"` | `821d649e` | rojo: CS3, `toContain` | rojo: CS3, `toContain`. Sin el corte en `/>`, **verde falso** |
| `S-p` | P | se intercambian las líneas `testID="pet-hero-skeleton"` y `className="w-full"` | `fad320de` | **rojo falso**: CS3, `toContain` | verde |
| `S-n` | P | el `/>` de `pet-hero-skeleton` pasa a `>` + `<View className="rounded-card" />` + `</Skeleton>`; el `className` no cambia | `6a798a78` | rojo: CS3, `not.toContain` | **verde**. Cambio declarado |
| `D-h` | R | ` bg-danger` fuera del `className` de `reminders-delete-confirm`; justo después de su `</Button.Label>`, la línea `<View className="bg-danger" />` | `00ea6738` | verde en los candados; rojo en `src/screens/reminders/index.test.tsx` (9 tests) | rojo: `#61 R1 … › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`, `toContain` |
| `D-v` | R | la de R2 (1).5 | `f136e971` | verde en toda la suite | rojo: el `it` `(#120 R2)`, `toContain` |
| `D-d` | R | justo antes de `<Button.Label className="font-bold text-danger-foreground">` del botón destructivo, las cinco líneas `{false && (` / `<Button.Label className="font-bold text-danger-foreground">` / `{t('reminders.delete')}` / `</Button.Label>` / `)}`; la etiqueta real pasa a `className="font-bold text-foreground"` | `50cc3d89` | verde | **verde** (residuo del bloque de subárbol, candidato (F)) |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R4 — La convención

En `docs/conventions.md`, §Recortes del tag de apertura en candados de fuente,
haz los tres cambios. Ninguno usa números de línea; los tres se anclan por
contenido.

1. **Viñeta nueva.** Justo después de la viñeta que acaba en
   `` `home-alerts-bell` (#121) y el `reminders-see-all` (#112): el mismo grep. ``,
   inserta:

   ```markdown
   - `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` y
     `legibility-classnames.test.ts`, los candados de clases por `testID` (#120):
     `grep -n "function openingTagWithTestId"`. El grep de `anchor` también los
     encuentra, dentro del helper.
   ```

2. **La frase «Los tres…».** Sustituye las dos líneas

   ```markdown
   Los tres que recortan alrededor de `anchor` aseveran su unicidad y tienen al
   lado su pata que pulsa (#122): `grep -rn "'responderGrant'" mobile-pet-tracker/src`.
   ```

   por

   ```markdown
   Los tres de `food.test.tsx` y `home/index.test.tsx` aseveran su unicidad y
   tienen al lado su pata que pulsa (#122):
   `grep -rn "'responderGrant'" mobile-pet-tracker/src`.
   ```

   Con R1 y R2 hay dos `lastIndexOf('<', anchor)` más en el árbol, así que
   «los tres que recortan alrededor de `anchor`» dejaría de ser cierto.

3. **Párrafo nuevo.** Justo después del párrafo
   ``No queda ningún recorte de `<Tag` a `</Tag>` por migrar:`` …
   `no devuelve nada.`, y antes de
   `Tampoco vale aseverar la receta contra el fichero entero.`, deja una línea
   en blanco e inserta:

   ```markdown
   Los candados de clases por `testID` (#120) meten la unicidad dentro del helper
   y añaden un corte: si el elemento se cierra solo, el recorte acaba en su `/>`.
   Sin ese corte, el hueco entre el `/>` y el siguiente `<` del fichero entra en
   la ventana, y un comentario JSX o un `{false && '…'}` en ese hueco dan un
   verde falso. El comentario que sigue al skeleton de `pet-hero-header.tsx` vive
   ahí. Esos candados solo leen fuente, así que los límites 2 y 3 quedan como
   límites documentados. `legibility-classnames.test.ts` conserva a propósito
   `elementWithTestId`, que va del ancla al `</Button>` con los hijos dentro, para
   lo que es de los hijos del botón destructivo: la etiqueta, su texto y el veto
   del token del acento en todo el botón. Ese bloque tiene su propio hueco: un
   señuelo `{false && (…)}` con la etiqueta correcta delante de la real da un
   verde falso.
   ```

Comprueba, desde la raíz del repo:

- `git hash-object docs/conventions.md` da
  `e1f8a5ab02b66286020b3da98b2c9e84a553c2dd`;
- `grep -c "function openingTagWithTestId" docs/conventions.md` da 1;
- `grep -c "Los tres que recortan alrededor de" docs/conventions.md` da 0;
- `grep -c "el recorte acaba en su" docs/conventions.md` da 1;
- `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` sigue sin devolver
  nada.

La suite sigue en verde con este cambio: tres tests leen
`docs/conventions.md`, y ninguno mira esta sección. Así lo midió la spec,
83 / 1532 con los tres ficheros finales.

Commit:

```bash
git add docs/conventions.md
git commit -m "docs(mobile): document the self-closing cut and the subtree exception (R4)"
```

## R5 — Cierre

1. Suite completa, sin pipe: 83 / 1532 / 1, `exit=0`, o la base que
   mediste en §Antes de tocar nada, con +0 suites y +0 tests.
2. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/120_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/120_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Desde la raíz:
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`
     da 0;
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo
     los dos ficheros de test;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
     da 0.
5. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/__tests__/consistency-classnames.test.ts` | `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b` |
   | `src/__tests__/legibility-classnames.test.ts` | `8c42a1052626ed4ea11b2fe361dcb06fac761b7d` |
   | `src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`, sin cambios |
   | `docs/conventions.md` | `e1f8a5ab02b66286020b3da98b2c9e84a553c2dd` |

6. Escribe `progress/impl_mobile-classnames-element-slice-children.md` con:
   - la evidencia de R1 (0);
   - las salidas de los dos rojos y los dos verdes;
   - la tabla Exigido con la columna «tras #120» medida;
   - los blobs;
   - los números de R5.

   Rellena los hashes en [[traceability]] y commitea:

   ```bash
   git add progress/impl_mobile-classnames-element-slice-children.md specs/mobile-classnames-element-slice-children/traceability.md
   git commit -m "docs(mobile): record the classnames slice probe evidence (R3,R5)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` e `index.test.tsx`: la sesión Backend trabaja
  #77 ahí. Tampoco los candados de fichero entero que los leen: el
  `text-accent-strong` ×2 de `#61 R4`, `#61 R5` y las cuentas por fichero de
  `#62 R14`, `#62 R15`, `#98 R10` y `#64 R9`.
- Los demás `describe` de los dos ficheros, `sourceFiles`, `filesMatching` y
  `readSource`.
- Cualquier fichero de producción, salvo las dos mutaciones versionadas y
  revertidas de R1 y R2, y las sondas de R3, que no se commitean.
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `src/__tests__/design-drift.test.ts`: no lee estos ficheros. Los literales de
  esta spec no contienen `use-api` ni `useApi` (`#87 R19`), ni hex.
