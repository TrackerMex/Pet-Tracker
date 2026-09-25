---
feature: "mobile-home-bell-icon-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-home-bell-icon-source-lock-unbounded]] (#124)

> Disciplina TDD. Ver [[requirements]] para los R-ids y [[design]] para la
> medición que sostiene la decisión. **No uses números de línea**: localiza
> todo con los `grep` que se dan. Los números se mueven con cada merge, y
> cualquier feature que toque `src/screens/home/index.tsx` o
> `src/screens/home/index.test.tsx` los desplaza.

## Antes de tocar nada

- [ ] `cd mobile-pet-tracker`. **Todos** los comandos de jest, `tsc` y `lint`
      corren desde ahí, porque los candados abren rutas relativas a
      `process.cwd()`. Los de `git` y `grep` con rutas `mobile-pet-tracker/…`
      o `docs/…` corren desde la raíz del repo, y se indica.
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
- [ ] Jest **siempre** con `--runTestsByPath`, salvo la suite completa, y
      comprueba que imprime `Test Suites: 1 …` (o `2 …` cuando pases dos
      ficheros).
- [ ] **No lances `./init.sh`** ni `e2e`, ni toques Postgres o LocalStack: son
      compartidos con el worktree de Backend.
- [ ] **No cargues ninguna skill.** Es un cambio solo de test y de
      documentación, sin UI.
- [ ] **Mide la base tú mismo** y apunta las cifras en el reporte. En
      `b1469b84` eran: `home/index.test.tsx` **142**, `design-drift.test.ts`
      **55**, suite **83 suites / 1494 tests / 1 snapshot**, `tsc` 0 y `lint` 0.
      Si difieren porque otra feature mergeó, vale **tu** base: el gate es el
      delta, **+0 suites y +2 tests**.
- [ ] **En `src/screens/home/index.test.tsx` no escribas `#` + número** salvo en
      la forma `#124 R1`. Una cita suelta (`#124`, `(#124)`, `#121/#124`) pone
      rojos cinco guards de `src/__tests__/design-drift.test.ts`, y la palabra
      `StyleSheet` tampoco puede aparecer ([[design]] §Los guards). Los
      literales de esta spec ya lo cumplen: cópialos tal cual.

Comandos canónicos (desde `mobile-pet-tracker/`):

```bash
# el fichero del candado (Test Suites: 1)
bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/124_home.log 2>&1; echo "exit=$?"

# solo los tests de R1, para leer sus fallos
bunx jest --runTestsByPath src/screens/home/index.test.tsx -t "se pinta con la tinta muted" > /tmp/124_r1.log 2>&1; echo "exit=$?"

# el guard de hex
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/124_drift.log 2>&1; echo "exit=$?"

# suite completa
bunx jest > /tmp/124_all.log 2>&1; echo "exit=$?"

# typecheck y lint
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bunx tsc --noEmit > /tmp/124_tsc.log 2>&1; echo "exit=$?"
bunx expo lint > /tmp/124_lint.log 2>&1; echo "exit=$?"

# blobs (desde la raíz del repo)
git hash-object mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/home/index.test.tsx docs/conventions.md
```

**Blobs de partida** (base `b1469b84`, que es `origin/main` `2da66b86` más
`progress/current.md`): `index.tsx`
`dbb5b0346895cfc26705bee2257d1f8a8815df6c`, `index.test.tsx`
`60c0c01396f246d433bd1bdb0655b4df58fbb3ee`, `docs/conventions.md`
`23df873fc7b68dee713f0075532b6684aee29994`. Si alguno no coincide, otra
feature ha mergeado encima: los blobs de esta spec dejan de valer como control
exacto, y valen los greps y los veredictos.

---

## El elemento de producción

`src/screens/home/index.tsx`, localizado con `grep -n 'testID="home-alerts-bell"'`.
«**El icono**» es siempre la línea `<Bell size={24} color={muted} />`, primer
hijo de la campana, con 14 espacios de sangrado. Hoy aparece una sola vez en el
fichero (`grep -c '<Bell size={24} color={muted} />'` da 1).

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
          </View>
