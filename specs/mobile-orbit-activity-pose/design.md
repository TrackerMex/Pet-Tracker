---
feature: "mobile-orbit-activity-pose"
status: approved     # draft | approved
tags: [mobile, ui, mascota, orbit, spec]
---

# Diseño — [[mobile-orbit-activity-pose]] (#225)

> Requisitos en [[requirements]]. Todo vive en `mobile-pet-tracker/` (capa de
> presentación). No hay cambios de backend, dominio ni infraestructura.
> Rige `docs/ui-guidelines.md`. La cadena de Codex no la modifica; la enmienda R9
> va en un commit propio del leader tras el gate G4 (ver [[requirements]] R9 y D3).

## 1. Ficheros afectados

**Assets**
- 9 `git mv` `assets/images/pingo-*.webp` a `assets/images/orbit-*.webp` (R2).
- Nuevo `assets/images/orbit-walk.webp` (R5).

**Producción** (los 18 ficheros que hoy nombran a Pingo, renombrado mecánico, R3)
- Hay 3 `git mv` de módulos, según el §Mapa de nombres.
- Se reapuntan sus importadores:
  - `components/empty-state.tsx`;
  - `screens/{home,food,join-pet,nutrition-questionnaire,pairing,register,welcome}/index.tsx`;
  - el resto de los que salgan con `git grep -il pingo`.
- `src/theme/motion.ts`: renombra los dos tokens `MOTION_PINGO_*`.
- `src/i18n/catalog.ts`:
  - renombra 7 claves en `en` y 7 en `es`;
  - añade `home.orbitWalkLabel` en los dos idiomas, justo detrás de `home.orbitPhraseCalm` (R1).
- `src/screens/home/orbit-phrase.ts`: añade `homeOrbitPose` (R6).
- `src/screens/home/index.tsx`: elige la pose y la etiqueta (R7).

**Tests**
- Nuevos:
  - `src/__tests__/orbit-rename.test.ts` (R2, R3, R4);
  - `src/__tests__/orbit-activity-pose.test.ts` (R1, R5, R8).
- Ampliados:
  - `src/screens/home/orbit-phrase.test.ts`, con un `describe` de R6;
  - `src/screens/home/index.test.tsx`, con un `describe` de R7.
- Renombrado mecánico: los 33 ficheros de test que hoy nombran a Pingo, más
  `orbit-rename-copy.test.ts` de #221. También se mueven con `git mv` los dos
  tests colocados.
- Enmiendas con sufijo: las de [[requirements]] §Candados enmendados.

**Docs de spec**
- `specs/mobile-ui-language/design.md`: sección nueva de #225, con 7 filas
  `renombrada desde` (R3) y 1 `añadida` (R1).
- `specs/mobile-home-pingo-phrase/requirements.md`: cierre de H3 (R8).
- `specs/mobile-orbit-activity-pose/design-src/`: el maestro y su prompt, ya
  copiados por el autor de la spec junto a `canvas/`.

**No se tocan en la cadena de Codex:** `package.json`, `bun.lock`, `app.json`,
`app.config.ts`, `docs/` y el código nativo. `docs/ui-guidelines.md` solo cambia
con R9, fuera de la cadena. El único snapshot del repo, `pet-avatar.test.tsx.snap`, no
nombra a Pingo.

## 2. Renombrado mecánico (R2, R3, R4)

Reemplazo con caja conservada: `pingo` pasa a `orbit`, `Pingo` a `Orbit` y
`PINGO` a `ORBIT`.

- **Producción**: en todo el contenido, comentarios incluidos.
- **Test**: en todo, salvo en estos sitios:
  - el literal de título de `describe`/`it`/`test` y sus variantes;
  - los comentarios;
  - las líneas de §4.

Los `jest.mock('../../components/pingo-float', …)` de `forgot`, `register` y
`reset-password` son rutas de módulo. Se renombran: si no, jest no encuentra el
módulo y la suite cae.

Orden obligatorio, porque R2 va antes que R3 (ver [[tasks]]):
1. En C2 solo se renombran assets y toda cadena que nombre un fichero `.webp`,
   en producción y en test, salvo las líneas de §4. Ejemplo: en caso A, la línea
   `welcome.pingoGreeting, pingo-wave.webp), …` de `orbit-charter-voice.test.ts`
   fija la carta y no se toca.
2. En C4 se renombra el resto: módulos, símbolos, claves, testIDs, locales y comentarios.

