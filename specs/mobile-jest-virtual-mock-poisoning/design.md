---
feature: "mobile-jest-virtual-mock-poisoning"
status: approved     # draft | spec_ready | approved
tags: [mobile, test-infra, spec]
---

# Diseño — [[mobile-jest-virtual-mock-poisoning]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Esa guía describe
> solo backend; aquí el cambio es de infraestructura de tests de
> `mobile-pet-tracker/src/`.
> No hay `progress/explore_mobile-jest-virtual-mock-poisoning.md`: el diagnóstico lo
> hizo el leader en la sesión que registró la deuda (notas crudas en el scratchpad de
> esa sesión, no versionadas). Todo lo que esta spec necesita está copiado aquí, y cada
> afirmación sobre ficheros se re-verificó contra el árbol en `329c613c`.

## Premisa verificada

- **Versiones.** `jest`, `jest-resolve`, `jest-runtime` y `@jest/test-sequencer` 29.7.0;
  `jest-expo` 57.0.4 (`mobile-pet-tracker/node_modules/*/package.json`).
- **Mapa de IDs por proceso.** En `node_modules/jest-resolve/build/resolver.js`, la clase
  `Resolver` crea `this._moduleIDCache = new Map()` en su constructor.
  `getModuleID(virtualMocks, from, moduleName = '', options)` guarda y lee ese mapa con la
  clave `from + delimiter + moduleName + JSON(options)`. La clave **no incluye**
  `virtualMocks`. El valor sí depende de él: `_getAbsolutePath` llama a
  `_getVirtualMockPath(virtualMocks, from, moduleName, options)`, que devuelve la ruta sin
  extensión (`getModulePath(from, moduleName)`) si `virtualMocks.get(...)` es verdadero y,
  si no, `resolveModule(...)`, la ruta real con extensión (`.ts`).
- **Reparto del `Resolver`.** En `node_modules/jest-runner/build/testWorker.js`, el mapa
  `resolvers` (uno por worker) guarda `test.context.resolver`; con `--runInBand` el
  proceso entero comparte el mismo. `virtualMocks`, en cambio, es `this._virtualMocks` de
  cada `Runtime` de `jest-runtime/build/index.js`, es decir, por fichero de test. De ahí el
  desajuste: el valor cacheado por un test se hereda en otro que no mockeó en modo virtual.
- **Quién escribe y quién lee.** `setMock(from, moduleName, mockFactory, options)` marca
  `_virtualMocks` solo si `options?.virtual`, calcula `getModuleID` y registra la fábrica y
  `_explicitShouldMock` bajo ese ID. `_shouldMockCjs(from, moduleName, explicitShouldMock)`
  recalcula el ID del `require` del componente: si el mapa devuelve el ID sin extensión
  que dejó el test virtual, no coincide con el ID con extensión del `jest.mock` no virtual
  del test víctima, y se carga el módulo real.
