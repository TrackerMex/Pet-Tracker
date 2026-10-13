---
feature: "mobile-tab-screens-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Tareas — [[mobile-tab-screens-canvas-fidelity]] (#173)

> Disciplina TDD: cada R-id tiene sus tres pasos, en este orden. Cada paso (1) es un commit propio en rojo
> y cada paso (2) es un commit en verde. Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y `specs/`.

## Reglas comunes a todos los commits

- **Comandos** (desde `mobile-pet-tracker/`, siempre con `cd` explícito, con `bunx`/`bun`, nunca `npx`):
  - tests acotados: `bunx jest <ruta> --testTimeout=30000`;
  - tipos: `bun run typecheck`;
  - lint: `bun run lint > /tmp/lint173.log 2>&1 && ! grep -qF 'Failed to run' /tmp/lint173.log`. Sale distinto
    de 0 si eslint falla **o** si `expo lint` muere por SIGKILL (que sale 0 e imprime `Failed to run`). Ante
    `Failed to run`, reintentar una vez antes de tratarlo como rojo.
- **Formato**: `bunx prettier --write` sobre los ficheros tocados antes de cada commit.
- **Rutas con paréntesis**: ninguna ruta de esta feature los tiene. Si hiciera falta una, se escapa
  (`\(tabs\)`).
- **RNTL 14**:
  - siempre `await fireEvent.press(...)` y `await act(...)`;
  - nodos ocultos a accesibilidad con `{ includeHiddenElements: true }`;
  - `within(x)` no ve la raíz `x`.
- **Clases en los tests**: literales escritos en el test, nunca importados de producción.
- **Recuentos por hijos**: `children.length` y orden de `testID`, no `getAllByTestId(...).length`.
- **Candados globales**: solo por delta sobre la base de H0, con `// #173 Rn`. Ninguna cifra se recalcula a
  mano.
- **Catálogo y tabla de copy viajan con el R que usa la clave**:
  - `checkUses` exige, por (fichero, clave), tantas llamadas literales como filas. Añadir una fila antes del
    uso pone `ui-language` en rojo, y quitar el uso antes de la fila también.
  - Por eso cada fila nueva o retirada, su clave del catálogo, su fila en `specs/mobile-ui-language/design.md`
    y su término de longitud entran en el **mismo commit verde** que la llamada `t(...)`.
  - T13 junta al final los términos intermedios.
- **No ejecutar `./init.sh`.**

## H0 — Base

- [ ] H0.1 Comprobar la base:
  - `git rev-parse HEAD`;
  - `git merge-base --is-ancestor 57a61544 HEAD && echo ok` debe imprimir `ok`.
- [ ] H0.2 `test ! -e .expo/types/router.d.ts`. Si el fichero existe, **parar** y avisar al humano. No se
  borra desde el handoff.
- [ ] H0.3 Correr M1–M37 de requirements §1 y apuntar la salida de cada uno en `progress/impl_<feature>.md`.
  - Si alguna medida difiere de la columna «Base», la diferencia viene de #171 mergeada.
  - En ese caso se apunta la base nueva y se conserva el **delta** de R15.1 y R13.
- [ ] H0.4 (**pendiente de medir**: el spec_author no pudo ejecutar jest). Solo cuando
  `pgrep -af '[i]nit\.sh|node_modules/(\.bin/jest|jest-worker)'` no devuelva nada:
  - `bunx jest src/screens/profile/index.test.tsx src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx --testTimeout=30000`;
  - apuntar el número de tests y que sale en verde.
- [ ] H0.5 Confirmar que existe `assets/fonts/Inter-ExtraBold.ttf` del release Inter 4.001
  (`extras/ttf/`).
  - Si no hay red para descargarlo, **parar** antes de T1.2: lo coloca el humano o el leader.

## R1 — Inter-ExtraBold

- [ ] (1) Rojo: describe `#173 R1: registra Inter-ExtraBold como sexto peso` en
  `src/theme/__tests__/font-registration.test.ts`.
  - Amplía el tipo local de `require('fs')` con una sobrecarga `readFileSync(path: string): Buffer`.
  - `existsSync` del fichero nuevo.
  - `Buffer.compare` distinto de 0 contra cada uno de los cinco `Inter-*.ttf`.
  - Literal `'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),` en `_layout.tsx`.
  - Literal `--font-extrabold: 'Inter-ExtraBold';` en `global.css`.
