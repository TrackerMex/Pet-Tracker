# Handoff a Codex CLI — #173 mobile-tab-screens-canvas-fidelity

> **Reanudación 10 (2026-10-14). Lee esto antes que nada.**
>
> **Por qué se paró c30.** Hiciste bien en parar: la spec se contradice.
> R3.2 obliga a conservar sin cambios los literales de `surface` y `accent`,
> que llevan `shadow-sm`. R15.2 pedía que `components/card.tsx` entero no
> casara `/\bshadow-/`. Lo que R15.2 quiere es que Perfil no tenga sombras
> (D8): `hero` y `flat` sin sombra, y ninguna sombra nueva.
>
> **E7.** En `src/__tests__/profile-canvas-fidelity.test.ts`, describe
> `#173 R15: grep-limpio`, cambia a mano solo estas dos cosas. No toques nada
> más, ni producción:
> 1. La línea de `classSections`. Sin el tipo, `bun run typecheck` da TS2345
>    en el `push` de `cardRecipes`, y c30 pararía en tipos después del jest.
>    - Antes: `    const classSections = source.match(/className=(?:"[^"]*"|\{[\s\S]*?\}(?=[\s>]))/g) ?? [];`
>    - Después: `    const classSections: string[] = source.match(/className=(?:"[^"]*"|\{[\s\S]*?\}(?=[\s>]))/g) ?? [];`
> 2. La última aserción del `it.each`, que pasa a ser dos líneas:
>    - Antes: `    expect(source).not.toMatch(/\bshadow-/);`
>    - Después:
>      `    // #173 R3.2: surface y accent conservan su shadow-sm; ningún otro shadow-.`
>      `    expect(source.match(/\bshadow-/g) ?? []).toHaveLength(file === 'components/card.tsx' ? 2 : 0);`
>
> Compruébalo antes de relanzar, desde `mobile-pet-tracker/`. Las tres
> cuentas deben salir `1`, `1` y `0`. Si sale otra cosa, PARA:
> `grep -cF 'const classSections: string[] = source.match(' src/__tests__/profile-canvas-fidelity.test.ts; grep -cF "toHaveLength(file === 'components/card.tsx' ? 2 : 0);" src/__tests__/profile-canvas-fidelity.test.ts; grep -cF 'expect(source).not.toMatch(/\bshadow-/);' src/__tests__/profile-canvas-fidelity.test.ts`
>
> El leader lo probó sobre una copia de tu árbol (HEAD `9222e981` más tu
> describe), fuera del worktree:
> - `profile-canvas-fidelity.test.ts`: 26/26 verde. Con design-drift,
>   consistency y legibility: 190/190.
> - La sonda S15 (`shadow-sm` plantado en `hero`) da `Tests: 1 failed, 25
>   passed, 26 total` y una sola línea `● #173 R15: grep-limpio ›
>   components/card.tsx …`, como espera el handoff.
> - typecheck limpio, `expo lint --no-cache` vacío y mcheck de cierre con
>   M1–M51 `ok`.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `9222e981` (c29) y el índice
>   debe estar vacío.
> - `git status --short` desde `mobile-pet-tracker/` debe dar las mismas cuatro
>   líneas que en la Reanudación 8. Si sale otra cosa, PARA.
> - Aplica E7, pasa las tres cuentas, corre el bucle de espera de la sección
>   Reintento y relanza c30 (paso 2) con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 10`, y sigue con S15 y K1–K5
>   hasta el final del handoff.
> - Antes de parar, aplica «Reintento» (incluido `reading 'canceled'`, que es
>   el flake conocido de `R7: cambiar foto` en profile) y «Flake de un it
>   ajeno», como en cualquier otra cadena.
> - **No ejecutes las Reanudaciones 1 a 9 otra vez**: ya están cumplidas.
>
> **Reanudación 9 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c26.** Hiciste bien en parar: la nota de la Reanudación 8
> decía «si c26 vuelve a parar, PARA». E5 funcionó: ROJO y SINCRASH pasaron y
> tus 16 `●` de R14 son los esperados. El `●` que sobra en `<SOLO>` es
> `R1: me card › shows the real account name and email`, el flake conocido de
> la Reanudación 2 (el it espera `me-card`, que existe mientras carga, y lee
> «Ada Lovelace» antes de que llegue). No es de #173 y no se toca aquí.
>
> **Regla «Flake de un it ajeno» aplicada a c26.** Las corridas sueltas las
> hizo el leader sobre una copia de tu árbol (`src/` idéntico, `diff -rq`
> vacío): `src/screens/profile/index.test.tsx` solo, tres veces, `Tests: 131
> passed, 131 total` las tres, y 0 líneas `●` con ese título.
>
> **E6 (ya hecha por el leader).** El conteo de la regla contaba también la
> línea `✓ shows …` que jest imprime al correr un fichero solo, así que daba 1
> aunque el it pasara. Ahora cuenta solo las líneas con `●`
> (`grep -F 'TITULO_DEL_IT' … | grep -cF '●'`). No tienes que editar nada a mano.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `5e48dc40` (c25) y el índice
>   debe estar vacío.
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente las
>   mismas cuatro líneas que en la Reanudación 8. Si sale otra cosa, PARA.
> - Corre el bucle de espera de la sección Reintento y relanza c26 (paso 2)
>   con el ejecutor, UNA vez.
> - Anótalo en Desviaciones, en `### Reanudación 9`, y sigue con c27 hasta el
>   final del handoff (c30, S15 y K1–K5).
> - De c27 en adelante, antes de parar aplica las reglas «Reintento» y «Flake
>   de un it ajeno» de la sección Reintento, como en cualquier otra cadena.
> - **No ejecutes las Reanudaciones 1 a 8 otra vez**: ya están cumplidas. Si
>   c26 vuelve a parar, PARA.
>
> **Reanudación 8 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c26.** Hiciste bien en parar. Tus 16 tests de R14 son
> correctos y no se tocan. El fallo es del handoff: `<SINCRASH>` buscaba
> `ReferenceError` suelto. Tu `toContain` imprime en el Received la prosa de
> `specs/mobile-ui-language/requirements.md`, que dice «un `ReferenceError`».
> Un crash de verdad siempre sale como `ReferenceError: …`, con dos puntos.
>
> **E5 (ya hecha por el leader).** En todas las cadenas y en la definición de
> `<SINCRASH>`, `ReferenceError` y `SyntaxError` pasan a `ReferenceError:` y
> `SyntaxError:`. No tienes que editar nada a mano.
>
> El leader lo comprobó:
> - el guard nuevo pasa sobre tu `/tmp/173-c26.txt` y sigue detectando una
>   línea `ReferenceError: foo is not defined`;
> - las cadenas c26–c30 pasan `bash -n`;
> - sobre una copia de tu árbol fuera del worktree, typecheck da 0 errores
>   fuera de tests y expo lint sale vacío.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `5e48dc40` (c25) y el índice
>   debe estar vacío.
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   cuatro líneas. Si sale otra cosa, PARA:
>   ` M src/__tests__/profile-canvas-fidelity.test.ts`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
> - Corre el bucle de espera de la sección Reintento y relanza c26 (paso 2)
>   con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 8`, y sigue con c27 hasta el
>   final del handoff (c30, S15 y K1–K5).
> - **No ejecutes las Reanudaciones 1 a 7 otra vez**: ya están cumplidas. Si
>   c26 vuelve a parar, PARA.
>
> **Reanudación 7 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c18.** Hiciste bien en parar. Tu R9 es correcto y la BASE21
> pasó (947/947). El fallo es de la spec: R9.1 mandaba llamar
> `formatLastSignal` con `Date.now()` en el render, y la regla
> `react-hooks/purity` de expo lint lo prohíbe. La regla no se toca.
>
> **E4.** En `src/screens/profile/index.tsx`, cambia a mano solo esta línea
> (el `value` de la fila `t('profile.lastSignal')`):
> - Antes: `              value={formatLastSignal(pet.lastCommunicationAt, Date.now(), t, locale)}`
> - Después: `              value={formatLastSignal(pet.lastCommunicationAt, detail.dataUpdatedAt, t, locale)}`
>
> El «ahora» pasa a ser el instante de la última carga del detalle, que se
> recarga en cada foco. Es el mismo patrón que `src/screens/alerts/index.tsx`
> (`new Date(alerts.dataUpdatedAt)`). TanStack fija `dataUpdatedAt` con
> `Date.now()`, así que el `jest.spyOn(Date, 'now')` de tus tests de R9 sigue
> mandando. No toques `formatLastSignal`, ni los tests, ni los otros dos
> ficheros de c18.
>
> El leader lo probó sobre una copia de tu árbol, fuera del worktree:
> - `eslint` del fichero: limpio. Con `Date.now()` da el error `react-hooks/purity`.
> - typecheck: limpio.
> - jest de profile/index.test.tsx, (tabs)/profile.test.tsx y ui-language.test.ts:
>   145/145, con los 26 its de `#173 R9` en verde.
> La cadena de c18 no cambia.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `b73f4963` (c17) y el índice
>   debe estar vacío.
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   seis líneas, antes y después de E4. Si sale otra cosa, PARA:
>   ` M src/__tests__/ui-copy-table.ts`,
>   ` M src/__tests__/ui-language.test.ts`,
>   ` M src/screens/profile/index.tsx`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
> - Haz el cambio de E4, corre el bucle de espera de la sección Reintento y
>   relanza c18 (paso 2) con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 7`, y sigue con c19 hasta el
>   final del handoff.
> - **No ejecutes las Reanudaciones 1 a 6 otra vez**: ya están cumplidas. Si
>   c18 vuelve a parar, PARA.
>
> **Reanudación 6 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c14 otra vez.** Hiciste bien en parar. E2 está bien aplicada
> (M13 = 2) y tu R7 es correcto. Los dos rojos del VERDE son candados viejos que
> la spec no contó (enmienda **E3** del leader):
> 1. `#65 R20 › inserta el punto 6 literal de §6.3 en §Dirección de arte` lee el
>    punto 6 canónico de `specs/mobile-ui-language/design.md` §6.3 y exige que
>    la carta lo contenga literal. Cambiaste la carta (R14.2) pero no esa copia.
> 2. `R2: estructura Figma` en `src/screens/profile/index.test.tsx` sigue
>    esperando el sexo crudo `female`, y R7 pinta `Hembra`.
>
> **E3a.** En `../specs/mobile-ui-language/design.md`, dentro del bloque
> ` ```markdown ` del punto 6 (§6.3), deja la viñeta de enums crudos **igual que
> la dejaste en la carta**. Edítala a mano; no uses replace ni regex.
> - Antes (cinco líneas, la última va justo antes del cierre ` ``` `):
>
> ```markdown
> - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
>   `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
>   idiomas. Mapearlos es cambio de conducta y va a feature propia.
>   `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
>   resuelve por catálogo en `src/utils/device-connectivity.ts`.
> ```
>
> - Después (seis líneas; el cierre ` ``` ` del bloque queda tras la sexta):
>
> ```markdown
> - **Los valores de enum que la API devuelve se pintan crudos**: `document.type`,
>   `foodType`, `activityLevel`. Siguen en inglés en los dos
>   idiomas. Mapearlos es cambio de conducta y va a feature propia.
>   `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
>   resuelve por catálogo en `src/utils/device-connectivity.ts`.
>   `pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`.
> ```
>
> **E3b.** En `src/screens/profile/index.test.tsx`, cambia a mano esta única
> línea del `it` de `R2: estructura Figma`:
> - Antes: `    expect(screen.getByText('female')).toBeVisible();`
> - Después: `    expect(screen.getByText('Hembra')).toBeVisible();`
>
> Ningún otro cambio en esos dos ficheros ni en los cuatro de c14. El leader lo
> probó: con E3a el texto de §6.3 está literal en tu carta, y en el render del
> `it` de R2 sale un solo `Hembra`.
>
> **La cadena de c14 sí cambia**: ahora su `git add` y su lista de staged
> incluyen también `../specs/mobile-ui-language/design.md` y
> `src/screens/profile/index.test.tsx`. Ya está actualizada en el paso 2 de c14;
> el leader la comprobó con `bash -n`. Las dos rutas ya estaban en K5.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `89795331` (c13) y el índice
>   debe estar vacío.
> - `git status --short` desde `mobile-pet-tracker/`, **antes** de E3, debe dar
>   exactamente las mismas siete líneas que en la Reanudación 5. Si sale otra
>   cosa, PARA.
> - Tras E3, salen además ` M ../specs/mobile-ui-language/design.md` y
>   ` M src/screens/profile/index.test.tsx`.
> - Corre el bucle de espera de la sección Reintento y relanza c14 (paso 2) con
>   el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 6`, y sigue con c15 hasta el
>   final del handoff.
> - **No ejecutes las Reanudaciones 1 a 5 otra vez**: ya están cumplidas. E2
>   ya está en tu fichero; no la apliques de nuevo. Si c14 vuelve a parar, PARA.
>
> **Reanudación 5 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c14.** Hiciste bien en parar. Tu implementación de R7 es
> correcta, pero M13 (`grep -cF 'pet.sex' src/screens/profile/index.tsx`, que
> debe dar 2 al cerrar) cuenta **líneas**, no apariciones. Tus dos
> comparaciones están en la misma línea, así que mide 1. La medida firmada no
> se toca: lo que cambia es el formato de esa línea (enmienda **E2** del leader).
>
> **E2.** En `src/screens/profile/index.tsx`, sustituye a mano esta línea exacta
> por el bloque de debajo. Ningún otro cambio en ese fichero ni en los otros
> tres de c14. No uses replace ni regex: edítala tú.
> - Antes (una línea):
>   `    { testID: 'profile-pet-chip-sex', slot: 'blue', text: pet.sex === 'male' ? t('addPet.male') : pet.sex === 'female' ? t('addPet.female') : null },`
> - Después (siete líneas, con esta sangría exacta):
>
> ```tsx
>     {
>       testID: 'profile-pet-chip-sex',
>       slot: 'blue',
>       text: pet.sex === 'male'
>         ? t('addPet.male')
>         : pet.sex === 'female' ? t('addPet.female') : null,
>     },
> ```
>
> El leader lo probó sobre una copia de tu fichero: M13 = 2, cada `t('addPet.…')`
> sale una vez y eslint queda limpio. Las demás medidas de ese fichero no cambian.
> La cadena de c14 no cambia.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `89795331` (c13).
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   siete líneas, y si sale otra cosa, PARA:
>   ` M ../docs/ui-guidelines.md`,
>   ` M src/__tests__/ui-copy-table.ts`,
>   ` M src/__tests__/ui-language.test.ts`,
>   ` M src/screens/profile/index.tsx`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
> - Haz el cambio de E2, corre el bucle de espera de la sección Reintento y
>   relanza c14 (paso 2) con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 5`, y sigue con c15 hasta el
>   final del handoff.
> - **No ejecutes las Reanudaciones 1 a 4 otra vez**: ya están cumplidas. Si
>   c14 vuelve a parar, PARA.
>
> **Reanudación 4 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c11.** Hiciste bien en parar. Tus tests de c11 son correctos
> y no se tocan. Fallaron dos cosas del handoff:
> 1. **La lista SOLO de c11 olvidaba `#64 R9`.** tasks.md R6 (1) mueve dos
>    cuentas `16 + 2 + 1 - 1`; la segunda vive en el describe `#64 R9`
>    (`conserva los usos de bg-accent-soft que sí son acento`), no en `#98 R10`.
>    Ese rojo es el prescrito. La cadena de c11 ya lo admite.
> 2. **El `Test suite failed to run` de `src/screens/profile/index.test.tsx` no
>    es un fallo de tus tests.** Cuando un `toBe` entre nodos del árbol falla en
>    rojo, el worker de jest intenta serializar el nodo (`parent` y `children`
>    forman un ciclo), revienta con `Converting circular structure to JSON` y
>    tira la suite entera. En serie no hay worker que serializar: la suite da
>    sus 5 rojos de `#168 R4 (enmendado por #173 R6)` sin crash.
>    Todas las cadenas **rojas** que quedan (c11, c13, c15, c17, c19, c21, c23,
>    c26, c28) corren ahora jest con `-i`. Las verdes no cambian.
>
> El leader corrió la jest de c11 con `-i` sobre tu árbol: `Tests: 12 failed,
> 892 passed, 904 total`, ningún `●` fuera de la lista nueva y ningún crash.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `166c8af4` (c10).
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   siete líneas, y si sale otra cosa, PARA:
>   ` M src/__tests__/consistency-classnames.test.ts`,
>   ` M src/__tests__/legibility-classnames.test.ts`,
>   ` M src/__tests__/profile-canvas-fidelity.test.ts`,
>   ` M src/screens/profile/index.test.tsx`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
> - No edites los tests de c11. Corre el bucle de espera de la sección
>   Reintento y relanza c11 (paso 2) con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 4`, y sigue con c12.
> - **No ejecutes las Reanudaciones 1, 2 y 3 otra vez**: ya están cumplidas.
>   Si c11 vuelve a parar, PARA.
>
> **Reanudación 3 (2026-10-14). Ya cumplida: no la repitas.**
>
> **Por qué se paró c10.** Hiciste bien en parar. El rojo de
> `#62 R1 › deja todos los botones primarios sólidos en un único radio` **no es
> un flake**. Es un candado que la spec olvidó mover (enmienda **E1** del leader):
> - `src/__tests__/consistency-classnames.test.ts` tiene **dos** cuentas de
>   `rounded-xl bg-accent` con la misma fórmula: la de `#98 R10` (cerca de la
>   línea 400) y la de `#62 R1` (cerca de la 102).
> - tasks.md R5 (1) solo movió la primera, que ya hiciste en c9. La segunda se
>   mueve en c10, con el mismo delta.
>
> **E1.** En c10, además de «R5 (2)», cambia a mano esta línea exacta de
> `src/__tests__/consistency-classnames.test.ts`. Ningún otro cambio en ese
> fichero. No uses replace ni regex: edítala tú.
> - Antes: `expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit`
> - Después: `expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1 - 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit; // #173 R5`
>
> La cadena de c10 ya está ajustada para E1:
> - comprueba esa línea;
> - hace `git add` de los dos ficheros;
> - la lista de staged admite los dos.
>
> Es la única cadena que cambia. El commit sigue siendo
> `feat(mobile): cápsula de añadir mascota en Perfil (#173 R5)`. El rojo de este
> candado ya quedó probado en c9 por su gemelo de `#98 R10`, que tiene la misma
> fórmula.
>
> **Cómo retomar.**
> - H0 sigue siendo `adad3359…`. HEAD debe ser `aaeb9bab` (c9).
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   cuatro líneas, y si sale otra cosa, PARA:
>   ` M src/screens/profile/index.tsx`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
> - No toques la implementación de c10: es correcta.
> - Haz el cambio de E1, corre el bucle de espera de la sección Reintento y
>   relanza c10 (paso 2) con el ejecutor.
> - Anótalo en Desviaciones, en `### Reanudación 3`, y sigue con c11.
> - **No ejecutes las Reanudaciones 1 y 2 otra vez**: ya están cumplidas, y sus
>   comprobaciones de HEAD y status no valen ya.
>
> **Reanudación 2 (2026-10-14).**
>
> **Por qué se paró c8.** Paró en `<VERDE>` con un solo rojo,
> `R1: me card › shows the real account name and email`. Es un **flake
> preexistente**, ajeno a #173:
> - El it espera a `me-card`, que existe también mientras carga (lleva el
>   skeleton dentro). Después lee el nombre de forma síncrona, y bajo carga la
>   consulta aún no ha resuelto.
> - El leader corrió, sobre tu árbol de c8 sin commitear, el fichero solo tres
>   veces: 69/69 las tres. También corrió la BASE21 de c8: 21 suites y 896/896.
>   Tu implementación de c8 está bien. **No la toques.**
>
> **Cómo retomar.**
> - **H0 sigue siendo `adad3359…`.** HEAD debe ser `fc6715cf` (c7).
> - `git status --short` desde `mobile-pet-tracker/` debe dar exactamente estas
>   cinco líneas:
>   ` M src/components/pet-switcher.tsx`,
>   ` M src/screens/profile/index.tsx`,
>   ` M ../progress/current.md`,
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md` y
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md`.
>   Si sale otra cosa, PARA.
> - Antes de relanzar, corre el bucle de espera de la sección Reintento.
> - Relanza c8 (paso 2) con el ejecutor, tal cual. Esto ya es la regla
>   **«Flake de un it ajeno»** (sección Reintento) aplicada a c8: las dos
>   corridas sueltas las hizo el leader. Anótalo en Desviaciones, en
>   `### Reanudación 2`. Si c8 vuelve a parar, PARA.
> - De c9 en adelante, esa regla rige como cualquier otra.
>
> **Reanudación 1 (2026-10-14).**
>
> **Por qué se paró c1.** La sesión anterior construyó la línea de c1 con
> `String.replace` de JavaScript. El texto de `<TSLINT-ROJO>` lleva `$'`, que en
> una plantilla de reemplazo significa «el resto de la cadena». Eso metió la cola
> de la cadena dentro del patrón de lint (exit 127, sin ejecutar nada). El árbol
> no tenía culpa.
>
> **Qué cambió.**
> - Todas las líneas de este handoff vienen **ya expandidas**: no hay macros que
>   sustituir. No construyas comandos con `replace` ni con regex. El texto lleva
>   `$'`, `\1` y `$(...)`, que se reinterpretan.
> - Las cadenas de commit y la sonda S15 se ejecutan **sin copiarlas**, con el
>   ejecutor de == QUE HACES ==.
>
> **Cómo retomar.**
> - **H0 sigue siendo `adad3359295766758851761dce337f028671bc4b`.** Este handoff
>   queda modificado **sin commitear a propósito**, para no mover H0. No lo
>   commitees, no lo restaures y no lo añadas. `<LIMPIO>` no mira `progress/`.
> - **No repitas** B0–B2 ni ANCLAS: ya están medidas y pegadas en el impl.
> - Al retomar, `git status --short` desde `mobile-pet-tracker/` debe dar
>   exactamente estas cinco líneas, en cualquier orden:
>   ` M ../progress/current.md` (nota del leader, sin commitear, igual que el handoff),
>   ` M ../progress/handoff_mobile-tab-screens-canvas-fidelity.md`,
>   ` M src/theme/__tests__/font-registration.test.ts`,
>   `?? ../progress/impl_mobile-tab-screens-canvas-fidelity.md` y
>   `?? assets/fonts/Inter-ExtraBold.ttf`.
>   Si sale otra cosa, PARA.
> - El paso 1 de c1 ya está en el árbol (`font-registration.test.ts`). Repásalo
>   contra «R1 (1)» de tasks.md y lanza el paso 2 de c1 con el ejecutor.
> - Conserva el impl existente. Añade en Desviaciones una sección
>   `### Reanudación 1`, sin borrar la del bloqueo, y completa el resto de
>   secciones al avanzar.

> **Nota del leader (2026-10-13).** Spec firmada vía Notion en `f3b0a4a8`. H0 es
> el commit que contiene este fichero: anota `git rev-parse HEAD` al arrancar.
> En H0, `origin/main` = `788d1f89`.
>
> Las cifras de este handoff se midieron en H0: BASE, typecheck, lint, M1–M51 y
> el ALL. Los rojos **no** se simularon. Por eso cada cadena roja comprueba tres
> cosas:
> - que todo `●` cae dentro de una lista de describes permitidos;
> - que al menos uno es del R del commit;
> - que no hay crash.
>
> No fija la línea `Tests:` exacta. Si un eslabón no cuadra, PARA y reporta. No
> lo corrijas tú.
>
> **Este handoff manda sobre `tasks.md` donde discrepan:**
> 1. **Prettier prohibido** (tasks.md §Reglas comunes dice `bunx prettier --write`).
>    No está instalado en `mobile-pet-tracker/`: `bunx` lo descarga y reescribe
>    el fichero entero con comillas dobles. Formatea a mano, imitando el fichero.
> 2. **Lint con `<TSLINT>`** (`bunx expo lint --no-cache` con log vacío), no con
>    `bun run lint`.
> 3. **H0.4 ya está medido.** La BASE son 20 ficheros: 20 suites y 878 tests.
>    - Incluye `'src/app/(tabs)/__tests__/screens.test.tsx'`, que monta
>      ProfileScreen.
>    - Desde c7 son 21 ficheros, porque se suma `profile-canvas-fidelity.test.ts`.
>    - Con una ruta inexistente jest falla esa suite; por eso hay dos BASE.
> 4. **H0.5 ya está hecho.** `assets/fonts/Inter-ExtraBold.ttf` ya está en el
>    árbol, sin trackear:
>    - release Inter 4.1, `extras/ttf/`, versión 4.001;
>    - 421796 bytes;
>    - sha256 `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22`.
>
>    **No lo descargues ni lo toques.** Entra en c2 con `git add`.
> 5. **H0.3 lo hace `specs/mobile-tab-screens-canvas-fidelity/mcheck.py`.**
>    - Es fichero del leader: no lo edites.
>    - Corre M1–M51 tal cual vienen en requirements §1 y compara con la columna
>      `base` o `cierre`.
>    - En H0 hay una sola diferencia: **M35 da 6** (la base dice 5). «Al cerrar»
>      ya dice 6, así que el delta se conserva y no hay nada que hacer.
> 6. **Trazabilidad en UN commit al final**, no «tras cada commit» (lo dice la
>    línea final de traceability.md).
> 7. **Pasos (3) de refactor.** Si `tasks.md` pide algo, va dentro del commit
>    verde de su R; las cadenas verdes ya comprueban sus greps. El único commit
>    de refactor es c25 (R13).
> 8. **`§2.<n>` de `specs/mobile-ui-language/design.md` es `§2.27`.** La última en
>    H0 es §2.26.
> 9. **La carta en H0:**
>    - la última `## Enmienda` es `## Enmienda #168 — título grande en Salud,
>      Nutrición y Perfil`, así que la de #173 va detrás;
>    - no existe la línea «Tamaños de letra fuera de la escala de Tailwind»: R14.2
>      la crea;
>    - M50 y M51 dan 0: R14.5 escribe los dos párrafos.
> 10. **ALL de la base**, medido por el leader en H0: 103 suites y 3101 tests.
>     - Hubo 4 rojos de un **flake conocido**:
>       `TypeError: Cannot read properties of undefined (reading 'canceled')`.
>     - Salieron en `R7: cambiar foto` (×3) y en `#168 R4 … subida fallida`.
>     - Es la carrera del mock del picker (#72/#168) bajo carga. En la BASE
>       acotada sale verde.
>     - Su tratamiento está en «Reintento» y en K3.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-173   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/173-mobile-tab-screens-canvas-fidelity   (H0 = git rev-parse HEAD al arrancar; anotalo en el impl)

== QUE HACES ==
Implementas #173: Perfil fiel al canvas, mas los cimientos F0 (Inter-ExtraBold, tokens de radio y de letra,
Card hero/flat, PetSwitcher avatars) y las enmiendas a la carta y a 9 specs. Son 30 commits c1-c30,
test-primero. Cada R tiene su commit ROJO (solo tests/candados) y despues su commit VERDE (solo
implementacion), nunca mezclados en el mismo commit.
Excepciones declaradas:
  - c25 (R13) es refactor y nace verde.
  - c27 (R14 verde) es documentacion.
  - c30 (R15) nace verde y demuestra su rojo con la sonda S15.
  - R17 (c28/c29) va antes que R15 porque c30 comprueba M41-M44.
Guion: specs/mobile-tab-screens-canvas-fidelity/requirements.md + design.md + tasks.md. Leelos ENTEROS
antes de empezar. "Tn.k" en tasks.md = seccion Rn, paso (k).
Este handoff fija comandos, cifras, orden y anclas; si discrepa de tasks.md, manda este handoff.
Por commit:
  - rojo:  paso 1 a mano, escribe los tests de "Rn (1)" de tasks.md; paso 2, lanza la cadena.
  - verde: paso 1 a mano, implementa "Rn (2)"; paso 2, lanza la cadena.
  - Cada cadena es UNA linea que acaba en `git commit`. Las lineas `# -- ... --` son cabeceras: NO se
    ejecutan.
EJECUTOR (paso 2 de cada cN, y la sonda S15): NO copies la cadena; extraela del fichero y ejecutala asi,
cambiando solo el numero (c1, c2 ... c30):
  cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- c1 (paso 2) cadena --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"; echo "cadena=$?"
  cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bash -c "$(sed -n '/^# -- S15 sonda sobre el HEAD de c30 (NO se commitea) --$/{n;p;q}' ../progress/handoff_mobile-tab-screens-canvas-fidelity.md)"
  cadena=0 = commit hecho; cualquier otro valor = un eslabon fallo (ver Reintento / PARA).
  El resto de lineas (CIERRE) copialas a mano tal cual, byte a byte, sin sustituir nada; lo que va tras
  `->` en la linea siguiente es la salida esperada, no parte del comando.

Skills (catalogo de Codex; los nombres de Claude NO existen en tu plugin y pedirlos da silencio):
  - building-native-ui            (plugin expo@openai-curated)
  - appllama-app-design-skill     (.agents/skills/; obligatoria por docs/ui-guidelines.md §Skills)
  - animate-expo                  (.agents/skills/; R12 es una entrada escalonada con HomeEntrance)
  Si design.md o la carta nombran `expo-animation`, `expo-native-ui` o `expo-ui`, son nombres de Claude.
  Tus equivalentes son animate-expo y building-native-ui.
  En el impl, di cuales cargaste de verdad.

Macros (SOLO para leer: todas las lineas de abajo ya las traen expandidas; NO las sustituyas tu):
  CD = cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker
  <LIMPIO> = git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')"
  <TSLINT> = test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt
  <TSLINT-ROJO> = test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0
      (en un rojo, tsc y lint pueden fallar SOLO en ficheros de test: la prop o la variante aun no existe)
  <ROJO L>        = grep -qE '^Tests: +[0-9]+ failed, ' L
  <SOLO L 're'>   = test "$(grep -E '^  ● ' L | grep -vxF '  ● Console' | grep -cvE '^  ● (re)\b')" = 0
  <ALGUNO L n>    = grep -E '^  ● ' L | grep -qE '#173 Rn\b'
  <SINCRASH L>    = ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" L
  <VERDE L S>     = grep -qE '^Test Suites: +S passed, S total$' L && grep -qE '^Tests: +([0-9]+) passed, \1 total$' L
  <IT F N>        = test "$(grep -cE '^\s*it(\.each)?[(<]' F)" = N
  <BASE20> = FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx'
  <BASE21> = <BASE20> con src/__tests__/profile-canvas-fidelity.test.ts añadido al final de la lista
  El patron de <SOLO> es `R10 \(mobile-device-pairing` SIN el `)` de cierre, a proposito: `\b` no casa
  despues de `)`.

Error de invocacion: si un comando falla por directorio (ENOENT de package.json, "Cannot find module" de
bun/jest en vez de un test, "No tests found"), repite con el CD literal delante y NO toques codigo.
Jest siempre con FORCE_COLOR=0 y --runTestsByPath. Las rutas con (tabs) van entre comillas simples.

Reintento (UNA vez por linea; anotalo en Desviaciones del impl como carga):
  - Cuando: una cadena para en <SINCRASH> por `reading 'canceled'` o `Exceeded timeout`, o en <VERDE> y el
    log contiene uno de esos dos textos, o para en <TSLINT>/<TSLINT-ROJO> con `Failed to run` en
    /tmp/173-lint.txt.
  - Que haces:
    cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
    y relanza la linea ENTERA tal cual. Las cadenas son idempotentes: si paro antes del commit, nada quedo
    commiteado.
  - Si se repite, PARA.
Flake de un it ajeno (Reanudacion 2):
  - Cuando: una cadena para en <VERDE> (verde) o en <SOLO> (rojo), y TODOS los `●` que sobran (sin
    `  ● Console`) son de its SIN `#173` en el titulo.
  - Que haces: corre el fichero de ese `●` solo, dos veces:
    cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && for i in 1 2; do FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath FICHERO > /tmp/173-flake-$i.txt 2>&1; grep -E '^Tests:' /tmp/173-flake-$i.txt; grep -F 'TITULO_DEL_IT' /tmp/173-flake-$i.txt | grep -cF '●'; done
    (FICHERO y TITULO_DEL_IT los escribes tu a mano: ruta entre comillas simples y el texto del it tras `›`).
    La cuenta es de lineas con `●`: la linea `✓ TITULO` de un it que pasa no cuenta (E6).
  - Si el it ajeno no falla en ninguna de las dos (cuenta 0 las dos veces), es flake: corre el bucle de espera
    de arriba y relanza la cadena entera UNA vez con el ejecutor y anotalo en Desviaciones con las dos lineas Tests:.
    En un rojo, los `●` del propio R si saldran en esas dos corridas; lo que importa es el ajeno.
  - Si el it ajeno falla solo, o la cadena relanzada vuelve a parar, PARA.

NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader.

== BASE (H0) ==
# -- B0 estado --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && pwd && git branch --show-current && git rev-parse HEAD && git status --short
   -> /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker ; feature/173-mobile-tab-screens-canvas-fidelity ; <H0> ;
      UNA sola linea: `?? assets/fonts/Inter-ExtraBold.ttf`   (pega las salidas al principio del impl)
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && git merge-base --is-ancestor 57a61544 HEAD && git merge-base --is-ancestor 788d1f89 HEAD; echo "exit=$?"
   -> exit=0
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"
   -> exit=0   (si exit=1, PARA: lo borra el humano; NUNCA rm -f)
# -- B1 BASE20 --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-base.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +20 passed, 20 total$' /tmp/173-base.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-base.txt && grep -E '^Tests:' /tmp/173-base.txt
   -> exit=0 ; Tests:       878 passed, 878 total
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt; echo "exit=$?"
   -> exit=0
# -- B2 medidas M1-M51 --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py base > /tmp/173-m-h0.txt; echo "exit=$?"; grep -c . /tmp/173-m-h0.txt; grep DIFF /tmp/173-m-h0.txt
   -> exit=1 ; 51 ; M35	6	DIFF base=5   (unica diferencia; ver nota 5 del leader. Pega el fichero en el impl)
NO corras el ALL de la base: lo midio el leader (nota 10).

== ANCLAS (H0, desde mobile-pet-tracker/; ejecutalas todas; si una no da su valor, PARA y reporta la tabla) ==
sha256sum assets/fonts/Inter-ExtraBold.ttf | cut -d' ' -f1   -> e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22
stat -c %s assets/fonts/Inter-ExtraBold.ttf   -> 421796
test -e node_modules/.bin/prettier; echo $?   -> 1
test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $?   -> 0
test -e ../.agents/skills/animate-expo/SKILL.md; echo $?   -> 0
test -e src/__tests__/profile-canvas-fidelity.test.ts; echo $?   -> 1
grep -cE '^## Enmienda #168 — título grande en Salud, Nutrición y Perfil$' ../docs/ui-guidelines.md   -> 1
grep -cE '^## Enmienda #17[0-9]' ../docs/ui-guidelines.md   -> 0
grep -c 'Tamaños de letra fuera de la escala de Tailwind' ../docs/ui-guidelines.md   -> 0
grep -cF '**Control, tile, input, botón y píldora de dato** → `rounded-xl`' ../docs/ui-guidelines.md   -> 1
grep -cE '^### §2\.26 ' ../specs/mobile-ui-language/design.md   -> 1
grep -cE '^### §2\.27 ' ../specs/mobile-ui-language/design.md   -> 0
grep -cF '+ 7, // #170 R1' src/providers/__tests__/language-provider.test.tsx   -> 1
grep -cF "'rounded-card border border-border bg-surface p-4 shadow-sm'" src/components/card.tsx   -> 1
grep -cF "describe('R2: estructura Figma'" src/screens/profile/index.test.tsx   -> 1
grep -cF "describe('R10 (mobile-device-pairing): el perfil enlaza a /pairing'" src/screens/profile/index.test.tsx   -> 1
# its estaticos en la base (un it.each cuenta 1)
test "$(grep -cE '^\s*it(\.each)?[(<]' src/theme/__tests__/font-registration.test.ts)" = 3 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/theme/__tests__/global-css.test.ts)" = 30 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/components/__tests__/card.test.tsx)" = 7 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/components/__tests__/pet-switcher.test.tsx)" = 1 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/screens/profile/index.test.tsx)" = 51 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/consistency-classnames.test.ts)" = 33 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/legibility-classnames.test.ts)" = 12 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/design-drift.test.ts)" = 51 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/providers/__tests__/language-provider.test.tsx)" = 19 && test "$(grep -cE '^\s*it(\.each)?[(<]' src/__tests__/ui-language.test.ts)" = 28 && test "$(grep -cE '^\s*it(\.each)?[(<]' 'src/app/(tabs)/__tests__/screens.test.tsx')" = 2 && test "$(grep -cE '^\s*it(\.each)?[(<]' 'src/app/(tabs)/__tests__/profile.test.tsx')" = 1 && echo its-ok   -> its-ok
== FIN ANCLAS ==

