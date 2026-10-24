---
feature: "mobile-jest-virtual-mock-poisoning"
status: approved     # draft | spec_ready | approved
tags: [mobile, test-infra, spec]
---

# Requisitos — [[mobile-jest-virtual-mock-poisoning]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[traceability]] para la trazabilidad. [[../../docs/architecture|architecture]]
> describe solo las capas de backend; este cambio es de infraestructura de tests
> de `mobile-pet-tracker/src/` y no cruza ninguna capa ni toca producción.

## Contexto

- Origen: diagnóstico del flake de tinte `Expected: "color:foreground"` /
  `Received: "#0D1117"` (fallback claro del hook REAL `useThemeColors`), registrado
  como deuda en el cierre de #200 y vuelto a ver en #198. El diagnóstico está
  confirmado empíricamente; se resume en [[design]] §Premisa verificada.
- Base: `origin/dev` en `329c613c` (rama `feature/207-mobile-jest-virtual-mock-poisoning`).
  Sin dependencias de otras features.
- Problema: cuatro tests móviles mockean con la opción `virtual` módulos que SÍ
  existen. El mapa de IDs de módulo de `jest-resolve` es **uno por proceso** y no
  distingue qué fichero mockeó en modo virtual, así que el ID sin extensión que
  cachea un test virtual lo hereda cualquier test posterior del mismo proceso que
  mockee el mismo módulo sin la opción: su `jest.mock` queda registrado bajo otro
  ID, el componente carga el hook real y pinta `#0D1117`. Parece aleatorio porque
  el orden de ficheros dentro de un worker cambia entre corridas.