- [ ] (2) Verde:
  - el `.ttf`;
  - la entrada en `useFonts` entre `'Inter-Bold'` y `'Inter-Black'`;
  - `--font-extrabold` detrás de `--font-bold`.
- [ ] (3) Refactor: nada esperado. El describe `R3` y su `interFonts` no se tocan.

## R2 — Tokens `--radius-hero` y `--radius-tile`

- [ ] (1) Rojo: describe `#173 R2: tokens de radio hero y tile` en `src/theme/__tests__/global-css.test.ts`,
  con
  `toMatchObject({ 'radius-hero': '28px', 'radius-tile': '18px' })` sobre el mismo parser que da
  `'radius-card': '20px'`.
- [ ] (2) Verde: dos líneas en `@theme` justo detrás de `--radius-card: 20px;`.
- [ ] (3) Refactor: nada esperado.
- Los inventarios de R2.2 **no** se escriben aquí, porque sus sujetos aún no existen:
  - el de `rounded-hero` va en T6.1;
  - el de `rounded-tile` va en T10.1.

## R3 — Variantes `hero` y `flat` de `Card`

- [ ] (1) Rojo: describe `#173 R3: variantes hero y flat sin sombra` en
  `src/components/__tests__/card.test.tsx`.
  - Cuatro `it`: hero sin/con `className` y flat sin/con `className`, con los literales de R3.
  - `style` incluye `borderCurve: 'continuous'`.
  - Ningún `className` contiene `shadow`.
- [ ] (2) Verde: dos entradas nuevas en `variantClassNames` y el tipo `variant` ampliado. Las tres variantes
  existentes, intactas.
- [ ] (3) Refactor: nada esperado.
- El inventario R3.3 se escribe en dos momentos:
  - el `it` de `hero` en T6.1;
  - el de `flat` en T11.1, porque T8 deja 1 y T11 lo sube a 2.

## R4 — `PetSwitcher` variante `avatars`

- [ ] (1) Rojo, en dos sitios:
  - Describe `#173 R4: variante avatars` en `src/components/__tests__/pet-switcher.test.tsx`. Lleva los
    `it` de requirements R4: seis mascotas, una mascota, foto/sin foto, recuento por hijos, pulsar y sin
    variante.
  - En `src/screens/profile/index.test.tsx`:
    - el doble de `../../components/pet-switcher` pasa a
      `const mockPetSwitcher = jest.fn((props) => …mismo render…)`;
    - describe `#173 R4: Perfil pide la variante avatars`;
    - en `src/__tests__/profile-canvas-fidelity.test.ts` (fichero nuevo), describe
      `#173 R4: avatars solo en Perfil`.
- [ ] (2) Verde:
  - rama `avatars` en `pet-switcher.tsx`;
  - `variant="avatars"` en el `<PetSwitcher` de Perfil.
- [ ] (3) Refactor: la rama `default` queda literalmente igual. `grep -cF 'border-2 border-accent bg-accent-soft p-1' src/components/pet-switcher.tsx` da `1`.

## R5 — Cápsula «Añadir mascota»

- [ ] (1) Rojo:
  - En `src/screens/profile/index.test.tsx`:
    - el doble de `reicon-react-native` suma `Plus: icon('profile-icon-plus')` y
      `Camera: icon('profile-icon-camera')`;
    - describe `#173 R5: cápsula de añadir mascota`, con clases, `hitSlop`, dos hijos, texto es/en y
      `router.push('/pets/add')`.
  - Mueve los candados que la cápsula rompe:
    - `#166 R2`: se quita la fila de Perfil de `expected`, el título pasa a `'inventaría los dieciocho primarios con labio, fichero a fichero'`
      y las dos cuentas `toBe(19)` pasan a `toBe(19 - 1) // #173 R5`;
    - `#98 R10`: `toBe(13 + 1 + 1 + 1 + 1 + 1 + 1 - 1) // #173 R5`;
    - `#61 R4`: la fila de Perfil queda en `1 + 1` y la suma suma `+ 1`, con `// #173 R5`;
    - `#62 R7`: el literal del import pasa a
      `import { Bell, ChevronRight, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';`.