```

`muted` y `accent` salen de la misma llamada, `grep -n "const \[accent, success, warning, muted"`:
`useThemeColors(['accent-strong', 'success', 'warning', 'muted', …])`.

---

## R1 — el color del icono en el árbol, probado con B2

Vía (b) de C4: el commit rojo versiona la mutación de producción y el verde la
revierte.

### (0) Evidencia del agujero

- [ ] Aplica **B2** en `src/screens/home/index.tsx`, dos cambios:

      ```diff
      -              <Bell size={24} color={muted} />
      +              <Bell size={24} color={accent} />
                     {hasOpenAlerts ? (
      …
                     ) : null}
                   </Pressable>
      +            {false && <Bell size={24} color={muted} />}
                 </View>
      ```

      La línea nueva lleva 12 espacios de sangrado, los mismos que el
      `</Pressable>` de la campana, y va entre ese `</Pressable>` y el
      `</View>` que lo sigue.
- [ ] Blob (desde la raíz): `index.tsx` →
      `70f48f701a86173ff08d9259f6a34d6b3aba6a96`.
- [ ] Con los tests **todavía sin tocar**, corre el fichero del candado.
      Esperado: **VERDE, `exit=0`, 142/142**. En `b1469b84` la **suite
      entera** también da 83 / 1494 en verde, y `tsc` y `lint` dan 0. Guarda el
      log: es la prueba del agujero.

### (1) Commit ROJO — el `describe` de R1, con B2 puesta

- [ ] En `src/screens/home/index.test.tsx`, dentro de
      `describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`,
      localiza la línea `  it('no pinta campana cuando no hay mascotas', async () => {`
      (`grep -n "no pinta campana cuando no hay mascotas"`). Justo encima está
      el `});` del `it` `#122 R2` y una línea en blanco. **Inserta justo antes
      de la línea del `it`** este bloque. Acaba en una línea en blanco, así que
      queda una línea en blanco a cada lado:

      ```ts
        describe('#124 R1: el icono de la campana se pinta con la tinta muted', () => {
          beforeEach(() => {
            // #124 R1: each CSS variable resolves to its own name, so muted and
            // accent-strong stop being the same fallback colour in the tree.
            jest
              .spyOn(Uniwind, 'getCSSVariable')
              .mockImplementation((token) => token);
          });

          afterEach(() => {
            jest.restoreAllMocks();
          });

          it('sin alertas abiertas', async () => {
            await renderHome();
            const bell = await screen.findByTestId('home-alerts-bell');

            expect(within(bell).getByTestId('icon-bell').props.color).toBe(
              '--color-muted',
            );
          });

          it('con alertas abiertas', async () => {
            mockListAlerts.mockResolvedValue({
              kind: 'ok',
              items: [makeAlert()],
              nextCursor: null,
            });

            await renderHome();
            const bell = await screen.findByTestId('home-alerts-bell');
            await within(bell).findByTestId('home-alerts-dot');

            expect(within(bell).getByTestId('icon-bell').props.color).toBe(
              '--color-muted',
            );
          });
        });

      ```

      - [ ] **No añadas imports.** `Uniwind`, `screen`, `within`, `renderHome`,
            `mockListAlerts` y `makeAlert` ya existen en el fichero. `icon-bell`
            es el `testID` que pone el mock de `reicon` al icono `Bell`.
      - [ ] El valor esperado es **el literal `'--color-muted'`**. No lo
            calcules con `useThemeColors` ni con nada importado de producción:
            el candado sería tautológico ([[design]] §Por qué el valor esperado
            es un literal).
      - [ ] **No toques** el `it` `#121 R1` (el que devuelve
            `grep -n "usa la ruta real sin cast Href"`): ni su título, ni su
            ancla, ni su recorte, ni sus cinco aserciones. Tampoco
            `compone el selector y la campana como dos hijos en ese orden` ni el
            `it` `#122 R2`.
