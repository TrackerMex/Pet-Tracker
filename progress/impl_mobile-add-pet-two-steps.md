# Implementación #191 — Nueva mascota en dos pasos

## Inicio y alcance

- Fecha: 2026-10-20.
- `pwd`: `/home/claude/sites/Pet-Tracker-wt-191`.
- Rama: `feature/191-mobile-add-pet-two-steps`.
- H0: `e917238f3a1f14fd66d6d4b80dab8f856a49408b`.
- Árbol inicial limpio. Feature #191 `in_progress`, única en curso; aprobación humana del 2026-10-19, D1–D5 confirmadas.
- Se sigue el handoff específico: no ejecutar `init.sh`, no tocar el bookkeeping del leader, no abrir ni editar PR, no rebase ni merge.
- Skills leídas: `ponytail:ponytail` (full), `building-native-ui` (plugin Expo, archivo instalado v1.0.1), `appllama-app-design-skill` (repo). No se carga `animate-expo`: no hay animación nueva. La carta delega al humano el smoke Android y al leader la investigación Appllama.
- Leídos requirements, design, tasks y traceability completos; arquitectura, convenciones y carta UI pertinentes, disciplina de verificación.

## Base H0

- Todas las anclas del handoff coinciden, incluida la alternativa B6: 5 líneas con `usePreventRemove` en el fichero del hook instalado.
- B1: 429 claves EN. B2: 36 secciones; última §2.36, nueva §2.37. B3: `42 + 1 - 2 + 4 + 3 - 3`. B4: tres claves ausentes. B8: función ausente. B9: `['pets/add', 't:addPet.addPet']`. B10: 35 `it(`, 6 `it.each`, 894 líneas.
- T0: 4163 tests; resultado y repeticiones individuales documentados debajo. Log `/tmp/191-t0.log`, comando `bun run test`, sin pipe.

## Desviaciones prescritas por el leader

1. R1 incorpora catálogo y retira la fila `avatarPreview`; cada fila nueva de copy se añade con el R que la usa para respetar `checkUses`.
2. R3, R4, R7, R8 y R10 tienen commits rojos separados y un único verde conjunto por el acoplamiento de pasos y tests existentes.
3. Los candados globales enumerados pueden estar rojos entre R5 y R11; se registran después de cada verde y se actualizan en R11.

## Ejecución

La medición H0 se completó antes del primer commit de código; se conservan los logs y los totales por fichero debajo.

## Aclaración humana durante la ejecución

El humano autoriza priorizar la spec: aceptar el rojo del test existente de longitud en R1 y adaptar los tests antiguos a la validación por pasos. Se conserva la intención de validación, payload, mensajes y persistencia; las aserciones que exigían ambos pasos montados simultáneamente pasan a observar cada paso.

### Solape detectado con origin/main