- [ ] (2) Verde:
  - el `Pressable` de R5 sustituye al `Button`;
  - `Plus` entra en el import;
  - `useThemeColors` suma solo `'accent-strong'` al final:
    `['muted', 'category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong']`.
    - `muted` sigue dentro porque `ChevronRight` vive hasta T10.
    - `'accent-foreground'` entra en T6, con su uso; antes sería una variable sin uso para eslint.
    - La lista final de R5.4 queda en T10.
- [ ] (3) Refactor: nada esperado.

## R6 — Hero: `Card` `hero`, anillo y cámara

- [ ] (1) Rojo:
  - `#168 R4` se reescribe como `#168 R4 (enmendado por #173 R6): …`, con lo de requirements R6.
  - El describe `R7: cambiar foto` pasa a `Pressable` (pulsación con `await`; el estado deshabilitado se lee
    de `accessibilityState`).
  - En `profile-canvas-fidelity.test.ts`:
    - `#173 R2`: `it` de `rounded-hero` con
      `[components/card.tsx, screens/profile/index.tsx]`;
    - `#173 R3`: `it` de `variant="hero"` igual a 1.
  - Candados:
    - `#98 R10`: las dos cuentas `toBe(16 + 2 + 1 - 1)` (M19 y M20) pasan a `toBe(16 + 2 + 1 - 1 - 1) // #173 R6`;
    - `#61 R4`: la fila de Perfil y la suma bajan 1, con `// #173 R6`;
    - `#62 R7`: el import pasa a
      `import { Bell, Camera, ChevronRight, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';`.
- [ ] (2) Verde:
  - `Card variant="hero"` con anillo y cámara;
  - skeleton `rounded-hero`;
  - `photo-upload-error` detrás de `profile-pet-card`;
  - `Camera` entra en el import;
  - `useThemeColors` suma `'accent-foreground'` al final.
- [ ] (3) Refactor: nada esperado.

## R7 — Chips con sexo localizado

- [ ] (1) Rojo:
  - `#168 R5` se reescribe como `#168 R5 (enmendado por #173 R7): …`. `expectProfileChip168` pasa a las
    clases nuevas y hay un `it` por combinación de idioma × `'male'`/`'female'`/`null`/`'other'`.
  - `#68 E1` en `src/__tests__/design-drift.test.ts` se cambia según R7.3.
- [ ] (2) Verde:
  - dos llamadas literales `t('addPet.male')` y `t('addPet.female')`;
  - las clases de R7.2;
  - **mismo commit**:
    - en `src/__tests__/ui-copy-table.ts`, dos filas `R7_PROFILE` (`addPet.male`, `addPet.female`, `file`
      Perfil, `// #173 R7`);
    - en `src/__tests__/ui-language.test.ts`, el término `+ 2 // #173 R7` en la longitud de `R7_PROFILE`;
    - la viñeta de enums de la carta según R7.3.
- [ ] (3) Refactor: nada esperado.

## R8 — Información en `Card flat` con estado del collar

- [ ] (1) Rojo:
  - Describe `#173 R8: información en Card flat` con los `it` de requirements R8.
  - `#61 R9` se sustituye por `#61 R9 (enmendado por #173 R8): …`.
  - En el `it` `'uses No registrado for nullable information'`, `toHaveLength(4)` pasa a `toHaveLength(3)`.
  - El `it` que asevera `PetTrack One` pasa a `Vinculado`.
  - En `src/providers/__tests__/language-provider.test.tsx` se crea el describe
    `#173 R13: Perfil retira cuatro claves y añade tres`, con las filas de esta tarea:
    - `profile.gpsLinked` y `profile.gpsNoCollar` presentes con sus literales;
    - `profile.information` ausente;
    - sus marcas en `specs/mobile-ui-language/design.md`.
- [ ] (2) Verde:
  - `Card variant="flat"` sin etiqueta;
  - `InfoRow` con `tone`;
  - fila del collar con estado;
  - **mismo commit**:
    - catálogo: `-profile.information`, `+profile.gpsLinked` y `+profile.gpsNoCollar` en `en` y `es`;
    - fórmula de `englishKeys`: `+ 1 // #173 R8`;
    - tabla de copy: −1 / +2 filas;
    - fórmula de `R7_PROFILE`: `+ 1 // #173 R8`;
    - `specs/mobile-ui-language/design.md`: marca la fila retirada y crea la sección
      `### §2.<n> — Añadidos por #173 — Perfil fiel al canvas`, con `<n>` el siguiente libre tras §2.26, y
      sus dos filas;
    - `#61 R4`: la fila de Perfil y la suma suben 1 (`// #173 R8`).
