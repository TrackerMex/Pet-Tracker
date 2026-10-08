/home/claude/sites/Pet-Tracker-wt-155
feature/155-mobile-empty-states-pingo
d4e044b3
(git status --short: vacío)

# Implementación #155 — mobile-empty-states-pingo

H0: `d4e044b3` (HEAD del handoff). No init.sh por instrucción expresa; el leader ejecuta el gate. Sin push, PR ni cambios fuera de la lista.

## Anclas en H0

A1: `test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok`
```text
ok
```

A2: `test ! -e mobile-pet-tracker/src/components/empty-state.tsx && echo ok`
```text
ok
```

A3: `grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
```text
1
```

A4: `grep -cF "['pingo-wave-blink.webp', 'pingo-wave.webp']" mobile-pet-tracker/src/screens/welcome/index.test.tsx`
```text
1
```

A5: `grep -cF '### §2.20 — Añadidos por #153 — Pingo en la bienvenida' specs/mobile-ui-language/design.md`
```text
1
```

A6: `grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md`
```text
1
```

A7: `grep -cF '13 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
```text
2
```

A8: `grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A9: `grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A10: `grep -cF 'expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A11: `grep -cF 'expect(R4_MAP).toHaveLength(17);' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A12: `grep -cF 'expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1); // +1 #95 R4, -2 #95 R5, +1 #114 R4, -1 #114 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A13: `grep -cF 'expect(R14_GEOFENCES).toHaveLength(18);' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
```text
1
```

A14: `grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'alerts.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
```text
1
```

A15: `grep -cF "{ file: 'src/screens/reminders/index.tsx', key: 'reminders.noRemindersYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
```text
1
```

A16: `grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
```text
1
```

A17: `grep -cF "{ file: 'src/app/(tabs)/food.tsx', key: 'food.noMealPlanYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
```text
1
```

A18: `grep -cE "\{ file: 'src/(screens/home/index|screens/health/index|app/\(tabs\)/food|screens/map/index)\.tsx', key: 'common\.noPetsYet' \}," mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
```text
4
```

A19: `grep -cE "^\s+['\"](common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet|docs\.emptyBody)['\"]:" mobile-pet-tracker/src/i18n/catalog.ts`
```text
12
```

A20: `grep -rlE '<EmptyState\b' mobile-pet-tracker/src | wc -l`
```text
0
```

A21: `for p in "home-empty:src/screens/home/index.test.tsx" "health-empty:src/screens/health/index.test.tsx" "food-empty:src/app/(tabs)/__tests__/food.test.tsx" "food-plan-empty:src/app/(tabs)/__tests__/food.test.tsx" "map-no-pets:src/screens/map/index.test.tsx" "alerts-empty:src/screens/alerts/index.test.tsx" "reminders-empty:src/screens/reminders/index.test.tsx"; do id=${p%%:*}; echo "$id $(grep -cF "getByTestId('$id')).toHaveTextContent(" "mobile-pet-tracker/${p#*:}")"; done`
```text
home-empty 1
health-empty 1
food-empty 1
food-plan-empty 1
map-no-pets 1
alerts-empty 1
reminders-empty 1
```

A22: `grep -cF "expect(screen.getByTestId('alerts-empty').props.className).toBe(" mobile-pet-tracker/src/screens/alerts/index.test.tsx`
```text
1
```

A23: `grep -cF "es['alerts.empty']," mobile-pet-tracker/src/screens/alerts/index.test.tsx`
```text
1
```

A24: `grep -cF "it('pinta el vacío con su tarjeta y su copy'" mobile-pet-tracker/src/screens/geofences/index.test.tsx`
```text
1
```

A25: `grep -cF "getByTestId('docs-empty')" mobile-pet-tracker/src/screens/docs/index.test.tsx`
```text
1
```

A26: `grep -cF "['home-empty', () => mockListPets.mockResolvedValue({ kind: 'ok', pets: [] }), []]," mobile-pet-tracker/src/screens/home/index.test.tsx`
```text
1
```

A27: `grep -cF "import { router" mobile-pet-tracker/src/screens/map/index.test.tsx`
```text
0
```

A28: `ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '`
```text
pingo-clipboard.webp pingo-collar.webp pingo-food.webp pingo-health.webp pingo-sleep.webp pingo-talk.webp pingo-wave-blink.webp pingo-wave.webp ```

A29: `git diff --stat origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
```text
```

H1: `grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md`
```text
1
```

H2: `grep -cF -- '- [x] Clasificación, poses (A1, A2, A9) y copy final (A7, A8) aprobados (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md`
```text
1
```

H3: `grep -cF -- '- [ ] Smoke R12 superado en dev build de Android (fecha: ____)' specs/mobile-empty-states-pingo/requirements.md`
```text
1
```

H4: `grep -cF "describe('#155" mobile-pet-tracker/src/screens/home/index.test.tsx`
```text
0
```

H5: `grep -cF 'mockRouter' mobile-pet-tracker/src/screens/map/index.test.tsx`
```text
0
```

H6: `grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':" mobile-pet-tracker/src/i18n/catalog.ts`
```text
0
```

H7: `grep -cF "'docs.emptyBody': 'Medical documents will appear here.'," mobile-pet-tracker/src/i18n/catalog.ts`
```text
1
```

H8: `grep -cF '### §2.21' specs/mobile-ui-language/design.md`
```text
0
```

H9: `grep -cF '<Card testID="docs-empty"' mobile-pet-tracker/src/screens/docs/index.tsx`
```text
1
```

H10: `grep -cF '<Card testID="geofences-empty"' mobile-pet-tracker/src/screens/geofences/index.tsx`
```text
1
```

H11: `ls mobile-pet-tracker/assets/images | grep -c '^pingo-'`
```text
2
```

H12: `grep -cF "it('shows a dedicated empty state'" mobile-pet-tracker/src/screens/docs/index.test.tsx`
```text
1
```

H13: `grep -cF "it('shows the empty state'" mobile-pet-tracker/src/screens/reminders/index.test.tsx`
```text
1
```

H14: `grep -cF "it('pinta el estado vacío'" mobile-pet-tracker/src/screens/alerts/index.test.tsx`
```text
1
```

H15: `grep -rlF '#155' mobile-pet-tracker/src | wc -l`
```text
0
```

H16: `grep -A1 -E "^\s+'(common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet)':" mobile-pet-tracker/src/i18n/catalog.ts | grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':"`
```text
0
```

## Base y entorno

`git fetch origin`: exit=0. `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`: exit=0. HEAD completo: d4e044b36cdbeca1da66e42eb32463af9e04e48c.

node_modules: presente. `test ! -e .expo/types/router.d.ts; echo "exit=$?"`: exit=0.

Skills cargadas: building-native-ui (plugin Expo), .agents/skills/appllama-app-design-skill, .agents/skills/emil-design-eng y ponytail. Carta y spec prevalecen: Tailwind y HeroUI existentes, sin movimiento; investigación del leader y smoke Android humano sustituyen los pasos de MCP/simulador. A1-A9 cerradas en su defecto.

Comando BASE, desde mobile-pet-tracker/: exit=0.
```bash
FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx src/screens/alerts/index.test.tsx src/screens/reminders/index.test.tsx src/screens/docs/index.test.tsx src/screens/geofences/index.test.tsx src/screens/welcome/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-base.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 14 passed, 14 total
Tests:       825 passed, 825 total
```

## T1 R1 — rojo

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r1.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       18 failed, 1 passed, 19 total
```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara common.noPetsBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "Add your pet and I'll help you know where they are and how they're doing."
    Received: undefined

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara alerts.emptyBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "All is calm. If anything happens, I'll let you know here."
    Received: undefined

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara reminders.emptyBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "Once you create a reminder, I'll let you know on time."
    Received: undefined

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara geofences.emptyBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "Once there's a safe zone, I'll let you know if your pet leaves it."
    Received: undefined

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara food.noMealPlanBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "Once there's a plan, I'll help you keep track of every meal."
    Received: undefined

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › declara docs.emptyBody en inglés y en español
    expect(received).toBe(expected) // Object.is equality

    Expected: "When your pet's medical documents arrive, I'll keep them here."
    Received: "Medical documents will appear here."

      21 | describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
      22 |   it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    > 23 |     expect(enCatalog[key]).toBe(english);
         |                            ^
      24 |     expect(esCatalog[key]).toBe(spanish);
      25 |   });
      26 |

      at toBe (src/components/__tests__/empty-state.test.tsx:23:28)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › common.noPetsBody no exclama, no lleva emoji y termina en punto en los dos idiomas
    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      27 |   it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
      28 |     for (const v of [enCatalog[key], esCatalog[key]]) {
    > 29 |       expect(v).not.toMatch(/[!¡]/);
         |                     ^
      30 |       expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      31 |       expect(v).toMatch(/\.$/);
      32 |     }

      at toMatch (src/components/__tests__/empty-state.test.tsx:29:21)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › alerts.emptyBody no exclama, no lleva emoji y termina en punto en los dos idiomas
    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      27 |   it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
      28 |     for (const v of [enCatalog[key], esCatalog[key]]) {
    > 29 |       expect(v).not.toMatch(/[!¡]/);
         |                     ^
      30 |       expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      31 |       expect(v).toMatch(/\.$/);
      32 |     }

      at toMatch (src/components/__tests__/empty-state.test.tsx:29:21)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › reminders.emptyBody no exclama, no lleva emoji y termina en punto en los dos idiomas
    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      27 |   it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
      28 |     for (const v of [enCatalog[key], esCatalog[key]]) {
    > 29 |       expect(v).not.toMatch(/[!¡]/);
         |                     ^
      30 |       expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      31 |       expect(v).toMatch(/\.$/);
      32 |     }

      at toMatch (src/components/__tests__/empty-state.test.tsx:29:21)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › geofences.emptyBody no exclama, no lleva emoji y termina en punto en los dos idiomas
    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      27 |   it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
      28 |     for (const v of [enCatalog[key], esCatalog[key]]) {
    > 29 |       expect(v).not.toMatch(/[!¡]/);
         |                     ^
      30 |       expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      31 |       expect(v).toMatch(/\.$/);
      32 |     }

      at toMatch (src/components/__tests__/empty-state.test.tsx:29:21)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › food.noMealPlanBody no exclama, no lleva emoji y termina en punto en los dos idiomas
    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      27 |   it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
      28 |     for (const v of [enCatalog[key], esCatalog[key]]) {
    > 29 |       expect(v).not.toMatch(/[!¡]/);
         |                     ^
      30 |       expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      31 |       expect(v).toMatch(/\.$/);
      32 |     }

      at toMatch (src/components/__tests__/empty-state.test.tsx:29:21)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › registra las claves en la tabla de mobile-ui-language
    expect(received).toContain(expected) // indexOf

    Expected substring: "### §2.21 — Añadidos por #155 — Pingo en los estados vacíos"
    Received string:    "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      34 |
      35 |   it('registra las claves en la tabla de mobile-ui-language', () => {
    > 36 |     expect(languageDesign()).toContain('### §2.21 — Añadidos por #155 — Pingo en los estados vacíos');
         |                              ^
      37 |   });
      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {

      at Object.toContain (src/components/__tests__/empty-state.test.tsx:36:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › common.noPetsBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `common\.noPetsBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › alerts.emptyBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `alerts\.emptyBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › reminders.emptyBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `reminders\.emptyBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › geofences.emptyBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `geofences\.emptyBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › food.noMealPlanBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `food\.noMealPlanBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```text
#155 R1: el copy de los vacíos existe en los dos idiomas › docs.emptyBody tiene fila de #155 en mobile-ui-language
    expect(received).toMatch(expected)

    Expected pattern: /\| — \| `docs\.emptyBody`[^\n]*← (?:añadida|cambiada) por #155 \(R1\)/
    Received string:  "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      38 |
      39 |   it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    > 40 |     expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
         |                              ^
      41 |   });
      42 | });
      43 |

      at toMatch (src/components/__tests__/empty-state.test.tsx:40:30)

```

```bash
FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/155-r1-lp.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
```

```text
#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
    expect(received).toHaveLength(expected)

    Expected length: 371
    Received length: 366
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 6 - 1 // #117 R1
      58 |         + 8 // #118 R1

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)

```

Cadena literal del handoff, R1 rojo, exit=0:
```text
+ grep -qE '^Tests: +18 failed, 1 passed, 19 total$' /tmp/155-r1.txt
+ grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/155-r1-lp.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r1.txt /tmp/155-r1-lp.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx
++ git diff --cached --name-only
++ tr '\n' ' '
++ LC_ALL=C
++ sort
+ test 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx ' = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R1 red copy de los vacíos'
[feature/155-mobile-empty-states-pingo 9ced6cc5] test(mobile-empty-states): #155 R1 red copy de los vacíos
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 44 insertions(+), 1 deletion(-)
 create mode 100644 mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
```

Commit T1 R1 rojo: 9ced6cc5 test(mobile-empty-states): #155 R1 red copy de los vacíos. Typecheck y lint: exit=0.

## T1 R1 — verde

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/155-g1.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       43 passed, 43 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g1-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff, R1 verde, exit=0:
```text
+ grep -qE '^Tests: +43 passed, 43 total$' /tmp/155-g1.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g1-guardas.txt
++ grep -A1 -E '^\s+'\''(common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet)'\'':' src/i18n/catalog.ts
++ grep -cE '^\s+'\''(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)'\'':'
+ test 10 = 10
++ grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' ../specs/mobile-ui-language/design.md
+ test 1 = 1
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md '
+ git commit -m 'feat(mobile-empty-states): #155 R1 copy de los vacíos'
[feature/155-mobile-empty-states-pingo d6528bd0] feat(mobile-empty-states): #155 R1 copy de los vacíos
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 23 insertions(+), 2 deletions(-)
```

Commit T1 R1 verde: d6528bd0 feat(mobile-empty-states): #155 R1 copy de los vacíos. Typecheck y lint: exit=0.

## T2 R2 — rojo

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r2.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       6 failed, 19 passed, 25 total
```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-talk.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-talk.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-sleep.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-sleep.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-clipboard.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-clipboard.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-health.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-health.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-collar.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-collar.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```text
#155 R2: las poses de los vacíos entran como WebP › pingo-food.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes
    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/assets/images/pingo-food.webp'

      48 |     'pingo-health.webp', 'pingo-collar.webp', 'pingo-food.webp',
      49 |   ])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 50 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
         |                   ^
      51 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      52 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      53 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/components/__tests__/empty-state.test.tsx:50:19)

