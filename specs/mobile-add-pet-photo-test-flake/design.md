---
feature: "mobile-add-pet-photo-test-flake"
status: draft        # draft | approved
tags: [harness, spec, mobile, tests]
---

# Diseño — [[mobile-add-pet-photo-test-flake]] (#72)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> **Capas**: esta feature no toca `backend-pet-tracker/` ni `infra/`, así que
> `docs/architecture.md` (domain/application/infrastructure) no aplica. Todo el
> trabajo vive en ficheros de **test** de `mobile-pet-tracker/` más una regla en
> `docs/conventions.md`. No se escribe ni se modifica código de producción de forma
> permanente.

## Decisiones técnicas

### D1 — Viga de 200 ms en el notificador de query-core (R1)

El flake de alerts es una ventana de **ordenación**, no de duración: query-core
escribe la caché síncronamente y notifica a React por `setTimeout(…, 0)`. Para
poder demostrarlo y candarlo se **ensancha la ventana a propósito** en el único
test afectado:

```ts
import { defaultScheduler, notifyManager } from '@tanstack/react-query';
```

- En el cuerpo del test, como **primera** sentencia:
  `notifyManager.setScheduler((callback) => setTimeout(callback, 200));`
- En un `afterEach` de **nivel de fichero**:
  `notifyManager.setScheduler(defaultScheduler);`

Comprobado antes de especificarlo, no supuesto:

- `notifyManager` y `defaultScheduler` **se exportan** desde `@tanstack/react-query`
  (el build ESM reexporta `export * from "@tanstack/query-core"` en
  `build/modern/index.js:19`; verificado también en runtime sobre el build CJS, que
  es el que resuelve jest). No hace falta añadir `@tanstack/query-core` como
  dependencia ni instalar nada.
- `notifyManager` es un singleton **por registry de módulos**, es decir por fichero
  de test: la viga no se filtra a otras suites.
- `src/screens/alerts/index.test.tsx` **no usa fake timers**, así que el retraso es
  de reloj real y no hay que avanzarlo.

Por qué 200 ms y no otro número: se deriva de las constantes reales de RNTL
(`DEFAULT_INTERVAL = 50` ms, `asyncUtilTimeout = 1000` ms), con `50 < 200 < 1000`.
Ver [[requirements]] §R1.

**Alcance deliberado**: la viga se pone en **un** test, no en el fichero entero ni
en `test/jest-setup.js`. Ensanchar la ventana para toda la suite ralentizaría todas
las pantallas con query y pondría en rojo, de golpe, cualquier otro sitio con el
mismo patrón — que es trabajo que R2 hace uno a uno, con su mutación y su evidencia.

### D2 — La condición de parada es la aserción (R2)

Correcciones mínimas, sin tocar producción ni timeouts:

- Aserción **positiva** de árbol → `await screen.findByTestId(...)` o mover la
  aserción dentro del `waitFor`.
- Aserción de **ausencia** → **ancla positiva primero** (una espera sobre un nodo que
  sí aparece en ese escenario) y la ausencia después. Los anclajes elegidos son
  todos el **fin del estado "en vuelo"**, que es lo último que cambia en esos flujos
  y por tanto prueba que el `finally` del handler ya re-renderizó:
  `alert-row-alert-1-ack` (`alerts/index.tsx:262`, `isDisabled={ackingId !== null}`),
  `pairing-submit` (`pairing/index.tsx:407`) y `device-unpair`
  (`pairing/index.tsx:498`, `isDisabled={releasing}`).
- Las aserciones de **contador de mock** se conservan todas: son contrato (una sola
  llamada tras dos pulsaciones, dos llamadas tras el refetch) y son monótonas, así
  que colocarlas después de la espera de árbol no las debilita.

### D3 — `beforeEach` raíz del picker en profile (R3)

Copia exacta de la forma que `add-pet` tiene desde `43183c4a`: `mockReset()` +
rearme con el valor por defecto. `jest.clearAllMocks()` **no** sirve: verificado
contra `jest-mock` 29.7.0 que conserva la implementación. Los `beforeEach` por
describe que ya existen en profile se quedan como están (el rearme raíz corre
antes y es compatible con que un test arme el suyo).

### D4 — Endurecimiento diagnóstico de add-pet: se elige afirmar el armado (R4)