== TITULOS (describe fijados por la spec; literales) ==
R1   '#173 R1: registra Inter-ExtraBold como sexto peso'                     (font-registration)
R2   '#173 R2: tokens de radio hero y tile' y '#173 R2.3: tamaños de letra 13 y 26'   (global-css)
     '#173 R2: inventario de radios nuevos' y '#173 R2.4: inventario de tamaños nuevos' (profile-canvas-fidelity)
R3   '#173 R3: variantes hero y flat sin sombra' (card.test) ; '#173 R3: Card hero y flat solo en Perfil' (pcf)
R4   '#173 R4: variante avatars' (pet-switcher.test) ; '#173 R4: Perfil pide la variante avatars' (profile)
     '#173 R4: avatars solo en Perfil' (pcf)
R5   '#173 R5: cápsula de añadir mascota'
R6   '#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara'
R7   '#168 R5 (enmendado por #173 R7): ...'   (el resto del titulo, el de requirements R7)
R8   '#173 R8: información en Card flat' ; '#61 R9 (enmendado por #173 R8): pet-info-card no lleva etiqueta de sección'
R9   '#173 R9: última señal relativa'
R10  '#168 R6 (enmendado por #173 R10): ...' ; consistency #62 R7, it renombrado a
     'profile usa los glifos de reicon sin ChevronRight (#173 R10)'