- Medición en esta base (2026-10-24, jest 29.7.0, `--runInBand` con una caché de
  jest vacía): `src/screens/meal-schedule/index.test.tsx` seguido de
  `src/components/__tests__/back-button.test.tsx` da `1 failed, 87 passed, 88 total`
  (falla `#172 R2: pinta ChevronLeft de 24 en foreground`). Los cinco ficheros del
  criterio CC1, en el orden de CC1, dan `1 failed, 440 passed, 441 total`. Re-medido en
  `bc5a26e7` (dev con #199): `1 failed, 476 passed, 477 total` (errata E1).

## Definiciones

- **Opción virtual**: la clave `virtual` dentro del objeto de opciones (tercer
  argumento) de `jest.mock` o `jest.doMock`, con cualquier valor.
- **Test móvil**: todo fichero `*.test.ts` o `*.test.tsx` bajo `mobile-pet-tracker/src/`,
  a cualquier profundidad y también dentro de directorios `__tests__` y de
  directorios cuyo nombre lleva paréntesis (por ejemplo `src/app/(tabs)/__tests__/`).
- **Los cuatro tests**: `src/screens/food/index.test.tsx`,
  `src/screens/health/index.test.tsx`, `src/screens/meal-schedule/index.test.tsx` y
  `src/screens/profile/index.test.tsx`, todas relativas a `mobile-pet-tracker/`.
- **El candado**: el fichero `mobile-pet-tracker/src/__tests__/jest-virtual-mock-lock.test.ts`.
- **Ruta de violación**: la ruta del fichero relativa a `mobile-pet-tracker/src/`, con
  `/` como separador en cualquier sistema operativo.

## Requisitos funcionales

Clasificación según C4 (`CHECKPOINTS.md`). «Rojo, vía a»: el test se escribe antes que
la corrección y falla hoy por aserción. «Verificación, vía b»: asevera una propiedad
que ya se cumple en cuanto existe el candado y se cierra por mutación.

- **R1** (rojo, vía a): WHEN jest ejecuta `#207 R1` del candado, THE SYSTEM SHALL
  comprobar, en cada uno de los cuatro tests, que (a) el fichero sigue registrando con
  `jest.mock` el módulo real que mockeaba —`../../theme/use-theme-colors` en `food`,
  `health` y `meal-schedule`; `expo-image-picker` en `profile`— y (b) el fichero no
  contiene la opción virtual.
- **R2** (rojo, vía a, con una cláusula de verificación vía b): WHEN jest ejecuta
  `#207 R2` del candado, THE SYSTEM SHALL leer desde disco todos los tests móviles y
  fallar si alguno contiene la opción virtual, mostrando la ruta de violación de cada
  incumplimiento ordenada alfabéticamente; y THE SYSTEM SHALL fallar si ese recorrido
  no incluye al propio candado (`__tests__/jest-virtual-mock-lock.test.ts`), de modo
  que el recorrido no pueda ser vacío ni excluir los directorios `__tests__`.

## Fuera de alcance

- Cualquier cambio en código de producción de `mobile-pet-tracker/src/` (todo lo que
  no sea `*.test.ts(x)`), en `jest.config`/`package.json`, en `test/jest-setup.js` y en
  `docs/`. El único fichero nuevo de `mobile-pet-tracker/` es el candado.
- Las aserciones y los títulos de `it` y `describe` de los cuatro tests: no cambian
  (CC2 lo mide). Tampoco se «arregla» ninguna otra cosa en esos ficheros.
- Un test determinista de la contaminación (la reproducción del mecanismo dentro de
  jest). Queda fuera por las razones de [[design]] §Reproducción determinista; su
  sustituto es CC1, que corre el orden que falla.
- Una lista blanca de especificadores que de verdad no resuelven. Hoy no hay ninguno;
  si aparece, la salida es `moduleNameMapper` a un stub, en otra feature.
- Los tests fuera de `src/`: `app.assets.test.ts`, `app.config.test.ts` y
  `test/__tests__/render-with-providers.test.tsx` (cero ocurrencias de la opción
  virtual hoy, medido). El candado no los recorre; es una zona ciega declarada
  (pregunta abierta 1).
- El caso `#200 R9: mockRouter.push` llamado 0 veces (meal-schedule-link): el
  mecanismo de esta spec no lo explica. Queda abierto en [[design]] §Caso abierto.
- Otras causas de un `#0D1117` inesperado (un mock de `use-theme-colors` mal
  escrito en un test concreto, carga de la máquina). Esta spec cierra una causa, no
  declara la clase de rojo erradicada.
- Remedios sobre jest mismo: secuenciador, resolver o entorno propios,
  `--workerIdleMemoryLimit`, `isolateModules` por test.

## Criterios de cierre (no son requisitos)

- **CC1** (el síntoma real; lo mide el reviewer en A y en B): desde `mobile-pet-tracker/`,

  ```bash
  C=$(mktemp -d) && bunx jest --runInBand --silent --cacheDirectory="$C" --runTestsByPath \
    "$PWD/src/screens/profile/index.test.tsx" "$PWD/src/screens/food/index.test.tsx" \
    "$PWD/src/screens/meal-schedule/index.test.tsx" "$PWD/src/screens/health/index.test.tsx" \
    "$PWD/src/components/__tests__/back-button.test.tsx"; echo exit=$?
  ```

  En el commit A (candado sin corrección): `exit=1`, `Test Suites: 1 failed, 4 passed, 5 total` y
  `Tests: 1 failed, 476 passed, 477 total`, con `#172 R2: pinta ChevronLeft de 24 en foreground`
  como único rojo. En el commit B y en adelante: `exit=0`, `Test Suites: 5 passed, 5 total` y
  `Tests: 477 passed, 477 total` (cifras de la errata E1). La caché vacía
  fija el orden por tamaño de fichero (mayor primero), que deja `back-button` el último; una
  caché de jest previa lo reordena y vuelve el resultado engañoso. El `exit` se mide sin pipe.
- **CC2** (la corrección es mínima): `git diff --numstat <A>..<B> -- <los cuatro tests>`
  da `0	1` para `food`, `health` y `meal-schedule` y `1	1` para `profile`, y no hay
  ningún otro fichero cambiado entre A y B salvo `progress/` y `specs/`
  (tasks.md §Anclas).
- **CC3**: desde `mobile-pet-tracker/`, `bunx jest --runTestsByPath` del candado, de los
  cuatro tests, de `src/components/__tests__/back-button.test.tsx` y de
  `src/__tests__/design-drift.test.ts` sin ningún `it` en rojo; `bunx tsc --noEmit`
  sin errores; `bunx expo lint` con código de salida 0 medido sin pipe.
- **CC4**: la suite móvil completa (`./init.sh`, que corre el leader) sin ningún rojo,
  con T0 + 1 suite y T0 + 3 tests, donde T0 es el recuento que el leader mide en la
  base al lanzar el handoff. T0 en `bc5a26e7`: 146 suites / 5015 tests / 1 snapshot,
  así que el cierre da 147 / 5018 / 1 (errata E1).
- **CC5** (sin producción): `git diff --name-only <H0>..HEAD -- mobile-pet-tracker` lista
  exactamente cinco rutas tras B (el candado y los cuatro tests) y todas terminan en
  `.test.ts` o `.test.tsx`. La grep-clean de `docs/ui-guidelines.md` (§Decisiones fijas, punto 3) no cambia porque no
  se toca JSX, estilos ni `src/theme/`, y `design-drift` no recorre `__tests__/`.
- **CC6**: `traceability.md` sin filas «pendiente» y commits según `tasks.md` (C5).

**Errata E1 (2026-10-24).** Tras el merge de `origin/dev` con #199 (`bc5a26e7`) los cinco
ficheros de CC1 suman 477 tests, no 441: las cifras de CC1, de CC4 y de `tasks.md` (B) son
las de esa base (`progress/explore_207-cc1.md`, tres corridas en A y tres en B). CC1 se mide
sin `./init.sh` corriendo en la máquina. Otro jest concurrente es carga: con ella, `profile`
llegó a tardar 1062 s y dio rojos de tiempo (`#168 R4`, timeout de 5000 ms; `#173 R5`, `findByTestId` que
agota su 1 s) que no salen a solas. Si aparece un rojo distinto de `#172 R2`, se repite la
corrida una vez a solas; si persiste, es un rojo real y se para. `--testTimeout=30000` no lo
fija (no alarga el `findBy`), así que el comando de CC1 no cambia.

## Preguntas abiertas

Ninguna bloquea la firma.

1. **Zona ciega fuera de `src/`.** ¿Se amplía el recorrido del candado a `test/` y a los
   dos tests de la raíz de `mobile-pet-tracker/`? Por defecto no (la petición acota a
   `src/`), y el coste de ampliarlo después es añadir una raíz al recorrido.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-24)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4). Base `bc5a26e7` (dev con #199) más la
  errata E1 (cifras de CC1 y CC4). Pregunta abierta 1: no, el candado recorre solo `src/`.
  Las mutaciones commiteadas C a F son la vía b de `CHECKPOINTS.md` (C4) y se aceptan; el
  ámbito `test(mobile)` de los seis commits cumple C5. Prioridad: esta feature desbloquea el
  CI de #202 (PR #247), rojo dos veces seguidas en `#172 R2` con `#0D1117`.
