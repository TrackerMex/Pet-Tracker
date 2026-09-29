---
feature: "mobile-quick-actions-pressed-feedback"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Tareas — [[mobile-quick-actions-pressed-feedback]] (#136)

> Orden TDD con **rojo natural** (C4, vía a): la base no cumple R1, R2 ni R3,
> así que cada test nuevo o enmendado da rojo contra la Home de base, sin
> mutaciones versionadas. Van **tres commits rojos** de solo tests (R1, R2,
> R3) y **un verde** que cambia la Home y los pone verdes a la vez. No se puede
> hacer un verde por requisito: el cambio de la Home, solo, pondría rojos
> `#81 R3`, `#62 R14` y `#98 R10` sin enmendar. **Un commit por paso, test
> primero.** Nunca mezcles test e implementación en el mismo commit.
>
> Cada requisito crea su sujeto antes de aseverarlo. Los tres tiles, la fila y
> el `describe` de #81 ya existen en la base. R1 asevera sobre esos tiles. R2
> enmienda un `it` que ya existe, y R3, tres `it` del test de consistencia que
> ya existen.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Ninguna ruta de
> esta feature lleva paréntesis. Los números de línea **no son anclas**: todo
> se localiza por contenido, con el `grep` que se cita. Nombres cortos:
>
> - «la Home» es `src/screens/home/index.tsx`;
> - «el test» es `src/screens/home/index.test.tsx`;
> - «el test de consistencia» es `src/__tests__/consistency-classnames.test.ts`;
> - «el `describe` de #81» es
>   `describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado'`.

## Antes de tocar nada

1. `git branch --show-current` da
   `feature/136-mobile-quick-actions-pressed-feedback`. Si no, **para**.
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
     Su receta de pulsado (escala 0.97 con transición CSS de Reanimated) está
     descartada en [[design]] §Alternativas. Si la cargas igualmente, esta spec
     gana: cambio de opacidad instantáneo, sin Reanimated, sin transición, sin
     escala y sin háptica.
   - Anota en el reporte qué skills cargaste.
   - Todo se corre con `bun` y `bunx`, nunca con `npm` ni `npx`. No instales
     nada. No corras `./init.sh` ni los e2e: otra sesión (#133) comparte
     Postgres y LocalStack.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `ff591a1f567e00c0aee57db29ca1706b3a925cad` |
   | `src/screens/home/index.test.tsx` | `f91c8971e21198c4a65eebf0e40aaf35f0ac6472` |
   | `src/__tests__/consistency-classnames.test.ts` | `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas
   de esta spec ya no valen.
6. Mide la base, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_home.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_cons.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/136_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/136_home.log /tmp/136_cons.log /tmp/136_full.log
   ```

   Esperado:
   - el test, 166 passed de 166, `exit=0`;
   - el de consistencia, 53 passed de 53, `exit=0`;
   - la suite, 86 passed de 86 suites, 1608 passed de 1608 tests y 1
     snapshot, `exit=0`.

   Si la suite da otra cifra con `exit=0` (porque otra feature mergeó antes
   sin tocar estos tres ficheros), **anota la medida** y úsala como base: el
   delta exigido es +1 test y +0 suites sobre lo medido. Nunca pongas
   `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería el del último
   comando. Los bloques `● Console` del log son ruido y no cuentan como fallo:
   los rojos se cuentan por la línea `Tests:`.
7. **Reglas de literales en el test**, comentarios incluidos, por
   `src/__tests__/design-drift.test.ts`, que escanea el test:
   - la cita de la feature va siempre como `#136 R<n>`, **nunca `#136`
     suelto**: la guarda de hexadecimales lo lee como un color de tres
     dígitos;
   - ni `StyleSheet` ni ningún `-[` (clase arbitraria), en ningún caso,
     tampoco en un comentario;
   - ningún color hexadecimal.

   En el test de consistencia, la cita va también como `#136 R3`.
8. **Los esperados son literales.** Los `testID` y los objetos de `style` van
   escritos a mano, como en los bloques de abajo. No añadas ningún import al
   test ni leas nada de la Home ni de `src/theme/native-styles.ts`. Todo lo
   que usa el `it` nuevo (`renderHome`, `screen`, `fireEvent`, `waitFor`) ya
   está importado o declarado en el test.

## R1 — Cada tile se atenúa a 0.8 mientras se pulsa, solo él, y vuelve a 1

### (1) Rojo

1. En el test, dentro del `describe` de #81, justo **antes** de la línea
   `  it('#81 R4: la sección pone el rótulo encima de la fila, y la fila, los tres tiles sin envoltorio', async () => {`
   (`grep -c "  it('#81 R4: la sección pone el rótulo encima de la fila" src/screens/home/index.test.tsx`
   da 1), y por tanto justo después del `  });` y la línea en blanco que
   cierran `#81 R3`, pega este bloque seguido de **una** línea en blanco:

   ```tsx
     it('#136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua', async () => {
       await renderHome();
       await screen.findByTestId('quick-action-weight');
       const testIDs = [
         'quick-action-weight',
         'quick-action-reminder',
         'quick-action-documents',
       ];

       for (const testID of testIDs) {
         const tile = screen.getByTestId(testID);

         // #136 R1: the whole style with toEqual, at rest and pressed. toHaveStyle
         // matches a subset and would let a stray key or a lost corner through.
         expect(tile.props.style).toEqual({
           borderCurve: 'continuous',
           opacity: 1,
         });

         // #136 R1: responderGrant is the first event of a real press and leaves
         // the Pressable pressed, as in the #122 R2 bell test.
         await fireEvent(tile, 'responderGrant', {
           nativeEvent: {},
           persist: () => undefined,
         });

         expect(tile.props.style).toEqual({
           borderCurve: 'continuous',
           opacity: 0.8,
         });
         // #136 R1: only the pressed tile dims. A pressed state shared by the row
         // turns red here.
         for (const otherID of testIDs.filter((id) => id !== testID)) {
           expect(screen.getByTestId(otherID).props.style).toEqual({
             borderCurve: 'continuous',
             opacity: 1,
           });
         }

         // #136 R1: responderTerminate ends the press through the same pressOut
         // path as a release, without onPress: a release needs a native target
         // that the test tree lacks. The pressed state clears 130 ms later, the
         // minimum press duration of Pressability, so waitFor polls for it.
         await fireEvent(tile, 'responderTerminate', {
           nativeEvent: {},
           persist: () => undefined,
         });

         await waitFor(() =>
           expect(tile.props.style).toEqual({
             borderCurve: 'continuous',
             opacity: 1,
           }),
         );
       }
     });
   ```

   El bloque va con la sangría del fichero: dos espacios para el `it`. Las
   líneas de comentario no pasan de 80 columnas.
2. `git hash-object src/screens/home/index.test.tsx` da
   `d0126da0704ef7c86aae0045b231b465db8fa08b`. Si no, el pegado no es el de la
   spec: corrígelo antes de seguir.
3. Mide el test, sin pipe:
   `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_r1.log 2>&1; echo "exit=$?"`.
   Esperado: 1 failed, 166 passed, 167 total, `exit=1`. El rojo es
   `#81 R1-R6: … › #136 R1: …`, por `expect(received).toEqual(expected)`, en
   la primera aserción (reposo de `quick-action-weight`): la Home de base da
   `{ borderCurve: 'continuous' }`, sin opacidad. **Por aserción**, no por
   consulta.
4. Commit rojo, desde la raíz:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx
   git commit -m "test(mobile): expect pressed feedback on each quick action tile (R1)"
   ```

### (2) Verde

En §Verde común, tras el rojo de R3.

### (3) Refactor

Ninguno. La tabla de `testID` y los literales de `style` se repiten a
propósito: cada aserción se lee sola. No los extraigas a una constante.

## R2 — En reposo, cada tile lleva la esquina y la opacidad 1

### (1) Rojo

1. En el test, dentro de
   `it('#81 R3: cada tile lleva rounded-xl como único radio y la esquina continua'`,
   sustituye la línea (6 espacios de sangría)

   ```tsx
         expect(tile.props.style).toEqual({ borderCurve: 'continuous' });
   ```

   (`grep -cF "      expect(tile.props.style).toEqual({ borderCurve: 'continuous' });" src/screens/home/index.test.tsx`
   da 1) por:

   ```tsx
         // #136 R2: at rest the corner travels with the opacity of the pressed
         // recipe; #136 R1 locks the pressed and released values.
         expect(tile.props.style).toEqual({
           borderCurve: 'continuous',
           opacity: 1,
         });
   ```

   El título de `#81 R3` y su aserción del radio no cambian.
2. `git hash-object src/screens/home/index.test.tsx` da
   `04135c8e262f601ad61670f34c4d959192d150c9` (4616 líneas).
3. Mide el test, sin pipe (`> /tmp/136_r2.log 2>&1; echo "exit=$?"`).
   Esperado: 2 failed, 165 passed, 167 total, `exit=1`. Los rojos son
   `#81 R1-R6: … › #81 R3: …` y `#81 R1-R6: … › #136 R1: …`, los dos por
   `expect(received).toEqual(expected)`.
4. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.test.tsx
   git commit -m "test(mobile): expect the resting opacity in the quick action corner lock (R2)"
   ```

### (2) Verde

En §Verde común.

### (3) Refactor

Ninguno.

## R3 — La Home deja una sola esquina directa, y el repo, 32

### (1) Rojo

En el test de consistencia, cuatro cambios. Cada línea de origen aparece una
sola vez (`grep -cF` da 1 con la línea entera, sangría incluida):

1. En `const directUses = [`, dentro de
   `describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua'`,
   sustituye

   ```ts
       [join('screens', 'home', 'index.tsx'), 2],
   ```

   por:

   ```ts
       // #136 R3: the quick action tiles spread the corner inside their pressed
       // style, so the Home keeps a single direct use, collar-pair-link.
       [join('screens', 'home', 'index.tsx'), 1],
   ```

2. En `it('fusiona la esquina una vez y la entrega a las dos ramas de Card'`,
   justo encima de la línea `    expect(` que precede a
   `      directUses.reduce((total, [, count]) => total + count, 2),`, añade

   ```ts
       // #136 R3: minus one, the tiles' corner now travels in their pressed style.
   ```

   y sustituye `    ).toBe(33 + 1 + 1);` por `    ).toBe(33 + 1 + 1 - 1);`.
3. En `describe('#98 R10: los candados que esta feature no mueve'`, sustituye

   ```ts
       expect(home.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
   ```

   por:

   ```ts
       // #136 R3: the tiles' corner moved into their pressed style, one direct
       // use less in the Home and in the repo.
       expect(home.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(1);
   ```

4. En el mismo `it`, sustituye
   `    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(33);` por
   `    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(32);`.

Después:

1. `git hash-object src/__tests__/consistency-classnames.test.ts` da
   `e62f88ad4d60178a18323551f5eb6d19641dbd72`.
2. Mide el test de consistencia, sin pipe
   (`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_r3.log 2>&1; echo "exit=$?"`).
   Esperado: 2 failed, 51 passed, 53 total, `exit=1`. Los rojos, los dos por
   `expect(received).toHaveLength(expected)`:
   - `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 1 esquinas`;
   - `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`.

   `fusiona la esquina una vez y la entrega a las dos ramas de Card` queda
   **verde**: suma la tabla y no lee el fuente. Es lo esperado.
3. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
   git commit -m "test(mobile): move the quick action corner out of the direct corner counts (R3)"
   ```

### (2) Verde

En §Verde común.

### (3) Refactor

Ninguno.

## Verde común (R1, R2, R3)

1. En la Home, dentro de `{QUICK_ACTIONS.map(`, sustituye la línea del
   `style` del tile, que es exactamente `style={CONTINUOUS_CORNER}` con **20**
   espacios de sangría, justo debajo del ``className={`min-h-11 flex-1 …``
   del tile y justo encima de
   `                    onPress={() => router.push(href(selectedPetId))}`
   (`grep -cxF '                    style={CONTINUOUS_CORNER}' src/screens/home/index.tsx`
   da 1), por estas cuatro líneas:

   ```tsx
                       style={({ pressed }) => ({
                         ...CONTINUOUS_CORNER,
                         opacity: pressed ? 0.8 : 1,
                       })}
   ```

   **Cuidado**: `grep -cF` sin `-x` da 2, porque también casa con el `style`
   de `collar-pair-link`, que va con **22** espacios y **no se toca**. No
   cambies imports: `CONTINUOUS_CORNER` y `Pressable` ya están importados. Sin
   `useState`, sin `StyleSheet`, sin Reanimated y sin háptica.
2. `git hash-object src/screens/home/index.tsx` da
   `cb61d0c64deb0c911031a8468a8c397255b53979`.
3. Mide, sin pipe:

   ```bash
   bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/136_green_home.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/136_green_cons.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/136_green_full.log 2>&1; echo "exit=$?"
   ```

   Esperado: el test, 167 de 167; el de consistencia, 53 de 53; la suite, 86
   suites / 1609 tests / 1 snapshot (o tu base +1 test), `exit=0` en los tres.
4. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/136_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`, y
   `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
5. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/index.tsx
   git commit -m "feat(mobile): dim each quick action tile while pressed (R1,R2,R3)"
   ```

### Refactor

Ninguno. No extraigas la receta a una constante ni a un helper compartido con
la campana o «Ver todos»: sus `style` tienen candados de fuente propios en el
test (regex sobre su etiqueta de apertura) que no deben moverse.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la Home.
2. Comprueba con `git hash-object src/screens/home/index.tsx` que la Home
   mutada da el blob de la tabla. Si no coincide, la mutación no es la de la
   spec: corrígela antes de medir.
3. Corre los dos tests juntos, sin pipe:
   `bunx jest --runTestsByPath src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_probe.log 2>&1; echo "exit=$?"`.
   Son 220 tests (167 + 53).
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su
   error**. `expect(received).<matcher>` es un rojo **por aserción**, y
   `Unable to find an element with testID: …` es un rojo **por consulta**.
   Para `shared` y `sticky`, anota también la aserción donde falla (el marco
   de código `>` del log).
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
   (desde la raíz). **Nunca** con `git checkout <commit> --`, que deja la
   mutación en el índice.
6. `git status --porcelain -- mobile-pet-tracker` sale vacío y
   `git diff --cached --name-only` sale vacío. Si no, **para**.

**Nada de esto se commitea.** No uses `git stash` ni `rm -f`. La tabla medida
va al reporte, con la columna «medido» rellena por ti.

Líneas de la Home final que usan las mutaciones (cada una aparece una sola
vez con `grep -cxF`):

- «la apertura»: `                    style={({ pressed }) => ({` (20 espacios);
- «la esquina»: `                      ...CONTINUOUS_CORNER,` (22 espacios);
- «la opacidad»: `                      opacity: pressed ? 0.8 : 1,` (22 espacios);
- «el cierre»: `                    })}` (20 espacios);
- «el `style` del collar»: `                      style={CONTINUOUS_CORNER}` (22 espacios);
- «la línea de estado»: `  const [activitySelection, setActivitySelection] = useState<{`;
- «el import de RN»: `import { Pressable, ScrollView, Text, View } from 'react-native';`.

«La receta» son las cuatro líneas, de la apertura al cierre. `N` es el índice
del tile en `QUICK_ACTIONS`: 0 peso, 1 recordatorio, 2 documentos. «Spec» es
lo que se midió al escribir la spec: la Home mutada contra el test final
(167 tests), solo el test. El test de consistencia no se midió por sonda: su
columna es deducida, porque ninguna mutación salvo `collar` cambia el número
de `style={CONTINUOUS_CORNER}`.

| Sonda | Mutación | Blob | Spec (test) | Exigido (220 tests) |
|---|---|---|---|---|
| `t0` | la apertura pasa a `                    style={index === 0 ? CONTINUOUS_CORNER : ({ pressed }) => ({` | `6d701cc4` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `t1` | igual con `index === 1` | `9b755110` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `t2` | igual con `index === 2` | `f5254f92` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `nopress_t0` | la opacidad pasa a `                      opacity: pressed && index !== 0 ? 0.8 : 1,` | `e17d4e5c` | rojo 1 | rojo 1: `#136 R1`, por `toEqual` |
| `nopress_t1` | igual con `index !== 1` | `73dc6a81` | rojo 1 | rojo 1: `#136 R1`, por `toEqual` |
| `nopress_t2` | igual con `index !== 2` | `69f56555` | rojo 1 | rojo 1: `#136 R1`, por `toEqual` |
| `pressed07` | la opacidad pasa a `                      opacity: pressed ? 0.7 : 1,` | `3541059e` | rojo 1 | rojo 1: `#136 R1`, por `toEqual` |
| `pressed07_t1` | la opacidad pasa a `                      opacity: pressed ? (index === 1 ? 0.7 : 0.8) : 1,` | `6fbb9451` | rojo 1 | rojo 1: `#136 R1`, por `toEqual` |
| `rest09` | la opacidad pasa a `                      opacity: pressed ? 0.8 : 0.9,` | `8bfc769e` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `stray` | debajo de la opacidad, `                      overflow: 'hidden',` | `932c6c13` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `nocorner` | se borra la esquina | `c4d404fe` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `nostyle` | se borra la receta entera (las cuatro líneas) | `82c9a371` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual` |
| `array` | la receta pasa a `                    style={({ pressed }) => [`, `                      CONTINUOUS_CORNER,`, `                      { opacity: pressed ? 0.8 : 1 },`, `                    ]}` | `28cc7f5e` | rojo 2 | rojo 2: `#136 R1` y `#81 R3`, por `toEqual`. Candado de forma, a propósito ([[design]] §D2) |
| `shared` | encima de la línea de estado, `  const [quickPressed, setQuickPressed] = useState(false);`. La receta pasa a `                    style={{`, la esquina, `                      opacity: quickPressed ? 0.8 : 1,`, `                    }}`, `                    onPressIn={() => setQuickPressed(true)}` y `                    onPressOut={() => setQuickPressed(false)}` | `fde29fb3` | rojo 1 | rojo 1: `#136 R1`, por `toEqual`, en la aserción de los otros dos tiles (paso 2) |
| `sticky` | encima de la línea de estado, `  const [stuck, setStuck] = useState<number \| null>(null);`. La receta pasa a `                    style={{`, la esquina, `                      opacity: stuck === index ? 0.8 : 1,`, `                    }}` y `                    onPressIn={() => setStuck(index)}` | `2c8fe39d` | rojo 1 | rojo 1: `#136 R1`, por `toEqual`, dentro del `waitFor` tras `responderTerminate` (paso 3) |
| `collar` | el `style` del collar pasa a `                      style={({ pressed }) => ({`, `                        ...CONTINUOUS_CORNER,`, `                        opacity: pressed ? 0.8 : 1,`, `                      })}` | `0d439ebc` | **verde** 167 de 167 | rojo 2: `#62 R14 › screens/home/index.tsx importa y aplica sus 1 esquinas` y `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, por `toHaveLength` |
| `android_only` | el import de RN pasa a `import { Platform, Pressable, ScrollView, Text, View } from 'react-native';` y la opacidad, a `                      opacity: pressed && Platform.OS !== 'android' ? 0.8 : 1,` | `97ceecbb` | **verde** 167 de 167 | **verde** 220 de 220. Punto ciego declarado: jest corre como iOS. Lo cubre R5 |

En `sticky`, la barra de `number | null` es la de la mutación: la tabla la
escapa para que no parta la celda.

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R4 — Cierre

1. **Suite completa**, sin pipe: 86 suites / 1609 tests / 1 snapshot,
   `exit=0`, o la base que mediste en §Antes de tocar nada más 1 test y 0
   suites. El test, 167 de 167, y el de consistencia, 53 de 53.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/136_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/136_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. **Cifras de candado.** Se mueven solo las que dice la lista, y ninguna
   otra:

   | Comando | Base | Final |
   |---|---|---|
   | `grep -cF "style={CONTINUOUS_CORNER}" src/screens/home/index.tsx` | 2 | 1 |
   | `grep -cxF '                      style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` (collar) | 1 | 1 |
   | `grep -cF "...CONTINUOUS_CORNER," src/screens/home/index.tsx` | 0 | 1 |
   | `grep -cF "opacity: pressed ? 0.8 : 1" src/screens/home/index.tsx` | 2 | 3 |
   | `grep -cF "{QUICK_ACTIONS.map(" src/screens/home/index.tsx` | 1 | 1 |
   | `grep -cF "<Icon size={24}" src/screens/home/index.tsx` | 1 | 1 |
   | `grep -ci stylesheet src/screens/home/index.tsx src/screens/home/index.test.tsx` | 0 y 0 | 0 y 0 |
   | `grep -roF 'style={CONTINUOUS_CORNER}' src --include='*.ts' --include='*.tsx' \| grep -v '/__tests__/' \| grep -v '\.test\.tsx\?:' \| wc -l` | 33 | 32 |
   | `grep -c "#136" src/screens/home/index.test.tsx` | 0 | 7 |
   | `grep -c "#136 R[1-3]" src/screens/home/index.test.tsx` | 0 | 7 |
   | `grep -c "#136 R3" src/__tests__/consistency-classnames.test.ts` y `grep -c "#136" …` | 0 y 0 | 3 y 3 |
   | `grep -c "^describe(" src/screens/home/index.test.tsx` | 41 | 41 |
   | `grep -c "#81 R" src/screens/home/index.test.tsx` | 11 | 11 |
   | `grep -c responderGrant src/screens/home/index.test.tsx` | 4 | 6 |
   | `grep -c responderTerminate src/screens/home/index.test.tsx` | 0 | 2 |
   | `grep -cF "toEqual({ borderCurve: 'continuous' })" src/screens/home/index.test.tsx` | 1 | 0 |
   | `grep -c -- "-\[" src/screens/home/index.test.tsx` | 0 | 0 |

   En la tabla, `\|` es un `|` del comando: escápalo solo aquí.

   Las siete líneas con `#136` del test son el título del `it` nuevo, las
   cuatro de comentario que empiezan por `// #136 R1:` y las dos del
   comentario de `#81 R3` (`// #136 R2: …` y `// recipe; #136 R1 locks …`).
   Ningún `#136` suelto.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista
     **solo** la Home, el test y el test de consistencia;
   - `git diff --numstat origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
     da `4	1`;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/index.tsx` | `cb61d0c64deb0c911031a8468a8c397255b53979` |
   | `src/screens/home/index.test.tsx` | `04135c8e262f601ad61670f34c4d959192d150c9` |
   | `src/__tests__/consistency-classnames.test.ts` | `e62f88ad4d60178a18323551f5eb6d19641dbd72` |

7. Escribe `progress/impl_mobile-quick-actions-pressed-feedback.md` con:
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
   git add progress/impl_mobile-quick-actions-pressed-feedback.md specs/mobile-quick-actions-pressed-feedback/traceability.md
   git commit -m "docs(mobile): record the quick action pressed feedback evidence (R4)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## R5 — Prueba de humo (humano)

No es tuya. La corre el humano en un dev build de Android tras el veredicto
del `reviewer`, con los pasos de [[requirements]] §Prueba de humo del humano,
y marca su casilla allí. No la marques ni la simules.

## Lo que NO hay que tocar

- En la Home, todo salvo la línea del `style` del tile. En particular, el
  `style` de `collar-pair-link`, los de la campana y «Ver todos», los imports y
  `QUICK_ACTIONS`.
- Los demás `it` del test, incluidos los de
  `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos'` y los de
  #81 salvo la línea de `#81 R3`, y sus helpers y mocks (`renderHome`,
  `makePet`, `makeDay`, los `mock*` y el mock de `reicon-react-native`).
- En el test de consistencia, todo salvo las cuatro líneas de R3.
- `src/__tests__/design-drift.test.ts` y el resto de `src/__tests__/`.
- `src/screens/home/weekly-activity-chart.tsx` y su test.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `docs/ui-guidelines.md`, `feature_list.json` y `STATUS.md`: los lleva el
  `leader`.
