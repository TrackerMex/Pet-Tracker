---
feature: "mobile-vaccine-create"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-vaccine-create]] (#208)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`) más una línea de
> `init.config.sh`. El backend ya existe y **no cambia**.
> Diseño, archivos y alternativas en [[design]]; plan TDD en [[tasks]].

## Contexto

El owner registra una vacuna desde Salud. Puede elegirla del catálogo de su
especie o escribir un nombre libre («Otra vacuna»). La app propone la próxima
dosis, crea un recordatorio a las 09:00 de ese día y avisa si el recordatorio
falla. Si falla, la vacuna se conserva.

## Fuentes

- **Canvas congelado** en `specs/mobile-vaccine-create/canvas/`: seis artboards
  servidos en la versión `1793039639-fe0d`. Su copy es idéntico al aprobado en
  G1 sobre v140 (`progress/plan_mejoras-producto-2026-10-26.md` §5, casilla G1
  marcada).
  - `AltaVacuna.dc.html`: sha256 empieza por `f10cbed2`
  - `AltaVacunaOtra.dc.html`: `713e9461`
  - `AltaVacunaError.dc.html`: `e6af36a3`
  - `SaludConAltaVacuna.dc.html`: `c3641a44`
  - `SaludVacunaSinRecordatorio.dc.html`: `98db0be4`
  - `SaludVacunasVacioOwner.dc.html`: `79a3ef69`
- `progress/plan_mejoras-producto-2026-10-26.md` §2 «208».
- `progress/design_ola0-mejoras-2026-10-26.md`, respuestas a las preguntas
  abiertas.
- `progress/explore_vaccines-reminders-2026-10-26.md`, evidencia del backend.
  Sus premisas se re-midieron contra el árbol; las cuentas válidas son las de
  esta spec.
- `docs/ui-guidelines.md`, que rige toda la UI.
- **Contrato de #220** (`mobile-date-field`, rama `feature/220-…`): `DateField`
  y `utils/civil-date.ts`. **#208 no se implementa hasta que #220 esté
  mergeada en `dev`.** Ver [[design]] §Dependencia de #220.

## Evidencia del backend (sin cambios)

Todas las cuentas se miden con `grep -cF` desde la raíz del worktree.

- `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`:
  - `grep -cF "describe('R3: GET /v1/vaccine-catalog'"` → **1**. Ese bloque
    asserta las claves `['id','species','name','scheme']`.
  - Cada entrada trae `scheme: { firstDoseMonths, series?, boosterMonths }`.
- `boosterMonths` llega al cliente. La semilla de
  `backend-pet-tracker/src/db/seed/vaccine-catalog.ts` tiene **7** entradas, todas
  con `boosterMonths: 12`:
  - dog: Leptospirosis, Polivalente (DHPPi), Rabia, Tos de las perreras
  - cat: Leucemia felina (FeLV), Rabia, Triple felina (FVRCP)
  - La API las ordena por `name` ascendente.
- `POST /v1/pets/:petId/vaccines`:
  - Solo el owner.
  - El esquema es estricto y exige exactamente uno de `catalogId` o `name`
    (`name` de 1 a 120 caracteres tras trim).
  - `appliedAt` (ISO `YYYY-MM-DD`) posterior al día civil del owner da
    400 `errors:[{path:'appliedAt'}]`.
  - `nextDoseAt` es opcional pero no admite `null`. Si se omite, el backend
    rellena `appliedAt + boosterMonths` (con catálogo) o `null` (sin catálogo).
  - `vetName` y `clinic` admiten 1..120 caracteres; `notes`, 1..2000.
  - Responde 201 con la forma `Vaccine`.
- `POST /pets/:petId/reminders` es solo para el owner y recibe
  `{ type, title ≤120, dueAt futuro, advanceMinutes? (0..10080, por defecto 60) }`.
  El push sale en `dueAt - advanceMinutes`.

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
- Cada test nombrado empieza por `#208 R<n>`.
- Las anclas se citan por contenido, como `grep -cF '<literal>' <ruta>` → cuenta
  esperada, medida en la base `origin/dev` 2041e2b3. Las marcadas **[#220]**
  existen solo cuando #220 está mergeada: el fichero no existe en 2041e2b3 y la
  cuenta indicada vale tras `git merge origin/dev`.
- **Copy literal.** Cada R-id fija sus literales es/en. Codex no inventa copy.
- **Fecha fija en los tests de pantalla.** El día civil es **2026-10-06** con
  `me.timezone = 'America/Mexico_City'`. El reloj se fija con el patrón que ya
  use `screens/add-reminder/index.test.tsx`, o con
  `jest.useFakeTimers({ now: new Date('2026-10-06T18:00:00.000Z') })`.
- Mascota de los tests: `{ id: 'pet-1', name: 'Rocky', species: 'dog', myRole: 'owner' }`
  salvo que el R-id diga otra cosa.
- Catálogo de los tests de pantalla, en el orden de la API: Leptospirosis
  (`cat-lepto`), Polivalente (DHPPi) (`cat-dhppi`), Rabia (`cat-rabia`) y Tos
  de las perreras (`cat-tos`). Todas con `boosterMonths: 12`.

## Requisitos funcionales

### R1 — Clientes de API

**Primera parte.** THE SYSTEM SHALL exportar desde `api/health-records.ts`
`getVaccineCatalog(baseUrl, token, species: 'dog' | 'cat', fetchFn = fetch)`.

- Hace `GET` a la ruta relativa `/vaccine-catalog?species=<species>`, con el
  mismo helper (`getJson`) y la misma base que `listVaccines`.
- Devuelve:
  - `{ kind: 'ok', entries: VaccineCatalogEntry[] }` con 200 (el 200 es un array JSON, sin envoltorio)
  - `{ kind: 'unauthorized' }` con 401
  - `{ kind: 'error' }` con cualquier otro estado
  - `{ kind: 'unreachable', message }` si `fetch` lanza
  - `{ kind: 'missing-config' }` sin `baseUrl`

**Segunda parte.** THE SYSTEM SHALL exportar
`createVaccine(baseUrl, token, petId, input: CreateVaccineInput, fetchFn = fetch)`.

- Hace `POST` a `/pets/${petId}/vaccines` con el cuerpo `input` tal cual.
- Devuelve:
  - `{ kind: 'ok', vaccine: Vaccine }` con 201
  - `{ kind: 'validation', errors: FieldError[] }` con 400
  - `{ kind: 'forbidden' }` con 403
  - `{ kind: 'unauthorized' }` con 401
  - `{ kind: 'error' }` con cualquier otro estado
  - `unreachable` y `missing-config`, como `createWeight`

**Tipos**, en `api/types.ts`:

```
VaccineCatalogEntry = { id; species: 'dog'|'cat'; name;
  scheme: { firstDoseMonths: number; series?: number; boosterMonths: number } }
CreateVaccineInput = { catalogId?; name?; appliedAt; nextDoseAt?; vetName?; clinic?; notes? }
```

**Clave de query**: `healthKeys.vaccineCatalog = (species) => ['health', 'vaccine-catalog', species] as const`.

- Anclas:
  - `grep -cF 'export async function listVaccines' api/health-records.ts` → 1
  - `grep -cF 'export async function createWeight' api/health-records.ts` → 1
  - `grep -cF 'export interface Vaccine ' api/types.ts` → 1
  - `grep -cF "vaccines: (petId: string) => ['health', 'vaccines', petId] as const," api/query-keys.ts` → 1
- Test: `api/__tests__/health-records.test.ts`. Hay un `it` por rama:
  - `#208 R1: getVaccineCatalog pide la especie y devuelve las entradas` (asserta la URL completa y `kind/entries`)
  - `#208 R1: getVaccineCatalog mapea 401, 500, fallo de red y falta de config`
  - `#208 R1: createVaccine envía el cuerpo exacto y devuelve la vacuna con 201`
  - `#208 R1: createVaccine mapea 400 a validation con sus errores`
  - `#208 R1: createVaccine mapea 403, 401, 500, fallo de red y falta de config`

### R2 — Suma de meses civiles

THE SYSTEM SHALL exportar `addCalendarMonthsIso(iso: string, months: number): string`
desde el fichero nuevo `utils/vaccine-dates.ts`.

- Suma meses de calendario a una fecha `YYYY-MM-DD`.
- Si el día no existe en el mes destino, recorta al último día de ese mes,
  igual que `addCalendarMonths` del backend.
- No depende de la zona horaria del proceso. Candado: un segundo `it.each`
  `#208 R2: en America/Mexico_City suma %i meses a %s y da %s` recorre las mismas filas tras
  `process.getBuiltinModule('process').env.TZ = 'America/Mexico_City'` y restaura el valor previo en
  `afterEach`. Asignar `process.env.TZ` dentro de jest no cambia `Date`.

- Test: `utils/__tests__/vaccine-dates.test.ts`, en un `it.each` titulado
  `#208 R2: suma %i meses a %s y da %s`. Cada fila es `[months, iso, esperado]`. Filas exactas:

| `iso`        | `months` | esperado     |
|--------------|---------:|--------------|
| `2026-10-06` | 12       | `2027-10-06` |
| `2026-12-15` | 1        | `2027-01-15` |
| `2026-01-31` | 1        | `2026-02-28` |
| `2024-01-31` | 1        | `2024-02-29` |
| `2026-03-31` | 1        | `2026-04-30` |
| `2026-11-30` | 3        | `2027-02-28` |
| `2026-12-31` | 2        | `2027-02-28` |
| `2024-02-29` | 12       | `2025-02-28` |
| `2026-11-30` | 1        | `2026-12-30` |

### R3 — Regla pura del nombre libre

THE SYSTEM SHALL exportar desde `utils/form-rules.ts`
`validateVaccine(values: { mode: 'catalog' | 'other'; name: string }): FieldIssues<'name'>`.

- Con `mode === 'other'` y `name.trim() === ''`, devuelve
  `{ name: { labelKey: 'vaccineCreate.nameRequired' } }`.
- En cualquier otro caso devuelve `{}`.

- Ancla: `grep -cF 'export function validateWeight' utils/form-rules.ts` → 1
- Test: `utils/form-rules.test.ts`, un `it` por rama:
  - `#208 R3: «Otra vacuna» con nombre en blanco pide el nombre` (con `''` y con `'   '`)
  - `#208 R3: «Otra vacuna» con nombre no pide nada`
  - `#208 R3: con catálogo no pide nombre aunque esté vacío`

### R4 — Ruta delgada y Stack protegido

**Ruta.** THE SYSTEM SHALL añadir la ruta delgada `app/pets/[petId]/vaccines/new.tsx`.

- Lee `const { petId } = useLocalSearchParams<{ petId: string }>()`.
- Renderiza `<VaccineCreateScreen petId={petId} />`, importado de
  `'../../../../screens/vaccine-create'`.

**Pantalla.** La pantalla vive en `screens/vaccine-create/index.tsx`, con export
nombrado `VaccineCreateScreen({ petId }: { petId: string })`.

**Stack.** THE SYSTEM SHALL declarar en `app/_layout.tsx`
`<Stack.Screen name="pets/[petId]/vaccines/new" options={{ headerShown: false }} />`
dentro del grupo `Stack.Protected`.

- Va justo después de `meals-history`. No se fija índice absoluto: #209 también añade un hijo al grupo.
- El grupo gana un hijo (los `+ 1 // #208 R4`).

- Anclas:
  - `grep -cF '<Stack.Screen name="meals-history" options={{ headerShown: false }} />' app/_layout.tsx` → 1
  - `grep -cF 'useLocalSearchParams<{ petId: string }>()' app/pets/[petId]/docs-upload.tsx` → 1
- Tests:
  - `app/__tests__/layout.test.tsx`: `#208 R4: la pantalla de alta de vacuna va justo tras meals-history y no pinta cabecera nativa`.
    Con `names` = los `name` de los hijos del grupo protegido, asserta
    `names.indexOf('pets/[petId]/vaccines/new') === names.indexOf('meals-history') + 1`
    y `options` `{ headerShown: false }`.
    Además, los cuatro `toHaveLength(…)` del grupo protegido suman `+ 1 // #208 R4`,
    y sus `it` llevan `(enmendado por #208 R4)`.
  - `app/__tests__/detail-stack.guard.test.tsx`: la lista del `it.each` de `#149 R3`
    gana `'/pets/pet-1/vaccines/new', // #208 R4`.
  - `screens/vaccine-create/index.test.tsx`: `#208 R4: la ruta pasa el petId de la URL a la pantalla`.

### R5 — CTA «Agregar vacuna» en la cabecera de Vacunas, solo para el owner

**Fila de cabecera.** THE SYSTEM SHALL envolver el título de la sección en
`<View testID="vaccines-header" className="flex-row items-center justify-between">`.
Esa fila es el primer hijo de `vaccines-section`.

- El título `vaccines-title` sigue siendo su primer hijo y conserva su clase.

**Owner.** WHEN la mascota seleccionada tiene `myRole === 'owner'`, THE SYSTEM
SHALL pintar como segundo hijo de esa fila
`<Button testID="vaccines-add" className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}>`.
Es la receta «Compacto» de la carta §13.

- Lleva `<Plus size={16} color={accentForeground} />`.
- Lleva `<Button.Label className="text-sm font-extrabold text-accent-foreground">`
  con «Agregar vacuna» / «Add vaccine».
- `onPress={openVaccineCreate}`, un handler de la pantalla que hace
  `router.push({ pathname: '/pets/[petId]/vaccines/new', params: { petId: selectedPetId } })`.

**Resto de roles.** WHEN `myRole` es `'family'`, `'walker'` o `'vet'`, THE SYSTEM
SHALL NOT pintar `vaccines-add`, y la fila tiene un solo hijo.

- El rol sale del mismo `listPets` que ya consulta Salud: `pets.find(p => p.id === selectedPetId)?.myRole`.
- Anclas:
  - `grep -cF 'testID="vaccines-title"' screens/health/index.tsx` → 1
  - `grep -cF 'queryFn: () => listPets(' screens/health/index.tsx` → 1
  - `grep -cF 'className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}' screens/reminders/index.tsx` → 1
- Test: `screens/health/index.test.tsx`:
  - Enmienda del doble: el mock cerrado de `reicon-react-native` de este fichero (hoy `Check`,
    `ChevronRight`, `Clock`, `HeartPulse` y `Syringe`) gana `Plus: icon('health-icon-plus')` y
    `BellOff: icon('health-icon-bell-off')`. Va en el commit rojo de R5 y sirve también a R6 y R16.
  - `#208 R5: el owner ve «Agregar vacuna» con la receta compacta y abre el alta de su mascota`.
    Asserta `className`, `style`, el label y la llamada exacta a `router.push`.
  - `it.each(['family', 'walker', 'vet'])('#208 R5: %s no ve «Agregar vacuna»', …)`.
    Hay una fila por rama; cada una asserta `vaccines-header.children` con longitud 1.
  - La aserción de `#199 R15` `elementChild(vaccines-section, 0).props.testID === 'vaccines-title'`
    pasa a mirar `vaccines-header` como primer hijo y `vaccines-title` como primer
    hijo de este, y su título suma `(enmendado por #208 R5)`. No se borra ninguna
    otra aserción.

### R6 — Estado vacío de Vacunas para el owner

**Owner.** WHEN la lista de vacunas es `[]` y la mascota tiene `myRole === 'owner'`,
THE SYSTEM SHALL pintar, en lugar de `vaccines-empty`,
`<View testID="vaccines-empty-card" className="items-center gap-2.5 rounded-24 bg-surface-secondary px-4.5 pb-4.5 pt-5.5" style={CONTINUOUS_CORNER}>`.
La tarjeta tiene cuatro hijos, en este orden:

1. **Tile** `vaccines-empty-tile`: `size-14 items-center justify-center rounded-tile bg-surface`
   con `style={CONTINUOUS_CORNER}`. Lleva `<Syringe size={28} color={accentStrong} />`.
2. **Título** `vaccines-empty-card-title`: `text-17 font-black text-foreground text-center`.
   Texto «Aún no hay vacunas» (clave existente `health.noVaccinesYet`).
3. **Cuerpo** `vaccines-empty-card-body`: `text-sm font-medium leading-note text-muted text-center`.
   - es: «Registra la primera vacuna de {{name}} y te aviso antes de cada próxima dosis.»
   - en: «Log {{name}}'s first vaccine and I'll remind you before each next dose.»
4. **CTA** `vaccines-empty-action`: `<Button className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}>`.
   - Lleva `<Plus size={20} color={accentForeground} />`.
   - Lleva `<Text className="text-17 font-extrabold text-accent-foreground">` con «Agregar vacuna».
   - `onPress={openVaccineCreate}`, el mismo handler de R5.
   - Es la receta global de primario. La desviación del canvas (52/16 → 56/17)
     está en [[design]].

**Resto de roles.** WHEN la lista es `[]` y `myRole` no es `'owner'`, THE SYSTEM
SHALL conservar `vaccines-empty` exactamente como hoy: mismo texto y clase
`text-15 leading-body text-muted`. No pinta ni `vaccines-empty-card` ni CTA.

- Anclas:
  - `grep -cF 'testID="vaccines-empty"' screens/health/index.tsx` → 1
  - `grep -cF "'health.noVaccinesYet':" i18n/catalog.ts` → 2
- Test: `screens/health/index.test.tsx`:
  - `#208 R6: el owner sin vacunas ve la tarjeta del canvas con sus cuatro hijos y copy literal`.
    Asserta `children` con longitud 4 y sus `testID` en orden, clases y textos
    con `{ exact: true }`, y la ausencia de `vaccines-empty`.
  - `#208 R6: el CTA del vacío abre el alta de vacuna de la mascota`.
  - `it.each(['family', 'walker', 'vet'])('#208 R6: %s sin vacunas ve el aviso plano sin CTA', …)`.
  - Los `it` existentes `shows the vaccines empty state`, `shows and retries a $kind vaccine error`
    y `#199 R19 sin vacunas pinta el aviso…` montan la mascota con
    `makePet({ myRole: 'family' })`, y su título suma `(enmendado por #208 R6)`.
    Sus aserciones no cambian.

### R7 — Estructura y dimensiones de la pantalla de alta

**Raíz y scroll.** THE SYSTEM SHALL montar `VaccineCreateScreen` como
`KeyboardAvoidingView behavior="padding"` (raíz `flex-1 bg-background`) con dos hijos:

- Un `ScrollView keyboardShouldPersistTaps="handled"` cuyo
  `contentContainerStyle` es `{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 24, gap: 16 }`.
- La barra fija `vaccine-create-bar`, con estilo
  `{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16), gap: 12 }`.
  Su último hijo es el CTA `vaccine-create-submit`.

**Cabecera.** El primer hijo del contenido es
`<ScreenHeader testID="vaccine-create-header" size={24} backFallback="/health" title={t('vaccineCreate.title')} />`.

- es «Agregar vacuna», en «Add vaccine».

**Leyenda.** El segundo hijo es la leyenda `vaccine-create-legend`, un `Text`
`text-sm font-extrabold text-foreground`.

- Su texto es «Vacuna» (`vaccineCreate.vaccine`; en «Vaccine»).
- Lleva un `Text` anidado `vaccine-create-legend-species`, `font-semibold text-muted`:
  - perro: « · esquema para perro» (`vaccineCreate.schemeForDog`; en « · schedule for dogs»)
  - gato: « · esquema para gato» (`vaccineCreate.schemeForCat`; en « · schedule for cats»)
  - Se elige con `species === 'cat' ? t('vaccineCreate.schemeForCat') : t('vaccineCreate.schemeForDog')`.
- La especie y el nombre salen de `listPets`: `pets.find(p => p.id === petId)`,
  con la misma `queryKey` `petKeys.list()` que Salud.

- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R7: monta cabecera, leyenda y barra fija con las dimensiones del canvas`.
    Asserta `contentContainerStyle`, el estilo de la barra con `insets.bottom = 34`
    y `insets.bottom = 0`, y los textos.
  - `#208 R7: un gato ve «· esquema para gato»`.

### R8 — Chips del catálogo

**Carga.** WHILE el catálogo de la especie carga (`useQuery` con
`healthKeys.vaccineCatalog(species)` y `getVaccineCatalog`), THE SYSTEM SHALL
pintar `vaccine-create-chips-skeleton`.

- Contiene tres `Skeleton` `h-9.5 w-28 rounded-full`.
- No pinta ningún chip.

**Listo.** WHEN el catálogo responde `ok`, THE SYSTEM SHALL pintar, en
`vaccine-create-chips` (`flex-row flex-wrap gap-2`), un chip por entrada en el
orden de la API y después el chip «Otra vacuna».

- Cada entrada es un `Pressable` `vaccine-chip-${entry.id}` con
  `accessibilityRole="button"`, `accessibilityState={{ selected }}` y `hitSlop={TOUCH_SLOP}`
  (de `theme/touch-target`, como `type-chip` de `add-reminder`).
- El chip «Otra vacuna» es `vaccine-chip-other`, con los mismos tres props.
- **La primera entrada queda seleccionada al cargar.**
- Clases de chip:

| Estado | Clase | Labio | Etiqueta |
|---|---|---|---|
| Sin seleccionar | `h-9.5 items-center justify-center rounded-full px-3.5 bg-default` | ninguno | `text-sm font-extrabold text-foreground` |
| Seleccionado | `h-9.5 items-center justify-center rounded-full px-3.5 bg-accent` | `style={chunkyLip.primaryCompact}` | `text-sm font-extrabold text-accent-foreground` |
| «Otra vacuna» sin seleccionar | `h-9.5 flex-row items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-3.5 bg-surface` | ninguno | `text-sm font-extrabold text-foreground` |

- «Otra vacuna» lleva `<Plus size={16} strokeWidth={2.8} color={…} />`, en `foreground`
  sin seleccionar y en `accentForeground` seleccionado.
- Etiqueta es/en: «Otra vacuna» / «Other vaccine» (`vaccineCreate.otherVaccine`).

**Error de catálogo.** IF el catálogo responde cualquier `kind` distinto de `ok`,
THEN THE SYSTEM SHALL pintar solo `vaccine-chip-other`, seleccionado.

- No hay copy nueva de error: el alta libre sigue disponible.

- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R8: mientras carga pinta tres esqueletos de chip y ningún chip`
  - `#208 R8: pinta los chips en el orden de la API, preselecciona el primero y cierra con «Otra vacuna»`.
    Asserta `children.map(testID)` exacto y los dos `className`.
  - `#208 R8: pulsar un chip lo selecciona con labio de tres y deselecciona el anterior`.
    Asserta `props.hitSlop` igual a `TOUCH_SLOP`, importado de producción, en un chip del
    catálogo y en `vaccine-chip-other`.
  - `#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado`

### R9 — Modo «Otra vacuna»: nombre y contador

**Campo de nombre.** WHILE `vaccine-chip-other` está seleccionado, THE SYSTEM
SHALL pintar el campo de nombre bajo los chips.

- Etiqueta `text-sm font-extrabold text-foreground`: «Nombre de la vacuna» / «Vaccine name»
  (`vaccineCreate.vaccineName`).
- A su derecha, el contador `vaccine-create-name-count`:
  - clase `text-xs font-semibold text-muted` y `style={TABULAR_NUMS}`
  - texto `${name.length}/120`
- `TextInput` `vaccine-create-name` con `maxLength={120}` y `style={CONTINUOUS_CORNER}`.
  - Clase: `h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 ${focused ? 'border-accent' : 'border-transparent'}`.
- Debajo, `<FieldErrorMessage testID="vaccine-create-name" issue={fieldErrors.name} />`.

**Con catálogo.** WHILE hay un chip de catálogo seleccionado, THE SYSTEM SHALL
NOT pintar `vaccine-create-name` ni `vaccine-create-name-count`.

- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R9: «Otra vacuna» muestra nombre, contador 0/120 y lo actualiza a 13/120 con «Leishmaniasis»`
  - `#208 R9: el borde del nombre pasa a border-accent con foco y vuelve a border-transparent al perderlo`
  - `#208 R9: con un chip del catálogo no hay campo de nombre ni contador`

### R10 — Fechas con DateField (#220)

**Fecha de aplicación.** THE SYSTEM SHALL pintar, en una rejilla de dos columnas
(`flex-row gap-2.5`, cada columna `flex-1`),
`<DateField testID="vaccine-create-applied" label={t('vaccineCreate.appliedAt')} … />`.

- Label: «Fecha de aplicación» / «Date given».
- Valor inicial y `maxDate`: `civilTodayIso(profileTimeZone)`, con el patrón
  `getMe` / `userKeys.me()` de `weight-log`.
- `isInvalid={Boolean(fieldErrors.appliedAt)}`.
- Debajo, `<FieldErrorMessage testID="vaccine-create-applied" issue={fieldErrors.appliedAt} />`.

**Próxima dosis.** En la segunda columna,
`<DateField testID="vaccine-create-next" label={t('vaccineCreate.nextDose')} minDate={appliedAt} … />`.

- Label: «Próxima dosis» / «Next dose».

**Con catálogo.** WHILE hay un chip de catálogo seleccionado, el valor de
«Próxima dosis» es `addCalendarMonthsIso(appliedAt, entry.scheme.boosterMonths)`.

- La propuesta se recalcula al cambiar de chip o de `appliedAt`, salvo que el
  usuario haya elegido «Próxima dosis» a mano después del último cambio de chip.
  Entonces su elección se conserva hasta el siguiente cambio de chip.
- WHEN `appliedAt` cambia y la «Próxima dosis» vigente queda anterior a `appliedAt`,
  THE SYSTEM SHALL descartarla, en los dos modos: con catálogo vuelve a
  `addCalendarMonthsIso(appliedAt, entry.scheme.boosterMonths)`; con «Otra vacuna» vuelve a `null`.
- `allowClear` es `false`.

**«Otra vacuna».** WHILE «Otra vacuna» está seleccionado, «Próxima dosis» empieza
en `null`, con el placeholder por defecto de DateField («Elige una fecha»).

- `allowClear` es `true`.

- Anclas [#220]:
  - `grep -cF 'export function DateField' components/date-field.tsx` → 1
  - `grep -cF 'export function isoToLocalDate' utils/civil-date.ts` → 1
  - `grep -cF 'export function localDateToIso' utils/civil-date.ts` → 1
- Test: `screens/vaccine-create/index.test.tsx`. Se usa el arnés de `@expo/ui`
  de `add-reminder/index.test.tsx` con los testID de #220: el picker solo existe tras
  `await fireEvent.press(getByTestId('vaccine-create-applied'))`, y entonces
  `await fireEvent(getByTestId('vaccine-create-applied-picker'), 'onValueChange', {}, new Date(2026, 8, 1, 12))`
  cambia el valor y lo desmonta. Ídem `vaccine-create-next` y `vaccine-create-next-picker`.
  `onDismiss` solo para cerrar sin elegir, nunca después de `onValueChange`.
  - `#208 R10: aplicación empieza hoy (6 oct 2026) con máximo hoy y la próxima dosis propone 6 oct 2027`.
    Asserta `${testID}-value` con `value` «6 oct 2026» y «6 oct 2027». Tras abrirlo,
    `vaccine-create-applied-picker` tiene `maximumDate` igual a `new Date(2026, 9, 6, 12)`
    (mediodía local, contrato de #220).
  - `#208 R10: cambiar la fecha de aplicación recalcula la propuesta`
  - `#208 R10: una próxima dosis elegida a mano sobrevive al cambio de aplicación y cae al cambiar de chip`
  - `#208 R10: «Otra vacuna» deja la próxima dosis vacía y permite borrarla`.
    Con valor `null` no existe `vaccine-create-next-clear` (#220 R11). Tras elegir una fecha existe;
    pulsarlo deja `vaccine-create-next-value` vacío. Con catálogo y fecha válida no existe.
  - `it.each` de dos filas, una por modo,
    `#208 R10: si la fecha de aplicación supera la próxima dosis elegida, con %s vuelve a %s`.
    Aplicación 1 sep 2026, próxima 15 sep 2026 a mano, aplicación 1 oct 2026. Filas:
    `['catálogo', 'la propuesta']`, con `vaccine-create-next-value` «1 oct 2027» (primera entrada,
    `boosterMonths` 12), y `['«Otra vacuna»', 'vacía']`, con `vaccine-create-next-value` `''`.

### R11 — Nota del esquema

THE SYSTEM SHALL pintar bajo la rejilla de fechas la nota `vaccine-create-note`.

- Contenedor: `flex-row gap-2.5 rounded-tile bg-default px-3.5 py-3`, con `style={CONTINUOUS_CORNER}`.
- Lleva `<InfoCircle size={20} color={muted} />`.
- Texto `vaccine-create-note-text`: `flex-1 text-13 font-semibold text-muted`.
- Con catálogo (`vaccineCreate.noteCatalog`):
  - es: «Propuse la próxima dosis con un esquema orientativo. Confírmala con el veterinario de {{name}}.»
  - en: «I suggested the next dose from a general schedule. Confirm it with {{name}}'s vet.»
- Con «Otra vacuna» (`vaccineCreate.noteOther`):
  - es: «Esta vacuna no está en mi esquema, así que no propongo fecha. Pregúntale al veterinario de {{name}} cuándo toca la siguiente.»
  - en: «This vaccine isn't in my schedule, so I don't suggest a date. Ask {{name}}'s vet when the next one is due.»

- Test: `screens/vaccine-create/index.test.tsx`. Hay un `it` por rama, con `{ exact: true }`
  y Rocky:
  - `#208 R11: con catálogo la nota habla del esquema orientativo`
  - `#208 R11: con «Otra vacuna» la nota dice que no propone fecha`

### R12 — Tarjeta «Recordarme la próxima dosis»

**Tarjeta.** THE SYSTEM SHALL pintar `vaccine-create-reminder`, un `Pressable` con
`accessibilityRole="checkbox"` y `accessibilityState={{ checked }}`.

- Clase: `flex-row items-center gap-3 rounded-tile bg-surface-secondary px-3.5 py-3`,
  con `style={CONTINUOUS_CORNER}`.
- Lleva `<Bell size={20} color={accentStrong} />`.
- Columna `flex-1`:
  - título `text-sm font-extrabold text-foreground`: «Recordarme la próxima dosis» /
    «Remind me of the next dose» (`vaccineCreate.remindMe`)
  - subtexto `vaccine-create-reminder-hint`, `text-xs font-semibold text-muted`
- Al final, `<Checkbox testID="vaccine-create-reminder-checkbox" isSelected={remind} onSelectedChange={setRemind} />`,
  de heroui-native, como en `register`.
- `remind` empieza en `true`. Pulsar la tarjeta o el checkbox lo alterna.

**Subtexto con fecha.** WHEN «Próxima dosis» tiene fecha, el subtexto es
`vaccineCreate.remindOn`:

- es: «Te aviso el {{date}} a las 09:00.»
- en: «I'll remind you on {{date}} at 09:00.»
- `{{date}}` es la misma cadena que pinta `vaccine-create-next-value`, p. ej. «6 oct 2027».
  Se calcula con la misma llamada que DateField:
  `isoToLocalDate(nextDoseAt)!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`,
  con `locale` de `useLocale()`.
  - Ancla [#220]: `grep -cF "toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })" components/date-field.tsx` → 1.

**Subtexto sin fecha.** WHEN «Próxima dosis» es `null`, el subtexto es
`vaccineCreate.remindWhenPicked`:

- es: «Cuando elijas la fecha, te aviso ese día a las 09:00.»
- en: «Once you pick the date, I'll remind you that day at 09:00.»

- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R12: el recordatorio empieza marcado y avisa del 6 oct 2027 a las 09:00`
  - `#208 R12: sin próxima dosis el subtexto espera a la fecha`
  - `#208 R12: pulsar la tarjeta desmarca y vuelve a marcar`

### R13 — Veterinario, clínica y notas

THE SYSTEM SHALL pintar:

- **Rejilla de dos columnas** (`flex-row gap-2.5`):
  - «Veterinario» / «Vet» (`vaccineCreate.vet`), `TextInput vaccine-create-vet`
  - «Clínica» / «Clinic» (`vaccineCreate.clinic`), `TextInput vaccine-create-clinic`
  - Los dos tienen placeholder «Opcional» / «Optional» (`vaccineCreate.optional`)
    y `maxLength={120}`.
- **Debajo**: «Notas» / «Notes» (`vaccineCreate.notes`) con
  `TextInput vaccine-create-notes multiline` y `maxLength={2000}`.
  - Placeholder «Lote, reacciones o lo que quieras recordar» / «Batch, reactions
    or anything you want to remember» (`vaccineCreate.notesPlaceholder`).
- **Etiquetas**: `text-sm font-extrabold text-foreground`.
- **Inputs**:
  - `h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent`
  - notas: `h-16` en lugar de `h-13`, más `py-3` y `textAlignVertical="top"`
  - todos con `style={CONTINUOUS_CORNER}` y `placeholderTextColor={muted}`

- Test: `screens/vaccine-create/index.test.tsx`:
  `#208 R13: veterinario, clínica y notas pintan etiquetas, placeholders y límites literales`.

### R14 — Envío: validación y cuerpo

**CTA.** THE SYSTEM SHALL pintar en la barra
`<Button testID="vaccine-create-submit" className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={submitting} onPress={() => void handleSubmit()}>`.

- Etiqueta `<Text className="text-17 font-extrabold text-accent-foreground">`:
  «Guardar vacuna» / «Save vaccine» (`vaccineCreate.save`).

**Validación.** WHEN se pulsa con «Otra vacuna» y el nombre en blanco, THE SYSTEM
SHALL pintar `vaccine-create-name-message` con «Escribe el nombre de la vacuna.»
/ «Enter the vaccine name.» (`vaccineCreate.nameRequired`, vía R3) y no llamar
a `createVaccine`.

**Cuerpo con catálogo.** WHEN se envía con catálogo, THE SYSTEM SHALL llamar a
`createVaccine(baseUrl, token, petId, body)` con
`{ catalogId: entry.id, appliedAt, nextDoseAt, …optionals }`.

- `nextDoseAt` va siempre: la propuesta o la elegida.

**Cuerpo con «Otra vacuna».** WHEN se envía con «Otra vacuna», el cuerpo es
`{ name: name.trim(), appliedAt, …optionals }`.

- Añade `nextDoseAt` solo si no es `null`.

**Opcionales.** `vetName`, `clinic` y `notes` van recortados con `trim()` y se
omiten si quedan vacíos.

- Nunca se envía `null` ni `''`.

- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R14: guardar con Leptospirosis envía catalogId, fechas y opcionales recortados`.
    Asserta el objeto exacto con `toEqual`.
  - `#208 R14: guardar «Otra vacuna» sin próxima dosis envía name recortado y omite nextDoseAt y opcionales vacíos`
  - `#208 R14: «Otra vacuna» en blanco pinta el error del nombre y no envía`
  - `#208 R14: el CTA se bloquea mientras envía`

### R15 — Recordatorio tras el 201

**Cuándo.** WHEN `createVaccine` devuelve `ok`, el recordatorio está marcado y
`vaccine.nextDoseAt` (de la **respuesta**) es posterior a
`civilTodayIso(profileTimeZone)`, THE SYSTEM SHALL llamar a
`createReminder(baseUrl, token, petId, input)` con:

```
{ type: 'vaccine',
  title: vaccine.name,
  dueAt: combineDateAndTime(isoToLocalDate(vaccine.nextDoseAt)!, hhmmToLocalDate('09:00')!).toISOString(),
  advanceMinutes: 0 }
```

- Es hora local del dispositivo, como `add-reminder`.

**Cuándo no.** THE SYSTEM SHALL NOT llamar a `createReminder` en estos casos,
cada uno un `it`:

- (a) recordatorio desmarcado
- (b) `vaccine.nextDoseAt === null`
- (c) `vaccine.nextDoseAt` igual o anterior a hoy

**Después.** WHEN `createVaccine` devuelve `ok`, con cualquier desenlace del
recordatorio, THE SYSTEM SHALL invalidar `healthKeys.vaccines(petId)`,
`reminderKeys.list(petId)` y `petKeys.list()`, y llamar a `router.back()`.

- Anclas:
  - `grep -cF 'export function combineDateAndTime' utils/reminder-dates.ts` → 1
  - `grep -cF 'export async function createReminder' api/reminders.ts` → 1
  - [#220] `grep -cF 'export function hhmmToLocalDate' utils/civil-date.ts` → 1
- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R15: con próxima dosis futura crea el recordatorio vaccine a las 09:00 locales sin antelación`.
    El `dueAt` esperado se calcula en el test como
    `new Date(2027, 9, 6, 9, 0, 0, 0).toISOString()`, un literal y no el helper.
  - `#208 R15: el dueAt sigue la hora local del dispositivo`: con la zona fijada como en R2
    antes de montar la pantalla, espera el literal `'2027-10-06T15:00:00.000Z'`.
  - `it.each` de tres filas `#208 R15: no crea recordatorio cuando %s`:
    «está desmarcado», «la respuesta no trae próxima dosis» y «la próxima dosis es hoy».
  - `#208 R15: tras el 201 invalida vacunas, recordatorios y mascotas y vuelve`

### R16 — Aviso ámbar cuando el recordatorio falla

**Almacén.** THE SYSTEM SHALL exportar desde el fichero nuevo
`hooks/vaccine-reminder-notice.ts`:

- `showVaccineReminderNotice(petId: string)`
- `clearVaccineReminderNotice()`
- `useVaccineReminderNotice(): string | null`, que devuelve el `petId` avisado.
  Usa `useSyncExternalStore`, con el patrón de `hooks/use-push-registration.ts`.

**Disparo.** IF `createReminder` devuelve cualquier `kind` distinto de `ok`, THEN
la pantalla de alta SHALL llamar a `showVaccineReminderNotice(petId)` antes de
`router.back()`.

- Si devuelve `ok`, o no se llama, se llama a `clearVaccineReminderNotice()`.
- La vacuna no se borra: no hay rollback.

**Aviso en Salud.** WHILE `useVaccineReminderNotice() === selectedPetId`, Salud
SHALL pintar `vaccine-reminder-notice`.

- Es una superposición `absolute` hermana del `ScrollView`, que pasa a
  envolverse en `<View testID="health-root" className="flex-1">`.
- `accessibilityRole="alert"` y `accessibilityLiveRegion="polite"`.
- Clase: `absolute left-4 right-4 flex-row items-center gap-2.5 rounded-tile border border-border px-3.5 py-3 bg-category-amber`.
- Estilo: `[{ bottom: 104 }, shadows.toast, CONTINUOUS_CORNER]`, con
  `const shadows = useShadows();` de `theme/shadows`, como en `weight-log`.
  - Ancla: `grep -cF 'shadows.toast' screens/weight-log/index.tsx` → 1.
- Hijos:
  - `<BellOff size={20} color={amber} />`
  - texto `vaccine-reminder-notice-text`, `flex-1 text-13 font-semibold text-foreground`:
    - es: «Guardé la vacuna de {{name}}, pero no pude crear su recordatorio.»
    - en: «I saved {{name}}'s vaccine, but I couldn't create its reminder.»
    - clave `health.vaccineReminderFailed`
  - `Pressable vaccine-reminder-notice-action`, `min-h-11 justify-center`, con
    `Text text-13 font-extrabold text-category-amber-strong`:
    «Crear ahora» / «Create now» (`health.createReminderNow`)
- Pulsar la acción llama a `clearVaccineReminderNotice()` y
  `router.push('/add-reminder')`.

- Anclas:
  - `grep -cF 'useSyncExternalStore(' hooks/use-push-registration.ts` → 1
  - `grep -cF "amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' }," utils/category-palette.ts` → 1
  - `grep -cF 'text-warning-strong' screens/health/index.tsx` → 0, y sigue en 0
    (`__tests__/legibility-classnames.test.ts`, `// #199 R14`)
  - `grep -cF 'text-accent-strong' screens/health/index.tsx` → 0, y sigue en 0
    (inventario `inkSites` del mismo fichero): `accentStrong` llega como color,
    no como clase.
- Tests:
  - `screens/vaccine-create/index.test.tsx`:
    - `#208 R16: si el recordatorio falla deja el aviso de la mascota y vuelve sin borrar la vacuna`.
      Asserta que no hay `DELETE` y que `useVaccineReminderNotice` vale `'pet-1'`.
    - `#208 R16: si el recordatorio se crea limpia un aviso anterior`
  - `screens/health/index.test.tsx`:
    - `#208 R16: con aviso pendiente de la mascota seleccionada pinta el aviso ámbar literal`.
      Asserta clases, `bottom: 104` y textos `{ exact: true }` con Luna, el nombre
      del arnés.
    - `#208 R16: «Crear ahora» limpia el aviso y abre Agregar recordatorio`
    - `#208 R16: un aviso de otra mascota no se pinta`
  - Los dos ficheros llaman a `clearVaccineReminderNotice()` en `beforeEach`.

### R17 — Error al guardar la vacuna

**Alerta.** IF `createVaccine` devuelve `error`, `unreachable`, `forbidden`,
`unauthorized` o `missing-config`, THEN THE SYSTEM SHALL pintar en la barra,
encima del CTA, `vaccine-create-error`.

- `accessibilityRole="alert"`.
- Clase: `flex-row items-center gap-2.5 rounded-tile px-3.5 py-3 bg-category-rose`,
  con `style={CONTINUOUS_CORNER}`.
- Lleva `<AlertTriangle size={20} color={danger} />` y el texto
  `vaccine-create-error-text`, `flex-1 text-13 font-bold text-danger`:
  - es: «No pude guardar la vacuna. Tus datos siguen aquí; revisa tu conexión y vuelve a intentarlo.»
  - en: «I couldn't save the vaccine. Your details are still here; check your connection and try again.»
  - clave `vaccineCreate.saveError`

**Qué no pasa.** No navega, no crea recordatorio, y conserva chip, nombre,
fechas y textos.

**Al reenviar.** Un nuevo envío oculta la alerta mientras dura.

- Ancla: `grep -cF "rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' }," utils/category-palette.ts` → 1
- Test: `screens/vaccine-create/index.test.tsx`:
  - `it.each(['error', 'unreachable', 'forbidden', 'unauthorized', 'missing-config'])('#208 R17: %s pinta la alerta literal y conserva el formulario', …)`.
    Una fila por rama.
  - `#208 R17: reintentar con éxito vuelve a Salud`

### R18 — 400 del servidor

**Fecha futura.** WHEN `createVaccine` devuelve `validation` con un error de
`path: 'appliedAt'`, THE SYSTEM SHALL pintar `vaccine-create-applied-message`:

- es: «La fecha de aplicación no puede ser futura.»
- en: «The date given can't be in the future.»
- `issue` es `{ labelKey: 'vaccineCreate.appliedAtFuture' }`.
- `vaccine-create-applied-value` lleva `android:border-danger` entre las clases de
  su `props.className`: es el observable de `isInvalid` en DateField (#220 R5). El
  disparador `vaccine-create-applied` no recibe esa prop (M1).

**Otros paths.** WHEN la validación trae solo otros `path`, THE SYSTEM SHALL
pintar `vaccine-create-error` con el texto de la clave existente
`validation.checkDetails` («Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.»).

- El texto crudo del servidor no se muestra nunca (#186).

- Ancla: `grep -cF "'validation.checkDetails':" i18n/catalog.ts` → 2
- Test: `screens/vaccine-create/index.test.tsx`:
  - `#208 R18: un 400 de appliedAt pinta el error de campo traducido`
  - `#208 R18: un 400 de otro campo pinta checkDetails y nunca el mensaje del servidor`

### R19 — Catálogo i18n

THE SYSTEM SHALL añadir a `i18n/catalog.ts`, en `en` y en `es`, exactamente
estas **26** claves nuevas, con los literales de R5 a R18:

- **`health.*` (4)**: `addVaccine`, `vaccinesEmptyBody`, `vaccineReminderFailed`, `createReminderNow`
- **`vaccineCreate.*` (22)**:
  - `title`, `vaccine`, `schemeForDog`, `schemeForCat`, `otherVaccine`, `vaccineName`
  - `appliedAt`, `nextDose`, `noteCatalog`, `noteOther`
  - `remindMe`, `remindOn`, `remindWhenPicked`
  - `vet`, `clinic`, `optional`, `notes`, `notesPlaceholder`
  - `save`, `saveError`, `nameRequired`, `appliedAtFuture`

Literales de las claves sin otro R-id que los fije:

- `health.addVaccine`: «Agregar vacuna» / «Add vaccine»
- `vaccineCreate.title`: «Agregar vacuna» / «Add vaccine»
- `vaccineCreate.vaccine`: «Vacuna» / «Vaccine»

Marcadores:

- `{{name}}` aparece en `vaccinesEmptyBody`, `vaccineReminderFailed`,
  `noteCatalog` y `noteOther`.
- `{{date}}` aparece en `remindOn`.

- Test: `providers/__tests__/language-provider.test.tsx`. La suma del `it` `#194 R1`
  gana `+ 26, // #208 R19`, y su título suma `(enmendado por #208 R19)`. Sus
  comprobaciones de marcadores en ambos idiomas cubren las claves nuevas sin
  aserción adicional.

### R20 — Tabla de copy (R19_VACCINE_CREATE)

**Bloque nuevo.** THE SYSTEM SHALL añadir en `__tests__/ui-copy-table.ts` el
bloque exportado `R19_VACCINE_CREATE`, con una fila por cada `t('…')` o
`labelKey: '…'` nuevo. Son **29** filas:

- **5** de `src/screens/health/index.tsx`:
  - `health.addVaccine` dos veces
  - `health.vaccinesEmptyBody`
  - `health.vaccineReminderFailed`
  - `health.createReminderNow`
- **23** de `src/screens/vaccine-create/index.tsx`: las 21 claves
  `vaccineCreate.*` restantes, salvo `nameRequired`; `vaccineCreate.optional`
  dos veces; y `validation.checkDetails`.
- **1** de `src/utils/form-rules.ts`: `vaccineCreate.nameRequired`.

**Segundo uso de `health.noVaccinesYet`.** El título de la tarjeta vacía es un
segundo `t('health.noVaccinesYet')` en `src/screens/health/index.tsx`. Su fila va
en `R5_HEALTH` y no en este bloque, porque `checkUses` cuadra cada bloque por
separado:

- `R5_HEALTH` gana una segunda fila
  `{ file: 'src/screens/health/index.tsx', key: 'health.noVaccinesYet' }, // #208 R20`.
- Su `it` `#186 R7: resuelve las 43 ocurrencias normativas …` suma
  `(enmendado por #208 R20)`.
- Su candado de longitud gana `+ 1 // #208 R20`. Ancla:
  `grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1); // #220 R16' __tests__/ui-language.test.ts` → 1 (antes) y 0 (después).

**Integración.** `ALL_USES` esparce el bloque. El array `blocks` del test
`#194 R5: cuadra ALL_USES con la suma de sus bloques` lo incluye. Entre las 29
filas del bloque y la fila de `R5_HEALTH`, `ALL_USES` y la suma de `#194 R5`
crecen **+30**.

**Tests en `__tests__/ui-language.test.ts`:**

- Se añade
  `describe('#208 R20: alta de vacuna', () => { it('#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código', …) })`,
  con `expect(R19_VACCINE_CREATE).toHaveLength(29)` y `checkUses(R19_VACCINE_CREATE)`.
- `#186 R7` sigue verde con `checkUses(R5_HEALTH)`, que ahora espera dos usos de
  `health.noVaccinesYet`.
- La longitud de `SCREEN_FILES` suma `+ 1 // #208 R20: screens/vaccine-create/index.tsx`.
- El escáner de copy suelta sigue verde: ninguna cadena del catálogo aparece
  literal en los ficheros nuevos.
- Si #220 ya ocupó `R18_DATE_FIELD`, este bloque sigue siendo el R19. Ver [[design]].

### R21 — Guardas de la carta: grep-clean e inventarios

**Grep-clean.** THE SYSTEM SHALL mantener `screens/vaccine-create/index.tsx`,
`app/pets/[petId]/vaccines/new.tsx`, `utils/vaccine-dates.ts` y
`hooks/vaccine-reminder-notice.ts` sin estas cosas:

- hex
- clases arbitrarias `-[…]`
- `StyleSheet.create`
- sombras legacy
- `text-accent` desnudo
- `text-warning`
- `useThemeColors` con el token `'accent'`
- comentarios `#208` que no sean `#208 R<n>`

Los colores de icono salen de `useThemeColors`. La pantalla de alta pide
`['accent-strong', 'accent-foreground', 'muted', 'danger', 'foreground']`, y
Salud amplía su llamada con `'accent-strong', 'accent-foreground'`.

**Test nuevo.** `__tests__/design-drift.test.ts` añade
`describe('#208 R21: alta de vacuna sin deriva', …)`.

- Para los cuatro ficheros, aplica `PAIRING_STYLE_ESCAPES` y la regla de clases
  arbitrarias.
- Asserta `grep` de los literales prohibidos con cuenta 0.

**Inventarios.** THE SYSTEM SHALL enmendar los inventarios cerrados que mueven
los nodos nuevos con estos deltas exactos. Cada `it` tocado suma
`(enmendado por #208 R21)`.

`__tests__/chunky-cta-canvas-fidelity.test.ts`:

- **`CTA_ROWS` + 2 filas**. Así entran en `ctaFiles` y `consumers`, y en R3.1,
  R3.2, R7.2, R7.4 y R7.5 sin más cambios:
  - `['screens/health/index.tsx', literalId('vaccines-empty-action'), 'w-full h-14 rounded-16 bg-accent', ['onPress={openVaccineCreate}']]`
  - `['screens/vaccine-create/index.tsx', literalId('vaccine-create-submit'), 'h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']]`
- **R3.3**: `[...primaryIds, 'reminders-add-link', 'vaccines-add'].sort()`.
- **R6.2**:
  - `<Button\.Label` + 1
  - `Button\.Label` + 2
  - `text-17` + 3 (dos etiquetas y la clase del título de la tarjeta)
  - `<Text className="text-17 font-extrabold text-accent-foreground">` + 2
- **R7.2**: `rounded-xl bg-accent` pasa a
  `{ 'screens/reminders/index.tsx': 1, 'screens/health/index.tsx': 1 }`.
- **R7.3** (`radii`):
  - `'screens/health/index.tsx': 1 + 1`
  - nueva entrada `'screens/vaccine-create/index.tsx': 1`
- **R7.5**: `style={chunkyLip.primaryCompact}` gana `'screens/health/index.tsx': 1`.
  Los chips usan `style={selected ? chunkyLip.primaryCompact : undefined}` y no
  cuentan.
- **R8.1**: la fila `primaryCompact` pasa a `['reminders-add-link', 'vaccines-add']`.

`__tests__/consistency-classnames.test.ts`:

- `rounded-16 bg-accent` total: `+ 1 + 1 // #208 R21`.
- `primaryRadius` (`rounded-xl bg-accent`): `toHaveLength(1 + 1)`.
- `#62 R14` `directUses`:
  - Salud `+ 2`: tarjeta vacía y tile. El aviso de R16 lleva la esquina
    dentro de un array de estilos, no como `style={CONTINUOUS_CORNER}`
    literal, y no cuenta.
  - Nueva entrada `[join('screens', 'vaccine-create', 'index.tsx'), 7]`: los
    siete `style={CONTINUOUS_CORNER}` literales que exigen R9–R17 (nombre,
    nota, tarjeta de recordatorio, veterinario, clínica, notas y alerta de
    error). Ningún otro nodo de la pantalla lleva esa prop literal.
- `#62 R15` `counters`:
  - nueva entrada `[join('screens', 'vaccine-create', 'index.tsx'), 1]`
  - la suma de `#69 R10` gana `+ 1`

**Regla mecánica para lo no listado.** IF otro inventario cerrado falla **solo**
por nodos que esta spec exige, THEN la enmienda:

- añade la entrada o `+ N // #208 R21` y el sufijo de título
- no borra ni afloja ninguna aserción
- se lista en `progress/impl_mobile-vaccine-create.md` con el antes y el después

Cualquier otro rojo es un defecto de la implementación.

- Test: los `it` citados, más
  `#208 R21: los cuatro ficheros nuevos no tienen deriva de estilo` en `design-drift.test.ts`.

### R22 — Semilla del catálogo en el arranque

THE SYSTEM SHALL cambiar en `init.config.sh` la línea de `E2E_SETUP_CMD` a:

```
E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run seed:vaccines && pnpm -C backend-pet-tracker run provision:local"
```

- La semilla corre después de migrar y antes de aprovisionar.
- `init.sh` no cambia: ya ejecuta `E2E_SETUP_CMD`.

- Anclas:
  - `grep -cF 'E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"' init.config.sh` → 1 (antes) y 0 (después)
  - `grep -cF '"seed:vaccines":' backend-pet-tracker/package.json` → 1
- Test: `init-e2e-gate.test.mjs`, en la raíz:
  `it('#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar', …)`.
  Asserta que los índices cumplen
  `setupLine.indexOf('db:migrate') < setupLine.indexOf('seed:vaccines') < setupLine.indexOf('provision:local')`
  y que `seed:vaccines` aparece una vez.
  - Corre con `node --test init-e2e-gate.test.mjs`. Codex **no** corre `./init.sh`.

## Requisitos no funcionales

- **Ficheros.** Ningún fichero nuevo fuera de los que lista [[design]] §Archivos afectados.
- **Dependencias.** Ninguna dependencia nueva: `@expo/ui`, `heroui-native` y
  `reicon-react-native` ya están, y los iconos `Plus`, `InfoCircle`, `Bell`,
  `BellOff`, `AlertTriangle` y `Syringe` existen en su `index.d.ts`.
- **Coste.** Sin recursos AWS ni coste nuevo.
- **Suites móviles.**
  - `bun run --cwd mobile-pet-tracker test`, `lint` y `typecheck` verdes.
  - `lint` se mide con log y `test ! -s`: SIGKILL sale 0.

## Fuera de alcance

- **Editar o borrar vacunas** desde la app. Si se pide, será una feature nueva
  (plan §1).
- **`firstDoseMonths` y `series` del esquema.** Solo se usa `boosterMonths`.
- **Adjuntar el certificado** (`documentKey`) al alta.
- **Cambios de backend o de semilla.** El catálogo sigue con sus 7 entradas.
- **Recordatorio en la zona del perfil.** El aviso usa la hora local del
  dispositivo, como `add-reminder`. Alinearlo con `me.timezone` sería una
  feature aparte.
- **Reintentar el recordatorio dentro de la pantalla de alta.** «Crear ahora»
  lleva a Agregar recordatorio, sin prellenar.
- **Smoke en dispositivo y `dev` → `main`.** Son gates humanos del plan.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-26) ← gate obligatorio antes de implementar
- [ ] Smoke de #208 en dev build por el humano (fecha: ____): picker nativo de las dos fechas, teclado con
      KAV en notas, recordatorio a las 09:00 locales. No bloquea tareas; bloquea `done`.

## Enmiendas tras el merge de #220 (2026-10-26)

Re-medición contra `a315a6af` (merge de `origin/dev` con #220, `81ca7529`).
Detalle y comandos en `progress/enmiendas_mobile-vaccine-create.md`.

- **M1 — Observable de `isInvalid` en la fecha de aplicación (R18).**
  - Qué cambia: el último punto de «Fecha futura» en R18 decía «`vaccine-create-applied`
    lleva `isInvalid`». Ahora dice que `vaccine-create-applied-value` lleva
    `android:border-danger` entre las clases de su `props.className`.
  - Por qué: en `components/date-field.tsx` de `a315a6af`, el `testID` va al
    `Pressable` disparador, que no recibe `isInvalid`. La prop llega a
    `InputGroup.Input` (`${testID}-value`), y el test de #220 la observa así:
    `#220 R5: borde de error para isInvalid=%s` mira `android:border-danger` en
    `field-value`. Una aserción sobre `vaccine-create-applied` no podría pasar en
    verde. R10 no cambia: sigue pasando `isInvalid={Boolean(fieldErrors.appliedAt)}`
    a DateField.
  - Afecta a: R18, en `#208 R18: un 400 de appliedAt pinta el error de campo traducido`.
    La intención no cambia: la fecha de aplicación se marca inválida.

- **M2 — Fila del segundo `health.noVaccinesYet` (R20).**
  - Qué cambia:
    - `R19_VACCINE_CREATE` pasaba de 30 a **29** filas (5 de Salud), en el texto,
      en el título del `it` y en `toHaveLength(29)`. La viñeta de Salud pierde
      `health.noVaccinesYet`.
    - La fila de `health.noVaccinesYet` pasa a `R5_HEALTH`, como segunda fila
      `// #208 R20`.
    - El `it` `#186 R7` suma `(enmendado por #208 R20)`, y el candado de longitud
      de `R5_HEALTH` gana `+ 1 // #208 R20`.
    - `ALL_USES` y la suma de `#194 R5` siguen creciendo **+30**.
  - Por qué: `checkUses` (`__tests__/ui-language.test.ts`) cuadra cada bloque por
    separado. Por cada `file+key` exige tantos usos en el fichero como filas haya
    en el bloque. `R5_HEALTH` ya tiene una fila `health.noVaccinesYet` por
    `vaccines-empty`, que R6 conserva. Con la tarjeta, el fichero tiene dos usos.
    Con la redacción anterior, `checkUses(R5_HEALTH)` y `checkUses(R19_VACCINE_CREATE)`
    habrían esperado 1 y encontrado 2: ninguno de los dos podía pasar en verde. El
    leader eligió esta opción, la (a) de D1 en
    `progress/enmiendas_mobile-vaccine-create.md`.
  - El defecto es anterior al merge de #220.
  - Afecta a:
    - R20: `#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código`.
    - `#186 R7` en `__tests__/ui-language.test.ts`.
    - `tasks.md` §R20 y `traceability.md` fila R20.
  - La intención no cambia: cada `t()` nuevo tiene exactamente una fila.

- [x] Enmiendas M1–M2 aprobadas (fecha: 2026-10-26) — firma delegada del leader (mandato 2026-10-23, ampliado 2026-10-26)

## Errata del leader antes del handoff (2026-10-26)

- **E1 — Ruta del test de R3.** El test de `validateVaccine` va en el fichero que ya
  existe, `utils/form-rules.test.ts`, junto a `utils/form-rules.ts`. No va en
  `utils/__tests__/form-rules.test.ts`, que no existe. Ancla:
  `ls utils/form-rules.test.ts` existe y `ls utils/__tests__/form-rules.test.ts` no.
  Se corrige en R3, design.md, tasks.md y traceability.md. La intención no cambia.
