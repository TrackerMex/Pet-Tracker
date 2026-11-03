---
feature: "mobile-vaccine-catalog-error-state"
status: draft        # draft | approved
tags: [harness, spec, mobile, health, vaccines]
---

# Diseño — [[mobile-vaccine-catalog-error-state]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> La UI se rige por [[../../docs/ui-guidelines|ui-guidelines]]. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa.

## Decisiones técnicas

- **Una sola condición derivada (R1–R4, R6).** Va justo después de la línea
  `const entries = catalog.data?.kind === 'ok' ? catalog.data.entries : [];` en
  `src/screens/vaccine-create/index.tsx`:

  ```tsx
  const catalogFailed = !catalog.isPending && catalog.data?.kind !== 'ok';
  ```

  - No se usa `catalog.isError`: los fallos llegan como dato resuelto
    (`VaccineCatalogState`), no como error de la consulta.
  - No se usa `entries.length === 0`, porque confundiría el catálogo vacío con el
    error.
  - No se usa `isFetching`: durante el reintento el aviso debe seguir (R6).
- **Bloque hermano, no reemplazo (R1, R2).** El bloque va entre el cierre del
  `</Text>` de `vaccine-create-legend` y la línea `{catalog.isPending ? (`. La rama
  de chips y la de esqueletos no cambian. Forma exacta:

  ```tsx
  {catalogFailed && (
    <View testID="vaccine-create-catalog-error" className="items-start gap-3">
      <Text testID="vaccine-create-catalog-error-text" className="text-15 leading-body text-danger" accessibilityRole="alert" selectable>{t('health.couldNotLoadVaccines')}</Text>
      <Button testID="vaccine-create-catalog-retry" onPress={() => void catalog.refetch()}>{t('common.retry')}</Button>
    </View>
  )}
  ```

  - El `View` y el `Text` ya vienen de `react-native`, y `Button` de
    `heroui-native`: no hay imports nuevos.
  - Si se añade un comentario, se escribe `{/* #236 R1 */}` o `// #236 R1`, nunca
    `#236` sin ` R<n>` (R8).
- **Reintento = `catalog.refetch()` (R5, R6).** Repite la misma consulta, con la
  misma clave `healthKeys.vaccineCatalog(species)` y la misma `queryFn`.
  - `refetch()` ignora `enabled`. Si la consulta de mascotas falló después de que
    el catálogo arrancara, el reintento pide el catálogo igual, con la `species`
    del render actual. Es el caso del paso de smoke (perro).
  - `void` descarta la promesa, como en Salud. No se espera ni se atrapa nada:
    `getVaccineCatalog` resuelve siempre.
- **Selección tras el reintento (R5).** No se toca `selectedDraft` ni
  `selectVaccine`. La regla `selectedDraft ?? entries[0]?.id ?? 'other'` ya
  preselecciona la primera entrada cuando llegan las entradas.
- **Copy reutilizado (R7).** `health.couldNotLoadVaccines` y `common.retry`. No
  cambia `src/i18n/catalog.ts`. No hay G1.
- **Sin canvas propio (R8).** No hay artboard del catálogo en error en v167. La
  receta es la del aviso de Salud (`screens/health/index.tsx`, bloque
  `vaccines-error` y `vaccines-retry`), con el primario de heroui-native sin labio,
  por la regla 13 «Sin labio» de la carta. No se congela nada en `canvas/`.

## Archivos afectados

Todo es presentación móvil. No hay dominio, aplicación ni infraestructura de
backend.

- `src/screens/vaccine-create/index.tsx` — la constante `catalogFailed` y el
  bloque `vaccine-create-catalog-error` (R1–R6, R8).
- `src/screens/vaccine-create/index.test.tsx` — los tests `#236 R1`–`#236 R6` y
  `#236 R8`.
- `src/__tests__/ui-copy-table.ts` — dos filas en `R19_VACCINE_CREATE` (R7).
- `src/__tests__/ui-language.test.ts` — el título y la longitud del `it`
  `#208 R20` (R7).
- `progress/smoke_mejoras-smoke.md` (desde la raíz del repo) — la sección de
  smoke (R9).
- `specs/mobile-vaccine-catalog-error-state/traceability.md` — las filas
  rellenas.

No cambian:

- `src/i18n/catalog.ts`;
- `src/api/health-records.ts`;
- `src/api/query-keys.ts`;
- `src/screens/health/index.tsx`;
- ninguna guarda de `src/__tests__/` salvo las dos de R7.

## Inventarios revisados (no cambian)

Se comprobó cada inventario que nombra `screens/vaccine-create/index.tsx` contra
lo que añade el bloque:

