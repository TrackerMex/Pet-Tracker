# Re-medición de la spec mobile-vaccine-create (#208) tras el merge de #220

- Worktree: `/home/claude/sites/Pet-Tracker-wt-208`, branch `feature/208-mobile-vaccine-create`
- HEAD medido: `a315a6af` (merge de origin/dev con #220, merge commit `81ca7529`)
- Spec firmada en `f10944d9`, errata `91e45ccf`, auditoría `progress/firma_mobile-vaccine-create.md`
- Fecha: 2026-10-26
- Todas las rutas sin prefijo son relativas a `mobile-pet-tracker/src/`; los
  comandos se lanzan desde ahí salvo que se diga otra cosa.
- `graphify query` no sirve en este worktree: `graphify-out/graph.json` no existe
  (`error: graph file not found`). Todo se midió con grep, node y lectura directa.

**Resultado: 2 cambios (M1, R18; M2, R20), 0 decisiones abiertas.**

- **M1** ya está aplicada en `requirements.md`.
- **D1** era anterior al merge de #220. El leader la decidió por la opción (a),
  y quedó aplicada como **M2**.
- El resto de anclas, contrato DateField y candados no cambia.
- La base de jest es verde salvo carga: ver «Base de tests».

## 1. Contrato DateField / civil-date

Fuente: `components/date-field.tsx`, `utils/civil-date.ts`,
`utils/date-picker-value.ts`, `components/__tests__/date-field.test.tsx`,
`utils/civil-date.test.ts` en a315a6af.

| ancla | valor en la spec (fichero:sección) | valor medido en a315a6af | comando | veredicto |
|---|---|---|---|---|
| export `DateField` | `components/date-field.tsx`, `export function DateField` → 1 (req:R10 anclas) | 1 | `grep -cF 'export function DateField' components/date-field.tsx` | igual |
| export `isoToLocalDate` | `utils/civil-date.ts` → 1 (req:R10) | 1; firma `isoToLocalDate(iso: string): Date \| null` | `grep -cF 'export function isoToLocalDate' utils/civil-date.ts` | igual |
| export `localDateToIso` | `utils/civil-date.ts` → 1 (req:R10) | 1; `localDateToIso(date: Date): string` | `grep -cF 'export function localDateToIso' utils/civil-date.ts` | igual |
| export `hhmmToLocalDate` | `utils/civil-date.ts` → 1 (req:R15) | 1; `hhmmToLocalDate(hhmm: string): Date \| null` (hoy con esa hora) | `grep -cF 'export function hhmmToLocalDate' utils/civil-date.ts` | igual |
| `civilTodayIso` | req:R10, R15 «patrón getMe / userKeys.me() de weight-log», sin ruta | vive en `utils/civil-today-iso.ts` (no en civil-date; existe desde 7964d04c, 2026-09-17); weight-log lo importa de `'../../utils/civil-today-iso'` | `grep -rn civilTodayIso --include=*.ts* . \| grep -v test` | igual (la spec no afirma ruta) |
| ruta de import de DateField | req:R10 «DateField (#220)» | `../../components/date-field` desde `screens/<x>/index.tsx` (como weight-log) | lectura de `screens/weight-log/index.tsx` | igual |
| props | req:R10: `testID`, `label`, `maxDate`, `minDate`, `isInvalid`, `allowClear`, valor `string \| null` | `testID: string; pickerTestID?: string; mode?: 'date'\|'time'; value: string \| null; onChange: (next: string \| null) => void; label?: string; placeholder?: string; minDate?: string; maxDate?: string; isInvalid?: boolean; allowClear?: boolean` (`allowClear` por defecto `false`) | lectura de `components/date-field.tsx` l.15-27, 36-39 | igual |
| testID del disparador | `vaccine-create-applied`, `vaccine-create-next` (req:R10) | `testID` va al `Pressable` raíz (`accessibilityRole="button"`, `h-12 rounded-xl bg-default`) | lectura l.71-78 | igual |
| sufijo valor | `${testID}-value` con `props.value` (req:R10) | `InputGroup.Input testID={`${testID}-value`} value={display}` | lectura l.81-83 | igual |
| sufijo picker | `${testID}-picker`, solo tras pulsar (req:R10) | `pickerTestID = `${testID}-picker``; se monta solo con `pickerSeed !== null`, que pone `openPicker` (onPress) | lectura l.37, 101-103 | igual |
| sufijo borrar | `${testID}-clear` (req:R10, «#220 R11») | `${testID}-clear` existe solo con `allowClear && valid`; su `onPress` hace `event.stopPropagation(); onChange(null)` | lectura l.90-97; test `#220 R11` l.271-287 | igual |
| semántica «#220 R11» | sin valor no hay clear; con fecha sí; pulsarlo vacía (req:R10) | `#220 R11: borrar en %s…` asserta `onChange(null)`; `#220 R11: no muestra borrar sin permiso y valor válido` cubre `allowClear:false`, `{}`, `value:null` | lectura del test | igual |
| `fireEvent.press` sobre clear sin evento | req:R10 no prescribe argumentos | el test de #220 pasa `{ stopPropagation: jest.fn() }`, pero RNTL 14.0.1 `fireEvent.press` construye `buildTouchEvent()` con `stopPropagation: () => {}`; el press desnudo no lanza | `node_modules/@testing-library/react-native/dist/fire-event.js` l.98-104 y `dist/event-builder/base.js` l.15 | igual |
| sufijo etiqueta | no citado | `${testID}-label` (`Label` + `Label.Text className="text-sm font-extrabold text-foreground"`) solo con `label` | lectura l.68-70 | igual (informativo) |
| receta del picker | pulsar disparador, luego `fireEvent(<testID>-picker,'onValueChange',{},new Date(2026,8,1,12))`; cambia y desmonta (req:R10) | `onValueChange={(_e, picked) => { onChange(localDateToIso(fromPickerValue(picked))); setPickerSeed(null); }}`; `fromPickerValue` en Android usa el día UTC del valor; mediodía local da el mismo día para \|offset\| < 12 h | lectura l.114-117, `utils/date-picker-value.ts`; test `#220 R7: al elegir se cierra el selector` | igual |
| `onDismiss` | solo para cerrar sin elegir (req:R10) | `onDismiss={() => setPickerSeed(null)}`, no llama `onChange` (`#220 R10`) | lectura l.118 | igual |
| `maximumDate` | `new Date(2026, 9, 6, 12)` con `maxDate='2026-10-06'` (req:R10) | `maximumDate={localNoon(maxDate)}`, mediodía local (`#220 R8: mínimo y máximo van crudos a mediodía local`) | lectura l.29-34, 113 | igual |
| formato de la etiqueta | «6 oct 2026», «6 oct 2027», «1 oct 2027» (req:R10, R12) | `date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`; el test `#220 R2` fija `es 2026-10-01 → '1 oct 2026'` | `grep -cF "toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })" components/date-field.tsx` → 1 | igual |
| valor vacío | `vaccine-create-next-value` con `value` `''` y placeholder «Elige una fecha» (req:R10) | `display = ''`; `placeholder = t('dateField.placeholderDate')` = «Elige una fecha» / «Select a date» (`#220 R3`) | lectura l.47-48; `grep -n "dateField.placeholderDate" i18n/catalog.ts` | igual |
| `isInvalid` observable | req:R18 «`vaccine-create-applied` lleva `isInvalid`» | `isInvalid` no llega al `Pressable` `vaccine-create-applied`: va a `InputGroup.Input` (`vaccine-create-applied-value`), cuyo `className` gana `android:border-danger` (`#220 R5: borde de error para isInvalid=%s`) | lectura l.81-89; test l.128-131 | **cambia** → M1 |
| FieldErrorMessage junto a DateField | `vaccine-create-applied-message`, `vaccine-create-name-message` (req:R14, R18) | `FieldErrorMessage` pinta `${testID}-error` y `${testID}-message`; no choca con `-label`/`-value`/`-clear`/`-picker` | `grep -n testID components/field-error-message.tsx` | igual |

## 2. Candados agregados

| ancla | valor en la spec (fichero:sección) | valor medido en a315a6af | comando | veredicto |
|---|---|---|---|---|
| nombre del bloque de copy | req:R20, design §Bloque de copy: #220 ocupa `R18_DATE_FIELD`, #208 usa `R19_VACCINE_CREATE` | `export const R18_DATE_FIELD` l.661, esparcido en `ALL_USES` l.687 y en `blocks` de `#194 R5` l.702; ningún `R19_` | `grep -n "R18_DATE_FIELD\|R19_" __tests__/ui-copy-table.ts` | igual |
| `SCREEN_FILES` | req:R20 `+ 1 // #208 R20` (solo `screens/vaccine-create/index.tsx` es nuevo) | `SCREEN_FILES` = ficheros únicos de `ALL_USES` (l.413); termina en `+ 1 // #220 R16`; `utils/form-rules.ts` (11 filas en `ALL_USES`) y `screens/health/index.tsx` ya están dentro | `grep -n "SCREEN_FILES" __tests__/ui-language.test.ts`; `grep -c "src/utils/form-rules.ts" __tests__/ui-copy-table.ts` | igual |
| `checkUses` por bloque | req:R20: 30 filas, con `health.noVaccinesYet` **una vez** en R19 (título de la tarjeta) | `checkUses` compara, por bloque, el número de filas `file+key` con el número de `t('key')` + `labelKey: 'key'` en el fichero (l.44-70, `toEqual`). `R5_HEALTH` ya tiene una fila `health.noVaccinesYet` (l.170) por el `t('health.noVaccinesYet')` de `vaccines-empty` (l.160), que R6 conserva para quien no es owner. Con la tarjeta, el fichero tiene **2** usos: `R5_HEALTH` (espera 1) y `R19_VACCINE_CREATE` (espera 1) fallan los dos | `grep -n "health.noVaccinesYet" __tests__/ui-copy-table.ts screens/health/index.tsx`; lectura de `checkUses` | **cambia** (anterior al merge) → D1, aplicada como M2 |
| suma `#194 R1` | req:R19 `+ 26, // #208 R19` y sufijo `(enmendado por #208 R19)` | el `it` termina en `+ 5 - 2, // #220 R16`; título ya con `(enmendado por #220 R16)`; el delta se añade detrás | `grep -n "#194 R1" providers/__tests__/language-provider.test.tsx` | igual |
| claves nuevas libres | req:R19: 26 claves nuevas | `'vaccineCreate.` → 0; `health.addVaccine`, `health.vaccinesEmptyBody`, `health.vaccineReminderFailed`, `health.createReminderNow` → 0 cada una | `grep -cF "'vaccineCreate." i18n/catalog.ts`; `grep -cF "'<clave>':" i18n/catalog.ts` | igual |
| `CTA_ROWS` | req:R21: + 2 filas de cuatro elementos `[path, literalId(…), classes, keeps]` | tupla de cuatro elementos en las 18 filas (l.49-68); `literalId` y `ctaFiles` (l.81) existen | lectura de `__tests__/chunky-cta-canvas-fidelity.test.ts` | igual |
| `#177 R3.3` | req:R21: `[...primaryIds, 'reminders-add-link', 'vaccines-add'].sort()` | base `[...primaryIds, 'reminders-add-link'].sort()` (l.127) | `grep -n "reminders-add-link'\].sort()" __tests__/chunky-cta-canvas-fidelity.test.ts` | igual |
| `#177 R6.2` | req:R21: deltas `+1`, `+2`, `+3`, `+2` sobre las cuatro cuentas | las cuatro líneas existen (l.167-170); ninguna la tocó #220 (DateField usa `Label.Text text-sm`, sin `text-17` ni `Button.Label`) | `sed -n 167,170p` | igual |
| `#177 R7.2` | req:R21: `rounded-xl bg-accent` de `{ 'screens/reminders/index.tsx': 1 }` a `+ 'screens/health/index.tsx': 1` | `{ 'screens/reminders/index.tsx': 1 }` (l.182) | `sed -n 182p` | igual |
| `#177 R7.3` `radii` | req:R21: Salud `1 + 1`, nueva `'screens/vaccine-create/index.tsx': 1` | `'screens/health/index.tsx': 1, // #199 R14` (l.96); Salud hoy tiene 1 `rounded-16` | `sed -n 96p`; `grep -oE '\brounded-16\b' screens/health/index.tsx \| wc -l` → 1 | igual |
| `#177 R7.3` suma | no citada | mismo `it`, l.186: `count(/\brounded-16\b/g)` = `26 + 1 + … + 1`; los dos `rounded-16` nuevos la mueven `+ 1 + 1` | `sed -n 186p` | igual (regla mecánica de R21; ver «Candados no listados») |
| `#177 R7.4` | req:R21: Salud y la pantalla nueva entran en `consumers` vía `ctaFiles` | Salud no usa hoy `useChunkyLip` (0); `consumers` = `ctaFiles` + 6 fijos (l.82) | `grep -c useChunkyLip screens/health/index.tsx` → 0 | igual |
| `#177 R7.5` | req:R21: `style={chunkyLip.primaryCompact}` gana `'screens/health/index.tsx': 1`; los chips (`style={selected ? … : undefined}`) no cuentan | `{ 'screens/food/index.tsx': 1, 'screens/reminders/index.tsx': 1 }` (l.195); la regex exige `style=\{chunkyLip\.primaryCompact\}` literal; `chunkyLip\.primary\b` no casa con `primaryCompact` | `sed -n 193,196p` | igual |
| `#177 R8.1` | req:R21: fila `primaryCompact` a `['reminders-add-link', 'vaccines-add']` | `['primaryCompact', ['reminders-add-link']]` (l.201) | `sed -n 201p` | igual |
| `rounded-16 bg-accent` total | req:R21: `+ 1 + 1 // #208 R21` | `toHaveLength(16 + 1 + 1 + 1)` (l.103) | `grep -n "toHaveLength(16 + 1 + 1 + 1)" __tests__/consistency-classnames.test.ts` | igual |
| `primaryRadius` | req:R21: `toHaveLength(1 + 1)` | `expect(primaryRadius).toHaveLength(1); // #177 R10` (l.102) | `sed -n 102p` | igual |
| `#62 R14` Salud | req:R21: Salud `+ 2` | `[join('screens', 'health', 'index.tsx'), 2 + 1 + 1 + 1]` (l.264) | `grep -n "'health', 'index.tsx'), 2 + 1 + 1 + 1" __tests__/consistency-classnames.test.ts` | igual |
| `#62 R14` entrada nueva | req:R21: `[join('screens', 'vaccine-create', 'index.tsx'), 7]` | `directUses` ganó `[join('components', 'date-field.tsx'), 1], // #220 R4` (l.255). Los `style={CONTINUOUS_CORNER}` de las dos fechas viven en `date-field.tsx`, no en la pantalla, y los siete de R9-R17 no incluyen fechas | lectura l.253-264; `components/date-field.tsx` l.76 | igual |
| `#62 R14` suma | no citada | l.325: `directUses.reduce(…, 2)` = `33 + 1 + … + 2 + …`; las entradas de #208 la mueven `+ 2 + 7` | `sed -n 318,330p` | igual (regla mecánica) |
| `#62 R15` / `#69 R10` | req:R21: nueva entrada `[…'vaccine-create'…, 1]`; suma `#69 R10` `+ 1` | Salud `2 + 1` (l.362); la suma `14 + 4 + 1 + … + 1` (l.381-383) sin cambios de #220 | `sed -n 351,383p` | igual |
| inventario «diecisiete primarios» | no citado | `consistency-classnames` l.610-611: `inventory(/rounded-16 bg-accent…/)` igual a un mapa cerrado `expected`, y `rounded-xl bg-accent` = `{ 'screens/reminders/index.tsx': 1 }`; los dos necesitan las entradas de Salud y de la pantalla nueva | `sed -n 590,612p` | igual (regla mecánica) |
| `requestsAccent` | req:R21: grep-clean «`useThemeColors` con el token `'accent'`» | lista `['components/date-field.tsx', 'components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts']` (#220 R6); la regex pide `'accent'` con comilla de cierre: `'accent-strong'` y `'accent-foreground'` no casan | `grep -n requestsAccent __tests__/legibility-classnames.test.ts` | igual |
| `inkSites` / `// #199 R14` | req:R16: Salud sigue en 0 `text-accent-strong` y 0 `text-warning-strong` | `inkSites` (l.155) sin Salud; `warningSites` con `// #199 R14: Salud sale del inventario` (l.211) | `grep -n "inkSites\|#199 R14" __tests__/legibility-classnames.test.ts` | igual |
| `PAIRING_STYLE_ESCAPES` | req:R21: el test nuevo de design-drift lo aplica | `const PAIRING_STYLE_ESCAPES = new RegExp(` (l.152) | `grep -n PAIRING_STYLE_ESCAPES __tests__/design-drift.test.ts` | igual |
| `toHaveLength` del Stack protegido | req:R4: los cuatro ganan `+ 1` | cuatro (l.384, 410, 455, 487), base 14 hijos | ver §3 | igual |

### Candados no listados (regla mecánica de R21)

R21 ya trae la regla: «IF otro inventario cerrado falla **solo** por nodos que esta
spec exige, THEN la enmienda añade `+ N // #208 R21`…». Estos tres candados no
están en la lista, pero los mueven nodos que la spec exige. Ninguno es nuevo por
#220 y no los convierto en enmiendas. Los dejo medidos para el handoff:

- `chunky-cta-canvas-fidelity` `#177 R7.3`, suma de `rounded-16`: `+ 1 + 1`.
- `consistency-classnames` `#62 R14`, suma de `directUses`: `+ 2 + 7`.
- `consistency-classnames`, «diecisiete primarios»: el mapa `expected` gana
  `'screens/health/index.tsx': 1` y `'screens/vaccine-create/index.tsx': 1`, y el
  inventario `rounded-xl bg-accent` gana `'screens/health/index.tsx': 1`.

## 3. Otras anclas

| ancla | valor en la spec (fichero:sección) | valor medido en a315a6af | comando | veredicto |
|---|---|---|---|---|
| `listVaccines` | req:R1 → 1 | 1 | `grep -cF 'export async function listVaccines' api/health-records.ts` | igual |
| `createWeight` | req:R1 → 1 | 1 | `grep -cF 'export async function createWeight' api/health-records.ts` | igual |
| `interface Vaccine ` | req:R1 → 1 | 1 | `grep -cF 'export interface Vaccine ' api/types.ts` | igual |
| `healthKeys.vaccines` | req:R1 → 1 | 1 | `grep -cF "vaccines: (petId: string) => ['health', 'vaccines', petId] as const," api/query-keys.ts` | igual |
| `validateWeight` | req:R3 → 1 | 1 | `grep -cF 'export function validateWeight' utils/form-rules.ts` | igual |
| `meals-history` en `_layout` | req:R4 → 1 | 1 | `grep -cF '<Stack.Screen name="meals-history" options={{ headerShown: false }} />' app/_layout.tsx` | igual |
| `useLocalSearchParams` en docs-upload | req:R4 → 1 | 1 | `grep -cF 'useLocalSearchParams<{ petId: string }>()' 'app/pets/[petId]/docs-upload.tsx'` | igual |
| `vaccines-title` | req:R5 → 1 | 1 | `grep -cF 'testID="vaccines-title"' screens/health/index.tsx` | igual |
| `listPets` en Salud | req:R5 → 1 | 1 | `grep -cF 'queryFn: () => listPets(' screens/health/index.tsx` | igual |
| receta compacta en reminders | req:R5 → 1 | 1 | `grep -cF 'className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}' screens/reminders/index.tsx` | igual |
| `vaccines-empty` | req:R6 → 1 | 1 | `grep -cF 'testID="vaccines-empty"' screens/health/index.tsx` | igual |
| `health.noVaccinesYet` en catálogo | req:R6 → 2 | 2 | `grep -cF "'health.noVaccinesYet':" i18n/catalog.ts` | igual |
| `combineDateAndTime` | req:R15 → 1 | 1 | `grep -cF 'export function combineDateAndTime' utils/reminder-dates.ts` | igual |
| `createReminder` | req:R15 → 1 | 1 | `grep -cF 'export async function createReminder' api/reminders.ts` | igual |
| `useSyncExternalStore(` | req:R16 → 1 | 1 | `grep -cF 'useSyncExternalStore(' hooks/use-push-registration.ts` | igual |
| paleta ámbar | req:R16 → 1 | 1 | `grep -cF "amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' }," utils/category-palette.ts` | igual |
| `text-warning-strong` en Salud | req:R16 → 0 | 0 | `grep -cF 'text-warning-strong' screens/health/index.tsx` | igual |
| `text-accent-strong` en Salud | req:R16 → 0 | 0 | `grep -cF 'text-accent-strong' screens/health/index.tsx` | igual |
| `shadows.toast` en weight-log | req:R16 → 1 | 1 | `grep -cF 'shadows.toast' screens/weight-log/index.tsx` | igual |
| paleta rosa | req:R17 → 1 | 1 | `grep -cF "rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' }," utils/category-palette.ts` | igual |
| `validation.checkDetails` | req:R18 → 2 | 2 | `grep -cF "'validation.checkDetails':" i18n/catalog.ts` | igual |
| `E2E_SETUP_CMD` (antes) | req:R22 → 1 | 1 | desde la raíz: `grep -cF 'E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"' init.config.sh` | igual |
| `seed:vaccines` | req:R22 → 1 | 1 | desde la raíz: `grep -cF '"seed:vaccines":' backend-pet-tracker/package.json` | igual |
| e2e del catálogo | req:Evidencia → 1 | 1 | desde la raíz: `grep -cF "describe('R3: GET /v1/vaccine-catalog'" backend-pet-tracker/test/health-vaccines.e2e-spec.ts` | igual |
| semilla con `boosterMonths: 12` | req:Evidencia → 7 | 7 | desde la raíz: `grep -cF 'boosterMonths: 12' backend-pet-tracker/src/db/seed/vaccine-catalog.ts` | igual |
| mock reicon de Salud | req:R5: hoy `Check`, `ChevronRight`, `Clock`, `HeartPulse`, `Syringe`, con `icon(…)` | idéntico (l.77-91), helper `icon(testID)` | lectura de `screens/health/index.test.tsx` | igual |
| `#199 R15` primer hijo | req:R5: `elementChild(vaccines-section, 0).props.testID === 'vaccines-title'` | l.1263, literal | `grep -n "elementChild(screen.getByTestId('vaccines-section'), 0)" screens/health/index.test.tsx` | igual |
| `it` existentes de R6 | req:R6: `shows the vaccines empty state`, `shows and retries a $kind vaccine error`, `#199 R19 sin vacunas pinta el aviso…`; `makePet` | l.443, l.458, l.1409; `makePet` l.119 con `name: 'Luna'` | `grep -n` de los tres títulos y `function makePet` | igual |
| clase de `vaccines-empty` | req:R6 `text-15 leading-body text-muted` | igual (l.159) | `grep -n 'testID="vaccines-empty"' screens/health/index.tsx` | igual |
| colores de Salud | req:R16 `amber`; R21 «Salud amplía su llamada» | `useThemeColors(['warning','muted','category-rose-strong','category-amber-strong','category-green-strong'])` → `amber` es `category-amber-strong` | `sed -n 52,54p screens/health/index.tsx` | igual |
| orden de rutas protegidas | req:R4: tras `meals-history`; los cuatro `toHaveLength` | grupo protegido de 14 hijos; `meals-history` índice 12, `edit-profile` 13. Cuatro `toHaveLength` (l.384, 410, 455, 487), base 14 cada uno. `#194 R4: edit-profile es la última` usa `.at(-1)` y sigue verde con la inserción | `grep -cE 'expect\(children\)\.toHaveLength\((8\|9\|10\|11) \+' app/__tests__/layout.test.tsx` → 4 | igual |
| `#149 R3` | req:R4: `it.each` gana `'/pets/pet-1/vaccines/new'` | `describe('#149 R3: cerrar sesión en un detalle aterriza en welcome'` l.164, `it.each([` l.167 | `grep -n "#149 R3" app/__tests__/detail-stack.guard.test.tsx` | igual |
| iconos reicon | req:R5 `Plus`, R11 `InfoCircle`, R12 `Bell`/`BellOff`, R17 `AlertTriangle`, Salud `Syringe` | los seis se exportan desde `reicon-react-native/index.d.ts` (`export { BellOff } from './icons/BellOff.js'`, etc.) | `grep -cE "\b<Icono>\b" node_modules/reicon-react-native/index.d.ts` → 1 cada uno | igual |
| mock reicon de Salud gana `Plus` y `BellOff` | req:R5 | hoy no los tiene (5 iconos, ver arriba); es el cambio que pide la spec | lectura l.77-91 | igual |
| `TOUCH_SLOP` | req:R8 «de `theme/touch-target`, como `type-chip` de `add-reminder`» | `export const TOUCH_SLOP` en `theme/touch-target.ts` l.15; `testID={`type-chip-${reminderType}`}` con `hitSlop={TOUCH_SLOP}` (add-reminder l.166-167) | `grep -rn "export const TOUCH_SLOP" theme`; `grep -n "hitSlop={TOUCH_SLOP}" screens/add-reminder/index.tsx` | igual |
| `CONTINUOUS_CORNER`, `TABULAR_NUMS` | req:R6, R9 | `theme/native-styles.ts` l.9 y l.12 | `grep -rnE "export const (CONTINUOUS_CORNER\|TABULAR_NUMS)" theme` | igual |
| `chunkyLip.primary` / `.primaryCompact` | req:R5, R6, R8 | claves de `ChunkyLip` en `theme/chunky-lip.ts` l.6, 22-23 | `grep -n "primaryCompact\|primary:" theme/chunky-lip.ts` | igual |
| `useShadows` / `shadows.toast` | req:R16 | `export function useShadows(): Shadows` (`theme/shadows.ts` l.12) con `toast`; weight-log lo importa de `'../../theme/shadows'` | `grep -n "useShadows\|toast" theme/shadows.ts` | igual |
| `ScreenHeader` | req:R7 `<ScreenHeader testID="vaccine-create-header" size={24} backFallback="/health" title={…} />` | props `testID: string`, `title?`, `size?: 24 \| 26`, `backFallback`; pinta `${testID}-back` y `${testID}-title` | `grep -nE "testID\|title\?\|size\?\|backFallback" components/screen-header.tsx` | igual |
| `Skeleton` | req:R8 tres `Skeleton` `h-9.5 w-28 rounded-full` | de `heroui-native` (Salud: `import { Button, Skeleton } from 'heroui-native'`) | `grep -n Skeleton screens/health/index.tsx` | igual |
| `Checkbox` | req:R12 | `Checkbox` de `heroui-native` en `screens/register/index.tsx` l.7, l.265 | `grep -n Checkbox screens/register/index.tsx` | igual |
| patrón `getMe` / `userKeys.me()` | req:R10 | weight-log: `import { getMe } from '../../api/users'` (l.24), `queryKey: userKeys.me()` (l.99), `const profileTimeZone =` (l.102) | `grep -nE "getMe\|userKeys\.me\(\)\|profileTimeZone =" screens/weight-log/index.tsx` | igual |
| `KeyboardAvoidingView` | req:R7 (KAV de las pantallas de formulario) | lo usan register, add-pet, pairing, add-reminder, weight-log | `grep -rln KeyboardAvoidingView screens` | igual |
| arnés `@expo/ui` de add-reminder | req:R10 | `jest.mock('@expo/ui', …)` l.66 y `jest.mock('@expo/ui/community/datetime-picker', …)` l.85 (`MockDateTimePicker` pasa los props a un `View`). add-reminder usa 3 `DateField` con `pickerTestID="date-picker"`/`"time-picker"`; la pantalla nueva usa el valor por defecto `${testID}-picker` | `grep -nE "@expo/ui\|pickerTestID" screens/add-reminder/index.test.tsx screens/add-reminder/index.tsx` | igual |
| `process.getBuiltinModule('process').env.TZ` | req:R2 | precedente en `screens/add-reminder/index.test.tsx`, `screens/meal-schedule/index.test.tsx`, `utils/alert-sections.test.ts` | `grep -rln getBuiltinModule .` | igual |
| `init-e2e-gate.test.mjs` | req:R22, en la raíz | existe; lee `E2E_SETUP_CMD` (2 apariciones) | desde la raíz: `ls init-e2e-gate.test.mjs && grep -c E2E_SETUP_CMD init-e2e-gate.test.mjs` | igual |

## Base de tests

**Corrida completa.** Antes de lanzarla, `pgrep -c -f '[i]nit\.sh'` dio `0`.

- Comando: `cd /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker && bunx jest --silent > ../progress/base-208.log 2>&1; echo $?`
- Código de salida: `1`.
- `Test Suites: 7 failed, 150 passed, 157 total`
- `Tests:       7 failed, 5463 passed, 5470 total`
- `Snapshots:   1 passed, 1 total`
- `Time:        859.16 s`
- Log: `progress/base-208.log`.

La máquina iba cargada. Al terminar seguían vivos 5 procesos `jest` de otras
sesiones (`pgrep -c -f '[j]est'` → 5). El log muestra 10 `Exceeded timeout` y un
worker muerto por `SIGKILL` («A jest worker process (pid=472952) was terminated by
another process: signal=SIGKILL»), que tumbó la carga de una suite.

Suites rojas:

- `src/screens/food/index.test.tsx`: `#200 R9: pulsar cada enlace navega como hoy (meal-schedule-link)`. Es el flake conocido de Nutrición #200.
- `src/screens/health/index.test.tsx` (suite que #208 modifica):
  - `#199 R18 variación -0.2 …`
  - `#199 R18 variación 0 …`
  - Los dos por timeout de 5000 ms.
- `src/screens/weight-log/index.test.tsx`: `#199 R3 con registros el scroll ordena …`, por timeout de 5000 ms.
- `src/components/__tests__/pet-hero-header.test.tsx`: `#195 R14 con reduce motion …`, por timeout.
- `src/screens/docs-upload-form/index.test.tsx`: «Test suite failed to run», el SIGKILL.
- `src/components/__tests__/floating-tab-bar.test.tsx`: `#206 R7 en Perfil la pestaña activa …`, por timeout.
- `src/components/__tests__/celebration.test.tsx`: `#171 R6 R6.6 a los 13830 ms …`, por timeout de 60000 ms (la suite tardó 429 s).

**Rerun único de las siete suites.** Antes, `pgrep -c -f '[i]nit\.sh'` dio `0`.

- Comando: `bunx jest --silent src/screens/food/index.test.tsx src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/screens/docs-upload-form/index.test.tsx src/components/__tests__/floating-tab-bar.test.tsx src/components/__tests__/celebration.test.tsx > ../progress/base-208-rerun.log 2>&1`
- Código de salida: `0`.
- `Test Suites: 7 passed, 7 total`
- `Tests:       583 passed, 583 total`
- Log: `progress/base-208-rerun.log`.

Lectura:

- La base de `a315a6af` es verde salvo carga: los siete rojos son timeouts y un
  SIGKILL bajo jest concurrente, y en el rerun aislado pasan todos.
- Aviso de método: un verde en la segunda corrida no absuelve por sí solo, porque
  jest repite el rojo primero.
- No los persigo, por instrucción. Si el reviewer ve alguno de nuevo sin carga,
  hay que tratarlo como deuda.
- Para comparar después: 157 suites y 5470 tests en `a315a6af`.

## Enmiendas aplicadas

Hay dos enmiendas en `specs/mobile-vaccine-create/requirements.md`:

- Los textos de R18 y R20 se cambiaron en su sitio.
- La sección `## Enmiendas tras el merge de #220 (2026-10-26)` va al final, con
  la casilla `- [ ] Enmiendas M1–M2 aprobadas (fecha: ____)`.
- `status: approved` se mantiene.
- M1 no toca `design.md`, `tasks.md` ni `traceability.md`: ninguno cita el
  observable de `isInvalid`.
- M2 toca `tasks.md` (§R20) y `traceability.md` (fila R20). `design.md` nombra
  `R19_VACCINE_CREATE` sin dar cifra, así que no cambia.

- **M1 — R18.**
  - Antes: «`vaccine-create-applied` lleva `isInvalid`».
  - Ahora: `vaccine-create-applied-value` lleva `android:border-danger` entre las
    clases de `props.className`.
  - Motivo: DateField pone el `testID` en el `Pressable` disparador, que no recibe
    `isInvalid`. La prop va a `InputGroup.Input` (`${testID}-value`), que es lo que
    observa el test de #220 `#220 R5: borde de error para isInvalid=%s`.
  - Afecta a: `#208 R18: un 400 de appliedAt pinta el error de campo traducido`.
  - R10 (`isInvalid={Boolean(fieldErrors.appliedAt)}`) no cambia.

- **M2 — R20 (D1, opción (a)).**
  - Antes: `R19_VACCINE_CREATE` tenía 30 filas, entre ellas
    `health.noVaccinesYet`.
  - Ahora: tiene **29** filas, 5 de Salud, y su candado es `toHaveLength(29)`.
    `R5_HEALTH` gana una segunda fila `health.noVaccinesYet` `// #208 R20`.
    Su `it` `#186 R7` lleva el sufijo `(enmendado por #208 R20)`, y su candado de
    longitud suma `+ 1 // #208 R20`.
  - Ancla: `grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1); // #220 R16' __tests__/ui-language.test.ts`
    da 1 antes y 0 después.
  - Motivo: `checkUses` cuenta exacto por bloque, ver D1.
  - Afecta a: `#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código`
    y a `#186 R7`.
  - Sin cambio: `ALL_USES` y la suma de `#194 R5` siguen en +30.

## Decisiones abiertas

Ninguna. D1 se conserva abajo como registro.

### D1 — ¿En qué bloque va la segunda fila de `health.noVaccinesYet`? (R20, anterior al merge de #220) — DECIDIDA

**El leader la decidió por la opción (a). Está aplicada como M2 (2026-10-26).**

Hechos:

- R6 conserva `vaccines-empty`, que ya pinta `t('health.noVaccinesYet')`
  (`screens/health/index.tsx` l.160). Ese uso tiene su fila en `R5_HEALTH`
  (`__tests__/ui-copy-table.ts` l.170).
- La tarjeta vacía del owner añade un segundo `t('health.noVaccinesYet')`. R20 le
  pone su fila en `R19_VACCINE_CREATE`.
- `checkUses` es exacto **por bloque**: por cada par `file+key` compara cuántas
  filas tiene el bloque con cuántos usos tiene el fichero. Con dos usos en el
  fichero, `checkUses(R5_HEALTH)` (`#186 R7`) espera 1 y encuentra 2. El
  `checkUses(R19_VACCINE_CREATE)` nuevo también espera 1 y encuentra 2.
- Los dos fallan. Ninguno cumple la condición de la regla mecánica de R21
  («no borra ni afloja ninguna aserción»): cualquier arreglo cambia el número de
  filas de R20 o de otro bloque.

Opciones que se plantearon:

- **(a) Recomendada.** `R5_HEALTH` gana una segunda fila `health.noVaccinesYet`
  `// #208 R20`, y su `it` suma `(enmendado por #208 R20)`. `R19_VACCINE_CREATE`
  queda en **29** filas, 5 de ellas de Salud.
  - El candado de longitud de `R5_HEALTH` (`__tests__/ui-language.test.ts` l.139,
    hoy `toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1)`, el último
    término `// #220 R16`) gana `+ 1 // #208 R20`.
  - Cambia R20: «30» pasa a «29» en el texto y en `toHaveLength(30)`, y la viñeta
    de Salud pierde `health.noVaccinesYet`.
  - Mantiene la regla «una fila por cada `t()` nuevo» sin duplicar la clave entre
    bloques.
  - `ALL_USES` y la suma de `#194 R5` no cambian frente a lo firmado: siguen
    siendo +30 filas en total.
- **(b)** `R19_VACCINE_CREATE` lleva dos filas `health.noVaccinesYet` (31 filas en
  total) y `R5_HEALTH` pierde la suya.
  - Mueve una fila que ya existe fuera del bloque de #186.
  - Toca el recuento de `R5_HEALTH`: el candado de l.139 gana `- 1 // #208 R20`.

Con M2 aplicada, R20 queda listo para el handoff en cuanto se aprueben las
enmiendas M1–M2.