El informe del `explorer` dejaba dos formas abiertas. **Se elige la primera** y se
descarta la segunda, por una razón verificada, no por gusto:

- **Elegida — afirmar el armado del mock justo antes del `press`**, dentro de un
  helper por el que pasan las tres pulsaciones. Es una aserción de test corriente,
  no cambia la identidad de nada y funciona igual con colas `mockResolvedValueOnce`
  encima (`getMockImplementation()` sigue devolviendo la implementación persistente).
- **Descartada — que la factoría del mock lance un error con nombre al llamarse sin
  implementación.** Se implementaría dando a `jest.fn()` una implementación por
  defecto que lanza; pero en `jest-mock` **29.7.0** —el que usa el runtime, no el
  30.4.1 hoisted— `mockReset()` **borra también la implementación pasada al
  constructor** (probado: `fn(() => 1)` + `mockReset()` → `getMockImplementation()`
  es `undefined`). O sea: la forma (b) queda desarmada **exactamente por el mecanismo
  que queremos diagnosticar**, y volvería a devolver `undefined`. La variante que sí
  sobreviviría —envolver el `jest.fn` en una función plana— obliga a reescribir todas
  las aserciones sobre el mock en un fichero de 494 líneas y cambia lo que se está
  probando. No compensa.

El helper **no** captura el resultado ni asevera nada después de la llamada: su único
trabajo es que la bifurcación que hoy no podemos resolver quede escrita en el log del
próximo rojo (ver [[requirements]] §D-A).

### D5 — Quitar `{ virtual: true }` del mock del picker (paso de refactor de R4)

`src/screens/add-pet/index.test.tsx:20-22` declara
`jest.mock('expo-image-picker', factory, { virtual: true })`. `expo-image-picker` es
una dependencia **real** del proyecto y `src/screens/profile/index.test.tsx:58-60`
mockea **el mismo módulo sin `virtual`** y su suite resuelve sin problema: el flag no
aporta nada y sí quita la resolución del módulo real, de modo que un especificador
mal escrito pasaría en silencio.

**Es reducción de superficie y NO es el arreglo del flake**, y no debe presentarse
como tal en ningún commit, PR ni reporte. Va como paso (3) *refactor* de R4 —
después del verde—, y su única verificación es que la suite siga verde. Si por lo que
sea el módulo no resolviera, se revierte esa línea y se anota; no se arrastra.

### D6 — Cómo se nombran los R-ids en tests que ya son de otras specs

`alerts`, `pairing`, `map` y `weight-log` acumulan R-ids de varias specs. Para no
romper la desambiguación por título completo de las traceabilities ajenas, el R-id de
#72 se añade como **sufijo** al título del `it`, conservando el título original como
prefijo:

```ts
it('cierra sesión en unauthorized sin pintar error (#72 R2)', async () => {
```

Tras editar los títulos, **se comprueba con grep si alguna traceability ajena los
cita** y se actualiza la fila:

```
grep -rn "cierra sesión en unauthorized sin pintar error" /home/claude/sites/Pet-Tracker/specs/
```

(y lo mismo para cada uno de los siete títulos editados). Los tests **nuevos**
(R3, R4) sí usan el prefijo canónico de `docs/conventions.md`:
`describe('#72 R3: …')`, `describe('#72 R4: …')`.

## Mutaciones de producción para el rojo de R2

Una por sitio, **versionada en el commit rojo y revertida en el verde**. Ninguna
sobrevive al cierre.

| Sitio | Fichero de producción | Mutación | Efecto esperado |
|---|---|---|---|
| S2 | `src/screens/alerts/index.tsx:262` | `isDisabled={ackingId !== null}` → `isDisabled={false}` | El test corregido falla por su aserción (`toBeDisabled` nunca se cumple) |
| S3 | `src/screens/alerts/index.tsx`, `handleAck`, `case 'unauthorized'` | añadir `setActionError(t('common.somethingWentWrong'));` **antes** del `await signOut()` | **Zona ciega**: el test *actual* sigue **verde** (la aserción síncrona corre antes del re-render) y el *corregido* se pone **rojo**. Se registran las dos corridas |
| S4 | `src/screens/pairing/index.tsx`, `handleClaim`, `case 'unauthorized'` | ídem | ídem |
| S5 | `src/screens/pairing/index.tsx`, `handleRelease`, `case 'unauthorized'` | ídem | ídem |
| S6 | — | sin mutación | Es un borrado de línea vacua; su evidencia es el argumento de invariancia de [[requirements]] §R2 |
| S7 | `src/app/(tabs)/weight-log.tsx:103` | quitar `setWeightText('');` del `case 'ok'` | El test corregido falla en la espera del input vacío |

