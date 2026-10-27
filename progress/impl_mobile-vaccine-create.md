# Informe de implementación — mobile-vaccine-create

Fechas: 2026-10-26 a 2026-10-27 UTC. Rama: `feature/208-mobile-vaccine-create`. H0: `2eb28ef5`.

Implementación **R1–R22 verificada**, con M3 aplicada y firmada. Resultado final: **5638 tests / 159 suites verdes**, node:test **16/16**, typecheck verde y lint con log vacío. T0: **5548/157**; los +78 son casos ausentes en la medición antigua, y el delta propio de #208 es +90. Sin init.sh, fetch, merge, rebase, push ni PR. El smoke del humano sigue pendiente y la feature no se marca done.

## Arranque

Se confirmó `/home/claude/sites/Pet-Tracker-wt-208` y `feature/208-mobile-vaccine-create` con el comando literal del handoff. Desviación de invocación: antes de leer el handoff se ejecutó `pwd && rg --files ...`, y lecturas de contexto; por tanto el comando literal de confirmación no fue el primer comando de toda la sesión. No se ejecutó `./init.sh`, fetch, merge ni rebase. Árbol inicial limpio. La feature figura spec_ready y la spec tiene aprobación; su status lo gestiona el leader.

## Anclas T0

```text
$ grep -cF 'export function DateField' components/date-field.tsx
1
Esperado: 1; OK

$ grep -cF 'export function isoToLocalDate' utils/civil-date.ts
1
Esperado: 1; OK

$ grep -cF 'export function localDateToIso' utils/civil-date.ts
1
Esperado: 1; OK

$ grep -cF 'export function hhmmToLocalDate' utils/civil-date.ts
1
Esperado: 1; OK

$ grep -cF 'export async function listVaccines' api/health-records.ts
1
Esperado: 1; OK

$ grep -cF 'export async function createWeight' api/health-records.ts
1
Esperado: 1; OK

$ grep -cF 'export interface Vaccine ' api/types.ts
1
Esperado: 1; OK

$ grep -cF "vaccines: (petId: string) => ['health', 'vaccines', petId] as const," api/query-keys.ts
1
Esperado: 1; OK

$ grep -cF 'export function validateWeight' utils/form-rules.ts
1
Esperado: 1; OK

$ ls utils/form-rules.test.ts utils/__tests__/form-rules.test.ts 2>&1 | grep -c 'No such file'
1
Esperado: 1; OK

$ grep -cF '<Stack.Screen name="meals-history" options={{ headerShown: false }} />' app/_layout.tsx
1
Esperado: 1; OK

$ grep -cF 'testID="vaccines-title"' screens/health/index.tsx
1
Esperado: 1; OK

$ grep -cF 'testID="vaccines-empty"' screens/health/index.tsx
1
Esperado: 1; OK

$ grep -cF 'queryFn: () => listPets(' screens/health/index.tsx
1
Esperado: 1; OK

$ grep -cF "t('health.noVaccinesYet')" screens/health/index.tsx
1
Esperado: 1; OK

$ grep -oE '\brounded-16\b' screens/health/index.tsx | wc -l
1
Esperado: 1; OK

$ grep -c useChunkyLip screens/health/index.tsx
0
Esperado: 0; OK

$ grep -cF 'text-warning-strong' screens/health/index.tsx
0
Esperado: 0; OK

$ grep -cF 'text-accent-strong' screens/health/index.tsx
0
Esperado: 0; OK

$ grep -cF 'className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}' screens/reminders/index.tsx
1
Esperado: 1; OK

$ grep -cF "'health.noVaccinesYet':" i18n/catalog.ts
2
Esperado: 2; OK

$ grep -cF "'validation.checkDetails':" i18n/catalog.ts
2
Esperado: 2; OK

$ grep -cF "'vaccineCreate." i18n/catalog.ts
0
Esperado: 0; OK

$ grep -cF 'export function combineDateAndTime' utils/reminder-dates.ts
1
Esperado: 1; OK

$ grep -cF 'export async function createReminder' api/reminders.ts
1
Esperado: 1; OK

$ grep -cF 'useSyncExternalStore(' hooks/use-push-registration.ts
1
Esperado: 1; OK

$ grep -cF 'shadows.toast' screens/weight-log/index.tsx
1
Esperado: 1; OK

$ grep -cF "amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' }," utils/category-palette.ts
1
Esperado: 1; OK

$ grep -cF "rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' }," utils/category-palette.ts
1
Esperado: 1; OK

$ grep -cF 'export const R18_DATE_FIELD' __tests__/ui-copy-table.ts
1
Esperado: 1; OK

$ grep -cF 'R19_' __tests__/ui-copy-table.ts
0
Esperado: 0; OK

$ grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1); // #220 R16' __tests__/ui-language.test.ts
1
Esperado: 1; OK

$ grep -cF "reminders-add-link'].sort()" __tests__/chunky-cta-canvas-fidelity.test.ts
1
Esperado: 1; OK

$ grep -cF "toHaveLength(16 + 1 + 1 + 1)" __tests__/consistency-classnames.test.ts
1
Esperado: 1; OK

$ grep -cF "[join('screens', 'health', 'index.tsx'), 2 + 1 + 1 + 1]" __tests__/consistency-classnames.test.ts
1
Esperado: 1; OK

$ grep -cE 'expect\(children\)\.toHaveLength\((8|9|10|11) \+' app/__tests__/layout.test.tsx
4
Esperado: 4; OK

$ grep -cF "describe('#149 R3: cerrar sesión en un detalle aterriza en welcome'" app/__tests__/detail-stack.guard.test.tsx
1
Esperado: 1; OK

$ ls utils/vaccine-dates.ts hooks/vaccine-reminder-notice.ts screens/vaccine-create 'app/pets/[petId]/vaccines' 2>&1 | grep -c 'No such file'
4
Esperado: 4; OK

$ test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts
Esperado: sin-router-d-ts; OK

$ grep -cF 'E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"' init.config.sh
1
Esperado: 1; OK

$ grep -cF '"seed:vaccines":' backend-pet-tracker/package.json
1
Esperado: 1; OK
```

### Anclas adicionales (antes de editar)

```text
$ grep -cF 'useLocalSearchParams<{ petId: string }>()' 'app/pets/[petId]/docs-upload.tsx'
1
$ grep -cF "toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })" components/date-field.tsx
1
$ grep -cF ')).toBe(1); // #177 R10' __tests__/consistency-classnames.test.ts
1
$ grep -cF "it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban" __tests__/consistency-classnames.test.ts
1
$ grep -cF '+ 1 - 1 - 2 // #220 R4; #220 R14; #220 R15' __tests__/consistency-classnames.test.ts
2
```

Skills cargadas: ponytail, appllama-app-design-skill, building-native-ui, native-data-fetching, expo-ui-swift-ui, expo-ui-jetpack-compose, expo-tailwind-setup. Las cinco skills de Expo estaban en el caché openai-curated/expo/11c74d6b. No existen en el catálogo expo-overview, expo-animation, expo-router ni expo-design-system; no se buscaron, como ordena el handoff. Sin MCP Appllama ni simulador; smoke del humano. Docs de Expo SDK 57 consultadas: https://docs.expo.dev/versions/v57.0.0/.

## Ejecución

T0 usado inicialmente: 157 suites, 5470 tests. Corregido a **5548** por el leader en M3; las cuentas de esta sección son históricas. La tabla corregida está en «Reanudación con M3 firmada» y la cuenta final al cierre.

R1: cinco `it` preparados. La primera ejecución espera a que las dos guardas pgrep queden vacías; se detectaron Jest de #217 y #219, y después Jest y un init de otros worktrees. Ninguno iniciado por esta sesión.

Error de invocación sin cambios: una lectura usó `utils/civil-today.ts` (no existe); corregida a `utils/civil-today-iso.ts`. No afecta a Jest, tipos ni lint.

### R1 — rojo

- `c97735d4 test(mobile): #208 R1 cover vaccine API clients (rojo)`.
- `Tests:       5 failed, 33 passed, 38 total` (`progress/test-208-r1-red.log`). Los cinco fallan por `expect(typeof …).toBe('function')`, sin excepción de import o helper.
- Cuenta encadenada: 5470 + 5 = 5475 tests (157 suites).
- Implementación local escrita; pendiente de ejecutar verde porque vuelve a haber Jest ajeno.