- **Los cuatro envenenadores** (búsqueda de la opción en todo `src`, 2026-10-24):
  `src/screens/food/index.test.tsx`, `src/screens/health/index.test.tsx` y
  `src/screens/meal-schedule/index.test.tsx` mockean `../../theme/use-theme-colors` (módulo
  real, existe); `src/screens/profile/index.test.tsx` mockea `expo-image-picker` (paquete
  real, `~57.0.13` en `package.json`). No hay otra aparición en `src` ni en los tres tests
  fuera de `src`. Las ramas de las otras ocho worktrees abiertas (#196, #199, #201 a #206)
  tienen exactamente estos cuatro y ninguno más.
- **Víctima medida.** `src/components/__tests__/back-button.test.tsx` (`#172 R2`):
  `back-button.tsx` importa `../theme/use-theme-colors`, y `screen-header.tsx` importa
  `back-button`; al cargar la pantalla de Horario por un test virtual queda cacheado el ID
  sin extensión de ese par. Otras dos víctimas se vieron en una corrida alfabética de
  `main`: `celebration.test.tsx` (`#171 R14`) y `empty-state-hero.test.tsx` (`#176 R12`).
  El caso de `expo-image-picker` (clave desde `screens/profile/index.tsx`) no tiene víctima
  medida; la potencial es `src/app/(tabs)/__tests__/screens.test.tsx`, que lo mockea sin la
  opción.
- **Reproducción con comandos de serie** (medida en esta base, sin secuenciador propio): el
  secuenciador de jest ordena sin caché de rendimiento por tamaño de fichero, mayor
  primero. Con `--cacheDirectory` vacío, el orden de los cinco ficheros de CC1 es
  `profile` (95 832 B), `food` (73 760 B), `meal-schedule` (69 611 B), `health` (44 430 B) y
  `back-button` (3 670 B). Resultado en la base: `exit=1`, `1 failed, 440 passed, 441 total` (en `bc5a26e7`, 477 tests:
  errata E1 de [[requirements]]).
  El par `meal-schedule` + `back-button`: `1 failed, 87 passed, 88 total`. La simulación del
  arreglo (quitar la opción al transformar los cuatro ficheros) dejó los mismos ficheros en
  verde en 2 de 2 corridas.

## Skills de referencia

Ninguna skill de Expo aplica: no hay UI, rutas, datos ni animación. Esta spec no nombra
skills de Codex.

## Decisiones técnicas

- **D1. Quitar la opción, no cambiarla de sitio** (R1). Los dos módulos existen y se
  resuelven en jest; la fábrica de `jest.mock` ya sustituye al módulo real, así que la
  opción no hace falta. Con ella retirada, el ID del mock es el mismo con y sin ella en
  todos los ficheros. Si algún día un módulo dejara de resolver, la salida es
  `moduleNameMapper` a un stub, no la opción.
- **D2. Diff mínimo** (R1). En `food`, `health` y `meal-schedule` se borra la línea
  `  { virtual: true },` (tercer argumento de un `jest.mock(` repartido en líneas). En
  `profile` se reemplaza `}), { virtual: true });` por `}));` en el bloque
  `jest.mock('expo-image-picker', () => ({`. No se reformatea nada más: el móvil no tiene
  Prettier, y un reformateo ensancharía el diff y los conflictos con otras ramas. En
  `profile` el ancla es el contenido del bloque, no su línea: #196 edita ese mismo fichero
  en otra rama.
- **D3. Un candado nuevo en `src/__tests__/jest-virtual-mock-lock.test.ts`** (R2). Las
  guardas de fuente del repo viven en `src/__tests__/`, con nombre en kebab-case del tema
  (`consistency-classnames.test.ts`, `forms-validation-global.test.ts`,
  `heroui-text-size-merge.test.ts`). Se imita su cabecera: el trío `interface
  DirectoryEntry` + `declare function require(...)` para `fs` y `path`, `const { readdirSync,
  readFileSync } = require('fs')` y `join(process.cwd(), 'src')`. No se exporta ningún
  helper compartido: la convención es que cada guarda define el suyo (hay diez
  `sourceFiles` locales en `src/__tests__/`).
- **D4. El recorrido es el de `allTypeScriptFiles`, no el de `sourceFiles`** (R2).
  `design-drift.test.ts` define `allTypeScriptFiles` (recursivo, sin exclusiones) y
  `sourceFiles` (salta los directorios `__tests__`). Las otras guardas copian `sourceFiles`
  porque vigilan producción. Aquí hay que vigilar los tests, así que se copia el recorrido
  sin exclusiones y se filtra con `/\.test\.tsx?$/`. Copiar `sourceFiles` por inercia dejaría
  ciegos 93 de los 140 tests de `src` (los que viven en `__tests__/`).
- **D5. El patrón es la clave, no el valor** (R2). `/\bvirtual['"]?\s*:/` sobre el texto
  completo del fichero. Cualquier valor cuenta (`true`, una constante, `!0`): `false` es el
  valor por defecto y nadie lo escribe, y una variable permitiría eludir un patrón que solo
  mirase `true`. Los comentarios también cuentan: es conservador y un falso positivo es
  ruidoso y se arregla reescribiendo el comentario. Cubre `virtual:true`, `virtual : true` y
  `'virtual': true`. Límites conocidos, sin cubrir: la forma abreviada `{ virtual }` y una
  clave calculada; llevan un comentario con el techo y la salida (ampliar el patrón).
- **D6. No se escribe la clave en el propio candado** (R2). El candado se recorre a sí
  mismo (D7). Su fuente, sus comentarios y sus títulos no pueden contener `virtual`
  seguida de `:`. El patrón vive como literal de expresión regular (su fuente es
  `virtual['"]?\s*:`, que no se casa a sí mismo) y los comentarios describen la clave con
  palabras. Un `grep -cE "virtual['\"]?[[:space:]]*:"` del candado da 0 (tasks.md §Anclas).
- **D7. Cláusula de recorrido no vacío** (R2). El segundo `it` de `#207 R2` aserta que la
  lista de tests recorridos contiene `__tests__/jest-virtual-mock-lock.test.ts`. Mata dos
  verdes falsos a la vez: un recorrido vacío por una ruta mal calculada y un recorrido que
  salta `__tests__` (D4). No usa un recuento de ficheros: los recuentos caducan al mergear.
- **D8. Lectura desde disco, sin lista fija** (R2). El recorrido calcula la lista cada
  vez; ningún test conoce de antemano qué ficheros hay. Salida ordenada con `.sort()` y
  separadores normalizados con `.replace(/\\/g, '/')`, como hacen las otras guardas
  (el humano también corre en Windows).
- **D9. R1 sí lleva inventario cerrado** (R1). El `it` de `#207 R1` recorre una tabla de
  cuatro filas `[ruta relativa a src, especificador]`: las tres de `use-theme-colors`
  (`../../theme/use-theme-colors`) y la de `profile` (`expo-image-picker`). Por fila,
  comprueba que el fuente casa con `jest\.mock\(\s*'<especificador>'` (el especificador con
  sus metacaracteres escapados) y que no casa con el patrón de D5. Sirve para que nadie
  «arregle» borrando el mock en vez de la opción. Si una feature mueve uno de esos cuatro
  ficheros, esa fila se actualiza en el mismo commit; el barrido de R2 no depende de la tabla.
- **D10. Sin lista blanca** (R2). La propuesta del diagnóstico admitía una lista cerrada de
  especificadores que de verdad no resuelven. Hoy el conjunto es vacío, así que la lista
  sería código sin uso (YAGNI), y una lista invita a ampliarla en vez de arreglar el mock.
- **D11. Títulos.** Títulos exactos, en el candado:
  - `describe('#207 R1: los cuatro tests registran su módulo real sin la opción virtual')`,
    con un `it('cada uno conserva su jest.mock y no pasa la opción virtual')`.
  - `describe('#207 R2: ningún test móvil pasa la opción virtual de jest.mock')`, con
    `it('ningún test móvil pasa la opción virtual')` y `it('el recorrido incluye al propio candado')`.

  El prefijo `#207` es el de las guardas recientes (`#178 R2:`, `#197 R20`). Ningún título
  contiene `virtual` seguida de `:` (D6). Cualquier `#207` en un comentario va seguido de
  ` R<n>` (la exención de `HEX_LITERAL` en `design-drift`).
- **D12. Forma de la salida de R1 y R2.** R1 acumula una lista de cadenas `<ruta relativa a
  src>: <motivo>` («contiene la opción virtual» o «no registra jest.mock de <especificador>») y
  aserta `toEqual([])`. R2 aserta `toEqual([])` sobre la lista ordenada de rutas de violación
  (definición de [[requirements]]). Así la aserción que falla nombra el fichero, que es lo que el
  reviewer copia como evidencia de cada mutación.

## Reproducción determinista (R3 de la petición: fuera)

La contaminación necesita **dos ficheros de test en el mismo proceso**: el valor lo fija el
`virtualMocks` del primero y lo lee el `Resolver` compartido en el segundo. Dentro de un
solo fichero no se reproduce, porque `virtualMocks` de ese `Runtime` persiste y el ID es
coherente. Un test jest normal solo podría provocarlo lanzando jest dentro de jest
(`runCLI` o un proceso hijo con dos ficheros señuelo) o con un `Runtime` construido a mano,
y eso exige:

- un orden garantizado entre los dos ficheros señuelo, que depende de la caché de
  rendimiento y del tamaño de fichero (o de un secuenciador propio, que es justo lo que se
  descarta);
- decenas de segundos por corrida, con `jest-expo` y el transformador de Babel;
- fijar el comportamiento interno de `jest-resolve` 29.7.0, no código nuestro: una subida
  de jest lo rompería sin que haya un fallo del repo.

El candado (R2) elimina la **causa** en todo el árbol y R1 limpia los cuatro casos
existentes; el síntoma se mide con CC1, que es la repro de serie (`--runInBand` con
caché vacía), en el commit A (rojo) y en el B (verde). Es la comprobación manual del
reviewer. Si en el futuro se añade un test automático, el sitio es una feature propia.

## Caso abierto: `#200 R9 mockRouter.push` llamado 0 veces

El diagnóstico no lo explica. El envenenamiento medido solo afecta a
`theme/use-theme-colors` y a `expo-image-picker`; no hay mecanismo visto que lo lleve a
`expo-router`. Puede ser otra clase de fuga (el hook real corriendo en ese render) o un
flake distinto. **Queda abierto.** No se arregla, no se candada y no se cita como cerrado
aquí. Si reaparece, el leader guarda el log entero del `init.sh` rojo (memoria «logs rojos»)
y decide abrir otra feature.

## Archivos afectados por capa

Infraestructura de tests de `mobile-pet-tracker/src/`. No cambian producción, `jest.config`,
`package.json`, `test/` ni `docs/`.

- `mobile-pet-tracker/src/__tests__/jest-virtual-mock-lock.test.ts`: **nuevo**. Describes
  `#207 R1:` y `#207 R2:` (D3 a D12).
- `mobile-pet-tracker/src/screens/food/index.test.tsx`: borra `  { virtual: true },` del
  `jest.mock(` de `../../theme/use-theme-colors` (D1, D2).
- `mobile-pet-tracker/src/screens/health/index.test.tsx`: igual.
- `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`: igual.
- `mobile-pet-tracker/src/screens/profile/index.test.tsx`: en el bloque
  `jest.mock('expo-image-picker', () => ({`, `}), { virtual: true });` pasa a `}));` (D1, D2).

Sin cambios: todo lo demás, incluido `src/components/__tests__/back-button.test.tsx` (la
víctima) y `src/__tests__/design-drift.test.ts` (no recorre `__tests__/`).

## Impacto de UI

Ninguno. No se tocan JSX, estilos, testIDs, copy, dimensiones de pantalla ni componentes
compartidos (`docs/ui-guidelines.md`). La grep-clean (§Decisiones fijas, punto 3) se mantiene porque no
se toca producción (CC5). El checklist de autocrítica no aplica: no hay pantalla nueva ni
modificada.

## Estrategia de pruebas

- **Rojo legítimo (C4).** En A, `#207 R1` y el primer `it` de `#207 R2` fallan por
  aserción: `toEqual([])` recibe las cuatro violaciones. No hay `ReferenceError` ni import
  inexistente: el candado solo importa `fs` y `path` y el primer commit ya compila.
- **Nacido verde.** El segundo `it` de `#207 R2` (recorrido) pasa desde A, porque asevera
  una propiedad del propio candado; se cierra por mutación (M-R2e) y no por un rojo.
- **Mutaciones** en tasks.md §Mutaciones de control. Dos de ellas se plantan donde un
  candado copiado de otra guarda podría no mirar: un `.tsx` dentro de un `__tests__/`
  que cuelga de un directorio con paréntesis (`src/app/(tabs)/__tests__/`) y un `.ts`
  fuera de `__tests__/`. La evidencia de cada una es la aserción que falla, no un fallo de
  compilación.
- **El síntoma real** se mide con CC1 (comando de serie, caché vacía), no con el candado.
- **Filtros de jest.** El candado vive en `src/__tests__/` y se corre con
  `--runTestsByPath` (los ficheros bajo `(tabs)` solo se mutan, no se corren). Se comprueba
  que el número de suites impreso coincide con el de ficheros pedidos.

## Alternativas descartadas

- **Dejar la opción y arreglar el orden** (secuenciador propio, un solo worker):
  esconde la causa y rompe con la siguiente carga. Descartada.
- **Un `testEnvironment` o un resolver propios que vacíen el mapa de IDs**: parchean
  jest, son frágiles ante una subida y dependen de internos privados. Descartada.
- **`--workerIdleMemoryLimit` o reciclar workers**: no toca el `Resolver` compartido
  dentro de un worker. Descartada.
- **`jest.isolateModules` por test**: aísla el registro de módulos de `jest-runtime`, no el
  `Resolver` compartido. Descartada.
- **`moduleNameMapper` a un stub de `use-theme-colors` y `expo-image-picker`**: obliga a
  mantener dos stubs y a tocar `package.json`, para módulos que existen. Reservada para un
  especificador que no resuelva (D1, D10).
- **Candado dentro de `design-drift.test.ts`**: ese fichero ya pasa de las mil líneas y su
  recorrido de uso general salta `__tests__/`. Un fichero propio es más corto de leer y de
  mutar. Descartada.
- **Lista blanca de especificadores** (propuesta del diagnóstico): ver D10. Descartada.
- **Test automático de la contaminación**: ver §Reproducción determinista. Descartado.

## Riesgos

- **Otra rama introduce una opción virtual.** El candado pondrá en rojo el merge; la
  salida es quitar la opción en esa rama, no excluirla. Hoy ninguna de las ocho worktrees
  abiertas la usa.
- **Conflicto en `profile/index.test.tsx` con #196.** El cambio de #207 es una línea dentro
  del bloque `jest.mock('expo-image-picker', ...`. Si #196 toca ese bloque, el conflicto se
  resuelve a mano conservando la ausencia de la opción; el ancla es el contenido, no la línea.
- **Recorrido sobre `src/` solamente.** Un test nuevo con la opción en `test/` o en la raíz
  no se ve (pregunta abierta 1 de requirements).
- **Falsos positivos por texto.** Un comentario o una cadena que contenga `virtual`
  seguida de `:` pondría en rojo el candado (D5). Se acepta; el mensaje enseña la ruta.
- **El orden por tamaño de CC1 es una propiedad de `@jest/test-sequencer` 29.7.0.** Si una
  subida de jest cambiara el desempate, CC1 podría dejar de ordenar `back-button` el último;
  el reviewer lo vería porque el resultado en A dejaría de ser rojo.
