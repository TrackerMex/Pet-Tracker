---
feature: "mobile-home-cell-icons-source-lock-unbounded"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-home-cell-icons-source-lock-unbounded]] (#126)

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
      comprueba que imprime `Test Suites: 1 …`.
- [ ] **No lances `./init.sh`** ni `e2e`, ni toques Postgres o LocalStack: son
      compartidos con el worktree de Backend.
- [ ] **No cargues ninguna skill.** Es un cambio solo de test y de
      documentación, sin UI.
- [ ] **Mide la base tú mismo** y apunta las cifras en el reporte. En
      `d7cb0d60` eran: `home/index.test.tsx` **144**, `design-drift.test.ts`
      **55**, suite **83 suites / 1510 tests / 1 snapshot**, `tsc` 0 y `lint` 0.
      Si difieren porque otra feature mergeó, vale **tu** base: el gate es el
      delta, **+0 suites y +2 tests**.
- [ ] **En `src/screens/home/index.test.tsx` no escribas `#` + número** salvo en
      la forma `#126 R1`. Una cita suelta (`#126`, `(#126)`, `#69/#126`) pone
      rojos cinco guards de `src/__tests__/design-drift.test.ts`, y la palabra
      `StyleSheet` tampoco puede aparecer ([[design]] §Los guards). Los
      literales de esta spec ya lo cumplen: cópialos tal cual.

Comandos canónicos (desde `mobile-pet-tracker/`):

```bash
# el fichero del candado (Test Suites: 1)
bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/126_home.log 2>&1; echo "exit=$?"

# solo los tests de R1, para leer sus fallos
bunx jest --runTestsByPath src/screens/home/index.test.tsx -t "pinta su propio icono" > /tmp/126_r1.log 2>&1; echo "exit=$?"

# el guard de hex
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/126_drift.log 2>&1; echo "exit=$?"

# suite completa
bunx jest > /tmp/126_all.log 2>&1; echo "exit=$?"

# typecheck y lint
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bunx tsc --noEmit > /tmp/126_tsc.log 2>&1; echo "exit=$?"
bunx expo lint > /tmp/126_lint.log 2>&1; echo "exit=$?"

# blobs (desde la raíz del repo)
git hash-object mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/home/index.test.tsx docs/conventions.md
```

**Blobs de partida** (base `d7cb0d60`, que es `origin/main` más
`progress/current.md`): `index.tsx`
`dbb5b0346895cfc26705bee2257d1f8a8815df6c`, `index.test.tsx`
`abbdb5b87f0b96bda465cc2dacb98937ef7aaf78`, `docs/conventions.md`
`cb3c52532df6e9703fd965fc3d810c8eadace191`. Si alguno no coincide, otra
feature ha mergeado encima: los blobs de esta spec dejan de valer como control
exacto, y valen los greps y los veredictos.

---

## El elemento de producción

`src/screens/home/index.tsx`, la tira de hoy, localizada con
`grep -n '<Weight size={20} color={muted} />'`. Cada celda es un `View`
**sin `testID`** con tres hijos: el icono, el `Text` del valor y el `Text` de
la etiqueta. «**El icono de la celda**» es siempre la línea de 18 espacios
`<X size={20} color={muted} />`, donde `X` es el componente de la celda. Las
cuatro cadenas aparecen una sola vez cada una en el fichero.

```tsx
            {activity.data?.kind === 'ok' ? (
              <View className="flex-row">
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Weight size={20} color={muted} />
                  <Text
                    testID="summary-weight"
                    …
                  </Text>
                  <Text className="text-2xs font-normal text-muted">
                    {t('home.weight')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Walk size={20} color={muted} />
                  <Text
                    testID="summary-activity"
                    …
                    {t('home.activity')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Moon size={20} color={muted} />
                  <Text
                    testID="summary-sleep"
                    …
                    {t('home.sleep')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1">
                  <Map size={20} color={muted} />
                  <Text
                    testID="summary-distance"
                    …
                    {t('home.distance')}
                  </Text>
                </View>
              </View>
            ) : null}
```

| Celda | `X` | `testID` del valor | `testID` del doble | Condición de la celda (para `*4`) | Etiqueta |
|---|---|---|---|---|---|
| **W** | `Weight` | `summary-weight` | `icon-weight` | `detail.data?.kind === 'ok' && detail.data.pet.currentWeightKg` | `{t('home.weight')}` |
| **A** | `Walk` | `summary-activity` | `icon-walk` | `today?.activeMinutes` | `{t('home.activity')}` |
| **S** | `Moon` | `summary-sleep` | `icon-moon` | `today?.restMinutes` | `{t('home.sleep')}` |
| **D** | `Map` | `summary-distance` | `icon-map` | `today?.distanceM` | `{t('home.distance')}` |

Fuera de la tira, `index.tsx` también pinta `<Moon size={20} color={accent} />`
(`collar-card` sin collar) y `<Map size={20} color={accent} />`
(`last-position-card`). No se tocan.

`muted` y `accent` salen de la misma llamada, `grep -n "const \[accent, success, warning, muted"`:
`useThemeColors(['accent-strong', 'success', 'warning', 'muted', …])`.

---

## R1 — cada icono en su celda del árbol, probado con W2

Vía (b) de C4: el commit rojo versiona la mutación de producción y el verde la
revierte.

### (0) Evidencia del agujero

- [ ] Aplica **W2** en `src/screens/home/index.tsx`, un solo cambio en la
      línea del icono de peso, que conserva sus 18 espacios:

      ```diff
      -                  <Weight size={20} color={muted} />
      +                  <Weight size={20} color={accent} />{false && <Weight size={20} color={muted} />}
      ```
- [ ] Blob (desde la raíz): `index.tsx` →
      `58a3c32b0765f7406e6462550b6fa691eaf6d031`.
- [ ] Con los tests **todavía sin tocar**, corre el fichero del candado.
      Esperado: **VERDE, `exit=0`, 144/144**. Guarda el log: es la prueba del
      agujero.

### (1) Commit ROJO — el `describe` de R1, con W2 puesta

- [ ] En `src/screens/home/index.test.tsx`, dentro de
      `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores')`,
      localiza la línea `  it('#69 R12: deja que cada celda se anuncie por separado', async () => {`
      (`grep -n "#69 R12: deja que cada celda se anuncie por separado"` da una
      sola línea). Justo encima está el `  });` que cierra el `it`
      `#69 R9: usa iconos de reicon y ningún emoji` y una línea en blanco.
      **Inserta justo antes de la línea del `it` `#69 R12`** este bloque. Acaba
      en una línea en blanco, así que queda una línea en blanco a cada lado:

      ```ts
        describe('#126 R1: cada celda de la tira pinta su propio icono en muted', () => {
          beforeEach(() => {
            // #126 R1: each CSS variable resolves to its own name, so muted and
            // accent-strong stop being the same fallback colour in the tree.
            jest
              .spyOn(Uniwind, 'getCSSVariable')
              .mockImplementation((token) => token);
          });

          afterEach(() => {
            jest.restoreAllMocks();
          });

          const cells = [
            ['summary-weight', 'icon-weight'],
            ['summary-activity', 'icon-walk'],
            ['summary-sleep', 'icon-moon'],
            ['summary-distance', 'icon-map'],
          ] as const;

          it('con las métricas de hoy', async () => {
            await renderHome();
            await waitFor(() =>
              expect(screen.getByTestId('summary-weight')).toHaveTextContent(
                '12.4 kg',
              ),
            );

            for (const [valueTestID, iconTestID] of cells) {
              // #126 R1: counted by the cell's children, not by testID: the icon,
              // the value and the label, with the icon first.
              const children = screen
                .getByTestId(valueTestID)
                .parent!.children.filter((child) => typeof child !== 'string');

              expect(children).toHaveLength(3);
              expect(children[0].props).toEqual({
                testID: iconTestID,
                size: 20,
                color: '--color-muted',
              });
            }
          });

          it('sin métricas ni peso', async () => {
            const pet = makePet({ currentWeightKg: null });
            mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
            mockGetPet.mockResolvedValue({ kind: 'ok', pet });
            mockGetDailyActivity.mockResolvedValue({
              kind: 'ok',
              days: [
                makeDay({
                  distanceM: null,
                  activeMinutes: null,
                  restMinutes: null,
                }),
              ],
              weekComparison: {
                distanceM: null,
                activeMinutes: null,
                walkCount: null,
              },
            });

            await renderHome();
            // #126 R1: a dash in summary-weight also shows before the pet detail
            // loads, so wait for the collar card, which needs that detail.
            await screen.findByTestId('collar-card');
            await screen.findByTestId('summary-weight');
            expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
            expect(screen.getByTestId('summary-activity')).toHaveTextContent('—');

            for (const [valueTestID, iconTestID] of cells) {
              const children = screen
                .getByTestId(valueTestID)
                .parent!.children.filter((child) => typeof child !== 'string');

              expect(children).toHaveLength(3);
              expect(children[0].props).toEqual({
                testID: iconTestID,
                size: 20,
                color: '--color-muted',
              });
            }
          });
        });

      ```

      - [ ] **No añadas imports.** `Uniwind`, `screen`, `waitFor`,
            `renderHome`, `makePet`, `makeDay`, `mockListPets`, `mockGetPet` y
            `mockGetDailyActivity` ya existen en el fichero. `icon-weight`,
            `icon-walk`, `icon-moon` e `icon-map` son los `testID` que pone el
            mock de `reicon` (`grep -n "mockIcon('icon-"`).
      - [ ] El valor esperado es **el literal `'--color-muted'`**, y los
            `testID` y el `20` también son literales. No los calcules con
            `useThemeColors` ni con nada importado de producción: el candado
            sería tautológico ([[design]] §Por qué el valor esperado es un
            literal).
      - [ ] El matcher es **`toEqual`**, no `toStrictEqual`: el nodo del doble
            lleva `children: undefined`, y `toStrictEqual` daría rojo en el
            árbol sano ([[design]] §Por qué `toEqual`).
      - [ ] **No toques** el `it` `#69 R9` (ni su título ni sus tres
            aserciones), `asigna cada valor, icono y etiqueta a su celda y a
            ninguna otra`, el `it` `#69 R12` ni el `beforeEach` de `#69 R1`.
- [ ] Blob del test: `index.test.tsx` →
      `71182e515fd5b4627a95d5e7e90d19370ffa3fbb`.
- [ ] Corre el fichero del candado. Esperado: **ROJO, `exit=1`, 2 failed de
      146**. Los dos son los `it` nuevos,
      `#69 R1: … › #126 R1: cada celda de la tira pinta su propio icono en muted › con las métricas de hoy`
      y `… › sin métricas ni peso`. Los dos fallan por **`toEqual`**, en la
      celda de peso (`"testID": "icon-weight"`), con
      `- "color": "--color-muted"` y `+ "color": "--color-accent-strong"`. El
      diff también imprime `+ "children": undefined`: no es la causa, porque
      `toEqual` ignora las claves `undefined`. Ningún `toHaveLength` cae. El
      `it` `#69 R9` **pasa**, porque la copia alimenta su cuenta. Si falla otra
      aserción, otro test o sale un `ReferenceError` o un `TypeError`, para.
- [ ] Commit (los dos ficheros):
      `test(mobile): expose the whole-file stats strip icon lock (R1)`

### (2) Commit VERDE — revertir W2

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx`. `HEAD` es el commit
      rojo, así que `HEAD~1` tiene el fichero sin mutar.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx; echo "exit=$?"`
      → `exit=0`. Blob → `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.
- [ ] El fichero del candado: **VERDE, `exit=0`, 146/146** (tu base + 2).
- [ ] El guard de hex: **VERDE, `exit=0`, 55** (o tu base).
- [ ] Commit:
      `test(mobile): lock each stats strip icon in its cell in the tree (R1)`

### (3) Refactor

- [ ] No hay refactor. No extraigas un helper para los hijos de la celda ni
      para el espía ([[design]] §Alternativas descartadas).

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

Cada clase se aplica a las cuatro celdas, con el prefijo de la celda: `W1`,
`A1`, `S1`, `D1`, y así. En la tabla, `X` es el componente de la celda y
«**el icono**» su línea de 18 espacios `<X size={20} color={muted} />`
(§El elemento de producción).

- «**La copia**» es `{false && <X size={20} color={muted} />}`.
- «**La siguiente celda**» es W→A, A→S, S→D y D→W.
- «**Fuera de la tira**» es una línea nueva de 8 espacios justo antes de
  `        {detail.data?.kind === 'ok' && connection ? (`, que aparece una sola
  vez.
- «**La condición**» y «**la etiqueta**» son las de la tabla de §El elemento
  de producción.

| Clase | Mutación exacta |
|---|---|
| `*1` | el icono → `<X size={20} color={accent} />` |
| `*2` | el icono → `<X size={20} color={accent} />` seguido, en la misma línea, de la copia |
| `*2o` | `*1`, y la copia en una línea de 18 espacios justo después del icono de **la siguiente celda** |
| `*2f` | `*1`, y la copia en una línea **fuera de la tira** |
| `*2j` | el icono → dos líneas de 18 espacios: `{/* <X size={20} color={muted} /> */}`, y debajo `<X size={20} color={accent} />` |
| `*2c` | `*1`, y la línea `// <X size={20} color={muted} />` añadida al final del fichero |
| `*3` | el icono → `{((muted: string) => <X size={20} color={muted} />)(accent)}` |
| `*4` | el icono → `{<condición> ? <X size={20} color={accent} /> : <X size={20} color={muted} />}` |
| `*4r` | el icono → `{<condición> ? <X size={20} color={muted} /> : <X size={20} color={accent} />}` |
| `*5` | `import { Pressable, ScrollView, Text, View } from 'react-native';` → `import { Platform, Pressable, ScrollView, Text, View } from 'react-native';`, y el icono → `<X size={20} color={Platform.OS === 'ios' ? muted : accent} />` |
| `*5d` | `*5`, con la copia en la misma línea, detrás del icono |
| `*6` | el icono → `<X size={20} color="--color-muted" />` |
| `*6d` | `*6`, con la copia en la misma línea, detrás del icono |
| `*7` | el icono → `<X size={24} color={muted} />` |
| `*7d` | `*7`, con la copia en la misma línea, detrás del icono |
| `*8` | el icono se mueve, intacto, de su sitio a justo después del `</Text>` (18 espacios) que sigue a **la etiqueta**: queda el último hijo de la celda |
| `*9` | una línea de 18 espacios `<Bell size={20} color={muted} />` justo después del icono |
| `*F1` | el icono → `<X color={muted} size={20} />` |
| `*F3` | el icono → `<X size={20} color={cellInk} />`, y la línea `  const cellInk = muted;` justo antes de `  const quickActionInks = useThemeColors(` |

Y tres sondas sueltas:

| Sonda | Mutación exacta |
|---|---|
| **X1** | se intercambian las líneas del icono de peso y del de actividad: `Walk` en la celda de peso y `Weight` en la de actividad |
| **X2** | se intercambian las líneas del icono de descanso y del de distancia |
| **T1** | en la lista de `useThemeColors` de `grep -n "const \[accent, success, warning, muted"`, la primera línea `      'muted',` después de esa → `      'accent-strong',` |

Si un blob no coincide pero la sustitución es única y el `diff` es el de la
tabla, vale el veredicto: el blob depende de la base.

### Exigido

Sobre `index.test.tsx` con R1 (146 tests). «Fuente» es el `it` `#69 R9` y
su matcher `toHaveLength`; «con» y «sin» son los dos `it` de R1,
`'con las métricas de hoy'` y `'sin métricas ni peso'`. «Otros» cuenta los
demás tests del fichero que caen. «Hoy» es el veredicto sobre `abbdb5b8` (144
tests), sin R1: son los fallos de la misma corrida que no son de R1, porque R1
solo añade un `describe` con su espía restaurado. No hace falta repetirlo.

| Sonda | Blob de `index.tsx` | Exigido: pasan / fallan | Fuente | con | sin | Otros | Hoy | Nota |
|---|---|---|---|---|---|---|---|---|
| W1 | `64a17dd048f72a613d45b6315eff577f502a2b2e` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| A1 | `440ee1b1bacb51942a07ad7d019369531079620f` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| S1 | `9acd86fa306117e1dd86e7661a037cf2296e572e` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| D1 | `2644dd7ca521f490b011cd72e266fc7d17a9f98f` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| W2 | `58a3c32b0765f7406e6462550b6fa691eaf6d031` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| A2 | `95164462275f23f72eb18dffeccb11de8854eea4` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| S2 | `86e083042e919d42bda078020ba66e26cca5edfd` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| D2 | `553ca82ca82aa3297a88b712c003205eaf559dd2` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| W2o | `94db602b4727ccd9b836e741fd16bbeb6304cc01` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia en otra celda |
| A2o | `2a1e491eda0c5c8c2183c38a891e319e4c00d2a4` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia en otra celda |
| S2o | `ad4531e69e29e48a6a975bddc6aa0a8f28950882` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia en otra celda |
| D2o | `cd03996510dfb211295b765d7653d7cc8eb133d3` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia en otra celda |
| W2f | `a4af14498bd124d4c474b2fd5533ee7b9653e071` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia fuera de la tira |
| A2f | `ba5b67de6af7723549f5d028c9f917b8d4fb695c` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia fuera de la tira |
| S2f | `af7ae319b4081e9df94807b514046c31bf511a59` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia fuera de la tira |
| D2f | `838aef1e648d7d66730547291e48e9952c1b5035` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: copia fuera de la tira |
| W2j | `462a9f52e2c623507cc33fceddf6a27797120aa8` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| A2j | `45c0bc205468c33ffd9dc2743f318e78c22a1ec6` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| S2j | `02c3b7d80c7cc7d714f453037666e1913bfbe2e5` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| D2j | `4610ff108f2c2eb007268d84429bb1db48f39e89` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| W2c | `0c39ff28f0b4a468651abb660c23903fce06dc6e` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| A2c | `3ce4f48fc241949df05228ba898b5c1a0ae421f7` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| S2c | `fd6e81bc3704e338686b0934dcd90bb6c470ec86` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| D2c | `864a86bcdbb15e39ff7a15c8739bff30367356f2` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| W3 | `ceff13aab4f53601accc3b3d77186ece56c4e7bc` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| A3 | `8ad65a8bdc004fa1c3f831daf15ddb0350fc10f5` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| S3 | `c0e5157be795b5b142afbe0679547ccd589465bc` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| D3 | `f81ac9bfdf0e56001019224a1af522f6d8912cdc` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra** |
| W4 | `a03e666bbb78c904f6074997fae149d13fed3882` | 145 / 1 | verde | **ROJO** `toEqual` | verde | 0 | verde | **se cierra**, solo por el estado con métricas |
| A4 | `698b416744fe5ced30a1485282b47185594d0bb1` | 145 / 1 | verde | **ROJO** `toEqual` | verde | 0 | verde | **se cierra**, solo por el estado con métricas |
| S4 | `bcbb66ce16032ddd97ba20dbcd27c1edbb364aec` | 145 / 1 | verde | **ROJO** `toEqual` | verde | 0 | verde | **se cierra**, solo por el estado con métricas |
| D4 | `13c7afb54fda51274a92b85eb70ad48a4e8f67fc` | 145 / 1 | verde | **ROJO** `toEqual` | verde | 0 | verde | **se cierra**, solo por el estado con métricas |
| W4r | `db9e5df7f7ddc3f1064874c4cf7a0f90277c71c1` | 145 / 1 | verde | verde | **ROJO** `toEqual` | 0 | verde | **se cierra**, solo por el estado sin métricas |
| A4r | `706755215e445ae76b02c31bf9c58f1f97607c67` | 145 / 1 | verde | verde | **ROJO** `toEqual` | 0 | verde | **se cierra**, solo por el estado sin métricas |
| S4r | `346b10f6fb10ed7946a83fdaf45b55a74975a2ac` | 145 / 1 | verde | verde | **ROJO** `toEqual` | 0 | verde | **se cierra**, solo por el estado sin métricas |
| D4r | `33b1d705728a11aa0f08f20012df9b099430d2c0` | 145 / 1 | verde | verde | **ROJO** `toEqual` | 0 | verde | **se cierra**, solo por el estado sin métricas |
| W5 | `a7005111b472abc5a1d8440f579067f802dbeaa5` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el árbol corre en `'ios'` |
| A5 | `dbfcb9defe91bdf16a3e9e4e457b216b98b77631` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el árbol corre en `'ios'` |
| S5 | `2e8862c67fbc957ea29c2247e8a930379e11aef5` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el árbol corre en `'ios'` |
| D5 | `a65028f3fa0d8a2c1583a0d4e9924ceb271a214d` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el árbol corre en `'ios'` |
| W5d | `b736e8634fe38c24d1f3e54ac5e39f461359ba20` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| A5d | `30719ec209a3b85ecdafed74e117af0fa09d6d7c` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| S5d | `360a1d7e167a170400e60e45be3913445c4c42ef` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| D5d | `47b8e15af7b6e107b737e733965ef001cf583d78` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| W6 | `1c782116abe5dc6e3354eac57bcb12db0fdda42a` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el espía devuelve el nombre |
| A6 | `2ab549e85e5135bd8649430db8503c76bdf23ca9` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el espía devuelve el nombre |
| S6 | `3e60d7a213147bc178726211d5bf08b8f5b75f22` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el espía devuelve el nombre |
| D6 | `77297077d8d076cfb3c124f36eb866407883d7dd` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio: el espía devuelve el nombre |
| W6d | `b9ac0b3bc973cf7c14ee731a245d2e7508ae35ce` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| A6d | `f77c15a364244d9f85068e363ff33a6619c65a13` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| S6d | `700b50144dcfef125200fbf9e20c3c8e44c44b47` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| D6d | `0c8474437a580729da828303cacdfc4003b278fb` | 146 / 0 | verde | verde | verde | 0 | verde | **límite documentado** |
| W7 | `8311bdd93cd14e43cf5ce031741ab69983c7d6ec` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| A7 | `ef24539a0d2dafd9381a82bbc4182d067d92a3d4` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| S7 | `0c394f2e48f0a6f7b67f31cdb6e74980a61f26c8` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| D7 | `834a8c322841137b725e89f8adfbd83491fc8b66` | 143 / 3 | **ROJO** `toHaveLength` | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | rojo, `toHaveLength` | declarado: ya caía; caen también los dos de R1 |
| W7d | `34717f2ab52f5897158b6cfa85b8db2af802d0ab` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el tamaño |
| A7d | `4db4c7c12b2ea92d611f2455b026d364ccb3ca1c` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el tamaño |
| S7d | `3b542d733575db6497284b9fd7d1ea3f70661a4a` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el tamaño |
| D7d | `badf7c8bde777f84b03b58d68d9e1f4905e6e17f` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el tamaño |
| W8 | `19eed8dad85304241fb9624bfda747043b4d3946` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el orden (punto 4 de la firma) |
| A8 | `23edda9f71acbb8dd5ea0b44b0e6546484be3da5` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el orden (punto 4 de la firma) |
| S8 | `9201d0590c313e6a72db3f796c0ba74420a2e5e9` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el orden (punto 4 de la firma) |
| D8 | `2933e83e7c6bea436aced58a320a6b0fe91c4770` | 144 / 2 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 0 | verde | **se cierra**: el orden (punto 4 de la firma) |
| W9 | `c398711e20543c5fac5196db420aa6c1585fe3d8` | 144 / 2 | verde | **ROJO** `toHaveLength` | **ROJO** `toHaveLength` | 0 | verde | **se cierra**: la cardinalidad (punto 4 de la firma) |
| A9 | `eacab4f42da9bf265145519a36c42655a318c2d0` | 144 / 2 | verde | **ROJO** `toHaveLength` | **ROJO** `toHaveLength` | 0 | verde | **se cierra**: la cardinalidad (punto 4 de la firma) |
| S9 | `3f2ad7debd1077ab30a99b70b588d7a4118f97c3` | 144 / 2 | verde | **ROJO** `toHaveLength` | **ROJO** `toHaveLength` | 0 | verde | **se cierra**: la cardinalidad (punto 4 de la firma) |
| D9 | `b11fc4290dbc90be308bace6cef82e207f97371a` | 144 / 2 | verde | **ROJO** `toHaveLength` | **ROJO** `toHaveLength` | 0 | verde | **se cierra**: la cardinalidad (punto 4 de la firma) |
| WF1 | `a09666eb5e432fa284c312d767732a2fcc9569c4` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| AF1 | `968be608d7e7444734826ca607ddbbc468515e60` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| SF1 | `ce2cd55dd7916d96d9a9227e2f7545bd26ebf4ec` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| DF1 | `2dffd5e3c0b26bbdc8465a36c9ab05fa114ab96d` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| WF3 | `2e6a7ed8f844b760850f60d8a331bb7d81b04304` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| AF3 | `a5a98f22ccb6d393f2180463430baa0faf8e14f1` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| SF3 | `2db04a186d577e5949df84accbfc86ec4740fa06` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| DF3 | `f7bdfbcf42cbc357d3363eaf7e8c27f661751d35` | 145 / 1 | **ROJO** `toHaveLength` | verde | verde | 0 | rojo, `toHaveLength` | sin cambio (rojo falso heredado) |
| X1 | `80c48cc95e38d4118e6907eca217bbd0b41f7ebc` | 143 / 3 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 1 | rojo, 1 otro | declarado: ya caía; caen también los dos de R1 |
| X2 | `43fa17afaeab7dcc3ef5a5d03739edfb1fe4ad5f` | 143 / 3 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 1 | rojo, 1 otro | declarado: ya caía; caen también los dos de R1 |
| T1 | `c1e13841a9f247810a068af529233734a846d476` | 141 / 5 | verde | **ROJO** `toEqual` | **ROJO** `toEqual` | 3 | rojo, 3 otros | declarado: ya caía; caen también los dos de R1 |

Los «otros»:

- en **X1** y **X2**,
  `#69 R1: … › asigna cada valor, icono y etiqueta a su celda y a ninguna otra`,
  por `Unable to find an element with testID: icon-weight` (X1) e
  `icon-moon` (X2);
- en **T1**, los dos `it` de `#124 R1` (`sin alertas abiertas` y
  `con alertas abiertas`) y
  `#70 R1: la Home dibuja la sección de recordatorios › #70 R8: estado vacío de próxima vacuna › dibuja un estado vacío con forma de fila cuando no hay vacuna`,
  los tres por `toBe`.

Las cuatro celdas dan, clase a clase, las mismas cifras y los mismos matchers.
Si una sonda da otro veredicto, **para y repórtalo**, con el log.

---

## R3 — por qué los iconos se aseveran en el árbol

- [ ] (1) En `src/screens/home/index.test.tsx`, dentro del `it` `#69 R9`
      (`grep -n "#69 R9: usa iconos de reicon"`), añade **justo debajo** de
      `expect(reiconImport).toMatch(/\bWeight\b/);` y **justo encima** de la
      cuenta este comentario de cuatro líneas y nada más:

      ```diff
           expect(reiconImport).toMatch(/\bWeight\b/);
      +    // #126 R1: this counts the whole file, so a copy of an icon anywhere lends
      +    // it the fourth match. Each cell's icon, size and ink are locked in the
      +    // tree by the #126 R1 describe below. This count stays for what the tree
      +    // cannot see: a platform branch, or a CSS variable name written by hand.
           expect(
             source.match(
               /<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g,
             ) ?? [],
           ).toHaveLength(4);
      ```

      Las cuatro líneas llevan 4 espacios de sangrado, como la aserción. Ni la
      cuenta ni el resto del `it` cambian.
- [ ] Blob del test → `22adaad0efee536b46c058a9646df7705c830b2a`.
- [ ] (2) En `docs/conventions.md`, sección
      `### Recortes del tag de apertura en candados de fuente`, localiza la
      línea
      `` `grep -n "se pinta con la tinta muted" mobile-pet-tracker/src/screens/home/index.test.tsx`. ``
      (`grep -n "se pinta con la tinta muted" docs/conventions.md` da una sola
      línea), que cierra el párrafo de la campana (#124). Entre esa línea más
      su línea en blanco y el encabezado `### Esperas sobre el árbol renderizado`,
      **inserta** este párrafo literal, seguido de una línea en blanco:

      ~~~markdown
      Si el elemento se **repite**, como los cuatro iconos de la tira de hoy, contar
      sus copias en el fichero entero tampoco lo acota: un señuelo en cualquier sitio
      repone la cuenta. El árbol ancla cada icono a su celda, que es el padre del
      valor que la celda pinta, y cierra la celda por sus hijos: cuántos tiene, cuál
      va primero y las props exactas del icono (componente, tamaño y tinta), con
      `toEqual`. Los estados que monta son los que cambian los datos de las celdas.
      Así lo hace la tira (#126):
      `grep -n "pinta su propio icono" mobile-pet-tracker/src/screens/home/index.test.tsx`.
      ~~~

      El resultado es: la línea del `grep` de la campana, línea en blanco, las
      ocho líneas del párrafo, línea en blanco,
      `### Esperas sobre el árbol renderizado`. Nada más de la sección cambia.
- [ ] Blob de `docs/conventions.md` → `bb2ca08e8d386028c5b871055c22789c667695ed`.
- [ ] (3) Comprobaciones, desde la **raíz del repo**:
      - `grep -c '#126 R' mobile-pet-tracker/src/screens/home/index.test.tsx` → `6`
      - `grep -c 'mockImplementation((token) => token)' mobile-pet-tracker/src/screens/home/index.test.tsx` → `7`
      - `grep -c "'--color-muted'" mobile-pet-tracker/src/screens/home/index.test.tsx` → `6`
      - `grep -c "pinta su propio icono" mobile-pet-tracker/src/screens/home/index.test.tsx` → `1`
      - `grep -cF '/<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g,' mobile-pet-tracker/src/screens/home/index.test.tsx` → `1`
      - `grep -c "pinta su propio icono" docs/conventions.md` → `1`
      - desde `mobile-pet-tracker/`: el guard de hex → verde, 55 (o tu base), y
        el fichero del candado → verde, 146 (tu base + 2)
- [ ] (4) Commit (solo esos dos ficheros):
      `docs(mobile): explain why the strip icons are locked in the tree (R3)`

---

## R4 — cierre: cero diff de producción

- [ ] Desde la raíz:
      `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"`
      → `exit=0`.
- [ ] Si la base sigue siendo `d7cb0d60`:
      - `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
        `dbb5b0346895cfc26705bee2257d1f8a8815df6c`;
      - en el commit rojo de R1: `58a3c32b0765f7406e6462550b6fa691eaf6d031`
        (`git rev-parse <rojo>:mobile-pet-tracker/src/screens/home/index.tsx`).
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` → solo
      `src/screens/home/index.test.tsx`.
- [ ] Suite completa: `exit=0`, delta **+0 suites / +2 tests** contra tu base
      (83 / 1512 / 1 snapshot sobre `d7cb0d60`).
- [ ] `tsc` y `lint`: `exit=0`.
- [ ] `traceability.md`: las columnas de commit rellenas y ninguna fila
      «pendiente».
- [ ] Reporte en `progress/impl_mobile-home-cell-icons-source-lock-unbounded.md`
      con: la base medida, el log de (0) y su blob, el rojo con sus dos fallos,
      las 79 filas de R2 con pasan/fallan y matcher, las comprobaciones de R3 y
      el delta. Copia las líneas de resumen de los logs en el reporte: los
      ficheros de `/tmp` no se versionan.
- [ ] Commit (solo el reporte y `traceability.md`):
      `docs(mobile): record the strip icon lock evidence (R2,R4)`.
      Va el último porque versiona los hashes de los commits anteriores.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` fuera del par rojo→verde de R1.
- En el `it` `#69 R9`: el título, el `readFileSync`, el recorte del import de
  `reicon` y sus tres aserciones. Solo gana el comentario de R3 (1).
- `asigna cada valor, icono y etiqueta a su celda y a ninguna otra`, el `it`
  `#69 R12` y los demás `it` de `#69 R1`.
- El `beforeEach` de `#69 R1` y el `beforeEach` de nivel superior del fichero.
- El mock de `reicon-react-native` del fichero: los nombres `icon-*` se quedan
  (§#80 de [[requirements]]).
- El `describe` `#124 R1` y todo lo de la campana.
- En `docs/conventions.md`, todo lo que no sea el párrafo de R3 (2).
- `src/__tests__/design-drift.test.ts`.
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`:
  esta feature no añade claves de copy, y el candado de longitud del catálogo no
  se toca.
- `feature_list.json` y `progress/current.md`: los toca el `leader`.
- `package.json` y `bun.lock`: ninguna dependencia nueva.
- No rebasees la rama después de rellenar los hashes de `traceability.md`.
