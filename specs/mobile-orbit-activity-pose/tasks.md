---
feature: "mobile-orbit-activity-pose"
status: draft        # draft | approved
tags: [mobile, ui, mascota, orbit, spec]
---

# Tareas — [[mobile-orbit-activity-pose]] (#225)

> Requisitos en [[requirements]]; diseño en [[design]].
> La rama `feature/225-mobile-orbit-activity-pose` debe contener #221 mergeada en
> `dev`, y [[requirements]] §Re-verificar al mergear #221 debe estar en verde
> antes de C1.
> El renombrado (R2 a R4) va antes que la pose (R5 a R8).
> Commits test-primero: cada rojo es su propio commit y cae por una aserción,
> nunca por `ReferenceError` ni «Cannot find module» (CHECKPOINTS C4).
> En un commit rojo solo se exige jest rojo por aserción; `typecheck` y `lint`
> se exigen en verde en cada commit verde.
> Los comandos se ejecutan desde `mobile-pet-tracker/`. La ruta posicional de
> jest es una regex, y ninguna de estas rutas lleva paréntesis.

## R2: nueve poses `orbit-*` (C1, C2)

- [ ] **(1) C1 test rojo.** Crear `src/__tests__/orbit-rename.test.ts` con el `it`
  «`#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve`»
  ([[design]] §5).
  - Rojo esperado en `bunx jest src/__tests__/orbit-rename.test.ts`: la aserción
    de `readdirSync('assets/images').filter(/pingo/i)` contra `[]`.
  - Commit: `test(mobile): R2 red, mascot images named orbit-* (#225)`.
- [ ] **(2) C2 implementación mínima.** Cuatro cambios en el mismo commit:
  - `git mv` de los 9 `assets/images/pingo-*.webp` a `orbit-*.webp`;
  - en producción y en test, reemplazar `pingo-` por `orbit-` en toda cadena que
    nombre un `.webp`: `require`, `testUri`, `it.each` de formato,
    `not.toContain('pingo-….webp')` y similares. Las líneas de [[design]] §4 no
    se tocan;
  - enmendar `#221 R3` en `orbit-rename-copy.test.ts`: borrar el bloque `images`
    y el bucle `for (const path of sourceFiles())`, con sufijo `(enmendado por #225 R2)`;
  - enmendar `no mete otras poses de Pingo` en `screens/welcome/index.test.tsx`:
    regex y lista con `orbit-*` (9 nombres), sufijo `(enmendado por #225 R2)`.

  Verde: `bunx jest` completo, `bun run typecheck`, `bun run lint`.
  Commit: `feat(mobile): R2 rename mascot images to orbit-* (#225)`.
- [ ] **(3) Refactor.** Ninguno previsto.

## R3 y R4: código sin Pingo (C3, C4)

- [ ] **(1) C3 test rojo.** Añadir a `src/__tests__/orbit-rename.test.ts` los
  cuatro `it` de R3 y los dos de R4 ([[requirements]] R3 y R4; [[design]] §3, §4 y §5).
  La lista de excepciones lleva las filas `A y B` de [[design]] §4 más las del caso
  que nombra el handoff: 23 entradas en caso A y 21 en caso B.
  Rojo esperado:
  - R3 cae por `existsSync(<ruta nueva>)` a `false` y por coincidencias de
    `/pingo/i` en producción;
  - el primer `it` de R4 lista las líneas de test sin renombrar. Son las que da el
    paso 3 de [[requirements]] §Re-verificar al mergear #221: 296 en los dos casos
    el 2026-10-28;
  - el segundo `it` de R4 **nace verde** en los dos casos: el paso 3 ya comprobó que
    todas las entradas casan. Su mutación es M3 de [[design]] §8. Cualquier
    descuadre es un error de la spec: para y repórtalo.

  Commit: `test(mobile): R3 R4 red, no Pingo in production or test code (#225)`.
