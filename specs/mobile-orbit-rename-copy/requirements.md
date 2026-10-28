---
feature: "mobile-orbit-rename-copy"
status: approved
tags: [harness, spec]
---

# Requisitos — [[mobile-orbit-rename-copy]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, el inventario de ficheros medidos y las
> pruebas de mutación, y [[../../docs/architecture|architecture]] para las reglas de capas.
> Origen: `progress/plan_ui-2026-10-26.md` §2 entrada #221 (punto 8, texto),
> `progress/explore_ui-mascota-orbit-2026-10-26.md` Parte 8 (opción C: renombre visible
> ahora, identificadores después en #225).
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.
> Voz B (`docs/ui-guidelines.md` punto 7): el copy nuevo no exclama, no lleva emoji y
> termina en punto.

## Contexto y decisión del humano (cerrada)

El 2026-10-26 el humano decidió que la mascota deja de llamarse **Pingo** y pasa a
llamarse **Orbit**. Esta feature cambia **solo lo que el usuario lee**:

1. las dos cadenas visibles del catálogo con «Pingo» como nombre
   (`welcome.pingoGreeting`, es y en);
2. el punto 7 de la carta `docs/ui-guidelines.md` (gate G4, requisito R4, separado).

**No cambia** ningún identificador, `testID`, clave de catálogo, nombre de fichero ni
asset `pingo-*`: los renombra #225. Las specs ya firmadas (`specs/*`) y los informes de
`progress/` conservan «Pingo» como historia.

Medido sobre el árbol (base `origin/dev`, `0c37e77a`), no copiado del plan:

| Ancla (desde `mobile-pet-tracker/`) | Antes | Después |
|---|---|---|
| `grep -cF "Pingo" src/i18n/catalog.ts` | 2 | 0 |
| `grep -cF "Orbit" src/i18n/catalog.ts` | 0 | 2 |
| `grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts` | 2 | 2 |
| `grep -cF "welcome.pingoGreeting" src/__tests__/ui-copy-table.ts` | 1 | 1 |
| `grep -cF "welcome.pingoGreeting" src/screens/welcome/index.tsx` | 1 | 1 |
| `grep -rIil "orbit" src app.json app.config.ts package.json assets` (ficheros) | 0 | 1 (`src/i18n/catalog.ts`) |
| `ls assets/images \| grep -c '^pingo-'` | 9 | 9 |
| `grep -cF "Hola, soy Pingo." src/screens/welcome/index.test.tsx` | 5 | 1 (solo el título del `it` de #205 R5, ver R1) |
| `grep -cF "Hola, soy Orbit." src/screens/welcome/index.test.tsx` | 0 | 4 |
| `grep -cF "Hi, I\\'m Pingo." src/screens/welcome/index.test.tsx` | 4 | 1 (la misma línea del título) |
| `grep -cF "Hi, I\\'m Orbit." src/screens/welcome/index.test.tsx` | 0 | 3 |

Premisas del plan verificadas contra el árbol:

- «Son las únicas dos cadenas visibles con Pingo como nombre»: **cierto**. `\bPingo\b` en
  código no-test de `src/`, `app.json`, `app.config.ts` y `package.json` da exactamente
  las dos líneas de `catalog.ts`; el resto de «Pingo» son identificadores
  (`PingoFloat`, `homePingoPhrase`).
- «El candado es `screens/welcome/index.test.tsx`»: **cierto, y también lo es la carta**.
  El mismo fichero lee `docs/ui-guidelines.md` en dos sitios y `celebration.test.tsx` en
  un tercero (R4).
- «`ui-copy-table.ts` y los candados que citen el literal»: **desfasado**.
  `__tests__/ui-copy-table.ts` indexa por `{ file, key }` y no contiene ningún literal de
  copy; como la clave y el fichero no cambian, **no se edita** y `SCREEN_FILES` no se
  mueve (recuento: sin cambio, ver R3). El único fichero de test que cita el literal
  «Hola, soy Pingo.» / «Hi, I'm Pingo.» es `screens/welcome/index.test.tsx`.
- El plan dice «4 expects» en el test de welcome: son **7 líneas de `expect`** en **4 `it`**
  (ver R1).

## Requisitos funcionales

- **R1**: WHEN el catálogo se carga en español THE SYSTEM SHALL tener
  `es['welcome.pingoGreeting']` igual a `Hola, soy Orbit.`; WHEN se carga en inglés
  THE SYSTEM SHALL tener `en['welcome.pingoGreeting']` igual a `Hi, I'm Orbit.`
  (apóstrofo ASCII U+0027, un solo punto final, sin `!`, sin `¡`, sin emoji, sin salto de
  línea); WHEN la pantalla de bienvenida se pinta con idioma `es` / `en` THE SYSTEM SHALL
  mostrar ese texto como único hijo de `welcome-bubble-text`. La clave **no** se renombra.
  - Tests. Enmendados (7 líneas de `expect`, 4 `it`, en `src/screens/welcome/index.test.tsx`;
    solo cambian los literales, **no** los títulos de `describe`/`it`, porque la
    trazabilidad firmada de #205 cita el título del cuarto):
    1. `#153 R1: el saludo de Pingo existe en los dos idiomas` ›
       `declara el saludo en inglés y en español (enmendado por #205 R5)`: líneas con
       `// #205 R5` → `'Hi, I\'m Orbit.'` y `'Hola, soy Orbit.'` y se les añade
       `// #221 R1`.
    2. mismo `describe` › `pinta el saludo en el bocadillo en español (enmendado por #205 R5)`:
       `getByText('Hola, soy Orbit.')`.
    3. mismo `describe` › `pinta el saludo en el bocadillo en inglés (enmendado por #205 R5)`:
       `getByText('Hi, I\'m Orbit.')`.
    4. `#205 R5: saludo de Main` › `#205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I\'m Pingo.»`:
       los tres `toBe`/`toEqual` pasan a `'Hola, soy Orbit.'`, `'Hi, I\'m Orbit.'` y
       `['Hola, soy Orbit.']`. **El título del `it` se queda tal cual** (historia firmada).
    Nuevo, en `src/__tests__/orbit-rename-copy.test.ts`: `#221 R1: el catálogo dice Orbit`
    lee `src/i18n/catalog.ts` como **texto** y exige que contenga exactamente una vez cada
    línea `  'welcome.pingoGreeting': 'Hi, I\'m Orbit.',` y
    `  'welcome.pingoGreeting': 'Hola, soy Orbit.',` y que no contenga `’` (U+2019).
    La lectura como texto evita comparar el valor contra el símbolo importado de producción.

- **R2**: WHILE el código de la aplicación esté en el árbol THE SYSTEM SHALL no contener la
  palabra «Pingo» como nombre visible: ningún fichero no-test de `src/` (extensiones `.ts`,
  `.tsx`, `.js`, `.jsx`, `.json`, `.css`, excluidos los directorios `__tests__` y los
  ficheros `*.test.*`), ni `app.json`, ni `app.config.ts`, ni `package.json`, contiene una
  coincidencia de `/\bPingo\b/` (sensible a mayúsculas; `PingoFloat` y `homePingoPhrase` no
  coinciden porque no hay frontera de palabra), y ningún **valor** de los objetos `en` y
  `es` del catálogo coincide con `/pingo/i`. Los comentarios cuentan: un comentario que
  llame «Pingo» a la mascota queda rojo.
  - Test: `src/__tests__/orbit-rename-copy.test.ts` › `#221 R2: ninguna cadena visible nombra a Pingo`
    (dos `it`: código fuente y valores del catálogo). El recorrido de ficheros usa
    `readdirSync(..., { withFileTypes: true })` como `sourceFiles()` de
    `src/__tests__/alert-detail-canvas-fidelity.test.ts` (patrón a copiar, con
    `jest.requireActual<typeof import('fs')>('fs')`). Para que el recorrido no pueda estar
    vacío sin que el test lo note, el mismo `it` exige que la lista contenga las rutas
    `i18n/catalog.ts`, `screens/welcome/index.tsx`, `components/empty-state.tsx` y
    `app/(tabs)/_layout.tsx` (sin fijar cuántos ficheros hay).
  - Nace **rojo** (hoy hay 2 coincidencias en `catalog.ts`) y se pone verde con R1.

- **R3**: WHILE esta feature esté vigente THE SYSTEM SHALL conservar sin cambio los
  identificadores, `testID`, claves y assets con prefijo `pingo` y no introducir ninguno con
  `orbit`: (a) `src/i18n/catalog.ts` declara la clave `'welcome.pingoGreeting':` exactamente
  2 veces (una por idioma) y ninguna clave contiene `orbit`; (b) `src/screens/welcome/index.tsx`
  contiene una vez `t('welcome.pingoGreeting')`, una vez `testID="welcome-bubble-text"` y una
  vez `testID="welcome-pingo-float"`; (c) `src/__tests__/ui-copy-table.ts` contiene exactamente una
  vez la fila `{ file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }`;
  (d) `assets/images` no contiene ningún fichero cuyo nombre case con `/orbit/i` y sigue con
  sus 9 ficheros `pingo-*.webp`; (e) ningún fichero no-test de `src/` (mismo recorrido que R2)
  tiene un nombre de ruta que case con `/orbit/i` ni un contenido que case con `/orbit/i`
  salvo `src/i18n/catalog.ts`, que contiene exactamente 2 coincidencias (los dos valores de R1).
  Además, `__tests__/ui-copy-table.ts` y `__tests__/ui-language.test.ts` **no se editan**:
  `SCREEN_FILES` y `ALL_USES` conservan su recuento (delta 0).
  - Test: `src/__tests__/orbit-rename-copy.test.ts` › `#221 R3: los identificadores pingo-* no cambian aquí`.
    Verifica además el recuento por diff, no por jest: `git diff <H0>..HEAD --stat` no lista
    `src/__tests__/ui-copy-table.ts` ni `src/__tests__/ui-language.test.ts`.
  - Nace **verde** (describe el estado al que R1 no debe tocar); su valor es la prueba de
    mutación de [[design]] §Pruebas de mutación (M3a, M3b, M3c). **#225** lo enmendará al
    renombrar: queda declarado en [[design]].

- **R4** (gate **G4**, humano; commit **propio**, separado de la cadena de Codex):
  WHEN el humano firma la enmienda de la carta THE SYSTEM SHALL tener en
  `docs/ui-guidelines.md` el punto 7 como **«Voz de Orbit: guardián sereno»**, con la nota de
  la decisión del humano del 2026-10-26, y ninguna otra aparición de «Pingo» dentro del punto
  7 salvo las dos de la nota. El bloque literal (reemplaza al que hoy abre con
  `**7. Voz de Pingo: guardián sereno.**` y llega hasta antes de
  `## Checklist de autocrítica`) cambia **solo** estas partes; el resto de viñetas
  (Tono, Sin emoji, Exclamaciones, En inglés) queda idéntico:

  ```markdown
  **7. Voz de Orbit: guardián sereno.** Decidido por el humano el 2026-10-07
  (D1 de la feature #153): la mascota habla con la voz B, «guardián sereno».
  El humano decidió el 2026-10-26 (feature #221) que la mascota se llama
  **Orbit** (antes Pingo). Rige todo texto que la app pone en boca de Orbit
  (bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
  punto 6 sin más. Cada frase nueva de Orbit entra con su clave en los dos
  idiomas, como cualquier otra copy.

  Hasta la feature #225, los identificadores, los testID, las claves del
  catálogo y los assets conservan el prefijo pingo (PingoFloat,
  welcome.pingoGreeting, pingo-wave.webp), y las enmiendas fechadas de esta carta
  conservan «Pingo» como historia.
  ```

  y, en las viñetas, sustituir «Pingo» por «Orbit» en exactamente estos cinco sitios
  (misma longitud de palabra, sin reflujo de líneas):
  `- **Persona:** Orbit habla en primera persona`; `Una alerta de Orbit dice qué pasa y qué hacer.`;
  `rodean a Orbit en la bienvenida`; `animaciones continuas de` / `Orbit, y una excepción declarada`;
  `anillo de ping de` / `Orbit en la celebración`.
  La enmienda **no** añade un encabezado `## Enmienda #221` (se edita el punto 7 en su sitio,
  como hizo la enmienda #171): `grep -c '^## Enmienda' docs/ui-guidelines.md` no cambia
  (hoy 30). Las enmiendas fechadas (`## Enmienda #…`), el punto «burbuja de Pingo» de la regla
  de radios y el resto de la carta **conservan** «Pingo».
  - Los tests que leen el punto 7 con texto literal se enmiendan **en el mismo commit** que la
    carta (lista exhaustiva medida con un barrido de ventanas de 28 caracteres de todo el
    bloque contra todos los `*.test.*` de `mobile-pet-tracker/`; ninguno más solapa):
    1. `src/screens/welcome/index.test.tsx` › `#153 R2: la carta escribe la voz de Pingo` ›
       `declara el punto 7 tras el punto 6 y antes del checklist`: la constante `voice` pasa a
       `'**7. Voz de Orbit: guardián sereno.**'`.
    2. `src/screens/welcome/index.test.tsx` › `#167 R11: la carta declara los anillos de ping` ›
       `#167 R11: la viñeta de bucles de reposo nombra los anillos`: en la plantilla `idleLoops`,
       las dos apariciones de «Pingo» (`rodean a Pingo en la bienvenida` y
       `continuas de\n  Pingo, y`) pasan a «Orbit».
    3. `src/components/__tests__/celebration.test.tsx` ›
       `#171 R15: docs/ui-guidelines.md declara la enmienda de la celebración`: en la constante
       `point7`, `Pingo en la celebración` pasa a `Orbit en la celebración`; la constante
       `amendment` (cuerpo de la Enmienda #171, con «Pingo») **no** se toca.
    Los demás `it` que leen la carta quedan verdes sin tocarlos: `fija las reglas de la voz` y
    `declara la excepción de los bucles de reposo` (welcome), `#190 *` (`home-pingo-phrase.test.ts`),
    `add-pet-two-steps.test.ts` (regla de radios), `design-drift`, `consistency-classnames`,
    `ui-language`, `heroui-text-size-merge`, `motion.test.ts`.
  - Test nuevo, en el mismo commit: `src/__tests__/orbit-charter-voice.test.ts` ›
    `#221 R4: la carta nombra a Orbit en el punto 7`. Lee la carta, toma el bloque desde
    `**7. Voz de ` hasta `## Checklist de autocrítica` y exige: (i) el encabezado
    `**7. Voz de Orbit: guardián sereno.**` una vez y `**7. Voz de Pingo` cero veces;
    (ii) el párrafo de apertura y el párrafo de la nota, **literales** como arriba (copiados
    en el test, no importados); (iii) `- **Persona:** Orbit habla` y
    `Una alerta de Orbit dice qué pasa y qué hacer.`; (iv) `/\bPingo\b/g` da **exactamente 2**
    coincidencias dentro del bloque (las dos de la nota); (v) la carta no contiene
    `## Enmienda #221`; (vi) `specs/mobile-orbit-rename-copy/requirements.md` contiene
    **una** línea que casa con `/^- \[[ xX]\] Enmienda de la carta \(punto 7\)/m` (la casilla
    existe, firmada o no: tolerante, no se pone roja al firmar).
  - Quién: el bloque, las tres enmiendas y el test nuevo los **prepara el leader** a partir de
    esta sección (cambios mecánicos y literales, sin decisión pendiente) y los **firma y
    commitea el humano** con `git commit --only` sobre estas cinco rutas:
    `docs/ui-guidelines.md`, `mobile-pet-tracker/src/screens/welcome/index.test.tsx`,
    `mobile-pet-tracker/src/components/__tests__/celebration.test.tsx`,
    `mobile-pet-tracker/src/__tests__/orbit-charter-voice.test.ts` y
    `specs/mobile-orbit-rename-copy/requirements.md` (la casilla). **Codex no toca
    ninguna de las cuatro primeras para R4.** `welcome/index.test.tsx` lo tocan
    también R1 (otras líneas) y este commit (otras líneas); por eso el commit de R4 va **antes**
    del handoff y la cadena de Codex arranca desde él.

> **Fe de erratas E1 del leader (2026-10-27, medida en `c0ffc029` = `origin/dev` `6e59fb2e` + spec).**
> (d) El ancla `grep -rIil "orbit" src app.json app.config.ts package.json assets` de la
> tabla de §Contexto cuenta también los tests (`welcome/index.test.tsx` y
> `orbit-rename-copy.test.ts` llevan «Orbit» por R1) y da 3 ficheros después de R1, no 1.
> La ancla correcta excluye tests: `grep -rIil "orbit" src --exclude-dir=__tests__
> --exclude='*.test.*' app.json app.config.ts package.json assets` y da solo
> `src/i18n/catalog.ts` (antes 0). Es la misma exclusión que usa R3(e).
> (a) Orden de R4: el último párrafo de R4 manda que el commit de R4 vaya **antes** del
> handoff. Se invierte: la cadena de Codex (R1 a R3) corre **primero** y el commit de
> R4 del humano va **después**, antes de la PR. R4 solo toca `welcome/index.test.tsx` en
> otras líneas (`voice` y `idleLoops`, no los 7 literales de R1), así que no hay
> conflicto. El leader deja el parche de R4 preparado fuera de la cadena
> (`progress/orbit-r4-prep.patch`) y el humano lo commitea con `git commit --only`.
> G4 no se salta: sin esa firma la feature no pasa a `done` ni se abre la PR.
> (b) La fila R4 de [[traceability]] la rellena el leader tras el commit del humano;
> Codex la deja en `pendiente (G4, humano)` y esa es la única fila que puede quedar así.
> (c) Anclas del §Contexto recomputadas en `c0ffc029`: las cifras coinciden con la tabla
> (`Pingo` en `catalog.ts` 2, `Hola, soy Pingo.` 5, `Hi, I\'m Pingo.` 4, `pingo-*` 9).

## Fuera de alcance

- Renombrar identificadores, `testID`, claves de catálogo (`welcome.pingoGreeting`,
  `login.pingoGreeting`, `addPet.pingoGreeting`, `home.pingoPhrase*`), ficheros
  (`pingo-float.tsx`, `pingo-stage.ts`, `pingo-phrase.ts`), constantes
  (`MOTION_PINGO_*`) y los 9 assets `pingo-*.webp`: lo hace #225.
- La pose nueva de Orbit caminando y su gate de arte (G6): #225.
- Ampliar el saludo (la frase larga que aún guarda `specs/mobile-ui-language/design.md`
  no coincide con el catálogo desde #205; es preexistente y no es del renombre). El saludo
  se queda corto: «Hola, soy Orbit.» / «Hi, I'm Orbit.».
- Reescribir historia: `specs/*`, `progress/*`, `STATUS.md` (entradas de cierre),
  `feature_list.json` (nombres de feature como `mobile-welcome-pingo`), las enmiendas
  fechadas de la carta y `specs/mobile-ui-language/design.md` (que
  `welcome/index.test.tsx` y otros tests leen con encabezados «Pingo»).
- `docs/verification.md` (paso 5 del plan Free dice «el tab Map muestra a Pingo…»; lo pinea
  `empty-state.test.tsx`) y `docs/demo-runbook.md`: son guiones de humo, no copy de la app;
  los revisa #225 junto con el resto de documentación viva.
- Títulos de `describe` e `it` de los tests que dicen «Pingo» (≈ 35 ficheros, ver
  [[design]] §Inventario): son identificadores de trazabilidad firmada.
- La memoria `mascota-pingo-voz-b` (fuera del repo): la actualiza el leader al mergear.
- Cualquier cambio de `app.json`/`app.config.ts` (el nombre de la app es `Pet Tracker`; la
  mascota no figura en la configuración).

## Aprobación

- [x] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-10-26; fecha: 2026-10-26) ← gate obligatorio antes de implementar R1–R3
- [ ] Enmienda de la carta (punto 7) aprobada por humano (fecha: ____)
  Gate **G4**, no delegado (`progress/plan_ui-2026-10-26.md` §5). Cubre solo R4: el bloque
  del punto 7 de `docs/ui-guidelines.md` y las tres enmiendas de test de la lista. La firma
  es el commit del humano sobre esas rutas. La checklist de firma delegada **no** la cubre; el
  `done` de la feature espera a esta casilla, el commit de R4 tiene que estar en la rama antes de la
  PR, y el `reviewer` verifica `[xX]` y que `git log` muestre un único commit que toque
  `docs/ui-guidelines.md`.
- [ ] Smoke de la bienvenida en el dev build Android (cierre, no gate de implementación)
  Va en el lote `progress/smoke_ui.md` (plan §5, G2): con idioma español la burbuja de la
  bienvenida dice «Hola, soy Orbit.» y con inglés «Hi, I'm Orbit.»; la burbuja no corta el texto.