R11  '#173 R11: cuenta en Card flat con Switch e idioma' ; '#65 R14 (enmendado por #173 R11)...'
     '#168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard'
R12  '#173 R12: entrada escalonada'
R13  '#173 R13: Perfil retira cuatro claves y añade tres'   (language-provider)
R14  '#173 R14: enmiendas' y '#173 R14: la carta declara los cambios'   (pcf)
R15  '#173 R15: grep-limpio'   (pcf)
R17  dentro de 'R2: estructura Figma', el it se renombra a
     'uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading'
Todo describe o it reescrito "(enmendado por #173 Rn)" conserva el id viejo delante: las listas <SOLO> lo
cuentan asi.

== CUENTAS ==
BASE20 en H0: 20 suites, 878 tests. Ni las lineas Tests: de los rojos ni las de los verdes estan fijadas,
porque no se simularon. Cada verde exige todo en verde con <VERDE>, y K2 fija el total final K.
ALL en H0: 103 suites, 3101 tests. En K3: 104 suites, 3101 + (K - 878) tests.

== COMMITS ==
# -- c1 R1 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R1 (1)" de tasks.md (ningun fichero de produccion) --
# -- c1 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c1.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c1.txt && test "$(grep -E '^  ● ' /tmp/173-c1.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R1)\b')" = 0 && grep -E '^  ● ' /tmp/173-c1.txt | grep -qE '#173 R1\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c1.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/theme/__tests__/font-registration.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)'