- [ ] **(2) C4 implementación mínima.** En el mismo commit:
  - `git mv` de los 3 módulos y de los 2 tests colocados ([[requirements]] §Mapa de nombres);
  - reemplazo con caja conservada en todo el código de producción;
  - reemplazo en el código de test según [[design]] §2, que conserva títulos,
    comentarios y la lista de §4;
  - en `src/i18n/catalog.ts`, renombrar las 7 claves en `en` y en `es` sin tocar sus valores;
  - en `ui-copy-table.ts`, las 7 filas con la clave nueva; las 4 de la frase con
    `file: 'src/screens/home/orbit-phrase.ts'`;
  - en `specs/mobile-ui-language/design.md`, la sección
    `### §2.<N> — Añadidos por #225 — Orbit renombrado y su pose de actividad`
    con las 7 filas `← renombrada desde … por #225 (R3)`. `<N>` es el número de la
    última sección `§2.*` del fichero + 1;
  - las enmiendas de C4 de [[requirements]] §Candados enmendados: `#221 R1`,
    `#221 R3` y `#167 R5`, todas con sufijo `(enmendado por #225 R3)`.

  Verde: `bunx jest` completo, `bun run typecheck`, `bun run lint`. Además,
  `git grep -il pingo -- src ':!**/__tests__/**' ':!**/*.test.ts' ':!**/*.test.tsx' | wc -l`
  da `0`. Opcional: `graphify update .`.
  Commit: `feat(mobile): R3 R4 rename Pingo identifiers to Orbit (#225)`.
- [ ] **(3) Refactor.** Ninguno previsto: el reemplazo es mecánico.

## R5: `orbit-walk.webp` (C5, C6)

- [ ] **(1) C5 test rojo.** Crear `src/__tests__/orbit-activity-pose.test.ts` con
  los dos `it` de R5.
  - Rojo esperado: `expect(existsSync(…/orbit-walk.webp)).toBe(true)`.
  - El `it` del maestro **nace verde**, porque el autor de la spec ya congeló
    `design-src/`. Su mutación es renombrar el PNG.

  Commit: `test(mobile): R5 red, walking pose asset (#225)`.
- [ ] **(2) C6 implementación mínima.** Dos cambios en el mismo commit:
  - la conversión de [[design]] §7, desde la raíz del worktree, que debe dar la
    salida esperada del comando `node` de ese apartado;
  - la enmienda de `no mete otras poses de Pingo` en `src/screens/welcome/index.test.tsx`
    a la lista de 10 de [[requirements]] §Candados enmendados, con sufijo
    `(enmendado por #225 R5)`. Sin ella, el asset nuevo pone ese `it` en rojo.

  Verde: `bunx jest src/__tests__/orbit-activity-pose.test.ts src/screens/welcome/index.test.tsx`.
  Commit: `feat(mobile): R5 add orbit-walk.webp (#225)`.
- [ ] **(3) Refactor.** Ninguno.

## R6: `homeOrbitPose` (C7, C8)

- [ ] **(1) C7 test rojo.** Añadir a `src/screens/home/orbit-phrase.test.ts` el
  `describe('#225 R6: homeOrbitPose elige la pose por la frase')` con sus tres
  bloques ([[requirements]] R6).
  - Cada `it` empieza por `expect(typeof phrase.homeOrbitPose).toBe('function')`
    sobre el módulo de `jest.requireActual('./orbit-phrase')`.
  - Rojo esperado: esa aserción.

  Commit: `test(mobile): R6 red, home orbit pose follows the phrase (#225)`.
- [ ] **(2) C8 implementación mínima.** `export function homeOrbitPose` en
  `src/screens/home/orbit-phrase.ts` ([[design]] §6).
  Verde: `bunx jest src/screens/home/orbit-phrase.test.ts`, `bun run typecheck`.
  Commit: `feat(mobile): R6 homeOrbitPose (#225)`.
- [ ] **(3) Refactor.** Ninguno.

## R1 y R7: Inicio pinta la pose y su etiqueta (C9, C10)