Cada mutación se ejecuta **solo contra su fichero** para que la evidencia sea legible:

```
bunx jest --runTestsByPath src/screens/alerts/index.test.tsx
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx'
```

(`--runTestsByPath` = rutas, sin escapar; un filtro posicional sería regex y habría
que escribir `\(tabs\)`.)

## Archivos afectados

Todos bajo `/home/claude/sites/Pet-Tracker/`.

| Archivo | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/src/screens/alerts/index.test.tsx` | import de `notifyManager`/`defaultScheduler`, `afterEach` de restauración, viga de 200 ms en el test del bucle, espera corregida (R1); sitios S2 y S3 (R2) | R1, R2 |
| `mobile-pet-tracker/src/screens/pairing/index.test.tsx` | sitios S4 y S5: ancla positiva + ausencia | R2 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` | sitio S6: borrado de la aserción vacua | R2 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx` | sitio S7: la espera termina en el input vacío | R2 |
| `mobile-pet-tracker/src/screens/profile/index.test.tsx` | `beforeEach` raíz del picker + `describe('#72 R3: …')` **al final del fichero** | R3 |
| `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` | helper `pressPickPhoto`, las tres pulsaciones que pasan por él, `describe('#72 R4: …')`, y en refactor la retirada de `{ virtual: true }` | R4 |
| `docs/conventions.md` (§Tests) | subsección nueva con la regla de R2 | R2 |
| `mobile-pet-tracker/src/screens/alerts/index.tsx`, `.../pairing/index.tsx`, `.../app/(tabs)/weight-log.tsx` | **solo transitorio**: mutaciones del commit rojo de R2, revertidas en el verde | R2 |
| `specs/mobile-add-pet-photo-test-flake/traceability.md` | filas R1-R4 | — |
| `progress/impl_mobile-add-pet-photo-test-flake.md` | reporte del implementador con las evidencias de mutación y las tablas de V1/V2/V3 | — |

Ficheros que **no** se tocan, y que el reviewer comprueba con `git diff`:
`mobile-pet-tracker/src/screens/add-pet/index.tsx`,
`mobile-pet-tracker/src/screens/profile/index.tsx`,
`mobile-pet-tracker/package.json` (bloque `jest`),
`mobile-pet-tracker/test/jest-setup.js`,
`mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
(no hay claves de copy nuevas).

## Alternativas descartadas

- **`resetMocks: true` en la config de jest**: es literalmente el estado que produce
  la firma `undefined` de la causa A; convertiría un flake en una regresión masiva.
- **Reintentos / `jest.retryTimes` / subir `asyncUtilTimeout` / `it.skip`**: lo
  prohíbe el criterio 3 y, además, sería inerte contra una ventana de ordenación
  (argumento completo en [[requirements]] §Fuera de alcance).
- **`--runInBand` como arreglo**: cambia la concurrencia, o sea **esconde** carreras
  en vez de cerrarlas, y multiplica por ~2,3 el coste de la suite (~75 s frente a
  ~33 s).
- **Un `testSequencer` propio o un aleatorizador del orden de ficheros**: código
  nuevo de infraestructura de test para algo que en V2 se consigue borrando
  `/tmp/jest_ru/perf-cache-*`.
- **Un test estático que grepee los fuentes buscando el patrón de R2**: el barrido
  del `explorer` necesitó revisión manual de cada hit; un candado con falsos
  positivos se acaba desactivando. Se sustituye por la regla escrita en
  `docs/conventions.md`.
- **Ensanchar la ventana del notificador para toda la suite** (en `jest-setup.js`):
  pondría en rojo de golpe todos los sitios latentes, mezclando en un commit lo que
  R2 cierra uno a uno con su evidencia.
- **Renombrar los tests editados con prefijo `#72 R2: …`** (en vez de sufijo):
  rompería el título completo con el que las traceabilities de #42, #63, #78 y #97
  identifican esas filas.
- **Buscar la causa raíz de A antes de arreglar nada**: bloquearía la feature sin
  final a la vista (0 reproducciones en 32 corridas). Es la decisión D-A.