- [ ] (3) Refactor: la clase de valor de `InfoRow` es una sola constante ternaria.

## R9 — Última señal relativa

- [ ] (1) Rojo: describe `#173 R9: última señal relativa`.
  - `jest.spyOn(Date, 'now')` fijo en `2026-10-13T12:00:00.000Z`, restaurado en `afterEach`.
  - `it.each` es y en con las doce filas de requirements R9, más `null`.
- [ ] (2) Verde:
  - `formatLastSignal` local;
  - **mismo commit**:
    - tres filas `R7_PROFILE` (`map.justNow`, `map.agoMinutes`, `map.agoHours`, `file` Perfil, `// #173 R9`);
    - fórmula: `+ 3 // #173 R9`.
- [ ] (3) Refactor: nada esperado. `fmtAgo` de `screens/map` no se toca.

## R10 — Rejilla 2×2 de accesos

- [ ] (1) Rojo:
  - `#168 R6` se reescribe como `#168 R6 (enmendado por #173 R10): …`, con un `it.each` por fila de la tabla
    R10.3 y un `it` por rama (con y sin mascota).
  - `#41 R9` y `R10 (mobile-device-pairing)` cambian clases y copy.
  - En `profile-canvas-fidelity.test.ts`, `#173 R2`: `it` de `rounded-tile` con
    `[screens/profile/index.tsx]`.
  - En `src/__tests__/consistency-classnames.test.ts`:
    - `#62 R7`: el `it` se renombra a `'profile usa los glifos de reicon sin ChevronRight (#173 R10)'`, con el
      import final de R10.3 y `profile.match(/ChevronRight/g)` `toBeNull()`;
    - `#62 R14`: fila de Perfil `3 + 1 + 4 - 7` (`// #173 R10: ProfileTile`) y, en el mismo commit, la suma
      de `directUses` `toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 7)`;
    - `#98 R10`: `toBe(31 + 1 + 4 + 1 - 7)`.
  - `language-provider` `#173 R13`: filas de `profile.gpsCollar` (presente) y `profile.gpsSettings`
    (ausente).
- [ ] (2) Verde:
  - `ProfileTile`, `profile-links` y sus filas;
  - `ChevronRight` y `muted` salen, y `useThemeColors` queda en la lista exacta de requirements R5.4;
  - **mismo commit**:
    - catálogo: `-profile.gpsSettings` y `+profile.gpsCollar` (longitud sin cambio neto: no se añade término);
    - tabla: −1 / +1 fila (sin término);
    - `specs/mobile-ui-language/design.md`: marca la fila retirada y añade la fila de `gpsCollar` en
      §2.<n>.
- [ ] (3) Refactor:
  - `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx` da `1`;
  - `grep -cF 'ChevronRight' src/screens/profile/index.tsx` da `0`.

## R11 — Cuenta en `Card flat` con `Switch` e idioma

- [ ] (1) Rojo:
  - Describe `#173 R11: cuenta en Card flat con Switch e idioma` con los `it` de requirements R11.
  - `R4: toggle persiste` pasa a `await fireEvent.press`.
  - `#65 R14` se reescribe como `#65 R14 (enmendado por #173 R11)`.
  - En `profile-canvas-fidelity.test.ts`, `#173 R3`: `it` de `variant="flat"` igual a 2.
  - `language-provider` `#173 R13`: filas de `profile.account` y `profile.useLightTheme`, las dos ausentes.
- [ ] (2) Verde:
  - `Card variant="flat"` con `theme-row` (`Switch`) y `language-toggle`;
  - `Switch` de `heroui-native` importado junto a `Skeleton`. `Button` sigue importado por `profile-sign-out`;
  - **mismo commit**:
    - catálogo: `-profile.account` y `-profile.useLightTheme`, con `- 2 // #173 R11`;
    - tabla: −2 filas, con `- 2 // #173 R11`;
    - `specs/mobile-ui-language/design.md`: dos filas marcadas como retiradas;
    - `#61 R4`: la fila de Perfil y la suma suben 1 (`// #173 R11`).