- Verde: `Tests:       38 passed, 38 total` (test-208-r1-green.log).
- Sondas R1: ruta `/vaccines-catalog`, `Tests:       1 failed, 37 passed, 38 total`; 400 → error, misma cuenta. Ambas revertidas, y se repitió verde 38/38. Logs mutation-208-r1-route.log y mutation-208-r1-validation.log.

### R2

- Rojo `bcf8e2ec`, fallo por import ausente permitido: `Tests:       0 total`. 18 filas nuevas.
- Verde: `Tests:       18 passed, 18 total`. Cuenta encadenada: 5475 + 18 = 5493; suites 158.
- Sonda sin recorte: `Tests:       12 failed, 6 passed, 18 total`. Sonda getters locales: `Tests:       9 failed, 9 passed, 18 total`, exactamente las nueve filas TZ. Revertidas; verde final 18/18.

### R3

- `ffc725aa` rojo: `Tests:       3 failed, 93 passed, 96 total`, por aserción de export. Verde: `Tests:       96 passed, 96 total`.
- Sonda sin trim: `Tests:       1 failed, 95 passed, 96 total`; rompe espacios. Revertida y 96/96 verde.
- Cuenta encadenada: 5493 + 3 = 5496, suites 158.

### R4

- `b099429d` rojo: `Tests:       6 failed, 50 passed, 56 total`; ruta ausente da import roto, excepción prevista. Los cuatro grupos, el orden y la fila de navegación fallan por aserción.
- Verde: `Tests:       57 passed, 57 total` en tres suites.
- Sonda Stack.Screen al final: `Tests:       2 failed, 32 passed, 34 total`; fallan orden y edit-profile al final. Revertida, verde 57/57.
- Cuenta encadenada: 5496 + 3 = 5499; suites 159. (Un it de ruta, uno de layout y una fila nueva de detalle.)

### R19

- `f4b65cf3` rojo: `Tests:       1 failed, 53 passed, 54 total` (longitud esperada 484, base 458). Verde `3031c6b4`: `Tests:       54 passed, 54 total`.
- Retirar `vaccineCreate.vaccine` de en: `Tests:       1 failed, 53 passed, 54 total`. Revertida; 54/54 verde.
- Sin nuevos it: cuenta encadenada 5499 (159 suites).
- Enmienda de inventario #194 R1: 458 → 484 claves por idioma, +26.

### R5 — rojo y adelantos

- `cf1fef1e` rojo: `Tests:       5 failed, 111 passed, 116 total`, cuatro tests nuevos y el enmendado #199 R15, todos por aserción.
- Con producción, Salud queda verde 116/116; las dos suites de inventario tienen nueve rojos esperados. Agregado `Tests:       9 failed, 266 passed, 275 total` (test-208-r5-inventory.log).
- Adelantos R21 para R5: chunky R3.3 añade vaccines-add; R6.2 `<Button.Label` 14→15 (+1), `Button.Label` 40→42 (+2); R7.2 mapa compacto añade Salud:1; R7.4 consumers añade Salud mientras no hay CTA_ROWS de Salud; R7.5 mapa primaryCompact añade Salud:1; R8.1 primaryCompact añade vaccines-add. Consistency #62 R1 primaryRadius 1→2, #98 R10 rounded-xl bg-accent 1→2, #166 R2 mapa compacto añade Salud:1. Todos con sufijo #208 R21.
- Cuenta encadenada: 5499 + 4 = 5503 (159 suites); enmiendas no añaden filas it.each.

- R5 verde final: `Tests:       275 passed, 275 total` (3 suites, Salud + dos inventarios). Mutación todos los roles: `Tests:       3 failed, 111 skipped, 2 passed, 116 total`; fallan los tres roles. Revertida; verde 275/275.

### R6

- `75d1b82e` rojo: `Tests:       2 failed, 119 passed, 121 total`; los dos tests de owner fallan por aserción. Tres filas #208 R6 (family, walker, vet) nacen verdes y se demuestran con la sonda family.
- Con tarjeta, Salud 121/121. Rojo inventarios/copy: `Tests:       13 failed, 299 passed, 312 total` (test-208-r6-inventory.log).
- Adelantos R21: CTA_ROWS 18→19 (+fila vaccines-empty-action), dos filas it.each nuevas; consumers Salud pasa de entrada explícita a derivada por CTA_ROWS (mismo inventario). R6.2 text-17 +2 y Text primario +1; radii Salud 1→2 y total rounded-16 42→43; primary solid total 19→20; directUses Salud 5→7, y agregados #62 R14 y #98 R10 +2; mapa solid #166 R2 añade Salud:1. Sufijos en los it modificados.
- Adelanto M2/R20: R5_HEALTH 49→50 con segunda fila health.noVaccinesYet; #186 R7 suma sufijo. El candado global de ALL_USES vuelve verde por esas mismas filas, sin cambiarlo.
- Verde cuatro suites: `Tests:       314 passed, 314 total`.
- Cuenta encadenada: 5503 + 5 de Salud + 2 filas de CTA_ROWS = 5510 (159 suites).

## Registro histórico — parada en R6, resuelta por M3

No está completada la feature. No se crea `.done`, no se hace commit feat de R6 y no se actualiza traceability.md (solo puede tocarse en el commit final). El HEAD es el commit rojo de R6 `75d1b82e`; su implementación local y adelantos quedan sin commit.

La corrida prescrita antes del feat de R6 terminó con exit=1:

```text
Test Suites: 2 failed, 157 passed, 159 total
Tests:       3 failed, 5585 passed, 5588 total
Snapshots:   1 passed, 1 total
Time:        198.14 s
```

Log completo: `progress/full-208-r6.log`. Sin flakes por timeout ni red de carga; tres diferencias deterministas de inventario. El aviso de worker force-exit es preexistente.

### Motivo obligatorio de parada

El handoff dice: «Si está fuera de la lista cerrada (p. ej. legibility-classnames), PARA».

`mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts:47` no pertenece a la lista cerrada. Falla `#173 R2: inventario de radios nuevos / reserva rounded-tile a sus consumidores aprobados (enmendado por #190 R13)`. Espera seis ficheros; ahora hay siete porque R6 exige `rounded-tile` en `screens/health/index.tsx`. El archivo no se ha tocado. Se necesita que el leader amplíe la lista cerrada antes de continuar.

Cambio concreto pendiente para el leader: autorizar una entrada `'screens/health/index.tsx'` en ese inventario, con su sufijo `(enmendado por #208 R21)`, y considerar la entrada de `screens/vaccine-create/index.tsx` cuando R11/R12/R17 introduzcan sus rounded-tile. No se modifica la receta exigida por R6 para eludir la guarda.

Otros dos rojos, dentro del alcance, que quedan documentados sin editar tras detectar el bloqueo:

- `design-drift.test.ts:1120`, #178 R13: el mapa rounded16 exige Salud:1 y encuentra Salud:2. Ajuste mecánico pendiente: Salud `1 + 1 // #208 R21` y sufijo de título. Cuando R14 exista también necesitará la entrada de vaccine-create:1.
- `design-drift.test.ts:1234`, #179 R13: inventario de ficheros con text-17 no contiene Salud. Ajuste pendiente: entrada de Salud y sufijo #208 R21; el alta también usará text-17 cuando se implemente.

### Diferencia de cuenta de T0

La cuenta encadenada nominal entregada arriba es 5510, pero la corrida completa registra 5588: diferencia +78. No se cambia T0 para ocultarla. La base aceptada del leader tenía una suite que no cargó por SIGKILL (`screens/docs-upload-form/index.test.tsx`), según progress/enmiendas_mobile-vaccine-create.md; podría explicar casos ausentes en el total inicial, pero esa atribución no está validada. Queda como segunda cifra a reconciliar por el leader. No se repite T0 (prohibido por el handoff).

### Verificaciones y pendientes

- Mutación R6 family: `Tests:       5 failed, 112 skipped, 4 passed, 121 total`, revertida antes de la corrida completa. La suite Salud pasa en la corrida completa.
- forms-validation-global y legibility-classnames pasan en la corrida completa, sin tocarlas.
- Diff de los archivos protegidos desde H0 vacío: package.json, bun.lock, theme/, DateField, civil-date, reminder-dates, init.sh y backend/.
- No se ejecutó `./init.sh`, fetch, merge, rebase, push, PR, e2e ni despliegue. No hay dependencias ni cambios de .env.
- No se ejecutaron todavía typecheck, lint, node --test del gate R22, grep-clean final ni graphify: son cierre pendiente, la implementación se detuvo en R6.
- No se modificaron STATUS.md, feature_list.json, progress/current.md, history.md, handoffs, docs ni la casilla de smoke.

