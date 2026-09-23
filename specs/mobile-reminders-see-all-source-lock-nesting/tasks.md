---
feature: "mobile-reminders-see-all-source-lock-nesting"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-reminders-see-all-source-lock-nesting]] (#112)

> Disciplina TDD. Ver [[requirements]] para los R-ids y [[design]] para la
> medición que sostiene cada decisión. **No uses números de línea**: localiza
> todo con los `grep` que se dan.

## Antes de tocar nada

- [ ] `cd mobile-pet-tracker`. **Todos** los comandos de este fichero corren
      desde ahí: el candado abre `join(process.cwd(), 'src/screens/home/index.tsx')`.
- [ ] `rm -f .expo/types/router.d.ts`: los tipos de expo-router están
      gitignorados y rompen el typecheck con rutas fantasma.
- [ ] Usa **`bun` / `bunx`**, nunca `npx` ni `npm`.
- [ ] **Ningún comando con pipe.** `bunx jest | tail` devuelve el exit de
      `tail`. Guarda la salida en un fichero y léelo después.
- [ ] **Mide la base tú mismo** y apunta las tres cifras en el reporte: tests
      del fichero, suites/tests de la suite y exit de `tsc`. En `993b62fa` eran
      140, 82/1452 y 0. Si difieren porque otra feature mergeó, vale **tu**
      base: el gate es el delta **+0**.
- [ ] **Sin skills de Expo.** Es un cambio solo de test, sin UI, y
      `expo-overview` no existe en el catálogo de Codex. No hace falta ninguna.
- [ ] **No escribas `#` + número en `src/screens/home/index.test.tsx`** salvo
      en la forma `#112 R1`. Una cita suelta (`#112`, `#109/#112`) pone rojos
      cinco guards de `src/__tests__/design-drift.test.ts`. La palabra
      `StyleSheet` tampoco puede aparecer ([[design]] §El guard de hex).

Comandos canónicos:

```bash
# el fichero del candado (no lleva paréntesis, pero usa siempre --runTestsByPath)
bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/112_home.log 2>&1; echo "exit=$?"

# solo el candado
bunx jest --runTestsByPath src/screens/home/index.test.tsx -t 'muestra feedback visual al pulsar el enlace' > /tmp/112_lock.log 2>&1; echo "exit=$?"

# suite completa
bunx jest > /tmp/112_all.log 2>&1; echo "exit=$?"

# typecheck
rm -f .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/112_tsc.log 2>&1; echo "exit=$?"
```

Comprueba siempre que jest imprime `Test Suites: 1 …` en las corridas de un
fichero. `-t 'muestra feedback visual…'` selecciona el candado antes y después
del renombrado, porque el título viejo sobrevive como subcadena.

---

## El bloque de producción del que parten todas las sondas

En `src/screens/home/index.tsx` (`grep -n 'testID="reminders-see-all"'`), las
11 líneas que van desde el `<Pressable` hasta su `</Pressable>`:

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

En lo que sigue, «**la receta**» es
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` y «**la línea de
estilo**» es la quinta línea del bloque.

---

## R1 + R2 — el recorte se acota al tag propio, y N1 lo prueba

R1 y R2 **comparten un único par rojo→verde**. R2 es requisito de verificación
por la **vía (b) de C4**: la receta ya está en producción, así que un candado
escrito sobre ella nacería verde. Por eso **el commit rojo versiona la mutación
de producción y el verde la revierte**, igual que #109
(`specs/mobile-meal-toggle-source-lock-nesting/traceability.md`, aprobado por
el `reviewer`). Mutar un doble no vale (C4, quinto punto).

### (0) Evidencia del agujero, antes de tocar el test

- [ ] Aplica **N1** en `src/screens/home/index.tsx`. El bloque queda así
      (cambian la línea de estilo y el hijo):

      ```tsx
                    <Pressable
                      testID="reminders-see-all"
                      accessibilityRole="button"
                      className="min-h-11 justify-center"
                      style={{ opacity: 1 }}
                      onPress={() => router.push('/reminders')}
                    >
                      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                        <Text className="text-xs font-semibold text-accent-strong">
                          {t('home.remindersSeeAll')}
                        </Text>
                      </Pressable>
                    </Pressable>
      ```

- [ ] Con el test **todavía sin tocar**, corre el fichero. Esperado:
      **VERDE, `exit=0`, 140/140** (en `993b62fa` la suite entera también da
      82/1452 verde). Guarda el log: es la prueba de que el agujero existe.

### (1) Commit ROJO — recorte nuevo, con N1 puesta

- [ ] En `src/screens/home/index.test.tsx`, en el `it` que devuelve
      `grep -n "muestra feedback visual al pulsar el enlace"`:
      - [ ] renómbralo a
            `'#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura'`
            (entero, con el título viejo dentro, ver [[design]] §Título del `it`);
      - [ ] sustituye las dos líneas del recorte
            (`grep -n "lastIndexOf('<Pressable'"`) de modo que quede:
            ```ts
            const block = source.slice(
              source.lastIndexOf('<', anchor),
              source.indexOf('<', anchor),
            );
            ```
      - [ ] **no toques** el ancla, `opacityOf`, la pata de árbol ni la regex.
- [ ] Corre el fichero. Esperado: **ROJO, `exit=1`, 1 failed / 139 passed**, y
      el fallo es **del `#112 R1` por `toMatch`**. El `Received string` tiene
      que ser el tag propio, con `style={{ opacity: 1 }}` y sin
      `<Pressable style=` dentro. Si falla por `toBe(1)` o cae otro test, para.
- [ ] Commit (solo esos dos ficheros):
      `test(mobile): expose the reminders-see-all source lock nesting hole (R1,R2)`

### (2) Commit VERDE — revertir N1

- [ ] `git checkout HEAD~1 -- src/screens/home/index.tsx`. `HEAD` es el
      commit rojo, así que `HEAD~1` tiene el fichero sin mutar.
- [ ] `git diff --exit-code "$(git merge-base origin/main HEAD)" -- src/screens/home/index.tsx`
      → `exit=0`.
- [ ] Fichero: **VERDE, `exit=0`, 140/140** (o tu base).
- [ ] Commit:
      `test(mobile): bound the reminders-see-all source lock to its own opening tag (R1,R2)`

### (3) Refactor

- [ ] No hay refactor. Son dos líneas: no extraigas un helper ni una utilidad
      compartida, y no toques `elementWithTestId` ni el candado de la campana
      ([[requirements]] §Fuera de alcance).

---

## R2 — la segunda sonda de agujero (W1)

Sobre el árbol **ya verde**: aplica la mutación, corre el fichero, apunta el
veredicto y **revierte**. No se commitea.

- [ ] **W1**: la línea de estilo pasa a `style={{ opacity: 1 }}`, el
      `<Pressable>` se autocierra (`/>` en lugar de `>`, sin hijos y sin
      `</Pressable>`) y justo después va un hermano con la receta y el mismo
      `<Text>`:

      ```tsx
                    <Pressable
                      testID="reminders-see-all"
                      accessibilityRole="button"
                      className="min-h-11 justify-center"
                      style={{ opacity: 1 }}
                      onPress={() => router.push('/reminders')}
                    />
                    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                      <Text className="text-xs font-semibold text-accent-strong">
                        {t('home.remindersSeeAll')}
                      </Text>
                    </Pressable>
      ```

      Esperado: el **`#112 R1` ROJO por `toMatch`**. Con el recorte viejo daba
      verde. Caen además 3 tests por el texto (`#85 R1` ×2 y `#70 R1`), que es
      lo esperado.

---

## R3 — sondas sin falsos rojos

Mismo método: mutar, correr, apuntar, **revertir antes de la siguiente**.
Todas parten del bloque de producción intacto.

| | Mutación exacta | Exigido en `#112 R1` |
|---|---|---|
| **N1p** | como N1, pero **borrando** la línea `style={{ opacity: 1 }}` | ROJO por `toBe(1)` |
| **N2** | la línea de estilo intacta; el `<Text>` envuelto en `<Pressable onPress={() => undefined}>` … `</Pressable>` | VERDE |
| **S1** | la línea de estilo → `style={{ opacity: 1 }}` | ROJO por `toMatch` |
| **S1p** | la línea de estilo borrada | ROJO por `toBe(1)` |
| **S2** | S1 + la línea `<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} />` **justo antes** del `<Pressable` de `reminders-see-all` | ROJO por `toMatch` |
| **S3** | S1 + esa misma línea **justo después** del `</Pressable>` de `reminders-see-all` | ROJO por `toMatch` |
| **E2** | la línea `hitSlop={0 < 1 ? 8 : 0}` como **primera** prop, antes de `testID` | VERDE |
| **E3** | la línea de estilo movida a **primera** prop, antes de `testID` | VERDE |
| **V6** | la línea de estilo partida en tres: `style={({ pressed }) => ({` / `  opacity: pressed ? 0.8 : 1,` / `})}` | ROJO por `toMatch` |
| **V7** | en la línea de estilo, `0.8` → `0.5` | ROJO por `toMatch`, con la pata de árbol en verde |
| **L2** | S1 + la línea `{'style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}'}` justo antes del `<Text` | ROJO por render roto (`Unable to find an element with testID: reminders-see-all`); unos 118 tests caen |
| **E1** | la línea `hitSlop={0 < 1 ? 8 : 0}` **justo después** de `testID="reminders-see-all"` | **ROJO por `toMatch`** (límite 1; con el recorte viejo daba verde) |

- [ ] Las doce sondas, con el veredicto y el matcher que falla, en una tabla
      de `progress/impl_mobile-reminders-see-all-source-lock-nesting.md`.
- [ ] Si alguna fila no coincide con «Exigido», **para y repórtalo**. No
      ajustes el recorte ni la regex para que cuadre.
- [ ] `git diff --exit-code HEAD -- src/screens/home/index.tsx` → `exit=0` al
      terminar la tanda.

---

## R4 — el estado del patrón, anclado por contenido

No lleva par rojo→verde: es un entregable de documentación y lo verifica el
`reviewer` leyendo.

- [ ] (1) En `src/screens/home/index.test.tsx`, **justo encima** del
      `const block = source.slice(` del `#112 R1`, este comentario literal,
      sangrado al nivel del `const`:

      ```ts
      // #112 R1: own opening tag of reminders-see-all, from `<` to `<`. Ending
      // at `</Pressable>` let a nested Pressable lend it a foreign style. A `<`
      // inside the tag shrinks the slice and fails red; a string child placed
      // before the first element child still lands in the slice and can pass
      // green. Both limits: docs/conventions.md, opening-tag slices section.
      ```

- [ ] (2) En `docs/conventions.md`, sección
      `### Recortes del tag de apertura en candados de fuente`, sustituye el
      **último párrafo entero** (el que empieza por `El patrón ya vive en` y
      termina en `que se registró aparte.`) por este texto literal:

      ```markdown
      El patrón vive en tres candados. Localízalos por contenido y no por número de
      línea, porque los números se desplazan con cada merge:

      - `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`, la
        implementación de referencia: `grep -n "lastIndexOf('<', use.index)"`.
      - `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`, el
        `meal-toggle` (#109): `grep -n "lastIndexOf('<', anchor)"`.
      - `mobile-pet-tracker/src/screens/home/index.test.tsx`, el
        `reminders-see-all` (#112): el mismo grep.

      No queda ningún recorte de `<Tag` a `</Tag>` por migrar:
      `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` no devuelve nada.
      ```

      El resto de la sección (la regla, los dos límites y el párrafo del
      segundo límite) **no se toca**.
- [ ] (3) Comprobaciones, desde la raíz del repo:
      - `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src; echo "exit=$?"` → `exit=1`
      - `grep -n "3355\|309-311" docs/conventions.md; echo "exit=$?"` → `exit=1`
      - `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` (desde
        `mobile-pet-tracker/`) → verde. Comprueba que el comentario no ha
        roto los guards de hex.
- [ ] (4) Commit: `docs(mobile): record the last opening-tag slice migration (R4)`

---

## R5 — cierre: cero diff de producción

- [ ] `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx` → `exit=0`.
- [ ] Si la base sigue siendo `993b62fa`:
      `git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx` →
      `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` → solo
      `mobile-pet-tracker/src/screens/home/index.test.tsx`.
- [ ] Suite completa: `exit=0` y delta **+0 suites / +0 tests** contra tu base.
- [ ] `tsc`: `exit=0`.
- [ ] `traceability.md`: las dos columnas de commit rellenas y ninguna fila
      «pendiente».
- [ ] Reporte en `progress/impl_mobile-reminders-see-all-source-lock-nesting.md`
      con: la base medida, el log de (0), el rojo de (1) con su
      `Received string`, la tabla de W1 más las doce sondas de R3, y el delta.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` fuera del par rojo→verde.
- La regex de la receta, el ancla, `opacityOf` y la pata de árbol.
- `elementWithTestId` (`consistency-classnames.test.ts`,
  `legibility-classnames.test.ts`) y el candado de la campana (`#78 R10`):
  son hallazgos registrados, no alcance.
- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`.
  Esta feature no añade claves de copy y el candado de longitud del catálogo
  no se toca.
- `specs/mobile-home-reminders-section/traceability.md`.
- `package.json` y `bun.lock`: ninguna dependencia nueva.
- No rebasees la rama después de rellenar los hashes de `traceability.md`.
