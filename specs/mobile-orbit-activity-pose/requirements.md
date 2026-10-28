---
feature: "mobile-orbit-activity-pose"
status: approved     # draft | approved
tags: [mobile, ui, mascota, orbit, spec]
---

# Requisitos — [[mobile-orbit-activity-pose]] (#225)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Decisiones técnicas en [[design]]; orden de commits en [[tasks]].
>
> **Origen.** Entrada 225 de `progress/plan_ui-2026-10-26.md` §2, con los puntos
> de firma de su §4. Investigación en `progress/explore_ui-mascota-orbit-2026-10-26.md`.
> Ojo: sus números de línea caducaron y esta spec ancla por contenido.
> Diseño aprobado en `progress/design_ola0-ui-2026-10-27.md`, decisión 8: «La pose
> solo en la burbuja de Inicio y solo si la frase es de actividad; se anima igual
> (flota). Pose base para el resto. Texto visible siempre «Orbit»».
>
> **Gates humanos ya cerrados.** El humano aprobó G1 (artboards y copy) y G6 (PNG
> de Orbit) el 2026-10-27T04:42Z con «apruebo G1 y G6, arranca con las specs». El
> plan cita el canvas v153 y el leader, el v140; los dos artboards congelados en
> `canvas/` son las versiones que vio el humano.
>
> **Artboards congelados** (fuente de R1, R5 y R7):
> - `specs/mobile-orbit-activity-pose/canvas/InicioBurbujaOrbitWalk.dc.html`: la
>   burbuja de Inicio con la pose andando.
> - `specs/mobile-orbit-activity-pose/canvas/OrbitHojaComparativa.dc.html`: la
>   pose nueva a 224 px y a 56 dp en claro y oscuro, junto a la pose base.
>
> **Maestro de la pose:** `specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png`
> (PNG RGBA de 1024², 555 337 B, sha256 `f8763da1…29716`) y su prompt
> `mascot-11-walk.prompt.txt` (sha256 `1b1f722a…d07ed`).
>
> **Dependencia: #221 `mobile-orbit-rename-copy`.** #221 cambia los valores
> visibles «Pingo» por «Orbit» y deja los identificadores `pingo*`; #225 los
> renombra. #225 va **segundo**: se implementa sobre una rama que ya contiene
> #221 mergeada en `dev`. Antes del handoff se ejecuta §Re-verificar al mergear #221.

## Glosario