- [ ] Blob del test: `index.test.tsx` →
      `b735c105d6d291eae389316ef550190152e820bf`.
- [ ] Corre el fichero del candado. Esperado: **ROJO, `exit=1`, 2 failed de
      144**. Los dos son los `it` nuevos,
      `#78 R10: … › #124 R1: el icono de la campana se pinta con la tinta muted › sin alertas abiertas`
      y `… › con alertas abiertas`. Los dos fallan por **`toBe`**, con
      `Expected: "--color-muted"` y `Received: "--color-accent-strong"`. El
      `it` `#121 R1` **pasa**, porque la copia alimenta su `toContain`. Si
      falla otra aserción, otro test o sale un `ReferenceError`, para.
- [ ] Commit (los dos ficheros):
      `test(mobile): expose the whole-file home-alerts-bell icon lock (R1)`

### (2) Commit VERDE — revertir B2

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx`. `HEAD` es el commit
      rojo, así que `HEAD~1` tiene el fichero sin mutar.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx; echo "exit=$?"`
      → `exit=0`. Blob → `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.
- [ ] El fichero del candado: **VERDE, `exit=0`, 144/144** (tu base + 2).
- [ ] El guard de hex: **VERDE, `exit=0`, 55** (o tu base).
- [ ] Commit:
      `test(mobile): lock the home-alerts-bell icon colour in the tree (R1)`

### (3) Refactor

- [ ] No hay refactor. No extraigas un helper para el color ni para el espía
      ([[design]] §Alternativas descartadas).

---

## R2 — las sondas, sobre el verde de R1

Sobre el árbol **ya verde**: aplica la mutación a `src/screens/home/index.tsx`,
corre el fichero del candado, apunta cuántos tests pasan y fallan y por qué
matcher, y **revierte antes de la siguiente**. No se commitean. Todas parten
del fichero de producción intacto. Puedes escribirte un script que aplique cada
mutación por sustitución única (que asevere que el texto viejo aparece una
vez), calcule el blob y restaure el fichero. No lo commitees. Al acabar,
`git diff --exit-code -- src/screens/home/index.tsx` → `exit=0`.

### Qué es cada sonda

«**El icono**» es la línea de 14 espacios `<Bell size={24} color={muted} />`.
«**La copia**» es `{false && <Bell size={24} color={muted} />}`. «**Detrás de
la campana**» es una línea nueva de 12 espacios entre el `</Pressable>` de la
campana y el `</View>` que lo sigue, como en B2.

| Sonda | Mutación exacta | Blob de `index.tsx` |
|---|---|---|
| **B1** | el icono → `<Bell size={24} color={accent} />` | `2348d51d821a1054dfe54c26f6c7726c0afc341d` |
| **B2** | B1, y la copia detrás de la campana | `70f48f701a86173ff08d9259f6a34d6b3aba6a96` |
| **B2p** | B1, y la copia en una línea de 12 espacios justo antes del `<Pressable` de la campana | `9abc2177932166036b09a1d1191d839b82facc6a` |
| **B2f** | el icono → dos líneas de 14 espacios: la copia, y debajo `<Bell size={24} color={accent} />` | `803ae462422eeedd65c7fb3ef005e1ea1f8b1796` |
| **B2i** | el icono → dos líneas de 14 espacios: `<Bell size={24} color={accent} />`, y debajo la copia | `7dd781fc2b68feca6af019e13e27ecf4ad64273b` |
| **B2j** | el icono → dos líneas de 14 espacios: `{/* <Bell size={24} color={muted} /> */}`, y debajo `<Bell size={24} color={accent} />` | `637850ae7a7458f70b85aed5e7b3490279945042` |
| **B2c** | B1, y la línea `// <Bell size={24} color={muted} />` añadida al final del fichero | `f4c67ff09d26aed0b37546b33ffaf0dc930df945` |
| **B2t** | B1, y la línea de 14 espacios `/* <Bell size={24} color={muted} /> */` justo después de `onPress={() => router.push('/alerts')}` | `e824d8aa996a0be26168575527a6ad9afc6351a0` |
| **B2s** | B1, y la línea de 14 espacios `accessibilityHint={'<Bell size={24} color={muted} />'}` justo después de esa misma línea | `60fca9b699905e429a168545d9d20fda6dda5f42` |
| **B3** | el icono → `{((muted: string) => <Bell size={24} color={muted} />)(accent)}` | `8148ce0fca97a3bcc69beb217bbfabaaf127c8ea` |
| **B4** | el icono → `{hasOpenAlerts ? <Bell size={24} color={accent} /> : <Bell size={24} color={muted} />}` | `c506b1145c5d2ec784408f5eb624c7f1bbad3945` |
| **B4r** | el icono → `{!hasOpenAlerts ? <Bell size={24} color={muted} /> : <Bell size={24} color={accent} />}` | `c0eed6c412094fc8382e7df31a56eb2d66f3d052` |
| **B5** | `import { Pressable, ScrollView, Text, View } from 'react-native';` → `import { Platform, Pressable, ScrollView, Text, View } from 'react-native';`, y el icono → `<Bell size={24} color={Platform.OS === 'ios' ? muted : accent} />` | `4d470b93dd9f2e0db57852c49f37b7886eb510f1` |
| **B5d** | B5, y la copia detrás de la campana | `f01bf77b59d54029dd3c55556c797270acda675c` |
| **B6** | el icono → `<Bell size={24} color="--color-muted" />` | `d1087120f3a3202382dd1fe64315c94622c38b33` |
| **B6d** | B6, y la copia detrás de la campana | `1fde86c915f2141de9f01c7f8cec803b214d7452` |
| **T1** | en la lista de `useThemeColors` de `grep -n "const \[accent, success, warning, muted"`, la línea `      'muted',` → `      'accent-strong',` | `c1e13841a9f247810a068af529233734a846d476` |
| **F1** | el icono → `<Bell color={muted} size={24} />` | `ae202372704e508cc71a77ceaa5af5496a5d0d14` |
| **F2** | el icono se mueve, intacto, de encima de `{hasOpenAlerts ? (` a justo después del `) : null}` del punto, antes del `</Pressable>` | `2c28e2a63b272ba3332e887bb28a63404996b534` |
| **F3** | el icono → `<Bell size={24} color={bellInk} />`, y la línea `  const bellInk = muted;` justo antes de `  const quickActionInks = useThemeColors(` | `43067e620d03de818cca1c2d341a8cafe5845f3e` |
| **W2** | `<Weight size={20} color={muted} />` → `<Weight size={20} color={accent} />{false && <Weight size={20} color={muted} />}`, en la misma línea | `58a3c32b0765f7406e6462550b6fa691eaf6d031` |