`origin/main` apunta a `f32b8d13` (merge de PR #236, feature #190). El catálogo tiene allí cuatro claves `home.pingoPhrase*` que no existen en H0. Se informa el solape sin mergear ni resolverlo: se conserva la base H0 y sus medidas (429 EN). `_layout.tsx` no presenta diferencias con origin/main al comprobarlo.

### Incidencias de H0 durante la corrida

La corrida completa muestra fallos previos a cualquier edición de código: timeouts de 5000 ms en `src/screens/home/index.test.tsx` (#152 R7), `src/screens/weight-log/index.test.tsx` (#169 R11 / #186 R7) y `src/screens/add-reminder/index.test.tsx` (#178 R12). En Inicio también falta `summary-weight` tras un timeout. Se conservará el log completo y se repetirá cada fichero afectado solo, sin subir timeouts ni cambiar tests, antes de juzgar los timeouts conforme al handoff.

### Resultado de la única medición T0

Comando `bun run test` en H0, salida 1, log íntegro `/tmp/191-t0.log`:

```text
Test Suites: 5 failed, 119 passed, 124 total
Tests:       9 failed, 4154 passed, 4163 total
```

Además de los cuatro ficheros ya anotados, `src/components/__tests__/celebration.test.tsx` falla por timeout de 60000 ms en `#171 R6: confeti › R6.6 a los 13830 ms las 36 piezas siguen en vuelo`. Se inician repeticiones individuales, manteniendo fuente, tests y límites de tiempo intactos. `bun run typecheck`: salida 0; `bunx expo lint --no-cache`: salida 0 y log vacío. `.expo/types/router.d.ts` sigue ausente.

Repetición individual de Inicio, sin cambiar código: `Test Suites: 1 passed, 1 total`; `Tests: 234 passed, 234 total`, salida 0 (`/tmp/191-h0-home-retry.log`). El fallo de esa corrida no se reproduce al ejecutar el fichero solo.

Todas las repeticiones individuales pasan sin modificar nada: Inicio 234/234, Peso 70/70, Nuevo recordatorio 65/65, Registro 73/73 y Celebración 66/66. Logs `/tmp/191-h0-{home,weight,reminder,register,celebration}-retry.log`. Se aplica la excepción expresa del handoff («si un it agota el tiempo con la máquina cargada, repite el fichero solo antes de juzgarlo»); no se repite la medición T0 completa. Se miden ahora los ficheros afectados por separado antes del primer commit.

### R1 rojo

`language-provider`: `Tests: 2 failed, 46 passed, 48 total`; aserción nueva `Expected: "{{current}} of {{total}}" / Received: undefined`; inventario existente `Expected length: 431 / Received length: 429` (autorizado expresamente por el humano). `ui-language`: `Tests: 30 passed, 30 total` (nace verde: quitar fila y ajustar su longitud no depende del catálogo). Typecheck 0, lint 0 con log vacío, tipos de router ausentes.

R1: se corrige la representación de la clave retirada en el test (`['addPet', 'avatarPreview'].join('.')`) para no contaminar el grep global. Misma aserción y mismo rojo (2 failed, 46 passed, 48 total), con producción restituida a HEAD para demostrarlo; se comprueban diffs vacío en cada ruta restaurada. Se enmienda solo el commit rojo antes de cualquier commit de producción. Los hashes del informe final serán los de la historia definitiva. Gate corregido: typecheck 0, lint 0 y log vacío.

### R7 función pura: rojo

`Tests: 4 failed, 89 passed, 93 total`. Los cuatro fallos son `TypeError: validateAddPetBasics is not a function`, excepción prescrita para la función pura nueva. Se usa el contrato `Rules` + `jest.requireActual` existente, por lo que no hay import estático inexistente y typecheck pasa (0); lint pasa (0, log vacío). Los 89 tests anteriores no se modifican.

### Totales por fichero en H0

| Fichero | Tests |
|---|---|
| `src/providers/__tests__/language-provider.test.tsx` | Tests:       47 passed, 47 total |
| `src/utils/form-rules.test.ts` | Tests:       89 passed, 89 total |
| `src/screens/add-pet/index.test.tsx` | Tests:       52 passed, 52 total |
| `src/app/__tests__/layout.test.tsx` | Tests:       28 passed, 28 total |
| `src/__tests__/ui-language.test.ts` | Tests:       30 passed, 30 total |
| `src/__tests__/design-drift.test.ts` | Tests:       114 passed, 114 total |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | Tests:       72 passed, 72 total |
| `src/__tests__/consistency-classnames.test.ts` | Tests:       72 passed, 72 total |
| `src/__tests__/alerts-canvas-fidelity.test.ts` | Tests:       27 passed, 27 total |

### Evidencia roja: r5-red-component, r5-red-screen

/tmp/191-r5-red-component.log

```text
FAIL src/components/__tests__/segmented-control.test.tsx
  ● Test suite failed to run
Test Suites: 1 failed, 1 total
Tests:       0 total
```

```text
Test suite failed to run

    Cannot find module '../segmented-control' from 'src/components/__tests__/segmented-control.test.tsx'

      11 |   allowEmpty?: boolean;
      12 | };
    > 13 | const { SegmentedControl } = jest.requireActual<{
```

/tmp/191-r5-red-screen.log

```text
FAIL src/screens/add-pet/index.test.tsx (6.097 s)
  ● R6: alta de mascota › #191 R5: Tipo, Sexo y Tamaño usan el selector
  ● #62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5) › species-dog coincide con los demás chips del formulario
  ● #62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5) › species-cat coincide con los demás chips del formulario
Test Suites: 1 failed, 1 total
Tests:       3 failed, 50 skipped, 53 total
```

```text
R6: alta de mascota › #191 R5: Tipo, Sexo y Tamaño usan el selector

    expect(received).toBe(expected) // Object.is equality

    Expected: "flex-row gap-1 rounded-14 bg-default p-1"
    Received: "flex-row gap-2"

```

```text
#62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5) › species-dog coincide con los demás chips del formulario

    expect(received).toBe(expected) // Object.is equality

    Expected: "h-9.5 flex-1 items-center justify-center rounded-10 bg-surface shadow-sm"
    Received: "rounded-full border border-accent bg-accent-soft px-3 py-2"

```

```text
#62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5) › species-cat coincide con los demás chips del formulario

    expect(received).toBe(expected) // Object.is equality

    Expected: "h-9.5 flex-1 items-center justify-center rounded-10"
    Received: "rounded-full border border-border bg-default px-3 py-2"

```

## Parada prescrita tras R5: inventarios omitidos

El selector pasa 4/4 y la pantalla 53/53. Los candados dan:

- `design-drift`: 1 fallo permitido (rounded-14 del selector), 113 tests verdes.
- `chunky-cta-canvas-fidelity`: 72/72.
- `alerts-canvas-fidelity`: 1 fallo permitido (rounded-10 del selector), 26 tests verdes.
- `forms-validation-global`: 8/8.
- `consistency-classnames`: 2 fallos. `#98 R10` espera 34 esquinas directas y recibe 36 (dos del selector); `#64 R9` espera 9 usos de `bg-accent-soft` y recibe 8 (se retira la receta del chip de especie). La siguiente aserción de `#98 R10` cuenta también `bg-accent-soft` y quedará roja al arreglar la primera.

Los recuentos globales numéricos no son el inventario «qué ficheros usan tal clase» al que la spec permite añadir una fila. `bg-accent-soft` tampoco está en la lista cerrada de rojos intermedios del handoff. Se detiene el avance antes de R2 y se pide aclaración humana para incorporar en R11 los deltas finales esperados: +3 esquinas (selector +2, burbuja +1) y −2 usos de `bg-accent-soft` (especie −1, botón de foto −1). No se relaja ni modifica ningún candado mientras está pendiente la respuesta.

**Respuesta humana**: «Sí: incluir los deltas +3 de esquinas y −2 de bg-accent-soft en R11 y continuar». Se amplía la lista de rojos intermedios autorizados con esos recuentos y se mantiene el ajuste para R11. R5: typecheck 0, lint 0 con log vacío; fuente y tests funcionales verdes.

### Evidencia roja: r2-red-layout, r2-red-screen, r2-red-ui

/tmp/191-r2-red-layout.log

```text
FAIL src/app/__tests__/layout.test.tsx
  ● #95 R4: cada pantalla de detalle declara su cabecera nativa › pets/add usa exactamente las opciones de cabecera acordadas
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
```

```text
#95 R4: cada pantalla de detalle declara su cabecera nativa › pets/add usa exactamente las opciones de cabecera acordadas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

```

/tmp/191-r2-red-screen.log

```text
FAIL src/screens/add-pet/index.test.tsx (6.497 s)
  ● #191 R2: el título vive en el contenido › pinta el título antes de la foto y conserva el botón atrás nativo
Test Suites: 1 failed, 1 total
Tests:       1 failed, 52 skipped, 53 total
```

```text
#191 R2: el título vive en el contenido › pinta el título antes de la foto y conserva el botón atrás nativo

    Unable to find an element with testID: add-pet-title

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

/tmp/191-r2-red-ui.log

```text
FAIL src/__tests__/ui-language.test.ts
  ● #65 R9: el alta de mascota resuelve su copy por clave › #186 R4: resuelve las 45 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
#65 R9: el alta de mascota resuelve su copy por clave › #186 R4: resuelve las 45 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

```

```text
#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

```

### Incidencia del registro de evidencia

El helper temporal de reporte encontró una entrada de typecheck/lint con la misma etiqueta que un test (`r3-red`) y produjo `KeyError: summaries`. El encadenado `&&` impidió el commit de R3 y la aplicación de R4. Una instrucción posterior independiente ejecutó el filtro de R4 sin que existiera aún: 56 tests saltados; no es evidencia roja. Se corrige el helper para seleccionar solo entradas con resumen de Jest, se comprueba HEAD y que el test anterior sigue intacto, y se reanuda R3. Los registros de esa corrida vacía se excluyen de los resultados por commit.

### Evidencia roja: r3-red

/tmp/191-r3-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (7.083 s)
  ● R6: alta de mascota › #191 R3: el indicador de paso muestra el primero con un segmento lleno
  ● R6: alta de mascota › #191 R3: el indicador de paso llena ambos segmentos en el segundo
  ● R6: alta de mascota › #191 R3: el indicador de paso se traduce al inglés
Test Suites: 1 failed, 1 total
Tests:       3 failed, 53 skipped, 56 total
```

```text
R6: alta de mascota › #191 R3: el indicador de paso muestra el primero con un segmento lleno

    Unable to find an element with testID: add-pet-step-label

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

```text
R6: alta de mascota › #191 R3: el indicador de paso llena ambos segmentos en el segundo

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

```text
R6: alta de mascota › #191 R3: el indicador de paso se traduce al inglés

    Unable to find an element with testID: add-pet-step-label

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

### Evidencia roja: r4-red

/tmp/191-r4-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (7.532 s)
  ● R6: alta de mascota › #191 R4: el paso 1 pinta foto, burbuja y datos básicos
Test Suites: 1 failed, 1 total
Tests:       1 failed, 55 skipped, 56 total
```

```text
R6: alta de mascota › #191 R4: el paso 1 pinta foto, burbuja y datos básicos

    expect(received).toBe(expected) // Object.is equality

    Expected: "size-22 items-center justify-center rounded-full border-2 border-dashed border-accent bg-surface-secondary"
    Received: "pressable-feedback__root button__root button__root--variant-secondary button__root--size-md rounded-xl bg-accent-soft"

```

### Ampliación humana del inventario de CTA

Al revisar los candados se detectan cuatro recuentos agregados no listados en el handoff. El humano autoriza incorporarlos a R11 y permitir sus rojos intermedios: `<Button.Label` 20→19, `Button.Label` 52→50, `text-17` 23→24 y Text blanco 17/800 16→17. Autoriza además deduplicar `ctaFiles` con `Set`: las dos filas de CTA de add-pet deben mantener dos pruebas por botón y una sola entrada por fichero consumidor del hook. Se comprobarán los valores con el guard real antes de registrar R11.

### Evidencia roja: r7-screen-red

/tmp/191-r7-screen-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (7.125 s)
  ● R6: alta de mascota › #191 R7: Continuar valida el nombre en es y avanza al corregirlo
  ● R6: alta de mascota › #191 R7: Continuar valida el nombre en en y avanza al corregirlo
Test Suites: 1 failed, 1 total
Tests:       2 failed, 56 skipped, 58 total
```

```text
R6: alta de mascota › #191 R7: Continuar valida el nombre en es y avanza al corregirlo

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

```text
R6: alta de mascota › #191 R7: Continuar valida el nombre en en y avanza al corregirlo

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

### Evidencia roja: r8-red

/tmp/191-r8-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (6.072 s)
  ● R6: alta de mascota › #191 R8: el paso 2 pinta datos médicos y guarda en modo birthDate
  ● R6: alta de mascota › #191 R8: el paso 2 pinta datos médicos y guarda en modo months
Test Suites: 1 failed, 1 total
Tests:       2 failed, 58 skipped, 60 total
```

```text
R6: alta de mascota › #191 R8: el paso 2 pinta datos médicos y guarda en modo birthDate

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

```text
R6: alta de mascota › #191 R8: el paso 2 pinta datos médicos y guarda en modo months

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

### Evidencia roja: r10-red

/tmp/191-r10-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (6.342 s)
  ● R6: alta de mascota › #191 R10: el 400 se queda en el paso 2 con el aviso y los valores
Test Suites: 1 failed, 1 total
Tests:       1 failed, 60 skipped, 61 total
```

```text
R6: alta de mascota › #191 R10: el 400 se queda en el paso 2 con el aviso y los valores

    Unable to find an element with testID: add-pet-continue

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-add-pet"[39m
```

### Núcleo R3/R4/R7/R8/R10

La implementación conjunta pasa `index.test.tsx` 61/61, `ui-language` 30/30 y reglas 93/93. `choosePhotoLabel` resuelve una vez `t('addPet.choosePhoto')` y se reutiliza en el nombre accesible y la etiqueta visible: mantiene ambos textos traducidos y la única llamada normativa de la tabla. `renderPhotoError()` pinta el mismo aviso debajo de la fila en el paso 1 y tras el CTA en el paso 2, para conservar el fallo de subida posterior al alta.

Los candados muestran los deltas previstos y autorizados (inventarios de CTA, radios, esquinas, etiquetas y acento). Aparece además `#177 R8.4`: el inventario de controles sin labio exige encontrar `add-pet-photo` entre `<Button>`, pero R4 lo convierte obligatoriamente en `<Pressable>`. Se detiene el avance y se propone mantener el candado con una comprobación explícita de Pressable sin `chunkyLip` ni `border-b-`, conservando los otros excluidos. Pendiente de respuesta humana.

**Respuesta humana sobre #177 R8.4**: «Sí: conservar la intención del guard comprobando el Pressable explícitamente y continuar». Se permite ese rojo hasta R11, donde el control seguirá comprobado sin labio. Núcleo: typecheck 0; lint 0 y log vacío. Se registra el único verde conjunto de R3, R4, R7, R8 y R10 conforme al handoff.

### Evidencia roja: r6-red

/tmp/191-r6-red.log

```text
FAIL src/screens/add-pet/index.test.tsx (7.216 s)
  ● #191 R6: métricas y receta de campos › aplica las métricas, etiquetas y controles exactos en ambos pasos
Test Suites: 1 failed, 1 total
Tests:       1 failed, 60 skipped, 61 total
```

```text
#191 R6: métricas y receta de campos › aplica las métricas, etiquetas y controles exactos en ambos pasos

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 2

```

### Evidencia roja: r9-red-screen

/tmp/191-r9-red-screen.log

```text
FAIL src/screens/add-pet/index.test.tsx (12.121 s)
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › no intercepta el paso 1 y sí el paso 2
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › conserva todos los valores y limpia el aviso al volver
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › ignora el callback mientras createPet sigue pendiente
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › llama router.back tras guardar con prevent ya falso
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › la celebración deja salir por later con prevent falso
  ● R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › la celebración deja salir por pair con prevent falso
Test Suites: 1 failed, 1 total
Tests:       6 failed, 61 passed, 67 total
```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › no intercepta el paso 1 y sí el paso 2

    expect(received).toBeDefined()

    Received: undefined

      264 |     function removal() {
```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › conserva todos los valores y limpia el aviso al volver

    expect(received).toBeDefined()

    Received: undefined

      264 |     function removal() {
```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › ignora el callback mientras createPet sigue pendiente

    expect(received).toBeDefined()

    Received: undefined

      264 |     function removal() {
```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › llama router.back tras guardar con prevent ya falso

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: undefined

```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › la celebración deja salir por later con prevent falso

    expect(received).toBeDefined()

    Received: undefined

      264 |     function removal() {
```

```text
R6: alta de mascota › #191 R9: atrás en el paso 2 vuelve al 1 con los datos › la celebración deja salir por pair con prevent falso

    expect(received).toBeDefined()

    Received: undefined

      264 |     function removal() {
```

### Comprobación completa tras R9: incidencia del modo secuencial

R9 pasa 67/67 en su fichero, typecheck 0 y lint 0 con log vacío. La primera corrida completa tras R9 se lanzó con `--runInBand` para reducir la concurrencia, desviación respecto al comando exacto del handoff. Presentó fallos por aserción en ficheros ajenos a la feature: sombras con `#0D1117` frente a centinelas de color en Celebración (#171 R14), Recordatorios (#178 R4) y Detalle de alerta (#100 R5 / #170 R15). No son timeouts ni se confunden con los rojos permitidos de R11.

Se detiene cualquier cambio de código. La corrida secuencial se termina (salida 143) señalando exclusivamente el PID de Jest con el path exacto de este worktree y `--runInBand`; log parcial conservado en `/tmp/191-after-r9-full.log`. Se contrasta en lectura con el comando exacto `bun run test`, sin argumentos, sin pipe, log `/tmp/191-after-r9-exact.log`. No se atribuye aún la causa ni se modifica ningún test externo o mock para ocultarla.

La corrida exacta tras R9 también sale 1: `Test Suites: 9 failed, 116 passed, 125 total`; `Tests: 29 failed, 4158 passed, 4187 total`. Además de los cuatro guards previstos, aparecen inventarios omitidos en `profile-canvas-fidelity` (rounded-tile y text-13 añaden add-pet), el mínimo de elementos HeroUI (200 frente a 199), y errores de mocks de colores en Celebración (2), Recuperar (2) y chunky-lip (6). No son timeouts. Se conserva `/tmp/191-after-r9-exact.log`.

El humano autoriza ampliar R11 con los inventarios de `profile-canvas-fidelity.test.ts` y `heroui-text-size-merge.test.ts`, ajustar el mínimo de HeroUI a 199 y conservar todos los demás checks. Esos dos ficheros se añaden explícitamente al alcance autorizado.

Diagnóstico sin cambios de código: chunky-lip aislado 7/7 (`/tmp/191-diagnose-theme.log`) y Celebración aislada 66/66 (`/tmp/191-diagnose-celebration.log`). `git diff H0 -- src/theme/ test/ package.json` vacío (rutas móviles completas). No se toca configuración, tema ni mocks globales. Comprobación de control en curso: suite con `--testPathIgnorePatterns='src/screens/add-pet/index.test.tsx|src/components/__tests__/segmented-control.test.tsx'`, log `/tmp/191-diagnose-without-feature-tests.log`.

Resultado del control excluyendo los dos ficheros de test de #191: salida 1, `Test Suites: 6 failed, 117 passed, 123 total`; `Tests: 19 failed, 4097 passed, 4116 total` (199.507 s). Únicamente rojos de inventarios, todos autorizados. Recuperar, Celebración y chunky-lip pasan en ese control; no se afirma todavía la causa de los fallos de mock de la corrida exacta anterior. Conforme a la parada expresa de §R9, se solicita autorización para continuar R11 y repetir la suite completa, exigiendo verde para el cierre y sin ampliar cambios a tema/tests externos.

Comprobación de rutas después de R9, cada fichero aislado: detail-stack 19/19, guard 20/20, navigation 2/2, tabs/layout 5/5, food 85/85, forms-validation-global 8/8. Salida 0 en los seis; logs `/tmp/191-cross-{0..5}.log`.

Autorización humana: continuar R11 y exigir suite completa verde al final; si reaparecen los fallos de mocks, dejar bloqueo, sin tocar tema ni tests externos. Se había iniciado una segunda confirmación exacta sin cambios (`/tmp/191-after-r9-exact-confirm.log`) mientras llegaba la respuesta. Se interrumpe al recibir autorización para pasar a R11, antes de editar tests; no se usa como veredicto. No se cambia código para evitar el fallo de mocks.


R11: al actualizar HeroUI a 199 aparece la aserción siguiente del mismo test: className esperado >=167, recibido 166. Se pausa antes de modificarla y se mide el escáner completo con el código original de H0 para add-pet (sin checkout ni cambiar el árbol): ficheros HeroUI 30→30, elementos HeroUI 200→199, Card 42→42, elementos con className 167→166. El humano autoriza también el mínimo className 166 y continuar. Los otros checks se conservan. Log rojo intermedio `/tmp/191-r11-hero-green.log`; medida auxiliar `/tmp/191-measure-hero.cjs` (primer intento de diagnóstico sin exports falló; corregido fuera del árbol, no es evidencia TDD).

### Evidencia roja: r11-charter-red

/tmp/191-r11-charter-red.log

```text
FAIL src/__tests__/add-pet-two-steps.test.ts
  ● #191 R11: la carta recoge la enmienda
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

```text
#191 R11: la carta recoge la enmienda

    expect(received).toContain(expected) // indexOf

    Expected substring: "## Enmienda #191 — Nueva mascota en dos pasos"
    Received string:    "# Carta de UI — mobile-pet-tracker·
    > Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
```

## R11: inventarios y enmienda

Los seis commits de inventarios nacen verdes: la producción de R1–R10 ya contiene los valores nuevos. Se usa la excepción expresa del handoff, sin inventar un commit vacío de producción. Los rojos de los guards antiguos quedan conservados en las corridas intermedias y en la suite tras R9.

- design-drift: 114/114; suma selector a los ficheros sin drift y a rounded-14, add-pet rounded-16 1→2.
- chunky-cta-canvas-fidelity: 74/74; nueva fila Continuar (+2 it.each), dos CTA en add-pet y un solo fichero consumidor mediante Set. Recuentos exactos de etiquetas autorizados. Foto comprobada como Pressable sin chunkyLip ni border-b-; demás controles excluidos intactos.
- consistency-classnames: 73/73; nueva fila del selector (+1 it.each), seis esquinas en add-pet, global 34→37, acento suave 9→7 y primarios 16→17.
- alerts-canvas-fidelity: 27/27; rounded-10 en selector, text-15 y tracking-title en add-pet.
- profile-canvas-fidelity: 26/26; rounded-tile y text-13 en add-pet, autorización explícita de alcance.
- heroui-text-size-merge: 25/25; mínimos 200→199 y 167→166 autorizados, resto intacto; scanner y sondas no se cambian.

Nuevo `add-pet-two-steps.test.ts`: rojo 1 failed, 1 passed, 2 total. La carta falla por `Expected substring: "## Enmienda #191 — Nueva mascota en dos pasos"`; el inventario de fuentes nace verde porque lo cumple R1–R10. Verde de documentación: 2/2; radio exacto dentro de regla 12, recetas, métricas, siete desviaciones y casilla humana sin marcar. En cada commit de código se verifica router.d.ts ausente, typecheck 0 y lint 0 con log vacío; detalle completo al final.

## Instantáneas verificadas en cada commit

Medidas sobre el mismo contenido que se commitea, inmediatamente antes del commit. La historia se conserva sin rebase. Cada gate requerido terminó en 0 y cada log de lint está vacío; las etiquetas y rutas de logs se relacionan en el registro completo.

| Commit | Momento | Tests por fichero |
|---|---|---|
| `921a6f89` | R1 rojo | provider 2 failed, 46 passed / 48 total; ui-language 30 passed |
| `ba085a7d` | R1 verde | provider 48; ui-language 30; add-pet 52 passed |
| `f85328bb` | R7 puro rojo | form-rules 4 failed, 89 passed / 93 total |
| `0cfc685c` | R7 puro verde | form-rules 93 passed |
| `1165cefb` | R5 rojo | selector: Cannot find module, 0 tests ejecutables; add-pet 3 failed, 50 skipped / 53 total |
| `4f2fc961` | R5 verde | selector 4; add-pet 53 passed; guards en tabla inferior |
| `b021f3e4` | R2 rojo | layout 1 failed, 27 passed / 28; add-pet 1 failed, 52 skipped / 53; ui-language 2 failed, 28 passed / 30 |
| `e499681f` | R2 verde | layout 28; add-pet 53; ui-language 30 passed; guards en tabla inferior |
| `ae6dc9ad` | R3 rojo | add-pet 3 failed, 53 skipped / 56 total |
| `58dcdee7` | R4 rojo | add-pet 1 failed, 55 skipped / 56 total |
| `25c59c7e` | R7 pantalla rojo | add-pet 2 failed, 56 skipped / 58 total |
| `70a0c39d` | R8 rojo | add-pet 2 failed, 58 skipped / 60 total |
| `70df424c` | R10 rojo | add-pet 1 failed, 60 skipped / 61 total |
| `3010a03d` | R3/R4/R7/R8/R10 verde | add-pet 61; ui-language 30; form-rules 93 passed; guards en tabla inferior |
| `daf9f91d` | R6 rojo | add-pet 1 failed, 60 skipped / 61 total |
| `15395c13` | R6 verde | add-pet 61 passed; guards en tabla inferior |
| `813017a0` | R9 rojo | add-pet 6 failed, 61 passed / 67 total |
| `f47fece9` | R9 verde | add-pet 67 passed; guards en tabla inferior |
| `3175b6be` | R11 nace verde | design-drift 114 passed |
| `c43884de` | R11 nace verde | chunky-cta-canvas-fidelity 74 passed |
| `d40a306c` | R11 nace verde | consistency-classnames 73 passed |
| `9a5d6b48` | R11 nace verde | alerts-canvas-fidelity 27 passed |
| `9fa07aae` | R11 nace verde | profile-canvas-fidelity 26 passed |
| `8f09db78` | R11 nace verde | heroui-text-size-merge 25 passed |
| `7f339d27` | R11 carta rojo | add-pet-two-steps 1 failed, 1 passed / 2 total |
| `b331fc88` | R11 carta verde | add-pet-two-steps 2 passed |

## Candados rojos entre R5 y R11

Cifras de tests fallidos; forms-validation-global siempre verde 8/8.

| Verde | design-drift | chunky CTA | consistency | alerts fidelity |
|---|---|---|---|---|
| R5 | 1 | 0 | 2 | 1 |
| R2 | 1 | 0 | 2 | 2 |
| Núcleo R3/R4/R7/R8/R10 | 1 | 7 | 5 | 2 |
| R6 | 1 | 7 | 5 | 3 |
| R9 | 1 | 7 | 5 | 3 |

- design-drift: #178 R13, mapa rounded-16 de add-pet 1→2 y fichero selector en rounded-14.
- consistency: #62 R1 primarios 16→17; #62 R14 esquinas de add-pet 5→6; #98 R10 CONTINUOUS_CORNER 34→37 y bg-accent-soft 9→7; #64 R9 bg-accent-soft 9→7; #166 R2 mapa de primarios de add-pet 1→2. El selector añade dos esquinas y la burbuja una; se actualiza también la suma de directUses.
- chunky CTA: #177 R3.3 y R8.1 nueva fila Continuar; R6.2 cuatro recuentos de etiquetas; R7.2/R7.5 add-pet tiene dos primarios; R7.3 radios 26→27 y add-pet 1→2; R8.4 foto es Pressable. Deduplicar ctaFiles conserva la distinción entre botones y consumidores de hook.
- alerts fidelity: #174 R12 rounded-10 en selector desde R5, tracking-title en add-pet desde R2 y text-15 en add-pet desde R6.
- La suite completa tras R9 descubre además los inventarios de Perfil y los dos mínimos del escáner de HeroUI, incorporados solo con aprobación humana expresa. Se registran también los fallos de mocks y las pausas, sin confundirlos con los inventarios autorizados.

## Delta de tests previsto y comprobación de conservación

H0: 124 suites y 4163 tests. R1 +1; R7 puro +4; selector R5 +4; pantalla +15 (R5 +1, R3 +3, R7 +2, R8 +2, R10 +1, R9 +6); R11 +5 (nuevo fichero +2, fila CTA +2, fila de esquinas +1). Total esperado: 126 suites y 4192 tests, delta +29. R2, R4 y R6 reescriben casos existentes; los demás inventarios conservan su número de tests.

Se conserva el guard PICKER_MOCK_UNARMED (tres ocurrencias) y solo pressPickPhoto pulsa el picker. La validación de nombre y fecha se observa en su paso correspondiente por autorización humana. Los checks que antes leían nodos desmontados se verifican con los datos del mismo payload y el nuevo test de conservación completa de R9. Se mantienen los 89 casos antiguos de form-rules, el contrato createPet y las pruebas de errores, foto, fechas locales, teclado y celebración.

## Registro completo de verificaciones por fichero

Cada etiqueta corresponde a `/tmp/191-<etiqueta>.log`; los gates tienen sufijos `-typecheck` y `-lint`. Los ficheros Jest se ejecutaron uno cada vez, excepto las corridas completas indicadas. Los skips corresponden al filtro del requisito en los commits rojos.

| Momento | Fichero / check | Código | Resultado |
|---|---|---|---|
| h0-home-retry | `src/screens/home/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       234 passed, 234 total |
| h0-weight-retry | `src/screens/weight-log/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       70 passed, 70 total |
| h0-reminder-retry | `src/screens/add-reminder/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       65 passed, 65 total |
| h0-register-retry | `src/screens/register/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       73 passed, 73 total |
| h0-celebration-retry | `src/components/__tests__/celebration.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       66 passed, 66 total |
| h0-file-0 | `src/providers/__tests__/language-provider.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       47 passed, 47 total |
| h0-file-1 | `src/utils/form-rules.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       89 passed, 89 total |
| h0-file-2 | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       52 passed, 52 total |
| h0-file-3 | `src/app/__tests__/layout.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       28 passed, 28 total |
| h0-file-4 | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| h0-file-5 | `src/__tests__/design-drift.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       114 passed, 114 total |
| h0-file-6 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       72 passed, 72 total |
| h0-file-7 | `src/__tests__/consistency-classnames.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       72 passed, 72 total |
| h0-file-8 | `src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       27 passed, 27 total |
| r1-red | `src/providers/__tests__/language-provider.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 46 passed, 48 total |
| r1-red-ui | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| r1-red | typecheck | 0 | Ver log |
| r1-red | lint | 0 | Log vacío |
| r1-green | `src/providers/__tests__/language-provider.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       48 passed, 48 total |
| r1-green-ui | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| r1-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       52 passed, 52 total |
| r1-green | typecheck | 0 | Ver log |
| r1-green | lint | 0 | Log vacío |
| r1-red-corrected | `src/providers/__tests__/language-provider.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 46 passed, 48 total |
| r1-red-corrected | typecheck | 0 | Ver log |
| r1-red-corrected | lint | 0 | Log vacío |
| r1-green-final | `src/providers/__tests__/language-provider.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       48 passed, 48 total |
| r1-green-final-ui | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| r1-green-final-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       52 passed, 52 total |
| r1-green-final | typecheck | 0 | Ver log |
| r1-green-final | lint | 0 | Log vacío |
| r7a-red | `src/utils/form-rules.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       4 failed, 89 passed, 93 total |
| r7a-red | typecheck | 0 | Ver log |
| r7a-red | lint | 0 | Log vacío |
| r7a-green | `src/utils/form-rules.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       93 passed, 93 total |
| r7a-green | typecheck | 0 | Ver log |
| r7a-green | lint | 0 | Log vacío |
| r5-red-component | `src/components/__tests__/segmented-control.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       0 total |
| r5-red-screen | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       3 failed, 50 skipped, 53 total |
| r5-red | typecheck | 0 | Ver log |
| r5-red | lint | 0 | Log vacío |
| r5-green-component | `src/components/__tests__/segmented-control.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       4 passed, 4 total |
| r5-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       53 passed, 53 total |
| r5-green-design-drift | `src/__tests__/design-drift.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 113 passed, 114 total |
| r5-green-chunky-cta-canvas-fidelity | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       72 passed, 72 total |
| r5-green | typecheck | 0 | Ver log |
| r5-green-consistency-classnames | `src/__tests__/consistency-classnames.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 70 passed, 72 total |
| r5-green-alerts-canvas-fidelity | `src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 26 passed, 27 total |
| r5-green-forms-validation-global | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| r5-green | lint | 0 | Log vacío |
| r2-red-layout | `src/app/__tests__/layout.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 27 passed, 28 total |
| r2-red-screen | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 52 skipped, 53 total |
| r2-red-ui | `src/__tests__/ui-language.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 28 passed, 30 total |
| r2-red | typecheck | 0 | Ver log |
| r2-red | lint | 0 | Log vacío |
| r2-green-layout | `src/app/__tests__/layout.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       28 passed, 28 total |
| r2-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       53 passed, 53 total |
| r2-green-ui | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| r2-green-design-drift | `src/__tests__/design-drift.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 113 passed, 114 total |
| r2-green-chunky-cta-canvas-fidelity | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       72 passed, 72 total |
| r2-green-consistency-classnames | `src/__tests__/consistency-classnames.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 70 passed, 72 total |
| r2-green-alerts-canvas-fidelity | `src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 25 passed, 27 total |
| r2-green-forms-validation-global | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| r2-green | typecheck | 0 | Ver log |
| r2-green | lint | 0 | Log vacío |
| r3-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       3 failed, 53 skipped, 56 total |
| r3-red | typecheck | 0 | Ver log |
| r3-red | lint | 0 | Log vacío |
| r4-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 55 skipped, 56 total |
| r4-red | typecheck | 0 | Ver log |
| r4-red | lint | 0 | Log vacío |
| r7-screen-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 56 skipped, 58 total |
| r7-screen-red | typecheck | 0 | Ver log |
| r7-screen-red | lint | 0 | Log vacío |
| r8-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 58 skipped, 60 total |
| r8-red | typecheck | 0 | Ver log |
| r8-red | lint | 0 | Log vacío |
| r10-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 60 skipped, 61 total |
| r10-red | typecheck | 0 | Ver log |
| r10-red | lint | 0 | Log vacío |
| core-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       61 passed, 61 total |
| core-green-ui | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| core-green-rules | `src/utils/form-rules.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       93 passed, 93 total |
| core-green-design-drift | `src/__tests__/design-drift.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 113 passed, 114 total |
| core-green-chunky-cta-canvas-fidelity | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       7 failed, 65 passed, 72 total |
| core-green-consistency-classnames | `src/__tests__/consistency-classnames.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       5 failed, 67 passed, 72 total |
| core-green-alerts-canvas-fidelity | `src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 25 passed, 27 total |
| core-green-forms-validation-global | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| core-green | typecheck | 0 | Ver log |
| core-green | lint | 0 | Log vacío |
| r6-red | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 60 skipped, 61 total |
| r6-red | typecheck | 0 | Ver log |
| r6-red | lint | 0 | Log vacío |
| r6-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       61 passed, 61 total |
| r6-green-design-drift | `src/__tests__/design-drift.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 113 passed, 114 total |
| r6-green-chunky-cta-canvas-fidelity | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       7 failed, 65 passed, 72 total |
| r6-green-consistency-classnames | `src/__tests__/consistency-classnames.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       5 failed, 67 passed, 72 total |
| r6-green-alerts-canvas-fidelity | `src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       3 failed, 24 passed, 27 total |
| r6-green-forms-validation-global | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| r6-green | typecheck | 0 | Ver log |
| r6-green | lint | 0 | Log vacío |
| r9-red-screen | `src/screens/add-pet/index.test.tsx` | 1 | Test Suites: 1 failed, 1 total; Tests:       6 failed, 61 passed, 67 total |
| r9-red | typecheck | 0 | Ver log |
| r9-red | lint | 0 | Log vacío |
| r9-green-screen | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       67 passed, 67 total |
| r9-green-design-drift | `src/__tests__/design-drift.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 113 passed, 114 total |
| r9-green-chunky-cta-canvas-fidelity | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       7 failed, 65 passed, 72 total |
| r9-green-consistency-classnames | `src/__tests__/consistency-classnames.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       5 failed, 67 passed, 72 total |
| r9-green-alerts-canvas-fidelity | `src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       3 failed, 24 passed, 27 total |
| r9-green-forms-validation-global | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| r9-green | typecheck | 0 | Ver log |
| r9-green | lint | 0 | Log vacío |
| diagnose-theme | `src/theme/__tests__/chunky-lip.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       7 passed, 7 total |
| diagnose-celebration | `src/components/__tests__/celebration.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       66 passed, 66 total |
| cross-0 | `src/app/__tests__/detail-stack.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       19 passed, 19 total |
| cross-1 | `src/app/__tests__/detail-stack.guard.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       20 passed, 20 total |
| cross-2 | `src/app/__tests__/detail-stack.navigation.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       2 passed, 2 total |
| cross-3 | `src/app/(tabs)/__tests__/layout.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       5 passed, 5 total |
| cross-4 | `src/app/(tabs)/__tests__/food.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       85 passed, 85 total |
| cross-5 | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| r11-profile-before | `src/__tests__/profile-canvas-fidelity.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       2 failed, 24 passed, 26 total |
| r11-hero-before | `src/__tests__/heroui-text-size-merge.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 24 passed, 25 total |
| r11-design-green | `src/__tests__/design-drift.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       114 passed, 114 total |
| r11-design-green | typecheck | 0 | Ver log |
| r11-design-green | lint | 0 | Log vacío |
| r11-cta-green | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       74 passed, 74 total |
| r11-cta-green | typecheck | 0 | Ver log |
| r11-cta-green | lint | 0 | Log vacío |
| r11-consistency-green | `src/__tests__/consistency-classnames.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       73 passed, 73 total |
| r11-consistency-green | typecheck | 0 | Ver log |
| r11-consistency-green | lint | 0 | Log vacío |
| r11-alerts-green | `src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       27 passed, 27 total |
| r11-alerts-green | typecheck | 0 | Ver log |
| r11-alerts-green | lint | 0 | Log vacío |
| r11-profile-green | `src/__tests__/profile-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       26 passed, 26 total |
| r11-profile-green | typecheck | 0 | Ver log |
| r11-profile-green | lint | 0 | Log vacío |
| r11-hero-green | `src/__tests__/heroui-text-size-merge.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 24 passed, 25 total |
| r11-hero-final-green | `src/__tests__/heroui-text-size-merge.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       25 passed, 25 total |
| r11-hero-final-green | typecheck | 0 | Ver log |
| r11-hero-final-green | lint | 0 | Log vacío |
| r11-charter-red | `src/__tests__/add-pet-two-steps.test.ts` | 1 | Test Suites: 1 failed, 1 total; Tests:       1 failed, 1 passed, 2 total |
| r11-charter-red | typecheck | 0 | Ver log |
| r11-charter-red | lint | 0 | Log vacío |
| r11-charter-green | `src/__tests__/add-pet-two-steps.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       2 passed, 2 total |
| r11-charter-green | typecheck | 0 | Ver log |
| r11-charter-green | lint | 0 | Log vacío |
| final-file-0 | `src/providers/__tests__/language-provider.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       48 passed, 48 total |
| final-file-1 | `src/utils/form-rules.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       93 passed, 93 total |
| final-file-2 | `src/screens/add-pet/index.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       67 passed, 67 total |
| final-file-3 | `src/components/__tests__/segmented-control.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       4 passed, 4 total |
| final-file-4 | `src/app/__tests__/layout.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       28 passed, 28 total |
| final-file-5 | `src/__tests__/ui-language.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       30 passed, 30 total |
| final-file-6 | `src/__tests__/add-pet-two-steps.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       2 passed, 2 total |
| final-file-7 | `src/__tests__/design-drift.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       114 passed, 114 total |
| final-file-8 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       74 passed, 74 total |
| final-file-9 | `src/__tests__/consistency-classnames.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       73 passed, 73 total |
| final-file-10 | `src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       27 passed, 27 total |
| final-file-11 | `src/__tests__/profile-canvas-fidelity.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       26 passed, 26 total |
| final-file-12 | `src/__tests__/heroui-text-size-merge.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       25 passed, 25 total |
| final-file-13 | `src/app/__tests__/detail-stack.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       19 passed, 19 total |
| final-file-14 | `src/app/__tests__/detail-stack.guard.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       20 passed, 20 total |
| final-file-15 | `src/app/__tests__/detail-stack.navigation.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       2 passed, 2 total |
| final-file-16 | `src/app/(tabs)/__tests__/layout.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       5 passed, 5 total |
| final-file-17 | `src/app/(tabs)/__tests__/food.test.tsx` | 0 | Test Suites: 1 passed, 1 total; Tests:       85 passed, 85 total |
| final-file-18 | `src/__tests__/forms-validation-global.test.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       8 passed, 8 total |
| final | typecheck | 0 | Ver log |
| final-copy-table | `src/__tests__/ui-copy-table.ts` | 0 | Test Suites: 1 passed, 1 total; Tests:       2 passed, 2 total |
| final | lint | 0 | Log vacío |

## Historia definitiva de commits

```text
921a6f89 test(mobile): claves de copy del asistente de dos pasos (R1)
ba085a7d feat(mobile): claves de copy del asistente de dos pasos (R1)
f85328bb test(mobile): validateAddPetBasics (R7)
0cfc685c feat(mobile): validateAddPetBasics en form-rules (R7)
1165cefb test(mobile): SegmentedControl compartido (R5)
4f2fc961 feat(mobile): SegmentedControl compartido para Tipo, Sexo y Tamaño (R5)
b021f3e4 test(mobile): título en el contenido y cabecera sin título (R2)
e499681f feat(mobile): título de Nueva mascota en el contenido (R2)
ae6dc9ad test(mobile): indicador de paso y barra de dos segmentos (R3)
58dcdee7 test(mobile): paso 1 con foto, burbuja y datos básicos (R4)
25c59c7e test(mobile): Continuar valida el nombre y avanza (R7)
70a0c39d test(mobile): paso 2 con datos médicos y su CTA (R8)
70df424c test(mobile): regresiones de guardado, foto y celebración llegan al paso 2 (R10)
3010a03d feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10)
daf9f91d test(mobile): métricas y receta de campos del canvas (R6)
15395c13 feat(mobile): métricas y campos de Nueva mascota como el canvas (R6)
813017a0 test(mobile): atrás en el paso 2 vuelve al 1 conservando los datos (R9)
f47fece9 feat(mobile): atrás en el paso 2 vuelve al paso 1 (R9)
3175b6be test(mobile): inventario de radios y selector sin drift (R11)
c43884de test(mobile): inventario de CTA y foto como Pressable (R11)
d40a306c test(mobile): inventarios de esquinas y acento (R11)
9a5d6b48 test(mobile): inventarios de radios y texto de Alertas (R11)
9fa07aae test(mobile): inventarios de burbuja y texto de Perfil (R11)
8f09db78 test(mobile): universo medido de elementos HeroUI (R11)
7f339d27 test(mobile): carta e inventarios de Nueva mascota en dos pasos (R11)
b331fc88 docs(mobile): carta de Nueva mascota en dos pasos (R11)
```

## Cierre y aceptación

**R1–R11 implementados y verificados; R12 queda para el humano.**

- CC1: **verde**. Los 20 ficheros de test afectados o relacionados pasan individualmente (incluida la tabla de copy). Suite completa exacta `bun run test`, sin filtros ni pipe, salida 0; log `/tmp/191-final-full.log`:

```text
Test Suites: 126 passed, 126 total
Tests:       4192 passed, 4192 total
Snapshots:   1 passed, 1 total
Time:        131.208 s, estimated 188 s
```

- Total final 4192 frente a T0 4163: +29, explicado por R y por it.each en la sección de deltas. Los fallos de mocks de colores anteriores **no reaparecen** en la corrida final; no se atribuye una causa no demostrada. Se conserva toda la evidencia anterior y no se cambió código externo para obtener el verde. Aparece el aviso preexistente de worker que no sale limpiamente, permitido expresamente por el handoff; el proceso devuelve 0.
- Typecheck final: 0. Lint final: 0 y log vacío. Router generado ausente. Logs `/tmp/191-final-{typecheck,lint}.log`.
- `graphify update .` final: 0; log `/tmp/191-final-graphify.log`. Grafo reconstruido: 26923 nodos, 34899 aristas, 1750 comunidades. Avisa de que 20 SQL no contribuyen por falta de tree_sitter_sql y de nombres de comunidades por refrescar; no se instalan dependencias ni se lanza extracción semántica fuera de alcance. No se commitea graphify-out.
- CC2: **verde**. FieldErrorMessage 4, usePreventRemove presente (una llamada), rounded-16 2, esquinas directas 6 en pantalla y 2 en selector, clave retirada ausente en src, fórmulas con #191 R1 y delta +3−1, EN 431. Los tests mantienen tres ocurrencias de PICKER_MOCK_UNARMED.
- CC3: **verde**. R1–R11 remiten a tests reales y commits; los 14 hashes distintos de trazabilidad pasan `git cat-file -e`. No hay filas con «pendiente». R12 = cierre humano. La aprobación de la trazabilidad corresponde al reviewer.
- CC4: **verde**. Casilla de la enmienda #191 y ambas casillas de Cierre del humano sin marcar. La aprobación histórica de la spec sigue intacta.
- Alcance: solo las rutas del handoff más los dos guards autorizados expresamente; `git diff --check` sin errores. No hay cambios en backend, API, tema, dependencias, infraestructura, estado de features ni bookkeeping del leader. No se abre/edita PR ni se mergea/rebasa.

### Omisión de medición individual detectada al cierre

`ui-copy-table.ts` también declara dos tests. Sus tests se ejecutaron al importar la tabla desde ui-language y en T0, pero se omitió su comando aislado de la tabla inicial antes del primer commit. Se ejecuta ahora aislado: **2/2**, log `/tmp/191-final-copy-table.log`; se comprueba con `git show H0:.../ui-copy-table.ts` que los dos casos eran idénticos en H0. Se registra esta desviación sin inventar una medición inicial ni alterar el árbol para recrearla. La comprobación auxiliar de CC4 se acota a Cierre del humano, excluyendo la sección siguiente de aprobación histórica de la spec.

### Rutas del diff de cierre H0..HEAD

La lista incluye este commit documental y se contrasta tras crearlo:

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/add-pet-two-steps.test.ts
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/components/__tests__/segmented-control.test.tsx
mobile-pet-tracker/src/components/segmented-control.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
mobile-pet-tracker/src/utils/form-rules.test.ts
mobile-pet-tracker/src/utils/form-rules.ts
progress/impl_mobile-add-pet-two-steps.md
specs/mobile-add-pet-two-steps/traceability.md
specs/mobile-ui-language/design.md
```

### Entrega al leader

Commit final limitado a este reporte y traceability, con el mensaje del handoff. Árbol limpio al entregar; el único marcador ignorado se crea como última acción, con una sola línea que apunta a este reporte. No se modifica el estado de la feature.

Le corresponden al leader `./init.sh`, revisión y PR; al humano, aprobar la enmienda y ejecutar el smoke Android de R12. No se han simulado esos pasos.
