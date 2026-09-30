---
feature: "mobile-collar-pair-link-pressed-feedback"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Tareas — [[mobile-collar-pair-link-pressed-feedback]] (#138)

> Orden TDD con **rojo natural** (C4, vía a): la base no cumple R1, R2 ni R3,
> así que cada `it` nuevo o enmendado da rojo contra la Home de base, sin
> mutaciones versionadas. Van **tres commits rojos** de solo tests (R1, R2,
> R3) y **un verde** que cambia la Home y los pone verdes a la vez. No se puede
> hacer un verde por requisito: el cambio de la Home, solo, pondría rojos
> `#62 R14` y `#98 R10` sin enmendar ([[design]] §D7). **Un commit por paso,
> test primero.** Nunca mezcles test e implementación en el mismo commit.
>
> Cada requisito crea su sujeto antes de aseverarlo. El botón
> `collar-pair-link` y el `describe` del collar ya existen en la base, y cada
> `it` nuevo resuelve `makePet({ device: null })` para que el botón se pinte.
> R3 enmienda tres `it` del test de consistencia que ya existen.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Ninguna ruta de
> esta feature lleva paréntesis. Los números de línea **no son anclas**: todo
> se localiza por contenido, con el `grep` que se cita. Nombres cortos:
>
> - «la Home» es `src/screens/home/index.tsx`;
> - «el test» es `src/screens/home/index.test.tsx`;
> - «el test de consistencia» es `src/__tests__/consistency-classnames.test.ts`;
> - «el `describe` del collar» es
>   `describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing'`.
>
> **Los bloques de código van a columna 0 en este fichero**: cópialos tal
> cual, sin quitar ni añadir sangría. Cada uno lleva ya la sangría que tiene en
> su fichero destino.

## Antes de tocar nada

1. `git branch --show-current` da
   `feature/138-mobile-collar-pair-link-pressed-feedback`. Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada,
   **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está
   gitignorado y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu
   sandbox lo deniega (#121).
4. **Skills.**
   - Carga `building-native-ui` de tu plugin `expo`.
   - Carga `appllama-app-design-skill` de `.agents/skills/`, que
     `docs/ui-guidelines.md` hace obligatoria en toda tarea de UI móvil. Toma
     de ella solo el **patrón**: la carta gana siempre, y su *simulator loop*
     no aplica, porque la verificación es la prueba de humo del humano en
     Android (R5).
   - Tu plugin **no tiene** skill de animación ni de `expo-router`. No hace
     falta: esta feature no anima ni navega distinto, y todo lo que decide
     está escrito aquí. **No cargues `animate-expo`** de `.agents/skills/`.
     Su receta de pulsado (escala 0.97 con transición de Reanimated) está
     descartada desde #136. Si la cargas igualmente, esta spec gana: cambio de
     opacidad instantáneo, sin Reanimated, sin transición, sin escala y sin
     háptica.
   - Anota en el reporte qué skills cargaste.
   - Todo se corre con `bun` y `bunx`, nunca con `npm` ni `npx`. No instales
     nada. **No corras `./init.sh` ni los e2e**: otra sesión (Backend, #137 y
     #139) comparte Postgres y LocalStack, y la base de la suite ya la midió
     el `leader`.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `cb61d0c64deb0c911031a8468a8c397255b53979` |
   | `src/screens/home/index.test.tsx` | `04135c8e262f601ad61670f34c4d959192d150c9` |
   | `src/__tests__/consistency-classnames.test.ts` | `e62f88ad4d60178a18323551f5eb6d19641dbd72` |
   | `src/theme/native-styles.ts` (solo para la sonda `constant`) | `4e5939f9bf5ce0c0d1282b1dfb05f134d0997de2` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas
   de esta spec ya no valen.
6. Mide la base, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/138_home.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/138_cons.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/138_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/138_home.log /tmp/138_cons.log /tmp/138_full.log
   ```

   Esperado:
   - el test, 167 passed de 167, `exit=0`;
   - el de consistencia, 53 passed de 53, `exit=0`;
   - la suite, 86 passed de 86 suites, 1610 passed de 1610 tests y 1
     snapshot, `exit=0`.

   Si la suite da otra cifra con `exit=0` (porque otra feature mergeó antes
   sin tocar estos tres ficheros), **anota la medida** y úsala como base: el
   delta exigido es +2 tests y +0 suites sobre lo medido. Nunca pongas
   `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería el del último
   comando. Los bloques `● Console` del log son ruido y no cuentan como fallo:
   los rojos se cuentan por la línea `Tests:`.
7. **Reglas de literales en el test**, comentarios incluidos, por
   `src/__tests__/design-drift.test.ts`, que escanea el test:
   - la cita de la feature va siempre como `#138 R<n>`, **nunca `#138`
     suelto**: la guarda de hexadecimales lo lee como un color de tres
     dígitos;
   - ni `StyleSheet` ni ningún `-[` (clase arbitraria), en ningún caso,
     tampoco en un comentario;
   - ningún color hexadecimal.

   En el test de consistencia, la cita va también como `#138 R3`.
8. **Los esperados son literales.** El `testID` y los objetos de `style` van
   escritos a mano, como en los bloques de abajo. No añadas ningún import al
   test ni leas nada de la Home ni de `src/theme/native-styles.ts`. Todo lo
   que usan los `it` nuevos (`renderHome`, `screen`, `fireEvent`, `waitFor`,
   `mockGetPet`, `makePet`) ya está importado o declarado en el test.

## R1 — El botón se atenúa a 0.8 mientras se pulsa y vuelve a 1

### (1) Rojo

1. En el test, el `describe` del collar termina con
   `it('does not show the pair action when the pet has a collar'`, cuya
   última aserción es la línea

   ```tsx
       expect(screen.queryByTestId('collar-pair-link')).toBeNull();
   ```

   (`grep -cF "    expect(screen.queryByTestId('collar-pair-link')).toBeNull();" src/screens/home/index.test.tsx`
   da 1). Debajo vienen `  });`, que cierra ese `it`, y `});`, que cierra el
   `describe`. **Entre esos dos**, es decir, justo después del `  });`,
   inserta una línea en blanco y este bloque:

```tsx
  it('#138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderHome();

    const link = await screen.findByTestId('collar-pair-link');

    // #138 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
    // matches a subset and would let a stray key or a lost corner through.
    expect(link.props.style).toEqual({
      borderCurve: 'continuous',
      opacity: 1,
    });

    // #138 R1: responderGrant is the first event of a real press and leaves
    // the Pressable pressed, as in the #136 R1 quick action tile test.
    await fireEvent(link, 'responderGrant', {
      nativeEvent: {},
      persist: () => undefined,
    });

    expect(link.props.style).toEqual({
      borderCurve: 'continuous',
      opacity: 0.8,
    });

    // #138 R1: responderTerminate ends the press through the same pressOut
    // path as a release, without onPress: a release needs a native target
    // that the test tree lacks. The pressed state clears 130 ms later, the
    // minimum press duration of Pressability, so waitFor polls for it.
    await fireEvent(link, 'responderTerminate', {
      nativeEvent: {},
      persist: () => undefined,
    });

    await waitFor(() =>
      expect(link.props.style).toEqual({
        borderCurve: 'continuous',
        opacity: 1,
      }),
    );
  });
```

   El `});` que cierra el `describe` queda justo debajo del `  });` de este
   `it`, sin línea en blanco entre ellos.
2. `git hash-object src/screens/home/index.test.tsx` da
   `cd94d1d5932eb23e13bc2fd49e39dd6a8b440adc` (4662 líneas). Si no, el pegado
   no es el de la spec: corrígelo antes de seguir.
3. Mide el test, sin pipe:
   `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/138_r1.log 2>&1; echo "exit=$?"`.
   Esperado: 1 failed, 167 passed, 168 total, `exit=1`. El rojo es
   `R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing › #138 R1: …`,
   por `expect(received).toEqual(expected)`, en la **primera** aserción
   (reposo): la Home de base da `{ borderCurve: 'continuous' }`, sin
   opacidad. **Por aserción**, no por consulta.
4. Commit rojo, desde la raíz:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx
   git commit -m "test(mobile): expect pressed feedback on the collar pair link (R1)"
   ```

### (2) Verde

En §Verde común, tras el rojo de R3.

### (3) Refactor

Ninguno. Los literales de `style` se repiten a propósito: cada aserción se lee
sola. No los extraigas a una constante.

## R2 — En reposo, el botón lleva `rounded-xl` como único radio, la esquina y la opacidad 1

### (1) Rojo

1. En el test, justo después del `  });` que cierra el `it` de `#138 R1`
   (entre ese `  });` y el `});` que cierra el `describe` del collar), inserta
   una línea en blanco y este bloque:

```tsx
  it('#138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderHome();

    const link = await screen.findByTestId('collar-pair-link');

    // #138 R2: the corner leaves the source counts of #62 R14, which also
    // kept rounded-full off this tag, so the tree locks the radius instead.
    expect(
      link.props.className
        .split(' ')
        .filter((token: string) => /^rounded(?:-|$)/.test(token)),
    ).toEqual(['rounded-xl']);
    expect(link.props.style).toEqual({
      borderCurve: 'continuous',
      opacity: 1,
    });
  });
```

   Los dos `it` nuevos quedan seguidos, separados por una línea en blanco, y
   el `});` del `describe` justo debajo del último.
2. `git hash-object src/screens/home/index.test.tsx` da
   `d919055869711334eeca54c4e725d26789558e6d` (4685 líneas).
3. Mide el test, sin pipe (`> /tmp/138_r2.log 2>&1; echo "exit=$?"`).
   Esperado: 2 failed, 167 passed, 169 total, `exit=1`. Los rojos son
   `… › #138 R1: …` y `… › #138 R2: …`, los dos por
   `expect(received).toEqual(expected)`. En `#138 R2` el rojo sale en la
   aserción del `style`: la del radio **ya es verde** en la base, y la sonda
   `rounded_full` prueba que no es decorativa ([[design]] §D4).
4. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx
   git commit -m "test(mobile): lock the collar pair link radius and resting style (R2)"
   ```

### (2) Verde

En §Verde común.

### (3) Refactor

Ninguno.

## R3 — La Home no deja ninguna esquina directa, y el repo, 31

### (1) Rojo

En el test de consistencia, tres cambios. Cada línea de origen aparece una
sola vez (`grep -cxF` con la línea entera, sangría incluida, da 1).

1. En `const directUses = [`, dentro de
   `describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua'`,
   sustituye estas tres líneas:

```ts
    // #136 R3: the quick action tiles spread the corner inside their pressed
    // style, so the Home keeps a single direct use, collar-pair-link.
    [join('screens', 'home', 'index.tsx'), 1],
```

   por estas cuatro:

```ts
    // #136 R3 and #138 R3: the quick action tiles and collar-pair-link spread
    // the corner inside their pressed style, so the Home keeps no direct use.
    // The row stays at 0 to lock that and the import.
    [join('screens', 'home', 'index.tsx'), 0],
```

   La fila **no se retira** ([[design]] §D5).
2. En `it('fusiona la esquina una vez y la entrega a las dos ramas de Card'`,
   sustituye estas cuatro líneas:

```ts
    // #136 R3: minus one, the tiles' corner now travels in their pressed style.
    expect(
      directUses.reduce((total, [, count]) => total + count, 2),
    ).toBe(33 + 1 + 1 - 1);
```

   por estas cinco:

```ts
    // #136 R3: minus one, the tiles' corner now travels in their pressed style.
    // #138 R3: minus one more, collar-pair-link's corner travels in its own.
    expect(
      directUses.reduce((total, [, count]) => total + count, 2),
    ).toBe(33 + 1 + 1 - 1 - 1);
```

3. En `describe('#98 R10: los candados que esta feature no mueve'`, dentro de
   `it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'`,
   sustituye estas cinco líneas:

```ts
    // #136 R3: the tiles' corner moved into their pressed style, one direct
    // use less in the Home and in the repo.
    expect(home.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(1);
    expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(32);
```

   por estas siete:

```ts
    // #136 R3: the tiles' corner moved into their pressed style, one direct
    // use less in the Home and in the repo.
    // #138 R3: collar-pair-link's corner moved too, so the Home has none left.
    // With no match, match() returns null: the ?? [] keeps the count readable.
    expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0);
    expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31);
```

   La línea de `food` no cambia: va en el bloque solo como ancla. **No quites
   el `?? []`**: sin él, con la Home final, el `it` falla con
   `Matcher error: received value must have a length property whose value must be a number`,
   porque `match()` devuelve `null` cuando no hay coincidencias ([[design]]
   §D6).

Después:

1. `git hash-object src/__tests__/consistency-classnames.test.ts` da
   `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7` (532 líneas).
2. Mide el test de consistencia, sin pipe
   (`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/138_r3.log 2>&1; echo "exit=$?"`).
   Esperado: 2 failed, 51 passed, 53 total, `exit=1`. Los rojos, los dos por
   `expect(received).toHaveLength(expected)`:
   - `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas`;
   - `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`.

   `fusiona la esquina una vez y la entrega a las dos ramas de Card` queda
   **verde**: suma la tabla y no lee el fuente. Es lo esperado.
3. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
   git commit -m "test(mobile): move the collar pair link corner out of the direct corner counts (R3)"
   ```

### (2) Verde

En §Verde común.

### (3) Refactor

Ninguno.

## Verde común (R1, R2, R3)

1. En la Home, dentro de `{detail.data.pet.device === null ? (`, el
   `Pressable` `collar-pair-link` tiene esta línea, con **22** espacios de
   sangría, justo debajo de su `className` y justo encima de
   `                      onPress={() => router.push('/pairing')}`
   (`grep -cxF '                      style={CONTINUOUS_CORNER}' src/screens/home/index.tsx`
   da 1, y `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx`
   también da 1, porque es el único uso directo que queda en la Home):

```tsx
                      style={CONTINUOUS_CORNER}
```

   Sustitúyela por estas cuatro líneas:

```tsx
                      style={({ pressed }) => ({
                        ...CONTINUOUS_CORNER,
                        opacity: pressed ? 0.8 : 1,
                      })}
```

   Nada más. No cambies imports: `CONTINUOUS_CORNER` y `Pressable` ya están
   importados. Sin `useState`, sin `StyleSheet`, sin Reanimated y sin
   háptica. **No reformatees** el bloque del botón: el `<Pressable` y su `>`
   de cierre no están alineados con sus props, y así se quedan.
2. `git hash-object src/screens/home/index.tsx` da
   `0d439ebc386fbed4be6acf76b426383224eb602a` (848 líneas).
3. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/138_green_home.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/138_green_cons.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/138_green_full.log 2>&1; echo "exit=$?"
   ```

   Esperado: el test, 169 de 169; el de consistencia, 53 de 53; la suite, 86
   suites / 1612 tests / 1 snapshot (o tu base +2 tests), `exit=0` en los
   tres.
4. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/138_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`, y
   `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/138_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
5. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "feat(mobile): dim the collar pair link while pressed (R1,R2,R3)"
   ```

### Refactor

Ninguno. No extraigas la receta a una constante ni a un helper compartido con
los tiles, la campana o «Ver todos»: cada uno tiene candados propios que no
deben moverse.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la Home (en `constant`, en
   `src/theme/native-styles.ts`).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la
   tabla. Si no coincide, la mutación no es la de la spec: corrígela antes de
   medir.
3. Corre los dos tests juntos, sin pipe:
   `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/138_probe.log 2>&1; echo "exit=$?"`.
   Son 222 tests (169 + 53).
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su
   error**. `expect(received).<matcher>` es un rojo **por aserción**, y
   `Unable to find an element with testID: …` es un rojo **por consulta**.
   Anota también la línea del marco de código `>` del log donde cae cada rojo
   del test (la tabla cita la aserción: reposo, pulsado, `waitFor` o radio).
5. Restaura, desde la raíz, con
   `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` (y,
   tras `constant`, con
   `git checkout HEAD -- mobile-pet-tracker/src/theme/native-styles.ts`).
   **Nunca** con `git checkout <commit> --`, que deja la mutación en el
   índice.
6. `git status --porcelain -- mobile-pet-tracker` sale vacío y
   `git diff --cached --name-only` sale vacío. Si no, **para**.

**Nada de esto se commitea.** No uses `git stash` ni `rm -f`. La tabla medida
va al reporte, con la columna «medido» rellena por ti.

Líneas de la Home final que usan las mutaciones (cada una aparece una sola
vez con `grep -cxF`):

- «la apertura»: `                      style={({ pressed }) => ({` (22 espacios);
- «la esquina»: `                        ...CONTINUOUS_CORNER,` (24 espacios);
- «la opacidad»: `                        opacity: pressed ? 0.8 : 1,` (24 espacios);
- «el cierre»: `                      })}` (22 espacios);
- «la condición»: `              {detail.data.pet.device === null ? (`;
- «el `className`»: `                      className="min-h-11 items-center justify-center rounded-xl bg-accent-soft px-4"` (22 espacios);
- «la línea de estado»: `  const [activitySelection, setActivitySelection] = useState<{`;
- «el import de RN»: `import { Pressable, ScrollView, Text, View } from 'react-native';`.

«La receta» son las cuatro líneas, de la apertura al cierre. «La esquina» y
«la opacidad» casan una sola vez con `-x` porque las de los tiles van con 22
espacios, no con 24. Toda línea nueva de una mutación va con la sangría de la
línea a la que sustituye o junto a la que va (24 espacios dentro de la
receta, 22 para las props del botón, 2 para la línea de estado). «Spec» es lo
que se midió al escribir la spec: la Home mutada contra el test y el test de
consistencia finales, 222 tests.

| Sonda | Mutación | Blob | Spec y exigido (222 tests) |
|---|---|---|---|
| `norecipe` | la receta vuelve a `                      style={CONTINUOUS_CORNER}` (es la Home de base) | `cb61d0c6` | rojo 4: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`; `#62 R14 › screens/home/index.tsx importa y aplica sus 0 esquinas` y `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, por `toHaveLength` |
| `pressed07` | la opacidad pasa a `                        opacity: pressed ? 0.7 : 1,` | `3b0d41bd` | rojo 1: `#138 R1`, por `toEqual`, en el pulsado |
| `rest09` | la opacidad pasa a `                        opacity: pressed ? 0.8 : 0.9,` | `2e696c30` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual` |
| `nocorner` | se borra la esquina | `0fe120e5` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual` |
| `pressnocorner` | la esquina pasa a `                        ...(pressed ? {} : CONTINUOUS_CORNER),` | `3e128e46` | rojo 1: `#138 R1`, por `toEqual`, en el pulsado |
| `restnocorner` | la esquina pasa a `                        ...(pressed ? CONTINUOUS_CORNER : {}),` | `95c251ad` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual` |
| `stray` | debajo de la opacidad, `                        overflow: 'hidden',` | `b254ce12` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual` |
| `nostyle` | se borra la receta entera (las cuatro líneas) | `f9751976` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual` |
| `array` | la receta pasa a `                      style={({ pressed }) => [`, `                        CONTINUOUS_CORNER,`, `                        { opacity: pressed ? 0.8 : 1 },`, `                      ]}` | `5c49aa16` | rojo 2: `#138 R1` (reposo) y `#138 R2` (`style`), por `toEqual`. Candado de forma, a propósito ([[design]] §D2) |
| `sticky` | encima de la línea de estado, `  const [collarStuck, setCollarStuck] = useState(false);`. La receta pasa a `                      style={{`, la esquina, `                        opacity: collarStuck ? 0.8 : 1,`, `                      }}` y `                      onPressIn={() => setCollarStuck(true)}` | `4c681b1a` | rojo 1: `#138 R1`, por `toEqual`, dentro del `waitFor` tras `responderTerminate` |
| `hidden` | la condición pasa a `              {detail.data.pet.device !== null ? (` | `e2527453` | rojo 4: `#138 R1`, `#138 R2` y `shows the pair action for a pet without a collar and opens pairing`, **por consulta** (`Unable to find an element with testID: collar-pair-link`); `does not show the pair action when the pet has a collar`, por aserción (`toBeNull`) |
| `rounded_full` | el `className` pasa a `                      className="min-h-11 items-center justify-center rounded-xl rounded-full bg-accent-soft px-4"` | `07d4f8a1` | rojo 1: **solo** `#138 R2`, por `toEqual`, en el radio |
| `rounded_2xl` | el `className` pasa a `                      className="min-h-11 items-center justify-center rounded-2xl bg-accent-soft px-4"` | `8c5593f8` | rojo 3, por `toEqual`: `#138 R2` (radio), `#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-2xl en producción` y `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` |
| `constant` | en `src/theme/native-styles.ts`, `{ borderCurve: 'continuous' }` pasa a `{ borderCurve: 'circular' }` (la Home, final) | `e2930ec1` (de `native-styles.ts`) | rojo 5: `#138 R1` (reposo), `#138 R2` (`style`), `#81 R3` y `#136 R1`, por `toEqual`; `#62 R14 › declara las dos constantes nativas compartidas`, por `toContain`. Prueba que los esperados son literales |
| `ios_only` | el import de RN pasa a `import { Platform, Pressable, ScrollView, Text, View } from 'react-native';` y la opacidad, a `                        opacity: pressed && Platform.OS === 'ios' ? 0.8 : 1,` | `8518c92e` | **verde** 222 de 222. Punto ciego declarado: jest corre como iOS. Lo cubre R5 |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R4 — Cierre

1. **Suite completa**, sin pipe: 86 suites / 1612 tests / 1 snapshot,
   `exit=0`, o la base que mediste en §Antes de tocar nada más 2 tests y 0
   suites. El test, 169 de 169, y el de consistencia, 53 de 53.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/138_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/138_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. **Cifras de candado.** Se mueven solo las que dice la lista, y ninguna
   otra:

   | Comando | Base | Final |
   |---|---|---|
   | `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` | 1 | 0 |
   | `grep -cF '...CONTINUOUS_CORNER,' src/screens/home/index.tsx` | 1 | 2 |
   | `grep -cF 'opacity: pressed ? 0.8 : 1' src/screens/home/index.tsx` | 3 | 4 |
   | `grep -cF 'CONTINUOUS_CORNER' src/screens/home/index.tsx` (import y usos) | 3 | 3 |
   | `grep -cF 'testID="collar-pair-link"' src/screens/home/index.tsx` | 1 | 1 |
   | `grep -cF "onPress={() => router.push('/pairing')}" src/screens/home/index.tsx` | 1 | 1 |
   | `grep -cxF '                      className="min-h-11 items-center justify-center rounded-xl bg-accent-soft px-4"' src/screens/home/index.tsx` | 1 | 1 |
   | `grep -ci stylesheet src/screens/home/index.tsx src/screens/home/index.test.tsx` | 0 y 0 | 0 y 0 |
   | `grep -roF 'style={CONTINUOUS_CORNER}' src --include='*.ts' --include='*.tsx' \| grep -v '/__tests__/' \| grep -v '\.test\.tsx\?:' \| wc -l` | 32 | 31 |
   | `grep -c '#138' src/screens/home/index.test.tsx` | 0 | 6 |
   | `grep -c '#138 R[1-3]' src/screens/home/index.test.tsx` | 0 | 6 |
   | `grep -c '#138' src/__tests__/consistency-classnames.test.ts` y `grep -c '#138 R3' …` | 0 y 0 | 3 y 3 |
   | `grep -c '#136 R3' src/__tests__/consistency-classnames.test.ts` | 3 | 3 |
   | `grep -c '#136' src/screens/home/index.test.tsx` | 7 | 8 |
   | `grep -c '^describe(' src/screens/home/index.test.tsx` | 41 | 41 |
   | `grep -c "'responderGrant'" src/screens/home/index.test.tsx` | 3 | 4 |
   | `grep -c "'responderTerminate'" src/screens/home/index.test.tsx` | 1 | 2 |
   | `grep -c 'collar-pair-link' src/screens/home/index.test.tsx` | 2 | 4 |
   | `grep -cF "toEqual(['rounded-xl'])" src/screens/home/index.test.tsx` | 1 | 2 |
   | `grep -c -- '-\[' src/screens/home/index.test.tsx` | 0 | 0 |
   | `grep -cF "[join('screens', 'home', 'index.tsx'), 0]," src/__tests__/consistency-classnames.test.ts` | 0 | 1 |
   | `grep -cF "[join('screens', 'home', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts` | 1 | 0 |
   | `grep -cF '.toBe(33 + 1 + 1 - 1 - 1);' src/__tests__/consistency-classnames.test.ts` | 0 | 1 |
   | `grep -cF ') ?? []).toHaveLength(0);' src/__tests__/consistency-classnames.test.ts` | 0 | 1 |
   | `grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31);' src/__tests__/consistency-classnames.test.ts` | 0 | 1 |

   En la tabla, `\|` es un `|` del comando: escápalo solo aquí.

   Las seis líneas con `#138` del test son los dos títulos de `it` y las
   cuatro de comentario que empiezan por `// #138 R1:` (tres) y
   `// #138 R2:` (una). La línea de `#136` que se suma es la del comentario
   `// the Pressable pressed, as in the #136 R1 quick action tile test.`.
   Ningún `#138` ni `#136` suelto.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista
     **solo** la Home, el test y el test de consistencia (83 inserciones, 7
     borrados);
   - `git diff --numstat origin/main...HEAD -- mobile-pet-tracker/` da `4	1`
     para la Home, `69	0` para el test y `10	6` para el de consistencia;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `0d439ebc386fbed4be6acf76b426383224eb602a` |
   | `src/screens/home/index.test.tsx` | `d919055869711334eeca54c4e725d26789558e6d` |
   | `src/__tests__/consistency-classnames.test.ts` | `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7` |

7. Escribe `progress/impl_mobile-collar-pair-link-pressed-feedback.md` con:
   - las skills que cargaste;
   - la base medida;
   - las salidas de cada rojo y del verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y las cifras de R4.

   Rellena los hashes en [[traceability]]. Las filas de R4 y R5 no llevan
   commit rojo. La de R4 cita el hash del **verde común**, que es el último
   commit de código, no el de este commit. Commitea:

   ```bash
   git add progress/impl_mobile-collar-pair-link-pressed-feedback.md specs/mobile-collar-pair-link-pressed-feedback/traceability.md
   git commit -m "docs(mobile): record the collar pair link pressed feedback evidence (R4)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## R5 — Prueba de humo (humano)

No es tuya. La corre el humano en un dev build de Android tras el veredicto
del `reviewer`, con los pasos de [[requirements]] §Prueba de humo del humano,
y marca su casilla allí. No la marques ni la simules.

## Lo que NO hay que tocar

- En la Home, todo salvo la línea del `style` de `collar-pair-link`. En
  particular, su `className`, su `onPress`, su texto, la condición
  `device === null`, los tiles de `QUICK_ACTIONS`, la campana, «Ver todos» y
  los imports.
- Los demás `it` del test, incluidos los dos que ya hay en el `describe` del
  collar, y sus helpers y mocks (`renderHome`, `makePet`, `makeDay`, los
  `mock*` y el `beforeEach` del `describe`).
- En el test de consistencia, todo salvo las líneas de los tres cambios de R3.
- `src/__tests__/design-drift.test.ts` y el resto de `src/__tests__/`.
- `src/theme/native-styles.ts`: solo se muta en la sonda `constant` y se
  restaura.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `src/hooks/use-push-registration.test.tsx`: lo toca la otra sesión.
- `docs/ui-guidelines.md`, `feature_list.json` y `STATUS.md`: los lleva el
  `leader`.