- **Radios y esquinas.** El bloque no lleva `rounded-*`, así que no cambian:
  - `consistency-classnames.test.ts`, `#62 R14` (cuenta 7);
  - `design-drift.test.ts`, radios (cuenta 1);
  - `chunky-cta-canvas-fidelity.test.ts`, `radii` (cuenta 1) y `#177 R7.3`.
- **Tamaños de texto.**
  - `text-15` tiene inventario de ficheros (`alerts-canvas-fidelity.test.ts`,
    `#174 R12: inventarios`, fila `token: 'text-15'`). El fichero ya está en él:
    el campo de nombre usa `text-15`, así que la lista no cambia.
  - `leading-body` no tiene inventario por fichero.
  - Los inventarios de `text-13`, `text-17`, `text-22` y `text-26` no se tocan:
    el bloque no usa esas clases.
- **Botones.**
  - `#177 R3.3` y `#166 R2` (Buttons con `bg-accent`) no ven el reintento, porque
    no lleva `className`.
  - `#177 R8.4` lo recoge por el sufijo `-retry` y exige que no tenga labio. Pasa
    sin tocarlo.
  - `#177 R6.2` (recuentos de etiquetas) no cambia: el hijo es texto plano, como
    en `vaccines-retry`.
- **Copy.** `#194 R5` suma ficheros, no usos: no cambia. El único recuento de usos
  es el `it` `#208 R20` (R7).

## Tests: intención de cada doble

No se copian mocks de otros ficheros. Se usan los dobles que ya tiene
`src/screens/vaccine-create/index.test.tsx`:

- `mockCatalog` (`getVaccineCatalog`) y `mockListPets`;
- `pending()`, una promesa que no resuelve, en la línea `function pending<T>()`;
- `renderVaccineCreate()`, asíncrono;
- `apiUrl`;
- el array `catalog` con `cat-lepto`, `cat-dhppi`, `cat-rabia` y `cat-tos`;
- el `beforeEach`, que deja el catálogo en `ok` con esas cuatro entradas.

Todo `fireEvent.press` va con `await` (RNTL 14).

| Test | Intención del doble | Qué se asserta |
|---|---|---|
| `#236 R1` it.each | `mockCatalog.mockResolvedValue(state)` con cada `state` no `ok` | El bloque aparece (`findByTestId`). Los `testID` de los hijos del padre de la leyenda contienen, seguidos, `vaccine-create-legend`, `vaccine-create-catalog-error` y `vaccine-create-chips`. El primer hijo del bloque es `vaccine-create-catalog-error-text`, con `className` exacto, `accessibilityRole` `'alert'`, `selectable` `true` y texto exacto. `within(bloque).getByTestId('vaccine-create-catalog-retry')` tiene `toHaveTextContent('Reintentar')`. `queryByText('SERVER_NETWORK_PRIVATE')` es `null` |
| `#236 R1` rechazo | `mockCatalog.mockRejectedValue(new Error('SERVER_THROWN_PRIVATE'))`. El cliente tiene `retry: false`: no hay reintentos ocultos | El mismo bloque y el mismo texto. `queryByText('SERVER_THROWN_PRIVATE', { exact: false })` es `null` |
| `#236 R2` | `mockCatalog.mockResolvedValue({ kind: 'error' })` | Con el bloque pintado, `vaccine-create-chips` tiene un solo hijo, `vaccine-chip-other`, con `{ selected: true }`, y `vaccine-create-name` existe |
| `#236 R3` it.each | El `beforeEach` (`con entradas`) o `mockCatalog.mockResolvedValue({ kind: 'ok', entries: [] })` (`vacío`) | Se espera a `vaccine-create-chips`. Luego `queryByTestId('vaccine-create-catalog-error')`, `queryByTestId('vaccine-create-catalog-retry')` y `queryByText('No se pudieron cargar las vacunas')` son `null`. Hijos esperados: `['vaccine-chip-other']` (vacío) o los cinco de `#208 R8` (con entradas) |
| `#236 R4` | `mockCatalog.mockReturnValue(pending())` | Se espera a `vaccine-create-chips-skeleton`. `queryByTestId('vaccine-create-catalog-error')` es `null` |
| `#236 R5` | `mockCatalog.mockResolvedValueOnce({ kind: 'error' })`; la segunda llamada usa el `ok` del `beforeEach` | Pulsar `vaccine-create-catalog-retry`. Luego: `mockCatalog` tiene 2 llamadas; `toHaveBeenNthCalledWith(2, apiUrl, 'jwt-token', 'dog')`; `mockListPets` sigue en 1 llamada; los hijos de `vaccine-create-chips` son los cinco de `#208 R8`, en orden; `vaccine-chip-cat-lepto` tiene `{ selected: true }`; `vaccine-create-catalog-error` desaparece (`waitFor` + `queryByTestId` `null`) |
| `#236 R6` en vuelo | `mockCatalog.mockResolvedValueOnce({ kind: 'error' }).mockReturnValueOnce(pending())` | Tras pulsar, `mockCatalog` tiene 2 llamadas, el bloque y `vaccine-chip-other` siguen, y `vaccine-create-chips-skeleton` es `null` |
| `#236 R6` falla otra vez | `mockCatalog.mockResolvedValue({ kind: 'error' })` | Primera pulsación: esperar a 2 llamadas. Segunda: esperar a 3. Tras cada una, el bloque sigue y `vaccine-create-catalog-retry` existe |
| `#236 R8` | Ninguno: lee el fuente con el `readFileSync` de `jest.requireActual('fs')` que ya tiene el fichero | Cada uno de los tres literales de [[requirements]] R8 aparece exactamente una vez (`source.split(literal).length - 1` es `1`) |