Si un blob no coincide pero la sustitución es única y el `diff` es el de la
tabla, vale el veredicto: el blob depende de la base.

### Exigido

Sobre `index.test.tsx` con R1 (144 tests). «Fuente» es el `it` `#121 R1` y su
matcher `toContain`; «sin» y «con» son los dos `it` de R1, que fallan por
`toBe`. «Otros» cuenta los demás tests del fichero que caen. «Hoy» es el
veredicto sobre `60c0c013` (142 tests), medido por esta spec. No hace falta
repetirlo.

| Sonda | Pasan / fallan | Fuente | sin | con | Otros | Hoy | Nota |
|---|---|---|---|---|---|---|---|
| B1 | 141 / 3 | **ROJO** | **ROJO** | **ROJO** | 0 | rojo, `toContain` | declarado: caen también los dos de R1 |
| **B2** | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | **verde** | **se cierra** |
| B2p | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2f | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2i | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2j | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2c | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2t | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B2s | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B3 | 142 / 2 | verde | **ROJO** | **ROJO** | 0 | verde | **se cierra** |
| B4 | 143 / 1 | verde | verde | **ROJO** | 0 | verde | **se cierra**, solo por el estado con alertas |
| B4r | 143 / 1 | verde | verde | **ROJO** | 0 | verde | **se cierra**, solo por el estado con alertas |
| B5 | 143 / 1 | **ROJO** | verde | verde | 0 | rojo, `toContain` | sin cambio: el árbol corre en `'ios'` |
| B5d | 144 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| B6 | 143 / 1 | **ROJO** | verde | verde | 0 | rojo, `toContain` | sin cambio: el espía devuelve el nombre |
| B6d | 144 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| T1 | 141 / 3 | verde | **ROJO** | **ROJO** | 1 | rojo, 1 otro | declarado: caen también los dos de R1 |
| F1 | 143 / 1 | **ROJO** | verde | verde | 0 | rojo, `toContain` | sin cambio (rojo falso heredado) |
| F2 | 144 / 0 | verde | verde | verde | 0 | verde | sin cambio: la campana está sana |
| F3 | 143 / 1 | **ROJO** | verde | verde | 0 | rojo, `toContain` | sin cambio (rojo falso heredado) |
| W2 | 144 / 0 | verde | verde | verde | 0 | verde | fuera de alcance, (F) de [[requirements]] |