```

```bash
FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/155-r2-w.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 64 passed, 65 total
```

```text
#153 R3: las poses entran como WebP › no mete otras poses de Pingo
    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 0

      Array [
    -   "pingo-clipboard.webp",
    -   "pingo-collar.webp",
    -   "pingo-food.webp",
    -   "pingo-health.webp",
    -   "pingo-sleep.webp",
    -   "pingo-talk.webp",
        "pingo-wave-blink.webp",
        "pingo-wave.webp",
      ]

      351 |   it('no mete otras poses de Pingo', () => {
      352 |     expect(readdirSync(join(process.cwd(), 'assets', 'images')).filter((name) => /^(pingo|mascot)-/.test(name)).sort())
    > 353 |       .toEqual(['pingo-clipboard.webp', 'pingo-collar.webp', 'pingo-food.webp', 'pingo-health.webp', 'pingo-sleep.webp', 'pingo-talk.webp', 'pingo-wave-blink.webp', 'pingo-wave.webp']);
          |        ^
      354 |   });
      355 | });
      356 |

      at Object.toEqual (src/screens/welcome/index.test.tsx:353:8)

```

Cadena literal del handoff, R2 rojo, exit=0:
```text
+ grep -qE '^Tests: +6 failed, 19 passed, 25 total$' /tmp/155-r2.txt
++ grep -cE 'ENOENT: no such file or directory.*pingo-(talk|sleep|clipboard|health|collar|food)\.webp' /tmp/155-r2.txt
+ test 6 -ge 6
+ grep -qE '^Tests: +1 failed, 64 passed, 65 total$' /tmp/155-r2-w.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r2.txt /tmp/155-r2-w.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/components/__tests__/empty-state.test.tsx src/screens/welcome/index.test.tsx
++ git diff --cached --name-only
++ tr '\n' ' '
++ LC_ALL=C
++ sort
+ test 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx ' = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R2 red poses WebP'
[feature/155-mobile-empty-states-pingo e3ddd2ab] test(mobile-empty-states): #155 R2 red poses WebP
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 18 insertions(+), 1 deletion(-)
```

Commit T2 R2 rojo: e3ddd2ab test(mobile-empty-states): #155 R2 red poses WebP. Typecheck y lint: exit=0.

## T2 R2 — verde

Copia R2: `cp /home/claude/pet-tracker-mascot/webp/pingo-{talk,sleep,clipboard,health,collar,food}.webp assets/images/; echo "exit=$?"`: exit=0.

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/screens/welcome/index.test.tsx > /tmp/155-g2.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       90 passed, 90 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g2-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff, R2 verde, exit=0:
```text
+ grep -qE '^Tests: +90 passed, 90 total$' /tmp/155-g2.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g2-guardas.txt
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-talk.webp assets/images/pingo-talk.webp
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-sleep.webp assets/images/pingo-sleep.webp
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-clipboard.webp assets/images/pingo-clipboard.webp
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-health.webp assets/images/pingo-health.webp
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-collar.webp assets/images/pingo-collar.webp
++ for p in talk sleep clipboard health collar food
++ cmp -s /home/claude/pet-tracker-mascot/webp/pingo-food.webp assets/images/pingo-food.webp
+ test -z ''
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add assets/images/pingo-clipboard.webp assets/images/pingo-collar.webp assets/images/pingo-food.webp assets/images/pingo-health.webp assets/images/pingo-sleep.webp assets/images/pingo-talk.webp
++ LC_ALL=C
++ sort
++ git diff --cached --name-only
++ tr '\n' ' '
+ test 'mobile-pet-tracker/assets/images/pingo-clipboard.webp mobile-pet-tracker/assets/images/pingo-collar.webp mobile-pet-tracker/assets/images/pingo-food.webp mobile-pet-tracker/assets/images/pingo-health.webp mobile-pet-tracker/assets/images/pingo-sleep.webp mobile-pet-tracker/assets/images/pingo-talk.webp ' = 'mobile-pet-tracker/assets/images/pingo-clipboard.webp mobile-pet-tracker/assets/images/pingo-collar.webp mobile-pet-tracker/assets/images/pingo-food.webp mobile-pet-tracker/assets/images/pingo-health.webp mobile-pet-tracker/assets/images/pingo-sleep.webp mobile-pet-tracker/assets/images/pingo-talk.webp '
+ git commit -m 'feat(mobile-empty-states): #155 R2 poses WebP'
[feature/155-mobile-empty-states-pingo d7b6aa28] feat(mobile-empty-states): #155 R2 poses WebP
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 6 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 mobile-pet-tracker/assets/images/pingo-clipboard.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-collar.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-food.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-health.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-sleep.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-talk.webp
```

Commit T2 R2 verde: d7b6aa28 feat(mobile-empty-states): #155 R2 poses WebP. Typecheck y lint: exit=0.

## T3 R3 — rojo

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r3.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       0 total
```

```text
Test suite failed to run
    Cannot find module '../empty-state' from 'src/components/__tests__/empty-state.test.tsx'

      3 |
      4 | import { en, es } from '../../i18n/catalog';
    > 5 | import { EmptyState } from '../empty-state';
        | ^
      6 |
      7 | const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      8 | const { join } = jest.requireActual<typeof import('path')>('path');

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.require (src/components/__tests__/empty-state.test.tsx:5:1)

```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/consistency-classnames.test.ts > /tmp/155-r3-c.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 53 passed, 55 total
```

```text
#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › deja todos los botones primarios sólidos en un único radio
    expect(received).toHaveLength(expected)

    Expected length: 17
    Received length: 16
    Received array:  ["rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", "rounded-xl bg-accent", …]

      100 |     );
      101 |
    > 102 |     expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3
          |                           ^
      103 |     expect(filesMatching(/rounded-2xl bg-accent(?=[\s'"`])/)).toEqual([]);
      104 |   });
      105 | });

      at Object.toHaveLength (src/__tests__/consistency-classnames.test.ts:102:27)