### Pruebas de mutación de los tests que nacen verdes (R3, R4)

R3 y R4 pasan antes de la implementación, porque el bloque no existe. Se prueban
contra mutaciones plantadas en `catalogFailed`, una a una, con el test en rojo y
el fichero restaurado después. El resultado va a
`progress/impl_mobile-vaccine-catalog-error-state.md`.

| Mutación de `catalogFailed` | Test que debe ponerse rojo |
|---|---|
| `entries.length === 0` | `#236 R3 … vacío` y `#236 R4` |
| `!catalog.isPending` | `#236 R3 … vacío` y `#236 R3 … con entradas` |
| `catalog.data?.kind !== 'ok'` (sin `!catalog.isPending`) | `#236 R4` |
| `!catalog.isFetching && catalog.data?.kind !== 'ok'` | `#236 R6 … en vuelo` (prueba de cobertura de R6, que nace rojo) |

## Paso de smoke

Sección literal que la implementación añade al final de
`progress/smoke_mejoras-smoke.md`, detrás de la última sección que haya (otra
feature puede haber añadido la suya después de `#226`). Lleva una línea en
blanco antes del `##`. El fallo se reproduce con un perro: con un gato, si cae la
consulta de mascotas, `species` vuelve a `'dog'` y la clave cambia (§Fuera de
alcance de [[requirements]]).

```markdown
## #236 mobile-vaccine-catalog-error-state

Hallazgo: si el catálogo de vacunas no carga, «Agregar vacuna» no avisa y solo deja «Otra vacuna».
Necesita el dev build con `dev` actualizado (cambia la app, no el backend).

1. En el build de antes, con el backend en marcha, abre un perro y entra en Salud. Detén el backend de tu PC y pulsa «Agregar vacuna». Debe salir solo «Otra vacuna», sin ningún aviso: es el fallo.
2. Con el build nuevo, repite el paso 1. Debajo de «Vacuna» sale «No se pudieron cargar las vacunas» en rojo y el botón «Reintentar». «Otra vacuna» sigue seleccionada, con su campo de nombre.
3. Pulsa «Reintentar» con el backend todavía detenido: el aviso sigue.
4. Arranca el backend y pulsa «Reintentar». Salen Leptospirosis, Polivalente (DHPPi), Rabia y Tos de las perreras, después «Otra vacuna», y el aviso desaparece.

- [ ] Smoke de #236 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)
```

## Alternativas descartadas

- **Reemplazar los chips por el aviso durante el error.** Bloquearía el alta
  libre, que `#208 R8` garantiza. El aviso se suma (D2).
- **`EmptyState` compartido (`components/empty-state.tsx`) o un componente nuevo
  de error con reintento.** `EmptyState` es para listas vacías: trae
  ilustración y `text-17`/`text-22`. Un componente nuevo con dos consumidores
  (Salud y Agregar vacuna) no compensa: obligaría a enmendar inventarios de las
  dos pantallas.
- **Copy nuevo propio** («No pude cargar el catálogo de vacunas»). Exigiría G1 y
  no aporta: la clave de Salud dice lo mismo.
- **Pintar el aviso en la barra fija** (junto a `vaccine-create-error`). Esa barra
  es del error al guardar (`#208 R17`). Mezclar los dos errores confundiría qué
  reintenta qué.
- **`queryClient.invalidateQueries({ queryKey: healthKeys.vaccineCatalog(species) })`.**
  Hace lo mismo que `refetch()` con más código. Además, invalidar no refetcha si
  la consulta está deshabilitada.
- **Deshabilitar «Reintentar» mientras `isFetching`.** Salud no lo hace. Un doble
  toque solo cancela y relanza la misma petición.