## Registro histórico — commits hasta la parada de R6

```text
c97735d4 test(mobile): #208 R1 cover vaccine API clients (rojo)
eec55299 feat(mobile): #208 R1 add vaccine catalog and creation clients
bcf8e2ec test(mobile): #208 R2 cover calendar month arithmetic (rojo)
2d5ba60e feat(mobile): #208 R2 add timezone independent calendar month helper
ffc725aa test(mobile): #208 R3 cover free vaccine name validation (rojo)
f1e431e6 feat(mobile): #208 R3 validate free vaccine names
b099429d test(mobile): #208 R4 cover vaccine route and protected stack order (rojo)
25742076 feat(mobile): #208 R4 register protected vaccine creation route
f4b65cf3 test(mobile): #208 R19 extend bilingual catalog inventory (rojo)
3031c6b4 feat(mobile): #208 R19 add vaccine flow translations
cf1fef1e test(mobile): #208 R5 cover owner vaccine creation entry point (rojo)
261d52da feat(mobile): #208 R5 show vaccine creation action for owners
75d1b82e test(mobile): #208 R6 cover owner empty vaccine card (rojo)
```

## Registro histórico — matriz al detenerse en R6

| R | Test | Rojo | Verde | Estado |
|---|---|---|---|---|
| R1 | api/__tests__/health-records.test.ts (5 it) | c97735d4 | eec55299 | Verde, dos mutaciones |
| R2 | utils/__tests__/vaccine-dates.test.ts (18 filas) | bcf8e2ec | 2d5ba60e | Verde, dos mutaciones |
| R3 | utils/form-rules.test.ts (3 it) | ffc725aa | f1e431e6 | Verde, mutación trim |
| R4 | layout, detail-stack.guard, vaccine-create/index.test | b099429d | 25742076 | Verde, mutación orden |
| R5 | screens/health/index.test.tsx (4 filas) | cf1fef1e | 261d52da | Verde, mutación roles; adelantos R21 |
| R6 | screens/health/index.test.tsx (5 filas) | 75d1b82e | — | Local 314/314; full bloqueado por inventario fuera de lista |
| R7–R18 | Sin tests nuevos todavía | — | — | Pendiente |
| R19 | providers/__tests__/language-provider.test.tsx | f4b65cf3 | 3031c6b4 | Verde, mutación clave en en |
| R20 | Adelanto M2 en ui-copy-table y ui-language | — | — | Falta bloque de 29 y mutación |
| R21 | Adelantos de inventarios en R5 y locales R6 | — | — | Faltan guarda nueva, mutaciones y resto de inventarios |
| R22 | Sin cambios todavía | — | — | Pendiente |

## Registro histórico — ficheros hasta la parada de R6

```text
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/health-records.test.ts
mobile-pet-tracker/src/api/health-records.ts
mobile-pet-tracker/src/api/query-keys.ts
mobile-pet-tracker/src/api/types.ts
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx
mobile-pet-tracker/src/screens/vaccine-create/index.tsx
mobile-pet-tracker/src/utils/__tests__/vaccine-dates.test.ts
mobile-pet-tracker/src/utils/form-rules.test.ts
mobile-pet-tracker/src/utils/form-rules.ts
mobile-pet-tracker/src/utils/vaccine-dates.ts
progress/impl_mobile-vaccine-create.md (nuevo, reporte no commiteado)
```

Todos pertenecen a la lista cerrada. El fichero que exige ampliar esa lista permanece intacto. Estado al detenerse:

```text
 M mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
 M mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
 M mobile-pet-tracker/src/__tests__/ui-copy-table.ts
 M mobile-pet-tracker/src/__tests__/ui-language.test.ts
 M mobile-pet-tracker/src/screens/health/index.tsx
?? progress/impl_mobile-vaccine-create.md
```

## Smoke pendiente del humano

No se marca ni se declara realizado:

- Picker nativo de aplicación y próxima dosis.
- Teclado con KeyboardAvoidingView sobre notas.
- Recordatorio creado a las 09:00 locales.
- «Agregar vacuna» solo para owner.
- Tarjeta vacía con CTA.
- Aviso ámbar y «Crear ahora».
- Alerta rosa sin red.

## Reanudación con M3 firmada

Autorizada por el usuario. Spec 92aa1d92, firma 31ccd3bb, handoff 92bd50e6. Se retoman exactamente los cambios locales de R6, sin fetch/merge/rebase/init. Los bloqueos previos quedan resueltos por M3.

T0 corregida por el leader: **5548 tests en 157 suites**. La suite docs-upload-form que murió por SIGKILL aporta los 78 casos ausentes. Reconciliación: 5470 + 78 = 5548; 5548 + 40 = 5588, exactamente la corrida completa local de R6. La diferencia deja de estar abierta.

Cuenta encadenada corregida (las cifras anteriores quedan como registro histórico):

| Paso | Delta | Total | Suites |
|---|---:|---:|---:|
| T0 | — | 5548 | 157 |
| R1 | +5 | 5553 | 157 |
| R2 | +18 | 5571 | 158 |
| R3 | +3 | 5574 | 158 |
| R4 | +3 | 5577 | 159 |
| R19 | 0 | 5577 | 159 |
| R5 | +4 | 5581 | 159 |
| R6 | +5 Salud, +2 CTA_ROWS | 5588 | 159 |

### M3 / R6 — anclas antes

```text
$ grep -cF "'screens/health/index.tsx', // #208 R21" __tests__/profile-canvas-fidelity.test.ts
0
$ grep -cF "'screens/health/index.tsx': 1, // #199 R14" __tests__/design-drift.test.ts
1
$ grep -cF "'screens/health/index.tsx': 1 + 1, // #199 R14; #208 R21" __tests__/design-drift.test.ts
0
$ grep -cF "'screens/health/index.tsx', // #208 R21" __tests__/design-drift.test.ts
0
```

### M3 / R6 — anclas después

```text
$ grep -cF "'screens/health/index.tsx', // #208 R21" __tests__/profile-canvas-fidelity.test.ts
1
$ grep -cF "'screens/health/index.tsx': 1, // #199 R14" __tests__/design-drift.test.ts
0
$ grep -cF "'screens/health/index.tsx': 1 + 1, // #199 R14; #208 R21" __tests__/design-drift.test.ts
1
$ grep -cF "'screens/health/index.tsx', // #208 R21" __tests__/design-drift.test.ts
1
```

M3 adelantada a R6: #173 R2 lista 6→7, #178 R13 Salud 1→2, #179 R13 lista text-17 20→21. Títulos con sufijo #208 R21.

R6 con M3: corrida completa `Tests:       1 failed, 5587 passed, 5588 total`, 159 suites. Único rojo: flake conocido #200 R10 food-links (Expected 200, Received undefined). Rerun aislado de Nutrición: `Tests:       122 passed, 122 total` (full-208-r6-m3-rerun.log), sin cambios. Inventarios y alcance en verde; se cierra R6. No se repite el resto por instrucción de flakes. La mutación family ya quedó probada y revertida antes de ambas corridas completas.

### R7

Rojo inicial a36818fb: `Tests:       2 failed, 1 passed, 3 total` (nodos ausentes). Durante el verde se detectó un error del arnés: RNTL 14 no expone UNSAFE_getByType. Se corrigió con getByTestId y padres/hijos host, como los tests existentes; KAV se ancla por su tag y behavior en fuente. La lectura inicial de tipos en build/render.d.ts no existía; se consultaron los tipos instalados de test-renderer. No se cambia producción para acomodar el arnés.

El commit adicional de test se prueba con la mutación de producción paddingHorizontal 21: rojo por valor esperado 20, sin excepción. La mutación no se commitea. Se revierte y se verifica verde. Delta R7: +2 casos; cuenta 5588 + 2 = 5590 (159 suites).

R7 verde final: `Tests:       3 passed, 3 total`. Sonda spacing: `Tests:       1 failed, 2 passed, 3 total`, revertida.

### R8

Rojo: `Tests:       4 failed, 3 passed, 7 total`. Verde: `Tests:       89 passed, 89 total` (pantalla + chunky). Sonda preseleccionar segunda entrada: `Tests:       1 failed, 6 passed, 7 total`; revertida, verde 89/89. Adelanto R21 #177 R7.4: consumers gana vaccine-create explícitamente hasta que CTA_ROWS lo derive en R14, sin tocar otros inventarios. Cuenta: 5590 + 4 = 5594 (159 suites).

