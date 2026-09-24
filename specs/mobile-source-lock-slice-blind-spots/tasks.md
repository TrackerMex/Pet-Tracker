---
feature: "mobile-source-lock-slice-blind-spots"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-source-lock-slice-blind-spots]] (#122)

> Disciplina TDD. Ver [[requirements]] para los R-ids y [[design]] para la
> medición que sostiene cada decisión. **No uses números de línea**: localiza
> todo con los `grep` que se dan.

## Antes de tocar nada

- [ ] `cd mobile-pet-tracker`. **Todos** los comandos de jest, `tsc` y `lint`
      corren desde ahí, porque los candados abren rutas relativas a
      `process.cwd()`. Los de `git` y `grep` con rutas `mobile-pet-tracker/…`
      corren desde la raíz del repo, y se indica.
- [ ] Antes de **cada** `bunx tsc --noEmit`:
      `test ! -e .expo/types/router.d.ts; echo "exit=$?"`. Si da `exit=1`,
      **para y repórtalo**. No borres el fichero, ni con `rm -f` ni con otra
      herramienta.
- [ ] **Si el sandbox te deniega un comando**, para y repórtalo. No lo
      sustituyas por otro que haga lo mismo.
- [ ] Usa **`bun` / `bunx`**, nunca `npx` ni `npm`.
- [ ] **Ningún comando con pipe.** `bunx jest | tail` devuelve el exit de
      `tail`. Guarda la salida en un fichero (`cmd > fichero 2>&1; echo "exit=$?"`)
      y léelo después.
- [ ] Jest **siempre** con `--runTestsByPath`, y comprueba que imprime
      `Test Suites: 1 …` (o `2 …` cuando pases los dos ficheros). La ruta
      `src/app/(tabs)/…` lleva paréntesis: pásala entre comillas simples.
- [ ] **No lances `./init.sh`** ni toques Postgres o LocalStack: son
      compartidos con el worktree de Backend.
- [ ] **No cargues ninguna skill.** Es un cambio solo de test, sin UI.
- [ ] **Mide la base tú mismo** y apunta las cifras en el reporte. En
      `f72c1fc0` eran: `food.test.tsx` 55, `home/index.test.tsx` 140,
      `design-drift.test.ts` 55, suite 82 suites / 1471 tests / 1 snapshot,
      `tsc` 0 y `lint` 0. Si difieren porque otra feature mergeó, vale **tu**
      base: el gate es el delta, **+0 suites y +3 tests**.
- [ ] **En `src/screens/home/index.test.tsx` no escribas `#` + número** salvo en
      la forma `#122 R1` / `#122 R2`. Una cita suelta (`#122`, `(#122)`,
      `#121/#122`) pone rojos cinco guards de `src/__tests__/design-drift.test.ts`,
      y la palabra `StyleSheet` tampoco puede aparecer ([[design]] §Los guards).
      Los literales de esta spec ya lo cumplen: cópialos tal cual.

Comandos canónicos (desde `mobile-pet-tracker/`):

```bash
# los dos ficheros de los candados, en una corrida (Test Suites: 2)
bunx jest --runTestsByPath src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/122_locks.log 2>&1; echo "exit=$?"

# el guard de hex
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/122_drift.log 2>&1; echo "exit=$?"

# suite completa
bunx jest > /tmp/122_all.log 2>&1; echo "exit=$?"

# typecheck y lint
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bunx tsc --noEmit > /tmp/122_tsc.log 2>&1; echo "exit=$?"
bunx expo lint > /tmp/122_lint.log 2>&1; echo "exit=$?"

# blobs (desde la raíz del repo)
git hash-object mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'
git hash-object mobile-pet-tracker/src/screens/home/index.test.tsx 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'
```

**Blobs de partida** (base `f72c1fc0`): `index.tsx`
`dbb5b0346895cfc26705bee2257d1f8a8815df6c`, `food.tsx`
`e310ff45ac9a6abc5475e983a2c03e1d7b5f909b`, `home/index.test.tsx`
`c12609124a75370927e7984c9dad5714d7a0cb1e`, `food.test.tsx`
`4712826944e6e2d1465a23034cff675b1f4c5580`, `docs/conventions.md`
`481432d29dab1f48caa7df29c3d0dbd90cd3bb85`. Si alguno no coincide, otra
feature ha mergeado encima: los blobs de esta spec dejan de valer como control
exacto, y valen los greps y los veredictos.

---

## Los tres elementos de producción

En lo que sigue, «**la receta**» es siempre la línea única
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`. Cada elemento se
localiza por su ancla, que aparece una sola vez en su fichero.

**B**, `src/screens/home/index.tsx` (`grep -n 'testID="home-alerts-bell"'`):

```tsx
            <Pressable
              testID="home-alerts-bell"
              accessibilityRole="button"
              accessibilityLabel={
                hasOpenAlerts
                  ? t('home.alertsBellUnread')
                  : t('home.alertsBell')
              }
              className="size-11 items-center justify-center rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              onPress={() => router.push('/alerts')}
            >
              <Bell size={24} color={muted} />
              {hasOpenAlerts ? (
                <View
                  testID="home-alerts-dot"
                  className="absolute right-1 top-1 size-2.5 rounded-full bg-danger"
                />
              ) : null}
            </Pressable>
```

**S**, `src/screens/home/index.tsx` (`grep -n 'testID="reminders-see-all"'`):

```tsx
              <Pressable
                testID="reminders-see-all"
                accessibilityRole="button"
                className="min-h-11 justify-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={() => router.push('/reminders')}
              >
                <Text className="text-xs font-semibold text-accent-strong">
                  {t('home.remindersSeeAll')}
                </Text>
              </Pressable>
```

**M**, `src/app/(tabs)/food.tsx` (``grep -n 'testID={`meal-toggle-${index}`}'``):

```tsx
                      <Pressable
                        testID={`meal-toggle-${index}`}
                        accessibilityRole="button"
                        accessibilityLabel={
                          served
                            ? t('food.undoServed', { time: mealTime })
                            : t('food.markServed', { time: mealTime })
                        }
                        disabled={pendingMealTime === mealTime}
                        className="min-h-11 justify-center"
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.8 : 1,
                        })}
                        onPress={() => void toggleMeal(mealTime, served)}
                      >
                        <Text
                          testID={
                            served
                              ? `meal-served-${index}`
                              : `meal-pending-${index}`
                          }
                          …
                        </Text>
                      </Pressable>