# -- c2 R1 verde (paso 1, a mano): implementa "R1 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c2 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M31 && test "$(grep -cF "'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf')," src/app/_layout.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c2.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +20 passed, 20 total$' /tmp/173-c2.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c2.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add assets/fonts/Inter-ExtraBold.ttf src/app/_layout.tsx src/theme/global.css && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/assets/fonts/Inter-ExtraBold.ttf mobile-pet-tracker/src/app/_layout.tsx mobile-pet-tracker/src/theme/global.css ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): registra Inter-ExtraBold como sexto peso (#173 R1)'

# -- c3 R2 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R2 (1)" de tasks.md (ningun fichero de produccion) --
# -- c3 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c3.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c3.txt && test "$(grep -E '^  ● ' /tmp/173-c3.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R2)\b')" = 0 && grep -E '^  ● ' /tmp/173-c3.txt | grep -qE '#173 R2\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c3.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/theme/__tests__/global-css.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/global-css.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2)'

# -- c4 R2 verde (paso 1, a mano): implementa "R2 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c4 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M33 M34 M38 M39 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c4.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +20 passed, 20 total$' /tmp/173-c4.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c4.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/theme/global.css && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/global.css ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): tokens de radio hero y tile y tamaños 13 y 26 (#173 R2)'

