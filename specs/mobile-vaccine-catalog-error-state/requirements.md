---
feature: "mobile-vaccine-catalog-error-state"
status: draft        # draft | approved
tags: [harness, spec, mobile, health, vaccines]
---

# Requisitos — [[mobile-vaccine-catalog-error-state]]

> Feature #236. Notación EARS. Cada requisito tiene un id único R<n>, que no
> cambia una vez aprobado. Las decisiones técnicas están en [[design]], los
> pasos TDD en [[tasks]] y la evidencia en [[traceability]]. Las reglas de capas
> están en [[../../docs/architecture|architecture]]. La UI se rige por
> [[../../docs/ui-guidelines|ui-guidelines]].
>
> - Base medida: `origin/dev` en `8187d1fb` (merge de #226).
> - Branch: `feature/236-mobile-vaccine-catalog-error-state`. La PR va contra `dev`.
> - Capa: solo móvil (`mobile-pet-tracker/`), y en ella solo la pantalla
>   `src/screens/vaccine-create/index.tsx`, su test y la tabla de copy.
> - Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Origen (texto literal del humano)

Del plan `progress/plan_mejoras-smoke-2026-11-03.md`:

- §1, síntoma del smoke que originó #226:
  > «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"»
- §6, pregunta 6, respuesta del humano al hallazgo del leader:
  > «si abre como feature nueva»

#226 arregló la causa de su base (catálogo sin filas). Esta feature arregla otra
causa con el mismo síntoma: si `GET /vaccine-catalog` falla, la pantalla tampoco
avisa.

## Causa verificada contra el árbol (`8187d1fb`)

1. `src/screens/vaccine-create/index.tsx` calcula
   `const entries = catalog.data?.kind === 'ok' ? catalog.data.entries : [];`.
   Con cualquier respuesta distinta de `ok`, `entries` queda vacío.
2. La rama no cargando pinta
   `{[...entries, { id: 'other', name: t('vaccineCreate.otherVaccine') }].map(...)`.
   Con `entries` vacío, solo sale `vaccine-chip-other`, y `selectedId` cae en
   `'other'`.
3. No hay ningún aviso ni reintento:
   `grep -cF 'catalog.refetch()' src/screens/vaccine-create/index.tsx` da `0`.
4. `#208 R8` («Error de catálogo», `specs/mobile-vaccine-create/requirements.md`)
   fijó ese comportamiento a propósito: «No hay copy nueva de error: el alta libre
   sigue disponible». Esta spec lo enmienda (§Enmienda de #208).
5. `getVaccineCatalog` (`src/api/health-records.ts`) devuelve un
   `VaccineCatalogState` con cinco ramas: `ok`, `unauthorized`, `error`,
   `unreachable` (con `message`) y `missing-config`. Los fallos se **resuelven**
   como datos, no rechazan. Por eso `catalog.isError` no basta.
6. `createQueryClient` (`src/providers/query-provider.tsx`) fija `retry: false`.
   El cliente de los tests (`test/render-with-providers.tsx`) usa el mismo. Una
   promesa rechazada deja `isPending` en `false` y `data` en `undefined` sin
   reintentos ocultos.

## Patrón reutilizado

Salud ya resuelve el mismo caso para la lista de vacunas, en
`src/screens/health/index.tsx`:

- bloque `<View className="items-start gap-3">`;
- texto `vaccines-error`, `text-15 leading-body text-danger` con
  `accessibilityRole="alert"`, copy `health.couldNotLoadVaccines`;
- `<Button testID="vaccines-retry" onPress={() => void vaccines.refetch()}>`,
  con hijo de texto `t('common.retry')`, sin `className` ni `variant`.

Su test es `screens/health/index.test.tsx`, el que asserta
`'text-15 leading-body text-danger'` y `toHaveTextContent('Reintentar')`.

Esta feature copia ese patrón. No hay componente compartido que reutilizar: ni
`components/` ni otra pantalla exportan un bloque de error con reintento.

## Copy: sin copy nuevo, sin G1

No hay copy nuevo. **No necesita G1.** Se reutilizan dos claves que ya existen en
`src/i18n/catalog.ts`, en los dos idiomas:

| Clave | es | en |
|---|---|---|
| `health.couldNotLoadVaccines` | «No se pudieron cargar las vacunas» | «Could not load vaccines» |
| `common.retry` | «Reintentar» | «Retry» |

`src/i18n/catalog.ts` no cambia. El aviso no lo dice Orbit: la voz B
(`docs/ui-guidelines.md` §7) no aplica.

## Canvas

Se revisó el canvas aprobado (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j,
v167, leído el 2026-11-03). Contiene tres artboards de Agregar vacuna:

- `project/AltaVacuna.dc.html`, el catálogo cargado;
- `project/AltaVacunaOtra.dc.html`, el modo «Otra vacuna»;
- `project/AltaVacunaError.dc.html`, titulado «Vacuna sin guardar». Es el **error
  al guardar** («No pude guardar la vacuna…», en la barra fija), que ya cubre #208.

**No hay artboard del catálogo en error.** No se congela ninguno en
`specs/mobile-vaccine-catalog-error-state/canvas/`.

La referencia visual es el patrón aprobado de la app (§Patrón reutilizado). Su
board es el bloque «Error» de `project/SaludEstados.dc.html`: texto a 15 px,
`line-height: 1.4`, color `--danger`, y «Reintentar» debajo, alineado a la
izquierda. Ese board dibuja el botón con labio; la app no lo lleva, por la regla 13
«Sin labio» de `docs/ui-guidelines.md` («los primarios de heroui sin color en
`className` (reintentos)») y su candado `#177 R8.4`. Manda la carta.

## Decisiones cerradas por el `spec_author`

- **D1 — Cuándo hay error.** Hay error cuando la consulta terminó y su dato no es
  `ok`: `!catalog.isPending && catalog.data?.kind !== 'ok'`. Cubre las cuatro ramas
  distintas de `ok` (`error`, `unreachable`, `unauthorized` y `missing-config`) y
  la promesa rechazada (`data` `undefined`). Es la misma regla que ya usa `#208 R8`
  («cualquier `kind` distinto de `ok`»).
  - `unauthorized` también pinta el aviso. El `QueryCache` cierra la sesión en
    paralelo (`onUnauthorized`), así que el aviso dura lo que tarde la
    redirección. No merece una rama aparte.
- **D2 — «Otra vacuna» durante el error.** Sigue siendo el único chip, seleccionado,
  con su campo de nombre: el alta libre no se bloquea (lo que ya dice `#208 R8`).
  El aviso se suma; no reemplaza nada.
- **D3 — Catálogo vacío (`ok` con 0 entradas).** No es error: no hay aviso, solo
  «Otra vacuna», como hoy.
- **D4 — Carga.** Sin cambios: tres esqueletos (`#208 R8`) y ningún aviso.
- **D5 — Qué hace «Reintentar».** Llama a `catalog.refetch()`, que repite la
  misma consulta (`healthKeys.vaccineCatalog(species)`, `getVaccineCatalog` con la
  misma especie). No invalida otras consultas, no navega y no toca el formulario.
- **D6 — Mientras el reintento está en vuelo.** El aviso y «Otra vacuna» siguen
  como estaban. React Query conserva el dato anterior, así que `isPending` sigue en
  `false` y no vuelven los esqueletos. El botón no se deshabilita, como en Salud.
  - Esto vale cuando el fallo llegó como dato (las cuatro ramas de
    `VaccineCatalogState`), que es el camino real: `getVaccineCatalog` traduce la
    red y los HTTP a ramas, y `readJson` (`src/api/http.ts`) atrapa el JSON roto.
    Si la promesa rechazó, no hay dato que conservar: React Query (`fetchState`
    de `@tanstack/query-core`) vuelve a poner `status: 'pending'` y durante ese
    reintento salen los esqueletos. Se acepta; R6 no lo cubre.
- **D7 — Si el reintento responde `ok`.** El aviso desaparece y los chips salen
  con la regla de `#208 R8`, sin cambios: entradas en el orden de la API, «Otra
  vacuna» al final y la primera entrada seleccionada. Excepción: si el usuario ya
  pulsó otro chip del catálogo, se queda esa selección (`selectedDraft`). Pulsar
  «Otra vacuna» cuando ya está seleccionada no guarda borrador
  (`selectVaccine` vuelve antes), así que tras el reintento manda la primera
  entrada. El nombre que se hubiera escrito sigue en el estado, pero no se envía:
  con un chip del catálogo se envía `catalogId` (`#208 R14`).
- **D8 — Si el reintento vuelve a fallar.** El aviso sigue y se puede reintentar
  otra vez, sin límite.
- **D9 — Dónde va.** Es un hermano nuevo dentro del `ScrollView`
  `vaccine-create-form`, justo después de `vaccine-create-legend` y antes de
  `vaccine-create-chips`. Hereda el `gap: 16` del contenedor, sin márgenes
  propios. La barra fija `vaccine-create-bar` y su `vaccine-create-error`
  (error al guardar, `#208 R17`) no cambian.
- **D10 — Texto seleccionable.** El texto del aviso lleva `selectable`, por la
  micro-regla de `docs/ui-guidelines.md` («`<Text selectable />` en datos copiables
  y mensajes de error»). Salud no lo lleva; esta spec no lo corrige allí.
- **D11 — Nunca el texto del servidor.** El aviso es siempre el literal de la
  clave. El `message` de `unreachable` y el de una excepción no se pintan nunca
  (como `#186` y `#208 R18`).

## Requisitos funcionales

Todos los tests nuevos van en `src/screens/vaccine-create/index.test.tsx`, salvo
R7. Sus nombres empiezan por `#236 R<n>:`.

### R1 — Aviso de error del catálogo

- **R1.** IF la consulta del catálogo terminó (`catalog.isPending` es `false`) y
  su dato no es `{ kind: 'ok' }` (es `error`, `unreachable`, `unauthorized` o
  `missing-config`, o la promesa rechazó), THEN THE SYSTEM SHALL pintar el bloque
  `vaccine-create-catalog-error`:
  - Es un `View` con `className="items-start gap-3"`, hijo directo del contenedor
    de `vaccine-create-form`. Va inmediatamente después de `vaccine-create-legend`
    e inmediatamente antes de `vaccine-create-chips`.
  - Su primer hijo es el `Text` `vaccine-create-catalog-error-text`:
    - `className="text-15 leading-body text-danger"`;
    - `accessibilityRole="alert"` y `selectable`;
    - texto exacto es «No se pudieron cargar las vacunas» / en «Could not load
      vaccines» (`health.couldNotLoadVaccines`).
  - Su segundo hijo es el `Button` de heroui-native `vaccine-create-catalog-retry`.
    Su texto exacto es es «Reintentar» / en «Retry» (`common.retry`).
  - No pinta el `message` de `unreachable` ni el de la excepción (D11).
- Tests:
  - `#236 R1: con el catálogo en %s pinta el aviso y «Reintentar» entre la leyenda y los chips`.
    Es un `it.each` con una fila por rama: `error`, `unreachable`, `unauthorized`
    y `missing-config`. La fila de `unreachable` lleva
    `message: 'SERVER_NETWORK_PRIVATE'` y asserta que ese texto no aparece.
  - `#236 R1: si la consulta del catálogo rechaza pinta el mismo aviso`.
    El mock rechaza con `new Error('SERVER_THROWN_PRIVATE')` y asserta que ese
    texto no aparece.

### R2 — «Otra vacuna» sigue disponible durante el error

- **R2.** WHILE se pinta `vaccine-create-catalog-error`, THE SYSTEM SHALL mantener
  el alta libre:
  - `vaccine-create-chips` tiene un solo hijo, `vaccine-chip-other`, con
    `accessibilityState` `{ selected: true }`;
  - `vaccine-create-name` está montado (D2).
- Test: `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`.
- El test existente
  `#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado` sigue
  verde sin tocarlo.

### R3 — Catálogo `ok` (vacío o con entradas) sin aviso

- **R3.** WHEN el catálogo responde `{ kind: 'ok' }`, con 0 entradas o con
  entradas, THE SYSTEM SHALL no pintar `vaccine-create-catalog-error` ni
  `vaccine-create-catalog-retry`, ni el texto «No se pudieron cargar las vacunas».
  - Con 0 entradas, `vaccine-create-chips` tiene solo `vaccine-chip-other`,
    seleccionado (D3).
  - Con las cuatro entradas del test, los hijos son los cinco de `#208 R8`.
- Test: `#236 R3: un catálogo ok %s no pinta el aviso de error`, un `it.each` con
  dos filas: `vacío` (`entries: []`) y `con entradas` (el `catalog` del fichero).

### R4 — Carga sin aviso

- **R4.** WHILE la consulta del catálogo está pendiente, THE SYSTEM SHALL pintar
  `vaccine-create-chips-skeleton` y no pintar `vaccine-create-catalog-error` (D4).
- Test: `#236 R4: mientras carga no pinta el aviso de error`.

### R5 — «Reintentar» repite la misma consulta

- **R5.** WHEN el usuario pulsa `vaccine-create-catalog-retry` y la nueva respuesta
  es `{ kind: 'ok' }` con entradas, THE SYSTEM SHALL:
  - volver a llamar a `getVaccineCatalog` con los mismos argumentos
    (`apiUrl`, `'jwt-token'`, `'dog'`): dos llamadas en total;
  - quitar `vaccine-create-catalog-error`;
  - pintar los cinco chips de `#208 R8`, en orden:
    `vaccine-chip-cat-lepto`, `vaccine-chip-cat-dhppi`, `vaccine-chip-cat-rabia`,
    `vaccine-chip-cat-tos` y `vaccine-chip-other`;
  - dejar `vaccine-chip-cat-lepto` con `{ selected: true }` (D7).
- Test: `#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso`.

### R6 — Reintento en vuelo y reintento fallido

- **R6.** WHILE un reintento lanzado desde un fallo resuelto como dato (D6) está
  en vuelo, y IF vuelve a responder distinto de `ok`, THEN THE SYSTEM SHALL
  mantener `vaccine-create-catalog-error` y `vaccine-chip-other`, sin volver a
  pintar `vaccine-create-chips-skeleton` (D6, D8).
- Tests:
  - `#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos`.
    La segunda llamada devuelve una promesa que no resuelve (`pending()`).
  - `#236 R6: si el reintento vuelve a fallar el aviso sigue y se puede reintentar otra vez`.
    El mock responde `error` tres veces. Tras dos pulsaciones hay tres llamadas y
    el aviso sigue.

### R7 — Tabla de usos de copy

- **R7.** THE SYSTEM SHALL registrar los dos usos nuevos de copy en
  `src/__tests__/ui-copy-table.ts`, bloque `R19_VACCINE_CREATE`. El bloque pasa de
  **29 a 31** filas. Son dos filas nuevas, después de la fila
  `{ file: 'src/screens/vaccine-create/index.tsx', key: 'validation.checkDetails' },`:

  ```
  { file: 'src/screens/vaccine-create/index.tsx', key: 'health.couldNotLoadVaccines' }, // #236 R7
  { file: 'src/screens/vaccine-create/index.tsx', key: 'common.retry' }, // #236 R7
  ```

  - En `src/__tests__/ui-language.test.ts`, el `it`
    `#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código` gana
    ` (enmendado por #236 R7)` al final del título. Su aserción pasa a
    `expect(R19_VACCINE_CREATE).toHaveLength(29 + 2); // #236 R7`.
  - No cambian `SCREEN_FILES` (el fichero ya está en la tabla) ni la suma de
    `#194 R5: cuadra ALL_USES con la suma de sus bloques…`, que es calculada.
  - `src/i18n/catalog.ts` no cambia.
- Tests (en `src/__tests__/ui-language.test.ts`):
  - `#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código (enmendado por #236 R7)`;
  - `resuelve cada ocurrencia de la tabla contra la clave exacta`, que sigue verde.

### R8 — Receta visual y guardas de la carta

- **R8.** THE SYSTEM SHALL escribir el bloque solo con tokens y la receta del
  reintento de Salud:
  - El `Button` `vaccine-create-catalog-retry` no lleva `className`, `variant`,
    `size` ni `style`: es el primario por defecto de heroui-native, sin labio
    (regla 13 «Sin labio», `#177 R8.4`). Su hijo es el texto `t('common.retry')`,
    sin `Button.Label` ni `Text`, así que los recuentos de `#177 R6.2` no cambian.
  - El fichero no gana clases arbitrarias, hex, `StyleSheet` ni sombras.
  - Todo comentario nuevo que nombre la feature se escribe `#236 R<n>`, nunca
    `#236` solo, porque `#177 R12.1` trata `#236` sin ` R<n>` como un hex.
- Tests:
  - `#236 R8: el aviso y el reintento usan la receta de Salud sin clases ni labio`,
    en `src/screens/vaccine-create/index.test.tsx`. Lee el fuente con
    `readFileSync('src/screens/vaccine-create/index.tsx', 'utf8')`, como
    `#208 R7`. Exige que contenga, una vez cada uno, estos tres literales:
    - `<View testID="vaccine-create-catalog-error" className="items-start gap-3">`
    - `<Text testID="vaccine-create-catalog-error-text" className="text-15 leading-body text-danger" accessibilityRole="alert" selectable>{t('health.couldNotLoadVaccines')}</Text>`
    - `<Button testID="vaccine-create-catalog-retry" onPress={() => void catalog.refetch()}>{t('common.retry')}</Button>`
  - Guardas existentes que siguen verdes sin tocarlas:
    - `src/__tests__/chunky-cta-canvas-fidelity.test.ts`:
      - `#177 R8.4: destructivos, tonales y reintentos no reciben labio …`
      - `#177 R6.2: recuentos de etiquetas …`
      - `#177 R3.3: el inventario de Button con bg-accent está cerrado …`
      - `#177 R7.3: inventario de los veintisiete radios de dieciséis …`
      - `#177 R12.1/R12.2: los diecinueve ficheros respetan los guards de la carta …`
      - `#177 R12.3: cada comentario de la feature nombra su requisito …`
    - `src/__tests__/design-drift.test.ts`:
      `#208 R21: los cuatro ficheros nuevos no tienen deriva de estilo`.

### R9 — Paso de smoke que reproduce el fallo (gate humano G2, no delegado)

- **R9.** El cambio SHALL añadir a `progress/smoke_mejoras-smoke.md` (ruta desde
  la raíz del repo) la sección y la casilla literales de [[design]] §Paso de smoke.
  - El paso 1 **reproduce el fallo original** en el build de antes: solo «Otra
    vacuna», sin aviso.
  - La casilla la marca solo el humano. La firma delegada no la cubre.
  - Verificación: los `grep -cF` de [[tasks]] §R9 dan `1`.

## Enmienda de #208

Esta spec enmienda `#208 R8` y `#208 R20` de
`specs/mobile-vaccine-create/requirements.md`:

- **`#208 R8`, párrafo «Error de catálogo».** Seguía: «IF el catálogo responde
  cualquier `kind` distinto de `ok`, THEN THE SYSTEM SHALL pintar solo
  `vaccine-chip-other`, seleccionado. No hay copy nueva de error: el alta libre
  sigue disponible». Eso se conserva para los chips (R2). Además se pinta el aviso
  con reintento de `#236 R1`, con copy reutilizado.
- **`#208 R20`.** `R19_VACCINE_CREATE` pasa de 29 a 31 filas (`#236 R7`).

La casilla de la enmienda va en la spec enmendada, sección
`## Enmienda por #236 (2026-11-03)`.

## Fuera de alcance

- **Fallo de la consulta de mascotas.** Si `listPets` falla y no hay caché, `pet`
  queda `undefined`. La consulta del catálogo sigue deshabilitada
  (`enabled: pet !== undefined`) y los esqueletos se quedan para siempre.
  - También pasa con un gato: `species` cae a `'dog'`, la clave cambia a una
    consulta deshabilitada sin dato, y vuelven los esqueletos.
  - Es otro estado (sin mascota), con otra consulta y otra decisión de copy. Esta
    spec no lo trata.
- **Indicador de carga en «Reintentar»** (deshabilitar o mostrar spinner mientras
  el reintento está en vuelo). Salud tampoco lo tiene (D6).
- **Reintento tras una promesa rechazada.** Mientras está en vuelo vuelven los
  esqueletos (D6). Ningún camino de `getVaccineCatalog` rechaza hoy.
- **Reintento automático** (al recuperar la red o al enfocar la pantalla). El
  cliente fija `refetchOnReconnect: false` y `refetchOnWindowFocus: false`.
- **Añadir `selectable` al aviso de Salud** (`vaccines-error`) o extraer un
  componente compartido de error con reintento. Con dos usos, cada pantalla
  conserva su bloque.
- **Mensajes distintos por rama** (sin red frente a error del servidor). Haría
  falta copy nuevo y G1.
- **Backend y catálogo**: ya los cubrió #226.
- **Smoke en dispositivo y `dev` → `main`**: son gates humanos del plan (G2, G5).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

La casilla del paso de smoke de R9 es un gate aparte (G2 del plan
`progress/plan_mejoras-smoke-2026-11-03.md` §5). La firma delegada del leader no
la cubre. No hay G1 (sin copy nuevo) ni G4 (sin enmiendas de `docs/`).