```

Términos, por elemento:

| | B | S | M |
|---|---|---|---|
| **la línea de estilo** | la línea de la receta **de este bloque**. La de S **no se toca nunca** en una sonda de B, ni al revés | la línea de la receta de este bloque | las **tres** líneas `style={({ pressed }) => ({` … `})}` de este bloque |
| **el ancla** | `testID="home-alerts-bell"` | `testID="reminders-see-all"` | ``testID={`meal-toggle-${index}`}`` |
| **el primer hijo** | la línea `<Bell size={24} color={muted} />` | la línea `<Text className="text-xs font-semibold text-accent-strong">` | la línea `<Text` justo debajo del `>` del botón |
| **la condición** | `hasOpenAlerts` | `hasOpenAlerts` | `served` |

Todas las líneas que se añaden van al sangrado de sus vecinas.

---

## R1 — unicidad del ancla, probada con P4

R1 es un candado nuevo sobre código **ya correcto**, así que nacería verde.
Por eso va por la **vía (b) de C4**: el commit rojo versiona una mutación de
producción y el verde la revierte, igual que #109, #112 y #121. Mutar un doble
no vale (C4, quinto punto). Aquí la mutación toca **dos ficheros de
producción**, porque los tres call-sites viven en dos pantallas.

**Este par va antes que el de R2.** Con R2 ya puesta, P4 caería también por la
pata que pulsa y el rojo de R1 no sería solo suyo (medido: 6 rojos en vez de 3).

### (0) Evidencia del agujero, antes de tocar los tests

- [ ] Aplica **P4 en los tres elementos**. En cada uno, la línea de estilo pasa a
      `style={{ opacity: 1 }}` (en M, las tres líneas pasan a esa sola), y
      **justo encima** de su `<Pressable` se añade el señuelo:

      ```diff
      # B, src/screens/home/index.tsx
      +            {false && <Pressable testID="home-alerts-bell" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />}
                   <Pressable
                     testID="home-alerts-bell"
      …
      -              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      +              style={{ opacity: 1 }}
                     onPress={() => router.push('/alerts')}

      # S, src/screens/home/index.tsx
      +              {false && <Pressable testID="reminders-see-all" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />}
                     <Pressable
                       testID="reminders-see-all"
      …
      -                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      +                style={{ opacity: 1 }}
                       onPress={() => router.push('/reminders')}

      # M, src/app/(tabs)/food.tsx
      +                      {false && <Pressable testID={`meal-toggle-${index}`} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />}
                             <Pressable
                               testID={`meal-toggle-${index}`}
      …
      -                        style={({ pressed }) => ({
      -                          opacity: pressed ? 0.8 : 1,
      -                        })}
      +                        style={{ opacity: 1 }}
                               onPress={() => void toggleMeal(mealTime, served)}
      ```

- [ ] Blobs (desde la raíz): `index.tsx` →
      `491986e0990bbbc168d44b593dbc04f9f72e5e86`, `food.tsx` →
      `2be008ce7f79b8e51808c80a2e4cc4a40b493f07`.
- [ ] Con los tests **todavía sin tocar**, corre los dos ficheros. Esperado:
      **VERDE, `exit=0`**, 140 + 55. En `f72c1fc0` la **suite entera** también
      da 82/1471 en verde, y `tsc` y `lint` dan 0. Guarda el log: es la prueba
      del agujero.

### (1) Commit ROJO — la línea de unicidad, con P4 puesta

- [ ] En los tres `it` de los candados de fuente, dos cambios y nada más: el
      título gana el sufijo `, con ancla única (#122 R1)` y se añade **una
      línea justo antes** de su `expect(block).toMatch(`:

      ```diff
      # src/app/(tabs)/__tests__/food.test.tsx
      -  it('#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle', () => {
      +  it('#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle, con ancla única (#122 R1)', () => {
      …
             source.indexOf('<', anchor),
           );

      +    expect(source.lastIndexOf('testID={`meal-toggle-${index}`}')).toBe(anchor);
           expect(block).toMatch(

      # src/screens/home/index.test.tsx, campana
      -  it('#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura', () => {
      +  it('#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura, con ancla única (#122 R1)', () => {
      …
           expect(source).not.toContain("'/alerts' as Href");
      +    expect(source.lastIndexOf('testID="home-alerts-bell"')).toBe(anchor);
           expect(block).toMatch(

      # src/screens/home/index.test.tsx, enlace
      -    it('#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura', async () => {
      +    it('#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura, con ancla única (#122 R1)', async () => {
      …
             expect(opacityOf(link.props.style)).toBe(1);
      +      expect(source.lastIndexOf('testID="reminders-see-all"')).toBe(anchor);
             expect(block).toMatch(
      ```

      - [ ] **No toques** el ancla, el recorte, la regex ni las demás
            aserciones, ni su orden.
- [ ] Blobs de los tests: `home/index.test.tsx` →
      `979cb875bf602c6e3d05aeb5905894da63b79257`, `food.test.tsx` →
      `6b554fc03a3d2bd93a4a27b2e84ca85f823c2ebc`.
- [ ] Corre los dos ficheros. Esperado: **ROJO, `exit=1`, 3 failed**: 2 de 140
      en `home/index.test.tsx` y 1 de 55 en `food.test.tsx`. Los tres son los
      `it` renombrados, y los tres fallan por **`toBe`** en la línea de unicidad,
      con `Expected` y `Received` distintos (dos posiciones del fuente: la del
      señuelo y la del elemento). Si falla otra aserción, otro test o sale un
      `ReferenceError`, para.
- [ ] Commit (los cuatro ficheros):
      `test(mobile): expose the non-unique anchor hole in the three source locks (R1)`

### (2) Commit VERDE — revertir P4

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx 'src/app/(tabs)/food.tsx'`.
      `HEAD` es el commit rojo, así que `HEAD~1` tiene los dos ficheros sin
      mutar.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx 'src/app/(tabs)/food.tsx'`
      → `exit=0`.
- [ ] Los dos ficheros de test: **VERDE, `exit=0`**, 140 + 55 (o tu base).
- [ ] Commit:
      `test(mobile): assert a unique anchor in the three source locks (R1)`

### (3) Refactor

- [ ] No hay refactor. No extraigas un helper para la unicidad
      ([[design]] §Alternativas).

---

## R2 — la pata que pulsa, probada con P1

Mismo esquema: vía (b), dos ficheros de producción en el rojo.

### (0) Evidencia del agujero, sobre el verde de R1

- [ ] Aplica **P1 en los tres elementos**: la línea de estilo pasa a
      `style={{ opacity: 1 }}` y **justo encima del primer hijo** se añade el
      comentario JSX con la receta:

      ```diff
      # B
      -              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      +              style={{ opacity: 1 }}
                     onPress={() => router.push('/alerts')}
                   >
      +              {/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}
                     <Bell size={24} color={muted} />

      # S
      -                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      +                style={{ opacity: 1 }}
                       onPress={() => router.push('/reminders')}
                     >
      +                {/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}
                       <Text className="text-xs font-semibold text-accent-strong">

      # M
      -                        style={({ pressed }) => ({
      -                          opacity: pressed ? 0.8 : 1,
      -                        })}
      +                        style={{ opacity: 1 }}
                               onPress={() => void toggleMeal(mealTime, served)}
                             >
      +                        {/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}
                               <Text
      ```

- [ ] Blobs: `index.tsx` → `3b3cc0e6ff9352c160088a0427df1706fd40b2a9`,
      `food.tsx` → `e3d058dfcd30f2648ffe8de4bf321befe90b737e`.
- [ ] Con los tests del verde de R1, corre los dos ficheros. Esperado:
      **VERDE, `exit=0`**: la unicidad no ve P1. En `f72c1fc0` la suite entera
      también da 82/1471, y `tsc` y `lint` 0. Guarda el log.

### (1) Commit ROJO — los tres `it` que pulsan, con P1 puesta

- [ ] En `src/app/(tabs)/__tests__/food.test.tsx`, **justo después** del `it`
      renombrado de R1 y dentro del mismo
      `describe('#107 R5: el botón por franja conserva su feedback de pulsado')`:

      ```ts

        it('#122 R2: el botón baja a opacidad 0.8 mientras se pulsa', async () => {
          await renderFood();
          const toggle = await screen.findByTestId('meal-toggle-0');

          await fireEvent(toggle, 'responderGrant', {
            nativeEvent: {},
            persist: () => undefined,
          });

          expect(toggle).toHaveStyle({ opacity: 0.8 });
        });
      ```

- [ ] En `src/screens/home/index.test.tsx`, **justo después** del `it`
      renombrado de la campana (el que devuelve
      `grep -n "usa la ruta real sin cast Href"`), dentro de
      `describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`:

      ```ts

        it('#122 R2: la campana baja a opacidad 0.8 mientras se pulsa', async () => {
          await renderHome();
          const bell = await screen.findByTestId('home-alerts-bell');

          await fireEvent(bell, 'responderGrant', {
            nativeEvent: {},
            persist: () => undefined,
          });

          expect(bell).toHaveStyle({ opacity: 0.8 });
        });
      ```

- [ ] En el mismo fichero, **justo después** del `it` renombrado del enlace
      (`grep -n "muestra feedback visual al pulsar el enlace"`), dentro de
      `describe('#70 R10: enlace a la lista de recordatorios')`, con un nivel más
      de sangrado:

      ```ts

          it('#122 R2: el enlace baja a opacidad 0.8 mientras se pulsa', async () => {
            await renderHome();
            const link = await screen.findByTestId('reminders-see-all');

            await fireEvent(link, 'responderGrant', {
              nativeEvent: {},
              persist: () => undefined,
            });

            expect(link).toHaveStyle({ opacity: 0.8 });
          });
      ```

      - [ ] **No uses `fireEvent(…, 'pressIn')` ni `userEvent.press`**: el
            primero no hace nada y el segundo suelta antes de poder leer
            ([[design]] §La premisa que cae). No vuelvas a consultar el
            elemento tras el evento: la misma referencia ya se actualiza.
      - [ ] No añadas imports: los dos ficheros ya importan `fireEvent` y
            `screen`, y `toHaveStyle` viene de los matchers de
            `@testing-library/react-native` que ya carga `test/jest-setup.js`.
- [ ] Blobs de los tests: `home/index.test.tsx` →
      `8a31a2f3f99c9bb62fcdb76e33810bf2e94424db`, `food.test.tsx` →
      `21cb670b6e825784f99d2d4951bafa55c31c4908`.
- [ ] Corre los dos ficheros. Esperado: **ROJO, `exit=1`, 3 failed**: 2 de 142
      y 1 de 56. Son los tres `#122 R2`, y los tres fallan por
      **`toHaveStyle`** con `- opacity: 0.8;` / `+ opacity: 1;`. Los tres `it` de
      R1 pasan (P1 no toca el ancla y la regex casa con el comentario). Si cae
      otro test o sale un `ReferenceError`, para.
- [ ] Commit (los cuatro ficheros):
      `test(mobile): expose the pressed-state hole behind the three source locks (R2)`

### (2) Commit VERDE — revertir P1

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx 'src/app/(tabs)/food.tsx'`.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx 'src/app/(tabs)/food.tsx'`
      → `exit=0`.
- [ ] Los dos ficheros: **VERDE, `exit=0`**, 142 + 56 (tu base + 2 y + 1).
- [ ] Commit:
      `test(mobile): press the three elements and read their opacity (R2)`

### (3) Refactor

- [ ] No hay refactor. No extraigas un helper para pulsar, ni compartas nada
      entre los dos ficheros.

---

## R3 — las sondas, sobre el verde de R2

Sobre el árbol **ya verde**: aplica la mutación, corre **el fichero de su
call-site** (`home/index.test.tsx` para B y S, `food.test.tsx` para M), apunta
el veredicto y el matcher de los dos `it` del call-site y cuántos «otros» caen,
y **revierte antes de la siguiente**. No se commitean. Todas parten del
elemento de producción intacto. Puedes escribirte un script que aplique cada
mutación por sustitución única (asevera que el texto aparece una vez) y
restaure el fichero. No lo commitees.

### Qué es cada sonda

| Sonda | Mutación exacta sobre el elemento |
|---|---|
| **N1** | la línea de estilo → `style={{ opacity: 1 }}` |
| **P1** | N1, y la línea `{/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}` justo antes del primer hijo |
| **O3** | N1, y la línea `{false && 'style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}'}` justo antes del primer hijo |
| **L2** | N1, y la línea `{'style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}'}` justo antes del primer hijo |
| **P2** | la línea de estilo → dos líneas: `// style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` y `style={{ opacity: 1 }}` |
| **P2b** | como P2, con `/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */` en la primera línea |
| **O1** | N1, y la línea `accessibilityHint="style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}"` justo después de la línea del ancla |
| **P4** | N1, y la línea `{false && <Pressable <ancla> style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />}` justo antes del `<Pressable` del elemento |
| **O4** | la línea `{/* <ancla> */}` justo antes del `<Pressable` del elemento; el elemento, intacto |
| **O2** | justo después de `const AnimatedView = Animated.createAnimatedComponent(View);` en el fichero del elemento, `const pressOverride: { style?: { opacity: number } } = {` / `  style: { opacity: 1 },` / `};`, y la línea `{...pressOverride}` justo después de la línea de estilo |
| **O2c** | como O2, pero la línea es `{...(<condición> ? pressOverride : {})}` |
| **O5** | el elemento entero (de su `<Pressable` a su `</Pressable>`) sustituido por `{<condición> ? (` + el elemento intacto + `) : (` + el elemento con N1 + `)}` |
| **O5h** | como O5, con `!<condición>` |
| **S1p** / **V1** | la línea de estilo, borrada |
| **V7** | en la línea de estilo, `0.8` → `0.5` |
| **N1n** | N1, y el primer hijo envuelto en `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>` … `</Pressable>`. En B se envuelve **solo** la línea del `<Bell`; en S y M, el `<Text>` entero |
| **N1p** (S) / **V4** (M) | como N1n, pero con la línea de estilo **borrada** en vez de N1 |
| **N2** / **V5** | la línea de estilo intacta; el primer hijo envuelto (como en N1n) en `<Pressable onPress={() => undefined}>` … `</Pressable>` |
| **W1** | N1; el `>` que cierra el tag de apertura pasa a `/>`, y justo debajo se abre `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>`, que se queda los hijos y el `</Pressable>` original |
| **S2** | N1, y la línea `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />` justo antes del `<Pressable` del elemento |
| **S3** | N1, y esa misma línea justo después de su `</Pressable>` |
| **V2** (M) | la línea de estilo borrada, y la línea de S2 justo antes del `<Pressable` |
| **V3** (M) | la línea de estilo borrada, y la línea de S2 justo después del `</Pressable>` |
| **E1** | la línea `hitSlop={0 < 1 ? 8 : 0}` justo después de la línea del ancla |
| **E2** | la misma línea justo antes de la línea del ancla |
| **E3** | la línea de estilo movida a justo antes de la línea del ancla |
| **V6** | en B y S, la línea de estilo partida en tres: `style={({ pressed }) => ({` / `  opacity: pressed ? 0.8 : 1,` / `})}`. En M, sus tres líneas unidas en la receta de una línea |
| **A0** | el ancla → `testID="home-bell"` en B, ``testID={`meal-x-${index}`}`` en M |

### Exigido

«Fuente» es el `it` de R1 del call-site y «pulsa» su `it` de R2. Matchers:
**regex** es `toMatch` de la receta, **unicidad** es `toBe` de la línea de R1,
**reposo** es `toBe(1)` de la pata de reposo de S, **pulsa** es `toHaveStyle`
de R2 y **render** es un `findByTestId` que no encuentra el elemento. «Otros»
cuenta los demás tests del fichero que caen.

#### B

| Sonda | Fuente (`#122 R1`) | Pulsa (`#122 R2`) | Otros | Nota |
|---|---|---|---|---|
| P1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2b | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O3 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P4 | **ROJO unicidad** | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O5 | **ROJO unicidad** | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O5h | **ROJO unicidad** | verde | 0 | **se cierra** (hoy verde) |
| O4 | **ROJO unicidad** | verde | 0 | **declarado**: hoy caía por la regex |
| O2c | verde | verde | 0 | límite documentado |
| N1 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| S1p | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| V7 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| N1n | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| W1 | **ROJO regex** | **ROJO pulsa** | 3 | declarado: cae también R2 |
| S2 | **ROJO regex** | **ROJO pulsa** | 2 | declarado: cae también R2 |
| S3 | **ROJO regex** | **ROJO pulsa** | 2 | declarado: cae también R2 |
| N2 | verde | verde | 0 | sin cambio |
| E2 | verde | verde | 0 | sin cambio |
| E3 | verde | verde | 0 | sin cambio |
| E1 | **ROJO regex** | verde | 0 | sin cambio |
| V6 | **ROJO regex** | verde | 0 | sin cambio |
| L2 | verde | **ROJO render** | 120 | declarado: R2 cae con los demás |
| A0 | **ROJO regex** | **ROJO render** | 9 | declarado: cae también R2 |

#### S

| Sonda | Fuente (`#122 R1`) | Pulsa (`#122 R2`) | Otros | Nota |
|---|---|---|---|---|
| P1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2b | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O3 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P4 | **ROJO unicidad** | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O5 | **ROJO unicidad** | **ROJO pulsa** | 1 | hoy ya caía por otro test |
| O5h | **ROJO unicidad** | verde | 1 | hoy ya caía por otro test |
| O4 | **ROJO unicidad** | verde | 0 | **declarado**: hoy caía por la regex |
| O2c | verde | verde | 0 | límite documentado |
| N1 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| N1n | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| N1p | **ROJO reposo** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| S1p | **ROJO reposo** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| V7 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| W1 | **ROJO regex** | **ROJO pulsa** | 3 | declarado: cae también R2 |
| S2 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| S3 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| N2 | verde | verde | 0 | sin cambio |
| E2 | verde | verde | 0 | sin cambio |
| E3 | verde | verde | 0 | sin cambio |
| E1 | **ROJO regex** | verde | 0 | sin cambio |
| V6 | **ROJO regex** | verde | 0 | sin cambio |
| L2 | **ROJO render** | **ROJO render** | 118 | declarado: cae también R2 |

#### M

| Sonda | Fuente (`#122 R1`) | Pulsa (`#122 R2`) | Otros | Nota |
|---|---|---|---|---|
| P1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P2b | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O1 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O3 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O2 | verde | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| P4 | **ROJO unicidad** | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O5 | **ROJO unicidad** | **ROJO pulsa** | 0 | **se cierra** (hoy verde) |
| O5h | **ROJO unicidad** | verde | 0 | **se cierra** (hoy verde) |
| O4 | **ROJO unicidad** | verde | 0 | **declarado**: hoy caía por la regex |
| O2c | verde | verde | 0 | límite documentado |
| N1 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| V1 | **ROJO regex** | **ROJO pulsa** | 1 | declarado: cae también R2 |
| V2 | **ROJO regex** | **ROJO pulsa** | 1 | declarado: cae también R2 |
| V3 | **ROJO regex** | **ROJO pulsa** | 1 | declarado: cae también R2 |
| V4 | **ROJO regex** | **ROJO pulsa** | 1 | declarado: cae también R2 |
| V7 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| N1n | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| W1 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| S2 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| S3 | **ROJO regex** | **ROJO pulsa** | 0 | declarado: cae también R2 |
| V5 | verde | verde | 0 | sin cambio |
| V6 | verde | verde | 0 | sin cambio |
| E2 | verde | verde | 0 | sin cambio |
| E3 | verde | verde | 0 | sin cambio |
| E1 | **ROJO regex** | verde | 0 | sin cambio |
| L2 | verde | **ROJO render** | 38 | declarado: R2 cae con los demás |
| A0 | **ROJO regex** | **ROJO render** | 12 | declarado: cae también R2 |

Los «otros» previstos ([[design]] §La medición completa): en W1 de B, los tres
de `home-hero-actions` y el punto; en S2 y S3 de B, los dos de
`home-hero-actions`; en W1 de S, `#85 R1` ×2 y `#70 R1 › dibuja la cabecera y
el cuerpo`; en O5 y O5h de S, `no añade un segundo camino a la lista desde la
Home`; en V1-V4 de M, la pata de reposo de #107 R5; en L2, el render roto de
toda la pantalla, que incluye el `#122 R2` del otro call-site de la Home; en
A0, los que buscan el elemento por `testID`.

- [ ] Las 78 filas, con el veredicto, el matcher y los «otros», en tablas de
      `progress/impl_mobile-source-lock-slice-blind-spots.md`.
- [ ] Si alguna fila no coincide con «Exigido», **para y repórtalo**. No ajustes
      los tests ni las mutaciones para que cuadre.
- [ ] Al terminar la tanda, desde la raíz:
      `git diff --exit-code HEAD -- mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
      → `exit=0`.

---

## R4 — límites y defensas, anclados por contenido

No lleva par rojo→verde: es un entregable de documentación, y lo verifica el
`reviewer` leyendo.

- [ ] (1) En `src/app/(tabs)/__tests__/food.test.tsx`, dos comentarios
      literales, al sangrado de la línea que tienen debajo:

      ```diff
      +    // #122 R1: the slice assumes one anchor. A second copy (a decoy, the other
      +    // branch of a ternary, a comment) would be the one sliced.
           expect(source.lastIndexOf('testID={`meal-toggle-${index}`}')).toBe(anchor);
      …
           const toggle = await screen.findByTestId('meal-toggle-0');

      +    // #122 R2: responderGrant is the first event of userEvent.press; stopping
      +    // there leaves the Pressable pressed, so this reads the opacity that runs.
           await fireEvent(toggle, 'responderGrant', {
      ```

- [ ] (2) En `src/screens/home/index.test.tsx`, los mismos dos comentarios en
      cada call-site (cuatro en total, encima de las dos líneas de unicidad y de
      los dos `await fireEvent(`), y dos enmiendas en comentarios que ya
      existen:

      ```diff
      # campana, comentario encima del const block
      -    // Same two limits as reminders-see-all: docs/conventions.md, opening-tag
      +    // Same limits as reminders-see-all: docs/conventions.md, opening-tag
           // slices section.

      # enlace, comentario encima del const block
             // #112 R1: own opening tag of reminders-see-all, from `<` to `<`. Ending
             // at `</Pressable>` let a nested Pressable lend it a foreign style. A `<`
      -      // inside the tag shrinks the slice and fails red; a string child placed
      -      // before the first element child still lands in the slice and can pass
      -      // green. Both limits: docs/conventions.md, opening-tag slices section.
      +      // inside the tag shrinks the slice and fails red; a string or a JSX
      +      // comment placed before the first element child still lands in the slice
      +      // and can pass green, which is why #122 R2 presses the link. All limits:
      +      // docs/conventions.md, opening-tag slices section.
      ```

      Los comentarios del enlace van con seis espacios de sangrado; los de la
      campana y los de `food.test.tsx`, con cuatro.
- [ ] Blobs de los tests tras (1) y (2): `home/index.test.tsx` →
      `60c0c01396f246d433bd1bdb0655b4df58fbb3ee`, `food.test.tsx` →
      `abc6ad1579dfcadb3c9d309d41caecdba62ccb2d`. Si no coinciden, compara
      carácter a carácter con los bloques de arriba antes de seguir.
- [ ] (3) En `docs/conventions.md`, sección
      `### Recortes del tag de apertura en candados de fuente`, sustituye el
      bloque que va **desde** la línea
      ``Para aislar el tag de apertura de un elemento, recorta de `<` a `<` alrededor``
      **hasta** la línea
      ``  `home-alerts-bell` (#121) y el `reminders-see-all` (#112): el mismo grep.``
      (las dos incluidas) por este texto literal:

      ~~~markdown
      Para aislar el tag de apertura de un elemento, recorta de `<` a `<` alrededor
      de un ancla que viva dentro de ese mismo tag; no recortes de `<Tag>` a
      `</Tag>`. Encoger la ventana produce un rojo seguro, mientras que ensancharla
      puede incluir propiedades de un hijo o hermano y fabricar un verde falso.

      El recorte da por hecho que el ancla es **única** en el fichero. Con dos copias
      (un señuelo `{false && …}`, las dos ramas de un ternario o un comentario con el
      mismo `testID`), `indexOf` recorta la primera, que puede no ser el elemento
      vigilado. Asevéralo en el mismo `it`, antes de la receta:

      ```ts
      expect(source.lastIndexOf('testID="…"')).toBe(anchor);
      ```

      Con el ancla única quedan **tres** límites conocidos, y solo el primero avisa:

      1. Un `<` dentro del propio tag (por ejemplo, `disabled={a < b}`) adelanta el
         corte. **Falla hacia rojo**.
      2. Todo lo que viva entre el `>` que cierra el tag y el primer hijo **elemento**
         entra en el bloque. Una cadena hija con la receta rompe el render, pero un
         comentario JSX `{/* … */}` o un `{false && '…'}` no se renderizan: dan un
         **verde falso** con la suite entera en verde.
      3. La regex lee texto, no código. Una receta comentada con `//` o `/* */`, o
         metida en una cadena, **dentro** del propio tag también da un verde falso.

      Hay además un hueco que no es del recorte, sino de todo candado de fuente: la
      receta puede estar de verdad en el tag y no correr, porque un `{...override}`
      posterior cuyo `style` es opcional la pisa, y `tsc` no lo para.

      Hasta #122, el límite 2 se dejaba sin defensa porque «en la práctica rompe
      media suite al intentarlo». Eso vale para una cadena hija, pero es falso para un
      comentario. Los límites 2 y 3 y el `{...override}` los cierra lo mismo: una
      **pata de árbol que pulse** el elemento y lea su opacidad, porque mira lo que
      corre y no el texto:

      ```ts
      await fireEvent(element, 'responderGrant', {
        nativeEvent: {},
        persist: () => undefined,
      });

      expect(element).toHaveStyle({ opacity: 0.8 });
      ```

      `responderGrant` es el primer evento de `userEvent.press`, y parar ahí deja el
      `Pressable` pulsado. `fireEvent(element, 'pressIn')` **no** sirve: busca un
      `onPressIn` en las props, el `Pressable` no tiene ninguno propio, el evento no
      llega a nadie y la opacidad se queda en 1. La pata solo ve el estado que
      renderiza el test. La otra rama de un ternario la ve la unicidad del ancla, y
      por eso las dos defensas van juntas.

      El patrón vive en estos candados. Localízalos por contenido y no por número de
      línea, porque los números se desplazan con cada merge:

      - `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`, la
        implementación de referencia: `grep -n "lastIndexOf('<', use.index)"`.
        Recorre todos los usos de un símbolo y no tiene ancla de `testID`, así que la
        unicidad no aplica.
      - `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`, el
        `meal-toggle` (#109): `grep -n "lastIndexOf('<', anchor)"`.
      - `mobile-pet-tracker/src/screens/home/index.test.tsx`, la campana
        `home-alerts-bell` (#121) y el `reminders-see-all` (#112): el mismo grep.

      Los tres que recortan alrededor de `anchor` aseveran su unicidad y tienen al
      lado su pata que pulsa (#122): `grep -rn "'responderGrant'" mobile-pet-tracker/src`.
      ~~~

      Lo que queda debajo en la sección (los párrafos «No queda ningún recorte…»
      y «Tampoco vale aseverar…») **no se toca**.
- [ ] Blob de `docs/conventions.md` → `23df873fc7b68dee713f0075532b6684aee29994`.
- [ ] (4) Comprobaciones, desde la **raíz del repo**:
      - `grep -rc "lastIndexOf('<', anchor)" mobile-pet-tracker/src/screens/home/index.test.tsx 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'`
        → `2` y `1`
      - `grep -rn "'responderGrant'" mobile-pet-tracker/src` → tres
        coincidencias: dos en `home/index.test.tsx` y una en `food.test.tsx`
      - `grep -c "con ancla única (#122 R1)" mobile-pet-tracker/src/screens/home/index.test.tsx` → `2`
      - `grep -n "a string child placed" mobile-pet-tracker/src/screens/home/index.test.tsx; echo "exit=$?"` → `exit=1`
      - `grep -n "por eso se deja documentado" docs/conventions.md; echo "exit=$?"` → `exit=1`
      - `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src; echo "exit=$?"` → `exit=1`
      - desde `mobile-pet-tracker/`: el guard de hex → verde, 55 (o tu base), y
        los dos ficheros de los candados → verdes, 142 + 56 (tu base + 3)
- [ ] (5) Commit (solo esos tres ficheros):
      `docs(mobile): record the source-lock slice limits and their defences (R4)`

---

## R5 — cierre: cero diff de producción

- [ ] Desde la raíz:
      `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
      → `exit=0`.
- [ ] Si la base sigue siendo `f72c1fc0`:
      - `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
        `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, y
        `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/food.tsx'` →
        `e310ff45ac9a6abc5475e983a2c03e1d7b5f909b`;
      - en el rojo de R1: `491986e0990bbbc168d44b593dbc04f9f72e5e86` y
        `2be008ce7f79b8e51808c80a2e4cc4a40b493f07`;
      - en el rojo de R2: `3b3cc0e6ff9352c160088a0427df1706fd40b2a9` y
        `e3d058dfcd30f2648ffe8de4bf321befe90b737e`.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` → solo
      `src/screens/home/index.test.tsx` y `src/app/(tabs)/__tests__/food.test.tsx`.
- [ ] Suite completa: `exit=0`, delta **+0 suites / +3 tests** contra tu base
      (82 / 1474 sobre `f72c1fc0`).
- [ ] `tsc` y `lint`: `exit=0`.
- [ ] `traceability.md`: las columnas de commit rellenas y ninguna fila
      «pendiente».
- [ ] Reporte en `progress/impl_mobile-source-lock-slice-blind-spots.md` con:
      la base medida, los logs de los dos (0) y sus blobs, los dos rojos con sus
      fallos, las 78 filas de R3, las comprobaciones de R4 y el delta. Copia las
      líneas de resumen de los logs en el reporte: los ficheros de `/tmp` no se
      versionan.
- [ ] Commit (solo el reporte y `traceability.md`):
      `docs(mobile): record the source-lock blind-spot evidence (R3,R5)`.
      Va el último porque versiona los hashes de los commits anteriores.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` y `src/app/(tabs)/food.tsx` fuera de los dos
  pares rojo→verde.
- Los recortes, las regex, la pata de reposo de S y la del `describe` de M, y
  las aserciones de ruta, cast e icono de B.
- `elementWithTestId` (`consistency-classnames.test.ts`,
  `legibility-classnames.test.ts`), que es de #120, y la aserción del icono
  `<Bell size={24} color={muted} />`, que es de #124.
- La implementación de referencia de `consistency-classnames.test.ts`.
- En `docs/conventions.md`, todo lo que no sea el bloque de R4 (3).
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`:
  esta feature no añade claves de copy, y el candado de longitud del catálogo no
  se toca.
- Las specs de #109, #112 y #121.
- `package.json` y `bun.lock`: ninguna dependencia nueva.
- No rebasees la rama después de rellenar los hashes de `traceability.md`.