### M3 R9 antes

```text
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/alerts-canvas-fidelity.test.ts
0
$ grep -cF 'expect(textInputs).toHaveLength(6);' __tests__/consistency-classnames.test.ts
1
$ grep -cF 'expect(withPlaceholder).toHaveLength(5);' __tests__/consistency-classnames.test.ts
1
```


### M3 R9 después

```text
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/alerts-canvas-fidelity.test.ts
1
$ grep -cF 'expect(textInputs).toHaveLength(6);' __tests__/consistency-classnames.test.ts
0
$ grep -cF 'expect(textInputs).toHaveLength(6 + 1); // #208 R21' __tests__/consistency-classnames.test.ts
1
$ grep -cF 'expect(withPlaceholder).toHaveLength(5);' __tests__/consistency-classnames.test.ts
1
```


### R9

Rojo: `Tests:       2 failed, 8 passed, 10 total`. La ausencia con catálogo nació verde; sonda pintar el nombre también con catálogo: `Tests:       1 failed, 9 passed, 10 total`. Revertida; verde `Tests:       118 passed, 118 total` en pantalla + alerts-canvas + consistency. Adelantos R21: directUses alta 0→1 y ambos agregados +2+1; counters alta 0→1 y #69 R10 +1 (dos filas it.each nuevas). M3 B2 text-15 23→24, B3a inputs 6→7, placeholders conserva 5. Cuenta: 5594 + 3 + 2 = 5599 (159 suites).

### R10

Rojo `Tests:       6 failed, 10 passed, 16 total`; verde `Tests:       16 passed, 16 total`. Mutación omitir reset al cambiar chip: `Tests:       1 failed, 15 passed, 16 total`; revertida y verde 16/16. El reloj se captura en inicializador lazy de useState y se pasa a civilTodayIso: sin new Date ni Date.now durante render. Se consumen DateField/civil-date sin modificarlos. Cuenta: 5599 + 6 = 5605 (159 suites).

### M3 R11 antes

```text
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/profile-canvas-fidelity.test.ts
0
```


### M3 R11 después

```text
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/profile-canvas-fidelity.test.ts
2
```


### R11

Rojo `Tests:       2 failed, 16 passed, 18 total`; verde `Tests:       125 passed, 125 total` (pantalla, profile-canvas y consistency). Sonda invertir ramas de la nota: `Tests:       2 failed, 16 passed, 18 total`; revertida y verde 125/125. Adelantos: directUses alta 1→2 y dos agregados +2+2; M3 rounded-tile 7→8 ficheros y text-13 añade alta; ancla compartida 0→2. Cuenta: 5605 + 2 = 5607 (159 suites).

### R12

Rojo `Tests:       3 failed, 18 passed, 21 total`; verde `Tests:       102 passed, 102 total`. Sonda recordatorio desmarcado por defecto: `Tests:       2 failed, 19 passed, 21 total`; revertida y verde 102/102. DirectUses alta 2→3, agregados +2+3. Cuenta 5607 + 3 = 5610 (159 suites).

### M3 R13 antes

```text
$ grep -cF 'expect(textInputs).toHaveLength(6 + 1); // #208 R21' __tests__/consistency-classnames.test.ts
1
$ grep -cF 'expect(withPlaceholder).toHaveLength(5);' __tests__/consistency-classnames.test.ts
1
$ grep -cF 'expect(textInputs).toHaveLength(6 + 1 + 3); // #208 R21' __tests__/consistency-classnames.test.ts
0
$ grep -cF 'expect(withPlaceholder).toHaveLength(5 + 3); // #208 R21' __tests__/consistency-classnames.test.ts
0
```


### M3 R13 después

```text
$ grep -cF 'expect(textInputs).toHaveLength(6 + 1); // #208 R21' __tests__/consistency-classnames.test.ts
0
$ grep -cF 'expect(withPlaceholder).toHaveLength(5);' __tests__/consistency-classnames.test.ts
0
$ grep -cF 'expect(textInputs).toHaveLength(6 + 1 + 3); // #208 R21' __tests__/consistency-classnames.test.ts
1
$ grep -cF 'expect(withPlaceholder).toHaveLength(5 + 3); // #208 R21' __tests__/consistency-classnames.test.ts
1
```


### R13

Rojo `Tests:       1 failed, 21 passed, 22 total`; verde `Tests:       103 passed, 103 total`. Sonda límite de notas 1999: `Tests:       1 failed, 21 passed, 22 total`; revertida y verde 103/103. M3 inputs 7→10, placeholders 5→8; directUses alta 3→6, agregados +2+6. Cuenta: 5610 + 1 = 5611 (159 suites).

### M3 R14 antes

```text
$ grep -cF "'screens/vaccine-create/index.tsx': 1, // #208 R21" __tests__/design-drift.test.ts
0
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/design-drift.test.ts
0
```


### M3 R14 después

```text
$ grep -cF "'screens/vaccine-create/index.tsx': 1, // #208 R21" __tests__/design-drift.test.ts
1
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/design-drift.test.ts
1
```


### R14

Rojo `Tests:       4 failed, 22 passed, 26 total`; verde `Tests:       305 passed, 305 total` (4 suites). Sondas omitir nextDoseAt con catálogo y enviar notes vacío: cada una `Tests:       1 failed, 25 passed, 26 total`; revertidas y verde 305/305. M3 añade alta en rounded16 y text-17. Adelantos R21: CTA_ROWS 19→20 (+2 it.each); consumers alta ya derivada por CTA_ROWS; radii alta:1, rounded16 43→44, text-17 32→33, etiquetas Text primario +1 (acumulado +2); solid total 20→21 y mapa #166 R2 añade alta:1. Cuenta 5611 + 4 + 2 = 5617 (159 suites).

### R15

Rojo `Tests:       6 failed, 26 passed, 32 total`; verde `Tests:       32 passed, 32 total`. Ambas sondas (advanceMinutes 15, dueAt desde formulario) dan `Tests:       2 failed, 30 passed, 32 total`; revertidas y verde 32/32. Formulario fijado a 2028 mientras el 201 devuelve 2027 para distinguir ambas fuentes. DueAt esperado literal local y literal 2027-10-06T15:00:00.000Z en TZ Mexico City, nunca helper. Cada test espera al nodo posterior a router.back antes de asertar; se restauró TZ nativa en afterEach. Cuenta 5617 + 6 = 5623 (159 suites).

### M3 R16 antes

```text
$ grep -cF '${CATEGORY_SLOTS.amber.surface}' screens/health/index.tsx
1
$ grep -cF '${CATEGORY_SLOTS.amber.ink}' screens/health/index.tsx
3
$ grep -cE '(bg|text)-category-' screens/health/index.tsx
0
$ grep -cE '(bg|text)-category-' screens/vaccine-create/index.tsx
0
```


### M3 R16 después

```text
$ grep -cF '${CATEGORY_SLOTS.amber.surface}' screens/health/index.tsx
2
$ grep -cF '${CATEGORY_SLOTS.amber.ink}' screens/health/index.tsx
4
$ grep -cE '(bg|text)-category-' screens/health/index.tsx
0
$ grep -cE '(bg|text)-category-' screens/vaccine-create/index.tsx
0
```


### R16

Rojo `Tests:       5 failed, 153 passed, 158 total`, por aserción de presencia del módulo aún inexistente. El arnés usa existsSync para no convertir el rojo en import roto; una vez presente, requiere el módulo real y observa su hook mediante un Probe. Los beforeEach de ambas suites llaman a clearVaccineReminderNotice (delegado al módulo real). Ningún mock reemplaza el almacén.

Verde `Tests:       158 passed, 158 total`. Sonda no mostrar aviso al fallar recordatorio: `Tests:       1 failed, 33 passed, 34 total`. Sonda mostrar aviso de cualquier petId: `Tests:       2 failed, 122 passed, 124 total` (el aviso se adelanta a la resolución de la mascota y también aparece para otra mascota). Ambas revertidas. M3: amber.surface Salud 1→2, amber.ink 3→4; cero clases categóricas literales en ambos screens. Sin otros inventarios movidos. Cuenta: 5623 + 5 = 5628 (159 suites).

