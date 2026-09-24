---
feature: "mobile-home-bell-source-lock-unbounded"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-home-bell-source-lock-unbounded]] (#121)

> Disciplina TDD. Ver [[requirements]] para los R-ids y [[design]] para la
> medición que sostiene cada decisión. **No uses números de línea**: localiza
> todo con los `grep` que se dan. #84 va a mergear encima y los moverá.

## Antes de tocar nada

- [ ] `cd mobile-pet-tracker`. **Todos** los comandos de este fichero corren
      desde ahí, porque el candado abre `join(process.cwd(), 'src/screens/home/index.tsx')`.
      Los de `git` y `grep` con rutas `mobile-pet-tracker/…` corren desde la
      raíz del repo, y se indica.
- [ ] `rm -f .expo/types/router.d.ts` antes de **cada** `bunx tsc --noEmit`.
      Los tipos de expo-router están gitignorados y rompen el typecheck con
      rutas fantasma.
- [ ] **Si el sandbox te deniega un comando** (por ejemplo ese `rm -f`), para y
      repórtalo. No lo sustituyas por otro que haga lo mismo.
- [ ] Usa **`bun` / `bunx`**, nunca `npx` ni `npm`.
- [ ] **Ningún comando con pipe.** `bunx jest | tail` devuelve el exit de
      `tail`. Guarda la salida en un fichero y léelo después.
- [ ] **Mide la base tú mismo** y apunta las cifras en el reporte: tests del
      fichero, tests de `design-drift.test.ts`, suites/tests de la suite y exit
      de `tsc` y de `lint`. En `f44cf3d5` eran 140, 55, 82/1452, 0 y 0. Si
      difieren porque otra feature mergeó, vale **tu** base: el gate es el
      delta **+0**.
- [ ] **No cargues ninguna skill.** Es un cambio solo de test, sin UI.
- [ ] **No escribas `#` + número en `src/screens/home/index.test.tsx`** salvo
      en la forma `#121 R1`. Una cita suelta (`#121`, `(#121)`, `#112/#121`)
      pone rojos cinco guards de `src/__tests__/design-drift.test.ts`. La
      palabra `StyleSheet` tampoco puede aparecer ([[design]] §El guard de hex).
- [ ] Jest siempre con `--runTestsByPath`, y comprueba que imprime
      `Test Suites: 1 …` en las corridas de un fichero.

Comandos canónicos:

```bash
# el fichero del candado
bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/121_home.log 2>&1; echo "exit=$?"

# solo el candado: selecciona el it antes y después del renombrado
bunx jest --runTestsByPath src/screens/home/index.test.tsx -t 'usa la ruta real sin cast Href' > /tmp/121_lock.log 2>&1; echo "exit=$?"

# el guard de hex
bunx jest --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/121_drift.log 2>&1; echo "exit=$?"

# suite completa
bunx jest > /tmp/121_all.log 2>&1; echo "exit=$?"

# typecheck y lint
rm -f .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/121_tsc.log 2>&1; echo "exit=$?"
bunx expo lint > /tmp/121_lint.log 2>&1; echo "exit=$?"
```

---

## El bloque de producción del que parten todas las sondas

En `src/screens/home/index.tsx` (`grep -n 'testID="home-alerts-bell"'`), las
20 líneas que van desde el `<Pressable` hasta su `</Pressable>`:

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

En lo que sigue:

- «**la receta**» es `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`;
- «**la línea de estilo**» es la línea de la receta **de este bloque**. La
  otra copia del fichero, la de `reminders-see-all`, **no se toca nunca**;
- «**la línea del ancla**» es `testID="home-alerts-bell"`;
- «**la línea del icono**» es `<Bell size={24} color={muted} />`.

Todas las líneas que se añaden van al sangrado de sus vecinas.

---

## R1 + R2 — la receta se acota al tag propio, y N1 lo prueba

R1 y R2 **comparten un único par rojo→verde**. R2 es requisito de verificación
por la **vía (b) de C4**: la receta ya está en producción, así que un candado
escrito sobre ella nacería verde. Por eso **el commit rojo versiona la mutación
de producción y el verde la revierte**, igual que #109 y #112. Mutar un doble
no vale (C4, quinto punto).

### (0) Evidencia del agujero, antes de tocar el test

- [ ] Aplica **N1** en `src/screens/home/index.tsx`: la línea de estilo pasa a
      `style={{ opacity: 1 }}`. No cambia nada más:

      ```diff
                     className="size-11 items-center justify-center rounded-full"
      -              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      +              style={{ opacity: 1 }}
                     onPress={() => router.push('/alerts')}
      ```

- [ ] Con el test **todavía sin tocar**, corre el fichero. Esperado:
      **VERDE, `exit=0`, 140/140** (o tu base). En `f44cf3d5` la suite entera
      también da 82/1452 en verde. Guarda el log: es la prueba de que el
      agujero existe.
- [ ] `git hash-object src/screens/home/index.tsx`: con la base `f44cf3d5`
      da `675ae7a1c18b400c234a9dbef2950c1175aaf026`. Apúntalo.

### (1) Commit ROJO — recorte nuevo, con N1 puesta

- [ ] En `src/screens/home/index.test.tsx`, el `it` que devuelve
      `grep -n "usa la ruta real sin cast Href"` (dentro de
      `describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`)
      tiene que quedar **exactamente** así:

      ```ts
        it('#121 R1: usa la ruta real sin cast Href y conserva el feedback de pulsado, acotado a su tag de apertura', () => {
          const source = readFileSync(
            join(process.cwd(), 'src/screens/home/index.tsx'),
            'utf8',
          );
          const anchor = source.indexOf('testID="home-alerts-bell"');
          const block = source.slice(
            source.lastIndexOf('<', anchor),
            source.indexOf('<', anchor),
          );

          expect(appRoutes(join(process.cwd(), 'src/app'))).toContain('/alerts');
          expect(source).not.toContain("'/alerts' as Href");
          expect(block).toMatch(
            /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/,
          );
          expect(source).toContain('<Bell size={24} color={muted} />');
        });
      ```

      Frente a lo que hay, son tres cambios y nada más:
      - [ ] el título, con el viejo entero dentro ([[design]] §Título del `it`);
      - [ ] las cinco líneas de `anchor` y `block`, justo después del
            `const source`;
      - [ ] en la aserción de la receta, `expect(source).toMatch(` →
            `expect(block).toMatch(`.
      - [ ] **No toques** la regex, ni las otras tres aserciones, ni su orden.
            Siguen contra `source`.
- [ ] Corre el fichero. Esperado: **ROJO, `exit=1`, 1 failed / 139 passed**, y
      el fallo es del **`#121 R1` por `toMatch`**. El `Received string` tiene
      que ser el tag propio: empieza por `<Pressable`, contiene
      `style={{ opacity: 1 }}`, termina en el `>` del tag más el sangrado, y
      **no** contiene `<Bell`. Si falla por otra aserción, por un
      `ReferenceError` o cae otro test, para.
- [ ] Commit (solo esos dos ficheros):
      `test(mobile): expose the unbounded home-alerts-bell source lock (R1,R2)`

### (2) Commit VERDE — revertir N1

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx`. `HEAD` es el
      commit rojo, así que `HEAD~1` tiene el fichero sin mutar.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx`
      → `exit=0`.
- [ ] Fichero: **VERDE, `exit=0`, 140/140** (o tu base).
- [ ] Commit:
      `test(mobile): bound the home-alerts-bell source lock to its own opening tag (R1,R2)`

### (3) Refactor

- [ ] No hay refactor. No extraigas un helper ni una utilidad compartida con
      el recorte de `reminders-see-all`, y no toques `elementWithTestId` ni la
      aserción del icono ([[requirements]] §Fuera de alcance).

---

## R2 — las otras seis sondas de agujero

Sobre el árbol **ya verde**: aplica la mutación, corre el fichero, apunta el
veredicto y el matcher que falla, y **revierte antes de la siguiente**. No se
commitean. Todas parten del bloque de producción intacto.

| | Mutación exacta | Exigido en `#121 R1` | Otros que caen |
|---|---|---|---|
| **S1p** | la línea de estilo, borrada | ROJO por `toMatch` | 0 |
| **V7** | en la línea de estilo, `0.8` → `0.5` | ROJO por `toMatch` | 0 |
| **N1n** | N1, y la línea del icono envuelta en `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>` … `</Pressable>` | ROJO por `toMatch` | 0 |
| **W1** | el bloque de abajo | ROJO por `toMatch` | 3 |
| **S2** | N1, y la línea `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />` **justo antes** del `<Pressable` de la campana | ROJO por `toMatch` | 2 |
| **S3** | N1, y esa misma línea **justo después** del `</Pressable>` de la campana | ROJO por `toMatch` | 2 |

**W1**: N1, el `>` que cierra el tag pasa a `/>`, y justo debajo se abre un
hermano con la receta que se queda los hijos y el `</Pressable>` original:

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
              style={{ opacity: 1 }}
              onPress={() => router.push('/alerts')}
            />
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <Bell size={24} color={muted} />
              {hasOpenAlerts ? (
                <View
                  testID="home-alerts-dot"
                  className="absolute right-1 top-1 size-2.5 rounded-full bg-danger"
                />
              ) : null}
            </Pressable>
```

Los «otros» que caen están previstos, y son los mismos antes y después del
recorte ([[design]] §La medición completa):

- con W1: `#78 R10 › compone el selector…`, `#73 R9 › la pildora no entra en el slot…`
  y `#78 R11 › pinta el punto…`;
- con S2 y S3: los dos primeros.

---

## R3 — sondas sin falsos rojos, con tres cambios declarados

Mismo método: mutar, correr, apuntar y **revertir antes de la siguiente**.
Todas parten del bloque de producción intacto.

| | Mutación exacta | Exigido en `#121 R1` | Otros que caen |
|---|---|---|---|
| **N2** | la línea de estilo intacta; la línea del icono envuelta en `<Pressable onPress={() => undefined}>` … `</Pressable>` | VERDE | 0 |
| **E2** | la línea `hitSlop={0 < 1 ? 8 : 0}` **justo antes** de la línea del ancla | VERDE | 0 |
| **E3** | la línea de estilo movida **justo antes** de la línea del ancla | VERDE | 0 |
| **L2** | N1, y la línea `{'style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}'}` justo antes de la línea del icono | VERDE: límite 2 | **119**: render roto (`Text strings must be rendered within a <Text> component`) |
| **P1** | N1, y la línea `{/* style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} */}` justo antes de la línea del icono | VERDE: punto ciego de #122 | 0 |
| **P2** | la línea de estilo sustituida por dos: `// style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` y `style={{ opacity: 1 }}` | VERDE: punto ciego de #122 | 0 |
| **P4** | N1, y la línea `{false && <Pressable testID="home-alerts-bell" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />}` **justo antes** del `<Pressable` de la campana | VERDE: punto ciego de #122 | 0 |
| **E1** | la línea `hitSlop={0 < 1 ? 8 : 0}` **justo después** de la línea del ancla | **ROJO por `toMatch`**: cambio declarado (límite 1) | 0 |
| **V6** | la línea de estilo partida en tres: `style={({ pressed }) => ({` / `  opacity: pressed ? 0.8 : 1,` / `})}` | **ROJO por `toMatch`**: cambio declarado (regex rígida) | 0 |
| **A0** | la línea del ancla pasa a `testID="home-bell"` | **ROJO por `toMatch`**, con `Received string: ""`: cambio declarado | **9**: todos de `#78 R10` y `#78 R11` |

- [ ] Las seis sondas de R2 y las diez de R3, con el veredicto, el matcher que
      falla y los «otros», en una tabla de
      `progress/impl_mobile-home-bell-source-lock-unbounded.md`.
- [ ] Si alguna fila no coincide con «Exigido», **para y repórtalo**. No
      ajustes el recorte ni la regex para que cuadre. **En particular, no
      intentes poner en rojo P1, P2 ni P4**: son de #122.
- [ ] Al terminar la tanda, `git diff --exit-code HEAD -- src/screens/home/index.tsx`
      → `exit=0`.

---

## R4 — el estado del patrón, anclado por contenido

No lleva par rojo→verde: es un entregable de documentación, y lo verifica el
`reviewer` leyendo.

- [ ] (1) En `src/screens/home/index.test.tsx`, **justo encima** del
      `const block = source.slice(` del `#121 R1` (entre la línea del
      `const anchor` y la del `const block`), este comentario literal,
      sangrado al nivel del `const`:

      ```ts
          // #121 R1: own opening tag of home-alerts-bell, from `<` to `<`. Matching
          // the whole file let the reminders-see-all recipe stand in for the bell's.
          // Same two limits as reminders-see-all: docs/conventions.md, opening-tag
          // slices section.
      ```

- [ ] (2) En `docs/conventions.md`, sección
      `### Recortes del tag de apertura en candados de fuente`, sustituye el
      **bloque final entero**, desde la línea que empieza por
      `El patrón vive en tres candados.` hasta la que termina en
      `` mobile-pet-tracker/src` no devuelve nada. `` (incluida), por este
      texto literal:

      ```markdown
      El patrón vive en estos candados. Localízalos por contenido y no por número de
      línea, porque los números se desplazan con cada merge:

      - `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`, la
        implementación de referencia: `grep -n "lastIndexOf('<', use.index)"`.
      - `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`, el
        `meal-toggle` (#109): `grep -n "lastIndexOf('<', anchor)"`.
      - `mobile-pet-tracker/src/screens/home/index.test.tsx`, la campana
        `home-alerts-bell` (#121) y el `reminders-see-all` (#112): el mismo grep.

      No queda ningún recorte de `<Tag` a `</Tag>` por migrar:
      `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` no devuelve nada.

      Tampoco vale aseverar la receta contra el fichero entero. Si otro elemento del
      mismo fichero la repite, esa copia da el verde aunque el elemento vigilado la
      pierda: así pasaba con la campana hasta #121. Ancla en el propio tag y recorta
      como arriba.
      ```

      El resto de la sección (la regla, los dos límites y el párrafo del
      segundo límite) **no se toca**. Ese párrafo es de #122.
- [ ] (3) Comprobaciones, desde la **raíz del repo**:
      - `grep -c "lastIndexOf('<', anchor)" mobile-pet-tracker/src/screens/home/index.test.tsx` → `2`
      - `grep -n "expect(source).toMatch(" mobile-pet-tracker/src/screens/home/index.test.tsx; echo "exit=$?"` → `exit=1`
      - `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src; echo "exit=$?"` → `exit=1`
      - `grep -n "tres candados" docs/conventions.md; echo "exit=$?"` → `exit=1`
      - desde `mobile-pet-tracker/`, el guard de hex (comando canónico) →
        verde y con tu base (55 en `f44cf3d5`). Comprueba que el comentario no
        ha roto los guards.
      - el fichero del candado → verde, 140/140 (o tu base).
- [ ] (4) Commit (solo esos dos ficheros):
      `docs(mobile): record the home-alerts-bell opening-tag slice (R4)`

---

## R5 — cierre: cero diff de producción

- [ ] Desde la raíz del repo:
      `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` → `exit=0`.
- [ ] Si la base sigue siendo `f44cf3d5`:
      `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
      `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, y
      `git rev-parse <commit rojo>:mobile-pet-tracker/src/screens/home/index.tsx`
      → `675ae7a1c18b400c234a9dbef2950c1175aaf026`.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` → solo
      `mobile-pet-tracker/src/screens/home/index.test.tsx`.
- [ ] Suite completa: `exit=0` y delta **+0 suites / +0 tests** contra tu base.
- [ ] `tsc` y `lint`: `exit=0`.
- [ ] `traceability.md`: las columnas de commit rellenas y ninguna fila
      «pendiente».
- [ ] Reporte en `progress/impl_mobile-home-bell-source-lock-unbounded.md`
      con: la base medida, el log de (0) y el blob de N1, el rojo de (1) con su
      `Received string`, la tabla de las seis sondas de R2 y las diez de R3, y
      el delta.
- [ ] Commit (solo el reporte y `traceability.md`):
      `docs(mobile): record the home-alerts-bell verification evidence (R3,R5)`.
      Va el último porque versiona los hashes de los commits anteriores.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` fuera del par rojo→verde, y **nunca** la copia
  de la receta de `reminders-see-all`.
- La regex de la receta y las otras tres aserciones del `it`: la ruta, el cast
  y el icono.
- El `#112 R1` de `reminders-see-all`, `elementWithTestId`
  (`consistency-classnames.test.ts`, `legibility-classnames.test.ts`) y los
  puntos ciegos P1, P2 y P4: son de #112, #120 y #122.
- En `docs/conventions.md`, todo lo que no sea el bloque final de §Recortes del
  tag de apertura.
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`:
  esta feature no añade claves de copy, y el candado de longitud del catálogo
  no se toca.
- Las specs de #78, #112 y #114.
- `package.json` y `bun.lock`: ninguna dependencia nueva.
- No rebasees la rama después de rellenar los hashes de `traceability.md`.