# -- c5 R3 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R3 (1)" de tasks.md (ningun fichero de produccion) --
# -- c5 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c5.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c5.txt && test "$(grep -E '^  ● ' /tmp/173-c5.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R3)\b')" = 0 && grep -E '^  ● ' /tmp/173-c5.txt | grep -qE '#173 R3\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c5.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/components/__tests__/card.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/card.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): variantes hero y flat de Card sin sombra (#173 R3)'

# -- c6 R3 verde (paso 1, a mano): implementa "R3 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c6 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && test "$(grep -cF "'rounded-hero bg-surface-secondary p-4.5'" src/components/card.tsx)" = 1 && test "$(grep -cF "'rounded-card border border-border bg-surface px-3.5 py-1'" src/components/card.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' > /tmp/173-c6.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +20 passed, 20 total$' /tmp/173-c6.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c6.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/components/card.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/card.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): variantes hero y flat de Card sin sombra (#173 R3)'

# -- c7 R4 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R4 (1)" de tasks.md (ningun fichero de produccion) --
# -- c7 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c7.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c7.txt && test "$(grep -E '^  ● ' /tmp/173-c7.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R4)\b')" = 0 && grep -E '^  ● ' /tmp/173-c7.txt | grep -qE '#173 R4\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c7.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/profile-canvas-fidelity.test.ts src/components/__tests__/pet-switcher.test.tsx src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): PetSwitcher con variante avatars en Perfil (#173 R4)'