R16 cierre (continuación UTC 2026-10-27): `Tests:       5628 passed, 5628 total`, `Test Suites: 159 passed, 159 total`, exit=0 en full-208-r16.log. Sin flakes. Se confirma la cuenta corregida y que todos los candados de inventario siguen verdes.

### M3 R17 antes

```text
$ grep -cF '${CATEGORY_SLOTS.rose.surface}' screens/vaccine-create/index.tsx
0
$ grep -cF "import { CATEGORY_SLOTS } from '../../utils/category-palette';" screens/vaccine-create/index.tsx
0
$ grep -cE '(bg|text)-category-' screens/health/index.tsx
0
$ grep -cE '(bg|text)-category-' screens/vaccine-create/index.tsx
0
$ grep -cF "expect(inventory.files).toEqual([join('utils', 'category-palette.ts')]);" __tests__/consistency-classnames.test.ts
1
$ grep -cF 'style={CONTINUOUS_CORNER}' screens/vaccine-create/index.tsx
6
```


### M3 R17 después

```text
$ grep -cF '${CATEGORY_SLOTS.rose.surface}' screens/vaccine-create/index.tsx
1
$ grep -cF "import { CATEGORY_SLOTS } from '../../utils/category-palette';" screens/vaccine-create/index.tsx
1
$ grep -cE '(bg|text)-category-' screens/health/index.tsx
0
$ grep -cE '(bg|text)-category-' screens/vaccine-create/index.tsx
0
$ grep -cF "expect(inventory.files).toEqual([join('utils', 'category-palette.ts')]);" __tests__/consistency-classnames.test.ts
1
$ grep -cF 'style={CONTINUOUS_CORNER}' screens/vaccine-create/index.tsx
7
```


### R17

Rojo `Tests:       6 failed, 34 passed, 40 total`; verde `Tests:       121 passed, 121 total`. Sonda navegar tras error: `Tests:       6 failed, 34 passed, 40 total`; revertida y verde 121/121. Cinco kind cubiertos y reintento con señal de navegación visible. M3 rose.surface e import CATEGORY_SLOTS 0→1; cero clases categóricas literales, #64 R9 intacto. DirectUses alta 6→7 y agregados finales +2+7. Cuenta: 5628 + 6 = 5634 (159 suites).

### R18

Rojo `Tests:       2 failed, 40 passed, 42 total`; verde `Tests:       42 passed, 42 total`. Sonda pintar errors[0].message: `Tests:       1 failed, 41 passed, 42 total`; revertida y verde 42/42. Se aplica M1 al nodo vaccine-create-applied-value con android:border-danger. Cuenta 5634 + 2 = 5636 (159 suites).

### R10 — corrección del mismo contrato tras R18

La revisión encontró que pulsar el chip ya seleccionado borraba la fecha manual, aunque R10 la conserva hasta el siguiente **cambio** de chip. Se amplió el it existente (sin nuevos casos) y se dejó un par TDD adicional, por ese mismo R-id: rojo `Tests:       1 failed, 41 passed, 42 total` (esperado 12 ene 2028, recibido 6 oct 2027), guard `if (id === selectedId) return`, verde `Tests:       42 passed, 42 total`. Se documenta esta corrección fuera de la secuencia inicial; no cambia la spec, las cuentas, ni inventarios. La sonda original de R10 sigue cubriendo el cambio a un chip diferente.

### R20 — inventarios de copy

Filas ALL_USES medidas en la tabla normativa: H0 608, tras M2 609, final 638; delta desde H0 +30, en R20 +29. Ficheros únicos 37→38. R19_VACCINE_CREATE contiene 29 filas; la segunda health.noVaccinesYet sigue en R5_HEALTH (adelanto M2 de R6), sin duplicarla.

R20 nació verde: `Tests:       35 passed, 35 total`. Mutación de producción añadir un t(vaccineCreate.title) sin fila: `Tests:       2 failed, 33 passed, 35 total`; caen el chequeo global y #208 R20. Se commitea solo el test, nunca la sonda; al revertir no queda cambio de producción. El feat de R20 se omite como permite tasks.md. Los sufijos de ambos #194 R5 y SCREEN_FILES +1 entran en el commit rojo; #186 R7/M2 ya venía del adelanto de R6. Cuenta 5636 + 1 = 5637 (159 suites).

R20 cierre: `Tests:       5637 passed, 5637 total`, 159 suites, exit=0 en full-208-r20.log. Sin flakes. La implementación ya cumplía todos los usos: sin commit feat.

### M3 R14 — anclas antes del nuevo guard R21

```text
$ grep -cF "'screens/vaccine-create/index.tsx': 1, // #208 R21" __tests__/design-drift.test.ts
1
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/design-drift.test.ts
1
```


### R21 — referencia adicional del listado de su guard (no es otro consumidor de text-17)

```text
$ grep -cF "'screens/vaccine-create/index.tsx', // #208 R21" __tests__/design-drift.test.ts
2
```


### R21

El it nuevo nació verde: `Tests:       333 passed, 333 total` en los cinco ficheros de inventario. Sonda text-accent desnudo: `Tests:       1 failed, 114 passed, 115 total`. Sonda comentario #208 sin R: `Tests:       1 failed, 114 passed, 115 total`. Ambas caen por el it nuevo, se revierten y no se commitean. Todos los inventarios de R21, M2 y M3 ya se habían adelantado al feat que creó cada nodo; no hay deriva real por corregir ni commit feat de R21. La referencia adicional del listado del propio guard explica el grep 1→2 de la ruta en design-drift, sin otro consumidor de text-17. Cuenta 5637 + 1 = 5638 (159 suites).

R21 cierre: `Tests:       5638 passed, 5638 total`, `Test Suites: 159 passed, 159 total` en full-208-r21.log. Jest avisa de un worker terminado a la fuerza por teardown; ninguna aserción falla.

### R22

Ancla E2E_SETUP_CMD original: 1 línea exacta antes, sustituida por 1 línea exacta con `db:migrate && seed:vaccines && provision:local` después. Rojo real por aserción de seed ausente: 15 pasan, 1 falla / 16. Verde: 16/16, 9 suites de node:test. Sonda mover seed después de provision: 15 pasan, 1 falla / 16; revertida, verde 16/16. No se ejecutó el setup, init.sh, ni recursos compartidos: node:test usa fixtures y lee la configuración. Jest sigue en 5638/159.

Incidencia de herramienta al retomar R21: el session_id ya había expirado al consultarlo; se leyó el log completo final, con 159 suites y 5638 tests verdes. Sin cambios de código por ello.

## Verificación final — grep-clean

Ámbito de cada comando: cuatro ficheros nuevos de producción.

```text
$ rg -n -U --pcre2 -i '#(?!\d{2,3} R\d)[\da-f]{3,8}\b' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i '[A-Za-z0-9_-]+-\[[^\]]+\]' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i 'StyleSheet\.create' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i '\btext-accent\b(?!-)|\btext-warning(?:-strong)?\b' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i 'useThemeColors\([\s\S]*?\[[^\]]*['"'"'\"]accent['"'"'\"]' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i '#208(?! R\d)' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i 'shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n -U --pcre2 -i '\p{Extended_Pictographic}' 'mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx' mobile-pet-tracker/src/screens/vaccine-create/index.tsx mobile-pet-tracker/src/utils/vaccine-dates.ts mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
(salida vacía)
exit=1
$ rg -n text-warning-strong mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/vaccine-create/index.tsx
(salida vacía)
exit=1
$ rg -n text-accent-strong mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/vaccine-create/index.tsx
(salida vacía)
exit=1
$ rg -n '(bg|text)-category-' mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/vaccine-create/index.tsx
(salida vacía)
exit=1
```

## Cierre consolidado — cuenta y matriz R → test → commits

T0 normativo: **5548 tests en 157 suites**. Delta total: **+90 tests y +2 suites**, total esperado **5638/159**. Los +78 de docs-upload-form ya pertenecen a T0; no se atribuyen a #208. R10 tiene además una corrección TDD sin nuevo caso. R22 añade un caso de node:test, fuera del total Jest.

Rutas relativas a mobile-pet-tracker/src salvo indicación. Cada caso nuevo nombra `#208 R<n>`; los tests anteriores enmendados conservan el nombre y añaden su sufijo. Los nombres y mensajes de commit completos están también en traceability.md.