```

```text
#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
    expect(received).toBe(expected) // Object.is equality

    Expected: 17
    Received: 16

      397 |     expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
      398 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
    > 399 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3
          |                                                       ^
      400 |     expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11
      401 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      402 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:399:55)

```

Cadena literal del handoff, R3 rojo, exit=0:
```text
+ grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/155-r3.txt
+ grep -qE '^Tests: +0 total$' /tmp/155-r3.txt
+ grep -qF 'Cannot find module '\''../empty-state'\'' from '\''src/components/__tests__/empty-state.test.tsx'\''' /tmp/155-r3.txt
++ grep -c 'Cannot find module' /tmp/155-r3.txt
++ grep -cF 'Cannot find module '\''../empty-state'\''' /tmp/155-r3.txt
+ test 1 = 1
+ grep -qE 'TypeError|ReferenceError|SyntaxError' /tmp/155-r3.txt
+ grep -qE '^Tests: +2 failed, 53 passed, 55 total$' /tmp/155-r3-c.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r3-c.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
+ true
++ grep -c 'error TS' /tmp/155-r3-tsc.txt
+ test 1 = 1
+ grep -qE '^src/components/__tests__/empty-state\.test\.tsx\([0-9]+,[0-9]+\): error TS2307:' /tmp/155-r3-tsc.txt
+ bun run lint
+ true
+ grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/155-r3-lint.txt
++ grep -cF 'Unable to resolve path to module '\''../empty-state'\''' /tmp/155-r3-lint.txt
+ test 1 = 1
+ git add src/components/__tests__/empty-state.test.tsx src/__tests__/consistency-classnames.test.ts
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx ' = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R3 red componente EmptyState'
[feature/155-mobile-empty-states-pingo d7455e94] test(mobile-empty-states): #155 R3 red componente EmptyState
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 74 insertions(+), 2 deletions(-)
```

T3 tsc:
```text
$ tsc --noEmit
src/components/__tests__/empty-state.test.tsx(5,28): error TS2307: Cannot find module '../empty-state' or its corresponding type declarations.
```

T3 lint:
```text
$ expo lint

/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  5:28  error  Unable to resolve path to module '../empty-state'  import/no-unresolved

✖ 1 problem (1 error, 0 warnings)

error: "eslint" exited with code 1
error: script "lint" exited with code 1
```

Commit T3 R3 rojo: d7455e94 test(mobile-empty-states): #155 R3 red componente EmptyState. Typecheck y lint: exit=0 salvo el rojo acotado de T3.

## T3 R3 — verde

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g3.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       36 passed, 36 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g3-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff, R3 verde, exit=1:
```text
+ grep -qE '^Tests: +36 passed, 36 total$' /tmp/155-g3.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g3-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint

/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  5:28  error  Unable to resolve path to module '../empty-state'  import/no-unresolved

✖ 1 problem (1 error, 0 warnings)

error: "eslint" exited with code 1
error: script "lint" exited with code 1
```

PARADA: la cadena anterior no llegó al commit; último eslabón en su traza.

## Parada obligatoria — T3 verde

La cadena de T3 verde terminó con exit=1 en `bun run lint`, antes de `git add` y del commit. `bun run typecheck` pasó (exit=0). El componente existe y Jest pasa, pero lint informa en `src/components/__tests__/empty-state.test.tsx:5:28`: `Unable to resolve path to module '../empty-state'` (`import/no-unresolved`), con `✖ 1 problem (1 error, 0 warnings)`. No se ha aplicado workaround ni repetido la cadena. Se para por la instrucción expresa del handoff («Si una cadena no llega al commit, PARA»).

Resultado T3 verde medido: Tests: 36 passed, 36 total; GUARDAS: Tests: 174 passed, 174 total; ambos exit=0. El nuevo componente queda sin commitear; no hay commit verde de R3. No se ha tocado la trazabilidad. T4-T11 y el cierre siguen pendientes.

Commits realizados (5 de los 21 previstos):
```text
9ced6cc5 test(mobile-empty-states): #155 R1 red copy de los vacíos
d6528bd0 feat(mobile-empty-states): #155 R1 copy de los vacíos
e3ddd2ab test(mobile-empty-states): #155 R2 red poses WebP
d7b6aa28 feat(mobile-empty-states): #155 R2 poses WebP
d7455e94 test(mobile-empty-states): #155 R3 red componente EmptyState
```

Estado al parar:
```text
?? mobile-pet-tracker/src/components/empty-state.tsx
?? progress/impl_mobile-empty-states-pingo.md
```

## Pasos del smoke R12 para el humano

WHEN la implementación está verde, THE SYSTEM SHALL superar un smoke del
humano en la **dev build de Android** (nunca Expo Go), con la dev build ya
instalada y `bunx expo start --dev-client` desde `mobile-pet-tracker/`. Las
poses entran por `require` y viajan en el bundle de JS, así que no hace falta
reconstruir la parte nativa; si no aparecen, `bunx expo run:android`.

Pasos, en español y luego en inglés (Perfil → idioma):

1. Con una cuenta sin mascotas: Inicio, Salud, Comida y Mapa muestran a
   Pingo con la pose `talk`, el título, la frase de §Copy final y el botón
   «Añadir mascota» / «Add pet». Pulsar el botón en cada una abre el alta de
   mascota.
2. Con una mascota recién creada: Alertas (pose `sleep`), Recordatorios
   (`clipboard`, con el botón «Nuevo» / «New» encima), Documentos (`health`)
   y Comida sin plan (`food`, con las tarjetas de horario e historial debajo)
   muestran pose, título y frase, sin botón propio.
3. Con una mascota que tiene collar con suscripción activa y ninguna zona
   segura: Zonas seguras muestra la pose `collar`, el título y la frase, sin
   botón propio. Una mascota sin collar no sirve para este paso, porque
   `PetTrackingGuard` responde 402 y la pantalla pinta
   `geofences-no-tracking`, que queda fuera de alcance.
4. En modo oscuro, la pose no muestra recuadro ni halo: el fondo es
   transparente.
5. Con el texto del sistema al máximo, título y frase se parten en líneas sin
   cortarse y el botón sigue visible al hacer scroll donde la pantalla lo
   tenga.
6. Los vacíos en texto de §Clasificación (por ejemplo, vacunas en Salud o el
   registro de peso) siguen igual que antes.

Lo firma el humano en §Aprobación, casilla «Smoke R12».

R12: pendiente del smoke humano

## Reanudacion 1

Leída Reanudación 1 del handoff. Estado verificado: misma ruta y branch, HEAD 0fb1718c (commit de reanudación del leader sobre d7455e94); solo los dos untracked esperados: empty-state.tsx y este impl. El commit del leader solo toca progress/handoff_mobile-empty-states-pingo.md. H0 permanece d4e044b3 para todos los diffs.

Diagnóstico del leader: expo lint conservaba en cache el error import/no-unresolved de T3 rojo porque el contenido del test no cambió. El leader borró esa cache ignorada y verificó lint exit=0; el implementador no la borra. Se repite T3 verde completo, medidas y cadena originales. Si reaparece un error sobre un fichero sin cambiar, se para y se mide bunx eslint --no-cache sobre ese fichero. Desde aquí, Received de más de 20 líneas se recorta a las 20 primeras, preservando matcher y Expected. Se continúa T4-T11 y Cierre sin alterar el alcance.

## T3 R3 — verde

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g3.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       36 passed, 36 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g3-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff, R3 verde, exit=0:
```text
+ grep -qE '^Tests: +36 passed, 36 total$' /tmp/155-g3.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g3-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/components/empty-state.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/components/empty-state.tsx = mobile-pet-tracker/src/components/empty-state.tsx
+ git commit -m 'feat(mobile-empty-states): #155 R3 componente EmptyState'
[feature/155-mobile-empty-states-pingo 22c8d591] feat(mobile-empty-states): #155 R3 componente EmptyState
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 46 insertions(+)
 create mode 100644 mobile-pet-tracker/src/components/empty-state.tsx