# -- c8 R4 verde (paso 1, a mano): implementa "R4 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c8 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M36 && test "$(grep -cF 'variant="avatars"' src/screens/profile/index.tsx)" = 1 && test "$(grep -cF 'border-2 border-accent bg-accent-soft p-1' src/components/pet-switcher.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c8.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c8.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c8.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/components/pet-switcher.tsx src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/pet-switcher.tsx mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): PetSwitcher con variante avatars en Perfil (#173 R4)'

# -- c9 R5 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R5 (1)" de tasks.md (ningun fichero de produccion) --
# -- c9 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c9.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c9.txt && test "$(grep -E '^  ● ' /tmp/173-c9.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R5|#166 R2|#98 R10|#61 R4|#62 R7)\b')" = 0 && grep -E '^  ● ' /tmp/173-c9.txt | grep -qE '#173 R5\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c9.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): cápsula de añadir mascota en Perfil (#173 R5)'

# -- c10 R5 verde (paso 1, a mano): implementa "R5 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo), y la linea de E1 (Reanudacion 3) --
# -- c10 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M5 && test "$(grep -cF 'expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1 - 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload; // #158 R5: docs-upload-submit; // #173 R5' src/__tests__/consistency-classnames.test.ts)" = 1 && test "$(git diff --numstat -- src/__tests__/consistency-classnames.test.ts)" = "$(printf '1\t1\tmobile-pet-tracker/src/__tests__/consistency-classnames.test.ts')" && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c10.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c10.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c10.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/consistency-classnames.test.ts src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): cápsula de añadir mascota en Perfil (#173 R5)'

# -- c11 R6 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R6 (1)" de tasks.md (ningun fichero de produccion) --
# -- c11 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c11.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c11.txt && test "$(grep -E '^  ● ' /tmp/173-c11.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#168 R4|#173 R6|R7: cambiar foto|#173 R2|#173 R3|#98 R10|#64 R9|#62 R7|#61 R4)\b')" = 0 && grep -E '^  ● ' /tmp/173-c11.txt | grep -qE '#173 R6\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c11.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): hero de la mascota con anillo y cámara (#173 R6)'

# -- c12 R6 verde (paso 1, a mano): implementa "R6 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c12 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M3 M6 M45 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c12.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c12.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c12.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): hero de la mascota con anillo y cámara (#173 R6)'

# -- c13 R7 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R7 (1)" de tasks.md (ningun fichero de produccion) --
# -- c13 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c13.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c13.txt && test "$(grep -E '^  ● ' /tmp/173-c13.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#168 R5|#173 R7|#68 E1)\b')" = 0 && grep -E '^  ● ' /tmp/173-c13.txt | grep -qE '#173 R7\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c13.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/design-drift.test.ts src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): chips de Perfil con sexo localizado (#173 R7)'

# -- c14 R7 verde (paso 1, a mano): implementa "R7 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c14 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M13 M28 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c14.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c14.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c14.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add ../docs/ui-guidelines.md ../specs/mobile-ui-language/design.md src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx mobile-pet-tracker/src/screens/profile/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): chips de Perfil con sexo localizado (#173 R7)'

# -- c15 R8 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R8 (1)" de tasks.md (ningun fichero de produccion) --
# -- c15 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c15.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c15.txt && test "$(grep -E '^  ● ' /tmp/173-c15.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R8|#61 R9|R2: estructura Figma|#173 R13)\b')" = 0 && grep -E '^  ● ' /tmp/173-c15.txt | grep -qE '#173 R8\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c15.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/providers/__tests__/language-provider.test.tsx src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): información en Card flat con estado del collar (#173 R8)'

# -- c16 R8 verde (paso 1, a mano): implementa "R8 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c16 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M10 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c16.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c16.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c16.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/legibility-classnames.test.ts src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/screens/profile/index.tsx ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): información en Card flat con estado del collar (#173 R8)'

# -- c17 R9 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R9 (1)" de tasks.md (ningun fichero de produccion) --
# -- c17 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c17.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c17.txt && test "$(grep -E '^  ● ' /tmp/173-c17.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R9)\b')" = 0 && grep -E '^  ● ' /tmp/173-c17.txt | grep -qE '#173 R9\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c17.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): última señal relativa en Perfil (#173 R9)'

# -- c18 R9 verde (paso 1, a mano): implementa "R9 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c18 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c18.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c18.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c18.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): última señal relativa en Perfil (#173 R9)'

# -- c19 R10 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R10 (1)" de tasks.md (ningun fichero de produccion) --
# -- c19 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c19.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c19.txt && test "$(grep -E '^  ● ' /tmp/173-c19.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#168 R6|#173 R10|#41 R9|R10 \(mobile-device-pairing|#173 R2|#62 R7|#62 R14|#98 R10|#173 R13)\b')" = 0 && grep -E '^  ● ' /tmp/173-c19.txt | grep -qE '#173 R10\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c19.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/consistency-classnames.test.ts src/__tests__/profile-canvas-fidelity.test.ts src/providers/__tests__/language-provider.test.tsx src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): rejilla 2x2 de accesos en Perfil (#173 R10)'

# -- c20 R10 verde (paso 1, a mano): implementa "R10 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c20 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M1 M2 M12 M14 M15 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c20.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c20.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c20.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/ui-copy-table.ts src/i18n/catalog.ts src/screens/profile/index.tsx ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/screens/profile/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): rejilla 2x2 de accesos en Perfil (#173 R10)'

# -- c21 R11 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R11 (1)" de tasks.md (ningun fichero de produccion) --
# -- c21 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c21.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c21.txt && test "$(grep -E '^  ● ' /tmp/173-c21.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R11|R4: toggle persiste|#65 R14|#168 R7|#173 R3|#173 R2|#173 R13)\b')" = 0 && grep -E '^  ● ' /tmp/173-c21.txt | grep -qE '#173 R11\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c21.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/profile-canvas-fidelity.test.ts src/providers/__tests__/language-provider.test.tsx src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): cuenta en Card flat con Switch e idioma (#173 R11)'

# -- c22 R11 verde (paso 1, a mano): implementa "R11 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c22 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M8 M9 M11 M46 M47 M48 M49 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c22.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c22.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c22.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/legibility-classnames.test.ts src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/screens/profile/index.tsx ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.tsx specs/mobile-ui-language/design.md ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): cuenta en Card flat con Switch e idioma (#173 R11)'

# -- c23 R12 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R12 (1)" de tasks.md (ningun fichero de produccion) --
# -- c23 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c23.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c23.txt && test "$(grep -E '^  ● ' /tmp/173-c23.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R12|#168 R4)\b')" = 0 && grep -E '^  ● ' /tmp/173-c23.txt | grep -qE '#173 R12\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c23.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): entrada escalonada de Perfil (#173 R12)'

# -- c24 R12 verde (paso 1, a mano): implementa "R12 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c24 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c24.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c24.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c24.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): entrada escalonada de Perfil (#173 R12)'