- [ ] **(1) C9 test rojo.** En el mismo commit:
  - el `it` de R1 en `src/__tests__/orbit-activity-pose.test.ts`;
  - la fila `{ file: 'src/screens/home/index.tsx', key: 'home.orbitWalkLabel' }`
    al final de `R3_HOME` en `ui-copy-table.ts`;
  - las enmiendas de `#71 R11` en `src/__tests__/ui-language.test.ts` (`+ 1`, `// +1 #225 R1`)
    y de `#194 R1` en `src/providers/__tests__/language-provider.test.tsx` (`+ 1, // #225 R1`),
    ambas con sufijo `(enmendado por #225 R1)`;
  - el `describe('#225 R7: …')` con sus 4 `it` en `src/screens/home/index.test.tsx`;
  - la enmienda de `pinta pingo-talk como único hijo directo del envoltorio y sin etiqueta (enmendado por #195 R16)`
    (#190 R4, fixture `Calm`), con sufijo `(enmendado por #225 R7)`.

  Rojo esperado:
  - R1: `en['home.orbitWalkLabel']` es `undefined`;
  - `#194 R1`: largo del catálogo;
  - el candado de usos de `ui-language.test.ts`: la clave no se usa en `index.tsx`;
  - R7: los dos `it` de `walk` (el `source` es `orbit-talk`).

  Nacen verdes, porque hoy la pose es siempre talk: los dos `it` de `talk` de R7
  y `#190 R4` enmendado. Sus mutaciones son M5 y M8 de [[design]] §8. Los
  sujetos (`home-orbit-text`, `home-orbit`) existen desde C4.
  Commit: `test(mobile): R1 R7 red, walking pose and label on Home (#225)`.
- [ ] **(2) C10 implementación mínima.** En el mismo commit:
  - `home.orbitWalkLabel` en `en` y `es` de `catalog.ts`, tras `home.orbitPhraseCalm`;
  - la pose y la etiqueta en `src/screens/home/index.tsx` ([[design]] §6);
  - la fila R1 en la sección de #225 de `specs/mobile-ui-language/design.md`.

  Verde: `bunx jest src/screens/home src/__tests__ src/providers`,
  `bun run typecheck`, `bun run lint`.
  Commit: `feat(mobile): R1 R7 Orbit walks on Home when the phrase is about activity (#225)`.
- [ ] **(3) Refactor.** Ninguno.

## R8: cierre de H3 (C11, C12)

- [ ] **(1) C11 test rojo.** Añadir el `it` de R8 a `src/__tests__/orbit-activity-pose.test.ts`.
  Lee `../specs/mobile-home-pingo-phrase/requirements.md` tras su `existsSync` y
  aserta tres cosas:
  - `not.toContain('(H3 pendiente: pose placeholder.)')`;
  - `toContain` del literal nuevo de R4;
  - `toContain(' Cerrada por #225 (R8).')`.

  Rojo esperado: la primera aserción.
  Commit: `test(mobile): R8 red, close #190 H3 (#225)`.
- [ ] **(2) C12 implementación mínima.** Editar `specs/mobile-home-pingo-phrase/requirements.md`
  según R8, sin tocar su §Aprobación.
  Verde final: `bunx jest` completo, `bun run typecheck`, `bun run lint`.
  Commit: `docs(spec): R8 close #190 H3 with the walking pose (#225)`.
- [ ] **(3) Refactor.** Ninguno.

## Cierre

- [ ] Rellenar `traceability.md` con test y hash de cada R-id en un commit
  `docs(spec)` aparte. No rebasear después.
- [ ] `progress/impl_mobile-orbit-activity-pose.md` con la salida de los verdes y
  la de la conversión de [[design]] §7.
- [ ] R9 no es de Codex: Codex no toca `docs/ui-guidelines.md` ni las líneas
  «R9 la borra». El leader aplica R9 en un commit propio cuando el humano firme la
  casilla G4 de [[requirements]] §Aprobación. Sus enmiendas son las de
  §Candados enmendados marcadas «R9». La fila R9 de `traceability.md` queda
  `pendiente (G4)` en el reporte de Codex.