| R | Tests | Commit test | Commit feat | Δ Jest | Total / suites |
|---|---|---|---|---:|---|
| R1 | `api/__tests__/health-records.test.ts` | `c97735d4` | `eec55299` | +5 | 5553/157 |
| R2 | `utils/__tests__/vaccine-dates.test.ts` | `bcf8e2ec` | `2d5ba60e` | +18 | 5571/158 |
| R3 | `utils/form-rules.test.ts` | `ffc725aa` | `f1e431e6` | +3 | 5574/158 |
| R4 | `app/__tests__/layout.test.tsx; app/__tests__/detail-stack.guard.test.tsx; screens/vaccine-create/index.test.tsx` | `b099429d` | `25742076` | +3 | 5577/159 |
| R19 | `providers/__tests__/language-provider.test.tsx` | `f4b65cf3` | `3031c6b4` | +0 | 5577/159 |
| R5 | `screens/health/index.test.tsx` | `cf1fef1e` | `261d52da` | +4 | 5581/159 |
| R6 | `screens/health/index.test.tsx + CTA_ROWS` | `75d1b82e` | `549c07f1` | +7 | 5588/159 |
| R7 | `screens/vaccine-create/index.test.tsx` | `a36818fb + b3a8f461` | `bb24921b` | +2 | 5590/159 |
| R8 | `screens/vaccine-create/index.test.tsx` | `31fbb693` | `f0d571ed` | +4 | 5594/159 |
| R9 | `screens/vaccine-create/index.test.tsx + inventarios` | `9e9cfb2c` | `afecc4e2` | +5 | 5599/159 |
| R10 | `screens/vaccine-create/index.test.tsx` | `ce8b0145 + 69325d34` | `2c546a6c + 7e700588` | +6 | 5605/159 |
| R11 | `screens/vaccine-create/index.test.tsx` | `ae08a786` | `12bfdac5` | +2 | 5607/159 |
| R12 | `screens/vaccine-create/index.test.tsx` | `cb0f250f` | `c49f94e7` | +3 | 5610/159 |
| R13 | `screens/vaccine-create/index.test.tsx` | `cdcd1b13` | `cd5af88a` | +1 | 5611/159 |
| R14 | `screens/vaccine-create/index.test.tsx + CTA_ROWS` | `e952ce3c` | `f2f6d9fd` | +6 | 5617/159 |
| R15 | `screens/vaccine-create/index.test.tsx` | `f55fb799` | `b91873e8` | +6 | 5623/159 |
| R16 | `screens/vaccine-create/index.test.tsx; screens/health/index.test.tsx` | `e725a74e` | `84ff896d` | +5 | 5628/159 |
| R17 | `screens/vaccine-create/index.test.tsx` | `4681d45e` | `2e15f422` | +6 | 5634/159 |
| R18 | `screens/vaccine-create/index.test.tsx` | `3337460c` | `280e98b8` | +2 | 5636/159 |
| R20 | `__tests__/ui-language.test.ts` | `be57c2e9` | `omitido, nació verde` | +1 | 5637/159 |
| R21 | `__tests__/design-drift.test.ts` | `9affc533` | `omitido, nació verde` | +1 | 5638/159 |
| R22 | `init-e2e-gate.test.mjs (raíz)` | `74329316` | `4b4ec798` | +0 | 5638/159 |

### Líneas Tests: por paso

Estas son las líneas finales de los logs de cada paso (el número de tests ejecutados depende del conjunto de suites del paso; la cuenta global está arriba). R2/R4 rojo por import ausente es la excepción aprobada; los demás rojos son por aserción. R20/R21 nacieron verdes y se probaron con las mutaciones listadas.

| Paso | Log rojo | Log verde |
|---|---|---|
| R1 | `test-208-r1-red.log`: Tests:       5 failed, 33 passed, 38 total | `test-208-r1-green.log`: Tests:       38 passed, 38 total |
| R2 | `test-208-r2-red.log`: Tests:       0 total | `test-208-r2-green.log`: Tests:       18 passed, 18 total |
| R3 | `test-208-r3-red.log`: Tests:       3 failed, 93 passed, 96 total | `test-208-r3-green.log`: Tests:       96 passed, 96 total |
| R4 | `test-208-r4-red.log`: Tests:       6 failed, 50 passed, 56 total | `test-208-r4-green.log`: Tests:       57 passed, 57 total |
| R19 | `test-208-r19-red.log`: Tests:       1 failed, 53 passed, 54 total | `test-208-r19-green.log`: Tests:       54 passed, 54 total |
| R5 | `test-208-r5-red.log`: Tests:       5 failed, 111 passed, 116 total | `test-208-r5-green.log`: Tests:       275 passed, 275 total |
| R6 | `test-208-r6-red.log`: Tests:       2 failed, 119 passed, 121 total | `test-208-r6-green.log`: Tests:       314 passed, 314 total |
| R7 | `test-208-r7-red.log`: Tests:       2 failed, 1 passed, 3 total | `test-208-r7-green.log`: Tests:       3 passed, 3 total |
| R8 | `test-208-r8-red.log`: Tests:       4 failed, 3 passed, 7 total | `test-208-r8-green.log`: Tests:       89 passed, 89 total |
| R9 | `test-208-r9-red.log`: Tests:       2 failed, 8 passed, 10 total | `test-208-r9-green.log`: Tests:       118 passed, 118 total |
| R10 | `test-208-r10-red.log`: Tests:       6 failed, 10 passed, 16 total | `test-208-r10-green.log`: Tests:       16 passed, 16 total |
| R11 | `test-208-r11-red.log`: Tests:       2 failed, 16 passed, 18 total | `test-208-r11-green.log`: Tests:       125 passed, 125 total |
| R12 | `test-208-r12-red.log`: Tests:       3 failed, 18 passed, 21 total | `test-208-r12-green.log`: Tests:       102 passed, 102 total |
| R13 | `test-208-r13-red.log`: Tests:       1 failed, 21 passed, 22 total | `test-208-r13-green.log`: Tests:       103 passed, 103 total |
| R14 | `test-208-r14-red.log`: Tests:       4 failed, 22 passed, 26 total | `test-208-r14-green.log`: Tests:       305 passed, 305 total |
| R15 | `test-208-r15-red.log`: Tests:       6 failed, 26 passed, 32 total | `test-208-r15-green.log`: Tests:       32 passed, 32 total |
| R16 | `test-208-r16-red.log`: Tests:       5 failed, 153 passed, 158 total | `test-208-r16-green.log`: Tests:       158 passed, 158 total |
| R17 | `test-208-r17-red.log`: Tests:       6 failed, 34 passed, 40 total | `test-208-r17-green.log`: Tests:       121 passed, 121 total |
| R18 | `test-208-r18-red.log`: Tests:       2 failed, 40 passed, 42 total | `test-208-r18-green.log`: Tests:       42 passed, 42 total |
| R20 | `test-208-r20-green-first.log`: Tests:       35 passed, 35 total | `full-208-r20.log`: Tests:       5637 passed, 5637 total |
| R21 | `test-208-r21-green-first.log`: Tests:       333 passed, 333 total | `full-208-r21.log`: Tests:       5638 passed, 5638 total |
| R22 | `test-208-r22-red.log`: node:test: # tests 16, # pass 15, # fail 1 | `test-208-r22-green.log`: node:test: # tests 16, # pass 16, # fail 0 |
| R10 corrección | `test-208-r10-reselect-red.log`: Tests:       1 failed, 41 passed, 42 total | `test-208-r10-reselect-green.log`: Tests:       42 passed, 42 total |

### Commits completos

Tres entradas de M3 (92aa1d92, 31ccd3bb, 92bd50e6) son del leader. El resto son los pasos de esta implementación. El commit documental final contiene únicamente traceability.md y este informe.