# -- c25 R13 refactor (paso 1, a mano): haz "R13" de tasks.md: terminos finales de catalogo y tabla de copy (sin cambio de conducta) --
# -- c25 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M25 M26 M27 && test "$(grep -cF 'toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8)' src/__tests__/ui-language.test.ts)" = 1 && test "$(grep -cE -- '- 4 \+ 3,? // #173 R13$' src/providers/__tests__/language-provider.test.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c25.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c25.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c25.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/ui-language.test.ts src/providers/__tests__/language-provider.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'refactor(mobile): términos finales de catálogo y tabla de copy de Perfil (#173 R13)'

# -- c26 R14 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R14 (1)" de tasks.md (ningun fichero de produccion) --
# -- c26 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c26.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c26.txt && test "$(grep -E '^  ● ' /tmp/173-c26.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (#173 R14)\b')" = 0 && grep -E '^  ● ' /tmp/173-c26.txt | grep -qE '#173 R14\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c26.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/__tests__/profile-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): enmiendas de #173 a carta y specs (#173 R14)'

# -- c27 R14 docs (paso 1, a mano): escribe "R14 (2)" de tasks.md: enmienda en la carta, conventions y las 9 specs; casilla SIN marcar --
# -- c27 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M50 M51 && test "$(grep -cF '**Control, tile, input, botón y píldora de dato** → `rounded-xl`' ../docs/ui-guidelines.md)" = 1 && test "$(grep -cF -- '- [ ] Enmienda #173 aprobada por humano' ../docs/ui-guidelines.md)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c27.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c27.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c27.txt && git add ../docs/conventions.md ../docs/ui-guidelines.md ../specs/mobile-chunky-cta/requirements.md ../specs/mobile-device-pairing/requirements.md ../specs/mobile-geofences/requirements.md ../specs/mobile-home-weekly-activity/requirements.md ../specs/mobile-pets-profile/requirements.md ../specs/mobile-tab-headers-canvas/requirements.md ../specs/mobile-ui-consistency-polish/requirements.md ../specs/mobile-ui-language/requirements.md ../specs/mobile-ui-legibility-polish/requirements.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/conventions.md docs/ui-guidelines.md specs/mobile-chunky-cta/requirements.md specs/mobile-device-pairing/requirements.md specs/mobile-geofences/requirements.md specs/mobile-home-weekly-activity/requirements.md specs/mobile-pets-profile/requirements.md specs/mobile-tab-headers-canvas/requirements.md specs/mobile-ui-consistency-polish/requirements.md specs/mobile-ui-language/requirements.md specs/mobile-ui-legibility-polish/requirements.md ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'docs(ui): enmiendas de #173 a carta y specs (#173 R14)'

# -- c28 R17 rojo (paso 1, a mano): escribe SOLO los tests/candados de "R17 (1)" de tasks.md (ningun fichero de produccion) --
# -- c28 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 -i --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c28.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +[0-9]+ failed, ' /tmp/173-c28.txt && test "$(grep -E '^  ● ' /tmp/173-c28.txt | grep -vxF '  ● Console' | grep -cvE '^  ● (R2: estructura Figma)\b')" = 0 && grep -E '^  ● ' /tmp/173-c28.txt | grep -qE '#173 R17\b' && ! grep -qE "Test suite failed to run|ReferenceError:|SyntaxError:|Cannot find module|reading 'canceled'|Exceeded timeout" /tmp/173-c28.txt && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/173-tsc.txt 2>&1; true; } && test "$(grep 'error TS' /tmp/173-tsc.txt | grep -cvE '^src/[^(]+\.test\.tsx?\(')" = 0 && { bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; true; } && ! grep -qF 'Failed to run' /tmp/173-lint.txt && test "$(grep -E '^/' /tmp/173-lint.txt | grep -cvE '\.test\.tsx?$')" = 0 && git add src/screens/profile/index.test.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): contenedor de Perfil con las métricas del artboard (#173 R17)'

# -- c29 R17 verde (paso 1, a mano): implementa "R17 (2)" de tasks.md, y su "(3)" si lo hay (ningun test nuevo) --
# -- c29 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre M41 M42 M43 M44 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c29.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c29.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c29.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/screens/profile/index.tsx && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/profile/index.tsx ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'feat(mobile): contenedor de Perfil con las métricas del artboard (#173 R17)'

# -- c30 R15 nace-verde (paso 1, a mano): escribe los candados de "R15 (1)" de tasks.md (nacen verdes; su rojo lo demuestra la sonda S15) --
# -- c30 (paso 2) cadena --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py cierre && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-c30.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-c30.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-c30.txt && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1 && test ! -s /tmp/173-lint.txt && git add src/__tests__/profile-canvas-fidelity.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts ' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'test(mobile): candados de grep-limpio de Perfil (#173 R15)'

# -- S15 sonda sobre el HEAD de c30 (NO se commitea) --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && sed -i "s/'rounded-hero bg-surface-secondary p-4\.5'/'rounded-hero bg-surface-secondary p-4.5 shadow-sm'/" src/components/card.tsx && grep -cF "p-4.5 shadow-sm'" src/components/card.tsx && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-s15.txt 2>&1; true; }; grep -E '^Tests:' /tmp/173-s15.txt; grep -E '^  ● ' /tmp/173-s15.txt | grep -vxF '  ● Console'; cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && git checkout HEAD -- src/components/card.tsx && git diff --cached --quiet && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')"; echo "limpio=$?"
   -> 1 ; Tests: 1 failed, <n> passed, <n+1> total ; UNA sola linea `  ● #173 R15: grep-limpio › ...` ; limpio=0
   (si sale 0 en el grep -cF, la sonda no se planto: PARA. Si limpio no es 0, PARA)

== CIERRE ==
# -- K1 its estaticos finales: ejecuta el <IT> de cada fichero de test tocado y apunta los numeros en el impl (sin valor esperado) --
# -- K2 BASE21 final --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/welcome/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/profile/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/hero-header-amendments.test.ts src/theme/__tests__/motion.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/card.test.tsx src/components/__tests__/pet-switcher.test.tsx src/theme/__tests__/font-registration.test.ts 'src/app/(tabs)/__tests__/profile.test.tsx' src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/screens.test.tsx' src/__tests__/profile-canvas-fidelity.test.ts > /tmp/173-k2.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +21 passed, 21 total$' /tmp/173-k2.txt && grep -qE '^Tests: +([0-9]+) passed, \1 total$' /tmp/173-k2.txt && grep -E '^Tests:' /tmp/173-k2.txt
   -> exit=0 ; Tests: K passed, K total   (K es tu numero; apuntalo)
# -- K3 ALL, tras la espera --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && for i in $(seq 1 90); do pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null || break; sleep 60; done; echo fin-espera
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/173-kall.txt 2>&1; echo "exit=$?"
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && K=$(sed -nE 's/^Tests: +([0-9]+) passed, \1 total$/\1/p' /tmp/173-k2.txt) && test -n "$K" && T=$((3101 + K - 878)) && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/173-kall.txt && grep -qE "^Tests: +$T passed, $T total$" /tmp/173-kall.txt && echo "all-ok T=$T"
   -> exit=0 ; all-ok T=<3101 + K - 878>
   El aviso de worker force-exit al final del ALL es preexistente y no cuenta.
   Si el ALL sale rojo SOLO con `reading 'canceled'` en its de 'R7: cambiar foto' o '#168 R4':
     1. haz la espera y repite el ALL una vez;
     2. si se repite igual, corre
        cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/profile/index.test.tsx
        dos veces. Las dos deben salir verdes;
     3. comprueba que la linea Tests: del ALL sigue sumando el total T;
     4. pega las tres lineas Tests: en Desviaciones, como "flake conocido #72/#168", y sigue.
   Cualquier otro rojo: PARA.
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bun run typecheck; echo "exit=$?"
   -> exit=0
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/173-lint.txt 2>&1; echo "exit=$?"; ! grep -qF 'Failed to run' /tmp/173-lint.txt && test ! -s /tmp/173-lint.txt && echo lint-ok
   -> exit=0 ; lint-ok
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && git log --oneline adad3359295766758851761dce337f028671bc4b..HEAD | wc -l
   -> 30