```

Commit T3 R3 verde: 22c8d591 feat(mobile-empty-states): #155 R3 componente EmptyState. Typecheck y lint: exit=0.

## T4 R4 — rojo

```bash
FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/155-r4-home.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 217 passed, 220 total
```

```text
R6: home carga pets y selecciona › shows the empty state when the account has no pets
    Unable to find an element with testID: home-empty-title
      525 |     await renderHome();
      526 |
    > 527 |     await waitFor(() =>
      528 |       expect(screen.getByTestId('home-empty-title')).toHaveTextContent(
      529 |         'Aún no tienes mascotas',
      530 |       ),
      at Object.<anonymous> (src/screens/home/index.test.tsx:527:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Inicio sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo
    Unable to find an element with testID: home-empty-pose
      5241 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      5242 |     await renderHome();
    > 5243 |     const pose = await screen.findByTestId('home-empty-pose');
      5244 |     expect(pose.props.source).toEqual([
      5245 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
      5246 |     ]);
      at Object.findByTestId (src/screens/home/index.test.tsx:5243:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Inicio sin mascotas presenta a Pingo › lleva a añadir mascota
    Unable to find an element with testID: home-empty-action
      5253 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      5254 |     await renderHome();
    > 5255 |     const action = await screen.findByTestId('home-empty-action');
      5256 |     await fireEvent.press(action);
      5257 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
      5258 |     expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
      at Object.findByTestId (src/screens/home/index.test.tsx:5255:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/screens/health/index.test.tsx > /tmp/155-r4-health.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 63 passed, 66 total
```

```text
R4: health resuelve la mascota seleccionada › shows the empty state when the account has no pets
    Unable to find an element with testID: health-empty-title
      268 |     await renderHealth();
      269 |
    > 270 |     await waitFor(() =>
      271 |       expect(screen.getByTestId('health-empty-title')).toHaveTextContent(
      272 |         'Aún no tienes mascotas',
      273 |       ),
      at Object.<anonymous> (src/screens/health/index.test.tsx:270:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Salud sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo
    Unable to find an element with testID: health-empty-pose
      1042 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1043 |     await renderHealth();
    > 1044 |     const pose = await screen.findByTestId('health-empty-pose');
      1045 |     expect(pose.props.source).toEqual([
      1046 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
      1047 |     ]);
      at Object.findByTestId (src/screens/health/index.test.tsx:1044:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Salud sin mascotas presenta a Pingo › lleva a añadir mascota
    Unable to find an element with testID: health-empty-action
      1054 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1055 |     await renderHealth();
    > 1056 |     const action = await screen.findByTestId('health-empty-action');
      1057 |     await fireEvent.press(action);
      1058 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
      1059 |     expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
      at Object.findByTestId (src/screens/health/index.test.tsx:1056:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-r4-food.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 56 passed, 59 total
```

```text
R4: food resuelve la mascota seleccionada › shows the empty state when the account has no pets
    Unable to find an element with testID: food-empty-title
      290 |     await renderFood();
      291 |
    > 292 |     await waitFor(() =>
      293 |       expect(screen.getByTestId('food-empty-title')).toHaveTextContent(
      294 |         'Aún no tienes mascotas',
      295 |       ),
      at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:292:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Comida sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo
    Unable to find an element with testID: food-empty-pose
      1267 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1268 |     await renderFood();
    > 1269 |     const pose = await screen.findByTestId('food-empty-pose');
      1270 |     expect(pose.props.source).toEqual([
      1271 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
      1272 |     ]);
      at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:1269:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Comida sin mascotas presenta a Pingo › lleva a añadir mascota
    Unable to find an element with testID: food-empty-action
      1279 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1280 |     await renderFood();
    > 1281 |     const action = await screen.findByTestId('food-empty-action');
      1282 |     await fireEvent.press(action);
      1283 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
      1284 |     expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
      at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:1281:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/155-r4-map.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 93 passed, 96 total
```

```text
R4: map resuelve la mascota seleccionada › shows the no-pets state without mounting a map
    Unable to find an element with testID: map-no-pets-title
      339 |     await renderMap();
      340 |
    > 341 |     await waitFor(() => {
      342 |       expect(screen.getByTestId('map-no-pets-title')).toHaveTextContent(
      343 |         'Aún no tienes mascotas',
      344 |       );
      at Object.<anonymous> (src/screens/map/index.test.tsx:341:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Mapa sin mascotas presenta a Pingo › pinta la pose, el título y la frase de Pingo
    Unable to find an element with testID: map-no-pets-pose
      1948 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1949 |     await renderMap();
    > 1950 |     const pose = await screen.findByTestId('map-no-pets-pose');
      1951 |     expect(pose.props.source).toEqual([
      1952 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
      1953 |     ]);
      at Object.findByTestId (src/screens/map/index.test.tsx:1950:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R4: Mapa sin mascotas presenta a Pingo › lleva a añadir mascota
    Unable to find an element with testID: map-no-pets-action
      1960 |     mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
      1961 |     await renderMap();
    > 1962 |     const action = await screen.findByTestId('map-no-pets-action');
      1963 |     await fireEvent.press(action);
      1964 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
      1965 |     expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
      at Object.findByTestId (src/screens/map/index.test.tsx:1962:33)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r4-ui.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       5 failed, 25 passed, 30 total
```

```text
#65 R3: Home resuelve su copy por clave › #71 R11: registra el copy de accesos rápidos sobre los deltas heredados
    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/home/index.tsx",
        "key": "common.noPetsBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:90:5)

```

```text
#65 R4: Map resuelve su copy por clave › resuelve las 17 ocurrencias normativas
    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/map/index.tsx",
        "key": "common.noPetsBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:131:5)

```

```text
#65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas
    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/health/index.tsx",
        "key": "common.noPetsBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:138:5)

```

```text
#65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas
    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/app/(tabs)/food.tsx",
        "key": "common.noPetsBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:145:5)

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/home/index.tsx",
        "key": "common.noPetsBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena literal del handoff, R4 rojo, exit=0:
```text
+ grep -qE '^Tests: +3 failed, 217 passed, 220 total$' /tmp/155-r4-home.txt
+ grep -qE '^Tests: +3 failed, 63 passed, 66 total$' /tmp/155-r4-health.txt
+ grep -qE '^Tests: +3 failed, 56 passed, 59 total$' /tmp/155-r4-food.txt
+ grep -qE '^Tests: +3 failed, 93 passed, 96 total$' /tmp/155-r4-map.txt
+ grep -qE '^Tests: +5 failed, 25 passed, 30 total$' /tmp/155-r4-ui.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r4-home.txt /tmp/155-r4-health.txt /tmp/155-r4-food.txt /tmp/155-r4-map.txt /tmp/155-r4-ui.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/health/index.test.tsx src/screens/home/index.test.tsx src/screens/map/index.test.tsx
++ git diff --cached --name-only
++ tr '\n' ' '
++ LC_ALL=C
++ sort
+ test 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx ' = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R4 red sin mascotas'
[feature/155-mobile-empty-states-pingo 0c236ef4] test(mobile-empty-states): #155 R4 red sin mascotas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 6 files changed, 140 insertions(+), 8 deletions(-)
```

Commit T4 R4 rojo: 0c236ef4 test(mobile-empty-states): #155 R4 red sin mascotas. Typecheck y lint: exit=0.

## T4 R4 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx > /tmp/155-g4.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 3 passed, 4 total
Tests:       1 failed, 440 passed, 441 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g4-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff, R4 verde, exit=1:
```text
+ grep -qE '^Test Suites: +4 passed, 4 total$' /tmp/155-g4.txt
```

PARADA: la cadena anterior no llegó al commit; último eslabón en su traza.

Fallo de T4 verde (Received recortado):
```text
#70 R1: la Home dibuja la sección de recordatorios › #70 R10: enlace a la lista de recordatorios › lleva a la lista de recordatorios existente

    expect(received).not.toMatch(expected)

    Expected pattern: not /import\s*\{[^}]*\bHref\b[^}]*\}\s*from/
    Received string:      "import { useQuery } from '@tanstack/react-query';
    import { router, type Href, useFocusEffect } from 'expo-router';
    import { Button, Card as HeroUICard, Skeleton } from 'heroui-native';
    import { useCallback, useEffect, useState } from 'react';
    import { Pressable, ScrollView, Text, View } from 'react-native';
    import Animated, {
      Easing,
      ReduceMotion,
      useAnimatedStyle,
      useReducedMotion,
      useSharedValue,
      withTiming,
    } from 'react-native-reanimated';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import {
      Bacteria,
      Battery,
      Bell,
      Bone,
      CalendarPlus,
[Received recortado a 20 líneas — Reanudación 1]
```

## Parada obligatoria — T4 verde

La primera comprobación de la cadena falló: `grep -qE '^Test Suites: +4 passed, 4 total$' /tmp/155-g4.txt` devuelve exit=1, porque Jest dio exit=1, Test Suites: 1 failed, 3 passed, 4 total; Tests: 1 failed, 440 passed, 441 total. GUARDAS pasó con 174 tests, exit=0. La cadena no llegó a typecheck, lint, git add ni commit.

El fallo es un candado existente de Inicio, en index.test.tsx:3963: `expect(source).not.toMatch(/import\s*\{[^}]*\bHref\b[^}]*\}\s*from/)`. R4 prescribe importar type Href para el CTA de sin mascotas; ese import hace caer el veto global heredado de la navegación a recordatorios. No se ha cambiado este candado ni usado otra forma de import como workaround. Se para por la regla expresa del handoff; el leader debe resolver el conflicto y autorizar la reanudación.

R1-R3 completos; T4 rojo commiteado en 0c236ef4, implementación T4 pendiente de commit. Se han realizado 7 de los 21 commits previstos. Solo quedan modificados los cuatro ficheros de producción de T4 y este impl sin seguimiento. T5-T11, sondas y cierre pendientes; trazabilidad sin tocar.

R12: pendiente del smoke humano

## Reanudacion 2 — parada en la precondición E1

Leída completa la sección Reanudación 2 del handoff y la Enmienda E1 de requirements.md. Misma ruta y branch. HEAD: 059ed18d. El estado coincide con los cuatro ficheros de producción de T4 modificados y este impl sin seguimiento. `git diff --name-only 0c236ef4 HEAD` solo lista progress/handoff_mobile-empty-states-pingo.md, specs/mobile-empty-states-pingo/requirements.md y specs/mobile-empty-states-pingo/tasks.md (commits del leader).

Precondición ejecutada desde la raíz:
```bash
grep -cF -- '- [x] Enmienda E1 aprobada' specs/mobile-empty-states-pingo/requirements.md
```
```text
0
```

PARADA: Reanudación 2, paso 0, ordena «Si da 0, PARA: la enmienda aun no esta aprobada». Falta la firma humana de E1. No se ha aplicado el arreglo, cambiado tests ni repetido la cadena. Los siete commits de implementación previos y los cuatro cambios pendientes permanecen como estaban.

R12: pendiente del smoke humano

## Reanudacion 2 — E1 firmada y continuación

HEAD 515cc263, misma ruta y branch; estado exacto esperado. Diff desde 0c236ef4 HEAD limitado a los tres ficheros de specs/progress del leader. Verificada firma humana: `grep -cF -- '- [x] Enmienda E1 aprobada' specs/mobile-empty-states-pingo/requirements.md` imprime 1. Leída E1 completa. Aplicado router.push('/pets/add') en las cuatro pantallas y retirado solo el type Href añadido en home, health y map. Food conserva su import original. Ningún test tocado. H0 sigue d4e044b3. Se repite T4 verde completa antes de T5.

Ancla E1.4:
```bash
for f in src/screens/home/index.tsx src/screens/health/index.tsx 'src/app/(tabs)/food.tsx' src/screens/map/index.tsx; do grep -cF "router.push('/pets/add')" "$f"; done
```
```text
1
1
1
1
```

Ancla E1.4:
```bash
for f in src/screens/home/index.tsx src/screens/health/index.tsx 'src/app/(tabs)/food.tsx' src/screens/map/index.tsx; do grep -cF "'/pets/add' as Href" "$f"; done
```
```text
0
0
0
0
```

Ancla E1.4:
```bash
grep -chE "import \{[^}]*\bHref\b" src/screens/home/index.tsx src/screens/health/index.tsx src/screens/map/index.tsx
```
```text
0
0
0
```

## T4 R4 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx > /tmp/155-g4.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       441 passed, 441 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g4-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R4 verde, exit=0:
```text
+ grep -qE '^Test Suites: +4 passed, 4 total$' /tmp/155-g4.txt
+ grep -qE '^Tests: +441 passed, 441 total$' /tmp/155-g4.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g4-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add 'src/app/(tabs)/food.tsx' src/screens/health/index.tsx src/screens/home/index.tsx src/screens/map/index.tsx
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/app/(tabs)/food.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/map/index.tsx ' = 'mobile-pet-tracker/src/app/(tabs)/food.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/map/index.tsx '
+ git commit -m 'feat(mobile-empty-states): #155 R4 sin mascotas'
[feature/155-mobile-empty-states-pingo b33be109] feat(mobile-empty-states): #155 R4 sin mascotas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 4 files changed, 45 insertions(+), 13 deletions(-)
```

Commit T4 R4 verde: b33be109 feat(mobile-empty-states): #155 R4 sin mascotas. Typecheck y lint: exit=0. Router.d.ts ausente.

## T5 R5 — rojo

```bash
FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/155-r5.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 35 passed, 38 total
```

```text
#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas › pinta el estado vacío

    Unable to find an element with testID: alerts-empty-title
      244 |     await renderAlerts();
      245 |
    > 246 |     await waitFor(() =>
      247 |       expect(screen.getByTestId('alerts-empty-title')).toHaveTextContent(
      248 |         'No hay alertas',
      249 |       ),
      at Object.<anonymous> (src/screens/alerts/index.test.tsx:246:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R5: sin alertas, Pingo duerme › pinta la pose, el título y la frase de Pingo

    Unable to find an element with testID: alerts-empty-pose
      1154 |     mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
      1155 |     await renderAlerts();
    > 1156 |     const pose = await screen.findByTestId('alerts-empty-pose');
      1157 |     expect(pose.props.source).toEqual([
      1158 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-sleep\.webp$/) }),
      1159 |     ]);
      at Object.findByTestId (src/screens/alerts/index.test.tsx:1156:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R5: sin alertas, Pingo duerme › no ofrece acción

    Unable to find an element with testID: alerts-empty-title
      1165 |     mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
      1166 |     await renderAlerts();
    > 1167 |     await screen.findByTestId('alerts-empty-title');
      1168 |     expect(screen.queryByTestId('alerts-empty-action')).toBeNull();
      1169 |   });
      1170 | });
      at Object.findByTestId (src/screens/alerts/index.test.tsx:1167:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r5-ui.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
#78 R12: el centro de alertas resuelve su copy por clave › registra cada ocurrencia de la pantalla

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/alerts/index.tsx",
        "key": "alerts.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:211:5)

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/alerts/index.tsx",
        "key": "alerts.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena literal del handoff R5 rojo, exit=0:
```text
+ grep -qE '^Tests: +3 failed, 35 passed, 38 total$' /tmp/155-r5.txt
+ grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r5-ui.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r5.txt /tmp/155-r5-ui.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/__tests__/ui-copy-table.ts src/screens/alerts/index.test.tsx
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R5 red alertas'
[feature/155-mobile-empty-states-pingo 1226da46] test(mobile-empty-states): #155 R5 red alertas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 37 insertions(+), 4 deletions(-)
```

Commit T5 R5 rojo: 1226da46 test(mobile-empty-states): #155 R5 red alertas. Typecheck y lint: exit=0. Router.d.ts ausente.

## T5 R5 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/155-g5.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       38 passed, 38 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g5-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R5 verde, exit=0:
```text
+ grep -qE '^Tests: +38 passed, 38 total$' /tmp/155-g5.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g5-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/screens/alerts/index.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/screens/alerts/index.tsx = mobile-pet-tracker/src/screens/alerts/index.tsx
+ git commit -m 'feat(mobile-empty-states): #155 R5 alertas'
[feature/155-mobile-empty-states-pingo 59eb7eca] feat(mobile-empty-states): #155 R5 alertas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 7 insertions(+), 3 deletions(-)
```

Commit T5 R5 verde: 59eb7eca feat(mobile-empty-states): #155 R5 alertas. Typecheck y lint: exit=0. Router.d.ts ausente.

## T6 R6 — rojo

```bash
FORCE_COLOR=0 bunx jest src/screens/reminders/index.test.tsx > /tmp/155-r6.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 30 passed, 33 total
```

```text
R5: reminders monta con métricas y estados › shows the empty state

    Unable to find an element with testID: reminders-empty-title
      267 |     await renderReminders();
      268 |
    > 269 |     await waitFor(() =>
      270 |       expect(screen.getByTestId('reminders-empty-title')).toHaveTextContent(
      271 |         'Aún no hay recordatorios',
      272 |       ),
      at Object.<anonymous> (src/screens/reminders/index.test.tsx:269:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R6: sin recordatorios, Pingo sostiene su lista › pinta la pose, el título y la frase de Pingo

    Unable to find an element with testID: reminders-empty-pose
      1013 |     mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
      1014 |     await renderReminders();
    > 1015 |     const pose = await screen.findByTestId('reminders-empty-pose');
      1016 |     expect(pose.props.source).toEqual([
      1017 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-clipboard\.webp$/) }),
      1018 |     ]);
      at Object.findByTestId (src/screens/reminders/index.test.tsx:1015:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R6: sin recordatorios, Pingo sostiene su lista › no duplica la acción de crear

    Unable to find an element with testID: reminders-empty-title
      1024 |     mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
      1025 |     await renderReminders();
    > 1026 |     await screen.findByTestId('reminders-empty-title');
      1027 |     expect(screen.queryByTestId('reminders-empty-action')).toBeNull();
      1028 |     expect(screen.getByTestId('reminders-add-link')).toBeVisible();
      1029 |   });
      at Object.findByTestId (src/screens/reminders/index.test.tsx:1026:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r6-ui.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
#65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reminders/index.tsx",
        "key": "reminders.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:178:5)

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/reminders/index.tsx",
        "key": "reminders.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena literal del handoff R6 rojo, exit=0:
```text
+ grep -qE '^Tests: +3 failed, 30 passed, 33 total$' /tmp/155-r6.txt
+ grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r6-ui.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r6.txt /tmp/155-r6-ui.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/reminders/index.test.tsx
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/reminders/index.test.tsx ' = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/reminders/index.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R6 red recordatorios'
[feature/155-mobile-empty-states-pingo 13e323e2] test(mobile-empty-states): #155 R6 red recordatorios
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 36 insertions(+), 2 deletions(-)
```

Commit T6 R6 rojo: 13e323e2 test(mobile-empty-states): #155 R6 red recordatorios. Typecheck y lint: exit=0. Router.d.ts ausente.

## T6 R6 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/reminders/index.test.tsx > /tmp/155-g6.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g6-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R6 verde, exit=0:
```text
+ grep -qE '^Tests: +33 passed, 33 total$' /tmp/155-g6.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g6-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/screens/reminders/index.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/screens/reminders/index.tsx = mobile-pet-tracker/src/screens/reminders/index.tsx
+ git commit -m 'feat(mobile-empty-states): #155 R6 recordatorios'
[feature/155-mobile-empty-states-pingo 344a7fcb] feat(mobile-empty-states): #155 R6 recordatorios
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 7 insertions(+), 3 deletions(-)
```

Commit T6 R6 verde: 344a7fcb feat(mobile-empty-states): #155 R6 recordatorios. Typecheck y lint: exit=0. Router.d.ts ausente.

## T7 R7 — rojo

```bash
FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx > /tmp/155-r7.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 13 passed, 15 total
```

```text
#155 R7: sin documentos, Pingo los guarda › pinta la pose, el título y la frase de Pingo

    Unable to find an element with testID: docs-empty-pose
      320 |     mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
      321 |     await renderDocs();
    > 322 |     const pose = await screen.findByTestId('docs-empty-pose');
      323 |     expect(pose.props.source).toEqual([
      324 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-health\.webp$/) }),
      325 |     ]);
      at Object.findByTestId (src/screens/docs/index.test.tsx:322:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R7: sin documentos, Pingo los guarda › no ofrece acción

    Unable to find an element with testID: docs-empty-title
      332 |     mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
      333 |     await renderDocs();
    > 334 |     await screen.findByTestId('docs-empty-title');
      335 |     expect(screen.queryByTestId('docs-empty-action')).toBeNull();
      336 |   });
      337 | });
      at Object.findByTestId (src/screens/docs/index.test.tsx:334:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Cadena literal del handoff R7 rojo, exit=0:
```text
+ grep -qE '^Tests: +2 failed, 13 passed, 15 total$' /tmp/155-r7.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r7.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/screens/docs/index.test.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/screens/docs/index.test.tsx = mobile-pet-tracker/src/screens/docs/index.test.tsx
+ git commit -m 'test(mobile-empty-states): #155 R7 red documentos'
[feature/155-mobile-empty-states-pingo 5fdbff46] test(mobile-empty-states): #155 R7 red documentos
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 33 insertions(+)
```

Commit T7 R7 rojo: 5fdbff46 test(mobile-empty-states): #155 R7 red documentos. Typecheck y lint: exit=0. Router.d.ts ausente.

## T7 R7 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx > /tmp/155-g7.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g7-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R7 verde, exit=0:
```text
+ grep -qE '^Tests: +15 passed, 15 total$' /tmp/155-g7.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g7-guardas.txt
++ grep -cF '<Card testID="docs-empty"' src/screens/docs/index.tsx
+ test 0 = 0
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/screens/docs/index.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/screens/docs/index.tsx = mobile-pet-tracker/src/screens/docs/index.tsx
+ git commit -m 'feat(mobile-empty-states): #155 R7 documentos'
[feature/155-mobile-empty-states-pingo 6e61e1c2] feat(mobile-empty-states): #155 R7 documentos
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 7 insertions(+), 8 deletions(-)
```

Commit T7 R7 verde: 6e61e1c2 feat(mobile-empty-states): #155 R7 documentos. Typecheck y lint: exit=0. Router.d.ts ausente.

## T8 R8 — rojo

```bash
FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/155-r8.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 48 passed, 50 total
```

```text
#155 R8: sin zonas seguras, Pingo enseña el collar › pinta la pose, el título y la frase de Pingo, sin tarjeta

    expect(received).toBe(expected) // Object.is equality

    Expected: "items-center gap-3 py-8"
    Received: "rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8"

      527 |     await mount();
      528 |     const empty = await screen.findByTestId('geofences-empty');
    > 529 |     expect(empty.props.className).toBe('items-center gap-3 py-8');
          |                                   ^
      530 |     const pose = await screen.findByTestId('geofences-empty-pose');
      531 |     expect(pose.props.source).toEqual([
      532 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) }),

      at Object.toBe (src/screens/geofences/index.test.tsx:529:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

```text
#155 R8: sin zonas seguras, Pingo enseña el collar › no ofrece acción

    Unable to find an element with testID: geofences-empty-title
      541 |     mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
      542 |     await mount();
    > 543 |     await screen.findByTestId('geofences-empty-title');
      544 |     expect(screen.queryByTestId('geofences-empty-action')).toBeNull();
      545 |   });
      546 | });
      at Object.findByTestId (src/screens/geofences/index.test.tsx:543:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r8-ui.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
#41 R10: las zonas seguras resuelven su copy por clave › registra cada ocurrencia de la pantalla y de su cabecera

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/geofences/index.tsx",
        "key": "geofences.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:264:5)

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/geofences/index.tsx",
        "key": "geofences.emptyBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena literal del handoff R8 rojo, exit=0:
```text
+ grep -qE '^Tests: +2 failed, 48 passed, 50 total$' /tmp/155-r8.txt
+ grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r8-ui.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r8.txt /tmp/155-r8-ui.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/geofences/index.test.tsx
++ LC_ALL=C
++ sort
++ git diff --cached --name-only
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/geofences/index.test.tsx ' = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/geofences/index.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R8 red zonas seguras'
[feature/155-mobile-empty-states-pingo dae5d2d6] test(mobile-empty-states): #155 R8 red zonas seguras
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 27 insertions(+), 9 deletions(-)
```

Commit T8 R8 rojo: dae5d2d6 test(mobile-empty-states): #155 R8 red zonas seguras. Typecheck y lint: exit=0. Router.d.ts ausente.

## T8 R8 — verde

```bash
FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/155-g8.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g8-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R8 verde, exit=0:
```text
+ grep -qE '^Tests: +50 passed, 50 total$' /tmp/155-g8.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g8-guardas.txt
++ grep -cF '<Card testID="geofences-empty"' src/screens/geofences/index.tsx
+ test 0 = 0
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/screens/geofences/index.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/screens/geofences/index.tsx = mobile-pet-tracker/src/screens/geofences/index.tsx
+ git commit -m 'feat(mobile-empty-states): #155 R8 zonas seguras'
[feature/155-mobile-empty-states-pingo 63e531a9] feat(mobile-empty-states): #155 R8 zonas seguras
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 7 insertions(+), 3 deletions(-)
```

Commit T8 R8 verde: 63e531a9 feat(mobile-empty-states): #155 R8 zonas seguras. Typecheck y lint: exit=0. Router.d.ts ausente.

## T9 R9 — rojo

```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-r9.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 58 passed, 61 total
```

```text
R5: plan del día con horarios y warnings › shows a graceful empty plan and keeps the schedule link

    Unable to find an element with testID: food-plan-empty-title
      457 |     await renderFood();
      458 |
    > 459 |     await waitFor(() =>
      460 |       expect(screen.getByTestId('food-plan-empty-title')).toHaveTextContent(
      461 |         'Aún no hay plan de alimentación',
      462 |       ),
      at Object.<anonymous> (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:459:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R9: sin plan de comidas, Pingo enseña el cuenco › pinta la pose, el título y la frase de Pingo

    Unable to find an element with testID: food-plan-empty-pose
      1292 |     mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
      1293 |     await renderFood();
    > 1294 |     const pose = await screen.findByTestId('food-plan-empty-pose');
      1295 |     expect(pose.props.source).toEqual([
      1296 |       expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-food\.webp$/) }),
      1297 |     ]);
      at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:1294:31)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
#155 R9: sin plan de comidas, Pingo enseña el cuenco › no ofrece acción

    Unable to find an element with testID: food-plan-empty-title
      1303 |     mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
      1304 |     await renderFood();
    > 1305 |     await screen.findByTestId('food-plan-empty-title');
      1306 |     expect(screen.queryByTestId('food-plan-empty-action')).toBeNull();
      1307 |   });
      1308 | });
      at Object.findByTestId (/home/claude/sites/Pet-Tracker-wt-155/mobile-pet-tracker/src/app/(tabs)../../../../../__tests__/food.test.tsx:1305:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r9-ui.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
#65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/app/(tabs)/food.tsx",
        "key": "food.noMealPlanBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:145:5)

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/app/(tabs)/food.tsx",
        "key": "food.noMealPlanBody",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena literal del handoff R9 rojo, exit=0:
```text
+ grep -qE '^Tests: +3 failed, 58 passed, 61 total$' /tmp/155-r9.txt
+ grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r9-ui.txt
+ grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r9.txt /tmp/155-r9-ui.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts 'src/app/(tabs)/__tests__/food.test.tsx'
++ git diff --cached --name-only
++ LC_ALL=C
++ sort
++ tr '\n' ' '
+ test 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx ' = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx '
+ git commit -m 'test(mobile-empty-states): #155 R9 red plan de comidas'
[feature/155-mobile-empty-states-pingo 2a1e61ba] test(mobile-empty-states): #155 R9 red plan de comidas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 25 insertions(+), 2 deletions(-)
```

Commit T9 R9 rojo: 2a1e61ba test(mobile-empty-states): #155 R9 red plan de comidas. Typecheck y lint: exit=0. Router.d.ts ausente.

## T9 R9 — verde

```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-g9.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       61 passed, 61 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g9-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R9 verde, exit=0:
```text
+ grep -qE '^Tests: +61 passed, 61 total$' /tmp/155-g9.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g9-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add 'src/app/(tabs)/food.tsx'
++ git diff --cached --name-only
+ test 'mobile-pet-tracker/src/app/(tabs)/food.tsx' = 'mobile-pet-tracker/src/app/(tabs)/food.tsx'
+ git commit -m 'feat(mobile-empty-states): #155 R9 plan de comidas'
[feature/155-mobile-empty-states-pingo 8b6eb528] feat(mobile-empty-states): #155 R9 plan de comidas
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 6 insertions(+), 3 deletions(-)
```

Commit T9 R9 verde: 8b6eb528 feat(mobile-empty-states): #155 R9 plan de comidas. Typecheck y lint: exit=0. Router.d.ts ausente.

## T10 R10 — verde

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g10.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       57 passed, 57 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g10-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R10 verde, exit=0:
```text
+ grep -qE '^Tests: +57 passed, 57 total$' /tmp/155-g10.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g10-guardas.txt
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/components/__tests__/empty-state.test.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx = mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
+ git commit -m 'test(mobile-empty-states): #155 R10 candado de vacíos en texto'
[feature/155-mobile-empty-states-pingo 309570ba] test(mobile-empty-states): #155 R10 candado de vacíos en texto
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 60 insertions(+), 1 deletion(-)
```

Commit T10 R10 verde: 309570ba test(mobile-empty-states): #155 R10 candado de vacíos en texto. Typecheck y lint: exit=0. Router.d.ts ausente.

## Sonda S1 sobre HEAD 309570ba

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-s1.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 55 passed, 57 total
```

```text
#155 R10: los vacíos que no se ilustran siguen en texto › src/screens/profile/index.tsx abre <Text testID="profile-pets-empty"> una sola vez

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      155 |   ])('%s abre <%s testID="%s"> una sola vez', (path, tag, testID) => {
      156 |     const source = readFileSync(join(process.cwd(), path), 'utf8');
    > 157 |     expect(source.match(new RegExp('<' + tag + '\\s+testID="' + testID + '"', 'g')) ?? []).toHaveLength(1);
          |                                                                                            ^
      158 |   });
      159 |
      160 |   it.each([

      at toHaveLength (src/components/__tests__/empty-state.test.tsx:157:92)

```

```text
#155 R10: los vacíos que no se ilustran siguen en texto › ningún otro fichero usa EmptyState

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

    @@ -4,7 +4,8 @@
        "src/screens/docs/index.tsx",
        "src/screens/geofences/index.tsx",
        "src/screens/health/index.tsx",
        "src/screens/home/index.tsx",
        "src/screens/map/index.tsx",
    +   "src/screens/profile/index.tsx",
        "src/screens/reminders/index.tsx",
      ]

      177 |       .map((path) => path.slice(process.cwd().length + 1))
      178 |       .sort();
    > 179 |     expect(files).toEqual([
          |                   ^
      180 |       'src/app/(tabs)/food.tsx',
      181 |       'src/screens/alerts/index.tsx',
      182 |       'src/screens/docs/index.tsx',

      at Object.toEqual (src/components/__tests__/empty-state.test.tsx:179:19)

```

```bash
git checkout HEAD -- src/screens/profile/index.tsx
git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
```
```text
limpio=0
```

## Sonda S2 sobre HEAD 309570ba

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-s2.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 55 passed, 57 total
```

```text
#155 R10: los vacíos que no se ilustran siguen en texto › src/screens/alerts/index.tsx pinta 1 EmptyState

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      169 |   ] as const)('%s pinta %i EmptyState', (path, n) => {
      170 |     const source = readFileSync(join(process.cwd(), path), 'utf8');
    > 171 |     expect(source.match(/<EmptyState\b/g) ?? []).toHaveLength(n);
          |                                                  ^
      172 |   });
      173 |
      174 |   it('ningún otro fichero usa EmptyState', () => {

      at toHaveLength (src/components/__tests__/empty-state.test.tsx:171:50)

```

```text
#155 R10: los vacíos que no se ilustran siguen en texto › ningún otro fichero usa EmptyState

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

    @@ -1,8 +1,7 @@
      Array [
        "src/app/(tabs)/food.tsx",
    -   "src/screens/alerts/index.tsx",
        "src/screens/docs/index.tsx",
        "src/screens/geofences/index.tsx",
        "src/screens/health/index.tsx",
        "src/screens/home/index.tsx",
        "src/screens/map/index.tsx",

      177 |       .map((path) => path.slice(process.cwd().length + 1))
      178 |       .sort();
    > 179 |     expect(files).toEqual([
          |                   ^
      180 |       'src/app/(tabs)/food.tsx',
      181 |       'src/screens/alerts/index.tsx',
      182 |       'src/screens/docs/index.tsx',

      at Object.toEqual (src/components/__tests__/empty-state.test.tsx:179:19)

```

```bash
git checkout HEAD -- src/screens/alerts/index.tsx
git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
```
```text
limpio=0
```

## T11 R11 — verde

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g11.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

```bash
FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-g11-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena literal del handoff R11 verde, exit=0:
```text
+ grep -qE '^Tests: +59 passed, 59 total$' /tmp/155-g11.txt
+ grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g11-guardas.txt
++ git diff --stat d4e044b3 -- package.json bun.lock
+ test -z ''
+ test '!' -e .expo/types/router.d.ts
+ bun run typecheck
$ tsc --noEmit
+ bun run lint
$ expo lint
+ git add src/components/__tests__/empty-state.test.tsx
++ git diff --cached --name-only
+ test mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx = mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
+ git commit -m 'test(mobile-empty-states): #155 R11 candado sin movimiento'
[feature/155-mobile-empty-states-pingo 25f46e87] test(mobile-empty-states): #155 R11 candado sin movimiento
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 15 insertions(+)
```

Commit T11 R11 verde: 25f46e87 test(mobile-empty-states): #155 R11 candado sin movimiento. Typecheck y lint: exit=0. Router.d.ts ausente.

## Sonda S3 sobre HEAD 25f46e87

```bash
FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-s3.txt 2>&1; echo "exit=$?"
```
```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 57 passed, 59 total
```

```text
#155 R11: los vacíos no traen movimiento ni dependencias › EmptyState solo importa de react, react-native, expo-image y heroui-native

    expect(received).toContain(expected) // indexOf

    Expected value: "react-native-reanimated"
    Received array: ["react", "react-native", "expo-image", "heroui-native"]

      195 |     const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
      196 |     for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
    > 197 |       expect(['react', 'react-native', 'expo-image', 'heroui-native']).toContain(specifier);
          |                                                                        ^
      198 |     }
      199 |   });
      200 |

      at Object.toContain (src/components/__tests__/empty-state.test.tsx:197:72)

```

```text
#155 R11: los vacíos no traen movimiento ni dependencias › EmptyState no anima

    expect(received).not.toMatch(expected)

    Expected pattern: not /react-native-reanimated|entering=|MOTION_/
    Received string:      "import Animated from 'react-native-reanimated';
    import { Image } from 'expo-image';
    import { Button } from 'heroui-native';
    import { Text, View } from 'react-native';

    export type EmptyStatePose = 'talk' | 'sleep' | 'clipboard' | 'health' | 'collar' | 'food';

    const POSES = {
      talk: require('../../assets/images/pingo-talk.webp'),
      sleep: require('../../assets/images/pingo-sleep.webp'),
      clipboard: require('../../assets/images/pingo-clipboard.webp'),
      health: require('../../assets/images/pingo-health.webp'),
      collar: require('../../assets/images/pingo-collar.webp'),
      food: require('../../assets/images/pingo-food.webp'),
    };

    type EmptyStateProps = {
      testID: string;
      pose: EmptyStatePose;
      title: string;
[Received recortado a 20 líneas — Reanudación 1]
```

```bash
git checkout HEAD -- src/components/empty-state.tsx
git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
```
```text
limpio=0
```

## Cierre — alcance

```bash
git diff --name-only d4e044b3 HEAD -- mobile-pet-tracker/ | LC_ALL=C sort
```
```text
mobile-pet-tracker/assets/images/pingo-clipboard.webp
mobile-pet-tracker/assets/images/pingo-collar.webp
mobile-pet-tracker/assets/images/pingo-food.webp
mobile-pet-tracker/assets/images/pingo-health.webp
mobile-pet-tracker/assets/images/pingo-sleep.webp
mobile-pet-tracker/assets/images/pingo-talk.webp
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/components/empty-state.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/alerts/index.test.tsx
mobile-pet-tracker/src/screens/alerts/index.tsx
mobile-pet-tracker/src/screens/docs/index.test.tsx
mobile-pet-tracker/src/screens/docs/index.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
mobile-pet-tracker/src/screens/reminders/index.test.tsx
mobile-pet-tracker/src/screens/reminders/index.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

30 ficheros móviles exactos: OK.

`git diff --stat d4e044b3 -- backend-pet-tracker/ infra-pet-tracker/ docs/`: vacío, exit=0.
`git diff --stat d4e044b3 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/app.json mobile-pet-tracker/src/theme`: vacío, exit=0.

§2.21 comprobado byte a byte contra el bloque de requirements.md y único cambio frente a H0 en specs/mobile-ui-language/design.md: OK. E1 se aplica sin tocar los tests ni el import original de Comida. No hay decisiones nuevas de producto fuera de las opciones aprobadas A1-A9 y E1. Ponytail actualizado a v5.1.0 durante la continuación; las demás skills cargadas al arranque se mantienen.

## Cierre — 15 ficheros

```bash
FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx src/screens/alerts/index.test.tsx src/screens/reminders/index.test.tsx src/screens/docs/index.test.tsx src/screens/geofences/index.test.tsx src/screens/welcome/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/components/__tests__/empty-state.test.tsx > /tmp/155-final.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 15 passed, 15 total
Tests:       901 passed, 901 total
```

Reparto verificado por las medidas individuales y guardas: home 220; health 66; food 61; map 96; alerts 38; reminders 33; docs 15; geofences 50; welcome 65; language-provider 24; ui-language 30; consistency 55; design-drift 62; legibility 27; empty-state 59. Total: 901.

## Cierre — Jest completo

`pgrep -af '[i]nit\.sh'`: sin salida (exit=1, no hay procesos coincidentes). Tras comprobarlo se ejecutó solo Jest, sin otras tareas mientras corría.

```bash
FORCE_COLOR=0 bunx jest > /tmp/155-all.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 97 passed, 97 total
Tests:       2351 passed, 2351 total
```

Cierre:
```bash
bun run typecheck; echo "exit=$?"
```
```text
exit=0
$ tsc --noEmit
```

Cierre:
```bash
bun run lint; echo "exit=$?"
```
```text
exit=0
$ expo lint
```

## Anclas de cierre — A1-A29, H1-H16 y P1-P7

A1: ```bash
test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
```
```text
ok
```

A2: ```bash
test ! -e mobile-pet-tracker/src/components/empty-state.tsx && echo ok
```
```text
```

A3: ```bash
grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
```
```text
0
```

A4: ```bash
grep -cF "['pingo-wave-blink.webp', 'pingo-wave.webp']" mobile-pet-tracker/src/screens/welcome/index.test.tsx
```
```text
0
```

A5: ```bash
grep -cF '### §2.20 — Añadidos por #153 — Pingo en la bienvenida' specs/mobile-ui-language/design.md
```
```text
1
```

A6: ```bash
grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md
```
```text
1
```

A7: ```bash
grep -cF '13 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
0
```

A8: ```bash
grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A9: ```bash
grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A10: ```bash
grep -cF 'expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A11: ```bash
grep -cF 'expect(R4_MAP).toHaveLength(17);' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A12: ```bash
grep -cF 'expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1); // +1 #95 R4, -2 #95 R5, +1 #114 R4, -1 #114 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A13: ```bash
grep -cF 'expect(R14_GEOFENCES).toHaveLength(18);' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
0
```

A14: ```bash
grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'alerts.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

A15: ```bash
grep -cF "{ file: 'src/screens/reminders/index.tsx', key: 'reminders.noRemindersYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

A16: ```bash
grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

A17: ```bash
grep -cF "{ file: 'src/app/(tabs)/food.tsx', key: 'food.noMealPlanYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

A18: ```bash
grep -cE "\{ file: 'src/(screens/home/index|screens/health/index|app/\(tabs\)/food|screens/map/index)\.tsx', key: 'common\.noPetsYet' \}," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
4
```

A19: ```bash
grep -cE "^\s+['\"](common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet|docs\.emptyBody)['\"]:" mobile-pet-tracker/src/i18n/catalog.ts
```
```text
12
```

A20: ```bash
grep -rlE '<EmptyState\b' mobile-pet-tracker/src | wc -l
```
```text
9
```

A21: ```bash
for p in "home-empty:src/screens/home/index.test.tsx" "health-empty:src/screens/health/index.test.tsx" "food-empty:src/app/(tabs)/__tests__/food.test.tsx" "food-plan-empty:src/app/(tabs)/__tests__/food.test.tsx" "map-no-pets:src/screens/map/index.test.tsx" "alerts-empty:src/screens/alerts/index.test.tsx" "reminders-empty:src/screens/reminders/index.test.tsx"; do id=${p%%:*}; echo "$id $(grep -cF "getByTestId('$id')).toHaveTextContent(" "mobile-pet-tracker/${p#*:}")"; done
```
```text
home-empty 0
health-empty 0
food-empty 0
food-plan-empty 0
map-no-pets 0
alerts-empty 0
reminders-empty 0
```

A22: ```bash
grep -cF "expect(screen.getByTestId('alerts-empty').props.className).toBe(" mobile-pet-tracker/src/screens/alerts/index.test.tsx
```
```text
0
```

A23: ```bash
grep -cF "es['alerts.empty']," mobile-pet-tracker/src/screens/alerts/index.test.tsx
```
```text
0
```

A24: ```bash
grep -cF "it('pinta el vacío con su tarjeta y su copy'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
```
```text
0
```

A25: ```bash
grep -cF "getByTestId('docs-empty')" mobile-pet-tracker/src/screens/docs/index.test.tsx
```
```text
1
```

A26: ```bash
grep -cF "['home-empty', () => mockListPets.mockResolvedValue({ kind: 'ok', pets: [] }), []]," mobile-pet-tracker/src/screens/home/index.test.tsx
```
```text
1
```

A27: ```bash
grep -cF "import { router" mobile-pet-tracker/src/screens/map/index.test.tsx
```
```text
1
```

A28: ```bash
ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '
```
```text
pingo-clipboard.webp pingo-collar.webp pingo-food.webp pingo-health.webp pingo-sleep.webp pingo-talk.webp pingo-wave-blink.webp pingo-wave.webp ```

A29: ```bash
git diff --stat origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
```
```text
```

H1: ```bash
grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md
```
```text
1
```

H2: ```bash
grep -cF -- '- [x] Clasificación, poses (A1, A2, A9) y copy final (A7, A8) aprobados (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md
```
```text
1
```

H3: ```bash
grep -cF -- '- [ ] Smoke R12 superado en dev build de Android (fecha: ____)' specs/mobile-empty-states-pingo/requirements.md
```
```text
1
```

H4: ```bash
grep -cF "describe('#155" mobile-pet-tracker/src/screens/home/index.test.tsx
```
```text
1
```

H5: ```bash
grep -cF 'mockRouter' mobile-pet-tracker/src/screens/map/index.test.tsx
```
```text
3
```

H6: ```bash
grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':" mobile-pet-tracker/src/i18n/catalog.ts
```
```text
10
```

H7: ```bash
grep -cF "'docs.emptyBody': 'Medical documents will appear here.'," mobile-pet-tracker/src/i18n/catalog.ts
```
```text
0
```

H8: ```bash
grep -cF '### §2.21' specs/mobile-ui-language/design.md
```
```text
1
```

H9: ```bash
grep -cF '<Card testID="docs-empty"' mobile-pet-tracker/src/screens/docs/index.tsx
```
```text
0
```

H10: ```bash
grep -cF '<Card testID="geofences-empty"' mobile-pet-tracker/src/screens/geofences/index.tsx
```
```text
0
```

H11: ```bash
ls mobile-pet-tracker/assets/images | grep -c '^pingo-'
```
```text
8
```

H12: ```bash
grep -cF "it('shows a dedicated empty state'" mobile-pet-tracker/src/screens/docs/index.test.tsx
```
```text
1
```

H13: ```bash
grep -cF "it('shows the empty state'" mobile-pet-tracker/src/screens/reminders/index.test.tsx
```
```text
1
```

H14: ```bash
grep -cF "it('pinta el estado vacío'" mobile-pet-tracker/src/screens/alerts/index.test.tsx
```
```text
1
```

H15: ```bash
grep -rlF '#155' mobile-pet-tracker/src | wc -l
```
```text
13
```

H16: ```bash
grep -A1 -E "^\s+'(common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet)':" mobile-pet-tracker/src/i18n/catalog.ts | grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':"
```
```text
10
```

P1: ```bash
grep -rlE '<EmptyState\b' mobile-pet-tracker/src --include='*.tsx' --exclude='*.test.tsx' | wc -l
```
```text
8
```

P2: ```bash
grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

P3: ```bash
grep -cF '13 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
2
```

P4: ```bash
grep -cE "^\s+'docs\.emptyBody': (\"When your pet's medical documents arrive, I'll keep them here\.\"|'When your pet\\\\'s medical documents arrive, I\\\\'ll keep them here\.')," mobile-pet-tracker/src/i18n/catalog.ts
```
```text
1
```

P5: ```bash
grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md
```
```text
1
```

P6: ```bash
grep -cF 'export type EmptyStatePose' mobile-pet-tracker/src/components/empty-state.tsx
```
```text
1
```

P7: ```bash
grep -cE 'react-native-reanimated|entering=|MOTION_' mobile-pet-tracker/src/components/empty-state.tsx
```
```text
0
```

Anclas discrepantes: []

## Cierre — trazabilidad y commits

R1-R11 verificados. Traceability se rellena una única vez, en este cierre, exclusivamente en sus columnas Commit rojo y Commit verde. R12 queda pendiente en ambas. No se cambian estados, frontmatter ni casillas. Init, push y PR quedan al leader según el handoff.

Los 20 commits de tests/implementación, en el orden exigido:
```text
01. 9ced6cc5 test(mobile-empty-states): #155 R1 red copy de los vacíos
02. d6528bd0 feat(mobile-empty-states): #155 R1 copy de los vacíos
03. e3ddd2ab test(mobile-empty-states): #155 R2 red poses WebP
04. d7b6aa28 feat(mobile-empty-states): #155 R2 poses WebP
05. d7455e94 test(mobile-empty-states): #155 R3 red componente EmptyState
06. 22c8d591 feat(mobile-empty-states): #155 R3 componente EmptyState
07. 0c236ef4 test(mobile-empty-states): #155 R4 red sin mascotas
08. b33be109 feat(mobile-empty-states): #155 R4 sin mascotas
09. 1226da46 test(mobile-empty-states): #155 R5 red alertas
10. 59eb7eca feat(mobile-empty-states): #155 R5 alertas
11. 13e323e2 test(mobile-empty-states): #155 R6 red recordatorios
12. 344a7fcb feat(mobile-empty-states): #155 R6 recordatorios
13. 5fdbff46 test(mobile-empty-states): #155 R7 red documentos
14. 6e61e1c2 feat(mobile-empty-states): #155 R7 documentos
15. dae5d2d6 test(mobile-empty-states): #155 R8 red zonas seguras
16. 63e531a9 feat(mobile-empty-states): #155 R8 zonas seguras
17. 2a1e61ba test(mobile-empty-states): #155 R9 red plan de comidas
18. 8b6eb528 feat(mobile-empty-states): #155 R9 plan de comidas
19. 309570ba test(mobile-empty-states): #155 R10 candado de vacíos en texto
20. 25f46e87 test(mobile-empty-states): #155 R11 candado sin movimiento
```

21. `docs(mobile-empty-states-pingo): #155 traceability` — el commit que contiene este informe. Su hash se comunica al terminar y se recupera con `git log -1 --format='%h %s' -- progress/impl_mobile-empty-states-pingo.md`; no se introduce un hash autorreferente que cambiaría el propio commit.

Lista cerrada del árbol preparado para el commit final (33 ficheros; se repite el comando sobre HEAD inmediatamente después para verificar identidad):
```bash
git diff --name-only d4e044b3 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-empty-states-pingo.md' ':!specs/mobile-empty-states-pingo/requirements.md' ':!specs/mobile-empty-states-pingo/design.md' ':!specs/mobile-empty-states-pingo/tasks.md' ':!progress/review_mobile-empty-states-pingo.md'
```
```text
mobile-pet-tracker/assets/images/pingo-clipboard.webp
mobile-pet-tracker/assets/images/pingo-collar.webp
mobile-pet-tracker/assets/images/pingo-food.webp
mobile-pet-tracker/assets/images/pingo-health.webp
mobile-pet-tracker/assets/images/pingo-sleep.webp
mobile-pet-tracker/assets/images/pingo-talk.webp
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/components/empty-state.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/alerts/index.test.tsx
mobile-pet-tracker/src/screens/alerts/index.tsx
mobile-pet-tracker/src/screens/docs/index.test.tsx
mobile-pet-tracker/src/screens/docs/index.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
mobile-pet-tracker/src/screens/reminders/index.test.tsx
mobile-pet-tracker/src/screens/reminders/index.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
progress/impl_mobile-empty-states-pingo.md
specs/mobile-empty-states-pingo/traceability.md
specs/mobile-ui-language/design.md
```

## Smoke R12 — guion final para el humano

WHEN la implementación está verde, THE SYSTEM SHALL superar un smoke del
humano en la **dev build de Android** (nunca Expo Go), con la dev build ya
instalada y `bunx expo start --dev-client` desde `mobile-pet-tracker/`. Las
poses entran por `require` y viajan en el bundle de JS, así que no hace falta
reconstruir la parte nativa; si no aparecen, `bunx expo run:android`.

Pasos, en español y luego en inglés (Perfil → idioma):

1. Con una cuenta sin mascotas: Inicio, Salud, Comida y Mapa muestran a
   Pingo con la pose `talk`, el título, la frase de §Copy final y el botón
   «Añadir mascota» / «Add pet». Pulsar el botón en cada una abre el alta de
   mascota.
2. Con una mascota recién creada: Alertas (pose `sleep`), Recordatorios
   (`clipboard`, con el botón «Nuevo» / «New» encima), Documentos (`health`)
   y Comida sin plan (`food`, con las tarjetas de horario e historial debajo)
   muestran pose, título y frase, sin botón propio.
3. Con una mascota que tiene collar con suscripción activa y ninguna zona
   segura: Zonas seguras muestra la pose `collar`, el título y la frase, sin
   botón propio. Una mascota sin collar no sirve para este paso, porque
   `PetTrackingGuard` responde 402 y la pantalla pinta
   `geofences-no-tracking`, que queda fuera de alcance.
4. En modo oscuro, la pose no muestra recuadro ni halo: el fondo es
   transparente.
5. Con el texto del sistema al máximo, título y frase se parten en líneas sin
   cortarse y el botón sigue visible al hacer scroll donde la pantalla lo
   tenga.
6. Los vacíos en texto de §Clasificación (por ejemplo, vacunas en Salud o el
   registro de peso) siguen igual que antes.

Lo firma el humano en §Aprobación, casilla «Smoke R12».

R12: pendiente del smoke humano