```text
c97735d4 test(mobile): #208 R1 cover vaccine API clients (rojo)
eec55299 feat(mobile): #208 R1 add vaccine catalog and creation clients
bcf8e2ec test(mobile): #208 R2 cover calendar month arithmetic (rojo)
2d5ba60e feat(mobile): #208 R2 add timezone independent calendar month helper
ffc725aa test(mobile): #208 R3 cover free vaccine name validation (rojo)
f1e431e6 feat(mobile): #208 R3 validate free vaccine names
b099429d test(mobile): #208 R4 cover vaccine route and protected stack order (rojo)
25742076 feat(mobile): #208 R4 register protected vaccine creation route
f4b65cf3 test(mobile): #208 R19 extend bilingual catalog inventory (rojo)
3031c6b4 feat(mobile): #208 R19 add vaccine flow translations
cf1fef1e test(mobile): #208 R5 cover owner vaccine creation entry point (rojo)
261d52da feat(mobile): #208 R5 show vaccine creation action for owners
75d1b82e test(mobile): #208 R6 cover owner empty vaccine card (rojo)
92aa1d92 docs(spec): #208 enmienda M3 inventarios fuera de la lista cerrada de R21
31ccd3bb chore(spec): firma delegada de la enmienda M3 de #208 (mandato del humano 2026-10-23, ampliado 2026-10-26)
92bd50e6 docs(progress): #208 handoff con la enmienda M3 y T0 corregido a 5548
549c07f1 feat(mobile): #208 R6 add owner empty vaccine card with approved M3 inventories
a36818fb test(mobile): #208 R7 cover vaccine form structure and safe areas (rojo)
b3a8f461 test(mobile): #208 R7 use supported rendered tree queries (rojo)
bb24921b feat(mobile): #208 R7 build vaccine form frame and species legend
31fbb693 test(mobile): #208 R8 cover catalog chips and fallback (rojo)
f0d571ed feat(mobile): #208 R8 load species catalog and render selectable vaccine chips
9e9cfb2c test(mobile): #208 R9 cover custom vaccine name and focus state (rojo)
afecc4e2 feat(mobile): #208 R9 add custom vaccine name field and counter
ce8b0145 test(mobile): #208 R10 cover dose date proposals and manual choices (rojo)
2c546a6c feat(mobile): #208 R10 propose and edit civil dose dates
ae08a786 test(mobile): #208 R11 cover catalog and custom schedule guidance (rojo)
12bfdac5 feat(mobile): #208 R11 explain proposed and custom vaccine schedules
cb0f250f test(mobile): #208 R12 cover reminder selection and dose hint (rojo)
c49f94e7 feat(mobile): #208 R12 enable next dose reminder by default
cdcd1b13 test(mobile): #208 R13 cover optional vaccine fields and limits (rojo)
cd5af88a feat(mobile): #208 R13 add vet clinic and notes fields
e952ce3c test(mobile): #208 R14 cover vaccine submission validation and exact bodies (rojo)
f2f6d9fd feat(mobile): #208 R14 submit validated vaccine payloads
f55fb799 test(mobile): #208 R15 cover reminder timing and post-save navigation (rojo)
b91873e8 feat(mobile): #208 R15 create local nine oclock reminders after saving
e725a74e test(mobile): #208 R16 cover persistent reminder failure notice (rojo)
84ff896d feat(mobile): #208 R16 persist reminder failure notice across navigation
4681d45e test(mobile): #208 R17 cover save failures and successful retry (rojo)
2e15f422 feat(mobile): #208 R17 preserve vaccine form on save failures
3337460c test(mobile): #208 R18 cover translated validation feedback (rojo)
280e98b8 feat(mobile): #208 R18 translate server validation without raw messages
69325d34 test(mobile): #208 R10 preserve manual dose on unchanged selection (rojo)
7e700588 feat(mobile): #208 R10 retain manual dose when chip is already selected
be57c2e9 test(mobile): #208 R20 inventory all vaccine creation copy uses (rojo)
9affc533 test(mobile): #208 R21 guard new vaccine files against style drift (rojo)
74329316 test(mobile): #208 R22 guard vaccine seed setup order (rojo)
4b4ec798 feat(mobile): #208 R22 seed vaccines before E2E provisioning
```

## Cierre consolidado — libro de inventarios R20/R21 y M3

Las medidas literales antes/después de M3 están en los apartados de cada feat. Esta tabla consolida todos los adelantos. Cada `it` modificado conserva su nombre y suma `(enmendado por #208 R21)` (copy: R20); las entradas nuevas llevan su comentario de R. No se elimina ninguna aserción.

| Fichero/candado | Antes → después | Feat que lo adelanta |
|---|---|---|
| chunky `CTA_ROWS`, R3.1/R3.2 y derivaciones | 18→19 (vaccines-empty-action)→20 (vaccine-create-submit); +2 casos por fila | R6 `549c07f1`, R14 `f2f6d9fd` |
| chunky R3.3 | primaryIds + reminders-add-link → + vaccines-add | R5 `261d52da` |
| chunky R6.2, `<Button.Label` / `Button.Label` | 14→15 / 40→42 | R5 `261d52da` |
| chunky R6.2, text-17 / Text primario | 30→32→33 / 16→17→18 | R6 `549c07f1`, R14 `f2f6d9fd` |
| chunky R7.2, mapa rounded-xl bg-accent | Recordatorios:1 → Recordatorios:1 + Salud:1 | R5 `261d52da` |
| chunky R7.3, radii | Salud 1→2, alta ausente→1; total rounded-16 42→43→44 | R6 `549c07f1`, R14 `f2f6d9fd` |
| chunky R7.4 consumers | +Salud explícita R5, derivada de CTA_ROWS R6; +alta explícita R8, derivada R14; ninguna duplicada | R5 `261d52da`, R6 `549c07f1`, R8 `f0d571ed`, R14 `f2f6d9fd` |
| chunky R7.5 primaryCompact | +Salud:1; los chips de alta son condicionales y no cuentan | R5 `261d52da` |
| chunky R8.1 primaryCompact IDs | reminders-add-link → reminders-add-link + vaccines-add | R5 `261d52da` |
| consistency rounded-16 bg-accent | 19→20→21, sumandos +1+1 | R6 `549c07f1`, R14 `f2f6d9fd` |
| consistency primaryRadius / compacto | 1→2; mapa compacto añade Salud:1 | R5 `261d52da` |
| consistency #62 R14 directUses Salud | 5→7 | R6 `549c07f1` |
| consistency #62 R14 directUses alta | 0→1→2→3→6→7 | R9 `afecc4e2`, R11 `12bfdac5`, R12 `c49f94e7`, R13 `cd5af88a`, R17 `2e15f422` |
| consistency #62 R14 y #98 R10 sumas de CONTINUOUS_CORNER | +0→+2→+2+1→+2+2→+2+3→+2+6→+2+7; mismos nueve nodos | R6, R9, R11, R12, R13, R17 (hashes anteriores) |
| consistency #98 R10 count rounded-xl bg-accent | 1→1+1 | R5 `261d52da` |
| consistency #166 R2 mapa primarios | +Salud:1 y +alta:1; mapa compacto Salud:1 + Recordatorios:1 | R6 `549c07f1`, R14 `f2f6d9fd` (compacto desde R5) |
| consistency #62 R15 counters y #69 R10 | alta ausente→1; suma +1 (dos nuevos casos parametrizados) | R9 `afecc4e2` |
| M3 consistency #62 R12 textInputs | 6→6+1→6+1+3 | R9 `afecc4e2`, R13 `cd5af88a` |
| M3 consistency #62 R12 withPlaceholder | 5→5+3 | R13 `cd5af88a` |
| M3 profile #173 R2 rounded-tile | lista 6→7 (+Salud)→8 (+alta) | R6 `549c07f1`, R11 `12bfdac5` |
| M3 profile #173 R2.4 text-13 | alta ausente→presente en su orden; ancla compartida de alta 0→2 (una en cada lista) | R11 `12bfdac5` |
| M3 alerts #174 R12 text-15 | lista 23→24, alta entre reset-password y weight-log | R9 `afecc4e2` |
| M3 design #178 R13 rounded16 | Salud 1→1+1; alta ausente→1 | R6 `549c07f1`, R14 `f2f6d9fd` |
| M3 design #179 R13 text-17 | lista 20→21 (+Salud)→22 (+alta) | R6 `549c07f1`, R14 `f2f6d9fd` |
| M3 D2 CATEGORY_SLOTS | Salud amber.surface 1→2, amber.ink 3→4; alta rose.surface e import 0→1; literales categóricos 0→0 | R16 `84ff896d`, R17 `2e15f422` |
| consistency #64 R9 | files=[utils/category-palette.ts], 1→1; **sin modificación** | ninguno |
| R20 M2 R5_HEALTH, #186 R7 | 49→50, segundo health.noVaccinesYet; sin duplicarlo en R20 | R6 `549c07f1` |
| R20 R19_VACCINE_CREATE / ALL_USES / SCREEN_FILES | bloque 0→29; ALL_USES 608→609→638 (+30 total); SCREEN_FILES 37→38; ambos #194 R5 con sufijo | R6 `549c07f1`, R20 `be57c2e9` |
| R21 guard de cuatro ficheros | 0→1 it; ancla de ruta de alta en design 1→2 por listado del guard, sin otro consumidor de text-17 | R21 `9affc533` |