- [ ] (3) Refactor: `grep -cF "'screens/profile/index.tsx': 2," src/__tests__/design-drift.test.ts` sigue en `1`
  (sign-out intacto).

## R12 — Entrada escalonada

- [ ] (1) Rojo: en `src/screens/profile/index.test.tsx`:
  - doble `jest.mock('../home/home-entrance', …)` con `mockHomeEntrance`, copiado de
    `src/screens/login/index.test.tsx`;
  - describe `#173 R12: entrada escalonada`, con mascota y sin mascota.
  - El `it` de R6.3 pasa a medir el índice contra `profile-entrance-hero`.
- [ ] (2) Verde: cuatro `HomeEntrance` con los índices fijos de R12.1.
- [ ] (3) Refactor: nada esperado.

## R13 — Catálogo y tabla de copy

- [ ] (1) Rojo: sin commit propio. Las filas del describe `#173 R13` se escriben en rojo en T8.1, T10.1 y
  T11.1, junto a la llamada `t(...)` que las hace verdes. Escribirlas aquí, al final, las haría nacer en
  verde.
- [ ] (2) Verde: hecho por partes en T7.2, T8.2, T9.2, T10.2 y T11.2.
- [ ] (3) Refactor: se juntan los términos intermedios en el literal final de requirements R13.
  - `englishKeys`: `+ 1 // #173 R8` y `- 2 // #173 R11` pasan a un único `- 4 + 3 // #173 R13`.
  - `R7_PROFILE`: `+ 2`, `+ 1`, `+ 3` y `- 2` pasan a un único `- 4 + 8 // #173 R13`. La fórmula queda en
    `toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8)`.
  - Las medidas M25–M27 dan su valor «Al cerrar».

## R14 — Enmiendas

- [ ] (1) Rojo: en `profile-canvas-fidelity.test.ts`:
  - describe `#173 R14: enmiendas`, con un `it` por fichero de R14.1, extracción del cercado de `design.md` §2
    y firma tolerante `[ xX]`;
  - describe `#173 R14: la carta declara los cambios`.
- [ ] (2) Verde:
  - los diez bloques, al final de cada fichero; en la carta, tras la última `## Enmienda`;
  - los cambios aditivos de R14.2 en §12, §13 y decisión 4.
- [ ] (3) Refactor: los `it` de #62 R4 y #166 R4 siguen verdes.
  `grep -cF '**Control, tile, input, botón y píldora de dato** → \`rounded-xl\`' ../docs/ui-guidelines.md` da `1`.

## R15 — Candados por delta y grep-limpio

- [ ] (1) Rojo: describe `#173 R15: grep-limpio` en `profile-canvas-fidelity.test.ts`.
  - Nace verde porque el código ya cumple. Su rojo se demuestra con una **sonda**: añadir `shadow-sm` a la
    variante `hero` de `card.tsx`, correr el describe y ver exactamente 1 fallo.
  - Restaurar con `git checkout HEAD -- src/components/card.tsx` y comprobar `git diff --cached --quiet`.
  - Anotar la sonda en `progress/impl_<feature>.md`.
- [ ] (2) Verde: comprobar M1–M37 contra «Al cerrar» (o contra base de H0 + delta si la base cambió) y la
  tabla R15.1 completa.
- [ ] (3) Refactor: ALL móvil solo cuando
  `pgrep -af '[i]nit\.sh|node_modules/(\.bin/jest|jest-worker)'` no devuelva nada:
  - `bunx jest --testTimeout=30000`;
  - `bun run typecheck`;
  - `bun run lint` con la guarda de «Failed to run».

  El aviso de worker force-exit al final del ALL es preexistente y no cuenta como fallo.

## R16 — Prueba de humo (humano)

- [ ] (1) N/A: es un gate manual.
- [ ] (2) El humano recorre los nueve pasos de requirements R16 en dev build de Android, con tema claro y
  oscuro, en es y en.
- [ ] (3) El humano marca la casilla de R16 en requirements §Aprobación (fecha, dispositivo, temas).