## 3. Regla de escaneo de R4

El `it` de R4 recorre todo el código de test (`.ts`/`.tsx` bajo `src/` que no sea
código de producción). Excluye `src/__tests__/orbit-rename.test.ts` y
`src/__tests__/orbit-activity-pose.test.ts`. Para cada línea:

1. Si `line.trim()` empieza por `//`, `/*` o `*`, la línea es comentario y se ignora.
   Esto también salta las líneas de una plantilla multilínea que empiezan por `*`
   o `**`, como `**Orbit** (antes Pingo).` en `orbit-charter-voice.test.ts`. Es la
   única línea así medida el 2026-10-28; igual lleva entrada explícita en §4.
2. Se quita el comentario final: todo lo que hay desde la primera aparición de
   ` // ` hasta el final.
3. Se quita el literal de título con
   ``/^(\s*(?:describe|it|test)(?:\.(?:each|only|skip))?(?:\([\s\S]*?\))?\()(['"`])(?:\\.|(?!\2).)*\2/``.
   Ojo: esta regex solo cubre títulos en la misma línea que la llamada. La
   simulación del 2026-10-28 no encontró títulos multilínea con Pingo.
4. Si lo que queda casa `/pingo/i`, la línea debe contener el `snippet` de una
   entrada de §4 para ese fichero. Si no lo contiene, el test la lista como infractora.

La regla mira línea a línea, así que una plantilla multilínea que fija texto de la
carta (`idleLoops` de `#167 R11`, `note` de `#221 R4`) cuenta como varias líneas
sueltas: cada una de sus líneas con Pingo necesita su propia entrada en §4. La
simulación del 2026-10-28 buscó todas las plantillas multilínea con Pingo del
código de test. Las únicas que fijan texto de documento son esas dos y ya tienen
sus entradas.

El resultado esperado es `[]` (array de `"<ruta>:<línea>: <texto>"`), para que el
rojo enseñe cada línea. El segundo `it` de R4 comprueba, para cada entrada de §4,
que el número de líneas del fichero que contienen el `snippet` y casan
`/pingo/i` es exactamente `lines`.

La cuenta de líneas que C4 renombra es informativa, no un candado: la da el
comando de [[requirements]] §Re-verificar al mergear #221 sobre la rama mergeada.
Medida el 2026-10-28, sin las líneas que cubre §4, da 296 en los dos casos:
- caso A: `wt-221` con #221 R4 sin commitear;
- caso B: `wt-221` `4a929323`.

## 4. Lista de excepciones de R4

Son pins de texto de documentos (carta, `design.md`, specs viejas) o regex que
buscan Pingo a propósito. Se quedan tal cual.

La lista tiene dos variantes según si #221 R4 (la enmienda de la carta, gate G4
de #221) ya está en la rama. El caso se decide con un ancla:

```bash
grep -cF "'**7. Voz de Orbit: guardián sereno.**'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

- Da `1`: **caso A**, #221 R4 aplicada. La lista son las filas `A y B` más las `A`.
- Da `0`: **caso B**, #221 R4 sin aplicar. La lista son las filas `A y B` más las `B`.
- Cualquier otra cifra: para y enmienda esta spec.

Codex escribe en `orbit-rename.test.ts` solo la variante del caso que midió
[[requirements]] §Re-verificar al mergear #221, y el handoff la nombra. El
comando de ese apartado lee esta tabla, así que la tabla es la fuente única de las
dos variantes.

| Caso | Fichero (bajo `src/`) | `snippet` | `lines` | Motivo |
|---|---|---|---|---|
| A y B | `__tests__/account-screens-polish.test.ts` | `'PingoFloat', 'MOTION_PINGO_FLOAT_OFFSET_Y', 'forgot-lock-tile',` | 1 | lista de la carta #172 |
| A y B | `__tests__/account-flow-canvas-fidelity.test.ts` | `'PingoFloat',` | 1 | lista de la carta #205 |
| A y B | `__tests__/add-pet-two-steps.test.ts` | `const radiusRule = 'Fuera de la escala, por fidelidad al canvas (#191)` | 1 | regla citada de la carta |
| A y B | `__tests__/home-pingo-phrase.test.ts` | `## Enmienda #190 — Burbuja de Pingo en Inicio` | 1 | carta #190 |
| A y B | ídem | ``por `mobile-home-pingo-phrase` (#190)`` | 1 | carta #190 |
| A y B | ídem | `**Pingo flota en la burbuja de Inicio.**` | 1 | carta #190 |
| A y B | ídem | `**La burbuja de Pingo.**` | 1 | carta #190 |
| A y B | `components/__tests__/celebration.test.tsx` | `— confeti, ping y flotación de la celebración` | 1 | carta #171 |
| A y B | `components/__tests__/empty-state.test.tsx` | `§2.21 — Añadidos por #155 — Pingo en los estados vacíos` | 1 | encabezado de `design.md` |
| A y B | ídem | `§2.23 — Añadidos por #159 — Pingo sin collar` | 2 | encabezado de `design.md` |
| A y B | ídem | `el tab Map muestra a Pingo con` | 1 | texto de spec citado |
| A y B | `providers/__tests__/language-provider.test.tsx` | `§2.24 — Añadidos por #167 — Pingo en las pantallas de cuenta` | 1 | encabezado de `design.md` |
| A y B | ídem | `= 'login.pingoGreeting';` | 1 | hoy `const key = …`; desde C4 `const designKey = …` (regex de la fila histórica de `design.md`) |
| A y B | `screens/welcome/index.test.tsx` | `§2.20 — Añadidos por #153 — Pingo en la bienvenida` | 1 | encabezado de `design.md` |
| A y B | ídem | ``.pingoGreeting`[^`` | 1 | regex de la fila histórica de `welcome.pingoGreeting` (#153) |
| A y B | `__tests__/orbit-rename-copy.test.ts` | `/\bPingo\b/` | 1 | #221 R2 busca Pingo a propósito |
| A y B | ídem | `/pingo/i.test(match[2])` | 1 | #221 R2 busca Pingo a propósito |
| B | `components/__tests__/celebration.test.tsx` | `suma a esta lista la flotación y el anillo de ping de` | 1 | `point7` de #171 R15: punto 7 de la carta |
| B | `screens/welcome/index.test.tsx` | `'**7. Voz de Pingo: guardián sereno.**'` | 1 | `voice` de #153 R2: punto 7 de la carta |
| B | ídem | `rodean a Pingo en la bienvenida son las únicas animaciones continuas de` | 1 | `idleLoops` de #167 R11: punto 7 de la carta |
| B | ídem | `Pingo, y una excepción declarada a §Animación: animan` | 1 | `idleLoops` de #167 R11: punto 7 de la carta |
| A | `__tests__/orbit-charter-voice.test.ts` | `block.split('**7. Voz de Pingo')` | 1 | #221 R4 exige cero encabezados viejos |
| A | ídem | `**Orbit** (antes Pingo).` | 1 | `opening` de #221 R4 (la regla ya la salta, ver §3) |
| A | ídem | `catálogo y los assets conservan el prefijo pingo (PingoFloat,` | 1 | `note` de #221 R4; **R9 la borra** |
| A | ídem | `welcome.pingoGreeting, pingo-wave.webp), y las enmiendas fechadas de esta carta` | 1 | `note` de #221 R4; **R9 la borra** |
| A | ídem | `conservan «Pingo»` | 1 | `note` de #221 R4; sobrevive a R9 |
| A | ídem | `/\bPingo\b/` | 1 | #221 R4 cuenta las «Pingo» de la nota |

Los dos `/\bPingo\b/` son los únicos snippets con barra invertida. En TypeScript se
escriben `String.raw`/\bPingo\b/``. Los demás van como cadena simple.

Recuentos medidos el 2026-10-28 con el comando de [[requirements]] §Re-verificar:
- caso A sobre el árbol de `wt-221` con #221 R4 sin commitear;
- caso B sobre `wt-221` `4a929323`.

Todas las entradas casan antes de C4 y siguen casando después, porque C2 y C4 no
tocan las líneas de esta tabla. Por eso el segundo `it` de R4 nace verde en C3.

**Cuando #221 R4 llega después que #225.** Si #225 se mergea en `dev` en caso B y
el leader aplica luego #221 R4, ese mismo commit cambia en la lista de
`orbit-rename.test.ts` las cuatro filas `B` por las seis `A`. Si no, el segundo
`it` de R4 cae (las filas `B` casan 0 líneas) y el primero lista las líneas de
`orbit-charter-voice.test.ts`. Mutación que lo prueba: aplicar #221 R4 sin tocar la lista.

## 5. Tests de R2 y R3

- Reutilizan el patrón de `sourceFiles()` de `orbit-rename-copy.test.ts`
  (`jest.requireActual('fs')`, `readdirSync` recursivo). Se copia como función
  local; ese fichero no exporta nada.
- Ningún rojo puede ser `ReferenceError` ni «Cannot find module» (CHECKPOINTS C4):
  - cada `jest.requireActual('<módulo nuevo>')` va precedido de
    `expect(existsSync(join(sourceRoot, '<ruta>'))).toBe(true)`;
  - cada `readFileSync` de un fichero que puede faltar, igual.
- R2: recoge los `require('…assets/images/….webp')` con
  `/require\('([^']*assets\/images\/[^']+\.webp)'\)/g` sobre código de producción y
  de test. Resuelve cada ruta con `path.resolve(dirname(fichero), ruta)` y aserta
  `existsSync`. Además lista `readdirSync('assets/images')` y aserta dos cosas: que
  `filter(/pingo/i)` da `[]` y que los 9 nombres `orbit-*` existen.
- R3, símbolos:
  - `orbit-float` exporta `OrbitFloat` de tipo función;
  - `orbit-stage` exporta los dos `ORBIT_STAGE_*` y ninguna clave casa `/pingo/i`;
  - `motion` exporta `MOTION_ORBIT_FLOAT_TIMING` y `MOTION_ORBIT_FLOAT_OFFSET_Y`,
    y `Object.keys(motion).filter(/PINGO/)` da `[]`;
  - `orbit-phrase` exporta `homeOrbitPhrase`;
  - `existsSync` de las tres rutas viejas es `false`.
- R3, catálogo: tabla de 7 filas `[vieja, nueva, en, es]` de [[requirements]]
  §Mapa de nombres. Para cada fila, `en[nueva]` y `es[nueva]` valen lo de la
  tabla, y `vieja in en` y `vieja in es` son `false`.
- R3, inventario:
  - en `ui-copy-table.ts`, `split("key: '<nueva>'")` da 1 por clave y `/pingo/i` no casa;
  - en `design.md`, la regex del encabezado
    `/^### §2\.\d+ — Añadidos por #225 — Orbit renombrado y su pose de actividad$/m`
    casa una vez y cada fila `renombrada desde` está presente.

## 6. Pose de Inicio (R6, R7)

- `homeOrbitPose` es una comparación contra las dos claves de actividad; no hace
  falta tabla ni config. Vive junto a `homeOrbitPhrase` porque decide sobre su salida.
- En `index.tsx` hay una constante de módulo con dos `require` estáticos. Metro
  exige literales: `ORBIT_POSE_SOURCE = { walk: require('…/orbit-walk.webp'), talk: require('…/orbit-talk.webp') }`.
- Dentro del bloque que ya pinta la burbuja: `const orbitPose = homeOrbitPose(orbitPhrase.labelKey)`.
- La `Image` `home-orbit` conserva `style={{ width: 56, height: 56 }}` y gana tres props:
  - `source={ORBIT_POSE_SOURCE[orbitPose]}`;
  - `accessible={orbitPose === 'walk'}`;
  - `accessibilityLabel={orbitPose === 'walk' ? t('home.orbitWalkLabel') : undefined}`.
- `t('home.orbitWalkLabel')` aparece una sola vez en el fichero, como pide
  `checkUses` del inventario.
- Fixtures de R7 (`index.test.tsx`; mismo patrón que #190 R6 y R9). Cada `it`
  aserta el texto antes que la pose, así que un fixture equivocado da rojo por el texto:
  - `Walk`: el fixture por defecto del `describe`, que da `Luna ya caminó 2.4 km hoy.`.
    Si no lo da, fija `mockGetDailyActivity.mockResolvedValue({ kind: 'ok', days: [makeDay()], weekComparison: { distanceM: null, activeMinutes: null, walkCount: null } })`.
  - `WalkMeals`: `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ mealsToday: { served: 1, total: 2 } }) })`.
  - `Meals`: lo de `WalkMeals` más `mockGetDailyActivity.mockResolvedValue({ kind: 'ok', days: [makeDay({ distanceM: 99 })], weekComparison: { distanceM: null, activeMinutes: null, walkCount: null } })`.
  - `Calm`: `mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' })`.

  > **Fe de erratas E2 del firmante (2026-10-28, parada del implementador en C9).**
  > Los fixtures `Walk` (el de respaldo) y `Meals` no traían `weekComparison`. El
  > tipo `{ kind: 'ok' }` de `getDailyActivity` lo exige, así que `tsc` daba TS2345.
  > Sin él, además, el gráfico semanal rompe en
  > `Cannot read properties of undefined (reading 'activeMinutes')`, y el `it` de
  > `Meals`, que [[tasks]] C9 da por nacido en verde, caía en rojo por
  > «Unable to find … home-orbit-text». El valor que se añade es el mismo que ya
  > usa `setupHomeMotion` en `index.test.tsx`. La regla de la pose no lee
  > `weekComparison`, así que ningún candado de R7 cambia.
- `renderHome()` no pisa los mocks fijados antes; así lo hace ya #190 R6. Cada `it`
  usa `await` en `renderHome` y en `findByTestId` (RNTL 14).

## 7. Conversión y verificación de la pose (R5)

Desde la raíz del worktree:

```bash
uvx --with pillow python -I -c "from PIL import Image; Image.open('specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png').save('mobile-pet-tracker/assets/images/orbit-walk.webp','WEBP',quality=80,method=6)"
node -e "const b=require('fs').readFileSync('mobile-pet-tracker/assets/images/orbit-walk.webp');console.log(b.length<=100000,b.toString('ascii',0,4),b.toString('ascii',8,16),(b[20]&0x10)!==0,(b[20]&0x02)===0,b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1)"
# esperado: true RIFF WEBPVP8X true true 1024 1024
```

Medido el 2026-10-28 en la VPS sobre una copia en el scratchpad: 65 182 B.
`uvx` descarga Pillow a su caché y no toca el proyecto.

## 8. Mutaciones a plantar (reviewer)

Cada una se planta sobre el verde final, se corre el test indicado y se revierte.

| # | Mutación | Debe ponerse rojo |
|---|---|---|
| M1 | Dejar sin renombrar un negativo vacuo: `queryByTestId('reset-orbit-float')` vuelve a `'reset-pingo-float'` en `screens/reset-password/index.test.tsx` | R4 «el código de test solo nombra a Pingo…» |
| M2 | Añadir `// pingo` como comentario en `src/components/orbit-float.tsx` | R3 «el código de producción no nombra a Pingo…» |
| M3 | Añadir a §4 una entrada que no case ninguna línea | R4 «cada excepción casa exactamente…» |
| M4 | `homeOrbitPose` con umbral en las comidas (`home.orbitPhraseMeals` da `'walk'`) | R6 `it.each` y R7 «vuelve a la pose base … comidas» |
| M5 | `homeOrbitPose` siempre devuelve `'walk'` | R6 «cualquier otra clave da talk», R7 «… frase de respaldo» y #190 R4 enmendado |
| M6 | En `index.tsx`, `className="h-14 w-14"` en lugar de `style` | R7 (`style` exacto y `className` indefinido) |
| M7 | Reescribir `orbit-walk.webp` sin alfa (`Image.open(...).convert('RGB').save(...)`) | R5 formato |
| M8 | Etiqueta en la rama talk (`accessibilityLabel` siempre) | R7 «vuelve a la pose base sin etiqueta…» |
| M9 | Volver a poner `(H3 pendiente: pose placeholder.)` en la spec de #190 | R8 |
| M10 | Borrar la fila `home.orbitWalkLabel` de `ui-copy-table.ts` | R1 y `#71 R11` enmendado |
| M11 | Tras R9, devolver en la carta `Desde la feature #225` a `Hasta la feature #225` | `#221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)` |
| M12 | Tras R9, dejar en la lista de R4 la fila `catálogo y los assets conservan el prefijo pingo (PingoFloat,` | R4 «cada excepción casa exactamente…» |

## 9. Alternativas descartadas

- **Pose como campo de `homeOrbitPhrase`**: obliga a enmendar las 14 filas de #190 R8 (D4).
- **Renombrar también títulos y comentarios de test**: rompe la trazabilidad de
  `traceability.md` de otras specs (D7).
- **Escaneo de R4 sin lista de excepciones**: obligaría a reescribir la carta y
  `design.md` históricos (enmiendas fechadas y secciones `§2.*`), y eso es G4, no
  delegado. R9 solo toca la nota del cuerpo (D3).
- **Elegir la pose con `className`**: inerte en `expo-image`; la imagen se pinta a 0 × 0.