El `it` hermano de borde duplicado de #62 R12 no cambió. Las clases de Salud `text-warning-strong` y `text-accent-strong` siguen en cero. `forms-validation-global` y `legibility-classnames` pasan sin cambios. No apareció otro candado fuera del inventario aprobado.

## Cierre consolidado — herramientas y alcance

- `test ! -e .expo/types/router.d.ts && bun run typecheck > ../progress/typecheck-208.log 2>&1`: exit 0; log `$ tsc --noEmit`. No se borró ni regeneró router.d.ts.
- `bunx expo lint --no-cache > ../progress/lint-208.log 2>&1 && test ! -s ../progress/lint-208.log`: exit 0; log de **0 bytes**.
- `graphify update . > progress/graphify-208.log 2>&1`: exit 0; 30293 nodos, 39017 aristas, 1961 comunidades. Actualiza graph.json, graph.html y GRAPH_REPORT.md en graphify-out (ignorados). Advertencia: 21 .sql omitidos por falta de tree_sitter_sql; sin instalar dependencias ni llamar extracción semántica/LLM.
- `git diff 2eb28ef5 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme mobile-pet-tracker/src/components/date-field.tsx mobile-pet-tracker/src/utils/civil-date.ts mobile-pet-tracker/src/utils/reminder-dates.ts init.sh backend-pet-tracker`: **salida vacía**. Los demás ficheros de producción protegidos tampoco están en el diff.
- `git diff --check`: exit 0, salida vacía.
- No init.sh, fetch, merge, rebase, push, PR, E2E, AWS real ni dependencias nuevas. Estado de feature, STATUS, progress/current/history y smoke siguen bajo el leader/humano.

Único flake de la continuación: #200 R10 de Nutrición durante R6; pasó aislado 122/122, sin tocar código. Las paradas previas y errores de invocación están conservados arriba como registro histórico. R7 tuvo un commit extra de arnés RNTL14 y R10 otro par TDD para conservar la fecha al repetir el mismo chip. R20 y R21 omiten feat según el handoff porque sus adelantos ya satisfacen las guardas; sus sondas rojas prueban los tests. El «hoy» inicial se captura en estado lazy, fuera del cálculo de render, conforme a react-hooks/purity; al guardar se vuelve a calcular en el manejador.

## Cierre consolidado — sondas de mutación

Todas se plantaron en producción, dieron rojo por aserción y se revirtieron antes del verde/commit. Ninguna sonda está en HEAD.

| Log | Resultado observado |
|---|---|
| `mutation-208-r1-route.log` | Tests:       1 failed, 37 passed, 38 total |
| `mutation-208-r1-validation.log` | Tests:       1 failed, 37 passed, 38 total |
| `mutation-208-r10-chip.log` | Tests:       1 failed, 15 passed, 16 total |
| `mutation-208-r11-note.log` | Tests:       2 failed, 16 passed, 18 total |
| `mutation-208-r12-default.log` | Tests:       2 failed, 19 passed, 21 total |
| `mutation-208-r13-limit.log` | Tests:       1 failed, 21 passed, 22 total |
| `mutation-208-r14-next.log` | Tests:       1 failed, 25 passed, 26 total |
| `mutation-208-r14-notes.log` | Tests:       1 failed, 25 passed, 26 total |
| `mutation-208-r15-advance.log` | Tests:       2 failed, 30 passed, 32 total |
| `mutation-208-r15-response.log` | Tests:       2 failed, 30 passed, 32 total |
| `mutation-208-r16-notice.log` | Tests:       1 failed, 33 passed, 34 total |
| `mutation-208-r16-pet.log` | Tests:       2 failed, 122 passed, 124 total |
| `mutation-208-r17-back.log` | Tests:       6 failed, 34 passed, 40 total |
| `mutation-208-r18-raw.log` | Tests:       1 failed, 41 passed, 42 total |
| `mutation-208-r19-key.log` | Tests:       1 failed, 53 passed, 54 total |
| `mutation-208-r2-clamp.log` | Tests:       12 failed, 6 passed, 18 total |
| `mutation-208-r2-local.log` | Tests:       9 failed, 9 passed, 18 total |
| `mutation-208-r20-copy.log` | Tests:       2 failed, 33 passed, 35 total |
| `mutation-208-r21-accent.log` | Tests:       1 failed, 114 passed, 115 total |
| `mutation-208-r21-comment.log` | Tests:       1 failed, 114 passed, 115 total |
| `mutation-208-r22-order.log` | # tests 16; # pass 15; # fail 1 |
| `mutation-208-r3-trim.log` | Tests:       1 failed, 95 passed, 96 total |
| `mutation-208-r4-order.log` | Tests:       2 failed, 32 passed, 34 total |
| `mutation-208-r5-role.log` | Tests:       3 failed, 111 skipped, 2 passed, 116 total |
| `mutation-208-r6-family.log` | Tests:       5 failed, 112 skipped, 4 passed, 121 total |
| `mutation-208-r7-spacing.log` | Tests:       1 failed, 2 passed, 3 total |
| `mutation-208-r8-selection.log` | Tests:       1 failed, 6 passed, 7 total |
| `mutation-208-r9-visibility.log` | Tests:       1 failed, 9 passed, 10 total |

## Cierre consolidado — lista de ficheros desde H0

Comando: `git diff --name-only 2eb28ef5..HEAD -- mobile-pet-tracker/ init.config.sh init-e2e-gate.test.mjs specs/`. El listado al consolidar la documentación incluye traceability.md, que entra en el commit final.

```text
init-e2e-gate.test.mjs
init.config.sh
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/health-records.test.ts
mobile-pet-tracker/src/api/health-records.ts
mobile-pet-tracker/src/api/query-keys.ts
mobile-pet-tracker/src/api/types.ts
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx
mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx
mobile-pet-tracker/src/screens/vaccine-create/index.tsx
mobile-pet-tracker/src/utils/__tests__/vaccine-dates.test.ts
mobile-pet-tracker/src/utils/form-rules.test.ts
mobile-pet-tracker/src/utils/form-rules.ts
mobile-pet-tracker/src/utils/vaccine-dates.ts
specs/mobile-vaccine-create/design.md
specs/mobile-vaccine-create/requirements.md
specs/mobile-vaccine-create/tasks.md
specs/mobile-vaccine-create/traceability.md
```

Los tres ficheros design.md, requirements.md y tasks.md son la enmienda M3 del leader (`92aa1d92`), ya presente al reanudar. No los edité. Las otras 29 rutas del listado son los 28 ficheros de implementación/tests/configuración autorizados y traceability.md. Se añade exclusivamente `progress/impl_mobile-vaccine-create.md` como informe. Los logs, graphify-out y el marcador .done están ignorados.

El único commit final previsto es `docs(mobile): #208 traceability and implementation report`, con estas dos rutas explícitas. Ningún fichero de arnés se mezcla en él. Después se verifica el árbol con la comprobación acotada del handoff.

## Resultado final

```text
$ bun run test > ../progress/final-test-208.log 2>&1
exit=0
Test Suites: 159 passed, 159 total
Tests:       5638 passed, 5638 total
Snapshots:   1 passed, 1 total
Time:        160.909 s
Ran all test suites.

$ node --test init-e2e-gate.test.mjs > progress/final-e2e-gate-208.log 2>&1
exit=0
# tests 16
# suites 9
# pass 16
# fail 0
```

La corrida final no tuvo flakes. Typecheck, lint, grep-clean y el diff de ficheros protegidos están verdes como se detalla arriba. El reporte y traceability.md consolidan los 22 requisitos, los pares TDD y cada sonda revertida. La revisión local detectó y corrigió el caso de R10 al pulsar el mismo chip; no quedan incidencias de implementación conocidas. No se realizó smoke en dispositivo: lo conserva el humano con los siete casos de la sección «Smoke pendiente del humano». No se modifica su casilla ni el estado de feature_list.json.

Tras el commit documental se ejecuta la comprobación acotada del handoff. La última acción será escribir `progress/impl_mobile-vaccine-create.done` con una sola línea: `/home/claude/sites/Pet-Tracker-wt-208/progress/impl_mobile-vaccine-create.md`. El marcador no se commitea.