# -- K4 trazabilidad (commit unico) y despues el impl con --only --
Rellena specs/mobile-tab-screens-canvas-fidelity/traceability.md:
  - cada fila lleva el test (fichero::describe) y el hash + mensaje de sus commits (rojo y verde);
  - la fila de R13 lista c14, c16, c18, c20, c22 y c25;
  - la de R16 se queda "pendiente (gate humano: casilla de requirements §Aprobación)" | n/a.
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && git add ../specs/mobile-tab-screens-canvas-fidelity/traceability.md && test "$(git diff --cached --no-renames --name-only)" = 'specs/mobile-tab-screens-canvas-fidelity/traceability.md' && git diff --quiet -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf' && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ':!assets/fonts/Inter-ExtraBold.ttf')" && git commit -m 'docs(mobile-tab-screens-canvas-fidelity): trazabilidad de #173'
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && git add ../progress/impl_mobile-tab-screens-canvas-fidelity.md && git commit --only ../progress/impl_mobile-tab-screens-canvas-fidelity.md -m 'docs(mobile-tab-screens-canvas-fidelity): informe de implementación de #173'
# -- K5 lista cerrada contra <H0> --
cd /home/claude/sites/Pet-Tracker-wt-173/mobile-pet-tracker && test "$(git diff --no-renames --name-only adad3359295766758851761dce337f028671bc4b..HEAD -- .. | grep -vxE 'feature_list\.json|progress/current\.md|progress/handoff_mobile-tab-screens-canvas-fidelity\.md|specs/mobile-tab-screens-canvas-fidelity/(requirements|design|tasks)\.md|specs/mobile-tab-screens-canvas-fidelity/mcheck\.py|progress/review_mobile-tab-screens-canvas-fidelity\.md' | LC_ALL=C sort | tr '\n' ' ')" = 'docs/conventions.md docs/ui-guidelines.md mobile-pet-tracker/assets/fonts/Inter-ExtraBold.ttf mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/_layout.tsx mobile-pet-tracker/src/components/__tests__/card.test.tsx mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx mobile-pet-tracker/src/components/card.tsx mobile-pet-tracker/src/components/pet-switcher.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx mobile-pet-tracker/src/screens/profile/index.tsx mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts mobile-pet-tracker/src/theme/__tests__/global-css.test.ts mobile-pet-tracker/src/theme/global.css progress/impl_mobile-tab-screens-canvas-fidelity.md specs/mobile-chunky-cta/requirements.md specs/mobile-device-pairing/requirements.md specs/mobile-geofences/requirements.md specs/mobile-home-weekly-activity/requirements.md specs/mobile-pets-profile/requirements.md specs/mobile-tab-headers-canvas/requirements.md specs/mobile-tab-screens-canvas-fidelity/traceability.md specs/mobile-ui-consistency-polish/requirements.md specs/mobile-ui-language/design.md specs/mobile-ui-language/requirements.md specs/mobile-ui-legibility-polish/requirements.md ' && echo lista-ok
   -> lista-ok   (las 33 rutas de §Lista cerrada, abajo; si sale otra, PARA)

== REGLAS CRITICAS ==
- NO prettier, en ninguna forma (ni bunx prettier ni --fix de prettier). Formatea a mano, imitando el fichero.
- Nunca `rm -f .expo/types/router.d.ts`: `test ! -e`, y si existe PARA.
- Un commit = un R y un tipo (rojo test / verde feat). Nunca --amend, rebase, push, PR ni merge.
- NO lances ./init.sh.
- Si un eslabon falla (y no es el caso de "Reintento"), PARA y reporta el eslabon y la salida exacta. No
  ajustes tests ni candados para que cuadre.
- RNTL 14: `await render(...)`, `await fireEvent.press(...)`, `await act(...)` siempre.
  - Nodos ocultos a accesibilidad: `{ includeHiddenElements: true }`.
  - `within(x)` no ve la raiz `x`.
  - Recuentos por hijos (`children.length`, orden de testID), no `getAllByTestId(...).length`.
- Clases en los tests: literales escritos en el test, nunca importados de produccion.
- Candados globales: solo por delta sobre la base, cada termino con `// #173 Rn`. Ninguna cifra se recalcula
  a mano.
- Catalogo, tabla de copy, design.md de ui-language y termino de longitud viajan en el MISMO commit verde que
  la llamada t(...) que los usa (tasks.md §Reglas comunes).
- Comentarios de trazabilidad `// #173 Rn`; nunca `#173` suelto seguido de letra hex (HEX_LITERAL de
  design-drift). Nada de clases arbitrarias `algo-[...]`, ni en tests.
- La casilla de la enmienda se escribe SIN marcar en los 10 ficheros: `- [ ] Enmienda #173 aprobada por
  humano`. La marca el humano.
- R16 (prueba de humo en dev build de Android) NO la corres: queda "pendiente (humano)".
- No toques:
  - feature_list.json, progress/current.md ni este handoff;
  - requirements/design/tasks.md de #173 ni specs/mobile-tab-screens-canvas-fidelity/mcheck.py;
  - progress/review_mobile-tab-screens-canvas-fidelity.md;
  - ningun fichero fuera de la lista cerrada.
- La sonda S15 nunca se commitea. Revierte con `git checkout HEAD -- <f>` y exige limpio=0.
```

## Lista cerrada (`git diff --no-renames --name-only <H0>..HEAD`, sin los excluidos, `LC_ALL=C sort`)

```text
docs/conventions.md
docs/ui-guidelines.md
mobile-pet-tracker/assets/fonts/Inter-ExtraBold.ttf
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/components/__tests__/card.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx
mobile-pet-tracker/src/components/card.tsx
mobile-pet-tracker/src/components/pet-switcher.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
mobile-pet-tracker/src/theme/__tests__/font-registration.test.ts
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/global.css
progress/impl_mobile-tab-screens-canvas-fidelity.md
specs/mobile-chunky-cta/requirements.md
specs/mobile-device-pairing/requirements.md
specs/mobile-geofences/requirements.md
specs/mobile-home-weekly-activity/requirements.md
specs/mobile-pets-profile/requirements.md
specs/mobile-tab-headers-canvas/requirements.md
specs/mobile-tab-screens-canvas-fidelity/traceability.md
specs/mobile-ui-consistency-polish/requirements.md
specs/mobile-ui-language/design.md
specs/mobile-ui-language/requirements.md
specs/mobile-ui-legibility-polish/requirements.md
```

Excluidos:
- `feature_list.json`, `progress/current.md` y este handoff;
- `specs/mobile-tab-screens-canvas-fidelity/{requirements,design,tasks}.md` y `mcheck.py`;
- `progress/review_mobile-tab-screens-canvas-fidelity.md`.

Son ficheros del leader.

## Criterios de terminado

- Los 30 commits c1–c30 están en orden, con los mensajes de arriba. Después
  van la trazabilidad y el impl.
- Ningún commit mezcla tests rojos con implementación.
- Todas las cadenas terminaron en `git commit`, sin que fallara ningún eslabón.
  Si hubo reintentos, están anotados.
- La sonda S15 dio un solo `●`, de `#173 R15`, y `limpio=0`.
- El mcheck de cierre de c30 sale con `exit=0`: M1–M51 = «Al cerrar».
- K2–K5 en verde: BASE21 = K; ALL = 104 suites y `3101 + K − 878` tests;
  typecheck y lint limpios; 30 commits; lista cerrada exacta.
- R16 queda pendiente del humano. Las 10 casillas de enmienda, sin marcar.

## Contenido de `progress/impl_mobile-tab-screens-canvas-fidelity.md`

1. H0 (hash) y las salidas de B0–B2, con el fichero `/tmp/173-m-h0.txt` pegado
   entero.
2. Tabla de anclas H0 con lo medido. Todas deben coincidir.
3. Skills que cargaste de verdad, por nombre, y para qué sirvió cada una.
4. Tabla por commit:
   - hash, mensaje, R, tipo y línea `Tests:` literal;
   - en los rojos, además, la lista de `●` (sin `Console`) y si tsc/lint dieron
     errores en tests: código TS y fichero.
5. Sonda S15: línea `Tests:`, el `●` y `limpio=`.
6. Salida entera del mcheck de cierre de c30.
7. Cierre K1–K5 con sus salidas literales. En K1, los `<IT>` finales.
8. Desviaciones: todo lo que no salió como dice este handoff, con la salida
   exacta. Incluye los reintentos y el flake de K3. Si no hubo ninguna, escribe
   «ninguna».
9. R16: «pendiente (humano)».