El «otro» de T1 es
`#70 R1: la Home dibuja la sección de recordatorios › #70 R8: estado vacío de próxima vacuna › dibuja un estado vacío con forma de fila cuando no hay vacuna`,
por `toBe`. Si una sonda da otro veredicto, **para y repórtalo**, con el log.

---

## R3 — por qué el icono se asevera en el árbol

- [ ] (1) En `src/screens/home/index.test.tsx`, dentro del `it` `#121 R1`
      (`grep -n "usa la ruta real sin cast Href"`), añade **justo encima** de
      su última aserción, `expect(source).toContain('<Bell size={24} color={muted} />');`,
      este comentario de cuatro líneas y nada más:

      ```diff
             expect(block).toMatch(
               /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/,
             );
      +      // #124 R1: this matches the whole file, so any other copy of the icon lends
      +      // it the green. The colour itself is locked in the tree by the #124 R1
      +      // describe below. This line stays for what the tree cannot see: a platform
      +      // branch, or a CSS variable name written by hand.
             expect(source).toContain('<Bell size={24} color={muted} />');
           });
      ```

      Las cuatro líneas llevan 4 espacios de sangrado, como la aserción. La
      aserción **no cambia**.
- [ ] Blob del test → `abbdb5b87f0b96bda465cc2dacb98937ef7aaf78`.
- [ ] (2) En `docs/conventions.md`, sección
      `### Recortes del tag de apertura en candados de fuente`, localiza el
      párrafo que termina en la línea `como arriba.`
      (`grep -n "^como arriba\.$" docs/conventions.md` da una sola línea). Entre
      esa línea más su línea en blanco y el encabezado
      `### Esperas sobre el árbol renderizado`, **inserta** este párrafo
      literal, seguido de una línea en blanco:

      ~~~markdown
      Un **hijo** del elemento, como el icono de la campana, queda fuera de ese
      recorte: vive después del `>` que cierra el tag. Contra el fichero entero tiene
      el mismo agujero que la receta, y acotarlo por posición al primer hijo sigue
      leyendo texto (un comentario `{/* … */}` delante lo engaña). Su prop se asevera
      en el **árbol**: con `jest.spyOn(Uniwind, 'getCSSVariable')` devolviendo el
      nombre que recibe, cada token pinta un color distinto, y el valor esperado es un
      literal del test (`'--color-muted'`), nunca uno sacado de `useThemeColors`. El
      árbol solo ve el estado que renderiza, así que el test monta los estados que
      cambian el elemento. Así lo hace la campana (#124):
      `grep -n "se pinta con la tinta muted" mobile-pet-tracker/src/screens/home/index.test.tsx`.
      ~~~

      El resultado es: `como arriba.`, línea en blanco, las diez líneas del
      párrafo, línea en blanco, `### Esperas sobre el árbol renderizado`. Nada
      más de la sección cambia.
- [ ] Blob de `docs/conventions.md` → `cb3c52532df6e9703fd965fc3d810c8eadace191`.
- [ ] (3) Comprobaciones, desde la **raíz del repo**:
      - `grep -c '#124 R' mobile-pet-tracker/src/screens/home/index.test.tsx` → `4`
      - `grep -c 'mockImplementation((token) => token)' mobile-pet-tracker/src/screens/home/index.test.tsx` → `6`
      - `grep -c "'--color-muted'" mobile-pet-tracker/src/screens/home/index.test.tsx` → `4`
      - `grep -c "se pinta con la tinta muted" mobile-pet-tracker/src/screens/home/index.test.tsx` → `1`
      - `grep -c "expect(source).toContain('<Bell size={24} color={muted} />');" mobile-pet-tracker/src/screens/home/index.test.tsx` → `1`
      - `grep -c "se pinta con la tinta muted" docs/conventions.md` → `1`
      - desde `mobile-pet-tracker/`: el guard de hex → verde, 55 (o tu base), y
        el fichero del candado → verde, 144 (tu base + 2)
- [ ] (4) Commit (solo esos dos ficheros):
      `docs(mobile): explain why the bell icon colour is locked in the tree (R3)`

---

## R4 — cierre: cero diff de producción

- [ ] Desde la raíz:
      `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"`
      → `exit=0`.
- [ ] Si la base sigue siendo `2da66b86`:
      - `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
        `dbb5b0346895cfc26705bee2257d1f8a8815df6c`;
      - en el commit rojo de R1: `70f48f701a86173ff08d9259f6a34d6b3aba6a96`
        (`git rev-parse <rojo>:mobile-pet-tracker/src/screens/home/index.tsx`).
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` → solo
      `src/screens/home/index.test.tsx`.
- [ ] Suite completa: `exit=0`, delta **+0 suites / +2 tests** contra tu base
      (83 / 1496 / 1 snapshot sobre `b1469b84`).
- [ ] `tsc` y `lint`: `exit=0`.
- [ ] `traceability.md`: las columnas de commit rellenas y ninguna fila
      «pendiente».
- [ ] Reporte en `progress/impl_mobile-home-bell-icon-source-lock-unbounded.md`
      con: la base medida, el log de (0) y su blob, el rojo con sus dos fallos,
      las 21 filas de R2 con pasan/fallan y matcher, las comprobaciones de R3 y
      el delta. Copia las líneas de resumen de los logs en el reporte: los
      ficheros de `/tmp` no se versionan.
- [ ] Commit (solo el reporte y `traceability.md`):
      `docs(mobile): record the bell icon lock evidence (R2,R4)`.
      Va el último porque versiona los hashes de los commits anteriores.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` fuera del par rojo→verde de R1.
- En el `it` `#121 R1`: el título, el ancla, el recorte, los comentarios que
  ya tiene y sus cinco aserciones. Solo gana el comentario de R3 (1).
- `compone el selector y la campana como dos hijos en ese orden`, el `it`
  `#122 R2` y `no pinta campana cuando no hay mascotas`.
- El `beforeEach` de `#78 R10` y el `beforeEach` de nivel superior del fichero.
- `#69 R9: usa iconos de reicon y ningún emoji` y su recuento: es la (F) de
  [[requirements]].
- En `docs/conventions.md`, todo lo que no sea el párrafo de R3 (2).
- `src/__tests__/design-drift.test.ts`.
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`:
  esta feature no añade claves de copy, y el candado de longitud del catálogo no
  se toca.
- Las specs de #121 y #122.
- `package.json` y `bun.lock`: ninguna dependencia nueva.
- No rebasees la rama después de rellenar los hashes de `traceability.md`.