- **Código de producción**: todo fichero bajo `mobile-pet-tracker/src/` con
  extensión `ts|tsx|js|jsx|json|css` que no esté bajo un directorio `__tests__/`
  y cuyo nombre no contenga `.test.`. Es el mismo criterio que la función
  `sourceFiles()` de `src/__tests__/orbit-rename-copy.test.ts` (#221).
- **Código de test**: todo fichero `ts|tsx` bajo `mobile-pet-tracker/src/` que no
  sea código de producción, incluido `src/__tests__/ui-copy-table.ts`.
- **Frase de actividad**: la frase de la burbuja de Inicio cuyo `labelKey` es
  `home.orbitPhraseWalkMeals` o `home.orbitPhraseWalk`, es decir, las ramas de
  `homeOrbitPhrase` con `distanceM >= 100`.

## Mapa de nombres (alcance A)

Reemplazo que conserva la caja: `pingo` pasa a `orbit`, `Pingo` a `Orbit` y
`PINGO` a `ORBIT`. Ninguna otra caja aparece en el árbol.

| Tipo | Antes | Después |
|---|---|---|
| Imágenes (9) | `assets/images/pingo-{celebrate,clipboard,collar,food,health,sleep,talk,wave,wave-blink}.webp` | `assets/images/orbit-<mismo sufijo>.webp`, con los mismos bytes (`git mv`) |
| Módulo | `src/components/pingo-float.tsx` (`PingoFloat`) | `src/components/orbit-float.tsx` (`OrbitFloat`) |
| Módulo | `src/theme/pingo-stage.ts` (`PINGO_STAGE_SHADOW_COLOR`, `PINGO_STAGE_PAW_OPACITY`) | `src/theme/orbit-stage.ts` (`ORBIT_STAGE_SHADOW_COLOR`, `ORBIT_STAGE_PAW_OPACITY`) |
| Módulo | `src/screens/home/pingo-phrase.ts` (`homePingoPhrase`) | `src/screens/home/orbit-phrase.ts` (`homeOrbitPhrase`) |
| Tokens de movimiento | `MOTION_PINGO_FLOAT_TIMING`, `MOTION_PINGO_FLOAT_OFFSET_Y` en `src/theme/motion.ts` | `MOTION_ORBIT_FLOAT_TIMING`, `MOTION_ORBIT_FLOAT_OFFSET_Y` (mismos valores) |
| Claves de catálogo (7) | `welcome.pingoGreeting`, `login.pingoGreeting`, `addPet.pingoGreeting`, `home.pingoPhraseWalkMeals`, `home.pingoPhraseWalk`, `home.pingoPhraseMeals`, `home.pingoPhraseCalm` | `welcome.orbitGreeting`, `login.orbitGreeting`, `addPet.orbitGreeting`, `home.orbitPhraseWalkMeals`, `home.orbitPhraseWalk`, `home.orbitPhraseMeals`, `home.orbitPhraseCalm` (mismos valores en/es) |
| testIDs | todo `testID` con `pingo`, p. ej. `home-entrance-pingo`, `home-pingo-phrase`, `home-pingo-bubble`, `home-pingo-text`, `home-pingo-float`, `home-pingo`, `welcome-pingo-float`, `${testID}-pingo` | el mismo con `orbit` |
| Locales y comentarios | `pingoStyle`, `pingoScale`, `pingoTranslateY`, `pingoPhrase`, `pingoOpacity`, `pingoBlink`, `PINGO_SOURCE`, `PAIRING_PINGO_SOURCE` y todo comentario | el mismo con `orbit` |
| Tests colocados | `src/components/__tests__/pingo-float.test.tsx`, `src/screens/home/pingo-phrase.test.ts` | `src/components/__tests__/orbit-float.test.tsx`, `src/screens/home/orbit-phrase.test.ts` |

**Se conservan:**
- `EmptyStatePose`: su nombre no lleva `pingo`; solo cambian las rutas de su mapa `POSES`.
- `src/__tests__/home-pingo-phrase.test.ts`: se llama como su feature (#190).
- Los directorios `specs/mobile-*-pingo*` y todo `docs/`, `specs/` y `progress/` histórico.

Valores de las 7 claves, iguales antes y después (los de `welcome` son los de #221):

| Clave nueva | en | es |
|---|---|---|
| `welcome.orbitGreeting` | `Hi, I'm Orbit.` | `Hola, soy Orbit.` |
| `login.orbitGreeting` | `Good to see you again.` | `Qué bueno verte de nuevo.` |
| `addPet.orbitGreeting` | `Hi. Tell me about your new companion.` | `¡Hola! Cuéntame de tu nuevo compañero.` |
| `home.orbitPhraseWalkMeals` | `{{petName}} has walked {{km}} today and has had {{served}} of {{total}} meals.` | `{{petName}} ya caminó {{km}} hoy y lleva {{served}} de {{total}} comidas.` |
| `home.orbitPhraseWalk` | `{{petName}} has walked {{km}} today.` | `{{petName}} ya caminó {{km}} hoy.` |
| `home.orbitPhraseMeals` | `{{petName}} has had {{served}} of {{total}} meals today.` | `{{petName}} lleva {{served}} de {{total}} comidas hoy.` |
| `home.orbitPhraseCalm` | `I'm keeping an eye on {{petName}}.` | `Estoy pendiente de {{petName}}.` |

## Requisitos funcionales

### Copy

- **R1**: WHEN la burbuja de Inicio muestra a Orbit en la pose andando, THE SYSTEM
  SHALL anunciar la imagen con la clave `home.orbitWalkLabel`. Sus valores son en
  `Orbit walking` y es `Orbit caminando`. Es el `alt` aprobado en G1: `alt="Orbit caminando"`
  aparece en `canvas/InicioBurbujaOrbitWalk.dc.html` y `canvas/OrbitHojaComparativa.dc.html`.
  La clave queda registrada en tres sitios:
  - en `src/i18n/catalog.ts`, en los dos idiomas, justo después de `home.orbitPhraseCalm`;
  - en `src/__tests__/ui-copy-table.ts`, como fila `{ file: 'src/screens/home/index.tsx', key: 'home.orbitWalkLabel' }`
    al final del bloque `R3_HOME`;
  - en `specs/mobile-ui-language/design.md`, como fila
    `` | — | `home.orbitWalkLabel` | `Orbit walking` | `Orbit caminando` | ← añadida por #225 (R1) | ``
    de la sección de #225 (ver R3).

  Test: `src/__tests__/orbit-activity-pose.test.ts`, «`#225 R1: declara home.orbitWalkLabel en los dos idiomas y su registro`».
  Enmienda dos candados de cuenta (cifra = base + 1), detallados en §Candados enmendados:
  - en `language-provider.test.tsx`, el largo del catálogo;
  - en `ui-language.test.ts`, el largo de `R3_HOME`.

  Ninguna frase de la burbuja cambia. La del artboard («Rocky ya caminó 2.3 km hoy.
  Le falta la comida de las 18:00.») es ilustrativa (§Decisiones D2).

### Renombrado pingo a orbit (alcance A)

- **R2**: THE SYSTEM SHALL empaquetar las nueve poses existentes como
  `assets/images/orbit-<pose>.webp`, con los nombres del §Mapa de nombres.
  Ningún fichero de `assets/images/` casa `/pingo/i`. Cada
  `require('…/assets/images/<nombre>.webp')` del código de producción y del
  código de test resuelve a un fichero que existe.

  Test: `src/__tests__/orbit-rename.test.ts`, «`#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve`».

- **R3**: THE SYSTEM SHALL contener cero coincidencias de `/pingo/i` en el
  contenido y en la ruta relativa de todo fichero de código de producción. Además
  exporta los nombres nuevos del §Mapa de nombres y deja de exportar los viejos.
  En particular:
  - cada módulo nuevo existe y exporta su símbolo nuevo, y los ficheros viejos no existen;
  - `src/theme/motion.ts` exporta `MOTION_ORBIT_FLOAT_*` con los mismos valores y no exporta `MOTION_PINGO_*`;
  - las 7 claves nuevas están en `en` y `es` con los valores de la tabla, y las 7 viejas no están;
  - `ui-copy-table.ts` tiene una fila por clave nueva en el mismo `file` que tenía la vieja, ninguna con `pingo`;
    las 4 de la frase usan `file: 'src/screens/home/orbit-phrase.ts'`;
  - `specs/mobile-ui-language/design.md` gana la sección `### §2.<N> — Añadidos por #225 — Orbit renombrado y su pose de actividad`,
    con `<N>` = número de la última sección `§2.*` + 1 el día del commit. Lleva una fila por clave renombrada:
    `` | — | `<clave nueva>` | `<en>` | `<es>` | ← renombrada desde `<clave vieja>` por #225 (R3) | ``.

  Tests en `src/__tests__/orbit-rename.test.ts`:
  - «`#225 R3: el código de producción no nombra a Pingo ni en contenido ni en rutas`»
  - «`#225 R3: los módulos renombrados exportan los nombres nuevos y no los viejos`»
  - «`#225 R3: el catálogo renombra las siete claves con los mismos valores`»
  - «`#225 R3: el inventario de copy y la tabla de idioma registran las claves nuevas`»

- **R4**: THE SYSTEM SHALL limitar `/pingo/i` en el código de test a tres sitios:
  - títulos de `describe`/`it`/`test`, incluidas sus variantes `.each`, `.only` y `.skip`, que son ids estables de trazabilidad;
  - comentarios;
  - las líneas de [[design]] §Lista de excepciones de R4, que fijan texto de
    documentos que #225 no reescribe. La lista tiene una variante por caso: A si
    #221 R4 (la enmienda de la carta) ya está en la rama y B si no. El caso lo
    decide el ancla de [[design]] §4, medida en §Re-verificar al mergear #221.

  La regla de escaneo exacta está en [[design]] §Regla de escaneo de R4.
  Quedan fuera del escaneo `src/__tests__/orbit-rename.test.ts` y
  `src/__tests__/orbit-activity-pose.test.ts`: nombran lo viejo a propósito.
  Cada entrada de la lista de excepciones casa exactamente su número de líneas
  declarado. Una excepción que sobra o falta es rojo.

  Tests en `src/__tests__/orbit-rename.test.ts`:
  - «`#225 R4: el código de test solo nombra a Pingo en títulos, comentarios y pins de documento`»
  - «`#225 R4: cada excepción casa exactamente las líneas declaradas`»

### Pose nueva (alcance B)

- **R5**: THE SYSTEM SHALL incluir `mobile-pet-tracker/assets/images/orbit-walk.webp`,
  convertido desde el maestro con el comando de [[design]] §Conversión. El fichero:
  - empieza por `RIFF` y lleva `WEBP` en los bytes 8 a 12 y `VP8X` en los bytes 12 a 16;
  - tiene el bit de alfa (`bytes[20] & 0x10`) encendido y el de animación (`bytes[20] & 0x02`) apagado;
  - mide 1024 × 1024 (`readUIntLE(24, 3) + 1` y `readUIntLE(27, 3) + 1`);
  - pesa como mucho 100000 B.

  El maestro `specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png` y
  `mascot-11-walk.prompt.txt` siguen presentes. El PNG lleva su firma y un IHDR de 1024 × 1024.
  Cada lectura va precedida de `expect(existsSync(ruta)).toBe(true)`.

  Tests en `src/__tests__/orbit-activity-pose.test.ts`:
  - «`#225 R5: orbit-walk.webp es WebP VP8X con alfa, estático, 1024 × 1024 y como mucho 100000 bytes`»
  - «`#225 R5: el maestro PNG y su prompt están congelados en la spec`»

  Enmienda el inventario de poses de la bienvenida, que pasa de 9 a 10 (ver
  §Candados enmendados).

- **R6**: THE SYSTEM SHALL exportar desde `src/screens/home/orbit-phrase.ts` la
  función pura `homeOrbitPose(labelKey: TranslationKey): 'walk' | 'talk'`. Las
  ramas son:
  - `home.orbitPhraseWalkMeals` da `'walk'`;
  - `home.orbitPhraseWalk` da `'walk'`;
  - `home.orbitPhraseMeals` da `'talk'`;
  - `home.orbitPhraseCalm` da `'talk'`;
  - IF `labelKey` es cualquier otra clave THEN THE SYSTEM SHALL devolver `'talk'`.

  `homeOrbitPhrase` conserva su firma y su resultado `{ labelKey, params }`.

  Tests en `src/screens/home/orbit-phrase.test.ts`, `describe('#225 R6: homeOrbitPose elige la pose por la frase')`:
  - `it.each` «`%s → %s`», con una fila por rama: las cuatro claves;
  - «`cualquier otra clave da talk`», con `home.orbitWalkLabel` y `welcome.orbitGreeting`;
  - `it.each` «`distancia %s, comidas %j → %s`», que compone `homeOrbitPose(homeOrbitPhrase(…).labelKey)` con las filas
    `[100, null, 'walk']`, `[99, { served: 1, total: 2 }, 'talk']`, `[null, null, 'talk']`,
    `[2350, { served: 0, total: 0 }, 'walk']`, `[2350, { served: 1, total: 2 }, 'walk']` y `[99, null, 'talk']`.

- **R7**: WHILE la frase de la burbuja de Inicio es de actividad, THE SYSTEM SHALL
  pintar `home-orbit` con estas propiedades:
  - es el único hijo directo de `home-orbit-float`, el `OrbitFloat` que ya flota;
  - su `source` es `assets/images/orbit-walk.webp`;
  - su `style` es exactamente `{ width: 56, height: 56 }`. Son los 56 px de
    `canvas/InicioBurbujaOrbitWalk.dc.html`
    (`alt="Orbit caminando" style="width: 56px; height: auto; flex: none; animation: float 3s ease-in-out infinite"`)
    y los «56 dp» de `canvas/OrbitHojaComparativa.dc.html`;
  - no lleva `className`: en `expo-image`, `className` es inerte y dejaría la imagen a 0 × 0;
  - lleva `accessible` verdadero y `accessibilityLabel` = `t('home.orbitWalkLabel')`.

  WHILE la frase es `home.orbitPhraseMeals` o `home.orbitPhraseCalm`, THE SYSTEM
  SHALL pintar en el mismo nodo `assets/images/orbit-talk.webp`, con el mismo `style`,
  sin `className`, sin `accessibilityLabel` y con `accessible` distinto de `true`.
  Es decir, la pose base decorativa de #190 R4.

  Tests en `src/screens/home/index.test.tsx`, `describe('#225 R7: Orbit camina cuando la frase es de actividad')`.
  Cada `it` aserta primero el texto de `home-orbit-text` y después la pose:
  - «`pinta orbit-walk a 56 dp con su etiqueta cuando la frase es de distancia`»: rama `Walk`, texto `Luna ya caminó 2.4 km hoy.`;
  - «`pinta orbit-walk también cuando la frase suma comidas`»: rama `WalkMeals`, texto `Luna ya caminó 2.4 km hoy y lleva 1 de 2 comidas.`;
  - «`vuelve a la pose base sin etiqueta cuando la frase es de comidas`»: rama `Meals`, texto `Luna lleva 1 de 2 comidas hoy.`;
  - «`vuelve a la pose base sin etiqueta con la frase de respaldo`»: rama `Calm`, texto `Estoy pendiente de Luna.`.

  Enmienda #190 R4 (ver §Candados enmendados).

### Cierre de H3 de #190

- **R8**: THE SYSTEM SHALL dar por cerrada la hipótesis H3 de `specs/mobile-home-pingo-phrase/requirements.md`
  («Placeholder `assets/images/pingo-talk.webp` … Otra pose: solo cambia el `require` de R4 y su test»):
  - el texto `(H3 pendiente: pose placeholder.)` desaparece del fichero;
  - R4 lleva en su lugar ``(H3 cerrada por #225 R8: la pose de actividad es `orbit-walk.webp`.)``;
  - la fila H3 de la tabla de hipótesis gana al final ` Cerrada por #225 (R8).`;
  - la casilla `- [x] H3 …` de su §Aprobación no se toca.

  No se borra ningún asset: `orbit-talk.webp` sigue en uso en la rama `talk` de
  Inicio y en `EmptyState` (`pose="talk"`).

  Test: `src/__tests__/orbit-activity-pose.test.ts`, «`#225 R8: la hipótesis H3 de #190 queda cerrada`».

### Enmienda de la carta (gate G4, humano)

- **R9** (gate **G4**, humano, no delegado). Va en un commit **propio**, fuera de la
  cadena de Codex: lo aplica el leader después de que el humano firme la casilla G4
  de §Aprobación, igual que #221 R4.

  > **Fe de erratas E1 del firmante (2026-10-28, tras la casilla G4 en `5c69aafe`).**
  > R9 toca dos ficheros de test de `mobile-pet-tracker/`, y `CLAUDE.md` prohíbe al
  > leader editar código de la aplicación. Por eso R9 no lo teclea el leader: lo
  > teclea el implementador como **C13** de [[tasks]], en un commit propio que va
  > después de C12. El contenido de R9 no cambia, y el commit sigue siendo solo
  > de R9.

  WHEN el humano firma la casilla G4 THE SYSTEM SHALL dejar el cuerpo de
  `docs/ui-guidelines.md` sin ninguna línea que nombre un identificador con
  `pingo`. El cuerpo es todo lo que no está bajo un encabezado `## Enmienda #NNN`.
  Cuentan como identificador `pingo`, `PINGO` y `Pingo` seguido de una letra o de
  `_` (`PingoFloat`). El nombre suelto «Pingo» no cuenta: es de #221 R4.

  Medición, desde la raíz del repo. Imprime cada línea del cuerpo que nombra un
  identificador:

```bash
python3 -I - docs/ui-guidelines.md <<'PY'
import re, sys
sec = ''
for i, l in enumerate(open(sys.argv[1], encoding='utf8').read().split('\n'), 1):
    if l.startswith('## '): sec = l
    if not re.match(r'## Enmienda #\d', sec) and re.search(r'pingo|PINGO|Pingo[A-Za-z_]', l): print(i, l)
PY
```

  **Caso A: #221 R4 aplicada.** El comando imprime dos líneas, las dos de la nota
  de #221 R4 en el punto 7:
  - `catálogo y los assets conservan el prefijo pingo (PingoFloat,`
  - `welcome.pingoGreeting, pingo-wave.webp), y las enmiendas fechadas de esta carta`

  R9 cambia el párrafo entero de esa nota. El resto del punto 7 queda igual.

  Antes:

```markdown
Hasta la feature #225, los identificadores, los testID, las claves del
catálogo y los assets conservan el prefijo pingo (PingoFloat,
welcome.pingoGreeting, pingo-wave.webp), y las enmiendas fechadas de esta carta
conservan «Pingo» como historia.
```

  Después:

```markdown
Desde la feature #225, los identificadores, los testID, las claves del
catálogo y los assets llevan el prefijo orbit (OrbitFloat,
welcome.orbitGreeting, orbit-wave.webp), y las enmiendas fechadas de esta carta
conservan «Pingo» y los nombres viejos como historia; la equivalencia está en
el §Mapa de nombres de specs/mobile-orbit-activity-pose/requirements.md.
```

  Después de R9 el comando no imprime nada. El bloque del punto 7 sigue con dos
  `\bPingo\b`: `(antes Pingo)` y `«Pingo»`.

  **Caso B: #221 R4 sin aplicar.** El comando no imprime nada: el cuerpo no nombra
  ningún identificador renombrado y no hay frase que cambiar. La única frase que lo
  haría es la nota que añade #221 R4. Por eso R9 se aplica siempre encima de #221 R4:
  - en caso B, el leader espera a que #221 R4 esté en `dev`;
  - después aplica el texto del caso A.

  La firma de G4 vale para los dos órdenes.

  Lo demás de la carta no cambia:
  - las enmiendas fechadas (`#152`, `#171`, `#172`, `#190`, `#205` y el resto)
    conservan `PingoFloat`, `MOTION_PINGO_*`, `pingo-float.tsx` y demás nombres
    viejos como historia, y la nota nueva remite al §Mapa de nombres;
  - la regla de radios conserva «la burbuja de Pingo», que es un nombre y no un
    identificador. La fija `add-pet-two-steps.test.ts`;
  - R9 no añade encabezado propio: `grep -c '^## Enmienda' docs/ui-guidelines.md`
    no cambia (31 el 2026-10-28).

  **Pins que cambian en el mismo commit que la carta.** La lista sale de un barrido
  de ventanas de 28 caracteres del párrafo «Antes» contra todo `*.test.*` de
  `mobile-pet-tracker/`: solo lo toca `orbit-charter-voice.test.ts`. A eso se suma
  la lista de R4 de esta feature.
  1. `src/__tests__/orbit-charter-voice.test.ts` › `#221 R4: la carta nombra a Orbit en el punto 7`:
     - la constante `note` pasa al párrafo «Después»;
     - el `it` gana el sufijo `(enmendado por #225 R9)`;
     - la aserción (iv), dos `\bPingo\b` en el bloque, no cambia.

     Mutación: en la carta, devolver `Desde la feature #225` a `Hasta la feature #225`.
     Entonces `block.split(note).length - 1` da 0 y el `it` cae.
  2. `src/__tests__/orbit-rename.test.ts` › `#225 R4: cada excepción casa exactamente las líneas declaradas`:
     - se borran de la lista las dos filas marcadas «R9 la borra» en [[design]] §4;
     - el `it` gana el sufijo `(enmendado por #225 R9)`;
     - en el mismo commit se borran esas dos filas de [[design]] §4.

     Mutación: dejar una de las dos filas. Casa 0 líneas en vez de 1 y el `it` cae.

  El primer `it` de R4 sigue verde sin tocarlo. Del párrafo nuevo, solo la línea
  `conservan «Pingo» y los nombres viejos como historia; …` nombra a Pingo, y la
  cubre la fila `conservan «Pingo»`, que sobrevive a R9. Medido el 2026-10-28
  aplicando R9 sobre el caso A: el comando de §Re-verificar paso 3 da 21 entradas,
  0 descuadradas y 0 pins.

  #225 puede mergearse en `dev` sin R9. Queda `spec_ready`, no `done`, hasta que
  R9 y el smoke G2 estén cerrados.

  Test: `src/__tests__/orbit-charter-voice.test.ts`, «`#221 R4: la carta nombra a Orbit en el punto 7 (enmendado por #225 R9)`».

### Requisitos no funcionales

- **Módulo nativo**: ninguno. `package.json` y `bun.lock` no cambian.
  El cambio es JS y assets que empaqueta Metro, así que no hace falta rebuild del
  dev build (G3 no aplica). `uvx --with pillow` es una herramienta de conversión
  de un solo uso, no una dependencia.
- **Carta de UI**: la cadena de Codex no toca `docs/ui-guidelines.md` ni
  `docs/conventions.md`. La carta solo cambia con R9, en el commit propio del
  leader tras G4. Las enmiendas fechadas que citan `PingoFloat`, `pingo-float.tsx`
  o `MOTION_PINGO_*` se leen con el §Mapa de nombres; ver §Decisiones D3.
- **C8 grep-clean**: `src/screens/home/index.tsx` y `src/screens/home/orbit-phrase.ts`
  siguen bajo el candado de #190 R12 (`src/__tests__/home-pingo-phrase.test.ts`),
  cuyo `it.each` se reapunta a `orbit-phrase.ts`. No se añade ningún color, clase arbitraria ni `StyleSheet`.

## Candados enmendados

El título de cada `it` enmendado se conserva literal y gana el sufijo
`(enmendado por #225 R<n>)`. Se nombran por ruta e `it`.

| Fichero | `it` (literal actual) | Qué cambia | Commit |
|---|---|---|---|
| `src/__tests__/orbit-rename-copy.test.ts` (#221) | `#221 R3: los identificadores pingo-* no cambian aquí` | Se borran el bloque `images` (las dos aserciones sobre `assets/images`) y el bucle `for (const path of sourceFiles())`. Sufijo `(enmendado por #225 R2)`. | C2 |
| ídem | ídem | Las anclas pasan a `'welcome.orbitGreeting':` ×2, `t('welcome.orbitGreeting')`, `testID="welcome-orbit-float"` y la fila `{ file: 'src/screens/welcome/index.tsx', key: 'welcome.orbitGreeting' }`. `testID="welcome-bubble-text"` se queda. Se borra el filtro «ninguna clave casa /orbit/i». Sufijo `(enmendado por #225 R3)`. | C4 |
| ídem | `#221 R1: el catálogo dice Orbit` | Las dos líneas esperadas usan `'welcome.orbitGreeting':`. Sufijo `(enmendado por #225 R3)`. | C4 |
| `src/screens/welcome/index.test.tsx` | `no mete otras poses de Pingo` | En C2, la regex usa `orbit` en lugar de `pingo` y la lista lleva los nombres `orbit-*`; sufijo `(enmendado por #225 R2)`. En C6, lista de 10 en este orden: `orbit-celebrate`, `orbit-clipboard`, `orbit-collar`, `orbit-food`, `orbit-health`, `orbit-sleep`, `orbit-talk`, `orbit-walk`, `orbit-wave-blink`, `orbit-wave` (`.webp`; orden comprobado con `node` y `.sort()`); sufijo `(enmendado por #225 R5)`. | C2, C6 |
| `src/screens/home/index.test.tsx` | `pinta pingo-talk como único hijo directo del envoltorio y sin etiqueta (enmendado por #195 R16)` | Antes de `renderHome()` fija la rama `Calm` con `mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' })`. Las aserciones de talk se quedan. Sufijo `(enmendado por #225 R7)`. | C9 |
| `src/providers/__tests__/language-provider.test.tsx` | `#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (…)` | `+ 1, // #225 R1` tras el último término (hoy `+ 16, // #215 R19`); la coma pasa a la nueva última línea. Sufijo `(enmendado por #225 R1)`. | C9 |
| ídem | `#167 R5: declara login.pingoGreeting en los dos idiomas y su registro` | `key` se parte en dos: `const key = 'login.orbitGreeting';` para el catálogo y `const designKey = 'login.pingoGreeting';` para la regex de la fila histórica de `design.md`. Sufijo `(enmendado por #225 R3)`. | C4 |
| `src/__tests__/ui-language.test.ts` | `#71 R11: registra el copy de accesos rápidos sobre los deltas heredados (enmendado por #198 R15)` | `toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2 + 4 + 1 + 1)` con comentario `// +1 #225 R1`. Sufijo `(enmendado por #225 R1)`. | C9 |
| `src/__tests__/orbit-charter-voice.test.ts` (#221 R4) | `#221 R4: la carta nombra a Orbit en el punto 7` | La constante `note` pasa al párrafo «Después» de R9. Sufijo `(enmendado por #225 R9)`. | R9 (leader, tras G4) |
| `src/__tests__/orbit-rename.test.ts` | `#225 R4: cada excepción casa exactamente las líneas declaradas` | Se borran las dos filas «R9 la borra» de [[design]] §4. Sufijo `(enmendado por #225 R9)`. | R9 (leader, tras G4) |

Los demás `it` que nombran a Pingo en código cambian solo por el reemplazo
mecánico del §Mapa de nombres: rutas de asset, testIDs, `jest.mock('…/pingo-float')`,
símbolos y claves. No cambian lo que asertan y no llevan sufijo. Esto incluye los
negativos vacuos, como `queryByTestId('reset-pingo-float')).toBeNull()`
o `not.toContain('pingo-wave.webp')`: tras el reemplazo vuelven a mirar un nombre
que existe. También incluye la lista ordenada de exports de `src/theme/__tests__/motion.test.ts`:
`MOTION_ORBIT_*` queda en el mismo índice que `MOTION_PINGO_*`, entre
`MOTION_HERO_PING_MS` y `MOTION_PING_FROM`, comprobado con `node`.

`SCREEN_FILES` (en `ui-language.test.ts`) no cambia de cuenta: `orbit-phrase.ts`
sustituye 1 a 1 a `pingo-phrase.ts` e `index.tsx` ya estaba. La línea de comentario
`+ 1 // #190 R13: screens/home/pingo-phrase.ts (enmendado por #190 R13)` se queda.

## Fuera de alcance

- Renombrar los directorios `specs/mobile-*-pingo*` o reescribir `docs/`, `specs/`
  y `progress/` históricos. Solo se toca la fila H3 de #190 (R8) y la sección
  nueva de `mobile-ui-language/design.md` (R1, R3).
- Reescribir las enmiendas fechadas de `docs/ui-guidelines.md` o el resto de su
  cuerpo. R9 solo cambia la nota de identificadores del punto 7.
- Usar la pose andando fuera de la burbuja de Inicio. Bienvenida, cuenta, estados
  vacíos, emparejamiento, nutrición y celebración conservan su pose (decisión 8 de G1).
- Cambiar el copy de las frases o añadir la hora de la próxima comida.
- Animación nueva: la pose andando usa el mismo `OrbitFloat`.
- El texto visible «Orbit», que es de #221.

## Decisiones

Cerradas por el autor de la spec; el firmante las valida con la checklist.

- **D1. Etiqueta solo en la pose andando.** La pose andando lleva `accessibilityLabel`
  «Orbit caminando», el `alt` aprobado en G1. La EN «Orbit walking» es su traducción
  directa. La pose base sigue decorativa como en #190 R4. Motivo: el artboard da
  alt a la pose nueva y #190 R4 fija la base sin etiqueta. Alternativa descartada:
  andando también decorativa, sin clave nueva, lo que contradice el alt de G1.
- **D2. Las frases no cambian.** Motivo: la frase del artboard es ilustrativa y la
  hora de la comida exige datos que Inicio no recibe.
- **D3. La carta solo cambia con R9, y R9 es del humano.** #225 renombra
  identificadores que la carta presenta como vigentes en la nota del punto 7 que
  añade #221 R4. Eso es una enmienda de la carta: gate G4, no delegado, con casilla
  propia en §Aprobación.
  - R9 cambia solo esa nota. Las enmiendas fechadas y las secciones `§2.*` de
    `design.md` conservan los nombres viejos como historia.
  - Los pins de test que copian ese texto histórico conservan sus literales y van
    a la lista de excepciones de R4. El mapa vive en esta spec.
  - R9 va fuera de la cadena de Codex, en un commit del leader tras la firma.

  Motivo: Codex no puede escribir una enmienda de la carta antes de que el humano
  la firme, y #225 no debe esperar a esa firma para mergearse en `dev`.
  Alternativa descartada: dejarlo como deuda sin casilla, porque la nota quedaría
  falsa sin que nadie tuviera que firmar su arreglo.
- **D4. `homeOrbitPose` es una función aparte**, no un campo nuevo del resultado de
  `homeOrbitPhrase`. Motivo: la tabla de 14 filas de #190 R8 aserta
  `toEqual({ labelKey, params })` y seguiría verde sin enmienda.
- **D5. Se renombran los tests colocados** con su módulo (`orbit-float.test.tsx`,
  `orbit-phrase.test.ts`). `src/__tests__/home-pingo-phrase.test.ts` conserva su
  nombre, que es el de la feature #190, y su contenido de código se renombra.
- **D6. `EmptyStatePose` conserva su nombre**, porque no lleva `pingo`.
- **D7. Títulos intactos.** Los títulos de `it`/`describe` con Pingo no se renombran:
  son ids de trazabilidad de otras specs.
- **D8. #225 va detrás de #221.** Dueño de cada fichero compartido:
  - `catalog.ts`: #221 es dueño de los valores y #225 de las claves;
  - `welcome/index.test.tsx` y `orbit-rename-copy.test.ts`: #225 enmienda sobre el estado mergeado de #221;
  - `docs/ui-guidelines.md`: solo #221.
- **D9. Conversión con Pillow** (`quality=80, method=6`): da 65 182 B con cabecera
  `RIFF…WEBPVP8X`, medido el 2026-10-28. Otra versión de Pillow puede dar otros
  bytes, y el candado R5 tolera eso, porque no fija los bytes sino el formato.

## Re-verificar al mergear #221

Antes del handoff, trabaja en `/home/claude/sites/Pet-Tracker-wt-225` con
`origin/dev` (que ya contiene #221) mergeado en la rama. Ejecuta los tres pasos
desde la raíz del repo. Si alguna cifra no cuadra, para y enmienda esta spec antes
de lanzar Codex. #221 puede seguir moviéndose hasta su merge, por eso todo se mide
sobre la rama ya mergeada y no sobre esta spec.

Las cifras se midieron el 2026-10-28 sobre `wt-221`:
- caso B: HEAD `4a929323`;
- caso A: el mismo HEAD más #221 R4 sin commitear.

**Paso 1: el caso.**

```bash
grep -cF "'**7. Voz de Orbit: guardián sereno.**'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   # 1: caso A; 0: caso B
```

El handoff nombra el caso y la variante de [[design]] §4 que Codex escribe en
`orbit-rename.test.ts`.

**Paso 2: anclas.** Comunes a los dos casos:

```bash
grep -cF "'welcome.pingoGreeting': 'Hola, soy Orbit.'," mobile-pet-tracker/src/i18n/catalog.ts   # esperado: 1
grep -cF "'welcome.pingoGreeting': 'Hi, I\'m Orbit.'," mobile-pet-tracker/src/i18n/catalog.ts    # esperado: 1
grep -cF 'Pingo' mobile-pet-tracker/src/i18n/catalog.ts                                          # esperado: 0
grep -cF "it('#221 R3: los identificadores pingo-* no cambian aquí'" mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts   # esperado: 1
grep -cF 'expect(images.filter(name => /^pingo-.*\.webp$/.test(name))).toHaveLength(9);' mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts   # esperado: 1
grep -cF 'for (const path of sourceFiles()) {' mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts   # esperado: 1
grep -cF "it('no mete otras poses de Pingo'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   # esperado: 1
git ls-files mobile-pet-tracker/assets/images | grep -c '/pingo-'                                # esperado: 9
git grep -il pingo -- mobile-pet-tracker/src ':!**/__tests__/**' ':!**/*.test.ts' ':!**/*.test.tsx' | wc -l   # esperado: 18
grep -cF '+ 16, // #215 R19' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   # esperado: 1
grep -cF '21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2 + 4 + 1); // +1 #198 R15' mobile-pet-tracker/src/__tests__/ui-language.test.ts   # esperado: 1
grep -cF 'orbit' mobile-pet-tracker/src/__tests__/ui-copy-table.ts                               # esperado: 0
```

Solo caso A (#221 R4 aplicada):

```bash
grep -cF "'**7. Voz de Pingo: guardián sereno.**'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   # esperado: 0
grep -cF 'rodean a Orbit en la bienvenida' mobile-pet-tracker/src/screens/welcome/index.test.tsx   # esperado: 1
grep -cF 'Orbit en la celebración' mobile-pet-tracker/src/components/__tests__/celebration.test.tsx   # esperado: 1
grep -cF 'Hasta la feature #225, los identificadores' docs/ui-guidelines.md                     # esperado: 1
grep -cF "it('#221 R4: la carta nombra a Orbit en el punto 7'" mobile-pet-tracker/src/__tests__/orbit-charter-voice.test.ts   # esperado: 1
git grep -il pingo -- mobile-pet-tracker/src | wc -l                                             # esperado: 53 (51 de dev ae96871b + orbit-rename-copy + orbit-charter-voice)
```

Solo caso B (#221 R4 sin aplicar):

```bash
grep -cF "'**7. Voz de Pingo: guardián sereno.**'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   # esperado: 1
grep -cF 'rodean a Pingo en la bienvenida' mobile-pet-tracker/src/screens/welcome/index.test.tsx   # esperado: 1
grep -cF 'Pingo en la celebración' mobile-pet-tracker/src/components/__tests__/celebration.test.tsx   # esperado: 1
grep -cF 'Hasta la feature #225' docs/ui-guidelines.md                                          # esperado: 0
test ! -e mobile-pet-tracker/src/__tests__/orbit-charter-voice.test.ts && echo ausente          # esperado: ausente
git grep -il pingo -- mobile-pet-tracker/src | wc -l                                             # esperado: 52 (51 de dev ae96871b + orbit-rename-copy)
```

Si otra feature mergeó en `dev` entre medias, las cuentas de `git grep` pueden
crecer. Cada fichero nuevo lo cubre el paso 3. Si cambia alguna de las dos
fórmulas de largo, la cifra nueva es la base vigente + 1.

**Paso 3: simular la regla de R4 sobre la rama mergeada.** El comando:
- decide el caso con el ancla del paso 1;
- lee la variante de la tabla de [[design]] §4;
- aplica la regla de [[design]] §3 a todo el código de test;
- comprueba el `lines` de cada entrada;
- busca pins de documento que C4 rompería. Un pin es una línea marcada y sin
  entrada, con un fragmento de 8 caracteres o más que nombra a Pingo, que no está
  en el código de producción ni es una ruta bajo `src/`, que aparece en un
  documento que el fichero lee, y cuyo renombrado no aparece en ese documento.

```bash
python3 -I - . <<'PY'
import os, re, sys
root = sys.argv[1] if len(sys.argv) > 1 else '.'
src = os.path.join(root, 'mobile-pet-tracker', 'src')
read = lambda p: open(p, encoding='utf8').read()
anchor = read(os.path.join(src, 'screens/welcome/index.test.tsx')).count("'**7. Voz de Orbit: guardián sereno.**'")
case = {1: 'A', 0: 'B'}.get(anchor) or sys.exit(f'ancla = {anchor}: ni caso A ni caso B')
table = read(os.path.join(root, 'specs/mobile-orbit-activity-pose/design.md')).split('\n## 4.')[1].split('\n## ')[0]
entries, last = [], None
for row in table.split('\n'):
    cells = [c.strip() for c in row.strip().strip('|').split('|')]
    if len(cells) != 5 or not cells[3].isdigit():
        continue
    last = last if cells[1] == 'ídem' else cells[1].strip('`')
    snip = cells[2][2:-2].strip() if cells[2].startswith('``') else cells[2][1:-1]
    if case in cells[0]:
        entries.append((last, snip, int(cells[3])))
title = re.compile(r"""^(\s*(?:describe|it|test)(?:\.(?:each|only|skip))?(?:\([\s\S]*?\))?\()(['"`])(?:\\.|(?!\2).)*\2""")
skip = {'__tests__/orbit-rename.test.ts', '__tests__/orbit-activity-pose.test.ts'}
docs = {os.path.relpath(os.path.join(dp, f), root): read(os.path.join(dp, f))
        for d in ('docs', 'specs') for dp, _, fs in os.walk(os.path.join(root, d))
        for f in fs if f.endswith(('.md', '.html', '.txt'))}
tests, prod = {}, ''
for dp, _, fs in os.walk(src):
    for f in fs:
        rel = os.path.relpath(os.path.join(dp, f), src)
        if not f.endswith(('.ts', '.tsx')):
            continue
        if '__tests__' in rel.split(os.sep) or '.test.' in f:
            if rel not in skip:
                tests[rel] = read(os.path.join(dp, f))
        else:
            prod += read(os.path.join(dp, f))
ren = lambda s: s.replace('pingo', 'orbit').replace('Pingo', 'Orbit').replace('PINGO', 'ORBIT')
bad = pins = flagged = 0
for f, snip, n in entries:
    got = sum(1 for l in tests.get(f, '').split('\n') if snip in l and re.search('pingo', l, re.I))
    if got != n:
        bad += 1
        print(f'DESCUADRE {f}: {snip!r} declara {n}, casa {got}')
for rel, text in sorted(tests.items()):
    lits = set(re.findall(r"'([^'\n]*)'", text))
    mine = [v for k, v in docs.items() if k in text or all(p in lits for p in k.split('/'))]
    snips = [s for f, s, _ in entries if f == rel]
    for i, line in enumerate(text.split('\n'), 1):
        t = line.strip()
        if t.startswith(('//', '/*', '*')) or any(s in line for s in snips):
            continue
        if not re.search('pingo', title.sub('', line.split(' // ')[0]), re.I):
            continue
        flagged += 1
        u = t.replace('\\`', '`').replace("\\'", "'").replace('\\u0023', '#')
        for c in {u, *re.split(r"\\n|['\"`]", u)}:
            c = c.strip().rstrip(',;)')
            if (len(c) >= 8 and re.search('pingo', c, re.I) and c not in prod
                    and not os.path.exists(os.path.join(src, c))
                    and any(c in v for v in mine) and not any(ren(c) in v for v in mine)):
                pins += 1
                print(f'PIN {rel}:{i}: {c[:100]}')
print(f'caso {case}: {len(entries)} entradas, {bad} descuadradas; {pins} pins de documento sin entrada; {flagged} líneas para el reemplazo de C4')
sys.exit(1 if bad or pins else 0)
PY
echo "exit $?"
```

Salida esperada. La cifra final es informativa:
- caso A: `caso A: 23 entradas, 0 descuadradas; 0 pins de documento sin entrada; 296 líneas para el reemplazo de C4` y `exit 0`;
- caso B: `caso B: 21 entradas, 0 descuadradas; 0 pins de documento sin entrada; 296 líneas para el reemplazo de C4` y `exit 0`.

Si imprime alguna línea `DESCUADRE` o `PIN`, o sale con un código distinto de 0,
enmienda [[design]] §4 antes del handoff y repite. La enmienda es una fila nueva
con su caso, su snippet medido y su `lines`, o un `lines` corregido. Si el ancla da
una cifra que no es 0 ni 1, el comando para con `ni caso A ni caso B`.

El detector de pins es una heurística. No ve el pin de un identificador suelto que
también está en producción, como `'PingoFloat',` de #205. Los que hay hoy ya están
en §4. Si aparece uno nuevo, lo destapa el jest de C4: ese test cae.

## Smoke G2 (para `progress/smoke_ui.md`)

En el dev build Android ya instalado, sin rebuild (ver «Módulo nativo»), con
Metro de la rama, dentro del smoke en lote al final del plan:

1. Inicio, mascota con ≥ 100 m hoy, tema claro. La burbuja muestra a Orbit andando
   (`orbit-walk`), de 56 dp, flotando como antes y sin recortes. El texto empieza
   por «<mascota> ya caminó …».
2. El mismo paso en tema oscuro.
3. Una mascota con < 100 m hoy, o sin tracking. La burbuja vuelve a la pose base
   (`orbit-talk`) del mismo tamaño, en claro y en oscuro.
4. Con TalkBack, en el paso 1 la imagen se anuncia «Orbit caminando». En el paso 3
   no se anuncia.
5. Bienvenida, iniciar sesión, nueva mascota, estados vacíos y emparejamiento
   muestran las mismas poses que antes del renombrado. No falta ninguna imagen.

## Aprobación

- [x] Firmada por el leader con la firma delegada (mandato 2026-10-26 UI), tras
  la checklist de `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos
  de `progress/plan_ui-2026-10-26.md` §4 (fecha: 2026-10-28)
- [x] §Re-verificar al mergear #221 ejecutada con todas las cifras esperadas (fecha: 2026-10-28)
- [ ] Smoke G2 en dispositivo, pasos 1–5, claro y oscuro (humano; fecha: ____)
- [x] G4: enmienda de la carta de #225 R9 (humano; fecha: 2026-10-28)

#225 puede mergearse en `dev` con las dos primeras casillas firmadas y el veredicto
«aprobado» del `reviewer` sobre R1–R8. Queda `spec_ready`, no `done`, hasta que
estén cerradas la casilla G4 (con el commit de R9 del leader) y la del smoke G2.
